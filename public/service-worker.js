const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/index.js',
    '/style.css',
    '/db.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'
];

const CACHE_NAME = 'static-cache-v1';
const RUNTIME_CACHE = 'runtime-cache';

//install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

////activate, service worker comes to life and cleans up old caches
self.addEventListener('activate', event => {
    const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
    event.waitUntil(
        caches  
            .keys()
            .then((cacheNames) => {
                return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cacheToDelete) => {
                        return caches.delete(cacheToDelete);
                    })
                );
            })
            .then(() => self.ClientRectList.claim())
    );
});

//fetch, listen for certain calls out to API's, if response is good return it, otherwise see if it is in the cache and return it instead of 400
self.addEventListener('fetch', (event) => {
    if(event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches
            .match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return caches
                .open(RUNTIME_CACHE)
                .then((cache) => {
                    return fetch(event.request)
                    .then((response) => {
                        return cache
                        .put(event.request, response.clone())
                        .then(() => {
                            return response;
                        });
                    });
                });
            })
        );
    }
});