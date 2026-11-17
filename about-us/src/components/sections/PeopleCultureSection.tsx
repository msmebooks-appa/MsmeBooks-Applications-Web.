import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Users2, HeartHandshake, Shield, Sparkles } from 'lucide-react';

export const PeopleCultureSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="people-and-thinking" className="py-16 md:py-24 bg-white dark:bg-black transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Narrative & Philosophy (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B4EA2] dark:text-[#38BDF8] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
              <span>{t.people_eyebrow}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight text-balance">
              {t.people_title_1}{' '}
              <span className="text-[#0B4EA2] dark:text-[#38BDF8]">{t.people_title_2}</span>
            </h2>

            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              <p>{t.people_p1}</p>
              <p>{t.people_p2}</p>
            </div>

            {/* Three Foundational Pillars */}
            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0B4EA2] dark:text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                  <Users2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.people_pillar1_title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {t.people_pillar1_desc}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-950/60 text-[#65A30D] dark:text-[#84CC16] flex items-center justify-center shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.people_pillar2_title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {t.people_pillar2_desc}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0B4EA2] dark:text-[#38BDF8] flex items-center justify-center shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.people_pillar3_title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {t.people_pillar3_desc}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Documentary Photography (6 cols) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-zinc-800 bg-slate-900">
              <img
                src="/src/assets/images/team_african_professionals_meeting_1792324719569.jpg"
                alt="Diverse African finance professionals, consultants, and developers in a modern collaborative workspace"
                className="w-full h-[480px] object-cover"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <div className="flex items-center gap-2 text-xs font-mono text-lime-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.people_photo_tag}</span>
                </div>
                <p className="text-sm font-medium text-slate-200">
                  {t.people_photo_caption}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
