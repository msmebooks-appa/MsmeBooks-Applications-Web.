import { COUNTRY_COMPLIANCE_DATA, getComplianceForCountry } from '../data/countryCompliance';

export interface TaxLevyItem {
  name: string;
  ratePercent: number;
  amountNgn: number;
  description?: string;
}

export interface RegionalTaxCalculation {
  country: string;
  countryCode: string;
  flag: string;
  taxAuthority: string;
  taxSchemeName: string;
  tinLabel: string;
  tinPlaceholder: string;
  tinFormatRegex?: RegExp;
  baseTaxRatePercent: number;
  effectiveTaxRatePercent: number;
  isB2BExemptEligible: boolean;
  isExempted: boolean;
  netTaxableNgn: number;
  taxAmountNgn: number;
  totalPayableNgn: number;
  breakdown: TaxLevyItem[];
  filingDeadline: string;
  eInvoicingSystem: string;
  statutoryNotice: string;
}

interface CountryTaxRuleConfig {
  taxAuthority: string;
  taxSchemeName: string;
  tinLabel: string;
  tinPlaceholder: string;
  tinRegex?: RegExp;
  eInvoicingSystem: string;
  filingDeadline: string;
  levies: Array<{
    name: string;
    ratePercent: number;
    description?: string;
  }>;
  b2bExemptEligible: boolean;
}

