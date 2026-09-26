// Pure helpers shared by the application and its dependency-free tests.
globalThis.LATIH_STATE = (() => {
  const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const known = (obj,key) => Object.prototype.hasOwnProperty.call(obj,key);
  const finite = v => typeof v === 'number' && Number.isFinite(v);
  const modes = ['learn', 'exam', 'uasa'];
  function validQuiz(q, config) {
    if (!object(q) || !Array.isArray(q.items) || !q.items.length || q.items.length > 100 ||
        !Number.isInteger(q.i) || q.i < 0 || q.i >= q.items.length ||
        !Array.isArray(q.answers) || q.answers.length > q.items.length ||
        !finite(q.score) || q.score < 0 || q.score > q.answers.length ||
        !finite(q.remaining) || q.remaining < 0 || q.remaining > 86400) return false;
    if (q.prefs && (!object(q.prefs) || !modes.includes(q.prefs.mode) ||
        !known(config.subjects,q.prefs.subject) || !['pra','1','2','3','4','5','6'].includes(String(q.prefs.level)))) return false;
    return q.items.every(item => object(item) && typeof item.question === 'string' && item.question.trim() &&
      typeof item.topic === 'string' && item.topic.trim() && item.correct !== undefined &&
      (item.itemType === 'short' ? String(item.correct).trim() :
        Array.isArray(item.answers) && item.answers.length === 4 &&
        item.answers.filter(a => String(a) === String(item.correct)).length === 1));
  }
  function migrateQuiz(q, prefs, config) {
    if (!q || q.prefs?.subject === 'sra') return null;
    const value = {...q, prefs: migratePreferences({...prefs,...(q.prefs||{})},config)};
    if (!validQuiz(value, config)) return null;
    value.questionElapsedMs = finite(q.questionElapsedMs) && q.questionElapsedMs >= 0 ? q.questionElapsedMs : 0;
    value.questionStartedAt = 0;
    value.timerStartedAt = 0;
    value.selected = q.selected === undefined ? null : q.selected;
    value.shortValue = typeof q.shortValue === 'string' ? q.shortValue.slice(0,300) : '';
    return value;
  }
  function migratePreferences(input, config) {
    const old = object(input) ? input : {};
    const level = ['pra','1','2','3','4','5','6'].includes(String(old.level)) ? String(old.level) : '1';
    const allowed = Object.entries(config.subjects).filter(([,meta])=>meta.years.includes(level)).map(([id])=>id);
    const subject = old.subject !== 'sra' && allowed.includes(old.subject) ? old.subject : level === 'pra' ? 'pra' : 'math';
    const topics = config.subjects[subject]?.topics || [];
    const topic = old.subject === subject && (topics.includes(old.topic) || old.topic === 'Campur Semua') ? old.topic : level === 'pra' ? 'Campur-campur' : 'Campur Semua';
    const {schoolType: legacySchoolType, ...prefs} = old;
    return {...prefs,level,subject,topic};
  }
  // Remove obsolete school records after reading an older local state or backup.
  function purgeLegacySchool(s) {
    if (!object(s)) return s;
    if (Array.isArray(s.sessions)) s.sessions=s.sessions.filter(row=>row?.subject!=='sra' && row?.schoolType!=='sra');
    const subjectRows=s.aggregates?.subjects;
    if (object(subjectRows)) {
      const old=subjectRows.sra;
      if (old && finite(s.aggregates.sessionCount)) s.aggregates.sessionCount=Math.max(0,s.aggregates.sessionCount-(Number(old.n)||0));
      delete subjectRows.sra;
    }
    let removedTimingCount=0,removedTimingMs=0;
    for(const [map,predicate] of [
      [s.aggregates?.topics,k=>k.startsWith('sra|')],
      [s.smartPractice?.seen,k=>k.endsWith(':sra')],
      [s.smartPractice?.recentGenerated,k=>k.endsWith(':sra')],
      [s.learning?.completed,k=>k.includes(':sra:')],
      [s.learning?.mastery,k=>k.includes(':sra:')],
      [s.learning?.adaptive,k=>k.includes(':sra:')],
      [s.responseAnalytics?.patterns,k=>k.includes('|sra|')]
    ]) if(object(map)) for(const key of Object.keys(map)) if(predicate(key)){if(map===s.responseAnalytics?.patterns){removedTimingCount+=Number(map[key]?.count)||0;removedTimingMs+=Number(map[key]?.totalMs)||0}delete map[key]};
    if(s.learning?.pendingMastery?.subject==='sra')s.learning.pendingMastery=null;
    if(s.responseAnalytics && removedTimingCount){s.responseAnalytics.totalTimed=Math.max(0,(Number(s.responseAnalytics.totalTimed)||0)-removedTimingCount);s.responseAnalytics.totalMs=Math.max(0,(Number(s.responseAnalytics.totalMs)||0)-removedTimingMs)}
    return s;
  }
  function validateBackup(data, config) {
    if (!object(data) || (data.app !== undefined && data.app !== 'LatihKu Study') || !object(data.state)) return false;
    const s = data.state;
    if (s.schemaVersion !== undefined && (!finite(s.schemaVersion) || s.schemaVersion < 1 || s.schemaVersion > 25)) return false;
    for (const k of ['profile','prefs','settings','learning','smartPractice','coloring','responseAnalytics']) if (s[k] !== undefined && !object(s[k])) return false;
    if (!object(s.profile) || typeof s.profile.name !== 'string' || !object(s.prefs) ||
        !(known(config.subjects,s.prefs.subject) || s.prefs.subject === 'sra') || !['pra','1','2','3','4','5','6'].includes(String(s.prefs.level)) ||
        !Array.isArray(s.sessions) || s.sessions.length > 10000 ||
        s.sessions.some(x => !object(x) || !(known(config.subjects,x.subject) || x.subject === 'sra') || !finite(x.score) || !finite(x.total))) return false;
    for (const k of ['answers','correct','xp','streak']) if (s[k] !== undefined && (!finite(s[k]) || s[k] < 0)) return false;
    if (s.activeQuiz && s.activeQuiz.prefs?.subject !== 'sra' && s.prefs.subject !== 'sra' && !migrateQuiz(s.activeQuiz,s.prefs,config)) return false;
    if (s.learning && ['completed','mastery','adaptive'].some(k => s.learning[k] !== undefined && !object(s.learning[k]))) return false;
    if (s.smartPractice && ['seen','recentGenerated'].some(k => s.smartPractice[k] !== undefined && !object(s.smartPractice[k]))) return false;
    if (s.coloring && ['completed','lastPage'].some(k => s.coloring[k] !== undefined && !object(s.coloring[k]))) return false;
    if (s.responseAnalytics && s.responseAnalytics.patterns !== undefined && !object(s.responseAnalytics.patterns)) return false;
    if (s.aggregates && (!object(s.aggregates) || !object(s.aggregates.subjects) || !object(s.aggregates.topics))) return false;
    return true;
  }
  function duration(mode, count) {
    const n = Math.max(1,Math.min(100,Number(count)||1));
    // Practice reference: 75 minutes for a 30-question set; no official exam claim.
    return mode === 'uasa' ? Math.round(75*60*n/30) : n*45;
  }
  function remaining(q, now) {
    return Math.max(0,Math.ceil(q.remaining - (q.timerStartedAt ? Math.max(0,now-q.timerStartedAt)/1000 : 0)));
  }
  function countDay(streak,lastDay,today,yesterday) {
    return lastDay === today ? streak : lastDay === yesterday ? streak+1 : 1;
  }
  return {validQuiz,migrateQuiz,migratePreferences,purgeLegacySchool,validateBackup,duration,remaining,countDay};
})();
