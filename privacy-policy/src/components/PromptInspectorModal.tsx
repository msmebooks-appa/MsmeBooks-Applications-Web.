import React, { useState } from 'react';
import { X, Copy, Check, Download, Terminal } from 'lucide-react';
import { MASTER_PROMPT_TEXT } from '../data/masterPromptData';

interface PromptInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptInspectorModal: React.FC<PromptInspectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(MASTER_PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([MASTER_PROMPT_TEXT], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MsmeBooks_Privacy_Policy_Master_Prompt.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111C30] rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#172B4D] dark:bg-[#0A1220] text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1455C0] flex items-center justify-center">
              <Terminal className="w-4 h-4 text-[#B8E62E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold">MsmeBooks Developer Master Prompt</h3>
                <span className="text-[10px] font-mono bg-[#B8E62E]/20 text-[#B8E62E] px-2 py-0.5 rounded">
                  Ready to Deploy
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Official enterprise-grade specification for Pan-African SaaS privacy governance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold bg-[#1455C0] hover:bg-[#0f449e] dark:bg-[#155de0] dark:hover:bg-[#114ebc] text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#B8E62E]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Prompt'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .md</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar & Filter */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-[#0D1627] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1455C0] dark:text-[#5B95FF]">Brand Standards:</span>
            <span>Primary Blue #1455C0</span>
            <span>·</span>
            <span>Lemon Green #B8E62E</span>
            <span>·</span>
            <span>Navy #172B4D</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            {MASTER_PROMPT_TEXT.split('\n').length} Lines · 25 Sections Covered
          </div>
        </div>

        {/* Code View Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed selection:bg-[#B8E62E] selection:text-slate-950">
          <pre className="whitespace-pre-wrap">{MASTER_PROMPT_TEXT}</pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white dark:bg-[#111C30] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 dark:text-slate-400">
            This prompt can be directly provided to engineering teams, legal counsel, or AI workflows.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
