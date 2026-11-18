import { useState, useEffect, useCallback } from 'react';

export interface QueuedItem {
  id: string;
  type: 'sale' | 'invoice' | 'expense' | 'inventory';
  title: string;
  amount?: string;
  timestamp: string;
}

export function useConnectionStatus() {
  const [isRealOnline, setIsRealOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [justReconnected, setJustReconnected] = useState<boolean>(false);

  // Sample queue of items saved locally during offline operation
  const [queuedItems, setQueuedItems] = useState<QueuedItem[]>([
    {
      id: 'tx-101',
      type: 'sale',
      title: 'POS Sale #8492 - 2x Palm Oil 5L',
      amount: '₦29,000',
      timestamp: '2 mins ago',
    },
    {
      id: 'tx-102',
      type: 'invoice',
      title: 'Draft Invoice #INV-2026-88 to Lekki Provisions',
      amount: '₦145,000',
      timestamp: '6 mins ago',
    },
    {
      id: 'tx-103',
      type: 'inventory',
      title: 'Stock Adjustment: Ikeja Warehouse (-4 units)',
      timestamp: '11 mins ago',
    },
  ]);

  // Real browser online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsRealOnline(true);
      triggerSyncTransition();
    };

    const handleOffline = () => {
      setIsRealOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSyncTransition = useCallback(() => {
    setIsSyncing(true);
    setJustReconnected(true);
    const timer = setTimeout(() => {
      setIsSyncing(false);
      setLastSyncedTime('Just now');
      const resetBanner = setTimeout(() => {
        setJustReconnected(false);
      }, 4000);
      return () => clearTimeout(resetBanner);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const toggleSimulatedOffline = useCallback(() => {
    setIsSimulatedOffline((prev) => {
      const willBeOffline = !prev;
      if (!willBeOffline) {
        // Going back online -> trigger sync
        triggerSyncTransition();
      }
      return willBeOffline;
    });
  }, [triggerSyncTransition]);

  const setOfflineMode = useCallback((offline: boolean) => {
    setIsSimulatedOffline(offline);
    if (!offline) {
      triggerSyncTransition();
    }
  }, [triggerSyncTransition]);

  const forceSyncNow = useCallback(() => {
    if (!isRealOnline && isSimulatedOffline) {
      // Cannot sync while simulated offline
      setIsSimulatedOffline(false);
    }
    triggerSyncTransition();
  }, [isRealOnline, isSimulatedOffline, triggerSyncTransition]);

  const isEffectiveOnline = isRealOnline && !isSimulatedOffline;

  return {
    isOnline: isEffectiveOnline,
    isRealOnline,
    isSimulatedOffline,
    isSyncing,
    justReconnected,
    lastSyncedTime,
    queuedItems,
    pendingSyncCount: isEffectiveOnline ? 0 : queuedItems.length,
    toggleSimulatedOffline,
    setOfflineMode,
    forceSyncNow,
  };
}
