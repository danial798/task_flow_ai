'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

interface CreateGoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreated: () => void;
}

export function CreateGoalDialog({ open, onOpenChange, onGoalCreated }: CreateGoalDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<'input' | 'generating' | 'review'>('input');
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [category, setCategory] = useState('');
  const [aiPlan, setAiPlan] = useState<any>(null);

  const generatePlanWithRetry = async (retryCount = 0) => {
    if (!goalTitle.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a goal title',
        variant: 'destructive',
      });
      return;
    }

    // 🚀 INSTANT FEEDBACK - Show generating immediately
    toast({
      title: '🤖 AI is thinking...',
      description: 'Generating your roadmap (5-8 seconds)...',
    });

    setStep('generating');

    try {
      // Add timeout to fetch request (26 seconds - Netlify's function timeout)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 26000);

      const response = await fetch('/api/ai/breakdown-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: goalTitle,
          context: goalDescription,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || 'Failed to generate plan';
        const errorDetails = errorData.details ? ` (${errorData.details})` : '';
        throw new Error(errorMessage + errorDetails);
      }

      const data = await response.json();
      setAiPlan(data.breakdown);
      setStep('review');
      
      toast({
        title: '✨ AI Roadmap Ready!',
        description: 'Review your personalized plan below',
      });
    } catch (error: any) {
      // Retry logic for timeouts (but NOT for API key errors)
      const isTimeout = error.name === 'AbortError' || error.message?.includes('timeout');
      const isConfigError = error.message?.includes('not configured') || error.message?.includes('Invalid OpenAI');
      
      if (isTimeout && retryCount < 2 && !isConfigError) {
        toast({
          title: '⏱️ Taking longer than expected...',
          description: `Retrying... (Attempt ${retryCount + 2}/3)`,
        });
        setTimeout(() => generatePlanWithRetry(retryCount + 1), 1000);
        return;
      }

      // Show specific error message
      let errorTitle = 'Error';
      let errorDescription = error.message || 'Failed to generate AI plan. Please try again.';
      
      if (isConfigError) {
        errorTitle = '⚙️ Configuration Error';
      } else if (isTimeout) {
        errorTitle = '⏱️ Timeout';
        errorDescription = 'Request timed out. Please try a shorter goal description or try again later.';
      } else if (error.message?.includes('Rate limit')) {
        errorTitle = '⚠️ Rate Limit';
      }

      toast({
        title: errorTitle,
        description: errorDescription,
        variant: 'destructive',
      });
      setStep('input');
    }
  };

  const handleGeneratePlan = () => {
    generatePlanWithRetry(0);
  };

  const handleSaveGoal = async () => {
    if (!user || !aiPlan) return;

    // 🚀 OPTIMISTIC UPDATE - Show success immediately and close dialog
    toast({
      title: '✨ Creating Goal...',
      description: aiPlan.goal.title,
    });

    // Reset form and close immediately
    setGoalTitle('');
    setGoalDescription('');
    setCategory('');
    const goalToSave = aiPlan;
    setAiPlan(null);
    setStep('input');
    onOpenChange(false);

    // Then create in the background
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          title: goalToSave.goal.title,
          description: goalToSave.goal.description,
          category: category || goalToSave.goal.category,
          estimatedDuration: goalToSave.goal.estimatedDuration,
          tasks: goalToSave.tasks,
          resources: goalToSave.resources,
        }),
      });

      if (!response.ok) throw new Error('Failed to save goal');

      // Real-time listener will show the new goal automatically
      toast({
        title: '✅ Goal Created!',
        description: 'Your AI-powered roadmap is ready!',
      });
      
      onGoalCreated();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create goal. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {step === 'input' && (
          <>
            <DialogHeader>
              <DialogTitle>Create a New Goal</DialogTitle>
              <DialogDescription>
                Describe your goal and let AI create a personalized roadmap
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">What do you want to achieve?</Label>
                <Input
                  id="title"
                  placeholder="e.g., Launch my startup, Learn Spanish, Run a marathon"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  maxLength={150}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {goalTitle.length}/150 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Additional Context (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Provide any relevant details like your experience level, timeline, constraints..."
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {goalDescription.length}/500 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="career">💼 Career</SelectItem>
                    <SelectItem value="education">📚 Education</SelectItem>
                    <SelectItem value="fitness">💪 Fitness</SelectItem>
                    <SelectItem value="personal">🌟 Personal</SelectItem>
                    <SelectItem value="creative">🎨 Creative</SelectItem>
                    <SelectItem value="financial">💰 Financial</SelectItem>
                    <SelectItem value="spiritual">🕌 Spiritual</SelectItem>
                    <SelectItem value="travel">✈️ Travel</SelectItem>
                    <SelectItem value="other">📋 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleGeneratePlan} className="w-full" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Roadmap
              </Button>
            </div>
          </>
        )}

        {step === 'generating' && (
          <div className="py-12 text-center">
            <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold mb-2">Creating Your Roadmap</h3>
            <p className="text-gray-600">AI is analyzing your goal and generating a personalized plan...</p>
          </div>
        )}

        {step === 'review' && aiPlan && (
          <>
            <DialogHeader>
              <DialogTitle>Review Your AI-Generated Roadmap</DialogTitle>
              <DialogDescription>
                Review and customize your plan before saving
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{aiPlan.goal.title}</h3>
                <p className="text-gray-600 text-sm">{aiPlan.goal.description}</p>
                <p className="text-sm text-blue-600 mt-1">
                  Estimated Duration: {aiPlan.goal.estimatedDuration}
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Tasks ({aiPlan.tasks.length})</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {aiPlan.tasks.map((task: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {aiPlan.tips && aiPlan.tips.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">AI Tips</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {aiPlan.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep('input')} className="flex-1">
                  Start Over
                </Button>
                <Button onClick={handleSaveGoal} className="flex-1">
                  Save & Start Goal
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
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

