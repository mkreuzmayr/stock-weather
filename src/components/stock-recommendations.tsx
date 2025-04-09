"use client"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { ArrowUp, ArrowDown, ChevronRight } from "lucide-react"
import { useMobile } from "~/hooks/use-mobile"

interface StockRecommendationsProps {
  industry: string
}

export function StockRecommendations({ industry }: StockRecommendationsProps) {
  const isMobile = useMobile()

  // Mock data for similar stocks in the technology industry
  const recommendations = [
    {
      ticker: "MSFT",
      name: "Microsoft Corporation",
      price: 417.88,
      change: 2.15,
      changePercent: 0.52,
      logo: "/placeholder.svg?height=40&width=40",
      color: "#00a4ef",
    },
    {
      ticker: "GOOGL",
      name: "Alphabet Inc.",
      price: 152.5,
      change: -0.75,
      changePercent: -0.49,
      logo: "/placeholder.svg?height=40&width=40",
      color: "#4285f4",
    },
    {
      ticker: "AMZN",
      name: "Amazon.com, Inc.",
      price: 178.75,
      change: 1.25,
      changePercent: 0.7,
      logo: "/placeholder.svg?height=40&width=40",
      color: "#ff9900",
    },
    {
      ticker: "NVDA",
      name: "NVIDIA Corporation",
      price: 875.28,
      change: 15.32,
      changePercent: 1.78,
      logo: "/placeholder.svg?height=40&width=40",
      color: "#76b900",
    },
    {
      ticker: "META",
      name: "Meta Platforms, Inc.",
      price: 492.16,
      change: 4.28,
      changePercent: 0.88,
      logo: "/placeholder.svg?height=40&width=40",
      color: "#0668E1",
    },
    {
      ticker: "TSLA",
      name: "Tesla, Inc.",
      price: 172.63,
      change: -3.42,
      changePercent: -1.94,
      logo: "/placeholder.svg?height=40&width=40",
      color: "#cc0000",
    },
  ]

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
          {displayRecommendations.map((stock) => (
            <div
              key={stock.ticker}
              className="flex items-center justify-between p-3 rounded-2xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-xl" style={{ backgroundColor: `${stock.color}20` }}>
                  <AvatarImage src={stock.logo} alt={stock.name} />
                  <AvatarFallback style={{ color: stock.color, backgroundColor: `${stock.color}20` }}>
                    {stock.ticker.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{stock.ticker}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{stock.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-medium text-gray-900 dark:text-gray-100">${stock.price}</p>
                  <div className="flex items-center justify-end">
                    {stock.change >= 0 ? (
                      <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-rose-500 mr-1" />
                    )}
                    <span className={`text-xs ${stock.change >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                      {stock.change >= 0 ? "+" : ""}
                      {stock.change} ({stock.change >= 0 ? "+" : ""}
                      {stock.changePercent}%)
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
