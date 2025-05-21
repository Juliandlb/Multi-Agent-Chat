// Import Zod for input validation
import { z } from 'zod';
// Import router and publicProcedure from the tRPC setup
import { router, publicProcedure } from '../trpc';
// Import the Prisma client instance
import { prisma } from '../prisma';
// Import the OpenAI agent runner
import { Runner } from 'openai-agents-js';
// Import the custom agents
import { inputGuardrailAgent } from '../agents/inputGuardrail';
import { orchestratorAgent } from '../agents/orchestrator';

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

  sendMessage: publicProcedure
  .input(z.object({ message: z.string() }))
  .mutation(async ({ input }) => {
    const guardrailResult = await Runner.run(inputGuardrailAgent, input.message);

    if (guardrailResult.finalOutput === 'REJECT') {
      return { reply: 'Sorry, this message is not finance-related ❌' };
    }

    // Route via Orchestrator
    const orchestration = await Runner.run(orchestratorAgent, input.message);
    const route = orchestration.finalOutput;

    const reply =
      route === 'DB'
        ? '⛳ Routed to DB Agent (to be implemented)'
        : route === 'FINANCE'
        ? '📚 Routed to Finance Agent (to be implemented)'
        : '⚠️ Unknown routing decision.';

    return { reply };
  }),
});