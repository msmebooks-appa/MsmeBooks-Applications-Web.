import React, { useState, useRef, useEffect } from 'react';
import { Calendar, Download, ExternalLink, Check, ChevronDown } from 'lucide-react';
import { BookingRecord } from '../types/booking';
import { downloadICSFile, getGoogleCalendarUrl, getOutlookCalendarUrl } from '../utils/calendarSync';

export interface CalendarSyncButtonProps {
  booking: BookingRecord;
  className?: string;
  variant?: 'button' | 'dropdown' | 'split';
  label?: string;
  highlightConfirmed?: boolean;
  onExportSuccess?: (message: string) => void;
}

export const CalendarSyncButton: React.FC<CalendarSyncButtonProps> = ({
  booking,
  className = '',
  variant = 'dropdown',
  label = 'Export to Calendar',
  highlightConfirmed = false,
  onExportSuccess,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDownloadICS = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    downloadICSFile(booking);
    setSyncedSuccess(true);
    const msg = `📅 Calendar event exported! "${booking.serviceTitle}" .ics file downloaded for Google & Outlook integration.`;
    onExportSuccess?.(msg);
    setTimeout(() => setSyncedSuccess(false), 3500);
    setIsOpen(false);
  };

  const handleOpenGoogle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const url = getGoogleCalendarUrl(booking);
    window.open(url, '_blank', 'noopener,noreferrer');
    setSyncedSuccess(true);
    const msg = `🌐 Google Calendar opened! Save event to sync "${booking.serviceTitle}".`;
    onExportSuccess?.(msg);
    setTimeout(() => setSyncedSuccess(false), 3500);
    setIsOpen(false);
  };

  const handleOpenOutlook = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const url = getOutlookCalendarUrl(booking);
    window.open(url, '_blank', 'noopener,noreferrer');
    setSyncedSuccess(true);
    const msg = `📧 Outlook Calendar opened! Save event to sync "${booking.serviceTitle}".`;
    onExportSuccess?.(msg);
    setTimeout(() => setSyncedSuccess(false), 3500);
    setIsOpen(false);
  };

  const isConfirmed = highlightConfirmed || booking.status === 'Confirmed';

  // If pure button variant: 1-click download .ics
  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleDownloadICS}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs ${
          syncedSuccess
            ? 'bg-emerald-600 text-white'
            : isConfirmed
            ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
            : 'bg-white dark:bg-[#0D1D31] text-[#102B4E] dark:text-slate-100 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
        } ${className}`}
        title="Download .ics calendar event file for Google Calendar, Outlook, or Apple Calendar"
      >
        {syncedSuccess ? (
          <Check className="w-3.5 h-3.5 text-white" />
        ) : (
          <Calendar className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
        )}
        <span>{syncedSuccess ? 'Exported (.ics)!' : label}</span>
        <span className="text-[10px] font-black px-1 rounded bg-black/10 dark:bg-white/10">.ICS</span>
      </button>
    );
  }

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div className="inline-flex rounded-lg shadow-xs">
        {/* Main Export to Calendar Button: 1-click .ics download */}
        <button
          type="button"
          onClick={handleDownloadICS}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-l-lg transition-all cursor-pointer border ${
            syncedSuccess
              ? 'bg-emerald-600 text-white border-emerald-600'
              : isConfirmed
              ? 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/70 ring-1 ring-emerald-300/40'
              : 'bg-white dark:bg-[#0D1D31] text-[#102B4E] dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#132842]'
          }`}
          title="Click to generate and download .ics calendar file for Google Calendar or Outlook"
        >
          {syncedSuccess ? (
            <Check className="w-3.5 h-3.5 text-white" />
          ) : (
            <Calendar className={`w-3.5 h-3.5 ${isConfirmed ? 'text-emerald-600 dark:text-[#B7E532]' : 'text-[#1464C8] dark:text-[#B7E532]'}`} />
          )}
          <span>{syncedSuccess ? 'Exported (.ics)!' : label}</span>
          <span className={`text-[10px] font-black px-1 rounded ${
            isConfirmed ? 'bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}>
            .ICS
          </span>
        </button>

        {/* Dropdown toggle for Google / Outlook Web deep links */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`px-2 py-1.5 text-xs font-bold rounded-r-lg border-y border-r transition-all cursor-pointer flex items-center justify-center ${
            syncedSuccess
              ? 'bg-emerald-700 text-white border-emerald-600'
              : isConfirmed
              ? 'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/60 dark:hover:bg-emerald-900/90 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/70'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
          title="Choose calendar format: .ics download, Google Calendar, or Outlook"
          aria-label="Calendar integration options"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-[#0A1727] rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
              Export Appointment to Calendar
            </span>
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {booking.serviceTitle} ({booking.appointmentDate})
            </span>
          </div>

          {/* Option 1: Download .ics File (Primary) */}
          <button
            type="button"
            onClick={handleDownloadICS}
            className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-[#B7E532] flex items-center justify-center shrink-0">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-[#B7E532]">
                  Download .ics File
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Import into Google, Outlook, or Apple
                </div>
              </div>
            </div>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-mono">
              .ICS
            </span>
          </button>

          {/* Option 2: Add to Google Calendar Online */}
          <button
            type="button"
            onClick={handleOpenGoogle}
            className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600">
                  Google Calendar
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Add directly online in browser
                </div>
              </div>
            </div>
            <span className="text-[10px] text-blue-600 font-bold">1-Click</span>
          </button>

          {/* Option 3: Add to Outlook / Office 365 Online */}
          <button
            type="button"
            onClick={handleOpenOutlook}
            className="w-full text-left px-3.5 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-sky-600">
                  Outlook Calendar
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">
                  Office 365 & Outlook.com
                </div>
              </div>
            </div>
            <span className="text-[10px] text-sky-600 font-bold">1-Click</span>
          </button>

          <div className="px-3.5 pt-2 mt-1 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Includes 1-hour pre-consultation reminder alert</span>
          </div>
        </div>
      )}
    </div>
  );
};
