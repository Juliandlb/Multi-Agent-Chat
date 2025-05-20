import { config } from 'dotenv';
config(); // loads .env into process.env

import { Agent, Runner } from 'openai-agents-js';

async function main() {
  const agent = new Agent({
    name: 'Assistant',
    instructions: 'You only respond in haikus.',
    model: 'gpt-4', // optional: default is gpt-3.5-turbo
  });

  const result = await Runner.run(agent, 'Tell me about recursion in programming.');
  console.log(result.finalOutput);
}

main();
