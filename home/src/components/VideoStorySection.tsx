import React from 'react';
import { Play, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface VideoStorySectionProps {
  onOpenVideo: () => void;
  onOpenStartFree: () => void;
}

export const VideoStorySection: React.FC<VideoStorySectionProps> = ({
  onOpenVideo,
  onOpenStartFree,
}) => {
  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-[#0B1120] border-b border-slate-200/70 dark:border-slate-800 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-950">
          <div className="relative aspect-[16/9] md:aspect-[21/9] w-full">
            <img
              src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1600&q=85"
              alt="African entrepreneur using MsmeBooks in retail store"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1600&q=80';
              }}
              className="w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />

            <div className="absolute inset-0 p-8 sm:p-12 lg:p-16 flex flex-col justify-between text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B7F000]/20 border border-[#B7F000]/40 text-[#B7F000] text-xs font-bold uppercase tracking-wider w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Cinematic Case Study</span>
              </div>

              <div className="max-w-xl space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight leading-tight">
                  See How MsmeBooks Helps Businesses Grow
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Join Babatunde, founder of a 3-branch bakery and supermarket chain in Lagos, as he shows how automated POS, supplier debt tracking, and mobile inventory alerts saved his company millions of Naira in leakages.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={onOpenVideo}
                    className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-white text-[#0866FF] flex items-center justify-center">
                      <Play className="w-3 h-3 fill-current ml-0.5" />
                    </div>
                    <span>Watch MsmeBooks in Action (2 min)</span>
                  </button>

                  <button
                    onClick={onOpenStartFree}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold text-sm transition-all border border-white/20"
                  >
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-6 text-xs text-slate-300 pt-4 border-t border-white/15">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B7F000]" />
                  Opening business &amp; shift starts
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B7F000]" />
                  Serving customers with POS
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B7F000]" />
                  Evening audit &amp; P&amp;L review
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
