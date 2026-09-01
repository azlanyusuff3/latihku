window.LATIH_PRA = (() => {
  const activities = [
    {id:'mix',icon:'🎲',name:'Campur-campur',desc:'Pelbagai aktiviti ringkas',kind:'quiz',topic:'Campur Semua',accent:'violet'},
    {id:'letters',icon:'🔤',name:'Kenali huruf',desc:'Huruf besar, kecil & bunyi awal',kind:'quiz',topic:'Kenali Huruf',accent:'blue'},
    {id:'numbers',icon:'🔢',name:'Kenali nombor',desc:'Nombor, kira & banding',kind:'quiz',topic:'Kenali Nombor',accent:'green'},
    {id:'draw',icon:'✍️',name:'Lukis',desc:'Sample atau canvas kosong · brush, eraser & undo',kind:'draw',accent:'orange'},
    {id:'color',icon:'🎨',name:'Mewarna',desc:'Pilih sample line-art dan tap untuk warnakan',kind:'color',accent:'pink'},
    {id:'spelling',icon:'✏️',name:'Ejaan',desc:'Kenal ejaan mudah',kind:'quiz',topic:'Ejaan',accent:'yellow'},
    {id:'memory',icon:'🧠',name:'Memory',desc:'Cari pasangan gambar yang sama',kind:'memory',accent:'violet'},
    {id:'senses',icon:'🌿',name:'Deria & Alam',desc:'Tubuh, haiwan & alam sekitar',kind:'quiz',topic:'Deria & Alam',accent:'green'},
    {id:'listen',icon:'👂',name:'Pendengaran',desc:'Dengar dan pilih perkataan',kind:'listen',accent:'blue'},
    {id:'order',icon:'↕️',name:'Susun nombor',desc:'Susun kecil ke besar',kind:'order',accent:'orange'},
    {id:'counting',icon:'➕',name:'Kira-kira',desc:'Tambah & tolak asas',kind:'quiz',topic:'Kira-kira',accent:'pink'},
    {id:'time',icon:'🕐',name:'Jam & Masa',desc:'Kenal waktu & jam mudah',kind:'quiz',topic:'Jam & Masa',accent:'blue'}
  ];
  const listenWords = [
    {say:'ayam',answer:'🐔 Ayam',choices:['🐔 Ayam','🐟 Ikan','🐱 Kucing','🍎 Epal']},
    {say:'bola',answer:'⚽ Bola',choices:['⚽ Bola','📘 Buku','🏠 Rumah','🌸 Bunga']},
    {say:'ikan',answer:'🐟 Ikan',choices:['🐟 Ikan','🐘 Gajah','🍌 Pisang','🥛 Susu']},
    {say:'rumah',answer:'🏠 Rumah',choices:['🏠 Rumah','🚗 Kereta','🌳 Pokok','⭐ Bintang']},
    {say:'buku',answer:'📘 Buku',choices:['📘 Buku','⚽ Bola','🍎 Epal','🐰 Arnab']},
    {say:'susu',answer:'🥛 Susu',choices:['🥛 Susu','🍞 Roti','🍌 Pisang','💧 Air']},
    {say:'bunga',answer:'🌸 Bunga',choices:['🌸 Bunga','🌙 Bulan','☀️ Matahari','☁️ Awan']},
    {say:'epal',answer:'🍎 Epal',choices:['🍎 Epal','🍊 Oren','🍌 Pisang','🍍 Nanas']}
  ];
  const drawPrompts=['A','B','C','M','S','1','2','3','○','△','□','☆'];
  const memoryEmoji=['🍎','🐱','⭐','🚗','🌸','🐟','🍌','⚽'];
  const shuffle=a=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
  function byId(id){return activities.find(a=>a.id===id)||activities[0]}
  function memoryDeck(pairs=6){const items=shuffle(memoryEmoji).slice(0,pairs);return shuffle([...items,...items]).map((emoji,i)=>({id:i,emoji,key:emoji}))}
  function listenSet(count=5){return shuffle(listenWords).slice(0,Math.min(count,listenWords.length)).map(x=>({...x,choices:shuffle(x.choices)}))}
  function orderRound(){const nums=shuffle(Array.from({length:20},(_,i)=>i+1)).slice(0,4).sort((a,b)=>a-b);return {target:nums,choices:shuffle(nums)}}
  function drawPrompt(){return drawPrompts[Math.floor(Math.random()*drawPrompts.length)]}
  return {activities,byId,memoryDeck,listenSet,orderRound,drawPrompt,shuffle};
})();
