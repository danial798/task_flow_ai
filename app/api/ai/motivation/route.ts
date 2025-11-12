import { NextRequest, NextResponse } from 'next/server';
import { generateMotivationMessage } from '@/lib/ai-intelligence';

export async function POST(req: NextRequest) {
  try {
    const { tasksToday, completedToday, streakDays, upcomingMilestones } = await req.json();

    const message = generateMotivationMessage(
      tasksToday || 0,
      completedToday || 0,
      streakDays || 0,
      upcomingMilestones || 0
    );

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Generate motivation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate motivation message' },
      { status: 500 }
    );
  }
}

