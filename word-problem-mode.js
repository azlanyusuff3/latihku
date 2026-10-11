/* Guided learning interface: understand the story -> build equation -> solve.
   Plain JavaScript, offline, and stored alongside existing LatihKu data. */
window.LATIH_WORD_MODE = (() => {
  const types=['Tambah','Tolak','Darab','Bahagi'];
  function create(api){
    let page='home',lastResult=null;
    const esc=api.esc;
    const setState=()=>api.getState();
    const select=(s)=>document.querySelector(s);
    const buttons=(s)=>document.querySelectorAll(s);
    function current(){return setState().wordProblems.active;}
    function goHome(){page='home';render();}
    function home(){
      const state=setState(),active=current(),year=state.prefs.level,history=state.wordProblems.history||[];
      if(!['1','2','3','4','5','6'].includes(String(year))){api.gotoPractice();return;}
      const last=history[0];
      const yearLabel='Tahun '+year;
      api.shell('<section class="wp-heading"><span class="eyebrow">MATEMATIK '+esc(yearLabel.toUpperCase())+'</span>'+
        '<h1>Fahami Soalan Berayat</h1><p>Belajar baca cerita dahulu, pilih operasi, bina ayat matematik, kemudian kira jawapan.</p></section>'+
        '<section class="wp-method"><h2>3 Langkah Mudah</h2>'+
        '<div class="wp-method-grid"><div><b>1</b><strong>Fahami cerita</strong><span>Apa yang berlaku pada bilangan?</span></div>'+
        '<div><b>2</b><strong>Bina ayat matematik</strong><span>Pilih operasi dan susun nombor.</span></div>'+
        '<div><b>3</b><strong>Kira jawapan</strong><span>Semak pengiraan dan maksud jawapan.</span></div></div></section>'+
        '<section class="wp-tip"><strong>Tip penting</strong><p>Jangan hafal perkataan sahaja. Contohnya, perkataan "lebih" boleh bermaksud mencari jumlah atau mencari beza, bergantung pada cerita.</p></section>'+
        (active?'<section class="wp-panel"><h2>Sesi yang belum selesai</h2><p>'+esc('Tahun '+active.level+' · Soalan '+(active.index+1)+' daripada '+active.items.length)+
          '</p><button class="start-btn" id="wpResume">Sambung sesi</button></section>':'')+
        '<section class="wp-panel"><h2>Mula latihan baharu</h2><p>Setiap soalan mempunyai 3 langkah dengan penerangan jika tersalah.</p>'+
        '<div class="wp-count" role="group" aria-label="Bilangan soalan berpandu">'+
        [5,10,20,30,50].map(n=>'<button data-wp-count="'+n+'" class="'+(state.wordProblems.count===n?'active':'')+'" aria-pressed="'+(state.wordProblems.count===n)+'">'+n+'</button>').join('')+
        '</div><button class="start-btn" id="wpStart">Mula '+state.wordProblems.count+' Soalan →</button></section>'+
        (last?'<section class="wp-panel"><h2>Prestasi Terakhir</h2><p>Tahun '+esc(last.level)+' · '+last.independent+' daripada '+last.total+' soalan dijawab dengan tepat pada cubaan pertama untuk ketiga-tiga langkah.</p></section>':'')+
        '<div class="wp-actions"><button class="soft-btn large" id="wpBack">← Kembali ke Latihan</button></div>','practice');
      buttons('[data-wp-count]').forEach(b=>b.onclick=()=>{
        state.wordProblems.count=Number(b.dataset.wpCount);api.save(true);home();
      });
      select('#wpStart').onclick=()=>{
        if(active&&!confirm('Mula set baharu? Sesi berpandu belum selesai akan diganti.'))return;
        state.wordProblems.active={level:String(year),
          items:window.LATIH_WORD_PROBLEMS.makeSet(year,state.wordProblems.count),
          index:0,step:0,attempts:[0,0,0],feedback:null,results:[],startedAt:Date.now()};
        api.save(true);page='questions';render();
      };
      const resume=select('#wpResume');if(resume)resume.onclick=()=>{page='questions';render();};
      select('#wpBack').onclick=api.gotoPractice;
    }
    function choicesFor(item,step){return step===0?types:step===1?item.equations:item.answers;}
    function correctFor(item,step){return step===0?item.operation:step===1?item.equation:item.answer;}
    function question(){
      const run=current();if(!run||!window.LATIH_WORD_PROBLEMS.validActive(run)){page='home';home();return;}
      const item=run.items[run.index],step=run.step,feedback=run.feedback;
      const options=choicesFor(item,step),correct=correctFor(item,step),prompt=[
        'Apakah operasi yang sesuai untuk cerita ini?',
        'Pilih ayat matematik yang mewakili cerita.',
        'Berapakah jawapan pengiraan?'
      ][step];
      const thought=step===0?'Baca dan fikir: bilangan bertambah, berkurang, berulang sama banyak atau dibahagi kepada kumpulan?':
        step===1?item.thought:'Kira ayat matematik yang telah dipilih. Semak jawapan dengan cerita.';
      api.shell('<section class="wp-heading"><span class="eyebrow">TAHUN '+esc(run.level)+' · LATIHAN BERAYAT</span>'+
        '<h1>Fahami cerita, bukan hafal petunjuk</h1></section>'+
        '<section class="wp-question"><div class="wp-progress"><b>Soalan '+(run.index+1)+' / '+run.items.length+
        '</b><span>Langkah '+(step+1)+' daripada 3</span></div>'+
        '<div class="wp-progress-track"><i style="width:'+Math.round((run.index+step/3)/run.items.length*100)+'%"></i></div>'+
        '<div class="wp-story"><small>BACA CERITA</small><p>'+esc(item.story)+'</p></div>'+
        '<div class="wp-steps">'+['1. Fahami','2. Bina ayat','3. Kira'].map((t,i)=>
          '<span class="'+(i===step?'current':i<step?'completed':'')+'">'+esc(t)+'</span>').join('')+'</div>'+
        '<div class="wp-tip inline"><strong>Petunjuk memahami cerita</strong><p>'+esc(thought)+'</p></div>'+
        (step>=1?'<div class="wp-number-model"><div><span>'+esc(item.operation==='Darab'?'Bilangan kumpulan':'Bilangan pertama')+'</span><strong>'+esc(item.a.toLocaleString('ms-MY'))+'</strong></div>'+
          '<div><span>'+esc(item.operation==='Darab'?'Setiap kumpulan':item.operation==='Bahagi'?'Bilangan kumpulan':'Bilangan kedua')+'</span><strong>'+esc(item.b.toLocaleString('ms-MY'))+'</strong></div></div>':'')+
        (step===2?'<div class="wp-equation">'+esc(item.equation)+'</div>':'')+
        '<h2>'+esc(prompt)+'</h2><div class="wp-option-grid">'+options.map((value,i)=>{
          const selected=feedback&&feedback.index===i,wasCorrect=feedback&&feedback.ok&&value===correct;
          const cls=wasCorrect?'correct':selected&&!feedback.ok?'incorrect':'';
          return '<button class="wp-choice '+cls+'" data-wp-option="'+i+'" '+(feedback&&feedback.ok?'disabled':'')+'><span>'+String.fromCharCode(65+i)+'</span><b>'+esc(value)+'</b></button>';
        }).join('')+'</div>'+
        (feedback?'<div class="wp-feedback '+(feedback.ok?'correct':'incorrect')+'" role="status" aria-live="polite">'+
          '<strong>'+(feedback.ok?'Betul! Bagus, kamu faham.':'Belum tepat. Mari fahami cerita dahulu.')+'</strong>'+
          '<p>'+esc(step===0?item.reason:step===1?item.thought+' Ayat matematik yang betul: '+item.equation:'Cara kira: '+item.explanation+'. '+item.reason)+'</p></div>':'')+
        (feedback&&feedback.ok?'<button class="start-btn wp-next" id="wpNext">'+(step===2?(run.index===run.items.length-1?'Lihat keputusan':'Soalan seterusnya →'):'Langkah seterusnya →')+'</button>':'')+
        '</section><div class="wp-actions"><button class="soft-btn large" id="wpExit">← Simpan dan keluar</button></div>','practice');
      buttons('[data-wp-option]').forEach(b=>b.onclick=()=>choose(Number(b.dataset.wpOption)));
      const next=select('#wpNext');if(next)next.onclick=advance;
      select('#wpExit').onclick=()=>{api.save(true);goHome();};
    }
    function choose(index){
      const run=current();if(!run||!window.LATIH_WORD_PROBLEMS.validActive(run)||run.feedback?.ok)return;
      const item=run.items[run.index],options=choicesFor(item,run.step),correct=correctFor(item,run.step);
      if(!Number.isInteger(index)||index<0||index>=options.length)return;
      run.attempts[run.step]++;
      const ok=options[index]===correct;
      run.feedback={ok,index};
      api.save(true);
      if(api.beep)api.beep(ok);
      question();
    }
    function advance(){
      const run=current();if(!run||!run.feedback?.ok)return;
      if(run.step<2){
        run.step++;run.feedback=null;api.save(true);question();return;
      }
      const q=run.items[run.index],independent=run.attempts.every(x=>x===1);
      run.results.push({id:q.id,story:q.story,operation:q.operation,independent,attempts:run.attempts.slice(),topic:'Fahami Soalan Berayat',ok:independent});
      if(run.index+1<run.items.length){
        run.index++;run.step=0;run.attempts=[0,0,0];run.feedback=null;api.save(true);question();return;
      }
      const total=run.items.length,independentCount=run.results.filter(x=>x.independent).length;
      lastResult={level:run.level,total,independent:independentCount,guided:total-independentCount,
        date:new Date().toLocaleDateString('ms-MY'),ts:Date.now(),results:run.results.slice()};
      const state=setState();
      state.wordProblems.history.unshift({level:lastResult.level,total,independent:independentCount,date:lastResult.date,ts:lastResult.ts});
      state.wordProblems.history=state.wordProblems.history.slice(0,50);
      state.wordProblems.active=null;
      api.onFinished(lastResult);api.save(true);page='result';result();
    }
    function result(){
      const r=lastResult;if(!r){goHome();return;}
      const pct=Math.round(r.independent/r.total*100);
      api.shell('<section class="wp-result"><span class="eyebrow">LATIHAN SELESAI</span>'+
        '<h1>Bagus, kamu sudah faham '+r.total+' cerita!</h1>'+
        '<div class="wp-result-number">'+pct+'%</div><p><b>'+r.independent+' soalan</b> selesai tanpa bantuan daripada '+r.total+'.</p>'+
        '<p>'+r.guided+' soalan diselesaikan selepas mendapat petunjuk. Ulang latihan untuk lebih yakin!</p>'+
        '<div class="wp-result-options"><button class="start-btn" id="wpAgain">Buat Set Baharu</button>'+
        '<button class="soft-btn large" id="wpDone">Kembali ke Latihan</button></div></section>','practice');
      select('#wpAgain').onclick=()=>{page='home';home();};
      select('#wpDone').onclick=api.gotoPractice;
    }
    function render(){if(page==='questions'&&current())return question();if(page==='result'&&lastResult)return result();return home();}
    return {render};
  }
  return {create};
})();