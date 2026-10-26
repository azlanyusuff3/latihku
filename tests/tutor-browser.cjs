const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{const p=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/\/$/,'/index.html'));if(!p.startsWith(root+path.sep)){res.writeHead(403);return res.end()}fs.readFile(p,(err,data)=>{if(err){res.writeHead(404);return res.end()}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml'})[path.extname(p)]||'application/octet-stream');res.end(data)})});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});try{
 const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('latihkuStudyV10',JSON.stringify({schemaVersion:25,profile:{name:'Test',avatar:'⭐',onboarded:true},prefs:{level:'2',subject:'music',topic:'Irama'},settings:{sound:false,timer:true}})));
 await page.goto(`http://127.0.0.1:${server.address().port}/`);
 await page.evaluate(()=>{const orig=LATIH_ADAPTIVE.makeChallenge;LATIH_ADAPTIVE.makeChallenge=(...args)=>{const q=orig(...args);(window.tutorQuestions??=[]).push(q);return q};window.currentTutor=()=>tutorQuestions.findLast(q=>q.prompt===document.querySelector('.lesson-card h1')?.textContent&&q.options.every((o,i)=>o.label===document.querySelectorAll('[data-ai-option] span')[i]?.textContent))});
 await page.click('#homePractice');await page.click('#learnTopic');await page.click('[data-learn-topic="Irama"]');await page.click('#startLesson');
 await page.locator('.lesson-page').waitFor();await page.click('#lessonNext');await page.click('#lessonNext');
 assert.equal(await page.evaluate(()=>currentTutor().subject),'music');assert.equal(await page.evaluate(()=>currentTutor().topic),'Irama');assert.notEqual(await page.locator('.lesson-card h1').innerText(),'Pilih yang sama.');
 let right=await page.evaluate(()=>currentTutor().options.findIndex(o=>o.ok));await page.click(`[data-ai-option="${right}"]`);await page.click('#lessonNext');
 const first=await page.evaluate(()=>currentTutor().prompt+'|'+currentTutor().answer);let wrong=await page.evaluate(()=>currentTutor().options.findIndex(o=>!o.ok));await page.click(`[data-ai-option="${wrong}"]`);await page.locator('#tryNewChallenge').waitFor();await page.click('#tryNewChallenge');
 assert.notEqual(await page.evaluate(()=>currentTutor().prompt+'|'+currentTutor().answer),first);
 for(let i=0;i<2;i++){right=await page.evaluate(()=>currentTutor().options.findIndex(o=>o.ok));await page.click(`[data-ai-option="${right}"]`);if(!i)await page.waitForFunction(()=>document.querySelector('[data-ai-option]')&&!document.querySelector('[data-ai-option]').disabled)}
 await page.click('#lessonNext');await page.click('#launchMastery');await page.locator('.quiz-page').waitFor();
 assert.equal(await page.locator('#confirmAnswer').isDisabled(),true);await page.click('[data-answer="0"]');assert.equal(await page.locator('.quiz-counter small').innerText(),'1 / 10');await page.click('[data-answer="1"]');await page.click('#confirmAnswer');assert.equal(await page.locator('.quiz-counter small').innerText(),'2 / 10');
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));assert.deepEqual(errors,[]);console.log('PASS mobile: music tutor, distinct retry, two independent answers, mastery launch, exam confirm/change, no overflow or JS errors');
}finally{await browser.close();server.close()}})().catch(err=>{console.error(err);server.close();process.exitCode=1});
