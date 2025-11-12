'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, AlertTriangle, CheckCircle, Target, TrendingUp, X } from 'lucide-react';
import { AIInsight, Goal, UserPreferences } from '@/types';
import { Badge } from '@/components/ui/badge';

interface InsightsPanelProps {
  goals: Goal[];
  userPreferences?: UserPreferences;
}

export function InsightsPanel({ goals, userPreferences }: InsightsPanelProps) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userPreferences) {
      loadInsights();
    }
  }, [goals, userPreferences]);

  const loadInsights = async () => {
    if (!userPreferences) return;

    try {
      const response = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goals,
          completionStats: [], // TODO: Load from DB
          userPreferences,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights.filter((i: AIInsight) => !i.dismissed));
      }
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const dismissInsight = (insightId: string) => {
    setInsights(insights.filter(i => i.id !== insightId));
  };

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'bottleneck':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'pattern':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'recommendation':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'achievement':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Target className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: AIInsight['severity']) => {
    switch (severity) {
      case 'high':
        return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'low':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Analyzing your progress...</p>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-muted-foreground">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <p className="text-sm">Looking good! No issues detected.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          AI Insights ({insights.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-lg border-l-4 ${getSeverityColor(insight.severity)} relative group`}
          >
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => dismissInsight(insight.id)}
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="flex items-start gap-3">
              {getInsightIcon(insight.type)}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm">{insight.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
                {insight.actionable && insight.suggestedAction && (
                  <div className="flex items-center gap-2 mt-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">
                      {insight.suggestedAction}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

