// Providers: Wraps the app with tRPC and React Query providers for data fetching and caching.

'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/utils/trpc';

// Create a single QueryClient instance for React Query
const queryClient = new QueryClient();

// Create a tRPC client with HTTP batch link
const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/api/trpc',
    }),
  ],
});

// Providers component wraps children with tRPC and React Query providers
export default function Providers({ children }: { /** React children to wrap with providers */ children: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
