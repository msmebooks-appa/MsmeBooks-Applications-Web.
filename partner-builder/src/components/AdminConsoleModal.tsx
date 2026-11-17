import React, { useState } from 'react';
import { ShieldCheck, UserCheck, XCircle, Check, Settings, Eye, EyeOff } from 'lucide-react';
import { PartnerTierId } from '../types';
import { PARTNER_TIERS } from '../data/partnersData';

interface AdminConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminConsoleModal: React.FC<AdminConsoleModalProps> = ({ isOpen, onClose }) => {
  const [partnerTier, setPartnerTier] = useState<PartnerTierId>('gold');
  const [isVerified, setIsVerified] = useState(true);
  const [inDirectory, setInDirectory] = useState(true);

  // Sample pending applications to review
  const [applications, setApplications] = useState([
    {
      id: 'APP-9182',
      name: 'Nairobi Cloud Bookkeepers Ltd',
      country: 'Kenya',
      track: 'Professional Bookkeepers',
      clients: '32 clients',
      status: 'Pending Review',
      date: '2026-10-30'
    },
    {
      id: 'APP-9104',
      name: 'Sahara Retail POS Integrators',
      country: 'Nigeria',
      track: 'POS Agents & Service Providers',
      clients: '65 clients',
      status: 'Pending Review',
      date: '2026-10-29'
    }
  ]);

  if (!isOpen) return null;

  const handleApprove = (appId: string) => {
    setApplications(
      applications.map((a) => (a.id === appId ? { ...a, status: 'Approved & Accredited' } : a))
    );
  };

  const handleReject = (appId: string) => {
    setApplications(
      applications.map((a) => (a.id === appId ? { ...a, status: 'Declined' } : a))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#072457] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-blue-800 relative max-h-[90vh] overflow-y-auto transition-colors duration-300 ease-in-out">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg cursor-pointer"
          aria-label="Close Admin Console"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-[#061F4A] text-white flex items-center justify-center font-bold border border-transparent dark:border-blue-700">
            <Settings className="w-5 h-5 text-[#8CE600]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Partner Operations & Governance Console
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-300">
              Administrative management for partner approvals, tier upgrades, badges, and directory compliance.
            </p>
          </div>
        </div>

        {/* Section 1: Live Demo Partner Tier & Badge Status Controls */}
        <div className="bg-slate-50 dark:bg-[#061F4A] p-5 rounded-2xl border border-slate-200 dark:border-blue-800 mb-6 transition-colors">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-sky-300 mb-3">
            Active Practice Configuration: Adeyemi Financial (MSME-PT-8421)
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1.5">Approved Membership Tier</label>
              <select
                value={partnerTier}
                onChange={(e) => setPartnerTier(e.target.value as PartnerTierId)}
                className="w-full px-3 py-2 bg-white dark:bg-[#0A2552] border border-slate-300 dark:border-blue-800 rounded-xl font-bold text-[#0A3981] dark:text-[#8CE600] focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
              >
                <option value="bronze">Bronze (15% Commission)</option>
                <option value="silver">Silver (20% Commission)</option>
                <option value="gold">Gold (30% Commission)</option>
                <option value="platinum">Platinum (40% Commission)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-600 dark:text-slate-300 font-medium">Compliance & Verification Status</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsVerified(!isVerified)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isVerified
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#8CE600] border border-emerald-300 dark:border-emerald-800'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  {isVerified ? 'Badge Verified Active' : 'Badge Suspended'}
                </button>

                <button
                  type="button"
                  onClick={() => setInDirectory(!inDirectory)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    inDirectory
                      ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-sky-300 border border-blue-300 dark:border-blue-800'
                      : 'bg-slate-200 dark:bg-[#0A2552] text-slate-700 dark:text-slate-400 border border-transparent dark:border-blue-900'
                  }`}
                >
                  {inDirectory ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {inDirectory ? 'Listed in Public Directory' : 'Hidden from Directory'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Review Inbound Partner Applications */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-sky-300 mb-3">
            Inbound Partner Onboarding Dossiers
          </h4>

          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-4 bg-white dark:bg-[#0A2552] border border-slate-200 dark:border-blue-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#0A3981] dark:text-[#8CE600]">{app.id}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{app.name}</span>
                    <span className="text-slate-400 dark:text-slate-400">({app.country})</span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-1">
                    Track: <strong className="text-slate-700 dark:text-slate-200">{app.track}</strong> · Portfolio: {app.clients} · Submitted {app.date}
                  </div>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        app.status.includes('Approved')
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#8CE600] border border-transparent dark:border-emerald-800'
                          : app.status.includes('Declined')
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-transparent dark:border-rose-800'
                          : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-transparent dark:border-amber-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                {app.status === 'Pending Review' && (
                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-bold text-white dark:text-[#061F4A] bg-emerald-600 dark:bg-[#8CE600] hover:bg-emerald-700 dark:hover:bg-[#9be81c] rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(app.id)}
                      className="flex-1 sm:flex-initial px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-lg flex items-center gap-1 border border-transparent dark:border-rose-900 cursor-pointer transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-right">
          <button
            onClick={onClose}
            className="py-2.5 px-6 text-xs sm:text-sm font-bold text-white dark:text-[#061F4A] bg-slate-900 dark:bg-[#8CE600] hover:bg-slate-800 dark:hover:bg-[#9be81c] rounded-xl cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
