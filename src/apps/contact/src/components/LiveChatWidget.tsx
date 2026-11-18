import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  MessageCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Paperclip,
  CheckCheck,
  ChevronRight,
  User,
  Coins,
} from 'lucide-react';
import { useToast } from './Toast';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

interface Message {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  time: string;
  agentName?: string;
  agentRole?: string;
}

interface LiveChatWidgetProps {
  onOpenDemo: () => void;
  onScrollToForm: (enquiryType?: string) => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  onOpenDemo,
  onScrollToForm,
}) => {
  const { showToast } = useToast();
  const { currentCurrency, formatAmount } = useCurrency();
  const { tDict } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'agent',
      agentName: 'Funke A.',
      agentRole: 'Customer Success Specialist',
      text: 'Hello! Welcome to MsmeBooks. How can our Pan-African customer support team assist your business today?',
      time: 'Just now',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulated human support agent response
    setTimeout(() => {
      setIsTyping(false);
      let replyText =
        'Thank you for reaching out! A specialist from our regional desk has received your note. Ticket #MSME-LIVE-' +
        Math.floor(100 + Math.random() * 900) +
        ' has been created for your session.';

      const lower = text.toLowerCase();
      if (lower.includes('demo') || lower.includes('see') || lower.includes('walkthrough')) {
        replyText =
          'We would love to show you MsmeBooks! You can reserve a personalized walkthrough slot directly on our calendar.';
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('pricing') || lower.includes('plan')) {
        replyText = `Our plans start at ${formatAmount(19)}/mo for single stores and ${formatAmount(79)}/mo for multi-branch operations in ${currentCurrency.code} (${currentCurrency.name}). Would you like us to generate an exact proposal?`;
      } else if (lower.includes('pos') || lower.includes('retail') || lower.includes('barcode')) {
        replyText =
          'Our POS module supports barcode scanners, receipt printers, touch tablets, and offline cash drawer syncing. Would you like a hardware compatibility checklist?';
      }

      const agentReply: Message = {
        id: String(Date.now() + 1),
        sender: 'agent',
        agentName: 'Funke A.',
        agentRole: 'Customer Success Specialist',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, agentReply]);
    }, 1200);
  };

  const handleQuickPrompt = (prompt: string, enquiryType?: string) => {
    handleSendMessage(prompt);
    if (enquiryType) {
      // Also notify user they can fill the complete form if needed
    }
  };

  return (
    <>
      {/* Floating Trigger Button at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-lg border border-slate-200 text-xs font-bold text-[#0B3B82] hover:bg-slate-50 transition-all hover:scale-102"
          >
            <span className="w-2 h-2 rounded-full bg-[#70C038] animate-pulse" />
            <span>Chat with Support</span>
          </button>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#70C038]/30 ${
            isOpen
              ? 'bg-slate-800 text-white rotate-90 scale-95'
              : 'bg-[#0B3B82] text-white hover:bg-[#082d64] hover:scale-105'
          }`}
          aria-label={isOpen ? 'Close support chat' : 'Open live support chat'}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 text-white" />
              {/* Lemon Green Unread Badge */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#70C038] text-slate-950 font-extrabold text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Floating Help Dialog Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-labelledby="live-chat-heading"
          className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[390px] h-[540px] max-h-[85vh] bg-white dark:bg-[#131E35] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 transition-colors"
        >
          {/* Header with MsmeBooks Corporate Blue & Active Agents */}
          <div className="bg-[#0B3B82] dark:bg-[#071936] text-white p-4 shrink-0 flex items-center justify-between border-b border-blue-900/60">
            <div className="flex items-center gap-3">
              {/* Agent Avatar Group */}
              <div className="relative flex -space-x-2 overflow-hidden">
                <div className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-700 overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <img
                    src="/src/assets/images/support_african_specialist_1792327888097.jpg"
                    alt="Funke A. Customer Success"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-[#0B3B82] bg-[#70C038] flex items-center justify-center text-xs font-bold text-slate-950">
                  <span>MB</span>
                </div>
              </div>

              <div>
                <h3 id="live-chat-heading" className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{tDict.chat.title}</span>
                  <span className="w-2 h-2 rounded-full bg-[#70C038] inline-block" />
                </h3>
                <p className="text-[11px] text-slate-300">
                  {tDict.chat.status}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Minimize chat window"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Direct Channel Tabs Bar */}
          <div className="bg-slate-50 dark:bg-[#0B1120] px-3 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <a
              href="https://wa.me/2349158482622?text=Hello%20MsmeBooks%20Support%2C%20I%20am%20chatting%20from%20your%20website"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-semibold text-[#3d701a] dark:text-[#a1e670] hover:text-[#2b5212] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#70C038]" />
              <span>WhatsApp Chat</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <a
              href="tel:+2349158482622"
              className="flex items-center gap-1 font-semibold text-[#0B3B82] dark:text-[#93C5FD] hover:text-[#082d64] dark:hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+234 915 848 2622</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <button
              onClick={() => {
                setIsOpen(false);
                onOpenDemo();
              }}
              className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300 hover:text-[#0B3B82] dark:hover:text-white transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#70C038]" />
              <span>Book Demo</span>
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-[#0B1120]/60 text-xs">
            {/* Timestamp Notice */}
            <div className="text-center my-1">
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-white dark:bg-[#0B1120] px-2 py-0.5 rounded-full border border-slate-100 dark:border-slate-800">
                Today · Real Support Specialists
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'agent' && (
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1 ml-1 flex items-center gap-1">
                    <span>{msg.agentName}</span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                    <span className="text-[#4d8b20] dark:text-[#a1e670]">{msg.agentRole}</span>
                  </span>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0B3B82] text-white rounded-br-xs shadow-sm'
                      : 'bg-white dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>

                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 dark:text-slate-500 px-1">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-[#70C038]" />}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 text-xs bg-white dark:bg-[#0B1120] border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-2xl w-fit">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Funke is typing</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B3B82] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#70C038] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0B3B82] animate-bounce [animation-delay:0.4s]" />
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-white dark:bg-[#131E35] border-t border-slate-100 dark:border-slate-800 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
            {[
              { label: 'Request Pricing', action: 'Could you share pricing details for our business?' },
              { label: 'Schedule a Demo', action: 'I would like to schedule a product demonstration.' },
              { label: 'POS & Hardware', action: 'What POS hardware and printers does MsmeBooks support?' },
              { label: 'Accountant Partnership', action: 'How does your accountant partner program work?' },
            ].map((qp) => (
              <button
                key={qp.label}
                onClick={() => handleQuickPrompt(qp.action)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#0B1120] hover:bg-[#f0f6ff] dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-[#0B3B82] dark:hover:text-[#93C5FD] text-[11px] font-medium border border-slate-200 dark:border-slate-700 transition-colors shrink-0"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-[#131E35] border-t border-slate-200 dark:border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onScrollToForm('Technical Support');
                  showToast('Support Portal', 'Attachment upload is available on the main contact form.', 'info');
                }}
                className="p-2 text-slate-400 hover:text-[#0B3B82] dark:hover:text-white rounded-lg transition-colors"
                title="Attach file in main contact form"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about POS, accounting, pricing..."
                className="flex-1 py-2 px-3 bg-slate-50 dark:bg-[#0B1120] border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0B3B82] dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0B1120]"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2 rounded-xl bg-[#70C038] hover:bg-[#5fa62c] text-white disabled:opacity-40 disabled:hover:bg-[#70C038] transition-all"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
