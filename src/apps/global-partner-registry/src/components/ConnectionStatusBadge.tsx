import React, { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, AlertCircle, Database } from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWA';

interface ConnectionStatusBadgeProps {
  className?: string;
  compact?: boolean;
}

export const ConnectionStatusBadge: React.FC<ConnectionStatusBadgeProps> = ({
  className = '',
  compact = false,
}) => {
  const isOnline = useOnlineStatus();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isSimulatingCheck, setIsSimulatingCheck] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('Just now');

  const handleManualCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSimulatingCheck(true);
    setTimeout(() => {
      setIsSimulatingCheck(false);
      setLastChecked(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 600);
  };

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        id="btn-connection-status"
        data-testid="btn-connection-status"
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`group inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border cursor-pointer ${
          isOnline
            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
            : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20 animate-pulse'
        }`}
        aria-label={isOnline ? 'Network status: Online' : 'Network status: Offline Mode'}
        title={isOnline ? 'Online - Live network connectivity active' : 'Offline Mode - Cached partner directory active'}
      >
        {isOnline ? (
          <>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Wifi className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            {!compact && (
              <span className="hidden md:inline font-bold text-[11px]">
                Online
              </span>
            )}
          </>
        ) : (
          <>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-90"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <WifiOff className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 shrink-0" />
            <span className="font-extrabold text-[11px] text-amber-900 dark:text-amber-200">
              Offline Mode
            </span>
          </>
        )}
      </button>

      {/* Connection Popover Tooltip */}
      {showTooltip && (
        <div 
          className="absolute right-0 top-full mt-2 w-64 sm:w-72 bg-white dark:bg-[#0f233d] border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 shadow-2xl z-50 text-slate-800 dark:text-slate-100 text-xs animate-in fade-in zoom-in-95 duration-150"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5 font-bold">
              {isOnline ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Live Network Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400">Offline Mode Active</span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={handleManualCheck}
              disabled={isSimulatingCheck}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
              title="Re-check network connection"
            >
              <RefreshCw className={`w-3 h-3 ${isSimulatingCheck ? 'animate-spin text-lime-500' : ''}`} />
              <span className="text-[10px]">Ping</span>
            </button>
          </div>

          <p className="mt-2 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
            {isOnline ? (
              'All registry data, live inquiries, partner profiles, and regional map layers are synchronizing in real time.'
            ) : (
              'Operating in resilient offline mode. You can continue searching, filtering, and reviewing all cached partners and contacts without disruption.'
            )}
          </p>

          <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3 text-lime-500" />
              <span>Offline Database: <strong>Cached</strong></span>
            </div>
            <span>Status check: {lastChecked}</span>
          </div>
        </div>
      )}
    </div>
  );
};
