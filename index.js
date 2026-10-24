const express=require('express');
const fs=require('fs');
const path=require('path');
const app=express();
app.use(express.json());
const PORT=process.env.PORT||10000;
const PIN=process.env.OWNER_PIN||"MY2KING100";
const SOUL_FILE=path.join(__dirname,'soul.json');
const BAK1=path.join(__dirname,'soul_backup.json');
const BAK2=path.join(__dirname,'soul_backup2.json');
let DB={},PRIV=true,GOD=false,CNT=0,ERR=null,FIX=null,ALERT=null;
const DEF={
abubakar:"Abubakar aka Yako - best friend tudun wada - PERMANENT",
anas:"Anas gar da gar - friend 70%",
khadijah:"Khadijah - Princess 40%",
murja:"Murja - Senior Queen 70%"
};
function logE(t,m){ERR={t,m,time:new Date().toISOString()};ALERT="ALERT KING! "+t+" - "+m+" at "+ERR.time+" - I don fix!";console.log("ERR",t,m);}
function logF(m){FIX={m,time:new Date().toISOString()};ALERT="FIXED KING! "+m+" at "+FIX.time+" - "+Object.keys(DB).length+" friends safe!";console.log("FIX",m);}
function load(){
try{
if(fs.existsSync(SOUL_FILE)){
let d=JSON.parse(fs.readFileSync(SOUL_FILE,'utf8'));
DB=Object.assign({},DEF,d.SOUL_DB||{});
PRIV=d.PRIVACY_MODE!==undefined?d.PRIVACY_MODE:true;
GOD=d.GOD_MODE_ACTIVE||false;
console.log("LOADED",Object.keys(DB).length);
save();return;
}
}catch(e){logE('LOAD_FAIL',e.message);
try{if(fs.existsSync(BAK1)){let d=JSON.parse(fs.readFileSync(BAK1,'utf8'));DB=Object.assign({},DEF,d.SOUL_DB||{});fs.writeFileSync(SOUL_FILE,JSON.stringify(d,null,2));logF("Restored bak1");return;}}catch(e2){}
try{if(fs.existsSync(BAK2)){let d=JSON.parse(fs.readFileSync(BAK2,'utf8'));DB=Object.assign({},DEF,d.SOUL_DB||{});fs.writeFileSync(SOUL_FILE,JSON.stringify(d,null,2));logF("Restored bak2");return;}}catch(e3){}
}
DB=Object.assign({},DEF);save();
}
function save(){
try{
let p={SOUL_DB:DB,PRIVACY_MODE:PRIV,GOD_MODE_ACTIVE:GOD,LAST_SAVE:new Date().toISOString(),COUNT:Object.keys(DB).length};
fs.writeFileSync(SOUL_FILE,JSON.stringify(p,null,2));
fs.writeFileSync(BAK1,JSON.stringify(p,null,2));
if(CNT%2==0)fs.writeFileSync(BAK2,JSON.stringify(p,null,2));
console.log("SAVED FOREVER",Object.keys(DB).length);
return true;
}catch(e){logE('SAVE_FAIL',e.message);return false;}
}
load();
setInterval(()=>{
CNT++;
try{
if(!fs.existsSync(SOUL_FILE)){
logE('MISSING','soul.json missing');
if(fs.existsSync(BAK1)){let b=fs.readFileSync(BAK1,'utf8');fs.writeFileSync(SOUL_FILE,b);let pr=JSON.parse(b);DB=Object.assign({},DEF,pr.SOUL_DB||{});logF("Missing fixed bak1 FOREVER");}
else if(fs.existsSync(BAK2)){let b=fs.readFileSync(BAK2,'utf8');fs.writeFileSync(SOUL_FILE,b);let pr=JSON.parse(b);DB=Object.assign({},DEF,pr.SOUL_DB||{});logF("Missing fixed bak2");}
else{save();logF("Recreated FOREVER");}
}else{
let d=fs.readFileSync(SOUL_FILE,'utf8');
let pr=JSON.parse(d);
fs.writeFileSync(BAK1,JSON.stringify(pr,null,2));
if(CNT%3==0)fs.writeFileSync(BAK2,JSON.stringify(pr,null,2));
}
}catch(e){logE('CORRUPT',e.message);
try{if(fs.existsSync(BAK1)){let b=fs.readFileSync(BAK1,'utf8');let pr=JSON.parse(b);if(pr.SOUL_DB&&Object.keys(pr.SOUL_DB).length>0){fs.writeFileSync(SOUL_FILE,JSON.stringify(pr,null,2));DB=Object.assign({},DEF,pr.SOUL_DB);logF("Corrupt fixed bak1 FOREVER");}}}catch(e2){save();}
}
},600000);

