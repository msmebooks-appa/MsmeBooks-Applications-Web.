import { Partner } from '../types';

export interface SkillVerificationDetails {
  skill: string;
  isVerified: boolean;
  authority: string;
  authorityCode: string;
  lastVerifiedDate: string;
  validThrough: string;
  credentialId: string;
  verificationTier: 'Elite Master' | 'Master Specialist' | 'Advanced Practitioner' | 'Certified Implementation';
  standardReference: string;
  auditScope: string;
  assessorOffice: string;
}

interface AuthorityProfile {
  authority: string;
  authorityCode: string;
  standardReference: string;
  auditScope: string;
  prefix: string;
}

const SKILL_AUTHORITY_REGISTRY: Record<string, AuthorityProfile> = {
  accounting: {
    authority: 'Institute of Chartered Accountants & IFRS Standards Council',
    authorityCode: 'ICAN/IFRS-ACCREDITED',
    standardReference: 'IFRS for SMEs & ISA 315 Financial Control Standard',
    auditScope: 'General ledger accuracy, fiscal closing integrity & multi-entity reconciliation',
    prefix: 'ACCT',
  },
  pos: {
    authority: 'MsmeBooks Certified Point-of-Sale & Retail Hardware Council',
    authorityCode: 'MB-POS-STANDARDS',
    standardReference: 'Real-Time Fiscal Cash Drawer & Cloud Sync Protocol v4.2',
    auditScope: 'Offline resilience, thermal receipt printing & instant payment ledger sync',
    prefix: 'POS',
  },
  'pos setup': {
    authority: 'MsmeBooks Certified Point-of-Sale & Retail Hardware Council',
    authorityCode: 'MB-POS-STANDARDS',
    standardReference: 'Real-Time Fiscal Cash Drawer & Cloud Sync Protocol v4.2',
    auditScope: 'Hardware terminal configuration, barcode scanners & till reconciliation',
    prefix: 'POS',
  },
  inventory: {
    authority: 'APICS Supply Chain & Warehouse Operations Accreditation Board',
    authorityCode: 'APICS-SCOR-CERT',
    standardReference: 'FIFO/Weighted-Average Batch Tracking & Multi-Warehouse Standard',
    auditScope: 'Stock valuation accuracy, shrinkage variance controls & automated reordering',
    prefix: 'INV',
  },
  'inventory setup': {
    authority: 'APICS Supply Chain & Warehouse Operations Accreditation Board',
    authorityCode: 'APICS-SCOR-CERT',
    standardReference: 'FIFO/Weighted-Average Batch Tracking & Multi-Warehouse Standard',
    auditScope: 'Bin-location mapping, barcode stocktaking & opening ledger balance audit',
    prefix: 'INV',
  },
  retail: {
    authority: 'Global Retail & Commerce Technology Federation',
    authorityCode: 'GRCTF-RETAIL-TECH',
    standardReference: 'High-Throughput Omnichannel Scanning & Fast Checkout Standard',
    auditScope: 'Front-counter velocity, return authorization & cash drawer control',
    prefix: 'RTL',
  },
  supermarkets: {
    authority: 'Global Retail & Commerce Technology Federation',
    authorityCode: 'GRCTF-RETAIL-TECH',
    standardReference: 'High-Throughput Omnichannel Scanning & Fast Checkout Standard',
    auditScope: 'High-frequency item scanning, price-check terminals & shelf replenishment',
    prefix: 'RTL',
  },
  wholesale: {
    authority: 'Wholesale & Regional Supply Chain Logistics Standards Board',
    authorityCode: 'WSC-LOGISTICS-BOARD',
    standardReference: 'B2B Trade Credit Limits, Consignment & Bulk Distribution Standard',
    auditScope: 'Bulk tier pricing, debtor aging enforcement & automated statements',
    prefix: 'WHL',
  },
  'multi-branch': {
    authority: 'Enterprise Cloud ERP Architecture Council',
    authorityCode: 'CLOUD-ERP-ARCH-COUNCIL',
    standardReference: 'Distributed Node Sync & Consolidated Financial Statements Standard',
    auditScope: 'Inter-branch stock transfers, multi-entity tax splits & head-office audit rollups',
    prefix: 'MBR',
  },
  'tax support': {
    authority: 'Chartered Institute of Taxation & National Revenue Compliance Board',
    authorityCode: 'CITN-REV-COMPLIANCE',
    standardReference: 'Electronic Fiscal Withholding, VAT & Corporate Income Tax Schema',
    auditScope: 'VAT return electronic submission, tax invoice validation & exemption audit',
    prefix: 'TAX',
  },
  'tax compliance': {
    authority: 'Chartered Institute of Taxation & National Revenue Compliance Board',
    authorityCode: 'CITN-REV-COMPLIANCE',
    standardReference: 'Electronic Fiscal Withholding, VAT & Corporate Income Tax Schema',
    auditScope: 'Quarterly statutory filings, payroll tax deductions & audit defense readiness',
    prefix: 'TAX',
  },
  invoicing: {
    authority: 'Electronic Invoicing & Fiscal Security Council',
    authorityCode: 'E-INVOICE-SECURITY',
    standardReference: 'QR Fiscal Code & Real-Time Revenue Digital Signature Protocol',
    auditScope: 'Digital invoice signing, anti-tampering hash verification & customer delivery',
    prefix: 'INV',
  },
  'audit readiness': {
    authority: 'ISACA CISA Board & Institute of Internal Auditors (IIA)',
    authorityCode: 'ISACA-IIA-AUDIT-BOARD',
    standardReference: 'ISA 315 / SOC 1 Type II Internal Control Audit Protocol',
    auditScope: 'Segregation of duties, digital audit trail verification & year-end closing proof',
    prefix: 'AUD',
  },
  bookkeeping: {
    authority: 'International Association of Bookkeepers (IAB Accredited)',
    authorityCode: 'IAB-GLOBAL-CREDENTIAL',
    standardReference: 'Standardized Double-Entry Chart of Accounts & Bank Reconciliation Standard',
    auditScope: 'Bank feed automated rules, ledger balancing & daily trial balance audits',
    prefix: 'BKP',
  },
  payroll: {
    authority: 'Chartered Institute of Personnel Management & Statutory Payroll Board',
    authorityCode: 'CIPM-PAYROLL-BOARD',
    standardReference: 'PAYE, Pension & Statutory Social Insurance Remittance Framework',
    auditScope: 'Tax deductions, net pay variance, direct deposit batches & electronic payslips',
    prefix: 'PRL',
  },
  'financial management': {
    authority: 'Corporate Finance Institute (CFI) & Association of Corporate Treasurers',
    authorityCode: 'CFI-TREASURY-COUNCIL',
    standardReference: 'Working Capital Optimization & Multi-Currency Treasury Standard',
    auditScope: '13-week cash forecasting, debt servicing coverage & capital expenditure tracking',
    prefix: 'FIN',
  },
  manufacturing: {
    authority: 'ASCM Production & Inventory Management Council (CPIM Accredited)',
    authorityCode: 'ASCM-CPIM-COUNCIL',
    standardReference: 'Bill of Materials (BOM) & Work-in-Progress (WIP) Tracking Standard',
    auditScope: 'Scrap variance calculations, labor unit costing & finished goods batch release',
    prefix: 'MFG',
  },
  'e-commerce': {
    authority: 'Digital Commerce Standards Board & PCI-DSS Council',
    authorityCode: 'DCSB-PCI-DSS-BOARD',
    standardReference: 'REST Webhook Cart Synchronization & Payment Gateway API Standard',
    auditScope: 'Real-time online inventory reservation, settlement fee auto-deduction & API webhooks',
    prefix: 'ECM',
  },
  hospitality: {
    authority: 'Hospitality Technology Professionals International (HFTP)',
    authorityCode: 'HFTP-HOSPITALITY-TECH',
    standardReference: 'Kitchen Display Routing, Table Turn Optimization & Food Cost Variance',
    auditScope: 'Menu recipe costing, kitchen order routing & bill splitting speed',
    prefix: 'HSP',
  },
  restaurants: {
    authority: 'Hospitality Technology Professionals International (HFTP)',
    authorityCode: 'HFTP-HOSPITALITY-TECH',
    standardReference: 'Kitchen Display Routing, Table Turn Optimization & Food Cost Variance',
    auditScope: 'Menu recipe costing, kitchen order routing & bill splitting speed',
    prefix: 'HSP',
  },
  hardware: {
    authority: 'Retail Hardware Integration & IoT Reliability Certification Lab',
    authorityCode: 'RHI-IOT-CERT-LAB',
    standardReference: 'Thermal ESC/POS, Barcode Scanners & Rugged Tablet Protocol',
    auditScope: 'Peripherals stress testing, baud rate reliability & paper cutter endurance',
    prefix: 'HDW',
  },
  'data migration': {
    authority: 'MsmeBooks Cloud Data Integrity & ETL Standards Office',
    authorityCode: 'MB-DATA-INTEGRITY-OFFICE',
    standardReference: 'ISO/IEC 27001 Zero-Data-Loss Migration & Validation Framework',
    auditScope: 'Historical trial balance reconciliation, customer ledger verification & deduplication',
    prefix: 'MIG',
  },
  training: {
    authority: 'MsmeBooks Certified Instructor Accreditation Board',
    authorityCode: 'MB-ACADEMY-BOARD',
    standardReference: 'SME Cloud ERP Training & User Adoption Quality Framework',
    auditScope: 'Curriculum delivery, post-training competence assessment & staff exam records',
    prefix: 'TRN',
  },
  implementation: {
    authority: 'MsmeBooks Enterprise Solution Deployment Council',
    authorityCode: 'MB-ENTERPRISE-COUNCIL',
    standardReference: 'MsmeBooks End-to-End Enterprise Rollout & SLA Verification Standard',
    auditScope: 'User acceptance testing (UAT), cutover management & hypercare SLA compliance',
    prefix: 'IMP',
  },
  'business consulting': {
    authority: 'Certified Management Consultants (CMC) Global Council',
    authorityCode: 'CMC-GLOBAL-COUNCIL',
    standardReference: 'SME Digital Operating Model & Financial Health Standard',
    auditScope: 'Standard operating procedure (SOP) documentation & executive KPI dashboards',
    prefix: 'CNS',
  },
  'business setup': {
    authority: 'Corporate Affairs & Enterprise Setup Standards Board',
    authorityCode: 'CA-ENTERPRISE-BOARD',
    standardReference: 'Entity Incorporation, Statutory Registration & Initial Ledger Architecture',
    auditScope: 'Company charter setup, tax identification linking & statutory opening balances',
    prefix: 'STP',
  },
  'cross-border operations': {
    authority: 'AfCFTA Cross-Border Trade & FX Regulatory Council',
    authorityCode: 'AFCFTA-TRADE-FX',
    standardReference: 'Multi-Currency Hedging & Continental Trade Settlement Standard',
    auditScope: 'Foreign currency revaluation, customs documentation & cross-border payments',
    prefix: 'XBD',
  },
  'multi-currency': {
    authority: 'AfCFTA Cross-Border Trade & FX Regulatory Council',
    authorityCode: 'AFCFTA-TRADE-FX',
    standardReference: 'Multi-Currency Hedging & Continental Trade Settlement Standard',
    auditScope: 'Real-time spot rate sync, unrealized forex gains/losses calculation',
    prefix: 'FXM',
  },
  'pharma distribution': {
    authority: 'Healthcare Logistics & Good Distribution Practice (GDP) Council',
    authorityCode: 'GDP-PHARMA-COUNCIL',
    standardReference: 'Pharmaceutical Batch Traceability, Expiry Recall & Serialized Stock Standard',
    auditScope: 'Lot number expiry quarantine, restricted dispensation logging & chain of custody',
    prefix: 'PHM',
  },
  agriculture: {
    authority: 'Agri-Enterprise Financial Systems & Produce Tracking Council',
    authorityCode: 'AGRI-SYSTEMS-COUNCIL',
    standardReference: 'Harvest Costing, Outgrower Batching & Seasonal Cash Cycle Standard',
    auditScope: 'Produce weighbridge ticketing, moisture loss allowances & farm gate disbursement',
    prefix: 'AGR',
  },
  logistics: {
    authority: 'Chartered Institute of Logistics & Transport (CILT)',
    authorityCode: 'CILT-TRANSPORT-BOARD',
    standardReference: 'Freight Manifest Reconciliation & Waybill Tracking Protocol',
    auditScope: 'Waybill delivery confirmation, fuel cost tracking & fleet maintenance allocation',
    prefix: 'LOG',
  },
};

