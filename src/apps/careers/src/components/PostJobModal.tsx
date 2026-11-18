import React, { useState, useMemo } from 'react';
import { Job, WorkArrangement, EmploymentType, ExperienceLevel } from '../types/career';
import { useCurrency } from '../context/CurrencyContext';
import { getEmployerWeeklyPostStatus, recordEmployerWeeklyPost } from '../utils/planQuotas';
import {
  X,
  Building2,
  User,
  Briefcase,
  DollarSign,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe,
  Mail,
  Plus,
  Trash2,
  Users,
  Clock,
  Gift,
  Wand2,
  Eye,
  Check,
  HelpCircle,
  FileText,
  AlertCircle,
  RefreshCw,
  Lightbulb,
  Award,
} from 'lucide-react';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobPosted: (newJob: Job) => void;
  existingDepartments: string[];
  onOpenPricing?: () => void;
}

type FormTab = 'role' | 'compensation' | 'details' | 'preview';

// Role Template Presets for 1-Click Auto-Fill
const ROLE_PRESETS = [
  {
    title: 'Senior Backend Engineer (Fintech)',
    department: 'Software Engineering',
    experienceLevel: 'Senior' as ExperienceLevel,
    workArrangement: 'Remote' as WorkArrangement,
    availablePositions: 2,
    salaryMin: 4000,
    salaryMax: 6500,
    currency: 'USD',
    skills: 'TypeScript, Node.js, PostgreSQL, Docker, Redis, Kafka, Distributed Systems',
    shortDescription: 'Lead core financial transaction ledger and high-throughput payment API microservices powering African merchant commerce.',
    responsibilities: 'Architect, develop, and maintain resilient microservices and transactional backend APIs.\nCollaborate across multi-disciplinary teams in Africa.\nOptimize high-throughput APIs and transactional consistency.\nInstrument monitoring, automated CI/CD pipelines, and zero-downtime database schema migrations.',
    qualifications: '5+ years experience in production software engineering.\nStrong understanding of scalable system design and databases.\nProven experience in relational databases (PostgreSQL/MySQL), indexing, and transactional isolation.',
    benefits: [
      'Competitive base salary with bi-annual performance and equity reviews',
      'Comprehensive healthcare cover (inpatient, outpatient, dental & optical)',
      'Flexible remote working policy with monthly coworking & high-speed internet stipend',
      '$2,000 annual professional development, book & certification allowance',
      '25 days paid annual leave + paid parental and compassionate leave',
      'Top-spec MacBook Pro / modern workstation hardware setup grant',
    ],
  },
  {
    title: 'Lead Product Designer (B2B SaaS)',
    department: 'Product & Design',
    experienceLevel: 'Lead' as ExperienceLevel,
    workArrangement: 'Hybrid' as WorkArrangement,
    availablePositions: 1,
    salaryMin: 4500,
    salaryMax: 7000,
    currency: 'USD',
    skills: 'Figma, Design Systems, User Research, Wireframing, UX Writing, B2B SaaS',
    shortDescription: 'Shape intuitive accounting, billing, and inventory interfaces for hundreds of thousands of African SMEs.',
    responsibilities: 'Own end-to-end user research, prototype discovery, and component design systems.\nConduct weekly field interviews with small business owners across regional hubs.\nCollaborate with engineering squads to ensure high-fidelity UI implementation.',
    qualifications: '5+ years designing enterprise or fintech web & mobile software applications.\nStrong portfolio showcasing complex workflow simplification and design systems.\nMastery of Figma, design tokens, and accessibility standards.',
    benefits: [
      'Competitive compensation package + equity incentives',
      'Comprehensive medical, dental, and optical insurance',
      'Home office setup stipend + latest Apple creative hardware',
      'Annual learning stipend for design conferences and courses',
      'Generous paid annual leave + flexible wellness days',
    ],
  },
  {
    title: 'Financial Controller (IFRS & Compliance)',
    department: 'Finance & Accounting',
    experienceLevel: 'Senior' as ExperienceLevel,
    workArrangement: 'On-site' as WorkArrangement,
    availablePositions: 1,
    salaryMin: 3500,
    salaryMax: 5500,
    currency: 'USD',
    skills: 'IFRS, Tax Compliance, Multi-Currency Treasury, Financial Modeling, ERP',
    shortDescription: 'Manage multi-entity financial reporting, multi-currency treasury operations, and tax compliance across our Pan-African subsidiaries.',
    responsibilities: 'Oversee month-end close, audited IFRS balance sheets, and tax compliance.\nManage multi-currency FX treasury reconciliations across African commercial banks.\nLead automation of billing reconciliations and payroll ledgers.',
    qualifications: 'ACA, ACCA, or CPA certification with 6+ years post-qualification experience.\nProven background in fintech, audit, or multinational business operations.\nAdvanced financial modeling and ERP systems acumen.',
    benefits: [
      'Competitive executive remuneration with performance bonus',
      'Comprehensive family medical coverage',
      'Executive development sponsorship',
      'Flexible working arrangements and commuter allowance',
    ],
  },
];

