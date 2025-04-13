"use client"

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { ExternalLink } from "lucide-react"
import { useMobile } from "~/hooks/use-mobile"
import { NewsItem } from "~/lib/polygon"
import { formatDistanceToNow } from 'date-fns'

interface NewsSectionProps {
  news: NewsItem[]
}

export function NewsSection({ news }: NewsSectionProps) {
  const isMobile = useMobile()

  // For desktop, show all articles
  // For mobile, show only the first 3
  const displayArticles = isMobile ? news.slice(0, 3) : news

  return (
    <Card className="overflow-hidden border-0 shadow-lg rounded-3xl bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Latest News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 px-1">Recent Articles</h3>
          {displayArticles.length > 0 ? (
            displayArticles.map((article) => (
              <a
                key={article.id}
                href={article.articleUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-2xl transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{article.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {article.publisher?.name && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{article.publisher.name}</span>
                    )}
                    {article.publisher?.name && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(article.publishedUtc), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                {article.articleUrl && <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" />}
              </a>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 px-3">No recent news found for this ticker.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
