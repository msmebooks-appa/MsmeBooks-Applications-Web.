import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Headphones,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  HelpCircle,
  FileText,
  User,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  time: string;
  agentName?: string;
  agentAvatar?: string;
}

export const LiveChatWidget: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { currency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'channels' | 'callback'>('chat');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Callback form state
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [callbackForm, setCallbackForm] = useState({
    name: '',
    phone: '',
    topic: 'Sales & Pricing',
  });

  // Messages log
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'agent',
      text: "👋 Hi there! I'm Amara from MsmeBooks Customer Success. Are you looking to set up multi-branch POS, automate WhatsApp invoices, or migrate from Excel?",
      time: 'Just now',
      agentName: 'Amara N.',
      agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  // Handle keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const quickQuestions = [
    'How does offline POS mode work?',
    'Can I migrate existing Excel inventory?',
    'How do I send WhatsApp invoices?',
    'What payment gateways are supported?',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setHasInteracted(true);
    setIsTyping(true);

    // Simulate smart support agent response tailored to African MSMEs
    setTimeout(() => {
      let reply =
        "Thanks for reaching out! Our African support team is reviewing your inquiry. A specialist can also hop on a quick call with you if you'd like.";

      const lower = text.toLowerCase();
      if (lower.includes('offline') || lower.includes('internet') || lower.includes('network')) {
        reply =
          'MsmeBooks POS features an offline-first architecture. If your shop loses internet, cashiers can continue scanning barcodes, processing cash sales, and printing receipts locally. When Wi-Fi or 4G restores, all journals sync automatically with zero data loss!';
      } else if (lower.includes('excel') || lower.includes('migrate') || lower.includes('import') || lower.includes('quickbooks')) {
        reply =
          'Yes, 100%! We provide a 1-click Excel / CSV product and customer importer. Plus, our complimentary onboarding specialist will assist your team in importing your opening balances and stock free of charge.';
      } else if (lower.includes('whatsapp') || lower.includes('invoice') || lower.includes('receipt')) {
        reply =
          'You can generate branded digital invoices and dispatch them directly to your customer via WhatsApp in 1 click! Invoices include live Paystack, Flutterwave, or M-Pesa payment buttons so you collect money faster.';
      } else if (lower.includes('gateway') || lower.includes('paystack') || lower.includes('mpesa') || lower.includes('payment')) {
        reply =
          'We natively support Paystack, Flutterwave, M-Pesa, Moniepoint, and direct bank settlement transfers across Nigeria, Kenya, Ghana, and South Africa with zero custom code required.';
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('plan')) {
        reply =
          `Our plans start at ${currency.format(15000)}/mo with a 14-day free trial. There are no setup fees and all plans include free onboarding and local phone/WhatsApp support!`;
      } else if (lower.includes('human') || lower.includes('agent') || lower.includes('call') || lower.includes('phone')) {
        reply =
          'I have notified our senior support desk! You can also click the "Channels" tab above to reach our direct WhatsApp hotline or call our Lagos/Nairobi offices immediately.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          agentName: 'Amara N.',
          agentAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
        },
      ]);
      setIsTyping(false);
    }, 1100);
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCallbackSubmitted(true);
  };

  return (
    <>
      {/* Floating Chat Trigger Button (Bottom-Right or Bottom-Left in RTL) */}
      <div className={`fixed bottom-6 z-40 ${isRTL ? 'left-6' : 'right-6'}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group flex items-center justify-center rounded-2xl p-4 shadow-2xl transition-all duration-300 ${
            isOpen
              ? 'bg-slate-900 text-white hover:bg-slate-800 rotate-90'
              : 'bg-[#0866FF] hover:bg-[#0752D4] text-white shadow-blue-500/35 hover:scale-105 active:scale-95'
          }`}
          aria-label={isOpen ? 'Close Support Dialog' : 'Open Live Support Chat'}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              {/* Green online indicator dot */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B7F000] opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#B7F000] border-2 border-white dark:border-slate-900" />
              </span>

              {/* Unread message badge */}
              {unreadCount > 0 && !isOpen && (
                <span className="absolute -bottom-1 -left-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-md">
                  {unreadCount}
                </span>
              )}
            </>
          )}

          {/* Hover Tooltip (When closed) */}
          {!isOpen && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap hidden sm:flex items-center gap-1.5 border border-slate-800 ${
                isRTL ? 'left-full ml-3' : 'right-full mr-3'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#B7F000]" />
              <span>{t.chat.launcherTooltip}</span>
            </div>
          )}
        </button>
      </div>

      {/* Help Dialog Modal / Floating Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Live Support & Help Desk"
          className={`fixed bottom-24 z-40 w-[380px] max-w-[calc(100vw-2rem)] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E172A] flex flex-col h-[560px] max-h-[calc(100vh-8rem)] animate-fade-in transition-colors duration-200 ${
            isRTL ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
          }`}
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0866FF] to-blue-700 text-white relative flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                    alt="Support Agent"
                    className="w-10 h-10 rounded-full object-cover border-2 border-white/80 shadow-md"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#B7F000] border-2 border-[#0866FF]" />
                </div>
                <div>
                  <div className="font-bold text-sm leading-tight flex items-center gap-1.5">
                    <span>MsmeBooks Support</span>
                    <span className="text-[10px] bg-[#B7F000] text-slate-950 font-black px-1.5 py-0.2 rounded">
                      {t.chat.badgeOnline}
                    </span>
                  </div>
                  <div className="text-[11px] text-blue-100 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-[#B7F000]" />
                    <span>{t.chat.headerSubtitle}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close chat dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-blue-900/40 p-1 rounded-xl text-xs font-semibold text-center mt-2">
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white text-[#0866FF] font-bold shadow-sm'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                {t.chat.tabChat}
              </button>
              <button
                onClick={() => setActiveTab('channels')}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'channels'
                    ? 'bg-white text-[#0866FF] font-bold shadow-sm'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                {t.chat.tabWhatsapp}
              </button>
              <button
                onClick={() => setActiveTab('callback')}
                className={`py-1.5 rounded-lg transition-all ${
                  activeTab === 'callback'
                    ? 'bg-white text-[#0866FF] font-bold shadow-sm'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                {t.chat.tabCallback}
              </button>
            </div>
          </div>

          {/* Body content based on activeTab */}
          {activeTab === 'chat' && (
            <div className="flex flex-col flex-1 overflow-hidden bg-slate-50/60 dark:bg-slate-950">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                <div className="text-center my-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-full">
                    Today &bull; Pan-African Support Active
                  </span>
                </div>

                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-2 ${
                      m.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {m.sender === 'agent' && (
                      <img
                        src={m.agentAvatar}
                        alt={m.agentName}
                        className="w-6 h-6 rounded-full object-cover shrink-0 mt-1"
                      />
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl p-3 shadow-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-[#0866FF] text-white rounded-br-xs'
                          : 'bg-white dark:bg-[#0E172A] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {m.sender === 'agent' && (
                        <div className="text-[10px] font-bold text-[#0866FF] dark:text-[#B7F000] mb-1">
                          {m.agentName} &bull; Support Specialist
                        </div>
                      )}
                      <div>{m.text}</div>
                      <div
                        className={`text-[9px] mt-1 text-right ${
                          m.sender === 'user'
                            ? 'text-blue-200'
                            : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {m.time}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: '0.2s' }}
                    />
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                      style={{ animationDelay: '0.4s' }}
                    />
                    <span className="text-[11px] text-slate-500">Amara is typing...</span>
                  </div>
                )}

                {/* Suggested Questions Pills if user hasn't chatted much */}
                {!hasInteracted && (
                  <div className="pt-2 space-y-1.5">
                    <div className="text-[10px] font-bold uppercase text-slate-400">
                      Popular Questions:
                    </div>
                    {quickQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="w-full text-left p-2 rounded-xl bg-white dark:bg-[#0E172A] hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-[#0866FF] dark:hover:text-[#B7F000] border border-slate-200/80 dark:border-slate-800 text-xs transition-colors flex items-center justify-between"
                      >
                        <span>{q}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 bg-white dark:bg-[#0E172A] border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs focus:outline-none focus:border-[#0866FF] focus:bg-white dark:focus:bg-slate-900"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="p-2.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] disabled:opacity-50 text-white font-bold transition-all shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  <span>Confidential financial guidance &bull; 256-bit TLS</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'channels' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 dark:bg-slate-950 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  Direct Support Channels
                </h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Prefer instant messaging or speaking to an engineer? Reach us directly:
                </p>
              </div>

              {/* WhatsApp Direct */}
              <a
                href="https://wa.me/2348031234567?text=Hello%20MsmeBooks%20Support,%20I%20would%20like%20assistance%20with%20my%20business%20setup"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-center justify-between hover:scale-[1.01] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-emerald-950 dark:text-emerald-200 text-xs">
                      WhatsApp Priority Support
                    </div>
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      Instant response &bull; Open 24/7
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Phone Hotlines by Country */}
              <div className="space-y-2">
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400">
                  Regional Phone Hotlines
                </span>

                <div className="p-3 rounded-xl bg-white dark:bg-[#0E172A] border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      🇳🇬 Nigeria (Lagos &amp; Abuja)
                    </span>
                    <a
                      href="tel:+23418882400"
                      className="font-mono font-bold text-[#0866FF] hover:underline"
                    >
                      +234 1 888 2400
                    </a>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      🇰🇪 Kenya (Nairobi)
                    </span>
                    <a
                      href="tel:+254207651900"
                      className="font-mono font-bold text-[#0866FF] hover:underline"
                    >
                      +254 20 765 1900
                    </a>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      🇬🇭 Ghana (Accra)
                    </span>
                    <a
                      href="tel:+233302998200"
                      className="font-mono font-bold text-[#0866FF] hover:underline"
                    >
                      +233 30 299 8200
                    </a>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      🇿🇦 South Africa (Sandton)
                    </span>
                    <a
                      href="tel:+27115504300"
                      className="font-mono font-bold text-[#0866FF] hover:underline"
                    >
                      +27 11 550 4300
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Support Ticket */}
              <div className="p-3 rounded-xl bg-white dark:bg-[#0E172A] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#0866FF]" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">Email Desk</div>
                    <div className="text-[11px] text-slate-500">support@msmebooks.com</div>
                  </div>
                </div>
                <a
                  href="mailto:support@msmebooks.com"
                  className="text-xs font-bold text-[#0866FF] hover:underline"
                >
                  Send Email &rarr;
                </a>
              </div>
            </div>
          )}

          {activeTab === 'callback' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 dark:bg-slate-950 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  Request an Instant Callback
                </h4>
                <p className="text-slate-500 dark:text-slate-400">
                  Leave your number and an accounting solutions specialist will phone you within 15 minutes.
                </p>
              </div>

              {callbackSubmitted ? (
                <div className="p-6 text-center space-y-3 bg-white dark:bg-[#0E172A] rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="font-bold text-slate-900 dark:text-white text-sm">
                    Callback Scheduled!
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    Our on-duty specialist will dial <strong>{callbackForm.phone}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setCallbackSubmitted(false);
                      setCallbackForm({ name: '', phone: '', topic: 'Sales & Pricing' });
                    }}
                    className="text-xs font-bold text-[#0866FF] underline"
                  >
                    Submit another request
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleCallbackSubmit}
                  className="space-y-3 bg-white dark:bg-[#0E172A] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800"
                >
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={callbackForm.name}
                      onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                      placeholder="e.g. Babatunde or Ama"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0866FF]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      value={callbackForm.phone}
                      onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                      placeholder="e.g. +234 803 000 0000"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0866FF]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                      What can we help you with?
                    </label>
                    <select
                      value={callbackForm.topic}
                      onChange={(e) => setCallbackForm({ ...callbackForm, topic: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-[#0866FF]"
                    >
                      <option>Multi-Branch &amp; Chain Setup</option>
                      <option>POS Hardware &amp; Barcode Scanners</option>
                      <option>Data Migration from Excel / QuickBooks</option>
                      <option>African Tax &amp; VAT Invoicing</option>
                      <option>Pricing &amp; Subscription Inquiry</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#B7F000]" />
                    <span>Request Callback in 15 mins</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};
