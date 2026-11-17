import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Variants } from 'motion/react';
import {
  Job,
  CandidateApplication,
  TalentCommunityMember,
  JobAlertSubscription,
  FilterState,
  PipelineStatus,
  FilterPreset,
  PinnedFilterCombination,
} from './types/career';
import { INITIAL_JOBS, INITIAL_APPLICATIONS } from './data/initialJobs';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { JobCard } from './components/JobCard';
import { JobFilters } from './components/JobFilters';
import { JobDetailsModal } from './components/JobDetailsModal';
import { ApplicationModal } from './components/ApplicationModal';
import { WhyWorkHere } from './components/WhyWorkHere';
import { LifeAtMsmeBooks } from './components/LifeAtMsmeBooks';
import { HiringProcess } from './components/HiringProcess';
import { TalentCommunitySection } from './components/TalentCommunitySection';
import { JobAlertsSection } from './components/JobAlertsSection';
import { FaqSection } from './components/FaqSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/AdminDashboard';
import { PostJobModal } from './components/PostJobModal';
import { AiCareerAdvisorModal, NegotiationPrefillContext } from './components/AiCareerAdvisorModal';
import { SalaryTrendDiscussionMetrics } from './components/IndustrySalaryTrendD3Chart';
import { PartnerSignUpModal } from './components/PartnerSignUpModal';
import { EcosystemPartnerSection } from './components/EcosystemPartnerSection';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { PricingSection } from './components/PricingSection';
import { PricingCheckoutModal } from './components/PricingCheckoutModal';
import { CompanyProfileModal } from './components/CompanyProfileModal';
import { LeftScrollNavigator } from './components/LeftScrollNavigator';
import { SupportChatWidget } from './components/SupportChatWidget';
import { CompaniesDirectory } from './components/CompaniesDirectory';
import { IndustriesDirectory } from './components/IndustriesDirectory';
import { LocationsDirectory } from './components/LocationsDirectory';
import { JobAlertSettingsModal } from './components/JobAlertSettingsModal';
import { resolveCompanyProfile } from './data/companyProfiles';
import { useLanguage } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import { useCurrency } from './context/CurrencyContext';
import { UserRole } from './types/auth';
import { PricingPlan, BillingCycle, Currency } from './types/pricing';
import {
  LayoutGrid,
  List as ListIcon,
  SlidersHorizontal,
  Bookmark,
  X,
  Search,
  Sparkles,
  Info,
  ChevronDown,
  Plus,
  Building2,
  Bot,
  Handshake,
  Briefcase,
  Layers,
  ArrowRight,
  MapPin,
  Compass,
  Bell,
  Zap,
  BookmarkCheck,
  Trash2,
  Pin,
  PinOff,
} from 'lucide-react';

