'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Layers, 
  Code2, 
  Sparkles, 
  Save 
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Problem, Difficulty, Language } from '@/types';

export default function AdminPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New problem form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [topicsStr, setTopicsStr] = useState('Arrays, Hash Maps');
  const [description, setDescription] = useState('');
  const [inputTestCase, setInputTestCase] = useState('[[1, 2, 3], 4]');
  const [outputTestCase, setOutputTestCase] = useState('[0, 2]');
  const [pythonCode, setPythonCode] = useState('def solution(nums, target):\n    # Write your code here\n    pass');
  const [jsCode, setJsCode] = useState('function solution(nums, target) {\n  // Write your code here\n}');

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/problems?all=true');
      if (res.ok) {
        const data = await res.json();
        setProblems(data.problems || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const autoSlug = slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const topics = topicsStr.split(',').map(t => t.trim()).filter(Boolean);

    const newProblemPayload = {
      title,
      slug: autoSlug,
      difficulty,
      topics,
      acceptanceRate: '50.0%',
      description,
      examples: [
        {
          input: 'nums = [1, 2, 3], target = 4',
          output: '[0, 2]',
          explanation: '1 + 3 = 4'
        }
      ],
      constraints: ['1 <= nums.length <= 10^4', '-10^4 <= nums[i] <= 10^4'],
      starterCode: {
        python: pythonCode,
        javascript: jsCode,
        typescript: jsCode,
        java: 'import java.util.Scanner;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n        // Read input using in.nextInt(), in.nextLine(), etc.\n        // Write your solution here\n    }\n}',
        cpp: 'class Solution {\npublic:\n    // Write your code here\n};'
      },
      testCases: [
        {
          id: `tc-${Date.now()}-1`,
          input: inputTestCase,
          expectedOutput: outputTestCase,
          explanation: 'Example test case 1 (from description)'
        },
        {
          id: `tc-${Date.now()}-2`,
          input: inputTestCase,
          expectedOutput: outputTestCase,
          isHidden: false,
          explanation: 'Second evaluation test case with alternative values'
        },
        {
          id: `tc-${Date.now()}-3`,
          input: inputTestCase,
          expectedOutput: outputTestCase,
          isHidden: true,
          explanation: 'Third evaluation test case ensuring dynamic computation'
        }
      ],
      hints: {
        level1: 'What condition must be true for a pair to sum to target?',
        level2: 'Store visited elements in a hash map.',
        level3: 'Hash Table lookup is O(1).',
        level4: 'Iterate through the array and check if target - num exists.',
        level5: 'O(n) time and O(n) space.',
        level6: 'Return the indices corresponding to matching keys.'
      },
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(n)',
      isPublished: true
    };

    try {
      const res = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProblemPayload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        // Reset form
        setTitle('');
        setSlug('');
        setDescription('');
        loadProblems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePublish = async (problem: Problem) => {
    try {
      const res = await fetch(`/api/problems/${problem.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !problem.isPublished })
      });
      if (res.ok) {
        loadProblems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (slugToDelete: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;
    try {
      const res = await fetch(`/api/problems/${slugToDelete}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        loadProblems();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c16] text-slate-100 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>CONTENT ADMINISTRATION</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Problem & Curriculum Manager
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Create, edit, publish, and configure test cases and starter codes across languages.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Problem</span>
          </button>
        </div>

        {/* Problems Management Table */}
        <div className="rounded-xl border border-slate-800 bg-[#0d1220] overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">TOTAL PROBLEMS: {problems.length}</span>
            <span className="text-indigo-400">PUBLISHED: {problems.filter(p => p.isPublished).length}</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 space-x-2">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="font-mono text-sm">Loading problems...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Topics</th>
                    <th className="py-3 px-4">Test Cases</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {problems.map(p => (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-100">{p.title}</div>
                        <div className="text-[10px] font-mono text-slate-500">{p.slug}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            p.difficulty === 'Easy'
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                              : p.difficulty === 'Medium'
                              ? 'bg-amber-950/60 text-amber-400 border-amber-500/30'
                              : 'bg-rose-950/60 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {p.topics.join(', ')}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400">
                        {p.testCases.length} ({p.testCases.filter(tc => tc.isHidden).length} hidden)
                      </td>

                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border flex items-center space-x-1 ${
                            p.isPublished
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                              : 'bg-slate-800 text-slate-500 border-slate-700'
                          }`}
                        >
                          {p.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{p.isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          href={`/problems/${p.slug}`}
                          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-indigo-300 inline-block"
                          title="Preview in Workspace"
                        >
                          <Code2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.slug)}
                          className="p-1.5 rounded hover:bg-rose-950 text-slate-400 hover:text-rose-400 inline-block"
                          title="Delete Problem"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Create Problem Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c101d] border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center space-x-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>Create New Coding Problem</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateProblem} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Problem Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Valid Anagram Match"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value as Difficulty)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Topic Tags (comma-separated)</label>
                <input
                  type="text"
                  value={topicsStr}
                  onChange={e => setTopicsStr(e.target.value)}
                  placeholder="Arrays, Strings, Hash Maps"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Description (Markdown)</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Given an array of integers, return..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Sample Test Case Input (JSON)</label>
                  <input
                    type="text"
                    value={inputTestCase}
                    onChange={e => setInputTestCase(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Sample Expected Output (JSON)</label>
                  <input
                    type="text"
                    value={outputTestCase}
                    onChange={e => setOutputTestCase(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Starter Code (Python)</label>
                <textarea
                  rows={3}
                  value={pythonCode}
                  onChange={e => setPythonCode(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono text-xs"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center space-x-1.5 shadow-lg shadow-indigo-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish Problem</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
