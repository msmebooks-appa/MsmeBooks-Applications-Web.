import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, Clock, Building, Users, Mail, Phone, User } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    phone: '',
    companyName: '',
    teamSize: '1-10',
    primaryInterest: 'Accounting & Financials',
    preferredTime: 'Morning (9:00 AM - 12:00 PM)',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#0B4EA2] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-lime-400">Personalized Walkthrough</span>
            </div>
            <h3 className="text-xl font-bold mt-1">Book a Live MsmeBooks Demo</h3>
          </div>
          <button
            onClick={resetAndClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-lime-100 dark:bg-lime-950/60 border border-lime-200 dark:border-lime-800 rounded-full flex items-center justify-center mx-auto mb-4 text-[#65A30D] dark:text-lime-400">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Demo Request Received</h4>
              <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto text-sm leading-relaxed mb-6">
                Thank you, <strong className="text-slate-900 dark:text-white">{formData.fullName || 'there'}</strong>. Our product specialist will contact you at <strong className="text-slate-900 dark:text-white">{formData.workEmail}</strong> to confirm your walkthrough session.
              </p>
              <div className="p-4 bg-slate-50 dark:bg-zinc-900 rounded-xl text-left border border-slate-200 dark:border-zinc-800 mb-6 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <p><strong>Scheduled Topic:</strong> {formData.primaryInterest}</p>
                <p><strong>Company:</strong> {formData.companyName || 'Not specified'}</p>
                <p><strong>Preferred Window:</strong> {formData.preferredTime}</p>
              </div>
              <button
                onClick={resetAndClose}
                className="w-full py-3 bg-[#0B4EA2] text-white rounded-xl font-semibold hover:bg-[#083770] transition-colors cursor-pointer"
              >
                Back to About Us
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                See how MsmeBooks unites Accounting, POS, Inventory, and multi-branch management in one intuitive platform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-sky-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amara Okafor"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-sky-400" /> Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="amara@business.com"
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-sky-400" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 800 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-sky-400" /> Company Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sterling Mart Ltd"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-sky-400" /> Team Size
                  </label>
                  <select
                    value={formData.teamSize}
                    onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                  >
                    <option value="1-5">1 - 5 team members</option>
                    <option value="6-20">6 - 20 team members</option>
                    <option value="21-50">21 - 50 team members</option>
                    <option value="50+">50+ multi-branch enterprise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-sky-400" /> Primary Focus
                  </label>
                  <select
                    value={formData.primaryInterest}
                    onChange={(e) => setFormData({ ...formData, primaryInterest: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                  >
                    <option value="Accounting & Financials">Accounting & Financials</option>
                    <option value="Point of Sale (POS)">Point of Sale (POS)</option>
                    <option value="Inventory & Stock Tracking">Inventory & Stock Tracking</option>
                    <option value="Multi-Branch Management">Multi-Branch Management</option>
                    <option value="Hospitality / Hotel Management">Hospitality & Property Module</option>
                    <option value="Complete All-in-One Suite">Complete All-in-One Suite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-sky-400" /> Preferred Time Window
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 dark:focus:border-lime-400 text-sm bg-white dark:bg-zinc-900 text-slate-900 dark:text-white"
                >
                  <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM GMT+1)</option>
                  <option value="Afternoon (1:00 PM - 4:00 PM)">Afternoon (1:00 PM - 4:00 PM GMT+1)</option>
                  <option value="Evening (4:00 PM - 6:00 PM)">Evening (4:00 PM - 6:00 PM GMT+1)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#0B4EA2] hover:bg-[#083770] text-white font-semibold rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Confirm Demo Schedule
                </button>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-2">
                  No credit card required. Free 30-minute tailored platform tour.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
