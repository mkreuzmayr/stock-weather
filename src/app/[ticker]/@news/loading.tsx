import { Skeleton } from '~/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

export default function NewsLoading() {
  return (
    <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-lg dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl text-transparent">
          Latest News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="px-1 text-sm font-medium text-gray-500 dark:text-gray-400">
            Recent Articles
          </h3>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl p-3 transition-colors"
            >
              <div className="flex-1">
                <Skeleton className="h-5 w-full" />
                <div className="mt-1 flex items-center gap-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="mt-1 h-4 w-4 flex-shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
