// Health metrics hooks with React Query and proper error handling

'use client';

import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { healthApi, type ApiHealthMetric, type ApiHealthScores } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import type { TrendDirection } from '@/types/health';
import { calculateTrend } from '@/lib/calculations';

// ============================================================================
// Types
// ============================================================================

// Re-export API types for convenience
export type { ApiHealthMetric, ApiHealthScores };

interface RecordMetricsData {
  date: string;
  source: string;
  metrics: Record<string, number | null>;
}

// Query keys for cache management
export const healthQueryKeys = {
  all: ['health'] as const,
  scores: (userId: string) => ['health-scores', userId] as const,
  metrics: (userId: string, params?: Record<string, string>) =>
    ['health-metrics', userId, params] as const,
  history: (userId: string, days: number) => ['metric-history', userId, days] as const,
};

// ============================================================================
// Current Scores Hook
// ============================================================================

export function useCurrentScores() {
  const profile = useUserStore((state) => state.profile);

  const query = useQuery({
    queryKey: healthQueryKeys.scores(profile?.id ?? ''),
    queryFn: () => healthApi.getCurrentScores(profile!.id),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 15, // Refetch every 15 minutes
  });

  // Transform data for easier consumption
  const scores = useMemo(() => {
    if (!query.data?.scores) return null;

    const s = query.data.scores;
    return {
      overallScore: s.overall_score,
      biologicalAge: s.biological_age,
      chronologicalAge: s.chronological_age,
      ageDifference: s.age_difference,
      sleepScore: s.sleep_score,
      activityScore: s.activity_score,
      recoveryScore: s.recovery_score,
      nutritionScore: s.nutrition_score ?? null,
      adherenceScore: s.adherence_score ?? null,
      trend: s.trend as TrendDirection,
    };
  }, [query.data?.scores]);

  return {
    ...query,
    scores,
    error: query.error?.message ?? null,
  };
}

// ============================================================================
// Health Metrics Hook
// ============================================================================

interface UseHealthMetricsParams {
  startDate?: string;
  endDate?: string;
  source?: string;
}

export function useHealthMetrics(params?: UseHealthMetricsParams) {
  const profile = useUserStore((state) => state.profile);

  const query = useQuery({
    queryKey: healthQueryKeys.metrics(profile?.id ?? '', params as Record<string, string>),
    queryFn: () =>
      healthApi.getMetrics({
        userId: profile!.id,
        ...params,
      }),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5,
  });

  // Transform metrics for easier consumption
  const metrics = useMemo(() => {
    if (!query.data?.metrics) return [];

    return query.data.metrics.map((m: ApiHealthMetric) => ({
      id: m.id,
      date: m.date,
      source: m.source,
      sleepScore: m.sleep_score ?? null,
      activityScore: m.activity_score ?? null,
      recoveryScore: m.recovery_score ?? null,
      hrvAvg: m.hrv_avg ?? null,
      steps: m.steps ?? null,
      sleepDurationMinutes: m.sleep_duration_minutes ?? null,
      restingHr: m.resting_hr ?? null,
      deepSleepMinutes: m.deep_sleep_minutes ?? null,
      remSleepMinutes: m.rem_sleep_minutes ?? null,
      activeCalories: m.active_calories ?? null,
    }));
  }, [query.data?.metrics]);

  return {
    ...query,
    metrics,
    error: query.error?.message ?? null,
  };
}

// ============================================================================
// Record Metrics Hook
// ============================================================================

