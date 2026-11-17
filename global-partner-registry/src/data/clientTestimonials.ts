export interface ClientMetric {
  label: string;
  value: string;
  change: string;
}

export interface VideoTranscriptItem {
  time: string;
  speaker: string;
  text: string;
}

export type SpotlightIndustry = 
  | 'Retail'
  | 'Agriculture'
  | 'Tech'
  | 'Healthcare & Pharmacy'
  | 'Hospitality & Restaurants'
  | 'Logistics & Distribution'
  | 'Manufacturing'
  | 'Professional Services'
  | 'Retail & Supermarkets'
  | 'Pharmacy & Healthcare'
  | 'Manufacturing & Agro'
  | string;

export interface ClientTestimonial {
  id: string;
  clientName: string;
  role: string;
  companyName: string;
  industry: SpotlightIndustry;
  location: string;
  countryFlag: string;
  type: 'video' | 'text';
  avatarUrl: string;
  coverUrl: string;
  videoDuration?: string;
  videoThumbnailUrl?: string;
  videoUrl?: string;
  headline: string;
  quote: string;
  fullStory: string;
  metrics: ClientMetric[];
  modulesUsed: string[];
  partnerInvolved: {
    name: string;
    tier: string;
    city: string;
  };
  implementationTime: string;
  verifiedDate: string;
  beforeState: string;
  afterState: string;
  rating: number;
  transcript?: VideoTranscriptItem[];
  isCommunitySubmission?: boolean;
  featuredOnSlider?: boolean;
  consentForSlider?: boolean;
}

export const COMMUNITY_STORIES_STORAGE_KEY = 'msmebooks_community_spotlight_stories';

export const loadCommunityStories = (): ClientTestimonial[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(COMMUNITY_STORIES_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load community stories from storage', e);
    return [];
  }
};

