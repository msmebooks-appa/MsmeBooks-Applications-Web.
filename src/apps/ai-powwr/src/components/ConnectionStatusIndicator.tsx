import React, { useState, useRef, useEffect } from 'react';
import { useConnectionStatus } from '../context/ConnectionContext';
import { useI18n } from '../context/I18nContext';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle,
  X,
  Server,
  Database,
  Radio,
  ChevronDown
} from 'lucide-react';

interface ConnectionStatusIndicatorProps {
  variant?: 'topbar' | 'navbar' | 'drawer' | 'banner';
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  variant = 'topbar'
}) => {
  const {
    isOnline,
    isRealOnline,
    isSimulatedOffline,
    isChecking,
    latencyMs,
    lastChecked,
    offlineBannerDismissed,
    toggleSimulatedOffline,
    checkConnection,
    dismissOfflineBanner
  } = useConnectionStatus();

  const { t, isRTL } = useI18n();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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

  /* ==========================================================
     Variant 1: Top Bar Pill (compact, visible in high-contrast header)
     ========================================================== */
  if (variant === 'topbar') {
    return (
      <div className="relative inline-block" ref={popoverRef}>
        <button
          onClick={() => setPopoverOpen(!popoverOpen)}
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-semibold transition cursor-pointer shadow-xs ${
            isOnline
              ? 'bg-blue-700/60 hover:bg-blue-700 dark:bg-blue-900/60 dark:hover:bg-blue-800 text-white'
              : 'bg-amber-500 hover:bg-amber-600 text-[#17233D] font-bold animate-pulse'
          }`}
          title={
            isOnline
              ? `${t('conn.online', 'Online')} — ${t('conn.cloudSyncActive', 'Cloud Sync Active')}`
              : `${t('conn.offlineMode', 'Offline Mode')} — ${t('conn.workingOffline', 'Working Offline')}`
          }
          aria-expanded={popoverOpen}
          aria-label="Connection Status"
        >
          {isOnline ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <Wifi className="w-3 h-3 text-emerald-300" />
              <span className="hidden sm:inline text-[11px] font-medium tracking-tight">
                {t('conn.online', 'Online')}
              </span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-90"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <WifiOff className="w-3.5 h-3.5 text-red-900" />
              <span className="text-[11px] font-black uppercase tracking-tight text-slate-900">
                {t('conn.offline', 'Offline')}
              </span>
              {isSimulatedOffline && (
                <span className="hidden sm:inline text-[9px] bg-slate-900 text-amber-300 px-1 py-0.2 rounded font-mono">
                  DEMO
                </span>
              )}
            </>
          )}
          <ChevronDown className="w-2.5 h-2.5 opacity-70" />
        </button>

        {/* Diagnostics & Offline Simulation Popover */}
        {popoverOpen && (
          <div
            className={`absolute top-full mt-1.5 w-76 sm:w-84 bg-white dark:bg-[#131E36] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-3 px-3.5 text-slate-800 dark:text-slate-100 z-50 transition-all ${
              isRTL ? 'left-0' : 'right-0'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    isOnline
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {isOnline
                      ? t('conn.cloudSyncActive', 'Cloud Sync Active')
                      : t('conn.offlineMode', 'Offline Mode Operating')}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isOnline
                      ? t('conn.connectedToCloud', 'Connected to MsmeBooks Edge Cloud')
                      : t('conn.workingOffline', 'Working offline with local cache')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPopoverOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Offline Resilience Note */}
            <div className="mt-2.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-[11px] space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-200">
                <Database className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522]" />
                <span>{t('conn.allDataCached', 'Knowledge base and 24 categories cached locally')}</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {isOnline
                  ? 'All 18+ FAQ records, currency multipliers, and search indexes are locally replicated for uninterrupted access if connectivity drops.'
                  : 'Reliable internet can be intermittent across regions. You can continue reading verified answers, calculating costs, and searching full guides.'}
              </p>
            </div>

            {/* Diagnostics Stats */}
            <div className="mt-2.5 grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 block">{t('conn.lastChecked', 'Last verified')}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {lastChecked ? lastChecked.toLocaleTimeString() : 'Just now'}
                </span>
              </div>
              <div className="p-2 rounded bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 block">{t('conn.pingLatency', 'Network Latency')}</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {isOnline && latencyMs ? `${latencyMs}ms (Healthy)` : isOnline ? '< 60ms' : 'Offline'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={async () => {
                  await checkConnection();
                }}
                disabled={isChecking}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#1254B5] dark:text-blue-300 transition cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? t('conn.reconnecting', 'Checking...') : t('conn.reconnect', 'Test Connection')}</span>
              </button>

              <button
                onClick={() => {
                  toggleSimulatedOffline();
                }}
                className={`text-[11px] font-semibold px-2 py-1.5 rounded-lg transition cursor-pointer ${
                  isSimulatedOffline
                    ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900/50 dark:text-amber-200'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Toggle offline mode to test offline resilience without turning off Wi-Fi"
              >
                {isSimulatedOffline
                  ? t('conn.toggleOnline', 'Exit Simulation')
                  : t('conn.toggleSimulation', 'Simulate Offline')}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ==========================================================
     Variant 2: Desktop Navbar Badge (prominent beside search/actions)
     ========================================================== */
  if (variant === 'navbar') {
    return (
      <div className="relative inline-block" ref={popoverRef}>
        <button
          onClick={() => setPopoverOpen(!popoverOpen)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition cursor-pointer ${
            isOnline
              ? 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
              : 'border-amber-400 bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 animate-pulse font-bold'
          }`}
          title={isOnline ? 'Network status: Online' : 'Network status: Offline Mode Active'}
          aria-label="Toggle network status details"
        >
          {isOnline ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden xl:inline text-slate-600 dark:text-slate-300">
                {t('conn.online', 'Online')}
              </span>
            </>
          ) : (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="font-bold text-amber-800 dark:text-amber-300">
                {t('conn.offlineMode', 'Offline')}
              </span>
            </>
          )}
        </button>

        {/* Popover */}
        {popoverOpen && (
          <div
            className={`absolute top-full mt-2 w-80 bg-white dark:bg-[#131E36] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 py-3 px-3.5 text-slate-800 dark:text-slate-100 z-50 ${
              isRTL ? 'left-0' : 'right-0'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    isOnline
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {isOnline ? t('conn.cloudSyncActive', 'Connected') : t('conn.offlineMode', 'Offline Mode')}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {isOnline ? 'Low-latency cloud link' : 'Local knowledge base active'}
                  </p>
                </div>
              </div>
              <button onClick={() => setPopoverOpen(false)} className="text-slate-400 p-1">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-2.5 p-2 rounded bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Full offline browsing supported</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Browse questions, compute subscription savings, and review fiscal checklists even with zero connection.
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={async () => {
                  await checkConnection();
                }}
                disabled={isChecking}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 dark:bg-blue-950/60 text-[#1254B5] dark:text-blue-300"
              >
                <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{isChecking ? 'Testing...' : t('conn.reconnect', 'Test Connection')}</span>
              </button>

              <button
                onClick={() => toggleSimulatedOffline()}
                className="text-[11px] font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400"
              >
                {isSimulatedOffline ? 'Exit Demo' : 'Simulate Offline'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ==========================================================
     Variant 3: Mobile Drawer Row (full-width status bar for mobile)
     ========================================================== */
  if (variant === 'drawer') {
    return (
      <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`p-1.5 rounded-lg ${
                isOnline
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400'
                  : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 animate-pulse'
              }`}
            >
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {isOnline ? t('conn.online', 'Online Mode') : t('conn.offlineMode', 'Offline Mode Active')}
                </span>
                {isSimulatedOffline && (
                  <span className="text-[9px] bg-amber-500 text-slate-900 px-1 py-0.2 rounded font-mono font-bold">
                    DEMO
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                {isOnline
                  ? t('conn.cloudSyncActive', 'Connected · Cloud sync active')
                  : t('conn.workingOffline', 'Operating on local device cache')}
              </span>
            </div>
          </div>

          <button
            onClick={async () => {
              await checkConnection();
            }}
            disabled={isChecking}
            className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-100 border border-slate-200 dark:border-slate-600"
            title="Refresh network check"
            aria-label="Refresh network check"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px]">
          <span className="text-slate-500 dark:text-slate-400">
            {t('conn.allDataCached', 'Offline knowledge base active')}
          </span>
          <button
            onClick={() => toggleSimulatedOffline()}
            className="font-semibold text-[#1254B5] dark:text-[#B7E522] hover:underline"
          >
            {isSimulatedOffline ? t('conn.toggleOnline', 'Exit Demo') : t('conn.toggleSimulation', 'Test Offline')}
          </button>
        </div>
      </div>
    );
  }

  /* ==========================================================
     Variant 4: Persistent Offline Warning Banner (under navbar)
     ========================================================== */
  if (variant === 'banner') {
    // Only show banner if offline and not manually dismissed
    if (isOnline || offlineBannerDismissed) {
      return null;
    }

    return (
      <aside
        aria-label="Offline Mode Notification"
        className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 py-2 px-4 shadow-sm border-b border-amber-600/30 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <div className="p-1 rounded-full bg-amber-600/30 text-slate-950 shrink-0">
              <WifiOff className="w-4 h-4 animate-pulse" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight flex items-center gap-1.5 flex-wrap">
                <span>{t('conn.bannerOfflineTitle', 'Operating in Offline Mode')}</span>
                {isSimulatedOffline && (
                  <span className="text-[10px] bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded font-mono font-normal">
                    {t('conn.simulated', 'Demo Mode')}
                  </span>
                )}
              </p>
              <p className="text-[11px] text-slate-900/90 truncate sm:whitespace-normal font-medium mt-0.5">
                {t(
                  'conn.bannerOfflineDesc',
                  'Reliable internet can be intermittent across regions. MsmeBooks is operating from local cache — all FAQ answers, search, and calculators remain fully accessible. Changes will sync once reconnected.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={async () => {
                await checkConnection();
              }}
              disabled={isChecking}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-amber-300 text-xs font-bold transition cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isChecking ? t('conn.reconnecting', 'Checking...') : t('conn.reconnect', 'Test Connection')}
              </span>
            </button>

            {isSimulatedOffline && (
              <button
                onClick={() => toggleSimulatedOffline()}
                className="hidden md:inline-flex text-xs font-bold underline text-slate-900 hover:text-black cursor-pointer"
              >
                {t('conn.toggleOnline', 'Exit Simulation')}
              </button>
            )}

            <button
              onClick={dismissOfflineBanner}
              className="p-1 text-slate-800 hover:text-black rounded hover:bg-amber-600/20 cursor-pointer"
              title={t('conn.dismiss', 'Dismiss notification')}
              aria-label="Dismiss offline banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
