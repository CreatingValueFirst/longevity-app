'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  className?: string;
  children?: React.ReactNode;
  animate?: boolean;
}

export function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = 'stroke-primary',
  bgColor = 'stroke-muted',
  className,
  children,
  animate = true,
}: ProgressRingProps) {
  // Ensure size is valid (greater than 0)
  const safeSize = Math.max(size, 1);
  const safeStrokeWidth = Math.max(strokeWidth, 1);

  const radius = (safeSize - safeStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Memoize gradient ID to prevent regeneration on every render
  const gradientId = useMemo(
    () => `progress-gradient-${Math.random().toString(36).substr(2, 9)}`,
    []
  );
  const useGradient = color.includes('green') || color.includes('amber') || color.includes('red');

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={safeSize}
        height={safeSize}
        viewBox={`0 0 ${safeSize} ${safeSize}`}
        className="transform -rotate-90"
        role="img"
        aria-label={`Progress: ${percent.toFixed(0)}%`}
      >
        <defs>
          {/* Premium gradient definitions */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            {color.includes('green') ? (
              <>
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#16a34a" />
              </>
            ) : color.includes('amber') ? (
              <>
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </>
            ) : color.includes('red') ? (
              <>
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#dc2626" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="hsl(221 83% 53%)" />
                <stop offset="50%" stopColor="hsl(262 83% 58%)" />
                <stop offset="100%" stopColor="hsl(152 76% 40%)" />
              </>
            )}
          </linearGradient>

          {/* Glow filter */}
          <filter id={`glow-${gradientId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background circle with subtle styling */}
        <circle
          cx={safeSize / 2}
          cy={safeSize / 2}
          r={radius}
          fill="none"
          strokeWidth={safeStrokeWidth}
          className={bgColor}
          opacity={0.2}
        />

        {/* Progress circle with gradient */}
        <motion.circle
          cx={safeSize / 2}
          cy={safeSize / 2}
          r={radius}
          fill="none"
          strokeWidth={safeStrokeWidth}
          strokeLinecap="round"
          stroke={useGradient ? `url(#${gradientId})` : undefined}
          className={useGradient ? undefined : color}
          filter={`url(#glow-${gradientId})`}
          initial={animate ? { strokeDashoffset: circumference } : undefined}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

interface MultiRingProps {
  rings: Array<{
    value: number;
    max?: number;
    color: string;
    label?: string;
  }>;
  size?: number;
  strokeWidth?: number;
  gap?: number;
  className?: string;
}

export function MultiProgressRing({
  rings,
  size = 160,
  strokeWidth = 6,
  gap = 4,
  className,
}: MultiRingProps) {
  // Ensure size is valid (greater than 0)
  const safeSize = Math.max(size, 1);
  const safeStrokeWidth = Math.max(strokeWidth, 1);
  const safeGap = Math.max(gap, 0);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={safeSize}
        height={safeSize}
        viewBox={`0 0 ${safeSize} ${safeSize}`}
        className="transform -rotate-90"
        role="img"
        aria-label="Multi-ring progress indicator"
      >
        {rings.map((ring, index) => {
          const ringOffset = index * (safeStrokeWidth + safeGap);
          const radius = (safeSize - safeStrokeWidth) / 2 - ringOffset;
          const circumference = radius * 2 * Math.PI;
          const percent = Math.min(100, Math.max(0, (ring.value / (ring.max ?? 100)) * 100));
          const strokeDashoffset = circumference - (percent / 100) * circumference;

          return (
            <g key={ring.label || index}>
              {/* Background */}
              <circle
                cx={safeSize / 2}
                cy={safeSize / 2}
                r={radius}
                fill="none"
                strokeWidth={safeStrokeWidth}
                className="stroke-muted"
                opacity={0.3}
              />

              {/* Progress */}
              <motion.circle
                cx={safeSize / 2}
                cy={safeSize / 2}
                r={radius}
                fill="none"
                strokeWidth={safeStrokeWidth}
                strokeLinecap="round"
                className={ring.color}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
                style={{
                  strokeDasharray: circumference,
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
