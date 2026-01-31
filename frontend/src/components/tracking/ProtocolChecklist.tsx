'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Circle,
  Pill,
  Dumbbell,
  Apple,
  Moon,
  Brain,
  Thermometer,
  ChevronDown,
  Flame,
  LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ProtocolItem } from '@/types/protocols';
import { PROTOCOL_CATEGORIES } from '@/types/protocols';

interface ProtocolChecklistProps {
  items: ProtocolItem[];
  completedIds: Set<string>;
  groupedItems: {
    morning: ProtocolItem[];
    afternoon: ProtocolItem[];
    evening: ProtocolItem[];
    anytime: ProtocolItem[];
  };
  completionPercent: number;
  streak?: number;
  onLogItem: (itemId: string, notes?: string) => void;
  isLogging?: boolean;
  className?: string;
}

const categoryIcons: Record<string, LucideIcon> = {
  supplement: Pill,
  exercise: Dumbbell,
  nutrition: Apple,
  sleep: Moon,
  mindfulness: Brain,
  therapy: Thermometer,
};

const timeOfDayLabels = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  anytime: 'Anytime',
};

export function ProtocolChecklist({
  groupedItems,
  completedIds,
  completionPercent,
  streak = 0,
  onLogItem,
  isLogging,
  className,
}: ProtocolChecklistProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['morning', 'afternoon', 'evening', 'anytime'])
  );

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleItemClick = (item: ProtocolItem) => {
    if (!completedIds.has(item.id) && !isLogging) {
      onLogItem(item.id);
    }
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            Today&apos;s Protocol
          </CardTitle>
          {streak > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Flame className="h-3 w-3 text-orange-500" />
              {streak} day streak
            </Badge>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completionPercent}%</span>
          </div>
          <Progress value={completionPercent} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([timeOfDay, items]) => {
            if (items.length === 0) return null;

            const isExpanded = expandedSections.has(timeOfDay);
            const completedCount = items.filter((i) => completedIds.has(i.id)).length;

            return (
              <div key={timeOfDay}>
                <button
                  onClick={() => toggleSection(timeOfDay)}
                  className="flex items-center justify-between w-full py-3 sm:py-2 hover:bg-muted/50 active:bg-muted/70 rounded-lg px-2 transition-colors touch-manipulation min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        !isExpanded && '-rotate-90'
                      )}
                    />
                    <span className="font-medium">
                      {timeOfDayLabels[timeOfDay as keyof typeof timeOfDayLabels]}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {completedCount}/{items.length}
                    </Badge>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-1 pt-1">
                        {items.map((item) => (
                          <ProtocolItemRow
                            key={item.id}
                            item={item}
                            isCompleted={completedIds.has(item.id)}
                            onClick={() => handleItemClick(item)}
                            disabled={isLogging}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Separator className="mt-3" />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

interface ProtocolItemRowProps {
  item: ProtocolItem;
  isCompleted: boolean;
  onClick: () => void;
  disabled?: boolean;
}

function ProtocolItemRow({ item, isCompleted, onClick, disabled }: ProtocolItemRowProps) {
  const category = PROTOCOL_CATEGORIES[item.category];
  const Icon = categoryIcons[item.category] || Circle;

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isCompleted}
      className={cn(
        'flex items-center gap-3 w-full p-3 sm:p-3 rounded-lg transition-all text-left touch-manipulation min-h-[52px]',
        isCompleted
          ? 'bg-green-500/10 hover:bg-green-500/15 active:bg-green-500/20'
          : 'hover:bg-muted/50 active:bg-muted/70',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
      whileTap={{ scale: 0.98 }}
    >
      {/* Checkbox - larger for touch */}
      <div
        className={cn(
          'h-7 w-7 sm:h-6 sm:w-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0',
          isCompleted
            ? 'bg-green-500 border-green-500'
            : 'border-muted-foreground/30 hover:border-primary'
        )}
      >
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Check className="h-4 w-4 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Icon */}
      <div className={cn('p-1.5 rounded-md flex-shrink-0', category.bg)}>
        <Icon className={cn('h-4 w-4', category.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'font-medium text-sm sm:text-base truncate',
            isCompleted && 'line-through text-muted-foreground'
          )}
        >
          {item.name}
        </p>
        {item.dosage && (
          <p className="text-xs text-muted-foreground">{item.dosage}</p>
        )}
      </div>

      {/* Category badge - hidden on mobile */}
      <Badge variant="outline" className="text-xs capitalize hidden md:flex flex-shrink-0">
        {item.category}
      </Badge>
    </motion.button>
  );
}

// Streak counter component
interface StreakCounterProps {
  streaks: Record<string, { current: number; longest: number }>;
  className?: string;
}

export function StreakCounter({ streaks, className }: StreakCounterProps) {
  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Streaks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(streaks).map(([type, data]) => (
            <div key={type} className="text-center">
              <p className="text-3xl font-bold">{data.current}</p>
              <p className="text-sm text-muted-foreground capitalize">{type}</p>
              <p className="text-xs text-muted-foreground">
                Best: {data.longest}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
