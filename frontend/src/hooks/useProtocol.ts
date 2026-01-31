// Protocol tracking hooks with localStorage persistence and proper state management

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { ProtocolItem } from '@/types/protocols';

// ============================================================================
// Types
// ============================================================================

export interface StreakData {
  current: number;
  longest: number;
  lastDate: string;
}

export interface ProtocolHistoryEntry {
  date: string;
  completedCount: number;
  totalCount: number;
  completedIds: string[];
}

export interface ProtocolStats {
  totalItems: number;
  activeItems: number;
  completedCount: number;
  completionPercent: number;
  currentStreak: number;
  longestStreak: number;
}

// Storage keys
const PROTOCOL_ITEMS_KEY = 'longevity-protocol-items';
const PROTOCOL_COMPLETED_KEY = 'longevity-protocol-completed';
const PROTOCOL_STREAKS_KEY = 'longevity-protocol-streaks';
const PROTOCOL_HISTORY_KEY = 'longevity-protocol-history';

// ============================================================================
// Default Protocol Items
// ============================================================================

const DEFAULT_PROTOCOL: ProtocolItem[] = [
  { id: '1', name: 'Morning light exposure (10-30 min)', category: 'sleep', frequency: 'daily', timeOfDay: 'morning', isActive: true },
  { id: '2', name: 'Vitamin D3', category: 'supplement', frequency: 'daily', timeOfDay: 'morning', dosage: '4000 IU', isActive: true },
  { id: '3', name: 'Omega-3 (EPA+DHA)', category: 'supplement', frequency: 'daily', timeOfDay: 'morning', dosage: '2g', isActive: true },
  { id: '4', name: 'Creatine monohydrate', category: 'supplement', frequency: 'daily', timeOfDay: 'morning', dosage: '5g', isActive: true },
  { id: '5', name: 'Zone 2 cardio (45-60 min)', category: 'exercise', frequency: 'daily', timeOfDay: 'morning', notes: 'MWF', isActive: true },
  { id: '6', name: 'Strength training', category: 'exercise', frequency: 'daily', timeOfDay: 'afternoon', notes: 'TTh', isActive: true },
  { id: '7', name: 'Protein target (160g)', category: 'nutrition', frequency: 'daily', timeOfDay: 'anytime', isActive: true },
  { id: '8', name: 'Time-restricted eating (16:8)', category: 'nutrition', frequency: 'daily', timeOfDay: 'anytime', isActive: true },
  { id: '9', name: 'Magnesium glycinate', category: 'supplement', frequency: 'daily', timeOfDay: 'evening', dosage: '400mg', isActive: true },
  { id: '10', name: 'Wind down routine', category: 'sleep', frequency: 'daily', timeOfDay: 'evening', isActive: true },
  { id: '11', name: 'Cold exposure (3 min)', category: 'therapy', frequency: 'daily', timeOfDay: 'morning', isActive: true },
  { id: '12', name: '10 min meditation', category: 'mindfulness', frequency: 'daily', timeOfDay: 'morning', isActive: true },
];

// Default streaks
const DEFAULT_STREAKS: Record<string, StreakData> = {
  protocol: { current: 0, longest: 0, lastDate: '' },
  fasting: { current: 0, longest: 0, lastDate: '' },
  exercise: { current: 0, longest: 0, lastDate: '' },
};

// ============================================================================
// Helper Functions
// ============================================================================

function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

function isYesterday(dateString: string): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return dateString === yesterday.toISOString().split('T')[0];
}

function getStoredItems(): ProtocolItem[] {
  if (typeof window === 'undefined') return DEFAULT_PROTOCOL;

  try {
    const stored = localStorage.getItem(PROTOCOL_ITEMS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading protocol items from localStorage:', error);
  }

  return DEFAULT_PROTOCOL;
}

function saveStoredItems(items: ProtocolItem[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PROTOCOL_ITEMS_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving protocol items to localStorage:', error);
  }
}

function getCompletedToday(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const stored = localStorage.getItem(PROTOCOL_COMPLETED_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      if (data.date === getTodayString() && Array.isArray(data.completedIds)) {
        return new Set(data.completedIds);
      }
    }
  } catch (error) {
    console.error('Error reading completed items from localStorage:', error);
  }

  return new Set();
}

