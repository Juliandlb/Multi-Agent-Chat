// Import Zod for input validation
import { z } from 'zod';
// Import router and publicProcedure from the tRPC setup
import { router, publicProcedure } from '../trpc';
// Import the Prisma client instance
import { prisma } from '../prisma';
// Import the OpenAI agent runner
import { Runner } from 'openai-agents-js';
// Import the custom input guardrail agent
import { inputGuardrailAgent } from '../agents/inputGuardrail';

// Define the userRouter with available user-related API procedures
export const userRouter = router({
  // Procedure to get a user by their email address
  getUserByEmail: publicProcedure
    .input(z.string().email()) // Validate input as an email string
    .query(async ({ input }) => {
      // Query the database for a user with the given email
      return prisma.user.findUnique({
        where: { email: input },
      });
    }),

  // Procedure to handle sending a message and running it through a guardrail agent
  sendMessage: publicProcedure
    .input(z.object({ message: z.string() })) // Validate input as an object with a string message
    .mutation(async ({ input }) => {
      // Run the input message through the guardrail agent
      const guardrailResult = await Runner.run(inputGuardrailAgent, input.message);
      
      // Determine the reply based on the guardrail agent's output
      const reply =
        guardrailResult.finalOutput === 'ROUTE'
          ? 'Message is finance-related ✅'
          : 'Sorry, this message is not finance-related ❌';

      // Return the reply to the client
      return { reply };
    }),
});