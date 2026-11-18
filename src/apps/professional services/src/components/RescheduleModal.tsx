import React, { useState, useMemo } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { BookingRecord } from '../types/booking';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: BookingRecord | null;
  onConfirmReschedule: (bookingId: string, newDate: string, newTimeSlot?: string) => void;
}

const AVAILABLE_TIME_SLOTS = [
  '09:00 AM - 11:00 AM',
  '10:00 AM - 12:00 PM',
  '11:00 AM - 01:00 PM',
  '02:00 PM - 03:30 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
];

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  booking,
  onConfirmReschedule,
}) => {
  if (!isOpen || !booking) return null;

  // Initialize selected date based on booking's current appointmentDate or tomorrow
  const initialDateObj = useMemo(() => {
    if (booking.appointmentDate) {
      const parsed = new Date(booking.appointmentDate);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d;
  }, [booking.appointmentDate]);

  const [viewYear, setViewYear] = useState<number>(() => initialDateObj.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(() => initialDateObj.getMonth()); // 0-indexed
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => booking.appointmentDate || '');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(() => booking.timeSlot || AVAILABLE_TIME_SLOTS[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Today object at midnight for comparison
  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  // Format Date object to YYYY-MM-DD in local time
  const formatDateToISO = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const todayStr = useMemo(() => formatDateToISO(today), [today]);

  // Calendar calculations for viewYear and viewMonth
  const monthName = useMemo(() => {
    return new Date(viewYear, viewMonth, 1).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  }, [viewYear, viewMonth]);

  const daysInMonth = useMemo(() => {
    return new Date(viewYear, viewMonth + 1, 0).getDate();
  }, [viewYear, viewMonth]);

  const firstDayWeekday = useMemo(() => {
    // 0 = Sunday, 1 = Monday, ...
    return new Date(viewYear, viewMonth, 1).getDay();
  }, [viewYear, viewMonth]);

  // Navigate months
  const handlePrevMonth = () => {
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const targetPrevMonthStart = new Date(viewYear, viewMonth - 1, 1);
    if (targetPrevMonthStart < currentMonthStart) {
      return; // Can't go earlier than current month
    }
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const canGoPrevMonth = useMemo(() => {
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const targetPrevMonthStart = new Date(viewYear, viewMonth - 1, 1);
    return targetPrevMonthStart >= currentMonthStart;
  }, [viewYear, viewMonth, today]);

  // Quick preset shortcuts
  const handleSelectPreset = (daysFromToday: number) => {
    const target = new Date();
    target.setDate(target.getDate() + daysFromToday);
    const dateStr = formatDateToISO(target);
    setSelectedDateStr(dateStr);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    setErrorMsg(null);
  };

  const handleSelectDay = (day: number) => {
    const clickedDate = new Date(viewYear, viewMonth, day);
    clickedDate.setHours(0, 0, 0, 0);
    if (clickedDate < today) {
      return; // Cannot pick past date
    }
    const isoStr = formatDateToISO(clickedDate);
    setSelectedDateStr(isoStr);
    setErrorMsg(null);
  };

  const handleConfirm = () => {
    if (!selectedDateStr) {
      setErrorMsg('Please select a date from the calendar.');
      return;
    }
    if (selectedDateStr === booking.appointmentDate && selectedTimeSlot === booking.timeSlot) {
      setErrorMsg('Please select a new appointment date or time slot to reschedule.');
      return;
    }
    onConfirmReschedule(booking.id, selectedDateStr, selectedTimeSlot);
    onClose();
  };

  // Human readable label for selected date
  const humanReadableSelectedDate = useMemo(() => {
    if (!selectedDateStr) return 'Not selected';
    const parts = selectedDateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
    return selectedDateStr;
  }, [selectedDateStr]);

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-4 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reschedule-modal-title"
      >
        {/* Header */}
        <div className="bg-[#102B4E] dark:bg-[#060F1A] text-white px-5 py-4 flex items-center justify-between border-b border-slate-700 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#1464C8] text-white flex items-center justify-center shrink-0">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#B7E532]">
                  Reschedule Service Date
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-300 font-mono font-bold">
                  {booking.reference}
                </span>
              </div>
              <h3 id="reschedule-modal-title" className="text-base font-black text-white leading-tight">
                Select New Appointment Date
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Informational Reassurance Banner */}
        <div className="bg-amber-50/80 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 px-5 py-2.5 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-[#B7E532] shrink-0 mt-0.5" />
          <div>
            <span className="font-extrabold">No cancellation required:</span> Your booking request with{' '}
            <strong className="text-[#102B4E] dark:text-amber-100">{booking.providerName}</strong> remains active. Selecting a new date will update your preferred consultation schedule without canceling the initial service request.
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Service & Provider Context */}
          <div className="bg-slate-50 dark:bg-[#0D1D31] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 dark:text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                Service Request
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#1464C8] dark:text-[#B7E532]">
                Status: {booking.status}
              </span>
            </div>
            <p className="font-black text-sm text-[#102B4E] dark:text-white mt-1 leading-snug">
              {booking.serviceTitle}
            </p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-slate-500 dark:text-slate-400">
              <span>Tier: <strong className="text-slate-700 dark:text-slate-200">{booking.packageName}</strong></span>
              <span>•</span>
              <span>Currently Set: <strong className="text-slate-700 dark:text-slate-200">{booking.appointmentDate}</strong> ({booking.timeSlot})</span>
            </div>
          </div>

          {/* Quick Date Presets */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Quick Shortcuts
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSelectPreset(1)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#1464C8] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-center cursor-pointer"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(3)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#1464C8] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-center cursor-pointer"
              >
                In 3 Days
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(7)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#1464C8] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-center cursor-pointer"
              >
                Next Week
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset(14)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#1464C8] text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-center cursor-pointer"
              >
                In 2 Weeks
              </button>
            </div>
          </div>

          {/* Mini-Calendar Component */}
          <div className="bg-slate-50 dark:bg-[#071322] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            {/* Calendar Header with Month & Arrows */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-black text-sm text-[#102B4E] dark:text-white flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                <span>{monthName}</span>
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  disabled={!canGoPrevMonth}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                    canGoPrevMonth 
                      ? 'hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300' 
                      : 'opacity-30 cursor-not-allowed text-slate-400'
                  }`}
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weekdays Row */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, idx) => (
                <div key={idx} className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Blank leading days */}
              {Array.from({ length: firstDayWeekday }).map((_, idx) => (
                <div key={`blank-${idx}`} className="h-9 w-full" />
              ))}

              {/* Month days */}
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dayNum = idx + 1;
                const thisDate = new Date(viewYear, viewMonth, dayNum);
                thisDate.setHours(0, 0, 0, 0);
                const isPast = thisDate < today;
                const dayIso = formatDateToISO(thisDate);
                const isSelected = selectedDateStr === dayIso;
                const isCurrentAppointment = booking.appointmentDate === dayIso;
                const isToday = dayIso === todayStr;

                return (
                  <button
                    key={`day-${dayNum}`}
                    type="button"
                    disabled={isPast}
                    onClick={() => handleSelectDay(dayNum)}
                    className={`h-9 w-full rounded-xl text-xs font-bold transition-all relative flex flex-col items-center justify-center cursor-pointer ${
                      isPast
                        ? 'opacity-25 text-slate-400 dark:text-slate-600 cursor-not-allowed bg-transparent'
                        : isSelected
                        ? 'bg-[#1464C8] dark:bg-[#1464C8] text-white shadow-md ring-2 ring-[#1464C8]/30 font-black scale-105 z-10'
                        : isCurrentAppointment
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span>{dayNum}</span>
                    {isCurrentAppointment && !isSelected && (
                      <span className="w-1 h-1 rounded-full bg-amber-500 absolute bottom-1"></span>
                    )}
                    {isToday && !isSelected && !isCurrentAppointment && (
                      <span className="w-1 h-1 rounded-full bg-[#1464C8] dark:bg-[#B7E532] absolute bottom-1"></span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Calendar Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1464C8]"></span>
                <span>Selected New Date</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                <span>Current Scheduled Date</span>
              </div>
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Preferred Consultation Time Slot</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_TIME_SLOTS.map((slot) => {
                const isSlotSelected = selectedTimeSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      isSlotSelected
                        ? 'border-[#1464C8] bg-blue-50 dark:bg-blue-950/50 text-[#1464C8] dark:text-[#B7E532] font-black'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reschedule Summary Card */}
          <div className="p-3 bg-blue-50/60 dark:bg-[#091B30] rounded-2xl border border-blue-200 dark:border-blue-900/60 text-xs">
            <div className="flex items-center justify-between font-bold text-[#102B4E] dark:text-white mb-1.5">
              <span>Appointment Schedule Comparison</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="bg-white/80 dark:bg-[#071322] p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">Original Date</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{booking.appointmentDate}</span>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">{booking.timeSlot}</span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <span className="text-emerald-700 dark:text-[#B7E532] block font-bold text-[10px] uppercase">New Target Date</span>
                <span className="font-black text-emerald-800 dark:text-emerald-200">{humanReadableSelectedDate}</span>
                <span className="text-emerald-700 dark:text-emerald-300 block text-[10px]">{selectedTimeSlot}</span>
              </div>
            </div>
          </div>

          {/* Validation / Notice message */}
          {errorMsg && (
            <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-[#07111D] px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Keep Current Date
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="px-5 py-2 bg-[#1464C8] hover:bg-[#1052a5] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Update Date</span>
          </button>
        </div>
      </div>
    </div>
  );
};
