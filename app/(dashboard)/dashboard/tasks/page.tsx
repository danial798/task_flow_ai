'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { subscribeToUserGoals, subscribeToGoalTasks } from '@/lib/firebase/firestore';
import { Goal, Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TasksPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Flatten all tasks from all goals
  const allTasks = goals.flatMap(goal => 
    (goal.tasks || []).map(task => ({ ...task, goalTitle: goal.title, goalId: goal.id }))
  );

  const pendingTasks = allTasks.filter(t => t.status === 'pending' || t.status === 'in-progress');
  const completedTasks = allTasks.filter(t => t.status === 'completed');
  const blockedTasks = allTasks.filter(t => t.status === 'blocked');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">All Tasks</h1>
        <p className="text-gray-600 mt-1">View and manage tasks across all your goals</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-3xl font-bold mt-1">{pendingTasks.length}</p>
              </div>
              <Circle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold mt-1">{completedTasks.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Blocked</p>
                <p className="text-3xl font-bold mt-1">{blockedTasks.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks */}
      {pendingTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Pending Tasks ({pendingTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Blocked Tasks */}
      {blockedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Blocked Tasks ({blockedTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blockedTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Completed Tasks ({completedTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedTasks.slice(0, 10).map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {allTasks.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
            <p className="text-gray-600">Create a goal to start adding tasks</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TaskItem({ task }: { task: any }) {
  const isCompleted = task.status === 'completed';
  const isBlocked = task.status === 'blocked';

  return (
    <Link href={`/dashboard/goals/${task.goalId}`}>
      <div className={`border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer ${
        isCompleted ? 'bg-green-50 border-green-200' : 
        isBlocked ? 'bg-red-50 border-red-200' : 'bg-white'
      }`}>
        <div className="flex items-start space-x-3">
          {isCompleted ? (
            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
          ) : isBlocked ? (
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
          ) : (
            <Circle className="h-6 w-6 text-gray-400 flex-shrink-0 mt-1" />
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4 className={`font-medium ${isCompleted ? 'line-through text-gray-600' : ''}`}>
                  {task.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">{task.goalTitle}</p>
                <p className={`text-sm mt-1 ${isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
                  {task.description}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700';
    case 'low':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

