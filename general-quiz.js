// Kuiz General UI — standalone from the school's curriculum and saved quiz engine.
(function installGeneralQuizUI(){
  'use strict';
  function create(api){
    let run=null;
    const F=globalThis.LATIH_FLAGS;
    const esc=api.esc;
    const state=()=>api.getState();
    const flagSvg=(code)=>`<svg class="world-flag-art" viewBox="0 0 640 480" role="img" aria-label="Gambar bendera untuk diteka" focusable="false"><use href="assets/world-flags.svg#fi-${code.toLowerCase()}" width="640" height="480"></use></svg>`;
    function home(){
      const general=state().general,history=general.history||[],last=history[0],active=F.validSession(general.active);
      api.shell(`<section class="general-hero"><div class="general-globe" aria-hidden="true">🌍</div><div><span class="general-eyebrow">KUIZ GENERAL · DUNIA</span><h1>Teka Bendera Negara</h1><p>Tengok bendera dan pilih nama negara yang betul. Ada ${F.count} negara untuk diteroka!</p></div></section>
        ${active?`<button class="general-resume" id="flagResume">▶ Sambung kuiz bendera <span>Soalan ${general.active.i+1} / ${general.active.items.length} →</span></button>`:''}
        <section class="content-section"><div class="section-title"><h2>Pilih Bilangan Soalan</h2></div>
          <div class="general-count-grid">${[[5,'Pantas','⚡'],[10,'Santai','🎯'],[20,'Cabaran','🧠'],[30,'Maraton','🏆']].map(([n,label,icon])=>`<button class="general-count-card" data-flag-count="${n}"><span>${icon}</span><b>${n} Soalan</b><small>${label}</small></button>`).join('')}</div>
          <p class="general-note">Soalan dan pilihan jawapan akan di-random setiap sesi. Bendera tak berulang dalam sesi yang sama. Tiada internet diperlukan selepas app dikemas kini.</p>
        </section>
        <section class="content-section"><div class="section-title"><h2>Prestasi Kuiz General</h2></div>
          <div class="general-stats"><div><b>${history.length}</b><small>Sesi disimpan</small></div><div><b>${last?`${last.score}/${last.total}`:'—'}</b><small>Markah terkini</small></div><div><b>${F.count}</b><small>Negara</small></div></div>
          ${history.length?`<div class="general-history">${history.slice(0,5).map(row=>`<div><span>🌍 ${esc(row.date)}</span><b>${row.score}/${row.total} · ${Math.round(row.score/row.total*100)}%</b></div>`).join('')}</div>`:''}
        </section>`,'general');
      document.querySelectorAll('[data-flag-count]').forEach(b=>b.addEventListener('click',()=>start(Number(b.dataset.flagCount))));
      document.querySelector('#flagResume')?.addEventListener('click',resume);
    }
    function start(count=10){
      const general=state().general;
      run={items:F.makeQuiz(count,general.recent),i:0,score:0,selected:null,answers:[],started:Date.now()};
      general.active=JSON.parse(JSON.stringify(run));
      api.save(true);
      api.navigate('flagQuiz');
    }
    function resume(){
      if(!F.validSession(state().general.active))return home();
      run=JSON.parse(JSON.stringify(state().general.active));
      api.navigate('flagQuiz');
    }
    function question(){
      if(!run)run=F.validSession(state().general.active)?JSON.parse(JSON.stringify(state().general.active)):null;
      if(!run||!F.validSession(run)){state().general.active=null;api.save(true);api.navigate('general');return}
      const item=run.items[run.i],answered=run.selected!==null,correctIndex=item.options.indexOf(item.code);
      const last=run.i===run.items.length-1,pct=Math.round((run.i+1)/run.items.length*100);
      api.app.innerHTML=`<main class="quiz-page general-quiz-page">
        <header class="quiz-top"><button class="icon-btn" id="flagExit" aria-label="Simpan dan keluar kuiz">←</button><div><small>🌍 KUIZ GENERAL</small><b>Teka Bendera Negara</b></div><div class="quiz-counter">${run.i+1} / ${run.items.length}</div></header>
        <div class="quiz-progress" role="progressbar" aria-valuenow="${run.i+1}" aria-valuemin="0" aria-valuemax="${run.items.length}"><i style="width:${pct}%"></i></div>
        <section class="quiz-card"><div class="quiz-meta"><span>🌍 Bendera Dunia</span><span>${F.count} negara</span></div>
          <h1 class="flag-question-title">Ini bendera negara apa?</h1><div class="world-flag-frame">${flagSvg(item.code)}</div>
          <div class="answer-list">${item.options.map((code,idx)=>{
            const cls=!answered?'':idx===correctIndex?'correct':idx===run.selected?'wrong':'dim';
            return `<button class="answer-btn ${cls}" data-flag-answer="${idx}" ${answered?'disabled':''}><span>${String.fromCharCode(65+idx)}</span><b>${esc(F.name(code))}</b>${answered&&idx===correctIndex?'<em>✓</em>':''}</button>`;
          }).join('')}</div>
          ${answered?`<div class="flag-answer-feedback ${run.selected===correctIndex?'good':'bad'}"><b>${run.selected===correctIndex?'✅ Betul!':'📚 Jawapan yang betul:'}</b><span>${esc(F.name(item.code))}</span></div>
            <button class="next-btn" id="flagNext">${last?'Lihat Keputusan':'Soalan Seterusnya →'}</button>`:''}
        </section></main>`;
      document.querySelector('#flagExit').onclick=()=>{saveRun();run=null;api.navigate('general')};
      document.querySelectorAll('[data-flag-answer]').forEach(b=>b.onclick=()=>answer(Number(b.dataset.flagAnswer)));
      document.querySelector('#flagNext')?.addEventListener('click',next);
    }
    function saveRun(){
      state().general.active=run?JSON.parse(JSON.stringify(run)):null;
      api.save(true);
    }
    function answer(idx){
      if(!run||run.selected!==null||!Number.isInteger(idx)||idx<0||idx>3)return;
      const item=run.items[run.i],chosen=item.options[idx],ok=chosen===item.code;
      run.selected=idx;
      run.answers.push({code:item.code,chosen,ok});
      if(ok)run.score++;
      saveRun();
      api.beep(ok);
      question();
    }
    function next(){
      if(!run||run.selected===null)return;
      if(run.i===run.items.length-1)return finish();
      run.i++;run.selected=null;saveRun();question();
    }
    function finish(){
      if(!run||run.answers.length!==run.items.length)return;
      const total=run.items.length,score=run.score,percent=Math.round(score/total*100),xp=score*10+(score===total?50:0);
      const s=state(),g=s.general,now=new Date();
      s.xp+=xp;s.answers+=total;s.correct+=score;
      api.updateStreak();
      g.history.unshift({ts:Date.now(),date:now.toLocaleDateString('ms-MY'),score,total});
      g.history=g.history.slice(0,30);
      g.recent=[...g.recent,...run.items.map(x=>x.code)].slice(-150);
      g.active=null;
      api.save(true);
      run.result={total,score,percent,xp};
      api.navigate('flagResult');
    }
    function result(){
      if(!run?.result){api.navigate('general');return}
      const r=run.result;
      api.app.innerHTML=`<main class="result-page general-result-page"><section class="result-card"><div class="result-icon">${r.percent>=80?'🏆':'🌍'}</div>
        <small>KEPUTUSAN KUIZ GENERAL</small><h1>${r.percent===100?'Hebat! Semua betul!':r.percent>=60?'Syabas!':'Jom cuba lagi!'}</h1>
        <div class="result-score">${r.percent}%</div><p>${r.score} betul daripada ${r.total} soalan · +${r.xp} XP</p>
        <div class="result-actions"><button class="start-btn" id="flagRetry">Kuiz Baharu</button><button class="soft-btn large" id="flagReturn">Kuiz General</button></div></section>
        <section class="answer-review"><div class="section-title"><h2>Semakan Bendera</h2></div>
        ${run.answers.map((a,i)=>`<div class="review-row ${a.ok?'ok':'no'}"><span>${a.ok?'✓':'!'}</span><div><small>Soalan ${i+1}</small>
          <b>${esc(F.name(a.code))}</b><p>Jawapan anda: ${esc(F.name(a.chosen))}${a.ok?'':` · Betul: ${esc(F.name(a.code))}`}</p></div></div>`).join('')}
        </section></main>`;
      document.querySelector('#flagRetry').onclick=()=>start(run.items.length);
      document.querySelector('#flagReturn').onclick=()=>{run=null;api.navigate('general')};
    }
    function progressHTML(){
      const h=state().general.history||[];
      if(!h.length)return '';
      const total=h.reduce((n,r)=>n+r.total,0),correct=h.reduce((n,r)=>n+r.score,0);
      return `<section class="content-section"><div class="section-title"><h2>🌍 Kuiz General</h2></div>
        <div class="general-stats"><div><b>${h.length}</b><small>Sesi</small></div><div><b>${total}</b><small>Soalan</small></div><div><b>${Math.round(correct/total*100)}%</b><small>Ketepatan</small></div></div>
        <button class="general-resume" data-view="general">Main Kuiz Bendera <span>→</span></button></section>`;
    }
    return {home,question,result,progressHTML};
  }
  globalThis.LATIH_GENERAL=Object.freeze({create});
})();
