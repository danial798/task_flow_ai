'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProductivityReport, Goal } from '@/types';
import { BarChart, Calendar, TrendingUp, Loader2, AlertCircle, CheckCircle2, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductivityReportViewProps {
  userId: string;
  goals: Goal[];
}

export function ProductivityReportView({ userId, goals }: ProductivityReportViewProps) {
  const [report, setReport] = useState<ProductivityReport | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      // Calculate current week dates
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)

      const response = await fetch('/api/ai/productivity-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          goals,
          weekStart: weekStart.toISOString(),
          weekEnd: weekEnd.toISOString(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && goals.length > 0) {
      generateReport();
    }
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Generating AI-powered productivity report...</p>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <BarChart className="w-12 h-12 mx-auto text-muted-foreground" />
          <div className="space-y-2">
            <h3 className="font-semibold">Weekly Productivity Report</h3>
            <p className="text-sm text-muted-foreground">
              Get AI-powered insights on your productivity patterns
            </p>
          </div>
          <Button onClick={generateReport} className="gap-2">
            <TrendingUp className="w-4 h-4" />
            Generate Report
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Weekly Productivity Report
            </CardTitle>
            <Button variant="outline" size="sm" onClick={generateReport}>
              Refresh
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            {new Date(report.weekStart).toLocaleDateString()} - {new Date(report.weekEnd).toLocaleDateString()}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* AI Summary */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <p className="text-sm font-medium">{report.aiSummary}</p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{report.tasksCompleted}</p>
              <p className="text-xs text-muted-foreground">Tasks Completed</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{report.completionRate.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">Completion Rate</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{report.goalsActive}</p>
              <p className="text-xs text-muted-foreground">Active Goals</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{report.onTimeRate.toFixed(0)}%</p>
              <p className="text-xs text-muted-foreground">On-Time Rate</p>
            </div>
          </div>

          {/* Top Category */}
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <span className="text-sm">
              Top focus area: <Badge variant="secondary">{report.topCategory}</Badge>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{insight}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {report.recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">{rec}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Bottlenecks */}
      {report.bottleneckAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.bottleneckAreas.map((bottleneck, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{bottleneck}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

