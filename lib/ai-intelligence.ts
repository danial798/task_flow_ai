/**
 * AI Intelligence Layer
 * Powers adaptive learning, priority scoring, and intelligent insights
 */

import { 
  Goal, 
  Task, 
  TaskCompletionStats, 
  UserPreferences, 
  TaskPriorityScore, 
  AIInsight 
} from '@/types';

// ===== ADAPTIVE LEARNING =====

/**
 * Extracts task type from title using simple keyword matching
 */
export function extractTaskType(title: string): string {
  const keywords = {
    design: ['design', 'ui', 'ux', 'mockup', 'prototype', 'wireframe'],
    coding: ['code', 'develop', 'implement', 'build', 'program', 'api'],
    research: ['research', 'study', 'learn', 'investigate', 'explore', 'analyze'],
    writing: ['write', 'document', 'blog', 'article', 'content', 'draft'],
    planning: ['plan', 'strategy', 'roadmap', 'outline', 'organize'],
    testing: ['test', 'qa', 'debug', 'fix', 'validate', 'verify'],
    meeting: ['meeting', 'call', 'discussion', 'sync', 'standup'],
  };

  const lowerTitle = title.toLowerCase();
  
  for (const [type, words] of Object.entries(keywords)) {
    if (words.some(word => lowerTitle.includes(word))) {
      return type;
    }
  }
  
  return 'general';
}

/**
 * Calculate duration in minutes from string (e.g., "2 hours", "30 minutes")
 */
export function parseDuration(duration: string): number {
  const hourMatch = duration.match(/(\d+)\s*h/i);
  const minuteMatch = duration.match(/(\d+)\s*m/i);
  const dayMatch = duration.match(/(\d+)\s*d/i);
  
  let minutes = 0;
  if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
  if (minuteMatch) minutes += parseInt(minuteMatch[1]);
  if (dayMatch) minutes += parseInt(dayMatch[1]) * 8 * 60; // assume 8hr workday
  
  return minutes || 60; // default 1 hour
}

/**
 * Update user preferences based on new completion data
 */
export function updateUserPreferences(
  currentPrefs: UserPreferences,
  newStats: TaskCompletionStats
): UserPreferences {
  // Update category performance
  const categoryPerf = currentPrefs.categoryPerformance[newStats.category] || {
    completionRate: 0,
    averageSpeed: 1.0,
  };

  const speedRatio = newStats.actualDuration / newStats.estimatedDuration;
  categoryPerf.averageSpeed = (categoryPerf.averageSpeed + speedRatio) / 2;
  categoryPerf.completionRate = newStats.skipped ? categoryPerf.completionRate * 0.95 : categoryPerf.completionRate * 0.95 + 5;

  // Update task type performance
  const taskTypePerf = currentPrefs.taskTypePerformance[newStats.taskType] || {
    completionRate: 0,
    averageSpeed: 1.0,
  };

  taskTypePerf.averageSpeed = (taskTypePerf.averageSpeed + speedRatio) / 2;
  taskTypePerf.completionRate = newStats.skipped ? taskTypePerf.completionRate * 0.95 : taskTypePerf.completionRate * 0.95 + 5;

  return {
    ...currentPrefs,
    categoryPerformance: {
      ...currentPrefs.categoryPerformance,
      [newStats.category]: categoryPerf,
    },
    taskTypePerformance: {
      ...currentPrefs.taskTypePerformance,
      [newStats.taskType]: taskTypePerf,
    },
    averageTaskDuration: (currentPrefs.averageTaskDuration + newStats.actualDuration) / 2,
    lastUpdated: new Date(),
  };
}

/**
 * Adjust task estimate based on user's historical performance
 */
export function adjustTaskEstimate(
  task: Task,
  userPrefs: UserPreferences,
  goalCategory: string
): string {
  const taskType = extractTaskType(task.title);
  const estimatedMinutes = parseDuration(task.estimatedDuration || '1 hour');

  // Get performance multipliers
  const categorySpeed = userPrefs.categoryPerformance[goalCategory]?.averageSpeed || 1.0;
  const taskTypeSpeed = userPrefs.taskTypePerformance[taskType]?.averageSpeed || 1.0;

  // Average the two speeds
  const adjustmentFactor = (categorySpeed + taskTypeSpeed) / 2;

  // Adjust estimate
  const adjustedMinutes = Math.round(estimatedMinutes * adjustmentFactor);

  // Format back to string
  if (adjustedMinutes < 60) {
    return `${adjustedMinutes} minutes`;
  } else {
    const hours = Math.round(adjustedMinutes / 60 * 10) / 10;
    return `${hours} hours`;
  }
}

// ===== PRIORITY SCORING =====

/**
 * Calculate intelligent priority score for a task
 */
