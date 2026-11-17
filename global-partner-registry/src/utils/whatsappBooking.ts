import { Partner } from '../types';

export interface WhatsAppBookingOptions {
  clientName?: string;
  businessName?: string;
  service?: string;
  customMessage?: string;
}

const DEFAULT_WHATSAPP_FALLBACK_NUMBER = '2349158482622';

/**
 * Normalizes a partner's phone number into digits-only format required by wa.me links.
 */
export function normalizeWhatsAppPhone(phone?: string): string {
  if (!phone) return DEFAULT_WHATSAPP_FALLBACK_NUMBER;
  const digits = phone.replace(/[^\d]/g, '');
  if (digits.length < 7) {
    return DEFAULT_WHATSAPP_FALLBACK_NUMBER;
  }
  return digits;
}

/**
 * Builds a pre-filled WhatsApp consultation booking URL (wa.me) for a specific partner firm.
 */
export function buildWhatsAppBookingUrl(
  partner: Pick<
    Partner,
    'id' | 'name' | 'phone' | 'city' | 'country' | 'level' | 'partnerType' | 'specialties' | 'services' | 'verification'
  >,
  options: WhatsAppBookingOptions = {}
): string {
  const cleanPhone = normalizeWhatsAppPhone(partner.phone);
  const topSpecialties = (partner.specialties || []).slice(0, 3).join(', ');
  const primaryService = options.service || partner.services?.[0] || 'MsmeBooks Implementation & Advisory';
  const partnerRef = partner.verification?.partnerId || partner.id.toUpperCase();

  const lines: string[] = [
    `Hello ${partner.name} team,`,
    '',
    `I found your firm on the MsmeBooks Official Partner Directory (${partner.level} ${partner.partnerType} — ${partner.city}, ${partner.country}) and would like to book a direct WhatsApp consultation.`,
  ];

  if (options.clientName || options.businessName) {
    const identity = [options.clientName, options.businessName].filter(Boolean).join(' • ');
    lines.push(`Client: ${identity}`);
  }

  lines.push(`Area of Interest: ${primaryService}`);

  if (topSpecialties) {
    lines.push(`Focus Specialties: ${topSpecialties}`);
  }

  if (options.customMessage) {
    lines.push(`Details: ${options.customMessage}`);
  }

  lines.push(`Partner Reference: ${partnerRef}`);
  lines.push('');
  lines.push('Please let me know your earliest available slot to connect. Thank you!');

  const message = lines.join('\n');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
