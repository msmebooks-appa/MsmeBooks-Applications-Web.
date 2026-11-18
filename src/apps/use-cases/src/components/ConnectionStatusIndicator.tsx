import React, { useState, useRef, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle, 
  Database, 
  Cloud, 
  Sliders, 
  X,
  Clock,
  Sparkles
} from 'lucide-react';
import { useConnection } from '../context/ConnectionContext';
import { useLanguage } from '../context/LanguageContext';

interface ConnectionStatusIndicatorProps {
  compact?: boolean;
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  compact = false,
}) => {
  const { 
    isOnline, 
    isRealOnline, 
    isSimulatedOffline, 
    toggleSimulatedOffline, 
    lastSyncTime, 
    isChecking, 
    checkConnection,
    justReconnected
  } = useConnection();
  
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
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

  // Format time of last sync
  const formatSyncTime = (date: Date) => {
    try {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`${t.connection.statusOnline}: ${isOnline ? t.connection.statusOnline : t.connection.statusOffline}`}
        className={`group flex items-center gap-1.5 transition-all cursor-pointer rounded-lg text-xs font-semibold select-none ${
          compact
            ? 'px-2.5 py-1.5 w-full justify-between'
            : 'px-2.5 py-1.5'
        } ${
          !isOnline
            ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-xs'
            : justReconnected
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/40 ring-1 ring-emerald-400'
            : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-[#122A3F] dark:hover:bg-[#183652] text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-[#1E3A52]'
        }`}
        title={isOnline ? t.connection.onlineTooltip : t.connection.offlineTooltip}
      >
        <div className="flex items-center gap-1.5">
          {/* Status Dot with Ripple Effect */}
          <span className="relative flex h-2 w-2 shrink-0">
            {!isOnline ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
              </>
            ) : justReconnected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </>
            ) : (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40 duration-1000" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </>
            )}
          </span>

          {/* Icon */}
          {!isOnline ? (
            <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse shrink-0" />
          ) : justReconnected ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}

          {/* Label */}
          <span className={`${compact ? 'text-xs' : 'hidden 2xl:inline text-xs'} font-medium`}>
            {!isOnline
              ? t.connection.statusOffline
              : justReconnected
              ? t.connection.statusOnline
              : t.connection.statusOnline}
          </span>
        </div>

        {/* Status Pill Badge (Visible on desktop or when compact) */}
        {!isOnline && (
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-800 dark:text-amber-200 shrink-0">
            {isSimulatedOffline ? 'SIM' : 'OFF'}
          </span>
        )}

        {isOnline && !compact && (
          <span className="hidden xl:inline-block text-[10px] font-mono opacity-60">
            {isSimulatedOffline ? '' : '• Sync'}
          </span>
        )}
      </button>

      {/* Connection Status Popover Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-80 sm:w-88 z-50 bg-white dark:bg-[#0A2238] rounded-xl shadow-2xl border border-slate-200 dark:border-[#1E3E5B] overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150"
          role="dialog"
          aria-label="Connection Status Details"
        >
          {/* Header Banner */}
          <div className={`p-4 border-b ${
            !isOnline
              ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/10 border-amber-500/30'
              : 'bg-gradient-to-r from-emerald-500/15 to-[#0A3D62]/10 border-emerald-500/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  !isOnline 
                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300' 
                    : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {!isOnline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Network Resilience
                  </h4>
                  <p className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {!isOnline ? t.connection.offlineModeActive : t.connection.cloudSyncActive}
                    {isSimulatedOffline && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-normal">
                        Simulated
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3.5 text-xs">
            {/* Description Card */}
            <div className="rounded-lg p-3 bg-slate-50 dark:bg-[#07192A] border border-slate-100 dark:border-[#142F4A]">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {!isOnline ? t.connection.offlineExplanation : t.connection.onlineExplanation}
              </p>
            </div>

            {/* Offline-First Capabilities Checklist */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-[#0A3D62] dark:text-[#7CB518]" />
                Pan-African Offline Guarantee
              </span>
              <div className="grid grid-cols-1 gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>100% Case Studies & Verified Reviews cached</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Interactive ROI & Financial calculators run client-side</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500">✓</span>
                  <span>Demo requests stored safely in offline queue</span>
                </div>
              </div>
            </div>

            {/* Diagnostic Details */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#16314D] grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 dark:text-slate-400 block">Device Interface:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isRealOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  {isRealOnline ? 'Online (Ethernet/Cellular)' : 'Disconnected'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-400 block">Last Synced:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {formatSyncTime(lastSyncTime)}
                </span>
              </div>
            </div>

            {/* Actions: Reconnect Check + Simulate Offline Mode Toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-[#16314D] flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    await checkConnection();
                  }}
                  disabled={isChecking}
                  className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#122A3F] dark:hover:bg-[#1A3A56] text-slate-800 dark:text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-[#0A3D62] dark:text-[#7CB518]' : ''}`} />
                  <span>{isChecking ? 'Checking...' : t.connection.checkConnection}</span>
                </button>

                <button
                  onClick={toggleSimulatedOffline}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isSimulatedOffline
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-200 border border-amber-500/30'
                  }`}
                  title={isSimulatedOffline ? t.connection.exitSimulation : t.connection.simulateOffline}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>
                    {isSimulatedOffline ? t.connection.exitSimulation : t.connection.simulateOffline}
                  </span>
                </button>
              </div>

              {isSimulatedOffline && (
                <p className="text-[10px] text-amber-600 dark:text-amber-300 italic text-center">
                  Simulation mode is currently active for QA and testing offline resilience.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
