import { StockQuote } from '~/lib/finnhub';

export type StockSentiment =
  | 'positive'
  | 'neutral'
  | 'negative'
  | 'very-negative';

export async function getSentiment(
  stockQuote: StockQuote
): Promise<StockSentiment> {
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
