"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceArea,
  ReferenceLine,
} from "recharts"
import { useMobile } from "~/hooks/use-mobile"
import { ArrowUp, ArrowDown, Clock, DollarSign, TrendingUp, Activity, RefreshCw } from "lucide-react"

interface EnhancedStockChartProps {
  sentiment: string
  timeframe: string
}

export function EnhancedStockChart({ sentiment, timeframe }: EnhancedStockChartProps) {
  const [data, setData] = useState<any[]>([])
  const [fullData, setFullData] = useState<any[]>([])
  const [hoveredData, setHoveredData] = useState<any | null>(null)
  const [zoomState, setZoomState] = useState<{
    refAreaLeft: string | null
    refAreaRight: string | null
    zooming: boolean
  }>({
    refAreaLeft: null,
    refAreaRight: null,
    zooming: false,
  })
  const { theme } = useTheme()
  const isMobile = useMobile()
  const chartRef = useRef<HTMLDivElement>(null)
  const [volumeVisible, setVolumeVisible] = useState(true)
  const [previousClose, setPreviousClose] = useState(180)

  // Generate chart data based on timeframe and sentiment
  useEffect(() => {
    const generateData = () => {
      const now = new Date()
      const data = []
      let dataPoints = 0
      let timeFormat = ""
      let timeStep = 0

      // Configure based on timeframe
      switch (timeframe) {
        case "1D":
          dataPoints = 24
          timeFormat = "HH:mm"
          timeStep = 60 * 60 * 1000 // 1 hour in ms
          break
        case "1W":
          dataPoints = 35
          timeFormat = "ddd"
          timeStep = (24 * 60 * 60 * 1000) / 5 // 1/5 day in ms (more granular)
          break
        case "1M":
          dataPoints = 30
          timeFormat = "MMM D"
          timeStep = 24 * 60 * 60 * 1000 // 1 day in ms
          break
        case "3M":
          dataPoints = 90
          timeFormat = "MMM D"
          timeStep = 24 * 60 * 60 * 1000 // 1 day in ms
          break
        case "1Y":
          dataPoints = 250
          timeFormat = "MMM"
          timeStep = 24 * 60 * 60 * 1000 // 1 day in ms
          break
        default:
          dataPoints = 24
          timeFormat = "HH:mm"
          timeStep = 60 * 60 * 1000 // 1 hour in ms
      }

      // Base value and volatility based on sentiment
      const baseValue = 180
      let volatility = 0
      let trend = 0

      switch (sentiment) {
        case "positive":
          volatility = 0.5
          trend = 0.2
          break
        case "neutral":
          volatility = 0.8
          trend = 0.05
          break
        case "negative":
          volatility = 1.2
          trend = -0.15
          break
        case "very-negative":
          volatility = 2
          trend = -0.3
          break
      }

      // Set previous close value
      setPreviousClose(baseValue)

      // Generate the data points
      for (let i = 0; i < dataPoints; i++) {
        const time = new Date(now.getTime() - (dataPoints - i) * timeStep)

        // Calculate value with trend and random noise
        const trendComponent = (trend * i) / (dataPoints / 10)
        const randomComponent = (Math.random() - 0.5) * volatility * 2

        // Add some cyclical patterns
        const cyclicalComponent = Math.sin(i / (dataPoints / 8)) * (volatility * 2)

        const value = baseValue + trendComponent + randomComponent + cyclicalComponent

        // Add volume data - higher on price movements
        const volumeBase = 500000 + Math.random() * 500000
        const volumeMultiplier = 1 + Math.abs(randomComponent) * 5
        const volume = Math.floor(volumeBase * volumeMultiplier)

        // Format time based on timeframe
        let formattedTime
        if (timeframe === "1D") {
          formattedTime = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        } else if (timeframe === "1W") {
          const day = time.toLocaleDateString([], { weekday: "short" })
          const hour = time.getHours()
          formattedTime = `${day} ${hour}:00`
        } else if (timeframe === "1M" || timeframe === "3M") {
          formattedTime = time.toLocaleDateString([], { month: "short", day: "numeric" })
        } else {
          const month = time.toLocaleDateString([], { month: "short" })
          const day = time.getDate()
          formattedTime = day === 1 || i === 0 || i === dataPoints - 1 ? month : ""
        }

        // Add some market events for interesting data points
        let event = null
        if (Math.random() < 0.05 && i > 5 && i < dataPoints - 5) {
          const events = ["Earnings Report", "Product Launch", "CEO Statement", "Market News", "Analyst Upgrade"]
          event = events[Math.floor(Math.random() * events.length)]
        }

        data.push({
          time: formattedTime,
          value: Number.parseFloat(value.toFixed(2)),
          volume: volume,
          timestamp: time.getTime(),
          event: event,
          index: i,
        })
      }

      return data
    }

    const generatedData = generateData()
    setFullData(generatedData)
    setData(generatedData)
  }, [timeframe, sentiment])

  // Get chart color based on sentiment
  const getChartColor = () => {
    const isDark = theme === "dark"

    switch (sentiment) {
      case "positive":
        return isDark ? "#10b981" : "#f43f5e" // Green in dark mode, Red in light mode
      case "neutral":
        return isDark ? "#60a5fa" : "#f97316" // Blue in dark mode, Orange in light mode
      case "negative":
        return isDark ? "#8b5cf6" : "#6366f1" // Purple in dark mode, Indigo in light mode
      case "very-negative":
        return isDark ? "#ec4899" : "#db2777" // Pink in dark mode, darker pink in light mode
      default:
        return isDark ? "#60a5fa" : "#f97316" // Default to neutral colors
    }
  }

  // Format large numbers (for volume)
  const formatLargeNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`
    }
    return num.toString()
  }

  // Handle zoom start
  const handleZoomStart = (e: any) => {
    if (!e || !e.activeLabel) return

    setZoomState({
      refAreaLeft: e.activeLabel,
      refAreaRight: null,
      zooming: true,
    })
  }

  // Handle zoom move
  const handleZoomMove = (e: any) => {
    if (!zoomState.zooming || !e || !e.activeLabel) return

    setZoomState({
      ...zoomState,
      refAreaRight: e.activeLabel,
    })
  }

  // Handle zoom end
  const handleZoomEnd = () => {
    if (!zoomState.zooming || !zoomState.refAreaLeft || !zoomState.refAreaRight) {
      setZoomState({
        refAreaLeft: null,
        refAreaRight: null,
        zooming: false,
      })
      return
    }

    // Find indices of the zoom area
    const leftIndex = data.findIndex((item) => item.time === zoomState.refAreaLeft)
    const rightIndex = data.findIndex((item) => item.time === zoomState.refAreaRight)

    // Ensure left is before right
    const startIndex = Math.min(leftIndex, rightIndex)
    const endIndex = Math.max(leftIndex, rightIndex)

    // If zoom area is too small, cancel zoom
    if (endIndex - startIndex < 2) {
      setZoomState({
        refAreaLeft: null,
        refAreaRight: null,
        zooming: false,
      })
      return
    }

    // Apply zoom
    const zoomedData = data.slice(startIndex, endIndex + 1)
    setData(zoomedData)

    // Reset zoom state
    setZoomState({
      refAreaLeft: null,
      refAreaRight: null,
      zooming: false,
    })
  }

  // Reset zoom
  const resetZoom = () => {
    setData(fullData)
  }

  // Toggle volume display
  const toggleVolume = () => {
    setVolumeVisible(!volumeVisible)
  }

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload

      return (
        <div className="bg-white/95 dark:bg-gray-800/95 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">{data.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="font-medium text-gray-900 dark:text-gray-100">${data.value.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Volume</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{formatLargeNumber(data.volume)}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">vs. Prev Close</div>
                <div className="flex items-center">
                  {data.value > previousClose ? (
                    <>
                      <ArrowUp className="h-3 w-3 text-emerald-500 mr-1" />
                      <span className="text-emerald-500 font-medium">
                        +{(data.value - previousClose).toFixed(2)} (
                        {((data.value / previousClose - 1) * 100).toFixed(2)}%)
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="h-3 w-3 text-rose-500 mr-1" />
                      <span className="text-rose-500 font-medium">
                        {(data.value - previousClose).toFixed(2)} ({((data.value / previousClose - 1) * 100).toFixed(2)}
                        %)
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {data.event && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">Event</div>
              <div className="font-medium text-gray-900 dark:text-gray-100">{data.event}</div>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  // Get chart gradient colors
  const chartColor = getChartColor()

  return (
    <div className="relative" ref={chartRef}>
      {/* Chart controls */}
      <div className="absolute top-2 right-2 z-30 flex gap-2">
        <button
          onClick={resetZoom}
          className="p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700"
          title="Reset zoom"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
        <button
          onClick={toggleVolume}
          className={`p-1.5 rounded-full ${volumeVisible ? "bg-white/80 dark:bg-gray-800/80" : "bg-gray-200/80 dark:bg-gray-700/80"} hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700`}
          title={volumeVisible ? "Hide volume" : "Show volume"}
        >
          <Activity className="h-4 w-4" />
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute top-2 left-2 z-30">
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
          Click and drag to zoom
        </div>
      </div>

      {/* Chart */}
      <div className={`w-full ${isMobile ? "h-[250px]" : "h-[400px]"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            onMouseDown={handleZoomStart}
            onMouseMove={handleZoomMove}
            onMouseUp={handleZoomEnd}
          >
            <defs>
              <linearGradient id={`colorValue-${sentiment}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            />

            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme === "dark" ? "#94a3b8" : "#64748b" }}
              interval="preserveStartEnd"
              minTickGap={isMobile ? 30 : 50}
              allowDataOverflow={true}
            />

            <YAxis
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: theme === "dark" ? "#94a3b8" : "#64748b" }}
              width={40}
              tickFormatter={(value) => `$${value}`}
              allowDataOverflow={true}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Previous close reference line */}
            <ReferenceLine
              y={previousClose}
              stroke={theme === "dark" ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
              strokeDasharray="3 3"
              label={{
                value: "Prev Close",
                position: "insideBottomRight",
                fill: theme === "dark" ? "#94a3b8" : "#64748b",
                fontSize: 10,
              }}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#colorValue-${sentiment})`}
              activeDot={{
                r: 6,
                strokeWidth: 2,
                fill: chartColor,
                stroke: theme === "dark" ? "#1e293b" : "#ffffff",
              }}
              isAnimationActive={true}
              animationDuration={500}
            />

            {/* Zoom area */}
            {zoomState.refAreaLeft && zoomState.refAreaRight && (
              <ReferenceArea
                x1={zoomState.refAreaLeft}
                x2={zoomState.refAreaRight}
                strokeOpacity={0.3}
                fill={theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume bars at the bottom */}
      {volumeVisible && (
        <div className={`w-full ${isMobile ? "h-[50px]" : "h-[80px]"} mt-2`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={false} height={0} />
              <YAxis domain={[0, "dataMax"]} axisLine={false} tickLine={false} tick={false} width={0} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="none"
                fillOpacity={0.5}
                fill={`${chartColor}40`}
                isAnimationActive={true}
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Event markers */}
      <div className="absolute inset-0 pointer-events-none">
        {data
          .filter((d) => d.event)
          .map((point, index) => {
            // Find position in the chart
            const chartWidth = chartRef.current?.clientWidth || 0
            const position = (point.index / (data.length - 1)) * chartWidth

            return (
              <div key={index} className="absolute top-2" style={{ left: `${position}px` }}>
                <div className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse"></div>
              </div>
            )
          })}
      </div>
    </div>
  )
}
