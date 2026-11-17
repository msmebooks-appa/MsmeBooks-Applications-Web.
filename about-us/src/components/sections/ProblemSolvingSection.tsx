import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowRight, Check, XCircle, CheckCircle2, Layers, Shuffle, ArrowUpRight } from 'lucide-react';

interface ProblemSolvingSectionProps {
  onOpenDemo: () => void;
}

export const ProblemSolvingSection: React.FC<ProblemSolvingSectionProps> = ({ onOpenDemo }) => {
  const [activeId, setActiveId] = useState<string>('c1');
  const { t } = useLanguage();
  const comparisons = t.prob_items;

  return (
    <section id="problem" className="py-16 md:py-24 bg-slate-50/70 dark:bg-black border-b border-slate-200/80 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B4EA2] dark:text-[#38BDF8] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
            <span>{t.prob_eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
            {t.prob_title_1}{' '}
            <span className="text-[#0B4EA2] dark:text-[#38BDF8]">{t.prob_title_2}</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            {t.prob_desc}
          </p>
        </div>

        {/* Visual Transformation Matrix */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/90 dark:border-zinc-800 shadow-sm overflow-hidden">
          
          {/* Table Header Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-slate-100/80 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 py-3.5 px-6">
            <div className="md:col-span-5 flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>{t.prob_col_challenge}</span>
            </div>
            <div className="hidden md:flex md:col-span-2 justify-center text-slate-400 dark:text-slate-500">
              <span>{t.prob_col_transition}</span>
            </div>
            <div className="md:col-span-5 flex items-center gap-2 text-[#0B4EA2] dark:text-[#38BDF8]">
              <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
              <span>{t.prob_col_solution}</span>
            </div>
          </div>

          {/* List of 6 Transformations */}
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {comparisons.map((item) => {
              const isSelected = activeId === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-5 md:p-6 transition-colors cursor-pointer items-center ${
                    isSelected ? 'bg-blue-50/40 dark:bg-blue-950/40' : 'hover:bg-slate-50/60 dark:hover:bg-zinc-900/50'
                  }`}
                >
                  {/* Left: The Challenge */}
                  <div className="md:col-span-5 flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold">×</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {item.challenge}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {item.challengeDesc}
                      </p>
                    </div>
                  </div>

                  {/* Center: Connector with Arrow */}
                  <div className="hidden md:flex md:col-span-2 justify-center items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-[#0B4EA2] dark:text-[#38BDF8] flex items-center justify-center shadow-xs">
                      <ArrowRight className="w-4 h-4 text-[#84CC16]" />
                    </div>
                  </div>

                  {/* Right: The MsmeBooks Approach */}
                  <div className="md:col-span-5 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-lime-100 dark:bg-lime-950/70 text-[#65A30D] dark:text-[#84CC16] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#0B4EA2] dark:text-[#38BDF8]">
                          {item.solution}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {item.solutionDesc}
                        </p>
                        <div className="mt-2 text-[11px] font-medium text-[#65A30D] dark:text-[#84CC16] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{item.impactMetric}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Footer */}
          <div className="bg-slate-50 dark:bg-zinc-900/90 p-4 px-6 border-t border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              {t.prob_footer_text}
            </span>
            <button
              onClick={onOpenDemo}
              className="text-xs font-semibold text-[#0B4EA2] dark:text-[#38BDF8] hover:text-[#083770] dark:hover:text-blue-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span>{t.prob_cta}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#84CC16]" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
