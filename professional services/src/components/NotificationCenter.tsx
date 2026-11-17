import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Bell, 
  Calendar, 
  CreditCard, 
  MessageCircle, 
  Check, 
  CheckCheck, 
  Trash2, 
  X, 
  Zap, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  Filter,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { AppNotification, NotificationCategory, NotificationFilter } from '../types/notification';
import { 
  getStoredNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification, 
  clearAllNotifications, 
  formatRelativeTime,
  triggerSimulatedRealtimeUpdate
} from '../utils/notificationService';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';

interface NotificationCenterProps {
  onOpenMyBookings?: () => void;
  className?: string;
  variant?: 'header' | 'mobile';
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  onOpenMyBookings,
  className = '',
  variant = 'header',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(() => getStoredNotifications());
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [isSimulating, setIsSimulating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync notifications from localStorage and custom events
  useEffect(() => {
    const handleUpdate = () => {
      setNotifications(getStoredNotifications());
    };

    window.addEventListener('msmebooks_notifications_changed', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('msmebooks_notifications_changed', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Dismiss dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => {
      if (activeFilter === 'unread') return !item.read;
      if (activeFilter === 'booking') return item.type === 'booking';
      if (activeFilter === 'payment') return item.type === 'payment';
      if (activeFilter === 'expert') return item.type === 'expert';
      return true; // 'all'
    });
  }, [notifications, activeFilter]);

  const handleSimulate = () => {
    setIsSimulating(true);
    const newNotif = triggerSimulatedRealtimeUpdate();
    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  const handleActionClick = (notification: AppNotification) => {
    markNotificationAsRead(notification.id);

    if (notification.actionType === 'open_bookings' && onOpenMyBookings) {
      setIsOpen(false);
      onOpenMyBookings();
    } else if (notification.actionType === 'open_whatsapp') {
      const url = buildWhatsAppBookingUrl({
        providerName: notification.metadata?.providerName || 'MsmeBooks Expert Desk',
        serviceName: notification.metadata?.serviceTitle || 'Professional Consultation Follow-up',
      });
      window.open(url, '_blank');
    } else if (onOpenMyBookings) {
      setIsOpen(false);
      onOpenMyBookings();
    }
  };

  const getCategoryBadge = (type: NotificationCategory) => {
    switch (type) {
      case 'booking':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-900/50">
            <Calendar className="w-2.5 h-2.5" />
            Booking
          </span>
        );
      case 'payment':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-900/50">
            <CreditCard className="w-2.5 h-2.5" />
            Payment
          </span>
        );
      case 'expert':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/50">
            <MessageCircle className="w-2.5 h-2.5" />
            Expert Desk
          </span>
        );
    }
  };

