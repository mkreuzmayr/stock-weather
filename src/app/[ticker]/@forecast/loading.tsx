import { Skeleton } from '~/components/ui/skeleton';

export default function ForecastLoading() {
  return (
    <div className="flex items-center justify-between rounded-3xl bg-white px-8 py-6 shadow-lg dark:bg-gray-800">
      {['1D', '1W', '1M', '3M', '6M', '1Y'].map((day, index) => (
        <div key={index} className="flex flex-col items-center">
          <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
          <div className="mb-2">
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
          <div className="mb-1 text-sm font-bold text-gray-900 dark:text-gray-100">
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <Skeleton className="h-3 w-6" />
          </div>
        </div>
      ))}
    </div>
  );
}
