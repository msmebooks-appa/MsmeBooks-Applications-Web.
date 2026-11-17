import React, { useState } from 'react';
import { 
  PARTNER_CATEGORIES 
} from '../data/partnerData';
import { CategoryItem } from '../types';
import { 
  ArrowRight, 
  Check, 
  Sparkles, 
  Search, 
  Filter, 
  Layers,
  ChevronRight
} from 'lucide-react';

interface EcosystemSectionProps {
  onSelectCategory: (category: CategoryItem) => void;
  onOpenApplyModal: (categoryName?: string) => void;
}

export const EcosystemSection: React.FC<EcosystemSectionProps> = ({
  onSelectCategory,
  onOpenApplyModal
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const groups = ['All', 'Finance & Tax', 'Technology & IT', 'Advisory & Strategy', 'Channels & Education'];

  const filteredCategories = PARTNER_CATEGORIES.filter((cat) => {
    const matchesGroup = selectedGroup === 'All' || cat.categoryGroup === selectedGroup;
    const matchesSearch = 
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  return (
    <section id="ecosystem" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#65A30D]" />
            Partner Ecosystem
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A192F] tracking-tight font-display">
            Built for Everyone Helping African Businesses Grow
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            MsmeBooks collaborates with the trusted professionals, technology vendors, and advisory organizations that already power MSMEs across the continent. Discover where you fit in our high-yield partner network.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-100">
          
          {/* Category Group Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  selectedGroup === group
                    ? 'bg-[#0F4C81] text-white shadow-md shadow-[#0F4C81]/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          {/* Quick Filter Search */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search partner categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 transition-all bg-slate-50/50"
            />
          </div>

        </div>

        {/* Category Cards Grid (13 Categories from User Prompt) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              id={`partner-cat-${category.id}`}
              className="group relative rounded-2xl p-6 bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-[#0F4C81]/40 shadow-xs hover:shadow-xl hover:shadow-[#0F4C81]/10 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-[#84CC16] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-t" />

              <div>
                {/* Header: Emoji icon + Category Group Tag */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="w-13 h-13 rounded-2xl bg-white group-hover:bg-[#0F4C81]/10 border border-slate-200 group-hover:border-[#0F4C81]/30 flex items-center justify-center text-2xl shadow-xs transition-colors">
                    {category.emoji}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                    {category.categoryGroup}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-[#0A192F] group-hover:text-[#0F4C81] transition-colors mb-2.5 font-display">
                  {category.title}
                </h3>

                {/* Short Description (Exact user prompt text) */}
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {category.shortDesc}
                </p>

                {/* Lemon-green value preview pill */}
                <div className="mb-6 p-2.5 rounded-xl bg-lime-50/70 border border-lime-200/80 text-xs text-[#365314] font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#65A30D]" />
                  <span className="line-clamp-1">{category.partnerRevenueModel}</span>
                </div>
              </div>

              {/* Card Footer: Learn More Interaction */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onSelectCategory(category)}
                  className="text-xs font-bold text-[#0F4C81] hover:text-[#0A3861] inline-flex items-center gap-1.5 group-hover:underline"
                >
                  <span>Learn More</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => onOpenApplyModal(category.title)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Join as {category.title.split(' ')[0]}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if search has no match */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-sm">No partner categories matching "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('All');
              }}
              className="mt-3 text-xs font-bold text-[#0F4C81] underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Bottom invitation card */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-[#0F4C81] via-[#1E40AF] to-[#0A2540] p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-2xl">
            <span className="px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase tracking-wider bg-[#84CC16] text-[#0A192F] inline-block mb-2">
              Multi-Tenant Partner Architecture
            </span>
            <h4 className="text-xl sm:text-2xl font-bold font-display">
              Don't see your exact business category above?
            </h4>
            <p className="text-sm text-blue-100 mt-1">
              If your organization serves African micro, small, or medium enterprises in any capacity, our flexible partner framework adapts to your client workflows.
            </p>
          </div>
          <button
            onClick={() => onOpenApplyModal('General Inquiry')}
            className="whitespace-nowrap px-6 py-3 rounded-xl bg-[#84CC16] text-[#0A192F] font-bold text-sm hover:bg-[#A3E635] shadow-lg shadow-[#84CC16]/20 transition-all flex items-center gap-2"
          >
            <span>Speak With Partnership Director</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
