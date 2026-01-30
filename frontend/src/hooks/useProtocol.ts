// Protocol tracking hooks

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { protocolApi } from '@/lib/api';
import { useUserStore } from '@/stores/userStore';
import type { ProtocolItem } from '@/types/protocols';

export function useProtocol() {
  const profile = useUserStore((state) => state.profile);
  const queryClient = useQueryClient();

  // Get today's protocol items
  const { data: todayProtocol, isLoading: isLoadingProtocol } = useQuery({
    queryKey: ['protocol-today', profile?.id],
    queryFn: () => protocolApi.getTodayProtocol(profile!.id),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 5,
  });

  // Get streaks
  const { data: streaksData, isLoading: isLoadingStreaks } = useQuery({
    queryKey: ['protocol-streaks', profile?.id],
    queryFn: () => protocolApi.getStreaks(profile!.id),
    enabled: !!profile?.id,
    staleTime: 1000 * 60 * 10,
  });

  // Log protocol item mutation
  const logItemMutation = useMutation({
    mutationFn: (data: { protocolItemId: string; notes?: string }) =>
      protocolApi.logItem({
        userId: profile!.id,
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['protocol-today'] });
      queryClient.invalidateQueries({ queryKey: ['protocol-streaks'] });
    },
  });

  // Parse protocol items
  const items = (todayProtocol?.items ?? []) as ProtocolItem[];
  const completedIds = new Set(todayProtocol?.completed ?? []);

  // Group items by time of day
  const groupedItems = {
    morning: items.filter((i) => i.timeOfDay === 'morning'),
    afternoon: items.filter((i) => i.timeOfDay === 'afternoon'),
    evening: items.filter((i) => i.timeOfDay === 'evening'),
    anytime: items.filter((i) => i.timeOfDay === 'anytime' || !i.timeOfDay),
  };

  // Calculate completion stats
  const totalItems = items.length;
  const completedCount = completedIds.size;
  const completionPercent = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // Check if item is completed
  const isItemCompleted = (itemId: string) => completedIds.has(itemId);

  // Log item completion
  const logItem = (itemId: string, notes?: string) => {
    logItemMutation.mutate({ protocolItemId: itemId, notes });
  };

  return {
    // Data
    items,
    groupedItems,
    completedIds,
    streaks: streaksData?.streaks ?? {},

    // Stats
    totalItems,
    completedCount,
    completionPercent,

    // Loading states
    isLoading: isLoadingProtocol || isLoadingStreaks,
    isLogging: logItemMutation.isPending,

    // Actions
    isItemCompleted,
    logItem,
  };
}
