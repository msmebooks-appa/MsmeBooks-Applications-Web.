import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Phone, 
  MessageCircle, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle,
  Headphones,
  User,
  ArrowUpRight,
  Search
} from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'user' | 'system';
  agentName?: string;
  agentRole?: string;
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    actionType: 'whatsapp' | 'browse' | 'callback';
    url?: string;
  }[];
}

interface LiveChatWidgetProps {
  onNavigateToServices?: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-1',
    sender: 'agent',
    agentName: 'Fatima Al-Hassan',
    agentRole: 'Senior Client Advisor',
    text: "Hello! Welcome to MsmeBooks. 👋 I'm Fatima. Whether you need a verified accounting firm, a POS rollout for your store, or tax advisory, I'm here to guide you in real time. How can we help your business today?",
    timestamp: 'Just now',
    actions: [
      { label: 'Chat on WhatsApp', actionType: 'whatsapp' },
      { label: 'View Services', actionType: 'browse' }
    ]
  }
];

const SUGGESTED_QUESTIONS = [
  "How do I choose the right accounting package?",
  "Can you recommend a verified tax firm?",
  "How quickly can we deploy MsmeBooks POS?",
  "What are your regional pricing tiers?"
];

const SUPPORT_FAQS = [
  {
    q: "Are the accounting and audit firms verified?",
    a: "Yes. Every firm listed in our directory undergoes strict credential vetting (ICAN, CITN, ACCA, CPA), verified business registration, and peer quality reviews before taking client bookings."
  },
  {
    q: "How does WhatsApp direct booking work?",
    a: "When you choose WhatsApp booking, you are immediately connected to our verified onboarding team or assigned firm partner with your selected service specifications pre-loaded."
  },
  {
    q: "Can I migrate my existing accounting data from Excel or QuickBooks?",
    a: "Absolutely. Our certified implementation partners handle turnkey data cleansing, chart of accounts setup, and historical balance migrations in 3–5 business days."
  },
  {
    q: "What payment methods are supported across Africa?",
    a: "We support local bank transfers, corporate debit cards, and Mobile Money (M-Pesa, MTN MoMo) across Nigeria, Ghana, Kenya, South Africa, and Rwanda."
  }
];

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ onNavigateToServices }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'contact' | 'faq'>('chat');
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);
  const [teaserDismissed, setTeaserDismissed] = useState(false);

  // Chat message state
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Callback form state
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackTopic, setCallbackTopic] = useState('Accounting & Bookkeeping');
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  // FAQ search
  const [faqSearch, setFaqSearch] = useState('');

  // Auto scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isOpen, isAgentTyping, activeTab]);

  const handleOpen = () => {
    setIsOpen(true);
    setShowNotificationBadge(false);
    setTeaserDismissed(true);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsAgentTyping(true);

    // Simulate realistic intelligent agent response
    setTimeout(() => {
      setIsAgentTyping(false);
      let replyText = "Thank you for sharing that! Our professional practice team can immediately assist you with this.";
      let actions: ChatMessage['actions'] = [
        { label: 'Connect via WhatsApp', actionType: 'whatsapp' },
        { label: 'Schedule Callback', actionType: 'callback' }
      ];

      const lower = text.toLowerCase();
      if (lower.includes('tax') || lower.includes('vat') || lower.includes('firs') || lower.includes('gra') || lower.includes('kra')) {
        replyText = "For tax compliance, statutory filings, and audit defence, our verified partner firms (like Cedar Professional Services & Bodman Associates) specialize in FIRS/GRA/KRA regulations. Would you like to consult directly with a certified tax partner on WhatsApp, or book a consultation?";
      } else if (lower.includes('pos') || lower.includes('hardware') || lower.includes('inventory') || lower.includes('store') || lower.includes('retail')) {
        replyText = "We offer complete POS solutions including touch terminal hardware, barcode scanners, thermal receipt printers, and multi-warehouse sync. Delivery and onsite setup are available within 48–72 hours across major commercial hubs.";
        actions = [
          { label: 'Browse POS Packages', actionType: 'browse' },
          { label: 'Chat on WhatsApp', actionType: 'whatsapp' }
        ];
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing') || lower.includes('tier') || lower.includes('fee')) {
        replyText = "Our packages are structured into Starter, Growth, and Corporate tiers with localized transparent pricing for Nigeria, Ghana, Kenya, Rwanda, and South Africa. You can also review our live Annual Compliance Savings calculator!";
        actions = [
          { label: 'View Pricing & Savings', actionType: 'browse' },
          { label: 'WhatsApp Inquiry', actionType: 'whatsapp' }
        ];
      } else if (lower.includes('package') || lower.includes('choose') || lower.includes('recommend')) {
        replyText = "If you're an SME with 1–10 employees, our 'Starter Compliance' or 'Monthly Bookkeeping Retainer' packages are ideal. For multi-location businesses, our 'Enterprise ERP & Multi-Store Rollout' covers full customization.";
      } else {
        replyText = `Understood! I've logged your request regarding "${text.slice(0, 45)}...". A senior MsmeBooks business advisor is available right now on our official direct WhatsApp desk to review your exact requirements.`;
      }

      const agentReply: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'agent',
        agentName: 'David Osei',
        agentRole: 'Systems & Implementation Specialist',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions
      };

      setMessages(prev => [...prev, agentReply]);
    }, 1200);
  };

  const handleActionClick = (actionType: 'whatsapp' | 'browse' | 'callback') => {
    if (actionType === 'whatsapp') {
      window.open(
        `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello MsmeBooks Support, I am chatting from the live support widget regarding your services.")}`,
        '_blank'
      );
    } else if (actionType === 'browse') {
      if (onNavigateToServices) {
        onNavigateToServices();
      }
      setIsOpen(false);
    } else if (actionType === 'callback') {
      setActiveTab('contact');
    }
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim()) return;
    setCallbackSubmitted(true);
  };

  const filteredFaqs = SUPPORT_FAQS.filter(
    f => f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* 1. Proactive Greeting Teaser Bubble (when closed) */}
      {!isOpen && !teaserDismissed && (
        <div className="hidden sm:flex items-center gap-3 bg-white dark:bg-[#0A1727] text-slate-800 dark:text-slate-100 py-2.5 px-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 text-xs mb-3 animate-in fade-in slide-in-from-right duration-300 max-w-xs">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1464C8] to-[#102B4E] text-white flex items-center justify-center font-bold text-xs shrink-0 relative">
            <span>MB</span>
            <span className="w-2 h-2 rounded-full bg-[#B7E532] absolute -bottom-0.5 -right-0.5 ring-2 ring-white dark:ring-slate-900"></span>
          </div>
          <div className="flex-1 cursor-pointer" onClick={handleOpen}>
            <div className="font-bold text-[#102B4E] dark:text-white flex items-center gap-1">
              <span>Support Agents Online</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Need help? Chat with an advisor
            </div>
          </div>
          <button
            onClick={() => setTeaserDismissed(true)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Floating Live Chat Toggle Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
            } else {
              handleOpen();
            }
          }}
          className={`flex items-center gap-2.5 px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 cursor-pointer group ${
            isOpen
              ? 'bg-[#102B4E] text-white hover:bg-[#1464C8]'
              : 'bg-gradient-to-r from-[#1464C8] to-[#102B4E] hover:from-[#1052a5] hover:to-[#0b1f38] text-white hover:shadow-blue-500/25 hover:scale-105'
          }`}
          aria-label={isOpen ? "Close live chat" : "Open live chat"}
        >
          {isOpen ? (
            <>
              <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
              <span className="text-xs font-bold tracking-wide">Close Help</span>
            </>
          ) : (
            <>
              <div className="relative">
                <Headphones className="w-5 h-5 text-[#B7E532]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#102B4E] animate-pulse"></span>
              </div>
              <span className="text-xs font-extrabold tracking-wide">Live Chat</span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-[#B7E532] text-[#102B4E] rounded-full">
                Online
              </span>
              {showNotificationBadge && (
                <span className="w-2 h-2 rounded-full bg-[#B7E532] animate-ping"></span>
              )}
            </>
          )}
        </button>
      </div>

      {/* 3. Help & Live Support Dialog Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-96 md:w-[420px] max-h-[85vh] h-[580px] bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-[#102B4E] via-[#1464C8] to-[#102B4E] p-4 text-white shrink-0 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center font-extrabold text-[#B7E532] border border-white/20">
                    MB
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#102B4E] rounded-full"></span>
                </div>
                <div>
                  <div className="font-extrabold text-sm flex items-center gap-1.5">
                    <span>MsmeBooks Concierge</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B7E532]" />
                  </div>
                  <div className="text-[11px] text-blue-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Support Agents Online • &lt; 2m response
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Minimize live chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Tabs */}
            <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl mt-3 text-xs">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'chat'
                    ? 'bg-white text-[#102B4E] shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Live Chat</span>
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'contact'
                    ? 'bg-white text-[#102B4E] shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call & Ticket</span>
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`flex-1 py-1.5 px-2 rounded-lg font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'faq'
                    ? 'bg-white text-[#102B4E] shadow-xs'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Quick Help</span>
              </button>
            </div>
          </div>

          {/* TAB 1: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/60 dark:bg-[#07111E]">
              
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    {msg.sender === 'agent' && (
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-bold text-[#102B4E] dark:text-[#B7E532]">
                          {msg.agentName}
                        </span>
                        <span className="text-[10px] text-slate-400">·</span>
                        <span className="text-[9px] text-slate-400">
                          {msg.agentRole}
                        </span>
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-[#1464C8] text-white rounded-br-xs'
                          : 'bg-white dark:bg-[#0D1D31] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}

                      {/* Quick Interactive Actions */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-1.5">
                          {msg.actions.map((act, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleActionClick(act.actionType)}
                              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer flex items-center gap-1 border border-blue-200/50 dark:border-blue-900/50"
                            >
                              <span>{act.label}</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <span className="text-[9px] text-slate-400 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {/* Agent Typing Indicator */}
                {isAgentTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0D1D31] py-2 px-3 rounded-2xl w-fit border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <span className="text-[11px] font-medium text-[#102B4E] dark:text-slate-300">Advisor is typing</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1464C8] animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1464C8] animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1464C8] animate-bounce [animation-delay:0.4s]"></span>
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions Pills (when thread is short) */}
              {messages.length <= 3 && (
                <div className="p-2.5 bg-white dark:bg-[#0A1727] border-t border-slate-200/80 dark:border-slate-800">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5 px-1">
                    Suggested Questions
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {SUGGESTED_QUESTIONS.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(q)}
                        className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-[#1464C8] dark:hover:text-[#B7E532] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 bg-white dark:bg-[#0A1727] border-t border-slate-200/80 dark:border-slate-800 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your question for support..."
                    className="flex-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#1464C8] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="w-9 h-9 rounded-xl bg-[#1464C8] hover:bg-[#1052a5] disabled:opacity-40 disabled:hover:bg-[#1464C8] text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-xs"
                    title="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 px-1">
                  <span>Fast live support & verified firm pairing</span>
                  <a
                    href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-600 dark:text-[#B7E532] font-semibold hover:underline flex items-center gap-1"
                  >
                    <MessageCircle className="w-3 h-3" />
                    Switch to WhatsApp
                  </a>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: DIRECT CONTACT & CALLBACK REQUEST */}
          {activeTab === 'contact' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 dark:bg-[#07111E] text-slate-800 dark:text-slate-100">
              
              {/* WhatsApp Priority Card */}
              <div className="bg-gradient-to-br from-[#102B4E] to-[#1464C8] text-white p-4 rounded-2xl shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#B7E532] uppercase tracking-wider flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    Instant WhatsApp Support Desk
                  </span>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full font-bold">
                    Active 24/7
                  </span>
                </div>
                <h4 className="font-extrabold text-sm text-white">
                  Chat Directly With Verified Consultants
                </h4>
                <p className="text-xs text-blue-100 leading-relaxed">
                  Connect on our official verified WhatsApp hotline for fast quotations, audit booking, or POS hardware delivery inquiries.
                </p>
                <a
                  href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello MsmeBooks, I am requesting direct assistance from support.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 w-full py-2.5 px-4 bg-[#B7E532] hover:bg-[#a6d729] text-[#102B4E] font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#102B4E]" />
                  <span>Launch WhatsApp (+234 915 848 2622)</span>
                </a>
              </div>

              {/* Direct Phone Lines */}
              <div className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold text-[#102B4E] dark:text-white flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-[#1464C8]" />
                  <span>Regional Telephone Support</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400">Nigeria (HQ)</div>
                    <a href="tel:+2349158482622" className="font-bold text-[#1464C8] dark:text-[#B7E532] hover:underline">
                      +234 915 848 2622
                    </a>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400">Ghana & West Africa</div>
                    <a href="tel:+2349158482622" className="font-bold text-[#1464C8] dark:text-[#B7E532] hover:underline">
                      +233 24 555 0192
                    </a>
                  </div>
                </div>
              </div>

              {/* Request an Advisor Callback Form */}
              <div className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="text-xs font-bold text-[#102B4E] dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#1464C8]" />
                  <span>Request an Advisor Callback</span>
                </div>

                {callbackSubmitted ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-1.5">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-[#B7E532] mx-auto" />
                    <div className="font-extrabold text-xs text-emerald-800 dark:text-emerald-200">
                      Callback Request Confirmed!
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      Our client lead will call <strong>{callbackPhone}</strong> regarding {callbackTopic} within 15 minutes.
                    </p>
                    <button
                      onClick={() => {
                        setCallbackSubmitted(false);
                        setCallbackPhone('');
                      }}
                      className="text-[11px] font-bold text-[#1464C8] dark:text-[#B7E532] underline pt-1 cursor-pointer"
                    >
                      Submit another request
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCallbackSubmit} className="space-y-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Your Full Name
                      </label>
                      <input
                        type="text"
                        value={callbackName}
                        onChange={(e) => setCallbackName(e.target.value)}
                        placeholder="e.g. Samuel Adebayo"
                        required
                        className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#1464C8]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Phone Number (with country code)
                      </label>
                      <input
                        type="tel"
                        value={callbackPhone}
                        onChange={(e) => setCallbackPhone(e.target.value)}
                        placeholder="+234 803 123 4567"
                        required
                        className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#1464C8]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                        Primary Topic
                      </label>
                      <select
                        value={callbackTopic}
                        onChange={(e) => setCallbackTopic(e.target.value)}
                        className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#1464C8]"
                      >
                        <option value="Accounting & Bookkeeping">Accounting & Monthly Retainers</option>
                        <option value="POS & Inventory Systems">POS Hardware & Inventory Rollout</option>
                        <option value="Tax Compliance & Audit">Corporate Tax Filing & Audit Defence</option>
                        <option value="Payroll & HR Systems">Payroll, PAYE & Statutory Pensions</option>
                        <option value="Custom Enterprise Solution">Custom Enterprise Integration</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-[#1464C8] hover:bg-[#1052a5] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Request Immediate Callback
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: QUICK HELP & FAQS */}
          {activeTab === 'faq' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60 dark:bg-[#07111E] text-slate-800 dark:text-slate-100">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search common questions & help..."
                  className="w-full pl-8.5 pr-3 py-2 text-xs bg-white dark:bg-[#0A1727] border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#1464C8]"
                />
              </div>

              {/* FAQs List */}
              <div className="space-y-2.5">
                {filteredFaqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-[#0A1727] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5"
                  >
                    <div className="font-bold text-xs text-[#102B4E] dark:text-white flex items-start gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532] shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>

              {/* Still need help CTA */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-center space-y-1">
                <div className="text-xs font-bold text-[#102B4E] dark:text-white">
                  Didn't find what you're looking for?
                </div>
                <button
                  onClick={() => setActiveTab('chat')}
                  className="text-xs font-extrabold text-[#1464C8] dark:text-[#B7E532] hover:underline cursor-pointer"
                >
                  Ask a live support advisor now →
                </button>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
