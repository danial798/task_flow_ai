import { NextRequest, NextResponse } from 'next/server';
import { openai, AI_MODEL } from '@/lib/openai/client';
import { GOAL_BREAKDOWN_PROMPT, generateGoalBreakdownPrompt } from '@/lib/openai/prompts';

// Netlify configuration
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

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
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'placeholder-key-for-build') {
      console.error('❌ OPENAI_API_KEY is not configured or is placeholder');
      return NextResponse.json(
        { 
          error: 'AI service is not configured. Please set OPENAI_API_KEY in Netlify environment variables.',
          details: 'Missing API key' 
        },
        { status: 503 } // Service unavailable
      );
    }

    console.log('✅ Starting AI goal breakdown request...');
    console.log('Goal:', goal.substring(0, 100) + '...'); // Log first 100 chars only
    console.log('Model:', AI_MODEL);
    console.log('API Key present:', process.env.OPENAI_API_KEY ? 'Yes (starts with ' + process.env.OPENAI_API_KEY.substring(0, 7) + ')' : 'No');

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
        max_tokens: 800,
        response_format: { type: 'json_object' },
      }, {
        signal: controller.signal as any,
      });

      clearTimeout(timeoutId);

      const responseContent = completion.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response from AI');
      }

      console.log('✅ AI response received, parsing...');
      const breakdown = JSON.parse(responseContent);

      return NextResponse.json({ breakdown });
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        console.error('⏱️ Request timed out');
        return NextResponse.json(
          { error: 'Request timed out. Please try a shorter goal description.' },
          { status: 408 }
        );
      }
      
      // Check for specific OpenAI errors
      if (error.status === 401) {
        console.error('🔑 Invalid OpenAI API key');
        return NextResponse.json(
          { 
            error: 'Invalid OpenAI API key. Please check your Netlify environment variables.',
            details: 'Authentication failed' 
          },
          { status: 503 }
        );
      }
      
      if (error.status === 429) {
        console.error('⚠️ Rate limit exceeded');
        return NextResponse.json(
          { error: 'Too many requests. Please wait a moment and try again.' },
          { status: 429 }
        );
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error('❌ Error in breakdown-goal:', error);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      status: error.status,
      type: error.type,
      code: error.code,
    });
    
    // Provide more specific error messages
    let userMessage = 'Failed to generate goal breakdown';
    if (error.message?.includes('fetch')) {
      userMessage = 'Network error. Please check your internet connection.';
    } else if (error.message?.includes('JSON')) {
      userMessage = 'Invalid response from AI. Please try again.';
    } else if (error.message) {
      userMessage = error.message;
    }
    
    return NextResponse.json(
      { 
        error: userMessage,
        details: error.code || error.type || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

