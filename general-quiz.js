// Visual General quiz UI; all media is local and credited in the asset register.
(() => {
  'use strict';
  function create(api){
    const E=globalThis.LATIH_GENERAL_ENGINE,esc=api.esc,state=()=>api.getState();
    let run=null,category='flags',audio=null;
    function stopAudio(){if(audio){audio.pause();audio.currentTime=0;audio=null}}
    function art(q,review=false){
      if(q.code)return `<svg class="world-flag-art" viewBox="0 0 640 480" role="img" aria-label="Gambar bendera ${review?esc(q.correct):'untuk diteka'}" focusable="false"><use href="assets/world-flags.svg#fi-${q.code.toLowerCase()}" width="640" height="480"></use></svg>`;
      return `<img class="general-question-image" src="${esc(q.image)}" alt="${review?esc(q.correct):'Gambar soalan kuiz'}" ${review?'loading="lazy"':''}>`;
    }
    function home(){
      stopAudio();const g=state().general,h=g.history,active=E.validSession(g.active),totals=Object.values(g.stats).reduce((a,r)=>({sessions:a.sessions+r.sessions,total:a.total+r.total,correct:a.correct+r.correct}),{sessions:0,total:0,correct:0});
      api.shell(`<section class="general-hero"><img src="assets/world-scene.webp" alt="" class="general-cover"><div><span class="general-eyebrow">KUIZ GENERAL</span><h1>Jom Teroka Dunia</h1><p>20 kategori pengetahuan umum. Pilih satu dan mula kuiz visual!</p><small id="generalOfflineStatus" role="status">Menyemak simpanan offline…</small></div></section>
        ${active?`<button class="general-resume" id="generalResume">Sambung ${esc(E.meta(g.active.category).name)} <span>Soalan ${g.active.i+1} / ${g.active.items.length} →</span></button>`:''}
        <section class="content-section"><div class="section-title"><h2>Pilih Kategori</h2></div><div class="general-category-grid">${E.categories.map(c=>`<button class="general-category-card" data-general-category="${c.id}"><div class="general-thumbnail">${art(E.question(c.cover),true)}</div><b>${esc(c.name)}</b><small>${esc(c.description)}</small><span>${E.byCategory[c.id].length} soalan</span></button>`).join('')}</div></section>
        <section class="content-section"><div class="section-title"><h2>Prestasi General</h2></div><div class="general-stats"><div><b>${totals.sessions}</b><small>Sesi</small></div><div><b>${totals.total}</b><small>Soalan dijawab</small></div><div><b>${totals.total?Math.round(totals.correct/totals.total*100)+'%':'—'}</b><small>Ketepatan</small></div></div>
        ${h.length?`<div class="general-history">${h.slice(0,8).map(r=>`<div><span>${esc(E.meta(r.category).name)}<small> · ${esc(r.date||'')}</small></span><b>${r.score}/${r.total}</b></div>`).join('')}</div>`:''}</section>`,'general');
      document.querySelectorAll('[data-general-category]').forEach(b=>b.onclick=()=>setup(b.dataset.generalCategory));
      document.querySelector('#generalResume')?.addEventListener('click',resume);
      offlineStatus();
    }
    async function offlineStatus(){
      const el=document.querySelector('#generalOfflineStatus');if(!el)return;
      try{const cache=await caches.open(`latihku-shell-v${globalThis.LATIH_VERSION}`);const found=await Promise.all(E.assets.map(p=>cache.match(p)));if(el.isConnected)el.textContent=found.every(Boolean)?'Semua kategori tersedia offline.':'Buka dengan internet sehingga update siap untuk main offline.'}catch{if(el.isConnected)el.textContent='Simpanan offline memerlukan PWA pada pelayar yang menyokongnya.'}
    }
    function setup(id){
      stopAudio();category=E.hasCategory(id)?id:'flags';const c=E.meta(category),stats=state().general.stats[category],active=E.validSession(state().general.active);
      api.shell(`<section class="general-hero"><div class="general-setup-cover">${art(E.question(c.cover),true)}</div><div><span class="general-eyebrow">KUIZ GENERAL</span><h1>${esc(c.name)}</h1><p>${esc(c.description)}</p></div></section><button class="soft-btn" id="generalBack">← Semua kategori</button>
        ${active?`<p class="general-note">Kuiz ${esc(E.meta(state().general.active.category).name)} belum selesai. Kuiz baharu akan menggantikannya.</p><button class="general-resume" id="generalResume">Sambung kuiz tersimpan</button>`:''}
        <section class="content-section"><div class="section-title"><h2>Pilih Bilangan Soalan</h2></div><div class="general-count-grid">${[5,10,20,30].map(n=>`<button class="general-count-card" data-general-count="${n}"><b>${n} Soalan</b><small>Mula kuiz →</small></button>`).join('')}</div><p class="general-note">Empat pilihan jawapan, susunan rawak dan penerangan selepas menjawab. ${E.byCategory[category].length} soalan dalam kategori ini.</p></section>
        <div class="general-stats"><div><b>${stats.sessions}</b><small>Sesi kategori</small></div><div><b>${stats.total?Math.round(stats.correct/stats.total*100)+'%':'—'}</b><small>Ketepatan kategori</small></div></div>`,'general');
      document.querySelector('#generalBack').onclick=home;
      document.querySelectorAll('[data-general-count]').forEach(b=>b.onclick=()=>start(Number(b.dataset.generalCount)));
      document.querySelector('#generalResume')?.addEventListener('click',resume);
    }
    function start(count=10){stopAudio();run={category,items:E.makeQuiz(category,count,state().general.recent),i:0,score:0,selected:null,answers:[],started:Date.now()};saveRun();api.navigate('flagQuiz')}
    function resume(){stopAudio();if(!E.validSession(state().general.active))return home();run=JSON.parse(JSON.stringify(state().general.active));category=run.category;api.navigate('flagQuiz')}
    function question(){
      stopAudio();if(!run)run=E.validSession(state().general.active)?JSON.parse(JSON.stringify(state().general.active)):null;
      if(!E.validSession(run)){state().general.active=null;api.save(true);api.navigate('general');return}
      const item=run.items[run.i],q=E.question(item.id),answered=run.selected!==null,correct=item.options.indexOf(q.correct),c=E.meta(run.category);
      api.app.innerHTML=`<main class="quiz-page general-quiz-page"><header class="quiz-top"><button class="icon-btn" id="generalExit" aria-label="Simpan dan keluar">←</button><div><small>KUIZ GENERAL</small><b>${esc(c.name)}</b></div><div class="quiz-counter">${run.i+1} / ${run.items.length}</div></header>
        <div class="quiz-progress" role="progressbar" aria-valuenow="${run.i+1}" aria-valuemin="0" aria-valuemax="${run.items.length}"><i style="width:${(run.i+1)/run.items.length*100}%"></i></div>
        <section class="quiz-card"><h1 class="flag-question-title">${esc(q.question)}</h1><div class="world-flag-frame general-image-frame">${art(q)}</div>
        ${q.audio?`<audio id="generalAudio" controls preload="none" src="${esc(q.audio)}" aria-label="Dengar bunyi haiwan"></audio><p class="general-note">Tekan play untuk dengar. Boleh ulang sebelum menjawab.</p>`:''}
        <p class="general-media-error" hidden role="alert">Gambar tidak dapat dimuatkan. Buka app dengan internet untuk melengkapkan update.</p>
        <div class="answer-list">${item.options.map((a,i)=>`<button class="answer-btn ${!answered?'':i===correct?'correct':i===run.selected?'wrong':'dim'}" data-general-answer="${i}" ${answered?'disabled':''}><span>${String.fromCharCode(65+i)}</span><b>${esc(a)}</b>${answered&&i===correct?'<em>✓</em>':''}</button>`).join('')}</div>
        ${answered?`<div class="flag-answer-feedback ${run.selected===correct?'good':'bad'}" role="status"><b>${run.selected===correct?'Betul!':'Jawapan betul: '+esc(q.correct)}</b><span>${esc(q.explanation)}</span></div><button class="next-btn" id="generalNext">${run.i===run.items.length-1?'Lihat Keputusan':'Soalan Seterusnya →'}</button>`:''}</section></main>`;
      document.querySelector('.general-question-image')?.addEventListener('error',()=>{document.querySelector('.general-media-error').hidden=false});
      audio=document.querySelector('#generalAudio');
      audio?.addEventListener('error',()=>{const el=document.querySelector('.general-media-error');el.textContent='Audio tidak dapat dimuatkan. Buka app dengan internet untuk melengkapkan update.';el.hidden=false});
      document.querySelector('#generalExit').onclick=()=>{stopAudio();saveRun();run=null;api.navigate('general')};
      document.querySelectorAll('[data-general-answer]').forEach(b=>b.onclick=()=>answer(Number(b.dataset.generalAnswer)));
      document.querySelector('#generalNext')?.addEventListener('click',next);
    }
    function saveRun(){state().general.active=run?JSON.parse(JSON.stringify(run)):null;api.save(true)}
    function answer(i){if(!run||run.selected!==null||!Number.isInteger(i)||i<0||i>3)return;const item=run.items[run.i],q=E.question(item.id),chosen=item.options[i],ok=chosen===q.correct;run.selected=i;run.answers.push({id:item.id,chosen,ok});if(ok)run.score++;saveRun();api.beep(ok);question()}
    function next(){if(!run||run.selected===null)return;if(run.i===run.items.length-1)return finish();run.i++;run.selected=null;saveRun();question()}
    function finish(){
      stopAudio();if(!run||run.result||run.answers.length!==run.items.length)return;
      const s=state(),g=s.general,total=run.items.length,score=run.score,xp=score*10+(score===total?50:0);
      s.xp+=xp;s.answers+=total;s.correct+=score;api.updateStreak();
      g.history.unshift({category:run.category,ts:Date.now(),date:new Date().toLocaleDateString('ms-MY'),score,total});g.history=g.history.slice(0,100);
      const stats=g.stats[run.category];stats.sessions++;stats.total+=total;stats.correct+=score;
      g.recent=[...g.recent,...run.items.map(q=>q.id)].slice(-500);g.active=null;
      run.result={total,score,xp,percent:Math.round(score/total*100)};api.save(true);api.navigate('flagResult');
    }
    function result(){
      stopAudio();if(!run?.result){api.navigate('general');return}const r=run.result;
      api.app.innerHTML=`<main class="result-page general-result-page"><section class="result-card"><small>${esc(E.meta(run.category).name)}</small><h1>${r.percent===100?'Hebat! Semua betul!':r.percent>=60?'Syabas!':'Jom cuba lagi!'}</h1><div class="result-score">${r.percent}%</div><p>${r.score} betul daripada ${r.total} soalan · +${r.xp} XP</p><div class="result-actions"><button class="start-btn" id="generalRetry">Cuba Lagi</button><button class="soft-btn large" id="generalReturn">Semua Kategori</button></div></section>
        <section class="answer-review"><div class="section-title"><h2>Semakan Jawapan</h2></div>${run.answers.map((a,i)=>{const q=E.question(a.id);return `<div class="review-row general-review ${a.ok?'ok':'no'}"><div class="general-review-image">${art(q,true)}</div><div><small>Soalan ${i+1} · ${a.ok?'Betul':'Salah'}</small><b>${esc(q.question)}</b><p>Jawapan anda: ${esc(a.chosen)} · Betul: ${esc(q.correct)}</p><small>${esc(q.explanation)}</small></div></div>`}).join('')}</section></main>`;
      document.querySelector('#generalRetry').onclick=()=>{category=run.category;start(run.items.length)};
      document.querySelector('#generalReturn').onclick=()=>{run=null;api.navigate('general')};
    }
    function progressHTML(){const stats=Object.values(state().general.stats).reduce((a,r)=>({sessions:a.sessions+r.sessions,total:a.total+r.total,correct:a.correct+r.correct}),{sessions:0,total:0,correct:0});if(!stats.sessions)return '';return `<section class="content-section"><div class="section-title"><h2>Kuiz General</h2></div><div class="general-stats"><div><b>${stats.sessions}</b><small>Sesi</small></div><div><b>${stats.total}</b><small>Soalan</small></div><div><b>${Math.round(stats.correct/stats.total*100)}%</b><small>Ketepatan</small></div></div><button class="general-resume" data-view="general">Teroka Semua Kategori <span>→</span></button></section>`}
    return {home,question,result,progressHTML};
  }
  globalThis.LATIH_GENERAL=Object.freeze({create});
})();
