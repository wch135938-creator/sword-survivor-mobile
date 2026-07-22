const VERSION = 'V2.7.4_fix8';
const CACHE = 'sword-survivor-v2.7.4-fix8';
const ASSETS = [
  './',
  './index.html?v=2.7.4_fix8',
  './manifest.json?v=2.7.4_fix8',
  './VERSION.txt?v=2.7.4_fix8',
  './bgm.mp3?v=2.7.4_fix8',
  './boss-bgm.mp3?v=2.7.4_fix8'
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
      if (isNavigation) return caches.match('./index.html?v=2.7.4_fix8');
      throw error;
    }
  })());
});
