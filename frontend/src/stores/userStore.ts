// User profile and app state management with Zustand
// Enterprise-ready state management with proper hydration handling

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

// ============================================================================
// Types
// ============================================================================

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  timezone: string;
  primaryGoal: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WearableConnection {
  provider: 'oura' | 'whoop' | 'apple_health' | 'garmin';
  isConnected: boolean;
  lastSyncAt?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}

interface UserState {
  // Profile
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Wearables
  wearables: WearableConnection[];

  // Hydration tracking for SSR
  _hasHydrated: boolean;

  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setWearables: (wearables: WearableConnection[]) => void;
  updateWearable: (provider: WearableConnection['provider'], updates: Partial<WearableConnection>) => void;
  connectWearable: (provider: WearableConnection['provider'], tokens: { accessToken: string; refreshToken?: string; expiresAt?: string }) => void;
  disconnectWearable: (provider: WearableConnection['provider']) => void;
  setHasHydrated: (state: boolean) => void;

  // Computed
  getChronologicalAge: () => number | null;
  getBMI: () => number | null;
}

// ============================================================================
// Safe Storage (handles SSR and localStorage errors)
// ============================================================================

const safeStorage: StateStorage = {
  getItem: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(name);
    } catch {
      console.warn(`Failed to get item ${name} from localStorage`);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.warn(`Failed to set item ${name} in localStorage:`, error);
    }
  },
  removeItem: (name: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(name);
    } catch {
      console.warn(`Failed to remove item ${name} from localStorage`);
    }
  },
};

