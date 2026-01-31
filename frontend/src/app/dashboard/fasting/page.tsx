'use client';

import { useMemo } from 'react';
import { Timer, Flame, TrendingUp, Calendar, Info, Zap, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FastingTimer } from '@/components/tracking/FastingTimer';
import { TrendChart } from '@/components/charts/TrendChart';
import { METABOLIC_STATES } from '@/types/health';
import { cn } from '@/lib/utils';
import { useFasting } from '@/hooks/useFasting';

export default function FastingPage() {
  const {
    isActive,
    elapsedHours,
    targetHours,
    progressPercent,
    metabolicState,
    startFast,
    endFast,
    isStarting,
    isEnding,
    isLoading,
    history,
  } = useFasting();

  // Calculate stats from history
  const stats = useMemo(() => {
    if (history.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        averageDuration: 0,
        totalFasts: 0,
        completionRate: 0,
      };
    }

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Sort history by date descending
    const sortedHistory = [...history].sort((a, b) => b.date.localeCompare(a.date));

    for (let i = 0; i < sortedHistory.length; i++) {
      const entry = sortedHistory[i];
      if (entry.completed) {
        tempStreak++;
        if (i === 0 && (entry.date === today || entry.date === yesterday)) {
          currentStreak = tempStreak;
        }
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 0;
        if (i === 0) {
          currentStreak = 0;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    if (currentStreak === 0 && sortedHistory[0]?.completed) {
      currentStreak = tempStreak;
    }

    const completedFasts = history.filter(h => h.completed).length;
    const avgDuration = history.length > 0
      ? history.reduce((sum, h) => sum + h.duration, 0) / history.length
      : 0;

    return {
      currentStreak,
      longestStreak,
      averageDuration: Math.round(avgDuration * 10) / 10,
      totalFasts: history.length,
      completionRate: history.length > 0 ? Math.round((completedFasts / history.length) * 100) : 0,
    };
  }, [history]);

  // Prepare trend data from history
  const trendData = useMemo(() => {
    return [...history]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7)
      .map((f) => ({
        date: f.date,
        value: f.duration,
      }));
  }, [history]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Timer className="h-8 w-8 text-orange-500" />
            Intermittent Fasting
          </h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
          <Timer className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
          Intermittent Fasting
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track your fasting windows and unlock metabolic benefits.
        </p>
      </div>

      {/* Main Timer + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <FastingTimer
          isActive={isActive}
          elapsedHours={elapsedHours}
          targetHours={targetHours}
          progressPercent={progressPercent}
          metabolicState={metabolicState}
          onStart={startFast}
          onEnd={endFast}
          isStarting={isStarting}
          isEnding={isEnding}
        />

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Fasting Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
              <div className="text-center p-3 sm:p-4 rounded-lg bg-orange-500/10">
                <Flame className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-orange-500" />
                <p className="text-xl sm:text-2xl font-bold">{stats.currentStreak}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Day Streak</p>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-muted/50">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-green-500" />
                <p className="text-xl sm:text-2xl font-bold">{stats.completionRate}%</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Completion</p>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-muted/50">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-blue-500" />
                <p className="text-xl sm:text-2xl font-bold">{stats.averageDuration}h</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Avg Duration</p>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-muted/50">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mx-auto mb-1 sm:mb-2 text-purple-500" />
                <p className="text-xl sm:text-2xl font-bold">{stats.totalFasts}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Fasts</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Metabolic States Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Metabolic States During Fasting
          </CardTitle>
          <CardDescription>
            Your body transitions through different metabolic states as you fast
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(METABOLIC_STATES).map(([key, state]) => (
              <div
                key={key}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all',
                  metabolicState === key ? 'border-primary bg-primary/5' : 'border-transparent bg-muted/50'
                )}
              >
                <div className={cn('w-3 h-3 rounded-full mb-2', state.color)} />
                <p className="font-medium text-sm">{state.name}</p>
                <p className="text-xs text-muted-foreground">
                  {state.minHours}-{state.maxHours === Infinity ? '∞' : state.maxHours}h
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* History & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Fasting Duration Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trendData.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Complete some fasts to see your trend
              </div>
            ) : (
              <TrendChart data={trendData} type="area" color="#f59e0b" height={200} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Fasts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No fasting history yet. Start your first fast!
                </p>
              ) : (
                history.slice(0, 5).map((fast) => (
                  <div key={fast.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">
                        {new Date(fast.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-sm text-muted-foreground">Target: {fast.target}h</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{fast.duration.toFixed(1)}h</p>
                      <Badge variant={fast.completed ? 'default' : 'secondary'} className={fast.completed ? 'bg-green-500' : ''}>
                        {fast.completed ? 'Completed' : 'Partial'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fasting Benefits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Benefits of Intermittent Fasting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Autophagy', desc: 'Cellular cleanup process that removes damaged proteins and organelles (peaks at 24-48h)' },
              { title: 'Insulin Sensitivity', desc: 'Improved glucose metabolism and reduced insulin resistance' },
              { title: 'Fat Oxidation', desc: 'Enhanced fat burning after glycogen depletion (12-16h)' },
              { title: 'HGH Increase', desc: 'Growth hormone spikes up to 5x during extended fasts' },
              { title: 'Brain Health', desc: 'Increased BDNF production supporting neuroplasticity' },
              { title: 'Longevity', desc: 'Activation of sirtuins and other longevity pathways' },
            ].map((benefit) => (
              <div key={benefit.title} className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular Protocols */}
      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-lg">Popular Fasting Protocols</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {[
              { name: '16:8', eating: '8h', fasting: '16h', desc: 'Most popular, sustainable' },
              { name: '18:6', eating: '6h', fasting: '18h', desc: 'Enhanced fat burning' },
              { name: '20:4', eating: '4h', fasting: '20h', desc: 'Significant autophagy' },
              { name: '5:2', eating: '5 days', fasting: '2 days', desc: 'Alternate day fasting' },
            ].map((protocol) => (
              <Button
                key={protocol.name}
                variant="outline"
                className="h-auto p-3 sm:p-4 flex flex-col items-start text-left touch-manipulation min-h-[72px]"
                onClick={() => {
                  const hours = parseInt(protocol.fasting);
                  if (!isNaN(hours)) startFast(hours);
                }}
              >
                <span className="text-lg sm:text-xl font-bold">{protocol.name}</span>
                <span className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{protocol.desc}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
