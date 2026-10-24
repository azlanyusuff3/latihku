/* LatihKu Phase 2: deterministic, original game levels and SVG cartoon artwork.
   No photographs, external libraries, network calls or copied game source. */
(function(){
'use strict';
const dice=(seed)=>{let a=seed|0;return ()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t^=t+Math.imul(t^(t>>>7),61|t);return ((t^(t>>>14))>>>0)/4294967296;}};
const shuffle=(arr,rng)=>{const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const moves=[{name:'up',dx:0,dy:-1,bit:1,opp:4},{name:'right',dx:1,dy:0,bit:2,opp:8},{name:'down',dx:0,dy:1,bit:4,opp:1},{name:'left',dx:-1,dy:0,bit:8,opp:2}];
const mazeWorlds=[
 {name:'Taman Arnab',sprite:'rabbit',theme:'garden',item:'carrot',emoji:'🐰',target:'🥕',colors:['#d8f5db','#72c47d']},
 {name:'Pantai Penyu',sprite:'turtle',theme:'beach',item:'star',emoji:'🐢',target:'⭐',colors:['#e4efff','#6bc9b7']},
 {name:'Hutan Panda',sprite:'panda',theme:'forest',item:'apple',emoji:'🐼',target:'🍎',colors:['#f9e5ff','#a4b7ef']}
];
function mazePath(maze,start=0){
 const total=maze.size*maze.size,end=total-1;
 if(!Number.isInteger(start)||start<0||start>=total)return [];
 const prev=Array(total).fill(-1),seen=new Set([start]),queue=[start];
 for(let head=0;head<queue.length;head++){
  const p=queue[head];if(p===end)break;
  const x=p%maze.size,y=Math.floor(p/maze.size);
  for(const dir of moves){
   if(maze.cells[p]&dir.bit)continue;
   const nx=x+dir.dx,ny=y+dir.dy;
   if(nx<0||ny<0||nx>=maze.size||ny>=maze.size)continue;
   const next=ny*maze.size+nx;if(seen.has(next))continue;
   seen.add(next);prev[next]=p;queue.push(next);
  }
 }
 if(!seen.has(end))return [];
 const path=[end];while(path[0]!==start){const p=prev[path[0]];if(p<0)return [];path.unshift(p);}
 return path;
}
function makeMaze(level){
 if(!Number.isInteger(level)||level<0||level>=30)throw new RangeError('Maze level must be 0..29');
 const group=Math.floor(level/10),size=[5,7,9][group],rng=dice(0x454700+level*97);
 const cells=Array(size*size).fill(15),visited=new Set([0]),stack=[0];
 while(stack.length){
  const current=stack[stack.length-1],x=current%size,y=Math.floor(current/size);
  const options=moves.filter(d=>{const nx=x+d.dx,ny=y+d.dy;return nx>=0&&ny>=0&&nx<size&&ny<size&&!visited.has(ny*size+nx);});
  if(!options.length){stack.pop();continue;}
  const d=options[Math.floor(rng()*options.length)],to=(y+d.dy)*size+x+d.dx;
  cells[current]&=~d.bit;cells[to]&=~d.opp;
  visited.add(to);stack.push(to);
 }
 const maze={level,size,cells,group,world:mazeWorlds[group]};
 maze.path=mazePath(maze);
 maze.collectibles=[1,2,3].map(k=>maze.path[Math.floor(k*(maze.path.length-1)/4)]);
 if(maze.path.length<2)throw new Error('Maze generation failed at '+level);
 return maze;
}
const hiddenSpecs=[
 ['Taman Fantasi','🌻','garden','bee butterfly rabbit frog sunflower apple turtle rose panda'],
 ['Kedai Mainan','🧸','town','car train bus airplane rocket truck panda guitar orange'],
 ['Dunia Laut','🐬','sea','dolphin shark turtle sailboat ship coconut pineapple penguin sun'],
 ['Zoo Ceria','🦁','garden','lion tiger elephant giraffe zebra panda rabbit butterfly bus'],
 ['Misi Angkasa','🚀','space','rocket astronaut moon sun earth airplane kiwi guitar panda'],
 ['Ladang Bahagia','🐴','farm','horse tractor apple bee sunflower rabbit banana guitar frog'],
 ['Pantai Comel','🏖️','beach','coconut sailboat ship dolphin turtle sun pineapple bus rose'],
 ['Dapur Kartun','🍕','room','apple banana watermelon pizza burger waffle taco strawberry croissant'],
 ['Sekolah Riang','🎒','town','school bicycle guitar football basketball violin apple rocket panda'],
 ['Hutan Misteri','🌳','forest','oak bamboo fern frog butterfly rabbit panda rose bee'],
 ['Pasar Warna-warni','🍉','market','apple mango orange banana watermelon grape car bee coconut'],
 ['Karnival Mini','🎪','fair','guitar football basketball bus violin butterfly rabbit rocket taco']
];
const slots=[[79,133],[220,131],[361,138],[507,132],[138,254],[295,258],[465,253],[84,357],[509,356]];
const hiddenThemes={
 garden:['#ccefff','#a0d888','#ebf9cd'],town:['#fce5e1','#b3d0d8','#faedc9'],
 sea:['#91d9ea','#4c9dc8','#f2d4ae'],space:['#1b457b','#445899','#a2b8de'],
 farm:['#d8f1e4','#b9d484','#f1dfa5'],beach:['#aedfed','#efcb96','#fff1ba'],
 room:['#ffebda','#f1c9ae','#fff0d4'],forest:['#bcdfd3','#6caf8c','#ccdfa7'],
 market:['#ffe7d2','#e8ba97','#eecf9c'],fair:['#dce3fb','#d6b5eb','#fbe5c5']
};
function makeHidden(index){
 if(!Number.isInteger(index)||index<0||index>=hiddenSpecs.length)throw new RangeError('Hidden level out of range');
 const [name,emoji,theme,ids]=hiddenSpecs[index],rng=dice(index*109+820);
 const original=ids.split(' '),pool=[...new Set(hiddenSpecs.filter(s=>s[2]===theme||['garden','forest','farm'].includes(theme)&&['garden','forest','farm'].includes(s[2])).flatMap(s=>s[3].split(' ')).concat('rose butterfly bee apple guitar football orange kiwi waffle lion turtle bus coconut piano oak frog train'.split(' ')))];
 const items=shuffle(original.concat(shuffle(pool.filter(id=>!original.includes(id)),rng).slice(0,9)),rng);
 const positions=shuffle(Array.from({length:18},(_,i)=>[55+(i%6)*97,95+Math.floor(i/6)*132+(i%2)*12]),rng);
 const spots=items.map((id,i)=>({
  id,label:window.LATIH_CARTOONS?.label(id)||id,
  x:positions[i][0]+Math.round((rng()-.5)*12),
  y:positions[i][1]+Math.round((rng()-.5)*12),
  r:28+Math.floor(rng()*4)
 }));
 const required=index<4?5:index<8?6:7;
 const targets=shuffle(original,rng).slice(0,required);
 return {index,name,emoji,theme,spots,targets,palette:hiddenThemes[theme]};
}
const shape=(d,color,stroke='#546c77',width=4)=>'<path d="'+d+'" fill="'+color+'" stroke="'+stroke+'" stroke-width="'+width+'" stroke-linejoin="round" stroke-linecap="round"/>';
const ellipse=(cx,cy,rx,ry,fill)=>'<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+fill+'"/>';
function hiddenBackdrop(scene){
 const [sky,land,tint]=scene.palette,theme=scene.theme;
 const gradients='<defs><linearGradient id="pgSky" x2="0" y2="1"><stop stop-color="'+sky+'"/><stop offset="1" stop-color="'+tint+'"/></linearGradient></defs>';
 let s=gradients+'<rect width="600" height="420" fill="url(#pgSky)"/>';
 if(theme==='space'){
  s+='<rect width="600" height="420" fill="#1c3566"/>'+Array.from({length:33},(_,i)=>'<circle cx="'+((i*137+49)%600)+'" cy="'+((i*89+17)%365)+'" r="'+(1+i%3)+'" fill="#fff0b5"/>').join('');
  s+=ellipse(425,374,350,75,'#7f8eb4')+ellipse(490,362,68,20,'#6175a6');
  s+=shape('M31 333L110 230L145 332Z','#a2bdcf')+shape('M457 336L550 214L596 336Z','#94a9cb');
 }else if(theme==='sea'){
  s+='<path d="M0 94Q160 80 300 105T600 90V420H0Z" fill="#69c6d7"/>';
  s+='<path d="M0 345Q140 300 290 345T600 323V420H0Z" fill="#eed6a6"/>';
  s+='<path d="M35 350Q0 300 38 270Q64 297 43 348M530 379Q490 325 532 281Q574 316 540 378" fill="none" stroke="#6aad91" stroke-width="15"/>';
  s+=Array.from({length:18},(_,i)=>'<circle cx="'+((i*67+27)%585)+'" cy="'+((i*83+50)%325)+'" r="'+(3+i%4)+'" fill="#c6f5eb" opacity=".65"/>').join('');
 }else if(theme==='room'){
  s+='<rect y="293" width="600" height="127" fill="#d2a583"/><path d="M0 293H600" stroke="#b48167" stroke-width="10"/>';
  s+='<rect x="36" y="56" width="130" height="126" rx="12" fill="#a1d7e6" stroke="#fff9ec" stroke-width="14"/>';
  s+=shape('M355 325h175v-83h-175Z','#c6a17f')+shape('M370 255h145v-21H370Z','#f7d7a1');
  s+='<path d="M83 57V180M38 115H166" stroke="#fff8ed" stroke-width="10"/>';
 }else{
  s+='<path d="M0 259Q130 196 285 249T600 234V420H0Z" fill="'+land+'"/>';
  s+='<path d="M0 339Q125 290 279 337T600 309V420H0Z" fill="'+tint+'" opacity=".88"/>';
  s+=ellipse(526,66,34,34,'#ffe29c');
  s+='<g fill="#fffdf9" opacity=".84">'+ellipse(116,62,45,18,'#fffdf9')+ellipse(140,54,23,22,'#fffdf9')+ellipse(385,70,49,17,'#fffdf9')+'</g>';
  if(['town','market','fair'].includes(theme)){
   s+=shape('M32 282V170L119 105L205 170V282Z','#f2c5a1')+shape('M335 283V145L441 90L548 145V283Z','#cdb8e9');
   s+='<rect x="89" y="189" width="57" height="71" rx="10" fill="#b5e7e0"/><rect x="399" y="161" width="73" height="64" rx="10" fill="#ffeaab"/>';
  }else{
   for(const [x,y] of [[33,182],[555,189]]){
    s+='<rect x="'+(x-8)+'" y="'+y+'" width="16" height="155" rx="6" fill="#aa7c65"/>';
    s+=ellipse(x,y-16,63,57,'#85c58d')+ellipse(x-30,y+4,43,39,'#9dd79b');
   }
  }
  s+=Array.from({length:11},(_,i)=>'<circle cx="'+((i*65+43)%580)+'" cy="'+(366+i%3*13)+'" r="5" fill="'+['#f9bed2','#ffe6a1','#a5d7e9'][i%3]+'"/>').join('');
 }
 return s;
}
function hiddenSvg(scene,sprites){
 const ids=sprites||window.LATIH_CARTOON_SPRITES||{};
 let s='<svg xmlns="http://www.w3.org/2000/svg" class="pg-hidden-art" viewBox="0 0 600 420" role="img" aria-label="Gambar kartun '+scene.name+'">';
 s+=hiddenBackdrop(scene);
 for(const spot of scene.spots){
  if(!ids[spot.id])throw new Error('Missing hidden object cartoon '+spot.id);
  s+=ellipse(spot.x,spot.y+spot.r,spot.r,6,'#43656e24');
  s+='<svg data-hidden-art-id="'+spot.id+'" x="'+(spot.x-spot.r)+'" y="'+(spot.y-spot.r)+'" width="'+(spot.r*2)+'" height="'+(spot.r*2)+'" viewBox="0 0 36 36" aria-hidden="true">'+ids[spot.id]+'</svg>';
 }
 return s+'</svg>';
}
const dotShapes=[
 ['Bintang','⭐',[[300,56],[343,159],[465,174],[373,250],[397,368],[300,307],[203,368],[227,250],[135,174],[257,159]]],
 ['Rumah','🏠',[[175,181],[300,72],[425,181],[390,181],[390,345],[210,345],[210,181],[175,181]]],
 ['Ikan','🐠',[[112,211],[175,142],[264,111],[345,125],[399,177],[478,120],[460,213],[478,308],[399,248],[339,289],[250,312],[168,282],[112,211]]],
 ['Roket','🚀',[[300,52],[350,112],[363,191],[427,270],[355,251],[355,326],[300,369],[245,326],[245,251],[174,270],[237,191],[250,112],[300,52]]],
 ['Rama-rama','🦋',[[300,213],[254,125],[174,85],[130,142],[157,219],[113,283],[169,344],[238,322],[300,213],[362,322],[431,344],[487,283],[443,219],[470,142],[426,85],[346,125],[300,213]]],
 ['Kucing','🐱',[[201,220],[180,104],[258,160],[301,147],[342,160],[420,104],[399,220],[416,282],[367,337],[300,350],[232,337],[184,282],[201,220]]],
 ['Hati','❤️',[[300,347],[219,293],[157,222],[153,160],[192,115],[253,116],[300,162],[348,116],[409,115],[447,160],[443,222],[381,293],[300,347]]],
 ['Dinosaur','🦕',[[137,303],[183,260],[199,194],[248,153],[266,93],[327,81],[350,119],[330,146],[299,135],[283,204],[358,228],[415,196],[459,211],[447,250],[403,284],[385,328],[332,328],[317,280],[244,289],[220,331],[172,332],[137,303]]],
 ['Kereta','🚗',[[123,263],[160,225],[208,214],[250,157],[360,157],[403,214],[463,226],[484,285],[444,306],[425,350],[387,351],[361,306],[222,306],[195,351],[158,351],[147,308],[123,263]]],
 ['Kapal Layar','⛵',[[303,87],[303,278],[421,278],[343,345],[214,345],[151,278],[303,278],[190,278],[303,87],[426,256],[303,256]]],
 ['Penyu','🐢',[[127,231],[187,200],[221,152],[291,133],[360,158],[408,205],[462,199],[479,233],[459,264],[408,257],[376,316],[344,322],[320,285],[247,285],[222,322],[189,315],[165,273],[127,231]]],
 ['Pelangi','🌈',[[118,335],[135,236],[186,158],[242,111],[300,92],[359,111],[416,158],[466,236],[482,335],[432,335],[420,249],[373,194],[329,166],[300,160],[270,166],[227,194],[181,249],[168,335],[118,335]]],
 ['Kereta Api','🚂',[[115,304],[115,228],[153,228],[153,164],[232,164],[232,215],[297,215],[297,183],[405,183],[405,220],[475,220],[475,304],[429,320],[407,348],[362,348],[334,320],[260,320],[231,348],[186,348],[161,320],[115,304]]],
 ['Belon','🎈',[[300,92],[354,110],[393,155],[403,212],[381,269],[333,312],[300,348],[267,312],[219,269],[197,212],[207,155],[246,110],[300,92]]],
 ['Bunga','🌼',[[300,68],[342,109],[382,90],[401,143],[453,179],[416,225],[434,270],[375,290],[358,349],[301,320],[244,349],[225,290],[166,270],[184,225],[147,179],[199,143],[218,90],[258,109],[300,68]]],
 ['Kapal Terbang','✈️',[[300,64],[327,195],[441,275],[461,314],[347,282],[340,340],[377,357],[378,380],[300,358],[222,380],[223,357],[260,340],[253,282],[139,314],[159,275],[273,195],[300,64]]],
 ['Gajah','🐘',[[160,295],[139,239],[165,180],[220,135],[295,123],[366,142],[398,186],[418,233],[450,242],[464,274],[438,292],[406,265],[391,336],[355,340],[342,296],[265,296],[247,340],[210,340],[200,287],[160,295]]],
 ['Aiskrim','🍦',[[284,380],[218,213],[232,185],[219,157],[232,117],[266,94],[310,102],[336,127],[365,130],[390,158],[389,193],[365,221],[352,228],[284,380]]],
 ['Layang-layang','🪁',[[300,57],[413,173],[300,286],[187,173],[300,57],[300,286],[324,318],[286,347],[315,378],[275,394]]],
 ['Istana','🏰',[[151,361],[151,174],[177,174],[177,118],[221,118],[221,174],[260,174],[260,99],[300,56],[340,99],[340,174],[379,174],[379,118],[423,118],[423,174],[449,174],[449,361],[348,361],[348,288],[325,256],[275,256],[252,288],[252,361],[151,361]]]
].map(([name,emoji,points],i)=>({index:i,name,emoji,points}));
const patternIcons='lion panda rabbit turtle bee butterfly apple banana car bus rocket frog dolphin sunflower pizza guitar tiger penguin strawberry pineapple'.split(' ');
function makePattern(level){
 if(!Number.isInteger(level)||level<0||level>=60)throw new RangeError('Pattern level out of range');
 const rng=dice(level*487+431);
 const group=Math.floor(level/20);
 if(group===2&&level%5===0){
  const start=1+Math.floor(rng()*5),step=2+Math.floor(rng()*3),count=6;
  const full=Array.from({length:count},(_,i)=>start+i*step),correct=full[count-1];
  const options=shuffle([correct,correct+step,correct-step+1].filter((v,i,a)=>v>0&&a.indexOf(v)===i),rng);
  if(options.length!==3)throw new Error('Numeric pattern choices invalid at '+level);
  return {level,group,kind:'number',shown:full.slice(0,-1),correct,options,unit:2,description:'Kira nombor yang bertambah dengan jarak sama.'};
 }
 const templates=group===0?[[0,1],[0,1,1]]:group===1?[[0,1,2],[0,0,1],[0,1,1],[0,1,2,1]]:[[0,1,2,3],[0,1,1,2],[0,0,1,2],[0,1,2,2,3]];
 const template=templates[level%templates.length],count=group===0?6:group===1?8:9;
 const unique=shuffle(patternIcons,rng);
 const used=unique.slice(0,1+Math.max(...template));
 const full=Array.from({length:count},(_,i)=>used[template[i%template.length]]);
 const correct=full[count-1],other=shuffle(unique.filter(id=>id!==correct),rng).slice(0,2);
 return {level,group,kind:'icon',shown:full.slice(0,-1),correct,options:shuffle([correct,...other],rng),unit:template.length,description:'Perhatikan corak gambar yang berulang.'};
}
window.LATIH_PHASE2_DATA={dice,shuffle,moves,mazeWorlds,makeMaze,mazePath,hiddenSpecs,makeHidden,hiddenSvg,hiddenBackdrop,dotShapes,makePattern};
})();
