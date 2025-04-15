'use client';

import { ArrowDown, ArrowUp, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useMobile } from '~/hooks/use-mobile';
import { StockDetails } from '~/lib/finnhub';

type ParticleBase = {
  opacity?: number;
};

type SunParticle = ParticleBase & {
  type: 'sun';
  x: number;
  y: number;
  radius: number;
  color: string;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  texture: boolean;
  pulseSpeed: number;
  pulseAmount: number;
  pulseValue: number;
};

type RayParticle = ParticleBase & {
  type: 'ray';
  x: number;
  y: number;
  angle: number;
  length: number;
  width: number;
  speed: number;
  color: string;
  alpha: number;
  sunRadius: number;
};

type CloudParticle = ParticleBase & {
  type: 'cloud';
  x: number;
  y: number;
  size: number;
  bubbles: { x: number; y: number; radius: number }[];
  speed: number;
  color: string;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  opacity: number;
};

type RainParticle = ParticleBase & {
  type: 'rain';
  x: number;
  y: number;
  size: number;
  length: number;
  speedX: number;
  speedY: number;
  color: string;
};

type StormParticle = ParticleBase & {
  type: 'storm';
  x: number;
  y: number;
  size: number;
  bubbles: { x: number; y: number; radius: number }[];
  color: string;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
};

type SparkleParticle = ParticleBase & {
  type: 'sparkle';
  x: number;
  y: number;
  size: number;
  alpha: number;
  alphaSpeed: number;
  alphaDirection: number;
  color: string;
};

type LightningParticle = ParticleBase & {
  type: 'lightning';
  active: boolean;
  nextTime: number;
  points: { x: number; y: number }[];
  branches: { x: number; y: number }[][];
  color: string;
  width: number;
  alpha: number;
};

type Particle =
  | SunParticle
  | RayParticle
  | CloudParticle
  | RainParticle
  | StormParticle
  | SparkleParticle
  | LightningParticle;

