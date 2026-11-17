import React, { useState } from 'react';
import { PARTNER_CATEGORIES, PARTNER_TIERS } from '../data/partnersData';
import { PartnerTierId } from '../types';
import { ALL_WORLD_COUNTRIES, getStatesForCountry, findCountry } from '../data/worldCountriesAndStates';
import { CheckCircle2, ArrowRight, ArrowLeft, Shield, FileText, Check, AlertCircle, Globe, MapPin } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: string;
  initialTier?: PartnerTierId;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  initialCategory,
  initialTier = 'gold'
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    partnerType: initialCategory || PARTNER_CATEGORIES[0].title,
    preferredTier: initialTier,
    companyName: '',
    regNumber: '',
    country: 'Nigeria',
    state: 'Lagos State',
    city: '',
    website: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    yearsInBusiness: '3-5 years',
    clientBaseCount: 'Bronze 🥉 1–15 Clients',
    softwareExperience: '',
    interests: ['Referral sales', 'Implementation & onboarding'],
    agreePartnerTerms: false,
    agreeCommissionPolicy: false,
    agreePrivacyPolicy: false
  });

  // Dynamic states list based on chosen country
  const availableStates = React.useMemo(() => {
    return getStatesForCountry(formData.country);
  }, [formData.country]);

  const handleCountryChange = (newCountry: string) => {
    const states = getStatesForCountry(newCountry);
    setFormData((prev) => ({
      ...prev,
      country: newCountry,
      state: states.length > 0 ? states[0] : ''
    }));
  };

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    if (formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: formData.interests.filter((i) => i !== interest)
      });
    } else {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest]
      });
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 5) {
      // Generate unique application tracking reference
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const trackingCode = `APP-MSME-2026-${randomNum}`;
      setSubmittedRef(trackingCode);
      setCurrentStep(6);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#072457] rounded-3xl max-w-2xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 dark:border-blue-800 relative max-h-[92vh] overflow-y-auto transition-colors duration-300 ease-in-out">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg cursor-pointer transition-colors duration-200"
          aria-label="Close application form"
        >
          ✕
        </button>

        {/* Multi-Step Progress Indicator */}
        <div className="mb-8 transition-colors duration-300 ease-in-out">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            <span>Step {currentStep} of 6</span>
            <span className="text-[#0A3981] dark:text-[#8CE600]">
              {currentStep === 1 && 'Partner Type'}
              {currentStep === 2 && 'Business Information'}
              {currentStep === 3 && 'Experience & Capacity'}
              {currentStep === 4 && 'Partnership Interests'}
              {currentStep === 5 && 'Agreements & Policies'}
              {currentStep === 6 && 'Submission Confirmation'}
            </span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-[#061F4A] h-2 rounded-full overflow-hidden transition-colors duration-300">
            <div
              className="bg-gradient-to-r from-[#0A3981] to-[#8CE600] h-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Partner Type */}
        {currentStep === 1 && (
          <form onSubmit={handleNext}>
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-[#0A3981] dark:text-white">
                Select Your Primary Partner Category
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Choose the operational category that best represents your core services.
              </p>
            </div>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 mb-8">
              {PARTNER_CATEGORIES.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.partnerType === cat.title
                      ? 'border-[#0A3981] dark:border-[#8CE600] bg-blue-50/70 dark:bg-[#061F4A] shadow-sm ring-1 ring-[#8CE600]/30'
                      : 'border-slate-200 dark:border-blue-900/60 hover:bg-slate-50 dark:hover:bg-[#0A2552]'
                  }`}
                >
                  <input
                    type="radio"
                    name="partnerType"
                    checked={formData.partnerType === cat.title}
                    onChange={() => setFormData({ ...formData, partnerType: cat.title })}
                    className="mt-1 text-[#0A3981] dark:text-[#8CE600] focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">{cat.title}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-300 mt-0.5">{cat.shortDesc}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-blue-900/60 transition-colors duration-300 ease-in-out">
              <button
                type="submit"
                className="inline-flex items-center gap-2 py-3 px-6 text-sm font-bold text-white dark:text-[#061F4A] bg-[#0A3981] dark:bg-[#8CE600] hover:bg-[#072c66] dark:hover:bg-[#9be81c] rounded-xl shadow transition-colors cursor-pointer"
              >
                Continue to Business Information
                <ArrowRight className="w-4 h-4 text-[#8CE600] dark:text-[#061F4A]" />
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Business Information */}
        {currentStep === 2 && (
          <form onSubmit={handleNext}>
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-[#0A3981] dark:text-white">
                Business Entity & Contact Details
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Provide official incorporation details for partner agreement execution.
              </p>
            </div>

            <div className="space-y-4 mb-8 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Company / Practice Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Apex Global Advisory Ltd"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Company Registration Number (RC/CAC/BN)</label>
                  <input
                    type="text"
                    value={formData.regNumber}
                    onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                    placeholder="e.g. RC 1492041"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Country Selector (All Countries in Africa and Globally) */}
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
                    <span>Country (Worldwide) *</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none cursor-pointer"
                  >
                    <optgroup label="🌍 Pan-African Hubs">
                      {ALL_WORLD_COUNTRIES.filter((c) => c.region === 'Pan-Africa').map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name} ({c.states.length} states/regions)
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="🌐 Global Anchor Markets">
                      {ALL_WORLD_COUNTRIES.filter((c) => c.region !== 'Pan-Africa' && ['US', 'GB', 'IN', 'AE', 'CA', 'AU', 'DE', 'FR', 'SG', 'SA'].includes(c.code)).map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name} ({c.states.length} states/provinces)
                        </option>
                      ))}
                    </optgroup>

                    <optgroup label="🌐 All Countries of the World (A to Z)">
                      {ALL_WORLD_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* 2. Dynamic State / Province Selector */}
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
                    <span>State / Province / Region in {formData.country} *</span>
                  </label>
                  {availableStates.length > 0 ? (
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none cursor-pointer"
                    >
                      {availableStates.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="e.g. State or Region"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {/* City & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">City / Town / Local District *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Ikeja, Westlands, Victoria Island, Cocody"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Company Website / LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://yourfirm.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Contact Lead Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="partner@company.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+234 800 000 0000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-blue-900/60 transition-colors duration-300 ease-in-out">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 py-3 px-6 text-sm font-bold text-white dark:text-[#061F4A] bg-[#0A3981] dark:bg-[#8CE600] hover:bg-[#072c66] dark:hover:bg-[#9be81c] rounded-xl shadow transition-colors cursor-pointer"
              >
                Continue to Experience
                <ArrowRight className="w-4 h-4 text-[#8CE600] dark:text-[#061F4A]" />
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Professional Experience */}
        {currentStep === 3 && (
          <form onSubmit={handleNext}>
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-[#0A3981] dark:text-white">
                Professional Experience & Client Portfolio
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Help us evaluate your starting tier (Bronze 15%, Silver 20%, Gold 30%, or Platinum 40%).
              </p>
            </div>

            <div className="space-y-4 mb-8 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Years in Commercial Practice</label>
                  <select
                    value={formData.yearsInBusiness}
                    onChange={(e) => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none"
                  >
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1-3 years">1–3 years</option>
                    <option value="3-5 years">3–5 years</option>
                    <option value="5-10 years">5–10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Approximate SME Client Base *</label>
                  <select
                    value={formData.clientBaseCount}
                    onChange={(e) => setFormData({ ...formData, clientBaseCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none cursor-pointer font-medium"
                  >
                    <option value="Bronze 🥉 1–15 Clients">Bronze 🥉 1–15 Clients</option>
                    <option value="Silver 🥈 16–50 Clients">Silver 🥈 16–50 Clients</option>
                    <option value="Gold 🥇 51–150 Clients">Gold 🥇 51–150 Clients</option>
                    <option value="Platinum 🏆 151+ Clients">Platinum 🏆 151+ Clients</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-200 mb-1">Existing Accounting or ERP Software Experience</label>
                <textarea
                  rows={3}
                  value={formData.softwareExperience}
                  onChange={(e) => setFormData({ ...formData, softwareExperience: e.target.value })}
                  placeholder="e.g. QuickBooks Desktop/Online, Sage, Xero, Tally, manual Excel sheets, or proprietary POS systems..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#061F4A] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-blue-900/60 transition-colors duration-300 ease-in-out">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 py-3 px-6 text-sm font-bold text-white dark:text-[#061F4A] bg-[#0A3981] dark:bg-[#8CE600] hover:bg-[#072c66] dark:hover:bg-[#9be81c] rounded-xl shadow transition-colors cursor-pointer"
              >
                Continue to Partnership Interests
                <ArrowRight className="w-4 h-4 text-[#8CE600] dark:text-[#061F4A]" />
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Partnership Interests */}
        {currentStep === 4 && (
          <form onSubmit={handleNext}>
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-[#0A3981] dark:text-white">
                Partnership Scope & Business Models
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Select all activities you plan to execute with MsmeBooks:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                'Referral sales & commission earning',
                'Software resale & direct customer invoicing',
                'POS hardware sales & bundle installation',
                'Data migration from legacy accounting systems',
                'Client staff onboarding & ongoing training',
                'Outsourced monthly bookkeeping retainers',
                'Tax filing & statutory audit advisory',
                'Regional distribution & sub-agent management'
              ].map((interest, idx) => {
                const isChecked = formData.interests.includes(interest);
                return (
                  <label
                    key={idx}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                      isChecked
                        ? 'border-[#0A3981] dark:border-[#8CE600] bg-blue-50/70 dark:bg-[#061F4A] text-[#0A3981] dark:text-[#8CE600] font-bold ring-1 ring-[#8CE600]/30'
                        : 'border-slate-200 dark:border-blue-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#0A2552]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleInterest(interest)}
                      className="mt-0.5 rounded text-[#0A3981] dark:text-[#8CE600] focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                    />
                    <span>{interest}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-blue-900/60 transition-colors duration-300 ease-in-out">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 py-3 px-6 text-sm font-bold text-white dark:text-[#061F4A] bg-[#0A3981] dark:bg-[#8CE600] hover:bg-[#072c66] dark:hover:bg-[#9be81c] rounded-xl shadow transition-colors cursor-pointer"
              >
                Review Legal Agreements
                <ArrowRight className="w-4 h-4 text-[#8CE600] dark:text-[#061F4A]" />
              </button>
            </div>
          </form>
        )}

        {/* Step 5: Agreements & Policies */}
        {currentStep === 5 && (
          <form onSubmit={handleNext}>
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-[#0A3981] dark:text-white">
                Programme Agreements & Legal Governance
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
                Please review and accept our standard SaaS partnership policies:
              </p>
            </div>

            <div className="space-y-4 mb-8 bg-slate-50 dark:bg-[#061F4A] p-5 rounded-2xl border border-slate-200 dark:border-blue-800 text-xs sm:text-sm">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreePartnerTerms}
                  onChange={(e) => setFormData({ ...formData, agreePartnerTerms: e.target.checked })}
                  className="mt-1 rounded text-[#0A3981] dark:text-[#8CE600] focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  I accept the <strong className="text-slate-900 dark:text-white">MsmeBooks Master Partner Agreement</strong>, confirming that our organization will represent MsmeBooks software ethically, adhere to brand guidelines, and preserve customer confidentiality.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreeCommissionPolicy}
                  onChange={(e) => setFormData({ ...formData, agreeCommissionPolicy: e.target.checked })}
                  className="mt-1 rounded text-[#0A3981] dark:text-[#8CE600] focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  I understand the <strong className="text-slate-900 dark:text-white">Commission & Payout Policy</strong>, recognizing that commissions (15%–40%) are paid on qualifying collected subscription payments and subject to applicable partner agreement terms.
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.agreePrivacyPolicy}
                  onChange={(e) => setFormData({ ...formData, agreePrivacyPolicy: e.target.checked })}
                  className="mt-1 rounded text-[#0A3981] dark:text-[#8CE600] focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                />
                <span className="text-slate-700 dark:text-slate-300">
                  I consent to the <strong className="text-slate-900 dark:text-white">Data Privacy & Security Policy</strong> governing partner directory publishing, lead routing, and customer communication.
                </span>
              </label>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-blue-900/60 transition-colors duration-300 ease-in-out">
              <button
                type="button"
                onClick={handleBack}
                className="py-3 px-5 text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!formData.agreePartnerTerms || !formData.agreeCommissionPolicy || !formData.agreePrivacyPolicy}
                className="inline-flex items-center gap-2 py-3.5 px-7 text-sm font-bold text-white dark:text-[#061F4A] bg-[#0A3981] dark:bg-[#8CE600] hover:bg-[#072c66] dark:hover:bg-[#9be81c] disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                Submit Official Partner Application
                <Check className="w-4 h-4 text-[#8CE600] dark:text-[#061F4A]" />
              </button>
            </div>
          </form>
        )}

        {/* Step 6: Submission & Review Confirmation */}
        {currentStep === 6 && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-[#8CE600] flex items-center justify-center mx-auto mb-4 border border-transparent dark:border-emerald-800">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-[#0A3981] dark:text-white mb-2">
              Application Successfully Submitted!
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
              Thank you for applying to the MsmeBooks Partner Ecosystem. Your application dossier is now undergoing review by our Partner Operations Directorate.
            </p>

            {/* Application Tracking Badge */}
            <div className="bg-slate-50 dark:bg-[#061F4A] border border-slate-200 dark:border-blue-800 rounded-2xl p-4 max-w-sm mx-auto mb-6 text-left">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1">
                Application Tracking Reference:
              </div>
              <div className="text-lg font-mono font-bold text-[#0A3981] dark:text-[#8CE600] mb-2">
                {submittedRef}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Status: <strong className="text-slate-800 dark:text-white">Under Initial Review (Pending Assignment)</strong></span>
              </div>
            </div>

            <div className="p-4 bg-blue-50/70 dark:bg-[#0A2552] border border-blue-200 dark:border-blue-800 rounded-xl text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-8 text-left space-y-1.5">
              <div className="font-bold text-[#0A3981] dark:text-white">What happens next?</div>
              <div>1. Our team reviews your business registration and track specialisation.</div>
              <div>2. You receive your approved tier badge and login credentials for the Partner Portal.</div>
              <div>3. Your dedicated Partner Success Manager connects with you on WhatsApp / email.</div>
            </div>

            <button
              onClick={onClose}
              className="py-3 px-8 text-sm font-bold text-white dark:text-[#061F4A] bg-[#0A3981] dark:bg-[#8CE600] hover:bg-[#072c66] dark:hover:bg-[#9be81c] rounded-xl shadow cursor-pointer"
            >
              Return to Partner Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
