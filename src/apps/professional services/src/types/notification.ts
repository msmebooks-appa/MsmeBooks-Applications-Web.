export type NotificationCategory = 'booking' | 'payment' | 'expert';

export type NotificationFilter = 'all' | 'unread' | 'booking' | 'payment' | 'expert';

export interface NotificationMetadata {
  amount?: string;
  providerName?: string;
  providerId?: string;
  date?: string;
  timeSlot?: string;
  reference?: string;
  bookingRef?: string;
  batchId?: string;
  servicesCount?: number;
  totalAmount?: string;
  companyName?: string;
  gateway?: string;
  serviceTitle?: string;
  clientName?: string;
  statusText?: string;
  [key: string]: any;
}

export interface AppNotification {
  id: string;
  type: NotificationCategory;
  title: string;
  message: string;
  timestamp: string; // ISO 8601
  read: boolean;
  linkId?: string; // booking reference or provider ID
  bookingRef?: string;
  actionType?: 'open_bookings' | 'open_whatsapp' | 'view_receipt' | 'external_url';
  actionLabel?: string;
  priority?: 'high' | 'normal';
  metadata?: NotificationMetadata;
}
