import React, { useState, useEffect } from 'react';
import { Sparkles, Bot, Send, User, CheckCircle2, ArrowRight, TrendingUp, Lightbulb, Zap } from 'lucide-react';
import { Currency } from '../types';
import { formatCurrency } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';

interface AiAssistantSectionProps {
  onOpenTrial: () => void;
  currency?: Currency;
}

const localizeAiText = (text: string, curr: Currency | string = 'NGN'): string => {
  return text
    .replace(/₦1,240,000/g, formatCurrency(1240000, curr))
    .replace(/₦1,890,000/g, formatCurrency(1890000, curr))
    .replace(/₦410,000/g, formatCurrency(410000, curr))
    .replace(/₦342,500/g, formatCurrency(342500, curr))
    .replace(/₦118,200/g, formatCurrency(118200, curr))
    .replace(/₦224,300/g, formatCurrency(224300, curr))
    .replace(/₦95,000/g, formatCurrency(95000, curr))
    .replace(/1 240 000/g, formatCurrency(1240000, curr))
    .replace(/1 890 000/g, formatCurrency(1890000, curr))
    .replace(/1.240.000/g, formatCurrency(1240000, curr))
    .replace(/1.890.000/g, formatCurrency(1890000, curr));
};

export const AiAssistantSection: React.FC<AiAssistantSectionProps> = ({ onOpenTrial, currency = 'NGN' }) => {
  const { t, language } = useLanguage();
  const activePrompts = t.aiAssistant.prompts;
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [chatMessages, setChatMessages] = useState(() => [
    {
      sender: 'user',
      text: activePrompts[0]?.question || '',
    },
    {
      sender: 'ai',
      text: localizeAiText(activePrompts[0]?.answer || '', currency),
      badge: activePrompts[0]?.badge || '',
    },
  ]);

  useEffect(() => {
    const item = activePrompts[selectedPromptIndex] || activePrompts[0];
    if (item) {
      setChatMessages([
        { sender: 'user', text: item.question },
        { sender: 'ai', text: localizeAiText(item.answer, currency), badge: item.badge },
      ]);
    }
  }, [currency, language, activePrompts, selectedPromptIndex]);

  const capabilities = [
    'Ask about sales performance',
    'Analyze expenses',
    'Identify low-stock products',
    'Explain financial reports',
    'Identify profitable products',
    'Monitor business trends',
    'Generate business summaries',
    'Provide inventory insights',
    'Help with accounting questions',
    'Recommend actions to improve performance',
  ];

  const handleSelectPrompt = (index: number) => {
    setSelectedPromptIndex(index);
    const item = activePrompts[index] || activePrompts[0];
    if (!item) return;
    setChatMessages([
      { sender: 'user', text: item.question },
      { sender: 'ai', text: localizeAiText(item.answer, currency), badge: item.badge },
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const query = customInput.trim();
    setCustomInput('');

    // Simulated contextual AI responses
    let reply = `Based on your synchronized branch transactions: We analyzed "${query}". Your overall revenue momentum is up 14.8% this quarter with gross margins holding steady at 38%. Our AI recommends reviewing distributor invoice payment terms to accelerate cash collections.`;
    let badge = 'Real-time AI Business Insight';

    if (query.toLowerCase().includes('stock') || query.toLowerCase().includes('inventory')) {
      reply = 'Inventory check complete: 18 items currently have healthy stock turnover. 3 fast-moving SKUs are approaching minimum safety threshold at the Ikeja branch. Automated PO draft has been prepared.';
      badge = 'Automated Stock Audit';
    } else if (query.toLowerCase().includes('tax') || query.toLowerCase().includes('vat')) {
      reply = `Tax computation preview: Output VAT (7.5%) collected across all POS channels is ${formatCurrency(418200, currency)}. Claimable input VAT on vendor invoices is ${formatCurrency(134500, currency)}. Estimated net VAT due on 21st is ${formatCurrency(283700, currency)}.`;
      badge = 'Statutory Tax Insight';
    }

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: query },
      { sender: 'ai', text: reply, badge },
    ]);
  };

  return (
    <section id="ai-assistant" className="py-16 lg:py-24 bg-[#0B192C] dark:bg-[#050C16] text-white relative overflow-hidden transition-colors duration-300">
      {/* Glow effects */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 dark:bg-slate-800/80 border border-slate-700 dark:border-slate-700/80 text-lime-400 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-lime-400" />
            {t.aiAssistant.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {t.aiAssistant.title}
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
            {t.aiAssistant.subtitle}
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: 10 AI Capabilities */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-lime-400" />
                Intelligent Accounting & Strategy in Plain English
              </h3>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                You don't need to be a chartered accountant or data scientist. Ask your business any question in natural language and receive immediate, audited answers derived from your actual sales and inventory data.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {capabilities.map((cap, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-200 bg-slate-800/60 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/60 dark:border-slate-700/40">
                  <CheckCircle2 className="w-4 h-4 text-[#84CC16] shrink-0" />
                  <span>{cap}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={onOpenTrial}
                className="inline-flex items-center gap-2 bg-[#84CC16] hover:bg-[#65A30D] text-[#0B192C] font-black text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-lime-500/20 hover:shadow-lime-500/30 transition-all cursor-pointer"
              >
                <span>Explore AI-Powered Business Management</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Live Interactive AI Simulator */}
          <div className="lg:col-span-7 bg-slate-900/90 dark:bg-[#071324] rounded-2xl sm:rounded-3xl border border-slate-700/80 dark:border-slate-800 shadow-2xl p-4 sm:p-6 backdrop-blur-md">
            
            {/* Simulator Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0A4FD5] to-lime-500 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    MsmeBooks Copilot
                    <span className="text-[10px] bg-lime-400/20 text-lime-400 font-bold px-1.5 py-0.5 rounded border border-lime-400/30">
                      Live
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Connected to Zaria Fabrics Ltd (All Branches)
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-400 hidden sm:block">
                Sample Interactive Sandbox
              </div>
            </div>

            {/* Quick Prompt Chips */}
            <div className="py-3 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
              <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap">{t.aiAssistant.sampleQueriesBadge}</span>
              {activePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPrompt(idx)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs transition-all cursor-pointer ${
                    selectedPromptIndex === idx
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {prompt.badge}
                </button>
              ))}
            </div>

            {/* Message Thread */}
            <div className="my-3 space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 text-xs leading-relaxed ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-7 h-7 rounded-lg bg-[#0A4FD5] flex items-center justify-center shrink-0 mt-0.5 text-white font-black text-[11px]">
                      AI
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl max-w-[85%] ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-none'
                    }`}
                  >
                    {msg.badge && (
                      <div className="text-[10px] font-bold text-lime-400 uppercase tracking-wider mb-1">
                        ⚡ {msg.badge}
                      </div>
                    )}
                    <p>{msg.text}</p>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-slate-300">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={t.aiAssistant.inputPlaceholder}
                className="flex-1 bg-slate-800 text-white text-xs px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="bg-[#0A4FD5] hover:bg-blue-600 text-white px-4 py-3 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

      </div>
    </section>
  );
};
