'use client';

import React, { useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { 
  RotateCcw, 
  Code, 
  Settings2, 
  Maximize2, 
  Minimize2, 
  Type 
} from 'lucide-react';
import { Language } from '@/types';

interface MonacoEditorProps {
  language: Language;
  value: string;
  onChange: (val: string) => void;
  onReset: () => void;
  theme?: 'vs-dark' | 'vs' | 'light';
  readOnly?: boolean;
}

const MONACO_LANGUAGE_MAP: Record<Language, string> = {
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  java: 'java',
  cpp: 'cpp'
};

export function MonacoEditor({
  language,
  value,
  onChange,
  onReset,
  theme = 'vs-dark',
  readOnly = false
}: MonacoEditorProps) {
  const activeMonacoTheme = (theme === 'light' || theme === 'vs') ? 'vs' : 'vs-dark';

  const [fontSize, setFontSize] = useState<number>(14);
  const [minimap, setMinimap] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleEditorMount: OnMount = (editor, monaco) => {
    // Define editor configuration options
    editor.updateOptions({
      tabSize: 4,
      fontFamily: "'Fira Code', 'JetBrains Mono', 'Menlo', 'Consolas', monospace",
      fontLigatures: true,
      smoothScrolling: true,
      cursorSmoothCaretAnimation: 'on',
      cursorBlinking: 'smooth',
      renderLineHighlight: 'all',
      automaticLayout: true
    });
  };

  return (
    <div className={`flex flex-col h-full bg-white dark:bg-[#0e131f] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-xl ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Editor Control Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="font-mono text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <Code className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="font-semibold text-slate-900 dark:text-slate-200 uppercase">{language}</span>
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-2">
          {/* Font Size Selector */}
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/60 px-2 py-1 rounded border border-slate-200 dark:border-slate-700/60">
            <Type className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <button
              onClick={() => setFontSize(s => Math.max(12, s - 1))}
              className="hover:text-slate-900 dark:hover:text-white px-1 font-mono text-slate-600 dark:text-slate-400"
              title="Decrease Font Size"
            >
              -
            </button>
            <span className="font-mono text-[11px] text-slate-800 dark:text-slate-300 font-medium">{fontSize}px</span>
            <button
              onClick={() => setFontSize(s => Math.min(20, s + 1))}
              className="hover:text-slate-900 dark:hover:text-white px-1 font-mono text-slate-600 dark:text-slate-400"
              title="Increase Font Size"
            >
              +
            </button>
          </div>

          {/* Minimap toggle */}
          <button
            onClick={() => setMinimap(m => !m)}
            className={`px-2 py-1 rounded border text-[11px] transition-colors ${
              minimap 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/40 font-medium' 
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            title="Toggle Minimap"
          >
            Map
          </button>

          {/* Reset Code */}
          <button
            onClick={onReset}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            title="Reset to Starter Template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(f => !f)}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Monaco Code Editor Canvas */}
      <div className="flex-1 min-h-[360px] relative">
        <Editor
          height="100%"
          language={MONACO_LANGUAGE_MAP[language]}
          value={value}
          theme={activeMonacoTheme}
          onChange={val => onChange(val || '')}

          onMount={handleEditorMount}
          options={{
            fontSize,
            minimap: { enabled: minimap },
            readOnly,
            lineNumbers: 'on',
            roundedSelection: true,
            scrollBeyondLastLine: false,
            bracketPairColorization: { enabled: true },
            padding: { top: 12, bottom: 12 }
          }}
          loading={
            <div className="flex items-center justify-center h-full text-slate-400 text-sm space-x-2">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading Monaco Editor...</span>
            </div>
          }
        />
      </div>
    </div>
  );
}
