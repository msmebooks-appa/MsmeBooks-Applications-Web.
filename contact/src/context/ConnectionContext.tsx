import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface ConnectionContextType {
  isOnline: boolean;
  isSimulated: boolean;
  pendingCount: number;
  lastSyncTime: string;
  isSyncing: boolean;
  toggleSimulation: () => void;
  resetSimulation: () => void;
  triggerManualSync: () => Promise<void>;
  incrementPendingCount: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real browser online status
  const [realOnline, setRealOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Simulation mode
  const [isSimulated, setIsSimulated] = useState<boolean>(false);
  const [simulatedOnline, setSimulatedOnline] = useState<boolean>(true);

  // Sync state & pending offline action counter
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  });

  // Effective connection status
  const isOnline = isSimulated ? simulatedOnline : realOnline;

  useEffect(() => {
    const handleOnline = () => {
      setRealOnline(true);
    };

    const handleOffline = () => {
      setRealOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // When connection transitions from offline to online, auto-sync pending records
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      setIsSyncing(true);
      const timer = setTimeout(() => {
        setPendingCount(0);
        setIsSyncing(false);
        setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOnline, pendingCount]);

  const toggleSimulation = useCallback(() => {
    setIsSimulated(true);
    setSimulatedOnline((prev) => !prev);
  }, []);

  const resetSimulation = useCallback(() => {
    setIsSimulated(false);
    setSimulatedOnline(realOnline);
  }, [realOnline]);

  const triggerManualSync = useCallback(async () => {
    if (!isOnline) return;
    setIsSyncing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPendingCount(0);
    setIsSyncing(false);
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, [isOnline]);

  const incrementPendingCount = useCallback(() => {
    setPendingCount((prev) => prev + 1);
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        isOnline,
        isSimulated,
        pendingCount,
        lastSyncTime,
        isSyncing,
        toggleSimulation,
        resetSimulation,
        triggerManualSync,
        incrementPendingCount,
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
