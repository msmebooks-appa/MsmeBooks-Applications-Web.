import React, { useState } from 'react';
import { WifiOff, X, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { useNetworkStatus } from '../context/NetworkContext';
import { useLanguage } from '../context/LanguageContext';

export const OfflineBanner: React.FC = () => {
  const { isOnline, isSimulatedOffline, toggleSimulateOffline, queuedCount, testConnection } = useNetworkStatus();
  const { t } = useLanguage();
  const [dismissed, setDismissed] = useState(false);
  const [checking, setChecking] = useState(false);

  // If online or manually dismissed for this session, don't show
  if (isOnline || dismissed) {
    return null;
  }

  const handleCheck = async () => {
    setChecking(true);
    await testConnection();
    setTimeout(() => setChecking(false), 500);
  };

  return (
    <aside
      role="status"
      aria-live="polite"
      className="bg-amber-500/15 dark:bg-amber-950/60 border-b border-amber-300/80 dark:border-amber-700/60 px-4 py-2 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
          <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
            <WifiOff className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300" />
          </div>
          <p className="font-medium">
            <span className="font-bold mr-1">
              {t('connection.disconnected', 'Offline Mode Active')}:
            </span>
            {t(
              'connection.offlineAlertBanner',
              'You are viewing locally cached policy terms. Claim submissions will be saved offline.'
            )}
            {queuedCount > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 font-bold text-amber-950 dark:text-amber-100 bg-amber-200/80 dark:bg-amber-900/80 px-2 py-0.5 rounded-full">
                <Layers className="w-3 h-3" />
                {queuedCount} {t('connection.pendingSync', 'pending sync')}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {isSimulatedOffline ? (
            <button
              onClick={toggleSimulateOffline}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Exit Simulation</span>
            </button>
          ) : (
            <button
              onClick={handleCheck}
              disabled={checking}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-md transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} />
              <span>{checking ? 'Testing...' : t('connection.testReconnect', 'Check Connection')}</span>
            </button>
          )}

          <button
            onClick={() => setDismissed(true)}
            aria-label={t('connection.dismiss', 'Dismiss')}
            className="p-1 text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-amber-100 rounded hover:bg-amber-500/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
