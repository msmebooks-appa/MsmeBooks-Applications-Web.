import React, { useState, useMemo } from 'react';
import { Job, CompanyProfile } from '../types/career';
import { KNOWN_COMPANY_PROFILES, resolveCompanyProfile } from '../data/companyProfiles';
import {
  Building2,
  Search,
  MapPin,
  Globe,
  ExternalLink,
  Briefcase,
  CheckCircle2,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CompaniesDirectoryProps {
  jobs: Job[];
  onSelectCompanyJobs: (companyName: string) => void;
  onViewCompanyProfile: (companyName: string) => void;
}

type SortOption = 'az' | 'za' | 'jobs_desc' | 'verified' | 'featured';
type ViewLayout = 'alphabetical_groups' | 'grid';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const CompaniesDirectory: React.FC<CompaniesDirectoryProps> = ({
  jobs,
  onSelectCompanyJobs,
  onViewCompanyProfile,
}) => {
  const { tr } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [sortOption, setSortOption] = useState<SortOption>('az');
  const [layoutMode, setLayoutMode] = useState<ViewLayout>('alphabetical_groups');

  // Build the complete list of unique companies from jobs and pre-configured profiles
  const allCompaniesData = useMemo(() => {
    const map = new Map<string, { profile: CompanyProfile; openJobsCount: number; sampleJobs: Job[] }>();

    // 1. First add known profiles
    Object.values(KNOWN_COMPANY_PROFILES).forEach((profile) => {
      const normalized = profile.name.trim().toLowerCase();
      map.set(normalized, {
        profile,
        openJobsCount: 0,
        sampleJobs: [],
      });
    });

    // 2. Aggregate active jobs from all jobs in the app
    jobs.forEach((job) => {
      const companyName = job.company?.name || 'MsmeBooks Partner';
      const normalized = companyName.trim().toLowerCase();

      if (!map.has(normalized)) {
        const dynamicProfile = resolveCompanyProfile(companyName, jobs);
        map.set(normalized, {
          profile: dynamicProfile,
          openJobsCount: 0,
          sampleJobs: [],
        });
      }

      const entry = map.get(normalized)!;
      if (job.status === 'published') {
        entry.openJobsCount += 1;
        if (entry.sampleJobs.length < 3) {
          entry.sampleJobs.push(job);
        }
      }
    });

    return Array.from(map.values());
  }, [jobs]);

  // Letter counts mapping for alphabetical bar
  const letterCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: allCompaniesData.length };
    ALPHABET.forEach((letter) => {
      counts[letter] = 0;
    });
    counts['#'] = 0;

    allCompaniesData.forEach((item) => {
      const firstChar = item.profile.name.trim().charAt(0).toUpperCase();
      if (/[A-Z]/.test(firstChar)) {
        counts[firstChar] = (counts[firstChar] || 0) + 1;
      } else {
        counts['#'] = (counts['#'] || 0) + 1;
      }
    });

    return counts;
  }, [allCompaniesData]);

  // Filtered companies based on search query and selected letter
  const filteredCompanies = useMemo(() => {
    return allCompaniesData.filter((item) => {
      const name = item.profile.name.toLowerCase();
      const industry = (item.profile.industry || '').toLowerCase();
      const hq = (item.profile.headquarters || '').toLowerCase();
      const tagline = (item.profile.tagline || '').toLowerCase();
      const q = searchQuery.trim().toLowerCase();

      // Search keyword match
      if (q) {
        const matchSearch =
          name.includes(q) || industry.includes(q) || hq.includes(q) || tagline.includes(q);
        if (!matchSearch) return false;
      }

      // Letter match
      if (selectedLetter !== 'ALL') {
        const firstChar = item.profile.name.trim().charAt(0).toUpperCase();
        if (selectedLetter === '#') {
          if (/[A-Z]/.test(firstChar)) return false;
        } else {
          if (firstChar !== selectedLetter) return false;
        }
      }

      return true;
    });
  }, [allCompaniesData, searchQuery, selectedLetter]);

  // Sorted companies
  const sortedCompanies = useMemo(() => {
    const list = [...filteredCompanies];
    return list.sort((a, b) => {
      if (sortOption === 'az') {
        return a.profile.name.localeCompare(b.profile.name);
      }
      if (sortOption === 'za') {
        return b.profile.name.localeCompare(a.profile.name);
      }
      if (sortOption === 'jobs_desc') {
        if (b.openJobsCount !== a.openJobsCount) {
          return b.openJobsCount - a.openJobsCount;
        }
        return a.profile.name.localeCompare(b.profile.name);
      }
      if (sortOption === 'verified') {
        if (a.profile.verified !== b.profile.verified) {
          return a.profile.verified ? -1 : 1;
        }
        return a.profile.name.localeCompare(b.profile.name);
      }
      if (sortOption === 'featured') {
        if (b.openJobsCount !== a.openJobsCount) {
          return b.openJobsCount - a.openJobsCount;
        }
        return a.profile.name.localeCompare(b.profile.name);
      }
      return 0;
    });
  }, [filteredCompanies, sortOption]);

  // Grouped by starting letter for the alphabetical group view
  const groupedByLetter = useMemo(() => {
    const groups = new Map<string, typeof sortedCompanies>();
    sortedCompanies.forEach((item) => {
      const firstChar = item.profile.name.trim().charAt(0).toUpperCase();
      const key = /[A-Z]/.test(firstChar) ? firstChar : '#';
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(item);
    });

    // Return sorted keys
    const sortedKeys = Array.from(groups.keys()).sort((a, b) => {
      if (a === '#') return 1;
      if (b === '#') return -1;
      return a.localeCompare(b);
    });

    return sortedKeys.map((key) => ({
      letter: key,
      companies: groups.get(key)!,
    }));
  }, [sortedCompanies]);

  const totalOpenJobs = useMemo(() => {
    return allCompaniesData.reduce((acc, curr) => acc + curr.openJobsCount, 0);
  }, [allCompaniesData]);

  const verifiedCount = useMemo(() => {
    return allCompaniesData.filter((c) => c.profile.verified).length;
  }, [allCompaniesData]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedLetter('ALL');
    setSortOption('az');
  };

  return (
    <div className="space-y-6">
      {/* Directory Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#14243A] via-[#103058] to-[#0066CC] p-6 sm:p-8 text-white shadow-lg border border-blue-500/20">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#B5E61D] text-xs font-bold mb-3 border border-white/15">
            <Building2 className="w-3.5 h-3.5" />
            <span>Pan-African Employer Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Browse Companies from A to Z
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            Discover top verified technology companies, high-growth startups, and established enterprises hiring across African commercial corridors. Explore company cultures, perks, tech stacks, and active open positions.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Building2 className="w-4 h-4 text-[#B5E61D]" />
              <span className="font-bold text-white text-sm">{allCompaniesData.length}</span>
              <span>Employers Listed</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Briefcase className="w-4 h-4 text-[#38BDF8]" />
              <span className="font-bold text-white text-sm">{totalOpenJobs}</span>
              <span>Active Vacancies</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-white text-sm">{verifiedCount}</span>
              <span>Verified Employers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Search and Filter Controls */}
      <div className="bg-white dark:bg-[#131D35] p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm space-y-4 transition-colors">
        {/* Top Control Bar: Search Input & Sort Selector */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies by name, industry, headquarters, or keyword..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Right Controls: Sort & Layout Mode */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 outline-none cursor-pointer"
              >
                <option value="az">Alphabetical: A → Z</option>
                <option value="za">Alphabetical: Z → A</option>
                <option value="jobs_desc">Most Open Jobs First</option>
                <option value="verified">Verified Employers First</option>
              </select>
            </div>

            {/* Layout Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-[#1A284A] p-0.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setLayoutMode('alphabetical_groups')}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  layoutMode === 'alphabetical_groups'
                    ? 'bg-white dark:bg-[#0066CC] text-[#0066CC] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Group by letter A-Z"
              >
                A–Z Groups
              </button>
              <button
                onClick={() => setLayoutMode('grid')}
                className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  layoutMode === 'grid'
                    ? 'bg-white dark:bg-[#0066CC] text-[#0066CC] dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid cards layout"
              >
                Card Grid
              </button>
            </div>
          </div>
        </div>

        {/* Alphabetical A to Z Filter Strip */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>Filter by Starting Letter:</span>
              {selectedLetter !== 'ALL' && (
                <span className="px-1.5 py-0.2 bg-[#0066CC]/10 text-[#0066CC] dark:text-[#38BDF8] rounded font-mono">
                  {selectedLetter}
                </span>
              )}
            </span>

            {(selectedLetter !== 'ALL' || searchQuery) && (
              <button
                onClick={resetAllFilters}
                className="text-xs font-medium text-[#0066CC] dark:text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1.5 scrollbar-thin">
            {/* ALL button */}
            <button
              onClick={() => setSelectedLetter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedLetter === 'ALL'
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#20325A]'
              }`}
            >
              All ({letterCounts['ALL']})
            </button>

            {/* A to Z buttons */}
            {ALPHABET.map((letter) => {
              const count = letterCounts[letter] || 0;
              const isSelected = selectedLetter === letter;
              const hasItems = count > 0;

              return (
                <button
                  key={letter}
                  disabled={!hasItems}
                  onClick={() => setSelectedLetter(letter)}
                  className={`min-w-8 h-8 px-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center justify-center gap-0.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#0066CC] text-white shadow-xs'
                      : hasItems
                      ? 'bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#20325A]'
                      : 'opacity-35 cursor-not-allowed bg-slate-50 dark:bg-[#131D35] text-slate-400'
                  }`}
                  title={hasItems ? `${count} companies starting with ${letter}` : `No companies starting with ${letter}`}
                >
                  <span>{letter}</span>
                  {hasItems && (
                    <span
                      className={`text-[9px] font-mono font-normal ml-0.5 ${
                        isSelected ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}

            {/* '#' for special characters / numbers */}
            {(letterCounts['#'] || 0) > 0 && (
              <button
                onClick={() => setSelectedLetter('#')}
                className={`min-w-8 h-8 px-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center justify-center cursor-pointer ${
                  selectedLetter === '#'
                    ? 'bg-[#0066CC] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#20325A]'
                }`}
              >
                #
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
        <span>
          Showing <strong className="text-slate-900 dark:text-white font-mono">{sortedCompanies.length}</strong>{' '}
          {sortedCompanies.length === 1 ? 'company' : 'companies'}
          {selectedLetter !== 'ALL' && ` starting with "${selectedLetter}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>

        {selectedLetter !== 'ALL' && (
          <button
            onClick={() => setSelectedLetter('ALL')}
            className="text-[#0066CC] dark:text-[#38BDF8] hover:underline cursor-pointer"
          >
            Show All Letters
          </button>
        )}
      </div>

      {/* Empty State */}
      {sortedCompanies.length === 0 && (
        <div className="bg-white dark:bg-[#131D35] rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-[#1A284A] mx-auto flex items-center justify-center text-slate-400">
            <Building2 className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              No companies found
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
              We couldn't find any employers matching your current search "{searchQuery}" or letter filter.
            </p>
          </div>
          <button
            onClick={resetAllFilters}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0066CC] text-white rounded-xl text-xs font-bold hover:bg-[#0052A3] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters & Show All</span>
          </button>
        </div>
      )}

      {/* Render Alphabetical Group Layout */}
      {sortedCompanies.length > 0 && layoutMode === 'alphabetical_groups' && (
        <div className="space-y-8">
          {groupedByLetter.map((group) => (
            <div key={group.letter} className="space-y-4">
              {/* Letter Anchor Heading */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0066CC] to-[#14243A] text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
                  {group.letter}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Companies starting with {group.letter}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {group.companies.length} {group.companies.length === 1 ? 'employer' : 'employers'} listed
                  </p>
                </div>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700/80 ml-2" />
              </div>

              {/* Companies Grid for this Letter */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.companies.map((item) => (
                  <CompanyCard
                    key={item.profile.name}
                    item={item}
                    onSelectCompanyJobs={onSelectCompanyJobs}
                    onViewCompanyProfile={onViewCompanyProfile}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render Standard Grid Layout */}
      {sortedCompanies.length > 0 && layoutMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCompanies.map((item) => (
            <CompanyCard
              key={item.profile.name}
              item={item}
              onSelectCompanyJobs={onSelectCompanyJobs}
              onViewCompanyProfile={onViewCompanyProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Subcomponent: Individual Company Card
interface CompanyCardProps {
  item: {
    profile: CompanyProfile;
    openJobsCount: number;
    sampleJobs: Job[];
  };
  onSelectCompanyJobs: (companyName: string) => void;
  onViewCompanyProfile: (companyName: string) => void;
}

const CompanyCard: React.FC<CompanyCardProps> = ({
  item,
  onSelectCompanyJobs,
  onViewCompanyProfile,
}) => {
  const { profile, openJobsCount } = item;
  const initial = profile.name.trim().charAt(0).toUpperCase();

  return (
    <div className="group bg-white dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-700/80 hover:border-[#0066CC]/60 dark:hover:border-[#38BDF8]/60 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200">
      <div>
        {/* Top Header: Monogram Avatar, Company Name & Badges */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-sm shrink-0"
              style={{ backgroundColor: profile.accentColor || '#0066CC' }}
            >
              {initial}
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4
                  onClick={() => onViewCompanyProfile(profile.name)}
                  className="font-bold text-sm sm:text-base text-slate-900 dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] cursor-pointer transition-colors"
                >
                  {profile.name}
                </h4>
                {profile.verified && (
                  <span title="Verified Employer on MsmeBooks" className="inline-flex">
                    <CheckCircle2 className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8] shrink-0" />
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span className="line-clamp-1">{profile.headquarters}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Employer Type Badge */}
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 shrink-0">
            {profile.employerType}
          </span>
        </div>

        {/* Industry Sector Badge */}
        <div className="mb-2.5">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200/50 dark:border-blue-900/50">
            {profile.industry}
          </span>
        </div>

        {/* Tagline / About */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed mb-3">
          {profile.tagline || profile.about}
        </p>

        {/* Company Quick Metadata (Size, Founded) */}
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-slate-400" />
            <span>{profile.companySize}</span>
          </span>
          {profile.foundedYear && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>Est. {profile.foundedYear}</span>
            </span>
          )}
        </div>
      </div>

      {/* Footer Actions: Open Jobs Counter & CTAs */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                openJobsCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
              {openJobsCount} {openJobsCount === 1 ? 'Open Position' : 'Open Positions'}
            </span>
          </div>

          <button
            onClick={() => onViewCompanyProfile(profile.name)}
            className="text-[11px] font-bold text-[#0066CC] dark:text-[#38BDF8] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>Overview</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Action Button: View Jobs */}
        <button
          onClick={() => onSelectCompanyJobs(profile.name)}
          className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            openJobsCount > 0
              ? 'bg-[#0066CC] hover:bg-[#0052A3] text-white shadow-xs hover:shadow-sm'
              : 'bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#20325A]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>{openJobsCount > 0 ? `View All ${openJobsCount} Jobs` : 'View Company Roles'}</span>
          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
