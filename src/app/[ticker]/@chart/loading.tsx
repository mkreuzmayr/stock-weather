import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';

export default function ChartLoading() {
  return (
    <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-lg dark:bg-gray-800">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl text-transparent">
          Stock Chart
        </CardTitle>
        <Tabs defaultValue="1D">
          <TabsList className="grid w-full grid-cols-5">
            {['1D', '1W', '1M', '3M', '1Y'].map((timeframe) => (
              <TabsTrigger key={timeframe} value={timeframe} disabled>
                {timeframe}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative h-[300px] md:h-[452px]">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}
