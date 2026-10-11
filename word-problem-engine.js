/* LatihKu — guided word problems for SK Tahun 1–6.
   All examples are original and generated offline. */
window.LATIH_WORD_PROBLEMS = (() => {
  const operations=['Tambah','Tolak','Darab','Bahagi'];
  const symbols={Tambah:'+',Tolak:'−',Darab:'×',Bahagi:'÷'};
  const kids=['Aina','Amir','Sara','Hana','Daniel','Mei Ling','Ravi','Hakim'];
  const goods=[
    {unit:'biji epal',short:'epal'},
    {unit:'batang pensel',short:'pensel'},
    {unit:'keping pelekat',short:'pelekat'},
    {unit:'biji guli',short:'guli'},
    {unit:'buah buku',short:'buku'},
    {unit:'biji oren',short:'oren'},
    {unit:'keping kad',short:'kad'},
    {unit:'biji gula-gula',short:'gula-gula'}
  ];
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const rnd=(min,max)=>min+Math.floor(Math.random()*(max-min+1));
  const shuffle=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
  const fmt=n=>Number(n).toLocaleString('ms-MY');
  const limits={1:100,2:1000,3:10000,4:100000,5:1000000,6:1000000};
  const choices=(answer,wrong)=>shuffle([answer,...shuffle(wrong.filter(v=>v!==answer)).slice(0,3)]);
  function calculation(op,a,b){
    return op==='Tambah'?a+b:op==='Tolak'?a-b:op==='Darab'?a*b:a/b;
  }
  function numbers(year,op,diff){
    const max=limits[year];
    const harder=diff==='sukar';
    if(op==='Tambah'){
      const cap=year<=2?(harder?Math.floor(max*.8):Math.floor(max*.5)):(harder?max-1:Math.floor(max*.55));
      const a=rnd(year===1?8:Math.max(12,Math.floor(cap*.2)),cap);
      const b=rnd(2,Math.max(3,Math.min(cap,max-a)));
      return [a,b];
    }
    if(op==='Tolak'){
      const cap=harder?max:Math.floor(max*.7);
      const a=rnd(year===1?15:Math.max(20,Math.floor(cap*.3)),cap);
      return [a,rnd(2,a-1)];
    }
    if(op==='Darab'){
      const perMax=year===1?5:year===2?10:year===3?12:harder?50:12;
      const groupsMax=year===1?5:year===2?10:year===3?12:harder?20:12;
      let a=rnd(2,groupsMax),b=rnd(2,perMax);
      while(a*b>max){a=Math.max(2,Math.floor(a/2));b=Math.max(2,Math.floor(b/2));}
      return [a,b];
    }
    const groupMax=year===1?5:year===2?10:year===3?12:harder?20:12;
    const eachMax=year===1?5:year===2?10:year===3?12:harder?60:12;
    const groups=rnd(2,groupMax),each=rnd(2,eachMax);
    return [groups*each,groups];
  }
  function makeOne(level,op,requested='auto'){
    const year=Math.min(6,Math.max(1,Number(level)||1));
    const d=requested==='sukar'?'sukar':requested==='mudah'?'mudah':Math.random()<.25?'sukar':'mudah';
    const operation=operations.includes(op)?op:pick(operations);
    const pair=numbers(year,operation,d),a=pair[0],b=pair[1],ans=calculation(operation,a,b);
    const child=pick(kids),thing=pick(goods),name=thing.short,unit=thing.unit,variation=rnd(0,2);
    let story='',reason='',thought='';
    if(operation==='Tambah'){
      if(variation===0)story=child+' ada '+fmt(a)+' '+unit+'. Ibu memberinya '+fmt(b)+' '+unit+' lagi. Berapakah jumlah '+name+' '+child+' sekarang?';
      if(variation===1)story='Di perpustakaan terdapat '+fmt(a)+' '+unit+'. Sebanyak '+fmt(b)+' '+unit+' lagi diterima. Berapakah jumlah '+name+' selepas itu?';
      if(variation===2)story=child+' mengumpul '+fmt(a)+' '+unit+' pada hari Isnin dan '+fmt(b)+' '+unit+' pada hari Selasa. Berapakah jumlah yang dikumpul?';
      thought='Dua bilangan digabungkan menjadi satu jumlah.';
      reason='Bilangan asal bertambah atau dua kumpulan digabungkan. Kita mencari jumlah keseluruhan.';
    }else if(operation==='Tolak'){
      if(variation===0)story=child+' mempunyai '+fmt(a)+' '+unit+'. Dia memberikan '+fmt(b)+' '+unit+' kepada rakannya. Berapakah baki '+name+'?';
      if(variation===1)story='Terdapat '+fmt(a)+' '+unit+' di sebuah kedai. Sebanyak '+fmt(b)+' telah dijual. Berapakah '+name+' yang tinggal?';
      if(variation===2)story=child+' memiliki '+fmt(a)+' '+unit+' manakala '+pick(kids)+' mempunyai '+fmt(b)+' '+unit+'. Berapakah beza bilangan mereka?';
      thought='Kita mencari baki atau perbezaan daripada satu jumlah.';
      reason='Sebahagian diambil daripada jumlah asal, atau dua bilangan dibandingkan untuk mencari beza.';
    }else if(operation==='Darab'){
      if(variation===0)story='Ada '+fmt(a)+' kotak '+name+'. Setiap kotak mengandungi '+fmt(b)+' '+unit+'. Berapakah jumlah '+name+' dalam semua kotak?';
      if(variation===1)story='Sebanyak '+fmt(a)+' orang murid menerima '+fmt(b)+' '+unit+' seorang. Berapakah jumlah '+name+' yang diperlukan?';
      if(variation===2)story=child+' menyusun '+fmt(a)+' baris '+name+'. Setiap baris ada '+fmt(b)+' '+unit+'. Berapakah jumlah '+name+'?';
      thought='Ada '+fmt(a)+' kumpulan, setiap kumpulan mempunyai '+fmt(b)+' item.';
      reason='Bilangan kumpulan sama banyak berulang. Darab mengira jumlah untuk semua kumpulan.';
    }else{
      if(variation===0)story=child+' membahagikan '+fmt(a)+' '+unit+' sama rata kepada '+fmt(b)+' orang murid. Berapakah yang diterima oleh setiap murid?';
      if(variation===1)story='Sebanyak '+fmt(a)+' '+unit+' dimasukkan sama banyak ke dalam '+fmt(b)+' kotak. Berapakah '+name+' dalam setiap kotak?';
      if(variation===2)story='Terdapat '+fmt(a)+' '+unit+'. Setiap kumpulan memerlukan '+fmt(b)+' '+unit+'. Berapakah kumpulan lengkap yang boleh dibentuk?';
      thought=variation===2?'Jumlah item dibahagi mengikut saiz setiap kumpulan.':'Satu jumlah dikongsi kepada '+fmt(b)+' kumpulan sama banyak.';
      reason=variation===2?'Kita perlu menentukan bilangan kumpulan daripada jumlah dan saiz setiap kumpulan.':'Satu jumlah dibahagi sama rata; kita mencari bilangan bagi setiap kumpulan.';
    }
    const answer=fmt(ans),equation=fmt(a)+' '+symbols[operation]+' '+fmt(b)+' = ?';
    const equations=shuffle(operations.map(x=>fmt(a)+' '+symbols[x]+' '+fmt(b)+' = ?'));
    const numeric=[ans+1,ans-1,ans+2,Math.max(0,ans-2),ans+10,Math.max(0,ans-10),a+b,a-b,a*b,a/b,ans+5,Math.max(0,ans-5)]
      .filter(x=>Number.isInteger(x)&&x>=0&&x!==ans);
    const unique=[...new Set(numeric)];
    for(let n=1;unique.length<3;n++)if(!unique.includes(ans+n))unique.push(ans+n);
    const answers=choices(answer,unique.map(fmt));
    return {
      id:'WORD-'+year+'-'+operation+'-'+Math.random().toString(36).slice(2,11),
      level:String(year),operation,story,a,b,answer,correct:answer,
      equation,equations,answers,reason,thought,
      explanation:equation.replace('?',answer),
      source:'LatihKu Original — latihan kefahaman ayat',topic:'Fahami Soalan Berayat',
      difficulty:d,variation,unit
    };
  }
  function makeSet(level,count=10,difficulty='auto'){
    const year=Number(level);if(!Number.isInteger(year)||year<1||year>6||!Number.isInteger(count)||count<1||count>50)return [];
    const types=shuffle(Array.from({length:count},(_,i)=>operations[i%4]));
    const items=[],seen=new Set();let guard=0;
    for(let i=0;i<count;i++){
      let q;do{q=makeOne(year,types[i],difficulty);guard++;}while(seen.has(q.story)&&guard<count*50);
      seen.add(q.story);items.push(q);
    }
    return items;
  }
  function validItem(q){
    return !!q&&typeof q.story==='string'&&q.story.length>20&&operations.includes(q.operation)&&
      Number(q.level)>=1&&Number(q.level)<=6&&Number.isInteger(q.a)&&Number.isInteger(q.b)&&
      Number.isInteger(calculation(q.operation,q.a,q.b))&&calculation(q.operation,q.a,q.b)>=0&&
      fmt(calculation(q.operation,q.a,q.b))===q.answer&&
      q.equation===fmt(q.a)+' '+symbols[q.operation]+' '+fmt(q.b)+' = ?'&&
      Array.isArray(q.equations)&&q.equations.length===4&&new Set(q.equations).size===4&&q.equations.includes(q.equation)&&
      Array.isArray(q.answers)&&q.answers.length===4&&new Set(q.answers).size===4&&q.answers.includes(q.answer)&&
      typeof q.reason==='string'&&q.reason.length>5;
  }
  function validActive(a){
    if(!a||!Array.isArray(a.items)||!Number.isInteger(a.index)||a.index<0||a.index>=a.items.length||
      !Number.isInteger(a.step)||a.step<0||a.step>2||a.items.length>50||!a.items.length||
      !Array.isArray(a.attempts)||a.attempts.length!==3||a.attempts.some(n=>!Number.isInteger(n)||n<0||n>100)||
      !Array.isArray(a.results)||a.results.length!==a.index||a.results.some(x=>!x||typeof x.independent!=='boolean'))return false;
    return a.items.every(validItem);
  }
  function migrate(input){
    const s=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
    return {active:validActive(s.active)?s.active:null,
      history:Array.isArray(s.history)?s.history.filter(x=>x&&Number.isInteger(x.total)&&Number.isInteger(x.independent)&&x.total>0&&x.independent>=0&&x.independent<=x.total).slice(0,50):[],
      count:[5,10,20,30,50].includes(s.count)?s.count:10};
  }
  return {operations,symbols,makeOne,makeSet,validItem,validActive,migrate};
})();