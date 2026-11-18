import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  MessageSquare,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Zap,
  Building2,
  User,
  RefreshCw,
  FileText,
  Check,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Store,
  Layers,
  HelpCircle,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Partner, SuccessStoryScale } from '../types';
import { useCurrency } from '../context/CurrencyContext';

export interface PartnerInquiryChatModalProps {
  partner: Partner | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestConsultation?: (partner: Partner) => void;
  onViewProfile?: (partner: Partner) => void;
}

interface ChatMessage {
  id: string;
  sender: 'partner' | 'user' | 'system';
  text: string;
  timestamp: string;
  badge?: string;
  actionType?: 'quote' | 'consultation' | 'profile';
}

const PLAY_CHIME = (enabled: boolean) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Audio context may be blocked by autoplay policies
  }
};

export const PartnerInquiryChatModal: React.FC<PartnerInquiryChatModalProps> = ({
  partner,
  isOpen,
  onClose,
  onRequestConsultation,
  onViewProfile,
}) => {
  const { formatBudget, formatHourlyRate, currentCurrency } = useCurrency();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Inline inquiry quote request form drawer
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteFormData, setQuoteFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: 'Retail Store',
    notes: '',
  });
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or reset conversation when a new partner is opened
  useEffect(() => {
    if (partner && isOpen) {
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const initialGreeting: ChatMessage = {
        id: `msg-init-${Date.now()}`,
        sender: 'partner',
        timestamp: now,
        text: `Hello! 👋 Thank you for inquiring with ${partner.name}. I am your dedicated client onboarding lead in ${partner.city}, ${partner.country}. We specialize in ${partner.specialties.slice(0, 2).join(' & ')} and typically reply within ${partner.responseTime}. How can we support your MsmeBooks setup today?`,
      };
      setMessages([initialGreeting]);
      setShowQuoteForm(false);
      setQuoteSubmitted(false);
      setInputValue('');
      setIsTyping(false);

      // Focus input after modal mounts
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [partner?.id, isOpen]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !partner) return null;

  // Suggested questions tailored specifically to this partner
  const suggestedQuestions = [
    {
      label: `💰 What is your starting budget & hourly rate?`,
      question: `What are your starting rates, onboarding fees, and hourly consulting costs?`,
    },
    {
      label: `⏱️ What is your typical implementation timeline?`,
      question: `How long does a full MsmeBooks implementation typically take for a business like ours?`,
    },
    {
      label: `🏬 Do you support multi-store POS & inventory?`,
      question: `Can you configure multi-store barcode scanning, POS till syncing, and warehouse stock tracking?`,
    },
    {
      label: `📍 Do you offer on-site support in ${partner.city}?`,
      question: `Are your engineers available for on-site visits in ${partner.city}, or do you provide remote deployment?`,
    },
    {
      label: `📑 Can you migrate our QuickBooks/Excel data?`,
      question: `Can your team assist with migrating historical ledgers and opening balances from QuickBooks or Excel?`,
    },
    {
      label: `📅 How soon can we schedule a kick-off?`,
      question: `How soon can we schedule an initial discovery session with your technical team?`,
    },
  ];

  // Generate an authentic, scoped response based on the partner's actual data
  const generatePartnerResponse = (userQuery: string): string => {
    const q = userQuery.toLowerCase();
    const rateFormatted = formatHourlyRate(partner);
    const budgetFormatted = partner.startingBudget
      ? formatBudget(partner.startingBudget)
      : '$800';

    if (q.includes('budget') || q.includes('rate') || q.includes('cost') || q.includes('price') || q.includes('fee')) {
      return `Our verified baseline engagement starts at ${budgetFormatted}, with an hourly rate of ${rateFormatted}/hr. We also offer fixed-milestone pricing for complete end-to-end MsmeBooks rollouts so you won't encounter unexpected overages. Would you like me to prepare a customized written quote for your team?`;
    }

    if (q.includes('timeline') || q.includes('how long') || q.includes('duration') || q.includes('time')) {
      return `Most SME implementations take between 1 to 3 weeks from data audit to live go-live. We divide this into Phase 1 (Chart of Accounts & Tax Setup), Phase 2 (Data Migration & Bank Feeds), and Phase 3 (Staff Training). Our team responds in ${partner.responseTime}, so we can commence your initial scoping immediately!`;
    }

    if (q.includes('pos') || q.includes('store') || q.includes('inventory') || q.includes('barcode') || q.includes('till')) {
      return `Yes, absolutely! We have deep expertise in ${partner.specialties.join(', ')}. We set up barcode thermal printers, touchscreen POS terminals, offline till synchronization, and recipe-level inventory deductions that automatically balance your central ledger.`;
    }

    if (q.includes('site') || q.includes('visit') || q.includes('remote') || q.includes('location') || q.includes(partner.city.toLowerCase())) {
      const remoteNote = partner.remoteSupport
        ? `We provide both direct on-site assistance in ${partner.city}, ${partner.country} and secure remote screen-share deployment across all regions.`
        : `Our engineers provide dedicated on-site presence at your premises in ${partner.city}, ${partner.country}.`;
      return `${remoteNote} We can easily schedule an initial walkthrough at your office or store.`;
    }

    if (q.includes('migrate') || q.includes('quickbooks') || q.includes('excel') || q.includes('data') || q.includes('ledger')) {
      return `We routinely migrate businesses from spreadsheets, QuickBooks, Sage, and manual paper records. Having supported over ${partner.businessesSupported}+ companies across ${partner.industries.slice(0, 3).join(', ')}, we ensure 100% chart of accounts parity and zero double-entry errors.`;
    }

    if (q.includes('soon') || q.includes('start') || q.includes('schedule') || q.includes('consultation') || q.includes('book')) {
      return `We are currently ${partner.availabilityStatus}! We can arrange an initial 30-minute discovery consultation as early as this week. You can tap the "Book Consultation" button below to select an available calendar slot.`;
    }

    // Default intelligent scoped fallback
    return `Thank you for asking! With ${partner.yearsExperience} years of experience in ${partner.partnerType} services, ${partner.name} is fully certified to handle this. We'd love to examine your specific operational workflow. Would you like to leave your contact info for an official scope breakdown, or schedule a quick 30-minute consultation?`;
  };

  // Dispatch a message (either typed or from suggested chip)
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isTyping) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: userTime,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    PLAY_CHIME(soundEnabled);

    // Simulate realistic typing and response from the partner
    setTimeout(() => {
      const partnerReplyText = generatePartnerResponse(text);
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const partnerMsg: ChatMessage = {
        id: `msg-partner-${Date.now()}`,
        sender: 'partner',
        text: partnerReplyText,
        timestamp: replyTime,
        actionType: text.toLowerCase().includes('budget') || text.toLowerCase().includes('quote') ? 'quote' : 'consultation',
      };

      setMessages((prev) => [...prev, partnerMsg]);
      setIsTyping(false);
      PLAY_CHIME(soundEnabled);
    }, 850);
  };

  // Submit quote inquiry form from inside the chat
  const handleQuoteFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
    setShowQuoteForm(false);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const confirmationMsg: ChatMessage = {
      id: `msg-sys-${Date.now()}`,
      sender: 'system',
      text: `✅ Inquiry Brief Logged! We have forwarded your project details to ${partner.name} (${partner.email}). An implementation coordinator will reach out to ${quoteFormData.email} or ${quoteFormData.phone} within ${partner.responseTime}. Reference: MSME-INQ-${Math.floor(100000 + Math.random() * 900000)}.`,
      timestamp: now,
    };

    setMessages((prev) => [...prev, confirmationMsg]);
    PLAY_CHIME(soundEnabled);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`partner-chat-title-${partner.id}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-[#0c1f38] text-slate-900 dark:text-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[88vh] max-h-[750px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Scoped Chat Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
              />
              <span
                className="absolute -top-1 -left-1 flex h-3 w-3 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-2xs"
                title={`Status: ${partner.availabilityStatus}`}
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2
                  id={`partner-chat-title-${partner.id}`}
                  className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate"
                >
                  {partner.name}
                </h2>
                {partner.verified && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-lime-700 dark:text-lime-400 bg-lime-500/15 px-1.5 py-0.5 rounded border border-lime-500/20 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-lime-500" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 truncate">
                <span className="flex items-center gap-1 truncate">
                  <span>{partner.countryFlag}</span>
                  <span className="truncate">{partner.city}, {partner.country}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                  <Zap className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                  <span>Responds {partner.responseTime}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Audio Toggle */}
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              title={soundEnabled ? 'Mute notification sound' : 'Enable notification sound'}
              aria-label={soundEnabled ? 'Mute chat sounds' : 'Enable chat sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-lime-500" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close partner inquiry chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Context Strip */}
        <div className="px-5 py-2 bg-lime-50/70 dark:bg-lime-950/20 border-b border-lime-200/50 dark:border-lime-900/30 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 shrink-0">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-none py-0.5">
            <span className="flex items-center gap-1 font-semibold text-lime-800 dark:text-lime-300">
              <Sparkles className="w-3.5 h-3.5 text-lime-500" />
              <span>Direct Partner Inquiry Flow</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-[11px] text-slate-600 dark:text-slate-400">
              Starting from <strong>{partner.startingBudget ? formatBudget(partner.startingBudget) : '$800'}</strong>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-[11px] text-slate-600 dark:text-slate-400">
              {partner.remoteSupport ? '🌐 Remote & On-site' : '📍 On-site only'}
            </span>
          </div>

          {onViewProfile && (
            <button
              type="button"
              onClick={() => onViewProfile(partner)}
              className="text-[11px] font-bold text-lime-700 dark:text-lime-400 hover:underline flex items-center gap-0.5 shrink-0 ml-2"
            >
              <span>Full Profile</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Chat Thread Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Messages */}
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-200">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Inquiry Registered Successfully</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1.5 block font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              );
            }

            const isPartner = msg.sender === 'partner';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isPartner ? 'justify-start' : 'justify-end'}`}
              >
                {isPartner && (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0 mt-0.5"
                  />
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isPartner
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm border border-slate-200/80 dark:border-slate-700/60'
                      : 'bg-lime-500 text-slate-950 font-medium rounded-tr-sm shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  <div
                    className={`flex items-center justify-between gap-3 text-[10px] mt-2 pt-1 border-t ${
                      isPartner
                        ? 'border-slate-200 dark:border-slate-700/60 text-slate-400'
                        : 'border-lime-600/30 text-slate-800'
                    }`}
                  >
                    <span className="font-medium">
                      {isPartner ? partner.name : 'You (Business Owner)'}
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Scoped Call-to-Action Buttons directly in partner replies */}
                  {isPartner && msg.actionType && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/40 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setShowQuoteForm(true)}
                        className="px-2.5 py-1 rounded-lg bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-[11px] transition-colors shadow-2xs flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Request Official Written Quote</span>
                      </button>

                      {onRequestConsultation && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onRequestConsultation(partner);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-[11px] transition-colors flex items-center gap-1"
                        >
                          <Calendar className="w-3 h-3 text-lime-500" />
                          <span>Book Consultation</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {!isPartner && (
                  <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2.5 text-xs text-slate-400 animate-in fade-in">
              <img
                src={partner.logo}
                alt="Typing"
                className="w-7 h-7 rounded-lg object-cover opacity-80"
              />
              <div className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">
                  {partner.name} is preparing response...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Interactive Suggested Questions Carousel */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 shrink-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
            <span>Tap Suggested Inquiries for {partner.name}:</span>
            <span className="text-lime-600 dark:text-lime-400">1-Click Instant Send</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                disabled={isTyping}
                onClick={() => handleSendMessage(q.question)}
                className="whitespace-nowrap px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-lime-50 dark:hover:bg-lime-950/40 text-slate-700 dark:text-slate-300 hover:text-lime-700 dark:hover:text-lime-300 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:border-lime-500/50 transition-all shadow-2xs disabled:opacity-50 shrink-0"
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inline Formal Quote / Inquiry Drawer (Expandable) */}
        {showQuoteForm && (
          <div className="p-4 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-2 duration-150 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-lime-500" />
                <span>Request Written Scope & Pricing Breakdown from {partner.name}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowQuoteForm(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuoteFormSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                required
                type="text"
                placeholder="Your Name *"
                value={quoteFormData.name}
                onChange={(e) => setQuoteFormData({ ...quoteFormData, name: e.target.value })}
                className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <input
                required
                type="email"
                placeholder="Work Email *"
                value={quoteFormData.email}
                onChange={(e) => setQuoteFormData({ ...quoteFormData, email: e.target.value })}
                className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <input
                required
                type="tel"
                placeholder="Phone / WhatsApp *"
                value={quoteFormData.phone}
                onChange={(e) => setQuoteFormData({ ...quoteFormData, phone: e.target.value })}
                className="px-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <div className="sm:col-span-3 flex items-center justify-between gap-2 mt-1">
                <p className="text-[11px] text-slate-500">
                  Direct inquiry forwarded to partner's certified desk in {partner.city}.
                </p>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs shadow-sm transition-all whitespace-nowrap"
                >
                  Send Formal Inquiry
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1f38] flex items-center gap-2 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Ask a question to ${partner.name}...`}
            disabled={isTyping}
            className="flex-1 px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
          />

          <button
            type="button"
            disabled={!inputValue.trim() || isTyping}
            onClick={() => handleSendMessage()}
            className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 shrink-0"
            aria-label="Send inquiry question"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>

        {/* Footer Meta & Direct Channels */}
        <div className="px-5 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <span>Direct phone: <strong>{partner.phone}</strong></span>
            <span>•</span>
            <span>Email: <strong>{partner.email}</strong></span>
          </div>

          <button
            type="button"
            onClick={() => setShowQuoteForm((prev) => !prev)}
            className="font-bold text-lime-600 dark:text-lime-400 hover:underline"
          >
            {showQuoteForm ? 'Hide Form' : 'Request Written Quote'}
          </button>
        </div>
      </div>
    </div>
  );
};
