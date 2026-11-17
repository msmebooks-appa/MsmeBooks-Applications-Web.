import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, X, Check, ShieldAlert, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';
import { AIAssistantMessage, Company, Branch, UserRole } from '../../types';

interface MsmeBooksAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
  branch: Branch;
  role: UserRole;
}

const SAMPLE_PROMPTS = [
  'How much did we sell this month?',
  'Which products are running low?',
  'Show me my outstanding invoices.',
  'What were my top-selling products?',
  'Compare this month\'s sales with last month.',
  'Which branch generated the highest revenue?',
];

export const MsmeBooksAIModal: React.FC<MsmeBooksAIModalProps> = ({
  isOpen,
  onClose,
  company,
  branch,
  role,
}) => {
  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      content: `Hello! I am your MsmeBooks AI Assistant. I have live, permission-governed access to ${company.name} (${branch.name}). Ask me anything regarding sales, inventory, or operational KPIs.`,
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSendPrompt = (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: AIAssistantMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsTyping(true);

    // Permission Check: If POS Operator asks about executive ledger/invoices
    const isRestrictedForCashier =
      role === 'pos_operator' &&
      (promptText.toLowerCase().includes('invoices') ||
        promptText.toLowerCase().includes('profit') ||
        promptText.toLowerCase().includes('revenue'));

    setTimeout(() => {
      setIsTyping(false);

      if (isRestrictedForCashier) {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai_${Date.now()}`,
            sender: 'assistant',
            content: `Security Restriction: Your current assigned role (${role.replace(
              '_',
              ' '
            )}) does not have authorized permission to inspect executive ledger balances or cross-branch profit analytics. Please consult your Store Manager or Business Owner.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }

      // Generate intelligent context-aware responses
      let aiContent = '';
      let dataSnippet: AIAssistantMessage['dataSnippet'] | undefined;

      const lower = promptText.toLowerCase();

      if (lower.includes('sell this month') || lower.includes('sales')) {
        aiContent = `For ${company.name} across ${branch.name}, total sales recorded this month stand at ${company.currencySymbol}42,850,000 across 1,840 POS & wholesale transactions.`;
        dataSnippet = {
          type: 'metric',
          title: 'Monthly Sales Performance',
          items: [
            { label: 'Total Revenue', value: `${company.currencySymbol}42.85M`, delta: '+14.2% vs last month' },
            { label: 'Daily Average', value: `${company.currencySymbol}2.14M`, delta: 'Top day: Friday' },
            { label: 'Avg Basket Size', value: `${company.currencySymbol}23,280`, delta: 'Retail counter' },
          ],
        };
      } else if (lower.includes('running low') || lower.includes('stock')) {
        aiContent = `Here are the 4 fast-moving inventory items currently below minimum safety reorder thresholds at ${branch.name}:`;
        dataSnippet = {
          type: 'table',
          title: 'Critical Low Stock Alerts',
          items: [
            { label: 'Dangote Sugar 50kg (Sacks)', value: '6 units left', delta: 'Reorder level: 25' },
            { label: 'Golden Penny Vegetable Oil 5L', value: '11 cartons left', delta: 'Reorder level: 40' },
            { label: 'Milo Refill Pack 500g', value: '14 units left', delta: 'Reorder level: 50' },
            { label: 'Ariel Washing Powder 1kg', value: '8 units left', delta: 'Reorder level: 30' },
          ],
        };
      } else if (lower.includes('outstanding invoices') || lower.includes('invoice')) {
        aiContent = `You have 5 outstanding customer invoices totaling ${company.currencySymbol}6,420,000, of which 2 are overdue past 30 days.`;
        dataSnippet = {
          type: 'table',
          title: 'Overdue & Pending Invoices',
          items: [
            { label: 'INV-2026-089 (Eko Logistics Ltd)', value: `${company.currencySymbol}3,200,000`, delta: 'Overdue 14 days' },
            { label: 'INV-2026-092 (Zenith Caterers)', value: `${company.currencySymbol}1,850,000`, delta: 'Due in 3 days' },
            { label: 'INV-2026-095 (Lekki Palms Store)', value: `${company.currencySymbol}1,370,000`, delta: 'Due in 7 days' },
          ],
        };
      } else if (lower.includes('top-selling') || lower.includes('top selling')) {
        aiContent = `The top-selling products by revenue volume at ${branch.name} this week:`;
        dataSnippet = {
          type: 'table',
          title: 'Top Fast-Moving SKUs',
          items: [
            { label: 'Peak Milk Powder 400g Tin', value: '840 units sold', delta: `${company.currencySymbol}3.15M` },
            { label: 'Indomie Instant Noodles Carton', value: '620 cartons sold', delta: `${company.currencySymbol}4.34M` },
            { label: 'Nestle Pure Life 75cl (Pack)', value: '580 packs sold', delta: `${company.currencySymbol}1.16M` },
          ],
        };
      } else if (lower.includes('compare') || lower.includes('last month')) {
        aiContent = `Month-over-Month comparison: Gross sales increased by +14.2% while inventory shrinkage decreased by -3.1% due to strict barcode scans at registers.`;
        dataSnippet = {
          type: 'metric',
          title: 'MoM Comparison vs Previous Month',
          items: [
            { label: 'Gross Revenue', value: `${company.currencySymbol}42.85M`, delta: '↑ +14.2%' },
            { label: 'Gross Margin', value: '28.4%', delta: '↑ +1.8%' },
            { label: 'Net Profit', value: `${company.currencySymbol}12.18M`, delta: '↑ +9.4%' },
          ],
        };
      } else if (lower.includes('highest revenue') || lower.includes('branch')) {
        aiContent = `Among all ${company.branchesCount} registered branches, Victoria Island Head Office generated the highest revenue (${company.currencySymbol}24.8M, 58% of total volume).`;
        dataSnippet = {
          type: 'table',
          title: 'Branch Revenue Share',
          items: [
            { label: 'LOS-01 (Victoria Island HQ)', value: `${company.currencySymbol}24,800,000`, delta: '58% share' },
            { label: 'LOS-02 (Ikeja Commercial)', value: `${company.currencySymbol}11,450,000`, delta: '27% share' },
            { label: 'LOS-03 (Lekki Phase 1)', value: `${company.currencySymbol}6,600,000`, delta: '15% share' },
          ],
        };
      } else {
        aiContent = `Regarding "${promptText}": I have analyzed the active ledger for ${company.name}. All figures are balanced, bank feeds are synchronized, and tax compliance is up to date for this period.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'assistant',
          content: aiContent,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dataSnippet,
        },
      ]);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[620px] max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#072644] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#84CC16] text-[#072644] flex items-center justify-center font-bold shadow-md shadow-[#84CC16]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-tight text-white">
                  Ask MsmeBooks AI
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#84CC16]/20 text-[#9AE61C] uppercase">
                  Real-Time Copilot
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Grounded in {company.name} ({branch.name}) • Role: {role.replace('_', ' ')}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-[#0F4C81] text-white'
                    : 'bg-[#84CC16] text-[#072644] shadow-xs'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#0F4C81] text-white rounded-tr-xs'
                    : 'bg-white border border-slate-200 text-[#072644] rounded-tl-xs'
                }`}
              >
                <p className="font-medium">{msg.content}</p>

                {/* Data Snippet Card if present */}
                {msg.dataSnippet && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-left">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 text-xs font-bold text-[#0F4C81]">
                      <span>{msg.dataSnippet.title}</span>
                      <BarChart3 className="w-3.5 h-3.5 text-[#84CC16]" />
                    </div>

                    <div className="space-y-1.5">
                      {msg.dataSnippet.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs py-1 px-1.5 rounded-md hover:bg-white"
                        >
                          <span className="font-medium text-slate-700">{item.label}</span>
                          <div className="text-right">
                            <span className="font-bold text-[#072644] block">{item.value}</span>
                            {item.delta && (
                              <span className="text-[10px] text-[#65A30D] font-semibold">
                                {item.delta}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <span
                  className={`block text-[10px] mt-1 ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
              <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-bounce [animation-delay:0.4s]" />
              <span>MsmeBooks AI is analyzing business data...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-white border-t border-slate-200 overflow-x-auto flex items-center gap-2 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
            Suggested:
          </span>
          {SAMPLE_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSendPrompt(prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-[#84CC16]/20 hover:text-[#072644] text-slate-600 font-medium whitespace-nowrap transition-colors border border-slate-200 text-xs cursor-pointer flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendPrompt(inputPrompt);
          }}
          className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask about sales, low inventory, tax or branch revenues..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 focus:border-[#0F4C81] focus:ring-2 focus:ring-[#0F4C81]/15 text-sm text-[#072644] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isTyping}
            className="px-4 py-2.5 rounded-xl bg-[#0F4C81] hover:bg-[#0A365C] disabled:opacity-50 text-white font-bold text-sm flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
