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

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={bgColor}
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={color}
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
