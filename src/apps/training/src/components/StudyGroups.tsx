import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Plus, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Trophy, 
  Search,
  Hash,
  ShieldCheck,
  Send,
  X
} from 'lucide-react';
import { ActivityFeed } from './ActivityFeed';
import { ActivityPost } from '../types';
import { INITIAL_ACTIVITY_POSTS, COURSES } from '../data/mockData';

interface StudyGroupsProps {
  onSelectCourse?: (courseId: string) => void;
  onExploreCourses?: () => void;
}

export const StudyGroups: React.FC<StudyGroupsProps> = ({
  onSelectCourse,
  onExploreCourses
}) => {
  const [posts, setPosts] = useState<ActivityPost[]>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_activity_posts');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_POSTS;
    } catch {
      return INITIAL_ACTIVITY_POSTS;
    }
  });

  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Accounting & Financial Management');
  const [newSnippet, setNewSnippet] = useState('');

  const handleLikePost = (postId: string) => {
    setPosts((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          const hasLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked,
            likesCount: hasLiked ? post.likesCount + 1 : post.likesCount - 1
          };
        }
        return post;
      });
      try {
        localStorage.setItem('msmebooks_activity_posts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleAddComment = (postId: string, commentText: string) => {
    setPosts((prev) => {
      const updated = prev.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `comm-${Date.now()}`,
            authorName: 'You (Student Member)',
            authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            authorRole: 'Active Cohort Member',
            timestamp: 'Just now',
            content: commentText,
            likes: 0
          };
          return {
            ...post,
            comments: [...post.comments, newComment]
          };
        }
        return post;
      });
      try {
        localStorage.setItem('msmebooks_activity_posts', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const newPost: ActivityPost = {
      id: `post-${Date.now()}`,
      authorName: 'You (Student Member)',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      authorRole: 'SME Accounting Student',
      location: 'West Africa Campus',
      category: newCategory,
      timestamp: 'Just now',
      content: newContent.trim(),
      codeOrSnippet: newSnippet.trim() ? newSnippet.trim() : undefined,
      likesCount: 1,
      hasLiked: true,
      comments: []
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    try {
      localStorage.setItem('msmebooks_activity_posts', JSON.stringify(updated));
    } catch {}

    setNewContent('');
    setNewSnippet('');
    setShowNewPostModal(false);
  };

  const studyRooms = [
    { name: 'SME Cloud Accounting Guild', members: 1240, icon: '📊', desc: 'Bank reconciliation, double-entry ledgers, and trial balances' },
    { name: 'Multi-Branch POS Operators', members: 890, icon: '🛒', desc: 'Cashier shift drops, barcode scanners, and inventory transfers' },
    { name: 'Agribusiness & Farm Controllers', members: 420, icon: '🌱', desc: 'Biological assets (IAS 41), grain silos, and harvest costing' },
    { name: 'Public Sector IPSAS Forum', members: 630, icon: '🏛️', desc: 'Treasury Single Account (TSA) and civil service fund accounting' },
    { name: 'Tax Compliance & Audit Prep', members: 1105, icon: '📑', desc: 'Withholding tax schedules, VAT filing, and corporate tax returns' }
  ];

  return (
    <div className="py-10 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#073B75] via-[#0B4F9C] to-[#1E6FD9] rounded-3xl p-8 sm:p-10 text-white shadow-xl">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-[#72B01D] mb-4 border border-white/10">
              <Users className="w-3.5 h-3.5" />
              <span>Pan-African Collaborative Learning Network</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mb-4">
              Study Groups &amp; Real-Time Peer Collaboration
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-6">
              Connect with fellow SME accountants, store managers, and agribusiness operators across Africa. Share software formulas, debug reconciliations, and learn together.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setShowNewPostModal(true)}
                className="px-5 py-2.5 bg-[#72B01D] hover:bg-[#5B8D17] text-white rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-lime-950/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Start a Discussion</span>
              </button>
              <div className="flex items-center gap-4 text-xs text-blue-100">
                <span>🔥 2,420 Active Peers</span>
                <span>•</span>
                <span>💬 148 Online Now</span>
                <span>•</span>
                <span>🛡️ 14 Certified Mentors</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar + Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Study Rooms & Community Challenge */}
          <div className="space-y-6 lg:col-span-1">
            {/* Topic Rooms Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                  <Hash className="w-4 h-4 text-[#0B4F9C] dark:text-blue-400" />
                  Active Study Rooms
                </h3>
                <span className="text-xs text-slate-400 font-medium">5 Channels</span>
              </div>
              <div className="space-y-2.5">
                {studyRooms.map((room) => (
                  <div
                    key={room.name}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                      <span className="flex items-center gap-1.5">
                        <span>{room.icon}</span>
                        <span>{room.name}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        {room.members}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                      {room.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Case Study Challenge */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 dark:border-amber-700/50 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs mb-2">
                <Trophy className="w-4 h-4" />
                <span>Weekly Cohort Challenge (+200 XP)</span>
              </div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-1.5">
                The ₦140,000 Unmatched Bank Lodgment Puzzle
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                A supermarket POS settlement arrived with three bundled merchant fees withheld by the card switch. Can you configure the matching split rule in the sandbox?
              </p>
              <button
                onClick={onExploreCourses}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>View Challenge in Sandbox</span>
              </button>
            </div>
          </div>

          {/* Right Column: Activity Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Live Discussion Feed
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time questions, tips, and verified workflow snippets
                </p>
              </div>

              <button
                onClick={() => setShowNewPostModal(true)}
                className="px-3.5 py-1.5 bg-[#0B4F9C] hover:bg-[#073B75] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Topic</span>
              </button>
            </div>

            <ActivityFeed 
              posts={posts}
              onLikePost={handleLikePost}
              onAddComment={handleAddComment}
              onSelectCourse={onSelectCourse}
            />
          </div>

        </div>

      </div>

      {/* New Discussion Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-4">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#0B4F9C] dark:text-blue-400" />
                Create New Study Group Topic
              </h3>
              <button 
                onClick={() => setShowNewPostModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category / Subject Track
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#0B4F9C]"
                >
                  <option value="Accounting & Financial Management">Accounting & Financial Management</option>
                  <option value="Point of Sale (POS) Operations">Point of Sale (POS) Operations</option>
                  <option value="Agriculture, Agribusiness & Farm Operations">Agriculture, Agribusiness & Farm Operations</option>
                  <option value="Public Sector Accounting & IPSAS Standards">Public Sector Accounting & IPSAS</option>
                  <option value="Taxation & Financial Compliance">Taxation & Financial Compliance</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Discussion Content / Question
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Share a tip or ask a question about your course modules or software practice..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#0B4F9C]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Software Formula or Ledger Snippet
                </label>
                <input
                  type="text"
                  value={newSnippet}
                  onChange={(e) => setNewSnippet(e.target.value)}
                  placeholder="e.g. FIFO Inventory Calculation or VAT Deduction Formula"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:border-[#0B4F9C]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B4F9C] hover:bg-[#073B75] text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish to Study Group</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
