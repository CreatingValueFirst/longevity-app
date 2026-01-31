// Fasting timer hooks with localStorage persistence and proper state management

'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSettingsStore } from '@/stores/userStore';
import { getMetabolicState, getMetabolicStateInfo, formatFastingTime } from '@/lib/calculations';
// FastingState type is used for reference in this module

// ============================================================================
// Types
// ============================================================================

export interface FastingSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  targetHours: number;
  actualHours?: number;
  notes?: string;
  completed?: boolean;
}

interface FastingStorageState {
  isActive: boolean;
  currentSession: FastingSession | null;
}

export interface FastingHistoryEntry {
  id: string;
  date: string;
  duration: number;
  target: number;
  completed: boolean;
  notes?: string;
  startedAt?: string;
  endedAt?: string;
}

export interface FastingStats {
  totalFasts: number;
  completedFasts: number;
  longestFast: number;
  averageDuration: number;
  currentStreak: number;
  completionRate: number;
}

// Storage keys
const FASTING_STORAGE_KEY = 'longevity-fasting-state';
const FASTING_HISTORY_KEY = 'longevity-fasting-history';

// ============================================================================
// Storage Helpers
// ============================================================================

function getStoredState(): FastingStorageState {
  if (typeof window === 'undefined') {
    return { isActive: false, currentSession: null };
  }

  try {
    const stored = localStorage.getItem(FASTING_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the parsed data
      if (typeof parsed === 'object' && parsed !== null) {
        return {
          isActive: Boolean(parsed.isActive),
          currentSession: parsed.currentSession ?? null,
        };
      }
    }
  } catch (error) {
    console.error('Error reading fasting state from localStorage:', error);
  }

  return { isActive: false, currentSession: null };
}

function saveStoredState(state: FastingStorageState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(FASTING_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving fasting state to localStorage:', error);
  }
}

function getStoredHistory(): FastingHistoryEntry[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(FASTING_HISTORY_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Error reading fasting history from localStorage:', error);
  }

  return [];
}

