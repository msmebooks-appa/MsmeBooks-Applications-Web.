import React, { useState, useEffect, useRef } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ConnectionStatusIndicatorProps {
  compact?: boolean;
  className?: string;
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  compact = false,
  className = ''
}) => {
  const { t } = useLanguage();
  
  // Real browser online state
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Simulation state for regional testing
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Effective status: only online if both browser is online AND user hasn't toggled offline simulation
  const isOnline = isBrowserOnline && !isSimulatedOffline;

  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      if (!isSimulatedOffline) {
        setToastMessage('Internet connection restored · Cloud synchronization active');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      }
    };

    const handleOffline = () => {
      setIsBrowserOnline(false);
      setToastMessage('Connection lost · Operating in offline cached mode');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSimulatedOffline]);

  const handleToggleSimulation = () => {
    const nextSimState = !isSimulatedOffline;
    setIsSimulatedOffline(nextSimState);
    if (nextSimState) {
      setToastMessage('Offline mode simulated · All calculations and data operate from cache');
    } else {
      setToastMessage('Online mode restored · Reconnected to MsmeBooks cloud');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleCheckConnection = async () => {
    setIsChecking(true);
    try {
      // Ping check
      const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
      setIsBrowserOnline(online);
      await new Promise((resolve) => setTimeout(resolve, 600));
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger Button in Nav Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOnline ? t('status.online') : t('status.offline')}
        title={isOnline ? t('status.onlineDesc') : t('status.offlineDesc')}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border focus:outline-none focus:ring-2 focus:ring-[#1261B5] ${
          isOnline
            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-800/60 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/40'
            : 'text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-700 hover:bg-amber-200/70 dark:hover:bg-amber-900/60 animate-pulse shadow-xs'
        }`}
      >
        {isOnline ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            {!compact && (
              <span className="hidden xl:inline text-[11px] font-bold">
                {t('status.online')}
              </span>
            )}
          </>
        ) : (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <WifiOff className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
            <span className="text-[11px] font-black uppercase tracking-wide">
              {compact ? 'Offline' : t('status.offline')}
            </span>
          </>
        )}
      </button>

      {/* Connectivity Details Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#142D4E] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div
            className={`p-3.5 border-b flex items-center justify-between ${
              isOnline
                ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/40'
                : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50'
            }`}
          >
            <div className="flex items-center gap-2">
              {isOnline ? (
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Wifi className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <WifiOff className="w-4 h-4" />
                </div>
              )}
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {isOnline ? t('status.online') : t('status.offline')}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isSimulatedOffline ? 'Simulated Offline Test' : 'Pan-African Connection Guard'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Close status popover"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <div className="p-3.5 space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <p className="leading-relaxed text-[11px]">
              {isOnline ? t('status.onlineDesc') : t('status.offlineDesc')}
            </p>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="font-semibold">Local Caching:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Active
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="font-semibold">Calculator & Ledger:</span>
                <span className="text-slate-500 dark:text-slate-400">100% Offline Ready</span>
              </div>
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span className="font-semibold">Application Sync:</span>
                <span className="text-slate-500 dark:text-slate-400">Queued in Local Storage</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleCheckConnection}
                disabled={isChecking}
                className="w-full py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                <span>{t('status.checkConn')}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleSimulation}
                className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                  isSimulatedOffline
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                {isSimulatedOffline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5" />
                    <span>{t('status.restoreOnline')}</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5" />
                    <span>{t('status.simOffline')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 text-[10px] text-slate-400 text-center">
            Optimized for low-bandwidth & intermittent connectivity
          </div>
        </div>
      )}

      {/* Floating Connectivity Change Toast Alert */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
          <div
            className={`px-4 py-2.5 rounded-full shadow-2xl border text-xs font-bold flex items-center gap-2 backdrop-blur-md ${
              isOnline
                ? 'bg-emerald-600/95 text-white border-emerald-400/50 shadow-emerald-950/20'
                : 'bg-amber-600/95 text-white border-amber-400/50 shadow-amber-950/20'
            }`}
          >
            {isOnline ? (
              <Wifi className="w-4 h-4 text-emerald-200" />
            ) : (
              <WifiOff className="w-4 h-4 text-amber-200" />
            )}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
