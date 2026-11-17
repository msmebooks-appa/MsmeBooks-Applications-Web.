import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, X, Database, CloudUpload } from 'lucide-react';
import { useConnection } from '../context/ConnectionContext';

export const OfflineBanner: React.FC = () => {
  const {
    isOnline,
    isSyncing,
    syncStatus,
    syncCount,
    isSimulatedOffline,
    triggerManualSync,
  } = useConnection();
  const [isDismissed, setIsDismissed] = useState(false);

  // Reset dismissal whenever the app goes offline again or enters pending_sync
  useEffect(() => {
    if (!isOnline || syncStatus === 'pending_sync') {
      setIsDismissed(false);
    }
  }, [isOnline, syncStatus]);

  // Show banner when offline OR when back online with unsynced offline records awaiting manual sync
  const shouldShow = (!isOnline || syncStatus === 'pending_sync') && !isDismissed;
  if (!shouldShow) {
    return null;
  }

  const isBackOnlinePending = isOnline && syncStatus === 'pending_sync';

  return (
    <div
      className={`border-b px-4 py-2.5 text-xs transition-colors duration-200 ${
        isBackOnlinePending
          ? 'bg-blue-50 dark:bg-blue-950/90 border-blue-200 dark:border-blue-800 text-slate-800 dark:text-blue-100'
          : 'bg-amber-50 dark:bg-amber-950/90 border-amber-300/80 dark:border-amber-800 text-amber-950 dark:text-amber-200'
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-1.5 rounded-md shrink-0 ${
              isBackOnlinePending
                ? 'bg-blue-100 dark:bg-blue-900 text-[#0A4FD5] dark:text-blue-300'
                : 'bg-amber-500/20 dark:bg-amber-800/50 text-amber-800 dark:text-amber-300'
            }`}
          >
            {isBackOnlinePending ? (
              <CloudUpload className="w-4 h-4" />
            ) : (
              <WifiOff className="w-4 h-4" />
            )}
          </div>
          <div>
            <span className="font-extrabold uppercase tracking-wide mr-1.5">
              {isBackOnlinePending ? 'Back Online:' : 'Offline Mode Active:'}
            </span>
            <span>
              {isBackOnlinePending
                ? `Connection restored with ${syncCount} locally cached record${syncCount === 1 ? '' : 's'} ready to upload.`
                : 'No internet connection detected. MsmeBooks is preserving your changes in offline storage.'}
            </span>
            {syncCount > 0 && !isBackOnlinePending && (
              <span className="ml-2 inline-flex items-center gap-1 font-semibold text-amber-900 dark:text-amber-100 tabular-nums">
                <Database className="w-3 h-3" />
                {syncCount} queued
              </span>
            )}
            {isSimulatedOffline && (
              <span className="ml-1.5 text-[10px] opacity-75 italic">
                (Simulated preview)
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            type="button"
            onClick={triggerManualSync}
            disabled={!isOnline || isSyncing}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              isBackOnlinePending
                ? 'bg-[#0A4FD5] hover:bg-[#07389B] text-white'
                : 'bg-amber-600 text-white'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>
              {!isOnline
                ? 'Waiting for Connection'
                : isSyncing
                ? 'Syncing...'
                : 'Sync Data Now'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 opacity-75 hover:opacity-100 rounded-md transition-opacity cursor-pointer"
            aria-label="Dismiss sync banner"
            title="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
