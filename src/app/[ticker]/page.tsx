import { unstable_cacheLife as cacheLife } from 'next/cache';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { StockPage } from '~/components/stock-page';
import { env } from '~/env';

type StockInfo = {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
  logo: string;
  finnhubIndustry: string;
};

async function fetchStockInfo(ticker: string): Promise<StockInfo> {
  'use cache';
  cacheTag('stock-info', ticker);
  cacheLife('hours');

  const query = new URLSearchParams({
    symbol: ticker,
    token: env.FINNHUB_API_KEY,
  });

  const data = await fetch(
    `https://finnhub.io/api/v1/stock/profile2?${query.toString()}`
  );

  return data.json();
}

// TODO: Use Alphavantage API
async function fetchStockChartData(ticker: string) {
  'use cache';
  cacheTag('stock-chart', ticker);
  cacheLife('hours');

  const query = new URLSearchParams({
    symbol: ticker,
    token: env.ALPHAVANTAGE_API_KEY,
    function: 'TIME_SERIES_DAILY',
  });

  const data = await fetch(
    `https://www.alphavantage.co/query?${query.toString()}`
  );

  return data.json();
}

type StockPrice = {
  symbol: string;
  open: number;
  high: number;
  low: number;
  price: number;
  volume: number;
  latestTradingDay: string;
  previousClose: number;
  change: number;
  changePercent: number;
};

// TODO: Use Alphavantage API
async function fetchStockPrice(ticker: string): Promise<StockPrice> {
  'use cache';
  cacheTag('stock-price', ticker);
  cacheLife('hours');

  const query = new URLSearchParams({
    symbol: ticker,
    apikey: env.ALPHAVANTAGE_API_KEY,
    function: 'GLOBAL_QUOTE',
  });

  const data = await fetch(
    `https://www.alphavantage.co/query?${query.toString()}`
  );

  const json = await data.json();

  const globalQuote = json['Global Quote'];

  return {
    symbol: globalQuote['01. symbol'],
    open: parseFloat(globalQuote['02. open']),
    high: parseFloat(globalQuote['03. high']),
    low: parseFloat(globalQuote['04. low']),
    price: parseFloat(globalQuote['05. price']),
    volume: parseFloat(globalQuote['06. volume']),
    latestTradingDay: globalQuote['07. latest trading day'],
    previousClose: parseFloat(globalQuote['08. previous close']),
    change: parseFloat(globalQuote['09. change']),
    changePercent: parseFloat(globalQuote['10. change percent']),
  };
}

type Sentiment = 'positive' | 'neutral' | 'negative' | 'very-negative';

async function calculateSentiment(stockPrice: StockPrice): Promise<Sentiment> {
  const { price, changePercent } = stockPrice;

  switch (true) {
    case price > 0 && changePercent > 0:
      return 'positive';
    case price > 0 && changePercent < -10:
      return 'very-negative';
    case price > 0 && changePercent < 0:
      return 'negative';
    default:
      return 'neutral';
  }
}

export default async function Home(pageProps: {
  params: Promise<{ ticker: string }>;
}) {
  const { ticker } = await pageProps.params;

  const stockInfo = await fetchStockInfo(ticker);
  const stockPrice = await fetchStockPrice(ticker);

  console.log(stockPrice);

  const sentiment = await calculateSentiment(stockPrice);

  return (
    <StockPage
      stockInfo={stockInfo}
      stockPrice={stockPrice}
      sentiment={sentiment}
    />
  );
}
