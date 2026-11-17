import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { BookingRecord } from '../types/booking';

export const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
];

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

// In-memory token cache only (never persisted to localStorage or sessionStorage)
let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initCalendarAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure(user);
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure(null);
    }
  });
};

export const googleSignInForCalendar = async (): Promise<{
  user: User;
  accessToken: string;
}> => {
  try {
    isSigningIn = true;
    provider.setCustomParameters({ prompt: 'consent' });
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Could not obtain Google Calendar access token. Please allow calendar access.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
};

export const getCalendarAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const clearCalendarAccessToken = (): void => {
  cachedAccessToken = null;
};

export const googleCalendarSignOut = async (): Promise<void> => {
  cachedAccessToken = null;
  await auth.signOut();
};

/**
 * Parses booking appointmentDate + timeSlot range (e.g. "10:30 AM - 12:00 PM") into start & end Date
 */
function parseAppointmentRange(
  dateStr: string,
  timeSlotStr: string
): { start: Date; end: Date } {
  let year = 2026;
  let month = 10;
  let day = 15;

  if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [y, m, d] = dateStr.split('-').map(Number);
    year = y;
    month = m - 1;
    day = d;
  } else if (dateStr) {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
      year = parsed.getFullYear();
      month = parsed.getMonth();
      day = parsed.getDate();
    }
  }

  const parseClock = (clockStr: string, fallbackHour: number): { hour: number; minute: number } => {
    const match = clockStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return { hour: fallbackHour, minute: 0 };
    let h = parseInt(match[1], 10);
    const min = parseInt(match[2], 10);
    const ampm = match[3]?.toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return { hour: h, minute: min };
  };

  const parts = (timeSlotStr || '').split('-').map((p) => p.trim());
  const startClock = parseClock(parts[0] || '', 10);
  const start = new Date(year, month, day, startClock.hour, startClock.minute, 0, 0);

  let end: Date;
  if (parts[1]) {
    const endClock = parseClock(parts[1], startClock.hour + 1);
    end = new Date(year, month, day, endClock.hour, endClock.minute, 0, 0);
    if (end <= start) {
      end = new Date(start.getTime() + 60 * 60 * 1000);
    }
  } else {
    end = new Date(start.getTime() + 60 * 60 * 1000);
  }

  return { start, end };
}

export interface GoogleCalendarSyncResult {
  eventId: string;
  htmlLink: string;
  summary: string;
  startIso: string;
  endIso: string;
}

/**
 * Pushes a confirmed MsmeBooks booking directly to the user's primary Google Calendar
 */
export async function pushBookingToGoogleCalendar(
  booking: BookingRecord,
  accessToken: string
): Promise<GoogleCalendarSyncResult> {
  const { start, end } = parseAppointmentRange(booking.appointmentDate, booking.timeSlot);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Lagos';

  const summary = `MsmeBooks: ${booking.serviceTitle} (${booking.providerName})`;
  const location =
    booking.consultationMode === 'Online Consultation'
      ? 'Online Virtual Consultation (Meeting link sent via WhatsApp & Email)'
      : `${booking.city || 'Office'}, ${booking.country || 'Nigeria'}`;

  const description = [
    `Appointment Reference: ${booking.reference}`,
    `Service: ${booking.serviceTitle}`,
    `Package Scope: ${booking.packageName}`,
    `Service Fee: ${booking.packagePrice}`,
    `Assigned Provider: ${booking.providerName} (${booking.providerType})`,
    `Consultation Mode: ${booking.consultationMode}`,
    `Client: ${booking.customerName} (${booking.businessName})`,
    `Payment Status: ${booking.paymentStatus}${booking.paymentTransactionRef ? ` • Ref: ${booking.paymentTransactionRef}` : ''}`,
    booking.requirements ? `Requirements: ${booking.requirements}` : '',
    '',
    'Support Desk: +234 915 848 2622 | https://www.msmebooks.org',
  ]
    .filter(Boolean)
    .join('\n');

  const eventPayload = {
    summary,
    location,
    description,
    start: {
      dateTime: start.toISOString(),
      timeZone,
    },
    end: {
      dateTime: end.toISOString(),
      timeZone,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 1440 },
        { method: 'popup', minutes: 60 },
      ],
    },
  };

  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventPayload),
    }
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      cachedAccessToken = null;
      throw new Error('GOOGLE_CALENDAR_AUTH_EXPIRED');
    }
    const errBody = await response.json().catch(() => ({}));
    throw new Error(
      errBody?.error?.message || `Google Calendar API error (${response.status})`
    );
  }

  const created = await response.json();
  return {
    eventId: created.id,
    htmlLink: created.htmlLink || 'https://calendar.google.com',
    summary: created.summary || summary,
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}
