import { fetchStockQuote } from '~/lib/finnhub';
import { getRelatedStocks } from '~/stock-data';

export async function getSimilarStocks(symbol: string) {
  const relatedStocks = [];

  for await (const relatedStock of getRelatedStocks(symbol).map(
    async (relatedStock) =>
      fetchStockQuote(relatedStock.symbol).then((quote) => ({
        symbol: relatedStock.symbol,
        quote,
      }))
  )) {
    const relatedTicker = relatedStock.symbol;

    const quote = await fetchStockQuote(relatedTicker);

    if (quote) {
      relatedStocks.push({ ticker: relatedTicker, quote });
    }
  }

  return relatedStocks;
}

export type RecommendationItem = Awaited<
  ReturnType<typeof getSimilarStocks>
>[number];
