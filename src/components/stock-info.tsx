import { Building2, Calendar, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { StockDetails } from '~/lib/finnhub';
import { formatLargeNumber } from '~/lib/utils';

export function StockInfo({ stockInfo }: { stockInfo: StockDetails }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-lg dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-xl text-transparent">
          Company Info
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Industry
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {stockInfo.industry}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg
                className="h-5 w-5 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Market Cap
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                ${formatLargeNumber(stockInfo.marketCapitalization * 1000000)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                IPO Date
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {formatDate(stockInfo.ipo)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/30">
              <Globe className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Website
              </p>
              <a
                href={stockInfo.webUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                {stockInfo.webUrl
                  .replace(/^https?:\/\//, '')
                  .replace(/\/$/, '')}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
