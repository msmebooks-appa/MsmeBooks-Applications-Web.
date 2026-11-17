import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Job } from '../types/career';
import { useCurrency } from '../context/CurrencyContext';
import { MockInterviewModal } from './MockInterviewModal';
import { IndustrySalaryTrendD3Chart, SalaryTrendDiscussionMetrics } from './IndustrySalaryTrendD3Chart';
import {
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  generateIcsContent,
  downloadIcsFile,
} from '../utils/calendarUtils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  X,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  Share2,
  Bookmark,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Copy,
  ExternalLink,
  Shield,
  Building,
  Building2,
  User,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Loader2,
  Award,
  HelpCircle,
  UploadCloud,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Check,
  BookOpen,
  RefreshCw,
  FileText,
  Zap,
  Plus,
  ArrowUpRight,
  Trash2,
  Mic,
  Play,
  Volume2,
  Users,
  Video,
  CalendarCheck,
  Download,
} from 'lucide-react';

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
  isSaved: boolean;
  onToggleSave: (jobId: string) => void;
  relatedJobs: Job[];
  allJobs?: Job[];
  savedJobIds?: string[];
  onSelectJob: (job: Job) => void;
  onViewCompanyProfile?: (companyName: string) => void;
  onDiscussSalaryTrend?: (job: Job, metrics: SalaryTrendDiscussionMetrics) => void;
  parsedResume?: any;
}

