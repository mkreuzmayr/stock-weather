import { useTheme } from 'next-themes';
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
import { ChartDataPoint } from '../hooks/use-chart-data';
import { ZoomEventProps } from '../hooks/use-chart-zoom';
import { getChartColor } from '../utils';
import { ChartTooltip } from './chart-tooltip';

export function ChartArea(props: {
  data: ChartDataPoint[];
  previousClosePrice: number;
  sentiment: string;
  zoomState: {
    refAreaLeft: number | null;
    refAreaRight: number | null;
    zooming: boolean;
  };
  fullChartData: ChartDataPoint[];
  onZoomStart: (e: ZoomEventProps) => void;
  onZoomMove: (e: ZoomEventProps) => void;
  onZoomEnd: () => void;
}) {
  const { theme } = useTheme();
  const chartColor = getChartColor(props.sentiment, theme);

  return (
    <div className="h-[250px] w-full md:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={props.data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          onMouseDown={props.onZoomStart}
          onMouseMove={props.onZoomMove}
          onMouseUp={props.onZoomEnd}
          onMouseLeave={props.onZoomEnd}
        >
          <defs>
            <linearGradient
              id={`colorValue-${props.sentiment}`}
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
            dataKey="time"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: theme === 'dark' ? '#94a3b8' : '#64748b',
            }}
            interval="preserveStartEnd"
            minTickGap={50}
            tickFormatter={(value, index) => {
              if (index === 0 || index === props.data.length - 1) return value;
              if (
                props.data.length > 50 &&
                index % Math.floor(props.data.length / 5) !== 0
              )
                return '';
              return value;
            }}
          />

          <YAxis
            dataKey="value"
            domain={['dataMin - dataMin * 0.01', 'dataMax + dataMax * 0.01']}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: theme === 'dark' ? '#94a3b8' : '#64748b',
            }}
            width={55}
            tickFormatter={(value) => `$${value.toFixed(value < 10 ? 2 : 0)}`}
            allowDataOverflow={true}
          />

          <Tooltip
            content={
              <ChartTooltip previousClosePrice={props.previousClosePrice} />
            }
            isAnimationActive={false}
          />

          <ReferenceLine
            y={props.previousClosePrice}
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
            className="main-chart-area"
            type="monotone"
            dataKey="value"
            stroke={chartColor}
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#colorValue-${props.sentiment})`}
            activeDot={{
              r: 6,
              strokeWidth: 2,
              fill: chartColor,
              stroke: theme === 'dark' ? '#1e293b' : '#ffffff',
            }}
            isAnimationActive={false}
          />

          {props.zoomState.refAreaLeft && props.zoomState.refAreaRight && (
            <ReferenceArea
              x1={
                props.fullChartData.find(
                  (d) => d.timestamp === props.zoomState.refAreaLeft
                )?.time
              }
              x2={
                props.fullChartData.find(
                  (d) => d.timestamp === props.zoomState.refAreaRight
                )?.time
              }
              strokeOpacity={0.3}
              fill={
                theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
              }
              isFront={true}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
