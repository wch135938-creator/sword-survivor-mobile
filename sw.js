const CACHE_NAME="sword-survivor-v2";
self.addEventListener("install",e=>{
 e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(["./","./index.html","./manifest.json","./sw.js"])));
});
self.addEventListener("fetch",e=>{
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
