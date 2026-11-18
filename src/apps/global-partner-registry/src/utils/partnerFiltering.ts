import { FilterState, Partner } from '../types';
import { QUICK_FILTER_TAGS } from '../components/QuickFilterChips';
import { calculateDistanceKm, getPartnerCoordinates } from './geoCoordinates';

export type SmartSortMode = 'distance' | 'impact';

export interface SmartSortOptions {
  enabled: boolean;
  mode: SmartSortMode;
  userCoords?: { lat: number; lng: number } | null;
}

export interface PartnerFilterOptions {
  viewFavoritesOnly?: boolean;
  favoritePartnerIds?: string[];
  smartSort?: SmartSortOptions;
}

/**
 * Computes a deterministic verified 'Success Impact' score (0-100) from partner metrics:
 * - Businesses supported (up to 35 pts)
 * - Projects completed (up to 25 pts)
 * - Client rating & review volume (up to 22 pts)
 * - Verification, tier accreditation & certification authorities (up to 18 pts)
 */
export function calculateSuccessImpactScore(partner: Partner): number {
  const businessesPts = Math.min(35, Math.round(((partner.businessesSupported || 0) / 300) * 35));
  const projectsPts = Math.min(25, Math.round(((partner.projectsCompleted || 0) / 400) * 25));
  const ratingPts = Math.min(15, Math.round(Math.max(0, (partner.rating || 4.0) - 4.0) * 15));
  const reviewPts = Math.min(7, Math.round(((partner.reviewCount || 0) / 80) * 7));

  const levelBonus: Record<string, number> = {
    Platinum: 8,
    Gold: 6,
    Silver: 4,
    Bronze: 2,
  };
  const verifiedPts = partner.verified ? 6 : 2;
  const tierPts = levelBonus[partner.level] || 2;
  const certPts = Math.min(4, partner.certificationAuthorities?.length || partner.certifications?.length || 1);

  return Math.min(100, Math.max(1, businessesPts + projectsPts + ratingPts + reviewPts + verifiedPts + tierPts + certPts));
}

export function getPartnerDistanceKm(
  partner: Partner,
  userCoords: { lat: number; lng: number }
): number {
  const coords = getPartnerCoordinates(partner);
  return calculateDistanceKm(userCoords.lat, userCoords.lng, coords.lat, coords.lng);
}

