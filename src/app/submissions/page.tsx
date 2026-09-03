'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Code, 
  Cpu, 
  Filter, 
  Eye, 
  X,
  User as UserIcon,
  LogIn,
  UserPlus
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Submission, SubmissionStatus, Language } from '@/types';
import { usePlatform } from '@/context/PlatformContext';

export default function SubmissionsPage() {
  const { user } = usePlatform();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [languageFilter, setLanguageFilter] = useState<string>('All');
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [inspectedSubmission, setInspectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    async function loadSubmissions() {
      try {
        setLoading(true);
        const url = showAllUsers ? '/api/submissions?all=true' : '/api/submissions';
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data.submissions || []);
        }
      } catch (e) {
        console.error('Failed to load submissions', e);
      } finally {
        setLoading(false);
      }
    }
    loadSubmissions();
  }, [showAllUsers]);

  const filtered = submissions.filter(sub => {
    const matchStatus = statusFilter === 'All' || sub.status === statusFilter;
    const matchLang = languageFilter === 'All' || sub.language.toLowerCase() === languageFilter.toLowerCase();
    return matchStatus && matchLang;
  });

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Guest Banner */}
        {!user && (
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <UserIcon className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-xs font-semibold text-white">Log in to save your personal track record</span>
                <p className="text-[11px] text-slate-400">
                  Submissions made while logged in are permanently linked to your personal profile.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/login"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white border border-slate-700 hover:bg-slate-700 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold transition-all"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
              <History className="w-6 h-6 text-indigo-400" />
              <span>
                {user ? `${user.firstName}'s Submission Track Record` : 'Submission History'}
              </span>
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Complete evaluation log of evaluated solutions, runtime metrics, and test case outcomes.
            </p>
          </div>

          {/* Filters & View Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {user && (
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setShowAllUsers(false)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    !showAllUsers
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  My Submissions
                </button>
                <button
                  onClick={() => setShowAllUsers(true)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    showAllUsers
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Activity
                </button>
              </div>
            )}

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Accepted">Accepted</option>
              <option value="Wrong Answer">Wrong Answer</option>
              <option value="Time Limit Exceeded">Time Limit Exceeded</option>
              <option value="Runtime Error">Runtime Error</option>
            </select>

            <select
              value={languageFilter}
              onChange={e => setLanguageFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="All">All Languages</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="rounded-xl border border-slate-800 bg-[#0d1220] overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 space-x-2">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="font-mono text-sm">Loading submission logs...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs space-y-2">
              <History className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No submissions found in this record.</p>
              <Link
                href="/problems"
                className="inline-block px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500 transition-colors"
              >
                Solve a Problem
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-3 px-4">Problem</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Language</th>
                    <th className="py-3 px-4">Runtime</th>
                    <th className="py-3 px-4">Memory</th>
                    <th className="py-3 px-4">Test Cases</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filtered.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          href={`/problems/${sub.problemSlug}`}
                          className="font-semibold text-slate-200 hover:text-indigo-400 transition-colors"
                        >
                          {sub.problemTitle}
                        </Link>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-300">
                        {sub.userName || 'Anonymous'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            sub.status === 'Accepted'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                              : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {sub.status === 'Accepted' ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          <span>{sub.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono uppercase text-slate-300">
                        {sub.language}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {sub.executionTimeMs} ms
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {sub.memoryMb} MB
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {sub.passCount} / {sub.totalCount}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(sub.createdAt).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setInspectedSubmission(sub)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Code</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Code Inspector Modal */}
      {inspectedSubmission && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0f1a] border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">
                  {inspectedSubmission.problemTitle}
                </h3>
                <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400 mt-0.5">
                  <span className="uppercase">{inspectedSubmission.language}</span>
                  <span>•</span>
                  <span>{inspectedSubmission.status}</span>
                  <span>•</span>
                  <span>{inspectedSubmission.executionTimeMs} ms</span>
                  <span>•</span>
                  <span>Submitted by: {inspectedSubmission.userName}</span>
                </div>
              </div>

              <button
                onClick={() => setInspectedSubmission(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Code Viewer */}
            <div className="flex-1 overflow-y-auto p-4">
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap">
                {inspectedSubmission.code}
              </pre>

              {inspectedSubmission.errorMessage && (
                <div className="mt-3 p-3 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-mono whitespace-pre-wrap">
                  {inspectedSubmission.errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
