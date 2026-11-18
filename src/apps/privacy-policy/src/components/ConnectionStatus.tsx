import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  WifiOff,
  CheckCircle2,
  Database,
  ShieldCheck,
  ChevronDown,
  Info,
  Server,
  RefreshCw,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ConnectionStatusProps {
  isMobile?: boolean;
  onStatusChange?: (isOnline: boolean) => void;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isMobile = false,
  onStatusChange,
}) => {
  const { t } = useLanguage();
  const [nativeOnline, setNativeOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isOnline = nativeOnline && !isSimulatedOffline;

  // Sync to parent callback if provided
  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(isOnline);
    }
  }, [isOnline, onStatusChange]);

  // Window event listeners for native online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setNativeOnline(true);
      setToastMessage(t('connection.reconnected', 'Connection Restored · Sync Active'));
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setTimeout(() => setToastMessage(null), 4000);
    };

    const handleOffline = () => {
      setNativeOnline(false);
      setToastMessage(t('connection.lostConnection', 'Connection Lost — Offline Cache Active'));
      setTimeout(() => setToastMessage(null), 4500);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [t]);

  // Handle outside click to close popover
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

  const toggleSimulation = () => {
    const nextSimulated = !isSimulatedOffline;
    setIsSimulatedOffline(nextSimulated);
    const nextState = nativeOnline && !nextSimulated;
    setToastMessage(
      nextState
        ? t('connection.reconnected', 'Connection Restored · Sync Active')
        : t('connection.lostConnection', 'Connection Lost — Offline Cache Active')
    );
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef}>
      {/* Visual Indicator Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`Connection status: ${isOnline ? 'Online' : 'Offline Mode'}. Click for network and offline cache details.`}
        className={`group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
          isOnline
            ? 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200/90 dark:border-slate-700/80 shadow-2xs'
            : 'bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100/90 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700/80 shadow-xs'
        } ${isMobile ? 'w-full justify-between' : ''}`}
      >
        <div className="flex items-center gap-1.5">
          {isOnline ? (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Wifi className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <WifiOff className="w-3.5 h-3.5" />
            </div>
          )}

          <span className="font-semibold tracking-tight">
            {isOnline
              ? t('connection.online', 'Online')
              : t('connection.offline', 'Offline Mode')}
          </span>

          {!isOnline && (
            <span className="hidden md:inline-block text-[10px] font-mono uppercase bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 px-1.5 py-0.2 rounded font-bold">
              {t('connection.cached', 'Cached')}
            </span>
          )}
        </div>

        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Floating Transition Toast Alert */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed top-14 right-4 z-50 flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg shadow-lg text-xs font-medium border backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-2 duration-200 ${
            isOnline
              ? 'bg-emerald-50/95 dark:bg-emerald-950/95 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
              : 'bg-amber-50/95 dark:bg-amber-950/95 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700'
          }`}
        >
          {isOnline ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-1 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            aria-label="Dismiss alert"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Interactive Dropdown / Popover Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Network and Offline Cache Status"
          className="absolute right-0 top-full mt-2 w-80 sm:w-88 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-[#1455C0] dark:text-[#5B95FF]" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t('connection.statusTitle', 'Network & Cache Status')}
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded"
              aria-label="Close status popover"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Current State Summary */}
          <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">Current Mode:</span>
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isOnline
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                }`}
              >
                {isOnline ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Online & Connected</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span>Offline (Cached Engine)</span>
                  </>
                )}
              </div>
            </div>

            <p className="mt-2 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
              {isOnline
                ? 'Real-time telemetry and legal sync are operating normally. All content is also cached locally for seamless transition.'
                : 'Operating in offline resilience mode. You have complete uninterrupted access to all legal clauses, statutory retention tables, and privacy contact records.'}
            </p>
          </div>

          {/* Offline Cache Guarantees List */}
          <div className="mt-3 space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Client-Side Cache Resilience</span>
              <span className="text-[#1455C0] dark:text-[#5B95FF] font-mono text-[10px]">100% Ready</span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>25 Legal Sections & NDPA Schedule</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Interactive Rights Request Drafter</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Multilingual Dictionaries (EN, FR, PT, ES)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>DPO Emergency Verification & Phone</span>
              </div>
            </div>
          </div>

          {/* Pan-African Network Edge Info */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Database className="w-3 h-3 text-slate-400" />
              <span>Edge: Lagos / Global CDN</span>
            </div>
            <span>Sync: {lastSyncTime}</span>
          </div>

          {/* Offline Simulation Toggle (For Testing / Review) */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={toggleSimulation}
              className={`w-full py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors border ${
                isSimulatedOffline
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulatedOffline ? 'text-amber-600 dark:text-amber-400' : ''}`} />
              <span>
                {isSimulatedOffline
                  ? 'Disable Simulation (Return to Live)'
                  : t('connection.simulateOffline', 'Simulate Offline Mode')}
              </span>
            </button>
            <p className="mt-1.5 text-[10px] text-center text-slate-400 dark:text-slate-500">
              Allows testing offline UI indicators without disconnecting your device.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
