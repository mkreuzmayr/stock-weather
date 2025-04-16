import { EnhancedStockChart } from '~/components/stock-chart';
import { getSentiment } from '~/data/get-sentiment';
import { fetchStockQuote } from '~/lib/finnhub';
import { loadingSimulator } from '~/lib/loading-simulator';
import { PageProps } from '~/lib/next-types';
import { fetchStockHistory, Timeframe } from '~/lib/polygon';

export default async function ChartPage(
  pageProps: PageProps<{ ticker: string }>
) {
  const { ticker } = await pageProps.params;
  const searchParams = await pageProps.searchParams;

  await loadingSimulator();

  const rawTimeframe = searchParams.timeframe;
  const validTimeframes: Timeframe[] = ['1D', '1W', '1M', '3M', '6M', '1Y'];
  const initialTimeframe =
    typeof rawTimeframe === 'string' &&
    validTimeframes.includes(rawTimeframe as Timeframe)
      ? (rawTimeframe as Timeframe)
      : '1Y';

  const [stockQuote, initialStockHistory] = await Promise.all([
    fetchStockQuote(ticker),
    fetchStockHistory(ticker, { timeframe: initialTimeframe }),
  ]);

  const sentiment = await getSentiment(stockQuote);

  return (
    <EnhancedStockChart
      sentiment={sentiment}
      previousClosePrice={stockQuote.previousClosePrice}
      stockHistory={initialStockHistory}
    />
  );
}
