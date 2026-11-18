export interface TaxDeadlineItem {
  id: string;
  country: string;
  authority: string;
  taxType: string;
  title: string;
  frequency: 'Monthly' | 'Quarterly' | 'Bi-Annual' | 'Annual';
  dueDayDescription: string;
  nextDueDate: string; // ISO date format YYYY-MM-DD
  description: string;
  penaltyWarning: string;
  statutoryAct: string;
  applicableBusinessTypes: string[];
  serviceCategoryId: string;
}

export const REGIONAL_TAX_DEADLINES: Record<string, TaxDeadlineItem[]> = {
  Nigeria: [
    {
      id: 'ng-paye-monthly',
      country: 'Nigeria',
      authority: 'State Internal Revenue Service (LIRS, FCT-IRS, etc.)',
      taxType: 'PAYE (Personal Income Tax)',
      title: 'Monthly PAYE Statutory Remittance',
      frequency: 'Monthly',
      dueDayDescription: '10th of every month',
      nextDueDate: '2026-11-10',
      description: 'Remittance of PAYE deducted from employee payroll salaries for preceding month.',
      penaltyWarning: '10% penalty per annum plus 1% commercial interest per month under PITA.',
      statutoryAct: 'Personal Income Tax Act (PITA) Cap P8 LFN 2004',
      applicableBusinessTypes: ['All registered businesses with 1+ salaried employees'],
      serviceCategoryId: 'srv-payroll-pension',
    },
    {
      id: 'ng-vat-wht-monthly',
      country: 'Nigeria',
      authority: 'Federal Inland Revenue Service (FIRS)',
      taxType: 'VAT & Withholding Tax (WHT)',
      title: 'Monthly Value Added Tax (VAT) & WHT Returns',
      frequency: 'Monthly',
      dueDayDescription: '21st of every month',
      nextDueDate: '2026-11-21',
      description: 'Monthly filing and remittance of 7.5% VAT collected and 5%/10% WHT deducted from vendor invoices via TaxPro-Max.',
      penaltyWarning: '₦50,000 for first month of default and ₦25,000 for each subsequent month.',
      statutoryAct: 'Value Added Tax Act & Finance Act 2023',
      applicableBusinessTypes: ['All businesses exceeding ₦25M turnover threshold & WHT agents'],
      serviceCategoryId: 'srv-tax-advisory',
    },
    {
      id: 'ng-pension-remittance',
      country: 'Nigeria',
      authority: 'PenCom / Approved PFAs',
      taxType: 'Statutory Pension Scheme',
      title: 'Monthly Contributory Pension Remittance',
      frequency: 'Monthly',
      dueDayDescription: '7 days after payroll payment',
      nextDueDate: '2026-11-07',
      description: 'Mandatory 10% employer and 8% employee pension contributions remitted to staff PFC accounts.',
      penaltyWarning: 'Penalty of not less than 2% of the unpaid amount per month of default.',
      statutoryAct: 'Pension Reform Act (PRA) 2014',
      applicableBusinessTypes: ['Organizations with 3 or more employees'],
      serviceCategoryId: 'srv-payroll-pension',
    },
    {
      id: 'ng-cit-annual',
      country: 'Nigeria',
      authority: 'Federal Inland Revenue Service (FIRS)',
      taxType: 'Company Income Tax (CIT)',
      title: 'Annual Audited Financials & CIT Return',
      frequency: 'Annual',
      dueDayDescription: 'Within 6 months after fiscal year end (June 30)',
      nextDueDate: '2027-06-30',
      description: 'Submission of audited balance sheets, P&L, capital allowance schedules, and CIT self-assessment (0% small, 20% medium, 30% large).',
      penaltyWarning: '₦25,000 for first month of default plus ₦5,000 for each subsequent month.',
      statutoryAct: 'Companies Income Tax Act (CITA) Cap C21 LFN 2004',
      applicableBusinessTypes: ['All Limited Liability Companies (Ltd) registered with CAC'],
      serviceCategoryId: 'srv-audit-readiness',
    },
    {
      id: 'ng-cac-annual-returns',
      country: 'Nigeria',
      authority: 'Corporate Affairs Commission (CAC)',
      taxType: 'Statutory Regulatory Compliance',
      title: 'CAC Annual Returns Filing',
      frequency: 'Annual',
      dueDayDescription: 'Earlier of 42 days after AGM or June 30',
      nextDueDate: '2027-06-30',
      description: 'Annual corporate filing to keep company in "Active" status on CAC public registry.',
      penaltyWarning: 'Daily default fines and potential striking off company from the corporate register.',
      statutoryAct: 'Companies and Allied Matters Act (CAMA) 2020',
      applicableBusinessTypes: ['All Incorporated Companies & Registered Business Names'],
      serviceCategoryId: 'srv-tax-advisory',
    },
  ],

  Kenya: [
    {
      id: 'ke-paye-monthly',
      country: 'Kenya',
      authority: 'Kenya Revenue Authority (KRA)',
      taxType: 'PAYE & Housing Levy',
      title: 'Monthly PAYE, Housing Levy & NITA Returns',
      frequency: 'Monthly',
      dueDayDescription: '9th of every month',
      nextDueDate: '2026-11-09',
      description: 'Electronic submission via KRA iTax portal for employee PAYE and 1.5% Affordable Housing Levy.',
      penaltyWarning: '25% of tax due or KSh 10,000 minimum penalty plus 1% late payment interest per month.',
      statutoryAct: 'Kenya Income Tax Act Cap 470 & Finance Act 2023',
      applicableBusinessTypes: ['All Kenyan employers with PAYE-liable staff'],
      serviceCategoryId: 'srv-payroll-pension',
    },
    {
      id: 'ke-vat-monthly',
      country: 'Kenya',
      authority: 'Kenya Revenue Authority (KRA)',
      taxType: 'Value Added Tax (16%)',
      title: 'Monthly VAT Return & Electronic Tax Invoice (eTIMS)',
      frequency: 'Monthly',
      dueDayDescription: '20th of every month',
      nextDueDate: '2026-11-20',
      description: 'Reconciliation of 16% VAT and eTIMS validated electronic invoices on iTax portal.',
      penaltyWarning: '5% of tax due or KSh 10,000 plus compounding late interest.',
      statutoryAct: 'Kenya Value Added Tax Act 2013 & eTIMS Regulations',
      applicableBusinessTypes: ['VAT registered traders with annual turnover exceeding KSh 5M'],
      serviceCategoryId: 'srv-tax-advisory',
    },
    {
      id: 'ke-wht-monthly',
      country: 'Kenya',
      authority: 'Kenya Revenue Authority (KRA)',
      taxType: 'Withholding Tax (WHT)',
      title: 'Monthly Withholding Tax Return',
      frequency: 'Monthly',
      dueDayDescription: '20th of every month',
      nextDueDate: '2026-11-20',
      description: 'Remittance of professional services WHT (5%) and contractual fees (3%).',
      penaltyWarning: '10% penalty plus 1% late payment interest per month.',
      statutoryAct: 'Kenya Income Tax Act Section 35',
      applicableBusinessTypes: ['Designated withholding tax agents in Kenya'],
      serviceCategoryId: 'srv-tax-advisory',
    },
    {
      id: 'ke-cit-annual',
      country: 'Kenya',
      authority: 'Kenya Revenue Authority (KRA)',
      taxType: 'Corporate Income Tax (30%)',
      title: 'Annual Corporation Tax Return (IT2C)',
      frequency: 'Annual',
      dueDayDescription: 'Last day of 6th month after fiscal year (June 30)',
      nextDueDate: '2027-06-30',
      description: 'Annual corporate tax return filing supported by audited accounts and installment tax reconciliations.',
      penaltyWarning: '5% of unpaid tax or KSh 20,000 minimum fine.',
      statutoryAct: 'Kenya Income Tax Act',
      applicableBusinessTypes: ['All resident limited companies in Kenya'],
      serviceCategoryId: 'srv-audit-readiness',
    },
  ],

  Ghana: [
    {
      id: 'gh-tier-ssnit-paye',
      country: 'Ghana',
      authority: 'Ghana Revenue Authority (GRA) & SSNIT',
      taxType: 'PAYE & SSNIT Tier 1 & Tier 2',
      title: 'Monthly PAYE and SSNIT Pension Remittance',
      frequency: 'Monthly',
      dueDayDescription: '14th of every month',
      nextDueDate: '2026-11-14',
      description: 'Remittance of graduated income tax (PAYE) and mandatory 13.5% SSNIT Tier 1 & 5% Tier 2.',
      penaltyWarning: '3% compounding penalty per month on unpaid contributions.',
      statutoryAct: 'National Pensions Act 2008 (Act 766) & Income Tax Act 2015 (Act 896)',
      applicableBusinessTypes: ['All employers operating in Ghana'],
      serviceCategoryId: 'srv-payroll-pension',
    },
    {
      id: 'gh-vat-nhil-getfund',
      country: 'Ghana',
      authority: 'Ghana Revenue Authority (GRA)',
      taxType: 'VAT (15%), NHIL (2.5%), GETFund (2.5%), COVID Levy (1%)',
      title: 'Monthly VAT, NHIL & GETFund Returns',
      frequency: 'Monthly',
      dueDayDescription: 'Last working day of the month',
      nextDueDate: '2026-11-30',
      description: 'Standard 21.9% effective rate VAT composite returns and Certified Invoicing System (e-VAT).',
      penaltyWarning: 'GH₵ 500 initial penalty plus GH₵ 10 for each day of default.',
      statutoryAct: 'Value Added Tax Act 2013 (Act 870)',
      applicableBusinessTypes: ['VAT registered businesses in Ghana'],
      serviceCategoryId: 'srv-tax-advisory',
    },
    {
      id: 'gh-cit-annual',
      country: 'Ghana',
      authority: 'Ghana Revenue Authority (GRA)',
      taxType: 'Company Income Tax (25%)',
      title: 'Annual Corporate Income Tax Filing',
      frequency: 'Annual',
      dueDayDescription: 'Within 4 months after fiscal year end (April 30)',
      nextDueDate: '2027-04-30',
      description: 'Submission of GRA corporate tax return accompanied by audited financial accounts.',
      penaltyWarning: 'GH₵ 500 penalty plus interest on outstanding tax balance.',
      statutoryAct: 'Income Tax Act 2015 (Act 896)',
      applicableBusinessTypes: ['All registered corporate entities in Ghana'],
      serviceCategoryId: 'srv-audit-readiness',
    },
  ],

  'South Africa': [
    {
      id: 'za-emp201-monthly',
      country: 'South Africa',
      authority: 'South African Revenue Service (SARS)',
      taxType: 'EMP201 (PAYE, SDL, UIF)',
      title: 'Monthly EMP201 Employer Declarations',
      frequency: 'Monthly',
      dueDayDescription: '7th of every month',
      nextDueDate: '2026-11-07',
      description: 'SARS eFiling submission for Pay-As-You-Earn, Skills Development Levy (1%), and Unemployment Insurance Fund (2%).',
      penaltyWarning: '10% penalty on total amount due plus monthly SARS interest.',
      statutoryAct: 'Tax Administration Act No. 28 of 2011',
      applicableBusinessTypes: ['All registered employers in South Africa'],
      serviceCategoryId: 'srv-payroll-pension',
    },
    {
      id: 'za-vat201-monthly',
      country: 'South Africa',
      authority: 'South African Revenue Service (SARS)',
      taxType: 'VAT201 (15%)',
      title: 'Bi-Monthly / Monthly VAT201 Declaration',
      frequency: 'Monthly',
      dueDayDescription: 'Last business day of the month',
      nextDueDate: '2026-11-30',
      description: '15% VAT returns submitted electronically via SARS eFiling.',
      penaltyWarning: '10% penalty on outstanding VAT balance plus commercial interest.',
      statutoryAct: 'Value-Added Tax Act No. 89 of 1991',
      applicableBusinessTypes: ['Vendors with taxable supplies exceeding R1M threshold'],
      serviceCategoryId: 'srv-tax-advisory',
    },
    {
      id: 'za-irp6-provisional',
      country: 'South Africa',
      authority: 'South African Revenue Service (SARS)',
      taxType: 'Provisional Tax (IRP6)',
      title: 'Bi-Annual Provisional Corporate Tax Return',
      frequency: 'Bi-Annual',
      dueDayDescription: 'August 31 & February 28',
      nextDueDate: '2027-02-28',
      description: 'First & Second period estimated corporate taxable income declarations and payments.',
      penaltyWarning: 'Up to 20% underestimation penalty under Paragraph 20 of Fourth Schedule.',
      statutoryAct: 'Income Tax Act No. 58 of 1962',
      applicableBusinessTypes: ['All South African companies and close corporations'],
      serviceCategoryId: 'srv-audit-readiness',
    },
  ],

  'UK / International': [
    {
      id: 'uk-paye-rti-monthly',
      country: 'UK / International',
      authority: 'HM Revenue & Customs (HMRC)',
      taxType: 'PAYE Real Time Information (RTI)',
      title: 'Monthly Full Payment Submission (FPS) & PAYE',
      frequency: 'Monthly',
      dueDayDescription: '22nd of the month',
      nextDueDate: '2026-11-22',
      description: 'Electronic submission of employee Income Tax and National Insurance Contributions (NICs).',
      penaltyWarning: 'Tiered HMRC penalties ranging from £100 to £400 per month based on employee count.',
      statutoryAct: 'Income Tax (Earnings and Pensions) Act 2003',
      applicableBusinessTypes: ['All UK registered employers'],
      serviceCategoryId: 'srv-payroll-pension',
    },
    {
      id: 'uk-vat-quarterly',
      country: 'UK / International',
      authority: 'HM Revenue & Customs (HMRC)',
      taxType: 'Making Tax Digital (MTD) for VAT',
      title: 'Quarterly VAT Return & Payment',
      frequency: 'Quarterly',
      dueDayDescription: '1 month and 7 days after quarter end',
      nextDueDate: '2026-12-07',
      description: 'Standard 20% VAT digital returns submitted via MTD-compliant software.',
      penaltyWarning: 'HMRC Points-based late filing penalties and financial late payment interest.',
      statutoryAct: 'Finance Act 2021 & MTD Regulations',
      applicableBusinessTypes: ['UK VAT registered businesses exceeding £90k threshold'],
      serviceCategoryId: 'srv-tax-advisory',
    },
    {
      id: 'uk-corp-tax-annual',
      country: 'UK / International',
      authority: 'HM Revenue & Customs (HMRC) & Companies House',
      taxType: 'Corporation Tax (CT600) & Annual Accounts',
      title: 'Annual Company Tax Return (CT600)',
      frequency: 'Annual',
      dueDayDescription: 'Payment: 9 months & 1 day; Return: 12 months after year end',
      nextDueDate: '2027-03-31',
      description: 'Statutory accounts submission to Companies House and CT600 computation to HMRC.',
      penaltyWarning: '£100 immediate penalty plus 10% tax surcharge after 6 months.',
      statutoryAct: 'Corporation Tax Act 2010',
      applicableBusinessTypes: ['All UK Limited Companies'],
      serviceCategoryId: 'srv-audit-readiness',
    },
  ],
};

