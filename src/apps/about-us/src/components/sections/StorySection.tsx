import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Quote, Sparkles, Check, ArrowRight, Building, PackageCheck } from 'lucide-react';

interface StorySectionProps {
  onOpenDemo: () => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ onOpenDemo }) => {
  const [activeStoryView, setActiveStoryView] = useState<'executive' | 'commerce'>('executive');
  const { t } = useLanguage();

  return (
    <section id="our-story" className="py-16 md:py-24 bg-slate-50/60 dark:bg-black border-y border-slate-200/60 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Authentic Dual Photography Showcase */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            
            {/* Perspective Switcher Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-zinc-900 rounded-xl mb-3 text-xs">
              <button
                onClick={() => setActiveStoryView('executive')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeStoryView === 'executive'
                    ? 'bg-white dark:bg-zinc-800 text-[#0B4EA2] dark:text-[#38BDF8] shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-[#38BDF8]" />
                <span>{t.story_tab_exec}</span>
              </button>
              <button
                onClick={() => setActiveStoryView('commerce')}
                className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeStoryView === 'commerce'
                    ? 'bg-white dark:bg-zinc-800 text-[#0B4EA2] dark:text-[#38BDF8] shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <PackageCheck className="w-3.5 h-3.5 text-[#84CC16]" />
                <span>{t.story_tab_commerce}</span>
              </button>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 group">
              {activeStoryView === 'executive' ? (
                <img
                  src="/src/assets/images/story_african_businesswoman_laptop_1792324718542.jpg"
                  alt="African entrepreneur working with cloud accounting analytics on laptop in modern sunlit office"
                  className="w-full h-[460px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              ) : (
                <img
                  src="/src/assets/images/commerce_african_sme_fulfillment_1792325291673.jpg"
                  alt="African female entrepreneur managing customer orders and stock packages with a tablet in an organized fulfillment warehouse"
                  className="w-full h-[460px] object-cover object-center group-hover:scale-[1.02] transition-transform duration-300 animate-in fade-in duration-200"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              )}
              
              {/* Glass caption badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-black/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-100 dark:border-zinc-800 shadow-sm">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                  {activeStoryView === 'executive'
                    ? t.story_caption_exec
                    : t.story_caption_comm}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{t.story_caption_tag_left}</span>
                  <span>·</span>
                  <span className="text-[#65A30D] dark:text-[#84CC16] font-medium">{t.story_caption_tag_right}</span>
                </div>
              </div>
            </div>

            {/* Decorative background geometry */}
            <div className="hidden sm:block absolute -top-4 -right-4 w-32 h-32 bg-lime-100/60 dark:bg-lime-950/20 rounded-2xl -z-10" />
            <div className="hidden sm:block absolute -bottom-4 -left-4 w-32 h-32 bg-blue-100/60 dark:bg-blue-950/30 rounded-2xl -z-10" />
          </div>

          {/* Right Column: Storytelling Narrative */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B4EA2] dark:text-[#38BDF8] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
              <span>{t.story_eyebrow}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight text-balance">
              {t.story_title_1}{' '}
              <span className="text-[#0B4EA2] dark:text-[#38BDF8]">{t.story_title_2}</span>
            </h2>

            <div className="space-y-4 text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              <p>
                {t.story_p1}
              </p>
              <p>
                <strong className="text-slate-900 dark:text-white font-semibold">{t.story_p2_bold}</strong>
              </p>
              <p>
                {t.story_p3}
              </p>
              <p>
                {t.story_p4}
              </p>
            </div>

            {/* Highlighted Quote Box */}
            <div className="p-5 rounded-xl bg-blue-50/70 dark:bg-[#0B4EA2]/15 border border-blue-200/80 dark:border-[#0B4EA2]/30 relative">
              <Quote className="w-8 h-8 text-[#0B4EA2]/20 dark:text-blue-400/20 absolute top-3 right-3" />
              <p className="text-base sm:text-lg font-semibold text-[#0B4EA2] dark:text-blue-300 italic leading-snug">
                {t.story_quote}
              </p>
              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
                <span>{t.story_philosophy}</span>
              </div>
            </div>

            {/* Editorial Numbering Pillars */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3.5 bg-white dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                <span className="text-xs font-mono font-bold text-[#0B4EA2] dark:text-[#38BDF8]">{t.story_p1_title}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.story_p1_desc}</p>
              </div>
              <div className="p-3.5 bg-white dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                <span className="text-xs font-mono font-bold text-[#0B4EA2] dark:text-[#38BDF8]">{t.story_p2_title}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.story_p2_desc}</p>
              </div>
              <div className="p-3.5 bg-white dark:bg-zinc-950 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs">
                <span className="text-xs font-mono font-bold text-[#0B4EA2] dark:text-[#38BDF8]">{t.story_p3_title}</span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{t.story_p3_desc}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

