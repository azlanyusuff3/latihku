"""Compile local General banks, geographic outlines, photo puzzles and attribution.
Use: python scripts/build_general_data.py --countries /path/countries.json --maps /path/countries.geojson
Raw sources: mledoze/countries (ODbL), datasets/geo-countries / Natural Earth (public domain).
"""
import argparse,json,math,random,hashlib
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from general_catalog import CATALOG,STATES
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'assets/general';DATA=ROOT/'data/general'
p=argparse.ArgumentParser();p.add_argument('--countries',required=True);p.add_argument('--maps',required=True);args=p.parse_args()
sources=json.loads((OUT/'sources.json').read_text())
audio=json.loads((OUT/'audio-sources.json').read_text())
questions=[];categories=[]
META=[('flags','Bendera Negara','Kenali 195 bendera negara di seluruh dunia.'),('capitals','Ibu Negara','Kenali ibu negara melalui soalan dan peta.'),('maps','Negara & Peta Dunia','Teka bentuk negara dan benuanya.'),('landmarks','Mercu Tanda Dunia','Teroka bangunan dan tempat terkenal.'),('malaysia','Kenali Malaysia','Bendera negeri, ibu negeri dan mercu tanda.'),('food','Makanan Malaysia & Dunia','Kenali hidangan dan bahan asasnya.'),('produce','Buah & Sayur','Teka hasil kebun yang berwarna-warni.'),('animals','Haiwan','Kenali haiwan dan habitat umumnya.'),('sounds','Bunyi Haiwan','Dengar rakaman sebenar dan teka haiwannya.'),('plants','Tumbuhan & Bunga','Kenali bunga dan tumbuhan di sekeliling.'),('space','Angkasa Lepas','Teroka planet dan objek angkasa.'),('body','Tubuh Badan Manusia','Kenali anggota badan dan fungsi asasnya.'),('senses','Lima Deria','Belajar melihat, mendengar, menghidu, merasa dan menyentuh.'),('vehicles','Kenderaan','Teroka pengangkutan darat, laut dan udara.'),('roads','Papan Tanda Jalan & Keselamatan','Kenali tanda dan tindakan yang selamat.'),('jobs','Pekerjaan','Kenali tugas orang yang membantu masyarakat.'),('sports','Sukan','Kenali aktiviti sukan dan peralatannya.'),('music','Alat Muzik','Teroka alat muzik dan cara menghasilkan bunyi.'),('colors','Warna, Bentuk & Corak','Teroka warna, bentuk dan susunan melalui gambar.'),('logic','Brain Challenge / Logik','Cari pola, kumpulan dan urutan gambar.')]
def image(key):
    if key not in sources or 'path' not in sources[key]:raise ValueError('Missing approved image '+key)
    return sources[key]['path']
def add(cat,key,prompt,correct,options,explanation,img=None,sound=None):
    choices=list(dict.fromkeys([correct]+list(options)))
    if len(choices)<4:raise ValueError('Not enough answers '+key)
    rng=random.Random(key);wrong=[a for a in choices if a!=correct];rng.shuffle(wrong);opts=[correct]+wrong[:3]
    q=dict(id=cat+'-'+key,category=cat,question=prompt,image=img or image(key.split('-')[0]),options=opts,correct=correct,explanation=explanation)
    if sound:q['audio']=sound
    questions.append(q)
for cat,rows in CATALOG.items():
    names=[r[1] for r in rows];seconds=[r[3] for r in rows]
    extra={'animals':['Darat','Laut','Darat dan laut','Darat dan air tawar','Udara sahaja'], 'produce':['Buah','Sayur','Bijirin','Kekacang'], 'plants':['Bunga','Pokok','Rumput','Paku-pakis','Sukulen'], 'vehicles':['Darat','Landasan','Udara','Air','Bawah air']} .get(cat,[])
    for key,name,_,second in rows:
        prompt={'animals':'Apakah nama haiwan ini?','food':'Apakah nama makanan ini?','produce':'Apakah nama buah atau sayur ini?','plants':'Apakah nama tumbuhan ini?','vehicles':'Apakah nama kenderaan ini?','music':'Apakah nama alat muzik ini?','jobs':'Apakah pekerjaan orang dalam gambar ini?','sports':'Apakah sukan yang ditunjukkan?','landmarks':'Apakah nama mercu tanda ini?','space':'Apakah nama objek angkasa ini?','body':'Apakah anggota atau organ tubuh yang ditunjukkan?','roads':'Apakah maksud tanda atau kemudahan jalan ini?'}[cat]
        add(cat,key+'-name',prompt,name,names,name+' ditunjukkan dalam gambar.',image(key))
        prompt={'animals':'Di manakah habitat umum '+name.lower()+'?','food':'Apakah bahan asas yang biasa digunakan untuk '+name.lower()+'?','produce':'Dalam kegunaan makanan harian, apakah kumpulan '+name.lower()+'?','plants':'Apakah jenis tumbuhan '+name.lower()+'?','vehicles':'Di manakah '+name.lower()+' biasanya bergerak?','music':'Apakah cara atau komponen utama untuk memainkan '+name.lower()+'?','jobs':'Apakah tugas utama seorang '+name.lower()+'?','sports':'Apakah peralatan atau tempat yang berkaitan dengan '+name.lower()+'?','landmarks':'Mercu tanda ini terletak di negara mana?','space':'Pernyataan manakah yang betul tentang '+name+'?','body':'Apakah fungsi asas '+name.lower()+'?','roads':'Apakah tindakan yang sesuai di sini?'}[cat]
        add(cat,key+'-fact',prompt,second,seconds+extra,name+': '+second+'.',image(key))
