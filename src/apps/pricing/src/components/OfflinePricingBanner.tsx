import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, CheckCircle2, RefreshCw, HardDrive, ShieldCheck, Sparkles, X, ChevronRight, Zap } from 'lucide-react';
import { useConnection } from '../context/ConnectionContext';
import { getOfflineCacheStatus, forceRefreshOfflineCache, OfflineCacheStatus } from '../services/serviceWorkerRegistration';

export const OfflinePricingBanner: React.FC = () => {
  const { isOnline, isSimulatedOffline, toggleSimulation, forceSync, isSyncing, lastSyncedTime } = useConnection();
  const [cacheStatus, setCacheStatus] = useState<OfflineCacheStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    getOfflineCacheStatus().then(setCacheStatus);
  }, [isOnline, isSyncing]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await forceRefreshOfflineCache();
    forceSync();
    const updated = await getOfflineCacheStatus();
    setCacheStatus(updated);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  // If connection is offline (either genuine or simulated), show high-priority offline reassurance banner
  if (!isOnline) {
    return (
      <div className="relative z-40 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-600 text-white shadow-lg animate-in fade-in duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 text-center sm:text-left">
              <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <WifiOff className="w-3.5 h-3.5 text-white" />
              </span>
              <p className="font-semibold text-white">
                <strong className="font-black">Offline Mode Active:</strong>{' '}
                <span>All 9 Subscription Plans, Comparison Matrix &amp; FAQs are cached locally. You can browse, compare, and calculate prices without an internet connection.</span>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowDetailsModal(true)}
                className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1"
                title="View cached pricing status"
              >
                <HardDrive className="w-3.5 h-3.5" />
                <span>Cached Data</span>
              </button>

              {isSimulatedOffline ? (
                <button
                  type="button"
                  onClick={toggleSimulation}
                  className="px-3 py-1 rounded-lg bg-white text-amber-900 font-black text-xs hover:bg-amber-50 transition-all cursor-pointer shadow-xs"
                >
                  Exit Offline Test
                </button>
              ) : (
                <button
                  type="button"
                  onClick={forceSync}
                  className="px-3 py-1 rounded-lg bg-white text-amber-900 font-black text-xs hover:bg-amber-50 transition-all cursor-pointer shadow-xs flex items-center gap-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Retry Network</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cache Details Dialog */}
        {showDetailsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#0B182B] rounded-2xl max-w-md w-full p-6 text-slate-800 dark:text-slate-200 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-sm">Offline Cache Active</h3>
                    <p className="text-[11px] text-slate-500">Service Worker &amp; Local Storage Persistence</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 py-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cached Subscription Tiers:</span>
                    <strong className="text-slate-900 dark:text-white">9 Plans (Starter to Custom)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Comparison Matrix:</span>
                    <strong className="text-slate-900 dark:text-white">10 Categories (Zoho Books Spec)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cached FAQs:</span>
                    <strong className="text-slate-900 dark:text-white">15 African Business Guides</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service Worker Status:</span>
                    <strong className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{cacheStatus?.isActive ? 'Active & Ready' : 'Standby / Storage Backed'}</span>
                    </strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  MsmeBooks is built specifically for intermittent African connectivity. When network towers fluctuate or data bundles expire, your pricing calculations, volume tier recommendations, and currency estimates continue to operate seamlessly.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#0A4FD5] text-white text-xs font-bold hover:bg-[#07389B] cursor-pointer"
                >
                  Close &amp; Continue Browsing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // When online, show an elegant, unobtrusive pill that users can verify and test
  if (isDismissed) {
    return null;
  }

  return (
    <div className="bg-slate-50/90 dark:bg-[#071322]/90 border-b border-slate-200/70 dark:border-slate-800 text-xs py-1.5 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">
            <strong className="font-extrabold text-[#0A4FD5] dark:text-blue-400">Offline Ready:</strong>{' '}
            <span>Service Worker has cached pricing tables &amp; FAQs for intermittent network coverage.</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleSimulation}
            className="text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-[#0A4FD5] dark:hover:text-blue-300 transition-colors cursor-pointer hidden md:inline-flex items-center gap-1"
            title="Simulate network outage to test offline pricing view"
          >
            <WifiOff className="w-3 h-3 text-slate-400" />
            <span>Test Offline View</span>
          </button>

          <span className="text-slate-300 dark:text-slate-700 hidden md:inline">|</span>

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="text-[11px] font-bold text-[#0A4FD5] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-50"
            title="Update cached pricing snapshot"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Updating Cache...' : 'Sync Cache'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 ml-1 cursor-pointer"
            aria-label="Dismiss offline ready notice"
            title="Dismiss notice"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
