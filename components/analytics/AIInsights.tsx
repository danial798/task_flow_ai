'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, AlertCircle, Target, Clock } from 'lucide-react';
import { Goal } from '@/types';

interface AIInsightsProps {
  goals: Goal[];
}

interface Insight {
  id: string;
  type: 'success' | 'warning' | 'tip' | 'prediction';
  icon: React.ReactNode;
  title: string;
  message: string;
  color: string;
}

export function AIInsights({ goals }: AIInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateInsights();
  }, [goals]);

  const generateInsights = () => {
    const newInsights: Insight[] = [];

    // Calculate metrics
    const activeGoals = goals.filter(g => g.status === 'in-progress' || g.status === 'planning');
    const completedGoals = goals.filter(g => g.status === 'completed');
    const allTasks = goals.flatMap(g => g.tasks || []);
    const completedTasks = allTasks.filter(t => t.status === 'completed').length;
    const totalTasks = allTasks.length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Insight 1: Ahead/Behind Schedule
    activeGoals.forEach(goal => {
      const goalTasks = goal.tasks || [];
      const goalCompletedTasks = goalTasks.filter(t => t.status === 'completed').length;
      const goalProgress = goalTasks.length > 0 ? (goalCompletedTasks / goalTasks.length) * 100 : 0;
      
      const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      const expectedProgress = 100 - (daysLeft / 100) * 100;

      if (goalProgress > expectedProgress + 10) {
        newInsights.push({
          id: `ahead-${goal.id}`,
          type: 'success',
          icon: <TrendingUp className="h-5 w-5" />,
          title: 'You\'re Ahead of Schedule! 🎉',
          message: `"${goal.title}" is ${Math.round(goalProgress - expectedProgress)}% ahead of your expected pace. Keep it up!`,
          color: 'green',
        });
      } else if (goalProgress < expectedProgress - 15 && daysLeft > 0) {
        newInsights.push({
          id: `behind-${goal.id}`,
          type: 'warning',
          icon: <AlertCircle className="h-5 w-5" />,
          title: 'Needs Attention',
          message: `"${goal.title}" is falling behind schedule. Consider breaking tasks into smaller steps or adjusting the timeline.`,
          color: 'orange',
        });
      }
    });

    // Insight 2: Productivity Pattern
    if (completionRate >= 70) {
      newInsights.push({
        id: 'productivity-high',
        type: 'success',
        icon: <Sparkles className="h-5 w-5" />,
        title: 'Excellent Productivity!',
        message: `You've completed ${Math.round(completionRate)}% of your tasks. You're in the top tier of goal achievers!`,
        color: 'green',
      });
    } else if (completionRate < 40 && totalTasks > 5) {
      newInsights.push({
        id: 'productivity-low',
        type: 'tip',
        icon: <Target className="h-5 w-5" />,
        title: 'Boost Your Momentum',
        message: 'Try focusing on just 3 priority tasks today. Small wins build confidence and momentum!',
        color: 'blue',
      });
    }

    // Insight 3: Goal Completion Prediction
    if (activeGoals.length > 0 && completedGoals.length > 0) {
      const avgCompletionDays = completedGoals.reduce((sum, goal) => {
        const created = new Date(goal.createdAt);
        const updated = new Date(goal.updatedAt);
        const days = Math.ceil((updated.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days;
      }, 0) / completedGoals.length;

      activeGoals.forEach(goal => {
        const created = new Date(goal.createdAt);
        const daysElapsed = Math.ceil((new Date().getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
        const progress = goal.completionPercentage || 0;

        if (progress > 10) {
          const estimatedDaysToComplete = (daysElapsed / progress) * (100 - progress);
          const estimatedCompletionDate = new Date();
          estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + estimatedDaysToComplete);

          newInsights.push({
            id: `prediction-${goal.id}`,
            type: 'prediction',
            icon: <Clock className="h-5 w-5" />,
            title: 'Completion Prediction',
            message: `Based on your current pace, "${goal.title}" will likely be completed by ${estimatedCompletionDate.toLocaleDateString()}`,
            color: 'purple',
          });
        }
      });
    }

    // Insight 4: Overload Warning
    const pendingTasks = allTasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
    if (pendingTasks > 20) {
      newInsights.push({
        id: 'overload',
        type: 'warning',
        icon: <AlertCircle className="h-5 w-5" />,
        title: 'Too Many Active Tasks',
        message: `You have ${pendingTasks} pending tasks. Consider pausing some goals or breaking them into phases to avoid burnout.`,
        color: 'red',
      });
    }

    // Insight 5: Streak Recognition
    if (completionRate > 50 && activeGoals.length >= 2) {
      newInsights.push({
        id: 'streak',
        type: 'success',
        icon: <Sparkles className="h-5 w-5" />,
        title: 'You\'re On Fire! 🔥',
        message: `You're maintaining ${activeGoals.length} active goals with a ${Math.round(completionRate)}% completion rate. This consistency will pay off!`,
        color: 'orange',
      });
    }

    setInsights(newInsights.slice(0, 5)); // Show top 5 insights
  };

  const getCardStyle = (color: string) => {
    switch (color) {
      case 'green':
        return 'border-green-200 bg-green-50';
      case 'orange':
        return 'border-orange-200 bg-orange-50';
      case 'red':
        return 'border-red-200 bg-red-50';
      case 'blue':
        return 'border-blue-200 bg-blue-50';
      case 'purple':
        return 'border-purple-200 bg-purple-50';
      default:
        return '';
    }
  };

  const getTextStyle = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-700';
      case 'orange':
        return 'text-orange-700';
      case 'red':
        return 'text-red-700';
      case 'blue':
        return 'text-blue-700';
      case 'purple':
        return 'text-purple-700';
      default:
        return 'text-gray-700';
    }
  };

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">
            Complete more tasks to unlock AI-powered insights about your progress!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Sparkles className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold">AI Insights</h3>
      </div>

      {insights.map((insight) => (
        <Card key={insight.id} className={getCardStyle(insight.color)}>
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className={getTextStyle(insight.color)}>
                {insight.icon}
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-1 ${getTextStyle(insight.color)}`}>
                  {insight.title}
                </h4>
                <p className="text-sm text-gray-700">
                  {insight.message}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

