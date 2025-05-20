// Enable usage of this file in React client components
'use client';

// Import the function to create a tRPC React client
import { createTRPCReact } from '@trpc/react-query';
// Import the type definition for the app's tRPC router
import type { AppRouter } from '@/server/root';

// Create and export a tRPC React client instance typed with AppRouter
export const trpc = createTRPCReact<AppRouter>();