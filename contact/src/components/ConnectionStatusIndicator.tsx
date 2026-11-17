import React, { useState, useRef, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Cloud,
  ChevronDown,
  X,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { useConnection } from '../context/ConnectionContext';
import { useLanguage } from '../context/LanguageContext';

interface ConnectionStatusIndicatorProps {
  compact?: boolean;
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  compact = false,
}) => {
  const {
    isOnline,
    isSimulated,
    pendingCount,
    lastSyncTime,
    isSyncing,
    toggleSimulation,
    resetSimulation,
    triggerManualSync,
  } = useConnection();
  const { tDict } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* Trigger Button / Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOnline ? tDict.nav.onlineStatus : tDict.nav.offlineStatus}
        className={`flex items-center gap-1.5 transition-all text-xs font-semibold rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3B82] select-none ${
          compact ? 'px-2 py-1' : 'px-2.5 py-1'
        } ${
          isOnline
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 shadow-xs'
            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-900/90 shadow-sm animate-pulse'
        }`}
      >
        {/* Status Dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          {isOnline ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
            </>
          )}
        </span>

        {/* Icon */}
        {isOnline ? (
          <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
        )}

        {/* Text Label */}
        {!compact && (
          <span className="whitespace-nowrap font-medium">
            {isOnline ? tDict.nav.onlineStatus : tDict.nav.offlineStatus}
          </span>
        )}

        {/* Pending changes badge if offline */}
        {!isOnline && pendingCount > 0 && (
          <span className="bg-amber-600 text-white rounded-full px-1 text-[10px] leading-tight font-bold">
            {pendingCount}
          </span>
        )}

        {isSimulated && (
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 hidden md:inline">
            (SIM)
          </span>
        )}

        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Flyout Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Connection Status Details"
          className="absolute right-0 mt-2 w-80 sm:w-96 p-4 rounded-xl shadow-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 z-50 text-left animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isOnline
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                }`}
              >
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {tDict.nav.offlineBadge}
                </h4>
                <div className="flex items-center gap-1.5 font-bold text-sm">
                  <span>{isOnline ? tDict.nav.onlineStatus : tDict.nav.offlineStatus}</span>
                  {isSimulated && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-[#0B3B82] dark:text-[#93C5FD]">
                      Simulated
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="py-3 space-y-3 text-xs">
            {/* Status explanation */}
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {isOnline
                ? tDict.nav.cloudSynced
                : tDict.nav.offlineNotice}
            </p>

            {/* Offline Resilience Features */}
            <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                <HardDrive className="w-3.5 h-3.5 text-[#0B3B82] dark:text-[#70C038]" />
                <span>Pan-African Offline Guarantee</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#70C038] shrink-0 mt-0.5" />
                  <span>{tDict.nav.offlineFeature1}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#70C038] shrink-0 mt-0.5" />
                  <span>{tDict.nav.offlineFeature2}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#70C038] shrink-0 mt-0.5" />
                  <span>{tDict.nav.offlineFeature3}</span>
                </li>
              </ul>
            </div>

            {/* Sync Meta */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
              <span className="flex items-center gap-1">
                <Cloud className="w-3.5 h-3.5 text-slate-400" />
                <span>Last sync: {lastSyncTime}</span>
              </span>
              <span>
                {pendingCount === 0
                  ? 'All changes queued: 0'
                  : `${pendingCount} record(s) queued for sync`}
              </span>
            </div>
          </div>

          {/* Actions Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            {/* Interactive Simulation Toggle */}
            <button
              onClick={() => {
                toggleSimulation();
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              {isOnline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>{tDict.nav.simulateOffline}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{tDict.nav.restoreOnline}</span>
                </>
              )}
            </button>

            {isSimulated ? (
              <button
                onClick={resetSimulation}
                className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline"
              >
                Reset to live
              </button>
            ) : (
              <button
                onClick={() => triggerManualSync()}
                disabled={!isOnline || isSyncing}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#0B3B82] hover:bg-[#082d64] disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Cloud'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const OfflineNoticeBanner: React.FC = () => {
  const { isOnline, pendingCount, toggleSimulation } = useConnection();
  const { tDict } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  // Re-display banner whenever connection drops to offline
  useEffect(() => {
    if (!isOnline) {
      setDismissed(false);
    }
  }, [isOnline]);

  if (isOnline || dismissed) {
    return null;
  }

  return (
    <div className="bg-amber-500 text-amber-950 dark:bg-amber-600 dark:text-amber-50 px-4 py-2 text-xs font-medium transition-all shadow-md border-b border-amber-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-950 dark:text-amber-100" />
          <span className="font-bold uppercase tracking-wider text-[11px] bg-amber-600/30 px-1.5 py-0.5 rounded">
            {tDict.nav.offlineStatus}
          </span>
          <span className="hidden sm:inline">
            {tDict.nav.offlineNotice}
          </span>
          <span className="sm:hidden">
            Local resilience active • Changes will sync upon reconnection
          </span>
          {pendingCount > 0 && (
            <span className="bg-white/90 dark:bg-slate-900/80 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
              {pendingCount} queued
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => toggleSimulation()}
            className="text-[11px] underline font-semibold hover:opacity-80 transition-opacity"
          >
            {tDict.nav.restoreOnline}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-black/10 rounded transition-colors"
            aria-label="Dismiss offline notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
