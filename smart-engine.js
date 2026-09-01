/* LatihKu v15 Smart Practice component
   Offline, rule-based question generation. No API key / internet required.
   Generated items are LatihKu originals and are never labelled as official KPM questions. */
window.LATIH_SMART = (() => {
  const C=window.LATIH_CONFIG;
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
  const escKey=s=>String(s).toLowerCase().replace(/\s+/g,' ').trim();
  const uniqWrong=(correct,wrong)=>{const c=String(correct),out=[];for(const x of shuffle(wrong.map(String))){if(x!==c&&!out.includes(x))out.push(x);if(out.length===3)break}for(const x of ['Tiada jawapan di atas','Pilihan lain','Tidak berkaitan']){if(out.length===3)break;if(x!==c&&!out.includes(x))out.push(x)}return out.slice(0,3)};
  function mcq(subject,topic,question,correct,wrong,explanation,difficulty='sederhana',key=''){
    const learner=pick(names),mode=Math.floor(Math.random()*4);
    let shown=question;
    if(mode===1)shown=subject==='en'?`Revision question for ${learner}: ${question}`:`Soalan ulang kaji untuk ${learner}: ${question}`;
    else if(mode===2)shown=subject==='en'?`${learner} is doing a revision exercise. ${question}`:`${learner} sedang membuat latihan ulang kaji. ${question}`;
    else if(mode===3)shown=subject==='en'?`Try this question: ${question}`:`Cuba soalan ini: ${question}`;
    const c=String(correct),answers=shuffle([c,...uniqWrong(c,wrong)]),sig=escKey(`${subject}|${topic}|${shown}|${c}`);
    return {id:`SMART-${subject.toUpperCase()}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,topic,question:shown,correct:c,answers,explanation,difficulty,concept:`smart-${subject}-${key||sig.slice(0,60)}`,smart:true,smartSignature:sig,source:'LatihKu Smart Generator',alignment:'KPM-aligned practice',itemType:'mcq'};
  }
  const names=['Aina','Amir','Siti','Ravi','Mei Ling','Hakim','Sara','Daniel','Iman','Kumar'];
  const chooseTopic=(subject,topic,weak={})=>{
    if(topic&&topic!=='Campur Semua')return topic;
    const topics=C.subjects[subject]?.topics||[];if(!topics.length)return '';
    const weighted=[];for(const t of topics){const w=Math.max(1,Math.min(5,1+(Number(weak[t])||0)));for(let i=0;i<w;i++)weighted.push(t)}return pick(weighted);
  };

  const BM_ANT=[['tinggi','rendah'],['besar','kecil'],['panas','sejuk'],['cepat','lambat'],['awal','lewat'],['rajin','malas'],['bersih','kotor'],['jauh','dekat'],['tebal','nipis'],['berat','ringan'],['panjang','pendek'],['terang','gelap'],['keras','lembut'],['mahal','murah']];
  const BM_CLASS=[['baju','helai'],['pensel','batang'],['ikan','ekor'],['pisang','sisir'],['roti','buku'],['kertas','keping'],['rumah','buah'],['kasut','pasang'],['anggur','tangkai'],['kunci','bentuk'],['bunga','kuntum'],['telur','biji'],['surat','pucuk'],['cermin mata','pasang'],['payung','kaki']];
  const BM_IDIOM=[['ringan tulang','rajin membantu'],['buah tangan','hadiah yang dibawa ketika berkunjung'],['anak emas','orang yang sangat disayangi'],['kaki ayam','tidak memakai kasut atau selipar'],['mulut murai','suka bercakap'],['otak cair','cerdik'],['panjang tangan','suka mencuri'],['besar hati','gembira atau bangga'],['makan angin','bersiar-siar'],['ambil berat','memberi perhatian'],['tanda mata','cenderamata'],['ikat perut','berjimat kerana kekurangan wang']];
  const spellWrongs=w=>{const i=Math.max(1,Math.min(w.length-2,Math.floor(w.length/2)));const a=w.slice(0,i)+w[i]+w.slice(i),b=w.slice(0,i)+w.slice(i+1),rep=w[i]==='a'?'e':'a',c=w.slice(0,i)+rep+w.slice(i+1);return [...new Set([a,b,c])].filter(x=>x!==w)};
  const BM_SPELL=['aktiviti','sekolah','keluarga','masyarakat','persahabatan','kesihatan','keselamatan','perpustakaan','tanggungjawab','kenderaan','pengetahuan','persekitaran','kerjasama','kebersihan','kemerdekaan','pengalaman','kejujuran','teknologi','pemakanan','pembelajaran'];
  const BM_ACTION=[['membaca','buku'],['menyiram','pokok'],['menendang','bola'],['memasak','nasi'],['menulis','karangan'],['mencuci','tangan'],['mengemas','bilik'],['menolong','jiran'],['melukis','gambar'],['membawa','beg']];
  const BM_CONJ=[['Aina membaca','adiknya menulis','manakala'],['Amir rajin belajar','ingin berjaya','kerana'],['Siti membawa payung','hari hujan','kerana'],['Ravi makan nasi','minum air','dan'],['Mei Ling mahu bermain','kerja sekolah belum siap','tetapi'],['Hakim bangun awal','tidak lewat ke sekolah','supaya']];
  function bm(level,topic,diff){
    if(topic==='Kosa Kata'){
      if(Math.random()<.6){const [a,b]=pick(BM_ANT),reverse=Math.random()<.5,word=reverse?b:a,ans=reverse?a:b,wrong=shuffle(BM_ANT.flat()).filter(x=>x!==ans&&x!==word);return mcq('bm',topic,`Lawan kata bagi “${word}” ialah…`,ans,wrong,`“${ans}” ialah lawan kata bagi “${word}”.`,diff,`ant-${word}`)}
      const [verb,obj]=pick(BM_ACTION),n=pick(names),wrong=BM_ACTION.map(x=>x[0]).filter(x=>x!==verb);return mcq('bm',topic,`${n} ___ ${obj} pada waktu petang. Pilih kata kerja yang sesuai.`,verb,wrong,`Kata kerja “${verb}” sesuai dengan objek “${obj}”.`,diff,`verb-${verb}-${obj}-${n}`);
    }
    if(topic==='Penjodoh Bilangan'){const [obj,ans]=pick(BM_CLASS),wrong=BM_CLASS.map(x=>x[1]).filter(x=>x!==ans);return mcq('bm',topic,`Pilih penjodoh bilangan yang sesuai untuk “${obj}”.`,ans,wrong,`Penjodoh bilangan yang sesuai bagi ${obj} ialah “${ans}”.`,diff,`class-${obj}`)}
    if(topic==='Simpulan Bahasa'){const [idiom,meaning]=pick(BM_IDIOM);if(Math.random()<.5)return mcq('bm',topic,`Apakah maksud simpulan bahasa “${idiom}”?`,meaning,BM_IDIOM.map(x=>x[1]).filter(x=>x!==meaning),`“${idiom}” bermaksud ${meaning}.`,diff,`idiom-m-${idiom}`);return mcq('bm',topic,`Simpulan bahasa yang bermaksud “${meaning}” ialah…`,idiom,BM_IDIOM.map(x=>x[0]).filter(x=>x!==idiom),`Jawapannya ialah “${idiom}”.`,diff,`idiom-i-${idiom}`)}
    if(topic==='Ejaan'){const w=pick(BM_SPELL),variants=spellWrongs(w);return mcq('bm',topic,'Pilih ejaan yang betul.',w,variants,`Ejaan yang betul ialah “${w}”.`,diff,`spell-${w}`)}
    if(topic==='Tatabahasa'){
      if(Math.random()<.55){const [a,b,ans]=pick(BM_CONJ);return mcq('bm',topic,`Pilih kata hubung yang sesuai: “${a} ___ ${b}.”`,ans,['dan','tetapi','kerana','supaya','manakala'].filter(x=>x!==ans),`Kata hubung “${ans}” paling sesuai menghubungkan dua bahagian ayat itu.`,diff,`conj-${ans}-${a}`)}
      const pron=[['Saya','kata ganti nama diri pertama'],['Kamu','kata ganti nama diri kedua'],['Dia','kata ganti nama diri ketiga'],['Mereka','kata ganti nama diri ketiga jamak']];const [word,ans]=pick(pron);return mcq('bm',topic,`Perkataan “${word}” ialah…`,ans,pron.map(x=>x[1]).filter(x=>x!==ans),`${word} digunakan sebagai ${ans}.`,diff,`pron-${word}`);
    }
    const n=pick(names),place=pick(['perpustakaan','taman','kelas','padang','rumah']),action=pick([['membaca buku','menambah ilmu'],['mengutip sampah','menjaga kebersihan'],['membantu rakannya','sikap tolong-menolong'],['menyiram pokok','menjaga tanaman'],['memulangkan barang yang dijumpai','kejujuran']]),time=pick(['pagi','petang','selepas sekolah','setiap hari']);
    const passage=`${n} ${action[0]} di ${place} pada waktu ${time}.`;
    const mode=Math.floor(Math.random()*3);if(mode===0)return mcq('bm','Pemahaman',`Baca petikan: “${passage}”\n\nDi manakah aktiviti itu dilakukan?`,place,['rumah','kantin','dewan','padang','perpustakaan'].filter(x=>x!==place),`Petikan menyatakan aktiviti itu dilakukan di ${place}.`,diff,`comp-place-${n}-${place}-${action[0]}`);if(mode===1)return mcq('bm','Pemahaman',`Baca petikan: “${passage}”\n\nBilakah aktiviti itu dilakukan?`,time,['malam','tengah hari','hujung minggu','awal pagi'].filter(x=>x!==time),`Petikan menyatakan waktunya ialah ${time}.`,diff,`comp-time-${n}-${time}-${action[0]}`);return mcq('bm','Pemahaman',`Baca petikan: “${passage}”\n\nApakah pengajaran atau tujuan yang sesuai?`,action[1],['membuang masa','mengelakkan belajar','merosakkan harta','bersikap cuai'],`Tindakan itu menunjukkan ${action[1]}.`,diff,`comp-idea-${n}-${action[0]}`);
  }

  const EN_ANT=[['big','small'],['hot','cold'],['fast','slow'],['early','late'],['happy','sad'],['clean','dirty'],['tall','short'],['heavy','light'],['near','far'],['old','new']];
  const EN_PLACE=[['hospital','doctors treat patients'],['library','people read and borrow books'],['school','pupils learn'],['bakery','bread and cakes are made'],['market','people buy food'],['farm','crops and animals are raised'],['airport','aeroplanes take off and land'],['restaurant','meals are served']];
  const EN_PREP=[['book','table','on'],['shoes','bed','under'],['cat','box','in'],['bicycle','house','beside'],['tree','house','behind'],['teacher','class','in front of']];
  function en(level,topic,diff){
    if(topic==='Vocabulary'){if(Math.random()<.5){const [a,b]=pick(EN_ANT),rev=Math.random()<.5,word=rev?b:a,ans=rev?a:b;return mcq('en',topic,`Choose the opposite of “${word}”.`,ans,EN_ANT.flat().filter(x=>x!==ans&&x!==word),`“${ans}” is the opposite of “${word}”.`,diff,`ant-${word}`)}const [place,desc]=pick(EN_PLACE);return mcq('en',topic,`Which word means a place where ${desc}?`,place,EN_PLACE.map(x=>x[0]).filter(x=>x!==place),`The correct place is a ${place}.`,diff,`place-${place}`)}
    if(topic==='Prepositions'){const [obj,place,ans]=pick(EN_PREP);return mcq('en',topic,`The ${obj} is ___ the ${place}.`,ans,['on','in','under','beside','behind','in front of'].filter(x=>x!==ans),`The correct preposition is “${ans}”.`,diff,`prep-${obj}-${place}-${ans}`)}
    if(topic==='Tenses'){const n=pick(names),verb=pick([['play','played','plays'],['walk','walked','walks'],['jump','jumped','jumps'],['visit','visited','visits'],['clean','cleaned','cleans'],['watch','watched','watches']]);const mode=Math.floor(Math.random()*3);if(mode===0)return mcq('en',topic,`Every day, ${n} ___ after school.`,verb[2],[verb[0],verb[1],'will '+verb[0]],'“Every day” shows a present habit.',diff,`pres-${n}-${verb[0]}`);if(mode===1)return mcq('en',topic,`Yesterday, ${n} ___ with the family.`,verb[1],[verb[0],verb[0]+'s','will '+verb[0]],'“Yesterday” requires the past tense.',diff,`past-${n}-${verb[0]}`);return mcq('en',topic,`Tomorrow, ${n} ___ the activity.`,`will ${verb[0]}`,[verb[0],verb[1],verb[0]+'s'],'“Tomorrow” refers to the future.',diff,`future-${n}-${verb[0]}`)}
    if(topic==='Grammar'){if(Math.random()<.5){const noun=pick(['apple','orange','egg','umbrella','ice cream']),ans='an';return mcq('en',topic,`I have ___ ${noun}.`,ans,['a','the','some'],`Use “an” before a vowel sound.`,diff,`article-${noun}`)}const plural=Math.random()<.5,subj=plural?'They':'She',ans=plural?'are':'is';return mcq('en',topic,`${subj} ___ ready for class.`,ans,['am','is','are','be'].filter(x=>x!==ans),`${subj} takes “${ans}”.`,diff,`be-${subj}`)}
    if(topic==='Sentence'){const n=pick(names);const correct=pick([`${n} is reading a book.`,`Where are you going?`,`Please close the door.`,`We went to the park yesterday.`]),lower=correct.replace(/^./,c=>c.toLowerCase()),noPunct=correct.replace(/[.?]$/,''),wrongPunct=correct.replace(/[.?]$/,correct.endsWith('?')?'.':'?');return mcq('en',topic,'Choose the sentence with correct punctuation.',correct,[lower,noPunct,wrongPunct],`A sentence begins with a capital letter and ends with suitable punctuation.`,diff,`sent-${correct}`)}
    const n=pick(names),place=pick(['library','park','school garden','museum']),item=pick(['three books','a blue bag','five flowers','a small camera']),time=pick(['this morning','after school','on Saturday','yesterday']);const passage=`${n} went to the ${place} ${time}. ${n} saw ${item}.`;const ask=Math.random()<.5;return ask?mcq('en','Comprehension',`Read: “${passage}”\n\nWhere did ${n} go?`,place,['market','hospital','beach','canteen'].filter(x=>x!==place),`The passage says ${n} went to the ${place}.`,diff,`comp-place-${n}-${place}-${time}`):mcq('en','Comprehension',`Read: “${passage}”\n\nWhat did ${n} see?`,item,['a red bicycle','two cats','a teacher','a bus'].filter(x=>x!==item),`The passage says ${n} saw ${item}.`,diff,`comp-item-${n}-${item}-${place}`);
  }

  const SCI={
    'Kemahiran Sains':[['Pemerhatian dibuat menggunakan…','deria dan alat yang sesuai'],['Ramalan ialah…','jangkaan berdasarkan maklumat atau corak'],['Mengukur panjang dengan tepat menggunakan…','alat pengukur yang sesuai'],['Pemboleh ubah yang diubah dalam penyiasatan ialah…','pemboleh ubah dimanipulasikan'],['Data eksperimen sepatutnya…','direkod dengan teratur']],
    'Manusia':[['Organ utama untuk bernafas ialah…','paru-paru'],['Jantung berfungsi untuk…','mengepam darah'],['Makanan seimbang membantu…','pertumbuhan dan kesihatan'],['Gigi perlu diberus untuk…','menjaga kebersihan mulut'],['Tidur mencukupi membantu badan…','berehat dan pulih']],
    'Haiwan':[['Mamalia biasanya…','menyusukan anak'],['Ikan bernafas menggunakan…','insang'],['Burung mempunyai badan yang dilitupi…','bulu pelepah'],['Haiwan memerlukan makanan untuk…','mendapatkan tenaga'],['Habitat ialah…','tempat hidup sesuatu organisma']],
    'Tumbuhan':[['Akar membantu tumbuhan…','menyerap air dan mencengkam tanah'],['Daun penting untuk…','membuat makanan'],['Bunga membantu proses…','pembiakan tumbuhan berbunga'],['Tumbuhan memerlukan cahaya untuk…','membuat makanan'],['Biji benih boleh bercambah apabila mendapat…','air dan keadaan yang sesuai']],
    'Bahan':[['Bahan lutsinar membenarkan…','cahaya melaluinya dengan jelas'],['Bahan yang mudah menyerap air ialah…','kain'],['Logam biasanya…','kuat dan boleh mengalirkan haba'],['Plastik digunakan secara meluas kerana…','ringan dan mudah dibentuk'],['Pemilihan bahan bergantung pada…','sifat bahan dan kegunaannya']],
    'Tenaga':[['Matahari ialah sumber…','cahaya dan haba'],['Bateri membekalkan…','tenaga elektrik'],['Makanan membekalkan manusia…','tenaga untuk aktiviti'],['Tenaga tidak sepatutnya…','dibazirkan'],['Kipas menukarkan tenaga elektrik kepada…','tenaga pergerakan']],
    'Bumi & Angkasa':[['Planet tempat kita tinggal ialah…','Bumi'],['Bumi berputar pada…','paksinya'],['Bumi mengelilingi…','Matahari'],['Bulan ialah…','satelit semula jadi Bumi'],['Siang dan malam berkaitan dengan…','putaran Bumi']],
    'Teknologi':[['Teknologi dicipta untuk…','membantu menyelesaikan masalah manusia'],['Sebelum menggunakan alat, kita perlu…','memahami cara penggunaan dan keselamatan'],['Reka bentuk yang baik perlu…','sesuai dengan fungsi'],['Alat dipilih berdasarkan…','tugas yang hendak dilakukan'],['Menggunakan teknologi dengan selamat memerlukan…','mematuhi arahan dan langkah keselamatan']]
  };
  function factGen(subject,topic,diff,bank){const rows=bank[topic]||Object.values(bank).flat(),[question,correct]=pick(rows),allAnswers=Object.values(bank).flat().map(x=>x[1]),wrong=shuffle(allAnswers.filter(x=>x!==correct));const prefix=Math.random()<.5?'':pick(['Pilih jawapan paling tepat. ','Berdasarkan pengetahuan anda, ','']);return mcq(subject,topic,prefix+question,correct,wrong,`Jawapan yang tepat ialah “${correct}”.`,diff,`fact-${topic}-${correct}-${prefix}`)}
  function sci(level,topic,diff){return factGen('sci',topic,diff,SCI)}

  const ISLAM={
    'Akidah':[['Rukun Iman mengandungi…','enam perkara'],['Beriman kepada malaikat termasuk dalam…','Rukun Iman'],['Allah Maha Mengetahui bermaksud…','Allah mengetahui segala sesuatu'],['Kita bersyukur kepada Allah dengan…','menggunakan nikmat dengan baik'],['Beriman kepada kitab bermaksud…','meyakini kitab-kitab yang diturunkan Allah']],
    'Ibadah':[['Puasa Ramadan dilaksanakan pada bulan…','Ramadan'],['Solat fardu sehari semalam ialah…','lima waktu'],['Wuduk dilakukan sebelum…','solat apabila berhadas kecil'],['Zakat mengajar kita untuk…','membantu golongan yang berhak'],['Menjaga kebersihan ketika beribadah ialah…','amalan yang baik']],
    'Sirah':[['Nabi Muhammad SAW dilahirkan di…','Makkah'],['Nabi Muhammad SAW dikenali sebagai al-Amin kerana…','amanah dan dipercayai'],['Hijrah Nabi Muhammad SAW berlaku dari Makkah ke…','Madinah'],['Kita mempelajari sirah untuk…','mengambil teladan yang baik'],['Sifat Rasulullah SAW yang wajar dicontohi ialah…','jujur dan amanah']],
    'Akhlak':[['Apabila ibu bapa bercakap, kita patut…','mendengar dengan hormat'],['Sebelum makan, kita digalakkan…','membaca doa'],['Jika berjanji, kita sepatutnya…','menepati janji'],['Dengan jiran, kita digalakkan…','berbuat baik dan saling membantu'],['Apabila melakukan kesalahan, kita patut…','meminta maaf dan membetulkannya']],
    'Jawi':[['Tulisan Jawi ditulis dari…','kanan ke kiri'],['Tulisan Jawi berasaskan…','huruf Arab dengan beberapa tambahan'],['Belajar Jawi membantu kita…','membaca tulisan Jawi dengan baik'],['Arah membaca perkataan Jawi ialah…','dari kanan ke kiri'],['Jawi ialah salah satu…','warisan tulisan bahasa Melayu']]
  };
  function islam(level,topic,diff){return factGen('islam',topic,diff,ISLAM)}

  const MORAL={
    'Kepercayaan':[['Dalam masyarakat pelbagai budaya, kita perlu…','saling menghormati'],['Apabila rakan mempunyai amalan berbeza, kita patut…','menghormati perbezaan']],
    'Hormat':[['Apabila guru sedang mengajar, kita patut…','mendengar dengan teliti'],['Bercakap dengan orang lebih tua menggunakan bahasa yang…','sopan']],
    'Tanggungjawab':[['Tugas sekolah sepatutnya…','disiapkan dengan usaha sendiri'],['Selepas menggunakan barang bersama, kita perlu…','meletakkannya semula dengan baik']],
    'Kejujuran':[['Jika terjumpa dompet, kita patut…','menyerahkannya kepada orang dewasa atau pemilik'],['Apabila melakukan kesalahan, kita perlu…','bercakap benar']],
    'Kerjasama':[['Gotong-royong lebih mudah apabila semua orang…','bekerjasama'],['Semasa kerja kumpulan, setiap ahli perlu…','menyumbang dan membantu']],
    'Kasih Sayang':[['Menjaga haiwan peliharaan termasuk…','memberi makanan dan tempat yang sesuai'],['Apabila ahli keluarga sakit, kita boleh…','membantu dan mengambil berat']]
  };
  function moral(level,topic,diff){return factGen('moral',topic,diff,MORAL)}

  const PJPK={
    'Kecergasan':[['Memanaskan badan sebelum bersenam membantu…','menyediakan badan untuk aktiviti'],['Aktiviti fizikal berkala membantu…','meningkatkan kecergasan']],
    'Pemakanan':[['Minuman terbaik untuk kekal terhidrat ialah…','air kosong'],['Pemakanan seimbang merangkumi…','pelbagai kumpulan makanan dalam kuantiti sesuai'],['Buah dan sayur penting kerana membekalkan…','vitamin, mineral dan serat']],
    'Keselamatan':[['Topi keledar dipakai ketika berbasikal untuk melindungi…','kepala'],['Semasa melintas jalan, kita perlu…','melihat kiri dan kanan serta guna tempat selamat']],
    'Kebersihan':[['Tangan perlu dibasuh dengan sabun terutamanya…','sebelum makan dan selepas menggunakan tandas'],['Mandi dan menukar pakaian bersih membantu…','menjaga kebersihan diri']],
    'Pergerakan':[['Berlari, melompat dan berjalan ialah kemahiran…','lokomotor'],['Membaling dan menangkap bola ialah kemahiran…','manipulasi alatan']],
    'Kesihatan':[['Tidur yang mencukupi membantu badan…','berehat dan pulih'],['Jika demam atau tidak sihat, kita patut…','beritahu orang dewasa dan dapatkan penjagaan yang sesuai']]
  };
  function pjpk(level,topic,diff){return factGen('pjpk',topic,diff,PJPK)}

  const HIST={
    'Diri & Keluarga':[['Salasilah keluarga menunjukkan…','hubungan antara ahli keluarga'],['Dokumen dan gambar lama boleh membantu kita…','mengetahui sejarah keluarga'],['Menghargai sejarah keluarga membantu kita…','memahami asal usul diri']],
    'Sekolah & Tempat Tinggal':[['Kemudahan awam perlu dijaga kerana…','digunakan oleh masyarakat'],['Nama tempat kadangkala berkaitan dengan…','sejarah atau ciri setempat'],['Sumber sejarah setempat boleh diperoleh melalui…','temu bual, dokumen dan tinggalan']],
    'Zaman Prasejarah':[['Gua pernah digunakan manusia prasejarah sebagai…','tempat perlindungan'],['Antara bukti kehidupan manusia prasejarah ialah…','artifak dan tinggalan arkeologi'],['Kajian artifak membantu kita…','memahami kehidupan masyarakat lampau']],
    'Kerajaan Melayu':[['Parameswara sering dikaitkan dengan…','pengasasan Melaka'],['Melaka berkembang kerana kedudukannya yang…','strategik untuk perdagangan'],['Kerajaan Melayu meninggalkan warisan seperti…','sistem pemerintahan, bahasa dan adat']],
    'Tokoh & Kemerdekaan':[['31 Ogos 1957 ialah tarikh…','kemerdekaan Persekutuan Tanah Melayu'],['Tunku Abdul Rahman dikenali sebagai…','Bapa Kemerdekaan'],['Tokoh kemerdekaan dihargai kerana…','sumbangan kepada negara']],
    'Malaysia':[['Jalur Gemilang ialah…','bendera Malaysia'],['Malaysia dibentuk pada…','16 September 1963'],['Rukun Negara membantu memupuk…','perpaduan dan keharmonian'],['Bunga kebangsaan Malaysia ialah…','bunga raya']]
  };
  function hist(level,topic,diff){return factGen('hist',topic,diff,HIST)}

  const GENS={bm,en,sci,islam,moral,pjpk,hist};
  function generateOne(level,subject,topic,difficulty='auto',weak={}){
    const t=chooseTopic(subject,topic,weak),d=difficulty==='auto'?(+level<=2?'mudah':+level>=5?'sederhana':pick(['mudah','sederhana'])):difficulty;
    const gen=GENS[subject];if(!gen)return null;return gen(level,t,d);
  }
  function makeSet(level,subject,topic,count,difficulty='auto',ctx={}){
    const recent=new Set(ctx.recentGenerated||[]),out=[],seenNow=new Set();let tries=0;
    while(out.length<count&&tries<count*120){tries++;const item=generateOne(level,subject,topic,difficulty,ctx.weakTopics||{});if(!item)break;const sig=item.smartSignature;if((recent.has(sig)||seenNow.has(sig))&&tries<count*80)continue;if(item.answers?.length===4&&new Set(item.answers.map(String)).size===4&&item.answers.filter(x=>String(x)===String(item.correct)).length===1){out.push(item);seenNow.add(sig)}}
    return out;
  }
  return {makeSet,generateOne};
})();
