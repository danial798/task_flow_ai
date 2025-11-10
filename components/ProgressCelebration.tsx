'use client';

import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, Flame, Target } from 'lucide-react';

interface ProgressCelebrationProps {
  show: boolean;
  type: 'task' | 'goal' | 'milestone' | 'streak';
  title: string;
  description?: string;
  onComplete?: () => void;
}

export function ProgressCelebration({ 
  show, 
  type, 
  title, 
  description,
  onComplete 
}: ProgressCelebrationProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'goal':
        return <Trophy className="h-16 w-16 text-yellow-500" />;
      case 'milestone':
        return <Target className="h-16 w-16 text-blue-500" />;
      case 'streak':
        return <Flame className="h-16 w-16 text-orange-500" />;
      default:
        return <Star className="h-16 w-16 text-green-500" />;
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'goal':
        return 'Goal Completed! 🎉';
      case 'milestone':
        return 'Milestone Reached! 🎯';
      case 'streak':
        return 'Streak Unlocked! 🔥';
      default:
        return 'Task Completed! ✨';
    }
  };

  return (
    <>
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={type === 'goal' ? 500 : 200}
        gravity={0.3}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in">
        <Card className="max-w-md mx-4 animate-in zoom-in slide-in-from-bottom-4">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4 animate-bounce">
              {getIcon()}
            </div>
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {getMessage()}
            </h2>
            <p className="text-xl font-semibold mb-2">{title}</p>
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
            <div className="mt-6">
              <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>Keep up the amazing work!</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

