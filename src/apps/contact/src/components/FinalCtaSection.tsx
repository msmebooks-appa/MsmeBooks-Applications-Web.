import React from 'react';
import { ArrowRight, PhoneCall, Sparkles, CheckCircle2 } from 'lucide-react';

interface FinalCtaSectionProps {
  onGetStartedClick: () => void;
  onTalkToExpertClick: () => void;
}

export const FinalCtaSection: React.FC<FinalCtaSectionProps> = ({
  onGetStartedClick,
  onTalkToExpertClick,
}) => {
  return (
    <section id="final-cta" className="relative overflow-hidden bg-[#0B3B82] text-white py-16 lg:py-24">
      {/* Background African Entrepreneurs Collaboration Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/african_executives_partnership_1792327888590.jpg"
          alt="African entrepreneurs collaborating with technology"
          className="w-full h-full object-cover object-center opacity-20 filter saturate-50"
          referrerPolicy="no-referrer"
        />
        {/* Measured Brand Color Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B3B82] via-[#0B3B82]/95 to-[#0B3B82]/85" />
        {/* Subtle Lemon Green Brand Arc Accent */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#70C038]/15 blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Eyebrow with lemon-green dot */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-[#a1e670] uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-[#70C038]" />
          READY TO TRANSFORM YOUR OPERATIONS?
        </div>

        {/* Main Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white max-w-3xl mx-auto text-balance">
          Your Business Deserves Smarter Tools. Let's Get Started.
        </h2>

        {/* Supporting text */}
        <p className="mt-5 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
          Join businesses exploring a smarter way to manage accounting, sales, inventory, and everyday operations with MsmeBooks.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Get Started / Book Demo — Lemon green */}
          <button
            onClick={onGetStartedClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-extrabold text-slate-950 bg-[#70C038] hover:bg-[#5fa62c] hover:text-white transition-all shadow-xl hover:shadow-2xl active:scale-98 flex items-center justify-center gap-2"
          >
            <span>Get Started Free</span>
            <Sparkles className="w-4 h-4 text-slate-900" />
          </button>

          {/* Talk to an Expert — White with corporate blue text */}
          <button
            onClick={onTalkToExpertClick}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold text-[#0B3B82] bg-white hover:bg-slate-100 transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-[#0B3B82]" />
            <span>Talk to an Expert</span>
          </button>
        </div>

        {/* Reassurance points */}
        <div className="mt-10 pt-8 border-t border-white/15 flex flex-wrap items-center justify-center gap-y-2 gap-x-8 text-xs text-slate-200 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#70C038]" />
            No credit card required for setup demo
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#70C038]" />
            Assisted data import from Excel or QuickBooks
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#70C038]" />
            Dedicated Pan-African customer onboarding
          </span>
        </div>
      </div>
    </section>
  );
};
