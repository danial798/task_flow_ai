'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MotivationBannerProps {
  tasksToday: number;
  completedToday: number;
  streakDays: number;
  upcomingMilestones: number;
}

export function MotivationBanner({
  tasksToday,
  completedToday,
  streakDays,
  upcomingMilestones,
}: MotivationBannerProps) {
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(true);

  useEffect(() => {
    loadMotivationMessage();
  }, [tasksToday, completedToday, streakDays, upcomingMilestones]);

  const loadMotivationMessage = async () => {
    try {
      const response = await fetch('/api/ai/motivation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasksToday,
          completedToday,
          streakDays,
          upcomingMilestones,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Failed to load motivation message:', error);
    }
  };

  if (!show || !message) return null;

  return (
    <div className="relative mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 flex-1">
          {message}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 -mt-1 -mr-1"
          onClick={() => setShow(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

