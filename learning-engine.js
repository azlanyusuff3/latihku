/* LatihKu v14 Learning Engine — offline micro-lessons, guided activities and sentence writing scaffolds. */
window.LATIH_LEARNING = (() => {
  const C=window.LATIH_CONFIG;
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const SUBJECT_INTRO={
    math:{icon:'🔢',tone:'Nombor jadi mudah bila kita faham langkahnya.',tip:'Lihat pola, buat satu langkah pada satu masa.'},
    bm:{icon:'📖',tone:'Bahasa jadi seronok bila perkataan boleh dibina menjadi ayat.',tip:'Baca ayat perlahan-lahan dan cari siapa, buat apa, di mana.'},
    en:{icon:'🔤',tone:'English grows from useful words into clear sentences.',tip:'Start with who + action + object/place.'},
    sci:{icon:'🔬',tone:'Sains bermula dengan memerhati, bertanya dan menerangkan sebab.',tip:'Tanya: apa yang berlaku, bagaimana dan mengapa?'},
    hist:{icon:'🏛️',tone:'Sejarah ialah cerita tentang orang, tempat dan peristiwa.',tip:'Susun siapa, bila, di mana dan mengapa.'},
    islam:{icon:'🕌',tone:'Belajar dengan faham maksud, amalan dan contoh dalam kehidupan.',tip:'Faham dahulu, kemudian kaitkan dengan amalan harian.'},
    moral:{icon:'🤝',tone:'Nilai lebih mudah difahami melalui situasi sebenar.',tip:'Fikir tindakan yang baik dan kesannya kepada orang lain.'},
    pjpk:{icon:'🏃',tone:'Belajar cara menjaga badan, keselamatan dan pergerakan.',tip:'Kaitkan konsep dengan aktiviti harian.'},
    pra:{icon:'🧒',tone:'Belajar melalui lihat, dengar, sentuh dan cuba.',tip:'Buat aktiviti pendek dan ulang dengan cara berbeza.'}
  };
  const TOPIC_NOTES={
    math:{
      'Nombor':['Kenal nilai digit dan susunan nombor.','Bandingkan nombor dari kecil ke besar.','Gunakan nilai tempat untuk membaca nombor dengan betul.'],
      'Tambah & Tolak':['Tambah bermaksud menggabungkan kuantiti.','Tolak bermaksud mencari beza atau baki.','Semak jawapan dengan operasi songsang.'],
      'Darab & Bahagi':['Darab ialah penambahan berulang.','Bahagi ialah membahagi kepada kumpulan sama banyak.','Fakta asas membantu kira dengan lebih cepat.'],
      'Pecahan':['Pecahan menunjukkan bahagian daripada satu keseluruhan.','Penyebut memberitahu jumlah bahagian sama besar.','Pembilang memberitahu berapa bahagian yang diambil.'],
      'Wang':['Kenal nilai ringgit dan sen.','Jumlahkan harga untuk mencari jumlah bayaran.','Baki = wang dibayar − harga.'],
      'Masa':['Jarum pendek menunjukkan jam.','Jarum panjang menunjukkan minit.','60 minit bersamaan 1 jam.'],
      'Ukuran':['Pilih unit yang sesuai sebelum mengira.','100 cm = 1 m dan 1000 g = 1 kg.','Banding ukuran menggunakan unit yang sama.'],
      'Bentuk & Ruang':['Bentuk mempunyai ciri seperti sisi, bucu dan permukaan.','Bentuk 2D rata; bentuk 3D mempunyai ruang.','Perhatikan ciri sebelum menamakan bentuk.'],
      'Data':['Data boleh disusun dalam jadual atau graf.','Cari maklumat tertinggi, terendah atau jumlah.','Baca label sebelum membuat kesimpulan.']
    },
    bm:{
      'Kosa Kata':['Kosa kata ialah perkataan yang kita faham dan gunakan.','Lihat konteks ayat untuk meneka maksud.','Gunakan perkataan baharu dalam ayat sendiri.'],
      'Tatabahasa':['Ayat biasanya mempunyai subjek dan cerita tentang subjek itu.','Kata nama menamakan orang, benda atau tempat.','Kata kerja menunjukkan perbuatan.'],
      'Ejaan':['Dengar bunyi perkataan mengikut suku kata.','Semak huruf yang hampir sama bunyi.','Baca semula perkataan selepas mengeja.'],
      'Penjodoh Bilangan':['Penjodoh bilangan digunakan bersama kata bilangan dan kata nama.','Contoh: seorang murid, seekor kucing, sebatang pensel.','Pilih berdasarkan jenis benda atau makhluk.'],
      'Simpulan Bahasa':['Simpulan bahasa mempunyai maksud khas, bukan maksud perkataan satu-satu.','Fahami melalui situasi dan contoh ayat.','Gunakan hanya apabila maksudnya sesuai.'],
      'Pemahaman':['Baca soalan dahulu supaya tahu maklumat yang dicari.','Cari bukti dalam petikan.','Jawab menggunakan maklumat, bukan tekaan semata-mata.']
    },
    en:{
      'Vocabulary':['Learn a small group of useful words at a time.','Connect a word with a picture, action or situation.','Use the new word in your own sentence.'],
      'Grammar':['A basic sentence needs a subject and a verb.','Word order changes meaning.','Read the whole sentence before choosing a form.'],
      'Tenses':['Tense tells us when an action happens.','Present: happens now/often. Past: already happened.','Time words can help you choose the tense.'],
      'Prepositions':['Prepositions show position or relationship.','Examples: in, on, under, beside, behind.','Use the picture or situation as a clue.'],
      'Sentence':['Start with who/what, then an action, then more detail.','Use a capital letter at the start.','Finish with suitable punctuation.'],
      'Comprehension':['Read the question first.','Find evidence in the text.','Answer with information from the passage.']
    },
    sci:{
      'Kemahiran Sains':['Perhatikan dengan teliti menggunakan deria atau alat.','Bandingkan, ukur dan rekod apa yang berubah.','Buat kesimpulan berdasarkan bukti.'],
      'Manusia':['Kenal bahagian badan dan fungsinya.','Sistem badan bekerja bersama.','Tabiat sihat membantu badan berfungsi dengan baik.'],
      'Haiwan':['Haiwan mempunyai ciri dan keperluan berbeza.','Banding habitat, makanan dan cara pembiakan.','Klasifikasikan berdasarkan ciri yang boleh diperhatikan.'],
      'Tumbuhan':['Tumbuhan memerlukan air, cahaya dan keadaan sesuai.','Bahagian tumbuhan mempunyai fungsi tertentu.','Perhatikan perubahan semasa tumbuhan membesar.'],
      'Bahan':['Bahan mempunyai sifat berbeza.','Pilih bahan berdasarkan kegunaan dan sifat.','Bandingkan keras/lembut, menyerap/tidak dan sebagainya.'],
      'Tenaga':['Tenaga membolehkan perubahan dan aktiviti berlaku.','Kenal sumber dan bentuk tenaga.','Perhatikan perubahan tenaga dalam situasi harian.'],
      'Bumi & Angkasa':['Perhatikan pola siang, malam dan objek di langit.','Bumi ialah sebahagian daripada sistem yang lebih besar.','Gunakan pemerhatian untuk menerangkan perubahan.'],
      'Teknologi':['Teknologi membantu menyelesaikan masalah.','Reka bentuk yang baik memenuhi fungsi dan keselamatan.','Nilai kelebihan dan kekurangan sesuatu alat.']
    },
    hist:{
      'Diri & Keluarga':['Sejarah diri boleh dilihat melalui kronologi peristiwa.','Sumber seperti gambar dan dokumen membantu mengingati masa lalu.','Susun peristiwa mengikut urutan masa.'],
      'Sekolah & Tempat Tinggal':['Tempat mempunyai sejarah dan identiti.','Cari perubahan dahulu dan sekarang.','Kenal tokoh, bangunan atau peristiwa penting setempat.'],
      'Zaman Prasejarah':['Zaman prasejarah berlaku sebelum rekod tulisan.','Cara hidup berubah mengikut pengetahuan dan alat.','Banding tempat tinggal, kegiatan dan teknologi.'],
      'Kerajaan Melayu':['Kerajaan berkembang melalui pemerintahan, perdagangan dan hubungan.','Kenal lokasi, tokoh dan sumbangan.','Hubungkan sebab dengan perkembangan kerajaan.'],
      'Tokoh & Kemerdekaan':['Tokoh menyumbang melalui tindakan dan kepimpinan.','Kemerdekaan melibatkan usaha dan rundingan.','Susun peristiwa penting secara kronologi.'],
      'Malaysia':['Malaysia mempunyai identiti, simbol dan sistem tersendiri.','Kenal negeri, lambang dan institusi penting.','Hormati kepelbagaian sebagai sebahagian identiti negara.']
    },
    islam:{
      'Akidah':['Akidah berkaitan kepercayaan asas seorang Muslim.','Fahami maksud sebelum menghafal istilah.','Kaitkan kepercayaan dengan sikap dan amalan.'],
      'Ibadah':['Ibadah mempunyai tujuan, tertib dan syarat tertentu.','Belajar langkah mengikut urutan.','Latih melalui situasi harian.'],
      'Sirah':['Sirah mengajar peristiwa dan teladan daripada kehidupan Rasulullah SAW.','Kenal tokoh, tempat dan urutan peristiwa.','Cari pengajaran daripada setiap kisah.'],
      'Akhlak':['Akhlak baik ditunjukkan melalui tindakan.','Fikir kesan tindakan kepada diri dan orang lain.','Pilih contoh yang boleh diamalkan setiap hari.'],
      'Jawi':['Jawi menulis Bahasa Melayu menggunakan huruf berasaskan Arab.','Kenal bentuk huruf dan cara huruf bersambung.','Baca dan bina perkataan sedikit demi sedikit.']
    },
    moral:{
      'Kepercayaan':['Nilai membantu kita membuat pilihan yang baik.','Pertimbangkan prinsip dan akibat tindakan.','Hormati pegangan yang baik dalam kehidupan.'],
      'Hormat':['Hormat ditunjukkan melalui kata dan tindakan.','Dengar, bercakap sopan dan jaga batas.','Pilih tindakan yang menjaga maruah orang lain.'],
      'Tanggungjawab':['Tanggungjawab ialah melaksanakan tugas dengan baik.','Fikir apa yang perlu dibuat tanpa disuruh berulang kali.','Terima akibat pilihan sendiri.'],
      'Kejujuran':['Jujur bermaksud bercakap dan bertindak benar.','Kejujuran membina kepercayaan.','Pilih tindakan benar walaupun sukar.'],
      'Kerjasama':['Kerjasama memerlukan peranan dan komunikasi.','Bantu kumpulan mencapai tujuan bersama.','Hargai sumbangan setiap orang.'],
      'Kasih Sayang':['Kasih sayang ditunjukkan melalui perhatian dan bantuan.','Fikir keperluan orang lain.','Gunakan tindakan yang selamat dan sesuai.']
    },
    pjpk:{
      'Kecergasan':['Badan menjadi lebih cergas melalui aktiviti konsisten.','Pemanasan dan penyejukan membantu keselamatan.','Seimbangkan aktiviti dengan rehat.'],
      'Pemakanan':['Pilih makanan pelbagai dan seimbang.','Air penting untuk badan.','Kenal pilihan yang lebih baik untuk kesihatan.'],
      'Keselamatan':['Kenal bahaya sebelum bertindak.','Ikut peraturan dan gunakan peralatan dengan betul.','Minta bantuan orang dewasa apabila perlu.'],
      'Kebersihan':['Kebersihan membantu mengurangkan risiko penyakit.','Basuh tangan pada masa yang sesuai.','Jaga badan, pakaian dan persekitaran.'],
      'Pergerakan':['Pergerakan asas termasuk berjalan, melompat dan membaling.','Kawal imbangan dan ruang.','Gunakan teknik selamat.'],
      'Kesihatan':['Kesihatan melibatkan fizikal, emosi dan tabiat harian.','Tidur, air dan aktiviti memberi kesan.','Buat pilihan yang menyokong kesejahteraan.']
    },
    pra:{
      'Kenali Huruf':['Lihat bentuk huruf.','Sebut bunyi atau nama huruf.','Cari huruf yang sama dalam perkataan mudah.'],
      'Kenali Nombor':['Kenal simbol nombor.','Padankan nombor dengan kuantiti.','Susun nombor mengikut urutan.'],
      'Lukis':['Pegang dan gerakkan jari dengan terkawal.','Ikut garisan sebelum melukis sendiri.','Cuba bentuk mudah dahulu.'],
      'Mewarna':['Pilih warna dan isi kawasan.','Cuba kekal dalam bentuk.','Sebut nama warna semasa mewarna.'],
      'Ejaan':['Dengar bunyi perkataan.','Pecahkan kepada bahagian mudah.','Padankan huruf dengan bunyi.'],
      'Memory':['Lihat kedudukan gambar.','Ingat pasangan yang sama.','Cuba strategi satu baris demi satu baris.'],
      'Deria & Alam':['Gunakan deria untuk memerhati.','Bandingkan apa yang dilihat, didengar atau disentuh.','Sebut ciri mudah objek di sekeliling.'],
      'Pendengaran':['Dengar sampai habis.','Bezakan bunyi atau perkataan.','Ulang sebut selepas mendengar.'],
      'Susun Nombor':['Cari nombor paling kecil dahulu.','Susun satu demi satu.','Semak urutan selepas siap.'],
      'Kira-kira':['Sentuh atau tunjuk objek satu demi satu.','Sebut nombor semasa mengira.','Nombor terakhir ialah jumlah objek.'],
      'Jam & Masa':['Kenal nombor pada muka jam.','Jarum pendek menunjukkan jam.','Mulakan dengan pukul tepat dahulu.'],
      'Campur-campur':['Cuba aktiviti pendek yang berbeza.','Gunakan lihat, dengar dan sentuh.','Ulang aktiviti yang masih sukar.']
    }
  };
  const SENTENCES={
    bm:[
      {min:1,max:2,prompt:'Bina ayat tentang gambar budak bermain bola.',sentence:'Aiman bermain bola di padang.',keywords:['bermain','bola'],hint:'Mulakan dengan siapa, kemudian perbuatan dan tempat.'},
      {min:1,max:3,prompt:'Bina ayat mudah tentang membaca.',sentence:'Siti membaca buku di perpustakaan.',keywords:['membaca','buku'],hint:'Siapa + buat apa + apa/di mana.'},
      {min:3,max:6,prompt:'Bina ayat yang lebih lengkap tentang kucing.',sentence:'Kucing putih itu tidur di atas sofa.',keywords:['kucing','tidur'],hint:'Tambah satu perkataan yang menerangkan kucing dan satu tempat.'},
      {min:4,max:6,prompt:'Bina ayat menggunakan kata hubung.',sentence:'Aina membawa payung kerana hari hujan.',keywords:['kerana'],hint:'Gabungkan sebab dengan kata hubung “kerana”.'}
    ],
    en:[
      {min:1,max:2,prompt:'Build a sentence about a boy playing football.',sentence:'Aiman plays football at the field.',keywords:['plays','football'],hint:'Who + action + object/place.'},
      {min:1,max:3,prompt:'Build a simple sentence about reading.',sentence:'Siti reads a book in the library.',keywords:['reads','book'],hint:'Start with the person, then the action.'},
      {min:3,max:6,prompt:'Make the sentence more descriptive.',sentence:'The white cat sleeps on the sofa.',keywords:['cat','sleeps'],hint:'Add a describing word and a place.'},
      {min:4,max:6,prompt:'Join an action with a reason.',sentence:'Aina carries an umbrella because it is raining.',keywords:['because'],hint:'Use “because” to explain the reason.'}
    ]
  };
  function notes(subject,topic){const map=TOPIC_NOTES[subject]||{};return map[topic]||[`${topic} boleh dipelajari melalui contoh mudah.`,`Cari idea utama dalam setiap contoh.`,`Cuba terangkan semula dengan perkataan sendiri.`]}
  function makeGuided(subject,topic){
    const n=notes(subject,topic),correct=n[0],alts=[n[1],n[2],`Topik ${topic} hanya perlu dihafal tanpa memahami contoh.`];
    return {question:`Idea manakah paling sesuai untuk mula memahami “${topic}”?`,correct,options:shuffle([correct,...alts.slice(0,3)]),hint:`Cari pilihan yang menerangkan konsep asas, bukan sekadar menghafal.`,explanation:`Betul — ${correct}`};
  }
  function makeConceptCheck(subject,topic){
    const n=notes(subject,topic);return {prompt:`Pilih dua kad yang membantu kamu belajar ${topic}.`,cards:shuffle([{text:n[0],ok:true},{text:n[1],ok:true},{text:'Terus teka tanpa membaca arahan.',ok:false},{text:'Abaikan contoh dan hanya hafal jawapan.',ok:false}])};
  }
  function sentenceActivity(level,subject){
    const y=Math.max(1,+level||1),pool=(SENTENCES[subject]||[]).filter(x=>y>=x.min&&y<=x.max);const task=pick(pool.length?pool:SENTENCES[subject]||SENTENCES.bm);const words=task.sentence.replace(/[.!?]$/,'').split(/\s+/);return {...task,words,shuffled:shuffle(words)};
  }
  function checkWriting(text,subject,level,task){
    const raw=String(text||'').trim(),words=raw.split(/\s+/).filter(Boolean),minWords=Math.min(8,Math.max(3,(+level||1)+2));const first=raw.charAt(0),last=raw.slice(-1);const lower=raw.toLowerCase();const checks=[
      {label:subject==='en'?'Starts with a capital letter':'Bermula dengan huruf besar',ok:/[A-ZÀ-ÖØ-Þ]/.test(first)},
      {label:subject==='en'?'Has ending punctuation':'Ada tanda baca di hujung',ok:/[.!?]/.test(last)},
      {label:subject==='en'?`At least ${minWords} words`:`Sekurang-kurangnya ${minWords} perkataan`,ok:words.length>=minWords},
      {label:subject==='en'?'Uses an important idea from the prompt':'Guna idea penting daripada arahan',ok:(task?.keywords||[]).some(k=>lower.includes(String(k).toLowerCase()))}
    ];
    const score=checks.filter(x=>x.ok).length;
    const feedback=score===4?(subject==='en'?'Great! Your sentence has the key features. Try adding one more useful detail.':'Bagus! Ayat kamu ada ciri asas yang lengkap. Cuba tambah satu maklumat lagi supaya lebih menarik.'):(subject==='en'?'Good attempt. Improve the unchecked items, then read your sentence aloud.':'Cubaan yang baik. Baiki perkara yang belum bertanda, kemudian baca ayat kamu semula.');
    return {checks,score,feedback,wordCount:words.length};
  }
  function getLesson(level,subject,topic){
    const meta=SUBJECT_INTRO[subject]||SUBJECT_INTRO.bm,n=notes(subject,topic);return {level,subject,topic,icon:meta.icon,title:topic==='Campur Semua'?'Asas penting':topic,tone:meta.tone,tip:meta.tip,bullets:n,example:n[0],guided:makeGuided(subject,topic),concept:makeConceptCheck(subject,topic),sentence:['bm','en'].includes(subject)?sentenceActivity(level,subject):null};
  }
  function topics(subject){return C.subjects[subject]?.topics||[]}
  return {getLesson,checkWriting,sentenceActivity,topics};
})();
