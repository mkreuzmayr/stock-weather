import { StockPage } from '~/components/stock-page';
import {
  fetchStockDetails,
  fetchStockQuote,
  StockQuote,
  StockDetails,
} from '~/lib/finnhub';
import {
  fetchLatestStockNews,
  fetchStockHistory,
  Timeframe,
} from '~/lib/polygon';
import { getRelatedStocks } from '~/stock-data';

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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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

  const recommendationsPromises = getRelatedStocks(ticker).map(
    async (relatedStock) => {
      const relatedTicker = relatedStock.symbol;

      try {
        const [details, quote] = await Promise.all([
          fetchStockDetails(relatedTicker),
          fetchStockQuote(relatedTicker),
        ]);
        if (details && quote) {
          return { ticker: relatedTicker, details, quote };
        } else {
          console.warn(
            `Could not fetch details or quote for related ticker: ${relatedTicker}`
          );
          return undefined;
        }
      } catch (error) {
        console.error(
          `Error fetching data for related ticker ${relatedTicker}:`,
          error
        );
        return undefined;
      }
    }
  );

  const resolvedRecommendations = await Promise.all(recommendationsPromises);

  const recommendationsData = resolvedRecommendations.filter(
    (item): item is RecommendationItem => item !== undefined
  );

  const sentiment = await calculateSentiment(stockQuote);

  return (
    <StockPage
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
