import { StockPage } from '~/components/stock-page';
import { fetchStockDetails, fetchStockQuote, StockQuote } from '~/lib/finnhub';

type Sentiment = 'positive' | 'neutral' | 'negative' | 'very-negative';

async function calculateSentiment(stockQuote: StockQuote): Promise<Sentiment> {
  const { currentPrice, percentChange } = stockQuote;

  switch (true) {
    case currentPrice > 0 && percentChange > 0:
      return 'positive';
    case currentPrice > 0 && percentChange < -5:
      return 'very-negative';
    case currentPrice > 0 && percentChange < 0:
      return 'negative';
    default:
      return 'neutral';
  }
}

export default async function Home(pageProps: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await pageProps.params;

  const stockInfo = await fetchStockDetails(ticker);
  const stockQuote = await fetchStockQuote(ticker);
  console.log(stockQuote);

  const sentiment = await calculateSentiment(stockQuote);

  return (
    <StockPage
      stockInfo={stockInfo}
      stockQuote={stockQuote}
      sentiment={sentiment}
    />
  );
}
