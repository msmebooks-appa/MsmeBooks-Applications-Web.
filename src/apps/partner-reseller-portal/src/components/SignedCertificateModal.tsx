import React from 'react';
import { SignedAgreementRecord } from '../types/partner';
import { MsmeLogo } from './MsmeLogo';
import { X, Printer, Award, ShieldCheck, Download } from 'lucide-react';

interface SignedCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerRecord: SignedAgreementRecord;
}

export const SignedCertificateModal: React.FC<SignedCertificateModalProps> = ({
  isOpen,
  onClose,
  partnerRecord
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        
        {/* Top Control Bar (Hidden in print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between no-print shrink-0">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-lime-400" />
            <span className="text-xs font-bold">Official MsmeBooks Partner Certificate & Credentials</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#84CC16] hover:bg-[#74C011] text-slate-900 rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-8 sm:p-14 bg-white text-slate-900 relative border-8 border-double border-slate-200 m-4 rounded-xl">
          {/* Subtle Corner Accents */}
          <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#0046B8]" />
          <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#0046B8]" />
          <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#0046B8]" />
          <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#0046B8]" />

          <div className="text-center space-y-6 max-w-2xl mx-auto">
            
            {/* Logo */}
            <div className="flex justify-center">
              <MsmeLogo size="lg" />
            </div>

            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-[#0046B8]">
                Certificate of Partnership & Accreditation
              </p>
              <p className="text-xs text-slate-400">
                Official Credential Verification ID: {partnerRecord.applicationId}
              </p>
            </div>

            <p className="text-xs italic text-slate-500 font-serif">
              This is to formally certify that
            </p>

            {/* Recipient */}
            <div className="space-y-1 py-2 border-b-2 border-slate-200">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif">
                {partnerRecord.partnerName}
              </h2>
              <p className="text-base font-bold text-[#0046B8]">
                {partnerRecord.businessName}
              </p>
            </div>

            {/* Classification & Tier */}
            <p className="text-xs text-slate-700 leading-relaxed max-w-lg mx-auto">
              has satisfactorily completed the compliance review, executed the Master Partner Agreement, and is duly accredited as an authorized
            </p>

            <div className="inline-block bg-blue-50 border border-blue-200 rounded-xl px-6 py-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Accredited Classification & Tier
              </p>
              <p className="text-xl font-black text-slate-900 mt-0.5">
                {partnerRecord.primaryCategory} · <span className="text-[#0046B8]">{partnerRecord.assignedTier} Partner</span>
              </p>
            </div>

            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Authorised to provide software advisory, merchant onboarding, and point-of-sale enablement under the MsmeBooks Global Partner Ecosystem.
            </p>

            {/* Signatures & Seal */}
            <div className="pt-8 grid grid-cols-3 gap-6 items-end text-xs">
              <div className="text-left space-y-1">
                <div className="border-b border-slate-400 pb-1 font-serif italic text-slate-800 text-sm">
                  Francis Erikefe
                </div>
                <p className="font-bold text-slate-900">Head of Partnerships</p>
                <p className="text-[10px] text-slate-500">MsmeBooks Technologies Ltd</p>
              </div>

              {/* Official Gold/Lemon Seal Stamp */}
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-4 border-[#84CC16] bg-amber-50/50 flex flex-col items-center justify-center p-1 shadow-xs text-center">
                  <ShieldCheck className="w-6 h-6 text-[#0046B8]" />
                  <span className="text-[8px] font-black uppercase text-slate-900 tracking-tighter">
                    Official Seal
                  </span>
                  <span className="text-[7px] text-slate-500 font-mono">VERIFIED</span>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="border-b border-slate-400 pb-1 font-mono text-slate-800 text-xs">
                  {partnerRecord.signedAt.split(' ')[0]}
                </div>
                <p className="font-bold text-slate-900">Date of Accreditation</p>
                <p className="text-[10px] text-slate-500">Jurisdiction: {partnerRecord.country}</p>
              </div>
            </div>

            {/* Footer verification notice */}
            <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
              <span>MsmeBooks Enterprise Technologies Limited (www.msmebooks.org)</span>
              <span>Electronic Credential Verification</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
