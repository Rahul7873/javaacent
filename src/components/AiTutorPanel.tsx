'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ChevronRight, 
  Lightbulb, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  Cpu, 
  Lock, 
  Unlock, 
  RefreshCw 
} from 'lucide-react';
import { Problem, AITutorMessage, Language } from '@/types';

interface AiTutorPanelProps {
  problem: Problem;
  currentCode: string;
  language: Language;
  lastError?: string;
  isOpen: boolean;
  onClose: () => void;
}

const HINT_LEVELS = [
  { level: 1, label: 'Guiding Question', icon: Lightbulb, desc: 'Socratic prompt on problem essence' },
  { level: 2, label: 'Conceptual Hint', icon: BookOpen, desc: 'Core invariant or observation' },
  { level: 3, label: 'Pattern / DS', icon: Cpu, desc: 'Ideal data structure or design pattern' },
  { level: 4, label: 'Algorithm Approach', icon: ChevronRight, desc: 'Step-by-step logic without code' },
  { level: 5, label: 'Complexity Analysis', icon: CheckCircle, desc: 'Optimal time & space lower bounds' },
  { level: 6, label: 'Full Solution', icon: Unlock, desc: 'Complete code & implementation' }
] as const;

function generateUniqueId(prefix: string): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function AiTutorPanel({
  problem,
  currentCode,
  language,
  lastError,
  isOpen,
  onClose
}: AiTutorPanelProps) {
  const [messages, setMessages] = useState<AITutorMessage[]>([
    {
      id: generateUniqueId('init'),
      role: 'tutor',
      content: `👋 Hi! I am your Socratic AI Tutor for **${problem.title}**.\n\nI follow a 6-level teaching hierarchy to help you build true problem-solving intuition rather than just copying code.\n\n🎯 **Level 1 Guiding Question:**\n${problem.hints.level1}`,
      hintLevel: 1,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentLevel, setCurrentLevel] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([
    'I need a conceptual hint (Level 2)',
    'What data structure should I use? (Level 3)',
    'Can you review my current code?'
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Reset conversation when problem changes
  useEffect(() => {
    setMessages([
      {
        id: generateUniqueId('init'),
        role: 'tutor',
        content: `👋 Hi! I am your Socratic AI Tutor for **${problem.title}**.\n\nI follow a 6-level teaching hierarchy to help you build true problem-solving intuition rather than just copying code.\n\n🎯 **Level 1 Guiding Question:**\n${problem.hints.level1}`,
        hintLevel: 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setCurrentLevel(1);
    setSuggestedPrompts([
      'I need a conceptual hint (Level 2)',
      'What data structure should I use? (Level 3)',
      'Can you review my current code?'
    ]);
  }, [problem.id, problem.title, problem.hints.level1]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string, levelToRequest?: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (isLoading) return;
    const text = (textToSend || inputMessage).trim();
    if (!text && !levelToRequest) return;

    const userMsg: AITutorMessage = {
      id: generateUniqueId('msg'),
      role: 'user',
      content: text || `Unlock Level ${levelToRequest} Guidance`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: problem.id,
          currentCode,
          language,
          userMessage: text,
          requestedLevel: levelToRequest,
          lastError
        })
      });

      if (res.ok) {
        const data = await res.json();
        const tutorMsg: AITutorMessage = {
          id: generateUniqueId('tutor'),
          role: 'tutor',
          content: data.message,
          hintLevel: data.hintLevel,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, tutorMsg]);
        if (data.hintLevel) {
          setCurrentLevel(data.hintLevel);
        }
        if (data.suggestedPrompts?.length) {
          setSuggestedPrompts(data.suggestedPrompts);
        }
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [
        ...prev,
        {
          id: generateUniqueId('err'),
          role: 'tutor',
          content: 'Unable to connect to tutor service. Please verify your connection or try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockLevel = (targetLevel: 1 | 2 | 3 | 4 | 5 | 6) => {
    handleSendMessage(`Explain Level ${targetLevel}: ${HINT_LEVELS[targetLevel - 1].label}`, targetLevel);
  };

  if (!isOpen) return null;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0c101d] border-l border-slate-200 dark:border-slate-800 shadow-2xl w-full">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#090d18] flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 font-mono">Socratic AI Tutor</h3>
              <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 rounded">
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Progressive logic guidance</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
        >
          ✕
        </button>
      </div>

      {/* 6-Level Progress Track Strip */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Teaching Hierarchy</span>
          <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">Level {currentLevel} of 6</span>
        </div>
        <div className="grid grid-cols-6 gap-1">
          {HINT_LEVELS.map(lvl => {
            const isCompleted = currentLevel >= lvl.level;
            const isCurrent = currentLevel === lvl.level;
            return (
              <button
                key={lvl.level}
                onClick={() => handleUnlockLevel(lvl.level as 1 | 2 | 3 | 4 | 5 | 6)}
                title={`Level ${lvl.level}: ${lvl.label} - ${lvl.desc}`}
                className={`py-1.5 px-0.5 rounded text-center transition-all flex flex-col items-center group relative ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-bold ring-2 ring-indigo-400 ring-offset-1 ring-offset-slate-100 dark:ring-offset-slate-900'
                    : isCompleted
                    ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
                    : 'bg-slate-100 dark:bg-slate-800/40 text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <span className="text-[10px] font-mono leading-none">L{lvl.level}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={`${msg.id}-${idx}`}
            className={`flex items-start space-x-2.5 ${
              msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                msg.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              }`}
            >
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-tl-none shadow-sm'
              }`}
            >
              {msg.hintLevel && (
                <div className="flex items-center space-x-1.5 mb-1.5 pb-1 border-b border-slate-200 dark:border-slate-700/50 text-[10px] font-mono text-indigo-600 dark:text-indigo-300 font-semibold">
                  <span>Level {msg.hintLevel}:</span>
                  <span>{HINT_LEVELS[msg.hintLevel - 1].label}</span>
                </div>
              )}
              <div className="whitespace-pre-wrap prose prose-slate dark:prose-invert prose-xs max-w-none text-slate-800 dark:text-slate-200">
                {msg.content}
              </div>
              <div
                className={`text-[9px] mt-1.5 ${
                  msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 rounded-2xl rounded-tl-none px-3.5 py-2.5 text-xs text-slate-600 dark:text-slate-400 flex items-center space-x-2 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-150" />
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-300" />
              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">Synthesizing pedagogical hint...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-3 pt-2 pb-1 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40">
        <div className="flex items-center space-x-1 mb-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
          <Lightbulb className="w-3 h-3 text-amber-500 dark:text-amber-400" />
          <span>Quick Socratic Prompts</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {suggestedPrompts.slice(0, 3).map((prompt, i) => {
            let promptLevel: 1 | 2 | 3 | 4 | 5 | 6 | undefined;
            if (prompt.includes('Level 1')) promptLevel = 1;
            else if (prompt.includes('Level 2')) promptLevel = 2;
            else if (prompt.includes('Level 3')) promptLevel = 3;
            else if (prompt.includes('Level 4')) promptLevel = 4;
            else if (prompt.includes('Level 5')) promptLevel = 5;
            else if (prompt.includes('Level 6')) promptLevel = 6;

            return (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt, promptLevel)}
                disabled={isLoading}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 dark:bg-slate-800/80 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700/60 hover:border-indigo-400 dark:hover:border-indigo-500/40 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors text-left shadow-xs"
              >
                {prompt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-50 dark:bg-[#090d18] border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            placeholder="Ask a question or explain your reasoning..."
            disabled={isLoading}
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors shadow-xs"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 dark:disabled:text-slate-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
