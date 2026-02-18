// MGS Arts Portal - Service Worker
const CACHE_NAME = 'mgs-arts-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/data.js',
    '/js/app.js',
    '/manifest.json',
    '/assets/favicon.svg',
    '/assets/icon-192.svg',
    '/assets/icon-512.svg'
];

// Install event - cache assets and activate immediately
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Fetch event - network first, fall back to cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Got a valid network response - cache it for offline use
                if (response && response.status === 200 && response.type === 'basic') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                }
                return response;
            })
            .catch(() => {
                // Network failed - serve from cache as offline fallback
                return caches.match(event.request);
            })
    );
});

// Activate event - clean up old caches and take control immediately
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});
