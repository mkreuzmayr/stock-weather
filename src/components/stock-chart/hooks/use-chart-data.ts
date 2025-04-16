import { useQueryState } from 'nuqs';
import { useEffect, useState } from 'react';
import { AggregateBar, Timeframe } from '~/lib/polygon';
import { processChartData } from '../utils';

export type ChartDataPoint = {
  time: string;
  value: number;
  volume: number;
  timestamp: number;
  index: number;
};

export const useChartData = (stockHistory: AggregateBar[] | null) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [fullChartData, setFullChartData] = useState<ChartDataPoint[]>([]);

  const [timeframe, setTimeframe] = useQueryState<Timeframe>('timeframe', {
    defaultValue: '1Y',
    parse: (v) => v as Timeframe,
    history: 'push',
    shallow: false,
  });

  useEffect(() => {
    if (stockHistory && stockHistory.length > 0) {
      const processedData = processChartData(stockHistory, timeframe);
      setFullChartData(processedData);
      setChartData(processedData);
    } else if (stockHistory === null || stockHistory?.length === 0) {
      setFullChartData([]);
      setChartData([]);
    }
  }, [stockHistory, timeframe]);

  return {
    chartData,
    fullChartData,
    setChartData,
    timeframe,
    setTimeframe,
  };
};
