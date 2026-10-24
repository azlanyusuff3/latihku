/* Original vector artwork for LatihKu. Paired scenes share geometry; only registered details differ. */
(function(){
'use strict';
const ink='#354c60';
const g=(x,y,s,body)=>`<g transform="translate(${x} ${y}) scale(${s})">${body}</g>`;
const rect=(x,y,w,h,c,r=6)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${c}" stroke="${ink}" stroke-width="3"/>`;
const circle=(x,y,r,c)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${ink}" stroke-width="3"/>`;
const ellipse=(x,y,rx,ry,c)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" stroke="${ink}" stroke-width="3"/>`;
const path=(d,c='none',w=3)=>`<path d="${d}" fill="${c}" stroke="${ink}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const star=(x,y,s,c='#ffd577')=>g(x,y,s,path('M0 -16 5 -5 17 -5 8 3 11 16 0 9 -11 16 -8 3 -17 -5 -5 -5Z',c));
const cloud=(x,y,s=1)=>g(x,y,s,`<path d="M-40 12 Q-58 -10 -30 -17 Q-24 -46 2 -31 Q30 -40 36 -14 Q62 -12 49 12Z" fill="#fffaf0" opacity=".95"/>`);
const flower=(x,y,c='#ff9d9c',s=1)=>g(x,y,s,path('M0 0V28')+path('M0 19Q-22 4 -17 19Q-8 29 0 24','#7ab87d')+[-90,-18,54,126,198].map(a=>`<ellipse cx="0" cy="-9" rx="7" ry="11" fill="${c}" stroke="${ink}" stroke-width="2" transform="rotate(${a})"/>`).join('')+circle(0,0,6,'#ffe493'));
const tree=(x,y,s=1)=>g(x,y,s,rect(-10,0,20,88,'#b77e62')+path('M0 44 -23 23M0 27 25 4')+circle(-27,-7,35,'#8dc58a')+circle(26,-12,38,'#83bd85')+circle(0,-42,39,'#a9d993'));
const face=(x,y,s=1)=>g(x,y,s,`<ellipse cx="-12" cy="0" rx="4.5" ry="5.5" fill="${ink}"/><ellipse cx="12" cy="0" rx="4.5" ry="5.5" fill="${ink}"/><circle cx="-13" cy="-2" r="1.5" fill="#fff8e7"/><circle cx="11" cy="-2" r="1.5" fill="#fff8e7"/>`+path('M-17 -11Q-12 -14 -7 -11M7 -11Q12 -14 17 -11','none',1.7)+path('M-7 13Q0 21 7 13','none',2)+`<ellipse cx="-22" cy="10" rx="7" ry="4" fill="#efa7a0"/><ellipse cx="22" cy="10" rx="7" ry="4" fill="#efa7a0"/>`);
const animal=(x,y,s,type='bear',color='#cf9a71')=>g(x,y,s,
ellipse(0,38,37,44,color)+ellipse(0,42,24,30,'#f2dfbf')+ellipse(-26,73,17,10,color)+ellipse(26,73,17,10,color)+path('M-32 72V77M-24 73V78M24 73V78M32 72V77','none',1.5)+
(type==='rabbit'?ellipse(-20,-45,11,34,color)+ellipse(20,-45,11,34,color)+ellipse(-20,-47,5,23,'#e7b5a5')+ellipse(20,-47,5,23,'#e7b5a5'):circle(-27,-26,17,color)+circle(27,-26,17,color)+circle(-27,-26,9,'#e8b6a2')+circle(27,-26,9,'#e8b6a2'))+
ellipse(0,-1,40,34,color)+path('M-12 -28 -5 -33 1 -27 8 -31','none',1.5)+ellipse(0,12,16,12,'#fff1d4')+face(0,0,.85)+ellipse(0,8,4,3,'#695447')+path('M-32 29Q-22 38 -26 47M32 29Q22 38 26 47','none',2));
const fish=(x,y,s=1,c='#f9ad74')=>g(x,y,s,path('M-24 0 -46 -21 -46 21Z',c)+ellipse(0,0,30,20,c)+circle(13,-5,3,ink)+path('M23 6Q17 12 13 8')+path('M-3 -19 5 -31 13 -15',c));
const house=(x,y,s=1,c='#f7c37c')=>g(x,y,s,rect(-62,0,124,102,c)+path('M-77 0 0 -58 77 0Z','#de8576')+rect(-15,43,30,59,'#79a9bc')+rect(-48,22,22,24,'#d9f2ef')+rect(27,22,22,24,'#d9f2ef')+path('M-37 22V46M27 34H49')+circle(7,76,2,'#ffdf8b'));
const grass=()=>Array.from({length:15},(_,i)=>path(`M${15+i*41} ${360+(i%3)*18}l4 -8 3 8 5 -5`,'none',2)).join('');
const palettes=[['#cce8e5','#a9ce91'],['#f8e2b5','#afcf91'],['#cbdedb','#8ab99a'],['#bde2ed','#f3d59d'],['#d8edf0','#b9d3a0'],['#173c64','#285580'],['#88cfde','#e9d1a7'],['#d3e5f0','#b5cba5']];
const titles=['Piknik Si Arnab','Kebun Ceria','Perkhemahan Hutan','Cuti di Pantai','Ladang Pak Beruang','Misi Angkasa','Dunia Bawah Laut','Pekan Kecil'];
function build(index,right){
 let content='',spots=[];
 const add=(s)=>{content+=s;};
 const diff=(x,y,r,a,b,label)=>{spots.push({x,y,r,label});add(right?b:a);};
 const [sky,ground]=palettes[index];
 add(`<rect width="600" height="420" fill="${sky}"/><path d="M0 245Q150 205 300 250Q450 215 600 235V420H0Z" fill="${ground}"/>`);
 if(index!==5&&index!==6){add(cloud(100,70,.8)+cloud(400,65,1)+circle(522,63,28,'#ffdf89')+grass());}
 if(index===0){
  add(tree(62,175,1.1)+tree(525,180,.95)+rect(162,278,277,107,'#edaaa1',10));
  for(let x=183;x<438;x+=37)add(path(`M${x} 280V384`,'none',2));for(let y=298;y<385;y+=28)add(path(`M164 ${y}H437`,'none',2));
  add(animal(202,218,.9,'rabbit','#fff0d2')+animal(407,235,.8)+ellipse(300,340,44,16,'#fff7dd')+rect(260,288,73,25,'#b98d65'));
  diff(299,279,29,path('M266 288Q296 245 328 288'),path('M266 288Q296 264 328 288'),'Pemegang bakul');
  diff(300,335,21,circle(299,333,13,'#dd7773'),circle(299,333,13,'#efd06f'),'Warna buah');
  diff(203,240,17,path('M187 230 202 237 218 230 218 248 203 240 187 248Z','#77b4cf'),path('M187 230 202 237 218 230 218 248 203 240 187 248Z','#d88ca9'),'Reben arnab');
  diff(495,325,24,flower(495,320,'#fff1b8'),flower(495,320,'#cf9bc6'),'Warna bunga');
  diff(77,165,20,circle(77,165,12,'#e77c72'),'','Buah pada pokok');
  add(flower(104,330,'#f9b8be')+flower(557,365,'#fff1b8'));
 }else if(index===1){
  add(house(440,165,1.05,'#f5d18c')+tree(60,180,.9)+animal(153,237,.85,'rabbit','#fff1da'));
  add(rect(235,275,255,32,'#a97c60')+rect(245,325,245,30,'#a97c60'));
  for(let x=260;x<490;x+=51)add(flower(x,269,'#ed969c',.8)+flower(x,321,'#ffd373',.7));
  add(rect(72,325,65,40,'#7db7c1')+path('M72 330 45 312 38 320 73 349','#7db7c1')+path('M137 331Q164 310 150 351'));
  diff(103,345,18,circle(103,345,9,'#f6e7b3'),star(103,345,.65,'#f6e7b3'),'Corak penyiram');
  diff(438,137,20,circle(438,137,14,'#d9f2ef'),rect(424,123,28,28,'#d9f2ef',2),'Bentuk tingkap');
  diff(263,267,19,flower(260,269,'#ed969c',.8),flower(260,269,'#ae9bc7',.8),'Bunga merah jambu');
  diff(552,304,23,path('M533 298Q552 270 571 298Z','#e78e7c')+rect(548,298,8,22,'#fff2d9'),path('M533 298Q552 270 571 298Z','#e78e7c')+rect(548,298,8,22,'#fff2d9')+circle(550,291,4,'#fff2d9'),'Bintik cendawan');
  diff(154,255,17,circle(154,255,6,'#668cac'),circle(154,255,6,'#edb960'),'Butang baju');
 }else if(index===2){
  add(tree(58,128,1.15)+tree(515,120,1.25)+tree(400,155,.65)+path('M150 315 276 137 392 315Z','#e8b876')+path('M218 315 276 206 333 315Z','#746f70')+animal(455,285,.7)+ellipse(94,351,47,12,'#a0a299'));
  diff(277,177,22,star(277,177,.9,'#fff0ca'),circle(277,177,14,'#fff0ca'),'Lambang khemah');
  diff(120,253,24,rect(104,227,32,47,'#83b4ba')+path('M111 227V217H129V227'),rect(104,227,32,47,'#d6989d')+path('M111 227V217H129V227'),'Warna tanglung');
  add(path('M244 369 319 345M247 345 321 369','none',10)+path('M267 354Q251 338 276 309Q274 334 292 323Q314 350 296 357Z','#efa778'));
  diff(91,344,19,circle(91,344,9,'#d8c9ac'),'','Batu kecil');
  diff(453,307,17,rect(440,300,27,10,'#d47e77'),rect(440,300,27,10,'#89b7cc'),'Selendang beruang');
  diff(520,143,18,circle(520,143,12,'#f4d9a6')+circle(520,143,4,ink),circle(520,143,12,'#f4d9a6'),'Lubang pokok');
  diff(370,365,20,flower(370,365,'#f6d68e',.7),flower(370,365,'#c79fc7',.7),'Bunga hutan');
 }else if(index===3){
  add(`<path d="M0 170Q150 145 300 177Q450 152 600 175V280H0Z" fill="#76bfce"/><path d="M0 259Q120 280 240 257T600 262" fill="none" stroke="#fff4d9" stroke-width="7"/>`);
  add(path('M105 302V124')+path('M26 157Q105 35 184 157Z','#ec9d8d')+path('M105 81Q75 105 71 157H139Q136 105 105 81Z','#fff0c8')+animal(222,270,.8,'rabbit','#fff1d2')+rect(160,340,154,48,'#86bcc5')+rect(376,300,91,57,'#e7bc7e')+rect(366,279,26,47,'#e7bc7e')+rect(450,279,26,47,'#e7bc7e'));
  diff(423,330,25,path('M408 350V319Q423 298 438 319V350Z','#9d816a'),rect(408,313,30,37,'#9d816a',1),'Pintu istana pasir');
  diff(432,249,23,path('M421 298V240')+path('M422 240 450 249 422 258Z','#d7898c'),path('M421 298V240')+path('M422 240 450 249 422 258Z','#8da8c9'),'Bendera');
  diff(78,342,24,circle(78,342,21,'#f4d176')+path('M78 322V363'),circle(78,342,21,'#9cbfd4')+path('M78 322V363'),'Bola pantai');
  diff(526,355,20,star(526,355,1,'#e9a18a'),'','Tapak sulaiman');
  diff(222,269,17,ellipse(222,269,24,7,'#f3c77c')+rect(207,251,30,17,'#f3c77c'),ellipse(222,269,24,7,'#b59ac1')+rect(207,251,30,17,'#b59ac1'),'Topi arnab');
  diff(340,200,20,path('M318 202H362L350 215H329Z','#bd8b6c')+path('M340 201V169L359 196H340Z','#fff2d5'),path('M318 202H362L350 215H329Z','#bd8b6c')+path('M340 201V169L359 196H340Z','#eaa28e'),'Layar bot');
 }else if(index===4){
  add(house(420,152,1.3,'#d99783')+tree(70,175,.9));
  for(let x=40;x<560;x+=52)add(rect(x,275,12,70,'#f5e9c7'));add(rect(30,287,540,11,'#f5e9c7')+rect(30,318,540,11,'#f5e9c7')+animal(208,277,.9)+ellipse(404,350,50,25,'#f6ecd5')+circle(450,333,22,'#f6ecd5')+ellipse(438,313,8,16,'#f6ecd5')+ellipse(465,314,8,16,'#f6ecd5')+face(452,331,.45));
  diff(415,120,20,circle(415,120,17,'#f6e3b7')+path('M415 104V136M400 120H430'),circle(415,120,17,'#f6e3b7')+path('M400 120H430'),'Palang tingkap');
  diff(208,306,17,rect(190,298,36,16,'#83abc1'),rect(190,298,36,16,'#a4bc82'),'Tali pinggang');
  diff(397,347,20,ellipse(397,347,14,11,'#847669'),'','Tompok lembu');
  diff(521,352,19,ellipse(521,352,12,17,'#fff4df'),ellipse(521,352,12,17,'#efd092'),'Warna telur');
  diff(80,177,20,circle(80,177,13,'#df8a79'),circle(80,177,13,'#e9c772'),'Buah pokok');
  diff(114,345,21,path('M99 353 115 391 129 353Z','#e7a166')+path('M115 353 106 337M115 353 123 337'),path('M99 353 115 391 129 353Z','#e7a166')+path('M115 353 106 337'),'Daun lobak');
 }else if(index===5){
  for(let i=0;i<27;i++)add(circle(18+(i*83)%570,20+(i*47)%220,2,'#f5e5b9'));
  add(ellipse(300,390,310,80,'#9dacc2')+ellipse(85,368,45,12,'#8395af')+ellipse(471,390,62,13,'#8395af')+path('M340 315V180Q340 95 380 78Q420 95 420 180V315Z','#f4e8d1')+path('M340 252 312 317 340 304Z','#d99c95')+path('M420 252 448 317 420 304Z','#d99c95')+rect(346,302,68,18,'#89b1c6')+path('M354 321 368 355 381 328 394 355 405 321Z','#edbb7d')+animal(205,287,.8,'bear','#ece2cd')+circle(205,274,43,'#a9d0dc')+face(205,275,.7)+rect(178,316,54,30,'#d2dce2'));
  diff(380,184,25,circle(380,184,23,'#8ab8ce'),circle(380,184,23,'#b2a0c8'),'Tingkap roket');
  diff(380,256,20,star(380,256,1,'#d99c95'),circle(380,256,14,'#d99c95'),'Lambang roket');
  diff(205,331,18,circle(193,331,4,'#d99c95')+circle(208,331,4,'#89b1c6')+circle(222,331,4,'#b8c989'),circle(193,331,4,'#d99c95')+circle(208,331,4,'#89b1c6'),'Butang angkasawan');
  add(circle(113,115,38,'#d5ad8b')+ellipse(113,115,63,12,'none'));
  diff(115,102,20,circle(115,102,9,'#b78f78'),'','Kawah planet');
  diff(500,190,24,star(500,190,1.25,'#f3dc9c'),star(500,190,1.25,'#c6b2d5'),'Warna bintang');
  diff(315,347,23,path('M300 392V335')+path('M300 335H331V356H300Z','#8bb6be'),path('M300 392V335')+path('M300 335H331L319 346 331 356H300Z','#8bb6be'),'Bentuk bendera');
  diff(520,300,24,ellipse(520,317,21,12,'#a3bb9b')+circle(520,309,11,'#d8e6d2'),ellipse(520,317,21,12,'#a3bb9b')+circle(520,309,11,'#d8e6d2')+path('M520 298V286')+circle(520,284,3,'#e6c985'),'Antena UFO');
 }else if(index===6){
  for(let i=0;i<11;i++)add(circle(25+(i*89)%550,35+(i*53)%260,5+i%3,'#b8e6e8'));
  for(let x of [35,75,530,568])add(path(`M${x} 385Q${x-28} 335 ${x} 290Q${x+25} 250 ${x} 222`,'none',12));
  add(fish(163,146,1.4,'#efb587')+fish(430,226,1.15,'#c9b0d2')+ellipse(285,290,70,40,'#97ba8e')+ellipse(280,290,50,35,'#79a582')+circle(363,290,26,'#a7cb9b')+face(365,289,.5)+ellipse(251,325,22,9,'#a7cb9b')+ellipse(315,325,22,9,'#a7cb9b')+rect(90,331,91,53,'#bb9472')+path('M90 331Q134 292 181 331Z','#c8a17e'));
  diff(163,146,22,path('M153 125V169M168 125V170'),path('M153 125V169'),'Jalur ikan');
  diff(279,290,24,path('M259 276 279 266 302 279 298 306 274 314 255 299Z','#94b696'),path('M259 276 279 266 302 279 298 306 274 314 255 299Z','#d1ba84'),'Corak cangkerang');
  diff(135,355,18,rect(127,342,16,24,'#f0cd82')+circle(135,351,3,ink),rect(127,342,16,24,'#f0cd82'),'Kunci peti');
  diff(436,224,20,circle(436,224,7,'#eee5ca'),star(436,224,.5,'#eee5ca'),'Corak ikan ungu');
  diff(460,365,23,star(460,365,1.2,'#e4a187'),star(460,365,1.2,'#b3a1ca'),'Tapak sulaiman');
  diff(320,106,26,fish(320,106,.55,'#f0d193'),'','Ikan kecil');
  diff(225,371,19,ellipse(225,371,18,10,'#eac3b6')+path('M213 369 225 365 238 369'),ellipse(225,371,18,10,'#eac3b6'),'Garisan kulit kerang');
 }else{
  add(house(125,158,1.15,'#efd09b')+house(448,151,1.25,'#9fbec5')+`<path d="M0 300H600V420H0Z" fill="#a1acb4"/><path d="M0 365H600" stroke="#fff1cb" stroke-width="5" stroke-dasharray="28 20"/>`+tree(300,143,.75)+rect(180,290,145,48,'#dd9b87')+path('M200 290 220 258H279L303 290Z','#dd9b87')+path('M224 265H276L292 287H209Z','#c8e5e5')+circle(211,337,17,'#5c6671')+circle(296,337,17,'#5c6671')+circle(211,337,7,'#e7d8bc')+circle(296,337,7,'#e7d8bc'));
  diff(121,133,20,circle(121,133,17,'#f6ead2')+path('M121 121V133H131'),circle(121,133,17,'#f6ead2')+path('M121 121V133H109'),'Jarum jam');
  diff(449,130,21,rect(430,115,38,26,'#d6e8dc')+path('M449 116V141'),rect(430,115,38,26,'#d6e8dc'),'Palang tingkap');
  diff(250,311,22,star(250,311,.9,'#f5ddb0'),circle(250,311,13,'#f5ddb0'),'Lambang kereta');
  diff(362,272,23,rect(350,253,25,37,'#f4dfaa')+path('M362 290V325'),rect(350,253,25,37,'#c2a4c6')+path('M362 290V325'),'Papan tanda');
  diff(555,260,22,rect(537,246,35,34,'#c89781')+path('M542 254H566'),rect(537,246,35,34,'#c89781')+path('M542 254H566M555 246V279'),'Corak peti surat');
  diff(67,272,22,flower(67,270,'#e49da7',.8),flower(67,270,'#e7cc83',.8),'Bunga tepi jalan');
  diff(469,379,22,path('M451 390 469 364 487 390Z','#e8b77e')+path('M459 379H480'),path('M451 390 469 364 487 390Z','#e8b77e'),'Jalur kon');
 }
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420" aria-hidden="true"><g stroke-linecap="round" stroke-linejoin="round">${content}</g></svg>`;
 return {svg,spots};
}
const scenes=titles.map((name,i)=>{const a=build(i,false),b=build(i,true);return {id:`cartoon-v1-${i}`,name,level:i<2?'Santai':i<5?'Teliti':'Mencabar',a:a.svg,b:b.svg,spots:a.spots};});
window.LATIH_SPOT={scenes};
})();
