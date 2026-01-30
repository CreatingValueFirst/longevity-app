'use client';

import { motion } from 'framer-motion';
import { Clock, TrendingDown, TrendingUp, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface BiologicalAgeDisplayProps {
  biologicalAge: number;
  chronologicalAge: number;
  sleepScore?: number;
  activityScore?: number;
  recoveryScore?: number;
  nutritionScore?: number;
  biomarkerScore?: number;
  className?: string;
}

export function BiologicalAgeDisplay({
  biologicalAge,
  chronologicalAge,
  sleepScore,
  activityScore,
  recoveryScore,
  nutritionScore,
  biomarkerScore,
  className,
}: BiologicalAgeDisplayProps) {
  const ageDifference = biologicalAge - chronologicalAge;
  const isYounger = ageDifference < 0;

  const scoreFactors = [
    { name: 'Sleep', score: sleepScore, color: 'bg-blue-500', impact: 0.25 },
    { name: 'Activity', score: activityScore, color: 'bg-orange-500', impact: 0.25 },
    { name: 'Recovery', score: recoveryScore, color: 'bg-green-500', impact: 0.20 },
    { name: 'Nutrition', score: nutritionScore, color: 'bg-amber-500', impact: 0.15 },
    { name: 'Biomarkers', score: biomarkerScore, color: 'bg-purple-500', impact: 0.15 },
  ].filter(f => f.score != null);

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Biological Age
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>
                  Biological age is estimated based on your health metrics and compares how your body is aging relative to your chronological age.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Main Display */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <motion.span
                  className="text-5xl font-bold tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={biologicalAge}
                >
                  {biologicalAge.toFixed(1)}
                </motion.span>
                <span className="text-lg text-muted-foreground">years</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Chronological: {chronologicalAge} years
              </p>
            </div>

            <Badge
              variant={isYounger ? 'default' : 'destructive'}
              className={cn(
                'text-lg py-2 px-4',
                isYounger ? 'bg-green-500 hover:bg-green-600' : ''
              )}
            >
              <span className="flex items-center gap-1">
                {isYounger ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
                {isYounger ? '' : '+'}{ageDifference.toFixed(1)} yrs
              </span>
            </Badge>
          </div>

          {/* Contributing Factors */}
          {scoreFactors.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Contributing Factors</p>
              <div className="space-y-2">
                {scoreFactors.map((factor) => (
                  <div key={factor.name} className="flex items-center gap-3">
                    <div className={cn('w-2 h-2 rounded-full', factor.color)} />
                    <span className="text-sm flex-1">{factor.name}</span>
                    <span className="text-sm font-medium">{factor.score}</span>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className={cn('h-full rounded-full', factor.color)}
                        initial={{ width: 0 }}
                        animate={{ width: `${factor.score}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interpretation */}
          <div className={cn(
            'p-3 rounded-lg',
            isYounger ? 'bg-green-500/10' : 'bg-amber-500/10'
          )}>
            <p className="text-sm">
              {isYounger ? (
                <>
                  Your biological age is <strong>{Math.abs(ageDifference).toFixed(1)} years younger</strong> than your chronological age. Keep up the great work!
                </>
              ) : ageDifference === 0 ? (
                <>
                  Your biological age matches your chronological age. There&apos;s room for improvement!
                </>
              ) : (
                <>
                  Your biological age is <strong>{ageDifference.toFixed(1)} years older</strong> than your chronological age. Focus on improving your lowest scoring areas.
                </>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
