importScripts('./version.js');
const RELEASE=globalThis.LATIH_VERSION;
const SHELL_CACHE=`latihku-shell-v${RELEASE}`;
const DATA_CACHE=`latihku-data-v${RELEASE}`;
const COLOR_CACHE=`latihku-coloring-v${RELEASE}`;
const SHELL=['./','index.html','styles.css','v24.css','version.js','config.js','state-helpers.js','smart-engine.js','pdf-pattern-engine.js','engine.js','pra-engine.js','learning-engine.js','adaptive-engine.js','visual-explain.js','coloring-data.js','app.js','manifest.json','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL_CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('latihku-')&&![SHELL_CACHE,DATA_CACHE,COLOR_CACHE].includes(k)).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);if(url.origin!==location.origin)return;
  if(url.pathname.includes('/assets/coloring/')||url.pathname.includes('/data/')){
    const name=url.pathname.includes('/data/')?DATA_CACHE:COLOR_CACHE;
    e.respondWith((async()=>{const c=await caches.open(name),hit=await c.match(e.request);if(hit)return hit;
      try{const res=await fetch(e.request);if(res.ok)await c.put(e.request,res.clone());return res}
      catch{return new Response('Offline asset unavailable',{status:503})}
    })());return;
  }
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request).catch(()=>caches.match('./index.html')));return;
  }
  e.respondWith((async()=>{const c=await caches.open(SHELL_CACHE),hit=await c.match(e.request);if(hit)return hit;
    try{const res=await fetch(e.request);if(res.ok)await c.put(e.request,res.clone());return res}
    catch{return new Response('Offline asset unavailable',{status:503})}
  })());
});
