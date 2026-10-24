/* Original LatihKu cartoon puzzle scenes; not a single photograph is used.
   Adapted Twemoji SVG artwork is bundled in sprite files, CC BY 4.0:
   https://github.com/jdecked/twemoji — details in assets/game-cartoons/ATTRIBUTION.md.
   All puzzle scenes, palettes and layouts here are original LatihKu compositions. */
(function(){
"use strict";
const categories={"lion":"animal","tiger":"animal","elephant":"animal","giraffe":"animal","zebra":"animal","horse":"animal","panda":"animal","penguin":"animal","rabbit":"animal","dolphin":"animal","frog":"animal","shark":"animal","turtle":"animal","bee":"animal","butterfly":"animal","airplane":"vehicle","ambulance":"vehicle","bicycle":"vehicle","bus":"vehicle","car":"vehicle","firetruck":"vehicle","helicopter":"vehicle","motorcycle":"vehicle","rocket":"vehicle","sailboat":"vehicle","ship":"vehicle","submarine":"vehicle","tractor":"vehicle","train":"vehicle","tram":"vehicle","truck":"vehicle","apple":"fruit","banana":"fruit","grape":"fruit","strawberry":"fruit","orange":"fruit","watermelon":"fruit","pineapple":"fruit","mango":"fruit","kiwi":"fruit","coconut":"fruit","durian":"fruit","sun":"nature","moon":"nature","earth":"nature","jupiter":"nature","venus":"nature","mars":"nature","rose":"nature","orchid":"nature","sunflower":"nature","lotus":"nature","tulip":"nature","hibiscus":"nature","oak":"nature","bamboo":"nature","fern":"nature","cactus":"nature","guitar":"fun","piano":"fun","violin":"fun","drums":"fun","football":"fun","basketball":"fun","badminton":"fun","xylophone":"fun","waffle":"fun","pizza":"fun","croissant":"fun","burger":"fun","school":"fun","astronaut":"fun","tambourine":"fun","ukulele":"fun","taco":"fun","nasilemak":"fun"};
const labels={"lion":"Singa","tiger":"Harimau","elephant":"Gajah","giraffe":"Zirafah","zebra":"Zebra","horse":"Kuda","panda":"Panda","penguin":"Penguin","rabbit":"Arnab","dolphin":"Ikan Lumba-lumba","frog":"Katak","shark":"Jerung","turtle":"Kura-kura","bee":"Lebah","butterfly":"Rama-rama","airplane":"Kapal Terbang","ambulance":"Ambulans","bicycle":"Basikal","bus":"Bas","car":"Kereta","firetruck":"Kereta Bomba","helicopter":"Helikopter","motorcycle":"Motosikal","rocket":"Roket","sailboat":"Bot Layar","ship":"Kapal","submarine":"Kapal Selam","tractor":"Traktor","train":"Kereta Api","tram":"Tram","truck":"Lori","apple":"Epal","banana":"Pisang","grape":"Anggur","strawberry":"Strawberi","orange":"Oren","watermelon":"Tembikai","pineapple":"Nanas","mango":"Mangga","kiwi":"Kiwi","coconut":"Kelapa","durian":"Durian","sun":"Matahari","moon":"Bulan","earth":"Bumi","jupiter":"Musytari","venus":"Zuhrah","mars":"Marikh","rose":"Mawar","orchid":"Orkid","sunflower":"Bunga Matahari","lotus":"Teratai","tulip":"Tulip","hibiscus":"Bunga Raya","oak":"Pokok Oak","bamboo":"Buluh","fern":"Paku Pakis","cactus":"Kaktus","guitar":"Gitar","piano":"Piano","violin":"Biola","drums":"Dram","football":"Bola Sepak","basketball":"Bola Keranjang","badminton":"Badminton","xylophone":"Xilofon","waffle":"Wafel","pizza":"Piza","croissant":"Kroisan","burger":"Burger","school":"Sekolah","astronaut":"Angkasawan","tambourine":"Tamborin","ukulele":"Ukulele","taco":"Taco","nasilemak":"Nasi Lemak"};
const palette={
 animal:["#caedff","#e2f8d5","#a5d890","#ffe198"],
 vehicle:["#bfe9ff","#e8f3ff","#83b9e5","#ffd49a"],
 fruit:["#ffe0ee","#fff5da","#ffd2a6","#99dab0"],
 nature:["#d7e6ff","#e2f6dc","#a5d58d","#ffda9d"],
 fun:["#efddff","#fff0d9","#c6b6f2","#ffc2bd"]
};
const cache=Object.create(null),sprites=window.LATIH_CARTOON_SPRITES||{};
const face='<circle cx="42" cy="49" r="3" fill="#324b56"/><circle cx="58" cy="49" r="3" fill="#324b56"/><path d="M44 60Q50 67 56 60" fill="none" stroke="#324b56" stroke-width="2.5" stroke-linecap="round"/>';
function special(id){
 if(id==="durian")return '<path d="M48 9l5 10 14-4-2 13 14 7-9 8 8 12-12 5 0 14-14-5-8 12-8-12-15 5 0-14-12-5 8-12-9-9 14-5-1-13 15 5Z" fill="#a7c858" stroke="#60893b" stroke-width="2"/><ellipse cx="50" cy="49" rx="29" ry="28" fill="#c2da68"/>'+face+'<path d="M50 20Q52 10 60 9" stroke="#60893b" stroke-width="4" fill="none"/>';
 if(id==="submarine")return '<path d="M23 56Q10 39 26 30H70Q87 39 76 58Q66 72 26 64Z" fill="#ffc753" stroke="#bc802d" stroke-width="3"/><path d="M49 30V17H65V30" fill="#ffd66a" stroke="#bc802d" stroke-width="3"/><path d="M65 17V9H76" fill="none" stroke="#bc802d" stroke-width="4"/><circle cx="39" cy="46" r="10" fill="#a5e5f2" stroke="#39667a" stroke-width="3"/><circle cx="61" cy="46" r="10" fill="#a5e5f2" stroke="#39667a" stroke-width="3"/><path d="M76 46l14-8v18Z" fill="#f59c5c" stroke="#bc802d" stroke-width="3"/><circle cx="15" cy="15" r="5" fill="#d5f6ff"/><circle cx="9" cy="25" r="3" fill="#d5f6ff"/>';
 if(id==="jupiter")return '<circle cx="50" cy="49" r="36" fill="#e6ad77" stroke="#b67a57" stroke-width="2"/><path d="M20 26H80M17 38H83M16 48H84M20 59H80M27 70H73" stroke="#b87960" stroke-width="6" stroke-linecap="round"/><ellipse cx="62" cy="59" rx="11" ry="7" fill="#cb7057"/>';
 if(id==="venus")return '<circle cx="50" cy="49" r="37" fill="#f9d77a" stroke="#cd9851" stroke-width="3"/><path d="M21 28Q40 14 70 30M19 53Q55 42 80 55M30 75Q50 63 70 73" stroke="#e4b15e" stroke-width="9" fill="none" stroke-linecap="round"/>';
 if(id==="mars")return '<circle cx="50" cy="49" r="36" fill="#e88b65" stroke="#b65b4b" stroke-width="3"/><circle cx="32" cy="36" r="9" fill="#d67559"/><circle cx="69" cy="59" r="12" fill="#d67559"/><circle cx="52" cy="22" r="6" fill="#f3ad83"/>';
 if(id==="xylophone")return '<path d="M21 79L68 18M26 20l54 64" stroke="#976740" stroke-width="6"/>'+["#ef747f","#f3a553","#f4d360","#80caa6","#6bbde3","#9c9ee1"].map((c,i)=>'<rect x="'+(16+i*11)+'" y="'+(22+i*4)+'" width="17" height="49" rx="5" fill="'+c+'" stroke="#665d77" stroke-width="2" transform="rotate(-37 '+(26+i*11)+' '+(51+i*4)+')"/>').join('')+'<path d="M16 80L84 20" stroke="#906644" stroke-width="3"/>';
 if(id==="tambourine")return '<circle cx="50" cy="50" r="35" fill="#e5a76a" stroke="#a76e49" stroke-width="5"/><circle cx="50" cy="50" r="24" fill="#ffebcb" stroke="#a76e49" stroke-width="2"/>'+Array.from({length:8},(_,i)=>{const a=i*Math.PI/4;return '<circle cx="'+(50+33*Math.cos(a)).toFixed(1)+'" cy="'+(50+33*Math.sin(a)).toFixed(1)+'" r="6" fill="#a6d4ed" stroke="#788b9e" stroke-width="2"/>';}).join('')+face;
 if(id==="ukulele")return '<path d="M30 53Q19 40 28 29Q40 19 50 37Q63 21 73 35Q82 53 62 67Q45 82 30 53Z" fill="#dda76f" stroke="#9f6845" stroke-width="3"/><circle cx="50" cy="48" r="11" fill="#6b4b3b"/><rect x="61" y="13" width="13" height="39" rx="4" fill="#ad764c" stroke="#7b533a" stroke-width="2" transform="rotate(32 61 13)"/><path d="M42 73l36-56M47 76l36-56M51 77l36-56" stroke="#fff1ca" stroke-width="1.5"/>';
 if(id==="nasilemak")return '<ellipse cx="50" cy="67" rx="44" ry="19" fill="#8dbd76" stroke="#4f8464" stroke-width="3"/><path d="M9 63Q35 18 87 57L91 65Q51 93 9 63Z" fill="#eff3d9"/><path d="M15 56Q35 17 53 39Q65 54 40 72Q24 73 15 56Z" fill="#fffbed"/><path d="M47 59Q60 39 79 49Q90 62 71 70Z" fill="#bd513c"/><ellipse cx="73" cy="35" rx="17" ry="12" fill="#fffaf1" stroke="#e1dbcb" stroke-width="2"/><ellipse cx="73" cy="35" rx="8" ry="7" fill="#edb543"/><circle cx="22" cy="75" r="4" fill="#985d42"/><circle cx="30" cy="78" r="4" fill="#985d42"/>';
 return "";
}
function illustration(id){
 if(!(id in categories))throw new Error("Unknown cartoon: "+id);
 const cat=categories[id],colors=palette[cat],index=Object.keys(categories).indexOf(id);
 const n=Math.max(0,index),[sky,top,grass,accent]=colors,parts=[];
 parts.push('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" role="img" aria-label="'+labels[id]+'">');
 parts.push('<defs><linearGradient id="sky" x1="0" x2="0" y1="0" y2="1"><stop stop-color="'+sky+'"/><stop offset="1" stop-color="'+top+'"/></linearGradient></defs>');
 parts.push('<rect width="480" height="480" fill="url(#sky)"/>');
 parts.push('<circle cx="'+(350+(n*7)%72)+'" cy="85" r="40" fill="'+accent+'" opacity=".7"/>');
 parts.push('<path d="M0 290Q100 225 240 282T480 250V480H0Z" fill="'+grass+'" opacity=".65"/>');
 parts.push('<path d="M0 358Q110 307 240 348T480 334V480H0Z" fill="'+top+'" opacity=".8"/>');
 parts.push('<g fill="#fff" opacity=".8"><ellipse cx="82" cy="91" rx="46" ry="20"/><circle cx="60" cy="77" r="22"/><ellipse cx="278" cy="59" rx="36" ry="12"/></g>');
 for(let i=0;i<8;i++){const x=24+(i*71+n*11)%435,y=153+(i*43+n*9)%217;parts.push('<circle cx="'+x+'" cy="'+y+'" r="'+(3+i%3)+'" fill="'+accent+'" opacity=".9"/>');}
 parts.push('<ellipse cx="240" cy="333" rx="133" ry="27" fill="#334b6f" opacity=".12"/>');
 const custom=special(id);
 if(custom)parts.push('<svg x="92" y="77" width="296" height="288" viewBox="0 0 100 100">'+custom+'</svg>');
 else if(sprites[id])parts.push('<svg x="92" y="64" width="296" height="302" viewBox="0 0 36 36">'+sprites[id]+'</svg>');
 else throw new Error("Missing sprite artwork: "+id);
 parts.push('<rect x="48" y="398" width="384" height="60" rx="26" fill="#fffaf1" stroke="#fff" stroke-width="5"/>');
 const label=labels[id],fontsize=label.length>17?23:label.length>12?27:33;
 parts.push('<text x="240" y="438" text-anchor="middle" font-family="Arial,sans-serif" font-size="'+fontsize+'" font-weight="900" fill="#36516c">'+label+'</text></svg>');
 return parts.join("");
}
function image(id){
 if(!cache[id])cache[id]="data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(illustration(id));
 return cache[id];
}
window.LATIH_CARTOONS={ids:Object.keys(categories),labels,label:id=>labels[id]||id,has:id=>id in categories,image,illustration};
})();
