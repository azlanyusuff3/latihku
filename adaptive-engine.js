window.LATIH_ADAPTIVE=(()=>{
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const rnd=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const y=l=>Math.max(0,parseInt(l.level,10)||0);
  const uniqNums=(ans,spread=4)=>{const s=new Set([ans]);let guard=0;while(s.size<4&&guard++<40){const v=Math.max(0,ans+rnd(-spread,spread));s.add(v)};while(s.size<4)s.add(ans+s.size+1);return shuffle([...s]).map(String)};
  const opts=(correct,others)=>{const c=String(correct),seen=new Set([c]),arr=[];for(const x of others){const v=String(x);if(!seen.has(v)){seen.add(v);arr.push({label:v,ok:false})}if(arr.length>=3)break}let fill=1;while(arr.length<3){const v=c+' '+fill++;if(!seen.has(v)){seen.add(v);arr.push({label:v,ok:false})}}return shuffle([{label:c,ok:true},...arr])};
  const dots=(n,emoji='●')=>Array.from({length:Math.min(n,20)},()=>`<i>${emoji}</i>`).join('');
  const tenBlocks=n=>{const tens=Math.floor(n/10),ones=n%10;return `<div class="base10"><div class="tens">${Array.from({length:Math.min(tens,9)},()=>'<i class="ten"></i>').join('')}</div><div class="ones">${Array.from({length:ones},()=>'<i class="one"></i>').join('')}</div></div>`};
  function clockSVG(h,m){const aM=m*6-90,aH=(h%12)*30+m*.5-90;const pt=(deg,r)=>{const z=deg*Math.PI/180;return [50+Math.cos(z)*r,50+Math.sin(z)*r]};const [mx,my]=pt(aM,34),[hx,hy]=pt(aH,23);let nums='';for(let i=1;i<=12;i++){const [x,y]=pt(i*30-90,41);nums+=`<text x="${x}" y="${y+2}" text-anchor="middle">${i}</text>`}return `<svg class="mini-clock" viewBox="0 0 100 100" aria-label="Jam ${h}:${String(m).padStart(2,'0')}"><circle cx="50" cy="50" r="47"/>${nums}<line class="hour" x1="50" y1="50" x2="${hx}" y2="${hy}"/><line class="minute" x1="50" y1="50" x2="${mx}" y2="${my}"/><circle class="pin" cx="50" cy="50" r="3"/></svg>`}
  function fractionVisual(num,den){return `<div class="fraction-strip">${Array.from({length:den},(_,i)=>`<i class="${i<num?'fill':''}"></i>`).join('')}</div>`}
  function bars(values){const max=Math.max(...values.map(v=>v.n),1);return `<div class="mini-bars">${values.map(v=>`<div><i style="height:${Math.round(v.n/max*82)+12}%"></i><b>${esc(v.label)}</b><small>${v.n}</small></div>`).join('')}</div>`}
  function shapeSvg(name){const map={"Segi tiga":'<polygon points="50,10 90,85 10,85"/>',"Segi empat sama":'<rect x="15" y="15" width="70" height="70" rx="4"/>',"Bulatan":'<circle cx="50" cy="50" r="38"/>',"Segi empat tepat":'<rect x="8" y="24" width="84" height="52" rx="4"/>'};return `<svg class="shape-svg" viewBox="0 0 100 100">${map[name]||map.Bulatan}</svg>`}
  const visualCard=(icon,label='')=>`<div class="picture-card"><span>${icon}</span>${label?`<b>${esc(label)}</b>`:''}</div>`;

  function mathChallenge(l,attempt=0){
    const t=l.topic,yr=y(l);
    if(t==='Tambah & Tolak'){
      const max=yr<=1?9:yr===2?40:99,a=rnd(yr<=1?2:12,max),b=rnd(2,Math.min(yr<=1?6:25,max));const add=Math.random()>.25,aa=add?a:Math.max(a,b),bb=add?b:Math.min(a,b),ans=add?aa+bb:aa-bb;
      const concrete=yr<=2?`<div class="combine-demo"><div class="group g1">${dots(Math.min(aa,12),'●')}<b>${aa}</b></div><span>${add?'+':'−'}</span><div class="group g2">${dots(Math.min(bb,12),'●')}<b>${bb}</b></div></div>`:`<div class="place-add"><div><b>${aa}</b>${tenBlocks(aa)}</div><span>${add?'+':'−'}</span><div><b>${bb}</b>${tenBlocks(bb)}</div></div>`;
      return {kind:'add',prompt:add?'Gabungkan. Berapa semua?':'Ambil keluar. Berapa tinggal?',speak:add?`Gabungkan ${aa} dan ${bb}. Berapa semua?`:`${aa} tolak ${bb}. Berapa tinggal?`,visual:concrete,options:uniqNums(ans,yr<=1?3:10).map(x=>({label:x,ok:+x===ans})),answer:String(ans),meta:{a:aa,b:bb,op:add?'+':'−',ans,yr}};
    }
    if(t==='Nombor & Operasi'||t==='Nombor'){
      const num=yr<=1?rnd(20,99):yr===2?rnd(100,999):rnd(1000,9999),s=String(num),idx=rnd(0,s.length-1),digit=+s[idx],place=Math.pow(10,s.length-1-idx),ans=digit*place;let marked='';[...s].forEach((d,i)=>marked+=`<span class="digit ${i===idx?'hot':''}">${d}</span>`);
      return {kind:'place',prompt:'Digit berwarna nilainya berapa?',speak:'Lihat digit berwarna. Apakah nilainya?',visual:`<div class="big-number">${marked}</div><div class="place-labels"><span>← nilai tempat</span></div>`,options:uniqNums(ans,Math.max(10,place)).map(x=>({label:x,ok:+x===ans})),answer:String(ans),meta:{num,digit,place,ans}};
    }
    if(t==='Darab & Bahagi'){
      const groups=rnd(2,yr<=2?5:8),each=rnd(2,yr<=2?5:9),ans=groups*each;return {kind:'multiply',prompt:'Kira semua titik dalam kumpulan.',speak:`Ada ${groups} kumpulan. Setiap kumpulan ada ${each}. Berapa semua?`,visual:`<div class="equal-groups">${Array.from({length:groups},()=>`<div>${dots(each,'●')}</div>`).join('')}</div>`,options:uniqNums(ans,6).map(x=>({label:x,ok:+x===ans})),answer:String(ans),meta:{groups,each,ans}};
    }
    if(t==='Pecahan'){
      const den=pick(yr<=2?[2,4]:[4,5,8]),num=rnd(1,den-1),ans=`${num}/${den}`;const other=[`1/${den}`,`${Math.max(1,num-1)}/${den}`,`${Math.min(den-1,num+1)}/${den}`,`${den}/${num}`];return {kind:'fraction',prompt:'Berapa bahagian berwarna?',speak:'Lihat bahagian berwarna. Apakah pecahannya?',visual:fractionVisual(num,den),options:opts(ans,other),answer:ans,meta:{num,den}};
    }
    if(t==='Wang'){
      const a=rnd(2,12),b=rnd(1,8),ans=a+b;return {kind:'money',prompt:'Jumlah harga?',speak:`Buku ${a} ringgit dan pensel ${b} ringgit. Berapa jumlah?`,visual:`<div class="money-scene">${visualCard('📘',`RM${a}`)}<span>+</span>${visualCard('✏️',`RM${b}`)}</div>`,options:uniqNums(ans,5).map(x=>({label:`RM${x}`,ok:+x===ans})),answer:`RM${ans}`,meta:{a,b,ans}};
    }
    if(t==='Masa & Waktu'||t==='Masa'){
      const h=rnd(1,12),m=pick(yr<=2?[0,30]:[0,15,30,45]),ans=`${h}:${String(m).padStart(2,'0')}`;const times=[ans,`${(h%12)+1}:${String(m).padStart(2,'0')}`,`${h}:${String((m+15)%60).padStart(2,'0')}`,`${h}:00`];return {kind:'time',prompt:'Jam tunjuk pukul berapa?',speak:'Lihat jarum jam. Pukul berapa?',visual:clockSVG(h,m),options:opts(ans,times),answer:ans,meta:{h,m}};
    }
    if(t==='Ukuran'){
      const n=rnd(3,15),ans=`${n} cm`;return {kind:'measure',prompt:'Baca panjang.',speak:`Berapa sentimeter panjang garisan ini?`,visual:`<div class="ruler"><div class="ruler-line" style="width:${Math.min(92,18+n*4)}%"></div>${Array.from({length:n+1},(_,i)=>`<i style="left:${i/n*100}%"><small>${i}</small></i>`).join('')}</div>`,options:uniqNums(n,3).map(x=>({label:`${x} cm`,ok:+x===n})),answer:ans,meta:{n}};
    }
    if(t==='Bentuk & Ruang'){
      const name=pick(['Segi tiga','Segi empat sama','Bulatan','Segi empat tepat']);return {kind:'shape',prompt:'Apakah nama bentuk ini?',speak:'Apakah nama bentuk ini?',visual:shapeSvg(name),options:opts(name,['Segi tiga','Segi empat sama','Bulatan','Segi empat tepat']),answer:name,meta:{name}};
    }
    if(t==='Data'){
      const vals=[{label:'A',n:rnd(2,8)},{label:'B',n:rnd(2,8)},{label:'C',n:rnd(2,8)}];let high=vals[0];for(const v of vals)if(v.n>high.n)high=v;if(vals.filter(v=>v.n===high.n).length>1){vals[2].n=9;high=vals[2]}return {kind:'data',prompt:'Bar mana paling tinggi?',speak:'Lihat carta. Bar mana paling tinggi?',visual:bars(vals),options:opts(high.label,vals.map(v=>v.label)),answer:high.label,meta:{vals}};
    }
    return mathChallenge({...l,topic:'Tambah & Tolak'},attempt);
  }

  const bmVisuals={
    'Simpulan Bahasa':()=>{const all=[{icon:'🦶',cue:'tanpa kasut',ans:'kaki ayam'},{icon:'💪',cue:'rajin membantu',ans:'ringan tulang'},{icon:'🎁',cue:'hadiah dibawa pulang',ans:'buah tangan'}],q=pick(all);return {kind:'idiom',prompt:'Gambar ini maksud simpulan bahasa mana?',speak:`${q.cue}. Pilih simpulan bahasa.`,visual:visualCard(q.icon,q.cue),options:opts(q.ans,all.map(x=>x.ans)),answer:q.ans,meta:{q,all}}},
    'Penjodoh Bilangan':()=>{const all=[{icon:'🐱',cue:'haiwan',ans:'seekor',bad:['seorang','sebatang','sehelai']},{icon:'✏️',cue:'benda panjang',ans:'sebatang',bad:['seekor','seorang','sehelai']},{icon:'👩‍🏫',cue:'manusia',ans:'seorang',bad:['seekor','sebatang','sehelai']}],q=pick(all);return {kind:'classifier',prompt:'Pilih penjodoh bilangan.',speak:'Lihat gambar dan pilih penjodoh bilangan.',visual:visualCard(q.icon,q.cue),options:opts(q.ans,q.bad),answer:q.ans,meta:{q}}},
    'Tatabahasa':()=>{const all=[{scene:'👧  📖',cue:'buat apa?',ans:'membaca'},{scene:'👦  ⚽',cue:'buat apa?',ans:'bermain'},{scene:'👩‍🍳  🍲',cue:'buat apa?',ans:'memasak'}],q=pick(all);return {kind:'verb',prompt:q.cue,speak:'Lihat gambar. Apakah perbuatannya?',visual:visualCard(q.scene),options:opts(q.ans,['membaca','bermain','memasak','tidur']),answer:q.ans,meta:{q}}},
    'Ejaan':()=>{const all=[{icon:'⚽',ans:'bola',bad:['bolla','bula','bolaah']},{icon:'📚',ans:'buku',bad:['buko','booku','bukuuh']},{icon:'🏫',ans:'sekolah',bad:['sekola','skolah','sekoloh']}],q=pick(all);return {kind:'spell',prompt:'Pilih ejaan betul.',speak:'Pilih ejaan yang betul untuk gambar.',visual:visualCard(q.icon),options:opts(q.ans,q.bad),answer:q.ans,meta:{q}}},
    'Kosa Kata':()=>{const all=[{icon:'🏎️💨',ans:'laju',bad:['perlahan','masam','senyap']},{icon:'🍋',ans:'masam',bad:['manis','tinggi','laju']},{icon:'🏰',ans:'besar',bad:['kecil','masin','gelap']}],q=pick(all);return {kind:'vocab',prompt:'Pilih perkataan yang sesuai.',speak:'Lihat gambar dan pilih perkataan.',visual:visualCard(q.icon),options:opts(q.ans,q.bad),answer:q.ans,meta:{q}}},
    'Pemahaman':()=>{const all=[{scene:'🌧️ ➜ ☂️',ans:'hujan',bad:['panas','tidur','lapar']},{scene:'☀️🥵 ➜ 💧',ans:'dahaga',bad:['sejuk','mengantuk','gelap']}],q=pick(all);return {kind:'sequence',prompt:'Kenapa tindakan itu dibuat?',speak:'Lihat gambar. Apakah sebabnya?',visual:visualCard(q.scene),options:opts(q.ans,q.bad),answer:q.ans,meta:{q}}}
  };
  function bmChallenge(l){return (bmVisuals[l.topic]||bmVisuals['Kosa Kata'])()}
  function enChallenge(l){
    const map={Vocabulary:{icon:'🏎️💨',prompt:'Choose the matching word.',ans:'fast',bad:['slow','cold','small']},Grammar:{icon:'👧 📖',prompt:'Choose the action word.',ans:'reads',bad:['girl','book','blue']},Tenses:{icon:'📅⬅️ 🚶',prompt:'Yesterday…',ans:'walked',bad:['walk','walks','walking']},Prepositions:{icon:'🐱\n⬇️\n🪑',prompt:'The cat is ___ the chair.',ans:'under',bad:['on','in','beside']},Sentence:{icon:'👦 ⚽',prompt:'Choose the complete idea.',ans:'Aiman plays football.',bad:['plays football','Aiman football','at the field']},Comprehension:{icon:'🌧️ ➜ ☂️',prompt:'Why the umbrella?',ans:'rain',bad:['sun','sleep','food']}};const q=map[l.topic]||map.Vocabulary;return {kind:'en',prompt:q.prompt,speak:q.prompt,visual:visualCard(q.icon),options:opts(q.ans,q.bad),answer:q.ans,meta:{q}};
  }
  function sciChallenge(l){
    const map={
      'Kemahiran Sains':['🔍📋','Apa buat dahulu?','perhati & rekod',['teka','abaikan data','salin jawapan']],
      'Manusia':['🫀 ➜ 🩸','Organ mengepam darah?','jantung',['paru-paru','kulit','perut']],
      'Haiwan':['🐟 🌊','Habitat?','air',['gurun','langit','tanah kering']],
      'Tumbuhan':['🌱💧⬆️','Bahagian serap air?','akar',['bunga','buah','daun']],
      'Bahan':['☔ 💧','Sifat bahan payung?','tidak serap air',['mudah koyak','serap air','larut']],
      'Tenaga':['🔌 ➜ 💡','Hasil utama?','cahaya',['tanah','air','jisim']],
      'Bumi & Angkasa':['🌍↻ ☀️/🌙','Apa berlaku?','siang & malam',['hujan sahaja','musim sahaja','bulan hilang']],
      'Teknologi':['🌉 🧱 ➜ 🧪','Selepas bina?','uji',['buang','jangan sentuh','anggap sempurna']]
    };const q=map[l.topic]||map['Kemahiran Sains'];return {kind:'science',prompt:q[1],speak:q[1],visual:visualCard(q[0]),options:opts(q[2],q[3]),answer:q[2],meta:{q}};
  }
  function historyChallenge(l){const q={scene:'1️⃣ ➜ 2️⃣ ➜ 3️⃣',prompt:'Susunan masa dipanggil?',ans:'kronologi',bad:['rawak','tekaan','campuran']};return {kind:'history',prompt:q.prompt,speak:q.prompt,visual:visualCard(q.scene),options:opts(q.ans,q.bad),answer:q.ans,meta:{q}}}
  function islamChallenge(l){if(l.topic==='Jawi'){const all=[{icon:'⚽',r:'bola',j:'بولا'},{icon:'📚',r:'buku',j:'بوکو'}],q=pick(all);return {kind:'jawi',prompt:`${q.r} → ?`,speak:`Pilih tulisan Jawi untuk ${q.r}`,visual:visualCard(q.icon,q.r),options:opts(q.j,all.map(x=>x.j).concat(['باجو','کاکي'])),answer:q.j,meta:{q}}}const q={scene:'🤲 ❤️ ✅',prompt:'Pilih amalan yang baik.',ans:'buat dengan tertib & betul',bad:['teka sahaja','abaikan adab','ikut sesuka hati']};return {kind:'islam',prompt:q.prompt,speak:q.prompt,visual:visualCard(q.scene),options:opts(q.ans,q.bad),answer:q.ans,meta:{q}}}
  function moralChallenge(l){const q={scene:'💵❓ ➜ 👩‍🏫',prompt:'Jumpa barang orang. Apa buat?',ans:'serah kepada guru',bad:['simpan','sembunyi','buang']};return {kind:'moral',prompt:q.prompt,speak:q.prompt,visual:visualCard(q.scene),options:opts(q.ans,q.bad),answer:q.ans,meta:{q}}}
  function pjpkChallenge(l){const q=l.topic==='Pemakanan'?{scene:'🍚🥦🍗💧',prompt:'Pilihan lebih seimbang?',ans:'pelbagai makanan + air',bad:['gula-gula sahaja','air gas sahaja','tak makan']}:l.topic==='Keselamatan'?{scene:'⚠️🛝👟',prompt:'Apa buat dahulu?',ans:'ikut arahan selamat',bad:['lari tanpa lihat','tolak kawan','abaikan bahaya']}:{scene:'🏃💧😴',prompt:'Apa bantu badan sihat?',ans:'aktif + air + rehat',bad:['tidur lewat selalu','tak minum','duduk sahaja']};return {kind:'pjpk',prompt:q.prompt,speak:q.prompt,visual:visualCard(q.scene),options:opts(q.ans,q.bad),answer:q.ans,meta:{q}}}
  function praChallenge(l){
    if(l.topic==='Kenali Nombor'||l.topic==='Kira-kira'){const n=rnd(1,6);return {kind:'pra-count',prompt:'Ada berapa?',speak:'Kira satu satu. Ada berapa?',visual:`<div class="pra-objects">${dots(n,'⭐')}</div>`,options:uniqNums(n,2).map(x=>({label:x,ok:+x===n})),answer:String(n),meta:{n}}}
    if(l.topic==='Kenali Huruf'){const q=pick([{letter:'B',icon:'⚽',ans:'B'},{letter:'K',icon:'🐱',ans:'K'},{letter:'A',icon:'🍎',ans:'A'}]);return {kind:'pra-letter',prompt:'Bunyi awal gambar?',speak:'Pilih huruf awal.',visual:visualCard(q.icon),options:opts(q.ans,['A','B','K','M']),answer:q.ans,meta:{q}}}
    if(l.topic==='Jam & Masa'){return mathChallenge({...l,level:'1',subject:'math',topic:'Masa & Waktu'})}
    return {kind:'pra',prompt:'Pilih yang sama.',speak:'Pilih gambar yang sama.',visual:visualCard('🐱'),options:[{label:'🐱',ok:true},{label:'🐶',ok:false},{label:'🐰',ok:false},{label:'🐼',ok:false}],answer:'🐱',meta:{}};
  }
  function makeChallenge(l,attempt=0){if(l.subject==='math')return mathChallenge(l,attempt);if(l.subject==='bm')return bmChallenge(l);if(l.subject==='en')return enChallenge(l);if(l.subject==='sci')return sciChallenge(l);if(l.subject==='hist')return historyChallenge(l);if(l.subject==='islam')return islamChallenge(l);if(l.subject==='moral')return moralChallenge(l);if(l.subject==='pjpk')return pjpkChallenge(l);return praChallenge(l)}

  function introScene(l){
    const ch=makeChallenge(l,0);let title='Tengok dulu';let cue='Lihat gambar. Kita faham dengan mata dahulu.';
    if(l.subject==='math')cue='Lihat objek dan pergerakan. Nombor datang selepas kita nampak maksudnya.';
    if(l.subject==='bm')cue='Lihat gambar dan maksud pendek. Ayat panjang kita simpan kemudian.';
    if(l.subject==='pra')cue='Lihat, dengar dan sentuh. Tak perlu baca banyak.';
    return {title,cue,html:`<div class="visual-intro-scene">${ch.visual}</div>`};
  }
  function demoScene(l,stage=1){
    const ch=makeChallenge(l,stage);
    return {cue:stage>1?'Kita kecilkan langkah. Tengok satu demi satu.':'Tengok pergerakan ini.',html:reteachHTML(l,ch,stage),challenge:ch};
  }
  function reteachHTML(l,ch,stage=1){
    const m=ch.meta||{};
    if(ch.kind==='add'){
      const concrete=m.yr<=2?`<div class="ai-combine"><div class="move-left">${dots(Math.min(m.a,12),'●')}</div><span>${m.op}</span><div class="move-right">${dots(Math.min(m.b,12),'●')}</div><strong>${m.ans}</strong></div>`:`<div class="ai-base10"><div>${tenBlocks(m.a)}<b>${m.a}</b></div><span>${m.op}</span><div>${tenBlocks(m.b)}<b>${m.b}</b></div><strong>${m.ans}</strong></div>`;return concrete;
    }
    if(ch.kind==='multiply')return `<div class="ai-groups">${Array.from({length:m.groups},()=>`<div>${dots(m.each,'●')}</div>`).join('')}<strong>${m.groups} × ${m.each} = ${m.ans}</strong></div>`;
    if(ch.kind==='fraction')return `<div class="ai-fraction">${fractionVisual(m.num,m.den)}<strong>${m.num}/${m.den}</strong></div>`;
    if(ch.kind==='time')return `<div class="ai-clock-demo">${clockSVG(m.h,m.m)}<strong>${m.h}:${String(m.m).padStart(2,'0')}</strong></div>`;
    if(ch.kind==='place')return `<div class="ai-place"><b>${m.num}</b><div class="place-hop"><span>${m.digit}</span><i>×</i><span>${m.place}</span><i>=</i><strong>${m.ans}</strong></div></div>`;
    if(ch.kind==='idiom'){const q=m.q;return `<div class="idiom-teach">${visualCard(q.icon,q.cue)}<span>→</span><div class="meaning-pop"><b>${esc(q.ans)}</b><small>${esc(q.cue)}</small></div></div>`}
    if(['classifier','verb','spell','vocab','sequence','en','science','history','islam','jawi','moral','pjpk','pra','pra-letter'].includes(ch.kind))return `<div class="ai-picture-teach">${ch.visual}<span class="pulse-arrow">→</span><div class="answer-pop">${esc(ch.answer)}</div></div>`;
    if(ch.kind==='pra-count')return `<div class="ai-count-teach">${ch.visual}<div class="count-bubbles">${Array.from({length:m.n},(_,i)=>`<span>${i+1}</span>`).join('')}</div><strong>${m.n}</strong></div>`;
    return `<div class="ai-picture-teach">${ch.visual}<span>→</span><div class="answer-pop">${esc(ch.answer)}</div></div>`;
  }
  function reteachScene(l,ch,wrongCount=1){const stage=Math.min(3,wrongCount);return {stage,cue:stage===1?'Tak apa. Tengok gambar bergerak ini.':stage===2?'Kita pecahkan lagi. Tengok satu demi satu.':'Kita buat contoh ini bersama. Lepas ini cuba soalan BARU.',html:reteachHTML(l,ch,stage)}}
  function normalizeChallenge(ch){if(!ch.options.some(o=>o.ok)){const found=ch.options.find(o=>String(o.label)===String(ch.answer));if(found)found.ok=true}return ch}
  return {makeChallenge:(l,a)=>normalizeChallenge(makeChallenge(l,a)),introScene,demoScene,reteachScene};
})();
