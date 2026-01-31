'use client';

import { useState, useEffect } from 'react';
import { Moon, Activity, Heart, Zap, TrendingUp, Brain } from 'lucide-react';
import { HealthScoreCard } from '@/components/dashboard/HealthScoreCard';
import { BiologicalAgeDisplay } from '@/components/dashboard/BiologicalAgeDisplay';
import { MetricCard, MetricGrid } from '@/components/dashboard/MetricCard';
import { FastingTimer } from '@/components/tracking/FastingTimer';
import { ProtocolChecklist } from '@/components/tracking/ProtocolChecklist';
import { TrendChart } from '@/components/charts/TrendChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStore } from '@/stores/userStore';
import type { MetricStatus, TrendDirection } from '@/types/health';
import type { ProtocolItem } from '@/types/protocols';

// Demo data for initial render
const demoScores = {
  overallScore: 78,
  biologicalAge: 32.4,
  chronologicalAge: 35,
  trend: 'improving' as TrendDirection,
  sleepScore: 82,
  activityScore: 75,
  recoveryScore: 80,
  nutritionScore: 72,
};

const demoMetrics = {
  sleep: { value: 7.5, unit: 'hrs', change: 5, status: 'optimal' as MetricStatus, sparkline: [7.2, 7.0, 7.5, 7.8, 7.3, 7.5, 7.5] },
  hrv: { value: 58, unit: 'ms', change: 12, status: 'optimal' as MetricStatus, sparkline: [52, 55, 54, 58, 56, 59, 58] },
  steps: { value: 8542, unit: 'steps', change: -3, status: 'moderate' as MetricStatus, sparkline: [9200, 8500, 7800, 8900, 8200, 8542, 8542] },
  rhr: { value: 58, unit: 'bpm', change: -2, status: 'optimal' as MetricStatus, sparkline: [60, 59, 58, 59, 58, 57, 58] },
};

const demoProtocolItems: ProtocolItem[] = [
  { id: '1', name: 'Morning light exposure (10-30 min)', category: 'sleep', frequency: 'daily', timeOfDay: 'morning', isActive: true },
  { id: '2', name: 'Vitamin D3 (4000 IU)', category: 'supplement', frequency: 'daily', timeOfDay: 'morning', dosage: '4000 IU', isActive: true },
  { id: '3', name: 'Omega-3 (EPA+DHA)', category: 'supplement', frequency: 'daily', timeOfDay: 'morning', dosage: '2g', isActive: true },
  { id: '4', name: 'Zone 2 cardio (45 min)', category: 'exercise', frequency: 'daily', timeOfDay: 'morning', isActive: true },
  { id: '5', name: 'Protein target (160g)', category: 'nutrition', frequency: 'daily', timeOfDay: 'anytime', isActive: true },
  { id: '6', name: 'Creatine monohydrate', category: 'supplement', frequency: 'daily', timeOfDay: 'afternoon', dosage: '5g', isActive: true },
  { id: '7', name: 'Magnesium glycinate', category: 'supplement', frequency: 'daily', timeOfDay: 'evening', dosage: '400mg', isActive: true },
  { id: '8', name: 'Wind down routine', category: 'sleep', frequency: 'daily', timeOfDay: 'evening', isActive: true },
];

const demoTrendData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    value: 70 + Math.random() * 20,
  };
});

