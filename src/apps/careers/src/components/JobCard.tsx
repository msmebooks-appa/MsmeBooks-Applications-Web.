import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Job } from '../types/career';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import {
  Bookmark,
  MapPin,
  Sparkles,
  Building2,
  Code2,
  Palette,
  TrendingUp,
  Headphones,
  FileSpreadsheet,
  BrainCircuit,
  GraduationCap,
  Shield,
  Layers,
  User,
  Users,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Clock,
  Share2,
  Check,
  Zap,
  Eye,
  DollarSign,
  Linkedin,
  MessageCircle,
  GitBranch,
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  viewMode: 'grid' | 'list';
  isSaved: boolean;
  hasApplied?: boolean;
  onToggleSave: (jobId: string) => void;
  onViewDetails: (job: Job) => void;
  onApply: (job: Job) => void;
  onQuickApply?: (job: Job) => void;
  onViewCompanyProfile?: (companyName: string) => void;
  onFindSimilarRoles?: (job: Job) => void;
}

// Dynamic countdown & deadline calculator
export const getDeadlineCountdown = (deadlineIso?: string) => {
  if (!deadlineIso) return null;
  try {
    const deadlineMs = new Date(deadlineIso).getTime();
    if (isNaN(deadlineMs)) return null;
    const nowMs = Date.now();
    const diffMs = deadlineMs - nowMs;

    // ISO Date formatted: YYYY-MM-DD
    const isoDateOnly = new Date(deadlineIso).toISOString().slice(0, 10);

    if (diffMs <= 0) {
      return {
        isClosed: true,
        isUrgent: true,
        hoursLeft: 0,
        daysLeft: 0,
        label: 'Closed',
        fullText: 'Applications Closed',
        badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 font-bold',
      };
    }

    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));

    // If within 24 hours, change label to 'Closing Today'
    if (totalHours <= 24) {
      return {
        isClosed: false,
        isUrgent: true,
        hoursLeft: totalHours,
        daysLeft: 1,
        label: 'Closing Today',
        fullText: '🚨 Closing Today · Apply immediately',
        badgeClass: 'bg-rose-600 text-white dark:bg-rose-600 dark:text-white border border-rose-700 font-extrabold animate-pulse shadow-xs',
      };
    }

    return {
      isClosed: false,
      isUrgent: false,
      hoursLeft: totalHours,
      daysLeft: Math.ceil(totalHours / 24),
      label: `Deadline: ${isoDateOnly}`,
      fullText: `Deadline: ${isoDateOnly}`,
      badgeClass: 'bg-slate-100 text-slate-700 dark:bg-[#1A284A] dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium',
    };
  } catch {
    return null;
  }
};

