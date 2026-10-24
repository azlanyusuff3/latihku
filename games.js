(function gameFeature() {
  'use strict';
  const allDefinitions = [
    {id:'animal', title:'Animal Puzzle', label:'Haiwan', icon:'🦁', cover:'lion', tone:'yellow', items:'lion tiger elephant giraffe zebra horse panda penguin rabbit dolphin frog shark turtle bee butterfly'.split(' ')},
    {id:'vehicle', title:'Vehicle Puzzle', label:'Kenderaan', icon:'🚒', cover:'firetruck', tone:'blue', items:'airplane ambulance bicycle bus car firetruck helicopter motorcycle rocket sailboat ship submarine tractor train tram truck'.split(' ')},
    {id:'shapes', title:'Shape Match', label:'Padan Bentuk', icon:'⭐', tone:'purple'},
    {id:'fruit', title:'Fruit Puzzle', label:'Buah-buahan', icon:'🍎', cover:'apple', tone:'pink', items:'apple banana grape strawberry orange watermelon pineapple mango kiwi coconut durian'.split(' ')},
    {id:'sudoku', title:'Easy Sudoku', label:'Nombor 1–4', icon:'🔢', tone:'green'},
    {id:'worm', title:'Worm Game', label:'Ulat Comel', icon:'🐛', tone:'navy'},
    {id:'memory', title:'Memory Match', label:'Cari Pasangan', icon:'🐻', tone:'orange'},
    {id:'spot', title:'Spot the Difference', label:'Cari Perbezaan', icon:'🐱', tone:'mint'},
    {id:'nature', title:'Nature Puzzle', label:'Alam Semula Jadi', icon:'🌻', cover:'sunflower', tone:'green', items:'sun moon earth jupiter venus mars rose orchid sunflower lotus tulip hibiscus oak bamboo fern cactus'.split(' ')},
    {id:'fun', title:'Fun Puzzle', label:'Macam-macam', icon:'🎸', cover:'guitar', tone:'purple', items:'guitar piano violin drums football basketball badminton xylophone waffle pizza croissant burger school astronaut tambourine ukulele taco nasilemak'.split(' ')}
  ];
  const definitions = allDefinitions.filter(d=>['worm','spot'].includes(d.id));
  const puzzleTypes = allDefinitions.filter(d=>d.items);
  const allImages = new Set(puzzleTypes.flatMap(d=>d.items));
  const pieceOptions = [{n:9,cols:3,rows:3,label:'Mudah'},{n:16,cols:4,rows:4,label:'Santai'},{n:20,cols:4,rows:5,label:'Hebat'},{n:30,cols:5,rows:6,label:'Cabaran'}];
  const image = id => `assets/general/${id}.webp`;
  const pretty = id => id.replace(/(^|-)\w/g,s=>s.toUpperCase()).replace(/([a-z])([A-Z])/g,'$1 $2');
  const shuffle = (items,rng=Math.random) => {const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  const shapeNames = [
    {id:'star',symbol:'★',name:'Bintang',color:'#ffc52e'},
    {id:'circle',symbol:'●',name:'Bulatan',color:'#ff5b65'},
    {id:'triangle',symbol:'▲',name:'Segi tiga',color:'#209ef6'},
    {id:'square',symbol:'■',name:'Segi empat',color:'#2cca76'},
    {id:'heart',symbol:'♥',name:'Hati',color:'#f55f9d'},
    {id:'diamond',symbol:'◆',name:'Berlian',color:'#9465f4'},
    {id:'moon',symbol:'☾',name:'Bulan',color:'#ecb82a'},
    {id:'sun',symbol:'☀',name:'Matahari',color:'#f59b24'}
  ];
  const spotScenes = window.LATIH_SPOT?.scenes||[];
  function countSudokuSolutions(cells,limit=2) {
    const cellsCopy=cells.slice(); let solutions=0;
    function valid(i,n) {
      const row=Math.floor(i/4),col=i%4;
      for(let j=0;j<4;j++)if(cellsCopy[row*4+j]===n||cellsCopy[j*4+col]===n)return false;
      const br=Math.floor(row/2)*2,bc=Math.floor(col/2)*2;
      for(let r=br;r<br+2;r++)for(let c=bc;c<bc+2;c++)if(cellsCopy[r*4+c]===n)return false;
      return true;
    }
    function solve() {
      if(solutions>=limit)return;
      const i=cellsCopy.indexOf(0);
      if(i<0){solutions++;return;}
      for(let n=1;n<=4;n++)if(valid(i,n)){cellsCopy[i]=n;solve();cellsCopy[i]=0;if(solutions>=limit)return;}
    }
    solve();return solutions;
  }
  function makeSudoku(rng=Math.random) {
    const swapPairs=()=>shuffle([0,1],rng);
    const groupOrder=shuffle([0,1],rng);
    const rowOrder=groupOrder.flatMap(b=>swapPairs().map(i=>b*2+i));
    const colOrder=shuffle([0,1],rng).flatMap(b=>swapPairs().map(i=>b*2+i));
    const digits=shuffle([1,2,3,4],rng);
    const solution=rowOrder.flatMap(r=>colOrder.map(c=>digits[(r*2+Math.floor(r/2)+c)%4]));
    const cells=solution.slice();
    const target=7+Math.floor(rng()*4);
    let removed=0;
    for(const i of shuffle(Array.from({length:16},(_,j)=>j),rng)){
      const value=cells[i];cells[i]=0;
      if(countSudokuSolutions(cells)!==1){cells[i]=value;continue;}
      if(++removed>=target)break;
    }
    return {cells,solution};
  }
  function create({shell,getState,save,esc,beep}) {
    let screen='hub',category='animal',puzzleIndex=0,pieceCount=20,puzzle=null;
    let shapes=null,sudoku=null,worm=null,memory=null,spot=null;
    let wormTimer=null,memoryTimer=null,spotTimer=null,wormListening=false,lastCompletion=null;
    const sfx=ok=>{try{beep(ok);}catch{}};
    const getProgress=()=>{
      const state=getState();
      if(!state.games||typeof state.games!=='object')state.games={completed:{},stars:0,bestWorm:0,sudoku:0,shapes:0,memory:0,spot:0};
      if(!state.games.completed||typeof state.games.completed!=='object')state.games.completed={};
      return state.games;
    };
    const persist=()=>save(true);
    const completedCount=()=>Object.keys(getProgress().completed).length;
    const earned=(key)=>{
      const p=getProgress();
      if(!p.completed[key]){p.completed[key]=Date.now();p.stars=(Number(p.stars)||0)+1;persist();}
    };
    const closeTimer=()=>{if(spotTimer!==null){clearTimeout(spotTimer);spotTimer=null;}if(wormTimer!==null){cancelAnimationFrame(wormTimer);wormTimer=null;}if(memoryTimer){clearTimeout(memoryTimer);memoryTimer=null;}if(wormListening){document.removeEventListener('keydown',wormKey);document.removeEventListener('visibilitychange',wormHidden);window.removeEventListener('blur',wormBlur);wormListening=false;}};
    const mkHeader=(title,info='')=>`<header class="lg-gamehead"><button class="lg-back" data-game-back aria-label="Kembali">‹</button><h1>${esc(title)}</h1>${info?`<span class="lg-head-pill">${info}</span>`:''}</header>`;
    const draw=(html)=>{shell(`<div class="lg-screen">${html}</div>`,'games');document.querySelector('[data-game-back]')?.addEventListener('click',back);};
    const cover=(game)=>{
      if(game.id==='shapes')return '<div class="lg-art-shapes"><i>★</i><i>●</i><i>▲</i><i>■</i></div>';
      if(game.id==='sudoku')return '<div class="lg-art-sudoku"><i>1</i><i>2</i><i>3</i><i>4</i><i>1</i><i>2</i><i>3</i><i>4</i><i>1</i></div>';
      if(game.id==='worm')return '<div class="lg-art-worm"><span>🍎</span><b>🐛</b><span>🟡</span></div>';
      if(game.id==='memory')return '<div class="lg-art-memory"><i>🐻</i><i>?</i></div>';
      if(game.id==='spot')return `<div class="lg-art-spot lg-cartoon-cover">${spotScenes[0]?.a||''}<span>🔍</span></div>`;
      if(game.id==='fruit')return `<div class="lg-art-fruits"><img src="${image('apple')}" alt=""><img src="${image('banana')}" alt=""><img src="${image('grape')}" alt=""></div>`;
      return `<img class="lg-art-picture" src="${image(game.cover)}" alt="" loading="lazy">`;
    };
    const hub=()=>{
      screen='hub';closeTimer();const p=getProgress();
      draw(`<section class="lg-hero"><div class="lg-hero-cloud a"></div><div class="lg-hero-cloud b"></div><span class="lg-hero-sun">☀️</span><div><h1><span>Games</span></h1><p>Pilih permainan kamu</p><div class="lg-hero-stats">🐛 Worm &nbsp; · &nbsp; 🔍 Cari Perbezaan</div></div><span class="lg-hero-child" aria-hidden="true">🙋🏻‍♂️</span></section>
      <section class="lg-gallery" aria-label="Pilih permainan">${definitions.map(g=>`<button class="lg-gamecard lg-tone-${g.tone}" data-open-game="${g.id}"><div class="lg-cardart">${cover(g)}</div><div class="lg-cardlabel"><strong>${esc(g.title)}</strong><span aria-hidden="true">›</span></div><small>${g.items?`${g.items.length} gambar · 9–30 keping`:esc(g.label)}</small></button>`).join('')}</section><p class="lg-offline">🌈 Semua permainan boleh dimainkan tanpa internet selepas aset dimuatkan.</p>`);
      document.querySelectorAll('[data-open-game]').forEach(b=>b.addEventListener('click',()=>openGame(b.dataset.openGame)));
    };
    function openGame(id){
      closeTimer();
      const kind=definitions.find(g=>g.id===id);if(!kind)return hub();
      if(kind.items){category=id;return library();}
      if(id==='shapes')return startShapes();
      if(id==='sudoku')return startSudoku();
      if(id==='worm')return startWorm();
      if(id==='memory')return startMemory();
      if(id==='spot')return startSpot();
    }
    const selectedCategory=()=>definitions.find(g=>g.id===category)||definitions[0];
    const counts=()=>`<div class="lg-counts" role="group" aria-label="Bilangan kepingan">${pieceOptions.map(o=>`<button data-pieces="${o.n}" class="${pieceCount===o.n?'chosen':''}" aria-pressed="${pieceCount===o.n}"><strong>${o.n}</strong><small>${o.label}</small></button>`).join('')}</div>`;
    const bindCounts=(onSelect)=>document.querySelectorAll('[data-pieces]').forEach(b=>b.addEventListener('click',()=>{pieceCount=Number(b.dataset.pieces);onSelect();}));
    function library(){
      screen='library';closeTimer();const g=selectedCategory(),p=getProgress();
      draw(`${mkHeader(g.title,`${g.items.length} gambar`)}<div class="lg-intro"><h2>Pilih puzzle kamu 🧩</h2><p>Puluhan gambar untuk diteroka. Pilih tahap kepingan dahulu.</p></div>${counts()}
      <div class="lg-level-grid">${g.items.map((name,i)=>`<button class="lg-level-card" data-level="${i}"><span class="lg-level-thumb"><img src="${image(name)}" alt="" loading="lazy"></span><span class="lg-level-name"><b>${esc(pretty(name))}</b><small>Level ${i+1}</small></span><span class="lg-level-done">${p.completed[`puzzle:${g.id}:${name}`]?'⭐':'›'}</span></button>`).join('')}</div>`);
      bindCounts(library);
      document.querySelectorAll('[data-level]').forEach(b=>b.addEventListener('click',()=>startPuzzle(Number(b.dataset.level))));
    }
    function startPuzzle(index){
      closeTimer();screen='puzzle';
      const g=selectedCategory();puzzleIndex=Math.max(0,Math.min(g.items.length-1,index));
      const opt=pieceOptions.find(x=>x.n===pieceCount)||pieceOptions[2];
      const prefilled=opt.n===9?1:opt.n===16?2:opt.n===20?3:4;
      const seeded=shuffle(Array.from({length:opt.n},(_,i)=>i));
      puzzle={item:g.items[puzzleIndex],cols:opt.cols,rows:opt.rows,placed:new Set(seeded.slice(0,prefilled)),order:shuffle(seeded.slice(prefilled)),selected:null,hint:-1,mistake:-1};
      renderPuzzle();
    }
    function cellStyle(index){
      const x=index%puzzle.cols,y=Math.floor(index/puzzle.cols);
      const px=puzzle.cols<=1?0:100*x/(puzzle.cols-1),py=puzzle.rows<=1?0:100*y/(puzzle.rows-1);
      return `background-image:url('${image(puzzle.item)}');background-size:${puzzle.cols*100}% ${puzzle.rows*100}%;background-position:${px}% ${py}%`;
    }
    function cellsHtml(){
      const n=puzzle.cols*puzzle.rows;
      return Array.from({length:n},(_,i)=>`<button type="button" class="lg-puzzle-cell ${puzzle.placed.has(i)?'is-placed':''} ${puzzle.hint===i?'is-hint':''} ${puzzle.mistake===i?'is-wrong':''}" ${puzzle.placed.has(i)?'disabled':''} data-slot="${i}" aria-label="Ruang ${i+1}${puzzle.placed.has(i)?' siap':''}">${puzzle.placed.has(i)?`<span class="lg-puzzle-slice" style="${cellStyle(i)}"></span>`:`<span class="lg-slot-icon">✣</span>`}</button>`).join('');
    }
    function piecesHtml(){
      return puzzle.order.filter(i=>!puzzle.placed.has(i)).map(i=>`<button type="button" class="lg-puzzle-piece ${puzzle.selected===i?'is-selected':''}" data-tile="${i}" aria-pressed="${puzzle.selected===i}" aria-label="Pilih kepingan ${i+1}"><span class="lg-puzzle-slice" style="${cellStyle(i)}"></span></button>`).join('');
    }
    function renderPuzzle(){
      const g=selectedCategory();const total=puzzle.cols*puzzle.rows;
      draw(`${mkHeader(g.title,`⭐ Level ${puzzleIndex+1}`)}<p class="lg-instruction">🧩 Pilih kepingan di bawah, kemudian sentuh ruang yang betul!</p>
      <div class="lg-play-wrap"><div class="lg-play-progress"><b>${esc(pretty(puzzle.item))}</b><span id="lgPiecesProgress">${puzzle.placed.size} / ${total} siap</span></div>
      <div class="lg-puzzle-frame"><div id="lgPuzzleBoard" class="lg-puzzle-board" style="--lg-cols:${puzzle.cols};--lg-rows:${puzzle.rows};--lg-guide:url('${image(puzzle.item)}')">${cellsHtml()}</div></div>
      <div class="lg-tray-head"><b>Kepingan puzzle</b><small>Tap kepingan → tap ruang</small></div><div class="lg-puzzle-tray" id="lgPuzzleTray">${piecesHtml()}</div>
      <div class="lg-actionrow"><button class="lg-action lg-action-light" id="lgHint">💡 Hint</button><button class="lg-action lg-action-light" id="lgReplay">↻ Replay</button><button class="lg-action lg-action-green" id="lgNextPuzzle" ${puzzle.placed.size!==total?'disabled':''}>Next ❯</button></div></div>`);
      bindPuzzleControls();
    }
    function updatePuzzle(){
      const board=document.querySelector('#lgPuzzleBoard'),tray=document.querySelector('#lgPuzzleTray');
      if(!board||!tray)return;
      board.innerHTML=cellsHtml();tray.innerHTML=piecesHtml();
      const label=document.querySelector('#lgPiecesProgress');if(label)label.textContent=`${puzzle.placed.size} / ${puzzle.cols*puzzle.rows} siap`;
      const next=document.querySelector('#lgNextPuzzle');if(next)next.disabled=puzzle.placed.size!==puzzle.cols*puzzle.rows;
      bindPuzzleTiles();
    }
    function bindPuzzleTiles(){
      document.querySelectorAll('[data-tile]').forEach(b=>b.addEventListener('click',()=>{
        const i=Number(b.dataset.tile);puzzle.selected=puzzle.selected===i?null:i;puzzle.hint=-1;puzzle.mistake=-1;updatePuzzle();
      }));
      document.querySelectorAll('[data-slot]').forEach(b=>b.addEventListener('click',()=>{
        const index=Number(b.dataset.slot);
        if(puzzle.placed.has(index))return;
        if(puzzle.selected===null){puzzle.hint=index;updatePuzzle();return;}
        if(puzzle.selected!==index){puzzle.mistake=index;puzzle.hint=puzzle.selected;sfx(false);updatePuzzle();return;}
        puzzle.placed.add(index);puzzle.selected=null;puzzle.hint=-1;puzzle.mistake=-1;sfx(true);updatePuzzle();
        if(puzzle.placed.size===puzzle.cols*puzzle.rows){earned(`puzzle:${category}:${puzzle.item}`);showWin('Hebat! Puzzle siap!','🦁','Pilih puzzle seterusnya untuk terus bermain.',()=>startPuzzle((puzzleIndex+1)%selectedCategory().items.length));}
      }));
    }
    function bindPuzzleControls(){
      bindPuzzleTiles();
      document.querySelector('#lgHint').onclick=()=>{
        const next=puzzle.selected!==null?puzzle.selected:puzzle.order.find(i=>!puzzle.placed.has(i));
        if(next===undefined)return;
        puzzle.selected=next;puzzle.hint=next;puzzle.mistake=-1;updatePuzzle();
      };
      document.querySelector('#lgReplay').onclick=()=>startPuzzle(puzzleIndex);
      document.querySelector('#lgNextPuzzle').onclick=()=>startPuzzle((puzzleIndex+1)%selectedCategory().items.length);
    }
    const showWin=(title,emoji,description,next)=>{
      const p=getProgress();lastCompletion={next};
      const overlay=document.createElement('div');overlay.className='lg-win-cover';
      overlay.innerHTML=`<div class="lg-win-card"><div class="lg-win-emoji">${emoji}</div><h2>${esc(title)}</h2><p>${esc(description)}</p><div class="lg-win-stars">⭐ ⭐ ⭐</div><small>Jumlah bintang: ${Number(p.stars)||0}</small><div class="lg-win-buttons"><button class="lg-action lg-action-light" id="lgWinHome">Semua Games</button><button class="lg-action lg-action-green" id="lgWinNext">Next ❯</button></div></div>`;
      document.querySelector('.lg-screen')?.append(overlay);
      overlay.querySelector('#lgWinHome').onclick=hub;
      overlay.querySelector('#lgWinNext').onclick=next;
    };
    function startShapes(){
      closeTimer();screen='shapes';
      shapes={round:0,chosen:null,done:[],targets:[]};
      nextShapes();
    }
    function nextShapes(){
      shapes.targets=shuffle(shapeNames).slice(0,4);
      shapes.done=[];shapes.chosen=null;renderShapes();
    }
    function shapeSvg(s,outline=false){return `<span class="lg-shape ${outline?'lg-shape-outline':''}" style="--shape-color:${s.color}" aria-hidden="true">${s.symbol}</span>`;}
    function renderShapes(){
      draw(`${mkHeader('Shape Match',`⭐ ${shapes.round+1} / 5`)}<p class="lg-instruction">🌟 Padan bentuk dengan bayang-bayang!</p>
      <div class="lg-shape-stage"><div class="lg-shape-targets">${shapes.targets.map((s,i)=>`<button class="lg-shape-target ${shapes.done.includes(s.id)?'finished':''}" data-target-shape="${s.id}" aria-label="Ruang ${esc(s.name)}">${shapeSvg(s,!shapes.done.includes(s.id))}<small>${shapes.done.includes(s.id)?'✓':esc(s.name)}</small></button>`).join('')}</div><p class="lg-tray-head"><b>Pilih bentuk</b><small>${shapes.done.length} / 4 betul</small></p><div class="lg-shape-picks">${shuffle(shapes.targets).map(s=>`<button class="lg-shape-choice ${shapes.chosen===s.id?'is-selected':''} ${shapes.done.includes(s.id)?'finished':''}" ${shapes.done.includes(s.id)?'disabled':''} data-choose-shape="${s.id}">${shapeSvg(s)}<small>${esc(s.name)}</small></button>`).join('')}</div><div class="lg-actionrow"><button class="lg-action lg-action-light" id="lgShapeHint">💡 Hint</button><button class="lg-action lg-action-green" id="lgShapesNext" ${shapes.done.length!==4?'disabled':''}>Next ❯</button></div></div>`);
      document.querySelectorAll('[data-choose-shape]').forEach(b=>b.onclick=()=>{shapes.chosen=b.dataset.chooseShape;renderShapes()});
      document.querySelectorAll('[data-target-shape]').forEach(b=>b.onclick=()=>{
        if(!shapes.chosen||shapes.done.includes(b.dataset.targetShape))return;
        if(shapes.chosen!==b.dataset.targetShape){sfx(false);b.classList.add('is-wrong');return;}
        shapes.done.push(shapes.chosen);shapes.chosen=null;sfx(true);renderShapes();
        if(shapes.done.length===4&&shapes.round===4){const p=getProgress();p.shapes=(Number(p.shapes)||0)+1;earned(`shapes:${p.shapes}`);showWin('Semua bentuk berjaya!','🌟','Kamu hebat mengenal bentuk.',startShapes);}
      });
      document.querySelector('#lgShapeHint').onclick=()=>{shapes.chosen=shapes.targets.find(s=>!shapes.done.includes(s.id))?.id||null;renderShapes();};
      document.querySelector('#lgShapesNext').onclick=()=>{if(shapes.done.length!==4)return;shapes.round++;nextShapes();};
    }
    function startSudoku(){
      closeTimer();screen='sudoku';const generated=makeSudoku();
      sudoku={...generated,entry:generated.cells.slice(),selected:generated.cells.findIndex(x=>x===0),wrong:new Set(),round:(Number(getProgress().sudoku)||0)+1};
      renderSudoku();
    }
    function sudokuBoard(){
      return sudoku.entry.map((n,i)=>`<button class="lg-sudoku-cell ${sudoku.cells[i]?'fixed':''} ${sudoku.selected===i?'selected':''} ${sudoku.wrong.has(i)?'wrong':''} ${i%4===1?'thick-right':''} ${Math.floor(i/4)===1?'thick-bottom':''}" data-sudoku-cell="${i}" ${sudoku.cells[i]?'disabled':''} aria-label="Baris ${Math.floor(i/4)+1} lajur ${i%4+1}: ${n||'kosong'}">${n||''}</button>`).join('');
    }
    function updateSudoku(){
      const b=document.querySelector('#lgSudokuBoard');if(b)b.innerHTML=sudokuBoard();
      document.querySelectorAll('[data-sudoku-cell]').forEach(b=>b.onclick=()=>{sudoku.selected=Number(b.dataset.sudokuCell);updateSudoku();});
    }
    function renderSudoku(){
      draw(`${mkHeader('Easy Sudoku',`⭐ Level ${sudoku.round}`)}<div class="lg-sudoku-banner"><span>🦁</span><p>Fill the missing numbers!<small>Nombor 1 hingga 4, setiap baris, lajur dan kotak 2×2.</small></p></div>
      <div class="lg-sudoku-frame"><div class="lg-sudoku-board" id="lgSudokuBoard">${sudokuBoard()}</div></div>
      <div class="lg-numberpad" role="group" aria-label="Pilih nombor">${[1,2,3,4].map(n=>`<button class="lg-num lg-num-${n}" data-sudoku-number="${n}">${n}</button>`).join('')}</div>
      <div class="lg-actionrow"><button class="lg-action lg-action-light" id="lgSudokuErase">⌫ Padam</button><button class="lg-action lg-action-light" id="lgSudokuHint">💡 Hint</button><button class="lg-action lg-action-green" id="lgSudokuCheck">✓ Check</button></div>`);
      updateSudoku();
      document.querySelectorAll('[data-sudoku-number]').forEach(b=>b.onclick=()=>{
        if(sudoku.selected<0||sudoku.cells[sudoku.selected])return;
        sudoku.entry[sudoku.selected]=Number(b.dataset.sudokuNumber);sudoku.wrong.delete(sudoku.selected);updateSudoku();
      });
      document.querySelector('#lgSudokuErase').onclick=()=>{if(sudoku.selected>=0&&!sudoku.cells[sudoku.selected]){sudoku.entry[sudoku.selected]=0;sudoku.wrong.delete(sudoku.selected);updateSudoku();}};
      document.querySelector('#lgSudokuHint').onclick=()=>{const i=sudoku.selected>=0&&!sudoku.cells[sudoku.selected]?sudoku.selected:sudoku.entry.findIndex((v,j)=>v!==sudoku.solution[j]);if(i<0)return;sudoku.entry[i]=sudoku.solution[i];sudoku.wrong.delete(i);sudoku.selected=i;updateSudoku();};
      document.querySelector('#lgSudokuCheck').onclick=()=>{
        sudoku.wrong=new Set(sudoku.entry.flatMap((v,i)=>v&&v!==sudoku.solution[i]?[i]:[]));updateSudoku();
        if(sudoku.wrong.size){sfx(false);document.querySelector('#lgSudokuCheck').textContent='Cuba Lagi 💪';return;}
        if(sudoku.entry.some(v=>!v)){document.querySelector('#lgSudokuCheck').textContent='Isi semua petak 😊';return;}
        const p=getProgress();p.sudoku=(Number(p.sudoku)||0)+1;earned(`sudoku:${p.sudoku}`);sfx(true);showWin('Sudoku berjaya!','🏆','Semua nombor di tempat yang betul.',startSudoku);
      };
    }
    function startWorm(){
      closeTimer();screen='worm';
      worm={snake:[{x:4,y:6},{x:3,y:6},{x:2,y:6}],dir:'right',queue:[],previous:[],lastTime:null,elapsed:0,food:null,score:0,over:false,paused:false,fruit:'🍎'};
      worm.previous=worm.snake.map(p=>({...p}));
      placeFood();renderWorm();updateWorm(1);wormTimer=requestAnimationFrame(animateWorm);
    }
    function placeFood(){
      const taken=new Set(worm.snake.map(p=>`${p.x}:${p.y}`));
      const free=[];for(let y=0;y<12;y++)for(let x=0;x<12;x++)if(!taken.has(`${x}:${y}`))free.push({x,y});
      worm.food=free.length?free[Math.floor(Math.random()*free.length)]:null;
      worm.fruit=['🍎','🍇','🍌','🍓'][Math.floor(Math.random()*4)];
    }
    const directions={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
    const opposite={up:'down',down:'up',left:'right',right:'left'};
    const wormStepMs=275;
    function changeWormDirection(d){
      if(!worm||worm.over||worm.paused||!directions[d])return;
      const last=worm.queue.length?worm.queue[worm.queue.length-1]:worm.dir;
      if(d!==last&&d!==opposite[last]&&worm.queue.length<2)worm.queue.push(d);
    }
    function wormKey(e){
      if(screen!=='worm'||e.target?.closest('input,textarea,select,[contenteditable="true"]'))return;
      const d={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'}[e.key]||{w:'up',s:'down',a:'left',d:'right'}[e.key.toLowerCase()];
      if(d){e.preventDefault();if(!e.repeat)changeWormDirection(d);}
      if(e.key===' '){e.preventDefault();if(!e.repeat)toggleWorm();}
    }
    function wormHidden(){if(document.hidden)wormBlur();}
    function wormBlur(){if(screen==='worm'&&worm&&!worm.over&&!worm.paused)toggleWorm();}
    function animateWorm(time){
      wormTimer=null;
      if(screen!=='worm'||!worm||worm.over||worm.paused)return;
      if(worm.lastTime!==null){
        const delta=time-worm.lastTime;
        // A suspended/blocked page must not fast-forward into a wall.
        if(delta>250){toggleWorm();return;}
        worm.elapsed+=delta;
      }
      worm.lastTime=time;
      if(worm.elapsed>=wormStepMs){worm.elapsed-=wormStepMs;stepWorm();}
      if(worm.over)return;
      updateWorm(worm.elapsed/wormStepMs);
      wormTimer=requestAnimationFrame(animateWorm);
    }
    function finishWorm(won=false){
      worm.over=true;closeTimer();updateWorm(1);
      const p=getProgress();if(worm.score>(Number(p.bestWorm)||0)){p.bestWorm=worm.score;persist();}
      document.querySelector('#lgWormStatus').textContent=`${won?'Hebat! Semua buah dikutip':'Permainan tamat'} · Skor ${worm.score}`;
      document.querySelector('#lgWormEndScore').textContent=worm.score;
      document.querySelector('#lgWormOverlay strong').textContent=won?'Hebat! Kamu menang! 🏆':'Cuba lagi! 🐛';
      document.querySelector('#lgWormOverlay').classList.remove('hidden');
      document.querySelector('.lg-worm-foot').textContent=`🏆 Rekod tertinggi: ${Number(p.bestWorm)||0}`;
      sfx(won);
    }
    function stepWorm(){
      if(screen!=='worm'||!worm||worm.paused||worm.over)return;
      worm.dir=worm.queue.shift()||worm.dir;
      const [dx,dy]=directions[worm.dir],head={x:worm.snake[0].x+dx,y:worm.snake[0].y+dy};
      const eating=worm.food&&head.x===worm.food.x&&head.y===worm.food.y;
      const body=eating?worm.snake:worm.snake.slice(0,-1);
      if(head.x<0||head.y<0||head.x>=12||head.y>=12||body.some(p=>p.x===head.x&&p.y===head.y)){
        finishWorm();return;
      }
      worm.previous=worm.snake.map(p=>({...p}));
      worm.snake.unshift(head);
      if(eating){worm.score++;sfx(true);placeFood();if(!worm.food){finishWorm(true);return;}}
      else worm.snake.pop();
    }
    function wormCells(){
      return Array.from({length:144},()=>'<div class="lg-worm-tile"></div>').join('')+'<div class="lg-worm-actors" id="lgWormActors"></div><div class="lg-worm-fruit" id="lgWormFruit"></div>';
    }
    function updateWorm(alpha=1){
      const actors=document.querySelector('#lgWormActors');if(!actors)return;
      while(actors.children.length<worm.snake.length){
        const segment=document.createElement('div');segment.className='lg-worm-segment';
        if(!actors.children.length){segment.classList.add('head');segment.innerHTML='<i class="lg-worm-eye left"></i><i class="lg-worm-eye right"></i><i class="lg-worm-smile"></i>';}
        actors.appendChild(segment);
      }
      worm.snake.forEach((p,i)=>{
        const from=worm.previous[i]||worm.previous[worm.previous.length-1]||p;
        actors.children[i].style.transform=`translate3d(${(from.x+(p.x-from.x)*alpha)*100}%,${(from.y+(p.y-from.y)*alpha)*100}%,0)`;
      });
      const fruit=document.querySelector('#lgWormFruit');
      const fruitText=worm.food?worm.fruit:'';if(fruit.textContent!==fruitText)fruit.textContent=fruitText;
      if(worm.food)fruit.style.transform=`translate3d(${worm.food.x*100}%,${worm.food.y*100}%,0)`;
      const score=document.querySelector('#lgWormScore');if(score.textContent!==String(worm.score))score.textContent=worm.score;
    }
    function toggleWorm(){
      if(!worm||worm.over)return;
      worm.paused=!worm.paused;worm.lastTime=null;
      if(worm.paused){if(wormTimer!==null)cancelAnimationFrame(wormTimer);wormTimer=null;worm.queue=[];}
      else wormTimer=requestAnimationFrame(animateWorm);
      const b=document.querySelector('#lgWormPause');b.textContent=worm.paused?'▶':'Ⅱ';b.setAttribute('aria-label',worm.paused?'Sambung':'Pause');
      document.querySelector('#lgWormStatus').textContent=worm.paused?'Pause · tekan ▶ untuk sambung':'Collect the fruits!';
    }
    function renderWorm(){
      draw(`${mkHeader('Worm Game',`⭐ <span id="lgWormScore">0</span>`)}<div class="lg-worm-top"><span id="lgWormStatus">Collect the fruits!</span><button class="lg-pause" id="lgWormPause" aria-label="Pause">Ⅱ</button></div><div class="lg-worm-frame"><div class="lg-worm-board" id="lgWormBoard">${wormCells()}</div><div class="lg-worm-over hidden" id="lgWormOverlay"><strong>Bagus! 🎉</strong><p>Skor kamu: <span id="lgWormEndScore">${worm.score}</span></p><button id="lgWormAgain">Main Lagi ↻</button></div></div><div class="lg-worm-desc">🍎 Kutip buah, jangan langgar badan atau tepi!</div>
      <div class="lg-dpad" aria-label="Kawalan ulat"><button data-worm-dir="up" aria-label="Atas">▲</button><div><button data-worm-dir="left" aria-label="Kiri">◀</button><button data-worm-dir="down" aria-label="Bawah">▼</button><button data-worm-dir="right" aria-label="Kanan">▶</button></div></div><div class="lg-worm-foot">🏆 Rekod tertinggi: ${Number(getProgress().bestWorm)||0}</div>`);
      document.querySelectorAll('[data-worm-dir]').forEach(b=>{
        b.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0)return;e.preventDefault();changeWormDirection(b.dataset.wormDir);});
        b.onclick=e=>{if(e.detail===0)changeWormDirection(b.dataset.wormDir);};
      });
      document.querySelector('#lgWormPause').onclick=toggleWorm;
      document.querySelector('#lgWormAgain').onclick=startWorm;
      if(!wormListening){document.addEventListener('keydown',wormKey);document.addEventListener('visibilitychange',wormHidden);window.addEventListener('blur',wormBlur);wormListening=true;}
      const board=document.querySelector('#lgWormBoard');let start=null;
      board.addEventListener('pointerdown',e=>{
        if(!e.isPrimary||e.button!==0)return;
        e.preventDefault();start={x:e.clientX,y:e.clientY,id:e.pointerId};board.setPointerCapture(e.pointerId);
      });
      board.addEventListener('pointermove',e=>{
        if(!start||start.id!==e.pointerId)return;
        const dx=e.clientX-start.x,dy=e.clientY-start.y;
        if(Math.max(Math.abs(dx),Math.abs(dy))<16)return;
        changeWormDirection(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));
        start={x:e.clientX,y:e.clientY,id:e.pointerId};
      });
      for(const event of ['pointerup','pointercancel','lostpointercapture'])board.addEventListener(event,()=>{start=null;});
    }
    function startMemory(pairCount=6){
      closeTimer();screen='memory';
      const icons=shuffle(['🦁','🐼','🐸','🦋','🐶','🐱','🐢','🐰','🐯','🐙']);
      memory={pairs:pairCount,cards:shuffle(icons.slice(0,pairCount).flatMap(icon=>[icon,icon])),open:[],matched:new Set(),moves:0,locked:false};
      renderMemory();
    }
    function memoryGrid(){
      return memory.cards.map((icon,i)=>`<button class="lg-memory-card ${memory.open.includes(i)||memory.matched.has(i)?'revealed':''} ${memory.matched.has(i)?'matched':''}" data-memory-card="${i}" aria-label="Kad ${i+1}" aria-pressed="${memory.open.includes(i)||memory.matched.has(i)}">${memory.open.includes(i)||memory.matched.has(i)?icon:'?'}</button>`).join('');
    }
    function updateMemory(){
      const grid=document.querySelector('#lgMemoryGrid');if(grid)grid.innerHTML=memoryGrid();
      const status=document.querySelector('#lgMemoryStatus');if(status)status.textContent=`${memory.matched.size/2} / ${memory.pairs} pasangan · ${memory.moves} cuba`;
      document.querySelectorAll('[data-memory-card]').forEach(b=>b.onclick=()=>pickMemory(Number(b.dataset.memoryCard)));
    }
    function renderMemory(){
      draw(`${mkHeader('Memory Match',`⭐ ${memory.pairs} pasangan`)}<p class="lg-instruction">🐻 Cari dua kad dengan gambar yang sama!</p>
      <div class="lg-memory-level">Bilangan pasangan: ${[4,6,8].map(n=>`<button data-memory-pairs="${n}" class="${memory.pairs===n?'chosen':''}">${n}</button>`).join('')}</div>
      <div class="lg-memory-status" id="lgMemoryStatus"></div><div class="lg-memory-grid" id="lgMemoryGrid"></div><button class="lg-action lg-action-light lg-memory-reset" id="lgMemoryReset">↻ Main Lagi</button>`);
      updateMemory();
      document.querySelectorAll('[data-memory-pairs]').forEach(b=>b.onclick=()=>startMemory(Number(b.dataset.memoryPairs)));
      document.querySelector('#lgMemoryReset').onclick=()=>startMemory(memory.pairs);
    }
    function pickMemory(i){
      if(memory.locked||memory.matched.has(i)||memory.open.includes(i))return;
      memory.open.push(i);updateMemory();
      if(memory.open.length!==2)return;
      memory.moves++;
      if(memory.cards[memory.open[0]]===memory.cards[memory.open[1]]){
        memory.matched.add(memory.open[0]);memory.matched.add(memory.open[1]);memory.open=[];sfx(true);updateMemory();
        if(memory.matched.size===memory.cards.length){const p=getProgress();p.memory=(Number(p.memory)||0)+1;earned(`memory:${p.memory}`);showWin('Memori hebat!','🐻','Semua pasangan berjaya dicari.',()=>startMemory(memory.pairs));}
      }else{
        memory.locked=true;sfx(false);memoryTimer=setTimeout(()=>{memoryTimer=null;if(screen!=='memory')return;memory.open=[];memory.locked=false;updateMemory();},850);
      }
    }
    function startSpot(index=0){
      closeTimer();screen='spot';
      if(!spotScenes.length)return hub();
      const ix=((index%spotScenes.length)+spotScenes.length)%spotScenes.length;
      spot={index:ix,found:new Set(),hints:2,hint:null,cursor:{x:300,y:210}};
      renderSpot();
    }
    function spotImage(side){
      const scene=spotScenes[spot.index];
      return `<div class="lg-scene-board" data-spot-board="${side}" role="button" tabindex="0" aria-label="Gambar ${side==='a'?'A':'B'}: ${esc(scene.name)}. Tekan kawasan yang berbeza. Keyboard: anak panah dan Enter.">${scene[side]}<div class="lg-scene-marks" aria-hidden="true"></div><span class="lg-spot-cursor" hidden></span></div>`;
    }
    function renderSpot(){
      const scene=spotScenes[spot.index];
      draw(`${mkHeader('Cari Perbezaan',`${spot.index+1} / ${spotScenes.length}`)}<div class="lg-spot-intro"><div><small>${scene.level.toUpperCase()} · ${scene.spots.length} PERBEZAAN</small><h2>${esc(scene.name)}</h2><p>Bandingkan dua gambar. Tekan perbezaan pada A atau B.</p></div><label>Pilih scene<select id="lgSpotLevel">${spotScenes.map((s,i)=>`<option value="${i}" ${i===spot.index?'selected':''}>${i+1}. ${esc(s.name)}</option>`).join('')}</select></label></div><div class="lg-spot-area lg-cartoon-area"><section><b>GAMBAR A <small>Lihat dengan teliti</small></b>${spotImage('a')}</section><section><b>GAMBAR B <small>Apa yang berubah?</small></b>${spotImage('b')}</section></div><div class="lg-spot-tools"><p id="lgSpotFound" role="status" aria-live="polite">0 / ${scene.spots.length} ditemui</p><button class="lg-action lg-action-light" id="lgSpotHint">Hint · 2</button><button class="lg-action lg-action-green" id="lgSpotNext" disabled>Seterusnya ❯</button></div><p class="lg-spot-feedback" id="lgSpotFeedback" role="status">Cari warna, bentuk, corak atau objek yang hilang.</p>`);
      document.querySelector('#lgSpotLevel').onchange=e=>startSpot(Number(e.target.value));
      document.querySelectorAll('[data-spot-board]').forEach(board=>{
        board.onclick=e=>{
          if(e.detail===0)return;
          const r=board.getBoundingClientRect();checkSpot((e.clientX-r.left)/r.width*600,(e.clientY-r.top)/r.height*420);
        };
        board.onkeydown=e=>{
          const move={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[e.key];
          if(move){e.preventDefault();spot.cursor.x=Math.max(0,Math.min(600,spot.cursor.x+move[0]));spot.cursor.y=Math.max(0,Math.min(420,spot.cursor.y+move[1]));
            const c=board.querySelector('.lg-spot-cursor');c.hidden=false;c.style.left=spot.cursor.x/6+'%';c.style.top=spot.cursor.y/4.2+'%';
          }else if(e.key==='Enter'||e.key===' '){e.preventDefault();checkSpot(spot.cursor.x,spot.cursor.y);}
        };
      });
      document.querySelector('#lgSpotHint').onclick=()=>{
        if(spot.hints<=0||spot.found.size===scene.spots.length||spot.hint!==null)return;
        spot.hints--;spot.hint=scene.spots.findIndex((_,i)=>!spot.found.has(i));updateSpotMarks();
        document.querySelector('#lgSpotHint').textContent=`Hint · ${spot.hints}`;document.querySelector('#lgSpotHint').disabled=true;
        spotTimer=setTimeout(()=>{spotTimer=null;if(screen!=='spot')return;spot.hint=null;updateSpotMarks();document.querySelector('#lgSpotHint').disabled=spot.hints<=0;},2400);
      };
      document.querySelector('#lgSpotNext').onclick=()=>startSpot(spot.index+1);
    }
    function updateSpotMarks(){
      const scene=spotScenes[spot.index];
      document.querySelectorAll('.lg-scene-marks').forEach(layer=>{
        layer.innerHTML=scene.spots.map((m,i)=>spot.found.has(i)||spot.hint===i?`<span class="lg-scene-ring ${spot.found.has(i)?'found':'hint'}" style="left:${m.x/6}%;top:${m.y/4.2}%;width:${(spot.found.has(i)?m.r+7:m.r+24)/3}%;height:${(spot.found.has(i)?m.r+7:m.r+24)/2.1}%">${spot.found.has(i)?'✓':''}</span>`:'').join('');
      });
    }
    function checkSpot(x,y){
      if(screen!=='spot'||!spot)return;
      const scene=spotScenes[spot.index];
      const i=scene.spots.findIndex(m=>Math.hypot(m.x-x,m.y-y)<=m.r+7);
      if(i<0){document.querySelector('#lgSpotFeedback').textContent='Belum tepat. Cuba bandingkan bahagian lain.';return;}
      findSpot(i);
    }
    function findSpot(i){
      const scene=spotScenes[spot.index];
      if(screen!=='spot'||!Number.isInteger(i)||i<0||i>=scene.spots.length||spot.found.has(i))return;
      spot.found.add(i);sfx(true);
      if(spot.hint===i){spot.hint=null;if(spotTimer!==null)clearTimeout(spotTimer);spotTimer=null;document.querySelector('#lgSpotHint').disabled=spot.hints<=0;}
      updateSpotMarks();
      document.querySelector('#lgSpotFound').textContent=`${spot.found.size} / ${scene.spots.length} ditemui`;
      document.querySelector('#lgSpotFeedback').textContent='Betul! Teruskan mencari.';
      const done=spot.found.size===scene.spots.length;document.querySelector('#lgSpotNext').disabled=!done;
      if(done){closeTimer();earned(`spot:${scene.id}`);showWin('Mata tajam!','🔍',`Semua ${scene.spots.length} perbezaan berjaya ditemui.`,()=>startSpot(spot.index+1));}
    }
    function back(){
      closeTimer();
      if(screen==='puzzle'){puzzle=null;return library();}
      if(screen==='library')return hub();
      return hub();
    }
    function dispose(){closeTimer();screen='hub';}
    return {home:hub,dispose,getCatalog:()=>definitions};
  }
  window.LATIH_GAMES={catalog:definitions,puzzleTypes,allImages:[...allImages],pieceOptions,countSudokuSolutions,makeSudoku,create};
})();
