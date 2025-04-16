import { ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback } from '~/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Skeleton } from '~/components/ui/skeleton';

export default function RecommendationsLoading() {
  return (
    <Card className="bg-background overflow-hidden rounded-3xl border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl text-transparent">
          Similar Stocks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex cursor-pointer items-center justify-between rounded-2xl p-3 transition-colors"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Avatar className="h-10 w-10 flex-shrink-0 rounded-xl">
                  <AvatarFallback>
                    <Skeleton className="h-10 w-10 rounded-xl" />
                  </AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="mt-1 h-3 w-12" />
                </div>
              </div>
              <div className="flex flex-shrink-0 items-center gap-3">
                <div className="text-right">
                  <Skeleton className="h-5 w-20" />
                  <div className="flex items-center justify-end">
                    <Skeleton className="mr-1 h-3 w-3 flex-shrink-0" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground h-4 w-4 flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
