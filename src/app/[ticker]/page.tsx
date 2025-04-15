import { StockPageLayout } from '~/components/stock-page-layout';
import { getSimilarStocks } from '~/data/get-similar-stocks';
import { fetchStockDetails, fetchStockQuote } from '~/lib/finnhub';
import {
  fetchLatestStockNews,
  fetchStockHistory,
  Timeframe,
} from '~/lib/polygon';
import { getSentiment } from '~/data/get-sentiment';
import { PageProps } from '~/lib/next-types';

export default async function Home(pageProps: PageProps<{ ticker: string }>) {
  const { ticker } = await pageProps.params;
  const searchParams = await pageProps.searchParams;

  const rawTimeframe = searchParams.timeframe;
  const validTimeframes: Timeframe[] = ['1D', '1W', '1M', '3M', '6M', '1Y'];
  const initialTimeframe =
    typeof rawTimeframe === 'string' &&
    validTimeframes.includes(rawTimeframe as Timeframe)
      ? (rawTimeframe as Timeframe)
      : '1D';

  const [stockInfo, stockQuote, news, initialStockHistory] = await Promise.all([
    fetchStockDetails(ticker),
    fetchStockQuote(ticker),
    fetchLatestStockNews(ticker),
    fetchStockHistory(ticker, { timeframe: initialTimeframe }),
  ]);

  const recommendationsData = await getSimilarStocks(ticker);

  const sentiment = await getSentiment(stockQuote);

  return (
    <StockPageLayout
      stockInfo={stockInfo}
      stockQuote={stockQuote}
      sentiment={sentiment}
      news={news}
      recommendations={recommendationsData}
      stockHistory={initialStockHistory}
      timeframe={initialTimeframe}
    />
  );
}
