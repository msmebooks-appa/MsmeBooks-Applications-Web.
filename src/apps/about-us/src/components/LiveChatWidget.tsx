import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  MessageSquare, 
  X, 
  Send, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight,
  ShieldCheck,
  User,
  Headphones
} from 'lucide-react';

export const LiveChatWidget: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'chat' | 'channels'>('chat');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'agent' | 'user'; text: string; time: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Initialize or update initial welcome message if user has not yet interacted
    if (!hasStarted) {
      setChatMessages([
        {
          sender: 'agent',
          text: t.chat_welcome_msg,
          time: 'Just now',
        },
      ]);
    }
  }, [t.chat_welcome_msg, hasStarted]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: now },
    ]);
    setInputMessage('');
    setHasStarted(true);

    // Realistic support agent response in current language
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: t.chat_simulated_reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  const handleQuickQuestion = (q: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: q, time: now },
    ]);
    setHasStarted(true);

    setTimeout(() => {
      let reply = t.chat_simulated_reply;
      if (q === t.chat_q1) {
        reply = "MsmeBooks POS connects directly with USB and Bluetooth thermal receipt printers, barcode scanners, and cash drawers. Both Android tablets and Windows PCs are supported!";
      } else if (q === t.chat_q2) {
        reply = "Yes! You can manage multiple branches under one organization subscription, with inter-branch transfers and consolidated financial reporting.";
      } else if (q === t.chat_q3) {
        reply = "You can start with our 14-day free trial immediately without a credit card. All Accounting, Inventory, and POS features are unlocked!";
      }

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'agent',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 900);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Help Dialog Popover */}
      {isOpen && (
        <div 
          className="mb-3 w-[92vw] sm:w-96 max-h-[580px] bg-white dark:bg-black rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-200 text-slate-800 dark:text-slate-100"
          role="dialog"
          aria-label="MsmeBooks Support Chat"
        >
          {/* Header */}
          <div className="bg-[#0B4EA2] px-5 py-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <Headphones className="w-5 h-5 text-lime-400" />
                </div>
                {/* Active Support Status indicator */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#84CC16] ring-2 ring-[#0B4EA2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold">{t.chat_title}</h3>
                </div>
                <p className="text-[11px] text-blue-100 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-lime-400"></span>
                  <span>{t.chat_agent_online}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close live chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader / Tabs */}
          <div className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('chat')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  view === 'chat'
                    ? 'bg-white dark:bg-zinc-800 text-[#0B4EA2] dark:text-[#38BDF8] shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.chat_tab_live}
              </button>
              <button
                onClick={() => setView('channels')}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  view === 'channels'
                    ? 'bg-white dark:bg-zinc-800 text-[#0B4EA2] dark:text-[#38BDF8] shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.chat_tab_channels}
              </button>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{t.chat_hours_tag}</span>
          </div>

          {/* View: Channels Tab */}
          {view === 'channels' ? (
            <div className="p-5 overflow-y-auto space-y-4 max-h-[420px] text-xs">
              <div>
                <span className="text-slate-500 font-medium uppercase tracking-wider text-[10px] block mb-2">
                  {t.chat_instant_channels}
                </span>
                <div className="space-y-2.5">
                  <a
                    href="tel:+2349158482622"
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-[#0B4EA2] bg-slate-50 dark:bg-zinc-900 hover:bg-blue-50/50 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-[#0B4EA2] dark:text-[#38BDF8] flex items-center justify-center">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white group-hover:text-[#0B4EA2] dark:group-hover:text-[#38BDF8]">{t.chat_phone_label}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">+234 915 848 2622</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B4EA2]" />
                  </a>

                  <a
                    href="mailto:support@msmebooks.org"
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 hover:border-[#0B4EA2] bg-slate-50 dark:bg-zinc-900 hover:bg-blue-50/50 dark:hover:bg-zinc-800 flex items-center justify-between transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-950/60 text-[#65A30D] dark:text-lime-400 flex items-center justify-center">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white group-hover:text-[#0B4EA2] dark:group-hover:text-[#38BDF8]">{t.chat_email_label}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">support@msmebooks.org</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B4EA2]" />
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider text-[10px] block mb-2">
                  {t.chat_operating_hours_title}
                </span>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-slate-300 space-y-1.5 leading-relaxed">
                  <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-[#38BDF8]" />
                    <span>{t.chat_operating_hours_text}</span>
                  </div>
                  <p className="text-[11px]">{t.chat_enterprise_note}</p>
                </div>
              </div>

              <button
                onClick={() => setView('chat')}
                className="w-full py-2.5 bg-[#0B4EA2] text-white rounded-xl font-semibold hover:bg-[#083770] transition-colors cursor-pointer"
              >
                {t.chat_return_to_chat}
              </button>
            </div>
          ) : (
            /* View: Live Chat Tab */
            <div className="flex flex-col flex-1 h-[420px]">
              
              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50 dark:bg-black">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#0B4EA2] text-white rounded-tr-xs'
                          : 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-zinc-800 shadow-xs rounded-tl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))}

                {/* Quick questions suggestions when user hasn't typed much */}
                {!hasStarted && (
                  <div className="pt-2">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block mb-2">
                      {t.chat_faq_hint}
                    </span>
                    <div className="space-y-1.5">
                      {[
                        t.chat_q1,
                        t.chat_q2,
                        t.chat_q3,
                      ].map((q, i) => (
                        <button
                          key={i}
                          onClick={() => handleQuickQuestion(q)}
                          className="w-full text-left p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-[#0B4EA2] dark:hover:border-[#38BDF8] hover:bg-blue-50/30 dark:hover:bg-zinc-800 text-[11px] text-slate-700 dark:text-slate-200 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>{q}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input Footer */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-zinc-950 border-t border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={t.chat_input_placeholder}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#0B4EA2]/30 focus:border-[#0B4EA2] text-xs text-slate-900 dark:text-white bg-white dark:bg-zinc-900 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="p-2.5 bg-[#0B4EA2] text-white rounded-xl hover:bg-[#083770] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 cursor-pointer"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 text-lime-300" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>{t.chat_secure_connection}</span>
                  <span className="text-[#65A30D] dark:text-lime-400 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Secure
                  </span>
                </div>
              </form>

            </div>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#0B4EA2] hover:bg-[#083770] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer border-2 border-white dark:border-zinc-800 focus:outline-none focus:ring-4 focus:ring-[#0B4EA2]/20"
        aria-label="Open live support chat"
        aria-expanded={isOpen}
      >
        <div className="relative">
          {isOpen ? (
            <X className="w-5 h-5 text-lime-400" />
          ) : (
            <MessageSquare className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
          )}
          {/* Green Online Pulse Dot */}
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#84CC16] ring-2 ring-[#0B4EA2]" />
        </div>

        <span className="text-xs font-semibold tracking-wide whitespace-nowrap">
          {isOpen ? t.chat_button_close : t.chat_button_label}
        </span>
      </button>
    </div>
  );
};
