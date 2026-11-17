import React, { useState } from 'react';
import {
  X,
  Bell,
  BellRing,
  BellOff,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  MapPin,
  Check,
  AlertTriangle,
  Receipt,
  Package,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  ExternalLink,
  Sliders,
  CheckCircle2,
  Clock,
  Trash2,
  Lock,
} from 'lucide-react';
import { useNotification, AlertType } from '../context/NotificationContext';
import { useCurrency } from '../context/CurrencyContext';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'profile' | 'notifications' | 'business';
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'notifications',
}) => {
  const {
    permission,
    isSupported,
    preferences,
    alerts,
    unreadCount,
    requestPermission,
    updatePreferences,
    sendLowStockAlert,
    sendInvoicePaymentAlert,
    sendAlert,
    markAsRead,
    markAllAsRead,
    clearAlerts,
  } = useNotification();

  const { formatAmount } = useCurrency();

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'business'>(initialTab);
  const [testTriggering, setTestTriggering] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  // User Profile Form
  const [userProfile, setUserProfile] = useState({
    name: 'Amina Al-Mansoor',
    email: 'amina@savannahretail.co',
    phone: '+234 803 456 7890',
    role: 'Managing Director & Principal Owner',
    company: 'Savannah Retail & Distribution Ltd',
    hub: 'Lagos & Nairobi Hubs',
    taxId: 'TIN-9842104-NG',
  });

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    await requestPermission();
  };

  const handleTestLowStock = async () => {
    setTestTriggering('low-stock');
    await sendLowStockAlert('Basmati Premium Rice 25kg', 2, 15, 'Ikeja Depot');
    setTimeout(() => setTestTriggering(null), 700);
  };

  const handleTestInvoicePayment = async () => {
    setTestTriggering('invoice');
    await sendInvoicePaymentAlert(
      '#INV-2026-0842',
      'Savannah Retail Ltd',
      formatAmount(1850000),
      'M-Pesa / Bank Transfer'
    );
    setTimeout(() => setTestTriggering(null), 700);
  };

  const handleTestTaxAlert = async () => {
    setTestTriggering('tax');
    await sendAlert({
      type: 'tax-deadline',
      title: '📅 Statutory Tax Filing Reminder',
      body: 'Monthly VAT remittance (7.5%) is due in 3 days. Your automated schedule is computed and ready to submit.',
      priority: 'high',
      data: { deadline: '3 days', type: 'VAT Return' },
    });
    setTimeout(() => setTestTriggering(null), 700);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-[#0E172A] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Account Avatar & Badges */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0866FF] to-[#B7F000] p-0.5 shadow-md">
                <div className="w-full h-full rounded-[14px] bg-slate-900 flex items-center justify-center font-black text-white text-base font-display">
                  AA
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white font-display">
                  {userProfile.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#B7F000] text-slate-950 text-[10px] font-extrabold uppercase tracking-wide">
                  Owner
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {userProfile.company} &bull; {userProfile.hub}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'notifications'
                ? 'border-[#0866FF] text-[#0866FF] dark:text-[#B7F000] bg-white dark:bg-[#0E172A]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Alerts &amp; Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#0866FF] text-white text-[10px] font-mono font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#0866FF] text-[#0866FF] dark:text-[#B7F000] bg-white dark:bg-[#0E172A]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>User Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('business')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'business'
                ? 'border-[#0866FF] text-[#0866FF] dark:text-[#B7F000] bg-white dark:bg-[#0E172A]'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Business Security &amp; Access</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 dark:text-slate-200 text-xs">
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Browser Permission Banner */}
              <div className="p-4 rounded-2xl border transition-all bg-gradient-to-br from-blue-50/80 via-white to-blue-50/30 dark:from-blue-950/40 dark:via-[#131F37] dark:to-blue-950/20 border-blue-200/80 dark:border-blue-900/60">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        permission === 'granted'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                          : permission === 'denied'
                          ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300'
                          : 'bg-blue-100 dark:bg-blue-900/60 text-[#0866FF] dark:text-blue-300'
                      }`}
                    >
                      {permission === 'granted' ? (
                        <BellRing className="w-5 h-5" />
                      ) : permission === 'denied' ? (
                        <BellOff className="w-5 h-5" />
                      ) : (
                        <Bell className="w-5 h-5" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Browser Push Notifications
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            permission === 'granted'
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                              : permission === 'denied'
                              ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                              : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                          }`}
                        >
                          {permission === 'granted'
                            ? 'Active & Allowed'
                            : permission === 'denied'
                            ? 'Blocked by Browser'
                            : 'Permission Needed'}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {permission === 'granted'
                          ? 'System will alert you immediately on your desktop/mobile screen when urgent inventory drops below threshold or payments clear.'
                          : permission === 'denied'
                          ? 'Notifications are blocked in your browser settings. Please click the padlock in your address bar to re-enable.'
                          : 'Grant permission to receive instant popups for critical low stock events and verified invoice payments while navigating.'}
                      </p>
                    </div>
                  </div>

                  {permission !== 'granted' && (
                    <button
                      onClick={handleRequestPermission}
                      className="shrink-0 px-4 py-2.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-xs shadow-md shadow-blue-500/25 flex items-center gap-1.5 transition-all"
                    >
                      <BellRing className="w-4 h-4" />
                      <span>Enable Browser Alerts</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Preferences Toggles */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                      Alert Event Preferences
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Choose which critical business events trigger desktop push and internal notifications.
                    </p>
                  </div>
                  {/* Master Switch */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                      Master Switch
                    </span>
                    <input
                      type="checkbox"
                      checked={preferences.enabled}
                      onChange={(e) => updatePreferences({ enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-300 dark:bg-slate-700 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0866FF]"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* 1. Low Stock Alert */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131F37] flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>Low Stock Alert</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 font-bold uppercase">
                            Critical
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Alert when inventory at any branch drops below safety reorder threshold.
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.lowStock}
                      onChange={(e) => updatePreferences({ lowStock: e.target.checked })}
                      disabled={!preferences.enabled}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-1 cursor-pointer"
                    />
                  </div>

                  {/* 2. New Invoice Payment Received */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131F37] flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 shrink-0">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>New Invoice Payment Received</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold uppercase">
                            Financial
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Immediate push when clients pay invoices via M-Pesa, Paystack, Flutterwave, or transfer.
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.invoicePayment}
                      onChange={(e) => updatePreferences({ invoicePayment: e.target.checked })}
                      disabled={!preferences.enabled}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-1 cursor-pointer"
                    />
                  </div>

                  {/* 3. Large Order / High-Value POS */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131F37] flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          High-Value Sales &amp; Bulk Orders
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Notify when a single checkout or trade order exceeds standard branch threshold.
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.largeOrder}
                      onChange={(e) => updatePreferences({ largeOrder: e.target.checked })}
                      disabled={!preferences.enabled}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-1 cursor-pointer"
                    />
                  </div>

                  {/* 4. Statutory Tax Deadlines */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131F37] flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          Statutory Tax &amp; Audit Deadlines
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Reminders 7, 3, and 1 day before local VAT, WHT, and PAYE filing dates.
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={preferences.taxDeadline}
                      onChange={(e) => updatePreferences({ taxDeadline: e.target.checked })}
                      disabled={!preferences.enabled}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 mt-1 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Sound Chime Toggle */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {preferences.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-[#0866FF]" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Play audio chime when critical alert arrives
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.soundEnabled}
                    onChange={(e) => updatePreferences({ soundEnabled: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Interactive Simulation / Test Triggers */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111A2E] border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Live Alert Simulator (Test in Browser)
                  </span>
                  <span className="text-[10px] text-slate-400">Triggers real browser notification</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                  Click below to trigger sample business notifications and verify how your browser displays them:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    onClick={handleTestLowStock}
                    disabled={testTriggering !== null}
                    className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Test Low Stock Alert</span>
                  </button>

                  <button
                    onClick={handleTestInvoicePayment}
                    disabled={testTriggering !== null}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Test Invoice Paid Alert</span>
                  </button>

                  <button
                    onClick={handleTestTaxAlert}
                    disabled={testTriggering !== null}
                    className="px-3 py-2 rounded-xl bg-[#0866FF] hover:bg-blue-600 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Test Tax Reminder</span>
                  </button>
                </div>
              </div>

              {/* Notification Center Log */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                      Recent Business Activity Alerts ({alerts.length})
                    </h4>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0866FF] dark:text-blue-300 font-bold text-[10px]">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-[#0866FF] dark:text-blue-400 hover:underline font-semibold"
                      >
                        Mark all as read
                      </button>
                    )}
                    {alerts.length > 0 && (
                      <button
                        onClick={clearAlerts}
                        className="text-[11px] text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear all</span>
                      </button>
                    )}
                  </div>
                </div>

                {alerts.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <BellOff className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-60" />
                    <p className="text-slate-500 font-semibold text-xs">No recent notifications</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Urgent stock and payment alerts will show up here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        onClick={() => markAsRead(alert.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          !alert.read
                            ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 shadow-xs'
                            : 'bg-white dark:bg-[#131F37] border-slate-200 dark:border-slate-800 opacity-80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5">
                            <div
                              className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                                alert.type === 'low-stock'
                                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                                  : alert.type === 'invoice-payment'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                                  : 'bg-blue-100 dark:bg-blue-950 text-[#0866FF] dark:text-blue-300'
                              }`}
                            >
                              {alert.type === 'low-stock' ? (
                                <AlertTriangle className="w-3.5 h-3.5" />
                              ) : alert.type === 'invoice-payment' ? (
                                <Receipt className="w-3.5 h-3.5" />
                              ) : (
                                <Bell className="w-3.5 h-3.5" />
                              )}
                            </div>

                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span>{alert.title}</span>
                                {!alert.read && (
                                  <span className="w-2 h-2 rounded-full bg-[#0866FF]" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                                {alert.body}
                              </p>
                            </div>
                          </div>

                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {new Date(alert.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {profileSaved && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Profile details updated successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#151F32] text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Business Role
                  </label>
                  <input
                    type="text"
                    value={userProfile.role}
                    onChange={(e) => setUserProfile({ ...userProfile, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#151F32] text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Primary Business Email
                  </label>
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#151F32] text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Verified Phone (SMS Alerts)
                  </label>
                  <input
                    type="tel"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#151F32] text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Registered Enterprise Name
                  </label>
                  <input
                    type="text"
                    value={userProfile.company}
                    onChange={(e) => setUserProfile({ ...userProfile, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#151F32] text-slate-900 dark:text-white font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Regional Tax Identification (TIN)
                  </label>
                  <input
                    type="text"
                    value={userProfile.taxId}
                    onChange={(e) => setUserProfile({ ...userProfile, taxId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#151F32] text-slate-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0866FF] hover:bg-blue-600 text-white font-bold transition-all shadow-md shadow-blue-500/20"
                >
                  Save Profile Settings
                </button>
              </div>
            </form>
          )}

          {activeTab === 'business' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#131F37] border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      Two-Factor Authentication (2FA)
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Required for cash drawer closures, stock write-offs, and bank reconciliations.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">
                    Enabled
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      Branch Multi-Device Access
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Currently 6 POS terminals and 3 desktop ledgers authorized across Lagos &amp; Nairobi.
                    </p>
                  </div>
                  <button className="text-[11px] text-[#0866FF] dark:text-blue-400 font-bold hover:underline">
                    Manage Devices
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#0866FF] dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                    African Regulatory Compliance
                  </h5>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    Your account complies with NDPR (Nigeria Data Protection Regulation) and Kenya Data Protection Act standards. Data is end-to-end encrypted locally and in transit.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#0B1120] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0866FF]" />
            <span>MsmeBooks Pan-African Business Cloud OS</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
