import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  CheckCircle2, 
  ChevronRight, 
  ArrowUpRight, 
  RotateCcw, 
  BookOpen, 
  ShieldCheck, 
  DollarSign, 
  HelpCircle,
  Award,
  Layers,
  FileCheck,
  CheckSquare,
  Square,
  MessageSquare,
  Compass,
  Cpu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
  actions?: Array<{ label: string; actionType: 'apply' | 'verify' | 'portal' | 'calculator'; tier?: string }>;
  suggestedFollowUps?: string[];
}

interface PartnerAIAssistantProps {
  onOpenApply: (tier?: any) => void;
  onOpenVerify: () => void;
  onOpenPortal: () => void;
}

export const PartnerAIAssistant: React.FC<PartnerAIAssistantProps> = ({
  onOpenApply,
  onOpenVerify,
  onOpenPortal
}) => {
  const { t } = useLanguage();
  const { currentCurrency, formatMoney } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'onboarding'>('chat');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadBadge, setUnreadBadge] = useState(true);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Onboarding Checklist state with localStorage persistence
  const [onboardingSteps, setOnboardingSteps] = useState([
    {
      id: 'step-1',
      title: 'Review Accreditation Tiers',
      description: 'Explore Bronze (15%), Silver (20%), Gold (30%), and Platinum (40%) commission structures.',
      completed: true,
      actionLabel: 'Compare Tiers',
      actionType: 'calculator'
    },
    {
      id: 'step-2',
      title: 'Submit Partner Accreditation Application',
      description: 'Provide firm registration details, primary business territory, and accounting/IT software focus.',
      completed: false,
      actionLabel: 'Start Application',
      actionType: 'apply'
    },
    {
      id: 'step-3',
      title: 'Complete Academy Enablement Curriculum',
      description: 'Access the 100% sponsored certification track on multi-warehouse ERP, cloud POS, and audit software integration.',
      completed: false,
      actionLabel: 'View Academy',
      actionType: 'academy'
    },
    {
      id: 'step-4',
      title: 'Download Official Badges & Tracking Links',
      description: 'Obtain your unique verifiable Partner ID, embed SVG badges, and configure UTM referral tracking URLs.',
      completed: false,
      actionLabel: 'Launch Portal Demo',
      actionType: 'portal'
    },
    {
      id: 'step-5',
      title: 'Onboard First 3 Clients & Receive Settlement',
      description: 'Introduce client subscriptions and receive automated bi-weekly wire transfers to your designated bank.',
      completed: false,
      actionLabel: 'Commission Calculator',
      actionType: 'calculator'
    }
  ]);

  // Load saved checklist progress
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('msmebooks_onboarding_steps');
      if (saved) {
        try {
          setOnboardingSteps(JSON.parse(saved));
        } catch (e) {
          // ignore parsing error
        }
      }
    }
  }, []);

  const toggleStep = (id: string) => {
    const updated = onboardingSteps.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    );
    setOnboardingSteps(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('msmebooks_onboarding_steps', JSON.stringify(updated));
    }
  };

  const completedCount = onboardingSteps.filter(s => s.completed).length;
  const progressPercent = Math.round((completedCount / onboardingSteps.length) * 100);

  // Initial messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: "👋 Hello! I am your **MsmeBooks Partner AI Copilot**.\n\nWhether you are an independent accountant, IT consulting practice, or software distributor, I can guide you through **onboarding**, explain our **15%–40% recurring revenue share**, or answer any technical audit integration questions.",
      time: 'Just now',
      suggestedFollowUps: [
        '🚀 How do I complete partner onboarding?',
        '💰 Explain the 15%–40% commission tiers',
        '🔄 Which audit software can we integrate?',
        '🏆 How do I get my official metallic badge?'
      ]
    }
  ]);

  useEffect(() => {
    if (isOpen) {
      setUnreadBadge(false);
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isTyping]);

  const handleActionClick = (actionType: string) => {
    if (actionType === 'apply') {
      onOpenApply('gold');
    } else if (actionType === 'verify') {
      onOpenVerify();
    } else if (actionType === 'portal') {
      onOpenPortal();
    } else if (actionType === 'calculator') {
      document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
    } else if (actionType === 'academy') {
      document.getElementById('academy')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Intelligent domain knowledge responder
  const generateAIResponse = (query: string): { text: string; actions?: ChatMessage['actions']; suggestedFollowUps?: string[] } => {
    const q = query.toLowerCase();

    if (q.includes('onboard') || q.includes('start') || q.includes('how to join') || q.includes('steps')) {
      return {
        text: `**Welcome to the MsmeBooks Partner Onboarding Roadmap!**\n\nHere is how to get accredited in 3 simple steps:\n\n1. **Select Your Tier**: Review our 4 tiers (Bronze 15%, Silver 20%, Gold 30%, Platinum 40%). Most advisory practices start at **Gold**.\n2. **Submit Fast-Track Application**: Complete the 5-minute online form with your firm's details.\n3. **Access Enablement & Badges**: Receive your verifiable digital credentials, customized referral link generator, and sponsored Academy enrollment.\n\nWould you like me to open the application form or review the onboarding checklist?`,
        actions: [
          { label: 'Start Partner Application', actionType: 'apply' },
          { label: 'View Onboarding Checklist', actionType: 'portal' }
        ],
        suggestedFollowUps: [
          'What are the requirements for Gold Tier?',
          'How does the referral link tracking work?',
          'When is the next Academy cohort?'
        ]
      };
    }

    if (q.includes('commission') || q.includes('tier') || q.includes('earn') || q.includes('rev share') || q.includes('%') || q.includes('payout')) {
      return {
        text: `**MsmeBooks Recurring Lifetime Revenue Structure:**\n\n• **Bronze (15%)**: 1–15 active referred clients. Entry level for boutique advisors.\n• **Silver (20%)**: 16–50 active clients. Includes partner directory listing.\n• **Gold (30%)**: 51–150 active clients. Direct client lead routing + priority dedicated account manager.\n• **Platinum (40%)**: 151+ clients. Highest tier with co-marketing development funds and executive sponsorship.\n\n*All commissions are paid for as long as your clients renew. Payouts are wired bi-weekly on the 15th and end of each month with 0% chargeback deductions.*`,
        actions: [
          { label: 'Open Commission Calculator', actionType: 'calculator' },
          { label: 'Apply for Gold Partner', actionType: 'apply', tier: 'gold' }
        ],
        suggestedFollowUps: [
          'Can I bill clients separately for implementation fees?',
          'What bank accounts and wire destinations are supported?',
          'How do I track client renewals?'
        ]
      };
    }

    if (q.includes('audit') || q.includes('caseware') || q.includes('sage') || q.includes('quickbooks') || q.includes('integration') || q.includes('sync')) {
      return {
        text: `**25+ Bi-Directional Audit Software Integrations:**\n\nMsmeBooks connects directly to leading audit and accounting suites to eliminate manual spreadsheet re-keying:\n\n• **Continuous Assurance & Working Papers**: Caseware Working Papers, Sage Pastel Evolution, QuickBooks Online, Xero, SAP Business One.\n• **AI Analytics & Sampling**: CaseWare IDEA, Wolters Kluwer CCH, AdvanceTrack, Inflo, MindBridge AI.\n\nYour audit practice can connect using our **high-speed REST API** and **real-time Event Webhooks** with full trial balance and journal level granularity.`,
        actions: [
          { label: 'Explore Audit Integrations', actionType: 'calculator' }
        ],
        suggestedFollowUps: [
          'Is there an API sandbox for our engineering team?',
          'Does it support multi-branch currency reconciliation?'
        ]
      };
    }

    if (q.includes('badge') || q.includes('credential') || q.includes('verify') || q.includes('certificate')) {
      return {
        text: `**Official Verifiable Partner Credentials:**\n\nEvery certified MsmeBooks partner is granted an official digital credential with:\n\n• **Vector SVG & High-Res PNG Metallic Badge** (Bronze, Silver, Gold, Platinum)\n• **Unique Verifiable Partner ID** (e.g. \`MSME-PT-8421\`)\n• **Instant Public Verification Page** for your website, email signature, and audit proposals.\n\nYou can test and verify credentials anytime in our public verification portal.`,
        actions: [
          { label: 'Verify a Partner Credential', actionType: 'verify' },
          { label: 'Launch Portal Demo Badge', actionType: 'portal' }
        ],
        suggestedFollowUps: [
          'Can I download the SVG badge directly?',
          'How do clients verify our partnership?'
        ]
      };
    }

    if (q.includes('academy') || q.includes('train') || q.includes('certif') || q.includes('cohort')) {
      return {
        text: `**MsmeBooks Partner Enablement Academy:**\n\n• **100% Sponsored Tuition**: Free for accepted partners and their associates.\n• **14 Structured Modules**: Hands-on training on POS hardware syncing, multi-warehouse inventory, fiscalization compliance, and data migration.\n• **Quarterly Cohorts**: Next intake begins shortly with limited cohort capacity.\n\nUpon graduation, team members receive accredited digital certificates and CPD/CPE credit hours.`,
        actions: [
          { label: 'Register for Academy Cohort', actionType: 'apply' }
        ],
        suggestedFollowUps: [
          'How long does the certification take?',
          'Can multiple staff members enroll?'
        ]
      };
    }

    if (q.includes('fee') || q.includes('bill') || q.includes('service') || q.includes('consulting')) {
      return {
        text: `**100% Retained Implementation & Consulting Fees:**\n\nIn addition to your 15%–40% recurring software commissions, partners retain **100% of all professional services fees** charged to clients for:\n\n• Hardware procurement (thermal printers, barcode scanners, touch POS)\n• Legacy data migration and chart of accounts setup\n• Staff training and custom report design\n• Monthly outsourced bookkeeping and audit readiness`,
        actions: [
          { label: 'Calculate Total Revenue', actionType: 'calculator' }
        ]
      };
    }

    // Default versatile response
    return {
      text: `Thank you for asking about **MsmeBooks Partner Ecosystem**!\n\nAs a partner, you gain:\n• **15% to 40% Lifetime Recurring Commission** on all referred subscriptions\n• **Accredited Verification Badges** and inclusion in our verified public directory\n• **25+ Audit Software Integrations** (Caseware, Sage, QuickBooks, etc.)\n• **Dedicated Partner Success Manager** and priority technical escalation channels.\n\nHow can I best assist you right now?`,
      actions: [
        { label: 'Apply to Become a Partner', actionType: 'apply' },
        { label: 'Open Partner Dashboard Demo', actionType: 'portal' }
      ],
      suggestedFollowUps: [
        'How do I complete partner onboarding?',
        'What are the Gold Tier commission rates?',
        'How does bi-weekly wire payout work?'
      ]
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText.trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Realistic response delay for natural conversational experience
    setTimeout(() => {
      const responseData = generateAIResponse(query);
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseData.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: responseData.actions,
        suggestedFollowUps: responseData.suggestedFollowUps
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 650);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'ai',
        text: "👋 Chat reset. How can I assist you with the MsmeBooks Partner Programme today?",
        time: 'Just now',
        suggestedFollowUps: [
          '🚀 Guide me through partner onboarding',
          '💰 What are the 15%–40% commission rates?',
          '🔄 How does audit software integration work?'
        ]
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button on Bottom-Right */}
      <div className="fixed right-4 sm:right-6 bottom-6 z-40">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0A3981] via-[#082C66] to-[#0A3981] text-white shadow-2xl border-2 border-[#8CE600]/80 hover:border-[#8CE600] flex items-center justify-center transition-all cursor-pointer"
          title="MsmeBooks Partner AI Assistant (Onboarding & Q&A)"
          aria-label="Open AI Assistant"
        >
          {/* Animated Glow Halo */}
          <span className="absolute -inset-1 rounded-2xl bg-[#8CE600]/30 blur-md group-hover:bg-[#8CE600]/50 transition-all pointer-events-none animate-pulse" />

          {/* Icon with AI Sparkles */}
          <div className="relative flex items-center gap-2">
            <div className="relative">
              <Bot className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8CE600] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8CE600]"></span>
              </span>
            </div>
            <span className="hidden md:inline font-bold text-xs tracking-wide">
              Partner AI
            </span>
          </div>

          {/* Unread Pill */}
          {unreadBadge && (
            <span className="absolute -top-2 -left-2 bg-[#8CE600] text-[#061F4A] font-black text-[10px] px-2 py-0.5 rounded-full shadow-md animate-bounce">
              Live AI
            </span>
          )}
        </motion.button>
      </div>

      {/* Floating Assistant Modal / Slide-Up Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="fixed right-3 sm:right-6 bottom-22 sm:bottom-24 z-50 w-[94vw] sm:w-[440px] max-h-[82vh] h-[640px] bg-white dark:bg-[#072457] rounded-3xl shadow-2xl border border-slate-200 dark:border-blue-800 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0A3981] via-[#072557] to-[#0A3981] p-4 text-white flex items-center justify-between shrink-0 border-b border-blue-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 dark:bg-white/15 border border-[#8CE600]/60 flex items-center justify-center text-[#8CE600]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm tracking-tight text-white">
                      Partner AI Copilot
                    </h3>
                    <span className="text-[10px] font-bold text-[#061F4A] bg-[#8CE600] px-1.5 py-0.2 rounded-md">
                      24/7 Live
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8CE600] animate-pulse" />
                    Onboarding Guide & Practice Q&A
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleResetChat}
                  className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
                  title="Reset Conversation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
                  title="Close Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mode Tabs: Chat vs Onboarding Roadmap */}
            <div className="flex bg-slate-100 dark:bg-[#051a3d] p-1 border-b border-slate-200 dark:border-blue-900/60 text-xs font-bold shrink-0">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'chat'
                    ? 'bg-white dark:bg-[#0A3981] text-[#0A3981] dark:text-[#8CE600] shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>AI Q&A Assistant</span>
              </button>
              <button
                onClick={() => setActiveTab('onboarding')}
                className={`flex-1 py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 relative ${
                  activeTab === 'onboarding'
                    ? 'bg-white dark:bg-[#0A3981] text-[#0A3981] dark:text-[#8CE600] shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Onboarding Roadmap</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-[#8CE600]">
                  {progressPercent}%
                </span>
              </button>
            </div>

            {/* TAB 1: LIVE AI CHAT */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50 dark:bg-[#061F4A]/80">
                {/* Messages Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-2xl p-3.5 shadow-xs leading-relaxed whitespace-pre-wrap ${
                          msg.sender === 'user'
                            ? 'bg-[#0A3981] text-white rounded-br-xs'
                            : 'bg-white dark:bg-[#0A2552] text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-blue-800/80 rounded-bl-xs'
                        }`}
                      >
                        {msg.text}

                        {/* Interactive In-Chat Action Buttons */}
                        {msg.actions && msg.actions.length > 0 && (
                          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-blue-900/60 flex flex-wrap gap-1.5">
                            {msg.actions.map((act, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleActionClick(act.actionType)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white dark:text-[#061F4A] bg-[#0A3981] dark:bg-[#8CE600] hover:bg-[#072c66] dark:hover:bg-[#9be81c] rounded-lg transition-colors shadow-xs cursor-pointer"
                              >
                                {act.label}
                                <ArrowUpRight className="w-3 h-3" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {msg.time}
                      </span>

                      {/* Suggested Follow-Ups */}
                      {msg.suggestedFollowUps && (
                        <div className="mt-2 flex flex-wrap gap-1 max-w-[95%]">
                          {msg.suggestedFollowUps.map((suggestion, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSend(suggestion)}
                              className="text-[11px] font-medium text-slate-600 dark:text-blue-200 bg-white dark:bg-[#072457] hover:bg-blue-50 dark:hover:bg-blue-900/40 border border-slate-200 dark:border-blue-800/70 rounded-full px-2.5 py-1 transition-all text-left cursor-pointer"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white dark:bg-[#0A2552] p-3 rounded-2xl w-fit border border-slate-200 dark:border-blue-800">
                      <Bot className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
                      <span className="font-semibold">AI is analyzing partner handbook</span>
                      <span className="flex gap-1 ml-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A3981] dark:bg-[#8CE600] animate-bounce" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A3981] dark:bg-[#8CE600] animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0A3981] dark:bg-[#8CE600] animate-bounce [animation-delay:0.4s]" />
                      </span>
                    </div>
                  )}

                  <div ref={chatBottomRef} />
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-white dark:bg-[#072457] border-t border-slate-200 dark:border-blue-900/60 shrink-0">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex items-center gap-2"
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask about onboarding, commission rates, or audit sync..."
                      className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#051a3d] border border-slate-200 dark:border-blue-900 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
                    />
                    <button
                      type="submit"
                      disabled={!inputText.trim() || isTyping}
                      className="p-2.5 rounded-xl bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] hover:bg-[#072c66] dark:hover:bg-[#9be81c] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0 shadow-xs"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: INTERACTIVE ONBOARDING ROADMAP */}
            {activeTab === 'onboarding' && (
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-[#061F4A]/80 text-xs">
                {/* Onboarding Header Banner */}
                <div className="bg-gradient-to-br from-[#0A3981] to-[#072457] text-white p-4 rounded-2xl border border-blue-800 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                      Partner Onboarding Progression
                    </span>
                    <span className="text-xs font-mono font-bold text-[#8CE600]">
                      {completedCount} of {onboardingSteps.length} Completed
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#8CE600] h-full transition-all duration-300 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-blue-200 mt-2">
                    Complete all 5 milestones to unlock official Gold tier status and direct lead routing.
                  </p>
                </div>

                {/* Steps List */}
                <div className="space-y-2.5">
                  {onboardingSteps.map((step, idx) => (
                    <div
                      key={step.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        step.completed
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60'
                          : 'bg-white dark:bg-[#0A2552] border-slate-200 dark:border-blue-800/80'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          onClick={() => toggleStep(step.id)}
                          className="mt-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                          aria-label={`Toggle ${step.title}`}
                        >
                          {step.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#8CE600]" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300 dark:text-blue-800" />
                          )}
                        </button>

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`font-bold ${step.completed ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                              {idx + 1}. {step.title}
                            </h4>
                          </div>

                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {step.description}
                          </p>

                          <div className="mt-2.5 flex items-center justify-between">
                            <button
                              onClick={() => handleActionClick(step.actionType)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0A3981] dark:text-[#8CE600] hover:underline cursor-pointer"
                            >
                              {step.actionLabel}
                              <ChevronRight className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => toggleStep(step.id)}
                              className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                            >
                              {step.completed ? 'Mark as incomplete' : 'Mark as done'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fast Track Help */}
                <div className="p-3.5 bg-blue-50/70 dark:bg-blue-950/60 rounded-2xl border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-[#0A3981] dark:text-white text-xs">
                      Need custom enterprise onboarding?
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Speak directly with our Pan-African alliances director.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('chat');
                      handleSend('I need custom enterprise partner onboarding assistance.');
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-[#0A3981] dark:bg-blue-600 rounded-xl cursor-pointer"
                  >
                    Ask AI
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
