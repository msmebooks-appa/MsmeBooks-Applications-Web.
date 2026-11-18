import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Mail,
  Clock,
  CheckCheck,
  User,
  Headphones,
  ExternalLink,
  Search,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  Smile,
  Volume2,
  VolumeX,
  Calendar,
  Sparkles,
  WifiOff
} from 'lucide-react';
import { useConnection } from '../context/ConnectionContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface SupportMessage {
  id: string;
  sender: 'agent' | 'user' | 'system';
  agentName?: string;
  agentAvatar?: string;
  text: string;
  timestamp: string;
  quickActions?: { label: string; action: string }[];
}

interface SupportAgent {
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'away';
}

const SUPPORT_AGENTS: SupportAgent[] = [
  {
    name: 'Adaeze Okafor',
    role: 'Senior Accounting & Tax Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'online'
  },
  {
    name: 'Tunde Bakare',
    role: 'POS & Hardware Systems Lead',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'online'
  },
  {
    name: 'Amina Bello',
    role: 'SME Onboarding & Billing Consultant',
    avatar: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=150&auto=format&fit=crop&q=80',
    status: 'online'
  }
];

const INITIAL_FAQS = [
  {
    id: 'f1',
    question: 'Does the MsmeBooks POS work offline when internet is interrupted?',
    category: 'POS & Hardware',
    answer:
      'Yes! MsmeBooks POS includes built-in offline caching. Your cashiers can continue ringing up sales, scanning barcodes, and printing receipts even if your store internet drops. All transactions automatically sync to your cloud inventory and general ledger as soon as connectivity resumes.'
  },
  {
    id: 'f2',
    question: 'How do I track inventory across multiple branches or warehouses?',
    category: 'Inventory',
    answer:
      'MsmeBooks provides centralized multi-location inventory management. You can set individual reorder thresholds for each branch, generate inter-store stock transfer notes, and view real-time stock balances across all locations from your central dashboard.'
  },
  {
    id: 'f3',
    question: 'Can MsmeBooks generate FIRS VAT, WHT, and local tax schedules?',
    category: 'Tax & Compliance',
    answer:
      'Absolutely. MsmeBooks automates local African tax calculations (VAT, WHT, CIT) based on compliant tax brackets. You can export complete FIRS-compliant tax schedules and audit-ready reports in one click with zero manual spreadsheet entry.'
  },
  {
    id: 'f4',
    question: 'How long does it take to migrate from Excel or legacy accounting software?',
    category: 'Onboarding',
    answer:
      'Our team provides complimentary migration assistance. You can upload standard Excel/CSV templates of your Chart of Accounts, Customers, Vendors, and Product Catalogs in under 15 minutes, or our dedicated onboarding agents can handle it for you.'
  },
  {
    id: 'f5',
    question: 'What are the official customer support hours for phone and live chat?',
    category: 'General',
    answer:
      'Our live agent chat and phone hotline (+2349158482622) operate Monday through Saturday from 8:00 AM to 7:00 PM West Africa Time (WAT). For urgent POS or payment escalations, our emergency team provides extended coverage.'
  }
];

interface LiveChatProps {
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  onOpenAIAssistant?: () => void;
}