# Geographic questions: avoid ambiguous capitals or transcontinental countries in the beginner bank.
CODES='MY JP KR CN TH ID SG BN PH VN KH LA MM IN PK BD NP BT MV MN AU NZ FR DE IT ES PT GB IE NO SE FI DK NL BE CH AT PL GR HU RO UA IS CA US MX BR AR CL PE CO EC VE EG MA DZ TN KE TZ UG GH NG SN ET MG'.split()
raw=json.loads(Path(args.countries).read_text());countries={c['cca2']:c for c in raw}
geo=json.loads(Path(args.maps).read_text());features={f['properties']['ISO3166-1-Alpha-2']:f for f in geo['features']}
regions={'Asia':'Asia','Europe':'Eropah','Africa':'Afrika','Oceania':'Oceania','Americas':'Amerika'}
malay={'MY':'Malaysia','JP':'Jepun','KR':'Korea Selatan','CN':'China','TH':'Thailand','ID':'Indonesia','SG':'Singapura','BN':'Brunei','PH':'Filipina','VN':'Vietnam','KH':'Kemboja','LA':'Laos','MM':'Myanmar','IN':'India','PK':'Pakistan','BD':'Bangladesh','NP':'Nepal','BT':'Bhutan','MV':'Maldives','MN':'Mongolia','AU':'Australia','NZ':'New Zealand','FR':'Perancis','DE':'Jerman','IT':'Itali','ES':'Sepanyol','PT':'Portugal','GB':'United Kingdom','IE':'Ireland','NO':'Norway','SE':'Sweden','FI':'Finland','DK':'Denmark','NL':'Belanda','BE':'Belgium','CH':'Switzerland','AT':'Austria','PL':'Poland','GR':'Greece','HU':'Hungary','RO':'Romania','UA':'Ukraine','IS':'Iceland','CA':'Kanada','US':'Amerika Syarikat','MX':'Mexico','BR':'Brazil','AR':'Argentina','CL':'Chile','PE':'Peru','CO':'Colombia','EC':'Ecuador','VE':'Venezuela','EG':'Mesir','MA':'Maghribi','DZ':'Algeria','TN':'Tunisia','KE':'Kenya','TZ':'Tanzania','UG':'Uganda','GH':'Ghana','NG':'Nigeria','SN':'Senegal','ET':'Ethiopia','MG':'Madagascar'}
# Named capital spellings for Malay users; source bank records preserved in geography reference.
capitalAlias={'Beijing':'Beijing','Bangkok':'Bangkok','Malé':'Male','Vientiane':'Vientiane','Washington D.C.':'Washington, D.C.','Vienna':'Vienna'}
geoRecords=[]
for code in CODES:
    if code not in features:continue
    c=countries[code];name=malay[code];capital=capitalAlias.get(c['capital'][0],c['capital'][0]);continent=regions[c['region']]
    f=features[code];geom=f['geometry'];polys=geom['coordinates'] if geom['type']=='MultiPolygon' else [geom['coordinates']]
    # Suppress distant overseas dependencies in metropolitan silhouette cards.
    if code=='FR':polys=[p for p in polys if -6<sum(x[0] for x in p[0])/len(p[0])<10 and 40<sum(x[1] for x in p[0])/len(p[0])<53]
    if code=='US':polys=[p for p in polys if -130<sum(x[0] for x in p[0])/len(p[0])<-60 and 24<sum(x[1] for x in p[0])/len(p[0])<50]
    pts=[p for poly in polys for p in poly[0]];lat=sum(p[1] for p in pts)/len(pts);cos=math.cos(math.radians(lat));project=lambda p:(p[0]*cos,-p[1]);xy=[project(p) for p in pts];minx=min(x for x,y in xy);maxx=max(x for x,y in xy);miny=min(y for x,y in xy);maxy=max(y for x,y in xy);scale=min(650/(maxx-minx or 1),460/(maxy-miny or 1));ox=(800-(maxx-minx)*scale)/2;oy=(600-(maxy-miny)*scale)/2
    im=Image.new('RGB',(800,600),'#edf5fa');d=ImageDraw.Draw(im)
    for poly in polys:
        ring=[(ox+(project(p)[0]-minx)*scale,oy+(project(p)[1]-miny)*scale) for p in poly[0]]
        if len(ring)>2:d.polygon(ring,fill='#3b7a90',outline='#254f67')
        for hole in poly[1:]:d.polygon([(ox+(project(p)[0]-minx)*scale,oy+(project(p)[1]-miny)*scale) for p in hole],fill='#edf5fa')
    path=OUT/('map-'+code+'.webp');im.save(path,'WEBP',quality=90);img=str(path.relative_to(ROOT));key='map-'+code
    sources[key]=dict(path=img,title='Geographic outline: '+name,author='Natural Earth contributors',source='https://github.com/datasets/geo-countries',license='Public domain',licenseUrl='https://www.naturalearthdata.com/about/terms-of-use/',changes='Geographic coordinates rendered as educational outline; distant overseas territories omitted for France; contiguous US shown.')
    geoRecords.append({'code':code,'name':name,'capital':capital,'continent':continent})
