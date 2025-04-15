import { StockPageLayout } from '~/components/stock-page-layout';
import { LayoutProps } from '~/lib/next-types';

export default function Layout(
  props: LayoutProps<
    { ticker: string },
    'chart' | 'company-info' | 'forecast' | 'news' | 'recommendations'
  >
) {
  return (
    <StockPageLayout
      widgets={{
        chart: props.chart,
        companyInfo: props['company-info'],
        forecast: props.forecast,
        news: props.news,
        recommendations: props.recommendations,
        weather: props.children,
      }}
    />
  );
}
