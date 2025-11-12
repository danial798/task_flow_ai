'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Award } from 'lucide-react';
import { Goal } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface GoalRetrospectiveProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: Goal;
}

export function GoalRetrospective({ open, onOpenChange, goal }: GoalRetrospectiveProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'input' | 'generating' | 'results'>('input');
  const [userInput, setUserInput] = useState({
    wentWell: '',
    challenges: '',
    improvements: '',
  });
  const [aiInsights, setAiInsights] = useState<any>(null);

  const handleGenerate = async () => {
    setStep('generating');

    try {
      const response = await fetch('/api/ai/retrospective', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal,
          userReflections: userInput,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate retrospective');

      const data = await response.json();
      setAiInsights(data.insights);
      setStep('results');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate AI insights. But your reflections are still valuable!',
        variant: 'destructive',
      });
      // Show manual results anyway
      setStep('results');
    }
  };

  const completedTasks = goal.tasks?.filter(t => t.status === 'completed').length || 0;
  const totalTasks = goal.tasks?.length || 0;
  const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {step === 'input' && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-purple-600" />
                <span>Goal Retrospective</span>
              </DialogTitle>
              <DialogDescription>
                Reflect on &quot;{goal.title}&quot; and unlock AI-powered insights
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Stats Summary */}
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-3xl font-bold text-blue-600">{successRate}%</p>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-purple-600">{completedTasks}</p>
                      <p className="text-sm text-gray-600">Tasks Done</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-green-600">
                        {Math.ceil((new Date().getTime() - new Date(goal.createdAt).getTime()) / (1000 * 60 * 60 * 24))}d
                      </p>
                      <p className="text-sm text-gray-600">Duration</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Reflections */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    🌟 What went well?
                  </label>
                  <Textarea
                    placeholder="What successes did you have? What strategies worked?"
                    value={userInput.wentWell}
                    onChange={(e) => setUserInput({ ...userInput, wentWell: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    ⚠️ What were the challenges?
                  </label>
                  <Textarea
                    placeholder="What obstacles did you face? What slowed you down?"
                    value={userInput.challenges}
                    onChange={(e) => setUserInput({ ...userInput, challenges: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    💡 What would you do differently?
                  </label>
                  <Textarea
                    placeholder="What lessons did you learn? What will you change next time?"
                    value={userInput.improvements}
                    onChange={(e) => setUserInput({ ...userInput, improvements: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <Button onClick={handleGenerate} className="w-full" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Insights
              </Button>
            </div>
          </>
        )}

        {step === 'generating' && (
          <div className="py-12 text-center">
            <Sparkles className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold mb-2">Analyzing Your Journey</h3>
            <p className="text-gray-600">AI is generating personalized insights...</p>
          </div>
        )}

        {step === 'results' && (
          <>
            <DialogHeader>
              <DialogTitle>Your Retrospective Report</DialogTitle>
              <DialogDescription>
                Insights and recommendations for &quot;{goal.title}&quot;
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* User Reflections Summary */}
              {userInput.wentWell && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-900 mb-2">What Went Well</h4>
                        <p className="text-sm text-green-800">{userInput.wentWell}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {userInput.challenges && (
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-orange-900 mb-2">Challenges Faced</h4>
                        <p className="text-sm text-orange-800">{userInput.challenges}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {userInput.improvements && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="h-5 w-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-2">Lessons Learned</h4>
                        <p className="text-sm text-blue-800">{userInput.improvements}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* AI Insights (if available) */}
              {aiInsights && (
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-3">
                      <Sparkles className="h-5 w-5 text-purple-600 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-purple-900 mb-3">AI Recommendations</h4>
                        <ul className="space-y-2 text-sm text-purple-800">
                          <li>• {aiInsights.recommendation1 || 'Keep building on your momentum!'}</li>
                          <li>• {aiInsights.recommendation2 || 'Break larger goals into smaller milestones.'}</li>
                          <li>• {aiInsights.recommendation3 || 'Celebrate small wins along the way!'}</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep('input')} className="flex-1">
                  Edit Reflections
                </Button>
                <Button onClick={() => onOpenChange(false)} className="flex-1">
                  Save & Close
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

