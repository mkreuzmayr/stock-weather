'use client';

import {
  Activity,
  ArrowDown,
  ArrowUp,
  Clock,
  DollarSign,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMobile } from '~/hooks/use-mobile';
import { Timeframe } from '~/lib/polygon';

// Define a type for the processed chart data point
interface ChartDataPoint {
  time: string; // Formatted time string for display
  value: number; // Closing price
  volume: number; // Trading volume
  timestamp: number; // Original timestamp for calculations/sorting
  index: number; // Index for zoom logic
}

// Define a type for the aggregate bar data directly
interface AggregateBar {
  c?: number; // Close price
  h?: number; // High price
  l?: number; // Low price
  n?: number; // Number of transactions
  o?: number; // Open price
  t?: number; // Timestamp
  v?: number; // Trading volume
  vw?: number; // Volume weighted average price
}

interface EnhancedStockChartProps {
  // ticker: string; // Keep ticker commented out for now, might be needed later
  sentiment: string;
  timeframe: Timeframe;
  previousClosePrice: number;
  stockHistory: AggregateBar[] | null; // Use the defined AggregateBar type
}

// Define types for Recharts callbacks to fix 'any'
interface TooltipProps {
  active?: boolean;
  payload?: { payload: ChartDataPoint }[];
  label?: string; // Keep label even if unused for type compatibility
}

interface ZoomEventProps {
  activeLabel?: string; // Used in older examples, might be different now
  activeCoordinate?: { x: number; y: number };
  activePayload?: { payload: ChartDataPoint }[];
  chartX?: number;
  chartY?: number;
}

