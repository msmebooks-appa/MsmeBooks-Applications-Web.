import React, { useState } from 'react';
import { X, CheckCircle2, Handshake, Users, ArrowRight } from 'lucide-react';

interface PartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: string;
}

export const PartnerModal: React.FC<PartnerModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'Accountants & Bookkeepers',
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [partnerType, setPartnerType] = useState(defaultCategory);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    firmName: '',
    country: 'Nigeria',
    experienceYears: '3-5 years',
    clientCount: '10-30',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0B4EA2] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Handshake className="w-4 h-4 text-lime-400" />
              <span className="text-xs uppercase tracking-wider font-semibold text-lime-400">Ecosystem Partnership</span>
            </div>
            <h3 className="text-xl font-bold mt-1">Join the MsmeBooks Partner Program</h3>
          </div>
          <button
            onClick={handleReset}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-lime-100 dark:bg-lime-950/60 border border-lime-200 dark:border-lime-800 rounded-full flex items-center justify-center mx-auto mb-4 text-[#65A30D] dark:text-lime-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Partner Application Received</h4>
              <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto leading-relaxed mb-6">
                Thank you for applying as a MsmeBooks Partner. Our partnership alliances team will contact <strong className="text-slate-900 dark:text-white">{formData.email}</strong> within 1-2 business days with program documentation and onboarding details.
              </p>
              <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 text-xs text-slate-700 dark:text-slate-300 text-left space-y-1 mb-6">
                <p><strong>Track:</strong> {partnerType}</p>
                <p><strong>Firm / Practice:</strong> {formData.firmName || 'Independent Consultant'}</p>
                <p><strong>Territory:</strong> {formData.country}</p>
              </div>
              <button
                onClick={handleReset}
                className="w-full py-3 bg-[#0B4EA2] text-white rounded-xl font-semibold hover:bg-[#083770] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Grow your practice, earn partner revenue share, and empower your clients with cloud accounting, inventory, and POS solutions.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Partner Category
                </label>
                <select
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Accountants & Bookkeepers">Accountants & Bookkeepers</option>
                  <option value="Tax Consultants">Tax Consultants</option>
                  <option value="Technology & IT Companies">Technology & IT Companies</option>
                  <option value="Software Resellers & Distributors">Software Resellers & Distributors</option>
                  <option value="Business Consultants">Business Consultants</option>
                  <option value="POS Agents">POS Agents</option>
                  <option value="Training Organizations">Training Organizations</option>
                  <option value="Financial & Business Advisory Firms">Financial & Business Advisory Firms</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Babatunde Adeleke"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Professional Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="partner@advisory.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone / WhatsApp Number
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
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Firm / Consultancy Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Keystone Financial Associates"
                    value={formData.firmName}
                    onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Market
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
                    <option value="Pan-African">Pan-African Multi-Country</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Current SME Clients
                  </label>
                  <select
                    value={formData.clientCount}
                    onChange={(e) => setFormData({ ...formData, clientCount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                  >
                    <option value="1-10">1 - 10 active clients</option>
                    <option value="10-30">10 - 30 active clients</option>
                    <option value="30-100">30 - 100 active clients</option>
                    <option value="100+">100+ active clients</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0B4EA2] hover:bg-[#083770] text-white font-semibold rounded-xl transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Submit Partner Application</span>
                  <ArrowRight className="w-4 h-4 text-lime-300" />
                </button>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-2">
                  Official partner onboarding, dedicated support portal, and revenue share terms provided upon verification.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
