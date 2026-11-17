import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar as CalendarIcon, 
  Check, 
  Sparkles,
  Video,
  Globe2
} from 'lucide-react';

export interface BookingCalendarProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  selectedTimeSlot: string;
  onSelectTimeSlot: (slot: string) => void;
  partnerName?: string;
  partnerCountry?: string;
}

const MORNING_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '11:30 AM'];
const AFTERNOON_SLOTS = ['01:00 PM', '02:00 PM', '03:30 PM', '04:30 PM'];
const EVENING_SLOTS = ['05:00 PM', '05:45 PM'];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function getPartnerTimezone(country: string = ''): string {
  switch (country.trim()) {
    case 'Nigeria':
    case 'Cameroon':
      return 'WAT (UTC+1)';
    case 'Ghana':
    case 'Senegal':
    case "Côte d'Ivoire":
      return 'GMT (UTC+0)';
    case 'Kenya':
    case 'Uganda':
    case 'Tanzania':
    case 'Ethiopia':
      return 'EAT (UTC+3)';
    case 'South Africa':
    case 'Rwanda':
    case 'Zambia':
    case 'Botswana':
      return 'SAST/CAT (UTC+2)';
    case 'Egypt':
      return 'EET (UTC+2)';
    case 'United Kingdom':
      return 'BST/GMT (UTC+1)';
    case 'United States':
      return 'EST (UTC-5)';
    case 'UAE':
      return 'GST (UTC+4)';
    case 'Canada':
      return 'EDT (UTC-4)';
    case 'India':
      return 'IST (UTC+5:30)';
    default:
      return 'WAT (UTC+1)';
  }
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  selectedDate,
  onSelectDate,
  selectedTimeSlot,
  onSelectTimeSlot,
  partnerName = 'Partner',
  partnerCountry = 'Nigeria',
}) => {
  // Calendar view year and month
  const [currentYear, setCurrentYear] = useState<number>(() => selectedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => selectedDate.getMonth()); // 0-indexed

  // Today reference for past-date disabling
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Compute month details
  const monthData = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    // Day of week for 1st of month: 0 (Sun) to 6 (Sat)
    // Shift to Mon=0, Sun=6
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek < 0) startingDayOfWeek = 6;

    const days: (Date | null)[] = [];
    // Leading empty slots
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(new Date(currentYear, currentMonth, d));
    }

    return {
      days,
      monthName: firstDayOfMonth.toLocaleString('default', { month: 'long' }),
      year: currentYear,
    };
  }, [currentYear, currentMonth]);

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Quick date pickers
  const selectQuickDay = (offsetDays: number) => {
    const target = new Date(today);
    target.setDate(target.getDate() + offsetDays);
    onSelectDate(target);
    setCurrentYear(target.getFullYear());
    setCurrentMonth(target.getMonth());
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const tz = getPartnerTimezone(partnerCountry);

  const formattedSelectedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      id="interactive-booking-calendar"
      data-testid="interactive-booking-calendar"
      className="space-y-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 p-3.5 sm:p-4 text-white"
    >
      {/* Header Info: Selected summary banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-lime-400/20 text-lime-400 flex items-center justify-center border border-lime-500/30 shrink-0">
            <Video className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-white block">
              {formattedSelectedDate} at {selectedTimeSlot}
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Globe2 className="w-3 h-3 text-lime-400" />
              <span>Partner Timezone: {tz} • 30-min Google Meet</span>
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-300 border border-lime-500/30">
          Instant Slot Reserved
        </span>
      </div>

      {/* Quick Select Preset Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap mr-1">
          Quick Pick:
        </span>
        <button
          type="button"
          onClick={() => selectQuickDay(0)}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => selectQuickDay(1)}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          Tomorrow
        </button>
        <button
          type="button"
          onClick={() => selectQuickDay(2)}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          In 2 Days
        </button>
        <button
          type="button"
          onClick={() => selectQuickDay(7)}
          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold whitespace-nowrap transition-colors"
        >
          Next Week
        </button>
      </div>

      {/* Main Grid: Date Calendar on Left, Time Slots on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-1">
        {/* Left: Interactive Month Calendar (7 Cols on desktop) */}
        <div className="md:col-span-7 bg-slate-950/60 rounded-xl p-3 border border-slate-800">
          {/* Month & Year Navigation Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4 text-lime-400" />
              <span className="text-xs sm:text-sm font-bold text-white">
                {monthData.monthName} {monthData.year}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                id="btn-calendar-prev-month"
                onClick={handlePrevMonth}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Previous Month"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="btn-calendar-next-month"
                onClick={handleNextMonth}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Next Month"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {DAYS_OF_WEEK.map((day) => (
              <span key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {monthData.days.map((dateObj, idx) => {
              if (!dateObj) {
                return <div key={`empty-${idx}`} className="h-8 sm:h-9" />;
              }

              const isPast = dateObj < today;
              const isSelected = isSameDay(dateObj, selectedDate);
              const isTodayDate = isSameDay(dateObj, today);
              const isSunday = dateObj.getDay() === 0;

              return (
                <button
                  key={dateObj.toISOString()}
                  type="button"
                  disabled={isPast}
                  onClick={() => onSelectDate(dateObj)}
                  className={`h-8 sm:h-9 rounded-lg text-xs font-semibold flex flex-col items-center justify-center relative transition-all ${
                    isSelected
                      ? 'bg-lime-500 text-slate-950 font-black shadow-md scale-105 z-10'
                      : isPast
                      ? 'text-slate-600 cursor-not-allowed opacity-35'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  } ${isTodayDate && !isSelected ? 'border border-lime-400/50 text-lime-300' : ''}`}
                  title={`${dateObj.toDateString()}${isPast ? ' (Past)' : ''}`}
                >
                  <span>{dateObj.getDate()}</span>
                  {/* Subtle availability dot for future weekdays */}
                  {!isPast && !isSunday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-lime-400/80 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Available Time Slots (5 Cols on desktop) */}
        <div className="md:col-span-5 bg-slate-950/60 rounded-xl p-3 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Clock className="w-3.5 h-3.5 text-lime-400" />
                <span>Select Time Slot</span>
              </div>
              <span className="text-[10px] text-slate-400">{tz.split(' ')[0]}</span>
            </div>

            {/* Morning Section */}
            <div className="mb-2.5">
              <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                Morning Slots
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {MORNING_SLOTS.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => onSelectTimeSlot(slot)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-lime-500 text-slate-950 border-lime-400 font-extrabold shadow-sm'
                          : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700 hover:border-lime-500/40'
                      }`}
                    >
                      <span>{slot}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Afternoon Section */}
            <div className="mb-2.5">
              <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                Afternoon Slots
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {AFTERNOON_SLOTS.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => onSelectTimeSlot(slot)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-lime-500 text-slate-950 border-lime-400 font-extrabold shadow-sm'
                          : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700 hover:border-lime-500/40'
                      }`}
                    >
                      <span>{slot}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Evening Section */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                Evening Slots
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {EVENING_SLOTS.map((slot) => {
                  const isSelected = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => onSelectTimeSlot(slot)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all border flex items-center justify-between ${
                        isSelected
                          ? 'bg-lime-500 text-slate-950 border-lime-400 font-extrabold shadow-sm'
                          : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700 hover:border-lime-500/40'
                      }`}
                    >
                      <span>{slot}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-400 text-center">
            Automatic calendar invites with Google Meet details are emailed immediately.
          </div>
        </div>
      </div>
    </div>
  );
};
