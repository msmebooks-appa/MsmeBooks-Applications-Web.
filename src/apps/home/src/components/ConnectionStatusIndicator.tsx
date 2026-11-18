import React, { useState, useRef, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle2,
  HardDrive,
  Server,
  ShieldCheck,
  ChevronDown,
  X,
  Smartphone,
  FileText,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useConnectionStatus } from '../hooks/useConnectionStatus';

interface ConnectionStatusIndicatorProps {
  isMobile?: boolean;
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  isMobile = false,
}) => {
  const {
    isOnline,
    isRealOnline,
    isSimulatedOffline,
    isSyncing,
    justReconnected,
    lastSyncedTime,
    queuedItems,
    pendingSyncCount,
    toggleSimulatedOffline,
    forceSyncNow,
  } = useConnectionStatus();

  const [isOpen, setIsOpen] = useState(false);
  const [showBannerDismissed, setShowBannerDismissed] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // When connection state changes, un-dismiss banner so user notices
  useEffect(() => {
    setShowBannerDismissed(false);
  }, [isOnline]);

  return (
    <div className="relative inline-block" ref={popoverRef}>
      {/* TRIGGER BUTTON */}
      {isMobile ? (
        // Mobile compact trigger
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
            !isOnline
              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700 ring-2 ring-amber-400/20 animate-pulse'
              : isSyncing
              ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0866FF] dark:text-blue-400 border-blue-200 dark:border-blue-800'
              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/80 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40'
          }`}
          title={isOnline ? 'Network: Online (Cloud Synced)' : 'Network: Offline Mode Active'}
          aria-label="Connection Status"
        >
          {isSyncing ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0866FF] dark:text-blue-400" />
          ) : isOnline ? (
            <div className="relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
            </div>
          ) : (
            <div className="relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span className="absolute w-2 h-2 rounded-full bg-amber-400 animate-ping opacity-75"></span>
            </div>
          )}
          <span className="text-[11px] font-bold">
            {!isOnline ? 'Offline' : isSyncing ? 'Syncing' : 'Online'}
          </span>
        </button>
      ) : (
        // Desktop full trigger
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all border shadow-xs select-none ${
            !isOnline
              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 shadow-amber-500/10 hover:bg-amber-100/70 dark:hover:bg-amber-900/50 ring-2 ring-amber-400/20'
              : isSyncing
              ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-[#0866FF] dark:text-blue-400 shadow-blue-500/5'
              : 'bg-slate-50/90 dark:bg-slate-800/90 border-slate-200/90 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {/* Status Dot / Icon */}
          <div className="flex items-center gap-1.5">
            {isSyncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0866FF] dark:text-blue-400" />
            ) : isOnline ? (
              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="absolute w-3 h-3 rounded-full bg-emerald-400/40 animate-ping"></span>
              </div>
            ) : (
              <div className="relative flex items-center justify-center w-2.5 h-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span className="absolute w-3 h-3 rounded-full bg-amber-400/60 animate-ping"></span>
              </div>
            )}

            {!isOnline ? (
              <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            ) : (
              <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
          </div>

          {/* Status Text */}
          <div className="flex items-center gap-1.5">
            <span className={!isOnline ? 'font-black text-amber-900 dark:text-amber-300' : 'font-bold text-slate-800 dark:text-slate-100'}>
              {!isOnline ? 'Offline Mode' : isSyncing ? 'Syncing...' : 'Online'}
            </span>

            {!isOnline && (
              <span className="px-1.5 py-0.2 rounded-md bg-amber-200/80 dark:bg-amber-800/80 text-amber-900 dark:text-amber-100 text-[10px] font-black uppercase tracking-wider">
                {pendingSyncCount} Queued
              </span>
            )}
          </div>

          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}

      {/* POPOVER TELEMETRY MODAL / CARD */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[380px] bg-white dark:bg-[#0E172A] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900 dark:text-slate-100">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    !isOnline
                      ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-700'
                      : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      !isOnline ? 'bg-amber-600 dark:bg-amber-400' : 'bg-emerald-600 dark:bg-emerald-400'
                    }`}
                  />
                  {!isOnline ? 'Operating in Offline Mode' : 'Cloud Sync Connected'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {!isOnline
                  ? 'All records writing to Local Device Cache'
                  : 'Connected to West Africa Edge Node (Lagos LOS-1)'}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close telemetry"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pan-African Resilience Value Prop Box */}
          <div className="my-3.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
              <Zap className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000]" />
              <span>Offline-First African Architecture</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              Internet drops or power fluctuations won't halt your business. Record POS sales, issue invoices, and manage stock uninterrupted. Transactions queue locally and auto-sync the millisecond you reconnect.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <HardDrive className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Local DB: <strong>Active</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Zero Data Loss</span>
              </div>
            </div>
          </div>

          {/* Pending Sync Queue Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                <span>Local Sync Queue</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  !isOnline
                    ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200'
                    : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                }`}
              >
                {!isOnline ? `${queuedItems.length} awaiting sync` : 'All Synced'}
              </span>
            </div>

            {!isOnline ? (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {queuedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-[11px] flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.type === 'sale' ? (
                        <Smartphone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <span className="font-semibold text-slate-900 dark:text-slate-100 block truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">
                          {item.timestamp} • Stored in device IndexedDB
                        </span>
                      </div>
                    </div>
                    {item.amount && (
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100 shrink-0 text-[10px]">
                        {item.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center gap-2 text-xs text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold text-[11px]">All devices and branches in sync</span>
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-300">Last verified: {lastSyncedTime}</p>
                </div>
              </div>
            )}
          </div>

          {/* Interactive Simulation Switch (for live demo testing!) */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/70 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  Simulate Offline Mode
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Toggle to test app resilience without turning off WiFi
                </span>
              </div>
              <button
                type="button"
                onClick={toggleSimulatedOffline}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                  isSimulatedOffline ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label="Toggle Simulated Offline Mode"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    isSimulatedOffline ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Action buttons */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  forceSyncNow();
                }}
                disabled={isSyncing}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-60"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`}
                />
                <span>{isSyncing ? 'Syncing to Cloud...' : 'Force Sync Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Global Floating Offline Alert Banner
export const OfflineGlobalBanner: React.FC = () => {
  const {
    isOnline,
    justReconnected,
    isSyncing,
    pendingSyncCount,
    setOfflineMode,
    forceSyncNow,
  } = useConnectionStatus();

  const [dismissed, setDismissed] = useState(false);

  // If back online, show a brief success toast
  if (justReconnected) {
    return (
      <div className="fixed top-18 left-1/2 -translate-x-1/2 z-40 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="px-4 py-2.5 rounded-full bg-emerald-900 dark:bg-emerald-950 text-white shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-emerald-700 dark:border-emerald-600">
          <CheckCircle2 className="w-4 h-4 text-[#B7F000]" />
          <span>Connection restored! All offline transactions synchronized to the cloud.</span>
        </div>
      </div>
    );
  }

  if (isOnline || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-amber-500 text-slate-950 px-4 py-2 shadow-md border-b border-amber-600 animate-in slide-in-from-top duration-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 font-medium">
          <span className="p-1 rounded-md bg-amber-600/30 text-slate-950">
            <WifiOff className="w-4 h-4" />
          </span>
          <span>
            <strong>Offline Mode Active:</strong> You are disconnected from the internet. POS checkout, receipts, and draft invoices are saving to local memory and will automatically sync once online.
          </span>
          <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-slate-950 text-white text-[10px] font-bold">
            {pendingSyncCount} operations queued
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setOfflineMode(false);
              forceSyncNow();
            }}
            className="px-2.5 py-1 rounded-lg bg-slate-950 text-white text-[11px] font-bold hover:bg-slate-800 transition-colors flex items-center gap-1"
          >
            <span>Reconnect / Sync</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-950/70 hover:text-slate-950 rounded hover:bg-amber-600/20 transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
