// Pure General quiz model. School state and school statistics are never mutated here.
(() => {
  'use strict';
  const B=globalThis.LATIH_GENERAL_DATA,F=globalThis.LATIH_FLAGS;
  const categories=B.categories;
  const bank=new Map(B.questions.map(q=>[q.id,q]));
  for(const c of F.countries)bank.set(`flags-${c.code}`,{id:`flags-${c.code}`,category:'flags',question:'Ini bendera negara apa?',code:c.code,correct:c.name,options:F.countries.map(x=>x.name),explanation:`Bendera ini ialah bendera ${c.name}.`});
  const byCategory=Object.fromEntries(categories.map(c=>[c.id,[...bank.values()].filter(q=>q.category===c.id)]));
  const clone=x=>JSON.parse(JSON.stringify(x));
  const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  const hasCategory=id=>Object.hasOwn(byCategory,id);
  function makeQuiz(category,count=10,recent=[]){
    if(!hasCategory(category))throw new Error('Kategori tidak sah');
    count=Number(count);if(![5,10,20,30].includes(count))throw new Error('Bilangan soalan tidak sah');
    const pool=byCategory[category];if(pool.length<count)throw new Error('Bank soalan tidak mencukupi');
    const avoid=new Set(recent);
    return [...shuffle(pool.filter(q=>!avoid.has(q.id))),...shuffle(pool.filter(q=>avoid.has(q.id)))].slice(0,count).map(q=>({id:q.id,options:shuffle([q.correct,...shuffle([...new Set(q.options)].filter(a=>a!==q.correct)).slice(0,3)])}));
  }
  function validSession(s){
    if(!s||!hasCategory(s.category)||!Array.isArray(s.items)||![5,10,20,30].includes(s.items.length)||
      !Number.isInteger(s.i)||s.i<0||s.i>=s.items.length||!Array.isArray(s.answers)||
      !(s.selected===null||Number.isInteger(s.selected)&&s.selected>=0&&s.selected<4)||
      s.answers.length!==s.i+(s.selected===null?0:1)||!Number.isInteger(s.score)||
      new Set(s.items.map(q=>q?.id)).size!==s.items.length)return false;
    if(!s.items.every(item=>{const q=bank.get(item?.id);return q&&q.category===s.category&&Array.isArray(item.options)&&item.options.length===4&&new Set(item.options).size===4&&item.options.includes(q.correct)&&item.options.every(a=>q.options.includes(a))}))return false;
    if(!s.answers.every((a,i)=>{const q=bank.get(s.items[i].id);return a?.id===q.id&&s.items[i].options.includes(a.chosen)&&a.ok===(a.chosen===q.correct)}))return false;
    if(s.selected!==null&&s.answers.at(-1).chosen!==s.items[s.i].options[s.selected])return false;
    return s.score===s.answers.filter(a=>a.ok).length;
  }
  function legacySession(s){
    if(!F.validSession(s))return null;
    const n={...clone(s),category:'flags',items:s.items.map(q=>({id:`flags-${q.code}`,options:q.options.map(F.name)})),answers:s.answers.map(a=>({id:`flags-${a.code}`,chosen:F.name(a.chosen),ok:a.chosen===a.code}))};
    n.score=n.answers.filter(a=>a.ok).length;
    return validSession(n)?n:null;
  }
  function migrate(old){
    const g=old&&typeof old==='object'&&!Array.isArray(old)?clone(old):{};
    g.history=(Array.isArray(g.history)?g.history:[]).filter(r=>r&&Number.isInteger(r.total)&&r.total>0&&Number.isInteger(r.score)&&r.score>=0&&r.score<=r.total).slice(0,100).map(r=>({...r,category:hasCategory(r.category)?r.category:'flags'}));
    g.recent=(Array.isArray(g.recent)?g.recent:[]).map(id=>F.exists(id)?`flags-${id}`:id).filter(id=>bank.has(id)).slice(-500);
    g.active=validSession(g.active)?g.active:legacySession(g.active);
    const validStats=r=>r&&Number.isInteger(r.sessions)&&r.sessions>=0&&Number.isInteger(r.total)&&r.total>=0&&Number.isInteger(r.correct)&&r.correct>=0&&r.correct<=r.total;
    const oldStats=g.stats&&typeof g.stats==='object'&&!Array.isArray(g.stats)?g.stats:{};g.stats=Object.fromEntries(categories.filter(c=>validStats(oldStats[c.id])).map(c=>[c.id,oldStats[c.id]]));
    for(const c of categories)if(!validStats(g.stats[c.id])){const h=g.history.filter(r=>r.category===c.id);g.stats[c.id]={sessions:h.length,total:h.reduce((n,r)=>n+r.total,0),correct:h.reduce((n,r)=>n+r.score,0)}}
    return g;
  }
  globalThis.LATIH_GENERAL_ENGINE=Object.freeze({categories,assets:B.assets,bank,byCategory,hasCategory,makeQuiz,validSession,migrate,question:id=>bank.get(id),meta:id=>categories.find(c=>c.id===id)});
})();
