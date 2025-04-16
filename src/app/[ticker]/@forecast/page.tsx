import { StockForecast } from '~/components/stock-forecast';
import { loadingSimulator } from '~/lib/loading-simulator';

export default async function ForecastPage() {
  await loadingSimulator();

  return <StockForecast />;
}
