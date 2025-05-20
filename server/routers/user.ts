// Import Zod for input validation
import { z } from 'zod';
// Import router and publicProcedure from the tRPC setup
import { router, publicProcedure } from '../trpc';
// Import the Prisma client instance
import { prisma } from '../prisma';

// Define the userRouter with available user-related API procedures
export const userRouter = router({
  // Procedure to get a user by their email address
  getUserByEmail: publicProcedure
    .input(z.string().email())
    .query(async ({ input }) => {
      return prisma.user.findUnique({
        where: { email: input },
      });
    }),

  // New: Procedure to handle incoming chat messages
  sendMessage: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      // Placeholder response logic
      const response = `Echo: ${input.message}`;
      return { reply: response };
    }),
});
