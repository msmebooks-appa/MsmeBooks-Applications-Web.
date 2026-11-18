import { Partner } from '../types';

export interface QrResolutionResult {
  partner: Partner | null;
  rawData: string;
  matchType: 'id' | 'slug' | 'url' | 'json' | 'name' | 'none';
  confidence: 'high' | 'medium' | 'low' | 'none';
}

/**
 * Generates an official MsmeBooks registry verification URL for QR codes.
 */
export function generatePartnerQRUrl(partner: Partner): string {
  return `https://www.msmebooks.org/partners/${partner.slug}?id=${encodeURIComponent(partner.id)}&level=${encodeURIComponent(partner.level)}&verified=true`;
}

/**
 * Generates standard JSON payload for conference badges and NFC/QR tags.
 */
export function generatePartnerQrPayload(partner: Partner): string {
  return JSON.stringify({
    org: 'MsmeBooks',
    registry: 'Certified Partners',
    id: partner.id,
    slug: partner.slug,
    name: partner.name,
    level: partner.level,
    country: partner.country,
    verified: partner.verified,
    url: generatePartnerQRUrl(partner),
  });
}

/**
 * Resolves a partner from any scanned QR text, URL, business card payload, or ID.
 */
export function resolvePartnerFromScannedText(text: string, partners: Partner[]): QrResolutionResult {
  const clean = text.trim();
  if (!clean) {
    return { partner: null, rawData: text, matchType: 'none', confidence: 'none' };
  }

  // 1. Check if the scanned string is JSON
  if ((clean.startsWith('{') && clean.endsWith('}')) || (clean.startsWith('[') && clean.endsWith(']'))) {
    try {
      const parsed = JSON.parse(clean);
      const targetId = parsed.id || parsed.partnerId || parsed.partner_id;
      const targetSlug = parsed.slug || parsed.partnerSlug;
      const targetName = parsed.name || parsed.partnerName;

      if (targetId) {
        const found = partners.find(p => p.id.toLowerCase() === String(targetId).toLowerCase());
        if (found) return { partner: found, rawData: text, matchType: 'json', confidence: 'high' };
      }

      if (targetSlug) {
        const found = partners.find(p => p.slug.toLowerCase() === String(targetSlug).toLowerCase());
        if (found) return { partner: found, rawData: text, matchType: 'json', confidence: 'high' };
      }

      if (targetName) {
        const found = partners.find(p => p.name.toLowerCase() === String(targetName).toLowerCase());
        if (found) return { partner: found, rawData: text, matchType: 'json', confidence: 'high' };
      }
    } catch {
      // not valid JSON, continue with URL and string matching
    }
  }

  // 2. Check if the scanned string is a URL
  try {
    const url = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
    const searchParams = url.searchParams;
    const idParam = searchParams.get('id') || searchParams.get('partner') || searchParams.get('partnerId') || searchParams.get('code');
    const slugParam = searchParams.get('slug');

    if (idParam) {
      const found = partners.find(p => p.id.toLowerCase() === idParam.toLowerCase());
      if (found) return { partner: found, rawData: text, matchType: 'url', confidence: 'high' };
    }

    if (slugParam) {
      const found = partners.find(p => p.slug.toLowerCase() === slugParam.toLowerCase());
      if (found) return { partner: found, rawData: text, matchType: 'url', confidence: 'high' };
    }

    // Inspect pathname segments e.g. /partners/msmebooks-business-solutions-lagos or /partners/p-01
    const segments = url.pathname.split('/').filter(Boolean);
    for (const segment of segments) {
      const segLower = segment.toLowerCase();
      const matchBySlug = partners.find(p => p.slug.toLowerCase() === segLower);
      if (matchBySlug) return { partner: matchBySlug, rawData: text, matchType: 'url', confidence: 'high' };

      const matchById = partners.find(p => p.id.toLowerCase() === segLower);
      if (matchById) return { partner: matchById, rawData: text, matchType: 'url', confidence: 'high' };
    }
  } catch {
    // Not a valid URL, proceed to direct string matching
  }

  // 3. Direct match on partner ID (e.g., "p-01", "P-01", "p-14")
  const directIdMatch = partners.find(p => p.id.toLowerCase() === clean.toLowerCase());
  if (directIdMatch) {
    return { partner: directIdMatch, rawData: text, matchType: 'id', confidence: 'high' };
  }

  // 4. Custom URI scheme match (e.g. "msmebooks:partner:p-01" or "msmebooks://partner/p-01")
  const uriMatch = clean.match(/msmebooks:(?:partner|id):([a-z0-9-_]+)/i);
  if (uriMatch && uriMatch[1]) {
    const term = uriMatch[1].toLowerCase();
    const found = partners.find(p => p.id.toLowerCase() === term || p.slug.toLowerCase() === term);
    if (found) {
      return { partner: found, rawData: text, matchType: 'id', confidence: 'high' };
    }
  }

  // 5. Direct match on partner slug
  const directSlugMatch = partners.find(p => p.slug.toLowerCase() === clean.toLowerCase());
  if (directSlugMatch) {
    return { partner: directSlugMatch, rawData: text, matchType: 'slug', confidence: 'high' };
  }

  // 6. Direct match on partner Name (exact or trimmed)
  const directNameMatch = partners.find(p => p.name.toLowerCase() === clean.toLowerCase());
  if (directNameMatch) {
    return { partner: directNameMatch, rawData: text, matchType: 'name', confidence: 'high' };
  }

  // 7. Substring contains partner ID or Slug within longer text (e.g. business card text blocks)
  const cleanLower = clean.toLowerCase();
  for (const partner of partners) {
    // Check if the card text explicitly includes the partner ID formatted as a distinct token
    const idRegex = new RegExp(`\\b${partner.id.toLowerCase()}\\b`, 'i');
    if (idRegex.test(cleanLower)) {
      return { partner, rawData: text, matchType: 'id', confidence: 'medium' };
    }

    if (cleanLower.includes(partner.slug.toLowerCase())) {
      return { partner, rawData: text, matchType: 'slug', confidence: 'medium' };
    }
  }

  // 8. Name fuzzy/includes match
  for (const partner of partners) {
    if (cleanLower.includes(partner.name.toLowerCase()) || partner.name.toLowerCase().includes(cleanLower)) {
      return { partner, rawData: text, matchType: 'name', confidence: 'low' };
    }
  }

  return { partner: null, rawData: text, matchType: 'none', confidence: 'none' };
}

/**
 * Plays a short, pleasant auditory chime and mobile vibration when a partner QR code is recognized.
 */
export function playScanChime(success: boolean = true): void {
  try {
    // Vibration feedback on supported mobile devices
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      if (success) {
        navigator.vibrate([40, 30, 80]);
      } else {
        navigator.vibrate([100]);
      }
    }

    // Audio synthesizer chime using Web Audio API
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    if (success) {
      // Upbeat two-tone chime (D5 -> A5)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } else {
      // Subtle lower tone
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch {
    // Silently continue if audio permissions or browser audio is disabled
  }
}
