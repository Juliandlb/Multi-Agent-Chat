// Import dotenv to load environment variables from .env file
import { config } from 'dotenv';
config(); // loads .env into process.env

// Import the Agent class from openai-agents-js
import { Agent } from 'openai-agents-js';

// Create and export an instance of Agent for input guardrail classification
export const inputGuardrailAgent = new Agent({
  name: 'InputGuardrail', // Name of the agent
  instructions: `
You are a classifier. Your job is to decide if a user's message is related to finance.

Respond ONLY with:
- "ROUTE" if it's finance-related
- "REJECT" if it's not
Do not include any other words or punctuation.
  `, // Instructions for the agent to follow
  model: 'gpt-3.5-turbo', // OpenAI model to use
});