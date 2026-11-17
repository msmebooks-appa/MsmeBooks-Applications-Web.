import React, { useState, useMemo } from 'react';
import { Globe2, ArrowRight, Search, X } from 'lucide-react';
import { COUNTRIES_LIST } from '../data/partnersData';

interface CountryDirectorySectionProps {
  onSelectCountry: (countryName: string) => void;
}

export const CountryDirectorySection: React.FC<CountryDirectorySectionProps> = ({
  onSelectCountry,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'africa' | 'global'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubRegion, setSelectedSubRegion] = useState<string>('all');
  const [showAll, setShowAll] = useState(false);

  // Subregions available for filtering
  const availableSubRegions = useMemo(() => {
    const list = COUNTRIES_LIST.filter(c => {
      if (activeTab === 'africa') return c.region === 'Africa';
      if (activeTab === 'global') return c.region === 'Global';
      return true;
    });
    const subSet = new Set<string>();
    list.forEach(c => {
      if (c.subRegion) subSet.add(c.subRegion);
    });
    return Array.from(subSet);
  }, [activeTab]);

  const filteredCountries = useMemo(() => {
    return COUNTRIES_LIST.filter(c => {
      // 1. Region tab filter
      if (activeTab === 'africa' && c.region !== 'Africa') return false;
      if (activeTab === 'global' && c.region !== 'Global') return false;

      // 2. SubRegion filter
      if (selectedSubRegion !== 'all' && c.subRegion !== selectedSubRegion) return false;

      // 3. Search text filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesCode = c.code.toLowerCase().includes(q);
        const matchesSubRegion = c.subRegion ? c.subRegion.toLowerCase().includes(q) : false;
        const matchesCities = c.cities.some(city => city.toLowerCase().includes(q));
        if (!matchesName && !matchesCode && !matchesSubRegion && !matchesCities) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, selectedSubRegion, searchQuery]);

  // Initial display limit if not searching
  const displayedCountries = useMemo(() => {
    if (showAll || searchQuery.trim() || selectedSubRegion !== 'all') {
      return filteredCountries;
    }
    return filteredCountries.slice(0, 24);
  }, [filteredCountries, showAll, searchQuery, selectedSubRegion]);

  return (
    <section id="countries" className="py-20 bg-slate-50 dark:bg-[#07162b] text-slate-900 dark:text-white relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-500/30 text-xs font-semibold text-blue-700 dark:text-lime-400 mb-2">
              <Globe2 className="w-3.5 h-3.5" />
              <span>Pan-African & Global Coverage (All 54 African Nations + Global Hubs)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore MsmeBooks Partners by Country
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
              Connect with accredited accounting and technology partners across all 54 sovereign African countries and global trade hubs, trained on localized fiscal compliance and multi-currency billing.
            </p>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 self-start md:self-auto transition-colors shrink-0">
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedSubRegion('all');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-lime-500 text-slate-950 shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Regions ({COUNTRIES_LIST.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('africa');
                setSelectedSubRegion('all');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'africa'
                  ? 'bg-lime-500 text-slate-950 shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Africa (All 54 Nations)
            </button>
            <button
              onClick={() => {
                setActiveTab('global');
                setSelectedSubRegion('all');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'global'
                  ? 'bg-lime-500 text-slate-950 shadow'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Global Hubs ({COUNTRIES_LIST.filter(c => c.region === 'Global').length})
            </button>
          </div>
        </div>

        {/* Search & Subregion Pills Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-8 bg-white dark:bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Quick Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any country, region or city (e.g. Lagos, Kenya, London, Dubai)..."
              className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* SubRegion Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedSubRegion('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSubRegion === 'all'
                  ? 'bg-lime-500/20 text-lime-800 dark:text-lime-300 border border-lime-500/40'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Subregions
            </button>
            {availableSubRegions.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubRegion(sub)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSubRegion === sub
                    ? 'bg-lime-500/20 text-lime-800 dark:text-lime-300 border border-lime-500/40'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Empty Search State */}
        {filteredCountries.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center">
            <Globe2 className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No countries match &quot;{searchQuery}&quot;
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Try searching by country name, regional subregion, or key city.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubRegion('all');
              }}
              className="mt-3 px-3.5 py-1.5 rounded-lg bg-lime-500 text-slate-950 text-xs font-bold shadow hover:bg-lime-400"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <>
            {/* Country Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayedCountries.map((country) => (
                <div
                  key={country.code}
                  onClick={() => onSelectCountry(country.name)}
                  className="bg-white dark:bg-[#0c223e] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 hover:border-lime-500 dark:hover:border-lime-400/80 transition-all hover:shadow-xl hover:shadow-lime-500/5 group cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl select-none">{country.flag}</span>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-lime-400 border border-slate-200 dark:border-slate-700 group-hover:border-lime-500/40">
                          {country.partnerCount} Partners
                        </span>
                        {country.subRegion && (
                          <span className="text-[10px] text-slate-400">
                            {country.subRegion}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                      {country.name}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Key hubs: {country.cities.slice(0, 3).join(', ')}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors">
                    <span>Explore Partners</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* Show All Toggle if > 24 countries */}
            {!showAll && !searchQuery.trim() && selectedSubRegion === 'all' && filteredCountries.length > 24 && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Globe2 className="w-4 h-4 text-lime-400" />
                  <span>Show All {filteredCountries.length} Countries</span>
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </section>
  );
};
