'use client';

import { ReactNode } from 'react';
import { Header } from '~/components/header';
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
  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-950">
      <div className={`container mx-auto max-w-md py-6 md:max-w-7xl`}>
        <Header />

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Stock Display */}
          <div className="col-span-12 lg:col-span-5 xl:col-span-4">
            <div className="sticky top-6">
              <div className="mb-6 bg-white md:overflow-hidden md:rounded-3xl md:shadow-lg dark:bg-gray-800">
                {props.widgets.weather}
              </div>
            </div>
          </div>

          {/* Right Column - Charts, Recommendations, News */}
          <div className="col-span-12 px-4 lg:col-span-7 xl:col-span-8">
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

        <Footer />
      </div>
    </div>
  );
}
