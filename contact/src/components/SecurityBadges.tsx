import React from 'react';

export type SecurityStandardId =
  | 'iso27001'
  | 'soc2'
  | 'pcidss'
  | 'dataprivacy'
  | 'aes256'
  | 'taxcompliance';

interface SecurityLogoProps {
  id: SecurityStandardId;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SecurityLogo: React.FC<SecurityLogoProps> = ({
  id,
  size = 'md',
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  switch (id) {
    case 'iso27001':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <div
            className={`${iconSizes[size]} rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center border border-slate-700 shadow-xs ring-1 ring-white/10`}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3/5 h-3/5 text-[#70C038]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        </div>
      );

    case 'soc2':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <div
            className={`${iconSizes[size]} rounded-xl bg-[#0B3B82] text-white flex items-center justify-center border border-blue-400/30 shadow-xs ring-1 ring-white/10`}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3/5 h-3/5 text-amber-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        </div>
      );

    case 'pcidss':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <div
            className={`${iconSizes[size]} rounded-xl bg-sky-900 text-white flex items-center justify-center border border-sky-600/40 shadow-xs ring-1 ring-white/10`}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3/5 h-3/5 text-sky-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
              <circle cx="7" cy="15" r="1" />
              <circle cx="11" cy="15" r="1" />
            </svg>
          </div>
        </div>
      );

    case 'dataprivacy':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <div
            className={`${iconSizes[size]} rounded-xl bg-emerald-900 dark:bg-emerald-950 text-white flex items-center justify-center border border-emerald-600/40 shadow-xs ring-1 ring-white/10`}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3/5 h-3/5 text-[#70C038]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
              <path d="M9 12h6" />
              <path d="M12 9v6" />
            </svg>
          </div>
        </div>
      );

    case 'aes256':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <div
            className={`${iconSizes[size]} rounded-xl bg-indigo-950 text-white flex items-center justify-center border border-indigo-600/40 shadow-xs ring-1 ring-white/10`}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3/5 h-3/5 text-indigo-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>
      );

    case 'taxcompliance':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <div
            className={`${iconSizes[size]} rounded-xl bg-amber-950 dark:bg-amber-900 text-white flex items-center justify-center border border-amber-500/40 shadow-xs ring-1 ring-white/10`}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3/5 h-3/5 text-amber-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" x2="8" y1="13" y2="13" />
              <line x1="16" x2="8" y1="17" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
        </div>
      );

    default:
      return null;
  }
};

export interface SecurityStandardDetails {
  id: SecurityStandardId;
  code: string;
  shortName: string;
  fullName: string;
  auditor: string;
  scope: string;
  lastAuditDate: string;
  certificateRef: string;
  dataCenterHubs: string;
  encryptionStandard: string;
  jurisdiction: string;
  benefits: string[];
}

