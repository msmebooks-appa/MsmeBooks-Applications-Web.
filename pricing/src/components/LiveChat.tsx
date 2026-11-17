import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Phone,
  Mail,
  Clock,
  CheckCheck,
  Sparkles,
  ChevronDown,
  ExternalLink,
  ShieldCheck,
  Headphones,
} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

export const LiveChat: React.FC = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: '1',
      sender: 'agent',
      text: t.liveChat.welcomeMessage,
      time: 'Just now',
    },
  ]);

  // Sync welcome message on language change if only initial message exists
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            id: '1',
            sender: 'agent',
            text: t.liveChat.welcomeMessage,
            time: 'Just now',
          },
        ];
      }
      return prev;
    });
  }, [language, t.liveChat.welcomeMessage]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulated responsive agent reply
    setTimeout(() => {
      setIsTyping(false);
      let reply =
        "Thank you for reaching out! Our team is available 24/7. You can also start your risk-free trial on any plan with our free usage model, or call our Lagos support line directly at +234 915 848 2622.";

      const lower = userMsg.text.toLowerCase();
      if (lower.includes('offline') || lower.includes('internet')) {
        reply =
          'Yes! MsmeBooks works 100% offline. Cashiers can ring up sales and print receipts without internet, and transactions sync automatically once connection restores.';
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('discount')) {
        reply =
          'Our Starter plan begins at ₦12,500/mo, Professional at ₦32,000/mo, and Business at ₦75,000/mo. If you choose yearly billing, you get 20% off (2 months free equivalent)! You can also toggle currencies in the navbar.';
      } else if (lower.includes('currency') || lower.includes('usd') || lower.includes('kes') || lower.includes('zar')) {
        reply =
          'We support 16 major currencies (NGN, USD, GBP, EUR, KES, ZAR, GHS, etc.) directly via the global selector in the top navbar!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          text: reply,
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  return (
    <>
      {/* Floating Live Chat Launcher Button at bottom-right (stacked above AI assistant launcher) */}
      <div className="fixed bottom-22 sm:bottom-24 right-4 sm:right-6 z-40">
        {!isOpen && (
          <div className="relative group">
            {/* Ambient pulse effect */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0A4FD5] to-[#84CC16] opacity-70 blur-xs group-hover:opacity-100 transition duration-300 animate-pulse"></span>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2.5 px-3.5 sm:px-4 py-3 bg-[#0A4FD5] hover:bg-[#073AA0] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/30 border border-white/20"
              aria-label="Open Live Chat"
            >
              <div className="relative">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 fill-white/20 text-white" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#84CC16] rounded-full border-2 border-[#0A4FD5]"></span>
              </div>
              <span className="text-xs font-black tracking-wide pr-1">
                {t.liveChat.launcherTitle}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Support Chat Dialog Window at bottom-right */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 right-2 sm:right-6 w-[94vw] sm:w-[380px] max-h-[85vh] h-[520px] bg-white dark:bg-[#0B192C] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0A4FD5] to-[#0E62F7] text-white p-4 flex items-center justify-between shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-black text-sm">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#84CC16] border-2 border-[#0A4FD5]"></span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  {t.liveChat.dialogTitle}
                  <span className="text-[10px] bg-lime-400/25 text-lime-200 px-1.5 py-0.2 rounded-full font-bold">
                    {t.liveChat.onlineBadge}
                  </span>
                </h3>
                <p className="text-[11px] text-blue-100 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {t.liveChat.agentRole}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Live Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Contact Bar */}
          <div className="bg-blue-50/80 dark:bg-[#071324] px-3.5 py-2 border-b border-blue-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
            <a
              href="tel:+2349158482622"
              className="flex items-center gap-1 hover:text-[#0A4FD5] dark:hover:text-blue-400 font-semibold transition-colors"
            >
              <Phone className="w-3 h-3 text-[#0A4FD5] dark:text-blue-400" />
              <span>+234 915 848 2622</span>
            </a>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <a
              href="mailto:support@msmebooks.org"
              className="flex items-center gap-1 hover:text-[#0A4FD5] dark:hover:text-blue-400 font-semibold transition-colors"
            >
              <Mail className="w-3 h-3 text-[#84CC16]" />
              <span>{t.liveChat.emailContact}</span>
            </a>
          </div>

          {/* Message Thread */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-[#081220]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#0A4FD5] text-white rounded-br-xs'
                      : 'bg-white dark:bg-[#0D1C30] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 flex items-center gap-1">
                  <span>{msg.time}</span>
                  {msg.sender === 'user' && (
                    <CheckCheck className="w-3 h-3 text-[#0A4FD5] dark:text-blue-400 inline" />
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-white dark:bg-[#0D1C30] border border-slate-200/80 dark:border-slate-800 rounded-2xl w-fit text-xs text-slate-500 dark:text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] ml-1">Typing...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-white dark:bg-[#0B192C] border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
            <button
              type="button"
              onClick={() => {
                setInputText(t.liveChat.quickPrompt1);
              }}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            >
              {language === 'fr' ? 'Pharmacie / Boutique ?' : language === 'pt' ? 'Farmácia / Retalho?' : language === 'es' ? '¿Farmacia / Comercio?' : 'Retail / Pharmacy?'}
            </button>
            <button
              type="button"
              onClick={() => {
                setInputText(t.liveChat.quickPrompt2);
              }}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            >
              {language === 'fr' ? 'Caisse Hors-Ligne ?' : language === 'pt' ? 'POS Offline?' : language === 'es' ? '¿TPV Sin Conexión?' : 'Offline POS?'}
            </button>
            <button
              type="button"
              onClick={() => {
                setInputText(t.liveChat.quickPrompt3);
              }}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
            >
              {language === 'fr' ? 'Import Excel ?' : language === 'pt' ? 'Importar Excel?' : language === 'es' ? '¿Importar Excel?' : 'Import Excel?'}
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white dark:bg-[#0B192C] border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.liveChat.inputPlaceholder}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/30 focus:border-[#0A4FD5]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-[#0A4FD5] hover:bg-[#073AA0] disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-sm"
              aria-label={t.liveChat.sendButton}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
