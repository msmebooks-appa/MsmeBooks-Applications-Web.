import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase,
  Clock,
  Video,
  ExternalLink,
  Globe,
  Check,
  Coins,
  Download,
} from 'lucide-react';
import { Partner } from '../types';
import { PARTNER_TYPES, COUNTRIES_LIST } from '../data/partnersData';
import { BookingCalendar, getPartnerTimezone } from './BookingCalendar';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyToggle } from './CurrencyToggle';
import { useLiveScheduling } from '../context/LiveSchedulingContext';

// 1. BECOME A PARTNER MODAL
interface BecomePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BecomePartnerModal: React.FC<BecomePartnerModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    partnerType: 'Accounting Firm',
    country: 'Nigeria',
    city: '',
    contactPerson: '',
    email: '',
    phone: '',
    clientCount: '10 - 25 clients',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-[#091e38] border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-400"></span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              MsmeBooks Official Partner Application
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-white">Application Received!</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Thank you for applying to join the MsmeBooks Partner Ecosystem. Our partner success team will review your application and contact you via phone/email within 24 hours.
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-lime-300 font-mono">
              Application Ref: MSME-APP-{Math.floor(100000 + Math.random() * 900000)}
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-lime-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              Close & Return to Directory
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white">Apply to Become an Authorized Partner</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Earn up to 40% recurring commission and keep 100% of your service fees.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Company / Practice Name</label>
              <input
                required
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="e.g. Apex Financial Advisors Ltd"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-lime-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Partner Type</label>
                <select
                  value={formData.partnerType}
                  onChange={(e) => setFormData({ ...formData, partnerType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-lime-400"
                >
                  {PARTNER_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-lime-400"
                >
                  <optgroup label="Africa — All 54 Sovereign Nations">
                    {COUNTRIES_LIST.filter(c => c.region === 'Africa').map((c) => (
                      <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Europe">
                    {COUNTRIES_LIST.filter(c => c.region === 'Global' && c.subRegion === 'Europe').map((c) => (
                      <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Americas & Caribbean">
                    {COUNTRIES_LIST.filter(c => c.region === 'Global' && (c.subRegion === 'North America' || c.subRegion === 'Latin America' || c.subRegion === 'Caribbean')).map((c) => (
                      <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Middle East">
                    {COUNTRIES_LIST.filter(c => c.region === 'Global' && c.subRegion === 'Middle East').map((c) => (
                      <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Asia & Pacific">
                    {COUNTRIES_LIST.filter(c => c.region === 'Global' && c.subRegion === 'Asia-Pacific').map((c) => (
                      <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Contact Person Name</label>
                <input
                  required
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="e.g. Adebayo Ogunleye"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-lime-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">City / Town</label>
                <input
                  required
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Lagos, Ikeja"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-lime-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Corporate Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-lime-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 block">Phone / WhatsApp</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-lime-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">Estimated Active SME Clients</label>
              <select
                value={formData.clientCount}
                onChange={(e) => setFormData({ ...formData, clientCount: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-lime-400"
              >
                <option value="1 - 10 clients">1 - 10 clients</option>
                <option value="10 - 25 clients">10 - 25 clients</option>
                <option value="25 - 50 clients">25 - 50 clients</option>
                <option value="50+ enterprise clients">50+ enterprise clients</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all"
              >
                Submit Partner Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// 2. CONTACT PARTNER MODAL
interface ContactPartnerModalProps {
  partner: Partner | null;
  onClose: () => void;
}

export const ContactPartnerModal: React.FC<ContactPartnerModalProps> = ({ partner, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'Retail & Supermarket',
    message: '',
  });

  if (!partner) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-[#091e38] border border-slate-700 rounded-3xl shadow-2xl p-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300">Message Verified Partner</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-lime-500/20 text-lime-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Inquiry Sent to {partner.name}!</h3>
            <p className="text-xs text-slate-300">
              The partner has received your project briefing and typically responds in {partner.responseTime}.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-5 py-2 bg-lime-500 text-slate-950 font-bold text-xs rounded-xl"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
              <img src={partner.logo} alt={partner.name} className="w-10 h-10 rounded-lg object-cover" />
              <div>
                <div className="text-xs font-bold text-white">{partner.name}</div>
                <div className="text-[11px] text-lime-400">📍 {partner.city}, {partner.country} • Responds {partner.responseTime}</div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Your Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Business Owner / Representative"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-lime-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@business.com"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300 block">Phone / WhatsApp</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+234..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-lime-400"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300 block">Project Brief or Needs</label>
              <textarea
                rows={3}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="e.g. We have 3 retail stores needing barcode POS and accounting migration..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:ring-2 focus:ring-lime-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs rounded-xl shadow transition-all"
            >
              Send Direct Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Helper to parse consultation meeting start & end dates
export const parseMeetingDates = (date: Date, timeSlotStr: string): { start: Date; end: Date } => {
  let hours = 10;
  let minutes = 0;

  const match = timeSlotStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const ampm = match[3] ? match[3].toUpperCase() : '';
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
  }

  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutes duration

  return { start: startDate, end: endDate };
};

export const formatIcsTimestamp = (d: Date): string => {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
};

// Generates RFC 5545 compliant iCalendar (.ics) file string for Google & Outlook import
export const generateConsultationIcs = (
  partner: Partner,
  meetingRef: string,
  clientName: string,
  clientEmail: string,
  clientPhone: string,
  meetingTopic: string,
  notes: string,
  date: Date,
  timeSlot: string
): string => {
  const { start, end } = parseMeetingDates(date, timeSlot);
  const startStr = formatIcsTimestamp(start);
  const endStr = formatIcsTimestamp(end);
  const nowStr = formatIcsTimestamp(new Date());

  const summary = `MsmeBooks Strategy Consultation with ${partner.name}`;
  const descriptionLines = [
    `Discovery consultation regarding ${meetingTopic} with certified MsmeBooks partner ${partner.name} (${partner.city}, ${partner.country}).`,
    ``,
    `Client: ${clientName || 'Business Representative'}`,
    `Email: ${clientEmail || 'Pending'}`,
    `Phone: ${clientPhone || 'Pending'}`,
    `Consultation Topic: ${meetingTopic}`,
    notes ? `Client Project Notes: ${notes}` : '',
    `Booking Reference: ${meetingRef}`,
    ``,
    `Meeting Location: Google Meet (link sent via confirmation email)`,
    `Partner Website: ${partner.website || 'https://msmebooks.com'}`
  ].filter(Boolean).join('\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MsmeBooks//Global Partner Registry Consultation//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${meetingRef || 'MSME-CONSULT-' + Date.now()}@msmebooks.com`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${descriptionLines}`,
    `LOCATION:Google Meet / Remote Call (${partner.city}, ${partner.country})`,
    'STATUS:CONFIRMED',
    `ORGANIZER;CN="${partner.name}":mailto:${partner.email || 'advisors@msmebooks.com'}`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN="${clientName || 'Client'}":mailto:${clientEmail || 'client@business.com'}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: Consultation with ${partner.name} in 15 minutes`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
};

// 3. REQUEST CONSULTATION MODAL
interface RequestConsultationModalProps {
  partner: Partner | null;
  onClose: () => void;
}

export const RequestConsultationModal: React.FC<RequestConsultationModalProps> = ({ partner, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isIcsDownloaded, setIsIcsDownloaded] = useState(false);
  const {
    formatHourlyRate,
    formatServicePricing,
    currentCurrency,
    detectedLocation,
    geographicProfile,
  } = useCurrency();
  const { bookSlot, getPartnerAvailability } = useLiveScheduling();
  const live = partner ? getPartnerAvailability(partner.id) : null;
  
  // Date and time slot booking state
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Default to tomorrow
    return d;
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('10:00 AM');
  
  // Contact details
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('Implementation & POS Deployment');
  const [projectNotes, setProjectNotes] = useState('');
  const [meetingRefId, setMeetingRefId] = useState('');

  if (!partner) return null;

  const topicToServiceMap: Record<string, string> = {
    'Implementation & POS Deployment': 'Implementation',
    'Multi-Branch Accounting Migration': 'Multi-Branch Setup',
    'Inventory & Barcode Hardware Setup': 'POS Setup',
    'Tax Compliance & Audit Readiness': 'Tax Support',
    'Staff Training & Onboarding': 'Training',
    'General Business Consultation': 'Business Consulting',
  };
  const currentServiceKey = topicToServiceMap[topic] || 'Implementation';
  const estimatedTopicPricing = formatServicePricing(currentServiceKey, partner);

  const partnerTimezone = getPartnerTimezone(partner.country);

  const formattedSelectedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const { start: meetingStart, end: meetingEnd } = parseMeetingDates(selectedDate, selectedTimeSlot);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRef = `MSME-CAL-${Math.floor(100000 + Math.random() * 900000)}`;
    setMeetingRefId(newRef);
    setSubmitted(true);
    // Real-time synchronization with mock scheduling API
    if (partner) {
      bookSlot(partner.id, { name: fullName, service: topic });
    }
  };

  // 'Sync to Calendar': Generates an RFC 5545 standard .ICS calendar file for Google and Outlook
  const handleSyncToCalendar = () => {
    const currentRef = meetingRefId || `MSME-CAL-${Math.floor(100000 + Math.random() * 900000)}`;
    if (!meetingRefId) {
      setMeetingRefId(currentRef);
    }

    const icsString = generateConsultationIcs(
      partner,
      currentRef,
      fullName || 'Business Representative',
      email || 'client@business.com',
      phone || 'Pending',
      topic,
      projectNotes,
      selectedDate,
      selectedTimeSlot
    );

    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedSlug = (partner.slug || partner.name.toLowerCase().replace(/[^a-z0-9]/g, '-')).replace(/-+/g, '-');
    link.setAttribute('download', `msmebooks-consultation-${sanitizedSlug}-${currentRef.toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsIcsDownloaded(true);
  };

  // Generate Google Calendar Web Link with exact ISO start & end times
  const googleCalendarUrl = (() => {
    const title = encodeURIComponent(`Strategy Call with ${partner.name} - MsmeBooks`);
    const details = encodeURIComponent(
      `Discovery consultation regarding ${topic} with ${partner.name} (${partner.city}, ${partner.country}).\nClient: ${fullName || 'Business Representative'} (${email || 'Pending'}, ${phone || 'Pending'})\nReference: ${meetingRefId || 'Pending'}\nLocation: Google Meet / Remote Call`
    );
    const location = encodeURIComponent(`Google Meet / Remote (${partner.city}, ${partner.country})`);
    const dates = `${formatIcsTimestamp(meetingStart)}/${formatIcsTimestamp(meetingEnd)}`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  })();

  // Generate Outlook Web Calendar Link with exact start & end times
  const outlookCalendarUrl = (() => {
    const title = encodeURIComponent(`Strategy Call with ${partner.name} - MsmeBooks`);
    const details = encodeURIComponent(
      `Discovery consultation regarding ${topic} with ${partner.name} (${partner.city}, ${partner.country}).\nClient: ${fullName || 'Business Representative'} (${email || 'Pending'}, ${phone || 'Pending'})\nReference: ${meetingRefId || 'Pending'}\nLocation: Google Meet / Remote Call`
    );
    const location = encodeURIComponent(`Google Meet / Remote (${partner.city}, ${partner.country})`);
    return `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&body=${details}&startdt=${meetingStart.toISOString()}&enddt=${meetingEnd.toISOString()}&location=${location}&path=%2Fcalendar%2Faction%2Fcompose&rru=addevent`;
  })();

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl sm:max-w-3xl bg-[#091e38] border border-slate-700/90 rounded-3xl shadow-2xl p-5 sm:p-7 text-white max-h-[92vh] overflow-y-auto my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img 
              src={partner.logo} 
              alt={partner.name} 
              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow-sm" 
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  Book Free 30-Min Strategy Call
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-400 font-bold border border-lime-500/30">
                  {partner.level} Partner
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                <span>with <strong className="text-lime-400">{partner.name}</strong></span>
                <span>•</span>
                <span>📍 {partner.city}, {partner.country}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <CurrencyToggle mode="compact" idPrefix="consult-modal-currency" />
            <button 
              type="button"
              id="btn-close-consultation-modal"
              onClick={onClose} 
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {submitted ? (
          /* Confirmation View */
          <div className="text-center py-6 sm:py-8 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-lime-500/20 to-emerald-500/20 text-lime-400 border border-lime-500/40 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Meeting Reserved with {partner.name}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-1 leading-relaxed">
                A calendar invitation and Google Meet link have been scheduled for your strategy session.
              </p>
            </div>

            {/* Confirmed Details Summary Card */}
            <div className="max-w-lg mx-auto bg-slate-900/90 rounded-2xl border border-slate-700 p-4 sm:p-5 text-left space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-lime-400" />
                  <span className="text-xs font-bold text-slate-200">Scheduled Date & Time</span>
                </div>
                <span className="text-xs font-mono font-bold text-lime-400">
                  {meetingRefId}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Date</span>
                  <span className="font-bold text-white text-sm">{formattedSelectedDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Time & Zone</span>
                  <span className="font-bold text-white text-sm">{selectedTimeSlot} ({partnerTimezone})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Partner Representative</span>
                  <span className="font-bold text-slate-200">{partner.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Attendee</span>
                  <span className="font-bold text-slate-200">{fullName || 'Business Representative'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 text-lime-300 font-medium">
                  <Video className="w-3.5 h-3.5" />
                  Google Meet link sent to {email || 'your email'}
                </span>
                <span className="text-[11px] text-slate-400">Duration: 30 Mins</span>
              </div>
            </div>

            {/* Calendar Sync & Export Actions */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                {/* Primary 'Sync to Calendar' Button */}
                <button
                  type="button"
                  id="btn-sync-to-calendar"
                  data-testid="btn-sync-to-calendar"
                  onClick={handleSyncToCalendar}
                  className="px-5 py-2.5 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg hover:shadow-lime-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  title="Generate and download .ICS calendar event file for Google, Outlook, and Apple Calendar"
                >
                  <Download className="w-4 h-4" />
                  <span>Sync to Calendar (.ics)</span>
                </button>

                {/* Direct Google Calendar Link */}
                <a
                  id="btn-add-google-calendar"
                  data-testid="btn-add-google-calendar"
                  href={googleCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-600 hover:border-lime-400 transition-all flex items-center gap-1.5 shadow"
                  title="Add directly to Google Calendar web"
                >
                  <Calendar className="w-4 h-4 text-lime-400" />
                  <span>Google Calendar</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>

                {/* Direct Outlook Calendar Link */}
                <a
                  id="btn-add-outlook-calendar"
                  data-testid="btn-add-outlook-calendar"
                  href={outlookCalendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-600 hover:border-sky-400 transition-all flex items-center gap-1.5 shadow"
                  title="Add directly to Outlook Calendar web"
                >
                  <Calendar className="w-4 h-4 text-sky-400" />
                  <span>Outlook Calendar</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                </a>
              </div>

              {/* Status feedback message when ICS is generated */}
              {isIcsDownloaded && (
                <div 
                  id="ics-download-notice"
                  data-testid="ics-download-notice"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-500/15 border border-lime-500/40 text-lime-300 text-xs font-semibold animate-in fade-in"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                  <span>Calendar event (.ics) generated & downloaded! Open file to import into Google or Outlook.</span>
                </div>
              )}

              {/* Real-Time Scheduling Confirmation Banner */}
              <div 
                id="scheduling-api-confirmed-notice"
                data-testid="scheduling-api-confirmed-notice"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Live Scheduling API: Consultation locked on consultant's {live?.calendarProvider || 'Google Calendar'}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                id="btn-done-consultation-modal"
                data-testid="btn-done-consultation-modal"
                onClick={() => {
                  setSubmitted(false);
                  setIsIcsDownloaded(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all cursor-pointer"
              >
                Done & Return to Directory
              </button>
            </div>
          </div>
        ) : (
          /* Consultation Request Form with Interactive Calendar */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Live Scheduling API Status Banner */}
            {live && (
              <div 
                id="consultation-live-scheduling-banner"
                data-testid="consultation-live-scheduling-banner"
                className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-slate-300">
                    <strong>Live Availability:</strong> {live.status} ({live.availableSlotsToday > 0 ? `${live.availableSlotsToday} slots remaining today` : 'Waitlist active'})
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono shrink-0">
                  Synced: {live.calendarProvider}
                </span>
              </div>
            )}

            {/* Location-Aware Consultation & Rate Strip */}
            <div className="p-3 rounded-2xl bg-gradient-to-r from-lime-500/10 via-emerald-500/10 to-slate-900 border border-lime-500/30 text-xs flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-lime-500/20 text-lime-400">
                  <Coins className="w-4 h-4" />
                </span>
                <div>
                  <div className="font-extrabold text-white flex items-center gap-1.5">
                    <span>Initial Discovery: <strong className="text-lime-400">FREE (30m)</strong></span>
                    <span>•</span>
                    <span>Advisory: <strong className="text-white">{formatHourlyRate(partner)}</strong></span>
                  </div>
                  <div className="text-[10.5px] text-slate-300">
                    Location-adjusted for {detectedLocation.countryFlag} {detectedLocation.country} in {currentCurrency.code} ({currentCurrency.name})
                  </div>
                </div>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-800 text-lime-400 border border-slate-700">
                📍 {detectedLocation.countryCode || currentCurrency.code} Localized
              </span>
            </div>

            {/* Step 1: Interactive Calendar & Time Slot Picker */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-lime-400" />
                  <span>Step 1: Select Meeting Date & Time</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-lime-400 font-semibold">
                    30-Min Discovery Session
                  </span>
                  <button
                    type="button"
                    id="btn-presync-calendar"
                    data-testid="btn-presync-calendar"
                    onClick={handleSyncToCalendar}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10.5px] font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                    title="Download .ICS calendar file for this date and time"
                  >
                    <Download className="w-3 h-3 text-lime-400" />
                    <span>Sync to Calendar</span>
                  </button>
                </div>
              </div>

              {/* Integrated Interactive Booking Calendar */}
              <BookingCalendar
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                selectedTimeSlot={selectedTimeSlot}
                onSelectTimeSlot={setSelectedTimeSlot}
                partnerName={partner.name}
                partnerCountry={partner.country}
              />
            </div>

            {/* Step 2: Contact Details & Topic */}
            <div className="space-y-3 pt-1">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-lime-400" />
                <span>Step 2: Business & Contact Information</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Your Full Name *</label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Samuel Adeleke"
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-lime-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Business Email *</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="samuel@business.com"
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-lime-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Phone / WhatsApp *</label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234..."
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-lime-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">Consultation Topic</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-lime-400 focus:outline-none"
                  >
                    <option value="Implementation & POS Deployment">Implementation & POS Deployment</option>
                    <option value="Multi-Branch Accounting Migration">Multi-Branch Accounting Migration</option>
                    <option value="Inventory & Barcode Hardware Setup">Inventory & Barcode Hardware Setup</option>
                    <option value="Tax Compliance & Audit Readiness">Tax Compliance & Audit Readiness</option>
                    <option value="Staff Training & Onboarding">Staff Training & Onboarding</option>
                    <option value="General Business Consultation">General Business Consultation</option>
                  </select>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-300 px-0.5">
                    <span className="flex items-center gap-1">
                      <span className="text-lime-400">📍</span>
                      <span>Estimated Service Package:</span>
                    </span>
                    <span className="font-mono font-bold text-lime-400">
                      {estimatedTopicPricing.formattedPrice} ({estimatedTopicPricing.unit})
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  Project Needs / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  placeholder="e.g. We operate 2 pharmacies and want to switch from manual ledgers..."
                  className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:ring-2 focus:ring-lime-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Bottom Submit Action */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-lime-400" />
                <span>Zero cost, no credit card or commitment required</span>
              </div>

              <button
                type="submit"
                id="btn-confirm-consultation-booking"
                data-testid="btn-confirm-consultation-booking"
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Confirm {formattedSelectedDate.split(',')[0]} {selectedTimeSlot} Call</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
