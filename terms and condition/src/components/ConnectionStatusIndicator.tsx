import React, { useState, useRef, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle,
  Radio,
  Zap,
  Info
} from 'lucide-react';
import { useConnectionStatus } from '../context/ConnectionContext';

interface ConnectionStatusIndicatorProps {
  variant?: 'navbar' | 'compact' | 'full';
  align?: 'left' | 'right';
}

export const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  variant = 'navbar',
  align = 'right'
}) => {
  const {
    isOnline,
    isPhysicallyOnline,
    isSimulatedOffline,
    networkTelemetry,
    lastSyncTime,
    cachedSectionsCount,
    toggleSimulateOffline,
    recheckConnection,
    isChecking
  } = useConnectionStatus();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Full variant (for mobile drawer or dedicated cards)
  if (variant === 'full') {
    return (
      <div className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D2238] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isOnline ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </>
              ) : (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
                </>
              )}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                {isOnline ? (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Online · Cloud Sync
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Offline Mode Active
                  </>
                )}
                {isSimulatedOffline && (
                  <span className="px-1.5 py-0.2 text-[10px] bg-amber-200 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 rounded font-mono">
                    Simulated
                  </span>
                )}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {isOnline ? 'Real-time sync active' : 'Section 4.2 local cache enabled'}
              </span>
            </div>
          </div>

          <button
            onClick={() => toggleSimulateOffline()}
            className={`px-2 py-1 text-[11px] font-semibold rounded transition-colors ${
              isSimulatedOffline
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
            }`}
          >
            {isSimulatedOffline ? 'Resume Online' : 'Simulate Offline'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/80 dark:border-slate-800/80 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Database className="w-3 h-3 text-[#0B3558] dark:text-[#84CC16]" />
            <span>Cache: <strong>{cachedSectionsCount}/33 Sections</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Sec. 4.2: <strong>Local POS Ready</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // Compact icon-only variant (for mobile top strip)
  if (variant === 'compact') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={isOnline ? 'Connection status: Online' : 'Connection status: Offline'}
          className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
            isOnline
              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
              : 'bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-200 animate-pulse'
          }`}
          title={isOnline ? 'Online - Connected to Cloud' : 'Offline Mode - Operating on Local Cache'}
        >
          {isOnline ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 p-3 bg-white dark:bg-[#0A1A2C] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                {isOnline ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Wifi className="w-3.5 h-3.5" /> Online
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <WifiOff className="w-3.5 h-3.5" /> Offline Mode
                  </span>
                )}
              </span>
              <button
                onClick={() => toggleSimulateOffline()}
                className="text-[10px] text-[#0B3558] dark:text-[#84CC16] font-semibold hover:underline"
              >
                {isSimulatedOffline ? 'End Simulation' : 'Simulate Offline'}
              </button>
            </div>
            <p className="py-2 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              {isOnline
                ? 'Connected to MsmeBooks cloud. Terms updates and revenue models synchronize seamlessly.'
                : 'Offline cache active per Section 4.2. All 33 Terms & legal features remain accessible.'}
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span>Cache: 33/33 Sections</span>
              <button
                onClick={() => recheckConnection()}
                disabled={isChecking}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 font-medium"
              >
                <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                {isChecking ? 'Checking...' : 'Re-check'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard Navbar variant
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={`Connection Status: ${isOnline ? 'Online' : 'Offline Mode'}`}
        className={`group flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 ${
          isOnline
            ? 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/50 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/40 focus-visible:outline-emerald-600'
            : 'bg-amber-100/90 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-900/60 focus-visible:outline-amber-600 ring-1 ring-amber-400/40 dark:ring-amber-500/30'
        }`}
        title={
          isOnline
            ? 'Online: Cloud sync active · Click for network details'
            : 'Offline Mode: Operating from local cache · Click for options'
        }
      >
        {/* Pulsing Dot */}
        <span className="relative flex h-2 w-2 shrink-0">
          {isOnline ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </>
          ) : (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
            </>
          )}
        </span>

        {/* Icon */}
        {isOnline ? (
          <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        ) : (
          <WifiOff className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 shrink-0" />
        )}

        {/* Label */}
        <span className="hidden md:inline font-semibold">
          {isOnline ? 'Online' : 'Offline'}
        </span>

        {/* Simulation indicator tag */}
        {isSimulatedOffline && (
          <span className="hidden lg:inline px-1 py-0.2 text-[9px] font-mono uppercase bg-amber-200/80 dark:bg-amber-900/70 text-amber-950 dark:text-amber-100 rounded">
            Sim
          </span>
        )}

        <ChevronDown 
          className={`w-3 h-3 opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div 
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-80 sm:w-88 bg-white dark:bg-[#0A1A2C] rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 p-4 animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100`}
          role="dialog"
          aria-label="Network Status Details"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg ${
                isOnline 
                  ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400' 
                  : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
              }`}>
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
              </div>
              <div>
                <h4 className="text-xs font-bold leading-tight">
                  {isOnline ? 'Network: Online' : 'Network: Offline Mode'}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {isOnline 
                    ? 'Connected to MsmeBooks Edge' 
                    : isSimulatedOffline 
                      ? 'Simulated Regional Outage' 
                      : 'Physical Connection Lost'}
                </p>
              </div>
            </div>

            <button
              onClick={() => recheckConnection()}
              disabled={isChecking}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-2"
              title="Re-check network connection"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin text-[#0B3558] dark:text-[#84CC16]' : ''}`} />
            </button>
          </div>

          {/* Status Banner */}
          <div className={`my-3 p-2.5 rounded-lg text-xs flex items-start gap-2.5 ${
            isOnline 
              ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200' 
              : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200'
          }`}>
            {isOnline ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5 text-[11px] leading-tight">
              <span className="font-semibold block">
                {isOnline 
                  ? 'Real-Time Synchronization Active' 
                  : 'Operating from Local Cache'}
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-normal">
                {isOnline
                  ? 'All terms, revenue schedules, and consent tokens are actively synced with the server.'
                  : 'As per Section 4.2 of MsmeBooks Terms, POS and invoicing functions queue locally and synchronize once reconnected.'}
              </p>
            </div>
          </div>

          {/* Diagnostics Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0D2238] border border-slate-100 dark:border-slate-800/80">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-0.5">
                <Database className="w-3 h-3 text-[#0B3558] dark:text-[#84CC16]" />
                Offline Storage
              </div>
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                {cachedSectionsCount}/33 Sections
              </div>
              <div className="text-[9px] text-emerald-600 dark:text-emerald-400 font-medium">
                100% Cached Locally
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 dark:bg-[#0D2238] border border-slate-100 dark:border-slate-800/80">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-0.5">
                <Radio className="w-3 h-3 text-[#0B3558] dark:text-[#84CC16]" />
                Connection Type
              </div>
              <div className="font-semibold text-slate-900 dark:text-slate-100 uppercase">
                {isOnline ? (networkTelemetry?.effectiveType || 'Broadband') : 'Offline'}
              </div>
              <div className="text-[9px] text-slate-500 dark:text-slate-400">
                {isOnline && networkTelemetry?.rtt ? `~${networkTelemetry.rtt}ms latency` : 'Zero latency (cache)'}
              </div>
            </div>
          </div>

          {/* Section 4.2 Legal Compliance Card */}
          <div className="p-2.5 rounded-lg bg-blue-50/60 dark:bg-[#071F36] border border-blue-100 dark:border-blue-900/50 mb-3 text-[10px] space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-[#0B3558] dark:text-[#84CC16]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Section 4.2 Legal Architecture</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              MsmeBooks is built for intermittent connectivity in regional trade hubs. All legal contracts, transaction models, and audit logs persist without live internet.
            </p>
          </div>

          {/* Simulation Toggle Control */}
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#84CC16]" />
                Simulate Offline Mode
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                Test UI under network outage
              </span>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={isSimulatedOffline}
              onClick={() => toggleSimulateOffline()}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16] ${
                isSimulatedOffline ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
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

          {/* Footer timestamp */}
          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400 dark:text-slate-500">
            <span>Last checked: {formatTime(lastSyncTime)}</span>
            <button
              onClick={() => setIsOpen(false)}
              className="font-medium hover:text-slate-700 dark:hover:text-slate-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
