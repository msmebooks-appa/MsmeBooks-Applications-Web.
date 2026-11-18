import React, { useState, useEffect, useRef } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface ConnectionStatusIndicatorProps {
  className?: string;
  showBanner?: boolean;
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  className = '',
  showBanner = true
}) => {
  const { t } = useLanguage();
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('Just now');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effective status considers both real network status and simulation
  const effectiveOnline = !simulatedOffline && isOnline;

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastChecked('Just now');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setLastChecked('Just now');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleSimulation = () => {
    setSimulatedOffline(!simulatedOffline);
    setLastChecked('Just now');
  };

  return (
    <>
      {/* Offline Alert Banner (Appears when offline) */}
      <AnimatePresence>
        {!effectiveOnline && showBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="w-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white text-xs px-4 py-2 border-b border-amber-900 shadow-md relative z-50 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-200"></span>
                </span>
                <WifiOff className="w-4 h-4 shrink-0 text-amber-200" />
                <span className="font-semibold">
                  {t('offline.banner_offline', 'Operating in Offline Mode — Local Cache Active. Submissions & calculations are stored safely on your device and will sync automatically upon reconnection.')}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {simulatedOffline && (
                  <span className="bg-amber-900/60 text-amber-100 text-[10px] px-2 py-0.5 rounded font-mono">
                    Simulation Active
                  </span>
                )}
                <button
                  onClick={() => {
                    setSimulatedOffline(false);
                    setIsOnline(navigator.onLine);
                  }}
                  className="px-2.5 py-1 bg-white text-amber-900 font-bold rounded-lg text-[11px] hover:bg-amber-50 transition-colors shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reconnect
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar Status Pill Indicator */}
      <div className={`relative ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Connection status"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-semibold cursor-pointer ${
            effectiveOnline
              ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-[#8CE600] hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50'
              : 'bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-100 animate-pulse'
          }`}
          title={effectiveOnline ? 'Network Connected · Real-time sync active' : 'Offline Mode Active'}
        >
          {effectiveOnline ? (
            <>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 dark:bg-[#8CE600]"></span>
              </span>
              <Wifi className="w-3.5 h-3.5" />
              <span className="hidden md:inline font-bold">
                {t('offline.status_online', 'Online')}
              </span>
            </>
          ) : (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping shrink-0" />
              <WifiOff className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold">
                {t('offline.status_offline', 'Offline')}
              </span>
            </>
          )}
        </button>

        {/* Status Popover */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white dark:bg-[#072457] rounded-2xl shadow-2xl border border-slate-200 dark:border-blue-800/80 p-4 z-50 text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-blue-900/60">
                <div className="flex items-center gap-2">
                  {effectiveOnline ? (
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-[#8CE600] flex items-center justify-center">
                      <Wifi className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <WifiOff className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      {effectiveOnline ? 'Network Connection: Active' : 'Operating in Offline Mode'}
                    </h4>
                    <span className="text-[10px] text-slate-400">Checked: {lastChecked}</span>
                  </div>
                </div>
              </div>

              <div className="py-3 space-y-2 text-slate-600 dark:text-slate-300 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Cloud Sync:</span>
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                    {effectiveOnline ? (
                      <>
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-[#8CE600]" />
                        Active (REST API & Webhooks)
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                        Paused (Queued in Local Storage)
                      </>
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Offline Resilience:</span>
                  <span className="font-semibold text-emerald-600 dark:text-[#8CE600] flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Enabled (PWA Ready)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Pan-African Cache:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Lead Data & Badges Cached
                  </span>
                </div>
              </div>

              {/* Simulation Testing Toggle */}
              <div className="pt-3 border-t border-slate-100 dark:border-blue-900/60">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Network Resilience Testing
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleToggleSimulation}
                  className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    simulatedOffline
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-blue-900/40 dark:hover:bg-blue-900/70 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-blue-800'
                  }`}
                >
                  {simulatedOffline ? (
                    <>
                      <Wifi className="w-3.5 h-3.5" />
                      Restore Real Online Mode
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      Simulate Offline Mode (Test)
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};