// ============================================================================
// User Store
// ============================================================================

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      wearables: [],
      _hasHydrated: false,

      // Actions
      setProfile: (profile) =>
        set({
          profile,
          isAuthenticated: true,
          error: null,
        }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...updates, updatedAt: new Date().toISOString() }
            : null,
        })),

      clearProfile: () => {
        // Clear all user-related state
        set({
          profile: null,
          isAuthenticated: false,
          wearables: [],
          error: null,
          isLoading: false,
        });

        // Also clear settings store
        useSettingsStore.getState().resetToDefaults();
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      setWearables: (wearables) => set({ wearables }),

      updateWearable: (provider, updates) =>
        set((state) => ({
          wearables: state.wearables.map((w) =>
            w.provider === provider ? { ...w, ...updates } : w
          ),
        })),

      connectWearable: (provider, tokens) =>
        set((state) => {
          const existing = state.wearables.find((w) => w.provider === provider);
          if (existing) {
            return {
              wearables: state.wearables.map((w) =>
                w.provider === provider
                  ? { ...w, isConnected: true, ...tokens, lastSyncAt: new Date().toISOString() }
                  : w
              ),
            };
          }
          return {
            wearables: [
              ...state.wearables,
              { provider, isConnected: true, ...tokens, lastSyncAt: new Date().toISOString() },
            ],
          };
        }),

      disconnectWearable: (provider) =>
        set((state) => ({
          wearables: state.wearables.map((w) =>
            w.provider === provider
              ? { ...w, isConnected: false, accessToken: undefined, refreshToken: undefined, expiresAt: undefined }
              : w
          ),
        })),

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      // Computed values
      getChronologicalAge: () => {
        const profile = get().profile;
        if (!profile?.dateOfBirth) return null;

        const birthDate = new Date(profile.dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        return age;
      },

      getBMI: () => {
        const profile = get().profile;
        if (!profile?.heightCm || !profile?.weightKg) return null;

        const heightM = profile.heightCm / 100;
        return Math.round((profile.weightKg / (heightM * heightM)) * 10) / 10;
      },
    }),
    {
      name: 'longevity-user-storage',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        wearables: state.wearables,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// ============================================================================
// Settings Types
// ============================================================================

export interface NotificationSettings {
  morningReminder: boolean;
  morningReminderTime?: string; // HH:mm format
  protocolReminders: boolean;
  milestones: boolean;
  weeklyReport: boolean;
  weeklyReportDay?: 'sunday' | 'monday';
}

export interface UnitSettings {
  weight: 'kg' | 'lbs';
  height: 'cm' | 'ft';
  temperature: 'celsius' | 'fahrenheit';
  distance: 'km' | 'mi';
}

export interface FastingDefaultSettings {
  targetHours: number;
  reminderEnabled: boolean;
  reminderBeforeEndMinutes?: number;
}

interface SettingsState {
  // Settings - Note: Theme is managed by next-themes, not here
  // This prevents dual source of truth issues
  notifications: NotificationSettings;
  units: UnitSettings;
  fastingDefaults: FastingDefaultSettings;
  dataPrivacy: {
    shareAnonymousData: boolean;
    allowAIRecommendations: boolean;
  };

  // Hydration tracking
  _hasHydrated: boolean;

  // Actions
  setNotifications: (settings: Partial<NotificationSettings>) => void;
  setUnits: (settings: Partial<UnitSettings>) => void;
  setFastingDefaults: (settings: Partial<FastingDefaultSettings>) => void;
  setDataPrivacy: (settings: Partial<SettingsState['dataPrivacy']>) => void;
  resetToDefaults: () => void;
  setHasHydrated: (state: boolean) => void;
}

// Default settings values
const DEFAULT_SETTINGS = {
  notifications: {
    morningReminder: true,
    morningReminderTime: '07:00',
    protocolReminders: true,
    milestones: true,
    weeklyReport: true,
    weeklyReportDay: 'sunday' as const,
  },
  units: {
    weight: 'kg' as const,
    height: 'cm' as const,
    temperature: 'celsius' as const,
    distance: 'km' as const,
  },
  fastingDefaults: {
    targetHours: 16,
    reminderEnabled: true,
    reminderBeforeEndMinutes: 30,
  },
  dataPrivacy: {
    shareAnonymousData: false,
    allowAIRecommendations: true,
  },
};

// ============================================================================
// Settings Store
// ============================================================================

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Initial state from defaults
      ...DEFAULT_SETTINGS,
      _hasHydrated: false,

      // Actions
      setNotifications: (settings) =>
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        })),

      setUnits: (settings) =>
        set((state) => ({
          units: { ...state.units, ...settings },
        })),

      setFastingDefaults: (settings) =>
        set((state) => ({
          fastingDefaults: { ...state.fastingDefaults, ...settings },
        })),

      setDataPrivacy: (settings) =>
        set((state) => ({
          dataPrivacy: { ...state.dataPrivacy, ...settings },
        })),

      resetToDefaults: () => set({ ...DEFAULT_SETTINGS }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'longevity-settings-storage',
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

// ============================================================================
// Hydration Hook
// ============================================================================

/**
 * Hook to safely access store state after hydration
 * Prevents hydration mismatch errors in SSR
 */
export function useHydrated() {
  const userHydrated = useUserStore((state) => state._hasHydrated);
  const settingsHydrated = useSettingsStore((state) => state._hasHydrated);
  return userHydrated && settingsHydrated;
}

// ============================================================================
// Selector Hooks (Optimized for Performance)
// ============================================================================

/**
 * Optimized selectors to prevent unnecessary re-renders
 */
export const userSelectors = {
  profile: (state: UserState) => state.profile,
  isAuthenticated: (state: UserState) => state.isAuthenticated,
  isLoading: (state: UserState) => state.isLoading,
  error: (state: UserState) => state.error,
  wearables: (state: UserState) => state.wearables,
  connectedWearables: (state: UserState) => state.wearables.filter((w) => w.isConnected),
};

export const settingsSelectors = {
  notifications: (state: SettingsState) => state.notifications,
  units: (state: SettingsState) => state.units,
  fastingDefaults: (state: SettingsState) => state.fastingDefaults,
  dataPrivacy: (state: SettingsState) => state.dataPrivacy,
};
