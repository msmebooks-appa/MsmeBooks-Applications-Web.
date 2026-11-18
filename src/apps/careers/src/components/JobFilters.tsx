import React, { useState, useRef, useMemo } from 'react';
import { FilterState, EmploymentType, WorkArrangement, ExperienceLevel, FilterPreset } from '../types/career';
import {
  Filter,
  RotateCcw,
  Building2,
  Search,
  ChevronUp,
  ChevronDown,
  Layers,
  ArrowDownAZ,
  MapPin,
  Globe,
  DollarSign,
  Sparkles,
  BookmarkPlus,
  Check,
  X,
  Sliders,
  SlidersHorizontal,
  BookmarkCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface JobFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  companies: string[];
  industries?: string[];
  countries?: string[];
  states?: string[];
  cities?: string[];
  companyCounts: Record<string, number>;
  industryCounts?: Record<string, number>;
  departmentCounts: Record<string, number>;
  locationCounts: Record<string, number>;
  countryCounts?: Record<string, number>;
  stateCounts?: Record<string, number>;
  cityCounts?: Record<string, number>;
  arrangementCounts: Record<string, number>;
  employmentTypeCounts: Record<string, number>;
  experienceCounts: Record<string, number>;
  totalMatches: number;
  onSavePreset?: (preset: FilterPreset) => void;
}

const DEPARTMENTS = [
  'Software Engineering',
  'Product & Design',
  'Sales & Business Development',
  'Marketing & Communications',
  'Finance & Accounting',
  'Human Resources',
  'Customer Success',
  'Technical Support',
  'Operations',
  'Data & Artificial Intelligence',
  'Internships & Graduate Programs',
];

const LOCATIONS = ['Nigeria', 'Kenya', 'Rwanda', 'Ghana', 'South Africa', 'Remote (Pan-Africa)', 'Remote (Worldwide)'];

const ARRANGEMENTS: WorkArrangement[] = ['Remote', 'Hybrid', 'On-site'];

