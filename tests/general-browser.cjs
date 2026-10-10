// Real-browser regression: all categories, resume, scores, cache and media decoding.
const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');const http=require('node:http');const path=require('node:path');
(async()=>{
 let server=null;
 const root=path.resolve(__dirname,'..');
 if(!process.env.LATIHKU_TEST_URL){
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.mp3':'audio/mpeg'};
  server=http.createServer((req,res)=>{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const file=path.resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404);res.end();return}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(data)})});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 }
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();
 fs.mkdirSync(path.join(root,'.general-build-cache'),{recursive:true});
 const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('Browser error:',e.stack)});
 const base=process.env.LATIHKU_TEST_URL||`http://127.0.0.1:${server.address().port}/`;
 // A new profile must work before migration or existing history is present.
 const fresh=await browser.newContext({viewport:{width:390,height:844}});const fp=await fresh.newPage();
 fp.on('pageerror',e=>errors.push(e.message));await fp.goto(base);await fp.waitForFunction(()=>navigator.serviceWorker.controller);
 await fp.locator('#firstName').fill('Baharu');await fp.locator('#nextSticker').click();await fp.locator('#beginBtn').click();await fp.locator('.bottomnav [data-view="general"]').click();assert.equal(await fp.locator('[data-general-category]').count(),20);
 await fp.locator('[data-general-category="animals"]').click();await fp.locator('[data-general-count="5"]').click();assert.equal(await fp.locator('[data-general-answer]').count(),4);await fresh.close();
 await context.addInitScript(()=>{
  if(localStorage.getItem('general-test-seeded'))return;
  localStorage.setItem('latihkuStudyV10',JSON.stringify({
   schemaVersion:25,meta:{updatedAt:Date.now()},profile:{name:'Ujian',avatar:'⭐',onboarded:true},
   prefs:{level:'3',subject:'math'},sessions:[{subject:'math',score:4,total:5}],xp:120,answers:5,correct:4,
   learning:{completed:{'3:math:Nombor':1},mastery:{'3:math:Nombor':80},adaptive:{'3:math:Nombor':{attempts:2}}},
   coloring:{completed:{'saved-page':true}},smartPractice:{seen:{'3:math':['saved-id']}},
   general:{history:[{date:'1/1/2026',score:3,total:5}],recent:['MY']}
  }));
  localStorage.setItem('general-test-seeded','1');
 });
 await page.goto(base);await page.waitForSelector('[data-view="general"]');await page.locator('.bottomnav [data-view="general"]').click();
 await page.waitForFunction(()=>navigator.serviceWorker.controller);await page.waitForFunction(async()=>{const c=await caches.open(`latihku-shell-v${LATIH_VERSION}`);return (await Promise.all(LATIH_GENERAL_ENGINE.assets.map(p=>c.match(p)))).every(Boolean)},{},{timeout:180000});
 await page.locator('.bottomnav [data-view="general"]').click();await page.waitForSelector('[data-general-category]');assert.equal(await page.locator('[data-general-category]').count(),20);
 await page.screenshot({path:path.join(root,'.general-build-cache/latihku-general-mobile.png'),fullPage:true});
 await context.setOffline(true);
 const ids=await page.evaluate(()=>LATIH_GENERAL_ENGINE.categories.map(c=>c.id));
 for(const id of ids){
  await page.locator(`[data-general-category="${id}"]`).click();await page.locator('[data-general-count="5"]').click();
  for(let i=0;i<5;i++){
   await page.waitForSelector('[data-general-answer]');
   const art=page.locator('.general-question-image');if(await art.count())await page.waitForFunction(()=>{const im=document.querySelector('.general-question-image');return im.complete&&im.naturalWidth>0});
   assert.equal(await page.locator('[data-general-answer]').count(),4);
   if(id==='sounds'){
    await page.evaluate(async()=>{const a=document.querySelector('audio');a.load();await a.play();a.pause()});
   }
   // Finish correctly to exercise calculation and result guards.
   const selected=await page.evaluate(()=>{const g=JSON.parse(localStorage.getItem('latihkuStudyV10')).general.active;return g.items[g.i].options.indexOf(LATIH_GENERAL_ENGINE.question(g.items[g.i].id).correct)});
   await page.locator(`[data-general-answer="${selected}"]`).click();
   if(i===0&&id==='animals'){
    await page.locator('#generalExit').click();await page.reload();await page.locator('.bottomnav [data-view="general"]').click();await page.locator('#generalResume').click();assert.equal(await page.locator('.answer-btn.correct').count(),1);
   }
   await page.locator('#generalNext').click();
  }
  await page.waitForSelector('#generalReturn');assert.equal(await page.locator('.result-score').innerText(),'100%');assert.equal(await page.locator('.general-review').count(),5);await page.locator('#generalReturn').click();
 }
 // All imagery must decode even if a random short session did not pick it.
 const media=await page.evaluate(async()=>{
  const files=LATIH_GENERAL_ENGINE.assets.filter(p=>p.endsWith('.webp')||p.endsWith('.svg'));
  const failures=[];for(const p of files){await new Promise(resolve=>{const im=new Image();im.onload=resolve;im.onerror=()=>{failures.push(p);resolve()};im.src=p})}return failures;
 });assert.deepEqual(media,[]);
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('latihkuStudyV10')));
 assert.equal(saved.sessions.length,1);assert.equal(saved.sessions[0].score,4);assert.equal(saved.prefs.level,'3');assert.equal(saved.xp,120+20*100);assert.equal(saved.learning.mastery['3:math:Nombor'],80);assert.equal(saved.coloring.completed['saved-page'],true);assert.equal(saved.smartPractice.seen['3:math'][0],'saved-id');assert.equal(saved.general.active,null);assert.equal(saved.general.history.length,21);
 assert.equal(Object.values(saved.general.stats).reduce((n,r)=>n+r.sessions,0),21);
 // Offline reload after the update, then another 30-question session.
 await page.reload();await page.locator('.bottomnav [data-view="general"]').click();await page.locator('[data-general-category="logic"]').click();await page.locator('[data-general-count="30"]').click();assert.equal(await page.locator('.quiz-counter').innerText(),'1 / 30');await page.waitForFunction(()=>{const im=document.querySelector('.general-question-image');return im.complete&&im.naturalWidth>0});await page.locator('.general-question-image').evaluate(im=>im.decode());
 await page.screenshot({path:path.join(root,'.general-build-cache/latihku-general-question-mobile.png'),fullPage:true});
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Mobile horizontal overflow');
 await context.setOffline(false);await page.setViewportSize({width:1440,height:1000});await page.locator('#generalExit').click();await page.screenshot({path:path.join(root,'.general-build-cache/latihku-general-desktop.png'),fullPage:true});
 assert.deepEqual(errors,[]);console.log('Browser checks passed: 20 categories, offline quiz/media, audio playback, resume, score, review, school-state preservation, mobile layout.');
 await browser.close();if(server)await new Promise(resolve=>server.close(resolve));
})().catch(e=>{console.error(e);process.exit(1)});
