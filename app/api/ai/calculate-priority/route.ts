import { NextRequest, NextResponse } from 'next/server';
import { calculatePriorityScore } from '@/lib/ai-intelligence';
import { Goal, Task, UserPreferences } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { task, goal, allTasks, userPreferences } = await req.json() as {
      task: Task;
      goal: Goal;
      allTasks: Task[];
      userPreferences: UserPreferences;
    };

    if (!task || !goal) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const priorityScore = calculatePriorityScore(task, goal, allTasks, userPreferences);

    return NextResponse.json({ priorityScore });
  } catch (error) {
    console.error('Calculate priority error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate priority' },
      { status: 500 }
    );
  }
}

