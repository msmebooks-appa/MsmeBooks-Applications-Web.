import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  User, 
  ShieldCheck, 
  Eye, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap,
  Building,
  RefreshCw
} from 'lucide-react';
import { OfficialPartnerBadge, downloadBadgeSvg } from './OfficialPartnerBadge';
import { PartnerTierId } from '../types';

interface CertificatePreviewProps {
  onOpenStudio?: (name: string, track: string, tier: PartnerTierId) => void;
  onOpenApply?: () => void;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  onOpenStudio,
  onOpenApply,
}) => {
  const [inputName, setInputName] = useState('Adebayo O. Johnson, FCA');
  const [inputCompany, setInputCompany] = useState('Apex Financial Advisory');
  const [inputTier, setInputTier] = useState<PartnerTierId>('gold');
  const [inputTrack, setInputTrack] = useState('Certified Implementation Specialist (CIS)');

  // Dynamic rendered state — updated when clicking "Preview Certification"
  const [renderedName, setRenderedName] = useState('Adebayo O. Johnson, FCA');
  const [renderedCompany, setRenderedCompany] = useState('Apex Financial Advisory');
  const [renderedTier, setRenderedTier] = useState<PartnerTierId>('gold');
  const [renderedTrack, setRenderedTrack] = useState('Certified Implementation Specialist (CIS)');
  const [certId, setCertId] = useState('MSME-CERT-8429');
  const [isRendered, setIsRendered] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePreviewCertification = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsAnimating(true);
    
    // Generate new credential ID suffix if name changed
    const newId = `MSME-CERT-${Math.floor(1000 + Math.random() * 9000)}`;
    setCertId(newId);
    setRenderedName(inputName.trim() || 'Distinguished Partner');
    setRenderedCompany(inputCompany.trim() || 'Professional Practice');
    setRenderedTier(inputTier);
    setRenderedTrack(inputTrack);
    setIsRendered(true);

    setTimeout(() => {
      setIsAnimating(false);
    }, 350);
  };

  const samplePresets = [
    { name: 'Dr. Amina Bello, CPA', company: 'Bello & Co. Chartered Accountants', tier: 'platinum' as PartnerTierId, track: 'Enterprise ERP & Multi-Branch Systems Architect' },
    { name: 'Chinedu O. Adebayo, FCA', company: 'Lagos Tax & FinTech Partners', tier: 'gold' as PartnerTierId, track: 'Certified Implementation Specialist (CIS)' },
    { name: 'Sarah Mwangi, B.Sc', company: 'Nairobi Retail Cloud Systems', tier: 'silver' as PartnerTierId, track: 'Retail POS & Hardware Specialist' },
    { name: 'Kwame Asante, ACCA', company: 'Gold Coast Advisory Group', tier: 'bronze' as PartnerTierId, track: 'MsmeBooks Accounting Practitioner' },
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setInputName(preset.name);
    setInputCompany(preset.company);
    setInputTier(preset.tier);
    setInputTrack(preset.track);
    setRenderedName(preset.name);
    setRenderedCompany(preset.company);
    setRenderedTier(preset.tier);
    setRenderedTrack(preset.track);
    setCertId(`MSME-CERT-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  return (
    <div className="mb-14 rounded-3xl bg-gradient-to-br from-blue-50/90 via-sky-50/50 to-white dark:from-[#08234f] dark:via-[#072048] dark:to-[#051838] border-2 border-blue-200 dark:border-blue-700/80 p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#8CE600]/10 filter blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Column: Form Controls with 'Preview Certification' action */}
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0A3981] dark:text-[#8CE600] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
            Dynamic Certificate & Badge Studio
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-[#0A3981] dark:text-white tracking-tight">
            Generate Your Mock Certification Badge & Diploma
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Enter your professional details below and click <strong className="text-[#0A3981] dark:text-[#8CE600]">Preview Certification</strong> to dynamically render your accredited badge and verifiable digital certificate.
          </p>

          <form onSubmit={handlePreviewCertification} className="space-y-3 pt-1">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Your Full Name & Post-Nominals:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  placeholder="e.g. Adebayo O. Johnson, FCA"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#061F4A] border border-blue-300 dark:border-blue-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Practice / Firm Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                Firm or Practice Name:
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inputCompany}
                  onChange={(e) => setInputCompany(e.target.value)}
                  placeholder="e.g. Apex Financial Advisory"
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#061F4A] border border-blue-300 dark:border-blue-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none shadow-sm"
                />
              </div>
            </div>

            {/* Tier Selector & Track Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Accreditation Tier:
                </label>
                <select
                  value={inputTier}
                  onChange={(e) => setInputTier(e.target.value as PartnerTierId)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#061F4A] border border-blue-300 dark:border-blue-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none shadow-sm"
                >
                  <option value="bronze">Bronze Partner (15% Commission)</option>
                  <option value="silver">Silver Partner (20% Commission)</option>
                  <option value="gold">Gold Partner (30% Commission)</option>
                  <option value="platinum">Platinum Partner (40% Commission)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Certification Track:
                </label>
                <select
                  value={inputTrack}
                  onChange={(e) => setInputTrack(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#061F4A] border border-blue-300 dark:border-blue-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none shadow-sm"
                >
                  <option value="Certified Implementation Specialist (CIS)">Implementation Specialist (CIS)</option>
                  <option value="Enterprise ERP & Multi-Branch Systems Architect">Systems Architect</option>
                  <option value="Retail POS & Hardware Specialist">Retail POS Specialist</option>
                  <option value="MsmeBooks Accounting Practitioner">Accounting Practitioner</option>
                </select>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="pt-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
                Quick sample presets:
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                {samplePresets.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleApplyPreset(p)}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-[#061F4A] border border-slate-200 dark:border-blue-800 text-[#0A3981] dark:text-[#8CE600] font-semibold hover:border-[#8CE600] transition-colors cursor-pointer"
                  >
                    {p.name.split(',')[0]} ({p.tier.toUpperCase()})
                  </button>
                ))}
              </div>
            </div>

            {/* Core Action: 'Preview Certification' Button */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold text-[#061F4A] bg-[#8CE600] hover:bg-[#9be81c] rounded-xl shadow-lg shadow-[#8CE600]/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#061F4A]" />
                Preview Certification
                <ArrowRight className="w-4 h-4 text-[#061F4A]" />
              </button>

              {onOpenStudio && (
                <button
                  type="button"
                  onClick={() => onOpenStudio(renderedName, renderedTrack, renderedTier)}
                  className="inline-flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold text-[#0A3981] dark:text-white bg-white dark:bg-[#0A2552] hover:bg-blue-50 dark:hover:bg-[#0d3472] border border-slate-300 dark:border-blue-700 rounded-xl transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-sky-500" />
                  Full Studio Modal
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Dynamically Rendered Mock Certification Badge & Diploma */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl p-5 sm:p-6 border-4 border-double border-[#0A3981] shadow-2xl relative transition-all">
            {/* Top Certificate Header */}
            <div className="text-center border-b border-slate-200 pb-3 mb-3">
              <div className="w-9 h-9 mx-auto rounded-full bg-[#0A3981] text-[#8CE600] flex items-center justify-center mb-1.5 shadow">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="text-[9px] font-black uppercase tracking-widest text-[#0A3981]">
                MsmeBooks Global Learning & Technical Academy
              </div>
              <div className="text-sm sm:text-base font-black text-slate-900 font-display">
                Certificate of Professional Accreditation
              </div>
            </div>

            {/* Candidate Name Section */}
            <div className={`text-center py-2 space-y-1 transition-opacity duration-300 ${isAnimating ? 'opacity-30' : 'opacity-100'}`}>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                This acknowledges that
              </div>
              <div className="text-base sm:text-lg font-black text-[#0A3981] border-b-2 border-[#8CE600] inline-block px-4 pb-0.5 tracking-tight">
                {renderedName}
              </div>
              <div className="text-[11px] font-medium text-slate-600 italic">
                of {renderedCompany}
              </div>
              <div className="text-[11px] text-slate-600 pt-1">
                has successfully completed all requirements for
              </div>
              <div className="text-xs font-bold text-slate-900 bg-blue-50 py-1 px-3 rounded-lg border border-blue-100 mt-1 inline-block">
                {renderedTrack}
              </div>
            </div>

            {/* Dynamically Rendered Official Metallic Badge Preview */}
            <div className="my-3 py-3 border-y border-dashed border-slate-200 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white rounded-xl">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#0A3981]" />
                Official Metallic Partner Credential
              </div>
              <OfficialPartnerBadge
                tier={renderedTier}
                size="md"
                partnerCode={certId}
                showId={true}
              />
            </div>

            {/* Certificate Footer with Signatures & Barcode */}
            <div className="pt-2 flex items-center justify-between text-[10px] text-slate-500 border-t border-slate-100">
              <div>
                <span className="font-bold text-slate-700 block">Dr. Kenneth Nnadi, Ph.D</span>
                <span className="text-[9px] text-slate-400">Head of Academic Accreditation</span>
              </div>
              <div className="text-right font-mono">
                <span className="font-bold text-emerald-700 block flex items-center justify-end gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VERIFIED
                </span>
                <span className="text-[9px] text-slate-400">{certId}</span>
              </div>
            </div>

            {/* Bottom quick action bar */}
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => downloadBadgeSvg(renderedTier, certId)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0A3981] hover:underline cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download Vector Badge (.SVG)
              </button>

              <button
                type="button"
                onClick={() => handlePreviewCertification()}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isAnimating ? 'animate-spin' : ''}`} />
                Refresh ID
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
