import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  MessageCircle,
  X,
  Send,
  Phone,
  Mail,
  ExternalLink,
  Clock,
  CheckCheck,
  Paperclip,
  Shield,
  Headphones,
  Sparkles,
  ChevronDown,
  Minus,
  HelpCircle,
  FileText,
  Building,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { POLICY_METADATA } from '../data/privacyPolicyData';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  agentName?: string;
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  ticketRef?: string;
}

export const LiveChatWidget: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'channels' | 'faq'>('chat');
  const [unreadCount, setUnreadCount] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'agent',
      agentName: 'Amina K. · Compliance Lead',
      text: t(
        'chat.greeting',
        'Welcome to MsmeBooks Support! How can our compliance and technical team assist your business today?'
      ),
      time: 'Just now',
      status: 'read'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages, isTyping]);

  // Handle opening and closing with Esc key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text && !attachmentName) return;

    const newMsgId = `u-${Date.now()}`;
    const userMsg: Message = {
      id: newMsgId,
      sender: 'user',
      text: attachmentName ? `${text} [Attached: ${attachmentName}]` : text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setAttachmentName(null);
    setIsTyping(true);

    // Simulated human agent response based on inquiry
    setTimeout(() => {
      setIsTyping(false);
      const ticketNum = Math.floor(1000 + Math.random() * 9000);
      let replyText = '';
      const lower = text.toLowerCase();

      if (lower.includes('rights') || lower.includes('ndpa') || lower.includes('delete') || lower.includes('access')) {
        replyText = `Thank you for your inquiry. Under the Nigeria Data Protection Act 2023 and MsmeBooks Policy (Section 13), your rights request has been logged. Our Data Protection Officer reviews all statutory submissions within 72 business hours. You can also file a dedicated request in our Privacy Rights Centre.`;
      } else if (lower.includes('export') || lower.includes('ledger') || lower.includes('download') || lower.includes('excel')) {
        replyText = `You retain 100% sole ownership over your business ledgers (Section 7). You can perform complete multi-format exports (CSV, Excel, PDF, JSON) anytime via Settings > Data Portability, or request an offline certified backup from our support team.`;
      } else if (lower.includes('security') || lower.includes('aes') || lower.includes('encrypt') || lower.includes('cloud')) {
        replyText = `All customer ledgers are protected by AES-256 encryption at rest and TLS 1.3 in transit with isolated multi-tenant schemas. Automated snapshots run every 4 hours with geographic failover across Tier-III cloud regions.`;
      } else if (lower.includes('dpo') || lower.includes('contact') || lower.includes('phone') || lower.includes('whatsapp')) {
        replyText = `You can connect directly with our DPO office at dpo@msmebooks.org or call our dedicated Lagos support hotline at +234 (0) 1 888 6763 (Mon-Fri 8am-6pm WAT). We are also active on WhatsApp support.`;
      } else {
        replyText = `Thank you for reaching out to MsmeBooks Support. Our team has received your message and logged support ticket #MB-${ticketNum}. A compliance agent or technical specialist is reviewing your inquiry.`;
      }

      const agentMsg: Message = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        agentName: 'Amina K. · Compliance Lead',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ticketRef: `#MB-${ticketNum}`
      };

      setMessages((prev) => [...prev, agentMsg]);
    }, 950);
  };

  const handleSimulateAttachment = () => {
    if (attachmentName) {
      setAttachmentName(null);
    } else {
      setAttachmentName('msmebooks_query_doc.pdf');
    }
  };

  return (
    <>
      {/* Floating Live Chat Trigger Button */}
      <div className="fixed right-4 sm:right-6 bottom-6 sm:bottom-8 z-40 no-print select-none">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label={t('chat.floatingButton', 'Live Chat Support')}
          className="group relative flex items-center gap-2.5 px-3.5 py-3 sm:px-4 sm:py-3.5 bg-[#1455C0] hover:bg-[#0f449e] dark:bg-[#155de0] dark:hover:bg-[#114ebc] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-3 focus:ring-[#1455C0]/40"
        >
          {/* Active Live Beacon Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8E62E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B8E62E]"></span>
          </span>

          {isOpen ? (
            <X className="w-5 h-5 text-white transition-transform group-hover:rotate-90" />
          ) : (
            <MessageSquare className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
          )}

          <div className="flex flex-col items-start text-left leading-none">
            <span className="text-xs sm:text-sm font-bold tracking-tight">
              {isOpen ? t('chat.close', 'Close') : t('chat.floatingButton', 'Live Chat')}
            </span>
            {!isOpen && (
              <span className="text-[10px] text-blue-100 font-medium hidden sm:inline">
                {t('chat.agentsOnline', '2 Agents Online')}
              </span>
            )}
          </div>

          {/* Unread Message Badge */}
          {!isOpen && unreadCount > 0 && (
            <span
              className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#09111e] shadow-sm animate-bounce"
              aria-label="1 unread message from support"
            >
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Floating Live Chat Help Dialog Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="MsmeBooks Live Support Chat"
          className="fixed right-3 sm:right-6 bottom-20 sm:bottom-24 z-50 w-[calc(100vw-1.5rem)] sm:w-[410px] h-[580px] max-h-[82vh] bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 text-slate-800 dark:text-slate-100"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#172B4D] via-[#1455C0] to-[#1455C0] text-white p-4 shrink-0 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Dual agent stacked avatar simulation */}
                <div className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/60 flex items-center justify-center text-white font-bold text-sm shadow-sm backdrop-blur-sm">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#B8E62E] border-2 border-[#172B4D]" />
              </div>

              <div>
                <h3 className="text-sm font-bold leading-tight flex items-center gap-1.5">
                  <span>{t('chat.title', 'MsmeBooks Support Desk')}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-[#B8E62E]/20 text-[#B8E62E] font-semibold border border-[#B8E62E]/30">
                    Live
                  </span>
                </h3>
                <p className="text-[11px] text-blue-100/90 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-[#B8E62E]" />
                  <span>{t('chat.replyTime', 'Replies typically under 3 mins')}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Minimize live chat"
                aria-label="Minimize live chat"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Close live chat"
                aria-label="Close live chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs (Live Chat | Channels | Quick FAQ) */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50 px-2 py-1 text-xs font-semibold shrink-0">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 px-2 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'bg-white dark:bg-[#111C30] text-[#1455C0] dark:text-[#5B95FF] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{t('chat.tabChat', 'Live Chat')}</span>
            </button>
            <button
              onClick={() => setActiveTab('channels')}
              className={`flex-1 py-1.5 px-2 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'channels'
                  ? 'bg-white dark:bg-[#111C30] text-[#1455C0] dark:text-[#5B95FF] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('chat.tabChannels', 'Direct Channels')}</span>
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`flex-1 py-1.5 px-2 rounded-md transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'faq'
                  ? 'bg-white dark:bg-[#111C30] text-[#1455C0] dark:text-[#5B95FF] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t('chat.tabFaq', 'Instant Help')}</span>
            </button>
          </div>

          {/* TAB 1: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-[#0a1220]">
              {/* Agent status banner */}
              <div className="bg-blue-50/80 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/50 px-3.5 py-1.5 text-[11px] text-blue-900 dark:text-blue-300 flex items-center justify-between shrink-0">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                  <span>Amina K. (Compliance Lead) & Chidi O. are active</span>
                </span>
                <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">WAT / GMT+1</span>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    {msg.sender === 'agent' && (
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1 flex items-center gap-1">
                        <Shield className="w-3 h-3 text-[#1455C0] dark:text-[#5B95FF]" />
                        <span>{msg.agentName}</span>
                      </span>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                        msg.sender === 'user'
                          ? 'bg-[#1455C0] text-white rounded-br-xs'
                          : 'bg-white dark:bg-[#17253d] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {msg.ticketRef && (
                        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[10px] font-mono text-[#1455C0] dark:text-[#5B95FF]">
                          <span>Ticket Reference</span>
                          <span className="font-bold">{msg.ticketRef}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                      <span>{msg.time}</span>
                      {msg.sender === 'user' && (
                        <CheckCheck className="w-3 h-3 text-[#1455C0] dark:text-[#5B95FF]" />
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs py-1">
                    <div className="flex items-center gap-1 bg-white dark:bg-[#17253d] px-3 py-2 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                      <span className="w-1.5 h-1.5 bg-[#1455C0] dark:bg-[#5B95FF] rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-[#1455C0] dark:bg-[#5B95FF] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-[#1455C0] dark:bg-[#5B95FF] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      <span className="ml-1 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                        {t('chat.typing', 'Amina K. is typing...')}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="px-3 pt-2 pb-1 border-t border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-[#111C30]/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
                <button
                  onClick={() => handleSendMessage(t('chat.chip1', 'Ask about NDPA Data Rights'))}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full whitespace-nowrap transition-colors border border-slate-200/80 dark:border-slate-700"
                >
                  {t('chat.chip1', 'Ask about NDPA Data Rights')}
                </button>
                <button
                  onClick={() => handleSendMessage(t('chat.chip2', 'How to export financial ledgers'))}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full whitespace-nowrap transition-colors border border-slate-200/80 dark:border-slate-700"
                >
                  {t('chat.chip2', 'How to export financial ledgers')}
                </button>
                <button
                  onClick={() => handleSendMessage(t('chat.chip3', 'AES-256 Security Details'))}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full whitespace-nowrap transition-colors border border-slate-200/80 dark:border-slate-700"
                >
                  {t('chat.chip3', 'AES-256 Security Details')}
                </button>
                <button
                  onClick={() => handleSendMessage(t('chat.chip4', 'Connect with DPO Office'))}
                  className="px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full whitespace-nowrap transition-colors border border-slate-200/80 dark:border-slate-700"
                >
                  {t('chat.chip4', 'Connect with DPO Office')}
                </button>
              </div>

              {/* Attachment Preview (if simulated) */}
              {attachmentName && (
                <div className="px-3.5 py-1 bg-blue-50 dark:bg-blue-950/60 border-t border-blue-100 dark:border-blue-900 flex items-center justify-between text-xs text-[#1455C0] dark:text-[#5B95FF]">
                  <span className="flex items-center gap-1.5 truncate">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{attachmentName}</span>
                  </span>
                  <button
                    onClick={() => setAttachmentName(null)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Input Footer */}
              <div className="p-2.5 bg-white dark:bg-[#111C30] border-t border-slate-200 dark:border-slate-800 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={handleSimulateAttachment}
                    className={`p-2 rounded-lg transition-colors ${
                      attachmentName
                        ? 'text-[#1455C0] bg-blue-50 dark:bg-blue-950 dark:text-[#5B95FF]'
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title="Simulate document attachment"
                    aria-label="Simulate document attachment"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t('chat.inputPlaceholder', 'Type your inquiry or message...')}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs px-3 py-2 rounded-lg border border-transparent focus:border-[#1455C0] dark:focus:border-[#5B95FF] focus:outline-none transition-colors"
                  />

                  <button
                    type="submit"
                    disabled={!inputValue.trim() && !attachmentName}
                    className="p-2 bg-[#1455C0] hover:bg-[#0f449e] disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 rounded-lg transition-colors disabled:cursor-not-allowed shadow-xs"
                    title={t('chat.send', 'Send')}
                    aria-label={t('chat.send', 'Send')}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT CHANNELS */}
          {activeTab === 'channels' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-[#0a1220]">
              <div className="p-3 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                  Instant Messaging
                </span>
                <a
                  href="https://wa.me/2348140000000?text=Hello%20MsmeBooks%20Support%2C%20I%20have%20an%20inquiry%20regarding%20your%20Privacy%20Policy."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100/70 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200 group-hover:text-emerald-800">
                        {t('chat.whatsapp', 'WhatsApp Support Desk')}
                      </p>
                      <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                        {t('chat.whatsappDesc', 'Instant chat with our Lagos support team')}
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                </a>
              </div>

              <div className="p-3 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                  Voice Hotline
                </span>
                <a
                  href={`tel:${POLICY_METADATA.phone}`}
                  className="mt-2 flex items-center justify-between p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100/70 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#1455C0] text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-blue-950 dark:text-blue-200 group-hover:text-[#1455C0]">
                        {t('chat.phone', 'Lagos Phone Hotline')}
                      </p>
                      <p className="text-[11px] text-blue-700 dark:text-blue-300">
                        {POLICY_METADATA.phone} (Mon-Fri 8am-6pm WAT)
                      </p>
                    </div>
                  </div>
                  <Phone className="w-4 h-4 text-[#1455C0] dark:text-[#5B95FF] shrink-0" />
                </a>
              </div>

              <div className="p-3 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                  Regulatory & Legal Desk
                </span>
                <a
                  href={`mailto:${POLICY_METADATA.dpoEmail}`}
                  className="mt-2 flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#1455C0]">
                        {POLICY_METADATA.dpoEmail}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Official NDPA Data Protection Officer Office
                      </p>
                    </div>
                  </div>
                  <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
                </a>
              </div>

              <div className="p-3 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                  Corporate Physical Office
                </span>
                <div className="mt-2 flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <Building className="w-4 h-4 text-[#1455C0] dark:text-[#5B95FF] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">MsmeBooks Corporation</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Victoria Island Financial District, Lagos State, Federal Republic of Nigeria
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INSTANT HELP FAQ */}
          {activeTab === 'faq' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-slate-50/50 dark:bg-[#0a1220]">
              <div className="p-3 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>How fast are NDPA deletion requests processed?</span>
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  Statutory NDPA 2023 requests are acknowledged within 72 hours and fully executed within 30 days, subject to statutory tax retention mandates (Sec 11).
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Can I export all invoices before cancelling?</span>
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  Yes, MsmeBooks provides unrestricted continuous export in CSV, Excel, and PDF formats directly from your organization settings at zero exit fee (Sec 7).
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Does MsmeBooks train AI models on my data?</span>
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  Strictly zero. Customer ledger entries, inventory figures, and customer contacts are never used to train public machine learning or AI models (Sec 17).
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-[#111C30] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>What cryptographic standards protect our records?</span>
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                  Enterprise AES-256 encryption at rest, TLS 1.3 protocol in transit with strict forward secrecy, and role-based access control (RBAC) (Sec 9).
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('chat');
                  handleSendMessage('I need further assistance from a support agent.');
                }}
                className="w-full mt-2 py-2 px-3 text-xs font-semibold text-[#1455C0] dark:text-[#5B95FF] bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200 dark:border-blue-900 text-center"
              >
                Start Chat with a Support Agent →
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
