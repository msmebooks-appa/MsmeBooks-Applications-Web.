import { BusinessGuide } from '../types';

export const mockGuides: BusinessGuide[] = [
  {
    id: 'guide-01',
    slug: 'accounting-fundamentals-guide',
    title: 'Accounting Guide: Complete Financial Control',
    category: 'Accounting',
    description: 'Understand core accounting fundamentals, double-entry principles, profit & loss analysis, and balance sheet health for growing businesses.',
    readTime: '15 min read',
    modulesCount: 6,
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    keyTopics: ['Cash vs Accrual Accounting', 'Trial Balance Preparation', 'Cash Flow Statements', 'Managing Accounts Payable']
  },
  {
    id: 'guide-02',
    slug: 'modern-pos-systems-guide',
    title: 'POS Guide: Modern Checkout & Multi-Store Control',
    category: 'POS Systems',
    description: 'Learn how modern POS systems streamline cashier shifts, accept cashless payments, prevent till shortages, and connect multi-branch locations.',
    readTime: '12 min read',
    modulesCount: 5,
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80',
    keyTopics: ['Offline-First POS', 'Hardware Setup (Printers & Barcode)', 'Cashier Rights & Audits', 'Loyalty & Customer Profiles']
  },
  {
    id: 'guide-03',
    slug: 'inventory-optimization-guide',
    title: 'Inventory Guide: Stop Shrinkage & Streamline Stock',
    category: 'Inventory',
    description: 'Master stock auditing, cycle counts, automated reorder thresholds, and warehouse logistics to prevent stockouts and tie-up capital.',
    readTime: '18 min read',
    modulesCount: 7,
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    keyTopics: ['FIFO Batch Tracking', 'Perpetual Inventory Audits', 'Optimal Safety Stock Math', 'Vendor Order Management']
  },
  {
    id: 'guide-04',
    slug: 'sme-scale-growth-guide',
    title: 'SME Growth Guide: Scaling a Profitable Enterprise',
    category: 'SME Growth',
    description: 'Actionable strategies for scaling from one location to a regional network, securing commercial credit, and building self-managing operations.',
    readTime: '20 min read',
    modulesCount: 8,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    keyTopics: ['Unit Economics Analysis', 'Bankable Financial Records', 'Staff KPI Alignment', 'Cross-Border AfCFTA Expansion']
  }
];
