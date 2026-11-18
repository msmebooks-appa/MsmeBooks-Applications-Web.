import React, { useState, useRef, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  CloudOff, 
  Cloud,
  Layers,
  Sparkles
} from 'lucide-react';
import { useNetworkStatus } from '../context/NetworkContext';
import { useLanguage } from '../context/LanguageContext';

interface ConnectionStatusIndicatorProps {
  compact?: boolean;
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({ compact = false }) => {
  const { 
    isOnline, 
    isRealOnline,
    isSimulatedOffline, 
    toggleSimulateOffline, 
    queuedCount, 
    syncStatus, 
    syncQueuedRequests,
    testConnection
  } = useNetworkStatus();

  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
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

  const handleManualCheck = async () => {
    setIsChecking(true);
    await testConnection();
    if (isOnline && queuedCount > 0) {
      await syncQueuedRequests();
    }
    setTimeout(() => setIsChecking(false), 600);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={t('nav.connectionStatus', 'Connection status')}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
          isOnline
            ? 'bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            : 'bg-amber-100/90 dark:bg-amber-950/80 hover:bg-amber-200/90 dark:hover:bg-amber-900/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700/80 shadow-sm animate-pulse'
        }`}
        title={isOnline ? t('connection.connected', 'Connected to MsmeBooks Cloud') : t('connection.disconnected', 'Offline Mode Active')}
      >
        {/* Animated dot indicator */}
        <span className="relative flex h-2 w-2 shrink-0">
          {isOnline ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </>
          ) : (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </>
          )}
        </span>

        {/* Icon & Label */}
        {isOnline ? (
          <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        )}

        <span className="font-medium tracking-tight">
          {isOnline ? t('connection.online', 'Online') : t('connection.offline', 'Offline')}
        </span>

        {/* Queued badge count if offline submissions exist */}
        {queuedCount > 0 && (
          <span className="ml-0.5 px-1.5 py-0.2 bg-amber-600 dark:bg-amber-500 text-white text-[10px] font-bold rounded-full">
            {queuedCount}
          </span>
        )}

        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Connection Details Popover */}
      {isOpen && (
        <div
          role="dialog"
          aria-label={t('nav.connectionStatus', 'Connection status')}
          className={`absolute right-0 mt-2 z-50 w-72 sm:w-80 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-xl ring-1 ring-slate-900/10 dark:ring-white/10 border border-slate-200 dark:border-slate-800 transition-all ${
            compact ? 'right-0' : 'right-0'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  isOnline
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/30'
                }`}
              >
                {isOnline ? <Cloud className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  {isOnline ? t('connection.online', 'Online') : t('connection.offline', 'Offline Mode')}
                  {isSimulatedOffline && (
                    <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 rounded">
                      Simulated
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {isOnline ? t('connection.connected', 'Connected to MsmeBooks Cloud') : t('connection.disconnected', 'No Internet Connection')}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                isOnline
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
              }`}
            >
              {isOnline ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>

          {/* Offline Resiliency Guidance */}
          <div className="py-3 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
              <Database className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  {t('connection.cachedNotice', '100% Policy Documentation Cached Offline')}
                </span>
                {t(
                  'connection.offlineNotice',
                  'Operating offline. All policy terms, matrix scenarios, and cancellation guides are cached on your device.'
                )}
              </div>
            </div>

            {/* Offline claim sync notice */}
            <div className="flex items-start gap-2 bg-blue-50/70 dark:bg-blue-950/40 p-2.5 rounded-lg border border-blue-100/60 dark:border-blue-900/40">
              <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed text-blue-900 dark:text-blue-200">
                {t(
                  'connection.offlineQueued',
                  'Dispute claims submitted offline are safely queued and will automatically sync when connection restores.'
                )}
              </div>
            </div>

            {/* Queued items count if any */}
            {queuedCount > 0 && (
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="font-semibold text-[11px]">
                    {queuedCount} {t('connection.pendingSync', 'pending offline sync')}
                  </span>
                </div>
                {isOnline && (
                  <button
                    onClick={syncQueuedRequests}
                    disabled={syncStatus === 'syncing'}
                    className="px-2 py-1 text-[10px] font-bold bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
                  >
                    {syncStatus === 'syncing' ? '...' : t('connection.syncNow', 'Sync Now')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Actions & Simulation Switch */}
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2">
            {/* Simulation toggle button */}
            <div className="flex items-center justify-between py-1 px-1">
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-lime-600 dark:text-lime-400" />
                  {t('connection.simulateOffline', 'Simulate Offline Mode')}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {isSimulatedOffline ? 'Testing offline queue behavior' : 'Test offline cache & queues'}
                </span>
              </div>
              <button
                type="button"
                onClick={toggleSimulateOffline}
                role="switch"
                aria-checked={isSimulatedOffline}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  isSimulatedOffline ? 'bg-blue-900 dark:bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isSimulatedOffline ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Test Connection Button */}
            <button
              type="button"
              onClick={handleManualCheck}
              disabled={isChecking}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              <span>{isChecking ? 'Checking...' : t('connection.testReconnect', 'Check Connection')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
