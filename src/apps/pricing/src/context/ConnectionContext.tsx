import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type SyncStatusState = 'synced' | 'offline' | 'pending_sync' | 'syncing';

export interface SyncQueueItem {
  id: string;
  label: string;
  queuedAt: string;
}

interface ConnectionContextType {
  isOnline: boolean;
  isBrowserOnline: boolean;
  isSimulatedOffline: boolean;
  isSyncing: boolean;
  syncStatus: SyncStatusState;
  syncCount: number;
  queuedItems: SyncQueueItem[];
  lastSyncedTime: string;
  syncFeedbackMessage: string | null;
  toggleSimulation: () => void;
  triggerManualSync: () => void;
  forceSync: () => void;
  clearSyncFeedback: () => void;
}

const SYNC_QUEUE_STORAGE_KEY = 'msmebooks-sync-queue';
const LAST_SYNCED_STORAGE_KEY = 'msmebooks-last-synced';

const DEFAULT_OFFLINE_QUEUE = (): SyncQueueItem[] => {
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return [
    { id: 'q-pos-ledger', label: 'Offline POS & Cart Drafts', queuedAt: timeStr },
    { id: 'q-tax-rules', label: 'Regional Tax & Compliance Snapshot', queuedAt: timeStr },
    { id: 'q-fx-rates', label: 'Cached Multi-Currency FX Rates', queuedAt: timeStr },
  ];
};

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isBrowserOnline, setIsBrowserOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [queuedItems, setQueuedItems] = useState<SyncQueueItem[]>(() => {
    try {
      const saved = localStorage.getItem(SYNC_QUEUE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LAST_SYNCED_STORAGE_KEY);
      if (saved) return saved;
    } catch {
      // Ignore storage errors
    }
    return 'Just now';
  });
  const [syncFeedbackMessage, setSyncFeedbackMessage] = useState<string | null>(null);

  const isOnline = isBrowserOnline && !isSimulatedOffline;
  const syncCount = queuedItems.length;

  const syncStatus: SyncStatusState = !isOnline
    ? 'offline'
    : isSyncing
    ? 'syncing'
    : syncCount > 0
    ? 'pending_sync'
    : 'synced';

  // Persist queued items in localStorage so offline state survives reloads
  useEffect(() => {
    try {
      localStorage.setItem(SYNC_QUEUE_STORAGE_KEY, JSON.stringify(queuedItems));
    } catch {
      // Ignore
    }
  }, [queuedItems]);

  const executeCloudSync = useCallback((pendingCount: number) => {
    setIsSyncing(true);
    setSyncFeedbackMessage(null);

    setTimeout(() => {
      const nowTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setIsSyncing(false);
      setQueuedItems([]);
      setLastSyncedTime(nowTime);
      try {
        localStorage.setItem(LAST_SYNCED_STORAGE_KEY, nowTime);
      } catch {
        // Ignore
      }
      setSyncFeedbackMessage(
        pendingCount > 0
          ? `Synced ${pendingCount} offline record${pendingCount === 1 ? '' : 's'} at ${nowTime}`
          : `Data synced with cloud at ${nowTime}`
      );
    }, 1100);
  }, []);

  // Listen to real browser online/offline transitions
  useEffect(() => {
    const handleOnline = () => {
      setIsBrowserOnline(true);
      // When coming back online, keep any queued offline items in 'pending_sync'
      // so the user sees the "Back Online" Sync Status and can manually trigger sync
      setSyncFeedbackMessage('Connection restored. Ready to sync local data.');
    };

    const handleOffline = () => {
      setIsBrowserOnline(false);
      setQueuedItems((prev) => (prev.length > 0 ? prev : DEFAULT_OFFLINE_QUEUE()));
      setSyncFeedbackMessage('Offline mode active. Changes are queued locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // If browser initially loads while offline, populate offline queue
  useEffect(() => {
    if (!isBrowserOnline && queuedItems.length === 0) {
      setQueuedItems(DEFAULT_OFFLINE_QUEUE());
    }
  }, [isBrowserOnline, queuedItems.length]);

  const toggleSimulation = () => {
    if (isSimulatedOffline) {
      // Return back online with pending items ready for manual sync
      setIsSimulatedOffline(false);
      setSyncFeedbackMessage('Back online — click Sync Now to upload queued records.');
    } else {
      setIsSimulatedOffline(true);
      setQueuedItems((prev) => (prev.length > 0 ? prev : DEFAULT_OFFLINE_QUEUE()));
      setSyncFeedbackMessage('Offline mode simulated — transactions queued locally.');
    }
  };

  // Manual user-triggered sync (works only when back online)
  const triggerManualSync = () => {
    if (!isOnline) {
      setSyncFeedbackMessage('Offline mode: waiting for internet connection to sync.');
      return;
    }
    if (isSyncing) return;
    executeCloudSync(queuedItems.length);
  };

  // Legacy forceSync helper (restores simulated offline if needed, then syncs when online)
  const forceSync = () => {
    if (isSimulatedOffline && isBrowserOnline) {
      setIsSimulatedOffline(false);
      executeCloudSync(queuedItems.length);
      return;
    }
    triggerManualSync();
  };

  const clearSyncFeedback = () => setSyncFeedbackMessage(null);

  return (
    <ConnectionContext.Provider
      value={{
        isOnline,
        isBrowserOnline,
        isSimulatedOffline,
        isSyncing,
        syncStatus,
        syncCount,
        queuedItems,
        lastSyncedTime,
        syncFeedbackMessage,
        toggleSimulation,
        triggerManualSync,
        forceSync,
        clearSyncFeedback,
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
