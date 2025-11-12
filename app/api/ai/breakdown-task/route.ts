import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { taskTitle, taskDescription, goalContext } = await req.json();

    if (!taskTitle) {
      return NextResponse.json(
        { error: 'Task title is required' },
        { status: 400 }
      );
    }

    const prompt = `You are an AI task breakdown assistant. A user has a vague or large task that needs to be broken down into concrete, actionable subtasks.

Task Title: "${taskTitle}"
${taskDescription ? `Task Description: "${taskDescription}"` : ''}
${goalContext ? `Goal Context: "${goalContext}"` : ''}

Break this task down into 3-6 concrete, actionable subtasks. Each subtask should be:
- Specific and clear
- Completable in 30 minutes to 2 hours
- Written as an action statement (verb first)

Respond with JSON in this exact format:
{
  "refinedTitle": "A clearer, more specific version of the task title",
  "refinedDescription": "A brief description of what this task accomplishes",
  "subtasks": [
    "Specific action 1",
    "Specific action 2",
    "Specific action 3"
  ],
  "estimatedDuration": "total time estimate (e.g., '3 hours', '1 day')",
  "tips": ["helpful tip 1", "helpful tip 2"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert task breakdown assistant. Always respond with valid JSON only.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const breakdown = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json({ breakdown });
  } catch (error) {
    console.error('Task breakdown error:', error);
    return NextResponse.json(
      { error: 'Failed to break down task' },
      { status: 500 }
    );
  }
}

