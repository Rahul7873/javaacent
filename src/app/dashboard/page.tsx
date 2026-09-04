'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Flame, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  Code2, 
  Clock, 
  Award, 
  Target,
  BarChart3
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Problem, Submission } from '@/types';
import { usePlatform } from '@/context/PlatformContext';

export default function DashboardPage() {
  const { user, userProgress, isSolved } = usePlatform();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [probRes, subRes] = await Promise.all([
          fetch('/api/problems'),
          fetch('/api/submissions')
        ]);
        if (probRes.ok) {
          const p = await probRes.json();
          setProblems(p.problems || []);
        }
        if (subRes.ok) {
          const s = await subRes.json();
          setSubmissions(s.submissions || []);
        }
      } catch (e) {
        console.error('Failed to load dashboard data', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  const totalProblems = problems.length;
  const solvedIds = userProgress?.solvedProblemIds || [];
  const solvedCount = solvedIds.length;

  const easyTotal = problems.filter(p => p.difficulty === 'Easy').length;
  const medTotal = problems.filter(p => p.difficulty === 'Medium').length;
  const hardTotal = problems.filter(p => p.difficulty === 'Hard').length;

  const easySolved = problems.filter(p => p.difficulty === 'Easy' && solvedIds.includes(p.id)).length;
  const medSolved = problems.filter(p => p.difficulty === 'Medium' && solvedIds.includes(p.id)).length;
  const hardSolved = problems.filter(p => p.difficulty === 'Hard' && solvedIds.includes(p.id)).length;

  const overallPercent = totalProblems > 0 ? Math.round((solvedCount / totalProblems) * 100) : 0;

  // Recommended next problem: First unsolved problem
  const recommendedProblem = problems.find(p => !solvedIds.includes(p.id)) || problems[0];

  // Topic mastery calculation
  const topicsMap: Record<string, { total: number; solved: number }> = {};
  problems.forEach(p => {
    p.topics.forEach(t => {
      if (!topicsMap[t]) topicsMap[t] = { total: 0, solved: 0 };
      topicsMap[t].total += 1;
      if (solvedIds.includes(p.id)) {
        topicsMap[t].solved += 1;
      }
    });
  });

  const topicMasteryList = Object.entries(topicsMap)
    .map(([topic, stats]) => ({
      topic,
      ...stats,
      percent: Math.round((stats.solved / stats.total) * 100)
    }))
    .sort((a, b) => b.percent - a.percent);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080c16] text-slate-900 dark:text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Welcome & Overview Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 text-xs font-mono mb-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{user ? `ACCOUNT: ${user.email}` : 'GUEST LEARNER'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {user ? `Welcome back, ${user.firstName}!` : 'Progress Dashboard'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">
              {user 
                ? 'Your personal algorithm progression, streak status, and live evaluation track record.' 
                : 'Track algorithm mastery, streak maintenance, and recent evaluations.'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/problems"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center space-x-1.5 transition-all"
            >
              <Code2 className="w-4 h-4" />
              <span>Continue Practicing</span>
            </Link>
          </div>
        </div>

        {/* Daily Challenge + Recommended Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Daily Challenge */}
          <div className="md:col-span-2 p-6 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-amber-950/40 dark:via-orange-950/20 dark:to-slate-900 border border-slate-200 dark:border-amber-500/30 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 text-xs font-mono font-semibold mb-2">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500 dark:fill-amber-400 dark:text-amber-400 animate-bounce" />
                <span>TODAY'S FEATURED CHALLENGE</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                Two Sum Target
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed max-w-lg">
                The classical array hashing problem. Master hash map lookups to reduce a quadratic O(n^2) brute force down to linear O(n).
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center space-x-3 text-xs font-mono text-slate-500 dark:text-slate-400">
                <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                  Easy
                </span>
                <span>Arrays, Hash Maps</span>
                <span>+15 XP</span>
              </div>
              <Link
                href="/problems/two-sum-target"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/20"
              >
                <span>Solve Today</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Streak & Consistency Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">CURRENT STREAK</span>
                <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {userProgress?.currentStreak ?? 0}
                </span>
                <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold uppercase">Days Active</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Longest recorded streak: <strong className="text-slate-900 dark:text-slate-200">{userProgress?.longestStreak ?? 0} days</strong>. Practice daily to keep your flame blazing!
              </p>
            </div>

            {/* Streak mini week dots */}
            <div className="grid grid-cols-7 gap-1.5 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-center font-mono text-[10px]">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                const active = i < (userProgress?.currentStreak ?? 1);
                return (
                  <div key={i} className="flex flex-col items-center space-y-1">
                    <span className="text-slate-500">{day}</span>
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        active
                          ? 'bg-orange-500 text-white font-bold shadow-sm shadow-orange-500/50'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {active ? '✓' : '·'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {/* Solved Problems Gauge */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1220] border border-slate-200 dark:border-slate-800/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">SOLVED PROBLEMS</span>
              <Award className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{solvedCount}</span>
                <span className="text-xs text-slate-500 font-mono"> / {totalProblems}</span>
              </div>
              <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-bold">{overallPercent}%</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
          </div>

          {/* Easy Breakdown */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1220] border border-slate-200 dark:border-slate-800/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">EASY DIFFICULTY</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{easySolved}</span>
                <span className="text-xs text-slate-500 font-mono"> / {easyTotal}</span>
              </div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                {easyTotal > 0 ? Math.round((easySolved / easyTotal) * 100) : 0}%
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${easyTotal > 0 ? (easySolved / easyTotal) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Medium Breakdown */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1220] border border-slate-200 dark:border-slate-800/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">MEDIUM DIFFICULTY</span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{medSolved}</span>
                <span className="text-xs text-slate-500 font-mono"> / {medTotal}</span>
              </div>
              <span className="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">
                {medTotal > 0 ? Math.round((medSolved / medTotal) * 100) : 0}%
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${medTotal > 0 ? (medSolved / medTotal) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Hard Breakdown */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0d1220] border border-slate-200 dark:border-slate-800/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold">HARD DIFFICULTY</span>
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">{hardSolved}</span>
                <span className="text-xs text-slate-500 font-mono"> / {hardTotal}</span>
              </div>
              <span className="text-xs font-mono text-rose-600 dark:text-rose-400 font-semibold">
                {hardTotal > 0 ? Math.round((hardSolved / hardTotal) * 100) : 0}%
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${hardTotal > 0 ? (hardSolved / hardTotal) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lower Grid: Topic Mastery & Recent Submissions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Topic Mastery Progress */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1220] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Topic Mastery Progression</h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{topicMasteryList.length} Topics</span>
            </div>

            <div className="space-y-3 pt-2">
              {topicMasteryList.slice(0, 6).map(tm => (
                <div key={tm.topic} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 dark:text-slate-200">{tm.topic}</span>
                    <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {tm.solved} / {tm.total} ({tm.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all"
                      style={{ width: `${tm.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Submissions Feed */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1220] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Recent Submissions</h3>
              </div>
              <Link href="/submissions" className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-2.5 pt-2">
              {submissions.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No submissions yet. Start solving problems!
                </div>
              ) : (
                submissions.slice(0, 5).map(sub => (
                  <div
                    key={sub.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <Link
                        href={`/problems/${sub.problemSlug}`}
                        className="font-semibold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block"
                      >
                        {sub.problemTitle}
                      </Link>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono mt-0.5">
                        <span className="uppercase">{sub.language}</span>
                        <span>•</span>
                        <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.status === 'Accepted'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {sub.status}
                      </span>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {sub.executionTimeMs} ms
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