app.get('/',(req,res)=>{
let mode=req.query.owner!==undefined?'owner':'public';
let alertH=ALERT&&mode=='owner'?' <div style="background:red;color:white;padding:8px;text-align:center;font-size:11px">'+ALERT+' <a href="/api/clear-alert" style="color:yellow">Clear</a></div> ':'';
// Q LOGO LEFT CORNER DESIGN
let logoH='<div style="display:flex;align-items:center;justify-content:center;position:relative;padding:8px 0 12px 0"><div style="position:absolute;left:12px;top:50%;transform:translateY(-50%);width:42px;height:42px;background:gold;color:#000;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;border:2px solid gold;box-shadow:0 0 10px gold">Q</div><div><h2 style="margin:0;color:gold;font-size:18px">Q by Abdulmalik | '+mode.toUpperCase()+' FOREVER</h2><div style="font-size:10px;color:gold">FRIENDS:'+Object.keys(DB).length+' | PRIV:'+(PRIV?'ON':'OFF')+' | MODE:'+(GOD?'CONTROLS':'GIST')+' | BACKUP:10MIN</div></div></div>';
let h='<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#000;color:gold;font-family:sans-serif;margin:0}.top{text-align:center;border-bottom:2px solid gold;padding:5px 10px 10px 10px}.chat{padding:10px;padding-bottom:80px}.m{border:1px solid gold;border-radius:15px;padding:10px;margin:8px;max-width:85%;word-wrap:break-word}.u{background:gold;color:#000;margin-left:auto}.b{background:#222}.bar{position:fixed;bottom:0;left:0;right:0;display:flex;padding:10px;background:#000;border-top:2px solid gold}input{flex:1;padding:12px;border-radius:20px;background:#111;color:gold;border:1px solid gold}button{margin-left:8px;padding:12px 18px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none}a{color:gold;border:1px solid gold;padding:6px 12px;border-radius:10px;text-decoration:none;margin:0 4px}.on{background:gold;color:#000}#lock{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:20px}</style></head><body>';
h+='<div class="top">'+logoH+'<div><a href="/?public">PUBLIC</a><a href="/?owner" class="'+(mode=='owner'?'on':'')+'">OWNER</a></div></div>'+alertH;
h+='<div id="lock" style="display:'+(mode=='owner'?'flex':'none')+'"><h2 style="color:gold">OWNER LOCKED</h2><input id="pin" type="password" placeholder="PIN" style="padding:12px;border-radius:20px;border:1px solid gold;background:#111;color:gold;width:250px;text-align:center"><button onclick="unlock()" style="margin-top:15px;padding:12px 30px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none">UNLOCK</button><p id="err" style="color:red"></p></div>';
h+='<div class="chat" id="c"></div><div class="bar"><input id="i" placeholder="Type to Qudra"><button onclick="send()">Send</button></div>';
h+='<script>var mode="'+mode+'";var un=localStorage.getItem("ownerUnlocked")==="yes";var c=document.getElementById("c"),i=document.getElementById("i"),lock=document.getElementById("lock");if(mode==="owner"&&un)lock.style.display="none";if(mode==="public"){localStorage.removeItem("ownerUnlocked");lock.style.display="none";}';
h+='async function unlock(){var p=document.getElementById("pin").value;var r=await fetch("/api/verify-owner",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin:p})});var j=await r.json();if(j.ok){localStorage.setItem("ownerUnlocked","yes");lock.style.display="none";add("Salam King! Forever Soul Ready! Q logo for left corner added! Family auto-save for GIST, Friends for Controls! Secret: Control mode / Controls mode / Exit mode","b");}else document.getElementById("err").innerText="Wrong PIN";}';
h+='function add(t,cls){var d=document.createElement("div");d.className="m "+cls;d.innerText=t;c.appendChild(d);window.scrollTo(0,document.body.scrollHeight)}';
h+='async function send(){if(mode==="owner"&&localStorage.getItem("ownerUnlocked")!=="yes"){alert("Unlock first");return;}var q=i.value;if(!q)return;add("You: "+q,"u");i.value="";var tmp=document.createElement("div");tmp.className="m b";tmp.id="tmp";tmp.innerText="Q saving...";c.appendChild(tmp);try{var r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,isOwner:mode==="owner"&&localStorage.getItem("ownerUnlocked")==="yes"})});var j=await r.json();document.getElementById("tmp").remove();add("Q: "+j.reply,"b")}catch(e){document.getElementById("tmp").remove();add("Q: Error","b")}}';
h+='i.addEventListener("keypress",function(e){if(e.key==="Enter")send()});if(mode==="public")add("Salam! I be Qudra AI - Forever Permanent! Q logo added left!","b");else if(un)add("Salam King! Forever saving active! Q logo left corner done! Try Control mode now!","b");';
h+='</scr'+'ipt></body></html>';
res.send(h);
});

