import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '../prisma';
import { Runner } from 'openai-agents-js';
import { inputGuardrailAgent } from '../agents/inputGuardrail';
import { orchestratorAgent } from '../agents/orchestrator';
import { dbAgent } from '../agents/dbAgent';

const CURRENT_USER_EMAIL = 'alice@example.com';

export const userRouter = router({
  getUserByEmail: publicProcedure
    .input(z.string().email())
    .query(async ({ input }) => {
      return prisma.user.findUnique({
        where: { email: input },
      });
    }),

  sendMessage: publicProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const guardrailResult = await Runner.run(inputGuardrailAgent, input.message);

        if (guardrailResult.finalOutput === 'REJECT') {
          return { reply: 'Sorry, this message is not finance-related ❌' };
        }

        const orchestration = await Runner.run(orchestratorAgent, input.message);
        const route = orchestration.finalOutput;

        let reply: string;

        if (route === 'DB') {
          const dbResponse = await Runner.run(dbAgent as any, JSON.stringify({ email: CURRENT_USER_EMAIL }));
          reply = dbResponse.finalOutput;
        } else if (route === 'FINANCE') {
          reply = '📚 Routed to Finance Agent (to be implemented)';
        } else {
          reply = '⚠️ Unknown routing decision.';
        }

        return { reply };
      } catch (error) {
        console.error('sendMessage error:', error);
        return { reply: 'Oops! Something went wrong.' };
      }
    }),
});
