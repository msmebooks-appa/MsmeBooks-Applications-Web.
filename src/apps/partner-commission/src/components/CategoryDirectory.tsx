import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, HelpCircle } from 'lucide-react';
import { PARTNER_CATEGORIES } from '../data/partnerData';
import { PartnerCategory } from '../types/partner';

interface CategoryDirectoryProps {
  onSelectCategory: (category: PartnerCategory) => void;
}

export const CategoryDirectory: React.FC<CategoryDirectoryProps> = ({ onSelectCategory }) => {
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCategories = useMemo(() => {
    return PARTNER_CATEGORIES.filter((cat) => {
      const matchesSector = selectedSector === 'all' || cat.sector === selectedSector;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        cat.name.toLowerCase().includes(query) ||
        cat.roleDescription.toLowerCase().includes(query) ||
        cat.customerOpportunities.toLowerCase().includes(query) ||
        cat.solutionsToPromote.some((s) => s.toLowerCase().includes(query));
      return matchesSector && matchesSearch;
    });
  }, [selectedSector, searchQuery]);

  return (
    <section id="categories" className="py-20 lg:py-28 bg-white dark:bg-[#0E1A30] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider">
              <span>Partner Ecosystem Directory</span>
              <span aria-hidden="true">·</span>
              <span>18 Eligible Categories</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] dark:text-white tracking-tight">
              Who Can Become an MsmeBooks Partner?
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Whether you provide accounting advisory, deploy retail POS hardware, develop IT integrations, or guide enterprise SME growth, MsmeBooks provides a customized commercial partnership model.
            </p>
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 18 partner roles..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#14233c] text-[#142D4E] dark:text-white focus:bg-white dark:focus:bg-[#1a2d4c] focus:outline-none focus:ring-2 focus:ring-[#1261B5]/30 focus:border-[#1261B5] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedSector('all')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedSector === 'all'
                ? 'bg-[#1261B5] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#14233c] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            All Categories ({PARTNER_CATEGORIES.length})
          </button>
          <button
            onClick={() => setSelectedSector('accounting')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedSector === 'accounting'
                ? 'bg-[#1261B5] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#14233c] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Accounting & Tax (4)
          </button>
          <button
            onClick={() => setSelectedSector('technology')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedSector === 'technology'
                ? 'bg-[#1261B5] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#14233c] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Technology & IT (6)
          </button>
          <button
            onClick={() => setSelectedSector('retail')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedSector === 'retail'
                ? 'bg-[#1261B5] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#14233c] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Retail & Commerce (2)
          </button>
          <button
            onClick={() => setSelectedSector('advisory')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              selectedSector === 'advisory'
                ? 'bg-[#1261B5] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#14233c] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Advisory & Enterprise (6)
          </button>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 dark:bg-[#14233c] rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No partner categories match your search.</p>
            <button
              onClick={() => {
                setSelectedSector('all');
                setSearchQuery('');
              }}
              className="mt-3 text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] hover:underline"
            >
              Reset filters and view all 18 categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#14233c] p-6 flex flex-col justify-between hover:border-[#1261B5]/50 dark:hover:border-[#B9E51C]/50 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {/* Category Title & Sector unboxed text */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                      <span>{cat.sectorLabel}</span>
                      <span className="text-[#1261B5] dark:text-[#B9E51C] font-mono">Role ID: #{cat.id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#142D4E] dark:text-white group-hover:text-[#1261B5] dark:group-hover:text-[#B9E51C] transition-colors leading-snug">
                      {cat.name}
                    </h3>
                  </div>

                  {/* Role explanation */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {cat.roleDescription}
                  </p>

                  {/* Typical customer opportunities */}
                  <div className="text-xs bg-slate-50 dark:bg-[#0c182c] p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 space-y-1">
                    <span className="text-[11px] font-bold text-[#142D4E] dark:text-white uppercase tracking-wider block">
                      Target Customer Opportunities:
                    </span>
                    <p className="text-slate-600 dark:text-slate-300">{cat.customerOpportunities}</p>
                  </div>

                  {/* Relevant MsmeBooks solutions to promote */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
                      Solutions to Promote:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.solutionsToPromote.map((sol, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#0c182c] px-2.5 py-1 rounded-md border border-transparent dark:border-slate-700/60"
                        >
                          {sol}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Card Footer: Suggested Level Guidance & Apply CTA */}
                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="block font-semibold text-slate-700 dark:text-slate-200">Guidance Level:</span>
                    <span className="text-[#1261B5] dark:text-[#B9E51C] font-medium">{cat.suggestedTierLabel}</span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500">(Subject to review)</span>
                  </div>

                  <button
                    onClick={() => onSelectCategory(cat)}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#1261B5] hover:bg-[#0e4e94] rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs"
                  >
                    <span>Apply Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Guidance disclaimer note */}
        <div className="mt-10 text-center text-xs text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          <p>
            *Suggested partnership levels reflect recommended starting tiers based on operational capacity. Final partner tier assignments are confirmed during the individual review process by the MsmeBooks partner onboarding team.
          </p>
        </div>
      </div>
    </section>
  );
};
