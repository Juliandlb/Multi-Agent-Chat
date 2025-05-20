// Import the main router creator from tRPC setup
import { router } from './trpc';
// Import the userRouter which contains user-related API procedures
import { userRouter } from './routers/user';

// Combine all routers into a single appRouter
export const appRouter = router({
  user: userRouter, // Mount userRouter under the "user" namespace
});

// Export type definition of the API for type safety on the client side
export type AppRouter = typeof appRouter;