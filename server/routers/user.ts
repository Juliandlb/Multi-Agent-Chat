import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { prisma } from '../prisma';
import { Runner } from 'openai-agents-js';
import { inputGuardrailAgent } from '../agents/inputGuardrail';
import { orchestratorAgent } from '../agents/orchestrator';
import { dbAgent } from '../agents/dbAgent';
import { financeAgent } from '../agents/financeAgent';
import { generalAgent } from '../agents/generalAgent';

// Define the userRouter with user-related procedures
export const userRouter = router({
  // Procedure to get a user by email
  getUserByEmail: publicProcedure
    .input(z.string().email())
    .query(async ({ input }) => {
      return prisma.user.findUnique({
        where: { email: input },
      });
    }),

  // Procedure to send a message and get an agent response
  sendMessage: publicProcedure
    .input(z.object({ message: z.string(), email: z.string().email() }))
    .mutation(async ({ input }) => {
      const trace: string[] = [];
      try {
        // Step 1: Input guardrail agent
        trace.push('InputGuardrail');
        const guardrailResult = await Runner.run(inputGuardrailAgent, input.message);

        // If rejected, use the general agent for a fallback response
        if (guardrailResult.finalOutput === 'REJECT') {
          trace.push('GeneralAgent');
          const generalResponse = await Runner.run(generalAgent as any, input.message);
          return { reply: generalResponse.finalOutput, trace };
        }

        // Step 2: Orchestrator agent decides routing
        trace.push('Orchestrator');
        const orchestration = await Runner.run(orchestratorAgent, input.message);
        const route = orchestration.finalOutput;

        let reply: string;

        // Step 3: Route to the appropriate agent
        if (route === 'DB') {
          trace.push('DBAgent');
          const dbResponse = await Runner.run(dbAgent as any, JSON.stringify({ email: input.email }));
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
        // Handle errors and return a fallback message
        console.error('sendMessage error:', error);
        return { reply: 'Oops! Something went wrong.', trace };
      }
    }),

  // Procedure to get all user emails
  getAllEmails: publicProcedure.query(async () => {
    const users = await prisma.user.findMany({ select: { email: true } });
    return users.map(u => u.email);
  }),
});
