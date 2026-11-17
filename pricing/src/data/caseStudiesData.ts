import { BusinessCaseStudy } from '../types';
import textileKanoImg from '../assets/images/case_study_textile_kano_1794604118761.jpg';
import pharmacyLagosImg from '../assets/images/case_study_pharmacy_lagos_1794604120671.jpg';
import agriNairobiImg from '../assets/images/case_study_agri_nairobi_1794604121519.jpg';
import bistroAccraImg from '../assets/images/case_study_bistro_accra_1794604121687.jpg';
import logisticsJoburgImg from '../assets/images/case_study_logistics_joburg_1794604122174.jpg';

export const BUSINESS_CASE_STUDIES: BusinessCaseStudy[] = [
  {
    id: 'zaria-fabric-hub',
    indexLabel: '01',
    businessName: 'Zaria Fabric & Fashion Hub',
    founderName: 'Amina Yusuf',
    founderRole: 'Founder & Managing Director',
    city: 'Kano & Abuja',
    country: 'Nigeria',
    sector: 'Textile & Fashion Wholesale',
    image: textileKanoImg,
    imageAlt: 'Amina Yusuf reviewing fabric bolt stock levels on a tablet inside Zaria Fabric & Fashion Hub in Kano',
    planId: 'premium',
    planLabel: 'Premium Plan · 10 Users',
    timeframe: '14 months on MsmeBooks',
    headline: 'Expanded from one Kano market stall to four regional wholesale showrooms with 35% lower shrinkage',
    scaleJourney: {
      before: '1 stall, manual paper stock cards & weekly WhatsApp tallying',
      after: '4 showrooms, 10 staff seats & live inter-branch stock sync',
    },
    challenge:
      'Dispatching thousands of Ankara and lace bales between Kano and Abuja led to unrecorded transfers, pricing mismatches between cashiers, and blind restocking decisions.',
    solution:
      'Deployed MsmeBooks Multi-Branch Inventory and ESC/POS barcode tagging across all four showrooms, linking wholesale credit ledgers directly to daily bank settlements.',
    outcome:
      'Full margin visibility per fabric line within 60 days, cutting dead-stock capital lockup and enabling two new northern distribution hubs without hiring extra bookkeepers.',
    metrics: [
      {
        label: 'Stock Shrinkage',
        value: '-35%',
        context: 'Within first 4 months',
      },
      {
        label: 'Branch Footprint',
        value: '1 → 4',
        context: 'Kano & Abuja showrooms',
      },
      {
        label: 'Profit Visibility',
        value: '+42%',
        context: 'Net margin clarity per SKU',
      },
    ],
    modulesDeployed: [
      'Multi-Branch Warehouse Sync',
      'Wholesale Credit Control',
      'ESC/POS Thermal Invoicing',
      'Automated Daily P&L',
    ],
    quote:
      'MsmeBooks gives us visibility across our sales, inventory, and finances without juggling separate spreadsheets. We opened our fourth showroom knowing our exact cash position every evening.',
  },
  {
    id: 'swiftmed-pharmaceuticals',
    indexLabel: '02',
    businessName: 'SwiftMed Pharmaceuticals',
    founderName: 'Chidi Okafor',
    founderRole: 'Co-Founder & Chief Operations Officer',
    city: 'Lagos',
    country: 'Nigeria',
    sector: 'Healthcare & Pharmacy Chain',
    image: pharmacyLagosImg,
    imageAlt: 'Pharmacist scanning medicine packaging at SwiftMed Pharmaceuticals POS counter in Lagos',
    planId: 'business',
    planLabel: 'Business Plan · 5 Users',
    timeframe: '11 months on MsmeBooks',
    headline: 'Eliminated expired medicine write-offs across three Lagos pharmacy outlets in 90 days',
    scaleJourney: {
      before: '1 dispensary, ₦1.8M annual expired-stock write-offs',
      after: '3 synchronized outlets, automated FEFO batch alerts',
    },
    challenge:
      'Tracking thousands of prescription batch numbers and expiry dates manually caused silent shelf spoilage and forced emergency stock runs between Mainland and Island outlets.',
    solution:
      'Implemented MsmeBooks Batch & Expiration Tracking alongside offline-capable POS counters, surfacing 60-day expiry warnings and one-click inter-branch stock transfers.',
    outcome:
      'Cut expired inventory waste near zero, sped up patient counter checkout by 3x, and automated statutory 7.5% Nigerian VAT itemization for zero-rated vs. vatable OTC products.',
    metrics: [
      {
        label: 'Expired Write-Offs',
        value: '-94%',
        context: 'First 90 days of batch alerts',
      },
      {
        label: 'Outlets Synced',
        value: '3 Branches',
        context: 'Real-time Lagos stock ledger',
      },
      {
        label: 'Checkout Speed',
        value: '2.8x',
        context: 'Barcode scan to receipt',
      },
    ],
    modulesDeployed: [
      'Batch & Expiry Date Tracking',
      'Offline-Ready Pharmacy POS',
      'Inter-Branch Stock Transfers',
      'FIRS 7.5% VAT Itemization',
    ],
    quote:
      'Before MsmeBooks, tracking medicine batch numbers across three branches was a weekly crisis. Now every transfer, prescription sale, and daily ledger balances automatically.',
  },
  {
    id: 'great-rift-agri-coop',
    indexLabel: '03',
    businessName: 'Great Rift Agri-Supplies & Co-op',
    founderName: 'Wanjiku Kamau',
    founderRole: 'Founder & Operations Lead',
    city: 'Nairobi & Nakuru',
    country: 'Kenya',
    sector: 'Agri-Tech & Export Distribution',
    image: agriNairobiImg,
    imageAlt: 'Operations lead reviewing export produce batch manifests on a tablet in Nairobi packing warehouse',
    planId: 'growth',
    planLabel: 'Growth Plan · 2 Users',
    timeframe: '9 months on MsmeBooks',
    headline: 'Scaled smallholder supplier network 8x with instant M-Pesa Till and KRA eTIMS reconciliation',
    scaleJourney: {
      before: '40 partner farms, 18 hours/week matching M-Pesa SMS logs',
      after: '320+ farms, KES 4.8M/mo reconciled automatically',
    },
    challenge:
      'Paying hundreds of avocado and horticulture growers via M-Pesa while issuing KRA-compliant tax invoices to Nairobi hotels and export buyers created severe reconciliation backlogs.',
    solution:
      'Connected M-Pesa Buy Goods till streams directly into MsmeBooks ledgers with automated KRA eTIMS invoice stamping and multi-currency USD/KES export billing.',
    outcome:
      'Reclaimed 18 hours of finance admin every week, scaled supplier capacity 8x across Nakuru and Kiambu, and passed quarterly export audits with zero missing vouchers.',
    metrics: [
      {
        label: 'M-Pesa Reconciled',
        value: 'KES 4.8M/mo',
        context: 'Automated C2B till matching',
      },
      {
        label: 'Bookkeeping Saved',
        value: '18 hrs/wk',
        context: 'Zero manual SMS entry',
      },
      {
        label: 'Supplier Scale',
        value: '8x Growth',
        context: '40 → 320+ partner farms',
      },
    ],
    modulesDeployed: [
      'M-Pesa Till Auto-Sync',
      'KRA eTIMS Tax Invoicing',
      'Multi-Currency KES & USD',
      'Supplier Payout Ledgers',
    ],
    quote:
      'Connecting M-Pesa directly to MsmeBooks changed our cash flow. Every farmer payout and hotel invoice reconciles on its own with full KRA eTIMS compliance.',
  },
  {
    id: 'accra-gourmet-bistro',
    indexLabel: '04',
    businessName: 'Accra Gourmet Foods & Bistro',
    founderName: 'Kofi Mensah',
    founderRole: 'General Manager',
    city: 'Accra',
    country: 'Ghana',
    sector: 'Hospitality & Food Services',
    image: bistroAccraImg,
    imageAlt: 'Digital POS terminal and kitchen counter inside Accra Gourmet Foods & Bistro',
    planId: 'business',
    planLabel: 'Business Plan · 5 Users',
    timeframe: '16 months on MsmeBooks',
    headline: 'Scaled from a 12-table bistro to three Accra dining rooms with zero downtime offline POS',
    scaleJourney: {
      before: '1 bistro, dropped orders during evening ISP outages',
      after: '3 locations + central kitchen, 100% uptime billing',
    },
    challenge:
      'Peak Friday evening fiber drops froze cloud-only billing terminals, forcing handwritten dockets that caused kitchen delays and unbilled tables.',
    solution:
      'Switched every service station to MsmeBooks Offline POS with local order buffering, automatic GRA e-VAT breakdown, and central ingredient recipe costing.',
    outcome:
      'Sustained zero billing downtime across 16 months, cut food ingredient wastage by 22% through automated commissary stock deductions, and expanded to Osu and East Legon.',
    metrics: [
      {
        label: 'POS Uptime',
        value: '100%',
        context: 'Buffers sales cleanly offline',
      },
      {
        label: 'Food Cost Variance',
        value: '-22%',
        context: 'Ingredient stock tracking',
      },
      {
        label: 'Locations Scaled',
        value: '1 → 3',
        context: 'Osu, Cantonments & East Legon',
      },
    ],
    modulesDeployed: [
      'Offline-First Waiter POS',
      'MoMo & Card Split Tender',
      'GRA e-VAT Tax Slips',
      'Central Kitchen Costing',
    ],
    quote:
      'Offline POS saved our Friday dinner service. Terminals buffer every order locally during network drops and sync straight to our Accra accounting ledger the second connectivity returns.',
  },
  {
    id: 'apex-cold-freight',
    indexLabel: '05',
    businessName: 'Apex Cold Storage & Freight',
    founderName: 'Thabo Ndlovu',
    founderRole: 'Managing Director',
    city: 'Johannesburg',
    country: 'South Africa',
    sector: 'Cold-Chain Logistics & Warehousing',
    image: logisticsJoburgImg,
    imageAlt: 'Thabo Ndlovu checking pallet inventory on a rugged tablet inside Johannesburg cold-chain warehouse',
    planId: 'enterprise',
    planLabel: 'Enterprise Plan · 15 Users',
    timeframe: '18 months on MsmeBooks',
    headline: 'Connected four Gauteng cold-storage hubs and compressed SARS VAT filing to 20 minutes',
    scaleJourney: {
      before: '2 depots, 4-day month-end inventory & VAT reconciliation',
      after: '4 connected hubs, R 28M+ annual freight volume audited',
    },
    challenge:
      'Managing refrigerated pallet allocations across four Gauteng warehouses while coordinating cross-border SADC transport manifests left finance teams closing books a week late.',
    solution:
      'Adopted MsmeBooks Enterprise with role-based depot approvals, automated inter-warehouse transfer manifests, and one-click SARS VAT 201 return schedules.',
    outcome:
      'Closed month-end financial reporting four days faster, eliminated double-booked cold storage bays, and scaled freight capacity across Midrand, Centurion, and Germiston.',
    metrics: [
      {
        label: 'Month-End Close',
        value: '4 Days Faster',
        context: 'Automated depot consolidations',
      },
      {
        label: 'Hubs Connected',
        value: '4 Depots',
        context: 'Live Gauteng cold-chain visibility',
      },
      {
        label: 'SARS VAT Prep',
        value: '20 mins',
        context: 'Down from 2 full days',
      },
    ],
    modulesDeployed: [
      'Inter-Warehouse Approvals',
      'SARS VAT 201 Export Reports',
      'Custom Enterprise Permissions',
      'Fleet Dispatch Manifests',
    ],
    quote:
      'Our Gauteng distribution requires split-second stock accuracy across four depots. MsmeBooks handles every cold-storage transfer and SARS VAT schedule without missing a beat.',
  },
];
