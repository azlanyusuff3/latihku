/* LatihKu engine: curated-first rotation + template/PDF-pattern generator + procedural Math. */
window.LATIH_ENGINE = (() => {
  const C=window.LATIH_CONFIG;
  const memory=new Map();
  const ri=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
  const uniq=(correct,cands,n=3)=>{const out=[];for(const x of shuffle(cands)){const s=String(x);if(s!==String(correct)&&!out.includes(s))out.push(s);if(out.length===n)break}return out};
  const q=(topic,question,correct,wrong,explanation,difficulty='sederhana',concept='math',meta={})=>{
    const c=String(correct),dist=uniq(c,wrong,3);
    const num=Number(String(correct).replace(/,/g,''));
    if(Number.isFinite(num)&&/^[\d,.]+$/.test(c)){for(const x of [num+2,Math.max(0,num-2),num+5,Math.max(0,num-5)]){if(dist.length>=3)break;const s=fmt(x);if(s!==c&&!dist.includes(s))dist.push(s)}}
    return {id:`MATH-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,topic,question,correct:c,answers:shuffle([c,...dist.slice(0,3)]),explanation,difficulty,concept,qa:'procedural',source:'LatihKu Math Generator',alignment:'KPM/PDF-pattern aligned practice',itemType:'mcq',smart:true,smartSignature:`math|${topic}|${concept}`,...meta}
  };
  const qs=(topic,question,correct,explanation,difficulty='sederhana',concept='math-short',meta={})=>({id:`MATH-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,topic,question,correct:String(correct),answers:[],explanation,difficulty,concept,qa:'procedural',source:'LatihKu Math Generator',alignment:'KPM UASA pattern',itemType:'short',smart:true,smartSignature:`math|${topic}|${concept}`,...meta});
  const fmt=n=>Number(n).toLocaleString('ms-MY',{maximumFractionDigits:2});
  const names=['Aina','Amir','Siti','Ravi','Mei Ling','Hakim','Sara','Daniel'];

  async function tutorItems(level,subject,topic){
    const all=packInfo(level,subject)?await loadPack(level,subject):await makeSet(level,subject,topic,20,'auto');
    const generated=await makeSet(level,subject,topic,20,'auto',{seenIds:all.map(x=>String(x.id))});
    const seen=new Set(),items=[];
    for(const item of [...shuffle(all),...generated]){
      const key=JSON.stringify([String(item.question).trim().toLowerCase(),String(item.correct)]);
      if(item.topic!==topic||item.itemType==='short'||!validateItem(item)||seen.has(key))continue;
      seen.add(key);items.push(cloneQuestion(item));
    }
    if(items.length<4)throw new Error('Topik ini belum mempunyai cukup contoh tutor. Sila gunakan latihan topik ini dahulu.');
    return items;
  }
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

  function cloneQuestion(x){return {...x,answers:Array.isArray(x.answers)?shuffle(x.answers):[]}}

  // Same stem + same answer + same options = a repeat, whether it came from the bank or a generator.
  const itemKey=x=>[String(x.question).trim().toLowerCase().replace(/\s+/g,' '),String(x.correct).trim().toLowerCase(),[...(x.answers||[])].map(a=>String(a).toLowerCase()).sort().join('|')].join('#');
  const stemKey=x=>String(x.question).trim().toLowerCase().replace(/\s+/g,' ')+'#'+String(x.correct).trim().toLowerCase();
  function generatorFor(level,subject){return window.LATIH_PDF_ENGINE?.supports(level,subject)?window.LATIH_PDF_ENGINE:window.LATIH_SMART}
  function uniqueTopUp(list,level,subject,topic,count,difficulty,ctx){
    const seen=new Set(),out=[];
    for(const x of list){const k=stemKey(x);if(seen.has(k))continue;seen.add(k);out.push(x)}
    if(out.length<count){const gen=generatorFor(level,subject),d=difficulty==='uasa'?'auto':difficulty;
      for(const x of gen?.makeSet(level,subject,topic,count-out.length,d,{...ctx,recentGenerated:[],excludeStems:seen})||[]){if(out.length>=count)break;const k=stemKey(x);if(!seen.has(k)){seen.add(k);out.push(x)}}}
    return out.slice(0,count);
  }
  // In "Campur Semua", take curated items evenly across topics so one big topic (e.g. Ejaan) cannot fill the set.
  function balanced(items,n,topic,subject){if(topic!=='Campur Semua')return items.slice(0,n);const per=Math.max(1,Math.ceil(n/Math.max(1,(C.subjects[subject]?.topics||[]).length))),used={},out=[];for(const x of items){if((used[x.topic]||0)>=per)continue;used[x.topic]=(used[x.topic]||0)+1;out.push(x);if(out.length>=n)break}return out}
  async function staticSet(level,subject,topic,count,difficulty,ctx={}){
    const all=await loadPack(level,subject);
    // A topic with no curated items for this year is served by the generators, not by other topics.
    const pool=topic==='Campur Semua'?all:all.filter(x=>x.topic===topic);
    const seen=new Set(ctx.seenIds||[]);
    // UASA is also curated-first. Once unseen curated items for an aras are exhausted,
    // generate fresh items instead of recycling the same paper forever.
    if(difficulty==='uasa'){
      const out=[], easy=Math.round(count*.5),mid=Math.round(count*.3),hard=Math.max(0,count-easy-mid),genCtx={weakTopics:ctx.weakTopics||{},recentGenerated:ctx.recentGenerated||[]};
      for(const [d,n] of [['mudah',easy],['sederhana',mid],['sukar',hard]]){
        const exact=pool.filter(x=>x.difficulty===d),base=exact.length?exact:pool,unseen=shuffle(base.filter(x=>!seen.has(String(x.id))));
        const picked=balanced(unseen,n,topic,subject);out.push(...picked.map(cloneQuestion));
        let need=n-picked.length;
        if(need>0){
          let fresh=[];
          if(window.LATIH_PDF_ENGINE?.supports(level,subject))fresh=window.LATIH_PDF_ENGINE.makeSet(level,subject,topic,need,d,genCtx)||[];
          if(fresh.length<need){const extra=window.LATIH_SMART?.makeSet(level,subject,topic,need-fresh.length,d,genCtx)||[];fresh.push(...extra);}
          out.push(...fresh.slice(0,need));need-=Math.min(need,fresh.length);
        }
        if(need>0)out.push(...sampleDistinct(base,need).map(x=>({...x,rotationFallback:true})));
      }
      return shuffle(uniqueTopUp(out,level,subject,topic,count,difficulty,ctx)).slice(0,count).map((x,i)=>({...x,alignment:x.alignment||'KPM UASA pattern',source:x.source||'LatihKu Original',itemType:x.itemType||((['sci','hist'].includes(subject)&&i>=Math.ceil(count*.65)&&String(x.correct).trim().split(/\s+/).length<=3&&!/[,…]/.test(String(x.correct)))?'short':'mcq')}));
    }
    let usePool=pool;if(difficulty!=='auto'){const exact=pool.filter(x=>x.difficulty===difficulty);if(exact.length>=Math.min(5,count))usePool=exact}
    const unseen=shuffle(usePool.filter(x=>!seen.has(String(x.id))));
    const staticItems=balanced(unseen,count,topic,subject).map(cloneQuestion);
    const remaining=count-staticItems.length;
    if(remaining<=0)return staticItems;
    const genCtx={weakTopics:ctx.weakTopics||{},recentGenerated:ctx.recentGenerated||[]};
    let smart=[];
    if(window.LATIH_PDF_ENGINE?.supports(level,subject)) smart=window.LATIH_PDF_ENGINE.makeSet(level,subject,topic,remaining,difficulty,genCtx)||[];
    if(smart.length<remaining){const extra=window.LATIH_SMART?.makeSet(level,subject,topic,remaining-smart.length,difficulty,genCtx)||[];smart.push(...extra);}
    if(smart.length<remaining){
      const fallback=sampleDistinct(pool,remaining-smart.length).map(x=>({...x,rotationFallback:true}));
      smart.push(...fallback);
    }
    return uniqueTopUp([...staticItems,...smart],level,subject,topic,count,difficulty,ctx);
  }

  // ---- Matematik ikut DSKP: julat nombor dan kemahiran mengikut Tahun ----
  const NUM_MAX=[0,100,1000,10000,100000,1000000,1000000];
  const yr=level=>Math.min(6,Math.max(1,+level||1));
  const capFor=(y,diff)=>{const max=NUM_MAX[y];return diff==='mudah'?Math.max(20,Math.floor(max/10)):max};
  const gcd=(a,b)=>b?gcd(b,a%b):a;
  const placeNames={1:'sa',10:'puluh',100:'ratus',1000:'ribu',10000:'puluh ribu',100000:'ratus ribu'};
  function mathNumber(level,diff){
    const y=yr(level),max=capFor(y,diff),modes=y===1?[1,2,6]:y===2?[1,2,3,4,6]:[1,2,3,4,5],mode=pick(modes);
    if(mode===1){const n=ri(1,max-1);return q('Nombor',`Apakah nombor selepas ${fmt(n)}?`,fmt(n+1),[n-1,n+10,n+2].map(fmt),`Nombor selepas ${fmt(n)} ialah ${fmt(n+1)}.`,diff,`next-${n}`)}
    if(mode===6){const n=ri(2,max);return q('Nombor',`Apakah nombor sebelum ${fmt(n)}?`,fmt(n-1),[n+1,Math.max(0,n-2),n-10<0?n+2:n-10].map(fmt),`Nombor sebelum ${fmt(n)} ialah ${fmt(n-1)}.`,diff,`before-${n}`)}
    if(mode===2){const vals=new Set();while(vals.size<4)vals.add(ri(1,max));const v=[...vals],big=Math.random()<.5,c=big?Math.max(...v):Math.min(...v);return q('Nombor',`Antara nombor berikut, yang manakah paling ${big?'besar':'kecil'}?`,fmt(c),v.filter(x=>x!==c).map(fmt),`${fmt(c)} ialah nombor paling ${big?'besar':'kecil'}.`,diff,`compare-${v.join('-')}`)}
    if(mode===3){
      const places=[10,100,1000,10000,100000].filter(p=>p*10<=max||p<max/1.5),place=pick(places.length?places:[10]);
      let n,digit,tries=0;do{n=ri(place,Math.max(place*2,max-1));digit=Math.floor(n/place)%10;tries++}while((digit===0||String(n).split('').filter(x=>x===String(digit)).length!==1)&&tries<500);
      if(digit===0||String(n).split('').filter(x=>x===String(digit)).length!==1){n=place*ri(1,9)+Math.max(1,Math.floor(place/10));digit=Math.floor(n/place)%10}
      const ans=digit*place,wr=[1,10,100,1000,10000,100000].filter(p=>p!==place&&p<=max).map(p=>fmt(digit*p));
      return q('Nombor',`Digit ${digit} dalam nombor ${fmt(n)} berada di tempat ${placeNames[place]}. Berapakah nilai digitnya?`,fmt(ans),wr,`Digit ${digit} di tempat ${placeNames[place]} bernilai ${digit} × ${fmt(place)} = ${fmt(ans)}.`,diff,`place-${n}-${place}`,{alignment:'KPM PBD pattern'});
    }
    if(mode===5){const vals=new Set();while(vals.size<4)vals.add(ri(Math.floor(max/10),max));const v=[...vals],asc=Math.random()>.5,target=[...v].sort((a,b)=>asc?a-b:b-a),correct=target.map(fmt).join(' → ');const w=new Set();while(w.size<3){const s=shuffle(v).map(fmt).join(' → ');if(s!==correct)w.add(s)}return q('Nombor',`Pilih susunan nombor mengikut tertib ${asc?'menaik':'menurun'}.`,correct,[...w],`Tertib ${asc?'menaik bermula daripada nombor paling kecil':'menurun bermula daripada nombor paling besar'}.`,diff,`order-${asc?'asc':'desc'}-${v.join('-')}`,{alignment:'KPM PBD pattern'})}
    const nearest=y===2?10:y<=4?pick([10,100]):pick([100,1000,10000]),n=ri(nearest+1,max-1),ans=Math.round(n/nearest)*nearest;
    return q('Nombor',`Bundarkan ${fmt(n)} kepada ${placeNames[nearest]} terdekat.`,fmt(ans),[ans-nearest,ans+nearest,Math.floor(n/nearest)*nearest===ans?ans+nearest*2:Math.floor(n/nearest)*nearest].map(fmt),`Lihat digit di sebelah kanan tempat ${placeNames[nearest]}: 5 ke atas bundarkan ke atas. Jawapan: ${fmt(ans)}.`,diff,`round-${n}-${nearest}`);
  }
  function mathAddSub(level,diff){
    const y=yr(level),max=capFor(y,diff),add=Math.random()>.48;let a,b,ans;
    if(add){a=ri(1,max-1);b=ri(1,max-a);ans=a+b}else{a=ri(2,max);b=ri(1,a-1);ans=a-b}
    const op=add?'+':'−';
    return q('Tambah & Tolak',`${fmt(a)} ${op} ${fmt(b)} = ?`,fmt(ans),[ans+1,Math.max(0,ans-1),ans+10,add?Math.abs(a-b):a+b].map(fmt),`${fmt(a)} ${op} ${fmt(b)} = ${fmt(ans)}.`,diff,`${add?'add':'sub'}-${a}-${b}`);
  }
  function mathMulDiv(level,diff){
    const y=yr(level);
    if(y===1){const g=ri(2,diff==='mudah'?3:5),e=ri(2,5),ans=g*e;return q('Darab & Bahagi',`${Array(g).fill(e).join(' + ')} = ?\n(${g} kumpulan, setiap kumpulan ada ${e})`,ans,[ans+e,Math.max(1,ans-e),g+e],`Tambah berulang: ${g} kali ${e} = ${ans}.`,diff,`mul-${g}-${e}`)}
    let a,b;
    if(y===2){a=pick([2,5,10,3,4]);b=ri(1,10)}
    else if(y===3){a=diff==='mudah'?pick([2,3,4,5,10]):pick([6,7,8,9]);b=ri(2,10)}
    else if(y===4){a=ri(diff==='mudah'?10:100,diff==='sukar'?9999:999);b=ri(2,9)}
    else{b=diff==='mudah'?ri(2,9):ri(11,y===6?99:59);a=ri(diff==='mudah'?100:1000,Math.max(1001,Math.min(y===6?99999:9999,Math.floor(NUM_MAX[y]/b))))}
    if(Math.random()>.5){const ans=a*b;return q('Darab & Bahagi',`${fmt(a)} × ${fmt(b)} = ?`,fmt(ans),[ans+a,Math.max(0,ans-a),ans+10,a+b].map(fmt),`${fmt(a)} × ${fmt(b)} = ${fmt(ans)}.`,diff,`mul-${a}-${b}`)}
    const total=a*b;return q('Darab & Bahagi',`${fmt(total)} ÷ ${fmt(b)} = ?`,fmt(a),[a+1,Math.max(1,a-1),a+10,b].map(fmt),`${fmt(total)} ÷ ${fmt(b)} = ${fmt(a)} kerana ${fmt(a)} × ${fmt(b)} = ${fmt(total)}.`,diff,`div-${total}-${b}`);
  }
  const fracEq=(x,y)=>{const [a,b]=String(x).split('/').map(Number),[c,d]=String(y).split('/').map(Number);return b&&d&&a*d===b*c};
  function fracQ(topic,question,correct,wrong,expl,diff,concept){return q(topic,question,correct,wrong.filter(w=>!fracEq(w,correct)),expl,diff,concept)}
  function mathFraction(level,diff){
    const y=yr(level);
    if(y===1)return pick([q('Pecahan','Sebiji kek dipotong kepada 2 bahagian yang sama. Satu bahagian ialah…','satu perdua',['satu perempat','dua perdua','satu pertiga'],'Satu daripada dua bahagian sama ialah satu perdua.',diff,'half'),q('Pecahan','Sebiji tembikai dipotong kepada 4 bahagian yang sama. Satu bahagian ialah…','satu perempat',['satu perdua','empat perempat','satu pertiga'],'Satu daripada empat bahagian sama ialah satu perempat.',diff,'quarter'),q('Pecahan','“Satu perdua” ditulis sebagai…','1/2',['2/1','1/4','2/2'],'Pengangka 1, penyebut 2.',diff,'write-half')]);
    if(y===2){const d=pick([3,4,5,6,8,10]),n=ri(1,d-1);return fracQ('Pecahan',`Sebuah pizza dipotong kepada ${d} bahagian yang sama. ${n} bahagian telah dimakan. Pecahan yang dimakan ialah…`,`${n}/${d}`,[`${d}/${n}`,`${d-n}/${d}`,`${n}/${d+1}`,`1/${d}`],`${n} daripada ${d} bahagian sama ditulis ${n}/${d}.`,diff,`fracname-${n}-${d}`)}
    if(y===3){
      if(Math.random()<.5){const d=pick([2,3,4,5]),n=ri(1,d-1),k=pick([2,3]);return fracQ('Pecahan',`Pecahan yang setara dengan ${n}/${d} ialah…`,`${n*k}/${d*k}`,[`${n+k}/${d+k}`,`${n*k}/${d}`,`${n}/${d*k}`,`${n+1}/${d*k}`],`Darab pengangka dan penyebut dengan ${k}: ${n*k}/${d*k}.`,diff,`fraceq-${n}-${d}-${k}`)}
      const d=pick([4,5,6,8,10]),a=ri(1,d-2),b=ri(1,d-1-a);return fracQ('Pecahan',`${a}/${d} + ${b}/${d} = ?`,`${a+b}/${d}`,[`${a+b}/${d*2}`,`${Math.abs(a-b)||a+b+1}/${d}`,`${a+b}/${d+1}`],`Penyebut sama, tambah pengangka sahaja: ${a} + ${b} = ${a+b}.`,diff,`fracadd-${a}-${b}-${d}`);
    }
    if(y===4){
      if(Math.random()<.5){const d=pick([3,4,5,6,8]),w=ri(1,4),n=ri(1,d-1),imp=w*d+n;return fracQ('Pecahan',`Tukarkan ${imp}/${d} kepada nombor bercampur.`,`${w} ${n}/${d}`,[`${w+1} ${n}/${d}`,`${n} ${w}/${d}`,`${w} ${d-n}/${d}`,`${w} ${n}/${imp}`,`${w-1>0?w-1:w+2} ${n}/${d}`],`${imp} ÷ ${d} = ${w} baki ${n}, jadi ${w} ${n}/${d}.`,diff,`mixed-${imp}-${d}`)}
      const d=pick([5,6,8,9,10,12]),a=ri(2,d-1),b=ri(1,a-1);return fracQ('Pecahan',`${a}/${d} − ${b}/${d} = ?`,`${a-b}/${d}`,[`${a+b}/${d}`,`${a-b}/${d*2}`,`${a-b}/0`.replace('/0','/'+(d-1))],`Penyebut sama, tolak pengangka: ${a} − ${b} = ${a-b}.`,diff,`fracsub-${a}-${b}-${d}`);
    }
    // Tahun 5–6: penyebut berbeza dan pecahan daripada kuantiti
    if(Math.random()<.5){const [d1,d2]=pick([[2,4],[3,6],[4,8],[5,10],[2,6],[3,9]]),a=ri(1,d1-1),b=ri(1,d2-1),num=a*(d2/d1)+b,g=gcd(num,d2),ans=num<d2?`${num/g}/${d2/g}`:null;if(!ans)return mathFraction(level,diff);return fracQ('Pecahan',`${a}/${d1} + ${b}/${d2} = ?`,ans,[`${a+b}/${d1+d2}`,`${a+b}/${d2}`,`${num}/${d1+d2}`,`${num+1}/${d2}`],`Samakan penyebut: ${a}/${d1} = ${a*(d2/d1)}/${d2}. ${a*(d2/d1)}/${d2} + ${b}/${d2} = ${num}/${d2} = ${ans}.`,diff,`fracadd2-${a}-${d1}-${b}-${d2}`)}
    const d=pick([2,3,4,5,8,10]),n=ri(1,d-1),k=ri(2,y===6?30:12),total=d*k,ans=n*k;return q('Pecahan',`Berapakah ${n}/${d} daripada ${total}?`,ans,[k,total-ans,ans+k],`${total} ÷ ${d} = ${k}; ${k} × ${n} = ${ans}.`,diff,`fracof-${n}-${d}-${total}`);
  }
  const rm=(v,y)=>y>=4&&!Number.isInteger(v)?`RM${v.toFixed(2)}`:`RM${fmt(v)}`;
  function mathMoney(level,diff){
    const y=yr(level),max=diff==='mudah'?[0,20,50,100,1000,10000,100000][y]:[0,100,100,1000,10000,100000,1000000][y],sen=y>=4&&Math.random()<.5;
    const amt=lo=>sen?Math.round(ri(lo*100,max*50)/5)*5/100:ri(lo,Math.max(lo+1,Math.floor(max/2)));
    const a=amt(1);let b=amt(1);while(Math.abs(b-a)<2)b=amt(1);const n=pick(names);
    if(Math.random()<.5){const t=Math.round((a+b)*100)/100;return q('Wang',`${n} mempunyai ${rm(a,y)}. Dia menerima lagi ${rm(b,y)}. Berapakah jumlah wangnya?`,rm(t,y),[rm(Math.abs(a-b)||t+1,y),rm(t+1,y),rm(t+10,y)],`${rm(a,y)} + ${rm(b,y)} = ${rm(t,y)}.`,diff,`moneyadd-${a}-${b}`)}
    const paid=Math.round((a+b)*100)/100;return q('Wang',`Harga sebuah barang ialah ${rm(a,y)}. ${n} membayar ${rm(paid,y)}. Berapakah bakinya?`,rm(b,y),[rm(a,y),rm(paid,y),rm(Math.round((b+1)*100)/100,y),rm(Math.round((b+10)*100)/100,y)],`${rm(paid,y)} − ${rm(a,y)} = ${rm(b,y)}.`,diff,`change-${a}-${paid}`);
  }
  const DAYS=['Isnin','Selasa','Rabu','Khamis','Jumaat','Sabtu','Ahad'],MONTHS=['Januari','Februari','Mac','April','Mei','Jun','Julai','Ogos','September','Oktober','November','Disember'];
  function mathTime(level,diff){
    const y=yr(level);
    if(y===1&&Math.random()<.4){const i=ri(0,6),k=ri(1,2);return q('Masa',`Hari ini hari ${DAYS[i]}. ${k===1?'Esok':'Lusa'} ialah hari…`,DAYS[(i+k)%7],DAYS.filter((_,j)=>j!==(i+k)%7),`Selepas ${DAYS[i]} ialah ${DAYS[(i+1)%7]}${k===2?`, kemudian ${DAYS[(i+2)%7]}`:''}.`,diff,`day-${i}-${k}`)}
    if(y===2&&Math.random()<.3){const i=ri(0,11);return q('Masa',`Bulan selepas ${MONTHS[i]} ialah…`,MONTHS[(i+1)%12],MONTHS.filter((_,j)=>j!==(i+1)%12),`Selepas ${MONTHS[i]} ialah ${MONTHS[(i+1)%12]}.`,diff,`month-${i}`)}
    if(y>=5&&Math.random()<.45){const h=ri(13,23),m=pick([0,15,30,45]),h12=h-12,ans=`${h12}:${String(m).padStart(2,'0')} petang`;return q('Masa',`Jam ${String(h).padStart(2,'0')}${String(m).padStart(2,'0')} dalam sistem 12 jam ialah…`,ans,[`${h12}:${String(m).padStart(2,'0')} pagi`,`${(h12%12)+1}:${String(m).padStart(2,'0')} petang`,`${h}:${String(m).padStart(2,'0')} petang`],`Tolak 12 daripada jam: ${h} − 12 = ${h12}, waktu petang/malam.`,diff,`h24-${h}-${m}`)}
    const minutePool=y===1?[0]:y===2?[0,30]:y===3?[0,15,30,45]:[0,5,10,15,20,25,30,35,40,45,50,55];
    const h=ri(1,12),mins=pick(diff==='mudah'&&y>1?minutePool.filter(x=>x%30===0):minutePool),cur=`${h}:${String(mins).padStart(2,'0')}`,visual={type:'clock',hour:h,minute:mins};
    if(y<=2||Math.random()<.5){
      const wrong=[];const push=(hh,mm)=>{const v=`${((hh-1+24)%12)+1}:${String((mm+60)%60).padStart(2,'0')}`;if(v!==cur&&!wrong.includes(v))wrong.push(v)};
      push(h+1,mins);push(h-1,mins);push(h,(mins+30)%60);push(mins/5||12,h*5%60);push(h+2,mins);
      return q('Masa','Jam di bawah menunjukkan pukul berapa?',cur,wrong,`Jarum pendek menunjukkan jam dan jarum panjang menunjukkan minit. Waktunya ialah ${cur}.`,diff,`clock-read-${h}-${mins}`,{visual,alignment:'KPM PBD pattern'});
    }
    const addMin=y===3?pick([60,120,30]):pick([15,30,45,75,90,135]),total=(h%12)*60+mins+addMin,ah=Math.floor(total/60)%12||12,am=total%60,ans=`${ah}:${String(am).padStart(2,'0')}`,label=addMin%60===0?`${addMin/60} jam`:addMin>60?`${Math.floor(addMin/60)} jam ${addMin%60} minit`:`${addMin} minit`;
    return q('Masa',`Jam di bawah menunjukkan waktu sekarang. ${label} kemudian ialah pukul berapa?`,ans,[`${(ah%12)+1}:${String(am).padStart(2,'0')}`,cur,`${ah}:${String((am+30)%60).padStart(2,'0')}`,`${((ah+10)%12)+1}:${String(am).padStart(2,'0')}`],`Tambah ${label} kepada ${cur}. Jawapan ialah ${ans}.`,diff,`clock-add-${h}-${mins}-${addMin}`,{visual,alignment:'KPM PBD pattern'});
  }
  function mathMeasure(level,diff){
    const y=yr(level);
    if(y===1){const a=ri(5,30);let b=ri(5,30);while(b===a)b=ri(5,30);const n1=pick(['Pensel merah','Reben A','Tali biru']),n2=pick(['pensel hijau','reben B','tali kuning']),longer=a>b?n1:n2.replace(/^./,c=>c.toUpperCase());return q('Ukuran',`${n1} panjangnya ${a} cm. ${n2.replace(/^./,c=>c.toUpperCase())} panjangnya ${b} cm. Yang manakah lebih panjang?`,longer,[a>b?n2.replace(/^./,c=>c.toUpperCase()):n1,'Sama panjang','Tidak dapat ditentukan'],`${Math.max(a,b)} cm lebih panjang daripada ${Math.min(a,b)} cm.`,diff,`cmp-${a}-${b}`)}
    if(y===2){const m=ri(1,diff==='sukar'?9:5);return Math.random()<.5?q('Ukuran',`${m} m = ___ cm`,`${m*100} cm`,[`${m*10} cm`,`${m*1000} cm`,`${m} cm`],`1 m = 100 cm, jadi ${m} m = ${m*100} cm.`,diff,`cm-${m}`):q('Ukuran',`${m*100} cm = ___ m`,`${m} m`,[`${m*10} m`,`${m*100} m`,`${m+1} m`],`100 cm = 1 m.`,diff,`cm-r-${m}`)}
    if(y===3){if(Math.random()<.5){const kg=ri(1,9);return q('Ukuran',`${kg} kg = ___ g`,`${kg*1000} g`,[`${kg*100} g`,`${kg*10} g`,`${kg*10000} g`],`1 kg = 1000 g.`,diff,`kg-${kg}`)}const l=ri(1,9);return q('Ukuran',`${l} ℓ = ___ mℓ`,`${l*1000} mℓ`,[`${l*100} mℓ`,`${l*10} mℓ`,`${l*10000} mℓ`],`1 ℓ = 1000 mℓ.`,diff,`l-${l}`)}
    const kind=pick(['km','kg','l']),whole=ri(1,y===4?9:20),dec=pick([0.25,0.5,0.75,0.1,0.2]),v=whole+dec,ans=Math.round(v*1000),unitA={km:'km',kg:'kg',l:'ℓ'}[kind],unitB={km:'m',kg:'g',l:'mℓ'}[kind];
    if(Math.random()<.5)return q('Ukuran',`${fmt(v)} ${unitA} = ___ ${unitB}`,`${fmt(ans)} ${unitB}`,[`${fmt(Math.round(v*100))} ${unitB}`,`${fmt(Math.round(v*10000))} ${unitB}`,`${fmt(whole*1000+Math.round(dec*100))} ${unitB}`],`1 ${unitA} = 1000 ${unitB}, jadi ${fmt(v)} × 1000 = ${fmt(ans)} ${unitB}.`,diff,`conv-${kind}-${v}`);
    return q('Ukuran',`${fmt(ans)} ${unitB} = ___ ${unitA}`,`${fmt(v)} ${unitA}`,[`${fmt(ans/100)} ${unitA}`,`${fmt(ans/10)} ${unitA}`,`${fmt(ans/10000)} ${unitA}`,`${fmt(whole)} ${unitA}`],`Bahagi dengan 1000: ${fmt(ans)} ÷ 1000 = ${fmt(v)} ${unitA}.`,diff,`convr-${kind}-${v}`);
  }
  function mathShape(level,diff){
    const y=yr(level);
    if(y<=2){const f=pick([['Bentuk 2D yang mempunyai 3 sisi ialah…','segi tiga',['segi empat sama','bulatan','pentagon']],['Bentuk yang tiada sisi lurus ialah…','bulatan',['segi tiga','segi empat tepat','heksagon']],['Bentuk 3D seperti bola ialah…','sfera',['kubus','silinder','kon']],['Bentuk 3D seperti tin minuman ialah…','silinder',['sfera','kubus','piramid']],['Bentuk 3D seperti dadu ialah…','kubus',['kuboid','sfera','kon']]]);return q('Bentuk & Ruang',f[0],f[1],f[2],`Jawapannya ${f[1]}.`,diff,`shape-${f[1]}`)}
    if(y===3){const f=pick([['Bilangan bucu sebuah kubus ialah…','8',['6','12','4']],['Bilangan sisi sebuah pentagon ialah…','5',['6','4','8']],['Bilangan permukaan sebuah kuboid ialah…','6',['4','8','12']],['Bilangan tepi sebuah kubus ialah…','12',['8','6','10']],['Bentuk 3D yang mempunyai satu bucu dan satu permukaan rata ialah…','kon',['silinder','sfera','piramid']]]);return q('Bentuk & Ruang',f[0],f[1],f[2],`Jawapannya ${f[1]}.`,diff,`shape3-${f[0].slice(0,20)}`)}
    if(y===4){const l=ri(3,20),w=ri(2,15),p=2*(l+w);return q('Bentuk & Ruang',`Sebuah segi empat tepat berukuran ${l} cm panjang dan ${w} cm lebar. Berapakah perimeternya?`,`${p} cm`,[`${l*w} cm`,`${l+w} cm`,`${p+2} cm`,`${2*l+w} cm`,`${p-2} cm`],`Perimeter = ${l} + ${w} + ${l} + ${w} = ${p} cm.`,diff,`perim-${l}-${w}`)}
    if(y===5||Math.random()<.4){const l=ri(3,20),w=ri(2,15),a=l*w;return q('Bentuk & Ruang',`Sebuah segi empat tepat berukuran ${l} cm panjang dan ${w} cm lebar. Berapakah luasnya?`,`${a} cm²`,[`${2*(l+w)} cm²`,`${l+w} cm²`,`${a+l} cm²`,`${a+w+1} cm²`,`${a-1} cm²`],`Luas = panjang × lebar = ${l} × ${w} = ${a} cm².`,diff,`area-${l}-${w}`)}
    const l=ri(2,12),w=ri(2,10),h=ri(2,10),v=l*w*h;return q('Bentuk & Ruang',`Sebuah kuboid berukuran ${l} cm × ${w} cm × ${h} cm. Berapakah isi padunya?`,`${v} cm³`,[`${l+w+h} cm³`,`${l*w} cm³`,`${2*(l*w+w*h+l*h)} cm³`,`${v+l} cm³`],`Isi padu = ${l} × ${w} × ${h} = ${v} cm³.`,diff,`vol-${l}-${w}-${h}`);
  }
  function mathData(level,diff){
    const y=yr(level),fruits=['epal','oren','pisang','betik','mangga'],n=y<=4?4:5,vals=Array.from({length:n},()=>ri(y<=2?1:2,y<=2?9:y<=4?30:60)),labels=shuffle(fruits).slice(0,n),table=labels.map((l,i)=>`${l}: ${vals[i]}`).join(', ');
    if(y>=5&&diff!=='mudah'){const s0=vals.reduce((a,b)=>a+b,0),rem=s0%n;if(rem)vals[n-1]+=n-rem;const s=vals.reduce((a,b)=>a+b,0),mean=s/n;return q('Data',`Bilangan buku yang dibaca oleh ${n} orang murid: ${vals.join(', ')}. Berapakah purata bilangan buku?`,mean,[mean+1,Math.max(0,mean-1),Math.max(...vals)],`Jumlah ${s} ÷ ${n} = ${mean}.`,diff,`mean-${vals.join('-')}`)}
    if(y>=3&&Math.random()<.5){const s=vals.reduce((a,b)=>a+b,0);return q('Data',`Jualan buah di sebuah gerai — ${table}. Berapakah jumlah semua buah yang dijual?`,s,[s+1,s-1,s+10],`Tambah semua nilai: ${vals.join(' + ')} = ${s}.`,diff,`sum-${vals.join('-')}`)}
    const mx=Math.max(...vals);if(vals.filter(v=>v===mx).length>1)return mathData(level,diff);const ans=labels[vals.indexOf(mx)];
    return q('Data',`Buah kegemaran murid — ${table}. Buah manakah paling digemari?`,ans,labels.filter(l=>l!==ans),`${ans} mempunyai nilai paling tinggi, iaitu ${mx}.`,diff,`max-${vals.join('-')}`);
  }
  function normalizeAnswer(v){return String(v??'').toLowerCase().trim().replace(/\s+/g,' ').replace(/,/g,'').replace(/^rm\s*/,'rm')}
  // Tolerant marking for typed answers (UASA short items). Pupils should not lose marks
  // for "5" vs "RM5", "3.00" vs "3:00", "2/4" vs "1/2" or a one-letter typo in a long word.
  const lev=(a,b)=>{if(a===b)return 0;const m=a.length,n=b.length;if(!m||!n)return m||n;let prev=Array.from({length:n+1},(_,i)=>i);for(let i=1;i<=m;i++){const cur=[i];for(let j=1;j<=n;j++)cur[j]=Math.min(prev[j]+1,cur[j-1]+1,prev[j-1]+(a[i-1]===b[j-1]?0:1));prev=cur}return prev[n]};
  const cleanText=v=>String(v??'').toLowerCase().normalize('NFKC').replace(/[“”"'‘’]/g,'').replace(/-/g,' ').replace(/[.!?;:]+$/,'').replace(/\s+/g,' ').trim();
  const UNITS='cm²|m²|km|cm|mm|kg|ml|m|g|l|sen|minit|jam|saat|hari|°c';
  const parseQty=v=>{const t=cleanText(v).replace(/ringgit/g,'rm').replace(/\s+/g,' ').replace(/^([\d.,]+)\s*rm$/,'rm$1');const m=t.match(new RegExp(`^(rm)?\\s*(-?\\d{1,3}(?:,\\d{3})+|-?\\d+)(?:[.,](\\d+))?\\s*(${UNITS})?$`,'i'));if(!m)return null;const whole=m[2].replace(/,/g,'');return {rm:!!m[1],value:Number(whole+(m[3]?'.'+m[3]:'')),unit:(m[4]||'').toLowerCase()}};
  const parseTime=v=>{const t=cleanText(v).replace(/^pukul\s*/,'').replace(/\s*(pagi|petang|malam|tengah hari|am|pm|a\.m|p\.m)$/,'');const m=t.match(/^(\d{1,2})(?:\s*[:.]\s*(\d{2}))?$/);if(!m)return null;const h=+m[1],mi=m[2]?+m[2]:0;if(h<0||h>24||mi>59)return null;return {h:(h%12)||12,m:mi}};
  const parseFrac=v=>{const t=cleanText(v).replace(/\s+/g,'');let m=t.match(/^(\d+)\/(\d+)$/);if(m&&+m[2])return [+m[1],+m[2]];m=t.match(/^(\d+)$/);return m?[+m[1],1]:null};
  function checkShort(input,item){
    const raw=String(input??'').trim(),correct=String(item?.correct??'').trim();if(!raw||!correct)return false;
    const a=cleanText(raw),b=cleanText(correct);if(a===b||normalizeAnswer(raw)===normalizeAnswer(correct))return true;
    if(/^\d{1,2}:\d{2}$/.test(correct)){const x=parseTime(raw),y=parseTime(correct);return !!x&&!!y&&x.h===y.h&&x.m===y.m}
    if(/^\d+\/\d+$/.test(correct)){const x=parseFrac(raw),y=parseFrac(correct);return !!x&&!!y&&x[0]*y[1]===y[0]*x[1]}
    const qy=parseQty(correct);
    if(qy){const qx=parseQty(raw);if(!qx)return false;if(qx.unit&&qy.unit&&qx.unit!==qy.unit)return false;if(qx.unit&&!qy.unit&&!qy.rm)return false;if(qx.rm&&qy.unit)return false;return Math.abs(qx.value-qy.value)<1e-9}
    // Text answers: every content word of the key must appear (allowing a small typo).
    const stop=new Set(['ialah','adalah','yang','the','a','an','is','are']);
    const words=s=>s.split(' ').filter(w=>w&&!stop.has(w));
    const kw=words(b),iw=words(a);if(!kw.length||!iw.length)return false;
    const close=(x,y)=>x===y||(y.length>=5&&lev(x,y)<=1)||(y.length>=9&&lev(x,y)<=2);
    if(kw.every(k=>iw.some(w=>close(w,k)))&&iw.length<=kw.length+3)return true;
    return b.length>=6&&lev(a,b)<=Math.min(2,Math.floor(b.length/6));
  }
  function toShort(item){if(!/^(next-|before-|place-|add-|sub-|mul-|div-|fracadd-|fracsub-|fracof-|moneyadd-|change-|clock-|cm-|kg-|l-|conv-|area-|perim-|vol-|mean-|sum-)/.test(item.concept||''))return item;return qs(item.topic,item.question,item.correct,item.explanation,item.difficulty,item.concept+'-short',{source:item.source||'LatihKu Original',alignment:'KPM UASA pattern',visual:item.visual||undefined});}
  function validateItem(item){
    if(!item||typeof item.question!=='string'||!item.question.trim()||item.correct===undefined||!String(item.correct).trim()||!item.topic||!['mudah','sederhana','sukar','uasa'].includes(item.difficulty)||!String(item.explanation||'').trim())return false;
    if(item.itemType==='short')return true;
    if(!Array.isArray(item.answers)||item.answers.length!==4)return false;
    const a=item.answers.map(x=>String(x).trim()),c=String(item.correct).trim();
    return a.every(Boolean)&&new Set(a).size===4&&a.filter(x=>x===c).length===1;
  }
  function safeGenerate(gen,level,diff){for(let i=0;i<50;i++){const item=gen(level,diff);if(validateItem(item))return item}throw new Error('Generator gagal menghasilkan item yang sah.')}
  const MATH_GEN={'Nombor':mathNumber,'Tambah & Tolak':mathAddSub,'Darab & Bahagi':mathMulDiv,'Pecahan':mathFraction,'Wang':mathMoney,'Masa':mathTime,'Ukuran':mathMeasure,'Bentuk & Ruang':mathShape,'Data':mathData};
  function mathSet(level,topic,count,difficulty,ctx={}){
    // Tahun 2: mix the new Tahap 1 / DLP-inspired questions with existing LatihKu Maths.
    // Dedicated Tahun 2 topics receive only the new question patterns.
    const year2=String(level)==='2'&&window.LATIH_YEAR2_MATH?.supports(topic);
    const dedicated=year2&&window.LATIH_YEAR2_MATH.special.includes(topic);
    const enhancedCount=year2?(dedicated?count:Math.max(1,Math.round(count*(topic==='Campur Semua'?0.45:0.80)))):0;
    const enhanced=enhancedCount?window.LATIH_YEAR2_MATH.makeSet(topic,enhancedCount,difficulty,ctx):[];
    const regularCount=count-enhanced.length;
    if(regularCount<=0)return enhanced;
    const topics=topic==='Campur Semua'?C.subjects.math.topics:[topic];
    const out=[],seen=new Set(),recent=new Set(ctx.recentGenerated||[]),uasa=difficulty==='uasa'&&+level>=4;
    const plan=uasa?[...Array(Math.round(regularCount*.5)).fill('mudah'),...Array(Math.round(regularCount*.3)).fill('sederhana'),...Array(Math.max(0,regularCount-Math.round(regularCount*.5)-Math.round(regularCount*.3))).fill('sukar')]:Array(regularCount).fill(null);
    let tries=0;
    while(out.length<regularCount&&tries<regularCount*60){tries++;const tpc=pick(topics),d=uasa?(plan[out.length]||'sederhana'):difficultyFor(level,difficulty),item=safeGenerate(MATH_GEN[tpc],level,d);if(!seen.has(item.concept)&&!recent.has(item.smartSignature)){out.push(uasa?toShort(item):item);seen.add(item.concept)}}
    // A narrow topic (e.g. Pecahan Tahun 1) has few distinct items: top up with other topics before ever repeating.
    tries=0;while(out.length<regularCount&&tries<regularCount*60){tries++;const tpc=pick(C.subjects.math.topics),d=uasa?(plan[out.length]||'sederhana'):difficultyFor(level,difficulty),item=safeGenerate(MATH_GEN[tpc],level,d);if(!seen.has(item.concept)){out.push(uasa?toShort(item):item);seen.add(item.concept)}}
    while(out.length<regularCount){const tpc=pick(topics),d=uasa?(plan[out.length]||'sederhana'):difficultyFor(level,difficulty),item=safeGenerate(MATH_GEN[tpc],level,d);out.push(uasa?toShort(item):item)}
    return uasa?shuffle(out):shuffle([...enhanced,...out]);
  }

  async function makeSet(level,subject,topic,count,difficulty='auto',ctx={}){
    if(subject==='math')return mathSet(level,topic,count,difficulty,ctx);
    if(!packInfo(level,subject)){
      if(window.LATIH_PDF_ENGINE?.supports(level,subject))return window.LATIH_PDF_ENGINE.makeSet(level,subject,topic,count,difficulty,ctx);
      const smart=window.LATIH_SMART?.makeSet(level,subject,topic,count,difficulty,ctx)||[];
      if(smart.length)return smart;
      throw new Error('Generator untuk subjek ini belum tersedia.');
    }
    return staticSet(level,subject,topic,count,difficulty,ctx);
  }
  async function downloadAll(onProgress=()=>{}){
    if(!('caches'in window))throw new Error('Cache Storage tidak tersedia pada browser ini');
    const packs=Object.values(C.packs),cache=await caches.open(`latihku-data-v${C.version}`),total=packs.length;let done=0,bytes=0;
    for(const p of packs){
      try{
        const cached=await cache.match(p.url);let valid=false;
        if(cached?.ok){try{valid=Array.isArray((await cached.clone().json()).questions)}catch{}}
        if(!valid){const res=await fetch(p.url,{cache:'no-store'});if(!res.ok)throw new Error('HTTP '+res.status);
          const body=await res.clone().json();if(!Array.isArray(body.questions)||body.questions.length!==p.count)throw new Error('Bilangan soalan tidak sepadan');
          await cache.put(p.url,res.clone());if(!await cache.match(p.url))throw new Error('Gagal simpan cache');
        }
        done++;bytes+=p.bytes||0;onProgress(done,total,p);
      }catch(err){throw new Error(`${p.url}: ${err.message}`)}
    }
    return {done,total,bytes};
  }
  function clearMemory(){memory.clear()}
  function totalStatic(){return Object.values(C.packs).reduce((a,p)=>a+p.count,0)}
  function totalBytes(){return Object.values(C.packs).reduce((a,p)=>a+(p.bytes||0),0)}
  return {tutorItems,availableSubjects,subjectMeta,packInfo,makeSet,downloadAll,clearMemory,totalStatic,totalBytes,normalizeAnswer,checkShort,validateItem};
})();

