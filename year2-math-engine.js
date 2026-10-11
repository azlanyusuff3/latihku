/* LatihKu Tahun 2 Math — original, offline questions inspired by the user's Tahap 1 and DLP worksheets.
   Includes addition, subtraction, multiplication, division, word problems, vertical calculations and two-step KBAT.
   The PDF files themselves are not copied or required at runtime. */
window.LATIH_YEAR2_MATH = (() => {
  const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
  const pick=arr=>arr[rand(0,arr.length-1)];
  const shuffle=arr=>{const r=[...arr];for(let i=r.length-1;i>0;i--){const j=rand(0,i);[r[i],r[j]]=[r[j],r[i]];}return r;};
  const fmt=n=>Number(n).toLocaleString('ms-MY');
  const children=['Aina','Amir','Sara','Hana','Daniel','Mei Ling','Sofia','Ravi','Hakim'];
  const supplies=[['batang pensel','pencils'],['biji guli','marbles'],['keping pelekat','stickers'],['buah buku','books'],['biji gula-gula','sweets'],['biji epal','apples'],['helai kad','cards'],['biji oren','oranges']];
  const plusMinus=['Tambah','Tolak'],timesDivide=['Darab','Bahagi'];
  const special=['Tambah','Tolak','Darab','Bahagi','Soalan Berayat','Bentuk Lazim','KBAT Dua Langkah'];
  const topics=['Campur Semua','Tambah & Tolak','Darab & Bahagi',...special];
  const clamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,n));
  const difficulty=d=>['mudah','sederhana','sukar'].includes(d)?d:(Math.random()<0.6?'mudah':'sederhana');
  function choices(correct,unit=''){
    const v=Number(correct);
    const candidates=[v+1,v-1,v+2,v-2,v+10,v-10,v+5,v-5,v+20,v-20,Math.round(v/10)*10];
    const wrong=[];
    for(const n of shuffle(candidates)){if(n<0||n===v||wrong.includes(n))continue;wrong.push(n);if(wrong.length===3)break;}
    for(let n=1;wrong.length<3;n++){const x=v+n;if(x!==v&&!wrong.includes(x))wrong.push(x);}
    const render=n=>unit==='RM'?'RM'+fmt(n):fmt(n)+(unit?' '+unit:'');
    return {answer:render(v),options:shuffle([render(v),...wrong.slice(0,3).map(render)])};
  }
  function item(op,kind,values,question,correct,why,d,unit=''){
    const ans=choices(correct,unit),concept='tahun2-'+op.toLowerCase()+'-'+kind+'-'+values.join('-');
    return {id:'Y2M-'+Date.now()+'-'+Math.random().toString(36).slice(2,9),
      topic: op==='Tambah'||op==='Tolak'?'Tambah & Tolak':'Darab & Bahagi',
      question,correct:ans.answer,answers:ans.options,
      explanation:why,difficulty:d,concept,itemType:'mcq',qa:'procedural',pdfPattern:true,smart:true,
      source:'LatihKu Tahun 2 — pola latihan Tahap 1/DLP',alignment:'Latihan asal berdasarkan pola bahan rujukan',
      smartSignature:concept
    };
  }
  function amounts(d){
    if(d==='mudah')return [rand(11,79),rand(5,19)];
    if(d==='sederhana')return [rand(110,549),rand(30,249)];
    return [rand(310,699),rand(101,290)];
  }
  function add(d,style){
    const [x,y]=amounts(d),a=x,b=Math.min(y,1000-x),name=pick(children),[unit,en]=pick(supplies);
    if(style==='kbat'){
      const c=rand(3,d==='mudah'?20:85),aa=clamp(a,10,700-c-b),total=aa+b+c;
      return item('Tambah','kbat',[aa,b,c],name+' ada '+aa+' '+unit+'. Dia menerima '+b+' '+unit+' daripada kakak dan '+c+' lagi daripada ibu. Berapakah jumlah '+unit+' sekarang?',total,
        'Langkah 1: '+aa+' + '+b+' = '+(aa+b)+'. Langkah 2: '+(aa+b)+' + '+c+' = '+total+'.',d);
    }
    if(style==='lazim')return item('Tambah','lazim',[a,b],'Kira menggunakan bentuk lazim:\n  '+fmt(a)+'\n+ '+fmt(b)+'\n──────\nBerapakah jumlahnya?',a+b,
      'Susun digit mengikut sa, puluh dan ratus. Tambah dari kanan: '+fmt(a)+' + '+fmt(b)+' = '+fmt(a+b)+'.',d);
    if(style==='kira')return item('Tambah','kira',[a,b],fmt(a)+' + '+fmt(b)+' = ?',a+b,
      'Tambah kedua-dua nombor: '+fmt(a)+' + '+fmt(b)+' = '+fmt(a+b)+'.',d);
    const enMode=rand(1,7)===1;
    const question=enMode
      ?name+' has '+a+' '+en+'. '+name+' gets '+b+' more. How many '+en+' are there altogether?'
      :name+' mempunyai '+a+' '+unit+'. Dia mendapat '+b+' lagi. Berapakah jumlah '+unit+' semuanya?';
    return item('Tambah',enMode?'dlp-ayat':'ayat',[a,b],question,a+b,
      'Perkataan tambah seperti lagi / more dan semuanya / altogether bermaksud tambah. '+a+' + '+b+' = '+(a+b)+'.',d);
  }
  function sub(d,style){
    let [a,b]=amounts(d);a=clamp(a,d==='mudah'?20:101,999);b=Math.min(b,a-rand(style==='kbat'?4:1,Math.min(style==='kbat'?12:10,a-1)));if(b<1)b=1;
    const name=pick(children),[unit,en]=pick(supplies),ans=a-b;
    if(style==='kbat'){
      const c=rand(2,Math.max(2,Math.min(d==='mudah'?12:70,ans-1)));
      return item('Tolak','kbat',[a,b,c],name+' ada '+a+' '+unit+'. Sebanyak '+b+' diberikan kepada rakan dan '+c+' lagi digunakan. Berapakah baki '+unit+'?',a-b-c,
        'Langkah 1: '+a+' − '+b+' = '+(a-b)+'. Langkah 2: '+(a-b)+' − '+c+' = '+(a-b-c)+'.',d);
    }
    if(style==='lazim')return item('Tolak','lazim',[a,b],'Kira menggunakan bentuk lazim:\n  '+fmt(a)+'\n− '+fmt(b)+'\n──────\nBerapakah bakinya?',ans,
      'Susun digit mengikut nilai tempat. Jika tidak cukup, pinjam daripada nilai tempat di kiri. '+a+' − '+b+' = '+ans+'.',d);
    if(style==='kira')return item('Tolak','kira',[a,b],fmt(a)+' − '+fmt(b)+' = ?',ans,
      fmt(a)+' − '+fmt(b)+' = '+fmt(ans)+'.',d);
    const enMode=rand(1,7)===1;
    const question=enMode
      ?name+' has '+a+' '+en+'. '+b+' are given away. How many '+en+' are left?'
      :name+' mempunyai '+a+' '+unit+'. Dia memberikan '+b+' kepada kawannya. Berapakah baki '+unit+'?';
    return item('Tolak',enMode?'dlp-ayat':'ayat',[a,b],question,ans,
      'Perkataan diberikan / given away dan baki / left menandakan tolak. '+a+' − '+b+' = '+ans+'.',d);
  }
  function multiply(d,style){
    const table=pick(d==='mudah'?[2,3,4,5,10]:d==='sederhana'?[2,3,4,5,6,7,8,9,10]:[3,4,5,6,7,8,9,10]);
    const groups=rand(d==='mudah'?2:3,d==='sukar'?12:10),[unit,en]=pick(supplies),who=pick(children);
    const total=groups*table;
    if(style==='kbat'){
      const extra=rand(2,15);
      return item('Darab','kbat',[groups,table,extra],who+' membeli '+groups+' kotak '+unit+'. Setiap kotak mengandungi '+table+' '+unit+'. Kemudian dia mendapat '+extra+' '+unit+' lagi. Berapakah jumlah semuanya?',total+extra,
        'Langkah 1: '+groups+' × '+table+' = '+total+'. Langkah 2: '+total+' + '+extra+' = '+(total+extra)+'.',d);
    }
    if(style==='lazim'||style==='kira')return item('Darab',style,[groups,table],groups+' × '+table+' = ?',total,
      'Ada '+groups+' kumpulan dengan '+table+' item setiap kumpulan. '+groups+' × '+table+' = '+total+'.',d);
    const enMode=rand(1,7)===1;
    const question=enMode
      ?'There are '+groups+' boxes. Each box contains '+table+' '+en+'. How many '+en+' are there in total?'
      :'Ada '+groups+' kotak. Setiap kotak mengandungi '+table+' '+unit+'. Berapakah jumlah '+unit+' semuanya?';
    return item('Darab',enMode?'dlp-ayat':'ayat',[groups,table],question,total,
      'Bilangan kumpulan sama banyak bermaksud darab. '+groups+' × '+table+' = '+total+'.',d);
  }
  function divide(d,style){
    const each=rand(d==='mudah'?2:3,d==='mudah'?9:12);
    const groups=pick(d==='mudah'?[2,3,4,5]:[2,3,4,5,6,7,8,9,10]);
    const total=each*groups,[unit,en]=pick(supplies),name=pick(children);
    if(style==='kbat'){
      const extra=rand(1,Math.max(1,Math.min(each-1,5)));
      return item('Bahagi','kbat',[total,groups,extra],name+' membahagikan '+total+' '+unit+' sama rata kepada '+groups+' orang murid. Setiap murid menggunakan '+extra+' '+unit+'. Berapakah baki '+unit+' bagi setiap murid?',each-extra,
        'Langkah 1: '+total+' ÷ '+groups+' = '+each+' setiap murid. Langkah 2: '+each+' − '+extra+' = '+(each-extra)+'.',d);
    }
    if(style==='lazim'||style==='kira')return item('Bahagi',style,[total,groups],total+' ÷ '+groups+' = ?',each,
      'Bahagi sama rata: '+total+' ÷ '+groups+' = '+each+'. Semak: '+groups+' × '+each+' = '+total+'.',d);
    const enMode=rand(1,7)===1,groupMode=rand(1,2)===1;
    const question=enMode
      ?'Share '+total+' '+en+' equally among '+groups+' children. How many '+en+' does each child receive?'
      :groupMode
        ?'Sebanyak '+total+' '+unit+' dimasukkan ke dalam '+groups+' kotak sama banyak. Berapakah '+unit+' di dalam setiap kotak?'
        :name+' membahagikan '+total+' '+unit+' sama rata kepada '+groups+' orang murid. Berapakah setiap murid dapat?';
    return item('Bahagi',enMode?'dlp-ayat':'ayat',[total,groups],question,each,
      'Sama rata / equally bermaksud bahagi. '+total+' ÷ '+groups+' = '+each+'.',d);
  }
  function mixed(d){
    const [a,b]=amounts(d),start=Math.min(a,850),gain=Math.min(b,999-start),spent=rand(2,Math.max(2,Math.min(80,start+gain-1))),name=pick(children),[unit]=pick(supplies);
    const total=start+gain-spent;
    return item('Tambah','campuran',[start,gain,spent],name+' mempunyai '+start+' '+unit+'. Dia menerima '+gain+' lagi tetapi kemudian memberikan '+spent+' kepada rakannya. Berapakah baki '+unit+'?',total,
      'Langkah 1: '+start+' + '+gain+' = '+(start+gain)+'. Langkah 2: '+(start+gain)+' − '+spent+' = '+total+'.',d);
  }
  function supports(topic){return topics.includes(topic);}
  function makeOne(topic,requested='auto'){
    if(!supports(topic))return null;
    const d=difficulty(requested);
    let op,style;
    if(plusMinus.includes(topic)||timesDivide.includes(topic))op=topic;
    else if(topic==='Tambah & Tolak')op=pick(plusMinus);
    else if(topic==='Darab & Bahagi')op=pick(timesDivide);
    else op=pick([...plusMinus,...timesDivide]);
    if(topic==='KBAT Dua Langkah')style='kbat';
    else if(topic==='Bentuk Lazim')style='lazim';
    else if(topic==='Soalan Berayat')style='ayat';
    else style=pick(['ayat','ayat','kira','lazim','kbat']);
    if(style==='kbat'&&op==='Tambah'&&rand(1,3)===1)return mixed(d);
    return ({Tambah:add,Tolak:sub,Darab:multiply,Bahagi:divide})[op](d,style);
  }
  function makeSet(topic,count,requested='auto',ctx={}){
    if(!supports(topic)||!Number.isInteger(count)||count<0)return [];
    const items=[],seen=new Set(ctx.recentGenerated||[]);
    let attempts=0;
    while(items.length<count&&attempts++<count*90+30){
      const x=makeOne(topic,requested);
      if(x&&!seen.has(x.smartSignature)){items.push(x);seen.add(x.smartSignature);}
    }
    while(items.length<count){const x=makeOne(topic,requested);if(x)items.push(x);else break;}
    return shuffle(items);
  }
  return {supports,makeOne,makeSet,topics,special};
})();