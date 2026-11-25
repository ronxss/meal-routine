{
const $=s=>document.querySelector(s);
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl=v=>{const n=v<0;v=Math.abs(v);const[i,d]=v.toFixed(2).split('.');return(n?'−':'')+'R$ '+i.replace(/\B(?=(\d{3})+$)/g,'.')+','+d};
const brl0=v=>{const n=v<0;v=Math.round(Math.abs(v));return(n?'−':'')+'R$ '+String(v).replace(/\B(?=(\d{3})+$)/g,'.')};
const num=(v,d)=>v.toFixed(d).replace('.',',');
const wd=d=>(d+1)%7;
const iso=d=>'2026-12-'+String(d).padStart(2,'0');
const dd=d=>String(d).padStart(2,'0')+'/12';
const WDL=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const WDS=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const longDay=d=>`${WDL[wd(d)]}, ${d===1?'1º':d} de dezembro`;
const plusDays=(d,n)=>{const x=new Date(2026,11,d+n);return String(x.getDate()).padStart(2,'0')+'/'+String(x.getMonth()+1).padStart(2,'0')};
const addMin=(t,m)=>{const[h,mi]=String(t||'00:00').split(':').map(Number);let x=((h||0)*60+(mi||0)+m+1440)%1440;return String(Math.floor(x/60)).padStart(2,'0')+':'+String(x%60).padStart(2,'0')};
const SRC={p:'Procon-SP/Dieese, out/2026',b:'pesquisa em BH, nov/2026',e:'estimativa'};
const CATS={acou:'Açougue',horti:'Hortifrúti',frios:'Ovos e laticínios',pada:'Padaria',merc:'Mercearia'};
const CORD=['acou','horti','frios','pada','merc'];
const IT={
arroz:{n:'Arroz branco',c:'merc',u:'kg',k:5,pl:'pacote 5 kg',pp:21.98,s:'p'},
feijao:{n:'Feijão carioca',c:'merc',u:'kg',k:1,pl:'pacote 1 kg',pp:8.27,s:'p'},
macarrao:{n:'Macarrão',c:'merc',u:'kg',k:.5,pl:'pacote 500 g',pp:3.45,s:'p'},
flocao:{n:'Flocão de milho (cuscuz)',c:'merc',u:'kg',k:.5,pl:'pacote 500 g',pp:5,s:'e'},
aveia:{n:'Aveia em flocos',c:'merc',u:'kg',k:.5,pl:'pacote 500 g',pp:8,s:'e'},
oleo:{n:'Óleo de soja',c:'merc',u:'l',k:.9,pl:'garrafa 900 ml',pp:7.86,s:'p'},
cafe:{n:'Café em pó',c:'merc',u:'kg',k:.5,pl:'pacote 500 g',pp:24.4,s:'p'},
leite:{n:'Leite integral',c:'merc',u:'l',k:1,pl:'caixa 1 L',pp:5.71,s:'p'},
temperos:{n:'Sal, colorau, limão e cheiro-verde',c:'merc',u:'kit',k:1,pl:'kit do mês',pp:25,s:'e'},
peito:{n:'Peito de frango',c:'acou',u:'kg',k:1,pl:'kg',pp:17.05,s:'b'},
sobrecoxa:{n:'Coxa e sobrecoxa',c:'acou',u:'kg',k:1,pl:'kg',pp:13,s:'e'},
moida:{n:'Carne moída (acém)',c:'acou',u:'kg',k:.5,pl:'bandeja 500 g',pp:17.54,s:'p'},
patinho:{n:'Patinho',c:'acou',u:'kg',k:.5,pl:'bandeja 500 g',pp:26.58,s:'p'},
pernil:{n:'Pernil suíno sem osso',c:'acou',u:'kg',k:1,pl:'kg',pp:26,s:'e'},
acem:{n:'Acém em cubos',c:'acou',u:'kg',k:.5,pl:'bandeja 500 g',pp:17.54,s:'p'},
tilapia:{n:'Filé de tilápia',c:'acou',u:'kg',k:.5,pl:'bandeja 500 g',pp:25,s:'e'},
lombo:{n:'Lombo suíno',c:'acou',u:'kg',k:1,pl:'kg',pp:25,s:'e'},
figado:{n:'Fígado bovino',c:'acou',u:'kg',k:.5,pl:'bandeja 500 g',pp:10,s:'e'},
ovos:{n:'Ovos',c:'frios',u:'un',k:12,pl:'dúzia',pp:10.1,s:'p'},
iogurte:{n:'Iogurte natural',c:'frios',u:'un',k:1,pl:'pote 170 g',pp:3.5,s:'e'},
pao:{n:'Pão francês',c:'pada',u:'un',k:1,pl:'unidade',pp:.9,s:'p'},
batdoce:{n:'Batata-doce',c:'horti',u:'kg',k:1,pl:'kg',pp:6,s:'e'},
batata:{n:'Batata',c:'horti',u:'kg',k:1,pl:'kg',pp:7.75,s:'p'},
cebola:{n:'Cebola',c:'horti',u:'kg',k:.5,pl:'500 g',pp:4.18,s:'p'},
alho:{n:'Alho',c:'horti',u:'kg',k:.1,pl:'100 g',pp:3.1,s:'p'},
tomate:{n:'Tomate',c:'horti',u:'kg',k:.5,pl:'500 g',pp:4.75,s:'e'},
cenoura:{n:'Cenoura',c:'horti',u:'kg',k:.5,pl:'500 g',pp:2.75,s:'e'},
abobrinha:{n:'Abobrinha',c:'horti',u:'kg',k:.5,pl:'500 g',pp:3.5,s:'e'},
brocolis:{n:'Brócolis',c:'horti',u:'kg',k:.5,pl:'maço',pp:7,s:'e'},
repolho:{n:'Repolho',c:'horti',u:'kg',k:1,pl:'unidade (~1 kg)',pp:4.5,s:'e'},
chuchu:{n:'Chuchu',c:'horti',u:'kg',k:.5,pl:'500 g',pp:2.5,s:'e'},
banana:{n:'Banana',c:'horti',u:'un',k:6,pl:'meia dúzia',pp:5.1,s:'e'},
tapioca:{n:'Goma de tapioca',c:'merc',u:'kg',k:.5,pl:'pacote 500 g',pp:8,s:'e'},
abobora:{n:'Abóbora cabotiá',c:'horti',u:'kg',k:1,pl:'kg',pp:5,s:'e'},
cha:{n:'Chá (camomila ou erva-cidreira)',c:'merc',u:'un',k:10,pl:'caixa 10 sachês',pp:4,s:'e'},
milho:{n:'Milho de pipoca',c:'merc',u:'kg',k:.5,pl:'pacote 500 g',pp:5,s:'e'}};
const fq=(i,q)=>{const u=IT[i].u;if(i==='ovos')return Math.ceil(q-1e-6)+' ovos';if(u==='kg')return q<1?Math.max(10,Math.round(q*100)*10)+' g':num(q,1)+' kg';if(u==='l')return q<1?Math.round(q*100)*10+' ml':num(q,1)+' L';if(u==='kit')return'1 kit';return Math.ceil(q-1e-6)+' un'};
const EXL=['cebola','alho','tomate','batdoce','batata','cenoura','abobrinha','brocolis','repolho','chuchu','aveia','iogurte'];
const SUB={batdoce:'batata',batata:'batdoce',cenoura:'abobrinha',abobrinha:'cenoura',brocolis:'cenoura',repolho:'chuchu',chuchu:'abobrinha'};
const subI=(i,ex)=>{if(!ex.has(i))return i;const r=SUB[i];return r&&!ex.has(r)?r:null};
const lc=i=>IT[i].n.toLowerCase();
const exNote=(items,ex)=>[...new Set(items.filter(i=>ex.has(i)).map(i=>{const r=subI(i,ex);return r?`${lc(r)} no lugar ${['cebola','batdoce','batata','cenoura','abobrinha'].includes(i)?'da':'do'} ${lc(i)}`:`sem ${lc(i)}`}))].join(', ');
const vl=(q,skip)=>{const a=Object.keys(q).filter(i=>!skip.includes(i)).map(i=>`${q[i]} de ${lc(i)}`);return a.length>1?a.slice(0,-1).join(', ')+' e '+a[a.length-1]:a[0]||''};
const PR={
frango:{n:'Frango grelhado',sh:'Frango',i:'peito',q:.15,g:33,how:q=>`Frango do almoço: tempere ${q} de peito com alho, sal e limão. Grelhe em filés na frigideira bem quente ou asse 25 min a 200 °C.`},
moida:{n:'Carne moída com legumes',sh:'Carne moída',i:'moida',q:.15,g:30,how:q=>`Carne moída do almoço: refogue ${q} com cebola, alho e tomate até secar a água (uns 20 min). Rale um pouco de cenoura junto para render.`},
sobrecoxa:{n:'Sobrecoxa assada',sh:'Sobrecoxa',i:'sobrecoxa',q:.25,g:30,how:q=>`Sobrecoxa: tempere ${q} e asse 45–50 min a 200 °C. Tire pele e ossos antes de montar: menos gordura e cabe melhor no pote.`},
pernil:{n:'Pernil em cubos',sh:'Pernil',i:'pernil',q:.16,g:32,how:q=>`Pernil: corte ${q} em cubos, doure com cebola e alho, junte 1 copo de água e leve 20 min à pressão.`},
fritata:{n:'Fritata de forno',sh:'Fritata',i:'ovos',q:4,g:25,how:q=>`Fritata: bata ${q} com legumes picados, sal e cheiro-verde. Asse em forma untada 25–30 min a 180 °C e corte em quadrados.`},
patinho:{n:'Patinho ao molho',sh:'Patinho',i:'patinho',q:.15,g:32,how:q=>`Patinho: doure ${q} em cubos aos poucos, junte cebola, tomate e água e leve 25 min à pressão.`},
acem:{n:'Carne de panela (acém)',sh:'Carne de panela',i:'acem',q:.15,g:30,how:q=>`Carne de panela: doure ${q} de acém em cubos aos poucos, junte alho, tomate e água até cobrir e leve 35 min à pressão.`},
tilapia:{n:'Tilápia assada com limão',sh:'Tilápia',i:'tilapia',q:.15,g:30,how:q=>`Tilápia: tempere ${q} de filé com alho, sal e limão e asse 15 a 18 min a 200 °C. Asse por último: peixe passa do ponto rápido.`},
lombo:{n:'Lombo suíno assado',sh:'Lombo',i:'lombo',q:.15,g:32,how:q=>`Lombo: tempere ${q} com alho, sal, limão e colorau, cubra com papel-alumínio e asse 40 min a 200 °C; tire o papel e doure mais 10 min. Fatie fino.`},
almondega:{n:'Almôndegas ao sugo',sh:'Almôndegas',i:'moida',q:.15,g:30,how:q=>`Almôndegas: misture ${q} de carne moída com alho, sal, cheiro-verde e 1 ovo; faça bolinhas e asse 20 min a 200 °C. Termine 10 min no molho de tomate.`},
figado:{n:'Fígado acebolado',sh:'Fígado',i:'figado',q:.15,g:30,how:q=>`Fígado: corte ${q} em tiras, tempere com alho, sal e limão e grelhe 2 a 3 min de cada lado em frigideira bem quente (cebola só para quem come). Não passe do ponto: endurece.`}};
const FRV=[{n:'Frango grelhado',sh:'Frango grelhado',how:q=>`Frango grelhado: tempere ${q} de peito com alho, sal e limão e grelhe em filés na frigideira bem quente.`},{n:'Frango desfiado ao molho de tomate',sh:'Frango desfiado',how:q=>`Frango desfiado: cozinhe ${q} de peito na pressão por 15 min, desfie e refogue com cebola, alho e tomate.`},{n:'Frango assado com ervas',sh:'Frango assado',how:q=>`Frango assado: corte ${q} de peito em cubos, tempere com alho, colorau e cheiro-verde e asse 25 min a 200 °C.`},{n:'Frango em cubos com legumes',sh:'Frango em cubos',how:q=>`Frango em cubos: doure ${q} de peito em cubos na frigideira e junte os legumes do almoço no fim, por 3 min.`}];
const pv=(p,s)=>p==='frango'?FRV[s.i%FRV.length]:PR[p];
const PORD=['frango','acem','tilapia','sobrecoxa','moida','lombo','almondega','patinho','pernil','figado','fritata'];
const SO={
frango:{n:'Sopa de frango com legumes',sh:'Sopa de frango',p:{peito:.12,batdoce:.1,cenoura:.05,chuchu:.05},pr:'peito',cb:'batdoce',g:30,need:'frango',how:(q,tp)=>`Sopa de frango: refogue ${tp}, junte ${q.peito} de peito em cubos e os legumes (${vl(q,['peito'])}). Cubra com água e cozinhe 25 min.`},
carne:{n:'Sopa de carne moída com legumes',sh:'Sopa de carne',p:{moida:.1,batata:.1,cenoura:.05,chuchu:.05},pr:'moida',cb:'batata',g:22,need:'moida',how:(q,tp)=>`Sopa de carne: doure ${q.moida} de carne moída com ${tp} e junte os legumes em cubos (${vl(q,['moida'])}). Água para cobrir, 25 min.`},
feijao:{n:'Caldo de feijão com frango desfiado',sh:'Caldo de feijão',p:{feijao:.06,peito:.06,cenoura:.05,repolho:.05},pr:'peito',cb:'feijao',g:26,need:'frango',how:(q,tp)=>`Caldo de feijão: cozinhe ${q.peito} de peito na pressão por 15 min e desfie. Bata metade do feijão separado (${q.feijao}, medida crua) no liquidificador e volte à panela com o frango e os legumes picados (${vl(q,['peito','feijao'])}), 15 min.`},
canja:{n:'Canja de frango',sh:'Canja',p:{peito:.12,arroz:.03,cenoura:.05,abobrinha:.04},pr:'peito',cb:'arroz',g:30,need:'frango',how:(q,tp)=>`Canja: cozinhe ${q.peito} de peito com ${tp} até desfiar, junte ${q.arroz} de arroz e os legumes (${vl(q,['peito','arroz'])}). 20 min, mexendo.`}};
const SORD=['frango','feijao','carne','canja'];
const CB={
batdoce:{n:'batata-doce',i:'batdoce',q:.2,g:3,how:q=>`Batata-doce: ${q} em rodelas, assada 30–35 min a 200 °C (ou cozida 15 min).`},
macarrao:{n:'macarrão',i:'macarrao',q:.08,g:10,how:q=>`Macarrão: ${q}, cozido 2 min a menos que o pacote indica. Um fio de óleo evita que grude.`},
pure:{n:'purê de batata',i:'batata',q:.2,g:4,how:q=>`Purê: cozinhe ${q} de batata e amasse com um pouco de leite e sal.`},
arroz:{n:'arroz',i:'arroz',q:.08,g:6,how:()=>''}};
const CORD2=['batdoce','macarrao','pure','arroz'];
const VG={cenabo:{n:'cenoura e abobrinha',p:{cenoura:.06,abobrinha:.06}},broc:{n:'brócolis e cenoura',p:{brocolis:.07,cenoura:.05}},repolho:{n:'repolho refogado',p:{repolho:.12}},chuchu:{n:'chuchu e cenoura',p:{chuchu:.07,cenoura:.05}}};
const VORD=['cenabo','broc','repolho','chuchu'];
const BASE={cebola:.02,alho:.0025,oleo:.006,tomate:.015},SBASE={cebola:.015,alho:.002,oleo:.003};
const BF={paoovo:{t:'1 pão francês com 2 ovos mexidos',it:f=>({pao:1,ovos:2}),g:16},cuscuz:{t:'Cuscuz com 2 ovos',it:f=>({flocao:.05*f.cf,ovos:2}),g:15},aveia:{t:'Mingau de aveia com leite e banana',it:f=>({aveia:.04*f.cf,leite:.2,banana:1}),g:13}};
const LN={frutaovo:{t:'Banana + 1 ovo cozido',it:()=>({banana:1,ovos:1}),g:7},iogurte:{t:'Iogurte natural com banana',it:()=>({iogurte:1,banana:1}),g:7},fruta:{t:'Banana (ou outra fruta da época)',it:()=>({banana:1}),g:1}};
const PRE={t:'Banana com aveia',it:()=>({banana:1,aveia:.02}),g:3};
const CUP=.007;
const TYPES=['Musculação: superior','Musculação: inferior','Musculação: corpo todo','Funcional','Cardio','Corrida','Caminhada','Esporte','Mobilidade'];
const tr=(on,t,y)=>({on,t,y});
const DEF={budget:800,reserve:0,goal:'perder',tC:'07:00',tA:'12:00',tL:'16:00',tJ:'19:30',tZ:'21:30',ceia:'cha',cafe:'alternar',lanche:'frutaovo',almoco:true,jantar:true,jtipo:'sopa',fds:true,prepMode:'semanal',prepDay:0,shop:'semanal',dupla:true,avAgua:true,
cf:{cafe:true,almoco:true,lanche:true,jantar:false},
fit:false,
prot:{frango:true,moida:true,sobrecoxa:true,pernil:true,fritata:true,patinho:true,acem:true,tilapia:true,lombo:true,almondega:true,figado:true},
ppl:[{n:'Ronaldo',w:75,ex:[],train:[tr(false,'09:00','Caminhada'),tr(true,'18:30','Musculação: superior'),tr(false,'18:30','Cardio'),tr(true,'18:30','Musculação: inferior'),tr(false,'18:30','Cardio'),tr(true,'18:30','Musculação: corpo todo'),tr(false,'09:00','Corrida')]},
 {n:'Laila',w:62,ex:['batdoce','cebola','aveia','iogurte'],train:[tr(false,'09:00','Caminhada'),tr(false,'19:00','Funcional'),tr(true,'19:00','Funcional'),tr(false,'19:00','Cardio'),tr(true,'19:00','Funcional'),tr(false,'19:00','Cardio'),tr(true,'09:00','Corrida')]}],
pp:{}};
const ENUM={goal:['perder','manter','ganhar'],cafe:['alternar','paoovo','cuscuz','aveia','nao'],lanche:['frutaovo','iogurte','fruta','nao'],jtipo:['sopa','prato'],ceia:['cha','pipoca','ovo','nao'],prepMode:['semanal','quinzenal'],shop:['semanal','mensal']};
const DEFFREE={'2026-12-24':['jantar'],'2026-12-25':['almoco','jantar'],'2026-12-31':['jantar']};
const clone=o=>JSON.parse(JSON.stringify(o));
const fresh=()=>({v:5,at:0,s:clone(DEF),free:clone(DEFFREE),done:{},spent:{},extra:[],got:{},water:{}});
const isObj=o=>o&&typeof o==='object'&&!Array.isArray(o);
const mtrain=(src,def)=>def.map((t,i)=>{const x=Array.isArray(src)&&isObj(src[i])?src[i]:{};return{on:'on' in x?!!x.on:t.on,t:typeof x.t==='string'&&/^\d\d:\d\d$/.test(x.t)?x.t:t.t,y:typeof x.y==='string'?x.y.slice(0,40):t.y}});
function merge(r){const b=fresh();if(!isObj(r))return b;b.at=+r.at||0;const v1=(+r.v||1)<2;
 if(isObj(r.s)){const s=r.s;
  for(const k in DEF)if(k in s&&typeof s[k]===typeof DEF[k]&&!isObj(DEF[k])&&!Array.isArray(DEF[k]))b.s[k]=s[k];
  for(const k in ENUM)if(!ENUM[k].includes(b.s[k]))b.s[k]=DEF[k];
  if(typeof b.s.prepDay!=='number'||b.s.prepDay<0||b.s.prepDay>6)b.s.prepDay=0;
  if(isObj(s.prot))for(const k in DEF.prot)b.s.prot[k]=!!(k in s.prot?s.prot[k]:DEF.prot[k]);
  if(isObj(s.cf))for(const k in DEF.cf)if(k in s.cf)b.s.cf[k]=!!s.cf[k];
  if(isObj(s.pp))for(const k in s.pp)if(IT[k]&&+s.pp[k]>0)b.s.pp[k]=+s.pp[k];
  if(Array.isArray(s.ppl))b.s.ppl=DEF.ppl.map((d,i)=>{const x=isObj(s.ppl[i])?s.ppl[i]:{};return{n:typeof x.n==='string'&&x.n.trim()?x.n.slice(0,20):d.n,w:+x.w>=35&&+x.w<=200?+x.w:d.w,ex:Array.isArray(x.ex)?x.ex.filter(i=>EXL.includes(i)):d.ex.slice(),np:Array.isArray(x.np)?x.np.filter(i=>PORD.includes(i)):[],train:mtrain(x.train,d.train)}});
  if(v1){b.s.goal='perder';b.s.dupla=true;b.s.cafe=DEF.cafe;b.s.lanche=DEF.lanche;b.s.reserve=DEF.reserve;b.s.tJ=DEF.tJ;b.s.prot=clone(DEF.prot);
   if(+s.weight>=35&&+s.weight<=200)b.s.ppl[0].w=+s.weight;if(Array.isArray(s.train))b.s.ppl[0].train=mtrain(s.train,DEF.ppl[0].train)}}
 if(isObj(r.free)){b.free={};for(const k in r.free)if(Array.isArray(r.free[k]))b.free[k]=r.free[k].filter(x=>typeof x==='string')}
 for(const k of['done','got','spent','water'])if(isObj(r[k]))b[k]=r[k];
 if(Array.isArray(r.extra))b.extra=r.extra.filter(isObj).map(x=>({id:String(x.id||Math.random()),d:Math.min(31,Math.max(1,+x.d||1)),desc:String(x.desc||'').slice(0,60),v:+x.v||0}));
 if((+r.v||1)<5){const nm=['Ronaldo','Laila'];b.s.ppl.forEach((p,i)=>{if(p.n==='Pessoa '+(i+1))p.n=nm[i]});b.at=Date.now()}
 if((+r.v||1)<4){for(const k in DEF.prot)b.s.prot[k]=true;b.s.fit=false;b.at=Date.now()}
 if((+r.v||1)<3&&b.s.ppl[1]){for(const i of['aveia','iogurte'])if(!b.s.ppl[1].ex.includes(i))b.s.ppl[1].ex.push(i);b.at=Date.now()}
 if(v1)b.at=Date.now();
 return b}
const LS='dieta-dez-2026';
let st=(()=>{try{return merge(JSON.parse(localStorage.getItem(LS)))}catch(e){return fresh()}})();
const ui={me:(()=>{try{return localStorage.getItem('dieta-me')}catch(e){return null}})(),day:null,open:new Set(['t0','s0']),arm:false,who:(()=>{try{return localStorage.getItem('dieta-who')}catch(e){return null}})()};
const price=i=>((st.s.pp[i]>0?st.s.pp[i]:IT[i].pp)/IT[i].k);
const people=S=>S.dupla?S.ppl:[S.ppl[0]];
const factors=(S,w)=>{const wf=Math.min(1.35,Math.max(.8,(+w||70)/75));return{wf,pf:wf*(S.goal==='ganhar'?1.15:1),cf:wf*(S.goal==='perder'?.75:S.goal==='ganhar'?1.3:1)}};
const water=(w,t)=>(35*(+w||70)+(t?500:0))/1000;
const soupOk=(S,k)=>!SO[k].need||S.prot[SO[k].need];

function sessionsOf(S){const a=[1],thr=S.prepMode==='semanal'?4:10;
 for(let d=2;d<=31;d++)if(wd(d)===+S.prepDay&&d-a[a.length-1]>=thr)a.push(d);
 if(a.length>1&&32-a[a.length-1]<3)a.pop();
 return a.map((x,i)=>({i,a:x,b:(a[i+1]||32)-1}))}

const CE={cha:{t:'Chá de camomila ou erva-cidreira',it:()=>({cha:1}),g:0},pipoca:{t:'Pipoca de panela (20 g de milho)',it:()=>({milho:.02}),g:2},ovo:{t:'1 ovo cozido',it:()=>({ovos:1}),g:6}};
const B3=[['cebola',f=>BASE.cebola],['alho',f=>BASE.alho],['tomate',f=>BASE.tomate]];
const RG=[['cafe','Café da manhã','Feito na hora, todo dia.'],['almoco','Almoço','Feito no dia do preparo e guardado em potes. Cada pote leva a carne do dia, arroz, feijão e legumes.'],['lanche','Café da tarde e pré-treino','Feito na hora. Os ovos cozidos podem ser feitos no dia do preparo.'],['jantar','Jantar','Feito no dia do preparo e guardado em potes.'],['ceia','Ceia','Feita na hora, umas 2 h depois do jantar.']];
const HM={prato:'Esquentar: na véspera, passe do freezer para a geladeira. Vire o pote numa frigideira com 2 a 3 colheres de sopa de água, tampe e aqueça em fogo médio-baixo por 6 a 8 min, mexendo.',sopa:'Esquentar: na véspera, passe do freezer para a geladeira. Na panela, mexendo, até ferver.',geo:'Geladeira até 3 dias; freezer até 30 dias.'};
const RC={
'b:paoovo':{g:'cafe',n:'Pão com ovos mexidos',t:'5 min',ing:[['pao',()=>1],['ovos',()=>2]],ex:'sal e 1 fio de óleo',st:['Bata os ovos com uma pitada de sal.','Aqueça a frigideira em fogo baixo com um fio de óleo e mexa os ovos devagar até firmarem, ainda úmidos (2 a 3 min).','Sirva dentro do pão. Pão congelado: 2 min na frigideira tampada.'],gu:'Congele o pão em saquinhos no dia da compra.'},
'b:cuscuz':{g:'cafe',n:'Cuscuz com ovos',t:'20 min',ing:[['flocao',f=>.05*f.cf],['ovos',()=>2]],ex:'sal e água',st:['Molhe o flocão com sal e água aos poucos até ficar como areia úmida. Descanse 10 min.','Água até a marca da cuscuzeira, o flocão por cima sem apertar. Tampe e cozinhe 10 a 12 min no vapor.','Sirva com os ovos mexidos ou cozidos.'],gu:'Sobra de cuscuz: geladeira por até 2 dias; esquente na frigideira com um fio de água, tampado.'},
'b:aveia':{g:'cafe',n:'Mingau de aveia com banana',t:'7 min',ing:[['aveia',f=>.04*f.cf],['leite',()=>.2],['banana',()=>1]],ex:'canela (opcional)',st:['Leve leite e aveia ao fogo baixo, mexendo, 4 a 5 min até engrossar.','Desligue e junte a banana amassada ou em rodelas. Canela por cima, se quiser.'],gu:'Feito na hora.'},
'p:frango0':{g:'almoco',n:'Frango grelhado',t:'30 min',ing:[['peito',f=>.15*f.pf]].concat(B3),ex:'sal, limão, colorau',st:['Corte o peito em filés finos e tempere com alho, sal e limão (15 min).','Grelhe em frigideira bem quente com um fio de óleo, 3 a 4 min de cada lado, sem mexer antes de dourar.','Fatie depois de esfriar um pouco: fica mais suculento no pote.'],m:'prato'},
'p:frango1':{g:'almoco',n:'Frango desfiado ao molho de tomate',t:'40 min',ing:[['peito',f=>.15*f.pf]].concat(B3),ex:'sal, colorau, cheiro-verde',st:['Cozinhe o peito na pressão com água e sal por 15 min. Desfie com dois garfos.','Refogue alho (e cebola, se for o caso) e o tomate picado até desmanchar.','Junte o frango e um pouco do caldo do cozimento; 5 min em fogo baixo. Cheiro-verde no fim.'],m:'prato'},
'p:frango2':{g:'almoco',n:'Frango assado com ervas',t:'35 min',ing:[['peito',f=>.15*f.pf]].concat(B3),ex:'sal, colorau, cheiro-verde, orégano',st:['Corte em cubos grandes e tempere com alho, sal, colorau e orégano.','Espalhe numa assadeira sem amontoar. Forno a 200 °C por 25 min, virando na metade.'],m:'prato'},
'p:frango3':{g:'almoco',n:'Frango em cubos com legumes',t:'25 min',ing:[['peito',f=>.15*f.pf]].concat(B3),ex:'sal, colorau',st:['Doure os cubos de frango em frigideira bem quente, em partes, para não soltar água.','Junte alho, tomate e os legumes do almoço no fim, por 3 min. Acerte o sal.'],m:'prato'},
'p:moida':{g:'almoco',n:'Carne moída com legumes',t:'25 min',ing:[['moida',f=>.15*f.pf]].concat(B3),ex:'sal, cheiro-verde',st:['Doure a carne em panela quente, sem mexer nos primeiros 3 min.','Junte alho e tomate e refogue até secar a água (uns 15 min).','Rale um pouco de cenoura junto para render.'],m:'prato'},
'p:sobrecoxa':{g:'almoco',n:'Sobrecoxa assada',t:'55 min',ing:[['sobrecoxa',f=>.25*f.pf]].concat(B3),ex:'sal, limão, colorau',st:['Tempere com alho, sal, limão e colorau.','Asse a 200 °C por 45 a 50 min, pele para cima.','Tire pele e ossos antes de montar os potes.'],m:'prato'},
'p:pernil':{g:'almoco',n:'Pernil em cubos',t:'35 min',ing:[['pernil',f=>.16*f.pf]].concat(B3),ex:'sal, limão',st:['Doure os cubos com alho.','Junte 1 copo de água e leve 20 min à pressão. Destampe e deixe o caldo engrossar.'],m:'prato'},
'p:fritata':{g:'almoco',n:'Fritata de forno',t:'35 min',ing:[['ovos',()=>4]].concat(B3),ex:'sal, cheiro-verde, legumes picados',st:['Bata os ovos com sal, cheiro-verde e um pouco dos legumes picados.','Forma untada, forno a 180 °C por 25 a 30 min, até firmar no centro.','Espere amornar e corte em quadrados.'],m:'prato'},
'p:patinho':{g:'almoco',n:'Patinho ao molho',t:'40 min',ing:[['patinho',f=>.15*f.pf]].concat(B3),ex:'sal, louro',st:['Doure os cubos aos poucos, sem lotar a panela.','Junte alho, tomate e água até cobrir. 25 min na pressão.'],m:'prato'},
'p:acem':{g:'almoco',n:'Carne de panela (acém)',t:'50 min',ing:[['acem',f=>.15*f.pf]].concat(B3),ex:'sal, louro, colorau',st:['Corte em cubos médios e doure aos poucos em panela bem quente.','Junte alho, tomate, louro e água até cobrir. 35 min na pressão.','Destampe e deixe o caldo engrossar 5 min.'],m:'prato'},
'p:tilapia':{g:'almoco',n:'Tilápia assada com limão',t:'25 min',ing:[['tilapia',f=>.15*f.pf]].concat(B3),ex:'sal, limão, cheiro-verde',st:['Tempere os filés com alho, sal e limão (10 min, não mais: o limão “cozinha” o peixe).','Assadeira untada, 200 °C por 15 a 18 min, até lascar com o garfo.','No pote, ponha o peixe por cima do arroz para não desmanchar.'],m:'prato'},
'p:lombo':{g:'almoco',n:'Lombo suíno assado',t:'1 h',ing:[['lombo',f=>.15*f.pf]].concat(B3),ex:'sal, limão, colorau',st:['Tempere com alho, sal, limão e colorau (de véspera fica melhor).','Cubra com papel-alumínio e asse 40 min a 200 °C. Tire o papel e doure mais 10 min.','Espere 10 min antes de fatiar fino.'],m:'prato'},
'p:almondega':{g:'almoco',n:'Almôndegas ao sugo',t:'40 min',ing:[['moida',f=>.15*f.pf]].concat(B3),ex:'1 ovo para a massa toda, sal, cheiro-verde',st:['Misture a carne com alho, sal, cheiro-verde e o ovo. Faça bolinhas do tamanho de uma noz.','Asse 20 min a 200 °C (não precisa fritar).','Termine 10 min num molho de tomate refogado com alho.'],m:'prato'},
'p:figado':{g:'almoco',n:'Fígado acebolado',t:'20 min',ing:[['figado',f=>.15*f.pf]].concat(B3),ex:'sal, limão',st:['Corte em tiras e tempere com alho, sal e limão.','Frigideira bem quente, 2 a 3 min de cada lado. Não passe do ponto: endurece.','Cebola fatiada refogada por cima, só nos potes de quem come cebola.'],m:'prato'},
'arroz':{g:'almoco',n:'Arroz branco',t:'25 min',ing:[['arroz',f=>.08*f.cf]],ex:'alho, sal, 1 fio de óleo',st:['Refogue o alho no óleo, junte o arroz e mexa 1 min.','2 partes de água fervente para 1 de arroz, sal. Tampe e cozinhe em fogo baixo uns 18 min.','Desligue um pouco antes do ponto: termina de cozinhar ao esquentar.'],m:'prato'},
'feijao':{g:'almoco',n:'Feijão carioca',t:'45 min + molho',ing:[['feijao',f=>.05*f.wf]],ex:'alho, louro, sal',st:['Na véspera, deixe de molho em bastante água. Descarte a água.','Pressão com água 3 dedos acima e louro: 25 a 30 min depois de pegar pressão.','Refogue alho (e cebola, se for o caso), junte o feijão e deixe engrossar 10 min.'],m:'prato'},
'v:cenabo':{g:'almoco',n:'Cenoura e abobrinha',t:'10 min',ing:[['cenoura',()=>.06],['abobrinha',()=>.06]],ex:'sal',st:['Corte em cubos ou meias-luas do mesmo tamanho.','Vapor ou frigideira tampada com um fio de água: cenoura 4 min, abobrinha mais 2 min. Al dente.'],m:'prato'},
'v:broc':{g:'almoco',n:'Brócolis e cenoura',t:'10 min',ing:[['brocolis',()=>.07],['cenoura',()=>.05]],ex:'sal',st:['Brócolis em buquês: 2 min em água fervendo e direto em água gelada.','Cenoura em rodelas no vapor por 4 min.'],m:'prato'},
'v:repolho':{g:'almoco',n:'Repolho refogado',t:'10 min',ing:[['repolho',()=>.12]],ex:'alho, sal',st:['Fatie fino. Refogue com alho em fogo alto por 3 a 4 min, mexendo: tem que ficar crocante.'],m:'prato'},
'v:chuchu':{g:'almoco',n:'Chuchu e cenoura',t:'12 min',ing:[['chuchu',()=>.07],['cenoura',()=>.05]],ex:'sal, cheiro-verde',st:['Cubos médios. Frigideira tampada com alho e um fio de água por 5 min.'],m:'prato'},
'l:frutaovo':{g:'lanche',n:'Banana com ovo cozido',t:'12 min',ing:[['banana',()=>1],['ovos',()=>1]],ex:'sal',st:['Ovo em água fervendo por 10 min; depois água fria.','Dá para cozinhar os ovos da semana no dia do preparo e guardar com casca na geladeira.']},
'l:iogurte':{g:'lanche',n:'Iogurte com banana',t:'2 min',ing:[['iogurte',()=>1],['banana',()=>1]],ex:'canela (opcional)',st:['Banana em rodelas por cima do iogurte.']},
'l:fruta':{g:'lanche',n:'Banana',t:'—',ing:[['banana',()=>1]],ex:'',st:['Se cansar da banana, troque por uma fruta da época no mesmo preço.']},
'l:pre':{g:'lanche',n:'Pré-treino: banana com aveia',t:'2 min',ing:[['banana',()=>1],['aveia',()=>.02]],ex:'canela (opcional)',st:['Amasse a banana e misture a aveia. Coma uns 60 min antes do treino.']},
'l:preovo':{g:'lanche',n:'Pré-treino: banana com ovo cozido',t:'12 min',ing:[['banana',()=>1],['ovos',()=>1]],ex:'sal',st:['Ovo em água fervendo por 10 min; depois água fria. Coma uns 60 min antes do treino.']},
's:frango':{g:'jantar',n:'Sopa de frango com legumes',t:'40 min',so:'frango',ex:'sal, cheiro-verde',st:['Refogue o tempero, junte o frango em cubos e doure 5 min.','Junte os legumes em cubos e água para cobrir com 2 dedos de folga. 25 min em fogo médio.','Acerte o sal e finalize com cheiro-verde.'],m:'sopa'},
's:carne':{g:'jantar',n:'Sopa de carne moída com legumes',t:'40 min',so:'carne',ex:'sal, cheiro-verde',st:['Doure a carne com o tempero.','Junte os legumes em cubos e água para cobrir. 25 min, até a batata desmanchar um pouco.'],m:'sopa'},
's:feijao':{g:'jantar',n:'Caldo de feijão com frango desfiado',t:'30 min (com o feijão já cozido)',so:'feijao',ex:'alho, sal, cheiro-verde',st:['Separe parte do feijão cozido do almoço (já está na conta do preparo).','Cozinhe o frango na pressão por 15 min e desfie.','Bata metade do feijão no liquidificador, volte à panela com o frango e os legumes picados, 15 min.'],m:'sopa'},
's:canja':{g:'jantar',n:'Canja de frango',t:'40 min',so:'canja',ex:'sal, cheiro-verde',st:['Cozinhe o frango com o tempero até desfiar (pressão 15 min). Desfie.','Volte à panela com o arroz, os legumes e o caldo. 20 min, mexendo, até o arroz abrir.'],m:'sopa'},
'c:batdoce':{g:'jantar',n:'Batata-doce assada',t:'35 min',ing:[['batdoce',f=>.2*f.cf]],ex:'sal, alecrim',st:['Rodelas de 1 cm, assadeira untada, 200 °C por 30 a 35 min, virando na metade.'],m:'prato'},
'c:batata':{g:'jantar',n:'Batata assada',t:'35 min',ing:[['batata',f=>.2*f.cf]],ex:'sal, alecrim',st:['Rodelas de 1 cm, assadeira untada, 200 °C por 30 a 35 min, virando na metade.'],m:'prato'},
'c:pure':{g:'jantar',n:'Purê de batata',t:'30 min',ing:[['batata',f=>.2*f.cf],['leite',()=>.03]],ex:'sal',st:['Cozinhe a batata em cubos até ficar macia (15 min).','Amasse com o leite quente e sal. Purê congela melhor que batata em pedaços.'],m:'prato'},
'c:macarrao':{g:'jantar',n:'Macarrão',t:'15 min',ing:[['macarrao',f=>.08*f.cf]],ex:'sal, 1 fio de óleo',st:['Cozinhe 2 min a menos que o pacote indica. Escorra e regue com um fio de óleo para não grudar.'],m:'prato'},
'z:cha':{g:'ceia',n:'Chá de camomila ou erva-cidreira',t:'5 min',ing:[['cha',()=>1]],ex:'sem açúcar',st:['Água quase fervendo sobre o sachê, tampe a xícara e espere 5 min.']},
'z:pipoca':{g:'ceia',n:'Pipoca de panela',t:'5 min',ing:[['milho',()=>.02]],ex:'1 colher de chá de óleo, sal',st:['Panela tampada com o óleo e o milho em fogo médio. Quando começar a estourar, chacoalhe de vez em quando até parar.']},
'z:ovo':{g:'ceia',n:'Ovo cozido',t:'12 min',ing:[['ovos',()=>1]],ex:'sal',st:['Água fervendo por 10 min; depois água fria. Pode ser cozido no dia do preparo.']}};
Object.assign(RC,{
'b:tapioca':{g:'cafe',n:'Tapioca com ovo mexido',t:'10 min',ing:[['tapioca',()=>.05],['ovos',()=>2]],ex:'sal',st:['Espalhe a goma peneirada na frigideira fria, sem óleo, e leve ao fogo médio até as bordas soltarem (1 a 2 min).','Vire, recheie com os ovos mexidos e dobre.']},
'b:crepioca':{g:'cafe',n:'Crepioca',t:'8 min',ing:[['tapioca',()=>.03],['ovos',()=>2]],ex:'sal, orégano',st:['Bata os ovos com a goma e o sal até ficar liso.','Frigideira untada em fogo médio, 2 min de cada lado, como uma panqueca.']},
'b:omelete':{g:'cafe',n:'Omelete de tomate com pão',t:'10 min',ing:[['ovos',()=>2],['tomate',()=>.04],['pao',()=>1]],ex:'sal, cheiro-verde',st:['Bata os ovos com sal e cheiro-verde e junte o tomate picado sem sementes.','Frigideira untada em fogo baixo, tampada, 3 a 4 min até firmar. Dobre ao meio.']},
'b:ovocozido':{g:'cafe',n:'Pão com ovo cozido e banana',t:'12 min',ing:[['pao',()=>1],['ovos',()=>2],['banana',()=>1]],ex:'sal',st:['Ovos em água fervendo por 10 min; depois água fria.','Dá para deixar os ovos da semana cozidos na geladeira, com casca.']},
'p:escondidinho':{g:'almoco',n:'Escondidinho de carne moída',t:'50 min',ing:[['moida',f=>.15*f.pf],['batata',f=>.15*f.cf]].concat(B3),ex:'sal, um pouco de leite',st:['Refogue a carne com alho e tomate até secar.','Faça um purê com a batata cozida, um pouco de leite e sal.','Numa travessa: carne embaixo, purê por cima. Forno a 200 °C por 15 min para dourar. Porcione nos potes.'],m:'prato'},
'p:xadrez':{g:'almoco',n:'Frango xadrez',t:'30 min',ing:[['peito',f=>.15*f.pf],['cenoura',()=>.04],['abobrinha',()=>.04]].concat(B3),ex:'sal, shoyu (opcional)',st:['Doure o frango em cubos em panela bem quente, em partes.','Junte cenoura e abobrinha em cubos e refogue 3 min, ainda crocantes.','Um fio de shoyu ou água com sal no fim.'],m:'prato'},
'p:strogonoff':{g:'almoco',n:'Strogonoff leve de frango',t:'30 min',ing:[['peito',f=>.15*f.pf],['leite',()=>.05]].concat(B3),ex:'sal, 1 colher de amido de milho para a panela toda',st:['Doure o frango em cubos com alho.','Junte o tomate picado e cozinhe até desmanchar.','Dissolva o amido no leite frio, junte e mexa até engrossar (2 min).'],m:'prato'},
'p:moqueca':{g:'almoco',n:'Moqueca de tilápia',t:'30 min',ing:[['tilapia',f=>.15*f.pf]].concat(B3),ex:'colorau, limão, cheiro-verde, 1 fio de óleo',st:['Tempere os filés com limão, alho e sal.','Na panela, faça camadas de tomate e peixe; colorau e um fio de óleo por cima.','Tampe e cozinhe 15 min em fogo baixo, sem mexer. Cheiro-verde no fim.'],m:'prato'},
'p:bife':{g:'almoco',n:'Bife de patinho acebolado',t:'15 min',ing:[['patinho',f=>.15*f.pf]].concat(B3),ex:'sal',st:['Bifes finos, temperados só com sal e alho na hora.','Frigideira muito quente, 1 a 2 min de cada lado.','Cebola fatiada refogada por cima só para quem come.'],m:'prato'},
'l:ovos2':{g:'lanche',n:'Dois ovos cozidos',t:'12 min',ing:[['ovos',()=>2]],ex:'sal, orégano',st:['Água fervendo por 10 min; depois água fria. Faça os da semana de uma vez.']},
'l:pipoca':{g:'lanche',n:'Pipoca de panela',t:'5 min',ing:[['milho',()=>.025]],ex:'1 colher de chá de óleo, sal',st:['Panela tampada com o óleo e o milho em fogo médio, chacoalhando até parar de estourar.']},
'l:bananaassada':{g:'lanche',n:'Banana assada com canela',t:'15 min',ing:[['banana',()=>1]],ex:'canela',st:['Banana com casca, cortada ao meio no comprimento. Forno a 200 °C ou frigideira tampada por 10 min. Canela por cima.']},
'l:tapiocaovo':{g:'lanche',n:'Tapioca pequena com ovo',t:'8 min',ing:[['tapioca',()=>.03],['ovos',()=>1]],ex:'sal',st:['Goma na frigideira fria, fogo médio até soltar. Recheie com o ovo mexido.']},
's:abobora':{g:'jantar',n:'Creme de abóbora com frango desfiado',t:'40 min',ing:[['abobora',()=>.2],['peito',f=>.1*f.pf]].concat(B3),ex:'sal, cheiro-verde',st:['Cozinhe a abóbora em cubos com alho e água até desmanchar (15 min). Bata no liquidificador.','Cozinhe o frango na pressão 15 min e desfie. Junte ao creme e ferva 5 min.'],m:'sopa'},
's:legumes':{g:'jantar',n:'Sopa de legumes com ovo',t:'30 min',ing:[['cenoura',()=>.06],['chuchu',()=>.06],['batata',f=>.1*f.cf],['ovos',()=>2]].concat(B3),ex:'sal, cheiro-verde',st:['Legumes em cubos com alho e água para cobrir, 20 min.','Na hora de servir, quebre os ovos na sopa fervendo e espere 3 min sem mexer.'],m:'sopa'},
'j:omelete':{g:'jantar',n:'Omelete de legumes (na hora)',t:'10 min',ing:[['ovos',()=>3],['abobrinha',()=>.05],['tomate',()=>.04]],ex:'sal, cheiro-verde',st:['Refogue a abobrinha ralada 2 min. Junte os ovos batidos com sal e o tomate.','Tampe em fogo baixo por 4 min. Bom para dias em que a marmita acabou.']},
'z:leite':{g:'ceia',n:'Leite morno com canela',t:'3 min',ing:[['leite',()=>.2]],ex:'canela',st:['Aqueça sem ferver e polvilhe canela.']},
'z:bananaassada':{g:'ceia',n:'Banana assada com canela',t:'15 min',ing:[['banana',()=>1]],ex:'canela',st:['Banana com casca, cortada ao meio. Frigideira tampada por 10 min.']}});
const ranges=a=>{a=[...a].sort((x,y)=>x-y);const o=[];for(let i=0;i<a.length;i++){let j=i;while(j+1<a.length&&a[j+1]===a[j]+1)j++;o.push(j>i+1?`${a[i]} a ${a[j]}`:j===i+1?`${a[i]}, ${a[j]}`:`${a[i]}`);i=j}return o.join(', ')};
function vReceitas(){const P=plan,PP=P.PP,S=st.s,wh=PP.length>1?cw():null,PS=wh==null?PP:[PP[wh]],RDw=wh==null?P.rdays:P.rdp[wh],np=wh==null?[]:(PP[wh].np||[]),col=qs=>wh==null?qs:[qs[wh]];const exw=wh==null?new Set():new Set(PP[wh].ex||[]),bad=wh==null?[]:np.map(x=>PR[x].i).filter(i=>!PORD.some(y=>!np.includes(y)&&PR[y].i===i)).concat([...exw].filter(i=>!['cebola','alho','tomate'].includes(i)||!subI(i,exw)));
 const rows=(k,R)=>{const L=[];if(R.so){const X=SO[R.so],exu=new Set(PP.flatMap(p=>p.ex||[]));for(const i in X.p){const j=subI(i,exu);if(!j)continue;L.push([j,PP.map((p,pi)=>{const f=P.F[pi];return X.p[i]*(i===X.pr?f.pf:i===X.cb?(i==='feijao'?f.wf:f.cf):1)})])}for(const i in SBASE){const j=subI(i,exu);if(j&&i!=='oleo')L.push([j,PP.map(()=>SBASE[i])])}return L}
  const ex=PP.map(p=>new Set(p.ex||[]));const seen={};R.ing.forEach(([i,fn])=>{PP.forEach((p,pi)=>{const j=subI(i,ex[pi]);if(!j)return;(seen[j]=seen[j]||PP.map(()=>null))[pi]=fn(P.F[pi])})});return Object.entries(seen)};
 const fmt=(i,q)=>q==null?'—':i==='ovos'?`${Math.round(q*10)/10} ovo${q>1?'s':''}`.replace('.',','):i==='pao'||i==='banana'||i==='iogurte'||i==='cha'?`${Math.round(q)} un`:IT[i].u==='kg'&&q<.1?`${Math.round(q*1000)} g`:IT[i].u==='l'&&q<.1?`${Math.round(q*1000)} ml`:fq(i,q);
 return`<div class="wrap"><section class="sec"><h2>Receitas do mês${wh!=null?' de '+esc(PP[wh].n):''}</h2><p class="sub">Primeiro o que está no plano, com os dias em que aparece; depois outras opções para variar. Porção de cada um em todas. As quantidades para cozinhar de uma vez estão em Marmitas.</p>
 <div class="chips" style="margin-bottom:6px">${RG.map(([g,l])=>`<button class="chip" data-jump="${g}">${l}</button>`).join('')}</div></section>
 ${RG.map(([g,l,sub])=>{const ks=Object.keys(RC).filter(k=>RC[k].g===g&&RDw[k]),os=Object.keys(RC).filter(k=>RC[k].g===g&&!RDw[k]&&!np.includes(k.slice(2))&&(wh==null||rows(k,RC[k]).some(([i,qs])=>qs[wh]!=null))&&!(RC[k].ing||[]).some(([i])=>bad.includes(i)));if(!ks.length&&!os.length)return'';
  const card=(k,inp)=>{const R=RC[k],ds=RDw[k],id='r'+k.replace(':','-'),L=rows(k,R);
   const who=wh==null&&inp&&P.rwho[k]&&PP.length>1&&P.rwho[k].size<PP.length?[...P.rwho[k]].map(pi=>PP[pi].n).join(' e '):'';
   const no=!inp&&PP.length>1?PP.filter(p=>L.length&&L.every(([i,qs])=>qs[PP.indexOf(p)]==null)).map(p=>p.n):[];
   return`<details class="card${inp?'':' alt'}" data-id="${id}"${ui.open.has(id)?' open':''}><summary><span class="st">${R.n}</span><span class="sm">${inp?`dias ${ranges(ds)}${who?' · só '+esc(who):''}`:`${R.t}${R.m?' · '+(R.m==='sopa'?'vai bem em pote':'congela bem'):' · feito na hora'}`}</span><span class="amt">${inp?`${ds.size}<small>dia${ds.size>1?'s':''}</small>`:'<small>opção</small>'}</span></summary><div class="dbody">
   <h3>Porção por pessoa</h3><div class="rtab" style="grid-template-columns:minmax(0,1fr) repeat(${PS.length},auto)"><span class="h"></span>${PS.map(p=>`<span class="h">${esc(p.n)}</span>`).join('')}${L.filter(([i,qs])=>col(qs).some(q=>q!=null)).map(([i,qs])=>`<span>${IT[i].n}</span>${col(qs).map(q=>`<span class="n">${fmt(i,q)}</span>`).join('')}`).join('')}</div>
   ${R.ex?`<p class="small mut" style="margin-top:6px">Mais: ${R.ex}. Tempo: ${R.t}.</p>`:`<p class="small mut" style="margin-top:6px">Tempo: ${R.t}.</p>`}
   <h3>Como fazer</h3><ol class="how">${R.st.map(x=>`<li>${x}</li>`).join('')}</ol>
   ${R.m?`<p class="small" style="margin-top:10px">${HM[R.m]} ${HM.geo}</p>`:''}${inp?'':`<p class="small mut" style="margin-top:8px">Fora do plano: se trocar, some os ingredientes à lista de compras.</p>`}</div></details>`};
  return`<section class="sec" id="g-${g}"><h2>${l}</h2><p class="sub">${sub}</p>${ks.map(k=>card(k,true)).join('')}${os.length?`<h3 style="margin:16px 0 8px">Outras opções para variar (${os.length})</h3>${os.map(k=>card(k,false)).join('')}`:''}</section>`}).join('')}
 <p class="foot">Quantidades cruas, estimadas para adultos. Quando alguém não come um ingrediente, a tabela já mostra a troca ou o traço.</p></div>`}

function evaluate(S,ses,free){
 const PP=people(S),F=PP.map(p=>factors(S,p.w)),N=PP.length,EX=PP.map(p=>new Set(p.ex||[])),EXU=new Set(PP.flatMap(p=>p.ex||[]));
 const NP=PP.map(p=>new Set(p.np||[])),eat=(pi,p)=>!NP[pi].has(p),alt=(pi,p)=>['frango'].concat(PORD).find(x=>x!==p&&eat(pi,x)&&(S.prot[x]||x==='frango'))||'frango';
 const mg=a=>{const o=new Map();a.filter(Boolean).join('; ').split('; ').filter(Boolean).forEach(x=>{const m=x.match(/^(.+?): (.*)$/),k=m&&PP.some(p=>p.n===m[1])?m[1]:'';const v=k?m[2]:x;o.set(k,(o.has(k)?o.get(k)+', ':'')+v)});return[...o].map(([k,v])=>k?k+': '+v:v).join('; ')};
 const vn=(v,ex)=>{const a=[...new Set(Object.keys(v.p).map(i=>subI(i,ex)).filter(Boolean))];return a.length?a.map(lc).join(' e '):v.n};
 const nts=items=>PP.map((pe,pi)=>{const n=exNote(items,EX[pi]);return n?(N>1?pe.n+': ':'')+n:''}).filter(Boolean).join('; ');
 const isFree=(d,m)=>(free[iso(d)]||[]).includes(m),add=(o,i,q)=>{o[i]=(o[i]||0)+q};
 const need=ses.map(()=>({})),days=[],protSum=PP.map(()=>0),RD={},RW={};
 const RDP=PP.map(()=>({}));const rk=(k,d,pi)=>{(RD[k]=RD[k]||new Set()).add(d);if(pi!=null){(RW[k]=RW[k]||new Set()).add(pi);(RDP[pi][k]=RDP[pi][k]||new Set()).add(d)}else PP.forEach((x,i)=>{(RDP[i][k]=RDP[i][k]||new Set()).add(d)})};
 ses.forEach(s=>{s.wal=s.al.map(()=>0);s.wja=s.ja.map(()=>0);s.mar=[];s.n={al:0,ja:0,ref:0};s.cook={};s.dish={};s.combo={}});
 for(let d=1;d<=31;d++){
  const s=ses.find(x=>d>=x.a&&d<=x.b),w=wd(d),o=need[s.i];
  const D={d,w,s:s.i,meals:{},lan:[],pp:PP.map((p,pi)=>({prot:0,cups:0,train:p.train[w].on?p.train[w]:null}))};
  const am=(dish,i,q)=>{add(o,i,q);add(s.cook,i,q);s.dish[dish]=s.dish[dish]||{};add(s.dish[dish],i,q)};
  const off=m=>!S[m]||(!S.fds&&(w===0||w===6));
  if(off('almoco'))D.meals.almoco={kind:'fora'};else if(isFree(d,'almoco'))D.meals.almoco={kind:'livre'};else{
   const k=(d-s.a)%s.al.length,p=s.al[k],V=pv(p,s),v=VG[s.vegA],an0=[],tp=[],npp=[];
   PP.forEach((pe,pi)=>{const f=F[pi],q=eat(pi,p)?p:alt(pi,p),P=PR[q],Vq=pv(q,s);if(q!==p)an0.push((N>1?pe.n+': ':'')+'come '+Vq.n.toLowerCase());tp[pi]=`${Vq.n} + arroz e feijão + ${vn(v,EX[pi])}`;npp[pi]=exNote(Object.keys(BASE),EX[pi]);const ck='a|'+q;s.combo[ck]=s.combo[ck]||{t:`${Vq.sh} + arroz e feijão`,m:'almoço',n:0,cnt:PP.map(()=>0)};s.combo[ck].n++;s.combo[ck].cnt[pi]++;am('p:'+q,P.i,P.q*f.pf);am('arroz','arroz',.08*f.cf);am('feijao','feijao',.05*f.wf);for(const i in v.p){const j=subI(i,EX[pi]);if(j)am('vegA',j,v.p[i])}for(const i in BASE){const j=subI(i,EX[pi]);if(j)am('base',j,BASE[i])}
    D.pp[pi].prot+=P.g*f.pf+6*f.cf+10*f.wf+2;s.wal[k]+=f.pf;s.mar.push({d,m:'almoco',pi});rk('p:'+(q==='frango'?'frango'+(s.i%FRV.length):q),d,pi);rk('arroz',d,pi);rk('feijao',d,pi);rk('v:'+s.vegA,d,pi)});
   s.n.al+=N;s.n.ref+=N;const an=mg(an0.concat([nts(Object.keys(v.p).concat(Object.keys(BASE)))]));
   D.meals.almoco={kind:'marmita',txt:`${V.n} + arroz e feijão + ${v.n}`,note:an,tp,np:npp}}
  if(off('jantar'))D.meals.jantar={kind:'fora'};else if(isFree(d,'jantar'))D.meals.jantar={kind:'livre'};
  else if(S.jtipo==='sopa'){const k=(d-s.a+1)%s.ja.length,so=s.ja[k],X=SO[so];
   PP.forEach((pe,pi)=>{const f=F[pi];for(const i in X.p){const sc=i===X.pr?f.pf:i===X.cb?(i==='feijao'?f.wf:f.cf):1;const j=subI(i,EXU);if(j)am('s:'+so,j,X.p[i]*sc)}for(const i in SBASE){const j=subI(i,EXU);if(j)am('base',j,SBASE[i])}D.pp[pi].prot+=X.g*f.pf;s.wja[k]+=f.pf;rk('s:'+so,d,pi)});
   s.mar.push({d,m:'jantar'});s.n.ja+=1;s.n.ref+=N;const ck='s|'+so;s.combo[ck]=s.combo[ck]||{t:X.sh,m:'jantar',n:0};s.combo[ck].n++;const sn=exNote(Object.keys(X.p).concat(Object.keys(SBASE)),EXU);s.combo[ck].note=sn;
   D.meals.jantar={kind:'marmita',sopa:true,txt:X.n,note:sn}}
  else{const k=(d-s.a+1)%s.ja.length,p=s.ja[k],P0=PR[p],C=CB[s.carb],v=VG[s.vegJ],jn0=[],tp=[],npp=[];
   PP.forEach((pe,pi)=>{const f=F[pi],q=eat(pi,p)?p:alt(pi,p),P=PR[q];if(q!==p)jn0.push((N>1?pe.n+': ':'')+'come '+P.n.toLowerCase());const cj0=subI(C.i,EX[pi])||'arroz',cn=cj0===C.i?C.n:cj0==='batata'?'batata assada':cj0==='batdoce'?'batata-doce':'arroz';tp[pi]=`${P.n} + ${cn} + ${vn(v,EX[pi])}`;npp[pi]=exNote(Object.keys(BASE),EX[pi]);const ck='j|'+q+'|'+cn;s.combo[ck]=s.combo[ck]||{t:`${P.sh} + ${cn}`,m:'jantar',n:0,cnt:PP.map(()=>0)};s.combo[ck].n++;s.combo[ck].cnt[pi]++;am('p:'+q,P.i,P.q*f.pf);{const j=subI(C.i,EX[pi]);if(j)am('c:'+j,j,C.q*f.cf);else am('c:arroz','arroz',.08*f.cf);const cj=j||'arroz';rk(cj==='batata'?(s.carb==='pure'?'c:pure':'c:batata'):cj==='arroz'?'arroz':'c:'+cj,d,pi);rk('p:'+(q==='frango'?'frango0':q),d,pi);rk('v:'+s.vegJ,d,pi)}for(const i in v.p){const j=subI(i,EX[pi]);if(j)am('vegJ',j,v.p[i])}for(const i in BASE){const j=subI(i,EX[pi]);if(j)am('base',j,BASE[i])}
    D.pp[pi].prot+=P.g*f.pf+C.g*f.cf+2;s.wja[k]+=f.pf;s.mar.push({d,m:'jantar',pi})});
   s.n.ja+=N;s.n.ref+=N;const jn=mg(jn0.concat([nts([C.i].concat(Object.keys(v.p),Object.keys(BASE)))]));
   D.meals.jantar={kind:'marmita',txt:`${P0.n} + ${C.n} + ${v.n}`,note:jn,tp,np:npp}}
  const cm=S.cafe==='alternar'?(d%2?'paoovo':'cuscuz'):S.cafe;
  if(cm==='nao')D.meals.cafe={kind:'off'};else if(isFree(d,'cafe'))D.meals.cafe={kind:'livre'};
  else{const B=BF[cm],bn=[];PP.forEach((pe,pi)=>{const Bp=cm==='aveia'&&EX[pi].has('aveia')?BF.cuscuz:B;rk('b:'+(Bp===B?cm:'cuscuz'),d,pi);if(Bp!==B)bn.push((N>1?pe.n+': ':'')+Bp.t.toLowerCase());const it=Bp.it(F[pi]);for(const i in it)add(o,i,it[i]);D.pp[pi].prot+=Bp.g});D.meals.cafe={kind:'ok',txt:B.t,note:bn.join('; ')}}
  PP.forEach((pe,pi)=>{let L;const t=D.pp[pi].train;
   if(isFree(d,'lanche'))L={kind:'livre'};else if(t){L=EX[pi].has('aveia')?{kind:'ok',pre:true,txt:'Banana com 1 ovo cozido',it:{banana:1,ovos:1},g:7}:{kind:'ok',pre:true,txt:PRE.t,it:PRE.it(),g:PRE.g};rk(EX[pi].has('aveia')?'l:preovo':'l:pre',d,pi)}else if(LN[S.lanche]){const lk=S.lanche==='iogurte'&&EX[pi].has('iogurte')?'frutaovo':S.lanche,Lk=LN[lk];L={kind:'ok',txt:Lk.t,it:Lk.it(),g:Lk.g};rk('l:'+lk,d,pi)}else L={kind:'off'};
   if(L.it){for(const i in L.it)add(o,i,L.it[i]);D.pp[pi].prot+=L.g}D.lan[pi]=L;
   let cups=0;for(const m of['cafe','almoco','jantar'])if(S.cf[m]&&D.meals[m]&&(D.meals[m].kind==='ok'||D.meals[m].kind==='marmita'))cups++;if(S.cf.lanche&&L.kind==='ok')cups++;
   D.pp[pi].cups=cups;if(cups)add(o,'cafe',cups*CUP);D.pp[pi].water=water(pe.w,t);
   if(CE[S.ceia]&&!isFree(d,'ceia')){const it=CE[S.ceia].it();for(const i in it)add(o,i,it[i]);D.pp[pi].prot+=CE[S.ceia].g;rk('z:'+S.ceia,d,pi)}
   protSum[pi]+=D.pp[pi].prot});
  D.meals.ceia=!CE[S.ceia]?{kind:'off'}:isFree(d,'ceia')?{kind:'livre'}:{kind:'ok',txt:CE[S.ceia].t};
  days[d]=D}
 need[0].temperos=1;
 const month={};need.forEach(o=>{for(const i in o)add(month,i,o[i])});
 const stock={},storable=c=>S.shop==='mensal'&&(c==='merc'||c==='acou');let total=0;
 const trips=ses.map((s,ti)=>{const o=need[ti],t={d:s.a,b:s.b,buy:[],cost:0};
  const ids=new Set([...Object.keys(o),...(ti===0?Object.keys(month):[])]);
  for(const i of ids){const I=IT[i];const q=storable(I.c)?(ti===0?month[i]:0):(o[i]||0);if(!q)continue;
   const have=stock[i]||0,lack=q-have,packs=lack>1e-6?Math.ceil(lack/I.k-1e-6):0;stock[i]=have+packs*I.k-q;
   if(packs>0){const c=packs*I.k*price(i);t.buy.push({i,packs,c,q});t.cost+=c}}
  t.buy.sort((x,y)=>CORD.indexOf(IT[x.i].c)-CORD.indexOf(IT[y.i].c)||IT[x.i].n.localeCompare(IT[y.i].n));
  total+=t.cost;return t});
 let left=0;for(const i in stock)left+=Math.max(0,stock[i])*price(i);
 const stk=[],thaw={};
 ses.forEach(s=>{const by={};s.mar.forEach(x=>by[x.d]=(by[x.d]||0)+1);s.by=by;s.total=s.mar.length;s.fz=0;
  for(const x in by)if(+x>=s.a+3)s.fz+=by[x];s.fr=s.total-s.fz;
  for(let d=s.a;d<=s.b;d++){let tot=0,fz=0;for(let x=d+1;x<=s.b;x++){const c=by[x]||0;tot+=c;if(x>=s.a+3&&x>=d+2)fz+=c}stk[d]={tot,fz,fr:tot-fz};
   if(d+1<=s.b&&d+1>=s.a+3&&by[d+1])thaw[d]=by[d+1]}});
 const gk=S.goal==='ganhar'?1.8:1.6;
 return{rdp:RDP,rdays:RD,rwho:RW,PP,F,ses,days,trips,total,left,stk,thaw,potes:Math.max(0,...ses.map(s=>s.total)),fzMax:Math.max(0,...ses.map(s=>s.fz)),prot:protSum.map(x=>x/31),tgt:PP.map(p=>Math.round(p.w*gk)),month,ref:ses.reduce((a,s)=>a+s.n.ref,0),pots:ses.reduce((a,s)=>a+s.total,0)}}

function fitPlan(){const S=st.s,ses=sessionsOf(S);
 let en=PORD.filter(p=>S.prot[p]);if(!en.length)en=['frango'];
 let sop=SORD.filter(k=>soupOk(S,k)&&people(S).every(p=>!SO[k].need||!(p.np||[]).includes(SO[k].need)));if(!sop.length)sop=['feijao'];
 const K=Math.min(S.prepMode==='semanal'?3:4,en.length),sopa=S.jtipo==='sopa',KJ=Math.min(S.prepMode==='semanal'?2:3,sopa?sop.length:en.length);
 ses.forEach((s,si)=>{s.al=[];for(let k=0;k<K;k++)s.al.push(en[(si*K+k)%en.length]);
  s.ja=[];for(let k=0;k<KJ;k++)s.ja.push(sopa?sop[(si*KJ+k)%sop.length]:en[(si*K+k+1)%en.length]);
  s.carb=CORD2[si%4];s.vegA=VORD[si%4];s.vegJ=VORD[(si+1)%4]});
 let P=evaluate(S,ses,st.free);const avail=S.budget*(1-S.reserve/100);
 const pc=p=>PR[p].q*price(PR[p].i),sc=k=>{let c=0;for(const i in SO[k].p)c+=SO[k].p[i]*price(i);return c};
 const chA=en.slice().sort((a,b)=>pc(a)-pc(b)),chJ=sopa?sop.slice().sort((a,b)=>sc(a)-sc(b)):chA,uj=sopa?sc:pc;
 const ini=ses.map(s=>s.al.concat(s.ja).join());let g=0;
 while(S.fit&&P.total>avail+.01&&g++<120){let best=null;
  ses.forEach((s,si)=>{s.al.forEach((p,k)=>{const r=chA.indexOf(p);if(r>0){const v=pc(p)*s.wal[k];if(!best||v>best.v)best={si,k,v,r,L:'al',ch:chA}}});
   s.ja.forEach((p,k)=>{const r=chJ.indexOf(p);if(r>0){const v=uj(p)*s.wja[k];if(!best||v>best.v)best={si,k,v,r,L:'ja',ch:chJ}}})});
  if(!best)break;const s=ses[best.si],arr=s[best.L];let r=best.r-1;while(r>0&&arr.includes(best.ch[r]))r--;arr[best.k]=best.ch[r];P=evaluate(S,ses,st.free)}
 let sw=0;ses.forEach((s,i)=>{const a=ini[i].split(','),b=s.al.concat(s.ja);b.forEach((x,j)=>{if(x!==a[j])sw++})});
 P.avail=avail;P.sw=sw;P.fits=P.total<=avail+.01;return P}

let plan=fitPlan();
const now=new Date();
const pre=now<new Date(2026,11,1),post=now>=new Date(2027,0,1);
const refDay=pre?1:post?31:now.getDate();
const isDone=k=>!!st.done[k];
const ICN={compras:'<path d="M3 4h2.2l2.3 10.3a1 1 0 0 0 1 .7h8.8a1 1 0 0 0 1-.8L20 8H6.3"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',preparo:'<path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6z"/><path d="M2 11h20M9 4c0 2 2 2 2 4M14 4c0 2 2 2 2 4"/>',treino:'<path d="M6 8v8M18 8v8M3 10v4M21 10v4M6 12h12"/>',degelo:'<path d="M12 3v18M5 7l14 10M19 7L5 17"/>'};
const svg=k=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICN[k]}</svg>`;
const CHK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const who=pi=>plan.PP.length>1?`<span class="who w${pi}">${esc(plan.PP[pi].n)}</span>`:'';
const cafeTxt=m=>st.s.cf[m]?' + café puro':'';

function dayItems(d,wh){const nf=n=>{if(!n||wh==null)return n;const nm=plan.PP[wh].n+': ';return n.split('; ').map(x=>x.startsWith(nm)?x.slice(nm.length):(plan.PP.some(p=>x.startsWith(p.n+': '))?'':x)).filter(Boolean).join('; ')};const S=st.s,D=plan.days[d],it=[],tr=plan.trips.find(t=>t.d===d),se=plan.ses.find(s=>s.a===d);
 if(tr)it.push({k:'compras',t:'08:00',h:'Compras',x:`${tr.buy.length} itens · ≈ ${brl(tr.cost)}`,go:'compras'});
 if(se)it.push({k:'preparo',t:'09:30',h:'Preparo das marmitas',x:`${se.total} potes · cerca de 3 h na cozinha`,go:'marmitas'});
 const ml=(k,t,h)=>{const m=D.meals[k];if(!m||m.kind==='off')return;const ok=m.kind==='ok'||m.kind==='marmita';let tx=m.txt,no=nf(m.note);if(wh!=null&&m.tp&&m.tp[wh]){tx=m.tp[wh];no=m.np[wh]||''}if(k==='cafe'&&wh!=null&&no){tx=no[0].toUpperCase()+no.slice(1);no=''}
  it.push({k,t,h,x:m.kind==='livre'?'Refeição livre':m.kind==='fora'?'Fora do plano de marmitas':tx+(no?` (${no})`:'')+(m.sopa?' (esquente na panela)':m.kind==='marmita'?' (esquente na frigideira)':'')+cafeTxt(k),free:!ok,mar:m.kind==='marmita'})};
 ml('cafe',S.tC,'Café da manhã');ml('almoco',S.tA,'Almoço');
 const L=D.lan,same=L.length===1||(L[0].kind===L[1].kind&&L[0].txt===L[1].txt&&(L[0].pre?!!L[1].pre&&D.pp[0].train.t===D.pp[1].train.t:!L[1].pre));
 L.forEach((l,pi)=>{if(l.kind==='off'||(wh!=null?pi!==wh:(same&&pi>0)))return;const same2=same||wh!=null;const t=l.pre?addMin(D.pp[pi].train.t,-60):S.tL;
  it.push({k:same2?'lanche':'lanche:'+pi,t,h:l.pre?'Pré-treino':'Café da tarde',x:l.kind==='livre'?'Refeição livre':l.txt+(S.cf.lanche?' + café puro':''),free:l.kind!=='ok',pre:l.pre,pi:same2?null:pi})});
 ml('jantar',S.tJ,'Jantar');ml('ceia',S.tZ,'Ceia');
 D.pp.forEach((p,pi)=>{if(p.train&&(wh==null||wh===pi))it.push({k:'treino:'+pi,t:p.train.t,h:'Treino',x:p.train.y,tr:1,pi})});
 if(plan.thaw[d])it.push({k:'degelo',t:'21:30',h:'Descongelar',x:`Passe ${plan.thaw[d]} pote${plan.thaw[d]>1?'s':''} do freezer para a geladeira (os de amanhã)`});
 it.sort((a,b)=>a.t.localeCompare(b.t));
 D.pp.forEach((p,pi)=>{if(!p.train||(wh!=null&&wh!==pi))return;const x=it.find(y=>['cafe','almoco','jantar'].includes(y.k)&&y.t>p.train.t&&!y.free);if(x)(x.pos=x.pos||[]).push(pi)});
 return it}
function timeline(d,wh){return`<ul class="tl">${dayItems(d,wh).map(x=>{const key=iso(d)+':'+x.k+(wh!=null&&['cafe','almoco','lanche','jantar','ceia'].includes(x.k)?':p'+wh:''),dn=isDone(key);
 return`<li class="${x.free?'free':''}${dn?' done':''}"><span class="t">${esc(x.t)}</span><div><h4>${esc(x.h)}${x.pi!=null&&wh==null?who(x.pi):''}${x.pre?'<span class="tag tr">1 h antes</span>':''}${(x.pos||[]).map(pi=>`<span class="tag pp">pós-treino${plan.PP.length>1&&wh==null?' '+esc(plan.PP[pi].n):''}</span>`).join('')}${x.mar?'<span class="tag">marmita</span>':''}</h4><p>${esc(x.x)}${x.go?` · <a class="go" href="#${x.go}">abrir</a>`:''}</p></div>${x.free?'<span></span>':`<button class="ck" data-done="${key}" aria-pressed="${dn}" aria-label="Marcar ${esc(x.h)} como feito">${CHK}</button>`}</li>`}).join('')}</ul>`}

function waterBox(d,wh){const D=plan.days[d];return`<div class="card">${plan.PP.map((p,pi)=>{if(wh!=null&&pi!==wh)return'';const L=D.pp[pi].water,cups=Math.ceil(L/.25-1e-6),key=iso(d)+':'+pi,n=Math.min(cups+4,+st.water[key]||0);
 return`<div class="wrow"><div class="whead"><span><b>${esc(p.n)}</b> · ${num(L,1)} L = ${cups} copos de 250 ml</span><span class="small mut">${D.pp[pi].train?'inclui +0,5 L do treino':'dia sem treino'}</span></div>
 <div class="wctl"><button class="wbtn" data-wa="${key}:-1" aria-label="Tirar um copo">−</button><div class="glasses" aria-label="${n} de ${cups} copos">${Array.from({length:Math.max(cups,n)},(_,i)=>`<i class="gl${i<n?' on':''}"></i>`).join('')}</div><button class="wbtn" data-wa="${key}:1" aria-label="Mais um copo">+</button></div></div>`}).join('')}</div>`}

function money(){const S=st.s,P=plan;let paid=0;P.trips.forEach(t=>{if(st.spent[t.d]!=null&&st.spent[t.d]!=='')paid+=+st.spent[t.d]||0});
 const ex=st.extra.reduce((a,x)=>a+x.v,0),real=paid+ex,toCome=P.trips.filter(t=>st.spent[t.d]==null||st.spent[t.d]==='').reduce((a,t)=>a+t.cost,0);
 return{real,toCome,bal:S.budget-real,end:S.budget-real-toCome,ex}}

const cw=()=>ui.who==='1'&&plan.PP.length>1?1:0;
function whoBar(){const w=cw();return`<div class="whobar"><div class="wrap"><div class="seg" role="group" aria-label="De quem">${plan.PP.map((p,pi)=>`<button data-who="${pi}" aria-pressed="${w===pi}">${esc(p.n)}</button>`).join('')}</div></div></div>`}
function vPainel(){const PP=plan.PP;if(PP.length<2)return vCasal();const ch=ui.me==null?`<div class="wrap"><section class="sec"><div class="card"><h2 style="margin-bottom:6px">Quem está usando este celular?</h2><p class="sub">O app abre direto no seu painel. Os dados de vocês dois ficam juntos.</p><div class="seg">${PP.map((p,pi)=>`<button data-me="${pi}" aria-pressed="false">${esc(p.n)}</button>`).join('')}</div></div></section></div>`:'';return ch+vPessoa(cw());const w=0;
 const bar=`<div class="whobar"><div class="wrap"><div class="seg" role="group" aria-label="Painel de quem">${PP.map((p,pi)=>`<button data-who="${pi}" aria-pressed="${String(w)===String(pi)}">${esc(p.n)}</button>`).join('')}<button data-who="c" aria-pressed="${w==='c'}">Casal</button></div></div></div>`;
 return bar+(w==='c'||!PP[+w]?vCasal():vPessoa(+w))}
function vPessoa(pi){const S=st.s,P=plan,p=P.PP[pi],f=P.F[pi],D=P.days[refDay],d0=refDay;
 const td=P.days.filter(x=>x&&x.pp[pi].train),dn=td.filter(x=>isDone(iso(x.d)+':treino:'+pi)).length,nx=td.find(x=>x.d>=refDay);
 const L=D.pp[pi].water,cups=Math.ceil(L/.25-1e-6),wn=+st.water[iso(d0)+':'+pi]||0;
 const goal=S.goal==='perder'?'perder gordura':S.goal==='ganhar'?'ganhar massa':'manter o peso';
 const ex=(p.ex||[]).map(lc);
 return`<section class="hero pz${pi}"><div class="wrap"><h1>${esc(p.n)}</h1><p class="lede">Objetivo: ${goal} · ${+p.w} kg${ex.length?' · não come '+esc(ex.join(', ')):''}</p>
 <div class="kpis k4"><div class="kpi"><span>Água ${pre?'no dia 1º':'hoje'}</span><b>${num(L,1)} L</b><small>${Math.min(wn,cups)} de ${cups} copos</small></div>
 <div class="kpi"><span>Proteína por dia</span><b>≈ ${Math.round(P.prot[pi])} g</b><small>meta ≈ ${P.tgt[pi]} g</small></div>
 <div class="kpi"><span>Treinos feitos</span><b>${dn} de ${td.length}</b><small>${nx?`próximo: ${WDS[nx.w].toLowerCase()} ${dd(nx.d)}, ${esc(nx.pp[pi].train.t)}`:'nenhum marcado'}</small></div>
 <div class="kpi"><span>Porção no almoço</span><b>${Math.round(150*f.pf)} g</b><small>de frango cru · arroz ${Math.round(80*f.cf)} g · feijão ${Math.round(50*f.wf)} g</small></div></div></div></section>
 <div class="wrap"><div class="cols"><div>
 <section class="sec"><h2>${pre?'Prévia do dia 1º de dezembro':post?'Último dia: 31 de dezembro':'Hoje, '+longDay(refDay).toLowerCase()}</h2><p class="sub">O dia de ${esc(p.n)}. Toque no círculo quando fizer cada item.</p><div class="card">${timeline(d0,pi)}</div></section>
 </div><div>
 <section class="sec"><h2>Água</h2><p class="sub">35 ml por kg, mais 0,5 L em dia de treino.</p>${waterBox(d0,pi)}</section>
 <section class="sec"><h2>Treinos de dezembro</h2><p class="sub">${td.length} treinos marcados. Mude dias e horários em Ajustes.</p><div class="card"><ul class="tl">${td.map(x=>{const k=iso(x.d)+':treino:'+pi,ok=isDone(k);return`<li class="${ok?'done':''}"><span class="t">${dd(x.d).slice(0,2)}</span><div><h4>${WDS[x.w]} · ${esc(x.pp[pi].train.t)}</h4><p>${esc(x.pp[pi].train.y)} · pré-treino ${addMin(x.pp[pi].train.t,-60)}</p></div><button class="ck" data-done="${k}" aria-pressed="${ok}" aria-label="Treino feito">${CHK}</button></li>`}).join('')||'<li style="display:block"><p>Nenhum treino marcado.</p></li>'}</ul></div></section>
 ${avisosBox()}</div></div><p class="foot">Quantidades estimadas para adultos; não substitui um nutricionista.</p></div>`}
function vCasal(){const S=st.s,P=plan,M=money(),pct=v=>Math.max(0,Math.min(100,v/Math.max(1,S.budget)*100)),PP=P.PP;
 const tdays=PP.map((p,pi)=>P.days.filter(D=>D&&D.pp[pi].train)),done=tdays.map((a,pi)=>a.filter(D=>isDone(iso(D.d)+':treino:'+pi)).length);
 const nextTrip=P.trips.find(t=>t.d>=refDay),nextSes=P.ses.find(s=>s.a>=refDay);
 const head=M.end>=0?`O mês ${PP.length>1?'dos dois ':''}cabe no cartão: sobram ${brl0(M.end)}`:`Faltam ${brl0(-M.end)} para fechar o mês`;
 const resv=S.budget*S.reserve/100;
 const lede=M.end>=0?`Comida de dezembro para ${PP.length>1?'2 pessoas':'1 pessoa'} ≈ ${brl0(P.total)}. ${S.reserve?`A sobra inclui a reserva de ${S.reserve}% (${brl0(resv)}) para imprevistos.`:'Sem reserva separada: a sobra é a margem para imprevistos.'}`:`O plano custa ≈ ${brl0(P.total)} e o cartão tem ${brl0(S.budget)}. Veja as sugestões abaixo.`;
 const mx=Math.max(1,...P.trips.map(t=>Math.max(t.cost,+st.spent[t.d]||0)));
 const smx=Math.max(1,...P.stk.slice(1).map(x=>x?x.tot:0));
 const days=Array.from({length:31},(_,i)=>i+1);
 const preList=[['valor',`Confira o valor do cartão em Ajustes (agora: ${brl0(S.budget)})`],['potes',`Separe ${P.potes} potes com tampa que vão ao freezer`],['termico','Se forem levar marmita para o trabalho: 1 pote térmico por pessoa'],['freezer',`Abra espaço no freezer para cerca de ${P.fzMax} potes`],['fita','Fita crepe e caneta para etiquetar'],['treino','Confira nomes, pesos e treinos em Ajustes']];
 const daysLeft=Math.ceil((new Date(2026,11,1)-now)/864e5);
 const low=PP.map((p,pi)=>P.prot[pi]<P.tgt[pi]*.9).some(Boolean);
 const nextT=PP.map((p,pi)=>tdays[pi].find(D=>D.d>=refDay));
 return`<section class="hero"><div class="wrap"><h1>${head}</h1><p class="lede">${lede}</p>
 <div class="hgrid"><div class="vcard"><div class="vrow"><span>Cartão alimentação</span><svg width="38" height="28" viewBox="0 0 38 28" aria-hidden="true"><rect x="1" y="1" width="36" height="26" rx="6" fill="#f5d77a" stroke="#c9a23b"/><path d="M1 10h12M1 18h12M25 10h12M25 18h12M13 1v26M25 1v26" stroke="#c9a23b" fill="none"/></svg></div>
 <div class="big">${brl(M.bal)}</div><div class="of">saldo agora, de ${brl(S.budget)}</div>
 <div class="meter" role="img" aria-label="Gasto ${brl(M.real)}, previsto ${brl(M.toCome)}"><i class="m1" style="width:${pct(M.real)}%"></i><i class="m2" style="width:${Math.min(pct(M.toCome),100-pct(M.real))}%"></i></div>
 <div class="leg"><span><i class="sw" style="background:#fff"></i>Gasto <b>${brl0(M.real)}</b></span><span><i class="sw" style="background:rgba(255,255,255,.6)"></i>Previsto <b>${brl0(M.toCome)}</b></span><span>Sobra <b>${brl0(M.end)}</b></span></div></div>
 <div class="kpis"><div class="kpi"><span>Custo por dia</span><b>${brl(P.total/31)}</b><small>${PP.length>1?`≈ ${brl(P.total/31/2)} por pessoa`:'compras ÷ 31 dias'}</small></div>
 <div class="kpi"><span>Refeições em marmita</span><b>${P.ref}</b><small>${P.pots} potes · ${P.ses.length} preparos</small></div>
 <div class="kpi"><span>Proteína por dia</span><b class="sm">≈ ${P.prot.map(x=>Math.round(x)).join(' / ')} g</b><small>meta ≈ ${P.tgt.join(' / ')} g${PP.length>1?' ('+PP.map(p=>esc(p.n)).join(' / ')+')':''}</small></div>
 <div class="kpi"><span>Treinos feitos</span><b class="sm">${done.map((x,pi)=>x+' de '+tdays[pi].length).join(' · ')}</b><small>${PP.map(p=>esc(p.n)).join(' · ')}</small></div></div></div>
 ${P.sw&&P.fits?`<p class="note">Para caber no orçamento, troquei ${P.sw} prato${P.sw>1?'s':''} por opções mais baratas. ${S.reserve?'Aumente o valor ou reduza a reserva para voltar às originais.':'Com um valor maior no cartão, o app volta a variar mais.'}</p>`:''}
 ${!P.fits&&!S.fit?`<p class="note">Carnes variadas ligadas, mesmo passando do orçamento: faltam ${brl0(P.total-S.budget)} no cartão. Para voltar a caber, ligue “Trocar carnes caras” em Ajustes › Marmitas e compras.</p>`:''}
 ${!P.fits&&S.fit?`<p class="note">Mesmo com os pratos mais baratos, o plano passa do disponível (${brl0(P.avail)}). Tente: lanche só com banana, café da manhã com aveia, menos reserva ou marcar refeições como livres.</p>`:''}
 ${low?`<p class="note">A proteína ficou abaixo da meta por causa do orçamento. O jeito mais barato de subir: uma concha a mais de feijão no almoço (+7 g por ≈ R$ 0,30).</p>`:''}
 </div></section>
 <div class="wrap"><div class="cols"><div>
 ${pre?`<section class="sec"><h2>Antes de começar</h2><p class="sub">Faltam ${daysLeft} dia${daysLeft>1?'s':''} para dezembro.</p><div class="card"><ul class="tl">${preList.map(([k,t])=>{const key='pre:'+k,dn=isDone(key);return`<li class="${dn?'done':''}" style="grid-template-columns:minmax(0,1fr) 44px"><div><p style="color:var(--ink)">${esc(t)}</p></div><button class="ck" data-done="${key}" aria-pressed="${dn}" aria-label="Marcar como feito">${CHK}</button></li>`}).join('')}</ul></div></section>`:''}
 <section class="sec"><h2>Água ${pre?'no dia 1º':'de hoje'}</h2><p class="sub">35 ml por kg de peso, mais 0,5 L em dia de treino. Toque + a cada copo.</p>${waterBox(refDay)}</section>
 <section class="sec"><h2>${pre?'Prévia do dia 1º de dezembro':post?'Último dia: 31 de dezembro':'Hoje, '+longDay(refDay).toLowerCase()}</h2><p class="sub">Toque no círculo quando fizer cada item.</p><div class="card">${timeline(refDay)}</div></section>
 </div><div>
 <section class="sec"><h2>Próximos passos</h2><div class="card steps">
 ${nextTrip?`<div class="step"><span class="ic">${svg('compras')}</span><div><b>Compras em ${WDS[wd(nextTrip.d)].toLowerCase()} ${dd(nextTrip.d)}</b><span>${nextTrip.buy.length} itens · ≈ ${brl(nextTrip.cost)} · <a class="go" href="#compras">ver lista</a></span></div></div>`:''}
 ${nextSes?`<div class="step"><span class="ic">${svg('preparo')}</span><div><b>Preparo em ${WDS[wd(nextSes.a)].toLowerCase()} ${dd(nextSes.a)}</b><span>${nextSes.total} potes para ${dd(nextSes.a)} a ${dd(nextSes.b)} · <a class="go" href="#marmitas">passo a passo</a></span></div></div>`:''}
 ${P.thaw[refDay]?`<div class="step"><span class="ic">${svg('degelo')}</span><div><b>Hoje à noite</b><span>Passe ${P.thaw[refDay]} pote${P.thaw[refDay]>1?'s':''} do freezer para a geladeira.</span></div></div>`:''}
 ${PP.map((p,pi)=>{const D=nextT[pi];return D?`<div class="step"><span class="ic">${svg('treino')}</span><div><b>${PP.length>1?esc(p.n)+': t':'T'}reino ${D.d===refDay&&!pre?'hoje':'em '+WDS[D.w].toLowerCase()+' '+dd(D.d)} às ${esc(D.pp[pi].train.t)}</b><span>${esc(D.pp[pi].train.y)} · pré-treino às ${addMin(D.pp[pi].train.t,-60)}</span></div></div>`:''}).join('')}
 </div></section>
 <section class="sec"><h2>Gasto por compra</h2><p class="sub">Tracejado: previsto. Preenchido: o que você lançou em Compras.</p><div class="card bars">
 ${P.trips.map(t=>{const sp=st.spent[t.d];const has=sp!=null&&sp!=='';return`<div class="brow"><span class="lb">${dd(t.d)}</span><div class="btrack"><i class="pl" style="width:${t.cost/mx*100}%"></i>${has?`<i class="rl" style="width:calc(${(+sp)/mx*100}% - 8px)"></i>`:''}</div><span class="bval">previsto ${brl(t.cost)}${has?` · gasto ${brl(+sp)}`:''}</span></div>`}).join('')}
 ${M.ex?`<p class="small mut">Outros gastos lançados: ${brl(M.ex)}</p>`:''}</div></section>
 <section class="sec"><h2>Potes guardados</h2><p class="sub">Quantos ficam prontos ao fim de cada dia. Verde: freezer. Tomate: geladeira.</p><div class="card">
 <div class="stk" role="img" aria-label="Potes guardados por dia">${days.map(d=>{const x=P.stk[d]||{tot:0,fz:0,fr:0};return`<div class="${d===refDay?'now':''}" title="${dd(d)}: ${x.tot} potes"><i class="fz" style="height:${x.fz/smx*100}%"></i><i class="fr" style="height:${x.fr/smx*100}%"></i></div>`}).join('')}</div>
 <div class="axis"><span>1</span><span>8</span><span>15</span><span>22</span><span>29</span></div>
 <p class="small mut" style="margin-top:8px">No máximo ${P.fzMax} no freezer ao mesmo tempo.</p></div></section>
 </div></div>
 <p class="foot">Preços: média de São Paulo (Procon-SP/Dieese, out/2026) e estimativas. Ajuste ao seu mercado em Ajustes › Preços. Quantidades estimadas para adultos; não substitui um nutricionista.</p></div>`}

function vMes(){const P=plan,d0=ui.day||refDay,D=P.days[d0],wh=P.PP.length>1?cw():undefined,on=pi=>wh==null||pi===wh;
 const cells=[];for(let i=0;i<wd(1);i++)cells.push('<span class="dbtn blank"></span>');
 for(let d=1;d<=31;d++){const X=P.days[d],fr=(st.free[iso(d)]||[]).length>0;
  cells.push(`<button class="dbtn${d===refDay&&!pre&&!post?' today':''}" data-day="${d}" aria-pressed="${d===d0}" aria-label="${longDay(d)}"><b>${d}</b><span class="mk">${X.pp.map((p,pi)=>p.train&&on(pi)?`<i class="t${pi}"></i>`:'').join('')}${P.ses.some(s=>s.a===d)?'<i class="p"></i>':''}${fr?'<i class="f"></i>':''}</span></button>`)}
 const fl=st.free[iso(d0)]||[];
 return`<div class="wrap"><section class="sec"><div class="card"><div class="cal">${WDS.map(w=>`<span class="h">${w[0]}</span>`).join('')}${cells.join('')}</div>
 <div class="lg">${P.PP.map((p,pi)=>!on(pi)?'':`<span><span class="mk"><i class="t${pi}"></i></span>treino ${P.PP.length>1?esc(p.n):''}</span>`).join('')}<span><span class="mk"><i class="p"></i></span>compras e preparo</span><span><span class="mk"><i class="f"></i></span>refeição livre</span></div></div></section>
 <div class="cols"><section class="sec"><h2>${longDay(d0)}</h2><p class="sub">${D.pp.map((p,pi)=>!on(pi)?'':(P.PP.length>1?esc(P.PP[pi].n)+': ':'')+(p.train?`treino às ${esc(p.train.t)} (${esc(p.train.y)})`:'descanso')).filter(Boolean).join(' · ')}</p><div class="card">${timeline(d0,wh)}</div>
 <h3 style="margin:18px 0 8px">Água do dia</h3>${waterBox(d0,wh)}</section>
 <section class="sec"><h2>Vão comer fora?</h2><p class="sub">Marque as refeições livres deste dia (ceia, aniversário, almoço da firma). Vale para os dois. Marmitas e compras se ajustam sozinhas.</p>
 <div class="chips">${[['cafe','Café'],['almoco','Almoço'],['lanche','Café da tarde'],['jantar','Jantar'],['ceia','Ceia']].map(([k,l])=>`<button class="chip" data-free="${k}" aria-pressed="${fl.includes(k)}">${l} livre</button>`).join('')}</div>
 <h3 style="margin:22px 0 8px">Semana a semana</h3><div class="card"><div class="kv">${P.ses.map(s=>`<span>${dd(s.a)} a ${dd(s.b)}: ${s.al.concat(st.s.jtipo==='sopa'?[]:s.ja).map(p=>PR[p].sh).concat(st.s.jtipo==='sopa'?s.ja.map(k=>SO[k].sh):[]).filter((v,i,a)=>a.indexOf(v)===i).join(', ')}</span><span>${s.total} potes</span>`).join('')}</div></div></section></div></div>`}

function vMarmitas(){const P=plan,S=st.s,PP=P.PP,sopa=S.jtipo==='sopa',wh=null,mine=x=>wh==null||x.pi===wh||x.pi==null,ms=s=>({al:s.mar.filter(x=>x.m==='almoco'&&mine(x)).length,ja:s.mar.filter(x=>x.m==='jantar'&&mine(x)).length}),nm=wh==null?'':PP[wh].n;
 const por=PP.map((p,pi)=>{if(wh!=null&&pi!==wh)return'';const f=P.F[pi];return`<li><b>${esc(p.n)}</b> (${p.w} kg): frango ${Math.round(150*f.pf)} g ou equivalente · arroz ${Math.round(80*f.cf)} g · feijão ${Math.round(50*f.wf)} g · legumes 120 g${sopa?` · na sopa, ${Math.round(120*f.pf)} g de frango`:''}${(p.ex||[]).length?` · <b>não come ${p.ex.map(lc).join(' nem ')}</b>`:''}</li>`}).join('');
 const tot={al:0,ja:0,pot:0};P.ses.forEach(s=>{const c=ms(s);tot.al+=c.al;tot.ja+=c.ja;tot.pot+=c.al+c.ja});
 return`<div class="wrap"><section class="sec"><h2>${nm?esc(nm)+': ':''}${tot.pot} potes em ${P.ses.length} preparos</h2><p class="sub">Preparo ${S.prepMode==='semanal'?'semanal':'quinzenal'} aos ${WDL[+S.prepDay].toLowerCase()}s, o primeiro em 1º/12. ${sopa&&PP.length>1?`Almoço: 1 pote só de ${esc(nm)}. Jantar: a sopa vai num pote de 1 L dividido com ${esc(PP[1-wh].n)} (entra na conta dos dois).`:''}</p>
 <div class="card"><table class="ptab"><thead><tr><th>Preparo</th><th>Para os dias</th><th class="n">Almoço</th><th class="n">${sopa?'Sopa':'Jantar'}</th><th class="n">Potes</th></tr></thead><tbody>
 ${P.ses.map(s=>{const c=ms(s);return`<tr><td><b>${WDS[wd(s.a)]} ${dd(s.a)}</b></td><td>${String(s.a).padStart(2,'0')} a ${dd(s.b)}</td><td class="n">${c.al}</td><td class="n">${c.ja}</td><td class="n"><b>${c.al+c.ja}</b></td></tr>`}).join('')}
 <tr class="tot"><td>Total</td><td>${wh==null?P.ref:tot.al+tot.ja} refeições</td><td class="n">${tot.al}</td><td class="n">${tot.ja}</td><td class="n">${tot.pot}</td></tr></tbody></table>
 <p class="small mut" style="margin-top:10px">Porção crua por pote${nm?' de '+esc(nm):''}:</p><ul class="small" style="margin:4px 0 0;padding-left:18px;display:grid;gap:4px">${por}</ul></div></section>
 <section class="sec"><div class="cols"><div class="card"><h3 style="margin-bottom:10px">Como esquentar sem micro-ondas</h3><div class="rules">
 <div class="rule"><b>Na véspera</b><span>Passe os potes do dia seguinte do freezer para a geladeira à noite. Sem micro-ondas não dá para descongelar na hora. O app avisa a noite certa.</span></div>
 <div class="rule"><b>Prato</b><span>Vire o pote numa frigideira ou panela com 2 a 3 colheres de sopa de água, tampe e esquente em fogo médio-baixo por 6 a 8 min, mexendo. O vapor solta o arroz.</span></div>
 <div class="rule"><b>Sopa</b><span>Na panela, mexendo, até ferver.</span></div>
 <div class="rule"><b>Forno</b><span>Opcional: em marmitex de alumínio ou refratário, coberto com papel-alumínio, 180 °C por 20 a 25 min. Não leve vidro gelado direto ao forno quente: pode trincar.</span></div>
 <div class="rule"><b>No trabalho</b><span>Esquente de manhã até sair vapor e ponha num pote térmico escaldado com água fervente. Coma em até 4 horas.</span></div></div></div>
 <div class="card"><h3 style="margin-bottom:10px">Como guardar</h3><div class="rules">
 <div class="rule"><b>Geladeira</b><span>Os potes dos 3 primeiros dias de cada preparo. Consuma em até 3 dias.</span></div>
 <div class="rule"><b>Freezer</b><span>Todos os outros, a −18 °C, por até 30 dias. Na sopa, deixe 2 cm livres no pote: ela aumenta ao congelar.</span></div>
 <div class="rule"><b>Esfriar</b><span>Espalhe em assadeiras rasas. Em até 2 h, tudo na geladeira ou no freezer.</span></div>
 <div class="rule"><b>Potes</b><span>Como tudo vai para a panela, qualquer pote com tampa que aguente freezer serve.</span></div>
 <div class="rule"><b>Etiqueta</b><span>Fita crepe na tampa: o que é, de quem é, data do preparo e data limite.</span></div></div>
 <div class="tapes" style="margin-top:12px"><span class="tape">Frango + arroz e feijão · ${esc(PP[wh||0].n)}<small>feito 06/12 · até 05/01</small></span>${sopa?'<span class="tape">Sopa de frango · 2 porções<small>feito 06/12 · até 05/01</small></span>':''}</div></div></div></section>
 <section class="sec"><h2>Preparo por preparo</h2><p class="sub">${nm?`O cardápio mostra os potes de ${esc(nm)}. Lista de cozinha e passo a passo são da cozinha dos dois, feita junta.`:'Toque para abrir o que cozinhar, o passo a passo e as noites de descongelar.'}</p>
 ${P.ses.map((s,si)=>{const id='s'+si,cook=Object.keys(s.cook).sort((a,b)=>CORD.indexOf(IT[a].c)-CORD.indexOf(IT[b].c)),ua=s.al.filter((v,i,a)=>a.indexOf(v)===i),uj=s.ja.filter((v,i,a)=>a.indexOf(v)===i);
  const dq=(k,i)=>fq(i,(s.dish[k]||{})[i]||0);
  const steps=[];const fe=s.cook.feijao||0;
  if(fe)steps.push(`Na véspera: deixe ${fq('feijao',fe)} de feijão de molho.${S.shop==='mensal'?' Passe a carne congelada para a geladeira.':''}`);
  steps.push('Ligue o forno a 200 °C. Pique cebola, alho e legumes; tempere as carnes.');
  ['cebola','alho','tomate'].forEach(i=>{const no=PP.filter(p=>(p.ex||[]).includes(i)),yes=PP.filter(p=>!(p.ex||[]).includes(i));if(!no.length)return;const nm=lc(i),q=(s.dish.base||{})[i]||0;
   if(!yes.length||!q)steps.push(`Sem ${nm}: onde a receita pede ${nm}, deixe de fora e use cheiro-verde.`);
   else steps.push(`${no.map(p=>p.n).join(' e ')} não come ${nm}: cozinhe tudo sem ${nm}. Refogue à parte ${fq(i,q)} de ${nm} e misture só nos potes de ${yes.map(p=>p.n).join(' e ')}${sopa&&PP.length>1?'. A sopa, que é dos dois, fica sem':''}.`)});
  if(fe)steps.push(`Feijão na pressão, 25–30 min depois de pegar pressão. Tempere com ${PP.some(p=>(p.ex||[]).includes('cebola'))?'alho refogado':'cebola e alho refogados'}.${s.dish['s:feijao']?` Separe ${dq('s:feijao','feijao')} (medida crua) para o caldo.`:''}`);
  Object.keys(s.dish).filter(x=>x.startsWith('p:')).map(x=>x.slice(2)).forEach(p=>{const who=PP.filter((pe,pi)=>Object.values(s.combo).some(c=>c.t.startsWith(pv(p,s).sh)&&c.cnt&&c.cnt[pi])).map(pe=>pe.n);steps.push(pv(p,s).how(dq('p:'+p,PR[p].i))+(PP.length>1&&who.length===1?` Só para ${who[0]}.`:''))});
  if(s.dish.arroz)steps.push(`Arroz: ${dq('arroz','arroz')} cru, refogado no alho, 2 partes de água para 1 de arroz, uns 20 min. Deixe levemente al dente: termina na frigideira.`);
  if(s.dish.vegA){const vn=PP.map(p=>{const n=exNote(Object.keys(VG[s.vegA].p),new Set(p.ex||[]));return n?`nos potes de ${p.n}, ${n}`:''}).filter(Boolean).join('; ');steps.push(`Legumes do almoço (${VG[s.vegA].n}): vapor ou refogado por 3–5 min, al dente.${vn?' '+vn[0].toUpperCase()+vn.slice(1)+'.':''}`)}
  if(sopa){const EXU=new Set(PP.flatMap(p=>p.ex||[])),tp=['cebola','alho'].filter(i=>!EXU.has(i)).join(' e ')||'cheiro-verde';uj.forEach(k=>{const Dk=s.dish['s:'+k];if(!Dk)return;const q={};for(const i in Dk)q[i]=fq(i,Dk[i]);const sn=exNote(Object.keys(SO[k].p),EXU);steps.push(SO[k].how(q,tp)+(sn&&PP.length>1?` Como o pote é dos dois, vai ${sn}.`:''))})}
  else{Object.keys(s.dish).filter(x=>x.startsWith('c:')).forEach(x=>{const i=x.slice(2),q=fq(i,s.dish[x][i]),who=PP.filter(p=>(subI(CB[s.carb].i,new Set(p.ex||[]))||'arroz')===i).map(p=>p.n),tag=who.length&&who.length<PP.length?` (${who.join(' e ')})`:'';const t=i==='batdoce'?`Batata-doce${tag}: ${q} em rodelas, assada 30–35 min a 200 °C.`:i==='batata'?(s.carb==='pure'?`Purê${tag}: cozinhe ${q} de batata e amasse com um pouco de leite e sal.`:`Batata${tag}: ${q} em rodelas, assada 30–35 min a 200 °C.`):i==='macarrao'?CB.macarrao.how(q):i==='arroz'?`Arroz do jantar${tag}: ${q} cru, igual ao do almoço.`:'';if(t)steps.push(t)});if(s.dish.vegJ)steps.push(`Legumes do jantar (${VG[s.vegJ].n}): 3–5 min, al dente.`)}
  steps.push(`Esfrie em assadeiras rasas e monte: ${s.n.al} potes de almoço${PP.length>1?` (${s.n.al/PP.length} de cada)`:''} e ${s.n.ja} ${sopa?`potes de sopa${PP.length>1?' de 1 L (porção para os dois)':''}`:'potes de jantar'}. Etiquete tudo.`);
  steps.push(`Guarde ${s.fr} na geladeira${s.fz?` e ${s.fz} no freezer (até ${plusDays(s.a,30)})`:''}.`);
  const c0=ms(s),thw={};s.mar.forEach(x=>{if(mine(x)&&x.d>=s.a+3)thw[x.d-1]=(thw[x.d-1]||0)+1});const th=Object.keys(thw).map(Number).sort((a,b)=>a-b);
  return`<details class="card" data-id="${id}"${ui.open.has(id)?' open':''}><summary><span class="st">${WDS[wd(s.a)]} ${dd(s.a)}</span><span class="sm">para ${dd(s.a)} a ${dd(s.b)} · ${c0.al} almoços, ${c0.ja} ${sopa?'sopas':'jantares'}</span><span class="amt">${c0.al+c0.ja}<small>potes</small></span></summary><div class="dbody">
  <h3>Cardápio${nm?' de '+esc(nm):''}</h3><div class="tapes">${Object.values(s.combo).filter(c=>wh==null||!c.cnt||c.cnt[wh]).map(c=>{const n=wh!=null&&c.cnt?c.cnt[wh]:c.n;return`<span class="tape">${esc(c.t)}<small>${c.m} · ${n} pote${n>1?'s':''}${wh!=null&&!c.cnt?' dos dois':''}${wh==null&&c.cnt&&PP.length>1?(c.cnt.every(x=>x===c.cnt[0])?` (${c.cnt[0]} de cada)`:' · '+c.cnt.map((x,i)=>x?esc(PP[i].n)+' '+x:'').filter(Boolean).join(', ')):''}${c.note?' · '+esc(wh!=null?(c.note.split('; ').map(x=>x.startsWith(nm+': ')?x.slice(nm.length+2):PP.some(p=>x.startsWith(p.n+': '))?'':x).filter(Boolean).join('; ')):c.note):''}</small></span>`}).join('')}</div>
  <h3>O que cozinhar (cru, cozinha ${PP.length>1?'dos dois':'sua'})</h3><div class="kv">${cook.map(i=>`<span>${IT[i].n}</span><span>${fq(i,s.cook[i])}</span>`).join('')}</div>
  <h3>Passo a passo</h3><ol class="how">${steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>
  ${th.length?`<h3>Noites de descongelar${nm?' (potes de '+esc(nm)+(sopa?' + sopa':'')+')':''}</h3><div class="kv">${th.map(d=>`<span>${WDS[wd(d)]} ${dd(d)}, à noite</span><span>${thw[d]} pote${thw[d]>1?'s':''}</span>`).join('')}</div>`:''}
  </div></details>`}).join('')}</section></div>`}

function tripText(t){let o=`Compras ${dd(t.d)} (≈ ${brl(t.cost)})\n`,c='';t.buy.forEach(b=>{const I=IT[b.i];if(I.c!==c){c=I.c;o+=`\n${CATS[c]}\n`}o+=`- ${I.n}: ${b.packs} × ${I.pl}\n`});return o}
function vCompras(){const P=plan,S=st.s,M=money();const hc=plan.PP.length>1?(h=>h.slice(0,h.indexOf('</section>')+10))(vCasal()):'';
 return hc+`<div class="wrap"><section class="sec"><h2>≈ ${brl0(P.total)} em ${P.trips.length} idas ao mercado</h2><p class="sub">Disponível depois da reserva: ${brl0(P.avail)}. Sobra em despensa para janeiro: ≈ ${brl0(P.left)} (arroz, óleo, café…).</p>
 <div class="seg" role="group" aria-label="Como comprar"><button data-seg="shop:semanal" aria-pressed="${S.shop==='semanal'}">Tudo toda semana</button><button data-seg="shop:mensal" aria-pressed="${S.shop==='mensal'}">Grande no dia 1 + frescos</button></div>
 <p class="small mut" style="margin-top:8px">${S.shop==='mensal'?'No dia 1 vocês compram mercearia e carnes do mês inteiro (porcione a carne crua por preparo e congele). Hortifrúti, pão e ovos ficam para cada preparo.':'Cada compra cobre só até o próximo preparo: menos dinheiro de uma vez e tudo fresco. Pacotes grandes (arroz, óleo) duram várias semanas.'}</p></section>
 <section class="sec">${P.trips.map((t,ti)=>{const id='t'+ti,got=t.buy.filter(b=>st.got[t.d+':'+b.i]).length;let c='';const sp=st.spent[t.d];
  return`<details class="card" data-id="${id}"${ui.open.has(id)?' open':''}><summary><span class="st">${WDS[wd(t.d)]} ${dd(t.d)}</span><span class="sm">${got} de ${t.buy.length} itens no carrinho · para ${dd(t.d)} a ${dd(t.b)}</span><span class="amt">≈ ${brl0(t.cost)}<small>previsto</small></span></summary><div class="dbody">
  <ul class="items">${t.buy.map(b=>{const I=IT[b.i],k=t.d+':'+b.i,g=!!st.got[k];let h='';if(I.c!==c){c=I.c;h=`<li style="display:block;padding:0"><p class="cat">${CATS[c]}</p></li>`}
   return h+`<li class="${g?'got':''}"><button class="ck" data-got="${k}" aria-pressed="${g}" aria-label="Peguei ${esc(I.n)}">${CHK}</button><div><div class="nm">${esc(I.n)}</div><div class="q">${b.packs} × ${esc(I.pl)}${b.i==='pao'?' · congele em saquinhos':''}</div></div><span class="pr">${brl(b.c)}</span></li>`}).join('')}</ul>
  <div class="row2" style="margin-top:14px;align-items:end"><div class="fld" style="margin:0"><label for="sp${t.d}">Quanto gastei</label><div class="money"><input id="sp${t.d}" type="number" inputmode="decimal" step="0.01" min="0" data-spent="${t.d}" value="${sp!=null&&sp!==''?esc(sp):''}" placeholder="${num(t.cost,2)}"></div></div><button class="btn ghost" data-copy="${ti}">Copiar lista</button></div>
  ${sp!=null&&sp!==''?`<p class="small mut" style="margin-top:6px">${+sp<=t.cost?`${brl(t.cost-sp)} abaixo do previsto.`:`${brl(sp-t.cost)} acima do previsto.`}</p>`:''}
  </div></details>`}).join('')}</section>
 <section class="sec"><h2>Outros gastos no cartão</h2><p class="sub">Padaria, ceia, delivery: tudo que sai do saldo e não está na lista.</p><div class="card">
 <form id="xf" class="xform"><div class="fld full" style="margin:0"><label for="xd">O quê</label><input id="xd" type="text" maxlength="60" placeholder="Ex.: ceia de Natal"></div><div class="fld" style="margin:0"><label for="xv">Valor</label><div class="money"><input id="xv" type="number" inputmode="decimal" step="0.01" min="0"></div></div><div class="fld" style="margin:0"><label for="xdy">Dia</label><input id="xdy" type="number" min="1" max="31" value="${refDay}"></div><button class="btn full" type="submit">Lançar gasto</button></form>
 ${st.extra.length?st.extra.slice().sort((a,b)=>a.d-b.d).map(x=>`<div class="xrow"><span>${dd(x.d)} · ${esc(x.desc||'Gasto')}</span><b>${brl(x.v)}</b><button class="xbtn" data-delx="${esc(x.id)}" aria-label="Apagar">×</button></div>`).join(''):'<p class="small mut" style="margin-top:10px">Nenhum gasto extra lançado.</p>'}
 <p style="margin-top:10px"><b>Total gasto até agora: ${brl(M.real)}</b></p></div></section></div>`}

const seg=(k,opts)=>`<div class="seg" role="group">${opts.map(([v,l])=>`<button data-seg="${k}:${v}" aria-pressed="${String(st.s[k])===String(v)}">${l}</button>`).join('')}</div>`;
const sel=(k,opts)=>`<select id="f-${k}" data-s="${k}">${opts.map(([v,l])=>`<option value="${v}"${String(st.s[k])===String(v)?' selected':''}>${l}</option>`).join('')}</select>`;
const tog=(attr,on,l)=>`<div class="prow" style="grid-template-columns:minmax(0,1fr) 56px"><span>${l}</span><button class="sw2" ${attr} aria-pressed="${!!on}" aria-label="${l}"></button></div>`;
function vAjustes(){const S=st.s,PP=people(S);
 return`<div class="wrap cols"><div>
 <section class="sec"><h2>Cartão</h2><div class="card"><div class="fld"><label for="f-budget">Valor que cai no cartão em dezembro</label><div class="money"><input id="f-budget" type="number" inputmode="decimal" min="0" step="0.01" data-s="budget" value="${+S.budget}"></div></div>
 <div class="fld"><label for="f-reserve">Reserva para imprevistos e ceia: ${+S.reserve}%</label><input id="f-reserve" type="range" min="0" max="30" step="5" data-s="reserve" value="${+S.reserve}" style="width:100%;min-height:44px;accent-color:var(--tom)"><span class="hint">${brl(S.budget*S.reserve/100)} ficam fora do plano.</span></div></div></section>
 <section class="sec"><h2>Pessoas</h2><div class="card">${tog('data-tog="dupla"',S.dupla,'Marmitas para 2 pessoas')}
 <div class="fld" style="margin-top:12px"><span class="lbl">Objetivo dos dois</span>${seg('goal',[['perder','Perder gordura'],['manter','Manter'],['ganhar','Ganhar massa']])}</div>
 ${PP.map((p,pi)=>`<div class="row2" style="margin-top:6px"><div class="fld"><label for="pn${pi}">Nome</label><input id="pn${pi}" type="text" maxlength="20" data-pn="${pi}" value="${esc(p.n)}"></div><div class="fld"><label for="pw${pi}">Peso (kg)</label><input id="pw${pi}" type="number" inputmode="decimal" min="35" max="200" step="0.5" data-pw="${pi}" value="${+p.w}"></div></div><div class="fld"><span class="lbl">${esc(p.n)} não come</span><div class="chips">${EXL.map(i=>`<button class="chip" data-ex="${pi}:${i}" aria-pressed="${(p.ex||[]).includes(i)}">${IT[i].n}</button>`).join('')}</div><span class="hint">Marcados saem das marmitas de ${esc(p.n)}. Quando dá, entra um substituto (batata no lugar da batata-doce).</span></div><div class="fld"><span class="lbl">Carnes que ${esc(p.n)} come</span><div class="chips">${PORD.filter(x=>S.prot[x]).map(x=>`<button class="chip" data-np="${pi}:${x}" aria-pressed="${!(p.np||[]).includes(x)}">${PR[x].sh}</button>`).join('')}</div><span class="hint">Desmarque o que ${esc(p.n)} não come: no dia daquela carne, o pote de ${esc(p.n)} vem com frango (ou outra carne que come).</span></div>`).join('')}
 <span class="hint small mut">O peso ajusta a porção de cada um, a água e a meta de proteína.</span></div></section>
 ${PP.map((p,pi)=>`<section class="sec"><h2>Treinos de ${esc(p.n)}</h2><div class="card">${[1,2,3,4,5,6,0].map(w=>{const t=p.train[w];return`<div class="trow"><b>${WDS[w]}</b><button class="sw2" data-tr="${pi}:${w}:on" aria-pressed="${!!t.on}" aria-label="Treino ${WDL[w]}"></button><input type="time" data-tr="${pi}:${w}:t" value="${esc(t.t)}" aria-label="Horário ${WDL[w]}"><select data-tr="${pi}:${w}:y" aria-label="Tipo ${WDL[w]}">${TYPES.concat(TYPES.includes(t.y)?[]:[t.y]).map(y=>`<option${y===t.y?' selected':''}>${esc(y)}</option>`).join('')}</select></div>`}).join('')}</div></section>`).join('')}
 </div><div>
 <section class="sec"><h2>Refeições</h2><div class="card">
 <div class="row2"><div class="fld"><label for="f-tC">Café</label><input id="f-tC" type="time" data-s="tC" value="${esc(S.tC)}"></div><div class="fld"><label for="f-tA">Almoço</label><input id="f-tA" type="time" data-s="tA" value="${esc(S.tA)}"></div><div class="fld"><label for="f-tL">Café da tarde</label><input id="f-tL" type="time" data-s="tL" value="${esc(S.tL)}"></div><div class="fld"><label for="f-tJ">Jantar</label><input id="f-tJ" type="time" data-s="tJ" value="${esc(S.tJ)}"></div><div class="fld"><label for="f-tZ">Ceia</label><input id="f-tZ" type="time" data-s="tZ" value="${esc(S.tZ)}"></div></div>
 <div class="fld"><label for="f-cafe">Café da manhã</label>${sel('cafe',[['alternar','Alternar pão com ovo e cuscuz com ovo'],['paoovo','Pão com ovos'],['cuscuz','Cuscuz com ovos'],['aveia','Mingau de aveia com banana'],['nao','Não tomamos café em casa']])}</div>
 <div class="fld"><label for="f-lanche">Café da tarde nos dias sem treino</label>${sel('lanche',[['frutaovo','Banana + 1 ovo cozido'],['iogurte','Iogurte com banana'],['fruta','Só banana'],['nao','Sem lanche']])}<span class="hint">No dia de treino de cada um, o lanche vira pré-treino, 1 h antes.</span></div>
 <div class="fld"><label for="f-ceia">Ceia</label>${sel('ceia',[['cha','Chá de camomila ou erva-cidreira'],['pipoca','Pipoca de panela'],['ovo','1 ovo cozido'],['nao','Sem ceia']])}</div>
 <div class="fld"><span class="lbl">Jantar</span>${seg('jtipo',[['sopa','Sopa ou caldo'],['prato','Prato completo']])}<span class="hint">Sopa sai mais barata, esquenta fácil na panela e combina com perder gordura.</span></div>
 ${tog('data-tog="almoco"',S.almoco,'Marmita no almoço')}${tog('data-tog="jantar"',S.jantar,'Marmita no jantar')}${tog('data-tog="fds"',S.fds,'Marmitas também no fim de semana')}</div></section>
 <section class="sec"><h2>Café puro</h2><p class="sub">Sem açúcar, xícara pequena (7 g de pó).</p><div class="card">${tog('data-cf="cafe"',S.cf.cafe,'No café da manhã')}${tog('data-cf="almoco"',S.cf.almoco,'Depois do almoço')}${tog('data-cf="lanche"',S.cf.lanche,'No lanche e no pré-treino')}${tog('data-cf="jantar"',S.cf.jantar,'No jantar')}<span class="hint small mut">Desliguei no jantar porque café à noite costuma atrapalhar o sono. Ligue se não incomodar vocês.</span></div></section>
 <section class="sec"><h2>Marmitas e compras</h2><div class="card"><div class="fld"><span class="lbl">Ritmo do preparo</span>${seg('prepMode',[['semanal','Toda semana'],['quinzenal','A cada 15 dias']])}<span class="hint">Quinzenal: menos tempo na cozinha, mais espaço no freezer.</span></div>
 <div class="fld"><label for="f-prepDay">Dia do preparo</label>${sel('prepDay',WDL.map((l,i)=>[i,l]))}</div>
 <div class="fld"><span class="lbl">Compras</span>${seg('shop',[['semanal','Toda semana'],['mensal','Grande no dia 1 + frescos']])}</div>
 ${tog('data-tog="fit"',S.fit,'Trocar carnes caras para caber no orçamento')}<div class="fld" style="margin-top:12px"><span class="lbl">Carnes que vocês topam comer</span><div class="chips">${PORD.map(p=>`<button class="chip" data-prot="${p}" aria-pressed="${!!S.prot[p]}">${PR[p].sh}</button>`).join('')}</div><span class="hint">Se o dinheiro apertar, o app troca as mais caras pelas mais baratas desta lista.</span></div></div></section>
 <section class="sec"><h2>Preços</h2><p class="sub">Corrija com o preço do seu mercado. Tudo se recalcula.</p><div class="card">
 ${Object.keys(IT).map(i=>{const I=IT[i];return`<div class="prow"><span>${esc(I.n)}<small>${esc(I.pl)} · ${SRC[I.s]}</small></span><div class="money"><input type="number" inputmode="decimal" step="0.01" min="0" data-pp="${i}" value="${(S.pp[i]>0?S.pp[i]:I.pp).toFixed(2)}" aria-label="Preço ${esc(I.n)}"></div></div>`}).join('')}
 <button class="btn ghost" data-act="resetpp" style="margin-top:10px">Voltar aos preços de referência</button></div></section>
 <section class="sec"><h2>Aparência</h2><div class="card"><div class="fld" style="margin:0"><span class="lbl">Tema deste celular</span><div class="seg" role="group" aria-label="Tema"><button data-tema="auto" aria-pressed="${tema()==='auto'}">Automático</button><button data-tema="light" aria-pressed="${tema()==='light'}">Claro</button><button data-tema="dark" aria-pressed="${tema()==='dark'}">Escuro</button></div><span class="hint">Automático segue o modo claro ou escuro do celular.</span></div></div></section>
 <section class="sec"><h2>Notificações</h2><p class="sub">Avisos nos horários de Refeições e dos treinos, para os dois.</p>${pushCard()}<div class="card">${tog('data-tog="avAgua"',S.avAgua!==false,'Lembrar de beber água (10h e 15h)')}<span class="hint small mut">Mudou um horário? Os avisos se ajustam sozinhos nos dois celulares.</span></div></section>
 <section class="sec"><h2>Instalar no celular</h2><div class="card"><p class="small"><b>Android (Chrome):</b> menu ⋮ › <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.<br><b>iPhone (Safari):</b> botão Compartilhar › <b>Adicionar à Tela de Início</b>. No iPhone, as notificações só funcionam abrindo pelo ícone.</p>${PP.length>1?`<div class="fld" style="margin-top:12px"><span class="lbl">Este celular é de</span><div class="seg">${PP.map((p,pi)=>`<button data-me="${pi}" aria-pressed="${ui.me===String(pi)}">${esc(p.n)}</button>`).join('')}</div></div>`:''}</div></section>
 <section class="sec"><h2>Dados de vocês</h2><div class="card"><p class="small" id="syncTxt">${syncLabel()}</p>${fuser?`<p class="small mut" style="margin-top:6px">Conectado como ${esc(fuser.email||'')}.</p>`:''}<div class="row2" style="margin-top:10px">${fuser?'<button class="btn ghost" data-act="logout">Sair da conta</button>':''}<button class="btn ${ui.arm?'warn':'ghost'}" data-act="reset">${ui.arm?'Toque de novo para apagar tudo':'Apagar tudo e recomeçar'}</button></div></div></section>
 </div></div>`}

const TABS=['painel','mes','marmitas','receitas','compras','ajustes'],TT={painel:'Painel',mes:'Mês',marmitas:'Marmitas',receitas:'Receitas',compras:'Compras',ajustes:'Ajustes'};
function cur(){const t=location.hash.slice(1);return TABS.includes(t)?t:'painel'}
function render(){if(needLogin){$('#app').innerHTML=vLogin();$('#ttl').textContent='Entrar';return}const T=cur();document.querySelectorAll('[data-tab]').forEach(a=>a.setAttribute('aria-current',a.dataset.tab===T?'page':'false'));
 $('#ttl').textContent=TT[T];{const h=$('.hd small');if(h)h.textContent=(ui.me!=null&&plan.PP[+ui.me]?'Olá, '+plan.PP[+ui.me].n+' · ':'')+'Dezembro de 2026'}$('#app').innerHTML=(['painel','mes','receitas'].includes(T)&&plan.PP.length>1?whoBar():'')+{painel:vPainel,mes:vMes,marmitas:vMarmitas,receitas:vReceitas,compras:vCompras,ajustes:vAjustes}[T]()}
function recalc(){plan=fitPlan();render();queueAgenda()}

// ===== Sincronização entre os dois celulares (Firebase Firestore) =====
const CFG=self.APP_CONFIG||{};
let sync='local',ref=null,base=null,chain=Promise.resolve(),tmr=null,meRef=null,agRef=null,agLast='',agTmr=null,fdb=null,fuser=null,needLogin=false;
const names=()=>plan.PP.map(p=>p.n).join(' e ');
function syncLabel(){return sync==='conta'?`Salvo e compartilhado: ${names()} veem e marcam as mesmas informações, cada um no seu celular.`:sync==='offline'?'Sem conexão agora. As mudanças ficam neste aparelho e sobem sozinhas quando a internet voltar.':'Salvo só neste aparelho: o Firebase ainda não foi configurado em config.js.'}
function setSync(v){sync=v;const e=$('#sync');e.className='sync'+(v==='conta'?' ok':'');e.lastChild.textContent=v==='conta'?'compartilhado':v==='offline'?'sem conexão':'salvo neste aparelho';const t=$('#syncTxt');if(t)t.textContent=syncLabel()}
function diff(a,b){const o={};let n=0;for(const k in b){const x=a?a[k]:undefined,y=b[k];if(isObj(x)&&isObj(y)){const d=diff(x,y);if(d){o[k]=d;n++}}else if(JSON.stringify(x)!==JSON.stringify(y)){o[k]=y===undefined?null:y;n++}}if(a)for(const k in a)if(!(k in b)){o[k]=null;n++}return n?o:null}
// set com merge: mapas são mesclados campo a campo; null vira remoção do campo
const toFs=o=>{const r={};for(const k in o){const v=o[k];r[k]=v===null?firebase.firestore.FieldValue.delete():isObj(v)?toFs(v):v}return r};
function push(){tmr=null;if(!ref)return;const cur=clone(st),d=diff(base,cur);if(!d)return;const b0=base;base=cur;chain=chain.then(()=>b0?ref.set(toFs(d),{merge:true}):ref.set(cur)).then(()=>setSync('conta'),()=>{base=b0;setSync('offline')})}
function save(){st.at=Date.now();try{localStorage.setItem(LS,JSON.stringify(st))}catch(e){}if(ref){clearTimeout(tmr);tmr=setTimeout(push,700)}}
function setS(k,v){st.s[k]=v;save();recalc()}

// ===== Agenda de avisos: o app calcula os horários e o notificador só lê e envia =====
const AVK={cafe:1,almoco:1,lanche:1,jantar:1,ceia:1,treino:1,compras:1,preparo:1,degelo:1};
function buildAgenda(){const out=[],PP=plan.PP,two=PP.length>1,cut=s=>s.length>170?s.slice(0,167)+'…':s;
 const at=(d,t)=>{const[h,m]=String(t).split(':').map(Number);return+new Date(2026,11,d,h||0,m||0)};
 for(let d=1;d<=31;d++){
  dayItems(d,null).forEach(x=>{if(x.free)return;const base=x.k.split(':')[0];if(!AVK[base])return;const pi=x.pi!=null?x.pi:null,nm=pi!=null&&two?PP[pi].n+' · ':'',ts=at(d,x.t);
   out.push({ts,k:iso(d)+':'+x.k,t:nm+x.h+' · '+x.t,b:cut(x.x),w:pi});
   if(x.mar)out.push({ts:ts-15*6e4,k:iso(d)+':esq:'+x.k,t:'Esquentar: '+x.h.toLowerCase()+' às '+x.t,b:x.k==='jantar'&&st.s.jtipo==='sopa'?'Sopa na panela, mexendo, até ferver.':'Frigideira tampada com 2 a 3 colheres de água, 6 a 8 min, mexendo.',w:null,skip:iso(d)+':'+x.k})});
  if(st.s.avAgua!==false)[['10:00','2 copos até o almoço'],['15:00','2 copos à tarde']].forEach(([t,b])=>out.push({ts:at(d,t),k:iso(d)+':agua:'+t,t:'Água · '+t,b:b+'. '+PP.map((p,pi)=>`${p.n}: ${num(plan.days[d].pp[pi].water,1)} L hoje`).join(' · '),w:null}))}
 return out.sort((a,b)=>a.ts-b.ts)}
function queueAgenda(){if(!agRef)return;clearTimeout(agTmr);agTmr=setTimeout(()=>{const j=JSON.stringify(buildAgenda());if(j===agLast)return;agLast=j;agRef.set({json:j,at:Date.now(),tz:'America/Sao_Paulo'}).catch(()=>{agLast=''})},1500)}

// ===== Notificações push neste aparelho =====
const LSP='dieta-push',LST='dieta-token';
const lsg=k=>{try{return localStorage.getItem(k)}catch(e){return null}},lss=(k,v)=>{try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}};
ui.pref=lsg('dieta-pref')||'todos';ui.pmsg='';
function pushState(){if(!('Notification' in window)||!('serviceWorker' in navigator))return'unsupported';if(!fdb)return'nocfg';if(Notification.permission==='denied')return'denied';return Notification.permission==='granted'&&lsg(LST)?'on':'off'}
let swr=null;const swReady=()=>swr||(swr='serviceWorker' in navigator?navigator.serviceWorker.register('sw.js').then(()=>navigator.serviceWorker.ready):Promise.reject(new Error('sem service worker')));
async function saveToken(tok){const old=lsg(LST);if(old&&old!==tok)fdb.collection('tokens').doc(old).delete().catch(()=>{});lss(LST,tok);
 await fdb.collection('tokens').doc(tok).set({token:tok,uid:fuser.uid,who:ui.me==null?'':String(ui.me),pref:ui.pref,ua:navigator.userAgent.slice(0,120),at:Date.now()})}
async function pushOn(){ui.pmsg='Ativando…';render();try{
 if(!CFG.vapidKey||String(CFG.vapidKey).startsWith('COLE'))throw new Error('Falta a chave VAPID em config.js.');
 if(!(await firebase.messaging.isSupported()))throw new Error('Este navegador não recebe notificações. No iPhone, adicione o app à Tela de Início e abra por lá.');
 const p=await Notification.requestPermission();if(p!=='granted')throw new Error('Permissão negada. Libere as notificações deste site nas configurações do navegador.');
 const reg=await swReady(),tok=await firebase.messaging().getToken({vapidKey:CFG.vapidKey,serviceWorkerRegistration:reg});if(!tok)throw new Error('Não deu para gerar o token.');
 await saveToken(tok);listenFg();ui.pmsg='Notificações ligadas neste celular.'}catch(e){ui.pmsg=e.message||String(e)}render()}
async function pushOff(){const t=lsg(LST);lss(LST,null);try{if(t)await fdb.collection('tokens').doc(t).delete();await firebase.messaging().deleteToken()}catch(e){}ui.pmsg='Notificações desligadas neste celular.';render()}
async function pushTest(){try{const by=ui.me!=null&&plan.PP[+ui.me]?plan.PP[+ui.me].n:'Alguém';await fdb.doc('casa/teste').set({ts:Date.now(),t:'Teste de aviso',b:`${by} mandou um teste. Se chegou, os avisos estão funcionando neste celular.`});ui.pmsg='Teste enviado: os celulares com aviso ligado recebem em até 1 minuto.'}catch(e){ui.pmsg='Não deu para enviar o teste: '+(e.message||e)}render()}
let fgOn=false;function listenFg(){if(fgOn)return;fgOn=true;try{firebase.messaging().onMessage(async m=>{const n=m.notification||{};const reg=await swReady();reg.showNotification(n.title||'Dieta de Dezembro',{body:n.body||'',icon:'icons/icon-192.png',badge:'icons/badge-96.png',tag:(m.data&&m.data.k)||undefined})})}catch(e){}}
async function refreshToken(){if(pushState()!=='on')return;try{if(!(await firebase.messaging.isSupported()))return;const reg=await swReady(),tok=await firebase.messaging().getToken({vapidKey:CFG.vapidKey,serviceWorkerRegistration:reg});if(tok)await saveToken(tok);listenFg()}catch(e){}}
function updTokenMeta(){const t=lsg(LST);if(t&&fdb)fdb.collection('tokens').doc(t).set({who:ui.me==null?'':String(ui.me),pref:ui.pref},{merge:true}).catch(()=>{})}

function avisosHoje(){const d=pre?1:post?31:refDay,ev=buildAgenda().filter(e=>e.k.startsWith(iso(d))),nw=Date.now();
 return ev.map(e=>{const pass=e.ts<=nw,dn=isDone(e.skip||e.k);return`<div class="xrow" style="grid-template-columns:52px minmax(0,1fr)${pass||dn?';opacity:.55':''}"><b>${new Date(e.ts).toTimeString().slice(0,5)}</b><span><b>${esc(e.t.replace(/ · \d\d:\d\d$/,''))}</b>${e.w!=null&&plan.PP.length>1?'':' <span class="tag">os dois</span>'}${dn?' <span class="tag">feito: sem aviso</span>':''}<br><span class="small mut">${esc(e.b)}</span></span></div>`}).join('')||'<p class="small mut">Nenhum aviso hoje.</p>'}
function pushCard(){const s=pushState(),PP=plan.PP;
 const txt={on:'Ligadas neste celular.',off:'Desligadas neste celular.',denied:'Bloqueadas no navegador. Libere as notificações deste site nas configurações e toque em Ativar.',unsupported:'Este navegador não recebe notificações. No iPhone (iOS 16.4 ou mais novo), adicione o app à Tela de Início e abra pelo ícone.',nocfg:'Entre com a conta (Firebase configurado) para ligar os avisos.'}[s];
 return`<div class="card"><p><b>Notificações:</b> ${txt}</p>${ui.pmsg?`<p class="small" style="margin-top:6px">${esc(ui.pmsg)}</p>`:''}
 ${s==='nocfg'||s==='unsupported'?'':`<div class="row2" style="margin-top:10px">${s==='on'?'<button class="btn ghost" data-act="push-off">Desligar</button><button class="btn" data-act="push-test">Enviar teste</button>':'<button class="btn" data-act="push-on" style="grid-column:1/-1">Ativar notificações</button>'}</div>`}
 ${PP.length>1?`<div class="fld" style="margin-top:12px"><span class="lbl">Avisos que chegam neste celular</span><div class="seg"><button data-pref="todos" aria-pressed="${ui.pref==='todos'}">Dos dois</button><button data-pref="meus" aria-pressed="${ui.pref==='meus'}">Só os meus</button></div><span class="hint">Refeições, compras, preparo, descongelar e água são da casa e chegam para os dois. Treino e pré-treino são de cada um: em “Dos dois”, você também vê os do outro.</span></div>`:''}</div>`}
function avisosBox(){return`<section class="sec"><h2>Avisos de hoje</h2><p class="sub">Chegam no celular de ${names()} na hora certa, mesmo com o app fechado. Item marcado como feito não avisa.</p>${pushCard()}<div class="card">${avisosHoje()}</div></section>`}

const tema=()=>{const t=lsg('dieta-tema');return t==='light'||t==='dark'?t:'auto'};
function paintBar(){const m=document.querySelector('meta[name=theme-color]');if(m)m.content=getComputedStyle(document.documentElement).getPropertyValue('--basil').trim()||m.content}
function setTema(t){const r=document.documentElement;if(t==='light'||t==='dark'){r.dataset.theme=t;lss('dieta-tema',t)}else{delete r.dataset.theme;lss('dieta-tema',null)}paintBar()}
try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',paintBar)}catch(e){}paintBar();
function vLogin(){return`<div class="wrap"><section class="sec"><div class="card"><h2 style="margin-bottom:6px">Entrar</h2><p class="sub">Só as duas pessoas da casa têm acesso. Use o e-mail e a senha criados no Firebase.</p>
 <form id="lf"><div class="fld"><label for="le">E-mail</label><input id="le" type="email" autocomplete="username" required></div><div class="fld"><label for="lpw">Senha</label><input id="lpw" type="password" autocomplete="current-password" required></div><p id="lerr" class="small" style="color:var(--tom);min-height:1.5em"></p><button class="btn" type="submit">Entrar</button></form></div></section></div>`}

document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const ds=b.dataset;
 if(ds.done){st.done[ds.done]=!st.done[ds.done];if(!st.done[ds.done])delete st.done[ds.done];save();render()}
 else if(ds.wa){const i=ds.wa.lastIndexOf(':'),k=ds.wa.slice(0,i),n=Math.max(0,Math.min(20,(+st.water[k]||0)+(+ds.wa.slice(i+1))));if(n)st.water[k]=n;else delete st.water[k];save();render()}
 else if(ds.jump){const g=document.getElementById('g-'+ds.jump);if(g)g.scrollIntoView({behavior:'smooth'})}
 else if(ds.me){ui.me=ui.who=ds.me;try{localStorage.setItem('dieta-me',ds.me);localStorage.setItem('dieta-who',ds.me)}catch(e){}if(meRef)meRef.set({who:ds.me},{merge:true}).catch(()=>{});updTokenMeta();render()}
 else if(ds.who){ui.who=ds.who;try{localStorage.setItem('dieta-who',ds.who)}catch(e){}render()}
 else if(ds.day){ui.day=+ds.day;render()}
 else if(ds.free){const k=iso(ui.day||refDay),a=(st.free[k]||[]).slice(),i=a.indexOf(ds.free);if(i>=0)a.splice(i,1);else a.push(ds.free);if(a.length)st.free[k]=a;else delete st.free[k];save();recalc()}
 else if(ds.got){st.got[ds.got]=!st.got[ds.got];if(!st.got[ds.got])delete st.got[ds.got];save();render()}
 else if(ds.seg){const[k,v]=ds.seg.split(':');setS(k,v)}
 else if(ds.tog){setS(ds.tog,!st.s[ds.tog])}
 else if(ds.cf){st.s.cf[ds.cf]=!st.s.cf[ds.cf];save();recalc()}
 else if(ds.np){const[pi,p]=ds.np.split(':');const pe=st.s.ppl[+pi];if(!pe||!PORD.includes(p))return;const a=pe.np||(pe.np=[]),k=a.indexOf(p);if(k>=0)a.splice(k,1);else{if(PORD.filter(x=>st.s.prot[x]&&!a.includes(x)).length<=1)return;a.push(p)}save();recalc()}
 else if(ds.ex){const[pi,i]=ds.ex.split(':');const pe=st.s.ppl[+pi];if(!pe||!EXL.includes(i))return;const a=pe.ex||(pe.ex=[]),k=a.indexOf(i);if(k>=0)a.splice(k,1);else a.push(i);save();recalc()}
 else if(ds.prot){const n=PORD.filter(p=>st.s.prot[p]).length;if(st.s.prot[ds.prot]&&n<=1)return;st.s.prot[ds.prot]=!st.s.prot[ds.prot];save();recalc()}
 else if(ds.tr&&ds.tr.endsWith(':on')){const[pi,w]=ds.tr.split(':').map(Number);const t=st.s.ppl[pi].train[w];t.on=!t.on;save();recalc()}
 else if(ds.copy){const t=plan.trips[+ds.copy];if(!t)return;const txt=tripText(t);try{navigator.clipboard.writeText(txt).then(()=>{b.textContent='Copiada!'},()=>{b.textContent='Não deu para copiar'})}catch(er){b.textContent='Não deu para copiar'}}
 else if(ds.delx){st.extra=st.extra.filter(x=>x.id!==ds.delx);save();render()}
 else if(ds.tema){setTema(ds.tema);render()}
 else if(ds.pref){ui.pref=ds.pref;lss('dieta-pref',ds.pref);updTokenMeta();render()}
 else if(ds.act==='push-on')pushOn();
 else if(ds.act==='push-off')pushOff();
 else if(ds.act==='push-test')pushTest();
 else if(ds.act==='logout'){pushOff().finally(()=>firebase.auth().signOut().then(()=>location.reload()))}
 else if(ds.act==='resetpp'){st.s.pp={};save();recalc()}
 else if(ds.act==='reset'){if(!ui.arm){ui.arm=true;render();return}ui.arm=false;st=fresh();save();recalc()}
});
document.addEventListener('change',e=>{const el=e.target,ds=el.dataset;
 if(ds.s){const k=ds.s;let v=el.value;if(typeof DEF[k]==='number'){v=+v;if(!(v>=0))return}setS(k,v)}
 else if(ds.tr){const[pi,w,f]=ds.tr.split(':');if(f==='t'&&!/^\d\d:\d\d$/.test(el.value))return;st.s.ppl[+pi].train[+w][f]=el.value;save();recalc()}
 else if(ds.pn){const v=el.value.trim().slice(0,20);if(v){st.s.ppl[+ds.pn].n=v;save();recalc()}}
 else if(ds.pw){const v=+el.value;if(v>=35&&v<=200){st.s.ppl[+ds.pw].w=v;save();recalc()}}
 else if(ds.pp){const v=+el.value;if(v>0)st.s.pp[ds.pp]=v;else delete st.s.pp[ds.pp];save();recalc()}
 else if(ds.spent){const v=el.value;if(v===''||!(+v>=0))delete st.spent[ds.spent];else st.spent[ds.spent]=+v;save();render()}
});
document.addEventListener('input',e=>{const el=e.target;if(el.type==='range'&&el.dataset.s){const l=el.closest('.fld').querySelector('label');if(l)l.textContent=`Reserva para imprevistos e ceia: ${el.value}%`}});
document.addEventListener('submit',e=>{if(e.target.id!=='xf')return;e.preventDefault();const v=+$('#xv').value,d=Math.min(31,Math.max(1,+$('#xdy').value||refDay));if(!(v>0))return;
 st.extra.push({id:Date.now().toString(36),d,desc:$('#xd').value.trim().slice(0,60),v});save();render()});
document.addEventListener('toggle',e=>{const d=e.target;if(d.tagName==='DETAILS'&&d.dataset.id){if(d.open)ui.open.add(d.dataset.id);else ui.open.delete(d.dataset.id)}},true);
window.addEventListener('hashchange',()=>{ui.arm=false;render();window.scrollTo(0,0)});
render();

async function startSync(db,u){fdb=db;fuser=u;needLogin=false;
 const sh=db.doc('casa/plano');meRef=db.doc('membros/'+u.uid);agRef=db.doc('casa/agenda');
 const to=setTimeout(()=>setSync('offline'),10000);
 let snap,me;try{[snap,me]=await Promise.all([sh.get(),meRef.get()])}finally{clearTimeout(to)}
 if(me&&me.exists){const w=String(me.data().who);if(w==='0'||w==='1'){ui.me=w;ui.who=w;lss('dieta-me',w);lss('dieta-who',w)}}
 if(snap.exists){const r=clone(snap.data());st=merge(r);base=r}else base=null;
 lss(LS,JSON.stringify(st));
 ref=sh;plan=fitPlan();render();setSync('conta');push();queueAgenda();refreshToken();
 sh.onSnapshot(s=>{if(s.metadata.hasPendingWrites||!s.exists||tmr)return;const r=clone(s.data());if(JSON.stringify(r)===JSON.stringify(base))return;st=merge(r);base=r;lss(LS,JSON.stringify(st));plan=fitPlan();render();queueAgenda()},()=>setSync('offline'))}
document.addEventListener('submit',async e=>{if(e.target.id!=='lf')return;e.preventDefault();const er=$('#lerr');er.textContent='Entrando…';
 try{const c=await firebase.auth().signInWithEmailAndPassword($('#le').value.trim(),$('#lpw').value);await startSync(firebase.firestore(),c.user)}
 catch(x){er.textContent=/permission/i.test(x.code||x.message)?'Esta conta não tem acesso aos dados da casa (confira os e-mails em firestore.rules).':'E-mail ou senha incorretos.'}});
(async()=>{try{
 if('serviceWorker' in navigator)swReady().catch(()=>{});
 const C=CFG.firebase;if(!window.firebase||!C||!C.apiKey||String(C.apiKey).startsWith('COLE')){setSync('local');return}
 firebase.initializeApp(C);const auth=firebase.auth(),db=firebase.firestore();
 try{await db.enablePersistence({synchronizeTabs:true})}catch(e){}
 const u=await new Promise(r=>{const off=auth.onAuthStateChanged(x=>{off();r(x)})});
 if(!u){needLogin=true;render();return}
 await startSync(db,u)
}catch(e){console.error(e);setSync('offline')}})();
}
