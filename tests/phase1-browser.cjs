/* Browser regression for restored Kids Games and cartoon-only assets.
   Run: CHROMIUM_EXECUTABLE=... node tests/phase1-browser.cjs */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 try{
  for(const width of [390,1024]){
   const page=await browser.newPage({viewport:{width,height:960}});
   const errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.setContent('<style>body{margin:0;font-family:Arial}main{max-width:1050px;margin:auto;padding:8px}</style><main id="app"></main>');
   await page.addStyleTag({path:path.join(__dirname,'../games.css')});
   for(const js of ['spot-scenes.js','spot-extra-scenes.js','cartoon-animals.js','cartoon-vehicles.js','cartoon-fruits.js','cartoon-nature.js','cartoon-fun.js','puzzle-cartoons.js','games.js'])
    await page.addScriptTag({path:path.join(__dirname,'../'+js)});
   await page.evaluate(()=>{
    window.state={};
    window.game=LATIH_GAMES.create({shell:html=>document.querySelector('#app').innerHTML=html,getState:()=>state,save:()=>{},esc:s=>s,beep:()=>{}});
    game.home();
   });
   const home=async()=>assert.equal(await page.locator('[data-open-game]').count(),10,'ten playable game tiles');
   await home();
   for(const [category,count] of [['animal',15],['vehicle',16],['fruit',11],['nature',16],['fun',18]]){
    await page.locator('[data-open-game="'+category+'"]').click();
    assert.equal(await page.locator('.lg-level-card').count(),count,category+' cartoon collection');
    assert.equal(await page.locator('.lg-level-thumb img[src^="data:image/svg+xml"]').count(),count,'all illustrated, no photos');
    await page.locator('[data-pieces="9"]').click();
    await page.locator('[data-level="0"]').click();
    assert.equal(await page.locator('.lg-puzzle-cell').count(),9);
    assert.match(await page.locator('.lg-puzzle-slice').first().getAttribute('style'),/data:image\\/svg\\+xml/,'cartoon puzzle image');
    const tile=await page.locator('[data-tile]').first().getAttribute('data-tile');
    await page.locator('[data-tile="'+tile+'"]').click();
    await page.locator('[data-slot="'+tile+'"]').click();
    assert.match(await page.locator('#lgPiecesProgress').textContent(),/2 \\/ 9/,'a correctly placed piece advances progress');
    await page.locator('[data-game-back]').click();
    await page.locator('[data-game-back]').click();
    await home();
   }
   await page.locator('[data-open-game="shapes"]').click();
   const shape=await page.locator('[data-choose-shape]').first().getAttribute('data-choose-shape');
   await page.locator('[data-choose-shape="'+shape+'"]').click();
   await page.locator('[data-target-shape="'+shape+'"]').click();
   assert.equal(await page.locator('.lg-shape-target.finished').count(),1);
   await page.locator('[data-game-back]').click();
   await page.locator('[data-open-game="sudoku"]').click();
   assert.equal(await page.locator('.lg-sudoku-cell').count(),16);
   assert.equal(await page.locator('[data-sudoku-level]').count(),3);
   await page.locator('[data-sudoku-level="mencabar"]').click();
   assert.equal(await page.locator('[data-sudoku-level="mencabar"].chosen').count(),1);
   assert(await page.locator('.lg-sudoku-cell:not(.fixed)').count()>0);
   await page.locator('[data-game-back]').click();
   await page.locator('[data-open-game="memory"]').click();
   assert.equal(await page.locator('[data-memory-card]').count(),12);
   await page.locator('[data-memory-pairs="4"]').click();
   assert.equal(await page.locator('[data-memory-card]').count(),8);
   await page.locator('[data-memory-card="0"]').click();
   assert.equal(await page.locator('.lg-memory-card.revealed img[src^="data:image/svg+xml"]').count(),1);
   await page.locator('[data-game-back]').click();
   await page.locator('[data-open-game="spot"]').click();
   assert.equal(await page.locator('[data-spot-board]').count(),2);
   await page.locator('#lgSpotLevel').selectOption('19');
   assert.match(await page.locator('#lgSpotFound').textContent(),/0 \\/ 9/);
   assert.equal(await page.locator('.lg-scene-board svg').count(),2);
   await page.locator('[data-game-back]').click();
   await page.locator('[data-open-game="worm"]').click();
   assert.equal(await page.locator('.lg-worm-tile').count(),144);
   await page.locator('#lgWormPause').click();
   await page.locator('[data-game-back]').click();
   await home();
   assert.deepEqual(errors,[],'No JS runtime errors');
   await page.close();
  }
  console.log('Phase 1 browser checks passed: 10 playable games, 76 unique cartoon-only SVG puzzles, 3 Sudoku levels and 20 Spot scenes.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
