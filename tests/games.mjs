import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const sandbox={console,Math,Date,setInterval,clearInterval,setTimeout,clearTimeout};
sandbox.window=sandbox; sandbox.globalThis=sandbox; vm.createContext(sandbox);
vm.runInContext(read('spot-scenes.js'),sandbox,{filename:'spot-scenes.js'});
vm.runInContext(read('spot-extra-scenes.js'),sandbox,{filename:'spot-extra-scenes.js'});
for(const script of ['cartoon-animals.js','cartoon-vehicles.js','cartoon-fruits.js','cartoon-nature.js','cartoon-fun.js','puzzle-cartoons.js'])vm.runInContext(read(script),sandbox,{filename:script});
for(const script of ['phase2-data.js','phase2-games.js','games.js'])vm.runInContext(read(script),sandbox,{filename:script});
const G=sandbox.LATIH_GAMES;
assert.deepEqual(Array.from(G.catalog,d=>d.id),['puzzle','shapes','sudoku','worm','memory','spot','maze','hidden','dots','pattern'],'Phase 2 adds four new Games tiles while preserving nested Jigsaw');
assert.equal(sandbox.LATIH_SPOT.scenes.length,20,'20 original SVG cartoon scenes');
assert.deepEqual(Array.from(sandbox.LATIH_SPOT.scenes,s=>s.spots.length),[5,5,6,6,6,7,7,7,7,7,7,7,8,8,8,8,8,9,9,9]);
assert.equal(sandbox.LATIH_CARTOONS.ids.length,76);
assert.equal(Object.keys(sandbox.LATIH_CARTOON_SPRITES).length,67);
assert.equal(new Set(sandbox.LATIH_CARTOONS.ids).size,76);
assert.equal(G.puzzleTypes.length,5,'5 puzzle picture collections remain accessible');
assert.deepEqual(Array.from(G.puzzleTypes,d=>d.id),['animal','vehicle','fruit','nature','fun']);
assert.deepEqual(Array.from(G.puzzleTypes,d=>d.items.length),[15,16,11,16,18]);
assert.equal(G.catalog.length,10,'Games hub has six Phase 1 tiles and four Phase 2 titles');
assert.equal(G.allImages.length,76,'76 distinct illustrations');
assert.deepEqual(Array.from(G.pieceOptions.map(o=>o.n)),[9,16,20,30]);
for(const name of G.allImages){
 assert(sandbox.LATIH_CARTOONS.has(name),name);
 const svg=sandbox.LATIH_CARTOONS.illustration(name);
 assert(svg.includes('viewBox="0 0 480 480"')&&svg.includes('<svg'),name+' must have vector artwork');
 assert(svg.includes(sandbox.LATIH_CARTOONS.label(name)),name+' must have its own label');
 assert(sandbox.LATIH_CARTOONS.image(name).startsWith('data:image/svg+xml'),name+' must be offline');
}
for(const scene of sandbox.LATIH_SPOT.scenes)assert(scene.a!==scene.b&&scene.a.includes('<svg')&&scene.b.includes('<svg'),scene.name);
const seen={};
for(let i=0;i<80;i++){
 const puzzle=G.makeSudoku(Math.random,['mudah','sederhana','mencabar'][i%3]);
 assert.equal(puzzle.solution.length,16);
 assert.equal(puzzle.cells.length,16);
 assert(puzzle.cells.filter(x=>x===0).length>=1);
 assert.equal(G.countSudokuSolutions(puzzle.cells),1,'Sudoku must have a unique answer');
 for(let r=0;r<4;r++){
  assert.equal(new Set(puzzle.solution.slice(r*4,r*4+4)).size,4);
  assert.equal(new Set(Array.from({length:4},(_,row)=>puzzle.solution[row*4+r])).size,4);
 }
 for(let y=0;y<2;y++)for(let x=0;x<2;x++)assert.equal(new Set([0,1,4,5].map(v=>puzzle.solution[y*8+x*2+v])).size,4);
 const key=puzzle.solution.join(',');seen[key]=(seen[key]||0)+1;
}
assert(Object.keys(seen).length>=10,'Sudoku variations are randomized');
const index=read('index.html'),sw=read('sw.js'),app=read('app.js'),css=read('games.css'),version=read('version.js');
for(const name of ['games.css','phase2-games.css','phase2-data.js','phase2-games.js','games.js','spot-scenes.js','spot-extra-scenes.js','cartoon-animals.js','cartoon-vehicles.js','cartoon-fruits.js','cartoon-nature.js','cartoon-fun.js','puzzle-cartoons.js']){
 assert(index.includes(name+'?v=24.8.0'),name+' linked');
 assert(sw.includes("'"+name+"'"),name+' cached offline');
}
assert(version.includes('24.8.0'));
assert(index.includes('app.js?v=24.8.0'));
assert(app.includes("['games','Games']"));
assert(app.includes("GAMES.home()"));
assert(css.includes('@media(max-width:460px)'));
assert(css.includes('.lg-puzzle-tray'));
const actualIds=G.catalog.map(x=>x.id);
for(const id of ['puzzle','shapes','sudoku','worm','memory','spot','maze','hidden','dots','pattern'])assert(actualIds.includes(id));
assert(!G.puzzleTypes.some(d=>actualIds.includes(d.id)),'Puzzle categories must not be scattered in Games hub');
assert(read('games.js').includes('data-puzzle-category'),'Jigsaw submenu has category tiles');
assert(read('games.js').includes('screen===\'categories\''),'Navigation returns through Jigsaw categories');
assert(!read('games.js').includes('assets/general/'),'Games must never load photos from General');
assert(read('games.js').includes('LATIH_CARTOONS.image'));
assert(read('games.js').includes('data-sudoku-level'));
assert(read('games.js').includes('lg-memory-card'));
console.log('Kids Games checks passed: 10 Games menu cards, 5 nested puzzle categories, 76 cartoon SVGs, 20 Spot scenes, 4 Phase 2 games.');
