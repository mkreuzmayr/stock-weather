import { restClient } from '@polygon.io/client-js';
import { subDays, subMonths, subYears } from 'date-fns';
import { unstable_cacheLife as cacheLife } from 'next/cache';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { env } from '~/env';

const polygon = restClient(env.POLYGON_API_KEY);

export type Timeframe = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

/**
 * Determines the appropriate Polygon API parameters based on the timeframe.
 *
 * @param {'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'} timeframe The desired history timeframe.
 * @param {Date} toDate The end date for the query (usually the current date).
 * @returns {{ fromDate: Date, multiplier: number, timespan: string } | null} An object with parameters or null if timeframe is invalid.
 */
function getPolygonParams(timeframe: Timeframe, toDate: Date) {
  switch (timeframe) {
    case '1D':
      return {
        multiplier: 15,
        timeSpan: 'minute',
        fromDate: subDays(toDate, 1),
      };
    case '1W':
      return { multiplier: 1, timeSpan: 'hour', fromDate: subDays(toDate, 7) };
    case '1M':
      return { multiplier: 1, timeSpan: 'day', fromDate: subMonths(toDate, 1) };
    case '3M':
      return {
        multiplier: 1,
        timeSpan: 'day',
        fromDate: subMonths(toDate, 3),
      };
    case '6M':
      return {
        multiplier: 1,
        timeSpan: 'day',
        fromDate: subMonths(toDate, 6),
      };
    case '1Y':
      return { multiplier: 1, timeSpan: 'day', fromDate: subYears(toDate, 1) };
  }
}

/**
 * Fetches historical stock data from Polygon.io with appropriate resolution
 * based on the requested timeframe.
 *
 * @param {string} ticker The stock ticker symbol (e.g., 'AAPL').
 * @param {'1D' | '1W' | '1M' | '3M' | '6M' | '1Y'} timeframe The desired history timeframe.
 * @returns {Promise<IAggsResults[] | null>} A promise that resolves to an array of aggregate bars (candles) or null if an error occurs or the timeframe is invalid.
 */
export async function fetchStockHistory(
  ticker: string,
  options: { timeframe: Timeframe }
) {
  'use cache';
  cacheTag(`stock-history`, ticker, options.timeframe);
  cacheLife('hours');

  const toDate = new Date();
  const params = getPolygonParams(options.timeframe, toDate);

  const { fromDate, multiplier, timeSpan } = params;

  const formattedFrom = fromDate.toISOString().slice(0, 10);
  const formattedTo = toDate.toISOString().slice(0, 10);

  console.log(
    `Fetching ${ticker} data: ${options.timeframe} (${multiplier} ${timeSpan}) from ${formattedFrom} to ${formattedTo}`
  );

  try {
    const response = await polygon.stocks.aggregates(
      ticker,
      multiplier,
      timeSpan,
      formattedFrom,
      formattedTo,
      {
        adjusted: 'true',
        sort: 'asc',
        // limit: 5000, // Optional
      }
    );

    if (response && response.results) {
      console.log(
        `Successfully fetched ${response.results.length} data points.`
      );
      return response.results;
    } else {
      console.warn('No results found for the given parameters.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching stock data from Polygon.io:', error);
    return null;
  }
}

export async function fetchLatestStockNews(ticker: string) {
  'use cache';
  cacheTag(`stock-news`, ticker);
  cacheLife('hours');

  const result = await polygon.reference.tickerNews({
    order: 'desc',
    limit: 10,
    sort: 'published_utc',
    ticker: ticker,
  });

  return result.results.map((article) => ({
    ampUrl: article.amp_url,
    articleUrl: article.article_url,
    author: article.author,
    description: article.description,
    id: article.id,
    imageUrl: article.image_url,
    keywords: article.keywords,
    publishedUtc: article.published_utc,
    publisher: article.publisher,
    tickers: article.tickers,
    title: article.title,
  }));
}

export type NewsItem = Awaited<ReturnType<typeof fetchLatestStockNews>>[number];
