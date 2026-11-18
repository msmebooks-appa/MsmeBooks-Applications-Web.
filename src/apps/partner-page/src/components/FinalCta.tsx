import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  Globe2 
} from 'lucide-react';

interface FinalCtaProps {
  onOpenApplyModal: () => void;
  onOpenContactModal: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({
  onOpenApplyModal,
  onOpenContactModal
}) => {
  return (
    <section id="final-cta" className="py-20 bg-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl bg-gradient-to-r from-[#0F4C81] via-[#1E40AF] to-[#0A2540] p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl">
          
          {/* Subtle glow circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#84CC16]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#84CC16] text-xs font-extrabold uppercase tracking-wider mb-4 border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              Pan-African Business Modernization
            </span>

            {/* Headline (Prompt Mandate) */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display mb-4">
              Build the Future of African Business With MsmeBooks
            </h2>

            {/* Supporting copy (Prompt Mandate) */}
            <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed mb-8">
              Partner with a modern business technology platform designed to help MSMEs work smarter, manage better and grow faster.
            </p>

            {/* Buttons (Prompt Mandate: Join the Partner Program + Contact MsmeBooks) */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="final-join-program-btn"
                onClick={onOpenApplyModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-extrabold text-[#0A192F] bg-[#84CC16] hover:bg-[#9BE22D] shadow-xl shadow-[#84CC16]/25 transition-all duration-200 active:scale-[0.98] group"
              >
                <span>Join the Partner Program</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="final-contact-btn"
                onClick={onOpenContactModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4 text-[#84CC16]" />
                <span>Contact MsmeBooks</span>
              </button>
            </div>

            {/* Micro reassurance */}
            <p className="text-xs text-slate-400 mt-6 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#84CC16]" />
              Takes 2 minutes to register • Instant partner dashboard access • No commitment required
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
