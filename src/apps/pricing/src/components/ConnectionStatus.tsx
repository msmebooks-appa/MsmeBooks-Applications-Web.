import React, { useState, useRef, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  ShieldCheck,
  Database,
  Server,
  ChevronDown,
  X,
  CheckCircle2,
  CloudUpload,
} from 'lucide-react';
import { useConnection } from '../context/ConnectionContext';

interface ConnectionStatusProps {
  className?: string;
  compactOnMobile?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  className = '',
  compactOnMobile = false,
}) => {
  const {
    isOnline,
    isSimulatedOffline,
    isSyncing,
    syncStatus,
    syncCount,
    queuedItems,
    lastSyncedTime,
    syncFeedbackMessage,
    toggleSimulation,
    triggerManualSync,
    clearSyncFeedback,
  } = useConnection();

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsPopoverOpen(false);
      }
    };

    if (isPopoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPopoverOpen]);

  const statusToneClasses =
    syncStatus === 'offline'
      ? 'bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
      : syncStatus === 'pending_sync'
      ? 'bg-blue-50 dark:bg-blue-950/80 text-[#0A4FD5] dark:text-blue-200 border-blue-300 dark:border-blue-700'
      : syncStatus === 'syncing'
      ? 'bg-blue-50 dark:bg-blue-950/70 text-[#0A4FD5] dark:text-blue-300 border-blue-200 dark:border-blue-800'
      : 'bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/80';

  return (
    <div className={`relative inline-flex items-center ${className}`} ref={popoverRef}>
      {/* Segmented Sync Status Control in Header */}
      <div
        role="group"
        aria-label="Sync Status"
        className={`inline-flex items-center rounded-lg border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 overflow-hidden ${statusToneClasses}`}
      >
        {/* Status & Details Popover Trigger */}
        <button
          type="button"
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          aria-expanded={isPopoverOpen}
          aria-label={`Sync Status: ${
            syncStatus === 'offline'
              ? `Offline mode, ${syncCount} queued`
              : syncStatus === 'pending_sync'
              ? `Back online, ${syncCount} items pending sync`
              : syncStatus === 'syncing'
              ? 'Syncing data'
              : 'Synced'
          }`}
          title={
            syncStatus === 'offline'
              ? 'Sync Status: Running in Offline Mode. Click to inspect local sync queue.'
              : syncStatus === 'pending_sync'
              ? 'Back online with queued offline changes. Click Sync Now or inspect queue.'
              : 'Sync Status: Connected & synced. Click for sync details or offline test mode.'
          }
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A4FD5]"
        >
          {syncStatus === 'syncing' ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
          ) : syncStatus === 'offline' ? (
            <WifiOff className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 shrink-0" aria-hidden="true" />
          ) : syncStatus === 'pending_sync' ? (
            <CloudUpload className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-300 shrink-0" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
          )}

          <span className="flex items-center gap-1">
            {!compactOnMobile && (
              <span className="hidden xl:inline opacity-75 font-medium">Sync Status:</span>
            )}
            <span className="font-bold">
              {syncStatus === 'syncing'
                ? 'Syncing...'
                : syncStatus === 'offline'
                ? 'Offline'
                : syncStatus === 'pending_sync'
                ? compactOnMobile
                  ? 'Sync'
                  : 'Back Online'
                : compactOnMobile
                ? 'Synced'
                : 'Synced'}
            </span>
            {syncCount > 0 && (
              <span className="font-mono tabular-nums text-[10px] font-bold opacity-85">
                ({syncCount})
              </span>
            )}
          </span>

          <ChevronDown
            className={`w-3 h-3 opacity-60 transition-transform duration-200 ${
              isPopoverOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>

        {/* Direct Manual Data Sync Action Button (Visible when back online / online) */}
        {isOnline && (
          <button
            type="button"
            onClick={triggerManualSync}
            disabled={isSyncing}
            title={
              syncCount > 0
                ? `Back online: manually sync ${syncCount} queued records now`
                : 'Manually trigger data sync now'
            }
            aria-label={
              syncCount > 0
                ? `Sync ${syncCount} queued records now`
                : 'Trigger manual data sync'
            }
            className={`inline-flex items-center gap-1 px-2 py-1.5 border-l transition-colors cursor-pointer disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A4FD5] ${
              syncStatus === 'pending_sync'
                ? 'bg-[#0A4FD5] hover:bg-[#07389B] text-white border-[#0A4FD5]'
                : 'border-current/15 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
          >
            <RefreshCw
              className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            {!compactOnMobile && (
              <span className="text-[11px] font-bold">
                {syncStatus === 'pending_sync' ? 'Sync Now' : 'Sync'}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Sync Status Popover Flyout */}
      {isPopoverOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-4 bg-white dark:bg-[#0B192C] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 z-50 text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                  syncStatus === 'offline'
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                    : syncStatus === 'pending_sync'
                    ? 'bg-blue-100 dark:bg-blue-950/80 text-[#0A4FD5] dark:text-blue-300'
                    : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                {syncStatus === 'offline' ? (
                  <WifiOff className="w-4 h-4" />
                ) : syncStatus === 'pending_sync' ? (
                  <CloudUpload className="w-4 h-4" />
                ) : (
                  <Wifi className="w-4 h-4" />
                )}
              </div>
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Sync Status
                </h4>
                <div className="text-sm font-extrabold">
                  {syncStatus === 'offline' ? (
                    <span className="text-amber-700 dark:text-amber-300">
                      Running in Offline Mode
                    </span>
                  ) : syncStatus === 'pending_sync' ? (
                    <span className="text-[#0A4FD5] dark:text-blue-300">
                      Back Online · Manual Sync Ready
                    </span>
                  ) : syncStatus === 'syncing' ? (
                    <span className="text-[#0A4FD5] dark:text-blue-300">
                      Syncing Local Changes...
                    </span>
                  ) : (
                    <span className="text-emerald-700 dark:text-emerald-300">
                      Online · All Data Synced
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsPopoverOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close sync status popover"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Feedback Message if any */}
          {syncFeedbackMessage && (
            <div className="mt-3 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between gap-2 text-[11px] text-slate-700 dark:text-slate-200">
              <span>{syncFeedbackMessage}</span>
              <button
                type="button"
                onClick={clearSyncFeedback}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 cursor-pointer"
                aria-label="Dismiss sync notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Offline Architecture explanation */}
          <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/80 text-xs">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <span className="font-bold text-slate-900 dark:text-white">
                  Offline-First Local Cache:
                </span>{' '}
                {isOnline
                  ? 'Connected to MsmeBooks Cloud. Use manual sync anytime to reconcile local records and FX rates.'
                  : 'Internet unavailable. Changes are queued safely in browser storage until you are back online.'}
              </div>
            </div>
          </div>

          {/* Diagnostic Metrics Grid */}
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-100 dark:border-slate-800/60">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                Local Sync Queue
              </span>
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 tabular-nums">
                <Database className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
                <span>
                  {syncCount === 0
                    ? '0 pending records'
                    : `${syncCount} queued record${syncCount === 1 ? '' : 's'}`}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-100 dark:border-slate-800/60">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">
                Last Cloud Sync
              </span>
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 tabular-nums">
                <Server className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate">{lastSyncedTime}</span>
              </div>
            </div>
          </div>

          {/* Queued Offline Items List */}
          {queuedItems.length > 0 && (
            <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-[#071324] border border-slate-100 dark:border-slate-800/60 space-y-1.5">
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Queued Local Records
              </div>
              {queuedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 text-[11px] text-slate-700 dark:text-slate-300"
                >
                  <span className="truncate">{item.label}</span>
                  <span className="font-mono tabular-nums text-[10px] text-slate-400 shrink-0">
                    {item.queuedAt}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Simulation Toggle & Manual Sync Actions */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-slate-800 dark:text-slate-200 font-bold">
                  Simulate Offline Mode
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  Test offline indicator & manual reconnect sync
                </span>
              </div>
              <button
                type="button"
                onClick={toggleSimulation}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isSimulatedOffline ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                role="switch"
                aria-checked={isSimulatedOffline}
                aria-label="Toggle simulated offline mode"
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isSimulatedOffline ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={triggerManualSync}
              disabled={!isOnline || isSyncing}
              className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl bg-[#0A4FD5] hover:bg-[#07389B] disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>
                {!isOnline
                  ? 'Offline — Waiting for Connection to Sync'
                  : isSyncing
                  ? 'Syncing Queued Data...'
                  : syncCount > 0
                  ? `Sync ${syncCount} Queued Record${syncCount === 1 ? '' : 's'} Now`
                  : 'Trigger Manual Data Sync'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
