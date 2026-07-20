const CACHE='sword-survivor-v2.2';
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE)));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request)));
