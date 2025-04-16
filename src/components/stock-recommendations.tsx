'use client';

import { ArrowDown, ArrowUp, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { RecommendationItem } from '~/data/get-similar-stocks';
import { useMobile } from '~/hooks/use-mobile';
import { generateColorFromString } from '~/lib/utils';

interface StockRecommendationsProps {
  recommendations: RecommendationItem[];
}

export function StockRecommendations({
  recommendations,
}: StockRecommendationsProps) {
  const isMobile = useMobile();

  // For desktop, show all recommendations
  // For mobile, show only the first 4
  const displayRecommendations = isMobile
    ? recommendations.slice(0, 4)
    : recommendations;

  return (
    <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl text-transparent">
          Similar Stocks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayRecommendations.length > 0 ? (
            displayRecommendations.map((stock) => {
              const color = generateColorFromString(stock.ticker);
              const change = stock.quote.change;
              const changePercent = stock.quote.percentChange;

              return (
                <Link
                  href={`/${stock.ticker}`}
                  key={stock.ticker}
                  className="flex cursor-pointer items-center justify-between rounded-2xl p-3 transition-colors hover:bg-muted"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar
                      className="h-10 w-10 flex-shrink-0 rounded-xl"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <AvatarImage
                        src={`https://assets.parqet.com/logos/symbol/${stock.ticker}`}
                        alt={stock.ticker}
                      />
                      <AvatarFallback
                        style={{ color: color, backgroundColor: `${color}20` }}
                      >
                        {stock.ticker.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="truncate font-medium text-foreground">
                        {stock.ticker}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {stock.ticker}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        ${stock.quote.currentPrice.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-end">
                        {change >= 0 ? (
                          <ArrowUp className="mr-1 h-3 w-3 flex-shrink-0 text-emerald-500" />
                        ) : (
                          <ArrowDown className="mr-1 h-3 w-3 flex-shrink-0 text-rose-500" />
                        )}
                        <span
                          className={`text-xs ${
                            change >= 0 ? 'text-emerald-500' : 'text-rose-500'
                          }`}
                        >
                          {change >= 0 ? '+' : ''}
                          {change.toFixed(2)} ({change >= 0 ? '+' : ''}
                          {changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="px-3 text-sm text-muted-foreground">
              No similar stocks found.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
