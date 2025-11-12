'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { Task, Goal } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface TaskBreakdownDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
  goal?: Goal;
  userId: string;
  onTaskUpdated: () => void;
}

export function TaskBreakdownDialog({
  open,
  onOpenChange,
  task,
  goal,
  userId,
  onTaskUpdated,
}: TaskBreakdownDialogProps) {
  const [loading, setLoading] = useState(false);
  const [breakdown, setBreakdown] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/breakdown-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskTitle: task.title,
          taskDescription: task.description,
          goalContext: goal?.title,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate breakdown');

      const data = await response.json();
      setBreakdown(data.breakdown);

      toast({
        title: '✨ Task Breakdown Generated!',
        description: 'Review and apply the suggested subtasks.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate task breakdown. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!breakdown) return;

    try {
      // Update task with refined details and subtasks
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          goalId: task.goalId,
          title: breakdown.refinedTitle,
          description: breakdown.refinedDescription,
          estimatedDuration: breakdown.estimatedDuration,
          subtasks: breakdown.subtasks.map((title: string, idx: number) => ({
            id: `subtask-${Date.now()}-${idx}`,
            title,
            completed: false,
            createdAt: new Date(),
          })),
        }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      toast({
        title: '✅ Task Updated!',
        description: 'Your task has been refined with AI suggestions.',
      });

      onTaskUpdated();
      onOpenChange(false);
      setBreakdown(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update task. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI Task Breakdown Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Original Task */}
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-muted-foreground">Original Task:</h4>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-medium">{task.title}</p>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              )}
            </div>
          </div>

          {/* Generate Button */}
          {!breakdown && !loading && (
            <Button onClick={handleGenerate} className="w-full gap-2">
              <Sparkles className="w-4 h-4" />
              Generate AI Breakdown
            </Button>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">AI is breaking down your task...</p>
            </div>
          )}

          {/* Breakdown Results */}
          {breakdown && (
            <div className="space-y-4">
              {/* Refined Task */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Refined Task:</h4>
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-2">
                  <p className="font-semibold text-lg">{breakdown.refinedTitle}</p>
                  <p className="text-sm">{breakdown.refinedDescription}</p>
                  <p className="text-sm text-muted-foreground">
                    Estimated: {breakdown.estimatedDuration}
                  </p>
                </div>
              </div>

              {/* Subtasks */}
              <div className="space-y-2">
                <h4 className="font-semibold text-sm text-muted-foreground">Subtasks:</h4>
                <div className="space-y-2">
                  {breakdown.subtasks?.map((subtask: string, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-3 bg-muted rounded-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{subtask}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              {breakdown.tips && breakdown.tips.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">Tips:</h4>
                  <ul className="space-y-1 text-sm list-disc list-inside text-muted-foreground">
                    {breakdown.tips.map((tip: string, idx: number) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {breakdown && (
          <DialogFooter>
            <Button variant="outline" onClick={() => setBreakdown(null)}>
              Regenerate
            </Button>
            <Button onClick={handleApply}>
              Apply Changes
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

