import { AppNotification, NotificationCategory } from '../types/notification';

const STORAGE_KEY = 'msmebooks_notifications';
const EVENT_NAME = 'msmebooks_notifications_changed';

// Generate ISO timestamps relative to now
const getRelativeIso = (minutesAgo: number): string => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - minutesAgo);
  return d.toISOString();
};

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-expert-1',
    type: 'expert',
    title: 'New Expert Response',
    message: 'Engr. Tunde from Apex Cloud Systems replied: "We have pre-configured the barcode scanners and POS thermal drivers. See you on-site tomorrow at 10:00 AM."',
    timestamp: getRelativeIso(8),
    read: false,
    linkId: 'firm-apex',
    actionType: 'open_whatsapp',
    actionLabel: 'Chat with Expert',
    priority: 'high',
    metadata: {
      providerName: 'Apex Cloud Systems & Implementations',
      providerId: 'firm-apex',
      serviceTitle: 'POS Hardware & Software Setup',
    },
  },
  {
    id: 'notif-pay-1',
    type: 'payment',
    title: 'Payment Confirmed via Paystack',
    message: 'Payment of ₦95,000 for Invoice #INV-9182 was received successfully. 7.5% VAT receipt generated.',
    timestamp: getRelativeIso(32),
    read: false,
    linkId: 'MSME-BK-9182',
    actionType: 'open_bookings',
    actionLabel: 'View Receipt',
    priority: 'normal',
    metadata: {
      amount: '₦95,000',
      gateway: 'Paystack',
      reference: 'MSME-BK-9182',
      statusText: 'Paid',
    },
  },
  {
    id: 'notif-bkg-1',
    type: 'booking',
    title: 'Upcoming Consultation Tomorrow',
    message: 'Reminder: Your On-site Business Visit with Apex Cloud Systems is scheduled for tomorrow at 10:00 AM - 12:00 PM.',
    timestamp: getRelativeIso(75),
    read: false,
    linkId: 'MSME-BK-9182',
    actionType: 'open_bookings',
    actionLabel: 'View Booking Details',
    priority: 'high',
    metadata: {
      providerName: 'Apex Cloud Systems & Implementations',
      date: 'Tomorrow',
      timeSlot: '10:00 AM - 12:00 PM',
      reference: 'MSME-BK-9182',
    },
  },
  {
    id: 'notif-expert-2',
    type: 'expert',
    title: 'Tax Advisory Note Received',
    message: 'Senior Tax Partner Chioma Nwosu from Cedar Professional Services posted notes on your capital allowance computation.',
    timestamp: getRelativeIso(240),
    read: true,
    linkId: 'firm-cedar',
    actionType: 'open_whatsapp',
    actionLabel: 'Open Expert Chat',
    priority: 'normal',
    metadata: {
      providerName: 'Cedar Professional Services Limited',
      providerId: 'firm-cedar',
      serviceTitle: 'Corporate Tax Advisory',
    },
  },
  {
    id: 'notif-pay-2',
    type: 'payment',
    title: 'M-Pesa Payment Received',
    message: 'Payment confirmation for $125.00 via M-Pesa (Ref: MP-77291) confirmed by financial settlement gateway.',
    timestamp: getRelativeIso(720),
    read: true,
    linkId: 'MSME-BK-4029',
    actionType: 'open_bookings',
    actionLabel: 'Download Invoice',
    priority: 'normal',
    metadata: {
      amount: '$125.00',
      gateway: 'M-Pesa',
      reference: 'MSME-BK-4029',
    },
  },
  {
    id: 'notif-bkg-2',
    type: 'booking',
    title: 'Booking Confirmed by Partner',
    message: 'Cedar Professional Services has confirmed your Online Consultation appointment for Corporate Tax Advisory.',
    timestamp: getRelativeIso(1440),
    read: true,
    linkId: 'MSME-BK-4029',
    actionType: 'open_bookings',
    actionLabel: 'Check Status',
    priority: 'normal',
    metadata: {
      providerName: 'Cedar Professional Services Limited',
      reference: 'MSME-BK-4029',
      statusText: 'Confirmed',
    },
  },
];

/**
 * Get all notifications from localStorage or seed initial data
 */
export const getStoredNotifications = (): AppNotification[] => {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
      return INITIAL_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_NOTIFICATIONS;
  } catch (err) {
    console.error('Failed to parse notifications:', err);
    return INITIAL_NOTIFICATIONS;
  }
};

/**
 * Save notifications list and trigger update event
 */
