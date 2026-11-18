import { ServiceItem } from '../data/servicesData';

export interface ServiceSavingsData {
  annualSavingsFormatted: string;
  annualSavingsValue: number;
  penaltiesAvoidedFormatted: string;
  overheadSavedFormatted: string;
  hoursSaved: number;
  primaryBenefit: string;
  roiPercentage: number;
}

const SERVICE_SAVINGS_MAP: Record<string, { baseSavingsNGN: number; penaltiesNGN: number; overheadNGN: number; hours: number; benefit: string }> = {
  'srv-bookkeeping-monthly': {
    baseSavingsNGN: 1850000,
    penaltiesNGN: 350000,
    overheadNGN: 1500000,
    hours: 180,
    benefit: 'Saves 65% vs hiring full-time accountant + prevents tax misfilings',
  },
  'srv-financial-cleanup': {
    baseSavingsNGN: 1250000,
    penaltiesNGN: 650000,
    overheadNGN: 600000,
    hours: 120,
    benefit: 'Eliminates revenue authority default assessments & unlocks bank credit',
  },
  'srv-software-migration': {
    baseSavingsNGN: 950000,
    penaltiesNGN: 200000,
    overheadNGN: 750000,
    hours: 80,
    benefit: 'Eliminates expensive USD subscriptions and manual spreadsheets',
  },
  'srv-tax-advisory': {
    baseSavingsNGN: 1650000,
    penaltiesNGN: 850000,
    overheadNGN: 800000,
    hours: 90,
    benefit: 'Prevents late CIT filing penalties & maximizes statutory capital allowance',
  },
  'srv-vat-wht-compliance': {
    baseSavingsNGN: 780000,
    penaltiesNGN: 480000,
    overheadNGN: 300000,
    hours: 60,
    benefit: 'Avoids monthly ₦50k/mo non-filing penalties and secures input VAT credits',
  },
  'srv-payroll-outsourcing': {
    baseSavingsNGN: 1100000,
    penaltiesNGN: 450000,
    overheadNGN: 650000,
    hours: 85,
    benefit: 'Zero PAYE audit penalties and accurate pension / statutory remittances',
  },
  'srv-pos-retail-setup': {
    baseSavingsNGN: 2400000,
    penaltiesNGN: 300000,
    overheadNGN: 2100000,
    hours: 140,
    benefit: 'Drastically cuts cashier pilferage and stock shrinkage with barcodes',
  },
  'srv-hotel-pms-implementation': {
    baseSavingsNGN: 3200000,
    penaltiesNGN: 400000,
    overheadNGN: 2800000,
    hours: 210,
    benefit: 'Eliminates unbilled room tabs, double-bookings & night audit delays',
  },
  'srv-startup-funding-advisory': {
    baseSavingsNGN: 2800000,
    penaltiesNGN: 300000,
    overheadNGN: 2500000,
    hours: 150,
    benefit: 'Qualifies SME for single-digit BOI / DBN developmental bank loans',
  },
  'srv-internal-controls-audit': {
    baseSavingsNGN: 2100000,
    penaltiesNGN: 400000,
    overheadNGN: 1700000,
    hours: 100,
    benefit: 'Uncovers warehouse stock leakages and unauthorized procurement',
  },
  'srv-bi-dashboard-automation': {
    baseSavingsNGN: 1350000,
    penaltiesNGN: 150000,
    overheadNGN: 1200000,
    hours: 160,
    benefit: 'Automates customer payment chasing & provides real-time profit tracking',
  },
  'srv-pos-cashier-staff-training': {
    baseSavingsNGN: 680000,
    penaltiesNGN: 120000,
    overheadNGN: 560000,
    hours: 50,
    benefit: 'Reduces cashier void errors, long checkout lines & end-of-shift shortages',
  },
  'srv-supermarket-package': {
    baseSavingsNGN: 4800000,
    penaltiesNGN: 600000,
    overheadNGN: 4200000,
    hours: 260,
    benefit: 'End-to-end multi-checkout stock security and expiry prevention',
  },
  'srv-restaurant-hospitality': {
    baseSavingsNGN: 2300000,
    penaltiesNGN: 250000,
    overheadNGN: 2050000,
    hours: 130,
    benefit: 'Prevents kitchen ticket mistakes and bartender liquor leakages',
  },
  'srv-pharmacy-healthcare': {
    baseSavingsNGN: 1950000,
    penaltiesNGN: 550000,
    overheadNGN: 1400000,
    hours: 110,
    benefit: 'Zero expired shelf medications, HMO billing accuracy & batch trace',
  },
};

export function getServiceSavingsData(
  service: ServiceItem, 
  country?: string,
  currencyOverride?: { symbol: string; rateMultiplier: number }
): ServiceSavingsData {
  let rateMultiplier = 1;
  let currencySymbol = '₦';

  if (currencyOverride) {
    rateMultiplier = currencyOverride.rateMultiplier;
    currencySymbol = currencyOverride.symbol;
  } else {
    switch (country) {
      case 'Ghana':
        rateMultiplier = 0.0105;
        currencySymbol = 'GH₵';
        break;
      case 'Kenya':
        rateMultiplier = 0.088;
        currencySymbol = 'KSh';
        break;
      case 'South Africa':
        rateMultiplier = 0.0125;
        currencySymbol = 'R';
        break;
      case 'Rwanda':
        rateMultiplier = 0.95;
        currencySymbol = 'RWF';
        break;
      case 'UK / International':
        rateMultiplier = 0.0007;
        currencySymbol = '$';
        break;
      case 'Nigeria':
      default:
        rateMultiplier = 1;
        currencySymbol = '₦';
        break;
    }
  }

  const base = SERVICE_SAVINGS_MAP[service.id] || {
    baseSavingsNGN: 1200000,
    penaltiesNGN: 350000,
    overheadNGN: 850000,
    hours: 90,
    benefit: 'Operational efficiency and statutory compliance protection',
  };

  const totalValue = Math.round(base.baseSavingsNGN * rateMultiplier);
  const penaltiesValue = Math.round(base.penaltiesNGN * rateMultiplier);
  const overheadValue = Math.round(base.overheadNGN * rateMultiplier);

  return {
    annualSavingsFormatted: `${currencySymbol}${totalValue.toLocaleString()}`,
    annualSavingsValue: totalValue,
    penaltiesAvoidedFormatted: `${currencySymbol}${penaltiesValue.toLocaleString()}`,
    overheadSavedFormatted: `${currencySymbol}${overheadValue.toLocaleString()}`,
    hoursSaved: base.hours,
    primaryBenefit: base.benefit,
    roiPercentage: 340, // 3.4x average ROI
  };
}
