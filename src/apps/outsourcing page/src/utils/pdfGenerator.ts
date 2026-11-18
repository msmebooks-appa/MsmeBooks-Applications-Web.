import { jsPDF } from 'jspdf';
import { CountryInfo, CurrencyCode, BillingCycle } from '../types';
import { formatPrice } from './currency';
import { EXCHANGE_RATES } from '../data/mockData';
import { Language } from '../i18n/translations';

export interface PDFReceiptData {
  receiptNumber: string;
  documentType: 'receipt' | 'quote';
  language?: Language;
  companyName: string;
  registrationNo: string;
  taxId?: string;
  contactEmail: string;
  planName: string;
  billingCycle: BillingCycle;
  periodMonths: number;
  rawMonthlyUSD: number;
  grossSubtotalUSD?: number;
  cadenceDiscountUSD?: number;
  promoCode?: string;
  promoDiscountPercent?: number;
  promoDiscountUSD?: number;
  totalDiscountUSD?: number;
  subtotalUSD: number; // Net Taxable Subtotal (HT)
  vatUSD: number;
  grandTotalUSD: number;
  selectedCurrency: CurrencyCode;
  selectedCountry: CountryInfo;
  gatewayName: string;
  gatewayId?: string;
  paymentDate?: Date;
}

interface PdfLocaleCopy {
  brandSubtitle: string;
  brandTag: string;
  docTitleQuote: string;
  docTitleReceipt: string;
  refLabel: string;
  entityHeading: string;
  regLabel: string;
  taxLabel: string;
  emailLabel: string;
  jurisdictionLabel: string;
  paymentHeadingQuote: string;
  paymentHeadingReceipt: string;
  gatewayLabel: string;
  timeLabel: string;
  cadenceLabel: string;
  fxLabel: string;
  monthsLabel: string;
  statusQuote: string;
  statusReceipt: string;
  colDesc: string;
  colCadence: string;
  colBaseUsd: string;
  colTotal: string;
  planDescLine: string;
  cadenceDiscountTitle: string;
  cadenceDiscountBadge: string;
  promoDiscountTitle: string;
  vatLineTitle: string;
  vatRateLabel: string;
  setupLineTitle: string;
  includedLabel: string;
  waivedLabel: string;
  freeLabel: string;
  summaryGross: string;
  summaryDiscount: string;
  summaryNetSubtotal: string;
  summaryVat: string;
  summaryTotalQuote: string;
  summaryTotalReceipt: string;
  slaHeading: string;
  slaPoints: string[];
  activationHeading: string;
  activationStages: string[];
  legalHeading: string;
  legalBodyQuote: string;
  legalBodyReceipt: string;
  footerVerify: string;
  footerSupport: string;
  filePrefixQuote: string;
  filePrefixReceipt: string;
}