export function useRecordMetrics() {
  const queryClient = useQueryClient();
  const profile = useUserStore((state) => state.profile);

  const mutation = useMutation({
    mutationFn: (data: RecordMetricsData) =>
      healthApi.recordMetrics({
        userId: profile!.id,
        ...data,
      }),
    onSuccess: () => {
      // Invalidate related queries
      if (profile?.id) {
        queryClient.invalidateQueries({ queryKey: healthQueryKeys.scores(profile.id) });
        queryClient.invalidateQueries({
          queryKey: ['health-metrics', profile.id],
        });
        queryClient.invalidateQueries({
          queryKey: ['metric-history', profile.id],
        });
      }
    },
  });

  return {
    recordMetrics: mutation.mutate,
    recordMetricsAsync: mutation.mutateAsync,
    isRecording: mutation.isPending,
    error: mutation.error?.message ?? null,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
}

// ============================================================================
// Metric History Hook (for charts)
// ============================================================================

interface ChartData {
  dates: string[];
  sleepScores: (number | null)[];
  activityScores: (number | null)[];
  recoveryScores: (number | null)[];
  hrvValues: (number | null)[];
  steps: (number | null)[];
  sleepDuration: (number | null)[]; // in hours
  restingHr: (number | null)[];
}

export function useMetricHistory(days: number = 30) {
  const profile = useUserStore((state) => state.profile);

  const endDate = useMemo(() => new Date().toISOString().split('T')[0], []);
  const startDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString().split('T')[0];
  }, [days]);

  const query = useQuery({
    queryKey: healthQueryKeys.history(profile?.id ?? '', days),
    queryFn: () =>
      healthApi.getMetrics({
        userId: profile!.id,
        startDate,
        endDate,
      }),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 10,
  });

  // Transform to chart data
  const chartData: ChartData | null = useMemo(() => {
    if (!query.data?.metrics) return null;

    const metrics = query.data.metrics;

    // Sort by date
    const sorted = [...metrics].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      dates: sorted.map((m) => m.date),
      sleepScores: sorted.map((m) => m.sleep_score ?? null),
      activityScores: sorted.map((m) => m.activity_score ?? null),
      recoveryScores: sorted.map((m) => m.recovery_score ?? null),
      hrvValues: sorted.map((m) => m.hrv_avg ?? null),
      steps: sorted.map((m) => m.steps ?? null),
      sleepDuration: sorted.map((m) =>
        m.sleep_duration_minutes ? m.sleep_duration_minutes / 60 : null
      ),
      restingHr: sorted.map((m) => m.resting_hr ?? null),
    };
  }, [query.data?.metrics]);

  // Calculate trends
  const trends = useMemo(() => {
    if (!chartData) {
      return {
        sleepTrend: 'stable' as TrendDirection,
        activityTrend: 'stable' as TrendDirection,
        recoveryTrend: 'stable' as TrendDirection,
        hrvTrend: 'stable' as TrendDirection,
      };
    }

    const nonNullNumbers = (arr: (number | null)[]) =>
      arr.filter((n): n is number => n !== null);

    return {
      sleepTrend: calculateTrend(nonNullNumbers(chartData.sleepScores)),
      activityTrend: calculateTrend(nonNullNumbers(chartData.activityScores)),
      recoveryTrend: calculateTrend(nonNullNumbers(chartData.recoveryScores)),
      hrvTrend: calculateTrend(nonNullNumbers(chartData.hrvValues)),
    };
  }, [chartData]);

  // Calculate averages
  const averages = useMemo(() => {
    if (!chartData) {
      return {
        avgSleepScore: null,
        avgActivityScore: null,
        avgRecoveryScore: null,
        avgHrv: null,
        avgSteps: null,
        avgSleepDuration: null,
      };
    }

    const calcAvg = (arr: (number | null)[]) => {
      const valid = arr.filter((n): n is number => n !== null);
      if (valid.length === 0) return null;
      return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
    };

    const calcAvgDecimal = (arr: (number | null)[]) => {
      const valid = arr.filter((n): n is number => n !== null);
      if (valid.length === 0) return null;
      return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
    };

    return {
      avgSleepScore: calcAvg(chartData.sleepScores),
      avgActivityScore: calcAvg(chartData.activityScores),
      avgRecoveryScore: calcAvg(chartData.recoveryScores),
      avgHrv: calcAvg(chartData.hrvValues),
      avgSteps: calcAvg(chartData.steps),
      avgSleepDuration: calcAvgDecimal(chartData.sleepDuration),
    };
  }, [chartData]);

  return {
    ...query,
    chartData,
    trends,
    averages,
    error: query.error?.message ?? null,
  };
}

// ============================================================================
// Latest Metrics Hook
// ============================================================================

export function useLatestMetrics() {
  const profile = useUserStore((state) => state.profile);

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const sevenDaysAgo = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  }, []);

  const query = useQuery({
    queryKey: healthQueryKeys.metrics(profile?.id ?? '', {
      startDate: sevenDaysAgo,
      endDate: today,
    }),
    queryFn: () =>
      healthApi.getMetrics({
        userId: profile!.id,
        startDate: sevenDaysAgo,
        endDate: today,
      }),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5,
  });

  // Get the most recent metric
  const latestMetric = useMemo(() => {
    if (!query.data?.metrics?.length) return null;

    const sorted = [...query.data.metrics].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const latest = sorted[0];
    return {
      date: latest.date,
      sleepScore: latest.sleep_score ?? null,
      activityScore: latest.activity_score ?? null,
      recoveryScore: latest.recovery_score ?? null,
      hrvAvg: latest.hrv_avg ?? null,
      steps: latest.steps ?? null,
      sleepDurationMinutes: latest.sleep_duration_minutes ?? null,
      restingHr: latest.resting_hr ?? null,
    };
  }, [query.data?.metrics]);

  // Calculate 7-day comparison
  const weeklyComparison = useMemo(() => {
    if (!query.data?.metrics?.length) return null;

    const metrics = query.data.metrics;
    const calcAvg = (key: keyof ApiHealthMetric) => {
      const values = metrics.map((m) => m[key]).filter((v): v is number => typeof v === 'number');
      if (values.length === 0) return null;
      return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
    };

    return {
      avgSleepScore: calcAvg('sleep_score'),
      avgActivityScore: calcAvg('activity_score'),
      avgRecoveryScore: calcAvg('recovery_score'),
      avgHrv: calcAvg('hrv_avg'),
      avgSteps: calcAvg('steps'),
    };
  }, [query.data?.metrics]);

  return {
    ...query,
    latestMetric,
    weeklyComparison,
    error: query.error?.message ?? null,
  };
}

// ============================================================================
// Prefetch Hook
// ============================================================================

export function usePrefetchHealthData() {
  const queryClient = useQueryClient();
  const profile = useUserStore((state) => state.profile);

  const prefetch = () => {
    if (!profile?.id) return;

    // Prefetch current scores
    queryClient.prefetchQuery({
      queryKey: healthQueryKeys.scores(profile.id),
      queryFn: () => healthApi.getCurrentScores(profile.id),
    });

    // Prefetch 30-day history
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    queryClient.prefetchQuery({
      queryKey: healthQueryKeys.history(profile.id, 30),
      queryFn: () =>
        healthApi.getMetrics({
          userId: profile.id,
          startDate,
          endDate,
        }),
    });
  };

  return { prefetch };
}
