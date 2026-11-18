import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LiveAvailability } from '../types';
import { 
  getLiveAvailability, 
  getAllLiveAvailabilities, 
  syncLiveAvailability, 
  bookConsultationSlot, 
  subscribeToAvailability 
} from '../services/schedulingApi';

interface LiveSchedulingContextType {
  availabilityMap: Record<string, LiveAvailability>;
  syncPartnerAvailability: (partnerId: string) => Promise<LiveAvailability>;
  bookSlot: (partnerId: string, clientDetails?: { name?: string; service?: string }) => Promise<{
    success: boolean;
    remainingSlots: number;
    message: string;
  }>;
  getPartnerAvailability: (partnerId: string) => LiveAvailability;
  syncingPartnerIds: Set<string>;
}

const LiveSchedulingContext = createContext<LiveSchedulingContextType | undefined>(undefined);

export const LiveSchedulingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, LiveAvailability>>(() =>
    getAllLiveAvailabilities()
  );
  const [syncingPartnerIds, setSyncingPartnerIds] = useState<Set<string>>(new Set());

  // Subscribe to real-time events from the mock scheduling service
  useEffect(() => {
    const unsubscribe = subscribeToAvailability(({ partnerId, availability }) => {
      setAvailabilityMap((prev) => ({
        ...prev,
        [partnerId]: availability,
      }));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Periodic heartbeat / simulated activity: every 45s, a slight timestamp refresh
  useEffect(() => {
    const timer = setInterval(() => {
      setAvailabilityMap((prev) => ({ ...prev }));
    }, 15000); // 15s refresh for relative timestamps

    return () => clearInterval(timer);
  }, []);

  const syncPartnerAvailability = useCallback(async (partnerId: string): Promise<LiveAvailability> => {
    setSyncingPartnerIds((prev) => new Set(prev).add(partnerId));
    try {
      const updated = await syncLiveAvailability(partnerId);
      setAvailabilityMap((prev) => ({
        ...prev,
        [partnerId]: updated,
      }));
      return updated;
    } finally {
      setSyncingPartnerIds((prev) => {
        const next = new Set(prev);
        next.delete(partnerId);
        return next;
      });
    }
  }, []);

  const bookSlot = useCallback(
    async (partnerId: string, clientDetails?: { name?: string; service?: string }) => {
      const res = await bookConsultationSlot(partnerId, clientDetails);
      setAvailabilityMap((prev) => ({
        ...prev,
        [partnerId]: res.updatedAvailability,
      }));
      return {
        success: res.success,
        remainingSlots: res.updatedAvailability.availableSlotsToday,
        message: res.message,
      };
    },
    []
  );

  const getPartnerAvailability = useCallback(
    (partnerId: string): LiveAvailability => {
      return availabilityMap[partnerId] || getLiveAvailability(partnerId);
    },
    [availabilityMap]
  );

  return (
    <LiveSchedulingContext.Provider
      value={{
        availabilityMap,
        syncPartnerAvailability,
        bookSlot,
        getPartnerAvailability,
        syncingPartnerIds,
      }}
    >
      {children}
    </LiveSchedulingContext.Provider>
  );
};

export const useLiveScheduling = (): LiveSchedulingContextType => {
  const ctx = useContext(LiveSchedulingContext);
  if (!ctx) {
    // Graceful fallback if used outside provider
    return {
      availabilityMap: getAllLiveAvailabilities(),
      syncPartnerAvailability: syncLiveAvailability,
      bookSlot: async (pId, details) => {
        const res = await bookConsultationSlot(pId, details);
        return {
          success: res.success,
          remainingSlots: res.updatedAvailability.availableSlotsToday,
          message: res.message,
        };
      },
      getPartnerAvailability: getLiveAvailability,
      syncingPartnerIds: new Set(),
    };
  }
  return ctx;
};
