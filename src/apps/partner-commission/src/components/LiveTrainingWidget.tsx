import React, { useState } from 'react';
import {
  Video,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  X,
  Play,
  CalendarCheck,
  Award,
  ChevronRight,
  BookOpen,
  Download,
  AlertCircle
} from 'lucide-react';

export interface WebinarSession {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  speaker: {
    name: string;
    role: string;
    organization: string;
    initials: string;
    avatarBg: string;
  };
  attendeesCount: number;
  capacity: number;
  category: 'product' | 'growth' | 'compliance';
  tags: string[];
  cpeCredits?: string;
  isRegistered?: boolean;
}

export const UPCOMING_WEBINARS: WebinarSession[] = [
  {
    id: 'webinar-tax-masterclass',
    title: 'Q4 MSME Tax Filing & Invoicing Automation Masterclass',
    subtitle: 'Prepare Nigerian & Pan-African clients for fiscal year-end closing',
    description: 'Deep-dive walkthrough on automating WHT/VAT schedules, e-invoicing export, and one-click reconciliation ahead of fiscal year-end audits.',
    date: 'Thursday, Nov 5, 2026',
    time: '2:00 PM – 3:15 PM WAT (GMT+1)',
    duration: '75 mins · Live Interactive & Q&A',
    speaker: {
      name: 'Amara Okafor, FCA',
      role: 'Lead Accounting Standards Director',
      organization: 'MsmeBooks Technical Advisory',
      initials: 'AO',
      avatarBg: 'bg-[#1261B5]'
    },
    attendeesCount: 184,
    capacity: 250,
    category: 'compliance',
    tags: ['Fiscal Year-End', 'VAT & WHT', 'CPE Eligible'],
    cpeCredits: '1.5 CPE Credits',
    isRegistered: false
  },
  {
    id: 'webinar-pos-rollout',
    title: 'Retail POS Multi-Branch Rollout Playbook for Consultants',
    subtitle: 'Deploying cloud inventory & offline sync for multi-store retail clients',
    description: 'Learn how to pitch, configure, and migrate regional supermarkets and pharmacy chains to MsmeBooks POS with offline resilience and central reporting.',
    date: 'Wednesday, Nov 18, 2026',
    time: '11:00 AM – 12:15 PM WAT (GMT+1)',
    duration: '75 mins · Case Study & Live Demo',
    speaker: {
      name: 'Tunde Adeleke',
      role: 'Head of Solutions Engineering',
      organization: 'MsmeBooks Enterprise Desk',
      initials: 'TA',
      avatarBg: 'bg-emerald-600'
    },
    attendeesCount: 142,
    capacity: 200,
    category: 'product',
    tags: ['POS Hardware', 'Offline Sync', 'Multi-Branch'],
    cpeCredits: '1.0 CPE Credit',
    isRegistered: false
  },
  {
    id: 'webinar-platinum-pitch',
    title: 'Scaling to Platinum (40%): Enterprise Pitch Strategy',
    subtitle: 'Close 10+ store corporate client deals and fast-track to 40% commission',
    description: 'Proven sales scripts, ROI calculator presentations, and executive objection-handling frameworks used by top African partner firms to reach 100+ active clients.',
    date: 'Tuesday, Dec 1, 2026',
    time: '3:00 PM – 4:00 PM WAT (GMT+1)',
    duration: '60 mins · Strategy Mastermind',
    speaker: {
      name: 'Dr. Kwame Mensah',
      role: 'VP of Global Partnerships',
      organization: 'MsmeBooks International',
      initials: 'KM',
      avatarBg: 'bg-purple-600'
    },
    attendeesCount: 218,
    capacity: 300,
    category: 'growth',
    tags: ['Tier Upgrades', 'Sales Enablement', 'Enterprise ROI'],
    cpeCredits: '1.0 CPE Credit',
    isRegistered: false
  },
  {
    id: 'webinar-crossborder-bookkeeping',
    title: 'Pan-African Multi-Currency & Cross-Border Bookkeeping',
    subtitle: 'Managing NGN, GHS, KES, ZAR, and USD books seamlessly',
    description: 'Best practices for supporting businesses operating across West, East, and Southern Africa with real-time FX conversions and multi-entity consolidation.',
    date: 'Thursday, Dec 10, 2026',
    time: '1:00 PM – 2:15 PM WAT (GMT+1)',
    duration: '75 mins · Technical Architecture',
    speaker: {
      name: 'Fatima Sanusi',
      role: 'Regional Fintech Systems Lead',
      organization: 'MsmeBooks Product Operations',
      initials: 'FS',
      avatarBg: 'bg-amber-600'
    },
    attendeesCount: 96,
    capacity: 150,
    category: 'product',
    tags: ['Multi-Currency', 'FX Rate Management', 'Consolidated P&L'],
    cpeCredits: '1.5 CPE Credits',
    isRegistered: false
  }
];