function saveCompletedToday(completedIds: Set<string>): void {
  if (typeof window === 'undefined') return;

  try {
    const data = {
      date: getTodayString(),
      completedIds: Array.from(completedIds),
    };
    localStorage.setItem(PROTOCOL_COMPLETED_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving completed items to localStorage:', error);
  }
}

function getStoredStreaks(): Record<string, StreakData> {
  if (typeof window === 'undefined') return DEFAULT_STREAKS;

  try {
    const stored = localStorage.getItem(PROTOCOL_STREAKS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (typeof parsed === 'object' && parsed !== null) {
        return { ...DEFAULT_STREAKS, ...parsed };
      }
    }
  } catch (error) {
    console.error('Error reading streaks from localStorage:', error);
  }

  return DEFAULT_STREAKS;
}

function saveStoredStreaks(streaks: Record<string, StreakData>): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(PROTOCOL_STREAKS_KEY, JSON.stringify(streaks));
  } catch (error) {
    console.error('Error saving streaks to localStorage:', error);
  }
}

function getStoredHistory(): ProtocolHistoryEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(PROTOCOL_HISTORY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading protocol history from localStorage:', error);
  }

  return [];
}

function saveToHistory(entry: ProtocolHistoryEntry): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getStoredHistory();
    const existingIndex = history.findIndex((h) => h.date === entry.date);
    if (existingIndex >= 0) {
      history[existingIndex] = entry;
    } else {
      history.unshift(entry);
    }
    const trimmed = history.slice(0, 100);
    localStorage.setItem(PROTOCOL_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving protocol history to localStorage:', error);
  }
}

// ============================================================================
// Main Protocol Hook
// ============================================================================