for r in geoRecords:
    code,name,cap,cont=r['code'],r['name'],r['capital'],r['continent'];img=sources['map-'+code]['path'];otherNames=[x['name'] for x in geoRecords];caps=[x['capital'] for x in geoRecords]
    prefix='Bentuk negara dalam gambar '
    if code=='US':prefix='Bentuk 48 negeri Amerika Syarikat yang bersambung dalam gambar '
    add('maps',code+'-name',prefix+'mewakili negara mana?',name,otherNames,'Ini garis bentuk '+name+'.',img)
    add('maps',code+'-continent',name+' terletak dalam benua atau rantau mana?',cont,list(regions.values()),name+' terletak di '+cont+'.',img)
    add('capitals',code+'-capital','Apakah ibu negara '+name+'?',cap,caps,'Ibu negara '+name+' ialah '+cap+'.',img)
    add('capitals',code+'-country',cap+' ialah ibu negara negara mana?',name,otherNames,cap+' ialah ibu negara '+name+'.',img)
(DATA/'geography-reference.json').write_text(json.dumps({'source':'https://github.com/mledoze/countries','license':'ODbL-1.0','licenseUrl':'https://opendatacommons.org/licenses/odbl/1-0/','records':geoRecords},ensure_ascii=False,indent=2))
# Malaysia: all 13 states plus local landmark facts.
for i,(s,cap) in enumerate(STATES):
    img=image('state-'+str(i));add('malaysia','state-'+str(i)+'-flag','Ini bendera negeri mana?',s,[x[0] for x in STATES], 'Ini bendera negeri '+s+'.',img)
    add('malaysia','state-'+str(i)+'-capital','Apakah ibu negeri '+s+'?',cap,[x[1] for x in STATES],cap+' ialah ibu negeri '+s+'.',img)
