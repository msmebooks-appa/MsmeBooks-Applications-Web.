import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface ConnectionContextType {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  effectiveOnline: boolean;
  isSyncing: boolean;
  pendingSyncCount: number;
  lastSyncedAt: Date | null;
  toggleSimulateOffline: () => void;
  setSimulatedOffline: (simulated: boolean) => void;
  triggerManualSync: () => Promise<void>;
  offlineDurationSeconds: number;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(() => new Date());
  const [offlineDurationSeconds, setOfflineDurationSeconds] = useState<number>(0);

  const effectiveOnline = isOnline && !isSimulatedOffline;

  // Listen to browser network state
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Track offline duration timer and simulate pending offline receipts if offline
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (!effectiveOnline) {
      // Start offline duration counter
      interval = setInterval(() => {
        setOfflineDurationSeconds((prev) => prev + 1);
      }, 1000);

      // In offline mode, simulated pending local records build up realistically (up to 4 items)
      const timeout = setTimeout(() => {
        setPendingSyncCount((prev) => (prev === 0 ? 2 : prev));
      }, 3000);

      return () => {
        if (interval) clearInterval(interval);
        clearTimeout(timeout);
      };
    } else {
      // Reset offline counter when online
      setOfflineDurationSeconds(0);
    }
  }, [effectiveOnline]);

  // Handle re-connection auto-sync
  const triggerManualSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    
    // Simulate background sync with local queue
    await new Promise((resolve) => setTimeout(resolve, 1400));
    
    setPendingSyncCount(0);
    setLastSyncedAt(new Date());
    setIsSyncing(false);
  }, [isSyncing]);

  // Trigger sync when transitioning from offline to online
  useEffect(() => {
    if (effectiveOnline && pendingSyncCount > 0) {
      triggerManualSync();
    }
  }, [effectiveOnline, pendingSyncCount, triggerManualSync]);

  const toggleSimulateOffline = useCallback(() => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      if (next) {
        setPendingSyncCount(3); // simulate 3 local POS receipts saved locally
      }
      return next;
    });
  }, []);

  const setSimulatedOffline = useCallback((val: boolean) => {
    setIsSimulatedOffline(val);
    if (val) {
      setPendingSyncCount(3);
    }
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        isOnline,
        isSimulatedOffline,
        effectiveOnline,
        isSyncing,
        pendingSyncCount,
        lastSyncedAt,
        toggleSimulateOffline,
        setSimulatedOffline,
        triggerManualSync,
        offlineDurationSeconds,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = (): ConnectionContextType => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};
