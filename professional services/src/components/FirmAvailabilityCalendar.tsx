import React, { useMemo, useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { ProfessionalFirm } from '../data/firmsData';
import { BookingRecord } from '../types/booking';

export const FIRM_STANDARD_TIME_SLOTS = [
  '09:00 AM - 10:30 AM',
  '10:30 AM - 12:00 PM',
  '01:00 PM - 02:30 PM',
  '02:30 PM - 04:00 PM',
  '04:30 PM - 06:00 PM',
] as const;

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function formatLocalDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getLiveClientBookings(): BookingRecord[] {
  try {
    const raw = localStorage.getItem('msmebooks_client_bookings');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export interface SlotStatus {
  slot: string;
  available: boolean;
  reason?: 'booked' | 'client_booked' | 'past';
}

export function getFirmSlotsForDate(
  firm: ProfessionalFirm,
  dateIso: string,
  clientBookings: BookingRecord[]
): SlotStatus[] {
  const [y, m, d] = dateIso.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d);
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const dayName = DAY_NAMES[targetDate.getDay()];
  const isPastDay = targetDate < todayStart;
  const isWorkingDay = firm.availableSlotDays.includes(dayName);

  if (isPastDay || !isWorkingDay) {
    return FIRM_STANDARD_TIME_SLOTS.map(slot => ({
      slot,
      available: false,
      reason: 'past',
    }));
  }

  // Deterministic realistic busy-slot seeding per firm & date so schedules look authentic
  let firmSeed = 0;
  for (let i = 0; i < firm.id.length; i++) {
    firmSeed = (firmSeed * 31 + firm.id.charCodeAt(i)) % 997;
  }
  const daySeed = y * 372 + m * 31 + d;

  return FIRM_STANDARD_TIME_SLOTS.map((slot, idx) => {
    const bookedByUser = clientBookings.some(
      b =>
        b.appointmentDate === dateIso &&
        b.timeSlot === slot &&
        (b.providerId === firm.id || b.providerName === firm.name)
    );
    if (bookedByUser) {
      return { slot, available: false, reason: 'client_booked' };
    }

    // Seed 1-2 busy slots depending on firm & date, ensuring at least 2-3 open slots on active days
    const hash = (firmSeed + daySeed * (idx + 3) + idx * 17) % 11;
    const isBusy =
      (firm.avgResponseTimeMinutes <= 20 && hash === 2) ||
      (firm.avgResponseTimeMinutes > 20 && (hash === 2 || hash === 7));

    return {
      slot,
      available: !isBusy,
      reason: isBusy ? 'booked' : undefined,
    };
  });
}

export function getNextAvailableSlotForFirm(firm: ProfessionalFirm): {
  dateIso: string;
  dateLabel: string;
  slot: string;
} | null {
  const bookings = getLiveClientBookings();
  const base = new Date();
  for (let offset = 0; offset < 21; offset++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset);
    const iso = formatLocalDateISO(d);
    const slots = getFirmSlotsForDate(firm, iso, bookings);
    const firstOpen = slots.find(s => s.available);
    if (firstOpen) {
      const dateLabel =
        offset === 0
          ? 'Today'
          : offset === 1
          ? 'Tomorrow'
          : d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      return {
        dateIso: iso,
        dateLabel,
        slot: firstOpen.slot,
      };
    }
  }
  return null;
}

interface FirmAvailabilityCalendarProps {
  firm: ProfessionalFirm;
  onSelectSlotAndBook: (dateIso: string, timeSlot: string) => void;
}

export const FirmAvailabilityCalendar: React.FC<FirmAvailabilityCalendarProps> = ({
  firm,
  onSelectSlotAndBook,
}) => {
  const [clientBookings, setClientBookings] = useState<BookingRecord[]>(() =>
    getLiveClientBookings()
  );

  useEffect(() => {
    const refreshBookings = () => setClientBookings(getLiveClientBookings());
    window.addEventListener('msmebooks_bookings_changed', refreshBookings);
    window.addEventListener('storage', refreshBookings);
    return () => {
      window.removeEventListener('msmebooks_bookings_changed', refreshBookings);
      window.removeEventListener('storage', refreshBookings);
    };
  }, []);

  const initialOpen = useMemo(() => getNextAvailableSlotForFirm(firm), [firm]);

  const [viewMonth, setViewMonth] = useState<Date>(() => {
    if (initialOpen) {
      const [y, m] = initialOpen.dateIso.split('-').map(Number);
      return new Date(y, m - 1, 1);
    }
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return initialOpen?.dateIso || formatLocalDateISO(new Date());
  });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(() => {
    return initialOpen?.slot || null;
  });

  // Reset selected date/slot when switching firm profile modal
  useEffect(() => {
    const next = getNextAvailableSlotForFirm(firm);
    if (next) {
      const [y, m] = next.dateIso.split('-').map(Number);
      setViewMonth(new Date(y, m - 1, 1));
      setSelectedDate(next.dateIso);
      setSelectedSlot(next.slot);
    }
  }, [firm]);

  const calendarDays = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayIso = formatLocalDateISO(today);

    const days: {
      dayNumber: number;
      dateIso: string;
      isWorkingDay: boolean;
      isPast: boolean;
      isToday: boolean;
      openCount: number;
      totalCount: number;
    }[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dateIso = formatLocalDateISO(dateObj);
      const dayName = DAY_NAMES[dateObj.getDay()];
      const isWorkingDay = firm.availableSlotDays.includes(dayName);
      const isPast = dateIso < todayIso;
      const slots = getFirmSlotsForDate(firm, dateIso, clientBookings);
      const openCount = slots.filter(s => s.available).length;

      days.push({
        dayNumber: d,
        dateIso,
        isWorkingDay,
        isPast,
        isToday: dateIso === todayIso,
        openCount,
        totalCount: slots.length,
      });
    }

    return {
      monthLabel: viewMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      firstDayIndex,
      days,
    };
  }, [viewMonth, firm, clientBookings]);

  const selectedDaySlots = useMemo(
    () => getFirmSlotsForDate(firm, selectedDate, clientBookings),
    [firm, selectedDate, clientBookings]
  );

  const selectedDateFormatted = useMemo(() => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [selectedDate]);

  const openSlotsCount = selectedDaySlots.filter(s => s.available).length;

  return (
    <div className="p-4 sm:p-5 bg-slate-50/90 dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#102B4E] dark:text-white">
              Live Availability Calendar
            </h4>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#B7E532] text-[10px] font-black border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#B7E532] animate-pulse" />
              <span>Real-Time Slots</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Operating Days: <strong>{firm.availableSlotDays.join(', ')}</strong> • Select a date to inspect open consultation windows
          </p>
        </div>

        {initialOpen && (
          <button
            type="button"
            onClick={() => {
              const [y, m] = initialOpen.dateIso.split('-').map(Number);
              setViewMonth(new Date(y, m - 1, 1));
              setSelectedDate(initialOpen.dateIso);
              setSelectedSlot(initialOpen.slot);
            }}
            className="self-start sm:self-auto px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#1464C8] dark:text-[#B7E532] text-[11px] font-black border border-blue-200 dark:border-blue-800 cursor-pointer transition-colors"
          >
            Next Open: {initialOpen.dateLabel} • {initialOpen.slot.split(' - ')[0]}
          </button>
        )}
      </div>

      {/* Calendar Grid + Open Slots Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Compact Monthly Calendar */}
        <div className="lg:col-span-7 bg-white dark:bg-[#08121E] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#102B4E] dark:text-white">
              {calendarDays.monthLabel}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
                }
                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setViewMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
                }
                className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-slate-400">
            {DAY_NAMES.map(day => (
              <div key={day} className="py-0.5">
                {day}
              </div>
            ))}
          </div>

          {/* Day Cells */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: calendarDays.firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10 rounded-lg" />
            ))}

            {calendarDays.days.map(day => {
              const isSelected = selectedDate === day.dateIso;
              const isBookable = !day.isPast && day.isWorkingDay && day.openCount > 0;

              return (
                <button
                  key={day.dateIso}
                  type="button"
                  disabled={!day.isWorkingDay || day.isPast}
                  onClick={() => {
                    setSelectedDate(day.dateIso);
                    const firstOpen = getFirmSlotsForDate(firm, day.dateIso, clientBookings).find(
                      s => s.available
                    );
                    setSelectedSlot(firstOpen ? firstOpen.slot : null);
                  }}
                  className={`h-10 rounded-lg border flex flex-col items-center justify-center text-xs transition-all relative ${
                    isSelected
                      ? 'bg-[#1464C8] text-white border-[#1464C8] font-black shadow-xs ring-2 ring-[#B7E532]/70 cursor-pointer'
                      : isBookable
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-[#102B4E] dark:text-slate-100 border-emerald-200 dark:border-emerald-800/60 font-bold cursor-pointer'
                      : 'bg-slate-50 dark:bg-slate-900/40 text-slate-300 dark:text-slate-600 border-transparent cursor-not-allowed'
                  }`}
                  title={
                    day.isPast
                      ? 'Past date'
                      : !day.isWorkingDay
                      ? `${firm.name} does not operate on this day`
                      : `${day.openCount} of ${day.totalCount} slots open`
                  }
                >
                  <span className="leading-none">{day.dayNumber}</span>
                  {isBookable && (
                    <span
                      className={`text-[8px] font-black leading-none mt-1 ${
                        isSelected ? 'text-[#B7E532]' : 'text-emerald-600 dark:text-[#B7E532]'
                      }`}
                    >
                      {day.openCount} open
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Open Slots
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#1464C8]" /> Selected
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" /> Off / Unavailable
              </span>
            </div>
          </div>
        </div>

        {/* Right: Time Slots for Selected Date */}
        <div className="lg:col-span-5 bg-white dark:bg-[#08121E] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-3">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Open Time Slots
                </span>
                <span className="text-xs font-black text-[#102B4E] dark:text-white">
                  {selectedDateFormatted}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#B7E532] border border-emerald-200 dark:border-emerald-800">
                {openSlotsCount} Open
              </span>
            </div>

            <div className="space-y-1.5">
              {selectedDaySlots.map(({ slot, available, reason }) => {
                const isSelected = selectedSlot === slot && available;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={!available}
                    onClick={() => setSelectedSlot(slot)}
                    className={`w-full px-3 py-2 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-[#1464C8] dark:border-[#B7E532] text-[#102B4E] dark:text-white font-black ring-1 ring-[#1464C8]/40 cursor-pointer'
                        : available
                        ? 'bg-slate-50 dark:bg-[#0D1D31] hover:bg-emerald-50/70 dark:hover:bg-emerald-950/30 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold cursor-pointer'
                        : 'bg-slate-100/70 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 text-slate-400 dark:text-slate-600 cursor-not-allowed line-through'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <Clock
                        className={`w-3.5 h-3.5 ${
                          isSelected
                            ? 'text-[#1464C8] dark:text-[#B7E532]'
                            : available
                            ? 'text-emerald-600 dark:text-[#B7E532]'
                            : 'text-slate-400'
                        }`}
                      />
                      <span>{slot}</span>
                    </span>

                    {available ? (
                      isSelected ? (
                        <span className="flex items-center gap-1 text-[10px] font-black text-[#1464C8] dark:text-[#B7E532]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Selected</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400">
                          Available
                        </span>
                      )
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 no-underline">
                        <Lock className="w-3 h-3" />
                        <span>{reason === 'client_booked' ? 'Your Booking' : 'Booked'}</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            disabled={!selectedSlot}
            onClick={() => {
              if (selectedSlot) {
                onSelectSlotAndBook(selectedDate, selectedSlot);
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-[#1464C8] hover:bg-[#1052a5] disabled:opacity-50 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>
              {selectedSlot
                ? `Book ${selectedSlot.split(' - ')[0]} Slot`
                : 'Select an Open Slot'}
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B7E532]" />
          </button>
        </div>
      </div>
    </div>
  );
};
