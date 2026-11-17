import { Partner } from '../types';
import { normalizeCategory, BrowsingHistoryEntry } from './browsingHistory';
import { isTopRatedPartner, isFastResponse } from '../components/PartnerCard';

import {
  UserLocationContext,
  getUserLocationContext,
  setUserLocationPreference,
} from './userLocation';

export type { UserLocationContext };
export { getUserLocationContext, setUserLocationPreference };

export interface RecommendedPartnerItem {
  partner: Partner;
  score: number;
  primaryReason: string;
  heuristicType: 'location' | 'category' | 'quality' | 'hybrid';
  reasonBadge: string;
  isLocalMatch: boolean;
  isCategoryMatch: boolean;
  matchHighlights: string[];
}

const STORAGE_HISTORY_KEY = 'msmebooks_partner_browsing_history';

/**
 * Read browsing history from local storage
 */
function getStoredHistory(): BrowsingHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Core Recommendation Heuristics Engine
 * Scores partners based on:
 * - Location proximity (User country / city match)
 * - Category browsing history & frequency of interactions
 * - Partner performance (Rating >= 4.9, Acceptance status, Platinum/Gold tier)
 * - Fast response SLA
 */
export function computeRecommendedPartners(
  allPartners: Partner[],
  options: {
    userCountry?: string;
    userCity?: string;
    activeFilterCategory?: string;
    limit?: number;
    excludePartnerId?: string;
  } = {}
): RecommendedPartnerItem[] {
  if (!allPartners || allPartners.length === 0) return [];

  const limit = options.limit || 4;
  const userLoc = getUserLocationContext(options.userCountry);
  const userCountry = (options.userCountry || userLoc.country).toLowerCase();
  const userCity = (options.userCity || userLoc.city).toLowerCase();

  const history = getStoredHistory();

  // Aggregate category interests with recency weighting
  const categoryScores: Record<string, number> = {};
  const interactedPartnerIds = new Set<string>();

  const actionWeights: Record<string, number> = {
    consultation: 5,
    contact: 5,
    compare: 3,
    view: 2,
    filter: 1,
  };

  history.forEach((entry) => {
    const cat = normalizeCategory(entry.category);
    if (cat) {
      categoryScores[cat] = (categoryScores[cat] || 0) + (actionWeights[entry.action] || 1);
    }
    if (entry.partnerId) {
      interactedPartnerIds.add(entry.partnerId);
    }
  });

  // If user has an active directory category filter, boost it
  if (options.activeFilterCategory) {
    const normalizedActive = normalizeCategory(options.activeFilterCategory);
    categoryScores[normalizedActive] = (categoryScores[normalizedActive] || 0) + 4;
  }

  // Top category by weight
  const topCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .map(([cat]) => cat);
  const primaryCategory = topCategories[0] || '';

  // Score each partner
  const scoredItems: RecommendedPartnerItem[] = allPartners
    .filter((p) => p.id !== options.excludePartnerId)
    .map((partner) => {
      let score = 0;
      const matchHighlights: string[] = [];
      let isLocalMatch = false;
      let isCategoryMatch = false;
      let primaryReason = '';
      let heuristicType: 'location' | 'category' | 'quality' | 'hybrid' = 'quality';

      const partnerCountry = partner.country.toLowerCase();
      const partnerCity = partner.city.toLowerCase();
      const partnerType = normalizeCategory(partner.partnerType);

      // Heuristic 1: Location Proximity Match
      if (userCountry && partnerCountry === userCountry) {
        score += 35;
        isLocalMatch = true;
        matchHighlights.push(`Based in ${partner.country}`);
        if (userCity && partnerCity.includes(userCity)) {
          score += 15;
          matchHighlights.push(`Local office in ${partner.city}`);
          primaryReason = `Local partner based in your city (${partner.city}, ${partner.country})`;
        } else {
          primaryReason = `In-country partner available across ${partner.country}`;
        }
        heuristicType = 'location';
      }

      // Heuristic 2: Browsing Category Affinity Match
      if (primaryCategory && partnerType.toLowerCase() === primaryCategory.toLowerCase()) {
        score += 40;
        isCategoryMatch = true;
        matchHighlights.push(`Matches ${primaryCategory}`);
        if (!primaryReason || heuristicType === 'quality') {
          primaryReason = `Matches your frequent interest in ${primaryCategory}`;
          heuristicType = 'category';
        } else {
          heuristicType = 'hybrid';
        }
      } else if (topCategories.slice(1, 3).some((c) => c.toLowerCase() === partnerType.toLowerCase())) {
        score += 20;
        isCategoryMatch = true;
        matchHighlights.push(`Related to ${partnerType}`);
      }

      // Heuristic 3: Real-time Availability & Waitlist status
      if (partner.availabilityStatus === 'Accepting New Clients') {
        score += 12;
        matchHighlights.push('Immediate availability');
      }

      // Heuristic 4: Quality & Credential Rating
      if (isTopRatedPartner(partner)) {
        score += 12;
        matchHighlights.push(`Top-Rated (${partner.rating} ★)`);
        if (!primaryReason) {
          primaryReason = `Top-rated partner with ${partner.rating} ★ client rating`;
          heuristicType = 'quality';
        }
      } else if (partner.rating >= 4.8) {
        score += 8;
        matchHighlights.push(`${partner.rating} ★ rated`);
      }

      // Heuristic 5: Tier status
      if (partner.level === 'Platinum') {
        score += 10;
        matchHighlights.push('Platinum Certified');
      } else if (partner.level === 'Gold') {
        score += 6;
      }

      // Heuristic 6: Rapid Response SLA
      if (isFastResponse(partner.responseTime)) {
        score += 8;
        matchHighlights.push(`Replies ${partner.responseTime}`);
      }

      // Heuristic 7: Re-engagement boost if interacted with before
      if (interactedPartnerIds.has(partner.id)) {
        score += 6;
        matchHighlights.push('Previously viewed');
      }

      // Format short badge label
      let reasonBadge = 'Top Recommendation';
      if (isLocalMatch && isCategoryMatch) {
        reasonBadge = 'Local Category Match';
      } else if (isLocalMatch) {
        reasonBadge = 'Location Match';
      } else if (isCategoryMatch) {
        reasonBadge = 'Category Match';
      } else if (isTopRatedPartner(partner)) {
        reasonBadge = 'Top-Rated Partner';
      }

      return {
        partner,
        score,
        primaryReason: primaryReason || `Verified ${partner.level} partner with ${partner.businessesSupported}+ businesses supported`,
        heuristicType,
        reasonBadge,
        isLocalMatch,
        isCategoryMatch,
        matchHighlights,
      };
    });

  // Sort descending by score, tiebreak by rating, reviewCount, businessesSupported
  scoredItems.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.partner.rating !== a.partner.rating) return b.partner.rating - a.partner.rating;
    if (b.partner.reviewCount !== a.partner.reviewCount) return b.partner.reviewCount - a.partner.reviewCount;
    return b.partner.businessesSupported - a.partner.businessesSupported;
  });

  return scoredItems.slice(0, limit);
}
