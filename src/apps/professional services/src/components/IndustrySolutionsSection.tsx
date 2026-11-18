import React, { useState } from 'react';
import { 
  Building2, 
  ShoppingCart, 
  UtensilsCrossed, 
  Hotel, 
  Boxes, 
  Activity, 
  GraduationCap, 
  Factory, 
  Building, 
  Truck, 
  Sparkles, 
  Briefcase, 
  Globe, 
  ArrowRight, 
  CheckCircle2, 
  MessageCircle,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { INDUSTRIES_LIST, SERVICES_CATALOGUE, ServiceItem } from '../data/servicesData';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';
import { useCurrency } from '../context/CurrencyContext';

interface IndustrySolutionsProps {
  onSelectService: (service: ServiceItem) => void;
  onBookService: (service: ServiceItem) => void;
}

export const IndustrySolutionsSection: React.FC<IndustrySolutionsProps> = ({
  onSelectService,
  onBookService,
}) => {
  const { formatPriceString } = useCurrency();
  const [activeIndustryId, setActiveIndustryId] = useState('retail');

  const industryProfiles: Record<string, {
    title: string;
    description: string;
    recommendedServices: string[];
    keyFeatures: string[];
    hardwareSupported: string[];
    samplePackage: string;
    linkedServiceId: string;
  }> = {
    retail: {
      title: 'Supermarkets & Retail Stores',
      description: 'Barcode scanning, cashier permissions, expiry tracking, fast queue management, and multi-lane checkout configurations.',
      recommendedServices: ['Turnkey Supermarket POS Setup', 'Monthly Bookkeeping Retainer', 'Staff Cashier Coaching'],
      keyFeatures: ['Barcode label printing', 'Split cash/card/transfer tender', 'Automated stock reorder alerts', 'Cashier shift reconciliations'],
      hardwareSupported: ['Thermal 80mm printers', '2D Barcode scanners', 'Electronic cash drawers', 'Electronic weight scales'],
      samplePackage: 'Supermarket Turnkey Rollout (Per Hour or Fixed Day Rate)',
      linkedServiceId: 'srv-supermarket-package',
    },
    restaurants: {
      title: 'Restaurants, Cafés & Lounges',
      description: 'Floor & table management, Kitchen Order Tickets (KOT), cocktail recipe ingredient tracking, and waiter handheld ordering.',
      recommendedServices: ['Restaurant Cloud POS & KOT Setup', 'Recipe Costing & Stock Intake', 'Night Audit & Cashier Auditing'],
      keyFeatures: ['Kitchen & bar printer split routing', 'Recipe inventory deduction', 'Table transfer & bill splitting', 'Daily wastage tracking'],
      hardwareSupported: ['Kitchen impact printers', 'Android handheld waiter POS', 'Cash drawers', 'Caller displays'],
      samplePackage: 'F&B Turnkey Package (Per Hour or Fixed Day Rate)',
      linkedServiceId: 'srv-restaurant-hospitality',
    },
    hotels: {
      title: 'Hotels, Resorts & Serviced Apartments',
      description: 'Room reservations, guest check-in/out folios, housekeeping management, restaurant POS sync, and automated night audits.',
      recommendedServices: ['Hotel PMS Complete Implementation', 'Front Desk & Folio Automation', 'Management Night Audit Setup'],
      keyFeatures: ['Live room availability rack', 'Unified guest folio billing', 'Automated 2:00 AM night audit', 'Seasonal rate management'],
      hardwareSupported: ['RFID Keycard encoders', 'Passport scanners', 'Front-desk laser printers', 'Kitchen printers'],
      samplePackage: 'Boutique Hotel Setup (Per Hour or Fixed Day Rate)',
      linkedServiceId: 'srv-hotel-pms-implementation',
    },
    wholesale: {
      title: 'Wholesale & Distribution Warehouses',
      description: 'Multi-warehouse stock movements, carton-to-unit pack conversions, credit limit controls, and field van sales tracking.',
      recommendedServices: ['Inventory & Warehouse Optimization', 'Accounts Receivable Chasing', 'Physical Stock Auditing'],
      keyFeatures: ['Bulk pricing tiers', 'Driver delivery receipts', 'Customer debt aging tracking', 'Transfer dispatch notes'],
      hardwareSupported: ['Industrial rugged barcode scanners', 'Mobile Bluetooth receipt printers'],
      samplePackage: 'Wholesale Multi-Store Setup (Per Hour or Fixed Day Rate)',
      linkedServiceId: 'srv-internal-controls-audit',
    },
    healthcare: {
      title: 'Pharmacies, Clinics & Diagnostic Labs',
      description: 'Strict batch number & expiration date tracking, prescription dispensing, patient ledger, and regulatory NAFFAC compliance.',
      recommendedServices: ['Pharmacy Drug Batch & Expiry Setup', 'PAYE & Doctor Payroll', 'Monthly Tax Filing'],
      keyFeatures: ['Near-expiry 30/60/90-day alert flags', 'Prescription dosage notes', 'HMO health insurance billing', 'Daily pharmacist reconciliation'],
      hardwareSupported: ['High-speed 2D barcode scanners', 'Thermal prescription receipt printers'],
      samplePackage: 'Pharmacy Batch Setup (Per Hour or Fixed Day Rate)',
      linkedServiceId: 'srv-pharmacy-healthcare',
    },
    schools: {
      title: 'Schools & Educational Institutions',
      description: 'Student term fees billing, parent payment receipts, teacher payroll, canteen POS, and school asset registers.',
      recommendedServices: ['School Accounting & Fee Billing Setup', 'Payroll Outsourcing', 'Annual Audit Preparation'],
      keyFeatures: ['Termly tuition fee schedules', 'Bank payment reconciliation', 'Uniform & book shop POS', 'Teacher salary payslips'],
      hardwareSupported: ['Thermal receipt printers', 'School office accounting workstations'],
      samplePackage: 'School Finance Automation (Per Hour or Fixed Day Rate)',
      linkedServiceId: 'srv-payroll-outsourcing',
    },
    manufacturing: {
      title: 'Manufacturing & Light Assembly',
      description: 'Bill of Materials (BOM), raw material tracking, finished goods costing, machine maintenance ledgers, and inventory controls.',
      recommendedServices: ['BOM Recipe Costing & Factory Setup', 'Internal Stock Audit', 'Corporate Tax Advisory'],
      keyFeatures: ['Raw materials conversion', 'Direct labor & overhead allocation', 'Factory floor stocktaking', 'Wastage percentage analysis'],
      hardwareSupported: ['Rugged warehouse tablets', 'Barcode label printers'],
      samplePackage: 'Manufacturing Costing Setup (Per Hour or Fixed Day Rate)',
      linkedServiceId: 'srv-internal-controls-audit',
    },
    construction: {
      title: 'Construction & Real Estate',
      description: 'Project-based job costing, subcontractor payment certificates, WHT deductions, and equipment depreciation tracking.',
      recommendedServices: ['Job Costing & Milestone Accounting', 'Withholding Tax Credit Tracking', 'BOI Loan Proposals'],
      keyFeatures: ['Site expense allocation', 'Retention fee accounting', 'Subcontractor tax certificates', 'Capital allowance schedules'],
      hardwareSupported: ['Site mobile devices', 'Office accounting servers'],
      samplePackage: 'Construction Finance Blueprint (Per Hour or Fixed Day Rate)',
      linkedServiceId: 'srv-startup-funding-advisory',
    },
    logistics: {
      title: 'Logistics & Transportation',
      description: 'Waybill management, fleet fuel & maintenance expenditure, driver remittances, and multi-depot cash handling.',
      recommendedServices: ['Fleet Cash & Expense Automation', 'Monthly Financial Accounts', 'Tax Compliance'],
      keyFeatures: ['Vehicle fuel expense logs', 'Trip profitability tracking', 'Customer freight receivables', 'Driver payroll'],
      hardwareSupported: ['Mobile dispatch receipt printers'],
      samplePackage: 'Logistics Finance Setup (Per Hour or Fixed Day Rate)',
      linkedServiceId: 'srv-bookkeeping-monthly',
    },
    beauty: {
      title: 'Beauty Salons, Spas & Fashion',
      description: 'Stylist commission splits, treatment appointments, retail product sales, and automated customer birthday WhatsApp discounts.',
      recommendedServices: ['Salon POS & Commission Setup', 'Monthly Bookkeeping', 'Cashier Coaching'],
      keyFeatures: ['Stylist commission tracking', 'Customer loyalty points', 'Service appointment calendar', 'Hair & skincare retail inventory'],
      hardwareSupported: ['Compact desktop touch POS', 'Bluetooth thermal printers'],
      samplePackage: 'Salon & Spa POS Setup (Per Hour or Fixed Day Rate)',
      linkedServiceId: 'srv-pos-retail-setup',
    },
    professional: {
      title: 'Professional Service Firms & Consultancies',
      description: 'Client retainer billing, time-tracking, expense disbursements, VAT/WHT compliance, and partnership accounts.',
      recommendedServices: ['Retainer Invoicing & Receivables', 'Tax & Annual CIT Advisory', 'Executive BI Dashboards'],
      keyFeatures: ['Automated recurring monthly invoices', 'Client WHT receipt matching', 'Partner profit sharing', 'Online payment gateways'],
      hardwareSupported: ['Cloud laptops & mobile accounting'],
      samplePackage: 'Professional Retainer Automation (Per Hour or Fixed Day Rate)',
      linkedServiceId: 'srv-bookkeeping-monthly',
    },
    ecommerce: {
      title: 'E-commerce & Online Sellers',
      description: 'Syncing online orders (Shopify, WooCommerce, Instagram) directly into MsmeBooks ledgers, payment gateways, and shipping fees.',
      recommendedServices: ['E-Commerce Sync & API Integration', 'Payment Gateway Reconciliation', 'Monthly Management Accounts'],
      keyFeatures: ['Paystack & Flutterwave auto-reconciliation', 'Real-time stock deduction', 'Return / exchange accounting', 'Courier COD management'],
      hardwareSupported: ['Shipping label printers'],
      samplePackage: 'E-Commerce Accounting Sync (Per Hour or Fixed Day Rate)',
      linkedServiceId: 'srv-bi-dashboard-automation',
    },
  };

  const currentProfile = industryProfiles[activeIndustryId] || industryProfiles.retail;
  const linkedService = SERVICES_CATALOGUE.find(s => s.id === currentProfile.linkedServiceId) || SERVICES_CATALOGUE[0];

  return (
    <section id="industry-solutions" className="py-20 bg-white dark:bg-[#07111D] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            Specialized Industry Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#102B4E] dark:text-white tracking-tight">
            Tailored Industry Blueprints & Implementation Packages
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base font-normal">
            Every business sector has unique operational demands. Discover how our verified professionals deploy MsmeBooks specifically for your vertical.
          </p>
        </div>

        {/* Industry Pill Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 min-w-max scrollbar-thin">
          {INDUSTRIES_LIST.map((ind) => (
            <button
              key={ind.id}
              onClick={() => setActiveIndustryId(ind.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
                activeIndustryId === ind.id
                  ? 'bg-[#102B4E] dark:bg-[#1464C8] text-white shadow-md ring-2 ring-[#B7E532]'
                  : 'bg-slate-100 dark:bg-[#0A1727] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#132842] border border-transparent dark:border-slate-800'
              }`}
            >
              <span>{ind.name}</span>
            </button>
          ))}
        </div>

        {/* Active Industry Profile Spotlight Card */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-[#0A1727] dark:to-[#0D1D31] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Description & Key Highlights */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white dark:bg-[#0E2036] text-[#1464C8] dark:text-[#B7E532] text-xs font-black rounded-lg shadow-xs border border-slate-200 dark:border-slate-700">
                  Sector Blueprint
                </span>
                <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  Turnkey Package Ready
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#102B4E] dark:text-white tracking-tight">
                {currentProfile.title}
              </h3>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                {currentProfile.description}
              </p>

              {/* Recommended Services List */}
              <div className="p-4 bg-white dark:bg-[#0E2036] rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                  Recommended Professional Engagements:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentProfile.recommendedServices.map((srvName, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532] shrink-0" />
                      <span>{srvName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supported Hardware Specs */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                  Integrated Hardware & Peripherals:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentProfile.hardwareSupported.map((hw, i) => (
                    <span key={i} className="text-xs font-semibold bg-slate-200/70 dark:bg-[#08121E] text-slate-700 dark:text-slate-300 px-3 py-1 rounded-lg border border-transparent dark:border-slate-800">
                      {hw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectService(linkedService)}
                  className="px-5 py-3 bg-[#1464C8] hover:bg-[#1052a5] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore {currentProfile.title} Package</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={buildWhatsAppBookingUrl({
                    serviceName: `${currentProfile.title} Professional Package`,
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#102B4E]" />
                  <span>WhatsApp Industry Specialist</span>
                </a>
              </div>
            </div>

            {/* Right Column: Pricing & Quick Booking Summary */}
            <div className="lg:col-span-5 bg-white dark:bg-[#0E2036] p-6 rounded-2xl shadow-md border border-slate-200 dark:border-slate-800 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#1464C8] dark:text-[#B7E532]">
                Featured Turnkey Blueprint
              </span>

              <h4 className="text-xl font-black text-[#102B4E] dark:text-white">
                {currentProfile.samplePackage}
              </h4>

              <div className="flex items-center gap-2 text-xs font-bold text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/40 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900/60 w-fit">
                <Clock className="w-3.5 h-3.5" />
                <span>Flexible: Per Hour or Fixed Price Billing</span>
              </div>

              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-t border-b border-slate-100 dark:border-slate-800 py-3">
                <div className="flex items-center justify-between">
                  <span>Implementation Mode:</span>
                  <strong className="text-emerald-700 dark:text-emerald-400">On-Site & Remote Hybrid</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Hardware Setup:</span>
                  <strong className="text-slate-800 dark:text-slate-200">Printers, Scanners & Drawers</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Staff Coaching:</span>
                  <strong className="text-slate-800 dark:text-slate-200">Cashiers, Managers & Storekeepers</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Post-Go-Live Support:</span>
                  <strong className="text-slate-800 dark:text-slate-200">30-Day Guaranteed VIP Standby</strong>
                </div>
              </div>

              <button
                onClick={() => onBookService(linkedService)}
                className="w-full py-3 bg-[#102B4E] dark:bg-[#1464C8] hover:bg-[#1464C8] dark:hover:bg-[#1052a5] text-white font-bold text-xs rounded-xl shadow-sm transition-colors cursor-pointer text-center"
              >
                Schedule Turnkey Implementation
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