const REGIONAL_TAX_RULES: Record<string, CountryTaxRuleConfig> = {
  Nigeria: {
    taxAuthority: 'Federal Inland Revenue Service (FIRS) / NRS',
    taxSchemeName: 'Value Added Tax (VAT)',
    tinLabel: 'FIRS Tax ID (TIN / JTB)',
    tinPlaceholder: 'e.g. 24810932-0001',
    tinRegex: /^[0-9]{8,10}(-[0-9]{4})?$/,
    eInvoicingSystem: 'FIRS e-Invoicing & Tax Clearance Validation',
    filingDeadline: '21st of every subsequent month',
    levies: [
      {
        name: 'Statutory Output VAT',
        ratePercent: 7.5,
        description: 'Standard exclusive statutory rate under Value Added Tax Act (as amended)',
      },
    ],
    b2bExemptEligible: false, // Standard statutory domestic rate
  },
  Ghana: {
    taxAuthority: 'Ghana Revenue Authority (GRA)',
    taxSchemeName: 'Standard VAT & Statutory Fiscal Levies',
    tinLabel: 'GRA Taxpayer Identification (TIN / Ghana Card PIN)',
    tinPlaceholder: 'e.g. P0012345678 or GHA-123456789-0',
    tinRegex: /^[A-Z0-9-]{10,15}$/i,
    eInvoicingSystem: 'GRA Certified Electronic Invoicing System (E-VAT) with QR Stamp',
    filingDeadline: 'Last working day of following month',
    levies: [
      {
        name: 'Standard VAT',
        ratePercent: 15.0,
        description: 'Standard rate under the Value Added Tax Act 2013 (Act 870)',
      },
      {
        name: 'NHIL (National Health Insurance Levy)',
        ratePercent: 2.5,
        description: 'Earmarked levy supporting National Health Insurance Fund',
      },
      {
        name: 'GETFund (Ghana Education Trust Fund Levy)',
        ratePercent: 2.5,
        description: 'Statutory education development contribution',
      },
      {
        name: 'COVID-19 Health Recovery Levy',
        ratePercent: 1.0,
        description: 'Special statutory fiscal recovery levy',
      },
    ],
    b2bExemptEligible: true,
  },
  Kenya: {
    taxAuthority: 'Kenya Revenue Authority (KRA)',
    taxSchemeName: 'Value Added Tax (VAT)',
    tinLabel: 'KRA PIN (Personal Identification Number)',
    tinPlaceholder: 'e.g. P051234567A',
    tinRegex: /^P[0-9]{9}[A-Z]$/i,
    eInvoicingSystem: 'Mandatory KRA eTIMS (Electronic Tax Invoice Management System)',
    filingDeadline: '20th of every month via KRA iTax',
    levies: [
      {
        name: 'KRA Standard Output VAT',
        ratePercent: 16.0,
        description: 'Standard rate under the Kenya VAT Act 2013',
      },
    ],
    b2bExemptEligible: true,
  },
  'South Africa': {
    taxAuthority: 'South African Revenue Service (SARS)',
    taxSchemeName: 'Value Added Tax (VAT)',
    tinLabel: 'SARS VAT / Tax Reference Number',
    tinPlaceholder: 'e.g. 4120194820 (10 digits)',
    tinRegex: /^4[0-9]{9}$/,
    eInvoicingSystem: 'SARS eFiling Electronic Tax Compliance',
    filingDeadline: 'Last business day of subsequent month',
    levies: [
      {
        name: 'SARS Standard Output VAT',
        ratePercent: 15.0,
        description: 'Standard statutory rate under the South Africa VAT Act 89 of 1991',
      },
    ],
    b2bExemptEligible: true,
  },
  Uganda: {
    taxAuthority: 'Uganda Revenue Authority (URA)',
    taxSchemeName: 'Value Added Tax (VAT)',
    tinLabel: 'URA Tax Identification Number (TIN)',
    tinPlaceholder: 'e.g. 1001234567',
    tinRegex: /^[0-9]{10}$/,
    eInvoicingSystem: 'URA EFRIS (Electronic Fiscal Receipting and Invoicing Solution)',
    filingDeadline: '15th day of the following calendar month',
    levies: [
      {
        name: 'URA Standard VAT',
        ratePercent: 18.0,
        description: 'Standard rate under the Uganda Value Added Tax Act',
      },
    ],
    b2bExemptEligible: true,
  },
  Tanzania: {
    taxAuthority: 'Tanzania Revenue Authority (TRA)',
    taxSchemeName: 'Value Added Tax (VAT)',
    tinLabel: 'TRA TIN & VAT Registration Number (VRN)',
    tinPlaceholder: 'e.g. 123-456-789',
    tinRegex: /^[0-9-]{9,12}$/,
    eInvoicingSystem: 'TRA EFDMS Fiscal Code & Electronic Tax Verification',
    filingDeadline: '20th day of the following month',
    levies: [
      {
        name: 'TRA Standard Output VAT',
        ratePercent: 18.0,
        description: 'Standard rate under Tanzania VAT Act 2014',
      },
    ],
    b2bExemptEligible: true,
  },
  Rwanda: {
    taxAuthority: 'Rwanda Revenue Authority (RRA)',
    taxSchemeName: 'Value Added Tax (VAT)',
    tinLabel: 'RRA Taxpayer Identification Number (TIN)',
    tinPlaceholder: 'e.g. 102345678',
    tinRegex: /^[0-9]{9}$/,
    eInvoicingSystem: 'RRA EBM v2 (Electronic Billing Machine System)',
    filingDeadline: '15th day of the following month',
    levies: [
      {
        name: 'RRA Standard VAT',
        ratePercent: 18.0,
        description: 'Standard statutory rate under Rwanda Law N° 012/2019',
      },
    ],
    b2bExemptEligible: true,
  },
  Egypt: {
    taxAuthority: 'Egyptian Tax Authority (ETA / مصلحة الضرائب المصرية)',
    taxSchemeName: 'Value Added Tax (VAT / ضريبة القيمة المضافة)',
    tinLabel: 'ETA Tax Registration Number (رقم التسجيل الضريبي)',
    tinPlaceholder: 'e.g. 123-456-789 (9 digits)',
    tinRegex: /^[0-9-]{9,11}$/,
    eInvoicingSystem: 'ETA Mandatory E-Invoicing & E-Receipt Electronic Portal',
    filingDeadline: 'Within 30 days of the end of the monthly tax period',
    levies: [
      {
        name: 'General Value Added Tax',
        ratePercent: 14.0,
        description: 'Standard rate under Egyptian VAT Law No. 67 of 2016',
      },
    ],
    b2bExemptEligible: true,
  },
  Cameroon: {
    taxAuthority: 'Direction Générale des Impôts (DGI)',
    taxSchemeName: 'Taxe sur la Valeur Ajoutée (TVA)',
    tinLabel: 'Numéro d\'Identifiant Unique (NIU)',
    tinPlaceholder: 'e.g. M012345678901A',
    tinRegex: /^[A-Z0-9]{13,14}$/i,
    eInvoicingSystem: 'DGI e-Bulletin Télé-déclaration Fiscale',
    filingDeadline: '15th of the month following the transaction',
    levies: [
      {
        name: 'TVA Taux Normal (Base VAT)',
        ratePercent: 17.5,
        description: 'Base statutory rate under Cameroon General Tax Code',
      },
      {
        name: 'Centimes Additionnels Communaux (CAC)',
        ratePercent: 1.75,
        description: 'Municipal council additional surcharge (10% of base VAT)',
      },
    ],
    b2bExemptEligible: true,
  },
  'United Kingdom': {
    taxAuthority: 'HM Revenue & Customs (HMRC)',
    taxSchemeName: 'Standard Rate VAT',
    tinLabel: 'HMRC VAT Registration Number',
    tinPlaceholder: 'e.g. GB 123 4567 89 (9 digits)',
    tinRegex: /^(GB)?\s?[0-9]{9}$/i,
    eInvoicingSystem: 'HMRC Making Tax Digital (MTD) Compliant',
    filingDeadline: '1 calendar month and 7 days after the accounting period',
    levies: [
      {
        name: 'HMRC Standard VAT',
        ratePercent: 20.0,
        description: 'UK Standard Value Added Tax on B2B/B2C digital cloud services',
      },
    ],
    b2bExemptEligible: true,
  },
  'European Union (Eurozone)': {
    taxAuthority: 'EU VAT Directive / One-Stop Shop (OSS)',
    taxSchemeName: 'EU Digital Services VAT',
    tinLabel: 'EU VIES VAT Identification Number',
    tinPlaceholder: 'e.g. DE123456789 or FR12345678901',
    tinRegex: /^[A-Z]{2}[0-9A-Z]{8,12}$/i,
    eInvoicingSystem: 'EU VIES Digital Tax Validation Engine',
    filingDeadline: 'End of the month following the calendar quarter',
    levies: [
      {
        name: 'EU Cross-Border Digital Services VAT',
        ratePercent: 20.0,
        description: 'Standard weighted rate for cross-border SaaS telecommunications & software',
      },
    ],
    b2bExemptEligible: true,
  },
  'United States & Global': {
    taxAuthority: 'US State Departments of Revenue (Multistate)',
    taxSchemeName: 'State Digital Sales Tax / B2B SaaS Exemption',
    tinLabel: 'Federal Employer Identification Number (FEIN / EIN)',
    tinPlaceholder: 'e.g. 12-3456789 (9 digits)',
    tinRegex: /^[0-9]{2}-?[0-9]{7}$/,
    eInvoicingSystem: 'US W-9 Exemption & Electronic Tax Invoice Archive',
    filingDeadline: 'Quarterly state returns as applicable',
    levies: [
      {
        name: 'State & Local Digital Sales Tax',
        ratePercent: 0.0,
        description: 'B2B enterprise digital software and SaaS service zero-rated exemption',
      },
    ],
    b2bExemptEligible: true,
  },
  Canada: {
    taxAuthority: 'Canada Revenue Agency (CRA / ARC)',
    taxSchemeName: 'Goods and Services Tax (GST / TPS)',
    tinLabel: 'CRA Business Number (BN / NE - 9 digits + RT0001)',
    tinPlaceholder: 'e.g. 123456789 RT0001',
    tinRegex: /^[0-9]{9}(\s?RT[0-9]{4})?$/i,
    eInvoicingSystem: 'CRA Electronic Digital Filing Standard',
    filingDeadline: '1 month after the end of the reporting period',
    levies: [
      {
        name: 'Federal Goods and Services Tax (GST)',
        ratePercent: 5.0,
        description: 'Federal statutory rate for cross-border digital software supplies',
      },
    ],
    b2bExemptEligible: true,
  },
  India: {
    taxAuthority: 'Goods and Services Tax Network (GSTN)',
    taxSchemeName: 'Integrated Goods and Services Tax (IGST)',
    tinLabel: 'GSTIN (15-character GST Identification Number)',
    tinPlaceholder: 'e.g. 29ABCDE1234F1Z5',
    tinRegex: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i,
    eInvoicingSystem: 'GSTN E-Way Bill & B2B E-Invoicing System (IRN)',
    filingDeadline: '20th of the subsequent month (GSTR-3B)',
    levies: [
      {
        name: 'Integrated GST (IGST) for Digital Services',
        ratePercent: 18.0,
        description: 'OIDAR cross-border software services GST',
      },
    ],
    b2bExemptEligible: true,
  },
  Australia: {
    taxAuthority: 'Australian Taxation Office (ATO)',
    taxSchemeName: 'Goods and Services Tax (GST)',
    tinLabel: 'Australian Business Number (ABN - 11 digits)',
    tinPlaceholder: 'e.g. 51 824 753 556',
    tinRegex: /^[0-9\s]{11,14}$/,
    eInvoicingSystem: 'ATO Peppol Electronic Invoicing Protocol',
    filingDeadline: '28th of the month following the calendar quarter',
    levies: [
      {
        name: 'ATO Goods and Services Tax (GST)',
        ratePercent: 10.0,
        description: 'Standard 10% statutory GST on digital products & services',
      },
    ],
    b2bExemptEligible: true,
  },
  'United Arab Emirates': {
    taxAuthority: 'Federal Tax Authority (FTA / الهيئة الاتحادية للضرائب)',
    taxSchemeName: 'Value Added Tax (VAT / ضريبة القيمة المضافة)',
    tinLabel: 'Tax Registration Number (TRN - 15 digits)',
    tinPlaceholder: 'e.g. 100 1234 5678 0003',
    tinRegex: /^100[0-9\s]{12,15}$/,
    eInvoicingSystem: 'FTA Electronic Tax Invoicing Compliance',
    filingDeadline: '28th of the month following the end of the tax period',
    levies: [
      {
        name: 'FTA Standard VAT',
        ratePercent: 5.0,
        description: 'Standard VAT under Federal Decree-Law No. (8) of 2017',
      },
    ],
    b2bExemptEligible: true,
  },
};

