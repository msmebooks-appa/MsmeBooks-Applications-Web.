import React, { useState, useMemo } from 'react';
import { Job } from '../types/career';
import { resolveCompanyProfile } from '../data/companyProfiles';
import {
  Layers,
  Search,
  Briefcase,
  Building2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Cpu,
  CreditCard,
  ShoppingCart,
  Truck,
  HeartPulse,
  Zap,
  Sprout,
  Users,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface IndustriesDirectoryProps {
  jobs: Job[];
  selectedIndustry: string | null;
  onSelectIndustry: (industry: string) => void;
}

interface IndustryMeta {
  key: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  bgLight: string;
  bgDark: string;
}

// Canonical industry definitions with specialized icons and descriptions
const INDUSTRY_METADATA: IndustryMeta[] = [
  {
    key: 'fintech',
    name: 'Financial Technology & Enterprise SaaS',
    description:
      'Cloud accounting ledgers, Point of Sale, micro-lending, digital payments, and core ERP systems empowering African enterprises and SMEs.',
    icon: CreditCard,
    accentColor: '#0066CC',
    bgLight: 'bg-blue-50 text-[#0066CC] border-blue-200',
    bgDark: 'dark:bg-blue-950/60 dark:text-[#38BDF8] dark:border-blue-900',
  },
  {
    key: 'retail',
    name: 'Retail POS, E-Commerce & Merchant Networks',
    description:
      'High-velocity retail counters, inventory barcodes, omni-channel storefronts, and FMCG wholesale distribution software.',
    icon: ShoppingCart,
    accentColor: '#F59E0B',
    bgLight: 'bg-amber-50 text-amber-700 border-amber-200',
    bgDark: 'dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-900',
  },
  {
    key: 'ai_data',
    name: 'AI, Machine Learning & Data Intelligence',
    description:
      'Computer vision for till receipts, cashflow predictive models, automated document intelligence, and localized LLM reasoning.',
    icon: Cpu,
    accentColor: '#8B5CF6',
    bgLight: 'bg-purple-50 text-purple-700 border-purple-200',
    bgDark: 'dark:bg-purple-950/60 dark:text-purple-400 dark:border-purple-900',
  },
  {
    key: 'logistics',
    name: 'Logistics, Freight & Cross-Border Supply Chain',
    description:
      'Last-mile delivery tracking, warehouse robotics, fleet management, and Pan-African trade corridor fulfillment networks.',
    icon: Truck,
    accentColor: '#10B981',
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    bgDark: 'dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-900',
  },
  {
    key: 'cleantech',
    name: 'Clean Energy, Solar & Climate Technology',
    description:
      'Pay-as-you-go solar grids, commercial renewable telemetry, battery energy storage, and carbon intelligence platforms.',
    icon: Zap,
    accentColor: '#EAB308',
    bgLight: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    bgDark: 'dark:bg-yellow-950/60 dark:text-yellow-400 dark:border-yellow-900',
  },
  {
    key: 'health',
    name: 'HealthTech & BioDiagnostics',
    description:
      'Point-of-care lab diagnostics, pharmacy inventory automation, clinical lab telemetry, and decentralized telemedicine networks.',
    icon: HeartPulse,
    accentColor: '#EF4444',
    bgLight: 'bg-rose-50 text-rose-700 border-rose-200',
    bgDark: 'dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-900',
  },
  {
    key: 'agritech',
    name: 'AgriTech & Smallholder Food Systems',
    description:
      'Input financing, smart irrigation IoT, harvest yield prediction, and digital produce markets connecting rural farms to cities.',
    icon: Sprout,
    accentColor: '#16A34A',
    bgLight: 'bg-green-50 text-green-700 border-green-200',
    bgDark: 'dark:bg-green-950/60 dark:text-green-400 dark:border-green-900',
  },
  {
    key: 'hr_talent',
    name: 'Human Capital, HR Tech & Talent Networks',
    description:
      'Pan-African technical recruitment, cross-border remote payroll, talent vetting, and distributed workforce infrastructure.',
    icon: Users,
    accentColor: '#0284C7',
    bgLight: 'bg-sky-50 text-sky-700 border-sky-200',
    bgDark: 'dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-900',
  },
  {
    key: 'education',
    name: 'Education, Graduate Traineeships & Skills',
    description:
      'Early-career technology bootcamps, structured graduate rotations, developer mentorship, and executive leadership pipelines.',
    icon: GraduationCap,
    accentColor: '#EC4899',
    bgLight: 'bg-pink-50 text-pink-700 border-pink-200',
    bgDark: 'dark:bg-pink-950/60 dark:text-pink-400 dark:border-pink-900',
  },
];

export const IndustriesDirectory: React.FC<IndustriesDirectoryProps> = ({
  jobs,
  selectedIndustry,
  onSelectIndustry,
}) => {
  const { tr } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'jobs' | 'az'>('jobs');

  // Compute stats per industry from active jobs
  const industryData = useMemo(() => {
    // Map of industry name to jobs
    const industryMap = new Map<
      string,
      {
        name: string;
        meta?: IndustryMeta;
        jobs: Job[];
        companies: Set<string>;
        skills: Set<string>;
      }
    >();

    // Seed with canonical industry metadata
    INDUSTRY_METADATA.forEach((meta) => {
      industryMap.set(meta.name.toLowerCase(), {
        name: meta.name,
        meta,
        jobs: [],
        companies: new Set(),
        skills: new Set(),
      });
    });

    // Bucket all jobs into industries
    jobs.forEach((job) => {
      if (job.status !== 'published') return;

      const profile = resolveCompanyProfile(job.company?.name || '', jobs);
      // Determine industry name
      let industryName = job.industry || profile.industry;

      // Normalize to one of the canonical categories if matched, else fallback
      const match = INDUSTRY_METADATA.find(
        (m) =>
          industryName.toLowerCase().includes(m.key) ||
          industryName.toLowerCase().includes(m.name.toLowerCase()) ||
          (m.key === 'fintech' && (industryName.includes('Financial') || industryName.includes('SaaS') || industryName.includes('Ledger'))) ||
          (m.key === 'retail' && (industryName.includes('Retail') || industryName.includes('Commerce') || industryName.includes('POS'))) ||
          (m.key === 'ai_data' && (industryName.includes('AI') || industryName.includes('Data') || industryName.includes('Intelligence'))) ||
          (m.key === 'logistics' && (industryName.includes('Logistics') || industryName.includes('Supply'))) ||
          (m.key === 'cleantech' && (industryName.includes('Energy') || industryName.includes('Climate') || industryName.includes('Solar'))) ||
          (m.key === 'health' && (industryName.includes('Health') || industryName.includes('Bio') || industryName.includes('Diagnostics'))) ||
          (m.key === 'agritech' && (industryName.includes('Agri') || industryName.includes('Farm'))) ||
          (m.key === 'hr_talent' && (industryName.includes('Talent') || industryName.includes('Human') || industryName.includes('Recruit'))) ||
          (m.key === 'education' && (industryName.includes('Graduate') || industryName.includes('Education') || industryName.includes('Intern')))
      );

      const targetKey = match ? match.name.toLowerCase() : industryName.toLowerCase();

      if (!industryMap.has(targetKey)) {
        industryMap.set(targetKey, {
          name: match ? match.name : industryName,
          meta: match,
          jobs: [],
          companies: new Set(),
          skills: new Set(),
        });
      }

      const entry = industryMap.get(targetKey)!;
      entry.jobs.push(job);
      if (job.company?.name) {
        entry.companies.add(job.company.name);
      }
      (job.skills || []).forEach((s) => entry.skills.add(s));
    });

    return Array.from(industryMap.values());
  }, [jobs]);

  // Filter & sort industries
  const filteredIndustries = useMemo(() => {
    let list = industryData.filter((ind) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchName = ind.name.toLowerCase().includes(q);
      const matchDesc = ind.meta?.description.toLowerCase().includes(q) || false;
      const matchCompany = Array.from(ind.companies).some((c) => c.toLowerCase().includes(q));
      const matchSkill = Array.from(ind.skills).some((s) => s.toLowerCase().includes(q));
      return matchName || matchDesc || matchCompany || matchSkill;
    });

    return list.sort((a, b) => {
      if (sortBy === 'jobs') {
        if (b.jobs.length !== a.jobs.length) {
          return b.jobs.length - a.jobs.length;
        }
        return a.name.localeCompare(b.name);
      }
      return a.name.localeCompare(b.name);
    });
  }, [industryData, searchQuery, sortBy]);

  const totalIndustriesWithJobs = useMemo(() => {
    return industryData.filter((i) => i.jobs.length > 0).length;
  }, [industryData]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#14243A] via-[#1A3860] to-[#0066CC] p-6 sm:p-8 text-white shadow-lg border border-indigo-500/20">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#B5E61D] text-xs font-bold mb-3 border border-white/15">
            <Layers className="w-3.5 h-3.5" />
            <span>African Economic Sectors</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore Open Jobs by Industry
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            Navigate career opportunities categorized across Africa's fastest-growing economic sectors. Find roles that match your domain expertise, from enterprise financial tooling and smart retail to logistics, AI, and climate tech.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Layers className="w-4 h-4 text-[#B5E61D]" />
              <span className="font-bold text-white text-sm">{industryData.length}</span>
              <span>Total Sectors</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
              <span className="font-bold text-white text-sm">{totalIndustriesWithJobs}</span>
              <span>Actively Hiring Sectors</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="bg-white dark:bg-[#131D35] p-4 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 transition-colors">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search industries by name, skill, or hiring company..."
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

        {/* Sort Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'jobs' | 'az')}
            className="px-3 py-2 text-xs font-semibold bg-slate-50 dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 outline-none cursor-pointer"
          >
            <option value="jobs">Most Open Jobs</option>
            <option value="az">Alphabetical: A → Z</option>
          </select>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 text-xs font-bold text-[#0066CC] dark:text-[#38BDF8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Industries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIndustries.map((industry) => {
          const meta = industry.meta;
          const IconComponent = meta?.icon || Layers;
          const openCount = industry.jobs.length;
          const isSelected = selectedIndustry === industry.name;
          const companiesList = Array.from(industry.companies);
          const topSkills = Array.from(industry.skills).slice(0, 4);

          return (
            <div
              key={industry.name}
              className={`group bg-white dark:bg-[#131D35] rounded-2xl border p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-200 ${
                isSelected
                  ? 'border-[#0066CC] dark:border-[#38BDF8] ring-2 ring-[#0066CC]/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-700/80 hover:border-[#0066CC]/50 dark:hover:border-[#38BDF8]/50'
              }`}
            >
              <div>
                {/* Sector Header: Icon & Open Positions Count */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                      meta
                        ? `${meta.bgLight} ${meta.bgDark}`
                        : 'bg-blue-50 dark:bg-blue-950 text-[#0066CC] dark:text-[#38BDF8] border-blue-200 dark:border-blue-900'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Open Jobs Pill */}
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-extrabold font-mono flex items-center gap-1.5 ${
                      openCount > 0
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-[#1A284A] text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        openCount > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`}
                    />
                    <span>{openCount} {openCount === 1 ? 'Open Role' : 'Open Roles'}</span>
                  </div>
                </div>

                {/* Sector Name */}
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] transition-colors mb-2">
                  {industry.name}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
                  {meta?.description ||
                    `Explore high-impact positions across companies leading ${industry.name} in Africa.`}
                </p>

                {/* Hiring Companies Chips */}
                {companiesList.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                      Hiring Companies:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {companiesList.slice(0, 3).map((comp) => (
                        <span
                          key={comp}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 flex items-center gap-1"
                        >
                          <Building2 className="w-2.5 h-2.5 text-slate-400" />
                          <span>{comp}</span>
                        </span>
                      ))}
                      {companiesList.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          +{companiesList.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* In-demand Skills */}
                {topSkills.length > 0 && (
                  <div className="mb-5 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">
                      In-Demand Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {topSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-50 dark:bg-[#152342] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectIndustry(industry.name)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  openCount > 0
                    ? 'bg-[#0066CC] hover:bg-[#0052A3] text-white shadow-xs hover:shadow-md'
                    : 'bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#20325A]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{openCount > 0 ? `Explore ${openCount} Jobs` : `Browse ${industry.name}`}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