function saveToHistory(entry: FastingHistoryEntry): void {
  if (typeof window === 'undefined') return;

  try {
    const history = getStoredHistory();
    history.unshift(entry);
    // Keep only last 100 entries
    const trimmed = history.slice(0, 100);
    localStorage.setItem(FASTING_HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error saving fasting history to localStorage:', error);
  }
}

// ============================================================================
// Main Fasting Hook
// ============================================================================

export function useFasting() {
  const fastingDefaults = useSettingsStore((state) => state.fastingDefaults);

  // State
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<FastingSession | null>(null);
  const [elapsedHours, setElapsedHours] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<FastingHistoryEntry[]>([]);

  // Ref for interval
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const storedState = getStoredState();
    setIsActive(storedState.isActive);
    setCurrentSession(storedState.currentSession);
    setHistory(getStoredHistory());
    setIsLoading(false);
  }, []);

  // Calculate elapsed time when active
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!isActive || !currentSession) {
      setElapsedHours(0);
      return;
    }

    const startTime = new Date(currentSession.startedAt).getTime();

    const updateElapsed = () => {
      const now = Date.now();
      const hours = (now - startTime) / (1000 * 60 * 60);
      setElapsedHours(hours);
    };

    // Update immediately
    updateElapsed();

    // Then update every second for smooth display
    intervalRef.current = setInterval(updateElapsed, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive, currentSession]);

  // Computed values with memoization
  const targetHours = currentSession?.targetHours ?? fastingDefaults.targetHours;
  const metabolicState = useMemo(() => getMetabolicState(elapsedHours), [elapsedHours]);
  const metabolicStateInfo = useMemo(() => getMetabolicStateInfo(metabolicState), [metabolicState]);
  const progressPercent = useMemo(
    () => (targetHours > 0 ? Math.min(100, (elapsedHours / targetHours) * 100) : 0),
    [elapsedHours, targetHours]
  );

  // Formatted time displays
  const formattedElapsedTime = useMemo(
    () => formatFastingTime(elapsedHours),
    [elapsedHours]
  );

  const remainingHours = useMemo(
    () => Math.max(0, targetHours - elapsedHours),
    [targetHours, elapsedHours]
  );

  const formattedRemainingTime = useMemo(
    () => formatFastingTime(remainingHours),
    [remainingHours]
  );

  // Has reached target
  const hasReachedTarget = elapsedHours >= targetHours;

  // Start fast
  const startFast = useCallback(
    (targetHoursParam?: number) => {
      setIsStarting(true);
      setError(null);

      try {
        const newSession: FastingSession = {
          id: `fast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          startedAt: new Date().toISOString(),
          targetHours: targetHoursParam ?? fastingDefaults.targetHours,
        };

        const newState: FastingStorageState = {
          isActive: true,
          currentSession: newSession,
        };

        saveStoredState(newState);
        setCurrentSession(newSession);
        setIsActive(true);
        setElapsedHours(0);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to start fast';
        setError(message);
        console.error('Error starting fast:', err);
      } finally {
        setIsStarting(false);
      }
    },
    [fastingDefaults.targetHours]
  );

  // End fast
  const endFast = useCallback(
    (notes?: string) => {
      if (!currentSession) {
        setError('No active fasting session');
        return;
      }

      setIsEnding(true);
      setError(null);

      try {
        const endedAt = new Date().toISOString();
        const startTime = new Date(currentSession.startedAt).getTime();
        const endTime = new Date(endedAt).getTime();
        const actualHours = (endTime - startTime) / (1000 * 60 * 60);
        const completed = actualHours >= currentSession.targetHours;

        // Save to history
        const historyEntry: FastingHistoryEntry = {
          id: currentSession.id,
          date: currentSession.startedAt.split('T')[0],
          duration: Math.round(actualHours * 10) / 10,
          target: currentSession.targetHours,
          completed,
          notes,
          startedAt: currentSession.startedAt,
          endedAt,
        };

        saveToHistory(historyEntry);
        setHistory(getStoredHistory());

        // Clear current state
        const newState: FastingStorageState = {
          isActive: false,
          currentSession: null,
        };

        saveStoredState(newState);
        setCurrentSession(null);
        setIsActive(false);
        setElapsedHours(0);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to end fast';
        setError(message);
        console.error('Error ending fast:', err);
      } finally {
        setIsEnding(false);
      }
    },
    [currentSession]
  );

  // Cancel fast (end without saving to history)
  const cancelFast = useCallback(() => {
    if (!currentSession) return;

    try {
      const newState: FastingStorageState = {
        isActive: false,
        currentSession: null,
      };

      saveStoredState(newState);
      setCurrentSession(null);
      setIsActive(false);
      setElapsedHours(0);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to cancel fast';
      setError(message);
      console.error('Error canceling fast:', err);
    }
  }, [currentSession]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isLoading,
    isActive,
    elapsedHours,
    targetHours,
    progressPercent,
    metabolicState,
    metabolicStateInfo,
    currentSession,
    history,
    hasReachedTarget,
    remainingHours,

    // Formatted values
    formattedElapsedTime,
    formattedRemainingTime,

    // Actions
    startFast,
    endFast,
    cancelFast,

    // Loading/error states
    isStarting,
    isEnding,
    error,
    clearError,
  };
}

// ============================================================================
// Fasting History Hook
// ============================================================================

export function useFastingHistory() {
  const [history, setHistory] = useState<FastingHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setHistory(getStoredHistory());
    setIsLoading(false);
  }, []);

  const clearHistory = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(FASTING_HISTORY_KEY);
    setHistory([]);
  }, []);

  const deleteEntry = useCallback((id: string) => {
    if (typeof window === 'undefined') return;

    const updated = history.filter((entry) => entry.id !== id);
    localStorage.setItem(FASTING_HISTORY_KEY, JSON.stringify(updated));
    setHistory(updated);
  }, [history]);

  // Calculate stats from history
  const stats: FastingStats = useMemo(() => {
    if (history.length === 0) {
      return {
        totalFasts: 0,
        completedFasts: 0,
        longestFast: 0,
        averageDuration: 0,
        currentStreak: 0,
        completionRate: 0,
      };
    }

    const completedFasts = history.filter((h) => h.completed).length;
    const longestFast = Math.max(...history.map((h) => h.duration));
    const totalDuration = history.reduce((sum, h) => sum + h.duration, 0);
    const averageDuration = totalDuration / history.length;

    // Calculate streak (consecutive completed fasts)
    let currentStreak = 0;
    for (const entry of history) {
      if (entry.completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalFasts: history.length,
      completedFasts,
      longestFast: Math.round(longestFast * 10) / 10,
      averageDuration: Math.round(averageDuration * 10) / 10,
      currentStreak,
      completionRate: Math.round((completedFasts / history.length) * 100),
    };
  }, [history]);

  return {
    history,
    isLoading,
    clearHistory,
    deleteEntry,
    stats,
  };
}

// ============================================================================
// Fasting Reminder Hook
// ============================================================================

export function useFastingReminder(enabled: boolean = true) {
  const { isActive, hasReachedTarget } = useFasting();
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return false;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    return permission === 'granted';
  }, []);

  // Show notification when target is reached
  useEffect(() => {
    if (!enabled || !isActive || !hasReachedTarget) return;
    if (notificationPermission !== 'granted') return;

    const notification = new Notification('Fasting Goal Reached!', {
      body: 'Congratulations! You have reached your fasting target.',
      icon: '/icons/fasting-complete.png',
      tag: 'fasting-complete',
    });

    return () => {
      notification.close();
    };
  }, [enabled, isActive, hasReachedTarget, notificationPermission]);

  return {
    notificationPermission,
    requestPermission,
    canNotify: notificationPermission === 'granted',
  };
}
