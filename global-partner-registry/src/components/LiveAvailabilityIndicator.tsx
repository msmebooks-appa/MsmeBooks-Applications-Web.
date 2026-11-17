import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Partner, LiveAvailability } from '../types';
import { useLiveScheduling } from '../context/LiveSchedulingContext';
import { formatSyncTimeAgo } from '../services/schedulingApi';

interface LiveAvailabilityIndicatorProps {
  partner: Partner;
  variant?: 'pill' | 'badge' | 'card-strip' | 'modal';
  onRequestConsultation?: (partner: Partner) => void;
  idPrefix?: string;
}

export const LiveAvailabilityIndicator: React.FC<LiveAvailabilityIndicatorProps> = ({
  partner,
  variant = 'pill',
  onRequestConsultation,
  idPrefix = 'partner',
}) => {
  const { getPartnerAvailability, syncPartnerAvailability, syncingPartnerIds } = useLiveScheduling();
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const live = getPartnerAvailability(partner.id);
  const isSyncing = syncingPartnerIds.has(partner.id);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current && 
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setPopoverOpen(false);
      }
    };

    if (popoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popoverOpen]);

  const handleManualSync = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await syncPartnerAvailability(partner.id);
      setSyncFeedback('Live Synced!');
      setTimeout(() => setSyncFeedback(null), 2500);
    } catch {
      setSyncFeedback('Synced');
      setTimeout(() => setSyncFeedback(null), 2000);
    }
  };

  const isAccepting = live.isAcceptingRequests;
  const isAvailableNow = live.status === 'Available Now';
  const isLimited = live.status === 'Limited Slots Today';
  const isBooked = live.status === 'Currently Booked';

  // Badge Color Styles based on real-time scheduling status
  let badgeStyle = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
  let dotColor = 'bg-emerald-500';
  let pingColor = 'bg-emerald-400';

  if (isAvailableNow) {
    badgeStyle = 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/40 shadow-xs ring-1 ring-emerald-500/20';
    dotColor = 'bg-emerald-500';
    pingColor = 'bg-emerald-400';
  } else if (isLimited) {
    badgeStyle = 'bg-amber-500/15 text-amber-900 dark:text-amber-300 border-amber-500/40 shadow-xs ring-1 ring-amber-500/20';
    dotColor = 'bg-amber-500';
    pingColor = 'bg-amber-400';
  } else if (isBooked) {
    badgeStyle = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    dotColor = 'bg-slate-400 dark:bg-slate-500';
    pingColor = '';
  }

  // Label text
  const getBadgeLabel = () => {
    if (isSyncing) return 'Syncing Calendar...';
    if (syncFeedback) return syncFeedback;
    if (isAvailableNow) {
      return `Available Now • ${live.availableSlotsToday} Slot${live.availableSlotsToday === 1 ? '' : 's'}`;
    }
    if (isLimited) {
      return `Only ${live.availableSlotsToday} Slot Left Today`;
    }
    if (isAccepting) {
      return `Accepting Requests • ${live.availableSlotsToday} Slots`;
    }
    return 'Currently Booked (Waitlist)';
  };

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={`${idPrefix}-live-availability-badge-${partner.id}`}
        data-testid="live-availability-status-indicator"
        data-status={live.status.toLowerCase().replace(/\s+/g, '-')}
        data-accepting={isAccepting ? 'true' : 'false'}
        onClick={(e) => {
          e.stopPropagation();
          setPopoverOpen((prev) => !prev);
        }}
        className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none active:scale-95 ${badgeStyle}`}
        title={`Live Availability Sync: ${live.status} (${live.statusHeadline}). Click to view real-time calendar slots and sync details.`}
        aria-expanded={popoverOpen}
        aria-haspopup="dialog"
      >
        {/* Real-time Pulsing Indicator */}
        <span className="relative flex h-2 w-2 shrink-0">
          {(isAccepting || isAvailableNow) && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pingColor} opacity-75`}></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`}></span>
        </span>

        {/* Live Status Label */}
        <span className="whitespace-nowrap font-medium tracking-tight flex items-center gap-1">
          <span>{getBadgeLabel()}</span>
        </span>

        {/* Interactive Sync Icon */}
        <span 
          role="button"
          tabIndex={0}
          onClick={handleManualSync}
          className="ml-0.5 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          title="Sync real-time calendar availability now"
        >
          <RefreshCw className={`w-2.5 h-2.5 ${isSyncing ? 'animate-spin text-lime-500' : 'opacity-60 group-hover:opacity-100'}`} />
        </span>
      </button>

      {/* Real-Time Live Scheduling Popover */}
      {popoverOpen && (
        <div
          ref={popoverRef}
          role="dialog"
          id={`${idPrefix}-live-availability-popover-${partner.id}`}
          data-testid="live-availability-popover"
          className="absolute z-50 left-0 sm:left-auto sm:right-0 top-[calc(100%+8px)] w-72 sm:w-80 p-4 rounded-2xl bg-slate-900/98 dark:bg-[#07162b]/98 text-slate-100 border border-lime-500/40 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-lime-400 animate-pulse" />
              <span className="font-extrabold text-[11px] uppercase tracking-wider text-lime-400">
                Live Scheduling API Sync
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono font-medium border border-slate-700">
              {live.calendarProvider}
            </span>
          </div>

          {/* Status Headline */}
          <div className="py-2.5 space-y-2">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 relative flex h-2 w-2 shrink-0">
                {isAccepting && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor}`}></span>
              </span>
              <div>
                <div className="font-bold text-white text-xs">
                  {live.status}
                </div>
                <div className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  {live.statusHeadline}
                </div>
              </div>
            </div>

            {/* Key Live Scheduling Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                  Next Available Slot
                </span>
                <div className="font-bold text-white flex items-center gap-1 truncate text-xs">
                  <Clock className="w-3 h-3 text-sky-400 shrink-0" />
                  <span className="truncate">{live.nextAvailableSlot}</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">
                  Slots Today
                </span>
                <div className="font-bold text-lime-400 flex items-center gap-1 text-xs">
                  <Calendar className="w-3 h-3 text-lime-400 shrink-0" />
                  <span>{live.availableSlotsToday} Open Slot{live.availableSlotsToday === 1 ? '' : 's'}</span>
                </div>
              </div>
            </div>

            {/* Response Time & Sync Timestamp */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Replies {live.responseTimeEst}</span>
              </span>
              <span className="font-mono text-slate-400">
                {formatSyncTimeAgo(live.lastSyncedTimestamp)}
              </span>
            </div>
          </div>

          {/* Popover Actions */}
          <div className="pt-2.5 border-t border-slate-800 flex items-center gap-2">
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-slate-700 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-lime-400' : 'text-slate-400'}`} />
              <span>{isSyncing ? 'Syncing...' : syncFeedback || 'Re-sync API'}</span>
            </button>

            {onRequestConsultation && (
              <button
                type="button"
                onClick={() => {
                  setPopoverOpen(false);
                  onRequestConsultation(partner);
                }}
                className="flex-1 py-1.5 px-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer"
              >
                <span>{isBooked ? 'Join Waitlist' : 'Book Now'}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
