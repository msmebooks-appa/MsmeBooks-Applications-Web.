import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  KeyRound,
  FileCheck2,
  Server,
  Database,
  Globe2,
  CheckCircle2,
  X,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Fingerprint,
  HardDrive,
  Users2,
  AlertCircle,
  Download,
  Mail,
  ChevronRight,
} from 'lucide-react';

export type SecurityTopic = 'encryption' | 'gdpr' | 'protection';

export interface SecurityDetailsPopoverProps {
  /** Visual variant of the trigger */
  variant?: 'sidebar' | 'badge' | 'notice' | 'link' | 'card' | 'custom';
  triggerText?: string;
  triggerClassName?: string;
  children?: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  defaultTopic?: SecurityTopic;
}

export const SecurityDetailsPopover: React.FC<SecurityDetailsPopoverProps> = ({
  variant = 'sidebar',
  triggerText,
  triggerClassName = '',
  children,
  defaultOpen = false,
  onOpenChange,
  defaultTopic = 'encryption',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeTab, setActiveTab] = useState<SecurityTopic>(defaultTopic);
  const [copiedCert, setCopiedCert] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const complianceCertId = 'MSME-SEC-2026-AES256-GDPR-V8';

  const handleOpen = () => {
    setIsOpen(true);
    if (onOpenChange) onOpenChange(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onOpenChange) onOpenChange(false);
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleCopyCertificate = () => {
    navigator.clipboard?.writeText(complianceCertId);
    setCopiedCert(true);
    setTimeout(() => setCopiedCert(false), 2200);
  };

  const handleDownloadWhitepaper = () => {
    const content = `MSMEBOOKS ENTERPRISE SECURITY & COMPLIANCE SPECIFICATION
Document ID: ${complianceCertId}
Generated: ${new Date().toISOString()}

1. DATA ENCRYPTION STANDARDS
- Cipher: AES-256-GCM symmetric encryption for all stored ledger databases, receipts, and sensitive PII.
- Transport: TLS 1.3 enforced across all web, POS, and API endpoints with Perfect Forward Secrecy (PFS).
- Cryptographic Keys: Managed via FIPS 140-2 Level 3 certified Hardware Security Modules (HSM) with strict zero-knowledge isolation.
- Ledger Integrity: SHA-256 immutable sequential hashing for double-entry bookkeeping validation.

2. GDPR & PRIVACY COMPLIANCE
- European Union GDPR (General Data Protection Regulation) Compliant.
- Nigeria Data Protection Regulation (NDPR) / Nigeria Data Protection Act (NDPA) Certified.
- User Rights: Full compliance with Article 17 "Right to Erasure" and structured data portability (JSON/CSV).
- Zero Monetization: Customer financial entries are never resold, shared with ad networks, or mined.
- Data Protection Officer: Designated privacy council oversight (dpo@msmebooks.ng).

3. BUSINESS DATA PROTECTION & TENANCY
- Multi-Tenant Isolation: Logical and schema-level tenancy guards prevent cross-organization data leakage.
- Role-Based Access Control (RBAC): Strict segregation of duties across Owner, Finance Manager, Store Manager, and POS Cashier.
- Business Continuity: Automated differential backups every 15 minutes with multi-region disaster recovery and 99.99% uptime SLA.
- Active Threat Defense: Account lockout countermeasures (5 failed login attempt threshold) and automated anomaly detection.

Verification Link: https://msmebooks.ng/security/compliance/${complianceCertId}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MsmeBooks-Security-Compliance-${new Date().getFullYear()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // Render trigger based on variant
  const renderTrigger = () => {
    if (children) {
      return (
        <div
          onClick={handleOpen}
          className={`cursor-pointer inline-block ${triggerClassName}`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpen();
            }
          }}
        >
          {children}
        </div>
      );
    }

    if (variant === 'sidebar') {
      return (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          id="security-details-trigger-sidebar"
          aria-expanded={isOpen}
          aria-label="Open Security Details popover"
          className={`group flex items-center gap-2.5 text-xs text-slate-300 hover:text-white transition-all text-left cursor-pointer p-1.5 -m-1.5 rounded-lg hover:bg-white/10 ${triggerClassName}`}
        >
          <div className="w-5 h-5 rounded-md bg-[#84CC16]/20 border border-[#84CC16]/50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9AE61C]" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-100 group-hover:text-white flex items-center gap-1.5">
              <span>{triggerText || 'Bank-grade 256-bit encryption'}</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#84CC16]/20 text-[#9AE61C] border border-[#84CC16]/40">
                Details
              </span>
            </span>
            <span className="text-[10px] text-slate-400 group-hover:text-slate-300">
              Click for GDPR & Protection specs
            </span>
          </div>
        </button>
      );
    }

    if (variant === 'badge') {
      return (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          id="security-details-trigger-badge"
          aria-expanded={isOpen}
          aria-label="Open Security Details"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#0F4C81]/10 dark:bg-[#0F4C81]/30 hover:bg-[#0F4C81]/20 dark:hover:bg-[#0F4C81]/45 text-[#0F4C81] dark:text-[#9AE61C] border border-[#0F4C81]/20 dark:border-[#84CC16]/30 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 ${triggerClassName}`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{triggerText || 'Security Details'}</span>
        </button>
      );
    }

    if (variant === 'notice') {
      return (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          id="security-details-trigger-notice"
          aria-expanded={isOpen}
          aria-label="View Data Encryption & Security Details"
          className={`inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#0F4C81] dark:hover:text-[#9AE61C] transition-colors py-1 cursor-pointer group ${triggerClassName}`}
        >
          <Lock className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#9AE61C] group-hover:scale-110 transition-transform" />
          <span className="underline decoration-dotted underline-offset-2">
            {triggerText || 'Enterprise Security & GDPR Details'}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      );
    }

    if (variant === 'card') {
      return (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          id="security-details-trigger-card"
          aria-expanded={isOpen}
          aria-label="Open Security Specifications"
          className={`w-full rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 flex items-center justify-between gap-2.5 text-xs text-slate-600 dark:text-slate-300 transition-all cursor-pointer group text-left ${triggerClassName}`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#0F4C81]/10 dark:bg-[#0F4C81]/30 flex items-center justify-center text-[#0F4C81] dark:text-[#9AE61C] flex-shrink-0 group-hover:scale-105 transition-transform">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#072644] dark:text-white block">
                Enterprise 256-bit Encryption
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {triggerText || 'Click to view GDPR, encryption & business data safeguards'}
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#84CC16]/20 text-[#0F4C81] dark:text-[#9AE61C] flex-shrink-0">
            View Details
          </span>
        </button>
      );
    }

    // Default 'link' variant
    return (
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        id="security-details-trigger-link"
        aria-expanded={isOpen}
        aria-label="View Security and Compliance Details"
        className={`hover:text-[#0F4C81] dark:hover:text-[#9AE61C] transition-colors cursor-pointer inline-flex items-center gap-1 ${triggerClassName}`}
      >
        <span>{triggerText || 'Security & Compliance Details'}</span>
        <ShieldCheck className="w-3 h-3 text-[#84CC16]" />
      </button>
    );
  };

  return (
    <>
      {renderTrigger()}

      {/* Popover / Interactive Security Details Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="security-details-title"
          id="security-details-modal-backdrop"
        >
          <div
            ref={popoverRef}
            id="security-details-popover"
            className="w-full max-w-2xl bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
          >
            {/* Popover Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-linear-to-r from-slate-50 via-white to-slate-50/80 dark:from-[#081726] dark:via-[#0B1E33] dark:to-[#081726]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#0F4C81] to-[#072644] text-white flex items-center justify-center shadow-md flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-[#9AE61C]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        id="security-details-title"
                        className="text-base sm:text-lg font-bold text-[#072644] dark:text-white tracking-tight"
                      >
                        Security & Trust Center
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-[#84CC16]/20 text-[#0F4C81] dark:text-[#9AE61C] border border-[#84CC16]/40 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16] animate-pulse" />
                        Verified Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Technical safeguards protecting accounting ledgers, payment processing, and corporate privacy.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close security details"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Three Main Navigation Tabs */}
              <div
                className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 dark:bg-[#071626] rounded-xl mt-4 border border-slate-200/80 dark:border-slate-800"
                role="tablist"
                aria-label="Security topics"
              >
                <button
                  type="button"
                  role="tab"
                  id="tab-encryption"
                  aria-selected={activeTab === 'encryption'}
                  aria-controls="panel-encryption"
                  onClick={() => setActiveTab('encryption')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'encryption'
                      ? 'bg-white dark:bg-[#0F4C81] text-[#072644] dark:text-white shadow-xs border border-slate-200/60 dark:border-[#0F4C81]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">Data Encryption</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  id="tab-gdpr"
                  aria-selected={activeTab === 'gdpr'}
                  aria-controls="panel-gdpr"
                  onClick={() => setActiveTab('gdpr')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'gdpr'
                      ? 'bg-white dark:bg-[#0F4C81] text-[#072644] dark:text-white shadow-xs border border-slate-200/60 dark:border-[#0F4C81]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">GDPR & Privacy</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  id="tab-protection"
                  aria-selected={activeTab === 'protection'}
                  aria-controls="panel-protection"
                  onClick={() => setActiveTab('protection')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'protection'
                      ? 'bg-white dark:bg-[#0F4C81] text-[#072644] dark:text-white shadow-xs border border-slate-200/60 dark:border-[#0F4C81]'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">Data Protection</span>
                </button>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-left flex-1 text-xs sm:text-sm">
              {/* TAB 1: DATA ENCRYPTION */}
              {activeTab === 'encryption' && (
                <div
                  id="panel-encryption"
                  role="tabpanel"
                  aria-labelledby="tab-encryption"
                  className="space-y-4 animate-in fade-in-50 duration-150"
                >
                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/70 dark:bg-[#071B30] border border-blue-100 dark:border-blue-900/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#0F4C81] text-white flex items-center justify-center flex-shrink-0">
                        <KeyRound className="w-4 h-4 text-[#9AE61C]" />
                      </div>
                      <div>
                        <span className="font-bold text-[#072644] dark:text-white block text-xs sm:text-sm">
                          Military & Banking-Grade AES-256 GCM
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          End-to-end cryptographic pipeline safeguarding corporate accounts
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#0F4C81] dark:text-[#9AE61C]">
                      FIPS 140-2
                    </span>
                  </div>

                  {/* 4 Technical Encryption Pillars */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-[#0F4C81] dark:text-[#9AE61C]" />
                        <span className="font-bold text-[#072644] dark:text-slate-100 text-xs">
                          Data at Rest Encryption
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        All database volumes, electronic invoices, payroll registers, and customer records are encrypted via AES-256 bit symmetric keys before writing to physical storage.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Globe2 className="w-4 h-4 text-[#0F4C81] dark:text-[#9AE61C]" />
                        <span className="font-bold text-[#072644] dark:text-slate-100 text-xs">
                          TLS 1.3 in Transit
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        100% of communication between web clients, mobile terminals, and cloud APIs utilizes TLS 1.3 with Perfect Forward Secrecy (PFS) and strict HSTS headers.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Fingerprint className="w-4 h-4 text-[#0F4C81] dark:text-[#9AE61C]" />
                        <span className="font-bold text-[#072644] dark:text-slate-100 text-xs">
                          HSM Key Management
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Master cryptographic keys reside exclusively inside dedicated Hardware Security Modules (HSM), ensuring zero-knowledge isolation from application servers.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                        <span className="font-bold text-[#072644] dark:text-slate-100 text-xs">
                          SHA-256 Ledger Hashing
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Each financial journal entry is cryptographically linked to previous entries using SHA-256 chains, preventing silent modification or deletion of bookkeeping logs.
                      </p>
                    </div>
                  </div>

                  {/* Bullet Checklist */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071727] border border-slate-200/70 dark:border-slate-800 space-y-2">
                    <span className="font-bold text-[#072644] dark:text-slate-200 block text-xs">
                      Encryption Guarantees
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#84CC16] flex-shrink-0" />
                        <span>Zero plaintext storage of passwords or recovery codes (Argon2id hashing)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#84CC16] flex-shrink-0" />
                        <span>Client-side pre-flight signature validation for POS offline sync</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#84CC16] flex-shrink-0" />
                        <span>Automatic key rotation every 90 days with zero operational downtime</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 2: GDPR & PRIVACY COMPLIANCE */}
              {activeTab === 'gdpr' && (
                <div
                  id="panel-gdpr"
                  role="tabpanel"
                  aria-labelledby="tab-gdpr"
                  className="space-y-4 animate-in fade-in-50 duration-150"
                >
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 dark:bg-[#07241A] border border-emerald-100 dark:border-emerald-900/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center flex-shrink-0">
                        <FileCheck2 className="w-4 h-4 text-[#9AE61C]" />
                      </div>
                      <div>
                        <span className="font-bold text-[#072644] dark:text-white block text-xs sm:text-sm">
                          GDPR & NDPR Fully Certified
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Comprehensive legal & data subject privacy governance
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-[#9AE61C]">
                      EU 2016/679
                    </span>
                  </div>

                  {/* 4 GDPR Key Provisions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-[#9AE61C]" />
                        <span className="font-bold text-[#072644] dark:text-slate-100 text-xs">
                          Right to Erasure (Article 17)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Users and customers can request permanent data purging, with automated tokenization preserving legal statutory audit trails where required by tax authorities.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-emerald-600 dark:text-[#9AE61C]" />
                        <span className="font-bold text-[#072644] dark:text-slate-100 text-xs">
                          Data Portability (Article 20)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Export complete business ledgers, customer rosters, inventory catalogs, and invoice histories in standardized open formats (CSV, JSON, XML).
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-emerald-600 dark:text-[#9AE61C]" />
                        <span className="font-bold text-[#072644] dark:text-slate-100 text-xs">
                          Sovereign Data Residency
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Compliant data geo-fencing guarantees localized storage options conforming strictly with NDPR, WAEMU, and EAC commercial regulations across Africa.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-emerald-600 dark:text-[#9AE61C]" />
                        <span className="font-bold text-[#072644] dark:text-slate-100 text-xs">
                          Designated DPO Oversight
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Our full-time Data Protection Officer monitors regulatory filings and provides expedited response to privacy inquiries within 48 hours (<code className="text-[#0F4C81] dark:text-[#9AE61C]">dpo@msmebooks.ng</code>).
                      </p>
                    </div>
                  </div>

                  {/* Anti-Monetization Notice */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#071727] border border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#84CC16] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      <strong className="text-[#072644] dark:text-slate-200">Zero Data Selling Guarantee:</strong> MsmeBooks never monetizes, rents, or shares commercial transaction histories or customer lists with marketing brokers or advertisers.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: BUSINESS DATA PROTECTION */}
              {activeTab === 'protection' && (
                <div
                  id="panel-protection"
                  role="tabpanel"
                  aria-labelledby="tab-protection"
                  className="space-y-4 animate-in fade-in-50 duration-150"
                >
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 dark:bg-[#251A07] border border-amber-100 dark:border-amber-900/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
                        <Database className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-[#072644] dark:text-white block text-xs sm:text-sm">
                          Multi-Tenant Business Isolation
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Complete cryptographic and architectural separation between businesses
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-amber-700 dark:text-amber-400">
                      99.99% SLA
                    </span>
                  </div>

                  {/* 4 Data Protection Dimensions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Users2 className="w-4 h-4 text-[#0F4C81] dark:text-[#9AE61C]" />
                        <span className="font-bold text-[#072644] dark:text-slate-100 text-xs">
                          Granular RBAC Segmentation
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Role-Based Access Control isolates cashiers, store keepers, finance managers, and owners—preventing unauthorized salary or balance disclosures.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-[#0F4C81] dark:text-[#9AE61C]" />
                        <span className="font-bold text-[#072644] dark:text-slate-100 text-xs">
                          15-Minute Automated Backups
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Continuous differential replication across redundant geo-distributed availability zones enables 1-click point-in-time disaster recovery.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-[#0F4C81] dark:text-[#9AE61C]" />
                        <span className="font-bold text-[#072644] dark:text-slate-100 text-xs">
                          Brute-Force & Lockout Guard
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Active 5-attempt threshold immediately quarantines unauthorized brute-force attacks with progressive lockout cool-downs and security alerts.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#071626] space-y-1.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                        <span className="font-bold text-[#072644] dark:text-slate-100 text-xs">
                          Full Audit Trail & Logs
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        Immutable event logs monitor user logins, IP geographic changes, permissions alterations, and major journal ledger reconciliations.
                      </p>
                    </div>
                  </div>

                  {/* Real-world Business Assurance */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071727] border border-slate-200/70 dark:border-slate-800 space-y-1.5">
                    <span className="font-bold text-[#072644] dark:text-slate-200 block text-xs">
                      Enterprise High-Availability & Disaster Recovery
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Your store branches and inventory data remain safeguarded during network drops. Local transactions queue securely with offline HMAC authentication and reconcile without conflict once internet restores.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Popover Footer with Compliance ID & Quick Actions */}
            <div className="p-4 bg-slate-50 dark:bg-[#081726] border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-[11px] text-slate-400 font-mono">Cert Ref:</span>
                <button
                  type="button"
                  onClick={handleCopyCertificate}
                  className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0F4C81] dark:hover:text-[#9AE61C] flex items-center gap-1.5 px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  title="Click to copy certificate verification reference"
                >
                  <span>{complianceCertId}</span>
                  {copiedCert ? (
                    <Check className="w-3 h-3 text-[#84CC16]" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={handleDownloadWhitepaper}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadSuccess ? 'Downloaded!' : 'Download Spec'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-1.5 rounded-xl bg-[#0F4C81] hover:bg-[#0A365C] dark:bg-[#84CC16] dark:hover:bg-[#72B013] text-white dark:text-[#072644] font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
