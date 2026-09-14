// Service Worker for NOIR HOOKAH PWA
const CACHE_NAME = 'noir-hookah-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // STRICT RULE: NEVER cache or intercept Firebase Auth, Firestore, Google Cloud APIs, or POST/PUT mutations
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com') ||
    url.hostname.includes('firebaseinstallations.googleapis.com') ||
    url.hostname.includes('fcmregistrations.googleapis.com') ||
    url.hostname.includes('firebasestorage.googleapis.com') ||
    url.pathname.startsWith('/api') ||
    event.request.method !== 'GET'
  ) {
    return; // Pass straight to network
  }

  // Navigation requests: Network first with cached index.html offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match('/index.html');
        return cached || new Response('Offline - Connect to network', { status: 503 });
      })
    );
    return;
  }

  // Static assets (CSS, JS, images, fonts)
  if (
    url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|webp|woff|woff2|ico)$/) ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
            return networkResponse;
          }
          const toCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, toCache);
          });
          return networkResponse;
        });
      })
    );
  }
});
