import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Building2, Mail, Phone, User, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedIndustry?: string;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  preselectedIndustry = 'Retail & Supermarkets',
}) => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phoneNumber: '',
    companyName: '',
    industry: preselectedIndustry,
    branchCount: '1-3 Branches',
    country: 'Nigeria',
    preferredDate: '',
    primaryChallenge: 'Connecting Point of Sale to Accounting',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.workEmail) return;
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-[#0B1E30] rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-[#1A3852] overflow-hidden relative max-h-[92vh] flex flex-col transition-colors">
        {/* Modal Header */}
        <div className="bg-[#0A3D62] dark:bg-[#07243B] text-white p-6 relative shrink-0">
          <button
            onClick={resetAndClose}
            className="absolute top-5 right-5 p-1 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#90CF24] mb-1">
            <span>Tailored Product Walkthrough</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight">{t.demoModal.title}</h3>
          <p className="text-xs text-slate-300 mt-1">
            {t.demoModal.subtitle}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-[#7CB518] dark:text-[#90CF24] rounded-full flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">{t.demoModal.successTitle}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
                {t.demoModal.successMessage}
              </p>
              <div className="bg-slate-50 dark:bg-[#081726] p-4 rounded-xl text-xs text-left space-y-1.5 border border-slate-200/80 dark:border-[#17334D]">
                <p><strong className="text-slate-700 dark:text-slate-300">Contact:</strong> {formData.fullName} ({formData.workEmail})</p>
                <p><strong className="text-slate-700 dark:text-slate-300">Industry:</strong> {formData.industry}</p>
              </div>
              <button
                onClick={resetAndClose}
                className="mt-4 px-6 py-2.5 bg-[#0A3D62] hover:bg-[#072B45] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                {t.demoModal.close}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.demoModal.fullName}
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Samuel Adebayo"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] focus:bg-white dark:focus:bg-[#0C1E30] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.demoModal.workEmail}
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={formData.workEmail}
                      onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] focus:bg-white dark:focus:bg-[#0C1E30] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.demoModal.phone}
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+234 801 234 5678"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] focus:bg-white dark:focus:bg-[#0C1E30] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.demoModal.companyName}
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Apex Enterprise"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] focus:bg-white dark:focus:bg-[#0C1E30] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.demoModal.industry}
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-900 dark:text-white"
                  >
                    <option value="Retail & Supermarkets">Retail &amp; Supermarkets</option>
                    <option value="Restaurants & Dining">Restaurants &amp; Dining</option>
                    <option value="Wholesale & Distribution">Wholesale &amp; Distribution</option>
                    <option value="Pharmacies & Healthcare">Pharmacies &amp; Healthcare</option>
                    <option value="Accounting & Bookkeeping">Accounting &amp; Bookkeeping</option>
                    <option value="Logistics & Warehousing">Logistics &amp; Warehousing</option>
                    <option value="Fashion & Boutiques">Fashion &amp; Boutiques</option>
                    <option value="E-commerce & Omnichannel">E-commerce &amp; Omnichannel</option>
                    <option value="Other Commercial Business">Other Commercial Business</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t.demoModal.outlets}
                  </label>
                  <select
                    value={formData.branchCount}
                    onChange={(e) => setFormData({ ...formData, branchCount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-900 dark:text-white"
                  >
                    <option value="Single Location">Single Location</option>
                    <option value="1-3 Branches">1-3 Branches</option>
                    <option value="4-10 Branches">4-10 Branches</option>
                    <option value="10+ Outlets / Warehouses">10+ Outlets / Warehouses</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Operational Goal / Need
                </label>
                <select
                  value={formData.primaryChallenge}
                  onChange={(e) => setFormData({ ...formData, primaryChallenge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-900 dark:text-white"
                >
                  <option value="Connecting Point of Sale to Accounting">Connecting Point of Sale to Accounting</option>
                  <option value="Multi-warehouse stock sync & variance reduction">Multi-warehouse stock sync &amp; variance reduction</option>
                  <option value="Daily branch cash reconciliation">Daily branch cash reconciliation</option>
                  <option value="Replacing manual spreadsheets & paper tally books">Replacing manual spreadsheets &amp; paper tally books</option>
                  <option value="Audit readiness & clean financial reporting">Audit readiness &amp; clean financial reporting</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#7CB518] hover:bg-[#90CF24] text-[#072B45] font-extrabold rounded-lg transition-all shadow-xs cursor-pointer text-sm"
                >
                  {t.demoModal.submit}
                </button>
              </div>

              <p className="text-[10px] text-center text-slate-400 dark:text-slate-500 pt-1">
                No credit card required. Sessions include custom setup for your POS hardware and chart of accounts.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
