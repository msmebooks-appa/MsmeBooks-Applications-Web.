import React, { useState } from 'react';
import {
  Store,
  UtensilsCrossed,
  Hotel,
  Building2,
  Briefcase,
  Cog,
  Truck,
  Sparkles,
  Globe,
  Calculator,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { INDUSTRIES } from '../data/mockData';

interface IndustriesProps {
  onOpenStartFree: () => void;
  onOpenBookDemo: () => void;
}

const iconIndustryMap: Record<string, any> = {
  retail: Store,
  restaurants: UtensilsCrossed,
  hotels: Hotel,
  'real-estate': Building2,
  services: Briefcase,
  manufacturing: Cog,
  wholesale: Truck,
  beauty: Sparkles,
  ecommerce: Globe,
  'accounting-firms': Calculator,
};

export const Industries: React.FC<IndustriesProps> = ({ onOpenStartFree, onOpenBookDemo }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(INDUSTRIES[0]);

  return (
    <section id="industries" className="py-20 lg:py-28 bg-[#F8FAFD] dark:bg-[#090E1A] border-b border-slate-200/70 dark:border-slate-800 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Tailored Industry Blueprints</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight">
            Built for the Way African Businesses Work
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Generic accounting software forces you to change how you work. MsmeBooks comes pre-configured with workflows, tax rules, and module combinations designed for your exact trade.
          </p>
        </div>

        {/* Industry Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
          {INDUSTRIES.map((ind) => {
            const Icon = iconIndustryMap[ind.id] || Store;
            const isSelected = selectedIndustry.id === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setSelectedIndustry(ind)}
                className={`p-4 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-white dark:bg-[#131D31] border-[#0866FF] shadow-lg shadow-blue-500/10 ring-2 ring-[#0866FF]/20'
                    : 'bg-white/80 dark:bg-[#0E172A] border-slate-200/80 dark:border-slate-800 hover:bg-white dark:hover:bg-[#131D31] hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#0866FF] text-white'
                          : 'bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 group-hover:bg-[#0866FF] group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-[#B7F000]" />
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#0866FF] dark:group-hover:text-[#B7F000] transition-colors leading-snug">
                    {ind.name}
                  </h3>
                  <p className="text-[11px] text-[#0866FF] dark:text-blue-400 font-semibold mt-1">
                    {ind.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <span>{ind.stats}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0866FF] dark:group-hover:text-[#B7F000] group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Industry Spotlight Modal / Banner */}
        <div className="bg-white dark:bg-[#0E172A] rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-200/80 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#B7F000]/30 text-slate-900 dark:text-[#B7F000] font-bold text-xs">
                {selectedIndustry.name} Solution Pack
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                {selectedIndustry.stats}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white font-display">
              {selectedIndustry.tagline}
            </h3>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedIndustry.description}
            </p>

            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Key Industry-Specific Capabilities:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-700 dark:text-slate-200">
                {selectedIndustry.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 flex items-center gap-3">
              <button
                onClick={onOpenStartFree}
                className="px-6 py-3 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
              >
                <span>Deploy {selectedIndustry.name} Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenBookDemo}
                className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
              >
                Schedule Industry Walkthrough
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 aspect-video sm:aspect-[4/3] relative">
              <img
                src={selectedIndustry.image}
                alt={selectedIndustry.name}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold font-display">{selectedIndustry.name}</div>
                  <div className="text-xs text-slate-300">Live MsmeBooks Configuration</div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#B7F000] text-slate-950">
                  Pre-built
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