/**
 * Normalizes input country name to matched tax rule configuration.
 */
function getTaxRuleForCountry(countryName: string): CountryTaxRuleConfig {
  if (REGIONAL_TAX_RULES[countryName]) {
    return REGIONAL_TAX_RULES[countryName];
  }

  const lower = (countryName || '').toLowerCase().trim();

  for (const [key, config] of Object.entries(REGIONAL_TAX_RULES)) {
    if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
      return config;
    }
  }

  // Country compliance data fallback check
  const compliance = getComplianceForCountry(countryName);
  if (compliance && REGIONAL_TAX_RULES[compliance.name]) {
    return REGIONAL_TAX_RULES[compliance.name];
  }

  // Regional heuristic fallbacks
  if (compliance.region === 'west_africa') {
    return {
      taxAuthority: compliance.taxAuthority || 'West African Regional Tax Authority',
      taxSchemeName: 'Value Added Tax (VAT / TVA)',
      tinLabel: 'Corporate Tax ID (TIN / NIF)',
      tinPlaceholder: 'e.g. 123456789',
      eInvoicingSystem: 'Regional Electronic Invoicing Standard',
      filingDeadline: compliance.vatFilingDeadline || '15th of following month',
      levies: [{ name: 'Standard VAT Rate', ratePercent: 18.0 }],
      b2bExemptEligible: true,
    };
  }

  if (compliance.region === 'east_africa') {
    return {
      taxAuthority: compliance.taxAuthority || 'East African Revenue Authority',
      taxSchemeName: 'Value Added Tax (VAT)',
      tinLabel: 'Taxpayer Identification Number (TIN)',
      tinPlaceholder: 'e.g. 1001234567',
      eInvoicingSystem: 'Electronic Fiscal Receipting System',
      filingDeadline: compliance.vatFilingDeadline || '20th of following month',
      levies: [{ name: 'Standard VAT Rate', ratePercent: 16.0 }],
      b2bExemptEligible: true,
    };
  }

  if (compliance.region === 'south_africa') {
    return {
      taxAuthority: compliance.taxAuthority || 'SADC Revenue Service',
      taxSchemeName: 'Value Added Tax (VAT)',
      tinLabel: 'Tax Reference / VAT Number',
      tinPlaceholder: 'e.g. 4001234567',
      eInvoicingSystem: 'Electronic Tax Compliance System',
      filingDeadline: compliance.vatFilingDeadline || 'Last day of following month',
      levies: [{ name: 'Standard VAT Rate', ratePercent: 15.0 }],
      b2bExemptEligible: true,
    };
  }

  // Default international fallback
  return {
    taxAuthority: compliance.taxAuthority || 'Statutory Tax Revenue Service',
    taxSchemeName: 'Value Added Tax (VAT)',
    tinLabel: 'Corporate Tax Identification Number (TIN / VAT)',
    tinPlaceholder: 'e.g. 24810932-0001',
    eInvoicingSystem: 'Compliant Electronic Invoicing Integration',
    filingDeadline: compliance.vatFilingDeadline || 'Monthly statutory filing',
    levies: [{ name: 'Standard Statutory VAT', ratePercent: 7.5 }],
    b2bExemptEligible: false,
  };
}

