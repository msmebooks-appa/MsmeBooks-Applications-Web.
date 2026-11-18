import React, { useState } from 'react';
import { PARTNER_CATEGORIES } from '../data/partnersData';
import { ArrowRight, Calculator, BookOpen, FileSpreadsheet, ShieldCheck, Laptop, Cpu, Layers, Monitor, TrendingUp, Briefcase, Coins, GraduationCap, Share2, Workflow } from 'lucide-react';
import { CategoryGroupId } from '../types';

interface PartnerCategoriesSectionProps {
  onSelectCategoryToApply: (categoryTitle: string) => void;
}

export const PartnerCategoriesSection: React.FC<PartnerCategoriesSectionProps> = ({
  onSelectCategoryToApply
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | CategoryGroupId>('all');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-5 h-5" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-5 h-5" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Laptop': return <Laptop className="w-5 h-5" />;
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'Monitor': return <Monitor className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5" />;
      case 'Coins': return <Coins className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Share2': return <Share2 className="w-5 h-5" />;
      case 'Workflow': return <Workflow className="w-5 h-5" />;
      default: return <Briefcase className="w-5 h-5" />;
    }
  };

  const filteredCategories = activeFilter === 'all'
    ? PARTNER_CATEGORIES
    : PARTNER_CATEGORIES.filter(c => c.group === activeFilter);

  return (
    <section id="categories" className="py-20 lg:py-28 bg-white dark:bg-[#061F4A] border-b border-slate-200 dark:border-blue-900/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            Partner Ecosystem Diversity
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
            Partner Categories — Who Can Join?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-blue-100/80 font-normal">
            Whether your core expertise lies in accounting, retail POS hardware, ERP migration, or business consulting, our tailored partner tracks provide immediate revenue opportunities.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100 dark:bg-[#0A2552] rounded-xl max-w-2xl mx-auto mb-12 border border-slate-200 dark:border-blue-800/60">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-white dark:bg-[#061F4A] text-[#0A3981] dark:text-[#8CE600] shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Categories ({PARTNER_CATEGORIES.length})
          </button>
          <button
            onClick={() => setActiveFilter('finance')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'finance'
                ? 'bg-white dark:bg-[#061F4A] text-[#0A3981] dark:text-[#8CE600] shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Financial & Tax (4)
          </button>
          <button
            onClick={() => setActiveFilter('technology')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'technology'
                ? 'bg-white dark:bg-[#061F4A] text-[#0A3981] dark:text-[#8CE600] shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Technology & POS (5)
          </button>
          <button
            onClick={() => setActiveFilter('advisory')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'advisory'
                ? 'bg-white dark:bg-[#061F4A] text-[#0A3981] dark:text-[#8CE600] shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Advisory & Consulting (4)
          </button>
          <button
            onClick={() => setActiveFilter('retail')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'retail'
                ? 'bg-white dark:bg-[#061F4A] text-[#0A3981] dark:text-[#8CE600] shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Hardware & Retail (1)
          </button>
        </div>

        {/* 14 Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white dark:bg-[#0A2552] rounded-2xl p-6 border border-slate-200 dark:border-blue-800/60 shadow-sm hover:border-[#0A3981]/40 dark:hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#061F4A] text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800">
                    {getIcon(cat.icon)}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {cat.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-blue-100/75 mb-4 leading-relaxed">
                  {cat.shortDesc}
                </p>

                <div className="mb-6">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-blue-200 mb-2">
                    Key Opportunities:
                  </div>
                  <ul className="space-y-1.5">
                    {cat.opportunities.map((opp, i) => (
                      <li key={i} className="text-xs text-slate-700 dark:text-slate-200 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8CE600] mt-1.5 shrink-0" />
                        <span>{opp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => onSelectCategoryToApply(cat.title)}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-[#0A3981] dark:text-[#8CE600] bg-blue-50/70 dark:bg-blue-950/60 hover:bg-blue-100/80 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/80 rounded-xl transition-colors"
              >
                Apply as Partner in this Track
                <ArrowRight className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
