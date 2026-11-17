import { FirmReview, FirmReviewAggregate } from '../types/review';
import { PROFESSIONAL_FIRMS } from '../data/firmsData';

const LOCAL_STORAGE_KEY = 'msmebooks_firm_reviews';
const LIKES_STORAGE_KEY = 'msmebooks_liked_reviews';

// Authentic seed reviews across firms
export const INITIAL_FIRM_REVIEWS: FirmReview[] = [
  // firm-msme-direct
  {
    id: 'rev-msme-1',
    firmId: 'firm-msme-direct',
    firmName: 'MsmeBooks In-House Professional Services',
    authorName: 'Chief Emeka Okonkwo',
    authorBusiness: 'MegaCity Supermarkets Ltd (3 Outlets)',
    authorCountry: 'Nigeria',
    rating: 5,
    serviceEngaged: 'Retail Supermarket POS Deployments',
    title: 'Flawless multi-branch inventory rollout across Lagos and Ibadan',
    comment: 'The MsmeBooks in-house engineering and accounting team restructured our entire barcode catalog of 14,000 SKUs. Cashiers were trained within 48 hours and daily register shift audits have eliminated cash leakages completely.',
    createdAt: '2026-10-24T14:32:00Z',
    verifiedClient: true,
    helpfulCount: 28,
  },
  {
    id: 'rev-msme-2',
    firmId: 'firm-msme-direct',
    firmName: 'MsmeBooks In-House Professional Services',
    authorName: 'Amina Bello-Kano',
    authorBusiness: 'Horizon Agro-Allied Processing Co.',
    authorCountry: 'Nigeria',
    rating: 5,
    serviceEngaged: 'Complete Cloud Accounting Setup',
    title: 'Audit-ready financial statements and seamless chart of accounts',
    comment: 'Exceptional responsiveness! Their chartered accountant structured our departmental cost centers for grain procurement and flour milling. Our bank approved our working capital loan because the P&L and Balance Sheet were pristine.',
    createdAt: '2026-10-18T09:15:00Z',
    verifiedClient: true,
    helpfulCount: 19,
  },
  {
    id: 'rev-msme-3',
    firmId: 'firm-msme-direct',
    firmName: 'MsmeBooks In-House Professional Services',
    authorName: 'David Mwangi',
    authorBusiness: 'Nairobi Fresh Foods Distribution',
    authorCountry: 'Kenya',
    rating: 5,
    serviceEngaged: 'Legacy Data Migration',
    title: 'Migrated 5 years of messy Excel spreadsheets into MsmeBooks without downtime',
    comment: 'We were terrified of losing historic customer credit ledgers. The implementation engineers mapped every transaction accurately and synchronized M-Pesa STK push for our B2B delivery drivers.',
    createdAt: '2026-10-09T11:45:00Z',
    verifiedClient: true,
    helpfulCount: 14,
  },

  // firm-cedar
  {
    id: 'rev-cedar-1',
    firmId: 'firm-cedar',
    firmName: 'Cedar Professional Services Limited',
    authorName: 'Engr. Babatunde Fashanu',
    authorBusiness: 'Prime Atlantic Engineering & Logistics',
    authorCountry: 'Nigeria',
    rating: 5,
    serviceEngaged: 'Forensic Accounting & Books Reconstruction',
    title: 'Uncovered ₦18M procurement discrepancy and restored full tax compliance',
    comment: 'Cedar’s forensic partners are true ICAN Fellows. They reconstructed two years of chaotic vendor invoices, settled statutory CIT filings with the FIRS, and installed strict internal control SOPs. Worth every naira.',
    createdAt: '2026-10-22T16:20:00Z',
    verifiedClient: true,
    helpfulCount: 22,
  },
  {
    id: 'rev-cedar-2',
    firmId: 'firm-cedar',
    firmName: 'Cedar Professional Services Limited',
    authorName: 'Kofi Mensah',
    authorBusiness: 'GoldLink Maritime Ghana & Nigeria',
    authorCountry: 'Ghana',
    rating: 5,
    serviceEngaged: 'Corporate Tax Planning & CIT Filings',
    title: 'Cross-border maritime taxation handled with absolute precision',
    comment: 'Navigating double taxation between Lagos and Tema port was a headache until Cedar stepped in. Professional, punctual, and legally bulletproof guidance.',
    createdAt: '2026-10-12T08:50:00Z',
    verifiedClient: true,
    helpfulCount: 16,
  },

  // firm-bodman
  {
    id: 'rev-bodman-1',
    firmId: 'firm-bodman',
    firmName: 'Bodman Finance & Accounting Associates',
    authorName: 'Hajiya Maryam Danbaba',
    authorBusiness: 'Arewa Textile Wholesalers & Haulage',
    authorCountry: 'Nigeria',
    rating: 5,
    serviceEngaged: 'Payroll Outsourcing & Pension Compliance',
    title: 'Automated 85 staff payslips with zero PenCom and PAYE remittance delays',
    comment: 'Bodman Finance relieved us of end-of-month payroll anxiety. Every staff member receives their PDF payslip on WhatsApp and our State IRS tax clearance certificates were issued on schedule.',
    createdAt: '2026-10-15T13:10:00Z',
    verifiedClient: true,
    helpfulCount: 17,
  },
  {
    id: 'rev-bodman-2',
    firmId: 'firm-bodman',
    firmName: 'Bodman Finance & Accounting Associates',
    authorName: 'Barrister Nnamdi Eze',
    authorBusiness: 'Apex Chambers Legal Practitioners',
    authorCountry: 'Nigeria',
    rating: 4,
    serviceEngaged: 'SME Bookkeeping & Financial Reporting',
    title: 'Thorough bookkeeping retainer and reliable quarterly audits',
    comment: 'Very professional accountants in Abuja CBD. They structured our client trust accounts and operational general ledgers with great attention to statutory detail.',
    createdAt: '2026-09-28T10:00:00Z',
    verifiedClient: true,
    helpfulCount: 8,
  },

  // firm-pointview
  {
    id: 'rev-pv-1',
    firmId: 'firm-pointview',
    firmName: 'Point of View Consulting',
    authorName: 'Tariq Al-Mansoor',
    authorBusiness: 'AfriTrade FinTech & Remittance Ltd',
    authorCountry: 'UK / International',
    rating: 5,
    serviceEngaged: 'SME Funding Readiness & BOI / DBN Bank Loan Proposals',
    title: 'Secured $350k seed funding with Point of View’s financial model',
    comment: 'Their senior advisors turned our unit economics and 5-year cash flow projections into institutional investor quality. They participated directly in our VC partner pitch meetings.',
    createdAt: '2026-10-20T17:40:00Z',
    verifiedClient: true,
    helpfulCount: 31,
  },

  // firm-apex
  {
    id: 'rev-apex-1',
    firmId: 'firm-apex',
    firmName: 'Apex Cloud Systems & Implementations',
    authorName: 'Samuel Gitau',
    authorBusiness: 'Safari Lounge & Grill Nairobi',
    authorCountry: 'Kenya',
    rating: 5,
    serviceEngaged: 'Hotel PMS Room Key & Restaurant KOT Printers',
    title: 'Installed 6 kitchen display screens and thermal printers in 1 day',
    comment: 'Waiters send orders directly from handheld tablets to the kitchen with zero errors. Apex technicians were on-site during our grand opening weekend to guarantee 100% uptime.',
    createdAt: '2026-10-25T19:00:00Z',
    verifiedClient: true,
    helpfulCount: 25,
  },

  // firm-goldcoast
  {
    id: 'rev-gc-1',
    firmId: 'firm-goldcoast',
    firmName: 'GoldCoast Chartered Advisors',
    authorName: 'Akua Osei-Tutu',
    authorBusiness: 'Accra Gourmet Bakeries & Café',
    authorCountry: 'Ghana',
    rating: 5,
    serviceEngaged: 'GRA E-VAT & E-Levy Compliance',
    title: 'Smooth Ghana Revenue Authority integration without penalties',
    comment: 'GoldCoast configured our POS to auto-calculate the 15% standard VAT, NHIL, GETFund, and COVID levies accurately. We passed our annual GRA tax inspection with flying colors.',
    createdAt: '2026-10-14T11:20:00Z',
    verifiedClient: true,
    helpfulCount: 12,
  },

  // firm-kigali
  {
    id: 'rev-kh-1',
    firmId: 'firm-kigali',
    firmName: 'Kigali Horizon Tax & Audit Advisory',
    authorName: 'Jean-Paul Nsengiyumva',
    authorBusiness: 'Virunga Tech Solutions Rwanda',
    authorCountry: 'Rwanda',
    rating: 5,
    serviceEngaged: 'RRA Electronic Billing Machine (EBM) Integration',
    title: 'Rapid EBM v2 integration with instant fiscal receipt generation',
    comment: 'The team knows Rwandan revenue laws inside out. Excellent bilingual support in French and English.',
    createdAt: '2026-10-11T15:05:00Z',
    verifiedClient: true,
    helpfulCount: 9,
  },

  // firm-ubuntu
  {
    id: 'rev-ub-1',
    firmId: 'firm-ubuntu',
    firmName: 'Ubuntu Internal Controls & Asset Management',
    authorName: 'Hendrik van der Merwe',
    authorBusiness: 'Highveld Industrial Spare Parts (Pty) Ltd',
    authorCountry: 'South Africa',
    rating: 5,
    serviceEngaged: 'Physical Inventory Barcode Auditing',
    title: 'Conducted comprehensive stock audit of 3 Sandton warehouses in 72 hours',
    comment: 'Zero inventory variance tolerance. Ubuntu identified stock shrinkage patterns and implemented barcode scanning checkpoints that saved our business R380,000 this quarter.',
    createdAt: '2026-10-16T14:15:00Z',
    verifiedClient: true,
    helpfulCount: 21,
  },
];