for n,(prompt,correct,choices,exp) in enumerate([
('Menara Berkembar Petronas terletak di mana?','Kuala Lumpur',['Putrajaya','Shah Alam','Kuching'],'Menara Berkembar Petronas terletak di Kuala Lumpur.'),
('Negara manakah yang mempunyai Menara Berkembar Petronas?','Malaysia',['Indonesia','Thailand','Brunei'],'Menara Berkembar Petronas ialah mercu tanda Malaysia.'),
('Berapakah bilangan menara utama dalam Menara Berkembar Petronas?','Dua',['Satu','Tiga','Empat'],'Berkembar merujuk kepada dua menara utama.'),
('Menara Berkembar Petronas ialah contoh apa?','Mercu tanda',['Gunung','Pulau','Air terjun'],'Bangunan ini ialah mercu tanda yang terkenal.')]):add('malaysia','landmark-'+str(n),prompt,correct,choices,exp,image('petronas'))
# Audio identity must not be revealed by its illustration before answering.
validAudio={k:r for k,r in audio.items() if not r['title'].lower().startswith(('file:en-','file:de-','file:fr-'))}
soundNames=list(dict.fromkeys(r['name'] for r in validAudio.values()))
if len(validAudio)<30:raise ValueError('Need 30 authentic audio clips; currently '+str(len(validAudio)))
for k,r in validAudio.items():add('sounds',k,'Bunyi ini dihasilkan oleh haiwan apa?',r['name'],soundNames,'Rakaman ini ialah bunyi '+r['name'].lower()+'.',image('farm'),r['path'])
# Six contexts for each of the five senses.
scenarios={'eye':('Mata','Penglihatan',['membaca buku','melihat pelangi','menonton gambar','memerhati bintang','mengenal warna','melihat papan tanda']), 'ear':('Telinga','Pendengaran',['mendengar lagu','mendengar loceng','mendengar suara guru','mendengar guruh','mendengar burung','mendengar bunyi kereta']), 'nose':('Hidung','Bau',['menghidu bunga','mengesan bau makanan','menghidu minyak wangi','mengesan bau asap','menghidu daun pandan','mengesan bau roti']), 'tongue':('Lidah','Rasa',['merasa makanan manis','merasa makanan masin','merasa buah masam','merasa makanan pahit','merasa sup','membezakan rasa buah']), 'skin':('Kulit','Sentuhan',['merasai kain lembut','mengesan air suam','merasai permukaan kasar','mengesan benda sejuk','merasai sentuhan tangan','merasai pasir'])}
for key,(organ,sense,contexts) in scenarios.items():
    for i,context in enumerate(contexts):add('senses',key+'-'+str(i),'Deria manakah digunakan untuk '+context+'?',sense,[v[1] for v in scenarios.values()],organ+' membantu kita menggunakan deria '+sense.lower()+'.',image(key))
