'use client';

import { ReactNode } from 'react';
import { Header } from '~/components/header';
import { useMobile } from '~/hooks/use-mobile';
import { Footer } from './footer';

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
        className={`container mx-auto px-4 py-6 max-w-md md:max-w-7xl`}
      >
        <Header />

        {isMobile ? (
          // Mobile Layout (Single Column)
          <>
            {props.widgets.weather}
            {props.widgets.chart}
            {props.widgets.forecast}
            <div className="mt-8">{props.widgets.companyInfo}</div>
            <div className="mt-8">{props.widgets.recommendations}</div>
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
                    {props.widgets.weather}
                  </div>
                </div>
              </div>

              {/* Right Column - Charts, Recommendations, News */}
              <div className="col-span-12 lg:col-span-7 xl:col-span-8">
                {props.widgets.chart}

                {/* Two Column Layout for Recommendations and News */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                  <div className="flex flex-col gap-6">
                    {props.widgets.companyInfo}
                    {props.widgets.recommendations}
                  </div>

                  <div className="flex flex-col gap-6">
                    {props.widgets.forecast}
                    {props.widgets.news}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <Footer />
      </div>
    </div>
  );
}
