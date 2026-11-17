/**
 * MsmeBooks Service Worker
 * Specialized for offline caching of the Pricing Table, Plan Comparison Matrix,
 * Volume Calculator, and FAQ Knowledge Base on intermittent African networks.
 */

const CACHE_NAME = 'msmebooks-pricing-v1';
const DATA_CACHE_NAME = 'msmebooks-data-v1';

// Critical core assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
];

// Install: Cache critical core assets and take control immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
      .catch((err) => {
        console.warn('[ServiceWorker] Precache failed, will cache on fetch:', err);
      })
  );
});

// Activate: Clean up previous cache versions and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => {
            if (name !== CACHE_NAME && name !== DATA_CACHE_NAME) {
              return caches.delete(name);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Helper: Determine if request is a navigation (HTML document)
function isNavigationRequest(request) {
  return request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

// Helper: Determine if request is an external API or exchange rate fetch
function isApiRequest(url) {
  return url.includes('api.exchangerate-api.com') || url.includes('/api/') || url.includes('ipapi.co');
}

// Helper: Determine if request is static asset (JS, CSS, fonts, images)
function isStaticAsset(url) {
  return (
    url.endsWith('.js') ||
    url.endsWith('.css') ||
    url.endsWith('.svg') ||
    url.endsWith('.png') ||
    url.endsWith('.jpg') ||
    url.endsWith('.woff2') ||
    url.endsWith('.woff') ||
    url.includes('fonts.googleapis.com') ||
    url.includes('fonts.gstatic.com') ||
    url.includes('/assets/')
  );
}

// Fetch event listener with robust multi-tier fallback strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = request.url;

  // Ignore non-GET requests or browser extension schemes
  if (request.method !== 'GET' || !url.startsWith('http')) {
    return;
  }

  // 1. Navigation requests (HTML): Network-First with quick 2.5s timeout, falling back to cached index.html
  if (isNavigationRequest(request)) {
    event.respondWith(
      new Promise((resolve) => {
        const timeoutId = setTimeout(() => {
          // If network is hanging (slow 2G / intermittent), serve from cache
          caches.match('/index.html').then((cached) => {
            if (cached) resolve(cached);
          });
        }, 2500);

        fetch(request)
          .then((networkResponse) => {
            clearTimeout(timeoutId);
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
                cache.put('/index.html', networkResponse.clone());
              });
            }
            resolve(networkResponse);
          })
          .catch(() => {
            clearTimeout(timeoutId);
            // Network failed: Serve cached HTML
            caches.match(request).then((cached) => {
              if (cached) {
                resolve(cached);
              } else {
                caches.match('/index.html').then((indexCached) => {
                  resolve(indexCached || new Response('Offline: Pricing & FAQs cached locally.', {
                    status: 200,
                    headers: { 'Content-Type': 'text/html' },
                  }));
                });
              }
            });
          });
      })
    );
    return;
  }

  // 2. API / Currency requests: Stale-While-Revalidate with Cache Fallback
  if (isApiRequest(url)) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              // Return cached response when network fails
              return cachedResponse;
            });

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. Static Assets (Scripts, Styles, Fonts, Images): Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to update cache
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Background fetch failed, user is offline; cached response already served safely
          });
        return cachedResponse;
      }

      // Not in cache: fetch from network and cache
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque' && !isStaticAsset(url)) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // If offline and request is an image, could return fallback or 200 placeholder
          return new Response('', { status: 408, statusText: 'Request timed out / Offline' });
        });
    })
  );
});

// Client messaging for cache monitoring and manual sync triggers
self.addEventListener('message', (event) => {
  const data = event.data;

  if (!data) return;

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (data.type === 'PRECACHE_PRICING_NOW') {
    // Manually ensure pricing and FAQ core paths are preserved in cache
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(PRECACHE_ASSETS).then(() => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ status: 'ok', cachedAt: new Date().toISOString() });
        }
      });
    });
  }

  if (data.type === 'CHECK_CACHE_STATUS') {
    caches.open(CACHE_NAME).then((cache) => {
      cache.keys().then((keys) => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({
            status: 'ok',
            cachedCount: keys.length,
            cacheName: CACHE_NAME,
          });
        }
      });
    });
  }
});
