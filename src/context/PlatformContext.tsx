'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProgress } from '@/types';

interface PlatformContextType {
  userProgress: UserProgress | null;
  refreshProgress: () => Promise<void>;
  isSolved: (problemId: string) => boolean;
  isAttempted: (problemId: string) => boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const refreshProgress = async () => {
    try {
      const res = await fetch('/api/progress');
      if (res.ok) {
        const data = await res.json();
        setUserProgress(data);
      }
    } catch (e) {
      console.error('Failed to fetch user progress', e);
    }
  };

  useEffect(() => {
    refreshProgress();
  }, []);

  const isSolved = (problemId: string) => {
    return userProgress?.solvedProblemIds.includes(problemId) ?? false;
  };

  const isAttempted = (problemId: string) => {
    return userProgress?.attemptedProblemIds.includes(problemId) ?? false;
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <PlatformContext.Provider
      value={{
        userProgress,
        refreshProgress,
        isSolved,
        isAttempted,
        theme,
        toggleTheme
      }}
    >
      <div className={theme === 'dark' ? 'dark text-slate-100 bg-[#0c0e14] min-h-screen' : 'text-slate-900 bg-slate-50 min-h-screen'}>
        {children}
      </div>
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error('usePlatform must be used within a PlatformProvider');
  }
  return context;
}
