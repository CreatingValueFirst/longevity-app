'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  CheckCircle2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import type { RecommendationItem } from '@/types/protocols';

// Demo AI recommendations
const aiRecommendations: RecommendationItem[] = [
  {
    id: '1',
    category: 'sleep',
    priority: 'high',
    title: 'Increase Deep Sleep Duration',
    description: 'Your deep sleep has averaged 1.3 hours over the past week, which is below the optimal 1.5-2 hour range. Deep sleep is crucial for physical recovery and growth hormone release.',
    actionItems: [
      'Avoid alcohol within 4 hours of bedtime',
      'Keep bedroom temperature at 18°C (65°F)',
      'Consider magnesium glycinate 30 min before bed',
      'Finish eating 3+ hours before sleep',
    ],
    evidenceLevel: 'strong',
    expectedImpact: 'Could improve biological age by 0.3-0.5 years',
  },
  {
    id: '2',
    category: 'exercise',
    priority: 'medium',
    title: 'Add VO2 Max Training',
    description: 'Your current exercise routine lacks high-intensity cardio. VO2 max is the single strongest predictor of all-cause mortality.',
    actionItems: [
      'Add 1x weekly 4x4 intervals (4 min @ 90% max HR)',
      'Start with 3 rounds, progress to 5-6 over 8 weeks',
      'Ensure 4 min active recovery between intervals',
    ],
    evidenceLevel: 'strong',
    expectedImpact: 'Each 1 MET increase = 12% reduction in mortality',
  },
  {
    id: '3',
    category: 'supplement',
    priority: 'medium',
    title: 'Optimize Vitamin D Levels',
    description: 'Based on typical indoor lifestyles and your location, you may benefit from vitamin D supplementation to reach optimal levels (50-80 ng/mL).',
    actionItems: [
      'Test current 25(OH)D levels',
      'Consider 4,000-6,000 IU D3 daily with fat',
      'Retest after 3 months',
      'Pair with K2 (MK-7) for calcium metabolism',
    ],
    evidenceLevel: 'strong',
    expectedImpact: 'Supports immune function, bone health, mood',
  },
  {
    id: '4',
    category: 'nutrition',
    priority: 'low',
    title: 'Extend Fasting Window',
    description: 'Your average fasting window is 14 hours. Extending to 16+ hours more consistently would maximize autophagy benefits.',
    actionItems: [
      'Push first meal 2 hours later',
      'Use black coffee/tea to manage hunger',
      'Stay consistent on weekends',
    ],
    evidenceLevel: 'moderate',
    expectedImpact: 'Enhanced autophagy and insulin sensitivity',
  },
];

const insights = [
  {
    type: 'positive',
    title: 'Sleep consistency improved',
    description: 'Your bedtime variance decreased by 45 minutes this week',
    icon: TrendingUp,
    color: 'text-green-500',
  },
  {
    type: 'positive',
    title: 'Protocol adherence streak',
    description: '12 days in a row with 80%+ completion',
    icon: CheckCircle2,
    color: 'text-green-500',
  },
  {
    type: 'negative',
    title: 'HRV trending down',
    description: 'Your 7-day average HRV dropped 8% - consider recovery focus',
    icon: TrendingDown,
    color: 'text-amber-500',
  },
  {
    type: 'neutral',
    title: 'Activity goal progress',
    description: 'You\'re at 85% of your weekly exercise goal',
    icon: Target,
    color: 'text-blue-500',
  },
];

const priorityColors = {
  high: 'bg-red-500/10 text-red-500 border-red-500/50',
  medium: 'bg-amber-500/10 text-amber-500 border-amber-500/50',
  low: 'bg-blue-500/10 text-blue-500 border-blue-500/50',
};

const categoryColors = {
  sleep: 'bg-indigo-500',
  exercise: 'bg-orange-500',
  nutrition: 'bg-green-500',
  supplement: 'bg-purple-500',
  lifestyle: 'bg-pink-500',
  biomarker: 'bg-cyan-500',
};

