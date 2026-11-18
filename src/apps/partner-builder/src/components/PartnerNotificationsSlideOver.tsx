import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  DollarSign, 
  UserPlus, 
  TrendingUp, 
  Award, 
  Sparkles, 
  CheckCheck, 
  Clock, 
  ArrowRight, 
  ShieldCheck,
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PartnerNotification, NotificationType } from '../types';

interface PartnerNotificationsSlideOverProps {
  variant?: 'navbar' | 'portal';
  onNavigateToTab?: (tabName: string) => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

const INITIAL_NOTIFICATIONS: PartnerNotification[] = [
  {
    id: 'notif-1',
    type: 'payout',
    title: 'Commission Payout Received',
    message: '$1,440.00 direct bank wire settlement has arrived in your First Bank Nigeria account (*8821).',
    timestamp: '12 mins ago',
    read: false,
    amount: '$1,440.00',
    actionLabel: 'View Remittance Advice'
  },
  {
    id: 'notif-2',
    type: 'lead',
    title: 'New Lead Assigned',
    message: 'Enterprise Lead assigned: Accra Modern Supermarket Ltd (4 POS terminals, 2 branches) routed to your territory.',
    timestamp: '1 hour ago',
    read: false,
    actionLabel: 'View Lead Details'
  },
  {
    id: 'notif-3',
    type: 'conversion',
    title: 'Trial Converted to Paid Subscription',
    message: 'Nairobi Organic Foods upgraded to Annual Cloud POS. Your 30% Gold recurring share ($28.50/mo) is locked in.',
    timestamp: '4 hours ago',
    read: false,
    amount: '+$28.50/mo',
    actionLabel: 'View Subscription'
  },
  {
    id: 'notif-4',
    type: 'credential',
    title: '2026 Gold Partner Credential Ready',
    message: 'Your official membership diploma and verifiable SVG badge #MSME-PT-8421 have been renewed with Q4 audit seals.',
    timestamp: 'Yesterday',
    read: true,
    actionLabel: 'Download Badge'
  },
  {
    id: 'notif-5',
    type: 'milestone',
    title: 'Almost Platinum Tier!',
    message: 'You have 48 active client businesses. Reaching 50 will automatically upgrade your firm to 40% recurring commission.',
    timestamp: '2 days ago',
    read: true,
    actionLabel: 'Check Tier Progress'
  },
  {
    id: 'notif-6',
    type: 'payout',
    title: 'Recurring Commission Accrual',
    message: '3 client subscriptions renewed this week. Total current month commission run-rate reached $1,440.00.',
    timestamp: '3 days ago',
    read: true,
    amount: '$1,440.00'
  }
];

export const PartnerNotificationsSlideOver: React.FC<PartnerNotificationsSlideOverProps> = ({
  variant = 'navbar',
  onNavigateToTab,
  isOpenExternal,
  onCloseExternal
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : internalOpen;
  const setIsOpen = (val: boolean) => {
    if (onCloseExternal && !val) {
      onCloseExternal();
    }
    setInternalOpen(val);
  };

  const [notifications, setNotifications] = useState<PartnerNotification[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('msmebooks_notifs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [filterType, setFilterType] = useState<'all' | 'unread' | 'payout' | 'lead'>('all');

  // Save changes
  useEffect(() => {
    localStorage.setItem('msmebooks_notifs', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterType === 'unread') return !n.read;
    if (filterType === 'payout') return n.type === 'payout';
    if (filterType === 'lead') return n.type === 'lead';
    return true;
  });

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case 'payout':
        return <DollarSign className="w-4 h-4 text-emerald-600 dark:text-[#8CE600]" />;
      case 'lead':
        return <UserPlus className="w-4 h-4 text-[#0A3981] dark:text-sky-300" />;
      case 'conversion':
        return <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-[#8CE600]" />;
      case 'credential':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'milestone':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBadgeStyle = (type: NotificationType) => {
    switch (type) {
      case 'payout':
        return 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-[#8CE600] border-emerald-200 dark:border-emerald-800';
      case 'lead':
        return 'bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-sky-300 border-blue-200 dark:border-blue-800';
      case 'conversion':
        return 'bg-teal-50 dark:bg-teal-950/80 text-teal-700 dark:text-[#8CE600] border-teal-200 dark:border-teal-800';
      case 'credential':
        return 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'milestone':
        return 'bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
  };

  return (
    <>
      {/* Trigger Bell Button in Navigation */}
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className={`relative inline-flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer ${
          variant === 'portal'
            ? 'p-2 text-slate-600 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600] bg-slate-100 dark:bg-[#061F4A] hover:bg-slate-200 dark:hover:bg-[#092b61] border border-slate-200 dark:border-blue-800'
            : 'p-2 text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600] hover:bg-slate-100 dark:hover:bg-blue-900/50 border border-slate-200 dark:border-blue-800/60 shadow-xs'
        }`}
        title="Partner Live Notifications & Alerts"
        aria-label="View notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 dark:bg-[#8CE600] text-white dark:text-[#061F4A] text-[9.5px] font-black tracking-tight ring-2 ring-white dark:ring-[#061F4A] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Slide-over Drawer & Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-xs transition-opacity cursor-pointer"
            />

            {/* Slide-over Panel from Right */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="w-screen max-w-md bg-white dark:bg-[#061F4A] border-l border-slate-200 dark:border-blue-800/80 shadow-2xl flex flex-col pointer-events-auto transition-colors"
              >
                {/* Header */}
                <div className="p-5 border-b border-slate-200 dark:border-blue-800/80 bg-slate-50/70 dark:bg-[#072457] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] flex items-center justify-center font-bold text-sm">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Partner Live Updates
                        {unreadCount > 0 && (
                          <span className="text-[10px] font-extrabold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-1.5 py-0.2 rounded-full border border-rose-300 dark:border-rose-800">
                            {unreadCount} New
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Real-time alerts for referrals, payouts & leads
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-semibold text-[#0A3981] dark:text-[#8CE600] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Mark all as read"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Mark read</span>
                      </button>
                    )}
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-blue-900/50 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="px-5 py-2.5 bg-white dark:bg-[#061F4A] border-b border-slate-100 dark:border-blue-900/60 flex items-center gap-1.5 overflow-x-auto text-xs">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      filterType === 'all'
                        ? 'bg-[#0A3981] text-white dark:bg-[#8CE600] dark:text-[#061F4A]'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900/40'
                    }`}
                  >
                    All ({notifications.length})
                  </button>
                  <button
                    onClick={() => setFilterType('unread')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      filterType === 'unread'
                        ? 'bg-[#0A3981] text-white dark:bg-[#8CE600] dark:text-[#061F4A]'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900/40'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilterType('payout')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      filterType === 'payout'
                        ? 'bg-[#0A3981] text-white dark:bg-[#8CE600] dark:text-[#061F4A]'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900/40'
                    }`}
                  >
                    Payouts
                  </button>
                  <button
                    onClick={() => setFilterType('lead')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      filterType === 'lead'
                        ? 'bg-[#0A3981] text-white dark:bg-[#8CE600] dark:text-[#061F4A]'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-blue-900/40'
                    }`}
                  >
                    Leads
                  </button>
                </div>

                {/* Notifications List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-16 text-center text-slate-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="text-xs font-semibold">No notifications in this filter</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`p-4 rounded-2xl border transition-all duration-200 relative group ${
                          notif.read
                            ? 'bg-slate-50/70 dark:bg-[#072457]/50 border-slate-200/80 dark:border-blue-900/60'
                            : 'bg-white dark:bg-[#092b61] border-blue-200 dark:border-[#8CE600]/40 shadow-sm ring-1 ring-[#0A3981]/10 dark:ring-[#8CE600]/20'
                        }`}
                      >
                        {/* Unread Indicator Dot */}
                        {!notif.read && (
                          <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#0A3981] dark:bg-[#8CE600]" />
                        )}

                        <div className="flex items-start gap-3">
                          {/* Type Icon */}
                          <div
                            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${getBadgeStyle(
                              notif.type
                            )}`}
                          >
                            {getIconForType(notif.type)}
                          </div>

                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {notif.title}
                              </h4>
                              {notif.amount && (
                                <span className="text-[11px] font-mono font-black text-emerald-600 dark:text-[#8CE600]">
                                  {notif.amount}
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-2.5">
                              {notif.message}
                            </p>

                            <div className="flex items-center justify-between text-[11px]">
                              <span className="flex items-center gap-1 text-slate-400 font-medium">
                                <Clock className="w-3 h-3" />
                                {notif.timestamp}
                              </span>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleToggleRead(notif.id)}
                                  className="text-[10.5px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                                >
                                  {notif.read ? 'Mark unread' : 'Mark read'}
                                </button>
                                {notif.actionLabel && (
                                  <button
                                    onClick={() => {
                                      handleToggleRead(notif.id);
                                      if (onNavigateToTab) {
                                        if (notif.type === 'payout') onNavigateToTab('payouts');
                                        if (notif.type === 'lead') onNavigateToTab('referrals');
                                        if (notif.type === 'conversion') onNavigateToTab('commissions');
                                      }
                                    }}
                                    className="inline-flex items-center gap-0.5 font-bold text-[#0A3981] dark:text-[#8CE600] hover:underline cursor-pointer"
                                  >
                                    <span>{notif.actionLabel}</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Status Bar */}
                <div className="p-4 bg-slate-50 dark:bg-[#072457] border-t border-slate-200 dark:border-blue-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#8CE600]" />
                    <span>Real-time webhook events active</span>
                  </div>
                  <span className="font-mono text-[11px]">ID: MSME-PT-8421</span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
