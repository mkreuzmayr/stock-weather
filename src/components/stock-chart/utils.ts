import { AggregateBar } from '~/lib/polygon';
import { ChartDataPoint } from './hooks/use-chart-data';

export const formatLargeNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num?.toString() ?? '0';
};

export const getChartColor = (sentiment: string, theme: string | undefined) => {
  const isDark = theme === 'dark';
  switch (sentiment) {
    case 'positive':
      return isDark ? '#10b981' : '#16a34a';
    case 'neutral':
      return isDark ? '#60a5fa' : '#3b82f6';
    case 'negative':
      return isDark ? '#f87171' : '#ef4444';
    case 'very-negative':
      return isDark ? '#f43f5e' : '#dc2626';
    default:
      return isDark ? '#60a5fa' : '#3b82f6';
  }
};

export const processChartData = (
  stockHistory: AggregateBar[] | null,
  timeframe: string
): ChartDataPoint[] => {
  if (!stockHistory || stockHistory.length === 0) return [];

  return stockHistory.map(
    (item: AggregateBar, index: number): ChartDataPoint => {
      const date = new Date(item.t || 0);
      let formattedTime = '';

      switch (timeframe) {
        case '1D':
          formattedTime = date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });
          break;
        case '1W':
          formattedTime = date.toLocaleDateString([], {
            weekday: 'short',
            hour: 'numeric',
          });
          break;
        case '1M':
        case '3M':
        case '6M':
          formattedTime = date.toLocaleDateString([], {
            month: 'short',
            day: 'numeric',
          });
          break;
        case '1Y':
          formattedTime = date.toLocaleDateString([], {
            month: 'short',
          });
          break;
        default:
          formattedTime = date.toISOString();
      }

      return {
        time: formattedTime,
        value: item.c ?? 0,
        volume: item.v ?? 0,
        timestamp: item.t || 0,
        index: index,
      };
    }
  );
};
