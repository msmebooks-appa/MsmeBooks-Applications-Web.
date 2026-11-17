import React, { useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { X, CheckCircle, ShieldCheck, ArrowRight, Store, Briefcase } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({ isOpen, onClose }) => {
  const { currentCurrency, formatFromNGN } = useCurrency();
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const [businessType, setBusinessType] = useState('retail');
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    branches: '1',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0B4EA2] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-lime-400">14-Day Free Access</span>
            <h3 className="text-xl font-bold mt-0.5">Start with MsmeBooks</h3>
          </div>
          <button
            onClick={handleReset}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8">
          {submitted ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-lime-100 dark:bg-lime-950/60 border border-lime-200 dark:border-lime-800 rounded-full flex items-center justify-center mx-auto mb-4 text-[#65A30D] dark:text-lime-400">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Welcome to MsmeBooks!</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
                Your workspace account for <strong className="text-slate-900 dark:text-white">{formData.businessName || 'your business'}</strong> has been initiated. An activation link has been dispatched to <strong className="text-slate-900 dark:text-white">{formData.email}</strong>.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-xl p-4 text-xs text-[#0B4EA2] dark:text-sky-300 flex items-center gap-2 text-left mb-6">
                <ShieldCheck className="w-5 h-5 shrink-0 text-[#0B4EA2] dark:text-lime-400" />
                <span>Zero setup fees. Full access to Accounting, POS, and Inventory modules included.</span>
              </div>
              <button
                onClick={handleReset}
                className="w-full py-3 bg-[#0B4EA2] text-white rounded-xl font-semibold hover:bg-[#083770] transition-colors cursor-pointer"
              >
                Continue to Platform
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Business / Trading Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cedar Coast Logistics"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Country of Operation
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Other">Other African Market</option>
                    <option value="Global">International / Global</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Number of Branches
                  </label>
                  <select
                    value={formData.branches}
                    onChange={(e) => setFormData({ ...formData, branches: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                  >
                    <option value="1">1 Single location</option>
                    <option value="2-3">2 - 3 branches</option>
                    <option value="4-10">4 - 10 branches</option>
                    <option value="10+">10+ branches</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Primary Business Model
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setBusinessType('retail')}
                    className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                      businessType === 'retail'
                        ? 'border-[#0B4EA2] dark:border-[#38BDF8] bg-blue-50/60 dark:bg-blue-950/40 text-[#0B4EA2] dark:text-sky-300 font-semibold'
                        : 'border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <Store className="w-4 h-4 text-[#84CC16] dark:text-lime-400" />
                    <span>Retail & POS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBusinessType('services')}
                    className={`p-3 rounded-lg border text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                      businessType === 'services'
                        ? 'border-[#0B4EA2] dark:border-[#38BDF8] bg-blue-50/60 dark:bg-blue-950/40 text-[#0B4EA2] dark:text-sky-300 font-semibold'
                        : 'border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-zinc-900'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-[#0B4EA2] dark:text-sky-400" />
                    <span>Services / Multi-branch</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0B4EA2] hover:bg-[#083770] text-white font-semibold rounded-xl transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Launch Free Account</span>
                  <ArrowRight className="w-4 h-4 text-lime-300" />
                </button>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-2">
                  14 days free trial. Then from{' '}
                  <span className="font-mono font-bold text-[#0B4EA2] dark:text-[#38BDF8] tabular-nums">
                    {formatFromNGN(15500)}
                  </span>
                  /mo ({currentCurrency.code}). No card required.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
