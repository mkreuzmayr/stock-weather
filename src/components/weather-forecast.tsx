"use client"

import { Cloud, CloudRain, Sun, CloudLightning } from "lucide-react"
import { useTheme } from "next-themes"

interface ForecastDay {
  day: string
  condition: string
  high: number
  low: number
}

interface WeatherForecastProps {
  forecast: ForecastDay[]
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  const { theme } = useTheme()

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-700 dark:text-gray-400" />
      case "rain":
        return <CloudRain className="h-6 w-6 text-blue-500 dark:text-blue-400" />
      case "storm":
        return <CloudLightning className="h-6 w-6 text-purple-500 dark:text-purple-400" />
      default:
        return <Cloud className="h-6 w-6 text-gray-700 dark:text-gray-400" />
    }
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "sunny":
        return theme === "dark" ? "#fbbf24" : "#f59e0b" // Yellow-400/500
      case "cloudy":
        return theme === "dark" ? "#9ca3af" : "#6b7280" // Gray-400/500
      case "rain":
        return theme === "dark" ? "#60a5fa" : "#3b82f6" // Blue-400/500
      case "storm":
        return theme === "dark" ? "#c084fc" : "#8b5cf6" // Purple-400/500
      default:
        return theme === "dark" ? "#9ca3af" : "#6b7280" // Gray-400/500
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {forecast.slice(0, 7).map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{day.day}</div>
            <div className="mb-1">{getWeatherIcon(day.condition)}</div>
            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{day.high}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{day.low}</div>
          </div>
        ))}
        <div className="flex flex-col items-center">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">MORE</div>
          <div className="h-6 flex items-center justify-center mb-1">
            <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600 mx-0.5"></div>
            <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600 mx-0.5"></div>
            <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600 mx-0.5"></div>
          </div>
          <div className="text-sm font-bold text-transparent">00</div>
          <div className="text-xs text-transparent">00</div>
        </div>
      </div>
    </div>
  )
}
