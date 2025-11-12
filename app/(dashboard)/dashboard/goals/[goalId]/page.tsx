'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useParams, useRouter } from 'next/navigation';
import { Goal, Task } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, Target, Edit, Trash2, CheckCircle2, Circle, Download, Share2, BookOpen, Focus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { exportGoalToPDF, generateShareableLink, copyToClipboard } from '@/lib/export-utils';
import { ProgressCelebration } from '@/components/ProgressCelebration';
import { GoalRetrospective } from '@/components/retrospectives/GoalRetrospective';
import { subscribeToGoal, subscribeToGoalTasks } from '@/lib/firebase/firestore';
import { FocusMode } from '@/components/FocusMode';
import { TaskBreakdownDialog } from '@/components/TaskBreakdownDialog';
import { GoalVisualization } from '@/components/GoalVisualization';

export default function GoalDetailPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'task' | 'goal'>('task');
  const [celebrationTitle, setCelebrationTitle] = useState('');
  const [showRetrospective, setShowRetrospective] = useState(false);
  const [showFocusMode, setShowFocusMode] = useState(false);
  const [focusTask, setFocusTask] = useState<Task | undefined>();
  const [showTaskBreakdown, setShowTaskBreakdown] = useState(false);
  const [breakdownTask, setBreakdownTask] = useState<Task | undefined>();

  useEffect(() => {
    if (!user || !params.goalId) return;

    setLoading(true);
    
    // Subscribe to real-time goal updates
    const unsubscribeGoal = subscribeToGoal(
      user.uid,
      params.goalId as string,
      (updatedGoal) => {
        if (!updatedGoal) {
          toast({
            title: 'Error',
            description: 'Goal not found',
            variant: 'destructive',
          });
          router.push('/dashboard');
          return;
        }
        setGoal(updatedGoal);
        setLoading(false);
      }
    );

    // Subscribe to real-time task updates
    const unsubscribeTasks = subscribeToGoalTasks(
      user.uid,
      params.goalId as string,
      (updatedTasks) => {
        setGoal((prevGoal) => {
          if (!prevGoal) return prevGoal;
          return {
            ...prevGoal,
            tasks: updatedTasks,
          };
        });
      }
    );

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeGoal();
      unsubscribeTasks();
    };
  }, [user, params.goalId]);

  const handleTaskToggle = async (task: Task) => {
    if (!user || !goal) return;

    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    // 🚀 OPTIMISTIC UPDATE - Update UI immediately!
    setGoal((prevGoal) => {
      if (!prevGoal) return prevGoal;
      return {
        ...prevGoal,
        tasks: prevGoal.tasks?.map(t => 
          t.id === task.id ? { ...t, status: newStatus } : t
        ),
      };
    });

    // Show celebration immediately for completing a task
    if (newStatus === 'completed') {
      setCelebrationType('task');
      setCelebrationTitle(task.title);
      setShowCelebration(true);
    }

    // Show instant feedback
    toast({
      title: newStatus === 'completed' ? '✅ Task Completed!' : '🔄 Task Reopened',
      description: task.title,
    });

    // Then make the API call in the background
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          goalId: goal.id,
          status: newStatus,
          progressNote: `Task marked as ${newStatus}`,
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');
      
      // Real-time listener will sync the final state from database
    } catch (error) {
      // ❌ If API fails, revert the optimistic update
      setGoal((prevGoal) => {
        if (!prevGoal) return prevGoal;
        return {
          ...prevGoal,
          tasks: prevGoal.tasks?.map(t => 
            t.id === task.id ? { ...t, status: task.status } : t
          ),
        };
      });
      
      toast({
        title: 'Error',
        description: 'Failed to update task. Changes reverted.',
        variant: 'destructive',
      });
    }
  };

  const handleExportPDF = async () => {
    if (!goal) return;
    
    const success = await exportGoalToPDF(goal, 'goal-detail');
    if (success) {
      toast({
        title: 'Success!',
        description: 'Goal exported as PDF',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to export PDF',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (!goal) return;
    
    const shareLink = generateShareableLink(goal.id);
    const success = await copyToClipboard(shareLink);
    
    if (success) {
      toast({
        title: 'Link Copied!',
        description: 'Share link copied to clipboard',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to copy link',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteGoal = async () => {
    if (!user || !goal) return;
    
    if (!confirm('Are you sure you want to delete this goal?')) return;

    // 🚀 OPTIMISTIC UPDATE - Navigate immediately
    toast({
      title: '🗑️ Deleting Goal...',
      description: goal.title,
    });
    
    router.push('/dashboard');

    // Then delete in the background
    try {
      const response = await fetch(`/api/goals/${goal.id}?userId=${user.uid}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete goal');
      
      // Real-time listener will remove it from lists automatically
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete goal. Please refresh the page.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading goal...</p>
        </div>
      </div>
    );
  }

  if (!goal) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">Goal not found</h2>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const completedTasks = goal.tasks?.filter(t => t.status === 'completed')?.length || 0;
  const totalTasks = goal.tasks?.length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handleExportPDF} title="Export as PDF">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare} title="Share Link">
            <Share2 className="h-4 w-4" />
          </Button>
          {goal.status === 'completed' && (
            <Button variant="outline" size="icon" onClick={() => setShowRetrospective(true)} title="Retrospective">
              <BookOpen className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleDeleteGoal}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Goal Overview */}
      <div id="goal-detail">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{goal.title}</CardTitle>
              <CardDescription className="text-base">{goal.description}</CardDescription>
            </div>
            <span className="text-4xl">{getCategoryIcon(goal.category)}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className={`font-medium px-3 py-1 rounded-full inline-block text-sm ${getStatusColor(goal.status)}`}>
                {goal.status}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Priority</p>
              <p className={`font-medium px-3 py-1 rounded-full inline-block text-sm ${getPriorityColor(goal.priority)}`}>
                {goal.priority}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Target Date</p>
              <p className="font-medium flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(goal.targetDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
          <CardDescription>Track your progress on each task</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {goal.tasks && goal.tasks.length > 0 ? (
              goal.tasks
                .sort((a, b) => a.order - b.order)
                .map((task) => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={() => handleTaskToggle(task)}
                    onFocus={() => {
                      setFocusTask(task);
                      setShowFocusMode(true);
                    }}
                    onBreakdown={() => {
                      setBreakdownTask(task);
                      setShowTaskBreakdown(true);
                    }}
                  />
                ))
            ) : (
              <p className="text-gray-500 text-center py-8">No tasks yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Goal Visualization */}
      <GoalVisualization goal={goal} />

      {/* Resources */}
      {goal.resources && goal.resources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recommended Resources</CardTitle>
            <CardDescription>AI-curated resources to help you succeed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {goal.resources.map((resource) => (
                <div key={resource.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                      {resource.url && (
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                        >
                          View Resource →
                        </a>
                      )}
                    </div>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                      {resource.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>

      {/* Celebration Modal */}
      <ProgressCelebration
        show={showCelebration}
        type={celebrationType}
        title={celebrationTitle}
        onComplete={() => setShowCelebration(false)}
      />

      {/* Retrospective Dialog */}
      <GoalRetrospective
        open={showRetrospective}
        onOpenChange={setShowRetrospective}
        goal={goal}
      />

      {/* Focus Mode */}
      <FocusMode
        open={showFocusMode}
        onOpenChange={setShowFocusMode}
        task={focusTask}
        goal={goal}
      />

      {/* Task Breakdown Dialog */}
      {breakdownTask && (
        <TaskBreakdownDialog
          open={showTaskBreakdown}
          onOpenChange={setShowTaskBreakdown}
          task={breakdownTask}
          goal={goal}
          onTaskUpdated={() => {
            // Real-time listener will update
          }}
        />
      )}
    </div>
  );
}

function TaskItem({ 
  task, 
  onToggle, 
  onFocus,
  onBreakdown,
}: { 
  task: Task; 
  onToggle: () => void;
  onFocus: () => void;
  onBreakdown: () => void;
}) {
  const isCompleted = task.status === 'completed';

  return (
    <div className={`border rounded-lg p-4 transition-all group hover:shadow-md ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
      <div className="flex items-start space-x-3">
        <button
          onClick={onToggle}
          className="mt-1 flex-shrink-0"
        >
          {isCompleted ? (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          ) : (
            <Circle className="h-6 w-6 text-gray-400" />
          )}
        </button>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`font-medium ${isCompleted ? 'line-through text-gray-600' : ''}`}>
                {task.title}
              </h4>
              <p className={`text-sm mt-1 ${isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
                {task.description}
              </p>
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="mt-2 space-y-1">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center text-sm">
                      <span className="mr-2">{subtask.completed ? '✓' : '○'}</span>
                      <span className={subtask.completed ? 'line-through text-gray-500' : 'text-gray-600'}>
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {/* Task Actions - Only show on hover and for non-completed tasks */}
              {!isCompleted && (
                <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onFocus}
                    className="gap-1 text-xs"
                  >
                    <Focus className="h-3 w-3" />
                    Focus
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onBreakdown}
                    className="gap-1 text-xs"
                  >
                    <Sparkles className="h-3 w-3" />
                    Refine
                  </Button>
                </div>
              )}
            </div>
            <span className={`px-2 py-1 rounded text-xs ml-2 ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
        </div>
      </div>
    </div>
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

