import React, { useState, useRef } from 'react';
import { PartnerTierId } from '../types';
import { PARTNER_TIERS } from '../data/partnersData';
import { OfficialPartnerBadge } from './OfficialPartnerBadge';
import { 
  GraduationCap, 
  Award, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  QrCode, 
  FileText, 
  Share2,
  CheckCircle,
  Building,
  User,
  BookOpen
} from 'lucide-react';

interface CertificatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApply: () => void;
  initialName?: string;
  initialTier?: PartnerTierId;
}

const CERTIFICATION_TRACKS = [
  {
    id: 'cis',
    code: 'MSME-CIS',
    title: 'Certified Implementation Specialist (CIS)',
    focus: 'Cloud Accounting, POS Architecture & African Statutory Tax Deployment',
    hours: '18 Hours',
    level: 'Master Practitioner'
  },
  {
    id: 'pos',
    code: 'MSME-CTA',
    title: 'Certified POS & Retail Systems Architect',
    focus: 'Multi-Branch POS Topology, Hardware Sync & Offline Resilience',
    hours: '14 Hours',
    level: 'Advanced Technical'
  },
  {
    id: 'tax',
    code: 'MSME-CTS',
    title: 'Certified Statutory Accounting & Compliance Advisor',
    focus: 'WHT, VAT, Corporate Tax Automation & Audit Trail Reconciliation',
    hours: '16 Hours',
    level: 'Executive Advisory'
  },
  {
    id: 'erp',
    code: 'MSME-CIE',
    title: 'Certified Inventory & ERP Supply Specialist',
    focus: 'Multi-Warehouse Inventory, Batch Tracking & Procurement Automation',
    hours: '12 Hours',
    level: 'Advanced Operations'
  },
  {
    id: 'sme',
    code: 'MSME-CAP',
    title: 'Certified SME Practice Growth Consultant',
    focus: 'Client Acquisition, Advisory Retainers & Recurring Revenue Scaling',
    hours: '10 Hours',
    level: 'Commercial Practice'
  }
];

