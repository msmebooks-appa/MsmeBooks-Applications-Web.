import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareText,
  X,
  Send,
  Phone,
  PhoneCall,
  Mail,
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Paperclip,
  Smile,
  Volume2,
  VolumeX,
  RotateCcw,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
  UserCheck,
  HelpCircle,
  Building2,
  MapPin,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  FileText,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Partner } from '../types';
import { PARTNERS_DATA } from '../data/partnersData';

interface SupportAgent {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'online' | 'busy' | 'away';
  location: string;
  specialty: string;
}

const SUPPORT_AGENTS: SupportAgent[] = [
  {
    id: 'agent-1',
    name: 'Amina Osei',
    role: 'Senior Partner Concierge Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    location: 'Lagos & West Africa Desk',
    specialty: 'SME Matching & Scope Advisory'
  },
  {
    id: 'agent-2',
    name: 'Kwame Mensah',
    role: 'Technical Implementation Specialist',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    location: 'Nairobi & East Africa Desk',
    specialty: 'POS Hardware & ERP Migrations'
  },
  {
    id: 'agent-3',
    name: 'Zainab Diallo',
    role: 'Partner Accreditation & Onboarding',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    status: 'online',
    location: 'Accra & Global Diaspora Desk',
    specialty: 'Partner Certification & Billing'
  }
];

interface SupportMessage {
  id: string;
  sender: 'agent' | 'user' | 'system';
  agentName?: string;
  agentAvatar?: string;
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: string; payload?: any }[];
  partnerRecommendations?: Partner[];
  attachmentName?: string;
  isCallbackCard?: boolean;
}

interface FAQItem {
  id: string;
  question: string;
  category: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Matching',
    question: 'How do I choose the right verified partner for my business?',
    answer: 'Every partner in our directory is vetted for business registration, MsmeBooks product certification, and completed client deployments. You can filter by Country, Industry (e.g. Retail POS, Healthcare Pharmacy, Manufacturing), and Budget. You can also chat with our concierge team here to receive 2-3 tailored recommendations within minutes.'
  },
  {
    id: 'faq-2',
    category: 'Pricing',
    question: 'Is it free to request quotes and match with partners?',
    answer: 'Yes, 100% free! MsmeBooks does not charge businesses any fee to browse our directory, request discovery consultations, or receive implementation proposals. Partner fees are agreed directly with the partner based on transparent starting budgets.'
  },
  {
    id: 'faq-3',
    category: 'Escrow & Guarantee',
    question: 'How are client payments and project milestones protected?',
    answer: 'Platinum and Gold partners adhere to our Verified Service SLA. Project scopes are divided into clear deliverables (e.g. Chart of Accounts setup, hardware deployment, staff training, go-live signoff). If you encounter any friction, our Support Concierge mediates to ensure successful completion.'
  },
  {
    id: 'faq-4',
    category: 'Partner Program',
    question: 'How do I apply to become a certified MsmeBooks Partner?',
    answer: 'Accounting firms, IT consultancies, and POS hardware distributors can apply via our "Become a Partner" portal. Requirements include passing the MsmeBooks technical assessment, submitting proof of business registration, and completing our 5-day onboarding bootcamp.'
  },
  {
    id: 'faq-5',
    category: 'Technical & Hardware',
    question: 'Can partners assist with physical POS hardware and fiscal printers?',
    answer: 'Yes! Certified POS specialists can provide complete hardware bundles (touch terminals, receipt printers, barcode scanners, cash drawers, and TIMS/FIRS fiscal devices) along with on-site installation and staff training in their primary coverage areas.'
  }
];

interface LiveSupportChatProps {
  onSelectPartner?: (partner: Partner) => void;
  onContactPartner?: (partner: Partner) => void;
  onRequestConsultation?: (partner: Partner) => void;
  onOpenBecomePartner?: () => void;
  onScrollToDirectory?: () => void;
}

