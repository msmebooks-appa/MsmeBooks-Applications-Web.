import React, { useState } from 'react';
import { Search, MapPin, Briefcase, ArrowRight, Building2, Plus, Bot, Handshake, Layers, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import heroImage from '../assets/images/hero_african_tech_team_1792354230230.jpg';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types/auth';
import { PanAfricanHubsModal } from './PanAfricanHubsModal';

interface HeroProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  onSearchSubmit: () => void;
  onExploreClick: () => void;
  onOpenPostJob?: () => void;
  onOpenAiAdvisor?: () => void;
  onOpenPartnerModal?: (role?: 'employer' | 'candidate') => void;
  onOpenAuthModal?: (mode?: 'signin' | 'signup', role?: UserRole) => void;
  onBrowseCompanies?: () => void;
  onBrowseIndustries?: () => void;
  departments: string[];
  locations: string[];
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchQueryChange,
  selectedDepartment,
  onDepartmentChange,
  selectedLocation,
  onLocationChange,
  onSearchSubmit,
  onExploreClick,
  onOpenPostJob,
  onOpenAiAdvisor,
  onOpenPartnerModal,
  onOpenAuthModal,
  onBrowseCompanies,
  onBrowseIndustries,
  departments,
  locations,
}) => {
  const { tr } = useLanguage();
  const [showHubsModal, setShowHubsModal] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const activeFilterCount =
    (selectedDepartment !== 'ALL' ? 1 : 0) + (selectedLocation !== 'ALL' ? 1 : 0);

  return (
    <section id="top" className="relative pt-6 pb-12 sm:pt-8 sm:pb-16 lg:pt-14 lg:pb-20 overflow-hidden bg-white dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Subtle atmospheric accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/60 dark:bg-blue-900/15 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-lime-50/40 dark:bg-[#B5E61D]/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-Column Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Mission Kicker */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] mb-3 sm:mb-4">
              <span className="w-2 h-2 rounded-full bg-[#B5E61D]" />
              <span>{tr.hero.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[3.35rem] font-extrabold tracking-tight text-[#14243A] dark:text-white leading-[1.12] mb-4 sm:mb-5 text-balance">
              {tr.hero.headline}
            </h1>

            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6 sm:mb-8 max-w-2xl font-normal">
              {tr.hero.subheadline}
            </p>

            {/* Primary & Secondary CTAs: responsive 2-col on tiny mobile so Explore & Post a Job never overflow */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 mb-6 sm:mb-8">
              <button
                onClick={onExploreClick}
                className={`px-3.5 sm:px-5 py-3 text-xs sm:text-sm font-semibold text-white bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#003D7A] rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap min-w-0 ${
                  !onOpenPostJob ? 'col-span-2 sm:col-span-1' : ''
                }`}
              >
                <span className="truncate">{tr.hero.explorePositions}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              {onOpenPostJob && (
                <button
                  onClick={onOpenPostJob}
                  className="px-3.5 sm:px-4.5 py-3 text-xs sm:text-sm font-bold text-[#14243A] bg-[#B5E61D] hover:bg-[#a2d114] active:bg-[#91bb12] rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap min-w-0"
                  title="Post a vacancy as a company or individual employer"
                >
                  <Plus className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tr.hero.postJobOpening}</span>
                </button>
              )}

              {(onOpenAuthModal || onOpenPartnerModal) && (
                <button
                  onClick={() => (onOpenAuthModal ? onOpenAuthModal('signup', 'employer') : onOpenPartnerModal?.('employer'))}
                  className="px-3 sm:px-4.5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#14243A] dark:text-slate-200 bg-slate-100 dark:bg-[#15223E] hover:bg-slate-200 dark:hover:bg-[#1C2C50] rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 border border-slate-200 dark:border-slate-700/80 whitespace-nowrap min-w-0 cursor-pointer"
                  title="Partner as an employer, agency, headhunter, or candidate"
                >
                  <Handshake className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8] shrink-0" />
                  <span className="truncate">Partner / Sign Up</span>
                </button>
              )}

              {onOpenAiAdvisor && (
                <button
                  onClick={onOpenAiAdvisor}
                  className="px-3 sm:px-4.5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/70 rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap min-w-0 cursor-pointer"
                  title="Get AI career recommendations and salary guidance"
                >
                  <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="truncate">AI Advisor</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                </button>
              )}
            </div>

            {/* Quick Micro trust factors */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066CC] dark:bg-[#38BDF8]" />
                <span>Open for Verified Companies & Agencies</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B5E61D]" />
                <span>AI-Powered Resume Matching</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0066CC] dark:bg-[#38BDF8]" />
                <span>Pan-African & Global Remote Roles</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Corporate Photography */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-100 dark:bg-[#131D35] aspect-[4/3] lg:aspect-[16/11]">
              <img
                src={heroImage}
                alt="African technology professionals collaborating in a modern tech hub"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                loading="eager"
              />

              {/* Scrim overlay with subtle branding accent */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#14243A]/85 via-transparent to-transparent pointer-events-none" />

              {/* Verified African Tech Workplace floating tag */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-[#0D1527]/95 backdrop-blur-md p-3.5 rounded-xl border border-white/60 dark:border-slate-700/70 shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#14243A] dark:text-white">MsmeBooks Talent Network</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">10,000+ MSMEs · Tech, Finance & Operations</div>
                </div>
                <div className="px-2.5 py-1 bg-[#B5E61D]/30 dark:bg-[#B5E61D]/20 border border-[#B5E61D] rounded text-[11px] font-bold text-[#14243A] dark:text-[#B5E61D]">
                  Active Hiring
                </div>
              </div>
            </div>

            {/* Decorative soft glow behind card */}
            <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-[#B5E61D]/20 dark:bg-[#B5E61D]/10 rounded-full blur-2xl -z-10" />
          </div>
        </div>

        {/* Prominent Search Interface Directly Below Hero with Mobile Collapsible Search Drawer */}
        <div className="mt-8 sm:mt-12 lg:mt-16 bg-white dark:bg-[#131D35] p-3.5 sm:p-5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700/80 transition-colors duration-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
            }}
            className="flex flex-col md:grid md:grid-cols-12 gap-2.5 sm:gap-3"
          >
            {/* Compact Mobile Top Bar: Search Keyword + Inline Filter Drawer Toggle + Quick Search Go */}
            <div className="md:col-span-5 relative">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="hero-search" className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {tr.common.search}
                </label>
                {activeFilterCount > 0 && (
                  <span className="md:hidden text-[10px] font-bold text-[#0066CC] dark:text-[#38BDF8]">
                    {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 flex items-center min-w-0">
                  <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 pointer-events-none" />
                  <input
                    id="hero-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                    placeholder={tr.hero.searchPlaceholder}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-[#1A284A] hover:bg-slate-100/80 dark:hover:bg-[#20325A] focus:bg-white dark:focus:bg-[#1A284A] text-sm text-[#14243A] dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#0066CC] dark:focus:border-[#38BDF8] focus:ring-2 focus:ring-[#0066CC]/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Mobile Collapsible Search Drawer Toggle */}
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen((prev) => !prev)}
                  aria-expanded={isMobileFiltersOpen}
                  aria-controls="hero-mobile-search-drawer"
                  className={`md:hidden shrink-0 h-[42px] px-3 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMobileFiltersOpen || activeFilterCount > 0
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border-[#0066CC]/40 dark:border-[#38BDF8]/40'
                      : 'bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                  }`}
                  title="Toggle mobile search & filter options"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#0066CC] text-white text-[10px] font-extrabold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMobileFiltersOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile Quick Search Submit when Drawer is Closed */}
                {!isMobileFiltersOpen && (
                  <button
                    type="submit"
                    className="md:hidden shrink-0 h-[42px] px-3.5 bg-[#0066CC] hover:bg-[#0052A3] text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center cursor-pointer"
                    aria-label={tr.hero.searchJobsBtn}
                  >
                    <Search className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Collapsible Mobile Search Drawer (Always visible as grid columns on md+) */}
            <div
              id="hero-mobile-search-drawer"
              className={`${
                isMobileFiltersOpen
                  ? 'flex flex-col gap-2.5 pt-2.5 mt-1 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1'
                  : 'hidden'
              } md:contents`}
            >
              <div className="flex items-center justify-between md:hidden">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Refine Search & Discovery
                </span>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onDepartmentChange('ALL');
                      onLocationChange('ALL');
                    }}
                    className="text-[11px] font-bold text-[#0066CC] dark:text-[#38BDF8] flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Department dropdown */}
              <div className="md:col-span-3 relative">
                <label htmlFor="hero-dept" className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  {tr.filters.department}
                </label>
                <div className="relative flex items-center">
                  <Briefcase className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 pointer-events-none" />
                  <select
                    id="hero-dept"
                    value={selectedDepartment}
                    onChange={(e) => onDepartmentChange(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-[#1A284A] hover:bg-slate-100/80 dark:hover:bg-[#20325A] focus:bg-white dark:focus:bg-[#1A284A] text-sm text-[#14243A] dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#0066CC] dark:focus:border-[#38BDF8] focus:ring-2 focus:ring-[#0066CC]/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="ALL">{tr.hero.allDepartments}</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none text-xs">▼</span>
                </div>
              </div>

              {/* Location dropdown */}
              <div className="md:col-span-2 relative">
                <label htmlFor="hero-loc" className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  {tr.filters.location}
                </label>
                <div className="relative flex items-center">
                  <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 pointer-events-none" />
                  <select
                    id="hero-loc"
                    value={selectedLocation}
                    onChange={(e) => onLocationChange(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-[#1A284A] hover:bg-slate-100/80 dark:hover:bg-[#20325A] focus:bg-white dark:focus:bg-[#1A284A] text-sm text-[#14243A] dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#0066CC] dark:focus:border-[#38BDF8] focus:ring-2 focus:ring-[#0066CC]/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="ALL">{tr.hero.allLocations}</option>
                    <option value="Remote">{tr.jobs.remote}</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                  <span className="absolute right-3 text-slate-400 dark:text-slate-500 pointer-events-none text-xs">▼</span>
                </div>
              </div>

              {/* Submit Action */}
              <div className="md:col-span-2 flex items-end pt-1 md:pt-0">
                <button
                  type="submit"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full py-2.5 px-4 bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#003D7A] text-white font-semibold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 h-[42px] cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{tr.hero.searchJobsBtn}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Quick Discover Shortcuts: Companies A-Z, Industries (shown on desktop or inside mobile drawer when expanded) */}
          {(onBrowseCompanies || onBrowseIndustries) && (
            <div
              className={`${
                isMobileFiltersOpen ? 'flex' : 'hidden md:flex'
              } mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex-wrap items-center justify-between gap-2 text-xs`}
            >
              <span className="text-slate-500 dark:text-slate-400 font-medium">Quick Discovery:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {onBrowseCompanies && (
                  <button
                    type="button"
                    onClick={onBrowseCompanies}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#1A284A] dark:hover:bg-[#20325A] text-slate-700 dark:text-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                    <span>Browse Companies (A–Z)</span>
                  </button>
                )}
                {onBrowseIndustries && (
                  <button
                    type="button"
                    onClick={onBrowseIndustries}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#1A284A] dark:hover:bg-[#20325A] text-slate-700 dark:text-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    <span>View by Industries & Sectors</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Strategic Hiring & Partnership Banner for Companies, Recruiters, and Individuals */}
        <div className="mt-6 p-4 sm:p-5 bg-gradient-to-r from-blue-50/90 via-slate-50 to-lime-50/70 dark:from-[#13203C] dark:via-[#111A2E] dark:to-[#172635] rounded-2xl border border-blue-200/70 dark:border-blue-900/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-200">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#0066CC] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-5 h-5 text-[#B5E61D]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-[#14243A] dark:text-white flex items-center gap-2 flex-wrap">
                <span>Hiring in Africa? Open to Companies, Agencies & Individuals</span>
                <span className="px-2 py-0.5 rounded-full bg-[#B5E61D]/70 dark:bg-[#B5E61D]/30 text-[#14243A] dark:text-[#B5E61D] text-[10px] font-extrabold uppercase tracking-wide">
                  Recruitment Module
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">
                Publish openings, screen candidates with Gemini AI, and sync new hires with MsmeBooks Payroll.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            {onOpenPostJob && (
              <button
                onClick={onOpenPostJob}
                className="px-4 py-2 bg-white dark:bg-[#15223E] hover:bg-slate-50 dark:hover:bg-[#1E3056] text-[#0066CC] dark:text-[#38BDF8] border border-[#0066CC]/30 dark:border-blue-500/40 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post a Job Free</span>
              </button>
            )}

            {(onOpenAuthModal || onOpenPartnerModal) && (
              <button
                onClick={() => (onOpenAuthModal ? onOpenAuthModal('signup', 'employer') : onOpenPartnerModal?.('employer'))}
                className="px-4 py-2 bg-[#14243A] dark:bg-[#0066CC] hover:bg-slate-800 dark:hover:bg-[#0052A3] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                <Handshake className="w-3.5 h-3.5 text-[#B5E61D]" />
                <span>Partner / Sign Up</span>
              </button>
            )}
          </div>
        </div>

        {/* Real Quantitative Proof / Trust strip below hero */}
        <div className="mt-10 pt-8 border-t border-slate-200/70 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#14243A] dark:text-white font-mono tabular-nums">
              10,000+
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">MSMEs & Employers Powered</div>
          </div>
          <div
            onClick={() => setShowHubsModal(true)}
            className="group cursor-pointer p-2 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-[#131D35] transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-900/60"
            title="Click to explore all 20+ Countries Pan-African Operations Hubs"
          >
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0066CC] dark:text-[#38BDF8] font-mono tabular-nums flex items-center justify-center gap-1 group-hover:scale-105 transition-transform">
              <span>20+ Countries</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center justify-center gap-1">
              <span>Pan-African Operations Hubs</span>
              <span className="text-[10px] text-[#0066CC] dark:text-[#38BDF8] font-bold underline hidden sm:inline">
                Explore
              </span>
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#14243A] dark:text-white font-mono tabular-nums">
              75% Faster
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">AI Screening & Parsing Speed</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0066CC] dark:text-[#38BDF8] font-mono tabular-nums">
              15,000+
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Active Candidate Community</div>
          </div>
        </div>
      </div>

      {/* 20+ Countries Pan-African Operations Hubs Modal */}
      <PanAfricanHubsModal
        isOpen={showHubsModal}
        onClose={() => setShowHubsModal(false)}
        onExploreHubJobs={(country) => {
          setShowHubsModal(false);
          onLocationChange(country);
          onSearchSubmit();
        }}
      />
    </section>
  );
};
