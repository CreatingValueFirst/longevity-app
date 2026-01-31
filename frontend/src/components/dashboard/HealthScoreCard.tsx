'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressRing } from '@/components/charts/ProgressRing';
import { cn } from '@/lib/utils';
import type { TrendDirection } from '@/types/health';

interface HealthScoreCardProps {
  overallScore: number;
  biologicalAge: number;
  chronologicalAge: number;
  trend: TrendDirection;
  lastUpdated?: Date;
  isLoading?: boolean;
  className?: string;
}

export function HealthScoreCard({
  overallScore,
  biologicalAge,
  chronologicalAge,
  trend,
  lastUpdated,
  isLoading,
  className,
}: HealthScoreCardProps) {
  const ageDifference = biologicalAge - chronologicalAge;
  const isYounger = ageDifference < 0;

  const TrendIcon = trend === 'improving' ? TrendingUp : trend === 'declining' ? TrendingDown : Minus;
  const trendColor = trend === 'improving' ? 'text-green-500' : trend === 'declining' ? 'text-red-500' : 'text-amber-500';

  // Score color based on value
  const scoreColor =
    overallScore >= 80 ? 'stroke-green-500' :
    overallScore >= 60 ? 'stroke-amber-500' :
    'stroke-red-500';

  if (isLoading) {
    return (
      <Card className={cn('', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-muted" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('overflow-hidden relative', className)} variant="glass">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-chart-2/5 pointer-events-none" />

      <CardHeader className="pb-2 relative">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-chart-4/20">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <span className="gradient-text">Health Score</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 relative">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          {/* Main Score Ring */}
          <div className="relative">
            <ProgressRing
              value={overallScore}
              max={100}
              size={140}
              strokeWidth={10}
              color={scoreColor}
            >
              <div className="flex flex-col items-center">
                <motion.span
                  className="text-3xl sm:text-4xl font-bold gradient-text"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {overallScore}
                </motion.span>
                <span className="text-xs sm:text-sm text-muted-foreground">of 100</span>
              </div>
            </ProgressRing>
            {/* Glow effect */}
            <div className={cn(
              'absolute inset-0 rounded-full blur-xl opacity-30 -z-10',
              overallScore >= 80 ? 'bg-green-500' :
              overallScore >= 60 ? 'bg-amber-500' :
              'bg-red-500'
            )} />
          </div>

          {/* Biological Age */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl sm:text-2xl font-semibold">{biologicalAge.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">years</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 mt-1">
              <span className="text-xs sm:text-sm text-muted-foreground">Biological Age</span>
              <span className={cn(
                'text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-full',
                isYounger ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
              )}>
                {isYounger ? '' : '+'}{ageDifference.toFixed(1)} yrs
              </span>
            </div>
          </div>

          {/* Trend Indicator */}
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full',
            trend === 'improving' ? 'bg-green-500/10' :
            trend === 'declining' ? 'bg-red-500/10' :
            'bg-amber-500/10'
          )}>
            <TrendIcon className={cn('h-4 w-4', trendColor)} />
            <span className={cn('text-xs sm:text-sm font-medium capitalize', trendColor)}>
              {trend}
            </span>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated.toLocaleString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
              })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
