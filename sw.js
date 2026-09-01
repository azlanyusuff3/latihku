const CORE='latihku-v3-core-1';
const DATA='latihku-v3-data-1';
const CORE_FILES=['./','index.html','styles.css','config.js','engine.js','app.js','manifest.json','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CORE).then(c=>c.addAll(CORE_FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>!([CORE,DATA].includes(k))).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url); if(e.request.method!=='GET'||u.origin!==location.origin)return;
  if(u.pathname.includes('/data/')){
    e.respondWith(caches.open(DATA).then(async c=>{const hit=await c.match(e.request);if(hit)return hit;try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}catch(err){return hit||new Response(JSON.stringify({questions:[]}),{headers:{'Content-Type':'application/json'},status:503})}})); return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok){const clone=r.clone();caches.open(CORE).then(c=>c.put(e.request,clone))}return r})));
});
self.addEventListener('message',e=>{
  if(e.data?.type==='CLEAR_DATA_CACHE')e.waitUntil(caches.delete(DATA));
  if(e.data?.type==='SKIP_WAITING')self.skipWaiting();
});
