import React, { useState } from 'react';
import { WifiOff, RefreshCw, AlertTriangle, ShieldCheck, X, Zap } from 'lucide-react';
import { useConnectionStatus } from '../context/ConnectionContext';

export const OfflineBanner: React.FC = () => {
  const { 
    isOnline, 
    isSimulatedOffline, 
    toggleSimulateOffline, 
    recheckConnection, 
    isChecking,
    cachedSectionsCount
  } = useConnectionStatus();

  const [dismissed, setDismissed] = useState(false);

  // If online, don't show the banner; reset dismissed state so it alerts on next disconnect
  if (isOnline) {
    if (dismissed) setDismissed(false);
    return null;
  }

  // If user dismissed this instance
  if (dismissed) {
    return null;
  }

  return (
    <aside 
      aria-label="Offline Mode Active Notification"
      className="no-print bg-amber-500/15 dark:bg-amber-950/70 border-b border-amber-300 dark:border-amber-700/80 text-amber-950 dark:text-amber-100 py-2.5 px-4 transition-colors relative z-30"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        {/* Left: Icon & Message */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className="p-1 rounded-md bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 shrink-0">
            <WifiOff className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-amber-950 dark:text-amber-100">
                Offline Mode Active
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-200/90 dark:bg-amber-900/90 text-amber-900 dark:text-amber-200">
                {isSimulatedOffline ? (
                  <>
                    <Zap className="w-2.5 h-2.5 text-amber-700 dark:text-amber-300" />
                    Simulated Regional Drop
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Network Disconnected
                  </>
                )}
              </span>
            </div>
            <p className="text-[11px] text-amber-900/90 dark:text-amber-200/90 mt-0.5 leading-normal">
              Operating seamlessly from local browser cache ({cachedSectionsCount}/33 Sections available). Compliant with <strong>Section 4.2 Offline POS & Transaction Protocol</strong>.
            </p>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={() => recheckConnection()}
            disabled={isChecking}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-white dark:bg-[#0A1A2C] hover:bg-amber-50 dark:hover:bg-[#0D2238] border border-amber-300 dark:border-amber-700 rounded-md transition-colors text-amber-950 dark:text-amber-100 shadow-2xs"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin text-amber-600' : ''}`} />
            <span>{isChecking ? 'Checking...' : 'Check Connection'}</span>
          </button>

          {isSimulatedOffline && (
            <button
              onClick={() => toggleSimulateOffline()}
              className="px-2.5 py-1 text-[11px] font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors shadow-2xs"
            >
              Resume Online
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            className="p-1 text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white rounded-md transition-colors ml-1"
            title="Dismiss notification"
            aria-label="Dismiss offline notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
