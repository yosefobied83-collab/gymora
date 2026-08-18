const CACHE="gymora-v6-public-beta";
const ASSETS=["./","./index.html","./styles.css","./app.js","./backend.js","./supabase-config.js","./manifest.json","./favicon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>{
  if(e.request.url.includes("supabase.co") || e.request.url.includes("jsdelivr.net")) return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
