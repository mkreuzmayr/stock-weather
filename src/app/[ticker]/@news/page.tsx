import { NewsSection } from '~/components/news-section';
import { loadingSimulator } from '~/lib/loading-simulator';
import { PageProps } from '~/lib/next-types';
import { fetchLatestStockNews } from '~/lib/polygon';

export default async function ChartPage(
  pageProps: PageProps<{ ticker: string }>
) {
  await loadingSimulator();

  const { ticker } = await pageProps.params;

  const news = await fetchLatestStockNews(ticker);

  return <NewsSection news={news} />;
}
