import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => fs.readFileSync(new URL(path,root),'utf8');
const context = {console,Math,Date,setTimeout,clearTimeout};
context.window=context;context.globalThis=context;
context.fetch=async url => ({ok:true,json:async()=>JSON.parse(read(url))});
vm.createContext(context);
for(const file of ['version.js','config.js','state-helpers.js','smart-engine.js','pdf-pattern-engine.js','engine.js','pra-engine.js','coloring-data.js']) vm.runInContext(read(file),context,{filename:file});
const C=context.LATIH_CONFIG,H=context.LATIH_STATE,E=context.LATIH_ENGINE;
assert.equal(C.version,'23.1.0');
const pathExists=p=>fs.existsSync(new URL(p,root));
const shell=read('sw.js').match(/const SHELL=\[([^\]]+)\]/)?.[1].match(/'[^']+'/g)?.map(x=>x.slice(1,-1))||[];
assert(shell.length>=15);for(const asset of shell) assert(pathExists(asset==='./'?'index.html':asset),asset);
for(const asset of ['index.html','styles.css','sw.js','version.js','config.js','state-helpers.js','app.js','icons/icon-192.png','icons/icon-512.png']) assert(pathExists(asset),asset);
for(const [key,p] of Object.entries(C.packs)){
  assert(pathExists(p.url),key);
  const bytes=fs.readFileSync(new URL(p.url,root)),bank=JSON.parse(bytes);
  assert.equal(bank.questions.length,p.count,key);
  assert.equal(bytes.length,p.bytes,key);
  for(const q of bank.questions) { assert(E.validateItem(q),`${key}: invalid curated item`); assert(q.question && q.topic && q.correct !== undefined,key); assert(C.subjects[key.split(':')[1]].topics.includes(q.topic) || (key.endsWith(':sra') && C.sraTopicsByLevel[key.split(':')[0]].includes(q.topic)),`${key}: ${q.topic}`); }
}
const coloring=context.LATIH_COLORING;
for(const asset of coloring.assets) assert(pathExists(asset),asset);
const manifest=JSON.parse(read('manifest.json'));
for(const icon of manifest.icons) assert(pathExists(icon.src),icon.src);
assert.equal(H.duration('uasa',5),750);
assert.equal(H.duration('uasa',10),1500);
assert.equal(H.duration('uasa',20),3000);
assert.equal(H.duration('uasa',30),4500);
assert.equal(H.duration('exam',10),450);
assert.equal(H.remaining({remaining:45,timerStartedAt:1000},6500),40);
assert.equal(H.remaining({remaining:45,timerStartedAt:0},6500),45);
assert.equal(H.countDay(5,'2026-9-25','2026-9-26','2026-9-25'),6);
assert.equal(H.countDay(5,'2026-9-26','2026-9-26','2026-9-25'),5);
const item={question:'2 + 2?',topic:'Tambah & Tolak',correct:'4',answers:['1','2','3','4'],difficulty:'mudah',explanation:'2 + 2 = 4'};
const quiz={items:[item],i:0,score:0,answers:[],remaining:45,prefs:{mode:'learn',subject:'math',level:'1'}};
assert(H.validQuiz(quiz,C));assert(H.migrateQuiz(quiz,quiz.prefs,C));
assert(!H.validQuiz({...quiz,items:[]},C));
const state={profile:{name:'Aiman'},prefs:quiz.prefs,sessions:[],activeQuiz:quiz};
assert(H.validateBackup({app:'LatihKu Study',state},C));
assert(!H.validateBackup({state:{...state,profile:'bad'}},C));
assert(!H.validateBackup({state:{...state,activeQuiz:{...quiz,i:99}}},C));
let generated=0;
for(const year of ['1','2','3','4','5','6']){
  for(const subject of ['math','bm','en','sci','islam','moral','pjpk','sra',...(Number(year)>=4?['hist']:[])]){
    const items=await E.makeSet(year,subject,'Campur Semua',5,'auto',{});
    assert.equal(items.length,5,`${year}:${subject}`);
    for(const q of items) {
      assert(q.question?.trim() && String(q.correct??'').trim(),`${year}:${subject}`);
      if(q.itemType!=='short') assert(q.answers?.length===4 && new Set(q.answers.map(x=>String(x).toLowerCase().trim())).size===4 && q.answers.filter(x=>String(x)===String(q.correct)).length===1,`${year}:${subject}: ${q.question}`);
      assert(E.validateItem(q),`${year}:${subject}: ${q.question}`);generated++;
    }
  }
}
const first=await E.makeSet('1','bm','Campur Semua',5,'auto',{});
const second=await E.makeSet('1','bm','Campur Semua',5,'auto',{seenIds:first.map(q=>q.id)});
assert.equal(first.filter(q=>second.some(x=>x.id===q.id)).length,0,'curated rotation before exhaustion');
console.log(`Checks passed: ${Object.keys(C.packs).length} packs, ${coloring.assets.length} coloring assets, ${generated} quiz items, state/timer/backup`);
