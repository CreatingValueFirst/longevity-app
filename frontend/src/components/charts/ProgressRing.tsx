'use client';

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
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  // Determine gradient ID based on color
  const gradientId = `progress-gradient-${Math.random().toString(36).substr(2, 9)}`;
  const useGradient = color.includes('green') || color.includes('amber') || color.includes('red');

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
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
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={bgColor}
          opacity={0.2}
        />

        {/* Progress circle with gradient */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
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

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {rings.map((ring, index) => {
          const ringOffset = index * (strokeWidth + gap);
          const radius = (size - strokeWidth) / 2 - ringOffset;
          const circumference = radius * 2 * Math.PI;
          const percent = Math.min(100, Math.max(0, (ring.value / (ring.max ?? 100)) * 100));
          const strokeDashoffset = circumference - (percent / 100) * circumference;

          return (
            <g key={index}>
              {/* Background */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeWidth={strokeWidth}
                className="stroke-muted"
                opacity={0.3}
              />

              {/* Progress */}
              <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeWidth={strokeWidth}
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
