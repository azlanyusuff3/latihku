const SHELL_CACHE='latihku-shell-v22.0.0';
const DATA_CACHE='latihku-data-v22.0.0';
const COLOR_CACHE='latihku-coloring-v22.0.0';
const SHELL=['./','index.html','styles.css','config.js','smart-engine.js','pdf-pattern-engine.js','engine.js','pra-engine.js','learning-engine.js','adaptive-engine.js','visual-explain.js','coloring-data.js','app.js','manifest.json','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL_CACHE).then(c=>c.addAll(SHELL)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>![SHELL_CACHE,DATA_CACHE,COLOR_CACHE].includes(k)).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.origin!==location.origin)return;
  if(url.pathname.includes('/assets/coloring/')){
    e.respondWith(caches.open(COLOR_CACHE).then(async c=>{
      const hit=await c.match(e.request);if(hit)return hit;
      try{const res=await fetch(e.request);if(res.ok)c.put(e.request,res.clone());return res}catch{return new Response('',{status:503,statusText:'Coloring page not cached'})}
    }));return;
  }
  if(url.pathname.includes('/data/')){
    e.respondWith(caches.open(DATA_CACHE).then(async c=>{
      const hit=await c.match(e.request); if(hit)return hit;
      try{const res=await fetch(e.request);if(res.ok)c.put(e.request,res.clone());return res}catch(err){return new Response(JSON.stringify({offline:true,error:'Pack belum pernah dimuat turun pada peranti ini.'}),{status:503,headers:{'Content-Type':'application/json'}})}
    })); return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(res=>{const copy=res.clone();caches.open(SHELL_CACHE).then(c=>c.put(e.request,copy));return res}).catch(()=>caches.match('./index.html'))));
});
self.addEventListener('message',e=>{
  if(e.data?.type==='CLEAR_DATA_CACHE')e.waitUntil(caches.delete(DATA_CACHE).then(()=>e.source?.postMessage({type:'DATA_CACHE_CLEARED'})));
  if(e.data?.type==='CLEAR_COLORING_CACHE')e.waitUntil(caches.delete(COLOR_CACHE).then(()=>e.source?.postMessage({type:'COLORING_CACHE_CLEARED'})));
});
