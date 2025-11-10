import { NextRequest, NextResponse } from 'next/server';
import { openai, AI_MODEL } from '@/lib/openai/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goal, userReflections } = body;

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal is required' },
        { status: 400 }
      );
    }

    const prompt = `You are a productivity coach analyzing a completed goal. 

Goal: "${goal.title}"
Description: ${goal.description}
Tasks Completed: ${goal.tasks?.filter((t: any) => t.status === 'completed').length || 0} out of ${goal.tasks?.length || 0}

User's Reflections:
- What went well: ${userReflections.wentWell || 'Not provided'}
- Challenges: ${userReflections.challenges || 'Not provided'}
- Improvements: ${userReflections.improvements || 'Not provided'}

Based on this information, provide 3 specific, actionable recommendations for future goals. Be encouraging but practical.

Respond in JSON format:
{
  "recommendation1": "string",
  "recommendation2": "string",
  "recommendation3": "string"
}`;

    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: 'You are a supportive productivity coach providing constructive feedback.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const responseContent = completion.choices[0].message.content;
    if (!responseContent) {
      throw new Error('No response from AI');
    }

    const insights = JSON.parse(responseContent);

    return NextResponse.json({ insights });
  } catch (error: any) {
    console.error('Error in retrospective:', error);
    // Return generic insights if AI fails
    return NextResponse.json({
      insights: {
        recommendation1: 'Continue breaking down large goals into smaller, manageable tasks.',
        recommendation2: 'Celebrate milestones along the way to maintain motivation.',
        recommendation3: 'Review your progress weekly and adjust timelines as needed.',
      }
    });
  }
}

