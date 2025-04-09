"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { ArrowUp, ArrowDown, Sparkles } from "lucide-react"
import { useMobile } from "~/hooks/use-mobile"

interface StockDisplayProps {
  price: number
  change: number
  changePercent: number
  sentiment: string
}

export function StockDisplay({ price, change, changePercent, sentiment }: StockDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const isMobile = useMobile()

  // 3D stock visualization animation
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
    let lastTimestamp = 0
    let elapsedTime = 0

    // Create weather elements based on sentiment
    const createWeather = () => {
      particles = []
      const isDark = theme === "dark"
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2 - 20

      switch (sentiment) {
        case "positive": // Sunny - bright sun with rays, no clouds
          // Create sun
          const sunRadius = Math.min(canvas.width, canvas.height) * 0.25
          particles.push({
            type: "sun",
            x: centerX,
            y: centerY,
            radius: sunRadius,
            color: isDark ? "#10b981" : "#f43f5e", // Green in dark mode, Red in light mode
            shadowColor: isDark ? "rgba(16, 185, 129, 0.3)" : "rgba(244, 63, 94, 0.3)",
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            texture: true,
            pulseSpeed: 0.002,
            pulseAmount: 0.05,
            pulseValue: 0,
          })

          // Create sun rays
          for (let i = 0; i < 12; i++) {
            const angle = ((Math.PI * 2) / 12) * i
            const length = sunRadius * 0.8

            particles.push({
              type: "ray",
              x: centerX,
              y: centerY,
              angle: angle,
              length: length,
              width: 3 + Math.random() * 2,
              speed: 0.0005,
              color: isDark ? "#10b981" : "#f43f5e",
              alpha: 0.7 + Math.random() * 0.3,
            })
          }

          // Add small sparkles around the sun
          for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2
            const distance = sunRadius * (1.2 + Math.random() * 0.5)

            particles.push({
              type: "sparkle",
              x: centerX + Math.cos(angle) * distance,
              y: centerY + Math.sin(angle) * distance,
              size: 1 + Math.random() * 2,
              alpha: 0.3 + Math.random() * 0.7,
              alphaSpeed: 0.005 + Math.random() * 0.01,
              alphaDirection: Math.random() > 0.5 ? 1 : -1,
              color: isDark ? "#34d399" : "#fb7185", // Lighter variant
            })
          }
          break

        case "neutral": // Neutral - sun partially obscured by clouds
          // Create sun (slightly smaller)
          const neutralSunRadius = Math.min(canvas.width, canvas.height) * 0.22
          particles.push({
            type: "sun",
            x: centerX - neutralSunRadius * 0.5, // Offset to left to make room for clouds
            y: centerY,
            radius: neutralSunRadius,
            color: isDark ? "#60a5fa" : "#f97316", // Blue in dark mode, Orange in light mode
            shadowColor: isDark ? "rgba(96, 165, 250, 0.3)" : "rgba(249, 115, 22, 0.3)",
            shadowBlur: 25,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            texture: true,
            pulseSpeed: 0.002,
            pulseAmount: 0.05,
            pulseValue: 0,
          })

          // Create partial sun rays (only on visible side)
          for (let i = 0; i < 6; i++) {
            const angle = ((Math.PI * 1.5) / 6) * i - Math.PI / 4 // Only on left side
            const length = neutralSunRadius * 0.7

            particles.push({
              type: "ray",
              x: centerX - neutralSunRadius * 0.5,
              y: centerY,
              angle: angle,
              length: length,
              width: 2 + Math.random() * 2,
              speed: 0.0005,
              color: isDark ? "#60a5fa" : "#f97316",
              alpha: 0.6 + Math.random() * 0.3,
            })
          }

          // Create varied clouds that partially obscure the sun
          const cloudCount = 5
          for (let i = 0; i < cloudCount; i++) {
            // Create cloud with multiple bubbles
            const size = 30 + Math.random() * 40
            const xPos =
              i === 0
                ? centerX + neutralSunRadius * 0.3 // First cloud over the sun
                : centerX + Math.random() * canvas.width * 0.4 - canvas.width * 0.2
            const yPos = i === 0 ? centerY : centerY + Math.random() * canvas.height * 0.3 - canvas.height * 0.15

            const bubbleCount = 3 + Math.floor(Math.random() * 3)
            const bubbles = []

            for (let j = 0; j < bubbleCount; j++) {
              const bubbleSize = size * (0.6 + Math.random() * 0.4)
              const offsetX = j * (size * 0.4) - (bubbleCount * size * 0.2) / 2
              const offsetY = Math.random() * 10 - 5

              bubbles.push({
                x: offsetX,
                y: offsetY,
                radius: bubbleSize / 2,
              })
            }

            particles.push({
              type: "cloud",
              x: xPos,
              y: yPos,
              size: size,
              bubbles: bubbles,
              speed: (Math.random() * 0.2 - 0.1) * 0.5, // Slower movement
              color: isDark ? "#1e293b" : "#0f172a", // Slate-800 or Slate-900
              shadowColor: isDark ? "rgba(30, 41, 59, 0.4)" : "rgba(15, 23, 42, 0.4)",
              shadowBlur: 10,
              shadowOffsetX: 3,
              shadowOffsetY: 3,
              opacity: 0.8 + Math.random() * 0.2,
            })
          }
          break

        case "negative": // Bad - rain with subtle sun and clouds
          // Create subtle sun (smaller and less bright)
          const rainySunRadius = Math.min(canvas.width, canvas.height) * 0.18
          particles.push({
            type: "sun",
            x: centerX - rainySunRadius,
            y: centerY - rainySunRadius * 0.5,
            radius: rainySunRadius,
            color: isDark ? "#8b5cf6" : "#6366f1", // Purple in dark mode, Indigo in light mode
            shadowColor: isDark ? "rgba(139, 92, 246, 0.2)" : "rgba(99, 102, 241, 0.2)",
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            texture: true,
            pulseSpeed: 0.001,
            pulseAmount: 0.03,
            pulseValue: 0,
            opacity: 0.7, // Less visible
          })

          // Create more clouds (rain clouds)
          const rainCloudCount = 7
          for (let i = 0; i < rainCloudCount; i++) {
            const size = 35 + Math.random() * 45
            const xPos = Math.random() * canvas.width
            const yPos = Math.random() * (canvas.height * 0.4)

            const bubbleCount = 4 + Math.floor(Math.random() * 3)
            const bubbles = []

            for (let j = 0; j < bubbleCount; j++) {
              const bubbleSize = size * (0.6 + Math.random() * 0.4)
              const offsetX = j * (size * 0.4) - (bubbleCount * size * 0.2) / 2
              const offsetY = Math.random() * 10 - 5

              bubbles.push({
                x: offsetX,
                y: offsetY,
                radius: bubbleSize / 2,
              })
            }

            particles.push({
              type: "cloud",
              x: xPos,
              y: yPos,
              size: size,
              bubbles: bubbles,
              speed: (Math.random() * 0.2 - 0.1) * 0.7,
              color: isDark ? "#1e293b" : "#0f172a",
              shadowColor: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(15, 23, 42, 0.5)",
              shadowBlur: 15,
              shadowOffsetX: 4,
              shadowOffsetY: 4,
              opacity: 0.9 + Math.random() * 0.1,
            })
          }

          // Create rain drops
          for (let i = 0; i < 80; i++) {
            particles.push({
              type: "rain",
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: 1 + Math.random() * 1.5,
              length: 10 + Math.random() * 15,
              speedX: Math.random() * 1 - 0.5,
              speedY: 10 + Math.random() * 10,
              color: isDark ? "rgba(139, 92, 246, 0.5)" : "rgba(99, 102, 241, 0.5)",
            })
          }
          break

        case "very-negative": // Very Bad - heavy rain, thunder, dense clouds
          // Create dense storm clouds
          const stormCloudCount = 9
          for (let i = 0; i < stormCloudCount; i++) {
            const size = 40 + Math.random() * 50
            const xPos = Math.random() * canvas.width
            const yPos = Math.random() * (canvas.height * 0.5)

            const bubbleCount = 5 + Math.floor(Math.random() * 3)
            const bubbles = []

            for (let j = 0; j < bubbleCount; j++) {
              const bubbleSize = size * (0.6 + Math.random() * 0.4)
              const offsetX = j * (size * 0.4) - (bubbleCount * size * 0.2) / 2
              const offsetY = Math.random() * 12 - 6

              bubbles.push({
                x: offsetX,
                y: offsetY,
                radius: bubbleSize / 2,
              })
            }

            particles.push({
              type: "cloud",
              x: xPos,
              y: yPos,
              size: size,
              bubbles: bubbles,
              speed: (Math.random() * 0.3 - 0.15) * 0.8,
              color: isDark ? "#0f172a" : "#020617", // Darker clouds
              shadowColor: isDark ? "rgba(15, 23, 42, 0.6)" : "rgba(2, 6, 23, 0.6)",
              shadowBlur: 20,
              shadowOffsetX: 5,
              shadowOffsetY: 5,
              opacity: 0.95 + Math.random() * 0.05,
            })
          }

          // Create heavy rain
          for (let i = 0; i < 150; i++) {
            particles.push({
              type: "rain",
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: 1.5 + Math.random() * 2,
              length: 15 + Math.random() * 20,
              speedX: Math.random() * 2 - 1,
              speedY: 15 + Math.random() * 15,
              color: isDark ? "rgba(236, 72, 153, 0.6)" : "rgba(219, 39, 119, 0.6)",
            })
          }

          // Add lightning
          particles.push({
            type: "lightning",
            active: false,
            alpha: 0,
            points: [],
            nextTime: Math.random() * 2000,
            color: isDark ? "rgba(236, 72, 153, 1)" : "rgba(219, 39, 119, 1)", // Pink
            width: 3,
            branches: [],
          })
          break
      }
    }

    // Draw weather elements
    const drawWeather = (timestamp: number) => {
      // Calculate elapsed time for animations
      if (!lastTimestamp) lastTimestamp = timestamp
      const deltaTime = timestamp - lastTimestamp
      lastTimestamp = timestamp
      elapsedTime += deltaTime

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Sort particles by type for proper layering
      particles.sort((a, b) => {
        const typeOrder = { sun: 1, ray: 2, sparkle: 3, cloud: 4, rain: 5, lightning: 6 }
        return (typeOrder[a.type as keyof typeof typeOrder] || 0) - (typeOrder[b.type as keyof typeof typeOrder] || 0)
      })

      // Process and draw each particle
      particles.forEach((p, index) => {
        switch (p.type) {
          case "sun":
            // Draw sun with pulsing effect
            ctx.save()

            // Add shadow
            if (p.shadowColor && p.shadowBlur) {
              ctx.shadowColor = p.shadowColor
              ctx.shadowBlur = p.shadowBlur
              ctx.shadowOffsetX = p.shadowOffsetX || 0
              ctx.shadowOffsetY = p.shadowOffsetY || 0
            }

            // Animate sun pulsing
            if (p.pulseSpeed && p.pulseAmount) {
              p.pulseValue = (p.pulseValue || 0) + p.pulseSpeed
              const pulseFactor = 1 + Math.sin(p.pulseValue) * p.pulseAmount
              const currentRadius = Math.max(0.1, p.radius * pulseFactor)

              // Create sun gradient
              const sunGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius)

              // Determine colors based on theme and sentiment
              const isDark = theme === "dark"
              let centerColor, midColor, edgeColor

              if (sentiment === "positive") {
                centerColor = isDark ? "#ecfdf5" : "#fff5f5" // Green/Red tint white
                midColor = isDark ? "#34d399" : "#fda4af" // Light green/pink
                edgeColor = p.color // Main color
              } else if (sentiment === "neutral") {
                centerColor = isDark ? "#eff6ff" : "#fff7ed" // Blue/Orange tint white
                midColor = isDark ? "#93c5fd" : "#fdba74" // Light blue/orange
                edgeColor = p.color // Main color
              } else if (sentiment === "negative") {
                centerColor = isDark ? "#f5f3ff" : "#eef2ff" // Purple/Indigo tint white
                midColor = isDark ? "#c4b5fd" : "#a5b4fc" // Light purple/indigo
                edgeColor = p.color // Main color
              } else {
                centerColor = isDark ? "#fce7f3" : "#fdf2f8" // Pink tint white
                midColor = isDark ? "#f9a8d4" : "#f9a8d4" // Light pink
                edgeColor = p.color // Main color
              }

              sunGradient.addColorStop(0, centerColor)
              sunGradient.addColorStop(0.4, midColor)
              sunGradient.addColorStop(1, edgeColor)

              // Draw sun circle with opacity
              ctx.globalAlpha = p.opacity !== undefined ? p.opacity : 1
              ctx.beginPath()
              ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2)
              ctx.fillStyle = sunGradient
              ctx.fill()

              // Add texture if needed
              if (p.texture) {
                const textureGradient = ctx.createRadialGradient(
                  p.x - currentRadius * 0.3,
                  p.y - currentRadius * 0.3,
                  0,
                  p.x,
                  p.y,
                  currentRadius,
                )
                textureGradient.addColorStop(0, "rgba(255, 255, 255, 0.4)")
                textureGradient.addColorStop(1, "rgba(255, 255, 255, 0)")

                ctx.beginPath()
                ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2)
                ctx.fillStyle = textureGradient
                ctx.fill()
              }
            }

            ctx.restore()
            break

          case "ray":
            // Draw sun ray with animation
            ctx.save()

            // Animate ray rotation
            p.angle += p.speed || 0.001
            const rayEndX = p.x + Math.cos(p.angle) * p.length
            const rayEndY = p.y + Math.sin(p.angle) * p.length

            // Create gradient for ray
            const rayGradient = ctx.createLinearGradient(p.x, p.y, rayEndX, rayEndY)
            rayGradient.addColorStop(0, p.color)
            rayGradient.addColorStop(
              1,
              `rgba(${p.color
                .slice(1)
                .match(/../g)
                ?.map((hex) => Number.parseInt(hex, 16))
                .join(", ")}, 0)`,
            )

            ctx.globalAlpha = p.alpha || 0.7
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(rayEndX, rayEndY)
            ctx.strokeStyle = rayGradient
            ctx.lineWidth = p.width || 2
            ctx.stroke()

            ctx.restore()
            break

          case "sparkle":
            // Draw sparkle with pulsing opacity
            ctx.save()

            // Update alpha
            if (p.alphaSpeed && p.alphaDirection) {
              p.alpha += p.alphaSpeed * p.alphaDirection
              if (p.alpha > 1 || p.alpha < 0.1) {
                p.alphaDirection *= -1
              }
            }

            ctx.globalAlpha = p.alpha || 0.5
            ctx.beginPath()
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
            ctx.fillStyle = p.color
            ctx.fill()

            ctx.restore()
            break

          case "cloud":
            // Draw 3D cloud
            ctx.save()

            // Add shadow
            if (p.shadowColor && p.shadowBlur) {
              ctx.shadowColor = p.shadowColor
              ctx.shadowBlur = p.shadowBlur
              ctx.shadowOffsetX = p.shadowOffsetX || 0
              ctx.shadowOffsetY = p.shadowOffsetY || 0
            }

            // Set global alpha for cloud opacity
            ctx.globalAlpha = p.opacity || 1

            // Draw each bubble in the cloud
            p.bubbles.forEach((bubble: any) => {
              ctx.beginPath()
              ctx.arc(p.x + bubble.x, p.y + bubble.y, bubble.radius, 0, Math.PI * 2)
              ctx.fillStyle = p.color
              ctx.fill()
            })

            // Move cloud
            p.x += p.speed || 0

            // Wrap around screen
            if (p.x < -p.size * 2) {
              p.x = canvas.width + p.size
            } else if (p.x > canvas.width + p.size * 2) {
              p.x = -p.size
            }

            ctx.restore()
            break

          case "rain":
            // Draw rain drop
            ctx.save()

            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p.x + p.speedX * 0.5, p.y + p.length)
            ctx.strokeStyle = p.color
            ctx.lineWidth = p.size
            ctx.stroke()

            // Move rain drop
            p.x += p.speedX
            p.y += p.speedY

            // Reset position when off screen
            if (p.y > canvas.height) {
              p.y = Math.random() * -50
              p.x = Math.random() * canvas.width
            }

            ctx.restore()
            break

          case "lightning":
            // Generate lightning at intervals
            if (!p.active && timestamp > p.nextTime) {
              p.active = true
              p.alpha = 1
              p.points = []
              p.branches = []

              // Generate main lightning path
              let x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1
              let y = 0
              p.points.push({ x, y })

              // Create zigzag path
              while (y < canvas.height * 0.7) {
                x += (Math.random() - 0.5) * 100
                y += Math.random() * 20 + 20
                p.points.push({ x, y })

                // Add branch with small probability
                if (Math.random() < 0.3 && p.points.length > 1) {
                  const branchPoints = []
                  let branchX = x
                  let branchY = y
                  const direction = Math.random() > 0.5 ? 1 : -1

                  branchPoints.push({ x: branchX, y: branchY })

                  for (let i = 0; i < 3; i++) {
                    branchX += direction * (Math.random() * 50 + 20)
                    branchY += Math.random() * 30 + 20
                    branchPoints.push({ x: branchX, y: branchY })
                  }

                  p.branches.push(branchPoints)
                }
              }
            }

            // Draw lightning
            if (p.active) {
              ctx.save()

              // Main bolt
              ctx.strokeStyle = p.color.replace("1)", `${p.alpha})`)
              ctx.lineWidth = p.width || 3
              ctx.beginPath()
              ctx.moveTo(p.points[0].x, p.points[0].y)

              for (let i = 1; i < p.points.length; i++) {
                ctx.lineTo(p.points[i].x, p.points[i].y)
              }

              ctx.stroke()

              // Glow effect
              ctx.strokeStyle = p.color.replace("1)", `${p.alpha * 0.4})`)
              ctx.lineWidth = (p.width || 3) * 3
              ctx.beginPath()
              ctx.moveTo(p.points[0].x, p.points[0].y)

              for (let i = 1; i < p.points.length; i++) {
                ctx.lineTo(p.points[i].x, p.points[i].y)
              }

              ctx.stroke()

              // Draw branches
              p.branches.forEach((branch: any) => {
                ctx.strokeStyle = p.color.replace("1)", `${p.alpha * 0.8})`)
                ctx.lineWidth = (p.width || 3) * 0.7
                ctx.beginPath()
                ctx.moveTo(branch[0].x, branch[0].y)

                for (let i = 1; i < branch.length; i++) {
                  ctx.lineTo(branch[i].x, branch[i].y)
                }

                ctx.stroke()

                // Branch glow
                ctx.strokeStyle = p.color.replace("1)", `${p.alpha * 0.3})`)
                ctx.lineWidth = (p.width || 3) * 2
                ctx.beginPath()
                ctx.moveTo(branch[0].x, branch[0].y)

                for (let i = 1; i < branch.length; i++) {
                  ctx.lineTo(branch[i].x, branch[i].y)
                }

                ctx.stroke()
              })

              // Flash effect
              if (p.alpha > 0.8 && Math.random() < 0.3) {
                ctx.fillStyle = p.color.replace("1)", "0.1)")
                ctx.fillRect(0, 0, canvas.width, canvas.height)
              }

              // Fade out lightning
              p.alpha -= 0.05
              if (p.alpha <= 0) {
                p.active = false
                p.nextTime = timestamp + Math.random() * 3000 + 1000
              }

              ctx.restore()
            }
            break
        }
      })

      // Add new lightning occasionally for very-negative sentiment
      if (sentiment === "very-negative" && Math.random() < 0.002) {
        particles.push({
          type: "lightning",
          active: false,
          alpha: 0,
          points: [],
          nextTime: timestamp + Math.random() * 500,
          color: theme === "dark" ? "rgba(236, 72, 153, 1)" : "rgba(219, 39, 119, 1)", // Pink
          width: 3,
          branches: [],
        })
      }

      animationFrameId = requestAnimationFrame(drawWeather)
    }

    createWeather()
    animationFrameId = requestAnimationFrame(drawWeather)

    // Recreate weather when theme or sentiment changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          createWeather()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
    }
  }, [sentiment, theme])

  // Get sentiment text and description
  const getSentimentInfo = () => {
    switch (sentiment) {
      case "positive":
        return {
          text: "Bullish",
          description: "Strong upward momentum",
          icon: <Sparkles className="h-5 w-5 text-amber-400" />,
        }
      case "neutral":
        return {
          text: "Neutral",
          description: "Sideways trading pattern",
          icon: null,
        }
      case "negative":
        return {
          text: "Bearish",
          description: "Downward pressure",
          icon: null,
        }
      case "very-negative":
        return {
          text: "Strongly Bearish",
          description: "Significant downward momentum",
          icon: null,
        }
      default:
        return {
          text: "Neutral",
          description: "Sideways trading pattern",
          icon: null,
        }
    }
  }

  const sentimentInfo = getSentimentInfo()

  return (
    <div className="relative mb-8">
      {/* Canvas for 3D stock visualization */}
      <div className={`relative ${isMobile ? "h-[300px]" : "h-[400px]"} mb-4`}>
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      {/* Price display */}
      <div className="relative z-10 text-center">
        <div className="inline-block">
          <div
            className={`${isMobile ? "text-[120px]" : "text-[150px]"} font-bold leading-none tracking-tighter text-gray-900 dark:text-gray-100 drop-shadow-lg`}
          >
            {price.toFixed(2)}
          </div>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex items-center">
              {change >= 0 ? (
                <ArrowUp className="h-5 w-5 text-emerald-500 mr-1" />
              ) : (
                <ArrowDown className="h-5 w-5 text-rose-500 mr-1" />
              )}
              <span className={`text-lg ${change >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                {change >= 0 ? "+" : ""}
                {change} ({change >= 0 ? "+" : ""}
                {changePercent}%)
              </span>
            </div>
            {sentimentInfo.icon}
          </div>
          <div className="text-2xl font-medium text-center mt-2 text-gray-800 dark:text-gray-200">
            {sentimentInfo.text}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{sentimentInfo.description}</div>
        </div>
      </div>
    </div>
  )
}
