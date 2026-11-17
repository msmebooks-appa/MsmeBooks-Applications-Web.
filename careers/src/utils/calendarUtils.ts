/**
 * Calendar Utilities for Generating .ics iCalendar files and Web Calendar Links
 * Supports Apple Calendar, Google Calendar, Outlook Web, and Office 365.
 */

export interface CalendarInterviewEvent {
  id: string;
  candidateName: string;
  candidateEmail?: string;
  jobTitle: string;
  companyName?: string;
  interviewDate: string | Date;
  durationMinutes?: number;
  meetingType?: string;
  meetingUrl?: string;
  interviewerName?: string;
  referenceCode?: string;
  notes?: string;
}

/**
 * Format a Date object into iCalendar UTC timestamp: YYYYMMDDTHHmmssZ
 */
export function formatIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Format a Date object into Google Calendar web URL timestamp: YYYYMMDDTHHmmssZ
 */
export function formatGoogleDate(date: Date): string {
  return formatIcsDate(date);
}

/**
 * Clean and escape text for .ics formatting
 */
export function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Generate RFC 5545 compliant .ics content for an interview event
 */
export function generateIcsContent(event: CalendarInterviewEvent): string {
  const startDate = typeof event.interviewDate === 'string'
    ? new Date(event.interviewDate)
    : event.interviewDate;

  const durationMs = (event.durationMinutes || 45) * 60 * 1000;
  const endDate = new Date(startDate.getTime() + durationMs);

  const now = new Date();
  const uid = `msmebooks-interview-${event.id}-${startDate.getTime()}@msmebooks.org`;
  const company = event.companyName || 'MsmeBooks Technologies';
  const meetingType = event.meetingType || 'Technical & Cultural Screening Call';
  const meetingUrl = event.meetingUrl || 'https://meet.google.com/msme-talent-call';
  const summary = `${meetingType}: ${event.candidateName} - ${event.jobTitle} (${company})`;

  const descriptionLines = [
    `Scheduled Interview with ${company}`,
    `--------------------------------------------------`,
    `Candidate: ${event.candidateName}`,
    event.candidateEmail ? `Candidate Email: ${event.candidateEmail}` : '',
    `Position: ${event.jobTitle}`,
    `Meeting Type: ${meetingType}`,
    event.referenceCode ? `Application Ref: ${event.referenceCode}` : '',
    event.interviewerName ? `Interviewer: ${event.interviewerName}` : `Hiring Partner: Adaobi Vance`,
    `Video Link: ${meetingUrl}`,
    event.notes ? `\nNotes: ${event.notes}` : '',
    `\nPlease join the meeting link 3-5 minutes prior to start time.`,
    `Powered by MsmeBooks Talent & Recruitment Portal.`,
  ].filter(Boolean).join('\n');

  const location = `Google Meet (${meetingUrl})`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MsmeBooks//Recruitment Portal Calendar Generator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(now)}`,
    `DTSTART:${formatIcsDate(startDate)}`,
    `DTEND:${formatIcsDate(endDate)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `DESCRIPTION:${escapeIcsText(descriptionLines)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `URL:${meetingUrl}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeIcsText(`Reminder: ${summary} in 15 minutes`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Trigger immediate browser download of an .ics file
 */
export function downloadIcsFile(filename: string, icsContent: string): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate Google Calendar Web URL
 */
export function getGoogleCalendarUrl(event: CalendarInterviewEvent): string {
  const startDate = typeof event.interviewDate === 'string'
    ? new Date(event.interviewDate)
    : event.interviewDate;

  const durationMs = (event.durationMinutes || 45) * 60 * 1000;
  const endDate = new Date(startDate.getTime() + durationMs);

  const company = event.companyName || 'MsmeBooks';
  const meetingType = event.meetingType || 'Technical & Cultural Screening Call';
  const title = `${meetingType}: ${event.candidateName} - ${event.jobTitle} (${company})`;

  const details = [
    `Scheduled Candidate Interview with ${company}`,
    `Candidate: ${event.candidateName}`,
    event.candidateEmail ? `Email: ${event.candidateEmail}` : '',
    `Role: ${event.jobTitle}`,
    event.referenceCode ? `Application Reference: ${event.referenceCode}` : '',
    `Meeting Video Link: ${event.meetingUrl || 'https://meet.google.com/msme-talent-call'}`,
    event.notes ? `Notes: ${event.notes}` : '',
  ].filter(Boolean).join('\n');

  const location = event.meetingUrl || 'Google Meet (https://meet.google.com/msme-talent-call)';

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate Outlook Web Calendar URL
 */
export function getOutlookCalendarUrl(event: CalendarInterviewEvent): string {
  const startDate = typeof event.interviewDate === 'string'
    ? new Date(event.interviewDate)
    : event.interviewDate;

  const durationMs = (event.durationMinutes || 45) * 60 * 1000;
  const endDate = new Date(startDate.getTime() + durationMs);

  const company = event.companyName || 'MsmeBooks';
  const meetingType = event.meetingType || 'Technical Screening Call';
  const title = `${meetingType}: ${event.candidateName} - ${event.jobTitle} (${company})`;
  const location = event.meetingUrl || 'Google Meet (https://meet.google.com/msme-talent-call)';

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: title,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: `Interview with ${company} for ${event.jobTitle}. Join link: ${location}`,
    location,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generate Office 365 Web Calendar URL
 */
export function getOffice365CalendarUrl(event: CalendarInterviewEvent): string {
  const startDate = typeof event.interviewDate === 'string'
    ? new Date(event.interviewDate)
    : event.interviewDate;

  const durationMs = (event.durationMinutes || 45) * 60 * 1000;
  const endDate = new Date(startDate.getTime() + durationMs);

  const company = event.companyName || 'MsmeBooks';
  const meetingType = event.meetingType || 'Technical Screening Call';
  const title = `${meetingType}: ${event.candidateName} - ${event.jobTitle} (${company})`;
  const location = event.meetingUrl || 'Google Meet (https://meet.google.com/msme-talent-call)';

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: title,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: `Interview with ${company} for ${event.jobTitle}. Join link: ${location}`,
    location,
  });

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}
