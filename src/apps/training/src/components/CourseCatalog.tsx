import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  BookOpen, 
  Award, 
  Star, 
  Users, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Heart,
  X,
  FileText,
  Tag
} from 'lucide-react';
import { Course } from '../types';
import { COURSES } from '../data/mockData';
import { StarRatingWidget } from './StarRatingWidget';
import { SupportedCurrency, formatCurrency } from '../data/currencies';
import { Language, getTranslation } from '../data/translations';

interface CourseCatalogProps {
  onSelectCourse: (course: Course) => void;
  onEnrollCourse: (course: Course) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  wishlistCourseIds?: string[];
  onToggleWishlist?: (courseId: string) => void;
  courseRatings?: Record<string, { userRating?: number; averageRating: number; ratingCount: number }>;
  onRateCourse?: (courseId: string, rating: number) => void;
  enrolledCourseIds?: string[];
  currentCurrency?: SupportedCurrency;
  currentLanguage?: Language;
}

// Helper to highlight matching characters in real-time as user types
const HighlightMatch: React.FC<{ text: string; query: string }> = ({ text, query }) => {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark key={i} className="bg-amber-200 dark:bg-amber-400 text-amber-950 dark:text-slate-950 font-bold px-0.5 rounded-xs">
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      )}
    </>
  );
};

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  onSelectCourse,
  onEnrollCourse,
  selectedCategory,
  onSelectCategory,
  wishlistCourseIds = [],
  onToggleWishlist,
  courseRatings = {},
  onRateCourse,
  enrolledCourseIds = [],
  currentCurrency = 'NGN',
  currentLanguage = 'en'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTarget, setSearchTarget] = useState<'all' | 'title' | 'description'>('all');
  const [levelFilter, setLevelFilter] = useState<string>('All');
  const [pricingFilter, setPricingFilter] = useState<string>('All');
  const [sectorFilter, setSectorFilter] = useState<string>('All');

  // Count courses per difficulty level
  const levelCounts = useMemo(() => {
    return {
      All: COURSES.length,
      Beginner: COURSES.filter((c) => c.level === 'Beginner').length,
      Intermediate: COURSES.filter((c) => c.level === 'Intermediate').length,
      Advanced: COURSES.filter((c) => c.level === 'Advanced').length
    };
  }, []);

  // Count courses per sector
  const sectorCounts = useMemo(() => {
    return {
      All: COURSES.length,
      'Private Sector': COURSES.filter((c) => c.sector === 'Private Sector').length,
      'Government & Public Sector': COURSES.filter((c) => c.sector === 'Government & Public Sector').length,
      'Core SaaS Operations': COURSES.filter((c) => c.sector === 'Core SaaS Operations' || !c.sector).length,
    };
  }, []);

  const quickSearchSuggestions = [
    { label: 'Cloud Accounting (Title)', query: 'Cloud Accounting', target: 'title' as const },
    { label: 'Bank Reconciliation (Desc)', query: 'reconciliation', target: 'description' as const },
    { label: 'POS Barcode (Title)', query: 'Point of Sale', target: 'title' as const },
    { label: 'Biological Assets (Desc)', query: 'biological asset', target: 'description' as const },
    { label: 'VAT Compliance (Desc)', query: 'VAT', target: 'description' as const },
    { label: 'Harvest Costing (Title)', query: 'Harvest Costing', target: 'title' as const },
    { label: 'IPSAS Governance (Title)', query: 'IPSAS', target: 'title' as const },
    { label: 'Cashier Till (Desc)', query: 'cashier', target: 'description' as const }
  ];

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return COURSES.filter((course) => {
      // Real-time search by Title or Description
      const matchesTitle = !query || course.title.toLowerCase().includes(query);
      const matchesDescription = !query || 
        course.description.toLowerCase().includes(query) || 
        course.tagline.toLowerCase().includes(query);
      const matchesInstructor = !query || course.instructor.name.toLowerCase().includes(query);
      const matchesCategoryName = !query || course.category.toLowerCase().includes(query);

      let matchesSearch = true;
      if (query) {
        if (searchTarget === 'title') {
          matchesSearch = matchesTitle;
        } else if (searchTarget === 'description') {
          matchesSearch = matchesDescription;
        } else {
          // 'all': matches title or description, with supporting instructor/category fallback
          matchesSearch = matchesTitle || matchesDescription || matchesInstructor || matchesCategoryName;
        }
      }

      // Category
      const matchesCategory =
        selectedCategory === 'All' || course.category === selectedCategory;

      // Sector Filter
      const matchesSector =
        sectorFilter === 'All' || course.sector === sectorFilter;

      // Difficulty Level Filter
      const matchesLevel =
        levelFilter === 'All' || course.level === levelFilter;

      // Pricing Filter
      const matchesPricing =
        pricingFilter === 'All' ||
        (pricingFilter === 'Free' && course.isFree) ||
        (pricingFilter === 'Paid' && !course.isFree);

      return matchesSearch && matchesCategory && matchesSector && matchesLevel && matchesPricing;
    });
  }, [searchQuery, searchTarget, selectedCategory, sectorFilter, levelFilter, pricingFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    searchTarget !== 'all' ||
    levelFilter !== 'All' ||
    sectorFilter !== 'All' ||
    selectedCategory !== 'All' ||
    pricingFilter !== 'All';

  const resetAllFilters = () => {
    setSearchQuery('');
    setSearchTarget('all');
    setLevelFilter('All');
    setSectorFilter('All');
    setPricingFilter('All');
    onSelectCategory('All');
  };

  return (
    <section id="courses" className="py-14 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Subheading */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-900">
            <BookOpen className="w-3.5 h-3.5 text-[#72B01D]" />
            <span>Accredited Curriculum</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explore MsmeBooks Course Catalog
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Filter courses in real-time by title or description. Search our comprehensive library of cloud accounting, retail POS, inventory control, and agribusiness courses tailored for African SMEs.
          </p>
        </div>

        {/* Real-Time Search & Filtering Command Center */}
        <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs mb-8 space-y-5 transition-colors">
          
          {/* Top Row: Searchable Input Field with Title/Description Target Selector */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label htmlFor="course-search-input" className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-[#0B4F9C] dark:text-blue-400" />
                <span>Search Courses by Title or Description</span>
                <span className="text-[10px] font-semibold text-[#0B4F9C] dark:text-blue-300 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  Real-Time Filter
                </span>
              </label>

              {/* Target Scope Switcher: All / Title / Description */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[11px] self-start sm:self-auto border border-slate-200 dark:border-slate-700">
                <span className="text-slate-400 dark:text-slate-500 px-2 py-0.5 font-medium">Filter in:</span>
                <button
                  type="button"
                  onClick={() => setSearchTarget('all')}
                  className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    searchTarget === 'all'
                      ? 'bg-white dark:bg-slate-700 text-[#0B4F9C] dark:text-blue-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Title &amp; Description
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTarget('title')}
                  className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    searchTarget === 'title'
                      ? 'bg-white dark:bg-slate-700 text-[#0B4F9C] dark:text-blue-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Title Only
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTarget('description')}
                  className={`px-2.5 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    searchTarget === 'description'
                      ? 'bg-white dark:bg-slate-700 text-[#0B4F9C] dark:text-blue-300 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Description Only
                </button>
              </div>
            </div>

            {/* Input Element */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="course-search-input"
                type="text"
                placeholder={
                  searchTarget === 'title'
                    ? "Type course title to filter in real-time (e.g. 'Cloud Accounting', 'Point of Sale', 'Commercial Agriculture')..."
                    : searchTarget === 'description'
                    ? "Type syllabus or description keywords (e.g. 'VAT', 'reconciliation', 'biological asset', 'TSA', 'cash drops')..."
                    : getTranslation('searchPlaceholder', currentLanguage)
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchQuery('');
                }}
                className="w-full pl-11 pr-24 py-3.5 bg-slate-50/90 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-[#0B4F9C] focus:border-transparent transition-all shadow-2xs font-medium"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white bg-slate-200 dark:bg-slate-700 rounded-full text-xs transition-colors cursor-pointer"
                    title="Clear search input"
                    aria-label="Clear search input"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline-block bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  Live Sync
                </span>
              </div>
            </div>

            {/* Live Typing Status Feedback Banner */}
            {searchQuery.trim() && (
              <div className="flex items-center justify-between text-xs bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 rounded-xl px-3.5 py-2 text-slate-700 dark:text-slate-300 animate-in fade-in duration-100">
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-[#0B4F9C] dark:text-blue-400" />
                  <span>
                    Filtering {searchTarget === 'title' ? 'titles' : searchTarget === 'description' ? 'descriptions' : 'titles and descriptions'} in real-time by: <strong className="text-[#0B4F9C] dark:text-blue-300">"{searchQuery}"</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#0B4F9C] dark:text-blue-300 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-800 tabular-nums">
                    {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
                  </span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-[11px] text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Quick Search Chips categorized by Title and Description */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
              <span className="text-slate-400 dark:text-slate-500 font-medium mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#72B01D]" />
                <span>Quick search terms:</span>
              </span>
              {quickSearchSuggestions.map((suggestion) => (
                <button
                  key={suggestion.label}
                  type="button"
                  onClick={() => {
                    setSearchQuery(suggestion.query);
                    setSearchTarget(suggestion.target);
                  }}
                  className={`px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    searchQuery.toLowerCase() === suggestion.query.toLowerCase()
                      ? 'bg-[#0B4F9C] text-white border-[#0B4F9C] font-semibold shadow-2xs'
                      : 'bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sector Filter Bar */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-1.5">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {getTranslation('filterBySector', currentLanguage)}:
            </span>
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
              {(['All', 'Private Sector', 'Government & Public Sector', 'Core SaaS Operations'] as const).map((sec) => {
                const isActive = sectorFilter === sec;
                const count = sectorCounts[sec as keyof typeof sectorCounts] ?? 0;
                const label = sec === 'All' ? getTranslation('allSectors', currentLanguage) : sec === 'Private Sector' ? getTranslation('privateSector', currentLanguage) : sec === 'Government & Public Sector' ? getTranslation('publicSector', currentLanguage) : getTranslation('coreSaas', currentLanguage);
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSectorFilter(sec)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#0B4F9C] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Level & Pricing Row */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Difficulty Level Filter */}
            <div className="md:col-span-8 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {getTranslation('filterByLevel', currentLanguage)}:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
                {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => {
                  const isActive = levelFilter === lvl;
                  const count = levelCounts[lvl];
                  const label = lvl === 'All' ? getTranslation('all', currentLanguage) : lvl === 'Beginner' ? getTranslation('beginner', currentLanguage) : lvl === 'Intermediate' ? getTranslation('intermediate', currentLanguage) : getTranslation('advanced', currentLanguage);
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setLevelFilter(lvl)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-[#0B4F9C] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{label}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pricing Filter */}
            <div className="md:col-span-4 space-y-1.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {getTranslation('filterByPricing', currentLanguage)}:
              </span>
              <div className="flex items-center gap-1 p-1 bg-slate-100/80 dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
                {(['All', 'Paid', 'Free'] as const).map((price) => {
                  const isActive = pricingFilter === price;
                  const label = price === 'All' ? getTranslation('all', currentLanguage) : price === 'Paid' ? getTranslation('paidCourses', currentLanguage) : getTranslation('freeCourses', currentLanguage);
                  return (
                    <button
                      key={price}
                      type="button"
                      onClick={() => setPricingFilter(price)}
                      className={`flex-1 py-1.5 text-center rounded-lg font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0B4F9C] text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Active Filter Indicators & Reset Bar */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Active Filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-md font-semibold">
                  <span>Keyword ({searchTarget}): "{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-red-500 cursor-pointer ml-1 font-bold"
                  >
                    ✕
                  </button>
                </span>
              )}

              {sectorFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-md font-semibold">
                  <span>Sector: {sectorFilter}</span>
                  <button
                    onClick={() => setSectorFilter('All')}
                    className="hover:text-red-500 cursor-pointer ml-1 font-bold"
                  >
                    ✕
                  </button>
                </span>
              )}

              {levelFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-md font-semibold">
                  <span>Level: {levelFilter}</span>
                  <button
                    onClick={() => setLevelFilter('All')}
                    className="hover:text-red-500 cursor-pointer ml-1 font-bold"
                  >
                    ✕
                  </button>
                </span>
              )}

              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-md font-semibold">
                  <span>Category: {selectedCategory}</span>
                  <button
                    onClick={() => onSelectCategory('All')}
                    className="hover:text-red-500 cursor-pointer ml-1 font-bold"
                  >
                    ✕
                  </button>
                </span>
              )}

              {pricingFilter !== 'All' && (
                <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950 text-[#0B4F9C] dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2.5 py-0.5 rounded-md font-semibold">
                  <span>Price: {pricingFilter}</span>
                  <button
                    onClick={() => setPricingFilter('All')}
                    className="hover:text-red-500 cursor-pointer ml-1 font-bold"
                  >
                    ✕
                  </button>
                </span>
              )}

              {!hasActiveFilters && (
                <span className="text-slate-400 dark:text-slate-500">None (Showing all courses)</span>
              )}

              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold hover:underline ml-1 cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">
              Showing <strong className="text-slate-900 dark:text-white font-bold tabular-nums">{filteredCourses.length}</strong> of{' '}
              <span className="tabular-nums">{COURSES.length}</span> accredited courses
            </div>
          </div>

        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-12 text-center rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">
              No courses match your search criteria
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              {searchQuery ? (
                <>No courses found matching title or description for <span className="font-semibold text-slate-700 dark:text-slate-200">"{searchQuery}"</span></>
              ) : (
                <>No courses found for the selected {levelFilter !== 'All' ? `${levelFilter} difficulty level` : 'criteria'}</>
              )}
              {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}.
              Try searching with popular terms like "Accounting", "POS", "VAT", "Inventory", or "Farm".
            </p>
            <div className="pt-2">
              <button
                onClick={resetAllFilters}
                className="px-5 py-2.5 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-xl transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              >
                <span>Clear Search &amp; Reset Filters</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const query = searchQuery.trim().toLowerCase();
              const isTitleMatch = query && course.title.toLowerCase().includes(query);
              const isDescMatch = query && (course.description.toLowerCase().includes(query) || course.tagline.toLowerCase().includes(query));

              return (
                <div
                  key={course.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg transition-all overflow-hidden flex flex-col group text-left"
                >
                  {/* Thumbnail slot */}
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Sector & Category tag */}
                    <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 max-w-[80%]">
                      {course.sector && (
                        <span className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded shadow-xs backdrop-blur-xs ${
                          course.sector === 'Government & Public Sector'
                            ? 'bg-blue-900/90 text-blue-100'
                            : course.sector === 'Private Sector'
                            ? 'bg-emerald-900/90 text-emerald-100'
                            : 'bg-slate-900/85 text-slate-100'
                        }`}>
                          {course.sector === 'Government & Public Sector' ? 'Government' : course.sector === 'Private Sector' ? 'Private' : 'Core SaaS'}
                        </span>
                      )}
                      <span className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xs text-slate-800 dark:text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs truncate max-w-[170px]">
                        {course.category}
                      </span>
                    </div>

                    {/* Wishlist Toggle Button */}
                    {onToggleWishlist && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(course.id);
                        }}
                        className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-xs transition-all shadow-xs cursor-pointer active:scale-95 z-10 ${
                          wishlistCourseIds.includes(course.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/85 dark:bg-slate-800/90 hover:bg-white text-slate-700 dark:text-slate-200 hover:text-rose-500'
                        }`}
                        title={wishlistCourseIds.includes(course.id) ? 'Remove from Wishlist' : 'Save course to Wishlist'}
                        aria-label={wishlistCourseIds.includes(course.id) ? 'Remove from Wishlist' : 'Save course to Wishlist'}
                      >
                        <Heart className={`w-3.5 h-3.5 ${wishlistCourseIds.includes(course.id) ? 'fill-white' : ''}`} />
                      </button>
                    )}

                    {/* Level & duration on image */}
                    <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#72B01D]" />
                        <span className="tabular-nums">{course.durationHours} hours</span>
                      </span>
                      <span className="bg-black/40 px-1.5 py-0.5 rounded text-[10px]">
                        {course.level}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Metadata */}
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                        <span className="tabular-nums">{course.modulesCount} modules</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{course.lessonsCount} lessons</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#72B01D] font-semibold flex items-center gap-0.5">
                          <Award className="w-3 h-3" /> Certificate
                        </span>
                      </div>

                      {/* Course Title with Match Highlighting & Badge */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 
                          onClick={() => onSelectCourse(course)}
                          className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#0B4F9C] dark:group-hover:text-blue-400 transition-colors line-clamp-2 cursor-pointer leading-snug flex-1"
                        >
                          <HighlightMatch text={course.title} query={searchQuery} />
                        </h3>
                        {isTitleMatch && (
                          <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                            Title Match
                          </span>
                        )}
                      </div>

                      {/* Course Description with Match Highlighting & Badge */}
                      <div className="space-y-1">
                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                          <HighlightMatch text={course.tagline} query={searchQuery} />
                        </p>

                        {/* If matched in description, show a dedicated highlighted snippet */}
                        {isDescMatch && !isTitleMatch && (
                          <div className="p-2 bg-blue-50/70 dark:bg-blue-950/40 rounded-lg border border-blue-200/60 dark:border-blue-900/60 text-[11px] text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-1 text-[9px] font-bold text-[#0B4F9C] dark:text-blue-400 uppercase tracking-wider mb-0.5">
                              <FileText className="w-3 h-3" />
                              <span>Matched in Course Description:</span>
                            </div>
                            <p className="line-clamp-2 italic">
                              "<HighlightMatch text={course.description} query={searchQuery} />"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Instructor & Pricing Footer */}
                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={course.instructor.avatar}
                            alt={course.instructor.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                          />
                          <div className="text-left">
                            <div className="flex items-center gap-1">
                              <p className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                                <HighlightMatch text={course.instructor.name} query={searchQuery} />
                              </p>
                              {query && course.instructor.name.toLowerCase().includes(query) && (
                                <span className="text-[8px] bg-blue-100 dark:bg-blue-900 text-[#0B4F9C] dark:text-blue-300 font-extrabold px-1 py-0.2 rounded shrink-0">
                                  Instructor
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                <span className="tabular-nums">
                                  {(courseRatings[course.id]?.averageRating ?? course.rating).toFixed(1)}
                                </span>
                                <span className="text-slate-400 font-normal">
                                  ({courseRatings[course.id]?.ratingCount ?? course.ratingCount})
                                </span>
                              </div>

                              {enrolledCourseIds.includes(course.id) && onRateCourse && (
                                <StarRatingWidget
                                  rating={courseRatings[course.id]?.averageRating ?? course.rating}
                                  ratingCount={courseRatings[course.id]?.ratingCount ?? course.ratingCount}
                                  userRating={courseRatings[course.id]?.userRating}
                                  onRate={(stars) => onRateCourse(course.id, stars)}
                                  compactInteractive={true}
                                  size="xs"
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          {course.isFree ? (
                            <span className="text-sm font-extrabold text-[#72B01D]">{getTranslation('freeCourses', currentLanguage).toUpperCase()}</span>
                          ) : (
                            <div>
                              <span className="text-sm font-extrabold text-[#0B4F9C] dark:text-blue-400 tabular-nums">
                                {formatCurrency(course.priceNgn, currentCurrency)}
                              </span>
                              <p className="text-[9px] text-slate-400 dark:text-slate-500">{getTranslation('oneTimeAccess', currentLanguage)}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => onSelectCourse(course)}
                          className="w-full py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer text-center"
                        >
                          {getTranslation('curriculum', currentLanguage)}
                        </button>
                        <button
                          onClick={() => onEnrollCourse(course)}
                          className="w-full py-2 px-3 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-xl transition-colors shadow-xs cursor-pointer text-center"
                        >
                          {course.isFree ? getTranslation('startFree', currentLanguage) : getTranslation('enrollNow', currentLanguage)}
                        </button>
                      </div>

                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
