import React, { useState, useRef, useEffect } from 'react';
import {
  CalendarDays,
  CalendarPlus,
  Download,
  ExternalLink,
  ChevronDown,
  Check,
} from 'lucide-react';
import {
  CalendarInterviewEvent,
  generateIcsContent,
  downloadIcsFile,
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  getOffice365CalendarUrl,
} from '../utils/calendarUtils';

interface AddToCalendarButtonProps {
  event: CalendarInterviewEvent;
  className?: string;
  variant?: 'primary' | 'secondary' | 'compact' | 'outline';
  label?: string;
}

export const AddToCalendarButton: React.FC<AddToCalendarButtonProps> = ({
  event,
  className = '',
  variant = 'primary',
  label = 'Add to Calendar',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleDownloadIcs = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const ics = generateIcsContent(event);
      const safeName = `${event.candidateName.replace(/\s+/g, '_')}_${event.jobTitle.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const filename = `Interview_${safeName}.ics`;
      downloadIcsFile(filename, ics);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
      setIsOpen(false);
    } catch (err) {
      console.error('Failed to generate .ics file', err);
    }
  };

  const handleOpenGoogle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getGoogleCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleOpenOutlook = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getOutlookCalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleOpenOffice365 = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getOffice365CalendarUrl(event);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  // Base styling depending on variant
  const getButtonStyles = () => {
    switch (variant) {
      case 'compact':
        return 'px-2.5 py-1.5 text-xs font-semibold bg-white dark:bg-[#131D35] hover:bg-blue-50 dark:hover:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-800 rounded-lg shadow-2xs transition-colors';
      case 'secondary':
        return 'px-3.5 py-2 text-xs font-bold bg-white dark:bg-[#15223E] hover:bg-slate-50 dark:hover:bg-[#1B2C50] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xs transition-all';
      case 'outline':
        return 'px-3.5 py-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 rounded-xl transition-all shadow-2xs';
      case 'primary':
      default:
        return 'px-4 py-2 text-xs font-bold bg-gradient-to-r from-[#0066CC] to-[#0052A3] hover:from-[#0052A3] hover:to-[#004080] text-white rounded-xl shadow-sm hover:shadow transition-all';
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={menuRef}>
      <div className="inline-flex rounded-xl shadow-2xs">
        {/* Main Action: Click directly downloads .ics */}
        <button
          type="button"
          onClick={handleDownloadIcs}
          className={`flex items-center gap-1.5 cursor-pointer ${getButtonStyles()} ${
            variant !== 'compact' ? 'rounded-r-none' : ''
          }`}
          title="Download .ics calendar invitation file"
        >
          {downloadSuccess ? (
            <Check className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in" />
          ) : (
            <CalendarPlus className="w-3.5 h-3.5" />
          )}
          <span>{downloadSuccess ? '.ics Downloaded' : label}</span>
        </button>

        {/* Dropdown Toggle: Click opens calendar provider list */}
        {variant !== 'compact' && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className={`px-2 flex items-center justify-center border-l cursor-pointer ${
              variant === 'primary'
                ? 'bg-[#0052A3] hover:bg-[#004080] text-white border-blue-400/30 rounded-r-xl'
                : variant === 'outline'
                ? 'bg-emerald-100/60 dark:bg-emerald-900/40 hover:bg-emerald-200/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 rounded-r-xl'
                : 'bg-slate-50 dark:bg-[#1A2C50] hover:bg-slate-100 dark:hover:bg-[#203460] text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 rounded-r-xl'
            }`}
            aria-label="Calendar options"
            aria-expanded={isOpen}
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-60 rounded-xl bg-white dark:bg-[#131D35] border border-slate-200 dark:border-slate-700/80 shadow-xl z-50 py-1.5 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <CalendarDays className="w-3.5 h-3.5 text-[#0066CC] dark:text-[#38BDF8]" />
            <span>Import to Calendar</span>
          </div>

          {/* Download .ics */}
          <button
            type="button"
            onClick={handleDownloadIcs}
            className="w-full px-3 py-2 text-left hover:bg-blue-50/70 dark:hover:bg-[#1A284A] text-slate-800 dark:text-slate-100 flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8] group-hover:scale-110 transition-transform" />
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Download iCalendar (.ics)</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Apple Calendar, Outlook Desktop, Mobile</div>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-[#0066CC] dark:text-[#38BDF8]">
              ICS
            </span>
          </button>

          {/* Google Calendar */}
          <button
            type="button"
            onClick={handleOpenGoogle}
            className="w-full px-3 py-2 text-left hover:bg-blue-50/70 dark:hover:bg-[#1A284A] text-slate-800 dark:text-slate-100 flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-blue-500 text-white font-bold flex items-center justify-center text-[10px]">
                G
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Google Calendar</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Open in browser tab</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8]" />
          </button>

          {/* Outlook.com */}
          <button
            type="button"
            onClick={handleOpenOutlook}
            className="w-full px-3 py-2 text-left hover:bg-blue-50/70 dark:hover:bg-[#1A284A] text-slate-800 dark:text-slate-100 flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-sky-600 text-white font-bold flex items-center justify-center text-[10px]">
                O
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Outlook.com Web</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Personal Microsoft Calendar</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8]" />
          </button>

          {/* Office 365 */}
          <button
            type="button"
            onClick={handleOpenOffice365}
            className="w-full px-3 py-2 text-left hover:bg-blue-50/70 dark:hover:bg-[#1A284A] text-slate-800 dark:text-slate-100 flex items-center justify-between group transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-sm bg-orange-600 text-white font-bold flex items-center justify-center text-[10px]">
                365
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white">Microsoft 365 Work</div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Corporate work calendar</div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0066CC] dark:group-hover:text-[#38BDF8]" />
          </button>
        </div>
      )}
    </div>
  );
};
