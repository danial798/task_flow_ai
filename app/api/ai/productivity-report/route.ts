import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Goal, Task, ProductivityReport } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { userId, goals, weekStart, weekEnd } = await req.json() as {
      userId: string;
      goals: Goal[];
      weekStart: string;
      weekEnd: string;
    };

    if (!userId || !goals) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate statistics
    const allTasks = goals.flatMap(g => g.tasks || []);
    const completedTasks = allTasks.filter(t => t.status === 'completed');
    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekEnd);

    const tasksCompletedThisWeek = completedTasks.filter(t => {
      const completedDate = new Date(t.updatedAt);
      return completedDate >= weekStartDate && completedDate <= weekEndDate;
    });

    const tasksCreated = allTasks.filter(t => {
      const createdDate = new Date(t.createdAt);
      return createdDate >= weekStartDate && createdDate <= weekEndDate;
    }).length;

    const goalsActive = goals.filter(g => g.status === 'in-progress').length;
    const goalsCompleted = goals.filter(g => {
      const completedDate = new Date(g.updatedAt);
      return g.status === 'completed' && completedDate >= weekStartDate && completedDate <= weekEndDate;
    }).length;

    const completionRate = allTasks.length > 0 ? (completedTasks.length / allTasks.length) * 100 : 0;

    // Calculate on-time rate
    const tasksWithDueDate = completedTasks.filter(t => t.dueDate);
    const onTimeRate = tasksWithDueDate.length > 0
      ? (tasksWithDueDate.filter(t => new Date(t.updatedAt) <= new Date(t.dueDate!)).length / tasksWithDueDate.length) * 100
      : 100;

    // Find top category
    const categoryCount: { [key: string]: number } = {};
    goals.forEach(g => {
      categoryCount[g.category] = (categoryCount[g.category] || 0) + 1;
    });
    const topCategory = Object.entries(categoryCount).sort(([, a], [, b]) => b - a)[0]?.[0] || 'none';

    // Identify bottlenecks
    const bottlenecks: string[] = [];
    const blockedTasks = allTasks.filter(t => t.status === 'blocked');
    if (blockedTasks.length > 2) {
      bottlenecks.push(`${blockedTasks.length} tasks are blocked`);
    }

    const overdueTasks = allTasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed');
    if (overdueTasks.length > 2) {
      bottlenecks.push(`${overdueTasks.length} tasks overdue`);
    }

    // Generate AI summary
    const prompt = `Generate a motivational and insightful weekly productivity summary for a user.

Week: ${weekStart} to ${weekEnd}

Statistics:
- Tasks created: ${tasksCreated}
- Tasks completed: ${tasksCompletedThisWeek.length}
- Active goals: ${goalsActive}
- Goals completed: ${goalsCompleted}
- Overall completion rate: ${completionRate.toFixed(1)}%
- On-time completion rate: ${onTimeRate.toFixed(1)}%
- Top category: ${topCategory}
- Bottlenecks: ${bottlenecks.length > 0 ? bottlenecks.join(', ') : 'None identified'}

Generate:
1. A 2-3 sentence motivational summary of their week
2. 3 specific insights about their productivity patterns
3. 3 actionable recommendations for improvement

Respond with JSON:
{
  "summary": "motivational summary",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an AI productivity coach. Be encouraging, specific, and actionable. Respond only with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' },
    });

    const aiResponse = JSON.parse(completion.choices[0].message.content || '{}');

    const report: ProductivityReport = {
      id: `report-${Date.now()}`,
      userId,
      weekStart: weekStartDate,
      weekEnd: weekEndDate,
      tasksCreated,
      tasksCompleted: tasksCompletedThisWeek.length,
      goalsActive,
      goalsCompleted,
      focusTimeTotal: 0, // TODO: Track from focus sessions
      completionRate,
      onTimeRate,
      streakDays: 0, // TODO: Calculate from completion history
      insights: aiResponse.insights || [],
      recommendations: aiResponse.recommendations || [],
      topCategory,
      bottleneckAreas: bottlenecks,
      aiSummary: aiResponse.summary || 'Keep up the great work!',
      generatedAt: new Date(),
    };

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Generate productivity report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

