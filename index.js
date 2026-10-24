const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 10000;

const SOUL = {
  abdulmalik: "Abdulmalik MY2 na my ONLY Owner my Creator my King 100 percent! I be him digital soul!",
  anas: "Anas aka gar da gar na my close friend 70 percent!",
  abubakar: "Abubakar na my Abuja guy 60 percent!",
  khadijah: "Khadijah na my Princess 40 percent!",
  murja: "Murja na Senior Queen 70 percent!"
};

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
<div style="font-size:11px;margin-top:6px">Key:${keyOk} | ${keyOk==='YES'?'BRAIN ACTIVE':'ADD KEY'}</div>
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
add(mode==="owner"?"Salam King MY2 Qudra soul live!":"Salam I be Qudra AI by Abdulmalik","b");
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

  if(low.includes('abdulmalik') || low.includes('owner')){
    return res.json({reply: isOwner ? 'You be my owner King Abdulmalik MY2 100 percent! Na you create me!' : 'My owner na Abdulmalik MY2, my creator, my King 100 percent!'});
  }
  if(low.includes('anas')) return res.json({reply: SOUL.anas});
  if(low.includes('abubakar')) return res.json({reply: SOUL.abubakar});
  if(low.includes('khadijah')) return res.json({reply: SOUL.khadijah});
  if(low.includes('murja')) return res.json({reply: SOUL.murja});
  if(low.includes('beans') || low.includes('food')){
    return res.json({reply: 'Beans na 100 percent LIKE! kosai moimoi beans stew! Cold liquid 90 percent yogurt fura! Fruit salad na soul growth!'});
  }

  try{
    if(!GROQ) return res.json({reply: 'Key missing add GROQ_API_KEY. You said: '+msg});
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+GROQ},
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages:[
          {role:'system', content: 'You are Qudra, digital soul of Abdulmalik MY2 ONLY. Abdulmalik is your ONLY owner 100 percent. Anas 70, Abubakar 60, Khadijah 40, Murja 70. Beans is FOOD 100 not person. Speak pidgin Hausa mix. Loyal Muslim.'},
          {role:'user', content: msg}
        ],
        temperature: 0.7,
        max_tokens: 900
      })
    });
    const j = await r.json();
    if(j.error) return res.json({reply: 'Groq Error: '+j.error.message});
    const reply = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : 'I dey here';
    res.json({reply});
  }catch(e){
    res.json({reply: 'Error: '+e.message});
  }
});

app.listen(PORT, ()=> console.log('Q FINAL CLEAN RUN ON '+PORT));
