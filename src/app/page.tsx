'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Code2, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Terminal, 
  Cpu, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Lightbulb, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a13] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500/30">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 dark:border-slate-800/80">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-pink-600/10 blur-[130px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold shadow-inner">
                <span className="text-sm">☕</span>
                <span>Java 17 LTS Coding & AI Learning Platform</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Master Java Algorithms,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 dark:from-amber-400 dark:via-orange-300 dark:to-indigo-400">
                  Not Just Copying Code.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Solve coding problems with native Java 17 (<code className="text-amber-600 dark:text-amber-300 font-mono">javac</code>) compilation and an AI tutor that asks guiding questions across 6 pedagogical levels to build deep intuition for the Java Collections Framework.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/problems"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
                >
                  <Code2 className="w-4 h-4" />
                  <span>DSA Algorithms</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/basic-practice"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-105"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Basic Practice (249)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/problems/two-sum-target"
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 font-semibold text-sm flex items-center justify-center space-x-2 transition-all shadow-sm"
                >
                  <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>AI Workspace</span>
                </Link>
              </div>

              {/* Quick Trust badges */}
              <div className="flex items-center justify-center space-x-6 text-xs text-slate-600 dark:text-slate-400 pt-6 font-mono">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Native javac 17 Runtime</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Java Collections & OOP</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>6-Level Socratic Hint Hierarchy</span>
                </span>
              </div>
            </div>

            {/* Interactive Hero Workspace Visual */}
            <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f1a] shadow-xl dark:shadow-2xl overflow-hidden">
              {/* Window Bar */}
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5 mr-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-slate-600 dark:text-slate-400">Solution.java • Java 17 LTS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] border border-emerald-500/20 font-semibold">
                    STATUS: ACCEPTED (javac 17)
                  </span>
                </div>
              </div>

              {/* Mock Split Code & AI Tutor Screen */}
              <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
                {/* Code Editor Pane Mock */}
                <div className="md:col-span-7 p-4 bg-slate-50 dark:bg-[#080c16] font-mono text-xs text-slate-800 dark:text-slate-300 leading-relaxed overflow-x-auto">
                  <div className="text-slate-400">// Java 17: Two Sum with HashMap (O(N) Time)</div>
                  <div><span className="text-indigo-600 dark:text-indigo-400">import</span> java.util.*;</div>
                  <br />
                  <div><span className="text-indigo-600 dark:text-indigo-400">public class</span> <span className="text-amber-600 dark:text-amber-300">Solution</span> {'{'}</div>
                  <div className="pl-4">
                    <span className="text-indigo-600 dark:text-indigo-400">public int</span>[] <span className="text-emerald-600 dark:text-emerald-400">twoSum</span>(<span className="text-indigo-600 dark:text-indigo-400">int</span>[] nums, <span className="text-indigo-600 dark:text-indigo-400">int</span> target) {'{'}
                  </div>
                  <div className="pl-8">
                    Map&lt;Integer, Integer&gt; map = <span className="text-indigo-600 dark:text-indigo-400">new</span> HashMap&lt;&gt;();
                  </div>
                  <div className="pl-8">
                    <span className="text-indigo-600 dark:text-indigo-400">for</span> (<span className="text-indigo-600 dark:text-indigo-400">int</span> i = 0; i &lt; nums.length; i++) {'{'}
                  </div>
                  <div className="pl-12">
                    <span className="text-indigo-600 dark:text-indigo-400">int</span> complement = target - nums[i];
                  </div>
                  <div className="pl-12">
                    <span className="text-indigo-600 dark:text-indigo-400">if</span> (map.containsKey(complement)) {'{'}
                  </div>
                  <div className="pl-16">
                    <span className="text-indigo-600 dark:text-indigo-400">return new int</span>[] {'{'} map.get(complement), i {'}'};
                  </div>
                  <div className="pl-12">{'}'}</div>
                  <div className="pl-12">map.put(nums[i], i);</div>
                  <div className="pl-8">{'}'}</div>
                  <div className="pl-8"><span className="text-indigo-600 dark:text-indigo-400">return new int</span>[0];</div>
                  <div className="pl-4">{'}'}</div>
                  <div>{'}'}</div>
                </div>

                {/* AI Tutor Assistant Mock */}
                <div className="md:col-span-5 p-4 bg-white dark:bg-[#0b0f1d] flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">JavaAscent AI Tutor</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-300 font-mono border border-amber-500/30 font-medium">
                        Level 2 Hint
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2">
                      <p className="font-medium text-slate-900 dark:text-white">Great start using HashMap!</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Notice how looking up the complement via <code className="text-amber-600 dark:text-amber-300 font-mono">map.containsKey()</code> reduces runtime from <code className="text-rose-600 dark:text-rose-400 font-mono">O(N²)</code> to <code className="text-emerald-600 dark:text-emerald-400 font-mono">O(N)</code>.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Socratic Level 2 / 6</span>
                    <Link href="/problems/two-sum-target" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 font-medium">
                      <span>Try Interactive Problem</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="py-16 md:py-24 bg-slate-100/60 dark:bg-[#080c16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <h2 className="text-xs font-mono font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                Java 17 Architecture & Pedagogy
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Built to Master Java Data Structures & Algorithmic Problem Solving
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1222] border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Native javac 17 Compiler</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Real Java 17 compilation with clear error diagnostics (<code className="text-amber-600 dark:text-amber-300">cannot find symbol</code>, type mismatch), timeout limits, and memory isolation.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1222] border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm hover:shadow-md hover:border-orange-500/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Collections Framework Focus</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Deep mastery of <code className="text-orange-600 dark:text-orange-300">HashMap</code>, <code className="text-orange-600 dark:text-orange-300">PriorityQueue</code>, <code className="text-orange-600 dark:text-orange-300">ArrayDeque</code>, <code className="text-orange-600 dark:text-orange-300">TreeSet</code>, and the Stream API with cheat sheets.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-white dark:bg-[#0d1222] border border-slate-200 dark:border-slate-800/80 space-y-3 shadow-sm hover:shadow-md hover:border-indigo-500/50 transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">6-Stage Java AI Tutor</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  Socratic guidance tailoring hints to Java idioms, Big-O trade-offs, and memory bounds before unlocking full Java solutions.
                </p>
              </div>
            </div>

            {/* Basic Practice Spotlight Banner */}
            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-slate-100 dark:from-amber-950/40 dark:via-orange-950/20 dark:to-slate-900 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-2xl">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-mono font-semibold">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>NEW: W3RESOURCE JAVA EXERCISES</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                  249 Java Basic Programming Exercises
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  Start from ground zero or brush up on Java basics: Scanner input, arithmetic expressions, binary/hex conversions, conditionals, string parsing, and 2D arrays.
                </p>
              </div>

              <Link
                href="/basic-practice"
                className="shrink-0 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md hover:shadow-lg flex items-center space-x-2 transition-all hover:scale-105"
              >
                <span>Browse Basic Practice Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 py-8 bg-white dark:bg-[#060810] text-xs text-slate-600 dark:text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-base">☕</span>
            <span className="font-mono text-slate-900 dark:text-slate-300 font-semibold">JavaAscent</span>
            <span>• Dedicated Java 17 Coding & AI Learning Platform</span>
          </div>
          <div className="flex items-center space-x-6 text-slate-500 dark:text-slate-400">
            <span>Built for Java Engineers</span>
            <span>•</span>
            <span>JDK 17 LTS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
