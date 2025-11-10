import { NextRequest, NextResponse } from 'next/server';
import { updateTaskAdmin } from '@/lib/firebase/firestore-admin';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const body = await request.json();
    const { userId, goalId, progressNote, ...updates } = body;

    if (!userId || !goalId) {
      return NextResponse.json(
        { error: 'User ID and Goal ID are required' },
        { status: 400 }
      );
    }

    // Update task
    await updateTaskAdmin(userId, goalId, params.taskId, updates);

    // TODO: Add progress log functionality if needed
    if (progressNote) {
      console.log('Progress note:', progressNote);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update task' },
      { status: 500 }
    );
  }
}

