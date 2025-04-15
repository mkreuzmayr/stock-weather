import { StockRecommendations } from '~/components/stock-recommendations';
import { getSimilarStocks } from '~/data/get-similar-stocks';
import { PageProps } from '~/lib/next-types';

export default async function ChartPage(
  pageProps: PageProps<{ ticker: string }>
) {
  const { ticker } = await pageProps.params;

  const recommendations = await getSimilarStocks(ticker);

  return <StockRecommendations recommendations={recommendations} />;
}