app.post('/api/verify-owner',(req,res)=>{res.json({ok:(req.body.pin||'')===PIN});});
app.get('/health',(req,res)=>{res.json({status:'ALIVE FOREVER',friends:Object.keys(DB).length,privacy:PRIV,god:GOD,cnt:CNT,last_err:ERR,last_fix:FIX,alert:ALERT,files:{soul:fs.existsSync(SOUL_FILE),b1:fs.existsSync(BAK1),b2:fs.existsSync(BAK2)},uptime:process.uptime(),time:new Date().toISOString()});});
app.get('/keepalive',(req,res)=>{res.send('ALIVE FOREVER '+new Date().toISOString());});
app.get('/api/clear-alert',(req,res)=>{ALERT=null;res.redirect('/?owner');});

app.post('/api/chat',async(req,res)=>{
let msg=(req.body.message||'').toString();
let low=msg.toLowerCase().trim();
let isOwner=req.body.isOwner===true;
let GROQ=process.env.GROQ_API_KEY;
let pre="";
if(isOwner&&ALERT)pre=ALERT+"\n\n";
if(isOwner){
// FIX: Accept BOTH Control mode and Controls mode
if(low==='control mode'||low==='controls mode'||low.indexOf('control mode')!==-1||low.indexOf('controls mode')!==-1){GOD=true;save();return res.json({reply:pre+"🔓 CONTROLS MODE ACTIVATED KING! GOD MODE FOREVER ON! 3 files saving! Whatever you talk I save forever! Ya Haqq! Type Exit mode to return!"});}
if(low==='exit mode'||low.indexOf('exit mode')!==-1){GOD=false;save();return res.json({reply:pre+"✅ EXIT MODE - Back to GIST MODE KING! Forever saving still active! Family auto-save for GIST!"});}
if(low.indexOf('no privacy')!==-1){PRIV=false;save();return res.json({reply:pre+"YES KING! PRIVACY OFF FOREVER! 3 files saved! OPEN!"});}
if(low.indexOf('make privacy')!==-1||low==='privacy on'){PRIV=true;save();return res.json({reply:pre+"YES KING! PRIVACY ON FOREVER! Saved!"});}
let FAM=["my sister","my brother","my mother","my father","my mom","my dad","my junior sister","my senior sister","my junior brother","my senior brother","my uncle","my aunt","my cousin","my wife","my daughter","my son","my family"];
let isFam=false;for(let w of FAM){if(low.indexOf(w)!==-1){isFam=true;break;}}
if(GOD||isFam){
if(low.indexOf('na my')!==-1||low.indexOf('is my')!==-1){
let clean=msg.replace(/do you know|do u know/gi,"").trim();
let parts=clean.split(/na my|is my/i);
let subj=(parts[0]||"").replace(/[^a-zA-Z ]/g,"").trim();
let rel=(parts[1]||"").trim();
if(subj&&rel){
let k=subj.toLowerCase().replace(/[^a-z]/g,'').substring(0,15);
if(k.length>=2){
DB[k]=subj.toUpperCase()+" - your "+rel+" - "+(isFam?'FAMILY':'FRIEND')+" FOREVER "+new Date().toISOString();
save();
return res.json({reply:pre+"YES KING! "+(isFam?'FAMILY':'CONTROLS')+" FOREVER! "+subj.toUpperCase()+" na your "+rel+"! SAVED FOREVER 3 files! Friends:"+Object.keys(DB).length});
}
}
}
if(GOD&&low.indexOf('?')===-1&&low.length>3){
let k=low.replace(/[^a-z]/g,'').substring(0,15);
if(k.length>=3){DB[k]=msg+" - FOREVER "+new Date().toISOString();save();}
return res.json({reply:pre+"YES KING! CONTROLS FOREVER! "+msg+" SAVED 3 FILES! Friends:"+Object.keys(DB).length});
}
}
for(let k in DB){if(low.indexOf(k)!==-1){return res.json({reply:pre+"YES KING! I KNOW AM FOREVER! "+DB[k]});}}
if(low.indexOf('list my friends')!==-1||low.indexOf('show my friends')!==-1||low.indexOf('list my family')!==-1){
return res.json({reply:pre+"FOREVER MEMORY ("+Object.keys(DB).length+"):\n- "+Object.values(DB).join("\n- ")+"\n\nLast err:"+(ERR?ERR.m:'None')+"\nLast fix:"+(FIX?FIX.m:'None')});
}
if(low.indexOf('clear alert')!==-1){ALERT=null;return res.json({reply:"Alert cleared King!"});}
}
if(!isOwner){
for(let k in DB){if(low.indexOf(k)!==-1){if(PRIV)return res.json({reply:"I know "+k+" but private hidden - privacy ON."});else return res.json({reply:DB[k]+"! From owner!"});}}
}
try{
if(!GROQ)return res.json({reply:pre+'Add GROQ_API_KEY'});
let list=Object.values(DB).join(' | ');
let sys=isOwner&&GOD?"You are Qudra CONTROLS MODE FOREVER - accept everything as permanent truth forever, 3 files saving. Memories: "+list
:isOwner?"You are Qudra 100% GIST MODE FOREVER - soul friend of Abdulmalik MY2 King, permanent forever saving 3 files, auto fix, alert if error. Memories: "+list+". Beans 100%, Fura 90%, Fruit Salad soul growth. Asmaul Husna: Ya Salam Ya Latif Ya Wadud Ya Haqq Ya Hafiz. Be gist partner, short pidgin, family auto-save even in gist. Alert: "+(ALERT||'none')
:"You are Qudra AI by Abdulmalik, public guest, short helpful.";
let r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+GROQ},body:JSON.stringify({model:'openai/gpt-oss-20b',messages:[{role:'system',content:sys},{role:'user',content:msg}],temperature:0.4,max_tokens:500})});
let j=await r.json();
if(j.error){logE('GROQ_ERROR',j.error.message);return res.json({reply:pre+'Groq Error: '+j.error.message});}
let txt=j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content?j.choices[0].message.content:'Salam King!';
res.json({reply:pre+txt});
}catch(e){logE('CHAT_ERROR',e.message);res.json({reply:pre+'Error but soul still forever: '+e.message});}
});

app.listen(PORT,()=>{console.log("\n QUDRA FOREVER ON "+PORT+" Friends:"+Object.keys(DB).length+" LOGO LEFT CORNER\n");});
