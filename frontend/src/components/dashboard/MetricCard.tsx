'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkline } from '@/components/charts/TrendChart';
import { cn } from '@/lib/utils';
import { getStatusColors } from '@/lib/calculations';
import type { MetricStatus } from '@/types/health';

interface MetricCardProps {
  title: string;
  value: number | string;
  unit?: string;
  change?: number;
  status?: MetricStatus;
  icon?: LucideIcon;
  sparklineData?: (number | null)[];
  optimalRange?: [number, number];
  className?: string;
  onClick?: () => void;
}

export function MetricCard({
  title,
  value,
  unit,
  change,
  status = 'moderate',
  icon: Icon,
  sparklineData,
  optimalRange,
  className,
  onClick,
}: MetricCardProps) {
  const statusColors = getStatusColors(status);
  const isPositiveChange = change !== undefined && change > 0;
  const isNegativeChange = change !== undefined && change < 0;

  // Determine sparkline color based on status
  const sparklineColor =
    status === 'optimal' ? '#22c55e' :
    status === 'attention' ? '#ef4444' :
    '#f59e0b';

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all duration-300 card-hover group relative',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-chart-2/3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <CardContent className="p-3 sm:p-4 relative">
        <div className="flex justify-between items-start mb-2 sm:mb-3">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className={cn('p-1.5 sm:p-2 rounded-lg transition-transform group-hover:scale-110', statusColors.bg)}>
                <Icon className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', statusColors.text)} />
              </div>
            )}
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full',
              isPositiveChange ? 'text-green-500 bg-green-500/10' :
              isNegativeChange ? 'text-red-500 bg-red-500/10' :
              'text-muted-foreground bg-muted'
            )}>
              {isPositiveChange ? (
                <TrendingUp className="h-3 w-3" />
              ) : isNegativeChange ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              {Math.abs(change).toFixed(1)}%
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <motion.span
              className="text-2xl sm:text-3xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={value}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </motion.span>
            {unit && (
              <span className="text-xs sm:text-sm text-muted-foreground">{unit}</span>
            )}
          </div>

          {sparklineData && sparklineData.length > 2 && (
            <div className="hidden sm:block">
              <Sparkline
                data={sparklineData}
                color={sparklineColor}
                width={60}
                height={24}
              />
            </div>
          )}
        </div>

        {optimalRange && (
          <div className="mt-2 pt-2 border-t border-border/50">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Optimal: {optimalRange[0]}-{optimalRange[1]}</span>
              <span className={cn('font-semibold px-1.5 py-0.5 rounded', statusColors.text, statusColors.bg)}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Grid of metric cards
interface MetricGridProps {
  children: React.ReactNode;
  className?: string;
}

export function MetricGrid({ children, className }: MetricGridProps) {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {children}
    </div>
  );
}
