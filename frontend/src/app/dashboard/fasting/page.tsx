'use client';

import { useState } from 'react';
import { Timer, Flame, TrendingUp, Calendar, Info, Zap, Clock, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FastingTimer } from '@/components/tracking/FastingTimer';
import { TrendChart } from '@/components/charts/TrendChart';
import { METABOLIC_STATES } from '@/types/health';
import { cn } from '@/lib/utils';

// Demo data
const fastingHistory = [
  { date: '2024-01-29', duration: 16.5, target: 16, completed: true },
  { date: '2024-01-28', duration: 18.2, target: 18, completed: true },
  { date: '2024-01-27', duration: 14.5, target: 16, completed: false },
  { date: '2024-01-26', duration: 16.0, target: 16, completed: true },
  { date: '2024-01-25', duration: 17.8, target: 18, completed: false },
  { date: '2024-01-24', duration: 16.3, target: 16, completed: true },
  { date: '2024-01-23', duration: 20.1, target: 20, completed: true },
];

const trendData = fastingHistory.map((f) => ({
  date: f.date,
  value: f.duration,
})).reverse();

const stats = {
  currentStreak: 5,
  longestStreak: 14,
  averageDuration: 16.8,
  totalFasts: 45,
  completionRate: 87,
};

export default function FastingPage() {
  const [fastingState, setFastingState] = useState({
    isActive: false,
    elapsedHours: 0,
    targetHours: 16,
  });

  const handleStartFast = (targetHours?: number) => {
    setFastingState({
      isActive: true,
      elapsedHours: 0,
      targetHours: targetHours || 16,
    });
    // Demo: simulate time passing
    const interval = setInterval(() => {
      setFastingState((prev) => ({
        ...prev,
        elapsedHours: prev.elapsedHours + 0.1,
      }));
    }, 1000);
    (window as unknown as { fastingInterval?: NodeJS.Timeout }).fastingInterval = interval;
  };

  const handleEndFast = () => {
    clearInterval((window as unknown as { fastingInterval?: NodeJS.Timeout }).fastingInterval);
    setFastingState({
      isActive: false,
      elapsedHours: 0,
      targetHours: 16,
    });
  };

  const metabolicState =
    fastingState.elapsedHours < 4 ? 'fed' :
    fastingState.elapsedHours < 12 ? 'early_fasting' :
    fastingState.elapsedHours < 16 ? 'fat_burning' :
    fastingState.elapsedHours < 24 ? 'ketosis' :
    fastingState.elapsedHours < 48 ? 'deep_ketosis' :
    'autophagy';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Timer className="h-8 w-8 text-orange-500" />
          Intermittent Fasting
        </h1>
        <p className="text-muted-foreground">
          Track your fasting windows and unlock metabolic benefits.
        </p>
      </div>

      {/* Main Timer + Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FastingTimer
          isActive={fastingState.isActive}
          elapsedHours={fastingState.elapsedHours}
          targetHours={fastingState.targetHours}
          progressPercent={(fastingState.elapsedHours / fastingState.targetHours) * 100}
          metabolicState={metabolicState}
          onStart={handleStartFast}
          onEnd={handleEndFast}
        />

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fasting Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-orange-500/10">
                <Flame className="h-6 w-6 mx-auto mb-2 text-orange-500" />
                <p className="text-2xl font-bold">{stats.currentStreak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Target className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <p className="text-2xl font-bold">{stats.completionRate}%</p>
                <p className="text-sm text-muted-foreground">Completion</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Clock className="h-6 w-6 mx-auto mb-2 text-blue-500" />
                <p className="text-2xl font-bold">{stats.averageDuration}h</p>
                <p className="text-sm text-muted-foreground">Avg Duration</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <p className="text-2xl font-bold">{stats.totalFasts}</p>
                <p className="text-sm text-muted-foreground">Total Fasts</p>
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
            <TrendChart data={trendData} type="area" color="#f59e0b" height={200} />
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
              {fastingHistory.slice(0, 5).map((fast) => (
                <div key={fast.date} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
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
              ))}
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
        <CardHeader>
          <CardTitle>Popular Fasting Protocols</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { name: '16:8', eating: '8h', fasting: '16h', desc: 'Most popular, sustainable daily protocol' },
              { name: '18:6', eating: '6h', fasting: '18h', desc: 'Enhanced fat burning benefits' },
              { name: '20:4', eating: '4h', fasting: '20h', desc: 'OMAD-lite, significant autophagy' },
              { name: '5:2', eating: '5 days', fasting: '2 days', desc: '500-600 cal on fast days' },
            ].map((protocol) => (
              <Button
                key={protocol.name}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start text-left"
                onClick={() => {
                  const hours = parseInt(protocol.fasting);
                  if (!isNaN(hours)) handleStartFast(hours);
                }}
              >
                <span className="text-xl font-bold">{protocol.name}</span>
                <span className="text-sm text-muted-foreground">{protocol.desc}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
