import { NextRequest, NextResponse } from 'next/server';
import { openai, AI_MODEL } from '@/lib/openai/client';
import { GOAL_BREAKDOWN_PROMPT, generateGoalBreakdownPrompt } from '@/lib/openai/prompts';

// Configure the route for Netlify
export const runtime = 'nodejs';
export const maxDuration = 10; // Maximum allowed on free tier

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

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return NextResponse.json(
        { error: 'AI service is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    console.log('Starting AI goal breakdown request...');
    console.log('Goal:', goal);
    console.log('Model:', AI_MODEL);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

    try {
      const completion = await openai.chat.completions.create({
        model: AI_MODEL,
        messages: [
          { role: 'system', content: GOAL_BREAKDOWN_PROMPT },
          { role: 'user', content: generateGoalBreakdownPrompt(goal, context) },
        ],
        temperature: 0.5,
        max_tokens: 800, // Slightly increased for better responses
        response_format: { type: 'json_object' },
      }, {
        signal: controller.signal as any,
      });

      clearTimeout(timeoutId);

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response from AI');
      }

      console.log('AI response received, parsing...');
      const breakdown = JSON.parse(responseContent);

      return NextResponse.json({ breakdown });
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error('Request timed out');
        return NextResponse.json(
          { error: 'Request timed out. Please try a shorter goal description.' },
          { status: 408 }
        );
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error('Error in breakdown-goal:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { error: error.message || 'Failed to generate goal breakdown' },
      { status: 500 }
    );
  }
}

