import React, { useState } from 'react';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Pin, 
  Send, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  MapPin, 
  Filter 
} from 'lucide-react';
import { ActivityPost, ActivityComment } from '../types';

interface ActivityFeedProps {
  posts: ActivityPost[];
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onSelectCourse?: (courseId: string) => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  posts,
  onLikePost,
  onAddComment,
  onSelectCourse
}) => {
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const categories = [
    'All',
    'Accounting & Financial Management',
    'Point of Sale (POS) Operations',
    'Agriculture, Agribusiness & Farm Operations'
  ];

  const filteredPosts = posts.filter((p) => {
    if (activeCategoryFilter === 'All') return true;
    return p.category === activeCategoryFilter;
  });

  const handleCommentSubmit = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInput[postId]?.trim();
    if (!text) return;
    onAddComment(postId, text);
    setCommentInput((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors font-medium cursor-pointer ${
              activeCategoryFilter === cat
                ? 'bg-[#0B4F9C] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isCommenting = activeCommentPostId === post.id;

          return (
            <article 
              key={post.id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 shadow-xs transition-all ${
                post.pinned 
                  ? 'border-blue-300 dark:border-blue-700/60 ring-1 ring-blue-500/20' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                  />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                        {post.authorName}
                      </h4>
                      {post.pinned && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-0.5 rounded-full">
                          <Pin className="w-3 h-3 fill-current" />
                          Pinned Guide
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                      <span>{post.authorRole}</span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3" />
                        {post.location}
                      </span>
                      <span>•</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {post.category}
                </span>
              </div>

              {/* Course Reference Tag */}
              {post.courseReferenceTitle && (
                <div className="mb-3">
                  <button
                    onClick={() => post.courseReferenceId && onSelectCourse && onSelectCourse(post.courseReferenceId)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#0B4F9C] dark:text-blue-400 font-medium hover:underline cursor-pointer bg-blue-50/70 dark:bg-blue-950/40 px-2.5 py-1 rounded-md"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Reference Course: {post.courseReferenceTitle}</span>
                  </button>
                </div>
              )}

              {/* Main Content */}
              <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed mb-3">
                {post.content}
              </p>

              {/* Code or Formula Snippet */}
              {post.codeOrSnippet && (
                <div className="mb-4 bg-slate-900 text-slate-200 rounded-xl p-3 font-mono text-xs overflow-x-auto border border-slate-800">
                  <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#72B01D]" />
                    <span>Verified Software Formula / Workflow Regex:</span>
                  </div>
                  <code>{post.codeOrSnippet}</code>
                </div>
              )}

              {/* Action Buttons: Like, Comment, Share */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => onLikePost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      post.hasLiked
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                    <span>{post.likesCount} Helpful</span>
                  </button>

                  <button
                    onClick={() => setActiveCommentPostId(isCommenting ? null : post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} Comments</span>
                  </button>
                </div>

                <span className="text-[11px] text-slate-400">
                  MsmeBooks Study Network
                </span>
              </div>

              {/* Expandable Comments Section */}
              {isCommenting && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  {post.comments.length > 0 && (
                    <div className="space-y-2.5">
                      {post.comments.map((comment) => (
                        <div 
                          key={comment.id}
                          className="bg-slate-50 dark:bg-slate-800/70 rounded-xl p-3 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <img
                                src={comment.authorAvatar}
                                alt={comment.authorName}
                                className="w-5 h-5 rounded-full object-cover"
                              />
                              <span className="font-bold text-slate-800 dark:text-slate-200">
                                {comment.authorName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                ({comment.authorRole})
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 pl-7">
                            {comment.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input Form */}
                  <form 
                    onSubmit={(e) => handleCommentSubmit(post.id, e)}
                    className="flex items-center gap-2 pt-2"
                  >
                    <input
                      type="text"
                      value={commentInput[post.id] || ''}
                      onChange={(e) => setCommentInput({ ...commentInput, [post.id]: e.target.value })}
                      placeholder="Add a reply or study tip to this thread..."
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:border-[#0B4F9C]"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput[post.id]?.trim()}
                      className="px-3 py-2 bg-[#0B4F9C] hover:bg-[#073B75] disabled:opacity-40 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </form>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};
