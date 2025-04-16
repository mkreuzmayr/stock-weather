import { StockInfo } from '~/components/stock-info';
import { fetchStockDetails } from '~/lib/finnhub';
import { loadingSimulator } from '~/lib/loading-simulator';
import { PageProps } from '~/lib/next-types';

export default async function CompanyInfoPage(
  pageProps: PageProps<{ ticker: string }>
) {
  await loadingSimulator();

  const { ticker } = await pageProps.params;

  const stockInfo = await fetchStockDetails(ticker);

  return <StockInfo stockInfo={stockInfo} />;
}
