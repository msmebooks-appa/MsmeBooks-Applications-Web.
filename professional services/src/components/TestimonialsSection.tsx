import React, { useState } from 'react';
import { 
  Star, 
  Quote, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/testimonialsData';

// Helper to compute initials from client names
const getAuthorInitials = (name: string): string => {
  const cleanName = name.replace(/,.*$/, '').trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'MB';
  if (parts.length === 1) {
    if (parts[0].includes('-')) {
      const sub = parts[0].split('-');
      return (sub[0][0] + (sub[1]?.[0] || '')).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

const getInitialsGradient = (index: number): string => {
  const gradients = [
    'from-[#102B4E] to-[#1464C8] text-[#B7E532] border-blue-200/80 dark:border-blue-800 ring-2 ring-[#B7E532]/30',
    'from-indigo-600 to-blue-700 text-white border-indigo-200/80 dark:border-indigo-800 ring-2 ring-indigo-400/30',
    'from-emerald-600 to-teal-700 text-white border-emerald-200/80 dark:border-emerald-800 ring-2 ring-emerald-400/30',
    'from-amber-500 to-orange-600 text-white border-amber-200/80 dark:border-amber-800 ring-2 ring-amber-400/30',
  ];
  return gradients[index % gradients.length];
};

export const TestimonialsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Accounting Transformation', 'POS Implementation', 'Hospitality Deployment', 'Bookkeeping Outsourcing'];

  const filtered = activeCategory === 'All' 
    ? TESTIMONIALS_DATA 
    : TESTIMONIALS_DATA.filter(t => t.category === activeCategory);

  return (
    <section className="py-20 bg-white dark:bg-[#07111D] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
            Proven Pan-African Impact
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#102B4E] dark:text-white tracking-tight">
            Trusted by Growing Enterprises Across the Continent
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base font-normal">
            Real stories from business owners, CFOs, and general managers who scaled with MsmeBooks software and verified professional services.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#0A1727] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#132842] border border-transparent dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#F5F9FD]/60 dark:bg-[#0A1727] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative group hover:border-[#1464C8]/50"
            >
              <div>
                {/* Top: Category Tag & Metric */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 bg-white dark:bg-[#0E2036] text-[#1464C8] dark:text-blue-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 shadow-2xs">
                    {item.category}
                  </span>

                  <div className="text-right">
                    <span className="text-xl font-black text-[#1464C8] dark:text-[#B7E532] block leading-none">
                      {item.statsMetric}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase">
                      {item.statsLabel}
                    </span>
                  </div>
                </div>

                {/* Quote Text */}
                <div className="relative">
                  <Quote className="w-8 h-8 text-[#1464C8]/15 dark:text-blue-400/15 absolute -top-2 -left-2 -z-0" />
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium relative z-10 italic">
                    "{item.quote}"
                  </p>
                </div>
              </div>

              {/* Author & Assigned Firm */}
              <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center font-black text-sm tracking-wider shadow-sm shrink-0 border-2 ${getInitialsGradient(idx)}`}
                    title={`${item.name} initials`}
                    aria-label={`${item.name} initials`}
                  >
                    {getAuthorInitials(item.name)}
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-[#102B4E] dark:text-white leading-tight">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">
                      {item.role}, {item.company}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" /> {item.city}, {item.country}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Partner Assigned
                  </span>
                  <span className="text-xs font-extrabold text-[#1464C8] dark:text-[#B7E532] flex items-center gap-1 justify-end">
                    <ShieldCheck className="w-3 h-3 text-[#1464C8] dark:text-[#B7E532]" />
                    {item.firmAssigned}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
