// Deterministic animation clock plus real browser DOM/pointer regression.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{})});
 try{
  for(const viewport of [{width:390,height:844},{width:1280,height:800}]){
   const page=await browser.newPage({viewport,hasTouch:true});const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.setContent('<main id="app"></main>');
   await page.addStyleTag({path:path.join(__dirname,'../games.css')});
   await page.evaluate(()=>{
    let id=0;window.rafCallbacks=new Map();window.requestAnimationFrame=fn=>{rafCallbacks.set(++id,fn);return id;};window.cancelAnimationFrame=id=>rafCallbacks.delete(id);
    window.tick=time=>{const callbacks=[...rafCallbacks.values()];rafCallbacks.clear();callbacks.forEach(fn=>fn(time));};
   });
   // Expose closure state only in this test copy to set precise collision scenarios.
   const source=fs.readFileSync(path.join(__dirname,'../games.js'),'utf8').replace('return {home:hub,dispose,getCatalog:()=>definitions};','return {home:hub,dispose,getCatalog:()=>definitions,startWorm,stepWorm,updateWorm,getWorm:()=>worm};');
   await page.addScriptTag({content:source});
   await page.evaluate(()=>{
    window.state={};window.saves=0;window.game=LATIH_GAMES.create({shell:html=>document.querySelector('#app').innerHTML=html,getState:()=>state,save:()=>saves++,esc:s=>s,beep:()=>{}});game.home();
   });
   await page.locator('[data-open-game="worm"]').click();
   const run=fn=>page.evaluate(fn);
   await run(()=>{window.originalTile=document.querySelector('.lg-worm-tile');tick(0);tick(200);tick(275);tick(412.5);});
   assert.match(await page.locator('.lg-worm-segment.head').getAttribute('style'),/450%/,'half-cell smooth interpolation');
   assert(await run(()=>originalTile===document.querySelector('.lg-worm-tile')),'board tiles are preserved');
   await page.keyboard.press('ArrowUp');await page.keyboard.press('ArrowLeft');
   assert.deepEqual(await run(()=>game.getWorm().queue),['up','left']);
   await run(()=>{tick(550);tick(750);tick(825);});
   assert.equal(await run(()=>game.getWorm().dir),'left');
   await page.keyboard.press('ArrowRight');assert.deepEqual(await run(()=>game.getWorm().queue),[],'reverse rejected');
   await page.locator('#lgWormPause').click();const frozen=await run(()=>JSON.stringify(game.getWorm().snake));
   await page.keyboard.press('ArrowDown');await run(()=>tick(5000));
   assert.equal(await run(()=>JSON.stringify(game.getWorm().snake)),frozen);assert.equal(await run(()=>rafCallbacks.size),0);
   await page.locator('#lgWormPause').click();await run(()=>tick(6000));
   assert.equal(await run(()=>JSON.stringify(game.getWorm().snake)),frozen,'resume does not catch up');
   await run(()=>window.dispatchEvent(new Event('blur')));assert(await run(()=>game.getWorm().paused));
   await run(()=>game.startWorm());
   // Tapping the board steers relative to the head (head starts at cell 4,6 moving right); the d-pad is gone.
   assert.equal(await page.locator('[data-worm-dir]').count(),0,'d-pad buttons are removed');
   const tapBoard=page.locator('#lgWormBoard');const tapRect=await tapBoard.boundingBox();const tapCell=tapRect.width/12;
   const tapAt=(cx,cy)=>page.mouse.click(tapRect.x+(cx+.5)*tapCell,tapRect.y+(cy+.5)*tapCell);
   const queueNow=()=>run(()=>game.getWorm().queue);
   await tapAt(4,2);assert.deepEqual(await queueNow(),['up'],'tap above the head turns up');
   await run(()=>game.startWorm());await tapAt(4,10);assert.deepEqual(await queueNow(),['down'],'tap below the head turns down');
   await run(()=>game.startWorm());await tapAt(9,6);assert.deepEqual(await queueNow(),[],'tap straight ahead keeps going');
   await tapAt(0,6);assert.deepEqual(await queueNow(),[],'tap straight behind is ignored (no reverse)');
   await tapAt(4,6);assert.deepEqual(await queueNow(),[],'tap on the head is ignored');
   await tapAt(9,9);assert.deepEqual(await queueNow(),['down'],'tap ahead and below turns down');
   await run(()=>game.startWorm());await tapAt(0,2);assert.deepEqual(await queueNow(),['up'],'tap behind and above turns up');
   await run(()=>{game.startWorm();const w=game.getWorm();w.dir='up';w.snake=[{x:6,y:6},{x:6,y:7},{x:6,y:8}];w.previous=w.snake;});
   await tapAt(10,6);assert.deepEqual(await queueNow(),['right'],'moving up: tap to the right turns right');
   await run(()=>game.startWorm());await page.locator('#lgWormPause').click();await tapAt(4,2);
   assert.deepEqual(await queueNow(),[],'tap while paused does nothing');
   await run(()=>game.startWorm());
   const board=page.locator('#lgWormBoard');const rect=await board.boundingBox();
   await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);await page.mouse.down();
   await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2-35);
   assert.deepEqual(await run(()=>game.getWorm().queue),['up'],'swipe responds before release');await page.mouse.up();
   assert.equal(await board.evaluate(el=>getComputedStyle(el).touchAction),'none');
   await run(()=>{game.startWorm();const w=game.getWorm();w.food={x:5,y:6};game.stepWorm();game.updateWorm();});
   assert.equal(await run(()=>game.getWorm().score),1);assert.equal(await page.locator('.lg-worm-segment').count(),4);
   assert(await run(()=>!game.getWorm().snake.some(p=>p.x===game.getWorm().food.x&&p.y===game.getWorm().food.y)));
   await run(()=>{const w=game.getWorm();w.snake=[{x:11,y:6},{x:10,y:6}];w.previous=w.snake;game.stepWorm();});
   assert(await page.locator('#lgWormOverlay').isVisible());assert.equal(await run(()=>state.games.bestWorm),1);assert.equal(await run(()=>rafCallbacks.size),0);
   await page.locator('#lgWormAgain').click();assert.equal(await run(()=>game.getWorm().score),0);assert.equal(await run(()=>rafCallbacks.size),1);
   await run(()=>{const w=game.getWorm();w.snake=[{x:1,y:1},{x:1,y:2},{x:2,y:2},{x:2,y:1}];w.previous=w.snake;w.food={x:8,y:8};game.stepWorm();});
   assert.equal(await run(()=>game.getWorm().over),false,'moving into departing tail is legal');
   await run(()=>{game.startWorm();const w=game.getWorm();w.snake=[{x:1,y:1},{x:2,y:1},{x:2,y:2},{x:1,y:2}];w.previous=w.snake;game.stepWorm();});
   assert(await run(()=>game.getWorm().over),'body collision ends game');
   await run(()=>{game.startWorm();const w=game.getWorm();w.snake=[{x:10,y:0},...Array.from({length:144},(_,i)=>({x:i%12,y:Math.floor(i/12)})).filter(p=>!(p.y===0&&(p.x===10||p.x===11)))];w.previous=w.snake;w.food={x:11,y:0};w.score=140;game.stepWorm();});
   assert(await page.locator('#lgWormOverlay').isVisible());assert.match(await page.locator('#lgWormOverlay strong').textContent(),/menang/);assert.equal(await run(()=>state.games.bestWorm),141);
   // Keyboard: browser shortcuts stay untouched, plain keys still steer, odd events never throw.
   await run(()=>game.startWorm());
   assert.equal(await run(()=>{const e=new KeyboardEvent('keydown',{key:'s',ctrlKey:true,cancelable:true,bubbles:true});document.dispatchEvent(e);return e.defaultPrevented;}),false,'Ctrl+S is left to the browser');
   assert.equal(await run(()=>{const e=new KeyboardEvent('keydown',{key:'d',metaKey:true,cancelable:true,bubbles:true});document.dispatchEvent(e);return e.defaultPrevented;}),false,'Cmd+D is left to the browser');
   assert.deepEqual(await run(()=>game.getWorm().queue),[],'modified keys do not steer');
   assert.equal(await run(()=>{const e=new KeyboardEvent('keydown',{key:'W',cancelable:true,bubbles:true});document.dispatchEvent(e);return e.defaultPrevented;}),true,'plain W is handled');
   assert.deepEqual(await run(()=>game.getWorm().queue),['up'],'plain W steers');
   await run(()=>document.body.dispatchEvent(new Event('keydown',{bubbles:true})));
   // Space on a focused button must toggle pause exactly once (its own click), not twice.
   await run(()=>game.startWorm());
   assert.equal(await run(()=>{const e=new KeyboardEvent('keydown',{key:' ',bubbles:true,cancelable:true});document.querySelector('#lgWormPause').dispatchEvent(e);return e.defaultPrevented;}),false,'Space on a button is left to the button');
   assert.equal(await run(()=>game.getWorm().paused),false);
   await page.locator('#lgWormPause').focus();await page.keyboard.press('Space');
   assert.equal(await run(()=>game.getWorm().paused),true,'Space on the focused pause button toggles once');
   await run(()=>game.startWorm());await page.keyboard.press('Space');
   assert.equal(await run(()=>game.getWorm().paused),true,'Space with no button focused pauses');
   // A stalled frame drops its time instead of pausing the game or fast-forwarding it.
   await run(()=>{game.startWorm();tick(0);tick(1000);});
   assert.equal(await run(()=>game.getWorm().paused),false,'long frame does not pause by itself');
   assert.equal(await run(()=>game.getWorm().elapsed),0,'long frame time is dropped');
   assert.equal(await run(()=>rafCallbacks.size),1,'loop keeps running after a long frame');
   await run(()=>tick(1100));assert.equal(await run(()=>game.getWorm().elapsed),100,'normal timing resumes after a long frame');
   await run(()=>game.startWorm());await page.locator('[data-game-back]').click();assert.equal(await run(()=>rafCallbacks.size),0);
   await page.locator('[data-open-game="worm"]').click();await run(()=>game.dispose());assert.equal(await run(()=>rafCallbacks.size),0);await page.keyboard.press('ArrowUp');assert.deepEqual(await run(()=>game.getWorm().queue),[]);
   assert.deepEqual(errors,[]);await page.close();
  }
  console.log('Worm browser checks passed: mobile/desktop interpolation, queued turns, pointer/swipe, pause/resume, lifecycle, food, collisions, restart and full-board victory.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1);});
