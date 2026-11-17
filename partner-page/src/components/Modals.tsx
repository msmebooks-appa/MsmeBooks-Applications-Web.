import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Play, 
  Clock, 
  MapPin, 
  Download, 
  Send,
  Calendar,
  Building2,
  Phone,
  Mail,
  User,
  Crown
} from 'lucide-react';
import { VideoItem, CaseStudy, EventItem } from '../types';

/* -------------------------------------------------------------
 * 1. APPLY PARTNER MODAL
 * ------------------------------------------------------------- */
interface ApplyPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTier?: string;
}

export const ApplyPartnerModal: React.FC<ApplyPartnerModalProps> = ({
  isOpen,
  onClose,
  initialTier = 'partner'
}) => {
  const [tier, setTier] = useState<string>(initialTier);
  const [partnerType, setPartnerType] = useState('Accounting & Bookkeeping Firm');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [clientCount, setClientCount] = useState('20–50 MSMEs');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-[#0A192F] font-display">
              Welcome to MsmeBooks Partner Ecosystem!
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              We have received your application for the <strong className="text-[#0F4C81] capitalize">{tier} Tier</strong>. A regional channel manager in <strong>{country}</strong> will reach out to <strong>{email || 'you'}</strong> within 24 hours to finalize your multi-tenant portal credentials and co-marketing pack.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1">
              <div className="text-slate-500">Applicant: <span className="font-bold text-slate-800">{fullName || 'Partner Lead'}</span></div>
              <div className="text-slate-500">Partner Category: <span className="font-bold text-slate-800">{partnerType}</span></div>
              <div className="text-slate-500">Target MSME Base: <span className="font-bold text-slate-800">{clientCount}</span></div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-6 w-full py-3 rounded-xl bg-[#0F4C81] text-white font-bold text-sm hover:bg-[#0A3861] transition-colors"
            >
              Done & Return to Overview
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0F4C81] mb-1">
              <Sparkles className="w-4 h-4 text-[#84CC16]" />
              Partner Channel Onboarding
            </div>
            <h3 className="text-2xl font-extrabold text-[#0A192F] font-display">
              Join the MsmeBooks Partner Program
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-6">
              Unlock recurring revenue, wholesale multi-tenant software tools, and certified African MSME client management.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Tier Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Desired Partner Tier</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'bronze', label: 'Bronze 15%' },
                    { id: 'silver', label: 'Silver 20%' },
                    { id: 'partner', label: 'Partner 30%' },
                    { id: 'platinum', label: 'Platinum 40%' }
                  ].map(t => (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setTier(t.id)}
                      className={`py-2 px-1 text-[11px] font-bold rounded-lg border text-center transition-all ${
                        tier === t.id
                          ? 'bg-[#0F4C81] text-white border-[#0F4C81] shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Partner Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Professional Category</label>
                <select
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0F4C81]"
                >
                  <option>Accounting & Bookkeeping Firm</option>
                  <option>Business Management Consultant</option>
                  <option>IT & Software Solution Provider / MSP</option>
                  <option>POS Hardware & Payment Agent</option>
                  <option>Corporate BPO & Virtual Assistant Firm</option>
                  <option>Trade Chamber / Industry Association</option>
                </select>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name / Lead Partner</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Babatunde Okafor, FCA"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F4C81]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    placeholder="partner@firm.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F4C81]"
                  />
                </div>
              </div>

              {/* Phone & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country of Primary Operation</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0F4C81]"
                  >
                    <option>Nigeria</option>
                    <option>Kenya</option>
                    <option>Ghana</option>
                    <option>Rwanda</option>
                    <option>South Africa</option>
                    <option>Egypt</option>
                    <option>Uganda</option>
                    <option>Tanzania</option>
                    <option>Other African Nation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Direct Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F4C81]"
                  />
                </div>
              </div>

              {/* Estimated client reach */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Estimated MSME Client Base to Onboard (Year 1)</label>
                <select
                  value={clientCount}
                  onChange={(e) => setClientCount(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-[#0F4C81]"
                >
                  <option>5–15 MSMEs (Ideal for Bronze/Silver)</option>
                  <option>20–50 MSMEs (Ideal for Partner Tier)</option>
                  <option>50–150 MSMEs (Platinum Fast-Track)</option>
                  <option>150+ MSMEs (Strategic Enterprise / Association)</option>
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#84CC16] hover:bg-[#9BE22D] text-[#0A192F] font-extrabold text-sm shadow-lg shadow-[#84CC16]/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Submit Partner Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center">
                🔒 Your privacy is secured. We never share partner client lists or confidential business metrics.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};


/* -------------------------------------------------------------
 * 2. VIDEO MODAL PLAYER
 * ------------------------------------------------------------- */
interface VideoModalProps {
  video: VideoItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0A192F] text-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-700 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Video Canvas Simulation */}
        <div className="relative h-64 sm:h-96 w-full bg-black flex items-center justify-center">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-black/40" />

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-16 h-16 rounded-full bg-[#84CC16] text-[#0A192F] flex items-center justify-center shadow-xl hover:scale-105 transition-transform z-10"
          >
            {isPlaying ? (
              <span className="w-4 h-4 bg-[#0A192F] rounded-xs" />
            ) : (
              <Play className="w-6 h-6 fill-current ml-1" />
            )}
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
            <div className="h-full bg-[#84CC16] w-1/3 animate-pulse" />
          </div>
        </div>

        {/* Video Details */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0F4C81] text-sky-200">
              {video.tag}
            </span>
            <span className="text-xs font-mono text-[#84CC16] flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {video.duration}
            </span>
          </div>
          <h3 className="text-xl font-bold font-display text-white">{video.title}</h3>
          <p className="text-xs text-slate-400 mt-1">
            Featured Presenter: <strong className="text-white">{video.presenter}</strong>
          </p>
          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
            {video.description}
          </p>
        </div>
      </div>
    </div>
  );
};


/* -------------------------------------------------------------
 * 3. DASHBOARD WALKTHROUGH TOUR MODAL
 * ------------------------------------------------------------- */
interface DashboardTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export const DashboardTourModal: React.FC<DashboardTourModalProps> = ({
  isOpen,
  onClose,
  onApply
}) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const tourSteps = [
    {
      title: 'Unified Multi-Tenant Ledger Oversight',
      desc: 'Switch between client books with a single click. Review cashflow reconciliations, sales receipts, and tax filings without asking clients for raw login credentials.',
      tag: 'Oversight'
    },
    {
      title: 'Automated Commission Settlement Audit',
      desc: 'Transparent payout ledger detailing every eligible customer subscription, renewal, active duration, and direct wire settlement to your designated African bank.',
      tag: 'Commission'
    },
    {
      title: 'Dedicated Lead & Client Provisioning',
      desc: 'Deploy custom software instances for new clients in under 3 minutes with pre-configured industry chart of accounts (Retail, Pharmacy, Hospitality, Construction).',
      tag: 'Provisioning'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-block px-3 py-1 rounded-full bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold uppercase mb-3">
          Partner Console Interactive Tour
        </div>

        <h3 className="text-2xl font-extrabold text-[#0A192F] font-display">
          {tourSteps[step].title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          {tourSteps[step].desc}
        </p>

        {/* Visual Mockup Box */}
        <div className="my-6 p-4 rounded-2xl bg-[#0A192F] text-white font-mono text-xs space-y-2 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-[#84CC16] border-b border-slate-800 pb-2">
            <span>● CONSOLE: ACTIVE CONNECTION</span>
            <span>TIER: PLATINUM (40%)</span>
          </div>
          <div className="text-slate-300">
            &gt; Selected Client: Adebayo Superstores Ltd (Ikeja, Lagos)
          </div>
          <div className="text-slate-400">
            &gt; Sync Status: Real-time Cloud Accounting (VAT 7.5% Auto-Computed)
          </div>
          <div className="text-emerald-400">
            &gt; Next Commission Cycle: ₦874,500.00 scheduled for disbursement
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-1.5">
            {tourSteps.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${
                  step === i ? 'w-6 bg-[#0F4C81]' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            {step < tourSteps.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0F4C81] hover:bg-[#0A3861] rounded-xl"
              >
                Next Feature →
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  onApply();
                }}
                className="px-4 py-2 text-xs font-bold text-[#0A192F] bg-[#84CC16] hover:bg-[#9BE22D] rounded-xl"
              >
                Get Console Access
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


/* -------------------------------------------------------------
 * 4. CONTACT PARTNERSHIP TEAM MODAL
 * ------------------------------------------------------------- */
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#0A192F]">Inquiry Sent Successfully</h3>
            <p className="text-xs text-slate-600 mt-2">
              Our Pan-African Channel Director will contact you via email or phone within 4 business hours.
            </p>
            <button
              onClick={() => {
                setSent(false);
                onClose();
              }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#0F4C81] text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            <span className="text-xs font-bold text-[#0F4C81] uppercase tracking-wider block mb-1">
              Direct Channel Advisory
            </span>
            <h3 className="text-2xl font-extrabold text-[#0A192F] font-display">
              Talk to the MsmeBooks Partnership Team
            </h3>
            <p className="text-xs text-slate-600 mt-1 mb-6">
              Connect directly with our regional alliance directors in Lagos, Nairobi, Accra, or Kigali.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Name & Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sandra Mwangi, Managing Partner"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F4C81]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Work Email</label>
                <input
                  type="email"
                  required
                  placeholder="sandra@advisors.ke"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F4C81]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">How can we support your firm?</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about your client base, current software stack, or co-marketing requirements..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F4C81]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#0F4C81] hover:bg-[#0A3861] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Request Strategic Callback</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};


/* -------------------------------------------------------------
 * 5. CASE STUDY MODAL DEEP DIVE
 * ------------------------------------------------------------- */
interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  caseStudy,
  isOpen,
  onClose,
  onApply
}) => {
  if (!isOpen || !caseStudy) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0F4C81] text-white">
          {caseStudy.tag} • {caseStudy.location}
        </span>

        <h3 className="text-2xl font-extrabold text-[#0A192F] font-display mt-2">
          {caseStudy.title}
        </h3>
        <p className="text-xs font-semibold text-slate-500 mt-0.5">
          Organization: {caseStudy.firmName}
        </p>

        <div className="grid grid-cols-3 gap-3 my-6 text-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
          {caseStudy.growthStats.map((st, i) => (
            <div key={i}>
              <span className="text-xl font-extrabold text-[#0F4C81] block">{st.value}</span>
              <span className="text-xs text-slate-500">{st.label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-100">
            <h4 className="font-bold text-rose-800 text-xs uppercase mb-1">Operational Bottleneck (Before):</h4>
            <p className="leading-relaxed">{caseStudy.before}</p>
          </div>

          <div className="bg-blue-50/70 p-4 rounded-xl border border-blue-100">
            <h4 className="font-bold text-[#0F4C81] text-xs uppercase mb-1">MsmeBooks Technology Solution:</h4>
            <p className="leading-relaxed">{caseStudy.solution}</p>
          </div>

          <div className="bg-lime-50/80 p-4 rounded-xl border border-lime-200">
            <h4 className="font-bold text-[#3F6212] text-xs uppercase mb-1">Business Transformation (Outcome):</h4>
            <p className="leading-relaxed font-medium text-emerald-950">{caseStudy.outcome}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            Back to Overview
          </button>
          <button
            onClick={() => {
              onClose();
              onApply();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#84CC16] hover:bg-[#9BE22D] text-[#0A192F] font-bold text-xs flex items-center gap-1.5"
          >
            <span>Achieve Similar Results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
