import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Mail,
  CheckCircle2,
  Paperclip,
  Clock,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ChatMessage {
  id: string;
  sender: 'agent' | 'user';
  text: string;
  timestamp: string;
  ticketRef?: string;
}

export const LiveChatWidget: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: 'm-1',
      sender: 'agent',
      text: 'Hello and welcome to the MsmeBooks Global Partner Support Desk! I am Kemi from Partner Success. How can we assist your accounting firm, consultancy, or reseller business today?',
      timestamp: 'Just now'
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const quickTopics = [
    { label: 'Application Status', prompt: 'I want to check the status of my partner verification.' },
    { label: 'Commission Rates', prompt: 'How do the 15% to 40% recurring commission schedules work?' },
    { label: 'Agreement Schedules', prompt: 'I need clarification on Schedule B and 90-day lead attribution.' },
    { label: 'POS Hardware Bundle', prompt: 'Can we bundle Android POS handhelds with MsmeBooks subscriptions?' }
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setHasStarted(true);
    setIsTyping(true);

    // Simulate agent response with domain knowledge
    setTimeout(() => {
      let replyText = 'Thank you for your message. A dedicated Partner Success Officer has logged your inquiry under ticket reference ';
      const ticketId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;

      const lower = text.toLowerCase();
      if (lower.includes('status') || lower.includes('verification') || lower.includes('application')) {
        replyText = `Your application is reviewed by our compliance desk within 24 business hours. If you provided your registration (CAC/CIPC/BRS) and tax ID, our officer will verify and activate your initial Bronze or Silver tier. Ticket ID: `;
      } else if (lower.includes('commission') || lower.includes('rate') || lower.includes('tier') || lower.includes('payout')) {
        replyText = `MsmeBooks commissions range from 15% (Bronze) up to 40% (Platinum). Payouts are reconciled on the 10th and remitted on the 25th of every month directly to your verified local bank account or USD SWIFT. Reference logged: `;
      } else if (lower.includes('pos') || lower.includes('hardware') || lower.includes('terminal')) {
        replyText = `Yes! Authorized Technology and POS Agents receive wholesale bundle rates on certified thermal printers, barcode scanners, and handheld Android POS terminals. Request registered under: `;
      } else if (lower.includes('schedule') || lower.includes('agreement') || lower.includes('legal')) {
        replyText = `All 30 articles and Schedules A–G are governed under regional commercial arbitration. Lead attribution is guaranteed for 90 days following your referral link click. Reference logged: `;
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: `${replyText} ${ticketId}. Would you also like a direct callback from our Regional Partnership Manager?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        ticketRef: ticketId
      };

      setIsTyping(false);
      setMessages(prev => [...prev, agentMsg]);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <aside aria-label="Partner Live Chat Support" className="fixed bottom-6 right-6 z-40 select-none">
        {!isOpen ? (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open MsmeBooks Live Chat Support Desk"
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#0046B8] hover:bg-[#003893] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] border border-blue-400/30 cursor-pointer"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-white" />
              {/* Online Pulse Indicator */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#84CC16] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#84CC16]" />
              </span>
            </div>
            <span className="text-xs font-bold tracking-tight pr-1">
              {t('chat.title', 'Live Partner Chat')}
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-extrabold text-slate-900 bg-[#84CC16] px-2 py-0.5 rounded-full">
              {t('chat.helpBadge', 'Live Help')}
            </span>
          </button>
        ) : null}
      </aside>

      {/* Live Chat Help Dialog Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-dialog-heading"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[400px] h-[520px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200 transition-colors"
        >
          {/* Dialog Header */}
          <div className="bg-[#0046B8] dark:bg-slate-950 text-white p-4 flex items-center justify-between shrink-0 border-b border-transparent dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-blue-800 dark:bg-blue-900 border-2 border-lime-400 flex items-center justify-center font-extrabold text-xs text-white">
                  KA
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#84CC16] border-2 border-[#0046B8] dark:border-slate-950 rounded-full" />
              </div>
              <div className="space-y-0.5">
                <h3 id="chat-dialog-heading" className="text-xs font-extrabold text-white leading-tight">
                  MsmeBooks Partner Desk
                </h3>
                <p className="text-[11px] text-blue-100 dark:text-slate-400 flex items-center gap-1">
                  <span>Kemi Adebayo · Active Support</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-blue-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Live Chat Dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick SLA & Help Notice */}
          <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 shrink-0">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Typical response: &lt; 5 mins</span>
            </span>
            <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500">Hub: Lagos / Nairobi</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60 dark:bg-slate-950/60 text-xs text-slate-800 dark:text-slate-200">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#0046B8] dark:bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.ticketRef && (
                    <div className="mt-2 pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                      <span>Ticket: {msg.ticketRef}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">Logged to Desk</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 px-3 py-2 rounded-2xl w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] text-slate-400 ml-1">Kemi is typing...</span>
              </div>
            )}

            {/* Quick Topic Chips */}
            {!hasStarted && (
              <div className="pt-2 space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Quick Inquiry Shortcuts:
                </p>
                <div className="flex flex-col gap-1.5">
                  {quickTopics.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(item.prompt)}
                      className="text-left p-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-blue-50/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 -rotate-90" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Escalation Options */}
          <div className="px-3 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 shrink-0">
            <span className="font-semibold">Direct Escalation:</span>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/2348035550192?text=Hello%20MsmeBooks%20Partner%20Team"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#0046B8] dark:text-lime-400 hover:underline font-semibold"
              >
                <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>WhatsApp</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <a
                href="mailto:partnerships@msmebooks.org?subject=Partner%20Support%20Inquiry"
                className="flex items-center gap-1 text-[#0046B8] dark:text-blue-400 hover:underline font-semibold"
              >
                <Mail className="w-3 h-3" />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={t('chat.placeholder', 'Type your question or request...')}
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 text-xs border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0046B8] dark:focus:ring-lime-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  inputMessage.trim()
                    ? 'bg-[#0046B8] hover:bg-[#003893] dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">
              <span>Press Enter to send</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>End-to-end encrypted</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
