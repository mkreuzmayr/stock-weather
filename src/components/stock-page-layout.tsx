'use client';

import { useQueryState } from 'nuqs';
import { CommandPalette } from '~/components/command-palette';
import { EnhancedStockChart } from '~/components/enhanced-stock-chart';
import { NewsSection } from '~/components/news-section';
import { StockDisplay } from '~/components/stock-display';
import { StockForecast } from '~/components/stock-forecast';
import { StockRecommendations } from '~/components/stock-recommendations';
import { ThemeToggle } from '~/components/theme-toggle';
import { Tabs, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { StockSentiment } from '~/data/get-sentiment';
import { RecommendationItem } from '~/data/get-similar-stocks';
import { useMobile } from '~/hooks/use-mobile';
import { StockDetails, StockQuote } from '~/lib/finnhub';
import { NewsItem, Timeframe } from '~/lib/polygon';
import { cn } from '~/lib/utils';
import { StockInfo } from './stock-info';

type AggregateBar = {
  c?: number;
  h?: number;
  l?: number;
  n?: number;
  o?: number;
  t?: number;
  v?: number;
  vw?: number;
};

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

  const [timeframe, setTimeframe] = useQueryState<Timeframe>('timeframe', {
    defaultValue: '1D',
    parse: (v) => v as Timeframe,
    history: 'push',
    shallow: false,
  });

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
            {/* Command Palette - Center for desktop, right for mobile */}
            <div
              className={cn(
                !isMobile && 'flex w-[270px] flex-1 justify-center'
              )}
            >
              <CommandPalette />
            </div>
            {/* <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button> */}
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
            <div className="mb-6">
              <Tabs
                value={props.timeframe}
                className="w-full"
                onValueChange={(value) => setTimeframe(value as Timeframe)}
              >
                <TabsList className="grid grid-cols-5 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
                  <TabsTrigger
                    value="1D"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                  >
                    1D
                  </TabsTrigger>
                  <TabsTrigger
                    value="1W"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                  >
                    1W
                  </TabsTrigger>
                  <TabsTrigger
                    value="1M"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                  >
                    1M
                  </TabsTrigger>
                  <TabsTrigger
                    value="3M"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                  >
                    3M
                  </TabsTrigger>
                  <TabsTrigger
                    value="1Y"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                  >
                    1Y
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Enhanced Chart for Mobile */}
              <div className="mt-4 rounded-xl bg-white p-4 shadow-md dark:bg-gray-800">
                <EnhancedStockChart
                  sentiment={props.sentiment}
                  timeframe={timeframe}
                  previousClosePrice={props.stockQuote.previousClosePrice}
                  stockHistory={props.stockHistory}
                />
              </div>
            </div>

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
                <div className="mb-6 flex rounded-3xl bg-white p-6 shadow-lg dark:bg-gray-800">
                  <Tabs
                    value={timeframe}
                    className="w-full"
                    onValueChange={(value) => setTimeframe(value as Timeframe)}
                  >
                    <div className="flex flex-row items-center justify-between">
                      <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Price Chart
                      </h2>
                      <TabsList className="mb-4 grid grid-cols-5 rounded-xl bg-gray-100 p-1 dark:bg-gray-800">
                        <TabsTrigger
                          value="1D"
                          className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                        >
                          1D
                        </TabsTrigger>
                        <TabsTrigger
                          value="1W"
                          className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                        >
                          1W
                        </TabsTrigger>
                        <TabsTrigger
                          value="1M"
                          className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                        >
                          1M
                        </TabsTrigger>
                        <TabsTrigger
                          value="3M"
                          className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                        >
                          3M
                        </TabsTrigger>
                        <TabsTrigger
                          value="1Y"
                          className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700"
                        >
                          1Y
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    {/* Enhanced Chart for Desktop */}
                    <EnhancedStockChart
                      sentiment={props.sentiment}
                      timeframe={timeframe}
                      previousClosePrice={props.stockQuote.previousClosePrice}
                      stockHistory={props.stockHistory}
                    />
                  </Tabs>
                </div>

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
