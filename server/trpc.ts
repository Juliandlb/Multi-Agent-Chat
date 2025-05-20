// Import the initTRPC function from the tRPC server package
import { initTRPC } from '@trpc/server';

// Initialize tRPC with default settings
const t = initTRPC.create();

// Export the router creator for defining API routes
export const router = t.router;

// Export the publicProcedure for defining public API procedures (endpoints)
export const publicProcedure = t.procedure;