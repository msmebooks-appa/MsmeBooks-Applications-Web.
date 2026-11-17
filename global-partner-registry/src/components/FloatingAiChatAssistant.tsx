import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  RotateCcw,
  Maximize2,
  Minimize2,
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Zap,
  Star,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Filter,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Building2,
  Loader2
} from 'lucide-react';
import { Partner, ChatMessage, ChatFilterCriteria, ChatAssistantResponse } from '../types';
import { isFastResponse } from './PartnerCard';
import { useCurrency } from '../context/CurrencyContext';

interface FloatingAiChatAssistantProps {
  onSelectPartner: (partner: Partner) => void;
  onContactPartner: (partner: Partner) => void;
  onRequestConsultation?: (partner: Partner) => void;
  onApplyFilters?: (filters: { country?: string; industry?: string; search?: string }) => void;
  partners: Partner[];
}

const QUICK_PROMPTS = [
  'Nairobi supermarket POS under $1,000',
  'Lagos manufacturing audit & FIRS tax compliance',
  'Accra pharmacy on tight budget (< $500)',
  'Fast response remote partner for multi-branch retail',
];

const PRESET_NEEDS = [
  'Retail POS',
  'Tax & Compliance',
  'Inventory & Wholesale',
  'Pharmacy / Health',
  'Multi-Branch ERP',
  'Data Migration'
];

const PRESET_BUDGETS = [
  '< $500 (Budget)',
  '$500 - $1.5k (Mid-range)',
  '$1.5k+ (Enterprise)'
];

const PRESET_LOCATIONS = [
  'Kenya',
  'Nigeria',
  'Ghana',
  'Rwanda',
  'Egypt',
  'South Africa',
  'UK / Diaspora',
  'Remote Support'
];

export const FloatingAiChatAssistant: React.FC<FloatingAiChatAssistantProps> = ({
  onSelectPartner,
  onContactPartner,
  onRequestConsultation,
  onApplyFilters,
  partners,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUnreadPrompt, setHasUnreadPrompt] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Selected quick filter pills
  const [selectedNeed, setSelectedNeed] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showFilterPills, setShowFilterPills] = useState(false);

  // Messages state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Hello! I'm your **MsmeBooks Partner AI Advisor**. 

I can match your business with verified accountants, certified POS technicians, and cloud ERP advisors based on your:
- 💼 **Specific Business Need** (e.g., Supermarket POS, Pharmacy, Tax compliance)
- 💰 **Budget** (e.g., under $500, mid-range $500–$1.5k, enterprise)
- 📍 **Location** (e.g., Nairobi, Lagos, Accra, Kigali, or 100% remote)

