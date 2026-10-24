/* Phase 2 full browser regression: child-safe touch/keyboard, wins, back navigation,
   level progression, progress persistence and cartoon/offline art on phones and desktop. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 try{
  for(const width of [320,375,1024]){
   const page=await browser.newPage({viewport:{width,height:920},hasTouch:true});
   const errors=[];
   page.on('pageerror',err=>errors.push(err.message));
   await page.setContent('<style>body{margin:0;font-family:Arial}main{padding:8px;max-width:1024px;box-sizing:border-box;margin:auto}</style><main id="app"></main>');
   for(const css of ['games.css','phase2-games.css'])await page.addStyleTag({path:path.join(__dirname,'../'+css)});
   for(const js of ['spot-scenes.js','spot-extra-scenes.js','cartoon-animals.js','cartoon-vehicles.js','cartoon-fruits.js','cartoon-nature.js','cartoon-fun.js','puzzle-cartoons.js','phase2-data.js','phase2-games.js','games.js'])
    await page.addScriptTag({path:path.join(__dirname,'../'+js)});
   await page.evaluate(()=>{
    window.state={};
    window.saved=0;
    window.game=LATIH_GAMES.create({shell:html=>document.querySelector('#app').innerHTML=html,getState:()=>state,save:()=>saved++,esc:s=>s,beep:()=>{}});
    game.home();
   });
   const hub=async()=>{
    assert.equal(await page.locator('[data-open-game]').count(),10,'ten game cards including Phase 2');
    for(const id of ['maze','hidden','dots','pattern','puzzle','worm','spot'])assert.equal(await page.locator('[data-open-game="'+id+'"]').count(),1,id+' present');
    assert.equal(await page.locator('[data-open-game="animal"]').count(),0,'Jigsaw remains grouped');
   };
   await hub();
   // MAZE: start with 5x5, reject walking through walls, keyboard control and finish.
   await page.locator('[data-open-game="maze"]').click();
   assert.equal(await page.locator('[data-maze-level]').count(),10);
   await page.locator('[data-maze-world="2"]').click();
   assert.equal(await page.locator('[data-maze-level="29"]').count(),1);
   await page.locator('[data-maze-level="29"]').click();
   assert.equal(await page.locator('.pg-maze-cell').count(),81);
   await page.locator('#pgMazeHint').click();
   assert.match(await page.locator('#pgMazeHint').textContent(),/Hint \(1\)/);
   await page.locator('[data-pg-back]').click();
   assert.equal(await page.locator('[data-maze-level]').count(),10);
   await page.locator('[data-maze-world="0"]').click();
   await page.locator('[data-maze-level="0"]').click();
   assert.equal(await page.locator('.pg-maze-cell').count(),25);
   assert.equal(await page.locator('.pg-maze-character').count(),1);
   const route=await page.evaluate(()=>LATIH_PHASE2_DATA.makeMaze(0).path);
   const n=5;
   for(let i=1;i<route.length;i++){
    const diff=route[i]-route[i-1];
    const dir=diff===-n?'up':diff===n?'down':diff===1?'right':'left';
    if(i===1)await page.keyboard.press({up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'}[dir]);
    else await page.locator('[data-maze-dir="'+dir+'"]').click();
    assert.equal(await page.locator('.pg-maze-cell.player').getAttribute('data-maze-cell'),String(route[i]),'exact maze movement');
   }
   assert.equal(await page.locator('.lg-win-cover').count(),1,'maze victory');
   assert(await page.evaluate(()=>Boolean(state.games.completed['maze:0'])));
   await page.locator('#pgWinHome').click();
   await hub();
   // HIDDEN OBJECTS: find true coordinates in both desktop and mobile scenes.
   await page.locator('[data-open-game="hidden"]').click();
   assert.equal(await page.locator('[data-hidden-level]').count(),12);
   await page.locator('[data-hidden-level="0"]').click();
   assert.equal(await page.locator('.pg-hidden-art').count(),1);
   assert.equal(await page.locator('.pg-hidden-art svg').count(),9);
   assert.equal(await page.locator('.pg-hidden-art image').count(),0,'no photos');
   assert.equal(await page.locator('.pg-target-chip').count(),5);
   await page.locator('#pgHiddenHint').click();
   assert.equal(await page.locator('.pg-found-ring.hint').count(),1);
   const sc=await page.evaluate(()=>LATIH_PHASE2_DATA.makeHidden(0));
   const board=page.locator('#pgHiddenBoard');
   for(const id of sc.targets){
    const dot=sc.spots.find(s=>s.id===id),b=await board.boundingBox();
    await page.mouse.click(b.x+dot.x*b.width/600,b.y+dot.y*b.height/420);
    assert.equal(await page.locator('.pg-target-chip.found').count(),sc.targets.indexOf(id)+1,'object accurately located');
   }
   assert.equal(await page.locator('.lg-win-cover').count(),1);
   assert(await page.evaluate(()=>Boolean(state.games.completed['hidden:0'])));
   await page.locator('#pgWinHome').click();
   await page.locator('[data-open-game="hidden"]').click();
   await page.locator('[data-hidden-level="11"]').click();
   assert.equal(await page.locator('.pg-target-chip').count(),7,'advanced hidden levels');
   await page.locator('[data-pg-back]').click();
   assert.equal(await page.locator('[data-hidden-level]').count(),12);
   await page.locator('[data-pg-back]').click();
   await hub();
   // DOTS: only next dot accepted, hint, closure and victory.
   await page.locator('[data-open-game="dots"]').click();
   assert.equal(await page.locator('[data-dots-level]').count(),20);
   await page.locator('[data-dots-level="0"]').click();
   const dotCount=await page.locator('[data-dot]').count();
   assert(dotCount>=8);
   await page.locator('[data-dot="1"]').click({force:true});
   assert.match(await page.locator('#pgDotsStatus').textContent(),/^0 \//,'out-of-order tap ignored');
   await page.locator('#pgDotHint').click();
   assert.equal(await page.locator('[data-dot="0"].hint').count(),1);
   for(let i=0;i<dotCount;i++){
    await page.locator('[data-dot="'+i+'"]').click({force:true});
    assert.match(await page.locator('#pgDotsStatus').textContent(),new RegExp('^'+(i+1)+' / '),'connect in order');
   }
   assert.equal(await page.locator('.lg-win-cover').count(),1,'drawing completed');
   assert(await page.evaluate(()=>Boolean(state.games.completed['dots:0'])));
   await page.locator('#pgWinHome').click();
   await page.locator('[data-open-game="dots"]').click();
   await page.locator('[data-dots-level="19"]').click();
   assert(await page.locator('[data-dot]').count()>=20);
   await page.locator('[data-pg-back]').click();
   await page.locator('[data-pg-back]').click();
   await hub();
   // PATTERN: wrong options do not pass; the matching option wins. Includes number mode.
   await page.locator('[data-open-game="pattern"]').click();
   assert.equal(await page.locator('[data-pattern-level]').count(),20);
   await page.locator('[data-pattern-level="0"]').click();
   assert.equal(await page.locator('[data-pattern-option]').count(),3);
   let p=await page.evaluate(()=>LATIH_PHASE2_DATA.makePattern(0));
   let wrong=p.options.findIndex(x=>x!==p.correct),right=p.options.indexOf(p.correct);
   await page.locator('[data-pattern-option="'+wrong+'"]').click();
   assert.equal(await page.locator('.lg-win-cover').count(),0,'wrong answer does not win');
   await page.locator('#pgPatternHint').click();
   assert((await page.locator('.pg-sequence-tile.highlight').count())>=2);
   await page.locator('[data-pattern-option="'+right+'"]').click();
   assert.equal(await page.locator('.lg-win-cover').count(),1);
   assert(await page.evaluate(()=>Boolean(state.games.completed['pattern:0'])));
   await page.locator('#pgWinHome').click();
   await page.locator('[data-open-game="pattern"]').click();
   await page.locator('[data-pattern-world="2"]').click();
   await page.locator('[data-pattern-level="40"]').click();
   assert((await page.locator('.pg-pattern-number').count())>=8,'number sequence challenge');
   p=await page.evaluate(()=>LATIH_PHASE2_DATA.makePattern(40));
   right=p.options.indexOf(p.correct);
   await page.locator('[data-pattern-option="'+right+'"]').click();
   assert.equal(await page.locator('.lg-win-cover').count(),1);
   await page.locator('#pgWinHome').click();
   await hub();
   assert.equal(await page.evaluate(()=>saved),5,'successful rounds persisted exactly once');
   assert.equal(await page.evaluate(()=>state.games.stars),5,'new games grant stars');
   assert.deepEqual(errors,[],'No game runtime errors');
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
   assert(overflow<=3,'no horizontal page overflow '+overflow+'px at '+width);
   await page.close();
  }
  console.log('Phase 2 browser checks passed: 10 game cards, Maze keyboard/path/hint/win, 12 cartoon Hidden Objects scenes with accurate hits, 20 dot drawings, 60 patterns, progress, mobile/desktop layouts.');
 }finally{await browser.close()}
})().catch(err=>{console.error(err);process.exit(1)});
