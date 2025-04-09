"use client"

import { useEffect, useState, useRef } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface StockChartProps {
  sentiment: string
}

export function StockChart({ sentiment }: StockChartProps) {
  const [data, setData] = useState<{ time: string; value: number }[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [priceDirection, setPriceDirection] = useState<"up" | "down" | "neutral">("neutral")
  const [priceVelocity, setPriceVelocity] = useState<"low" | "medium" | "high">("low")

  // Generate chart data
  useEffect(() => {
    const generateData = () => {
      const now = new Date()
      const data = []

      for (let i = 0; i < 24; i++) {
        const time = new Date(now)
        time.setHours(time.getHours() - 24 + i)

        // Base value with some randomness
        let value = 180 + Math.sin(i / 3) * 5 + (Math.random() - 0.5) * 3

        // Adjust trend based on sentiment
        if (sentiment === "positive") value += i * 0.1
        else if (sentiment === "negative") value -= i * 0.05
        else if (sentiment === "very-negative") value -= i * 0.15

        data.push({
          time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          value: Number.parseFloat(value.toFixed(2)),
        })
      }

      return data
    }

    setData(generateData())

    // Update data periodically
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev]
        newData.shift()

        const lastTime = new Date()
        const lastValue = newData[newData.length - 1].value

        // Add some randomness to the next value
        const change = (Math.random() - 0.5) * 2

        // Adjust based on sentiment
        let newValue = lastValue
        if (sentiment === "positive") newValue += 0.2 + change
        else if (sentiment === "neutral") newValue += change
        else if (sentiment === "negative") newValue += -0.2 + change
        else newValue += -0.4 + change

        // Determine price direction and velocity for animations
        if (newValue > lastValue) {
          setPriceDirection("up")
          const velocity = newValue - lastValue
          if (velocity > 1) setPriceVelocity("high")
          else if (velocity > 0.5) setPriceVelocity("medium")
          else setPriceVelocity("low")
        } else if (newValue < lastValue) {
          setPriceDirection("down")
          const velocity = lastValue - newValue
          if (velocity > 1) setPriceVelocity("high")
          else if (velocity > 0.5) setPriceVelocity("medium")
          else setPriceVelocity("low")
        } else {
          setPriceDirection("neutral")
          setPriceVelocity("low")
        }

        newData.push({
          time: lastTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          value: Number.parseFloat(newValue.toFixed(2)),
        })

        return newData
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [sentiment])

  // Background animations
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Animation variables
    let particles: any[] = []
    let animationFrameId: number

    // Create particles based on sentiment and price movement
    const createParticles = () => {
      // Keep some existing particles for continuity
      if (particles.length > 50) {
        particles = particles.slice(0, 50)
      } else {
        particles = []
      }

      // Determine particle count based on price velocity
      let particleCount = 30
      if (priceVelocity === "medium") particleCount = 40
      if (priceVelocity === "high") particleCount = 50

      // Determine particle direction based on price direction
      const directionMultiplier = priceDirection === "up" ? -1 : priceDirection === "down" ? 1 : 0

      switch (sentiment) {
        case "positive": // Vibrant particles
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 3 + 1,
              speedX: (Math.random() - 0.5) * 0.5,
              speedY: (Math.random() - 0.5) * 0.5 + directionMultiplier * 0.2,
              color:
                priceDirection === "up"
                  ? `rgba(${45 + Math.floor(Math.random() * 30)}, ${212 + Math.floor(Math.random() * 30)}, ${191 + Math.floor(Math.random() * 30)}, 0.3)` // Teal variations
                  : `rgba(${167 + Math.floor(Math.random() * 30)}, ${139 + Math.floor(Math.random() * 30)}, ${250 + Math.floor(Math.random() * 30)}, 0.3)`, // Purple variations
              life: Math.random() * 100 + 100,
            })
          }
          break

        case "neutral": // Floating dots
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 4 + 1,
              speedX: (Math.random() - 0.5) * 0.3,
              speedY: (Math.random() - 0.5) * 0.3 + directionMultiplier * 0.15,
              color: `rgba(${125 + Math.floor(Math.random() * 50)}, ${211 + Math.floor(Math.random() * 30)}, ${252 + Math.floor(Math.random() * 30)}, 0.2)`, // Cyan variations
              life: Math.random() * 100 + 100,
            })
          }
          break

        case "negative": // Subtle rain
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 1.5 + 0.5,
              length: Math.random() * 10 + 5,
              speedX: (Math.random() - 0.5) * 0.5,
              speedY: Math.random() * 3 + 2 + Math.abs(directionMultiplier) * 1,
              color: `rgba(${190 + Math.floor(Math.random() * 30)}, ${120 + Math.floor(Math.random() * 30)}, ${255 + Math.floor(Math.random() * 30)}, 0.15)`, // Purple-pink variations
              life: Math.random() * 100 + 100,
            })
          }
          break

        case "very-negative": // More intense rain and occasional flashes
          for (let i = 0; i < particleCount; i++) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 1.5 + 0.5,
              length: Math.random() * 15 + 10,
              speedX: Math.random() * 1 - 0.5,
              speedY: Math.random() * 4 + 3 + Math.abs(directionMultiplier) * 2,
              color: `rgba(${236 + Math.floor(Math.random() * 20)}, ${72 + Math.floor(Math.random() * 30)}, ${153 + Math.floor(Math.random() * 30)}, 0.15)`, // Pink variations
              life: Math.random() * 100 + 100,
            })
          }

          // Add occasional flash for significant price drops
          if (priceDirection === "down" && priceVelocity === "high" && Math.random() < 0.2) {
            particles.push({
              type: "flash",
              alpha: 0.1,
              color: "rgba(236, 72, 153, 0.2)", // Pink flash
              life: 20,
            })
          }
          break
      }
    }

    // Draw particles
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Remove dead particles
      particles = particles.filter((p) => p.life > 0)

      particles.forEach((p, index) => {
        p.life--

        if (p.type === "flash") {
          // Full screen flash for lightning effect
          ctx.fillStyle = p.color || `rgba(250, 204, 21, ${p.alpha})`
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          p.alpha -= 0.01
          if (p.alpha <= 0) {
            particles.splice(index, 1)
          }
        } else if (sentiment === "negative" || sentiment === "very-negative") {
          // Draw rain
          ctx.strokeStyle = p.color
          ctx.lineWidth = p.size
          ctx.beginPath()
          ctx.moveTo(p.x, p.y)
          ctx.lineTo(p.x + p.speedX * 0.5, p.y + p.length)
          ctx.stroke()

          // Move rain
          p.x += p.speedX
          p.y += p.speedY

          // Reset position when off screen
          if (p.y > canvas.height) {
            p.y = -p.length
            p.x = Math.random() * canvas.width
          }
        } else {
          // Draw particles
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()

          // Move particles
          p.x += p.speedX
          p.y += p.speedY

          // Bounce off edges
          if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
          if (p.y < 0 || p.y > canvas.height) p.speedY *= -1
        }
      })

      // Add new flash occasionally for very-negative sentiment
      if (sentiment === "very-negative" && priceDirection === "down" && Math.random() < 0.005) {
        particles.push({
          type: "flash",
          alpha: 0.1,
          color: "rgba(236, 72, 153, 0.2)", // Pink flash
          life: 20,
        })
      }

      animationFrameId = requestAnimationFrame(drawParticles)
    }

    createParticles()
    drawParticles()

    // Create new particles when price direction changes
    const directionChangeInterval = setInterval(createParticles, 2000)

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
      clearInterval(directionChangeInterval)
    }
  }, [sentiment, priceDirection, priceVelocity])

  // Determine chart color based on sentiment
  const getChartColor = () => {
    switch (sentiment) {
      case "positive":
        return "#2dd4bf" // teal-400
      case "neutral":
        return "#7dd3fc" // sky-300
      case "negative":
        return "#c084fc" // purple-400
      case "very-negative":
        return "#f472b6" // pink-400
      default:
        return "#7dd3fc" // sky-300
    }
  }

  const chartColor = getChartColor()

  return (
    <div className="w-full h-[250px] mt-4 relative">
      {/* Background animations */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Gradient overlay - refined for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b] via-[#1e1b4b]/80 to-transparent z-10" />

      {/* Chart */}
      <div className="absolute inset-0 z-20">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              interval="preserveStartEnd"
              minTickGap={50}
            />
            <YAxis
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(30, 27, 75, 0.95)",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                padding: "12px",
                color: "#e2e8f0",
              }}
              labelStyle={{ fontWeight: "bold", marginBottom: "8px", color: "#e2e8f0" }}
              formatter={(value) => [`$${value}`, "Price"]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
              activeDot={{ r: 8, strokeWidth: 0, fill: chartColor }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
