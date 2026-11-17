import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Store, 
  UtensilsCrossed, 
  Hotel, 
  Truck, 
  Briefcase, 
  Sparkles, 
  Pill, 
  HardHat, 
  GraduationCap, 
  ShoppingBag, 
  Calculator, 
  Rocket,
  ArrowRight
} from 'lucide-react';

interface WhoWeServeSectionProps {
  onOpenDemo: () => void;
}

export const WhoWeServeSection: React.FC<WhoWeServeSectionProps> = ({ onOpenDemo }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'commerce' | 'hospitality' | 'services' | 'growth'>('all');
  const { t } = useLanguage();

  const filteredIndustries = activeFilter === 'all'
    ? t.serve_industries
    : t.serve_industries.filter((ind) => ind.category === activeFilter);

  const getIndustryIcon = (name: string) => {
    switch (name) {
      case 'Store': return <Store className="w-5 h-5 text-[#0B4EA2]" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5 text-[#84CC16]" />;
      case 'Hotel': return <Hotel className="w-5 h-5 text-[#0B4EA2]" />;
      case 'Truck': return <Truck className="w-5 h-5 text-[#84CC16]" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-[#0B4EA2]" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#84CC16]" />;
      case 'Pill': return <Pill className="w-5 h-5 text-[#0B4EA2]" />;
      case 'HardHat': return <HardHat className="w-5 h-5 text-[#84CC16]" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-[#0B4EA2]" />;
      case 'ShoppingBag': return <ShoppingBag className="w-5 h-5 text-[#84CC16]" />;
      case 'Calculator': return <Calculator className="w-5 h-5 text-[#0B4EA2]" />;
      case 'Rocket': return <Rocket className="w-5 h-5 text-[#84CC16]" />;
      default: return <Store className="w-5 h-5 text-[#0B4EA2]" />;
    }
  };

  return (
    <section id="who-we-serve" className="py-16 md:py-24 bg-white dark:bg-black border-b border-slate-200/80 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B4EA2] dark:text-[#38BDF8] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
            <span>{t.serve_eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
            {t.serve_title_1}{' '}
            <span className="text-[#0B4EA2] dark:text-[#38BDF8]">{t.serve_title_2}</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            {t.serve_desc}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {[
            { id: 'all', label: t.serve_filter_all },
            { id: 'commerce', label: t.serve_filter_commerce },
            { id: 'hospitality', label: t.serve_filter_hospitality },
            { id: 'services', label: t.serve_filter_services },
            { id: 'growth', label: t.serve_filter_growth },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#0B4EA2] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 12 Industry Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredIndustries.map((ind) => (
            <div
              key={ind.id}
              className="bg-white dark:bg-zinc-950 rounded-2xl p-6 border border-slate-200/90 dark:border-zinc-800 shadow-xs hover:border-[#0B4EA2]/40 dark:hover:border-[#38BDF8]/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center mb-4 group-hover:bg-blue-50 dark:group-hover:bg-zinc-800 transition-colors">
                  {getIndustryIcon(ind.iconName)}
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0B4EA2] dark:group-hover:text-[#38BDF8] transition-colors mb-2">
                  {ind.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {ind.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-[#65A30D] dark:text-lime-400 font-bold">{t.serve_key_focus}</span> {ind.keyCapability}
                </div>
                <button
                  onClick={onOpenDemo}
                  className="w-full flex items-center justify-between text-xs font-semibold text-[#0B4EA2] dark:text-[#38BDF8] hover:text-[#083770] dark:hover:text-white cursor-pointer"
                >
                  <span>{t.serve_btn}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#84CC16] group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
