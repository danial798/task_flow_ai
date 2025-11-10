'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { subscribeToUserGoals, subscribeToGoalTasks } from '@/lib/firebase/firestore';
import { Goal } from '@/types';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { AIInsights } from '@/components/analytics/AIInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Sparkles } from 'lucide-react';

export default function AnalyticsPage() {
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
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics & Insights</h1>
        <p className="text-gray-600 mt-1">Track your progress and get AI-powered recommendations</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>AI Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsDashboard goals={goals} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <AIInsights goals={goals} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

