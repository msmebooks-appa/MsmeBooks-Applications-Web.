import React from 'react';
import { WifiOff, X, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { useConnection } from '../context/ConnectionContext';
import { useLanguage } from '../context/LanguageContext';

export const OfflineBanner: React.FC = () => {
  const { 
    showBanner, 
    dismissBanner, 
    isChecking, 
    checkConnection, 
    isSimulatedOffline, 
    toggleSimulatedOffline 
  } = useConnection();
  
  const { t } = useLanguage();

  if (!showBanner) return null;

  return (
    <aside 
      aria-label="Offline notice"
      className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white shadow-md transition-all duration-200 sticky top-18 z-30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1 rounded-md bg-white/20 text-white shrink-0">
            <WifiOff className="w-4 h-4 animate-pulse" />
          </div>
          <div className="truncate">
            <span className="font-bold mr-2 uppercase tracking-wider text-[11px] bg-black/20 px-1.5 py-0.5 rounded">
              {isSimulatedOffline ? 'Simulated Offline' : t.connection.statusOffline}
            </span>
            <span className="text-white/95 font-medium">
              {t.connection.offlineBannerText}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => checkConnection()}
            disabled={isChecking}
            className="px-2.5 py-1 rounded bg-white text-amber-900 hover:bg-amber-50 font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-xs disabled:opacity-75"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{t.connection.checkConnection}</span>
          </button>

          {isSimulatedOffline && (
            <button
              onClick={toggleSimulatedOffline}
              className="px-2.5 py-1 rounded bg-black/20 hover:bg-black/30 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              {t.connection.exitSimulation}
            </button>
          )}

          <button
            onClick={dismissBanner}
            className="p-1 text-white/80 hover:text-white rounded transition-colors cursor-pointer"
            aria-label="Dismiss offline banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
