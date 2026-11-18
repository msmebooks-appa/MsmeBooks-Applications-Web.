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

interface CohortCountdownBannerProps {
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

export const CohortCountdownBanner: React.FC<CohortCountdownBannerProps> = ({
  onOpenApply,
  onOpenStudio,
}) => {
  const { t } = useLanguage();
  // Target upcoming cohort date calculation:
  // Dynamically calculate a persistent upcoming cohort intake date (anchored to 4 days, 16 hours, 35 mins from now or dynamic cycle)
  const calculateTargetDate = () => {
    const storageKey = 'msmebooks_next_cohort_deadline';
    const saved = localStorage.getItem(storageKey);
    const now = Date.now();
    
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (parsed > now + 60000) {
        return parsed;
      }
    }

    // Set new deadline 4 days, 16 hours, 45 minutes, 30 seconds ahead
    const newTarget = now + (4 * 24 * 3600 + 16 * 3600 + 45 * 60 + 30) * 1000;
    try {
      localStorage.setItem(storageKey, newTarget.toString());
    } catch {
      // ignore storage errors
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

      // If timer reached zero, roll forward 7 days for the next cohort intake
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

  // Generate and download a standard .ics calendar invite for the cohort
  const handleDownloadCalendar = () => {
    const startDate = new Date(targetTimestamp);
    const endDate = new Date(targetTimestamp + 4 * 3600 * 1000); // 4-hour kick-off lab

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d+/g, '');
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MsmeBooks//Partner Training Academy//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `DTSTAMP:${formatDate(new Date())}`,
      'UID:msmebooks-cohort-' + targetTimestamp + '@msmebooks.org',
      'SUMMARY:MsmeBooks Partner Implementation Academy - Cohort Kick-Off Lab',
      'DESCRIPTION:Live Kick-Off & Implementation Masterclass for Accredited MsmeBooks Partners. Access credentials and labs provided upon enrollment.',
      'LOCATION:MsmeBooks Virtual Partner Lab & Hybrid Regional Hubs (Lagos, Nairobi, Accra)',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MsmeBooks_Partner_Cohort_Intake.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCalendarDownloaded(true);
    setTimeout(() => setCalendarDownloaded(false), 4000);
  };

  const seatsTotal = 35;
  const seatsOccupied = 28;
  const seatsLeft = seatsTotal - seatsOccupied;
  const percentage = Math.round((seatsOccupied / seatsTotal) * 100);

  // Format double digits
  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="mb-12 rounded-3xl bg-gradient-to-r from-[#061F4A] via-[#0A3981] to-[#061F4A] border-2 border-[#8CE600]/40 p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#8CE600]/10 filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 rounded-full bg-blue-500/10 filter blur-2xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-blue-400/20 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-red-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-red-400 animate-pulse" />
              Cohort Registration Closing Soon
            </span>
            <span className="hidden sm:inline-block text-blue-300/40">|</span>
            <span className="hidden sm:inline-block text-xs font-medium text-blue-200">
              Q4 2026 Pan-African Implementation Specialist Cohort
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#8CE600]/20 text-[#8CE600] border border-[#8CE600]/40 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Accredited Masterclass
            </span>
          </div>
        </div>

        {/* Main Content Grid: Details on Left, Large Countdown on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Urgency & Cohort Information */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              {t('academy.countdown_title', 'Next Academy Cohort Starts in:')}
            </h3>

            <p className="text-sm text-blue-100/90 leading-relaxed max-w-xl">
              Equip your firm before the next quarterly intake closes. Complete 6 accredited modules, secure your verified credential badge, and qualify for up to 40% recurring enterprise revenue.
            </p>

            {/* Capacity / Seats Remaining Progress Bar */}
            <div className="p-4 rounded-2xl bg-[#031536]/80 border border-blue-500/30 backdrop-blur-sm space-y-2.5 max-w-xl">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-blue-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#8CE600]" />
                  Cohort Capacity: <strong className="text-white">{seatsOccupied} / {seatsTotal} Seats Reserved</strong>
                </span>
                <span className="text-[#8CE600] font-black">{percentage}% Filled</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-blue-950 rounded-full h-2.5 overflow-hidden border border-blue-800">
                <div 
                  className="bg-gradient-to-r from-blue-400 via-[#8CE600] to-[#8CE600] h-2.5 rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(140,230,0,0.6)]"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-blue-300/80">
                <span className="flex items-center gap-1 text-amber-300 font-semibold">
                  <AlertTriangle className="w-3 h-3" /> Only {seatsLeft} seats left for this intake
                </span>
                <span>Virtual Labs + Lagos & Nairobi Hubs</span>
              </div>
            </div>

            {/* Quick Benefits Checklist */}
            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-blue-200">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8CE600]" /> 100% Free for Approved Partners
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8CE600]" /> Verifiable Digital Certificate & Badge
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#8CE600]" /> 4 Weeks Self-Paced + Live Lab
              </span>
            </div>
          </div>

          {/* Right Column: Prominent Countdown Digits & Action CTA */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center">
            {/* Live Countdown Digits Box */}
            <div className="w-full max-w-md bg-[#041538]/95 border-2 border-blue-500/40 rounded-2xl p-5 shadow-inner backdrop-blur-md">
              <div className="text-center mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center justify-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#8CE600]" />
                  Countdown to Orientation & Onboarding
                </span>
              </div>

              {/* 4 Digit Boxes */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
                {/* DAYS */}
                <div className="bg-[#0A2552] border border-blue-400/40 rounded-xl p-2.5 sm:p-3 shadow-md">
                  <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight tabular-nums">
                    {pad(timeLeft.days)}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-[#8CE600] uppercase tracking-wider mt-1">
                    Days
                  </div>
                </div>

                {/* HOURS */}
                <div className="bg-[#0A2552] border border-blue-400/40 rounded-xl p-2.5 sm:p-3 shadow-md">
                  <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight tabular-nums">
                    {pad(timeLeft.hours)}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-[#8CE600] uppercase tracking-wider mt-1">
                    Hours
                  </div>
                </div>

                {/* MINUTES */}
                <div className="bg-[#0A2552] border border-blue-400/40 rounded-xl p-2.5 sm:p-3 shadow-md">
                  <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight tabular-nums">
                    {pad(timeLeft.minutes)}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-[#8CE600] uppercase tracking-wider mt-1">
                    Mins
                  </div>
                </div>

                {/* SECONDS */}
                <div className="bg-[#0A2552] border border-[#8CE600]/60 rounded-xl p-2.5 sm:p-3 shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#8CE600] animate-ping m-1.5" />
                  <div className="font-mono text-2xl sm:text-3xl lg:text-4xl font-black text-[#8CE600] tracking-tight tabular-nums">
                    {pad(timeLeft.seconds)}
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-white uppercase tracking-wider mt-1">
                    Secs
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={onOpenApply}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 text-sm font-black text-[#061F4A] bg-[#8CE600] hover:bg-[#9be81c] rounded-xl shadow-lg hover:shadow-[0_0_20px_rgba(140,230,0,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  {t('academy.claim_seat', 'Claim Your Cohort Seat')}
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadCalendar}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-blue-200 bg-blue-900/60 hover:bg-blue-800/80 border border-blue-600/40 rounded-lg transition-colors cursor-pointer"
                    title="Download iCal calendar event"
                  >
                    {calendarDownloaded ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8CE600]" />
                        <span>Added to Calendar!</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="w-3.5 h-3.5 text-blue-300" />
                        <span>Add Cohort to Calendar</span>
                        <Download className="w-3 h-3 text-blue-400" />
                      </>
                    )}
                  </button>

                  {onOpenStudio && (
                    <button
                      type="button"
                      onClick={onOpenStudio}
                      className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#8CE600] hover:text-white bg-transparent hover:bg-white/5 border border-[#8CE600]/40 rounded-lg transition-colors cursor-pointer"
                    >
                      <span>Preview Badge</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
