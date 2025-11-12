'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { subscribeToUserGoals, subscribeToGoalTasks } from '@/lib/firebase/firestore';
import { Goal } from '@/types';
import { ProductivityReportView } from '@/components/ProductivityReportView';
import { TrendingUp } from 'lucide-react';

export default function ProductivityPage() {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading productivity data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <TrendingUp className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Productivity Insights</h1>
          <p className="text-gray-600 mt-1">AI-powered analysis of your progress and patterns</p>
        </div>
      </div>

      {/* Productivity Report */}
      {user && <ProductivityReportView userId={user.uid} goals={goals} />}
    </div>
  );
}

