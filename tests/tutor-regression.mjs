import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const c={console,Math,Date};c.window=c;c.globalThis=c;c.fetch=async url=>({ok:true,json:async()=>JSON.parse(read(url))});vm.createContext(c);
for(const f of ['version.js','config.js','state-helpers.js','smart-engine.js','pdf-pattern-engine.js','year2-math-engine.js','engine.js','learning-engine.js','adaptive-engine.js'])vm.runInContext(read(f),c);
const E=c.LATIH_ENGINE,A=c.LATIH_ADAPTIVE,L=c.LATIH_LEARNING;let topics=0;
for(const [subject,meta] of Object.entries(c.LATIH_CONFIG.subjects)){
 if(['math','pra'].includes(subject))continue;
 for(const level of meta.years)for(const topic of meta.topics){
  const l=L.getLesson(level,subject,topic);try{l.challengePool=await E.tutorItems(level,subject,topic)}catch(err){throw Error(`${level}/${subject}/${topic}: ${err.message}`)};
  assert(l.challengePool.length>=4,`${level}/${subject}/${topic}`);
  const seen=new Set();for(let i=0;i<l.challengePool.length;i++){
   const q=A.makeChallenge(l);assert.equal(q.topic,topic);assert.equal(q.subject,subject);assert.equal(q.options.filter(o=>o.ok).length,1);
   const key=JSON.stringify([q.prompt.toLowerCase().trim(),q.answer]);assert(!seen.has(key),`${subject}/${topic} repeated before exhaustion`);seen.add(key);
  }
  const q=A.makeChallenge(l);assert.equal(new Set([1,2,3].map(n=>A.reteachScene(l,q,n).html)).size,3);topics++;
 }
}
for(let i=0;i<150;i++){
 const l=L.getLesson('2','math','Tambah & Tolak'),q=A.makeChallenge(l);
 const groups=q.visual.match(/<div class="group g[12]">[\s\S]*?<\/div>/g);
 assert.equal((groups[0].match(/<i>/g)||[]).length,q.meta.a);assert.equal((groups[1].match(/<i>/g)||[]).length,q.meta.b);
 assert.equal(new Set([1,2,3].map(n=>A.reteachScene(l,q,n).html)).size,3);
}
for(const year of ['4','5','6'])for(const topic of c.LATIH_CONFIG.subjects.math.topics){
 const items=await E.makeSet(year,'math',topic,50,'uasa');assert.equal(items.length,50);
 for(const item of items){assert(E.validateItem(item));if(/fraccompare-|order-|half|quarter|shape-/.test(item.concept))assert.equal(item.itemType,'mcq');}
}
const app=read('app.js'),fn=app.match(/  function startTimer\(\)[\s\S]*?\n  }/)[0],pause=app.match(/  function pauseTimer\(\)[^\n]+/)[0];let now=11000;
const tc={quiz:{remaining:100,timerStartedAt:1000},state:{settings:{timer:true}},document:{visibilityState:'visible'},timerInt:1,clearInterval(){},setInterval(){return 2},Date:{now:()=>now},H:c.LATIH_STATE};vm.createContext(tc);vm.runInContext(pause+'\n'+fn,tc);
tc.startTimer();assert.equal(tc.quiz.remaining,90);now=21000;tc.startTimer();assert.equal(tc.quiz.remaining,80);tc.startTimer();assert.equal(tc.quiz.remaining,80);now+=250;tc.startTimer();assert.equal(tc.quiz.remaining,79.75);
assert(JSON.parse(read('manifest.json')).start_url.includes(c.LATIH_VERSION));assert(read('index.html').includes(`app.js?v=${c.LATIH_VERSION}`));assert(read('sw.js').includes(`version.js?v=${c.LATIH_VERSION}`));
assert(!app.includes('AI ajar semula'));console.log(`PASS: ${topics} grade/topic tutor pools, no repeated questions before exhaustion, staged help, 150 exact visual counts, 1,350 UASA items, timer restarts and release versions.`);
