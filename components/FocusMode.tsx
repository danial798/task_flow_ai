'use client';

import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Play, Pause, RotateCcw, Coffee, Target } from 'lucide-react';
import { Task, Goal } from '@/types';

interface FocusModeProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  goal?: Goal;
}

export function FocusMode({ open, onOpenChange, task, goal }: FocusModeProps) {
  const [duration, setDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(duration * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [checkIns, setCheckIns] = useState<{ time: number; message: string }[]>([]);
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);

  const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  // AI Check-in messages
  const checkInMessages = [
    "You're doing great! Keep that focus 💪",
    "Halfway there! Stay in the zone 🎯",
    "Almost done! Finish strong 🚀",
    "You've been crushing it for 15 minutes! 🔥",
    "Great concentration! Just a few more minutes ⚡",
  ];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          // AI Check-ins at 10min, 15min, 20min marks
          if ([10 * 60, 15 * 60, 20 * 60].includes(prev)) {
            const message = checkInMessages[Math.floor(Math.random() * checkInMessages.length)];
            setCheckIns((prevCheckIns) => [...prevCheckIns, { time: duration * 60 - prev, message }]);
          }

          if (prev <= 1) {
            setIsRunning(false);
            setShowBreakPrompt(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, duration]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    if (timeLeft === duration * 60) {
      setCheckIns([{ time: 0, message: "Focus session started! You've got this 🎯" }]);
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
    setCheckIns([]);
    setShowBreakPrompt(false);
  };

  const handleTakeBreak = () => {
    setShowBreakPrompt(false);
    setDuration(5); // 5 minute break
    setTimeLeft(5 * 60);
    setIsRunning(true);
    setCheckIns([{ time: 0, message: "Break time! Rest and recharge ☕" }]);
  };

  const handleSkipBreak = () => {
    setShowBreakPrompt(false);
    handleReset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Focus Mode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Task Info */}
          {task && (
            <div className="text-center space-y-1">
              <h3 className="font-semibold text-lg">{task.title}</h3>
              {goal && <p className="text-sm text-muted-foreground">{goal.title}</p>}
            </div>
          )}

          {/* Timer Display */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-bold tabular-nums">
              {formatTime(timeLeft)}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            {!isRunning ? (
              <Button onClick={handleStart} size="lg" className="gap-2">
                <Play className="w-4 h-4" />
                Start
              </Button>
            ) : (
              <Button onClick={handlePause} size="lg" variant="secondary" className="gap-2">
                <Pause className="w-4 h-4" />
                Pause
              </Button>
            )}
            <Button onClick={handleReset} size="lg" variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          {/* Duration Selector */}
          {!isRunning && timeLeft === duration * 60 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant={duration === 15 ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setDuration(15);
                  setTimeLeft(15 * 60);
                }}
              >
                15 min
              </Button>
              <Button
                variant={duration === 25 ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setDuration(25);
                  setTimeLeft(25 * 60);
                }}
              >
                25 min
              </Button>
              <Button
                variant={duration === 45 ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setDuration(45);
                  setTimeLeft(45 * 60);
                }}
              >
                45 min
              </Button>
              <Button
                variant={duration === 60 ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setDuration(60);
                  setTimeLeft(60 * 60);
                }}
              >
                60 min
              </Button>
            </div>
          )}

          {/* AI Check-ins */}
          {checkIns.length > 0 && (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {checkIns.map((checkIn, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-sm bg-muted/50 rounded-lg p-3 animate-in slide-in-from-bottom-2"
                >
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">+{Math.floor(checkIn.time / 60)}min:</span>{' '}
                    {checkIn.message}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Break Prompt */}
          {showBreakPrompt && (
            <div className="space-y-3 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <Coffee className="w-5 h-5" />
                <p className="font-semibold">Focus session complete! 🎉</p>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Great work! Take a 5-minute break to recharge.
              </p>
              <div className="flex gap-2">
                <Button onClick={handleTakeBreak} size="sm" className="flex-1">
                  Take Break
                </Button>
                <Button onClick={handleSkipBreak} size="sm" variant="outline" className="flex-1">
                  Skip Break
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

