const DB_NAME="KobunMasterDB", DB_VER=3;
let db, words=[], settings={daily:30,weakWeight:5};
let session={mode:"today",queue:[],index:0,current:null,start:0,conf:null};

const seedWords=[
 {id:"seed-01",word:"あはれ",meaning:"しみじみとした趣・感動",pos:"名詞・形容動詞",conj:"—",level:"基礎"},
 {id:"seed-02",word:"をかし",meaning:"趣がある・おもしろい",pos:"形容詞",conj:"シク活用",level:"基礎"},
 {id:"seed-03",word:"いとほし",meaning:"気の毒だ・かわいそうだ",pos:"形容詞",conj:"シク活用",level:"標準"},
 {id:"seed-04",word:"あながちなり",meaning:"強引だ・むやみだ",pos:"形容動詞",conj:"ナリ活用",level:"標準"},
 {id:"seed-05",word:"あらまほし",meaning:"理想的だ・好ましい",pos:"形容詞",conj:"シク活用",level:"標準"},
 {id:"seed-06",word:"あへて",meaning:"あえて・進んで",pos:"副詞",conj:"—",level:"標準"},
 {id:"seed-07",word:"あへなし",meaning:"あっけない・どうしようもない",pos:"形容詞",conj:"ク活用",level:"発展"},
 {id:"seed-08",word:"あやし",meaning:"身分が低い・粗末だ／不思議だ",pos:"形容詞",conj:"シク活用",level:"基礎"},
 {id:"seed-09",word:"あやふし",meaning:"危険だ・危うい",pos:"形容詞",conj:"ク活用",level:"基礎"},
 {id:"seed-10",word:"ありがたし",meaning:"めったにない・すばらしい",pos:"形容詞",conj:"ク活用",level:"基礎"},
 {id:"seed-11",word:"いみじ",meaning:"とても・たいそう／すばらしい",pos:"形容詞",conj:"シク活用",level:"基礎"},
 {id:"seed-12",word:"うつくし",meaning:"かわいい・いとしい",pos:"形容詞",conj:"シク活用",level:"基礎"}
];

