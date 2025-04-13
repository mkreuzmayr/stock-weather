import { StockPage } from '~/components/stock-page';
import {
  fetchStockDetails,
  fetchStockQuote,
  StockQuote,
  StockDetails,
} from '~/lib/finnhub';
import {
  fetchLatestStockNews,
  NewsItem,
  fetchRelatedStocks,
} from '~/lib/polygon';
import { getStockBySymbol } from '~/stock-data';

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

export interface RecommendationItem {
  ticker: string;
  details: StockDetails;
  quote: StockQuote;
}

export default async function Home(pageProps: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await pageProps.params;

  const [stockInfo, stockQuote, news, relatedTickers] = await Promise.all([
    fetchStockDetails(ticker),
    fetchStockQuote(ticker),
    fetchLatestStockNews(ticker),
    fetchRelatedStocks(ticker),
  ]);

  const recommendationsData = await Promise.all(
    relatedTickers
      .slice(0, 6)
      .map(async (relatedTicker) => {
        if (!getStockBySymbol(relatedTicker)) {
          return undefined!;
        }

        const [details, quote] = await Promise.all([
          fetchStockDetails(relatedTicker),
          fetchStockQuote(relatedTicker),
        ]);

        return { ticker: relatedTicker, details, quote };
      })
      .filter((item) => item !== undefined)
  );

  const sentiment = await calculateSentiment(stockQuote);

  return (
    <StockPage
      stockInfo={stockInfo}
      stockQuote={stockQuote}
      sentiment={sentiment}
      news={news}
      recommendations={recommendationsData}
    />
  );
}
