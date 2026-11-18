import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, CloudCheck, AlertCircle } from 'lucide-react';

export const ConnectionStatusIndicator: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [showTooltip, setShowTooltip] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>('Just now');

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

    // Periodic check
    const interval = setInterval(() => {
      if (typeof navigator !== 'undefined') {
        setIsOnline(navigator.onLine);
      }
    }, 10000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div 
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-default select-none ${
          isOnline
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 animate-pulse'
        }`}
        role="status"
        aria-live="polite"
      >
        <span className="relative flex h-2 w-2">
          {isOnline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
        </span>
        
        {isOnline ? (
          <span className="flex items-center gap-1">
            <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Online</span>
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <WifiOff className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>Offline (Cached)</span>
          </span>
        )}
      </div>

      {showTooltip && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-52 p-2.5 bg-slate-900 text-white rounded-xl shadow-xl text-[11px] z-50 pointer-events-none border border-slate-700 animate-in fade-in duration-150">
          <div className="font-bold flex items-center gap-1.5 mb-1 text-slate-100">
            {isOnline ? (
              <>
                <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Connected to Cloud</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Operating in Offline Mode</span>
              </>
            )}
          </div>
          <p className="text-slate-300 text-[10px] leading-tight">
            {isOnline 
              ? 'Real-time booking dispatch and live consultant status are active.'
              : 'Local changes and bookings are cached and will sync once connectivity resumes.'
            }
          </p>
          <div className="mt-1.5 pt-1 border-t border-slate-800 text-[9px] text-slate-400">
            Status verified: {lastChecked}
          </div>
        </div>
      )}
    </div>
  );
};
