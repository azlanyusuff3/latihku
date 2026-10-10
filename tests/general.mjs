import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const context={console,Math,Date,Intl};context.globalThis=context;vm.createContext(context);
for(const p of ['world-flags.js','general-data.js','general-engine.js','general-assets.js'])vm.runInContext(read(p),context);
const E=context.LATIH_GENERAL_ENGINE,B=context.LATIH_GENERAL_DATA;
assert.equal(E.categories.length,20);assert.equal(new Set(E.categories.map(c=>c.id)).size,20);
assert.equal(new Set(B.questions.map(q=>q.id)).size,B.questions.length);
assert.deepEqual(Array.from(context.LATIH_GENERAL_ASSETS),Array.from(B.assets));
const assets=new Set(B.assets);
for(const path of assets)assert(fs.existsSync(new URL('../'+path,import.meta.url)),path);
for(const c of E.categories){
 assert(E.question(c.cover));assert(E.byCategory[c.id].length>=30,c.id);
 for(const n of [5,10,20,30]){
  for(let trial=0;trial<10;trial++){
   const items=E.makeQuiz(c.id,n);assert.equal(items.length,n);assert.equal(new Set(items.map(q=>q.id)).size,n);
   const run={category:c.id,items,i:0,selected:null,score:0,answers:[]};assert(E.validSession(run));
   for(let i=0;i<n;i++){
    run.i=i;const q=E.question(items[i].id);assert.equal(items[i].options.length,4);assert.equal(new Set(items[i].options).size,4);assert(items[i].options.includes(q.correct));
    const chosen=items[i].options[i%4];run.selected=i%4;run.answers.push({id:q.id,chosen,ok:chosen===q.correct});run.score=run.answers.filter(a=>a.ok).length;
    assert(E.validSession(run),`${c.id} resume answered ${i}`);
    assert(!E.validSession({...run,score:run.score+1}));
    assert(!E.validSession({...run,answers:run.answers.map((a,j)=>j===i?{...a,chosen:'invalid'}:a)}));
    if(i<n-1){run.i++;run.selected=null;assert(E.validSession(run))}
   }
  }
 }
 const full=E.byCategory[c.id];const recent=full.slice(0,5).map(q=>q.id);assert(E.makeQuiz(c.id,5,recent).every(q=>!recent.includes(q.id)));
}
for(const q of B.questions){
 assert(E.hasCategory(q.category));assert(q.question.trim());assert(q.explanation.trim());assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert(q.options.includes(q.correct));assert(assets.has(q.image));assert(!q.image.startsWith('http'));
 if(q.category==='sounds'){assert(q.audio);assert(assets.has(q.audio));assert(q.image.endsWith('farm.webp'),'audio picture should not disclose answer')}
}
assert.throws(()=>E.makeQuiz('unknown',5));assert.throws(()=>E.makeQuiz('animals',99));
const empty=E.migrate(null);assert.equal(empty.history.length,0);assert.equal(Object.keys(empty.stats).length,20);
const oldItems=context.LATIH_FLAGS.makeQuiz(5);const code=oldItems[0].options[2];const old={items:oldItems,i:0,selected:2,score:code===oldItems[0].code?1:0,answers:[{code:oldItems[0].code,chosen:code,ok:code===oldItems[0].code}]};
const migrated=E.migrate({history:[{date:'1/1/2026',score:3,total:5}],active:old,recent:['MY']});
assert(E.validSession(migrated.active));assert.equal(migrated.active.category,'flags');assert.equal(migrated.history[0].category,'flags');assert.equal(migrated.recent[0],'flags-MY');assert.equal(migrated.stats.flags.correct,3);
assert.deepEqual(JSON.parse(JSON.stringify(E.migrate(migrated))),JSON.parse(JSON.stringify(migrated)));
assert.equal(E.migrate({active:{category:'bad'}}).active,null);
assert(read('app.js').includes('m.general=window.LATIH_GENERAL_ENGINE.migrate(s?.general)'));
assert(read('app.js').includes('general:window.LATIH_GENERAL_ENGINE.migrate(null)'),'new profiles and reset get General statistics defaults');
assert(read('sw.js').includes('...globalThis.LATIH_GENERAL_ASSETS'));
assert(read('sw.js').includes("'./general-assets.js?v=24.2.0'"));
const sources=JSON.parse(read('assets/general/sources.json')),audio=JSON.parse(read('assets/general/audio-sources.json'));
for(const path of assets)if(path.endsWith('.webp')&&path.includes('/general/'))assert(Object.values(sources).some(r=>r.path===path&&r.license&&r.source),`Missing licence ${path}`);
for(const q of B.questions.filter(q=>q.audio)){const r=Object.values(audio).find(r=>r.path===q.audio);assert(r&&r.license&&r.source);assert(!r.title.match(/^File:(En|De|Fr)-/i),'Pronunciation is not an animal recording')}
console.log(`General checks passed: ${E.categories.length} categories, ${E.bank.size} questions, ${assets.size} offline assets.`);
