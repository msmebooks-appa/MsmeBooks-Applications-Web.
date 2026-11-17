import { IndustryUseCase } from '../types';

export const INDUSTRY_CATEGORIES = [
  { id: 'all', name: 'All Stories', key: 'all' },
  { id: 'accounting', name: 'Accounting & Bookkeeping', key: 'accounting' },
  { id: 'retail', name: 'Retail & Supermarkets', key: 'retail' },
  { id: 'restaurants', name: 'Restaurants & Food Services', key: 'restaurants' },
  { id: 'hotels', name: 'Hotels & Hospitality', key: 'hotels' },
  { id: 'wholesale', name: 'Wholesale & Distribution', key: 'wholesale' },
  { id: 'fashion', name: 'Fashion & Apparel', key: 'fashion' },
  { id: 'electronics', name: 'Electronics & Mobile Devices', key: 'electronics' },
  { id: 'pharmacies', name: 'Pharmacies & Healthcare', key: 'pharmacies' },
  { id: 'beauty', name: 'Beauty & Personal Care', key: 'beauty' },
  { id: 'manufacturing', name: 'Manufacturing & Production', key: 'manufacturing' },
  { id: 'logistics', name: 'Logistics & Transportation', key: 'logistics' },
  { id: 'professional', name: 'Professional Services', key: 'professional' },
  { id: 'education', name: 'Education & Training', key: 'education' },
  { id: 'realestate', name: 'Real Estate & Property Management', key: 'realestate' },
  { id: 'ecommerce', name: 'E-commerce & Omnichannel Retail', key: 'ecommerce' },
  { id: 'multibranch', name: 'Multi-branch Businesses', key: 'multibranch' },
];

