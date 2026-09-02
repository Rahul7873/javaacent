'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Code2, 
  Flame, 
  CheckCircle2, 
  LayoutDashboard, 
  BookOpen, 
  History, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';

export function Navbar() {
  const pathname = usePathname();
  const { userProgress, theme, toggleTheme } = usePlatform();

  const navLinks = [
    { name: 'Problems', href: '/problems', icon: BookOpen },
    { name: 'Basic Practice', href: '/basic-practice', icon: GraduationCap },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Submissions', href: '/submissions', icon: History },
    { name: 'Admin', href: '/admin', icon: ShieldCheck }
  ];

  const solvedCount = userProgress?.solvedProblemIds.length ?? 0;
  const streakCount = userProgress?.currentStreak ?? 0;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0b0f19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-600 p-0.5 shadow-lg shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-lg">
                ☕
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg tracking-tight text-white font-mono">
                  Java<span className="text-amber-400">Ascent</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full">
                  JAVA 17 LTS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide">Java DSA & AI Learning Platform</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Widgets */}
        <div className="flex items-center space-x-3">
          {/* Daily Challenge Pill */}
          <Link
            href="/problems/two-sum-target"
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium hover:border-amber-500/60 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Daily Challenge</span>
          </Link>

          {/* Streak Counter */}
          <div 
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-orange-950/40 border border-orange-500/30 text-orange-400 text-xs font-semibold"
            title={`Current Streak: ${streakCount} days | Longest: ${userProgress?.longestStreak ?? 0} days`}
          >
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-bounce" />
            <span>{streakCount} d</span>
          </div>

          {/* Solved Count */}
          <div 
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold"
            title={`Solved ${solvedCount} problems`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{solvedCount} solved</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-slate-800"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile avatar */}
          <Link
            href="/profile"
            className="flex items-center space-x-2 pl-2 pr-1 py-1 rounded-full border border-slate-700 bg-slate-800/80 hover:border-indigo-500/50 transition-colors"
          >
            <span className="text-xs font-medium text-slate-200 hidden lg:inline">
              {userProgress?.userName || 'Alex D.'}
            </span>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow">
              AD
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
