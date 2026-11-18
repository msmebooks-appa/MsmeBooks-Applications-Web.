import { useState, useEffect, useCallback } from 'react';

export interface NetworkStatus {
  isOnline: boolean;
  isSimulatedOffline: boolean;
  effectiveOnline: boolean;
  toggleSimulatedOffline: () => void;
  checkConnection: () => Promise<boolean>;
  lastCheckedAt: Date;
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });

  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('msmebooks_simulated_offline') === 'true';
    }
    return false;
  });

  const [lastCheckedAt, setLastCheckedAt] = useState<Date>(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastCheckedAt(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastCheckedAt(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleSimulatedOffline = useCallback(() => {
    setIsSimulatedOffline((prev) => {
      const next = !prev;
      localStorage.setItem('msmebooks_simulated_offline', String(next));
      setLastCheckedAt(new Date());
      return next;
    });
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setLastCheckedAt(new Date());
    if (isSimulatedOffline) {
      return false;
    }
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
      return false;
    }
    try {
      // Quick lightweight ping or HEAD request
      const res = await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-store' });
      const online = res.ok || res.status === 404; // Server responded
      setIsOnline(online);
      return online;
    } catch {
      // If network fails
      setIsOnline(false);
      return false;
    }
  }, [isSimulatedOffline]);

  const effectiveOnline = isOnline && !isSimulatedOffline;

  return {
    isOnline,
    isSimulatedOffline,
    effectiveOnline,
    toggleSimulatedOffline,
    checkConnection,
    lastCheckedAt,
  };
}
