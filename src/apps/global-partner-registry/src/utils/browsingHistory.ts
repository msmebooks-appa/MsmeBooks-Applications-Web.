import { useState, useEffect } from 'react';
import { Partner } from '../types';
import { isTopRatedPartner } from '../components/PartnerCard';

const STORAGE_KEY = 'msmebooks_partner_browsing_history';
const EVENT_NAME = 'msmebooks-history-updated';

export interface BrowsingHistoryEntry {
  partnerId: string;
  partnerName: string;
  category: string;
  timestamp: number;
  action: 'view' | 'consultation' | 'contact' | 'compare' | 'filter';
}

export function normalizeCategory(category: string): string {
  if (!category) return '';
  const trimmed = category.trim();
  if (trimmed.toLowerCase() === 'accounting firm') return 'Accounting Firms';
  return trimmed;
}

function getStoredHistory(): BrowsingHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to read browsing history from localStorage', e);
    return [];
  }
}

function saveHistory(entries: BrowsingHistoryEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-50)));
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (e) {
    console.warn('Failed to save browsing history to localStorage', e);
  }
}

/**
 * Clear stored browsing history
 */
export function clearBrowsingHistory() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  } catch (e) {
    console.warn('Failed to clear browsing history', e);
  }
}

/**
 * Check if user has any recorded browsing history
 */
export function hasBrowsingHistory(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0;
  } catch {
    return false;
  }
}

/**
 * Record when a user interacts with a partner (view profile, request consultation, contact, compare)
 */
export function recordPartnerInteraction(
  partner: Partner,
  action: 'view' | 'consultation' | 'contact' | 'compare'
) {
  if (!partner || !partner.partnerType) return;
  const history = getStoredHistory();
  const entry: BrowsingHistoryEntry = {
    partnerId: partner.id,
    partnerName: partner.name,
    category: normalizeCategory(partner.partnerType),
    timestamp: Date.now(),
    action,
  };
  history.push(entry);
  saveHistory(history);
}

/**
 * Record when a user explicitly filters by category or partner type
 */
export function recordCategoryFilter(category: string) {
  if (!category) return;
  const history = getStoredHistory();
  const entry: BrowsingHistoryEntry = {
    partnerId: '',
    partnerName: '',
    category: normalizeCategory(category),
    timestamp: Date.now(),
    action: 'filter',
  };
  history.push(entry);
  saveHistory(history);
}

/**
 * Determine the user's category of most active interest based on their browsing history.
 */
export function getActiveInterestCategory(
  allPartners: Partner[],
  activeFilterCategory?: string
): {
  category: string;
  interactionCount: number;
  isDefault: boolean;
  recentPartnerNames: string[];
} {
  const history = getStoredHistory();
  const categoryScores: Record<string, { score: number; count: number; lastTime: number; partnerNames: Set<string> }> = {};

  // Weight actions: consultation/contact (5) > compare (3) > view profile (2) > filter (1)
  const actionWeights: Record<string, number> = {
    consultation: 5,
    contact: 5,
    compare: 3,
    view: 2,
    filter: 1,
  };

  history.forEach((entry) => {
    const cat = normalizeCategory(entry.category);
    if (!cat) return;
    if (!categoryScores[cat]) {
      categoryScores[cat] = { score: 0, count: 0, lastTime: 0, partnerNames: new Set() };
    }
    const weight = actionWeights[entry.action] || 1;
    categoryScores[cat].score += weight;
    categoryScores[cat].count += 1;
    if (entry.timestamp > categoryScores[cat].lastTime) {
      categoryScores[cat].lastTime = entry.timestamp;
    }
    if (entry.partnerName) {
      categoryScores[cat].partnerNames.add(entry.partnerName);
    }
  });

  // If user has an active directory filter, give it strong boost
  if (activeFilterCategory) {
    const normalizedFilter = normalizeCategory(activeFilterCategory);
    if (!categoryScores[normalizedFilter]) {
      categoryScores[normalizedFilter] = { score: 0, count: 0, lastTime: Date.now(), partnerNames: new Set() };
    }
    categoryScores[normalizedFilter].score += 4;
  }

  const sortedCategories = Object.entries(categoryScores).sort((a, b) => {
    if (b[1].score !== a[1].score) {
      return b[1].score - a[1].score;
    }
    return b[1].lastTime - a[1].lastTime;
  });

  if (sortedCategories.length > 0) {
    const [topCat, data] = sortedCategories[0];
    return {
      category: topCat,
      interactionCount: data.count,
      isDefault: false,
      recentPartnerNames: Array.from(data.partnerNames),
    };
  }

  // Intelligent fallback if no browsing history exists yet:
  // Pick the category with the most partners and highest average rating
  const fallbackCat = 'Accounting Firms';
  return {
    category: fallbackCat,
    interactionCount: 0,
    isDefault: true,
    recentPartnerNames: [],
  };
}

/**
 * Retrieve partners in the specified category, prioritized by Top-Rated status and rating.
 */
export function getTopRatedPartnersForCategory(
  category: string,
  allPartners: Partner[],
  limit = 3
): Partner[] {
  if (!allPartners || allPartners.length === 0) return [];
  const normalizedTarget = normalizeCategory(category).toLowerCase();

  // Exact category type matches first
  const exactMatches = allPartners.filter((p) => {
    const cat = normalizeCategory(p.partnerType).toLowerCase();
    return cat === normalizedTarget;
  });

  // Secondary matches based on category keywords
  const secondaryMatches = allPartners.filter((p) => {
    if (exactMatches.some(em => em.id === p.id)) return false;
    const cat = normalizeCategory(p.partnerType).toLowerCase();
    if (normalizedTarget.includes('accounting') && cat.includes('accounting')) return true;
    if (normalizedTarget.includes('pos') && (cat.includes('pos') || p.specialties.some(s => s.toLowerCase().includes('pos')))) return true;
    if (normalizedTarget.includes('audit') && cat.includes('audit')) return true;
    if (normalizedTarget.includes('sme') && (cat.includes('sme') || cat.includes('advisory'))) return true;
    if (normalizedTarget.includes('tech') && cat.includes('tech')) return true;
    return false;
  });

  const sortPartners = (list: Partner[]) => {
    return [...list].sort((a, b) => {
      const aTop = isTopRatedPartner(a) ? 1 : 0;
      const bTop = isTopRatedPartner(b) ? 1 : 0;
      if (bTop !== aTop) return bTop - aTop;
      if (b.rating !== a.rating) return b.rating - a.rating;
      if (b.reviewCount !== a.reviewCount) return b.reviewCount - a.reviewCount;
      return b.businessesSupported - a.businessesSupported;
    });
  };

  const sortedExact = sortPartners(exactMatches);
  const sortedSecondary = sortPartners(secondaryMatches);
  const combined = [...sortedExact, ...sortedSecondary];

  const finalMatches = combined.length > 0 ? combined : sortPartners(allPartners);
  return finalMatches.slice(0, limit);
}

/**
 * React hook to observe active category interest and reactively update
 */
export function useBrowsingInterest(
  allPartners: Partner[],
  activeFilterCategory?: string
) {
  const [interest, setInterest] = useState(() =>
    getActiveInterestCategory(allPartners, activeFilterCategory)
  );

  useEffect(() => {
    const updateInterest = () => {
      setInterest(getActiveInterestCategory(allPartners, activeFilterCategory));
    };

    updateInterest();
    window.addEventListener(EVENT_NAME, updateInterest);
    return () => {
      window.removeEventListener(EVENT_NAME, updateInterest);
    };
  }, [allPartners, activeFilterCategory]);

  return interest;
}
