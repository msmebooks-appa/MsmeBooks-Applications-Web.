import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  User, 
  CheckCheck,
  ChevronDown,
  Phone,
  HelpCircle,
  FileText
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  time: string;
  avatar?: string;
  isQuickReply?: boolean;
}

interface LiveChatWidgetProps {
  onOpenPartnerApplication?: () => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ onOpenPartnerApplication }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'agent',
      text: 'Hello! Welcome to MsmeBooks Partner Support. 👋 My name is Amara, Regional Partner Lead for West & East Africa.',
      time: 'Just now',
    },
    {
      id: 'welcome-2',
      sender: 'agent',
      text: 'Are you an accountant, tech reseller, or business consultant looking to explore our 15%–40% recurring commission program?',
      time: 'Just now',
    }
  ]);

  const quickPrompts = [
    'How do partner commissions work?',
    'I want to join the Partner Program',
    'Accountant multi-tenant console inquiry',
    'Speak to a human representative'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    // Simulate smart agent response tailored to MsmeBooks ecosystem
    setIsTyping(true);

    setTimeout(() => {
      let replyText = "Thank you for reaching out! Our channel team is online. We've noted your question and can guide you through our multi-tenant portal and 15%–40% recurring commission structure.";
      
      const lower = text.toLowerCase();
      if (lower.includes('commission') || lower.includes('earn') || lower.includes('rate')) {
        replyText = "Our partner tiers start at Bronze (15% recurring) up to Platinum (40% recurring monthly). Commissions are paid directly into your verified African bank account on the 10th of every month.";
      } else if (lower.includes('join') || lower.includes('apply') || lower.includes('sign up')) {
        replyText = "You can register for the partner program in under 2 minutes! Would you like me to open the Partner Onboarding form right here for you?";
      } else if (lower.includes('accountant') || lower.includes('bookkeeper') || lower.includes('console')) {
        replyText = "MsmeBooks includes an Accountant & Partner Console that allows you to manage multiple SME client ledgers, bank feeds, VAT/WHT filing schedules, and audit records with single-login multi-tenancy.";
      } else if (lower.includes('human') || lower.includes('speak') || lower.includes('call') || lower.includes('phone')) {
        replyText = "Our partner directors in Lagos (+234 1 888 MSME) and Nairobi (+254 20 765 MSME) are ready to assist. You can also leave your corporate email and we will schedule an executive demo.";
      }

      const agentReply: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentReply]);
      setIsTyping(false);
    }, 1100);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Chat Window Dialog */}
      {isOpen && (
        <div 
          id="live-chat-dialog"
          role="dialog"
          aria-label="Live Chat Support"
          className="mb-3 w-[92vw] sm:w-[380px] max-w-[420px] h-[520px] max-h-[82vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0F4C81] via-[#1E40AF] to-[#0A2540] p-4 text-white flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-sm text-[#84CC16]">
                  MB
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#84CC16] border-2 border-[#0F4C81]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm leading-tight text-white">MsmeBooks Partner Support</h3>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#84CC16] text-[#0A192F]">Live</span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-[#84CC16]" /> Typically replies in under 2 mins
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Close live chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Partner Notice Bar */}
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
            <span className="flex items-center gap-1 text-[#0F4C81] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#65A30D]" /> Pan-African Channel Desk
            </span>
            <span className="text-slate-400">Lagos • Nairobi • Accra</span>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
            <div className="text-center my-1">
              <span className="text-[10px] text-slate-400 bg-white px-2.5 py-0.5 rounded-full border border-slate-200">
                Today • Live Agent Session
              </span>
            </div>

            {messages.map((msg) => {
              const isAgent = msg.sender === 'agent';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                      isAgent
                        ? 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                        : 'bg-[#0F4C81] text-white rounded-tr-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1 flex items-center gap-1">
                    {msg.time}
                    {!isAgent && <CheckCheck className="w-3 h-3 text-[#84CC16]" />}
                  </span>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 text-xs text-slate-400 italic">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F4C81] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-[11px]">Amara is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#0F4C81] hover:border-blue-200 border border-slate-200 text-[11px] font-medium text-slate-600 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Quick Action Button for Direct Application */}
          {onOpenPartnerApplication && (
            <div className="px-3 py-1.5 bg-lime-50/80 border-t border-lime-100 flex items-center justify-between text-xs text-[#365314] shrink-0">
              <span className="font-semibold text-[11px]">Ready to earn recurring revenue?</span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenPartnerApplication();
                }}
                className="text-[11px] font-bold text-[#0F4C81] hover:underline"
              >
                Open Partner Form →
              </button>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Type your message or question..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F4C81] focus:ring-1 focus:ring-[#0F4C81]/20 bg-slate-50 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-9 h-9 rounded-xl bg-[#0F4C81] hover:bg-[#0A3861] disabled:opacity-40 disabled:hover:bg-[#0F4C81] text-white flex items-center justify-center transition-colors shadow-xs"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Launcher Button */}
      <button
        id="floating-live-chat-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-[#0F4C81] to-[#1E40AF] hover:from-[#0A3861] hover:to-[#172554] text-white shadow-xl shadow-[#0F4C81]/30 hover:shadow-2xl hover:shadow-[#0F4C81]/40 transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label={isOpen ? 'Close Live Chat' : 'Open Live Chat with Support Agents'}
      >
        {/* Glow Ping Ring */}
        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84CC16] opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#84CC16] border-2 border-white" />
          </span>
        )}

        <div className="relative">
          {isOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <MessageSquare className="w-5 h-5 text-white" />
          )}
        </div>

        <span className="font-bold text-xs sm:text-sm tracking-wide">
          {isOpen ? 'Close Chat' : 'Live Chat'}
        </span>

        {!isOpen && (
          <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
        )}
      </button>
    </div>
  );
};
