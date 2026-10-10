import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
const handlers={},stores=new Map();
class Cache{constructor(){this.rows=new Map()}async match(k){return this.rows.get(k)}async put(k,v){this.rows.set(k,v)}async keys(){return [...this.rows.keys()]}async addAll(keys){assert.equal(new Set(keys).size,keys.length);for(const k of keys)this.rows.set(k,{ok:true,clone(){return this}})}}
const caches={async open(k){if(!stores.has(k))stores.set(k,new Cache());return stores.get(k)},async keys(){return [...stores.keys()]},async delete(k){return stores.delete(k)},async match(k){for(const c of stores.values()){const v=await c.match(k);if(v)return v}}};
(await caches.open('latihku-data-v24.1.0')).put('data/3/math.json',{body:'school pack'});
(await caches.open('latihku-coloring-v24.1.0')).put('assets/coloring/page.svg',{body:'coloring page'});
(await caches.open('unrelated-app')).put('keep',{body:'unrelated'});
const c={caches,console,URL,Response,location:{origin:'https://example.test'},self:{skipWaiting:async()=>{},clients:{claim:async()=>{}},addEventListener:(name,fn)=>handlers[name]=fn},fetch:async()=>{throw new Error('offline')}};c.globalThis=c;
vm.createContext(c);c.importScripts=(...files)=>{for(const p of files)vm.runInContext(fs.readFileSync(new URL('../'+p.split('?')[0],import.meta.url),'utf8'),c)};
vm.runInContext(fs.readFileSync(new URL('../sw.js',import.meta.url),'utf8'),c);
await new Promise((resolve,reject)=>handlers.install({waitUntil:p=>p.then(resolve,reject)}));
await new Promise((resolve,reject)=>handlers.activate({waitUntil:p=>p.then(resolve,reject)}));
assert.equal((await (await caches.open('latihku-data-v24.2.0')).match('data/3/math.json')).body,'school pack');
assert.equal((await (await caches.open('latihku-coloring-v24.2.0')).match('assets/coloring/page.svg')).body,'coloring page');
assert(stores.has('unrelated-app'));assert(!stores.has('latihku-data-v24.1.0'));
console.log('Service worker checks passed: deduplicated precache and retained offline school/coloring packs.');
