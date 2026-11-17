import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type AlertType = 'low-stock' | 'invoice-payment' | 'large-order' | 'tax-deadline' | 'system';

export interface NotificationPreferences {
  enabled: boolean; // Master toggle
  lowStock: boolean;
  invoicePayment: boolean;
  largeOrder: boolean;
  taxDeadline: boolean;
  soundEnabled: boolean;
}

export interface BusinessAlert {
  id: string;
  type: AlertType;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  priority: 'critical' | 'high' | 'normal';
  data?: Record<string, any>;
}

interface NotificationContextType {
  permission: NotificationPermission;
  isSupported: boolean;
  preferences: NotificationPreferences;
  alerts: BusinessAlert[];
  unreadCount: number;
  requestPermission: () => Promise<NotificationPermission>;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  sendAlert: (alert: Omit<BusinessAlert, 'id' | 'timestamp' | 'read'>) => Promise<boolean>;
  sendLowStockAlert: (itemName: string, remaining: number, threshold: number, branch?: string) => Promise<boolean>;
  sendInvoicePaymentAlert: (invoiceNumber: string, customer: string, amount: string, method?: string) => Promise<boolean>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAlerts: () => void;
  isProfileOpen: boolean;
  openProfile: (tab?: 'profile' | 'notifications' | 'business') => void;
  closeProfile: () => void;
  profileInitialTab: 'profile' | 'notifications' | 'business';
}

const STORAGE_KEY_PREFS = 'msmebooks_notification_preferences_v1';
const STORAGE_KEY_ALERTS = 'msmebooks_business_alerts_v1';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  lowStock: true,
  invoicePayment: true,
  largeOrder: true,
  taxDeadline: true,
  soundEnabled: true,
};

