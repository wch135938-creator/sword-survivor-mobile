const VERSION = 'V2.7.4_fix5';
const CACHE = 'sword-survivor-v2.7.4-fix5';
const ASSETS = [
  './',
  './index.html?v=2.7.4_fix5',
  './manifest.json?v=2.7.4_fix5',
  './VERSION.txt?v=2.7.4_fix5'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name !== CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  const isNavigation = event.request.mode === 'navigate';
  const isSameOrigin = requestUrl.origin === self.location.origin;
  if (!isSameOrigin) return;

  event.respondWith((async () => {
    try {
      const response = await fetch(event.request, { cache: 'no-store' });
      const cache = await caches.open(CACHE);
      cache.put(event.request, response.clone());
      return response;
    } catch (error) {
      const cached = await caches.match(event.request);
      if (cached) return cached;
      if (isNavigation) return caches.match('./index.html?v=2.7.4_fix5');
      throw error;
    }
  })());
});
