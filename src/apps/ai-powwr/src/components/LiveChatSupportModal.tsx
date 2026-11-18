import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../context/I18nContext';
import { useConnectionStatus } from '../context/ConnectionContext';
import {
  MessageCircle,
  X,
  Send,
  PhoneCall,
  User,
  Clock,
  CheckCheck,
  Headphones,
  Paperclip,
  CheckCircle2,
  ExternalLink,
  AlertTriangle,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  WifiOff
} from 'lucide-react';

interface SupportAgent {
  id: string;
  name: string;
  role: string;
  location: string;
  avatarBg: string;
  initials: string;
  status: 'active' | 'in_call' | 'away';
  specialty: string;
}

const SUPPORT_AGENTS: SupportAgent[] = [
  {
    id: 'chioma',
    name: 'Chioma Eze',
    role: 'Senior Merchant Success Specialist',
    location: 'Lagos (WAT, GMT+1)',
    avatarBg: 'bg-emerald-600',
    initials: 'CE',
    status: 'active',
    specialty: 'Accounting, VAT compliance & Chart of Accounts'
  },
  {
    id: 'kwame',
    name: 'Kwame Mensah',
    role: 'POS Hardware & Retail Integration Lead',
    location: 'Accra (GMT+0)',
    avatarBg: 'bg-blue-600',
    initials: 'KM',
    status: 'active',
    specialty: 'ESC/POS receipt printers, barcode scanners & cash drawers'
  },
  {
    id: 'fatima',
    name: 'Fatima Al-Mansoor',
    role: 'Regional Tax & Multi-Currency Specialist',
    location: 'Cairo (EET, GMT+2)',
    avatarBg: 'bg-purple-600',
    initials: 'FA',
    status: 'active',
    specialty: 'Multi-currency settlement, hotel PMS folios & branch payroll'
  }
];

interface ChatMessage {
  id: string;
  sender: 'agent' | 'user' | 'system';
  agentId?: string;
  text: string;
  timestamp: string;
  isOutboxQueued?: boolean;
}

interface LiveChatSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAiAssistant?: () => void;
}

