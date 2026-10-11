// Browser end-to-end: word-story comprehension, wrong-answer feedback, offline resume and saved results.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
(async()=>{
  const root=path.resolve(__dirname,'..');
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
  const server=http.createServer((req,res)=>{
    const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const full=path.resolve(root,'.'+(name==='/'?'/index.html':name));
    if(!full.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
    fs.readFile(full,(err,data)=>{if(err){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':types[path.extname(full)]||'application/octet-stream'});res.end(data);});
  });
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
  try{
    const context=await browser.newContext({viewport:{width:390,height:844}});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto('http://127.0.0.1:'+server.address().port+'/');
    await page.waitForFunction(()=>navigator.serviceWorker.controller);
    await page.locator('#firstName').fill('Latihan');
    await page.locator('#nextSticker').click();
    await page.locator('#beginBtn').click();
    await page.locator('[data-level="2"]').first().click();
    assert.equal(await page.locator('#homeWordMode').count(),1);
    await page.locator('#homeWordMode').click();
    await page.locator('[data-wp-count="5"]').click();
    await page.locator('#wpStart').click();
    const first=await page.evaluate(()=>JSON.parse(localStorage.getItem('latihkuStudyV10')).wordProblems.active);
    assert.equal(first.level,'2');assert.equal(first.items.length,5);
    const wrong=windowValue=>{};
    const opNames=['Tambah','Tolak','Darab','Bahagi'];
    const indexWrong=opNames.findIndex(x=>x!==first.items[0].operation);
    await page.locator('[data-wp-option="'+indexWrong+'"]').click();
    assert.equal(await page.locator('.wp-feedback.incorrect').count(),1);
    await page.screenshot({path:path.join(root,'.general-build-cache/latihku-word-guided.png'),fullPage:true});
    async function right(){
      const run=await page.evaluate(()=>JSON.parse(localStorage.getItem('latihkuStudyV10')).wordProblems.active);
      const q=run.items[run.index];
      const choices=run.step===0?opNames:run.step===1?q.equations:q.answers;
      const correct=run.step===0?q.operation:run.step===1?q.equation:q.answer;
      const idx=choices.indexOf(correct);
      assert(idx>=0);
      await page.locator('[data-wp-option="'+idx+'"]').click();
      assert.equal(await page.locator('.wp-feedback.correct').count(),1);
      await page.locator('#wpNext').click();
    }
    await right(); // correct operation on second try
    await page.locator('#wpExit').click();
    await page.reload();
    await page.locator('#homeWordMode').click();
    assert.equal(await page.locator('#wpResume').count(),1);
    await context.setOffline(true);
    await page.reload(); // new scripts must be cached for fully offline use
    await page.locator('#homeWordMode').click();
    await page.locator('#wpResume').click();
    assert((await page.locator('.wp-progress').innerText()).includes('Langkah 2'));
    for(let step=0;step<2;step++)await right(); // equation, answer
    for(let question=1;question<5;question++)for(let step=0;step<3;step++)await right();
    assert.equal(await page.locator('.wp-result-number').innerText(),'80%');
    await page.screenshot({path:path.join(root,'.general-build-cache/latihku-word-results.png'),fullPage:true});
    const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('latihkuStudyV10')));
    assert.equal(saved.wordProblems.active,null);
    assert.equal(saved.wordProblems.history[0].independent,4);
    assert.equal(saved.sessions[0].topic,'Fahami Soalan Berayat');
    assert.equal(saved.sessions[0].total,5);
    assert.equal(saved.sessions[0].score,4);
    assert.equal(saved.prefs.level,'2');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
    assert.deepEqual(errors,[]);
    await context.close();
    console.log('Word problem browser checks passed: three stages, error feedback, resume, offline restart, score and saved maths progress.');
  }finally{
    await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(e=>{console.error(e);process.exit(1);});
