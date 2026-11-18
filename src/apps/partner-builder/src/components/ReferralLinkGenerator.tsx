import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  QrCode, 
  Share2, 
  Sparkles, 
  ExternalLink, 
  Zap, 
  MessageCircle, 
  Mail, 
  FileText, 
  Globe,
  Sliders,
  Download,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface ReferralLinkGeneratorProps {
  partnerCode: string;
  tierName?: string;
  commissionRate?: number;
}

export const ReferralLinkGenerator: React.FC<ReferralLinkGeneratorProps> = ({
  partnerCode = 'MSME-PT-8421',
  tierName = 'Gold Partner',
  commissionRate = 30
}) => {
  const { t } = useLanguage();
  
  const [landingPage, setLandingPage] = useState<'signup' | 'pos' | 'accounting' | 'enterprise' | 'demo'>('signup');
  const [campaign, setCampaign] = useState('q4_growth');
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'social' | 'proposal' | 'direct'>('whatsapp');
  const [promoIncentive, setPromoIncentive] = useState<'NONE' | '1_MONTH_FREE' | 'VIP_SETUP' | 'DISCOUNT10'>('1_MONTH_FREE');
  const [subId, setSubId] = useState('');
  
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [isShortUrl, setIsShortUrl] = useState(false);

  // Landing page routing map
  const pagePaths: Record<string, string> = {
    signup: 'signup',
    pos: 'solutions/retail-pos-inventory',
    accounting: 'solutions/cloud-accounting-tax',
    enterprise: 'solutions/multi-branch-enterprise',
    demo: 'request-demo'
  };

  // Build the live tracking URL
  const baseDomain = 'https://www.msmebooks.org';
  const path = pagePaths[landingPage];
  
  const params = new URLSearchParams();
  params.set('ref', partnerCode);
  params.set('utm_source', 'partner_portal');
  if (channel) params.set('utm_medium', channel);
  if (campaign) params.set('utm_campaign', campaign);
  if (promoIncentive !== 'NONE') params.set('promo', promoIncentive);
  if (subId.trim()) params.set('sub_id', subId.trim().toLowerCase().replace(/\s+/g, '_'));

  const fullUrl = `${baseDomain}/${path}?${params.toString()}`;
  const shortUrl = `https://msme.to/p/${partnerCode.replace('MSME-PT-', '')}-${campaign.slice(0, 6)}`;
  const displayUrl = isShortUrl ? shortUrl : fullUrl;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello! Manage your business accounting, POS, and inventory smoothly with MsmeBooks. Check it out and get your partner onboarding discount here: ${displayUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Preset campaigns
  const applyPreset = (preset: {
    landing: 'signup' | 'pos' | 'accounting' | 'enterprise' | 'demo';
    campaign: string;
    channel: 'whatsapp' | 'email' | 'social' | 'proposal' | 'direct';
    promo: 'NONE' | '1_MONTH_FREE' | 'VIP_SETUP' | 'DISCOUNT10';
  }) => {
    setLandingPage(preset.landing);
    setCampaign(preset.campaign);
    setChannel(preset.channel);
    setPromoIncentive(preset.promo);
  };

  return (
    <div className="bg-white dark:bg-[#0A2552] rounded-2xl border border-slate-200 dark:border-blue-800 p-5 sm:p-6 shadow-sm transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-blue-900/60">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
              Dynamic Referral Link Generator
            </h3>
            <span className="text-[10px] font-bold bg-[#8CE600]/20 text-[#0A3981] dark:text-[#8CE600] px-2 py-0.5 rounded-full">
              {commissionRate}% Lifetime Attribution
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
            Generate custom UTM-tagged URLs with your official ID (<strong>{partnerCode}</strong>) for transparent client tracking.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 shrink-0">
            Presets:
          </span>
          <button
            onClick={() =>
              applyPreset({
                landing: 'pos',
                campaign: 'retail_pos_pitch',
                channel: 'whatsapp',
                promo: '1_MONTH_FREE'
              })
            }
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-blue-950 hover:bg-slate-200 dark:hover:bg-blue-900 text-slate-700 dark:text-slate-200 font-medium transition-colors cursor-pointer shrink-0"
          >
            📱 WhatsApp POS
          </button>
          <button
            onClick={() =>
              applyPreset({
                landing: 'accounting',
                campaign: 'audit_season_2026',
                channel: 'proposal',
                promo: 'VIP_SETUP'
              })
            }
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-blue-950 hover:bg-slate-200 dark:hover:bg-blue-900 text-slate-700 dark:text-slate-200 font-medium transition-colors cursor-pointer shrink-0"
          >
            📑 Audit Proposal
          </button>
          <button
            onClick={() =>
              applyPreset({
                landing: 'signup',
                campaign: 'sme_general_trial',
                channel: 'social',
                promo: '1_MONTH_FREE'
              })
            }
            className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-blue-950 hover:bg-slate-200 dark:hover:bg-blue-900 text-slate-700 dark:text-slate-200 font-medium transition-colors cursor-pointer shrink-0"
          >
            🚀 SME Trial
          </button>
        </div>
      </div>

      {/* Configuration Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 1. Destination Page */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Destination Landing Page
          </label>
          <select
            value={landingPage}
            onChange={(e) => setLandingPage(e.target.value as any)}
            className="w-full text-xs bg-slate-50 dark:bg-[#061F4A] border border-slate-200 dark:border-blue-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] cursor-pointer"
          >
            <option value="signup">Direct Sign-Up (/signup)</option>
            <option value="pos">Retail POS & Inventory (/pos)</option>
            <option value="accounting">Cloud Accounting & Tax (/accounting)</option>
            <option value="enterprise">Multi-Branch Enterprise (/enterprise)</option>
            <option value="demo">Book Guided Demo (/demo)</option>
          </select>
        </div>

        {/* 2. Marketing Medium / Channel */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Sharing Channel
          </label>
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as any)}
            className="w-full text-xs bg-slate-50 dark:bg-[#061F4A] border border-slate-200 dark:border-blue-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] cursor-pointer"
          >
            <option value="whatsapp">WhatsApp / Direct Messaging</option>
            <option value="email">Email Outreach / Proposal</option>
            <option value="social">LinkedIn / Twitter / Social Media</option>
            <option value="proposal">Formal Client Advisory Proposal</option>
            <option value="direct">In-Person Pitch / Flyer QR Code</option>
          </select>
        </div>

        {/* 3. Campaign Tag */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Campaign Identifier
          </label>
          <input
            type="text"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
            placeholder="e.g. q4_growth"
            className="w-full text-xs bg-slate-50 dark:bg-[#061F4A] border border-slate-200 dark:border-blue-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
          />
        </div>

        {/* 4. Partner Promo Incentive */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
            Client Incentive Tag
          </label>
          <select
            value={promoIncentive}
            onChange={(e) => setPromoIncentive(e.target.value as any)}
            className="w-full text-xs bg-slate-50 dark:bg-[#061F4A] border border-slate-200 dark:border-blue-800 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] cursor-pointer"
          >
            <option value="1_MONTH_FREE">🎁 1st Month Free Subscription</option>
            <option value="VIP_SETUP">⚡ Free VIP Data Migration</option>
            <option value="DISCOUNT10">🏷️ 10% First Year Discount</option>
            <option value="NONE">Standard Pricing (No Discount)</option>
          </select>
        </div>
      </div>

      {/* Sub-ID Custom Client Tag (Optional collapsible or clean row) */}
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-3 text-xs bg-slate-50 dark:bg-[#061F4A]/60 p-3 rounded-xl border border-slate-200/80 dark:border-blue-900/60">
        <span className="font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
          Optional Client Reference (Sub-ID):
        </span>
        <input
          type="text"
          value={subId}
          onChange={(e) => setSubId(e.target.value)}
          placeholder="e.g. greenfield_mart or lead_904"
          className="flex-1 bg-white dark:bg-[#041535] border border-slate-200 dark:border-blue-800 rounded-lg px-2.5 py-1 text-xs text-slate-800 dark:text-slate-100 focus:outline-none"
        />
        <div className="flex items-center gap-2 shrink-0">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 select-none">
            <input
              type="checkbox"
              checked={isShortUrl}
              onChange={(e) => setIsShortUrl(e.target.checked)}
              className="rounded text-[#0A3981] dark:text-[#8CE600] focus:ring-0"
            />
            <span>Short Link (msme.to)</span>
          </label>
        </div>
      </div>

      {/* Live Generated URL Box & Actions */}
      <div className="bg-slate-100 dark:bg-[#041535] p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-blue-900 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="min-w-0 flex-1 w-full">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-[#0A3981] dark:text-[#8CE600]" />
            Generated Partner Tracking URL
          </div>
          <div className="font-mono text-xs text-[#0A3981] dark:text-[#8CE600] break-all select-all font-semibold bg-white dark:bg-[#072457] p-2 rounded-lg border border-slate-200 dark:border-blue-800">
            {displayUrl}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={handleCopy}
            className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0A3981] hover:bg-[#082d68] text-white dark:bg-[#8CE600] dark:hover:bg-[#9de81f] dark:text-[#061F4A]'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Link'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition-colors cursor-pointer"
            title="Share directly to WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowQrModal(true)}
            className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl bg-white dark:bg-[#072457] hover:bg-slate-100 dark:hover:bg-[#0a316e] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-blue-800 text-xs font-semibold transition-colors cursor-pointer"
            title="Show QR Code for pitch flyers"
          >
            <QrCode className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
            <span className="hidden sm:inline">QR Code</span>
          </button>
        </div>
      </div>

      {/* Real-time Tracking Highlights */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-blue-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>90-Day Cookie Attribution Window</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Auto-Credited to Gold Tier (30% Share)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Real-time Lead Progression Notifications</span>
        </div>
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#072048] rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-blue-800 shadow-2xl text-center"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
                  Scan to Onboard Client
                </h4>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* High-Contrast SVG QR Pattern */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-inner inline-block my-2">
                <svg
                  width="180"
                  height="180"
                  viewBox="0 0 180 180"
                  className="mx-auto select-none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="180" height="180" fill="#FFFFFF" />
                  {/* Top-Left Finder */}
                  <rect x="15" y="15" width="45" height="45" rx="6" fill="#0A3981" />
                  <rect x="22" y="22" width="31" height="31" rx="4" fill="#FFFFFF" />
                  <rect x="29" y="29" width="17" height="17" rx="2" fill="#0A3981" />

                  {/* Top-Right Finder */}
                  <rect x="120" y="15" width="45" height="45" rx="6" fill="#0A3981" />
                  <rect x="127" y="22" width="31" height="31" rx="4" fill="#FFFFFF" />
                  <rect x="134" y="29" width="17" height="17" rx="2" fill="#0A3981" />

                  {/* Bottom-Left Finder */}
                  <rect x="15" y="120" width="45" height="45" rx="6" fill="#0A3981" />
                  <rect x="22" y="127" width="31" height="31" rx="4" fill="#FFFFFF" />
                  <rect x="29" y="134" width="17" height="17" rx="2" fill="#0A3981" />

                  {/* Dynamic Pattern Bits */}
                  <g fill="#0A3981">
                    <rect x="70" y="18" width="8" height="8" />
                    <rect x="85" y="18" width="16" height="8" />
                    <rect x="70" y="32" width="12" height="12" />
                    <rect x="90" y="32" width="8" height="8" />
                    <rect x="18" y="70" width="16" height="8" />
                    <rect x="40" y="70" width="8" height="16" />
                    <rect x="18" y="90" width="8" height="12" />
                    <rect x="34" y="95" width="14" height="8" />
                    <rect x="70" y="70" width="40" height="40" rx="8" fill="#0A3981" />
                    <circle cx="90" cy="90" r="14" fill="#8CE600" />
                    <text
                      x="90"
                      y="94"
                      textAnchor="middle"
                      fill="#061F4A"
                      fontSize="9"
                      fontWeight="900"
                      fontFamily="sans-serif"
                    >
                      MB
                    </text>
                    <rect x="120" y="70" width="12" height="8" />
                    <rect x="140" y="70" width="18" height="8" />
                    <rect x="125" y="85" width="8" height="18" />
                    <rect x="145" y="85" width="12" height="12" />
                    <rect x="70" y="120" width="14" height="8" />
                    <rect x="92" y="120" width="8" height="18" />
                    <rect x="70" y="140" width="16" height="12" />
                    <rect x="120" y="120" width="18" height="14" />
                    <rect x="145" y="120" width="12" height="18" />
                    <rect x="120" y="145" width="22" height="12" />
                    <rect x="150" y="145" width="10" height="10" />
                  </g>
                </svg>
              </div>

              <div className="text-xs font-mono font-bold text-slate-800 dark:text-slate-100 my-1">
                {partnerCode}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-300 mb-4">
                Scan with any smartphone camera to open the onboarding portal with your partner tracking pre-filled.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-2 text-xs font-bold text-white bg-[#0A3981] dark:bg-blue-600 rounded-xl cursor-pointer"
                >
                  {copied ? 'Link Copied!' : 'Copy URL'}
                </button>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-blue-950 rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