function reqToPromise(req){return new Promise((res,rej)=>{req.onsuccess=()=>res(req.result);req.onerror=()=>rej(req.error)})}
async function openDB(){
 return new Promise((resolve,reject)=>{
  const r=indexedDB.open(DB_NAME,DB_VER);
  r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains("words"))d.createObjectStore("words",{keyPath:"id"});if(!d.objectStoreNames.contains("settings"))d.createObjectStore("settings",{keyPath:"key"});};
  r.onsuccess=()=>{db=r.result;resolve()};
  r.onerror=()=>reject(r.error);
 });
}
async function getAll(store){return reqToPromise(db.transaction(store,"readonly").objectStore(store).getAll())}
async function put(store,obj){return reqToPromise(db.transaction(store,"readwrite").objectStore(store).put(obj))}
async function init(){
 await openDB();
 words=await getAll("words");
 if(!words.length){words=seedWords.map(w=>({...w,stats:blankStats()}));for(const w of words)await put("words",w)}
 const ss=await getAll("settings");for(const x of ss)settings[x.key]=x.value;
 renderHome();
 registerSW();
}
function blankStats(){return {correct:0,wrong:0,confidenceYes:0,confidenceNo:0,responseTimes:[],weakness:0,lastStudied:null,streak:0,nextReview:null,studyCount:0}}
function levelClass(l){return l==="基礎"?"basic":l==="発展"?"advanced":"standard"}
function toast(t){const e=document.getElementById("toast");e.textContent=t;e.style.display="block";setTimeout(()=>e.style.display="none",1800)}
function show(id){document.querySelectorAll(".view").forEach(x=>{x.classList.remove("active");x.setAttribute("aria-hidden","true")});const target=document.getElementById(id);target.classList.add("active");target.setAttribute("aria-hidden","false");window.scrollTo(0,0)}
function goHome(){show("home");renderHome()}
function showSettings(){show("settings");document.getElementById("daily").value=settings.daily;document.getElementById("weakWeight").value=settings.weakWeight;document.getElementById("weakWeightText").textContent=settings.weakWeight}
function saveSettings(){settings.daily=Math.max(1,Math.min(300,+document.getElementById("daily").value||30));settings.weakWeight=+document.getElementById("weakWeight").value;put("settings",{key:"daily",value:settings.daily});put("settings",{key:"weakWeight",value:settings.weakWeight});toast("設定を保存しました")}
function todayKey(){const d=new Date();return new Intl.DateTimeFormat("sv-SE",{timeZone:"Asia/Tokyo"}).format(d)}
function todayDone(){return words.reduce((n,w)=>n+(w.stats.lastStudied&&new Intl.DateTimeFormat("sv-SE",{timeZone:"Asia/Tokyo"}).format(new Date(w.stats.lastStudied))===todayKey()?1:0),0)}
function renderHome(){
 document.getElementById("todayText").textContent=`目標 ${settings.daily}語。弱点を優先して出題します。`;
 document.getElementById("todayCount").textContent=todayDone();
 document.getElementById("weakCount").textContent=words.filter(w=>w.stats.weakness>=20).length;
 document.getElementById("allCount").textContent=words.length;
}
function priority(w,mode){
 const s=w.stats; let p=s.weakness*settings.weakWeight;
 const overdue=s.nextReview?Math.max(0,Math.min(35,Math.floor((Date.now()-new Date(s.nextReview).getTime())/86400000)*6)):20;
 p+=overdue;
 if(mode==="review")p+=s.wrong*8+(s.nextReview&&Date.now()>=new Date(s.nextReview).getTime()?25:0);
 if(mode==="basic")p+=w.level==="基礎"?50:-999;
 if(mode==="standard")p+=w.level==="標準"?50:-999;
 if(mode==="advanced")p+=w.level==="発展"?50:-999;
 p+=Math.random()*5;
 return p;
}
function startMode(mode){
 let pool=words.filter(w=>mode==="basic"?w.level==="基礎":mode==="standard"?w.level==="標準":mode==="advanced"?w.level==="発展":true);
 if(mode==="weak")pool=pool.filter(w=>w.stats.weakness>0);
 if(mode==="review")pool=pool.filter(w=>w.stats.wrong>0||w.stats.weakness>20);
 if(!pool.length){toast("対象の単語がありません");return}
 pool.sort((a,b)=>priority(b,mode)-priority(a,mode));
 const n=Math.min(settings.daily,pool.length);
 session={mode,queue:pool.slice(0,n),index:0,current:null,start:0,conf:null};
 document.getElementById("modeTitle").textContent={today:"今日の学習",weak:"苦手単語",review:"復習",basic:"基礎",standard:"標準",advanced:"発展"}[mode]||"学習";
 show("study");loadCard();
}
function loadCard(){
 const w=session.queue[session.index];session.current=w;session.start=performance.now();session.conf=null;
 document.getElementById("studyNum").textContent=`${session.index+1}/${session.queue.length}`;
 document.getElementById("progressBar").style.width=`${session.index/session.queue.length*100}%`;
 document.getElementById("front").innerHTML=`<div class="tagline"><span class="pill ${levelClass(w.level)}">${w.level}</span></div><div class="bigword">${esc(w.word)}</div><div class="hint">右：自信あり　／　左：自信なし</div>`;
 document.getElementById("answer").style.display="none";document.getElementById("confidenceBtns").style.display="grid";document.getElementById("correctBtns").style.display="none";document.getElementById("swipeHelp").textContent="右スワイプ＝自信あり　左スワイプ＝自信なし";
}
async function confidence(yes){
 if(!session.current)return;
 session.conf=yes;const t=(performance.now()-session.start)/1000;
 session.current._rt=t;
 const s=session.current.stats;
 s.responseTimes.push(Math.round(t*10)/10);if(s.responseTimes.length>20)s.responseTimes.shift();
 yes?s.confidenceYes++:s.confidenceNo++;
 const rtPenalty=t>=3?7:0;
 s.weakness=Math.max(0,Math.min(100,s.weakness+(yes?-8:8)+rtPenalty));
 await put("words",session.current);showAnswer();
}
function showAnswer(){
 const w=session.current;
 document.getElementById("answer").style.display="block";
 document.getElementById("answer").innerHTML=`<div class="meaning">${esc(w.meaning)}</div><div class="detail"><b>品詞：</b>${esc(w.pos||"—")}<br><b>活用：</b>${esc(w.conj||"—")}<br><b>重要度：</b>${esc(w.level)}<br><span style="font-size:12px;color:#667085">回答時間 ${w._rt.toFixed(1)}秒</span></div>`;
 document.getElementById("confidenceBtns").style.display="none";document.getElementById("correctBtns").style.display="grid";document.getElementById("swipeHelp").textContent="右スワイプ＝正解　左スワイプ＝不正解";
}
async function correctness(ok){
 const w=session.current,s=w.stats;
 ok?(s.correct++,s.streak++):(s.wrong++,s.streak=0);
 s.studyCount=(s.studyCount||0)+1;
 s.lastStudied=new Date().toISOString();
 const gap=ok?(s.streak>=3?7:(s.streak>=2?3:1)):0;
 s.nextReview=new Date(Date.now()+gap*86400000).toISOString();
 const rtPenalty=w._rt>=3?5:0;
 if(ok)s.weakness=Math.max(0,s.weakness-(session.conf?5:3)+rtPenalty);
 else s.weakness=Math.min(100,s.weakness+(session.conf?22:15)+rtPenalty);
 delete w._rt;await put("words",w);
 words=words.map(x=>x.id===w.id?w:x);
 renderHome();
 session.index++;
 if(session.index>=session.queue.length){document.getElementById("progressBar").style.width="100%";toast("学習完了！");setTimeout(goHome,500);return}
 loadCard();
}
function showList(){show("list");renderList()}
function renderList(){
 const q=(document.getElementById("search").value||"").toLowerCase(),lv=document.getElementById("levelFilter").value;
 const arr=words.filter(w=>(!lv||w.level===lv)&&(!q||`${w.word} ${w.meaning} ${w.pos}`.toLowerCase().includes(q))).sort((a,b)=>b.stats.weakness-a.stats.weakness);
 document.getElementById("wordList").innerHTML=arr.length?arr.map(w=>{const avg=w.stats.responseTimes?.length?(w.stats.responseTimes.reduce((a,b)=>a+b,0)/w.stats.responseTimes.length).toFixed(1):"—";return `<div class="row"><div><div class="word">${esc(w.word)} <span class="pill ${levelClass(w.level)}">${w.level}</span></div><div class="meta">${esc(w.meaning)}　｜　${esc(w.pos||"—")}　｜　弱点 ${Math.round(w.stats.weakness)}　｜　平均 ${avg}秒</div></div><div class="meta">${w.stats.correct}正 / ${w.stats.wrong}誤</div></div>`}).join(""):`<div class="empty">該当する単語がありません。</div>`;
}
document.getElementById("search").addEventListener("input",renderList);document.getElementById("levelFilter").addEventListener("change",renderList);
document.getElementById("weakWeight").addEventListener("input",e=>document.getElementById("weakWeightText").textContent=e.target.value);
document.getElementById("importFile").addEventListener("change",restoreBackup);
document.getElementById("vocabFile").addEventListener("change",importVocab);

