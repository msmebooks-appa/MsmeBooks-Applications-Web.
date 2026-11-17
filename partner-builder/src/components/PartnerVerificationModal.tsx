import React, { useState, useEffect } from 'react';
import { INITIAL_CERTIFIED_PARTNERS } from '../data/partnersData';
import { OfficialPartnerBadge } from './OfficialPartnerBadge';
import { ShieldCheck, Search, CheckCircle, AlertTriangle, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { CertifiedPartner } from '../types';

interface PartnerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export const PartnerVerificationModal: React.FC<PartnerVerificationModalProps> = ({
  isOpen,
  onClose,
  initialCode = ''
}) => {
  const [partnerIdInput, setPartnerIdInput] = useState(initialCode || 'MSME-PT-8421');
  const [searchResult, setSearchResult] = useState<CertifiedPartner | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialCode) {
      setPartnerIdInput(initialCode);
      performSearch(initialCode);
    } else {
      performSearch('MSME-PT-8421');
    }
  }, [initialCode]);

  const performSearch = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = INITIAL_CERTIFIED_PARTNERS.find(
      (p) => p.partnerCode.toUpperCase() === clean || p.companyName.toLowerCase().includes(code.toLowerCase())
    );
    setSearchResult(found || null);
    setHasSearched(true);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(partnerIdInput);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#072457] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-blue-800 relative max-h-[90vh] overflow-y-auto transition-colors duration-300 ease-in-out">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg cursor-pointer"
          aria-label="Close verification modal"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-50 dark:bg-[#061F4A] text-[#0A3981] dark:text-[#8CE600] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-blue-100 dark:border-blue-800">
            <ShieldCheck className="w-6 h-6 text-[#0A3981] dark:text-[#8CE600]" />
          </div>
          <h3 className="text-2xl font-black text-[#0A3981] dark:text-white">
            Official Partner Verification
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto">
            Confirm authentic MsmeBooks partnership credentials, membership tier, and certified implementation authority.
          </p>
        </div>

        {/* Verification Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 dark:text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={partnerIdInput}
                onChange={(e) => setPartnerIdInput(e.target.value)}
                placeholder="Enter Partner ID (e.g. MSME-PT-8421)"
                className="w-full pl-10 pr-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none uppercase font-mono"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 px-5 text-xs sm:text-sm font-bold text-white dark:text-[#061F4A] bg-[#0A3981] dark:bg-[#8CE600] hover:bg-[#072c66] dark:hover:bg-[#9be81c] rounded-xl shadow transition-colors cursor-pointer"
            >
              Verify
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Try sample IDs:</span>
            <button type="button" onClick={() => { setPartnerIdInput('MSME-PT-8421'); performSearch('MSME-PT-8421'); }} className="text-[#0A3981] dark:text-[#8CE600] font-mono hover:underline cursor-pointer">MSME-PT-8421</button>
            <span>·</span>
            <button type="button" onClick={() => { setPartnerIdInput('MSME-PT-5012'); performSearch('MSME-PT-5012'); }} className="text-[#0A3981] dark:text-[#8CE600] font-mono hover:underline cursor-pointer">MSME-PT-5012</button>
            <span>·</span>
            <button type="button" onClick={() => { setPartnerIdInput('MSME-PT-9934'); performSearch('MSME-PT-9934'); }} className="text-[#0A3981] dark:text-[#8CE600] font-mono hover:underline cursor-pointer">MSME-PT-9934</button>
          </div>
        </form>

        {/* Verification Result Display */}
        {hasSearched && searchResult ? (
          <div className="border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/40 dark:bg-[#042033] rounded-2xl p-5 mb-6">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-[#8CE600] text-xs font-bold uppercase tracking-wider mb-4 pb-3 border-b border-emerald-200 dark:border-emerald-900/60">
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-[#8CE600]" />
              <span>Official Record Verified & Active in Central Registry</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
              <div className="shrink-0">
                <OfficialPartnerBadge
                  tier={searchResult.tier}
                  size="sm"
                  partnerCode={searchResult.partnerCode}
                  showId={false}
                />
              </div>

              <div className="space-y-2 text-xs sm:text-sm flex-1 text-center sm:text-left">
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Registered Practice Name:</div>
                  <div className="text-base font-black text-slate-900 dark:text-white">{searchResult.companyName}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Partner Code:</span>
                    <div className="font-mono font-bold text-[#0A3981] dark:text-[#8CE600]">{searchResult.partnerCode}</div>
                  </div>
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Accredited Tier:</span>
                    <div className="font-bold text-slate-900 dark:text-white uppercase">{searchResult.tier} Partner</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-sky-400" />
                  <span>{searchResult.city}, {searchResult.country}</span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <span className="text-slate-500 dark:text-slate-400">Accreditation:</span>{' '}
                  <span className="font-semibold text-slate-800 dark:text-slate-100">{searchResult.category}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-900/60 text-[11px] text-emerald-900 dark:text-emerald-300 flex justify-between">
              <span>Issuing Body: <strong className="dark:text-white">MsmeBooks Inc.</strong></span>
              <span>Registry Validation: <strong className="dark:text-white">2026 Secured</strong></span>
            </div>
          </div>
        ) : hasSearched && !searchResult ? (
          <div className="border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 rounded-2xl p-6 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6">
            <AlertTriangle className="w-8 h-8 text-rose-500 dark:text-rose-400 mx-auto mb-2" />
            <div className="font-bold text-slate-900 dark:text-white mb-1">No Matching Record Found</div>
            <p>
              The Partner ID "{partnerIdInput}" could not be validated in the official MsmeBooks registry. The party may not have completed partner onboarding or the credentials may be expired or suspended.
            </p>
          </div>
        ) : null}

        <div className="text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#0A2552] hover:bg-slate-200 dark:hover:bg-[#0d2d63] rounded-xl transition-colors cursor-pointer"
          >
            Close Verification Console
          </button>
        </div>
      </div>
    </div>
  );
};
