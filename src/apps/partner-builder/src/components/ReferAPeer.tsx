import React, { useState } from 'react';
import { 
  Users, 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  ExternalLink, 
  Sparkles, 
  Award, 
  Gift, 
  ArrowRight, 
  MessageCircle, 
  Send,
  Linkedin,
  Twitter,
  Mail,
  Download,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface ReferAPeerProps {
  initialPartnerCode?: string;
  onOpenApply?: () => void;
}

export const ReferAPeer: React.FC<ReferAPeerProps> = ({
  initialPartnerCode = 'MSME-PT-8421',
  onOpenApply
}) => {
  const { t } = useLanguage();
  const [partnerCode, setPartnerCode] = useState(initialPartnerCode);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [useShortLink, setUseShortLink] = useState(false);
  const [audiencePersona, setAudiencePersona] = useState<'accounting' | 'technology' | 'advisory'>('accounting');

  // Dynamic peer referral link
  const longReferralLink = `https://www.msmebooks.org/partner-programme?peer_ref=${encodeURIComponent(partnerCode)}&utm_source=peer_invite&utm_medium=partner_referral`;
  const shortReferralLink = `https://msme.to/partner/peer-${partnerCode.replace(/[^a-zA-Z0-9]/g, '')}`;
  const activeReferralLink = useShortLink ? shortReferralLink : longReferralLink;

  // Pre-crafted peer messages based on target persona
  const peerMessages = {
    accounting: `Hi colleague! I wanted to recommend the MsmeBooks Partner Programme. We're earning up to 40% recurring revenue share on client cloud accounting subscriptions with bi-directional sync to 25+ audit suites (Caseware, Sage, QuickBooks, IDEA). You also get official accredited partner badges. Explore and apply through my partner referral link here: ${activeReferralLink}`,
    technology: `Hello! If your firm delivers POS terminals, barcode hardware, and IT solutions, check out the MsmeBooks Partner Ecosystem. You keep 100% of your hardware and implementation service billings while earning recurring lifetime commissions on SaaS subscriptions. Sign up through my partner link: ${activeReferralLink}`,
    advisory: `Hi! I recommend exploring the MsmeBooks Business Advisory Alliance. They empower accounting and management consulting practices across Africa with modern ERP tools, priority partner support, and generous recurring commission structures. Here is my direct invitation link: ${activeReferralLink}`
  };

  const currentMessage = peerMessages[audiencePersona];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(activeReferralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  // Social sharing handlers
  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(currentMessage);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(activeReferralLink);
    const summary = encodeURIComponent(currentMessage);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&summary=${summary}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Empower your accounting or IT practice with @MsmeBooks. Earn up to 40% recurring revenue share & 25+ audit integrations. Join via my partner invitation:`);
    const url = encodeURIComponent(activeReferralLink);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(currentMessage);
    const url = encodeURIComponent(activeReferralLink);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Invitation: Join the MsmeBooks Partner Programme (via ${partnerCode})`);
    const body = encodeURIComponent(currentMessage);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div id="refer-a-peer" className="w-full mt-12 bg-gradient-to-br from-white via-blue-50/30 to-white dark:from-[#0A2552] dark:via-[#09224b] dark:to-[#071c3d] rounded-3xl border-2 border-[#0A3981]/20 dark:border-blue-700/80 p-6 sm:p-10 shadow-xl relative overflow-hidden transition-colors">
      {/* Background Subtle Accent Grids & Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 dark:bg-[#8CE600]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 dark:bg-sky-500/5 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

      {/* Header Pill & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-blue-800/80 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/90 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Users className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
            Peer-to-Peer Partner Growth
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#0A3981] dark:text-white tracking-tight">
            Refer-a-Peer: Professional Network Invitation
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
            Introduce accounting practices, IT integrators, or management consultants to MsmeBooks. When your referred peer gets accredited and onboards clients, you receive an ongoing <strong>5% peer revenue override</strong> plus co-marketing credits.
          </p>
        </div>

        {/* Override Bonus Pill */}
        <div className="shrink-0 flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#061F4A] border border-blue-200 dark:border-blue-800 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-[#8CE600] flex items-center justify-center font-black">
            5%
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white">Peer Override Bonus</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">+$150 Co-Marketing Credit / Peer</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Generator Controls + Share Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 relative z-10">
        {/* Left Column: Link Generator & Partner Code */}
        <div className="lg:col-span-7 space-y-6">
          {/* Partner Code & Link Mode Bar */}
          <div className="bg-white dark:bg-[#072457] rounded-2xl p-5 border border-slate-200 dark:border-blue-800/80 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                  Your Accredited Partner ID
                </label>
                <span className="text-[11px] text-slate-400 dark:text-slate-400">
                  Embeds your referral attribution into peer signups
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={partnerCode}
                  onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                  placeholder="e.g. MSME-PT-8421"
                  className="px-3 py-1.5 text-xs font-mono font-bold bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-700 rounded-xl text-[#0A3981] dark:text-[#8CE600] focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] w-36 text-center"
                />
                <button
                  type="button"
                  onClick={() => setUseShortLink(!useShortLink)}
                  className={`px-2.5 py-1.5 text-[11px] font-bold rounded-xl border transition-colors cursor-pointer ${
                    useShortLink
                      ? 'bg-blue-50 dark:bg-blue-900/80 text-[#0A3981] dark:text-[#8CE600] border-blue-300 dark:border-blue-700'
                      : 'bg-slate-50 dark:bg-[#061F4A] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-blue-900'
                  }`}
                  title="Toggle short link format"
                >
                  {useShortLink ? 'Short: msme.to' : 'Full URL'}
                </button>
              </div>
            </div>

            {/* Generated Link Display Box */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                Your Dedicated Peer Onboarding Link:
              </span>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#051a3d] border border-slate-200 dark:border-blue-900/80 rounded-xl p-2">
                <span className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 truncate flex-1 pl-1">
                  {activeReferralLink}
                </span>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    copiedLink
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] hover:bg-[#072c66] dark:hover:bg-[#9be81c]'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Link
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-[#0A3981] dark:hover:text-[#8CE600] hover:bg-white dark:hover:bg-[#061F4A] rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-blue-800 cursor-pointer"
                  title="Show QR Code for instant mobile scanning"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Persona Template Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                Select Peer Specialty Template
              </span>
              <span className="text-[11px] text-slate-400">Customizes copy for highest conversion</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'accounting', label: 'Accounting & Tax Firms', icon: '📊' },
                { id: 'technology', label: 'IT & POS Integrators', icon: '💻' },
                { id: 'advisory', label: 'Business Advisors', icon: '👔' }
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setAudiencePersona(p.id as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    audiencePersona === p.id
                      ? 'bg-white dark:bg-[#0A3981] border-[#0A3981] dark:border-[#8CE600] text-[#0A3981] dark:text-white shadow-xs ring-1 ring-[#0A3981]/20 dark:ring-[#8CE600]/30'
                      : 'bg-white/60 dark:bg-[#072457] border-slate-200 dark:border-blue-900/60 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-blue-900/40'
                  }`}
                >
                  <div className="text-base mb-1">{p.icon}</div>
                  <div className="text-xs font-bold leading-tight">{p.label}</div>
                </button>
              ))}
            </div>

            {/* Message Preview Box */}
            <div className="bg-white dark:bg-[#072457] rounded-2xl p-4 border border-slate-200 dark:border-blue-800/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Invitation Message Preview:</span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-xs font-bold text-[#0A3981] dark:text-[#8CE600] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      Message Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Invitation Text
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans bg-slate-50 dark:bg-[#061F4A] p-3 rounded-xl border border-slate-100 dark:border-blue-900/60">
                "{currentMessage}"
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Social Media One-Click Sharing Buttons & Peer Benefits */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="bg-white dark:bg-[#072457] rounded-2xl p-5 border border-slate-200 dark:border-blue-800/80 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Share2 className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  One-Click Social Media Broadcast
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dispatch your customized peer invitation directly across your favorite channels:
              </p>
            </div>

            {/* Social Buttons Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-[#25D366] hover:bg-[#20ba59] transition-all shadow-xs cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Direct
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                onClick={handleShareLinkedIn}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-[#0077B5] hover:bg-[#006097] transition-all shadow-xs cursor-pointer"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn Post
              </button>

              {/* X / Twitter */}
              <button
                type="button"
                onClick={handleShareTwitter}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-slate-900 hover:bg-black dark:bg-[#061F4A] dark:hover:bg-blue-950 border border-slate-700 dark:border-blue-800 transition-all shadow-xs cursor-pointer"
              >
                <Twitter className="w-4 h-4" />
                X / Twitter
              </button>

              {/* Telegram */}
              <button
                type="button"
                onClick={handleShareTelegram}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-[#229ED9] hover:bg-[#1e8ec3] transition-all shadow-xs cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Telegram Channel
              </button>

              {/* Direct Email */}
              <button
                type="button"
                onClick={handleShareEmail}
                className="col-span-2 w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold text-xs text-[#0A3981] dark:text-white bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 transition-all shadow-xs cursor-pointer"
              >
                <Mail className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
                Send Formal Colleague Email Invitation
              </button>
            </div>
          </div>

          {/* Peer Referral Rewards Card */}
          <div className="bg-gradient-to-br from-[#0A3981] to-[#072557] rounded-2xl p-5 text-white border border-blue-800/80 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8CE600]">
              <Sparkles className="w-4 h-4" />
              Accredited Peer Rewards Terms
            </div>

            <div className="space-y-2 text-xs text-blue-100/90 leading-relaxed">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8CE600] shrink-0 mt-0.5" />
                <span><strong>5% Lifetime Peer Override:</strong> Earn a recurring 5% bonus on billings generated by partners you introduce.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8CE600] shrink-0 mt-0.5" />
                <span><strong>$150 Co-Marketing Grant:</strong> Credited to your practice once your peer activates their first 3 client subscriptions.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#8CE600] shrink-0 mt-0.5" />
                <span><strong>Fast-Track Review:</strong> Referred peers bypass general review queues and receive designated priority onboarding.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal for In-Person Events */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#072457] rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 dark:border-blue-800 shadow-2xl text-center space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Scan Peer Referral Link
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Partner Code: <span className="font-mono font-bold text-[#0A3981] dark:text-[#8CE600]">{partnerCode}</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* High-Contrast SVG QR Mockup */}
              <div className="p-4 bg-white rounded-2xl border-2 border-slate-200 shadow-inner flex flex-col items-center justify-center">
                <svg
                  className="w-48 h-48"
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Outer Frame */}
                  <rect width="100" height="100" fill="white" />
                  {/* Position Markers (Top-Left, Top-Right, Bottom-Left) */}
                  <rect x="10" y="10" width="24" height="24" fill="#0A3981" rx="4" />
                  <rect x="14" y="14" width="16" height="16" fill="white" rx="2" />
                  <rect x="18" y="18" width="8" height="8" fill="#0A3981" rx="1" />

                  <rect x="66" y="10" width="24" height="24" fill="#0A3981" rx="4" />
                  <rect x="70" y="14" width="16" height="16" fill="white" rx="2" />
                  <rect x="74" y="18" width="8" height="8" fill="#0A3981" rx="1" />

                  <rect x="10" y="66" width="24" height="24" fill="#0A3981" rx="4" />
                  <rect x="14" y="70" width="16" height="16" fill="white" rx="2" />
                  <rect x="18" y="74" width="8" height="8" fill="#0A3981" rx="1" />

                  {/* Matrix QR Data Dots */}
                  <rect x="40" y="12" width="6" height="6" fill="#0F172A" rx="1" />
                  <rect x="52" y="12" width="6" height="6" fill="#0F172A" rx="1" />
                  <rect x="44" y="24" width="8" height="6" fill="#0F172A" rx="1" />
                  <rect x="40" y="36" width="6" height="6" fill="#0F172A" rx="1" />
                  <rect x="52" y="36" width="6" height="6" fill="#0F172A" rx="1" />
                  <rect x="12" y="44" width="8" height="6" fill="#0F172A" rx="1" />
                  <rect x="26" y="44" width="6" height="6" fill="#0F172A" rx="1" />
                  <rect x="66" y="44" width="8" height="6" fill="#0F172A" rx="1" />
                  <rect x="80" y="44" width="6" height="6" fill="#0F172A" rx="1" />
                  <rect x="40" y="48" width="18" height="6" fill="#0A3981" rx="1" />
                  <rect x="44" y="60" width="6" height="6" fill="#0F172A" rx="1" />
                  <rect x="56" y="60" width="6" height="6" fill="#0F172A" rx="1" />
                  <rect x="40" y="72" width="6" height="6" fill="#0F172A" rx="1" />
                  <rect x="52" y="72" width="6" height="6" fill="#0F172A" rx="1" />
                  <rect x="66" y="72" width="8" height="6" fill="#0F172A" rx="1" />
                  <rect x="80" y="72" width="6" height="6" fill="#0F172A" rx="1" />
                  <rect x="66" y="84" width="20" height="6" fill="#0A3981" rx="1" />

                  {/* Center Brand Accent Tag */}
                  <rect x="43" y="43" width="14" height="14" fill="#0A3981" rx="3" />
                  <text x="50" y="53" fill="#8CE600" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    MB
                  </text>
                </svg>

                <span className="text-[10px] text-slate-500 font-mono mt-2">
                  msme.to/partner/peer-{partnerCode.replace(/[^a-zA-Z0-9]/g, '')}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] font-bold text-xs hover:bg-[#072c66] transition-colors cursor-pointer"
                >
                  {copiedLink ? 'Copied URL!' : 'Copy Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-blue-900/50 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
