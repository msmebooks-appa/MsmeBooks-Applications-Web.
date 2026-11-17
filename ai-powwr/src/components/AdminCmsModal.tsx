import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { FaqItemData, PublicationStatus, UserRole } from '../types/faq';
import { FAQ_CATEGORIES } from '../data/categories';
import { INDUSTRIES } from '../data/industries';
import { PRODUCT_MODULES } from '../data/productModules';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Save,
  CheckCircle,
  Clock,
  Archive,
  Eye,
  Download,
  Upload,
  BarChart2,
  Search,
  Shield,
  ThumbsUp,
  Sliders,
  FileText,
  DollarSign,
  Coins,
  Globe
} from 'lucide-react';

interface AdminCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  faqs: FaqItemData[];
  onSaveFaq: (faq: FaqItemData) => void;
  onDeleteFaq: (faqId: string) => void;
  onBulkImport: (newFaqs: FaqItemData[]) => void;
}

export const AdminCmsModal: React.FC<AdminCmsModalProps> = ({
  isOpen,
  onClose,
  faqs,
  onSaveFaq,
  onDeleteFaq,
  onBulkImport
}) => {
  const { currencyInfo, formatFromUSD } = useCurrency();
  const [activeTab, setActiveTab] = useState<'list' | 'editor' | 'analytics'>('list');
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Admin');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [editorLocale, setEditorLocale] = useState<'fr' | 'es' | 'ar'>('fr');
  
  // Editing state
  const [editingFaq, setEditingFaq] = useState<Partial<FaqItemData> | null>(null);

  if (!isOpen) return null;

  const handleStartCreate = () => {
    setEditingFaq({
      id: `faq-${Date.now()}`,
      slug: `new-question-${Date.now()}`,
      question: '',
      shortAnswer: '',
      detailedAnswer: '',
      categoryId: 'getting-started',
      industryIds: [],
      productModuleIds: ['module-accounting'],
      keywords: ['msmebooks', 'guide'],
      relatedFaqIds: [],
      featureStatus: 'Available',
      subscriptionPlan: 'All Plans',
      displayOrder: faqs.length + 1,
      isFeatured: false,
      isPopular: false,
      helpfulVotes: 0,
      unhelpfulVotes: 0,
      publicationStatus: 'Draft',
      lastVerifiedDate: new Date().toISOString().split('T')[0],
      author: 'Content Editor',
      reviewer: 'Pending Review'
    });
    setActiveTab('editor');
  };

  const handleStartEdit = (faq: FaqItemData) => {
    setEditingFaq({ ...faq, relatedFaqIds: faq.relatedFaqIds || [] });
    setActiveTab('editor');
  };

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq || !editingFaq.question || !editingFaq.shortAnswer) {
      alert('Please fill out the question and direct answer.');
      return;
    }

    onSaveFaq({
      ...(editingFaq as FaqItemData),
      relatedFaqIds: editingFaq.relatedFaqIds || []
    });
    setActiveTab('list');
    setEditingFaq(null);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(faqs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `msmebooks-faq-database-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtered FAQs inside CMS table
  const displayedFaqs = faqs.filter((f) => {
    const matchesStatus = filterStatus === 'all' || f.publicationStatus === filterStatus;
    const matchesSearch =
      !searchFilter ||
      f.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.categoryId.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate simple analytics
  const totalHelpful = faqs.reduce((acc, f) => acc + f.helpfulVotes, 0);
  const totalUnhelpful = faqs.reduce((acc, f) => acc + f.unhelpfulVotes, 0);
  const satisfactionRate =
    totalHelpful + totalUnhelpful > 0
      ? Math.round((totalHelpful / (totalHelpful + totalUnhelpful)) * 100)
      : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-[#131E36] w-full max-w-5xl h-[700px] max-h-[94vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-300">
        {/* CMS Top Header */}
        <div className="bg-[#17233D] dark:bg-[#070D1B] text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#1254B5] text-[#B7E522] flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base">MsmeBooks FAQ & Knowledge CMS</h3>
                <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30">
                  v2.4 Editorial Engine
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Centralized multi-channel FAQ publishing & RBAC governance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Role Simulator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs bg-slate-800 dark:bg-[#1A2642] px-2.5 py-1 rounded-lg border border-slate-700">
              <span className="text-slate-400">Role:</span>
              <select
                value={currentUserRole}
                onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
                className="bg-transparent text-[#B7E522] font-bold focus:outline-none cursor-pointer"
              >
                <option value="Admin" className="bg-slate-900 text-white">Admin (Full Control)</option>
                <option value="Editor" className="bg-slate-900 text-white">Editor (Draft & Update)</option>
                <option value="Reviewer" className="bg-slate-900 text-white">Reviewer (Approve)</option>
                <option value="Support Agent" className="bg-slate-900 text-white">Support Agent (Read Only)</option>
              </select>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation & Toolbar */}
        <div className="bg-slate-100 dark:bg-[#0E1726] px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('list');
                setEditingFaq(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white dark:bg-[#1A2642] text-[#1254B5] dark:text-[#B7E522] shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All FAQs ({faqs.length})
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-[#1A2642] text-[#1254B5] dark:text-[#B7E522] shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Analytics & Helpfulness
            </button>
            {editingFaq && (
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                  activeTab === 'editor'
                    ? 'bg-white dark:bg-[#1A2642] text-[#1254B5] dark:text-[#B7E522] shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {editingFaq.question ? 'Edit Entry' : 'New Entry'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1A2642] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#223359] transition cursor-pointer"
              title="Export database as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            {(currentUserRole === 'Admin' || currentUserRole === 'Editor') && (
              <button
                onClick={handleStartCreate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1254B5] hover:bg-[#0A3D87] text-white font-bold transition shadow-xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create FAQ</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Main View */}
        <div className="flex-1 overflow-y-auto p-5 text-sm bg-white dark:bg-[#131E36] transition-colors duration-300">
          {/* TAB 1: FAQ TABLE LIST */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search by question or category..."
                    className="w-full text-xs py-2 pl-8 pr-3 bg-white dark:bg-[#0B132B] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1254B5] dark:focus:border-[#3B82F6]"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="text-xs py-1.5 px-3 bg-white dark:bg-[#0B132B] border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#1254B5] dark:focus:border-[#3B82F6] cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Technical Review">Technical Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-[#0E1726] text-slate-600 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Question</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Verified</th>
                      <th className="py-3 px-4">Helpful</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {displayedFaqs.map((faq) => (
                      <tr key={faq.id} className="hover:bg-blue-50/40 dark:hover:bg-[#1A2642]/60 transition">
                        <td className="py-3 px-4 font-semibold text-[#17233D] dark:text-white max-w-xs truncate">
                          {faq.question}
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 capitalize">
                          {faq.categoryId.replace('-', ' ')}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              faq.publicationStatus === 'Published'
                                ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300'
                                : faq.publicationStatus === 'Draft'
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                : 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300'
                            }`}
                          >
                            {faq.publicationStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {faq.lastVerifiedDate}
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">
                          👍 {faq.helpfulVotes}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleStartEdit(faq)}
                              className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-[#1254B5] dark:hover:text-[#B7E522] hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                              title="Edit FAQ"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {currentUserRole === 'Admin' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Delete FAQ: "${faq.question}"?`)) {
                                    onDeleteFaq(faq.id);
                                  }
                                }}
                                className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                title="Delete FAQ"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: EDITOR */}
          {activeTab === 'editor' && editingFaq && (
            <form onSubmit={handleSaveCurrent} className="space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-[#17233D] dark:text-white text-base">
                  {editingFaq.question ? 'Edit Knowledge Article' : 'Draft New FAQ Entry'}
                </h4>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('list')}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#1254B5] hover:bg-[#0A3D87] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save & Publish</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Natural Language Question *
                </label>
                <input
                  type="text"
                  required
                  value={editingFaq.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="e.g. Can I manage multiple hotel branches in MsmeBooks?"
                  className="w-full text-xs py-2 px-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0B132B] text-slate-800 dark:text-white focus:outline-none focus:border-[#1254B5] dark:focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Direct Short Answer (30–70 words) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editingFaq.shortAnswer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, shortAnswer: e.target.value })}
                  placeholder="Concise direct answer that quickly informs the reader..."
                  className="w-full text-xs py-2 px-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0B132B] text-slate-800 dark:text-white focus:outline-none focus:border-[#1254B5] dark:focus:border-[#3B82F6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Explanation & Context
                </label>
                <textarea
                  rows={3}
                  value={editingFaq.detailedAnswer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, detailedAnswer: e.target.value })}
                  placeholder="Elaborated operational details, rules, and guidance..."
                  className="w-full text-xs py-2 px-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0B132B] text-slate-800 dark:text-white focus:outline-none focus:border-[#1254B5] dark:focus:border-[#3B82F6]"
                />
              </div>

              {/* Localized Translations (i18n: FR, ES, AR) */}
              <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-[#0E1726] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1254B5] dark:text-[#B7E522] flex items-center gap-1.5 uppercase tracking-wide">
                    <Globe className="w-3.5 h-3.5" />
                    Multilingual Translations (i18n)
                  </span>
                  <div className="flex items-center gap-1 bg-white dark:bg-[#131E36] p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    {(['fr', 'es', 'ar'] as const).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setEditorLocale(loc)}
                        className={`px-2 py-0.5 text-xs font-bold rounded cursor-pointer ${
                          editorLocale === loc
                            ? 'bg-[#1254B5] text-white shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        {loc.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {editorLocale.toUpperCase()} Translated Question
                  </label>
                  <input
                    type="text"
                    dir={editorLocale === 'ar' ? 'rtl' : 'ltr'}
                    value={editingFaq.translations?.[editorLocale]?.question || ''}
                    onChange={(e) => {
                      const prevTrans = editingFaq.translations || {};
                      const curr = prevTrans[editorLocale] || {};
                      setEditingFaq({
                        ...editingFaq,
                        translations: {
                          ...prevTrans,
                          [editorLocale]: {
                            ...curr,
                            question: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder={`Translated question in ${editorLocale.toUpperCase()}...`}
                    className="w-full text-xs py-1.5 px-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#131E36] text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    {editorLocale.toUpperCase()} Translated Short Answer
                  </label>
                  <textarea
                    rows={2}
                    dir={editorLocale === 'ar' ? 'rtl' : 'ltr'}
                    value={editingFaq.translations?.[editorLocale]?.shortAnswer || ''}
                    onChange={(e) => {
                      const prevTrans = editingFaq.translations || {};
                      const curr = prevTrans[editorLocale] || {};
                      setEditingFaq({
                        ...editingFaq,
                        translations: {
                          ...prevTrans,
                          [editorLocale]: {
                            ...curr,
                            shortAnswer: e.target.value
                          }
                        }
                      });
                    }}
                    placeholder={`Translated short answer in ${editorLocale.toUpperCase()}...`}
                    className="w-full text-xs py-1.5 px-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#131E36] text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={editingFaq.categoryId}
                    onChange={(e) => setEditingFaq({ ...editingFaq, categoryId: e.target.value })}
                    className="w-full text-xs py-2 px-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0B132B] text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                  >
                    {FAQ_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Feature Status</label>
                  <select
                    value={editingFaq.featureStatus}
                    onChange={(e) =>
                      setEditingFaq({ ...editingFaq, featureStatus: e.target.value as any })
                    }
                    className="w-full text-xs py-2 px-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0B132B] text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Available">Available</option>
                    <option value="Beta">Beta</option>
                    <option value="Add-on">Add-on</option>
                    <option value="Planned">Planned</option>
                    <option value="Contact Sales">Contact Sales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Editorial Workflow</label>
                  <select
                    value={editingFaq.publicationStatus}
                    onChange={(e) =>
                      setEditingFaq({ ...editingFaq, publicationStatus: e.target.value as any })
                    }
                    className="w-full text-xs py-2 px-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#0B132B] text-[#1254B5] dark:text-[#B7E522] focus:outline-none font-bold cursor-pointer"
                  >
                    <option value="Draft">Draft (Internal)</option>
                    <option value="Technical Review">Technical Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Published">Published (Live Public)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Related Articles (relatedFaqIds) Selector */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0E1726] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Related Articles (relatedFaqIds)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {(editingFaq.relatedFaqIds || []).length} selected
                  </span>
                </div>

                {(editingFaq.relatedFaqIds || []).length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {(editingFaq.relatedFaqIds || []).map((relId) => {
                      const target = faqs.find((f) => f.id === relId);
                      return (
                        <span
                          key={relId}
                          className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1254B5] dark:text-[#B7E522] border border-blue-200 dark:border-blue-800"
                        >
                          <span className="truncate max-w-[260px]">
                            {target ? target.question : relId}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingFaq({
                                ...editingFaq,
                                relatedFaqIds: (editingFaq.relatedFaqIds || []).filter((id) => id !== relId)
                              })
                            }
                            className="hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                            aria-label="Remove related article"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}

                <select
                  value=""
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    if (!selectedId) return;
                    const existing = editingFaq.relatedFaqIds || [];
                    if (!existing.includes(selectedId)) {
                      setEditingFaq({
                        ...editingFaq,
                        relatedFaqIds: [...existing, selectedId]
                      });
                    }
                  }}
                  className="w-full text-xs py-2 px-3 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-[#131E36] text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                >
                  <option value="">+ Add a related FAQ article...</option>
                  {faqs
                    .filter(
                      (candidate) =>
                        candidate.id !== editingFaq.id &&
                        !(editingFaq.relatedFaqIds || []).includes(candidate.id)
                    )
                    .map((candidate) => (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.question} ({candidate.categoryId})
                      </option>
                    ))}
                </select>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingFaq.isFeatured || false}
                    onChange={(e) => setEditingFaq({ ...editingFaq, isFeatured: e.target.checked })}
                    className="rounded text-[#1254B5]"
                  />
                  <span>Mark as Featured on Homepage & Hub</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingFaq.isPopular || false}
                    onChange={(e) => setEditingFaq({ ...editingFaq, isPopular: e.target.checked })}
                    className="rounded text-[#1254B5]"
                  />
                  <span>Display in Most Popular FAQs</span>
                </label>
              </div>
            </form>
          )}

          {/* TAB 3: ANALYTICS & FEEDBACK (Section 32) */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Global Currency Revenue Pulse Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-[#0E1726] dark:to-[#162038] border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Coins className="w-5 h-5 text-[#1254B5] dark:text-[#B7E522]" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white block">
                      Live Transaction Volume Converted to {currencyInfo.flag} {currencyInfo.name} ({currencyInfo.code})
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Exchange Anchor: 1 USD = {currencyInfo.rateAgainstUSD.toLocaleString()} {currencyInfo.code} • Recalculates dynamically
                    </span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#1254B5] text-white">
                  Active: {currencyInfo.code}
                </span>
              </div>

              {/* Converted Platform Transaction Figures */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-[#0E1726] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Monthly Merchant POS Volume</div>
                  <div className="text-2xl font-extrabold text-[#1254B5] dark:text-[#3B82F6] mt-1">
                    {formatFromUSD(28450000, { compact: true })}
                  </div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                    Across 18 African & Global markets
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#0E1726] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Average POS Ticket Size</div>
                  <div className="text-2xl font-extrabold text-[#1254B5] dark:text-[#3B82F6] mt-1">
                    {formatFromUSD(38.5, { customDecimals: 2 })}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Per checkout transaction
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#0E1726] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Software MRR Processed</div>
                  <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                    {formatFromUSD(340000, { compact: true })}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Recurring SaaS revenue
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-[#0E1726] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Published FAQs</div>
                  <div className="text-2xl font-extrabold text-[#1254B5] dark:text-[#3B82F6] mt-1">{faqs.length}</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">100% Verified</div>
                </div>

                <div className="bg-slate-50 dark:bg-[#0E1726] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Customer Helpfulness Rate</div>
                  <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                    {satisfactionRate}%
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    {totalHelpful} positive votes
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-[#0E1726] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Top Search Keywords</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
                    VAT, POS offline, Hotel PMS
                  </div>
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">1,482 inquiries this month</div>
                </div>

                <div className="bg-slate-50 dark:bg-[#0E1726] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Unanswered Queries</div>
                  <div className="text-2xl font-extrabold text-slate-800 dark:text-slate-200 mt-1">0</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">All searches resolved</div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#0E1726] p-5 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-[#17233D] dark:text-white text-sm mb-3">
                  Top 5 Most Engaged Support Topics
                </h4>
                <div className="space-y-2 text-xs">
                  {faqs
                    .sort((a, b) => b.helpfulVotes - a.helpfulVotes)
                    .slice(0, 5)
                    .map((faq, i) => (
                      <div
                        key={faq.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-[#131E36] border border-slate-100 dark:border-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#1254B5] dark:text-blue-300 font-bold text-[11px] flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{faq.question}</span>
                        </div>
                        <span className="text-emerald-700 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                          {faq.helpfulVotes} helpful votes
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-[#0E1726] p-3 px-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>Editorial standard compliant with WCAG AA and SOC 2 data isolation.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold cursor-pointer transition"
          >
            Close CMS
          </button>
        </div>
      </div>
    </div>
  );
};