export const LiveSupportChat: React.FC<LiveSupportChatProps> = ({
  onSelectPartner,
  onContactPartner,
  onRequestConsultation,
  onOpenBecomePartner,
  onScrollToDirectory
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'contact' | 'faq'>('chat');
  const [hasUnread, setHasUnread] = useState<boolean>(true);
  const [showTeaser, setShowTeaser] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Chat State
  const [inputText, setInputText] = useState<string>('');
  const [isAgentTyping, setIsAgentTyping] = useState<boolean>(false);
  const [activeAgent, setActiveAgent] = useState<SupportAgent>(SUPPORT_AGENTS[0]);
  const [attachment, setAttachment] = useState<string | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  
  // Direct Contact Callback Form
  const [callbackName, setCallbackName] = useState<string>('');
  const [callbackPhone, setCallbackPhone] = useState<string>('');
  const [callbackCountry, setCallbackCountry] = useState<string>('Nigeria');
  const [callbackNotes, setCallbackNotes] = useState<string>('');
  const [callbackSubmitted, setCallbackSubmitted] = useState<boolean>(false);

  // Email Ticket Form
  const [ticketName, setTicketName] = useState<string>('');
  const [ticketEmail, setTicketEmail] = useState<string>('');
  const [ticketCategory, setTicketCategory] = useState<string>('Partner Matching');
  const [ticketMessage, setTicketMessage] = useState<string>('');
  const [ticketSubmittedId, setTicketSubmittedId] = useState<string | null>(null);

  // FAQ search & open state
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial messages
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'msg-welcome-1',
      sender: 'agent',
      agentName: 'Amina Osei',
      agentAvatar: SUPPORT_AGENTS[0].avatar,
      text: `Hello! 👋 Welcome to MsmeBooks Partner Concierge.\n\nI'm **Amina** from our partner desk. Whether you need a certified accountant in your city, POS hardware rollout, or want to join as a partner, our team is live to assist you!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        { label: '🔍 Find a partner for my business', action: 'find_partner' },
        { label: '⚡ Request urgent phone callback', action: 'request_callback' },
        { label: '🚀 Join as a certified partner', action: 'join_partner' },
        { label: '💳 Pricing & project guarantees', action: 'ask_pricing' }
      ]
    }
  ]);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, activeTab, isAgentTyping]);

  // Audio notification beep using Web Audio API
  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      // Audio might be restricted by browser autoplay policy
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setHasUnread(false);
    setShowTeaser(false);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!text && !attachment) return;

    const userMsg: SupportMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text || `[Attached: ${attachment}]`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachmentName: attachment || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachment(null);
    setIsAgentTyping(true);

    // Realistic Agent Response simulation
    setTimeout(() => {
      generateAgentResponse(text);
      setIsAgentTyping(false);
      playNotificationSound();
    }, 1100);
  };

  const generateAgentResponse = (userText: string) => {
    const lower = userText.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Partner Finding / Recommendation
    if (lower.includes('find') || lower.includes('partner') || lower.includes('match') || lower.includes('accountant') || lower.includes('pos') || lower.includes('erp') || lower.includes('retail') || lower.includes('pharmacy') || lower.includes('kenya') || lower.includes('nigeria') || lower.includes('ghana') || lower.includes('south africa') || lower.includes('lagos') || lower.includes('nairobi')) {
      
      // Filter partners based on query keywords
      let matched = PARTNERS_DATA.filter(p => {
        if (lower.includes('kenya') || lower.includes('nairobi')) return p.country === 'Kenya';
        if (lower.includes('nigeria') || lower.includes('lagos')) return p.country === 'Nigeria';
        if (lower.includes('ghana') || lower.includes('accra')) return p.country === 'Ghana';
        if (lower.includes('south africa') || lower.includes('johannesburg')) return p.country === 'South Africa';
        if (lower.includes('pos')) return p.specialties.some(s => s.toLowerCase().includes('pos')) || p.partnerType.toLowerCase().includes('pos');
        if (lower.includes('tax') || lower.includes('audit')) return p.specialties.some(s => s.toLowerCase().includes('tax') || s.toLowerCase().includes('audit'));
        return true;
      });

      if (matched.length === 0) {
        matched = PARTNERS_DATA.slice(0, 3);
      } else {
        matched = matched.slice(0, 3);
      }

      const agentReply: SupportMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        agentName: activeAgent.name,
        agentAvatar: activeAgent.avatar,
        text: `I pulled **${matched.length} certified partners** ready to support your business right away. Each one has verified credentials and active capacity:`,
        timestamp: time,
        partnerRecommendations: matched,
        suggestedActions: [
          { label: '⚡ Request a call with our team', action: 'request_callback' },
          { label: '📋 Browse full directory table', action: 'view_directory' },
          { label: '💬 Ask another question', action: 'another_question' }
        ]
      };

      setMessages(prev => [...prev, agentReply]);
      return;
    }

    // 2. Urgent Phone Callback Request
    if (lower.includes('call') || lower.includes('phone') || lower.includes('urgent') || lower.includes('speak') || lower.includes('human')) {
      const agentReply: SupportMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        agentName: 'Kwame Mensah',
        agentAvatar: SUPPORT_AGENTS[1].avatar,
        text: `I can arrange an immediate priority callback for you! Our average ring time is under **5 minutes** during business hours. Please confirm your contact details below:`,
        timestamp: time,
        isCallbackCard: true,
        suggestedActions: [
          { label: '📱 Open Direct WhatsApp Chat', action: 'open_whatsapp' },
          { label: '📞 View Regional Hotlines', action: 'view_hotlines' }
        ]
      };
      setMessages(prev => [...prev, agentReply]);
      return;
    }

    // 3. Joining as a Partner
    if (lower.includes('join') || lower.includes('become') || lower.includes('apply') || lower.includes('commission') || lower.includes('certif')) {
      const agentReply: SupportMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        agentName: 'Zainab Diallo',
        agentAvatar: SUPPORT_AGENTS[2].avatar,
        text: `We're actively onboarding accounting firms, IT integrators, and POS hardware distributors across 14+ countries!\n\n**Key Partner Benefits:**\n• Earn **15% to 40% recurring revenue share**.\n• Access verified pre-qualified SME leads directly from MsmeBooks.\n• Complete technical certification & co-marketing support.\n\nWould you like me to open the direct application form for you now?`,
        timestamp: time,
        suggestedActions: [
          { label: '🚀 Open Partner Application Form', action: 'open_become_partner_modal' },
          { label: '📞 Book Onboarding Briefing Call', action: 'request_callback' }
        ]
      };
      setMessages(prev => [...prev, agentReply]);
      return;
    }

    // 4. Pricing / Guarantees
    if (lower.includes('price') || lower.includes('cost') || lower.includes('guarantee') || lower.includes('escrow') || lower.includes('fee')) {
      const agentReply: SupportMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        agentName: activeAgent.name,
        agentAvatar: activeAgent.avatar,
        text: `Here is how pricing & guarantees work on the MsmeBooks Partner Network:\n\n1. **Zero Client Matching Fee:** Searching, comparing, and consulting partners is 100% free.\n2. **Transparent Partner Budgets:** Partner packages start as low as **$350** for micro-businesses up to enterprise deployments.\n3. **Milestone SLA:** Payments are tied to deliverables (Setup, Training, Go-Live) with our team assisting if any disputes arise.\n\nWould you like me to match you with a partner within a specific budget?`,
        timestamp: time,
        suggestedActions: [
          { label: '💰 Budget under $500', action: 'budget_under_500' },
          { label: '💼 Mid-Range ($500 - $1.5k)', action: 'budget_mid' },
          { label: '🏢 Enterprise Migration ($1.5k+)', action: 'budget_enterprise' }
        ]
      };
      setMessages(prev => [...prev, agentReply]);
      return;
    }

    // 5. Default Friendly Support Reply
    const agentReply: SupportMessage = {
      id: `agent-${Date.now()}`,
      sender: 'agent',
      agentName: activeAgent.name,
      agentAvatar: activeAgent.avatar,
      text: `Thanks for reaching out! I've noted that inquiry for our partner desk. \n\nOur team can help you find verified implementation specialists, answer technical questions, or connect you with our regional leads in Kenya, Nigeria, Ghana, Rwanda, and South Africa.`,
      timestamp: time,
      suggestedActions: [
        { label: '🔍 Find a verified partner', action: 'find_partner' },
        { label: '⚡ Request a callback', action: 'request_callback' },
        { label: '📞 Contact via WhatsApp', action: 'open_whatsapp' }
      ]
    };
    setMessages(prev => [...prev, agentReply]);
  };

  const handleActionClick = (action: string) => {
    if (action === 'find_partner') {
      handleSendMessage('Please help me find a certified partner for my business');
    } else if (action === 'request_callback') {
      setActiveTab('contact');
    } else if (action === 'join_partner') {
      handleSendMessage('How do I apply to become a certified partner?');
    } else if (action === 'ask_pricing') {
      handleSendMessage('What are the pricing tiers and project guarantees?');
    } else if (action === 'open_become_partner_modal') {
      if (onOpenBecomePartner) {
        onOpenBecomePartner();
      }
    } else if (action === 'view_directory') {
      if (onScrollToDirectory) {
        onScrollToDirectory();
      }
    } else if (action === 'open_whatsapp') {
      window.open('https://wa.me/2349158482622?text=Hello%20MsmeBooks%20Support%2C%20I%20need%20assistance%20with%20partner%20matching.', '_blank');
    } else if (action === 'view_hotlines') {
      setActiveTab('contact');
    } else if (action === 'budget_under_500') {
      handleSendMessage('I am looking for a partner with budget under $500');
    } else if (action === 'budget_mid') {
      handleSendMessage('I have a mid-range project budget around $500 to $1,500');
    } else if (action === 'budget_enterprise') {
      handleSendMessage('I have an enterprise ERP deployment with budget over $1,500');
    } else {
      handleSendMessage(action);
    }
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackPhone) return;

    setCallbackSubmitted(true);

    // Add confirmation message to chat
    const confirmMsg: SupportMessage = {
      id: `sys-${Date.now()}`,
      sender: 'agent',
      agentName: 'Kwame Mensah',
      agentAvatar: SUPPORT_AGENTS[1].avatar,
      text: `✅ **Callback Request Confirmed!**\n\nI have dispatched an urgent alert to our duty specialist. Agent **Kwame Mensah** will call you at **${callbackPhone}** (${callbackCountry}) shortly.\n\nEstimated wait time: **3–5 minutes**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, confirmMsg]);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketEmail || !ticketMessage) return;

    const randomId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketSubmittedId(randomId);

    const ticketMsg: SupportMessage = {
      id: `sys-${Date.now()}`,
      sender: 'agent',
      agentName: 'Amina Osei',
      agentAvatar: SUPPORT_AGENTS[0].avatar,
      text: `📋 **Support Ticket Created: #${randomId}**\n\nWe've received your request regarding **${ticketCategory}**. A formal response and ticket transcript has been sent to **${ticketEmail}**.\n\nOur concierge team will respond within 2 hours.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, ticketMsg]);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg-welcome-reset-${Date.now()}`,
        sender: 'agent',
        agentName: activeAgent.name,
        agentAvatar: activeAgent.avatar,
        text: `Conversation restarted! How can our support desk assist you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: '🔍 Find a partner for my business', action: 'find_partner' },
          { label: '⚡ Request urgent phone callback', action: 'request_callback' },
          { label: '🚀 Join as a certified partner', action: 'join_partner' }
        ]
      }
    ]);
  };

  const filteredFaqs = FAQS.filter(faq => 
    faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <>
      {/* 1. FLOATING LIVE CHAT TRIGGER BUTTON (Bottom-Right) */}
      <div 
        id="floating-live-chat-container"
        data-testid="floating-live-chat-container"
        className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 flex flex-col items-end select-none"
      >
        {/* Unread teaser tooltip bubble (appears when closed) */}
        {!isOpen && showTeaser && (
          <div
            id="live-chat-teaser-bubble"
            data-testid="live-chat-teaser-bubble"
            onClick={handleOpenChat}
            className="mb-3 cursor-pointer bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-2xl shadow-2xl border border-emerald-500/40 text-xs sm:text-[13px] max-w-xs animate-bounce flex items-start gap-2.5 hover:border-emerald-400 transition-all backdrop-blur-md"
          >
            <div className="relative">
              <img
                src={SUPPORT_AGENTS[0].avatar}
                alt="Amina"
                className="w-8 h-8 rounded-full object-cover border-2 border-emerald-400 shrink-0"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                <span>Support Desk Online</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-extrabold px-1.5 py-0.2 rounded">
                  &lt; 2m reply
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight mt-0.5 truncate">
                Have questions or need partner recommendations? Chat live!
              </p>
            </div>
            <button
              type="button"
              id="btn-dismiss-chat-teaser"
              onClick={(e) => {
                e.stopPropagation();
                setShowTeaser(false);
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              aria-label="Dismiss teaser"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* The Main Floating Action Button */}
        <button
          type="button"
          id="btn-open-live-chat"
          data-testid="btn-open-live-chat"
          onClick={() => {
            if (isOpen) {
              handleCloseChat();
            } else {
              handleOpenChat();
            }
          }}
          aria-label={isOpen ? 'Close Live Support Chat' : 'Open Live Support Chat'}
          className={`group relative flex items-center gap-2.5 px-4 py-3 rounded-full text-white shadow-2xl transition-all duration-300 transform active:scale-95 ${
            isOpen
              ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-500 hover:to-sky-500 shadow-emerald-600/30 hover:scale-105 border border-emerald-400/40'
          }`}
        >
          {isOpen ? (
            <>
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <X className="w-4 h-4 text-white" />
              </div>
              <span className="text-xs font-black tracking-wide hidden sm:inline">Close Support</span>
            </>
          ) : (
            <>
              <div className="relative flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <MessageSquareText className="w-4 h-4" />
                </div>
                {/* Live Pulse Dot */}
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 ring-1 ring-emerald-900"></span>
                </span>
              </div>

              <div className="text-left hidden sm:block">
                <div className="text-xs font-black tracking-wide flex items-center gap-1.5">
                  <span>Live Chat</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-emerald-100 font-medium">
                  Support Agents Online
                </div>
              </div>

              {/* Unread count badge */}
              {hasUnread && (
                <span className="sm:hidden absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-slate-900">
                  1
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* 2. SUPPORT AGENT HELP DIALOG WINDOW */}
      {isOpen && (
        <div
          id="live-support-dialog-window"
          data-testid="live-support-dialog-window"
          className="fixed bottom-20 right-4 sm:bottom-24 sm:right-7 z-50 flex flex-col bg-white/98 dark:bg-[#07162b]/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-200 overflow-hidden w-[94vw] sm:w-[440px] h-[640px] max-h-[86vh] animate-in fade-in slide-in-from-bottom-5"
        >
          {/* Header Bar */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-950 via-[#0a1e38] to-emerald-950 text-white border-b border-slate-800 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="flex -space-x-2 overflow-hidden">
                    {SUPPORT_AGENTS.map((agent) => (
                      <img
                        key={agent.id}
                        src={agent.avatar}
                        alt={agent.name}
                        className={`inline-block h-7 w-7 rounded-full ring-2 ring-slate-900 object-cover ${
                          activeAgent.id === agent.id ? 'ring-emerald-400' : ''
                        }`}
                        title={`${agent.name} - ${agent.role}`}
                      />
                    ))}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-1 ring-slate-900"></span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white">
                      MsmeBooks Support
                    </h3>
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Live
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>3 agents online • Reply time &lt; 2 mins</span>
                  </p>
                </div>
              </div>

              {/* Utility controls */}
              <div className="flex items-center gap-1 text-slate-300">
                <button
                  type="button"
                  id="btn-chat-toggle-sound"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? 'Mute sound alerts' : 'Enable sound alerts'}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Toggle sound"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                </button>

                <button
                  type="button"
                  id="btn-chat-reset"
                  onClick={handleResetChat}
                  title="Restart conversation"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Restart chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="btn-chat-close-window"
                  onClick={handleCloseChat}
                  title="Close support window"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Duty Agent Tag */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Duty Concierge: <strong className="text-white">{activeAgent.name}</strong></span>
              </span>
              <span className="text-[10px] text-slate-400">{activeAgent.location}</span>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 shrink-0 text-xs font-bold">
            <button
              type="button"
              id="tab-live-chat"
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'chat'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#07162b]'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span>Live Chat</span>
            </button>

            <button
              type="button"
              id="tab-direct-channels"
              onClick={() => setActiveTab('contact')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'contact'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#07162b]'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Channels & Call</span>
            </button>

            <button
              type="button"
              id="tab-faq-help"
              onClick={() => setActiveTab('faq')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'faq'
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-white dark:bg-[#07162b]'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Quick FAQ</span>
            </button>
          </div>

          {/* TAB 1: LIVE CHAT STREAM */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-slate-950/40">
              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 text-xs sm:text-[13px]">
                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
                    >
                      {/* Message meta info */}
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                        {!isUser && (
                          <>
                            <img
                              src={msg.agentAvatar || activeAgent.avatar}
                              alt="Agent"
                              className="w-4 h-4 rounded-full object-cover"
                            />
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                              {msg.agentName || activeAgent.name}
                            </span>
                          </>
                        )}
                        {isUser && <span className="font-semibold text-slate-500 dark:text-slate-300">You</span>}
                        <span>•</span>
                        <span>{msg.timestamp}</span>

                        {/* Copy button */}
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="Copy text"
                        >
                          {copiedMsgId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-[88%] sm:max-w-[85%] rounded-2xl p-3 shadow-xs leading-relaxed whitespace-pre-wrap ${
                          isUser
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        {msg.text}

                        {/* Attachment chip */}
                        {msg.attachmentName && (
                          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/20 text-white text-[11px] font-mono">
                            <FileText className="w-3 h-3" />
                            <span>{msg.attachmentName}</span>
                          </div>
                        )}
                      </div>

                      {/* Interactive Partner Recommendations Cards */}
                      {msg.partnerRecommendations && msg.partnerRecommendations.length > 0 && (
                        <div className="w-full mt-2.5 space-y-2 max-w-sm">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Recommended Verified Partners:
                          </span>
                          {msg.partnerRecommendations.map((p) => (
                            <div
                              key={p.id}
                              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 shadow-xs flex items-center justify-between gap-2.5 transition-all"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <img
                                  src={p.logo}
                                  alt={p.name}
                                  className="w-8 h-8 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                      {p.name}
                                    </span>
                                    <span className="text-[9px] font-extrabold px-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                      {p.level}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 truncate">
                                    <span>{p.countryFlag} {p.city}, {p.country}</span>
                                    <span>•</span>
                                    <span className="text-lime-600 dark:text-lime-400 font-semibold">{p.startingBudget || '$500'}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 shrink-0">
                                {onSelectPartner && (
                                  <button
                                    type="button"
                                    onClick={() => onSelectPartner(p)}
                                    className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[10px] font-bold rounded-md transition-colors"
                                  >
                                    Profile
                                  </button>
                                )}
                                {onContactPartner && (
                                  <button
                                    type="button"
                                    onClick={() => onContactPartner(p)}
                                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-md shadow-xs transition-colors"
                                  >
                                    Contact
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Callback Form Card embedded in stream */}
                      {msg.isCallbackCard && !callbackSubmitted && (
                        <div className="mt-2.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/40 w-full max-w-sm shadow-md">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white mb-2">
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Confirm Callback Number</span>
                          </div>
                          <form onSubmit={handleCallbackSubmit} className="space-y-2 text-xs">
                            <input
                              type="tel"
                              required
                              placeholder="e.g. +234 801 234 5678"
                              value={callbackPhone}
                              onChange={(e) => setCallbackPhone(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                            />
                            <button
                              type="submit"
                              className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1 text-xs"
                            >
                              <Phone className="w-3 h-3" />
                              <span>Request Instant Ring (~5m)</span>
                            </button>
                          </form>
                        </div>
                      )}

                      {/* Quick Action Suggestion Chips */}
                      {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {msg.suggestedActions.map((act, aIdx) => (
                            <button
                              key={aIdx}
                              type="button"
                              onClick={() => handleActionClick(act.action)}
                              className="text-[11px] bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 px-2.5 py-1 rounded-full text-left transition-all shadow-2xs"
                            >
                              {act.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Agent Typing Indicator */}
                {isAgentTyping && (
                  <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 text-xs">
                    <img
                      src={activeAgent.avatar}
                      alt="Agent"
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                    <div className="bg-white dark:bg-slate-900 px-3 py-2 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-800 shadow-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                          {activeAgent.name} is typing
                        </span>
                        <span className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-100"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-200"></span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Attachment Preview if any */}
              {attachment && (
                <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 border-t border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-1.5 truncate">
                    <Paperclip className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Attached: {attachment}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachment(null)}
                    className="text-emerald-600 dark:text-emerald-400 hover:text-rose-500 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setAttachment(e.target.files[0].name);
                  }
                }}
              />

              {/* Input Area */}
              <div className="p-3 bg-white dark:bg-[#07162b] border-t border-slate-200 dark:border-slate-800 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  {/* File attach button */}
                  <button
                    type="button"
                    id="btn-chat-attach"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
                    title="Attach screenshot or project brief"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type a message or ask our concierge..."
                      className="w-full pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-[13px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    {inputText && (
                      <button
                        type="button"
                        onClick={() => setInputText('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!inputText.trim() && !attachment}
                    className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-600/20 flex items-center justify-center shrink-0"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Footer disclaimer */}
                <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Official MsmeBooks Support Concierge</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('contact')}
                    className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                  >
                    Need a call?
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT REACH CHANNELS & CALLBACK */}
          {activeTab === 'contact' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 dark:bg-slate-950/50 text-xs">
              
              {/* WhatsApp Live Desk Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border border-emerald-500/40 shadow-sm text-white space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black text-sm">
                      WA
                    </span>
                    <div>
                      <h4 className="font-bold text-sm text-white">WhatsApp Live Chat</h4>
                      <p className="text-[11px] text-emerald-300">Fastest response for mobile users</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-black rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Connect directly with our WhatsApp duty support officer for immediate matching assistance and voice notes.
                </p>
                <button
                  type="button"
                  id="btn-open-whatsapp-direct"
                  onClick={() => window.open('https://wa.me/2349158482622?text=Hello%20MsmeBooks%2C%20I%20am%20looking%20for%20a%20certified%20partner%20or%20support.', '_blank')}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Chat on WhatsApp (+234 915 848 2622)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Instant Callback Form */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Request Immediate Callback</h4>
                      <p className="text-[10px] text-slate-400">Ring back in ~3–5 minutes</p>
                    </div>
                  </div>
                </div>

                {callbackSubmitted ? (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                    <p className="font-bold text-emerald-800 dark:text-emerald-300 text-xs">Callback Dispatched!</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Our concierge specialist will ring you at <strong>{callbackPhone}</strong>.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCallbackSubmit} className="space-y-2.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={callbackName}
                        onChange={(e) => setCallbackName(e.target.value)}
                        placeholder="e.g. Samuel Ade"
                        className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                          Country
                        </label>
                        <select
                          value={callbackCountry}
                          onChange={(e) => setCallbackCountry(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        >
                          <option value="Nigeria">🇳🇬 Nigeria (+234)</option>
                          <option value="Kenya">🇰🇪 Kenya (+254)</option>
                          <option value="Ghana">🇬🇭 Ghana (+233)</option>
                          <option value="South Africa">🇿🇦 South Africa (+27)</option>
                          <option value="Rwanda">🇷🇼 Rwanda (+250)</option>
                          <option value="United Kingdom">🇬🇧 UK (+44)</option>
                          <option value="Other">🌍 Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          required
                          value={callbackPhone}
                          onChange={(e) => setCallbackPhone(e.target.value)}
                          placeholder="Phone / WhatsApp"
                          className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Submit Callback Request</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Regional Direct Hotlines */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                  Regional Toll-Free & Direct Hotlines:
                </span>
                
                <div className="space-y-1.5">
                  <a
                    href="tel:+2349158482622"
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                  >
                    <span className="font-semibold flex items-center gap-1.5">
                      <span>🇳🇬</span>
                      <span>Nigeria Commercial Desk:</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+234 915 848 2622</span>
                  </a>

                  <a
                    href="tel:+254207654321"
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                  >
                    <span className="font-semibold flex items-center gap-1.5">
                      <span>🇰🇪</span>
                      <span>Kenya & East Africa:</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+254 20 765 4321</span>
                  </a>

                  <a
                    href="tel:+233302987654"
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                  >
                    <span className="font-semibold flex items-center gap-1.5">
                      <span>🇬🇭</span>
                      <span>Ghana & Francophone:</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">+233 30 298 7654</span>
                  </a>
                </div>

                <p className="text-[10px] text-slate-400 text-center">
                  Hours: Monday – Saturday, 7:30 AM – 8:30 PM (GMT)
                </p>
              </div>

              {/* Submit Priority Ticket */}
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-500" />
                  <h4 className="font-bold text-slate-900 dark:text-white">Submit Email Support Ticket</h4>
                </div>

                {ticketSubmittedId ? (
                  <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 text-center">
                    <p className="font-bold text-purple-900 dark:text-purple-300">Ticket Created #{ticketSubmittedId}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Confirmation sent to your inbox.</p>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-2">
                    <input
                      type="email"
                      required
                      value={ticketEmail}
                      onChange={(e) => setTicketEmail(e.target.value)}
                      placeholder="Your Work Email"
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    />
                    <select
                      value={ticketCategory}
                      onChange={(e) => setTicketCategory(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    >
                      <option value="Partner Matching">Partner Matching / Recommendations</option>
                      <option value="Partner Accreditation">Partner Accreditation / Onboarding</option>
                      <option value="Technical & Hardware">POS Hardware & Integration</option>
                      <option value="Billing & Escrow">Billing & Project Escrow</option>
                    </select>
                    <textarea
                      rows={2}
                      required
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      placeholder="Describe your question or project requirements..."
                      className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-xs"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-lg transition-colors text-xs"
                    >
                      Create Ticket
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: FAQ & KNOWLEDGE SHORTCUTS */}
          {activeTab === 'faq' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60 dark:bg-slate-950/50 text-xs">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={faqSearch}
                  onChange={(e) => setFaqSearch(e.target.value)}
                  placeholder="Search questions (e.g. pricing, verification)..."
                  className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>

              {/* Accordion FAQ list */}
              <div className="space-y-2">
                {filteredFaqs.map((faq) => {
                  const isExpanded = openFaqId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqId(isExpanded ? null : faq.id)}
                        className="w-full p-3 text-left font-bold text-slate-900 dark:text-white flex items-center justify-between gap-2"
                      >
                        <span className="text-xs">{faq.question}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-3 text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 pt-2 space-y-2">
                          <p>{faq.answer}</p>
                          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                            <span>Category: {faq.category}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('chat');
                                handleSendMessage(`I have a follow-up question regarding: ${faq.question}`);
                              }}
                              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                            >
                              Ask agent about this →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Still have questions CTA */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-2 mt-4">
                <p className="font-bold text-slate-900 dark:text-white text-xs">
                  Didn't find what you were looking for?
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('chat')}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-1.5"
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  <span>Start Live Conversation</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}
    </>
  );
};
