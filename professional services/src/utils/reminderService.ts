import { BookingRecord } from '../types/booking';
import { addAppNotification } from './notificationService';

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
};

export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) return 'denied';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (e) {
    console.error('Failed to request notification permission:', e);
    return 'denied';
  }
};

/**
 * Sends a message payload to the active Service Worker
 */
export const postServiceWorkerMessage = async (message: any): Promise<boolean> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;

  try {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message);
      return true;
    }
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      registration.active.postMessage(message);
      return true;
    }
  } catch (err) {
    console.warn('Failed to post message to Service Worker:', err);
  }
  return false;
};

/**
 * Triggers a browser push alert when a firm accepts a client booking request
 */
export const triggerBookingAcceptedNotification = async (payload: {
  bookingId?: string;
  reference?: string;
  serviceTitle: string;
  providerName: string;
  appointmentDate?: string;
  timeSlot?: string;
  clientName?: string;
}): Promise<boolean> => {
  const notifTitle = `🎉 Booking Request Accepted: ${payload.serviceTitle}`;
  const notifBody = `${payload.providerName} has accepted your consultation scheduled for ${payload.appointmentDate || 'upcoming session'}${payload.timeSlot ? ` at ${payload.timeSlot}` : ''}. Reference: ${payload.reference || payload.bookingId || 'MSME-BK'}.`;

  // 1. Send to Service Worker via message channel
  await postServiceWorkerMessage({
    type: 'BOOKING_ACCEPTED',
    ...payload,
    title: notifTitle,
    body: notifBody,
  });

  // 2. Also trigger showBookingNotification as guaranteed backup
  await showBookingNotification(notifTitle, {
    body: notifBody,
    tag: `booking-accepted-${payload.bookingId || payload.reference || Date.now()}`,
    requireInteraction: true,
    data: {
      url: window.location.origin,
      bookingId: payload.bookingId,
      reference: payload.reference,
      type: 'BOOKING_ACCEPTED',
      status: 'Confirmed & Accepted',
    },
  });

  // 3. Save to In-App Notification Center
  try {
    addAppNotification({
      type: 'booking',
      title: `Booking Accepted: ${payload.providerName}`,
      message: notifBody,
      priority: 'high',
      linkId: payload.reference || payload.bookingId,
      actionType: 'open_bookings',
      actionLabel: 'View Schedule',
      metadata: {
        providerName: payload.providerName,
        serviceTitle: payload.serviceTitle,
        reference: payload.reference,
        statusText: 'Confirmed & Accepted',
      },
    });
  } catch (e) {
    console.warn('Could not record app notification:', e);
  }

  return true;
};

/**
 * Triggers a browser push alert when a firm updates a booking request
 * (milestone advanced, consultant assigned, status updated, or notes added)
 */
export const triggerBookingStatusUpdatedNotification = async (payload: {
  bookingId?: string;
  reference?: string;
  serviceTitle: string;
  providerName: string;
  status: string;
  note?: string;
  milestoneTitle?: string;
  progressPercent?: number;
}): Promise<boolean> => {
  const notifTitle = `📋 Booking Status Update: ${payload.status}`;
  let notifBody = payload.note;
  if (!notifBody) {
    if (payload.milestoneTitle) {
      notifBody = `${payload.providerName} completed milestone "${payload.milestoneTitle}" (${payload.progressPercent || 0}% complete) for "${payload.serviceTitle}".`;
    } else {
      notifBody = `${payload.providerName} updated "${payload.serviceTitle}": Current status is now "${payload.status}".`;
    }
  }

  // 1. Post to Service Worker
  await postServiceWorkerMessage({
    type: 'BOOKING_STATUS_UPDATED',
    ...payload,
    title: notifTitle,
    body: notifBody,
  });

  // 2. Direct Service Worker notification display fallback
  await showBookingNotification(notifTitle, {
    body: notifBody,
    tag: `booking-updated-${payload.bookingId || payload.reference || Date.now()}`,
    requireInteraction: true,
    data: {
      url: window.location.origin,
      bookingId: payload.bookingId,
      reference: payload.reference,
      status: payload.status,
      type: 'BOOKING_STATUS_UPDATED',
    },
  });

  // 3. Save to In-App Notification Center
  try {
    addAppNotification({
      type: 'booking',
      title: `Booking Update: ${payload.status}`,
      message: notifBody,
      priority: 'normal',
      linkId: payload.reference || payload.bookingId,
      actionType: 'open_bookings',
      actionLabel: 'View Booking',
      metadata: {
        providerName: payload.providerName,
        serviceTitle: payload.serviceTitle,
        reference: payload.reference,
        statusText: payload.status,
      },
    });
  } catch (e) {
    console.warn('Could not record app notification:', e);
  }

  return true;
};