async function exportBackup(){
 const payload={version:1,exportedAt:new Date().toISOString(),words,settings};
 const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
 downloadBlob(blob,`kobun-master-backup-${todayKey()}.json`);
}
async function restoreBackup(e){
 const f=e.target.files[0];if(!f)return;const data=JSON.parse(await f.text());
 if(!data.words||!Array.isArray(data.words))throw new Error("不正なバックアップ");
 for(const w of data.words)await put("words",w);
 for(const k of Object.keys(data.settings||{}))await put("settings",{key:k,value:data.settings[k]});
 words=await getAll("words");Object.assign(settings,data.settings||{});renderHome();toast("バックアップを復元しました");
 e.target.value="";
}
async function importVocab(e){
 const f=e.target.files[0];if(!f)return;const text=await f.text();let rows=[];
 if(f.name.endsWith(".json"))rows=JSON.parse(text);
 else rows=parseCSV(text);
 if(!Array.isArray(rows))rows=[rows];
 for(const x of rows){
  if(!x.word||!x.meaning)continue;
  const id=x.id||("imp-"+crypto.randomUUID());
  await put("words",{id,word:String(x.word),meaning:String(x.meaning),pos:String(x.pos||"—"),conj:String(x.conj||"—"),level:["基礎","標準","発展"].includes(x.level)?x.level:"標準",stats:x.stats||blankStats()});
 }
 words=await getAll("words");renderHome();toast(`${rows.length}件を追加しました`);e.target.value="";
}
function parseCSV(t){
 const lines=t.trim().split(/\r?\n/), head=lines.shift().split(",").map(x=>x.trim());
 return lines.map(line=>{const vals=line.split(",");const o={};head.forEach((h,i)=>o[h]=vals[i]?.trim()||"");return o})
}
function downloadBlob(blob,name){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

let sx=0,sy=0;
const fc=document.getElementById("flashcard");
fc.addEventListener("pointerdown",e=>{sx=e.clientX;sy=e.clientY;fc.setPointerCapture(e.pointerId)});
fc.addEventListener("pointerup",e=>{const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.2){if(document.getElementById("confidenceBtns").style.display!=="none")confidence(dx>0);else correctness(dx>0)}});

async function registerSW(){if("serviceWorker"in navigator&&location.protocol!=="file:"){try{await navigator.serviceWorker.register("./sw.js")}catch(e){console.warn(e)}}}
document.getElementById("homeBtn").onclick=goHome;
init();
