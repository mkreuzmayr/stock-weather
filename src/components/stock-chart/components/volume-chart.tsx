import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartDataPoint } from '../hooks/use-chart-data';
import { ChartTooltip } from './chart-tooltip';

export function VolumeChart(props: {
  data: ChartDataPoint[];
  previousClosePrice: number;
  chartColor: string;
}) {
  return (
    <div className="mt-2 h-[50px] w-full md:h-[80px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={props.data}
          margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="time" hide={true} />
          <YAxis dataKey="volume" domain={[0, 'dataMax * 1.1']} hide={true} />
          <Tooltip
            content={
              <ChartTooltip previousClosePrice={props.previousClosePrice} />
            }
            isAnimationActive={false}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="none"
            fillOpacity={0.5}
            fill={`${props.chartColor}40`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
