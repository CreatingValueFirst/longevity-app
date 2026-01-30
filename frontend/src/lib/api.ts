// API client for n8n webhook backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://n8n.srv1235221.hstgr.cloud/webhook';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
}

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

// Health Metrics API
export const healthApi = {
  recordMetrics: (data: {
    userId: string;
    date: string;
    source: string;
    metrics: Record<string, number | null>;
  }) => apiRequest('/api/health/metrics', { method: 'POST', body: data }),

  getMetrics: (params: { userId: string; startDate?: string; endDate?: string; source?: string }) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    return apiRequest<{ metrics: unknown[] }>(`/api/health/metrics?${searchParams}`);
  },

  getCurrentScores: (userId: string) =>
    apiRequest<{
      scores: {
        overall_score: number;
        biological_age: number;
        chronological_age: number;
        age_difference: number;
        sleep_score: number;
        activity_score: number;
        recovery_score: number;
        trend: string;
      };
    }>(`/api/scores/current?userId=${userId}`),
};

// Protocol API
export const protocolApi = {
  logItem: (data: { userId: string; protocolItemId: string; notes?: string }) =>
    apiRequest<{ success: boolean; streak: number }>('/api/protocol/log', { method: 'POST', body: data }),

  getTodayProtocol: (userId: string) =>
    apiRequest<{ items: unknown[]; completed: string[] }>(`/api/protocol/today?userId=${userId}`),

  getStreaks: (userId: string) =>
    apiRequest<{ streaks: Record<string, { current: number; longest: number }> }>(`/api/protocol/streaks?userId=${userId}`),
};

// Fasting API
export const fastingApi = {
  startFast: (data: { userId: string; targetHours?: number }) =>
    apiRequest<{ fastId: string; startedAt: string }>('/api/fasting/start', { method: 'POST', body: data }),

  endFast: (data: { userId: string; fastId: string; notes?: string }) =>
    apiRequest<{ actualHours: number; metabolicState: string }>('/api/fasting/end', { method: 'POST', body: data }),

  getCurrentFast: (userId: string) =>
    apiRequest<{ isActive: boolean; fast?: unknown }>(`/api/fasting/current?userId=${userId}`),
};

// AI Recommendations API
export const aiApi = {
  getRecommendations: (userId: string) =>
    apiRequest<{ recommendations: unknown[] }>('/api/ai/recommendations', { method: 'POST', body: { userId } }),
};

// User Profile API
export const userApi = {
  getProfile: (userId: string) =>
    apiRequest<{ profile: unknown }>(`/api/profile?userId=${userId}`),

  updateProfile: (data: { userId: string; updates: Record<string, unknown> }) =>
    apiRequest<{ success: boolean }>('/api/profile', { method: 'PUT', body: data }),
};

export { apiRequest };
