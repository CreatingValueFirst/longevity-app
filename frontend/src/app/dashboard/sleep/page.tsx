'use client';

import { Moon, Clock, Zap, TrendingUp, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricCard, MetricGrid } from '@/components/dashboard/MetricCard';
import { ProgressRing } from '@/components/charts/ProgressRing';
import { TrendChart } from '@/components/charts/TrendChart';
import { cn } from '@/lib/utils';

// Demo data
const sleepData = {
  lastNight: {
    duration: 7.5,
    score: 85,
    deepSleep: 1.8,
    remSleep: 1.6,
    lightSleep: 3.5,
    awake: 0.6,
    efficiency: 92,
    bedtime: '22:30',
    wakeTime: '06:15',
    latency: 12,
  },
  averages: {
    duration: 7.2,
    score: 78,
    deepSleep: 1.5,
    remSleep: 1.4,
  },
  goals: {
    duration: [7, 9],
    deepSleep: [1.5, 2],
    remSleep: [1.5, 2],
    efficiency: 85,
  },
};

const trendData = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    date: date.toISOString().split('T')[0],
    value: 70 + Math.random() * 25,
    duration: 6 + Math.random() * 2.5,
  };
});

const sleepStages = [
  { name: 'Deep Sleep', value: sleepData.lastNight.deepSleep, target: '1.5-2h', color: 'bg-indigo-500', percent: (sleepData.lastNight.deepSleep / sleepData.lastNight.duration) * 100 },
  { name: 'REM Sleep', value: sleepData.lastNight.remSleep, target: '1.5-2h', color: 'bg-purple-500', percent: (sleepData.lastNight.remSleep / sleepData.lastNight.duration) * 100 },
  { name: 'Light Sleep', value: sleepData.lastNight.lightSleep, target: '3-4h', color: 'bg-blue-400', percent: (sleepData.lastNight.lightSleep / sleepData.lastNight.duration) * 100 },
  { name: 'Awake', value: sleepData.lastNight.awake, target: '<0.5h', color: 'bg-gray-400', percent: (sleepData.lastNight.awake / sleepData.lastNight.duration) * 100 },
];

export default function SleepPage() {
  const scoreStatus = sleepData.lastNight.score >= 80 ? 'optimal' : sleepData.lastNight.score >= 60 ? 'moderate' : 'attention';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Moon className="h-8 w-8 text-indigo-500" />
          Sleep
        </h1>
        <p className="text-muted-foreground">
          Track and optimize your sleep for better recovery and longevity.
        </p>
      </div>

      {/* Last Night Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sleep Score Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Last Night</CardTitle>
            <CardDescription>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <ProgressRing
                value={sleepData.lastNight.score}
                max={100}
                size={140}
                strokeWidth={10}
                color={
                  scoreStatus === 'optimal' ? 'stroke-green-500' :
                  scoreStatus === 'moderate' ? 'stroke-amber-500' :
                  'stroke-red-500'
                }
              >
                <div className="text-center">
                  <span className="text-3xl font-bold">{sleepData.lastNight.score}</span>
                  <p className="text-sm text-muted-foreground">Score</p>
                </div>
              </ProgressRing>

              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="font-medium">{sleepData.lastNight.bedtime}</p>
                  <p className="text-muted-foreground">Bedtime</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="font-medium">{sleepData.lastNight.duration}h</p>
                  <p className="text-muted-foreground">Duration</p>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="text-center">
                  <p className="font-medium">{sleepData.lastNight.wakeTime}</p>
                  <p className="text-muted-foreground">Wake</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Stages */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Sleep Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Stage Bar */}
              <div className="flex h-8 rounded-full overflow-hidden">
                {sleepStages.map((stage) => (
                  <div
                    key={stage.name}
                    className={cn('transition-all', stage.color)}
                    style={{ width: `${stage.percent}%` }}
                  />
                ))}
              </div>

              {/* Stage Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {sleepStages.map((stage) => (
                  <div key={stage.name} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-3 h-3 rounded-full', stage.color)} />
                      <span className="text-sm font-medium">{stage.name}</span>
                    </div>
                    <p className="text-2xl font-bold">{stage.value.toFixed(1)}h</p>
                    <p className="text-xs text-muted-foreground">Target: {stage.target}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Metrics */}
      <MetricGrid>
        <MetricCard
          title="Sleep Duration"
          value={sleepData.lastNight.duration}
          unit="hours"
          change={((sleepData.lastNight.duration - sleepData.averages.duration) / sleepData.averages.duration) * 100}
          status={sleepData.lastNight.duration >= 7 && sleepData.lastNight.duration <= 9 ? 'optimal' : 'moderate'}
          icon={Clock}
          optimalRange={[7, 9]}
        />
        <MetricCard
          title="Deep Sleep"
          value={sleepData.lastNight.deepSleep}
          unit="hours"
          change={((sleepData.lastNight.deepSleep - sleepData.averages.deepSleep) / sleepData.averages.deepSleep) * 100}
          status={sleepData.lastNight.deepSleep >= 1.5 ? 'optimal' : 'moderate'}
          icon={Moon}
          optimalRange={[1.5, 2]}
        />
        <MetricCard
          title="Sleep Efficiency"
          value={sleepData.lastNight.efficiency}
          unit="%"
          status={sleepData.lastNight.efficiency >= 85 ? 'optimal' : 'moderate'}
          icon={Zap}
          optimalRange={[85, 100]}
        />
        <MetricCard
          title="Sleep Latency"
          value={sleepData.lastNight.latency}
          unit="min"
          status={sleepData.lastNight.latency <= 20 ? 'optimal' : 'moderate'}
          icon={Clock}
          optimalRange={[5, 20]}
        />
      </MetricGrid>

      {/* Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sleep Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="score">
            <TabsList>
              <TabsTrigger value="score">Score</TabsTrigger>
              <TabsTrigger value="duration">Duration</TabsTrigger>
            </TabsList>
            <TabsContent value="score" className="mt-4">
              <TrendChart data={trendData} type="area" color="#6366f1" height={250} />
            </TabsContent>
            <TabsContent value="duration" className="mt-4">
              <TrendChart
                data={trendData.map(d => ({ ...d, value: d.duration }))}
                type="area"
                color="#8b5cf6"
                height={250}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sleep Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Sleep Optimization Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Consistent Schedule', desc: 'Go to bed and wake up at the same time daily (±30 min)' },
              { title: 'Morning Light', desc: 'Get 10-30 minutes of sunlight within 1 hour of waking' },
              { title: 'Cool Environment', desc: 'Keep bedroom at 16-19°C (60-67°F) for optimal sleep' },
              { title: 'No Late Eating', desc: 'Finish eating 3+ hours before bed for better sleep quality' },
              { title: 'Magnesium', desc: 'Consider 300-400mg magnesium glycinate before bed' },
              { title: 'Limit Caffeine', desc: 'Avoid caffeine after 2pm to protect sleep quality' },
            ].map((tip) => (
              <div key={tip.title} className="p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium">{tip.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{tip.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
