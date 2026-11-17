import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  PhoneCall, 
  Mail, 
  HelpCircle, 
  ShieldCheck, 
  ChevronRight,
  UserCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'team' | 'user';
  text: string;
  time: string;
  options?: string[];
}

export const SupportChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'team',
      text: "Hello! Welcome to MsmeBooks Partner Success Desk. I'm Chidi from the Alliances Team. How can we support your partnership practice today?",
      time: 'Just now',
      options: [
        'How do the 15%–40% commission tiers work?',
        'Can we sync our client data with Caseware / Sage?',
        'How do I receive the official metallic partner badge?',
        'What are the training academy requirements?'
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulated response logic
    setTimeout(() => {
      let replyText = "Thank you for reaching out! A dedicated partnership manager has received your inquiry. We typically reply within 5 minutes or you can email us directly at partners@msmebooks.org.";
      let followUpOptions: string[] | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('commission') || lower.includes('tier') || lower.includes('rate') || lower.includes('%')) {
        replyText = "Our Partner Programme offers 4 lifetime recurring revenue tiers:\n• Bronze: 15% recurring (1–15 clients)\n• Silver: 20% recurring (16–50 clients)\n• Gold: 30% recurring (51–150 clients) + priority lead routing\n• Platinum: 40% recurring (151+ clients) + co-marketing fund & dedicated TAM.";
        followUpOptions = ['How are monthly payouts handled?', 'Can I apply for Gold tier directly?'];
      } else if (lower.includes('audit') || lower.includes('caseware') || lower.includes('sage') || lower.includes('sync')) {
        replyText = "Yes! MsmeBooks features bi-directional 1-click ledger sync with 25+ top audit solutions including Caseware, Sage Pastel, QuickBooks, CaseWare IDEA, and Wolters Kluwer CCH. Your clients' trial balances, general ledgers, and journals export seamlessly.";
        followUpOptions = ['View all 25 audit software integrations', 'Schedule an engineer demo'];
      } else if (lower.includes('badge') || lower.includes('metallic') || lower.includes('certificate')) {
        replyText = "Official verified partners receive customized SVG & vector metal badges (Bronze, Silver, Gold, Platinum) with unique verifiable partner IDs for your website, proposals, and email signatures. You can test your credentials in the Live Certificate Preview studio!";
        followUpOptions = ['Where can I preview my certificate?', 'How is partner ID verified?'];
      } else if (lower.includes('training') || lower.includes('academy') || lower.includes('exam')) {
        replyText = "The MsmeBooks Certification Academy offers hands-on technical tracks for accountants and hardware engineers. Tuition is 100% sponsored for registered partners, and our upcoming quarterly intake has 14 seats open.";
        followUpOptions = ['Reserve a seat in next cohort', 'Download cohort syllabus (.ics)'];
      } else if (lower.includes('call') || lower.includes('meeting') || lower.includes('schedule')) {
        replyText = "We'd love to speak with you! You can book a 15-minute partner discovery call with our West/East Africa director or leave your WhatsApp number here.";
      }

      const teamMsg: ChatMessage = {
        id: `team-${Date.now()}`,
        sender: 'team',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: followUpOptions
      };

      setMessages((prev) => [...prev, teamMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-[92vw] sm:w-96 max-h-[580px] h-[540px] bg-white dark:bg-[#061F4A] rounded-3xl shadow-2xl border-2 border-blue-200 dark:border-blue-700/80 flex flex-col overflow-hidden mb-3 text-slate-900 dark:text-white"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0A3981] via-[#0D47A1] to-[#041533] px-5 py-4 text-white flex items-center justify-between shrink-0 shadow">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-[#8CE600] text-[#061F4A] flex items-center justify-center font-black text-sm shadow">
                    CK
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0A3981] rounded-full" />
                </div>
                <div>
                  <div className="text-sm font-black flex items-center gap-1.5">
                    MsmeBooks Partner Desk
                    <ShieldCheck className="w-4 h-4 text-[#8CE600]" />
                  </div>
                  <div className="text-[11px] text-blue-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Chidi Kalu · Online (Replies in 2m)
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
                aria-label="Close Support Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notice Strip */}
            <div className="bg-blue-50 dark:bg-blue-950/70 px-4 py-2 text-[11px] font-semibold text-[#0A3981] dark:text-sky-300 border-b border-blue-100 dark:border-blue-900/60 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#8CE600]" />
                Direct Channel to Partnerships & Alliances
              </span>
              <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">PAN-AFRICA</span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-line shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#0A3981] dark:bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-[#0A2552] text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-blue-800/80'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 px-1">
                    {msg.time}
                  </span>

                  {/* Pre-canned Suggestions */}
                  {msg.options && msg.options.length > 0 && (
                    <div className="mt-2.5 space-y-1.5 w-full">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(opt)}
                          className="w-full text-left px-3 py-2 text-[11px] font-semibold bg-white dark:bg-[#072457] hover:bg-blue-50 dark:hover:bg-blue-900/40 text-[#0A3981] dark:text-[#8CE600] rounded-xl border border-blue-200 dark:border-blue-700/80 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
                        >
                          <span>{opt}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs px-2 py-1">
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-[#8CE600] animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-[#8CE600] animate-bounce [animation-delay:0.15s]" />
                  <div className="w-2 h-2 rounded-full bg-blue-600 dark:bg-[#8CE600] animate-bounce [animation-delay:0.3s]" />
                  <span className="text-[11px] ml-1">Chidi is typing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-50 dark:bg-[#051838] border-t border-slate-200 dark:border-blue-800 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask a question about the partner program..."
                  className="flex-1 px-3.5 py-2.5 text-xs bg-white dark:bg-[#061F4A] border border-slate-300 dark:border-blue-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] hover:bg-[#082a61] dark:hover:bg-[#9be81c] disabled:opacity-40 rounded-xl transition-all shadow cursor-pointer shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              {/* Direct Channels */}
              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 px-1">
                <span>Direct: partners@msmebooks.org</span>
                <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-[#8CE600]">
                  <CheckCircle2 className="w-3 h-3" /> Live Support Available
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2.5 px-4 py-3 bg-[#0A3981] hover:bg-[#072c66] dark:bg-[#0A3981] dark:hover:bg-[#0c449c] text-white rounded-full shadow-2xl border-2 border-[#8CE600]/80 cursor-pointer transition-all duration-200"
        aria-label="Toggle MsmeBooks Partner Support Chat"
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5 text-[#8CE600]" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0A3981] rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0A3981] rounded-full" />
        </div>
        <span className="text-xs font-bold tracking-tight pr-1">
          {isOpen ? 'Close Chat' : 'Partner Support'}
        </span>

        {hasUnread && !isOpen && (
          <span className="w-2 h-2 rounded-full bg-[#8CE600] animate-pulse" />
        )}
      </motion.button>
    </div>
  );
};
