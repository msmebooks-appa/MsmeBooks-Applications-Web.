import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  Radio,
  CheckCircle2,
  Globe2,
  Loader2,
  ArrowRight,
  CalendarCheck,
} from 'lucide-react';
import { Partner } from '../types';
import { useLiveScheduling } from '../context/LiveSchedulingContext';
import { formatSyncTimeAgo } from '../services/schedulingApi';
import { getPartnerTimezone } from './BookingCalendar';

interface PartnerMiniCalendarProps {
  partner: Partner;
  onRequestConsultation: (partner: Partner) => void;
}

const ALL_DAILY_SLOTS = [
  '09:30 AM',
  '11:00 AM',
  '01:30 PM',
  '02:30 PM',
  '03:30 PM',
  '04:30 PM',
];

const WEEKDAYS_SHORT = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getPartnerSeed(partnerId: string): number {
  let sum = 0;
  for (let i = 0; i < partnerId.length; i++) {
    sum += partnerId.charCodeAt(i) * (i + 1);
  }
  return sum;
}

export const PartnerMiniCalendar: React.FC<PartnerMiniCalendarProps> = ({
  partner,
  onRequestConsultation,
}) => {
  const {
    getPartnerAvailability,
    syncPartnerAvailability,
    bookSlot,
    syncingPartnerIds,
  } = useLiveScheduling();

  const live = getPartnerAvailability(partner.id);
  const isSyncing = syncingPartnerIds.has(partner.id);
  const timezone = getPartnerTimezone(partner.country);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Default to today if slots open today, otherwise tomorrow (or next weekday)
  const initialSelectedDate = useMemo(() => {
    const d = new Date(today);
    if (live.availableSlotsToday === 0) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    }
    return d;
  }, [today, partner.id]);

  const [selectedDate, setSelectedDate] = useState<Date>(initialSelectedDate);
  const [viewYear, setViewYear] = useState<number>(() => initialSelectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => initialSelectedDate.getMonth());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookingConfirmation, setBookingConfirmation] = useState<{
    dateLabel: string;
    slot: string;
    message: string;
  } | null>(null);
  const [hasInitialFetched, setHasInitialFetched] = useState<boolean>(false);

  // Automatically fetch/sync live availability from LiveSchedulingProvider when modal opens or partner changes
  useEffect(() => {
    let cancelled = false;
    setBookingConfirmation(null);
    setHasInitialFetched(false);

    const startDate = new Date(today);
    const currentAvail = getPartnerAvailability(partner.id);
    if (currentAvail.availableSlotsToday === 0) {
      startDate.setDate(startDate.getDate() + 1);
      if (startDate.getDay() === 0) startDate.setDate(startDate.getDate() + 1);
    }
    setSelectedDate(startDate);
    setViewYear(startDate.getFullYear());
    setViewMonth(startDate.getMonth());

    syncPartnerAvailability(partner.id)
      .catch(() => {
        // Handled cleanly via existing store fallback
      })
      .finally(() => {
        if (!cancelled) setHasInitialFetched(true);
      });

    return () => {
      cancelled = true;
    };
  }, [partner.id, syncPartnerAvailability, today]);

  // Compute deterministic open slots for any given calendar day backed by LiveSchedulingProvider state
  const getSlotsForDate = useMemo(() => {
    const seed = getPartnerSeed(partner.id);
    return (date: Date): string[] => {
      const check = new Date(date);
      check.setHours(0, 0, 0, 0);
      if (check < today || check.getDay() === 0) return [];

      // Today strictly mirrors real-time availableSlotsToday from LiveSchedulingProvider
      if (isSameDay(check, today)) {
        const count = Math.max(0, live.availableSlotsToday);
        if (count === 0) return [];
        const startIdx = Math.max(0, ALL_DAILY_SLOTS.length - count);
        return ALL_DAILY_SLOTS.slice(startIdx);
      }

      // Upcoming days: Saturday reduced availability, weekdays 2-5 open windows
      if (check.getDay() === 6) {
        return live.isAcceptingRequests ? ['10:00 AM', '11:30 AM'] : [];
      }

      const dayOffset = Math.round((check.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      const basePool = ALL_DAILY_SLOTS;
      const hash = (seed + dayOffset * 7) % 4;

      if (!live.isAcceptingRequests && dayOffset <= 2) {
        // Partner currently booked for next couple days; waitlist/limited next-week slots
        return [];
      }

      const slotCount = Math.min(basePool.length, 3 + ((seed + dayOffset) % 3));
      const rotated = [...basePool.slice(hash), ...basePool.slice(0, hash)];
      return rotated.slice(0, slotCount).sort((a, b) => basePool.indexOf(a) - basePool.indexOf(b));
    };
  }, [partner.id, today, live.availableSlotsToday, live.isAcceptingRequests]);

  const activeDaySlots = useMemo(() => getSlotsForDate(selectedDate), [getSlotsForDate, selectedDate]);

  // Keep selectedSlot valid when activeDaySlots change
  useEffect(() => {
    if (activeDaySlots.length > 0) {
      if (!activeDaySlots.includes(selectedSlot)) {
        setSelectedSlot(activeDaySlots[0]);
      }
    } else {
      setSelectedSlot('');
    }
  }, [activeDaySlots, selectedSlot]);

  // Calendar grid days for viewMonth / viewYear
  const calendarDays = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    const lastDay = new Date(viewYear, viewMonth + 1, 0);
    let offset = firstDay.getDay() - 1;
    if (offset < 0) offset = 6;

    const cells: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      cells.push(new Date(viewYear, viewMonth, d));
    }
    return {
      cells,
      monthTitle: firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };
  }, [viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleReserveQuickSlot = async () => {
    if (!selectedSlot || isBooking) return;
    setIsBooking(true);
    try {
      const res = await bookSlot(partner.id, {
        service: 'Discovery Consultation',
      });
      const dateLabel = selectedDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      setBookingConfirmation({
        dateLabel,
        slot: selectedSlot,
        message: res.message,
      });
    } finally {
      setIsBooking(false);
    }
  };

  const formattedSelectedDay = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const isBookedToday = !live.isAcceptingRequests || live.availableSlotsToday === 0;

  return (
    <div
      id={`partner-mini-calendar-${partner.id}`}
      data-testid="partner-mini-calendar"
      className="bg-[#0c2342] border border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg"
    >
      {/* Header: Live Scheduling Provider Context */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-700/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center shrink-0">
            <CalendarIcon className="w-4 h-4 text-lime-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white">
                Real-Time Availability Calendar
              </h3>
              <span
                data-testid="mini-calendar-live-status"
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                  isBookedToday
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                }`}
              >
                <Radio className={`w-2.5 h-2.5 ${isBookedToday ? 'text-amber-400' : 'text-emerald-400 animate-pulse'}`} />
                <span>{live.status}</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>Synced via <strong className="text-slate-200">{live.calendarProvider}</strong></span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-lime-400" />
                {timezone}
              </span>
              <span>•</span>
              <span className="font-mono text-slate-300">
                {isSyncing && !hasInitialFetched ? 'Fetching live slots...' : `Updated ${formatSyncTimeAgo(live.lastSyncedTimestamp)}`}
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          id={`btn-mini-calendar-sync-${partner.id}`}
          data-testid="btn-mini-calendar-sync"
          onClick={() => syncPartnerAvailability(partner.id)}
          disabled={isSyncing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-lime-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Refresh Slots'}</span>
        </button>
      </div>

      {/* Main Split: Mini Month Grid (Left) + Real-Time Slots (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Mini Month Calendar */}
        <div className="md:col-span-6 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-white">{calendarDays.monthTitle}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAYS_SHORT.map((d) => (
              <span key={d} className="text-[10px] font-bold text-slate-500 uppercase">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 tabular-nums">
            {calendarDays.cells.map((day, idx) => {
              if (!day) {
                return <div key={`blank-${idx}`} className="h-8" />;
              }

              const isPast = day < today;
              const isSelected = isSameDay(day, selectedDate);
              const isTodayDate = isSameDay(day, today);
              const daySlots = getSlotsForDate(day);
              const hasSlots = daySlots.length > 0;

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  disabled={isPast}
                  onClick={() => {
                    setSelectedDate(day);
                    setBookingConfirmation(null);
                  }}
                  aria-label={`${day.toDateString()} (${daySlots.length} slots available)`}
                  title={`${day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}: ${
                    isPast ? 'Past' : hasSlots ? `${daySlots.length} open slots` : 'No slots'
                  }`}
                  className={`h-8 rounded-lg text-xs font-semibold flex flex-col items-center justify-center relative transition-all ${
                    isSelected
                      ? 'bg-lime-500 text-slate-950 font-black shadow-sm cursor-pointer'
                      : isPast
                      ? 'text-slate-600 opacity-35 cursor-not-allowed'
                      : hasSlots
                      ? 'text-slate-100 hover:bg-slate-800 cursor-pointer'
                      : 'text-slate-500 hover:bg-slate-900 cursor-pointer'
                  } ${isTodayDate && !isSelected ? 'ring-1 ring-lime-400/50 text-lime-300' : ''}`}
                >
                  <span className="leading-none">{day.getDate()}</span>
                  {!isPast && (
                    <span
                      className={`w-1 h-1 rounded-full mt-0.5 ${
                        isSelected
                          ? 'bg-slate-950'
                          : hasSlots
                          ? 'bg-emerald-400'
                          : 'bg-slate-600'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Open slots</span>
            </span>
            <span>Next opening: <strong className="text-slate-200">{live.nextAvailableSlot}</strong></span>
          </div>
        </div>

        {/* Real-Time Slots Panel */}
        <div className="md:col-span-6 bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <Clock className="w-3.5 h-3.5 text-lime-400" />
                <span>Slots for {formattedSelectedDay}</span>
              </div>
              <span className="text-[11px] font-bold text-lime-400 tabular-nums">
                {activeDaySlots.length} {activeDaySlots.length === 1 ? 'Slot' : 'Slots'} Open
              </span>
            </div>

            {isSyncing && !hasInitialFetched ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-lime-400" />
                <span>Fetching real-time calendar slots...</span>
              </div>
            ) : activeDaySlots.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-1.5 tabular-nums">
                {activeDaySlots.map((slot) => {
                  const isPicked = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      data-testid={`mini-calendar-slot-${slot.replace(/[\s:]/g, '-').toLowerCase()}`}
                      onClick={() => {
                        setSelectedSlot(slot);
                        setBookingConfirmation(null);
                      }}
                      className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isPicked
                          ? 'bg-lime-500 text-slate-950 border-lime-400 font-extrabold shadow-sm'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700 hover:border-lime-500/40'
                      }`}
                    >
                      <span>{slot}</span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-5 px-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center space-y-1.5">
                <p className="text-xs font-semibold text-amber-300">
                  No open slots on {formattedSelectedDay}
                </p>
                <p className="text-[11px] text-slate-400">
                  Select another highlighted date on the calendar or join the priority waitlist.
                </p>
              </div>
            )}
          </div>

          {bookingConfirmation ? (
            <div
              data-testid="mini-calendar-booking-confirmed"
              className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs space-y-1.5"
            >
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Slot Held: {bookingConfirmation.dateLabel} at {bookingConfirmation.slot}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {bookingConfirmation.message}
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {activeDaySlots.length > 0 ? (
                <button
                  type="button"
                  id={`btn-mini-calendar-reserve-${partner.id}`}
                  data-testid="btn-mini-calendar-reserve"
                  onClick={handleReserveQuickSlot}
                  disabled={isBooking || !selectedSlot}
                  className="flex-1 py-2 px-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow cursor-pointer disabled:opacity-60"
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Reserving...</span>
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Hold {selectedSlot} Slot</span>
                    </>
                  )}
                </button>
              ) : null}

              <button
                type="button"
                id={`btn-mini-calendar-full-form-${partner.id}`}
                data-testid="btn-mini-calendar-full-form"
                onClick={() => onRequestConsultation(partner)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>{activeDaySlots.length === 0 ? 'Join Waitlist' : 'Full Form'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
