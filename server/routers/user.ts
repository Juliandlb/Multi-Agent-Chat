import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '../prisma';
import { Runner } from 'openai-agents-js';
import { inputGuardrailAgent } from '../agents/inputGuardrail';
import { orchestratorAgent } from '../agents/orchestrator';
import { dbAgent } from '../agents/dbAgent';
import { financeAgent } from '../agents/financeAgent';
import { generalAgent } from '../agents/generalAgent';

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
      const trace: string[] = [];
      try {
        trace.push('InputGuardrail');
        const guardrailResult = await Runner.run(inputGuardrailAgent, input.message);

        if (guardrailResult.finalOutput === 'REJECT') {
          trace.push('GeneralAgent');
          const generalResponse = await Runner.run(generalAgent as any, input.message);
          return { reply: generalResponse.finalOutput, trace };
        }

        trace.push('Orchestrator');
        const orchestration = await Runner.run(orchestratorAgent, input.message);
        const route = orchestration.finalOutput;

        let reply: string;

        if (route === 'DB') {
          trace.push('DBAgent');
          const dbResponse = await Runner.run(dbAgent as any, JSON.stringify({ email: CURRENT_USER_EMAIL }));
          reply = dbResponse.finalOutput;
        } else if (route === 'FINANCE') {
          trace.push('FinanceAgent');
          const financeResponse = await Runner.run(financeAgent as any, input.message);
          reply = financeResponse.finalOutput;
        } else {
          reply = '⚠️ Unknown routing decision.';
        }

        return { reply, trace };
      } catch (error) {
        console.error('sendMessage error:', error);
        return { reply: 'Oops! Something went wrong.', trace };
      }
    }),
});
