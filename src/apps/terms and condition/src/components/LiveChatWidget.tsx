import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Phone, 
  Mail, 
  ExternalLink, 
  HelpCircle,
  FileQuestion,
  Headphones
} from 'lucide-react';
import { DOCUMENT_METADATA } from '../data/termsContent';
import { TranslationDictionary } from '../data/translations';
import { useCurrency } from '../context/CurrencyContext';

interface Message {
  id: string;
  sender: 'agent' | 'user' | 'system';
  text: string;
  timestamp: string;
}

interface LiveChatWidgetProps {
  t: TranslationDictionary;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ t }) => {
  const { currency, currencyInfo } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'channels' | 'faqs'>('chat');
  const [userInput, setUserInput] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Terms & Conditions Clarification');
  const [chatStarted, setChatStarted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      text: 'Hello! Welcome to MsmeBooks Support. How can our legal, billing and customer support team assist you today?',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isOpen, activeTab, isTyping]);

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim()) return;

    setChatStarted(true);
    setMessages(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'system',
        text: `Ticket #MSME-${Math.floor(10000 + Math.random() * 90000)} initiated for ${userName} (${userEmail}) regarding "${selectedTopic}" [Currency: ${currency}]. An agent will respond shortly.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    setUserInput('');
    setIsTyping(true);

    // Realistic agent automated acknowledgment / dispatch
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'agent',
          text: `Thank you, ${userName || 'valued customer'}. Our legal and billing specialists are reviewing your query regarding "${selectedTopic}" (processed in ${currencyInfo.name} - ${currency}). For urgent inquiries, you can also reach us via official WhatsApp at ${DOCUMENT_METADATA.supportPhone}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1200);
  };

  const quickFaqs = [
    {
      q: 'How do I cancel my subscription and export data?',
      a: 'You can cancel anytime via the Account Administration console. As stated in Section 7, you have a 30 to 60-day window to export all accounting ledgers, invoices, and audit trails in CSV or Excel format.'
    },
    {
      q: `What currencies are supported for SaaS billing and invoicing?`,
      a: `MsmeBooks supports 16 global and Pan-African currencies (including ${currency}, NGN, USD, GBP, EUR, KES, ZAR, GHS, and more). Invoices and recurring card charges settle directly in your chosen currency.`
    },
    {
      q: 'Is MsmeBooks compliant with the Nigeria Data Protection Act 2023?',
      a: 'Yes. Under Section 8 of our Terms, MsmeBooks operates strictly as a Data Processor under NDPA 2023 and GDPR provisions with TLS 1.3 encryption and AES-256 database protection.'
    },
    {
      q: 'Are our retail sales payments deposited into MsmeBooks accounts?',
      a: `No. Section 11 and Section 6.5 clarify that client POS transactions process through licensed third-party payment gateways directly into your merchant account in ${currency}; MsmeBooks only charges fixed monthly software subscription fees.`
    },
    {
      q: 'How can I schedule a professional onboarding demo?',
      a: 'You can connect directly with our enterprise implementation team via WhatsApp (+234 915 848 2622) or by emailing support@msmebooks.org.'
    }
  ];

  return (
    <>
      {/* Floating Live Chat Trigger Button at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40 no-print flex flex-col items-end gap-3">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 bg-[#0B3558] dark:bg-[#0E3F6D] text-white hover:bg-[#072238] dark:hover:bg-[#124B82] rounded-full shadow-xl hover:shadow-2xl border-2 border-white/20 dark:border-blue-400/30 transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
            aria-label="Open Live Chat Support"
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#84CC16] rounded-full border-2 border-[#0B3558] dark:border-[#0E3F6D]" />
            </div>
            <span className="text-xs font-bold tracking-wide">{t.chat.triggerLabel}</span>
            <span className="hidden sm:inline-block text-[11px] text-blue-200 dark:text-blue-200">
              · {t.chat.onlineStatus}
            </span>
          </button>
        )}

        {/* Live Chat Dialog */}
        {isOpen && (
          <div className="bg-white dark:bg-[#0A1A2C] w-[92vw] sm:w-[380px] md:w-[410px] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col h-[520px] max-h-[85vh] animate-in fade-in zoom-in-95 duration-150 transition-colors">
            {/* Header */}
            <div className="bg-[#0B3558] dark:bg-[#06182B] text-white p-4 flex items-center justify-between shrink-0 border-b dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="relative p-2 bg-white/10 rounded-xl text-[#84CC16]">
                  <Headphones className="w-5 h-5" />
                  <span className="absolute bottom-1 right-1 w-2 h-2 bg-[#84CC16] rounded-full ring-2 ring-[#0B3558] dark:ring-[#06182B]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight flex items-center gap-1.5">
                    <span>{t.chat.dialogTitle}</span>
                    <span className="text-[10px] font-normal px-1.5 py-0.2 bg-[#84CC16]/20 text-[#84CC16] rounded font-mono">
                      {t.chat.onlineStatus}
                    </span>
                  </h3>
                  <p className="text-[11px] text-blue-200 leading-none mt-0.5">
                    {t.chat.repliesIn}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close live chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Segmented Navigation Tabs */}
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0D2238] px-3 pt-2 text-xs font-semibold shrink-0 transition-colors">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-2 text-center border-b-2 transition-all ${
                  activeTab === 'chat'
                    ? 'border-[#84CC16] text-[#0B3558] dark:text-[#84CC16] font-bold bg-white dark:bg-[#0A1A2C] rounded-t-lg'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t.chat.tabChat}
              </button>
              <button
                onClick={() => setActiveTab('channels')}
                className={`flex-1 py-2 text-center border-b-2 transition-all ${
                  activeTab === 'channels'
                    ? 'border-[#84CC16] text-[#0B3558] dark:text-[#84CC16] font-bold bg-white dark:bg-[#0A1A2C] rounded-t-lg'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t.chat.tabChannels}
              </button>
              <button
                onClick={() => setActiveTab('faqs')}
                className={`flex-1 py-2 text-center border-b-2 transition-all ${
                  activeTab === 'faqs'
                    ? 'border-[#84CC16] text-[#0B3558] dark:text-[#84CC16] font-bold bg-white dark:bg-[#0A1A2C] rounded-t-lg'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {t.chat.tabFaqs}
              </button>
            </div>

            {/* Tab 1: Agent Chat */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/40 dark:bg-[#07131F]/40 transition-colors">
                {!chatStarted ? (
                  /* Initial Intake Form */
                  <form onSubmit={handleStartChat} className="p-5 flex-1 overflow-y-auto space-y-3.5 text-xs">
                    <div className="p-3 bg-[#F0F7FD] dark:bg-[#0D2238] border border-blue-200/60 dark:border-blue-900/60 rounded-xl text-slate-700 dark:text-slate-300 space-y-1">
                      <span className="font-bold text-[#0B3558] dark:text-[#84CC16] block">{t.chat.startTitle}</span>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                        {t.chat.startDesc}
                      </p>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.chat.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={t.chat.namePlaceholder}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-[#07131F] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0B3558] dark:focus:ring-[#84CC16]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.chat.emailLabel}
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={t.chat.emailPlaceholder}
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-[#07131F] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0B3558] dark:focus:ring-[#84CC16]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.chat.topicLabel}
                      </label>
                      <select
                        value={selectedTopic}
                        onChange={(e) => setSelectedTopic(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-[#07131F] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#0B3558] dark:focus:ring-[#84CC16]"
                      >
                        <option>Terms & Conditions Clarification</option>
                        <option>Billing, Invoicing & VAT ({currency})</option>
                        <option>Subscription Upgrade / Enterprise Plan</option>
                        <option>POS & Multi-Location Hardware</option>
                        <option>NDPA Data Protection & Privacy</option>
                        <option>Partner & Reseller Program</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 py-2.5 px-4 bg-[#0B3558] dark:bg-[#0E3F6D] hover:bg-[#072238] dark:hover:bg-[#124B82] text-white font-bold rounded-lg transition-colors shadow-sm"
                    >
                      {t.chat.connectBtn}
                    </button>
                  </form>
                ) : (
                  /* Live Chat Stream */
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${
                            msg.sender === 'user' ? 'items-end' : 'items-start'
                          }`}
                        >
                          {msg.sender === 'system' ? (
                            <div className="w-full text-center my-1">
                              <span className="inline-block px-2.5 py-1 text-[10px] bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
                                {msg.text}
                              </span>
                            </div>
                          ) : (
                            <div
                              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                                msg.sender === 'user'
                                  ? 'bg-[#0B3558] dark:bg-[#0E3F6D] text-white rounded-br-xs'
                                  : 'bg-white dark:bg-[#0D2238] border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 rounded-bl-xs shadow-2xs'
                              }`}
                            >
                              <p>{msg.text}</p>
                              <span
                                className={`block text-[9px] mt-1 text-right ${
                                  msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400 dark:text-slate-500'
                                }`}
                              >
                                {msg.timestamp}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs px-2 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:0.2s]" />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce [animation-delay:0.4s]" />
                          <span className="text-[11px] ml-1">{t.chat.typingIndicator}</span>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Bar */}
                    <form
                      onSubmit={handleSendMessage}
                      className="p-3 bg-white dark:bg-[#0A1A2C] border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder={t.chat.typePlaceholder}
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-[#07131F] border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:bg-white dark:focus:bg-[#0A1A2C] focus:ring-1 focus:ring-[#0B3558] dark:focus:ring-[#84CC16] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      />
                      <button
                        type="submit"
                        disabled={!userInput.trim()}
                        className={`p-2 rounded-lg transition-colors ${
                          userInput.trim()
                            ? 'bg-[#0B3558] dark:bg-[#0E3F6D] text-white hover:bg-[#072238] dark:hover:bg-[#124B82]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                        }`}
                        aria-label="Send message"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            )}

            {/* Tab 2: Channels */}
            {activeTab === 'channels' && (
              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
                <div className="p-3 bg-[#F0F7FD] dark:bg-[#0D2238] border border-blue-200/60 dark:border-blue-900/60 rounded-xl space-y-1">
                  <span className="font-bold text-[#0B3558] dark:text-[#84CC16] block">{t.chat.directDesksTitle}</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400">
                    {t.chat.directDesksDesc}
                  </p>
                </div>

                {/* WhatsApp Channel */}
                <a
                  href={`https://wa.me/2349158482622?text=Hello%20MsmeBooks%20Support,%20I%20have%20an%20inquiry%20regarding%20the%20Terms%20and%20Conditions%20and%20billing%20in%20${currency}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl flex items-start gap-3 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/70 transition-colors group"
                >
                  <div className="p-2 bg-emerald-600 text-white rounded-lg shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 dark:text-emerald-100">{t.chat.whatsappTitle}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="font-mono text-emerald-800 dark:text-emerald-300 font-semibold block mt-0.5">
                      +234 915 848 2622
                    </span>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300/80 mt-1">
                      {t.chat.whatsappDesc}
                    </p>
                  </div>
                </a>

                {/* Support Email */}
                <a
                  href={`mailto:${DOCUMENT_METADATA.supportEmail}?subject=Support Inquiry - MsmeBooks Platform (${currency})`}
                  className="p-3.5 bg-white dark:bg-[#0D2238] border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-[#112A45] transition-colors group"
                >
                  <div className="p-2 bg-[#0B3558] text-white rounded-lg shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{t.chat.supportDeskTitle}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-[#0B3558] dark:text-[#38BDF8] font-semibold block mt-0.5">
                      {DOCUMENT_METADATA.supportEmail}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {t.chat.supportDeskDesc}
                    </p>
                  </div>
                </a>

                {/* Legal Desk */}
                <a
                  href={`mailto:${DOCUMENT_METADATA.legalEmail}?subject=Legal Inquiry - Terms and Conditions (${currency})`}
                  className="p-3.5 bg-white dark:bg-[#0D2238] border border-slate-200 dark:border-slate-800 rounded-xl flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-[#112A45] transition-colors group"
                >
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 text-[#0B3558] dark:text-[#84CC16] rounded-lg shrink-0">
                    <FileQuestion className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{t.chat.legalDeskTitle}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-[#0B3558] dark:text-[#38BDF8] font-semibold block mt-0.5">
                      {DOCUMENT_METADATA.legalEmail}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {t.chat.legalDeskDesc}
                    </p>
                  </div>
                </a>
              </div>
            )}

            {/* Tab 3: FAQs */}
            {activeTab === 'faqs' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {t.chat.commonFaqsTitle}
                </div>
                {quickFaqs.map((faq, idx) => (
                  <div key={idx} className="p-3 bg-white dark:bg-[#0D2238] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-2xs">
                    <h4 className="font-bold text-[#0B3558] dark:text-white flex items-start gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#84CC16] shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pl-5">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