# Photo puzzles are spatial educational compositions, not emoji or stock icons.
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',30)
def compose(key,objects,labels=None):
    im=Image.new('RGB',(1000,320),'#eef5f9');d=ImageDraw.Draw(im);n=len(objects);w=960/n
    for i,obj in enumerate(objects):
        x=20+i*w;d.rounded_rectangle((x+5,25,x+w-5,280),radius=18,fill='white',outline='#ccdfe9',width=2)
        if obj=='?':d.text((x+w/2-15,110),'?',font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',70),fill='#365a73')
        else:
            pic=Image.open(ROOT/image(obj)).convert('RGB');pic.thumbnail((int(w)-24,190));im.paste(pic,(int(x+(w-pic.width)/2),40+(190-pic.height)//2))
        if labels:d.text((x+w/2-9,245),str(labels[i]),font=font,fill='#365a73')
    path=OUT/(key+'.webp');im.save(path,'WEBP',quality=88)
    sources[key]=dict(path=str(path.relative_to(ROOT)),title='Educational photo puzzle '+key,author='LatihKu composition; source photographs credited separately',source='See component image records in sources.json',license='Component image licences apply; composition CC BY-SA 4.0',licenseUrl='https://creativecommons.org/licenses/by-sa/4.0/',components=[image(x) for x in objects if x!='?'],changes='Photographs arranged in labelled panels without changing their content.')
    return str(path.relative_to(ROOT))
photoObjects=['apple','banana','orange','kiwi','carrot','broccoli','strawberry','grape','watermelon','pineapple'];names={r[0]:r[1] for r in CATALOG['produce']}
# Count and classify shapes through photographs and their arrangements.
colors=[('apple','Merah'),('banana','Kuning'),('orange','Oren'),('broccoli','Hijau'),('strawberry','Merah')]
for i in range(5):
    key,color=colors[i%5];add('colors','color-'+str(i),('Apakah warna utama '+names[key].lower()+' dalam gambar?' if i<5 else 'Warna manakah paling sesuai untuk '+names[key].lower()+' yang ditunjukkan?'),color,['Merah','Kuning','Oren','Hijau','Biru','Ungu'], 'Warna utama dalam gambar ialah '+color.lower()+'.',image(key))
for i in range(10):
    key=photoObjects[i];n=i%5+1;img=compose('count-'+str(i),[key]*n)
    add('colors','count-'+str(i),'Berapakah panel gambar '+names[key].lower()+' yang ditunjukkan?',str(n),[str(j) for j in range(1,7)],'Ada '+str(n)+' panel gambar.',img)
for i in range(10):
    a,b=photoObjects[i],photoObjects[(i+3)%10];img=compose('pattern-'+str(i),[a,b,a,b,'?'])
    add('colors','pattern-'+str(i),'Gambar manakah menyambung corak ini?',names[a],list(names.values()),'Corak berselang-seli: '+names[a]+', '+names[b]+'.',img)
# Thirty different visual reasoning compositions: alternating, grouped and odd-one-out.
for i in range(30):
    a,b,c=photoObjects[i%10],photoObjects[(i+2)%10],photoObjects[(i+5)%10]
    if i<10:objects=[a,b,a,b,'?'];answer=names[a];prompt='Apakah gambar seterusnya dalam urutan ini?';ex='Urutan mengulang dua gambar secara berselang-seli.';choices=list(names.values());labels=None
    elif i<20:objects=[a,a,b,a];labels=['1','2','3','4'];answer='Panel 3';prompt='Panel manakah berbeza daripada tiga yang lain?';choices=['Panel 1','Panel 2','Panel 3','Panel 4'];ex='Panel 3 menunjukkan '+names[b]+', sementara panel lain menunjukkan '+names[a]+'.'
    else:objects=[a,b,c,a,b,'?'];answer=names[c];prompt='Pilih gambar untuk melengkapkan corak tiga gambar ini.';ex='Urutan mengulang '+names[a]+', '+names[b]+', '+names[c]+'.';choices=list(names.values());labels=None
    img=compose('logic-'+str(i),objects,labels);add('logic',str(i),prompt,answer,choices,ex,img)
# Five more shape questions use actual object photos.
for i,(key,shape) in enumerate([('pizza','Bulat'),('orange','Bulat'),('pancake','Bulat'),('waffle','Segi empat'),('kiwi','Bulat')]):
    add('colors','shape-'+str(i),('Apakah bentuk petak kecil pada permukaan wafel?' if key=='waffle' else 'Apakah bentuk keseluruhan objek makanan dalam gambar?'),shape,['Bulat','Segi empat','Bujur','Segi tiga'],'Bentuk keseluruhan gambar ini paling hampir dengan '+shape.lower()+'.',image(key))
for id,name,description in META:
    bank=[q for q in questions if q['category']==id];cover='flags-MY' if id=='flags' else bank[0]['id']
    categories.append(dict(id=id,name=name,description=description,cover=cover))
    if id!='flags':
        if len(bank)<30:raise ValueError(id+' has only '+str(len(bank)))
        (DATA/(id+'.json')).write_text(json.dumps(bank,ensure_ascii=False,indent=2))
(OUT/'sources.json').write_text(json.dumps(sources,ensure_ascii=False,indent=2))
# Runtime gets a compact, synchronous bank. JSON files remain separately inspectable.
used=set(q['image'] for q in questions)|set(q['audio'] for q in questions if 'audio'in q)
used.update(['assets/world-flags.svg','assets/world-scene.webp','assets/general/sources.json','assets/general/audio-sources.json','assets/general/ATTRIBUTION.md','data/general/geography-reference.json'])
used.update('data/general/'+c['id']+'.json' for c in categories if c['id']!='flags')
blob=dict(categories=categories,questions=questions,assets=sorted(used))
(ROOT/'general-data.js').write_text('// Generated by scripts/build_general_data.py; offline assets only.\nglobalThis.LATIH_GENERAL_DATA='+json.dumps(blob,ensure_ascii=False,separators=(',',':'))+';\n')
(ROOT/'general-assets.js').write_text('// Generated offline asset inventory.\nglobalThis.LATIH_GENERAL_ASSETS='+json.dumps(sorted(used),separators=(',',':'))+';\n')
lines=['# LatihKu General — media attribution','', 'Images and audio are bundled locally. Each original work retains its listed licence. No endorsement is implied.','', 'Puzzle compositions reuse the credited photographs; share-alike terms are retained.','', 'Geography facts: mledoze/countries (ODbL 1.0), https://github.com/mledoze/countries. Outline geometry: Natural Earth via datasets/geo-countries (public domain).','', 'World flags: see ../FLAGS_LICENSE.txt.','']
allRecords={**sources,**audio}
for key,r in sorted(allRecords.items()):
    if 'path'not in r:continue
    lines += ['## '+key,'',r['title'],'','- File: `'+r['path']+'`','- Author: '+r['author'],'- Source: '+r['source'],'- Licence: '+r['license']+' '+r.get('licenseUrl',''),'- Changes: '+r['changes'],'']
(OUT/'ATTRIBUTION.md').write_text('\n'.join(line.rstrip() for line in lines))
print('Questions',len(questions)+195,'categories',len(categories),'assets',len(used))
