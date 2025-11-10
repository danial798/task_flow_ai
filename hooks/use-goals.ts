'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';
import { getUserGoals } from '@/lib/firebase/firestore';
import { Goal } from '@/types';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userGoals = await getUserGoals(user.uid);
      setGoals(userGoals);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const refreshGoals = () => {
    loadGoals();
  };

  return {
    goals,
    loading,
    error,
    refreshGoals,
  };
}

