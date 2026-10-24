/* Phase 2 deterministic rules and offline artwork regression. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=path=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
const context={console,Math,Date,setTimeout,clearTimeout};
context.window=context;context.globalThis=context;vm.createContext(context);
for(const script of ['cartoon-animals.js','cartoon-vehicles.js','cartoon-fruits.js','cartoon-nature.js','cartoon-fun.js','puzzle-cartoons.js','phase2-data.js','phase2-games.js'])
 vm.runInContext(read(script),context,{filename:script});
const D=context.LATIH_PHASE2_DATA,G=context.LATIH_PHASE2;
assert.deepEqual(Array.from(G.types),['maze','hidden','dots','pattern']);
assert.deepEqual({...G.total},{maze:30,hidden:12,dots:20,pattern:60});
assert.equal(D.mazeWorlds.length,3);
assert.equal(D.hiddenSpecs.length,12);
assert.equal(D.dotShapes.length,20);
assert.equal(Object.keys(context.LATIH_CARTOON_SPRITES).length,67);
for(let level=0;level<30;level++){
 const m=D.makeMaze(level),n=m.size;
 assert.equal(n,[5,7,9][Math.floor(level/10)]);
 assert.equal(m.cells.length,n*n);
 assert.equal(new Set(Array.from(m.path)).size,m.path.length,'no repeated nodes in BFS path');
 assert.equal(m.path[0],0);
 assert.equal(m.path.at(-1),n*n-1);
 const a=D.makeMaze(level);
 assert.equal(m.cells.join(','),a.cells.join(','),'reproducible maze');
 let edges=0;
 for(let i=0;i<m.cells.length;i++){
  const x=i%n,y=Math.floor(i/n);
  for(const d of D.moves){
   const nextX=x+d.dx,nextY=y+d.dy,open=!(m.cells[i]&d.bit);
   if(nextX<0||nextY<0||nextX>=n||nextY>=n){assert(!open,'wall prevents leaving grid');continue;}
   const neighbor=nextY*n+nextX;
   assert.equal(open,!(m.cells[neighbor]&d.opp),'maze walls are reciprocal');
   if(open)edges++;
  }
  assert(D.mazePath(m,i).length>0,'all maze cells can reach the goal');
 }
 assert.equal(edges/2,n*n-1,'a perfect maze is a connected tree');
 for(let i=1;i<m.path.length;i++){
  const prev=m.path[i-1],next=m.path[i];
  assert(Math.abs(prev%n-next%n)+Math.abs(Math.floor(prev/n)-Math.floor(next/n))===1,'path steps touch');
 }
}
const observedHidden=new Set();
for(let i=0;i<12;i++){
 const s=D.makeHidden(i),copy=D.makeHidden(i);
 assert.equal(s.spots.length,18);
 assert.equal(s.targets.length,i<4?5:i<8?6:7);
 assert.equal(new Set(Array.from(s.targets)).size,s.targets.length,'no duplicated targets');
 assert.equal(JSON.stringify(s.spots),JSON.stringify(copy.spots),'reproducible hidden world');
 const contents=s.spots.map(o=>o.id);
 assert.equal(new Set(contents).size,18);
 for(const target of s.targets)assert(contents.includes(target),'target must occur in scene');
 for(const obj of s.spots){
  assert(obj.x>=35&&obj.x<=565&&obj.y>=35&&obj.y<=385,'hidden touch hitbox is in scene');
  assert(context.LATIH_CARTOON_SPRITES[obj.id],'local cartoon sprite');
  observedHidden.add(obj.id);
 }
 const svg=D.hiddenSvg(s,context.LATIH_CARTOON_SPRITES);
 assert(svg.startsWith('<svg')&&svg.endsWith('</svg>')&&svg.includes('viewBox="0 0 600 420"'));
 assert(!svg.includes('<image')&&!svg.includes('xlink:href')&&!svg.includes('<foreignObject'),'hidden world must not fetch external images');
 assert.equal((svg.match(/viewBox="0 0 36 36"/g)||[]).length,18,'all icons rendered as inline SVG');
}
assert(observedHidden.size>=28,'variety of hidden objects');
const names=new Set();
for(const d of D.dotShapes){
 assert(!names.has(d.name),'each drawing has a unique name');
 names.add(d.name);
 assert(d.points.length>=8&&d.points.length<=34);
 for(const [x,y] of d.points)assert(x>=45&&x<=555&&y>=45&&y<=398,'all dot points inside the art frame');
}
for(let i=0;i<60;i++){
 const p=D.makePattern(i),copy=D.makePattern(i),all=p.shown.concat(p.correct);
 assert.equal(p.group,Math.floor(i/20));
 assert.equal(JSON.stringify(p),JSON.stringify(copy),'reproducible pattern');
 assert.equal(p.options.length,3,'three choices for each puzzle');
 assert.equal(new Set(Array.from(p.options)).size,3,'no duplicated answer');
 assert(p.options.includes(p.correct));
 if(p.kind==='icon'){
  const motifs=all.slice(0,p.unit);
  assert(all.every((x,j)=>x===motifs[j%p.unit]),'correct answer follows the visual repetition');
  for(const icon of all.concat(Array.from(p.options)))assert(context.LATIH_CARTOON_SPRITES[icon],'local cartoon icon');
 }else{
  assert.equal(p.group,2);
  const gaps=all.slice(1).map((v,j)=>v-all[j]);
  assert.equal(new Set(gaps).size,1,'number sequence has a constant step');
  assert(gaps[0]>0);
 }
}
const ix=read('index.html'),sw=read('sw.js'),release=read('version.js').match(/LATIH_VERSION = '([^']+)'/)[1];
for(const path of ['phase2-games.css','phase2-data.js','phase2-games.js']){
 assert(ix.includes(path+'?v='+release),path+' versioned');
 assert(sw.includes("'"+path+"'"),path+' precached in service worker');
}
assert(ix.indexOf('phase2-games.js')<ix.indexOf('games.js?v='+release));
assert(ix.indexOf('puzzle-cartoons.js')<ix.indexOf('phase2-games.js'));
assert(read('games.js').includes('LATIH_PHASE2.create'));
assert(!read('phase2-games.js').includes('assets/general/'));
assert(!read('phase2-data.js').includes('assets/general/'));
console.log('Phase 2 rules checks passed: 30 perfect mazes, 12 hidden-object cartoon worlds, 20 dot drawings, 60 unambiguous patterns and offline assets.');

for(let level=0;level<30;level++){const maze=D.makeMaze(level);assert.equal(new Set(maze.collectibles).size,3);for(const item of maze.collectibles){assert(item!==0&&item!==maze.cells.length-1);assert(maze.path.includes(item));}}
