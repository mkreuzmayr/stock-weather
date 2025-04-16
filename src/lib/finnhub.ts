import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';
import { env } from '~/env';
import { RAW_STOCK_DATA } from '~/stock-data';

export type StockDetails = {
  country: string;
  currency: string;
  exchange: string;
  ipo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  webUrl: string;
  logo: string;
  industry: string;
};

export async function fetchStockDetails(ticker: string): Promise<StockDetails> {
  'use cache';
  cacheTag('stock-details', ticker);
  cacheLife('hours');

  const query = new URLSearchParams({
    symbol: ticker,
    token: env.FINNHUB_API_KEY,
  });

  const res = await fetch(
    `https://finnhub.io/api/v1/stock/profile2?${query.toString()}`
  );

  const data = await res.json();

  const offlineData = RAW_STOCK_DATA.find((stock) => stock.symbol === ticker)!;

  return {
    country: data.country,
    currency: data.currency,
    exchange: data.exchange,
    ipo: data.ipo,
    marketCapitalization: data.marketCapitalization,
    name: offlineData.name,
    phone: data.phone,
    shareOutstanding: data.shareOutstanding,
    ticker,
    webUrl: data.weburl,
    logo: data.logo,
    industry: data.finnhubIndustry,
  };
}

export type StockQuote = {
  currentPrice: number;
  change: number;
  percentChange: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClosePrice: number;
};

export async function fetchStockQuote(ticker: string): Promise<StockQuote> {
  'use cache';
  cacheTag('stock-quote', ticker);
  cacheLife('hours');

  // https://finnhub.io/api/v1/quote?symbol=AAPL&token=cvq0vqhr01qi0ef639egcvq0vqhr01qi0ef639f0
  const query = new URLSearchParams({
    symbol: ticker,
    token: env.FINNHUB_API_KEY,
  });

  const res = await fetch(
    `https://finnhub.io/api/v1/quote?${query.toString()}`
  );

  // Response Attributes:
  // c: Current price
  // d: Change
  // dp: Percent change
  // h: High price of the day
  // l: Low price of the day
  // o: Open price of the day
  // pc: Previous close price
  const data = await res.json();

  return {
    currentPrice: data.c,
    change: data.d,
    percentChange: data.dp,
    highPrice: data.h,
    lowPrice: data.l,
    openPrice: data.o,
    previousClosePrice: data.pc,
  };
}
