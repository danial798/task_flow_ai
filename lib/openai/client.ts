import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Use gpt-4o-mini for faster responses and lower costs (perfect for goal breakdown)
// Can switch to 'gpt-4o' or 'gpt-4-turbo' for more complex tasks if needed
export const AI_MODEL = 'gpt-4o-mini';