export function EnhancedStockChart({
  sentiment,
  timeframe,
  previousClosePrice,
  stockHistory,
}: EnhancedStockChartProps) {
  // State for processed and zoomed data
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [fullChartData, setFullChartData] = useState<ChartDataPoint[]>([]);

  const [zoomState, setZoomState] = useState<{
    refAreaLeft: number | null;
    refAreaRight: number | null;
    zooming: boolean;
  }>({ refAreaLeft: null, refAreaRight: null, zooming: false });

  const { theme } = useTheme();
  const isMobile = useMobile();
  const chartRef = useRef<HTMLDivElement>(null);
  const [volumeVisible, setVolumeVisible] = useState(true);

  // Process stockHistory prop when it changes
  useEffect(() => {
    if (stockHistory && stockHistory.length > 0) {
      console.log(
        'Chart: Processing received stock history',
        stockHistory.length
      );
      const processedData = stockHistory.map(
        (item: AggregateBar, index: number): ChartDataPoint => {
          const date = new Date(item.t || 0);
          let formattedTime = '';

          // Simplified time formatting (adjust as needed)
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
            value: item.c ?? 0, // Close price
            volume: item.v ?? 0, // Volume
            timestamp: item.t || 0, // Timestamp for zoom
            index: index,
          };
        }
      );
      setFullChartData(processedData);
      setChartData(processedData); // Initially show full data
      console.log('Chart: Data processed', processedData[0]);
    } else if (stockHistory === null || stockHistory?.length === 0) {
      console.log(
        'Chart: Received null or empty stock history, clearing data.'
      );
      setFullChartData([]);
      setChartData([]);
    }
    // Reset zoom when history changes
    setZoomState({ refAreaLeft: null, refAreaRight: null, zooming: false });
  }, [stockHistory, timeframe]); // Depend on stockHistory and timeframe

  // Get chart color based on sentiment
  const getChartColor = () => {
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

  // Format large numbers (for volume)
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num?.toString() ?? '0';
  };

  // --- Zoom Handlers (Use typed event) ---
  const handleZoomStart = useCallback((e: ZoomEventProps) => {
    if (!e || !e.activePayload?.[0]?.payload?.timestamp) return;
    const timestamp = e.activePayload[0].payload.timestamp;

    setZoomState({
      refAreaLeft: timestamp,
      refAreaRight: null,
      zooming: true,
    });
  }, []); // No dependencies needed if not accessing external state directly

  const handleZoomMove = useCallback(
    (e: ZoomEventProps) => {
      if (!zoomState.zooming || !e || !e.activePayload?.[0]?.payload?.timestamp)
        return;
      const timestamp = e.activePayload[0].payload.timestamp;

      setZoomState((prev) => ({
        ...prev,
        refAreaRight: timestamp,
      }));
    },
    [zoomState.zooming]
  ); // Depends on zooming state

  const handleZoomEnd = useCallback(() => {
    if (
      !zoomState.zooming ||
      !zoomState.refAreaLeft ||
      !zoomState.refAreaRight
    ) {
      setZoomState({ refAreaLeft: null, refAreaRight: null, zooming: false });
      return;
    }

    const { refAreaLeft, refAreaRight } = zoomState;
    const startIndex = fullChartData.findIndex(
      (item) => item.timestamp >= Math.min(refAreaLeft, refAreaRight)
    );
    let endIndex = fullChartData.findIndex(
      (item) => item.timestamp > Math.max(refAreaLeft, refAreaRight)
    );
    if (endIndex === -1) endIndex = fullChartData.length;

    if (startIndex !== -1 && endIndex !== -1 && endIndex - startIndex >= 2) {
      setChartData(fullChartData.slice(startIndex, endIndex));
    } else {
      console.log('Zoom range too small or invalid.');
    }

    setZoomState({ refAreaLeft: null, refAreaRight: null, zooming: false });
  }, [zoomState, fullChartData]); // Depends on zoomState and fullChartData

  // Reset zoom
  const resetZoom = useCallback(() => {
    setChartData(fullChartData);
    setZoomState({ refAreaLeft: null, refAreaRight: null, zooming: false });
  }, [fullChartData]);

  // Toggle volume display
  const toggleVolume = useCallback(() => {
    setVolumeVisible((v) => !v);
  }, []);

  // --- Custom tooltip component (Use typed props) ---
  const CustomTooltip = useCallback(
    ({ active, payload }: TooltipProps) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;

        return (
          <div className="min-w-[250px] rounded-xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/95">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {data.time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  ${data.value?.toFixed(2) ?? 'N/A'}
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Volume
                  </div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {formatLargeNumber(data.volume)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    vs. Prev Close
                  </div>
                  <div className="flex items-center">
                    {data.value > previousClosePrice ? (
                      <>
                        <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
                        <span className="font-medium text-emerald-500">
                          +{(data.value - previousClosePrice).toFixed(2)} (
                          {(
                            (data.value / previousClosePrice - 1) *
                            100
                          ).toFixed(2)}
                          %)
                        </span>
                      </>
                    ) : (
                      <>
                        <ArrowDown className="mr-1 h-3 w-3 text-rose-500" />
                        <span className="font-medium text-rose-500">
                          {(data.value - previousClosePrice).toFixed(2)} (
                          {(
                            (data.value / previousClosePrice - 1) *
                            100
                          ).toFixed(2)}
                          %)
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
      return null;
    },
    [previousClosePrice]
  ); // Depends on previousClosePrice

  // Get chart gradient colors
  const chartColor = getChartColor();

  // --- Render No Data State ---
  // Check chartData derived from stockHistory prop
  if (chartData.length === 0) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-900/20 ${
          isMobile ? 'h-[310px]' : 'h-[490px]'
        }`}
        ref={chartRef}
      >
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

  // --- Main Chart Rendering ---
  return (
    <div className="relative" ref={chartRef}>
      {/* Chart controls (only if data exists) */}
      {chartData.length > 0 && (
        <div className="absolute top-2 right-2 z-30 flex gap-2">
          <button
            onClick={resetZoom}
            disabled={chartData.length === fullChartData.length} // Disable if not zoomed
            className="rounded-full border border-gray-200 bg-white/80 p-1.5 text-gray-700 shadow-sm hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700"
            title="Reset zoom"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={toggleVolume}
            className={`rounded-full p-1.5 ${
              volumeVisible
                ? 'bg-white/80 dark:bg-gray-800/80'
                : 'bg-gray-200/80 dark:bg-gray-700/80'
            } border border-gray-200 text-gray-700 shadow-sm hover:bg-white dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700`}
            title={volumeVisible ? 'Hide volume' : 'Show volume'}
          >
            <Activity className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Instructions (only if data exists) */}
      {chartData.length > 0 && (
        <div className="absolute top-2 left-2 z-30">
          <div className="rounded-md border border-gray-200 bg-white/80 px-2 py-1 text-xs text-gray-500 shadow-sm dark:border-gray-700 dark:bg-gray-800/80 dark:text-gray-400">
            Click and drag to zoom
          </div>
        </div>
      )}

      {/* Chart Area */}
      <div className={`w-full ${isMobile ? 'h-[250px]' : 'h-[400px]'}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData} // Use processed data state
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            onMouseDown={handleZoomStart}
            onMouseMove={handleZoomMove}
            onMouseUp={handleZoomEnd}
            onMouseLeave={handleZoomEnd} // Also end zoom on mouse leave
          >
            <defs>
              <linearGradient
                id={`colorValue-${sentiment}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={
                theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }
            />

            <XAxis
              dataKey="time" // Use formatted time
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: theme === 'dark' ? '#94a3b8' : '#64748b',
              }}
              interval="preserveStartEnd"
              minTickGap={isMobile ? 30 : 50}
              tickFormatter={(value, index) => {
                if (index === 0 || index === chartData.length - 1) return value;
                if (
                  chartData.length > 50 &&
                  index % Math.floor(chartData.length / 5) !== 0
                )
                  return '';
                return value;
              }}
            />

            <YAxis
              dataKey="value"
              domain={['dataMin - dataMin * 0.01', 'dataMax + dataMax * 0.01']} // Add slight padding
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fill: theme === 'dark' ? '#94a3b8' : '#64748b',
              }}
              width={isMobile ? 45 : 55} // Adjust width slightly
              tickFormatter={(value) => `$${value.toFixed(value < 10 ? 2 : 0)}`} // Dynamic decimal places
              allowDataOverflow={true}
            />

            <Tooltip content={<CustomTooltip />} isAnimationActive={false} />

            {/* Previous close reference line */}
            <ReferenceLine
              y={previousClosePrice} // Use passed prop
              stroke={
                theme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
              }
              strokeDasharray="3 3"
              label={{
                value: 'Prev Close',
                position: 'insideBottomRight',
                fill: theme === 'dark' ? '#94a3b8' : '#64748b',
                fontSize: 10,
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#colorValue-${sentiment})`}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                fill: chartColor,
                stroke: theme === 'dark' ? '#1e293b' : '#ffffff',
              }}
              isAnimationActive={false} // Disable animation for smoother updates with external data
            />

            {/* Zoom area */}
            {zoomState.refAreaLeft && zoomState.refAreaRight && (
              <ReferenceArea
                x1={
                  fullChartData.find(
                    (d) => d.timestamp === zoomState.refAreaLeft
                  )?.time
                } // Find time based on timestamp
                x2={
                  fullChartData.find(
                    (d) => d.timestamp === zoomState.refAreaRight
                  )?.time
                }
                strokeOpacity={0.3}
                fill={
                  theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                }
                isFront={true} // Ensure it renders above the main area
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume bars at the bottom */}
      {volumeVisible && chartData.length > 0 && (
        <div className={`w-full ${isMobile ? 'h-[50px]' : 'h-[80px]'} mt-2`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="time" hide={true} />
              <YAxis
                dataKey="volume"
                domain={[0, 'dataMax * 1.1']}
                hide={true}
              />
              {/* Ensure volume tooltip uses the same shared component */}
              <Tooltip content={<CustomTooltip />} isAnimationActive={false} />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="none"
                fillOpacity={0.5}
                fill={`${chartColor}40`} // Use chart color with alpha
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
