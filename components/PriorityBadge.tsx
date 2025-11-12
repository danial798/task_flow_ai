'use client';

import { Badge } from '@/components/ui/badge';
import { TaskPriorityScore } from '@/types';
import { TrendingUp, AlertCircle, Clock } from 'lucide-react';

interface PriorityBadgeProps {
  priorityScore?: TaskPriorityScore;
  compact?: boolean;
}

export function PriorityBadge({ priorityScore, compact = false }: PriorityBadgeProps) {
  if (!priorityScore) return null;

  const { score, recommendation } = priorityScore;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-red-500 text-white';
    if (score >= 65) return 'bg-orange-500 text-white';
    if (score >= 50) return 'bg-yellow-500 text-white';
    if (score >= 35) return 'bg-blue-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <AlertCircle className="w-3 h-3" />;
    if (score >= 65) return <TrendingUp className="w-3 h-3" />;
    return <Clock className="w-3 h-3" />;
  };

  if (compact) {
    return (
      <Badge className={`gap-1 ${getScoreColor(score)}`}>
        {getScoreIcon(score)}
        {score}
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge className={`gap-1 ${getScoreColor(score)}`}>
        {getScoreIcon(score)}
        Priority: {score}
      </Badge>
      <span className="text-xs text-muted-foreground">{recommendation}</span>
    </div>
  );
}

