import React, { useState, useMemo } from 'react';
import { Job, WorkArrangement } from '../types/career';
import {
  MapPin,
  Search,
  Building2,
  Globe,
  Briefcase,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Compass,
  Laptop,
  Check,
  RotateCcw,
} from 'lucide-react';

interface LocationsDirectoryProps {
  jobs: Job[];
  selectedCountry?: string | null;
  selectedCity?: string | null;
  onSelectLocation: (criteria: { country?: string; state?: string; city?: string }) => void;
}

interface LocationMeta {
  flag: string;
  regionHub: string;
  currency: string;
  description: string;
  color: string;
}

const COUNTRY_META_LOOKUP: Record<string, LocationMeta> = {
  Nigeria: {
    flag: '🇳🇬',
    regionHub: 'West Africa Core HQ',
    currency: 'NGN / USD',
    description: 'Dynamic fintech & SME commerce capital with hubs across Lagos and nationwide.',
    color: 'emerald',
  },
  Kenya: {
    flag: '🇰🇪',
    regionHub: 'East Africa Silicon Savannah',
    currency: 'KES / USD',
    description: 'The Silicon Savannah powering mobile money, logistics, and regional tech innovation.',
    color: 'red',
  },
  Rwanda: {
    flag: '🇷🇼',
    regionHub: 'Innovation Sandbox',
    currency: 'RWF / USD',
    description: 'Pan-African innovation sandbox, green tech center, and Norrsken House ecosystem.',
    color: 'amber',
  },
  Ghana: {
    flag: '🇬🇭',
    regionHub: 'West Africa Commercial Hub',
    currency: 'GHS / USD',
    description: 'Rapidly expanding commercial gateway for software engineering and fintech operations.',
    color: 'yellow',
  },
  'South Africa': {
    flag: '🇿🇦',
    regionHub: 'Southern Africa Hub',
    currency: 'ZAR / USD',
    description: 'Advanced enterprise software, cloud infrastructure, and financial tech market.',
    color: 'blue',
  },
  Egypt: {
    flag: '🇪🇬',
    regionHub: 'North Africa Hub',
    currency: 'EGP / USD',
    description: 'Premier digital engineering hub linking Pan-African commerce with the MENA corridor.',
    color: 'amber',
  },
  Morocco: {
    flag: '🇲🇦',
    regionHub: 'North Africa Hub',
    currency: 'MAD / EUR',
    description: 'Casablanca financial center connecting multilingual enterprise software pipelines.',
    color: 'rose',
  },
  Senegal: {
    flag: '🇸🇳',
    regionHub: 'Francophone West Africa',
    currency: 'XOF / EUR',
    description: 'Leading Francophone innovation node and coastal logistics clearing corridor.',
    color: 'teal',
  },
  "Côte d'Ivoire": {
    flag: '🇨🇮',
    regionHub: 'West Africa Financial Hub',
    currency: 'XOF / EUR',
    description: 'Commercial heart of Francophone West Africa with deep mobile money penetration.',
    color: 'orange',
  },
  Uganda: {
    flag: '🇺🇬',
    regionHub: 'East Africa Growth Hub',
    currency: 'UGX / USD',
    description: 'Vibrant Great Lakes tech ecosystem driving merchant commerce and mobile payments.',
    color: 'yellow',
  },
  Tanzania: {
    flag: '🇹🇿',
    regionHub: 'East Africa Transit Hub',
    currency: 'TZS / USD',
    description: 'Commercial hub connecting Swahili-speaking commerce across East & Central Africa.',
    color: 'cyan',
  },
  Ethiopia: {
    flag: '🇪🇹',
    regionHub: 'Horn of Africa Hub',
    currency: 'ETB / USD',
    description: 'Rapidly digitizing manufacturing, logistics, and industrial park accounting.',
    color: 'green',
  },
  Zambia: {
    flag: '🇿🇲',
    regionHub: 'Southern Africa Gateway',
    currency: 'ZMW / USD',
    description: 'Central transport and mining corridor with automated fiscal invoice compliance.',
    color: 'emerald',
  },
  Botswana: {
    flag: '🇧🇼',
    regionHub: 'SADC Financial Node',
    currency: 'BWP / USD',
    description: 'Stable financial jurisdiction and corporate compliance clearing center.',
    color: 'sky',
  },
  Mauritius: {
    flag: '🇲🇺',
    regionHub: 'Indian Ocean Gateway',
    currency: 'MUR / USD',
    description: 'International financial hub facilitating cross-border Pan-African corporate treasury.',
    color: 'violet',
  },
  Cameroon: {
    flag: '🇨🇲',
    regionHub: 'Central Africa Hub',
    currency: 'XAF / EUR',
    description: 'Economic driver of the CEMAC zone powering agro-commerce and retail POS networks.',
    color: 'lime',
  },
  Zimbabwe: {
    flag: '🇿🇼',
    regionHub: 'Southern Africa Hub',
    currency: 'ZiG / USD',
    description: 'High-density tech talent pool innovating in multi-currency ledger engines.',
    color: 'amber',
  },
  'Remote (Pan-Africa)': {
    flag: '🌍',
    regionHub: 'Pan-Africa Cloud',
    currency: 'USD Pegged',
    description: '100% remote flexibility across African timezones (GMT to GMT+3). Work from anywhere.',
    color: 'purple',
  },
  'Remote (Worldwide)': {
    flag: '🌐',
    regionHub: 'Global Distributed',
    currency: 'USD Pegged',
    description: 'Worldwide remote engineering and AI roles with flexible asynchronous schedules.',
    color: 'indigo',
  },
};