Try one of the quick prompts below or type your requirements!`,
      timestamp: 'Just now',
      suggestedPrompts: QUICK_PROMPTS,
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnreadPrompt(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  useEffect(() => {
    const handleOpenAiChat = (e?: Event) => {
      setIsOpen(true);
      setHasUnreadPrompt(false);
      const customEvent = e as CustomEvent<{ query?: string }>;
      if (customEvent?.detail?.query) {
        handleSendMessage(customEvent.detail.query);
      }
    };
    window.addEventListener('open-ai-chat', handleOpenAiChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenAiChat);
  }, []);

  // Client-side fallback matcher in case backend is unreachable
  const clientFallbackMatch = (query: string, need: string, budget: string, loc: string): ChatAssistantResponse => {
    const qLower = query.toLowerCase();
    const needLower = need.toLowerCase();
    const budgetLower = budget.toLowerCase();
    const locLower = loc.toLowerCase();

    const scored = partners.map(p => {
      let score = 0;
      const cLower = p.country.toLowerCase();
      const cityLower = p.city.toLowerCase();
      const indStr = p.industries.join(' ').toLowerCase();
      const specStr = p.specialties.join(' ').toLowerCase();
      const srvStr = p.services.join(' ').toLowerCase();

      // Location match
      if (locLower) {
        if (cLower.includes(locLower) || locLower.includes(cLower)) score += 30;
        if (cityLower.includes(locLower) || locLower.includes(cityLower)) score += 35;
        if (locLower.includes('remote') && p.remoteSupport) score += 20;
      } else if (qLower) {
        if (cLower.split(' ').some(w => qLower.includes(w)) || cityLower.split(' ').some(w => qLower.includes(w))) {
          score += 25;
        }
      }

      // Need match
      const targetNeed = needLower || qLower;
      if (targetNeed) {
        ['pos', 'inventory', 'retail', 'supermarket', 'pharmacy', 'tax', 'accounting', 'erp', 'manufacturing', 'audit', 'migration'].forEach(kw => {
          if (targetNeed.includes(kw)) {
            if (indStr.includes(kw)) score += 15;
            if (specStr.includes(kw)) score += 15;
            if (srvStr.includes(kw)) score += 10;
          }
        });
      }

      // Budget match
      const targetBudget = budgetLower || qLower;
      const minVal = p.minBudgetUSD || 500;
      if (targetBudget.includes('under 500') || targetBudget.includes('< 500') || targetBudget.includes('budget')) {
        if (minVal <= 500) score += 25;
        else score -= 10;
      } else if (targetBudget.includes('1000') || targetBudget.includes('1,000') || targetBudget.includes('mid')) {
        if (minVal >= 400 && minVal <= 1500) score += 20;
      } else if (targetBudget.includes('enterprise') || targetBudget.includes('1.5k') || targetBudget.includes('growth')) {
        if (minVal >= 1200) score += 20;
      }

      if (p.level === 'Platinum') score += 5;
      else if (p.level === 'Gold') score += 3;
      score += (p.rating - 4.5) * 8;

      return { partner: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 3).map(s => s.partner);

    const partnerNames = top.map(p => p.name).join(', ');
    const reply = top.length > 0
      ? `I matched your requirements with **${top.length} certified partners** from our directory:\n\n` +
        top.map((p, idx) => `**${idx + 1}. ${p.name}** (${p.city}, ${p.country} • ${p.level} Partner)\n- **Starting Budget:** ${p.startingBudget || '$500'}\n- **Core Focus:** ${p.specialties.slice(0, 3).join(', ')}\n- **Response Speed:** ${p.responseTime}`).join('\n\n') +
        `\n\nTake a look at their verified profiles below to request a discovery session or contact them directly.`
      : `I searched our network but couldn't find an exact match for those specific filters. Here are our top-rated partners with remote cross-border support:`;

    return {
      assistantReply: reply,
      recommendedPartnerIds: top.map(p => p.id),
      extractedCriteria: {
        businessNeed: need || (query.match(/(pos|inventory|retail|accounting|tax|audit|supermarket|pharmacy)/i)?.[0] || ''),
        budget: budget || (query.match(/(\$?\d+[\d,]*|\bunder\s+\$?\d+|\bbudget\b)/i)?.[0] || ''),
        location: loc || (query.match(/(kenya|nairobi|nigeria|lagos|ghana|accra|rwanda|kigali|egypt|cairo|south africa|remote)/i)?.[0] || ''),
      },
      suggestedQuestions: [
        'Would you like to schedule a free 30-min discovery session?',
        'Do you need on-site hardware setup or remote configuration?',
        'Would you like to view these partners in the main directory table?'
      ]
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!query && !selectedNeed && !selectedBudget && !selectedLocation) return;

    // Construct full query summary if filters are selected
    let effectiveQuery = query;
    if (!effectiveQuery) {
      const parts = [];
      if (selectedNeed) parts.push(`Need: ${selectedNeed}`);
      if (selectedBudget) parts.push(`Budget: ${selectedBudget}`);
      if (selectedLocation) parts.push(`Location: ${selectedLocation}`);
      effectiveQuery = parts.join(' • ');
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: effectiveQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      criteria: {
        businessNeed: selectedNeed || undefined,
        budget: selectedBudget || undefined,
        location: selectedLocation || undefined,
      }
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.slice(-4).map(m => ({
        role: m.sender,
        text: m.text
      }));

      const res = await fetch('/api/ai/query-partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: effectiveQuery,
          businessNeed: selectedNeed,
          budget: selectedBudget,
          location: selectedLocation,
          conversationHistory,
        }),
      });

      let data: ChatAssistantResponse;
      if (res.ok) {
        data = await res.json();
      } else {
        data = clientFallbackMatch(effectiveQuery, selectedNeed, selectedBudget, selectedLocation);
      }

      // Resolve partner objects from IDs
      const matchedPartners = (data.recommendedPartnerIds || [])
        .map(id => partners.find(p => p.id === id))
        .filter((p): p is Partner => Boolean(p));

      // Fallback if no partner matched IDs
      const finalPartners = matchedPartners.length > 0 ? matchedPartners : partners.slice(0, 2);

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.assistantReply || 'Here are the recommended partners matching your criteria:',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        criteria: data.extractedCriteria,
        recommendedPartners: finalPartners,
        suggestedPrompts: data.suggestedQuestions,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.warn('Network error querying AI endpoint, using local matcher', err);
      const fallback = clientFallbackMatch(effectiveQuery, selectedNeed, selectedBudget, selectedLocation);
      const matchedPartners = (fallback.recommendedPartnerIds || [])
        .map(id => partners.find(p => p.id === id))
        .filter((p): p is Partner => Boolean(p));

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: fallback.assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        criteria: fallback.extractedCriteria,
        recommendedPartners: matchedPartners,
        suggestedPrompts: fallback.suggestedQuestions,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setSelectedNeed('');
    setSelectedBudget('');
    setSelectedLocation('');
    setMessages([
      {
        id: `msg-welcome-${Date.now()}`,
        sender: 'assistant',
        text: `Conversation reset. How can I assist you with finding the right partner?

You can specify your **industry**, **budget range**, and **preferred location/country**, or click any quick prompt below.`,
        timestamp: 'Just now',
        suggestedPrompts: QUICK_PROMPTS,
      },
    ]);
  };

  // Simple clean markdown text formatter
  const renderFormattedText = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }

      // Format bold text **text**
      const formatBold = (text: string) => {
        const parts = text.split(/(\*\*[^*]+\*\*)/g);
        return parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={pIdx} className="font-semibold text-slate-900 dark:text-white">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });
      };

      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <div key={idx} className="flex items-start gap-1.5 ml-2 my-0.5 text-xs text-slate-700 dark:text-slate-300">
            <span className="text-lime-600 dark:text-lime-400 font-bold shrink-0">•</span>
            <span>{formatBold(line.substring(2))}</span>
          </div>
        );
      }

      return (
        <p key={idx} className="my-1 text-xs sm:text-[13px] leading-relaxed text-slate-700 dark:text-slate-300">
          {formatBold(line)}
        </p>
      );
    });
  };

  return (
    <>
      {/* 1. FLOATING ACTION TRIGGER BUTTON */}
      <div className="fixed bottom-20 right-5 sm:bottom-24 sm:right-7 z-40 flex flex-col items-end">
        {/* Unread teaser tooltip bubble */}
        {!isOpen && hasUnreadPrompt && (
          <div
            id="ai-assistant-greeting-bubble"
            onClick={() => setIsOpen(true)}
            className="mb-3 cursor-pointer bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-3.5 py-2.5 rounded-2xl shadow-xl border border-lime-500/30 text-xs sm:text-[13px] max-w-xs animate-bounce flex items-start gap-2.5 select-none"
          >
            <div className="p-1.5 bg-lime-500/10 text-lime-600 dark:text-lime-400 rounded-lg shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                Need a partner match?
                <span className="w-2 h-2 rounded-full bg-lime-500 animate-ping" />
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight mt-0.5">
                Query by business need, budget & location.
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHasUnreadPrompt(false);
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              aria-label="Dismiss greeting"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Floating Trigger Button */}
        <button
          id="partner-ai-chat-trigger"
          data-testid="ai-chat-trigger"
          onClick={() => setIsOpen(prev => !prev)}
          aria-label="Open MsmeBooks Partner AI Assistant"
          className="group relative flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-gradient-to-r from-[#07162b] via-slate-900 to-emerald-950 text-white shadow-xl shadow-emerald-950/40 border border-lime-400/40 hover:border-lime-400 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-lime-400/20 flex items-center justify-center text-lime-400 group-hover:bg-lime-400 group-hover:text-slate-950 transition-colors">
              <Sparkles className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
            </div>
            {/* Pulsing online indicator dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
            </span>
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-[11px] font-bold tracking-wide flex items-center gap-1">
              Ask Partner AI
            </div>
            <div className="text-[9px] text-lime-300/80 font-medium">
              Need • Budget • Location
            </div>
          </div>
        </button>
      </div>

      {/* 2. FLOATING CHAT WINDOW DRAWER / MODAL */}
      {isOpen && (
        <div
          id="partner-ai-chat-window"
          data-testid="ai-chat-window"
          className={`fixed bottom-20 right-4 sm:bottom-24 sm:right-7 z-50 flex flex-col bg-white/95 dark:bg-[#07162b]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300 overflow-hidden ${
            isExpanded
              ? 'w-[92vw] sm:w-[580px] h-[86vh] max-h-[780px]'
              : 'w-[92vw] sm:w-[440px] h-[610px] max-h-[85vh]'
          }`}
        >
          {/* Header Bar */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-[#07162b] to-emerald-950 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-lime-400 to-emerald-500 flex items-center justify-center text-slate-950 shadow-md shadow-lime-500/20 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                    Partner AI Advisor
                  </h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-lime-500/20 text-lime-300 border border-lime-500/30">
                    Gemini AI
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400"></span>
                  Query certified partners across 14 countries
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                id="ai-chat-reset-button"
                onClick={handleResetChat}
                title="Restart conversation"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Restart chat"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                id="ai-chat-expand-button"
                onClick={() => setIsExpanded(prev => !prev)}
                title={isExpanded ? 'Restore size' : 'Expand window'}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors hidden sm:block"
                aria-label="Toggle expand"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                id="ai-chat-close-button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Requirement Filter Pills Bar (Toggleable or Expandable) */}
          <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800/80 shrink-0">
            <div className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 mb-1.5">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Filter className="w-3 h-3 text-lime-600 dark:text-lime-400" />
                Quick Requirements Selector:
              </span>
              <button
                onClick={() => setShowFilterPills(prev => !prev)}
                className="text-lime-600 dark:text-lime-400 hover:underline font-medium text-[11px]"
              >
                {showFilterPills ? 'Hide filters' : 'Customize need / budget / location'}
              </button>
            </div>

            {/* Active Selected Tags Summary */}
            <div className="flex flex-wrap items-center gap-1.5">
              {selectedNeed ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-300 px-2 py-0.5 rounded-full border border-lime-300 dark:border-lime-700">
                  <Briefcase className="w-2.5 h-2.5" />
                  {selectedNeed}
                  <button onClick={() => setSelectedNeed('')} className="hover:text-red-500 ml-0.5">×</button>
                </span>
              ) : null}

              {selectedBudget ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full border border-amber-300 dark:border-amber-700">
                  <DollarSign className="w-2.5 h-2.5" />
                  {selectedBudget}
                  <button onClick={() => setSelectedBudget('')} className="hover:text-red-500 ml-0.5">×</button>
                </span>
              ) : null}

              {selectedLocation ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full border border-blue-300 dark:border-blue-700">
                  <MapPin className="w-2.5 h-2.5" />
                  {selectedLocation}
                  <button onClick={() => setSelectedLocation('')} className="hover:text-red-500 ml-0.5">×</button>
                </span>
              ) : null}

              {(selectedNeed || selectedBudget || selectedLocation) && (
                <button
                  onClick={() => handleSendMessage()}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-0.5 rounded-full transition-colors ml-auto shadow-xs"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  Find Matches
                </button>
              )}
            </div>

            {/* Expanded Selector Drawer */}
            {showFilterPills && (
              <div className="mt-2.5 space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px]">
                {/* 1. Need */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-lime-500" /> Business Need / Industry:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_NEEDS.map(n => (
                      <button
                        key={n}
                        onClick={() => setSelectedNeed(prev => prev === n ? '' : n)}
                        className={`px-2 py-0.5 rounded-md text-[11px] border transition-colors ${
                          selectedNeed === n
                            ? 'bg-lime-500 text-slate-950 font-bold border-lime-600'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-lime-400'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Budget */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-amber-500" /> Budget Range:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_BUDGETS.map(b => (
                      <button
                        key={b}
                        onClick={() => setSelectedBudget(prev => prev === b ? '' : b)}
                        className={`px-2 py-0.5 rounded-md text-[11px] border transition-colors ${
                          selectedBudget === b
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-600'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-amber-400'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Location */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-500" /> Location / Region:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {PRESET_LOCATIONS.map(l => (
                      <button
                        key={l}
                        onClick={() => setSelectedLocation(prev => prev === l ? '' : l)}
                        className={`px-2 py-0.5 rounded-md text-[11px] border transition-colors ${
                          selectedLocation === l
                            ? 'bg-blue-500 text-white font-bold border-blue-600'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-blue-400'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-[13px]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {/* Sender label & timestamp */}
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 px-1">
                    {!isUser && <span className="font-semibold text-lime-600 dark:text-lime-400">Partner AI</span>}
                    {isUser && <span className="font-semibold text-slate-500 dark:text-slate-300">You</span>}
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`max-w-[90%] rounded-2xl px-3.5 py-3 shadow-sm ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    {renderFormattedText(msg.text)}

                    {/* Criteria badges attached to assistant response */}
                    {msg.criteria && (msg.criteria.businessNeed || msg.criteria.budget || msg.criteria.location) && (
                      <div className="flex flex-wrap items-center gap-1 mt-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold mr-1">
                          Matched Filters:
                        </span>
                        {msg.criteria.location && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                            <MapPin className="w-2.5 h-2.5" />
                            {msg.criteria.location}
                          </span>
                        )}
                        {msg.criteria.businessNeed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-lime-100 dark:bg-lime-900/40 text-lime-700 dark:text-lime-300 font-medium">
                            <Briefcase className="w-2.5 h-2.5" />
                            {msg.criteria.businessNeed}
                          </span>
                        )}
                        {msg.criteria.budget && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-medium">
                            <DollarSign className="w-2.5 h-2.5" />
                            {msg.criteria.budget}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* RECOMMENDED PARTNER CARDS CAROUSEL / LIST */}
                  {msg.recommendedPartners && msg.recommendedPartners.length > 0 && (
                    <div className="w-full mt-3 space-y-2.5">
                      <div className="text-[11px] font-bold tracking-wide uppercase text-slate-500 dark:text-slate-400 flex items-center justify-between px-1">
                        <span>Recommended Verified Partners:</span>
                        <span className="text-lime-600 dark:text-lime-400 font-normal lowercase">
                          {msg.recommendedPartners.length} matches
                        </span>
                      </div>

                      {msg.recommendedPartners.map((partner) => {
                        const isFast = isFastResponse(partner.responseTime);
                        return (
                          <div
                            key={partner.id}
                            className="bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-lime-500/50 dark:hover:border-lime-500/40 transition-all shadow-sm group hover:shadow-md"
                          >
                            <div className="flex items-start gap-3">
                              {/* Partner Logo */}
                              <img
                                src={partner.logo}
                                alt={partner.name}
                                className="w-11 h-11 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                              />

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                                    {partner.name}
                                  </h4>
                                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                                    partner.level === 'Platinum'
                                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                                      : partner.level === 'Gold'
                                      ? 'bg-yellow-100 dark:bg-yellow-950/80 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700'
                                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                  }`}>
                                    {partner.level}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                                  <span className="flex items-center gap-1">
                                    <span>{partner.countryFlag}</span>
                                    <span>{partner.city}, {partner.country}</span>
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span>{partner.rating.toFixed(1)}</span>
                                  </span>
                                </div>

                                {/* Budget and Fast Response tags */}
                                <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px]">
                                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                    <DollarSign className="w-2.5 h-2.5" />
                                    From {partner.startingBudget || '$500'}
                                  </span>

                                  {isFast && (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25">
                                      <Zap className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 fill-amber-500/30" />
                                      <span>Fast Response ({partner.responseTime})</span>
                                    </span>
                                  )}
                                </div>

                                {/* Specialties snippet */}
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {partner.specialties.slice(0, 3).map((spec, sIdx) => (
                                    <span
                                      key={sIdx}
                                      className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded"
                                    >
                                      {spec}
                                    </span>
                                  ))}
                                </div>

                                {/* Quick action buttons */}
                                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                                  <button
                                    onClick={() => onSelectPartner(partner)}
                                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-[11px] font-medium transition-colors flex items-center justify-center gap-1"
                                  >
                                    <span>View Profile</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>

                                  <button
                                    onClick={() => onContactPartner(partner)}
                                    className="py-1.5 px-3 bg-lime-500 hover:bg-lime-400 text-slate-950 rounded-lg text-[11px] font-bold transition-colors shadow-xs"
                                  >
                                    Contact
                                  </button>

                                  {onApplyFilters && (
                                    <button
                                      onClick={() => {
                                        onApplyFilters({
                                          country: partner.country,
                                          industry: partner.industries[0] || '',
                                          search: partner.name,
                                        });
                                      }}
                                      title="Filter this partner in main directory"
                                      className="p-1.5 text-slate-400 hover:text-lime-600 dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                    >
                                      <Filter className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Suggested follow-up prompt chips */}
                  {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5">
                      {msg.suggestedPrompts.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-[11px] bg-slate-50 hover:bg-lime-50 dark:bg-slate-800/80 dark:hover:bg-lime-950/40 text-slate-700 dark:text-slate-300 hover:text-lime-700 dark:hover:text-lime-300 border border-slate-200 dark:border-slate-700 hover:border-lime-400 px-2.5 py-1 rounded-full text-left transition-all"
                        >
                          💬 {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Thinking / Loading indicator */}
            {isLoading && (
              <div className="flex items-start gap-2 text-slate-500 dark:text-slate-400 text-xs">
                <div className="w-6 h-6 rounded-full bg-lime-400/20 text-lime-600 dark:text-lime-400 flex items-center justify-center shrink-0">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 px-3.5 py-2.5 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Analyzing directory by budget & location
                    </span>
                    <span className="flex gap-1 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse delay-100"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse delay-200"></span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 bg-white dark:bg-[#07162b] border-t border-slate-200 dark:border-slate-800 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g., Retail POS in Nairobi under $1,000..."
                  className="w-full pl-3 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-[13px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-lime-500 focus:ring-1 focus:ring-lime-500"
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
                disabled={isLoading || (!inputText.trim() && !selectedNeed && !selectedBudget && !selectedLocation)}
                className="px-3.5 py-2.5 bg-gradient-to-r from-lime-500 to-emerald-500 hover:from-lime-400 hover:to-emerald-400 text-slate-950 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-lime-500/20 flex items-center justify-center shrink-0"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>

            <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-slate-400">
              <span>Direct access to verified partners in 14 countries</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-lime-500" /> Verified Registry
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
