'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserProgress } from '@/types';

interface PlatformContextType {
  user: User | null;
  userProgress: UserProgress | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  refreshProgress: () => Promise<void>;
  isSolved: (problemId: string) => boolean;
  isAttempted: (problemId: string) => boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const PlatformContext = createContext<PlatformContextType | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const refreshAuth = async () => {
    try {
      setAuthLoading(true);
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        if (data.progress) {
          setUserProgress(data.progress);
        } else {
          await refreshProgress();
        }
      } else {
        setUser(null);
        await refreshProgress();
      }
    } catch (e) {
      console.error('Failed to load session', e);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

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

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to login' };
      }
      setUser(data.user);
      if (data.progress) {
        setUserProgress(data.progress);
      } else {
        await refreshProgress();
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error' };
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to create account' };
      }
      setUser(data.user);
      await refreshProgress();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      await refreshProgress();
    } catch (e) {
      console.error('Logout error', e);
      setUser(null);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const isSolved = (problemId: string) => {
    return userProgress?.solvedProblemIds?.includes(problemId) ?? false;
  };

  const isAttempted = (problemId: string) => {
    return userProgress?.attemptedProblemIds?.includes(problemId) ?? false;
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <PlatformContext.Provider
      value={{
        user,
        userProgress,
        authLoading,
        login,
        signup,
        logout,
        refreshAuth,
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
