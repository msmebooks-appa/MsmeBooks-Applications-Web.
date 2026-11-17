import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  TrendingUp,
  AlertTriangle,
  Receipt,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { AI_PROMPTS_EXAMPLES } from '../data/mockData';
import { useCurrency } from '../context/CurrencyContext';

interface AiAssistantProps {
  onOpenStartFree: () => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ onOpenStartFree }) => {
  const { formatAmount } = useCurrency();
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [customInput, setCustomInput] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'user',
      text: AI_PROMPTS_EXAMPLES[0].question,
    },
    {
      sender: 'ai',
      text: AI_PROMPTS_EXAMPLES[0].answer,
      metric: AI_PROMPTS_EXAMPLES[0].metric,
    },
  ]);

  const handleSelectPrompt = (index: number) => {
    setActivePromptIndex(index);
    const item = AI_PROMPTS_EXAMPLES[index];
    setChatLog([
      { sender: 'user', text: item.question },
      { sender: 'ai', text: item.answer, metric: item.metric },
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;

    const userQuestion = customInput;
    setCustomInput('');

    // Add user message
    setChatLog((prev) => [...prev, { sender: 'user', text: userQuestion }]);

    // Simulate smart AI response tailored to African MSMEs
    setTimeout(() => {
      let smartAnswer =
        `Analyzing your general ledger, sales records, and bank statements across all branches... Your average gross margin is currently 32.4%, and working capital is healthy at ${formatAmount(4120000)}.`;
      if (userQuestion.toLowerCase().includes('tax') || userQuestion.toLowerCase().includes('vat')) {
        smartAnswer =
          `Your estimated VAT liability this month is ${formatAmount(245000)}, and WHT withheld on invoices is ${formatAmount(78000)}. All schedules are ready for filing with your local revenue service.`;
      } else if (userQuestion.toLowerCase().includes('staff') || userQuestion.toLowerCase().includes('salary')) {
        smartAnswer =
          `Total payroll for this cycle is ${formatAmount(1250000)} across 14 staff members. PAYE and pension deductions have been computed and are ready for bank disbursement.`;
      }

      setChatLog((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: smartAnswer,
          metric: 'Live Query Processed',
        },
      ]);
    }, 600);
  };

  return (
    <section id="ai-assistant" className="py-20 lg:py-28 bg-[#09122C] text-white relative overflow-hidden">
      {/* Glow Effects (Blue to Lemon Green Glow as requested) */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-[#0866FF]/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#B7F000]/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-[#B7F000] text-xs font-bold uppercase tracking-wider mb-3 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#B7F000]" />
            <span>Intelligent Financial Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display tracking-tight">
            Meet Your AI Business Assistant
          </h2>
          <p className="text-base sm:text-lg text-slate-300 mt-3 leading-relaxed">
            Turn your business data into useful answers, insights and actions. Ask questions in plain English, and get instant answers pulled directly from your sales, stock, and bank records.
          </p>
        </div>

        {/* AI Interactive Chat Console */}
        <div className="max-w-4xl mx-auto">
          {/* Preset Prompts Buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {AI_PROMPTS_EXAMPLES.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPrompt(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                  activePromptIndex === idx
                    ? 'bg-[#0866FF] border-blue-400 text-white shadow-md shadow-blue-500/30 ring-1 ring-[#B7F000]'
                    : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:bg-slate-700/80 hover:text-white'
                }`}
              >
                &ldquo;{p.question}&rdquo;
              </button>
            ))}
          </div>

          {/* Chat Window with Blue-to-Lemon-Green Glow Border */}
          <div className="relative rounded-3xl p-1 bg-gradient-to-r from-[#0866FF] via-sky-400 to-[#B7F000] shadow-2xl">
            <div className="bg-slate-950 rounded-[22px] p-5 sm:p-7 flex flex-col justify-between min-h-[420px]">
              {/* Top Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0866FF] to-[#B7F000] p-0.5">
                    <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                      <Bot className="w-5 h-5 text-[#B7F000]" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-2">
                      <span>MsmeBooks Assistant</span>
                      <span className="text-[10px] bg-[#B7F000] text-slate-950 font-extrabold px-1.5 py-0.2 rounded">
                        Gen-4
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Connected to General Ledger, Inventory &amp; 3 Branches
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-[#B7F000] animate-ping" />
                  <span className="font-mono text-[11px]">Ready</span>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="py-6 space-y-4 overflow-y-auto max-h-[320px]">
                {chatLog.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-lg bg-[#0866FF] flex items-center justify-center shrink-0 mt-0.5 text-white">
                        <Sparkles className="w-4 h-4 text-[#B7F000]" />
                      </div>
                    )}

                    <div
                      className={`max-w-xl p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#0866FF] text-white rounded-br-none shadow-md'
                          : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/80 shadow-lg'
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.metric && (
                        <div className="mt-2.5 pt-2 border-t border-slate-700 flex items-center justify-between text-xs text-[#B7F000] font-semibold">
                          <span>Key Insight:</span>
                          <span className="font-mono bg-slate-900/80 px-2 py-0.5 rounded text-[11px]">
                            {msg.metric}
                          </span>
                        </div>
                      )}
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-slate-300">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Custom Input Form */}
              <form onSubmit={handleSendMessage} className="pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-2xl border border-slate-700 focus-within:border-[#0866FF] transition-colors">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    placeholder="Ask anything: e.g., 'What are my biggest expenses?' or 'Who owes me money?'"
                    className="flex-1 bg-transparent px-3 py-1.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onOpenStartFree}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#B7F000] hover:underline"
            >
              <span>Explore AI Capabilities in your 14-day free trial</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
