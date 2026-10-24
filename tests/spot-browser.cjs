const {chromium}=require('playwright');const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
(async()=>{const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});try{
for(const width of [320,390,1280]){
 const page=await browser.newPage({viewport:{width,height:950}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setContent('<style>body{margin:0;font-family:Arial}main{padding:12px;max-width:1100px;margin:auto}</style><main id="app"></main>');
 await page.addStyleTag({path:path.join(__dirname,'../games.css')});await page.addScriptTag({path:path.join(__dirname,'../spot-scenes.js')});await page.addScriptTag({path:path.join(__dirname,'../spot-extra-scenes.js')});await page.addScriptTag({path:path.join(__dirname,'../games.js')});
 await page.evaluate(()=>{window.state={};window.game=LATIH_GAMES.create({shell:html=>document.querySelector('#app').innerHTML=html,getState:()=>state,save:()=>{},esc:s=>s,beep:()=>{}});game.home();});
 await page.locator('[data-open-game="spot"]').click();assert.equal(await page.locator('.lg-scene-board img').count(),0);
 const scenes=await page.evaluate(()=>LATIH_SPOT.scenes.map(s=>({id:s.id,spots:s.spots})));
 assert.deepEqual(scenes.map(s=>s.spots.length),[5,5,6,6,6,7,7,7,7,7,7,7,8,8,8,8,8,9,9,9]);
 for(let level=0;level<20;level++){
  const spots=scenes[level].spots;const boards=page.locator('[data-spot-board]');
  const a=await boards.nth(0).boundingBox(),b=await boards.nth(1).boundingBox();assert(Math.abs(a.width-b.width)<1&&Math.abs(a.height-b.height)<1,'equal pictures');
  assert(await page.locator('#lgSpotNext').isDisabled());
  await boards.nth(0).click({position:{x:3,y:3}});assert.match(await page.locator('#lgSpotFeedback').textContent(),/Belum tepat/);
  if(level===0){await page.locator('#lgSpotHint').click();assert.equal(await page.locator('.lg-scene-ring.hint').count(),2);}
  for(let i=0;i<spots.length;i++){
   const side=boards.nth(i%2);const box=await side.boundingBox();const m=spots[i];
   await side.click({position:{x:m.x/600*box.width,y:m.y/420*box.height}});
   assert.equal(await page.locator('.lg-scene-ring.found').count(),(i+1)*2);
   if(i===0){assert.equal(await page.locator('.lg-scene-ring.hint').count(),0);await side.click({position:{x:m.x/600*box.width,y:m.y/420*box.height}});assert.equal(await page.locator('.lg-scene-ring.found').count(),2);}
  }
  assert.equal(await page.locator('.lg-win-cover').count(),1);await page.locator('#lgWinNext').click();
 }
 assert.equal(await page.evaluate(()=>state.games.stars),20);
 await page.locator('#lgSpotHint').click();await page.waitForTimeout(2500);await page.locator('#lgSpotHint').click();await page.waitForTimeout(2500);assert(await page.locator('#lgSpotHint').isDisabled());
 await page.locator('#lgSpotLevel').selectOption('6');assert.match(await page.locator('#lgSpotFound').textContent(),/0 \/ 7/);assert.equal(await page.locator('.lg-scene-ring').count(),0);
 await page.locator('#lgSpotHint').click();await page.locator('[data-game-back]').click();await page.waitForTimeout(2500);assert.equal(await page.locator('[data-open-game]').count(),10);
 assert.deepEqual(errors,[]);await page.close();
}
console.log('Spot cartoon browser checks passed: 20 scenes, both pictures, scaled hits, mistakes, duplicate taps, hint limits/cleanup, level switch, progression and mobile/desktop layouts.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1);});
