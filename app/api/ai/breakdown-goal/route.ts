import { NextRequest, NextResponse } from 'next/server';
import { openai, AI_MODEL } from '@/lib/openai/client';
import { GOAL_BREAKDOWN_PROMPT, generateGoalBreakdownPrompt } from '@/lib/openai/prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goal, context } = body;

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: GOAL_BREAKDOWN_PROMPT },
        { role: 'user', content: generateGoalBreakdownPrompt(goal, context) },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('No response from AI');
    }

    const breakdown = JSON.parse(responseContent);

    return NextResponse.json({ breakdown });
  } catch (error: any) {
    console.error('Error in breakdown-goal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate goal breakdown' },
      { status: 500 }
    );
  }
}

