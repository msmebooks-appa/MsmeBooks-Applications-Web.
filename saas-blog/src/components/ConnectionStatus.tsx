import React, { useState, useRef, useEffect } from 'react';
import { useConnection } from '../context/ConnectionContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  X,
  Radio,
  Zap,
  HardDrive
} from 'lucide-react';

interface ConnectionStatusBadgeProps {
  variant?: 'navbar' | 'compact' | 'drawer';
}

export const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({ variant = 'navbar' }) => {
  const {
    isOnline,
    isRealOnline,
    isSimulatedOffline,
    latencyMs,
    lastChecked,
    isChecking,
    checkConnection,
    toggleSimulatedOffline,
    cachedArticlesCount,
    cachedGuidesCount
  } = useConnection();
  const { dict, t } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatLastChecked = (date: Date | null) => {
    if (!date) return dict.connection.justNow;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (variant === 'drawer') {
    return (
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#102A4C] border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isOnline ? (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            ) : (
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              {isOnline ? `${dict.connection.online} • ${dict.connection.cloudSyncActive}` : dict.connection.offlineMode}
            </span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isOnline
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400'
            }`}
          >
            {isSimulatedOffline ? 'Simulated' : isOnline ? dict.connection.online : dict.connection.offline}
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          {isOnline
            ? dict.connection.cacheReady
            : dict.connection.offlineNotice}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => checkConnection()}
            disabled={isChecking}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#15345E] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-[#1c4377] transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin text-blue-600' : ''}`} />
            <span>{isChecking ? dict.connection.checking : dict.connection.checkConnection}</span>
          </button>

          <button
            onClick={toggleSimulatedOffline}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-colors ${
              isSimulatedOffline
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
            }`}
          >
            {isSimulatedOffline ? dict.connection.exitSimulation : dict.connection.simulateOffline}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      {/* Navbar Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
          isOnline
            ? 'bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs'
            : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-900 dark:text-amber-300 border border-amber-400/50 dark:border-amber-500/50 shadow-xs ring-1 ring-amber-400/30'
        }`}
        title={
          isOnline
            ? `${dict.connection.cloudSyncActive}`
            : `${dict.connection.offlineNotice}`
        }
        aria-expanded={isOpen}
      >
        {isOnline ? (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-lime-400" />
            <span className="hidden sm:inline font-semibold">{dict.connection.online}</span>
            {isSimulatedOffline && (
              <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 px-1 py-0.2 rounded font-mono">
                SIM
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span className="font-bold text-amber-700 dark:text-amber-300">
              {dict.connection.offline}
            </span>
            <span className="hidden md:inline text-[10px] bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-1.5 py-0.5 rounded font-medium">
              Cached
            </span>
          </div>
        )}
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-92 bg-white dark:bg-[#0B1E36] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div
                className={`p-1.5 rounded-lg ${
                  isOnline
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-lime-400'
                    : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                }`}
              >
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isOnline ? `${dict.connection.online} & ${dict.connection.cloudSyncActive}` : dict.connection.offlineMode}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isOnline ? dict.connection.cloudSyncActive : dict.connection.localEngineActive}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Detailed Status Explanation */}
          <div className="py-3">
            <div
              className={`p-3 rounded-xl text-xs mb-3 ${
                isOnline
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-900/40'
                  : 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800/50'
              }`}
            >
              {isOnline ? (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-lime-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {dict.connection.cloudSyncActive}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {dict.connection.cacheReady}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {dict.connection.offlineMode}
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {dict.connection.offlineNotice} {dict.connection.queuedActionsNotice}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Metrics List */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50 dark:bg-[#102A4C]">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <HardDrive className="w-3.5 h-3.5 text-blue-600 dark:text-lime-400" />
                  <span>{dict.connection.cacheStatus}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {cachedArticlesCount} Articles & {cachedGuidesCount} Guides
                </span>
              </div>

              <div className="flex items-center justify-between py-1 px-2 rounded-lg bg-slate-50 dark:bg-[#102A4C]">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Radio className="w-3.5 h-3.5 text-blue-600 dark:text-lime-400" />
                  <span>{dict.connection.latency}</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {isOnline && latencyMs !== null ? `${latencyMs} ms` : dict.connection.offline}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 px-2 text-slate-500 dark:text-slate-400 text-[11px]">
                <span>{dict.connection.lastVerified}:</span>
                <span>{formatLastChecked(lastChecked)}</span>
              </div>
            </div>
          </div>

          {/* Actions & Simulation Toggle */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={() => checkConnection()}
              disabled={isChecking}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#15345E] dark:hover:bg-[#1c4377] text-slate-800 dark:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-blue-600 dark:text-lime-400' : ''}`} />
              <span>{isChecking ? dict.connection.checking : dict.connection.checkConnection}</span>
            </button>

            {/* Offline Simulation Switch */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#071527] border border-slate-200/80 dark:border-slate-800">
              <div className="pr-2">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {dict.connection.simulateOffline}
                </div>
              </div>
              <button
                type="button"
                onClick={toggleSimulatedOffline}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isSimulatedOffline ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                role="switch"
                aria-checked={isSimulatedOffline}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isSimulatedOffline ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const OfflineAlertBanner: React.FC = () => {
  const {
    isOnline,
    reconnectedRecently,
    isSimulatedOffline,
    checkConnection,
    isChecking,
    setSimulatedOffline,
    dismissReconnectedBanner
  } = useConnection();
  const { dict } = useLanguage();

  if (reconnectedRecently && isOnline) {
    return (
      <div className="bg-emerald-600 text-white text-xs py-2 px-4 shadow-md transition-all duration-300 animate-in slide-in-from-top">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span className="font-semibold">
              {dict.connection.online}!
            </span>
            <span className="hidden sm:inline text-emerald-100">
              {dict.connection.reconnectedNotice}
            </span>
          </div>
          <button
            onClick={dismissReconnectedBanner}
            className="p-1 rounded hover:bg-emerald-700 text-emerald-100 transition-colors"
            title={dict.connection.dismiss}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white text-xs py-2 px-4 shadow-sm transition-all duration-300 border-b border-amber-700">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <WifiOff className="w-4 h-4 text-amber-200 shrink-0 animate-pulse" />
            <span className="font-bold whitespace-nowrap">
              {dict.connection.offlineMode}:
            </span>
            <span className="truncate text-amber-50 hidden md:inline">
              {dict.connection.offlineNotice}
            </span>
            <span className="truncate text-amber-50 md:hidden">
              {dict.connection.localEngineActive}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => checkConnection()}
              disabled={isChecking}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-700/80 hover:bg-amber-800 text-white text-[11px] font-semibold transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? dict.connection.checking : dict.connection.checkConnection}</span>
            </button>
            {isSimulatedOffline && (
              <button
                onClick={() => setSimulatedOffline(false)}
                className="px-2 py-1 rounded-md bg-white text-amber-900 text-[11px] font-bold hover:bg-amber-50 transition-colors"
              >
                {dict.connection.exitSimulation}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
