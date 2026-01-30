'use client';

import { Activity, Flame, Footprints, Heart, Timer, TrendingUp, Target, Dumbbell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MetricCard, MetricGrid } from '@/components/dashboard/MetricCard';
import { ProgressRing } from '@/components/charts/ProgressRing';
import { TrendChart } from '@/components/charts/TrendChart';
import { cn } from '@/lib/utils';

// Demo data
const activityData = {
  today: {
    steps: 8542,
    stepsGoal: 10000,
    activeCalories: 420,
    caloriesGoal: 500,
    activityScore: 75,
    workoutMinutes: 45,
    zone2Minutes: 30,
    vo2Max: 42.5,
    restingHr: 58,
  },
  week: {
    totalSteps: 62450,
    avgSteps: 8921,
    totalCalories: 3150,
    workoutDays: 5,
    zone2Hours: 2.5,
    strengthSessions: 2,
  },
};

const workoutHistory = [
  { date: 'Today', type: 'Zone 2 Run', duration: 45, calories: 380, hr: 135 },
  { date: 'Yesterday', type: 'Strength Training', duration: 55, calories: 320, hr: 125 },
  { date: '2 days ago', type: 'Zone 2 Cycle', duration: 50, calories: 350, hr: 130 },
  { date: '3 days ago', type: 'HIIT (4x4)', duration: 35, calories: 420, hr: 165 },
  { date: '4 days ago', type: 'Rest Day', duration: 0, calories: 0, hr: 0 },
];

const trendData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    value: 6000 + Math.random() * 6000,
  };
});

export default function ActivityPage() {
  const stepsPercent = (activityData.today.steps / activityData.today.stepsGoal) * 100;
  const caloriesPercent = (activityData.today.activeCalories / activityData.today.caloriesGoal) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Activity className="h-8 w-8 text-orange-500" />
          Activity
        </h1>
        <p className="text-muted-foreground">
          Track your movement, workouts, and fitness metrics.
        </p>
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Steps Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Footprints className="h-5 w-5 text-blue-500" />
              Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <ProgressRing
                value={stepsPercent}
                max={100}
                size={140}
                strokeWidth={10}
                color={stepsPercent >= 100 ? 'stroke-green-500' : 'stroke-blue-500'}
              >
                <div className="text-center">
                  <span className="text-2xl font-bold">{activityData.today.steps.toLocaleString()}</span>
                  <p className="text-xs text-muted-foreground">of {activityData.today.stepsGoal.toLocaleString()}</p>
                </div>
              </ProgressRing>
              <Progress value={stepsPercent} className="h-2 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Active Calories Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Active Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <ProgressRing
                value={caloriesPercent}
                max={100}
                size={140}
                strokeWidth={10}
                color={caloriesPercent >= 100 ? 'stroke-green-500' : 'stroke-orange-500'}
              >
                <div className="text-center">
                  <span className="text-2xl font-bold">{activityData.today.activeCalories}</span>
                  <p className="text-xs text-muted-foreground">of {activityData.today.caloriesGoal} kcal</p>
                </div>
              </ProgressRing>
              <Progress value={caloriesPercent} className="h-2 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Weekly Summary */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Steps</span>
                <span className="font-semibold">{activityData.week.totalSteps.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Daily</span>
                <span className="font-semibold">{activityData.week.avgSteps.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Workout Days</span>
                <span className="font-semibold">{activityData.week.workoutDays}/7</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Zone 2 Hours</span>
                <span className="font-semibold">{activityData.week.zone2Hours}h</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Strength Sessions</span>
                <span className="font-semibold">{activityData.week.strengthSessions}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <MetricGrid>
        <MetricCard
          title="VO2 Max"
          value={activityData.today.vo2Max}
          unit="ml/kg/min"
          status={activityData.today.vo2Max >= 40 ? 'optimal' : 'moderate'}
          icon={Heart}
          optimalRange={[40, 60]}
        />
        <MetricCard
          title="Resting HR"
          value={activityData.today.restingHr}
          unit="bpm"
          status={activityData.today.restingHr <= 60 ? 'optimal' : 'moderate'}
          icon={Heart}
          optimalRange={[50, 60]}
        />
        <MetricCard
          title="Zone 2 Today"
          value={activityData.today.zone2Minutes}
          unit="min"
          status={activityData.today.zone2Minutes >= 30 ? 'optimal' : 'moderate'}
          icon={Timer}
        />
        <MetricCard
          title="Activity Score"
          value={activityData.today.activityScore}
          unit="/100"
          status={activityData.today.activityScore >= 80 ? 'optimal' : activityData.today.activityScore >= 60 ? 'moderate' : 'attention'}
          icon={Activity}
        />
      </MetricGrid>

      {/* Trends & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Steps Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Steps Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart data={trendData} type="area" color="#3b82f6" height={200} />
          </CardContent>
        </Card>

        {/* Workout History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Recent Workouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workoutHistory.map((workout, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg',
                    workout.duration > 0 ? 'bg-muted/50' : 'bg-muted/25 opacity-60'
                  )}
                >
                  <div>
                    <p className="font-medium">{workout.type}</p>
                    <p className="text-sm text-muted-foreground">{workout.date}</p>
                  </div>
                  {workout.duration > 0 && (
                    <div className="text-right text-sm">
                      <p>{workout.duration} min</p>
                      <p className="text-muted-foreground">{workout.calories} kcal</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peter Attia Framework */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Peter Attia&apos;s Exercise Framework
          </CardTitle>
          <CardDescription>
            The four pillars of longevity-focused exercise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: 'Zone 2 Cardio',
                target: '3-4 hours/week',
                current: `${activityData.week.zone2Hours}h`,
                progress: (activityData.week.zone2Hours / 3.5) * 100,
                color: 'bg-blue-500',
                desc: 'Mitochondrial health, fat oxidation',
              },
              {
                name: 'VO2 Max Training',
                target: '1x/week',
                current: '1 session',
                progress: 100,
                color: 'bg-red-500',
                desc: '4x4 intervals at 90% max HR',
              },
              {
                name: 'Strength',
                target: '2-3x/week',
                current: `${activityData.week.strengthSessions}x`,
                progress: (activityData.week.strengthSessions / 2.5) * 100,
                color: 'bg-orange-500',
                desc: 'Muscle mass preservation',
              },
              {
                name: 'Stability',
                target: 'Daily',
                current: '5 days',
                progress: 71,
                color: 'bg-green-500',
                desc: 'Foundation for all movement',
              },
            ].map((pillar) => (
              <div key={pillar.name} className="p-4 rounded-lg bg-muted/50 space-y-3">
                <div>
                  <h4 className="font-semibold">{pillar.name}</h4>
                  <p className="text-xs text-muted-foreground">{pillar.desc}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{pillar.current}</span>
                  <span className="text-muted-foreground">{pillar.target}</span>
                </div>
                <div className="relative h-2 rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full', pillar.color)}
                    style={{ width: `${Math.min(100, pillar.progress)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
