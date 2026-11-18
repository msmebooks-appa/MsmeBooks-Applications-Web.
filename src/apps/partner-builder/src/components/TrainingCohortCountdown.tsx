import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Flame, 
  Users, 
  ArrowRight, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface TrainingCohortCountdownProps {
  onOpenApply: () => void;
  onOpenStudio?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export const TrainingCohortCountdown: React.FC<TrainingCohortCountdownProps> = ({
  onOpenApply,
  onOpenStudio,
}) => {
  const { t } = useLanguage();

  const calculateTargetDate = () => {
    const storageKey = 'msmebooks_next_cohort_deadline';
    const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    const now = Date.now();
    
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed > now + 60000) {
        return parsed;
      }
    }

    const newTarget = now + (4 * 24 * 3600 + 16 * 3600 + 45 * 60 + 30) * 1000;
    try {
      localStorage.setItem(storageKey, newTarget.toString());
    } catch {
      // ignore
    }
    return newTarget;
  };

  const [targetTimestamp, setTargetTimestamp] = useState<number>(calculateTargetDate);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 4,
    hours: 16,
    minutes: 45,
    seconds: 30,
    totalSeconds: 405930,
  });
  const [calendarDownloaded, setCalendarDownloaded] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      let diff = Math.max(0, Math.floor((targetTimestamp - now) / 1000));

      if (diff <= 0) {
        const nextCycle = now + (7 * 24 * 3600) * 1000;
        setTargetTimestamp(nextCycle);
        localStorage.setItem('msmebooks_next_cohort_deadline', nextCycle.toString());
        diff = 7 * 24 * 3600;
      }

      const days = Math.floor(diff / (24 * 3600));
      const hours = Math.floor((diff % (24 * 3600)) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        totalSeconds: diff,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  const handleDownloadCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MsmeBooks//Partner Training Academy//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:msme-cohort-${Date.now()}@msmebooks.org
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${new Date(targetTimestamp).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${new Date(targetTimestamp + 3 * 3600 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:MsmeBooks Partner Technical Certification & Academy Cohort
DESCRIPTION:Official live onboarding, ERP & POS migration masterclass, statutory tax setup, and partner certification exam review.
LOCATION:Virtual Interactive Classroom (Lagos / Nairobi / Online)
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MsmeBooks-Certified-Partner-Cohort.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCalendarDownloaded(true);
    setTimeout(() => setCalendarDownloaded(false), 3000);
  };

  const format2Digits = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="mb-14 relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#041533] via-[#072557] to-[#0A3981] border-2 border-[#8CE600]/40 shadow-2xl p-6 sm:p-8 text-white">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-[#8CE600]/15 filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 rounded-full bg-sky-500/10 filter blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left: Intake Badge & Headline */}
        <div className="w-full lg:max-w-xl text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8CE600]/20 border border-[#8CE600]/50 text-[#8CE600] text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-4 h-4 text-[#8CE600] animate-pulse" />
            <span>Next Accredited Intake · Q4 Pan-African Cohort</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-2">
            Limited Seats: Next Partner Certification Cohort Closes Soon
          </h3>

          <p className="text-sm text-blue-100/90 leading-relaxed mb-4">
            Join 80+ practicing accountants and systems integrators in the upcoming fast-track technical certification. Secure your firm's territory accreditation and listing in the verified directory.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-blue-200">
            <span className="flex items-center gap-1.5 bg-blue-900/60 px-2.5 py-1 rounded-lg border border-blue-700/60">
              <Users className="w-3.5 h-3.5 text-[#8CE600]" />
              <strong className="text-white">14 Seats Remaining</strong> across WA & EA
            </span>
            <span className="flex items-center gap-1.5 bg-blue-900/60 px-2.5 py-1 rounded-lg border border-blue-700/60">
              <Sparkles className="w-3.5 h-3.5 text-[#8CE600]" />
              Tuition 100% Sponsored for Registered Partners
            </span>
          </div>
        </div>

        {/* Center/Right: Live Flip Timer & Action CTAs */}
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-end gap-5">
          {/* Flip Clock Units */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Days */}
            <div className="flex flex-col items-center">
              <div className="w-16 sm:w-20 h-18 sm:h-20 bg-slate-900/90 border-2 border-blue-600/70 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
                <span className="font-mono text-2xl sm:text-4xl font-extrabold text-[#8CE600] tabular-nums">
                  {format2Digits(timeLeft.days)}
                </span>
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-200 mt-1.5">
                Days
              </span>
            </div>

            <span className="text-xl sm:text-2xl font-bold text-blue-400 mb-5">:</span>

            {/* Hours */}
            <div className="flex flex-col items-center">
              <div className="w-16 sm:w-20 h-18 sm:h-20 bg-slate-900/90 border-2 border-blue-600/70 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
                <span className="font-mono text-2xl sm:text-4xl font-extrabold text-white tabular-nums">
                  {format2Digits(timeLeft.hours)}
                </span>
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-200 mt-1.5">
                Hours
              </span>
            </div>

            <span className="text-xl sm:text-2xl font-bold text-blue-400 mb-5">:</span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <div className="w-16 sm:w-20 h-18 sm:h-20 bg-slate-900/90 border-2 border-blue-600/70 rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
                <span className="font-mono text-2xl sm:text-4xl font-extrabold text-white tabular-nums">
                  {format2Digits(timeLeft.minutes)}
                </span>
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-200 mt-1.5">
                Mins
              </span>
            </div>

            <span className="text-xl sm:text-2xl font-bold text-blue-400 mb-5">:</span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <div className="w-16 sm:w-20 h-18 sm:h-20 bg-slate-900/90 border-2 border-[#8CE600] rounded-2xl flex items-center justify-center shadow-inner relative overflow-hidden">
                <span className="font-mono text-2xl sm:text-4xl font-extrabold text-[#8CE600] tabular-nums animate-pulse">
                  {format2Digits(timeLeft.seconds)}
                </span>
                <div className="absolute inset-x-0 top-1/2 h-px bg-white/10" />
              </div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#8CE600] mt-1.5">
                Secs
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-3 w-full">
            <button
              onClick={onOpenApply}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-[#061F4A] bg-[#8CE600] hover:bg-[#9cf018] rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 cursor-pointer"
            >
              Reserve Cohort Seat Now
              <ArrowRight className="w-4 h-4 text-[#061F4A]" />
            </button>

            <button
              onClick={handleDownloadCalendar}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-white bg-blue-900/70 hover:bg-blue-800 border border-blue-500/50 rounded-xl transition-colors cursor-pointer"
            >
              {calendarDownloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#8CE600]" />
                  Invite Added (.ics)
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 text-sky-300" />
                  Add to Calendar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
