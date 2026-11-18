import React, { useState, useRef, useEffect } from 'react';
import { FaqItemData } from '../types/faq';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ArrowRight,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  RefreshCw,
  HelpCircle
} from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  faqs: FaqItemData[];
  onSelectFaqSlug: (slug: string) => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  citations?: { title: string; slug: string; shortAnswer: string }[];
  timestamp: string;
  isEscalation?: boolean;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  faqs,
  onSelectFaqSlug
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: "Hi! I'm your MsmeBooks Help Assistant. Ask me anything about our accounting, POS, inventory, pricing, industry solutions, or getting started.",
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    'How does offline POS mode work?',
    'Can I migrate my records from Sage 50?',
    'Does MsmeBooks have a Hotel PMS?',
    'What are the partner commission tiers?',
    'Is there a free plan for small businesses?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Grounded Retrieval Augmented Generation (RAG) algorithm over verified FAQs
  const generateGroundedResponse = (query: string): { text: string; citations: { title: string; slug: string; shortAnswer: string }[]; isEscalation?: boolean } => {
    const qLower = query.toLowerCase().trim();
    
    // Find matching FAQs by matching keywords, questions, or text
    const scoredFaqs = faqs.map((faq) => {
      let score = 0;
      const qWords = qLower.split(/\s+/).filter((w) => w.length > 2);

      if (faq.question.toLowerCase().includes(qLower)) score += 10;
      if (faq.shortAnswer.toLowerCase().includes(qLower)) score += 5;
      
      qWords.forEach((word) => {
        if (faq.question.toLowerCase().includes(word)) score += 3;
        if (faq.keywords.some((k) => k.toLowerCase().includes(word))) score += 2;
        if (faq.detailedAnswer.toLowerCase().includes(word)) score += 1;
      });

      return { faq, score };
    });

    scoredFaqs.sort((a, b) => b.score - a.score);
    const topMatches = scoredFaqs.filter((item) => item.score > 2).slice(0, 3);

    if (topMatches.length > 0) {
      const best = topMatches[0].faq;
      const citations = topMatches.map((m) => ({
        title: m.faq.question,
        slug: m.faq.slug,
        shortAnswer: m.faq.shortAnswer
      }));

      return {
        text: `${best.shortAnswer} \n\n${best.detailedAnswer}`,
        citations
      };
    }

    // Fallback escalation if no confident match
    return {
      text: "I want to make sure you get exact, verified information. While I don't have an approved knowledge base article matching that specific phrasing, our support specialists and sales team can assist you directly.",
      citations: [],
      isEscalation: true
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    setTimeout(() => {
      const response = generateGroundedResponse(query);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        citations: response.citations,
        isEscalation: response.isEscalation,
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsThinking(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#131E36] w-full max-w-2xl h-[620px] max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-300">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1254B5] to-[#0A3D87] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-[#B7E522]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">Ask MsmeBooks AI</h3>
                <span className="text-[10px] font-bold bg-[#B7E522] text-[#17233D] px-2 py-0.5 rounded-full">
                  Grounded RAG
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Answers retrieved strictly from approved MsmeBooks knowledge base.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conversation Message List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 dark:bg-[#0B132B] text-sm transition-colors duration-300">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-[#1254B5] text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                  <Bot className="w-4 h-4 text-[#B7E522]" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#1254B5] text-white rounded-tr-none'
                    : 'bg-white dark:bg-[#1A2642] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 shadow-2xs rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line text-xs sm:text-sm">
                  {msg.text}
                </div>

                {/* Citations & Source Links (Section 25) */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-750">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      Grounded Sources ({msg.citations.length}):
                    </span>
                    <div className="space-y-1.5">
                      {msg.citations.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            onClose();
                            onSelectFaqSlug(c.slug);
                          }}
                          className="w-full text-left p-2 rounded-lg bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-slate-700 dark:text-slate-200 text-xs transition border border-blue-100 dark:border-blue-900/50 flex items-center justify-between group cursor-pointer"
                        >
                          <span className="font-semibold text-[#1254B5] dark:text-blue-300 group-hover:underline truncate pr-2">
                            {c.title}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522] flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Human Escalation Card if Unresolved */}
                {msg.isEscalation && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-2">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                      <PhoneCall className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                      Direct Human Support
                    </div>
                    <p>
                      Speak directly with our team at <strong>+2349158482622</strong> or schedule a product walkthrough.
                    </p>
                    <a
                      href="tel:+2349158482622"
                      className="inline-block px-3 py-1 bg-[#1254B5] hover:bg-[#0A3D87] text-white rounded-md font-bold text-xs"
                    >
                      Call Support
                    </a>
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3 items-center text-slate-500 dark:text-slate-400 text-xs">
              <div className="w-8 h-8 rounded-full bg-[#1254B5] text-white flex items-center justify-center">
                <Bot className="w-4 h-4 text-[#B7E522]" />
              </div>
              <div className="bg-white dark:bg-[#1A2642] p-3 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <RefreshCw className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522] animate-spin" />
                <span>Searching verified knowledge base...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Sample Questions */}
        <div className="px-4 py-2 bg-slate-100/70 dark:bg-[#0E1726] border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-400 dark:text-slate-500 font-semibold flex-shrink-0">Suggestions:</span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="flex-shrink-0 bg-white dark:bg-[#1A2642] hover:bg-blue-50 dark:hover:bg-[#223359] text-slate-700 dark:text-slate-200 hover:text-[#1254B5] dark:hover:text-[#B7E522] px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-2xs transition cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white dark:bg-[#131E36] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 transition-colors duration-300"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your question (e.g. How do I start using POS?)..."
            className="flex-1 py-2.5 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0B132B] focus:outline-none focus:border-[#1254B5] dark:focus:border-blue-500 focus:ring-2 focus:ring-[#1254B5]/15 text-xs sm:text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isThinking}
            className="p-2.5 rounded-xl bg-[#1254B5] hover:bg-[#0A3D87] disabled:opacity-40 text-white transition shadow-sm cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Safety & RAG Disclosure Footer */}
        <div className="bg-slate-50 dark:bg-[#0B132B] py-1.5 px-4 text-[10px] text-slate-400 dark:text-slate-500 text-center border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2">
          <span>AI outputs are grounded in verified documentation. No private ledger data is logged.</span>
        </div>
      </div>
    </div>
  );
};
