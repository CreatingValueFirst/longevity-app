// API client for n8n webhook backend with proper TypeScript types

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://n8n.srv1235221.hstgr.cloud/webhook';

// ============================================================================
// Types
// ============================================================================

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

// Health metric from API
export interface ApiHealthMetric {
  id?: string;
  date: string;
  source?: string;
  sleep_score?: number;
  activity_score?: number;
  recovery_score?: number;
  hrv_avg?: number;
  steps?: number;
  sleep_duration_minutes?: number;
  resting_hr?: number;
  deep_sleep_minutes?: number;
  rem_sleep_minutes?: number;
  active_calories?: number;
}

export interface ApiHealthScores {
  overall_score: number;
  biological_age: number;
  chronological_age: number;
  age_difference: number;
  sleep_score: number;
  activity_score: number;
  recovery_score: number;
  nutrition_score?: number;
  adherence_score?: number;
  trend: string;
}

export interface ApiFastingSession {
  id: string;
  started_at: string;
  ended_at?: string;
  target_hours: number;
  actual_hours?: number;
  notes?: string;
}

// ============================================================================
// API Request Helper
// ============================================================================

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// Health Metrics API
// ============================================================================

export const healthApi = {
  recordMetrics: (data: {
    userId: string;
    date: string;
    source: string;
    metrics: Record<string, number | null>;
  }): Promise<{ success: boolean }> =>
    apiRequest<{ success: boolean }>('/api/health/metrics', { method: 'POST', body: data }),

  getMetrics: (params: {
    userId: string;
    startDate?: string;
    endDate?: string;
    source?: string;
  }): Promise<{ metrics: ApiHealthMetric[] }> => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    return apiRequest<{ metrics: ApiHealthMetric[] }>(`/api/health/metrics?${searchParams}`);
  },

  getCurrentScores: (userId: string): Promise<{ scores: ApiHealthScores }> =>
    apiRequest<{ scores: ApiHealthScores }>(`/api/scores/current?userId=${userId}`),
};

// ============================================================================
// Protocol API
// ============================================================================

export interface ApiProtocolItem {
  id: string;
  name: string;
  category: string;
  frequency: string;
  timeOfDay?: string;
  dosage?: string;
  notes?: string;
  isActive: boolean;
}

export const protocolApi = {
  logItem: (data: {
    userId: string;
    protocolItemId: string;
    notes?: string;
  }): Promise<{ success: boolean; streak: number }> =>
    apiRequest<{ success: boolean; streak: number }>('/api/protocol/log', {
      method: 'POST',
      body: data,
    }),

  getTodayProtocol: (userId: string): Promise<{ items: ApiProtocolItem[]; completed: string[] }> =>
    apiRequest<{ items: ApiProtocolItem[]; completed: string[] }>(
      `/api/protocol/today?userId=${userId}`
    ),

  getStreaks: (
    userId: string
  ): Promise<{ streaks: Record<string, { current: number; longest: number }> }> =>
    apiRequest<{ streaks: Record<string, { current: number; longest: number }> }>(
      `/api/protocol/streaks?userId=${userId}`
    ),
};

// ============================================================================
// Fasting API
// ============================================================================

export const fastingApi = {
  startFast: (data: {
    userId: string;
    targetHours?: number;
  }): Promise<{ fastId: string; startedAt: string }> =>
    apiRequest<{ fastId: string; startedAt: string }>('/api/fasting/start', {
      method: 'POST',
      body: data,
    }),

  endFast: (data: {
    userId: string;
    fastId: string;
    notes?: string;
  }): Promise<{ actualHours: number; metabolicState: string }> =>
    apiRequest<{ actualHours: number; metabolicState: string }>('/api/fasting/end', {
      method: 'POST',
      body: data,
    }),

  getCurrentFast: (userId: string): Promise<{ isActive: boolean; fast?: ApiFastingSession }> =>
    apiRequest<{ isActive: boolean; fast?: ApiFastingSession }>(
      `/api/fasting/current?userId=${userId}`
    ),
};

// ============================================================================
// AI Recommendations API
// ============================================================================

export interface ApiRecommendation {
  id: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  actionItems: string[];
  evidenceLevel?: string;
  expectedImpact?: string;
}

export const aiApi = {
  getRecommendations: (userId: string): Promise<{ recommendations: ApiRecommendation[] }> =>
    apiRequest<{ recommendations: ApiRecommendation[] }>('/api/ai/recommendations', {
      method: 'POST',
      body: { userId },
    }),
};

// ============================================================================
// User Profile API
// ============================================================================

export interface ApiUserProfile {
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

export const userApi = {
  getProfile: (userId: string): Promise<{ profile: ApiUserProfile }> =>
    apiRequest<{ profile: ApiUserProfile }>(`/api/profile?userId=${userId}`),

  updateProfile: (data: {
    userId: string;
    updates: Partial<ApiUserProfile>;
  }): Promise<{ success: boolean }> =>
    apiRequest<{ success: boolean }>('/api/profile', { method: 'PUT', body: data }),
};

export { apiRequest };
