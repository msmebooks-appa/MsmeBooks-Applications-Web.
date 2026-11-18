import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface ConnectionContextType {
  isOnline: boolean;
  isRealOnline: boolean;
  isSimulatedOffline: boolean;
  toggleSimulatedOffline: () => void;
  setSimulatedOffline: (simulated: boolean) => void;
  lastSyncTime: Date;
  isChecking: boolean;
  checkConnection: () => Promise<boolean>;
  justReconnected: boolean;
  dismissBanner: () => void;
  showBanner: boolean;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

const STORAGE_SIMULATE_KEY = 'msmebooks_simulated_offline';

export const ConnectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRealOnline, setIsRealOnline] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem(STORAGE_SIMULATE_KEY) === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });

  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [justReconnected, setJustReconnected] = useState<boolean>(false);
  const [bannerDismissed, setBannerDismissed] = useState<boolean>(false);

  // Effective online state
  const isOnline = isRealOnline && !isSimulatedOffline;

  // Track window online/offline events
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      setIsRealOnline(true);
      setLastSyncTime(new Date());
      setBannerDismissed(false);
      if (!isSimulatedOffline) {
        setJustReconnected(true);
        setTimeout(() => setJustReconnected(false), 4500);
      }
    };

    const handleOffline = () => {
      setIsRealOnline(false);
      setJustReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isSimulatedOffline]);

  const toggleSimulatedOffline = useCallback(() => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      try {
        if (next) {
          sessionStorage.setItem(STORAGE_SIMULATE_KEY, 'true');
        } else {
          sessionStorage.removeItem(STORAGE_SIMULATE_KEY);
        }
      } catch {
        // ignore
      }

      if (!next && isRealOnline) {
        setLastSyncTime(new Date());
        setJustReconnected(true);
        setTimeout(() => setJustReconnected(false), 4000);
      }
      return next;
    });
  }, [isRealOnline]);

  const setSimulatedOffline = useCallback((simulated: boolean) => {
    setIsSimulatedOffline(simulated);
    try {
      if (simulated) {
        sessionStorage.setItem(STORAGE_SIMULATE_KEY, 'true');
      } else {
        sessionStorage.removeItem(STORAGE_SIMULATE_KEY);
      }
    } catch {
      // ignore
    }

    if (!simulated && isRealOnline) {
      setLastSyncTime(new Date());
      setJustReconnected(true);
      setTimeout(() => setJustReconnected(false), 4000);
    }
  }, [isRealOnline]);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    try {
      // Attempt lightweight head fetch to current domain with cache-busting
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      
      const response = await fetch(`/favicon.ico?_t=${Date.now()}`, {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const success = response.ok || response.status === 304 || response.type === 'opaque';
      setIsRealOnline(success);
      if (success) {
        setLastSyncTime(new Date());
        if (isSimulatedOffline) {
          // Keep simulated offline as active unless user explicitly turned it off
        } else {
          setJustReconnected(true);
          setTimeout(() => setJustReconnected(false), 4000);
        }
      }
      setIsChecking(false);
      return success;
    } catch {
      // If simulated offline is false, update real online to false
      if (!isSimulatedOffline) {
        setIsRealOnline(false);
      }
      setIsChecking(false);
      return false;
    }
  }, [isSimulatedOffline]);

  const dismissBanner = useCallback(() => {
    setBannerDismissed(true);
  }, []);

  const showBanner = !isOnline && !bannerDismissed;

  return (
    <ConnectionContext.Provider
      value={{
        isOnline,
        isRealOnline,
        isSimulatedOffline,
        toggleSimulatedOffline,
        setSimulatedOffline,
        lastSyncTime,
        isChecking,
        checkConnection,
        justReconnected,
        dismissBanner,
        showBanner
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
