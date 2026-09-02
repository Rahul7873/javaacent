'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  GraduationCap, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Code2, 
  Tag, 
  ExternalLink, 
  BookOpen, 
  Layers,
  ChevronRight,
  Filter,
  Check,
  Eye,
  X,
  Copy
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Problem, Difficulty } from '@/types';
import { usePlatform } from '@/context/PlatformContext';

export default function BasicPracticePage() {
  const { isSolved, isAttempted, userProgress } = usePlatform();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPart, setSelectedPart] = useState<'All' | 1 | 2>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Attempted' | 'Todo'>('All');

  // Preview Drawer/Modal
  const [previewProblem, setPreviewProblem] = useState<Problem | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function fetchBasicProblems() {
      try {
        setLoading(true);
        const res = await fetch('/api/problems?category=Basic+Practice');
        if (res.ok) {
          const data = await res.json();
          setProblems(data.problems || []);
        }
      } catch (err) {
        console.error('Failed to load basic practice problems', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBasicProblems();
  }, []);

  // Filtered list
  const filteredProblems = problems.filter(prob => {
    // Part filter
    if (selectedPart !== 'All' && prob.part !== selectedPart) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = prob.title.toLowerCase().includes(q);
      const matchesDesc = prob.description.toLowerCase().includes(q);
      const matchesTopic = prob.topics.some(t => t.toLowerCase().includes(q));
      const matchesId = prob.slug.toLowerCase().includes(q) || prob.id.toLowerCase().includes(q);
      if (!matchesTitle && !matchesDesc && !matchesTopic && !matchesId) return false;
    }

    // Difficulty
    if (selectedDifficulty !== 'All' && prob.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()) {
      return false;
    }

    // Topic
    if (selectedTopic !== 'All' && !prob.topics.includes(selectedTopic)) {
      return false;
    }

    // Status
    const solved = isSolved(prob.id);
    const attempted = isAttempted(prob.id);
    if (statusFilter === 'Solved' && !solved) return false;
    if (statusFilter === 'Attempted' && (!attempted || solved)) return false;
    if (statusFilter === 'Todo' && (solved || attempted)) return false;

    return true;
  });

  const part1Count = problems.filter(p => p.part === 1).length;
  const part2Count = problems.filter(p => p.part === 2).length;
  const solvedCount = problems.filter(p => isSolved(p.id)).length;
  const progressPercent = problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0;

  const TOPIC_OPTIONS = [
    'All',
    'Input/Output',
    'Arithmetic & Math',
    'Binary & Conversions',
    'Geometry & Math',
    'Conditionals & Logic',
    'Loops & Numbers',
    'Strings',
    'Arrays & Matrices'
  ];

  const handleCopyStarter = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col selection:bg-amber-500/30">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/40 via-orange-950/20 to-slate-900 border border-amber-500/20 p-6 sm:p-8 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>W3RESOURCE JAVA EXERCISES CURRICULUM</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Java Basic Practice{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">
                  Catalog
                </span>
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                Practice and master all 249 foundational exercises from W3Resource Java programming tutorials. Build intuition for Java 17 syntax, Scanner input, arithmetic formulas, conversions, arrays, strings, and core logic.
              </p>

              <div className="flex items-center space-x-4 pt-1 text-xs">
                <a
                  href="https://www.w3resource.com/java-exercises/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  <span>Source: w3resource.com/java-exercises</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="bg-[#0b0f1a]/95 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col space-y-4 min-w-[280px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">CURRICULUM COMPLETION</span>
                <span className="text-xs font-bold text-amber-400 font-mono">{progressPercent}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center font-mono">
                <div>
                  <div className="text-emerald-400 font-bold text-base">{solvedCount}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Solved</div>
                </div>
                <div>
                  <div className="text-white font-bold text-base">{problems.length}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Total</div>
                </div>
                <div>
                  <div className="text-amber-400 font-bold text-base">{part1Count} / {part2Count}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Pt 1 / Pt 2</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Part Selection & Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2 bg-[#0c101c] p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setSelectedPart('All')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedPart === 'All'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Exercises ({problems.length})
            </button>
            <button
              onClick={() => setSelectedPart(1)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedPart === 1
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Part-I: Foundations (1–150)
            </button>
            <button
              onClick={() => setSelectedPart(2)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedPart === 2
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Part-II: Advanced Logic (151–249)
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1.5 bg-[#0c101c] p-1 rounded-xl border border-slate-800 text-xs">
            {(['All', 'Solved', 'Attempted', 'Todo'] as const).map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  statusFilter === st
                    ? 'bg-slate-800 text-amber-400 border border-amber-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#0c101c] border border-slate-800/80 space-y-3 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by exercise number, title, or topic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Difficulty Tabs */}
            <div className="flex items-center space-x-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
              {['All', 'Easy', 'Medium'].map(diff => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedDifficulty === diff
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
            <span className="text-[11px] text-slate-500 font-mono flex items-center space-x-1 pr-1 shrink-0">
              <Tag className="w-3 h-3 text-amber-400" />
              <span>Topics:</span>
            </span>
            {TOPIC_OPTIONS.map(topic => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3 py-1 rounded-full text-xs font-mono shrink-0 transition-colors ${
                  selectedTopic === topic
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Results Stats */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
          <span>Showing {filteredProblems.length} of {problems.length} exercises</span>
          {(searchQuery || selectedTopic !== 'All' || selectedDifficulty !== 'All' || statusFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTopic('All');
                setSelectedDifficulty('All');
                setStatusFilter('All');
              }}
              className="text-amber-400 hover:underline flex items-center space-x-1"
            >
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Exercise Grid / List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400 space-y-3">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs">Loading W3Resource Java exercises catalog...</span>
          </div>
        ) : filteredProblems.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-slate-800 bg-[#0c101c] space-y-3">
            <Code2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">No exercises matched your current filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTopic('All');
                setSelectedDifficulty('All');
                setStatusFilter('All');
              }}
              className="text-xs text-amber-400 hover:underline font-mono"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProblems.map(prob => {
              const solved = isSolved(prob.id);
              const attempted = isAttempted(prob.id);

              return (
                <div
                  key={prob.id}
                  className="rounded-2xl border border-slate-800/80 bg-[#0c101c]/90 hover:border-amber-500/40 transition-all p-5 flex flex-col justify-between space-y-4 group shadow-lg hover:shadow-amber-500/5"
                >
                  <div className="space-y-3">
                    {/* Header: Part badge & status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700/60">
                          Pt {prob.part || 1}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            prob.difficulty === 'Easy'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {prob.difficulty}
                        </span>
                      </div>

                      {/* Status indicator */}
                      <div>
                        {solved ? (
                          <div className="flex items-center space-x-1 text-emerald-400 text-xs" title="Solved">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[10px] font-mono">Solved</span>
                          </div>
                        ) : attempted ? (
                          <div className="flex items-center space-x-1 text-amber-400 text-xs" title="Attempted">
                            <Circle className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-mono">Attempted</span>
                          </div>
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-700 inline-block" />
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <Link
                      href={`/problems/${prob.slug}`}
                      className="font-bold text-sm text-slate-100 group-hover:text-amber-400 transition-colors block line-clamp-1"
                    >
                      {prob.title}
                    </Link>

                    {/* Description Excerpt */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {prob.description}
                    </p>

                    {/* Topic Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {prob.topics.filter(t => t !== 'Basic Practice').map(topic => (
                        <span
                          key={topic}
                          className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px] font-mono border border-slate-800"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setPreviewProblem(prob)}
                      className="text-slate-400 hover:text-slate-200 flex items-center space-x-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>

                    <Link
                      href={`/problems/${prob.slug}`}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-semibold border border-amber-500/30 transition-all text-xs"
                    >
                      <span>Solve in Java 17</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal / Drawer for Quick Preview */}
        {previewProblem && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#0c101c] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-xs font-mono text-amber-400 mb-1">
                    <span>Part {previewProblem.part || 1}</span>
                    <span>•</span>
                    <span>{previewProblem.difficulty}</span>
                    <span>•</span>
                    <span>{previewProblem.acceptanceRate}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {previewProblem.title}
                  </h3>
                </div>
                <button
                  onClick={() => setPreviewProblem(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 text-xs leading-relaxed flex-1">
                {/* Description */}
                <div className="space-y-2">
                  <h4 className="font-mono text-slate-400 uppercase text-[11px] font-bold">
                    Problem Specification
                  </h4>
                  <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200 whitespace-pre-wrap leading-relaxed font-sans text-xs">
                    {previewProblem.description}
                  </div>
                </div>

                {/* Sample Test Data & Expected Output */}
                {previewProblem.examples && previewProblem.examples.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-mono text-slate-400 uppercase text-[11px] font-bold">
                      Example Test Data & Expected Output
                    </h4>
                    {previewProblem.examples.map((ex, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 font-mono text-[11px]">
                        <div>
                          <span className="text-slate-400">Input: </span>
                          <span className="text-amber-300">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Output: </span>
                          <span className="text-emerald-400">{ex.output}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Starter Code Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-mono text-slate-400 uppercase text-[11px] font-bold">
                      Java 17 Starter Scaffolding
                    </h4>
                    <button
                      onClick={() => handleCopyStarter(previewProblem.starterCode.java)}
                      className="text-amber-400 hover:text-amber-300 flex items-center space-x-1 font-mono text-[11px]"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#060810] border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
                    <code>{previewProblem.starterCode.java}</code>
                  </pre>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`https://www.w3resource.com/java-exercises/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-200 text-xs flex items-center space-x-1 font-mono"
                >
                  <span>W3Resource Exercise</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <Link
                  href={`/problems/${previewProblem.slug}`}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center space-x-2 transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Code2 className="w-4 h-4" />
                  <span>Launch in Java 17 Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
