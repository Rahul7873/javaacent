'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Tag, 
  BarChart3, 
  Check,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Problem, Difficulty } from '@/types';
import { usePlatform } from '@/context/PlatformContext';

export default function ProblemsPage() {
  const { isSolved, isAttempted, userProgress } = usePlatform();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCurriculum, setSelectedCurriculum] = useState<'All' | 'DSA' | 'Basic Practice'>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Attempted' | 'Todo'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  useEffect(() => {
    async function fetchProblems() {
      try {
        setLoading(true);
        const res = await fetch('/api/problems');
        if (res.ok) {
          const data = await res.json();
          setProblems(data.problems || []);
        }
      } catch (err) {
        console.error('Failed to load problems', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProblems();
  }, []);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCurriculum, selectedDifficulty, selectedTopic, statusFilter]);

  // Collect unique topics
  const allTopics = Array.from(
    new Set(problems.flatMap(p => p.topics))
  ).sort();

  // Filter problems
  const filteredProblems = problems.filter(prob => {
    const matchesCurriculum =
      selectedCurriculum === 'All' ||
      (selectedCurriculum === 'Basic Practice'
        ? prob.category === 'Basic Practice'
        : prob.category !== 'Basic Practice');

    const matchesSearch =
      prob.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prob.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDiff =
      selectedDifficulty === 'All' ||
      prob.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesTopic =
      selectedTopic === 'All' || prob.topics.includes(selectedTopic);

    const solved = isSolved(prob.id);
    const attempted = isAttempted(prob.id);

    let matchesStatus = true;
    if (statusFilter === 'Solved') matchesStatus = solved;
    if (statusFilter === 'Attempted') matchesStatus = attempted && !solved;
    if (statusFilter === 'Todo') matchesStatus = !solved && !attempted;

    return matchesCurriculum && matchesSearch && matchesDiff && matchesTopic && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredProblems.length / pageSize));
  const paginatedProblems = filteredProblems.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totalCount = problems.length;
  const basicCount = problems.filter(p => p.category === 'Basic Practice').length;
  const dsaCount = problems.filter(p => p.category !== 'Basic Practice').length;
  const easyCount = problems.filter(p => p.difficulty === 'Easy').length;
  const medCount = problems.filter(p => p.difficulty === 'Medium').length;
  const hardCount = problems.filter(p => p.difficulty === 'Hard').length;
  const solvedCount = userProgress?.solvedProblemIds.length ?? 0;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Banner Section */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-orange-950/20 to-slate-900 border border-amber-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono mb-1">
              <span className="text-sm">☕</span>
              <span>JAVA 17 & COLLECTIONS CURRICULUM</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Java Algorithm & Problem Catalog
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-xl">
              Solve original interview and logic problems compiled with native <code className="text-amber-300 font-mono">javac 17</code>, featuring Java Collections cheat sheets and Socratic AI hints.
            </p>
          </div>

          {/* Quick Stats Pill Strip */}
          <div className="flex items-center space-x-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-xs font-mono">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-emerald-400 font-bold text-base">{solvedCount}</div>
              <div className="text-[10px] text-slate-500 uppercase">Solved</div>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-slate-200 font-bold text-base">{totalCount}</div>
              <div className="text-[10px] text-slate-500 uppercase">Total</div>
            </div>
            <div className="text-center px-2">
              <div className="flex space-x-1 text-[11px] font-semibold">
                <span className="text-emerald-400">{easyCount}E</span>
                <span className="text-slate-600">/</span>
                <span className="text-amber-400">{medCount}M</span>
                <span className="text-slate-600">/</span>
                <span className="text-rose-400">{hardCount}H</span>
              </div>
              <div className="text-[10px] text-slate-500 uppercase">Spread</div>
            </div>
          </div>
        </div>

        {/* Curriculum Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0d1220] p-2.5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center space-x-1.5 overflow-x-auto">
            <button
              onClick={() => setSelectedCurriculum('All')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCurriculum === 'All'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              All Curricula ({totalCount})
            </button>
            <button
              onClick={() => setSelectedCurriculum('DSA')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCurriculum === 'DSA'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Algorithms & DSA ({dsaCount})
            </button>
            <button
              onClick={() => setSelectedCurriculum('Basic Practice')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCurriculum === 'Basic Practice'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10'
              }`}
            >
              Basic Practice ({basicCount})
            </button>
          </div>

          <Link
            href="/basic-practice"
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:text-white hover:bg-amber-500/20 text-xs font-medium transition-all"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>Dedicated Basic Practice Hub</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-xl bg-[#0d1220] border border-slate-800/80 space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title, topic, or keyword..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Difficulty Tabs */}
            <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs w-full md:w-auto overflow-x-auto">
              {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    selectedDifficulty === diff
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 text-xs w-full md:w-auto overflow-x-auto">
              {(['All', 'Solved', 'Attempted', 'Todo'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-800 text-indigo-400 border border-indigo-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
            <span className="text-[11px] text-slate-500 font-mono flex items-center space-x-1 pr-1">
              <Tag className="w-3 h-3 text-slate-400" />
              <span>Topics:</span>
            </span>
            <button
              onClick={() => setSelectedTopic('All')}
              className={`px-2.5 py-1 rounded-full text-xs font-mono shrink-0 transition-colors ${
                selectedTopic === 'All'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              All Topics
            </button>
            {allTopics.map(topic => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-2.5 py-1 rounded-full text-xs font-mono shrink-0 transition-colors ${
                  selectedTopic === topic
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Problems Table / List */}
        <div className="rounded-xl border border-slate-800/80 bg-[#0d1220] overflow-hidden shadow-xl">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 space-x-2">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="font-mono text-sm">Loading problem catalog...</span>
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-2">
              <Code2 className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm">No problems match your current search and filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDifficulty('All');
                  setSelectedTopic('All');
                  setStatusFilter('All');
                }}
                className="text-xs text-indigo-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-3 px-4 w-12 text-center">Status</th>
                    <th className="py-3 px-4">Problem Title</th>
                    <th className="py-3 px-4">Topics</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Acceptance</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {paginatedProblems.map(prob => {
                    const solved = isSolved(prob.id);
                    const attempted = isAttempted(prob.id);

                    return (
                      <tr
                        key={prob.id}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Status */}
                        <td className="py-3.5 px-4 text-center">
                          {solved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
                          ) : attempted ? (
                            <Circle className="w-4 h-4 text-amber-400 mx-auto" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-slate-700 mx-auto inline-block" />
                          )}
                        </td>

                        {/* Title */}
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/problems/${prob.slug}`}
                            className="font-semibold text-slate-100 group-hover:text-indigo-400 transition-colors flex items-center space-x-2"
                          >
                            <span>{prob.title}</span>
                          </Link>
                        </td>

                        {/* Topics */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1">
                            {prob.topics.map(topic => (
                              <span
                                key={topic}
                                className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Difficulty */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              prob.difficulty === 'Easy'
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                                : prob.difficulty === 'Medium'
                                ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                                : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                        </td>

                        {/* Acceptance */}
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {prob.acceptanceRate}
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/problems/${prob.slug}`}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 font-medium transition-colors"
                          >
                            <span>Solve</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination bar */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono bg-slate-900/60">
                  <div className="text-slate-400">
                    Showing {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredProblems.length)} of {filteredProblems.length}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 flex items-center space-x-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>
                    <span className="px-2 text-slate-300">
                      Page {currentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 flex items-center space-x-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
