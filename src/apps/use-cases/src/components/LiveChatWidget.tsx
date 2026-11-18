import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Headphones, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  Clock,
  Calendar,
  ExternalLink,
  Minimize2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  timestamp: string;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

interface LiveChatWidgetProps {
  onOpenDemo?: (industry?: string) => void;
  onNavigate?: (path: string) => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ onOpenDemo, onNavigate }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'help'>('chat');
  const [unreadCount, setUnreadCount] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Ticket form state for Help tab
  const [ticketSent, setTicketSent] = useState(false);
  const [ticketData, setTicketData] = useState({
    name: '',
    email: '',
    phone: '',
    topic: 'Sales & Pricing',
    message: ''
  });

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'msg-welcome-1',
      sender: 'agent',
      text: t.liveChat.agentIntro,
      timestamp: 'Just now'
    }
  ]);

  // Update initial message when language changes if user has not interacted yet
  useEffect(() => {
    if (!hasInteracted) {
      setMessages([
        {
          id: 'msg-welcome-1',
          sender: 'agent',
          text: t.liveChat.agentIntro,
          timestamp: 'Just now'
        }
      ]);
    }
  }, [t, hasInteracted]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const quickPrompts = [
    { label: t.demoModal.title, query: "Can I book a live platform demo?" },
    { label: "Pricing & Plans", query: "What are the pricing plans for multi-branch retail?" },
    { label: "Inventory & Warehousing", query: "How does batch expiry and multi-location tracking work?" },
    { label: "Excel / QuickBooks Migration", query: "Can we import existing inventory and customer ledgers from Excel?" }
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setHasInteracted(true);
    setIsTyping(true);

    // Dynamic support agent automated response engine
    setTimeout(() => {
      let replyText = "Thank you for reaching out! One of our senior product consultants has received your inquiry and is reviewing your request.";
      let actions: Message['actions'] | undefined;

      const lower = text.toLowerCase();

      if (lower.includes('demo') || lower.includes('walkthrough') || lower.includes('schedule') || lower.includes('see the software')) {
        replyText = "We'd love to show you how MSMEBooks handles your specific operations! You can launch our interactive demo scheduler right now.";
        actions = [
          {
            label: "Open Demo Booking Form",
            action: () => {
              if (onOpenDemo) onOpenDemo();
            }
          }
        ];
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('plan') || lower.includes('subscription')) {
        replyText = "MSMEBooks offers transparent pricing tailored to growth: Starter (Single Outlet), Growth (Multi-Branch POS & Sync), and Enterprise (Custom Warehousing & ERP). All tiers include free cloud backups and localized VAT reporting.";
        actions = [
          {
            label: "Schedule Pricing Consultation",
            action: () => {
              if (onOpenDemo) onOpenDemo();
            }
          }
        ];
      } else if (lower.includes('inventory') || lower.includes('stock') || lower.includes('warehouse') || lower.includes('batch')) {
        replyText = "Our Inventory Suite features batch/FEFO expiry tracking, serialized item tracing, multi-warehouse in-transit transfers, and instant stockout forecasting.";
        actions = [
          {
            label: "View Inventory Use Cases",
            action: () => {
              if (onNavigate) {
                onNavigate('/use-cases');
                setIsOpen(false);
              }
            }
          }
        ];
      } else if (lower.includes('excel') || lower.includes('quickbooks') || lower.includes('migrate') || lower.includes('import')) {
        replyText = "Yes! Our assisted migration team provides 1-click Excel/CSV import templates for product catalogs, opening stock balances, vendor ledgers, and historical customers. The onboarding team helps you import in under 48 hours.";
      } else if (lower.includes('review') || lower.includes('customer') || lower.includes('case') || lower.includes('story')) {
        replyText = "We have documented stories from 200+ Nigerian and African businesses spanning Supermarkets, Pharmacies, Logistics, and Professional Services.";
        actions = [
          {
            label: "Explore Customer Reviews",
            action: () => {
              if (onNavigate) {
                onNavigate('/customer-reviews');
                setIsOpen(false);
              }
            }
          }
        ];
      } else {
        replyText = `Thank you for asking about "${text.length > 30 ? text.substring(0, 30) + '...' : text}". Our live desk is active! Would you like an instant specialist callback or to schedule a live screen walkthrough?`;
        actions = [
          {
            label: "Book Specialist Walkthrough",
            action: () => {
              if (onOpenDemo) onOpenDemo();
            }
          }
        ];
      }

      const agentMsg: Message = {
        id: `msg-agent-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketData.name || !ticketData.email || !ticketData.message) return;

    setTicketSent(true);
    setTimeout(() => {
      // also add notice into chat tab
      setMessages(prev => [
        ...prev,
        {
          id: `msg-ticket-${Date.now()}`,
          sender: 'agent',
          text: `Support ticket received for ${ticketData.name} (${ticketData.email}). Priority: High. A dedicated support engineer will contact you via email/phone within 15 minutes.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 500);
  };

  return (
    <>
      {/* Floating Action Trigger Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Subtle tooltip callout when not open and has not interacted */}
        {!isOpen && !hasInteracted && (
          <div 
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-white dark:bg-[#0B1E30] text-slate-800 dark:text-slate-100 text-xs font-semibold px-3 py-2 rounded-full shadow-lg border border-slate-200 dark:border-[#1A3852] cursor-pointer hover:border-[#7CB518] dark:hover:border-[#7CB518] transition-all transform hover:-translate-y-0.5 group"
          >
            <span className="w-2 h-2 rounded-full bg-[#7CB518] animate-pulse"></span>
            <span>{t.liveChat.questionsPrompt}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#7CB518] group-hover:translate-x-0.5 transition-transform" />
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close live chat" : "Open live chat with support"}
          className={`relative p-3.5 sm:p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center focus:outline-hidden focus:ring-4 focus:ring-[#7CB518]/30 ${
            isOpen 
              ? 'bg-slate-800 dark:bg-slate-700 text-white hover:bg-slate-900' 
              : 'bg-[#0A3D62] hover:bg-[#082F4D] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] text-white'
          }`}
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-200 rotate-0 hover:rotate-90" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6" />
              {/* Green Live Status Indicator Ping */}
              <span className="absolute top-0 right-0 flex h-3.5 w-3.5 -mt-0.5 -mr-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7CB518] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#7CB518] border-2 border-white dark:border-[#07131F]"></span>
              </span>

              {/* Unread badge if closed */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -left-1 bg-rose-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Live Chat & Support Help Dialog */}
      {isOpen && (
        <div 
          role="dialog"
          aria-label="Live Chat Support Dialog"
          className="fixed bottom-22 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] max-w-[420px] h-[560px] max-h-[82vh] bg-white dark:bg-[#0B1E30] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#1A3852] z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 transition-colors"
        >
          {/* Header */}
          <div className="bg-[#0A3D62] dark:bg-[#082A45] text-white p-4 flex items-center justify-between shadow-xs select-none">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-sm">
                  <Headphones className="w-5 h-5 text-[#90CF24]" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#7CB518] border-2 border-[#0A3D62]"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white leading-tight">{t.liveChat.chatTitle}</h3>
                  <span className="text-[10px] bg-[#7CB518]/25 text-[#90CF24] px-1.5 py-0.5 rounded-full font-bold">
                    {t.liveChat.online}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#90CF24]" />
                  {t.liveChat.replyTime}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-bar (Chat vs Quick Help) */}
          <div className="flex border-b border-slate-200 dark:border-[#1A3852] bg-slate-50 dark:bg-[#071726] text-xs font-semibold">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'chat'
                  ? 'text-[#0A3D62] dark:text-sky-400 border-b-2 border-[#0A3D62] dark:border-sky-400 bg-white dark:bg-[#0B1E30]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              {t.liveChat.liveConversationTab}
            </button>
            <button
              onClick={() => setActiveTab('help')}
              className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'help'
                  ? 'text-[#0A3D62] dark:text-sky-400 border-b-2 border-[#0A3D62] dark:border-sky-400 bg-white dark:bg-[#0B1E30]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              {t.liveChat.directContactsTab}
            </button>
          </div>

          {/* Tab 1: Live Chat Content */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50 dark:bg-[#07131F]">
              {/* Scrollable Message History */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                {/* Agent Introduction Badge */}
                <div className="text-center my-1">
                  <span className="inline-block bg-slate-200/80 dark:bg-[#162D42] text-slate-600 dark:text-slate-300 text-[10px] font-medium px-2.5 py-1 rounded-full">
                    Aisha connected from MSME Client Success
                  </span>
                </div>

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[85%]">
                      {msg.sender === 'agent' && (
                        <div className="w-6 h-6 rounded-full bg-[#0A3D62] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                          A
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-2xl shadow-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-[#0A3D62] text-white rounded-br-none'
                            : 'bg-white dark:bg-[#112A42] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-[#1E3B59] rounded-bl-none'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Interactive action buttons attached to message */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-white/10 flex flex-col gap-1.5">
                            {msg.actions.map((act, i) => (
                              <button
                                key={i}
                                onClick={act.action}
                                className="text-left font-bold text-xs bg-[#7CB518] hover:bg-[#689912] text-white px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors shadow-xs cursor-pointer"
                              >
                                <span>{act.label}</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                ))}

                {/* Live Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400">
                    <div className="w-6 h-6 rounded-full bg-[#0A3D62] text-white flex items-center justify-center text-[10px] shrink-0 font-bold">
                      A
                    </div>
                    <div className="bg-white dark:bg-[#112A42] border border-slate-200 dark:border-[#1E3B59] px-3 py-2 rounded-2xl rounded-bl-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7CB518] animate-bounce"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7CB518] animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7CB518] animate-bounce [animation-delay:0.4s]"></span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1">Aisha is typing...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Chips */}
              <div className="p-2 border-t border-slate-200/70 dark:border-[#1A3852] bg-white/70 dark:bg-[#0B1E30]/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-1.5 px-1 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#7CB518]" />
                  {t.liveChat.suggestedTopics}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(p.query)}
                      className="text-[11px] bg-slate-100 dark:bg-[#162D42] hover:bg-[#0A3D62]/10 dark:hover:bg-[#1F3D5A] hover:text-[#0A3D62] dark:hover:text-[#90CF24] text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full border border-slate-200/80 dark:border-[#224466] transition-colors cursor-pointer text-left"
                    >
                      {p.label}
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
                className="p-2.5 bg-white dark:bg-[#0B1E30] border-t border-slate-200 dark:border-[#1A3852] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t.liveChat.typeMessage}
                  className="flex-1 text-xs bg-slate-100 dark:bg-[#07131F] text-slate-900 dark:text-slate-100 placeholder-slate-400 px-3.5 py-2.5 rounded-xl border border-transparent focus:border-[#0A3D62] dark:focus:border-[#7CB518] focus:bg-white dark:focus:bg-[#07131F] outline-hidden transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="p-2.5 bg-[#0A3D62] hover:bg-[#082F4D] dark:bg-[#7CB518] dark:hover:bg-[#689912] text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 2: Direct Help & Ticket Form */}
          {activeTab === 'help' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-[#07131F] text-xs">
              {/* Direct channels card */}
              <div className="bg-white dark:bg-[#0B1E30] p-3.5 rounded-xl border border-slate-200 dark:border-[#1A3852] shadow-xs space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                  <Headphones className="w-4 h-4 text-[#7CB518]" />
                  {t.liveChat.directChannels}
                </h4>

                <div className="space-y-2">
                  <a
                    href="mailto:support@msmebooks.com"
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#112A42] hover:bg-slate-100 dark:hover:bg-[#163554] border border-slate-100 dark:border-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#0A3D62] dark:text-sky-300" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{t.liveChat.emailDesk}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">support@msmebooks.com</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#0A3D62] dark:text-sky-300">Email &rarr;</span>
                  </a>

                  <a
                    href="tel:+2348006763266"
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-[#112A42] hover:bg-slate-100 dark:hover:bg-[#163554] border border-slate-100 dark:border-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#7CB518]" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{t.liveChat.hotline}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">+234 (0) 800-MSME-BOOKS</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#7CB518]">Call &rarr;</span>
                  </a>
                </div>
              </div>

              {/* Book 1-on-1 Demo button */}
              <div className="p-3.5 bg-gradient-to-r from-[#0A3D62] to-[#0E4B77] text-white rounded-xl shadow-xs space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#90CF24]" />
                  Need a Customized Walkthrough?
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  {t.liveChat.demoPromptText}
                </p>
                <button
                  onClick={() => {
                    if (onOpenDemo) onOpenDemo();
                    setIsOpen(false);
                  }}
                  className="w-full bg-[#7CB518] hover:bg-[#689912] text-white font-bold py-2 rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  {t.liveChat.scheduleGuidedDemo}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Ticket Form */}
              <div className="bg-white dark:bg-[#0B1E30] p-3.5 rounded-xl border border-slate-200 dark:border-[#1A3852] shadow-xs">
                {ticketSent ? (
                  <div className="text-center py-4 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#7CB518] mx-auto" />
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">{t.liveChat.ticketSentTitle}</h5>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      {t.liveChat.ticketSentMessage}
                    </p>
                    <button
                      onClick={() => {
                        setTicketSent(false);
                        setTicketData({ name: '', email: '', phone: '', topic: 'Sales & Pricing', message: '' });
                      }}
                      className="text-xs font-bold text-[#0A3D62] dark:text-sky-300 hover:underline pt-1 cursor-pointer"
                    >
                      Submit Another Query
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleTicketSubmit} className="space-y-2.5">
                    <h5 className="font-bold text-slate-900 dark:text-white">{t.liveChat.leaveTicket}</h5>
                    
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-0.5">
                        {t.demoModal.fullName}
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketData.name}
                        onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })}
                        placeholder="e.g. Samuel Adekunle"
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-[#07131F] border border-slate-200 dark:border-[#1F3D5A] rounded-lg text-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-0.5">
                          {t.demoModal.workEmail}
                        </label>
                        <input
                          type="email"
                          required
                          value={ticketData.email}
                          onChange={(e) => setTicketData({ ...ticketData, email: e.target.value })}
                          placeholder="you@company.com"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-[#07131F] border border-slate-200 dark:border-[#1F3D5A] rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-0.5">
                          {t.demoModal.phone}
                        </label>
                        <input
                          type="tel"
                          value={ticketData.phone}
                          onChange={(e) => setTicketData({ ...ticketData, phone: e.target.value })}
                          placeholder="+234 801 234 5678"
                          className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-[#07131F] border border-slate-200 dark:border-[#1F3D5A] rounded-lg text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-0.5">
                        Inquiry Topic
                      </label>
                      <select
                        value={ticketData.topic}
                        onChange={(e) => setTicketData({ ...ticketData, topic: e.target.value })}
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-[#07131F] border border-slate-200 dark:border-[#1F3D5A] rounded-lg text-slate-900 dark:text-white"
                      >
                        <option>Sales &amp; Pricing Plans</option>
                        <option>Technical Setup &amp; Cloud Sync</option>
                        <option>Data Migration from Excel/QuickBooks</option>
                        <option>Hardware (Receipt Printers / Scanners)</option>
                        <option>Billing &amp; Subscription</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-0.5">
                        How can we help? *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={ticketData.message}
                        onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                        placeholder="Tell us about your business or question..."
                        className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-[#07131F] border border-slate-200 dark:border-[#1F3D5A] rounded-lg text-slate-900 dark:text-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 bg-[#0A3D62] hover:bg-[#082F4D] dark:bg-[#0E4B77] text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      {t.liveChat.sendTicket}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
