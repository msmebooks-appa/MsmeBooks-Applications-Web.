import React, { useState } from 'react';
import { SuccessStory } from '../types';
import {
  X,
  Plus,
  Save,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  FileText,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface CmsAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  stories: SuccessStory[];
  onSaveStory: (story: SuccessStory) => void;
  onDeleteStory: (id: string) => void;
  onResetToDefaults: () => void;
  onViewStory: (slug: string) => void;
}

export const CmsAdminDrawer: React.FC<CmsAdminDrawerProps> = ({
  isOpen,
  onClose,
  stories,
  onSaveStory,
  onDeleteStory,
  onResetToDefaults,
  onViewStory,
}) => {
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'editor'>('list');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'review' | 'archived'>('all');

  if (!isOpen) return null;

  const handleStartCreate = () => {
    const newStory: SuccessStory = {
      id: `story-${Date.now()}`,
      slug: `new-story-${Date.now().toString().slice(-4)}`,
      title: 'New Enterprise Transformation Story',
      tagline: 'Connecting operational systems into a unified business management hub.',
      industry: 'Retail & Supermarkets',
      categoryKey: 'retail',
      businessProfile: 'Illustrative growing business profile',
      isIllustrative: true,
      verificationStatus: 'illustrative',
      region: 'West Africa (Lagos, Nigeria)',
      businessSize: 'Small (15-30 staff)',
      branchCount: '2 Branches',
      challenge: 'Manual reconciliation between daily sales registers and inventory created blind spots.',
      challengeFull: [
        'Staff recorded inventory changes manually at shift ends.',
        'Delayed financial visibility hindered daily purchasing decisions.'
      ],
      solution: 'Deploy MsmeBooks POS, Inventory, and Accounting to automate transaction posting.',
      solutionFull: [
        {
          module: 'POS & Inventory',
          role: 'Core Retail Operations',
          details: 'Synchronizes barcode transactions directly into inventory ledgers in real time.',
          valueDelivered: 'Eliminates counting lag and provides instant stock availability.'
        }
      ],
      outcome: 'Improved stock visibility and immediate financial reporting without manual reconciliations.',
      outcomeMetrics: [
        {
          label: 'Daily Reconciliation',
          metric: '100% Real-time',
          context: 'Automated ledger posting replacing paper books.',
          verified: false
        }
      ],
      chartMetrics: [
        { name: 'Shift Close', category: 'Daily Operations', before: 75, after: 15, unit: 'mins', efficiencyGain: 80, timeSavedDescription: '60 mins saved per register shift' },
        { name: 'Stock Sync', category: 'Inventory', before: 36, after: 0.1, unit: 'hours', efficiencyGain: 99, timeSavedDescription: 'Instant POS stock sync' },
        { name: 'Month Closing', category: 'Accounting', before: 14, after: 2, unit: 'days', efficiencyGain: 85, timeSavedDescription: '12 days faster monthly close' },
        { name: 'Throughput', category: 'Operations', before: 30, after: 75, unit: '%', efficiencyGain: 150, timeSavedDescription: '2.5x operational throughput' }
      ],
      modules: ['POS', 'Inventory', 'Accounting'],
      timelinePhases: [
        { phase: 1, title: 'Workflow Assessment', duration: 'Week 1', description: 'Review SKU categorization and till requirements.' },
        { phase: 2, title: 'Go-Live Launch', duration: 'Week 2', description: 'Deploy POS and automated accounting ledger.' }
      ],
      whyNeeded: ['To eliminate inventory discrepancies and gain consolidated financial control.'],
      customerOverview: {
        type: 'Growing Commercial Venture',
        model: 'Retail storefront and commercial distribution',
        size: '20 employees',
        locations: 'Lagos, Nigeria',
        background: 'Transitioning from disconnected cash registers to integrated business management.'
      },
      lessonsLearned: ['Clean barcode categorization speeds up cashier scanning by 3x.'],
      featured: false,
      publishedAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      readingTime: '4 min read',
      visualTheme: 'supermarket'
    };

    setEditingStory(newStory);
    setActiveTab('editor');
  };

  const handleStartEdit = (story: SuccessStory) => {
    setEditingStory({ ...story });
    setActiveTab('editor');
  };

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStory) return;
    onSaveStory(editingStory);
    setActiveTab('list');
    setEditingStory(null);
  };

  const filteredStories = stories.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.industry.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-[#0B1E30] w-full max-w-3xl h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-[#1A3852] transition-colors">
        {/* Header */}
        <div className="bg-[#0A3D62] dark:bg-[#07243B] text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#7CB518]" />
              <span className="text-xs font-semibold text-[#90CF24] uppercase tracking-wider">
                Authorized Staff Access
              </span>
            </div>
            <h3 className="text-lg font-bold">MsmeBooks Content Management System</h3>
            <p className="text-xs text-slate-300">
              Manage success stories, review customer case studies, and control publication workflows.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#162D42] px-6 py-3 bg-slate-50 dark:bg-[#081827] shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white dark:bg-[#0E283F] text-[#0A3D62] dark:text-sky-300 shadow-xs border border-slate-200 dark:border-[#1A3852]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Story Directory ({stories.length})
            </button>
            {editingStory && (
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer ${
                  activeTab === 'editor'
                    ? 'bg-white dark:bg-[#0E283F] text-[#0A3D62] dark:text-sky-300 shadow-xs border border-slate-200 dark:border-[#1A3852]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Editing: {editingStory.title.slice(0, 24)}...
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'list' && (
              <>
                <button
                  onClick={onResetToDefaults}
                  title="Reset to 12 official initial story templates"
                  className="px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-[#122A3F] rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Defaults</span>
                </button>
                <button
                  onClick={handleStartCreate}
                  className="px-3.5 py-1.5 bg-[#7CB518] hover:bg-[#90CF24] text-[#072B45] text-xs font-bold rounded-md flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Story</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'list' ? (
            <div className="space-y-4">
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search stories by title or industry..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62] text-slate-900 dark:text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="review">Under Review</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              {/* Story Table / List */}
              <div className="divide-y divide-slate-100 dark:divide-[#162D42] border border-slate-200 dark:border-[#1A3852] rounded-xl overflow-hidden bg-white dark:bg-[#0C1E30]">
                {filteredStories.map((story) => (
                  <div
                    key={story.id}
                    className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          story.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : story.status === 'review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {story.status.toUpperCase()}
                        </span>
                        <span className="text-slate-400">&middot;</span>
                        <span className="font-semibold text-slate-600">{story.industry}</span>
                        {story.isIllustrative && (
                          <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                            Illustrative
                          </span>
                        )}
                        {story.featured && (
                          <span className="text-[10px] text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm leading-snug">
                        {story.title}
                      </h4>
                      <p className="text-slate-500 line-clamp-1 text-[11px]">
                        {story.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        onClick={() => {
                          onViewStory(story.slug);
                          onClose();
                        }}
                        title="View Live Page"
                        className="p-1.5 text-slate-500 hover:text-[#0A3D62] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStartEdit(story)}
                        title="Edit Story"
                        className="p-1.5 text-slate-500 hover:text-[#0A3D62] hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteStory(story.id)}
                        title="Delete Story"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredStories.length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                    No stories match your search criteria.
                  </div>
                )}
              </div>
            </div>
          ) : editingStory ? (
            /* Story Editor Form */
            <form onSubmit={handleSaveCurrent} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Story Title *</label>
                  <input
                    type="text"
                    required
                    value={editingStory.title}
                    onChange={(e) => setEditingStory({ ...editingStory, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={editingStory.slug}
                    onChange={(e) => setEditingStory({ ...editingStory, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline / Subheading</label>
                <input
                  type="text"
                  value={editingStory.tagline}
                  onChange={(e) => setEditingStory({ ...editingStory, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Industry</label>
                  <select
                    value={editingStory.industry}
                    onChange={(e) => setEditingStory({ ...editingStory, industry: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                  >
                    <option>Retail &amp; Supermarkets</option>
                    <option>Restaurants &amp; Food Services</option>
                    <option>Hotels &amp; Hospitality</option>
                    <option>Wholesale &amp; Distribution</option>
                    <option>Accounting &amp; Bookkeeping Services</option>
                    <option>Fashion &amp; Apparel</option>
                    <option>Electronics &amp; Mobile Devices</option>
                    <option>Pharmacies &amp; Healthcare</option>
                    <option>Beauty &amp; Personal Care</option>
                    <option>Manufacturing &amp; Production</option>
                    <option>Logistics &amp; Transportation</option>
                    <option>Multi-branch Businesses</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Workflow Theme / UI</label>
                  <select
                    value={editingStory.visualTheme}
                    onChange={(e) => setEditingStory({ ...editingStory, visualTheme: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                  >
                    <option value="supermarket">Supermarket POS</option>
                    <option value="restaurant">Restaurant KDS</option>
                    <option value="hotel">Hotel PMS</option>
                    <option value="warehouse">Warehouse Depots</option>
                    <option value="accounting">Accounting Rules</option>
                    <option value="fashion">Fashion Matrix</option>
                    <option value="electronics">Electronics IMEI</option>
                    <option value="pharmacy">Pharmacy FEFO</option>
                    <option value="ecommerce">Omnichannel Web</option>
                    <option value="logistics">Logistics Fleet</option>
                    <option value="beauty">Beauty Studio</option>
                    <option value="enterprise">Multi-branch Grid</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Publication Status</label>
                  <select
                    value={editingStory.status}
                    onChange={(e) => setEditingStory({ ...editingStory, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                  >
                    <option value="published">Published</option>
                    <option value="review">Under Review</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Business Profile Summary</label>
                  <input
                    type="text"
                    value={editingStory.businessProfile}
                    onChange={(e) => setEditingStory({ ...editingStory, businessProfile: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Region / Location</label>
                  <input
                    type="text"
                    value={editingStory.region}
                    onChange={(e) => setEditingStory({ ...editingStory, region: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Business Challenge (Short Card Summary)</label>
                <textarea
                  rows={2}
                  value={editingStory.challenge}
                  onChange={(e) => setEditingStory({ ...editingStory, challenge: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">MsmeBooks Solution (Short Card Summary)</label>
                <textarea
                  rows={2}
                  value={editingStory.solution}
                  onChange={(e) => setEditingStory({ ...editingStory, solution: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected / Verified Outcome</label>
                <textarea
                  rows={2}
                  value={editingStory.outcome}
                  onChange={(e) => setEditingStory({ ...editingStory, outcome: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Modules (comma separated)</label>
                  <input
                    type="text"
                    value={editingStory.modules.join(', ')}
                    onChange={(e) => setEditingStory({
                      ...editingStory,
                      modules: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A3D62]"
                  />
                </div>

                <div className="flex items-center gap-6 pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingStory.isIllustrative}
                      onChange={(e) => setEditingStory({ ...editingStory, isIllustrative: e.target.checked })}
                      className="rounded text-[#0A3D62]"
                    />
                    <span className="font-semibold text-slate-700">Label as Illustrative Use Case</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingStory.featured}
                      onChange={(e) => setEditingStory({ ...editingStory, featured: e.target.checked })}
                      className="rounded text-[#0A3D62]"
                    />
                    <span className="font-semibold text-slate-700">Featured Marquee Story</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0A3D62] hover:bg-[#072B45] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Save className="w-4 h-4 text-[#90CF24]" />
                  <span>Save Story Changes</span>
                </button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
};
