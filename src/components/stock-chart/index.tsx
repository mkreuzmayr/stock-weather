'use client';

import { Activity, RotateCcw } from 'lucide-react';
import { AggregateBar, Timeframe } from '~/lib/polygon';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { ChartArea } from './components/chart-area';
import { useChartData } from './hooks/use-chart-data';
import { useChartZoom } from './hooks/use-chart-zoom';

export function EnhancedStockChart(props: {
  sentiment: string;
  previousClosePrice: number;
  stockHistory: AggregateBar[] | null;
}) {
  const { chartData, fullChartData, setChartData, timeframe, setTimeframe } =
    useChartData(props.stockHistory);

  const {
    zoomState,
    handleZoomStart,
    handleZoomMove,
    handleZoomEnd,
    resetZoom,
  } = useChartZoom(fullChartData);

  const handleZoomEndWithData = () => {
    const newData = handleZoomEnd();
    if (newData) {
      setChartData(newData);
    }
  };

  const handleResetZoom = () => {
    const newData = resetZoom();
    setChartData(newData);
  };

  const isZoomed = chartData.length !== fullChartData.length;

  const hasData = chartData.length > 0;

  if (chartData.length === 0) {
    return (
      <div className="relative flex h-[310px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center md:h-[490px] dark:border-gray-700 dark:bg-gray-900/20">
        <Activity className="mb-3 h-10 w-10 text-gray-500" />
        <p className="mb-1 font-medium text-gray-700 dark:text-gray-300">
          No Data Available
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          There is no historical data for the selected timeframe.
        </p>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-lg dark:bg-gray-800">
      <CardHeader className="flex w-full flex-row items-center justify-between">
        <CardTitle className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl text-transparent">
          Price Chart
        </CardTitle>
        <div className="flex flex-row items-center justify-end gap-2">
          {hasData && isZoomed && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetZoom}
              className="h-9 w-9 rounded-xl p-0"
            >
              <span className="sr-only">Reset zoom</span>
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          <Tabs
            value={timeframe}
            onValueChange={(value) => setTimeframe(value as Timeframe)}
          >
            <TabsList className="grid w-full grid-cols-6 rounded-xl bg-gray-100 p-1 md:w-auto dark:bg-gray-800">
              {['1D', '1W', '1M', '3M', '6M', '1Y'].map((timeframe) => (
                <TabsTrigger
                  key={timeframe}
                  value={timeframe}
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                >
                  {timeframe}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="px-4">
        <ChartArea
          data={chartData}
          previousClosePrice={props.previousClosePrice}
          sentiment={props.sentiment}
          zoomState={zoomState}
          fullChartData={fullChartData}
          onZoomStart={handleZoomStart}
          onZoomMove={handleZoomMove}
          onZoomEnd={handleZoomEndWithData}
        />
      </CardContent>
    </Card>
  );
}
