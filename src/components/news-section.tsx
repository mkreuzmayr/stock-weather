"use client"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { ExternalLink, Sparkles } from "lucide-react"
import { useMobile } from "~/hooks/use-mobile"

interface NewsSectionProps {
  ticker: string
}

export function NewsSection({ ticker }: NewsSectionProps) {
  const isMobile = useMobile()

  // Mock AI-generated news summary
  const newsSummary = `Recent news for ${ticker} has been generally positive. The company announced strong quarterly earnings, exceeding analyst expectations with revenue growth of 8% year-over-year. Their new product launch has received favorable reviews, and analysts have raised price targets.`

  // Mock news articles
  const newsArticles = [
    {
      title: `${ticker} Exceeds Quarterly Earnings Expectations`,
      source: "Financial Times",
      time: "2 hours ago",
      url: "#",
      sentiment: "positive",
    },
    {
      title: `New ${ticker} Product Line Receives Positive Reviews`,
      source: "Tech Insider",
      time: "5 hours ago",
      url: "#",
      sentiment: "positive",
    },
    {
      title: `Analysts Raise Price Target for ${ticker} Following Strong Performance`,
      source: "Market Watch",
      time: "1 day ago",
      url: "#",
      sentiment: "positive",
    },
    {
      title: `${ticker} Announces New Partnership with Major Cloud Provider`,
      source: "Bloomberg",
      time: "1 day ago",
      url: "#",
      sentiment: "positive",
    },
    {
      title: `Supply Chain Challenges Could Impact ${ticker}'s Next Quarter`,
      source: "Reuters",
      time: "2 days ago",
      url: "#",
      sentiment: "negative",
    },
  ]

  // For desktop, show all articles
  // For mobile, show only the first 3
  const displayArticles = isMobile ? newsArticles.slice(0, 3) : newsArticles

  // Get sentiment color
  const getSentimentColor = (sentiment: string) => {
    return sentiment === "positive" ? "bg-emerald-500" : "bg-rose-500"
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg rounded-3xl bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Latest News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-medium text-gray-900 dark:text-gray-100">AI-Generated Summary</h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{newsSummary}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-1">Recent Articles</h3>
          {displayArticles.map((article, index) => (
            <a
              key={index}
              href={article.url}
              className="flex items-start gap-3 p-3 rounded-2xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <div className={`w-2 h-2 rounded-full mt-2 ${getSentimentColor(article.sentiment)}`} />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">{article.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{article.source}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{article.time}</span>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
