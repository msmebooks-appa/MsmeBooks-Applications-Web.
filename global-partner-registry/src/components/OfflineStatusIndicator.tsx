import React from 'react';
import { WifiOff, Database } from 'lucide-react';
import { useOnlineStatus } from '../hooks/usePWA';

export const OfflineStatusIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-amber-500/95 text-slate-950 text-xs font-bold shadow-2xl backdrop-blur-md border border-amber-300 animate-in slide-in-from-bottom-4">
      <div className="w-6 h-6 rounded-lg bg-amber-600/30 flex items-center justify-center shrink-0">
        <WifiOff className="w-3.5 h-3.5 text-slate-950" />
      </div>
      <div>
        <p className="font-extrabold leading-tight">Offline Mode Active</p>
        <p className="text-[10px] text-slate-900 font-medium flex items-center gap-1">
          <Database className="w-2.5 h-2.5" />
          <span>Full partner directory cached & available</span>
        </p>
      </div>
    </div>
  );
};