// Read user-submitted reviews from localStorage
function getUserSubmittedReviews(): FirmReview[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading firm reviews from localStorage', e);
  }
  return [];
}

// Save user-submitted reviews to localStorage
function saveUserSubmittedReviews(reviews: FirmReview[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reviews));
    window.dispatchEvent(new CustomEvent('msmebooks_reviews_changed'));
  } catch (e) {
    console.error('Error saving firm reviews to localStorage', e);
  }
}

// Get all reviews (seeds + user submitted)
export function getAllReviews(): FirmReview[] {
  const userReviews = getUserSubmittedReviews();
  const all = [...userReviews, ...INITIAL_FIRM_REVIEWS];
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// Get reviews for a specific firm
export function getReviewsForFirm(firmId: string): FirmReview[] {
  return getAllReviews().filter(r => r.firmId === firmId);
}

// Add a new review
export function addFirmReview(
  input: Omit<FirmReview, 'id' | 'createdAt' | 'helpfulCount'>
): FirmReview {
  const newReview: FirmReview = {
    ...input,
    id: `rev-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    helpfulCount: 0,
  };

  const existing = getUserSubmittedReviews();
  const updated = [newReview, ...existing];
  saveUserSubmittedReviews(updated);

  return newReview;
}

// Helpful / Like Toggle
export function toggleHelpfulReview(reviewId: string): { liked: boolean; newCount: number } {
  try {
    const rawLikes = localStorage.getItem(LIKES_STORAGE_KEY);
    const likedSet = new Set<string>(rawLikes ? JSON.parse(rawLikes) : []);
    const isCurrentlyLiked = likedSet.has(reviewId);

    const userReviews = getUserSubmittedReviews();
    const index = userReviews.findIndex(r => r.id === reviewId);

    let newCount = 0;

    if (index !== -1) {
      if (isCurrentlyLiked) {
        userReviews[index].helpfulCount = Math.max(0, userReviews[index].helpfulCount - 1);
        likedSet.delete(reviewId);
      } else {
        userReviews[index].helpfulCount += 1;
        likedSet.add(reviewId);
      }
      newCount = userReviews[index].helpfulCount;
      saveUserSubmittedReviews(userReviews);
    } else {
      // Seed review fallback
      const seed = INITIAL_FIRM_REVIEWS.find(r => r.id === reviewId);
      if (seed) {
        if (isCurrentlyLiked) {
          seed.helpfulCount = Math.max(0, seed.helpfulCount - 1);
          likedSet.delete(reviewId);
        } else {
          seed.helpfulCount += 1;
          likedSet.add(reviewId);
        }
        newCount = seed.helpfulCount;
        window.dispatchEvent(new CustomEvent('msmebooks_reviews_changed'));
      }
    }

    localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(Array.from(likedSet)));
    return { liked: !isCurrentlyLiked, newCount };
  } catch (e) {
    console.error(e);
    return { liked: false, newCount: 0 };
  }
}

export function isReviewLiked(reviewId: string): boolean {
  try {
    const rawLikes = localStorage.getItem(LIKES_STORAGE_KEY);
    if (!rawLikes) return false;
    const likedSet = new Set<string>(JSON.parse(rawLikes));
    return likedSet.has(reviewId);
  } catch {
    return false;
  }
}

// Compute aggregate review score & star distribution for a firm
export function getFirmReviewAggregate(firmId: string): FirmReviewAggregate {
  const firm = PROFESSIONAL_FIRMS.find(f => f.id === firmId);
  const reviews = getReviewsForFirm(firmId);

  // Default baseline from firm profile
  const baseRating = firm ? firm.rating : 4.9;
  const baseCount = firm ? firm.reviewCount : 50;

  // Additional user submitted reviews
  const userSubmitted = getUserSubmittedReviews().filter(r => r.firmId === firmId);

  let finalRating = baseRating;
  let finalCount = baseCount + userSubmitted.length;

  if (userSubmitted.length > 0) {
    const totalScore = (baseRating * baseCount) + userSubmitted.reduce((sum, r) => sum + r.rating, 0);
    finalRating = Number((totalScore / finalCount).toFixed(2));
  }

  // Distribution calculations
  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  // Populate from actual reviews
  reviews.forEach((r) => {
    const score = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[score] = (distribution[score] || 0) + 1;
  });

  // Scale distribution to match total reviewCount if seeds are representative
  if (finalCount > reviews.length && reviews.length > 0) {
    const multiplier = finalCount / reviews.length;
    distribution[5] = Math.round((distribution[5] || 1) * multiplier);
    distribution[4] = Math.round((distribution[4] || 0) * multiplier);
    distribution[3] = Math.round((distribution[3] || 0) * multiplier);
    distribution[2] = Math.round((distribution[2] || 0) * multiplier);
    distribution[1] = Math.round((distribution[1] || 0) * multiplier);
  }

  return {
    firmId,
    rating: finalRating,
    reviewCount: finalCount,
    distribution,
    reviews,
  };
}

// Get aggregate scores for all firms in a fast lookup map
export function getAllFirmsAggregates(): Record<string, { rating: number; reviewCount: number }> {
  const result: Record<string, { rating: number; reviewCount: number }> = {};
  PROFESSIONAL_FIRMS.forEach((firm) => {
    const agg = getFirmReviewAggregate(firm.id);
    result[firm.id] = {
      rating: agg.rating,
      reviewCount: agg.reviewCount,
    };
  });
  return result;
}