export const saveCommunityStory = (story: ClientTestimonial): ClientTestimonial[] => {
  if (typeof window === 'undefined') return [];
  try {
    const current = loadCommunityStories();
    const updated = [story, ...current.filter((s) => s.id !== story.id)];
    localStorage.setItem(COMMUNITY_STORIES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save community story to storage', e);
    return [];
  }
};

export const deleteCommunityStory = (storyId: string): ClientTestimonial[] => {
  if (typeof window === 'undefined') return [];
  try {
    const current = loadCommunityStories();
    const updated = current.filter((s) => s.id !== storyId);
    localStorage.setItem(COMMUNITY_STORIES_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete community story', e);
    return [];
  }
};

export const CLIENT_SPOTLIGHT_DATA: ClientTestimonial[] = [
  {
    id: 'spotlight-1',
    clientName: 'Amina Bello',
    role: 'Founder & Managing Director',
    companyName: 'Saharan Fresh Supermarkets (4 Outlets)',
    industry: 'Retail & Supermarkets',
    location: 'Lagos & Abuja, Nigeria',
    countryFlag: '🇳🇬',
    type: 'video',
    avatarUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=900&auto=format&fit=crop&q=80',
    videoDuration: '2:14 min',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=900&auto=format&fit=crop&q=80',
    headline: 'Eliminated cash discrepancy and cut month-end closing from 9 days to 4 hours',
    quote: 'Prior to MsmeBooks, our four branches each ran disconnected tills. Cash balancing was a nightly nightmare. With our certified partner setting up automated multi-terminal sync, stock discrepancies dropped to almost zero.',
    fullStory: 'Saharan Fresh expanded rapidly from one neighborhood grocery to four high-volume supermarkets across Ikeja and Lekki. However, inventory shrinkage was leaking nearly 7% of monthly revenue due to untracked transfers and disparate POS logs. By partnering with PrimeLedger Africa to implement MsmeBooks Cloud Ledger and Barcode POS Gateway, all tills now reconcile in real time, and supplier invoices match physical receiving docks with three-way verification.',
    metrics: [
      { label: 'Reconciliation Speed', value: '4 Hours', change: '-94% time saved' },
      { label: 'Inventory Shrinkage', value: '0.4%', change: 'Down from 7.2%' },
      { label: 'Daily Tills Synced', value: '16 Terminals', change: '100% live cloud sync' }
    ],
    modulesUsed: ['Multi-Store POS Sync', 'Automated Bank Feeds', 'Batch Stock Reordering', 'FIRS Tax E-Invoice'],
    partnerInvolved: {
      name: 'PrimeLedger Africa Advisory',
      tier: 'Diamond Elite',
      city: 'Lagos, Nigeria'
    },
    implementationTime: '3 Weeks',
    verifiedDate: 'October 2024',
    beforeState: 'Manual paper logbooks at each cash drawer; staff spent weekends tallying registers; suppliers overbilled on untracked stock.',
    afterState: 'Single unified dashboard on mobile and desktop; instant barcode scanning; automatic daily P&L generated every evening at 9 PM.',
    rating: 5.0,
    transcript: [
      { time: '0:00', speaker: 'Amina Bello', text: 'When you operate four supermarkets in a bustling city like Lagos, every minute spent on manual reconciliation is money lost.' },
      { time: '0:28', speaker: 'Amina Bello', text: 'Our certified MsmeBooks partner, PrimeLedger, came directly to our store. Within three days, all 16 checkout counters were interconnected.' },
      { time: '1:05', speaker: 'Amina Bello', text: 'At 9:00 PM closing, our managers simply press one button. We know our exact gross margins, sales per aisle, and VAT breakdown.' },
      { time: '1:45', speaker: 'Amina Bello', text: 'I can finally focus on opening branch number five knowing our financial backbone is completely rock solid.' }
    ]
  },
  {
    id: 'spotlight-2',
    clientName: 'Dr. Samuel Mwangi',
    role: 'Lead Pharmacist & Managing Partner',
    companyName: 'Apex Cure Community Pharmacies',
    industry: 'Pharmacy & Healthcare',
    location: 'Nairobi & Nakuru, Kenya',
    countryFlag: '🇰🇪',
    type: 'video',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=900&auto=format&fit=crop&q=80',
    videoDuration: '1:48 min',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=900&auto=format&fit=crop&q=80',
    headline: '100% expiry tracking compliance and automated M-Pesa till reconciliation',
    quote: 'In pharmaceutical retail, expired drugs represent dead capital and regulatory risk. MsmeBooks batch-expiry notifications and M-Pesa till API transformed our cashflow from day one.',
    fullStory: 'Apex Cure manages three busy dispensaries dispensing over 450 prescriptions daily. Reconciling mobile money payments (M-Pesa) against customer purchase bills caused massive counter delays. MsmeBooks implementation partner Equator Cloud Financials integrated direct mobile payment callbacks and batch expiry alerts, saving 15 hours weekly and safeguarding patient medication safety.',
    metrics: [
      { label: 'Expired Stock Write-offs', value: '< 0.1%', change: 'Prevented $12,400 waste' },
      { label: 'Till Reconciliations', value: 'Real-time', change: 'Zero mismatched slips' },
      { label: 'Audit Readiness', value: '100%', change: 'KRA iTax compliant export' }
    ],
    modulesUsed: ['Batch & Expiry Ledger', 'M-Pesa Direct Till API', 'Multi-Dispenser Access Controls', 'Prescription Auditing'],
    partnerInvolved: {
      name: 'Equator Cloud Financials',
      tier: 'Platinum',
      city: 'Nairobi, Kenya'
    },
    implementationTime: '12 Days',
    verifiedDate: 'November 2024',
    beforeState: 'Pharmacists spent 2 hours every morning cross-checking M-Pesa reference codes against shelf tickets.',
    afterState: 'Customer taps phone, terminal automatically prints receipt and deducts medicine batch with zero manual code typing.',
    rating: 5.0,
    transcript: [
      { time: '0:00', speaker: 'Dr. Samuel Mwangi', text: 'Healthcare retail requires extreme precision. You cannot guess expiration dates or mix up controlled substances.' },
      { time: '0:32', speaker: 'Dr. Samuel Mwangi', text: 'MsmeBooks was tailored specifically for African retail environments with offline tolerance and instantaneous M-Pesa sync.' },
      { time: '1:10', speaker: 'Dr. Samuel Mwangi', text: 'We cut our expired drug write-offs from twelve thousand dollars a year down to practically zero.' }
    ]
  },
  {
    id: 'spotlight-3',
    clientName: 'Folake Adeleke',
    role: 'Head Chef & Co-Owner',
    companyName: 'Flavors of Oyo Restaurant Group',
    industry: 'Hospitality & Restaurants',
    location: 'Ibadan & Lagos, Nigeria',
    countryFlag: '🇳🇬',
    type: 'text',
    avatarUrl: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80',
    headline: 'Recipe-level food cost tracking saved 14% on monthly bulk kitchen procurement',
    quote: 'In the restaurant trade, food waste and undetected theft in the cold room eat away your margin. MsmeBooks tracks raw ingredients down to the gram per order rung up.',
    fullStory: 'Flavors of Oyo operates a 120-seat flagship restaurant and catering wing. Meat, poultry, and imported seasonings were constantly running short before supplier delivery days. Certified partner Sahel Accounting Solutions mapped their 85-dish menu into recipe BOMs (Bills of Materials) within MsmeBooks. Now, every jollof rice portion or grilled fish sold automatically updates remaining kitchen raw stores.',
    metrics: [
      { label: 'Food Cost Percentage', value: '28.4%', change: 'Reduced from 42.1%' },
      { label: 'Shrinkage & Wastage', value: '-65%', change: 'Strict recipe portion control' },
      { label: 'Daily Ticket Volume', value: '420+ Orders', change: 'Instant kitchen KDS sync' }
    ],
    modulesUsed: ['Recipe BOM & Kitchen Depletion', 'Table-Side Ordering', 'Supplier AP Management', 'Staff Tip Allocation'],
    partnerInvolved: {
      name: 'Sahel Accounting Solutions',
      tier: 'Gold',
      city: 'Ibadan, Nigeria'
    },
    implementationTime: '10 Days',
    verifiedDate: 'September 2024',
    beforeState: 'Chefs ordered bulk ingredients on intuition; month-end revealed missing cartons of protein without paper trail.',
    afterState: 'Automated reorder triggers when cold room supplies drop below safety stock; live margin reporting per menu item.',
    rating: 4.9
  },
  {
    id: 'spotlight-4',
    clientName: 'Kwame Mensah',
    role: 'Operations & Fleet Director',
    companyName: 'SwiftRoute Express Logistics',
    industry: 'Logistics & Distribution',
    location: 'Accra & Kumasi, Ghana',
    countryFlag: '🇬🇭',
    type: 'video',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&auto=format&fit=crop&q=80',
    videoDuration: '2:35 min',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&auto=format&fit=crop&q=80',
    headline: 'Waybill-to-invoice automation accelerated freight cash collections by 21 days',
    quote: 'We have 24 delivery trucks shuttling between Tema Harbor and Kumasi. Invoicing corporate shippers used to take 3 weeks after delivery. Now, drivers capture digital POD on mobile and invoices send automatically.',
    fullStory: 'SwiftRoute Express handles cross-country distribution for consumer goods importers. Unreconciled fuel cards, vehicle repair vouchers, and delayed proof-of-delivery (POD) certificates severely strained operational working capital. MsmeBooks implementation partner GoldCoast Business Systems established an automated dispatch-to-ledger workflow with mobile driver sign-offs.',
    metrics: [
      { label: 'Days Sales Outstanding', value: '14 Days', change: 'Improved from 35 days' },
      { label: 'Fuel Voucher Leakage', value: '0.0%', change: 'Driver fuel card integration' },
      { label: 'Monthly Waybills Processed', value: '1,850+', change: '100% digital trace' }
    ],
    modulesUsed: ['Waybill & POD Invoicing', 'Fleet Expense Allocation', 'Multi-Currency Cargo Billing', 'Automated Debtor Reminders'],
    partnerInvolved: {
      name: 'GoldCoast Business Systems',
      tier: 'Diamond Elite',
      city: 'Accra, Ghana'
    },
    implementationTime: '4 Weeks',
    verifiedDate: 'December 2024',
    beforeState: 'Drivers returned crumpled waybills every two weeks; receivables piled up while banks charged steep overdraft rates.',
    afterState: 'Customer receives automated SMS/Email invoice within 60 seconds of cargo dropoff; bank feeds automatically reconcile receipts.',
    rating: 5.0,
    transcript: [
      { time: '0:00', speaker: 'Kwame Mensah', text: 'In logistics, cash velocity is everything. If your trucks run but your payments take two months to collect, you will run out of fuel.' },
      { time: '0:45', speaker: 'Kwame Mensah', text: 'GoldCoast Business Systems customized MsmeBooks for our fleet. Waybills convert into verified invoices instantly upon client signature.' },
      { time: '1:30', speaker: 'Kwame Mensah', text: 'Our DSO dropped by three whole weeks. That freed up over forty thousand dollars in operational liquidity.' }
    ]
  },
  {
    id: 'spotlight-5',
    clientName: 'Chidinma Eze',
    role: 'Managing Director',
    companyName: 'Golden Harvest Agro Processing Ltd',
    industry: 'Manufacturing & Agro',
    location: 'Enugu & Onitsha, Nigeria',
    countryFlag: '🇳🇬',
    type: 'text',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=900&auto=format&fit=crop&q=80',
    headline: 'Secured $180k export credit facility thanks to verified MsmeBooks audit reports',
    quote: 'Commercial banks turned down our expansion loans because our farm co-op purchase receipts were handwritten. Our MsmeBooks partner restructured our books into compliant IFRS-SME statements.',
    fullStory: 'Golden Harvest processes cassava and palm oil into packaged consumer goods distributed across southern Nigeria and exported regionally. Raw material procurement from over 140 local smallholder farmers was challenging to document accurately for commercial lenders. PrimeLedger Africa set up mobile agent receipting in MsmeBooks, allowing field buyers to record farmgate purchases with GPS tags and timestamps.',
    metrics: [
      { label: 'Bank Credit Approved', value: '$180,000', change: 'First-time bank approval' },
      { label: 'Smallholder Payments', value: '140+ Farmers', change: 'Direct disbursement tracking' },
      { label: 'Cost of Goods Precision', value: '99.2%', change: 'True landed cost per unit' }
    ],
    modulesUsed: ['Agro Co-op Field Receipts', 'Landed Cost Calculator', 'IFRS for SMEs Audit Export', 'Fixed Asset Depreciation'],
    partnerInvolved: {
      name: 'PrimeLedger Africa Advisory',
      tier: 'Diamond Elite',
      city: 'Lagos & Enugu, Nigeria'
    },
    implementationTime: '3 Weeks',
    verifiedDate: 'August 2024',
    beforeState: 'Unverified paper bags of cash paid to farmgate brokers; no verifiable balance sheet for development finance institutions.',
    afterState: 'Auditor-verified digital ledger with traceable vendor receipts; secured commercial agribusiness loan at favorable interest rate.',
    rating: 5.0
  },
  {
    id: 'spotlight-6',
    clientName: 'Tariq El-Sayed',
    role: 'Co-Founder & Creative Director',
    companyName: 'Nile Bridge Digital & Media House',
    industry: 'Professional Services',
    location: 'Cairo & Alexandria, Egypt',
    countryFlag: '🇪🇬',
    type: 'video',
    avatarUrl: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80',
    videoDuration: '1:52 min',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop&q=80',
    headline: 'Real-time client retainer profitability tracking increased agency margins by 22%',
    quote: 'We were delivering great video campaigns for international brands, but billable hours were slipping through the cracks. MsmeBooks project accounting pinpointed which client retainers were actually bleeding cash.',
    fullStory: 'Nile Bridge employs 28 creatives, videographers, and copywriters. Billing monthly retainers alongside ad-hoc media production resulted in scope creep and late billing cycles. Certified partner Sphinx Bookkeeping Pro established project-based milestone billing and time-to-invoice tracking in MsmeBooks.',
    metrics: [
      { label: 'Net Profit Margin', value: '+22%', change: 'Pruned unprofitable retainers' },
      { label: 'Unbilled Time Recovered', value: '$8,600 / mo', change: 'Automated timesheet sync' },
      { label: 'International Invoicing', value: 'USD & EGP', change: 'Multi-currency dual ledger' }
    ],
    modulesUsed: ['Project Profitability Engine', 'Multi-Currency Invoicing', 'Time-Tracking Integration', 'Contract Retainer Billing'],
    partnerInvolved: {
      name: 'Sphinx Bookkeeping Pro',
      tier: 'Gold',
      city: 'Cairo, Egypt'
    },
    implementationTime: '10 Days',
    verifiedDate: 'November 2024',
    beforeState: 'Creative team worked 60-hour weeks without knowing whether projects were profitable until year-end tax preparation.',
    afterState: 'Real-time project ledger showing margin per client contract, billable hour burn rate, and automatic recurring retainer invoicing.',
    rating: 4.9,
    transcript: [
      { time: '0:00', speaker: 'Tariq El-Sayed', text: 'Creative agencies often love the work but dread the numbers. We were working non-stop, yet our bank account wasn’t growing.' },
      { time: '0:35', speaker: 'Tariq El-Sayed', text: 'MsmeBooks project accounting showed us that two of our biggest brand clients were consuming 60% of team hours for less than 15% revenue.' },
      { time: '1:15', speaker: 'Tariq El-Sayed', text: 'We restructured our contracts. Within three months, agency net profit margins shot up by twenty-two percent.' }
    ]
  },
  {
    id: 'spotlight-7',
    clientName: 'Jean-Paul Habimana',
    role: 'Principal Proprietor',
    companyName: 'Habimana Hardware & Construction Depot',
    industry: 'Retail & Supermarkets',
    location: 'Kigali, Rwanda',
    countryFlag: '🇷🇼',
    type: 'text',
    avatarUrl: 'https://images.unsplash.com/photo-1562788869-4ed32648eb72?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=900&auto=format&fit=crop&q=80',
    headline: 'Eliminated cement bag inventory leaks and automated RRA EBM tax compliance',
    quote: 'The Rwanda Revenue Authority requires strict electronic billing machine (EBM) data. MsmeBooks links our hardware checkout directly with RRA tax servers with zero lag.',
    fullStory: 'Habimana Depot supplies building contractors with cement, rebar, paints, and roofing sheets. Fast-moving heavy inventory was difficult to match against contractor credit lines. Implementation partner GreatLakes Financial Advisory automated contractor credit scoring and integrated direct RRA e-tax receipts.',
    metrics: [
      { label: 'Tax Compliance Rating', value: '100% Grade A', change: 'Automatic RRA EBM sync' },
      { label: 'Contractor Credit Recovery', value: '98.5%', change: 'Automated SMS ledger statements' },
      { label: 'Daily SKU Count', value: '3,200 Items', change: 'Real-time warehouse tally' }
    ],
    modulesUsed: ['Rwanda EBM API Sync', 'Contractor Credit Limits', 'Heavy Bulk Item Ledger', 'Multi-Warehouse Yard Tracking'],
    partnerInvolved: {
      name: 'GreatLakes Financial Advisory',
      tier: 'Silver Certified',
      city: 'Kigali, Rwanda'
    },
    implementationTime: '14 Days',
    verifiedDate: 'December 2024',
    beforeState: 'Contractors took building supplies on credit notes scribbled in pocket books, leading to disputed monthly statements.',
    afterState: 'Every contractor has a registered digital account with automated credit alerts, instant receipt SMS, and zero discrepancies.',
    rating: 4.8
  },
  {
    id: 'spotlight-8',
    clientName: 'Zainab Diallo',
    role: 'Founder & Head of Production',
    companyName: 'Diallo Modern Textiles & Apparel Wholesale',
    industry: 'Manufacturing & Agro',
    location: 'Dakar, Senegal',
    countryFlag: '🇸🇳',
    type: 'video',
    avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&auto=format&fit=crop&q=80',
    videoDuration: '2:05 min',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=900&auto=format&fit=crop&q=80',
    headline: 'Unified wholesale fabric orders across West Africa in CFA, Naira, and Euros',
    quote: 'Our Dakar textile workshop produces garments sold in Senegal, Ivory Coast, and France. MsmeBooks handles our multi-currency currency conversions and production batch costing without any headaches.',
    fullStory: 'Diallo Textiles manufactures contemporary African fashion for boutique retailers in West Africa and Europe. Fluctuating exchange rates and fabric dye waste made tracking true garment production cost nearly impossible. WestAfrican Cloud Accountants configured MsmeBooks multi-currency billing and production work-order cost centers.',
    metrics: [
      { label: 'Cross-Border Currencies', value: 'XOF, NGN, EUR', change: 'Automated daily FX rates' },
      { label: 'Production Costing', value: 'Accurate to $0.05', change: 'Standardized batch costing' },
      { label: 'Order Processing Time', value: 'Under 10 mins', change: 'Down from 2 days' }
    ],
    modulesUsed: ['Multi-Currency FX Ledger', 'Work-Order Batch Costing', 'Export Shipping Documentation', 'B2B Wholesale Portal'],
    partnerInvolved: {
      name: 'WestAfrican Cloud Accountants',
      tier: 'Gold',
      city: 'Dakar, Senegal'
    },
    implementationTime: '18 Days',
    verifiedDate: 'November 2024',
    beforeState: 'Calculating profits across French Euros, CFA Francs, and Nigerian Naira was done on complicated Excel spreadsheets prone to currency formulas breaking.',
    afterState: 'Consolidated financial reports in CFA with automatic currency revaluations; clear view of profit margin per export container.',
    rating: 5.0,
    transcript: [
      { time: '0:00', speaker: 'Zainab Diallo', text: 'When you are manufacturing in Dakar and selling to Paris and Abidjan, currency risk is real. One mistake in FX and your margin evaporates.' },
      { time: '0:40', speaker: 'Zainab Diallo', text: 'MsmeBooks made cross-border invoicing effortless. We quote in Euros or CFA, and our ledger balances seamlessly.' },
      { time: '1:25', speaker: 'Zainab Diallo', text: 'Our accountant set it up in less than three weeks, and it has allowed our production volume to double this year.' }
    ]
  }
];