export default function InsightsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            Insights
          </h1>
          <p className="text-muted-foreground">
            AI-powered analysis and personalized recommendations.
          </p>
        </div>
        <Button onClick={handleRefresh} disabled={isRefreshing}>
          <RefreshCw className={cn('h-4 w-4 mr-2', isRefreshing && 'animate-spin')} />
          {isRefreshing ? 'Analyzing...' : 'Refresh Analysis'}
        </Button>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <insight.icon className={cn('h-5 w-5 mt-0.5', insight.color)} />
                <div>
                  <p className="font-medium text-sm">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            AI Recommendations
          </CardTitle>
          <CardDescription>
            Personalized suggestions based on your health data and latest research.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="high">High Priority</TabsTrigger>
              <TabsTrigger value="sleep">Sleep</TabsTrigger>
              <TabsTrigger value="exercise">Exercise</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-4">
                {aiRecommendations.map((rec) => (
                  <RecommendationCard key={rec.id} recommendation={rec} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="high" className="mt-6">
              <div className="space-y-4">
                {aiRecommendations
                  .filter((r) => r.priority === 'high')
                  .map((rec) => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="sleep" className="mt-6">
              <div className="space-y-4">
                {aiRecommendations
                  .filter((r) => r.category === 'sleep')
                  .map((rec) => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="exercise" className="mt-6">
              <div className="space-y-4">
                {aiRecommendations
                  .filter((r) => r.category === 'exercise')
                  .map((rec) => (
                    <RecommendationCard key={rec.id} recommendation={rec} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Health Score Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Score Breakdown & Improvement Areas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { name: 'Sleep Score', score: 82, potential: 95, tip: 'Improve deep sleep consistency' },
              { name: 'Activity Score', score: 75, potential: 90, tip: 'Add VO2 max training' },
              { name: 'Recovery Score', score: 80, potential: 88, tip: 'Reduce evening alcohol' },
              { name: 'Nutrition Score', score: 72, potential: 85, tip: 'Increase protein timing' },
              { name: 'Protocol Adherence', score: 87, potential: 95, tip: 'Morning routine consistency' },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{item.score}</span>
                    <span className="text-muted-foreground text-sm">/ {item.potential} potential</span>
                  </div>
                </div>
                <div className="relative">
                  <Progress value={item.score} className="h-3" />
                  <div
                    className="absolute top-0 h-3 w-1 bg-green-500 rounded"
                    style={{ left: `${item.potential}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Lightbulb className="h-3 w-3" />
                  {item.tip}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: RecommendationItem }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToProtocol = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card collapse
    setIsAdding(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsAdding(false);
    toast.success(`"${recommendation.title}" added to your protocol!`);
    router.push('/dashboard/protocols');
  };

  return (
    <div
      className={cn(
        'border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md',
        isExpanded && 'ring-2 ring-primary'
      )}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-start gap-4">
        <div className={cn('w-2 h-full min-h-[60px] rounded-full', categoryColors[recommendation.category])} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={priorityColors[recommendation.priority]}>
                {recommendation.priority} priority
              </Badge>
              <Badge variant="outline" className="capitalize">
                {recommendation.category}
              </Badge>
            </div>
            <Badge variant="secondary" className="text-xs">
              {recommendation.evidenceLevel} evidence
            </Badge>
          </div>

          <h3 className="font-semibold text-lg">{recommendation.title}</h3>
          <p className="text-muted-foreground mt-1">{recommendation.description}</p>

          {isExpanded && (
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Action Items:</h4>
                <ul className="space-y-2">
                  {recommendation.actionItems.map((item, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {recommendation.expectedImpact && (
                <div className="p-3 rounded-lg bg-green-500/10 text-green-700 dark:text-green-400 text-sm">
                  <strong>Expected Impact:</strong> {recommendation.expectedImpact}
                </div>
              )}

              <Button
                size="sm"
                className="w-full"
                onClick={handleAddToProtocol}
                disabled={isAdding}
              >
                {isAdding ? 'Adding...' : 'Add to Protocol'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
