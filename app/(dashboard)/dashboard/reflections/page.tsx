'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReflectionsPage() {
  // In a real app, this would fetch actual reflection data
  const reflections = [
    {
      id: '1',
      weekStart: new Date('2025-10-27'),
      weekEnd: new Date('2025-11-02'),
      summary: 'Great progress this week! You completed 8 out of 10 planned tasks.',
      achievements: [
        'Completed MVP design mockups',
        'Finished user research interviews',
        'Set up development environment'
      ],
      challenges: [
        'Time management during busy work days',
        'Scope creep on design phase'
      ],
      recommendations: [
        'Break larger tasks into smaller 30-minute chunks',
        'Set strict time limits for creative work',
        'Schedule dedicated focus blocks in your calendar'
      ],
      productivityScore: 85,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Weekly Reflections</h1>
        <p className="text-gray-600 mt-2">AI-generated insights about your progress and growth</p>
      </div>

      {/* Coming Soon Notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Sparkles className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900">AI Reflections Coming Soon</h3>
              <p className="text-sm text-blue-700 mt-1">
                Every week, AI will analyze your progress and generate personalized insights, 
                celebrating your wins and providing actionable recommendations for improvement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sample Reflection */}
      {reflections.map(reflection => (
        <Card key={reflection.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Week of {reflection.weekStart.toLocaleDateString()}</CardTitle>
                <CardDescription>
                  {reflection.weekStart.toLocaleDateString()} - {reflection.weekEnd.toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Productivity Score</p>
                <p className="text-3xl font-bold text-green-600">{reflection.productivityScore}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary */}
            <div>
              <p className="text-gray-700">{reflection.summary}</p>
            </div>

            {/* Achievements */}
            <div>
              <h3 className="font-semibold flex items-center mb-3">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                Achievements
              </h3>
              <ul className="space-y-2">
                {reflection.achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Challenges */}
            <div>
              <h3 className="font-semibold flex items-center mb-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mr-2" />
                Challenges
              </h3>
              <ul className="space-y-2">
                {reflection.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-600 mr-2">!</span>
                    <span className="text-gray-700">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold flex items-center mb-3">
                <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
                AI Recommendations
              </h3>
              <ul className="space-y-2">
                {reflection.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2">→</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

