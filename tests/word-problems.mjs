import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const win={console,Math,Date,Intl};
win.window=win;
const ctx=vm.createContext(win);
vm.runInContext(read('word-problem-engine.js'),ctx);
vm.runInContext(read('word-problem-mode.js'),ctx);
const E=ctx.LATIH_WORD_PROBLEMS;
assert.equal(E.operations.length,4);
assert.equal(typeof ctx.LATIH_WORD_MODE.create,'function');
for(const year of ['1','2','3','4','5','6']){
  for(const difficulty of ['auto','mudah','sukar']){
    for(const size of [5,10,20,30,50]){
      const questions=E.makeSet(year,size,difficulty);
      assert.equal(questions.length,size,'Set '+year+'/'+size);
      assert.equal(new Set(questions.map(q=>q.story)).size,size,'Unique stories '+year+'/'+size);
      for(const q of questions){
        assert(E.validItem(q),'Invalid guided word problem '+year);
        assert.equal(q.level,year);
        assert(q.story.includes('?'));
        assert(q.equations.includes(q.equation));
        assert(q.answers.includes(q.answer));
        assert.equal(q.answers.length,4);
        assert.equal(new Set(q.answers).size,4);
      }
      if(size>=4)for(const operation of E.operations)assert(questions.some(q=>q.operation===operation));
    }
  }
}
for(const year of ['1','2','3','4','5','6']){
  for(const op of E.operations){
    for(let i=0;i<50;i++)assert(E.validItem(E.makeOne(year,op,'sukar')));
  }
}
const active={level:'2',items:E.makeSet('2',5),index:0,step:0,attempts:[0,0,0],feedback:null,results:[],startedAt:Date.now()};
assert(E.validActive(active));
assert(E.validActive({...active,step:2,attempts:[1,2,1],feedback:{ok:false,index:0}}));
assert(!E.validActive({...active,index:500}));
assert(!E.validActive({...active,items:[]}));
assert(!E.validActive({...active,step:3}));
const migrated=E.migrate({active,history:[{level:'1',total:5,independent:3}],count:50});
assert.equal(migrated.active.items.length,5);
assert.equal(migrated.history.length,1);
assert.equal(migrated.count,50);
assert.equal(E.migrate({active:{bad:true}}).active,null);
assert.deepEqual(JSON.parse(JSON.stringify(E.migrate({}))),{active:null,history:[],count:10});
console.log('Guided word-problem checks passed: all six school years, 4 operations, 5–50 questions, unique choices, valid resume.');