/**
 * Calculates remaining days until deadline
 */
export function getDaysRemaining(nextDueDateStr: string): number {
  const target = new Date(nextDueDateStr);
  const now = new Date();
  target.setHours(23, 59, 59, 999);
  now.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Derives urgency tier
 */
export function getDeadlineUrgency(daysRemaining: number): {
  label: string;
  colorClass: string;
  badgeBg: string;
  isUrgent: boolean;
} {
  if (daysRemaining < 0) {
    return {
      label: 'Past Due / Overdue',
      colorClass: 'text-red-700 dark:text-red-400 font-extrabold',
      badgeBg: 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border-red-300 dark:border-red-800',
      isUrgent: true,
    };
  }
  if (daysRemaining <= 5) {
    return {
      label: `Critical: Due in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`,
      colorClass: 'text-amber-700 dark:text-amber-400 font-extrabold',
      badgeBg: 'bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      isUrgent: true,
    };
  }
  if (daysRemaining <= 14) {
    return {
      label: `Due in ${daysRemaining} days`,
      colorClass: 'text-blue-700 dark:text-blue-300 font-bold',
      badgeBg: 'bg-blue-100 text-blue-900 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      isUrgent: false,
    };
  }
  return {
    label: `Due in ${daysRemaining} days`,
    colorClass: 'text-slate-600 dark:text-slate-400 font-medium',
    badgeBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    isUrgent: false,
  };
}
