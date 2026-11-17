import React from 'react';
import { 
  ArrowRight, 
  MessageSquare, 
  Sparkles, 
  TrendingUp, 
  Users, 
  CheckCircle2,
  ShieldCheck,
  Share2,
  Zap
} from 'lucide-react';
import { ASSET_IMAGES } from '../data/partnerData';

interface PartnerCtaProps {
  onOpenApplyModal: () => void;
  onOpenContactModal: () => void;
}

export const PartnerCta: React.FC<PartnerCtaProps> = ({
  onOpenApplyModal,
  onOpenContactModal
}) => {
  return (
    <section id="partner-cta" className="py-20 relative overflow-hidden">
      {/* Container with Blue-to-Lemon-Green Gradient (Mandate) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0F4C81] to-[#365314] p-8 sm:p-12 md:p-16 text-white shadow-2xl border border-white/10">
          
          {/* Subtle Animated Particles & Network Node Background Visuals */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="network-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="1.5" fill="#84CC16" />
                  <circle cx="50" cy="50" r="1.5" fill="#0284C7" />
                  <line x1="10" y1="10" x2="50" y2="50" stroke="#84CC16" strokeWidth="0.5" strokeDasharray="3 3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#network-grid)" />
            </svg>
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#84CC16]/20 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0F4C81]/40 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headlines & CTAs (7 cols) */}
            <div className="lg:col-span-7 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#84CC16] text-xs font-bold uppercase tracking-wider mb-6 border border-white/10">
                <Share2 className="w-3.5 h-3.5" />
                Pan-African Partner Channel
              </div>

              {/* Headline (Prompt Mandate) */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-6 font-display">
                Your Network Is Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#84CC16] via-[#A3E635] to-emerald-300">
                  Opportunity.
                </span>
              </h2>

              {/* Supporting Copy (Prompt Mandate) */}
              <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8 max-w-xl">
                If you already work with businesses, you already have the relationships that can help Africa's MSMEs become more digital, organized and financially empowered. Partner with MsmeBooks and grow together.
              </p>

              {/* CTA Buttons (Prompt Mandate: Primary + Secondary) */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  id="cta-become-partner-btn"
                  onClick={onOpenApplyModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-extrabold text-[#0A192F] bg-[#84CC16] hover:bg-[#9BE22D] shadow-xl shadow-[#84CC16]/25 transition-all duration-200 active:scale-[0.98] group"
                >
                  <Sparkles className="w-5 h-5 fill-[#0A192F]" />
                  <span>Become a MsmeBooks Partner</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  id="cta-talk-team-btn"
                  onClick={onOpenContactModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200"
                >
                  <MessageSquare className="w-4 h-4 text-[#84CC16]" />
                  <span>Talk to Partnership Team</span>
                </button>
              </div>

              {/* Trust badges strip */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-xs text-slate-300 font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                  Immediate Portal Activation
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                  Dedicated Account Director
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                  15% – 40% Tiered Revenue
                </span>
              </div>

            </div>

            {/* Right Column: Visual Elements (5 cols) */}
            <div className="lg:col-span-5 relative">
              
              {/* Card with African Entrepreneur Portrait & Growth Metrics */}
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-5 shadow-2xl relative overflow-hidden">
                
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={ASSET_IMAGES.consultant}
                    alt="African business partner"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-xl object-cover border-2 border-[#84CC16]"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">Partner Network Growth</h4>
                    <p className="text-xs text-slate-300">Lagos • Nairobi • Accra • Kigali Hub</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-black/30 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-slate-300">MSME Subscriptions Deployed:</span>
                    <span className="font-mono text-[#84CC16] font-bold">14,200+ Active</span>
                  </div>

                  <div className="bg-black/30 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-slate-300">Monthly Recurring Payouts:</span>
                    <span className="font-mono text-emerald-300 font-bold">₦68,400,000+</span>
                  </div>

                  <div className="bg-black/30 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-slate-300">Client Renewal Rate:</span>
                    <span className="font-mono text-white font-bold">96.4%</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#84CC16]" />
                    Fast Direct Settlements
                  </span>
                  <span className="text-[#84CC16] font-bold">Pan-African Ready</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
