import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const sandbox={console,Math,Date,setInterval,clearInterval,setTimeout,clearTimeout};
sandbox.window=sandbox; sandbox.globalThis=sandbox; vm.createContext(sandbox);
vm.runInContext(read('spot-scenes.js'),sandbox,{filename:'spot-scenes.js'});
vm.runInContext(read('games.js'),sandbox,{filename:'games.js'});
const G=sandbox.LATIH_GAMES;
assert.deepEqual(Array.from(G.catalog,d=>d.id),['worm','spot'],'Only Worm and Spot the Difference are available');
assert.equal(G.puzzleTypes.length,5,'5 puzzle picture collections');
assert.equal(G.allImages.length,76,'76 distinct illustrations');
assert.deepEqual(Array.from(G.pieceOptions.map(o=>o.n)),[9,16,20,30]);
for(const name of G.allImages)assert(fs.existsSync(new URL('../assets/general/'+name+'.webp',import.meta.url)),name);
const seen={};
for(let i=0;i<80;i++){
 const puzzle=G.makeSudoku();
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
for(const name of ['games.css','games.js']){
 assert(index.includes(name+'?v=24.5.3'),name+' linked');
 assert(sw.includes("'"+name+"'"),name+' cached offline');
}
assert(version.includes('24.5.3'));
assert(index.includes('app.js?v=24.5.3'));
assert(app.includes("['games','Games']"));
assert(app.includes("GAMES.home()"));
assert(css.includes('@media(max-width:460px)'));
assert(css.includes('.lg-puzzle-tray'));
const actualIds=G.catalog.map(x=>x.id);
for(const id of ['worm','spot'])assert(actualIds.includes(id));
console.log('Kids Games checks passed: 2 active games, 76 retained offline images, 9–30 pieces, 80 unique-answer Sudoku puzzles.');
