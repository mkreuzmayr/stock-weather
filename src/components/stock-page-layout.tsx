'use client';

import { ReactNode } from 'react';
import { CommandPalette } from '~/components/command-palette';
import { ThemeToggle } from '~/components/theme-toggle';
import { useMobile } from '~/hooks/use-mobile';
import { cn } from '~/lib/utils';

export function StockPageLayout(props: {
  widgets: {
    chart: ReactNode;
    companyInfo: ReactNode;
    forecast: ReactNode;
    news: ReactNode;
    recommendations: ReactNode;
    weather: ReactNode;
  };
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
            {props.widgets.weather}

            {/* Time Period Tabs */}
            {props.widgets.chart}

            {/* Stock Forecast */}
            {props.widgets.forecast}

            {/* Stock Info Card */}
            <div className="mt-8">{props.widgets.companyInfo}</div>

            {/* Stock Recommendations */}
            <div className="mt-8">{props.widgets.recommendations}</div>

            {/* News Section */}
            <div className="mt-8">{props.widgets.news}</div>
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
                    {props.widgets.weather}
                  </div>
                </div>
              </div>

              {/* Right Column - Charts, Recommendations, News */}
              <div className="col-span-12 lg:col-span-7 xl:col-span-8">
                {/* Time Period Tabs */}
                {props.widgets.chart}

                {/* Two Column Layout for Recommendations and News */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  {/* Stock Recommendations */}
                  <div className="flex flex-col gap-6">
                    {props.widgets.companyInfo}
                    {props.widgets.recommendations}
                  </div>

                  {/* News Section */}
                  <div className="flex flex-col gap-6">
                    {props.widgets.forecast}
                    {props.widgets.news}
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
