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