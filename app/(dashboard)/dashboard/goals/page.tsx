'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { subscribeToUserGoals, subscribeToGoalTasks } from '@/lib/firebase/firestore';
import { Goal } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Filter } from 'lucide-react';
import Link from 'next/link';
import { CreateGoalDialog } from '@/components/goals/CreateGoalDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function GoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const filteredGoals = statusFilter === 'all' 
    ? goals 
    : goals.filter(g => g.status === statusFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Goals</h1>
          <p className="text-gray-600 mt-1">Manage and track all your goals</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Goal
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Goals</SelectItem>
            <SelectItem value="planning">Planning</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="abandoned">Abandoned</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-600">
          Showing {filteredGoals.length} of {goals.length} goals
        </span>
      </div>

      {/* Goals Grid */}
      {filteredGoals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No goals found</h3>
            <p className="text-gray-600 mb-4">
              {statusFilter === 'all' 
                ? 'Create your first goal to get started' 
                : `No goals with status "${statusFilter}"`}
            </p>
            {statusFilter === 'all' && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Goal
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
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

function GoalCard({ goal }: { goal: Goal }) {
  const completedTasks = goal.tasks?.filter(t => t.status === 'completed')?.length || 0;
  const totalTasks = goal.tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Link href={`/dashboard/goals/${goal.id}`}>
      <Card className="hover:shadow-lg transition-all cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg line-clamp-2">{goal.title}</h3>
            <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {goal.description}
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {completedTasks} / {totalTasks} tasks
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

