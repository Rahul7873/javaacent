'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Terminal, 
  Cpu, 
  Check, 
  AlertTriangle, 
  Layers 
} from 'lucide-react';
import { TestCase, ExecutionResponse } from '@/types';

interface OutputDockProps {
  testCases: TestCase[];
  executionResult: ExecutionResponse | null;
  isRunning: boolean;
  activeTab: 'testcases' | 'result';
  setActiveTab: (tab: 'testcases' | 'result') => void;
}

export function OutputDock({
  testCases,
  executionResult,
  isRunning,
  activeTab,
  setActiveTab
}: OutputDockProps) {
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  const visibleTestCases = testCases.filter(tc => !tc.isHidden);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0c101d] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-lg">
      {/* Dock Tabs Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('testcases')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'testcases'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Test Cases ({visibleTestCases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('result')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded font-medium transition-colors ${
              activeTab === 'result'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Execution Output</span>
            {executionResult && (
              <span
                className={`w-2 h-2 rounded-full ${
                  executionResult.status === 'Accepted' ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              />
            )}
          </button>
        </div>

        {/* Stats summary if executed */}
        {executionResult && (
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <span className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
              <Clock className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />
              <span>{executionResult.executionTimeMs} ms</span>
            </span>
            <span className="flex items-center space-x-1 text-slate-500 dark:text-slate-400">
              <Cpu className="w-3 h-3 text-purple-500 dark:text-purple-400" />
              <span>{executionResult.memoryMb} MB</span>
            </span>
          </div>
        )}
      </div>

      {/* Dock Content Body */}
      <div className="flex-1 overflow-y-auto p-3 text-xs">
        {isRunning ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 space-y-2 py-8">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span className="font-mono text-xs">Running code in isolated sandbox...</span>
          </div>
        ) : activeTab === 'testcases' ? (
          /* Test Cases View */
          <div>
            {/* Case selector chips */}
            <div className="flex items-center space-x-2 mb-3">
              {visibleTestCases.map((tc, idx) => (
                <button
                  key={tc.id}
                  onClick={() => setSelectedCaseIdx(idx)}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    selectedCaseIdx === idx
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-slate-800 dark:text-indigo-300 dark:border-indigo-500/40 font-semibold shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Case {idx + 1}
                </button>
              ))}
            </div>

            {/* Selected case details */}
            {visibleTestCases[selectedCaseIdx] && (
              <div className="space-y-3 font-mono">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 font-sans uppercase font-medium block mb-1">
                    Input
                  </label>
                  <pre className="p-2.5 rounded bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 overflow-x-auto text-xs">
                    {visibleTestCases[selectedCaseIdx].input}
                  </pre>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500 dark:text-slate-400 font-sans uppercase font-medium block mb-1">
                    Expected Output
                  </label>
                  <pre className="p-2.5 rounded bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 overflow-x-auto text-xs font-bold">
                    {visibleTestCases[selectedCaseIdx].expectedOutput}
                  </pre>
                </div>

                {visibleTestCases[selectedCaseIdx].explanation && (
                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-sans bg-slate-50 dark:bg-slate-900/40 p-2 rounded border border-slate-200 dark:border-slate-800/60">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Explanation: </span>
                    {visibleTestCases[selectedCaseIdx].explanation}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Execution Result View */
          <div>
            {!executionResult ? (
              <div className="flex flex-col items-center justify-center text-slate-500 py-10 space-y-1">
                <Terminal className="w-6 h-6 text-slate-400" />
                <p>Run or Submit your code to see execution results and compiler output.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status banner */}
                <div
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    executionResult.status === 'Accepted'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-300'
                      : executionResult.status === 'Wrong Answer'
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/40 text-rose-800 dark:text-rose-300'
                      : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-500/40 text-amber-800 dark:text-amber-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {executionResult.status === 'Accepted' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-rose-500" />
                    )}
                    <div>
                      <h4 className="font-bold text-sm font-sans tracking-wide">
                        {executionResult.status}
                      </h4>
                      <p className="text-[11px] font-mono opacity-80">
                        {executionResult.passedTests} / {executionResult.totalTests} test cases passed
                      </p>
                    </div>
                  </div>


                  <div className="flex items-center space-x-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-black/40">
                      Runtime: {executionResult.executionTimeMs} ms
                    </span>
                    <span className="px-2 py-0.5 rounded bg-black/40">
                      Memory: {executionResult.memoryMb} MB
                    </span>
                  </div>
                </div>

                {/* Compile or Runtime error display */}
                {(executionResult.compileError || executionResult.runtimeError) && (
                  <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-800 text-rose-200">
                    <div className="flex items-center space-x-1 text-xs font-bold mb-1 text-rose-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Diagnostics Error</span>
                    </div>
                    <pre className="font-mono text-[11px] whitespace-pre-wrap overflow-x-auto text-rose-300">
                      {executionResult.compileError || executionResult.runtimeError}
                    </pre>
                  </div>
                )}

                {/* Per-test case result chips & details */}
                {executionResult.results.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-3">
                      {executionResult.results.map((res, i) => (
                        <button
                          key={res.testCaseId || i}
                          onClick={() => setSelectedCaseIdx(i)}
                          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                            selectedCaseIdx === i
                              ? 'bg-slate-800 border border-indigo-500/50 font-semibold'
                              : 'bg-slate-900/60 border border-slate-800 hover:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {res.passed ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-rose-400" />
                          )}
                          <span>
                            {res.isHidden ? `Hidden ${i + 1}` : `Case ${i + 1}`}
                          </span>
                        </button>
                      ))}
                    </div>

                    {executionResult.results[selectedCaseIdx] && (
                      <div className="space-y-2.5 font-mono">
                        <div>
                          <span className="text-[11px] text-slate-400 font-sans uppercase">
                            Input
                          </span>
                          <pre className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200 overflow-x-auto text-xs mt-0.5">
                            {executionResult.results[selectedCaseIdx].input}
                          </pre>
                        </div>

                        <div>
                          <span className="text-[11px] text-slate-400 font-sans uppercase">
                            Expected Output
                          </span>
                          <pre className="p-2 rounded bg-slate-900 border border-slate-800 text-emerald-400 overflow-x-auto text-xs mt-0.5">
                            {executionResult.results[selectedCaseIdx].expectedOutput}
                          </pre>
                        </div>

                        <div>
                          <span className="text-[11px] text-slate-400 font-sans uppercase">
                            Actual Output
                          </span>
                          <pre
                            className={`p-2 rounded border overflow-x-auto text-xs mt-0.5 ${
                              executionResult.results[selectedCaseIdx].passed
                                ? 'bg-slate-900 border-slate-800 text-emerald-400'
                                : 'bg-rose-950/20 border-rose-900 text-rose-400'
                            }`}
                          >
                            {executionResult.results[selectedCaseIdx].actualOutput ||
                              executionResult.results[selectedCaseIdx].error ||
                              'No output'}
                          </pre>
                        </div>

                        {executionResult.results[selectedCaseIdx].stdout && (
                          <div>
                            <span className="text-[11px] text-slate-400 font-sans uppercase">
                              Stdout Console Logs
                            </span>
                            <pre className="p-2 rounded bg-slate-950 border border-slate-800 text-amber-300/90 overflow-x-auto text-[11px] mt-0.5">
                              {executionResult.results[selectedCaseIdx].stdout}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
