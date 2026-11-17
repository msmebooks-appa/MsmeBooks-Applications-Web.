import { BookingRecord } from '../types/booking';

export interface ClientEmailRecord {
  id: string;
  toEmail: string;
  toName: string;
  subject: string;
  bookingRef: string;
  sentAt: string;
  serviceTitle: string;
  packageName: string;
  providerName: string;
  appointmentDate: string;
  timeSlot: string;
  consultationMode: string;
  totalAmountFormatted: string;
  paymentStatus: string;
  paymentGateway?: string;
  transactionRef?: string;
  read: boolean;
  category: 'booking_confirmation' | 'payment_receipt' | 'reschedule_notice';
  htmlContent: string;
}

const STORAGE_KEY = 'msmebooks_client_emails';
const EVENT_NAME = 'msmebooks_emails_changed';

// Initial pre-seeded demo email so client has existing records on first open
export const INITIAL_EMAILS: ClientEmailRecord[] = [
  {
    id: 'em-conf-9182',
    toEmail: 'b.lawal@primemart.ng',
    toName: 'Babatunde Lawal',
    subject: 'Booking Confirmed: POS Hardware & Software Setup (Ref: MSME-BK-9182)',
    bookingRef: 'MSME-BK-9182',
    sentAt: new Date(Date.now() - 36 * 60 * 1000).toISOString(),
    serviceTitle: 'POS Hardware & Software Setup',
    packageName: 'Multi-Terminal Retail Rollout',
    providerName: 'Apex Cloud Systems & Implementations',
    appointmentDate: 'Tomorrow',
    timeSlot: '10:00 AM - 12:00 PM',
    consultationMode: 'On-site Business Visit',
    totalAmountFormatted: '₦95,000',
    paymentStatus: 'Paid',
    paymentGateway: 'Paystack',
    transactionRef: 'PSTK-9182-SECURE',
    read: true,
    category: 'booking_confirmation',
    htmlContent: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; line-height: 1.5;">
        <div style="background-color: #102B4E; padding: 24px; border-radius: 12px 12px 0 0; color: white;">
          <h1 style="margin: 0; font-size: 20px; font-weight: 800;">Msme<span style="color: #B7E532;">Books</span> Services</h1>
          <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8;">Pan-African Professional Services Marketplace</p>
        </div>
        <div style="background-color: #ffffff; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px;">
            <p style="margin: 0; color: #065f46; font-size: 13px; font-weight: 700;">✓ Official Booking & Transaction Confirmation</p>
          </div>
          <p style="font-size: 14px;">Dear <strong>Babatunde Lawal</strong>,</p>
          <p style="font-size: 13px; color: #475569;">
            Your professional service engagement has been formally scheduled and confirmed. A certified deployment consultant will coordinate with your team.
          </p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px;">
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Booking Reference:</td><td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1464C8;">MSME-BK-9182</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Service Engagement:</td><td style="padding: 8px 0; font-weight: 700; text-align: right;">POS Hardware & Software Setup</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Package Tier:</td><td style="padding: 8px 0; font-weight: 700; text-align: right;">Multi-Terminal Retail Rollout</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Assigned Firm:</td><td style="padding: 8px 0; font-weight: 700; text-align: right;">Apex Cloud Systems & Implementations</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Scheduled Time:</td><td style="padding: 8px 0; font-weight: 700; text-align: right;">Tomorrow (10:00 AM - 12:00 PM)</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 8px 0; color: #64748b;">Payment Status:</td><td style="padding: 8px 0; font-weight: 700; text-align: right; color: #16a34a;">Paid via Paystack</td></tr>
            <tr><td style="padding: 12px 0; font-size: 15px; font-weight: 800; color: #102B4E;">Total Amount:</td><td style="padding: 12px 0; font-size: 16px; font-weight: 800; text-align: right; color: #102B4E;">₦95,000</td></tr>
          </table>
          <p style="font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px;">
            This email is an electronic transaction confirmation issued under Nigeria Data Protection Act (NDPA) regulations. For urgent changes, contact MsmeBooks Concierge on WhatsApp (+234 915 848 2622).
          </p>
        </div>
      </div>
    `,
  },
];

export const getStoredEmails = (): ClientEmailRecord[] => {
  if (typeof window === 'undefined') return INITIAL_EMAILS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EMAILS));
      return INITIAL_EMAILS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_EMAILS;
  } catch (err) {
    console.error('Failed to retrieve client emails:', err);
    return INITIAL_EMAILS;
  }
};

export const saveEmails = (emails: ClientEmailRecord[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { count: emails.length } }));
  } catch (err) {
    console.error('Failed to persist emails:', err);
  }
};

/**
 * Triggers a mock 'Booking Confirmation' email once a user completes the booking process,
 * ensuring the user has an immediate, transparent record of the transaction.
 */
export const sendBookingConfirmationEmail = (
  booking: BookingRecord,
  options?: {
    formattedTotal?: string;
    clientEmail?: string;
    clientName?: string;
    calculatedBreakdown?: {
      subtotal?: string;
      vat?: string;
      discount?: string;
      total?: string;
    };
  }
): ClientEmailRecord => {
  const currentEmails = getStoredEmails();
  const emailId = `em-conf-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const toEmail = options?.clientEmail || booking.customerEmail || 'client@business.africa';
  const toName = options?.clientName || booking.customerName || 'Valued Client';
  const totalDisplay = options?.formattedTotal || booking.packagePrice || '₦45,000';

  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; max-width: 620px; margin: 0 auto; line-height: 1.6; background-color: #f8fafc; padding: 20px;">
      <div style="background: linear-gradient(135deg, #102B4E 0%, #1464C8 100%); padding: 28px 24px; border-radius: 16px 16px 0 0; color: #ffffff; text-align: left;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 900; letter-spacing: -0.5px;">
            Msme<span style="color: #B7E532;">Books</span>
          </h1>
          <span style="background-color: rgba(183, 229, 50, 0.2); color: #B7E532; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase;">
            Booking Confirmed
          </span>
        </div>
        <p style="margin: 8px 0 0; font-size: 13px; color: #cbd5e1;">
          Official Booking & Engagement Confirmation Record
        </p>
      </div>

      <div style="background-color: #ffffff; padding: 28px 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 16px 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
        <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 14px 16px; border-radius: 8px; margin-bottom: 24px;">
          <p style="margin: 0; color: #065f46; font-size: 14px; font-weight: 700;">
            ✓ Your appointment has been secured!
          </p>
          <p style="margin: 4px 0 0; color: #047857; font-size: 12px;">
            Reference ID: <strong>${booking.reference}</strong> • Timestamp: ${new Date().toLocaleString()}
          </p>
        </div>

        <p style="font-size: 14px; margin-top: 0;">Dear <strong>${toName}</strong>,</p>
        <p style="font-size: 13px; color: #475569;">
          Thank you for choosing MsmeBooks. Your appointment for <strong>${booking.serviceTitle}</strong> has been successfully booked with <strong>${booking.providerName}</strong>. Below is your official record of this transaction:
        </p>

        <!-- Transaction Details Box -->
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <h3 style="margin: 0 0 12px; font-size: 13px; font-weight: 800; color: #102B4E; text-transform: uppercase; letter-spacing: 0.5px;">
            Transaction Summary
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px 0; color: #64748b;">Service:</td>
              <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #102B4E;">${booking.serviceTitle}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px 0; color: #64748b;">Package Tier:</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${booking.packageName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px 0; color: #64748b;">Service Provider:</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${booking.providerName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px 0; color: #64748b;">Date & Time:</td>
              <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1464C8;">${booking.appointmentDate} at ${booking.timeSlot}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px 0; color: #64748b;">Engagement Mode:</td>
              <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${booking.consultationMode}</td>
            </tr>
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px 0; color: #64748b;">Payment Status:</td>
              <td style="padding: 8px 0; font-weight: 700; text-align: right; color: ${booking.paymentStatus === 'Paid' ? '#16a34a' : '#d97706'};">
                ${booking.paymentStatus || 'Pending Payment'}${booking.paymentGateway ? ` via ${booking.paymentGateway}` : ''}
              </td>
            </tr>
            ${booking.paymentTransactionRef ? `
            <tr style="border-bottom: 1px solid #e2e8f0;">
              <td style="padding: 8px 0; color: #64748b;">Gateway Ref:</td>
              <td style="padding: 8px 0; font-mono; font-size: 11px; text-align: right; color: #64748b;">${booking.paymentTransactionRef}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 12px 0 4px; font-size: 15px; font-weight: 900; color: #102B4E;">Total Amount:</td>
              <td style="padding: 12px 0 4px; font-size: 17px; font-weight: 900; text-align: right; color: #102B4E;">${totalDisplay}</td>
            </tr>
          </table>
        </div>

        <!-- Next Steps -->
        <div style="margin: 24px 0;">
          <h4 style="margin: 0 0 8px; font-size: 13px; font-weight: 800; color: #102B4E;">Next Steps & Preparation:</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #475569; line-height: 1.8;">
            <li>Your assigned partner firm has received your booking brief and will reach out via WhatsApp or email prior to the session.</li>
            <li>For virtual sessions, a secure Google Meet or Zoom link will be sent 30 minutes in advance.</li>
            <li>Have any relevant bank statements, receipts, or existing charts-of-accounts on hand.</li>
          </ul>
        </div>

        <div style="text-align: center; margin: 28px 0 16px;">
          <a href="https://wa.me/2349158482622?text=Hello%20MsmeBooks%2C%20following%20up%20on%20my%20booking%20${encodeURIComponent(booking.reference)}" style="display: inline-block; background-color: #B7E532; color: #102B4E; font-weight: 800; font-size: 13px; padding: 12px 24px; border-radius: 10px; text-decoration: none; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            Connect on WhatsApp Concierge (+234 915 848 2622)
          </a>
        </div>

        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

        <div style="font-size: 11px; color: #94a3b8; line-height: 1.5;">
          <p style="margin: 0 0 6px;">
            <strong>MsmeBooks Professional Services Network</strong> (www.msmebooks.org)
          </p>
          <p style="margin: 0;">
            This confirmation email was generated automatically to provide you with a durable transaction record. Compliant with Nigeria Data Protection Act (NDPA). All confidential business information is protected.
          </p>
        </div>
      </div>
    </div>
  `;

  const newEmail: ClientEmailRecord = {
    id: emailId,
    toEmail,
    toName,
    subject: `Booking Confirmed: ${booking.serviceTitle} (${booking.reference})`,
    bookingRef: booking.reference,
    sentAt: new Date().toISOString(),
    serviceTitle: booking.serviceTitle,
    packageName: booking.packageName,
    providerName: booking.providerName,
    appointmentDate: booking.appointmentDate,
    timeSlot: booking.timeSlot,
    consultationMode: booking.consultationMode,
    totalAmountFormatted: totalDisplay,
    paymentStatus: booking.paymentStatus || 'Pending Payment',
    paymentGateway: booking.paymentGateway,
    transactionRef: booking.paymentTransactionRef,
    read: false,
    category: 'booking_confirmation',
    htmlContent,
  };

  const updated = [newEmail, ...currentEmails];
  saveEmails(updated);
  return newEmail;
};

export const markEmailAsRead = (id: string): void => {
  const emails = getStoredEmails();
  const updated = emails.map(e => e.id === id ? { ...e, read: true } : e);
  saveEmails(updated);
};

export const deleteEmail = (id: string): void => {
  const emails = getStoredEmails();
  const updated = emails.filter(e => e.id !== id);
  saveEmails(updated);
};

export const getUnreadEmailCount = (): number => {
  const emails = getStoredEmails();
  return emails.filter(e => !e.read).length;
};
