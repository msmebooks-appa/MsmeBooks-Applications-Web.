import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

interface ContactPartnershipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactPartnershipModal: React.FC<ContactPartnershipModalProps> = ({
  isOpen,
  onClose
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    categoryInterest: 'Strategic Alliance Partner',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0046B8] dark:bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-transparent dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Contact MsmeBooks Partnership Team</h3>
            <p className="text-xs text-blue-100 dark:text-slate-400">Direct liaison for enterprise distributors & advisory firms</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-blue-800 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8 space-y-5 text-slate-800 dark:text-slate-200">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Message Received</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
                Thank you, {formData.name}. Our Partnership Director will contact you within 24 business hours at {formData.email}.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-[#0046B8] dark:bg-blue-600 hover:bg-[#003893] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adeola Adeleke"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Company / Firm Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zenith Business Advisors"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    placeholder="adeola@zenithadvisors.ng"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 802 000 0000"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Partnership Track Interest</label>
                <select
                  value={formData.categoryInterest}
                  onChange={e => setFormData({ ...formData, categoryInterest: e.target.value })}
                  className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="Accounting & Financial Advisory">Accounting & Financial Advisory Firm</option>
                  <option value="POS Hardware Distribution">POS Hardware & Software Distribution</option>
                  <option value="National SaaS Reseller">National or Regional SaaS Reseller</option>
                  <option value="Strategic Alliance & Banking Integration">Strategic Alliance & Banking Integration</option>
                  <option value="Education & Training Academy">Education Hub & Training Academy</option>
                  <option value="Affiliate & Digital Growth">Affiliate Marketer / Digital Growth</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">How can we collaborate?</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tell us about your client base, countries of operation, or special commercial requirements..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full text-xs sm:text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  Direct dispatch to: partnerships@msmebooks.org
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#0046B8] hover:bg-[#003893] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </button>
              </div>
            </form>
          )}

          {/* Regional Hubs Info */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-300">West Africa Hub</p>
              <p>Victoria Island, Lagos, Nigeria</p>
            </div>
            <div>
              <p className="font-bold text-slate-700 dark:text-slate-300">East Africa Hub</p>
              <p>Westlands, Nairobi, Kenya</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
