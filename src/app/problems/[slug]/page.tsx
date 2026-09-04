'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Play, 
  Send, 
  Sparkles, 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  FileCode, 
  Layers, 
  BookOpen, 
  HelpCircle, 
  Code2, 
  Award,
  AlertCircle,
  Maximize2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Navbar } from '@/components/Navbar';
import { MonacoEditor } from '@/components/MonacoEditor';
import { OutputDock } from '@/components/OutputDock';
import { AiTutorPanel } from '@/components/AiTutorPanel';
import { Problem, Language, ExecutionResponse, Submission } from '@/types';
import { usePlatform } from '@/context/PlatformContext';

const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'java', label: 'Java 17 (JDK)' },
  { id: 'python', label: 'Python 3' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'cpp', label: 'C++ 20' }
];

export default function ProblemWorkspacePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const { refreshProgress, isSolved } = usePlatform();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [language, setLanguage] = useState<Language>('java');
  const [code, setCode] = useState<string>('');
  const [activeLeftTab, setActiveLeftTab] = useState<'description' | 'hints' | 'submissions' | 'solution'>('description');
  
  const [activeOutputTab, setActiveOutputTab] = useState<'testcases' | 'result'>('testcases');
  const [executionResult, setExecutionResult] = useState<ExecutionResponse | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [isJavaSheetOpen, setIsJavaSheetOpen] = useState(false);
  const [submissionsList, setSubmissionsList] = useState<Submission[]>([]);

  // Smart back navigation preserving previous page & filters
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      const lastCatalog = localStorage.getItem('javaascent_last_catalog_url');
      if (lastCatalog) {
        router.push(lastCatalog);
        return;
      }
    }
    if (problem?.category === 'Basic Practice') {
      router.push('/basic-practice');
    } else {
      router.push('/problems');
    }
  };

  // Fetch problem details
  useEffect(() => {
    async function loadProblem() {
      try {
        setLoading(true);
        const res = await fetch(`/api/problems/${slug}`);
        if (!res.ok) {
          throw new Error('Problem not found');
        }
        const data: Problem = await res.json();
        setProblem(data);
        
        // Restore user's in-progress code from localStorage (shared preferences) or use starter code
        let initialCode = data.starterCode.java || data.starterCode.python || '';
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem(`javaascent_code_${data.id}_java`);
          if (saved && saved.trim()) {
            initialCode = saved;
          }
        }
        setCode(initialCode);
      } catch (err: any) {
        setError(err.message || 'Failed to load problem');
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [slug]);

  // Handle code edit with localStorage persistence
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    if (problem && typeof window !== 'undefined') {
      try {
        localStorage.setItem(`javaascent_code_${problem.id}_${language}`, newCode);
      } catch (e) {}
    }
  };

  // Update code when language changes
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    if (problem) {
      let langCode = problem.starterCode[newLang] || '';
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(`javaascent_code_${problem.id}_${newLang}`);
        if (saved && saved.trim()) {
          langCode = saved;
        }
      }
      setCode(langCode);
    }
  };

  // Reset code to current language's starter template and clear saved preference
  const handleResetCode = () => {
    if (problem && problem.starterCode[language]) {
      setCode(problem.starterCode[language]);
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(`javaascent_code_${problem.id}_${language}`);
        } catch (e) {}
      }
    }
  };

  // Load submissions for this problem
  const loadSubmissions = async () => {
    if (!problem) return;
    try {
      const res = await fetch(`/api/submissions?problemId=${problem.id}`);
      if (res.ok) {
        const data = await res.json();
        setSubmissionsList(data.submissions || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run Code against visible test cases
  const handleRun = async () => {
    if (!problem || isRunning || isSubmitting) return;
    setIsRunning(true);
    setActiveOutputTab('result');

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language,
          isSubmit: false
        })
      });

      const data: ExecutionResponse = await res.json();
      setExecutionResult(data);
    } catch (err) {
      console.error('Execution error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  // Submit Code against all (visible + hidden) test cases
  const handleSubmit = async () => {
    if (!problem || isRunning || isSubmitting) return;
    setIsSubmitting(true);
    setActiveOutputTab('result');

    try {
      const res = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          code,
          language,
          isSubmit: true
        })
      });

      const data = await res.json();
      setExecutionResult(data);

      if (data.status === 'Accepted') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        refreshProgress();
      }

      loadSubmissions();
    } catch (err) {
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center space-x-3 text-slate-400">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-mono text-sm">Loading coding workspace...</span>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-3" />
          <h2 className="text-xl font-bold text-white mb-2">Problem Not Found</h2>
          <p className="text-slate-400 text-sm mb-4">
            The problem "{slug}" could not be loaded or does not exist.
          </p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm transition-colors"
          >
            Back to Problems
          </button>
        </div>
      </div>
    );
  }

  const isSolvedAlready = isSolved(problem.id);

  return (
    <div className="h-screen flex flex-col bg-[#070a12] text-slate-100 overflow-hidden">
      <Navbar />

      {/* Top Workspace Action Ribbon */}
      <div className="h-12 bg-[#0b0f1a] border-b border-slate-800/80 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBack}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            title="Back to Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-semibold text-white tracking-tight flex items-center space-x-2">
              <span>{problem.title}</span>
              {isSolvedAlready && (
                <span title="Solved">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 inline shrink-0" />
                </span>
              )}
            </h1>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                problem.difficulty === 'Easy'
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                  : problem.difficulty === 'Medium'
                  ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                  : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-3">
          {/* Language Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <select
              value={language}
              onChange={e => handleLanguageChange(e.target.value as Language)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.id} value={lang.id} className="bg-slate-900 text-slate-100">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Java Collections Quick Reference Sheet Button */}
          <button
            onClick={() => setIsJavaSheetOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
            title="Open Java Collections & DSA Quick Reference"
          >
            <span>☕</span>
            <span className="hidden sm:inline">Java Guide</span>
          </button>

          {/* AI Tutor Toggle Button with Glowing Badge */}
          <button
            onClick={() => setIsTutorOpen(o => !o)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md ${
              isTutorOpen
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white ring-2 ring-purple-400/40 shadow-purple-500/20'
                : 'bg-slate-800/90 hover:bg-slate-700/80 text-purple-300 border border-purple-500/30 hover:border-purple-500/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>AI Tutor</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 text-xs font-medium disabled:opacity-50 transition-colors"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : 'text-slate-300'}`} />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
          </button>

          {/* Submit Code Button */}
          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all hover:scale-[1.02]"
          >
            <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
          </button>
        </div>
      </div>

      {/* Main Split-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Problem Statement & Documentation */}
        <div className="w-1/2 flex flex-col border-r border-slate-800 bg-[#090d17] overflow-hidden">
          {/* Left Tabs */}
          <div className="flex items-center px-4 bg-slate-900/70 border-b border-slate-800 text-xs shrink-0">
            <button
              onClick={() => setActiveLeftTab('description')}
              className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 font-medium transition-colors ${
                activeLeftTab === 'description'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Description</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('hints')}
              className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 font-medium transition-colors ${
                activeLeftTab === 'hints'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hints (6 Levels)</span>
            </button>

            <button
              onClick={() => {
                setActiveLeftTab('submissions');
                loadSubmissions();
              }}
              className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 font-medium transition-colors ${
                activeLeftTab === 'submissions'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Submissions</span>
            </button>

            <button
              onClick={() => setActiveLeftTab('solution')}
              className={`flex items-center space-x-1.5 py-2.5 px-3 border-b-2 font-medium transition-colors ${
                activeLeftTab === 'solution'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Optimal Solution</span>
            </button>
          </div>

          {/* Left Content Scroll Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300">
            {activeLeftTab === 'description' && (
              <div className="space-y-6">
                {/* Topic tags */}
                <div className="flex flex-wrap gap-1.5">
                  {problem.topics.map(t => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-mono"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 text-xs text-slate-400 font-mono">
                    Acceptance: {problem.acceptanceRate}
                  </span>
                </div>

                {/* Description Body */}
                <div className="prose prose-invert prose-sm max-w-none leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Examples
                  </h3>
                  {problem.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 space-y-2 font-mono text-xs"
                    >
                      <div className="text-slate-400 font-sans font-semibold text-xs text-indigo-300">
                        Example {i + 1}:
                      </div>
                      <div>
                        <span className="text-slate-500">Input: </span>
                        <span className="text-slate-200">{ex.input}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Output: </span>
                        <span className="text-emerald-400">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div>
                          <span className="text-slate-500">Explanation: </span>
                          <span className="text-slate-300">{ex.explanation}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-2">
                  <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400">
                    Constraints
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs font-mono text-slate-300 pl-1">
                    {problem.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeLeftTab === 'hints' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-300 flex items-start space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>
                    Our Socratic teaching hierarchy provides progressive hints without giving away the answer at once.
                  </span>
                </div>

                {/* 6 Levels of Hints */}
                <div className="space-y-3">
                  <details className="group border border-slate-800 rounded-lg p-3 bg-slate-900/60">
                    <summary className="font-semibold text-xs text-slate-200 cursor-pointer flex items-center justify-between">
                      <span>Level 1: Guiding Question</span>
                      <span className="text-xs text-indigo-400 group-open:rotate-90 transition-transform">▸</span>
                    </summary>
                    <p className="mt-2 text-xs text-slate-300 pl-2 border-l border-indigo-500/40">
                      {problem.hints.level1}
                    </p>
                  </details>

                  <details className="group border border-slate-800 rounded-lg p-3 bg-slate-900/60">
                    <summary className="font-semibold text-xs text-slate-200 cursor-pointer flex items-center justify-between">
                      <span>Level 2: Conceptual Hint</span>
                      <span className="text-xs text-indigo-400 group-open:rotate-90 transition-transform">▸</span>
                    </summary>
                    <p className="mt-2 text-xs text-slate-300 pl-2 border-l border-indigo-500/40">
                      {problem.hints.level2}
                    </p>
                  </details>

                  <details className="group border border-slate-800 rounded-lg p-3 bg-slate-900/60">
                    <summary className="font-semibold text-xs text-slate-200 cursor-pointer flex items-center justify-between">
                      <span>Level 3: Pattern & Data Structure</span>
                      <span className="text-xs text-indigo-400 group-open:rotate-90 transition-transform">▸</span>
                    </summary>
                    <p className="mt-2 text-xs text-slate-300 pl-2 border-l border-indigo-500/40">
                      {problem.hints.level3}
                    </p>
                  </details>

                  <details className="group border border-slate-800 rounded-lg p-3 bg-slate-900/60">
                    <summary className="font-semibold text-xs text-slate-200 cursor-pointer flex items-center justify-between">
                      <span>Level 4: Algorithmic Approach</span>
                      <span className="text-xs text-indigo-400 group-open:rotate-90 transition-transform">▸</span>
                    </summary>
                    <p className="mt-2 text-xs text-slate-300 pl-2 border-l border-indigo-500/40">
                      {problem.hints.level4}
                    </p>
                  </details>

                  <details className="group border border-slate-800 rounded-lg p-3 bg-slate-900/60">
                    <summary className="font-semibold text-xs text-slate-200 cursor-pointer flex items-center justify-between">
                      <span>Level 5: Complexity Analysis</span>
                      <span className="text-xs text-indigo-400 group-open:rotate-90 transition-transform">▸</span>
                    </summary>
                    <p className="mt-2 text-xs text-slate-300 pl-2 border-l border-indigo-500/40">
                      {problem.hints.level5}
                    </p>
                  </details>

                  <details className="group border border-slate-800 rounded-lg p-3 bg-slate-900/60">
                    <summary className="font-semibold text-xs text-slate-200 cursor-pointer flex items-center justify-between">
                      <span>Level 6: Full Solution Code</span>
                      <span className="text-xs text-indigo-400 group-open:rotate-90 transition-transform">▸</span>
                    </summary>
                    <pre className="mt-2 p-2 rounded bg-slate-950 font-mono text-[11px] text-slate-200 whitespace-pre-wrap overflow-x-auto">
                      {problem.hints.level6}
                    </pre>
                  </details>
                </div>
              </div>
            )}

            {activeLeftTab === 'submissions' && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Submission History
                </h3>
                {submissionsList.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-xs">
                    No submissions recorded yet for this problem.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {submissionsList.map(sub => (
                      <div
                        key={sub.id}
                        className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`font-semibold ${
                              sub.status === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {sub.status}
                          </span>
                          <span className="text-slate-500 font-mono">({sub.language})</span>
                        </div>
                        <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                          <span>{sub.executionTimeMs} ms</span>
                          <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeLeftTab === 'solution' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs">
                  <div>
                    <span className="text-slate-500">Time Complexity: </span>
                    <span className="text-indigo-400 font-bold">{problem.timeComplexity}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Space Complexity: </span>
                    <span className="text-purple-400 font-bold">{problem.spaceComplexity}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-slate-300">Detailed Implementation:</h4>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs whitespace-pre-wrap overflow-x-auto">
                    {problem.hints.level6}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Editor + Output Dock */}
        <div className={`flex flex-col ${isTutorOpen ? 'w-2/6' : 'w-1/2'} transition-all overflow-hidden`}>
          {/* Top Half: Monaco Editor */}
          <div className="h-[60%] p-2 bg-[#080c16]">
            <MonacoEditor
              language={language}
              value={code}
              onChange={handleCodeChange}
              onReset={handleResetCode}
            />
          </div>

          {/* Bottom Half: Test Cases / Output Dock */}
          <div className="h-[40%] p-2 bg-[#080c16]">
            <OutputDock
              testCases={problem.testCases}
              executionResult={executionResult}
              isRunning={isRunning || isSubmitting}
              activeTab={activeOutputTab}
              setActiveTab={setActiveOutputTab}
            />
          </div>
        </div>

        {/* Third Panel: AI Tutor Side Panel (When Toggled) */}
        {isTutorOpen && (
          <div className="w-2/6 transition-all h-full">
            <AiTutorPanel
              problem={problem}
              currentCode={code}
              language={language}
              lastError={executionResult?.compileError || executionResult?.runtimeError}
              isOpen={isTutorOpen}
              onClose={() => setIsTutorOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Java Collections & DSA Quick Reference Modal */}
      {isJavaSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0f1a] border border-amber-500/40 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">☕</span>
                <div>
                  <h3 className="font-bold text-sm text-white">Java 17 Collections & DSA Cheat Sheet</h3>
                  <p className="text-[11px] text-amber-300/80 font-mono">Standard library references for competitive programming</p>
                </div>
              </div>
              <button
                onClick={() => setIsJavaSheetOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 font-mono text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block">1. HashMap / HashSet</span>
                <div className="text-slate-400 text-[11px]">
                  <code>Map&lt;Integer, Integer&gt; map = new HashMap&lt;&gt;();</code><br />
                  <code>map.put(key, val); map.get(key); map.containsKey(key);</code><br />
                  <code>map.getOrDefault(key, 0); map.keySet();</code>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block">2. Deque (Stack & Queue)</span>
                <div className="text-slate-400 text-[11px]">
                  <code>Deque&lt;Integer&gt; stack = new ArrayDeque&lt;&gt;(); // Preferred over Stack</code><br />
                  <code>stack.push(val); stack.pop(); stack.peek(); stack.isEmpty();</code><br />
                  <code>Queue&lt;Integer&gt; q = new LinkedList&lt;&gt;(); q.offer(val); q.poll();</code>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block">3. PriorityQueue (Min / Max Heap)</span>
                <div className="text-slate-400 text-[11px]">
                  <code>PriorityQueue&lt;Integer&gt; minHeap = new PriorityQueue&lt;&gt;();</code><br />
                  <code>PriorityQueue&lt;Integer&gt; maxHeap = new PriorityQueue&lt;&gt;((a, b) -&gt; b - a);</code><br />
                  <code>minHeap.offer(x); minHeap.poll(); minHeap.peek();</code>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-amber-400 font-bold block">4. Strings & Sorting</span>
                <div className="text-slate-400 text-[11px]">
                  <code>StringBuilder sb = new StringBuilder(); sb.append(s).reverse().toString();</code><br />
                  <code>Arrays.sort(arr); Collections.sort(list);</code><br />
                  <code>char[] chars = s.toCharArray(); String.valueOf(chars);</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
