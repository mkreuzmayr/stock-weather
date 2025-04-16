import {
  Activity,
  ArrowDown,
  ArrowUp,
  Clock,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { ChartDataPoint } from '../hooks/use-chart-data';
import { formatLargeNumber } from '../utils';

export function ChartTooltip(props: {
  active?: boolean;
  payload?: { payload: ChartDataPoint }[];
  label?: string;
  previousClosePrice: number;
}) {
  if (!props.active || !props.payload || !props.payload.length) return null;

  const data = props.payload[0].payload;

  return (
    <div className="min-w-[250px] rounded-xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-foreground">
            {data.time}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-foreground">
            ${data.value?.toFixed(2) ?? 'N/A'}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">
              Volume
            </div>
            <div className="font-medium text-foreground">
              {formatLargeNumber(data.volume)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="text-xs text-muted-foreground">
              vs. Prev Close
            </div>
            <div className="flex items-center">
              {data.value > props.previousClosePrice ? (
                <>
                  <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
                  <span className="font-medium text-emerald-500">
                    +{(data.value - props.previousClosePrice).toFixed(2)} (
                    {(
                      (data.value / props.previousClosePrice - 1) *
                      100
                    ).toFixed(2)}
                    %)
                  </span>
                </>
              ) : (
                <>
                  <ArrowDown className="mr-1 h-3 w-3 text-rose-500" />
                  <span className="font-medium text-rose-500">
                    {(data.value - props.previousClosePrice).toFixed(2)} (
                    {(
                      (data.value / props.previousClosePrice - 1) *
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
