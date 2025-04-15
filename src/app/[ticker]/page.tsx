import { StockDisplay } from '~/components/stock-display';
import { getSentiment } from '~/data/get-sentiment';
import { fetchStockDetails, fetchStockQuote } from '~/lib/finnhub';
import { PageProps } from '~/lib/next-types';

export default async function ChartPage(
  pageProps: PageProps<{ ticker: string }>
) {
  const { ticker } = await pageProps.params;

  const [stockInfo, stockQuote] = await Promise.all([
    fetchStockDetails(ticker),
    fetchStockQuote(ticker),
  ]);

  const sentiment = await getSentiment(stockQuote);

  return (
    <StockDisplay
      price={stockQuote.currentPrice}
      change={stockQuote.change}
      changePercent={stockQuote.percentChange}
      sentiment={sentiment}
      stockInfo={stockInfo}
    />
  );
}
