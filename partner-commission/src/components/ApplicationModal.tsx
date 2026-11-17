import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { PARTNER_CATEGORIES, PARTNER_TIERS } from '../data/partnerData';
import { PartnerTierId, PartnerApplication } from '../types/partner';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTier?: PartnerTierId;
  preselectedCategory?: string;
  onSubmitted?: (application: PartnerApplication) => void;
  onOpenAgreement: () => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  preselectedTier = 'gold',
  preselectedCategory,
  onSubmitted,
  onOpenAgreement
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    city: '',
    categoryId: preselectedCategory || PARTNER_CATEGORIES[0].id,
    preferredTier: preselectedTier,
    website: '',
    networkSize: '10–50 SMEs',
    experience: '',
    proposal: '',
    agreementAccepted: false,
    privacyAccepted: false
  });

  const [submittedApp, setSubmittedApp] = useState<PartnerApplication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        preferredTier: preselectedTier,
        categoryId: preselectedCategory || prev.categoryId
      }));
      setSubmittedApp(null);
      setErrorMessage(null);
    }
  }, [isOpen, preselectedTier, preselectedCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setErrorMessage('Please fill in your name, business email, and phone number.');
      return;
    }

    if (!formData.agreementAccepted || !formData.privacyAccepted) {
      setErrorMessage('You must accept the MsmeBooks Partner Agreement and Privacy Policy to proceed.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newApp: PartnerApplication = {
        id: `MSME-APP-${Math.floor(10000 + Math.random() * 90000)}`,
        fullName: formData.fullName,
        businessName: formData.businessName || formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city || 'Lagos',
        categoryId: formData.categoryId,
        preferredTier: formData.preferredTier,
        website: formData.website,
        networkSize: formData.networkSize,
        experience: formData.experience,
        proposal: formData.proposal,
        agreementAccepted: formData.agreementAccepted,
        privacyAccepted: formData.privacyAccepted,
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'under_review',
        monthlyConversions: formData.networkSize.includes('50–150') ? 28 : formData.networkSize.includes('10–50') ? 14 : 6,
        monthlyRevenueNGN: (formData.networkSize.includes('50–150') ? 28 : formData.networkSize.includes('10–50') ? 14 : 6) * 100000,
        monthlyCommissionNGN: (formData.networkSize.includes('50–150') ? 28 : formData.networkSize.includes('10–50') ? 14 : 6) * 100000 * (formData.preferredTier === 'platinum' ? 0.40 : formData.preferredTier === 'gold' ? 0.30 : formData.preferredTier === 'silver' ? 0.20 : 0.15),
        growthMoM: '+15%',
        flagEmoji: formData.country === 'Nigeria' ? '🇳🇬' : formData.country === 'Kenya' ? '🇰🇪' : formData.country === 'Ghana' ? '🇬🇭' : formData.country === 'South Africa' ? '🇿🇦' : formData.country === 'Rwanda' ? '🇷🇼' : '🌍',
        badgeTitle: 'Newly Enrolled Contender'
      };

      setSubmittedApp(newApp);
      setIsSubmitting(false);
      if (onSubmitted) onSubmitted(newApp);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#101e35] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-2xl relative my-8">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
          aria-label="Close application modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submittedApp ? (
          /* Confirmation Screen */
          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-[#B9E51C] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 dark:text-[#B9E51C] uppercase tracking-wider block">
                Application Submitted Successfully
              </span>
              <h3 className="text-2xl font-extrabold text-[#142D4E] dark:text-white">
                Thank You, {submittedApp.fullName}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Your partnership application has been registered into the MsmeBooks Partner Operations queue.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-[#0c182c] border border-slate-200 dark:border-slate-700 rounded-xl p-5 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Application Reference ID:</span>
                <span className="font-mono font-bold text-[#142D4E] dark:text-white">{submittedApp.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Applicant Organization:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{submittedApp.businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Requested Tier:</span>
                <span className="font-bold text-[#1261B5] dark:text-[#B9E51C] uppercase">{submittedApp.preferredTier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Verification Status:</span>
                <span className="text-amber-700 dark:text-amber-300 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                  Under Operational Review (24-48h)
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto space-y-2 text-left">
              <p className="font-semibold text-slate-700 dark:text-slate-200">What Happens Next?</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Our partner enablement manager reviews your organization details.</li>
                <li>Your partner tier and custom tracking code will be activated.</li>
                <li>You will receive an onboarding invitation email with dashboard login access.</li>
              </ul>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1261B5] hover:bg-[#0e4e94] transition-colors"
            >
              Done & Return to Program Overview
            </button>
          </div>
        ) : (
          /* Application Form */
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider mb-1">
                <span>MsmeBooks Official Partnership</span>
                <span aria-hidden="true">·</span>
                <span>Application Form</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#142D4E] dark:text-white">
                Apply to Become an MsmeBooks Partner
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Join our certified partner ecosystem and earn 15% to 40% recurring commissions. Zero setup fees.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Row 1: Full Name & Business Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Babatunde Adeleke"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#14233c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Firm / Organization Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    placeholder="e.g. Adeleke & Associates Advisory"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#14233c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="partner@yourfirm.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#14233c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Phone Number (with Country Code) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234 802 345 6789"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#14233c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
                  />
                </div>
              </div>

              {/* Row 3: Country & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#14233c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Ghana">Ghana</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Other">Other Global Jurisdiction</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">City / Region</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Lagos, Nairobi, Accra..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#14233c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
                  />
                </div>
              </div>

              {/* Row 4: Partner Category & Preferred Tier */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Partner Category (18 Roles)
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#14233c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
                  >
                    {PARTNER_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Preferred Partnership Tier
                  </label>
                  <select
                    value={formData.preferredTier}
                    onChange={(e) =>
                      setFormData({ ...formData, preferredTier: e.target.value as PartnerTierId })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#14233c] font-semibold text-[#1261B5] dark:text-[#B9E51C] focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
                  >
                    {PARTNER_TIERS.map((tier) => (
                      <option key={tier.id} value={tier.id}>
                        {tier.name} ({tier.rateDisplay} Recurring)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Website & Network Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Website or LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourfirm.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#14233c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                    Estimated SME Customer Network
                  </label>
                  <select
                    value={formData.networkSize}
                    onChange={(e) => setFormData({ ...formData, networkSize: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#14233c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
                  >
                    <option value="1–10 SMEs">1 – 10 SMEs</option>
                    <option value="10–50 SMEs">10 – 50 SMEs</option>
                    <option value="50–150 SMEs">50 – 150 SMEs</option>
                    <option value="150+ SMEs">150+ Enterprise Network</option>
                  </select>
                </div>
              </div>

              {/* Brief Proposal / Experience */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">
                  Brief Partnership Proposal & Relevant Experience
                </label>
                <textarea
                  rows={2}
                  value={formData.proposal}
                  onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                  placeholder="Share how you plan to introduce or implement MsmeBooks with your clients..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-[#14233c] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1261B5] resize-none"
                />
              </div>

              {/* Policy Checkboxes */}
              <div className="pt-2 space-y-2 border-t border-slate-200 dark:border-slate-700">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreementAccepted}
                    onChange={(e) =>
                      setFormData({ ...formData, agreementAccepted: e.target.checked })
                    }
                    className="mt-0.5 rounded border-slate-300 text-[#1261B5] focus:ring-[#1261B5]"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">
                    I have reviewed and agree to the{' '}
                    <button
                      type="button"
                      onClick={onOpenAgreement}
                      className="text-[#1261B5] dark:text-[#B9E51C] font-semibold underline"
                    >
                      MsmeBooks Partner Agreement
                    </button>
                    , including attribution rules, recurring commission terms, and ethical promotion standards.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacyAccepted}
                    onChange={(e) =>
                      setFormData({ ...formData, privacyAccepted: e.target.checked })
                    }
                    className="mt-0.5 rounded border-slate-300 text-[#1261B5] focus:ring-[#1261B5]"
                  />
                  <span className="text-[11px] text-slate-600 dark:text-slate-300">
                    I consent to MsmeBooks processing my professional contact information in accordance with the Privacy Policy.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#1261B5] hover:bg-[#0e4e94] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-md shadow-[#1261B5]/25"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <span>Submit Partner Application</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <p className="text-[10px] text-center text-slate-400 mt-2">
                  *Applications are evaluated by the partner enablement team within 24–48 hours. No immediate automatic approvals without credential review.
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