export function useProtocol() {
  // State
  const [items, setItems] = useState<ProtocolItem[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [streaks, setStreaks] = useState<Record<string, StreakData>>(DEFAULT_STREAKS);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const storedItems = getStoredItems();
      const storedCompleted = getCompletedToday();
      const storedStreaks = getStoredStreaks();

      setItems(storedItems);
      setCompletedIds(storedCompleted);
      setStreaks(storedStreaks);

      // Check if we need to reset streak (missed a day)
      const today = getTodayString();
      const protocolStreak = storedStreaks.protocol;
      if (
        protocolStreak.lastDate &&
        protocolStreak.lastDate !== today &&
        !isYesterday(protocolStreak.lastDate)
      ) {
        // Streak broken - reset current but keep longest
        const newStreaks = {
          ...storedStreaks,
          protocol: { ...protocolStreak, current: 0 },
        };
        setStreaks(newStreaks);
        saveStoredStreaks(newStreaks);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load protocol data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoized grouped items
  const groupedItems = useMemo(
    () => ({
      morning: items.filter((i) => i.timeOfDay === 'morning'),
      afternoon: items.filter((i) => i.timeOfDay === 'afternoon'),
      evening: items.filter((i) => i.timeOfDay === 'evening'),
      anytime: items.filter((i) => i.timeOfDay === 'anytime' || !i.timeOfDay),
    }),
    [items]
  );

  // Active items only
  const activeItems = useMemo(
    () => items.filter((i) => i.isActive),
    [items]
  );

  // Memoized stats
  const stats: ProtocolStats = useMemo(() => {
    const totalItems = items.length;
    const activeCount = activeItems.length;
    const completed = completedIds.size;
    const completionPercent = activeCount > 0 ? Math.round((completed / activeCount) * 100) : 0;

    return {
      totalItems,
      activeItems: activeCount,
      completedCount: completed,
      completionPercent,
      currentStreak: streaks.protocol?.current ?? 0,
      longestStreak: streaks.protocol?.longest ?? 0,
    };
  }, [items, activeItems, completedIds, streaks]);

  // Check if item is completed
  const isItemCompleted = useCallback(
    (itemId: string) => completedIds.has(itemId),
    [completedIds]
  );

  // Log item completion (notes parameter reserved for future API integration)
  const logItem = useCallback(
    (itemId: string, _notes?: string) => {
      if (completedIds.has(itemId)) return;

      setIsLogging(true);
      setError(null);

      try {
        const newCompletedIds = new Set(completedIds);
        newCompletedIds.add(itemId);
        setCompletedIds(newCompletedIds);
        saveCompletedToday(newCompletedIds);

        // Update history
        const today = getTodayString();
        const activeCount = items.filter((i) => i.isActive).length;
        const historyEntry: ProtocolHistoryEntry = {
          date: today,
          completedCount: newCompletedIds.size,
          totalCount: activeCount,
          completedIds: Array.from(newCompletedIds),
        };
        saveToHistory(historyEntry);

        // Check if all items completed - update streak
        const allCompleted = newCompletedIds.size >= activeCount;
        if (allCompleted) {
          const currentStreaks = getStoredStreaks();
          const protocolStreak = currentStreaks.protocol;
          const lastDate = protocolStreak.lastDate;

          if (lastDate !== today) {
            let newCurrent = 1;
            if (isYesterday(lastDate)) {
              newCurrent = protocolStreak.current + 1;
            }

            const newLongest = Math.max(protocolStreak.longest, newCurrent);
            const newStreaks = {
              ...currentStreaks,
              protocol: {
                current: newCurrent,
                longest: newLongest,
                lastDate: today,
              },
            };
            setStreaks(newStreaks);
            saveStoredStreaks(newStreaks);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to log item');
      } finally {
        setIsLogging(false);
      }
    },
    [completedIds, items]
  );

  // Unlog item (remove completion)
  const unlogItem = useCallback(
    (itemId: string) => {
      if (!completedIds.has(itemId)) return;

      try {
        const newCompletedIds = new Set(completedIds);
        newCompletedIds.delete(itemId);
        setCompletedIds(newCompletedIds);
        saveCompletedToday(newCompletedIds);

        // Update history
        const today = getTodayString();
        const activeCount = items.filter((i) => i.isActive).length;
        const historyEntry: ProtocolHistoryEntry = {
          date: today,
          completedCount: newCompletedIds.size,
          totalCount: activeCount,
          completedIds: Array.from(newCompletedIds),
        };
        saveToHistory(historyEntry);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to unlog item');
      }
    },
    [completedIds, items]
  );

  // Toggle item completion
  const toggleItem = useCallback(
    (itemId: string, notes?: string) => {
      if (completedIds.has(itemId)) {
        unlogItem(itemId);
      } else {
        logItem(itemId, notes);
      }
    },
    [completedIds, logItem, unlogItem]
  );

  // Add new protocol item
  const addItem = useCallback(
    (item: Omit<ProtocolItem, 'id'>) => {
      try {
        const newItem: ProtocolItem = {
          ...item,
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        const newItems = [...items, newItem];
        setItems(newItems);
        saveStoredItems(newItems);
        return newItem;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add item');
        return null;
      }
    },
    [items]
  );

  // Update protocol item
  const updateItem = useCallback(
    (itemId: string, updates: Partial<ProtocolItem>) => {
      try {
        const newItems = items.map((item) =>
          item.id === itemId ? { ...item, ...updates } : item
        );
        setItems(newItems);
        saveStoredItems(newItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update item');
      }
    },
    [items]
  );

  // Remove protocol item
  const removeItem = useCallback(
    (itemId: string) => {
      try {
        const newItems = items.filter((i) => i.id !== itemId);
        setItems(newItems);
        saveStoredItems(newItems);

        // Also remove from completed if present
        if (completedIds.has(itemId)) {
          const newCompletedIds = new Set(completedIds);
          newCompletedIds.delete(itemId);
          setCompletedIds(newCompletedIds);
          saveCompletedToday(newCompletedIds);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to remove item');
      }
    },
    [items, completedIds]
  );

  // Toggle item active status
  const toggleItemActive = useCallback(
    (itemId: string) => {
      try {
        const newItems = items.map((item) =>
          item.id === itemId ? { ...item, isActive: !item.isActive } : item
        );
        setItems(newItems);
        saveStoredItems(newItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to toggle item');
      }
    },
    [items]
  );

  // Reset today's progress
  const resetToday = useCallback(() => {
    try {
      setCompletedIds(new Set());
      saveCompletedToday(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset progress');
    }
  }, []);

  // Reorder items
  const reorderItems = useCallback(
    (startIndex: number, endIndex: number) => {
      try {
        const newItems = Array.from(items);
        const [removed] = newItems.splice(startIndex, 1);
        newItems.splice(endIndex, 0, removed);
        setItems(newItems);
        saveStoredItems(newItems);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to reorder items');
      }
    },
    [items]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // Data
    items,
    activeItems,
    groupedItems,
    completedIds,
    streaks,
    stats,

    // Legacy props (for backwards compatibility)
    totalItems: stats.totalItems,
    completedCount: stats.completedCount,
    completionPercent: stats.completionPercent,

    // Loading states
    isLoading,
    isLogging,

    // Error state
    error,
    clearError,

    // Actions
    isItemCompleted,
    logItem,
    unlogItem,
    toggleItem,
    addItem,
    updateItem,
    removeItem,
    toggleItemActive,
    resetToday,
    reorderItems,
  };
}

// ============================================================================
// Protocol History Hook
// ============================================================================

export function useProtocolHistory() {
  const [history, setHistory] = useState<ProtocolHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHistory(getStoredHistory());
    setIsLoading(false);
  }, []);

  const clearHistory = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(PROTOCOL_HISTORY_KEY);
    setHistory([]);
  }, []);

  const deleteEntry = useCallback(
    (date: string) => {
      const updated = history.filter((entry) => entry.date !== date);
      localStorage.setItem(PROTOCOL_HISTORY_KEY, JSON.stringify(updated));
      setHistory(updated);
    },
    [history]
  );

  // Calculate adherence stats
  const adherenceStats = useMemo(() => {
    if (history.length === 0) {
      return {
        sevenDayAdherence: 0,
        thirtyDayAdherence: 0,
        averageCompletion: 0,
        perfectDays: 0,
        totalDays: 0,
      };
    }

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

    const recentSevenDays = history.filter((h) => h.date >= sevenDaysAgoStr);
    const recentThirtyDays = history.filter((h) => h.date >= thirtyDaysAgoStr);

    const calcAdherence = (entries: ProtocolHistoryEntry[]) => {
      if (entries.length === 0) return 0;
      const totalCompleted = entries.reduce((sum, h) => sum + h.completedCount, 0);
      const totalPossible = entries.reduce((sum, h) => sum + h.totalCount, 0);
      return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    };

    const perfectDays = history.filter((h) => h.completedCount >= h.totalCount).length;
    const totalCompleted = history.reduce((sum, h) => sum + h.completedCount, 0);
    const totalPossible = history.reduce((sum, h) => sum + h.totalCount, 0);

    return {
      sevenDayAdherence: calcAdherence(recentSevenDays),
      thirtyDayAdherence: calcAdherence(recentThirtyDays),
      averageCompletion: totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0,
      perfectDays,
      totalDays: history.length,
    };
  }, [history]);

  return {
    history,
    isLoading,
    clearHistory,
    deleteEntry,
    ...adherenceStats,
  };
}

// ============================================================================
// Protocol Streaks Hook
// ============================================================================

export function useProtocolStreaks() {
  const [streaks, setStreaks] = useState<Record<string, StreakData>>(DEFAULT_STREAKS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setStreaks(getStoredStreaks());
    setIsLoading(false);
  }, []);

  const resetStreak = useCallback((type: string) => {
    const newStreaks = {
      ...streaks,
      [type]: { current: 0, longest: streaks[type]?.longest ?? 0, lastDate: '' },
    };
    setStreaks(newStreaks);
    saveStoredStreaks(newStreaks);
  }, [streaks]);

  const resetAllStreaks = useCallback(() => {
    setStreaks(DEFAULT_STREAKS);
    saveStoredStreaks(DEFAULT_STREAKS);
  }, []);

  return {
    streaks,
    isLoading,
    resetStreak,
    resetAllStreaks,
    protocolStreak: streaks.protocol?.current ?? 0,
    longestProtocolStreak: streaks.protocol?.longest ?? 0,
  };
}
