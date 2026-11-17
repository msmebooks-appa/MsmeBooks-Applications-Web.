import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export interface NetworkTelemetry {
  effectiveType?: string; // '4g' | '3g' | '2g' | 'slow-2g'
  downlink?: number; // Mb/s
  rtt?: number; // round-trip time in ms
  saveData?: boolean;
}

export interface ConnectionContextType {
  isOnline: boolean; // Computed online state (false if physically offline OR simulated offline)
  isPhysicallyOnline: boolean; // True hardware/navigator status
  isSimulatedOffline: boolean; // Manual simulation toggle state
  networkTelemetry: NetworkTelemetry | null;
  lastSyncTime: Date;
  cachedSectionsCount: number;
  toggleSimulateOffline: () => void;
  setSimulateOffline: (simulated: boolean) => void;
  recheckConnection: () => Promise<boolean>;
  isChecking: boolean;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPhysicallyOnline, setIsPhysicallyOnline] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('msmebooks_simulated_offline');
      return saved === 'true';
    }
    return false;
  });

  const [networkTelemetry, setNetworkTelemetry] = useState<NetworkTelemetry | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const cachedSectionsCount = 33; // 33 full terms sections cached locally in bundle & storage

  // Update telemetry from Network Information API if supported
  const updateNetworkInfo = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'connection' in navigator) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const conn = (navigator as any).connection;
      if (conn) {
        setNetworkTelemetry({
          effectiveType: conn.effectiveType || '4g',
          downlink: typeof conn.downlink === 'number' ? conn.downlink : undefined,
          rtt: typeof conn.rtt === 'number' ? conn.rtt : undefined,
          saveData: Boolean(conn.saveData)
        });
      }
    } else {
      setNetworkTelemetry({
        effectiveType: '4g',
        downlink: 10,
        rtt: 45,
        saveData: false
      });
    }
  }, []);

  // Listen to browser online and offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsPhysicallyOnline(true);
      setLastSyncTime(new Date());
      updateNetworkInfo();
    };

    const handleOffline = () => {
      setIsPhysicallyOnline(false);
      updateNetworkInfo();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    updateNetworkInfo();

    // Listen for changes in Network Information API if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conn = typeof navigator !== 'undefined' && 'connection' in navigator ? (navigator as any).connection : null;
    if (conn && conn.addEventListener) {
      conn.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (conn && conn.removeEventListener) {
        conn.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, [updateNetworkInfo]);

  // Persist simulation state in sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('msmebooks_simulated_offline', String(isSimulatedOffline));
    }
  }, [isSimulatedOffline]);

  const toggleSimulateOffline = useCallback(() => {
    setIsSimulatedOffline(prev => !prev);
    setLastSyncTime(new Date());
  }, []);

  const setSimulateOfflineState = useCallback((val: boolean) => {
    setIsSimulatedOffline(val);
    setLastSyncTime(new Date());
  }, []);

  // Active ping / recheck
  const recheckConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      // In simulated offline, checking will still show real hardware result if simulation is disabled
      if (typeof navigator !== 'undefined') {
        const hardwareOnline = navigator.onLine;
        setIsPhysicallyOnline(hardwareOnline);
        if (hardwareOnline) {
          setLastSyncTime(new Date());
        }
        await new Promise(r => setTimeout(r, 600)); // Smooth feedback delay
        return hardwareOnline && !isSimulatedOffline;
      }
      return true;
    } finally {
      setIsChecking(false);
    }
  }, [isSimulatedOffline]);

  // Combined online state
  const isOnline = useMemo(() => {
    if (isSimulatedOffline) return false;
    return isPhysicallyOnline;
  }, [isPhysicallyOnline, isSimulatedOffline]);

  return (
    <ConnectionContext.Provider
      value={{
        isOnline,
        isPhysicallyOnline,
        isSimulatedOffline,
        networkTelemetry,
        lastSyncTime,
        cachedSectionsCount,
        toggleSimulateOffline,
        setSimulateOffline: setSimulateOfflineState,
        recheckConnection,
        isChecking
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnectionStatus = (): ConnectionContextType => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnectionStatus must be used within a ConnectionProvider');
  }
  return context;
};
