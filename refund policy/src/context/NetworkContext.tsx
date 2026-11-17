import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RefundRequest } from '../types/policy';

interface NetworkContextType {
  isOnline: boolean;
  isRealOnline: boolean;
  isSimulatedOffline: boolean;
  queuedRequests: RefundRequest[];
  queuedCount: number;
  syncStatus: 'idle' | 'syncing' | 'synced';
  lastStatusChange: Date;
  toggleSimulateOffline: () => void;
  setSimulateOffline: (val: boolean) => void;
  queueOfflineRequest: (request: RefundRequest) => void;
  syncQueuedRequests: () => Promise<RefundRequest[]>;
  testConnection: () => Promise<boolean>;
  onSyncCallbacks: React.MutableRefObject<((syncedRequests: RefundRequest[]) => void)[]>;
  registerSyncCallback: (cb: (syncedRequests: RefundRequest[]) => void) => () => void;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const QUEUE_STORAGE_KEY = 'msmebooks_offline_refund_queue';
const SIM_STORAGE_KEY = 'msmebooks_simulate_offline';

export const NetworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRealOnline, setIsRealOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });

  const [isSimulatedOffline, setIsSimulatedOfflineState] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SIM_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [queuedRequests, setQueuedRequests] = useState<RefundRequest[]>(() => {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [lastStatusChange, setLastStatusChange] = useState<Date>(new Date());
  const syncCallbacksRef = React.useRef<((syncedRequests: RefundRequest[]) => void)[]>([]);

  const registerSyncCallback = useCallback((cb: (syncedRequests: RefundRequest[]) => void) => {
    syncCallbacksRef.current.push(cb);
    return () => {
      syncCallbacksRef.current = syncCallbacksRef.current.filter((c) => c !== cb);
    };
  }, []);

  const isOnline = isRealOnline && !isSimulatedOffline;

  // Real browser online/offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsRealOnline(true);
      setLastStatusChange(new Date());
    };

    const handleOffline = () => {
      setIsRealOnline(false);
      setLastStatusChange(new Date());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setSimulateOffline = useCallback((val: boolean) => {
    setIsSimulatedOfflineState(val);
    setLastStatusChange(new Date());
    try {
      sessionStorage.setItem(SIM_STORAGE_KEY, val ? 'true' : 'false');
    } catch {
      // Ignore sessionStorage issues
    }
  }, []);

  const toggleSimulateOffline = useCallback(() => {
    setSimulateOffline(!isSimulatedOffline);
  }, [isSimulatedOffline, setSimulateOffline]);

  // Persist queue to localStorage
  const saveQueue = (queue: RefundRequest[]) => {
    setQueuedRequests(queue);
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    } catch {
      // Ignore localStorage issues
    }
  };

  const queueOfflineRequest = useCallback((request: RefundRequest) => {
    const queuedItem: RefundRequest = {
      ...request,
      isOfflineQueued: true,
      reviewerNotes: 'Queued offline. Will sync with MsmeBooks gateway when network restores.',
    };

    setQueuedRequests((prev) => {
      const next = [queuedItem, ...prev];
      try {
        localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const syncQueuedRequests = useCallback(async (): Promise<RefundRequest[]> => {
    if (queuedRequests.length === 0) return [];

    setSyncStatus('syncing');

    // Simulate reliable sync reconciliation delay (700ms)
    await new Promise((resolve) => setTimeout(resolve, 700));

    const synced: RefundRequest[] = queuedRequests.map((req) => {
      const now = new Date();
      const timestamp = `${now.toISOString().split('T')[0]} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} WAT`;
      return {
        ...req,
        isOfflineQueued: false,
        stage: 'submitted',
        reviewerNotes: 'Offline draft successfully synced to MsmeBooks cloud gateway.',
        auditTrail: [
          ...req.auditTrail,
          {
            timestamp,
            actor: 'Offline Sync Agent',
            action: 'Cloud Synced',
            note: 'Successfully transmitted from offline local storage queue to live billing ledger.',
          },
        ],
      };
    });

    // Notify registered subscribers (such as App state)
    syncCallbacksRef.current.forEach((cb) => {
      try {
        cb(synced);
      } catch (err) {
        console.error('Error invoking sync callback', err);
      }
    });

    // Clear queue
    saveQueue([]);
    setSyncStatus('synced');

    setTimeout(() => {
      setSyncStatus('idle');
    }, 4000);

    return synced;
  }, [queuedRequests]);

  // Auto-sync when transitioning from offline to online if items exist
  useEffect(() => {
    if (isOnline && queuedRequests.length > 0 && syncStatus !== 'syncing') {
      const timer = setTimeout(() => {
        syncQueuedRequests();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, queuedRequests.length, syncStatus, syncQueuedRequests]);

  const testConnection = useCallback(async (): Promise<boolean> => {
    if (isSimulatedOffline) return false;
    try {
      // Simple lightweight check
      return typeof navigator !== 'undefined' ? navigator.onLine : true;
    } catch {
      return true;
    }
  }, [isSimulatedOffline]);

  return (
    <NetworkContext.Provider
      value={{
        isOnline,
        isRealOnline,
        isSimulatedOffline,
        queuedRequests,
        queuedCount: queuedRequests.length,
        syncStatus,
        lastStatusChange,
        toggleSimulateOffline,
        setSimulateOffline,
        queueOfflineRequest,
        syncQueuedRequests,
        testConnection,
        onSyncCallbacks: syncCallbacksRef,
        registerSyncCallback,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetworkStatus = (): NetworkContextType => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetworkStatus must be used within a NetworkProvider');
  }
  return context;
};
