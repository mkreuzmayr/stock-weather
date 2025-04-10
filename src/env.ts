const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const ALPHAVANTAGE_API_KEY = process.env.ALPHAVANTAGE_API_KEY;

if (typeof FINNHUB_API_KEY !== 'string' || FINNHUB_API_KEY.length === 0) {
  throw new Error('FINNHUB_API_KEY is not set');
}

if (
  typeof ALPHAVANTAGE_API_KEY !== 'string' ||
  ALPHAVANTAGE_API_KEY.length === 0
) {
  throw new Error('ALPHAVANTAGE_API_KEY is not set');
}

export const env = {
  FINNHUB_API_KEY,
  ALPHAVANTAGE_API_KEY,
};