/**
 * Dispatch notification through Service Worker registration if active,
 * or fallback to browser Notification constructor.
 */
export const showBookingNotification = async (
  title: string,
  options: NotificationOptions
) => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration && 'showNotification' in registration) {
      await (registration as any).showNotification(title, {
        icon: '/icon.svg',
        badge: '/icon.svg',
        vibrate: [200, 100, 200],
        ...options,
      });
      return true;
    }
  } catch (e) {
    console.warn('Service worker showNotification failed, trying standard Notification:', e);
  }

  try {
    new Notification(title, {
      icon: '/icon.svg',
      ...options,
    });
    return true;
  } catch (e) {
    console.error('Standard notification failed:', e);
    return false;
  }
};

export const BOOKING_ALERTS_KEY = 'msmebooks_booking_alerts_enabled';
export const REMINDED_24H_KEY = 'msmebooks_reminded_24h_booking_ids';

/**
 * Checks if 24-hour booking alerts are enabled in settings (defaults to true)
 */
export const isBookingAlertsEnabled = (): boolean => {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(BOOKING_ALERTS_KEY);
  return stored !== null ? stored === 'true' : true;
};

/**
 * Persists the booking alerts toggle state
 */
export const setBookingAlertsEnabled = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BOOKING_ALERTS_KEY, enabled ? 'true' : 'false');
};

/**
 * Parses appointment date and time slot into a JavaScript Date object
 */
export const parseAppointmentDateTime = (dateStr: string, timeStr?: string): Date | null => {
  if (!dateStr) return null;
  const combined = timeStr ? `${dateStr} ${timeStr}` : dateStr;
  const directParsed = Date.parse(combined);
  if (!isNaN(directParsed)) {
    return new Date(directParsed);
  }

  // Handle formats like "Thursday, Nov 12" without year
  const currentYear = new Date().getFullYear();
  const withYear = `${dateStr}, ${currentYear} ${timeStr || '10:00 AM'}`;
  const withYearParsed = Date.parse(withYear);
  if (!isNaN(withYearParsed)) {
    return new Date(withYearParsed);
  }

  return null;
};

/**
 * Triggers a 24-hour pre-appointment reminder notification via Service Worker / Push / Local Notification
 */
export const trigger24HourReminderNotification = async (customBooking?: Partial<BookingRecord>): Promise<boolean> => {
  const serviceName = customBooking?.serviceTitle || 'SME Business Planning & Advisory';
  const provider = customBooking?.providerName || 'Cedar Professional Services Limited';
  const apptDate = customBooking?.appointmentDate || 'Tomorrow';
  const timeSlot = customBooking?.timeSlot || '10:00 AM';
  const reference = customBooking?.reference || 'MSME-BK-9182';

  const title = `⏰ 24-Hour Booking Alert: ${serviceName}`;
  const body = `Your appointment with ${provider} is scheduled in 24 hours on ${apptDate} at ${timeSlot} (Ref: ${reference}). Tap to review documents or contact your advisor.`;

  // 1. Post to Service Worker
  await postServiceWorkerMessage({
    type: 'TEST_24H_REMINDER',
    serviceTitle: serviceName,
    providerName: provider,
    appointmentDate: apptDate,
    timeSlot: timeSlot,
    reference: reference,
    bookingId: customBooking?.id
  });

  // 2. Direct Service Worker notification display fallback
  const delivered = await showBookingNotification(title, {
    body,
    tag: `reminder-24h-${customBooking?.id || reference || Date.now()}`,
    requireInteraction: true,
    data: {
      url: window.location.origin,
      bookingId: customBooking?.id,
      reference,
      type: '24H_APPOINTMENT_REMINDER',
    },
  });

  // 3. Log into in-app notification center
  try {
    addAppNotification({
      type: 'booking',
      title: `Upcoming Appointment in 24 Hours`,
      message: `${serviceName} with ${provider} is scheduled for ${apptDate} at ${timeSlot}.`,
      priority: 'high',
      linkId: reference || customBooking?.id,
      actionType: 'open_bookings',
      actionLabel: 'View Schedule',
      metadata: {
        providerName: provider,
        serviceTitle: serviceName,
        reference,
        statusText: 'Scheduled in 24h',
      },
    });
  } catch (e) {
    console.warn('Could not record app notification:', e);
  }

  return delivered;
};

