import React from 'react';
import { motion } from 'motion/react';
import { SuccessStory } from '../types';
import { StoryVisual } from './StoryVisual';
import { ArrowRight, Layers, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface StoryCardProps {
  story: SuccessStory;
  onSelectStory: (slug: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onSelectStory }) => {
  const { t } = useLanguage();
  const { formatUSD } = useCurrency();

  const estimatedRevenueUSD = React.useMemo(() => {
    if (story.visualTheme === 'enterprise') return 8500000;
    if (story.visualTheme === 'warehouse' || story.visualTheme === 'logistics') return 4200000;
    if (story.visualTheme === 'hotel') return 2400000;
    if (story.visualTheme === 'supermarket' || story.visualTheme === 'electronics') return 1800000;
    if (story.visualTheme === 'pharmacy' || story.visualTheme === 'fashion') return 1100000;
    return 650000;
  }, [story.visualTheme]);

  return (
    <motion.article
      whileHover={{ y: -5, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={{ scale: 0.995 }}
      className="group bg-white dark:bg-[#0C1E30] rounded-xl border border-slate-200/90 dark:border-[#1A3852] shadow-sm hover:shadow-xl dark:shadow-black/50 hover:border-[#0A3D62]/50 dark:hover:border-sky-400/50 transition-all duration-200 flex flex-col h-full overflow-hidden"
    >
      {/* 1. Visual Product / Dashboard Header */}
      <div className="relative h-48 w-full bg-slate-900 border-b border-slate-200/80 dark:border-[#1A3852] overflow-hidden shrink-0">
        <StoryVisual theme={story.visualTheme} compact />
        {/* Verification Status Banner Overlay at bottom of visual */}
        <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 dark:bg-[#07131F]/95 backdrop-blur-xs px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-700/60 dark:border-[#1A3852]">
          <span className="font-semibold text-slate-200 flex items-center gap-1.5">
            {story.isIllustrative ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 font-medium">Illustrative Use Case Profile</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#7CB518] dark:text-[#90CF24]" />
                <span className="text-emerald-300 font-medium">Verified Customer Story</span>
              </>
            )}
          </span>
          <span className="text-slate-400 font-mono text-[10px]">{story.region}</span>
        </div>
      </div>

      {/* 2. Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Metadata Kicker (Zero-Pill discipline: unboxed text with typographic separator) */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="text-[#0A3D62] dark:text-sky-300 font-bold uppercase tracking-wide">{story.industry}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">&middot;</span>
            <span className="truncate">{story.branchCount}</span>
          </div>

          {/* Story Title */}
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0A3D62] dark:group-hover:text-sky-300 transition-colors leading-snug">
            <button
              onClick={() => onSelectStory(story.slug)}
              className="text-left cursor-pointer hover:underline focus:outline-none"
            >
              {story.title}
            </button>
          </h3>

          {/* Business Profile Designation */}
          <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#081726] px-2.5 py-1.5 rounded-md border border-slate-200/70 dark:border-[#17334D] font-medium">
            <span className="text-slate-400 dark:text-slate-400 text-[10px] uppercase block tracking-wider font-bold">Business Profile</span>
            {story.businessProfile}
          </div>

          {/* Challenge Section */}
          <div className="space-y-1 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Operational Challenge:</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
              {story.challenge}
            </p>
          </div>

          {/* Solution Section */}
          <div className="space-y-1 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A3D62] dark:bg-sky-400" />
              <span>MsmeBooks Solution:</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
              {story.solution}
            </p>
          </div>

          {/* Expected Outcome */}
          <div className="space-y-1 text-xs">
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7CB518] dark:bg-[#90CF24]" />
              <span>Target Outcome:</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
              {story.outcome}
            </p>
          </div>
        </div>

        {/* 3. Bottom Card Section: Product Modules & Primary Action */}
        <div className="pt-4 border-t border-slate-100 dark:border-[#17334D] space-y-3">
          {/* Key Metric Highlight & Dynamic Converted Financial Benchmark */}
          <div className="space-y-1.5">
            {story.outcomeMetrics.length > 0 && (
              <div className="flex items-center justify-between text-xs bg-[#F4F9EC] dark:bg-[#122A1A] px-3 py-2 rounded-lg border border-[#7CB518]/30 dark:border-[#7CB518]/40">
                <span className="text-slate-700 dark:text-slate-200 font-medium truncate">{story.outcomeMetrics[0].label}</span>
                <span className="font-mono font-bold text-[#6A9E13] dark:text-[#90CF24] text-sm tabular-nums shrink-0">
                  {story.outcomeMetrics[0].metric}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between text-[11px] bg-slate-50 dark:bg-[#081726] px-3 py-1.5 rounded-lg border border-slate-200/70 dark:border-[#17334D] text-slate-500 dark:text-slate-400">
              <span className="truncate">Est. Trade Volume:</span>
              <span className="font-mono font-bold text-[#0A3D62] dark:text-sky-300 tabular-nums shrink-0">
                {formatUSD(estimatedRevenueUSD, { compact: true })}/yr
              </span>
            </div>
          </div>

          {/* Modules Applied (Quiet unboxed tags with separator) */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <Layers className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>Modules:</span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">{story.modules.join(' &middot; ')}</span>
          </div>

          {/* CTA Link to Detail Route */}
          <button
            onClick={() => onSelectStory(story.slug)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold text-[#0A3D62] dark:text-sky-300 bg-slate-100 dark:bg-[#10273D] hover:bg-[#0A3D62] dark:hover:bg-[#0E4B77] hover:text-white dark:hover:text-white border border-transparent dark:border-[#1A3852] transition-all cursor-pointer group-hover:bg-[#0A3D62] dark:group-hover:bg-[#0E4B77] group-hover:text-white dark:group-hover:text-white"
          >
            <span>{t.card.readCaseStudy}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </motion.article>
  );
};