export function StockDisplay(props: {
  price: number;
  change: number;
  changePercent: number;
  sentiment: string;
  stockInfo: StockDetails;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const isMobile = useMobile();

  // 3D stock visualization animation
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
    let particles: Particle[] = [];

    let animationFrameId: number;
    let lastTimestamp = 0;

    // Create weather elements based on sentiment
    const createWeather = () => {
      particles = [];
      const isDark = theme === 'dark';
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 - 20;

      switch (props.sentiment) {
        case 'positive': // Sunny - bright sun with rays, no clouds
          // Create sun rays (FIRST, so they appear behind the sun)
          for (let i = 0; i < 12; i++) {
            const angle = ((Math.PI * 2) / 12) * i;
            const rayStartRadius = Math.min(canvas.width, canvas.height) * 0.2; // Same as sun radius
            const rayLength = rayStartRadius * 1.5; // Much longer rays

            particles.push({
              type: 'ray',
              x: centerX,
              y: centerY - canvas.height * 0.15, // Match sun position
              angle: angle,
              sunRadius: rayStartRadius, // Store sun radius for drawing from edge
              length: rayLength,
              width: 6, // Thicker rays
              speed: 0.0004,
              color: '#FFA500', // Slightly deeper orange for contrast
              alpha: 0.8,
            });
          }

          // Create sun
          const sunRadius = Math.min(canvas.width, canvas.height) * 0.2;
          particles.push({
            type: 'sun',
            x: centerX,
            y: centerY - canvas.height * 0.15, // Higher position
            radius: sunRadius,
            color: '#FFD700', // Standard gold/yellow color
            shadowColor: 'rgba(255, 215, 0, 0.6)',
            shadowBlur: 30,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            texture: true,
            pulseSpeed: 0.001,
            pulseAmount: 0.03,
            pulseValue: 0,
          });

          // Add small sparkles around the sun
          for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = sunRadius * (1.2 + Math.random() * 0.5);

            particles.push({
              type: 'sparkle',
              x: centerX + Math.cos(angle) * distance,
              y: centerY + Math.sin(angle) * distance,
              size: 1 + Math.random() * 2,
              alpha: 0.3 + Math.random() * 0.7,
              alphaSpeed: 0.005 + Math.random() * 0.01,
              alphaDirection: Math.random() > 0.5 ? 1 : -1,
              color: isDark ? '#34d399' : '#fb7185', // Lighter variant
            });
          }
          break;

        case 'neutral': // Neutral - sun partially obscured by clouds
          // Create partial sun rays FIRST (only on visible side)
          for (let i = 0; i < 6; i++) {
            const angle = ((Math.PI * 1.5) / 6) * i - Math.PI / 4; // Only on left side
            const rayStartRadius = Math.min(canvas.width, canvas.height) * 0.18; // Same as sun radius
            const rayLength = rayStartRadius * 1.5;

            particles.push({
              type: 'ray',
              x: centerX - rayStartRadius * 0.5,
              y: centerY - canvas.height * 0.1, // Match sun position
              angle: angle,
              sunRadius: rayStartRadius, // Store sun radius for drawing from edge
              length: rayLength,
              width: 5,
              speed: 0.0004,
              color: '#FFA500', // Slightly deeper orange for contrast
              alpha: 0.8,
            });
          }

          // Create sun (slightly smaller)
          const neutralSunRadius = Math.min(canvas.width, canvas.height) * 0.18;
          particles.push({
            type: 'sun',
            x: centerX - neutralSunRadius * 0.5, // Offset to left to make room for clouds
            y: centerY - canvas.height * 0.1, // Higher position
            radius: neutralSunRadius,
            color: '#FFD700', // Standard gold/yellow color
            shadowColor: 'rgba(255, 215, 0, 0.5)',
            shadowBlur: 25,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            texture: true,
            pulseSpeed: 0.001,
            pulseAmount: 0.03,
            pulseValue: 0,
          });

          // Create varied clouds that partially obscure the sun
          const cloudCount = 5;
          for (let i = 0; i < cloudCount; i++) {
            // Create cloud with multiple bubbles
            const size = 30 + Math.random() * 40;
            const xPos =
              i === 0
                ? centerX + neutralSunRadius * 0.3 // First cloud over the sun
                : centerX +
                  Math.random() * canvas.width * 0.4 -
                  canvas.width * 0.2;
            const yPos =
              i === 0
                ? centerY
                : centerY +
                  Math.random() * canvas.height * 0.3 -
                  canvas.height * 0.15;

            const bubbleCount = 3 + Math.floor(Math.random() * 3);
            const bubbles = [];

            for (let j = 0; j < bubbleCount; j++) {
              const bubbleSize = size * (0.6 + Math.random() * 0.4);
              const offsetX = j * (size * 0.4) - (bubbleCount * size * 0.2) / 2;
              const offsetY = Math.random() * 10 - 5;

              bubbles.push({
                x: offsetX,
                y: offsetY,
                radius: bubbleSize / 2,
              });
            }

            particles.push({
              type: 'cloud',
              x: xPos,
              y: yPos,
              size: size,
              bubbles: bubbles,
              speed: (Math.random() * 0.2 - 0.1) * 0.5, // Slower movement
              color: isDark ? '#1e293b' : '#0f172a', // Slate-800 or Slate-900
              shadowColor: isDark
                ? 'rgba(30, 41, 59, 0.4)'
                : 'rgba(15, 23, 42, 0.4)',
              shadowBlur: 10,
              shadowOffsetX: 3,
              shadowOffsetY: 3,
              opacity: 0.8 + Math.random() * 0.2,
            });
          }
          break;

        case 'negative': // Bad - rain with subtle sun and clouds
          // Create subtle sun (smaller and less bright)
          const rainySunRadius = Math.min(canvas.width, canvas.height) * 0.15;
          particles.push({
            type: 'sun',
            x: centerX - rainySunRadius,
            y: centerY - rainySunRadius * 0.5 - canvas.height * 0.1, // Higher position
            radius: rainySunRadius,
            color: '#FFD700', // Standard gold/yellow color
            shadowColor: 'rgba(255, 215, 0, 0.3)',
            shadowBlur: 15,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            texture: true,
            pulseSpeed: 0.001,
            pulseAmount: 0.02,
            pulseValue: 0,
            opacity: 0.6, // Less visible
          });

          // Create more clouds (rain clouds)
          const rainCloudCount = 7;
          for (let i = 0; i < rainCloudCount; i++) {
            const size = 35 + Math.random() * 45;
            const xPos = Math.random() * canvas.width;
            const yPos = Math.random() * (canvas.height * 0.4);

            const bubbleCount = 4 + Math.floor(Math.random() * 3);
            const bubbles = [];

            for (let j = 0; j < bubbleCount; j++) {
              const bubbleSize = size * (0.6 + Math.random() * 0.4);
              const offsetX = j * (size * 0.4) - (bubbleCount * size * 0.2) / 2;
              const offsetY = Math.random() * 10 - 5;

              bubbles.push({
                x: offsetX,
                y: offsetY,
                radius: bubbleSize / 2,
              });
            }

            particles.push({
              type: 'cloud',
              x: xPos,
              y: yPos,
              size: size,
              bubbles: bubbles,
              speed: (Math.random() * 0.2 - 0.1) * 0.7,
              color: isDark ? '#1e293b' : '#0f172a',
              shadowColor: isDark
                ? 'rgba(30, 41, 59, 0.5)'
                : 'rgba(15, 23, 42, 0.5)',
              shadowBlur: 15,
              shadowOffsetX: 4,
              shadowOffsetY: 4,
              opacity: 0.9 + Math.random() * 0.1,
            });
          }

          // Create rain drops
          for (let i = 0; i < 80; i++) {
            particles.push({
              type: 'rain',
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: 1 + Math.random() * 1.5,
              length: 10 + Math.random() * 15,
              speedX: Math.random() * 1 - 0.5,
              speedY: 10 + Math.random() * 10,
              color: isDark
                ? 'rgba(139, 92, 246, 0.5)'
                : 'rgba(99, 102, 241, 0.5)',
            });
          }
          break;

        case 'very-negative': // Very Bad - heavy rain, thunder, dense clouds
          // Create dense storm clouds
          const stormCloudCount = 9;
          for (let i = 0; i < stormCloudCount; i++) {
            const size = 40 + Math.random() * 50;
            const xPos = Math.random() * canvas.width;
            const yPos = Math.random() * (canvas.height * 0.5);

            const bubbleCount = 5 + Math.floor(Math.random() * 3);
            const bubbles = [];

            for (let j = 0; j < bubbleCount; j++) {
              const bubbleSize = size * (0.6 + Math.random() * 0.4);
              const offsetX = j * (size * 0.4) - (bubbleCount * size * 0.2) / 2;
              const offsetY = Math.random() * 12 - 6;

              bubbles.push({
                x: offsetX,
                y: offsetY,
                radius: bubbleSize / 2,
              });
            }

            particles.push({
              type: 'cloud',
              x: xPos,
              y: yPos,
              size: size,
              bubbles: bubbles,
              speed: (Math.random() * 0.3 - 0.15) * 0.8,
              color: isDark ? '#0f172a' : '#020617', // Darker clouds
              shadowColor: isDark
                ? 'rgba(15, 23, 42, 0.6)'
                : 'rgba(2, 6, 23, 0.6)',
              shadowBlur: 20,
              shadowOffsetX: 5,
              shadowOffsetY: 5,
              opacity: 0.95 + Math.random() * 0.05,
            });
          }

          // Create heavy rain
          for (let i = 0; i < 150; i++) {
            particles.push({
              type: 'rain',
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              size: 1.5 + Math.random() * 2,
              length: 15 + Math.random() * 20,
              speedX: Math.random() * 2 - 1,
              speedY: 15 + Math.random() * 15,
              color: isDark
                ? 'rgba(236, 72, 153, 0.6)'
                : 'rgba(219, 39, 119, 0.6)',
            });
          }

          // Add lightning
          particles.push({
            type: 'lightning',
            active: false,
            alpha: 0,
            points: [],
            nextTime: Math.random() * 2000,
            color: isDark ? 'rgba(236, 72, 153, 1)' : 'rgba(219, 39, 119, 1)', // Pink
            width: 3,
            branches: [],
          });
          break;
      }
    };

    // Draw weather elements
    const drawWeather = (timestamp: number) => {
      // Calculate elapsed time for animations
      if (!lastTimestamp) lastTimestamp = timestamp;
      lastTimestamp = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sort particles by type for proper layering
      particles.sort((a, b) => {
        const typeOrder = {
          ray: 1,
          sun: 2,
          sparkle: 3,
          cloud: 4,
          rain: 5,
          lightning: 6,
        };
        return (
          (typeOrder[a.type as keyof typeof typeOrder] || 0) -
          (typeOrder[b.type as keyof typeof typeOrder] || 0)
        );
      });

      // Process and draw each particle
      particles.forEach((p) => {
        switch (p.type) {
          case 'sun':
            // Draw sun with pulsing effect
            ctx.save();

            // Add shadow
            if (p.shadowColor && p.shadowBlur) {
              ctx.shadowColor = p.shadowColor;
              ctx.shadowBlur = p.shadowBlur;
              ctx.shadowOffsetX = p.shadowOffsetX || 0;
              ctx.shadowOffsetY = p.shadowOffsetY || 0;
            }

            // Animate sun pulsing
            if (p.pulseSpeed && p.pulseAmount) {
              p.pulseValue = (p.pulseValue || 0) + p.pulseSpeed;
              const pulseFactor = 1 + Math.sin(p.pulseValue) * p.pulseAmount;
              const currentRadius = Math.max(0.1, p.radius * pulseFactor);

              // Draw sun with simple gradient
              const sunGradient = ctx.createRadialGradient(
                p.x,
                p.y,
                0,
                p.x,
                p.y,
                currentRadius
              );

              // Yellow sun gradient
              sunGradient.addColorStop(0, '#FFFFFF');
              sunGradient.addColorStop(0.3, '#FFF8B6');
              sunGradient.addColorStop(0.7, '#FFE066');
              sunGradient.addColorStop(1, p.color);

              // Draw sun circle with opacity
              ctx.globalAlpha = p.opacity !== undefined ? p.opacity : 1;
              ctx.beginPath();
              ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
              ctx.fillStyle = sunGradient;
              ctx.fill();

              // Add simple texture
              if (p.texture) {
                const textureGradient = ctx.createRadialGradient(
                  p.x - currentRadius * 0.3,
                  p.y - currentRadius * 0.3,
                  0,
                  p.x,
                  p.y,
                  currentRadius
                );
                textureGradient.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
                textureGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
                textureGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

                ctx.beginPath();
                ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
                ctx.fillStyle = textureGradient;
                ctx.fill();
              }
            }

            ctx.restore();
            break;

          case 'ray':
            // Draw sun ray with simple straight lines, starting from the edge of the sun
            ctx.save();

            // Animate ray rotation
            p.angle += p.speed || 0.001;

            // Start ray at sun's edge rather than center
            const sunEdgeX = p.x + Math.cos(p.angle) * (p.sunRadius || 0);
            const sunEdgeY = p.y + Math.sin(p.angle) * (p.sunRadius || 0);

            // End point of ray
            const rayEndX =
              p.x + Math.cos(p.angle) * ((p.sunRadius || 0) + p.length);
            const rayEndY =
              p.y + Math.sin(p.angle) * ((p.sunRadius || 0) + p.length);

            // Draw ray with linear gradient
            const rayGradient = ctx.createLinearGradient(
              sunEdgeX,
              sunEdgeY,
              rayEndX,
              rayEndY
            );

            rayGradient.addColorStop(0, p.color);
            rayGradient.addColorStop(1, 'rgba(255, 165, 0, 0)');

            ctx.globalAlpha = p.alpha || 0.7;
            ctx.beginPath();
            ctx.moveTo(sunEdgeX, sunEdgeY);
            ctx.lineTo(rayEndX, rayEndY);
            ctx.strokeStyle = rayGradient;
            ctx.lineWidth = p.width || 2;
            ctx.lineCap = 'round';
            ctx.stroke();

            ctx.restore();
            break;

          case 'sparkle':
            // Draw sparkle with pulsing opacity
            ctx.save();

            // Update alpha
            if (p.alphaSpeed && p.alphaDirection) {
              p.alpha += p.alphaSpeed * p.alphaDirection;
              if (p.alpha > 1 || p.alpha < 0.1) {
                p.alphaDirection *= -1;
              }
            }

            ctx.globalAlpha = p.alpha || 0.5;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            ctx.restore();
            break;

          case 'cloud':
            // Draw 3D cloud
            ctx.save();

            // Add shadow
            if (p.shadowColor && p.shadowBlur) {
              ctx.shadowColor = p.shadowColor;
              ctx.shadowBlur = p.shadowBlur;
              ctx.shadowOffsetX = p.shadowOffsetX || 0;
              ctx.shadowOffsetY = p.shadowOffsetY || 0;
            }

            // Set global alpha for cloud opacity
            ctx.globalAlpha = p.opacity || 1;

            // Draw each bubble in the cloud
            p.bubbles.forEach(
              (bubble: { x: number; y: number; radius: number }) => {
                ctx.beginPath();
                ctx.arc(
                  p.x + bubble.x,
                  p.y + bubble.y,
                  bubble.radius,
                  0,
                  Math.PI * 2
                );
                ctx.fillStyle = p.color;
                ctx.fill();
              }
            );

            // Move cloud
            p.x += p.speed || 0;

            // Wrap around screen
            if (p.x < -p.size * 2) {
              p.x = canvas.width + p.size;
            } else if (p.x > canvas.width + p.size * 2) {
              p.x = -p.size;
            }

            ctx.restore();
            break;

          case 'rain':
            // Draw rain drop
            ctx.save();

            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + p.speedX * 0.5, p.y + p.length);
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.size;
            ctx.stroke();

            // Move rain drop
            p.x += p.speedX;
            p.y += p.speedY;

            // Reset position when off screen
            if (p.y > canvas.height) {
              p.y = Math.random() * -50;
              p.x = Math.random() * canvas.width;
            }

            ctx.restore();
            break;

          case 'lightning':
            // Generate lightning at intervals
            if (!p.active && timestamp > p.nextTime) {
              p.active = true;
              p.alpha = 1;
              p.points = [];
              p.branches = [];

              // Generate main lightning path
              let x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
              let y = 0;
              p.points.push({ x, y });

              // Create zigzag path
              while (y < canvas.height * 0.7) {
                x += (Math.random() - 0.5) * 100;
                y += Math.random() * 20 + 20;
                p.points.push({ x, y });

                // Add branch with small probability
                if (Math.random() < 0.3 && p.points.length > 1) {
                  const branchPoints = [];
                  let branchX = x;
                  let branchY = y;
                  const direction = Math.random() > 0.5 ? 1 : -1;

                  branchPoints.push({ x: branchX, y: branchY });

                  for (let i = 0; i < 3; i++) {
                    branchX += direction * (Math.random() * 50 + 20);
                    branchY += Math.random() * 30 + 20;
                    branchPoints.push({ x: branchX, y: branchY });
                  }

                  p.branches.push(branchPoints);
                }
              }
            }

            // Draw lightning
            if (p.active) {
              ctx.save();

              // Main bolt
              ctx.strokeStyle = p.color.replace('1)', `${p.alpha})`);
              ctx.lineWidth = p.width || 3;
              ctx.beginPath();
              ctx.moveTo(p.points[0].x, p.points[0].y);

              for (let i = 1; i < p.points.length; i++) {
                ctx.lineTo(p.points[i].x, p.points[i].y);
              }

              ctx.stroke();

              // Glow effect
              ctx.strokeStyle = p.color.replace('1)', `${p.alpha * 0.4})`);
              ctx.lineWidth = (p.width || 3) * 3;
              ctx.beginPath();
              ctx.moveTo(p.points[0].x, p.points[0].y);

              for (let i = 1; i < p.points.length; i++) {
                ctx.lineTo(p.points[i].x, p.points[i].y);
              }

              ctx.stroke();

              // Draw branches
              p.branches.forEach((branch: { x: number; y: number }[]) => {
                ctx.strokeStyle = p.color.replace('1)', `${p.alpha * 0.8})`);
                ctx.lineWidth = (p.width || 3) * 0.7;
                ctx.beginPath();
                ctx.moveTo(branch[0].x, branch[0].y);

                for (let i = 1; i < branch.length; i++) {
                  ctx.lineTo(branch[i].x, branch[i].y);
                }

                ctx.stroke();

                // Branch glow
                ctx.strokeStyle = p.color.replace('1)', `${p.alpha * 0.3})`);
                ctx.lineWidth = (p.width || 3) * 2;
                ctx.beginPath();
                ctx.moveTo(branch[0].x, branch[0].y);

                for (let i = 1; i < branch.length; i++) {
                  ctx.lineTo(branch[i].x, branch[i].y);
                }

                ctx.stroke();
              });

              // Flash effect
              if (p.alpha > 0.8 && Math.random() < 0.3) {
                ctx.fillStyle = p.color.replace('1)', '0.1)');
                ctx.fillRect(0, 0, canvas.width, canvas.height);
              }

              // Fade out lightning
              p.alpha -= 0.05;
              if (p.alpha <= 0) {
                p.active = false;
                p.nextTime = timestamp + Math.random() * 3000 + 1000;
              }

              ctx.restore();
            }
            break;
        }
      });

      // Add new lightning occasionally for very-negative sentiment
      if (props.sentiment === 'very-negative' && Math.random() < 0.002) {
        particles.push({
          type: 'lightning',
          active: false,
          alpha: 0,
          points: [],
          nextTime: timestamp + Math.random() * 500,
          color:
            theme === 'dark'
              ? 'rgba(236, 72, 153, 1)'
              : 'rgba(219, 39, 119, 1)', // Pink
          width: 3,
          branches: [],
        });
      }

      animationFrameId = requestAnimationFrame(drawWeather);
    };

    createWeather();
    animationFrameId = requestAnimationFrame(drawWeather);

    // Recreate weather when theme or sentiment changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          createWeather();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [props.sentiment, theme]);

  // Get sentiment text and description
  const getSentimentInfo = () => {
    switch (props.sentiment) {
      case 'positive':
        return {
          //text: 'Bullish',
          text: 'Sunny',
          description: 'Strong upward momentum',
          icon: <Sparkles className="h-5 w-5 text-amber-400" />,
        };
      case 'neutral':
        return {
          //text: 'Neutral',
          text: 'Partly Cloudy',
          description: 'Sideways trading pattern',
          icon: null,
        };
      case 'negative':
        return {
          //text: 'Bearish',
          text: 'Rainy',
          description: 'Downward pressure',
          icon: null,
        };
      case 'very-negative':
        return {
          //text: 'Strongly Bearish',
          text: 'Thunderstorm',
          description: 'Significant downward momentum',
          icon: null,
        };
      default:
        return {
          //text: 'Neutral',
          text: 'Partly Cloudy',
          description: 'Sideways trading pattern',
          icon: null,
        };
    }
  };

  const sentimentInfo = getSentimentInfo();

  const logoTicker = props.stockInfo.ticker.replace('.', '-');
  const logoUrl = `https://assets.parqet.com/logos/symbol/${logoTicker}`;

  return (
    <div className="relative">
      <div className="p-3">
        <div className="bg-background relative z-10 flex flex-row items-center justify-between rounded-xl p-1.5 shadow-2xl">
          {/* Company Logo */}
          <div className="flex size-16 items-center justify-center p-2">
            <div className="overflow-hidden rounded-md">
              <Image
                src={logoUrl}
                alt={`${props.stockInfo.name} logo`}
                width={64}
                height={64}
                className="max-h-full max-w-full"
              />
            </div>
          </div>
          <div className="text-centerh-16 flex flex-col items-end justify-center gap-0 px-3">
            <h1 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              {props.stockInfo.name}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {props.stockInfo.ticker}
            </p>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#ffffff] dark:to-gray-900"></div>

      {/* Canvas for 3D stock visualization */}
      <div
        className={` ${isMobile ? 'h-[300px]' : 'h-[400px]'} -mx-7 mb-4`}
      ></div>

      {/* Price display */}
      <div className="relative z-10 px-8 pb-8 text-center">
        <div className="inline-block">
          <div
            className={`${
              isMobile ? 'text-[120px]' : 'text-[100px]'
            } leading-none font-bold tracking-tighter text-gray-900 drop-shadow-lg dark:text-gray-100`}
          >
            {props.price.toFixed(2)}
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <div className="flex items-center">
              {props.change >= 0 ? (
                <ArrowUp className="mr-1 h-5 w-5 text-emerald-500" />
              ) : (
                <ArrowDown className="mr-1 h-5 w-5 text-rose-500" />
              )}
              <span
                className={`text-lg ${
                  props.change >= 0 ? 'text-emerald-500' : 'text-rose-500'
                }`}
              >
                {props.change >= 0 ? '+' : ''}
                {props.change.toFixed(2)} ({props.change >= 0 ? '+' : ''}
                {props.changePercent.toFixed(2)}%)
              </span>
            </div>
            {sentimentInfo.icon}
          </div>
          <div className="mt-2 text-center text-2xl font-medium text-gray-800 dark:text-gray-200">
            {sentimentInfo.text}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {sentimentInfo.description}
          </div>
        </div>
      </div>
    </div>
  );
}