export function calculatePriorityScore(
  task: Task,
  goal: Goal,
  allTasks: Task[],
  userPrefs: UserPreferences
): TaskPriorityScore {
  const now = new Date();
  
  // 1. URGENCY (0-10): How soon is it due?
  let urgency = 5;
  if (task.dueDate) {
    const daysUntilDue = Math.ceil((new Date(task.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilDue < 0) urgency = 10; // overdue
    else if (daysUntilDue < 2) urgency = 9;
    else if (daysUntilDue < 7) urgency = 7;
    else if (daysUntilDue < 14) urgency = 5;
    else urgency = 3;
  }

  // 2. IMPORTANCE (0-10): Based on goal priority and task priority
  const goalPriorityMap = { low: 3, medium: 6, high: 9 };
  const taskPriorityMap = { low: 3, medium: 6, high: 9 };
  const importance = Math.round((goalPriorityMap[goal.priority] + taskPriorityMap[task.priority]) / 2);

  // 3. IMPACT (0-10): How many other tasks depend on this?
  const dependentTasks = allTasks.filter(t => t.dependencies?.includes(task.id));
  const impact = Math.min(10, dependentTasks.length * 2 + 4);

  // 4. EFFORT (0-10): Estimated difficulty (inverse - easier = higher score)
  const estimatedMinutes = parseDuration(task.estimatedDuration || '1 hour');
  const effort = 10 - Math.min(10, Math.floor(estimatedMinutes / 60)); // longer = lower score

  // 5. USER PREFERENCE (0-10): Based on past completion rates
  const taskType = extractTaskType(task.title);
  const taskTypePerf = userPrefs.taskTypePerformance[taskType];
  const userPreference = taskTypePerf ? Math.round(taskTypePerf.completionRate / 10) : 5;

  // Calculate weighted score (0-100)
  const weights = {
    urgency: 0.3,
    importance: 0.3,
    impact: 0.2,
    effort: 0.1,
    userPreference: 0.1,
  };

  const score = Math.round(
    urgency * weights.urgency * 10 +
    importance * weights.importance * 10 +
    impact * weights.impact * 10 +
    effort * weights.effort * 10 +
    userPreference * weights.userPreference * 10
  );

  // Generate recommendation
  let recommendation = '';
  if (score >= 80) recommendation = '🔥 Critical! Do this ASAP';
  else if (score >= 65) recommendation = '⚡ High priority - schedule today';
  else if (score >= 50) recommendation = '📌 Important - complete this week';
  else if (score >= 35) recommendation = '📋 Medium priority - plan ahead';
  else recommendation = '💡 Low priority - when you have time';

  return {
    taskId: task.id,
    score,
    factors: {
      urgency,
      importance,
      impact,
      effort,
      userPreference,
    },
    recommendation,
    calculatedAt: now,
  };
}

// ===== PROGRESS INTELLIGENCE =====

/**
 * Detect bottlenecks and generate insights
 */
export function detectBottlenecks(
  goals: Goal[],
  completionStats: TaskCompletionStats[],
  userPrefs: UserPreferences
): AIInsight[] {
  const insights: AIInsight[] = [];
  const now = new Date();

  // 1. Detect task types with low completion rates
  for (const [taskType, perf] of Object.entries(userPrefs.taskTypePerformance)) {
    if (perf.completionRate < 50) {
      insights.push({
        id: `bottleneck-${taskType}-${Date.now()}`,
        userId: userPrefs.userId,
        type: 'bottleneck',
        severity: 'high',
        title: `Low completion rate for ${taskType} tasks`,
        description: `You complete only ${Math.round(perf.completionRate)}% of ${taskType} tasks. Consider breaking them into smaller pieces.`,
        actionable: true,
        suggestedAction: `Break your next ${taskType} task into 2-3 smaller subtasks`,
        createdAt: now,
        dismissed: false,
      });
    }
  }

  // 2. Detect categories with slow progress
  for (const [category, perf] of Object.entries(userPrefs.categoryPerformance)) {
    if (perf.averageSpeed > 1.5) {
      insights.push({
        id: `bottleneck-${category}-${Date.now()}`,
        userId: userPrefs.userId,
        type: 'pattern',
        severity: 'medium',
        title: `${category} tasks take longer than expected`,
        description: `Your ${category} tasks take ${Math.round(perf.averageSpeed * 100)}% of estimated time. Your estimates might be too optimistic.`,
        actionable: true,
        suggestedAction: `Increase time estimates for ${category} tasks by ${Math.round((perf.averageSpeed - 1) * 100)}%`,
        createdAt: now,
        dismissed: false,
      });
    }
  }

  // 3. Detect categories with fast completion (positive insight!)
  for (const [category, perf] of Object.entries(userPrefs.categoryPerformance)) {
    if (perf.averageSpeed < 0.7 && perf.completionRate > 80) {
      insights.push({
        id: `achievement-${category}-${Date.now()}`,
        userId: userPrefs.userId,
        type: 'achievement',
        severity: 'low',
        title: `You excel at ${category} tasks! 🌟`,
        description: `You complete ${category} tasks ${Math.round((1 - perf.averageSpeed) * 100)}% faster than estimated with a ${Math.round(perf.completionRate)}% completion rate.`,
        actionable: false,
        createdAt: now,
        dismissed: false,
      });
    }
  }

  // 4. Detect overdue tasks
  const overdueTasks = goals.flatMap(g => 
    (g.tasks || []).filter(t => 
      t.status !== 'completed' && 
      t.dueDate && 
      new Date(t.dueDate) < now
    )
  );

  if (overdueTasks.length > 3) {
    insights.push({
      id: `warning-overdue-${Date.now()}`,
      userId: userPrefs.userId,
      type: 'warning',
      severity: 'high',
      title: `${overdueTasks.length} tasks are overdue`,
      description: 'You have multiple overdue tasks. Consider re-prioritizing or adjusting deadlines.',
      actionable: true,
      suggestedAction: 'Review and reschedule overdue tasks',
      createdAt: now,
      dismissed: false,
    });
  }

  // 5. Detect stalled goals
  const stalledGoals = goals.filter(g => 
    g.status === 'in-progress' && 
    g.tasks && 
    g.tasks.filter(t => t.status === 'completed').length === 0 &&
    new Date(g.updatedAt).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000 // no progress in 7 days
  );

  if (stalledGoals.length > 0) {
    insights.push({
      id: `warning-stalled-${Date.now()}`,
      userId: userPrefs.userId,
      type: 'warning',
      severity: 'medium',
      title: `${stalledGoals.length} goal(s) have stalled`,
      description: 'Some goals haven\'t made progress in over a week. Consider breaking them down or adjusting scope.',
      actionable: true,
      suggestedAction: 'Review stalled goals and create action plan',
      relatedGoalId: stalledGoals[0].id,
      createdAt: now,
      dismissed: false,
    });
  }

  return insights;
}

// ===== TIMELINE ADJUSTMENT =====

/**
 * Dynamically adjust task deadlines based on performance
 */
export function adjustTaskDeadline(
  task: Task,
  userPrefs: UserPreferences,
  goalCategory: string
): Date | undefined {
  if (!task.dueDate) return undefined;

  const taskType = extractTaskType(task.title);
  const categorySpeed = userPrefs.categoryPerformance[goalCategory]?.averageSpeed || 1.0;
  const taskTypeSpeed = userPrefs.taskTypePerformance[taskType]?.averageSpeed || 1.0;

  // If user is consistently slow in this area, extend deadline
  const avgSpeed = (categorySpeed + taskTypeSpeed) / 2;
  
  if (avgSpeed > 1.2) {
    // User is 20%+ slower - extend deadline
    const currentDue = new Date(task.dueDate);
    const estimatedMinutes = parseDuration(task.estimatedDuration || '1 hour');
    const extraDays = Math.ceil((estimatedMinutes * (avgSpeed - 1)) / (60 * 8)); // convert to workdays
    
    currentDue.setDate(currentDue.getDate() + extraDays);
    return currentDue;
  }

  return new Date(task.dueDate);
}

// ===== MOTIVATION GENERATION =====

/**
 * Generate contextual motivation message
 */
export function generateMotivationMessage(
  tasksToday: number,
  completedToday: number,
  streakDays: number,
  upcomingMilestones: number
): string {
  const completionRate = tasksToday > 0 ? (completedToday / tasksToday) * 100 : 0;

  // Streak-based
  if (streakDays > 7) {
    return `🔥 ${streakDays}-day streak! You're unstoppable!`;
  }

  // Progress-based
  if (completionRate >= 80) {
    return `⚡ Amazing! You've crushed ${completionRate.toFixed(0)}% of today's tasks!`;
  } else if (completionRate >= 50) {
    return `💪 Halfway there! ${tasksToday - completedToday} tasks left today!`;
  } else if (completedToday > 0) {
    return `🎯 Great start! Keep the momentum going!`;
  }

  // Milestone-based
  if (upcomingMilestones > 0) {
    return `🎯 ${upcomingMilestones} milestone(s) within reach - let's do this!`;
  }

  // Default encouragement
  const encouragements = [
    '✨ Every small step counts. Let\'s make progress today!',
    '🚀 You\'ve got this! Start with the smallest task.',
    '💡 Focus on one thing at a time. You\'ll be amazed by the results.',
    '🌟 Today is a fresh start. What will you accomplish?',
    '⚡ Small actions, big impact. Begin now!',
  ];

  return encouragements[Math.floor(Math.random() * encouragements.length)];
}

