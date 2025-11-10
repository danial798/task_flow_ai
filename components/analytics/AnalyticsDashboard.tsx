'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, CheckCircle2, Clock, Award } from 'lucide-react';
import { Goal } from '@/types';

interface AnalyticsDashboardProps {
  goals: Goal[];
}

export function AnalyticsDashboard({ goals }: AnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState({
    totalGoals: 0,
    completedGoals: 0,
    completionRate: 0,
    totalTasks: 0,
    completedTasks: 0,
    taskCompletionRate: 0,
    avgGoalDuration: 0,
    categoryBreakdown: [] as { name: string; value: number; color: string }[],
    weeklyProgress: [] as { week: string; completed: number }[],
    productivityScore: 0,
  });

  useEffect(() => {
    calculateAnalytics();
  }, [goals]);

  const calculateAnalytics = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const completionRate = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

    const allTasks = goals.flatMap(g => g.tasks || []);
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === 'completed').length;
    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Category breakdown
    const categoryColors: Record<string, string> = {
      career: '#3b82f6',
      education: '#8b5cf6',
      fitness: '#10b981',
      personal: '#f59e0b',
      creative: '#ec4899',
      financial: '#14b8a6',
      spiritual: '#6366f1',
      travel: '#f97316',
      other: '#6b7280',
    };

    const categoryMap = new Map<string, number>();
    goals.forEach(goal => {
      categoryMap.set(goal.category, (categoryMap.get(goal.category) || 0) + 1);
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      color: categoryColors[name] || '#6b7280',
    }));

    // Weekly progress (last 4 weeks)
    const weeklyProgress = Array.from({ length: 4 }, (_, i) => {
      const week = `Week ${i + 1}`;
      const completed = Math.floor(Math.random() * 10); // TODO: Real data
      return { week, completed };
    });

    // Productivity score (0-100)
    const productivityScore = Math.min(
      100,
      Math.round(
        (completionRate * 0.4) + 
        (taskCompletionRate * 0.4) + 
        (completedGoals * 5)
      )
    );

    setAnalytics({
      totalGoals,
      completedGoals,
      completionRate,
      totalTasks,
      completedTasks,
      taskCompletionRate,
      avgGoalDuration: 45, // TODO: Calculate real average
      categoryBreakdown,
      weeklyProgress,
      productivityScore,
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatsCard
          icon={<Target className="h-8 w-8 text-blue-600" />}
          title="Total Goals"
          value={analytics.totalGoals}
          subtitle={`${analytics.completedGoals} completed`}
        />
        <StatsCard
          icon={<CheckCircle2 className="h-8 w-8 text-green-600" />}
          title="Completion Rate"
          value={`${Math.round(analytics.completionRate)}%`}
          subtitle="Goals completed"
        />
        <StatsCard
          icon={<Clock className="h-8 w-8 text-orange-600" />}
          title="Avg Duration"
          value={`${analytics.avgGoalDuration}d`}
          subtitle="Per goal"
        />
        <StatsCard
          icon={<Award className="h-8 w-8 text-purple-600" />}
          title="Productivity"
          value={analytics.productivityScore}
          subtitle="Score"
          highlight={analytics.productivityScore >= 70}
        />
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Progress</CardTitle>
            <CardDescription>Tasks completed per week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Goals by Category</CardTitle>
            <CardDescription>Distribution of your goals</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analytics.categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Task Completion Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Task Completion Trend</CardTitle>
          <CardDescription>Your productivity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Task Completion</span>
              <span className="text-2xl font-bold text-blue-600">
                {Math.round(analytics.taskCompletionRate)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-blue-600 to-purple-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${analytics.taskCompletionRate}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              {analytics.completedTasks} out of {analytics.totalTasks} tasks completed
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatsCard({
  icon,
  title,
  value,
  subtitle,
  highlight = false,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? 'border-green-500 bg-green-50' : ''}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

