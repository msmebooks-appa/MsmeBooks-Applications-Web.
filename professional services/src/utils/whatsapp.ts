export const OFFICIAL_WHATSAPP_NUMBER = '2349158482622';
export const DISPLAY_WHATSAPP_NUMBER = '+234 915 848 2622';

export interface WhatsAppBookingParams {
  serviceName?: string;
  packageName?: string;
  providerName?: string;
  consultationType?: string;
  preferredDate?: string;
  bookingRef?: string;
  customerName?: string;
  businessName?: string;
  location?: string;
  requirements?: string;
  billingOption?: string;
  estimatedFee?: string;
}

export function buildWhatsAppBookingUrl(params: WhatsAppBookingParams): string {
  const {
    serviceName = 'General Professional Service Inquiry',
    packageName,
    providerName = 'MsmeBooks Professional Services',
    consultationType = 'Online Consultation',
    preferredDate = 'To be confirmed',
    bookingRef,
    customerName,
    businessName,
    location,
    requirements,
    billingOption,
    estimatedFee,
  } = params;

  let message = `Hello MsmeBooks,\n\nI would like to book a professional service.\n\n`;
  message += `Service: ${serviceName}\n`;
  if (packageName) {
    message += `Selected Package: ${packageName}\n`;
  }
  if (billingOption) {
    message += `Billing Option: ${billingOption}\n`;
  }
  if (estimatedFee) {
    message += `Estimated Investment: ${estimatedFee}\n`;
  }
  message += `Preferred Provider: ${providerName}\n`;
  message += `Consultation Type: ${consultationType}\n`;
  message += `Preferred Date: ${preferredDate}\n`;
  
  if (bookingRef) {
    message += `Booking Reference: ${bookingRef}\n`;
  }
  if (businessName) {
    message += `Business: ${businessName} (${location || 'Africa'})\n`;
  }
  if (customerName) {
    message += `Contact Person: ${customerName}\n`;
  }
  if (requirements) {
    message += `Requirements / Notes: ${requirements}\n`;
  }

  message += `\nPlease share the service requirements, pricing, and next available appointment.\n\nThank you.`;

  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