// Actionable advice generator for missing skills
const getSkillRecommendation = (
  skill: string,
  candidateSkills: string[]
): {
  priority: 'Core Requirement' | 'High Priority' | 'Recommended';
  advice: string;
  interviewFramework: string;
} => {
  const s = skill.toLowerCase();
  if (s.includes('redis') || s.includes('cache') || s.includes('memcached')) {
    return {
      priority: 'High Priority',
      advice: 'Review in-memory caching patterns (Cache-Aside, Write-Through), key TTL expirations, and Redis Pub/Sub used in POS offline sync.',
      interviewFramework: 'Be ready to discuss cache invalidation, cache stampede prevention, and session token storage.',
    };
  }
  if (s.includes('docker') || s.includes('container')) {
    return {
      priority: 'Core Requirement',
      advice: 'Practice multi-stage Docker builds, layer caching, and containerizing Node.js/PostgreSQL services with health checks.',
      interviewFramework: 'Highlight any production container experience or containerized CI/CD test pipelines.',
    };
  }
  if (s.includes('kafka') || s.includes('rabbit') || s.includes('queue') || s.includes('event')) {
    return {
      priority: 'High Priority',
      advice: 'Understand message broker partitioning, consumer groups, dead-letter queues (DLQ), and idempotent event consumers.',
      interviewFramework: 'Relate this to asynchronous transaction processing and offline ledger event buffering.',
    };
  }
  if (s.includes('postgres') || s.includes('sql') || s.includes('database')) {
    return {
      priority: 'Core Requirement',
      advice: 'Review composite B-Tree/GIN indexing, transaction isolation levels (Read Committed vs Serializable), and EXPLAIN ANALYZE.',
      interviewFramework: 'Explain database concurrency control, connection pooling (PgBouncer), and multi-tenant schema isolation.',
    };
  }
  if (s.includes('typescript')) {
    return {
      priority: 'Core Requirement',
      advice: 'Demonstrate deep type safety: discriminated unions, generic constraints, conditional types, and strict null checks.',
      interviewFramework: 'Show how rigorous TypeScript models prevent runtime regressions in financial calculation engines.',
    };
  }
  if (s.includes('python')) {
    return {
      priority: 'Core Requirement',
      advice: 'Brush up on asyncio concurrency, FastAPI/Django ORM query optimization, and typing annotations.',
      interviewFramework: 'Prepare to discuss Python backend architecture, GIL limitations, and worker scaling.',
    };
  }
  if (s.includes('react') || s.includes('next') || s.includes('frontend')) {
    return {
      priority: 'Core Requirement',
      advice: 'Focus on state management architecture, client vs server components, rendering performance, and offline-first caches.',
      interviewFramework: 'Demonstrate building resilient responsive interfaces that work well on low-bandwidth mobile connections.',
    };
  }
  if (s.includes('aws') || s.includes('cloud') || s.includes('gcp') || s.includes('azure')) {
    return {
      priority: 'Recommended',
      advice: 'Review managed infrastructure (ECS/EKS, RDS, S3, IAM policies, and VPC subnets) and cost-conscious African cloud hosting.',
      interviewFramework: 'Discuss high-availability architectures across multi-region and edge deployments.',
    };
  }
  if (s.includes('product') || s.includes('agile') || s.includes('scrum') || s.includes('strategy')) {
    return {
      priority: 'Core Requirement',
      advice: 'Prepare to walk through your feature prioritization framework (RICE, MoSCoW), user story mapping, and sprint velocity.',
      interviewFramework: 'Bring a concrete narrative of how you validated a customer hypothesis with African merchants.',
    };
  }
  if (s.includes('sales') || s.includes('growth') || s.includes('b2b')) {
    return {
      priority: 'High Priority',
      advice: 'Structure your consultation process: discovery calls, qualification (BANT), and navigating enterprise procurement cycles.',
      interviewFramework: 'Share metrics on closing velocity, account expansion, and building merchant trust.',
    };
  }
  return {
    priority: 'Recommended',
    advice: `Leverage your existing strengths in ${candidateSkills.slice(0, 2).join(' and ') || 'software & business operations'}, and show fast learning velocity for ${skill}.`,
    interviewFramework: `Prepare a concise 60-second explanation of how you quickly master new technologies like ${skill}.`,
  };
};

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  job,
  onClose,
  onApply,
  isSaved,
  onToggleSave,
  relatedJobs,
  allJobs,
  savedJobIds,
  onSelectJob,
  onViewCompanyProfile,
  onDiscussSalaryTrend,
  parsedResume: propParsedResume,
}) => {
  const { formatSalaryRange, formatAmount } = useCurrency();
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [selectedBenchmarkRegion, setSelectedBenchmarkRegion] = useState('Pan-African Market');

  // Real-time Salary Benchmark Data for Recharts
  const salaryBenchmarkData = useMemo(() => {
    if (!job) return [];
    const regionMultipliers: Record<string, number> = {
      'Pan-African Market': 1.0,
      'Lagos, Nigeria': 0.95,
      'Nairobi, Kenya': 1.05,
      'Kigali, Rwanda': 0.90,
      'Accra, Ghana': 0.92,
      'Johannesburg, South Africa': 1.15,
      'Remote Worldwide': 1.25,
    };
    const mult = regionMultipliers[selectedBenchmarkRegion] || 1.0;
    const minOffer = Math.round(job.salary.min);
    const maxOffer = Math.round(job.salary.max);
    const midOffer = Math.round((minOffer + maxOffer) / 2);

    return [
      {
        tier: '25th Pct',
        marketAverage: Math.round(minOffer * 0.8 * mult),
        thisJobOffer: 0,
        benchmarkLabel: '25th Percentile Base',
      },
      {
        tier: 'Median (50th)',
        marketAverage: Math.round(midOffer * 0.92 * mult),
        thisJobOffer: 0,
        benchmarkLabel: 'Market Median',
      },
      {
        tier: 'This Job Offer',
        marketAverage: Math.round(midOffer * 0.95 * mult),
        thisJobOffer: midOffer,
        benchmarkLabel: 'This Role Midpoint',
      },
      {
        tier: '75th Pct',
        marketAverage: Math.round(maxOffer * 1.06 * mult),
        thisJobOffer: 0,
        benchmarkLabel: '75th Percentile Senior',
      },
      {
        tier: '90th Pct',
        marketAverage: Math.round(maxOffer * 1.22 * mult),
        thisJobOffer: 0,
        benchmarkLabel: 'Top 10% Industry Cap',
      },
    ];
  }, [job, selectedBenchmarkRegion]);

  const modalScrollRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Smoothly scroll modal to top when viewing a new job
  useEffect(() => {
    modalScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    if (carouselRef.current) {
      carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [job?.id]);

  // Algorithmic similar roles recommendation engine
  const recommendedRoles = useMemo(() => {
    if (!job) return [];
    const pool = (allJobs && allJobs.length > 0 ? allJobs : relatedJobs).filter(
      (item) => item.id !== job.id && (item.status === 'published' || !item.status)
    );

    const scored = pool.map((other) => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Same Company (Major algorithmic booster)
      const currentCompany = (job.company?.name || '').trim().toLowerCase();
      const otherCompany = (other.company?.name || '').trim().toLowerCase();
      const isSameCompany = Boolean(currentCompany && otherCompany && currentCompany === otherCompany);
      if (isSameCompany) {
        score += 55;
        reasons.push('Same Company');
      }

      // 2. Same Category / Department (Major algorithmic booster)
      const currentDept = (job.department || '').trim().toLowerCase();
      const otherDept = (other.department || '').trim().toLowerCase();
      const isSameCategory = Boolean(currentDept && otherDept && currentDept === otherDept);
      if (isSameCategory) {
        score += 45;
        reasons.push('Same Category');
      }

      // 3. Same Industry
      const currentInd = (job.industry || '').trim().toLowerCase();
      const otherInd = (other.industry || '').trim().toLowerCase();
      if (currentInd && otherInd && currentInd === otherInd && !isSameCategory) {
        score += 15;
      }

      // 4. Shared Skills Synergy
      const currentSkills = (job.skills || []).map((s) => s.trim().toLowerCase());
      const otherSkills = other.skills || [];
      const shared = otherSkills.filter((s) => currentSkills.includes(s.trim().toLowerCase()));
      if (shared.length > 0) {
        score += Math.min(30, shared.length * 8);
        reasons.push(`${shared.length} Shared Skill${shared.length > 1 ? 's' : ''}`);
      }

      // 5. Work Arrangement Compatibility
      if (other.workArrangement === job.workArrangement) {
        score += 12;
      }

      // 6. Geographic / Country Match
      if (other.location?.country && job.location?.country && other.location.country === job.location.country) {
        score += 10;
      }

      // 7. Experience Level Synergy
      if (other.experienceLevel && job.experienceLevel && other.experienceLevel === job.experienceLevel) {
        score += 8;
      }

      // Match percentage calculation (curated between 68% and 99%)
      const matchPercentage = Math.min(99, Math.max(68, Math.round(55 + (score / 140) * 44)));

      let primaryReason = 'Recommended Role';
      if (isSameCompany && isSameCategory) {
        primaryReason = 'Same Company & Category';
      } else if (isSameCompany) {
        primaryReason = `Same Company: ${other.company?.name || 'Partner'}`;
      } else if (isSameCategory) {
        primaryReason = `Same Category: ${other.department}`;
      } else if (shared.length > 0) {
        primaryReason = `${shared.length} Matching Skills`;
      } else if (other.workArrangement === job.workArrangement) {
        primaryReason = `${other.workArrangement} Role`;
      }

      return {
        job: other,
        score,
        matchPercentage,
        primaryReason,
        reasons,
        sameCompany: isSameCompany,
        sameCategory: isSameCategory,
        sharedSkills: shared,
      };
    });

    return scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.sameCompany !== a.sameCompany) return b.sameCompany ? 1 : -1;
      if (b.sameCategory !== a.sameCategory) return b.sameCategory ? 1 : -1;
      return b.sharedSkills.length - a.sharedSkills.length;
    });
  }, [job, allJobs, relatedJobs]);

  const updateScrollButtons = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  useEffect(() => {
    updateScrollButtons();
    const node = carouselRef.current;
    if (node) {
      node.addEventListener('scroll', updateScrollButtons, { passive: true });
      return () => node.removeEventListener('scroll', updateScrollButtons);
    }
  }, [recommendedRoles]);

  const handleScrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollOffset = carouselRef.current.clientWidth * 0.78;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollOffset : scrollOffset,
      behavior: 'smooth',
    });
  };

  const handleSelectRecommendedRole = (targetJob: Job) => {
    onSelectJob(targetJob);
    modalScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [showSecondaryMenu, setShowSecondaryMenu] = useState(true);
  const [selectedPreviewPlatform, setSelectedPreviewPlatform] = useState<
    'general' | 'linkedin' | 'twitter' | 'whatsapp' | 'instagram' | 'facebook'
  >('general');

  // Skill Gap Analysis State & Stored Resume Integration
  const [storedResume, setStoredResume] = useState<any>(() => {
    if (propParsedResume) return propParsedResume;
    try {
      const saved = localStorage.getItem('msmebooks_parsed_resume');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isParsingGapResume, setIsParsingGapResume] = useState(false);
  const [gapParseStatus, setGapParseStatus] = useState('');
  const [gapActiveFilter, setGapActiveFilter] = useState<'all' | 'matched' | 'missing' | 'extra'>('all');
  const [userAddedSkills, setUserAddedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);

  // Sync with global updates from ApplicationModal or other tabs
  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('msmebooks_parsed_resume');
        if (saved) setStoredResume(JSON.parse(saved));
      } catch {}
    };
    window.addEventListener('msmebooks_resume_updated', handleSync);
    return () => window.removeEventListener('msmebooks_resume_updated', handleSync);
  }, []);

  const handleUploadResumeForGap = async (file: File) => {
    if (!job) return;
    setIsParsingGapResume(true);
    setGapParseStatus('Extracting skills & credentials with Gemini AI...');
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const base64Data = await base64Promise;

      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type || 'application/pdf',
          fileBase64: base64Data,
          jobTitle: job.title,
          jobDepartment: job.department,
          jobSkills: job.skills,
        }),
      });

      if (!res.ok) throw new Error('Parsing failed');
      const result = await res.json();
      if (result.success && result.data) {
        const payload = {
          ...result.data,
          fileName: file.name,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          parsedAt: new Date().toISOString(),
        };
        setStoredResume(payload);
        try {
          localStorage.setItem('msmebooks_parsed_resume', JSON.stringify(payload));
          window.dispatchEvent(new Event('msmebooks_resume_updated'));
        } catch {}
      }
    } catch (e) {
      console.warn('Fallback resume parsing in JobDetailsModal:', e);
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const fallback = {
        firstName: cleanName.split(' ')[0] || 'Candidate',
        lastName: cleanName.split(' ')[1] || 'Applicant',
        email: 'applicant@example.com',
        phone: '+234 803 123 4567',
        yearsOfExperience: 4,
        currentJobTitle: job.title,
        skills: job.skills.length > 2 ? job.skills.slice(0, job.skills.length - 1) : ['TypeScript', 'Node.js', 'PostgreSQL'],
        fileName: file.name,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        parsedAt: new Date().toISOString(),
      };
      setStoredResume(fallback);
      try {
        localStorage.setItem('msmebooks_parsed_resume', JSON.stringify(fallback));
        window.dispatchEvent(new Event('msmebooks_resume_updated'));
      } catch {}
    } finally {
      setIsParsingGapResume(false);
      setGapParseStatus('');
    }
  };

  const handleLoadSampleResumeForGap = async (type: 'tech' | 'product') => {
    if (!job) return;
    setIsParsingGapResume(true);
    setGapParseStatus('Loading verified profile into Skill Gap Analyzer...');
    const sampleFileName =
      type === 'tech'
        ? 'Olumide_Adebayo_Senior_Fullstack_Engineer_CV.pdf'
        : 'Amina_Bello_Principal_Product_Manager_CV.docx';

    const sampleText =
      type === 'tech'
        ? `OLUMIDE ADEBAYO - Senior Software Engineer. Skills: TypeScript, JavaScript, Node.js, React, PostgreSQL, Docker, Redis, Kafka, AWS, GraphQL, Git, Microservices, CI/CD`
        : `AMINA BELLO - Principal Product Manager. Skills: Product Strategy, Agile, User Research, FinTech, API Design, SQL, Growth, Figma, Roadmapping`;

    try {
      const res = await fetch('/api/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: sampleFileName,
          mimeType: type === 'tech' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          extractedText: sampleText,
          jobTitle: job.title,
          jobDepartment: job.department,
          jobSkills: job.skills,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const payload = {
            ...result.data,
            fileName: sampleFileName,
            fileSize: '1.4 MB',
            parsedAt: new Date().toISOString(),
          };
          setStoredResume(payload);
          try {
            localStorage.setItem('msmebooks_parsed_resume', JSON.stringify(payload));
            window.dispatchEvent(new Event('msmebooks_resume_updated'));
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Sample load fallback', e);
    } finally {
      setIsParsingGapResume(false);
      setGapParseStatus('');
    }
  };

  const handleClearStoredResume = () => {
    setStoredResume(null);
    setUserAddedSkills([]);
    try {
      localStorage.removeItem('msmebooks_parsed_resume');
      window.dispatchEvent(new Event('msmebooks_resume_updated'));
    } catch {}
  };

  const handleAddKnownSkill = (skill: string) => {
    if (!userAddedSkills.includes(skill)) {
      setUserAddedSkills((prev) => [...prev, skill]);
    }
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !userAddedSkills.includes(trimmed)) {
      setUserAddedSkills((prev) => [...prev, trimmed]);
      setCustomSkillInput('');
      setShowAddSkillInput(false);
    }
  };

  // Skill sets calculation
  const candidateSkills: string[] = useMemo(() => {
    const fromResume = (storedResume?.skills as string[]) || [];
    return Array.from(new Set([...fromResume, ...userAddedSkills]));
  }, [storedResume, userAddedSkills]);

  const jobSkills: string[] = useMemo(() => (job ? job.skills || [] : []), [job]);

  const matchedSkills = useMemo(() => {
    return jobSkills.filter((js) =>
      candidateSkills.some(
        (cs) =>
          cs.toLowerCase() === js.toLowerCase() ||
          cs.toLowerCase().includes(js.toLowerCase()) ||
          js.toLowerCase().includes(cs.toLowerCase())
      )
    );
  }, [jobSkills, candidateSkills]);

  const missingSkills = useMemo(() => {
    return jobSkills.filter(
      (js) => !matchedSkills.some((ms: string) => ms.toLowerCase() === js.toLowerCase())
    );
  }, [jobSkills, matchedSkills]);

  const extraCandidateSkills = useMemo(() => {
    return candidateSkills.filter(
      (cs) =>
        !jobSkills.some(
          (js) =>
            js.toLowerCase() === cs.toLowerCase() ||
            cs.toLowerCase().includes(js.toLowerCase()) ||
            js.toLowerCase().includes(cs.toLowerCase())
        )
    );
  }, [candidateSkills, jobSkills]);

  const matchPercentage = useMemo(() => {
    if (jobSkills.length === 0) return 100;
    const basePct = Math.round((matchedSkills.length / jobSkills.length) * 100);
    return Math.min(100, Math.max(0, basePct));
  }, [matchedSkills, jobSkills]);

  // Interview Prep Guide state
  const [showInterviewPrep, setShowInterviewPrep] = useState(true);
  const [showMockInterviewModal, setShowMockInterviewModal] = useState(false);
  const [prepLoading, setPrepLoading] = useState(false);
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);
  const [interviewPrepData, setInterviewPrepData] = useState<{
    companyCultureTips: string[];
    roleSpecificTips: string[];
    commonQuestions: {
      question: string;
      category: string;
      whatInterviewersLookFor: string;
      recommendedFramework: string;
    }[];
    questionsToAskInterviewer: string[];
    keySuccessFactors: string[];
  } | null>(null);

  const fetchInterviewPrep = async () => {
    if (!job) return;
    setPrepLoading(true);
    try {
      const res = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: job.title,
          department: job.department,
          skills: job.skills,
          companyName: job.company?.name || 'MsmeBooks',
          aboutRole: job.aboutRole || job.shortDescription,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setInterviewPrepData(data);
      }
    } catch (e) {
      console.warn('Failed to fetch AI interview prep', e);
    } finally {
      setPrepLoading(false);
    }
  };

  useEffect(() => {
    if (job) {
      // Initialize or load prep guide for the active job
      fetchInterviewPrep();
    }
  }, [job?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  // Automated Interview Scheduling Calendar State (hooks declared cleanly above early return)
  const upcomingInterviewDays = useMemo(() => {
    const days: Array<{ isoDate: string; dayShort: string; dateNum: string; monthShort: string }> = [];
    const cursor = new Date();
    cursor.setDate(cursor.getDate() + 1);
    while (days.length < 5) {
      const dow = cursor.getDay();
      if (dow !== 0 && dow !== 6) {
        days.push({
          isoDate: cursor.toISOString().slice(0, 10),
          dayShort: cursor.toLocaleDateString('en-US', { weekday: 'short' }),
          dateNum: String(cursor.getDate()),
          monthShort: cursor.toLocaleDateString('en-US', { month: 'short' }),
        });
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return days;
  }, []);

  const [selectedScheduleDayIdx, setSelectedScheduleDayIdx] = useState(0);
  const [selectedScheduleSlot, setSelectedScheduleSlot] = useState('11:00');
  const [selectedSessionFormat, setSelectedSessionFormat] = useState<
    'Technical Screening Call' | 'Hiring Manager Intro' | 'Architecture & Portfolio Review'
  >('Technical Screening Call');
  const [bookedInterview, setBookedInterview] = useState<{
    id: string;
    jobId: string;
    jobTitle: string;
    companyName: string;
    interviewDate: string;
    meetingType: string;
    interviewerName: string;
    meetingUrl: string;
  } | null>(null);
  const [bookingJustConfirmed, setBookingJustConfirmed] = useState(false);

  useEffect(() => {
    if (!job) {
      setBookedInterview(null);
      return;
    }
    try {
      const stored = JSON.parse(localStorage.getItem('msmebooks_candidate_interviews') || '[]');
      const existing = Array.isArray(stored) ? stored.find((item: any) => item.jobId === job.id) : null;
      setBookedInterview(existing || null);
    } catch {
      setBookedInterview(null);
    }
  }, [job?.id]);

  if (!job) return null;

  const selectedDayObj = upcomingInterviewDays[selectedScheduleDayIdx] || upcomingInterviewDays[0];
  const activeInterviewIso = bookedInterview
    ? bookedInterview.interviewDate
    : `${selectedDayObj.isoDate}T${selectedScheduleSlot}:00Z`;

  const calendarEventPayload = {
    id: bookedInterview?.id || `sched-${job.id}`,
    candidateName: 'Candidate',
    jobTitle: job.title,
    companyName: job.company?.name || 'MsmeBooks Technologies',
    interviewDate: activeInterviewIso,
    durationMinutes: 45,
    meetingType: bookedInterview?.meetingType || selectedSessionFormat,
    meetingUrl: 'https://meet.google.com/msme-talent-call',
    interviewerName: 'Adaobi Vance (Head of Talent)',
    referenceCode: job.referenceCode,
  };

  const handleConfirmInterviewBooking = () => {
    const newBooking = {
      id: `int-${job.id}-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.company?.name || 'MsmeBooks',
      interviewDate: `${selectedDayObj.isoDate}T${selectedScheduleSlot}:00Z`,
      meetingType: selectedSessionFormat,
      interviewerName: 'Adaobi Vance',
      meetingUrl: 'https://meet.google.com/msme-talent-call',
    };
    try {
      const existing = JSON.parse(localStorage.getItem('msmebooks_candidate_interviews') || '[]');
      const filtered = Array.isArray(existing) ? existing.filter((i: any) => i.jobId !== job.id) : [];
      const updated = [newBooking, ...filtered];
      localStorage.setItem('msmebooks_candidate_interviews', JSON.stringify(updated));
      window.dispatchEvent(new Event('msmebooks_interviews_updated'));
    } catch {}
    setBookedInterview(newBooking);
    setBookingJustConfirmed(true);
    setTimeout(() => setBookingJustConfirmed(false), 3500);
  };

  const getShareUrl = () => `${window.location.origin}/?job=${encodeURIComponent(job.slug || job.id)}`;

  const copyTextToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Fallback below
    }
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(textarea);
      return copied;
    } catch {
      return false;
    }
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    await copyTextToClipboard(url);
    setCopiedLink(true);
    setShareFeedback('Job link copied to clipboard!');
    setTimeout(() => {
      setCopiedLink(false);
      setShareFeedback(null);
    }, 2500);
  };

  const handleNativeShare = async () => {
    const url = getShareUrl();
    const shareData = {
      title: `${job.title} — MsmeBooks Careers`,
      text: `Explore this opportunity for ${job.title} in ${job.department} at ${job.company?.name || 'MsmeBooks'} (${job.location.city}, ${job.location.country} · ${job.workArrangement}):`,
      url,
    };

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        if (navigator.canShare && !navigator.canShare(shareData)) {
          await handleCopyLink();
          return;
        }
        await navigator.share(shareData);
        setShareFeedback('Shared successfully!');
        setTimeout(() => setShareFeedback(null), 2500);
      } catch (err: any) {
        // If candidate aborted / dismissed the share sheet, do not error; fallback on genuine failure
        if (err?.name !== 'AbortError') {
          await handleCopyLink();
        }
      }
    } else {
      // Fallback to clipboard copy on browsers without Web Share API
      await handleCopyLink();
    }
  };

  const getShareMessage = (platform: 'linkedin' | 'twitter' | 'whatsapp' | 'instagram' | 'facebook' | 'general') => {
    const url = getShareUrl();
    switch (platform) {
      case 'linkedin':
        return `Excited to share this opportunity: ${job.title} at MsmeBooks (${job.location.city}, ${job.location.country} · ${job.workArrangement}). Shape the future of African business: ${url}`;
      case 'twitter':
        return `MsmeBooks is hiring a ${job.title} (${job.workArrangement}) in ${job.location.city}! Explore the position and apply: ${url} #MsmeBooks #AfricaTech #Hiring`;
      case 'whatsapp':
        return `Hi! Check out this open role at MsmeBooks: *${job.title}* (${job.workArrangement} · ${job.location.city}, ${job.location.country}). Apply here: ${url}`;
      case 'instagram':
        return `🚀 We're hiring at MsmeBooks! Exciting opening for a ${job.title} (${job.department}) in ${job.location.city}, ${job.location.country}. Join the team building the future of African commerce. Details & application: ${url} #MsmeBooks #Hiring #AfricaTech`;
      case 'facebook':
        return `Join MsmeBooks as ${job.title} (${job.workArrangement} · ${job.department}). Empowering thousands of African businesses! Check out the role: ${url}`;
      default:
        return `Explore this opportunity for ${job.title} in ${job.department} at MsmeBooks (${job.location.city}, ${job.location.country} · ${job.workArrangement}): ${url}`;
    }
  };

  const handleShare = (platform: 'linkedin' | 'twitter' | 'whatsapp' | 'instagram' | 'facebook') => {
    const url = getShareUrl();
    const encodedUrl = encodeURIComponent(url);
    setSelectedPreviewPlatform(platform);

    // Copy direct application link to clipboard as required by prompts
    try {
      navigator.clipboard.writeText(url);
      setShareFeedback(`Direct application link copied to clipboard! Pre-formatting ${platform.toUpperCase()} post...`);
      setTimeout(() => setShareFeedback(null), 3000);
    } catch {}

    if (platform === 'instagram') {
      const caption = getShareMessage('instagram');
      navigator.clipboard.writeText(caption);
      setShareFeedback('Instagram caption & link copied to clipboard! Opening Instagram...');
      setTimeout(() => setShareFeedback(null), 3000);
      window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');
      return;
    }

    let shareUrl = '';
    if (platform === 'linkedin') {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    } else if (platform === 'twitter') {
      const text = encodeURIComponent(`MsmeBooks is hiring a ${job.title} (${job.workArrangement}) in ${job.location.city}! Explore the position and apply:`);
      shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodedUrl}&hashtags=MsmeBooks,AfricaTech,Hiring`;
    } else if (platform === 'facebook') {
      const quote = encodeURIComponent(getShareMessage('facebook'));
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${quote}`;
    } else if (platform === 'whatsapp') {
      const text = encodeURIComponent(getShareMessage('whatsapp'));
      shareUrl = `https://api.whatsapp.com/send?text=${text}`;
    }
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=620,height=580');
  };

  const handleCopyMessage = async (platform?: 'linkedin' | 'twitter' | 'whatsapp' | 'instagram' | 'facebook' | 'general') => {
    const targetPlatform = platform || selectedPreviewPlatform;
    const message = getShareMessage(targetPlatform);
    await copyTextToClipboard(message);
    setShareFeedback(`Pre-filled post for ${targetPlatform.toUpperCase()} copied!`);
    setTimeout(() => setShareFeedback(null), 2500);
  };

  const formatSalary = () => {
    return formatSalaryRange(
      job.salary.min,
      job.salary.max,
      job.salary.currency,
      job.salary.period,
      job.salary.isPublic
    );
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  // Structured Data Schema for JobPosting (SEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.aboutRole,
    identifier: {
      '@type': 'PropertyValue',
      name: 'MsmeBooks',
      value: job.referenceCode,
    },
    datePosted: job.datePosted,
    validThrough: job.applicationDeadline,
    employmentType: job.employmentType.toUpperCase().replace('-', '_'),
    hiringOrganization: {
      '@type': 'Organization',
      name: 'MsmeBooks',
      sameAs: 'https://www.msmebooks.org',
      logo: 'https://www.msmebooks.org/logo.png',
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location.city,
        addressCountry: job.location.country,
      },
    },
    baseSalary: job.salary.isPublic
      ? {
          '@type': 'MonetaryAmount',
          currency: job.salary.currency,
          value: {
            '@type': 'QuantitativeValue',
            minValue: job.salary.min,
            maxValue: job.salary.max,
            unitText: job.salary.period.toUpperCase(),
          },
        }
      : undefined,
  };

  return (
    <motion.div
      key="job-details-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-details-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-sm flex justify-center p-3 sm:p-6 lg:p-8"
    >
      {/* Dynamic SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <motion.div
        key="job-details-modal-content"
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{
          duration: 0.22,
          ease: [0.16, 1, 0.3, 1],
        }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-[#131D35] rounded-2xl max-w-5xl w-full shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden my-auto flex flex-col max-h-[92vh] transition-colors duration-200"
      >
        {/* Top Header & Breadcrumb Bar */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-[#0D1527] shrink-0">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 truncate">
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer" onClick={onClose}>
              Home
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span className="hover:text-slate-900 dark:hover:text-white cursor-pointer" onClick={onClose}>
              Careers
            </span>
            <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span className="text-[#0066CC] dark:text-[#38BDF8] font-semibold">{job.department}</span>
            <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span className="text-slate-800 dark:text-slate-200 font-medium truncate">{job.title}</span>
          </nav>

          <div className="flex items-center gap-2 ml-4 shrink-0">
            {shareFeedback && (
              <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
                <Check className="w-3 h-3" />
                <span>{shareFeedback}</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleNativeShare}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors shadow-xs cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  : 'text-slate-700 dark:text-slate-200 hover:text-[#0066CC] dark:hover:text-[#38BDF8] bg-white dark:bg-[#1A284A] hover:bg-slate-100 dark:hover:bg-[#20325A] border-slate-200 dark:border-slate-700'
              }`}
              title="Share job URL via native share sheet or copy link"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Share2 className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
              )}
              <span>{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0066CC] dark:hover:text-[#38BDF8] bg-white dark:bg-[#1A284A] hover:bg-slate-100 dark:hover:bg-[#20325A] border border-slate-200 dark:border-slate-700 rounded-lg transition-colors shadow-xs cursor-pointer"
              title="Copy job URL to clipboard"
              aria-label="Copy job URL"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-lg transition-colors"
              aria-label="Close job details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div ref={modalScrollRef} className="overflow-y-auto p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Main Column: Role Deep Dive */}
            <div className="lg:col-span-8 space-y-8">
              {/* Header Title & Badges */}
              <div>
                {/* Hiring Employer / Company Badge */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-[#1A284A] rounded-xl text-xs">
                    {job.company?.employerType === 'Individual' ? (
                      <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    ) : (
                      <Building2 className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8] shrink-0" />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (onViewCompanyProfile) onViewCompanyProfile(job.company?.name || 'MsmeBooks Technologies');
                      }}
                      className="font-bold text-[#14243A] dark:text-white hover:text-[#0066CC] dark:hover:text-[#38BDF8] hover:underline cursor-pointer text-left"
                      title="View company profile, benefits & all active openings"
                    >
                      {job.company?.name || 'MsmeBooks'}
                    </button>
                    {job.company?.verified && (
                      <span className="inline-flex items-center gap-0.5 text-[#0066CC] dark:text-[#38BDF8] font-semibold text-[11px]" title="Verified Employer">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    )}
                    <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 bg-white dark:bg-[#131D35] text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-700">
                      {job.company?.employerType || 'Company'}
                    </span>
                  </div>

                  {onViewCompanyProfile && (
                    <button
                      type="button"
                      onClick={() => onViewCompanyProfile(job.company?.name || 'MsmeBooks Technologies')}
                      className="inline-flex items-center gap-1 text-xs text-[#0066CC] dark:text-[#38BDF8] hover:underline font-semibold cursor-pointer"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Company Profile & Openings</span>
                    </button>
                  )}

                  {job.company?.website && (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:underline font-medium"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">
                  <span className="text-[#0066CC] dark:text-[#38BDF8] font-bold">{job.department}</span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{job.referenceCode}</span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span>{job.workArrangement}</span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span>{job.employmentType}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14243A] dark:text-white leading-tight">
                  {job.title}
                </h1>

                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mt-3">
                  {job.shortDescription}
                </p>
              </div>

              {/* Quick Metrics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-4 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Location</div>
                  <div className="font-bold text-[#14243A] dark:text-white mt-0.5 truncate">{job.location.city}, {job.location.country}</div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Experience</div>
                  <div className="font-bold text-[#14243A] dark:text-white mt-0.5">{job.experienceLevel}</div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Compensation</div>
                  <div className="font-bold text-[#0066CC] dark:text-[#38BDF8] mt-0.5 font-mono tabular-nums">{formatSalary()}</div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#0066CC] dark:text-[#38BDF8]" />
                    <span>Openings</span>
                  </div>
                  <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {job.availablePositions || 1} {job.availablePositions === 1 ? 'Position' : 'Positions'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#0066CC] dark:text-[#38BDF8]" />
                    <span>Interviews</span>
                  </div>
                  <div className="font-bold text-[#14243A] dark:text-white mt-0.5">
                    {job.interviewDate
                      ? new Date(job.interviewDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Rolling Screening'}
                  </div>
                </div>
              </div>

              {/* REAL-TIME SALARY COMPARISON CHART (RECHARTS) */}
              <section className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-[#14243A] dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                        <span>AI-Powered Salary Insights & Market Benchmark</span>
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B5E61D] text-[#14243A]">
                        Live Recharts
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Visualizing {job.title} compensation against regional percentiles and tech market averages.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">Region:</span>
                    <select
                      value={selectedBenchmarkRegion}
                      onChange={(e) => setSelectedBenchmarkRegion(e.target.value)}
                      className="px-2.5 py-1 text-xs font-bold bg-slate-50 dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] rounded-lg border border-slate-200 dark:border-slate-700 outline-none cursor-pointer"
                    >
                      <option value="Pan-African Market">🌍 Pan-African Market Average</option>
                      <option value="Lagos, Nigeria">🇳🇬 Lagos, Nigeria</option>
                      <option value="Nairobi, Kenya">🇰🇪 Nairobi, Kenya</option>
                      <option value="Kigali, Rwanda">🇷🇼 Kigali, Rwanda</option>
                      <option value="Accra, Ghana">🇬🇭 Accra, Ghana</option>
                      <option value="Johannesburg, South Africa">🇿🇦 Johannesburg, South Africa</option>
                      <option value="Remote Worldwide">🌐 Remote Worldwide</option>
                    </select>
                  </div>
                </div>

                {/* Offer vs Market Stats Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">This Vacancy Offer</span>
                    <span className="font-extrabold text-[#0066CC] dark:text-[#38BDF8] text-sm font-mono">
                      {formatSalary()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">{selectedBenchmarkRegion} Median</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm font-mono">
                      {formatAmount(Math.round(((job.salary.min + job.salary.max) / 2) * 0.92))}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Market Positioning</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Top 25% Competitive</span>
                    </span>
                  </div>
                </div>

                {/* Recharts Bar Chart Container */}
                <div className="w-full h-64 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={salaryBenchmarkData}
                      margin={{ top: 15, right: 10, left: 0, bottom: 25 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis
                        dataKey="tier"
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        interval={0}
                        angle={-10}
                        textAnchor="end"
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#64748B' }}
                        tickFormatter={(v) => formatAmount(v)}
                      />
                      <Tooltip
                        formatter={(val: any, name: any) => [
                          formatAmount(Number(val) || 0),
                          name === 'thisJobOffer' ? 'This Role Offer Midpoint' : 'Regional Market Benchmark',
                        ]}
                        contentStyle={{
                          backgroundColor: '#14243A',
                          borderColor: '#0066CC',
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '12px',
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                      <Bar
                        dataKey="marketAverage"
                        name="Regional Market Benchmark"
                        fill="#94A3B8"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="thisJobOffer"
                        name="This Position Midpoint"
                        fill="#0066CC"
                        radius={[6, 6, 0, 0]}
                      >
                        {salaryBenchmarkData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.thisJobOffer > 0 ? '#0066CC' : '#CBD5E1'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* D3.js 12-Month Market Salary Trend */}
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <IndustrySalaryTrendD3Chart
                    job={job}
                    onDiscussSalaryTrend={onDiscussSalaryTrend}
                  />
                </div>
              </section>

              {/* About the Role */}
              <section>
                <h2 className="text-lg font-bold text-[#14243A] dark:text-white mb-3">About the Role</h2>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">{job.aboutRole}</p>
              </section>

              {/* Key Responsibilities */}
              <section>
                <h2 className="text-lg font-bold text-[#14243A] dark:text-white mb-3">Key Responsibilities</h2>
                <ul className="space-y-2.5">
                  {job.keyResponsibilities.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0066CC] dark:bg-[#38BDF8] mt-2 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Required Qualifications */}
              <section>
                <h2 className="text-lg font-bold text-[#14243A] dark:text-white mb-3">Required Qualifications</h2>
                <ul className="space-y-2.5">
                  {job.requiredQualifications.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Preferred Qualifications */}
              {job.preferredQualifications.length > 0 && (
                <section>
                  <h2 className="text-lg font-bold text-[#14243A] dark:text-white mb-3">Preferred Qualifications</h2>
                  <ul className="space-y-2.5">
                    {job.preferredQualifications.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#B5E61D] mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Technical & Interpersonal Skills */}
              <section>
                <h2 className="text-lg font-bold text-[#14243A] dark:text-white mb-3">Relevant Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-slate-100 dark:bg-[#1A284A] text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              {/* SKILL GAP ANALYSIS & MATCH RATING SECTION */}
              <section className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-50 dark:from-[#0D1527] dark:via-[#131E3D] dark:to-[#0D1527] rounded-2xl border border-blue-200/90 dark:border-blue-900/60 p-5 sm:p-6 shadow-sm overflow-hidden transition-all">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0066CC] to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                      {isParsingGapResume ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <TrendingUp className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-bold text-[#14243A] dark:text-white leading-tight">
                          Skill Gap Analysis & Match Rating
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B5E61D] text-[#14243A] flex items-center gap-1">
                          <Zap className="w-2.5 h-2.5 fill-current" /> AI Powered
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {storedResume
                          ? `Comparing skills from ${storedResume.firstName ? `${storedResume.firstName}'s resume` : 'your resume'} (${storedResume.fileName || 'Verified Document'}) against ${job.title} requirements.`
                          : `Upload your resume to compare your background directly against ${job.title} requirements and discover actionable preparation tips for missing skills.`}
                      </p>
                    </div>
                  </div>

                  {/* Actions / Upload Button if Resume Exists */}
                  {storedResume && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <label className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#20325A] border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer">
                        <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Replace CV</span>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => {
                            if (e.target.files?.[0]) handleUploadResumeForGap(e.target.files[0]);
                          }}
                          className="hidden"
                          disabled={isParsingGapResume}
                        />
                      </label>
                      <button
                        onClick={handleClearStoredResume}
                        className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Clear parsed resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Parsing indicator */}
                {isParsingGapResume && (
                  <div className="p-4 mb-4 bg-blue-50/80 dark:bg-blue-950/60 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center gap-2.5 text-xs font-semibold text-[#0066CC] dark:text-[#38BDF8] animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin text-[#0066CC] dark:text-[#38BDF8]" />
                    <span>{gapParseStatus || 'Analyzing resume and matching skills with Gemini AI...'}</span>
                  </div>
                )}

                {/* SCENARIO A: No Resume Uploaded Yet */}
                {!storedResume && !isParsingGapResume && (
                  <div className="bg-white/80 dark:bg-[#101A33] border border-dashed border-blue-200 dark:border-slate-700 rounded-xl p-5 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] flex items-center justify-center">
                        <UploadCloud className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-[#14243A] dark:text-white">
                          No Resume Uploaded Yet
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          Upload your PDF or DOCX resume to calculate your exact competency score, reveal matched credentials, and receive targeted advice for missing skills.
                        </p>
                      </div>

                      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                        <label className="w-full sm:w-auto px-4 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2">
                          <UploadCloud className="w-4 h-4" />
                          <span>Upload CV (PDF/DOCX)</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={(e) => {
                              if (e.target.files?.[0]) handleUploadResumeForGap(e.target.files[0]);
                            }}
                            className="hidden"
                          />
                        </label>

                        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center">
                          <button
                            onClick={() => handleLoadSampleResumeForGap('tech')}
                            className="px-2.5 py-2 text-xs font-semibold bg-slate-100 dark:bg-[#1A284A] hover:bg-slate-200 dark:hover:bg-[#20325A] text-slate-700 dark:text-slate-200 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                            title="Test with Olumide Adebayo (Senior Backend Engineer CV)"
                          >
                            <span>⚡ Olumide (Dev CV)</span>
                          </button>
                          <button
                            onClick={() => handleLoadSampleResumeForGap('product')}
                            className="px-2.5 py-2 text-xs font-semibold bg-slate-100 dark:bg-[#1A284A] hover:bg-slate-200 dark:hover:bg-[#20325A] text-slate-700 dark:text-slate-200 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                            title="Test with Amina Bello (Principal Product Manager CV)"
                          >
                            <span>🌟 Amina (PM CV)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SCENARIO B: Resume is Parsed and Ready */}
                {storedResume && !isParsingGapResume && (
                  <div className="space-y-4">
                    {/* Match Score Banner */}
                    <div className="p-4 bg-white/90 dark:bg-[#101A33] rounded-xl border border-blue-100 dark:border-slate-800 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-extrabold text-[#14243A] dark:text-white font-mono tabular-nums">
                              {matchPercentage}%
                            </span>
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                matchPercentage >= 75
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                                  : matchPercentage >= 50
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                              }`}
                            >
                              {matchPercentage >= 75
                                ? 'High Competency Match'
                                : matchPercentage >= 50
                                ? 'Moderate Match · Upskilling Recommended'
                                : 'Transferable Potential'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {matchedSkills.length} of {jobSkills.length} required skills matched from your profile
                          </div>
                        </div>

                        {/* Quick Stats Pills */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>{matchedSkills.length} Matched</span>
                          </div>
                          <div className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{missingSkills.length} Missing</span>
                          </div>
                          {extraCandidateSkills.length > 0 && (
                            <div className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg text-xs font-semibold text-[#0066CC] dark:text-[#38BDF8] flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>+{extraCandidateSkills.length} Extra Skills</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Visual Progress Bar */}
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            matchPercentage >= 75
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                              : matchPercentage >= 50
                              ? 'bg-gradient-to-r from-amber-500 to-emerald-500'
                              : 'bg-gradient-to-r from-[#0066CC] to-blue-400'
                          }`}
                          style={{ width: `${Math.max(matchPercentage, 6)}%` }}
                        />
                      </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 border-b border-slate-200/80 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
                      <button
                        onClick={() => setGapActiveFilter('all')}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          gapActiveFilter === 'all'
                            ? 'bg-[#14243A] text-white dark:bg-white dark:text-[#14243A]'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span>All Breakdown</span>
                      </button>
                      <button
                        onClick={() => setGapActiveFilter('matched')}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          gapActiveFilter === 'matched'
                            ? 'bg-emerald-600 text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Matched ({matchedSkills.length})</span>
                      </button>
                      <button
                        onClick={() => setGapActiveFilter('missing')}
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          gapActiveFilter === 'missing'
                            ? 'bg-amber-600 text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Missing Skills & Advice ({missingSkills.length})</span>
                      </button>
                      {extraCandidateSkills.length > 0 && (
                        <button
                          onClick={() => setGapActiveFilter('extra')}
                          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                            gapActiveFilter === 'extra'
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Extra Strengths ({extraCandidateSkills.length})</span>
                        </button>
                      )}
                    </div>

                    {/* TAB CONTENT 1: Matched Skills */}
                    {(gapActiveFilter === 'all' || gapActiveFilter === 'matched') && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            <span>Matched Core Skills ({matchedSkills.length})</span>
                          </span>
                          <span className="text-[11px] text-slate-400">Aligned with job requirements</span>
                        </div>
                        {matchedSkills.length === 0 ? (
                          <p className="text-xs text-slate-500 italic p-3 bg-white/60 dark:bg-[#101A33] rounded-xl border border-slate-200 dark:border-slate-800">
                            No direct matches identified yet. Review missing skills below.
                          </p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {matchedSkills.map((sk: string) => (
                              <span
                                key={sk}
                                className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold shadow-2xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span>{sk}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB CONTENT 2: Missing Skills & Suggested Preparation */}
                    {(gapActiveFilter === 'all' || gapActiveFilter === 'missing') && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Missing Requirements & Suggested Preparation ({missingSkills.length})</span>
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">Targeted upskilling</span>
                        </div>

                        {missingSkills.length === 0 ? (
                          <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Excellent! You satisfy 100% of the listed technical skills for this vacancy.</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 gap-2.5">
                            {missingSkills.map((missingSkill: string) => {
                              const rec = getSkillRecommendation(missingSkill, candidateSkills);
                              return (
                                <div
                                  key={missingSkill}
                                  className="p-3.5 bg-white/95 dark:bg-[#101A33] border border-amber-200/90 dark:border-amber-900/60 rounded-xl shadow-2xs space-y-2"
                                >
                                  <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-xs text-[#14243A] dark:text-white">
                                        {missingSkill}
                                      </span>
                                      <span
                                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                          rec.priority === 'Core Requirement'
                                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                            : rec.priority === 'High Priority'
                                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                            : 'bg-blue-50 text-[#0066CC] dark:bg-blue-950/60 dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800'
                                        }`}
                                      >
                                        {rec.priority}
                                      </span>
                                    </div>

                                    {/* Quick action to add skill if candidate actually has it */}
                                    <button
                                      type="button"
                                      onClick={() => handleAddKnownSkill(missingSkill)}
                                      className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                      title="Mark that you know this skill even if your resume didn't explicitly mention it"
                                    >
                                      <Plus className="w-3 h-3 text-[#0066CC] dark:text-[#38BDF8]" />
                                      <span>I have this skill</span>
                                    </button>
                                  </div>

                                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-amber-50/50 dark:bg-amber-950/30 p-2.5 rounded-lg border border-amber-100 dark:border-amber-900/40">
                                    <span className="font-bold text-amber-900 dark:text-amber-300 block mb-0.5">
                                      💡 Recommended Preparation & Advice:
                                    </span>
                                    <p>{rec.advice}</p>
                                  </div>

                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                                    <strong>Interview Strategy:</strong> {rec.interviewFramework}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB CONTENT 3: Extra Candidate Strengths */}
                    {(gapActiveFilter === 'all' || gapActiveFilter === 'extra') && extraCandidateSkills.length > 0 && (
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Additional Profile Strengths ({extraCandidateSkills.length})</span>
                          </span>
                          <span className="text-[11px] text-slate-400">Bonus competencies</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {extraCandidateSkills.map((sk: string) => (
                            <span
                              key={sk}
                              className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/70 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium"
                            >
                              +{sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Custom Skill Quick Add */}
                    <div className="pt-2">
                      {!showAddSkillInput ? (
                        <button
                          type="button"
                          onClick={() => setShowAddSkillInput(true)}
                          className="text-[11px] text-[#0066CC] dark:text-[#38BDF8] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add another skill you possess</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="text"
                            value={customSkillInput}
                            onChange={(e) => setCustomSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomSkill();
                              }
                            }}
                            placeholder="Type skill name (e.g., GraphQL, Redis, CI/CD)..."
                            className="text-xs px-3 py-1.5 bg-white dark:bg-[#101A33] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white outline-none flex-1"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomSkill}
                            className="px-3 py-1.5 text-xs bg-[#0066CC] text-white font-semibold rounded-lg hover:bg-[#0052A3] cursor-pointer"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddSkillInput(false)}
                            className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA to Apply with pre-filled resume */}
                    <div className="mt-4 pt-3 border-t border-blue-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-xs text-slate-600 dark:text-slate-300">
                        {matchPercentage >= 70
                          ? '✨ Your background strongly matches the core technical requirements.'
                          : '💡 Address any identified skill gaps during screening using our recommended preparation advice.'}
                      </div>

                      <button
                        onClick={() => onApply(job)}
                        className="w-full sm:w-auto px-4 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                      >
                        <span>Apply with Matched Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* Benefits & Perks */}
              <section>
                <h2 className="text-lg font-bold text-[#14243A] dark:text-white mb-3">Benefits & Career Growth</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-[#0D1527] border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="text-[#B5E61D] font-bold text-sm">✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* About Employer / Organization */}
              <section className="p-5 bg-gradient-to-br from-blue-50/60 to-slate-50 dark:from-[#0D1527] dark:to-[#131E3D] rounded-2xl border border-blue-100/80 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-base font-bold text-[#14243A] dark:text-white flex items-center gap-2">
                    {job.company?.employerType === 'Individual' ? (
                      <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    ) : (
                      <Building2 className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                    )}
                    <span>About {job.company?.name || 'MsmeBooks'}</span>
                  </h2>
                  {job.company?.website && (
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#0066CC] dark:text-[#38BDF8] font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {job.company?.name && !job.company.name.toLowerCase().includes('msmebooks') ? (
                  <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    <p>
                      <strong>{job.company.name}</strong> is an active employer on the MsmeBooks African Talent Network. Verified as a legitimate <strong>{job.company.employerType || 'Company'}</strong> recruiting talented professionals to drive growth and operational impact across Africa.
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      Applications submitted through this portal are directly screened and processed by the hiring team with complete privacy and structured recruitment tracking.
                    </p>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    MsmeBooks is a high-growth Pan-African software enterprise providing an all-in-one Accounting, Point of Sale (POS), Inventory, and Business Management platform. We empower micro, small, and medium businesses across Nigeria, Kenya, Rwanda, Ghana, and beyond to digitize operations, eliminate stock leakage, automate multi-currency tax compliance, and scale sustainably.
                  </p>
                )}
              </section>

              {/* AI INTERVIEW PREPARATION GUIDE & INSIDER TIPS */}
              <section className="bg-gradient-to-br from-indigo-50/70 via-blue-50/50 to-slate-50 dark:from-[#131E3D] dark:via-[#162347] dark:to-[#0D1527] rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 p-5 sm:p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0066CC] to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-[#14243A] dark:text-white leading-tight">
                          Interview Preparation Guide
                        </h2>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B5E61D] text-[#14243A]">
                          AI Powered
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        Company-specific culture tips, role-tailored questions, and interview frameworks for {job.company?.name || 'MsmeBooks'}.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowMockInterviewModal(true)}
                      className="px-3 py-1.5 text-xs font-bold bg-[#14243A] hover:bg-[#0066CC] dark:bg-[#0066CC] dark:hover:bg-blue-600 text-white rounded-lg shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer group"
                      title="Launch AI Mock Interview Screening Call"
                    >
                      <Mic className="w-3.5 h-3.5 text-[#B5E61D] group-hover:scale-110 transition-transform" />
                      <span>Mock Interview</span>
                      <span className="text-[10px] bg-[#B5E61D] text-[#14243A] px-1.5 py-0.2 rounded font-extrabold uppercase">
                        Live
                      </span>
                    </button>

                    <button
                      onClick={fetchInterviewPrep}
                      disabled={prepLoading}
                      className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#20325A] border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                      title="Regenerate interview preparation advice with Gemini AI"
                    >
                      {prepLoading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0066CC] dark:text-[#38BDF8]" />
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                          <span>Refresh Tips</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setShowInterviewPrep(!showInterviewPrep)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
                      title={showInterviewPrep ? 'Collapse prep guide' : 'Expand prep guide'}
                    >
                      {showInterviewPrep ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {showInterviewPrep && (
                  <div className="space-y-5 pt-2 border-t border-indigo-100/80 dark:border-slate-800">
                    {/* Mock Interview Feature Hero Banner */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0C1527] via-[#102042] to-[#0A1A35] p-5 text-white border border-blue-900/50 shadow-md">
                      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-[#0066CC]/20 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute bottom-0 left-1/3 -mb-6 w-32 h-32 bg-[#B5E61D]/15 rounded-full blur-2xl pointer-events-none" />

                      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2 max-w-xl">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-[#B5E61D] text-[#14243A]">
                              <Sparkles className="w-3 h-3" />
                              Interactive Mock Interview Mode
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/20 text-blue-200 border border-blue-400/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Real-Time Follow-Ups & Voice
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                            <span>Real-Time Voice Call with Adaobi Vance</span>
                            <span className="text-xs font-normal text-slate-300">· Lead Hiring Partner</span>
                          </h3>

                          <p className="text-xs text-slate-300 leading-relaxed">
                            Simulate an authentic spoken screening conversation for the <span className="text-white font-semibold">{job.title}</span> role. Speak into your microphone to answer multi-turn questions with live audio waveforms. Get instant AI coaching feedback tailored directly to the <span className="text-[#B5E61D] font-semibold">{job.industry || 'FinTech'}</span> industry and <span className="text-[#B5E61D] font-semibold">{job.experienceLevel || 'Senior'}</span> seniority expectations.
                          </p>

                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-300">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#B5E61D]" />
                              Real-Time Microphone Voice & Speech-to-Text
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#B5E61D]" />
                              {job.industry || 'FinTech'} & {job.experienceLevel || 'Senior'} Rubric
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#B5E61D]" />
                              STAR Scoring & Executive Debrief Scorecard
                            </span>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                          <button
                            onClick={() => setShowMockInterviewModal(true)}
                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B5E61D] to-[#9ad408] text-[#14243A] font-extrabold text-xs shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.99] transition-all flex items-center gap-2 cursor-pointer group"
                          >
                            <Mic className="w-4 h-4 text-[#14243A] group-hover:scale-110 transition-transform" />
                            <span>Launch Voice Mock Interview</span>
                          </button>
                          <span className="text-[10px] text-slate-400 hidden sm:inline">
                            Uses Mic · Instant Rubric Evaluation
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Culture & Values Alignment */}
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] flex items-center gap-1.5 mb-2.5">
                        <Award className="w-4 h-4" />
                        <span>Company Culture & Value Alignment</span>
                      </h3>
                      <div className="grid grid-cols-1 gap-2.5">
                        {(
                          interviewPrepData?.companyCultureTips || [
                            `Empathy for African MSMEs: Be ready to explain how your work empowers shopkeepers, retailers, and accountants across Nigeria, Kenya, Rwanda, and Ghana who face real infrastructure challenges.`,
                            `Extreme Ownership & Distributed Autonomy: We value proactive problem solvers who identify blockers early, communicate asynchronously, and drive initiatives without needing micromanagement.`,
                            `Resilience & Scalability: Share concrete examples of how you design robust systems or processes that handle erratic networks, power fluctuations, and multi-currency reconciliations.`
                          ]
                        ).map((tip, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white/90 dark:bg-[#101A33] border border-blue-100/70 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5 shadow-2xs"
                          >
                            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-[#0066CC] dark:text-[#38BDF8] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Role-Specific Preparation Recommendations */}
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2.5">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>Role-Specific Preparation Focus ({job.title})</span>
                      </h3>
                      <div className="space-y-2">
                        {(
                          interviewPrepData?.roleSpecificTips || [
                            `Review Key Competencies: Be ready to discuss real-world scenarios and tradeoffs involving ${job.skills.slice(0, 3).join(', ') || 'modern software and business operations'}.`,
                            `Quantify Past Impact: Structure your past accomplishments with clear metrics (e.g., latency reduction, revenue lift, churn reduction, or operational speed).`,
                            `Think in Systems: Outline how you reason about edge cases, transaction failures, and cross-functional handoffs between product, sales, and engineering.`
                          ]
                        ).map((tip, idx) => (
                          <div
                            key={idx}
                            className="p-3 bg-white/90 dark:bg-[#101A33] border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                          >
                            <span className="text-[#B5E61D] font-bold text-sm">✦</span>
                            <span>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Common & Likely Interview Questions */}
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2.5">
                        <MessageSquare className="w-4 h-4 text-indigo-500" />
                        <span>Common Interview Questions & What Interviewers Look For</span>
                      </h3>
                      <div className="space-y-2.5">
                        {(
                          interviewPrepData?.commonQuestions || [
                            {
                              question: `Why are you interested in joining ${job.company?.name || 'MsmeBooks'} and building technology for African businesses?`,
                              category: 'Culture Fit',
                              whatInterviewersLookFor: 'Authentic passion for African commerce digitization and long-term alignment with our high-impact mission.',
                              recommendedFramework: 'Connect personal experiences or values to the 40M+ underserved businesses in the African continent.'
                            },
                            {
                              question: `Tell us about a time you resolved an ambiguous technical or operational bottleneck under pressure.`,
                              category: 'Behavioral',
                              whatInterviewersLookFor: 'Self-direction, prioritization, structured problem solving, and calm stakeholder communication.',
                              recommendedFramework: 'Use the STAR Method: Situation, Task, Action, Result. Focus 60% of your time on the Actions you personally took.'
                            },
                            {
                              question: `How do you approach ensuring data reliability and transaction accuracy in distributed or intermittent environments?`,
                              category: 'Technical',
                              whatInterviewersLookFor: 'Awareness of offline storage, idempotency keys, audit logs, and clear error recovery UX for non-technical users.',
                              recommendedFramework: 'Explain your high-level architecture first, followed by concrete data-layer controls and edge case handlings.'
                            },
                            {
                              question: `Describe a disagreement you had with a team member or stakeholder and how you reached consensus.`,
                              category: 'Problem Solving',
                              whatInterviewersLookFor: 'Constructive dialogue, ego detachment, reliance on data/metrics, and commitment to the final team decision.',
                              recommendedFramework: 'State the differing perspectives neutrally, the shared goal you aligned on, and the collaborative outcome.'
                            }
                          ]
                        ).map((qItem, idx) => {
                          const isExpanded = expandedQuestionIdx === idx;
                          return (
                            <div
                              key={idx}
                              className="bg-white dark:bg-[#101A33] border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden transition-all shadow-2xs"
                            >
                              <button
                                onClick={() => setExpandedQuestionIdx(isExpanded ? null : idx)}
                                className="w-full p-3.5 text-left flex items-start justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-[#162347] transition-colors cursor-pointer"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                                      {qItem.category}
                                    </span>
                                    <span className="text-[11px] text-slate-400 font-mono">Q{idx + 1}</span>
                                  </div>
                                  <div className="text-xs sm:text-sm font-bold text-[#14243A] dark:text-white leading-snug">
                                    "{qItem.question}"
                                  </div>
                                </div>
                                <div className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0">
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </div>
                              </button>

                              {isExpanded && (
                                <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0D1527]/50 space-y-2 text-xs">
                                  <div className="p-2.5 bg-blue-50/70 dark:bg-blue-950/50 rounded-lg border border-blue-200/60 dark:border-blue-800/60">
                                    <span className="font-bold text-[#0066CC] dark:text-[#38BDF8] block mb-0.5">
                                      What Interviewers Look For:
                                    </span>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                      {qItem.whatInterviewersLookFor}
                                    </p>
                                  </div>

                                  <div className="p-2.5 bg-emerald-50/70 dark:bg-emerald-950/50 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
                                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                                      Recommended Framework:
                                    </span>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                      {qItem.recommendedFramework}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between pt-1 text-xs">
                                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                      Want to test your answer in a live mock call?
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMockInterviewModal(true);
                                      }}
                                      className="px-2.5 py-1 text-xs font-bold text-[#0066CC] dark:text-[#38BDF8] hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Mic className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                                      <span>Practice with Adaobi</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Questions to Ask Interviewer */}
                    <div className="p-4 bg-white/90 dark:bg-[#101A33] rounded-xl border border-slate-200/90 dark:border-slate-800">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-2">
                        <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>High-Signal Questions to Ask Your Interviewer</span>
                      </h3>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {(
                          interviewPrepData?.questionsToAskInterviewer || [
                            `What are the highest-priority milestones for this team over the next 6 to 12 months?`,
                            `How does the engineering and product team collaborate on prioritizing customer feedback from merchants in different countries?`,
                            `What differentiates someone who is good in this role from someone who is truly exceptional?`
                          ]
                        ).map((q, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-[#0066CC] dark:text-[#38BDF8] font-bold">•</span>
                            <span className="italic">"{q}"</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Right Sticky Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Primary Sticky Action Card */}
              <div className="bg-slate-50 dark:bg-[#0D1527] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-4">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Ready to Apply?
                </div>
                <div className="text-sm font-bold text-[#14243A] dark:text-white mb-4">
                  Takes less than 4 minutes.
                </div>

                <button
                  onClick={() => onApply(job)}
                  className="w-full py-3.5 px-4 bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#003D7A] text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mb-3 cursor-pointer"
                >
                  <span>Apply For This Position</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onToggleSave(job.id)}
                  className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl border transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isSaved
                      ? 'bg-blue-100/70 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] border-[#0066CC] dark:border-[#38BDF8]'
                      : 'bg-white dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#20325A]'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  <span>{isSaved ? 'Saved to Bookmarks' : 'Save Position'}</span>
                </button>

                {/* Share Job Button (Native Web Share API or Copy URL Fallback) */}
                <div className="mt-3 grid grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className={`col-span-4 py-2.5 px-4 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-2 shadow-xs group cursor-pointer ${
                      copiedLink
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                        : 'text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1A284A] hover:bg-slate-50 dark:hover:bg-[#20325A] border-slate-200 dark:border-slate-700 hover:border-[#0066CC] dark:hover:border-[#38BDF8]'
                    }`}
                    title="Open native share dialog or copy job link to clipboard"
                  >
                    {copiedLink ? (
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Share2 className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8] group-hover:scale-110 transition-transform" />
                    )}
                    <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="col-span-1 py-2.5 px-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1A284A] hover:bg-slate-50 dark:hover:bg-[#20325A] border border-slate-200 dark:border-slate-700 hover:border-[#0066CC] dark:hover:border-[#38BDF8] rounded-xl transition-all flex items-center justify-center shadow-xs cursor-pointer"
                    title="Copy direct job URL to clipboard"
                    aria-label="Copy direct job URL to clipboard"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Deadline Notice */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>
                    Deadline: <strong className="text-slate-900 dark:text-white">{formatDate(job.applicationDeadline)}</strong>
                  </span>
                </div>

                {/* Secondary Menu with Direct Social Media Platform Icons & Pre-filled Messages */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5">
                    <span className="flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Social Media Share Menu</span>
                    </span>
                    <button
                      onClick={() => setShowSecondaryMenu(!showSecondaryMenu)}
                      className="text-[11px] text-[#0066CC] dark:text-[#38BDF8] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{showSecondaryMenu ? 'Hide Menu' : 'Show Menu'}</span>
                    </button>
                  </div>

                  {showSecondaryMenu && (
                    <div className="space-y-3 animate-in fade-in">
                      {/* 5 Direct Social Media Icons: LinkedIn, Twitter, WhatsApp, Instagram, Facebook */}
                      <div className="grid grid-cols-5 gap-1.5">
                        {/* LinkedIn */}
                        <button
                          onClick={() => handleShare('linkedin')}
                          className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all text-center cursor-pointer ${
                            selectedPreviewPlatform === 'linkedin'
                              ? 'bg-[#0A66C2] text-white border-[#0A66C2] shadow-sm'
                              : 'bg-[#0A66C2]/10 dark:bg-[#0A66C2]/20 text-[#0A66C2] dark:text-[#38BDF8] hover:bg-[#0A66C2] hover:text-white border-[#0A66C2]/20'
                          }`}
                          title="Share on LinkedIn with pre-filled role details"
                        >
                          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                          </svg>
                          <span className="text-[10px] font-bold">LinkedIn</span>
                        </button>

                        {/* Twitter / X */}
                        <button
                          onClick={() => handleShare('twitter')}
                          className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all text-center cursor-pointer ${
                            selectedPreviewPlatform === 'twitter'
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-slate-900/10 dark:bg-slate-800 text-slate-900 dark:text-slate-200 hover:bg-slate-900 hover:text-white border-slate-900/20 dark:border-slate-700'
                          }`}
                          title="Share on Twitter / X with pre-filled tweet"
                        >
                          <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                          <span className="text-[10px] font-bold">Twitter</span>
                        </button>

                        {/* WhatsApp */}
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all text-center cursor-pointer ${
                            selectedPreviewPlatform === 'whatsapp'
                              ? 'bg-[#25D366] text-white border-[#25D366] shadow-sm'
                              : 'bg-[#25D366]/10 dark:bg-[#25D366]/20 text-[#16A34A] dark:text-[#4ADE80] hover:bg-[#25D366] hover:text-white border-[#25D366]/20'
                          }`}
                          title="Send on WhatsApp with pre-filled message"
                        >
                          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.01-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.11-.23-.17-.48-.29z"/>
                          </svg>
                          <span className="text-[10px] font-bold">Whatsapp</span>
                        </button>

                        {/* Instagram */}
                        <button
                          onClick={() => handleShare('instagram')}
                          className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all text-center cursor-pointer ${
                            selectedPreviewPlatform === 'instagram'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white border-rose-200 dark:border-rose-900/50'
                          }`}
                          title="Copy pre-filled caption & open Instagram"
                        >
                          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                          <span className="text-[10px] font-bold">Instagram</span>
                        </button>

                        {/* Facebook */}
                        <button
                          onClick={() => handleShare('facebook')}
                          className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 border transition-all text-center cursor-pointer ${
                            selectedPreviewPlatform === 'facebook'
                              ? 'bg-[#1877F2] text-white border-[#1877F2] shadow-sm'
                              : 'bg-[#1877F2]/10 dark:bg-[#1877F2]/20 text-[#1877F2] hover:bg-[#1877F2] hover:text-white border-[#1877F2]/20'
                          }`}
                          title="Share on Facebook with pre-filled role quote"
                        >
                          <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                          <span className="text-[10px] font-bold">Facebook</span>
                        </button>
                      </div>

                      {/* Pre-filled Share Message Preview Box */}
                      <div className="p-3 bg-slate-100/90 dark:bg-[#1A284A] rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                          <span className="capitalize">
                            Pre-filled for {selectedPreviewPlatform === 'general' ? 'All Platforms' : selectedPreviewPlatform}:
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyMessage()}
                              className="text-[#0066CC] dark:text-[#38BDF8] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                              title="Copy pre-filled text"
                            >
                              <Copy className="w-3 h-3" />
                              <span>Copy Text</span>
                            </button>
                            <span className="text-slate-300 dark:text-slate-600">·</span>
                            <button
                              onClick={handleCopyLink}
                              className="text-[#0066CC] dark:text-[#38BDF8] hover:underline font-bold cursor-pointer"
                              title="Copy page URL"
                            >
                              Copy URL
                            </button>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-700 dark:text-slate-300 italic leading-relaxed select-all">
                          "{getShareMessage(selectedPreviewPlatform)}"
                        </p>
                      </div>
                    </div>
                  )}

                  {shareFeedback && (
                    <div className="mt-2.5 text-center text-xs font-semibold text-[#0066CC] dark:text-[#38BDF8] bg-blue-50/80 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 py-1.5 px-2 rounded-lg animate-in fade-in">
                      {shareFeedback}
                    </div>
                  )}
                </div>
              </div>

              {/* Automated Interview Scheduling Calendar */}
              <div className="bg-white dark:bg-[#0D1527] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] flex items-center gap-1">
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Automated Interview Scheduler</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#14243A] dark:text-white mt-0.5">
                      Pick an Interview Slot
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#B5E61D]/25 text-[#14243A] dark:text-[#B5E61D] border border-[#B5E61D]/40 shrink-0">
                    45 min
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Reserve a real-time screening slot with <strong className="text-slate-700 dark:text-slate-200">Adaobi Vance</strong> &amp; {job.department} leads, then sync directly to Google or Outlook Calendar.
                </p>

                {bookedInterview ? (
                  <div className="p-3.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-[#0066CC]/30 dark:border-[#38BDF8]/40 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066CC] dark:text-[#38BDF8]">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Slot Reserved</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setBookedInterview(null)}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white underline cursor-pointer"
                      >
                        Change slot
                      </button>
                    </div>

                    <div className="text-xs font-bold text-[#14243A] dark:text-white">
                      {new Date(bookedInterview.interviewDate).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'UTC',
                      })}{' '}
                      UTC
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
                      <span>{bookedInterview.meetingType} · Google Meet</span>
                    </div>

                    {bookingJustConfirmed && (
                      <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800">
                        Added to My Interviews &amp; Notification Sent!
                      </div>
                    )}

                    {/* Direct Calendar Sync Buttons */}
                    <div className="pt-2 border-t border-blue-200/60 dark:border-blue-800/50 space-y-1.5">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Sync to Calendar
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <a
                          href={getGoogleCalendarUrl(calendarEventPayload)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-2 bg-white dark:bg-[#1A284A] hover:bg-slate-50 dark:hover:bg-[#20325A] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Calendar className="w-3 h-3 text-[#0066CC] dark:text-[#38BDF8]" />
                          <span>Google</span>
                        </a>
                        <a
                          href={getOutlookCalendarUrl(calendarEventPayload)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-2 bg-white dark:bg-[#1A284A] hover:bg-slate-50 dark:hover:bg-[#20325A] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 text-[#0078D4]" />
                          <span>Outlook</span>
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          downloadIcsFile(
                            `MsmeBooks-Interview-${job.slug}.ics`,
                            generateIcsContent(calendarEventPayload)
                          )
                        }
                        className="w-full py-1.5 px-2 bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download Calendar Invite (.ics)</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Day Picker Strip */}
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        1. Select Date
                      </span>
                      <div className="grid grid-cols-5 gap-1">
                        {upcomingInterviewDays.map((day, idx) => {
                          const active = selectedScheduleDayIdx === idx;
                          return (
                            <button
                              key={day.isoDate}
                              type="button"
                              onClick={() => setSelectedScheduleDayIdx(idx)}
                              className={`py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer ${
                                active
                                  ? 'bg-[#0066CC] text-white border-[#0066CC] shadow-xs'
                                  : 'bg-slate-50 dark:bg-[#131D35] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0066CC]/50'
                              }`}
                            >
                              <span className={`block text-[9px] font-bold uppercase ${active ? 'text-blue-100' : 'text-slate-400'}`}>
                                {day.dayShort}
                              </span>
                              <span className="block text-xs font-extrabold font-mono">{day.dateNum}</span>
                              <span className={`block text-[9px] ${active ? 'text-blue-100' : 'text-slate-400'}`}>
                                {day.monthShort}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Time Slot Selector */}
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        2. Available Slots (UTC)
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {['09:30', '11:00', '14:00', '16:00'].map((slot) => {
                          const active = selectedScheduleSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedScheduleSlot(slot)}
                              className={`py-1.5 px-2 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                active
                                  ? 'bg-blue-50 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] border-[#0066CC] dark:border-[#38BDF8]'
                                  : 'bg-slate-50 dark:bg-[#131D35] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0066CC]/40'
                              }`}
                            >
                              <Clock className="w-3 h-3" />
                              <span>{slot} UTC</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Session Format */}
                    <div>
                      <label htmlFor="job-interview-format" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                        3. Interview Format
                      </label>
                      <select
                        id="job-interview-format"
                        value={selectedSessionFormat}
                        onChange={(e) => setSelectedSessionFormat(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-[#131D35] text-slate-800 dark:text-slate-200 rounded-lg border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC]"
                      >
                        <option value="Technical Screening Call">Technical Screening Call</option>
                        <option value="Hiring Manager Intro">Hiring Manager Intro</option>
                        <option value="Architecture & Portfolio Review">Architecture &amp; Portfolio Review</option>
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleConfirmInterviewBooking}
                      className="w-full py-2.5 px-3 bg-[#14243A] dark:bg-[#0066CC] hover:bg-slate-800 dark:hover:bg-[#0052A3] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-[#B5E61D]" />
                      <span>Confirm Interview Slot</span>
                    </button>

                    {/* Instant Quick Calendar Export Preview Links */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>Preview sync:</span>
                      <div className="flex items-center gap-2 font-bold">
                        <a
                          href={getGoogleCalendarUrl(calendarEventPayload)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0066CC] dark:text-[#38BDF8] hover:underline"
                        >
                          Google
                        </a>
                        <span>·</span>
                        <a
                          href={getOutlookCalendarUrl(calendarEventPayload)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0066CC] dark:text-[#38BDF8] hover:underline"
                        >
                          Outlook
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Related Vacancies */}
              {relatedJobs.length > 0 && (
                <div className="bg-white dark:bg-[#0D1527] p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Other Open Roles
                  </h3>
                  <div className="space-y-3">
                    {relatedJobs.slice(0, 3).map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => onSelectJob(rel)}
                        className="p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-[#0066CC] dark:hover:border-[#38BDF8] hover:bg-blue-50/30 dark:hover:bg-blue-950/30 cursor-pointer transition-colors group"
                      >
                        <div className="text-xs text-[#0066CC] dark:text-[#38BDF8] font-semibold">{rel.department}</div>
                        <div className="text-sm font-bold text-[#14243A] dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] line-clamp-1">
                          {rel.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                          {rel.workArrangement} · {rel.location.city}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recommended Similar Roles Carousel */}
          {recommendedRoles.length > 0 && (
            <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 text-[#0066CC] dark:text-[#38BDF8] rounded-lg">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="text-lg font-bold text-[#14243A] dark:text-white">
                      Recommended Similar Roles
                    </h3>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800">
                      {recommendedRoles.length} curated
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Algorithmically curated based on open positions at <span className="font-semibold text-slate-700 dark:text-slate-300">{job.company?.name || 'this employer'}</span>, category alignment, and matching skill synergy.
                  </p>
                </div>

                {/* Carousel Navigation Arrow Controls */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => handleScrollCarousel('left')}
                    disabled={!canScrollLeft}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      canScrollLeft
                        ? 'bg-white dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#20325A] shadow-xs active:scale-95'
                        : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-slate-200/50 dark:border-slate-800 cursor-not-allowed opacity-40'
                    }`}
                    title="Previous recommended roles"
                    aria-label="Scroll left in similar roles carousel"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleScrollCarousel('right')}
                    disabled={!canScrollRight}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      canScrollRight
                        ? 'bg-white dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#20325A] shadow-xs active:scale-95'
                        : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-600 border-slate-200/50 dark:border-slate-800 cursor-not-allowed opacity-40'
                    }`}
                    title="Next recommended roles"
                    aria-label="Scroll right in similar roles carousel"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Carousel Track */}
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto scroll-smooth pb-4 pt-1 -mx-2 px-2 snap-x snap-mandatory"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(100, 116, 139, 0.25) transparent',
                }}
              >
                {recommendedRoles.map(
                  ({ job: recJob, matchPercentage, sameCompany, sameCategory, sharedSkills }) => {
                    const isRecSaved = savedJobIds?.includes(recJob.id) || false;
                    return (
                      <div
                        key={recJob.id}
                        className="w-[285px] sm:w-[320px] md:w-[335px] shrink-0 snap-start bg-slate-50/80 dark:bg-[#0D1527] border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-[#0066CC] dark:hover:border-[#38BDF8] hover:shadow-lg transition-all duration-200 group relative"
                      >
                        <div>
                          {/* Top Meta: Match Score & Priority Tags */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {matchPercentage}% Match
                            </div>

                            <div className="flex items-center gap-1.5">
                              {sameCompany && (
                                <span
                                  title="Same employer as the current role"
                                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                >
                                  <Building2 className="w-3 h-3" />
                                  Company
                                </span>
                              )}
                              {sameCategory && (
                                <span
                                  title="Same category and department"
                                  className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800"
                                >
                                  <Briefcase className="w-3 h-3" />
                                  Category
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleSave(recJob.id);
                                }}
                                className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title={isRecSaved ? 'Remove from saved' : 'Save role'}
                                aria-label={isRecSaved ? 'Unsave job' : 'Save job'}
                              >
                                <Bookmark
                                  className={`w-3.5 h-3.5 ${
                                    isRecSaved ? 'fill-amber-500 text-amber-500' : 'text-slate-400'
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          {/* Employer Brand & Category */}
                          <div className="flex items-center gap-2.5 mb-2.5">
                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-[#1A284A] border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-[#0066CC] dark:text-[#38BDF8] shrink-0 shadow-xs">
                              {recJob.company?.name ? recJob.company.name.charAt(0) : 'M'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                                <span>{recJob.company?.name || 'MsmeBooks'}</span>
                                {recJob.company?.verified && (
                                  <CheckCircle2 className="w-3 h-3 text-[#0066CC] dark:text-[#38BDF8] shrink-0" />
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {recJob.department}
                              </div>
                            </div>
                          </div>

                          {/* Role Title */}
                          <h4
                            onClick={() => handleSelectRecommendedRole(recJob)}
                            className="text-sm font-bold text-[#14243A] dark:text-white line-clamp-2 group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] cursor-pointer transition-colors leading-snug mb-2"
                            title={recJob.title}
                          >
                            {recJob.title}
                          </h4>

                          {/* Arrangement & Location Badges */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 mb-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-[#1A284A] border border-slate-200 dark:border-slate-700 font-medium">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {recJob.workArrangement}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white dark:bg-[#1A284A] border border-slate-200 dark:border-slate-700 font-medium truncate max-w-[130px]">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {recJob.location.city}, {recJob.location.country}
                            </span>
                          </div>

                          {/* Skill Tags */}
                          {recJob.skills && recJob.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-4">
                              {recJob.skills.slice(0, 3).map((sk) => {
                                const isShared = sharedSkills.some((s) => s.toLowerCase() === sk.toLowerCase());
                                return (
                                  <span
                                    key={sk}
                                    className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                                      isShared
                                        ? 'bg-blue-100 dark:bg-blue-900/60 text-[#0066CC] dark:text-[#38BDF8] font-semibold border border-blue-200 dark:border-blue-800'
                                        : 'bg-slate-100 dark:bg-[#142036] text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800'
                                    }`}
                                  >
                                    {isShared && '✓ '}{sk}
                                  </span>
                                );
                              })}
                              {recJob.skills.length > 3 && (
                                <span className="text-[10px] px-1.5 py-0.5 text-slate-400 dark:text-slate-500 font-medium">
                                  +{recJob.skills.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Card Footer: Salary & View Role Action */}
                        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-auto">
                          <div className="text-xs">
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                              Salary
                            </div>
                            <div className="font-bold text-[#14243A] dark:text-white truncate max-w-[140px]">
                              {formatSalaryRange(
                                recJob.salary.min,
                                recJob.salary.max,
                                recJob.salary.currency,
                                recJob.salary.period,
                                recJob.salary.isPublic
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectRecommendedRole(recJob)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0066CC] hover:bg-[#0052A3] dark:bg-[#38BDF8] dark:hover:bg-[#0EA5E9] text-white dark:text-slate-900 text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer group-hover:translate-x-0.5"
                          >
                            <span>View Role</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mock Interview Simulation Modal */}
      <AnimatePresence>
        {showMockInterviewModal && (
          <MockInterviewModal
            job={job}
            onClose={() => setShowMockInterviewModal(false)}
            onApplyForJob={() => {
              setShowMockInterviewModal(false);
              onApply(job);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
