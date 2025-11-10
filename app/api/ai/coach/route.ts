import { NextRequest, NextResponse } from 'next/server';
import { openai, AI_MODEL } from '@/lib/openai/client';
import { AI_COACH_SYSTEM_PROMPT, generateCoachPrompt } from '@/lib/openai/prompts';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, goalContext, taskContext, conversationHistory } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const messages: any[] = [
      { role: 'system', content: AI_COACH_SYSTEM_PROMPT },
    ];

    // Add conversation history if provided
    if (conversationHistory && Array.isArray(conversationHistory)) {
      messages.push(...conversationHistory.slice(-10)); // Keep last 10 messages
    }

    // Add current message with context
    messages.push({
      role: 'user',
      content: generateCoachPrompt(message, goalContext, taskContext),
    });

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages,
      temperature: 0.8,
      max_tokens: 500,
    });

    const responseContent = completion.choices[0].message.content;

    return NextResponse.json({
      message: responseContent,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in AI coach:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get AI response' },
      { status: 500 }
    );
  }
}

