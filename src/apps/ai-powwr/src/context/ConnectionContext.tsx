import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface ConnectionContextType {
  isOnline: boolean;
  isRealOnline: boolean;
  isSimulatedOffline: boolean;
  isChecking: boolean;
  latencyMs: number | null;
  lastChecked: Date | null;
  lastOnlineAt: Date | null;
  offlineBannerDismissed: boolean;
  toggleSimulatedOffline: () => void;
  checkConnection: () => Promise<boolean>;
  dismissOfflineBanner: () => void;
  resetOfflineBanner: () => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRealOnline, setIsRealOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('msmebooks_simulated_offline') === 'true';
    }
    return false;
  });

  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(new Date());
  const [lastOnlineAt, setLastOnlineAt] = useState<Date | null>(new Date());
  const [offlineBannerDismissed, setOfflineBannerDismissed] = useState<boolean>(false);

  // Effective online status: must be genuinely online AND not in simulation
  const isOnline = isRealOnline && !isSimulatedOffline;

  // Real browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsRealOnline(true);
      setLastOnlineAt(new Date());
      setLastChecked(new Date());
      setOfflineBannerDismissed(false);
    };

    const handleOffline = () => {
      setIsRealOnline(false);
      setLastChecked(new Date());
      setOfflineBannerDismissed(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update lastOnlineAt when back online
  useEffect(() => {
    if (isOnline) {
      setLastOnlineAt(new Date());
    } else {
      // Re-show banner whenever transitioning to offline
      setOfflineBannerDismissed(false);
    }
  }, [isOnline]);

  const toggleSimulatedOffline = useCallback(() => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      sessionStorage.setItem('msmebooks_simulated_offline', String(next));
      setOfflineBannerDismissed(false);
      return next;
    });
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    const start = performance.now();

    // If simulating offline, reflect offline after a brief realistic test delay
    if (isSimulatedOffline) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setIsChecking(false);
      setLatencyMs(null);
      setLastChecked(new Date());
      return false;
    }

    try {
      // Fetch a fast favicon or lightweight static asset with cache busting to test true reachability
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`/index.html?ping=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const end = performance.now();
      const roundtrip = Math.round(end - start);

      const reachable = response.ok || response.status < 500;
      setIsRealOnline(reachable);
      setLatencyMs(reachable ? roundtrip : null);
      setLastChecked(new Date());
      if (reachable) {
        setLastOnlineAt(new Date());
      }
      setIsChecking(false);
      return reachable;
    } catch {
      // Offline or network error
      setIsRealOnline(false);
      setLatencyMs(null);
      setLastChecked(new Date());
      setIsChecking(false);
      return false;
    }
  }, [isSimulatedOffline]);

  const dismissOfflineBanner = useCallback(() => {
    setOfflineBannerDismissed(true);
  }, []);

  const resetOfflineBanner = useCallback(() => {
    setOfflineBannerDismissed(false);
  }, []);

  return (
    <ConnectionContext.Provider
      value={{
        isOnline,
        isRealOnline,
        isSimulatedOffline,
        isChecking,
        latencyMs,
        lastChecked,
        lastOnlineAt,
        offlineBannerDismissed,
        toggleSimulatedOffline,
        checkConnection,
        dismissOfflineBanner,
        resetOfflineBanner
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnectionStatus = () => {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnectionStatus must be used within a ConnectionProvider');
  }
  return context;
};
