'use client';

import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

interface WeatherDisplayProps {
  temperature: number;
  condition: string;
  cloudCover: number;
}

export function WeatherDisplay({
  temperature,
  condition,
  cloudCover,
}: WeatherDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  // 3D weather animation
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
    let clouds: any[] = [];
    let animationFrameId: number;

    // Create clouds with varied properties
    const createClouds = () => {
      clouds = [];

      // Determine number of clouds based on cloud cover
      const cloudCount = Math.floor((cloudCover / 100) * 8) + 2;

      // Create sun/moon
      const isDark = theme === 'dark';
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 - 20;
      const radius = Math.min(canvas.width, canvas.height) * 0.25;

      clouds.push({
        type: 'celestial',
        x: centerX,
        y: centerY,
        radius: radius,
        color: isDark ? '#e2e8f0' : '#f43f5e', // Slate-200 for moon, Rose-500 for sun
        shadowColor: isDark
          ? 'rgba(226, 232, 240, 0.2)'
          : 'rgba(244, 63, 94, 0.2)',
        shadowBlur: 30,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        texture: true,
      });

      // Create varied clouds
      for (let i = 0; i < cloudCount; i++) {
        // Determine cloud size and position
        const size = Math.random() * 40 + 30;
        const xPos = Math.random() * canvas.width;
        const yPos = centerY + (Math.random() * 40 - 20);

        // Create cloud with multiple bubbles
        const bubbleCount = Math.floor(Math.random() * 3) + 3;
        const bubbles = [];

        for (let j = 0; j < bubbleCount; j++) {
          const bubbleSize = size * (0.5 + Math.random() * 0.5);
          const offsetX = j * (size * 0.4) - (bubbleCount * size * 0.2) / 2;
          const offsetY = Math.random() * 10 - 5;

          bubbles.push({
            x: offsetX,
            y: offsetY,
            radius: bubbleSize / 2,
          });
        }

        // Add cloud to array
        clouds.push({
          type: 'cloud',
          x: xPos,
          y: yPos,
          size: size,
          bubbles: bubbles,
          speed: Math.random() * 0.2 - 0.1,
          color: isDark ? '#1e293b' : '#0f172a', // Slate-800 or Slate-900
          shadowColor: isDark
            ? 'rgba(30, 41, 59, 0.4)'
            : 'rgba(15, 23, 42, 0.4)',
          shadowBlur: 10,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          opacity: 0.8 + Math.random() * 0.2,
        });
      }
    };

    // Draw clouds
    const drawClouds = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Sort clouds by type (celestial first, then clouds)
      clouds.sort((a, b) => {
        if (a.type === 'celestial' && b.type !== 'celestial') return -1;
        if (a.type !== 'celestial' && b.type === 'celestial') return 1;
        return 0;
      });

      // Draw each cloud
      clouds.forEach((cloud) => {
        if (cloud.type === 'celestial') {
          // Draw sun/moon
          ctx.save();

          // Add shadow
          ctx.shadowColor = cloud.shadowColor;
          ctx.shadowBlur = cloud.shadowBlur;
          ctx.shadowOffsetX = cloud.shadowOffsetX;
          ctx.shadowOffsetY = cloud.shadowOffsetY;

          // Draw circle
          ctx.beginPath();
          ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
          ctx.fillStyle = cloud.color;
          ctx.fill();

          // Add texture if needed
          if (cloud.texture) {
            const gradient = ctx.createRadialGradient(
              cloud.x - cloud.radius * 0.3,
              cloud.y - cloud.radius * 0.3,
              0,
              cloud.x,
              cloud.y,
              cloud.radius
            );
            gradient.addColorStop(
              0,
              theme === 'dark'
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(255, 255, 255, 0.4)'
            );
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
          }

          ctx.restore();
        } else if (cloud.type === 'cloud') {
          // Draw cloud
          ctx.save();

          // Add shadow
          ctx.shadowColor = cloud.shadowColor;
          ctx.shadowBlur = cloud.shadowBlur;
          ctx.shadowOffsetX = cloud.shadowOffsetX;
          ctx.shadowOffsetY = cloud.shadowOffsetY;

          // Set global alpha for cloud opacity
          ctx.globalAlpha = cloud.opacity;

          // Draw each bubble in the cloud
          cloud.bubbles.forEach((bubble: any) => {
            ctx.beginPath();
            ctx.arc(
              cloud.x + bubble.x,
              cloud.y + bubble.y,
              bubble.radius,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = cloud.color;
            ctx.fill();
          });

          // Move cloud
          cloud.x += cloud.speed;

          // Wrap around screen
          if (cloud.x < -cloud.size * 2) {
            cloud.x = canvas.width + cloud.size;
          } else if (cloud.x > canvas.width + cloud.size * 2) {
            cloud.x = -cloud.size;
          }

          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(drawClouds);
    };

    createClouds();
    drawClouds();

    // Recreate clouds when theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          createClouds();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    };
  }, [cloudCover, theme]);

  return (
    <div className="relative mb-8">
      {/* Canvas for 3D weather animation */}
      <div className="relative mb-4 h-[300px]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      {/* Temperature display */}
      <div className="relative z-10 text-center">
        <div className="inline-block">
          <div className="text-[120px] leading-none font-bold tracking-tighter text-gray-900 drop-shadow-lg dark:text-gray-100">
            {temperature}
          </div>
          <div className="mt-2 text-center text-2xl font-medium text-gray-800 dark:text-gray-200">
            {condition}
          </div>
        </div>
      </div>
    </div>
  );
}