export const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({
  isOpen,
  onClose,
  onOpenApply,
  initialName = 'Adebayo O. Johnson, FCA',
  initialTier = 'gold'
}) => {
  const [candidateName, setCandidateName] = useState(initialName);
  const [companyName, setCompanyName] = useState('Apex Financial Advisory Ltd');
  const [selectedTrackId, setSelectedTrackId] = useState('cis');
  const [selectedTier, setSelectedTier] = useState<PartnerTierId>(initialTier);
  const [viewMode, setViewMode] = useState<'certificate' | 'badge'>('certificate');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const certificateRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentTrack = CERTIFICATION_TRACKS.find(t => t.id === selectedTrackId) || CERTIFICATION_TRACKS[0];
  const tierConfig = PARTNER_TIERS[selectedTier];

  // Deterministic Credential ID based on name & track
  const generateCredentialId = () => {
    let hash = 0;
    const str = `${candidateName}-${selectedTrackId}-${selectedTier}`;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    const positiveCode = Math.abs(hash % 9000) + 1000;
    return `CERT-MSME-2026-${positiveCode}`;
  };

  const credentialId = generateCredentialId();
  const issueDate = 'October 31, 2026';
  const expiryDate = 'October 31, 2028';

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleCopyCredentialSnippet = () => {
    const snippet = `MsmeBooks Certified Professional Credential
Recipient: ${candidateName}
Company: ${companyName || 'Independent Practitioner'}
Certification: ${currentTrack.title} (${currentTrack.code})
Partner Level: ${tierConfig.name} Partner (${tierConfig.commissionRate}% Recurring)
Credential ID: ${credentialId}
Issuer: MsmeBooks Global Learning Academy (www.msmebooks.org)
Registry Validation: https://www.msmebooks.org/partners#verify?id=${credentialId}`;
    
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2500);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(credentialId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Download personalized certification badge SVG
  const handleDownloadPersonalizedBadge = () => {
    const badgeSvg = `<?xml version="1.0" encoding="utf-8"?>
<svg width="480" height="560" viewBox="0 0 480 560" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="certBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#061F4A"/>
      <stop offset="50%" stopColor="#0A3981"/>
      <stop offset="100%" stopColor="#041430"/>
    </linearGradient>
    <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FDE68A"/>
      <stop offset="25%" stopColor="#F59E0B"/>
      <stop offset="75%" stopColor="#D97706"/>
      <stop offset="100%" stopColor="#B45309"/>
    </linearGradient>
    <linearGradient id="lemonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#A3E635"/>
      <stop offset="100%" stopColor="#8CE600"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Outer Shield Badge Contour -->
  <path d="M240 20 L420 80 C420 280 370 420 240 500 C110 420 60 280 60 80 L240 20 Z" fill="url(#metal)" filter="url(#shadow)"/>
  <path d="M240 28 L408 84 C408 274 360 408 240 484 C120 408 72 274 72 84 L240 28 Z" fill="url(#certBg)" stroke="#F59E0B" stroke-width="2"/>

  <!-- Academy Header & Logo -->
  <g transform="translate(240, 100)">
    <circle cx="0" cy="0" r="28" fill="#0A3981" stroke="#8CE600" stroke-width="2"/>
    <path d="M-14 4 L0 -6 L14 4 L0 12 Z" fill="#8CE600"/>
    <path d="M-8 8 L-8 16 C-8 20 8 20 8 16 L8 8" stroke="#FFFFFF" stroke-width="2" fill="none"/>
  </g>

  <text x="240" y="155" text-anchor="middle" fill="#FFFFFF" font-family="'Outfit', sans-serif" font-size="20" font-weight="900" letter-spacing="2">MSMEBOOKS</text>
  <text x="240" y="174" text-anchor="middle" fill="#8CE600" font-family="'Outfit', sans-serif" font-size="11" font-weight="800" letter-spacing="3">GLOBAL LEARNING ACADEMY</text>

  <!-- Certified Specialist Ribbon -->
  <g transform="translate(240, 210)">
    <rect x="-170" y="-16" width="340" height="32" rx="6" fill="url(#metal)"/>
    <text x="0" y="6" text-anchor="middle" fill="#061F4A" font-family="'Outfit', sans-serif" font-size="13" font-weight="900" letter-spacing="2">ACCREDITED SPECIALIST</text>
  </g>

  <!-- Personalized Candidate Name -->
  <text x="240" y="275" text-anchor="middle" fill="#FFFFFF" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="800">${candidateName || 'Certified Partner'}</text>
  <text x="240" y="300" text-anchor="middle" fill="#93C5FD" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600">${companyName || 'MsmeBooks Partner Network'}</text>

  <!-- Track Title -->
  <g transform="translate(240, 340)">
    <rect x="-180" y="-18" width="360" height="36" rx="18" fill="#061F4A" stroke="#8CE600" stroke-width="1.5"/>
    <text x="0" y="5" text-anchor="middle" fill="#8CE600" font-family="'Outfit', sans-serif" font-size="12" font-weight="800">${currentTrack.title}</text>
  </g>

  <!-- Tier & Commission Ribbon -->
  <g transform="translate(240, 400)">
    <text x="0" y="0" text-anchor="middle" fill="#FDE68A" font-family="'Outfit', sans-serif" font-size="14" font-weight="800">${selectedTier.toUpperCase()} PARTNER · ${tierConfig.commissionRate}% RECURRING</text>
  </g>

  <!-- Stars -->
  <g transform="translate(240, 428)">
    <polygon points="-36,0 -32,7 -24,7 -30,12 -28,19 -36,14 -44,19 -42,12 -48,7 -40,7" fill="#FBBF24"/>
    <polygon points="-18,0 -14,7 -6,7 -12,12 -10,19 -18,14 -26,19 -24,12 -30,7 -22,7" fill="#FBBF24"/>
    <polygon points="0,0 4,7 12,7 6,12 8,19 0,14 -8,19 -6,12 -12,7 -4,7" fill="#FBBF24"/>
    <polygon points="18,0 22,7 30,7 24,12 26,19 18,14 10,19 12,12 6,7 14,7" fill="#FBBF24"/>
    <polygon points="36,0 40,7 48,7 42,12 44,19 36,14 28,19 30,12 24,7 32,7" fill="#FBBF24"/>
  </g>

  <!-- Credential Footer ID -->
  <g transform="translate(240, 460)">
    <text x="0" y="0" text-anchor="middle" fill="#CBD5E1" font-family="'Space Mono', monospace" font-size="10" font-weight="700">VERIFIED ID: ${credentialId}</text>
  </g>
</svg>`;

    const blob = new Blob([badgeSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `MsmeBooks_${candidateName.replace(/[^a-zA-Z0-9]/g, '_')}_Certification_Badge.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 dark:bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#072457] rounded-3xl max-w-6xl w-full h-[94vh] shadow-2xl border border-slate-200 dark:border-blue-800 flex flex-col overflow-hidden relative transition-colors">
        
        {/* Top Modal Navigation Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#061F4A] border-b border-slate-200 dark:border-blue-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A3981] to-[#061F4A] text-white flex items-center justify-center border border-blue-400/30 shadow-sm">
              <Award className="w-5 h-5 text-[#8CE600]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Interactive Certification & Badge Preview Studio
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8CE600]/20 text-[#0A3981] dark:text-[#8CE600] border border-[#8CE600]/40">
                  <Sparkles className="w-3 h-3" /> Live Personalization
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                Visualize what your accredited diploma and digital certification badge will look like upon completion of your training track.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="inline-flex items-center p-1 bg-white dark:bg-[#0A2552] rounded-xl border border-slate-200 dark:border-blue-800 text-xs font-semibold">
              <button
                onClick={() => setViewMode('certificate')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'certificate'
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] shadow font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Certificate
              </button>
              <button
                onClick={() => setViewMode('badge')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'badge'
                    ? 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] shadow font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                Specialist Badge
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-200 dark:hover:bg-blue-900/40 text-base cursor-pointer"
              title="Close Preview Studio"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Studio Content: Left Form Controls (4 cols) & Right Live Visualizer (8 cols) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 min-h-0">
          
          {/* LEFT: Customization Form Controls */}
          <div className="lg:col-span-4 p-5 sm:p-6 bg-slate-50/70 dark:bg-[#051A3E] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-blue-800 space-y-5 overflow-y-auto">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#0A3981] dark:text-sky-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                Candidate Credential Profile
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Type your personal or representative name to see real-time updates.
              </p>
            </div>

            {/* Input 1: Full Candidate Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Recipient Full Name *
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Adebayo O. Johnson, FCA"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none shadow-sm"
              />
            </div>

            {/* Input 2: Organization / Practice */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                <span>Practice / Company Name</span>
                <span className="text-[10px] font-normal text-slate-400">Optional</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Global Advisory Ltd"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Input 3: Certification Track */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Specialization Track Curriculum
              </label>
              <select
                value={selectedTrackId}
                onChange={(e) => setSelectedTrackId(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-white dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none font-medium"
              >
                {CERTIFICATION_TRACKS.map((track) => (
                  <option key={track.id} value={track.id}>
                    {track.code}: {track.title}
                  </option>
                ))}
              </select>
              <div className="mt-1.5 p-2 rounded-lg bg-blue-50/60 dark:bg-[#0A2552] border border-blue-100 dark:border-blue-800 text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                <strong>Curriculum Scope:</strong> {currentTrack.focus}
              </div>
            </div>

            {/* Input 4: Select Tier Badge Identity */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-2">
                Partner Membership Tier Entitlement
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['bronze', 'silver', 'gold', 'platinum'] as const).map((tierKey) => {
                  const isSelected = selectedTier === tierKey;
                  return (
                    <button
                      key={tierKey}
                      type="button"
                      onClick={() => setSelectedTier(tierKey)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0A3981] dark:bg-[#061F4A] text-white border-[#0A3981] dark:border-[#8CE600] shadow-sm ring-2 ring-[#8CE600]/40'
                          : 'bg-white dark:bg-[#061F4A]/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-blue-900 hover:bg-slate-100 dark:hover:bg-[#061F4A]'
                      }`}
                    >
                      <div className="text-[11px] font-bold capitalize">{tierKey}</div>
                      <div className={`text-xs font-black font-mono ${isSelected ? 'text-[#8CE600]' : 'text-[#0A3981] dark:text-sky-300'}`}>
                        {PARTNER_TIERS[tierKey].commissionRate}% Comm.
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Credential Meta Summary */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#061F4A] border border-slate-200 dark:border-blue-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Credential ID:</span>
                <div className="flex items-center gap-1.5 font-mono font-bold text-[#0A3981] dark:text-[#8CE600]">
                  <span>{credentialId}</span>
                  <button 
                    onClick={handleCopyId}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-blue-900 rounded text-slate-500 hover:text-slate-800 dark:text-slate-400 cursor-pointer"
                    title="Copy Credential ID"
                  >
                    {copiedId ? <Check className="w-3 h-3 text-emerald-600 dark:text-[#8CE600]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Accredited Authority:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">MsmeBooks Inc.</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                <span className="text-emerald-600 dark:text-[#8CE600] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Ready Upon Course Pass
                </span>
              </div>
            </div>

            {/* Quick Action Exports */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDownloadPersonalizedBadge}
                className="w-full py-2.5 px-3 text-xs font-bold text-[#061F4A] bg-[#8CE600] hover:bg-[#9be81c] rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Personalized Badge (SVG)
              </button>

              <button
                onClick={handleCopyCredentialSnippet}
                className="w-full py-2.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#061F4A] hover:bg-slate-100 dark:hover:bg-[#092b61] border border-slate-300 dark:border-blue-800 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-[#8CE600]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet ? 'Snippet Copied!' : 'Copy LinkedIn Credential Link'}</span>
              </button>

              <button
                onClick={handlePrintCertificate}
                className="w-full py-2 px-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save Diploma as PDF
              </button>
            </div>
          </div>

          {/* RIGHT: Live Visualizer Area (8 cols) */}
          <div className="lg:col-span-8 p-4 sm:p-8 bg-slate-100/60 dark:bg-[#041430] flex flex-col items-center justify-center overflow-y-auto">
            
            {/* 1. CERTIFICATE FULL VIEW */}
            {viewMode === 'certificate' && (
              <div 
                ref={certificateRef}
                className="w-full max-w-2xl bg-white text-slate-900 rounded-xl shadow-2xl border-8 border-double border-[#0A3981] p-6 sm:p-10 relative overflow-hidden transition-all print:border-none print:shadow-none"
              >
                {/* Background Watermark Crest */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035]">
                  <div className="w-96 h-96 rounded-full border-[20px] border-[#0A3981] flex items-center justify-center">
                    <GraduationCap className="w-48 h-48 text-[#0A3981]" />
                  </div>
                </div>

                {/* Ornate Gold Corner Accents */}
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#D97706]" />
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#D97706]" />
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#D97706]" />
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#D97706]" />

                {/* Header Block */}
                <div className="text-center mb-6 relative z-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0A3981] text-white mx-auto mb-3 shadow-md border-2 border-[#8CE600]">
                    <GraduationCap className="w-7 h-7 text-[#8CE600]" />
                  </div>

                  <div className="text-[11px] font-black uppercase tracking-[0.25em] text-[#0A3981] mb-1 font-mono">
                    MsmeBooks Global Learning Academy
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
                    Certificate of Technical Mastery
                  </h1>
                  <p className="text-xs text-slate-500 italic mt-0.5">
                    Accredited Partner Implementation & Advisory Credential
                  </p>
                </div>

                {/* Recipient Announcement */}
                <div className="text-center my-6 relative z-10">
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">
                    This official diploma is conferred upon
                  </p>
                  
                  {/* Candidate Name with Calligraphic Flourish */}
                  <div className="text-xl sm:text-3xl font-black text-[#0A3981] pb-1 border-b-2 border-[#D97706]/60 inline-block px-8 tracking-wide min-w-[280px]">
                    {candidateName || 'Candidate Full Name'}
                  </div>

                  {companyName && (
                    <div className="text-xs font-semibold text-slate-600 mt-1">
                      {companyName}
                    </div>
                  )}
                </div>

                {/* Competency Statement */}
                <div className="text-center max-w-lg mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed my-5 relative z-10">
                  for demonstrating verified competence, practical assessment completion, and professional mastery as an accredited:
                  <div className="mt-2 py-1 px-3 rounded-lg bg-blue-50 border border-blue-200 text-[#0A3981] font-bold text-sm sm:text-base">
                    {currentTrack.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1.5 italic">
                    Specializing in {currentTrack.focus} under the official <strong>{tierConfig.name} Partner Tier</strong>.
                  </div>
                </div>

                {/* Bottom Badges, QR Code & Signatures */}
                <div className="grid grid-cols-3 gap-4 items-end pt-6 border-t border-slate-200 mt-6 relative z-10">
                  {/* Seal 1: Left Authority Signature */}
                  <div className="text-center">
                    <div className="font-serif italic text-base text-[#0A3981] font-bold border-b border-slate-300 pb-0.5 mb-1">
                      Dr. K. Nwachukwu
                    </div>
                    <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                      Director of Enablement
                    </div>
                    <div className="text-[9px] text-slate-400">MsmeBooks Learning Council</div>
                  </div>

                  {/* Seal 2: Center Official Metallic Crest */}
                  <div className="text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FDE68A] via-[#F59E0B] to-[#B45309] p-0.5 shadow-md flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-[#061F4A] flex flex-col items-center justify-center text-white p-1">
                        <ShieldCheck className="w-4 h-4 text-[#8CE600]" />
                        <span className="text-[7px] font-black uppercase tracking-widest text-[#FDE68A]">ACCREDITED</span>
                        <span className="text-[6px] font-mono text-slate-300">2026 SEAL</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-[#0A3981] mt-1">
                      {tierConfig.name} Partner
                    </span>
                  </div>

                  {/* Seal 3: Right CTO Signature & QR */}
                  <div className="text-center">
                    <div className="font-serif italic text-base text-[#0A3981] font-bold border-b border-slate-300 pb-0.5 mb-1">
                      Engr. Tariq Hassan
                    </div>
                    <div className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                      Chief Technology Officer
                    </div>
                    <div className="text-[9px] text-slate-400">Cloud & Platform Architecture</div>
                  </div>
                </div>

                {/* Certificate Footer Verification Strip */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[10px] text-slate-400 font-mono">
                  <div>Verification Code: <strong className="text-slate-700">{credentialId}</strong></div>
                  <div>Issued: <strong>{issueDate}</strong></div>
                  <div>Status: <strong className="text-emerald-700">Official Central Registry</strong></div>
                </div>
              </div>
            )}

            {/* 2. SPECIALIST BADGE VIEW */}
            {viewMode === 'badge' && (
              <div className="flex flex-col items-center justify-center text-center p-6 space-y-6">
                <div className="relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#072457] border border-slate-200 dark:border-blue-800 shadow-2xl max-w-sm w-full flex flex-col items-center">
                  
                  {/* Subtle Top Badge Tag */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-[#061F4A] text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-[10px] font-bold uppercase tracking-wider mb-4">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Digital Credential Emblem
                  </div>

                  {/* Metallic Badge Vector */}
                  <div className="transform hover:scale-105 transition-transform duration-300">
                    <OfficialPartnerBadge
                      tier={selectedTier}
                      size="lg"
                      partnerCode={credentialId}
                      showId={true}
                    />
                  </div>

                  {/* Recipient Tag Banner Overlay */}
                  <div className="w-full mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-[#061F4A] border border-slate-200 dark:border-blue-800 text-center space-y-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                      Conferred Recipient
                    </div>
                    <div className="text-base font-extrabold text-slate-900 dark:text-white">
                      {candidateName || 'Candidate Name'}
                    </div>
                    <div className="text-xs font-semibold text-[#0A3981] dark:text-[#8CE600]">
                      {currentTrack.title}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-blue-900">
                      {companyName ? `${companyName} · ` : ''}{tierConfig.name} Partner Tier
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                  This digital badge is automatically provisioned inside your Partner Portal upon passing technical modules. Verified partners embed it on corporate websites, email signatures, and LinkedIn profiles.
                </p>
              </div>
            )}

            {/* Bottom Call to Action strip */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenApply();
                }}
                className="py-3 px-7 text-xs sm:text-sm font-bold text-[#061F4A] bg-[#8CE600] hover:bg-[#9be81c] rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <span>Enroll in {currentTrack.code} Track</span>
                <CheckCircle className="w-4 h-4 text-[#061F4A]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