export default function DashboardPage() {
  const profile = useUserStore((state) => state.profile);
  const getChronologicalAge = useUserStore((state) => state.getChronologicalAge);
  const [isLoading, setIsLoading] = useState(true);
  const [completedProtocols, setCompletedProtocols] = useState<Set<string>>(new Set(['1', '2']));
  const [fastingState, setFastingState] = useState({
    isActive: false,
    elapsedHours: 0,
    targetHours: 16,
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Demo: Set up a profile if not exists
  useEffect(() => {
    if (!profile) {
      useUserStore.getState().setProfile({
        id: 'demo-user',
        fullName: 'Demo User',
        email: 'demo@longevity.app',
        dateOfBirth: '1989-06-15',
        gender: 'male',
        heightCm: 178,
        weightKg: 75,
        timezone: 'America/New_York',
        primaryGoal: 'Optimize healthspan',
        createdAt: new Date().toISOString(),
      });
    }
  }, [profile]);

  const chronologicalAge = getChronologicalAge() || demoScores.chronologicalAge;

  const groupedItems = {
    morning: demoProtocolItems.filter((i) => i.timeOfDay === 'morning'),
    afternoon: demoProtocolItems.filter((i) => i.timeOfDay === 'afternoon'),
    evening: demoProtocolItems.filter((i) => i.timeOfDay === 'evening'),
    anytime: demoProtocolItems.filter((i) => i.timeOfDay === 'anytime'),
  };

  const handleLogProtocol = (itemId: string) => {
    setCompletedProtocols((prev) => new Set([...prev, itemId]));
  };

  const handleStartFast = (targetHours?: number) => {
    setFastingState({
      isActive: true,
      elapsedHours: 0,
      targetHours: targetHours || 16,
    });
    // Simulate elapsed time
    const interval = setInterval(() => {
      setFastingState((prev) => ({
        ...prev,
        elapsedHours: prev.elapsedHours + 0.1,
      }));
    }, 1000);
    // Store interval for cleanup
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

  const completionPercent = Math.round((completedProtocols.size / demoProtocolItems.length) * 100);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s your health overview for today.
        </p>
      </div>

      {/* Top Row: Health Score & Biological Age */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HealthScoreCard
          overallScore={demoScores.overallScore}
          biologicalAge={demoScores.biologicalAge}
          chronologicalAge={chronologicalAge}
          trend={demoScores.trend}
          lastUpdated={new Date()}
        />
        <BiologicalAgeDisplay
          biologicalAge={demoScores.biologicalAge}
          chronologicalAge={chronologicalAge}
          sleepScore={demoScores.sleepScore}
          activityScore={demoScores.activityScore}
          recoveryScore={demoScores.recoveryScore}
          nutritionScore={demoScores.nutritionScore}
        />
      </div>

      {/* Metric Cards */}
      <MetricGrid>
        <MetricCard
          title="Sleep"
          value={demoMetrics.sleep.value}
          unit={demoMetrics.sleep.unit}
          change={demoMetrics.sleep.change}
          status={demoMetrics.sleep.status}
          icon={Moon}
          sparklineData={demoMetrics.sleep.sparkline}
          optimalRange={[7, 9]}
        />
        <MetricCard
          title="HRV"
          value={demoMetrics.hrv.value}
          unit={demoMetrics.hrv.unit}
          change={demoMetrics.hrv.change}
          status={demoMetrics.hrv.status}
          icon={Heart}
          sparklineData={demoMetrics.hrv.sparkline}
        />
        <MetricCard
          title="Steps"
          value={demoMetrics.steps.value}
          unit={demoMetrics.steps.unit}
          change={demoMetrics.steps.change}
          status={demoMetrics.steps.status}
          icon={Activity}
          sparklineData={demoMetrics.steps.sparkline}
          optimalRange={[10000, 15000]}
        />
        <MetricCard
          title="Resting HR"
          value={demoMetrics.rhr.value}
          unit={demoMetrics.rhr.unit}
          change={demoMetrics.rhr.change}
          status={demoMetrics.rhr.status}
          icon={Zap}
          sparklineData={demoMetrics.rhr.sparkline}
          optimalRange={[50, 60]}
        />
      </MetricGrid>

      {/* Middle Row: Fasting Timer & Protocol */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FastingTimer
          isActive={fastingState.isActive}
          elapsedHours={fastingState.elapsedHours}
          targetHours={fastingState.targetHours}
          progressPercent={(fastingState.elapsedHours / fastingState.targetHours) * 100}
          metabolicState={
            fastingState.elapsedHours < 4 ? 'fed' :
            fastingState.elapsedHours < 12 ? 'early_fasting' :
            fastingState.elapsedHours < 16 ? 'fat_burning' :
            'ketosis'
          }
          onStart={handleStartFast}
          onEnd={handleEndFast}
        />
        <div className="lg:col-span-2">
          <ProtocolChecklist
            items={demoProtocolItems}
            completedIds={completedProtocols}
            groupedItems={groupedItems}
            completionPercent={completionPercent}
            streak={12}
            onLogItem={handleLogProtocol}
          />
        </div>
      </div>

      {/* Trends Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Health Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overall" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="sleep">Sleep</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="recovery">Recovery</TabsTrigger>
            </TabsList>
            <TabsContent value="overall" className="mt-4">
              <TrendChart
                data={demoTrendData}
                type="area"
                color="#3b82f6"
                height={250}
              />
            </TabsContent>
            <TabsContent value="sleep" className="mt-4">
              <TrendChart
                data={demoTrendData.map(d => ({ ...d, value: 60 + Math.random() * 30 }))}
                type="area"
                color="#8b5cf6"
                height={250}
              />
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <TrendChart
                data={demoTrendData.map(d => ({ ...d, value: 50 + Math.random() * 40 }))}
                type="area"
                color="#f59e0b"
                height={250}
              />
            </TabsContent>
            <TabsContent value="recovery" className="mt-4">
              <TrendChart
                data={demoTrendData.map(d => ({ ...d, value: 65 + Math.random() * 25 }))}
                type="area"
                color="#22c55e"
                height={250}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Insights Teaser */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="p-3 rounded-full bg-primary/10">
            <Brain className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">AI-Powered Insights</h3>
            <p className="text-muted-foreground">
              Based on your recent data, focusing on improving your deep sleep could reduce your biological age by 0.5 years.
            </p>
          </div>
          <button className="text-primary font-medium hover:underline">
            View All Insights →
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-64 mt-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[300px]" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px]" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[350px]" />
        <Skeleton className="h-[350px] lg:col-span-2" />
      </div>
    </div>
  );
}
