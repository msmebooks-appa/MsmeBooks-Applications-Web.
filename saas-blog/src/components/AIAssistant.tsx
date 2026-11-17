import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Bot,
  HelpCircle,
  Sparkles,
  BookOpen,
  ArrowRight,
  RefreshCw,
  Minus
} from 'lucide-react';
import { Article } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface AIAssistantProps {
  currentArticle?: Article | null;
  onSelectArticleBySlug?: (slug: string) => void;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  currentArticle,
  onSelectArticleBySlug,
  externalPrompt,
  onClearExternalPrompt,
  isOpen: controlledIsOpen,
  onToggle
}) => {
  const { dict, t } = useLanguage();
  const { currentCurrencyInfo } = useCurrency();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onToggle) {
      onToggle(open);
    } else {
      setInternalIsOpen(open);
    }
  };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: "Hi! I'm the MsmeBooks Business Assistant. What would you like to learn about today? I can explain accounting concepts, recommend POS & inventory tactics, or summarize our articles for you.",
      timestamp: 'Just now',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickChips = [
    { label: 'Summarize this article', prompt: currentArticle ? `Summarize the main takeaways of "${currentArticle.title}"` : 'Summarize the top financial advice for African SMEs' },
    { label: `Pricing & ROI in ${currentCurrencyInfo.code}`, prompt: `What is the estimated cost and monthly ROI of implementing MsmeBooks in ${currentCurrencyInfo.code} (${currentCurrencyInfo.symbol})?` },
    { label: 'POS for retail stores', prompt: 'How does a modern POS system stop till pilferage and stock shortages in a retail store?' },
    { label: 'Reduce stock shrinkage', prompt: 'What are the top 3 practical strategies to eliminate inventory shrinkage and stock losses?' },
    { label: 'Accounting vs Bookkeeping', prompt: 'What is the practical difference between bookkeeping and accounting for a small business?' },
    { label: 'Tax tips for African SMEs', prompt: 'How should an SME manage VAT and Withholding Tax (WHT) records to prevent penalties?' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle externally triggered prompt (e.g. from article summarize button)
  useEffect(() => {
    if (externalPrompt) {
      setIsOpen(true);
      handleSendMessage(externalPrompt);
      onClearExternalPrompt?.();
    }
  }, [externalPrompt]);

  const handleSendMessage = async (userPromptText?: string) => {
    const textToSend = userPromptText || inputValue;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userPromptText) setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          articleTitle: currentArticle?.title,
          articleContent: currentArticle?.excerpt,
          currency: currentCurrencyInfo.code,
        }),
      });
      const data = await res.json();
      const replyText = data.reply || "I'm having trouble processing that right now. Please explore our articles or reach out to MsmeBooks support at +2349158482622.";

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: "MsmeBooks unites Accounting, POS, Inventory, and Business Operations into one simple cloud system. You can explore our guides or contact our team at support@msmebooks.org.",
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-22 sm:bottom-24 right-6 z-30">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-xl border border-slate-700 hover:border-lime-400 transition-all hover:scale-105 active:scale-95 group cursor-pointer backdrop-blur-xs"
            aria-label="Open MsmeBooks AI Business Assistant"
          >
            <div className="w-7 h-7 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center font-bold">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <span>{dict.aiAssistant.title}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
              </div>
              <div className="text-[9px] text-slate-300">
                {dict.aiAssistant.subtitle}
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-[#0B1E36] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 bg-slate-900 dark:bg-[#050E1A] text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-bold shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {dict.aiAssistant.title}
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-lime-400/20 text-lime-400 font-extrabold">
                    {dict.connection.online}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {dict.aiAssistant.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome-reset',
                      sender: 'assistant',
                      text: "Hi! I'm the MsmeBooks Business Assistant. What would you like to learn about today?",
                      timestamp: 'Just now',
                    },
                  ])
                }
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Reset conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Current Article context badge */}
          {currentArticle && (
            <div className="px-4 py-2 bg-blue-50 dark:bg-[#0E2443] border-b border-blue-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
              <span className="truncate pr-2 font-medium">
                Reading: <strong className="font-bold text-blue-950 dark:text-white">{currentArticle.title}</strong>
              </span>
              <button
                onClick={() =>
                  handleSendMessage(
                    `Give me the top 3 actionable recommendations from this article: "${currentArticle.title}"`
                  )
                }
                className="text-[10px] font-bold text-blue-700 dark:text-lime-400 bg-white dark:bg-[#0B1E36] border border-blue-200 dark:border-slate-700 px-2 py-0.5 rounded shadow-xs hover:bg-blue-50 dark:hover:bg-[#132F55] shrink-0"
              >
                Quick Summary
              </button>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/60 dark:bg-[#071527]">
            {messages.map((m) => {
              const isAssistant = m.sender === 'assistant';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-lg bg-blue-900 dark:bg-[#102A4C] text-lime-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold border border-transparent dark:border-lime-500/30">
                      MB
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                      isAssistant
                        ? 'bg-white dark:bg-[#0E2443] text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700'
                        : 'bg-blue-700 dark:bg-lime-400 text-white dark:text-slate-950 font-medium rounded-br-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-lg bg-blue-900 dark:bg-[#102A4C] text-lime-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                  MB
                </div>
                <div className="bg-white dark:bg-[#0E2443] border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-300">
                  <Loader2 className="w-4 h-4 animate-spin text-lime-600 dark:text-lime-400" />
                  <span>{dict.aiAssistant.thinking}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt chips suggestions */}
          <div className="p-2.5 bg-white dark:bg-[#0B1E36] border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.prompt)}
                disabled={loading}
                className="shrink-0 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#0E2443] hover:bg-lime-100 dark:hover:bg-[#15345E] hover:text-slate-900 dark:hover:text-lime-300 text-slate-600 dark:text-slate-300 text-[11px] font-medium transition-colors border border-slate-200/60 dark:border-slate-700"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Form */}
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
              placeholder={dict.aiAssistant.placeholder}
              className="flex-1 bg-slate-50 dark:bg-[#0E2443] px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="p-2.5 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold transition-all disabled:opacity-40 cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