export const LocationsDirectory: React.FC<LocationsDirectoryProps> = ({
  jobs,
  selectedCountry,
  selectedCity,
  onSelectLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArrangement, setSelectedArrangement] = useState<'All' | WorkArrangement>('All');
  const [activeCountryTab, setActiveCountryTab] = useState<string>('All');

  // Filter jobs by work arrangement if selected
  const eligibleJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (j.status !== 'published') return false;
      if (selectedArrangement !== 'All' && j.workArrangement !== selectedArrangement) {
        return false;
      }
      return true;
    });
  }, [jobs, selectedArrangement]);

  // Aggregate locations hierarchically: Country -> State/Region -> City
  const countryData = useMemo(() => {
    interface CityGroup {
      name: string;
      region?: string;
      count: number;
      companies: string[];
      sampleTitles: string[];
      arrangements: Set<string>;
    }

    interface StateGroup {
      name: string;
      count: number;
      cities: Map<string, CityGroup>;
    }

    interface CountryGroup {
      name: string;
      count: number;
      flag: string;
      regionHub: string;
      currency: string;
      description: string;
      color: string;
      states: Map<string, StateGroup>;
      cities: Map<string, CityGroup>;
      companies: Set<string>;
    }

    const map = new Map<string, CountryGroup>();

    eligibleJobs.forEach((job) => {
      const country = job.location.country || 'Remote (Pan-Africa)';
      const state = job.location.region || (country.includes('Remote') ? 'Cloud Remote' : 'General Region');
      const city = job.location.city || (job.workArrangement === 'Remote' ? 'Remote' : 'All Cities');

      if (!map.has(country)) {
        const meta = COUNTRY_META_LOOKUP[country] || {
          flag: '📍',
          regionHub: 'Regional Tech Hub',
          currency: 'USD',
          description: `Active career opportunities and innovation roles in ${country}.`,
          color: 'blue',
        };
        map.set(country, {
          name: country,
          count: 0,
          flag: meta.flag,
          regionHub: meta.regionHub,
          currency: meta.currency,
          description: meta.description,
          color: meta.color,
          states: new Map(),
          cities: new Map(),
          companies: new Set(),
        });
      }

      const cGroup = map.get(country)!;
      cGroup.count += 1;
      if (job.company?.name) cGroup.companies.add(job.company.name);

      // State group
      if (!cGroup.states.has(state)) {
        cGroup.states.set(state, {
          name: state,
          count: 0,
          cities: new Map(),
        });
      }
      const sGroup = cGroup.states.get(state)!;
      sGroup.count += 1;

      // City group
      if (!cGroup.cities.has(city)) {
        cGroup.cities.set(city, {
          name: city,
          region: state,
          count: 0,
          companies: [],
          sampleTitles: [],
          arrangements: new Set(),
        });
      }
      const cityGroup = cGroup.cities.get(city)!;
      cityGroup.count += 1;
      if (job.company?.name && !cityGroup.companies.includes(job.company.name)) {
        cityGroup.companies.push(job.company.name);
      }
      if (!cityGroup.sampleTitles.includes(job.title) && cityGroup.sampleTitles.length < 3) {
        cityGroup.sampleTitles.push(job.title);
      }
      cityGroup.arrangements.add(job.workArrangement);
    });

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [eligibleJobs]);

  // Filtered by text search
  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return countryData
      .filter((country) => {
        if (activeCountryTab !== 'All' && country.name !== activeCountryTab) {
          return false;
        }

        if (!q) return true;

        const matchCountry = country.name.toLowerCase().includes(q) || country.regionHub.toLowerCase().includes(q);
        const matchState = Array.from(country.states.keys()).some((s) => s.toLowerCase().includes(q));
        const matchCity = Array.from(country.cities.keys()).some((c) => c.toLowerCase().includes(q));
        const matchCompany = Array.from(country.companies).some((co) => co.toLowerCase().includes(q));

        return matchCountry || matchState || matchCity || matchCompany;
      })
      .map((country) => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return country;

        // Filter cities within the country matching query if search is active
        const matchingCities = new Map();
        country.cities.forEach((cg, cityName) => {
          const matchCity = cityName.toLowerCase().includes(q);
          const matchRegion = cg.region ? cg.region.toLowerCase().includes(q) : false;
          const matchCountry = country.name.toLowerCase().includes(q);
          const matchCompany = cg.companies.some((c) => c.toLowerCase().includes(q));
          const matchTitle = cg.sampleTitles.some((t) => t.toLowerCase().includes(q));

          if (matchCity || matchRegion || matchCountry || matchCompany || matchTitle) {
            matchingCities.set(cityName, cg);
          }
        });

        return {
          ...country,
          cities: matchingCities.size > 0 ? matchingCities : country.cities,
        };
      });
  }, [countryData, searchQuery, activeCountryTab]);

  // Overall statistics
  const totalCitiesCount = useMemo(() => {
    let count = 0;
    countryData.forEach((c) => {
      count += c.cities.size;
    });
    return count;
  }, [countryData]);

  const totalRemoteJobs = useMemo(() => {
    return jobs.filter((j) => j.status === 'published' && (j.workArrangement === 'Remote' || j.location.isRemote)).length;
  }, [jobs]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#14243A] via-[#1b3459] to-[#0066CC] dark:from-[#091122] dark:via-[#131E3D] dark:to-[#0A4585] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-[#B5E61D] mb-3 border border-white/15">
            <Globe className="w-3.5 h-3.5" />
            <span>20+ Countries Pan-African Operations Hubs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Browse Jobs by Country, State & City
          </h2>
          <p className="text-sm text-slate-200 mt-2 leading-relaxed">
            Discover roles across 20+ Countries Pan-African Operations Hubs in Nigeria, Kenya, Rwanda, Ghana, South Africa, Egypt, Morocco, Senegal, Côte d'Ivoire, Uganda, Tanzania, and distributed cloud hubs. Filter directly by city or metropolitan district.
          </p>

          {/* Key Metrics Counter */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-xs text-slate-300 block font-medium">Pan-African Hubs</span>
              <span className="text-2xl font-black text-white">20+</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-xs text-slate-300 block font-medium">Cities & Districts</span>
              <span className="text-2xl font-black text-[#B5E61D]">{totalCitiesCount}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-xs text-slate-300 block font-medium">Open Positions</span>
              <span className="text-2xl font-black text-[#38BDF8]">{eligibleJobs.length}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10">
              <span className="text-xs text-slate-300 block font-medium">Remote Roles</span>
              <span className="text-2xl font-black text-white">{totalRemoteJobs}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Arrangement Filter Bar */}
      <div className="bg-white dark:bg-[#131D35] p-4 rounded-2xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by country, state, city (e.g. Lagos, Nairobi, Kigali, Accra, Gauteng)..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* Work Arrangement Selector */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'Remote', 'Hybrid', 'On-site'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedArrangement(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                selectedArrangement === mode
                  ? 'bg-[#0066CC] dark:bg-[#38BDF8] text-white dark:text-[#0A1628] shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1A284A] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {mode === 'All' ? 'All Arrangements' : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Jump Tech Hubs Strip */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
            <span>Fast-Track Popular Tech Hubs:</span>
          </span>
          {activeCountryTab !== 'All' && (
            <button
              onClick={() => setActiveCountryTab('All')}
              className="text-xs text-[#0066CC] dark:text-[#38BDF8] hover:underline font-semibold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Show All Hubs</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setActiveCountryTab('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              activeCountryTab === 'All'
                ? 'bg-[#14243A] text-white dark:bg-white dark:text-[#14243A]'
                : 'bg-white dark:bg-[#131D35] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            All Countries ({countryData.length})
          </button>
          {countryData.map((c) => (
            <button
              key={c.name}
              onClick={() => setActiveCountryTab(activeCountryTab === c.name ? 'All' : c.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                activeCountryTab === c.name
                  ? 'bg-[#0066CC] text-white shadow-sm ring-2 ring-[#0066CC]/30'
                  : 'bg-white dark:bg-[#131D35] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#0066CC]'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.name.split(' ')[0]}</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#1A284A] text-[10px] font-mono">
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Countries & Cities Grid */}
      {filteredCountries.length === 0 ? (
        <div className="bg-white dark:bg-[#131D35] p-12 rounded-2xl border border-slate-200 dark:border-slate-700 text-center max-w-md mx-auto">
          <MapPin className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">No locations matching your filter</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or selecting "All Arrangements".
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedArrangement('All');
              setActiveCountryTab('All');
            }}
            className="mt-4 px-4 py-2 bg-[#0066CC] text-white rounded-xl text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCountries.map((country) => {
            const citiesList = Array.from(country.cities.values());
            const statesList = Array.from(country.states.values());
            const isSelected = selectedCountry === country.name;

            return (
              <div
                key={country.name}
                className={`bg-white dark:bg-[#131D35] rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col shadow-xs hover:shadow-md ${
                  isSelected
                    ? 'border-[#0066CC] dark:border-[#38BDF8] ring-2 ring-[#0066CC]/20'
                    : 'border-slate-200/90 dark:border-slate-700/80 hover:border-slate-300'
                }`}
              >
                {/* Country Card Header */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#10192E]">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl sm:text-4xl select-none" role="img" aria-label={country.name}>
                        {country.flag}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-[#14243A] dark:text-white">
                            {country.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-900/60">
                            {country.regionHub}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {country.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onSelectLocation({ country: country.name })}
                      className="px-3 py-1.5 bg-[#0066CC] hover:bg-[#0052A3] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-xs cursor-pointer"
                      title={`View all ${country.count} jobs in ${country.name}`}
                    >
                      <span>Explore Country</span>
                      <span className="px-1.5 py-0.2 rounded bg-white/20 text-[10px] font-mono">
                        {country.count}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Quick summary badges */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{country.companies.size} Employers</span>
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{citiesList.length} Cities / Hubs</span>
                    </span>
                    {statesList.length > 0 && statesList[0].name !== 'General Region' && (
                      <>
                        <span>•</span>
                        <span>
                          {statesList.map((s) => s.name).slice(0, 2).join(', ')}
                        </span>
                      </>
                    )}
                    <span>•</span>
                    <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                      Currency: {country.currency}
                    </span>
                  </div>
                </div>

                {/* Cities & States List within Country */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5 flex items-center justify-between">
                      <span>Cities & Districts ({citiesList.length})</span>
                      <span className="text-[10px] font-normal text-slate-400">Click city to view specific jobs</span>
                    </h4>

                    <div className="space-y-2">
                      {citiesList.map((c) => {
                        const isCityActive = selectedCity === c.name;
                        return (
                          <div
                            key={c.name}
                            onClick={() => onSelectLocation({ country: country.name, state: c.region, city: c.name })}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                              isCityActive
                                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-[#0066CC] dark:border-[#38BDF8]'
                                : 'bg-slate-50/70 dark:bg-[#1A284A]/60 border-slate-200/70 dark:border-slate-700/60 hover:border-[#0066CC] dark:hover:border-[#38BDF8] hover:bg-blue-50/30'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8] shrink-0" />
                                <span className="text-xs font-bold text-[#14243A] dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] transition-colors truncate">
                                  {c.name}
                                </span>
                                {c.region && c.region !== c.name && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-medium">
                                    {c.region}
                                  </span>
                                )}
                              </div>

                              {/* Sample hiring companies or roles */}
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                  {c.companies.slice(0, 2).join(', ')}
                                </span>
                                {c.sampleTitles.length > 0 && (
                                  <span className="text-slate-400 dark:text-slate-500">
                                    {' '}— {c.sampleTitles[0]}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#131D35] text-[#0066CC] dark:text-[#38BDF8] text-xs font-bold font-mono border border-slate-200 dark:border-slate-700 shadow-2xs">
                                {c.count} {c.count === 1 ? 'role' : 'roles'}
                              </span>
                              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0066CC] group-hover:translate-x-0.5 transition-all" />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 1-Click Bottom Bar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Arrangements:{' '}
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {Array.from(new Set(eligibleJobs.filter((j) => j.location.country === country.name).map((j) => j.workArrangement))).join(', ') || 'Remote & Hybrid'}
                      </span>
                    </span>

                    <button
                      onClick={() => onSelectLocation({ country: country.name })}
                      className="text-[#0066CC] dark:text-[#38BDF8] hover:underline font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>View all {country.name} jobs</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
