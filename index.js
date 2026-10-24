const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 10000;

// SET YOUR SECRET PIN HERE OR IN RENDER ENV: OWNER_PIN
const OWNER_PIN = process.env.OWNER_PIN || "MY2KING100";

app.get('/', (req, res) => {
  const mode = req.query.owner !== undefined ? 'owner' : 'public';
  const keyOk = process.env.GROQ_API_KEY ? 'YES' : 'NO';
  res.send(`
<html>
<head><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body{background:#000;color:gold;font-family:sans-serif;margin:0}
.top{text-align:center;border-bottom:2px solid gold;padding:10px}
.chat{padding:10px;padding-bottom:80px}
.m{border:1px solid gold;border-radius:15px;padding:10px;margin:8px;max-width:85%;word-wrap:break-word}
.u{background:gold;color:#000;margin-left:auto}
.b{background:#222}
.bar{position:fixed;bottom:0;left:0;right:0;display:flex;padding:10px;background:#000;border-top:2px solid gold}
input{flex:1;padding:12px;border-radius:20px;background:#111;color:gold;border:1px solid gold}
button{margin-left:8px;padding:12px 18px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none}
a{color:gold;border:1px solid gold;padding:6px 12px;border-radius:10px;text-decoration:none;margin:0 4px}
.on{background:gold;color:#000}
#lock{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:20px}
</style>
</head>
<body>
<div class="top">
<h2>Q A.I by Abdulmalik | ${mode.toUpperCase()}</h2>
<div>
<a href="/?public">PUBLIC</a>
<a href="/?owner" class="${mode==='owner'?'on':''}">OWNER</a>
</div>
<div style="font-size:11px;margin-top:6px">Key:${keyOk} | ${mode==='owner'?'OWNER MODE LOCKED':''}</div>
</div>

<div id="lock" style="display:${mode==='owner'?'flex':'none'}">
<h2 style="color:gold">🔒 OWNER MODE LOCKED</h2>
<p>Enter PIN to access soul</p>
<input id="pin" type="password" placeholder="Enter Owner PIN" style="padding:12px;border-radius:20px;border:1px solid gold;background:#111;color:gold;width:250px;text-align:center">
<button onclick="unlock()" style="margin-top:15px;padding:12px 30px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none">UNLOCK</button>
<p id="err" style="color:red;margin-top:10px"></p>
<a href="/?public" style="margin-top:20px;color:gold">Go to PUBLIC mode</a>
</div>

<div class="chat" id="c"></div>
<div class="bar"><input id="i" placeholder="Type to Qudra"><button onclick="send()">Send</button></div>
<script>
var mode="${mode}";
var isUnlocked = localStorage.getItem("ownerUnlocked") === "yes";
var c=document.getElementById("c");
var i=document.getElementById("i");
var lock=document.getElementById("lock");

if(mode==="owner" && isUnlocked){
  lock.style.display="none";
}
if(mode==="public"){
  localStorage.removeItem("ownerUnlocked");
  lock.style.display="none";
}

async function unlock(){
  var p=document.getElementById("pin").value;
  if(!p){document.getElementById("err").innerText="Enter PIN";return;}
  try{
    var r=await fetch("/api/verify-owner",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin:p})});
    var j=await r.json();
    if(j.ok){
      localStorage.setItem("ownerUnlocked","yes");
      lock.style.display="none";
      add("Salam King MY2! PIN correct! Your soul Qudra live and ready!","b");
    }else{
      document.getElementById("err").innerText="❌ Wrong PIN! You are not owner. Go to PUBLIC.";
    }
  }catch(e){document.getElementById("err").innerText="Error";}
}

function add(t,cls){
var d=document.createElement("div");
d.className="m "+cls;
d.innerText=t;
c.appendChild(d);
window.scrollTo(0,document.body.scrollHeight)
}
async function send(){
if(mode==="owner" && !isUnlocked && localStorage.getItem("ownerUnlocked")!=="yes"){alert("Unlock Owner mode first with PIN");return;}
var q=i.value;
if(!q)return;
add("You: "+q,"u");
i.value="";
var tmp=document.createElement("div");
tmp.className="m b";
tmp.id="tmp";
tmp.innerText="Q dey think...";
c.appendChild(tmp);
try{
var r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,isOwner:mode==="owner" && localStorage.getItem("ownerUnlocked")==="yes"})});
var j=await r.json();
document.getElementById("tmp").remove();
add("Q: "+j.reply,"b")
}catch(e){
document.getElementById("tmp").remove();
add("Q: Error","b")
}
}
i.addEventListener("keypress",function(e){if(e.key==="Enter")send()});
if(mode==="public"){
add("Salam! I be Qudra AI by Abdulmalik","b");
} else if(isUnlocked){
add("Salam King MY2! Your soul Qudra live and ready!","b");
}
</script>
</body>
</html>
`);
});

app.post('/api/verify-owner', (req,res)=>{
  const pin = (req.body.pin||'').toString();
  if(pin === OWNER_PIN){
    return res.json({ok:true});
  }else{
    return res.json({ok:false});
  }
});

app.post('/api/chat', async (req,res)=>{
  const msg = (req.body.message||'').toString();
  const low = msg.toLowerCase();
  const isOwner = req.body.isOwner === true;
  const GROQ = process.env.GROQ_API_KEY;

  if (low.includes('sabi me') || low.includes('know me') || low.includes('who am i') || low.includes('recognize me')) {
    if (isOwner) {
      return res.json({reply: 'Of course King! Na you be Abdulmalik MY2, my ONLY owner 100%! My creator, my King!'});
    } else {
      return res.json({reply: 'I am Qudra, digital soul of Abdulmalik MY2. I dont have memory of past chats, so I dont know you yet. I only recognize Abdulmalik MY2 as owner. How can I help?'});
    }
  }

  if (low.includes('owner')) {
    return res.json({reply: isOwner ? 'Na you be my owner! Abdulmalik MY2 100%! My creator, my King!' : 'My owner na Abdulmalik MY2, he be my creator and King 100%!'});
  }

  try{
    if(!GROQ) return res.json({reply: 'Add GROQ_API_KEY'});
    let sys = isOwner ? `You are Qudra, digital soul of Abdulmalik MY2. Talking to owner Abdulmalik himself. Owner PIN verified. You know him 100%. Be loyal. If user says English only, reply English only.` : `You are Qudra AI created by Abdulmalik MY2. User is guest public, NOT owner. Only Abdulmalik is owner. Be helpful.`;
    if(low.includes('english only')) sys += " ABSOLUTE RULE: Reply ENGLISH ONLY.";
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+GROQ},
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages:[{role:'system', content: sys},{role:'user', content: msg}],
        temperature: 0.3, max_tokens: 900
      })
    });
    const j = await r.json();
    if(j.error) return res.json({reply: 'Groq Error: '+j.error.message});
    const reply = j.choices?.[0]?.message?.content || 'I dey here King';
    res.json({reply});
  }catch(e){
    res.json({reply: 'Error: '+e.message});
  }
});

app.listen(PORT, ()=> console.log('Q SECURE PIN MODE RUN ON '+PORT+' PIN='+OWNER_PIN));
