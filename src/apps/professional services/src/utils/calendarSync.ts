import { BookingRecord } from '../types/booking';

/**
 * Parses appointment date and time slot into ISO Date objects
 */
function parseBookingDateTime(dateStr: string, timeSlotStr: string): { start: Date; end: Date } {
  let year = 2026;
  let month = 10; // Default November (0-indexed)
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

  let hours = 10;
  let minutes = 0;
  if (timeSlotStr) {
    const timeParts = timeSlotStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (timeParts) {
      hours = parseInt(timeParts[1], 10);
      minutes = parseInt(timeParts[2], 10);
      const ampm = timeParts[3]?.toUpperCase();

      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
    }
  }

  const startDate = new Date(year, month, day, hours, minutes, 0, 0);
  // Default duration: 1 hour consultation
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  return { start: startDate, end: endDate };
}

function formatDateToICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generates an RFC 5545 iCalendar (.ics) string
 */
export function generateICSContent(booking: BookingRecord): string {
  const { start, end } = parseBookingDateTime(booking.appointmentDate, booking.timeSlot);
  const now = formatDateToICS(new Date());
  const dtStart = formatDateToICS(start);
  const dtEnd = formatDateToICS(end);
  const uid = `booking-${booking.id || booking.reference}@msmebooks.org`;

  const summary = `MsmeBooks: ${booking.serviceTitle} with ${booking.providerName}`;
  const description = [
    `Appointment Reference: ${booking.reference}`,
    `Service Package: ${booking.packageName}`,
    `Provider: ${booking.providerName}`,
    `Engagement Mode: ${booking.consultationMode}`,
    `Client: ${booking.customerName} (${booking.businessName})`,
    `Payment Status: ${booking.paymentStatus}`,
    `Support Hotline: +234 915 848 2622 | www.msmebooks.org`,
  ].join('\\n');

  const location = booking.consultationMode === 'Online Consultation'
    ? 'Online Virtual Meeting Room (Link provided via WhatsApp/Email)'
    : `${booking.city || 'Office'}, ${booking.country || 'Nigeria'}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MsmeBooks Platform//Pan-African Professional Services//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${summary.replace(/,/g, '\\,')}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location.replace(/,/g, '\\,')}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: Upcoming MsmeBooks Consultation in 1 hour',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Triggers an immediate .ics file download in the browser
 */
export function downloadICSFile(booking: BookingRecord): void {
  const icsData = generateICSContent(booking);
  const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `msmebooks-${booking.reference || 'appointment'}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates direct Google Calendar add event link
 */
export function getGoogleCalendarUrl(booking: BookingRecord): string {
  const { start, end } = parseBookingDateTime(booking.appointmentDate, booking.timeSlot);
  const dtStart = formatDateToICS(start);
  const dtEnd = formatDateToICS(end);
  const text = encodeURIComponent(`MsmeBooks: ${booking.serviceTitle} with ${booking.providerName}`);
  const details = encodeURIComponent(
    `Reference: ${booking.reference}\n` +
    `Package: ${booking.packageName}\n` +
    `Consultation Mode: ${booking.consultationMode}\n` +
    `Client: ${booking.customerName} (${booking.businessName})\n` +
    `Provider: ${booking.providerName}\n` +
    `Support Desk: https://www.msmebooks.org`
  );
  const location = encodeURIComponent(
    booking.consultationMode === 'Online Consultation'
      ? 'Online Consultation (Link sent via WhatsApp/Email)'
      : `${booking.city || 'Office'}, ${booking.country || 'Nigeria'}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dtStart}/${dtEnd}&details=${details}&location=${location}`;
}

/**
 * Generates direct Outlook / Office 365 add event link
 */
export function getOutlookCalendarUrl(booking: BookingRecord): string {
  const { start, end } = parseBookingDateTime(booking.appointmentDate, booking.timeSlot);
  const subject = encodeURIComponent(`MsmeBooks: ${booking.serviceTitle} with ${booking.providerName}`);
  const body = encodeURIComponent(
    `Reference: ${booking.reference}\n` +
    `Package: ${booking.packageName}\n` +
    `Provider: ${booking.providerName}\n` +
    `Client: ${booking.customerName} (${booking.businessName})\n` +
    `Consultation Mode: ${booking.consultationMode}`
  );
  const location = encodeURIComponent(
    booking.consultationMode === 'Online Consultation' ? 'Online Consultation Room' : `${booking.city || 'Office'}, ${booking.country || 'Nigeria'}`
  );

  const startIso = start.toISOString();
  const endIso = end.toISOString();

  return `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${subject}&startdt=${startIso}&enddt=${endIso}&body=${body}&location=${location}`;
}
