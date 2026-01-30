'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Clock, Flame, Zap, Sparkles, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProgressRing } from '@/components/charts/ProgressRing';
import { cn } from '@/lib/utils';
import { formatFastingTime } from '@/lib/calculations';
import { METABOLIC_STATES } from '@/types/health';

interface FastingTimerProps {
  isActive: boolean;
  elapsedHours: number;
  targetHours: number;
  progressPercent: number;
  metabolicState: keyof typeof METABOLIC_STATES;
  onStart: (targetHours?: number) => void;
  onEnd: (notes?: string) => void;
  isStarting?: boolean;
  isEnding?: boolean;
  className?: string;
}

const stateIcons = {
  fed: Clock,
  early_fasting: Timer,
  fat_burning: Flame,
  ketosis: Zap,
  deep_ketosis: Zap,
  autophagy: Sparkles,
};

export function FastingTimer({
  isActive,
  elapsedHours,
  targetHours,
  progressPercent,
  metabolicState,
  onStart,
  onEnd,
  isStarting,
  isEnding,
  className,
}: FastingTimerProps) {
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [customTarget, setCustomTarget] = useState(targetHours.toString());
  const [endNotes, setEndNotes] = useState('');

  const stateInfo = METABOLIC_STATES[metabolicState];
  const StateIcon = stateIcons[metabolicState];

  const handleStart = () => {
    const hours = parseFloat(customTarget) || targetHours;
    onStart(hours);
    setShowStartDialog(false);
  };

  const handleEnd = () => {
    onEnd(endNotes || undefined);
    setEndNotes('');
    setShowEndDialog(false);
  };

  // Get next metabolic state info
  const nextState = Object.entries(METABOLIC_STATES).find(
    ([, info]) => info.minHours > elapsedHours
  );

  return (
    <>
      <Card className={cn('touch-manipulation', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5 text-primary" />
              <span className="text-base sm:text-lg">Fasting Timer</span>
            </div>
            {isActive && (
              <Badge variant="secondary" className={cn(stateInfo.color, 'text-white text-xs sm:text-sm')}>
                {stateInfo.name}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4 sm:gap-6">
            {/* Progress Ring - Larger on mobile for better visibility */}
            <div className="w-full flex justify-center">
              <ProgressRing
                value={progressPercent}
                max={100}
                size={220}
                strokeWidth={14}
                color={isActive ? 'stroke-primary' : 'stroke-muted'}
                className="sm:w-[180px] sm:h-[180px]"
              >
                <div className="flex flex-col items-center">
                  <AnimatePresence mode="wait">
                    {isActive ? (
                      <motion.div
                        key="active"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center"
                      >
                        <span className="text-4xl sm:text-3xl font-bold tabular-nums">
                          {formatFastingTime(elapsedHours)}
                        </span>
                        <span className="text-sm sm:text-sm text-muted-foreground mt-1">
                          of {targetHours}h target
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="inactive"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="flex flex-col items-center text-muted-foreground px-4"
                      >
                        <span className="text-lg sm:text-lg font-medium">No active fast</span>
                        <span className="text-sm sm:text-sm">Tap to start</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </ProgressRing>
            </div>

            {/* Metabolic State Info */}
            {isActive && (
              <div className="w-full space-y-3 sm:space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <StateIcon className={cn('h-5 w-5 sm:h-5 sm:w-5', stateInfo.color.replace('bg-', 'text-'))} />
                  <span className="font-medium text-base sm:text-base">{stateInfo.name}</span>
                </div>

                {/* Progress to next state */}
                {nextState && (
                  <div className="text-center text-sm sm:text-sm text-muted-foreground">
                    <span>Next: {nextState[1].name} in </span>
                    <span className="font-medium tabular-nums">
                      {formatFastingTime(nextState[1].minHours - elapsedHours)}
                    </span>
                  </div>
                )}

                {/* State timeline - larger touch targets */}
                <div className="flex gap-1.5 sm:gap-1 px-2 sm:px-0">
                  {Object.entries(METABOLIC_STATES).slice(0, 5).map(([key, info]) => (
                    <div
                      key={key}
                      className={cn(
                        'flex-1 h-3 sm:h-2 rounded-full transition-colors',
                        elapsedHours >= info.minHours ? info.color : 'bg-muted'
                      )}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons - Full width on mobile */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              {isActive ? (
                <Button
                  variant="destructive"
                  className="w-full h-12 sm:h-10 text-base sm:text-sm font-medium touch-target"
                  onClick={() => setShowEndDialog(true)}
                  disabled={isEnding}
                >
                  <Square className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
                  {isEnding ? 'Ending...' : 'End Fast'}
                </Button>
              ) : (
                <Button
                  className="w-full h-12 sm:h-10 text-base sm:text-sm font-medium touch-target"
                  onClick={() => setShowStartDialog(true)}
                  disabled={isStarting}
                >
                  <Play className="h-5 w-5 sm:h-4 sm:w-4 mr-2" />
                  {isStarting ? 'Starting...' : 'Start Fast'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Start Dialog - Mobile optimized */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] mx-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-lg">Start Fasting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="target" className="text-base sm:text-sm">Target Hours</Label>
              <Input
                id="target"
                type="number"
                value={customTarget}
                onChange={(e) => setCustomTarget(e.target.value)}
                min={1}
                max={72}
                className="h-12 sm:h-10 text-base sm:text-sm"
                inputMode="numeric"
              />
            </div>
            {/* Quick select buttons - larger on mobile */}
            <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-2">
              {[16, 18, 20, 24].map((hours) => (
                <Button
                  key={hours}
                  variant={customTarget === hours.toString() ? 'default' : 'outline'}
                  size="lg"
                  className="h-12 sm:h-9 text-base sm:text-sm font-medium touch-target"
                  onClick={() => setCustomTarget(hours.toString())}
                >
                  {hours}h
                </Button>
              ))}
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowStartDialog(false)}
              className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStart}
              disabled={isStarting}
              className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm order-1 sm:order-2"
            >
              {isStarting ? 'Starting...' : 'Start Fast'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Dialog - Mobile optimized */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent className="sm:max-w-md max-w-[calc(100%-2rem)] mx-auto rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-lg">End Fast</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center py-2">
              <p className="text-3xl sm:text-2xl font-bold tabular-nums">{formatFastingTime(elapsedHours)}</p>
              <p className="text-base sm:text-sm text-muted-foreground mt-1">
                {progressPercent >= 100 ? 'Target reached!' : `${progressPercent.toFixed(0)}% of target`}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base sm:text-sm">Notes (optional)</Label>
              <Input
                id="notes"
                value={endNotes}
                onChange={(e) => setEndNotes(e.target.value)}
                placeholder="How did you feel?"
                className="h-12 sm:h-10 text-base sm:text-sm"
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEndDialog(false)}
              className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnd}
              disabled={isEnding}
              className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm order-1 sm:order-2"
            >
              {isEnding ? 'Ending...' : 'End Fast'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
