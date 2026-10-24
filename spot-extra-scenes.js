/* Twelve additional hand-composed SVG cartoon scenes for LatihKu (no photos).
   Coordinate-accurate paired illustrations; every registered spot draws a genuine visible difference.
   Original LatihKu artwork. Browser viewport 600x420, same as spot-scenes.js. */
(function(){
"use strict";
const existing=window.LATIH_SPOT?.scenes;
if(!Array.isArray(existing))throw new Error("Load spot-scenes.js before spot-extra-scenes.js");
const ink="#40566b",p=(d,c="none",w=3)=>'<path d="'+d+'" fill="'+c+'" stroke="'+ink+'" stroke-width="'+w+'" stroke-linejoin="round" stroke-linecap="round"/>';
const rect=(x,y,w,h,c,r=8)=>'<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+r+'" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>';
const circle=(x,y,r,c)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>';
const el=(x,y,rx,ry,c)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+c+'" stroke="'+ink+'" stroke-width="3"/>';
const cloud=(x,y)=>'<g fill="#fffdf1" opacity=".94"><ellipse cx="'+x+'" cy="'+y+'" rx="48" ry="18"/><circle cx="'+(x-22)+'" cy="'+(y-12)+'" r="23"/><circle cx="'+(x+18)+'" cy="'+(y-14)+'" r="20"/></g>';
const flower=(x,y,c)=>p('M'+x+' '+(y+24)+'V'+y,'none',2)+[-20,0,20].map(dx=>circle(x+dx/2,y+Math.abs(dx)/3,9,c)).join('')+circle(x,y,6,"#ffdf7c");
const star=(x,y,c)=>p('M'+x+' '+(y-16)+'l5 11 12 2-9 8 3 13-11-7-11 7 3-13-9-8 12-2Z',c,2);
const tree=(x,y)=>rect(x-10,y,20,92,"#ae7b60")+circle(x-24,y-5,37,"#9bd592")+circle(x+25,y-8,35,"#87c78a")+circle(x,y-38,38,"#a4dc92");
const face=(x,y)=>circle(x-10,y,2.7,"#40566b")+circle(x+10,y,2.7,"#40566b")+p('M'+(x-8)+' '+(y+10)+'q8 9 16 0');
const bear=(x,y,c="#dcb68f")=>el(x,y+40,39,40,c)+circle(x-26,y-23,15,c)+circle(x+26,y-23,15,c)+circle(x,y,36,c)+el(x,y+9,17,13,"#ffefdc")+face(x,y);
const balloon=(x,y,c)=>el(x,y,16,21,c)+p('M'+(x-5)+' '+(y+21)+'l5 8 5-8')+p('M'+x+' '+(y+29)+'q-10 25 4 51');
const wheel=(x,y)=>circle(x,y,19,"#556d85")+circle(x,y,8,"#eef5f1");
const pal=[
 ["#d9f3eb","#a1cd8c"],["#ffeadc","#f8ccaa"],["#d0eeff","#a8d995"],["#def5e8","#b3d799"],
 ["#cae5ff","#b9c7e0"],["#cce9ff","#b8da91"],["#bae6f4","#f3db91"],["#ffebce","#cce3a4"],
 ["#d3ebff","#c3dca7"],["#ffdef0","#e5d6a9"],["#d4effd","#a7d48f"],["#d5d1ff","#b9d3ee"]
];
const titles=["Taman Dinosaur","Kedai Aiskrim","Pesta Belon","Kebun Binatang","Bandar Robot","Kereta Api Ceria","Pulau Lanun","Pasar Buah","Hari Sukan","Sarkas Comel","Taman Permainan","Istana Ajaib"];
const wanted=[7,7,7,7,8,8,8,8,8,9,9,9];
function draw(i,right){
 let artwork="",spots=[];
 const add=s=>{artwork+=s;};
 const diff=(x,y,r,a,b,label)=>{spots.push({x,y,r,label});add(right?b:a);};
 const [sky,grass]=pal[i];
 add('<rect width="600" height="420" fill="'+sky+'"/>');
 if(i===6){add('<path d="M0 220Q160 191 300 225T600 219V420H0Z" fill="#67c9d6"/>');}
 else if(i===4){add('<path d="M0 320L600 320V420H0Z" fill="#91a8b8"/>');}
 else{add('<path d="M0 250Q120 223 260 254T600 228V420H0Z" fill="'+grass+'"/>');}
 if(i!==11){add(cloud(99,68)+cloud(405,53));}
 if(i!==4&&i!==6)add('<circle cx="530" cy="76" r="29" fill="#ffe4a0" opacity=".9"/>');
 if(i===0){ // dinosaurs, volcano and colourful eggs
  add(tree(66,160)+tree(549,162)+p("M240 245L346 99 457 245Z","#b5a48f")+p("M315 140L345 100 375 140Z","#ed9777"));
  add(el(205,292,74,50,"#88bc7d")+circle(263,238,39,"#88bc7d")+p("M150 283Q107 262 124 231Q160 241 166 264Z","#88bc7d")+[0,1,2,3].map(n=>p('M'+(164+n*27)+' 250l10 -24 17 22Z',"#ebca8d")).join('')+face(263,238));
  add(el(432,326,50,28,"#e8c99b")+el(487,331,30,23,"#e8c99b"));
  diff(261,204,18,circle(265,198,12,"#ffd57d"),star(265,198,"#ffd57d"),"Tanda dinosaur");
  diff(175,307,20,el(175,307,18,12,"#b0dd91"),el(175,307,18,12,"#d9b9e4"),"Corak dinosaur");
  diff(435,316,22,el(435,316,15,22,"#f1c4cf"),el(435,316,15,22,"#afd5f2"),"Warna telur");
  diff(504,318,17,circle(504,318,10,"#9bc57e"),"","Telur kecil");
  diff(80,125,18,circle(81,125,9,"#fcb68d"),circle(81,125,9,"#ffe3a0"),"Buah pokok");
  diff(345,160,21,p("M335 154q9 -13 18 0","#ed9378"),p("M335 154q9 -13 18 0","#e1c087"),"Lava gunung");
  diff(550,338,21,flower(550,333,"#eea1ae"),flower(550,333,"#a7b2ea"),"Bunga tepi hutan");
 }else if(i===1){ // ice-cream parlour
  add(rect(142,142,325,213,"#f8dfd4")+rect(121,125,365,47,"#ffe8bb")+p("M121 171l40 19 40 -19 40 19 40 -19 40 19 40 -19 40 19 45 -19","#e9a29d",6)+rect(158,230,292,102,"#eed9b9")+rect(185,192,70,65,"#bfe8ee")+rect(351,192,76,65,"#bfe8ee"));
  add(el(286,293,66,15,"#fffbec")+bear(95,289,"#d5a889")+el(520,341,33,12,"#8fbb93"));
  add(p("M257 277l20 49 21-49Z","#d2a06e")+circle(278,267,19,"#e59ab7")+p("M332 277l22 49 20-49Z","#d2a06e")+circle(353,263,22,"#fff0bf"));
  diff(282,266,21,circle(282,252,6,"#e96e84"),circle(282,252,6,"#8fc8d4"),"Ceri aiskrim");
  diff(351,261,19,circle(351,261,7,"#e99c74"),"","Taburan coklat");
  diff(200,206,19,rect(190,201,25,6,"#8ab7b6",2),rect(190,201,25,6,"#efa3a8",2),"Corak tingkap");
  diff(410,211,19,rect(396,197,24,25,"#ffe7a8"),rect(396,197,24,25,"#c7b3de"),"Warna papan menu");
  diff(90,322,18,circle(90,321,9,"#ffebba"),star(90,321,"#ffebba"),"Lambang baju");
  diff(524,352,21,flower(524,347,"#eb8fb1"),flower(524,347,"#a4bce7"),"Bunga depan kedai");
  diff(160,157,19,p("M155 142l9 14 -9 15","#dba49e"),p("M155 142l9 14 -9 15","#8fc8d4"),"Corak awning");
 }else if(i===2){ // balloon party
  add(tree(45,170)+tree(557,164)+rect(224,258,156,100,"#f3bbbd")+rect(243,229,116,33,"#ffe8c9")+circle(302,219,23,"#e1a1ce")+bear(104,289,"#e0b89b")+bear(492,289,"#ece3c4"));
  add(p("M111 119Q301 51 478 119","none",4)+[132,186,240,294,348,402,455].map((x,n)=>p('M'+x+' '+(109-n%2*9)+'l19 24 17-24Z',["#e9a4b2","#f4d98a","#8ccbd4"][n%3])).join(''));
  add(balloon(190,210,"#ff9dad")+balloon(407,185,"#a6c8ff")+balloon(528,207,"#f0cf81"));
  diff(190,210,20,el(190,210,15,20,"#ff9dad"),el(190,210,15,20,"#e4b0eb"),"Warna belon kiri");
  diff(405,178,20,star(405,178,"#ffe8ad"),circle(405,178,13,"#ffe8ad"),"Corak belon biru");
  diff(302,218,21,circle(302,218,10,"#fff5d0"),circle(302,218,10,"#9ecfcb"),"Hiasan kek");
  diff(260,290,17,rect(250,279,24,20,"#f6e0a3"),rect(250,279,24,20,"#d8afdf"),"Warna hadiah");
  diff(102,302,18,circle(103,303,7,"#ffe4b5"),"","Lencana beruang");
  diff(480,304,18,star(481,306,"#e9c6a9"),circle(481,306,13,"#e9c6a9"),"Corak beruang");
  diff(353,114,21,circle(353,111,8,"#ffe5ab"),circle(353,111,8,"#f2a6ae"),"Hiasan bendera");
 }else if(i===3){ // colourful animal zoo
  add(tree(50,157)+tree(553,155)+rect(145,206,317,140,"#e7c5a1")+p("M130 205Q305 155 475 205","#8cad87",12));
  add(el(240,313,60,34,"#edbd90")+circle(284,257,25,"#edbd90")+rect(283,212,18,65,"#edbd90")+circle(292,205,19,"#edbd90")+[0,1,2].map((_,k)=>circle(217+k*23,293,9,"#d59b72")).join(''));
  add(bear(415,286,"#b2c5cf")+rect(135,351,342,12,"#d9b888")+p("M173 351V214M456 351V214","none",5));
  diff(291,205,18,circle(291,193,5,"#775f58"),"","Tompok zirafah");
  diff(220,286,18,circle(220,286,10,"#d59b72"),circle(220,286,10,"#efdf9c"),"Warna tompok");
  diff(415,290,19,star(415,290,"#fff1b8"),circle(415,290,13,"#fff1b8"),"Lambang gajah");
  diff(177,345,20,rect(163,329,28,21,"#f7d588"),rect(163,329,28,21,"#b4c7e7"),"Papan zoo");
  diff(85,155,18,circle(85,155,12,"#f2ab82"),"","Buah di pokok");
  diff(532,321,21,flower(532,317,"#f0a4bd"),flower(532,317,"#f4d286"),"Bunga zoo");
  diff(363,219,18,circle(362,219,10,"#94bfd3"),star(362,219,"#94bfd3"),"Corak dinding");
 }else if(i===4){ // robot city
  for(let x=24;x<600;x+=92)add(rect(x,145+(x%3)*16,76,185,"#8daece")+[0,1,2].map(j=>rect(x+11+j*18,176+(x%3)*16,12,19,"#f9e4a3",2)).join(''));
  add(rect(180,234,160,108,"#c9c9dc")+rect(203,208,115,33,"#b7b9d9")+rect(235,178,46,30,"#edabb7")+circle(257,173,12,"#f6d58d")+rect(154,269,28,49,"#e9b39c")+rect(340,269,28,49,"#e9b39c")+wheel(217,349)+wheel(307,349));
  add(rect(429,259,74,66,"#9ecdd6")+circle(447,279,6,"#304e69")+circle(485,279,6,"#304e69")+p("M451 305Q465 316 481 305")+p("M467 259V238")+circle(467,231,9,"#f6d17d"));
  diff(257,173,19,circle(257,172,10,"#ffd37b"),star(257,172,"#ffd37b"),"Antena robot");
  diff(223,259,19,circle(223,259,10,"#6ca6cf"),circle(223,259,10,"#ed9ba6"),"Mata robot");
  diff(295,260,19,circle(295,260,10,"#6ca6cf"),circle(295,260,10,"#ed9ba6"),"Mata robot kanan");
  diff(262,307,19,rect(248,296,27,20,"#edc38d"),rect(248,296,27,20,"#a7d6aa"),"Butang robot");
  diff(466,232,17,circle(467,231,8,"#f6d17d"),circle(467,231,8,"#adbbeb"),"Antena robot kecil");
  diff(440,320,15,circle(439,320,9,"#f3d7ab"),"","Butang pada robot");
  diff(88,202,17,rect(73,189,23,21,"#f6dda5"),rect(73,189,23,21,"#d5abda"),"Tingkap bandar");
  diff(550,365,19,star(550,365,"#ffe29e"),circle(550,365,12,"#ffe29e"),"Simbol jalan");
 }else if(i===5){ // train journey
  add(tree(72,160)+tree(552,142)+p("M0 348H600M0 389H600","none",9));
  for(let x=0;x<600;x+=45)add(rect(x,345,24,50,"#bba287",2));
  add(rect(155,236,226,99,"#ed9c8b")+rect(376,257,119,78,"#a8c8dd")+rect(145,203,77,49,"#ed9c8b")+rect(178,167,30,36,"#e2ba8c")+rect(223,183,26,54,"#ed9c8b")+circle(239,176,9,"#f5e4b9"));
  add(wheel(197,340)+wheel(291,340)+wheel(413,340)+wheel(468,340)+rect(250,255,62,34,"#e9f0df")+rect(396,276,46,31,"#e9f0df")+p("M154 277l-37 38 41 0Z","#ed9c8b"));
  diff(240,175,19,circle(240,175,9,"#f5e4b9"),star(240,175,"#f5e4b9"),"Lampu lokomotif");
  diff(286,274,20,rect(265,262,41,25,"#9fd9e9"),rect(265,262,41,25,"#e9bacd"),"Warna tingkap");
  diff(417,288,18,circle(417,288,9,"#9fb5dc"),circle(417,288,9,"#ffdd8b"),"Hiasan gerabak");
  diff(197,340,21,circle(197,340,8,"#eef5f1"),star(197,340,"#eef5f1"),"Corak roda");
  diff(476,340,21,circle(469,340,8,"#eef5f1"),"","Tengah roda");
  diff(71,144,18,circle(71,145,12,"#f6bc8d"),"","Buah pokok");
  diff(532,312,20,flower(533,312,"#f0a4c1"),flower(533,312,"#ffdc8d"),"Bunga laluan");
  diff(349,301,19,star(350,302,"#ffdf98"),circle(350,302,13,"#ffdf98"),"Lambang tren");
 }else if(i===6){ // pirate ship and island
  add(p("M55 360Q100 265 180 341Q257 309 293 357V420H40Z","#f1d9a0")+tree(77,214)+p("M260 324L457 324 433 370H285Z","#a97b63")+p("M351 324V110M354 142L454 284H354Z","#fff5d4")+p("M351 171L292 272H351Z","#ead4b1")+rect(322,305,26,19,"#d6a36c"));
  add(rect(96,345,76,49,"#ac7a59")+rect(96,340,76,12,"#edce89")+rect(128,348,14,20,"#f1dc9e")+el(509,350,44,18,"#b9dec5"));
  diff(408,234,21,star(407,234,"#ed9b9d"),circle(407,234,13,"#ed9b9d"),"Lambang layar");
  diff(309,262,23,rect(296,244,27,35,"#b8e1e4"),rect(296,244,27,35,"#e9c08c"),"Warna layar");
  diff(136,351,20,circle(135,353,9,"#ffe398"),"","Kunci peti");
  diff(62,200,18,circle(62,201,11,"#ffd68c"),circle(62,201,11,"#f2a18e"),"Kelapa pokok");
  diff(474,328,20,star(474,328,"#f5cc8d"),circle(474,328,12,"#f5cc8d"),"Bintang laut");
  diff(525,365,19,el(526,364,18,10,"#e6b9a1"),el(526,364,18,10,"#9bcce4"),"Warna kerang");
  diff(377,118,17,circle(377,118,8,"#fff8ca"),"","Bendera kapal");
  diff(211,352,18,flower(210,350,"#f5a9c3"),flower(210,350,"#ffe49a"),"Bunga pulau");
 }else if(i===7){ // fruit market
  add(rect(103,179,398,169,"#e5b58d")+rect(83,148,438,54,"#fff5d6")+p("M83 201l55 17 55-17 55 17 55-17 55 17 55-17 55 17 55-17","#ebaaa1",7));
  add(rect(124,246,348,95,"#d7b08a")+rect(144,257,77,66,"#9bcdd0")+rect(261,257,77,66,"#e9c68f")+rect(378,257,77,66,"#b3d59b"));
  for(let j=0;j<3;j++)add(circle(164+j*28,276,14,"#ed9282")+circle(282+j*28,285,14,"#ffd67d")+circle(400+j*23,293,12,"#b3d77b"));
  add(bear(67,302,"#e4ba91")+tree(548,186));
  diff(177,276,18,circle(177,276,13,"#ed9282"),circle(177,276,13,"#f1cf82"),"Warna epal");
  diff(291,285,18,circle(291,285,13,"#ffd67d"),circle(291,285,13,"#adcce5"),"Buah kuning");
  diff(420,294,17,circle(420,294,11,"#b3d77b"),"","Buah hijau");
  diff(455,229,19,rect(435,213,36,27,"#b6dcdf"),rect(435,213,36,27,"#e3c1d9"),"Papan harga");
  diff(132,167,20,star(130,167,"#f4d68e"),circle(130,167,13,"#f4d68e"),"Hiasan awning");
  diff(67,318,18,circle(67,318,8,"#fff1cf"),"","Lencana penjual");
  diff(548,151,18,circle(548,151,11,"#f3a28a"),"","Buah pokok");
  diff(360,364,18,flower(361,364,"#ef9fba"),flower(361,364,"#f5d37e"),"Bunga pasar");
 }else if(i===8){ // sports day
  add('<path d="M0 310Q300 220 600 303V420H0Z" fill="#e7a390"/><path d="M0 339Q300 254 600 332M0 379Q300 293 600 370" stroke="#fff9e2" stroke-width="6" fill="none"/>');
  add(rect(110,215,15,94,"#aaaac3")+p("M125 215l57 23-57 22Z","#ffde89")+rect(478,215,15,92,"#aaaac3")+p("M493 215l52 23-52 22Z","#a5c9e9"));
  add(bear(299,244,"#e7bd96")+rect(257,292,84,25,"#8ebaca")+el(359,344,31,15,"#efcb8c")+circle(69,367,23,"#ffb17d")+circle(520,372,26,"#f0d68b"));
  add(p("M388 240L402 192 416 240Z","#e4c26c")+el(402,240,27,9,"#ddb471")+p("M380 193H425","#d8ad73",6));
  diff(154,235,19,star(153,235,"#e2a9b3"),circle(153,235,13,"#e2a9b3"),"Corak bendera");
  diff(525,235,18,star(524,235,"#fff2d4"),circle(524,235,12,"#fff2d4"),"Corak bendera kanan");
  diff(294,275,18,circle(294,275,9,"#fce6b8"),"","Lambang baju");
  diff(404,206,18,star(403,206,"#fff0bb"),circle(403,206,13,"#fff0bb"),"Corak piala");
  diff(69,368,20,p("M56 367h25","#f7efda"),p("M69 356v25","#f7efda"),"Garisan bola");
  diff(521,371,19,circle(520,370,11,"#f4c57f"),circle(520,370,11,"#9dbfda"),"Warna bola");
  diff(206,359,19,flower(206,359,"#e5a5bc"),flower(206,359,"#f4da88"),"Bunga padang");
  diff(355,367,18,circle(354,368,10,"#a9d4ab"),"","Rumput kecil");
 }else if(i===9){ // circus
  add(p("M130 327L297 91 462 327Z","#f6d3bf")+p("M208 327L297 91 379 327Z","#e4a0ac")+p("M271 327L297 91 325 327Z","#fff1c6")+rect(130,320,332,38,"#f3c38f")+p("M190 359Q291 199 391 359Z","#aac4e2"));
  add(bear(111,287,"#d8af90")+bear(490,289,"#ebd0ad")+balloon(188,191,"#f4acba")+balloon(422,193,"#a4d7d2")+el(291,368,57,18,"#e7bf94"));
  add([205,247,289,331,373].map((x,j)=>star(x,125+j%2*8,["#ffe5a3","#b5d9d4","#efb4c9"][j%3])).join(''));
  diff(297,111,19,star(297,111,"#f4d78c"),circle(297,111,13,"#f4d78c"),"Bintang puncak");
  diff(187,193,18,el(187,193,15,20,"#f4acba"),el(187,193,15,20,"#afc2e6"),"Belon kiri");
  diff(422,193,18,star(422,193,"#fff3cc"),circle(422,193,12,"#fff3cc"),"Corak belon");
  diff(111,309,18,circle(111,308,9,"#ffe8bb"),"","Lencana beruang");
  diff(490,308,17,star(490,308,"#f8dfa3"),circle(490,308,12,"#f8dfa3"),"Corak beruang");
  diff(293,341,18,rect(279,330,28,22,"#a7d1e4"),rect(279,330,28,22,"#e7aeae"),"Warna pintu");
  diff(354,248,19,circle(354,248,12,"#ffdb88"),circle(354,248,12,"#c9bae4"),"Hiasan khemah");
  diff(245,248,18,star(245,248,"#f2d18c"),circle(245,248,12,"#f2d18c"),"Bintang kain");
  diff(552,371,20,flower(552,369,"#ef9fb5"),flower(552,369,"#d5b5e8"),"Bunga sarkas");
 }else if(i===10){ // playground
  add(tree(55,156)+tree(557,162)+rect(195,166,16,177,"#e6a384")+rect(334,166,16,177,"#e6a384")+p("M194 165H350","#e6a384",11)+p("M211 343L336 223H372L248 344Z","#f6d38a")+rect(332,204,74,16,"#b8d9de")+rect(332,219,16,97,"#b8d9de"));
  add(rect(83,254,17,99,"#b4b4d1")+rect(155,254,17,99,"#b4b4d1")+p("M91 254L164 254","none",7)+p("M112 255V313M148 255V313","none",4)+rect(104,310,50,15,"#e8acb5")+p("M410 342L507 312M410 312L507 342","none",9)+circle(459,327,11,"#f4de9e"));
  add(bear(302,290,"#dcb690")+circle(116,384,19,"#b4e0d5"));
  diff(343,224,18,circle(342,224,10,"#eac5e8"),circle(342,224,10,"#ffd97f"),"Bentuk gelongsor");
  diff(247,323,19,star(247,322,"#ffe5b6"),circle(247,322,12,"#ffe5b6"),"Corak tangga");
  diff(128,315,17,rect(114,309,28,12,"#e8acb5"),rect(114,309,28,12,"#acd5cf"),"Warna buaian");
  diff(459,327,17,star(459,327,"#fff1c0"),circle(459,327,12,"#fff1c0"),"Tengah jongkang-jongket");
  diff(301,299,18,circle(301,299,9,"#f4d88d"),"","Butang baju");
  diff(75,165,18,circle(74,165,11,"#f4b78f"),"","Buah pokok");
  diff(541,171,18,circle(540,171,11,"#f2dc9c"),circle(540,171,11,"#e7a1a6"),"Buah pokok kanan");
  diff(115,382,19,circle(115,382,10,"#eab9ca"),circle(115,382,10,"#f6dda1"),"Warna bola");
  diff(518,366,19,flower(516,365,"#eda5b6"),flower(516,365,"#a6b9e8"),"Bunga taman");
 }else{ // enchanted castle
  add('<path d="M0 303Q280 234 600 306V420H0Z" fill="#8cbbba"/>');
  add(rect(190,175,219,202,"#d8bfdf")+rect(146,214,77,163,"#c7b2dc")+rect(371,213,80,164,"#c7b2dc")+p("M146 214L184 148 223 214Z","#f0aec3")+p("M371 213L411 146 451 213Z","#f0aec3")+p("M244 175L299 105 354 175Z","#f5c2d1")+rect(277,276,45,101,"#a6a1c5")+rect(251,204,41,45,"#d8f0ec")+rect(319,204,41,45,"#d8f0ec"));
  add(p("M110 350Q170 260 234 350","none",16)+p("M100 350Q165 250 242 350","none",6)+bear(99,295,"#f8e3d0")+bear(500,302,"#e5c6ae"));
  add([72,130,486,547].map((x,j)=>star(x,149+j%2*28,"#ffe5a7")).join(''));
  diff(302,126,19,star(303,126,"#ffe59d"),circle(303,126,13,"#ffe59d"),"Bintang menara");
  diff(186,187,18,circle(186,186,11,"#b6e8dc"),circle(186,186,11,"#f2c1db"),"Permata menara kiri");
  diff(411,185,18,circle(411,185,11,"#b6e8dc"),star(411,185,"#b6e8dc"),"Permata menara kanan");
  diff(273,224,20,rect(258,210,28,29,"#d8f0ec"),rect(258,210,28,29,"#f5d2da"),"Warna tingkap");
  diff(341,223,19,p("M341 209V239"),"","Palang tingkap");
  diff(300,316,18,circle(300,316,8,"#ffe7ad"),"","Pemegang pintu");
  diff(101,315,18,circle(101,315,8,"#f0aeb7"),circle(101,315,8,"#e5d19c"),"Lencana beruang");
  diff(501,319,18,star(501,319,"#ffedc2"),circle(501,319,12,"#ffedc2"),"Lambang beruang");
  diff(531,368,18,flower(531,365,"#efa6c0"),flower(531,365,"#ceb6ec"),"Bunga istana");
 }
 if(spots.length!==wanted[i])throw new Error("Scene "+i+" has "+spots.length+" differences, expected "+wanted[i]);
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420" aria-hidden="true"><g stroke-linecap="round" stroke-linejoin="round">'+artwork+'</g></svg>';
 return {svg,spots};
}
const newScenes=titles.map((name,i)=>{
 const a=draw(i,false),b=draw(i,true);
 if(JSON.stringify(a.spots)!==JSON.stringify(b.spots)||a.svg===b.svg)throw new Error("Invalid cartoon spot scene "+i);
 return {id:"cartoon-v2-"+(i+9),name,level:i<4?"Teliti":i<9?"Mencabar":"Pakar",a:a.svg,b:b.svg,spots:a.spots};
});
window.LATIH_SPOT.scenes.push(...newScenes);
function shadeArtwork(content,prefix){
 const colors=[...new Set(content.match(/fill="#[0-9a-fA-F]{6}"/g)||[])].map(s=>s.slice(6,-1));
 const tint=(hex,amount)=>'#'+[1,3,5].map(i=>{const n=parseInt(hex.slice(i,i+2),16);return Math.round(amount>0?n+(255-n)*amount:n*(1+amount)).toString(16).padStart(2,'0');}).join('');
 const defs=colors.map(c=>`<linearGradient id="${prefix}-${c.slice(1)}" x1="0" y1="0" x2=".25" y2="1"><stop stop-color="${tint(c,.12)}"/><stop offset=".65" stop-color="${c}"/><stop offset="1" stop-color="${tint(c,-.04)}"/></linearGradient>`).join('');
 return content.replace(/fill="(#[0-9a-fA-F]{6})"/g,(_,c)=>`fill="url(#${prefix}-${c.slice(1)})"`).replace(/(<svg[^>]*>)/,'$1<defs>'+defs+'</defs>');
}

window.LATIH_SPOT.scenes.forEach((scene,i)=>{for(const side of ["a","b"])scene[side]=shadeArtwork(scene[side],`art-${i}-${side}`);});
})();
