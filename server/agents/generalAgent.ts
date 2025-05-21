import { Agent } from 'openai-agents-js';

export const generalAgent = new Agent({
  name: 'GeneralAgent',
  instructions: `
You are a helpful general-purpose assistant. Answer user questions clearly and respectfully.
Avoid giving financial, legal, or medical advice.`,
  model: 'gpt-3.5-turbo',
});
