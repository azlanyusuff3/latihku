// 195 negara (193 anggota PBB + Palestin dan Vatican); bendera SVG disimpan offline.
// Country names source: hampusborgos/country-flags; artwork: amckenna41/iso3166-flags (MIT).
(function installFlagBank(rows) {
  'use strict';
  const aliases={
    BN:'Brunei',CD:'Republik Demokratik Congo',CG:'Republik Congo',CI:'Pantai Gading',
    CV:'Cabo Verde',FM:'Micronesia',KR:'Korea Selatan',KP:'Korea Utara',
    LA:'Laos',MK:'Macedonia Utara',MM:'Myanmar',PS:'Palestin',
    ST:'São Tomé dan Príncipe',TL:'Timor-Leste',TR:'Turkiye',US:'Amerika Syarikat',
    VA:'Vatican',GB:'United Kingdom',SZ:'Eswatini',CZ:'Czechia'
  };
  let display;
  try { display=new Intl.DisplayNames(['ms-MY','ms','en'],{type:'region'}); } catch {}
  const countries=rows.map(([code,en])=>Object.freeze({code,name:aliases[code]||display?.of(code)||en}));
  const byCode=Object.fromEntries(countries.map(c=>[c.code,c]));
  const exists=code=>Object.prototype.hasOwnProperty.call(byCode,code);
  function shuffle(source,rng=Math.random){
    const a=[...source];
    for(let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.min(.999999999999,Math.max(0,rng()))*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
  function makeQuiz(count=10,recent=[]){
    const size=[5,10,20,30].includes(Number(count))?Number(count):10;
    const avoid=new Set(Array.isArray(recent)?recent:[]);
    const targets=[...shuffle(countries.filter(c=>!avoid.has(c.code))),...shuffle(countries.filter(c=>avoid.has(c.code)))].slice(0,size);
    return targets.map(c=>({
      code:c.code,
      options:shuffle([c,...shuffle(countries.filter(x=>x.code!==c.code)).slice(0,3)]).map(x=>x.code)
    }));
  }
  function validSession(s){
    if(!s||typeof s!=='object'||!Array.isArray(s.items)||![5,10,20,30].includes(s.items.length)||
        !Number.isInteger(s.i)||s.i<0||s.i>=s.items.length||
        !Number.isInteger(s.score)||s.score<0||
        !Array.isArray(s.answers)||s.answers.length>s.items.length||s.score>s.answers.length||
        !(s.selected===null||Number.isInteger(s.selected)&&s.selected>=0&&s.selected<4))return false;
    if(s.answers.length!==s.i+(s.selected===null?0:1))return false;
    if(new Set(s.items.map(q=>q.code)).size!==s.items.length)return false;
    return s.items.every(q=>q&&exists(q.code)&&Array.isArray(q.options)&&q.options.length===4&&new Set(q.options).size===4&&q.options.every(exists)&&q.options.includes(q.code));
  }
  globalThis.LATIH_FLAGS=Object.freeze({
    count:countries.length,countries:Object.freeze(countries),
    name:code=>byCode[code]?.name||'',
    exists,makeQuiz,validSession
  });
})([["AF","Afghanistan"],["AL","Albania"],["DZ","Algeria"],["AD","Andorra"],["AO","Angola"],["AG","Antigua and Barbuda"],["AR","Argentina"],["AM","Armenia"],["AU","Australia"],["AT","Austria"],["AZ","Azerbaijan"],["BS","Bahamas"],["BH","Bahrain"],["BD","Bangladesh"],["BB","Barbados"],["BY","Belarus"],["BE","Belgium"],["BZ","Belize"],["BJ","Benin"],["BT","Bhutan"],["BO","Bolivia, Plurinational State of"],["BA","Bosnia and Herzegovina"],["BW","Botswana"],["BR","Brazil"],["BN","Brunei Darussalam"],["BG","Bulgaria"],["BF","Burkina Faso"],["BI","Burundi"],["CV","Cape Verde"],["KH","Cambodia"],["CM","Cameroon"],["CA","Canada"],["CF","Central African Republic"],["TD","Chad"],["CL","Chile"],["CN","China (People's Republic of China)"],["CO","Colombia"],["KM","Comoros"],["CG","Republic of the Congo"],["CD","Congo, the Democratic Republic of the"],["CR","Costa Rica"],["CI","Côte d'Ivoire"],["HR","Croatia"],["CU","Cuba"],["CY","Cyprus"],["CZ","Czech Republic"],["DK","Denmark"],["DJ","Djibouti"],["DM","Dominica"],["DO","Dominican Republic"],["EC","Ecuador"],["EG","Egypt"],["SV","El Salvador"],["GQ","Equatorial Guinea"],["ER","Eritrea"],["EE","Estonia"],["SZ","Kingdom of Eswatini"],["ET","Ethiopia"],["FJ","Fiji"],["FI","Finland"],["FR","France"],["GA","Gabon"],["GM","Gambia"],["GE","Georgia"],["DE","Germany"],["GH","Ghana"],["GR","Greece"],["GD","Grenada"],["GT","Guatemala"],["GN","Guinea"],["GW","Guinea-Bissau"],["GY","Guyana"],["HT","Haiti"],["HN","Honduras"],["HU","Hungary"],["IS","Iceland"],["IN","India"],["ID","Indonesia"],["IR","Iran, Islamic Republic of"],["IQ","Iraq"],["IE","Ireland"],["IL","Israel"],["IT","Italy"],["JM","Jamaica"],["JP","Japan"],["JO","Jordan"],["KZ","Kazakhstan"],["KE","Kenya"],["KI","Kiribati"],["KP","Korea, Democratic People's Republic of"],["KR","Korea, Republic of"],["KW","Kuwait"],["KG","Kyrgyzstan"],["LA","Laos (Lao People's Democratic Republic)"],["LV","Latvia"],["LB","Lebanon"],["LS","Lesotho"],["LR","Liberia"],["LY","Libya"],["LI","Liechtenstein"],["LT","Lithuania"],["LU","Luxembourg"],["MG","Madagascar"],["MW","Malawi"],["MY","Malaysia"],["MV","Maldives"],["ML","Mali"],["MT","Malta"],["MH","Marshall Islands"],["MR","Mauritania"],["MU","Mauritius"],["MX","Mexico"],["FM","Micronesia, Federated States of"],["MD","Moldova, Republic of"],["MC","Monaco"],["MN","Mongolia"],["ME","Montenegro"],["MA","Morocco"],["MZ","Mozambique"],["MM","Myanmar"],["NA","Namibia"],["NR","Nauru"],["NP","Nepal"],["NL","Netherlands"],["NZ","New Zealand"],["NI","Nicaragua"],["NE","Niger"],["NG","Nigeria"],["MK","North Macedonia"],["NO","Norway"],["OM","Oman"],["PK","Pakistan"],["PW","Palau"],["PA","Panama"],["PG","Papua New Guinea"],["PY","Paraguay"],["PE","Peru"],["PH","Philippines"],["PL","Poland"],["PT","Portugal"],["QA","Qatar"],["RO","Romania"],["RU","Russian Federation"],["RW","Rwanda"],["KN","Saint Kitts and Nevis"],["LC","Saint Lucia"],["VC","Saint Vincent and the Grenadines"],["WS","Samoa"],["SM","San Marino"],["ST","Sao Tome and Principe"],["SA","Saudi Arabia"],["SN","Senegal"],["RS","Serbia"],["SC","Seychelles"],["SL","Sierra Leone"],["SG","Singapore"],["SK","Slovakia"],["SI","Slovenia"],["SB","Solomon Islands"],["SO","Somalia"],["ZA","South Africa"],["SS","South Sudan"],["ES","Spain"],["LK","Sri Lanka"],["SD","Sudan"],["SR","Suriname"],["SE","Sweden"],["CH","Switzerland"],["SY","Syrian Arab Republic"],["TJ","Tajikistan"],["TZ","Tanzania, United Republic of"],["TH","Thailand"],["TL","Timor-Leste"],["TG","Togo"],["TO","Tonga"],["TT","Trinidad and Tobago"],["TN","Tunisia"],["TR","Republic of Türkiye"],["TM","Turkmenistan"],["TV","Tuvalu"],["UG","Uganda"],["UA","Ukraine"],["AE","United Arab Emirates"],["GB","United Kingdom"],["US","United States"],["UY","Uruguay"],["UZ","Uzbekistan"],["VU","Vanuatu"],["VA","Holy See (Vatican City State)"],["VE","Venezuela, Bolivarian Republic of"],["VN","Vietnam"],["YE","Yemen"],["ZM","Zambia"],["ZW","Zimbabwe"],["PS","Palestine"]]);
