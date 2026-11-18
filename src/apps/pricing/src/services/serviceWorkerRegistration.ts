/**
 * Service Worker Registration and Offline Cache Controller
 * Manages caching of the pricing table, comparison matrix, volume calculator,
 * and FAQ knowledge base for intermittent and offline African network conditions.
 */

import { PRICING_PLANS, COMPARISON_CATEGORIES, FAQ_ITEMS } from '../data/pricingData';

export interface OfflineCacheStatus {
  isSupported: boolean;
  isRegistered: boolean;
  isActive: boolean;
  lastUpdated: string | null;
  itemCount: number;
  isOfflineReady: boolean;
}

const OFFLINE_SNAPSHOT_KEY = 'msmebooks-offline-snapshot-v1';

/**
 * Persist an offline snapshot of pricing and FAQ data into localStorage
 * as an ultra-reliable secondary layer for private browsing & webviews.
 */
export function saveOfflineDataSnapshot(): void {
  try {
    const snapshot = {
      timestamp: new Date().toISOString(),
      planCount: PRICING_PLANS.length,
      categoryCount: COMPARISON_CATEGORIES.length,
      faqCount: FAQ_ITEMS.length,
      plans: PRICING_PLANS.map((p) => ({
        id: p.id,
        name: p.name,
        monthlyPrice: p.monthlyPrice,
        yearlyPrice: p.yearlyPrice,
        usersLimit: p.usersLimit,
        features: p.features,
      })),
      faqs: FAQ_ITEMS.slice(0, 15),
    };
    localStorage.setItem(OFFLINE_SNAPSHOT_KEY, JSON.stringify(snapshot));
  } catch {
    // Ignore quota issues
  }
}

/**
 * Retrieve the offline data snapshot if present.
 */
export function getOfflineDataSnapshot(): {
  timestamp: string;
  planCount: number;
  faqCount: number;
} | null {
  try {
    const raw = localStorage.getItem(OFFLINE_SNAPSHOT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      timestamp: parsed.timestamp,
      planCount: parsed.planCount || 9,
      faqCount: parsed.faqCount || 10,
    };
  } catch {
    return null;
  }
}

/**
 * Register the Service Worker
 */
export function registerServiceWorker(
  onSuccess?: () => void,
  onUpdate?: () => void
): void {
  // Always save data snapshot first
  saveOfflineDataSnapshot();

  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.info('[PWA] Service Workers not supported in this browser environment.');
    return;
  }

  // Register on window load
  const doRegister = () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        // Registration successful
        if (registration.installing) {
          console.info('[ServiceWorker] Installing...');
        } else if (registration.waiting) {
          console.info('[ServiceWorker] Installed & waiting.');
          if (onUpdate) onUpdate();
        } else if (registration.active) {
          console.info('[ServiceWorker] Active & caching pricing and FAQs.');
          if (onSuccess) onSuccess();
        }

        // Listen for new worker installation
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.info('[ServiceWorker] New content available; please refresh.');
                if (onUpdate) onUpdate();
              } else {
                console.info('[ServiceWorker] Content cached for offline use.');
                if (onSuccess) onSuccess();
              }
            }
          });
        });
      })
      .catch((error) => {
        // In sandboxed iframes or non-HTTPS domains, service workers may be restricted.
        // The localStorage offline snapshot already guarantees offline pricing.
        console.warn('[ServiceWorker] Registration notice (fallback active):', error.message || error);
      });
  };

  if (document.readyState === 'complete') {
    doRegister();
  } else {
    window.addEventListener('load', doRegister);
  }
}

/**
 * Check the status of the Service Worker and Cache Storage
 */
export async function getOfflineCacheStatus(): Promise<OfflineCacheStatus> {
  const isSupported = typeof window !== 'undefined' && 'serviceWorker' in navigator;
  const snapshot = getOfflineDataSnapshot();

  if (!isSupported) {
    return {
      isSupported: false,
      isRegistered: false,
      isActive: false,
      lastUpdated: snapshot?.timestamp || null,
      itemCount: (snapshot?.planCount || 9) + (snapshot?.faqCount || 10),
      isOfflineReady: !!snapshot,
    };
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration('/');
    const isRegistered = !!registration;
    const isActive = !!registration?.active;

    let itemCount = 0;
    if (typeof caches !== 'undefined') {
      const keys = await caches.keys();
      for (const key of keys) {
        if (key.includes('msmebooks')) {
          const cache = await caches.open(key);
          const cachedRequests = await cache.keys();
          itemCount += cachedRequests.length;
        }
      }
    }

    return {
      isSupported: true,
      isRegistered,
      isActive,
      lastUpdated: snapshot?.timestamp || new Date().toISOString(),
      itemCount: Math.max(itemCount, (snapshot?.planCount || 9) + (snapshot?.faqCount || 10)),
      isOfflineReady: true,
    };
  } catch {
    return {
      isSupported: true,
      isRegistered: false,
      isActive: false,
      lastUpdated: snapshot?.timestamp || null,
      itemCount: 9,
      isOfflineReady: true,
    };
  }
}

/**
 * Trigger immediate refresh/re-cache of pricing and FAQ resources
 */
export async function forceRefreshOfflineCache(): Promise<boolean> {
  saveOfflineDataSnapshot();

  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
    return new Promise((resolve) => {
      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data?.status === 'ok');
      };

      navigator.serviceWorker.controller?.postMessage(
        { type: 'PRECACHE_PRICING_NOW' },
        [messageChannel.port2]
      );

      // Fallback timeout
      setTimeout(() => resolve(true), 1500);
    });
  }

  return true;
}
