'use client';

import { Cloud, CloudLightning, CloudRain, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function StockForecast() {
  const { theme } = useTheme();

  // Mock forecast data with weather-like conditions
  const forecast = [
    {
      day: 'TODAY',
      trend: 'up',
      condition: 'sunny',
      high: 183.25,
      low: 180.15,
    },
    { day: 'TUE', trend: 'up', condition: 'sunny', high: 185.4, low: 182.3 },
    {
      day: 'WED',
      trend: 'down',
      condition: 'cloudy',
      high: 184.75,
      low: 181.2,
    },
    { day: 'THU', trend: 'down', condition: 'rainy', high: 183.5, low: 180.6 },
    { day: 'FRI', trend: 'up', condition: 'sunny', high: 186.2, low: 183.1 },
    { day: 'MON', trend: 'down', condition: 'rainy', high: 185.3, low: 182.4 },
    { day: 'TUE', trend: 'down', condition: 'storm', high: 184.5, low: 181.25 },
  ];

  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />;
      case 'cloudy':
        return <Cloud className="h-6 w-6 text-gray-700 dark:text-gray-400" />;
      case 'rainy':
        return (
          <CloudRain className="h-6 w-6 text-blue-500 dark:text-blue-400" />
        );
      case 'storm':
        return (
          <CloudLightning className="h-6 w-6 text-purple-500 dark:text-purple-400" />
        );
      default:
        return <Cloud className="h-6 w-6 text-gray-700 dark:text-gray-400" />;
    }
  };

  return (
    <div className="rounded-3xl bg-white p-4 shadow-lg dark:bg-gray-800">
      <div className="mb-4 flex items-center justify-between">
        {forecast.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              {day.day}
            </div>
            <div className="mb-1">{getConditionIcon(day.condition)}</div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {day.high.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {day.low.toFixed(1)}
            </div>
          </div>
        ))}
        <div className="flex flex-col items-center">
          <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            MORE
          </div>
          <div className="mb-1 flex h-6 items-center justify-center">
            <div className="mx-0.5 h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-600"></div>
            <div className="mx-0.5 h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-600"></div>
            <div className="mx-0.5 h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-600"></div>
          </div>
          <div className="text-sm font-bold text-transparent">00</div>
          <div className="text-xs text-transparent">00</div>
        </div>
      </div>
    </div>
  );
}
