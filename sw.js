const SHELL='latihku-v7-shell-1';
const DATA='latihku-v7-data-1';
const SHELL_FILES=['./','index.html','styles.css','config.js','engine.js','app.js','manifest.json','icons/icon-192.png','icons/icon-512.png','assets/onboarding.webp'];
self.addEventListener('install',e=>e.waitUntil(caches.open(SHELL).then(c=>c.addAll(SHELL_FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==SHELL&&k!==DATA).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin!==location.origin)return;
  if(url.pathname.includes('/data/')){
    e.respondWith(caches.open(DATA).then(async c=>{const hit=await c.match(e.request);if(hit)return hit;try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r}catch{return new Response(JSON.stringify({questions:[]}),{status:503,headers:{'Content-Type':'application/json'}})}}));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{const copy=r.clone();caches.open(SHELL).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match('index.html'))));
});
self.addEventListener('message',e=>{if(e.data?.type==='CLEAR_DATA_CACHE')e.waitUntil(caches.delete(DATA))});
