import React from 'react';
import { X, Check, ArrowRight, ExternalLink } from 'lucide-react';

export interface SolutionItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  iconName: string;
  keyFeatures: string[];
  businessImpact: string;
  targetUsers: string;
}

interface SolutionDetailModalProps {
  solution: SolutionItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDemo: () => void;
}

export const SolutionDetailModal: React.FC<SolutionDetailModalProps> = ({
  solution,
  isOpen,
  onClose,
  onOpenDemo,
}) => {
  if (!isOpen || !solution) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0B4EA2] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-lime-400">MsmeBooks Solution Module</span>
            <h3 className="text-xl font-bold mt-0.5">{solution.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">{solution.tagline}</h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 leading-relaxed">
              {solution.longDescription}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-xl p-5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 mb-3">
              Core Functional Capabilities
            </h5>
            <ul className="space-y-2.5">
              {solution.keyFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-lime-100 dark:bg-lime-950/60 border border-transparent dark:border-lime-800 text-[#65A30D] dark:text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-blue-100 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/30">
              <span className="text-xs font-bold text-[#0B4EA2] dark:text-sky-300 uppercase tracking-wider">Business Impact</span>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{solution.businessImpact}</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Designed For</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{solution.targetUsers}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <button
              onClick={() => {
                onClose();
                onOpenDemo();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0B4EA2] hover:bg-[#083770] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>See in Live Demo</span>
              <ArrowRight className="w-4 h-4 text-lime-300" />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
