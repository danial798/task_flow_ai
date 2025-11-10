import { NextRequest, NextResponse } from 'next/server';
import { createGoalAdmin, createTaskAdmin, getUserGoalsAdmin } from '@/lib/firebase/firestore-admin';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 Received request body:', JSON.stringify(body, null, 2));
    const { userId, title, description, category, estimatedDuration, tasks, resources } = body;

    if (!userId || !title) {
      console.error('❌ Missing userId or title');
      return NextResponse.json(
        { error: 'User ID and title are required' },
        { status: 400 }
      );
    }

    console.log('✅ Creating goal for user:', userId);
    // Create the goal
    const goalId = await createGoalAdmin(userId, {
      title,
      description: description || '',
      category: category || 'other',
      status: 'planning',
      priority: 'medium',
      startDate: new Date(),
      targetDate: calculateTargetDate(estimatedDuration),
      estimatedDuration,
      aiGenerated: true,
      completionPercentage: 0,
      tasks: [],
      resources: resources || [],
    });

    // Create tasks if provided
    if (tasks && Array.isArray(tasks)) {
      for (const task of tasks) {
        await createTaskAdmin(userId, goalId, {
          title: task.title,
          description: task.description || '',
          status: 'pending',
          priority: task.priority || 'medium',
          order: task.order || 0,
          progressLogs: [],
          subtasks: task.subtasks?.map((st: string) => ({
            id: nanoid(),
            title: st,
            completed: false,
            createdAt: new Date(),
          })) || [],
          resources: task.resources || [],
        });
      }
    }

    console.log('✅ Goal created successfully:', goalId);
    return NextResponse.json({ goalId, success: true });
  } catch (error: any) {
    console.error('❌ Error creating goal:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: error.message || 'Failed to create goal' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const goals = await getUserGoalsAdmin(userId);
    return NextResponse.json({ goals });
  } catch (error: any) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

function calculateTargetDate(estimatedDuration?: string): Date {
  const now = new Date();
  
  if (!estimatedDuration) {
    // Default to 3 months
    now.setMonth(now.getMonth() + 3);
    return now;
  }

  const duration = estimatedDuration.toLowerCase();
  
  if (duration.includes('week')) {
    const weeks = parseInt(duration) || 4;
    now.setDate(now.getDate() + (weeks * 7));
  } else if (duration.includes('month')) {
    const months = parseInt(duration) || 3;
    now.setMonth(now.getMonth() + months);
  } else if (duration.includes('day')) {
    const days = parseInt(duration) || 30;
    now.setDate(now.getDate() + days);
  } else {
    // Default to 3 months
    now.setMonth(now.getMonth() + 3);
  }

  return now;
}