  const getTypeIcon = (type: NotificationCategory) => {
    switch (type) {
      case 'booking':
        return (
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-[#1464C8] dark:text-blue-300 flex items-center justify-center shrink-0 shadow-2xs">
            <Calendar className="w-4 h-4" />
          </div>
        );
      case 'payment':
        return (
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
            <CreditCard className="w-4 h-4" />
          </div>
        );
      case 'expert':
        return (
          <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
            <Sparkles className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Status notifications & updates"
        aria-expanded={isOpen}
        title="Real-time status updates: Bookings, Payments, Expert responses"
        className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center ${
          isOpen
            ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] border-[#1464C8]/40 dark:border-blue-800 shadow-xs'
            : 'text-slate-700 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border-slate-200 dark:border-slate-700'
        }`}
      >
        <Bell className="w-4 h-4 transition-transform group-hover:rotate-12" />

        {/* Live Notification Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs ring-2 ring-white dark:ring-[#0A1727] animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Notification Center */}
      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 bg-white dark:bg-[#0A1727] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${
            variant === 'mobile'
              ? 'right-0 w-[calc(100vw-32px)] max-w-[380px]'
              : 'right-0 w-[380px] sm:w-[420px]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-[#071321] border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
              <h3 className="font-black text-sm text-[#102B4E] dark:text-white flex items-center gap-1.5">
                <span>Updates & Activity</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#1464C8] text-white rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h3>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Simulate real-time update button */}
              <button
                type="button"
                onClick={handleSimulate}
                disabled={isSimulating}
                title="Simulate live real-time status update"
                className="px-2 py-1 text-[11px] font-bold text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <Zap className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Simulate Ping</span>
              </button>

              {/* Mark all as read */}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllNotificationsAsRead}
                  title="Mark all as read"
                  className="p-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 rounded-md transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-3 py-2 bg-white dark:bg-[#0A1727] border-b border-slate-100 dark:border-slate-800 flex items-center gap-1 overflow-x-auto no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer text-xs ${
                activeFilter === 'all'
                  ? 'bg-[#102B4E] text-white dark:bg-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('booking')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                activeFilter === 'booking'
                  ? 'bg-[#102B4E] text-white dark:bg-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3 h-3" />
              Bookings
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('payment')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                activeFilter === 'payment'
                  ? 'bg-[#102B4E] text-white dark:bg-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-3 h-3" />
              Payments
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('expert')}
              className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                activeFilter === 'expert'
                  ? 'bg-[#102B4E] text-white dark:bg-blue-600'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              Expert Replies
            </button>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => setActiveFilter('unread')}
                className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition-colors cursor-pointer text-xs ${
                  activeFilter === 'unread'
                    ? 'bg-red-500 text-white'
                    : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40'
                }`}
              >
                Unread ({unreadCount})
              </button>
            )}
          </div>

          {/* Notifications Scrollable List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#0A1727]">
            {filteredNotifications.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h4 className="font-bold text-sm text-[#102B4E] dark:text-slate-200">
                  No {activeFilter !== 'all' ? activeFilter : ''} notifications
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[240px] mx-auto">
                  You're all caught up. Upcoming bookings, payment confirmations, and expert responses will appear here in real time.
                </p>
                <button
                  type="button"
                  onClick={handleSimulate}
                  className="mt-4 px-3 py-1.5 text-xs font-bold text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3 h-3" />
                  Simulate Real-time Alert
                </button>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markNotificationAsRead(notification.id)}
                  className={`p-3.5 sm:p-4 transition-colors relative flex items-start gap-3 cursor-pointer group ${
                    !notification.read
                      ? 'bg-blue-50/40 dark:bg-blue-950/20 hover:bg-blue-50/70 dark:hover:bg-blue-950/40'
                      : 'hover:bg-slate-50 dark:hover:bg-[#0E1F33]'
                  }`}
                >
                  {/* Type Icon Badge */}
                  {getTypeIcon(notification.type)}

                  {/* Content Area */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5">
                        {getCategoryBadge(notification.type)}
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-[#1464C8] dark:bg-[#B7E532] inline-block" title="Unread"></span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                        {formatRelativeTime(notification.timestamp)}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-xs text-[#102B4E] dark:text-white leading-snug">
                      {notification.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed line-clamp-3">
                      {notification.message}
                    </p>

                    {/* Meta info tags if present */}
                    {notification.metadata && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {notification.metadata.providerName && (
                          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded">
                            {notification.metadata.providerName}
                          </span>
                        )}
                        {notification.metadata.amount && (
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-800/40">
                            {notification.metadata.amount}
                          </span>
                        )}
                        {notification.metadata.gateway && (
                          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            via {notification.metadata.gateway}
                          </span>
                        )}
                        {notification.metadata.reference && (
                          <span className="text-[10px] font-mono text-slate-400">
                            #{notification.metadata.reference}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action CTA Button */}
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActionClick(notification);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1464C8] dark:text-[#B7E532] hover:underline cursor-pointer"
                      >
                        <span>{notification.actionLabel || 'View Status'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      {/* Delete item button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        title="Dismiss notification"
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition-opacity cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-3 bg-slate-50 dark:bg-[#071321] border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
            {onOpenMyBookings ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onOpenMyBookings();
                }}
                className="font-bold text-[#1464C8] dark:text-[#B7E532] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Open Client Dashboard</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-400">Real-time alerts active</span>
            )}

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAllNotifications}
                className="text-[11px] font-semibold text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
