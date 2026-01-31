'use client';

import { useState, useMemo } from 'react';
import {
  ClipboardList,
  Plus,
  Flame,
  Settings,
  Check,
  Pill,
  Dumbbell,
  Apple,
  Moon,
  Brain,
  Thermometer,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ProtocolChecklist, StreakCounter } from '@/components/tracking/ProtocolChecklist';
import { DEFAULT_PROTOCOL_TEMPLATES, PROTOCOL_CATEGORIES, type ProtocolItem } from '@/types/protocols';
import { cn } from '@/lib/utils';
import { useProtocol, useProtocolHistory } from '@/hooks/useProtocol';

const categoryIcons = {
  supplement: Pill,
  exercise: Dumbbell,
  nutrition: Apple,
  sleep: Moon,
  mindfulness: Brain,
  therapy: Thermometer,
};

export default function ProtocolsPage() {
  const [activeTab, setActiveTab] = useState('today');

  // Use the protocol hook for state management
  const {
    items,
    groupedItems,
    completedIds,
    streaks,
    totalItems,
    completedCount,
    completionPercent,
    isLoading,
    isLogging,
    logItem,
  } = useProtocol();

  // Use history hook for adherence calculation
  const { thirtyDayAdherence } = useProtocolHistory();

  // Format streaks for the StreakCounter component
  const formattedStreaks = useMemo(() => ({
    protocol: { current: streaks.protocol?.current || 0, longest: streaks.protocol?.longest || 0 },
    fasting: { current: streaks.fasting?.current || 0, longest: streaks.fasting?.longest || 0 },
    exercise: { current: streaks.exercise?.current || 0, longest: streaks.exercise?.longest || 0 },
  }), [streaks]);

  // Group items by category for the "All Items" view
  const itemsByCategory = useMemo(() => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, ProtocolItem[]>);
  }, [items]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-primary" />
            Protocols
          </h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ClipboardList className="h-8 w-8 text-primary" />
            Protocols
          </h1>
          <p className="text-muted-foreground">
            Manage your daily longevity protocol and track adherence.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Edit Protocol
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Today&apos;s Progress</span>
              <span className="text-2xl font-bold">{completionPercent}%</span>
            </div>
            <Progress value={completionPercent} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {completedCount} of {totalItems} items completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-orange-500/10">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formattedStreaks.protocol.current} days</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Personal best: {formattedStreaks.protocol.longest} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-green-500/10">
                <Check className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{thirtyDayAdherence}%</p>
                <p className="text-sm text-muted-foreground">30-Day Adherence</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Based on completed items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="today">Today&apos;s Checklist</TabsTrigger>
          <TabsTrigger value="all">All Items</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProtocolChecklist
                items={items}
                completedIds={completedIds}
                groupedItems={groupedItems}
                completionPercent={completionPercent}
                streak={formattedStreaks.protocol.current}
                onLogItem={logItem}
                isLogging={isLogging}
              />
            </div>
            <div>
              <StreakCounter streaks={formattedStreaks} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(itemsByCategory).map(([category, categoryItems]) => {
              const categoryInfo = PROTOCOL_CATEGORIES[category as keyof typeof PROTOCOL_CATEGORIES];
              const Icon = categoryIcons[category as keyof typeof categoryIcons];

              return (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg capitalize">
                      <div className={cn('p-2 rounded-lg', categoryInfo.bg)}>
                        <Icon className={cn('h-4 w-4', categoryInfo.color)} />
                      </div>
                      {category}
                    </CardTitle>
                    <CardDescription>{categoryItems.length} items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categoryItems.map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "flex items-center justify-between p-2 rounded-lg bg-muted/50",
                            completedIds.has(item.id) && "bg-green-500/10"
                          )}
                        >
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "font-medium truncate text-sm",
                              completedIds.has(item.id) && "line-through text-muted-foreground"
                            )}>{item.name}</p>
                            {item.dosage && (
                              <p className="text-xs text-muted-foreground">{item.dosage}</p>
                            )}
                          </div>
                          <Badge variant="outline" className="ml-2 text-xs capitalize">
                            {item.timeOfDay}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEFAULT_PROTOCOL_TEMPLATES.map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>
                    {template.items?.length} protocol items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {template.items?.slice(0, 5).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className={cn(
                          'w-2 h-2 rounded-full',
                          PROTOCOL_CATEGORIES[item.category as keyof typeof PROTOCOL_CATEGORIES]?.bg.replace('bg-', 'bg-').replace('/10', '')
                        )} />
                        <span className="truncate">{item.name}</span>
                      </div>
                    ))}
                    {template.items && template.items.length > 5 && (
                      <p className="text-xs text-muted-foreground">
                        +{template.items.length - 5} more items
                      </p>
                    )}
                  </div>
                  <Button variant="outline" className="w-full">
                    Use This Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Evidence-Based Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Why These Protocols Matter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                category: 'Supplements',
                items: [
                  'Vitamin D3: Target 50-80 ng/mL for optimal immune function',
                  'Omega-3: 2-4g/day reduces inflammation (hs-CRP)',
                  'Creatine: 5g/day supports muscle and cognitive health',
                  'Magnesium: Involved in 300+ enzymatic reactions',
                ],
              },
              {
                category: 'Exercise',
                items: [
                  'Zone 2: 3-4 hours/week for mitochondrial health',
                  'VO2 max: #1 predictor of all-cause mortality',
                  'Strength: Preserves muscle mass with aging',
                  'Stability: Foundation for injury prevention',
                ],
              },
              {
                category: 'Sleep',
                items: [
                  '7-9 hours: Associated with lowest mortality risk',
                  'Morning light: Resets circadian rhythm',
                  'Consistent schedule: Improves sleep quality',
                  'Cool temperature: Facilitates deep sleep',
                ],
              },
              {
                category: 'Nutrition',
                items: [
                  'Time-restricted eating: Triggers autophagy',
                  'Protein: 1.6-2.2g/kg for muscle synthesis',
                  'Leucine threshold: 2.5-3g per meal',
                  'Mediterranean diet: Strongest longevity evidence',
                ],
              },
            ].map((section) => (
              <div key={section.category}>
                <h4 className="font-semibold mb-2">{section.category}</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
