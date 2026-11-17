import React from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { StoryItem } from '../modals/StoryDetailModal';
import { MapPin, ArrowRight } from 'lucide-react';

interface SuccessStoriesSectionProps {
  onSelectStory: (story: StoryItem) => void;
  onOpenDemo: () => void;
}

export const SuccessStoriesSection: React.FC<SuccessStoriesSectionProps> = ({
  onSelectStory,
  onOpenDemo,
}) => {
  const { formatFromNGN } = useCurrency();
  const { t } = useLanguage();

  return (
    <section id="success-stories" className="py-16 md:py-24 bg-white dark:bg-black border-b border-slate-200/80 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B4EA2] dark:text-[#38BDF8] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
            <span>{t.stories_eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
            {t.stories_title_1}{' '}
            <span className="text-[#0B4EA2] dark:text-[#38BDF8]">{t.stories_title_2}</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            {t.stories_desc}
          </p>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t.stories_note}
          </div>
        </div>

        {/* 3 Story Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {t.stories_items.map((story) => (
            <div
              key={story.id}
              className="bg-white dark:bg-zinc-950 rounded-2xl p-7 border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:border-[#0B4EA2]/40 dark:hover:border-[#38BDF8]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Header metadata */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-[#38BDF8]" />
                    {story.country}
                  </span>
                  <span className="text-[11px] font-mono text-[#65A30D] dark:text-lime-400 font-bold bg-lime-50 dark:bg-lime-950/60 px-2 py-0.5 rounded border border-transparent dark:border-lime-900/40">
                    {t.stories_badge}
                  </span>
                </div>

                <div className="mt-4 mb-3">
                  <span className="text-xs font-semibold text-[#0B4EA2] dark:text-[#38BDF8] uppercase tracking-wider block">
                    {story.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0B4EA2] dark:group-hover:text-[#38BDF8] transition-colors mt-0.5">
                    {story.name}
                  </h3>
                </div>

                {/* Dynamic Converted Volume Strip */}
                <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-between text-xs mb-4">
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">{story.volumeLabel}</span>
                  <span className="font-mono font-bold text-[#0B4EA2] dark:text-[#38BDF8] tabular-nums">
                    {formatFromNGN(story.monthlyNgnVolume)}
                  </span>
                </div>

                {/* Challenge & Solution snippets */}
                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 mb-6">
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider mb-0.5">
                      {t.stories_challenge_label}
                    </strong>
                    <p className="line-clamp-2 leading-relaxed">{story.businessChallenge}</p>
                  </div>
                  <div>
                    <strong className="text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider mb-0.5">
                      {t.stories_outcome_label}
                    </strong>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{story.customerOutcome}</p>
                  </div>
                </div>
              </div>

              {/* Action Button: Opens Full Case Study */}
              <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectStory(story)}
                  className="text-xs font-semibold text-[#0B4EA2] dark:text-[#38BDF8] hover:text-[#083770] dark:hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t.stories_btn_read}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#84CC16] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Explore More CTA */}
        <div className="text-center">
          <button
            onClick={onOpenDemo}
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-zinc-900 border border-transparent dark:border-zinc-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-zinc-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <span>{t.stories_explore_btn}</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-[#38BDF8]" />
          </button>
        </div>

      </div>
    </section>
  );
};
