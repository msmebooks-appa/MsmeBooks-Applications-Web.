import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Paperclip, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Headphones, 
  Sparkles, 
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'user';
  agentName?: string;
  agentRole?: string;
  text: string;
  timestamp: string;
  ticketId?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'agent',
    agentName: 'Folake Adeleke',
    agentRole: 'Partner Success Lead',
    text: "Hello! Welcome to MsmeBooks Partner Support. I'm Folake from the Partner Success desk. How can we support your partner onboarding, client referrals, or commission payouts today?",
    timestamp: 'Just now'
  }
];

const QUICK_PROMPTS = [
  "When are commission payouts processed?",
  "How do I submit client referrals?",
  "What is required to reach Platinum tier?",
  "Can I get co-branded marketing assets?"
];

export const LiveChatWidget: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'channels' | 'ticket'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  // Callback form state
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackTime, setCallbackTime] = useState('Today (2:00 PM - 4:00 PM WAT)');
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  // Ticket form state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Commission & Payouts');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [ticketDetails, setTicketDetails] = useState('');
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom whenever messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      if (!hasOpenedOnce) setHasOpenedOnce(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [isOpen, messages]);

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate human agent review & contextual response
    setTimeout(() => {
      let replyText = "Thank you for reaching out! Our Partner Success desk has received your inquiry. A specialist is reviewing your partner profile right now.";
      const lower = text.toLowerCase();
      let ticketRef: string | undefined = undefined;

      if (lower.includes('payout') || lower.includes('when') || lower.includes('commission') || lower.includes('payment')) {
        replyText = "Partner commissions are calculated automatically at month-end and disbursed on the 5th business day of each month directly via local bank transfer or wire in your preferred currency. You can track pending payouts in real time on your Partner Portal.";
      } else if (lower.includes('referral') || lower.includes('submit') || lower.includes('client') || lower.includes('lead')) {
        replyText = "You can register new clients directly through your partner dashboard link or submit their onboarding details via the 'Apply' section. Attribution is instant and locked to your Partner ID for lifetime recurring commissions!";
      } else if (lower.includes('platinum') || lower.includes('tier') || lower.includes('upgrade') || lower.includes('gold')) {
        replyText = "To reach Platinum tier (30% commission), you need 25+ active clients or $10,000+ monthly referred volume. You will also unlock a dedicated Partner Success Manager and quarterly co-marketing funds!";
      } else if (lower.includes('asset') || lower.includes('marketing') || lower.includes('co-brand') || lower.includes('deck')) {
        replyText = "We offer complete co-branded pitch decks, client one-pagers, audit checklists, and email templates in the Sales Enablement toolkit. We can also customize collateral with your firm's logo within 48 hours.";
      } else {
        ticketRef = `MSME-SPT-${Math.floor(1000 + Math.random() * 9000)}`;
        replyText = `Thank you for sharing the details. I have logged ticket ${ticketRef} on our Partner Desk. Tariq Bello from Partner Operations has been alerted and will follow up with you directly.`;
      }

      const agentMsg: ChatMessage = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        agentName: 'Folake Adeleke',
        agentRole: 'Partner Success Lead',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ticketId: ticketRef
      };

      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackName || !callbackPhone) return;
    setCallbackSubmitted(true);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketEmail || !ticketDetails) return;
    const newId = `MSME-TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    setCreatedTicketId(newId);
  };

  return (
    <>
      {/* Floating Trigger Button at Bottom-Right */}
      <div id="live-chat-trigger" className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && unreadCount > 0 && (
          <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-[#142D4E] text-slate-800 dark:text-slate-100 text-xs font-semibold py-2 px-3.5 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-[#B9E51C] animate-pulse"></span>
            <span>{t('chat.supportOnline')}</span>
          </div>
        )}

        <button
          onClick={handleToggleOpen}
          aria-label={isOpen ? "Close Partner Support Chat" : "Open Partner Support Chat"}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-[#1261B5] hover:bg-[#0e4e94] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#1261B5]/40"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200 rotate-0 group-hover:rotate-90" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Headphones className="w-6 h-6" />
              {/* Online indicator pulse */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B9E51C] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#B9E51C] border-2 border-[#1261B5]"></span>
              </span>
            </div>
          )}
        </button>
      </div>

      {/* Live Chat Help Dialog Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="MsmeBooks Partner Support Help Dialog"
          className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[85vh] h-[600px] bg-white dark:bg-[#142D4E] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 flex flex-col overflow-hidden z-50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
        >
          {/* Dialog Header */}
          <div className="bg-[#142D4E] dark:bg-[#0c1c33] text-white p-4 border-b border-slate-800 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#1261B5] flex items-center justify-center font-bold text-white shadow-inner">
                    <Headphones className="w-5 h-5 text-[#B9E51C]" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#B9E51C] border-2 border-[#142D4E]"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold tracking-tight">{t('chat.header')}</h3>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#B9E51C]/20 text-[#B9E51C] border border-[#B9E51C]/30">
                      {t('chat.live')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5">
                    <span>{t('chat.onDuty')}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-[#B9E51C]">{t('chat.avgReply')}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 gap-1 mt-4 p-1 bg-white/10 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'chat'
                    ? 'bg-[#1261B5] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t('chat.liveChat')}</span>
              </button>
              <button
                onClick={() => setActiveTab('channels')}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'channels'
                    ? 'bg-[#1261B5] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{t('chat.channels')}</span>
              </button>
              <button
                onClick={() => setActiveTab('ticket')}
                className={`py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  activeTab === 'ticket'
                    ? 'bg-[#1261B5] text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{t('chat.ticket')}</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Live Chat View */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50 dark:bg-[#10243e]">
              {/* Message scroll container */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                <div className="text-center my-1">
                  <span className="text-[11px] font-medium text-slate-400 bg-slate-200/60 dark:bg-slate-800/60 px-3 py-1 rounded-full">
                    Official MsmeBooks Partner Support Channel
                  </span>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    {msg.sender === 'agent' && (
                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 ml-1 flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{msg.agentName}</span>
                        <span className="text-[10px] text-slate-400">({msg.agentRole})</span>
                      </span>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-[#1261B5] text-white rounded-br-none'
                          : 'bg-white dark:bg-[#1a375e] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/70 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.ticketId && (
                        <div className="mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-600/40 flex items-center justify-between text-[11px] font-mono text-[#1261B5] dark:text-[#B9E51C]">
                          <span>Reference: {msg.ticketId}</span>
                          <span className="inline-flex items-center gap-1 font-sans text-[10px] bg-[#B9E51C]/20 px-1.5 py-0.5 rounded text-emerald-800 dark:text-[#B9E51C]">
                            <CheckCircle2 className="w-3 h-3" /> Queued
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-300 text-xs bg-white dark:bg-[#1a375e] border border-slate-200 dark:border-slate-700/60 p-2.5 rounded-2xl rounded-bl-none w-28">
                    <span className="w-1.5 h-1.5 bg-[#1261B5] rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-[#1261B5] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#1261B5] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-[11px] font-medium ml-1">Typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick suggestion prompt chips */}
              <div className="p-2 border-t border-slate-200 dark:border-slate-700/60 bg-white/60 dark:bg-[#142D4E]/60 backdrop-blur-sm overflow-x-auto">
                <div className="flex gap-1.5 text-xs whitespace-nowrap">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(prompt)}
                      className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] transition-colors border border-slate-200 dark:border-slate-700 flex-shrink-0"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white dark:bg-[#142D4E] border-t border-slate-200 dark:border-slate-700/80 flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('chat.placeholder')}
                  className="flex-1 text-xs sm:text-sm bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="p-2.5 bg-[#1261B5] hover:bg-[#0e4e94] disabled:opacity-40 text-white rounded-xl transition-colors shadow-sm flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: Direct Contact Channels */}
          {activeTab === 'channels' && (
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-[#10243e] space-y-4">
              <div className="bg-white dark:bg-[#1a375e] p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/70 shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-2">
                  Fast Direct Rails
                </h4>
                <div className="space-y-2">
                  <a
                    href="https://wa.me/2348026763257?text=Hello%20MsmeBooks%20Partner%20Desk,%20I%20have%20an%20inquiry%20regarding%20partner%20onboarding."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                        <MessageCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                          WhatsApp Partner Desk
                        </div>
                        <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                          +234 802 676 3257 · Instant reply
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <a
                    href="mailto:partners@msmebooks.org?subject=MsmeBooks%20Partner%20Inquiry"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#1261B5] text-white flex items-center justify-center font-bold">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-blue-900 dark:text-blue-200">
                          Dedicated Partner Email
                        </div>
                        <div className="text-[11px] text-blue-700 dark:text-blue-400">
                          partners@msmebooks.org
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-[#1261B5] group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Request a Callback Form */}
              <div className="bg-white dark:bg-[#1a375e] p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/70 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-[#1261B5] dark:text-[#B9E51C]" />
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Schedule a Callback
                  </h4>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                  A Partner Success Manager will call you during your selected time window.
                </p>

                {callbackSubmitted ? (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                    <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">Callback Confirmed!</p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">
                      Our Partner Manager will reach out to <span className="font-semibold">{callbackPhone}</span> ({callbackTime}).
                    </p>
                    <button
                      onClick={() => setCallbackSubmitted(false)}
                      className="mt-2 text-[11px] text-emerald-700 underline"
                    >
                      Schedule another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCallbackSubmit} className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={callbackName}
                        onChange={(e) => setCallbackName(e.target.value)}
                        placeholder="e.g. Samuel Adekunle"
                        className="w-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1261B5]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Phone Number (with Country Code)
                      </label>
                      <input
                        type="tel"
                        required
                        value={callbackPhone}
                        onChange={(e) => setCallbackPhone(e.target.value)}
                        placeholder="+234 803 000 0000"
                        className="w-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1261B5]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Preferred Window
                      </label>
                      <select
                        value={callbackTime}
                        onChange={(e) => setCallbackTime(e.target.value)}
                        className="w-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1261B5]"
                      >
                        <option value="Today (2:00 PM - 4:00 PM WAT)">Today (2:00 PM - 4:00 PM WAT)</option>
                        <option value="Today (4:00 PM - 6:00 PM WAT)">Today (4:00 PM - 6:00 PM WAT)</option>
                        <option value="Tomorrow (9:00 AM - 12:00 PM WAT)">Tomorrow (9:00 AM - 12:00 PM WAT)</option>
                        <option value="Tomorrow (2:00 PM - 5:00 PM WAT)">Tomorrow (2:00 PM - 5:00 PM WAT)</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#1261B5] hover:bg-[#0e4e94] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                    >
                      Request Support Call
                    </button>
                  </form>
                )}
              </div>

              {/* Operating Hours */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-xs">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  <Clock className="w-3.5 h-3.5 text-[#1261B5] dark:text-[#B9E51C]" />
                  <span>Support Desk Operating Hours</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Monday – Friday: 8:00 AM – 6:00 PM (WAT)<br />
                  Saturday: 9:00 AM – 2:00 PM (WAT)<br />
                  Urgent payout issues: 24/7 on-call dispatch
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Support Ticket View */}
          {activeTab === 'ticket' && (
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-[#10243e]">
              {createdTicketId ? (
                <div className="bg-white dark:bg-[#1a375e] p-5 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">
                    Ticket Logged Successfully!
                  </h4>
                  <div className="my-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg font-mono text-sm font-semibold text-[#1261B5] dark:text-[#B9E51C]">
                    {createdTicketId}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    A confirmation email has been dispatched to <span className="font-semibold">{ticketEmail}</span>. An assigned Partner Operations specialist will respond within 2 hours.
                  </p>

                  <button
                    onClick={() => {
                      setCreatedTicketId(null);
                      setTicketSubject('');
                      setTicketDetails('');
                    }}
                    className="mt-4 px-4 py-2 bg-[#1261B5] hover:bg-[#0e4e94] text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Submit Another Ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-3 bg-white dark:bg-[#1a375e] p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/70 shadow-sm">
                  <div className="border-b border-slate-100 dark:border-slate-700 pb-2">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                      Open an Official Partner Ticket
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      For commission disputes, custom contract inquiries, or client attribution checks.
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      placeholder="e.g. Missing referral attribution for Q3"
                      className="w-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1261B5]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Category
                      </label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        className="w-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1261B5]"
                      >
                        <option value="Commission & Payouts">Commission & Payouts</option>
                        <option value="Client Attribution">Client Attribution</option>
                        <option value="Tier Qualification">Tier Qualification</option>
                        <option value="Marketing Collateral">Marketing Collateral</option>
                        <option value="Technical Integration">Technical Integration</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Priority
                      </label>
                      <select
                        value={ticketPriority}
                        onChange={(e) => setTicketPriority(e.target.value as any)}
                        className="w-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1261B5]"
                      >
                        <option value="Normal">Normal (&lt; 4h)</option>
                        <option value="High">High (&lt; 2h)</option>
                        <option value="Urgent">Urgent (&lt; 30m)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Partner Email / Partner ID
                    </label>
                    <input
                      type="email"
                      required
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      placeholder="partner@yourfirm.com"
                      className="w-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1261B5]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Inquiry Details
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={ticketDetails}
                      onChange={(e) => setTicketDetails(e.target.value)}
                      placeholder="Please provide client business name, transaction date, or details..."
                      className="w-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1261B5] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1261B5] hover:bg-[#0e4e94] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <span>Submit Partner Ticket</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Dialog Footer */}
          <div className="py-2 px-3 bg-slate-100 dark:bg-[#0f2139] border-t border-slate-200 dark:border-slate-800 text-center text-[11px] text-slate-500 dark:text-slate-400">
            Protected by MsmeBooks SLA · Direct Human Agent Support
          </div>
        </div>
      )}
    </>
  );
};
