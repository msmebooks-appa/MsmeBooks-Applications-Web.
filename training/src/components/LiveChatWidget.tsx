import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Users, 
  ThumbsUp, 
  Sparkles, 
  Minimize2, 
  Maximize2,
  Smile,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { LiveChatMessage } from '../types';
import { INITIAL_CHAT_MESSAGES } from '../data/mockData';

interface LiveChatWidgetProps {
  currentLanguage?: 'en' | 'fr' | 'pt' | 'es';
}

const CHANNELS = [
  { id: 'General Lounge', label: 'General Lounge', icon: '💬' },
  { id: 'Accounting & Tax Hub', label: 'Accounting & Tax', icon: '📊' },
  { id: 'POS & Retail Ops', label: 'POS & Retail', icon: '🛒' },
  { id: 'Technical Help', label: 'Software Help', icon: '⚙️' }
];

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState('General Lounge');
  const [messages, setMessages] = useState<LiveChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, activeChannel]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: LiveChatMessage = {
      id: `user-msg-${Date.now()}`,
      senderName: 'You (Student)',
      senderRole: 'Student',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      location: 'Local Campus',
      channel: activeChannel,
      message: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Trigger realistic simulated tutor/peer response
    setTimeout(() => {
      setIsTyping(true);
    }, 900);

    setTimeout(() => {
      setIsTyping(false);
      const responses: Record<string, string[]> = {
        'General Lounge': [
          'Great point! Everyone in this cohort is making quick progress this week.',
          'Glad to have you here! Feel free to ask if you get stuck on any module.',
          'Welcome! Keep up the daily study streak.'
        ],
        'Accounting & Tax Hub': [
          'Make sure to verify the Chart of Accounts code 1020 for automated bank reconciliation.',
          'Remember: VAT output minus VAT input gives your net remittance to FIRS/GRA.',
          'Double-entry rule of thumb: Debit the receiver, Credit the giver!'
        ],
        'POS & Retail Ops': [
          'For thermal printers, make sure the baud rate is set to 9600 in the terminal profile.',
          'At end of shift, remember to record both card POS slips and cash tray totals.',
          'Multi-branch stock transfer requests automatically trigger Goods-in-Transit (GIT).'
        ],
        'Technical Help': [
          'All sandbox actions are safely isolated in your personal test tenant.',
          'If your network is patchy, the offline caching engine will save your progress locally.'
        ]
      };

      const pool = responses[activeChannel] || responses['General Lounge'];
      const randomText = pool[Math.floor(Math.random() * pool.length)];

      const peerResponse: LiveChatMessage = {
        id: `peer-msg-${Date.now()}`,
        senderName: activeChannel === 'Accounting & Tax Hub' ? 'Tunde Balogun, ACA' : 'Sarah Otieno',
        senderRole: activeChannel === 'Accounting & Tax Hub' ? 'Certified Instructor' : 'Peer Tutor',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        location: activeChannel === 'Accounting & Tax Hub' ? 'Lagos, NG' : 'Nairobi, KE',
        channel: activeChannel,
        message: randomText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, peerResponse]);
    }, 2400);
  };

  const handleLikeMessage = (msgId: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId ? { ...m, likes: (m.likes || 0) + 1 } : m
      )
    );
  };

  const filteredMessages = messages.filter((m) => m.channel === activeChannel);

  return (
    <>
      {/* Floating Launcher Button at right side */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-4 sm:right-6 bottom-24 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#0B4F9C] hover:bg-[#073B75] text-white rounded-full shadow-xl shadow-blue-900/30 transition-all hover:scale-105 cursor-pointer group"
          title="Open Peer & Instructor Live Chat"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#72B01D] text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-xs font-semibold hidden sm:inline">Live Student Chat</span>
          <span className="w-2 h-2 rounded-full bg-[#72B01D] animate-ping" />
        </button>
      )}

      {/* Expanded Live Chat Panel */}
      {isOpen && (
        <div className="fixed right-4 sm:right-6 bottom-6 z-50 w-[360px] sm:w-[400px] h-[540px] max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#0B4F9C] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm">Academy Live Chat</h3>
                  <span className="text-[10px] bg-[#72B01D] px-1.5 py-0.2 rounded font-semibold text-white">
                    148 Online
                  </span>
                </div>
                <p className="text-[11px] text-blue-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#72B01D]" />
                  Peer &amp; Instructor Discussion
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Channels tabs */}
          <div className="flex items-center gap-1 p-2 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto text-xs">
            {CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors flex items-center gap-1 text-[11px] cursor-pointer ${
                  activeChannel === ch.id
                    ? 'bg-[#0B4F9C] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <span>{ch.icon}</span>
                <span>{ch.label}</span>
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-950 text-xs">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No messages in #{activeChannel} yet.</p>
                <p className="text-[11px] mt-1">Be the first to post a study question!</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    {!msg.isSelf && (
                      <img 
                        src={msg.senderAvatar} 
                        alt={msg.senderName} 
                        className="w-4 h-4 rounded-full object-cover"
                      />
                    )}
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {msg.location} · {msg.timestamp}
                    </span>
                    {msg.senderRole === 'Certified Instructor' && (
                      <span className="bg-blue-100 dark:bg-blue-900/60 text-[#0B4F9C] dark:text-blue-300 text-[9px] px-1 py-0.2 rounded font-bold">
                        Staff
                      </span>
                    )}
                  </div>

                  <div 
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs relative group ${
                      msg.isSelf
                        ? 'bg-[#0B4F9C] text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.message}</p>

                    {!msg.isSelf && (
                      <div className="mt-1 flex items-center justify-end gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-400">
                        <button
                          onClick={() => handleLikeMessage(msg.id)}
                          className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{msg.likes || 0}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs px-2 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] italic">Instructor is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form 
            onSubmit={handleSendMessage}
            className="p-2.5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${activeChannel}...`}
              className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs px-3 py-2 rounded-xl border border-transparent focus:border-[#0B4F9C] focus:bg-white dark:focus:bg-slate-900 outline-hidden transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-[#0B4F9C] hover:bg-[#073B75] disabled:opacity-40 text-white rounded-xl transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
};
