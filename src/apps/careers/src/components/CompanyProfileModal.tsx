import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Job, CompanyProfile } from '../types/career';
import { resolveCompanyProfile } from '../data/companyProfiles';
import { useCurrency } from '../context/CurrencyContext';
import heroTeamImg from '../assets/images/hero_african_tech_team_1792354230230.jpg';
import collabImg from '../assets/images/multicultural_team_collab_1792771768589.jpg';
import mentorshipImg from '../assets/images/nairobi_dev_pair_programming_1793395123411.jpg';
import strategyImg from '../assets/images/life_team_strategy_1792354230261.jpg';
import femaleEngImg from '../assets/images/life_female_engineer_1792354229834.jpg';
import remoteWorkImg from '../assets/images/life_remote_work_1792354230966.jpg';
import {
  X,
  Building2,
  MapPin,
  Globe,
  Calendar,
  Users,
  CheckCircle2,
  Briefcase,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Share2,
  Heart,
  DollarSign,
  Layers,
  Award,
  ShieldCheck,
  Check,
  Code2,
  Palette,
  TrendingUp,
  Headphones,
  FileSpreadsheet,
  BrainCircuit,
  GraduationCap,
  Bookmark,
  Bell,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  Clock,
  Subtitles,
  Laptop,
  Coffee,
  Monitor,
  Quote,
} from 'lucide-react';

interface VideoChapter {
  id: string;
  title: string;
  timeLabel: string;
  timestamp: number;
  thumbnail: string;
  speaker: string;
  role: string;
  quote: string;
  description: string;
  tag: string;
}

const CULTURE_CHAPTERS: VideoChapter[] = [
  {
    id: 'sprints',
    title: 'Morning Standups & Sprints',
    timeLabel: '0:00 - 0:42',
    timestamp: 0,
    thumbnail: heroTeamImg,
    speaker: 'Tunde Bakare',
    role: 'Staff Platform Engineer · Lagos Hub',
    quote: 'Everyone has extreme ownership here. You don’t wait for permission to fix a customer bottleneck—you ship it.',
    description: 'Autonomous engineering pods syncing on high-throughput offline-first ledger architectures and merchant reconciliation.',
    tag: 'Engineering Squads',
  },
  {
    id: 'workspaces',
    title: 'Modern Labs & Focus Pods',
    timeLabel: '0:43 - 1:25',
    timestamp: 4,
    thumbnail: collabImg,
    speaker: 'Amina Mwangi',
    role: 'Lead UX Researcher · Nairobi Hub',
    quote: 'Our hubs are built around psychological safety. Fluid transitions between solitary deep-focus booths and high-energy whiteboard brainstorms.',
    description: 'Ergonomic sit-stand desks, dual 4K displays, fiber redundancy, and dedicated maker labs.',
    tag: 'Workspace Tour',
  },
  {
    id: 'merchants',
    title: 'Merchant Empathy & Field Days',
    timeLabel: '1:26 - 2:08',
    timestamp: 8,
    thumbnail: strategyImg,
    speaker: 'Kofi Mensah',
    role: 'Principal Product Manager · Accra Hub',
    quote: 'We shadow market traders in downtown Kigali and Kariakoo. Watching a shop owner close their books in 3 taps drives our roadmap.',
    description: 'Quarterly field immersion days where cross-functional squads observe real shopkeepers using our mobile POS in low-connectivity areas.',
    tag: 'Customer Empathy',
  },
  {
    id: 'celebrations',
    title: 'Hackathons & Team Dynamics',
    timeLabel: '2:09 - 2:45',
    timestamp: 12,
    thumbnail: mentorshipImg,
    speaker: 'Adaobi Vance',
    role: 'VP People & Culture · Pan-African',
    quote: 'We champion bold experiments and celebrate learnings openly. It’s an ambitious team united by genuine Pan-African impact.',
    description: 'Ship-It Hackathons, peer mentorship circles, cultural potlucks, and wellness stipends.',
    tag: 'Team Spirit',
  },
];