export const LiveChat: React.FC<LiveChatProps> = ({
  isOpen: controlledIsOpen,
  onToggle,
  onOpenAIAssistant
}) => {
  const { isOnline } = useConnection();
  const { dict } = useLanguage();
  const { formatFromUSD, currentCurrencyInfo } = useCurrency();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsOpen = (open: boolean) => {
    if (onToggle) {
      onToggle(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const [activeTab, setActiveTab] = useState<'chat' | 'channels' | 'faqs' | 'ticket'>('chat');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasUnread, setHasUnread] = useState(false);
  const [showProactiveBadge, setShowProactiveBadge] = useState(false);

  // Live Chat state
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'm-welcome',
      sender: 'agent',
      agentName: 'Adaeze Okafor',
      agentAvatar: SUPPORT_AGENTS[0].avatar,
      text: "Hello! Welcome to MsmeBooks Live Support. I'm Adaeze from our Lagos support desk. How can our team help your business today?",
      timestamp: 'Just now',
      quickActions: [
        { label: 'POS & Hardware Setup', action: 'pos_setup' },
        { label: 'Multi-store Inventory', action: 'inventory_help' },
        { label: 'Tax & VAT Reports', action: 'tax_help' },
        { label: 'Talk to an Agent', action: 'agent_call' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Callback form state
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackTime, setCallbackTime] = useState('Immediate / Next available agent');
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  // Ticket form state
  const [ticketName, setTicketName] = useState('');
  const [ticketEmail, setTicketEmail] = useState('');
  const [ticketCategory, setTicketCategory] = useState('Accounting & Bookkeeping');
  const [ticketPriority, setTicketPriority] = useState('Medium');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  // FAQ search state
  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Show a gentle proactive greeting after 4 seconds if not opened
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setShowProactiveBadge(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowProactiveBadge(false);
      setHasUnread(false);
      scrollToBottom();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      // Subtle synthetic audio notification
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.26);
    } catch {
      // Audio context might be restricted before interaction
    }
  };

  const handleSendMessage = (customText?: string) => {
    const textToSend = (customText || inputValue).trim();
    if (!textToSend) return;

    const userMsg: SupportMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    scrollToBottom();

    // Simulate Agent Typing & Realistic response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const agentResponse = generateAgentReply(textToSend);
      const newAgentMsg: SupportMessage = {
        id: `agt-${Date.now()}`,
        sender: 'agent',
        agentName: 'Adaeze Okafor',
        agentAvatar: SUPPORT_AGENTS[0].avatar,
        text: agentResponse.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickActions: agentResponse.quickActions
      };
      setMessages((prev) => [...prev, newAgentMsg]);
      playNotificationSound();
      scrollToBottom();
    }, 1200);
  };

  const generateAgentReply = (userText: string): { text: string; quickActions?: { label: string; action: string }[] } => {
    const lower = userText.toLowerCase();

    if (lower.includes('pos') || lower.includes('till') || lower.includes('barcode') || lower.includes('receipt') || lower.includes('hardware')) {
      return {
        text: "Our POS specialists can configure MsmeBooks to integrate seamlessly with your thermal receipt printers, barcode scanners, and cash drawers. It also supports offline checkout mode.\n\nWould you like our hardware engineer Tunde to assist you directly, or should we send the hardware compatibility checklist?",
        quickActions: [
          { label: 'Call Support (+2349158482622)', action: 'phone_call' },
          { label: 'Chat on WhatsApp', action: 'whatsapp' },
          { label: 'View POS FAQs', action: 'view_pos_faq' }
        ]
      };
    }

    if (lower.includes('tax') || lower.includes('vat') || lower.includes('wht') || lower.includes('firs') || lower.includes('audit')) {
      return {
        text: "MsmeBooks is built specifically around African SME tax compliance (including Nigeria FIRS VAT and WHT schedules). The system calculates correct deductions on invoices and expenses automatically.\n\nI can help you review your tax settings or schedule a free 15-minute tax setup walk-through with our accounting team.",
        quickActions: [
          { label: 'Schedule Tax Setup Walk-through', action: 'callback' },
          { label: 'Call +2349158482622', action: 'phone_call' }
        ]
      };
    }

    if (lower.includes('inventory') || lower.includes('stock') || lower.includes('warehouse') || lower.includes('shrinkage') || lower.includes('loss')) {
      return {
        text: "Inventory control is one of MsmeBooks' strongest modules. It features real-time stock deductions on POS checkout, batch/expiry tracking, low-stock WhatsApp/email alerts, and multi-location branch transfers.\n\nWould you like a live demo of the inventory module or help importing your current product list?",
        quickActions: [
          { label: 'Request Product Import Help', action: 'ticket' },
          { label: 'Chat on WhatsApp', action: 'whatsapp' }
        ]
      };
    }

    if (lower.includes('price') || lower.includes('cost') || lower.includes('plan') || lower.includes('free') || lower.includes('trial')) {
      return {
        text: `MsmeBooks offers a completely free 14-day trial with all premium features unlocked — no credit card required. Our SME starter plans begin at just ${formatFromUSD(15)}/month (${currentCurrencyInfo.code}) tailored for African & global entrepreneurs with full POS, cloud inventory, and double-entry accounting.\n\nWould you like me to connect you with Amina from our Onboarding team to discuss custom pricing for your branches?`,
        quickActions: [
          { label: 'Talk to Billing & Onboarding', action: 'callback' },
          { label: 'Start Free Trial on Website', action: 'website' }
        ]
      };
    }

    if (lower.includes('phone') || lower.includes('call') || lower.includes('speak') || lower.includes('human') || lower.includes('agent')) {
      return {
        text: "You can reach our live support line immediately at +2349158482622. Our agents are at the desk and ready to assist you right now!\n\nYou can also click the button below to dial directly or message us on WhatsApp.",
        quickActions: [
          { label: 'Call +2349158482622', action: 'phone_call' },
          { label: 'Message on WhatsApp', action: 'whatsapp' }
        ]
      };
    }

    return {
      text: `Thank you for sharing that! I have logged this with our support team. An MsmeBooks specialist is reviewing your inquiry right now.\n\nIn the meantime, feel free to give us a direct call at +2349158482622 or message our priority WhatsApp desk if you need immediate resolution.`,
      quickActions: [
        { label: 'Call +2349158482622', action: 'phone_call' },
        { label: 'WhatsApp Priority Support', action: 'whatsapp' },
        { label: 'View Knowledge Base', action: 'view_faq' }
      ]
    };
  };

  const handleQuickAction = (action: string) => {
    if (action === 'pos_setup') {
      handleSendMessage('I need help setting up the POS and barcode scanner for my store.');
    } else if (action === 'inventory_help') {
      handleSendMessage('How do I track stock and prevent inventory shrinkage across multiple shops?');
    } else if (action === 'tax_help') {
      handleSendMessage('How does MsmeBooks generate FIRS VAT and Withholding Tax schedules?');
    } else if (action === 'agent_call' || action === 'phone_call') {
      window.location.href = 'tel:+2349158482622';
    } else if (action === 'whatsapp') {
      window.open('https://wa.me/2349158482622?text=Hello%20MsmeBooks%20Support%2C%20I%20need%20help%20with%20my%20business', '_blank');
    } else if (action === 'callback') {
      setActiveTab('channels');
    } else if (action === 'ticket') {
      setActiveTab('ticket');
    } else if (action === 'view_pos_faq' || action === 'view_faq') {
      setActiveTab('faqs');
    } else if (action === 'website') {
      window.open('https://www.msmebooks.org', '_blank');
    }
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone.trim()) return;
    setCallbackSubmitted(true);
    setTimeout(() => {
      // Reset after showing confirmation
    }, 4000);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketName || !ticketEmail || !ticketMessage) return;
    const ticketId = `MB-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedTicketId(ticketId);
    setTicketSubmitted(true);
  };

  const filteredFaqs = INITIAL_FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
      faq.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <>
      {/* Proactive Floating Greeting Callout (when minimized) */}
      {!isOpen && showProactiveBadge && (
        <div className="fixed bottom-24 right-6 z-40 max-w-xs bg-white dark:bg-[#0E2443] p-3.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-start gap-2.5">
            <div className="relative shrink-0">
              <img
                src={SUPPORT_AGENTS[0].avatar}
                alt={SUPPORT_AGENTS[0].name}
                className="w-9 h-9 rounded-full object-cover border border-lime-400"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-lime-400 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Adaeze Okafor</span>
                <button
                  onClick={() => setShowProactiveBadge(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Dismiss greeting"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                Need help with Accounting, POS, or Inventory? Chat with our team!
              </p>
              <button
                onClick={() => {
                  setShowProactiveBadge(false);
                  setIsOpen(true);
                }}
                className="mt-2 text-[11px] font-bold text-blue-900 dark:text-lime-400 hover:underline flex items-center gap-1"
              >
                <span>Start Live Chat</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating 'Live Chat' Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-blue-900 hover:bg-blue-950 dark:bg-[#0B1E36] dark:hover:bg-[#0E2443] text-white shadow-2xl border-2 border-lime-400 hover:border-lime-300 transition-all hover:scale-105 active:scale-95 group cursor-pointer focus:outline-none focus:ring-4 focus:ring-lime-400/30"
            aria-label="Open MsmeBooks Live Chat Support"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center font-bold shadow-md transition-transform group-hover:rotate-6">
                <Headphones className="w-5 h-5 text-slate-950" />
              </div>
              {/* Online/Offline Pulsing Beacon */}
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isOnline ? 'bg-lime-400' : 'bg-amber-400'} opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? 'bg-lime-400' : 'bg-amber-400'} border border-slate-950`}></span>
              </span>
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
                <span>{dict.liveChat.chatTab}</span>
                <span className={`text-[10px] uppercase px-1.5 py-0.5 rounded-full ${isOnline ? 'bg-lime-400 text-slate-950' : 'bg-amber-400 text-slate-950'} font-extrabold tracking-wider`}>
                  {isOnline ? dict.connection.online : dict.connection.offline}
                </span>
              </div>
              <div className={`text-[11px] ${isOnline ? 'text-lime-300' : 'text-amber-300'} font-medium`}>
                {isOnline ? dict.liveChat.agentOnline : dict.connection.offlineMode}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Help Dialog Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="live-chat-header"
          aria-modal="true"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[95vw] sm:w-[440px] h-[640px] max-h-[88vh] bg-white dark:bg-[#0B1E36] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          {/* Header */}
          <div className="p-4 bg-blue-950 dark:bg-[#050E1A] text-white flex items-center justify-between border-b border-blue-900/50 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {/* Stacked Agent Avatars */}
              <div className="flex -space-x-2 shrink-0">
                {SUPPORT_AGENTS.map((agent, i) => (
                  <img
                    key={i}
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-8 h-8 rounded-full border-2 border-blue-950 dark:border-[#050E1A] object-cover"
                    title={`${agent.name} (${agent.role})`}
                  />
                ))}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 id="live-chat-header" className="text-sm font-bold text-white flex items-center gap-1.5">
                    MsmeBooks Support
                  </h3>
                  <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-lime-400 text-slate-950 font-extrabold">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-lime-400" />
                  Typically replies in &lt; 3 mins
                </p>
              </div>
            </div>

            {/* Header action controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                title={soundEnabled ? 'Mute notification sound' : 'Unmute sound'}
                aria-label="Toggle sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close live chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-slate-100 dark:bg-[#071527] px-2 pt-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2 px-1 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'chat'
                  ? 'border-blue-900 dark:border-lime-400 text-blue-950 dark:text-lime-300 font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('channels')}
              className={`flex-1 py-2 px-1 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'channels'
                  ? 'border-blue-900 dark:border-lime-400 text-blue-950 dark:text-lime-300 font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call / Hotline</span>
            </button>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`flex-1 py-2 px-1 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'faqs'
                  ? 'border-blue-900 dark:border-lime-400 text-blue-950 dark:text-lime-300 font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>FAQs</span>
            </button>

            <button
              onClick={() => setActiveTab('ticket')}
              className={`flex-1 py-2 px-1 text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'ticket'
                  ? 'border-blue-900 dark:border-lime-400 text-blue-950 dark:text-lime-300 font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Submit Ticket</span>
            </button>
          </div>

          {/* TAB 1: LIVE CHAT */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-[#071527]">
              {/* Agent Announcement Banner */}
              <div className="px-4 py-2 bg-blue-50 dark:bg-[#0E2443] border-b border-blue-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-950 dark:text-blue-100">
                <span className="flex items-center gap-1.5 font-medium truncate">
                  <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-lime-500' : 'bg-amber-500'} shrink-0`} />
                  {isOnline ? 'Connected to MsmeBooks Lagos Helpdesk' : 'Offline Mode • Local Cache Active'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
                  Hotline: +2349158482622
                </span>
              </div>

              {!isOnline && (
                <div className="px-4 py-2 bg-amber-500/15 border-b border-amber-500/30 text-[11px] text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 animate-pulse" />
                  <span>
                    You are offline. Live responses will resume upon reconnection. You can call directly or browse offline FAQs anytime.
                  </span>
                </div>
              )}

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => {
                  const isAgent = m.sender === 'agent';
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${isAgent ? 'justify-start' : 'justify-end'}`}
                    >
                      {isAgent && (
                        <div className="relative shrink-0 mt-0.5">
                          <img
                            src={m.agentAvatar || SUPPORT_AGENTS[0].avatar}
                            alt={m.agentName || 'Agent'}
                            className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                          />
                          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-lime-400 ring-1 ring-white dark:ring-slate-900" />
                        </div>
                      )}

                      <div className={`max-w-[84%] flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}>
                        {isAgent && (
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 pl-1">
                            {m.agentName} • Support
                          </span>
                        )}

                        <div
                          className={`rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                            isAgent
                              ? 'bg-white dark:bg-[#0E2443] text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-tl-xs'
                              : 'bg-blue-900 dark:bg-lime-400 text-white dark:text-slate-950 font-medium rounded-br-xs'
                          }`}
                        >
                          {m.text}
                        </div>

                        {/* Quick action chips if available */}
                        {m.quickActions && m.quickActions.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {m.quickActions.map((qa, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleQuickAction(qa.action)}
                                className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-[#0E2443] border border-blue-200 dark:border-slate-700 text-blue-900 dark:text-lime-300 hover:bg-lime-400 hover:text-slate-950 dark:hover:bg-lime-400 dark:hover:text-slate-950 hover:border-lime-500 transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                              >
                                {qa.label}
                                <ChevronRight className="w-2.5 h-2.5" />
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-1 mt-1 px-1">
                          <span className="text-[9px] text-slate-400">{m.timestamp}</span>
                          {!isAgent && <CheckCheck className="w-3 h-3 text-blue-600 dark:text-lime-400" />}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Agent Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-2.5 items-end">
                    <img
                      src={SUPPORT_AGENTS[0].avatar}
                      alt="Agent typing"
                      className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-700"
                    />
                    <div className="bg-white dark:bg-[#0E2443] border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 flex items-center gap-1.5 shadow-xs">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Adaeze is typing</span>
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-bounce" />
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-white dark:bg-[#0B1E36] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type a message to our support agents..."
                  className="flex-1 bg-slate-50 dark:bg-[#0E2443] px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-xs"
                  aria-label="Send message to live support"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: DIRECT CHANNELS / CALL HOTLINE */}
          {activeTab === 'channels' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-[#071527]">
              <div className="bg-white dark:bg-[#0E2443] rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-[#132F55] text-blue-900 dark:text-lime-400 flex items-center justify-center font-bold shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Official Phone Hotline
                    </span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      +234 915 848 2622
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Mon – Sat: 8:00 AM – 7:00 PM WAT
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <a
                    href="tel:+2349158482622"
                    className="flex-1 py-2 px-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Hotline Now</span>
                  </a>
                  <a
                    href="https://wa.me/2349158482622?text=Hello%20MsmeBooks%20Support%2C%20I%20would%20like%20assistance%20with%20my%20business"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>WhatsApp</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Email Support Card */}
              <div className="bg-white dark:bg-[#0E2443] rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-lime-100 dark:bg-[#132F55] text-slate-950 dark:text-lime-400 flex items-center justify-center font-bold shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Email Help Desk
                    </span>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      support@msmebooks.org
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Written response within 2 hours
                    </p>
                  </div>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                  <a
                    href="mailto:support@msmebooks.org?subject=Support%20Request%20-%20MsmeBooks"
                    className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#132F55] text-slate-900 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Email to Support</span>
                  </a>
                </div>
              </div>

              {/* Request an Agent Callback Form */}
              <div className="bg-white dark:bg-[#0E2443] rounded-2xl p-4 border border-slate-200 dark:border-slate-700 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  Request a Dedicated Agent Callback
                </h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3">
                  Too busy to wait on hold? Leave your number and our lead specialist will call you.
                </p>

                {callbackSubmitted ? (
                  <div className="bg-lime-50 dark:bg-lime-950/40 border border-lime-200 dark:border-lime-800 rounded-xl p-3.5 text-center animate-in fade-in">
                    <CheckCircle2 className="w-6 h-6 text-lime-600 dark:text-lime-400 mx-auto mb-1.5" />
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Callback Request Confirmed!</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                      Our specialist will ring you at <strong className="text-blue-900 dark:text-lime-400">{callbackPhone}</strong> ({callbackTime}).
                    </p>
                    <button
                      onClick={() => {
                        setCallbackSubmitted(false);
                        setCallbackPhone('');
                        setCallbackName('');
                      }}
                      className="mt-2.5 text-[10px] font-bold text-blue-900 dark:text-lime-400 underline"
                    >
                      Request another callback
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCallbackSubmit} className="space-y-2.5">
                    <div>
                      <input
                        type="text"
                        value={callbackName}
                        onChange={(e) => setCallbackName(e.target.value)}
                        placeholder="Your Name / Business Name"
                        className="w-full bg-slate-50 dark:bg-[#071527] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={callbackPhone}
                        onChange={(e) => setCallbackPhone(e.target.value)}
                        placeholder="Phone Number (e.g. +234 80...)"
                        className="w-full bg-slate-50 dark:bg-[#071527] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                        required
                      />
                    </div>
                    <div>
                      <select
                        value={callbackTime}
                        onChange={(e) => setCallbackTime(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#071527] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                      >
                        <option value="Immediate / Next available agent">Immediate / Next available agent</option>
                        <option value="Today: Morning (9:00 AM - 12:00 PM)">Today: Morning (9:00 AM - 12:00 PM)</option>
                        <option value="Today: Afternoon (1:00 PM - 5:00 PM)">Today: Afternoon (1:00 PM - 5:00 PM)</option>
                        <option value="Tomorrow Morning">Tomorrow Morning</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 px-3 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs transition-colors shadow-xs"
                    >
                      Book Free Callback
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SEARCHABLE FAQS */}
          {activeTab === 'faqs' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-[#071527] p-4">
              {/* Search Field */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search answers on POS, accounting, tax..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#0E2443] border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                />
              </div>

              {/* FAQ Accordion List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      No matching answers found for &quot;{faqSearch}&quot;.
                    </p>
                    <button
                      onClick={() => {
                        setActiveTab('chat');
                        handleSendMessage(`I have a question about: ${faqSearch}`);
                      }}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-blue-900 dark:bg-lime-400 text-white dark:text-slate-950 text-xs font-bold"
                    >
                      Ask Live Support Agent
                    </button>
                  </div>
                ) : (
                  filteredFaqs.map((faq) => {
                    const isExpanded = expandedFaq === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="bg-white dark:bg-[#0E2443] rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xs"
                      >
                        <button
                          onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                          className="w-full p-3 text-left flex items-start justify-between gap-2 hover:bg-slate-50/70 dark:hover:bg-[#132F55] transition-colors"
                        >
                          <div>
                            <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded bg-blue-50 dark:bg-[#0B1E36] text-blue-800 dark:text-lime-400 mb-1">
                              {faq.category}
                            </span>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                              {faq.question}
                            </h5>
                          </div>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform shrink-0 mt-1 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="p-3 pt-0 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/50 dark:bg-[#0B1E36]/40">
                            <p>{faq.answer}</p>
                            <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400">Was this helpful?</span>
                              <button
                                onClick={() => {
                                  setActiveTab('chat');
                                  handleSendMessage(`I need more clarification on: "${faq.question}"`);
                                }}
                                className="text-[10px] font-bold text-blue-900 dark:text-lime-400 hover:underline"
                              >
                                Need more help? Ask an agent &rarr;
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 4: SUBMIT SUPPORT TICKET */}
          {activeTab === 'ticket' && (
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50 dark:bg-[#071527]">
              {ticketSubmitted ? (
                <div className="bg-white dark:bg-[#0E2443] rounded-2xl p-6 border border-slate-200 dark:border-slate-700 text-center animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-lime-100 dark:bg-lime-950/60 text-lime-600 dark:text-lime-400 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">Support Ticket Submitted!</h4>
                  <p className="text-xs font-mono font-bold text-blue-900 dark:text-lime-400 mt-1">
                    Ticket ID: #{generatedTicketId}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    We have emailed a confirmation to <strong>{ticketEmail}</strong>. An MsmeBooks tier-2 support engineer is reviewing your case and will respond within 4 hours.
                  </p>
                  <div className="mt-5 flex gap-2 justify-center">
                    <button
                      onClick={() => {
                        setTicketSubmitted(false);
                        setTicketMessage('');
                      }}
                      className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs transition-colors"
                    >
                      Submit Another Inquiry
                    </button>
                    <button
                      onClick={() => setActiveTab('chat')}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#0B1E36] hover:bg-slate-200 text-slate-900 dark:text-white font-bold text-xs transition-colors"
                    >
                      Return to Chat
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleTicketSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={ticketName}
                      onChange={(e) => setTicketName(e.target.value)}
                      placeholder="e.g. Babatunde Lawal"
                      required
                      className="w-full bg-white dark:bg-[#0E2443] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Business Email Address *
                    </label>
                    <input
                      type="email"
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      placeholder="e.g. owner@mybusiness.com"
                      required
                      className="w-full bg-white dark:bg-[#0E2443] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Category
                      </label>
                      <select
                        value={ticketCategory}
                        onChange={(e) => setTicketCategory(e.target.value)}
                        className="w-full bg-white dark:bg-[#0E2443] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                      >
                        <option value="Accounting & Bookkeeping">Accounting & Bookkeeping</option>
                        <option value="POS & Till Setup">POS & Till Setup</option>
                        <option value="Inventory Multi-Store">Inventory Multi-Store</option>
                        <option value="Tax & FIRS Schedules">Tax & FIRS Schedules</option>
                        <option value="Billing & Subscription">Billing & Subscription</option>
                        <option value="Hardware Integration">Hardware Integration</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                        Priority Level
                      </label>
                      <select
                        value={ticketPriority}
                        onChange={(e) => setTicketPriority(e.target.value)}
                        className="w-full bg-white dark:bg-[#0E2443] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                      >
                        <option value="Low">Low - General inquiry</option>
                        <option value="Medium">Medium - Regular support</option>
                        <option value="High">High - Operations affected</option>
                        <option value="Urgent">Urgent - Store POS down</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                      Detailed Issue Description *
                    </label>
                    <textarea
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      rows={3}
                      placeholder="Please describe what you are experiencing or what configuration assistance you need..."
                      required
                      className="w-full bg-white dark:bg-[#0E2443] px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Generate Support Ticket</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Footer Info Strip */}
          <div className="px-4 py-2 bg-slate-100 dark:bg-[#050E1A] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
              MsmeBooks Support • 256-bit Encrypted
            </span>
            <span>www.msmebooks.org</span>
          </div>
        </div>
      )}
    </>
  );
};
