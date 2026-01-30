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
  changeLabel?: string;
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
  changeLabel,
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
        'overflow-hidden transition-all hover:shadow-md',
        onClick && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            {Icon && (
              <div className={cn('p-2 rounded-lg', statusColors.bg)}>
                <Icon className={cn('h-4 w-4', statusColors.text)} />
              </div>
            )}
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
          </div>
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 text-xs font-medium',
              isPositiveChange ? 'text-green-500' : isNegativeChange ? 'text-red-500' : 'text-muted-foreground'
            )}>
              {isPositiveChange ? (
                <TrendingUp className="h-3 w-3" />
              ) : isNegativeChange ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              {Math.abs(change).toFixed(1)}%
              {changeLabel && <span className="text-muted-foreground ml-1">{changeLabel}</span>}
            </div>
          )}
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <motion.span
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={value}
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </motion.span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>

          {sparklineData && sparklineData.length > 2 && (
            <Sparkline
              data={sparklineData}
              color={sparklineColor}
              width={60}
              height={24}
            />
          )}
        </div>

        {optimalRange && (
          <div className="mt-2 pt-2 border-t">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Optimal: {optimalRange[0]}-{optimalRange[1]}</span>
              <span className={cn('font-medium', statusColors.text)}>
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
