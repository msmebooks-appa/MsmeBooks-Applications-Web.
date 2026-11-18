import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Printer, 
  Share2, 
  ExternalLink,
  QrCode,
  Building,
  GraduationCap
} from 'lucide-react';
import { CertificateRecord } from '../types';
import { CERTIFICATES_DATABASE } from '../data/mockData';

interface CertificateVerificationProps {
  initialCertId?: string;
  onCertificateVerified?: (cert: CertificateRecord) => void;
}

export const CertificateVerification: React.FC<CertificateVerificationProps> = ({
  initialCertId,
  onCertificateVerified
}) => {
  const [searchId, setSearchId] = useState(initialCertId || 'MSME-CERT-2026-90412');
  const [foundCert, setFoundCert] = useState<CertificateRecord | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (searchId) {
      handleSearch(searchId, false);
    }
  }, [initialCertId]);

  const handleSearch = (id: string, notify: boolean = true) => {
    setHasSearched(true);
    const trimmed = id.trim().toUpperCase();
    const result = CERTIFICATES_DATABASE.find(
      (c) => c.certificateId.toUpperCase() === trimmed
    );
    setFoundCert(result || null);
    if (result && notify && onCertificateVerified) {
      onCertificateVerified(result);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Verification Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-[#72B01D]" />
            Official Credential Verification Registry
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Verify MsmeBooks Academy Certificate
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
            Employers, clients, and partners can independently verify any MsmeBooks digital certificate using its unique accreditation code.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchId);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Certificate ID (e.g. MSME-CERT-2026-90412)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-mono uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0B4F9C]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
            >
              Verify Credential
            </button>
          </form>

          {/* Quick Demo links */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Quick test credentials:</span>
            {CERTIFICATES_DATABASE.map((c) => (
              <button
                key={c.certificateId}
                onClick={() => {
                  setSearchId(c.certificateId);
                  handleSearch(c.certificateId);
                }}
                className="text-[#0B4F9C] dark:text-blue-400 font-mono hover:underline bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded cursor-pointer"
              >
                {c.certificateId}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Result */}
        {hasSearched && (
          <div>
            {foundCert ? (
              <div className="space-y-6">
                
                {/* Status Callout */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 rounded-xl flex items-center justify-between text-xs text-emerald-900 dark:text-emerald-200">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#72B01D] shrink-0" />
                    <div>
                      <span className="font-extrabold text-sm block">Authentic &amp; Valid Credential</span>
                      <span>Verified directly from MsmeBooks Enterprise Registry.</span>
                    </div>
                  </div>
                  <span className="bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-100 font-mono font-bold px-2 py-0.5 rounded text-[10px]">
                    ACTIVE
                  </span>
                </div>

                {/* High-Fidelity Official Digital Certificate View */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border-4 border-[#0B4F9C] dark:border-blue-600 p-8 sm:p-12 shadow-xl relative overflow-hidden text-center space-y-6">
                  
                  {/* Watermark background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-4 dark:opacity-5">
                    <Award className="w-96 h-96 text-slate-900 dark:text-white" />
                  </div>

                  {/* Certificate Top Header */}
                  <div className="flex items-center justify-between border-b-2 border-slate-200 dark:border-slate-800 pb-6">
                    <div className="text-left flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-[#0B4F9C] text-white flex items-center justify-center font-black text-lg">
                        M<span className="w-1 h-3 bg-[#72B01D] rounded-full ml-0.5" />
                      </div>
                      <div>
                        <h2 className="text-lg font-black text-[#0B4F9C] dark:text-blue-400 tracking-tight">
                          MsmeBooks Academy
                        </h2>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">
                          Certified SaaS Accreditation Authority
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-700 dark:text-slate-200">
                        <QrCode className="w-8 h-8" />
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 mt-1 block">Scan to Verify</span>
                    </div>
                  </div>

                  {/* Certificate Body */}
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      This is to certify that
                    </p>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {foundCert.studentName}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                      has successfully satisfied all rigorous theoretical, software sandbox examinations, and compliance standards for
                    </p>

                    <div className="py-2">
                      <span className="text-lg sm:text-xl font-black text-[#0B4F9C] dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/60 px-4 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900 inline-block">
                        {foundCert.courseTitle}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Credential Type: <span className="font-bold text-slate-800 dark:text-slate-200">{foundCert.credentialType}</span> · Score: <span className="font-extrabold text-[#72B01D] tabular-nums">{foundCert.scorePercentage}%</span>
                    </p>
                  </div>

                  {/* Validated Skills */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 max-w-xl mx-auto">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Competencies &amp; Skills Validated:
                    </p>
                    <div className="flex flex-wrap justify-center gap-1.5 text-[11px]">
                      {foundCert.skillsValidated.map((sk) => (
                        <span key={sk} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-2.5 py-0.5 rounded font-medium">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Signatures & Seal Footer */}
                  <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 items-end text-xs">
                    <div className="text-left space-y-1">
                      <div className="font-serif italic text-base text-slate-700 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 pb-1">
                        {foundCert.instructorName}
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Lead Instructor / FCA</p>
                      <p className="text-[10px] text-slate-400">MsmeBooks Academy</p>
                    </div>

                    {/* Official Seal */}
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#0B4F9C] dark:border-blue-400 bg-blue-50/60 dark:bg-blue-950/60 flex items-center justify-center p-2 shadow-xs">
                        <Award className="w-8 h-8 text-[#0B4F9C] dark:text-blue-400" />
                      </div>
                      <span className="text-[9px] font-bold text-[#0B4F9C] dark:text-blue-400 uppercase tracking-wider mt-1">
                        Official Seal
                      </span>
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-slate-700 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700 pb-1 font-mono tabular-nums text-xs">
                        {foundCert.issueDate}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Issue Date</p>
                      <p className="text-[10px] font-mono text-slate-400">{foundCert.certificateId}</p>
                    </div>
                  </div>

                </div>

                {/* Print & Share actions */}
                <div className="flex items-center justify-end gap-3 text-xs">
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / Save as PDF</span>
                  </button>
                  <button
                    onClick={() => alert(`Verification link copied: ${foundCert.verificationUrl}`)}
                    className="px-4 py-2 bg-[#0B4F9C] hover:bg-[#073B75] text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share Credential</span>
                  </button>
                </div>

              </div>
            ) : (
              <div className="p-8 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 rounded-xl text-center text-xs text-rose-800 dark:text-rose-200 space-y-2">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <h4 className="font-bold text-sm">Certificate Record Not Found</h4>
                <p className="text-rose-600 dark:text-rose-300 max-w-sm mx-auto">
                  No credential matching <span className="font-mono font-bold">{searchId}</span> was found in our verification database. Please confirm the exact certificate ID or contact the issuing authority.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
