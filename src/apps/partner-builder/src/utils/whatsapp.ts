import { CertifiedPartner } from '../types';

const DEFAULT_FALLBACK_WHATSAPP_NUMBER = '2349158482622';

/**
 * Sanitizes a phone string into digits suitable for wa.me links.
 */
export function sanitizeWhatsAppNumber(phone?: string): string {
  if (!phone) return DEFAULT_FALLBACK_WHATSAPP_NUMBER;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 ? digits : DEFAULT_FALLBACK_WHATSAPP_NUMBER;
}

/**
 * Builds a pre-filled WhatsApp consultation URL (`https://wa.me/...`)
 * tailored for a specific certified partner firm in the directory.
 */
export function buildWhatsAppBookingUrl(
  partner: Pick<
    CertifiedPartner,
    'companyName' | 'partnerCode' | 'contactPhone' | 'city' | 'state' | 'country' | 'tier' | 'services'
  >,
  customNote?: string
): string {
  const phoneDigits = sanitizeWhatsAppNumber(partner.contactPhone);
  const locationParts = [partner.city, partner.state, partner.country].filter(Boolean);
  const location = locationParts.join(', ');
  const tierLabel = partner.tier
    ? `${partner.tier.charAt(0).toUpperCase()}${partner.tier.slice(1)} Certified Partner`
    : 'Certified Partner';
  const topServices = partner.services?.slice(0, 3).join(', ');

  const messageLines = [
    `Hello ${partner.companyName} Team,`,
    '',
    `I found your verified MsmeBooks ${tierLabel} listing (${partner.partnerCode}${location ? ` • ${location}` : ''}) in the Partner Directory and would like to request a Direct WhatsApp Consultation.`,
    topServices ? `Areas of interest: ${topServices}.` : '',
    customNote?.trim() ? `Project note: ${customNote.trim()}` : '',
    '',
    'Please let me know your earliest availability. Thank you!'
  ].filter((line, index, arr) => !(line === '' && arr[index - 1] === ''));

  const encodedText = encodeURIComponent(messageLines.join('\n'));
  return `https://wa.me/${phoneDigits}?text=${encodedText}`;
}