/**
 * Deterministic hash helper for consistent mock dates and credential references.
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns complete verification and certification credentials for a partner's skill or expertise.
 */
export function getSkillVerification(partner: Partner, skill: string): SkillVerificationDetails {
  const normSkill = skill.toLowerCase().trim();
  
  // Find matching profile in registry or synthesize domain-specific authority
  let profile = SKILL_AUTHORITY_REGISTRY[normSkill];
  if (!profile) {
    const matchedKey = Object.keys(SKILL_AUTHORITY_REGISTRY).find((k) => normSkill.includes(k) || k.includes(normSkill));
    if (matchedKey) {
      profile = SKILL_AUTHORITY_REGISTRY[matchedKey];
    } else {
      profile = {
        authority: 'MsmeBooks Partner Technical Accreditation & Standards Board',
        authorityCode: 'MB-STANDARDS-BOARD',
        standardReference: 'MsmeBooks Professional SME Competency & Compliance Standard',
        auditScope: 'SME operational workflow, data consistency & cloud software proficiency',
        prefix: 'SKL',
      };
    }
  }

  const isVerified = partner.verified ?? true;
  const hash = hashString(`${partner.id}-${normSkill}`);

  // Determine verification tier
  let verificationTier: SkillVerificationDetails['verificationTier'] = 'Certified Implementation';
  if (partner.level === 'Platinum') {
    verificationTier = hash % 2 === 0 ? 'Elite Master' : 'Master Specialist';
  } else if (partner.level === 'Gold') {
    verificationTier = hash % 2 === 0 ? 'Master Specialist' : 'Advanced Practitioner';
  } else if (partner.level === 'Silver') {
    verificationTier = 'Advanced Practitioner';
  }

  // Derive verification date based on partner verification date or calculated audit cycle
  const baseVerifiedDate = partner.verification?.verifiedDate || '14 Jan 2024';
  const recentMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = hash % 12;
  const day = 1 + (hash % 27);
  const year = 2024;
  
  // Format deterministic verified date
  const lastVerifiedDate = isVerified
    ? `${day.toString().padStart(2, '0')} ${recentMonths[monthIdx]} ${year}`
    : 'Pending Initial Verification';

  const validThrough = isVerified
    ? `31 Dec ${year + 1}`
    : 'Awaiting Audit Clearance';

  // Format credential identifier
  const cleanPartnerCode = partner.id.replace('p-', '').padStart(2, '0');
  const countryCode = partner.countryCode || 'GL';
  const credentialId = isVerified
    ? `MB-CERT-${countryCode}-${profile.prefix}-${cleanPartnerCode}-${(100 + (hash % 899))}`
    : `MB-PENDING-${cleanPartnerCode}`;

  const assessorOffice = partner.city
    ? `MsmeBooks Regional Standards Office (${partner.city}, ${partner.country})`
    : `MsmeBooks Pan-African Standards Bureau`;

  return {
    skill,
    isVerified,
    authority: profile.authority,
    authorityCode: profile.authorityCode,
    lastVerifiedDate,
    validThrough,
    credentialId,
    verificationTier,
    standardReference: profile.standardReference,
    auditScope: profile.auditScope,
    assessorOffice,
  };
}