// Popular Benefit Presets for Quick 1-Click Addition
const BENEFIT_PRESETS = [
  'Comprehensive Health, Dental & Optical Insurance',
  'Flexible Remote Working Policy + Coworking Stipend',
  '$2,000 Annual Professional Learning & Certification Budget',
  'Company Performance Bonuses & Stock Options (ESOP)',
  '25 Days Paid Annual Leave + Paid Parental Leave',
  'Top-Tier MacBook Pro / Workstation Hardware Setup Grant',
  'Annual Pan-African Team Retreats & Hackathons',
  'Wellness & Mental Health Support Subsidy',
  'Pension Scheme & Gratuity Contribution',
  'Free Daily Lunch & Gourmet Coffee at Tech Hubs',
];

export const PostJobModal: React.FC<PostJobModalProps> = ({
  isOpen,
  onClose,
  onJobPosted,
  existingDepartments,
  onOpenPricing,
}) => {
  const { currentCurrency, currentConfig, formatAmount, currencies } = useCurrency();

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<FormTab>('role');

  // Employer Details
  const [employerType, setEmployerType] = useState<'Company' | 'Individual'>('Company');
  const [companyName, setCompanyName] = useState('MsmeBooks Technologies');
  const [companyWebsite, setCompanyWebsite] = useState('https://www.msmebooks.org');
  const [contactEmail, setContactEmail] = useState('recruitment@msmebooks.org');

  // Role Details
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Software Engineering');
  const [customDepartment, setCustomDepartment] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [city, setCity] = useState('Lagos');
  const [workArrangement, setWorkArrangement] = useState<WorkArrangement>('Remote');
  const [employmentType, setEmploymentType] = useState<EmploymentType>('Full-time');
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Mid-Level');
  const [availablePositions, setAvailablePositions] = useState<number>(1);

  // Compensation & Timelines
  const [currency, setCurrency] = useState<string>(currentCurrency || 'NGN');
  const [salaryMin, setSalaryMin] = useState<number>(currency === 'NGN' ? 2500000 : 3500);
  const [salaryMax, setSalaryMax] = useState<number>(currency === 'NGN' ? 4500000 : 5500);
  const [isSalaryPublic, setIsSalaryPublic] = useState(true);

  // Dates
  const todayIso = new Date().toISOString().slice(0, 10);
  const defaultDeadline = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
  const defaultInterviewDate = new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10);

  const [deadline, setDeadline] = useState(defaultDeadline);
  const [interviewDate, setInterviewDate] = useState(defaultInterviewDate);

  // Content Specs
  const [shortDescription, setShortDescription] = useState('');
  const [skillsText, setSkillsText] = useState('TypeScript, React, Node.js, PostgreSQL');
  const [responsibilitiesText, setResponsibilitiesText] = useState(
    'Architect and implement scalable backend and cloud microservices.\nCollaborate closely with product managers, QA, and frontend squads.\nEnsure high transactional consistency, monitoring, and automated test coverage.'
  );
  const [qualificationsText, setQualificationsText] = useState(
    '3+ years production software engineering experience.\nProficiency with modern web frameworks and relational databases.\nStrong async communication skills in a remote, distributed environment.'
  );

  // Benefits List State
  const [benefitsList, setBenefitsList] = useState<string[]>([
    'Competitive base salary with bi-annual performance and equity reviews',
    'Comprehensive healthcare cover (inpatient, outpatient, dental & optical)',
    'Flexible remote working policy with monthly coworking & high-speed internet stipend',
    '$2,000 annual professional development, book & certification allowance',
    '25 days paid annual leave + paid parental and compassionate leave',
  ]);
  const [newBenefitInput, setNewBenefitInput] = useState('');

  // AI Assistant Copilot State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // Status & Validation
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Completeness Meter Calculation
  const completenessScore = useMemo(() => {
    let score = 0;
    if (title.trim()) score += 20;
    if (companyName.trim()) score += 15;
    if (shortDescription.trim()) score += 20;
    if (skillsText.trim()) score += 10;
    if (responsibilitiesText.trim()) score += 10;
    if (qualificationsText.trim()) score += 10;
    if (benefitsList.length >= 3) score += 10;
    if (interviewDate) score += 5;
    return Math.min(100, score);
  }, [title, companyName, shortDescription, skillsText, responsibilitiesText, qualificationsText, benefitsList, interviewDate]);

  const weeklyPostStatus = useMemo(() => getEmployerWeeklyPostStatus(), [submitted]);

  if (!isOpen) return null;

  // Apply Role Template Preset
  const handleApplyPreset = (preset: typeof ROLE_PRESETS[0]) => {
    setTitle(preset.title);
    setDepartment(preset.department);
    setExperienceLevel(preset.experienceLevel);
    setWorkArrangement(preset.workArrangement);
    setAvailablePositions(preset.availablePositions);
    setSalaryMin(preset.salaryMin);
    setSalaryMax(preset.salaryMax);
    setCurrency(preset.currency);
    setSkillsText(preset.skills);
    setShortDescription(preset.shortDescription);
    setResponsibilitiesText(preset.responsibilities);
    setQualificationsText(preset.qualifications);
    setBenefitsList(preset.benefits);
    setAiSuccessMessage(`Applied template: "${preset.title}"`);
    setTimeout(() => setAiSuccessMessage(null), 3000);
  };

  // Add a benefit from chip
  const handleAddBenefitChip = (benefit: string) => {
    if (!benefitsList.includes(benefit)) {
      setBenefitsList([...benefitsList, benefit]);
    }
  };

  // Add custom typed benefit
  const handleAddCustomBenefit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newBenefitInput.trim() && !benefitsList.includes(newBenefitInput.trim())) {
      setBenefitsList([...benefitsList, newBenefitInput.trim()]);
      setNewBenefitInput('');
    }
  };

  // Remove a benefit
  const handleRemoveBenefit = (index: number) => {
    setBenefitsList(benefitsList.filter((_, i) => i !== index));
  };

  // Call Server-Side AI Assistant
  const handleGenerateWithAI = async (focusArea?: 'all' | 'description' | 'responsibilities' | 'qualifications' | 'benefits') => {
    setIsGeneratingAI(true);
    setAiSuccessMessage(null);

    try {
      const response = await fetch('/api/ai-suggest-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || 'Software Engineer',
          department,
          experienceLevel,
          workArrangement,
          country,
          companyName,
          userPrompt: aiCustomPrompt.trim() || undefined,
          currentSkills: skillsText,
          currentResponsibilities: responsibilitiesText,
          currentQualifications: qualificationsText,
          currentBenefits: benefitsList.join('; '),
        }),
      });

      if (!response.ok) throw new Error('AI suggestion service error');

      const data = await response.json();

      if (data.success) {
        if (!focusArea || focusArea === 'all') {
          if (data.shortDescription) setShortDescription(data.shortDescription);
          if (data.keyResponsibilities && Array.isArray(data.keyResponsibilities)) {
            setResponsibilitiesText(data.keyResponsibilities.join('\n'));
          }
          if (data.requiredQualifications && Array.isArray(data.requiredQualifications)) {
            setQualificationsText(data.requiredQualifications.join('\n'));
          }
          if (data.skills && Array.isArray(data.skills)) {
            setSkillsText(data.skills.join(', '));
          }
          if (data.benefits && Array.isArray(data.benefits) && data.benefits.length > 0) {
            setBenefitsList(data.benefits);
          }
          if (data.suggestedSalaryMin && data.suggestedSalaryMax) {
            setSalaryMin(data.suggestedSalaryMin);
            setSalaryMax(data.suggestedSalaryMax);
          }
          if (data.availablePositions) {
            setAvailablePositions(data.availablePositions);
          }
          setAiSuccessMessage('✨ AI Job Architect successfully filled description, specs, skills & benefits!');
        } else if (focusArea === 'description' && data.shortDescription) {
          setShortDescription(data.shortDescription);
          setAiSuccessMessage('✨ AI updated job description!');
        } else if (focusArea === 'responsibilities' && data.keyResponsibilities) {
          setResponsibilitiesText(data.keyResponsibilities.join('\n'));
          setAiSuccessMessage('✨ AI suggested key responsibilities!');
        } else if (focusArea === 'qualifications' && data.requiredQualifications) {
          setQualificationsText(data.requiredQualifications.join('\n'));
          setAiSuccessMessage('✨ AI suggested qualifications!');
        } else if (focusArea === 'benefits' && data.benefits) {
          setBenefitsList(data.benefits);
          setAiSuccessMessage('✨ AI recommended top competitive benefits!');
        }
      }
    } catch (err: any) {
      console.warn('AI generator fallback:', err);
      // Client-side fallback if server fails
      if (!shortDescription) {
        setShortDescription(`We are looking for an experienced ${title || 'Professional'} to join ${companyName} in our ${department} squad. You will lead high-impact initiatives across Pan-African markets.`);
      }
      setAiSuccessMessage('AI suggestions applied (Offline Fallback Engine).');
    } finally {
      setIsGeneratingAI(false);
      setTimeout(() => setAiSuccessMessage(null), 4000);
    }
  };

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!companyName.trim()) errs.companyName = 'Company / Employer name is required.';
    if (!contactEmail.trim() || !/^\S+@\S+\.\S+$/.test(contactEmail)) {
      errs.contactEmail = 'A valid contact email is required.';
    }
    if (!title.trim()) errs.title = 'Job title is required.';
    if (!shortDescription.trim()) errs.shortDescription = 'Short role summary is required.';
    if (salaryMin > salaryMax) errs.salary = 'Minimum salary cannot exceed maximum salary.';
    if (availablePositions < 1) errs.availablePositions = 'Available positions must be at least 1.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setActiveTab('role');
      return;
    }

    const chosenDept = department === 'OTHER' ? customDepartment.trim() || 'General' : department;
    const skills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const responsibilities = responsibilitiesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const qualifications = qualificationsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now().toString().slice(-4)}`;
    const refCode = `${companyName.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'JOB')}-${Math.floor(100 + Math.random() * 900)}`;

    const newJob: Job = {
      id: `job-ext-${Date.now()}`,
      slug,
      referenceCode: refCode,
      title,
      company: {
        name: companyName,
        website: companyWebsite.trim() ? companyWebsite : undefined,
        verified: true,
        employerType,
      },
      department: chosenDept,
      location: {
        country,
        city: workArrangement === 'Remote' ? 'Remote' : city,
        isRemote: workArrangement === 'Remote',
        isWorldwide: workArrangement === 'Remote',
      },
      employmentType,
      workArrangement,
      experienceLevel,
      salary: {
        min: Number(salaryMin),
        max: Number(salaryMax),
        currency,
        isPublic: isSalaryPublic,
        period: 'month',
      },
      datePosted: new Date().toISOString(),
      applicationDeadline: `${deadline}T23:59:59Z`,
      interviewDate: interviewDate ? `${interviewDate}T09:00:00Z` : undefined,
      availablePositions: Number(availablePositions) || 1,
      shortDescription,
      aboutRole: shortDescription,
      keyResponsibilities: responsibilities.length > 0 ? responsibilities : ['Lead execution on core squad deliverables.'],
      requiredQualifications: qualifications.length > 0 ? qualifications : ['Relevant professional experience and domain acumen.'],
      preferredQualifications: ['Prior domain experience in modern high-growth technology.'],
      skills: skills.length > 0 ? skills : ['Communication', 'Execution', 'Problem Solving'],
      benefits: benefitsList.length > 0 ? benefitsList : ['Competitive remuneration', 'Flexible schedule', 'Impact in African technology'],
      isFeatured: true,
      status: 'published',
      isSampleDemo: false,
      applicantsCount: 0,
    };

    onJobPosted(newJob);
    recordEmployerWeeklyPost();
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-sm flex justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#131D35] rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden my-auto flex flex-col max-h-[92vh] transition-colors duration-200">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-blue-50/40 dark:from-[#0D1527] dark:via-[#131D35] dark:to-[#16233F] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0066CC] flex items-center justify-center text-white shadow-sm">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#0066CC] dark:text-[#38BDF8] uppercase tracking-wider">
                  Recruiter & Employer Suite
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  AI-Powered
                </span>
                {weeklyPostStatus.isAvailable ? (
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B5E61D]/25 text-[#14243A] dark:text-[#B5E61D] border border-[#B5E61D]/50">
                    🌟 1 Free Weekly Post
                  </span>
                ) : (
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                    ⏰ Resets in {weeklyPostStatus.daysUntilNext}d
                  </span>
                )}
              </div>
              <h2 className="text-lg font-extrabold text-[#14243A] dark:text-white leading-tight">
                Post Job Vacancy
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Completeness Health Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-[#1A284A] rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Health:</span>
              <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    completenessScore > 75 ? 'bg-emerald-500' : completenessScore > 40 ? 'bg-amber-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${completenessScore}%` }}
                />
              </div>
              <span className="font-mono text-[11px] text-[#0066CC] dark:text-[#38BDF8]">{completenessScore}%</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1A284A] rounded-xl transition-colors cursor-pointer"
              aria-label="Close post job modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4-Step Navigation Tabs */}
        {!submitted && (
          <div className="px-6 py-2.5 bg-slate-50 dark:bg-[#0D1527] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 overflow-x-auto shrink-0 text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('role')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'role'
                    ? 'bg-[#0066CC] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#1A284A]'
                }`}
              >
                <span>1. Role & Identity</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('compensation')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'compensation'
                    ? 'bg-[#0066CC] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#1A284A]'
                }`}
              >
                <span>2. Salary & Dates</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'details'
                    ? 'bg-[#0066CC] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#1A284A]'
                }`}
              >
                <span>3. Specs & Benefits</span>
                <Sparkles className="w-3 h-3 text-[#B5E61D]" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-[#0066CC] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-[#1A284A]'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>4. Live Preview</span>
              </button>
            </div>

            {/* Quick Template Selector */}
            <div className="hidden lg:flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Quick Template:</span>
              <div className="flex gap-1">
                {ROLE_PRESETS.map((p) => (
                  <button
                    key={p.title}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-2 py-1 bg-white dark:bg-[#1A284A] hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 cursor-pointer"
                  >
                    {p.title.split(' ')[0]} {p.title.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {submitted ? (
            /* Confirmation Screen */
            <div className="py-8 text-center space-y-5 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Vacancy Published Successfully
                </span>
                <h3 className="text-2xl font-extrabold text-[#14243A] dark:text-white mt-1">
                  {title || 'Job Vacancy'} is Live!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 max-w-lg mx-auto">
                  Your job listing has been verified and syndicated across the MsmeBooks African Talent Network. Candidates can now discover and apply with AI resume matching.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Employer:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="font-bold text-[#0066CC] dark:text-[#38BDF8]">{department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Positions:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                    {availablePositions} Open Headcount
                  </span>
                </div>
                {interviewDate && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Target Interview Date:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {new Date(interviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">Benefits Included:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{benefitsList.length} Perks & Benefits</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-6 py-2.5 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Done & Return to Jobs Board
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* AI Success Feedback Banner */}
              {aiSuccessMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{aiSuccessMessage}</span>
                </div>
              )}

              {/* =========================================================================
                  TAB 1: ROLE & IDENTITY
                 ========================================================================= */}
              {activeTab === 'role' && (
                <div className="space-y-5 animate-in fade-in duration-100">
                  {/* Employer Header Info */}
                  <div className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                        <span>Employer / Organization Profile</span>
                      </h3>
                      <div className="flex items-center gap-2 text-xs">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="employerType"
                            checked={employerType === 'Company'}
                            onChange={() => setEmployerType('Company')}
                            className="text-[#0066CC]"
                          />
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">Registered Company</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="employerType"
                            checked={employerType === 'Individual'}
                            onChange={() => setEmployerType('Individual')}
                            className="text-[#0066CC]"
                          />
                          <span className="text-slate-700 dark:text-slate-300 font-semibold">Founder / Recruiter</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Company / Hiring Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. MsmeBooks Technologies, Paystack, Flutterwave"
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC]"
                        />
                        {errors.companyName && (
                          <p className="text-rose-500 text-[11px] mt-1">{errors.companyName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Recruitment Contact Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="careers@company.com"
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC]"
                        />
                        {errors.contactEmail && (
                          <p className="text-rose-500 text-[11px] mt-1">{errors.contactEmail}</p>
                        )}
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Website / Portfolio URL
                        </label>
                        <input
                          type="url"
                          value={companyWebsite}
                          onChange={(e) => setCompanyWebsite(e.target.value)}
                          placeholder="https://company.com"
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Role Title & Headcount */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Senior Backend Engineer, Product Manager, Head of Growth"
                        className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC] font-bold text-sm"
                      />
                      {errors.title && (
                        <p className="text-rose-500 text-[11px] mt-1">{errors.title}</p>
                      )}
                    </div>

                    {/* NEW FEATURE: Available Positions / Open Headcount */}
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                        <span>Available Positions *</span>
                        <span className="text-[10px] text-[#0066CC] dark:text-[#38BDF8] font-mono">Openings</span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={1}
                          max={50}
                          required
                          value={availablePositions}
                          onChange={(e) => setAvailablePositions(Math.max(1, parseInt(e.target.value, 10) || 1))}
                          className="w-20 px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC] font-bold text-center font-mono"
                        />
                        <div className="flex items-center gap-1 flex-1">
                          {[1, 2, 3, 5].map((count) => (
                            <button
                              key={count}
                              type="button"
                              onClick={() => setAvailablePositions(count)}
                              className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                                availablePositions === count
                                  ? 'bg-[#0066CC] text-white border-[#0066CC]'
                                  : 'bg-slate-100 dark:bg-[#1A284A] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {count}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Number of candidate slots to fill.</p>
                    </div>
                  </div>

                  {/* Department & Experience */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Department
                      </label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC] font-medium"
                      >
                        {existingDepartments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                        <option value="OTHER">Other (Custom Department)...</option>
                      </select>
                      {department === 'OTHER' && (
                        <input
                          type="text"
                          required
                          value={customDepartment}
                          onChange={(e) => setCustomDepartment(e.target.value)}
                          placeholder="Type department name..."
                          className="mt-1.5 w-full px-3 py-1.5 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 outline-none text-xs"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Experience Level
                      </label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC] font-medium"
                      >
                        <option value="Junior">Junior (0 - 2 yrs)</option>
                        <option value="Mid-Level">Mid-Level (2 - 5 yrs)</option>
                        <option value="Senior">Senior (5 - 8 yrs)</option>
                        <option value="Lead">Lead / Staff (8+ yrs)</option>
                        <option value="Executive">Executive / Director</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Employment Type
                      </label>
                      <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC] font-medium"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                      </select>
                    </div>
                  </div>

                  {/* Work Location & Arrangement */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Work Arrangement
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {(['Remote', 'Hybrid', 'On-site'] as WorkArrangement[]).map((arr) => (
                          <button
                            key={arr}
                            type="button"
                            onClick={() => setWorkArrangement(arr)}
                            className={`py-2 rounded-xl font-bold transition-all border text-xs cursor-pointer ${
                              workArrangement === arr
                                ? 'bg-[#0066CC] text-white border-[#0066CC] shadow-2xs'
                                : 'bg-slate-50 dark:bg-[#0D1527] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {arr}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        Primary Country
                      </label>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. Nigeria, Kenya, Rwanda, South Africa"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                        City / Hub
                      </label>
                      <input
                        type="text"
                        value={workArrangement === 'Remote' ? 'Remote (Pan-Africa)' : city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={workArrangement === 'Remote'}
                        placeholder="e.g. Lagos, Nairobi, Kigali"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC] disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setActiveTab('compensation')}
                      className="px-5 py-2.5 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span>Continue to Salary & Dates</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 2: COMPENSATION & TIMELINES (INTERVIEW DATE + DEADLINE)
                 ========================================================================= */}
              {activeTab === 'compensation' && (
                <div className="space-y-5 animate-in fade-in duration-100">
                  {/* Compensation Card */}
                  <div className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                        <span>Compensation Range (Monthly)</span>
                      </h3>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSalaryPublic}
                          onChange={(e) => setIsSalaryPublic(e.target.checked)}
                          className="rounded text-[#0066CC] focus:ring-0"
                        />
                        <span>Display salary publicly to attract 3x more candidates</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Billing & Offer Currency
                        </label>
                        <select
                          value={currency}
                          onChange={(e) => setCurrency(e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold cursor-pointer"
                        >
                          <optgroup label="Default & Popular Currencies">
                            {currencies
                              .filter((c) => c.isPopular || c.code === 'NGN')
                              .map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.flag} {c.code} ({c.symbol}) - {c.country}
                                </option>
                              ))}
                          </optgroup>
                          <optgroup label="All World Currencies">
                            {currencies
                              .filter((c) => !c.isPopular && c.code !== 'NGN')
                              .map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.flag} {c.code} ({c.symbol}) - {c.country}
                                </option>
                              ))}
                          </optgroup>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Minimum Monthly Salary
                        </label>
                        <input
                          type="number"
                          step={100}
                          min={0}
                          required
                          value={salaryMin}
                          onChange={(e) => setSalaryMin(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Maximum Monthly Salary
                        </label>
                        <input
                          type="number"
                          step={100}
                          min={0}
                          required
                          value={salaryMax}
                          onChange={(e) => setSalaryMax(Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white dark:bg-[#131D35] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono font-bold"
                        />
                      </div>
                    </div>

                    {errors.salary && (
                      <p className="text-rose-500 text-xs font-semibold">{errors.salary}</p>
                    )}
                  </div>

                  {/* NEW FEATURE: Target Interview Date & Application Deadline */}
                  <div className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                      <span>Hiring Timelines & Target Interview Schedule</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Interview Commencement Date */}
                      <div className="p-3 bg-white dark:bg-[#131D35] rounded-xl border border-blue-200/80 dark:border-blue-900/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                            <span>Target Interview Start Date *</span>
                          </label>
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                            First Round
                          </span>
                        </div>
                        <input
                          type="date"
                          required
                          value={interviewDate}
                          min={todayIso}
                          onChange={(e) => setInterviewDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono font-bold"
                        />
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <span>Presets:</span>
                          <button
                            type="button"
                            onClick={() => setInterviewDate(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10))}
                            className="px-1.5 py-0.5 bg-slate-100 dark:bg-[#1A284A] hover:bg-slate-200 rounded text-[10px] font-bold text-[#0066CC] dark:text-[#38BDF8]"
                          >
                            +7 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => setInterviewDate(new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10))}
                            className="px-1.5 py-0.5 bg-slate-100 dark:bg-[#1A284A] hover:bg-slate-200 rounded text-[10px] font-bold text-[#0066CC] dark:text-[#38BDF8]"
                          >
                            +14 Days
                          </button>
                          <button
                            type="button"
                            onClick={() => setInterviewDate(new Date(Date.now() + 21 * 86400000).toISOString().slice(0, 10))}
                            className="px-1.5 py-0.5 bg-slate-100 dark:bg-[#1A284A] hover:bg-slate-200 rounded text-[10px] font-bold text-[#0066CC] dark:text-[#38BDF8]"
                          >
                            +21 Days
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Candidates will see this timeline so they can prepare their availability for technical or hiring manager rounds.
                        </p>
                      </div>

                      {/* Application Deadline */}
                      <div className="p-3 bg-white dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                        <label className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>Application Deadline *</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={deadline}
                          min={todayIso}
                          onChange={(e) => setDeadline(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-mono font-bold"
                        />
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Vacancy will be automatically tagged as closing soon within 3 days of this deadline.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('role')}
                      className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold text-xs"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('details')}
                      className="px-5 py-2.5 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span>Continue to Specs & Benefits</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 3: SPECS, AI COPILOT & BENEFITS (NEW BENEFIT SECTION & AI ASSIST)
                 ========================================================================= */}
              {activeTab === 'details' && (
                <div className="space-y-5 animate-in fade-in duration-100">
                  {/* AI Copilot Toolbar Banner */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-[#0D1527] rounded-2xl border border-blue-200 dark:border-blue-800/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Wand2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>AI Magic Assist</span>
                            <span className="text-[10px] px-2 py-0.2 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold uppercase">
                              Gemini 2.5
                            </span>
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Provide a short brief or title, then click Magic Assist to auto-generate professional descriptions, requirements, and competitive benefits!
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={isGeneratingAI}
                        onClick={() => handleGenerateWithAI('all')}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-[#0066CC] hover:from-indigo-700 hover:to-[#0052A3] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        {isGeneratingAI ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Magic Assist Writing...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-3.5 h-3.5 text-[#B5E61D]" />
                            <span>AI Magic Assist</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Optional Custom Instructions Input */}
                    <div className="flex items-center gap-2 pt-1 border-t border-blue-200/60 dark:border-blue-900/60">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <input
                        type="text"
                        value={aiCustomPrompt}
                        onChange={(e) => setAiCustomPrompt(e.target.value)}
                        placeholder="Optional prompt: e.g. Focus on high-throughput Kafka microservices, offline POS sync, and equity"
                        className="w-full bg-white dark:bg-[#131D35] px-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Short Role Summary */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300 text-xs">
                        Short Role Summary <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        disabled={isGeneratingAI}
                        onClick={() => handleGenerateWithAI('description')}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Polish Summary</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      required
                      value={shortDescription}
                      onChange={(e) => setShortDescription(e.target.value)}
                      placeholder="Brief 1-2 sentence overview of the role and its impact..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#16233F] focus:border-[#0066CC] dark:focus:border-[#38BDF8] text-slate-900 dark:text-white outline-none text-xs leading-relaxed"
                    />
                    {errors.shortDescription && (
                      <p className="text-rose-500 text-[11px] mt-1">{errors.shortDescription}</p>
                    )}
                  </div>

                  {/* Skills Tags */}
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                      Key Skills & Competencies (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={skillsText}
                      onChange={(e) => setSkillsText(e.target.value)}
                      placeholder="e.g. React, TypeScript, POS Systems, PostgreSQL, Financial Reporting"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#16233F] text-slate-900 dark:text-white outline-none text-xs font-medium"
                    />
                  </div>

                  {/* Key Responsibilities & Qualifications */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">
                          Key Responsibilities (One per line)
                        </label>
                        <button
                          type="button"
                          disabled={isGeneratingAI}
                          onClick={() => handleGenerateWithAI('responsibilities')}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>AI Suggest</span>
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={responsibilitiesText}
                        onChange={(e) => setResponsibilitiesText(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#16233F] text-slate-900 dark:text-white outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300">
                          Required Qualifications (One per line)
                        </label>
                        <button
                          type="button"
                          disabled={isGeneratingAI}
                          onClick={() => handleGenerateWithAI('qualifications')}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>AI Suggest</span>
                        </button>
                      </div>
                      <textarea
                        rows={4}
                        value={qualificationsText}
                        onChange={(e) => setQualificationsText(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-[#16233F] text-slate-900 dark:text-white outline-none leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* NEW FEATURE: Comprehensive Benefits & Perks Section */}
                  <div className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-white flex items-center gap-1.5">
                          <Gift className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                          <span>Employee Benefits, Perks & Wellness ({benefitsList.length})</span>
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Highlight perks that make your offer stand out to top engineers and leaders.
                        </p>
                      </div>

                      <button
                        type="button"
                        disabled={isGeneratingAI}
                        onClick={() => handleGenerateWithAI('benefits')}
                        className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Suggest Top Perks</span>
                      </button>
                    </div>

                    {/* Quick Add Preset Benefit Chips */}
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
                        One-Click Preset Benefits:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {BENEFIT_PRESETS.map((bp) => {
                          const isAdded = benefitsList.includes(bp);
                          return (
                            <button
                              key={bp}
                              type="button"
                              onClick={() => (isAdded ? null : handleAddBenefitChip(bp))}
                              disabled={isAdded}
                              className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                                isAdded
                                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 opacity-70'
                                  : 'bg-white dark:bg-[#131D35] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#0066CC]'
                              }`}
                            >
                              {isAdded ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-slate-400" />}
                              <span>{bp}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Active Benefits List */}
                    <div className="space-y-1.5 pt-2">
                      {benefitsList.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2.5 bg-white dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-700/80 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{benefit}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveBenefit(index)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            title="Remove benefit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Custom Benefit Input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newBenefitInput}
                        onChange={(e) => setNewBenefitInput(e.target.value)}
                        placeholder="Add a custom benefit (e.g. Relocation package, Annual home travel ticket)..."
                        className="flex-1 px-3 py-2 bg-white dark:bg-[#131D35] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC] text-xs"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomBenefit(e);
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomBenefit}
                        className="px-3.5 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('compensation')}
                      className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold text-xs"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('preview')}
                      className="px-5 py-2.5 bg-[#0066CC] hover:bg-[#0052A3] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span>Preview & Publish Vacancy</span>
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* =========================================================================
                  TAB 4: LIVE CARD PREVIEW & FINAL PUBLISH
                 ========================================================================= */}
              {activeTab === 'preview' && (
                <div className="space-y-5 animate-in fade-in duration-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8]">
                        Candidate Discovery Preview
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        How candidates will see your listing on MsmeBooks
                      </h3>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                      Verified Layout
                    </span>
                  </div>

                  {/* Render Mock Job Card */}
                  <div className="p-5 bg-white dark:bg-[#131D35] rounded-2xl border-2 border-[#0066CC]/30 dark:border-[#38BDF8]/30 shadow-md space-y-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                          <span className="font-bold text-[#0066CC] dark:text-[#38BDF8]">{companyName || 'Your Company'}</span>
                          <span>•</span>
                          <span>{department}</span>
                          <span>•</span>
                          <span>{workArrangement === 'Remote' ? 'Remote' : `${city}, ${country}`}</span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.2 rounded-md">
                            <Users className="w-3 h-3" />
                            <span>{availablePositions} Open Position{availablePositions > 1 ? 's' : ''}</span>
                          </span>
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                          {title || 'Job Title Goes Here'}
                        </h2>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-base text-[#0066CC] dark:text-[#38BDF8] font-mono">
                          {isSalaryPublic ? `${currency} ${salaryMin.toLocaleString()} - ${currency} ${salaryMax.toLocaleString()}/mo` : 'Competitive Remuneration'}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">Billed monthly</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {shortDescription || 'Your short role summary and impact statement will appear here...'}
                    </p>

                    {/* Skill chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {skillsText.split(',').map((s) => s.trim()).filter(Boolean).map((skill) => (
                        <span key={skill} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Key Highlights Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Experience</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{experienceLevel}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Work Model</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{workArrangement}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Interviews Commence</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                          {interviewDate ? new Date(interviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Flexible'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Perks & Benefits</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{benefitsList.length} Offered</span>
                      </div>
                    </div>
                  </div>

                  {/* Final Submit CTA */}
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveTab('details')}
                      className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold text-xs"
                    >
                      ← Back to Edit
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#0066CC] hover:bg-[#0052A3] text-white font-extrabold rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish Vacancy to Talent Network</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
