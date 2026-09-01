/* LatihKu v9 engine: QA-cleaned modular packs + procedural Mathematics. */
window.LATIH_ENGINE = (() => {
  const C=window.LATIH_CONFIG;
  const memory=new Map();
  const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
  const uniq=(correct,cands,n=3)=>{const out=[];for(const x of shuffle(cands)){const s=String(x);if(s!==String(correct)&&!out.includes(s))out.push(s);if(out.length===n)break}return out};
  const q=(topic,question,correct,wrong,explanation,difficulty='sederhana',concept='math')=>{
    const c=String(correct),dist=uniq(c,wrong,3);
    const num=Number(String(correct).replace(/,/g,''));
    if(Number.isFinite(num)){for(const x of [num+2,Math.max(0,num-2),num+5,Math.max(0,num-5)]){if(dist.length>=3)break;const s=String(x);if(s!==c&&!dist.includes(s))dist.push(s)}}
    for(const x of ['Tidak berkaitan','Pilihan lain','Tiada perubahan']){if(dist.length>=3)break;if(x!==c&&!dist.includes(x))dist.push(x)}
    return {id:`MATH-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,topic,question,correct:c,answers:shuffle([c,...dist.slice(0,3)]),explanation,difficulty,concept,qa:'v9-procedural'}
  };
  const fmt=n=>Number(n).toLocaleString('ms-MY',{maximumFractionDigits:2});

  function subjectMeta(id){return C.subjects[id]}
  function availableSubjects(level){return Object.entries(C.subjects).filter(([,s])=>s.years.includes(level)).map(([id,s])=>({id,...s}))}
  function packInfo(level,subject){return C.packs[`${level}:${subject}`]||null}
  function difficultyFor(level,requested){if(requested&&requested!=='auto')return requested;const y=+level;if(!y||y<=2)return Math.random()<.75?'mudah':'sederhana';if(y<=4)return pick(['mudah','sederhana','sederhana']);return pick(['sederhana','sederhana','sukar'])}

  async function loadPack(level,subject){
    const key=`${level}:${subject}`; if(memory.has(key))return memory.get(key);
    const info=packInfo(level,subject); if(!info)throw new Error('Pek soalan tidak dijumpai.');
    const res=await fetch(info.url,{cache:'default'}); if(!res.ok)throw new Error('Pek soalan ini belum tersedia offline. Sambung internet sekali atau gunakan “Download semua untuk offline”.');
    const data=await res.json(); if(!Array.isArray(data.questions))throw new Error('Format bank soalan tidak sah.');
    memory.set(key,data.questions); return data.questions;
  }

  function sampleDistinct(items,count){
    const arr=shuffle(items),out=[],used=new Set();
    for(const item of arr){if(!used.has(item.concept)){out.push(item);used.add(item.concept)}if(out.length>=count)break}
    if(out.length<count){for(const item of arr){if(!out.includes(item))out.push(item);if(out.length>=count)break}}
    while(out.length<count&&arr.length)out.push(pick(arr));
    return out.map(x=>({...x,answers:shuffle(x.answers)}));
  }

  async function staticSet(level,subject,topic,count,difficulty){
    const all=await loadPack(level,subject);
    let pool=topic==='Campur Semua'?all:all.filter(x=>x.topic===topic);
    if(!pool.length)pool=all;
    if(difficulty==='uasa'){
      const plan=[]; const easy=Math.round(count*.5),mid=Math.round(count*.3),hard=Math.max(0,count-easy-mid);
      for(const [d,n] of [['mudah',easy],['sederhana',mid],['sukar',hard]]){const p=pool.filter(x=>x.difficulty===d);plan.push(...sampleDistinct(p.length?p:pool,n))}
      return shuffle(plan).slice(0,count);
    }
    if(difficulty!=='auto'){const exact=pool.filter(x=>x.difficulty===difficulty);if(exact.length>=Math.min(5,count))pool=exact}
    return sampleDistinct(pool,count);
  }

  function mathNumber(level,diff){
    const y=+level; const maxBy=[0,100,1000,10000,100000,1000000,1000000]; let max=maxBy[y]||100;
    if(diff==='mudah')max=Math.max(20,Math.floor(max/10)); if(diff==='sukar')max=Math.min(1000000,max*2);
    const mode=ri(1,y>=3?5:4);
    if(mode===1){const n=ri(1,max-1);return q('Nombor',`Apakah nombor selepas ${fmt(n)}?`,n+1,[n-1,n+10,n+2],`Nombor selepas ${fmt(n)} ialah ${fmt(n+1)}.`,diff,`next-${n}`)}
    if(mode===2){let a=ri(1,max),b=ri(1,max);while(b===a)b=ri(1,max);const c=Math.max(a,b);return q('Nombor',`Antara ${fmt(a)} dan ${fmt(b)}, nombor manakah lebih besar?`,c,[Math.min(a,b),Math.max(0,c-1),c+1],`${fmt(c)} lebih besar daripada ${fmt(Math.min(a,b))}.`,diff,`compare-${a}-${b}`)}
    if(mode===3&&y>=2){const places=[10,100,1000,10000,100000].filter(p=>p<=max);const place=pick(places);let n=ri(place,max);let digit=Math.floor(n/place)%10;if(digit===0){n+=place;digit=Math.floor(n/place)%10}const ans=digit*place;return q('Nombor',`Apakah nilai digit ${digit} dalam nombor ${fmt(n)}?`,fmt(ans),[digit,digit*10,digit*100,digit*1000].map(fmt),`Digit ${digit} berada pada nilai tempat ${fmt(place)}, jadi nilainya ${fmt(ans)}.`,diff,`place-${n}-${place}`)}
    if(mode===5&&y>=3){const vals=[];while(vals.length<4){const n=ri(1,max);if(!vals.includes(n))vals.push(n)}const asc=Math.random()>.5,target=[...vals].sort((a,b)=>asc?a-b:b-a),correct=target.map(fmt).join(' → ');const wrong=[shuffle(vals).map(fmt).join(' → '),[...vals].sort((a,b)=>asc?b-a:a-b).map(fmt).join(' → '),shuffle(vals).map(fmt).join(' → ')];return q('Nombor',`Pilih susunan nombor mengikut tertib ${asc?'menaik':'menurun'}.`,correct,wrong,`Tertib ${asc?'menaik bermula daripada nombor paling kecil':'menurun bermula daripada nombor paling besar'}.`,diff,`order-${asc?'asc':'desc'}-${vals.join('-')}`)}
    const n=ri(1,max);const nearest=y<=2?10:y<=4?100:1000;const ans=Math.round(n/nearest)*nearest;return q('Nombor',`Bundarkan ${fmt(n)} kepada ${nearest===10?'puluh':nearest===100?'ratus':'ribu'} terdekat.`,fmt(ans),[ans-nearest,ans+nearest,n].map(fmt),`Lihat digit di sebelah kanan nilai tempat yang hendak dibundarkan. Jawapan: ${fmt(ans)}.`,diff,`round-${n}-${nearest}`)
  }
  function mathAddSub(level,diff){const y=+level;let max=y===1?100:y===2?1000:y===3?10000:y===4?100000:1000000;if(diff==='mudah')max=Math.floor(max/10);const add=Math.random()>.48;let a=ri(1,max),b=ri(1,max);if(!add&&b>a)[a,b]=[b,a];const ans=add?a+b:a-b;const op=add?'+':'−';return q('Tambah & Tolak',`${fmt(a)} ${op} ${fmt(b)} = ?`,fmt(ans),[ans+1,Math.max(0,ans-1),ans+10,a+b,a-b].map(fmt),`${fmt(a)} ${op} ${fmt(b)} = ${fmt(ans)}.`,diff,`${add?'add':'sub'}-${a}-${b}`)}
  function mathMulDiv(level,diff){const y=+level;const m=diff==='mudah'?5:y<=2?6:y===3?10:12;if(Math.random()>.5){const a=ri(2,m),b=ri(2,m);const ans=a*b;return q('Darab & Bahagi',`${a} × ${b} = ?`,ans,[ans+a,Math.max(0,ans-a),a+b,ans+1],`${a} didarab ${b} bersamaan ${ans}.`,diff,`mul-${a}-${b}`)}const b=ri(2,m),ans=ri(2,m),a=b*ans;return q('Darab & Bahagi',`${a} ÷ ${b} = ?`,ans,[ans+1,Math.max(1,ans-1),b,a],`${a} dibahagi ${b} bersamaan ${ans}.`,diff,`div-${a}-${b}`)}
  function mathFraction(level,diff){const y=+level;if(y<=2){return pick([q('Pecahan','Yang manakah mewakili satu perdua?','1/2',['1/3','2/3','2/2'],'Satu perdua ditulis sebagai 1/2.',diff,'half'),q('Pecahan','Jika satu objek dibahagi kepada 4 bahagian sama, satu bahagiannya ialah…','1/4',['1/2','2/4','4/1'],'Satu daripada empat bahagian sama ditulis 1/4.',diff,'quarter')])}const d=pick(diff==='sukar'?[4,5,8,10,12]:[2,3,4,5,8,10]);let a=ri(1,d-1),b=ri(1,d-1);if(Math.random()<.55&&a+b<d){const ans=`${a+b}/${d}`;return q('Pecahan',`${a}/${d} + ${b}/${d} = ?`,ans,[`${Math.abs(a-b)}/${d}`,`${a+b}/${d*2}`,`${a+b}/${d+1}`],`Penyebut sama, jadi tambah pembilang: ${a} + ${b} = ${a+b}.`,diff,`fracadd-${a}-${b}-${d}`)}const nums=shuffle([ri(1,d-1),ri(1,d-1),ri(1,d-1),d-1]);const mx=Math.max(...nums);return q('Pecahan',`Antara pecahan berikut, yang manakah paling besar?`,`${mx}/${d}`,nums.filter(n=>n!==mx).slice(0,3).map(n=>`${n}/${d}`),`Apabila penyebut sama, pembilang yang lebih besar menghasilkan pecahan lebih besar.`,diff,`fraccompare-${nums.join('-')}-${d}`)}
  function mathMoney(level,diff){const y=+level;const max=diff==='mudah'?50:y<=3?200:1000;const a=ri(2,max),b=ri(1,Math.max(2,Math.floor(max/2)));if(Math.random()<.55){const total=a+b;return q('Wang',`Aina mempunyai RM${a}. Dia menerima lagi RM${b}. Berapakah jumlah wangnya?`,`RM${total}`,[`RM${a-b}`,`RM${total+1}`,`RM${a}`],`RM${a} + RM${b} = RM${total}.`,diff,`moneyadd-${a}-${b}`)}const paid=a+b;return q('Wang',`Harga sebuah barang ialah RM${a}. Jika dibayar RM${paid}, berapakah baki?`,`RM${b}`,[`RM${a}`,`RM${paid}`,`RM${Math.max(0,b-1)}`],`RM${paid} − RM${a} = RM${b}.`,diff,`change-${a}-${paid}`)}
  function mathTime(level,diff){const h=ri(1,11),mins=pick(diff==='mudah'?[0,30]:[0,15,30,45]),add=pick(diff==='sukar'?[2,3,4]:[1,2,3]);const total=h*60+mins+add*60;const ah=Math.floor(total/60)%12||12;const am=total%60;const cur=`${h}:${String(mins).padStart(2,'0')}`;const ans=`${ah}:${String(am).padStart(2,'0')}`;return q('Masa',`Sekarang pukul ${cur}. ${add} jam kemudian ialah pukul berapa?`,ans,[`${h}:${String((mins+30)%60).padStart(2,'0')}`,`${(ah%12)+1}:${String(am).padStart(2,'0')}`,`${Math.max(1,h-add)}:${String(mins).padStart(2,'0')}`],`Tambah ${add} jam kepada ${cur}. Jawapan ialah ${ans}.`,diff,`time-${h}-${mins}-${add}`)}
  function mathMeasure(level,diff){if(Math.random()<.5){const m=ri(1,diff==='sukar'?50:10);const cm=m*100;return q('Ukuran',`${cm} cm bersamaan berapa meter?`,`${m} m`,[`${cm/10} m`,`${cm} m`,`${m/10} m`],`100 cm = 1 m, jadi ${cm} cm = ${m} m.`,diff,`cm-${cm}`)}const kg=ri(1,diff==='sukar'?25:10);const g=kg*1000;return q('Ukuran',`${kg} kg bersamaan berapa gram?`,`${g} g`,[`${kg*100} g`,`${kg} g`,`${g+100} g`],`1 kg = 1000 g, jadi ${kg} kg = ${g} g.`,diff,`kg-${kg}`)}
  function mathShape(level,diff){const facts=[['Bentuk 2D yang mempunyai 3 sisi ialah…','Segi tiga',['Segi empat sama','Bulatan','Segi lima'],'Segi tiga mempunyai tiga sisi.'],['Bentuk 3D yang mempunyai 6 permukaan segi empat sama ialah…','Kubus',['Kon','Sfera','Silinder'],'Kubus mempunyai enam permukaan segi empat sama.'],['Bentuk yang tiada sisi lurus ialah…','Bulatan',['Segi tiga','Segi empat tepat','Segi lima'],'Bulatan mempunyai garisan melengkung tanpa sisi lurus.']];if(+level>=4&&Math.random()>.45){const l=ri(2,15),w=ri(2,12),ans=l*w;return q('Bentuk & Ruang',`Sebuah segi empat tepat mempunyai panjang ${l} cm dan lebar ${w} cm. Berapakah luasnya?`,`${ans} cm²`,[`${2*(l+w)} cm²`,`${l+w} cm²`,`${ans+2} cm²`],`Luas segi empat tepat = panjang × lebar = ${l} × ${w} = ${ans} cm².`,diff,`area-${l}-${w}`)}const f=pick(facts);return q('Bentuk & Ruang',f[0],f[1],f[2],f[3],diff,`shape-${f[1]}`)}
  function mathData(level,diff){const vals=Array.from({length:diff==='sukar'?6:4},()=>ri(2,20));if(+level>=5&&diff!=='mudah'){const sum=vals.reduce((a,b)=>a+b,0);const adjusted=[...vals];const rem=sum%vals.length;if(rem)adjusted[adjusted.length-1]+=vals.length-rem;const s=adjusted.reduce((a,b)=>a+b,0),mean=s/adjusted.length;return q('Data',`Data: ${adjusted.join(', ')}. Apakah min (purata) data tersebut?`,mean,[mean+1,Math.max(0,mean-1),Math.max(...adjusted)],`Jumlah ${s} dibahagi ${adjusted.length} = ${mean}.`,diff,`mean-${adjusted.join('-')}`)}const max=Math.max(...vals);return q('Data',`Data: ${vals.join(', ')}. Nilai tertinggi ialah…`,max,[Math.min(...vals),max+1,Math.max(0,max-1)],`Cari nombor paling besar dalam set data.`,diff,`max-${vals.join('-')}`)}
  const MATH_GEN={'Nombor':mathNumber,'Tambah & Tolak':mathAddSub,'Darab & Bahagi':mathMulDiv,'Pecahan':mathFraction,'Wang':mathMoney,'Masa':mathTime,'Ukuran':mathMeasure,'Bentuk & Ruang':mathShape,'Data':mathData};
  function mathSet(level,topic,count,difficulty){
    const topics=topic==='Campur Semua'?C.subjects.math.topics:[topic],out=[],seen=new Set();
    const plan=difficulty==='uasa'?[...Array(Math.round(count*.5)).fill('mudah'),...Array(Math.round(count*.3)).fill('sederhana'),...Array(Math.max(0,count-Math.round(count*.5)-Math.round(count*.3))).fill('sukar')]:Array(count).fill(null);
    let tries=0;while(out.length<count&&tries<count*30){tries++;const t=pick(topics),d=difficulty==='uasa'?(plan[out.length]||'sederhana'):difficultyFor(level,difficulty),item=MATH_GEN[t](level,d);if(!seen.has(item.concept)){out.push(item);seen.add(item.concept)}}
    while(out.length<count){const t=pick(topics),d=difficulty==='uasa'?(plan[out.length]||'sederhana'):difficultyFor(level,difficulty);out.push(MATH_GEN[t](level,d))}
    return difficulty==='uasa'?shuffle(out):out
  }

  async function makeSet(level,subject,topic,count,difficulty='auto'){
    if(subject==='math')return mathSet(level,topic,count,difficulty);
    return staticSet(level,subject,topic,count,difficulty);
  }
  async function downloadAll(onProgress=()=>{}){
    const packs=Object.values(C.packs),total=packs.length;let done=0,bytes=0;
    for(const p of packs){const res=await fetch(p.url);if(!res.ok)throw new Error(`Gagal memuat turun ${p.url}`);await res.arrayBuffer();done++;bytes+=p.bytes||0;onProgress(done,total,p)}
    return {done,total,bytes};
  }
  function clearMemory(){memory.clear()}
  function totalStatic(){return Object.values(C.packs).reduce((a,p)=>a+p.count,0)}
  function totalBytes(){return Object.values(C.packs).reduce((a,p)=>a+(p.bytes||0),0)}
  return {availableSubjects,subjectMeta,packInfo,makeSet,downloadAll,clearMemory,totalStatic,totalBytes};
})();