export interface RsvpToastState {
  webinar: WebinarSession;
  action: 'registered' | 'cancelled';
  calendarUrl: string;
}

interface LiveTrainingWidgetProps {
  onRsvpToast?: (toast: RsvpToastState) => void;
  className?: string;
  isCompact?: boolean;
}

export const LiveTrainingWidget: React.FC<LiveTrainingWidgetProps> = ({
  onRsvpToast,
  className = '',
  isCompact = false
}) => {
  const [sessions, setSessions] = useState<WebinarSession[]>(UPCOMING_WEBINARS);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'my-rsvps' | 'product' | 'growth' | 'compliance'>('all');

  const registeredCount = sessions.filter((s) => s.isRegistered).length;

  const generateGoogleCalendarUrl = (session: WebinarSession) => {
    const title = encodeURIComponent(`[MsmeBooks Webinar] ${session.title}`);
    const details = encodeURIComponent(
      `${session.subtitle}\n\nSpeaker: ${session.speaker.name} (${session.speaker.role})\n\nLive Access URL: https://www.msmebooks.org/partner/live-stream/${session.id}\n\nDescription: ${session.description}`
    );
    const location = encodeURIComponent('MsmeBooks Partner Virtual Auditorium (Zoom / Google Meet)');
    // Dates formatted for demo: Nov 2026
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const handleToggleRsvp = (sessionId: string) => {
    let triggeredSession: WebinarSession | null = null;
    let nextStatus = false;

    setSessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          nextStatus = !session.isRegistered;
          triggeredSession = {
            ...session,
            isRegistered: nextStatus,
            attendeesCount: nextStatus ? session.attendeesCount + 1 : Math.max(0, session.attendeesCount - 1)
          };
          return triggeredSession;
        }
        return session;
      })
    );

    if (triggeredSession && onRsvpToast) {
      onRsvpToast({
        webinar: triggeredSession,
        action: nextStatus ? 'registered' : 'cancelled',
        calendarUrl: generateGoogleCalendarUrl(triggeredSession)
      });
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (selectedFilter === 'my-rsvps') return s.isRegistered;
    if (selectedFilter === 'all') return true;
    return s.category === selectedFilter;
  });

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Widget Header Banner */}
      <div className="bg-gradient-to-r from-[#142D4E] via-[#123E6E] to-[#1261B5] rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-0 right-16 w-32 h-32 rounded-full bg-[#B9E51C]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#B9E51C] text-[#142D4E] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
                Live Partner Webinars
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Monthly Interactive Masterclasses · CPE Accredited
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Live Partner Training & Masterclass Schedule
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Sharpen your advisory skills, master the newest accounting & POS releases, and discover proven frameworks to scale your recurring commissions. One-click RSVP reserves your virtual seat and generates immediate calendar reminders.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/15 shrink-0">
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-slate-300 font-medium block">Your Registered Sessions:</span>
              <span className="text-lg sm:text-2xl font-black text-[#B9E51C] font-mono tabular-nums">
                {registeredCount} / {sessions.length}
              </span>
            </div>
            {registeredCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3 text-[#B9E51C]" />
                <span>Seats Active</span>
              </span>
            )}
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-[#B9E51C] text-[#142D4E] shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            All Monthly Webinars ({sessions.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('my-rsvps')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedFilter === 'my-rsvps'
                ? 'bg-[#B9E51C] text-[#142D4E] shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>My RSVPs ({registeredCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('compliance')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedFilter === 'compliance'
                ? 'bg-[#B9E51C] text-[#142D4E] shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Tax & Compliance
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('product')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedFilter === 'product'
                ? 'bg-[#B9E51C] text-[#142D4E] shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Product & POS
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('growth')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              selectedFilter === 'growth'
                ? 'bg-[#B9E51C] text-[#142D4E] shadow-sm'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            Growth & Sales
          </button>
        </div>
      </div>

      {/* Webinars List / Cards */}
      {filteredSessions.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 dark:bg-[#0e1b30] border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-[#142D4E] dark:text-white mb-1">
            No registered sessions yet
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            Click 'RSVP in 1-Click' on any of the upcoming masterclasses below to reserve your virtual seat.
          </p>
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className="px-4 py-2 bg-[#1261B5] hover:bg-[#0e4e94] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Browse All Webinars
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSessions.map((session) => {
            const isFull = session.attendeesCount >= session.capacity;
            const remaining = Math.max(0, session.capacity - session.attendeesCount);

            return (
              <div
                key={session.id}
                className={`rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between ${
                  session.isRegistered
                    ? 'bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/30 dark:from-[#0f2824] dark:via-[#0e1b30] dark:to-[#102436] border-emerald-400/70 dark:border-emerald-500/40 shadow-md ring-1 ring-emerald-400/20'
                    : 'bg-white dark:bg-[#0e1b30] border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm'
                }`}
              >
                <div>
                  {/* Card Top Meta Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#142D4E] dark:bg-[#192f52] text-white">
                        <Calendar className="w-3 h-3 text-[#B9E51C]" />
                        <span>{session.date}</span>
                      </span>

                      {session.cpeCredits && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#1261B5] dark:text-sky-300 border border-blue-200/60 dark:border-blue-800">
                          <Award className="w-3 h-3" />
                          <span>{session.cpeCredits}</span>
                        </span>
                      )}

                      {session.isRegistered && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-white shadow-xs">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>RSVP Confirmed</span>
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
                      {remaining} seats left
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h4 className="text-base font-extrabold text-[#142D4E] dark:text-white leading-snug mb-1">
                    {session.title}
                  </h4>
                  <p className="text-xs font-medium text-[#1261B5] dark:text-[#B9E51C] mb-2.5">
                    {session.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                    {session.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {session.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Speaker & Timing Grid */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#14233c] border border-slate-200/80 dark:border-slate-700/80 mb-4 space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full ${session.speaker.avatarBg} text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm`}>
                        {session.speaker.initials}
                      </div>
                      <div className="min-w-0">
                        <strong className="text-xs text-[#142D4E] dark:text-white block truncate">
                          {session.speaker.name}
                        </strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                          {session.speaker.role} · {session.speaker.organization}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px] text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{session.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Video className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{session.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#0e1b30]">JD</span>
                      <span className="w-5 h-5 rounded-full bg-purple-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#0e1b30]">AM</span>
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-[#0e1b30]">KO</span>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      <strong>{session.attendeesCount}</strong> partners attending
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {session.isRegistered ? (
                      <>
                        <a
                          href={generateGoogleCalendarUrl(session)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] bg-[#1261B5]/10 dark:bg-[#B9E51C]/10 hover:bg-[#1261B5]/20 transition-colors flex items-center gap-1.5"
                          title="Add event to your calendar"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Add to Cal</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => handleToggleRsvp(session.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-emerald-800 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950/70 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-300 border border-emerald-300 dark:border-emerald-800 transition-all cursor-pointer group flex items-center gap-1.5"
                          title="Click to cancel RSVP"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:hidden" />
                          <X className="w-3.5 h-3.5 text-red-500 hidden group-hover:inline" />
                          <span className="group-hover:hidden">Seat Reserved ✓</span>
                          <span className="hidden group-hover:inline">Cancel RSVP</span>
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleToggleRsvp(session.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1261B5] hover:bg-[#0e4e94] active:scale-95 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1261B5] focus:ring-offset-2"
                      >
                        <CalendarCheck className="w-3.5 h-3.5 text-[#B9E51C]" />
                        <span>RSVP in 1-Click</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface RsvpConfirmationToastProps {
  toastState: RsvpToastState | null;
  onDismiss: () => void;
}

export const RsvpConfirmationToast: React.FC<RsvpConfirmationToastProps> = ({
  toastState,
  onDismiss
}) => {
  const [progress, setProgress] = useState(100);

  React.useEffect(() => {
    if (!toastState) return;

    setProgress(100);
    const duration = 6000; // 6 seconds
    const intervalTime = 50;
    const decrement = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - decrement;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [toastState, onDismiss]);

  if (!toastState) return null;

  const { webinar, action, calendarUrl } = toastState;
  const isRegistered = action === 'registered';

  return (
    <div className="fixed sm:absolute top-5 right-5 z-50 max-w-md w-[calc(100%-2.5rem)] animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className={`rounded-2xl p-4 sm:p-5 shadow-2xl border-2 backdrop-blur-md relative overflow-hidden text-white ${
          isRegistered
            ? 'bg-[#142D4E] border-emerald-400 shadow-emerald-500/20'
            : 'bg-[#142D4E] border-slate-500 shadow-black/30'
        }`}
      >
        {/* Animated Progress Timer Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
          <div
            className={`h-full transition-all duration-75 ease-linear ${
              isRegistered
                ? 'bg-gradient-to-r from-emerald-400 to-[#B9E51C]'
                : 'bg-slate-400'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Content Header */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-inner ${
                isRegistered
                  ? 'bg-emerald-500/20 border border-emerald-400/40 text-[#B9E51C]'
                  : 'bg-slate-700/50 border border-slate-600 text-slate-300'
              }`}
            >
              {isRegistered ? (
                <CalendarCheck className="w-5 h-5 text-[#B9E51C]" />
              ) : (
                <X className="w-5 h-5 text-slate-300" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full ${
                    isRegistered
                      ? 'bg-[#B9E51C] text-[#142D4E]'
                      : 'bg-slate-600 text-white'
                  }`}
                >
                  {isRegistered ? '🎉 RSVP Confirmed' : 'RSVP Cancelled'}
                </span>
                <span className="text-[10px] text-slate-300 font-mono">
                  Virtual Seat #MSME-{webinar.attendeesCount}
                </span>
              </div>
              <h5 className="text-xs sm:text-sm font-bold text-white mt-1 leading-snug line-clamp-1">
                {webinar.title}
              </h5>
            </div>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toast Body */}
        <div className="text-xs text-slate-200 mb-3 space-y-1">
          <p className="flex items-center gap-2 text-[11px] text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-[#B9E51C] shrink-0" />
            <span><strong>{webinar.date}</strong> · {webinar.time}</span>
          </p>
          <p className="text-[11px] text-slate-300">
            {isRegistered
              ? 'Calendar invite & join link sent to partner.ace@advisory.ng. We will send a reminder 15 mins before kick-off!'
              : 'Your seat reservation has been released. You can re-register anytime before capacity is reached.'}
          </p>
        </div>

        {/* Action Buttons */}
        {isRegistered && (
          <div className="flex items-center gap-2 pt-2 border-t border-white/10">
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 px-3 bg-[#1261B5] hover:bg-[#0e4e94] text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#B9E51C]" />
              <span>Add to Google Calendar</span>
            </a>

            <button
              type="button"
              onClick={onDismiss}
              className="py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