/**
 * Triggers a test 1-hour consultation reminder for demonstration and verification
 */
export const triggerTestReminderNotification = async (customBooking?: Partial<BookingRecord>) => {
  const serviceName = customBooking?.serviceTitle || 'Statutory Tax Filing & Withholding Tax';
  const provider = customBooking?.providerName || 'Cedar Professional Services Limited';

  const success = await showBookingNotification('⏰ Reminder: Consultation in 1 Hour!', {
    body: `Your scheduled session for "${serviceName}" with ${provider} begins in 1 hour. Click to access meeting details.`,
    tag: 'msmebooks-reminder-test',
    requireInteraction: true,
    data: {
      url: window.location.origin,
      type: 'CONSULTATION_REMINDER',
    },
  });

  return success;
};

/**
 * Evaluates stored bookings and notifies if an appointment is ~1 hour away
 */
export const checkUpcomingBookingReminders = async () => {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  try {
    const raw = localStorage.getItem('msmebooks_client_bookings');
    if (!raw) return;
    const bookings: BookingRecord[] = JSON.parse(raw);
    const now = new Date();

    const remindedKey = 'msmebooks_reminded_booking_ids';
    const remindedIds: string[] = JSON.parse(localStorage.getItem(remindedKey) || '[]');

    for (const b of bookings) {
      if (b.status === 'Completed' || remindedIds.includes(b.id)) {
        continue;
      }

      // Try parsing date and time
      const dateStr = b.appointmentDate;
      const timeStr = b.timeSlot;

      const apptDate = parseAppointmentDateTime(dateStr, timeStr);
      if (apptDate) {
        const diffMs = apptDate.getTime() - now.getTime();
        const diffMinutes = Math.floor(diffMs / (1000 * 60));

        // Trigger reminder if appointment is between 45 and 65 minutes away
        if (diffMinutes >= 45 && diffMinutes <= 65) {
          await showBookingNotification(`⏰ Consultation in 1 Hour: ${b.serviceTitle}`, {
            body: `With ${b.providerName} scheduled today at ${b.timeSlot}. Tap to review details or join WhatsApp.`,
            tag: `reminder-${b.id}`,
            requireInteraction: true,
            data: { bookingId: b.id },
          });

          remindedIds.push(b.id);
          localStorage.setItem(remindedKey, JSON.stringify(remindedIds));
        }
      }
    }
  } catch (err) {
    console.error('Error checking booking reminders:', err);
  }
};

/**
 * Evaluates stored bookings and notifies users 24 hours before their service appointments
 */
export const check24HourBookingReminders = async () => {
  if (!isBookingAlertsEnabled() || !isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }

  try {
    const raw = localStorage.getItem('msmebooks_client_bookings');
    if (!raw) return;
    const bookings: BookingRecord[] = JSON.parse(raw);
    const now = new Date();

    const remindedIds: string[] = JSON.parse(localStorage.getItem(REMINDED_24H_KEY) || '[]');

    for (const b of bookings) {
      if (b.status === 'Completed' || remindedIds.includes(b.id)) {
        continue;
      }

      const apptDate = parseAppointmentDateTime(b.appointmentDate, b.timeSlot);
      if (apptDate) {
        const diffMs = apptDate.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        // Remind when appointment is within the 24-hour window (between 0 and 26 hours away)
        if (diffHours > 0 && diffHours <= 26) {
          await trigger24HourReminderNotification(b);
          remindedIds.push(b.id);
          localStorage.setItem(REMINDED_24H_KEY, JSON.stringify(remindedIds));
        }
      }
    }
  } catch (err) {
    console.error('Error checking 24-hour booking reminders:', err);
  }
};

/**
 * Initialize automatic background polling for reminders (both 24h pre-appointment alerts & 1-hr alerts)
 */
export const initBookingReminderService = () => {
  if (typeof window === 'undefined') return;

  // Run on start
  check24HourBookingReminders();
  checkUpcomingBookingReminders();

  // Poll every 60 seconds
  const intervalId = window.setInterval(() => {
    check24HourBookingReminders();
    checkUpcomingBookingReminders();
  }, 60000);

  return () => window.clearInterval(intervalId);
};
