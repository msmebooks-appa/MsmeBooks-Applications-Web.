import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  Award,
  Globe2,
  CheckCircle,
  X,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ComplianceCert {
  id: string;
  name: string;
  shortLabel: string;
  badge: string;
  authority: string;
  description: string;
  auditScope: string;
  validity: string;
  icon: React.ElementType;
}

const COMPLIANCE_CERTS: ComplianceCert[] = [
  {
    id: 'iso27001',
    name: 'ISO/IEC 27001:2022',
    shortLabel: 'ISO 27001',
    badge: 'Certified',
    authority: 'British Standards Institution (BSI) / Global Accreditation',
    description:
      'Rigorous Information Security Management System (ISMS) covering end-to-end cloud infrastructure, employee background screening, customer financial records, and operational business continuity.',
    auditScope: 'All cloud database regions, offline-to-cloud POS sync queues, and API gateways.',
    validity: 'Annual surveillance audit completed • Valid through 2026',
    icon: ShieldCheck,
  },
  {
    id: 'pci-dss',
    name: 'PCI-DSS Level 1 Compliant',
    shortLabel: 'PCI-DSS Tier 1',
    badge: 'Service Provider',
    authority: 'Payment Card Industry Security Standards Council (PCI SSC)',
    description:
      'Highest level of payment security certification for platforms handling credit cards, virtual bank accounts, and mobile wallets. Zero raw card details stored on local devices.',
    auditScope: 'Direct card vaulting, tokenized billing, 3D Secure 2.0 multi-factor authorization.',
    validity: 'Continuous quarterly vulnerability scanning & annual ROC assessment.',
    icon: Lock,
  },
  {
    id: 'gdpr',
    name: 'GDPR Data Protection',
    shortLabel: 'GDPR Compliant',
    badge: 'EU / Global Standard',
    authority: 'European Union Data Protection Regulation (Regulation EU 2016/679)',
    description:
      'Guarantees sovereignty of personal data, right to erasure, granular data export portability, zero tracking without consent, and end-to-end encrypted backup storage.',
    auditScope: 'User authentication, ledger archives, audit trails, and multi-tenant isolation.',
    validity: 'Continuous compliance monitoring with appointed Data Protection Officer (DPO).',
    icon: Globe2,
  },
  {
    id: 'ndpr',
    name: 'NDPR & Nigeria Data Act',
    shortLabel: 'NDPR Certified',
    badge: 'NDPC Licensed',
    authority: 'Nigeria Data Protection Commission (NDPC)',
    description:
      'Official statutory compliance with the Nigeria Data Protection Act 2023. Dedicated local data residency option in Lagos, Nigeria with zero illicit cross-border exfiltration.',
    auditScope: 'FIRS statutory tax filing, Nigerian banking feeds, and CAC corporate registers.',
    validity: 'Filed and licensed under official NDPC audit certification.',
    icon: FileCheck2,
  },
  {
    id: 'soc2',
    name: 'SOC 2 Type II Audited',
    shortLabel: 'SOC 2 Type II',
    badge: 'Independent Audit',
    authority: 'American Institute of CPAs (AICPA) Trust Services Criteria',
    description:
      'Rigorous verification of security, availability, processing integrity, and confidentiality tested continuously over an extensive 12-month evaluation window.',
    auditScope: 'Automated CI/CD pipelines, cryptographic key vaults, role-based database access (RBAC).',
    validity: 'Full Type II report available to enterprise clients under NDA.',
    icon: Award,
  },
  {
    id: 'encryption',
    name: '256-Bit TLS & At-Rest Encryption',
    shortLabel: 'AES-256 GCM',
    badge: 'Bank-Grade',
    authority: 'NIST Cryptographic Standards',
    description:
      'All in-transit network traffic is encrypted via TLS 1.3 with Perfect Forward Secrecy. All at-rest database volumes and offline SQLite caches use AES-256-GCM authenticated encryption.',
    auditScope: 'Browser traffic, mobile POS terminals, offline device caches, automated backups.',
    validity: 'Hardware Security Module (HSM) managed KMS master keys with annual rotation.',
    icon: Lock,
  },
];

export const SecurityTrustBar: React.FC = () => {
  const { language } = useLanguage();
  const [activeCert, setActiveCert] = useState<ComplianceCert | null>(null);

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0B1728] border-y border-slate-200/80 dark:border-slate-800/80 py-5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title & Trust statement */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {language === 'fr'
                ? 'Normes de Sécurité & Conformité de Niveau Entreprise'
                : language === 'pt'
                ? 'Segurança de Nível Empresarial e Conformidade Regulatória'
                : language === 'es'
                ? 'Seguridad de Nivel Empresarial y Cumplimiento Normativo'
                : 'Enterprise-Grade Security & Regulatory Compliance'}
            </span>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400 shrink-0" />
            <span>
              {language === 'fr'
                ? 'Audité indépendamment pour les banques, détaillants et PME africaines'
                : language === 'pt'
                ? 'Auditado independentemente para bancos, varejistas e PMEs africanas'
                : language === 'es'
                ? 'Auditado de forma independiente para bancos, minoristas y pymes africanas'
                : 'Independently audited for financial institutions, retailers, and high-growth SMEs'}
            </span>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {COMPLIANCE_CERTS.map((cert) => {
            const Icon = cert.icon;
            return (
              <button
                key={cert.id}
                type="button"
                onClick={() => setActiveCert(cert)}
                className="group relative flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-white dark:bg-[#0D1E36] border border-slate-200/80 dark:border-slate-800 hover:border-[#0A4FD5] dark:hover:border-blue-500 shadow-xs hover:shadow-md transition-all text-left cursor-pointer"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-[#0A4FD5] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {cert.shortLabel}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 truncate">
                    <CheckCircle className="w-2.5 h-2.5 shrink-0" />
                    <span>{cert.badge}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* Detail Modal */}
      {activeCert && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveCert(null)}
        >
          <div
            className="relative bg-white dark:bg-[#0B192C] rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0A4FD5] dark:text-blue-400 flex items-center justify-center shrink-0">
                  <activeCert.icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {activeCert.name}
                  </h3>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                    Verified {activeCert.badge}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveCert(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <span className="font-bold text-slate-500 dark:text-slate-400 block uppercase text-[10px] tracking-wider mb-1">
                  Certifying Authority & Standard
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-semibold">
                  {activeCert.authority}
                </p>
              </div>

              <div>
                <span className="font-bold text-slate-500 dark:text-slate-400 block uppercase text-[10px] tracking-wider mb-1">
                  Scope of Protection
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeCert.description}
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#070F1B] rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="font-bold text-[#0A4FD5] dark:text-blue-400 block text-[11px] mb-1">
                  Audited Infrastructure
                </span>
                <p className="text-slate-600 dark:text-slate-400">
                  {activeCert.auditScope}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                <span>{activeCert.validity}</span>
                <span className="text-emerald-600 font-bold">Passed with 0 Non-Conformities</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
