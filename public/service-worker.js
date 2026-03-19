// Service Worker for Hrana Mea App
const CACHE_VERSION = 'v1';
const CACHE_NAME = `hrana-mea-cache-${CACHE_VERSION}`;

// Assets to cache during installation
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/asistent.html',
  '/glycemic-tracker.html',
  '/resend-verification.html',
  '/terms-viewer.html',
  '/verify-email.html',
  '/instaleaza-app.html',
  
  // JavaScript files
  '/app.js',
  '/asistent.js',
  '/glycemic-tracker.js',
  '/healthyRecipeData.js',
  '/ocr-processor.js',
  '/ocr-test.js',
  '/redirect-glycemic.js',
  '/value-validation-server.js',
  '/value-validation.js',
  '/pwa-register.js',
  '/floating-install-button.js',
  '/add-install-link.js',
  '/test-pwa.html',
  
  // Images
  '/images/logo.png',
  '/images/favicon.ico',
  '/images/favicon-16x16.png',
  '/images/favicon-32x32.png',
  '/images/android-chrome-192x192.png',
  '/images/android-chrome-512x512.png',
  '/images/apple-touch-icon.png',
  '/images/AppleRetina167X167.png',
  '/images/WindowsTileIcon144X144.png',
  
  // Manifest
  '/manifest.json'
];

// Install event handler - cache all static assets
self.addEventListener('install', event => {
  // Skip waiting forces newly installed service worker to activate immediately
  self.skipWaiting();
  
  console.log('[Service Worker] Installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch(error => {
        console.error('[Service Worker] Install cache error:', error);
      })
  );
});

// Activate event handler - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Fetch event handler - cache-first strategy
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For HTML, always try the network first
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // If response was good, clone it and save in cache
          if (response.status === 200) {
            let responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
          }
          return response;
        })
        .catch(() => {
          // If network fails, try the cache
          return caches.match(event.request)
            .then(response => {
              return response || caches.match('/index.html');
            });
        })
    );
    return;
  }
  
  // For non-HTML requests, try the cache first, then the network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Not in cache, get from network
        return fetch(event.request)
          .then(response => {
            // If response was good, clone it and save in cache
            if (response.status === 200) {
              let responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                });
            }
            return response;
          })
          .catch(error => {
            console.error('[Service Worker] Fetch error:', error);
            // For JavaScript/CSS requests, fallback might be needed
            // but we don't return a fallback here to avoid breaking the app
          });
      })
  );
});

// Handle service worker messages
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
