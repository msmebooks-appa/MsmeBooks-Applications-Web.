import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

export interface ConnectionContextType {
  isOnline: boolean;
  isRealOnline: boolean;
  isSimulatedOffline: boolean;
  latencyMs: number | null;
  lastChecked: Date | null;
  isChecking: boolean;
  reconnectedRecently: boolean;
  cachedArticlesCount: number;
  cachedGuidesCount: number;
  checkConnection: () => Promise<boolean>;
  toggleSimulatedOffline: () => void;
  setSimulatedOffline: (simulated: boolean) => void;
  dismissReconnectedBanner: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

const SIMULATED_OFFLINE_KEY = 'msmebooks_simulated_offline';

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Real browser online status
  const [isRealOnline, setIsRealOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  // Simulated offline mode (stored in sessionStorage or state)
  const [isSimulatedOffline, setIsSimulatedOfflineState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem(SIMULATED_OFFLINE_KEY) === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  const [latencyMs, setLatencyMs] = useState<number | null>(28);
  const [lastChecked, setLastChecked] = useState<Date | null>(new Date());
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [reconnectedRecently, setReconnectedRecently] = useState<boolean>(false);
  const reconnectedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Effective status
  const isOnline = isRealOnline && !isSimulatedOffline;

  // Track previous online state to trigger "Reconnected" banner
  const prevEffectiveOnlineRef = useRef<boolean>(isOnline);

  const triggerReconnectedBanner = useCallback(() => {
    setReconnectedRecently(true);
    if (reconnectedTimeoutRef.current) {
      clearTimeout(reconnectedTimeoutRef.current);
    }
    reconnectedTimeoutRef.current = setTimeout(() => {
      setReconnectedRecently(false);
    }, 5000);
  }, []);

  const dismissReconnectedBanner = useCallback(() => {
    setReconnectedRecently(false);
    if (reconnectedTimeoutRef.current) {
      clearTimeout(reconnectedTimeoutRef.current);
    }
  }, []);

  const setSimulatedOffline = useCallback((val: boolean) => {
    setIsSimulatedOfflineState(val);
    try {
      if (val) {
        sessionStorage.setItem(SIMULATED_OFFLINE_KEY, 'true');
      } else {
        sessionStorage.removeItem(SIMULATED_OFFLINE_KEY);
      }
    } catch {
      // sessionStorage failure fallback
    }
  }, []);

  const toggleSimulatedOffline = useCallback(() => {
    setSimulatedOffline(!isSimulatedOffline);
  }, [isSimulatedOffline, setSimulatedOffline]);

  // Actively test connection reachability
  const checkConnection = useCallback(async (): Promise<boolean> => {
    if (isSimulatedOffline) {
      setIsChecking(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsChecking(false);
      setLastChecked(new Date());
      setLatencyMs(null);
      return false;
    }

    setIsChecking(true);
    const start = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      
      const response = await fetch('/api/health?t=' + Date.now(), {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const elapsed = Math.round(performance.now() - start);
      if (response.ok) {
        setIsRealOnline(true);
        setLatencyMs(elapsed);
        setLastChecked(new Date());
        setIsChecking(false);
        return true;
      } else {
        throw new Error('Health check responded non-200');
      }
    } catch {
      // If server or network fails
      const fallbackOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;
      setIsRealOnline(fallbackOnline);
      setLatencyMs(null);
      setLastChecked(new Date());
      setIsChecking(false);
      return fallbackOnline;
    }
  }, [isSimulatedOffline]);

  // Browser event listeners for online and offline
  useEffect(() => {
    const handleOnline = () => {
      setIsRealOnline(true);
      checkConnection();
    };

    const handleOffline = () => {
      setIsRealOnline(false);
      setLatencyMs(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (reconnectedTimeoutRef.current) {
        clearTimeout(reconnectedTimeoutRef.current);
      }
    };
  }, [checkConnection]);

  // Monitor online transitions for reconnected toast
  useEffect(() => {
    if (!prevEffectiveOnlineRef.current && isOnline) {
      triggerReconnectedBanner();
    }
    prevEffectiveOnlineRef.current = isOnline;
  }, [isOnline, triggerReconnectedBanner]);

  // Periodic light ping every 45s when online
  useEffect(() => {
    if (!isOnline) return;
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && !isSimulatedOffline) {
        checkConnection();
      }
    }, 45000);
    return () => clearInterval(interval);
  }, [isOnline, isSimulatedOffline, checkConnection]);

  return (
    <ConnectionContext.Provider
      value={{
        isOnline,
        isRealOnline,
        isSimulatedOffline,
        latencyMs,
        lastChecked,
        isChecking,
        reconnectedRecently,
        cachedArticlesCount: 36,
        cachedGuidesCount: 8,
        checkConnection,
        toggleSimulatedOffline,
        setSimulatedOffline,
        dismissReconnectedBanner,
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
