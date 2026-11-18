import React, { useState, useEffect } from 'react';
import { Article, BlogAnalytics, Author } from '../types';
import {
  X,
  BarChart3,
  FileText,
  Plus,
  Users,
  Eye,
  TrendingUp,
  Search,
  CheckCircle2,
  Trash2,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  DollarSign,
  Receipt,
  CreditCard,
  Building2,
  ArrowRightLeft,
  ShieldCheck,
  Check
} from 'lucide-react';
import { authors, blogCategories } from '../data/mockArticles';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';

interface LiveTransaction {
  id: string;
  business: string;
  category: string;
  city: string;
  country: string;
  flag: string;
  type: 'POS Terminal' | 'Mobile Invoicing' | 'Web Order' | 'QR Pay';
  paymentMethod: 'Bank Transfer' | 'Debit Card' | 'Mobile Money' | 'USSD' | 'Cash';
  amountNGN: number;
  timeAgo: string;
  status: 'Reconciled' | 'Audited' | 'Settled';
}

const liveTransactions: LiveTransaction[] = [
  {
    id: 'TX-89241',
    business: 'Zahara Supermarket (Victoria Island)',
    category: 'Retail & Supermarkets',
    city: 'Lagos',
    country: 'Nigeria',
    flag: '🇳🇬',
    type: 'POS Terminal',
    paymentMethod: 'Debit Card',
    amountNGN: 48500,
    timeAgo: '2m ago',
    status: 'Reconciled',
  },
  {
    id: 'TX-89240',
    business: 'Savannah Fresh Harvest Hub',
    category: 'Wholesale & Logistics',
    city: 'Nairobi',
    country: 'Kenya',
    flag: '🇰🇪',
    type: 'Mobile Invoicing',
    paymentMethod: 'Mobile Money',
    amountNGN: 520000,
    timeAgo: '5m ago',
    status: 'Settled',
  },
  {
    id: 'TX-89239',
    business: 'Buka Royale Gourmet Kitchen',
    category: 'Hospitality & Food',
    city: 'Accra',
    country: 'Ghana',
    flag: '🇬🇭',
    type: 'POS Terminal',
    paymentMethod: 'Mobile Money',
    amountNGN: 32400,
    timeAgo: '11m ago',
    status: 'Audited',
  },
  {
    id: 'TX-89238',
    business: 'MedPlus Express Pharmacy',
    category: 'Healthcare & Pharma',
    city: 'Abuja',
    country: 'Nigeria',
    flag: '🇳🇬',
    type: 'POS Terminal',
    paymentMethod: 'Debit Card',
    amountNGN: 18750,
    timeAgo: '16m ago',
    status: 'Reconciled',
  },
  {
    id: 'TX-89237',
    business: 'Apex Industrial & Building Supply',
    category: 'Hardware & Construction',
    city: 'Johannesburg',
    country: 'South Africa',
    flag: '🇿🇦',
    type: 'Mobile Invoicing',
    paymentMethod: 'Bank Transfer',
    amountNGN: 1450000,
    timeAgo: '24m ago',
    status: 'Settled',
  },
  {
    id: 'TX-89236',
    business: 'Chic African Haute Boutique',
    category: 'Fashion & Apparel',
    city: 'Kigali',
    country: 'Rwanda',
    flag: '🇷🇼',
    type: 'QR Pay',
    paymentMethod: 'Mobile Money',
    amountNGN: 65000,
    timeAgo: '35m ago',
    status: 'Reconciled',
  },
  {
    id: 'TX-89235',
    business: 'Atlas Sahara Transport & Distribution',
    category: 'Logistics & Cargo',
    city: 'Casablanca',
    country: 'Morocco',
    flag: '🇲🇦',
    type: 'Mobile Invoicing',
    paymentMethod: 'Bank Transfer',
    amountNGN: 410000,
    timeAgo: '42m ago',
    status: 'Audited',
  },
  {
    id: 'TX-89234',
    business: 'Nile Delta Wholesale Agritech',
    category: 'Agriculture & Commodities',
    city: 'Cairo',
    country: 'Egypt',
    flag: '🇪🇬',
    type: 'Web Order',
    paymentMethod: 'Bank Transfer',
    amountNGN: 890000,
    timeAgo: '58m ago',
    status: 'Settled',
  },
];

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onAddArticle: (newArticle: Article) => void;
  onDeleteArticle: (id: string) => void;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  articles,
  onAddArticle,
  onDeleteArticle
}) => {
  const { dict, translateCategory } = useLanguage();
  const { currency, setCurrency, currentCurrencyInfo, supportedCurrencies, formatFromNGN, convertFromNGN } = useCurrency();
  const [activeTab, setActiveTab] = useState<'transactions' | 'analytics' | 'articles' | 'create'>('transactions');
  const [analytics, setAnalytics] = useState<BlogAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [transactionSearch, setTransactionSearch] = useState('');

  // New article form state
  const [newTitle, setNewTitle] = useState('');
  const [newExcerpt, setNewExcerpt] = useState('');
  const [newCategory, setNewCategory] = useState('Accounting');
  const [newIndustry, setNewIndustry] = useState('Retail');
  const [newContentType, setNewContentType] = useState<Article['contentType']>('Articles');
  const [newReadTime, setNewReadTime] = useState('5 min read');
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80');
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
    }
  }, [isOpen]);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newExcerpt || !newContent) return;

    const slug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const created: Article = {
      id: `art-${Date.now()}`,
      slug,
      title: newTitle,
      excerpt: newExcerpt,
      category: newCategory,
      industry: newIndustry,
      contentType: newContentType,
      author: authors[0],
      publishedAt: 'Just now',
      readTime: newReadTime,
      featuredImage: newImage,
      views: 120,
      likes: 14,
      tags: [newCategory, newIndustry, 'SME Growth'],
      metaTitle: `${newTitle} | MsmeBooks Blog`,
      metaDescription: newExcerpt,
      tableOfContents: [
        { id: 'sec-overview', text: 'Executive Overview', level: 2 },
        { id: 'sec-tactics', text: 'Operational Implementation', level: 2 },
        { id: 'sec-conclusion', text: 'Summary & Next Steps', level: 2 },
      ],
      content: `<p class="lead">${newExcerpt}</p><h2 id="sec-overview">Executive Overview</h2><p>${newContent}</p><h2 id="sec-tactics">Operational Implementation</h2><p>Deploying consistent financial controls with MsmeBooks allows managers to retain clarity without sacrificing operational velocity.</p><h2 id="sec-conclusion">Summary & Next Steps</h2><p>Regular review of these practices ensures healthy margins, minimized shrinkage, and sustainable growth.</p>`,
    };

    onAddArticle(created);
    setFormSuccess(true);
    setNewTitle('');
    setNewExcerpt('');
    setNewContent('');
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('articles');
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-[#0B1E36] rounded-3xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top Header */}
        <div className="p-5 sm:p-6 bg-slate-900 dark:bg-[#050E1A] text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-slate-950 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span>{dict.admin.title}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-lime-400 text-slate-950 font-extrabold uppercase">
                  Admin Active
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage transactions, global revenue conversions, articles & real-time analytics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Currency Indicator in Admin Modal Header */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
              <DollarSign className="w-3.5 h-3.5 text-lime-400" />
              <span className="text-slate-400 text-[11px]">Display Currency:</span>
              <span className="font-mono font-bold text-white flex items-center gap-1">
                <span>{currentCurrencyInfo.flag}</span>
                <span>{currentCurrencyInfo.code}</span>
                <span className="text-lime-400">({currentCurrencyInfo.symbol})</span>
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#071527] px-6 pt-3 gap-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'bg-white dark:bg-[#0B1E36] text-blue-700 dark:text-lime-400 border-t-2 border-lime-500 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            <span>Global Transactions & Revenue</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-white dark:bg-[#0B1E36] text-blue-700 dark:text-lime-400 border-t-2 border-lime-500 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Blog Analytics & Traffic</span>
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'articles'
                ? 'bg-white dark:bg-[#0B1E36] text-blue-700 dark:text-lime-400 border-t-2 border-lime-500 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{dict.admin.totalArticles} ({articles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'create'
                ? 'bg-white dark:bg-[#0B1E36] text-blue-700 dark:text-lime-400 border-t-2 border-lime-500 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4 text-lime-600 dark:text-lime-400" />
            <span>{dict.admin.createArticle}</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50/50 dark:bg-[#071527]">
          {/* 0. Transactions & Revenue Dashboard */}
          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* Currency Rate Provider Bar with Quick Currency Toggles */}
              <div className="bg-white dark:bg-[#0E2443] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-lime-400/20 text-lime-600 dark:text-lime-400 flex items-center justify-center font-bold">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Global Currency Conversion Provider</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-[10px] font-bold">
                          16 Active Currencies
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Toggle currency here or in the header to globally transform all financial ledgers, revenue stats and case outcomes
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-50 dark:bg-[#071527] px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Current Provider Reference:
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      1 USD = {currentCurrencyInfo.rateToUSD.toLocaleString()} {currentCurrencyInfo.code}
                    </span>
                  </div>
                </div>

                {/* 16 Currency Toggle Buttons */}
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {supportedCurrencies.map((c) => {
                    const isSelected = c.code === currency;
                    return (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => setCurrency(c.code)}
                        className={`p-2 rounded-xl text-center transition-all flex flex-col items-center justify-center gap-0.5 ${
                          isSelected
                            ? 'bg-blue-600 dark:bg-lime-400 text-white dark:text-slate-950 font-bold shadow-md scale-105 ring-2 ring-blue-400 dark:ring-lime-300'
                            : 'bg-slate-50 dark:bg-[#071527] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#132F55] border border-slate-200/60 dark:border-slate-700/60'
                        }`}
                        title={`${c.name} (${c.symbol})`}
                      >
                        <span className="text-base leading-none">{c.flag}</span>
                        <span className="text-[11px] font-extrabold tracking-tight">{c.code}</span>
                        <span className={`text-[10px] font-mono ${isSelected ? 'text-white/90 dark:text-slate-900' : 'text-slate-400 dark:text-slate-400'}`}>
                          {c.symbol}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4 Financial & Revenue KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#0E2443] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Gross Platform Volume (GMV)</span>
                    <TrendingUp className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                    {formatFromNGN(4850000000, { compact: true })}
                  </div>
                  <div className="text-[11px] text-lime-600 dark:text-lime-400 font-semibold mt-1">
                    +34.2% YoY • 12,000+ MSMEs
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0E2443] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Monthly Managed Revenue</span>
                    <CreditCard className="w-4 h-4 text-blue-600 dark:text-lime-400" />
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                    {formatFromNGN(1240000000, { compact: true })}
                  </div>
                  <div className="text-[11px] text-blue-700 dark:text-lime-400 font-semibold mt-1">
                    Recurring Merchant Base
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0E2443] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Avg POS Checkout Ticket</span>
                    <Receipt className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                    {formatFromNGN(18500)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-1">
                    Across 34,000 daily checkouts
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0E2443] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Shrinkage Prevented</span>
                    <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
                    {formatFromNGN(76400000, { compact: true })}
                  </div>
                  <div className="text-[11px] text-lime-600 dark:text-lime-400 font-semibold mt-1">
                    Audited inventory protection
                  </div>
                </div>
              </div>

              {/* Real-Time Transaction Ledger Stream */}
              <div className="bg-white dark:bg-[#0E2443] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-blue-600 dark:text-lime-400" />
                      <span>Live Multi-Currency Transaction Ledger</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Real-time POS checkout orders and invoice settlements converted to {currentCurrencyInfo.name} ({currentCurrencyInfo.code})
                    </p>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={transactionSearch}
                      onChange={(e) => setTransactionSearch(e.target.value)}
                      placeholder="Filter merchant or ref..."
                      className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#071527] border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-lime-400"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-[#071527] text-slate-500 dark:text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Ref & Time</th>
                        <th className="py-3 px-4">Merchant Business</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Channel</th>
                        <th className="py-3 px-4">Tender</th>
                        <th className="py-3 px-4 text-right">Converted Amount ({currentCurrencyInfo.code})</th>
                        <th className="py-3 px-4 text-right">Audit Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {liveTransactions
                        .filter(
                          (t) =>
                            t.business.toLowerCase().includes(transactionSearch.toLowerCase()) ||
                            t.id.toLowerCase().includes(transactionSearch.toLowerCase()) ||
                            t.city.toLowerCase().includes(transactionSearch.toLowerCase())
                        )
                        .map((tx) => (
                          <tr
                            key={tx.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-[#102A4C]/50 transition-colors"
                          >
                            <td className="py-3.5 px-4">
                              <div className="font-mono font-bold text-slate-900 dark:text-white">
                                {tx.id}
                              </div>
                              <div className="text-[11px] text-slate-400">{tx.timeAgo}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900 dark:text-white">
                                {tx.business}
                              </div>
                              <div className="text-[11px] text-blue-700 dark:text-lime-400">
                                {tx.category}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                              <div className="flex items-center gap-1.5 font-medium">
                                <span>{tx.flag}</span>
                                <span>{tx.city}, {tx.country}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#102A4C] text-[11px] font-semibold">
                                {tx.type}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                              <span className="text-[11px] font-medium">{tx.paymentMethod}</span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-mono">
                              <div className="text-sm font-extrabold text-slate-900 dark:text-white">
                                {formatFromNGN(tx.amountNGN)}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                base ₦{tx.amountNGN.toLocaleString()}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lime-100 dark:bg-lime-950/60 text-lime-900 dark:text-lime-300">
                                <Check className="w-3 h-3" />
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 bg-slate-50/80 dark:bg-[#0A1A2F] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                    <span>Real-time conversion updated globally across all views</span>
                  </div>
                  <div className="font-mono text-slate-700 dark:text-slate-300 font-semibold">
                    1 USD = {currentCurrencyInfo.rateToUSD.toLocaleString()} {currentCurrencyInfo.code} ({currentCurrencyInfo.name})
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1. Analytics Dashboard */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#0E2443] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Total Article Views</span>
                    <Eye className="w-4 h-4 text-blue-600 dark:text-lime-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {analytics?.totalViews?.toLocaleString() || '84,320'}
                  </div>
                  <div className="text-[11px] text-lime-600 dark:text-lime-400 font-semibold mt-1">
                    +18.4% vs last 30 days
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0E2443] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Unique SME Visitors</span>
                    <Users className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {analytics?.uniqueVisitors?.toLocaleString() || '57,330'}
                  </div>
                  <div className="text-[11px] text-lime-600 dark:text-lime-400 font-semibold mt-1">
                    African & Global SME reach
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0E2443] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>Newsletter Subscribers</span>
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-lime-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {analytics?.newsletterSubscribers?.toLocaleString() || '1,423'}
                  </div>
                  <div className="text-[11px] text-lime-600 dark:text-lime-400 font-semibold mt-1">
                    +14 new this week
                  </div>
                </div>

                <div className="bg-white dark:bg-[#0E2443] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>CTA Conversions ("Start Free")</span>
                    <ArrowUpRight className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {analytics?.ctaClicks?.toLocaleString() || '3,120'}
                  </div>
                  <div className="text-[11px] text-blue-700 dark:text-lime-400 font-semibold mt-1">
                    High intent software leads
                  </div>
                </div>
              </div>

              {/* Two Column Grid: Top Articles & Search Queries */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Articles */}
                <div className="bg-white dark:bg-[#0E2443] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-lime-400" />
                    <span>Most Popular Articles</span>
                  </h3>
                  <div className="space-y-3">
                    {analytics?.topArticles?.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0B1E36] border border-slate-100 dark:border-slate-700"
                      >
                        <div className="truncate pr-3">
                          <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-blue-700 dark:text-lime-400 font-semibold">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 shrink-0">
                          {item.views.toLocaleString()} reads
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Popular Search Queries */}
                <div className="bg-white dark:bg-[#0E2443] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Search className="w-4 h-4 text-lime-600 dark:text-lime-400" />
                    <span>Top Search Keywords</span>
                  </h3>
                  <div className="space-y-3">
                    {analytics?.searchQueries?.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#0B1E36] border border-slate-100 dark:border-slate-700"
                      >
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                          "{item.query}"
                        </span>
                        <span className="text-xs font-bold text-slate-950 bg-lime-400 px-2 py-0.5 rounded-full">
                          {item.count} searches
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Traffic Sources breakdown */}
              <div className="bg-white dark:bg-[#0E2443] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                  Traffic Acquisition Channels
                </h3>
                <div className="space-y-3">
                  {analytics?.trafficSources?.map((ts, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        <span>{ts.source}</span>
                        <span>{ts.percentage}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-blue-700 dark:bg-lime-400 rounded-full"
                          style={{ width: `${ts.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. Manage Existing Articles */}
          {activeTab === 'articles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Total published articles: {articles.length}
                </span>
                <button
                  onClick={() => setActiveTab('create')}
                  className="px-3.5 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Post</span>
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#0E2443] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-[#132F55] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={art.featuredImage}
                        alt={art.title}
                        className="w-16 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {art.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span className="font-semibold text-blue-700 dark:text-lime-400">
                            {art.category}
                          </span>
                          <span>·</span>
                          <span>{art.publishedAt}</span>
                          <span>·</span>
                          <span>{art.views.toLocaleString()} views</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-100 dark:bg-lime-950/60 text-lime-900 dark:text-lime-300 uppercase">
                        Published
                      </span>
                      <button
                        onClick={() => onDeleteArticle(art.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Delete article"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Create New Article Form */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateArticle} className="space-y-5 bg-white dark:bg-[#0E2443] p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              {formSuccess && (
                <div className="p-4 bg-lime-50 dark:bg-lime-950/40 border border-lime-400 dark:border-lime-700 rounded-xl text-xs text-lime-900 dark:text-lime-300 flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-lime-600 dark:text-lime-400" />
                  <span>Article published successfully to the MsmeBooks blog!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Modern Inventory Control for Fast-Growing Wholesale Hubs"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E36] text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                  Short Excerpt / Meta Description *
                </label>
                <textarea
                  rows={2}
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  placeholder="A compelling 1-2 sentence preview for search results and social cards..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E36] text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E36] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                  >
                    {blogCategories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                    Industry Domain
                  </label>
                  <select
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E36] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                  >
                    <option value="Retail">Retail</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Services">Services</option>
                    <option value="Fashion">Fashion</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                    Estimated Reading Time
                  </label>
                  <input
                    type="text"
                    value={newReadTime}
                    onChange={(e) => setNewReadTime(e.target.value)}
                    placeholder="e.g. 6 min read"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E36] text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                  Featured Image URL (High-Resolution African SME Photography)
                </label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E36] text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
                  Article Body Text *
                </label>
                <textarea
                  rows={6}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Draft the article body paragraphs, practical advice, and step-by-step points..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B1E36] text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-lime-400"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Publish Article to Live Hub
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
