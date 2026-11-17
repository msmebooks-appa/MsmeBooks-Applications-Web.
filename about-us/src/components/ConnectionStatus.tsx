import React, { useState, useRef, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  CheckCircle2, 
  Database, 
  AlertTriangle, 
  HardDrive, 
  Clock, 
  X,
  Radio,
  Zap
} from 'lucide-react';
import { useConnection } from '../context/ConnectionContext';
import { useLanguage } from '../context/LanguageContext';

interface ConnectionStatusProps {
  variant?: 'desktop' | 'mobile';
  showBanner?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  variant = 'desktop',
}) => {
  const { 
    isOnline, 
    isSimulatedOffline, 
    effectiveOnline, 
    isSyncing, 
    pendingSyncCount, 
    lastSyncedAt,
    toggleSimulateOffline,
    triggerManualSync,
    offlineDurationSeconds
  } = useConnection();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
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

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Just now';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatOfflineDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="relative inline-flex items-center" ref={popoverRef}>
      {/* Trigger Button */}
      {variant === 'desktop' ? (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 select-none ${
            effectiveOnline
              ? 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 focus:ring-emerald-500'
              : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:bg-amber-950/60 dark:hover:bg-amber-950/80 dark:text-amber-300 border border-amber-400/50 dark:border-amber-600/50 animate-pulse focus:ring-amber-500'
          }`}
          title={effectiveOnline ? 'Network: Online (Cloud Synchronized)' : 'Network: Offline (Local Ledger Active)'}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
        >
          {effectiveOnline ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium text-[11px] tracking-tight">{t.conn_online}</span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="font-semibold text-[11px] tracking-tight text-amber-900 dark:text-amber-200">
                {t.conn_offline}
              </span>
              {pendingSyncCount > 0 && (
                <span className="px-1 py-0.2 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-[10px] font-bold">
                  {pendingSyncCount}
                </span>
              )}
            </>
          )}
        </button>
      ) : (
        /* Mobile trigger: Compact icon with glowing dot */
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-1.5 rounded-lg border text-xs transition-colors relative cursor-pointer ${
            effectiveOnline
              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60'
              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 animate-pulse'
          }`}
          aria-label="Connection Status"
        >
          {effectiveOnline ? (
            <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          )}
          <span
            className={`absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full ${
              effectiveOnline ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </button>
      )}

      {/* Popover Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-92 bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 p-4 z-50 text-slate-800 dark:text-slate-100 animate-in fade-in slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  effectiveOnline
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400'
                    : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400'
                }`}
              >
                {effectiveOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {t.conn_status_title}
                </h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      effectiveOnline ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                  <span>{effectiveOnline ? t.conn_online : t.conn_offline}</span>
                  {!effectiveOnline && offlineDurationSeconds > 0 && (
                    <span>({formatOfflineDuration(offlineDurationSeconds)})</span>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Core Status Body */}
          <div className="py-3 space-y-2.5">
            {effectiveOnline ? (
              <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t.conn_sync_active}</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t.conn_network_desc}
                </p>
                <div className="mt-2 pt-2 border-t border-emerald-100 dark:border-emerald-900/30 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-[#84CC16]" />
                    {t.conn_fast_cdn}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Last sync: {formatLastSync(lastSyncedAt)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs space-y-2">
                <div className="flex items-start gap-2 text-amber-900 dark:text-amber-200 font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div>{t.conn_local_active}</div>
                    <div className="text-[11px] font-normal text-slate-600 dark:text-slate-300 mt-0.5">
                      {t.conn_offline_banner}
                    </div>
                  </div>
                </div>

                {/* Local Queuing Counter */}
                <div className="bg-white/80 dark:bg-[#070E1B]/70 rounded-lg p-2 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px]">
                    <HardDrive className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-slate-700 dark:text-slate-300">Queued Offline Transactions:</span>
                  </div>
                  <span className="font-bold text-xs text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/80">
                    {pendingSyncCount} saved
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-amber-500" />
                  <span>{t.conn_auto_sync}</span>
                </div>
              </div>
            )}

            {/* Offline Engine Architecture Highlights */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white mb-0.5">
                  <Database className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-[#38BDF8]" />
                  <span>Local SQLite/Cache</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  Zero downtime for POS checkouts & sales
                </p>
              </div>

              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white mb-0.5">
                  <Radio className="w-3.5 h-3.5 text-[#84CC16]" />
                  <span>P2P Branch Sync</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                  Auto-resolves conflicts upon reconnect
                </p>
              </div>
            </div>
          </div>

          {/* Action Footer: Sync Now & Test Simulation Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="sim-offline-toggle" 
                className="text-[11px] font-medium text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.conn_test_toggle}</span>
                {isSimulatedOffline && (
                  <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-950">
                    Active
                  </span>
                )}
              </label>

              <button
                id="sim-offline-toggle"
                type="button"
                role="switch"
                aria-checked={isSimulatedOffline}
                onClick={toggleSimulateOffline}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0B4EA2] focus:ring-offset-1 ${
                  isSimulatedOffline ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isSimulatedOffline ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Manual Sync / Reconnect Button */}
            <button
              onClick={() => {
                if (isSimulatedOffline) {
                  toggleSimulateOffline();
                } else {
                  triggerManualSync();
                }
              }}
              disabled={isSyncing}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#0B4EA2]' : ''}`} />
              <span>
                {isSyncing 
                  ? 'Synchronizing Cloud...' 
                  : isSimulatedOffline 
                  ? t.conn_reconnect 
                  : 'Test Cloud Re-Sync'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Top Offline Banner: Displayed when operating offline to give prominent reassurance
 */
export const OfflineAlertBanner: React.FC = () => {
  const { effectiveOnline, isSimulatedOffline, toggleSimulateOffline, triggerManualSync, isSyncing } = useConnection();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);

  // If status changes back to online, reset dismiss state
  useEffect(() => {
    if (effectiveOnline) {
      setDismissed(false);
    }
  }, [effectiveOnline]);

  if (effectiveOnline || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-600 text-white px-4 py-2 text-xs font-medium shadow-inner transition-all duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <WifiOff className="w-4 h-4 text-amber-200 shrink-0 animate-pulse" />
          <p className="truncate">
            <span className="font-bold underline decoration-amber-300 mr-1.5">
              {t.conn_offline}:
            </span>
            <span>{t.conn_offline_banner}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (isSimulatedOffline) {
                toggleSimulateOffline();
              } else {
                triggerManualSync();
              }
            }}
            disabled={isSyncing}
            className="px-2.5 py-1 rounded bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{t.conn_reconnect}</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