export const INDUSTRY_USE_CASES: IndustryUseCase[] = [
  {
    id: 'retail',
    name: 'Retail & Supermarkets',
    slug: 'retail-supermarkets',
    shortDesc: 'Connect checkout lanes, inventory counts, supplier replenishment, and daily financial books in real time.',
    iconName: 'ShoppingCart',
    heroSummary: 'Transform multi-counter checkout operations into unified retail networks with real-time stock sync and automated accounting.',
    commonChallenges: [
      'Cash register discrepancy at end of shifts requiring tedious physical counting.',
      'Stockouts of fast-moving consumer goods while slow-moving items accumulate dust.',
      'Disconnected bookkeeping creating delays in calculating true gross profit margins.',
      'Difficulty managing multi-lane POS checkout speeds during peak evening rush hours.'
    ],
    msmeModules: [
      { name: 'POS Checkout', description: 'Fast barcoded till operation, multiple tender types (cash, card, mobile transfer), and cashier shift balancing.', highlight: 'Sub-second barcode scan processing' },
      { name: 'Inventory & Reorder', description: 'Centralized SKU master, automated minimum safety reorder alerts, and supplier purchase orders.', highlight: 'Automated reorder triggers' },
      { name: 'General Ledger Accounting', description: 'Automated posting of daily register sales, cost of goods sold, and tax liabilities.', highlight: 'Zero manual journal entries' },
      { name: 'Multi-Till Reporting', description: 'Monitor revenue per lane, average basket size, and high-velocity SKUs across all stores.', highlight: 'Real-time retail metrics' }
    ],
    dailyWorkflows: [
      { time: '08:00 AM', step: 'Register Float Opening', description: 'Cashier signs in with PIN, records opening float, and verifies barcode scanner connectivity.' },
      { time: '12:30 PM', step: 'Supplier Goods Intake', description: 'Storekeeper scans supplier delivery invoice against approved purchase order and prints shelf labels.' },
      { time: '05:30 PM', step: 'Peak Rush Service', description: 'Multi-till checkout processing split payments and digital customer receipts with zero latency.' },
      { time: '09:00 PM', step: 'Shift Close & Cash Drop', description: 'Blind cash drop reconciliation; system generates daily sales summary and posts journal entries to ledger.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Fast-Moving Weekend Stockout Prevention',
        situation: 'A supermarket frequently ran out of popular cooking oils and dairy during Saturday rush hours.',
        msmeAction: 'Set automated reorder thresholds in MsmeBooks Inventory that generate supplier purchase orders when shelf stock dips below 3 days of sales.',
        impact: 'Maintained 99% shelf availability on essential pantry staples without over-ordering.'
      },
      {
        scenarioTitle: 'Multi-lane Cashier Reconciliation',
        situation: 'Three checkout lanes experienced regular cash discrepancies and disputes at closing.',
        msmeAction: 'Enforced role-based cashier PINs with automated blind cash drops and per-lane settlement reports.',
        impact: 'Cut shift balancing time from 75 minutes to under 15 minutes per register.'
      }
    ],
    expectedBenefits: [
      'Immediate visibility into top-selling products and gross margin performance.',
      'Elimination of manual transcription between retail tills and accounting books.',
      'Auditable cashier accountability and reduced checkout shrinkage.',
      'Streamlined supplier restocking cycles based on actual sell-through data.'
    ],
    relevantStorySlug: 'retail-supermarkets-sales-inventory-accounting'
  },
  {
    id: 'restaurants',
    name: 'Restaurants & Food Services',
    slug: 'restaurants-food-services',
    shortDesc: 'Connect table service, kitchen ordering, recipe cost tracking, and daily cash reconciliations.',
    iconName: 'UtensilsCrossed',
    heroSummary: 'Bridge dining room order taking, kitchen display routing, perishable inventory control, and hospitality accounting.',
    commonChallenges: [
      'High kitchen waste and unaccounted food ingredient shrinkage.',
      'Slow order transmission between floor servers and kitchen line cooks during rush hours.',
      'Difficulty calculating exact plate cost on specialty dishes with fluctuating market ingredient prices.',
      'Manual reconciliation across multiple payment channels (cash, cards, mobile money).'
    ],
    msmeModules: [
      { name: 'Restaurant POS', description: 'Visual floor plan, table management, split checks, course firing, and kitchen printer routing.', highlight: 'Visual table layouts' },
      { name: 'Recipe & Ingredient Yields', description: 'Deconstruct menu items into raw meats, spices, and produce with automatic inventory decrements.', highlight: 'Portion-level stock control' },
      { name: 'Supplier Requisition', description: 'Track fresh produce market purchases and supplier invoices with price variance alerts.', highlight: 'Market price tracking' },
      { name: 'Food Cost Accounting', description: 'Live tracking of food and beverage cost percentage against total restaurant turnover.', highlight: 'Daily food margin visibility' }
    ],
    dailyWorkflows: [
      { time: '07:30 AM', step: 'Morning Pantry Check', description: 'Head chef enters delivered meats and vegetables into MsmeBooks Inventory store.' },
      { time: '01:00 PM', step: 'Lunch Rush Table Turn', description: 'Servers take orders on mobile POS, routing tickets straight to kitchen cook stations.' },
      { time: '07:00 PM', step: 'Dinner Service Bill Splits', description: 'Waiters split bills between corporate cards and mobile money effortlessly at guest tables.' },
      { time: '11:00 PM', step: 'Nightly Recipe Reconciliation', description: 'System compares dishes sold against ingredient consumption to detect variance.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Eliminating Kitchen Order Miscommunication',
        situation: 'Handwritten order tickets led to duplicate cooking, missed allergy notes, and slow table service.',
        msmeAction: 'Deployed touch-screen POS terminals that instantly route categorized food orders to kitchen printers with customer dietary modifiers.',
        impact: 'Reduced kitchen wait times by 35% and completely eliminated lost order dockets.'
      }
    ],
    expectedBenefits: [
      'Lower food waste and proactive tracking of high-value proteins and beverages.',
      'Faster table turnarounds and enhanced guest dining experience.',
      'Accurate daily food cost percentage calculations to maintain healthy restaurant margins.',
      'Unified multi-tender payment reconciliation with zero closing discrepancies.'
    ],
    relevantStorySlug: 'restaurants-food-connecting-sales-financial-reporting'
  },
  {
    id: 'hotels',
    name: 'Hotels & Hospitality',
    slug: 'hotels-hospitality',
    shortDesc: 'Consolidate front desk room revenue, food and beverage outlets, housekeeping supplies, and vendor payables.',
    iconName: 'Hotel',
    heroSummary: 'Provide executive leadership with complete departmental financial visibility across rooms, dining, conferences, and amenities.',
    commonChallenges: [
      'Disjointed billing between guest room stays, dining room tabs, and poolside bar charges.',
      'Lax tracking of housekeeping linens, guest amenities, and cleaning consumables.',
      'Lengthy monthly financial closing cycles due to manual cross-referencing between hotel PMS and books.',
      'Delayed corporate conference invoicing and overdue receivables from tour operators.'
    ],
    msmeModules: [
      { name: 'Hospitality Accounting', description: 'Departmental P&L separating Rooms, F&B, Banqueting, and Administrative overhead.', highlight: 'Departmental RevPAR metrics' },
      { name: 'PMS / POS Synchronization', description: 'Route restaurant and bar tabs directly onto guest room folios for unified checkout.', highlight: 'Zero unbilled guest extras' },
      { name: 'Housekeeping Stores', description: 'Requisition controls and par levels for linen, guest toiletries, and room supplies.', highlight: '100% digital supply tracking' },
      { name: 'Corporate Billing & AR', description: 'Automated invoice generation for conference organizers with credit terms and aging schedules.', highlight: 'Streamlined B2B collections' }
    ],
    dailyWorkflows: [
      { time: '06:00 AM', step: 'Night Audit Completion', description: 'Automated night audit verifies room revenues and post daily charges to general ledger.' },
      { time: '11:00 AM', step: 'Checkout & Folio Settlement', description: 'Front desk presents consolidated folio itemizing accommodation and dining for single payment.' },
      { time: '02:00 PM', step: 'Stores Requisition Approval', description: 'Executive housekeeper requests replacement linen and toiletries via digital requisition.' },
      { time: '06:00 PM', step: 'Corporate Conference Invoice', description: 'Issue commercial invoice for 3-day workshop with agreed credit terms.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Departmental Profitability Tracking',
        situation: 'A 45-room hotel did not know whether its restaurant was making money or being subsidized by room revenue.',
        msmeAction: 'Implemented MsmeBooks Departmental Accounting with discrete cost centers for Rooms, Food & Beverage, and Banqueting.',
        impact: 'Discovered banqueting had 60% gross margin while bar pricing needed adjustment, driving an immediate 14% bottom-line boost.'
      }
    ],
    expectedBenefits: [
      'Audited departmental profit and loss statements available within 3 days of month-end.',
      'Frictionless guest checkout with consolidated billing across all hotel facilities.',
      'Tighter oversight of high-value hotel consumables and elimination of emergency stock runs.',
      'Accelerated corporate receivable collections through automated aging alerts.'
    ],
    relevantStorySlug: 'hotels-hospitality-improving-financial-visibility'
  },
  {
    id: 'wholesale',
    name: 'Wholesale & Distribution',
    slug: 'wholesale-distribution',
    shortDesc: 'Orchestrate bulk container receipts, inter-depot stock transfers, wholesale credit terms, and sales dispatch.',
    iconName: 'PackageCheck',
    heroSummary: 'Connect multi-warehouse depots, field sales reps, picking waybills, and landed cost accounting into a synchronized supply chain.',
    commonChallenges: [
      'Blind spots regarding available-to-promise inventory across multiple regional warehouses.',
      'Field sales agents selling goods that are already allocated or out of stock.',
      'Uncontrolled customer credit limits resulting in severe bad debt and stalled cash flow.',
      'Inaccurate landed cost calculation on imported shipping containers.'
    ],
    msmeModules: [
      { name: 'Multi-Warehouse Inventory', description: 'Live stock quantities per warehouse depot, bin locations, and in-transit transfer status.', highlight: 'Real-time multi-depot stock' },
      { name: 'Landed Cost Calculator', description: 'Apportion port customs fees, clearing costs, and freight shipping across product batches.', highlight: 'Accurate imported margins' },
      { name: 'Wholesale Sales Orders', description: 'Convert quotes into formal sales orders, generate picking waybills, and issue delivery tax invoices.', highlight: 'Seamless 3-step dispatch' },
      { name: 'Credit Control Engine', description: 'Enforce credit limits, automated overdue reminders, and 30/60/90 day customer aging reports.', highlight: 'Strict receivable governance' }
    ],
    dailyWorkflows: [
      { time: '08:00 AM', step: 'Container Intake & Inspection', description: 'Log arrived container goods against purchase order and apportion clearing charges.' },
      { time: '11:00 AM', step: 'Inter-Depot Stock Transfer', description: 'Approve transfer waybill to move 500 cartons from central hub to regional depot.' },
      { time: '02:00 PM', step: 'Wholesale Order Dispatch', description: 'Picking list printed for warehouse staff; tax invoice auto-generated upon driver sign-off.' },
      { time: '05:00 PM', step: 'Receivables Review', description: 'Automated credit review holds new orders for accounts exceeding 60-day credit window.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Accurate Landed Cost on Imported Goods',
        situation: 'A wholesale distributor of construction supplies incurred fluctuating clearing charges, leading to mispriced goods.',
        msmeAction: 'Utilized MsmeBooks Landed Cost feature to evenly distribute clearing and transportation overhead per imported SKU unit.',
        impact: 'Protected target 22% gross profit margins across 150 imported product lines.'
      }
    ],
    expectedBenefits: [
      'Total visibility of stock across all physical depots without phone calls or paper sheets.',
      'Reduced order-to-dispatch turnaround time from 24 hours to under 2 hours.',
      'Disciplined customer credit management and reduced bad debt risk.',
      'Precise profit calculations based on true landed purchase cost.'
    ],
    relevantStorySlug: 'wholesale-distribution-managing-stock-multiple-warehouses'
  },
  {
    id: 'accounting',
    name: 'Accounting & Bookkeeping Services',
    slug: 'accounting-bookkeeping',
    shortDesc: 'Standardize chart of accounts, multi-client switching, automated bank rules, and month-end financial packs.',
    iconName: 'FileSpreadsheet',
    heroSummary: 'Empower accounting firms to manage dozens of MSME client accounts from a single workspace with automated review workflows.',
    commonChallenges: [
      'Disorganized client receipts, handwritten paper registers, and late-night tax scrambles.',
      'Spending 70% of billable staff time on repetitive data entry instead of strategic advisory.',
      'Lack of clear audit trails when junior associates adjust historical client accounts.',
      'Expensive multiple software subscriptions with cumbersome account switching.'
    ],
    msmeModules: [
      { name: 'Multi-Client Practice Console', description: 'Switch between client business entities with granular staff permissions and security.', highlight: 'Single login client portfolio' },
      { name: 'Bank Classification Rules', description: 'Automated rules categorize recurring bank deposits, payments, and statutory payroll debits.', highlight: '70% less data entry' },
      { name: 'Period Locking & Audit Trail', description: 'Lock reconciled months post-tax filing and review immutable user edit logs.', highlight: 'Tax compliance protection' },
      { name: 'Financial Pack Generator', description: 'One-click branded Balance Sheets, P&L, Cash Flow, and trial balances with practice cover notes.', highlight: 'Client-ready reports in seconds' }
    ],
    dailyWorkflows: [
      { time: '09:00 AM', step: 'Client Dashboard Review', description: 'Senior partner checks bank reconciliation progress across all 40 client accounts.' },
      { time: '11:00 AM', step: 'Bank Rule Reconciliation', description: 'Associate matches downloaded bank feeds using pre-configured classification rules.' },
      { time: '03:00 PM', step: 'Monthly Period Lock', description: 'Review reconciled VAT return, lock the month-end period, and export statutory schedules.' },
      { time: '05:00 PM', step: 'Client Management Pack Delivery', description: 'Generate branded financial statement pack and email to business owner.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Scaling Client Capacity Without Headcount',
        situation: 'An accounting practice of 5 associates was overwhelmed and unable to accept new client retainers.',
        msmeAction: 'Standardized chart of accounts templates and automated recurring bank rules across all clients in MsmeBooks.',
        impact: 'Increased client capacity per associate from 5 to 12 businesses while improving report delivery speed.'
      }
    ],
    expectedBenefits: [
      'Month-end client closing completed 70% faster with automated financial packs.',
      'Strict period locking preventing backdated client errors during statutory audits.',
      'Significant cost savings by consolidating client management into a unified practice hub.',
      'Transition from low-margin data entry to high-value strategic financial advisory.'
    ],
    relevantStorySlug: 'accounting-bookkeeping-helping-accountants-manage-client-books'
  },
  {
    id: 'fashion',
    name: 'Fashion & Apparel',
    slug: 'fashion-apparel',
    shortDesc: 'Manage multi-attribute matrix inventory (Size/Color/Fabric), boutique POS, and online order fulfillment.',
    iconName: 'Shirt',
    heroSummary: 'Harmonize showroom boutique registers, e-commerce drops, garment variant matrices, and tailoring material costs.',
    commonChallenges: [
      'Managing complex permutations of sizes, colors, and cuts on basic stock cards.',
      'Selling out of items in physical boutiques while online shoppers order the same item.',
      'Difficulties calculating true garment manufacturing costs factoring fabrics, trims, and labor.',
      'Messy manual discount handling during seasonal collection markdown sales.'
    ],
    msmeModules: [
      { name: 'Variant Matrix Inventory', description: 'Parent-child item templates managing sizes, colors, fabrics, and custom barcode hangtags.', highlight: 'Multi-attribute matrix' },
      { name: 'Showroom Boutique POS', description: 'Fast barcode scanning, customer styling notes, store credit, and exchange handling.', highlight: 'Luxury checkout flow' },
      { name: 'Omnichannel Web Sync', description: 'Real-time stock reservation updates online store catalogs the instant a boutique purchase occurs.', highlight: 'Zero overselling errors' },
      { name: 'Atelier Manufacturing Cost', description: 'Track bolts of fabric, zippers, buttons, and tailoring labor per garment style.', highlight: 'Exact unit garment cost' }
    ],
    dailyWorkflows: [
      { time: '09:30 AM', step: 'Hangtag Label Printing', description: 'Print barcode hangtags for new ready-to-wear seasonal drop arrivals.' },
      { time: '01:00 PM', step: 'Boutique Client Styling', description: 'Scan items, apply loyalty club discount, and record customer size profile.' },
      { time: '04:00 PM', step: 'Web Order Fulfillment', description: 'Pick and pack online orders with automated reserve debit from central showroom stock.' },
      { time: '07:00 PM', step: 'Collection Sell-Through Review', description: 'Review sell-through rates by size and colorway to inform next production run.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Eliminating Garment Variant Confusion',
        situation: 'A boutique holding 40 styles in 12 size/color variants suffered constant stock inaccuracies and misplaced garments.',
        msmeAction: 'Organized parent-child product matrices with unique barcode hangtags scanned at production and sale.',
        impact: 'Cut stocktaking time from 2 full days to 4 hours with 99.8% inventory accuracy.'
      }
    ],
    expectedBenefits: [
      'Accurate stock numbers across every single size and color variant in real time.',
      'Protection against overselling between physical boutiques and e-commerce stores.',
      'Clear gross profit visibility per fashion collection drop.',
      'Accelerated seasonal stocktakes using fast mobile barcode scanning.'
    ],
    relevantStorySlug: 'fashion-apparel-keeping-product-variants-and-sales-in-sync'
  },
  {
    id: 'electronics',
    name: 'Electronics & Mobile Devices',
    slug: 'electronics-mobile-devices',
    shortDesc: 'Track unique device serial numbers, warranty status, accessories, and repair service revenues.',
    iconName: 'Smartphone',
    heroSummary: 'Protect high-value electronic assets with strict serial/IMEI tracking, automated warranty records, and repair job ticketing.',
    commonChallenges: [
      'Inability to verify whether a customer warranty claim matches a genuine store purchase.',
      'High risk of shrinkage on high-value smartphones, laptops, and audio gadgets.',
      'Rapid depreciation and obsolescence of older tech models lingering unnoticed in inventory.',
      'Untracked repair service parts and uncoordinated technician commission calculations.'
    ],
    msmeModules: [
      { name: 'Serial & IMEI Tracking', description: 'Capture mandatory serial numbers at receipt, transfer, and checkout for foolproof traceability.', highlight: '100% item provenance' },
      { name: 'Warranty Management', description: 'Auto-generate warranty certificates on receipts with instant serial search at service counters.', highlight: 'Instant warranty verification' },
      { name: 'Repair Job Ticketing', description: 'Track customer devices through diagnostics, spare parts allocation, and technician labor fees.', highlight: 'Service revenue optimization' },
      { name: 'FIFO Stock Valuation', description: 'Prevent margin erosion from tech depreciation with precise first-in-first-out cost tracking.', highlight: 'Margin protection' }
    ],
    dailyWorkflows: [
      { time: '09:00 AM', step: 'Supplier Device Ingestion', description: 'Scan manufacturer barcode and IMEI serial numbers into secure vault inventory.' },
      { time: '12:00 PM', step: 'Showroom Smartphone Sale', description: 'Scan product barcode and individual IMEI, printing warranty terms on sales receipt.' },
      { time: '03:00 PM', step: 'Repair Intake & Job Card', description: 'Log cracked screen repair, reserve replacement glass in inventory, and assign technician.' },
      { time: '06:00 PM', step: 'Staff Commission Audit', description: 'Review sales volume and computed commissions by sales associate.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Ending Fraudulent Warranty Claims',
        situation: 'Customers regularly brought second-hand devices bought from competitors claiming store warranty.',
        msmeAction: 'Enforced mandatory IMEI capture on MsmeBooks checkout receipts with instant serial query at tech counters.',
        impact: 'Saved thousands in false warranty replacements while validating genuine customer claims in seconds.'
      }
    ],
    expectedBenefits: [
      'Complete serial number audit trail from wholesaler intake to customer receipt.',
      'Zero dispute warranty lookups completed in under 30 seconds.',
      'Profitable technical repair department with tracked spare parts consumption.',
      'Automated sales rep commission calculations at monthly payroll.'
    ],
    relevantStorySlug: 'electronics-mobile-devices-stock-sales-control'
  },
  {
    id: 'pharmacies',
    name: 'Pharmacies & Healthcare',
    slug: 'pharmacies-healthcare',
    shortDesc: 'Maintain strict medication batch numbers, expiry alerts, regulated dispensary records, and supplier orders.',
    iconName: 'Pill',
    heroSummary: 'Deliver patient safety and pharmacy profitability with First-Expired-First-Out dispensing, automated batch alerts, and compliance logs.',
    commonChallenges: [
      'Costly drug expirations occurring unnoticed on back shelves.',
      'Long customer counter queues while dispensary staff search for brand vs generic equivalents.',
      'Difficulty providing compliant audit logs for regulated controlled medications.',
      'Disorganized pharmaceutical wholesaler accounts resulting in uncoordinated reorders.'
    ],
    msmeModules: [
      { name: 'Dispensary POS', description: 'Fast search by generic or commercial name, dosage strength, and prescription attachment.', highlight: 'Sub-minute dispensary lookup' },
      { name: 'FEFO Batch & Expiry Alerts', description: 'Automated warnings at 90/60/30 days to expiry; priority dispensing of earliest valid batch.', highlight: 'Zero expired drug write-offs' },
      { name: 'Wholesaler Procurement', description: 'Order from certified pharmaceutical distributors with delivery batch code verification.', highlight: 'Certified medicine integrity' },
      { name: 'Controlled Drug Registers', description: 'Regulatory inspection-ready audit logs of prescription intake and dispense history.', highlight: 'Statutory compliance ready' }
    ],
    dailyWorkflows: [
      { time: '08:30 AM', step: 'Morning Expiry Audit', description: 'Review daily alert for items entering 60-day expiry window for prioritized dispensing.' },
      { time: '11:30 AM', step: 'Prescription Dispense', description: 'Pharmacist enters prescription, verifies generic equivalent, and confirms batch number.' },
      { time: '03:30 PM', step: 'Wholesaler Order Restock', description: 'Receive medication order, verify manufacturer batch lot numbers and expiration dates.' },
      { time: '07:30 PM', step: 'Dispensary Till Close', description: 'Balance shift sales, separate OTC retail from prescription revenue, and lock logs.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Eliminating Expired Medicine Losses',
        situation: 'A community pharmacy wrote off thousands monthly in expired antibiotics and specialty syrups.',
        msmeAction: 'Implemented MsmeBooks FEFO (First-Expired-First-Out) queue and automated 60-day expiry notifications.',
        impact: 'Virtually eradicated expired medicine discards and saved substantial monthly inventory write-offs.'
      }
    ],
    expectedBenefits: [
      'Elimination of costly expired medication inventory write-offs.',
      'Fast, reliable prescription dispensing with generic equivalent suggestions.',
      'Full compliance with regional pharmacy regulatory board inspection requirements.',
      'Clear gross profit margin visibility across therapeutic drug categories.'
    ],
    relevantStorySlug: 'pharmacies-healthcare-connecting-sales-purchasing-inventory'
  },
  {
    id: 'beauty',
    name: 'Beauty & Personal Care',
    slug: 'beauty-personal-care',
    shortDesc: 'Harmonize cosmetics retail counters, salon service bookings, stylist commissions, and beauty supplies.',
    iconName: 'Sparkles',
    heroSummary: 'Combine salon service treatments, retail cosmetic checkout, stylist commission calculations, and backbar product control.',
    commonChallenges: [
      'Stylists using retail products on clients without deducting from stock records.',
      'Tedious manual calculations of stylist service commissions and retail sales bonuses.',
      'High-end fragrance and cosmetic sample leakage at checkout counters.',
      'Fragmented customer billing when clients combine treatments with retail purchases.'
    ],
    msmeModules: [
      { name: 'Beauty Studio POS', description: 'Combined billing for salon treatments and retail cosmetics with multiple payment options.', highlight: 'Unified service & product bill' },
      { name: 'Backbar vs Retail Stock', description: 'Strict separation of retail-packaged items from professional backbar consumables.', highlight: 'Treatment cost tracking' },
      { name: 'Stylist Commission Engine', description: 'Automated percentage calculations for service labor and retail sales by staff member.', highlight: 'Zero commission disputes' },
      { name: 'Client Profile History', description: 'Track client color formulas, past service dates, and preferred cosmetic brands.', highlight: 'Personalized salon care' }
    ],
    dailyWorkflows: [
      { time: '09:00 AM', step: 'Backbar Dispense Requisition', description: 'Salon supervisor issues professional developers and treatment creams to stylist stations.' },
      { time: '01:30 PM', step: 'Service & Product Checkout', description: 'Client pays single bill for balayage service, haircut, and home-care shampoo.' },
      { time: '05:00 PM', step: 'Cosmetic Shelf Restock', description: 'Scan retail skincare replenishment from back storeroom to showroom display.' },
      { time: '07:30 PM', step: 'Daily Stylist Commission Review', description: 'Staff check daily commission totals on mobile portal, driving positive motivation.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Streamlining Combined Service and Product Billing',
        situation: 'Clients faced separate paper bills for hair services and front-desk cosmetics purchases.',
        msmeAction: 'Deployed MsmeBooks Beauty POS with unified client tickets combining stylist services and retail items.',
        impact: 'Boosted retail cosmetics sales by 25% and cut checkout line wait times in half.'
      }
    ],
    expectedBenefits: [
      'Clear separation of professional salon backbar supplies from retail cosmetics stock.',
      'Elimination of end-of-week commission calculation arguments with creative staff.',
      'Faster client checkout experience that supports repeat salon bookings.',
      'Accurate cost tracking for complex salon chemical and aesthetic services.'
    ],
    relevantStorySlug: 'beauty-personal-care-simplifying-sales-stock-management'
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Production',
    slug: 'manufacturing-production',
    shortDesc: 'Track raw materials, Bills of Materials (BOM), production batches, machine overhead, and finished goods.',
    iconName: 'Factory',
    heroSummary: 'Streamline assembly lines, raw material staging, bill of materials assembly, and finished goods costing.',
    commonChallenges: [
      'Uncertainty regarding exact production costs per unit due to fluctuating raw material prices.',
      'Production halts caused by missing minor components in multi-part manufacturing.',
      'Lack of batch traceability when customers report quality assurance inquiries.',
      'Manual conversion between bulk raw materials (tonnes, litres) and finished packaged units.'
    ],
    msmeModules: [
      { name: 'Bill of Materials (BOM)', description: 'Multi-level recipe defining exact quantities of raw ingredients, packaging, and labor.', highlight: 'Precise unit production cost' },
      { name: 'Work Orders & Assembly', description: 'Issue production work orders that debit raw inventory and credit finished goods stores.', highlight: 'Controlled shop floor flow' },
      { name: 'Batch Quality Traceability', description: 'Assign production batch codes linking raw material lot deliveries to finished output.', highlight: 'Full QA audit readiness' },
      { name: 'Manufacturing Accounting', description: 'Track Work-in-Progress (WIP), labor overhead, equipment depreciation, and finished goods valuation.', highlight: 'Accurate gross margins' }
    ],
    dailyWorkflows: [
      { time: '07:00 AM', step: 'Raw Material Staging', description: 'Warehouse releases raw chemicals and packaging materials against production work order.' },
      { time: '11:00 AM', step: 'Production Batch Run', description: 'Production supervisor confirms assembly batch completion on factory terminal.' },
      { time: '03:00 PM', step: 'Quality Check & Finished Goods Receipt', description: 'Inspect finished goods, assign batch code, and transfer into central distribution depot.' },
      { time: '05:30 PM', step: 'Production Costing Audit', description: 'Review actual raw material consumption variance against standard Bill of Materials.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Raw Material Consumption Variance Control',
        situation: 'A beverage packaging plant experienced regular packaging film waste that eroded net margins.',
        msmeAction: 'Implemented MsmeBooks Bill of Materials with automated variance tracking between standard recipe and actual usage.',
        impact: 'Identified machine calibration defects and reduced material scrap by 18% in the first month.'
      }
    ],
    expectedBenefits: [
      'Precision costing on every manufactured unit factoring materials, labor, and machine overhead.',
      'Elimination of assembly line shutdowns through automated raw component reorder triggers.',
      'End-to-end traceability from raw supplier lot to finished customer delivery.',
      'Real-time valuation of Work-in-Progress (WIP) and finished goods inventory.'
    ]
  },
  {
    id: 'logistics',
    name: 'Logistics & Transportation',
    slug: 'logistics-transportation',
    shortDesc: 'Track fleet operational expenses, trip-level profitability, freight invoicing, and supplier payables.',
    iconName: 'Truck',
    heroSummary: 'Turn commercial vehicle fleets into profitable cost centers with digital trip expenses, quick invoicing, and maintenance records.',
    commonChallenges: [
      'Fuel disbursements and roadside repairs logged on easily lost paper receipts.',
      'Protracted delays in invoicing corporate shippers while waiting for paper Proof-of-Delivery.',
      'Inability to identify which specific vehicles are operating at a profit versus loss.',
      'Unauthorized spare parts purchases and high workshop maintenance costs.'
    ],
    msmeModules: [
      { name: 'Vehicle Cost Centers', description: 'Assign fuel, maintenance, tolls, and driver allowances directly to vehicle registration numbers.', highlight: 'Truck-by-truck P&L' },
      { name: 'Freight Invoicing & POD', description: 'Issue commercial multi-currency invoices with attached digital proof-of-delivery documents.', highlight: 'Same-day billing delivery' },
      { name: 'Workshop Parts Store', description: 'Track tyres, lubricants, and spares with mandatory assignment to mechanic job cards.', highlight: 'Zero parts leakage' },
      { name: 'Haulage Performance Reports', description: 'Analyze cost per kilometer, fuel efficiency, and route profitability across fleet assets.', highlight: 'Route optimization metrics' }
    ],
    dailyWorkflows: [
      { time: '07:30 AM', step: 'Trip Fuel & Cash Advance', description: 'Dispatcher logs trip fuel card allowance against vehicle registration and route manifest.' },
      { time: '01:00 PM', step: 'Workshop Service Job Card', description: 'Mechanic issues new brake pads and oil filters against verified workshop service order.' },
      { time: '04:30 PM', step: 'POD Upload & Invoicing', description: 'Driver uploads signed delivery slip; billing clerk immediately issues commercial invoice.' },
      { time: '06:00 PM', step: 'Corridor Route Profit Review', description: 'Review net profit margin per completed transport corridor.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Vehicle-Specific Profitability Auditing',
        situation: 'A transport operator with 18 trucks had growing revenue but stagnant net profits due to unmonitored repair costs.',
        msmeAction: 'Registered each vehicle as a distinct accounting cost center in MsmeBooks.',
        impact: 'Discovered 3 older vehicles consumed 40% of fleet maintenance budget, prompting strategic asset retirement.'
      }
    ],
    expectedBenefits: [
      'Same-day digital freight invoicing accelerating cash collection turnaround.',
      'Crystal-clear visibility into operating profit per individual commercial truck.',
      'Elimination of fuel theft and unrecorded workshop parts replacements.',
      'Data-backed contract pricing based on verified cost-per-kilometer metrics.'
    ],
    relevantStorySlug: 'logistics-transportation-organising-expenses-financial-reporting'
  },
  {
    id: 'professional',
    name: 'Professional Services',
    slug: 'professional-services',
    shortDesc: 'Manage billable hours, milestone retainer billing, project expense tracking, and client profitability.',
    iconName: 'Briefcase',
    heroSummary: 'Equip consulting firms, legal practices, engineering consultancies, and marketing agencies with robust project accounting.',
    commonChallenges: [
      'Scope creep and unbilled team hours on fixed-price client retainers.',
      'Disorganized disbursement expense tracking for client-related travel and statutory fees.',
      'Delayed milestone invoicing creating cash flow dips between major project deliveries.',
      'Difficulty assessing the actual profitability of specific clients and engagements.'
    ],
    msmeModules: [
      { name: 'Project Costing & Timesheets', description: 'Track staff hours and direct disbursements against client project budgets.', highlight: 'Live project margin tracking' },
      { name: 'Retainer & Milestone Billing', description: 'Automate recurring monthly retainers and staged milestone progress invoices.', highlight: 'Automated recurring billing' },
      { name: 'Client Expense Disbursements', description: 'Recharge client-related travel, filing fees, and sub-consultant costs seamlessly.', highlight: '100% cost recovery' },
      { name: 'Practice Financial Reports', description: 'Analyze revenue realization rates, staff utilization, and client lifetime profit.', highlight: 'Consulting utilization rates' }
    ],
    dailyWorkflows: [
      { time: '09:00 AM', step: 'Project Budget Review', description: 'Project manager reviews team billable burn rate against milestone deliverables.' },
      { time: '12:00 PM', step: 'Client Expense Logging', description: 'Consultant uploads receipt for project travel and tags to client billing account.' },
      { time: '03:00 PM', step: 'Milestone Progress Invoice', description: 'Client signs off phase 2 deliverable; system generates branded commercial invoice.' },
      { time: '05:30 PM', step: 'Weekly Timesheet Audit', description: 'Team submits hours for project manager sign-off and payroll allocation.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Recovering Client Disbursements',
        situation: 'A design and engineering consultancy regularly forgot to bill clients for external permit fees and blueprints.',
        msmeAction: 'Enforced MsmeBooks project expense tagging that automatically pulls billable disbursements onto client invoices.',
        impact: 'Recovered over 15% in previously leaked out-of-pocket project expenses.'
      }
    ],
    expectedBenefits: [
      'Protection against project budget overruns through live cost monitoring.',
      'Immediate recovery of 100% of billable client out-of-pocket disbursements.',
      'Predictable recurring cash flow with automated monthly retainer invoicing.',
      'Clear visibility into your most and least profitable practice client engagements.'
    ]
  },
  {
    id: 'education',
    name: 'Education & Training',
    slug: 'education-training',
    shortDesc: 'Track student tuition schedules, fee receipts, departmental budgets, and campus supplies.',
    iconName: 'GraduationCap',
    heroSummary: 'Simplify school bursar operations with student fee invoicing, automated payment receipts, and institutional budget controls.',
    commonChallenges: [
      'Long queues of parents at bursar offices during term opening weeks.',
      'Difficulties tracking outstanding tuition balances and generating fee reminder statements.',
      'Managing diverse revenue streams: tuition, uniforms, bus transport, cafeteria, and books.',
      'Lax oversight of departmental spending across science labs, sports, and library supplies.'
    ],
    msmeModules: [
      { name: 'Student Tuition Accounts', description: 'Individual student fee accounts with automated invoice generation per academic term.', highlight: 'Automated student fee ledgers' },
      { name: 'Multi-Tender Bursary POS', description: 'Instant receipt generation for bank transfers, cards, and mobile payments at school office.', highlight: 'Frictionless tuition payment' },
      { name: 'School Store Inventory', description: 'Track textbooks, student uniforms, and laboratory supplies with automated reorder levels.', highlight: 'Uniform & bookstore control' },
      { name: 'Institutional Budgeting', description: 'Departmental budget limits for academic faculties, facility maintenance, and boarding expenses.', highlight: 'Strict institutional governance' }
    ],
    dailyWorkflows: [
      { time: '08:00 AM', step: 'Term Tuition Fee Intake', description: 'Bursar records verified bank tuition payment against student registration number.' },
      { time: '10:30 AM', step: 'Uniform & Book Dispense', description: 'School bookstore scans uniform items debited against student fee bundle.' },
      { time: '02:00 PM', step: 'Term Fee Statement Dispatch', description: 'Automated digital outstanding fee statements sent to parent guardian contacts.' },
      { time: '04:30 PM', step: 'Departmental Expense Sign-off', description: 'Approve sports department equipment invoice against approved term budget.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Automated Outstanding Tuition Reminders',
        situation: 'A private secondary school struggled with manual phone calls to recover late term school fees.',
        msmeAction: 'Implemented MsmeBooks automated student ledger statements with secure digital payment links.',
        impact: 'Accelerated term fee collection by 4 weeks and eliminated administrative friction with parents.'
      }
    ],
    expectedBenefits: [
      'Elimination of bursar counter congestion with streamlined digital receipts.',
      'Instant visibility into term tuition collection rates and outstanding student balances.',
      'Complete inventory control over school uniforms, stationery, and cafeteria goods.',
      'Enforced departmental budget ceilings preventing institutional overspending.'
    ]
  },
  {
    id: 'realestate',
    name: 'Real Estate & Property Management',
    slug: 'real-estate-property',
    shortDesc: 'Manage tenant lease billing, service charge reconciliation, maintenance expenses, and landlord statements.',
    iconName: 'Building',
    heroSummary: 'Coordinate tenant rent collection, utility service charges, facility repair vendor bills, and property owner distributions.',
    commonChallenges: [
      'Tracking rent renewals, late payment penalties, and security deposits across properties.',
      'Reconciling shared service charges (generator diesel, security, cleaning) among tenants.',
      'Managing ongoing facility maintenance contractors and plumbing/electrical repairs.',
      'Generating clear, professional monthly financial disbursement statements for property landlords.'
    ],
    msmeModules: [
      { name: 'Lease & Rent Invoicing', description: 'Automated recurring rent invoices, utility service charge allocations, and arrears tracking.', highlight: 'Automated recurring lease billing' },
      { name: 'Service Charge Accounting', description: 'Pool shared building expenses (power, security, waste) and apportion across leased tenant units.', highlight: 'Transparent service charges' },
      { name: 'Facility Contractor Bills', description: 'Track property maintenance work orders, contractor quotes, and repair invoice approvals.', highlight: 'Maintenance cost control' },
      { name: 'Landlord Statement Generator', description: 'Produce monthly statements of gross rent collected, deductions, management fees, and net yield.', highlight: 'Audit-ready landlord reports' }
    ],
    dailyWorkflows: [
      { time: '09:00 AM', step: 'Rent Arrears Review', description: 'Property manager reviews automated tenant aging schedule and sends renewal notices.' },
      { time: '11:30 AM', step: 'Service Charge Allocation', description: 'Enter monthly generator diesel expense and apportion to commercial tenants by floor area.' },
      { time: '02:30 PM', step: 'Repair Contractor Sign-off', description: 'Approve electrical repair invoice against completed maintenance ticket.' },
      { time: '05:00 PM', step: 'Landlord Remittance Statement', description: 'Generate monthly landlord disbursement report with automated management fee deduction.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Transparent Building Service Charge Reconciliation',
        situation: 'Tenants in a commercial plaza routinely disputed utility service charges due to lack of itemization.',
        msmeAction: 'Used MsmeBooks Service Charge module to attach scanned utility invoices to automated tenant apportionments.',
        impact: 'Achieved 100% on-time service charge payments and ended landlord-tenant disputes.'
      }
    ],
    expectedBenefits: [
      'On-time tenant rent collection through automated recurring invoices and payment reminders.',
      'Transparent, indisputable service charge apportionments across leased spaces.',
      'Strict control over maintenance contractor expenses and repair authorizations.',
      'Professional, trust-building financial statements delivered monthly to property owners.'
    ]
  },
  {
    id: 'ecommerce',
    name: 'E-commerce & Omnichannel Retail',
    slug: 'ecommerce-omnichannel',
    shortDesc: 'Synchronize digital storefront orders, brick-and-mortar checkout, shared inventory pools, and consolidated books.',
    iconName: 'Globe',
    heroSummary: 'Eliminate channel silos with unified stock availability, cross-channel returns, payment gateway reconciliation, and unified books.',
    commonChallenges: [
      'Overselling products online that were simultaneously purchased in physical stores.',
      'Handling online order exchanges and returns at physical storefront registers.',
      'Reconciling multiple payment gateway payouts (Stripe, Paystack, PayPal) with bank accounts.',
      'Lack of clear profitability visibility comparing digital marketing returns to store margins.'
    ],
    msmeModules: [
      { name: 'Omnichannel Stock Pool', description: 'Single inventory source of truth automatically decremented whether orders occur in-store or online.', highlight: 'Live omnichannel inventory' },
      { name: 'In-Store POS & Web Returns', description: 'Look up e-commerce orders at physical store registers for instant customer pickup or exchange.', highlight: 'Frictionless omnichannel UX' },
      { name: 'Payment Clearing Ledgers', description: 'Automated matching of merchant gateway payouts and processing fees with bank deposits.', highlight: 'Pristine bank reconciliations' },
      { name: 'Channel Margin Analytics', description: 'Compare marketing acquisition cost and fulfillment expenses for online vs offline retail.', highlight: 'True channel net margins' }
    ],
    dailyWorkflows: [
      { time: '08:30 AM', step: 'Morning Order Synchronization', description: 'Review overnight web orders automatically ingested into central picking queue.' },
      { time: '11:00 AM', step: 'In-Store Pickup (BOPIS)', description: 'Customer arrives at flagship store to pick up items ordered online the previous evening.' },
      { time: '03:00 PM', step: 'Gateway Payout Reconciliation', description: 'Match merchant payment gateway deposit batch against automated clearing journal.' },
      { time: '06:00 PM', step: 'Cross-Channel Performance Review', description: 'Analyze channel revenue share and advertising return on investment.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Sub-Second Web & Store Inventory Synchronization',
        situation: 'A popular cosmetics and lifestyle retailer frequently faced cancellations when limited drops sold out.',
        msmeAction: 'Integrated digital storefront with MsmeBooks live inventory webhooks.',
        impact: 'Achieved sub-second inventory reservation across all sales channels with zero overselling.'
      }
    ],
    expectedBenefits: [
      'Absolute protection against stockouts and overselling across online and offline channels.',
      'Delightful omnichannel customer journeys including Buy Online, Pick Up in Store (BOPIS).',
      'Automated reconciliation of complex payment gateway fees and daily merchant payouts.',
      'Data-driven marketing decisions backed by true channel-specific gross and net profit margins.'
    ],
    relevantStorySlug: 'ecommerce-omnichannel-bringing-online-and-instore-together'
  },
  {
    id: 'multibranch',
    name: 'Multi-branch Businesses',
    slug: 'multi-branch-businesses',
    shortDesc: 'Unify multi-outlet branches, cross-location inventory transfers, centralized purchasing, and executive oversight.',
    iconName: 'Network',
    heroSummary: 'Scale multi-location enterprises with centralized purchasing, automated inter-branch transfers, and instant consolidated reporting.',
    commonChallenges: [
      'Disconnected software at each branch requiring manual spreadsheet compilation at head office.',
      'Uneven stock distribution where one outlet experiences stockouts while another sits on surplus.',
      'Fragmented vendor purchasing resulting in missed bulk volume discounts.',
      'Lack of granular security controls to prevent branch managers seeing competitors’ regional figures.'
    ],
    msmeModules: [
      { name: 'Enterprise Consolidation', description: 'Instant consolidated balance sheets, P&L, and cash flows with automated inter-company eliminations.', highlight: 'Single-click consolidation' },
      { name: 'Cross-Branch Transfers', description: 'Formal transfer waybills with dispatch and receiving sign-offs and in-transit tracking.', highlight: '100% transfer accountability' },
      { name: 'Centralized Procurement', description: 'Aggregate branch restocking requisitions into master supplier purchase orders for bulk pricing.', highlight: 'Maximum volume discounts' },
      { name: 'Role-Based Access Control', description: 'Configure granular permissions: branch managers view local operations; executives view all.', highlight: 'Enterprise security governance' }
    ],
    dailyWorkflows: [
      { time: '08:00 AM', step: 'Network Performance Check', description: 'Group CEO checks consolidated opening metrics across all 6 regional branches.' },
      { time: '11:00 AM', step: 'Inter-Branch Stock Balancing', description: 'Transfer 200 units from surplus warehouse to high-demand branch via digital waybill.' },
      { time: '02:30 PM', step: 'Group Bulk Purchase Order', description: 'Approve consolidated supplier purchase order combining monthly demand across all outlets.' },
      { time: '06:00 PM', step: 'Branch Revenue Ranking', description: 'Review comparative branch sales rankings and gross margins on executive dashboard.' }
    ],
    practicalScenarios: [
      {
        scenarioTitle: 'Centralizing Purchasing Across 6 Locations',
        situation: 'Each regional branch negotiated its own supplier contracts, missing bulk discounts and overpaying by 15%.',
        msmeAction: 'Deployed MsmeBooks Centralized Procurement with aggregated branch requisition workflows.',
        impact: 'Negotiated 12% lower cost of goods sold across major inventory lines and streamlined accounting.'
      }
    ],
    expectedBenefits: [
      'Instant executive access to comparative outlet performance from any connected device.',
      'Zero stock reconciliation blindspots during inter-branch transfers.',
      'Substantial cost savings achieved through aggregated supplier purchasing.',
      'Elimination of multi-week manual spreadsheet consolidation cycles at month end.'
    ],
    relevantStorySlug: 'multi-branch-enterprises-consolidated-view-business-performance'
  }
];