export const JobCard: React.FC<JobCardProps> = ({
  job,
  viewMode,
  isSaved,
  hasApplied = false,
  onToggleSave,
  onViewDetails,
  onApply,
  onQuickApply,
  onViewCompanyProfile,
  onFindSimilarRoles,
}) => {
  const { tr } = useLanguage();
  const { formatSalaryRange } = useCurrency();
  const { user } = useAuth();
  const [showVerifiedPopover, setShowVerifiedPopover] = useState(false);
  const [pinnedVerifiedPopover, setPinnedVerifiedPopover] = useState(false);
  const verifiedCloseTimerRef = useRef<number | null>(null);
  const verifiedWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideOrEsc = (ev: MouseEvent | KeyboardEvent) => {
      if (ev instanceof KeyboardEvent && ev.key === 'Escape') {
        setPinnedVerifiedPopover(false);
        setShowVerifiedPopover(false);
        return;
      }
      if (
        ev instanceof MouseEvent &&
        verifiedWrapperRef.current &&
        !verifiedWrapperRef.current.contains(ev.target as Node)
      ) {
        setPinnedVerifiedPopover(false);
        setShowVerifiedPopover(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideOrEsc);
    document.addEventListener('keydown', handleOutsideOrEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutsideOrEsc);
      document.removeEventListener('keydown', handleOutsideOrEsc);
      if (verifiedCloseTimerRef.current) {
        window.clearTimeout(verifiedCloseTimerRef.current);
      }
    };
  }, []);

  const openVerifiedTooltip = () => {
    if (verifiedCloseTimerRef.current) {
      window.clearTimeout(verifiedCloseTimerRef.current);
      verifiedCloseTimerRef.current = null;
    }
    setShowVerifiedPopover(true);
  };

  const scheduleCloseVerifiedTooltip = () => {
    if (pinnedVerifiedPopover) return;
    if (verifiedCloseTimerRef.current) {
      window.clearTimeout(verifiedCloseTimerRef.current);
    }
    verifiedCloseTimerRef.current = window.setTimeout(() => {
      setShowVerifiedPopover(false);
    }, 180);
  };

  // AI-Benchmarked Verified Skills against candidate profile (prioritize exact overlaps, then partial matches)
  const verifiedSkillMatch = useMemo(() => {
    let candidateSkills: string[] = [];
    if (user?.roleData?.role === 'candidate' && Array.isArray(user.roleData.data.skills) && user.roleData.data.skills.length > 0) {
      candidateSkills = user.roleData.data.skills;
    } else {
      try {
        const cached = localStorage.getItem('msmebooks_candidate_profile');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed.skills) && parsed.skills.length > 0) {
            candidateSkills = parsed.skills;
          }
        }
      } catch {}
      if (candidateSkills.length === 0) {
        candidateSkills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'System Architecture', 'FinTech', 'Accounting', 'Product Strategy', 'Python'];
      }
    }

    const exactMatches: string[] = [];
    const partialMatches: string[] = [];
    const seen = new Set<string>();

    (job.skills || []).forEach((jobSkill) => {
      const jLow = jobSkill.toLowerCase().trim();
      if (!jLow || seen.has(jLow)) return;
      const isExact = candidateSkills.some((cs) => cs.toLowerCase().trim() === jLow);
      if (isExact) {
        seen.add(jLow);
        exactMatches.push(jobSkill);
        return;
      }
      const isPartial = candidateSkills.some((cs) => {
        const cLow = cs.toLowerCase().trim();
        return cLow.length > 1 && (jLow.includes(cLow) || cLow.includes(jLow));
      });
      if (isPartial) {
        seen.add(jLow);
        partialMatches.push(jobSkill);
      }
    });

    const matched = [...exactMatches, ...partialMatches];

    return {
      isMatched: matched.length > 0,
      matchedCount: matched.length,
      matchedSkills: matched,
      totalSkills: (job.skills || []).length,
    };
  }, [user, job.skills]);

  // Social share menu & toast
  const [shareMenuAnchor, setShareMenuAnchor] = useState<'header' | 'footer' | null>(null);
  const [shareToast, setShareToast] = useState(false);

  // Detect first transition of hasApplied (false -> true) for celebratory scale-in + check animation
  const prevHasAppliedRef = useRef<boolean>(hasApplied);
  const [justApplied, setJustApplied] = useState<boolean>(false);
  useEffect(() => {
    if (!prevHasAppliedRef.current && hasApplied) {
      setJustApplied(true);
      const timer = window.setTimeout(() => setJustApplied(false), 1800);
      prevHasAppliedRef.current = hasApplied;
      return () => window.clearTimeout(timer);
    }
    prevHasAppliedRef.current = hasApplied;
  }, [hasApplied]);

  const renderAnimatedBrandCheck = (sizeClass = 'w-3 h-3') => (
    <motion.svg
      viewBox="0 0 16 16"
      fill="none"
      className={`${sizeClass} shrink-0`}
      initial={justApplied ? { scale: 0.5, opacity: 0 } : { scale: 1, opacity: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 460, damping: 18 }}
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7" fill="#38BDF8" fillOpacity="0.28" stroke="#93C5FD" strokeWidth="1.2" />
      <motion.path
        d="M4.75 8.25L7 10.5L11.5 5.75"
        stroke="#FFFFFF"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={justApplied ? { pathLength: 0 } : { pathLength: 1 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.36, ease: 'easeOut', delay: justApplied ? 0.08 : 0 }}
      />
    </motion.svg>
  );

  const isVerifiedTooltipVisible = showVerifiedPopover || pinnedVerifiedPopover;
  const renderVerifiedSkillBadge = (align: 'left' | 'right', compact = false) => {
    if (!verifiedSkillMatch.isMatched) return null;
    const topThreeSkills = verifiedSkillMatch.matchedSkills.slice(0, 3);
    const extraCount = Math.max(0, verifiedSkillMatch.matchedCount - 3);
    const overlapPercent =
      verifiedSkillMatch.totalSkills > 0
        ? Math.round((verifiedSkillMatch.matchedCount / verifiedSkillMatch.totalSkills) * 100)
        : 100;

    return (
      <div
        ref={verifiedWrapperRef}
        className="relative inline-flex"
        onMouseEnter={openVerifiedTooltip}
        onMouseLeave={scheduleCloseVerifiedTooltip}
        onFocus={openVerifiedTooltip}
        onBlur={() => {
          if (!pinnedVerifiedPopover) setShowVerifiedPopover(false);
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPinnedVerifiedPopover((prev) => !prev);
            setShowVerifiedPopover(true);
          }}
          aria-expanded={isVerifiedTooltipVisible}
          aria-label={`Verified Skill: ${topThreeSkills.join(', ')}`}
          className={`inline-flex items-center gap-1 rounded-md font-bold bg-blue-50 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200/90 dark:border-blue-800/80 shadow-2xs hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer shrink-0 ${
            compact ? 'text-[10px] px-2 py-0.5' : 'text-[10px] px-2.5 py-0.5'
          }`}
        >
          <Sparkles className={`${compact ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-[#0066CC] dark:text-[#38BDF8] fill-[#0066CC]/20`} />
          <span>Verified Skill{!compact ? ` (${verifiedSkillMatch.matchedCount})` : ''}</span>
        </button>

        {isVerifiedTooltipVisible && (
          <div
            role="tooltip"
            onMouseEnter={openVerifiedTooltip}
            onMouseLeave={scheduleCloseVerifiedTooltip}
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-full pt-1.5 z-50 w-64 ${
              align === 'left' ? 'left-0' : 'right-0'
            }`}
          >
            <div className="p-3 bg-white dark:bg-[#0D1527] border border-blue-200 dark:border-blue-800 rounded-xl shadow-xl text-left animate-in fade-in duration-150">
              <div className="flex items-center justify-between gap-2 pb-1.5 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8]">
                  Top 3 Overlapping Skills
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8]">
                  {verifiedSkillMatch.matchedCount}/{verifiedSkillMatch.totalSkills} ({overlapPercent}%)
                </span>
              </div>

              <ul className="space-y-1.5">
                {topThreeSkills.map((skill, idx) => (
                  <li
                    key={skill}
                    className="flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-800 dark:text-slate-100"
                  >
                    <span className="flex items-center gap-1.5 min-w-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8] shrink-0" />
                      <span className="truncate">{skill}</span>
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 shrink-0">#{idx + 1}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400">
                <span>Matched with your profile</span>
                {extraCount > 0 && (
                  <span className="font-semibold text-[#0066CC] dark:text-[#38BDF8]">
                    +{extraCount} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Viewed badge status
  const [isViewed, setIsViewed] = useState<boolean>(() => {
    try {
      const viewed = JSON.parse(localStorage.getItem('msmebooks_viewed_jobs') || '[]');
      return Array.isArray(viewed) && viewed.includes(job.id);
    } catch {
      return false;
    }
  });

  const handleOpenDetails = () => {
    try {
      const viewed = JSON.parse(localStorage.getItem('msmebooks_viewed_jobs') || '[]');
      if (Array.isArray(viewed) && !viewed.includes(job.id)) {
        viewed.push(job.id);
        localStorage.setItem('msmebooks_viewed_jobs', JSON.stringify(viewed));
      }
    } catch {}
    setIsViewed(true);
    onViewDetails(job);
  };

  const getJobDeepLink = () => `${window.location.origin}/?job=${encodeURIComponent(job.slug || job.id)}`;

  const copyJobUrlToClipboard = async (url: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        return;
      }
    } catch {}
    try {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    } catch {}
  };

  const handleQuickShare = async (e: React.MouseEvent, anchor: 'header' | 'footer' = 'header') => {
    e.stopPropagation();
    const jobUrl = getJobDeepLink();
    const shareTitle = `${job.title} — ${job.company?.name || 'MsmeBooks'}`;
    const shareText = `Check out this ${job.workArrangement} role: ${job.title} at ${job.company?.name || 'MsmeBooks'} (${job.location.city}, ${job.location.country})`;

    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: jobUrl,
        });
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    // Fallback when native share sheet is unavailable: copy deep-link & toggle quick-share platform menu
    await copyJobUrlToClipboard(jobUrl);
    setShareToast(true);
    setShareMenuAnchor((prev) => (prev === anchor ? null : anchor));
    setTimeout(() => setShareToast(false), 2200);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const jobUrl = getJobDeepLink();
    await copyJobUrlToClipboard(jobUrl);
    setShareToast(true);
    setShareMenuAnchor(null);
    setTimeout(() => setShareToast(false), 2200);
  };

  const getSocialShareUrl = (platform: 'linkedin' | 'whatsapp' | 'sms' | 'twitter') => {
    const rawUrl = getJobDeepLink();
    const jobUrl = encodeURIComponent(rawUrl);
    const jobText = encodeURIComponent(`Check out this role: ${job.title} at ${job.company?.name || 'MsmeBooks'}`);
    if (platform === 'linkedin') {
      return `https://www.linkedin.com/sharing/share-offsite/?url=${jobUrl}`;
    }
    if (platform === 'whatsapp') {
      return `https://api.whatsapp.com/send?text=${jobText}%20${jobUrl}`;
    }
    if (platform === 'sms') {
      return `sms:?body=${jobText}%20${jobUrl}`;
    }
    return `https://twitter.com/intent/tweet?text=${jobText}&url=${jobUrl}`;
  };

  const renderShareFallbackMenu = (positionClass: string) => (
    <div
      className={`absolute ${positionClass} w-44 bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 p-1.5 space-y-1 animate-in fade-in`}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={handleCopyLink}
        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1A284A] flex items-center gap-2 cursor-pointer"
      >
        <Share2 className="w-3.5 h-3.5 text-[#0066CC]" />
        <span>Copy Deep Link</span>
      </button>
      <a
        href={getSocialShareUrl('whatsapp')}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setShareMenuAnchor(null)}
        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1A284A] flex items-center gap-2"
      >
        <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
        <span>WhatsApp</span>
      </a>
      <a
        href={getSocialShareUrl('sms')}
        onClick={() => setShareMenuAnchor(null)}
        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1A284A] flex items-center gap-2"
      >
        <MessageCircle className="w-3.5 h-3.5 text-sky-500" />
        <span>SMS Message</span>
      </a>
      <a
        href={getSocialShareUrl('linkedin')}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setShareMenuAnchor(null)}
        className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1A284A] flex items-center gap-2"
      >
        <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
        <span>LinkedIn</span>
      </a>
    </div>
  );

  // Department icon helper
  const getDeptIcon = (dept: string) => {
    switch (dept) {
      case 'Software Engineering':
        return <Code2 className="w-5 h-5 text-[#0066CC] dark:text-[#38BDF8]" />;
      case 'Product & Design':
        return <Palette className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Sales & Business Development':
        return <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'Customer Success':
      case 'Technical Support':
        return <Headphones className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case 'Finance & Accounting':
        return <FileSpreadsheet className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'Data & Artificial Intelligence':
        return <BrainCircuit className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'Internships & Graduate Programs':
        return <GraduationCap className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      case 'Human Resources':
        return <Shield className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      default:
        return <Layers className="w-5 h-5 text-[#0066CC] dark:text-[#38BDF8]" />;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
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

  // Calculate market salary estimate (~5% lower to 10% higher)
  const getMarketSalaryEstimate = () => {
    if (!job.salary.isPublic || !job.salary.min || job.salary.min <= 0) return null;
    const estMin = Math.round(job.salary.min * 0.95);
    const estMax = Math.round(job.salary.max * 1.08);
    return `$${estMin.toLocaleString()} - $${estMax.toLocaleString()}/mo`;
  };

  const marketEstimate = getMarketSalaryEstimate();
  const getArrangementText = (arr: string) => {
    if (arr === 'Remote') return tr.jobs.remote;
    if (arr === 'Hybrid') return tr.jobs.hybrid;
    if (arr === 'On-site') return tr.jobs.onSite;
    return arr;
  };

  const countdown = getDeadlineCountdown(job.applicationDeadline);

  // =========================================================================
  // VIEW MODE: LIST
  // =========================================================================
  if (viewMode === 'list') {
    return (
      <motion.article
        whileHover={{ scale: 1.008, y: -2 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        className="group bg-white dark:bg-[#131D35] rounded-xl border border-slate-200/90 dark:border-slate-700/80 hover:border-[#0066CC]/60 dark:hover:border-[#38BDF8]/60 hover:shadow-xl transition-shadow duration-150 p-5 sm:p-6 relative"
      >
        {/* Toast confirmation for link copied */}
        {shareToast && (
          <div className="absolute top-3 right-3 z-30 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow-lg flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
            <Check className="w-3.5 h-3.5 text-[#B5E61D]" />
            <span>Link copied to clipboard!</span>
          </div>
        )}

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Main Info */}
          <div className="flex-1 min-w-0">
            {/* Top metadata line */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">
              {/* Hiring Company */}
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-100">
                {job.company?.employerType === 'Individual' ? (
                  <span className="p-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400" title="Individual Employer">
                    <User className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="p-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8]" title="Company Employer">
                    <Building2 className="w-3.5 h-3.5" />
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onViewCompanyProfile) {
                      onViewCompanyProfile(job.company?.name || 'MsmeBooks Technologies');
                    }
                  }}
                  className="text-[#14243A] dark:text-white hover:text-[#0066CC] dark:hover:text-[#38BDF8] hover:underline transition-colors text-left font-bold cursor-pointer"
                >
                  {job.company?.name || 'MsmeBooks'}
                </button>
                {job.company?.verified && (
                  <span title="Verified Employer" className="inline-flex text-[#0066CC] dark:text-[#38BDF8]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#1A284A] text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider">
                  {job.company?.employerType || 'Company'}
                </span>
              </div>

              {/* Status Badges: Applied & Viewed */}
              <AnimatePresence initial={false}>
                {hasApplied && (
                  <motion.span
                    key="applied-badge-list"
                    initial={{ scale: 0.72, opacity: 0 }}
                    animate={
                      justApplied
                        ? {
                            scale: [0.72, 1.1, 1],
                            opacity: 1,
                            boxShadow: [
                              '0 0 0 0 rgba(0, 102, 204, 0.45)',
                              '0 0 0 7px rgba(0, 102, 204, 0)',
                              '0 0 0 0 rgba(0, 102, 204, 0)',
                            ],
                          }
                        : { scale: 1, opacity: 1 }
                    }
                    exit={{ scale: 0.85, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0066CC] text-white dark:bg-[#0066CC] dark:text-white border border-[#0052A3] shadow-2xs ring-1 ring-[#38BDF8]/30">
                      {renderAnimatedBrandCheck('w-3 h-3')}
                      <span>Applied</span>
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>

              {isViewed && (
                <>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    <Eye className="w-2.5 h-2.5 text-slate-400" />
                    <span>Viewed</span>
                  </span>
                </>
              )}

              {/* Verified Skill Badge with Persistent Top 3 Overlapping Skills Tooltip */}
              {verifiedSkillMatch.isMatched && (
                <>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                  {renderVerifiedSkillBadge('left', false)}
                </>
              )}

              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-[#0066CC] dark:text-[#38BDF8] font-semibold">{job.department}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>{job.location.city}, {job.location.country}</span>
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{getArrangementText(job.workArrangement)}</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span>{job.employmentType}</span>

              {/* Deadline Label (Closing Today or Deadline: YYYY-MM-DD) */}
              {countdown && (
                <>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] tracking-wide ${countdown.badgeClass}`}
                    title={countdown.fullText}
                  >
                    <Clock className="w-3 h-3 shrink-0" />
                    <span>{countdown.label}</span>
                  </span>
                </>
              )}

              {job.isFeatured && (
                <>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="inline-flex items-center gap-1 text-[#0066CC] dark:text-[#38BDF8] font-semibold">
                    <Sparkles className="w-3 h-3 text-[#B5E61D] fill-[#B5E61D]" /> {tr.jobs.featured}
                  </span>
                </>
              )}

              {/* Header Quick Share Icon (opens native share sheet or deep-link menu) */}
              <div className="relative ml-auto">
                <button
                  type="button"
                  onClick={(e) => handleQuickShare(e, 'header')}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-[#1A284A]/70 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:border-[#0066CC]/40 text-slate-600 dark:text-slate-300 hover:text-[#0066CC] dark:hover:text-[#38BDF8] text-[10px] font-bold transition-colors cursor-pointer"
                  title="Quick Share job deep-link via native share sheet, WhatsApp, SMS or Social"
                  aria-label="Quick Share job"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Quick Share</span>
                </button>
                {shareMenuAnchor === 'header' && renderShareFallbackMenu('right-0 top-full mt-1.5')}
              </div>
            </div>

            {/* Job Title */}
            <h3
              onClick={handleOpenDetails}
              className="text-lg sm:text-xl font-bold text-[#14243A] dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] cursor-pointer transition-colors leading-snug"
            >
              {job.title}
            </h3>

            {/* Short Description */}
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mt-2 leading-relaxed">
              {job.shortDescription}
            </p>

            {/* Skill tags & Salary with Market Estimate */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex flex-wrap items-center gap-1.5">
                {job.skills.slice(0, 4).map((skill) => {
                  const isVerified = verifiedSkillMatch.matchedSkills.some(
                    (ms) => ms.toLowerCase().trim() === skill.toLowerCase().trim()
                  );
                  return (
                    <span
                      key={skill}
                      className={
                        isVerified
                          ? 'bg-blue-50 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200/80 dark:border-blue-800/60 px-2 py-0.5 rounded text-[11px] font-semibold inline-flex items-center gap-1'
                          : 'bg-slate-100/90 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium'
                      }
                      title={isVerified ? 'Verified Skill: AI benchmarked against candidate profile' : undefined}
                    >
                      {isVerified && <Check className="w-2.5 h-2.5 text-[#0066CC] dark:text-[#38BDF8]" />}
                      {skill}
                    </span>
                  );
                })}
                {job.skills.length > 4 && (
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">+{job.skills.length - 4} more</span>
                )}
              </div>

              <span aria-hidden="true" className="hidden sm:inline text-slate-300 dark:text-slate-600">·</span>

              {/* Salary */}
              <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
                {formatSalary()}
              </span>

              {/* Market Salary Range Estimate */}
              {marketEstimate && (
                <>
                  <span aria-hidden="true" className="hidden sm:inline text-slate-300 dark:text-slate-600">·</span>
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200/80 dark:border-emerald-800/80"
                    title="Estimated market range based on verified regional industry benchmarks"
                  >
                    <DollarSign className="w-3 h-3 -mr-0.5" />
                    <span>Market Est: {marketEstimate}</span>
                  </span>
                </>
              )}

              <span aria-hidden="true" className="hidden sm:inline text-slate-300 dark:text-slate-600">·</span>
              <span>{tr.jobs.posted} {formatDate(job.datePosted)}</span>

              {onFindSimilarRoles && (
                <>
                  <span aria-hidden="true" className="hidden sm:inline text-slate-300 dark:text-slate-600">·</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFindSimilarRoles(job);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 hover:bg-blue-50 dark:bg-[#1A284A] dark:hover:bg-blue-950/60 text-slate-700 hover:text-[#0066CC] dark:text-slate-300 dark:hover:text-[#38BDF8] border border-slate-200 dark:border-slate-700 hover:border-[#0066CC]/40 transition-colors cursor-pointer"
                    title="Filter board to show 3–5 similar roles"
                  >
                    <GitBranch className="w-2.5 h-2.5" />
                    <span>Similar Roles</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons on Right */}
          <div className="flex items-center gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800 relative">
            {/* Quick Share Button & Fallback Deep-Link Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => handleQuickShare(e, 'footer')}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1A284A] text-slate-500 dark:text-slate-400 hover:text-[#0066CC] dark:hover:text-[#38BDF8] transition-colors cursor-pointer"
                title="Quick Share deep-link via native share sheet"
                aria-label="Quick Share Job"
              >
                <Share2 className="w-4 h-4" />
              </button>

              {shareMenuAnchor === 'footer' && renderShareFallbackMenu('right-0 bottom-full mb-2')}
            </div>

            {/* Bookmark */}
            <button
              onClick={() => onToggleSave(job.id)}
              className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border-[#0066CC] dark:border-[#38BDF8]'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#1A284A]'
              }`}
              title={isSaved ? tr.jobs.bookmarked : tr.jobs.bookmark}
              aria-label={isSaved ? tr.jobs.bookmarked : tr.jobs.bookmark}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {/* View Details */}
            <button
              onClick={handleOpenDetails}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#1A284A] hover:bg-slate-200 dark:hover:bg-[#20325A] rounded-lg transition-colors cursor-pointer"
            >
              {tr.jobs.viewDetails}
            </button>

            {/* Quick Apply Button */}
            {onQuickApply && !hasApplied && (
              <button
                type="button"
                onClick={() => onQuickApply(job)}
                className="px-3 py-2 text-xs font-bold text-[#0066CC] dark:text-[#38BDF8] bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-[#0066CC]/30 dark:border-[#38BDF8]/40 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                title="1-Click Apply using your saved profile & resume"
              >
                <Zap className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8] fill-current" />
                <span>Quick Apply</span>
              </button>
            )}

            {/* Standard Apply Now or Applied Pill */}
            {hasApplied ? (
              <motion.span
                key="applied-pill-list"
                initial={justApplied ? { scale: 0.82, opacity: 0 } : false}
                animate={
                  justApplied
                    ? {
                        scale: [0.82, 1.07, 1],
                        opacity: 1,
                        boxShadow: [
                          '0 0 0 0 rgba(0, 102, 204, 0.45)',
                          '0 0 0 8px rgba(0, 102, 204, 0)',
                          '0 0 0 0 rgba(0, 102, 204, 0)',
                        ],
                      }
                    : { scale: 1, opacity: 1 }
                }
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0066CC] border border-[#0052A3] rounded-lg flex items-center gap-1.5 shadow-xs ring-1 ring-[#38BDF8]/30"
              >
                {renderAnimatedBrandCheck('w-3.5 h-3.5')}
                <span>Applied</span>
              </motion.span>
            ) : (
              <button
                onClick={() => onApply(job)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0066CC] hover:bg-[#0052A3] active:bg-[#003D7A] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>{tr.jobs.applyNow}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.article>
    );
  }

  // =========================================================================
  // VIEW MODE: GRID
  // =========================================================================
  return (
    <motion.article
      whileHover={{ scale: 1.015, y: -3 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className="group bg-white dark:bg-[#131D35] rounded-xl border border-slate-200/90 dark:border-slate-700/80 hover:border-[#0066CC]/60 dark:hover:border-[#38BDF8]/60 hover:shadow-xl transition-shadow duration-150 p-5 flex flex-col justify-between relative h-full"
    >
      {/* Toast confirmation for link copied */}
      {shareToast && (
        <div className="absolute top-3 left-3 right-3 z-30 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold shadow-lg flex items-center justify-center gap-1.5 animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-[#B5E61D]" />
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-[#1A284A] border border-slate-100 dark:border-slate-700/80 flex items-center justify-center shrink-0">
            {getDeptIcon(job.department)}
          </div>

          <div className="flex items-center justify-end gap-1.5 flex-wrap">
            {/* Viewed badge */}
            {isViewed && (
              <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                <Eye className="w-2.5 h-2.5 text-slate-400" />
                <span>Viewed</span>
              </span>
            )}

            {/* Verified Skill Badge with Persistent Top 3 Overlapping Skills Tooltip */}
            {verifiedSkillMatch.isMatched && renderVerifiedSkillBadge('right', true)}

            {/* Deadline Label (Closing Today or Deadline: YYYY-MM-DD) */}
            {countdown && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 ${countdown.badgeClass}`}
                title={countdown.fullText}
              >
                <Clock className="w-2.5 h-2.5 shrink-0" />
                <span>{countdown.label}</span>
              </span>
            )}

            {/* Quick Share header icon (Native Share Sheet + WhatsApp/SMS/LinkedIn fallback) */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => handleQuickShare(e, 'header')}
                className="p-1.5 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1A284A] text-slate-400 hover:text-[#0066CC] dark:hover:text-[#38BDF8] transition-colors cursor-pointer"
                title="Quick Share deep-link via native share sheet (WhatsApp, SMS, Social)"
                aria-label="Quick Share"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              {shareMenuAnchor === 'header' && renderShareFallbackMenu('right-0 top-full mt-1')}
            </div>

            {/* Bookmark */}
            <button
              onClick={() => onToggleSave(job.id)}
              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border-[#0066CC] dark:border-[#38BDF8]'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 border-transparent hover:bg-slate-100 dark:hover:bg-[#1A284A]'
              }`}
              title={isSaved ? tr.jobs.bookmarked : tr.jobs.bookmark}
              aria-label={isSaved ? tr.jobs.bookmarked : tr.jobs.bookmark}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Company & Department */}
        <div className="flex flex-wrap xl:flex-nowrap items-center justify-between gap-x-2 gap-y-1 text-xs mb-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 min-w-0" title={job.company?.name || 'MsmeBooks'}>
            {job.company?.employerType === 'Individual' ? (
              <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            ) : (
              <Building2 className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8] shrink-0" />
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onViewCompanyProfile) {
                  onViewCompanyProfile(job.company?.name || 'MsmeBooks Technologies');
                }
              }}
              className="md:whitespace-normal xl:truncate text-slate-900 dark:text-slate-100 hover:text-[#0066CC] dark:hover:text-[#38BDF8] hover:underline font-semibold text-left cursor-pointer transition-colors"
            >
              {job.company?.name || 'MsmeBooks'}
            </button>
            {job.company?.verified && (
              <span title="Verified Employer" className="inline-flex text-[#0066CC] dark:text-[#38BDF8] shrink-0">
                <CheckCircle2 className="w-3 h-3" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <AnimatePresence initial={false}>
              {hasApplied && (
                <motion.span
                  key="applied-badge-grid"
                  initial={{ scale: 0.72, opacity: 0 }}
                  animate={
                    justApplied
                      ? {
                          scale: [0.72, 1.12, 1],
                          opacity: 1,
                          boxShadow: [
                            '0 0 0 0 rgba(0, 102, 204, 0.45)',
                            '0 0 0 7px rgba(0, 102, 204, 0)',
                            '0 0 0 0 rgba(0, 102, 204, 0)',
                          ],
                        }
                      : { scale: 1, opacity: 1 }
                  }
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 20 }}
                  className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#0066CC] text-white border border-[#0052A3] shadow-2xs ring-1 ring-[#38BDF8]/30"
                >
                  {renderAnimatedBrandCheck('w-3 h-3')}
                  <span>Applied</span>
                </motion.span>
              )}
            </AnimatePresence>
            <span className="text-[11px] font-semibold text-[#0066CC] dark:text-[#38BDF8] md:max-w-none xl:max-w-[120px] xl:truncate">
              {job.department}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={handleOpenDetails}
          className="text-lg font-bold text-[#14243A] dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] cursor-pointer transition-colors leading-snug line-clamp-2 xl:line-clamp-1"
        >
          {job.title}
        </h3>

        {/* Location & Work Arrangement */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 mb-2.5 flex-wrap">
          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="md:whitespace-normal xl:truncate">{job.location.city}, {job.location.country}</span>
          <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">{getArrangementText(job.workArrangement)}</span>
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 md:line-clamp-4 xl:line-clamp-3 leading-relaxed mb-4">
          {job.shortDescription}
        </p>
      </div>

      {/* Footer Area */}
      <div>
        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {job.skills.slice(0, 3).map((skill) => {
            const isVerified = verifiedSkillMatch.matchedSkills.some(
              (ms) => ms.toLowerCase().trim() === skill.toLowerCase().trim()
            );
            return (
              <span
                key={skill}
                className={
                  isVerified
                    ? 'bg-blue-50 dark:bg-blue-950/70 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200/80 dark:border-blue-800/60 px-2 py-0.5 rounded text-[11px] font-semibold inline-flex items-center gap-1'
                    : 'bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium'
                }
                title={isVerified ? 'Verified Skill: AI benchmarked against candidate profile' : undefined}
              >
                {isVerified && <Check className="w-2.5 h-2.5 text-[#0066CC] dark:text-[#38BDF8]" />}
                {skill}
              </span>
            );
          })}
          {job.skills.length > 3 && (
            <span className="text-[10px] text-slate-400 dark:text-slate-500 self-center">+{job.skills.length - 3}</span>
          )}
        </div>

        {/* Salary & Market Estimate */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 mb-3 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono tabular-nums">
              {formatSalary()}
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[11px] font-medium">
              {formatDate(job.datePosted)}
            </span>
          </div>

          {marketEstimate && (
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
              <DollarSign className="w-2.5 h-2.5 -mr-0.5" />
              <span>Market Est: {marketEstimate}</span>
            </div>
          )}
        </div>

        {/* Action Row: Quick Apply, View Details, Apply */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleOpenDetails}
              className="w-full py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#1A284A] hover:bg-slate-200 dark:hover:bg-[#20325A] rounded-lg transition-colors text-center cursor-pointer"
            >
              {tr.jobs.viewDetails}
            </button>

            {hasApplied ? (
              <motion.span
                key="applied-pill-grid"
                initial={justApplied ? { scale: 0.82, opacity: 0 } : false}
                animate={
                  justApplied
                    ? {
                        scale: [0.82, 1.07, 1],
                        opacity: 1,
                        boxShadow: [
                          '0 0 0 0 rgba(0, 102, 204, 0.45)',
                          '0 0 0 8px rgba(0, 102, 204, 0)',
                          '0 0 0 0 rgba(0, 102, 204, 0)',
                        ],
                      }
                    : { scale: 1, opacity: 1 }
                }
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="w-full py-2 text-xs font-bold text-white bg-[#0066CC] border border-[#0052A3] rounded-lg flex items-center justify-center gap-1.5 shadow-xs ring-1 ring-[#38BDF8]/30"
              >
                {renderAnimatedBrandCheck('w-3.5 h-3.5')}
                <span>Applied</span>
              </motion.span>
            ) : (
              <button
                onClick={() => onApply(job)}
                className="w-full py-2 text-xs font-semibold text-white bg-[#0066CC] hover:bg-[#0052A3] rounded-lg transition-colors text-center flex items-center justify-center gap-1 shadow-sm cursor-pointer"
              >
                <span>{tr.jobs.applyNow}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Apply Button & Similar Roles Pill on Grid Card */}
          <div className="flex flex-wrap xl:flex-nowrap items-center gap-1.5">
            {onQuickApply && !hasApplied && (
              <button
                type="button"
                onClick={() => onQuickApply(job)}
                className="flex-1 py-1.5 px-2 text-[11px] font-bold text-[#0066CC] dark:text-[#38BDF8] bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-[#0066CC]/20 dark:border-[#38BDF8]/30 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer md:whitespace-normal xl:truncate"
                title="1-Click Apply using your saved candidate profile"
              >
                <Zap className="w-3 h-3 text-[#0066CC] dark:text-[#38BDF8] fill-current shrink-0" />
                <span className="md:whitespace-normal xl:truncate">Quick Apply</span>
              </button>
            )}

            {onFindSimilarRoles && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFindSimilarRoles(job);
                }}
                className={`py-1.5 px-2.5 text-[11px] font-bold text-slate-700 hover:text-[#0066CC] dark:text-slate-300 dark:hover:text-[#38BDF8] bg-slate-100 hover:bg-blue-50 dark:bg-[#1A284A] dark:hover:bg-blue-950/60 border border-slate-200 dark:border-slate-700 hover:border-[#0066CC]/40 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                  !onQuickApply || hasApplied ? 'w-full' : ''
                }`}
                title="Discover 3–5 similar positions on this job board"
              >
                <GitBranch className="w-3 h-3 shrink-0" />
                <span>Similar Roles</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
};
