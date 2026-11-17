import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Target, Compass, Lightbulb, ArrowUpRight } from 'lucide-react';

export const MissionVisionSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="mission-vision" className="py-16 md:py-24 bg-white dark:bg-black transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B4EA2] dark:text-[#38BDF8] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
            <span>{t.mv_eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            {t.mv_title_1}{' '}
            <span className="text-[#0B4EA2] dark:text-[#38BDF8]">{t.mv_title_2}</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            {t.mv_desc}
          </p>
        </div>

        {/* 3 Balanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Our Mission */}
          <div className="bg-white dark:bg-zinc-950 rounded-2xl p-8 border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-[#0B4EA2]/40 dark:hover:border-[#38BDF8]/40 transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-lime-50 dark:bg-lime-950/60 text-[#65A30D] dark:text-[#84CC16] flex items-center justify-center mb-6 group-hover:bg-[#84CC16] group-hover:text-slate-900 transition-colors">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-[#0B4EA2] dark:text-[#38BDF8] tracking-wider uppercase">{t.mv_mission_badge}</span>
              <h3 className="text-2xl font-bold text-[#0B4EA2] dark:text-white mt-1 mb-3">{t.mv_mission_title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                "{t.mv_mission_text}"
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{t.mv_mission_footer}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
            </div>
          </div>

          {/* Card 2: Our Vision */}
          <div className="bg-white dark:bg-zinc-950 rounded-2xl p-8 border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-[#0B4EA2]/40 dark:hover:border-[#38BDF8]/40 transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-[#0B4EA2] dark:text-blue-300 flex items-center justify-center mb-6 group-hover:bg-[#0B4EA2] group-hover:text-white transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-[#0B4EA2] dark:text-[#38BDF8] tracking-wider uppercase">{t.mv_vision_badge}</span>
              <h3 className="text-2xl font-bold text-[#0B4EA2] dark:text-white mt-1 mb-3">{t.mv_vision_title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                "{t.mv_vision_text}"
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{t.mv_vision_footer}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
            </div>
          </div>

          {/* Card 3: Our Purpose */}
          <div className="bg-white dark:bg-zinc-950 rounded-2xl p-8 border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-[#0B4EA2]/40 dark:hover:border-[#38BDF8]/40 transition-all duration-200 flex flex-col justify-between group">
            <div>
              <div className="w-12 h-12 rounded-xl bg-lime-50 dark:bg-lime-950/60 text-[#65A30D] dark:text-[#84CC16] flex items-center justify-center mb-6 group-hover:bg-[#84CC16] group-hover:text-slate-900 transition-colors">
                <Lightbulb className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold text-[#0B4EA2] dark:text-[#38BDF8] tracking-wider uppercase">{t.mv_purpose_badge}</span>
              <h3 className="text-2xl font-bold text-[#0B4EA2] dark:text-white mt-1 mb-3">{t.mv_purpose_title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                "{t.mv_purpose_text}"
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>{t.mv_purpose_footer}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
