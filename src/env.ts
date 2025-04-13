const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

if (typeof POLYGON_API_KEY !== 'string' || POLYGON_API_KEY.length === 0) {
  throw new Error('POLYGON_API_KEY is not set');
}

if (typeof FINNHUB_API_KEY !== 'string' || FINNHUB_API_KEY.length === 0) {
  throw new Error('FINNHUB_API_KEY is not set');
}

export const env = {
  POLYGON_API_KEY,
  FINNHUB_API_KEY,
};