export function filterAndSortPartners(
  partners: Partner[],
  filters: FilterState,
  options?: PartnerFilterOptions
): Partner[] {
  const viewFavoritesOnly = Boolean(options?.viewFavoritesOnly);
  const favoritePartnerIds = options?.favoritePartnerIds || [];
  const smartSort = options?.smartSort;

  return partners
    .filter((p) => {
      // Search query match
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCity = p.city.toLowerCase().includes(q);
        const matchesCountry = p.country.toLowerCase().includes(q);
        const matchesType = p.partnerType.toLowerCase().includes(q);
        const matchesSpecialties = p.specialties.some((s) => s.toLowerCase().includes(q));
        const matchesServices = p.services.some((s) => s.toLowerCase().includes(q));
        const matchesIndustries = p.industries.some((s) => s.toLowerCase().includes(q));
        if (
          !matchesName &&
          !matchesCity &&
          !matchesCountry &&
          !matchesType &&
          !matchesSpecialties &&
          !matchesServices &&
          !matchesIndustries
        ) {
          return false;
        }
      }

      // Country match
      if (filters.country && p.country.toLowerCase() !== filters.country.toLowerCase()) {
        return false;
      }

      // City match
      if (filters.city && !p.city.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }

      // Partner Type match
      if (filters.partnerType && p.partnerType.toLowerCase() !== filters.partnerType.toLowerCase()) {
        return false;
      }

      // Industry match
      if (filters.industry && !p.industries.some((i) => i.toLowerCase().includes(filters.industry.toLowerCase()))) {
        return false;
      }

      // Service match
      if (filters.service && !p.services.some((s) => s.toLowerCase().includes(filters.service.toLowerCase()))) {
        return false;
      }

      // Partner Level match
      if (filters.level && p.level.toLowerCase() !== filters.level.toLowerCase()) {
        return false;
      }

      // Language match
      if (filters.language && !p.languages.some((l) => l.toLowerCase() === filters.language.toLowerCase())) {
        return false;
      }

      // Business Size match
      if (filters.businessSize && !p.businessSizeCoverage.includes(filters.businessSize as any)) {
        return false;
      }

      // Remote Support only
      if (filters.remoteOnly && !p.remoteSupport) {
        return false;
      }

      // Verified only
      if (filters.verifiedOnly && !p.verified) {
        return false;
      }

      // Availability status match
      if (filters.availability && p.availabilityStatus !== filters.availability) {
        return false;
      }

      // Success Story Implementation Scale match
      if (filters.successStoryScale) {
        const hasMatchingScale =
          p.clientSuccessStories &&
          p.clientSuccessStories.some((story) => story.implementationScale === filters.successStoryScale);
        if (!hasMatchingScale) {
          return false;
        }
      }

      // Skill / Expertise match (specialties or services)
      if (filters.skill) {
        const qSkill = filters.skill.toLowerCase().trim();
        const matchesSkill =
          p.specialties.some((s) => s.toLowerCase() === qSkill || s.toLowerCase().includes(qSkill)) ||
          p.services.some((s) => s.toLowerCase() === qSkill || s.toLowerCase().includes(qSkill));
        if (!matchesSkill) return false;
      }

      // Quick filter tags
      if (filters.quickFilters && filters.quickFilters.length > 0) {
        const matchesAllQuickFilters = filters.quickFilters.every((tagId) => {
          const config = QUICK_FILTER_TAGS.find((t) => t.id === tagId);
          return config ? config.predicate(p) : true;
        });
        if (!matchesAllQuickFilters) return false;
      }

      // Favorites filter toggle
      if (viewFavoritesOnly && !favoritePartnerIds.includes(p.id)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (smartSort?.enabled) {
        const userCoords = smartSort.userCoords;
        if (smartSort.mode === 'distance' && userCoords) {
          const distA = getPartnerDistanceKm(a, userCoords);
          const distB = getPartnerDistanceKm(b, userCoords);
          if (Math.abs(distA - distB) > 0.05) {
            return distA - distB;
          }
          // Tie-breaker: verified Success Impact score
          return calculateSuccessImpactScore(b) - calculateSuccessImpactScore(a);
        }

        // Impact-based ranking (or fallback when coordinates unavailable)
        const impactDiff = calculateSuccessImpactScore(b) - calculateSuccessImpactScore(a);
        if (impactDiff !== 0) {
          return impactDiff;
        }
        if (userCoords) {
          const distA = getPartnerDistanceKm(a, userCoords);
          const distB = getPartnerDistanceKm(b, userCoords);
          if (Math.abs(distA - distB) > 0.05) {
            return distA - distB;
          }
        }
        return b.rating - a.rating;
      }

      if (filters.sortBy === 'rating') {
        const ratingDiff = b.rating - a.rating;
        if (ratingDiff !== 0) return ratingDiff;
        return b.reviewCount - a.reviewCount;
      }
      if (filters.sortBy === 'businesses') {
        const busDiff = b.businessesSupported - a.businessesSupported;
        if (busDiff !== 0) return busDiff;
        return b.rating - a.rating;
      }
      if (filters.sortBy === 'experience') {
        const expDiff = b.yearsExperience - a.yearsExperience;
        if (expDiff !== 0) return expDiff;
        const busDiff = b.businessesSupported - a.businessesSupported;
        if (busDiff !== 0) return busDiff;
        return b.rating - a.rating;
      }
      // Default: recommended (platinum first, then gold, rating)
      const levelRank: Record<string, number> = { Platinum: 4, Gold: 3, Silver: 2, Bronze: 1 };
      const diff = (levelRank[b.level] || 0) - (levelRank[a.level] || 0);
      if (diff !== 0) return diff;
      return b.rating - a.rating;
    });
}
