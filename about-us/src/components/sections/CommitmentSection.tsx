import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Sliders, Eye, TrendingUp, Sparkles, Check } from 'lucide-react';

export const CommitmentSection: React.FC = () => {
  const { t } = useLanguage();

  const getIcon = (num: string) => {
    switch (num) {
      case '01': return <Sliders className="w-5 h-5 text-[#0B4EA2] dark:text-[#38BDF8]" />;
      case '02': return <Eye className="w-5 h-5 text-[#65A30D] dark:text-lime-400" />;
      case '03': return <TrendingUp className="w-5 h-5 text-[#0B4EA2] dark:text-[#38BDF8]" />;
      case '04': return <Sparkles className="w-5 h-5 text-[#65A30D] dark:text-lime-400" />;
      default: return <Sliders className="w-5 h-5 text-[#0B4EA2] dark:text-[#38BDF8]" />;
    }
  };

  return (
    <section id="commitments" className="py-16 md:py-24 bg-white dark:bg-black border-b border-slate-200/80 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B4EA2] dark:text-[#38BDF8] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
            <span>{t.commit_eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
            {t.commit_title_1}{' '}
            <span className="text-[#0B4EA2] dark:text-[#38BDF8]">{t.commit_title_2}</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            {t.commit_desc}
          </p>
        </div>

        {/* 4 Columns Visual Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {t.commit_items.map((item) => (
            <div
              key={item.num}
              className="bg-slate-50/70 dark:bg-zinc-950 rounded-2xl p-6 border border-slate-200/90 dark:border-zinc-800 hover:border-[#0B4EA2]/40 dark:hover:border-[#38BDF8]/40 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 flex items-center justify-center shadow-xs group-hover:border-[#0B4EA2] dark:group-hover:border-[#38BDF8] transition-colors">
                    {getIcon(item.num)}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                    {t.commit_step_prefix} {item.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0B4EA2] dark:group-hover:text-[#38BDF8] transition-colors mb-1">
                  {item.title}
                </h3>
                <span className="text-xs font-semibold text-[#0B4EA2] dark:text-[#38BDF8] block mb-3">
                  {item.sub}
                </span>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                  {item.detail}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-zinc-800 flex items-center gap-2 text-[11px] font-semibold text-[#65A30D] dark:text-lime-400">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>{item.metric}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
