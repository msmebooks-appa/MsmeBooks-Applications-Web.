import { jsPDF } from 'jspdf';
import { BookingRecord } from '../types/booking';
import { addAppNotification } from './notificationService';

export interface AutoInvoiceDocument {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  bookingReference: string;
  serviceTitle: string;
  packageName: string;
  providerName: string;
  providerType?: string;
  customerName: string;
  businessName: string;
  city?: string;
  country?: string;
  appointmentDate: string;
  timeSlot: string;
  subtotalNGN: number;
  discountNGN: number;
  vatNGN: number;
  totalNGN: number;
  paymentMethodLabel: string;
  paymentTransactionRef?: string;
  fileName: string;
  pdfDataUri: string;
  sizeBytes: number;
  generatedAt: string;
  triggerReason: 'status-completed';
}

const AUTO_INVOICES_STORAGE_KEY = 'msmebooks_auto_invoices';
export const AUTO_INVOICES_CHANGED_EVENT = 'msmebooks_auto_invoices_changed';

function formatNgnAscii(amount: number): string {
  const rounded = Math.round(Number.isFinite(amount) ? amount : 0);
  return `NGN ${rounded.toLocaleString('en-US')}`;
}

function toAsciiSafe(input: string | undefined, fallback = ''): string {
  const raw = (input ?? fallback).toString();
  // Normalize Naira symbol and any non-WinAnsi chars so standard Type1 PDF fonts render cleanly
  return raw
    .replace(/₦/g, 'NGN ')
    .replace(/[•·]/g, ' | ')
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[^\x20-\x7E]/g, '')
    .trim();
}

export function deriveInvoiceBreakdown(booking: BookingRecord) {
  if (booking.billingBreakdown) {
    return booking.billingBreakdown;
  }
  const units = booking.billingUnits || 1;
  // Try parsing package price NGN value if available
  const priceMatch = booking.packagePrice?.match(/(?:NGN|₦)\s*([\d,]+)/i);
  const parsedTotal = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : 45000 * units;
  const subtotalNGN = Math.round(parsedTotal / 1.075);
  const vatNGN = Math.max(0, parsedTotal - subtotalNGN);
  return {
    frequency: booking.billingFrequency || 'days',
    units,
    unitLabel: `${units} ${booking.billingUnitType || 'Units'}`,
    unitRateNGN: Math.round(subtotalNGN / Math.max(1, units)),
    subtotalNGN,
    discountPercent: 0,
    discountNGN: 0,
    vatNGN,
    totalNGN: parsedTotal,
  };
}

