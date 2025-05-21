import { Agent, FunctionTool } from 'openai-agents-js';
import { prisma } from '../prisma';

const getUserProfile = new FunctionTool({
  name: 'getUserProfile',
  description: 'Fetch a user by email and return their name and profile.',
  params_json_schema: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        description: 'Email address of the user',
      },
    },
    required: ['email'],
  },
  on_invoke_tool: async ({ input }) => {
    try {
      const { email } = JSON.parse(input); // 🔥 Parse string to object
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return `User with email ${email} not found.`;
      return `User: ${user.name}. Profile: ${user.profile ?? 'No profile.'}`;
    } catch {
      return 'Invalid input format. Please pass JSON with an "email" field.';
    }
  },
});

export const dbAgent = new Agent({
  name: 'DBAgent',
  instructions: `
You help with user-specific information from our database. Use the getUserProfile tool to retrieve data.
Never make up information. Always call getUserProfile.`,
  tools: [getUserProfile],
  model: 'gpt-3.5-turbo',
});
