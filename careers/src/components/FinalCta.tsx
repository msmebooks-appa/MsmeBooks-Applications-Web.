import React from 'react';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';

interface FinalCtaProps {
  onExplorePositions: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onExplorePositions }) => {
  return (
    <section className="relative py-20 bg-[#0066CC] dark:bg-[#091F38] text-white overflow-hidden transition-colors duration-200">
      {/* Lemon-green geometric & organic accents */}
      <div className="absolute top-0 right-10 w-72 h-72 bg-[#B5E61D]/20 dark:bg-[#B5E61D]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-900/50 dark:bg-blue-950/70 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative top border line in lemon green */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#B5E61D]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-full text-xs font-semibold text-[#B5E61D] mb-6">
          <Sparkles className="w-3.5 h-3.5 fill-[#B5E61D]" />
          <span>Join the MsmeBooks Journey</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
          Ready to Build the Future With Us?
        </h2>

        <p className="text-blue-100 dark:text-slate-300 text-base sm:text-xl max-w-2xl mx-auto mt-5 leading-relaxed font-normal">
          Explore opportunities to grow your career, collaborate with talented professionals, and contribute to technology that helps businesses succeed across Africa and worldwide.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-9">
          <button
            onClick={onExplorePositions}
            className="px-7 py-3.5 bg-white dark:bg-[#B5E61D] hover:bg-slate-50 dark:hover:bg-[#a2d114] text-[#0066CC] dark:text-[#14243A] font-bold text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 group"
          >
            <span>View Open Positions</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <a
            href="https://www.msmebooks.org"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 bg-[#004C99] dark:bg-[#132A50] hover:bg-[#003D7A] dark:hover:bg-[#193769] text-white font-semibold text-sm rounded-xl border border-white/20 transition-all flex items-center gap-2"
          >
            <span>Learn About MsmeBooks</span>
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>
        </div>
      </div>
    </section>
  );
};