const PDF_COPY: Record<Language, PdfLocaleCopy> = {
  en: {
    brandSubtitle: 'Pan-African Accounting, Payroll & Business Advisory Operations',
    brandTag: 'Licensed Financial Services & Enterprise Managed Pods',
    docTitleQuote: 'OFFICIAL SERVICE QUOTE',
    docTitleReceipt: 'TAX INVOICE & RECEIPT',
    refLabel: 'Ref:',
    entityHeading: 'SUBSCRIBING CLIENT ENTITY',
    regLabel: 'Company Reg / RC:',
    taxLabel: 'Tax ID / TIN:',
    emailLabel: 'Billing Email:',
    jurisdictionLabel: 'Jurisdiction:',
    paymentHeadingQuote: 'ESTIMATE & CLEARANCE DETAILS',
    paymentHeadingReceipt: 'PAYMENT CLEARANCE & GATEWAY',
    gatewayLabel: 'Gateway Channel:',
    timeLabel: 'Payment Time:',
    cadenceLabel: 'Billing Cadence:',
    fxLabel: 'Applied Exchange Rate:',
    monthsLabel: 'Months',
    statusQuote: 'VALID FOR 30 DAYS • PRICE GUARANTEED',
    statusReceipt: 'CLEARED & VERIFIED - PAID IN FULL',
    colDesc: 'DESCRIPTION & OUTSOURCING SCOPE',
    colCadence: 'CADENCE',
    colBaseUsd: 'BASE USD',
    colTotal: 'TOTAL',
    planDescLine: 'Includes dedicated senior accountant, cloud bookkeeping, payroll tax filing & monthly reporting pack.',
    cadenceDiscountTitle: 'Multi-Month Billing Cadence Savings',
    cadenceDiscountBadge: 'Plan Savings',
    promoDiscountTitle: 'Applied Promotional / Partner Discount',
    vatLineTitle: 'Statutory Value Added Tax & Sales Levy (VAT 7.5%)',
    vatRateLabel: '7.5% VAT',
    setupLineTitle: 'Enterprise Pod Setup, Client Vault Onboarding & Ledger Ingestion',
    includedLabel: 'Included',
    waivedLabel: 'WAIVED ($0)',
    freeLabel: 'FREE ($0.00)',
    summaryGross: 'GROSS SUBTOTAL:',
    summaryDiscount: 'TOTAL DISCOUNTS:',
    summaryNetSubtotal: 'NET SUBTOTAL (EXCL. VAT):',
    summaryVat: 'STATUTORY VAT (7.5%):',
    summaryTotalQuote: 'TOTAL ESTIMATE:',
    summaryTotalReceipt: 'GRAND TOTAL PAID:',
    slaHeading: 'OUTSOURCING SLA COMMITMENTS',
    slaPoints: [
      '• Account provisioning initiated immediately upon transaction confirmation.',
      '• Dedicated Pod Allocation: Chartered bookkeeper & payroll specialist assigned in < 15 mins.',
      '• Executive Lead Kickoff: Strategy and chart-of-accounts session within 2 business hours.',
    ],
    activationHeading: 'EXPECTED SERVICE ACTIVATION & ONBOARDING TIMELINE',
    activationStages: [
      'Stage 1: Instant Client Workspace & Secure Document Vault access enabled.',
      'Stage 2: Assignment of regional compliance officers across your target African jurisdictions.',
      'Stage 3: Integration with QuickBooks, Xero, ERPs, and automated payroll disbursement schedules.',
    ],
    legalHeading: 'TERMS OF ENGAGEMENT & STATUTORY COMPLIANCE NOTICE',
    legalBodyQuote:
      'This document serves as an official pricing quotation issued under licensed Pan-African corporate outsourcing frameworks. All services are governed by the MsmeBooks Master Services Agreement (MSA) and Service Level Agreement (SLA). Retention of financial records complies with NDPR, POPIA, GDPR, and regional tax statutes.',
    legalBodyReceipt:
      'This document serves as an electronic commercial tax receipt and proof of subscription payment. Issued under licensed Pan-African corporate outsourcing frameworks and governed by the MsmeBooks Master Services Agreement (MSA) and SLA. Compliant with NDPR, POPIA, GDPR, and applicable Value Added Tax (7.5%) statutory frameworks.',
    footerVerify: 'DIGITAL FINGERPRINT CERTIFIED',
    footerSupport: 'Support & Queries: billing@multibiz-africa.com | support.multibiz.com',
    filePrefixQuote: 'MultiBiz_ServiceQuote',
    filePrefixReceipt: 'MultiBiz_SubscriptionReceipt',
  },
  fr: {
    brandSubtitle: 'Externalisation Comptable, Paie & Conseil Juridique Panafricain',
    brandTag: 'Services Financiers Agréés & Équipes Dédiées Conformes OHADA',
    docTitleQuote: 'DEVIS OFFICIEL DE SERVICES',
    docTitleReceipt: 'FACTURE FISCALE & REÇU',
    refLabel: 'Réf :',
    entityHeading: 'ENTITÉ CLIENTE SOUSCRIPTRICE',
    regLabel: 'RCCM / N° Registre :',
    taxLabel: 'IFU / N° Contribuable :',
    emailLabel: 'E-mail de facturation :',
    jurisdictionLabel: 'Juridiction :',
    paymentHeadingQuote: 'DÉTAILS DU DEVIS & RÈGLEMENT',
    paymentHeadingReceipt: 'VALIDATION DE PAIEMENT & PASSERELLE',
    gatewayLabel: 'Passerelle de paiement :',
    timeLabel: 'Heure de transaction :',
    cadenceLabel: 'Périodicité :',
    fxLabel: 'Taux de change appliqué :',
    monthsLabel: 'Mois',
    statusQuote: 'VALABLE 30 JOURS • TARIF GARANTI',
    statusReceipt: 'RÉGLÉ & CERTIFIÉ - PAYÉ INTÉGRALEMENT',
    colDesc: 'DÉSIGNATION & PÉRIMÈTRE D’EXTERNALISATION',
    colCadence: 'PÉRIODE',
    colBaseUsd: 'BASE USD',
    colTotal: 'MONTANT',
    planDescLine: 'Inclut comptable agréé dédié, tenue de livres SYSCOHADA, déclarations sociales/fiscales & reporting.',
    cadenceDiscountTitle: 'Remise commerciale sur engagement plurimensuel',
    cadenceDiscountBadge: 'Remise Cycle',
    promoDiscountTitle: 'Code promotionnel / Remise partenaire appliquée',
    vatLineTitle: 'Taxe sur la Valeur Ajoutée Statutaire (TVA 7,5%)',
    vatRateLabel: 'TVA 7,5%',
    setupLineTitle: 'Déploiement de l’équipe dédiée, coffre-fort numérique & reprise des balances',
    includedLabel: 'Inclus',
    waivedLabel: 'OFFERT (0 $)',
    freeLabel: 'GRATUIT (0,00)',
    summaryGross: 'MONTANT BRUT HT :',
    summaryDiscount: 'TOTAL REMISES :',
    summaryNetSubtotal: 'SOUS-TOTAL NET HT :',
    summaryVat: 'TVA STATUTAIRE (7,5%) :',
    summaryTotalQuote: 'TOTAL ESTIME TTC :',
    summaryTotalReceipt: 'TOTAL TTC PAYÉ :',
    slaHeading: 'ENGAGEMENTS DE NIVEAU DE SERVICE (SLA)',
    slaPoints: [
      '• Provisionnement immédiat du portail client dès confirmation de la passerelle.',
      '• Affectation de l’équipe dédiée : Expert-comptable & gestionnaire paie sous 15 min.',
      '• Réunion de lancement : Alignement du plan comptable SYSCOHADA sous 2 heures ouvrées.',
    ],
    activationHeading: 'CALENDRIER D’ACTIVATION DES SERVICES & INTÉGRATION',
    activationStages: [
      'Étape 1 : Accès instantané à l’espace client sécurisé et au coffre-fort documentaire TLS 256 bits.',
      'Étape 2 : Affectation des spécialistes conformité fiscale locale (UEMOA, CEMAC & zones OHADA).',
      'Étape 3 : Connexion ERP, Sage/QuickBooks/Xero et automatisation des états de paie et TVA.',
    ],
    legalHeading: 'MENTIONS LÉGALES, CONFORMITÉ OHADA & PROTECTION DES DONNÉES',
    legalBodyQuote:
      'Ce document constitue un devis commercial officiel émis conformément aux dispositions de l’Acte Uniforme OHADA relatif au Droit Comptable et à l’Information Financière (AUDCIF / SYSCOHADA). Les prestations sont régies par le Contrat Cadre de Services (MSA) et le SLA MsmeBooks. Conformité fiscale UEMOA/CEMAC et protection des données (RGPD / lois locales).',
    legalBodyReceipt:
      'Ce document tient lieu de facture fiscale électronique et de justificatif officiel de règlement. Établi conformément aux normes comptables SYSCOHADA (AUDCIF), aux règles de facturation fiscale des zones UEMOA/CEMAC (TVA 7,5% incluse) et aux exigences de conservation légale et de protection des données personnelles (RGPD / autorités locales).',
    footerVerify: 'EMPREINTE NUMÉRIQUE CERTIFIÉE OHADA',
    footerSupport: 'Assistance & Facturation : billing@multibiz-africa.com | support.multibiz.com',
    filePrefixQuote: 'MultiBiz_DevisServices',
    filePrefixReceipt: 'MultiBiz_RecuPaiement',
  },
};

