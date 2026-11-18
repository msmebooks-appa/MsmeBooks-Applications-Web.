import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, Building2, Phone, Mail, User } from 'lucide-react';
import { PRICING_PLANS } from '../data/pricingData';
import { Currency } from '../types';
import { formatCurrency } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlanId?: string;
  isDemoMode?: boolean;
  currency?: Currency;
}

export const TrialModal: React.FC<TrialModalProps> = ({
  isOpen,
  onClose,
  initialPlanId = 'professional',
  isDemoMode = false,
  currency = 'NGN',
}) => {
  const { t, language } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState(initialPlanId);
  const [businessName, setBusinessName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [branches, setBranches] = useState('1');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    onClose();
  };

  const currentPlan = PRICING_PLANS.find((p) => p.id === selectedPlan) || PRICING_PLANS[1];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-[#0B192C] rounded-3xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0B192C] to-[#0A4FD5] dark:from-[#050C16] dark:to-[#083896] text-white p-6 sm:p-8">
              <div className="inline-flex items-center gap-1.5 bg-lime-400/20 text-lime-300 text-xs font-bold px-3 py-1 rounded-full border border-lime-400/30 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                {isDemoMode ? t.common.bookDemo : t.common.startFreeTrial}
              </div>
              <h3 className="text-2xl font-black text-white">
                {isDemoMode ? t.trialModal.demoTitle : t.trialModal.trialTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1.5">
                {isDemoMode ? t.trialModal.demoSubtitle : t.trialModal.trialSubtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 text-xs">
              
              {/* Plan Picker */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                  {t.trialModal.selectedPlanLabel}
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                  {PRICING_PLANS.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`p-2 rounded-xl text-center border font-bold text-xs transition-all cursor-pointer ${
                        selectedPlan === plan.id
                          ? 'border-[#0A4FD5] dark:border-blue-500 bg-blue-50 dark:bg-blue-950/50 text-[#0A4FD5] dark:text-blue-400 ring-2 ring-[#0A4FD5]/20'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div>{plan.name}</div>
                      <div className="text-[10px] font-normal text-slate-500 dark:text-slate-400">
                        {plan.customPricing ? t.common.customPricing : `${formatCurrency(plan.monthlyPrice, currency, { compact: true })}/mo`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {t.trialModal.businessNameLabel}
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Zaria Fabrics & Boutiques Ltd"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/20 focus:border-[#0A4FD5] dark:focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t.trialModal.fullNameLabel}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Amina Yusuf"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/20 focus:border-[#0A4FD5] dark:focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t.trialModal.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amina@zariafabrics.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/20 focus:border-[#0A4FD5] dark:focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Branches Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t.trialModal.phoneLabel}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 915 848 2622"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/20 focus:border-[#0A4FD5] dark:focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t.trialModal.businessTypeLabel}
                  </label>
                  <select
                    value={branches}
                    onChange={(e) => setBranches(e.target.value)}
                    className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/20 focus:border-[#0A4FD5] dark:focus:border-blue-500"
                  >
                    <option value="1">1 Location (Single Store)</option>
                    <option value="2-3">2–3 Branches</option>
                    <option value="4-10">4–10 Branches</option>
                    <option value="10+">10+ Branches / Multi-City Depot</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#0A4FD5] hover:bg-[#07389B] text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all text-sm cursor-pointer"
                >
                  <span>
                    {isDemoMode
                      ? t.trialModal.submitDemoBtn
                      : `${t.trialModal.submitTrialBtn} (${currentPlan.name})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#65A30D]" />
                <span>{t.trialModal.noCardNotice}</span>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation State */
          <div className="p-8 sm:p-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-lime-100 dark:bg-lime-950/80 text-[#65A30D] dark:text-lime-400 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-2xl font-black text-[#0B192C] dark:text-white">
              Welcome to MsmeBooks, {fullName || 'Partner'}!
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              Your risk-free trial on the <strong className="text-[#0A4FD5] dark:text-blue-400">{currentPlan.name} Plan</strong> has been provisioned for <strong>{businessName || 'your business'}</strong> with our free usage model.
            </p>

            <div className="bg-slate-50 dark:bg-slate-900/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-left text-xs text-slate-700 dark:text-slate-300 space-y-2 my-4">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Account Portal:</span>
                <span className="font-bold text-slate-900 dark:text-white">app.msmebooks.org</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Contact Registered:</span>
                <span className="font-bold text-slate-900 dark:text-white">{phone || '+234 915 848 2622'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Trial Model:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Risk-Free (Free Usage Model)</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full bg-[#84CC16] hover:bg-[#65A30D] text-[#0B192C] font-black text-sm py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Go to Business Dashboard →
              </button>

              <a
                href="https://wa.me/2349158482622"
                target="_blank"
                rel="noreferrer"
                className="block text-xs font-semibold text-[#0A4FD5] dark:text-blue-400 hover:underline pt-1"
              >
                Connect with our onboarding team on WhatsApp (+234 915 848 2622)
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
