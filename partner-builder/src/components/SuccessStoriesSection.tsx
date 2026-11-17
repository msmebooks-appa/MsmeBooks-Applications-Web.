import React, { useState } from 'react';
import { SUCCESS_STORIES } from '../data/partnersData';
import { MapPin, Quote, TrendingUp, CheckCircle, Award, Globe, Sparkles } from 'lucide-react';

export const SuccessStoriesSection: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  const filteredStories = SUCCESS_STORIES.filter((story) => {
    if (selectedCountry === 'all') return true;
    return story.country?.toLowerCase() === selectedCountry.toLowerCase();
  });

  const countries = [
    { id: 'all', name: 'All Stories', flag: '🌍', count: SUCCESS_STORIES.length },
    { id: 'Nigeria', name: 'Nigeria', flag: '🇳🇬' },
    { id: 'Kenya', name: 'Kenya', flag: '🇰🇪' },
    { id: 'Senegal', name: 'Senegal', flag: '🇸🇳' },
    { id: 'Côte d’Ivoire', name: 'Côte d’Ivoire', flag: '🇨🇮' },
    { id: 'Uganda', name: 'Uganda', flag: '🇺🇬' },
    { id: 'Tanzania', name: 'Tanzania', flag: '🇹🇿' }
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50/70 dark:bg-[#04183A] border-b border-slate-200 dark:border-blue-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Proven Pan-African Partner Outcomes
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
            Partner Success Stories Across Africa
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Discover how chartered accountants, ERP consultants, and retail POS agents in Nigeria, Kenya, Senegal, Côte d'Ivoire, Uganda, and Tanzania build predictable recurring monthly revenue on MsmeBooks.
          </p>
        </div>

        {/* Pan-African Country Filter Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {countries.map((c) => {
            const isActive = selectedCountry === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCountry(c.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isActive
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] border-[#0A3981] dark:border-[#8CE600] shadow-md ring-2 ring-[#0A3981]/20 dark:ring-[#8CE600]/30'
                    : 'bg-white dark:bg-[#0A2552] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-800/80 hover:border-blue-400 hover:bg-slate-100 dark:hover:bg-blue-900/40'
                }`}
              >
                <span className="text-sm select-none">{c.flag}</span>
                <span>{c.name}</span>
                {c.count !== undefined && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/10 dark:bg-white/10 ml-0.5">
                    {c.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story, idx) => {
            const imgPath = story.imageUrl || (story.imageType === 'accountant'
              ? '/src/assets/images/african_accountant_consultant_1793445549640.jpg'
              : '/src/assets/images/african_pos_retail_tech_1793445549072.jpg');

            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#0A2552] rounded-3xl border border-slate-200 dark:border-blue-800/80 shadow-sm overflow-hidden hover:shadow-xl dark:hover:border-[#8CE600]/60 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Banner with Authentic African Professional */}
                  <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                    <img
                      src={imgPath}
                      alt={story.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    
                    {/* Top Country Flag Tag */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                      <span>{story.countryFlag || '🌍'}</span>
                      <span>{story.country || 'Pan-Africa'}</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-[11px] font-bold text-[#8CE600] uppercase tracking-wider">
                        {story.type}
                      </div>
                      <div className="text-lg font-black leading-tight mt-0.5">{story.name}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-1">
                        <MapPin className="w-3 h-3 text-[#8CE600] shrink-0" />
                        <span className="truncate">{story.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4">
                    {/* Tier Pill */}
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-[#061F4A] px-2.5 py-1 rounded-full border border-blue-100 dark:border-blue-800/80">
                        {story.tier}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {story.founder}
                      </span>
                    </div>

                    {/* Quantified Outcomes */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-sky-300 mb-2">
                        Verified Outcomes:
                      </div>
                      <div className="space-y-1.5">
                        {story.results.map((res, rIdx) => (
                          <div
                            key={rIdx}
                            className="flex items-center gap-2 text-xs font-bold text-[#0A3981] dark:text-[#8CE600] bg-blue-50/70 dark:bg-[#061F4A] p-2 rounded-xl border border-blue-100 dark:border-blue-900/70"
                          >
                            <TrendingUp className="w-3.5 h-3.5 text-[#8CE600] shrink-0" />
                            <span className="truncate">{res}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Attributable Quote */}
                    <div className="relative border-l-2 border-[#0A3981] dark:border-[#8CE600] pl-3 py-1 italic text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      &ldquo;{story.quote}&rdquo;
                    </div>
                  </div>
                </div>

                <div className="px-5 sm:px-6 py-3 border-t border-slate-100 dark:border-blue-900/50 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50/50 dark:bg-[#081e42]/50">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Verified Practice</span>
                  <span className="font-mono text-[#0A3981] dark:text-[#8CE600] font-bold">Active Accreditation</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
