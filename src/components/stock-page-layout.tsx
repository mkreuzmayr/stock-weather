'use client';

import { CommandPalette } from '~/components/command-palette';
import { EnhancedStockChart } from '~/components/enhanced-stock-chart';
import { NewsSection } from '~/components/news-section';
import { StockDisplay } from '~/components/stock-display';
import { StockForecast } from '~/components/stock-forecast';
import { StockRecommendations } from '~/components/stock-recommendations';
import { ThemeToggle } from '~/components/theme-toggle';
import { StockSentiment } from '~/data/get-sentiment';
import { RecommendationItem } from '~/data/get-similar-stocks';
import { useMobile } from '~/hooks/use-mobile';
import { StockDetails, StockQuote } from '~/lib/finnhub';
import { AggregateBar, NewsItem, Timeframe } from '~/lib/polygon';
import { cn } from '~/lib/utils';
import { StockInfo } from './stock-info';

export function StockPageLayout(props: {
  stockInfo: StockDetails;
  stockQuote: StockQuote;
  sentiment: StockSentiment;
  news: NewsItem[];
  recommendations: RecommendationItem[];
  stockHistory: AggregateBar[] | null;
  timeframe: Timeframe;
}) {
  const isMobile = useMobile();

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
      <div
        className={`container mx-auto px-4 py-6 ${
          isMobile ? 'max-w-md' : 'max-w-7xl'
        }`}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white">
              <div className="h-5 w-5 rounded-full bg-white dark:bg-black"></div>
            </div>
            <span className="font-mono text-sm text-gray-600 dark:text-gray-400">
              (Not Boring) Stocks
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div
              className={cn(
                !isMobile && 'flex w-[270px] flex-1 justify-center'
              )}
            >
              <CommandPalette />
            </div>
          </div>
        </div>

        {isMobile ? (
          // Mobile Layout (Single Column)
          <>
            {/* Main Stock Display */}
            <StockDisplay
              price={props.stockQuote.currentPrice}
              change={props.stockQuote.change}
              changePercent={props.stockQuote.percentChange}
              sentiment={props.sentiment}
              stockInfo={props.stockInfo}
            />

            {/* Time Period Tabs */}
            <EnhancedStockChart
              sentiment={props.sentiment}
              previousClosePrice={props.stockQuote.previousClosePrice}
              stockHistory={props.stockHistory}
            />

            {/* Stock Forecast */}
            <StockForecast />

            {/* Stock Info Card */}
            <div className="mt-8">
              <StockInfo stockInfo={props.stockInfo} />
            </div>

            {/* Stock Recommendations */}
            <div className="mt-8">
              <StockRecommendations recommendations={props.recommendations} />
            </div>

            {/* News Section */}
            <div className="mt-8">
              <NewsSection news={props.news} />
            </div>
          </>
        ) : (
          // Desktop Layout (Multi-Column)
          <>
            <div className="grid grid-cols-12 gap-6">
              {/* Left Column - Main Stock Display */}
              <div className="col-span-12 lg:col-span-5 xl:col-span-4">
                <div className="sticky top-6">
                  <div className="mb-6 overflow-hidden rounded-3xl bg-white shadow-lg dark:bg-gray-800">
                    {/* Main Stock Display */}
                    <StockDisplay
                      price={props.stockQuote.currentPrice}
                      change={props.stockQuote.change}
                      changePercent={props.stockQuote.percentChange}
                      sentiment={props.sentiment}
                      stockInfo={props.stockInfo}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Charts, Recommendations, News */}
              <div className="col-span-12 lg:col-span-7 xl:col-span-8">
                {/* Time Period Tabs */}
                <EnhancedStockChart
                  sentiment={props.sentiment}
                  previousClosePrice={props.stockQuote.previousClosePrice}
                  stockHistory={props.stockHistory}
                />

                {/* Two Column Layout for Recommendations and News */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {/* Stock Recommendations */}
                  <div className="flex flex-col gap-6">
                    <StockInfo stockInfo={props.stockInfo} />
                    <StockRecommendations
                      recommendations={props.recommendations}
                    />
                  </div>

                  {/* News Section */}
                  <div className="flex flex-col gap-6">
                    <StockForecast />
                    <NewsSection news={props.news} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
          <div className="flex flex-row gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Data from Finnhub
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">|</span>
            <a
              className="text-xs text-gray-500 dark:text-gray-400"
              href="https://parqet.com/api"
            >
              Logos provided by Parqet
            </a>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Updated just now
          </span>
        </div>
      </div>
    </div>
  );
}
