'use client';

import { ArrowDown, ArrowUp, Droplets, Eye, Moon, Wind } from 'lucide-react';

interface WeatherDetailsProps {
  weatherData: {
    sunrise: string;
    sunset: string;
    moonPhase: string;
    humidity: number;
    windSpeed: string;
    windDirection: string;
    precipitation: string;
    visibility: string;
    uvIndex: number;
    dewPoint: number;
    pressure: number;
    feelsLike: number;
  };
}

export function WeatherDetails({ weatherData }: WeatherDetailsProps) {
  return (
    <div className="mt-8 rounded-3xl bg-gray-100 p-4 dark:bg-gray-900">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
              <Wind className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Wind</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {weatherData.windSpeed} {weatherData.windDirection}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
              <Droplets className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Humidity
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {weatherData.humidity}%
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
              <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Visibility
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {weatherData.visibility}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
              <ArrowUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Sunrise
              </p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {weatherData.sunrise}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-indigo-100 p-2 dark:bg-indigo-900/30">
              <ArrowDown className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sunset</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {weatherData.sunset}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-gray-100 p-2 dark:bg-gray-800">
              <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Moon</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">
                {weatherData.moonPhase}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
