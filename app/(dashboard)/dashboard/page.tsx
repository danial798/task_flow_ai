'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { subscribeToUserGoals, subscribeToGoalTasks } from '@/lib/firebase/firestore';
import { Goal } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, TrendingUp, ListTodo, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { CreateGoalDialog } from '@/components/goals/CreateGoalDialog';

export default function DashboardPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribers: (() => void)[] = [];
    
    // Subscribe to goals
    const goalsUnsubscribe = subscribeToUserGoals(user.uid, (updatedGoals) => {
      setGoals(updatedGoals);
      setLoading(false);

      // Clean up old task listeners
      unsubscribers.forEach(unsub => unsub());
      unsubscribers.length = 0;

      // Subscribe to tasks for each goal
      updatedGoals.forEach(goal => {
        const taskUnsubscribe = subscribeToGoalTasks(user.uid, goal.id, (tasks) => {
          setGoals(prevGoals => 
            prevGoals.map(g => 
              g.id === goal.id ? { ...g, tasks } : g
            )
          );
        });
        unsubscribers.push(taskUnsubscribe);
      });
    });

    // Cleanup all subscriptions on unmount
    return () => {
      goalsUnsubscribe();
      unsubscribers.forEach(unsub => unsub());
    };
  }, [user]);

  const activeGoals = goals.filter(g => g.status === 'in-progress' || g.status === 'planning');
  const completedGoals = goals.filter(g => g.status === 'completed');
  const totalTasks = goals.reduce((sum, g) => sum + (g.tasks?.length || 0), 0);
  const completedTasks = goals.reduce((sum, g) => 
    sum + (g.tasks?.filter(t => t.status === 'completed')?.length || 0), 0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your progress and achieve your goals</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard
          icon={<Target className="h-8 w-8 text-blue-600" />}
          title="Active Goals"
          value={activeGoals.length}
          color="blue"
        />
        <StatCard
          icon={<CheckCircle2 className="h-8 w-8 text-green-600" />}
          title="Completed Goals"
          value={completedGoals.length}
          color="green"
        />
        <StatCard
          icon={<ListTodo className="h-8 w-8 text-purple-600" />}
          title="Total Tasks"
          value={totalTasks}
          color="purple"
        />
        <StatCard
          icon={<TrendingUp className="h-8 w-8 text-orange-600" />}
          title="Tasks Completed"
          value={`${completedTasks}/${totalTasks}`}
          color="orange"
        />
      </div>

      {/* Active Goals */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Active Goals</h2>
        {activeGoals.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No active goals yet</h3>
              <p className="text-gray-600 mb-4">Create your first goal and let AI help you achieve it</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {activeGoals.map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>

      {/* Recently Completed */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Recently Completed</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {completedGoals.slice(0, 4).map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </div>
      )}

      <CreateGoalDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onGoalCreated={() => {}} // Real-time listener will auto-update
      />
    </div>
  );
}

function StatCard({ icon, title, value, color }: { 
  icon: React.ReactNode; 
  title: string; 
  value: number | string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-3xl font-bold mt-1">{value}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  const completedTasks = goal.tasks?.filter(t => t.status === 'completed')?.length || 0;
  const totalTasks = goal.tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Link href={`/dashboard/goals/${goal.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">{goal.title}</CardTitle>
              <CardDescription className="mt-1 line-clamp-2">
                {goal.description}
              </CardDescription>
            </div>
            <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {completedTasks} / {totalTasks} tasks completed
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                {goal.status}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    career: '💼',
    education: '📚',
    fitness: '💪',
    personal: '🌟',
    creative: '🎨',
    financial: '💰',
    spiritual: '🕌',
    travel: '✈️',
    other: '📋',
  };
  return icons[category] || '📋';
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50';
    case 'in-progress':
      return 'text-blue-600 bg-blue-50';
    case 'planning':
      return 'text-purple-600 bg-purple-50';
    case 'paused':
      return 'text-orange-600 bg-orange-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

