'use client';

import { Cloud, CloudLightning, CloudRain, Sun } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Card } from '~/components/ui/card';

interface WeatherAnimationProps {
  sentiment: string;
}

export function WeatherAnimation({ sentiment }: WeatherAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);

    // Animation variables
    let particles: any[] = [];
    let animationFrameId: number;

    // Create particles based on sentiment
    const createParticles = () => {
      particles = [];

      switch (sentiment) {
        case 'positive': // Sunny with vibrant colors
          // Sun in the center with a more realistic glow
          particles.push({
            type: 'sun',
            x: canvas.width / 2,
            y: canvas.height / 2,
            size: Math.min(canvas.width, canvas.height) * 0.15,
            rotation: 0,
            color: '#2dd4bf', // teal-400
            pulseSpeed: 0.005,
            pulseAmount: 0.1,
            pulseValue: 0,
          });

          // More varied sun rays
          for (let i = 0; i < 24; i++) {
            const angle = ((Math.PI * 2) / 24) * i;
            const length = Math.random() * 40 + 50; // Longer rays

            particles.push({
              type: 'ray',
              x: canvas.width / 2,
              y: canvas.height / 2,
              length: length,
              angle: angle,
              width: Math.random() * 2.5 + 0.5, // More varied widths
              speed: Math.random() * 0.001 + 0.0005, // Slower movement for more stability
              color: i % 2 === 0 ? '#2dd4bf' : '#14b8a6', // Alternating colors for depth
            });
          }

          // Add corona effect (outer glow)
          particles.push({
            type: 'corona',
            x: canvas.width / 2,
            y: canvas.height / 2,
            size: Math.min(canvas.width, canvas.height) * 0.25,
            color: '#2dd4bf',
            pulseSpeed: 0.003,
            pulseAmount: 0.15,
            pulseValue: Math.PI / 2, // Offset from main sun pulse
          });

          // Sparkles
          for (let i = 0; i < 30; i++) {
            particles.push({
              type: 'sparkle',
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 3 + 1,
              alpha: Math.random() * 0.5 + 0.5,
              alphaSpeed:
                (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
              color: `rgba(${45 + Math.floor(Math.random() * 30)}, ${212 + Math.floor(Math.random() * 30)}, ${191 + Math.floor(Math.random() * 30)}, 1)`, // Teal variations
            });
          }
          break;

        case 'neutral': // Cloudy with vibrant colors
          // Multiple clouds of different sizes
          for (let i = 0; i < 8; i++) {
            particles.push({
              type: 'cloud',
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height * 0.7,
              size: Math.random() * 50 + 30,
              speedX: Math.random() * 0.3 - 0.15,
              color:
                i < 6 ? 'rgba(125, 211, 252, 0.9)' : 'rgba(56, 189, 248, 0.8)', // Sky-300 and Sky-400
            });
          }

          // Hint of sun behind clouds
          particles.push({
            type: 'sun',
            x: canvas.width * 0.7,
            y: canvas.height * 0.3,
            size: Math.min(canvas.width, canvas.height) * 0.15,
            rotation: 0,
            color: 'rgba(125, 211, 252, 0.4)', // Sky-300 with opacity
            pulseSpeed: 0.005,
            pulseAmount: 0.1,
            pulseValue: 0,
          });

          // Sparkles
          for (let i = 0; i < 20; i++) {
            particles.push({
              type: 'sparkle',
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 2 + 1,
              alpha: Math.random() * 0.3 + 0.2,
              alphaSpeed:
                (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
              color: `rgba(${125 + Math.floor(Math.random() * 50)}, ${211 + Math.floor(Math.random() * 30)}, ${252 + Math.floor(Math.random() * 30)}, 1)`, // Sky variations
            });
          }
          break;

        case 'negative': // Rainy with vibrant colors
          // Dark clouds
          for (let i = 0; i < 6; i++) {
            particles.push({
              type: 'cloud',
              x: Math.random() * canvas.width,
              y: Math.random() * (canvas.height / 2),
              size: Math.random() * 60 + 40,
              speedX: Math.random() * 0.2 - 0.1,
              color: 'rgba(192, 132, 252, 0.8)', // Purple-400
            });
          }

          // Rain drops
          for (let i = 0; i < 100; i++) {
            particles.push({
              type: 'rain',
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 2 + 1,
              length: Math.random() * 15 + 10,
              speedX: Math.random() * 1 - 0.5,
              speedY: Math.random() * 10 + 10,
              color: 'rgba(192, 132, 252, 0.6)', // Purple-400 with opacity
            });
          }

          // Sparkles
          for (let i = 0; i < 15; i++) {
            particles.push({
              type: 'sparkle',
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 2 + 1,
              alpha: Math.random() * 0.3 + 0.2,
              alphaSpeed:
                (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
              color: `rgba(${192 + Math.floor(Math.random() * 30)}, ${132 + Math.floor(Math.random() * 30)}, ${252 + Math.floor(Math.random() * 30)}, 1)`, // Purple variations
            });
          }
          break;

        case 'very-negative': // Stormy with vibrant colors
          // Dark storm clouds
          for (let i = 0; i < 7; i++) {
            particles.push({
              type: 'cloud',
              x: Math.random() * canvas.width,
              y: Math.random() * (canvas.height / 2),
              size: Math.random() * 70 + 50,
              speedX: Math.random() * 0.4 - 0.2,
              color: 'rgba(244, 114, 182, 0.8)', // Pink-400
            });
          }

          // Heavy rain
          for (let i = 0; i < 150; i++) {
            particles.push({
              type: 'rain',
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 2.5 + 1.5,
              length: Math.random() * 20 + 15,
              speedX: Math.random() * 3 - 1.5,
              speedY: Math.random() * 15 + 15,
              color: 'rgba(244, 114, 182, 0.6)', // Pink-400 with opacity
            });
          }

          // Lightning (initially not visible)
          particles.push({
            type: 'lightning',
            active: false,
            alpha: 0,
            points: [],
            nextTime: Math.random() * 2000 + 1000,
            color: 'rgba(251, 113, 133, 1)', // Rose-400
          });

          // Sparkles
          for (let i = 0; i < 10; i++) {
            particles.push({
              type: 'sparkle',
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: Math.random() * 2 + 1,
              alpha: Math.random() * 0.3 + 0.2,
              alphaSpeed:
                (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
              color: `rgba(${244 + Math.floor(Math.random() * 30)}, ${114 + Math.floor(Math.random() * 30)}, ${182 + Math.floor(Math.random() * 30)}, 1)`, // Pink variations
            });
          }
          break;
      }
    };

    // Draw particles
    const drawParticles = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, index) => {
        switch (p.type) {
          case 'sun':
            // Ensure we have all required properties with defaults
            p.pulseSpeed = p.pulseSpeed || 0.005;
            p.pulseAmount = p.pulseAmount || 0.1;
            p.pulseValue = p.pulseValue !== undefined ? p.pulseValue : 0;

            // Animate sun pulsing with safety checks
            p.pulseValue += p.pulseSpeed;
            const pulseFactor = 1 + Math.sin(p.pulseValue) * p.pulseAmount;
            const currentSize = Math.max(0.1, p.size * pulseFactor); // Ensure positive size

            // Create a more realistic sun with gradient
            const sunGradient = ctx.createRadialGradient(
              p.x,
              p.y,
              0,
              p.x,
              p.y,
              currentSize || 1 // Fallback to 1 if currentSize is invalid
            );
            sunGradient.addColorStop(0, '#fff5b8'); // Bright center
            sunGradient.addColorStop(0.2, '#ffdd57'); // Yellow
            sunGradient.addColorStop(0.7, '#ff9f43'); // Orange
            sunGradient.addColorStop(1, p.color); // Teal edge for our theme

            // Draw sun circle
            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            ctx.fillStyle = sunGradient;
            ctx.fill();

            // Add inner glow effect with safety checks
            const innerGlowRadius = Math.max(0.1, currentSize * 0.1); // Ensure positive radius
            const innerGlow = ctx.createRadialGradient(
              p.x,
              p.y,
              innerGlowRadius,
              p.x,
              p.y,
              currentSize || 1 // Fallback to 1 if currentSize is invalid
            );
            innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            innerGlow.addColorStop(0.5, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
            ctx.fillStyle = innerGlow;
            ctx.fill();
            break;

          case 'ray':
            // Draw sun rays with varying opacity for more realism
            p.angle += p.speed;
            const rayX = p.x + Math.cos(p.angle) * p.length;
            const rayY = p.y + Math.sin(p.angle) * p.length;

            // Create gradient for ray
            const rayGradient = ctx.createLinearGradient(p.x, p.y, rayX, rayY);
            rayGradient.addColorStop(0, p.color); // Full color at sun
            rayGradient.addColorStop(1, 'rgba(45, 212, 191, 0)'); // Fade out at end

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(rayX, rayY);
            ctx.strokeStyle = rayGradient;
            ctx.lineWidth = p.width;
            ctx.stroke();
            break;

          case 'cloud':
            // Draw cloud (multiple circles)
            const drawCloud = (
              x: number,
              y: number,
              size: number,
              color: string
            ) => {
              ctx.fillStyle = color;
              ctx.beginPath();
              ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(x + size * 0.35, y, size * 0.4, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(x - size * 0.35, y, size * 0.4, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(
                x - size * 0.2,
                y - size * 0.25,
                size * 0.3,
                0,
                Math.PI * 2
              );
              ctx.fill();
              ctx.beginPath();
              ctx.arc(
                x + size * 0.2,
                y - size * 0.25,
                size * 0.3,
                0,
                Math.PI * 2
              );
              ctx.fill();
            };

            drawCloud(p.x, p.y, p.size, p.color);

            // Move cloud
            p.x += p.speedX;

            // Wrap around screen
            if (p.x < -p.size) {
              p.x = canvas.width + p.size;
            } else if (p.x > canvas.width + p.size) {
              p.x = -p.size;
            }
            break;

          case 'rain':
            // Draw rain drop
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.speedX * 0.5, p.y + p.length);
            ctx.stroke();

            // Move rain drop
            p.x += p.speedX;
            p.y += p.speedY;

            // Reset position when off screen
            if (p.y > canvas.height) {
              p.y = Math.random() * -100;
              p.x = Math.random() * canvas.width;
            }
            break;

          case 'lightning':
            // Generate lightning at intervals
            if (!p.active && timestamp > p.nextTime) {
              p.active = true;
              p.alpha = 1;
              p.points = [];

              // Generate lightning path
              let x = Math.random() * canvas.width;
              let y = 0;
              p.points.push({ x, y });

              while (y < canvas.height) {
                x += (Math.random() - 0.5) * 100;
                y += Math.random() * 20 + 20;
                p.points.push({ x, y });
              }
            }

            // Draw lightning
            if (p.active) {
              // Use explicit rgba values instead of string manipulation
              const lightningColor =
                p.color === 'rgba(251, 113, 133, 1)'
                  ? `rgba(251, 113, 133, ${p.alpha})`
                  : `rgba(244, 114, 182, ${p.alpha})`;

              const lightningGlowColor =
                p.color === 'rgba(251, 113, 133, 1)'
                  ? `rgba(251, 113, 133, ${p.alpha * 0.4})`
                  : `rgba(244, 114, 182, ${p.alpha * 0.4})`;

              ctx.strokeStyle = lightningColor;
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(p.points[0].x, p.points[0].y);

              for (let i = 1; i < p.points.length; i++) {
                ctx.lineTo(p.points[i].x, p.points[i].y);
              }

              ctx.stroke();

              // Add glow effect
              ctx.strokeStyle = lightningGlowColor;
              ctx.lineWidth = 8;
              ctx.beginPath();
              ctx.moveTo(p.points[0].x, p.points[0].y);

              for (let i = 1; i < p.points.length; i++) {
                ctx.lineTo(p.points[i].x, p.points[i].y);
              }

              ctx.stroke();

              // Fade out lightning
              p.alpha -= 0.05;
              if (p.alpha <= 0) {
                p.active = false;
                p.nextTime = timestamp + Math.random() * 3000 + 1000;
              }
            }
            break;

          case 'sparkle':
            // Draw sparkle with explicit rgba
            let sparkleColor;
            try {
              if (p.color && p.color.includes('rgba')) {
                // Extract RGB components and create new rgba string
                const rgbMatch = p.color.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
                if (rgbMatch) {
                  sparkleColor = `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${p.alpha})`;
                } else {
                  sparkleColor = `rgba(255, 255, 255, ${p.alpha})`;
                }
              } else {
                sparkleColor = `rgba(255, 255, 255, ${p.alpha})`;
              }
            } catch (e) {
              // Fallback if any error occurs
              sparkleColor = `rgba(255, 255, 255, ${p.alpha})`;
            }

            ctx.fillStyle = sparkleColor;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // Pulse alpha
            p.alpha += p.alphaSpeed;
            if (p.alpha > 1 || p.alpha < 0.1) {
              p.alphaSpeed *= -1;
            }
            break;

          case 'corona':
            // Ensure we have all required properties with defaults
            p.pulseSpeed = p.pulseSpeed || 0.003;
            p.pulseAmount = p.pulseAmount || 0.15;
            p.pulseValue =
              p.pulseValue !== undefined ? p.pulseValue : Math.PI / 2;

            // Animate corona pulsing (opposite phase to the sun)
            p.pulseValue += p.pulseSpeed;
            const coronaPulseFactor =
              1 + Math.sin(p.pulseValue) * p.pulseAmount;
            const coronaSize = Math.max(0.1, p.size * coronaPulseFactor); // Ensure positive size

            // Create outer glow (corona) with safety checks
            const innerRadius = Math.max(0.1, p.size * 0.7); // Ensure positive radius
            const outerRadius = Math.max(innerRadius + 0.1, coronaSize * 1.2); // Ensure outer > inner

            const coronaGradient = ctx.createRadialGradient(
              p.x,
              p.y,
              innerRadius,
              p.x,
              p.y,
              outerRadius
            );
            coronaGradient.addColorStop(0, 'rgba(45, 212, 191, 0.3)'); // Teal with opacity
            coronaGradient.addColorStop(0.5, 'rgba(45, 212, 191, 0.1)');
            coronaGradient.addColorStop(1, 'rgba(45, 212, 191, 0)');

            ctx.beginPath();
            ctx.arc(p.x, p.y, outerRadius, 0, Math.PI * 2);
            ctx.fillStyle = coronaGradient;
            ctx.fill();
            break;
        }
      });

      // Add new particles occasionally
      if (Math.random() < 0.05) {
        if (sentiment === 'very-negative' && Math.random() < 0.1) {
          particles.push({
            type: 'lightning',
            active: false,
            alpha: 0,
            points: [],
            nextTime: timestamp + Math.random() * 1000,
            color: 'rgba(251, 113, 133, 1)', // Rose-400
          });
        }
      }

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    createParticles();
    animationFrameId = requestAnimationFrame(drawParticles);

    // Update particles when sentiment changes
    const intervalId = setInterval(createParticles, 10000);

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, [sentiment]);

  // Get sentiment text and color
  const getSentimentInfo = () => {
    switch (sentiment) {
      case 'positive':
        return {
          text: 'Bullish',
          icon: <Sun className="h-8 w-8 text-teal-400" />,
          description: 'Strong upward momentum',
          gradient: 'from-teal-400 to-cyan-400',
        };
      case 'neutral':
        return {
          text: 'Neutral',
          icon: <Cloud className="h-8 w-8 text-sky-400" />,
          description: 'Sideways trading pattern',
          gradient: 'from-sky-400 to-blue-400',
        };
      case 'negative':
        return {
          text: 'Bearish',
          icon: <CloudRain className="h-8 w-8 text-purple-400" />,
          description: 'Downward pressure',
          gradient: 'from-purple-400 to-violet-400',
        };
      case 'very-negative':
        return {
          text: 'Strongly Bearish',
          icon: <CloudLightning className="h-8 w-8 text-pink-400" />,
          description: 'Significant downward momentum',
          gradient: 'from-pink-400 to-rose-400',
        };
      default:
        return {
          text: 'Neutral',
          icon: <Cloud className="h-8 w-8 text-sky-400" />,
          description: 'Sideways trading pattern',
          gradient: 'from-sky-400 to-blue-400',
        };
    }
  };

  const sentimentInfo = getSentimentInfo();

  return (
    <Card className="mb-6 overflow-hidden rounded-3xl border border-0 border-purple-500/20 bg-[#1e1b4b]/80 shadow-lg backdrop-blur-md">
      <div className="relative h-[220px]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 flex items-center p-6">
          <div className="rounded-2xl border border-purple-500/30 bg-[#1e1b4b]/70 p-5 shadow-lg shadow-purple-900/20 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br shadow-inner shadow-white/10"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                }}
              >
                {sentimentInfo.icon}
              </div>
              <div>
                <h2
                  className={`bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent ${sentimentInfo.gradient}`}
                >
                  Market Sentiment
                </h2>
                <p className="text-lg font-medium text-white">
                  {sentimentInfo.text}
                </p>
                <p className="mt-1 text-sm text-purple-300/80">
                  {sentimentInfo.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
