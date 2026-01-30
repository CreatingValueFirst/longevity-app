// Fasting timer hooks

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fastingApi } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import { useSettingsStore } from '@/stores/userStore';
import { getMetabolicState, getMetabolicStateInfo } from '@/lib/calculations';

export function useFasting() {
  const profile = useUserStore((state) => state.profile);
  const fastingDefaults = useSettingsStore((state) => state.fastingDefaults);
  const queryClient = useQueryClient();

  const [elapsedHours, setElapsedHours] = useState(0);

  // Get current fast status
  const { data: currentFast, isLoading } = useQuery({
    queryKey: ['fasting', profile?.id],
    queryFn: () => fastingApi.getCurrentFast(profile!.id),
    enabled: !!profile?.id,
    refetchInterval: 1000 * 60, // Refetch every minute
  });

  // Calculate elapsed time
  useEffect(() => {
    if (!currentFast?.isActive || !currentFast.fast) return;

    const fast = currentFast.fast as { started_at: string };
    const startTime = new Date(fast.started_at).getTime();

    const updateElapsed = () => {
      const now = Date.now();
      const hours = (now - startTime) / (1000 * 60 * 60);
      setElapsedHours(hours);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000); // Update every second

    return () => clearInterval(interval);
  }, [currentFast]);

  // Start fast mutation
  const startFastMutation = useMutation({
    mutationFn: (targetHours?: number) =>
      fastingApi.startFast({
        userId: profile!.id,
        targetHours: targetHours ?? fastingDefaults.targetHours,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasting'] });
    },
  });

  // End fast mutation
  const endFastMutation = useMutation({
    mutationFn: (data: { fastId: string; notes?: string }) =>
      fastingApi.endFast({
        userId: profile!.id,
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fasting'] });
      setElapsedHours(0);
    },
  });

  // Get current metabolic state
  const metabolicState = getMetabolicState(elapsedHours);
  const metabolicStateInfo = getMetabolicStateInfo(metabolicState);

  // Calculate progress percentage
  const targetHours = (currentFast?.fast as { target_hours?: number })?.target_hours ?? fastingDefaults.targetHours;
  const progressPercent = Math.min(100, (elapsedHours / targetHours) * 100);

  const startFast = useCallback(
    (targetHours?: number) => startFastMutation.mutate(targetHours),
    [startFastMutation]
  );

  const endFast = useCallback(
    (notes?: string) => {
      const fast = currentFast?.fast as { id: string } | undefined;
      if (fast?.id) {
        endFastMutation.mutate({ fastId: fast.id, notes });
      }
    },
    [endFastMutation, currentFast]
  );

  return {
    // State
    isLoading,
    isActive: currentFast?.isActive ?? false,
    elapsedHours,
    targetHours,
    progressPercent,
    metabolicState,
    metabolicStateInfo,

    // Actions
    startFast,
    endFast,
    isStarting: startFastMutation.isPending,
    isEnding: endFastMutation.isPending,
  };
}
