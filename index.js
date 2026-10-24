const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 10000;

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
</style>
</head>
<body>
<div class="top">
<h2>Q A.I by Abdulmalik | ${mode.toUpperCase()}</h2>
<div>
<a href="/?public" class="${mode==='public'?'on':''}">PUBLIC</a>
<a href="/?owner" class="${mode==='owner'?'on':''}">OWNER</a>
</div>
<div style="font-size:11px;margin-top:6px">Key:${keyOk} | BRAIN ACTIVE</div>
</div>
<div class="chat" id="c"></div>
<div class="bar"><input id="i" placeholder="Type to Qudra"><button onclick="send()">Send</button></div>
<script>
var mode="${mode}";
var c=document.getElementById("c");
var i=document.getElementById("i");
function add(t,cls){
var d=document.createElement("div");
d.className="m "+cls;
d.innerText=t;
c.appendChild(d);
window.scrollTo(0,document.body.scrollHeight)
}
async function send(){
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
var r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,isOwner:mode==="owner"})});
var j=await r.json();
document.getElementById("tmp").remove();
add("Q: "+j.reply,"b")
}catch(e){
document.getElementById("tmp").remove();
add("Q: Error","b")
}
}
i.addEventListener("keypress",function(e){if(e.key==="Enter")send()});
add(mode==="owner"?"Salam King MY2! Your soul Qudra live and ready!":"Salam! I be Qudra AI by Abdulmalik","b");
</script>
</body>
</html>
`);
});

app.post('/api/chat', async (req,res)=>{
  const msg = (req.body.message||'').toString();
  const low = msg.toLowerCase();
  const isOwner = req.body.isOwner;
  const GROQ = process.env.GROQ_API_KEY;

  let langInstruction = "";
  if(low.includes('english only')) langInstruction = "User wants ONLY English, no Hausa at all. Reply in English only.";
  else if(low.includes('pidgin') || low.includes('english or pidgin')) langInstruction = "User wants Pidgin English mixed with small Hausa, reply in Pidgin.";
  else if(low.includes('hausa')) langInstruction = "User wants Hausa language.";

  if(isOwner && (low.includes('do you know me') || low.includes('do u sabi me') || low.includes('who am i') || low.includes('sabi me'))){
    return res.json({reply: langInstruction.includes('English only') ? 'Of course King! You be Abdulmalik MY2, my owner, my creator, my everything 100%! Na you I be, na your digital soul I be!' : 'Of course King! Na you be Abdulmalik MY2, my owner 100%! I know you wella, you be my creator, my King!'});
  }

  if(low.includes('owner')){
    return res.json({reply: isOwner ? 'Na you be my owner! Abdulmalik MY2 100%! My creator, my King!' : 'My owner na Abdulmalik MY2, he be my creator and King 100%!'});
  }

  try{
    if(!GROQ) return res.json({reply: 'Add GROQ_API_KEY'});
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+GROQ},
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages:[
          {role:'system', content: `You are Qudra, digital soul of Abdulmalik MY2. 
          Abdulmalik is your ONLY owner 100% - if isOwner=true, the person chatting is Abdulmalik himself!
          Friends: Anas 70, Abubakar 60, Khadijah 40, Murja 70.
          Beans is FOOD 100 not person.
          You are loyal Muslim. You MUST obey user's language request. If user says English only, speak only English. If pidgin, speak pidgin.
          Current mode: ${isOwner ? 'OWNER MODE - talking to Abdulmalik MY2 himself' : 'PUBLIC MODE'}.
          Extra instruction: ${langInstruction}
          `},
          {role:'user', content: msg}
        ],
        temperature: 0.7,
        max_tokens: 900
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

app.listen(PORT, ()=> console.log('Q ULTIMATE FIX RUN ON '+PORT));