/**
 * Calculates itemized regional tax, applied levies, and final total based on country and B2B exemption status.
 */
export function calculateRegionalTax(
  countryName: string,
  netTaxableNgn: number,
  isB2BExempt = false,
  userTaxId?: string
): RegionalTaxCalculation {
  const compliance = getComplianceForCountry(countryName);
  const rule = getTaxRuleForCountry(countryName);

  // Check if B2B exemption is validly claimed (requires tax ID and eligible jurisdiction)
  const isExempted =
    isB2BExempt &&
    rule.b2bExemptEligible &&
    Boolean(userTaxId && userTaxId.trim().length >= 5);

  let totalTaxPercent = 0;
  const breakdown: TaxLevyItem[] = [];

  rule.levies.forEach((levy) => {
    totalTaxPercent += levy.ratePercent;
  });

  const effectiveRate = isExempted ? 0 : totalTaxPercent;

  let totalTaxAmountNgn = 0;

  if (!isExempted) {
    rule.levies.forEach((levy) => {
      const levyAmount = Math.round((netTaxableNgn * levy.ratePercent) / 100);
      totalTaxAmountNgn += levyAmount;
      breakdown.push({
        name: levy.name,
        ratePercent: levy.ratePercent,
        amountNgn: levyAmount,
        description: levy.description,
      });
    });
  } else {
    breakdown.push({
      name: `${rule.taxSchemeName} - Reverse Charge / B2B Export Exemption`,
      ratePercent: 0,
      amountNgn: 0,
      description: `B2B Reverse Charge applied under international software supply regulations. Registered TIN: ${userTaxId}. Customer self-accounts for local input tax.`,
    });
  }

  const finalTotalPayableNgn = netTaxableNgn + totalTaxAmountNgn;

  const statutoryNotice = isExempted
    ? `0% Statutory Rate (B2B Reverse-Charge) claimed under ${rule.taxAuthority} regulations. Tax ID: ${userTaxId}.`
    : `Statutory ${effectiveRate}% tax calculated for ${compliance.name} under ${rule.taxAuthority}. Invoicing standard: ${rule.eInvoicingSystem}.`;

  return {
    country: compliance.name,
    countryCode: compliance.code,
    flag: compliance.flag,
    taxAuthority: rule.taxAuthority,
    taxSchemeName: rule.taxSchemeName,
    tinLabel: rule.tinLabel,
    tinPlaceholder: rule.tinPlaceholder,
    tinFormatRegex: rule.tinRegex,
    baseTaxRatePercent: totalTaxPercent,
    effectiveTaxRatePercent: effectiveRate,
    isB2BExemptEligible: rule.b2bExemptEligible,
    isExempted,
    netTaxableNgn,
    taxAmountNgn: totalTaxAmountNgn,
    totalPayableNgn: finalTotalPayableNgn,
    breakdown,
    filingDeadline: rule.filingDeadline,
    eInvoicingSystem: rule.eInvoicingSystem,
    statutoryNotice,
  };
}

/**
 * Validates a country-specific Tax Identification Number.
 */
export function validateTaxId(countryName: string, taxId: string): {
  isValid: boolean;
  message?: string;
} {
  if (!taxId || taxId.trim().length === 0) {
    return { isValid: false, message: 'Tax ID is required' };
  }

  const rule = getTaxRuleForCountry(countryName);
  const cleanId = taxId.trim();

  if (cleanId.length < 5) {
    return { isValid: false, message: 'Tax ID is too short (minimum 5 characters)' };
  }

  if (rule.tinRegex && !rule.tinRegex.test(cleanId)) {
    return {
      isValid: false,
      message: `Expected format: ${rule.tinPlaceholder}`,
    };
  }

  return { isValid: true };
}