export const saveNotifications = (notifications: AppNotification[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { count: notifications.length } }));
  } catch (err) {
    console.error('Failed to save notifications:', err);
  }
};

/**
 * Add a new notification to the top of the list
 */
export const addAppNotification = (
  notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'> & {
    id?: string;
    timestamp?: string;
    read?: boolean;
  }
): AppNotification => {
  const current = getStoredNotifications();
  const newNotif: AppNotification = {
    id: notification.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: notification.timestamp || new Date().toISOString(),
    read: notification.read ?? false,
    ...notification,
  };

  const updated = [newNotif, ...current.filter(n => n.id !== newNotif.id)];
  saveNotifications(updated);
  return newNotif;
};

/**
 * Mark a single notification as read
 */
export const markNotificationAsRead = (id: string): void => {
  const current = getStoredNotifications();
  const updated = current.map(n => (n.id === id ? { ...n, read: true } : n));
  saveNotifications(updated);
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = (): void => {
  const current = getStoredNotifications();
  const updated = current.map(n => ({ ...n, read: true }));
  saveNotifications(updated);
};

/**
 * Delete a notification
 */
export const deleteNotification = (id: string): void => {
  const current = getStoredNotifications();
  const updated = current.filter(n => n.id !== id);
  saveNotifications(updated);
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = (): void => {
  saveNotifications([]);
};

/**
 * Count unread notifications
 */
export const getUnreadNotificationsCount = (): number => {
  const list = getStoredNotifications();
  return list.filter(n => !n.read).length;
};

/**
 * Format timestamp into relative display string
 */
export const formatRelativeTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin === 1) return '1 min ago';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr === 1) return '1 hour ago';
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return `${diffDay}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
};

// Simulation pool of dynamic notifications for real-time status demonstrations
const SIMULATED_UPDATES: Array<Omit<AppNotification, 'id' | 'timestamp' | 'read'>> = [
  {
    type: 'expert',
    title: 'New Expert Message: Kreston Pedabo',
    message: 'Senior Tax Auditor: "Your Q3 VAT input credit verification has been reviewed. No red flags found for filing."',
    linkId: 'firm-deloitte-partner',
    actionType: 'open_whatsapp',
    actionLabel: 'Reply to Auditor',
    priority: 'high',
    metadata: {
      providerName: 'Kreston Pedabo Advisory Partners',
      serviceTitle: 'Tax Compliance Health Check',
    },
  },
  {
    type: 'payment',
    title: 'Payment Confirmation: Flutterwave',
    message: 'Instant settlement confirmed for ₦150,000. Electronic stamp duty receipt #FLW-39824 dispatched.',
    linkId: 'MSME-BK-4029',
    actionType: 'open_bookings',
    actionLabel: 'View Invoice',
    priority: 'normal',
    metadata: {
      amount: '₦150,000',
      gateway: 'Flutterwave',
      reference: 'FLW-39824',
    },
  },
  {
    type: 'booking',
    title: 'Consultation Calendar Reminder',
    message: 'Your upcoming session with Cedar Professional Services starts in 1 hour. Zoom room link is activated.',
    linkId: 'MSME-BK-4029',
    actionType: 'open_bookings',
    actionLabel: 'Join Meeting Link',
    priority: 'high',
    metadata: {
      providerName: 'Cedar Professional Services Limited',
      timeSlot: '02:00 PM - 03:30 PM',
      reference: 'MSME-BK-4029',
    },
  },
  {
    type: 'expert',
    title: 'Firm Scope Proposal Ready',
    message: 'Deloitte Alliance Partner uploaded a comprehensive scope roadmap for your ERP migration project.',
    linkId: 'firm-apex',
    actionType: 'open_whatsapp',
    actionLabel: 'View Proposal',
    priority: 'normal',
    metadata: {
      providerName: 'Apex Cloud Systems',
      serviceTitle: 'Cloud ERP Setup',
    },
  },
  {
    type: 'payment',
    title: 'Bank Transfer Settlement Verified',
    message: 'Monnify virtual account payment of ₦185,000 confirmed for Tax Audit retainer.',
    actionType: 'open_bookings',
    actionLabel: 'View Receipt',
    priority: 'normal',
    metadata: {
      amount: '₦185,000',
      gateway: 'Monnify',
    },
  },
];

let simIndex = 0;

/**
 * Trigger a simulated real-time update
 */
export const triggerSimulatedRealtimeUpdate = (): AppNotification => {
  const template = SIMULATED_UPDATES[simIndex % SIMULATED_UPDATES.length];
  simIndex++;
  return addAppNotification(template);
};
