import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Laptop, Smartphone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FreeTrialCtaProps {
  onOpenTrial: () => void;
  onOpenDemo: () => void;
}

export const FreeTrialCta: React.FC<FreeTrialCtaProps> = ({ onOpenTrial, onOpenDemo }) => {
  const { t } = useLanguage();

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-[#0A4FD5] via-[#0E52D6] to-[#07389B] dark:from-[#08235E] dark:via-[#09358C] dark:to-[#051636] text-white relative overflow-hidden transition-colors duration-300">
      {/* Background circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#84CC16]/20 blur-2xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left: Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-lime-300 text-xs font-bold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              {t.freeTrial.badge}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t.freeTrial.title}
            </h2>

            <p className="text-base sm:text-lg text-blue-100 leading-relaxed max-w-2xl">
              {t.freeTrial.subtitle}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={onOpenTrial}
                className="inline-flex items-center justify-center gap-2 bg-[#84CC16] hover:bg-[#65A30D] text-[#0B192C] font-black text-base px-8 py-4 rounded-xl shadow-xl shadow-lime-900/20 hover:shadow-2xl transition-all cursor-pointer group"
              >
                <span>{t.freeTrial.ctaTrial}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-bold text-base px-8 py-4 rounded-xl backdrop-blur-md transition-all cursor-pointer"
              >
                <span>{t.freeTrial.ctaDemo}</span>
              </button>
            </div>

            {/* Trust text */}
            <div className="pt-3 flex items-center gap-2 text-xs sm:text-sm text-blue-200">
              <ShieldCheck className="w-4 h-4 text-lime-400 shrink-0" />
              <span>{t.pricing.moneyBackGuarantee} • {t.common.noCardRequired}</span>
            </div>
          </div>

          {/* Right: High-quality African SME Owner visual & interactive preview card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl shadow-blue-950/40 aspect-4/3 group">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80"
                alt="African SME business owner reviewing real-time analytics on laptop"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

              {/* Floating Live Badge Over Photo */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-slate-900 p-3 rounded-xl border border-white shadow-lg text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold">Real-time Cloud Sync</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 font-medium">Lagos & Kano branches active</div>
              </div>

              {/* Floating Bottom Card Over Photo */}
              <div className="absolute bottom-4 inset-x-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-white text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-lime-400 font-bold text-[11px] uppercase tracking-wider">Business Impact</span>
                  <span className="text-slate-300 text-[10px]">Today's Summary</span>
                </div>
                <div className="text-base font-extrabold text-white mt-1">
                  ₦2,450,000 Sales Recorded
                </div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  142 POS receipts • 0 stock errors • 100% reconciled
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
