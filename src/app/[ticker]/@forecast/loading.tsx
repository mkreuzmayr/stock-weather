import { Skeleton } from '~/components/ui/skeleton';

export default function ForecastLoading() {
  return (
    <div className="bg-background flex items-center justify-between rounded-3xl px-8 py-6 shadow-lg">
      {['1D', '1W', '1M', '3M', '6M', '1Y'].map((day, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="text-muted-foreground mb-1 text-xs font-medium">
            {day}
          </div>
          <div className="mb-2">
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <div className="text-foreground mb-1 text-sm font-bold">
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="text-muted-foreground text-xs">
            <Skeleton className="h-3 w-6" />
          </div>
        </div>
      ))}
    </div>
  );
}
