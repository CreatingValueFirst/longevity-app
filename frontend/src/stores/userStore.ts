// User profile and app state management with Zustand

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
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
}

interface WearableConnection {
  provider: 'oura' | 'whoop' | 'apple_health' | 'garmin';
  isConnected: boolean;
  lastSyncAt?: string;
}

interface UserState {
  // Profile
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Wearables
  wearables: WearableConnection[];

  // Actions
  setProfile: (profile: UserProfile) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
  setWearables: (wearables: WearableConnection[]) => void;
  updateWearable: (provider: string, updates: Partial<WearableConnection>) => void;

  // Computed
  getChronologicalAge: () => number | null;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isAuthenticated: false,
      isLoading: false,
      wearables: [],

      setProfile: (profile) =>
        set({ profile, isAuthenticated: true }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...updates } : null,
        })),

      clearProfile: () =>
        set({ profile: null, isAuthenticated: false, wearables: [] }),

      setLoading: (isLoading) => set({ isLoading }),

      setWearables: (wearables) => set({ wearables }),

      updateWearable: (provider, updates) =>
        set((state) => ({
          wearables: state.wearables.map((w) =>
            w.provider === provider ? { ...w, ...updates } : w
          ),
        })),

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
    }),
    {
      name: 'longevity-user-storage',
      partialize: (state) => ({
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        wearables: state.wearables,
      }),
    }
  )
);

// Settings store
interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    morningReminder: boolean;
    protocolReminders: boolean;
    milestones: boolean;
    weeklyReport: boolean;
  };
  units: {
    weight: 'kg' | 'lbs';
    height: 'cm' | 'ft';
    temperature: 'celsius' | 'fahrenheit';
  };
  fastingDefaults: {
    targetHours: number;
    reminderEnabled: boolean;
  };

  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setNotifications: (settings: Partial<SettingsState['notifications']>) => void;
  setUnits: (settings: Partial<SettingsState['units']>) => void;
  setFastingDefaults: (settings: Partial<SettingsState['fastingDefaults']>) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      notifications: {
        morningReminder: true,
        protocolReminders: true,
        milestones: true,
        weeklyReport: true,
      },
      units: {
        weight: 'kg',
        height: 'cm',
        temperature: 'celsius',
      },
      fastingDefaults: {
        targetHours: 16,
        reminderEnabled: true,
      },

      setTheme: (theme) => set({ theme }),

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
    }),
    {
      name: 'longevity-settings-storage',
    }
  )
);
