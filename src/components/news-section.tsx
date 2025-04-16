'use client';

import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useMobile } from '~/hooks/use-mobile';
import { NewsItem } from '~/lib/polygon';

interface NewsSectionProps {
  news: NewsItem[];
}

export function NewsSection({ news }: NewsSectionProps) {
  const isMobile = useMobile();

  // For desktop, show all articles
  // For mobile, show only the first 3
  const displayArticles = isMobile ? news.slice(0, 3) : news;

  return (
    <Card className="overflow-hidden rounded-3xl border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl text-transparent">
          Latest News
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {displayArticles.length > 0 ? (
          displayArticles.map((article) => (
            <a
              key={article.id}
              href={article.articleUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:bg-muted flex items-start gap-3 rounded-2xl p-3 transition-colors"
            >
              <div className="flex-1">
                <p className="text-foreground font-medium">{article.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  {article.publisher?.name && (
                    <span className="text-muted-foreground text-xs">
                      {article.publisher.name}
                    </span>
                  )}
                  {article.publisher?.name && (
                    <span className="text-muted-foreground text-xs">•</span>
                  )}
                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(article.publishedUtc), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
              {article.articleUrl && (
                <ExternalLink className="text-muted-foreground mt-1 h-4 w-4 flex-shrink-0" />
              )}
            </a>
          ))
        ) : (
          <p className="text-muted-foreground px-3 text-sm">
            No recent news found for this ticker.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