export function buildAutoInvoicePdfDataUri(
  booking: BookingRecord,
  invoiceNumber: string,
  generatedAtIso: string
): { pdfDataUri: string; sizeBytes: number } {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const breakdown = deriveInvoiceBreakdown(booking);
  const issueDateStr = new Date(booking.createdAt || generatedAtIso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const completedDateStr = new Date(generatedAtIso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // 1. Header Banner
  doc.setFillColor(16, 43, 78); // #102B4E
  doc.rect(0, 0, 210, 36, 'F');

  // Brand icon box
  doc.setFillColor(20, 100, 200); // #1464C8
  doc.roundedRect(14, 9, 13, 13, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('MB', 20.5, 17.5, { align: 'center' });

  // Brand title & subtitle
  doc.setFontSize(15);
  doc.text('MsmeBooks Professional Services', 31, 15.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Pan-African MSME Accounting, Audit & Advisory Marketplace', 31, 21);
  doc.text('FIRS TIN: 24910291-0001  |  CAC RC: 1849104', 31, 25.5);

  // Status badge on header right
  doc.setFillColor(183, 229, 50); // #B7E532
  doc.roundedRect(146, 10, 50, 9, 2, 2, 'F');
  doc.setTextColor(16, 43, 78);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('PAID & COMPLETED', 171, 15.8, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text('AUTO-GENERATED TAX RECEIPT', 196, 25, { align: 'right' });

  // 2. Document Metadata Strip
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 43, 182, 24, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('RECEIPT / INVOICE NO.', 19, 50);
  doc.text('BOOKING REFERENCE', 70, 50);
  doc.text('SERVICE DATE', 118, 50);
  doc.text('AUTO-GENERATED ON', 156, 50);

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(toAsciiSafe(invoiceNumber), 19, 56.5);
  doc.setTextColor(20, 100, 200);
  doc.text(toAsciiSafe(booking.reference), 70, 56.5);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(toAsciiSafe(booking.appointmentDate || issueDateStr), 118, 56.5);
  doc.text(toAsciiSafe(completedDateStr), 156, 56.5);

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  const paymentMethod = toAsciiSafe(
    booking.paymentGateway || (booking.paymentStatus === 'Paid' ? 'MsmeBooks Verified Escrow' : 'Standard Settlement')
  );
  doc.text(
    `Issue Date: ${issueDateStr}   |   Payment Method: ${paymentMethod}${
      booking.paymentTransactionRef ? `   |   Audit Ref: ${toAsciiSafe(booking.paymentTransactionRef)}` : ''
    }`,
    19,
    63.5
  );

  // 3. Billed To & Executing Practice Firm Cards
  const cardY = 74;
  const cardH = 35;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, cardY, 88, cardH, 2, 2, 'FD');
  doc.roundedRect(108, cardY, 88, cardH, 2, 2, 'FD');

  // Client Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('BILLED TO (CLIENT ENTERPRISE)', 19, cardY + 7);
  doc.setFontSize(10.5);
  doc.setTextColor(16, 43, 78);
  const clientBiz = toAsciiSafe(booking.businessName || booking.customerName, 'MSME Client');
  doc.text(doc.splitTextToSize(clientBiz, 78)[0], 19, cardY + 13.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Attn: ${toAsciiSafe(booking.customerName, 'Client')}`, 19, cardY + 19.5);
  doc.text(`${toAsciiSafe(booking.city, 'Lagos')}, ${toAsciiSafe(booking.country, 'Nigeria')}`, 19, cardY + 24.5);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    doc.splitTextToSize(`${toAsciiSafe(booking.customerEmail)} | ${toAsciiSafe(booking.customerPhone)}`, 78)[0],
    19,
    cardY + 30
  );

  // Provider Box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('EXECUTING PRACTICE FIRM', 113, cardY + 7);
  doc.setFontSize(10.5);
  doc.setTextColor(16, 43, 78);
  const providerTitle = toAsciiSafe(booking.providerName, 'Certified Partner Firm');
  doc.text(doc.splitTextToSize(providerTitle, 78)[0], 113, cardY + 13.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Classification: ${toAsciiSafe(booking.providerType, 'Certified Chartered Firm')}`, 113, cardY + 19.5);
  doc.text(`Delivery Mode: ${toAsciiSafe(booking.consultationMode, 'Virtual')}`, 113, cardY + 24.5);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Session Window: ${toAsciiSafe(booking.timeSlot, 'Scheduled')}`, 113, cardY + 30);

  // 4. Itemized Service Table
  const tableY = 117;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, tableY, 182, 9, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(16, 43, 78);
  doc.text('SERVICE DESCRIPTION', 18, tableY + 6);
  doc.text('PACKAGE TIER', 96, tableY + 6);
  doc.text('UNITS', 132, tableY + 6);
  doc.text('RATE', 162, tableY + 6, { align: 'right' });
  doc.text('SUBTOTAL', 192, tableY + 6, { align: 'right' });

  // Row content
  const serviceLines = doc.splitTextToSize(toAsciiSafe(booking.serviceTitle, 'Professional Engagement'), 74);
  const rowHeight = Math.max(20, serviceLines.length * 5 + 11);
  doc.setFillColor(255, 255, 255);
  doc.rect(14, tableY + 9, 182, rowHeight, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(serviceLines, 18, tableY + 15.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Billing Model: ${toAsciiSafe(booking.billingFrequency || 'Standard').toUpperCase()}`,
    18,
    tableY + 15.5 + serviceLines.length * 4.5 + 1.5
  );

  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(doc.splitTextToSize(toAsciiSafe(booking.packageName, 'Standard'), 33), 96, tableY + 15.5);
  doc.text(toAsciiSafe(breakdown.unitLabel), 132, tableY + 15.5);
  doc.text(formatNgnAscii(breakdown.unitRateNGN), 162, tableY + 15.5, { align: 'right' });
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatNgnAscii(breakdown.subtotalNGN), 192, tableY + 15.5, { align: 'right' });

  // 5. Financial Totals Summary
  let summaryY = tableY + 9 + rowHeight + 10;

  // Escrow note on left
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(16, 43, 78);
  doc.text('Payment & Escrow Completion Notice:', 14, summaryY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  const escrowLines = doc.splitTextToSize(
    'This engagement has reached COMPLETED status. Escrow funds are verified and released to the executing chartered practice firm. Retain this PDF copy for corporate bookkeeping and tax audit records.',
    98
  );
  doc.text(escrowLines, 14, summaryY + 9.5);

  // Totals Box on right
  const boxX = 122;
  const boxW = 74;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Gross Subtotal:', boxX, summaryY + 4);
  doc.text(formatNgnAscii(breakdown.subtotalNGN), boxX + boxW, summaryY + 4, { align: 'right' });
  summaryY += 6.5;

  if (breakdown.discountPercent > 0 || breakdown.discountNGN > 0) {
    doc.setTextColor(5, 150, 105);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Discount${breakdown.discountPercent > 0 ? ` (${breakdown.discountPercent}%)` : ''}:`,
      boxX,
      summaryY + 4
    );
    doc.text(`- ${formatNgnAscii(breakdown.discountNGN)}`, boxX + boxW, summaryY + 4, { align: 'right' });
    summaryY += 6.5;
  }

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Statutory VAT (7.5%):', boxX, summaryY + 4);
  doc.text(formatNgnAscii(breakdown.vatNGN), boxX + boxW, summaryY + 4, { align: 'right' });
  summaryY += 9;

  // Total Paid highlight bar
  doc.setFillColor(16, 43, 78);
  doc.roundedRect(boxX - 2, summaryY, boxW + 4, 11, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL PAID:', boxX + 2, summaryY + 7);
  doc.setTextColor(183, 229, 50);
  doc.text(formatNgnAscii(breakdown.totalNGN), boxX + boxW - 1, summaryY + 7, { align: 'right' });

  // 6. Audit Verification Footer Banner
  const stampY = Math.max(summaryY + 24, 232);
  doc.setFillColor(240, 253, 244); // emerald-50
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(14, stampY, 182, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(6, 95, 70);
  doc.text('NDPA VERIFIED DIGITAL RECEIPT  |  AUTO-INVOICE ARCHIVE', 19, stampY + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(20, 83, 45);
  doc.text(
    `Generated automatically on ${completedDateStr} when booking ${toAsciiSafe(booking.reference)} reached Completed status.`,
    19,
    stampY + 14
  );
  doc.text(`Verify online: https://msmebooks.org/verify/${toAsciiSafe(booking.reference)}`, 19, stampY + 19.5);

  // Page footer
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 275, 196, 275);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Official Signature & Seal: MsmeBooks Finance Authority', 14, 281);
  doc.setFont('helvetica', 'normal');
  doc.text('Page 1 of 1', 196, 281, { align: 'right' });

  // Build standardized base64 data URI and compute binary size
  const arrayBuffer = doc.output('arraybuffer');
  const bytes = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  return {
    pdfDataUri: `data:application/pdf;base64,${base64}`,
    sizeBytes: bytes.byteLength,
  };
}

export function getAutoInvoices(): AutoInvoiceDocument[] {
  try {
    const raw = localStorage.getItem(AUTO_INVOICES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to read auto-invoices:', e);
    return [];
  }
}

function saveAutoInvoices(docs: AutoInvoiceDocument[]): void {
  try {
    localStorage.setItem(AUTO_INVOICES_STORAGE_KEY, JSON.stringify(docs));
    window.dispatchEvent(new CustomEvent(AUTO_INVOICES_CHANGED_EVENT, { detail: docs }));
  } catch (e) {
    console.error('Failed to persist auto-invoices:', e);
  }
}

export function generateAndStoreAutoInvoice(booking: BookingRecord): {
  document: AutoInvoiceDocument;
  created: boolean;
} {
  const existing = getAutoInvoices();
  const alreadySaved = existing.find(
    d => d.bookingId === booking.id || d.bookingReference === booking.reference
  );
  if (alreadySaved) {
    return { document: alreadySaved, created: false };
  }

  const year = new Date(booking.createdAt || Date.now()).getFullYear() || 2026;
  const cleanRef = (booking.reference || booking.id).replace(/^MSME-/i, '').replace(/[^A-Za-z0-9-]/g, '');
  const invoiceNumber = `RCT-${cleanRef}-${year}`;
  const generatedAt = new Date().toISOString();
  const fileName = `MsmeBooks-Invoice-${invoiceNumber}.pdf`;

  const breakdown = deriveInvoiceBreakdown(booking);
  const { pdfDataUri, sizeBytes } = buildAutoInvoicePdfDataUri(booking, invoiceNumber, generatedAt);

  const newDoc: AutoInvoiceDocument = {
    id: `autoinv-${booking.id}-${Date.now()}`,
    invoiceNumber,
    bookingId: booking.id,
    bookingReference: booking.reference,
    serviceTitle: booking.serviceTitle,
    packageName: booking.packageName,
    providerName: booking.providerName,
    providerType: booking.providerType,
    customerName: booking.customerName,
    businessName: booking.businessName || booking.customerName,
    city: booking.city,
    country: booking.country,
    appointmentDate: booking.appointmentDate,
    timeSlot: booking.timeSlot,
    subtotalNGN: breakdown.subtotalNGN,
    discountNGN: breakdown.discountNGN,
    vatNGN: breakdown.vatNGN,
    totalNGN: breakdown.totalNGN,
    paymentMethodLabel:
      booking.paymentGateway ||
      (booking.paymentStatus === 'Paid' ? 'MsmeBooks Verified Escrow' : 'Completed Settlement'),
    paymentTransactionRef: booking.paymentTransactionRef,
    fileName,
    pdfDataUri,
    sizeBytes,
    generatedAt,
    triggerReason: 'status-completed',
  };

  const nextDocs = [newDoc, ...existing];
  saveAutoInvoices(nextDocs);
  return { document: newDoc, created: true };
}

export function syncAutoInvoicesForCompletedBookings(
  bookings: BookingRecord[],
  options: { notify?: boolean } = {}
): { allDocuments: AutoInvoiceDocument[]; newlyCreated: AutoInvoiceDocument[] } {
  const existing = getAutoInvoices();
  const completedBookings = bookings.filter(b => b.status === 'Completed');
  const newlyCreated: AutoInvoiceDocument[] = [];
  let workingList = [...existing];

  for (const booking of completedBookings) {
    const exists = workingList.some(
      d => d.bookingId === booking.id || d.bookingReference === booking.reference
    );
    if (!exists) {
      const year = new Date(booking.createdAt || Date.now()).getFullYear() || 2026;
      const cleanRef = (booking.reference || booking.id).replace(/^MSME-/i, '').replace(/[^A-Za-z0-9-]/g, '');
      const invoiceNumber = `RCT-${cleanRef}-${year}`;
      const generatedAt = new Date().toISOString();
      const fileName = `MsmeBooks-Invoice-${invoiceNumber}.pdf`;
      const breakdown = deriveInvoiceBreakdown(booking);
      const { pdfDataUri, sizeBytes } = buildAutoInvoicePdfDataUri(booking, invoiceNumber, generatedAt);

      const newDoc: AutoInvoiceDocument = {
        id: `autoinv-${booking.id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        invoiceNumber,
        bookingId: booking.id,
        bookingReference: booking.reference,
        serviceTitle: booking.serviceTitle,
        packageName: booking.packageName,
        providerName: booking.providerName,
        providerType: booking.providerType,
        customerName: booking.customerName,
        businessName: booking.businessName || booking.customerName,
        city: booking.city,
        country: booking.country,
        appointmentDate: booking.appointmentDate,
        timeSlot: booking.timeSlot,
        subtotalNGN: breakdown.subtotalNGN,
        discountNGN: breakdown.discountNGN,
        vatNGN: breakdown.vatNGN,
        totalNGN: breakdown.totalNGN,
        paymentMethodLabel:
          booking.paymentGateway ||
          (booking.paymentStatus === 'Paid' ? 'MsmeBooks Verified Escrow' : 'Completed Settlement'),
        paymentTransactionRef: booking.paymentTransactionRef,
        fileName,
        pdfDataUri,
        sizeBytes,
        generatedAt,
        triggerReason: 'status-completed',
      };

      workingList = [newDoc, ...workingList];
      newlyCreated.push(newDoc);
    }
  }

  if (newlyCreated.length > 0) {
    saveAutoInvoices(workingList);
    if (options.notify) {
      for (const createdDoc of newlyCreated) {
        addAppNotification({
          type: 'booking',
          title: 'Auto-Invoice PDF Saved to Documents',
          message: `Receipt ${createdDoc.invoiceNumber} (${createdDoc.fileName}) was automatically generated for your completed "${createdDoc.serviceTitle}" booking.`,
          bookingRef: createdDoc.bookingReference,
          actionLabel: 'Open Documents',
        });
      }
    }
  }

  return { allDocuments: workingList, newlyCreated };
}

export function dataUriToPdfBlob(dataUri: string): Blob {
  const base64Part = dataUri.includes('base64,') ? dataUri.split('base64,')[1] : dataUri;
  const binary = atob(base64Part);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: 'application/pdf' });
}

export function downloadAutoInvoicePdf(doc: AutoInvoiceDocument): void {
  const blob = dataUriToPdfBlob(doc.pdfDataUri);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = doc.fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function formatPdfBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