export default function App() {
  const { tr } = useLanguage();
  const {
    user,
    userApplications,
    userJobAlerts,
    userSavedJobIds,
    saveJob,
    unsaveJob,
    saveApplication,
    saveJobAlert,
  } = useAuth();
  const { convertAmount } = useCurrency();

  // 1. Persistent State
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('msmebooks_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [applications, setApplications] = useState<CandidateApplication[]>(() => {
    const saved = localStorage.getItem('msmebooks_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [talentMembers, setTalentMembers] = useState<TalentCommunityMember[]>(() => {
    const saved = localStorage.getItem('msmebooks_talent_community');
    return saved ? JSON.parse(saved) : [];
  });

  const [jobAlerts, setJobAlerts] = useState<JobAlertSubscription[]>(() => {
    const saved = localStorage.getItem('msmebooks_job_alerts');
    return saved ? JSON.parse(saved) : [];
  });

  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('msmebooks_saved_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem('msmebooks_view_mode') as 'grid' | 'list') || 'grid';
  });

  const [isAdminMode, setIsAdminMode] = useState(false);

  // 2. Modals State
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<Job | null>(null);
  const [selectedJobForApply, setSelectedJobForApply] = useState<Job | null>(null);
  const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [partnerModalRole, setPartnerModalRole] = useState<'employer' | 'candidate'>('employer');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authModalRole, setAuthModalRole] = useState<UserRole>('candidate');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PricingPlan | null>(null);
  const [checkoutCycle, setCheckoutCycle] = useState<BillingCycle>('quarterly');
  const [checkoutCurrency, setCheckoutCurrency] = useState<Currency>('USD');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedCompanyProfile, setSelectedCompanyProfile] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isJobAlertSettingsOpen, setIsJobAlertSettingsOpen] = useState(false);
  const [advisorInitialTab, setAdvisorInitialTab] = useState<'criteria' | 'chat' | 'negotiation' | 'mock-interview' | 'interview-tips' | 'interview-prep'>('criteria');
  const [negotiationPrefill, setNegotiationPrefill] = useState<NegotiationPrefillContext | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [boardTab, setBoardTab] = useState<'jobs' | 'companies' | 'industries' | 'locations'>('jobs');

  const handleOpenAuthModal = (mode: 'signin' | 'signup' = 'signin', role: UserRole = 'candidate') => {
    setAuthModalMode(mode);
    setAuthModalRole(role);
    setIsAuthModalOpen(true);
  };

  const handleSelectPlan = (plan: PricingPlan, cycle: BillingCycle, currency: Currency) => {
    setSelectedPlanForCheckout(plan);
    setCheckoutCycle(cycle);
    setCheckoutCurrency(currency);
    setIsCheckoutModalOpen(true);
  };

  const handleDiscussSalaryTrend = (job: Job, metrics: SalaryTrendDiscussionMetrics) => {
    const supportedCurrencies = ['USD', 'NGN', 'KES', 'RWF', 'ZAR', 'GHS', 'GBP', 'EUR'];
    const rawCurrency = (job.salary?.currency || 'USD').toUpperCase();
    const targetCurrency = supportedCurrencies.includes(rawCurrency) ? rawCurrency : 'USD';

    const divisor = job.salary?.period === 'year' ? 12 : 1;
    const minMonthly = Math.round((job.salary?.min || 3000) / divisor);
    const maxMonthly = Math.round((job.salary?.max || Math.max(minMonthly, 4500)) / divisor);
    const midpointMonthly = Math.round((minMonthly + maxMonthly) / 2);
    const desiredTarget = maxMonthly > midpointMonthly ? maxMonthly : Math.round(midpointMonthly * 1.15);

    const lvl = (job.experienceLevel || '').toLowerCase();
    const mappedSeniority = lvl.includes('entry') || lvl.includes('junior')
      ? 'Junior'
      : lvl.includes('mid')
      ? 'Mid-Level'
      : lvl.includes('exec') || lvl.includes('director') || lvl.includes('vp')
      ? 'Executive'
      : lvl.includes('lead') || lvl.includes('manager') || lvl.includes('principal') || lvl.includes('staff')
      ? 'Lead/Manager'
      : 'Senior';

    const locationLabel = job.location?.isRemote
      ? `Remote (${job.location.country || 'Pan-Africa'})`
      : `${job.location?.city || ''}${job.location?.city && job.location?.country ? ', ' : ''}${job.location?.country || ''}`;

    const trendSummary = `+${metrics.yoyGrowthPercent}% 12M growth · Avg $${metrics.currentAvgUSD.toLocaleString()}/mo`;

    setNegotiationPrefill({
      jobId: job.id,
      roleTitle: job.title,
      seniority: mappedSeniority,
      companyName: job.company?.name || 'MsmeBooks Technologies',
      location: locationLabel || 'Pan-Africa',
      currency: targetCurrency,
      offeredSalary: midpointMonthly,
      targetSalary: desiredTarget,
      trendSummary,
      leverageNotes: `12-Month D3 Market Trend shows +${metrics.yoyGrowthPercent}% YoY demand growth for ${job.industry || job.department} roles (benchmark avg $${metrics.currentAvgUSD.toLocaleString()}/mo, spread $${metrics.minUSD.toLocaleString()}–$${metrics.maxUSD.toLocaleString()}/mo). Core role stack: ${(job.skills || []).slice(0, 6).join(', ')}.`,
    });

    setSelectedJobForDetails(null);
    setAdvisorInitialTab('negotiation');
    setIsAiAdvisorOpen(true);
  };

  // 3. Filter State
  const initialFilterState: FilterState = {
    searchQuery: '',
    companies: [],
    industries: [],
    departments: [],
    locations: [],
    countries: [],
    states: [],
    cities: [],
    employmentTypes: [],
    workArrangements: [],
    experienceLevels: [],
    minSalary: 0,
    maxSalary: 250000,
    currency: 'ALL',
    datePosted: 'all',
    sortBy: 'newest',
    onlySaved: false,
  };

  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [similarSourceJob, setSimilarSourceJob] = useState<Job | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  // Filter Presets State
  const DEFAULT_FILTER_PRESETS: FilterPreset[] = [
    {
      id: 'preset_remote_lagos_eng',
      name: 'Remote Lagos Engineering',
      createdAt: '2026-10-25T10:00:00.000Z',
      filters: {
        ...initialFilterState,
        departments: ['Software Engineering'],
        locations: ['Nigeria'],
        countries: ['Nigeria'],
        cities: ['Lagos'],
        workArrangements: ['Remote', 'Hybrid'],
        experienceLevels: ['Senior', 'Mid-Level'],
      },
    },
    {
      id: 'preset_panafrican_fintech',
      name: 'Pan-African FinTech Leadership',
      createdAt: '2026-10-26T14:30:00.000Z',
      filters: {
        ...initialFilterState,
        industries: ['Financial Technology (FinTech)'],
        experienceLevels: ['Lead/Manager', 'Executive', 'Senior'],
        currency: 'USD',
        minSalary: 4000,
        maxSalary: 250000,
      },
    },
    {
      id: 'preset_product_design_usd',
      name: 'Mid-Level Product & Design (USD)',
      createdAt: '2026-10-28T09:15:00.000Z',
      filters: {
        ...initialFilterState,
        departments: ['Product & Design'],
        experienceLevels: ['Mid-Level'],
        currency: 'USD',
        workArrangements: ['Remote'],
      },
    },
  ];

  const [savedPresets, setSavedPresets] = useState<FilterPreset[]>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_saved_filter_presets');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_FILTER_PRESETS;
  });

  const [isPresetsDropdownOpen, setIsPresetsDropdownOpen] = useState(false);

  useEffect(() => {
    const handlePresetsUpdate = () => {
      try {
        const stored = localStorage.getItem('msmebooks_saved_filter_presets');
        if (stored) {
          setSavedPresets(JSON.parse(stored));
        }
      } catch {}
    };
    window.addEventListener('msmebooks_presets_updated', handlePresetsUpdate);
    return () => window.removeEventListener('msmebooks_presets_updated', handlePresetsUpdate);
  }, []);

  // Open shared job link (?job=id-or-slug or /careers/jobs/slug) automatically on load
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const queryJob = params.get('job');
      const pathMatch = window.location.pathname.match(/\/careers\/jobs\/([^/]+)/);
      const targetKey = queryJob || (pathMatch ? decodeURIComponent(pathMatch[1]) : null);
      if (targetKey) {
        const matched = jobs.find((j) => j.id === targetKey || j.slug === targetKey);
        if (matched) {
          setSelectedJobForDetails(matched);
        }
      }
    } catch {}
  }, []);

  const handleApplyPreset = (preset: FilterPreset) => {
    setFilters({ ...preset.filters });
    setIsPresetsDropdownOpen(false);
    scrollToJobBoard();
    showToast(`Applied preset: ${preset.name}`);
  };

  const handleDeletePreset = (e: React.MouseEvent, presetId: string) => {
    e.stopPropagation();
    const updated = savedPresets.filter((p) => p.id !== presetId);
    setSavedPresets(updated);
    try {
      localStorage.setItem('msmebooks_saved_filter_presets', JSON.stringify(updated));
      window.dispatchEvent(new Event('msmebooks_presets_updated'));
    } catch {}
    showToast('Filter preset deleted');
  };

  // Pinned Filter Combinations (persistent across search sessions)
  const DEFAULT_PINNED_COMBINATIONS: PinnedFilterCombination[] = [
    {
      id: 'pinned_remote_tech',
      label: 'Remote Engineering (Africa/Worldwide)',
      pinnedAt: '2026-10-25T10:00:00.000Z',
      filters: {
        ...initialFilterState,
        departments: ['Software Engineering'],
        workArrangements: ['Remote'],
      },
    },
    {
      id: 'pinned_lagos_senior',
      label: 'Senior Roles in Lagos, Nigeria',
      pinnedAt: '2026-10-26T12:00:00.000Z',
      filters: {
        ...initialFilterState,
        cities: ['Lagos'],
        countries: ['Nigeria'],
        locations: ['Nigeria'],
        experienceLevels: ['Senior', 'Lead/Manager'],
      },
    },
  ];

  const [pinnedCombinations, setPinnedCombinations] = useState<PinnedFilterCombination[]>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_pinned_filter_combinations');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_PINNED_COMBINATIONS;
  });

  // Pinned individual chip keys (e.g. "dept::Software Engineering", "arr::Remote")
  const [pinnedChipKeys, setPinnedChipKeys] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_pinned_chip_keys');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return ['arr::Remote'];
  });

  // Persist pinned combinations and chips
  useEffect(() => {
    localStorage.setItem('msmebooks_pinned_filter_combinations', JSON.stringify(pinnedCombinations));
  }, [pinnedCombinations]);

  useEffect(() => {
    localStorage.setItem('msmebooks_pinned_chip_keys', JSON.stringify(pinnedChipKeys));
  }, [pinnedChipKeys]);

  // Apply persistent pinned filters on initial load
  useEffect(() => {
    try {
      const stored = localStorage.getItem('msmebooks_pinned_chip_keys');
      if (stored) {
        const keys: string[] = JSON.parse(stored);
        if (Array.isArray(keys) && keys.length > 0) {
          setFilters((prev) => {
            const next = { ...prev };
            keys.forEach((key) => {
              const [type, val] = key.split('::');
              if (type === 'dept' && !next.departments.includes(val)) next.departments = [...next.departments, val];
              if (type === 'comp' && !next.companies.includes(val)) next.companies = [...next.companies, val];
              if (type === 'ind' && !(next.industries || []).includes(val)) next.industries = [...(next.industries || []), val];
              if (type === 'country' && !(next.countries || []).includes(val)) {
                next.countries = [...(next.countries || []), val];
                next.locations = [...next.locations, val];
              }
              if (type === 'state' && !(next.states || []).includes(val)) next.states = [...(next.states || []), val];
              if (type === 'city' && !(next.cities || []).includes(val)) next.cities = [...(next.cities || []), val];
              if (type === 'arr' && !next.workArrangements.includes(val as any)) next.workArrangements = [...next.workArrangements, val as any];
              if (type === 'emp' && !next.employmentTypes.includes(val as any)) next.employmentTypes = [...next.employmentTypes, val as any];
              if (type === 'exp' && !next.experienceLevels.includes(val as any)) next.experienceLevels = [...next.experienceLevels, val as any];
              if (type === 'saved') next.onlySaved = true;
            });
            return next;
          });
        }
      }
    } catch {}
  }, []);

  // Toggle pinning on a specific chip
  const handleTogglePinChip = (chipKey: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPinnedChipKeys((prev) => {
      const isPinned = prev.includes(chipKey);
      const updated = isPinned ? prev.filter((k) => k !== chipKey) : [...prev, chipKey];
      showToast(isPinned ? 'Filter unpinned' : '📌 Filter pinned to top (persists across sessions)');
      return updated;
    });
  };

  // Pin the entire active filter combination
  const handlePinCurrentCombination = () => {
    const parts: string[] = [];
    if (filters.searchQuery) parts.push(`"${filters.searchQuery}"`);
    if (filters.departments.length > 0) parts.push(filters.departments.join(', '));
    if (filters.industries && filters.industries.length > 0) parts.push(filters.industries.join(', '));
    if (filters.cities && filters.cities.length > 0) parts.push(filters.cities.join(', '));
    else if (filters.countries && filters.countries.length > 0) parts.push(filters.countries.join(', '));
    if (filters.workArrangements.length > 0) parts.push(filters.workArrangements.join('/'));
    if (filters.currency !== 'ALL' || filters.minSalary > 0) {
      parts.push(`${filters.currency} Salary`);
    }

    const label = parts.slice(0, 3).join(' • ') || 'Custom Filter Combination';

    const newCombo: PinnedFilterCombination = {
      id: `pinned_${Date.now()}`,
      label,
      filters: { ...filters },
      pinnedAt: new Date().toISOString(),
    };

    setPinnedCombinations((prev) => [newCombo, ...prev.filter((c) => c.label !== label)]);
    showToast(`📌 Pinned "${label}" to top bar (persists across sessions)!`);
  };

  const handleUnpinCombination = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setPinnedCombinations((prev) => prev.filter((c) => c.id !== id));
    showToast('Unpinned filter combination');
  };

  const handleApplyPinnedCombination = (combo: PinnedFilterCombination) => {
    setFilters({ ...combo.filters });
    showToast(`Applied pinned combination: ${combo.label}`);
  };

  const isComboActive = (combo: PinnedFilterCombination) => {
    let hasCriteria = false;
    if (combo.filters.departments.length > 0) {
      hasCriteria = true;
      if (JSON.stringify(combo.filters.departments.slice().sort()) !== JSON.stringify(filters.departments.slice().sort())) return false;
    }
    if (combo.filters.workArrangements.length > 0) {
      hasCriteria = true;
      if (JSON.stringify(combo.filters.workArrangements.slice().sort()) !== JSON.stringify(filters.workArrangements.slice().sort())) return false;
    }
    if (combo.filters.locations.length > 0) {
      hasCriteria = true;
      if (JSON.stringify(combo.filters.locations.slice().sort()) !== JSON.stringify(filters.locations.slice().sort())) return false;
    }
    if (combo.filters.companies.length > 0) {
      hasCriteria = true;
      if (JSON.stringify(combo.filters.companies.slice().sort()) !== JSON.stringify(filters.companies.slice().sort())) return false;
    }
    if (combo.filters.experienceLevels.length > 0) {
      hasCriteria = true;
      if (JSON.stringify(combo.filters.experienceLevels.slice().sort()) !== JSON.stringify(filters.experienceLevels.slice().sort())) return false;
    }
    if (combo.filters.searchQuery) {
      hasCriteria = true;
      if (combo.filters.searchQuery !== filters.searchQuery) return false;
    }
    return hasCriteria;
  };

  // Clear unpinned filters while keeping pinned ones intact
  const handleClearUnpinnedFilters = () => {
    const newFilters: FilterState = { ...initialFilterState };

    pinnedChipKeys.forEach((key) => {
      const [type, val] = key.split('::');
      if (type === 'dept') newFilters.departments = [...newFilters.departments, val];
      if (type === 'comp') newFilters.companies = [...newFilters.companies, val];
      if (type === 'ind') newFilters.industries = [...(newFilters.industries || []), val];
      if (type === 'country') {
        newFilters.countries = [...(newFilters.countries || []), val];
        newFilters.locations = [...newFilters.locations, val];
      }
      if (type === 'state') newFilters.states = [...(newFilters.states || []), val];
      if (type === 'city') newFilters.cities = [...(newFilters.cities || []), val];
      if (type === 'arr') newFilters.workArrangements = [...newFilters.workArrangements, val as any];
      if (type === 'emp') newFilters.employmentTypes = [...newFilters.employmentTypes, val as any];
      if (type === 'exp') newFilters.experienceLevels = [...newFilters.experienceLevels, val as any];
      if (type === 'saved') newFilters.onlySaved = true;
      if (type === 'salary') {
        newFilters.minSalary = filters.minSalary;
        newFilters.maxSalary = filters.maxSalary;
        newFilters.currency = filters.currency;
      }
      if (type === 'search') newFilters.searchQuery = filters.searchQuery;
    });

    setFilters(newFilters);
    showToast(
      pinnedChipKeys.length > 0
        ? 'Cleared unpinned filters. Pinned filters remain active.'
        : 'All filters reset.'
    );
  };

  const handleUnpinAllChips = () => {
    setPinnedChipKeys([]);
    showToast('Unpinned all filter chips');
  };

  const hasActiveFilterCriteria = useMemo(() => {
    return Boolean(
      similarSourceJob !== null ||
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
      filters.onlySaved ||
      filters.searchQuery.trim().length > 0 ||
      filters.minSalary > 0 ||
      (filters.maxSalary !== undefined && filters.maxSalary < 250000)
    );
  }, [filters, similarSourceJob]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('msmebooks_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('msmebooks_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('msmebooks_saved_jobs', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  useEffect(() => {
    localStorage.setItem('msmebooks_talent_community', JSON.stringify(talentMembers));
  }, [talentMembers]);

  useEffect(() => {
    localStorage.setItem('msmebooks_job_alerts', JSON.stringify(jobAlerts));
  }, [jobAlerts]);

  useEffect(() => {
    localStorage.setItem('msmebooks_view_mode', viewMode);
  }, [viewMode]);

  // Sync Firestore data from AuthContext
  useEffect(() => {
    if (userSavedJobIds && userSavedJobIds.length > 0) {
      setSavedJobIds((prev) => Array.from(new Set([...prev, ...userSavedJobIds])));
    }
  }, [userSavedJobIds]);

  useEffect(() => {
    if (userApplications && userApplications.length > 0) {
      setApplications((prev) => {
        const ids = new Set(userApplications.map((a) => a.id));
        const rest = prev.filter((a) => !ids.has(a.id));
        return [...userApplications, ...rest];
      });
    }
  }, [userApplications]);

  useEffect(() => {
    if (userJobAlerts && userJobAlerts.length > 0) {
      setJobAlerts((prev) => {
        const ids = new Set(userJobAlerts.map((a) => a.id));
        const rest = prev.filter((a) => !ids.has(a.id));
        return [...userJobAlerts, ...rest];
      });
    }
  }, [userJobAlerts]);

  // Show quick toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Bookmark Toggle
  const handleToggleSaveJob = (jobId: string) => {
    setSavedJobIds((prev) => {
      const exists = prev.includes(jobId);
      const updated = exists ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      if (exists) {
        unsaveJob(jobId);
        showToast('Removed from saved jobs');
      } else {
        saveJob(jobId);
        showToast('Job bookmarked to saved list');
      }
      return updated;
    });
  };

  const handleOpenPartnerModal = (role: 'employer' | 'candidate' = 'employer') => {
    setPartnerModalRole(role);
    setIsPartnerModalOpen(true);
  };

  const handleApplyAiFilters = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    scrollToJobBoard();
    showToast('AI career filter applied to positions');
  };

  // List of unique companies, industries, departments & locations for filter dropdowns
  const allCompanies = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.company?.name).filter(Boolean) as string[])).sort();
  }, [jobs]);

  const allIndustries = useMemo(() => {
    const set = new Set<string>();
    jobs.forEach((j) => {
      const ind = j.industry || resolveCompanyProfile(j.company?.name || '', jobs).industry;
      if (ind) set.add(ind);
    });
    return Array.from(set).sort();
  }, [jobs]);

  const allDepartments = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.department))).sort();
  }, [jobs]);

  const allLocations = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.location.country))).sort();
  }, [jobs]);

  const allCountries = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.location.country).filter(Boolean))).sort();
  }, [jobs]);

  const allStates = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.location.region).filter(Boolean) as string[])).sort();
  }, [jobs]);

  const allCities = useMemo(() => {
    return Array.from(new Set(jobs.map((j) => j.location.city).filter(Boolean))).sort();
  }, [jobs]);

  // Dynamic counts for filter facets
  const counts = useMemo(() => {
    const published = jobs.filter((j) => j.status === 'published');
    const companyCounts: Record<string, number> = {};
    const industryCounts: Record<string, number> = {};
    const deptCounts: Record<string, number> = {};
    const locCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};
    const stateCounts: Record<string, number> = {};
    const cityCounts: Record<string, number> = {};
    const arrCounts: Record<string, number> = {};
    const empCounts: Record<string, number> = {};
    const expCounts: Record<string, number> = {};

    published.forEach((j) => {
      if (j.company?.name) {
        companyCounts[j.company.name] = (companyCounts[j.company.name] || 0) + 1;
      }
      const ind = j.industry || resolveCompanyProfile(j.company?.name || '', jobs).industry;
      if (ind) {
        industryCounts[ind] = (industryCounts[ind] || 0) + 1;
      }
      deptCounts[j.department] = (deptCounts[j.department] || 0) + 1;
      locCounts[j.location.country] = (locCounts[j.location.country] || 0) + 1;
      if (j.location.country) {
        countryCounts[j.location.country] = (countryCounts[j.location.country] || 0) + 1;
      }
      if (j.location.region) {
        stateCounts[j.location.region] = (stateCounts[j.location.region] || 0) + 1;
      }
      if (j.location.city) {
        cityCounts[j.location.city] = (cityCounts[j.location.city] || 0) + 1;
      }
      arrCounts[j.workArrangement] = (arrCounts[j.workArrangement] || 0) + 1;
      empCounts[j.employmentType] = (empCounts[j.employmentType] || 0) + 1;
      expCounts[j.experienceLevel] = (expCounts[j.experienceLevel] || 0) + 1;
    });

    return {
      companyCounts,
      industryCounts,
      deptCounts,
      locCounts,
      countryCounts,
      stateCounts,
      cityCounts,
      arrCounts,
      empCounts,
      expCounts,
    };
  }, [jobs]);

  // Quick 1-click drill-downs from directories to filtered job feed
  const handleSelectCompanyJobs = (companyName: string) => {
    setFilters((prev) => ({
      ...prev,
      companies: [companyName],
    }));
    setBoardTab('jobs');
    scrollToJobBoard();
    showToast(`Showing open positions at ${companyName}`);
  };

  const handleSelectIndustry = (industryName: string) => {
    setFilters((prev) => ({
      ...prev,
      industries: [industryName],
    }));
    setBoardTab('jobs');
    scrollToJobBoard();
    showToast(`Showing open positions in ${industryName}`);
  };

  const handleSelectLocation = ({ country, state, city }: { country?: string; state?: string; city?: string }) => {
    setFilters((prev) => ({
      ...prev,
      countries: country ? [country] : [],
      states: state ? [state] : [],
      cities: city ? [city] : [],
      locations: country ? [country] : [],
    }));
    setBoardTab('jobs');
    scrollToJobBoard();
    const destination = city || state || country || 'selected location';
    showToast(`Showing open roles in ${destination}`);
  };

  const handleFindSimilarRoles = (sourceJob: Job) => {
    setSimilarSourceJob(sourceJob);
    setBoardTab('jobs');
    scrollToJobBoard();
    showToast(`Showing 3–5 roles similar to ${sourceJob.title}`);
  };

  // Filtered & Sorted Jobs
  const filteredJobs = useMemo(() => {
    if (similarSourceJob) {
      const sourceTitleWords = similarSourceJob.title
        .toLowerCase()
        .split(/[\s\-/(),]+/)
        .filter((w) => w.length > 2 && !['and', 'the', 'for', 'with'].includes(w));
      const sourceSkills = (similarSourceJob.skills || []).map((s) => s.toLowerCase());

      const rankedSimilar = jobs
        .filter((j) => j.status === 'published' && j.id !== similarSourceJob.id)
        .map((j) => {
          let simScore = 0;
          if (j.department === similarSourceJob.department) simScore += 5;
          const jTitle = j.title.toLowerCase();
          sourceTitleWords.forEach((word) => {
            if (jTitle.includes(word)) simScore += 4;
          });
          const jSkills = (j.skills || []).map((s) => s.toLowerCase());
          sourceSkills.forEach((sk) => {
            if (jSkills.some((jsk) => jsk.includes(sk) || sk.includes(jsk))) {
              simScore += 3;
            }
          });
          if (j.experienceLevel === similarSourceJob.experienceLevel) simScore += 2;
          if (j.workArrangement === similarSourceJob.workArrangement) simScore += 1;
          return { job: j, simScore };
        })
        .sort((a, b) => b.simScore - a.simScore)
        .slice(0, 4)
        .map((item) => item.job);

      return rankedSimilar;
    }

    return jobs
      .filter((j) => {
        if (j.status !== 'published') return false;

        // Keyword query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase().trim();
          const matchTitle = j.title.toLowerCase().includes(q);
          const matchCompany = j.company?.name ? j.company.name.toLowerCase().includes(q) : false;
          const matchDept = j.department.toLowerCase().includes(q);
          const matchDesc = j.shortDescription.toLowerCase().includes(q);
          const matchSkill = j.skills.some((s) => s.toLowerCase().includes(q));
          const matchCity = j.location.city.toLowerCase().includes(q);
          const matchCountry = j.location.country.toLowerCase().includes(q);
          const matchState = j.location.region ? j.location.region.toLowerCase().includes(q) : false;
          if (!matchTitle && !matchCompany && !matchDept && !matchDesc && !matchSkill && !matchCity && !matchCountry && !matchState) {
            return false;
          }
        }

        // Companies
        if (filters.companies.length > 0 && (!j.company?.name || !filters.companies.includes(j.company.name))) {
          return false;
        }

        // Industries
        if (filters.industries && filters.industries.length > 0) {
          const resolvedInd = j.industry || resolveCompanyProfile(j.company?.name || '', jobs).industry;
          if (!resolvedInd || !filters.industries.includes(resolvedInd)) {
            return false;
          }
        }

        // Departments
        if (filters.departments.length > 0 && !filters.departments.includes(j.department)) {
          return false;
        }

        // Locations: Countries, States / Regions, Cities
        if (filters.countries && filters.countries.length > 0) {
          if (!filters.countries.includes(j.location.country)) {
            return false;
          }
        } else if (filters.locations.length > 0) {
          if (!filters.locations.includes(j.location.country)) {
            return false;
          }
        }

        if (filters.states && filters.states.length > 0) {
          if (!j.location.region || !filters.states.includes(j.location.region)) {
            return false;
          }
        }

        if (filters.cities && filters.cities.length > 0) {
          if (!j.location.city || !filters.cities.includes(j.location.city)) {
            return false;
          }
        }

        // Work arrangement
        if (filters.workArrangements.length > 0 && !filters.workArrangements.includes(j.workArrangement)) {
          return false;
        }

        // Employment types
        if (filters.employmentTypes.length > 0 && !filters.employmentTypes.includes(j.employmentType)) {
          return false;
        }

        // Experience levels
        if (filters.experienceLevels.length > 0 && !filters.experienceLevels.includes(j.experienceLevel)) {
          return false;
        }

        // Only saved
        if (filters.onlySaved && !savedJobIds.includes(j.id)) {
          return false;
        }

        // Date posted
        if (filters.datePosted !== 'all') {
          const jobDate = new Date(j.datePosted).getTime();
          const now = Date.now();
          const diffHours = (now - jobDate) / (1000 * 3600);
          if (filters.datePosted === '24h' && diffHours > 24) return false;
          if (filters.datePosted === '7d' && diffHours > 24 * 7) return false;
          if (filters.datePosted === '14d' && diffHours > 24 * 14) return false;
          if (filters.datePosted === '30d' && diffHours > 24 * 30) return false;
        }

        // Salary Range & Currency Filter
        if (filters.minSalary > 0 || (filters.maxSalary !== undefined && filters.maxSalary < 250000000)) {
          const targetCurrency = filters.currency === 'ALL' ? 'USD' : filters.currency;
          const minConv = convertAmount(j.salary.min, j.salary.currency, targetCurrency as any);
          const maxConv = convertAmount(j.salary.max, j.salary.currency, targetCurrency as any);

          if (filters.minSalary > 0 && maxConv < filters.minSalary) {
            return false;
          }
          if (filters.maxSalary > 0 && minConv > filters.maxSalary) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'newest') {
          return new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime();
        }
        if (filters.sortBy === 'oldest') {
          return new Date(a.datePosted).getTime() - new Date(b.datePosted).getTime();
        }
        if (filters.sortBy === 'title_asc') {
          return a.title.localeCompare(b.title);
        }
        if (filters.sortBy === 'deadline') {
          return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
        }
        return 0;
      });
  }, [jobs, filters, savedJobIds, convertAmount, similarSourceJob]);

  const displayedJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  // Handlers for Admin actions
  const handleUpdateJob = (updatedJob: Job) => {
    setJobs((prev) => prev.map((j) => (j.id === updatedJob.id ? updatedJob : j)));
    showToast(`Vacancy ${updatedJob.title} updated`);
  };

  const handleCreateJob = (newJob: Job) => {
    setJobs((prev) => [newJob, ...prev]);
    showToast(`New position "${newJob.title}" posted successfully`);
  };

  const handleUpdateAppStatus = (appId: string, newStatus: PipelineStatus) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
    showToast(`Applicant stage transitioned to "${newStatus}"`);
  };

  const handleBulkUpdateAppStatus = (appIds: string[], newStatus: PipelineStatus) => {
    if (appIds.length === 0) return;
    const idSet = new Set(appIds);
    setApplications((prev) =>
      prev.map((a) => (idSet.has(a.id) ? { ...a, status: newStatus } : a))
    );
    showToast(`${appIds.length} applicant${appIds.length === 1 ? '' : 's'} transitioned to "${newStatus}"`);
  };

  const handleAddRecruiterNote = (appId: string, noteText: string) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? {
              ...a,
              recruiterNotes: [
                ...a.recruiterNotes,
                {
                  id: `note-${Date.now()}`,
                  author: 'MsmeBooks Talent Team',
                  date: new Date().toISOString(),
                  text: noteText,
                },
              ],
            }
          : a
      )
    );
    showToast('Recruiter note recorded');
  };

  const handleScheduleInterview = (appId: string, date: string) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, interviewDate: date, status: 'interview' } : a))
    );
    showToast('Interview invitation scheduled');
  };

  const handleRegisterTalent = (member: TalentCommunityMember) => {
    setTalentMembers((prev) => [member, ...prev]);
    showToast('Registered with MsmeBooks Talent Community!');
  };

  const handleSubscribeAlert = (sub: JobAlertSubscription) => {
    setJobAlerts((prev) => [sub, ...prev]);
    saveJobAlert(sub);
    showToast('Custom job alert saved successfully!');
  };

  const handleUnsubscribeAlert = (identifier: string) => {
    setJobAlerts((prev) =>
      prev.filter(
        (a) =>
          a.id !== identifier &&
          a.email.toLowerCase() !== identifier.toLowerCase() &&
          a.unsubscribeToken !== identifier
      )
    );
    showToast('Job alert subscription unsubscribed.');
  };

  const handleApplicationSubmit = (app: CandidateApplication) => {
    setApplications((prev) => [app, ...prev]);
    saveApplication(app);
    // increment applicantsCount for job
    setJobs((prev) =>
      prev.map((j) => (j.id === app.jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );
    showToast(`Application ${app.referenceCode} submitted successfully`);
  };

  const handleQuickApply = (job: Job) => {
    if (applications.some((a) => a.jobId === job.id)) {
      showToast(`You have already applied for ${job.title}!`);
      return;
    }

    let candidateName = user ? user.fullName : 'Alex Morgan';
    let candidateEmail = user ? user.email : 'alex.morgan@example.com';
    let candidatePhone = user?.phone || '+234 801 234 5678';
    let candidateResume = 'Alex_Morgan_Resume_Verified.pdf';

    try {
      const parsed = localStorage.getItem('msmebooks_parsed_resume');
      if (parsed) {
        const data = JSON.parse(parsed);
        if (data.firstName && data.lastName) candidateName = `${data.firstName} ${data.lastName}`;
        if (data.email) candidateEmail = data.email;
        if (data.phone) candidatePhone = data.phone;
        if (data.fileName) candidateResume = data.fileName;
      }
    } catch {}

    const nameParts = candidateName.split(' ');
    const firstName = nameParts[0] || 'Candidate';
    const lastName = nameParts.slice(1).join(' ') || 'Applicant';

    const refCode = `MSME-QUICK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: CandidateApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      department: job.department,
      firstName,
      lastName,
      email: candidateEmail,
      phone: candidatePhone,
      country: user?.country || 'Nigeria',
      city: user?.city || 'Lagos',
      yearsOfExperience: 5,
      currentJobTitle: user?.roleData.role === 'candidate' ? user.roleData.data.targetRole : 'Senior Engineer',
      earliestStartDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      resumeFileName: candidateResume,
      resumeFileSize: '2.4 MB',
      screeningAnswers: [],
      recruiterNotes: [],
      submittedAt: new Date().toISOString(),
      status: 'applied',
      referenceCode: refCode,
    };

    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    localStorage.setItem('msmebooks_applications', JSON.stringify(updatedApps));
    saveApplication(newApp);

    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, applicantsCount: j.applicantsCount + 1 } : j))
    );

    showToast(`⚡ Quick Apply submitted for ${job.title}! Ref: ${refCode}`);
  };

  const handleViewDetails = (job: Job) => {
    try {
      const viewed = JSON.parse(localStorage.getItem('msmebooks_viewed_jobs') || '[]');
      if (Array.isArray(viewed) && !viewed.includes(job.id)) {
        viewed.push(job.id);
        localStorage.setItem('msmebooks_viewed_jobs', JSON.stringify(viewed));
      }
    } catch {}
    setSelectedJobForDetails(job);
  };

  // Dynamic animation key that re-triggers staggered entrance whenever user filters change
  const filterAnimationKey = useMemo(() => {
    return [
      filters.searchQuery,
      filters.departments.join(','),
      (filters.industries || []).join(','),
      filters.companies.join(','),
      filters.locations.join(','),
      (filters.countries || []).join(','),
      (filters.states || []).join(','),
      (filters.cities || []).join(','),
      filters.workArrangements.join(','),
      filters.employmentTypes.join(','),
      filters.experienceLevels.join(','),
      filters.minSalary,
      filters.maxSalary,
      filters.currency,
      filters.datePosted,
      filters.sortBy,
      filters.onlySaved,
      visibleCount,
      filteredJobs.map((j) => j.id).slice(0, 4).join(','),
    ].join('__');
  }, [filters, visibleCount, filteredJobs]);

  // Staggered entrance animation variants for Framer Motion
  const staggerContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.055,
        delayChildren: 0.02,
      },
    },
  };

  const staggerItemVariants: Variants = {
    hidden: { opacity: 0, y: 16, scale: 0.985 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 340,
        damping: 24,
        mass: 0.8,
      },
    },
  };

  // Recommended For You Feed calculation
  const recommendedJobs = useMemo(() => {
    if (!user || user.role !== 'candidate' || user.roleData.role !== 'candidate') {
      return jobs.filter((j) => j.isFeatured).slice(0, 3);
    }
    const candidateData = user.roleData.data;
    const targetWords = (candidateData.targetRole || '').toLowerCase().split(/\s+/).filter(Boolean);
    const candidateSkills = (candidateData.skills || []).map((s: string) => s.toLowerCase());

    const scored = jobs.map((job) => {
      let score = 0;
      const titleLower = job.title.toLowerCase();
      const deptLower = job.department.toLowerCase();
      const jobSkills = job.skills.map((s) => s.toLowerCase());

      for (const w of targetWords) {
        if (titleLower.includes(w)) score += 4;
        if (deptLower.includes(w)) score += 2;
      }
      for (const s of candidateSkills) {
        if (jobSkills.includes(s)) score += 2;
      }
      if (candidateData.workArrangementPreference && job.workArrangement.toLowerCase() === candidateData.workArrangementPreference.toLowerCase()) {
        score += 2;
      }
      return { job, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const topMatches = scored.filter((s) => s.score > 0).slice(0, 3).map((s) => s.job);
    return topMatches.length > 0 ? topMatches : jobs.slice(0, 3);
  }, [jobs, user]);

  // Scroll to job board
  const scrollToJobBoard = () => {
    const el = document.getElementById('job-board');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If Admin Mode is active, render the dedicated Recruitment Administration Dashboard
  if (isAdminMode) {
    return (
      <AdminDashboard
        jobs={jobs}
        applications={applications}
        talentMembers={talentMembers}
        jobAlerts={jobAlerts}
        onUpdateJob={handleUpdateJob}
        onCreateJob={handleCreateJob}
        onUpdateApplicationStatus={handleUpdateAppStatus}
        onBulkUpdateApplicationStatus={handleBulkUpdateAppStatus}
        onAddRecruiterNote={handleAddRecruiterNote}
        onScheduleInterview={handleScheduleInterview}
        onExitAdmin={() => setIsAdminMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] dark:bg-[#0B132B] text-[#14243A] dark:text-slate-100 flex flex-col antialiased selection:bg-[#0066CC] selection:text-white transition-colors duration-200">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#14243A] dark:bg-[#131D35] text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 dark:border-slate-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#B5E61D]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Sticky Navigation Bar */}
      <Navbar
        isAdminMode={isAdminMode}
        onToggleAdmin={() => setIsAdminMode(true)}
        onExplorePositions={scrollToJobBoard}
        onOpenPostJob={() => setIsPostJobModalOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        onOpenPartnerModal={(role) => handleOpenAuthModal('signup', role === 'employer' ? 'employer' : 'candidate')}
        onOpenAuthModal={(mode, role) => handleOpenAuthModal(mode, role)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        savedJobsCount={savedJobIds.length}
        onOpenSavedJobs={() => {
          setFilters((prev) => ({ ...prev, onlySaved: !prev.onlySaved }));
          scrollToJobBoard();
        }}
        activeSection="careers"
        onShowToast={showToast}
      />

      {/* 2. Hero Section */}
      <Hero
        searchQuery={filters.searchQuery}
        onSearchQueryChange={(q) => setFilters((prev) => ({ ...prev, searchQuery: q }))}
        selectedDepartment={filters.departments[0] || 'ALL'}
        onDepartmentChange={(dept) =>
          setFilters((prev) => ({
            ...prev,
            departments: dept === 'ALL' ? [] : [dept],
          }))
        }
        selectedLocation={filters.locations[0] || 'ALL'}
        onLocationChange={(loc) =>
          setFilters((prev) => ({
            ...prev,
            locations: loc === 'ALL' ? [] : [loc],
          }))
        }
        onSearchSubmit={scrollToJobBoard}
        onExploreClick={scrollToJobBoard}
        onOpenPostJob={() => setIsPostJobModalOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        onOpenPartnerModal={(role) => handleOpenAuthModal('signup', role === 'employer' ? 'employer' : 'candidate')}
        onOpenAuthModal={(mode, role) => handleOpenAuthModal(mode, role)}
        onBrowseCompanies={() => {
          setBoardTab('companies');
          scrollToJobBoard();
        }}
        onBrowseIndustries={() => {
          setBoardTab('industries');
          scrollToJobBoard();
        }}
        departments={allDepartments}
        locations={allLocations}
      />

      {/* 3. Dedicated Job Board Section */}
      <section id="job-board" className="py-16 bg-[#F7F9FC] dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] mb-2">
                <span className="w-2 h-2 rounded-full bg-[#B5E61D]" />
                <span>{tr.jobs.openOpportunities}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14243A] dark:text-white tracking-tight">
                {tr.jobs.discoverNext}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-2 font-normal">
                {tr.jobs.discoverDesc}
              </p>
            </div>

            {/* Live Counter & Post a Job Action */}
            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsPostJobModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#B5E61D] hover:bg-[#a2d114] active:bg-[#91bb12] text-[#14243A] rounded-xl shadow-xs text-xs font-bold transition-all hover:shadow-sm cursor-pointer"
                  title="Post a job opening as a Company or Individual"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{tr.hero.postJobOpening}</span>
                </button>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700/80 rounded-xl shadow-xs text-xs font-bold text-[#14243A] dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-mono tabular-nums text-[#0066CC] dark:text-[#38BDF8]">{filteredJobs.length}</span>
                  <span>{tr.hero.activePositions}</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Open for verified companies & individuals · Managed via MsmeBooks HR</span>
              </div>
            </div>
          </div>

          {/* AI Career Advisor Spotlight Card */}
          <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-[#14243A] via-indigo-950 to-[#0066CC] dark:from-[#091122] dark:via-[#131E3D] dark:to-[#0A4585] rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 border border-indigo-400/20">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-indigo-500/30 border border-indigo-400/30 flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-[#B5E61D]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-[#B5E61D] uppercase tracking-wider">AI Career Advisor & Matcher</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    Powered by Gemini AI
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-200 mt-0.5">
                  Unsure which role matches your skills, salary target, or remote preference? Chat with our AI advisor for instant personalized role recommendations.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsAiAdvisorOpen(true)}
              className="px-4.5 py-2.5 bg-[#B5E61D] hover:bg-[#a2d114] text-[#14243A] font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 shrink-0 hover:shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#14243A]" />
              <span>Launch AI Advisor</span>
            </button>
          </div>

          {/* Segmented View Switcher: All Open Jobs vs Browse Companies (A-Z) vs Browse by Industry */}
          <div className="flex items-center gap-1.5 sm:gap-2 mb-6 p-1.5 bg-slate-200/80 dark:bg-[#1A284A] rounded-2xl w-full sm:w-auto overflow-x-auto border border-slate-300/60 dark:border-slate-700/80">
            <button
              onClick={() => setBoardTab('jobs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                boardTab === 'jobs'
                  ? 'bg-white dark:bg-[#0066CC] text-[#0066CC] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>All Open Jobs</span>
              <span className="px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-900/60 text-[#0066CC] dark:text-[#38BDF8] text-[10px] font-mono">
                {filteredJobs.length}
              </span>
            </button>

            <button
              onClick={() => setBoardTab('companies')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                boardTab === 'companies'
                  ? 'bg-white dark:bg-[#0066CC] text-[#0066CC] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Browse Companies (A–Z)</span>
              <span className="px-1.5 py-0.2 rounded-md bg-[#B5E61D]/20 text-emerald-800 dark:text-[#B5E61D] text-[10px] font-mono">
                {allCompanies.length}
              </span>
            </button>

            <button
              onClick={() => setBoardTab('industries')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                boardTab === 'industries'
                  ? 'bg-white dark:bg-[#0066CC] text-[#0066CC] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Browse by Industry</span>
              <span className="px-1.5 py-0.2 rounded-md bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-[10px] font-mono">
                {allIndustries.length}
              </span>
            </button>

            <button
              onClick={() => setBoardTab('locations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                boardTab === 'locations'
                  ? 'bg-white dark:bg-[#0066CC] text-[#0066CC] dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>Browse by Location (Country & City)</span>
              <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono">
                {allCountries.length}
              </span>
            </button>
          </div>

          {/* Conditional View: Companies Directory (A-Z) */}
          {boardTab === 'companies' && (
            <CompaniesDirectory
              jobs={jobs}
              onSelectCompanyJobs={handleSelectCompanyJobs}
              onViewCompanyProfile={(cName) => setSelectedCompanyProfile(cName)}
            />
          )}

          {/* Conditional View: Industries & Sectors Directory */}
          {boardTab === 'industries' && (
            <IndustriesDirectory
              jobs={jobs}
              selectedIndustry={filters.industries?.[0] || null}
              onSelectIndustry={handleSelectIndustry}
            />
          )}

          {/* Conditional View: Locations (Country & City) Directory */}
          {boardTab === 'locations' && (
            <LocationsDirectory
              jobs={jobs}
              selectedCountry={filters.countries?.[0] || null}
              selectedCity={filters.cities?.[0] || null}
              onSelectLocation={handleSelectLocation}
            />
          )}

          {/* Conditional View: Standard Jobs Feed */}
          {boardTab === 'jobs' && (
            <>
              {/* Controls Bar: Search, View Mode Toggle, Sort, Mobile Filter Button */}
              <div className="bg-white dark:bg-[#131D35] p-3.5 sm:p-4 rounded-xl border border-slate-200/90 dark:border-slate-700/80 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3 transition-colors duration-200">
                {/* Search Input */}
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                    placeholder="Filter by keyword, skill, title, or location..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#1A284A] text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#1A284A] focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>

                {/* Create Alert for this search Button (Prompt 11) */}
                <button
                  type="button"
                  onClick={() => setIsJobAlertSettingsOpen(true)}
                  className="px-3 py-1.5 bg-[#0066CC]/10 dark:bg-[#38BDF8]/15 hover:bg-[#0066CC]/20 text-[#0066CC] dark:text-[#38BDF8] text-xs font-bold rounded-lg border border-[#0066CC]/20 dark:border-[#38BDF8]/30 flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-2xs"
                  title="Subscribe to automated alerts matching this search"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Create Alert for this search</span>
                  <span className="sm:hidden">Create Alert</span>
                </button>

                {/* Right Controls */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#1A284A] hover:bg-slate-200 dark:hover:bg-[#20325A] rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Filters</span>
                  </button>

                  {/* Saved Jobs Toggle */}
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, onlySaved: !prev.onlySaved }))}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                      filters.onlySaved
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border-[#0066CC] dark:border-[#38BDF8]'
                        : 'bg-white dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#20325A]'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${filters.onlySaved ? 'fill-current' : ''}`} />
                    <span>Saved ({savedJobIds.length})</span>
                  </button>

                  {/* Saved Presets Dropdown (Prompt 8 & 3) */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsPresetsDropdownOpen(!isPresetsDropdownOpen)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                        isPresetsDropdownOpen
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border-[#0066CC] dark:border-[#38BDF8]'
                          : 'bg-white dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#20325A]'
                      }`}
                      title="Quickly switch between your saved filter presets"
                    >
                      <BookmarkCheck className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                      <span>Saved Presets ({savedPresets.length})</span>
                      <ChevronDown className="w-3 h-3 ml-0.5 text-slate-400" />
                    </button>

                    {isPresetsDropdownOpen && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#131D35] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700/80 p-2 z-30 animate-in fade-in">
                        <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Saved Presets
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                            {savedPresets.length} stored
                          </span>
                        </div>

                        <div className="py-1 max-h-56 overflow-y-auto space-y-1">
                          {savedPresets.length === 0 ? (
                            <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center italic">
                              No presets saved yet.
                            </p>
                          ) : (
                            savedPresets.map((preset) => (
                              <div
                                key={preset.id}
                                onClick={() => handleApplyPreset(preset)}
                                className="group flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-[#1A284A] text-xs cursor-pointer transition-colors"
                              >
                                <div className="min-w-0 pr-2">
                                  <div className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] truncate">
                                    {preset.name}
                                  </div>
                                  <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                                    {preset.filters.departments[0] || preset.filters.locations[0] || 'Custom filters'}
                                    {preset.filters.currency !== 'ALL' ? ` · ${preset.filters.currency}` : ''}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  <span className="text-[10px] font-bold text-[#0066CC] dark:text-[#38BDF8] opacity-0 group-hover:opacity-100 transition-opacity">
                                    Apply
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleDeletePreset(e, preset.id)}
                                    className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded transition-colors"
                                    title="Delete preset"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 px-2 py-1 text-[10px] text-slate-400 flex items-center justify-between">
                          <span>Tip: Save new in filter sidebar</span>
                          <button
                            type="button"
                            onClick={() => setIsPresetsDropdownOpen(false)}
                            className="text-[#0066CC] dark:text-[#38BDF8] font-bold hover:underline cursor-pointer"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative flex items-center">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }))}
                      className="pl-3 pr-7 py-1.5 text-xs font-medium bg-slate-50 dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 outline-none appearance-none cursor-pointer"
                    >
                      <option value="newest">Sort: Newest</option>
                      <option value="oldest">Sort: Oldest</option>
                      <option value="title_asc">Sort: Title A–Z</option>
                      <option value="deadline">Sort: Closing Soon</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2 pointer-events-none" />
                  </div>

                  {/* List / Grid View Toggle */}
                  <div className="flex items-center p-0.5 bg-slate-100 dark:bg-[#1A284A] rounded-lg border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-md transition-all cursor-pointer ${
                        viewMode === 'grid'
                          ? 'bg-white dark:bg-[#0066CC] text-[#0066CC] dark:text-white shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="Grid View"
                      aria-label="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded-md transition-all cursor-pointer ${
                        viewMode === 'list'
                          ? 'bg-white dark:bg-[#0066CC] text-[#0066CC] dark:text-white shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                      title="List View"
                      aria-label="List View"
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Pinned Filter Combinations Top Bar (Persistent Across Sessions) */}
              {pinnedCombinations.length > 0 && (
                <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 dark:border-amber-500/30 backdrop-blur-xs animate-in fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-400">
                        <Pin className="w-3.5 h-3.5 fill-amber-500" />
                      </div>
                      <span className="text-xs font-bold text-amber-950 dark:text-amber-200 uppercase tracking-wider">
                        Pinned Combinations
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded-full bg-amber-200/70 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 font-semibold">
                        {pinnedCombinations.length}
                      </span>
                      <span className="hidden sm:inline text-[11px] text-slate-500 dark:text-slate-400">
                        • Persistent across search sessions
                      </span>
                    </div>

                    {hasActiveFilterCriteria && (
                      <button
                        onClick={handlePinCurrentCombination}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-500 hover:bg-amber-600 text-white transition-colors shadow-xs cursor-pointer"
                        title="Pin current active search & filters to this top bar"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                        <span>Pin Current Combination</span>
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {pinnedCombinations.map((combo) => {
                      const active = isComboActive(combo);
                      return (
                        <div
                          key={combo.id}
                          onClick={() => handleApplyPinnedCombination(combo)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              handleApplyPinnedCombination(combo);
                            }
                          }}
                          className={`group inline-flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-lg border text-xs transition-all cursor-pointer select-none ${
                            active
                              ? 'bg-amber-100 dark:bg-amber-950/80 border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-100 ring-2 ring-amber-400/40 shadow-xs'
                              : 'bg-white dark:bg-[#131D35] border-amber-200/80 dark:border-amber-900/50 text-slate-700 dark:text-slate-200 hover:border-amber-400 hover:bg-amber-50/70 dark:hover:bg-amber-950/40'
                          }`}
                          title={`Click to apply: ${combo.label}`}
                        >
                          <div className="flex items-center gap-1.5 font-medium">
                            <Pin className={`w-3.5 h-3.5 fill-current text-amber-600 dark:text-amber-400 shrink-0 ${active ? 'animate-pulse' : ''}`} />
                            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[180px] sm:max-w-xs">
                              {combo.label}
                            </span>
                            {active && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-white uppercase tracking-wider">
                                Active
                              </span>
                            )}
                          </div>
                          <button
                            onClick={(e) => handleUnpinCombination(combo.id, e)}
                            title="Unpin this combination"
                            className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
                          >
                            <PinOff className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Active Filter Chips Bar with Individual Pinning to Top */}
              {(hasActiveFilterCriteria || pinnedChipKeys.length > 0) && (
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs animate-in fade-in p-3 rounded-xl bg-slate-50 dark:bg-[#131D35]/70 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold mr-1">
                    <span>Active filters:</span>
                    {pinnedChipKeys.length > 0 && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold">
                        <Pin className="w-2.5 h-2.5 fill-amber-500 text-amber-600 dark:text-amber-400" />
                        {pinnedChipKeys.length} pinned
                      </span>
                    )}
                  </div>

                  {/* Similar Roles Preset Chip */}
                  {similarSourceJob && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold border bg-blue-50 dark:bg-blue-950/70 border-[#0066CC]/40 dark:border-[#38BDF8]/40 text-[#0066CC] dark:text-[#38BDF8]">
                      <Sparkles className="w-3 h-3" />
                      <span>Similar to: &ldquo;{similarSourceJob.title}&rdquo;</span>
                      <button
                        onClick={() => setSimilarSourceJob(null)}
                        title="Clear similar roles filter"
                        className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Search Query Chip */}
                  {filters.searchQuery && (() => {
                    const chipKey = `search::${filters.searchQuery}`;
                    const isPinned = pinnedChipKeys.includes(chipKey);
                    return (
                      <span
                        key={chipKey}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-medium border ${
                          isPinned
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/40 shadow-xs'
                            : 'bg-white dark:bg-[#131D35] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <Search className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                        <span>Search: "{filters.searchQuery}"</span>
                        <button
                          onClick={(e) => handleTogglePinChip(chipKey, e)}
                          title={isPinned ? 'Pinned to top • Click to unpin' : 'Pin search filter to top'}
                          className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 dark:text-amber-400 fill-amber-500' : 'text-slate-400 hover:text-amber-500'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setFilters((p) => ({ ...p, searchQuery: '' }));
                            setPinnedChipKeys((p) => p.filter((k) => k !== chipKey));
                          }}
                          title="Remove search filter"
                        >
                          <X className="w-3 h-3 text-slate-400 hover:text-slate-700 dark:hover:text-white" />
                        </button>
                      </span>
                    );
                  })()}

                  {/* Companies Chips */}
                  {filters.companies.map((company) => {
                    const chipKey = `comp::${company}`;
                    const isPinned = pinnedChipKeys.includes(chipKey);
                    return (
                      <span
                        key={chipKey}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold border ${
                          isPinned
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/40 shadow-xs'
                            : 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>{company}</span>
                        <button
                          onClick={(e) => handleTogglePinChip(chipKey, e)}
                          title={isPinned ? 'Pinned to top • Click to unpin' : 'Pin company filter to top'}
                          className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 dark:text-amber-400 fill-amber-500' : 'text-indigo-400 hover:text-amber-500'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setFilters((p) => ({
                              ...p,
                              companies: p.companies.filter((c) => c !== company),
                            }));
                            setPinnedChipKeys((p) => p.filter((k) => k !== chipKey));
                          }}
                          title="Remove company filter"
                        >
                          <X className="w-3 h-3 text-indigo-500 hover:text-indigo-800 dark:hover:text-white" />
                        </button>
                      </span>
                    );
                  })}

                  {/* Industries Chips */}
                  {filters.industries && filters.industries.map((ind) => {
                    const chipKey = `ind::${ind}`;
                    const isPinned = pinnedChipKeys.includes(chipKey);
                    return (
                      <span
                        key={chipKey}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold border ${
                          isPinned
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/40 shadow-xs'
                            : 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300'
                        }`}
                      >
                        <Layers className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span>{ind}</span>
                        <button
                          onClick={(e) => handleTogglePinChip(chipKey, e)}
                          title={isPinned ? 'Pinned to top • Click to unpin' : 'Pin industry filter to top'}
                          className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 dark:text-amber-400 fill-amber-500' : 'text-purple-400 hover:text-amber-500'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setFilters((p) => ({
                              ...p,
                              industries: (p.industries || []).filter((i) => i !== ind),
                            }));
                            setPinnedChipKeys((p) => p.filter((k) => k !== chipKey));
                          }}
                          title="Remove industry filter"
                        >
                          <X className="w-3 h-3 text-purple-500 hover:text-purple-800 dark:hover:text-white" />
                        </button>
                      </span>
                    );
                  })}

                  {/* Countries Chips */}
                  {filters.countries && filters.countries.map((c) => {
                    const chipKey = `country::${c}`;
                    const isPinned = pinnedChipKeys.includes(chipKey);
                    return (
                      <span
                        key={chipKey}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold border ${
                          isPinned
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/40 shadow-xs'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>Country: {c}</span>
                        <button
                          onClick={(e) => handleTogglePinChip(chipKey, e)}
                          title={isPinned ? 'Pinned to top • Click to unpin' : 'Pin country filter to top'}
                          className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 dark:text-amber-400 fill-amber-500' : 'text-emerald-500 hover:text-amber-500'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setFilters((p) => ({
                              ...p,
                              countries: (p.countries || []).filter((x) => x !== c),
                              locations: (p.locations || []).filter((x) => x !== c),
                            }));
                            setPinnedChipKeys((p) => p.filter((k) => k !== chipKey));
                          }}
                          title="Remove country filter"
                        >
                          <X className="w-3 h-3 text-emerald-600 hover:text-emerald-800 dark:hover:text-white" />
                        </button>
                      </span>
                    );
                  })}

                  {/* States / Provinces */}
                  {filters.states && filters.states.map((st) => {
                    const chipKey = `state::${st}`;
                    const isPinned = pinnedChipKeys.includes(chipKey);
                    return (
                      <span
                        key={chipKey}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold border ${
                          isPinned
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/40 shadow-xs'
                            : 'bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                        <span>State: {st}</span>
                        <button
                          onClick={(e) => handleTogglePinChip(chipKey, e)}
                          title={isPinned ? 'Pinned to top • Click to unpin' : 'Pin state filter to top'}
                          className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 dark:text-amber-400 fill-amber-500' : 'text-teal-500 hover:text-amber-500'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setFilters((p) => ({
                              ...p,
                              states: (p.states || []).filter((x) => x !== st),
                            }));
                            setPinnedChipKeys((p) => p.filter((k) => k !== chipKey));
                          }}
                          title="Remove state filter"
                        >
                          <X className="w-3 h-3 text-teal-600 hover:text-teal-800 dark:hover:text-white" />
                        </button>
                      </span>
                    );
                  })}

                  {/* Cities */}
                  {filters.cities && filters.cities.map((ct) => {
                    const chipKey = `city::${ct}`;
                    const isPinned = pinnedChipKeys.includes(chipKey);
                    return (
                      <span
                        key={chipKey}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold border ${
                          isPinned
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/40 shadow-xs'
                            : 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span>City: {ct}</span>
                        <button
                          onClick={(e) => handleTogglePinChip(chipKey, e)}
                          title={isPinned ? 'Pinned to top • Click to unpin' : 'Pin city filter to top'}
                          className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 dark:text-amber-400 fill-amber-500' : 'text-cyan-500 hover:text-amber-500'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setFilters((p) => ({
                              ...p,
                              cities: (p.cities || []).filter((x) => x !== ct),
                            }));
                            setPinnedChipKeys((p) => p.filter((k) => k !== chipKey));
                          }}
                          title="Remove city filter"
                        >
                          <X className="w-3 h-3 text-cyan-600 hover:text-cyan-800 dark:hover:text-white" />
                        </button>
                      </span>
                    );
                  })}

                  {/* Departments */}
                  {filters.departments.map((dept) => {
                    const chipKey = `dept::${dept}`;
                    const isPinned = pinnedChipKeys.includes(chipKey);
                    return (
                      <span
                        key={chipKey}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold border ${
                          isPinned
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/40 shadow-xs'
                            : 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-[#0066CC] dark:text-[#38BDF8]'
                        }`}
                      >
                        <Briefcase className="w-3 h-3" />
                        <span>{dept}</span>
                        <button
                          onClick={(e) => handleTogglePinChip(chipKey, e)}
                          title={isPinned ? 'Pinned to top • Click to unpin' : 'Pin department filter to top'}
                          className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 dark:text-amber-400 fill-amber-500' : 'text-[#0066CC]/60 hover:text-amber-500'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setFilters((p) => ({
                              ...p,
                              departments: p.departments.filter((d) => d !== dept),
                            }));
                            setPinnedChipKeys((p) => p.filter((k) => k !== chipKey));
                          }}
                          title="Remove department filter"
                        >
                          <X className="w-3 h-3 text-[#0066CC]/70 hover:text-[#0066CC] dark:hover:text-[#38BDF8]" />
                        </button>
                      </span>
                    );
                  })}

                  {/* Generic Locations */}
                  {filters.locations.filter((loc) => !(filters.countries || []).includes(loc)).map((loc) => {
                    const chipKey = `loc::${loc}`;
                    const isPinned = pinnedChipKeys.includes(chipKey);
                    return (
                      <span
                        key={chipKey}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all border ${
                          isPinned
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/40 shadow-xs font-semibold'
                            : 'bg-slate-100 dark:bg-[#1A284A] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <MapPin className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                        <span>{loc}</span>
                        <button
                          onClick={(e) => handleTogglePinChip(chipKey, e)}
                          title={isPinned ? 'Pinned to top • Click to unpin' : 'Pin location filter to top'}
                          className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 dark:text-amber-400 fill-amber-500' : 'text-slate-400 hover:text-amber-500'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setFilters((p) => ({
                              ...p,
                              locations: p.locations.filter((l) => l !== loc),
                            }));
                            setPinnedChipKeys((p) => p.filter((k) => k !== chipKey));
                          }}
                          title="Remove location filter"
                        >
                          <X className="w-3 h-3 text-slate-400 hover:text-slate-700 dark:hover:text-white" />
                        </button>
                      </span>
                    );
                  })}

                  {/* Work Arrangements */}
                  {filters.workArrangements.map((arr) => {
                    const chipKey = `arr::${arr}`;
                    const isPinned = pinnedChipKeys.includes(chipKey);
                    return (
                      <span
                        key={chipKey}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold border ${
                          isPinned
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/40 shadow-xs'
                            : 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300'
                        }`}
                      >
                        <span>{arr}</span>
                        <button
                          onClick={(e) => handleTogglePinChip(chipKey, e)}
                          title={isPinned ? 'Pinned to top • Click to unpin' : 'Pin work arrangement to top'}
                          className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 dark:text-amber-400 fill-amber-500' : 'text-sky-400 hover:text-amber-500'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setFilters((p) => ({
                              ...p,
                              workArrangements: p.workArrangements.filter((a) => a !== arr),
                            }));
                            setPinnedChipKeys((p) => p.filter((k) => k !== chipKey));
                          }}
                          title="Remove work arrangement filter"
                        >
                          <X className="w-3 h-3 text-sky-500 hover:text-sky-800 dark:hover:text-white" />
                        </button>
                      </span>
                    );
                  })}

                  {/* Employment Types */}
                  {filters.employmentTypes && filters.employmentTypes.map((emp) => {
                    const chipKey = `emp::${emp}`;
                    const isPinned = pinnedChipKeys.includes(chipKey);
                    return (
                      <span
                        key={chipKey}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold border ${
                          isPinned
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/40 shadow-xs'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        <span>{emp}</span>
                        <button
                          onClick={(e) => handleTogglePinChip(chipKey, e)}
                          title={isPinned ? 'Pinned to top • Click to unpin' : 'Pin employment type to top'}
                          className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 dark:text-amber-400 fill-amber-500' : 'text-emerald-500 hover:text-amber-500'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setFilters((p) => ({
                              ...p,
                              employmentTypes: p.employmentTypes.filter((e) => e !== emp),
                            }));
                            setPinnedChipKeys((p) => p.filter((k) => k !== chipKey));
                          }}
                          title="Remove employment type filter"
                        >
                          <X className="w-3 h-3 text-emerald-600 hover:text-emerald-800 dark:hover:text-white" />
                        </button>
                      </span>
                    );
                  })}

                  {/* Experience Levels */}
                  {filters.experienceLevels && filters.experienceLevels.map((exp) => {
                    const chipKey = `exp::${exp}`;
                    const isPinned = pinnedChipKeys.includes(chipKey);
                    return (
                      <span
                        key={chipKey}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold border ${
                          isPinned
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/40 shadow-xs'
                            : 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        <span>Exp: {exp}</span>
                        <button
                          onClick={(e) => handleTogglePinChip(chipKey, e)}
                          title={isPinned ? 'Pinned to top • Click to unpin' : 'Pin experience level to top'}
                          className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 dark:text-amber-400 fill-amber-500' : 'text-amber-500 hover:text-amber-700'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setFilters((p) => ({
                              ...p,
                              experienceLevels: p.experienceLevels.filter((e) => e !== exp),
                            }));
                            setPinnedChipKeys((p) => p.filter((k) => k !== chipKey));
                          }}
                          title="Remove experience level filter"
                        >
                          <X className="w-3 h-3 text-amber-600 hover:text-amber-800 dark:hover:text-white" />
                        </button>
                      </span>
                    );
                  })}

                  {/* Salary Filter Chip */}
                  {(filters.minSalary > 0 || (filters.maxSalary !== undefined && filters.maxSalary < 250000)) && (() => {
                    const chipKey = `salary::${filters.currency}-${filters.minSalary}-${filters.maxSalary || 'max'}`;
                    const isPinned = pinnedChipKeys.includes(chipKey);
                    return (
                      <span
                        key={chipKey}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold border ${
                          isPinned
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/40 shadow-xs'
                            : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        }`}
                      >
                        <span>
                          Salary: {filters.currency !== 'ALL' ? filters.currency : ''} {filters.minSalary.toLocaleString()} - {filters.maxSalary && filters.maxSalary < 250000 ? filters.maxSalary.toLocaleString() : 'Any'}
                        </span>
                        <button
                          onClick={(e) => handleTogglePinChip(chipKey, e)}
                          title={isPinned ? 'Pinned to top • Click to unpin' : 'Pin salary filter to top'}
                          className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 dark:text-amber-400 fill-amber-500' : 'text-emerald-500 hover:text-amber-500'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setFilters((p) => ({ ...p, minSalary: 0, maxSalary: 250000 }));
                            setPinnedChipKeys((p) => p.filter((k) => k !== chipKey));
                          }}
                          title="Remove salary filter"
                        >
                          <X className="w-3 h-3 text-emerald-600 hover:text-emerald-800 dark:hover:text-white" />
                        </button>
                      </span>
                    );
                  })()}

                  {/* Saved Bookmarks Only Chip */}
                  {filters.onlySaved && (() => {
                    const chipKey = 'saved::true';
                    const isPinned = pinnedChipKeys.includes(chipKey);
                    return (
                      <span
                        key={chipKey}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all font-semibold border ${
                          isPinned
                            ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-200 ring-1 ring-amber-400/40 shadow-xs'
                            : 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-[#0066CC] dark:text-[#38BDF8]'
                        }`}
                      >
                        <Bookmark className="w-3 h-3 fill-current" />
                        <span>{tr.filters.savedBookmarks}</span>
                        <button
                          onClick={(e) => handleTogglePinChip(chipKey, e)}
                          title={isPinned ? 'Pinned to top • Click to unpin' : 'Pin saved bookmarks filter to top'}
                          className="p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        >
                          <Pin className={`w-3 h-3 ${isPinned ? 'text-amber-600 dark:text-amber-400 fill-amber-500' : 'text-[#0066CC]/60 hover:text-amber-500'}`} />
                        </button>
                        <button
                          onClick={() => {
                            setFilters((p) => ({ ...p, onlySaved: false }));
                            setPinnedChipKeys((p) => p.filter((k) => k !== chipKey));
                          }}
                          title="Remove bookmarks filter"
                        >
                          <X className="w-3 h-3 text-[#0066CC]/70 hover:text-[#0066CC] dark:hover:text-[#38BDF8]" />
                        </button>
                      </span>
                    );
                  })()}

                  {/* Actions: Pin Current Combination, Clear unpinned, Unpin all, Clear all */}
                  <div className="flex items-center gap-3 ml-auto shrink-0 pt-1 sm:pt-0">
                    {hasActiveFilterCriteria && (
                      <button
                        onClick={handlePinCurrentCombination}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/80 dark:hover:bg-amber-900 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 transition-colors cursor-pointer"
                        title="Pin this filter combination as a persistent preset across search sessions"
                      >
                        <Pin className="w-2.5 h-2.5 fill-amber-500 text-amber-600 dark:text-amber-400" />
                        <span>Pin Combination</span>
                      </button>
                    )}

                    {pinnedChipKeys.length > 0 && (
                      <>
                        <button
                          onClick={handleClearUnpinnedFilters}
                          className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline cursor-pointer"
                          title="Clear all non-pinned filters while keeping pinned ones locked"
                        >
                          Clear unpinned
                        </button>
                        <button
                          onClick={handleUnpinAllChips}
                          className="text-xs text-amber-700 dark:text-amber-400 hover:underline cursor-pointer"
                          title="Unpin all criteria"
                        >
                          Unpin all
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        setFilters(initialFilterState);
                        setSimilarSourceJob(null);
                        setPinnedChipKeys([]);
                      }}
                      className="text-xs font-semibold text-[#0066CC] dark:text-[#38BDF8] hover:underline cursor-pointer"
                    >
                      {tr.filters.clearAll}
                    </button>
                  </div>
                </div>
              )}

              {/* Main Layout: Sticky Sidebar (Desktop) + Jobs Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Desktop Left Sidebar Filters with Smooth Scroll Up/Down Capabilities */}
                <div className="hidden lg:block lg:col-span-3 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700/80 pr-1 overscroll-contain">
                  <JobFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onResetFilters={() => setFilters(initialFilterState)}
                    companies={allCompanies}
                    industries={allIndustries}
                    countries={allCountries}
                    states={allStates}
                    cities={allCities}
                    companyCounts={counts.companyCounts}
                    industryCounts={counts.industryCounts}
                    departmentCounts={counts.deptCounts}
                    locationCounts={counts.locCounts}
                    countryCounts={counts.countryCounts}
                    stateCounts={counts.stateCounts}
                    cityCounts={counts.cityCounts}
                    arrangementCounts={counts.arrCounts}
                    employmentTypeCounts={counts.empCounts}
                    experienceCounts={counts.expCounts}
                    totalMatches={filteredJobs.length}
                    onSavePreset={(newPreset) =>
                      setSavedPresets((prev) => [newPreset, ...prev.filter((p) => p.id !== newPreset.id)])
                    }
                  />
                </div>

                {/* Jobs Display Grid / List */}
                <div className="lg:col-span-9">
                  {/* Recommended For You Section (Prompt 12) */}
                  {recommendedJobs.length > 0 && !filters.searchQuery && !filters.onlySaved && (
                    <div className="mb-6 p-4 sm:p-5 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/60 dark:from-indigo-950/40 dark:via-[#131D35] dark:to-blue-950/30 rounded-2xl border border-indigo-200/80 dark:border-indigo-800/60 shadow-xs space-y-3.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                            <Sparkles className="w-3.5 h-3.5 text-[#B5E61D]" />
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                              <span>Recommended For You</span>
                              <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold uppercase">
                                Profile Matched
                              </span>
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              High-match opportunities personalized to your target role, experience, and verified skillset.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {recommendedJobs.map((recJob) => (
                          <div
                            key={`rec-${recJob.id}`}
                            onClick={() => handleViewDetails(recJob)}
                            className="p-3.5 bg-white dark:bg-[#0D1527] rounded-xl border border-indigo-100 dark:border-indigo-900/50 hover:border-[#0066CC] shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between text-[11px] text-[#0066CC] dark:text-[#38BDF8] font-bold mb-1">
                                <span>{recJob.department}</span>
                                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-semibold">95% Match</span>
                              </div>
                              <h5 className="font-bold text-slate-900 dark:text-white text-xs line-clamp-1 mb-1">
                                {recJob.title}
                              </h5>
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                {recJob.shortDescription}
                              </p>
                            </div>

                            <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                {recJob.location.city}, {recJob.location.country}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleQuickApply(recJob);
                                }}
                                className="text-[#0066CC] dark:text-[#38BDF8] hover:underline font-bold text-[10px] flex items-center gap-0.5"
                              >
                                <Zap className="w-2.5 h-2.5 fill-current" />
                                <span>Quick Apply</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {filteredJobs.length === 0 ? (
                    /* Empty state */
                    <div className="bg-white dark:bg-[#131D35] p-12 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-center max-w-lg mx-auto shadow-xs">
                      <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] flex items-center justify-center mx-auto mb-4">
                        <Search className="w-7 h-7" />
                      </div>
                      <h3 className="text-lg font-bold text-[#14243A] dark:text-white">{tr.jobs.noMatches}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {tr.jobs.noMatchesDesc}
                      </p>
                      <button
                        onClick={() => {
                          setFilters(initialFilterState);
                          setSimilarSourceJob(null);
                        }}
                        className="mt-5 px-5 py-2.5 bg-[#0066CC] hover:bg-[#0052A3] text-white text-xs font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
                      >
                        {tr.filters.clearAll}
                      </button>
                    </div>
                  ) : viewMode === 'grid' ? (
                    /* Grid View with Framer Motion Staggered Animation */
                    <motion.div
                      variants={staggerContainerVariants}
                      initial="hidden"
                      animate="visible"
                      key={`grid-${filterAnimationKey}`}
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch"
                    >
                      {displayedJobs.map((job) => (
                        <motion.div key={job.id} variants={staggerItemVariants} className="h-full">
                          <JobCard
                            job={job}
                            viewMode="grid"
                            isSaved={savedJobIds.includes(job.id)}
                            hasApplied={applications.some((a) => a.jobId === job.id)}
                            onToggleSave={handleToggleSaveJob}
                            onViewDetails={handleViewDetails}
                            onApply={(j) => setSelectedJobForApply(j)}
                            onQuickApply={handleQuickApply}
                            onViewCompanyProfile={(cName) => setSelectedCompanyProfile(cName)}
                            onFindSimilarRoles={handleFindSimilarRoles}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    /* List View with Framer Motion Staggered Animation */
                    <motion.div
                      variants={staggerContainerVariants}
                      initial="hidden"
                      animate="visible"
                      key={`list-${filterAnimationKey}`}
                      className="space-y-4"
                    >
                      {displayedJobs.map((job) => (
                        <motion.div key={job.id} variants={staggerItemVariants}>
                          <JobCard
                            job={job}
                            viewMode="list"
                            isSaved={savedJobIds.includes(job.id)}
                            hasApplied={applications.some((a) => a.jobId === job.id)}
                            onToggleSave={handleToggleSaveJob}
                            onViewDetails={handleViewDetails}
                            onApply={(j) => setSelectedJobForApply(j)}
                            onQuickApply={handleQuickApply}
                            onViewCompanyProfile={(cName) => setSelectedCompanyProfile(cName)}
                            onFindSimilarRoles={handleFindSimilarRoles}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

              {/* Load More Button */}
              {visibleCount < filteredJobs.length && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 6)}
                    className="px-6 py-3 bg-white dark:bg-[#131D35] hover:bg-slate-50 dark:hover:bg-[#1A284A] border border-slate-200 dark:border-slate-700 text-[#14243A] dark:text-white hover:text-[#0066CC] dark:hover:text-[#38BDF8] font-bold text-xs rounded-xl shadow-xs transition-colors"
                  >
                    Load More Positions ({filteredJobs.length - visibleCount} remaining)
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  </section>

      {/* 4. Ecosystem & Partner Section (Open to Companies, Recruiters, and Individuals) */}
      <div id="partner-ecosystem">
        <EcosystemPartnerSection
          onOpenPartnerModal={(role) => handleOpenAuthModal('signup', role === 'employer' ? 'employer' : 'candidate')}
          onOpenPostJob={() => setIsPostJobModalOpen(true)}
          onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
          onOpenAuthModal={(mode, role) => handleOpenAuthModal(mode, role)}
        />
      </div>

      {/* 4.5. Professional Pricing Plan for Single and Bulk Job Postings (Monthly, Quarterly, Bi-Yearly, Yearly) */}
      <PricingSection
        onSelectPlan={handleSelectPlan}
        onOpenPostJob={() => setIsPostJobModalOpen(true)}
      />

      {/* 5. Why Work at MsmeBooks */}
      <WhyWorkHere />

      {/* 5. Life at MsmeBooks (Editorial Gallery) */}
      <LifeAtMsmeBooks />

      {/* 6. Our Hiring Process Timeline */}
      <HiringProcess />

      {/* 7. Talent Community Registration */}
      <TalentCommunitySection onRegisterTalent={handleRegisterTalent} />

      {/* 8. Job Alerts Subscription */}
      <JobAlertsSection
        onSubscribeAlert={handleSubscribeAlert}
        onUnsubscribeAlert={handleUnsubscribeAlert}
        allJobs={jobs}
      />

      {/* 9. Recruitment FAQs */}
      <FaqSection
        onOpenPartnerModal={handleOpenPartnerModal}
        onOpenPostJob={() => setIsPostJobModalOpen(true)}
      />

      {/* 10. Final Call-to-Action */}
      <FinalCta onExplorePositions={scrollToJobBoard} />

      {/* 11. Footer */}
      <Footer />

      {/* MODAL 1: Dedicated Job Details Modal with Entry & Exit Animations */}
      <AnimatePresence>
        {selectedJobForDetails && (
          <JobDetailsModal
            key="job-details-modal"
            job={selectedJobForDetails}
            onClose={() => setSelectedJobForDetails(null)}
            onApply={(j) => {
              setSelectedJobForDetails(null);
              setSelectedJobForApply(j);
            }}
            isSaved={savedJobIds.includes(selectedJobForDetails.id)}
            onToggleSave={handleToggleSaveJob}
            relatedJobs={jobs.filter(
              (j) => j.id !== selectedJobForDetails.id && j.department === selectedJobForDetails.department
            )}
            allJobs={jobs}
            savedJobIds={savedJobIds}
            onSelectJob={(j) => setSelectedJobForDetails(j)}
            onViewCompanyProfile={(cName) => {
              setSelectedJobForDetails(null);
              setSelectedCompanyProfile(cName);
            }}
            onDiscussSalaryTrend={handleDiscussSalaryTrend}
          />
        )}
      </AnimatePresence>

      {/* MODAL 2: Online Job Application System with Entry & Exit Animations */}
      <AnimatePresence>
        {selectedJobForApply && (
          <ApplicationModal
            key="application-modal"
            job={selectedJobForApply}
            onClose={() => setSelectedJobForApply(null)}
            onSubmitApplication={handleApplicationSubmit}
            existingEmails={applications
              .filter((a) => a.jobId === selectedJobForApply.id)
              .map((a) => a.email.toLowerCase())}
          />
        )}
      </AnimatePresence>

      {/* MODAL 3: Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div className="bg-white dark:bg-[#0D1527] w-full max-w-xs h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
                <span className="font-bold text-sm text-[#14243A] dark:text-white">Filter Positions</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <JobFilters
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={() => setFilters(initialFilterState)}
                companies={allCompanies}
                industries={allIndustries}
                countries={allCountries}
                states={allStates}
                cities={allCities}
                companyCounts={counts.companyCounts}
                industryCounts={counts.industryCounts}
                departmentCounts={counts.deptCounts}
                locationCounts={counts.locCounts}
                countryCounts={counts.countryCounts}
                stateCounts={counts.stateCounts}
                cityCounts={counts.cityCounts}
                arrangementCounts={counts.arrCounts}
                employmentTypeCounts={counts.empCounts}
                experienceCounts={counts.expCounts}
                totalMatches={filteredJobs.length}
                onSavePreset={(newPreset) =>
                  setSavedPresets((prev) => [newPreset, ...prev.filter((p) => p.id !== newPreset.id)])
                }
              />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full py-2.5 bg-[#0066CC] text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Apply Filters ({filteredJobs.length} results)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Post a Job Opening (For Companies & Individuals) */}
      <PostJobModal
        isOpen={isPostJobModalOpen}
        onClose={() => setIsPostJobModalOpen(false)}
        onJobPosted={(newJob) => {
          handleCreateJob(newJob);
          scrollToJobBoard();
        }}
        existingDepartments={allDepartments}
        onOpenPricing={() => {
          const el = document.getElementById('pricing');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* MODAL 5: AI-Powered Career Advisor & Job Matcher */}
      <AiCareerAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => {
          setIsAiAdvisorOpen(false);
          setAdvisorInitialTab('criteria');
          setNegotiationPrefill(null);
        }}
        jobs={jobs}
        initialTab={advisorInitialTab}
        negotiationPrefill={negotiationPrefill}
        onSelectJobForDetails={(j) => setSelectedJobForDetails(j)}
        onSelectJobForApply={(j) => setSelectedJobForApply(j)}
        onApplyFiltersToBoard={handleApplyAiFilters}
      />

      {/* MODAL 6: Partner & Recruiter Sign-Up / Onboarding Modal */}
      <PartnerSignUpModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
        initialRole={partnerModalRole}
        onEmployerPartnered={(p) => showToast(`Partner registration submitted for ${p.companyName}!`)}
        onCandidateRegistered={(c) => showToast(`Candidate registration confirmed for ${c.fullName}!`)}
      />

      {/* MODAL 7: Unified Multi-Role Auth Modal (Candidates, Employers, Agencies, Headhunters, Partners) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        initialRole={authModalRole}
        onSuccess={(role) => showToast(`Welcome! Signed in as ${role}.`)}
      />

      {/* MODAL 8: User Profile & Role Switcher Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onOpenPostJob={() => setIsPostJobModalOpen(true)}
        onOpenSavedJobs={() => {
          setFilters((prev) => ({ ...prev, onlySaved: true }));
          scrollToJobBoard();
        }}
        onOpenPartnerModal={() => handleOpenAuthModal('signup', 'partner')}
        onOpenPricing={() => {
          const el = document.getElementById('pricing');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenMockInterview={() => {
          setAdvisorInitialTab('mock-interview');
          setIsAiAdvisorOpen(true);
        }}
        applications={applications}
        onApplyFilterPreset={handleApplyPreset}
      />

      {/* MODAL 8.5: Dedicated Job Alert Settings Modal */}
      <JobAlertSettingsModal
        isOpen={isJobAlertSettingsOpen}
        onClose={() => setIsJobAlertSettingsOpen(false)}
        initialSearchQuery={filters.searchQuery}
        initialIndustry={filters.industries?.[0]}
        initialRole={filters.departments?.[0]}
        onSaveSuccess={() => showToast('Job alert subscription preferences saved!')}
      />

      {/* MODAL 9: Pricing Plan & Bulk Job Post Checkout Modal */}
      <PricingCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        plan={selectedPlanForCheckout}
        billingCycle={checkoutCycle}
        currency={checkoutCurrency}
        onSuccess={(creditsGranted, planName) => {
          showToast(`Plan activated: ${planName}! ${creditsGranted === 'unlimited' ? 'Unlimited' : creditsGranted} credits granted.`);
        }}
      />

      {/* MODAL 10: Dedicated Employer Branding & Company Profile Page */}
      {selectedCompanyProfile && (
        <CompanyProfileModal
          isOpen={!!selectedCompanyProfile}
          onClose={() => setSelectedCompanyProfile(null)}
          companyName={selectedCompanyProfile}
          allJobs={jobs}
          onApplyJob={(j) => {
            setSelectedCompanyProfile(null);
            setSelectedJobForApply(j);
          }}
          onViewJobDetails={(j) => {
            setSelectedCompanyProfile(null);
            setSelectedJobForDetails(j);
          }}
          isJobSaved={(jobId) => savedJobIds.includes(jobId)}
          onToggleSaveJob={handleToggleSaveJob}
        />
      )}

      {/* Floating AI Career Advisor Quick Button */}
      <button
        onClick={() => setIsAiAdvisorOpen(true)}
        className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-indigo-600 via-indigo-700 to-[#0066CC] hover:from-indigo-700 hover:to-[#0052A3] active:scale-95 text-white rounded-full shadow-2xl border border-white/20 flex items-center gap-2.5 transition-all hover:scale-105 group font-bold text-xs"
        title="Launch AI Career Advisor & Job Matcher"
      >
        <Bot className="w-4 h-4 text-[#B5E61D] group-hover:rotate-12 transition-transform" />
        <span className="hidden sm:inline">AI Career Advisor</span>
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
      </button>

      {/* Floating Live Support Chat Agent + WhatsApp Support */}
      <SupportChatWidget />

      {/* Floating Left Side Scroll Navigator (Scroll Up, Scroll Down, Top, Bottom, Progress & Section Jumps) */}
      <LeftScrollNavigator />
    </div>
  );
}
