/* LatihKu template engine for Tahap 1 subjects without a curated pack
   (Bahasa Arab Tahun 1–2, Pendidikan Seni Visual and Pendidikan Muzik Tahun 2).
   BM, BI, Sains, Pendidikan Islam and PJPK are served by the year-aware Smart Generator.
   Offline and original: no source PDFs are shipped or reproduced. Every row carries
   distractors from the same concept so answers cannot be guessed by elimination. */
window.LATIH_PDF_ENGINE = (() => {
  const C = window.LATIH_CONFIG;
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const shuffle = a => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; };
  const norm = s => String(s).toLowerCase().replace(/\s+/g,' ').trim();
  function mcq(subject,topic,question,correct,wrong,explanation,difficulty,key){
    const c=String(correct),seen=new Set([norm(c)]),dist=[];
    for(const w of shuffle(wrong.map(String))){if(!seen.has(norm(w))){seen.add(norm(w));dist.push(w)}if(dist.length===3)break}
    if(dist.length<3)return null;
    const sig=norm(`${subject}|${topic}|${question}|${c}`);
    return {id:`PDFGEN-${subject.toUpperCase()}-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,topic,question,correct:c,answers:shuffle([c,...dist]),explanation,difficulty,concept:`pdf-${subject}-${key||sig.slice(0,70)}`,smart:true,pdfPattern:true,smartSignature:sig,source:'LatihKu Template Question Engine',alignment:'KPM-aligned practice',itemType:'mcq'};
  }
  function chooseTopic(subject,topic,weak={}){ if(topic&&topic!=='Campur Semua')return topic; const ts=C.subjects[subject]?.topics||[]; if(!ts.length)return ''; const w=[]; for(const t of ts){const n=Math.max(1,Math.min(5,1+(Number(weak[t])||0)));for(let i=0;i<n;i++)w.push(t);} return pick(w); }
  function diffFor(level,d){if(d&&d!=='auto'&&d!=='uasa')return d; return +level<=1?pick(['mudah','mudah','sederhana']):pick(['mudah','sederhana','sederhana']);}

  // ---------- Bahasa Arab (Tahun 1–2) ----------
  const AR_NUM=[['١','واحد','satu',1],['٢','اثنان','dua',1],['٣','ثلاثة','tiga',1],['٤','أربعة','empat',1],['٥','خمسة','lima',1],['٦','ستة','enam',2],['٧','سبعة','tujuh',2],['٨','ثمانية','lapan',2],['٩','تسعة','sembilan',2],['١٠','عشرة','sepuluh',2]];
  const AR_VOC={
    'Kenderaan':[['🚌','حافلة','bas'],['🚗','سيارة','kereta'],['🚲','دراجة','basikal'],['✈️','طائرة','kapal terbang'],['🚆','قطار','kereta api'],['🚢','سفينة','kapal']],
    'Pakaian':[['👕','قميص','baju'],['👖','سروال','seluar'],['👟','حذاء','kasut'],['🧢','قبعة','topi'],['🧦','جورب','stokin']],
    'Makanan':[['🍞','خبز','roti'],['🥛','حليب','susu'],['🍎','تفاح','epal'],['🍌','موز','pisang'],['🍚','أرز','nasi'],['💧','ماء','air']],
    'Kosa Kata':[['📘','كتاب','buku'],['🖊️','قلم','pen'],['📏','مسطرة','pembaris'],['🚪','باب','pintu'],['🪑','كرسي','kerusi'],['🏫','مدرسة','sekolah']]
  };
  function ba(level,topic,d){
    if(topic==='Nombor'){
      const rows=AR_NUM.filter(r=>r[3]<=+level),r=pick(rows);
      return Math.random()<.5
        ?mcq('ba',topic,`Apakah nilai nombor Arab ${r[0]}?`,r[2],AR_NUM.map(x=>x[2]),`${r[0]} ialah ${r[2]}.`,d,`num-${r[2]}`)
        :mcq('ba',topic,`Perkataan Arab bagi “${r[2]}” ialah…`,r[1],AR_NUM.map(x=>x[1]),`${r[2]} dalam bahasa Arab ialah ${r[1]}.`,d,`numw-${r[2]}`);
    }
    const group=AR_VOC[topic]||Object.values(AR_VOC).flat(),pool=AR_VOC[topic]?group:Object.values(AR_VOC).flat(),[ic,ar,ms]=pick(group),tpc=AR_VOC[topic]?topic:Object.keys(AR_VOC).find(k=>AR_VOC[k].some(x=>x[1]===ar));
    return Math.random()<.5
      ?mcq('ba',tpc,`${ic} Pilih perkataan Arab yang betul untuk “${ms}”.`,ar,pool.map(x=>x[1]),`Perkataan Arab untuk ${ms} ialah ${ar}.`,d,`pic-ar-${ms}`)
      :mcq('ba',tpc,`Apakah maksud “${ar}”?`,ms,pool.map(x=>x[2]),`${ar} bermaksud ${ms}.`,d,`meaning-${ar}`);
  }

  // ---------- Pendidikan Seni Visual (Tahun 2) ----------
  const PSV={
    'Garisan':[['Garisan lurus boleh dilukis dengan mudah menggunakan…','pembaris',['pemadam','berus gigi','span']],['Garisan yang naik turun seperti huruf Z disebut garisan…','zig-zag',['lurus','beralun','putus-putus']],['Garisan beralun sesuai untuk melukis…','ombak di laut',['bangunan tinggi','tiang bendera','pembaris']],['Garisan yang terputus-putus dipanggil garisan…','putus-putus',['tebal','zig-zag','lurus']],['Garisan boleh dihasilkan menggunakan…','pensel, krayon atau berus',['pemadam sahaja','gunting sahaja','gam sahaja']]],
    'Warna':[['Merah, kuning dan biru ialah…','warna asas',['warna sekunder','warna panas sahaja','warna neutral']],['Campuran merah dan kuning menghasilkan warna…','jingga',['hijau','ungu','coklat']],['Campuran biru dan kuning menghasilkan warna…','hijau',['jingga','ungu','merah jambu']],['Campuran merah dan biru menghasilkan warna…','ungu',['hijau','jingga','kelabu']],['Warna yang memberi rasa sejuk ialah…','biru',['merah','jingga','kuning']]],
    'Bentuk':[['Bentuk bulatan tidak mempunyai…','bucu',['garisan','warna','saiz']],['Segi empat sama mempunyai…','empat sisi yang sama panjang',['tiga sisi sahaja','tiada sisi','lima sisi']],['Bulatan, segi tiga dan segi empat ialah contoh…','bentuk geometri',['bentuk organik','warna asas','garisan']],['Bentuk daun dan awan ialah contoh bentuk…','organik',['geometri','lurus','segi empat']],['Objek yang mempunyai panjang, lebar dan tinggi ialah objek…','tiga dimensi',['dua dimensi','satu dimensi','rata']]],
    'Corak':[['Corak pada jalur zebra ialah corak…','berulang',['rawak sahaja','tiga dimensi','tanpa garisan']],['Corak pada kain batik dihasilkan menggunakan…','canting dan lilin',['gunting dan gam','pensel warna sahaja','kapur tulis']],['Motif yang disusun berulang-ulang menghasilkan…','corak',['garisan','kolaj','arca']],['Corak terancang boleh dihasilkan dengan teknik…','cetakan',['tiupan','renjisan','titisan']],['Corak tidak terancang boleh dihasilkan dengan teknik…','tiupan dan titisan',['cetakan berulang','lukisan grid','stensil']]],
    'Kolaj':[['Kain perca, butang dan kertas majalah boleh digunakan untuk menghasilkan…','kolaj',['arca kayu','lukisan pensel','ukiran batu']],['Gam digunakan dalam kolaj untuk…','melekatkan bahan pada kertas',['mewarnakan kertas','memotong bahan','melukis garisan']],['Kolaj dihasilkan dengan cara…','menampal pelbagai bahan',['mengukir kayu','menganyam daun','membentuk tanah liat']],['Bahan yang sesuai untuk kolaj ialah…','kertas warna dan kain perca',['air dan cat sahaja','batu besar','kaca pecah']],['Sebelum menampal bahan kolaj, kita perlu…','menyusun bahan terlebih dahulu',['membuang semua bahan','terus mewarna','mencuci bahan dengan air']]],
    'Kraf':[['Wau ialah kraf tradisional yang dimainkan dengan cara…','diterbangkan',['ditiup','direndam','dipukul']],['Bahan yang sesuai untuk anyaman ialah…','jalur kertas atau daun mengkuang',['batu','pasir','air']],['Anyaman dihasilkan melalui teknik…','menjalin bahan secara berselang-seli',['menampal kertas','mencetak corak','meniup cat']],['Contoh kraf tradisional ialah…','wau',['komputer','telefon bimbit','basikal']],['Ketika menggunakan gunting, kita perlu…','berhati-hati dan mengikut arahan',['berlari sambil memegangnya','menghalakannya ke rakan','bermain dengannya']]]
  };
  // ---------- Pendidikan Muzik (Tahun 2) ----------
  const MUSIC={
    'Tempo':[['Simbol muzik yang menunjukkan tempo perlahan ialah…','lento',['forte','piano','crescendo']],['Lagu kawad biasanya dinyanyikan dengan tempo yang…','tetap dan bersemangat',['sangat perlahan','berubah sesuka hati','tidak tentu']],['Kelajuan sesuatu lagu dipanggil…','tempo',['dinamik','pic','irama']],['Lagu bertempo cepat dimainkan dengan…','laju',['perlahan','lembut','kuat']],['Lagu dodoi biasanya dinyanyikan dengan tempo…','perlahan',['cepat','sangat cepat','berubah-ubah']]],
    'Dinamik':[['Semakin kuat secara beransur-ansur dalam muzik dipanggil…','crescendo',['decrescendo','lento','presto']],['Dinamik yang sesuai untuk lagu dodoi ialah…','lembut',['sangat kuat','menjerit','bising']],['Kuat dan lembut bunyi dalam muzik dipanggil…','dinamik',['tempo','pic','irama']],['Simbol “f” (forte) bermaksud nyanyi dengan…','kuat',['lembut','perlahan','cepat']],['Simbol “p” (piano) bermaksud nyanyi dengan…','lembut',['kuat','cepat','tinggi']]],
    'Irama':[['Ketukan pada kayu tik-tok membantu murid mengekalkan…','rentak lagu',['warna lagu','pic yang tinggi','lirik lagu']],['Corak irama boleh dimainkan menggunakan…','tepukan tangan dan hentakan kaki',['membaca buku','melukis','menulis']],['Detik yang berulang secara tetap dalam muzik dipanggil…','rentak',['pic','dinamik','lirik']],['Corak bunyi panjang dan pendek membentuk…','irama',['pic','dinamik','tempo']],['Tepukan tangan mengikut lagu membantu kita merasai…','rentak',['warna','bentuk','pic']]],
    'Pic':[['Bunyi wisel mempunyai pic yang…','tinggi',['rendah','perlahan','lembut']],['Suara lelaki dewasa biasanya mempunyai pic yang lebih…','rendah',['tinggi','laju','nyaring']],['Berbanding bunyi lembu, kicauan burung mempunyai pic yang lebih…','tinggi',['rendah','perlahan','lambat']],['Tinggi atau rendah sesuatu bunyi dipanggil…','pic',['tempo','dinamik','irama']],['Bunyi gendang besar mempunyai pic yang…','rendah',['tinggi','cepat','nyaring']]],
    'Alat Muzik':[['Loceng tangan dimainkan dengan cara…','digoncang',['ditiup','dipetik','digesek']],['🥁 Gendang dimainkan dengan cara…','dipalu',['dipetik','ditiup','digesek']],['🎸 Gitar dimainkan dengan cara…','dipetik',['dipalu','ditiup','digoncang']],['Rekorder dimainkan dengan cara…','ditiup',['dipetik','dipalu','digesek']],['Marakas dimainkan dengan cara…','digoncang',['ditiup','dipetik','digesek']],['Biola dimainkan dengan cara…','digesek',['ditiup','dipalu','digoncang']]],
    'Nyanyian':[['Bernyanyi dengan jelas memerlukan murid membuka…','mulut dengan betul',['mata seluas-luasnya','tangan ke atas','kaki ke sisi']],['Postur yang betul semasa menyanyi ialah…','badan tegak dan bahu rileks',['membongkok','berbaring','kepala tunduk ke bawah']],['Sebelum menyanyi, kita perlu…','berdiri tegak dan bernafas dengan betul',['membongkok','menjerit','berlari']],['Nyanyian berkumpulan memerlukan…','tempo yang sama dan kerjasama',['setiap orang menyanyi lagu berbeza','menjerit sekuat hati','berhenti sesuka hati']],['Sebutan yang jelas membantu…','lirik mudah difahami',['lagu menjadi pendek','tempo menjadi cepat','pic menjadi rendah']]]
  };
  const bank=(B,subject)=>(level,topic,d)=>{const t=B[topic]?topic:pick(Object.keys(B)),[q,a,w]=pick(B[t]);return mcq(subject,t,q,a,w,`Jawapan yang tepat ialah “${a}”.`,d,`${subject}-${q.slice(0,40)}`)};
  const GENS={ba,psv:bank(PSV,'psv'),music:bank(MUSIC,'music')};
  function generateOne(level,subject,topic,difficulty='auto',weak={}){
    const gen=GENS[subject]; if(!gen)return null; return gen(level,chooseTopic(subject,topic,weak),diffFor(level,difficulty));
  }
  const stemOf=x=>String(x.question).trim().toLowerCase().replace(/\s+/g,' ')+'#'+String(x.correct).trim().toLowerCase();
  function makeSet(level,subject,topic,count,difficulty='auto',ctx={}){
    const recent=new Set(ctx.recentGenerated||[]),out=[],here=new Set(),weak=ctx.weakTopics||{},ex=ctx.excludeStems;
    const fill=(tp,budget,allowRecent)=>{let tries=0;while(out.length<count&&tries<budget){tries++;const item=generateOne(level,subject,tp,difficulty,weak);if(!item)continue;const sig=item.smartSignature;if(here.has(sig)||(!allowRecent&&recent.has(sig))||(ex&&ex.has(stemOf(item))))continue;out.push(item);here.add(sig)}};
    fill(topic,count*80,false);fill(topic,count*40,true);
    // A small topic is topped up with other topics instead of repeating questions.
    if(out.length<count&&topic&&topic!=='Campur Semua')fill('Campur Semua',count*80,true);
    return out;
  }
  function supports(level,subject){return ['1','2'].includes(String(level))&&!!GENS[subject];}
  return {makeSet,generateOne,supports};
})();
