import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Database, 
  Users, 
  Globe2, 
  CheckCircle2, 
  TrendingUp, 
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/servicesData';
import { PROFESSIONAL_FIRMS } from '../data/firmsData';
import { useCurrency } from '../context/CurrencyContext';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { formatAmount } = useCurrency();

  const [pendingFirms, setPendingFirms] = useState([
    {
      id: 'app-1',
      name: 'Vanguard Chartered Tax Advisors',
      location: 'Ikeja, Lagos, Nigeria',
      license: 'CITN / ICAN Lic. #9481',
      contact: 'adetola@vanguardtax.ng',
      status: 'Pending Verification',
    },
    {
      id: 'app-2',
      name: 'Nairobi ERP Solutions Ltd',
      location: 'Kilimani, Nairobi, Kenya',
      license: 'ICPAK & Cloud Systems Cert.',
      contact: 'info@nairobierp.co.ke',
      status: 'Pending Verification',
    },
  ]);

  const handleApprove = (id: string) => {
    setPendingFirms(prev => prev.filter(f => f.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#102B4E] dark:bg-[#060F1A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1464C8] text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-[#B7E532]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B7E532]">
                  Platform Administration
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-300">
                  Global Oversight
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                MsmeBooks Services Marketplace Admin Desk
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-white dark:bg-[#08121E]">
          
          {/* Key Platform Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Gross Volume</span>
              <div className="text-xl sm:text-2xl font-black text-[#102B4E] dark:text-white mt-0.5">{formatAmount(48500000, { compact: true })}</div>
              <span className="text-[10px] text-emerald-600 dark:text-[#B7E532] font-semibold">Processed GMV</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Service Categories</span>
              <div className="text-2xl font-black text-[#102B4E] dark:text-white mt-0.5">9 Active</div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">110+ specialized offerings</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Verified Firms</span>
              <div className="text-2xl font-black text-[#1464C8] dark:text-[#B7E532] mt-0.5">{PROFESSIONAL_FIRMS.length} Partners</div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">100% credential verified</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Active Bookings</span>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5">342 Pipeline</div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Dual Online & WhatsApp</span>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Regional Hubs</span>
              <div className="text-2xl font-black text-purple-700 dark:text-purple-400 mt-0.5">5 Countries</div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">NG, GH, KE, ZA, RW</span>
            </div>
          </div>

          {/* Pending Provider Applications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-sm text-[#102B4E] dark:text-white">
                Pending Professional Firm Applications ({pendingFirms.length})
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">Vetting & Practice License Validation</span>
            </div>

            {pendingFirms.length === 0 ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                All partner applications have been reviewed and processed!
              </div>
            ) : (
              <div className="space-y-3">
                {pendingFirms.map((app) => (
                  <div key={app.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1D31] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#102B4E] dark:text-white">{app.name}</span>
                        <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[10px] font-bold rounded-full border border-amber-200 dark:border-amber-800">
                          {app.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {app.location} • {app.contact}
                      </div>
                      <div className="text-xs text-[#1464C8] dark:text-[#B7E532] font-bold mt-1">
                        License: {app.license}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="px-4 py-1.5 bg-[#1464C8] hover:bg-[#1052a5] text-white text-xs font-bold rounded-lg cursor-pointer"
                      >
                        Approve & Verify
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Marketplace Volume by Region */}
          <div>
            <h3 className="font-black text-sm text-[#102B4E] dark:text-white mb-3">
              Marketplace Volume by Country
            </h3>
            <div className="space-y-2">
              {[
                { name: 'Nigeria 🇳🇬', pct: 64, count: '218 bookings' },
                { name: 'Ghana 🇬🇭', pct: 18, count: '62 bookings' },
                { name: 'Kenya 🇰🇪', pct: 12, count: '41 bookings' },
                { name: 'South Africa 🇿🇦', pct: 4, count: '14 bookings' },
                { name: 'Rwanda 🇷🇼', pct: 2, count: '7 bookings' },
              ].map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{c.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">{c.count} ({c.pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#1464C8] dark:bg-[#B7E532] h-full rounded-full"
                      style={{ width: `${c.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-[#060F1A] px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Internal Operations Console • www.msmebooks.org
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