interface CompanyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string | null;
  allJobs: Job[];
  onApplyJob: (job: Job) => void;
  onViewJobDetails: (job: Job) => void;
  isJobSaved?: (jobId: string) => boolean;
  onToggleSaveJob?: (jobId: string) => void;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  isOpen,
  onClose,
  companyName,
  allJobs,
  onApplyJob,
  onViewJobDetails,
  isJobSaved,
  onToggleSaveJob,
}) => {
  const [activeTab, setActiveTab] = useState<'openings' | 'about' | 'benefits'>('openings');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { formatSalaryRange } = useCurrency();

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [videoDurationSec, setVideoDurationSec] = useState(165); // 2m 45s
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.warn('Playback error', e);
          setIsPlaying(false);
        });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSelectChapter = (index: number) => {
    setActiveChapterIndex(index);
    const chapter = CULTURE_CHAPTERS[index];
    if (videoRef.current) {
      videoRef.current.currentTime = chapter.timestamp;
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 165;
    setCurrentTimeSec(cur);
    setVideoDurationSec(dur);
    setVideoProgress((cur / dur) * 100);

    let foundIdx = 0;
    for (let i = CULTURE_CHAPTERS.length - 1; i >= 0; i--) {
      if (cur >= CULTURE_CHAPTERS[i].timestamp) {
        foundIdx = i;
        break;
      }
    }
    if (foundIdx !== activeChapterIndex) {
      setActiveChapterIndex(foundIdx);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetTime = pos * (videoRef.current.duration || 165);
    videoRef.current.currentTime = targetTime;
    setCurrentTimeSec(targetTime);
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatVideoTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Resolve profile and jobs
  const profile: CompanyProfile = useMemo(() => {
    return resolveCompanyProfile(companyName || '', allJobs);
  }, [companyName, allJobs]);

  const companyJobs = useMemo(() => {
    if (!companyName) return [];
    const normalized = companyName.trim().toLowerCase();
    return allJobs.filter(
      (j) => (j.company?.name || '').trim().toLowerCase() === normalized
    );
  }, [companyName, allJobs]);

  // Unique departments for this company
  const companyDepartments = useMemo(() => {
    return Array.from(new Set(companyJobs.map((j) => j.department)));
  }, [companyJobs]);

  const filteredCompanyJobs = useMemo(() => {
    if (departmentFilter === 'all') return companyJobs;
    return companyJobs.filter((j) => j.department === departmentFilter);
  }, [companyJobs, departmentFilter]);

  if (!isOpen || !companyName) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}?company=${encodeURIComponent(companyName)}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatSalary = (job: Job) => {
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
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently posted';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-sm flex justify-center items-start p-2 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-150"
    >
      <div className="bg-white dark:bg-[#131D35] rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden my-4 sm:my-8 transition-colors duration-200 relative">
        {/* =========================================================================
            1. TOP BRAND COVER BANNER
           ========================================================================= */}
        <div className="relative h-44 sm:h-52 bg-gradient-to-r from-[#14243A] via-[#1B365D] to-[#0066CC] dark:from-[#091122] dark:via-[#112340] dark:to-[#0A488A] overflow-hidden p-6 sm:p-8 flex flex-col justify-between text-white">
          {/* Subtle geometric lines */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#B5E61D]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Bar Actions */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <span className="w-2 h-2 rounded-full bg-[#B5E61D]" />
              <span>Verified Employer Profile</span>
              <span aria-hidden="true" className="opacity-50">·</span>
              <span className="uppercase tracking-wider text-[11px] font-bold text-[#B5E61D]">
                {profile.employerType}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-colors flex items-center gap-1.5"
                title="Share company profile"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#B5E61D]" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Share</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Empty spacer */}
          <div />
        </div>

        {/* =========================================================================
            2. BRAND IDENTITY HEADER & PRIMARY STATS STRIP
           ========================================================================= */}
        <div className="px-6 sm:px-8 pb-6 border-b border-slate-200 dark:border-slate-800 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            {/* Logo Emblem */}
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white dark:bg-[#0D1527] border-4 border-white dark:border-[#131D35] shadow-xl flex items-center justify-center p-3 text-slate-800 dark:text-white shrink-0 relative overflow-hidden">
                {profile.logo ? (
                  <img
                    src={profile.logo}
                    alt={profile.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0066CC] to-[#14243A] rounded-xl flex items-center justify-center text-white font-extrabold text-3xl shadow-inner">
                    {profile.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Title & Headline */}
              <div className="pt-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14243A] dark:text-white tracking-tight">
                    {profile.name}
                  </h1>
                  {profile.verified && (
                    <span title="Verified African Employer" className="text-[#0066CC] dark:text-[#38BDF8]">
                      <CheckCircle2 className="w-5 h-5 fill-current" />
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium mt-1 text-balance">
                  {profile.tagline}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs ${
                  isFollowing
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-white dark:bg-[#1A284A] text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-[#20335C] border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${isFollowing ? 'fill-current text-emerald-600' : ''}`} />
                <span>{isFollowing ? 'Alerts On' : 'Follow Jobs'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('about');
                  setTimeout(() => {
                    if (videoRef.current && !isPlaying) {
                      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
                    }
                  }, 200);
                }}
                className="px-3.5 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-[#1A284A] hover:bg-slate-50 dark:hover:bg-[#20335C] border border-slate-200 dark:border-slate-700 rounded-xl transition-all flex items-center gap-1.5 shadow-2xs group"
                title="Watch Company Culture & Workspace Tour Video"
              >
                <Play className="w-3.5 h-3.5 fill-[#0066CC] dark:fill-[#38BDF8] text-[#0066CC] dark:text-[#38BDF8] group-hover:scale-110 transition-transform" />
                <span>Culture Video</span>
              </button>

              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0052A3] rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <span>Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* Unboxed Metadata Strip (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
              <span className="font-semibold text-slate-900 dark:text-white">{profile.industry}</span>
            </span>

            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>

            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>{profile.headquarters}</span>
            </span>

            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>

            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              <span>{profile.companySize}</span>
            </span>

            {profile.foundedYear && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                  <span>Est. {profile.foundedYear}</span>
                </span>
              </>
            )}

            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>

            <span className="font-bold text-[#0066CC] dark:text-[#38BDF8]">
              {companyJobs.length} Active {companyJobs.length === 1 ? 'Opening' : 'Openings'}
            </span>
          </div>
        </div>

        {/* =========================================================================
            3. SECTION NAVIGATION TABS
           ========================================================================= */}
        <div className="px-6 sm:px-8 bg-slate-50/70 dark:bg-[#0D1527]/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <nav className="flex items-center gap-6" aria-label="Company Profile Tabs">
            <button
              type="button"
              onClick={() => setActiveTab('openings')}
              className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'openings'
                  ? 'border-[#0066CC] text-[#0066CC] dark:border-[#38BDF8] dark:text-[#38BDF8]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Active Job Openings</span>
              <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300">
                {companyJobs.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'about'
                  ? 'border-[#0066CC] text-[#0066CC] dark:border-[#38BDF8] dark:text-[#38BDF8]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>About & Culture</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#0066CC] dark:text-[#38BDF8] flex items-center gap-1 border border-blue-200 dark:border-blue-800">
                <Film className="w-3 h-3" />
                Video
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('benefits')}
              className={`py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'benefits'
                  ? 'border-[#0066CC] text-[#0066CC] dark:border-[#38BDF8] dark:text-[#38BDF8]'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Benefits & Perks ({profile.benefits.length})</span>
            </button>
          </nav>
        </div>

        {/* =========================================================================
            4. TAB CONTENT
           ========================================================================= */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[62vh]">
          {/* TAB 1: ACTIVE JOB OPENINGS */}
          {activeTab === 'openings' && (
            <div className="space-y-6">
              {/* Department filter bar */}
              {companyDepartments.length > 1 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Filter by department:
                  </span>
                  <button
                    type="button"
                    onClick={() => setDepartmentFilter('all')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                      departmentFilter === 'all'
                        ? 'bg-[#14243A] dark:bg-[#0066CC] text-white'
                        : 'bg-slate-100 dark:bg-[#1A284A] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    All Roles ({companyJobs.length})
                  </button>
                  {companyDepartments.map((dept) => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => setDepartmentFilter(dept)}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        departmentFilter === dept
                          ? 'bg-[#14243A] dark:bg-[#0066CC] text-white'
                          : 'bg-slate-100 dark:bg-[#1A284A] text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {dept} ({companyJobs.filter((j) => j.department === dept).length})
                    </button>
                  ))}
                </div>
              )}

              {/* Jobs list */}
              {filteredCompanyJobs.length === 0 ? (
                <div className="py-12 text-center bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] flex items-center justify-center mx-auto mb-3">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    No active positions currently open in this department
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    {profile.name} does not have open positions matching this filter right now. You can subscribe to get notified when new vacancies are published.
                  </p>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => setDepartmentFilter('all')}
                      className="px-4 py-2 text-xs font-bold text-[#0066CC] dark:text-[#38BDF8] hover:underline"
                    >
                      View all {companyJobs.length} openings
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCompanyJobs.map((job) => {
                    const isSaved = isJobSaved ? isJobSaved(job.id) : false;

                    return (
                      <article
                        key={job.id}
                        className="p-5 sm:p-6 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-[#0066CC]/50 dark:hover:border-[#38BDF8]/50 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                      >
                        <div className="flex-1 min-w-0">
                          {/* Unboxed Metadata line */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mb-1.5">
                            <span className="text-[#0066CC] dark:text-[#38BDF8] font-bold">
                              {job.department}
                            </span>
                            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{job.location.city}, {job.location.country}</span>
                            </span>
                            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                            <span className="font-semibold text-slate-700 dark:text-slate-300">{job.workArrangement}</span>
                            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                            <span>{job.employmentType}</span>
                            {job.isFeatured && (
                              <>
                                <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                                <span className="inline-flex items-center gap-1 text-[#0066CC] dark:text-[#38BDF8] font-semibold text-[11px]">
                                  <Sparkles className="w-3 h-3 text-[#B5E61D] fill-[#B5E61D]" /> Featured
                                </span>
                              </>
                            )}
                          </div>

                          {/* Title */}
                          <h4
                            onClick={() => {
                              onClose();
                              onViewJobDetails(job);
                            }}
                            className="text-base sm:text-lg font-bold text-[#14243A] dark:text-white group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8] cursor-pointer transition-colors leading-snug"
                          >
                            {job.title}
                          </h4>

                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1 leading-relaxed">
                            {job.shortDescription}
                          </p>

                          {/* Skills & Salary */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 text-xs">
                            <div className="flex flex-wrap items-center gap-1">
                              {job.skills.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded text-[11px] font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 3 && (
                                <span className="text-[11px] text-slate-400">+{job.skills.length - 3}</span>
                              )}
                            </div>

                            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>

                            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono text-[11px]">
                              {formatSalary(job)}
                            </span>

                            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>

                            <span className="text-slate-400 text-[11px]">
                              Posted {formatDate(job.datePosted)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                          {onToggleSaveJob && (
                            <button
                              type="button"
                              onClick={() => onToggleSaveJob(job.id)}
                              className={`p-2 rounded-xl border transition-colors ${
                                isSaved
                                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border-[#0066CC]'
                                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 border-slate-200 dark:border-slate-700'
                              }`}
                              title={isSaved ? 'Saved' : 'Save position'}
                            >
                              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onViewJobDetails(job);
                            }}
                            className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#1A284A] hover:bg-slate-200 dark:hover:bg-[#20335C] rounded-xl transition-colors"
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onApplyJob(job);
                            }}
                            className="px-4 py-2 text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0052A3] rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                          >
                            <span>Apply</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ABOUT & CULTURE */}
          {activeTab === 'about' && (
            <div className="space-y-8 animate-in fade-in">
              {/* =========================================================================
                  COMPANY CULTURE VIDEO & WORKSPACE TOUR
                 ========================================================================= */}
              <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                        <Film className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                        <span>Company Culture & Workspace Tour</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#B5E61D] text-[#14243A]">
                        Life at {profile.name}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Experience our day-to-day engineering pods, focus workspaces, and merchant-first collaboration.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0">
                    <span className="inline-flex items-center gap-1 font-mono font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      2m 45s Tour
                    </span>
                    <span aria-hidden="true" className="opacity-40">·</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Nairobi & Lagos Hubs
                    </span>
                  </div>
                </div>

                {/* Main Video Player Container */}
                <div
                  ref={videoContainerRef}
                  className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group aspect-[16/9.5] max-h-[440px] flex items-center justify-center select-none"
                >
                  <video
                    ref={videoRef}
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                    poster={CULTURE_CHAPTERS[activeChapterIndex].thumbnail}
                    playsInline
                    muted={isMuted}
                    onTimeUpdate={handleTimeUpdate}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={togglePlay}
                  />

                  {/* Gradient vignettes */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />

                  {/* Top Bar Overlay */}
                  <div className="absolute top-0 inset-x-0 p-4 flex items-center justify-between text-white text-xs z-10 pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-bold tracking-tight text-white drop-shadow-sm">
                        {profile.name} Workplace Culture Tour
                      </span>
                      <span className="text-slate-300 hidden sm:inline">· 4K UHD</span>
                    </div>

                    <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white drop-shadow-sm flex items-center gap-1.5">
                      <span className="text-[#B5E61D] font-bold">Chapter {activeChapterIndex + 1}/4:</span>
                      <span className="truncate max-w-[140px] sm:max-w-none">{CULTURE_CHAPTERS[activeChapterIndex].tag}</span>
                    </div>
                  </div>

                  {/* Center Play/Pause Button when paused */}
                  {!isPlaying && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-black/35 backdrop-blur-[2px] transition-all">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-[#0066CC] to-[#2563EB] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-2xl transition-transform border border-white/30 cursor-pointer group/btn"
                        aria-label="Play Culture Video"
                      >
                        <Play className="w-8 h-8 fill-current translate-x-0.5 text-white group-hover/btn:scale-110 transition-transform" />
                      </button>

                      <div className="text-center px-4">
                        <div className="text-sm sm:text-base font-extrabold text-white drop-shadow-md">
                          Watch Life at {profile.name}
                        </div>
                        <div className="text-xs text-slate-300 font-medium drop-shadow-sm mt-0.5">
                          {CULTURE_CHAPTERS[activeChapterIndex].title} · Click to play
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Subtitle / Caption Card Overlay */}
                  {showSubtitles && (
                    <div className="absolute bottom-14 sm:bottom-16 inset-x-3 sm:inset-x-8 z-10 pointer-events-none transition-all">
                      <div className="bg-black/75 backdrop-blur-md rounded-xl p-3 border border-white/10 text-white shadow-lg max-w-xl mx-auto flex items-start gap-3">
                        <Quote className="w-4 h-4 text-[#B5E61D] shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-[13px] font-medium leading-snug text-slate-100">
                            "{CULTURE_CHAPTERS[activeChapterIndex].quote}"
                          </p>
                          <div className="text-[11px] text-slate-400 mt-1 font-semibold flex items-center gap-1.5 truncate">
                            <span className="text-[#38BDF8]">{CULTURE_CHAPTERS[activeChapterIndex].speaker}</span>
                            <span>·</span>
                            <span>{CULTURE_CHAPTERS[activeChapterIndex].role}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bottom Video Controls Bar */}
                  <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 z-20 flex flex-col gap-2 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
                    {/* Scrubbing timeline */}
                    <div
                      onClick={handleSeek}
                      className="w-full h-2 bg-white/20 hover:h-2.5 rounded-full overflow-hidden cursor-pointer relative transition-all"
                    >
                      <div
                        className="h-full bg-gradient-to-r from-[#0066CC] to-[#B5E61D] relative"
                        style={{ width: `${videoProgress}%` }}
                      >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md" />
                      </div>
                    </div>

                    {/* Controls row */}
                    <div className="flex items-center justify-between text-white text-xs pt-0.5">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="p-1 hover:text-[#B5E61D] transition-colors cursor-pointer"
                          aria-label={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                        </button>

                        <button
                          type="button"
                          onClick={toggleMute}
                          className="p-1 hover:text-[#B5E61D] transition-colors cursor-pointer"
                          aria-label={isMuted ? 'Unmute' : 'Mute'}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>

                        <div className="font-mono text-[11px] text-slate-300">
                          <span>{formatVideoTime(currentTimeSec)}</span>
                          <span className="mx-1 text-slate-500">/</span>
                          <span>{formatVideoTime(videoDurationSec)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowSubtitles(!showSubtitles)}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider transition-colors cursor-pointer border ${
                            showSubtitles
                              ? 'bg-[#B5E61D] text-[#14243A] border-[#B5E61D]'
                              : 'bg-black/40 text-slate-400 border-white/20 hover:text-white'
                          }`}
                          title="Toggle employee commentary subtitles"
                        >
                          CC
                        </button>

                        <button
                          type="button"
                          onClick={toggleFullscreen}
                          className="p-1 hover:text-[#B5E61D] transition-colors cursor-pointer"
                          aria-label="Fullscreen"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapter Navigation Selector Strip */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Tour Chapters & Highlights
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Click any chapter to jump
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {CULTURE_CHAPTERS.map((chapter, idx) => {
                      const isActive = activeChapterIndex === idx;
                      return (
                        <button
                          key={chapter.id}
                          type="button"
                          onClick={() => handleSelectChapter(idx)}
                          className={`p-2 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer group ${
                            isActive
                              ? 'bg-blue-50/80 dark:bg-[#1A284A] border-[#0066CC] dark:border-[#38BDF8] shadow-xs'
                              : 'bg-white dark:bg-[#0D1527] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="relative aspect-video rounded-lg overflow-hidden mb-2 bg-slate-900">
                            <img
                              src={chapter.thumbnail}
                              alt={chapter.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/30" />
                            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-white font-mono text-[9px] font-bold">
                              {chapter.timeLabel}
                            </div>
                            {isActive && (
                              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#B5E61D] text-[#14243A] font-extrabold text-[9px] uppercase tracking-wider">
                                Playing
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="text-[10px] font-bold text-[#0066CC] dark:text-[#38BDF8] uppercase tracking-wider">
                              {chapter.tag}
                            </div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                              {chapter.title}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Workspace Amenities & Team Dynamics Bento Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                  <div className="p-3.5 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0066CC] dark:text-[#38BDF8]">
                      <Monitor className="w-3.5 h-3.5" />
                      <span>Modern Tech Setup</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      M3 Pro MacBooks or Dell XPS, dual 4K monitors, ergonomic Herman Miller seating.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <Laptop className="w-3.5 h-3.5" />
                      <span>Hybrid Autonomy</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      Flexible hub & remote cadence with monthly home office and high-speed internet stipend.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Coffee className="w-3.5 h-3.5" />
                      <span>Hub Energy & Perks</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      Daily catered local lunches, specialty African barista bar, and fresh fruit daily.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Continuous Learning</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                      $1,500 annual budget for conferences, certifications, and technical book allowances.
                    </p>
                  </div>
                </div>
              </section>

              {/* Mission & Vision Bento Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/40 dark:from-[#0E1A33] dark:to-[#142345] rounded-2xl border border-blue-200/70 dark:border-blue-900/50 space-y-2.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#B5E61D]" />
                    <span>Company Mission</span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    "{profile.mission}"
                  </p>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
                    <span>Company Vision</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {profile.vision || profile.tagline}
                  </p>
                </div>
              </div>

              {/* Company Overview Story */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  About {profile.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {profile.about}
                </p>
              </div>

              {/* Core Culture Values */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Culture Values & Operating Principles
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.cultureValues.map((val, idx) => (
                    <div
                      key={val.title}
                      className="p-5 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2"
                    >
                      <div className="text-xs font-bold text-[#0066CC] dark:text-[#38BDF8]">
                        0{idx + 1}. {val.title}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {val.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              {profile.techStack && profile.techStack.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Technology Stack & Tooling
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-slate-100 dark:bg-[#1A284A] text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BENEFITS & PERKS */}
          {activeTab === 'benefits' && (
            <div className="space-y-8 animate-in fade-in">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1">
                  Comprehensive Employee Benefits
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Every permanent team member at {profile.name} is supported with market-leading benefits designed for health, learning, and life balance.
                </p>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.benefits.map((benefit, i) => (
                  <div
                    key={benefit.title}
                    className="p-5 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{benefit.title}</span>
                        </span>
                        {benefit.category && (
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {benefit.category}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Perks Highlights Box */}
              {profile.perksHighlights && profile.perksHighlights.length > 0 && (
                <div className="p-6 bg-slate-50 dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B5E61D]" />
                    <span>Everyday Workspace Perks & Allowances</span>
                  </h4>

                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                    {profile.perksHighlights.map((perk) => (
                      <li key={perk} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0066CC] dark:bg-[#38BDF8] shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================================================================
            5. MODAL FOOTER
           ========================================================================= */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50/80 dark:bg-[#0D1527]/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">All postings verified by MsmeBooks Talent Governance</span>
            <span className="sm:hidden">Verified by MsmeBooks</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1A284A] hover:bg-slate-100 dark:hover:bg-[#20335C] rounded-xl border border-slate-200 dark:border-slate-700 transition-colors"
            >
              Back to Job Board
            </button>

            {companyJobs.length > 0 && activeTab !== 'openings' && (
              <button
                type="button"
                onClick={() => setActiveTab('openings')}
                className="px-5 py-2 text-xs font-bold text-white bg-[#0066CC] hover:bg-[#0052A3] rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>View {companyJobs.length} Openings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
