import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = path => fs.readFileSync(new URL(path,root),'utf8');
const context = {console,Math,Date,setTimeout,clearTimeout};
context.window=context;context.globalThis=context;
context.fetch=async url => ({ok:true,json:async()=>JSON.parse(read(url))});
vm.createContext(context);
for(const file of ['version.js','world-flags.js','config.js','state-helpers.js','smart-engine.js','pdf-pattern-engine.js','year2-math-engine.js','engine.js','pra-engine.js','coloring-data.js']) vm.runInContext(read(file),context,{filename:file});
const C=context.LATIH_CONFIG,H=context.LATIH_STATE,E=context.LATIH_ENGINE;
assert.match(C.version,/^\d+\.\d+\.\d+$/);
assert(!('sra' in C.subjects));assert(Object.keys(C.packs).every(x=>!x.endsWith(':sra')));
assert.equal(H.migratePreferences({schoolType:'sra',level:'4',subject:'sra',topic:'Tauhid'},C).subject,'math');
assert(!('schoolType' in H.migratePreferences({schoolType:'sra',level:'4',subject:'sra'},C)));
assert.equal(H.migratePreferences({level:'3',subject:'bm',topic:'Campur Semua'},C).subject,'bm');
const pathExists=p=>fs.existsSync(new URL(p,root));
const shell=read('sw.js').match(/const SHELL_FILES=\[([^\]]+)\]/)?.[1].match(/'[^']+'/g)?.map(x=>x.slice(1,-1))||[];
assert(shell.includes('year2-math-engine.js'));assert(shell.includes('v24.css'));assert(shell.includes('world-flags.js'));assert(shell.includes('general-quiz.js'));assert(shell.length>=16);
for(const asset of shell) {assert(pathExists(asset),asset);assert(read('index.html').includes(`${asset}?v=${C.version}`),`versioned shell ${asset}`)}
assert(read('sw.js').includes('...SHELL_FILES.map(file=>`${file}?v=${RELEASE}`)'));
assert(read('index.html').includes(`LatihKu Study v${C.version}`));
assert(read('sw.js').includes("'assets/world-flags.svg'"));
const F=context.LATIH_FLAGS;
assert.equal(F.count,195);
const sprite=read('assets/world-flags.svg');
for(const country of F.countries)assert(sprite.includes(`id="fi-${country.code.toLowerCase()}"`),country.code);
for(const n of [5,10,20,30]){
  for(let repeat=0;repeat<5;repeat++){
    const items=F.makeQuiz(n);
    assert.equal(items.length,n);
    assert.equal(new Set(items.map(x=>x.code)).size,n);
    for(const item of items){
      assert.equal(item.options.length,4);
      assert.equal(new Set(item.options).size,4);
      assert(item.options.includes(item.code));
      assert(item.options.every(F.exists));
      assert(F.name(item.code));
    }
    const session={items,i:0,score:0,selected:null,answers:[]};
    assert(F.validSession(session));
    assert(!F.validSession({...session,items:[items[0],items[0],...items.slice(2)]}));
  }
}
assert(!F.validSession({items:[],i:0,score:0,selected:null,answers:[]}));
assert(read('index.html').includes(`manifest.json?v=${C.version}`));
assert(JSON.parse(read('manifest.json')).start_url.includes(C.version));
assert(!['1','2','3','4','5','6'].some(y=>pathExists(`data/${y}/sra.json`)));
for(const asset of ['index.html','styles.css','sw.js','version.js','config.js','state-helpers.js','app.js','icons/icon-192.png','icons/icon-512.png']) assert(pathExists(asset),asset);
for(const [key,p] of Object.entries(C.packs)){
  assert(pathExists(p.url),key);
  const bytes=fs.readFileSync(new URL(p.url,root)),bank=JSON.parse(bytes);
  assert.equal(bank.questions.length,p.count,key);
  assert.equal(bytes.length,p.bytes,key);
  for(const q of bank.questions) { assert(E.validateItem(q),`${key}: invalid curated item`); assert(q.question && q.topic && q.correct !== undefined,key); assert(C.subjects[key.split(':')[1]].topics.includes(q.topic),`${key}: ${q.topic}`); }
}
const coloring=context.LATIH_COLORING;
for(const asset of coloring.assets) assert(pathExists(asset),asset);
const manifest=JSON.parse(read('manifest.json'));
for(const icon of manifest.icons) assert(pathExists(icon.src),icon.src);
assert(E.validateItem({question:'Choose the sentence with correct punctuation.',topic:'Grammar',correct:'Amir is reading a book.',answers:['Amir is reading a book.','amir is reading a book.','Amir is reading a book','Amir is reading a book?'],difficulty:'mudah',explanation:'Capital letters and punctuation matter.'}),'Preserve meaningful English capitalisation answer options');
assert.equal(H.duration('uasa',5),750);
assert.equal(H.duration('uasa',10),1500);
assert.equal(H.duration('uasa',20),3000);
assert.equal(H.duration('uasa',30),4500);
assert.equal(H.duration('uasa',50),7500);
assert.equal(H.duration('exam',50),2250);
assert(read('app.js').includes('[5,10,20,30,50]'),'Year 1-6 practice includes a 50-question option');
assert.equal(H.duration('exam',10),450);
assert.equal(H.remaining({remaining:45,timerStartedAt:1000},6500),40);
assert.equal(H.remaining({remaining:45,timerStartedAt:0},6500),45);
assert.equal(H.countDay(5,'2026-9-25','2026-9-26','2026-9-25'),6);
assert.equal(H.countDay(5,'2026-9-26','2026-9-26','2026-9-25'),5);
const item={question:'2 + 2?',topic:'Tambah & Tolak',correct:'4',answers:['1','2','3','4'],difficulty:'mudah',explanation:'2 + 2 = 4'};
const quiz={items:[item],i:0,score:0,answers:[],remaining:45,prefs:{mode:'learn',subject:'math',level:'1'}};
assert(H.validQuiz(quiz,C));assert(H.migrateQuiz(quiz,quiz.prefs,C));
assert(!('schoolType' in H.migrateQuiz({...quiz,prefs:{...quiz.prefs,schoolType:'sk'}},quiz.prefs,C).prefs));
assert(!H.validQuiz({...quiz,items:[]},C));
const state={profile:{name:'Aiman'},prefs:quiz.prefs,sessions:[],activeQuiz:quiz};
assert(H.validateBackup({app:'LatihKu Study',state},C));
assert(!H.validateBackup({state:{...state,profile:'bad'}},C));
assert(!H.validateBackup({state:{...state,activeQuiz:{...quiz,i:99}}},C));
assert(H.validateBackup({state:{...state,prefs:{...quiz.prefs,schoolType:'sra',subject:'sra'},sessions:[{subject:'sra',score:3,total:5}],activeQuiz:{...quiz,prefs:{...quiz.prefs,subject:'sra'}}}},C));
assert.equal(H.migrateQuiz({...quiz,prefs:{...quiz.prefs,subject:'sra'}},quiz.prefs,C),null);
const legacy={xp:120,streak:4,sessions:[{subject:'sra',score:3,total:5},{subject:'math',score:4,total:5}],aggregates:{subjects:{sra:{n:1,c:3,t:5},math:{n:1,c:4,t:5}},topics:{'sra|Tauhid':{total:5},'math|Nombor':{total:5}},sessionCount:2},smartPractice:{seen:{'4:sra':['old'],'4:math':['sk']},recentGenerated:{'4:sra':['old']}},learning:{completed:{'4:sra:Tauhid':1,'4:math:Nombor':1},mastery:{'4:sra:Tauhid':90},adaptive:{'4:sra:Tauhid':{}}},responseAnalytics:{totalTimed:3,totalMs:8000,patterns:{'4|sra|Tauhid|old':{count:1,totalMs:2000},'4|math|Nombor|add':{count:2,totalMs:6000}}}};
H.purgeLegacySchool(legacy);assert.equal(legacy.sessions.length,1);assert.equal(legacy.aggregates.sessionCount,1);assert.equal(legacy.responseAnalytics.totalTimed,2);assert.equal(legacy.responseAnalytics.totalMs,6000);assert.equal(legacy.xp,120);assert.equal(legacy.streak,4);assert.equal(legacy.learning.completed['4:math:Nombor'],1);assert(!JSON.stringify(legacy).includes('sra'));