export const generateSubscriptionPDF = (data: PDFReceiptData): void => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Determine language dynamically from LanguageContext or fallback
  const lang: Language = data.language || 'en';
  const copy = PDF_COPY[lang];
  const intlLocale = lang === 'fr' ? 'fr-FR' : 'en-US';
  const fmt = (usd: number) => formatPrice(usd, data.selectedCurrency, lang, true);
  const fmtUsd = (usd: number) => {
    const num = Math.round(usd).toLocaleString(intlLocale).replace(/[\u00A0\u202F]/g, ' ');
    return lang === 'fr' ? `${num} $ USD` : `$${num} USD`;
  };

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const isQuote = data.documentType === 'quote';

  const dateObj = data.paymentDate || new Date();
  const dateFormatted = dateObj.toLocaleDateString(intlLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeFormatted = dateObj.toLocaleTimeString(intlLocale, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Discount calculations
  const cadenceDiscountUSD = data.cadenceDiscountUSD || 0;
  const promoDiscountUSD = data.promoDiscountUSD || 0;
  const totalDiscountUSD = data.totalDiscountUSD ?? (cadenceDiscountUSD + promoDiscountUSD);
  const grossSubtotalUSD = data.grossSubtotalUSD ?? (data.subtotalUSD + totalDiscountUSD);
  const hasDiscounts = totalDiscountUSD > 0;

  // --- Background / Frame ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setFillColor(163, 230, 53); // lime-400
  doc.rect(0, 40, pageWidth, 2.5, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('MULTIBIZ OUTSOURCING', margin, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184);
  doc.text(copy.brandSubtitle, margin, 23.5);
  doc.text(copy.brandTag, margin, 28.5);

  // Document Type Header Badge (Right side)
  doc.setFillColor(24, 34, 53);
  doc.roundedRect(pageWidth - margin - 68, 9, 68, 23, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(163, 230, 53);
  doc.text(isQuote ? copy.docTitleQuote : copy.docTitleReceipt, pageWidth - margin - 34, 16.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`${copy.refLabel} ${data.receiptNumber}`, pageWidth - margin - 34, 22.5, { align: 'center' });
  doc.setTextColor(148, 163, 184);
  doc.text(dateFormatted, pageWidth - margin - 34, 27.5, { align: 'center' });

  let y = 50;

  // --- Two Column Info Block: Customer KYB & Transaction Meta ---
  const colWidth = (contentWidth - 8) / 2;

  // Left Box: Subscribing Entity
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, colWidth, 40, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(copy.entityHeading, margin + 4, y + 6.5);

  doc.setFontSize(10);
  doc.setTextColor(30, 41, 59);
  doc.text(data.companyName, margin + 4, y + 14.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139);
  doc.text(`${copy.regLabel} ${data.registrationNo}`, margin + 4, y + 20.5);
  doc.text(`${copy.taxLabel} ${data.taxId || 'N/A'}`, margin + 4, y + 25.5);
  doc.text(`${copy.emailLabel} ${data.contactEmail}`, margin + 4, y + 30.5);
  doc.text(`${copy.jurisdictionLabel} ${data.selectedCountry.name}`, margin + 4, y + 35.5);

  // Right Box: Payment & Gateway Verification
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin + colWidth + 8, y, colWidth, 40, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(isQuote ? copy.paymentHeadingQuote : copy.paymentHeadingReceipt, margin + colWidth + 12, y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(100, 116, 139);
  doc.text(`${copy.gatewayLabel} ${data.gatewayName}`, margin + colWidth + 12, y + 13.5);
  doc.text(`${copy.timeLabel} ${timeFormatted} UTC`, margin + colWidth + 12, y + 18.5);
  doc.text(`${copy.cadenceLabel} ${data.billingCycle.toUpperCase()} (${data.periodMonths} ${copy.monthsLabel})`, margin + colWidth + 12, y + 23.5);
  const fx = EXCHANGE_RATES[data.selectedCurrency] || 1;
  const fxFormatted = fx.toLocaleString(intlLocale).replace(/[\u00A0\u202F]/g, ' ');
  doc.text(`${copy.fxLabel} 1 USD = ${fxFormatted} ${data.selectedCurrency}`, margin + colWidth + 12, y + 28.5);

  // Payment Status Pill
  if (isQuote) {
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(191, 219, 254);
    doc.roundedRect(margin + colWidth + 12, y + 31.5, colWidth - 20, 6, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(29, 78, 216);
    doc.text(copy.statusQuote, margin + colWidth + 12 + (colWidth - 20) / 2, y + 35.5, { align: 'center' });
  } else {
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(margin + colWidth + 12, y + 31.5, colWidth - 20, 6, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(4, 120, 87);
    doc.text(copy.statusReceipt, margin + colWidth + 12 + (colWidth - 20) / 2, y + 35.5, { align: 'center' });
  }

  y += 46;

  // --- Line Items Table ---
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(255, 255, 255);
  doc.text(copy.colDesc, margin + 4, y + 5.5);
  doc.text(copy.colCadence, margin + 103, y + 5.5);
  doc.text(copy.colBaseUsd, margin + 128, y + 5.5);
  doc.text(`${copy.colTotal} (${data.selectedCurrency})`, pageWidth - margin - 4, y + 5.5, { align: 'right' });

  y += 8;

  // Table Row 1: Core Plan (Gross before discounts)
  const rowHeight = 15;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, y, contentWidth, rowHeight, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(data.planName, margin + 4, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(100, 116, 139);
  doc.text(copy.planDescLine, margin + 4, y + 10.5, { maxWidth: 96 });

  doc.setFontSize(7.8);
  doc.setTextColor(30, 41, 59);
  doc.text(`${data.periodMonths} ${copy.monthsLabel}`, margin + 103, y + 7.5);
  doc.text(fmtUsd(grossSubtotalUSD), margin + 128, y + 7.5);

  doc.setFont('helvetica', 'bold');
  doc.text(fmt(grossSubtotalUSD), pageWidth - margin - 4, y + 7.5, { align: 'right' });

  y += rowHeight;

  // Optional Discount Rows (Billing Cycle Discount & Promo Discount)
  if (cadenceDiscountUSD > 0) {
    const discRowHeight = 8.5;
    doc.setFillColor(236, 253, 245);
    doc.rect(margin, y, contentWidth, discRowHeight, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(4, 120, 87);
    doc.text(`${copy.cadenceDiscountTitle} (${data.billingCycle.toUpperCase()})`, margin + 4, y + 5.6);
    doc.text(copy.cadenceDiscountBadge, margin + 103, y + 5.6);
    doc.text(`-${fmtUsd(cadenceDiscountUSD)}`, margin + 128, y + 5.6);
    doc.setFont('helvetica', 'bold');
    doc.text(`-${fmt(cadenceDiscountUSD)}`, pageWidth - margin - 4, y + 5.6, { align: 'right' });

    y += discRowHeight;
  }

  if (promoDiscountUSD > 0 && data.promoCode) {
    const promoRowHeight = 8.5;
    doc.setFillColor(236, 253, 245);
    doc.rect(margin, y, contentWidth, promoRowHeight, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(4, 120, 87);
    doc.text(`${copy.promoDiscountTitle}: ${data.promoCode} (-${data.promoDiscountPercent || 0}%)`, margin + 4, y + 5.6);
    doc.text('Promo', margin + 103, y + 5.6);
    doc.text(`-${fmtUsd(promoDiscountUSD)}`, margin + 128, y + 5.6);
    doc.setFont('helvetica', 'bold');
    doc.text(`-${fmt(promoDiscountUSD)}`, pageWidth - margin - 4, y + 5.6, { align: 'right' });

    y += promoRowHeight;
  }

  // Table Row: Statutory VAT (7.5%)
  const vatRowHeight = 8.5;
  doc.setFillColor(248, 250, 252);
  doc.rect(margin, y, contentWidth, vatRowHeight, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  doc.text(copy.vatLineTitle, margin + 4, y + 5.6);
  doc.text(copy.vatRateLabel, margin + 103, y + 5.6);
  doc.text(fmtUsd(data.vatUSD), margin + 128, y + 5.6);
  doc.text(fmt(data.vatUSD), pageWidth - margin - 4, y + 5.6, { align: 'right' });

  y += vatRowHeight;

  // Table Row: Account Onboarding & Vault Provisioning
  const setupRowHeight = 8.5;
  doc.setFillColor(255, 255, 255);
  doc.rect(margin, y, contentWidth, setupRowHeight, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.8);
  doc.setTextColor(71, 85, 105);
  doc.text(copy.setupLineTitle, margin + 4, y + 5.6, { maxWidth: 96 });
  doc.text(copy.includedLabel, margin + 103, y + 5.6);
  doc.text(copy.waivedLabel, margin + 128, y + 5.6);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(5, 150, 105);
  doc.text(copy.freeLabel, pageWidth - margin - 4, y + 5.6, { align: 'right' });

  y += setupRowHeight + 5;

  // --- Total Summary Box (Right Aligned) ---
  const summaryBoxWidth = 88;
  const summaryX = pageWidth - margin - summaryBoxWidth;
  const summaryHeight = hasDiscounts ? 34 : 25;

  doc.setFillColor(15, 23, 42);
  doc.roundedRect(summaryX, y, summaryBoxWidth, summaryHeight, 2, 2, 'F');

  let sy = y + 5.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  if (hasDiscounts) {
    doc.setTextColor(148, 163, 184);
    doc.text(copy.summaryGross, summaryX + 4, sy);
    doc.setTextColor(226, 232, 240);
    doc.text(fmt(grossSubtotalUSD), summaryX + summaryBoxWidth - 4, sy, { align: 'right' });
    sy += 5;

    doc.setTextColor(52, 211, 153);
    doc.text(copy.summaryDiscount, summaryX + 4, sy);
    doc.text(`-${fmt(totalDiscountUSD)}`, summaryX + summaryBoxWidth - 4, sy, { align: 'right' });
    sy += 5;
  }

  doc.setTextColor(148, 163, 184);
  doc.text(copy.summaryNetSubtotal, summaryX + 4, sy);
  doc.setTextColor(255, 255, 255);
  doc.text(fmt(data.subtotalUSD), summaryX + summaryBoxWidth - 4, sy, { align: 'right' });
  sy += 5;

  doc.setTextColor(148, 163, 184);
  doc.text(copy.summaryVat, summaryX + 4, sy);
  doc.setTextColor(255, 255, 255);
  doc.text(fmt(data.vatUSD), summaryX + summaryBoxWidth - 4, sy, { align: 'right' });
  sy += 3;

  // Divider inside summary box
  doc.setDrawColor(51, 65, 85);
  doc.line(summaryX + 4, sy, summaryX + summaryBoxWidth - 4, sy);
  sy += 5.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(163, 230, 53);
  doc.text(isQuote ? copy.summaryTotalQuote : copy.summaryTotalReceipt, summaryX + 4, sy);
  doc.setFontSize(10.5);
  doc.text(fmt(data.grandTotalUSD), summaryX + summaryBoxWidth - 4, sy, { align: 'right' });

  // Left Note next to summary
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(15, 23, 42);
  doc.text(copy.slaHeading, margin, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(100, 116, 139);
  copy.slaPoints.forEach((pt, idx) => {
    doc.text(pt, margin, y + 11.5 + idx * 4.8, { maxWidth: contentWidth - summaryBoxWidth - 6 });
  });

  y += Math.max(summaryHeight, 26) + 7;

  // --- Expected Service Activation Schedule Box ---
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(margin, y, contentWidth, 23, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(22, 101, 52);
  doc.text(copy.activationHeading, margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(21, 128, 61);
  copy.activationStages.forEach((stage, idx) => {
    doc.text(stage, margin + 4, y + 11 + idx * 4.5);
  });

  y += 28;

  // --- Legal / Statutory Notice & Sign-off ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(copy.legalHeading, margin, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(148, 163, 184);
  doc.text(isQuote ? copy.legalBodyQuote : copy.legalBodyReceipt, margin, y + 4, { maxWidth: contentWidth });

  // Verification Bar / Footer
  const footerY = pageHeight - 14;
  doc.setFillColor(241, 245, 249);
  doc.rect(0, footerY - 4, pageWidth, 18, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  const hash = `VERIFY-ID: ${data.receiptNumber}-${Date.now().toString().slice(-8)} | ${copy.footerVerify} (${lang.toUpperCase()})`;
  doc.text(hash, margin, footerY + 2);
  doc.text(copy.footerSupport, pageWidth - margin, footerY + 2, { align: 'right' });

  const safeCompany = data.companyName.replace(/[^a-zA-Z0-9]/g, '_');
  const prefix = isQuote ? copy.filePrefixQuote : copy.filePrefixReceipt;
  doc.save(`${prefix}_${safeCompany}_${data.receiptNumber}_${lang.toUpperCase()}.pdf`);
};
