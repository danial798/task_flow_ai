import { NextRequest, NextResponse } from 'next/server';
import { detectBottlenecks } from '@/lib/ai-intelligence';
import { Goal, TaskCompletionStats, UserPreferences } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { goals, completionStats, userPreferences } = await req.json() as {
      goals: Goal[];
      completionStats: TaskCompletionStats[];
      userPreferences: UserPreferences;
    };

    if (!goals || !userPreferences) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const insights = detectBottlenecks(goals, completionStats || [], userPreferences);

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Generate insights error:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}

