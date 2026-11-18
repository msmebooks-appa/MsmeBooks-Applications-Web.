import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Globe2, 
  RefreshCw 
} from 'lucide-react';

export const CoreValuesSection: React.FC = () => {
  const { t } = useLanguage();

  const getIcon = (num: string) => {
    switch (num) {
      case '01': return <Zap className="w-5 h-5 text-[#65A30D]" />;
      case '02': return <Sparkles className="w-5 h-5 text-[#65A30D]" />;
      case '03': return <ShieldCheck className="w-5 h-5 text-[#65A30D]" />;
      case '04': return <Award className="w-5 h-5 text-[#65A30D]" />;
      case '05': return <Globe2 className="w-5 h-5 text-[#65A30D]" />;
      case '06': return <RefreshCw className="w-5 h-5 text-[#65A30D]" />;
      default: return <Zap className="w-5 h-5 text-[#65A30D]" />;
    }
  };

  return (
    <section id="values" className="py-16 md:py-24 bg-slate-50/70 dark:bg-black border-b border-slate-200/80 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B4EA2] dark:text-[#38BDF8] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
            <span>{t.values_eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
            {t.values_title_1}{' '}
            <span className="text-[#0B4EA2] dark:text-[#38BDF8]">{t.values_title_2}</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            {t.values_desc}
          </p>
        </div>

        {/* 6 Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.values_items.map((val) => (
            <div
              key={val.number}
              className="bg-white dark:bg-zinc-950 rounded-2xl p-7 border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:border-[#0B4EA2]/40 dark:hover:border-[#38BDF8]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-lime-100 dark:bg-lime-950/60 flex items-center justify-center group-hover:bg-[#84CC16] group-hover:text-slate-900 transition-colors">
                    {getIcon(val.number)}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0B4EA2] dark:text-[#38BDF8]">
                    {val.number}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0B4EA2] dark:text-white mb-2.5">
                  {val.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {val.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                <span>{t.values_footer_label}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