export const LiveChatSupportModal: React.FC<LiveChatSupportModalProps> = ({
  isOpen,
  onClose,
  onOpenAiAssistant
}) => {
  const { t, isRTL } = useI18n();
  const { isOnline } = useConnectionStatus();

  const [activeTab, setActiveTab] = useState<'chat' | 'channels' | 'team'>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      agentId: 'chioma',
      text: "👋 Hello! I'm Chioma from MsmeBooks Support. How can our team help your business today? We're available for live assistance with bookkeeping, POS printers, tax rules, or migration from QuickBooks/Sage.",
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [activeAgent, setActiveAgent] = useState<SupportAgent>(SUPPORT_AGENTS[0]);

  // Ticket creation form state
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Accounting & VAT');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmittedId, setTicketSubmittedId] = useState<string | null>(null);

  // Callback form state
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackName, setCallbackName] = useState('');
  const [callbackBooked, setCallbackBooked] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isAgentTyping, activeTab]);

  // Handle escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle simulated agent answers for user messages
  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOutboxQueued: !isOnline
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    if (!isOnline) {
      // Offline system note
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            sender: 'system',
            text: '📡 [Offline Mode]: Your message is securely cached in local storage. Our support team will receive it immediately once your internet connection is restored. For urgent needs, call our direct support line: +234 915 848 2622.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 500);
      return;
    }

    // Determine best agent and reply based on content keywords
    setIsAgentTyping(true);

    const lower = content.toLowerCase();
    let assignedAgent = SUPPORT_AGENTS[0];
    let replyText = '';

    if (lower.includes('printer') || lower.includes('pos') || lower.includes('barcode') || lower.includes('hardware') || lower.includes('receipt')) {
      assignedAgent = SUPPORT_AGENTS[1]; // Kwame
      replyText = `Hi there! Kwame here. For POS printers, MsmeBooks supports standard 58mm/80mm ESC/POS thermal printers via USB, Bluetooth, or LAN IP. You can connect it under Settings > Hardware > Thermal Printers, or we can assist you over WhatsApp (+234 915 848 2622) or a remote session right now. Does your printer connect via USB or Bluetooth?`;
    } else if (lower.includes('tax') || lower.includes('vat') || lower.includes('wht') || lower.includes('currency') || lower.includes('hotel') || lower.includes('dollar')) {
      assignedAgent = SUPPORT_AGENTS[2]; // Fatima
      replyText = `Hello! Fatima here. MsmeBooks automates local tax configurations (like 7.5% VAT in Nigeria, 16% in Kenya, 15% in Ghana) with custom fiscal exemptions and multi-currency billing. You can set this under Settings > Company Profile > Tax & Fiscal Rules. Would you like me to guide you through creating your first invoice with automated VAT?`;
    } else if (lower.includes('migrat') || lower.includes('quickbook') || lower.includes('sage') || lower.includes('excel') || lower.includes('import')) {
      assignedAgent = SUPPORT_AGENTS[0]; // Chioma
      replyText = `Hi! Chioma here. We provide free assisted migration from QuickBooks, Sage 50, and Excel. You can upload your Chart of Accounts and Customer list using our standard CSV migration template, or our technical team can migrate your ledger history for you within 24 hours. Would you like me to send you the template format?`;
    } else if (lower.includes('call') || lower.includes('phone') || lower.includes('human') || lower.includes('speak') || lower.includes('talk')) {
      assignedAgent = SUPPORT_AGENTS[0]; // Chioma
      replyText = `Certainly! You can speak directly with an agent right now by calling our support line at +234 915 848 2622, or switch to the "Direct Channels" tab right here in this dialog to request an immediate callback. One of our engineers will call your phone within 15 minutes.`;
    } else {
      assignedAgent = SUPPORT_AGENTS[0]; // Chioma
      replyText = `Thank you for reaching out! I've logged your request: "${content}". Our support team is reviewing your account details. In the meantime, you can explore the FAQ hub, or reach us directly on WhatsApp (+234 915 848 2622). Is there any specific error code or workflow step you'd like us to check?`;
    }

    setActiveAgent(assignedAgent);

    setTimeout(() => {
      setIsAgentTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `agt-${Date.now()}`,
          sender: 'agent',
          agentId: assignedAgent.id,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !ticketMessage) return;

    const randomId = `MSME-${Math.floor(10000 + Math.random() * 90000)}`;
    setTicketSubmittedId(randomId);

    // Also add to chat messages
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-ticket-${Date.now()}`,
        sender: 'system',
        text: `📋 Support Ticket #${randomId} opened for ${ticketName} (${ticketEmail}) regarding "${ticketSubject || ticketCategory}". Assigned to Onboarding Desk. Confirmation sent to ${ticketEmail}.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone) return;

    setCallbackBooked(true);
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-callback-${Date.now()}`,
        sender: 'system',
        text: `📞 Immediate callback requested for ${callbackName || 'Merchant'} at ${callbackPhone}. Expected call in under 15 minutes from an on-duty specialist.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const quickPrompts = [
    'How do I connect my POS receipt printer?',
    'Configure regional VAT and tax rates',
    'Assisted data migration from Excel or Sage',
    'Speak to a human representative on phone'
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-end p-0 sm:p-6 bg-black/40 backdrop-blur-xs transition-opacity animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="live-chat-modal-title"
    >
      <div
        className={`w-full sm:w-[440px] md:w-[480px] h-[92vh] sm:h-[620px] max-h-[95vh] bg-white dark:bg-[#0B132B] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all ${
          isRTL ? 'text-right' : 'text-left'
        }`}
      >
        {/* Modal Header */}
        <div className="bg-[#1254B5] dark:bg-[#092B60] text-white p-4 shrink-0 border-b border-blue-600/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm text-[#B7E522]">
                  <Headphones className="w-5 h-5 text-[#B7E522]" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#1254B5]"></span>
              </div>
              <div>
                <h3 id="live-chat-modal-title" className="font-bold text-base text-white flex items-center gap-2">
                  <span>{t('chat.contactSupport', 'MsmeBooks Support')}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.2 rounded font-mono font-medium">
                    24/7 LIVE
                  </span>
                </h3>
                <p className="text-xs text-blue-100 dark:text-blue-200 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3 text-[#B7E522]" />
                  <span>{t('chat.typicallyReplies', 'Typically replies in under 2 mins')}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onClose}
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
                aria-label="Close Live Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Offline Banner Inside Header */}
          {!isOnline && (
            <div className="mt-2.5 p-2 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-2">
              <WifiOff className="w-4 h-4 text-amber-300 shrink-0" />
              <p className="text-[11px] leading-tight">
                {t('chat.offlineNotice', 'Operating in offline mode. Messages will be queued locally and sent upon reconnection.')}
              </p>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-3 bg-blue-900/40 dark:bg-black/30 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white text-[#1254B5] shadow-xs'
                  : 'text-blue-100 hover:text-white hover:bg-white/5'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{t('chat.tabChat', 'Live Chat')}</span>
            </button>

            <button
              onClick={() => setActiveTab('channels')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'channels'
                  ? 'bg-white text-[#1254B5] shadow-xs'
                  : 'text-blue-100 hover:text-white hover:bg-white/5'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t('chat.tabChannels', 'Hotline & Ticket')}</span>
            </button>

            <button
              onClick={() => setActiveTab('team')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-white text-[#1254B5] shadow-xs'
                  : 'text-blue-100 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{t('chat.tabTeam', 'Agents (3)')}</span>
            </button>
          </div>
        </div>

        {/* ==========================================================
            TAB 1: LIVE CHAT MESSAGING
            ========================================================== */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-50/60 dark:bg-[#0B132B]">
            {/* Active Agent Banner */}
            <div className="py-1.5 px-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className={`w-5 h-5 rounded-full ${activeAgent.avatarBg} text-white text-[10px] font-bold flex items-center justify-center`}>
                  {activeAgent.initials}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{activeAgent.name}</span>
                <span className="text-[11px] text-slate-400">({activeAgent.role})</span>
              </div>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Now
              </span>
            </div>

            {/* Message Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const isSystem = msg.sender === 'system';

                if (isSystem) {
                  return (
                    <div key={msg.id} className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 text-xs text-slate-700 dark:text-blue-200 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#1254B5] dark:text-[#B7E522] shrink-0 mt-0.5" />
                      <div>
                        <p>{msg.text}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{msg.timestamp}</span>
                      </div>
                    </div>
                  );
                }

                const agent = SUPPORT_AGENTS.find((a) => a.id === msg.agentId) || activeAgent;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    {!isUser && (
                      <div
                        className={`w-7 h-7 rounded-full ${agent.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs`}
                        title={agent.name}
                      >
                        {agent.initials}
                      </div>
                    )}

                    <div
                      className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-[#1254B5] text-white rounded-br-xs'
                          : 'bg-white dark:bg-[#131E36] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-xs'
                      }`}
                    >
                      {!isUser && (
                        <span className="block text-[10px] font-bold text-[#1254B5] dark:text-[#B7E522] mb-0.5">
                          {agent.name} · {agent.location.split(' ')[0]}
                        </span>
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-75">
                        <span>{msg.timestamp}</span>
                        {isUser && <CheckCheck className="w-3 h-3 text-blue-200" />}
                        {msg.isOutboxQueued && (
                          <span className="text-amber-300 text-[9px]">(Queued offline)</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Agent Typing Indicator */}
              {isAgentTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className={`w-6 h-6 rounded-full ${activeAgent.avatarBg} text-white flex items-center justify-center font-bold text-[10px]`}>
                    {activeAgent.initials}
                  </div>
                  <div className="bg-white dark:bg-[#131E36] border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-xs">
                    <span className="text-[11px] font-medium">{activeAgent.name} is typing</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[#1254B5] dark:bg-[#B7E522] rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-[#1254B5] dark:bg-[#B7E522] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-[#1254B5] dark:bg-[#B7E522] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Topic Chips */}
            <div className="px-3 pt-2 pb-1 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131E36] overflow-x-auto flex gap-1.5 scrollbar-none">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-300 hover:text-[#1254B5] dark:hover:text-[#B7E522] border border-slate-200 dark:border-slate-700 transition cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-[#131E36] border-t border-slate-200 dark:border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={t('chat.typeMessage', 'Type your message to a support agent...')}
                  className="flex-1 text-xs py-2 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#1254B5] dark:focus:ring-[#B7E522]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2 rounded-xl bg-[#1254B5] hover:bg-[#0A3D87] disabled:opacity-40 text-white font-bold transition shadow-xs cursor-pointer shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                <span>{t('chat.phoneHours', 'Support hours: Mon - Sat, 7:00 AM - 10:00 PM WAT')}</span>
                {onOpenAiAssistant && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAiAssistant();
                    }}
                    className="text-[#1254B5] dark:text-[#B7E522] hover:underline font-semibold flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Ask AI Assistant instead</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 2: DIRECT CHANNELS (HOTLINE, WHATSAPP, TICKET, CALLBACK)
            ========================================================== */}
        {activeTab === 'channels' && (
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60 dark:bg-[#0B132B]">
            {/* Quick Action Cards: WhatsApp & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://wa.me/2349158482622?text=Hello%20MsmeBooks%20Support,%20I%20need%20assistance%20with%20my%20business%20account."
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-left hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 opacity-60 group-hover:opacity-100" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2">
                  WhatsApp Support
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Instant text & audio with dedicated reps
                </p>
                <span className="inline-block mt-2 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  Open WhatsApp &rarr;
                </span>
              </a>

              <a
                href="tel:+2349158482622"
                className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-left hover:shadow-md transition group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-lg bg-[#1254B5] text-white flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522] opacity-60 group-hover:opacity-100" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2">
                  Direct Phone Call
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  +234 915 848 2622
                </p>
                <span className="inline-block mt-2 text-[11px] font-bold text-[#1254B5] dark:text-[#B7E522]">
                  Call Hotline Now &rarr;
                </span>
              </a>
            </div>

            {/* Request Phone Callback Card */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#131E36] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('chat.requestCallback', 'Request an Instant Phone Callback')}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3">
                Need urgent hands-on help? An available support engineer will call your phone number within 15 minutes.
              </p>

              {callbackBooked ? (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Callback requested! An agent will call {callbackPhone} shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleCallbackSubmit} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={callbackName}
                      onChange={(e) => setCallbackName(e.target.value)}
                      className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone (+234...)"
                      value={callbackPhone}
                      onChange={(e) => setCallbackPhone(e.target.value)}
                      className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Request Call Within 15 Mins
                  </button>
                </form>
              )}
            </div>

            {/* Create Formal Support Ticket */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#131E36] border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <HelpCircle className="w-4 h-4 text-[#1254B5] dark:text-[#B7E522]" />
                  <span>{t('chat.submitTicket', 'Create Support Ticket')}</span>
                </div>
                {ticketSubmittedId && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                    #{ticketSubmittedId}
                  </span>
                )}
              </div>

              {ticketSubmittedId ? (
                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-200 space-y-1">
                  <p className="font-bold">Ticket #{ticketSubmittedId} Submitted!</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    A support engineer has been assigned. You will receive email tracking updates at {ticketEmail}.
                  </p>
                  <button
                    onClick={() => {
                      setTicketSubmittedId(null);
                      setTicketMessage('');
                      setTicketSubject('');
                    }}
                    className="text-xs font-bold underline mt-1"
                  >
                    Submit another ticket
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder={t('chat.ticketName', 'Your Name')}
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    />
                    <input
                      type="email"
                      required
                      placeholder={t('chat.ticketEmail', 'Work Email')}
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    >
                      <option>Accounting & VAT</option>
                      <option>Point of Sale & Printers</option>
                      <option>Inventory & Warehouses</option>
                      <option>QuickBooks / Sage Migration</option>
                      <option>Billing & Multi-currency</option>
                      <option>Hotel PMS Add-on</option>
                    </select>
                    <input
                      type="text"
                      placeholder={t('chat.ticketSubject', 'Brief Topic')}
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                    />
                  </div>

                  <textarea
                    required
                    rows={2}
                    placeholder={t('chat.ticketMessage', 'Describe your question or issue in detail...')}
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full text-xs py-2 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  ></textarea>

                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-lg bg-[#1254B5] hover:bg-[#0A3D87] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Submit Support Ticket
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ==========================================================
            TAB 3: AGENTS ROSTER (3 ON-DUTY HUMAN SPECIALISTS)
            ========================================================== */}
        {activeTab === 'team' && (
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60 dark:bg-[#0B132B]">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Connect with certified MsmeBooks enterprise engineers on duty across African & global regional hubs:
            </div>

            {SUPPORT_AGENTS.map((agent) => (
              <div
                key={agent.id}
                className="p-3.5 rounded-xl bg-white dark:bg-[#131E36] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className={`w-10 h-10 rounded-full ${agent.avatarBg} text-white font-bold flex items-center justify-center text-sm shadow-xs`}>
                        {agent.initials}
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#131E36]"></span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {agent.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {agent.role}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        📍 {agent.location}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveAgent(agent);
                      setActiveTab('chat');
                      setMessages((prev) => [
                        ...prev,
                        {
                          id: `transfer-${Date.now()}`,
                          sender: 'system',
                          text: `Switched conversation to ${agent.name} (${agent.specialty}).`,
                          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                      ]);
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#1254B5] dark:text-[#B7E522] border border-blue-200/60 dark:border-blue-900 transition cursor-pointer"
                  >
                    Chat
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">Domain Specialty: </span>
                  <span>{agent.specialty}</span>
                </div>
              </div>
            ))}

            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <span className="font-bold text-[#1254B5] dark:text-[#B7E522] block">
                Enterprise Onboarding SLA
              </span>
              <p className="text-[11px]">
                Paid subscribers on Growth & Pro tiers receive priority live video/screenshare onboarding with dedicated account managers.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
