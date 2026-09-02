window.LATIH_VISUAL_EXPLAIN=(()=>{
  const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const n=s=>Number(String(s??'').replace(/[^0-9.-]/g,''));
  const fmt=x=>Number(x).toLocaleString('ms-MY');
  const places=['Sa','Puluh','Ratus','Ribu','Puluh ribu','Ratus ribu','Juta'];
  const concept=item=>String(item?.concept||'').replace(/-short$/,'');
  const chosenValue=(item,ctx)=>ctx?.chosen??'';
  const answerPill=(item,ctx)=>`<div class="vx-answer-row">${ctx?.chosen!==undefined&&ctx?.chosen!==''?`<span class="vx-wrong">✕ ${esc(chosenValue(item,ctx))}</span>`:''}<span class="vx-correct">✓ ${esc(item.correct)}</span></div>`;
  const dots=(count,cls='')=>Array.from({length:Math.max(0,Math.min(count,20))},()=>`<i class="${cls}"></i>`).join('');

  function placeBlocks(value){
    value=Math.max(0,Math.trunc(value)); const tens=Math.floor(value/10), ones=value%10;
    return `<div class="vx-base10"><div class="vx-tens">${Array.from({length:Math.min(tens,12)},()=>'<i></i>').join('')}</div><div class="vx-ones">${dots(ones)}</div></div>`;
  }
  function columnNumber(x){return String(Math.abs(Math.trunc(x))).split('').map(d=>`<b>${d}</b>`).join('')}

  function addition(a,b,item,ctx){
    const ans=a+b, low=+(ctx?.level||0)<=2;
    const A=String(a).split('').reverse().map(Number),B=String(b).split('').reverse().map(Number);let carry=0,steps=[];
    const L=Math.max(A.length,B.length);
    for(let i=0;i<L;i++){
      const x=A[i]||0,y=B[i]||0,total=x+y+carry,out=total%10,next=Math.floor(total/10);
      steps.push(`<div class="vx-step vx-delay-${Math.min(i,4)}"><span class="vx-place">${places[i]||''}</span><strong>${carry?`<em>${carry}</em> + `:''}${x} + ${y} = ${total}</strong><div class="vx-step-result"><b>${out}</b>${next?`<i class="vx-carry">${next} ↑</i>`:''}</div></div>`);carry=next;
    }
    if(carry)steps.push(`<div class="vx-step vx-delay-4"><span class="vx-place">${places[L]||''}</span><strong>${carry}</strong><div class="vx-step-result"><b>${carry}</b></div></div>`);
    return `<div class="vx-math"><div class="vx-equation"><span>${fmt(a)}</span><i>+</i><span>${fmt(b)}</span><i>=</i><strong>${fmt(ans)}</strong></div>${low&&a<=99&&b<=99?`<div class="vx-concrete"><div>${placeBlocks(a)}<small>${fmt(a)}</small></div><span class="vx-move">➜</span><div>${placeBlocks(b)}<small>${fmt(b)}</small></div></div>`:''}<div class="vx-column"><div class="vx-stack"><div>${columnNumber(a)}</div><div class="vx-opline"><span>+</span>${columnNumber(b)}</div><hr><div>${columnNumber(ans)}</div></div><div class="vx-steps">${steps.join('')}</div></div>${answerPill(item,ctx)}</div>`;
  }

  function subtraction(a,b,item,ctx){
    const ans=a-b,A=String(a).split('').reverse().map(Number),B=String(b).split('').reverse().map(Number);let work=[...A],steps=[],L=Math.max(A.length,B.length);
    for(let i=0;i<L;i++){
      let top=work[i]||0,bot=B[i]||0,borrowHtml='';
      if(top<bot){let j=i+1;while(j<work.length&&(work[j]||0)===0)j++;if(j<work.length){work[j]-=1;for(let k=j-1;k>i;k--)work[k]=9;work[i]=(work[i]||0)+10;top=work[i];const chain=[];for(let z=j;z>i;z--)chain.push(`${z===j?'1 ':''}${places[z]||''} → 10 ${places[z-1]||''}`);borrowHtml=`<i class="vx-borrow">${chain.join(' → ')}</i>`;}}
      const out=top-bot;
      steps.push(`<div class="vx-step vx-delay-${Math.min(i,4)}"><span class="vx-place">${places[i]||''}</span>${borrowHtml}<strong>${top} − ${bot} = ${out}</strong><div class="vx-step-result"><b>${out}</b></div></div>`);
    }
    return `<div class="vx-math"><div class="vx-equation"><span>${fmt(a)}</span><i>−</i><span>${fmt(b)}</span><i>=</i><strong>${fmt(ans)}</strong></div><div class="vx-column"><div class="vx-stack"><div>${columnNumber(a)}</div><div class="vx-opline"><span>−</span>${columnNumber(b)}</div><hr><div>${columnNumber(ans)}</div></div><div class="vx-steps">${steps.join('')}</div></div>${answerPill(item,ctx)}</div>`;
  }

  function multiplication(a,b,item,ctx){
    const ans=a*b,show=Math.min(a,12),each=Math.min(b,12);
    return `<div class="vx-math"><div class="vx-groups">${Array.from({length:show},(_,i)=>`<div class="vx-group vx-delay-${Math.min(i,4)}">${dots(each)}</div>`).join('')}</div><div class="vx-equation"><span>${a} kumpulan</span><i>×</i><span>${b}</span><i>=</i><strong>${ans}</strong></div>${answerPill(item,ctx)}</div>`;
  }
  function division(a,b,item,ctx){
    const ans=a/b,items=Math.min(a,36),groups=Math.min(b,12),per=Math.floor(items/groups);
    return `<div class="vx-math"><div class="vx-distribute"><div class="vx-pool">${dots(items,'vx-dot-move')}</div><span>➜</span><div class="vx-div-groups">${Array.from({length:groups},()=>`<div>${dots(per)}</div>`).join('')}</div></div><div class="vx-equation"><span>${a}</span><i>÷</i><span>${b}</span><i>=</i><strong>${ans}</strong></div>${answerPill(item,ctx)}</div>`;
  }
  function fractionAdd(a,b,d,item,ctx){
    const ans=a+b;
    const bar=(num)=>`<div class="vx-fracbar">${Array.from({length:d},(_,i)=>`<i class="${i<num?'fill':''}"></i>`).join('')}</div>`;
    return `<div class="vx-math"><div class="vx-frac-row"><div>${bar(a)}<b>${a}/${d}</b></div><span>+</span><div>${bar(b)}<b>${b}/${d}</b></div><span>➜</span><div>${bar(ans)}<b>${ans}/${d}</b></div></div><div class="vx-symbol-rule"><span>${a}</span><i>+</i><span>${b}</span><i>=</i><strong>${ans}</strong><small>／ ${d}</small></div>${answerPill(item,ctx)}</div>`;
  }
  function fractionBasic(item,ctx,c){
    const half=c==='half',d=half?2:4,num=1;return `<div class="vx-math"><div class="vx-frac-big">${Array.from({length:d},(_,i)=>`<i class="${i<num?'fill':''}"></i>`).join('')}</div><div class="vx-equation"><span>1</span><i>/</i><span>${d}</span><i>=</i><strong>${esc(item.correct)}</strong></div>${answerPill(item,ctx)}</div>`;
  }
  function money(item,ctx,c){
    const parts=c.split('-'),isChange=parts[0]==='change',a=+parts[1],b=+parts[2];
    if(isChange){const price=a,paid=b,balance=paid-price;return `<div class="vx-math"><div class="vx-money-flow"><div>💵<b>RM${paid}</b></div><span>−</span><div>🛍️<b>RM${price}</b></div><span>➜</span><div>💰<strong>RM${balance}</strong></div></div>${answerPill(item,ctx)}</div>`}
    const x=a,y=b,total=x+y;return `<div class="vx-math"><div class="vx-money-flow"><div>💵<b>RM${x}</b></div><span>+</span><div>💵<b>RM${y}</b></div><span>➜</span><div>💰<strong>RM${total}</strong></div></div>${answerPill(item,ctx)}</div>`;
  }
  function clockSVG(h,m){const aM=m*6-90,aH=(h%12)*30+m*.5-90,pt=(deg,r)=>{const z=deg*Math.PI/180;return [50+Math.cos(z)*r,50+Math.sin(z)*r]};const [mx,my]=pt(aM,34),[hx,hy]=pt(aH,23);let nums='';for(let i=1;i<=12;i++){const [x,y]=pt(i*30-90,41);nums+=`<text x="${x}" y="${y+2}" text-anchor="middle">${i}</text>`}return `<svg class="vx-clock" viewBox="0 0 100 100"><circle cx="50" cy="50" r="47"/>${nums}<line class="hour" x1="50" y1="50" x2="${hx}" y2="${hy}"/><line class="minute" x1="50" y1="50" x2="${mx}" y2="${my}"/><circle cx="50" cy="50" r="3"/></svg>`}
  function time(item,ctx,c){const p=c.split('-');if(p[1]==='read'){const h=+p[2],m=+p[3];return `<div class="vx-math"><div class="vx-clock-wrap">${clockSVG(h,m)}<div class="vx-clock-keys"><span>🕐 ${h}</span><span>🔵 ${m} min</span></div></div><div class="vx-equation"><strong>${h}:${String(m).padStart(2,'0')}</strong></div>${answerPill(item,ctx)}</div>`}const h=+p[2],m=+p[3],add=+p[4],total=(h%12)*60+m+add*60,ah=Math.floor(total/60)%12||12,am=total%60;return `<div class="vx-math"><div class="vx-clock-pair"><div>${clockSVG(h,m)}<b>${h}:${String(m).padStart(2,'0')}</b></div><span class="vx-time-arrow">+ ${add} jam ➜</span><div>${clockSVG(ah,am)}<b>${ah}:${String(am).padStart(2,'0')}</b></div></div>${answerPill(item,ctx)}</div>`}
  function measure(item,ctx,c){const p=c.split('-');if(p[0]==='cm'){const cm=+p[1],m=cm/100;return `<div class="vx-math"><div class="vx-unit-flow"><div><b>100 cm</b><span>=</span><strong>1 m</strong></div><div class="vx-repeat">${m<=10?Array.from({length:m},()=>'<i>1 m</i>').join(''):`<i>${m} × 1 m</i>`}</div><strong>${cm} cm = ${m} m</strong></div>${answerPill(item,ctx)}</div>`}const kg=+p[1],g=kg*1000;return `<div class="vx-math"><div class="vx-unit-flow"><div><b>1 kg</b><span>=</span><strong>1000 g</strong></div><div class="vx-repeat">${kg<=10?Array.from({length:kg},()=>'<i>1000 g</i>').join(''):`<i>${kg} × 1000 g</i>`}</div><strong>${kg} kg = ${g} g</strong></div>${answerPill(item,ctx)}</div>`}
  function area(item,ctx,c){const p=c.split('-'),l=+p[1],w=+p[2],ans=l*w;const rows=Math.min(w,10),cols=Math.min(l,12);return `<div class="vx-math"><div class="vx-area-grid" style="--cols:${cols}">${Array.from({length:rows*cols},()=>'<i></i>').join('')}</div><div class="vx-equation"><span>${l}</span><i>×</i><span>${w}</span><i>=</i><strong>${ans} cm²</strong></div>${answerPill(item,ctx)}</div>`}
  function dataExplain(item,ctx,c){const p=c.split('-'),kind=p[0],vals=p.slice(1).map(Number);if(kind==='mean'){const sum=vals.reduce((a,b)=>a+b,0),mean=sum/vals.length;return `<div class="vx-math"><div class="vx-data-chips">${vals.map(v=>`<i>${v}</i>`).join('<span>+</span>')}</div><div class="vx-equation"><span>${sum}</span><i>÷</i><span>${vals.length}</span><i>=</i><strong>${mean}</strong></div>${answerPill(item,ctx)}</div>`}const mx=Math.max(...vals);return `<div class="vx-math"><div class="vx-data-chips">${vals.map(v=>`<i class="${v===mx?'hot':''}">${v}</i>`).join('')}</div><div class="vx-equation"><strong>↑ ${mx}</strong></div>${answerPill(item,ctx)}</div>`}

  function fractionCompare(item,ctx,c){const p=c.split('-').slice(1).map(Number),d=p.pop(),nums=p,high=Math.max(...nums);const row=nums.map(v=>`<div class="vx-frac-choice ${v===high?'hot':''}"><div class="vx-fracbar">${Array.from({length:d},(_,i)=>`<i class="${i<v?'fill':''}"></i>`).join('')}</div><b>${v}/${d}</b></div>`).join('');return `<div class="vx-math"><div class="vx-frac-compare">${row}</div><div class="vx-equation"><strong>↑ ${high}/${d}</strong></div>${answerPill(item,ctx)}</div>`}
  function shapeExplain(item,ctx,c){const name=c.slice(6);const svg=name==='Segi tiga'?'<polygon points="50,8 92,88 8,88"/>':name==='Kubus'?'<path d="M25 25h45v45H25z M25 25l15-15h45v45L70 70 M70 25l15-15 M70 70l15-15"/>':name==='Bulatan'?'<circle cx="50" cy="50" r="38"/>':'<rect x="12" y="24" width="76" height="52"/>';const label=name==='Segi tiga'?'3 sisi':name==='Kubus'?'6 permukaan':name==='Bulatan'?'0 sisi lurus':'';return `<div class="vx-math"><svg class="vx-shape" viewBox="0 0 100 100">${svg}</svg><div class="vx-equation"><span>${label}</span><i>➜</i><strong>${esc(item.correct)}</strong></div>${answerPill(item,ctx)}</div>`}
  function numberExplain(item,ctx,c){
    if(c.startsWith('next-')){const val=+c.split('-')[1],ans=val+1;return `<div class="vx-math"><div class="vx-order"><i>${fmt(Math.max(0,val-1))}</i><span>➜</span><i>${fmt(val)}</i><span>➜</span><i class="hot">${fmt(ans)}</i></div>${answerPill(item,ctx)}</div>`}
    if(c.startsWith('compare-')){const p=c.split('-'),a=+p[1],b=+p[2],hi=Math.max(a,b),lo=Math.min(a,b);return `<div class="vx-math"><div class="vx-compare"><div style="--w:${Math.max(22,lo/hi*100)}%"><b>${fmt(lo)}</b><i></i></div><div style="--w:100%" class="hot"><b>${fmt(hi)}</b><i></i></div></div><div class="vx-equation"><strong>${fmt(hi)} ↑</strong></div>${answerPill(item,ctx)}</div>`}
    if(c.startsWith('place-')){const p=c.split('-'),val=+p[1],place=+p[2],digit=Math.floor(val/place)%10,ans=digit*place;const ds=String(val).split(''),idx=ds.length-1-Math.round(Math.log10(place));return `<div class="vx-math"><div class="vx-place-number">${ds.map((d,i)=>`<i class="${i===idx?'hot':''}">${d}</i>`).join('')}</div><div class="vx-equation"><span>${digit}</span><i>×</i><span>${fmt(place)}</span><i>=</i><strong>${fmt(ans)}</strong></div>${answerPill(item,ctx)}</div>`}
    if(c.startsWith('round-')){const p=c.split('-'),val=+p[1],near=+p[2],lo=Math.floor(val/near)*near,hi=lo+near,ans=Math.round(val/near)*near,pos=(val-lo)/(hi-lo)*100;return `<div class="vx-math"><div class="vx-numberline"><b>${lo}</b><div><i style="left:${pos}%">${val}</i><span class="vx-mid"></span></div><b>${hi}</b></div><div class="vx-equation"><strong>➜ ${fmt(ans)}</strong></div>${answerPill(item,ctx)}</div>`}
    if(c.startsWith('order-')){const p=c.split('-'),asc=p[1]==='asc',vals=p.slice(2).map(Number),sorted=[...vals].sort((a,b)=>asc?a-b:b-a);return `<div class="vx-math"><div class="vx-order">${sorted.map((v,i)=>`<i class="vx-delay-${Math.min(i,4)}">${fmt(v)}</i>`).join('<span>➜</span>')}</div>${answerPill(item,ctx)}</div>`}
    return genericMath(item,ctx);
  }
  function genericMath(item,ctx){return `<div class="vx-math"><div class="vx-equation"><strong>${esc(item.correct)}</strong></div>${answerPill(item,ctx)}</div>`}

  const emojiFor=(text)=>{text=String(text||'').toLowerCase();const map=[['kertas','📄'],['baju','👕'],['buku','📚'],['pensel','✏️'],['kucing','🐱'],['ikan','🐟'],['orang','🧒'],['epal','🍎'],['bola','⚽'],['sekolah','🏫'],['air','💧'],['akar','🌱'],['daun','🍃'],['bunga','🌸'],['jantung','🫀'],['paru','🫁'],['darah','🩸'],['bateri','🔋'],['elektrik','⚡'],['cahaya','💡'],['bumi','🌍'],['matahari','☀️'],['bulan','🌙'],['melaka','🏰'],['malaysia','🇲🇾'],['keluarga','👨‍👩‍👧‍👦'],['guru','👩‍🏫'],['hormat','🙏'],['jujur','🤝'],['sihat','🏃'],['makan','🍽️']];for(const [k,e] of map)if(text.includes(k))return e;return '🧩'};
  const idiomIcon=(phrase)=>{const m={'ringan tulang':'💪🧹','mulut murai':'🗣️🐦','buah tangan':'🎁','kaki bangku':'⚽🚫','besar hati':'😊✨','panjang tangan':'🫳🚫','otak cair':'🧠✨','anak emas':'👧💛','tangan terbuka':'🤲❤️','makan angin':'🚗🌴','ambil berat':'❤️👀'};return m[phrase]||'💬'};
  function bmExplain(item,ctx,c){
    if(c.startsWith('idiom-')){const phrase=c.slice(6);return `<div class="vx-language"><div class="vx-idiom"><div><span>${idiomIcon(phrase)}</span><b>${esc(phrase)}</b></div><i>➜</i><strong>${esc(item.correct)}</strong></div>${answerPill(item,ctx)}</div>`}
    if(c.startsWith('ant-')){const word=c.slice(4);return `<div class="vx-language"><div class="vx-opposites"><span>${esc(word)}</span><i>↔</i><strong>${esc(item.correct)}</strong></div>${answerPill(item,ctx)}</div>`}
    if(c.startsWith('counter-')){const obj=c.slice(8);return `<div class="vx-language"><div class="vx-counter"><span>${emojiFor(obj)}</span><strong>${esc(item.correct)}</strong><b>${esc(obj)}</b></div>${answerPill(item,ctx)}</div>`}
    if(c.startsWith('comp-')){return `<div class="vx-language"><div class="vx-comprehension"><span>🔍</span><div><small>DALAM PETIKAN</small><strong>${esc(item.correct)}</strong></div></div>${answerPill(item,ctx)}</div>`}
    if(c.startsWith('verb-')){return `<div class="vx-language"><div class="vx-action"><span>🏃‍♂️</span><i>➜</i><strong>${esc(item.correct)}</strong></div>${answerPill(item,ctx)}</div>`}
    if(item.topic==='Ejaan'){return `<div class="vx-language"><div class="vx-spelling">${String(item.correct).split('').map((x,i)=>`<i class="vx-delay-${Math.min(i,4)}">${esc(x)}</i>`).join('')}</div>${answerPill(item,ctx)}</div>`}
    return languageGeneric(item,ctx,'📖');
  }
  function scienceExplain(item,ctx){const icon=emojiFor(`${item.topic} ${item.question} ${item.correct} ${item.explanation||''}`);let extra='';const t=String(item.topic);if(t==='Bumi & Angkasa'&&String(item.correct).toLowerCase().includes('berputar'))extra='<div class="vx-orbit">☀️ <span>↻</span> 🌍</div>';else if(t==='Tenaga')extra='<div class="vx-flow-icons">🔋 <span>➜</span> ⚡ <span>➜</span> 💡/🌀</div>';else if(t==='Tumbuhan')extra='<div class="vx-flow-icons">💧 <span>⬆</span> 🌱 <span>➜</span> 🍃</div>';else if(t==='Manusia')extra='<div class="vx-flow-icons">🫀 <span>➜</span> 🩸 <span>➜</span> 🧍</div>';return `<div class="vx-science">${extra||`<div class="vx-big-icon">${icon}</div>`}<div class="vx-fact"><span>➜</span><strong>${esc(item.correct)}</strong></div>${answerPill(item,ctx)}</div>`}
  function historyExplain(item,ctx){return `<div class="vx-history"><div class="vx-history-line"><span>🕰️</span><i>➜</i><span>${emojiFor(item.question)}</span><i>➜</i><strong>${esc(item.correct)}</strong></div>${answerPill(item,ctx)}</div>`}
  function languageGeneric(item,ctx,icon='🧩'){return `<div class="vx-language"><div class="vx-generic-map"><span>${icon}</span><i>➜</i><strong>${esc(item.correct)}</strong></div>${answerPill(item,ctx)}</div>`}
  function otherExplain(item,ctx,subject){const icon={en:'🔤',islam:'🕌',moral:'🤝',pjpk:'🏃'}[subject]||'🧩';return languageGeneric(item,ctx,icon)}

  function math(item,ctx){const c=concept(item),p=c.split('-'),kind=p[0];
    if(kind==='add')return addition(+p[1],+p[2],item,ctx);
    if(kind==='sub')return subtraction(+p[1],+p[2],item,ctx);
    if(kind==='mul')return multiplication(+p[1],+p[2],item,ctx);
    if(kind==='div')return division(+p[1],+p[2],item,ctx);
    if(kind==='fracadd')return fractionAdd(+p[1],+p[2],+p[3],item,ctx);
    if(kind==='fraccompare')return fractionCompare(item,ctx,c);
    if(kind==='half'||kind==='quarter')return fractionBasic(item,ctx,kind);
    if(kind==='moneyadd'||kind==='change')return money(item,ctx,c);
    if(kind==='clock')return time(item,ctx,c);
    if(kind==='cm'||kind==='kg')return measure(item,ctx,c);
    if(kind==='area')return area(item,ctx,c);
    if(kind==='mean'||kind==='max')return dataExplain(item,ctx,c);
    if(['next','compare','place','round','order'].includes(kind))return numberExplain(item,ctx,c);
    if(kind==='shape')return shapeExplain(item,ctx,c);
    return genericMath(item,ctx);
  }
  function render(item,ctx={}){const subject=ctx.subject||'';if(subject==='math')return math(item,ctx);if(subject==='bm')return bmExplain(item,ctx,concept(item));if(subject==='sci')return scienceExplain(item,ctx);if(subject==='hist')return historyExplain(item,ctx);return otherExplain(item,ctx,subject)}
  return {render};
})();
