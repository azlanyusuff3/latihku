/* LatihKu Kids Games Phase 2 — four original offline-first educational mini games.
   Requires phase2-data.js and the already bundled cartoon sprite files. */
(function(){
'use strict';
const DATA=window.LATIH_PHASE2_DATA;
if(!DATA)throw new Error('phase2-data.js must load before phase2-games.js');
const total={maze:30,hidden:12,dots:20,pattern:60};
function create({shell,getState,save,esc,beep,onBack}){
 let gameId=null,view='menu',mazeGroup=0,patternGroup=0,maze=null,hidden=null,dots=null,pattern=null,tipTimer=null,mazeListening=false,swipeStart=null,lastSwipe=0;
 const sprites=window.LATIH_CARTOON_SPRITES||{};
 const safe=(s)=>esc(String(s));
 const progress=()=>{
  const state=getState();
  if(!state.games||typeof state.games!=='object')state.games={completed:{},stars:0};
  if(!state.games.completed||typeof state.games.completed!=='object')state.games.completed={};
  return state.games;
 };
 const done=key=>!!progress().completed[key];
 const completedCount=(prefix,n)=>Array.from({length:n},(_,i)=>done(prefix+':'+i)?1:0).reduce((a,b)=>a+b,0);
 const reward=key=>{
  const state=progress();
  if(!state.completed[key]){state.completed[key]=Date.now();state.stars=(Number(state.stars)||0)+1;try{save(true)}catch{}}
 };
 const sound=ok=>{try{beep(ok)}catch{}};
 const clearTip=()=>{if(tipTimer!==null){clearTimeout(tipTimer);tipTimer=null;}};
 const detachMaze=()=>{swipeStart=null;lastSwipe=0;if(mazeListening){document.removeEventListener('keydown',mazeKey);mazeListening=false;}};
 function dispose(){clearTip();detachMaze();swipeStart=null;maze=null;hidden=null;dots=null;pattern=null;view='menu';}
 const header=(name,meta='')=>'<header class="lg-gamehead"><button type="button" class="lg-back" data-pg-back aria-label="Kembali">‹</button><h1>'+safe(name)+'</h1>'+(meta?'<span class="lg-head-pill">'+safe(meta)+'</span>':'')+'</header>';
 function paint(title,meta,html){
  shell('<div class="lg-screen pg-screen">'+header(title,meta)+html+'</div>','games');
  document.querySelector('[data-pg-back]')?.addEventListener('click',back);
 }
 const feedback=(msg,good=false)=>{
  const node=document.querySelector('#pgFeedback');if(!node)return;
  node.textContent=msg;node.classList.toggle('pg-good',!!good);
 };
 function success(title,emoji,description,next){
  document.querySelector('.pg-screen .lg-win-cover')?.remove();
  const root=document.querySelector('.pg-screen');if(!root)return;
  const overlay=document.createElement('div');overlay.className='lg-win-cover';
  overlay.innerHTML='<div class="lg-win-card"><div class="lg-win-emoji">'+safe(emoji)+'</div><h2>'+safe(title)+'</h2><p>'+safe(description)+'</p><div class="lg-win-stars">⭐ ⭐ ⭐</div><small>Jumlah bintang: '+Number(progress().stars||0)+'</small><div class="lg-win-buttons"><button type="button" class="lg-action lg-action-light" id="pgWinHome">Semua Games</button><button type="button" class="lg-action lg-action-green" id="pgWinNext">Seterusnya ❯</button></div></div>';
  root.appendChild(overlay);
  overlay.querySelector('#pgWinHome').onclick=()=>onBack();
  overlay.querySelector('#pgWinNext').onclick=next;
 }
 function back(){
  clearTip();
  if(view==='maze-play')return mazeSelect(Math.floor(maze.level/10));
  if(view==='hidden-play')return hiddenSelect();
  if(view==='dots-play')return dotsSelect();
  if(view==='pattern-play')return patternSelect(Math.floor(pattern.level/20));
  detachMaze();
  onBack();
 }
 function open(id){
  dispose();gameId=id;
  if(id==='maze')return mazeSelect();
  if(id==='hidden')return hiddenSelect();
  if(id==='dots')return dotsSelect();
  if(id==='pattern')return patternSelect();
  throw new Error('Unknown Phase 2 game: '+id);
 }
 function gameHero(emoji,title,subtitle,number){
  return '<section class="pg-intro"><span class="pg-intro-emoji" aria-hidden="true">'+emoji+'</span><div><h2>'+safe(title)+'</h2><p>'+safe(subtitle)+'</p><span class="pg-intro-badge">⭐ '+number+' level selesai</span></div></section>';
 }
 function choiceTabs(groups,active,callbackAttr){
  return '<div class="pg-difficulty-tabs" role="group" aria-label="Pilih tahap">'+groups.map((g,i)=>'<button type="button" data-'+callbackAttr+'="'+i+'" class="'+(i===active?'active':'')+'" aria-pressed="'+(i===active)+'">'+g+'</button>').join('')+'</div>';
 }
 function levelCards(start,count,key,icon,names,attr){
  return '<section class="pg-level-grid" aria-label="Pilih level">'+Array.from({length:count},(_,i)=>{
   const l=start+i;
   return '<button type="button" data-'+attr+'="'+l+'" class="pg-level-button '+(done(key+':'+l)?'is-done':'')+'"><span class="pg-level-emoji">'+(typeof icon==='function'?icon(l):icon)+'</span><strong>Level '+(l+1)+'</strong>'+(names?'<small>'+safe(names(l))+'</small>':'')+'<span class="pg-level-star">'+(done(key+':'+l)?'⭐ Siap':'Mula ›')+'</span></button>';
  }).join('')+'</section>';
 }
 /* MAZE: iterative perfect maze with guaranteed route, swipe/keyboard/D-pad controls. */
 function mazeSelect(group=mazeGroup){
  detachMaze();clearTip();view='maze-select';mazeGroup=Math.max(0,Math.min(2,Number(group)||0));
  const w=DATA.mazeWorlds[mazeGroup];
  paint('Maze Adventure','30 level',gameHero('🐰','Bantu haiwan cari jalan!','Gerakkan haiwan comel sampai ke hadiah. Guna anak panah atau swipe pada peta.',completedCount('maze',30))+
   choiceTabs(DATA.mazeWorlds.map(w=>w.name),mazeGroup,'maze-world')+
   '<p class="pg-chapter">🌈 '+safe(w.name)+' · '+(mazeGroup===0?'Mudah: 5 × 5':mazeGroup===1?'Sederhana: 7 × 7':'Mencabar: 9 × 9')+'</p>'+
   levelCards(mazeGroup*10,10,'maze',w.emoji,null,'maze-level'));
  document.querySelectorAll('[data-maze-world]').forEach(b=>b.onclick=()=>mazeSelect(Number(b.dataset.mazeWorld)));
  document.querySelectorAll('[data-maze-level]').forEach(b=>b.onclick=()=>startMaze(Number(b.dataset.mazeLevel)));
 }
 function mazeCell(index){
  const w=maze.cells[index],n=maze.size;
  const sty='border-top:'+(w&1?'3px solid #367a8b':'3px solid transparent')+
   ';border-right:'+(w&2?'3px solid #367a8b':'3px solid transparent')+
   ';border-bottom:'+(w&4?'3px solid #367a8b':'3px solid transparent')+
   ';border-left:'+(w&8?'3px solid #367a8b':'3px solid transparent');
  const player=index===maze.current,goal=index===n*n-1,covered=maze.walked.has(index);
  return '<div data-maze-cell="'+index+'" role="gridcell" class="pg-maze-cell '+(covered?'visited ':'')+(player?'player ':'')+(goal?'goal ':'')+(maze.highlight===index?'is-hint':'')+'" style="'+sty+'" aria-label="'+(player?'Haiwan di sini':goal?'Destinasi':'Laluan')+'">'+(goal?'<span class="pg-maze-prize">'+maze.world.target+'</span>':'')+(player?'<span class="pg-maze-character">'+maze.world.emoji+'</span>':'')+'</div>';
 }
 function renderMaze(){
  const board=document.querySelector('#pgMazeBoard');if(!board)return;
  if(board.children.length!==maze.cells.length)board.innerHTML=maze.cells.map((_,i)=>mazeCell(i)).join('');
  else maze.cells.forEach((_,i)=>{const cell=board.children[i],player=i===maze.current;cell.classList.toggle('player',player);cell.classList.toggle('visited',maze.walked.has(i));cell.classList.toggle('is-hint',maze.highlight===i);cell.setAttribute('aria-label',player?'Haiwan di sini':i===maze.cells.length-1?'Destinasi':'Laluan');cell.querySelector('.pg-maze-character')?.remove();if(player)cell.insertAdjacentHTML('beforeend','<span class="pg-maze-character">'+maze.world.emoji+'</span>');});
  const moveInfo=document.querySelector('#pgMazeMoves');if(moveInfo)moveInfo.textContent=maze.steps+' langkah';
  const hintButton=document.querySelector('#pgMazeHint');if(hintButton)hintButton.textContent='💡 Hint ('+maze.hints+')';
  if(hintButton)hintButton.disabled=maze.hints<1||maze.highlight>=0||maze.won;
 }
 function mazeKey(e){
  if(view!=='maze-play'||!maze||maze.won||e.ctrlKey||e.metaKey||e.altKey||e.target?.closest?.('input,textarea,select'))return;
  const dirs={ArrowUp:'up',ArrowRight:'right',ArrowDown:'down',ArrowLeft:'left',w:'up',W:'up',d:'right',D:'right',s:'down',S:'down',a:'left',A:'left'};
  const dir=dirs[e.key];if(!dir)return;
  e.preventDefault();moveMaze(dir);
 }
 function moveMaze(direction){
  if(view!=='maze-play'||!maze||maze.won)return false;
  const d=DATA.moves.find(x=>x.name===direction);if(!d||(maze.cells[maze.current]&d.bit))return false;
  const x=maze.current%maze.size,y=Math.floor(maze.current/maze.size),nx=x+d.dx,ny=y+d.dy;
  if(nx<0||ny<0||nx>=maze.size||ny>=maze.size)return false;
  clearTip();
  maze.current=ny*maze.size+nx;maze.steps++;maze.walked.add(maze.current);maze.highlight=-1;
  renderMaze();
  if(maze.current===maze.cells.length-1){
   maze.won=true;clearTip();detachMaze();reward('maze:'+maze.level);sound(true);
   success('Jalan ditemui!',maze.world.target,'Hebat! Kamu sampai ke destinasi dalam '+maze.steps+' langkah.',()=>startMaze((maze.level+1)%30));
  }
  return true;
 }
 function startMaze(level){
  detachMaze();clearTip();view='maze-play';
  const base=DATA.makeMaze(level);
  maze={...base,current:0,steps:0,hints:2,highlight:-1,walked:new Set([0]),won:false};
  paint('Maze Adventure','Level '+(level+1)+'/30',
   '<p class="pg-instruction">🐰 Bantu '+safe(maze.world.emoji)+' sampai ke '+safe(maze.world.target)+'! Gunakan butang, swipe atau keyboard.</p>'+
   '<div class="pg-game-stats"><span id="pgMazeMoves">0 langkah</span><span>'+maze.size+' × '+maze.size+' laluan</span></div>'+
   '<div class="pg-maze-frame"><div id="pgMazeBoard" class="pg-maze-board" role="grid" aria-label="Peta maze" style="--pg-maze:'+maze.size+'"></div></div>'+
   '<div class="pg-maze-controls" aria-label="Kawal pergerakan"><button type="button" class="pg-direction up" data-maze-dir="up" aria-label="Atas">↑</button><button type="button" class="pg-direction left" data-maze-dir="left" aria-label="Kiri">←</button><div class="pg-control-face">🐰</div><button type="button" class="pg-direction right" data-maze-dir="right" aria-label="Kanan">→</button><button type="button" class="pg-direction down" data-maze-dir="down" aria-label="Bawah">↓</button></div>'+
   '<div class="pg-actions"><button type="button" id="pgMazeHint" class="pg-soft-action">💡 Hint (2)</button><button type="button" id="pgMazeReplay" class="pg-soft-action">↻ Ulang</button></div><p id="pgFeedback" class="pg-feedback" aria-live="polite">Mulakan dari penjuru kiri atas!</p>');
  renderMaze();
  document.querySelectorAll('[data-maze-dir]').forEach(b=>b.onclick=()=>moveMaze(b.dataset.mazeDir));
  document.querySelector('#pgMazeReplay').onclick=()=>startMaze(level);
  document.querySelector('#pgMazeHint').onclick=()=>{
   if(maze.won||maze.hints<1||maze.highlight>=0)return;
   const route=DATA.mazePath(maze,maze.current);
   if(route.length<2)return;
   maze.hints--;maze.highlight=route[1];renderMaze();
   feedback('Lihat petak berkilau untuk jalan seterusnya.',true);
   clearTip();tipTimer=setTimeout(()=>{maze.highlight=-1;renderMaze();tipTimer=null;},1800);
  };
  const board=document.querySelector('#pgMazeBoard');
  board.addEventListener('click',e=>{
   if(Date.now()-lastSwipe<260)return;
   const rect=board.getBoundingClientRect(),cx=Math.floor((e.clientX-rect.left)/rect.width*maze.size),cy=Math.floor((e.clientY-rect.top)/rect.height*maze.size);
   if(cx<0||cy<0||cx>=maze.size||cy>=maze.size)return;
   const i=cy*maze.size+cx,dx=i%maze.size-maze.current%maze.size,dy=Math.floor(i/maze.size)-Math.floor(maze.current/maze.size);
   if(Math.abs(dx)+Math.abs(dy)!==1)return;
   moveMaze(dx===1?'right':dx===-1?'left':dy===1?'down':'up');
  });
  board.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0||maze.won)return;swipeStart={x:e.clientX,y:e.clientY,id:e.pointerId};board.setPointerCapture(e.pointerId);});
  board.addEventListener('pointerup',e=>{
   if(!swipeStart||swipeStart.id!==e.pointerId)return;
   const dx=e.clientX-swipeStart.x,dy=e.clientY-swipeStart.y;swipeStart=null;
   if(Math.max(Math.abs(dx),Math.abs(dy))<23)return;
   lastSwipe=Date.now();moveMaze(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up');
  });
  for(const event of ['pointercancel','lostpointercapture'])board.addEventListener(event,()=>{swipeStart=null;});
  document.addEventListener('keydown',mazeKey);mazeListening=true;
 }
 /* HIDDEN OBJECTS: twelve hand-composed cartoon worlds with precise hit boxes. */
 const hiddenThumb=(id)=>sprites[id]?'<svg aria-hidden="true" viewBox="0 0 36 36">'+sprites[id]+'</svg>':'<span aria-hidden="true">⭐</span>';
 function hiddenSelect(){
  clearTip();view='hidden-select';hidden=null;
  paint('Hidden Objects','12 dunia',gameHero('🔎','Cari benda tersembunyi!','Tengok gambar kartun, cari objek dalam senarai, dan sentuh objek yang betul.',completedCount('hidden',12))+
   '<section class="pg-level-grid pg-scene-grid" aria-label="Pilih dunia cari objek">'+DATA.hiddenSpecs.map((spec,i)=>
    '<button type="button" class="pg-level-button pg-scene-card '+(done('hidden:'+i)?'is-done':'')+'" data-hidden-level="'+i+'"><span class="pg-scene-emoji">'+spec[1]+'</span><strong>'+safe(spec[0])+'</strong><small>Level '+(i+1)+' · '+(i<4?5:i<8?6:7)+' objek</small><span class="pg-level-star">'+(done('hidden:'+i)?'⭐ Siap':'Teroka ›')+'</span></button>'
   ).join('')+'</section>');
  document.querySelectorAll('[data-hidden-level]').forEach(b=>b.onclick=()=>startHidden(Number(b.dataset.hiddenLevel)));
 }
 function hiddenTargetsHtml(){
  return hidden.scene.targets.map(id=>{
   const found=hidden.found.has(id);
   const spot=hidden.scene.spots.find(s=>s.id===id);
   return '<span class="pg-target-chip '+(found?'found':'')+'" data-object-chip="'+id+'">'+hiddenThumb(id)+'<span>'+safe(spot.label)+'</span><b>'+ (found?'✓':'○')+'</b></span>';
  }).join('');
 }
 function updateHidden(){
  const targets=document.querySelector('#pgHiddenTargets');if(targets)targets.innerHTML=hiddenTargetsHtml();
  const counter=document.querySelector('#pgHiddenCount');if(counter)counter.textContent=hidden.found.size+' / '+hidden.scene.targets.length+' ditemui';
  const marker=document.querySelector('#pgFoundMarks');if(marker)marker.innerHTML=hidden.scene.spots.filter(s=>hidden.found.has(s.id)||hidden.hint===s.id)
   .map(s=>'<span class="pg-found-ring '+(hidden.found.has(s.id)?'found':'hint')+'" style="left:'+(s.x/6)+'%;top:'+(s.y/4.2)+'%;width:'+(s.r*2/6)+'%;height:'+(s.r*2/4.2)+'%">'+(hidden.found.has(s.id)?'✓':'')+'</span>').join('');
  const hint=document.querySelector('#pgHiddenHint');if(hint){hint.textContent='💡 Hint ('+hidden.hints+')';hint.disabled=hidden.hints<1;}
 }
 function startHidden(index){
  clearTip();view='hidden-play';hidden={scene:DATA.makeHidden(index),found:new Set(),hints:2,hint:null,won:false};
  paint('Hidden Objects','Level '+(index+1)+'/12',
   '<p class="pg-instruction">🔎 Cari objek dalam gambar kartun. Boleh sentuh mana-mana objek yang diminta!</p>'+
   '<div class="pg-game-stats"><b>'+safe(hidden.scene.emoji)+' '+safe(hidden.scene.name)+'</b><span id="pgHiddenCount">0 / '+hidden.scene.targets.length+' ditemui</span></div>'+
   '<div class="pg-hidden-frame"><div id="pgHiddenBoard" class="pg-hidden-board" role="img" aria-label="Peta objek tersembunyi">'+DATA.hiddenSvg(hidden.scene,sprites)+'<div id="pgFoundMarks" class="pg-found-marks"></div></div></div>'+
   '<div class="pg-tray-label">🎯 Cari objek ini:</div><div id="pgHiddenTargets" class="pg-target-grid"></div>'+
   '<div class="pg-actions"><button type="button" id="pgHiddenHint" class="pg-soft-action">💡 Hint (2)</button><button type="button" class="pg-soft-action" id="pgHiddenRestart">↻ Cuba semula</button></div>'+
   '<p id="pgFeedback" class="pg-feedback" aria-live="polite">Perhatikan gambar, kemudian sentuh objeknya.</p>');
  updateHidden();
  const board=document.querySelector('#pgHiddenBoard');
  board.addEventListener('click',e=>{
   if(hidden.won)return;
   const box=board.getBoundingClientRect();
   const x=(e.clientX-box.left)/box.width*600,y=(e.clientY-box.top)/box.height*420;
   if(!Number.isFinite(x)||!Number.isFinite(y))return;
   const candidate=hidden.scene.spots.find(s=>Math.hypot(s.x-x,s.y-y)<=s.r);
   if(!candidate){feedback('Belum tepat. Cuba perhatikan objek lain.');sound(false);return;}
   if(!hidden.scene.targets.includes(candidate.id)){feedback('Bagus cuba! Objek itu bukan dalam senarai carian.');return;}
   if(hidden.found.has(candidate.id))return;
   hidden.found.add(candidate.id);
   if(hidden.hint===candidate.id){clearTip();hidden.hint=null;}
   sound(true);updateHidden();feedback('Betul! '+candidate.label+' dijumpai.',true);
   if(hidden.found.size===hidden.scene.targets.length){
    hidden.won=true;reward('hidden:'+index);
    success('Mata helang!','🔎','Semua '+hidden.scene.targets.length+' objek kartun berjaya dijumpai.',()=>startHidden((index+1)%total.hidden));
   }
  });
  document.querySelector('#pgHiddenHint').onclick=()=>{
   if(hidden.hints<=0||hidden.won)return;
   const next=hidden.scene.targets.find(id=>!hidden.found.has(id));
   if(!next)return;
   hidden.hints--;hidden.hint=next;updateHidden();feedback('Cari bulatan berkilau pada gambar.',true);
   clearTip();tipTimer=setTimeout(()=>{hidden.hint=null;updateHidden();tipTimer=null;},2400);
  };
  document.querySelector('#pgHiddenRestart').onclick=()=>startHidden(index);
 }
 /* CONNECT THE DOTS: numbered, large tappable points and a colour reveal. */
 function dotsSelect(){
  clearTip();view='dots-select';dots=null;
  paint('Connect the Dots','20 lukisan',gameHero('✏️','Sambung Titik!','Sentuh nombor ikut turutan 1, 2, 3... supaya gambar kartun terbentuk.',completedCount('dots',20))+
   '<section class="pg-level-grid" aria-label="Pilih gambar sambung titik">'+DATA.dotShapes.map((d,i)=>
   '<button type="button" class="pg-level-button '+(done('dots:'+i)?'is-done':'')+'" data-dots-level="'+i+'"><span class="pg-level-emoji">'+d.emoji+'</span><strong>'+safe(d.name)+'</strong><small>'+d.points.length+' titik</small><span class="pg-level-star">'+(done('dots:'+i)?'⭐ Siap':'Lukis ›')+'</span></button>').join('')+'</section>');
  document.querySelectorAll('[data-dots-level]').forEach(b=>b.onclick=()=>startDots(Number(b.dataset.dotsLevel)));
 }
 function renderDots(){
  if(!dots)return;
  const d=dots.shape;
  const stage=document.querySelector('#pgDotsStage');if(!stage)return;
  const points=d.points,line=d.step>=1?points.slice(0,d.step).map(p=>p.join(',')).join(' '):'';
  const complete=d.step===points.length;
  const art='<svg viewBox="0 0 600 420" aria-hidden="true" preserveAspectRatio="none"><rect width="600" height="420" rx="22" fill="#f0faff"/>'+
   '<g fill="#d5f4e1" opacity=".7"><circle cx="56" cy="77" r="28"/><circle cx="531" cy="349" r="40"/><circle cx="504" cy="87" r="14"/></g>'+
   (complete?'<polygon points="'+points.map(p=>p.join(',')).join(' ')+'" fill="#ffdb87" opacity=".64" stroke="#ef9c6b" stroke-width="4"/>':'')+
   (d.step>=2?'<polyline points="'+line+'" fill="none" stroke="#298bc9" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>':'')+
   (complete?'<text x="300" y="220" text-anchor="middle" font-size="87" opacity=".95">'+d.emoji+'</text>':'')+'</svg>';
  const buttons=points.map(([x,y],i)=>{
   const finished=i<dots.step,active=i===dots.step;
   return '<button type="button" data-dot="'+i+'" aria-label="Titik '+(i+1)+'" class="pg-dot-node '+(finished?'done':'')+' '+(active?'next':'')+' '+(dots.highlight===i?'hint':'')+'" style="left:'+(x/6)+'%;top:'+(y/4.2)+'%" '+(finished?'disabled':'')+'>'+(finished?'✓':i+1)+'</button>';
  }).join('');
  stage.innerHTML=art+'<div class="pg-dot-layer">'+buttons+'</div>';
  const status=document.querySelector('#pgDotsStatus');if(status)status.textContent=dots.step+' / '+points.length+' titik';
  const next=document.querySelector('#pgDotNext');if(next)next.textContent=complete?'Siap!':(dots.step+1);
  const hint=document.querySelector('#pgDotHint');if(hint){hint.textContent='💡 Hint ('+dots.hints+')';hint.disabled=dots.hints<1||dots.won;}
 }
 function dotTap(i){
  if(view!=='dots-play'||!dots||dots.won)return;
  if(i!==dots.step){feedback('Cari nombor '+(dots.step+1)+' dahulu.');sound(false);return;}
  dots.step++;dots.highlight=-1;sound(true);renderDots();
  feedback('Bagus! Sambung ke titik '+(dots.step+1)+'.',true);
  if(dots.step===dots.shape.points.length){
   dots.won=true;reward('dots:'+dots.shape.index);
   feedback('Lukisan '+dots.shape.name+' siap!',true);
   success('Lukisan siap!',dots.shape.emoji,'Cantik! Semua '+dots.shape.points.length+' titik sudah disambungkan.',()=>startDots((dots.shape.index+1)%total.dots));
  }
 }
 function startDots(index){
  clearTip();view='dots-play';const shape=DATA.dotShapes[index];if(!shape)throw new RangeError('Dots level not found');
  dots={shape,step:0,hints:2,highlight:-1,won:false};
  paint('Connect the Dots','Level '+(index+1)+'/20',
   '<p class="pg-instruction">✏️ Sentuh nombor mengikut turutan. Sambung dan lihat gambar kartun terbentuk!</p>'+
   '<div class="pg-game-stats"><b>'+shape.emoji+' '+safe(shape.name)+'</b><span id="pgDotsStatus">0 / '+shape.points.length+' titik</span></div>'+
   '<div class="pg-dot-frame"><div class="pg-dots-stage" id="pgDotsStage"></div></div>'+
   '<p class="pg-dot-guidance">👉 Seterusnya: <strong id="pgDotNext">1</strong></p>'+
   '<div class="pg-actions"><button type="button" id="pgDotHint" class="pg-soft-action">💡 Hint (2)</button><button type="button" id="pgDotRestart" class="pg-soft-action">↻ Ulang</button></div>'+
   '<p id="pgFeedback" class="pg-feedback" aria-live="polite">Mula dengan titik nombor 1.</p>');
  renderDots();
  document.querySelector('#pgDotsStage').addEventListener('click',e=>{
   const b=e.target.closest('[data-dot]');if(b)dotTap(Number(b.dataset.dot));
  });
  document.querySelector('#pgDotHint').onclick=()=>{
   if(dots.hints<1||dots.won)return;
   dots.hints--;dots.highlight=dots.step;renderDots();feedback('Nombor yang berkilau ialah titik seterusnya.',true);
   clearTip();tipTimer=setTimeout(()=>{dots.highlight=-1;renderDots();tipTimer=null;},1600);
  };
  document.querySelector('#pgDotRestart').onclick=()=>startDots(index);
 }
 /* PATTERN DETECTIVE: 60 deterministic, non-ambiguous icon/number sequences. */
 const patternNames=['Mudah','Sederhana','Mencabar'];
 const patternMedia=(token)=>{
  if(typeof token==='number')return '<span class="pg-pattern-number">'+token+'</span>';
  const icon=sprites[token];if(!icon)throw new Error('Missing pattern sprite: '+token);
  return '<svg viewBox="0 0 36 36" aria-hidden="true">'+icon+'</svg>';
 };
 function patternSelect(group=patternGroup){
  clearTip();view='pattern-select';patternGroup=Math.max(0,Math.min(2,Number(group)||0));pattern=null;
  paint('Pattern Detective','60 corak',gameHero('🧠','Cari corak seterusnya!','Lihat susunan gambar atau nombor, kemudian pilih jawapan yang paling sesuai.',completedCount('pattern',60))+
   choiceTabs(patternNames,patternGroup,'pattern-world')+
   '<p class="pg-chapter">✨ '+patternNames[patternGroup]+' · 20 level</p>'+
   levelCards(patternGroup*20,20,'pattern','🧩',null,'pattern-level'));
  document.querySelectorAll('[data-pattern-world]').forEach(b=>b.onclick=()=>patternSelect(Number(b.dataset.patternWorld)));
  document.querySelectorAll('[data-pattern-level]').forEach(b=>b.onclick=()=>startPattern(Number(b.dataset.patternLevel)));
 }
 function patternStrip(){
  const shown=pattern.shown;
  return shown.map((id,i)=>'<div class="pg-sequence-tile '+(pattern.hint&&i<pattern.unit?'highlight':'')+'">'+patternMedia(id)+'</div>').join('')+
   '<div class="pg-sequence-tile mystery" aria-label="Corak yang hilang">?</div>';
 }
 function startPattern(level){
  clearTip();view='pattern-play';pattern={...DATA.makePattern(level),hint:false,won:false,attempts:0};
  paint('Pattern Detective','Level '+(level+1)+'/60',
   '<p class="pg-instruction">🧠 Apa yang patut datang selepas susunan ini?</p>'+
   '<div class="pg-pattern-stage"><div class="pg-pattern-head"><span>'+patternNames[pattern.group]+'</span><span>'+(pattern.kind==='number'?'🔢 Nombor':'🎨 Gambar')+'</span></div>'+
   '<div id="pgPatternStrip" class="pg-sequence-row">'+patternStrip()+'</div>'+
   '<p class="pg-tray-label">Pilih gambar atau nombor yang betul:</p>'+
   '<div class="pg-pattern-options">'+pattern.options.map((token,i)=>
   '<button type="button" class="pg-answer" data-pattern-option="'+i+'" aria-label="Pilihan '+(i+1)+'">'+patternMedia(token)+'</button>').join('')+'</div></div>'+
   '<div class="pg-actions"><button id="pgPatternHint" type="button" class="pg-soft-action">💡 Hint</button><button id="pgPatternReplay" type="button" class="pg-soft-action">↻ Soalan semula</button></div>'+
   '<p id="pgFeedback" class="pg-feedback" aria-live="polite">Cari susunan yang berulang.</p>');
  document.querySelectorAll('[data-pattern-option]').forEach(b=>b.onclick=()=>{
   if(pattern.won)return;
   const selected=pattern.options[Number(b.dataset.patternOption)];
   if(selected!==pattern.correct){
    pattern.attempts++;b.classList.add('is-wrong');feedback('Hampir! Perhatikan corak dan cuba lagi.');sound(false);return;
   }
   pattern.won=true;sound(true);reward('pattern:'+level);
   document.querySelector('#pgPatternStrip').innerHTML=pattern.shown.concat(pattern.correct).map(x=>'<div class="pg-sequence-tile solved">'+patternMedia(x)+'</div>').join('');
   success('Bijak kenal corak!','🧠','Betul! Kamu sudah faham susunan '+(pattern.kind==='number'?'nombor':'gambar')+' ini.',()=>startPattern((level+1)%total.pattern));
  });
  document.querySelector('#pgPatternHint').onclick=()=>{
   if(pattern.hint||pattern.won)return;
   pattern.hint=true;document.querySelector('#pgPatternStrip').innerHTML=patternStrip();
   document.querySelector('#pgPatternHint').disabled=true;
   feedback(pattern.kind==='number'?'Perhatikan jarak antara nombor yang berturutan.':'Gambar yang berkilau menunjukkan satu bahagian corak yang berulang.',true);
  };
  document.querySelector('#pgPatternReplay').onclick=()=>startPattern(level);
 }
 return {open,dispose};
}
window.LATIH_PHASE2={create,types:['maze','hidden','dots','pattern'],total};
})();
