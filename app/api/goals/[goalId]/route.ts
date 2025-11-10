import { NextRequest, NextResponse } from 'next/server';
import { getGoalAdmin, updateGoalAdmin, deleteGoalAdmin, getGoalTasksAdmin } from '@/lib/firebase/firestore-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { goalId: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const goal = await getGoalAdmin(userId, params.goalId);
    
    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    // Fetch tasks for this goal
    const tasks = await getGoalTasksAdmin(userId, params.goalId);
    goal.tasks = tasks;

    return NextResponse.json({ goal });
  } catch (error: any) {
    console.error('Error fetching goal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch goal' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { goalId: string } }
) {
  try {
    const body = await request.json();
    const { userId, ...updates } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await updateGoalAdmin(userId, params.goalId, updates);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating goal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update goal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { goalId: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await deleteGoalAdmin(userId, params.goalId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting goal:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete goal' },
      { status: 500 }
    );
  }
}

