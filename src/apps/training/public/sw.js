const CACHE_NAME = 'msmebooks-app-shell-v1';
const COURSES_CACHE = 'msmebooks-courses-offline-v1';
const IMAGES_CACHE = 'msmebooks-images-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

// Install: precache application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[ServiceWorker] Precache failed for some assets:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches and take control
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, COURSES_CACHE, IMAGES_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: runtime caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // 1. Navigation requests: NetworkFirst with fallback to cached shell
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html') || caches.match('/');
      })
    );
    return;
  }

  // 2. Google Fonts: CacheFirst
  if (url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com') {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // 3. Images (Unsplash, local assets): CacheFirst with Network fallback
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|svg|webp)$/i)) {
    event.respondWith(
      caches.open(IMAGES_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          return fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200 || networkResponse.type === 'opaque') {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return cached icon if available
            return caches.match('/icon.svg');
          });
        });
      })
    );
    return;
  }

  // 4. Scripts & CSS: StaleWhileRevalidate
  if (request.destination === 'script' || request.destination === 'style' || url.pathname.includes('/src/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 5. Default: Network with Cache Fallback
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Message listener for explicit course caching commands
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_COURSE_MODULES') {
    const { courseId, urls } = event.data;
    if (urls && Array.isArray(urls)) {
      caches.open(COURSES_CACHE).then((cache) => {
        return Promise.all(
          urls.map((url) => {
            return fetch(url, { mode: 'cors' }).then((res) => {
              if (res.ok || res.type === 'opaque') {
                return cache.put(url, res);
              }
            }).catch((err) => {
              console.warn('[ServiceWorker] Could not cache url:', url, err);
            });
          })
        );
      }).then(() => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ success: true, courseId });
        }
      });
    }
  }

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
