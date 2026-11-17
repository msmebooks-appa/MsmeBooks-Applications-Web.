import React, { useState, useMemo } from 'react';
import { INITIAL_RESOURCES } from '../data/mockPartnerData';
import { PartnerResourceItem } from '../types/partner';
import { Download, Search, FileText, Video, Sparkles, Filter, CheckCircle2 } from 'lucide-react';

interface PartnerResourcesSectionProps {
  onOpenApply: () => void;
}

export const PartnerResourcesSection: React.FC<PartnerResourcesSectionProps> = ({ onOpenApply }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'all',
    'Sales & Presentation',
    'Marketing Creatives',
    'Product Guides',
    'Certification'
  ];

  const filteredResources = useMemo(() => {
    return INITIAL_RESOURCES.filter(res => {
      if (selectedCategory !== 'all' && res.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          res.title.toLowerCase().includes(q) ||
          res.description.toLowerCase().includes(q) ||
          res.format.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="resources" className="py-20 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0046B8] dark:text-blue-400">
              <span>Section 05</span>
              <span aria-hidden="true">·</span>
              <span>Enablement & Collateral</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Partner Enablement & Resource Centre
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              Equip your advisory, consulting, and sales teams with verified product pitch decks, social media templates, migration guides, and hardware matrices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 font-mono">
              {INITIAL_RESOURCES.length} Official Assets Available
            </span>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Filter enablement assets..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0046B8] dark:focus:ring-lime-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0046B8] dark:bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? 'All Collateral' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(res => (
            <div
              key={res.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:border-blue-300 dark:hover:border-slate-700 hover:shadow-md transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#0046B8] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 border border-blue-100 dark:border-blue-900/60 px-2.5 py-0.5 rounded">
                    {res.format} · {res.size}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 font-medium">{res.category}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">Available to all active tiers</span>
                <button
                  type="button"
                  onClick={() => alert(`Starting download for: ${res.title}`)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0046B8] dark:text-lime-400 hover:text-[#003893] dark:hover:text-lime-300 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Asset</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
