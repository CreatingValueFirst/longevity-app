'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { useUserStore } from '@/stores/userStore';

// ============================================================================
// Query Client Configuration
// ============================================================================

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is fresh for 1 minute
        staleTime: 60 * 1000,
        // Cache for 5 minutes
        gcTime: 5 * 60 * 1000,
        // Don't refetch on window focus by default
        refetchOnWindowFocus: false,
        // Retry failed requests 2 times with exponential backoff
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Network mode - always try to fetch when online
        networkMode: 'offlineFirst',
      },
      mutations: {
        // Retry mutations once
        retry: 1,
        // Network mode
        networkMode: 'offlineFirst',
      },
    },
  });
}

// ============================================================================
// Query Client Context (for cache clearing on logout)
// ============================================================================

interface QueryClientContextValue {
  queryClient: QueryClient;
  clearCache: () => void;
}

const QueryClientContext = createContext<QueryClientContextValue | null>(null);

export function useQueryClientContext() {
  const context = useContext(QueryClientContext);
  if (!context) {
    throw new Error('useQueryClientContext must be used within Providers');
  }
  return context;
}

// ============================================================================
// Auth State Sync
// ============================================================================

function AuthStateSync({ queryClient }: { queryClient: QueryClient }) {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const prevAuthRef = useRef(useUserStore.getState().isAuthenticated);

  useEffect(() => {
    // Clear cache when user logs out
    if (prevAuthRef.current && !isAuthenticated) {
      queryClient.clear();
    }
    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, queryClient]);

  return null;
}

// ============================================================================
// Providers Component
// ============================================================================

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());

  const clearCache = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  const contextValue: QueryClientContextValue = {
    queryClient,
    clearCache,
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
      storageKey="longevity-theme"
    >
      <QueryClientProvider client={queryClient}>
        <QueryClientContext.Provider value={contextValue}>
          <AuthStateSync queryClient={queryClient} />
          {children}
          <Toaster position="top-right" richColors closeButton />
          {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
          )}
        </QueryClientContext.Provider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