const EMPLOYMENT_TYPES: EmploymentType[] = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Temporary'];

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  'Internship',
  'Entry Level',
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead/Manager',
  'Executive',
];

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  companies,
  industries = [],
  countries = [],
  states = [],
  cities = [],
  companyCounts,
  industryCounts = {},
  departmentCounts,
  locationCounts,
  countryCounts = {},
  stateCounts = {},
  cityCounts = {},
  arrangementCounts,
  employmentTypeCounts,
  experienceCounts,
  totalMatches,
  onSavePreset,
}) => {
  const { tr } = useLanguage();
  const [companySearch, setCompanySearch] = useState('');
  const [companySortAlpha, setCompanySortAlpha] = useState(true);
  const [industrySearch, setIndustrySearch] = useState('');
  const [locationSubTab, setLocationSubTab] = useState<'country' | 'city'>('country');
  const [locationSearch, setLocationSearch] = useState('');

  // Auto-Suggest & Preset States
  const [showAutoSuggestModal, setShowAutoSuggestModal] = useState(false);
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [presetSavedToast, setPresetSavedToast] = useState<string | null>(null);

  // Currency configuration for range slider
  const CURRENCY_CONFIG: Record<
    FilterState['currency'],
    { symbol: string; maxLimit: number; step: number; label: string }
  > = {
    ALL: { symbol: '$', maxLimit: 250000, step: 5000, label: 'All Currencies ($ USD Base)' },
    USD: { symbol: '$', maxLimit: 250000, step: 5000, label: 'USD ($) · US Dollar' },
    NGN: { symbol: '₦', maxLimit: 150000000, step: 1000000, label: 'NGN (₦) · Nigeria' },
    GHS: { symbol: 'GH₵', maxLimit: 3000000, step: 25000, label: 'GHS (GH₵) · Ghana' },
    KES: { symbol: 'KSh', maxLimit: 35000000, step: 250000, label: 'KES (KSh) · Kenya' },
    RWF: { symbol: 'RF', maxLimit: 250000000, step: 2000000, label: 'RWF (RF) · Rwanda' },
    ZAR: { symbol: 'R', maxLimit: 4000000, step: 50000, label: 'ZAR (R) · South Africa' },
  };

  const activeCurrencyConfig = CURRENCY_CONFIG[filters.currency] || CURRENCY_CONFIG.ALL;

  const handleCurrencyChange = (newCurr: FilterState['currency']) => {
    const nextConfig = CURRENCY_CONFIG[newCurr] || CURRENCY_CONFIG.ALL;
    onFilterChange({
      ...filters,
      currency: newCurr,
      minSalary: 0,
      maxSalary: nextConfig.maxLimit,
    });
  };

  const handleMinSalaryChange = (newMin: number) => {
    const clampedMin = Math.max(0, Math.min(newMin, (filters.maxSalary || activeCurrencyConfig.maxLimit) - activeCurrencyConfig.step));
    onFilterChange({
      ...filters,
      minSalary: clampedMin,
    });
  };

  const handleMaxSalaryChange = (newMax: number) => {
    const clampedMax = Math.min(
      activeCurrencyConfig.maxLimit,
      Math.max(newMax, (filters.minSalary || 0) + activeCurrencyConfig.step)
    );
    onFilterChange({
      ...filters,
      maxSalary: clampedMax,
    });
  };

  const handleSaveCurrentPreset = () => {
    const defaultName =
      (filters.departments[0] ? `${filters.departments[0]}` : '') +
      (filters.locations[0] ? ` in ${filters.locations[0]}` : '') +
      (filters.workArrangements[0] ? ` (${filters.workArrangements[0]})` : '') ||
      'Custom Career Filter';

    const finalName = presetNameInput.trim() || defaultName;

    const newPreset: FilterPreset = {
      id: `preset_${Date.now()}`,
      name: finalName,
      createdAt: new Date().toISOString(),
      filters: { ...filters },
    };

    try {
      const stored = localStorage.getItem('msmebooks_saved_filter_presets');
      const list: FilterPreset[] = stored ? JSON.parse(stored) : [];
      const updated = [newPreset, ...list.filter((p) => p.name !== finalName)];
      localStorage.setItem('msmebooks_saved_filter_presets', JSON.stringify(updated));
      window.dispatchEvent(new Event('msmebooks_presets_updated'));
    } catch {}

    if (onSavePreset) {
      onSavePreset(newPreset);
    }

    setPresetSavedToast(`Preset "${finalName}" saved!`);
    setShowSavePresetModal(false);
    setPresetNameInput('');
    setTimeout(() => setPresetSavedToast(null), 3000);
  };

  const AUTO_SUGGEST_BUNDLES = [
    {
      id: 'fintech-eng',
      title: 'FinTech & Ledger Engineering',
      badge: 'High Impact',
      description: 'Senior software engineering vacancies building transactional fintech ledger cores',
      apply: () => {
        onFilterChange({
          ...filters,
          departments: ['Software Engineering'],
          industries: ['Financial Technology (FinTech)'],
          workArrangements: ['Remote', 'Hybrid'],
          experienceLevels: ['Senior', 'Lead/Manager'],
        });
        setShowAutoSuggestModal(false);
      },
    },
    {
      id: 'pan-african-remote',
      title: 'Pan-African Remote (USD / Global)',
      badge: 'Location-Independent',
      description: 'Distributed positions across Africa offering remote flexibility with competitive pay',
      apply: () => {
        onFilterChange({
          ...filters,
          workArrangements: ['Remote'],
          locations: ['Remote (Pan-Africa)', 'Remote (Worldwide)'],
          countries: ['Remote (Pan-Africa)', 'Remote (Worldwide)'],
          employmentTypes: ['Full-time'],
        });
        setShowAutoSuggestModal(false);
      },
    },
    {
      id: 'mid-level-growth',
      title: 'Mid-Level Product & Design',
      badge: 'Career Growth',
      description: 'Accelerated product design, UX, and product management openings across fast-growing teams',
      apply: () => {
        onFilterChange({
          ...filters,
          departments: ['Product & Design'],
          experienceLevels: ['Mid-Level', 'Junior'],
        });
        setShowAutoSuggestModal(false);
      },
    },
  ];

  const getArrangementLabel = (arr: WorkArrangement) => {
    if (arr === 'Remote') return tr.jobs.remote;
    if (arr === 'Hybrid') return tr.jobs.hybrid;
    if (arr === 'On-site') return tr.jobs.onSite;
    return arr;
  };

  const getEmploymentTypeLabel = (emp: EmploymentType) => {
    if (emp === 'Full-time') return tr.jobs.fullTime;
    if (emp === 'Part-time') return tr.jobs.partTime;
    if (emp === 'Contract') return tr.jobs.contract;
    if (emp === 'Internship') return tr.jobs.internship;
    return emp;
  };

  // Toggle company checkbox
  const handleToggleCompany = (company: string) => {
    const exists = filters.companies.includes(company);
    const updated = exists
      ? filters.companies.filter((c) => c !== company)
      : [...filters.companies, company];
    onFilterChange({ ...filters, companies: updated });
  };

  // Toggle industry checkbox
  const handleToggleIndustry = (industry: string) => {
    const currentIndustries = filters.industries || [];
    const exists = currentIndustries.includes(industry);
    const updated = exists
      ? currentIndustries.filter((i) => i !== industry)
      : [...currentIndustries, industry];
    onFilterChange({ ...filters, industries: updated });
  };

  // Toggle department checkbox
  const handleToggleDepartment = (dept: string) => {
    const exists = filters.departments.includes(dept);
    const updated = exists
      ? filters.departments.filter((d) => d !== dept)
      : [...filters.departments, dept];
    onFilterChange({ ...filters, departments: updated });
  };

  // Toggle location
  const handleToggleLocation = (loc: string) => {
    const exists = filters.locations.includes(loc);
    const updated = exists
      ? filters.locations.filter((l) => l !== loc)
      : [...filters.locations, loc];
    onFilterChange({ ...filters, locations: updated });
  };

  // Toggle country
  const handleToggleCountry = (country: string) => {
    const currentCountries = filters.countries || [];
    const exists = currentCountries.includes(country);
    const updated = exists
      ? currentCountries.filter((c) => c !== country)
      : [...currentCountries, country];
    // Keep locations array synchronized
    onFilterChange({
      ...filters,
      countries: updated,
      locations: updated,
    });
  };

  // Toggle state / region
  const handleToggleState = (state: string) => {
    const currentStates = filters.states || [];
    const exists = currentStates.includes(state);
    const updated = exists
      ? currentStates.filter((s) => s !== state)
      : [...currentStates, state];
    onFilterChange({ ...filters, states: updated });
  };

  // Toggle city
  const handleToggleCity = (city: string) => {
    const currentCities = filters.cities || [];
    const exists = currentCities.includes(city);
    const updated = exists
      ? currentCities.filter((c) => c !== city)
      : [...currentCities, city];
    onFilterChange({ ...filters, cities: updated });
  };

  const handleClearLocationFilters = () => {
    onFilterChange({
      ...filters,
      locations: [],
      countries: [],
      states: [],
      cities: [],
    });
  };

  // Toggle arrangement
  const handleToggleArrangement = (arr: WorkArrangement) => {
    const exists = filters.workArrangements.includes(arr);
    const updated = exists
      ? filters.workArrangements.filter((a) => a !== arr)
      : [...filters.workArrangements, arr];
    onFilterChange({ ...filters, workArrangements: updated });
  };

  // Toggle employment type
  const handleToggleEmpType = (emp: EmploymentType) => {
    const exists = filters.employmentTypes.includes(emp);
    const updated = exists
      ? filters.employmentTypes.filter((e) => e !== emp)
      : [...filters.employmentTypes, emp];
    onFilterChange({ ...filters, employmentTypes: updated });
  };

  // Toggle experience level
  const handleToggleExp = (exp: ExperienceLevel) => {
    const exists = filters.experienceLevels.includes(exp);
    const updated = exists
      ? filters.experienceLevels.filter((e) => e !== exp)
      : [...filters.experienceLevels, exp];
    onFilterChange({ ...filters, experienceLevels: updated });
  };

  const hasActiveFilters =
    filters.companies.length > 0 ||
    (filters.industries && filters.industries.length > 0) ||
    filters.departments.length > 0 ||
    filters.locations.length > 0 ||
    (filters.countries && filters.countries.length > 0) ||
    (filters.states && filters.states.length > 0) ||
    (filters.cities && filters.cities.length > 0) ||
    filters.workArrangements.length > 0 ||
    filters.employmentTypes.length > 0 ||
    filters.experienceLevels.length > 0 ||
    filters.datePosted !== 'all' ||
    filters.currency !== 'ALL' ||
    filters.minSalary > 0 ||
    (filters.maxSalary !== undefined && filters.maxSalary < activeCurrencyConfig.maxLimit) ||
    filters.onlySaved ||
    filters.searchQuery.trim().length > 0;

  const sortedAndFilteredCompanies = useMemo(() => {
    let list = companies.filter((c) =>
      c.toLowerCase().includes(companySearch.toLowerCase().trim())
    );
    if (companySortAlpha) {
      return list.sort((a, b) => a.localeCompare(b));
    }
    return list.sort((a, b) => (companyCounts[b] || 0) - (companyCounts[a] || 0));
  }, [companies, companySearch, companySortAlpha, companyCounts]);

  const filteredIndustriesList = useMemo(() => {
    return industries.filter((ind) =>
      ind.toLowerCase().includes(industrySearch.toLowerCase().trim())
    );
  }, [industries, industrySearch]);

  const countriesSource = countries.length > 0 ? countries : LOCATIONS;

  const filteredCountriesList = useMemo(() => {
    const q = locationSearch.toLowerCase().trim();
    if (!q) return countriesSource;
    return countriesSource.filter((c) => c.toLowerCase().includes(q));
  }, [countriesSource, locationSearch]);

  const filteredCitiesList = useMemo(() => {
    const q = locationSearch.toLowerCase().trim();
    if (!q) return cities;
    return cities.filter((c) => c.toLowerCase().includes(q));
  }, [cities, locationSearch]);

  const filteredStatesList = useMemo(() => {
    const q = locationSearch.toLowerCase().trim();
    if (!q) return states;
    return states.filter((s) => s.toLowerCase().includes(q));
  }, [states, locationSearch]);

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollSidebarDown = () => {
    if (containerRef.current?.parentElement) {
      containerRef.current.parentElement.scrollBy({ top: 380, behavior: 'smooth' });
    }
  };

  const scrollSidebarUp = () => {
    if (containerRef.current?.parentElement) {
      containerRef.current.parentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="bg-white dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-700/80 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm transition-colors duration-200"
    >
      {/* Filter Header with Scroll Up/Down Controls */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-sm text-[#14243A] dark:text-white">
            <Filter className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
            <span>{tr.filters.title}</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400 font-mono tabular-nums">
              ({totalMatches} {tr.filters.available})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Dedicated Left-side Scroll Up/Down Controls for Filter List */}
            <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-[#1A284A] rounded-lg p-0.5">
              <button
                type="button"
                onClick={scrollSidebarUp}
                className="p-1 hover:bg-white dark:hover:bg-[#20335C] text-slate-600 hover:text-[#0066CC] dark:text-slate-300 dark:hover:text-[#38BDF8] rounded transition-colors cursor-pointer"
                title="Scroll up left side filters"
                aria-label="Scroll up filters"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={scrollSidebarDown}
                className="p-1 hover:bg-white dark:hover:bg-[#20335C] text-slate-600 hover:text-[#0066CC] dark:text-slate-300 dark:hover:text-[#38BDF8] rounded transition-colors cursor-pointer"
                title="Scroll down left side filters"
                aria-label="Scroll down filters"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="text-xs font-medium text-[#0066CC] dark:text-[#38BDF8] hover:text-[#0052A3] dark:hover:text-blue-300 flex items-center gap-1 transition-colors ml-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{tr.filters.reset}</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Toolbar: Auto-Suggest Filters & Save Preset */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setShowAutoSuggestModal(true)}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-[#0066CC] dark:bg-blue-950/70 dark:hover:bg-blue-900/60 dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800/80 transition-colors shadow-2xs cursor-pointer"
            title="Auto-suggest 3 smart filter combinations based on market demand"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-[#38BDF8]" />
            <span>Auto-Suggest</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSavePresetModal(true)}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200/80 text-slate-700 dark:bg-[#1A284A] dark:hover:bg-[#223560] dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 transition-colors shadow-2xs cursor-pointer"
            title="Save your current filter selection as a named preset"
          >
            <BookmarkPlus className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
            <span>Save Preset</span>
          </button>
        </div>

        {/* Preset Saved Feedback Banner */}
        {presetSavedToast && (
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{presetSavedToast}</span>
          </div>
        )}
      </div>

      {/* AUTO-SUGGEST FILTERS MODAL / DRAWER */}
      {showAutoSuggestModal && (
        <div className="p-4 bg-gradient-to-br from-blue-50/70 to-indigo-50/50 dark:from-[#0D1527] dark:to-[#16233F] border-b border-blue-100 dark:border-slate-800 space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#14243A] dark:text-white uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
              <span>Auto-Suggested Filter Bundles</span>
            </div>
            <button
              type="button"
              onClick={() => setShowAutoSuggestModal(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300">
            Selected combinations tailored to current market vacancies and salary opportunities:
          </p>
          <div className="space-y-2">
            {AUTO_SUGGEST_BUNDLES.map((bundle) => (
              <div
                key={bundle.id}
                onClick={bundle.apply}
                className="p-2.5 rounded-xl bg-white dark:bg-[#131D35] border border-blue-200/80 dark:border-blue-900/60 hover:border-[#0066CC] dark:hover:border-[#38BDF8] shadow-xs cursor-pointer group transition-all"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8]">
                    {bundle.title}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800">
                    {bundle.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                  {bundle.description}
                </p>
                <span className="text-[10px] font-bold text-[#0066CC] dark:text-[#38BDF8] group-hover:underline inline-flex items-center gap-1 mt-1.5">
                  <span>Apply Preset</span>
                  <span>→</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SAVE PRESET MODAL / DRAWER */}
      {showSavePresetModal && (
        <div className="p-4 bg-slate-50 dark:bg-[#0D1527] border-b border-slate-200 dark:border-slate-800 space-y-2.5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#14243A] dark:text-white uppercase tracking-wider">
              <BookmarkPlus className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
              <span>Save Current Filter Preset</span>
            </div>
            <button
              type="button"
              onClick={() => setShowSavePresetModal(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Name your filter configuration to quickly access it from the Job Board header or your User Profile:
          </p>
          <div className="space-y-2">
            <input
              type="text"
              value={presetNameInput}
              onChange={(e) => setPresetNameInput(e.target.value)}
              placeholder="e.g. Remote Lagos Engineering"
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-[#16233F] text-slate-900 dark:text-white rounded-lg border border-slate-300 dark:border-slate-700 focus:border-[#0066CC] outline-none"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveCurrentPreset();
              }}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowSavePresetModal(false)}
                className="px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCurrentPreset}
                className="px-3 py-1 text-xs font-bold bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-md transition-colors shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Save to Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SALARY RANGE & CURRENCY TOGGLE FILTER SECTION */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-[#14243A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
            <span>Salary Range & Currency</span>
          </h4>
          {(filters.minSalary > 0 || filters.maxSalary < activeCurrencyConfig.maxLimit) && (
            <button
              onClick={() =>
                onFilterChange({
                  ...filters,
                  minSalary: 0,
                  maxSalary: activeCurrencyConfig.maxLimit,
                })
              }
              className="text-[11px] text-[#0066CC] dark:text-[#38BDF8] hover:underline font-semibold cursor-pointer"
            >
              Reset Salary
            </button>
          )}
        </div>

        {/* Currency View Dropdown */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
            Display Currency View
          </label>
          <select
            value={filters.currency}
            onChange={(e) => handleCurrencyChange(e.target.value as FilterState['currency'])}
            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-800 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC] dark:focus:border-[#38BDF8] font-medium cursor-pointer"
          >
            <option value="ALL">All Currencies ($ USD Baseline)</option>
            <option value="NGN">NGN (₦) · Nigerian Naira</option>
            <option value="USD">USD ($) · US Dollar</option>
            <option value="GHS">GHS (GH₵) · Ghanaian Cedi</option>
            <option value="KES">KES (KSh) · Kenyan Shilling</option>
            <option value="RWF">RWF (RF) · Rwandan Franc</option>
            <option value="ZAR">ZAR (R) · South African Rand</option>
          </select>
        </div>

        {/* Live Salary Range Indicator */}
        <div className="p-2.5 bg-slate-50 dark:bg-[#0D1527] rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="text-slate-500 dark:text-slate-400 text-[11px]">
            <span>Filter Threshold:</span>
          </div>
          <div className="font-bold text-[#0066CC] dark:text-[#38BDF8]">
            {activeCurrencyConfig.symbol}{(filters.minSalary || 0).toLocaleString()} - {activeCurrencyConfig.symbol}{(filters.maxSalary || activeCurrencyConfig.maxLimit).toLocaleString()}
          </div>
        </div>

        {/* Dual Range Sliders */}
        <div className="space-y-3">
          {/* Min Salary Slider */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
              <span>Min Salary</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {activeCurrencyConfig.symbol}{(filters.minSalary || 0).toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={activeCurrencyConfig.maxLimit}
              step={activeCurrencyConfig.step}
              value={filters.minSalary || 0}
              onChange={(e) => handleMinSalaryChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0066CC] dark:accent-[#38BDF8]"
            />
          </div>

          {/* Max Salary Slider */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1">
              <span>Max Salary</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {activeCurrencyConfig.symbol}{(filters.maxSalary ?? activeCurrencyConfig.maxLimit).toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={activeCurrencyConfig.maxLimit}
              step={activeCurrencyConfig.step}
              value={filters.maxSalary ?? activeCurrencyConfig.maxLimit}
              onChange={(e) => handleMaxSalaryChange(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0066CC] dark:accent-[#38BDF8]"
            />
          </div>
        </div>
      </div>

      {/* 1. Filter by Company / Employer */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-[#14243A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
            <span>{tr.filters.companyEmployer}</span>
          </h4>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCompanySortAlpha(!companySortAlpha)}
              className={`p-1 rounded text-[10px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                companySortAlpha
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border-blue-200 dark:border-blue-800'
                  : 'bg-slate-50 dark:bg-[#1A284A] text-slate-500 border-slate-200 dark:border-slate-700'
              }`}
              title={companySortAlpha ? 'Arranged A to Z. Click to sort by most jobs.' : 'Arranged by job count. Click to sort A to Z.'}
            >
              <ArrowDownAZ className="w-3 h-3" />
              <span>{companySortAlpha ? 'A→Z' : 'Roles'}</span>
            </button>
            {filters.companies.length > 0 && (
              <button
                onClick={() => onFilterChange({ ...filters, companies: [] })}
                className="text-[11px] text-[#0066CC] dark:text-[#38BDF8] hover:underline font-semibold"
              >
                Clear ({filters.companies.length})
              </button>
            )}
          </div>
        </div>

        {/* Company Quick Search */}
        {companies.length > 4 && (
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              value={companySearch}
              onChange={(e) => setCompanySearch(e.target.value)}
              placeholder={tr.filters.searchCompanies}
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 dark:bg-[#1A284A] hover:bg-slate-100/70 dark:hover:bg-[#20325A] focus:bg-white dark:focus:bg-[#1A284A] text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            {companySearch && (
              <button
                onClick={() => setCompanySearch('')}
                className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                ×
              </button>
            )}
          </div>
        )}

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {sortedAndFilteredCompanies.length === 0 ? (
            <p className="text-[11px] text-slate-400 dark:text-slate-500 py-1 italic">No companies matching "{companySearch}"</p>
          ) : (
            sortedAndFilteredCompanies.map((company) => {
              const checked = filters.companies.includes(company);
              const count = companyCounts[company] || 0;
              return (
                <label
                  key={company}
                  className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-1 group"
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleCompany(company)}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A284A] text-[#0066CC] focus:ring-[#0066CC]/20 shrink-0"
                    />
                    <span className={`truncate ${checked ? 'font-semibold text-[#0066CC] dark:text-[#38BDF8]' : ''}`}>
                      {company}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0">
                    {count}
                  </span>
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Filter by Industry / Sector */}
      {industries && industries.length > 0 && (
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#14243A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
              <span>Industry & Sector</span>
            </h4>
            {(filters.industries && filters.industries.length > 0) && (
              <button
                onClick={() => onFilterChange({ ...filters, industries: [] })}
                className="text-[11px] text-[#0066CC] dark:text-[#38BDF8] hover:underline font-semibold"
              >
                Clear ({filters.industries.length})
              </button>
            )}
          </div>

          {industries.length > 3 && (
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2 pointer-events-none" />
              <input
                type="text"
                value={industrySearch}
                onChange={(e) => setIndustrySearch(e.target.value)}
                placeholder="Search industries..."
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none placeholder:text-slate-400"
              />
              {industrySearch && (
                <button
                  onClick={() => setIndustrySearch('')}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ×
                </button>
              )}
            </div>
          )}

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {filteredIndustriesList.length === 0 ? (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 py-1 italic">No industries matching "{industrySearch}"</p>
            ) : (
              filteredIndustriesList.map((ind) => {
                const checked = (filters.industries || []).includes(ind);
                const count = industryCounts[ind] || 0;
                return (
                  <label
                    key={ind}
                    className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-1 group"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleIndustry(ind)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A284A] text-[#0066CC] focus:ring-[#0066CC]/20 shrink-0"
                      />
                      <span className={`truncate ${checked ? 'font-semibold text-[#0066CC] dark:text-[#38BDF8]' : ''}`}>
                        {ind}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0">
                      {count}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Work Arrangement */}
      <div className="p-4">
        <h4 className="text-xs font-bold text-[#14243A] dark:text-white uppercase tracking-wider mb-2.5">
          {tr.filters.workArrangement}
        </h4>
        <div className="space-y-1.5">
          {ARRANGEMENTS.map((arr) => {
            const checked = filters.workArrangements.includes(arr);
            const count = arrangementCounts[arr] || 0;
            return (
              <label
                key={arr}
                className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-1 group"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleArrangement(arr)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A284A] text-[#0066CC] focus:ring-[#0066CC]/20"
                  />
                  <span className={checked ? 'font-semibold text-[#0066CC] dark:text-[#38BDF8]' : ''}>
                    {getArrangementLabel(arr)}
                  </span>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Departments */}
      <div className="p-4">
        <h4 className="text-xs font-bold text-[#14243A] dark:text-white uppercase tracking-wider mb-2.5">
          {tr.filters.department}
        </h4>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {DEPARTMENTS.map((dept) => {
            const checked = filters.departments.includes(dept);
            const count = departmentCounts[dept] || 0;
            return (
              <label
                key={dept}
                className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-1 group"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleDepartment(dept)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A284A] text-[#0066CC] focus:ring-[#0066CC]/20 shrink-0"
                  />
                  <span className={`truncate ${checked ? 'font-semibold text-[#0066CC] dark:text-[#38BDF8]' : ''}`}>
                    {dept}
                  </span>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Locations: Country, State & City */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-[#14243A] dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
            <span>Country, State & City</span>
          </h4>
          {((filters.countries && filters.countries.length > 0) ||
            (filters.states && filters.states.length > 0) ||
            (filters.cities && filters.cities.length > 0) ||
            filters.locations.length > 0) && (
            <button
              onClick={handleClearLocationFilters}
              className="text-[11px] text-[#0066CC] dark:text-[#38BDF8] hover:underline font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sub-tab: By Country vs By City / State */}
        <div className="flex items-center p-0.5 bg-slate-100 dark:bg-[#1A284A] rounded-lg mb-2">
          <button
            type="button"
            onClick={() => setLocationSubTab('country')}
            className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              locationSubTab === 'country'
                ? 'bg-white dark:bg-[#0066CC] text-[#0066CC] dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            By Country ({(filters.countries || []).length > 0 ? (filters.countries || []).length : filteredCountriesList.length})
          </button>
          <button
            type="button"
            onClick={() => setLocationSubTab('city')}
            className={`flex-1 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
              locationSubTab === 'city'
                ? 'bg-white dark:bg-[#0066CC] text-[#0066CC] dark:text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            By City / State ({(filters.cities || []).length > 0 ? (filters.cities || []).length : filteredCitiesList.length})
          </button>
        </div>

        {/* Search for location */}
        <div className="relative mb-2">
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2 pointer-events-none" />
          <input
            type="text"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder={locationSubTab === 'country' ? 'Search countries...' : 'Search cities or states...'}
            className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none placeholder:text-slate-400"
          />
          {locationSearch && (
            <button
              onClick={() => setLocationSearch('')}
              className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600 text-xs"
            >
              ×
            </button>
          )}
        </div>

        {/* Location List based on Sub-tab */}
        {locationSubTab === 'country' ? (
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {filteredCountriesList.length === 0 ? (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 py-1 italic">
                No countries matching "{locationSearch}"
              </p>
            ) : (
              filteredCountriesList.map((loc) => {
                const checked =
                  (filters.countries && filters.countries.includes(loc)) ||
                  filters.locations.includes(loc);
                const count = countryCounts[loc] || locationCounts[loc] || 0;
                return (
                  <label
                    key={loc}
                    className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-1 group"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleToggleCountry(loc)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A284A] text-[#0066CC] focus:ring-[#0066CC]/20 shrink-0"
                      />
                      <span className={`truncate ${checked ? 'font-semibold text-[#0066CC] dark:text-[#38BDF8]' : ''}`}>
                        {loc}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0">
                      {count}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        ) : (
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            {/* States / Regions if any */}
            {filteredStatesList.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                  States & Provinces
                </span>
                {filteredStatesList.map((st) => {
                  const checked = (filters.states || []).includes(st);
                  const count = stateCounts[st] || 0;
                  return (
                    <label
                      key={st}
                      className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-0.5 group"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleState(st)}
                          className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-600 text-[#0066CC] focus:ring-[#0066CC]/20 shrink-0"
                        />
                        <span className={`truncate ${checked ? 'font-semibold text-[#0066CC] dark:text-[#38BDF8]' : ''}`}>
                          {st}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono tabular-nums text-slate-400 shrink-0">
                        {count}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}

            {/* Cities */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Cities & Tech Hubs
              </span>
              {filteredCitiesList.length === 0 ? (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 py-1 italic">
                  No cities matching "{locationSearch}"
                </p>
              ) : (
                filteredCitiesList.map((ct) => {
                  const checked = (filters.cities || []).includes(ct);
                  const count = cityCounts[ct] || 0;
                  return (
                    <label
                      key={ct}
                      className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-1 group"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleToggleCity(ct)}
                          className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A284A] text-[#0066CC] focus:ring-[#0066CC]/20 shrink-0"
                        />
                        <span className={`truncate ${checked ? 'font-semibold text-[#0066CC] dark:text-[#38BDF8]' : ''}`}>
                          {ct}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0">
                        {count}
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Experience Level */}
      <div className="p-4">
        <h4 className="text-xs font-bold text-[#14243A] dark:text-white uppercase tracking-wider mb-2.5">
          {tr.filters.experienceLevel}
        </h4>
        <div className="space-y-1.5">
          {EXPERIENCE_LEVELS.map((exp) => {
            const checked = filters.experienceLevels.includes(exp);
            const count = experienceCounts[exp] || 0;
            return (
              <label
                key={exp}
                className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-1 group"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleExp(exp)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A284A] text-[#0066CC] focus:ring-[#0066CC]/20"
                  />
                  <span className={checked ? 'font-semibold text-[#0066CC] dark:text-[#38BDF8]' : ''}>{exp}</span>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Employment Type */}
      <div className="p-4">
        <h4 className="text-xs font-bold text-[#14243A] dark:text-white uppercase tracking-wider mb-2.5">
          {tr.filters.employmentType}
        </h4>
        <div className="space-y-1.5">
          {EMPLOYMENT_TYPES.map((emp) => {
            const checked = filters.employmentTypes.includes(emp);
            const count = employmentTypeCounts[emp] || 0;
            return (
              <label
                key={emp}
                className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer select-none py-1 group"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleToggleEmpType(emp)}
                    className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-[#1A284A] text-[#0066CC] focus:ring-[#0066CC]/20"
                  />
                  <span className={checked ? 'font-semibold text-[#0066CC] dark:text-[#38BDF8]' : ''}>
                    {getEmploymentTypeLabel(emp)}
                  </span>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                  {count}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Date Posted */}
      <div className="p-4">
        <h4 className="text-xs font-bold text-[#14243A] dark:text-white uppercase tracking-wider mb-2.5">
          {tr.filters.datePosted}
        </h4>
        <div className="space-y-1.5 text-xs">
          {[
            { value: 'all', label: tr.filters.anyTime },
            { value: '24h', label: tr.filters.last24h },
            { value: '7d', label: tr.filters.last7d },
            { value: '14d', label: tr.filters.last14d },
            { value: '30d', label: tr.filters.last30d },
          ].map((item) => (
            <label
              key={item.value}
              className="flex items-center gap-2 cursor-pointer select-none py-0.5 text-slate-700 dark:text-slate-300"
            >
              <input
                type="radio"
                name="datePosted"
                value={item.value}
                checked={filters.datePosted === item.value}
                onChange={() =>
                  onFilterChange({ ...filters, datePosted: item.value as FilterState['datePosted'] })
                }
                className="text-[#0066CC] focus:ring-[#0066CC]/20"
              />
              <span className={filters.datePosted === item.value ? 'font-semibold text-[#0066CC] dark:text-[#38BDF8]' : ''}>
                {item.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Quick Scroll Back To Top of Filters */}
      <div className="p-3 bg-slate-50 dark:bg-[#1A284A]/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="text-[11px]">{tr.filters.endOfFilters}</span>
        <button
          type="button"
          onClick={scrollSidebarUp}
          className="inline-flex items-center gap-1 font-semibold text-[#0066CC] dark:text-[#38BDF8] hover:underline cursor-pointer"
          title="Scroll back to top of filter sidebar"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          <span>{tr.filters.scrollToTop}</span>
        </button>
      </div>
    </div>
  );
};
