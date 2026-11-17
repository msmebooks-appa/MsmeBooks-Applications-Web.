import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  X,
  Send,
  HelpCircle,
  Building2,
  DollarSign,
  MapPin,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Phone,
  Maximize2,
  Minimize2,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Currency, BillingPeriod } from '../types';
import { PRICING_PLANS } from '../data/pricingData';
import { formatCurrency, SUPPORTED_CURRENCIES } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { queryGeminiPricingAssistant, AssistantReplyResult } from '../services/aiPricingService';

interface FloatingAiPricingAssistantProps {
  currency: Currency;
  billingPeriod: BillingPeriod;
  onSelectPlan: (planId: string) => void;
  onOpenDemo: () => void;
}

interface ChatEntry {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  recommendedPlanId?: string;
  suggestedPrompts?: string[];
  contextBadge?: string;
}

export const FloatingAiPricingAssistant: React.FC<FloatingAiPricingAssistantProps> = ({
  currency,
  billingPeriod,
  onSelectPlan,
  onOpenDemo,
}) => {
  const { t, language } = useLanguage();
  const { openCheckout } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Quick Filters for business needs, budget, location
  const [selectedLocation, setSelectedLocation] = useState<string>('Nigeria / West Africa');
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('Retail & POS');
  const [selectedBudget, setSelectedBudget] = useState<string>('Flexible');
  const [showConfigFilters, setShowConfigFilters] = useState(false);

  const locations = [
    'Nigeria / West Africa',
    'Kenya / East Africa',
    'Ghana / West Africa',
    'South Africa',
    'Francophone West/Central Africa (CFA)',
    'Global / Diaspora (USD/GBP)',
  ];

  const businessTypes = [
    'Retail Store / Boutique',
    'Pharmacy / Chemist',
    'Restaurant / Eatery / Lounge',
    'Supermarket / Multi-lane',
    'Wholesale & Distribution (Multi-Branch)',
    'Solo Freelancer / Micro Startup',
  ];

  const budgets = [
    'Under ₦15,000 / $10/mo',
    '₦25,000 - ₦45,000 / $25/mo',
    '₦60,000+ / Multi-branch scale',
    'Enterprise / Custom RFP',
  ];

  const getInitialMessage = (): ChatEntry => ({
    id: 'init-1',
    sender: 'assistant',
    text: `Hello! I am your **MsmeBooks AI Pricing Advisor**. Tell me about your business type, monthly budget, or location, and I will recommend the exact right plan with transparent pricing and discounts.`,
    time: 'Just now',
    suggestedPrompts: [
      'Recommend a plan for a 2-branch pharmacy',
      'What is best for a tight budget?',
      'Does it work 100% offline with power cuts?',
      'Compare Professional vs Business plans',
    ],
  });

  const [messages, setMessages] = useState<ChatEntry[]>([getInitialMessage()]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatEntry = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInputText('');
    setIsLoading(true);

    try {
      const result: AssistantReplyResult = await queryGeminiPricingAssistant({
        message: textToSend,
        currency,
        billingPeriod,
        language,
        location: selectedLocation,
        businessType: selectedBusinessType,
        budget: selectedBudget,
      });

      const assistantMessage: ChatEntry = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: result.text,
        time: 'Just now',
        recommendedPlanId: result.recommendedPlanId,
        suggestedPrompts: result.suggestedPrompts,
        contextBadge: `${selectedBusinessType} • ${selectedLocation.split('/')[0].trim()}`,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: 'Our Premium plan (₦50,000/mo) or Growth plan (₦9,000/mo) is our most versatile recommendation with full core accounting, multi-user roles, and automated tax reporting. You can start with our risk-free trial and flexible setup.',
          time: 'Just now',
          recommendedPlanId: 'premium',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (type: string, loc: string, bud: string) => {
    setSelectedBusinessType(type);
    setSelectedLocation(loc);
    setSelectedBudget(bud);
    setShowConfigFilters(false);

    const prompt = `I run a ${type} located in ${loc} with a budget of ${bud}. What plan should I choose?`;
    handleSend(prompt);
  };

  const getPlanDetails = (planId?: string) => {
    return PRICING_PLANS.find((p) => p.id === planId);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {!isOpen && (
          <div className="relative group">
            {/* Ambient Animated Glow */}
            <span className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-[#0A4FD5] via-[#84CC16] to-[#0E62F7] opacity-75 blur-md group-hover:opacity-100 transition duration-300 animate-pulse"></span>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="relative flex items-center gap-2.5 px-4 sm:px-5 py-3.5 bg-gradient-to-r from-[#0B192C] to-[#0A4FD5] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/30 border border-lime-400/30 group"
              aria-label="Open AI Pricing Assistant"
            >
              <div className="relative flex items-center justify-center">
                <div className="w-6 h-6 rounded-lg bg-lime-400/20 flex items-center justify-center text-lime-300">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#84CC16] rounded-full border-2 border-[#0B192C] animate-ping"></span>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#84CC16] rounded-full border-2 border-[#0B192C]"></span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
                  AI Pricing Assistant
                  <span className="text-[9px] bg-lime-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                    Smart
                  </span>
                </span>
                <span className="text-[10px] text-blue-200 hidden sm:inline">
                  Find your best plan by budget & location
                </span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* Interactive AI Chat Assistant Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 sm:bottom-6 right-2 sm:right-6 bg-white dark:bg-[#0B192C] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col z-50 overflow-hidden transition-all duration-200 animate-in fade-in slide-in-from-bottom-4 ${
            isExpanded
              ? 'w-[96vw] sm:w-[540px] h-[90vh] max-h-[720px]'
              : 'w-[94vw] sm:w-[420px] h-[85vh] max-h-[580px]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0B192C] via-[#0A4FD5] to-[#125BEE] text-white p-4 shrink-0 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black shadow-inner">
                    <Sparkles className="w-5 h-5 text-lime-400" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#84CC16] border-2 border-[#0B192C]"></span>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm flex items-center gap-1.5 text-white">
                    MsmeBooks Pricing AI
                    <span className="text-[10px] bg-lime-400/25 text-lime-300 px-1.5 py-0.5 rounded font-mono font-bold">
                      v2.5
                    </span>
                  </h3>
                  <p className="text-[11px] text-blue-100 flex items-center gap-1">
                    <span>Tailored for your business scale & budget</span>
                  </p>
                </div>
              </div>

              {/* Header Action Controls */}
              <div className="flex items-center gap-1 text-white/80">
                <button
                  type="button"
                  onClick={() => setShowConfigFilters(!showConfigFilters)}
                  className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors text-xs flex items-center gap-1 font-semibold ${
                    showConfigFilters ? 'bg-white/20 text-lime-300' : ''
                  }`}
                  title="Configure Business, Location & Budget Filters"
                >
                  <Building2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors hidden sm:block"
                  title={isExpanded ? 'Minimize' : 'Expand'}
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
                  aria-label="Close Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Context Bar */}
            <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-100/90">
              <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                <span className="truncate">{selectedLocation.split('/')[0]}</span>
                <span>•</span>
                <span className="truncate">{selectedBusinessType.split('/')[0]}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowConfigFilters(!showConfigFilters)}
                className="text-[10px] text-lime-300 underline font-bold hover:text-white shrink-0 cursor-pointer ml-2"
              >
                {showConfigFilters ? 'Close Settings' : 'Customize Context'}
              </button>
            </div>
          </div>

          {/* Expandable Business & Location Context Picker */}
          {showConfigFilters && (
            <div className="bg-slate-50 dark:bg-[#071324] border-b border-slate-200 dark:border-slate-800 p-4 text-xs space-y-3 shrink-0 animate-in fade-in duration-150">
              <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#0A4FD5]" /> Set Business Profile for AI Advice:
                </span>
                <button
                  type="button"
                  onClick={() => setShowConfigFilters(false)}
                  className="text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Done
                </button>
              </div>

              {/* Location Select */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Business Location / Market:
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Business Type Select */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Type of Business:
                </label>
                <select
                  value={selectedBusinessType}
                  onChange={(e) => setSelectedBusinessType(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                >
                  {businessTypes.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget Select */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Approximate Budget Target:
                </label>
                <select
                  value={selectedBudget}
                  onChange={(e) => setSelectedBudget(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                >
                  {budgets.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleApplyPreset(selectedBusinessType, selectedLocation, selectedBudget)}
                className="w-full py-2 bg-[#0A4FD5] hover:bg-[#073AA0] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Ask AI with this Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60 dark:bg-[#071324]/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Assistant avatar badge */}
                {msg.sender === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] font-bold text-[#0A4FD5] dark:text-blue-400 flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5" />
                      MsmeBooks AI
                    </span>
                    {msg.contextBadge && (
                      <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-full font-medium">
                        {msg.contextBadge}
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#0A4FD5] text-white rounded-tr-none'
                      : 'bg-white dark:bg-[#0D1C30] text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-800 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Plan Recommendation Card (if AI suggested a plan) */}
                {msg.recommendedPlanId && (
                  <div className="mt-2.5 w-[88%] bg-gradient-to-br from-blue-50 to-lime-50/50 dark:from-slate-800/90 dark:to-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-3 shadow-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                        <span className="text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Recommended: {getPlanDetails(msg.recommendedPlanId)?.name} Plan
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold bg-[#84CC16] text-slate-950 px-2 py-0.5 rounded-full">
                        Best Fit
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-300 mb-2.5">
                      {getPlanDetails(msg.recommendedPlanId)?.description}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-blue-200/60 dark:border-slate-700">
                      <div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                          {billingPeriod === 'yearly' ? 'Annual discounted rate' : 'Monthly subscription'}
                        </div>
                        <div className="text-sm font-black text-[#0B192C] dark:text-white">
                          {msg.recommendedPlanId === 'enterprise'
                            ? 'Custom Contract'
                            : formatCurrency(
                                billingPeriod === 'yearly'
                                  ? getPlanDetails(msg.recommendedPlanId)?.yearlyPricePerMonth || 0
                                  : getPlanDetails(msg.recommendedPlanId)?.monthlyPrice || 0,
                                currency
                              ) + '/mo'}
                        </div>
                      </div>

                      {msg.recommendedPlanId === 'enterprise' ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            onOpenDemo();
                          }}
                          className="px-3 py-1.5 bg-[#0B192C] hover:bg-[#073AA0] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1"
                        >
                          <span>Book Demo</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setIsOpen(false);
                              openCheckout(msg.recommendedPlanId!, billingPeriod);
                            }}
                            className="px-2.5 py-1.5 bg-[#0A4FD5] hover:bg-[#073AA0] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1"
                          >
                            <span>Subscribe</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsOpen(false);
                              onSelectPlan(msg.recommendedPlanId!);
                            }}
                            className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                          >
                            Trial
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Suggested prompt chips */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[95%]">
                    {msg.suggestedPrompts.map((prompt, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSend(prompt)}
                        className="px-2.5 py-1 text-[10px] font-semibold bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer text-left shadow-2xs"
                      >
                        ⚡ {prompt}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-[#0D1C30] border border-slate-200 dark:border-slate-800 rounded-2xl w-fit text-xs text-slate-600 dark:text-slate-400 shadow-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0A4FD5]" />
                <span>Consulting MsmeBooks pricing engine...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick preset queries */}
          <div className="p-2 bg-white dark:bg-[#0B192C] border-t border-slate-100 dark:border-slate-800 flex gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
            <button
              type="button"
              onClick={() => handleSend('What is the best plan for a growing pharmacy in Lagos?')}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer font-medium"
            >
              💊 Pharmacy in Lagos
            </button>
            <button
              type="button"
              onClick={() => handleSend('We have 3 supermarket branches with multiple POS cashiers. Which plan?')}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer font-medium"
            >
              🏬 3 Supermarket Branches
            </button>
            <button
              type="button"
              onClick={() => handleSend('I have a small boutique shop and low budget. Can I start with Starter?')}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer font-medium"
            >
              👗 Boutique on Budget
            </button>
            <button
              type="button"
              onClick={() => handleSend('Explain offline resilience when internet and power fail in Nairobi.')}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer font-medium"
            >
              ⚡ Offline Sync & Power Cuts
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-[#0B192C] border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about plans, budget, branches, or locations..."
              disabled={isLoading}
              className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/30 focus:border-[#0A4FD5]"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-[#0A4FD5] hover:bg-[#073AA0] disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white disabled:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed shrink-0 shadow-sm"
              aria-label="Send query"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