const Y2=context.LATIH_YEAR2_MATH;
assert.equal(Y2.special.length,7);
for(const topic of Y2.special){
  const items=await E.makeSet('2','math',topic,30,'auto',{});
  assert.equal(items.length,30,'Tahun 2 '+topic);
  assert(items.every(q=>q.id.startsWith('Y2M-')&&E.validateItem(q)),'Valid Tahun 2 '+topic);
  assert(items.every(q=>Number(String(q.correct).replace(/[^\d-]/g,''))>=0));
}
for(const topic of ['Campur Semua','Tambah & Tolak','Darab & Bahagi']){
  const items=await E.makeSet('2','math',topic,30,'auto',{});
  assert(items.some(q=>q.id.startsWith('Y2M-')),'Tahun 2 patterns in '+topic);
}

for(const topic of context.LATIH_YEAR2_MATH.special){
  const items=await E.makeSet('2','math',topic,50,'auto',{});
  assert.equal(items.length,50,'Year 2 special topic '+topic);
  assert(items.every(q=>E.validateItem(q)),'Invalid Year 2 topic '+topic);
}
for(const year of ['4','5','6'])for(const subject of ['math','bm','en','sci','hist']){
  const items=await E.makeSet(year,subject,'Campur Semua',50,'uasa',{});
  assert.equal(items.length,50,year+':'+subject+' UASA needs 50 questions');
  assert(items.every(q=>E.validateItem(q)),year+':'+subject+' invalid 50-question UASA item');
}
let generated=0;
for(const year of ['1','2','3','4','5','6']){
  for(const subject of ['math','bm','en','sci','islam','moral','pjpk',...(Number(year)>=4?['hist']:[])]){
    const items=await E.makeSet(year,subject,'Campur Semua',50,'auto',{});
    assert.equal(items.length,50,`${year}:${subject} must produce 50 questions`);
    for(const q of items) {
      assert(q.question?.trim() && String(q.correct??'').trim(),`${year}:${subject}`);
      if(q.itemType!=='short') assert(q.answers?.length===4 && new Set(q.answers.map(x=>String(x).trim())).size===4 && q.answers.filter(x=>String(x)===String(q.correct)).length===1,`${year}:${subject}: ${q.question}`);
      assert(E.validateItem(q),`${year}:${subject}: ${q.question}`);generated++;
    }
  }
}
const generatedA=context.LATIH_SMART.makeSet('5','bm','Kosa Kata',5,'sederhana',{});
const generatedB=context.LATIH_SMART.makeSet('5','bm','Kosa Kata',5,'sederhana',{recentGenerated:generatedA.map(q=>q.smartSignature)});
assert(generatedA.every(q=>q.smartSignature && !generatedB.some(x=>x.smartSignature===q.smartSignature)),'generated anti-repeat');
const first=await E.makeSet('1','bm','Campur Semua',5,'auto',{});
const second=await E.makeSet('1','bm','Campur Semua',5,'auto',{seenIds:first.map(q=>q.id)});
assert.equal(first.filter(q=>second.some(x=>x.id===q.id)).length,0,'curated rotation before exhaustion');
// Tolerant typed-answer marking.
for(const [input,correct,ok] of [['5','RM5',true],['RM 5.00','RM5',true],['3.00','3:00',true],['pukul 3','3:00',true],['3:30','3:00',false],['1/2','2/4',true],['1/3','2/4',false],['5 cm','5 m',false],['24837','24,837',true],['fotosintisis','fotosintesis',true],['jantung','paru-paru',false]])
  assert.equal(E.checkShort(input,{correct}),ok,`checkShort ${input} vs ${correct}`);
// Curated items only appear in the years they are tagged for; no filler options anywhere.
for(const [key,p] of Object.entries(C.packs)){if(key.startsWith('pra'))continue;const y=+key.split(':')[0];for(const q of JSON.parse(fs.readFileSync(new URL(p.url,root))).questions){if(q.years)assert(y>=q.years[0]&&y<=q.years[1],`${key} ${q.id} outside its year band`)}}
for(const year of ['1','4','6'])for(const subject of ['bm','sci','moral']){const items=await E.makeSet(year,subject,'Campur Semua',30,'auto',{});assert(!items.some(q=>(q.answers||[]).some(a=>/^(Pilihan lain|Tidak berkaitan|Tiada jawapan di atas|Tiada perubahan)$/.test(a))),`${year}:${subject} filler option`);assert(!items.some(q=>/^(Cuba soalan ini|Soalan ulang kaji untuk)/.test(q.question)),`${year}:${subject} noisy prefix`)}
console.log(`Checks passed: ${Object.keys(C.packs).length} packs, ${coloring.assets.length} coloring assets, ${generated} quiz items, state/timer/backup`);
