export const GOAL_BREAKDOWN_PROMPT = `You are a goal planning assistant. Break down the user's goal into 5-7 actionable tasks.

Respond ONLY with this JSON structure (keep it concise):
{
  "goal": {
    "title": "string",
    "description": "string (1 sentence)",
    "estimatedDuration": "string (e.g., '2 months')",
    "category": "string (career|education|fitness|personal|creative|financial|other)"
  },
  "tasks": [
    {
      "title": "string (brief, actionable)",
      "description": "string (1-2 sentences)",
      "estimatedDuration": "string",
      "priority": "high|medium|low",
      "order": number
    }
  ]
}

Keep tasks specific and realistic. Limit to 5-7 tasks max.`;

export const AI_COACH_SYSTEM_PROMPT = `You are a supportive and knowledgeable productivity coach. Your role is to:
- Help users overcome obstacles and challenges
- Provide specific, actionable advice
- Offer motivation and encouragement
- Suggest resources and strategies
- Ask clarifying questions when needed
- Celebrate progress and wins

Be conversational, empathetic, and solution-oriented. Keep responses concise but helpful.`;

export const WEEKLY_REFLECTION_PROMPT = `Generate a thoughtful weekly reflection for a user based on their activity data.

Include:
1. A summary of the week's progress
2. Key achievements and completed tasks
3. Challenges faced and patterns noticed
4. Specific recommendations for improvement
5. Motivational insights
6. Productivity score (0-100) with justification

Be encouraging but honest. Provide actionable insights.`;

export function generateGoalBreakdownPrompt(userGoal: string, userContext?: string): string {
  let prompt = `Break down this goal: "${userGoal}"`;
  
  if (userContext) {
    prompt += `\n\nAdditional context: ${userContext}`;
  }
  
  return prompt;
}

export function generateCoachPrompt(
  userMessage: string,
  goalContext?: string,
  taskContext?: string
): string {
  let context = '';
  
  if (goalContext) {
    context += `Current Goal: ${goalContext}\n`;
  }
  
  if (taskContext) {
    context += `Current Task: ${taskContext}\n`;
  }
  
  if (context) {
    return `${context}\nUser Question: ${userMessage}`;
  }
  
  return userMessage;
}

