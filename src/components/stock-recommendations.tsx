"use client"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { ArrowUp, ArrowDown, ChevronRight } from "lucide-react"
import { useMobile } from "~/hooks/use-mobile"
import { RecommendationItem } from "~/app/[ticker]/page"
import Link from "next/link"
import { generateColorFromString } from '~/lib/utils';

interface StockRecommendationsProps {
  recommendations: RecommendationItem[]
}

export function StockRecommendations({ recommendations }: StockRecommendationsProps) {
  const isMobile = useMobile()

  // For desktop, show all recommendations
  // For mobile, show only the first 4
  const displayRecommendations = isMobile ? recommendations.slice(0, 4) : recommendations

  return (
    <Card className="overflow-hidden border-0 shadow-lg rounded-3xl bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
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
                  className="flex items-center justify-between p-3 rounded-2xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Avatar className="h-10 w-10 rounded-xl flex-shrink-0" style={{ backgroundColor: `${color}20` }}>
                      <AvatarImage src={stock.details.logo || undefined} alt={stock.details.name} />
                      <AvatarFallback style={{ color: color, backgroundColor: `${color}20` }}>
                        {stock.ticker.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{stock.ticker}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{stock.details.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-gray-100">${stock.quote.currentPrice.toFixed(2)}</p>
                      <div className="flex items-center justify-end">
                        {change >= 0 ? (
                          <ArrowUp className="h-3 w-3 text-emerald-500 mr-1 flex-shrink-0" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-rose-500 mr-1 flex-shrink-0" />
                        )}
                        <span className={`text-xs ${change >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                          {change >= 0 ? "+" : ""}
                          {change.toFixed(2)} ({change >= 0 ? "+" : ""}
                          {changePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>
                </Link>
              )
            })
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 px-3">No similar stocks found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
