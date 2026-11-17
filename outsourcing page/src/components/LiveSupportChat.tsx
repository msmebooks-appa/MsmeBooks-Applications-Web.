import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Headphones, 
  Sparkles, 
  PhoneCall, 
  Calendar, 
  Calculator, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Minimize2,
  WifiOff,
  Wifi,
  CornerDownLeft
} from 'lucide-react';
import { CountryInfo, CurrencyCode } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatPrice } from '../utils/currency';

interface LiveSupportChatProps {
  selectedCountry: CountryInfo;
  selectedCurrency: CurrencyCode;
  effectiveOnline: boolean;
  onOpenConsultation: () => void;
  onOpenCalculator: () => void;
  onOpenPortal: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'advisor' | 'user';
  text: string;
  timestamp: string;
  isQueuedOffline?: boolean;
  actionButton?: {
    label: string;
    action: () => void;
  };
}

export const LiveSupportChat: React.FC<LiveSupportChatProps> = ({
  selectedCountry,
  selectedCurrency,
  effectiveOnline,
  onOpenConsultation,
  onOpenCalculator,
  onOpenPortal,
}) => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getInitialMessages = (): ChatMessage[] => [
    {
      id: 'm-1',
      sender: 'advisor',
      text: language === 'fr'
        ? `Bonjour ! Je suis Folake Coker, Associée Conseil chez MsmeBooks. Vous recherchez des services d'externalisation comptable, fiscale ou paie pour ${selectedCountry.name} ? Comment puis-je vous aider ?`
        : `Hello! I'm Folake Coker, Senior Advisory Partner at MsmeBooks. Looking for outsourced bookkeeping, payroll, or statutory tax filings in ${selectedCountry.name}? How can our advisory team assist you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);

  // Update initial greeting if language or country changes and only 1 message exists
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'm-1') {
      setMessages(getInitialMessages());
    }
  }, [language, selectedCountry.name]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  // When coming back online, update any queued messages
  useEffect(() => {
    if (effectiveOnline) {
      setMessages((prev) =>
        prev.map((m) => (m.isQueuedOffline ? { ...m, isQueuedOffline: false } : m))
      );
    }
  }, [effectiveOnline]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isQueuedOffline: !effectiveOnline,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');

    // Trigger simulated advisor response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      generateAdvisorResponse(text);
    }, 1200);
  };

  const generateAdvisorResponse = (query: string) => {
    const lower = query.toLowerCase();
    let replyText = '';
    let actionBtn: { label: string; action: () => void } | undefined;

    if (lower.includes('price') || lower.includes('pricing') || lower.includes('cost') || lower.includes('tarif') || lower.includes('prix') || lower.includes('quote') || lower.includes('devis')) {
      replyText = language === 'fr'
        ? `Nos plans d'abonnement débutent à partir de ${formatPrice(75, selectedCurrency)}/mois avec un comptable dédié agréé, rapprochements bancaires et déclarations fiscales incluses.`
        : `Our flexible monthly plans start from ${formatPrice(75, selectedCurrency)}/mo. This includes a dedicated certified accountant, monthly ledger closes, and full tax reporting.`;
      actionBtn = {
        label: language === 'fr' ? 'Ouvrir le Calculateur de Tarifs' : 'Open Pricing Calculator',
        action: () => {
          onOpenCalculator();
          setIsOpen(false);
        }
      };
    } else if (lower.includes('tax') || lower.includes('impôt') || lower.includes('fiscale') || lower.includes('compliance') || lower.includes('firs') || lower.includes('kra') || lower.includes('dgi') || lower.includes('sars')) {
      replyText = language === 'fr'
        ? `Nous prenons en charge l'ensemble des obligations fiscales pour ${selectedCountry.name} (TVA, déclarations des retenues à la source, impôt sur les sociétés et attestations de régularité fiscale). Vos dossiers sont audités et certifiés.`
        : `We handle end-to-end statutory tax compliance in ${selectedCountry.name} (VAT, PAYE/Withholding Tax, Corporate Income Tax, and annual audited financials). All filings are executed by verified local practitioners.`;
      actionBtn = {
        label: language === 'fr' ? 'Prendre Rendez-vous Fiscal' : 'Book Free Tax Consultation',
        action: () => {
          onOpenConsultation();
          setIsOpen(false);
        }
      };
    } else if (lower.includes('payroll') || lower.includes('paie') || lower.includes('salary') || lower.includes('salaire') || lower.includes('pension')) {
      replyText = language === 'fr'
        ? `Notre pôle d'externalisation de paie gère les bulletins de paie certifiés, les cotisations sociales (CNPS/Caisse de retraite) et les virements directs de salaires dans votre monnaie locale (${selectedCurrency}).`
        : `Our outsourced payroll service delivers automated monthly payslips, statutory pension remittances, and direct batch bank disbursements in ${selectedCurrency}.`;
      actionBtn = {
        label: language === 'fr' ? 'Configurer la Paie' : 'Configure Payroll Plan',
        action: () => {
          onOpenCalculator();
          setIsOpen(false);
        }
      };
    } else if (lower.includes('consult') || lower.includes('call') || lower.includes('meeting') || lower.includes('rendez-vous') || lower.includes('parler') || lower.includes('speak')) {
      replyText = language === 'fr'
        ? `Je serais ravie d'organiser un échange de 30 minutes avec vous ou votre directeur financier afin d'analyser vos volumes et de concevoir une équipe d'externalisation sur mesure.`
        : `I'd be glad to schedule a 30-minute discovery session with you or your finance leadership to map out your transaction volume and assign your dedicated pod.`;
      actionBtn = {
        label: language === 'fr' ? 'Planifier une Consultation' : 'Schedule Discovery Call',
        action: () => {
          onOpenConsultation();
          setIsOpen(false);
        }
      };
    } else if (lower.includes('whatsapp')) {
      replyText = language === 'fr'
        ? `Vous pouvez échanger directement avec notre permanence conseil sur WhatsApp au +234 800 000 0000. Cliquez ci-dessous pour ouvrir la conversation instantanément.`
        : `You can reach our senior advisory desk directly on WhatsApp at +234 800 000 0000. Click below to initiate an instant encrypted chat.`;
      actionBtn = {
        label: 'Open WhatsApp Chat',
        action: () => {
          window.open('https://wa.me/2348000000000', '_blank', 'noopener,noreferrer');
        }
      };
    } else {
      replyText = language === 'fr'
        ? `Merci pour votre question ! Nos spécialistes en externalisation d'entreprise sont prêts à vous accompagner. Souhaitez-vous que nous vous appelions directement ou préférez-vous recevoir une proposition chiffrée par email ?`
        : `Thank you for your inquiry! Our senior financial operations team is ready to support your business in ${selectedCountry.name}. Would you like to schedule a quick 1-on-1 discovery call or explore our tailored subscription plans?`;
      actionBtn = {
        label: language === 'fr' ? 'Réserver une Consultation' : 'Book Free Consultation',
        action: () => {
          onOpenConsultation();
          setIsOpen(false);
        }
      };
    }

    const advisorMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      sender: 'advisor',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actionButton: actionBtn,
    };

    setMessages((prev) => [...prev, advisorMsg]);
  };

  const quickQuestions = [
    {
      label: t.chat.optionQuote,
      text: language === 'fr' ? 'Je souhaite obtenir un devis pour ma structure.' : 'I would like a custom pricing estimate for my company.',
    },
    {
      label: t.chat.optionTax,
      text: language === 'fr' ? 'Quels sont vos services de conformité fiscale ?' : 'What statutory tax filing services do you offer?',
    },
    {
      label: t.chat.optionPayroll,
      text: language === 'fr' ? 'Comment fonctionne l’externalisation de la paie ?' : 'How does outsourced payroll and pension work?',
    },
    {
      label: t.chat.optionConsultation,
      text: language === 'fr' ? 'Je souhaite réserver une consultation gratuite.' : 'I want to schedule a free 1-on-1 advisor consultation.',
    },
  ];

  return (
    <>
      {/* Floating Trigger Pill on Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/30 border border-blue-400/40 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            aria-label="Open Live Advisory Support Chat"
          >
            {/* Visual Online/Offline status dot */}
            <span className="relative flex h-2.5 w-2.5">
              {effectiveOnline ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-lime-400"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
              )}
            </span>

            <Headphones className="w-4 h-4 text-white" />
            <span className="text-xs font-bold tracking-wide whitespace-nowrap">
              {t.chat.floatingButtonLabel}
            </span>

            {/* Unread indicator */}
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-lime-400 text-slate-950 rounded-full text-[10px] font-black flex items-center justify-center shadow border-2 border-slate-900">
                1
              </span>
            )}
          </button>
        )}
      </div>

      {/* Floating Chat Modal Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] max-h-[580px] h-[550px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-all duration-200 animate-in fade-in slide-in-from-bottom-6">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-slate-900 text-white p-3.5 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-lime-400 text-slate-950 font-black text-xs flex items-center justify-center border-2 border-white shadow">
                  FC
                </div>
                <span 
                  className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-slate-900 ${
                    effectiveOnline ? 'bg-emerald-400' : 'bg-amber-400'
                  }`} 
                  title={effectiveOnline ? 'Online' : 'Offline'}
                />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-tight text-white">
                    {t.chat.advisorName}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider font-semibold bg-lime-400/20 text-lime-300 border border-lime-400/30 px-1 py-0.2 rounded">
                    Senior Lead
                  </span>
                </div>
                <span className="text-[10px] text-blue-100/90 flex items-center gap-1">
                  {effectiveOnline ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                      {t.chat.onlineStatus}
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-3 h-3 text-amber-300 inline" />
                      {t.chat.offlineStatus}
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Minimize Chat"
                aria-label="Minimize Chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Close Chat"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Offline Awareness Banner inside Chat */}
          {!effectiveOnline && (
            <div className="bg-amber-50 dark:bg-amber-950/80 border-b border-amber-200 dark:border-amber-800/80 px-3 py-1.5 text-[11px] text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{t.chat.offlineNotice}</span>
            </div>
          )}

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/60">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/80 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  
                  {/* Action Button attached to advisor advice */}
                  {msg.actionButton && (
                    <button
                      onClick={msg.actionButton.action}
                      className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-lime-400 hover:bg-lime-500 text-slate-950 text-[11px] font-bold rounded-lg shadow-sm transition cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-slate-950" />
                      {msg.actionButton.label}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                  <span>{msg.timestamp}</span>
                  {msg.isQueuedOffline && (
                    <span className="text-amber-500 font-medium">({t.chat.queuedNotice})</span>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white dark:bg-slate-800 px-3 py-2 rounded-xl rounded-bl-none border border-slate-200 dark:border-slate-700 w-fit">
                <span className="text-[10px] font-medium">{t.chat.advisorName} is typing</span>
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Inquiries Suggestion Chips */}
          <div className="px-3 py-2 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              {t.chat.quickOptionsTitle}
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q.text)}
                  className="px-2.5 py-1 text-[11px] rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-lime-400 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition cursor-pointer shadow-2xs"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <div className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t.chat.inputPlaceholder}
                className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition cursor-pointer shrink-0"
                title={t.chat.sendButton}
                aria-label={t.chat.sendButton}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Direct WhatsApp Escalation Link */}
            <div className="mt-1.5 text-center">
              <a
                href="https://wa.me/2348000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-medium inline-flex items-center gap-1"
              >
                <PhoneCall className="w-2.5 h-2.5" />
                <span>{t.chat.preferWhatsapp}</span>
              </a>
            </div>
          </div>

        </div>
      )}
    </>
  );
};