export const SECURITY_STANDARDS_DATA: SecurityStandardDetails[] = [
  {
    id: 'iso27001',
    code: 'ISO/IEC 27001',
    shortName: 'ISO 27001 Certified',
    fullName: 'Information Security Management System (ISMS)',
    auditor: 'BSI Global Assurance & PECB Audits',
    scope: 'Cloud Core, Database Ledgers, POS Telemetry, Client Backup Systems',
    lastAuditDate: 'Annual Recertification 2026',
    certificateRef: 'ISMS-AFR-2026-9942',
    dataCenterHubs: 'Lagos (MDXi), Nairobi (Africa Data Centres), Johannesburg (Teraco)',
    encryptionStandard: 'AES-256 at rest, TLS 1.3 in transit with Perfect Forward Secrecy',
    jurisdiction: 'Pan-African & Global ISO Standards',
    benefits: [
      'Comprehensive zero-trust information security policies',
      'Continuous automated vulnerability penetration testing',
      'Strict access control with multi-factor biometric authentication',
      'Incident response guarantee with 15-minute SLA dispatch',
    ],
  },
  {
    id: 'soc2',
    code: 'AICPA SOC 2 Type II',
    shortName: 'SOC 2 Type II Certified',
    fullName: 'Service Organization Control: Security, Availability & Confidentiality',
    auditor: 'Independent Big-4 CPA Auditing Firm',
    scope: 'SaaS Platform Infrastructure, Data Pipeline, Customer Accounting Ledgers',
    lastAuditDate: 'Clean Unqualified Opinion (2025/2026)',
    certificateRef: 'SOC2-MSME-TY2-8810',
    dataCenterHubs: 'Equinix & AWS Sovereign African Cloud Regions (Cape Town & West Africa)',
    encryptionStandard: 'FIPS 140-2 Validated Hardware Security Modules (HSM)',
    jurisdiction: 'AICPA Global Trust Services Criteria',
    benefits: [
      'Audited operational effectiveness over a continuous 12-month window',
      'Guaranteed 99.98% system uptime & high availability architecture',
      'Rigorous background checks on all platform engineering staff',
      'Encrypted immutable audit logs for all financial mutations',
    ],
  },
  {
    id: 'pcidss',
    code: 'PCI-DSS Level 1',
    shortName: 'PCI-DSS Level 1 Compliant',
    fullName: 'Payment Card Industry Data Security Standard',
    auditor: 'Qualified Security Assessor (QSA) Council',
    scope: 'POS Terminals, Mobile Money Integrations, Card-on-File Billing Gateways',
    lastAuditDate: 'Quarterly ASV Vulnerability Scan Verified',
    certificateRef: 'PCI-L1-AFRICA-2026',
    dataCenterHubs: 'PCI Certified Tier-3/4 Carrier-Neutral Facilities',
    encryptionStandard: 'Tokenized Card Vaults & Point-to-Point Encryption (P2PE)',
    jurisdiction: 'Global Payment Card Industry Security Standards Council',
    benefits: [
      'Cardholder data never touches unencrypted merchant memory',
      'Instant integration with Visa, Mastercard, Verve & African Mobile Money',
      'Tamper-evident Bluetooth & physical POS terminal protection',
      'Protection against chargeback fraud & transaction replay attacks',
    ],
  },
  {
    id: 'dataprivacy',
    code: 'NDPR · POPIA · GDPR',
    shortName: 'African Data Sovereignty Compliant',
    fullName: 'National Data Protection Regulation & POPIA Compliance',
    auditor: 'Data Protection Compliance Organization (DPCO)',
    scope: 'Customer PII, Employee Payroll, Merchant Transaction History',
    lastAuditDate: 'Annual Data Protection Audit Filed',
    certificateRef: 'DPA-NG-SA-KE-2026',
    dataCenterHubs: 'In-Country & Regional African Sovereign Data Residency',
    encryptionStandard: 'Pseudonymized & Anonymized Data Storage Architecture',
    jurisdiction: 'Nigeria (NDPA 2023), South Africa (POPIA), Kenya (DPA), EU (GDPR)',
    benefits: [
      '100% adherence to local data sovereignty laws (data remains on African soil)',
      'Zero commercial sale or third-party syndication of client business data',
      'Right to erasure and full merchant data export at any time (JSON/Excel/CSV)',
      'Dedicated Data Protection Officer (DPO) available for compliance queries',
    ],
  },
  {
    id: 'aes256',
    code: 'AES-256 & TLS 1.3',
    shortName: '256-Bit Cryptographic Vault',
    fullName: 'Military-Grade Cryptographic Data Protection',
    auditor: 'Automated Cryptographic Key Rotation & OWASP Verified',
    scope: 'Local Offline Cache, Database Storage, Real-time WebSockets & API Tokens',
    lastAuditDate: 'Continuous Automated Cryptographic Verification',
    certificateRef: 'CRYPTO-FIPS-256',
    dataCenterHubs: 'Distributed Multi-Region Encrypted Cluster',
    encryptionStandard: 'Advanced Encryption Standard (AES) with 256-bit symmetric keys',
    jurisdiction: 'NIST & International Cryptographic Standards',
    benefits: [
      'Offline point-of-sale transactions encrypted with unique local device keys',
      'Zero-knowledge isolation between enterprise merchant accounts',
      'Automated daily encrypted snapshot backups across geographically separated vaults',
      'Resistant to brute force and quantum cryptanalysis attack vectors',
    ],
  },
  {
    id: 'taxcompliance',
    code: 'KRA · FIRS · SARS · SYSCOHADA',
    shortName: 'Fiscal & Tax Engine Certified',
    fullName: 'Pan-African Revenue Authority Electronic Fiscal Compliance',
    auditor: 'Certified by National Revenue Services & Regional Fiscal Bodies',
    scope: 'Automated VAT Invoicing, Electronic Fiscal Devices (eTIMS/EBM), SYSCOHADA',
    lastAuditDate: '2026 Fiscal Certification Active',
    certificateRef: 'TAX-AFR-ETIMS-FIRS-SARS',
    dataCenterHubs: 'Direct Real-time Revenue Authority Secure Gateways',
    encryptionStandard: 'Cryptographically Signed Digital Tax QR Codes & Audit Receipts',
    jurisdiction: 'Kenya (KRA), Nigeria (FIRS), South Africa (SARS), West Africa (OHADA)',
    benefits: [
      'Automated transmission of fiscal invoice receipts with verified digital QR codes',
      'Pre-configured chart of accounts compliant with SYSCOHADA & IFRS',
      'Eliminates tax audit fines and manual calculation discrepancies',
      'Seamless multi-tax jurisdiction calculations across cross-border branches',
    ],
  },
];
