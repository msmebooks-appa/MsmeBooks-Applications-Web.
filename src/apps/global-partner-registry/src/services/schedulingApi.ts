import { LiveAvailability, SchedulingLiveStatus } from '../types';

/**
 * Mock Scheduling API Service
 * Simulates real-time bi-directional synchronization with external consultant
 * calendar providers (Google Workspace, Microsoft 365, Cal.com, and MsmeBooks Scheduling Engine).
 */

const CALENDAR_PROVIDERS: LiveAvailability['calendarProvider'][] = [
  'Google Calendar',
  'Microsoft 365',
  'Cal.com',
  'MsmeBooks Direct',
];

// Initial mock scheduling state repository
const initialSchedulingStore: Record<string, LiveAvailability> = {
  'p-01': {
    partnerId: 'p-01',
    isAcceptingRequests: true,
    status: 'Available Now',
    statusHeadline: 'Online & accepting instant consultation requests',
    availableSlotsToday: 3,
    nextAvailableSlot: 'Today at 2:30 PM',
    calendarProvider: 'Google Calendar',
    activeConsultantsOnline: 2,
    lastSyncedTimestamp: Date.now() - 1000 * 18, // 18s ago
    responseTimeEst: '< 15 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-02': {
    partnerId: 'p-02',
    isAcceptingRequests: true,
    status: 'Accepting Requests',
    statusHeadline: 'Calendar open for bookings this afternoon',
    availableSlotsToday: 4,
    nextAvailableSlot: 'Today at 3:15 PM',
    calendarProvider: 'Microsoft 365',
    activeConsultantsOnline: 3,
    lastSyncedTimestamp: Date.now() - 1000 * 32,
    responseTimeEst: '< 30 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-03': {
    partnerId: 'p-03',
    isAcceptingRequests: true,
    status: 'Limited Slots Today',
    statusHeadline: 'High demand: Only 1 consultation window remaining today',
    availableSlotsToday: 1,
    nextAvailableSlot: 'Today at 4:30 PM',
    calendarProvider: 'Cal.com',
    activeConsultantsOnline: 1,
    lastSyncedTimestamp: Date.now() - 1000 * 45,
    responseTimeEst: '< 45 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-04': {
    partnerId: 'p-04',
    isAcceptingRequests: false,
    status: 'Currently Booked',
    statusHeadline: 'All client slots filled for this week • Waitlist priority active',
    availableSlotsToday: 0,
    nextAvailableSlot: 'Next Monday at 10:00 AM',
    calendarProvider: 'Google Calendar',
    activeConsultantsOnline: 0,
    lastSyncedTimestamp: Date.now() - 1000 * 60,
    responseTimeEst: 'Within 24 hours',
    instantBookingSupported: false,
    consultationFeeUSD: 0,
  },
  'p-05': {
    partnerId: 'p-05',
    isAcceptingRequests: true,
    status: 'Available Now',
    statusHeadline: 'Online & accepting video discovery calls',
    availableSlotsToday: 3,
    nextAvailableSlot: 'Today at 2:00 PM',
    calendarProvider: 'Google Calendar',
    activeConsultantsOnline: 2,
    lastSyncedTimestamp: Date.now() - 1000 * 12,
    responseTimeEst: '< 20 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-06': {
    partnerId: 'p-06',
    isAcceptingRequests: true,
    status: 'Accepting Requests',
    statusHeadline: 'Enterprise team on standby for technical scoping',
    availableSlotsToday: 2,
    nextAvailableSlot: 'Today at 5:00 PM',
    calendarProvider: 'Microsoft 365',
    activeConsultantsOnline: 2,
    lastSyncedTimestamp: Date.now() - 1000 * 25,
    responseTimeEst: '< 30 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-07': {
    partnerId: 'p-07',
    isAcceptingRequests: true,
    status: 'Accepting Requests',
    statusHeadline: 'Open for French & Arabic bookkeeping consultations',
    availableSlotsToday: 3,
    nextAvailableSlot: 'Today at 3:30 PM',
    calendarProvider: 'Google Calendar',
    activeConsultantsOnline: 2,
    lastSyncedTimestamp: Date.now() - 1000 * 40,
    responseTimeEst: '< 30 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-08': {
    partnerId: 'p-08',
    isAcceptingRequests: false,
    status: 'Currently Booked',
    statusHeadline: 'Consultant fully allocated on ERP go-lives',
    availableSlotsToday: 0,
    nextAvailableSlot: 'Next Tuesday at 11:00 AM',
    calendarProvider: 'Microsoft 365',
    activeConsultantsOnline: 0,
    lastSyncedTimestamp: Date.now() - 1000 * 55,
    responseTimeEst: 'Within 24 hours',
    instantBookingSupported: false,
    consultationFeeUSD: 0,
  },
  'p-09': {
    partnerId: 'p-09',
    isAcceptingRequests: true,
    status: 'Limited Slots Today',
    statusHeadline: '2 consultation slots open for retail and wholesale scoping',
    availableSlotsToday: 2,
    nextAvailableSlot: 'Today at 4:15 PM',
    calendarProvider: 'Cal.com',
    activeConsultantsOnline: 1,
    lastSyncedTimestamp: Date.now() - 1000 * 15,
    responseTimeEst: '< 30 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-10': {
    partnerId: 'p-10',
    isAcceptingRequests: true,
    status: 'Accepting Requests',
    statusHeadline: 'Accepting new SME audit and POS setup requests',
    availableSlotsToday: 3,
    nextAvailableSlot: 'Today at 3:45 PM',
    calendarProvider: 'Google Calendar',
    activeConsultantsOnline: 2,
    lastSyncedTimestamp: Date.now() - 1000 * 30,
    responseTimeEst: '< 30 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-11': {
    partnerId: 'p-11',
    isAcceptingRequests: false,
    status: 'Currently Booked',
    statusHeadline: 'Capacity reached for current week • Waitlist priority open',
    availableSlotsToday: 0,
    nextAvailableSlot: 'Next Wednesday at 9:30 AM',
    calendarProvider: 'Cal.com',
    activeConsultantsOnline: 0,
    lastSyncedTimestamp: Date.now() - 1000 * 70,
    responseTimeEst: 'Within 24 hours',
    instantBookingSupported: false,
    consultationFeeUSD: 0,
  },
  'p-12': {
    partnerId: 'p-12',
    isAcceptingRequests: true,
    status: 'Available Now',
    statusHeadline: 'Consultants online in Douala office for immediate review',
    availableSlotsToday: 4,
    nextAvailableSlot: 'Today at 1:30 PM',
    calendarProvider: 'MsmeBooks Direct',
    activeConsultantsOnline: 2,
    lastSyncedTimestamp: Date.now() - 1000 * 8,
    responseTimeEst: '< 15 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-13': {
    partnerId: 'p-13',
    isAcceptingRequests: true,
    status: 'Accepting Requests',
    statusHeadline: 'Calendar active for supply chain advisory requests',
    availableSlotsToday: 3,
    nextAvailableSlot: 'Today at 3:00 PM',
    calendarProvider: 'Microsoft 365',
    activeConsultantsOnline: 1,
    lastSyncedTimestamp: Date.now() - 1000 * 22,
    responseTimeEst: '< 30 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-14': {
    partnerId: 'p-14',
    isAcceptingRequests: true,
    status: 'Accepting Requests',
    statusHeadline: 'Open for Copperbelt manufacturing and retail inquiries',
    availableSlotsToday: 2,
    nextAvailableSlot: 'Today at 4:00 PM',
    calendarProvider: 'Google Calendar',
    activeConsultantsOnline: 1,
    lastSyncedTimestamp: Date.now() - 1000 * 35,
    responseTimeEst: '< 30 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-15': {
    partnerId: 'p-15',
    isAcceptingRequests: true,
    status: 'Available Now',
    statusHeadline: 'Fast booking: Gaborone advisory team available today',
    availableSlotsToday: 3,
    nextAvailableSlot: 'Today at 2:15 PM',
    calendarProvider: 'MsmeBooks Direct',
    activeConsultantsOnline: 2,
    lastSyncedTimestamp: Date.now() - 1000 * 14,
    responseTimeEst: '< 20 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-16': {
    partnerId: 'p-16',
    isAcceptingRequests: false,
    status: 'Currently Booked',
    statusHeadline: 'London corridor advisors currently booked through Friday',
    availableSlotsToday: 0,
    nextAvailableSlot: 'Next Monday at 2:00 PM',
    calendarProvider: 'Microsoft 365',
    activeConsultantsOnline: 0,
    lastSyncedTimestamp: Date.now() - 1000 * 80,
    responseTimeEst: 'Within 24 hours',
    instantBookingSupported: false,
    consultationFeeUSD: 0,
  },
  'p-17': {
    partnerId: 'p-17',
    isAcceptingRequests: true,
    status: 'Accepting Requests',
    statusHeadline: 'Atlanta diaspora office taking transatlantic consultations',
    availableSlotsToday: 3,
    nextAvailableSlot: 'Today at 3:00 PM',
    calendarProvider: 'Google Calendar',
    activeConsultantsOnline: 2,
    lastSyncedTimestamp: Date.now() - 1000 * 28,
    responseTimeEst: '< 30 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-18': {
    partnerId: 'p-18',
    isAcceptingRequests: true,
    status: 'Available Now',
    statusHeadline: 'Dubai international office online with live calendar slots',
    availableSlotsToday: 4,
    nextAvailableSlot: 'Today at 2:00 PM',
    calendarProvider: 'Microsoft 365',
    activeConsultantsOnline: 3,
    lastSyncedTimestamp: Date.now() - 1000 * 10,
    responseTimeEst: '< 15 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
  'p-19': {
    partnerId: 'p-19',
    isAcceptingRequests: false,
    status: 'Currently Booked',
    statusHeadline: 'Waitlist active for Canadian diaspora enterprise accounting',
    availableSlotsToday: 0,
    nextAvailableSlot: 'Next Tuesday at 1:00 PM',
    calendarProvider: 'Google Calendar',
    activeConsultantsOnline: 0,
    lastSyncedTimestamp: Date.now() - 1000 * 65,
    responseTimeEst: 'Within 24 hours',
    instantBookingSupported: false,
    consultationFeeUSD: 0,
  },
  'p-20': {
    partnerId: 'p-20',
    isAcceptingRequests: true,
    status: 'Accepting Requests',
    statusHeadline: 'Mumbai cross-border trade desk open for booking calls',
    availableSlotsToday: 3,
    nextAvailableSlot: 'Today at 4:30 PM',
    calendarProvider: 'Cal.com',
    activeConsultantsOnline: 2,
    lastSyncedTimestamp: Date.now() - 1000 * 19,
    responseTimeEst: '< 30 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  },
};

// In-memory reactive store
let liveStore: Record<string, LiveAvailability> = { ...initialSchedulingStore };

// Pub/Sub subscribers
type SubscriberCallback = (event: {
  partnerId: string;
  availability: LiveAvailability;
  reason: 'sync' | 'booking' | 'status_change';
}) => void;

const subscribers: Set<SubscriberCallback> = new Set();

const notifySubscribers = (
  partnerId: string,
  availability: LiveAvailability,
  reason: 'sync' | 'booking' | 'status_change'
) => {
  subscribers.forEach((cb) => {
    try {
      cb({ partnerId, availability, reason });
    } catch (e) {
      console.error('Subscriber notification error', e);
    }
  });
};

/**
 * Get the current live availability for a partner.
 * Falls back to default accepting profile if partner ID is not yet seeded.
 */
export const getLiveAvailability = (partnerId: string): LiveAvailability => {
  if (liveStore[partnerId]) {
    return liveStore[partnerId];
  }

  // Fallback default
  const fallback: LiveAvailability = {
    partnerId,
    isAcceptingRequests: true,
    status: 'Accepting Requests',
    statusHeadline: 'Accepting new client consultation requests',
    availableSlotsToday: 2,
    nextAvailableSlot: 'Today at 3:00 PM',
    calendarProvider: 'Google Calendar',
    activeConsultantsOnline: 1,
    lastSyncedTimestamp: Date.now() - 1000 * 15,
    responseTimeEst: '< 30 mins',
    instantBookingSupported: true,
    consultationFeeUSD: 0,
  };

  liveStore[partnerId] = fallback;
  return fallback;
};

/**
 * Asynchronously fetch live availability with simulated network latency (150ms).
 */
export const fetchLiveAvailability = async (partnerId: string): Promise<LiveAvailability> => {
  await new Promise((resolve) => setTimeout(resolve, 150));
  return getLiveAvailability(partnerId);
};

/**
 * Triggers a real-time calendar synchronization with the consultant's external provider
 * (Google Calendar, Outlook 365, Cal.com, etc.), simulating verification latency (~380ms).
 */
export const syncLiveAvailability = async (partnerId: string): Promise<LiveAvailability> => {
  // Simulate API network handshake
  await new Promise((resolve) => setTimeout(resolve, 380));

  const current = getLiveAvailability(partnerId);
  
  // Update sync timestamp to now
  const updated: LiveAvailability = {
    ...current,
    lastSyncedTimestamp: Date.now(),
    isSyncing: false,
  };

  liveStore[partnerId] = updated;
  notifySubscribers(partnerId, updated, 'sync');
  return updated;
};

/**
 * Optimistically book / request a consultation slot in real time.
 * Decrements the available slots today and notifies all reactive subscribers.
 */
export const bookConsultationSlot = async (
  partnerId: string,
  clientDetails?: { name?: string; service?: string }
): Promise<{
  success: boolean;
  updatedAvailability: LiveAvailability;
  message: string;
}> => {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const current = getLiveAvailability(partnerId);
  const remaining = Math.max(0, current.availableSlotsToday - 1);

  let newStatus: SchedulingLiveStatus = current.status;
  let newHeadline = current.statusHeadline;

  if (remaining === 0) {
    newStatus = 'Currently Booked';
    newHeadline = 'All consultation slots booked for today • Next slot tomorrow morning';
  } else if (remaining === 1) {
    newStatus = 'Limited Slots Today';
    newHeadline = 'Only 1 consultation slot remaining today!';
  } else {
    newHeadline = `${remaining} consultation slots open today`;
  }

  const updated: LiveAvailability = {
    ...current,
    availableSlotsToday: remaining,
    isAcceptingRequests: remaining > 0,
    status: newStatus,
    statusHeadline: newHeadline,
    lastSyncedTimestamp: Date.now(),
  };

  liveStore[partnerId] = updated;
  notifySubscribers(partnerId, updated, 'booking');

  return {
    success: true,
    updatedAvailability: updated,
    message: `Consultation request synchronized with consultant calendar! ${remaining} slots remaining today.`,
  };
};

/**
 * Subscribe to real-time availability updates across cards, profile modals, and consultation workflows.
 */
export const subscribeToAvailability = (callback: SubscriberCallback): (() => void) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

/**
 * Human-readable relative time formatting (e.g., "Just now", "14s ago", "2m ago").
 */
export const formatSyncTimeAgo = (timestamp: number): string => {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 5) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  return `${diffHours}h ago`;
};

/**
 * Returns a complete snapshot of all partner live availabilities.
 */
export const getAllLiveAvailabilities = (): Record<string, LiveAvailability> => {
  return { ...liveStore };
};