// Initial realistic alerts for an African business
const INITIAL_ALERTS: BusinessAlert[] = [
  {
    id: 'alert-1',
    type: 'invoice-payment',
    title: 'New Invoice Payment Received! 💰',
    body: 'Savannah Retail Ltd just paid invoice #INV-2026-0842 via M-Pesa. Funds credited to account.',
    timestamp: new Date(Date.now() - 1000 * 60 * 14), // 14 mins ago
    read: false,
    priority: 'high',
    data: { invoiceNumber: '#INV-2026-0842', amount: '₦1,850,000', customer: 'Savannah Retail Ltd' },
  },
  {
    id: 'alert-2',
    type: 'low-stock',
    title: 'Critical Low Stock Alert ⚠️',
    body: 'Basmati Premium Rice 25kg has reached critical reorder point (2 bags remaining at Ikeja Depot).',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    read: false,
    priority: 'critical',
    data: { itemName: 'Basmati Premium Rice 25kg', remaining: 2, threshold: 15, branch: 'Ikeja Depot' },
  },
  {
    id: 'alert-3',
    type: 'invoice-payment',
    title: 'Payment Credited: Paystack POS',
    body: 'Victoria Island Branch reconciled POS settlement batch: ₦420,000 received via Paystack direct.',
    timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    read: true,
    priority: 'normal',
    data: { invoiceNumber: '#BATCH-903', amount: '₦420,000', customer: 'In-store POS batch' },
  },
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isSupported = typeof window !== 'undefined' && 'Notification' in window;

  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFS);
      if (saved) return { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) };
    } catch {
      // Fallback to defaults
    }
    return DEFAULT_PREFERENCES;
  });

  const [alerts, setAlerts] = useState<BusinessAlert[]>(() => {
    if (typeof window === 'undefined') return INITIAL_ALERTS;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALERTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((a: any) => ({ ...a, timestamp: new Date(a.timestamp) }));
      }
    } catch {
      // Fallback
    }
    return INITIAL_ALERTS;
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileInitialTab, setProfileInitialTab] = useState<'profile' | 'notifications' | 'business'>('notifications');

  // Sync preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(preferences));
    } catch {
      // Ignore
    }
  }, [preferences]);

  // Sync alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(alerts.slice(0, 30)));
    } catch {
      // Ignore
    }
  }, [alerts]);

  // Check initial permission status
  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  // Request browser permission
  const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
    if (!isSupported) return 'denied';
    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      return res;
    } catch (e) {
      console.warn('Notification permission error', e);
      return 'denied';
    }
  }, [isSupported]);

  const updatePreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
  }, []);

  // Play subtle audio chime for alert if enabled
  const playChime = useCallback(() => {
    if (!preferences.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext may be restricted by user gesture policy
    }
  }, [preferences.soundEnabled]);

  // Core sendAlert method
  const sendAlert = useCallback(
    async (alertData: Omit<BusinessAlert, 'id' | 'timestamp' | 'read'>): Promise<boolean> => {
      // Check preferences
      if (!preferences.enabled) return false;
      if (alertData.type === 'low-stock' && !preferences.lowStock) return false;
      if (alertData.type === 'invoice-payment' && !preferences.invoicePayment) return false;
      if (alertData.type === 'large-order' && !preferences.largeOrder) return false;
      if (alertData.type === 'tax-deadline' && !preferences.taxDeadline) return false;

      const newAlert: BusinessAlert = {
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date(),
        read: false,
        ...alertData,
      };

      // Add to in-app notification center
      setAlerts((prev) => [newAlert, ...prev]);
      playChime();

      // Trigger native browser notification if granted
      if (isSupported && Notification.permission === 'granted') {
        try {
          const n = new Notification(newAlert.title, {
            body: newAlert.body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: newAlert.id,
            requireInteraction: newAlert.priority === 'critical',
          });

          n.onclick = () => {
            window.focus();
            setIsProfileOpen(true);
            setProfileInitialTab('notifications');
            n.close();
          };
          return true;
        } catch (err) {
          console.warn('Native notification failed:', err);
        }
      }

      return true;
    },
    [preferences, isSupported, playChime]
  );

  // Helper for Low Stock Alert
  const sendLowStockAlert = useCallback(
    async (itemName: string, remaining: number, threshold: number, branch: string = 'Primary Depot') => {
      return sendAlert({
        type: 'low-stock',
        title: '⚠️ Low Stock Alert: ' + itemName,
        body: `${itemName} is running low at ${branch}! Only ${remaining} units remaining (Reorder threshold is ${threshold}). Immediate restock advised.`,
        priority: remaining <= 3 ? 'critical' : 'high',
        data: { itemName, remaining, threshold, branch },
      });
    },
    [sendAlert]
  );

  // Helper for Invoice Payment Alert
  const sendInvoicePaymentAlert = useCallback(
    async (invoiceNumber: string, customer: string, amount: string, method: string = 'M-Pesa / Bank Transfer') => {
      return sendAlert({
        type: 'invoice-payment',
        title: '💰 New Invoice Payment Received!',
        body: `Payment of ${amount} for invoice ${invoiceNumber} has been received from ${customer} via ${method}. Ledgers updated automatically.`,
        priority: 'high',
        data: { invoiceNumber, customer, amount, method },
      });
    },
    [sendAlert]
  );

  const markAsRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
  }, []);

  const markAllAsRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const openProfile = useCallback((tab: 'profile' | 'notifications' | 'business' = 'notifications') => {
    setProfileInitialTab(tab);
    setIsProfileOpen(true);
  }, []);

  const closeProfile = useCallback(() => {
    setIsProfileOpen(false);
  }, []);

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <NotificationContext.Provider
      value={{
        permission,
        isSupported,
        preferences,
        alerts,
        unreadCount,
        requestPermission,
        updatePreferences,
        sendAlert,
        sendLowStockAlert,
        sendInvoicePaymentAlert,
        markAsRead,
        markAllAsRead,
        clearAlerts,
        isProfileOpen,
        openProfile,
        closeProfile,
        profileInitialTab,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
