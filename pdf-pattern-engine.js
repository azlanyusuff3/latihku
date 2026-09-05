/* LatihKu v20 PDF-Pattern Question Engine
   Offline procedural generator built from question *patterns* observed in the user's
   Year 1 / Year 2 practice corpus. It does not ship or reproduce the source PDFs.
   Generated questions are original LatihKu items and work without an API key. */
window.LATIH_PDF_ENGINE = (() => {
  const C = window.LATIH_CONFIG;
  const pick = a => a[Math.floor(Math.random()*a.length)];
  const ri = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
  const shuffle = a => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; };
  const norm = s => String(s).toLowerCase().replace(/\s+/g,' ').trim();
  const names = ['Aina','Amir','Sofia','Hakim','Mei Ling','Ravi','Sara','Daniel','Iman','Kumar','Hana','Adam'];
  const places = ['sekolah','taman rekreasi','perpustakaan','rumah','padang','kantin','dewan komuniti'];
  function uniqWrong(correct, arr){ const c=String(correct), out=[]; for(const x of shuffle(arr.map(String))){ if(x!==c&&!out.includes(x))out.push(x); if(out.length===3)break; } for(const x of ['Tidak berkaitan','Pilihan lain','Tiada jawapan di atas']){if(out.length===3)break;if(x!==c&&!out.includes(x))out.push(x);} return out.slice(0,3); }
  function mcq(subject,topic,question,correct,wrong,explanation,difficulty='sederhana',key='',meta={}){
    const c=String(correct), answers=shuffle([c,...uniqWrong(c,wrong)]), student=pick(names), context=pick(['sebelum kelas bermula','selepas sekolah','pada waktu ulang kaji','semasa belajar bersama keluarga','ketika latihan kendiri','selepas membaca nota','semasa sesi pembelajaran','pada waktu petang','pada hujung minggu','ketika mengulang topik ini']);
    const mode=ri(0,5); let shown=question;
    if(subject==='en'){
      if(mode===1)shown=`Choose the best answer. ${question}`;else if(mode===2)shown=`${student} is revising after class. ${question}`;else if(mode===3)shown=`Revision card for ${student}: ${question}`;else if(mode===4)shown=`Read carefully and answer. ${question}`;else if(mode===5)shown=`${student} is doing independent practice. ${question}`;
    }else{
      if(mode===1)shown=`Pilih jawapan paling tepat. ${question}`;else if(mode===2)shown=`${student} membuat ulang kaji ${context}. ${question}`;else if(mode===3)shown=`Kad ulang kaji untuk ${student}: ${question}`;else if(mode===4)shown=`Baca dengan teliti dan jawab. ${question}`;else if(mode===5)shown=`${student} sedang membuat latihan kendiri ${context}. ${question}`;
    }
    const sig=norm(`${subject}|${topic}|${shown}|${c}`);
    return {id:`PDFGEN-${subject.toUpperCase()}-${Date.now()}-${Math.random().toString(36).slice(2,9)}`,topic,question:shown,correct:c,answers,explanation,difficulty,concept:`pdf-${subject}-${key||sig.slice(0,70)}`,smart:true,pdfPattern:true,smartSignature:sig,source:'LatihKu AI Question Engine',alignment:'PDF-pattern inspired · KPM/JAIS aligned practice',itemType:'mcq',...meta};
  }
  function chooseTopic(subject,topic,weak={}){ if(topic&&topic!=='Campur Semua')return topic; const ts=C.subjects[subject]?.topics||[]; if(!ts.length)return ''; const w=[]; for(const t of ts){const n=Math.max(1,Math.min(5,1+(Number(weak[t])||0)));for(let i=0;i<n;i++)w.push(t);} return pick(w); }
  function diffFor(level,d){if(d&&d!=='auto'&&d!=='uasa')return d; const y=+level||1; return y<=2?pick(['mudah','mudah','sederhana']):y<=4?pick(['mudah','sederhana','sederhana']):pick(['sederhana','sederhana','sukar']);}

  // ---------- Bahasa Melayu: visual/context, tatabahasa, comprehension, fill-gap style ----------
  const BM_SCENES=[
    {icon:'🎂',scene:'sambutan hari lahir',place:'rumah',acts:['memotong kek','memberi hadiah','menyanyi'],mood:'gembira'},
    {icon:'🏸',scene:'riadah keluarga',place:'taman rekreasi',acts:['bermain badminton','berjalan kaki','berehat'],mood:'ceria'},
    {icon:'🧹',scene:'gotong-royong',place:'sekolah',acts:['menyapu sampah','mengutip daun','menyusun kerusi'],mood:'bekerjasama'},
    {icon:'📚',scene:'aktiviti membaca',place:'perpustakaan',acts:['membaca buku','meminjam buku','menyusun buku'],mood:'tekun'},
    {icon:'🌳',scene:'menjaga alam sekitar',place:'taman',acts:['menanam pokok','mengutip sampah','menyiram pokok'],mood:'bertanggungjawab'}
  ];
  const BM_CLASS=[['roti','buku'],['pisang','sisir'],['kertas','helai'],['bunga','kuntum'],['ikan','ekor'],['kasut','pasang'],['pensel','batang'],['rumah','buah'],['surat','pucuk'],['kunci','bentuk']];
  const BM_CONJ=[['Aina membaca buku','adiknya melukis','manakala'],['Amir membawa payung','hari hujan','kerana'],['Siti menyiapkan kerja sekolah','boleh bermain','sebelum'],['Ravi makan nasi','minum air','dan'],['Mei Ling mahu bermain','kerja sekolah belum siap','tetapi'],['Hakim bangun awal','tidak lewat ke sekolah','supaya']];
  const BM_WORDS=['keluarga','sekolah','persahabatan','kebersihan','keselamatan','masyarakat','perpustakaan','tanggungjawab','kerjasama','kesihatan'];
  function bm(level,topic,d){
    if(topic==='Penjodoh Bilangan'){const [obj,ans]=pick(BM_CLASS);return mcq('bm',topic,`Ibu membeli se${ans} ${obj}. Pilih penjodoh bilangan yang betul.`,ans,BM_CLASS.map(x=>x[1]),`Penjodoh bilangan yang sesuai untuk ${obj} ialah “${ans}”.`,d,`class-${obj}`)}
    if(topic==='Ejaan'){const w=pick(BM_WORDS), i=Math.max(1,Math.floor(w.length/2)), wrong=[w.slice(0,i)+w[i]+w.slice(i),w.slice(0,i)+w.slice(i+1),w.replace(/[aeiou]/,m=>m==='a'?'e':'a')];return mcq('bm',topic,'Pilih ejaan yang betul.',w,wrong,`Ejaan standard ialah “${w}”.`,d,`spell-${w}`)}
    if(topic==='Tatabahasa'){const [a,b,ans]=pick(BM_CONJ);return mcq('bm',topic,`Lengkapkan ayat: “${a} ___ ${b}.”`,ans,['dan','tetapi','kerana','supaya','manakala','sebelum'].filter(x=>x!==ans),`Kata hubung “${ans}” paling sesuai dengan maksud ayat.`,d,`conj-${ans}-${a}`)}
    if(topic==='Kosa Kata'){const s=pick(BM_SCENES),act=pick(s.acts),n=pick(names);return mcq('bm',topic,`${s.icon} ${n} sedang ___ di ${s.place}.`,act,s.acts.concat(['tidur','memandu kereta','membeli tiket']).filter(x=>x!==act),`Berdasarkan konteks ${s.scene}, perbuatan yang sesuai ialah ${act}.`,d,`scene-act-${s.scene}-${act}`)}
    if(topic==='Simpulan Bahasa'){const rows=[['ringan tulang','rajin membantu'],['buah tangan','hadiah ketika berkunjung'],['besar hati','gembira atau bangga'],['makan angin','bersiar-siar'],['ambil berat','memberi perhatian'],['kaki ayam','tidak berkasut']],[idiom,meaning]=pick(rows);return mcq('bm',topic,`Apakah maksud “${idiom}”?`,meaning,rows.map(x=>x[1]),`“${idiom}” bermaksud ${meaning}.`,d,`idiom-${idiom}`)}
    const s=pick(BM_SCENES),n=pick(names),act=pick(s.acts),pass=`${n} dan keluarganya berada di ${s.place}. Mereka ${act}. Semua orang berasa ${s.mood} dan menjaga kawasan itu dengan baik.`,mode=ri(1,4);
    if(mode===1)return mcq('bm','Pemahaman',`Baca petikan:\n“${pass}”\n\nDi manakah mereka berada?`,s.place,places,`Lokasi dinyatakan terus dalam petikan, iaitu ${s.place}.`,d,`comp-place-${s.place}-${act}`);
    if(mode===2)return mcq('bm','Pemahaman',`Baca petikan:\n“${pass}”\n\nApakah aktiviti yang dilakukan?`,act,s.acts.concat(['membeli-belah','bermain permainan video']),`Aktiviti dalam petikan ialah ${act}.`,d,`comp-act-${act}`);
    if(mode===3)return mcq('bm','Pemahaman',`Baca petikan:\n“${pass}”\n\nBagaimanakah perasaan mereka?`,s.mood,['sedih','takut','marah','bosan'],`Petikan menyatakan mereka berasa ${s.mood}.`,d,`comp-mood-${s.mood}`);
    return mcq('bm','Pemahaman',`Baca petikan:\n“${pass}”\n\nNilai yang paling sesuai ialah…`,'bertanggungjawab',['cuai','mementingkan diri','malas','boros'],`Menjaga kawasan dengan baik menunjukkan sikap bertanggungjawab.`,d,`comp-value-${s.scene}`);
  }

  // ---------- English: picture vocabulary, sentence/grammar and short passage ----------
  const EN_PIC=[['🚌','bus'],['🚗','car'],['🚲','bicycle'],['✈️','aeroplane'],['🍎','apple'],['🐱','cat'],['📘','book'],['👕','shirt'],['⚽','football'],['🥛','milk']];
  const EN_PREP=[['book','table','on'],['cat','box','in'],['shoes','bed','under'],['bicycle','house','beside'],['tree','house','behind']];
  function en(level,topic,d){
    if(topic==='Vocabulary'){const [ic,w]=pick(EN_PIC);return mcq('en',topic,`${ic} Choose the correct word.`,w,EN_PIC.map(x=>x[1]),`The picture represents “${w}”.`,d,`pic-${w}`)}
    if(topic==='Prepositions'){const [a,b,ans]=pick(EN_PREP);return mcq('en',topic,`The ${a} is ___ the ${b}.`,ans,['on','in','under','beside','behind','in front of'],`“${ans}” is the correct preposition.`,d,`prep-${a}-${b}`)}
    if(topic==='Grammar'||topic==='Sentence'){const n=pick(names),verb=pick([['plays','play'],['reads','read'],['walks','walk'],['eats','eat'],['writes','write']]),plural=Math.random()<.4,sub=plural?'They':n,ans=plural?verb[1]:verb[0];return mcq('en',topic,`Choose the correct sentence: “${sub} ___ every day.”`,ans,[verb[0],verb[1],'playing','played'].filter(x=>x!==ans),`${sub} takes “${ans}” in this simple present sentence.`,d,`grammar-${sub}-${ans}`)}
    if(topic==='Tenses'){const n=pick(names),row=pick([['visit','visited'],['play','played'],['walk','walked'],['cook','cooked'],['clean','cleaned']]);return mcq('en',topic,`Yesterday, ${n} ___ with the family.`,row[1],[row[0],row[0]+'s',row[0]+'ing','will '+row[0]],`“Yesterday” signals the past tense: ${row[1]}.`,d,`past-${row[0]}-${n}`)}
    const n=pick(names),place=pick(['library','park','school','market']),thing=pick(['a red bicycle','three birds','a small cat','a new book']),pass=`${n} went to the ${place} with the family. ${n} saw ${thing} and felt happy.`;
    return Math.random()<.5?mcq('en','Comprehension',`Read:\n“${pass}”\n\nWhere did ${n} go?`,place,['hospital','beach','canteen','farm'].filter(x=>x!==place),`The passage says ${n} went to the ${place}.`,d,`comp-place-${n}-${place}`):mcq('en','Comprehension',`Read:\n“${pass}”\n\nWhat did ${n} see?`,thing,['a blue bus','two dogs','a teacher','a cake'].filter(x=>x!==thing),`The passage says ${n} saw ${thing}.`,d,`comp-thing-${n}-${thing}`);
  }

  // ---------- Science: observation, classification, application ----------
  const SCI_BANK={
    'Kemahiran Sains':[['Yang manakah contoh pemerhatian?','Menggunakan mata untuk mencatat warna daun'],['Alat yang sesuai untuk mengukur panjang meja ialah…','pembaris atau pita pengukur'],['Ramalan dibuat berdasarkan…','maklumat dan corak yang diperhatikan']],
    'Manusia':[['Organ utama untuk bernafas ialah…','paru-paru'],['Kita memerlukan makanan seimbang untuk…','membesar dan kekal sihat'],['Jantung membantu…','mengepam darah ke seluruh badan']],
    'Haiwan':[['Ikan bernafas menggunakan…','insang'],['Haiwan memerlukan air dan makanan untuk…','terus hidup'],['Anak kucing membesar menjadi…','kucing dewasa']],
    'Tumbuhan':[['Akar menyerap…','air dari tanah'],['Daun membantu tumbuhan…','membuat makanan'],['Biji benih memerlukan air untuk…','bercambah']],
    'Bahan':[['Bahan yang menyerap air dengan baik ialah…','kain'],['Bahan lutsinar membenarkan…','cahaya melaluinya'],['Logam biasanya bersifat…','kuat']],
    'Tenaga':[['Matahari membekalkan…','cahaya dan haba'],['Kipas menggunakan tenaga…','elektrik'],['Makanan memberikan manusia…','tenaga']],
    'Bumi & Angkasa':[['Planet tempat kita tinggal ialah…','Bumi'],['Bulan ialah…','satelit semula jadi Bumi'],['Siang dan malam berlaku apabila…','Bumi berputar pada paksinya']],
    'Teknologi':[['Alat dipilih berdasarkan…','fungsi yang diperlukan'],['Sebelum menggunakan alat, kita perlu…','mematuhi arahan keselamatan'],['Teknologi membantu manusia…','menyelesaikan masalah']]
  };
  function sci(level,topic,d){const rows=SCI_BANK[topic]||Object.values(SCI_BANK).flat(),[q,a]=pick(rows),all=Object.values(SCI_BANK).flat().map(x=>x[1]);return mcq('sci',topic,q,a,all,`Jawapan yang tepat ialah “${a}”.`,d,`sci-${topic}-${a}`)}

  // ---------- Pendidikan Islam (SK) ----------
  const ISLAM={
    'Akidah':[['Rukun Iman mempunyai…','enam perkara'],['Allah Maha Mengetahui bermaksud…','Allah mengetahui segala sesuatu'],['Beriman kepada malaikat ialah sebahagian daripada…','Rukun Iman']],
    'Ibadah':[['Solat fardu sehari semalam ialah…','lima waktu'],['Wuduk dilakukan sebelum solat apabila…','berhadas kecil'],['Puasa wajib dilaksanakan pada bulan…','Ramadan']],
    'Sirah':[['Nabi Muhammad SAW dilahirkan di…','Makkah'],['Gelaran al-Amin menunjukkan sifat…','amanah'],['Hijrah Nabi Muhammad SAW menuju ke…','Madinah']],
    'Akhlak':[['Apabila ibu bapa bercakap, kita perlu…','mendengar dengan hormat'],['Jika bersalah, kita hendaklah…','meminta maaf'],['Dengan jiran, kita digalakkan…','saling membantu']],
    'Jawi':[['Tulisan Jawi dibaca dari…','kanan ke kiri'],['Jawi ialah salah satu warisan…','bahasa Melayu'],['Huruf Jawi berasaskan…','huruf Arab dengan huruf tambahan']]
  };
  function islam(level,topic,d){const rows=ISLAM[topic]||Object.values(ISLAM).flat(),[q,a]=pick(rows),wrong=Object.values(ISLAM).flat().map(x=>x[1]);return mcq('islam',topic,q,a,wrong,`Jawapannya ialah “${a}”.`,d,`islam-${topic}-${a}`)}

  // ---------- SRA / KAFA JAIS: guarded factual patterns from notes + exam structure ----------
  const SRA={
    'Tauhid':[
      ['Iman melibatkan pengakuan dengan lisan, membenarkan dalam hati dan…','beramal dengan anggota badan'],
      ['Rukun Iman yang pertama ialah beriman kepada…','Allah'],
      ['Malaikat dijadikan daripada…','cahaya'],
      ['Hukum beriman kepada Allah ialah…','wajib'],
      ['Rasul menerima… daripada Allah','wahyu']
    ],
    'Fekah':[
      ['Ibadah ialah pengabdian diri kepada…','Allah'],
      ['Contoh ibadah khusus ialah…','solat'],
      ['Taharah bermaksud…','bersuci'],
      ['Antara tujuan manusia dijadikan ialah…','menyembah dan beribadah kepada Allah'],
      ['Gotong-royong boleh menjadi contoh…','ibadah umum']
    ],
    'Akhlak':[
      ['Sebelum berdoa, kita digalakkan memastikan badan dan pakaian…','bersih'],
      ['Antara adab berdoa ialah…','merendah diri dan khusyuk'],
      ['Selepas qada hajat, kita perlu…','beristinjak dan membersihkan diri'],
      ['Masuk tandas digalakkan dengan…','membaca doa'],
      ['Berdoa boleh membantu hati menjadi…','tenang']
    ],
    'Jawi':[
      ['Tulisan Jawi dibaca dari…','kanan ke kiri'],
      ['Perkataan “بولا” dibaca sebagai…','bola'],
      ['Perkataan “ايم” dibaca sebagai…','ayam'],
      ['Perkataan “تالي” dibaca sebagai…','tali'],
      ['Perkataan “كاسوت” dibaca sebagai…','kasut']
    ],
    'Bahasa Arab':[
      ['“أُمٌّ” bermaksud…','ibu'],
      ['“كِتَابٌ” bermaksud…','buku'],
      ['“مَسْجِدٌ” bermaksud…','masjid'],
      ['Ucapan “السَّلاَمُ عَلَيْكُمْ” ialah…','ucapan salam'],
      ['“مَنْ هَذَا؟” digunakan untuk bertanya…','siapakah ini']
    ],
    'Hafazan':[
      ['Surah yang menjadi permulaan al-Quran ialah…','al-Fatihah'],
      ['Surah al-Falaq mengajar kita memohon…','perlindungan daripada kejahatan'],
      ['Surah yang dibaca dalam setiap rakaat solat ialah…','al-Fatihah'],
      ['Antara masa yang sesuai membaca surah perlindungan ialah…','sebelum tidur'],
      ['Surah al-Ikhlas menegaskan tentang…','keesaan Allah']
    ]
  };
  function sra(level,topic,d){const rows=SRA[topic]||Object.values(SRA).flat(),[q,a]=pick(rows),wrong=Object.values(SRA).flat().map(x=>x[1]);return mcq('sra',topic,q,a,wrong,`Berdasarkan nota dan konsep SRA, jawapannya ialah “${a}”.`,d,`sra-${topic}-${a}`)}

  // ---------- Bahasa Arab SK/KAFA style: number, image vocab, transport, clothes, food ----------
  const AR_NUM=[['١','satu'],['٢','dua'],['٣','tiga'],['٤','empat'],['٥','lima'],['١٠','sepuluh'],['٥٠','lima puluh'],['١٠٠','seratus']];
  const AR_VOC=[['🚌','حافلة','bas'],['🚗','سيارة','kereta'],['🚲','دراجة','basikal'],['✈️','طائرة','kapal terbang'],['👕','قميص','baju'],['👖','سروال','seluar'],['🍞','خبز','roti'],['🥛','حليب','susu'],['🍎','تفاح','epal'],['📘','كتاب','buku']];
  function ba(level,topic,d){
    if(topic==='Nombor'){const [n,m]=pick(AR_NUM);return mcq('ba',topic,`Apakah nilai nombor Arab ${n}?`,m,AR_NUM.map(x=>x[1]),`${n} bermaksud ${m}.`,d,`num-${n}`)}
    let pool=AR_VOC;if(topic==='Kenderaan')pool=AR_VOC.slice(0,4);else if(topic==='Pakaian')pool=AR_VOC.slice(4,6);else if(topic==='Makanan')pool=AR_VOC.slice(6,9);const [ic,ar,ms]=pick(pool);return Math.random()<.5?mcq('ba',topic,`${ic} Pilih perkataan Arab yang betul.`,ar,AR_VOC.map(x=>x[1]),`Perkataan Arab untuk ${ms} ialah ${ar}.`,d,`pic-ar-${ms}`):mcq('ba',topic,`Apakah maksud “${ar}”?`,ms,AR_VOC.map(x=>x[2]),`${ar} bermaksud ${ms}.`,d,`meaning-${ar}`);
  }

  // ---------- PSV ----------
  const PSV={
    'Garisan':[['Garisan zig-zag mempunyai bentuk…','bersudut-sudut'],['Garisan beralun sesuai menggambarkan…','ombak'],['Garisan boleh digunakan untuk menghasilkan…','rupa dan corak']],
    'Warna':[['Merah, kuning dan biru ialah…','warna asas'],['Campuran merah dan kuning menghasilkan…','jingga'],['Warna yang memberi rasa sejuk termasuk…','biru']],
    'Bentuk':[['Bulatan, segi tiga dan segi empat ialah…','rupa geometri'],['Objek tiga dimensi mempunyai…','panjang, lebar dan tinggi'],['Bentuk boleh dikenal melalui…','rupa dan ruang']],
    'Corak':[['Motif yang diulang menghasilkan…','corak'],['Susunan motif secara teratur disebut…','ulangan'],['Corak boleh dibuat menggunakan…','cap atau cetakan']],
    'Kolaj':[['Kolaj dihasilkan dengan…','menampal pelbagai bahan'],['Bahan sesuai untuk kolaj termasuk…','kertas warna'],['Semasa membuat kolaj, bahan disusun sebelum…','ditampal']],
    'Kraf':[['Kraf menggunakan kemahiran…','tangan dan bahan'],['Anyaman menghasilkan corak melalui…','jalinan berselang-seli'],['Keselamatan penting ketika menggunakan…','gunting dan alat tajam']]
  };
  function psv(level,topic,d){const rows=PSV[topic]||Object.values(PSV).flat(),[q,a]=pick(rows),wrong=Object.values(PSV).flat().map(x=>x[1]);return mcq('psv',topic,q,a,wrong,`Konsep seni yang tepat ialah “${a}”.`,d,`psv-${topic}-${a}`)}

  // ---------- Pendidikan Muzik ----------
  const MUSIC={
    'Tempo':[['Tempo cepat bermaksud muzik dimainkan…','dengan laju'],['Tempo perlahan bermaksud…','lambat'],['Kelajuan sesuatu lagu disebut…','tempo']],
    'Dinamik':[['Bunyi kuat dan lembut dalam muzik berkaitan dengan…','dinamik'],['Bermain semakin kuat ialah perubahan…','dinamik'],['Dinamik membantu muzik menjadi lebih…','ekspresif']],
    'Irama':[['Corak bunyi panjang dan pendek membentuk…','irama'],['Tepukan mengikut pola boleh melatih…','irama'],['Detik yang tetap membantu kita mengekalkan…','rentak']],
    'Pic':[['Bunyi tinggi dan rendah disebut…','pic'],['Suara kanak-kanak biasanya mempunyai pic lebih…','tinggi'],['Perbezaan pic menghasilkan…','melodi']],
    'Alat Muzik':[['🥁 Alat ini dimainkan dengan cara…','dipukul'],['🎹 Piano dimainkan menggunakan…','kekunci'],['🎸 Gitar menghasilkan bunyi apabila talinya…','dipetik']],
    'Nyanyian':[['Sebelum menyanyi, kita perlu…','bernafas dengan baik'],['Nyanyian berkumpulan memerlukan…','kerjasama dan tempo yang sama'],['Sebutan jelas membantu…','lirik mudah difahami']]
  };
  function music(level,topic,d){const rows=MUSIC[topic]||Object.values(MUSIC).flat(),[q,a]=pick(rows),wrong=Object.values(MUSIC).flat().map(x=>x[1]);return mcq('music',topic,q,a,wrong,`Jawapan yang tepat ialah “${a}”.`,d,`music-${topic}-${a}`)}

  // ---------- PJPK PDF-pattern extension ----------
  const PJPK={
    'Kecergasan':[['Memanaskan badan sebelum aktiviti membantu…','menyediakan badan untuk bergerak'],['Aktiviti berlari membantu meningkatkan…','kecergasan']],
    'Pemakanan':[['Minuman utama untuk hidrasi ialah…','air kosong'],['Buah dan sayur membekalkan…','vitamin dan serat']],
    'Keselamatan':[['Semasa berbasikal, lindungi kepala dengan…','topi keledar'],['Sebelum melintas jalan, kita perlu…','melihat kiri dan kanan']],
    'Kebersihan':[['Tangan perlu dibasuh sebelum…','makan'],['Mandi membantu menjaga…','kebersihan diri']],
    'Pergerakan':[['Berlari ialah pergerakan…','lokomotor'],['Membaling bola ialah kemahiran…','manipulasi alatan']],
    'Kesihatan':[['Tidur mencukupi membantu badan…','berehat dan pulih'],['Jika demam, kita perlu…','memaklumkan orang dewasa']]
  };
  function pjpk(level,topic,d){const rows=PJPK[topic]||Object.values(PJPK).flat(),[q,a]=pick(rows),wrong=Object.values(PJPK).flat().map(x=>x[1]);return mcq('pjpk',topic,q,a,wrong,`Jawapan paling sesuai ialah “${a}”.`,d,`pjpk-${topic}-${a}`)}

  // Existing subjects with no PDF corpus still use the v19 Smart Generator first/after bank.
  const GENS={bm,en,sci,islam,sra,ba,psv,music,pjpk};
  function generateOne(level,subject,topic,difficulty='auto',weak={}){
    const gen=GENS[subject]; if(!gen)return null; const t=chooseTopic(subject,topic,weak),d=diffFor(level,difficulty); return gen(level,t,d);
  }
  function makeSet(level,subject,topic,count,difficulty='auto',ctx={}){
    const recent=new Set(ctx.recentGenerated||[]),out=[],here=new Set(); let tries=0;
    while(out.length<count&&tries<count*160){tries++;const item=generateOne(level,subject,topic,difficulty,ctx.weakTopics||{});if(!item)break;const sig=item.smartSignature;if((recent.has(sig)||here.has(sig))&&tries<count*100)continue;if(item.answers?.length===4&&new Set(item.answers.map(String)).size===4&&item.answers.filter(x=>String(x)===String(item.correct)).length===1){out.push(item);here.add(sig);}}
    return out;
  }
  function supports(level,subject){return ['1','2'].includes(String(level))&&!!GENS[subject];}
  return {makeSet,generateOne,supports};
})();
