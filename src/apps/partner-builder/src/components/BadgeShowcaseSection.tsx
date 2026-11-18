import React, { useState } from 'react';
import { Download, ShieldCheck, Share2, Info, Check, Copy, ExternalLink, Code } from 'lucide-react';
import { OfficialPartnerBadge, downloadBadgeSvg } from './OfficialPartnerBadge';
import { PARTNER_TIERS } from '../data/partnersData';
import { PartnerTierId } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface BadgeShowcaseSectionProps {
  onSelectTierToApply: (tier: PartnerTierId) => void;
  onOpenVerify: (code?: string) => void;
}

export const BadgeShowcaseSection: React.FC<BadgeShowcaseSectionProps> = ({
  onSelectTierToApply,
  onOpenVerify
}) => {
  const { t } = useLanguage();
  const [selectedBadge, setSelectedBadge] = useState<PartnerTierId | null>('gold');
  const [copiedTier, setCopiedTier] = useState<string | null>(null);
  const [embedModalTier, setEmbedModalTier] = useState<PartnerTierId | null>(null);

  const tiers: PartnerTierId[] = ['bronze', 'silver', 'gold', 'platinum'];

  const handleCopyShareLink = (tier: PartnerTierId) => {
    const link = `https://www.msmebooks.org/partners/verify?tier=${tier}&badge=MSME-PT-8421`;
    navigator.clipboard.writeText(link);
    setCopiedTier(tier);
    setTimeout(() => setCopiedTier(null), 2500);
  };

  return (
    <section id="tiers" className="py-20 lg:py-28 bg-white dark:bg-[#061F4A] border-b border-slate-200 dark:border-blue-900/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            {t('badges.tag', 'Official SaaS Partnership Credentials')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
            {t('badges.title', 'Four Distinct Membership Badges')}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-blue-100/80 font-normal">
            {t('badges.desc', 'Stand out as an officially recognised MsmeBooks Partner and build customer confidence with a professional membership credential. Designed for digital certificates, websites, proposals, and email signatures.')}
          </p>
        </div>

        {/* 4 Official Badges Display Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {tiers.map((tierKey) => {
            const tierInfo = PARTNER_TIERS[tierKey];
            const isGold = tierKey === 'gold';
            const isPlatinum = tierKey === 'platinum';

            return (
              <div
                key={tierKey}
                className={`relative flex flex-col items-center bg-white dark:bg-[#0A2552] rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl ${
                  isGold
                    ? 'border-[#F59E0B] dark:border-[#F59E0B] shadow-amber-100/50 dark:shadow-[0_0_22px_rgba(245,158,11,0.22)] ring-2 ring-[#F59E0B]/20 dark:ring-[#F59E0B]/40 hover:dark:shadow-[0_0_30px_rgba(245,158,11,0.3)]'
                    : isPlatinum
                    ? 'border-[#0284C7] dark:border-sky-400 shadow-sky-100/50 dark:shadow-[0_0_24px_rgba(140,230,0,0.22)] ring-2 ring-[#8CE600]/30 hover:dark:shadow-[0_0_32px_rgba(140,230,0,0.32)]'
                    : 'border-slate-200 dark:border-blue-800/80 dark:shadow-[0_0_14px_rgba(10,57,129,0.2)] hover:border-slate-300 dark:hover:border-blue-500 hover:dark:shadow-[0_0_20px_rgba(10,57,129,0.3)]'
                }`}
              >
                {/* Milestone Pill */}
                {isGold && (
                  <div className="absolute -top-3.5 px-3 py-1 bg-gradient-to-r from-[#D97706] to-[#B45309] text-white text-[11px] font-bold rounded-full shadow-md uppercase tracking-wider">
                    Most Popular Growth Tier
                  </div>
                )}
                {isPlatinum && (
                  <div className="absolute -top-3.5 px-3 py-1 bg-gradient-to-r from-[#0284C7] to-[#0A3981] text-white text-[11px] font-bold rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8CE600]" />
                    Premier Tier
                  </div>
                )}

                {/* Badge SVG Vector Showcase */}
                <div className="my-3 flex items-center justify-center min-h-[260px]">
                  <OfficialPartnerBadge
                    tier={tierKey}
                    size="md"
                    partnerCode={
                      tierKey === 'bronze'
                        ? 'MSME-PT-3329'
                        : tierKey === 'silver'
                        ? 'MSME-PT-9934'
                        : tierKey === 'gold'
                        ? 'MSME-PT-8421'
                        : 'MSME-PT-5012'
                    }
                    interactive
                    onClick={() => setSelectedBadge(tierKey)}
                  />
                </div>

                {/* Tier Headline & Details */}
                <div className="w-full text-center border-t border-slate-100 dark:border-blue-900/60 pt-4 mt-2">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{tierInfo.name}</h3>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded ${
                        tierKey === 'platinum'
                          ? 'bg-[#8CE600]/20 text-emerald-800 dark:text-[#8CE600]'
                          : 'bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-blue-300'
                      }`}
                    >
                      {tierInfo.commissionRate}%
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-blue-200 mb-2 font-mono">
                    {tierInfo.commissionRate}% Recurring Rev Share
                  </div>
                  <p className="text-xs text-slate-600 dark:text-blue-100/75 line-clamp-2 mb-4 leading-relaxed h-8">
                    {tierInfo.tagline}
                  </p>
                </div>

                {/* Interactive Action Buttons */}
                <div className="w-full space-y-2 mt-auto">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedBadge(tierKey)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-blue-900/40 hover:bg-slate-200 dark:hover:bg-blue-800/50 rounded-lg transition-colors"
                      title="Inspect full badge credential specifications"
                    >
                      <Info className="w-3.5 h-3.5" />
                      Details
                    </button>
                    <button
                      onClick={() => downloadBadgeSvg(tierKey, `MSME-PT-${tierKey.toUpperCase()}`)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors border dark:border-blue-800/60"
                      title="Download vector SVG file"
                    >
                      <Download className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
                      Download
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setEmbedModalTier(tierKey)}
                      className="w-full flex items-center justify-center gap-1 text-[11px] font-medium text-slate-600 dark:text-blue-200 hover:text-slate-900 dark:hover:text-white py-1.5 border border-slate-200 dark:border-blue-800/60 rounded-lg hover:bg-slate-50 dark:hover:bg-blue-900/40 transition-colors"
                      title="Get website embed snippet"
                    >
                      <Code className="w-3 h-3" />
                      Embed Code
                    </button>
                    <button
                      onClick={() => handleCopyShareLink(tierKey)}
                      className="w-full flex items-center justify-center gap-1 text-[11px] font-medium text-slate-600 dark:text-blue-200 hover:text-slate-900 dark:hover:text-white py-1.5 border border-slate-200 dark:border-blue-800/60 rounded-lg hover:bg-slate-50 dark:hover:bg-blue-900/40 transition-colors"
                      title="Copy credential link"
                    >
                      {copiedTier === tierKey ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600 dark:text-[#8CE600]" />
                          <span className="text-emerald-700 dark:text-[#8CE600] font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3" />
                          Share Link
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectTierToApply(tierKey)}
                    className="w-full py-2.5 text-xs font-bold text-white bg-[#0A3981] hover:bg-[#072c66] active:bg-[#051f47] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-sm"
                  >
                    Apply for {tierInfo.name}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Badge Governance & Architecture Guarantee */}
        <div className="bg-[#F0F6FF] dark:bg-[#0A2552] rounded-2xl p-6 sm:p-8 border border-blue-200 dark:border-blue-800/70 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0A3981] dark:bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6 text-[#8CE600]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#0A3981] dark:text-white">
                Cryptographically Verifiable SaaS Credential Architecture
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-blue-100/80 mt-1 max-w-2xl">
                Every official MsmeBooks badge is linked to a permanent record in our central registry. Customers can verify active status, commission tier, registered enterprise name, and certified skill accreditations in real-time. Unapproved or suspended parties are immediately barred from presenting verified credentials.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onOpenVerify('MSME-PT-8421')}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-[#0A3981] dark:text-[#8CE600] bg-white dark:bg-[#061F4A] hover:bg-slate-50 dark:hover:bg-[#041533] border border-blue-300 dark:border-blue-700 rounded-xl shadow-sm transition-colors whitespace-nowrap"
            >
              <ShieldCheck className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
              Test Public Verification
            </button>
          </div>
        </div>
      </div>

      {/* Badge Details Inspection Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#072457] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-blue-800 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-lg"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-blue-200">
                Official Credential Specification
              </span>
              <h3 className="text-2xl font-black text-[#0A3981] dark:text-white">
                {PARTNER_TIERS[selectedBadge].name} Credential
              </h3>
            </div>

            <div className="flex justify-center my-4">
              <OfficialPartnerBadge
                tier={selectedBadge}
                size="lg"
                partnerCode={`MSME-PT-${selectedBadge.toUpperCase()}-VERIFIED`}
              />
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-[#061F4A] rounded-xl p-4 text-xs sm:text-sm border border-slate-200 dark:border-blue-900 mb-6">
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-blue-900/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Issuing Authority:</span>
                <span className="font-bold text-slate-900 dark:text-white">MsmeBooks Inc. Global Partner Ecosystem</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-blue-900/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Recurring Rev Share:</span>
                <span className="font-bold text-[#0A3981] dark:text-[#8CE600]">
                  {PARTNER_TIERS[selectedBadge].commissionRate}% on all introduced client renewals
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-blue-900/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Metallic Identity:</span>
                <span className="font-medium text-slate-800 dark:text-blue-100">
                  {PARTNER_TIERS[selectedBadge].metallicTheme}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-blue-900/60">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Minimum Active Clients:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {PARTNER_TIERS[selectedBadge].minReferrals}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Approved Usage:</span>
                <span className="font-medium text-slate-700 dark:text-blue-100">Websites, Proposals, Letterheads & Email Signatures</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  downloadBadgeSvg(selectedBadge);
                  setSelectedBadge(null);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 text-xs sm:text-sm font-bold text-white bg-[#0A3981] hover:bg-[#072c66] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow transition-colors"
              >
                <Download className="w-4 h-4 text-[#8CE600]" />
                Download Vector SVG Badge
              </button>
              <button
                onClick={() => {
                  const t = selectedBadge;
                  setSelectedBadge(null);
                  onSelectTierToApply(t);
                }}
                className="flex-1 py-3 px-4 text-xs sm:text-sm font-bold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-800/60 border border-blue-200 dark:border-blue-800 rounded-xl transition-colors"
              >
                Apply for this Tier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Embed Code Snippet Modal */}
      {embedModalTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#072457] rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-blue-800 relative">
            <button
              onClick={() => setEmbedModalTier(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-lg"
            >
              ✕
            </button>
            <h3 className="text-lg font-bold text-[#0A3981] dark:text-white mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-[#0A3981] dark:text-[#8CE600]" />
              Embed Badge Snippet ({PARTNER_TIERS[embedModalTier].name})
            </h3>
            <p className="text-xs text-slate-600 dark:text-blue-100/80 mb-4">
              Paste this HTML snippet into your corporate website footer, proposal templates, or email signature to display your official accredited badge:
            </p>
            <div className="bg-slate-900 dark:bg-[#041533] text-slate-100 p-4 rounded-xl text-xs font-mono overflow-x-auto mb-4 border border-slate-800 dark:border-blue-900">
              {`<a href="https://www.msmebooks.org/partners/verify?id=MSME-PT-8421" target="_blank" rel="noopener noreferrer" title="MsmeBooks Verified ${embedModalTier.toUpperCase()} Partner">
  <img src="https://www.msmebooks.org/badges/${embedModalTier}-partner-verified.svg" alt="MsmeBooks Official ${embedModalTier.toUpperCase()} Partner" width="160" height="180" />
</a>`}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  const snippet = `<a href="https://www.msmebooks.org/partners/verify?id=MSME-PT-8421" target="_blank" rel="noopener noreferrer" title="MsmeBooks Verified ${embedModalTier.toUpperCase()} Partner">\n  <img src="https://www.msmebooks.org/badges/${embedModalTier}-partner-verified.svg" alt="MsmeBooks Official ${embedModalTier.toUpperCase()} Partner" width="160" height="180" />\n</a>`;
                  navigator.clipboard.writeText(snippet);
                  setEmbedModalTier(null);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#0A3981] dark:bg-blue-600 hover:bg-[#072c66] dark:hover:bg-blue-500 rounded-xl shadow transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-[#8CE600]" />
                Copy Snippet to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
