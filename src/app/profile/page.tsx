'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  User as UserIcon, 
  Flame, 
  CheckCircle2, 
  Award, 
  Calendar, 
  ExternalLink, 
  Mail, 
  LogIn, 
  UserPlus,
  Clock,
  Target
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { usePlatform } from '@/context/PlatformContext';
import { Problem } from '@/types';

export default function ProfilePage() {
  const { user, userProgress, authLoading } = usePlatform();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProblems() {
      try {
        const res = await fetch('/api/problems');
        if (res.ok) {
          const data = await res.json();
          setProblems(data.problems || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, []);

  const solvedIds = userProgress?.solvedProblemIds || [];
  const solvedProblems = problems.filter(p => solvedIds.includes(p.id));

  const initials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() || 'U'
    : 'GL';

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Guest Warning Banner if not signed in */}
        {!authLoading && !user && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Browsing as Guest</h4>
                <p className="text-xs text-slate-400">
                  Create an account or sign in to permanently save your solved questions, code track record, and streak.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Link
                href="/auth/login"
                className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-center transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-center shadow-md shadow-amber-500/20 transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        {/* Profile Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-indigo-500/20">
            {initials}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {user ? `${user.firstName} ${user.lastName}` : 'Guest Learner'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {user ? 'AUTHENTICATED LEARNER' : 'GUEST MODE'}
              </span>
            </div>

            {user?.email && (
              <p className="text-slate-400 text-xs sm:text-sm mt-1 flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{user.email}</span>
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 mt-3">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Member since {memberSince}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>{userProgress?.currentStreak ?? 0} Day Streak</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl bg-[#0d1220] border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase">Total Solved</span>
            <div className="text-3xl font-bold text-white font-mono">{solvedProblems.length}</div>
            <p className="text-[11px] text-slate-500">Across arrays, DP, trees & graphs</p>
          </div>

          <div className="p-5 rounded-xl bg-[#0d1220] border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-orange-400 uppercase">Current Streak</span>
            <div className="text-3xl font-bold text-orange-400 font-mono">
              {userProgress?.currentStreak ?? 0} days
            </div>
            <p className="text-[11px] text-slate-500">
              Longest recorded: {userProgress?.longestStreak ?? 0} days
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[#0d1220] border border-slate-800 space-y-1">
            <span className="text-xs font-mono text-emerald-400 uppercase">Account Status</span>
            <div className="text-2xl font-bold text-emerald-400 font-mono">
              {user ? 'Active' : 'Unregistered'}
            </div>
            <p className="text-[11px] text-slate-500">
              {user ? 'Cloud sync enabled' : 'Session data local'}
            </p>
          </div>
        </div>

        {/* Solved Problems List */}
        <div className="p-6 rounded-2xl bg-[#0d1220] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Solved Problems ({solvedProblems.length})</span>
            </h3>
            <Link href="/problems" className="text-xs text-indigo-400 hover:underline">
              Browse More Problems
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              Loading solved problems...
            </div>
          ) : solvedProblems.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs space-y-2">
              <Award className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No solved problems recorded for this account yet.</p>
              <Link
                href="/problems"
                className="inline-block px-4 py-2 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
              >
                Start Solving Now
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {solvedProblems.map(prob => (
                <div key={prob.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <Link
                      href={`/problems/${prob.slug}`}
                      className="font-medium text-xs text-slate-200 hover:text-indigo-400 transition-colors"
                    >
                      {prob.title}
                    </Link>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        prob.difficulty === 'Easy'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                          : prob.difficulty === 'Medium'
                          ? 'bg-amber-950 text-amber-400 border-amber-500/30'
                          : 'bg-rose-950 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {prob.difficulty}
                    </span>
                    <Link
                      href={`/problems/${prob.slug}`}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Open problem workspace"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
