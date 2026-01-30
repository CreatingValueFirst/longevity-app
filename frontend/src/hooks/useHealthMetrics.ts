// Health metrics hooks with React Query

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthApi } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';

export function useCurrentScores() {
  const profile = useUserStore((state) => state.profile);

  return useQuery({
    queryKey: ['health-scores', profile?.id],
    queryFn: () => healthApi.getCurrentScores(profile!.id),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
  });
}

export function useHealthMetrics(params?: { startDate?: string; endDate?: string; source?: string }) {
  const profile = useUserStore((state) => state.profile);

  return useQuery({
    queryKey: ['health-metrics', profile?.id, params],
    queryFn: () =>
      healthApi.getMetrics({
        userId: profile!.id,
        ...params,
      }),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useRecordMetrics() {
  const queryClient = useQueryClient();
  const profile = useUserStore((state) => state.profile);

  return useMutation({
    mutationFn: (data: {
      date: string;
      source: string;
      metrics: Record<string, number | null>;
    }) =>
      healthApi.recordMetrics({
        userId: profile!.id,
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['health-scores'] });
      queryClient.invalidateQueries({ queryKey: ['health-metrics'] });
    },
  });
}

// Hook for getting historical data for charts
export function useMetricHistory(days: number = 30) {
  const profile = useUserStore((state) => state.profile);

  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];

  return useQuery({
    queryKey: ['metric-history', profile?.id, days],
    queryFn: () =>
      healthApi.getMetrics({
        userId: profile!.id,
        startDate,
        endDate,
      }),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 10,
    select: (data) => {
      // Transform data for charts
      const metrics = data.metrics as Array<{
        date: string;
        sleep_score?: number;
        activity_score?: number;
        recovery_score?: number;
        hrv_avg?: number;
        steps?: number;
        sleep_duration_minutes?: number;
      }>;

      return {
        dates: metrics.map((m) => m.date),
        sleepScores: metrics.map((m) => m.sleep_score ?? null),
        activityScores: metrics.map((m) => m.activity_score ?? null),
        recoveryScores: metrics.map((m) => m.recovery_score ?? null),
        hrvValues: metrics.map((m) => m.hrv_avg ?? null),
        steps: metrics.map((m) => m.steps ?? null),
        sleepDuration: metrics.map((m) =>
          m.sleep_duration_minutes ? m.sleep_duration_minutes / 60 : null
        ),
      };
    },
  });
}
