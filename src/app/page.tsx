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
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col selection:bg-indigo-500/30">
      <Navbar />

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-800/80">
          {/* Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-600/10 blur-[130px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
                <span className="text-sm">☕</span>
                <span>Java 17 LTS Coding & AI Learning Platform</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Master Java Algorithms,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-300 to-indigo-400">
                  Not Just Copying Code.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto">
                Solve coding problems with native Java 17 (<code className="text-amber-300 font-mono">javac</code>) compilation and an AI tutor that asks guiding questions across 6 pedagogical levels to build deep intuition for the Java Collections Framework.
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
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm flex items-center justify-center space-x-2 transition-all hover:border-amber-500/40"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>AI Workspace</span>
                </Link>
              </div>

              {/* Quick Trust badges */}
              <div className="flex items-center justify-center space-x-6 text-xs text-slate-400 pt-6 font-mono">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Native javac 17 Runtime</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Java Collections & OOP</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>6-Level Socratic Hint Hierarchy</span>
                </span>
              </div>
            </div>

            {/* Interactive Hero Workspace Visual */}
            <div className="mt-14 max-w-5xl mx-auto rounded-2xl border border-slate-800 bg-[#0b0f1a] shadow-2xl overflow-hidden">
              {/* Window Bar */}
              <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5 mr-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="font-mono text-slate-400">Solution.java • Java 17 LTS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20">
                    STATUS: ACCEPTED (javac 17)
                  </span>
                </div>
              </div>

              {/* Mock Split Code & AI Tutor Screen */}
              <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                {/* Code Window */}
                <div className="md:col-span-7 p-4 bg-[#080c16] font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
                  <div className="text-slate-500 mb-1">// Java 17 Two Sum Solution</div>
                  <div className="text-amber-400">class <span className="text-indigo-300">Solution</span> &#123;</div>
                  <div className="pl-4 text-purple-400">public int[] <span className="text-amber-300">twoSum</span>(int[] nums, int target) &#123;</div>
                  <div className="pl-8 text-slate-300">Map&lt;Integer, Integer&gt; map = new HashMap&lt;&gt;();</div>
                  <div className="pl-8 text-purple-400">for (int i = 0; i &lt; nums.length; i++) &#123;</div>
                  <div className="pl-12 text-slate-300">int complement = target - nums[i];</div>
                  <div className="pl-12 text-purple-400">if (map.containsKey(complement)) &#123;</div>
                  <div className="pl-16 text-emerald-400">return new int[] &#123; map.get(complement), i &#125;;</div>
                  <div className="pl-12 text-purple-400">&#125;</div>
                  <div className="pl-12 text-slate-300">map.put(nums[i], i);</div>
                  <div className="pl-8 text-purple-400">&#125;</div>
                  <div className="pl-8 text-slate-400">return new int[] &#123;&#125;;</div>
                  <div className="pl-4 text-purple-400">&#125;</div>
                  <div className="text-amber-400">&#125;</div>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>All Test Cases Passed • Compiled in javac 17 • Memory: 28.1 MB</span>
                  </div>
                </div>

                {/* AI Tutor Socratic Hint Box */}
                <div className="md:col-span-5 p-4 bg-[#0b0f1d] flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-md bg-amber-600 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="font-semibold text-xs text-slate-200">Java AI Tutor • Level 3 Hint</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/20 text-xs text-slate-300 space-y-2 leading-relaxed">
                      <p className="text-amber-300 font-semibold text-[11px]">
                        ☕ Java Collections Pattern:
                      </p>
                      <p>
                        "In Java, <code className="text-amber-400">HashMap&lt;Integer, Integer&gt;</code> achieves average O(1) <code className="text-slate-300">containsKey()</code> and <code className="text-slate-300">get()</code> operations. Store <code className="text-slate-300">nums[i] -&gt; i</code> to look up complements in linear time."
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
                    <span>Level 3 / 6 Unlocked</span>
                    <Link href="/problems/two-sum-target" className="text-amber-400 hover:underline flex items-center space-x-1">
                      <span>Launch Java Workspace</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars Section */}
        <section className="py-16 md:py-24 bg-[#080c16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <h2 className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase">
                Java 17 Architecture & Pedagogy
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Built to Master Java Data Structures & Algorithmic Problem Solving
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-2xl bg-[#0d1222] border border-slate-800/80 space-y-3 hover:border-amber-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">Native javac 17 Compiler</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Real Java 17 compilation with clear error diagnostics (<code className="text-amber-300">cannot find symbol</code>, type mismatch), timeout limits, and memory isolation.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-2xl bg-[#0d1222] border border-slate-800/80 space-y-3 hover:border-orange-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">Collections Framework Focus</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Deep mastery of <code className="text-orange-300">HashMap</code>, <code className="text-orange-300">PriorityQueue</code>, <code className="text-orange-300">ArrayDeque</code>, <code className="text-orange-300">TreeSet</code>, and the Stream API with cheat sheets.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-2xl bg-[#0d1222] border border-slate-800/80 space-y-3 hover:border-indigo-500/40 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-white">6-Stage Java AI Tutor</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Socratic guidance tailoring hints to Java idioms, Big-O trade-offs, and memory bounds before unlocking full Java solutions.
                </p>
              </div>
            </div>

            {/* Basic Practice Spotlight Banner */}
            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-orange-950/20 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>NEW: W3RESOURCE JAVA EXERCISES</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  249 Java Basic Programming Exercises
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Start from ground zero or brush up on Java basics: Scanner input, arithmetic expressions, binary/hex conversions, conditionals, string parsing, and 2D arrays.
                </p>
              </div>

              <Link
                href="/basic-practice"
                className="shrink-0 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/25 flex items-center space-x-2 transition-all hover:scale-105"
              >
                <span>Browse Basic Practice Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-[#060810] text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-base">☕</span>
            <span className="font-mono text-slate-300 font-semibold">JavaAscent</span>
            <span>• Dedicated Java 17 Coding & AI Learning Platform</span>
          </div>
          <div className="flex items-center space-x-6 text-slate-400">
            <Link href="/problems" className="hover:text-white">Problems</Link>
            <Link href="/basic-practice" className="hover:text-white text-amber-400">Basic Practice</Link>
            <Link href="/dashboard" className="hover:text-white">Dashboard</Link>
            <Link href="/submissions" className="hover:text-white">Submissions</Link>
            <Link href="/admin" className="hover:text-white">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
