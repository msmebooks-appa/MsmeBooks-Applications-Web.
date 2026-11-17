import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'motion/react';
import { 
  X, 
  Filter, 
  RotateCcw, 
  ShieldCheck, 
  Wifi, 
  Check, 
  ChevronDown,
  Building2,
  Layers,
  Store,
  Award,
  LocateFixed,
  Loader2,
  MapPin,
  Heart,
} from 'lucide-react';
import { FilterState, PartnerLevel, SuccessStoryScale } from '../types';
import { PARTNERS_DATA, COUNTRIES_LIST, PARTNER_TYPES, INDUSTRIES_LIST, SUCCESS_STORY_SCALES, getCitiesForCountry } from '../data/partnersData';
import { useGeolocationFilter } from '../hooks/useGeolocationFilter';

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
  totalFilteredCount: number;
  availableServices: string[];
  availableLanguages: string[];
  businessSizes: string[];
  availableSkills?: string[];
  viewFavoritesOnly?: boolean;
  onToggleViewFavorites?: (enabled: boolean) => void;
  favoritesCount?: number;
}

export const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  isOpen,
  onClose,
  filters,
  onUpdateFilters,
  onResetFilters,
  activeFiltersCount,
  totalFilteredCount,
  availableServices,
  availableLanguages,
  businessSizes,
  availableSkills,
  viewFavoritesOnly = false,
  onToggleViewFavorites,
  favoritesCount = 0,
}) => {
  const {
    isLocating: isGeoLocating,
    geoError,
    detectedResult: geoDetectedResult,
    timezoneFallback,
    locateNearMe,
    setGeoError,
  } = useGeolocationFilter();

  const handleMobileFindNearMe = () => {
    locateNearMe((result) => {
      onUpdateFilters({
        country: result.country,
        city: result.city,
      });
    });
  };

  // Prevent body scrolling when sheet is open on mobile devices
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  // Handle drag to dismiss down gesture
  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 110 || info.velocity.y > 500) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          {/* Backdrop with fade transition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity cursor-pointer"
            aria-hidden="true"
          />

          {/* Slide-Up Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 28,
              stiffness: 300,
              mass: 0.8,
            }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.6 }}
            onDragEnd={handleDragEnd}
            className="relative z-10 w-full max-h-[88vh] bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Grab Handle for touch pulling */}
            <div className="pt-3 pb-1 flex justify-center items-center cursor-grab active:cursor-grabbing touch-none select-none">
              <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 transition-colors" />
            </div>

            {/* Header Bar */}
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-lime-500/10 text-lime-600 dark:text-lime-400">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    Search Filters
                    {activeFiltersCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-lime-500 text-slate-950">
                        {activeFiltersCount}
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Refine your certified partner discovery
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={onResetFilters}
                    className="flex items-center gap-1 text-xs text-lime-600 dark:text-lime-400 hover:underline font-semibold px-2 py-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close filters sheet"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Form Body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-6 text-xs">
              
              {/* Quick Favorites, Verified & Remote Toggles */}
              <div className="space-y-2.5 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
                <label className="flex items-center justify-between cursor-pointer py-1 font-semibold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <Heart className={`w-4 h-4 shrink-0 ${viewFavoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`} />
                    <span>View My Favorites</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      viewFavoritesOnly
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}>
                      {favoritesCount}
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    id="mobile-filter-favorites-only"
                    data-testid="mobile-filter-favorites-only"
                    checked={viewFavoritesOnly}
                    onChange={(e) => onToggleViewFavorites?.(e.target.checked)}
                    className="w-5 h-5 rounded text-rose-500 focus:ring-rose-400 accent-rose-500 cursor-pointer"
                  />
                </label>

                <div className="h-px bg-slate-200 dark:bg-slate-700/60" />

                <label className="flex items-center justify-between cursor-pointer py-1 font-semibold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0" />
                    <span>Verified Partners Only</span>
                  </span>
                  <input
                    type="checkbox"
                    id="mobile-filter-verified-only"
                    checked={filters.verifiedOnly}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const current = filters.quickFilters || [];
                      const next = isChecked
                        ? (current.includes('verified-only') ? current : [...current, 'verified-only'])
                        : current.filter((id) => id !== 'verified-only');
                      onUpdateFilters({ verifiedOnly: isChecked, quickFilters: next });
                    }}
                    className="w-5 h-5 rounded text-lime-500 focus:ring-lime-400 accent-lime-500 cursor-pointer"
                  />
                </label>

                <div className="h-px bg-slate-200 dark:bg-slate-700/60" />

                <label className="flex items-center justify-between cursor-pointer py-1 font-semibold text-slate-800 dark:text-slate-200">
                  <span className="flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                    <span>Remote Support Available</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={filters.remoteOnly}
                    onChange={(e) => onUpdateFilters({ remoteOnly: e.target.checked })}
                    className="w-5 h-5 rounded text-lime-500 focus:ring-lime-400 accent-lime-500 cursor-pointer"
                  />
                </label>
              </div>

              {/* Client Availability Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200">
                    Client Availability
                  </label>
                  {filters.availability && (
                    <button 
                      onClick={() => onUpdateFilters({ availability: '' })}
                      className="text-[10px] text-lime-600 dark:text-lime-400 font-semibold hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { id: '', label: 'All Availabilities', count: PARTNERS_DATA.length, dot: null },
                    { id: 'Accepting New Clients', label: 'Accepting New Clients', count: PARTNERS_DATA.filter(p => p.availabilityStatus === 'Accepting New Clients').length, dot: 'bg-emerald-500' },
                    { id: 'Currently Booked', label: 'Currently Booked', count: PARTNERS_DATA.filter(p => p.availabilityStatus === 'Currently Booked').length, dot: 'bg-rose-500' },
                  ].map((item) => {
                    const isSelected = (!filters.availability && item.id === '') || filters.availability === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onUpdateFilters({ availability: item.id })}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all text-left ${
                          isSelected
                            ? 'bg-lime-500 text-slate-950 font-bold shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          {item.dot && (
                            <span className={`w-2.5 h-2.5 rounded-full ${item.dot} shrink-0`}></span>
                          )}
                          <span>{item.label}</span>
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-slate-950/20 text-slate-950 font-bold'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {item.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Success Stories Implementation Scale */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                    <span>Success Stories Scale</span>
                  </label>
                  {filters.successStoryScale && (
                    <button 
                      onClick={() => onUpdateFilters({ successStoryScale: '' })}
                      className="text-[10px] text-lime-600 dark:text-lime-400 font-semibold hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    { id: '', label: 'All Success Stories', count: PARTNERS_DATA.length, icon: Award },
                    ...SUCCESS_STORY_SCALES.map((s) => ({
                      id: s.id,
                      label: s.label,
                      count: PARTNERS_DATA.filter((p) => p.clientSuccessStories && p.clientSuccessStories.some((story) => story.implementationScale === s.id)).length,
                      icon: s.id === 'Large-Scale Enterprise' ? Building2 : s.id === 'Mid-Market' ? Layers : Store,
                    }))
                  ].map((item) => {
                    const isSelected = (!filters.successStoryScale && item.id === '') || filters.successStoryScale === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        id={`mobile-scale-${item.id ? item.id.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'all'}`}
                        data-testid={`mobile-scale-${item.id ? item.id.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'all'}`}
                        onClick={() => onUpdateFilters({ successStoryScale: item.id })}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all text-left ${
                          isSelected
                            ? 'bg-lime-500 text-slate-950 font-bold shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Icon className="w-4 h-4 shrink-0 text-slate-700 dark:text-slate-300" />
                          <span>{item.label}</span>
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-slate-950/20 text-slate-950 font-bold'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {item.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Partner Level Badges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200">Partner Tier Level</label>
                  {filters.level && (
                    <button 
                      onClick={() => onUpdateFilters({ level: '' })}
                      className="text-[10px] text-lime-600 dark:text-lime-400 font-semibold hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['Platinum', 'Gold', 'Silver', 'Bronze'] as PartnerLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => onUpdateFilters({ level: filters.level === lvl ? '' : lvl })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all ${
                        filters.level === lvl
                          ? 'bg-lime-500 text-slate-950 font-bold shadow-sm'
                          : 'bg-slate-50 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {lvl} Partner
                    </button>
                  ))}
                </div>
              </div>

              {/* Location: Find Near Me, Country & City */}
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                      <span>Auto-Detect Location</span>
                    </span>
                    {geoDetectedResult && filters.country === geoDetectedResult.country && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        {geoDetectedResult.countryFlag} {geoDetectedResult.city}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    id="btn-mobile-find-near-me"
                    data-testid="btn-mobile-find-near-me"
                    onClick={handleMobileFindNearMe}
                    disabled={isGeoLocating}
                    className="w-full py-2.5 px-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-extrabold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
                  >
                    {isGeoLocating ? (
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    ) : (
                      <LocateFixed className="w-4 h-4 text-slate-950" />
                    )}
                    <span>{isGeoLocating ? 'Detecting location...' : 'Find partners near me'}</span>
                  </button>
                  {geoError && (
                    <div className="text-[11px] text-amber-700 dark:text-amber-300 space-y-1.5 pt-1">
                      <p>{geoError}</p>
                      <button
                        type="button"
                        onClick={() => {
                          setGeoError(null);
                          onUpdateFilters({
                            country: timezoneFallback.country,
                            city: timezoneFallback.city,
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/40 font-bold text-amber-800 dark:text-amber-200"
                      >
                        Use {timezoneFallback.countryFlag} {timezoneFallback.city}, {timezoneFallback.country}
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 dark:text-slate-200 block">Country</label>
                    {filters.country && (
                      <button
                        type="button"
                        onClick={() => onUpdateFilters({ country: '', city: '' })}
                        className="text-[11px] text-lime-600 dark:text-lime-400 font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <select
                    id="mobile-country-filter"
                    data-testid="mobile-country-filter"
                    value={filters.country}
                    onChange={(e) => {
                      const newCountry = e.target.value;
                      const validCities = getCitiesForCountry(newCountry);
                      const shouldResetCity = filters.city && !validCities.includes(filters.city);
                      onUpdateFilters({
                        country: newCountry,
                        ...(shouldResetCity ? { city: '' } : {})
                      });
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500"
                  >
                    <option value="">All Countries (All Africa & Global)</option>
                    <optgroup label="Africa — All 54 Sovereign Nations">
                      {COUNTRIES_LIST.filter(c => c.region === 'Africa').map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Europe">
                      {COUNTRIES_LIST.filter(c => c.region === 'Global' && c.subRegion === 'Europe').map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Americas & Caribbean">
                      {COUNTRIES_LIST.filter(c => c.region === 'Global' && (c.subRegion === 'North America' || c.subRegion === 'Latin America' || c.subRegion === 'Caribbean')).map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Middle East">
                      {COUNTRIES_LIST.filter(c => c.region === 'Global' && c.subRegion === 'Middle East').map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Asia & Pacific">
                      {COUNTRIES_LIST.filter(c => c.region === 'Global' && c.subRegion === 'Asia-Pacific').map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800 dark:text-slate-200 block">City / Town</label>
                    {filters.city && (
                      <button
                        type="button"
                        onClick={() => onUpdateFilters({ city: '' })}
                        className="text-[11px] text-lime-600 dark:text-lime-400 font-bold"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <select
                    id="mobile-city-filter"
                    data-testid="mobile-city-filter"
                    value={filters.city}
                    onChange={(e) => onUpdateFilters({ city: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500"
                  >
                    <option value="">{filters.country ? `All Cities in ${filters.country}` : 'All Cities / Locations'}</option>
                    {getCitiesForCountry(filters.country).map((cityName) => (
                      <option key={cityName} value={cityName}>
                        {cityName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Partner Type */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">Partner Type</label>
                <select
                  value={filters.partnerType}
                  onChange={(e) => onUpdateFilters({ partnerType: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500"
                >
                  <option value="">All Partner Types</option>
                  {PARTNER_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Industry Expertise */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">Industry Expertise</label>
                <select
                  value={filters.industry}
                  onChange={(e) => onUpdateFilters({ industry: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500"
                >
                  <option value="">All Industries</option>
                  {INDUSTRIES_LIST.map((ind) => (
                    <option key={ind.id} value={ind.name}>{ind.name}</option>
                  ))}
                </select>
              </div>

              {/* Services Required */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">Services Required</label>
                <select
                  value={filters.service}
                  onChange={(e) => onUpdateFilters({ service: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500"
                >
                  <option value="">All Services</option>
                  {availableServices.map((srv) => (
                    <option key={srv} value={srv}>{srv}</option>
                  ))}
                </select>
              </div>

              {/* Skill & Expertise */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 dark:text-slate-200 block">Skill & Expertise</label>
                  {filters.skill && (
                    <button
                      type="button"
                      onClick={() => onUpdateFilters({ skill: '' })}
                      className="text-xs text-lime-600 dark:text-lime-400 font-bold hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <select
                  value={filters.skill || ''}
                  onChange={(e) => onUpdateFilters({ skill: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500"
                >
                  <option value="">All Skills & Specialties</option>
                  {(availableSkills || []).map((sk) => (
                    <option key={sk} value={sk}>{sk}</option>
                  ))}
                </select>
              </div>

              {/* Business Size */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">Business Scale</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {businessSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => onUpdateFilters({ businessSize: filters.businessSize === sz ? '' : sz })}
                      className={`px-2 py-2 rounded-xl text-xs font-semibold text-center transition-all ${
                        filters.businessSize === sz
                          ? 'bg-lime-500 text-slate-950 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Language */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">Spoken Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => onUpdateFilters({ language: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-lime-500"
                >
                  <option value="">Any Language</option>
                  {availableLanguages.map((lang) => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Bottom Floating Apply Bar */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 shrink-0 shadow-lg">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 bg-lime-500 hover:bg-lime-400 active:bg-lime-600 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Show {totalFilteredCount} Partner{totalFilteredCount !== 1 ? 's' : ''}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
