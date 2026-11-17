import React, { useState, useEffect } from 'react';
import { 
  X, 
  Briefcase, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Award,
  MessageCircle,
  FileText,
  Bell,
  Check,
  Send,
  Sparkles,
  Zap,
  RotateCw
} from 'lucide-react';
import { PROFESSIONAL_FIRMS } from '../data/firmsData';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';
import { useCurrency } from '../context/CurrencyContext';
import { BookingRecord } from '../types/booking';
import { 
  triggerBookingAcceptedNotification, 
  triggerBookingStatusUpdatedNotification,
  requestNotificationPermission,
  getNotificationPermission
} from '../utils/reminderService';

interface ProviderPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RequestItem {
  id: string;
  reference?: string;
  client: string;
  service: string;
  package: string;
  date: string;
  mode: string;
  status: string;
  isRealBooking?: boolean;
}

export const ProviderPortalModal: React.FC<ProviderPortalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { formatAmount, formatPriceString } = useCurrency();
  const [activeTab, setActiveTab] = useState<'requests' | 'tier' | 'analytics'>('requests');
  const [pushToast, setPushToast] = useState<string | null>(null);

  const [demoRequests, setDemoRequests] = useState<RequestItem[]>([
    {
      id: 'req-1',
      reference: 'MSME-BK-9182',
      client: 'Kolawole Trading & Co.',
      service: 'Monthly Bookkeeping Outsourcing',
      package: 'Business Essentials (₦95,000/mo)',
      date: 'Thursday, Nov 12 • 10:00 AM',
      mode: 'Online Video',
      status: 'Action Needed',
    },
    {
      id: 'req-2',
      reference: 'MSME-BK-4029',
      client: 'Nairobi Horizon Suites',
      service: 'Hotel PMS & Front-Desk Setup',
      package: 'Boutique Hotel Setup (₦220,000)',
      date: 'Monday, Nov 16 • 02:00 PM',
      mode: 'On-site Business Visit',
      status: 'Action Needed',
    },
  ]);

  // Sync real client bookings into Provider requests list
  useEffect(() => {
    try {
      const stored = localStorage.getItem('msmebooks_client_bookings');
      if (stored) {
        const parsed: BookingRecord[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mapped: RequestItem[] = parsed.map(b => ({
            id: b.id,
            reference: b.reference,
            client: b.businessName || b.customerName || 'Client Business',
            service: b.serviceTitle,
            package: `${b.packageName} (${b.packagePrice})`,
            date: `${b.appointmentDate} • ${b.timeSlot}`,
            mode: b.consultationMode,
            status: b.status === 'Confirmed' ? 'Confirmed & Accepted' : b.status,
            isRealBooking: true,
          }));
          
          setDemoRequests(prev => {
            const combined = [...mapped];
            for (const d of prev) {
              if (!combined.some(c => c.id === d.id)) {
                combined.push(d);
              }
            }
            return combined;
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [isOpen]);

  // Handle Firm Accepting Booking Request
  const handleAcceptRequest = async (item: RequestItem) => {
    // 1. Update local state
    setDemoRequests(prev => prev.map(r => r.id === item.id ? { ...r, status: 'Confirmed & Accepted' } : r));

    // 2. If it's in localStorage, update real booking record
    try {
      const stored = localStorage.getItem('msmebooks_client_bookings');
      if (stored) {
        const parsed: BookingRecord[] = JSON.parse(stored);
        const updated = parsed.map(b => {
          if (b.id === item.id || b.reference === item.reference) {
            return {
              ...b,
              status: 'Confirmed' as const,
              milestoneProgressPercent: b.milestoneProgressPercent || 25,
            };
          }
          return b;
        });
        localStorage.setItem('msmebooks_client_bookings', JSON.stringify(updated));
        window.dispatchEvent(new Event('msmebooks_bookings_changed'));
      }
    } catch (e) {
      console.error(e);
    }

    // 3. Trigger Browser Push Notification via PWA Service Worker
    await triggerBookingAcceptedNotification({
      bookingId: item.id,
      reference: item.reference || 'MSME-BK-9182',
      serviceTitle: item.service,
      providerName: 'Cedar Professional Services Ltd',
      appointmentDate: item.date,
      clientName: item.client,
    });

    setPushToast(`🔔 Browser Push Alert Dispatched: Booking accepted for ${item.client}!`);
    setTimeout(() => setPushToast(null), 5000);
  };

  // Handle Firm Updating Booking Status or Advancing Milestone
  const handleUpdateStatus = async (item: RequestItem, newStatus: string, note?: string) => {
    setDemoRequests(prev => prev.map(r => r.id === item.id ? { ...r, status: newStatus } : r));

    try {
      const stored = localStorage.getItem('msmebooks_client_bookings');
      if (stored) {
        const parsed: BookingRecord[] = JSON.parse(stored);
        const updated = parsed.map(b => {
          if (b.id === item.id || b.reference === item.reference) {
            return {
              ...b,
              status: (newStatus.includes('Completed') ? 'Completed' : 'Confirmed') as any,
              milestoneProgressPercent: newStatus.includes('Completed') ? 100 : Math.min(100, (b.milestoneProgressPercent || 25) + 25),
            };
          }
          return b;
        });
        localStorage.setItem('msmebooks_client_bookings', JSON.stringify(updated));
        window.dispatchEvent(new Event('msmebooks_bookings_changed'));
      }
    } catch (e) {
      console.error(e);
    }

    // Trigger Browser Push Notification via PWA Service Worker
    await triggerBookingStatusUpdatedNotification({
      bookingId: item.id,
      reference: item.reference || 'MSME-BK-9182',
      serviceTitle: item.service,
      providerName: 'Cedar Professional Services Ltd',
      status: newStatus,
      note: note || `Partner updated engagement status to "${newStatus}". Work is actively underway.`,
      progressPercent: newStatus.includes('Completed') ? 100 : 60,
    });

    setPushToast(`🔔 Browser Push Alert Dispatched: Status updated to "${newStatus}"!`);
    setTimeout(() => setPushToast(null), 5000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 max-h-[92vh] flex flex-col text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="sticky top-0 z-20 bg-[#102B4E] dark:bg-[#060F1A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1464C8] text-white flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5 text-[#B7E532]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#B7E532]">
                  MsmeBooks Partner Ecosystem
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-300">
                  Cedar Professional Services Ltd (Verified)
                </span>
              </div>
              <h2 className="text-xl font-black text-white mt-0.5">
                Professional Provider Management Portal
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

        {/* Tab Sub-Header */}
        <div className="bg-slate-50 dark:bg-[#08121E] px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'requests' ? 'bg-[#1464C8] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Client Booking Requests ({demoRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('tier')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'tier' ? 'bg-[#1464C8] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Partner Tier & Commissions (Platinum 40%)
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
              activeTab === 'analytics' ? 'bg-[#1464C8] text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            Earnings & Performance
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-white dark:bg-[#0A1727]">
          
          {/* Real-time Push Alert Dispatched Banner */}
          {pushToast && (
            <div className="bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-[#B7E532] px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4 text-emerald-600 dark:text-[#B7E532] animate-bounce shrink-0" />
                <span>{pushToast}</span>
              </div>
              <button 
                onClick={() => setPushToast(null)} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>
          )}

          {/* TAB 1: CLIENT REQUESTS */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              
              {/* Service Worker Push Notification Test Bar */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/50 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#1464C8] text-white flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 text-[#B7E532]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#102B4E] dark:text-white">
                        PWA Browser Push Notification Trigger
                      </span>
                      <span className="text-[10px] font-bold bg-[#B7E532] text-[#102B4E] px-2 py-0.5 rounded-full">
                        Service Worker Live
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                      Accepting or updating any client booking below automatically triggers a browser push alert to the client via <code className="text-xs font-bold text-[#1464C8] dark:text-[#B7E532]">/sw.js</code>.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (demoRequests.length > 0) {
                        handleAcceptRequest(demoRequests[0]);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#1464C8] hover:bg-[#1052a5] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Simulate firm accepting a client booking with browser push alert"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B7E532]" />
                    <span>Test Push: Firm Accept</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (demoRequests.length > 0) {
                        handleUpdateStatus(demoRequests[0], 'In Progress - Audit Fieldwork', 'Certified partner began statutory review.');
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer border border-slate-300 dark:border-slate-700"
                    title="Simulate firm status/milestone update with browser push alert"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                    <span>Test Push: Status Update</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <h3 className="font-black text-[#102B4E] dark:text-white text-sm">
                  Active SME Appointment & Engagement Requests ({demoRequests.length})
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">Live Sync with MsmeBooks Marketplace</span>
              </div>

              {demoRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1D31] shadow-xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#102B4E] dark:text-white">{req.client}</span>
                        {req.reference && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                            Ref: {req.reference}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">{req.service}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      req.status.includes('Confirmed') || req.status.includes('Accepted')
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50 dark:bg-[#08121E] p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 block font-semibold">Package:</span>
                      <span className="font-bold text-[#102B4E] dark:text-white">{formatPriceString(req.package)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Schedule:</span>
                      <span className="font-bold text-[#102B4E] dark:text-white">{req.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Mode:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{req.mode}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                    <a
                      href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello MsmeBooks, inquiring about Client Request ${req.client} for ${req.service} (${req.reference || req.id})`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#1464C8] dark:text-[#B7E532] font-bold hover:underline flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Contact Client / Concierge</span>
                    </a>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Accept Booking Button */}
                      {(req.status === 'Action Needed' || req.status.includes('Pending')) ? (
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          className="px-4 py-1.5 bg-[#1464C8] hover:bg-[#1052a5] text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
                          title="Accept booking request and dispatch browser push notification to client"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#B7E532]" />
                          <span>Accept & Notify Client</span>
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateStatus(req, 'In Progress - Phase 2', 'Consultant assigned and discovery session initiated.')}
                            className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-[#1464C8] dark:text-blue-300 font-bold rounded-lg cursor-pointer border border-blue-200 dark:border-blue-800"
                            title="Update engagement status to In Progress"
                          >
                            <span>+ Phase 2 Update</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req, 'Draft Deliverables Ready', 'Tax audit draft schedule ready for review.')}
                            className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-amber-800 dark:text-amber-300 font-bold rounded-lg cursor-pointer border border-amber-200 dark:border-amber-800"
                            title="Update engagement status to Deliverables Ready"
                          >
                            <span>+ Deliverables Ready</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req, 'Completed', 'Consulting engagement finalized.')}
                            className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 font-bold rounded-lg cursor-pointer border border-emerald-200 dark:border-emerald-800"
                            title="Mark engagement completed"
                          >
                            <span>✓ Mark Complete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: PARTNER TIERS & COMMISSIONS */}
          {activeTab === 'tier' && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-2xl border border-blue-200 dark:border-blue-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#1464C8] dark:text-[#B7E532]" />
                    <span className="font-black text-sm text-[#102B4E] dark:text-white">Current Level: Platinum Partner Tier</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#B7E532] text-[#102B4E] font-extrabold text-xs rounded-full">
                    40% Recurring Commission
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                  Eligible partner firms earn recurring monthly revenue when clients onboard onto MsmeBooks cloud accounting, inventory, and POS software subscriptions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-white dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-400">Bronze Partner</span>
                  <div className="text-xl font-black text-[#102B4E] dark:text-white mt-1">15%</div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Recurring commission on SaaS referrals</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Silver Partner</span>
                  <div className="text-xl font-black text-[#102B4E] dark:text-white mt-1">20%</div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Recurring commission + directory listing</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#0D1D31] rounded-xl border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Gold / Partner</span>
                  <div className="text-xl font-black text-[#102B4E] dark:text-white mt-1">30%</div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Priority marketplace lead routing</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#0D1D31] rounded-xl border-2 border-[#1464C8] dark:border-[#B7E532] shadow-xs">
                  <span className="text-xs font-black text-[#1464C8] dark:text-[#B7E532]">Platinum Partner</span>
                  <div className="text-xl font-black text-[#102B4E] dark:text-white mt-1">40%</div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Highest tier + dedicated account manager</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PERFORMANCE */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400">Total Bookings Completed</span>
                <div className="text-2xl font-black text-[#102B4E] dark:text-white mt-1">168 Engagements</div>
                <span className="text-xs text-emerald-600 dark:text-[#B7E532] font-bold mt-1 block">99.2% on-time delivery</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400">Total Client Revenue</span>
                <div className="text-2xl font-black text-[#102B4E] dark:text-white mt-1">{formatAmount(14850000)}</div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1 block">Held & disbursed securely</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-400">Verified Client Rating</span>
                <div className="text-2xl font-black text-[#102B4E] dark:text-white mt-1">4.95 / 5.0</div>
                <span className="text-xs text-amber-500 font-bold mt-1 block">168 Verified Reviews</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-[#060F1A] px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            For partner onboarding assistance, contact partner@msmebooks.org
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#102B4E] dark:bg-[#1464C8] hover:bg-slate-800 dark:hover:bg-[#1052a5] text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
