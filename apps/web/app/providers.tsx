'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 60_000, retry: 1 },
      mutations: { retry: 0 },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(13,21,38,0.95)',
            color: '#f1f5f9',
            border: '1px solid rgba(59,110,248,0.3)',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#00ffa3', secondary: '#0a0e1a' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0a0e1a' } },
        }}
      />
    </QueryClientProvider>
  );
}
