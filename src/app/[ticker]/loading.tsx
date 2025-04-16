import { Skeleton } from '~/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="relative">
      <div className="p-3">
        <div className="bg-background relative z-10 flex flex-row items-center justify-between rounded-xl p-1.5 shadow-2xl">
          {/* Company Logo */}
          <div className="size-16 p-2">
            <Skeleton className="h-full w-full rounded-md" />
          </div>
          <div className="flex h-16 flex-col items-end justify-center gap-0 px-3 text-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-1 h-4 w-16" />
          </div>
        </div>
      </div>

      {/* Canvas placeholder */}
      <div className="absolute inset-0 h-full w-full">
        <Skeleton className="h-full w-full" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#ffffff] dark:to-gray-900"></div>

      {/* Canvas for 3D stock visualization */}
      <div className="-mx-7 mb-4 h-[400px]" />

      {/* Price display */}
      <div className="relative z-10 px-8 pb-8 text-center">
        <div className="inline-block">
          <Skeleton className="h-[100px] w-48" />
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="flex items-center">
              <Skeleton className="mr-1 h-5 w-5" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-5 w-5" />
          </div>
          <Skeleton className="mt-2 h-8 w-48" />
          <Skeleton className="mt-1 h-4 w-32" />
        </div>
      </div>
    </div>
  );
}
