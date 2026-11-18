import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  BookOpen, 
  Calculator, 
  CreditCard, 
  Boxes, 
  HelpCircle, 
  CheckCircle2,
  Bot
} from 'lucide-react';

interface AILearningAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCourseById: (courseId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedAction?: {
    label: string;
    courseId?: string;
  };
  quiz?: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}

export const AILearningAssistant: React.FC<AILearningAssistantProps> = ({
  isOpen,
  onClose,
  onSelectCourseById
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Hello! I am your MsmeBooks AI Learning Companion. Ask me anything about cloud accounting, POS cashiering, VAT calculations, inventory controls, or ask me to generate a quick practice quiz.'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Generate intelligent grounded AI response based on keywords
    setTimeout(() => {
      const lower = text.toLowerCase();
      let aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: ''
      };

      if (lower.includes('vat') || lower.includes('tax')) {
        aiReply.text = 'In MsmeBooks, the standard Nigerian VAT rate is 7.5%. When you generate an invoice, the system automatically debits Accounts Receivable for the gross amount, credits Sales Revenue for the net sale, and credits VAT Output Payable (Account #2210). This ensures accurate FIRS/LIRS tax reporting without manual journal adjustments.';
        aiReply.suggestedAction = { label: 'Open Cloud Accounting Course', courseId: 'course-1' };
      } else if (lower.includes('pos') || lower.includes('cash') || lower.includes('drawer')) {
        aiReply.text = 'For POS operations, cashier cash drawer integrity is preserved through two mandatory steps: 1) Performing a Mid-Shift Cash Drop when physical cash exceeds insurance limits, and 2) Closing with an End-of-Day Z-Report. MsmeBooks reconciles expected cash vs counted cash and flags any variance immediately.';
        aiReply.suggestedAction = { label: 'Open POS Operations Course', courseId: 'course-2' };
      } else if (lower.includes('inventory') || lower.includes('fifo') || lower.includes('stock')) {
        aiReply.text = 'MsmeBooks uses FIFO (First-In, First-Out) perpetual inventory valuation. When stock is purchased, it is added to Asset #1300 at actual landed cost. Upon POS or invoice sale, Cost of Goods Sold (Account #5000) is automatically debited, preventing artificial profit distortion.';
        aiReply.suggestedAction = { label: 'Open Inventory Management Course', courseId: 'course-3' };
      } else if (lower.includes('quiz') || lower.includes('test') || lower.includes('practice')) {
        aiReply.text = 'Here is a quick practice question to test your MsmeBooks software understanding:';
        aiReply.quiz = {
          question: 'If a customer pays an overdue invoice via direct bank transfer, what does MsmeBooks record?',
          options: [
            'DR: Bank Account (1010) & CR: Accounts Receivable (1200)',
            'DR: Sales Revenue & CR: Bank Account',
            'DR: Petty Cash & CR: Accounts Payable',
            'DR: Retained Earnings & CR: Owner Equity'
          ],
          correct: 0,
          explanation: 'Cash increases in your bank asset account (Debit), and the customer debt is extinguished (Credit to Accounts Receivable).'
        };
      } else {
        aiReply.text = `Great question! In MsmeBooks, workflows are organized by functional business cycles: Sales & Invoicing, Purchases & Payables, Warehouse & Stock, and General Ledger Reporting. You can practice this directly in the Software Sandbox or in our accredited learning paths.`;
        aiReply.suggestedAction = { label: 'View Certified Bookkeeper Path', courseId: 'course-1' };
      }

      setMessages((prev) => [...prev, aiReply]);
      setSelectedQuizAnswer(null);
      setQuizSubmitted(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200">
        
        {/* Assistant Header */}
        <div className="p-4 bg-[#073B75] text-white flex items-center justify-between border-b border-blue-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#72B01D] text-slate-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>MsmeBooks AI Tutor</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-normal">Active</span>
              </h3>
              <p className="text-[10px] text-slate-300">Grounded in MsmeBooks Official Documentation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Prompt Pills */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex gap-1.5 overflow-x-auto text-[11px]">
          <button
            onClick={() => handleSend('Explain Nigerian VAT calculation in MsmeBooks')}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-300 rounded-md whitespace-nowrap text-slate-700 cursor-pointer"
          >
            Explain 7.5% VAT
          </button>
          <button
            onClick={() => handleSend('Generate a practice quiz question')}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-300 rounded-md whitespace-nowrap text-slate-700 cursor-pointer"
          >
            Practice Quiz
          </button>
          <button
            onClick={() => handleSend('How does FIFO inventory work in MsmeBooks?')}
            className="px-2.5 py-1 bg-white border border-slate-200 hover:border-blue-300 rounded-md whitespace-nowrap text-slate-700 cursor-pointer"
          >
            FIFO Valuation
          </button>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#0B4F9C] text-white rounded-br-none'
                    : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                }`}
              >
                <p>{msg.text}</p>

                {/* Embedded Practice Quiz */}
                {msg.quiz && (
                  <div className="mt-3 pt-3 border-t border-slate-300 space-y-2">
                    <p className="font-bold text-slate-900">{msg.quiz.question}</p>
                    <div className="space-y-1.5">
                      {msg.quiz.options.map((opt, optIdx) => {
                        const isSelected = selectedQuizAnswer === optIdx;
                        const isCorrect = optIdx === msg.quiz?.correct;
                        let optClass = 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700';

                        if (quizSubmitted) {
                          if (isCorrect) optClass = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                          else if (isSelected && !isCorrect) optClass = 'bg-rose-100 border-rose-500 text-rose-900';
                        } else if (isSelected) {
                          optClass = 'bg-[#0B4F9C] text-white font-bold border-[#0B4F9C]';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => !quizSubmitted && setSelectedQuizAnswer(optIdx)}
                            className={`w-full text-left p-2 rounded border text-[11px] transition-colors cursor-pointer ${optClass}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {!quizSubmitted ? (
                      <button
                        onClick={() => setQuizSubmitted(true)}
                        disabled={selectedQuizAnswer === null}
                        className="mt-2 w-full py-1.5 bg-[#72B01D] hover:bg-[#5B8D17] text-slate-950 font-bold rounded text-[11px] cursor-pointer"
                      >
                        Check Answer
                      </button>
                    ) : (
                      <div className="p-2 bg-white rounded border border-slate-200 text-[11px] text-slate-700 mt-2">
                        <span className="font-bold text-[#72B01D]">Tutor Note: </span>
                        {msg.quiz.explanation}
                      </div>
                    )}
                  </div>
                )}

                {/* Suggested CTA Action */}
                {msg.suggestedAction && (
                  <button
                    onClick={() => {
                      if (msg.suggestedAction?.courseId) {
                        onSelectCourseById(msg.suggestedAction.courseId);
                        onClose();
                      }
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0B4F9C] hover:underline bg-white px-2.5 py-1 rounded shadow-2xs border border-blue-200 cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#72B01D]" />
                    <span>{msg.suggestedAction.label} →</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask MsmeBooks AI a question..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0B4F9C] focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 bg-[#0B4F9C] hover:bg-[#073B75] text-white rounded-lg transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
