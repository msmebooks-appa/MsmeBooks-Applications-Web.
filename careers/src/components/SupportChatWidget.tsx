import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  Send,
  X,
  Headphones,
  ExternalLink,
  Loader2,
  Sparkles,
  CheckCheck,
} from 'lucide-react';

interface SupportMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  showWhatsappEscalation?: boolean;
}

const WHATSAPP_SUPPORT_NUMBER = '2348006763266';

const QUICK_TOPICS = [
  'Track my application & interview',
  'Help syncing LinkedIn / CV',
  'Post a job & pricing plans',
  'Speak to WhatsApp Support',
];

export const SupportChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'welcome-support',
      sender: 'agent',
      text: "Hi there! I'm Adaobi from MsmeBooks Talent & Support. Ask me anything about applications, LinkedIn sync, interview scheduling, or job posting—or jump straight into WhatsApp Support anytime.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const getWhatsAppUrl = (customContext?: string) => {
    const lastUserMessage = [...messages].reverse().find((m) => m.sender === 'user')?.text;
    const prefill =
      customContext ||
      (lastUserMessage
        ? `Hello MsmeBooks Support! I need assistance regarding: "${lastUserMessage}"`
        : 'Hello MsmeBooks Support! I would like live assistance with MsmeBooks Careers.');
    return `https://api.whatsapp.com/send?phone=${WHATSAPP_SUPPORT_NUMBER}&text=${encodeURIComponent(prefill)}`;
  };

  const handleSendMessage = async (textOverride?: string) => {
    const text = (textOverride ?? inputText).trim();
    if (!text || isTyping) return;

    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: SupportMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: nowTime,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!textOverride) setInputText('');
    setIsTyping(true);

    try {
      const resp = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: nextHistory.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await resp.json();
      const replyText =
        data?.reply ||
        'Thanks for contacting MsmeBooks Support! Please reach our live WhatsApp desk if you need instant manual account assistance.';

      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showWhatsappEscalation: true,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: "I'm having trouble connecting right now, but our team is active on WhatsApp Support (+234 800 676 3266). Tap below to continue directly on WhatsApp.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          showWhatsappEscalation: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Support Launcher Button (Positioned cleanly above AI Career Advisor button) */}
      <div className="fixed bottom-20 right-6 z-40 flex items-center gap-2">
        <a
          href={getWhatsAppUrl('Hello MsmeBooks Support! I would like live WhatsApp assistance.')}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] active:scale-95 text-white shadow-lg border border-white/25 transition-all hover:scale-105"
          title="Direct WhatsApp Support"
          aria-label="Open WhatsApp Support"
        >
          <MessageCircle className="w-5 h-5" />
        </a>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="px-4 py-2.5 bg-[#14243A] hover:bg-[#1c3252] dark:bg-[#1A284A] dark:hover:bg-[#233663] active:scale-95 text-white rounded-full shadow-2xl border border-slate-700/80 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer text-xs font-bold"
          aria-label="Toggle live support agent chat"
          title="Chat with a live MsmeBooks Support Agent or open WhatsApp Support"
        >
          <Headphones className="w-4 h-4 text-[#B5E61D]" />
          <span>Support Chat</span>
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        </button>
      </div>

      {/* Floating Support Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="support-chat-window"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[385px] max-h-[76vh] bg-white dark:bg-[#111B33] rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-label="MsmeBooks Live Support Chat"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#14243A] to-[#0066CC] p-4 text-white shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="relative w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                    <Headphones className="w-4 h-4 text-[#B5E61D]" />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[#14243A]" />
                  </div>
                  <div>
                    <div className="text-xs font-extrabold flex items-center gap-1.5">
                      <span>Adaobi Vance</span>
                      <span className="px-1.5 py-0.5 rounded bg-white/15 text-[9px] uppercase tracking-wider text-[#B5E61D]">
                        Live Agent
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-100">
                      MsmeBooks Support Desk · Replies &lt; 1 min
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close support chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Dedicated WhatsApp Support Action Bar */}
              <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between gap-2">
                <span className="text-[10px] text-blue-100 font-medium">
                  Prefer messaging on your phone?
                </span>
                <a
                  href={getWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#25D366] hover:bg-[#1ebe5d] text-white text-[11px] font-bold shadow-xs transition-colors shrink-0"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Support</span>
                  <ExternalLink className="w-3 h-3 opacity-85" />
                </a>
              </div>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70 dark:bg-[#0B132B]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-[#0066CC] text-white rounded-br-sm'
                        : 'bg-white dark:bg-[#16233F] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-bl-sm'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.showWhatsappEscalation && (
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/70">
                        <a
                          href={getWhatsAppUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#128C7E] dark:text-[#25D366] hover:underline"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Continue with an agent on WhatsApp</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                  <span className="mt-1 px-1 text-[10px] text-slate-400 dark:text-slate-500 font-mono tabular-nums inline-flex items-center gap-1">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && <CheckCheck className="w-3 h-3 text-[#0066CC]" />}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start">
                  <div className="bg-white dark:bg-[#16233F] border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-xs text-slate-500 dark:text-slate-300 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#0066CC] dark:text-[#38BDF8]" />
                    <span>Agent is replying...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggested Prompts */}
            <div className="px-3 py-2 bg-white dark:bg-[#111B33] border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto shrink-0">
              {QUICK_TOPICS.map((topic) =>
                topic.includes('WhatsApp') ? (
                  <a
                    key={topic}
                    href={getWhatsAppUrl('Hello MsmeBooks Support! Connecting from the live support chat widget.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-[10px] font-semibold text-emerald-700 dark:text-[#25D366] border border-emerald-200 dark:border-emerald-800/70 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0"
                  >
                    <MessageCircle className="w-2.5 h-2.5 text-[#25D366]" />
                    <span>{topic}</span>
                  </a>
                ) : (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleSendMessage(topic)}
                    disabled={isTyping}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1A284A] hover:bg-blue-50 dark:hover:bg-blue-950/70 text-[10px] font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0066CC] dark:hover:text-[#38BDF8] border border-slate-200/80 dark:border-slate-700 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-[#0066CC] dark:text-[#38BDF8]" />
                    <span>{topic}</span>
                  </button>
                )
              )}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white dark:bg-[#111B33] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask a support agent..."
                disabled={isTyping}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#0066CC] dark:focus:border-[#38BDF8] outline-none"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || isTyping}
                className="p-2.5 rounded-xl bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-50 text-white shadow-xs transition-colors cursor-pointer shrink-0"
                aria-label="Send message to support agent"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
