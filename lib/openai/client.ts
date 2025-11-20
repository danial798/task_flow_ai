import OpenAI from 'openai';

// Initialize OpenAI client (will use API key from environment)
// The API key check is handled in the route to provide better error messages
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'placeholder-key-for-build',
});

// Use gpt-4o-mini for faster responses and lower costs (perfect for goal breakdown)
// Can switch to 'gpt-4o' or 'gpt-4-turbo' for more complex tasks if needed
export const AI_MODEL = 'gpt-4o-mini';

