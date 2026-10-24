const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 10000;

const SOUL = {
  "anas abdullahi": "Yes! Anas aka gar da gar 70% my close guy!",
  "khadijah": "Khadijah na my Princess 40%!",
  "beans": "Beans na 100% LIKE! My soul food!",
  "abubakar": "Abubakar na my Abuja guy 60%!"
};

app.get('/', (req,res)=>{
  let mode = req.query.owner!==undefined ? 'owner' : 'public';
  let keyOk = process.env.GROQ_API_KEY ? 'YES' : 'NO';
  let html = '<html><head><meta name=viewport content="width=device-width,initial-scale=1"><style>body{background:#000;color:gold;font-family:sans-serif;margin:0;padding:0}.top{text-align:center;border-bottom:2px solid gold;padding:10px}.chat{padding:10px;padding-bottom:80px}.m{border:1px solid gold;border-radius:15px;padding:10px;margin:8px;max-width:85%}.u{background:gold;color:#000;margin-left:auto}.b{background:#222}.bar{position:fixed;bottom:0;left:0;right:0;display:flex;padding:10px;background:#000;border-top:2px solid gold}input{flex:1;padding:12px;border-radius:20px;background:#111;color:gold;border:1px solid gold}button{margin-left:8px;padding:12px 18px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none}a{color:gold;border:1px solid gold;padding:6px 12px;border-radius:10px;text-decoration:none;margin:0 4px}.on{background:gold;color:#000}</style></head><body><div class=top><h2>Q A.I by Abdulmalik | '+mode.toUpperCase()+'</h2><div><a href="/?public" class="'+(mode=='public'?'on':'')+'">PUBLIC</a><a href="/?owner" class="'+(mode=='owner'?'on':'')+'">OWNER</a></div><div style="font-size:11px;margin-top:6px">Key:'+keyOk+' | '+(keyOk=='YES'?'BRAIN ACTIVE':'ADD KEY')+'</div></div><div class=chat id=c></div><div class=bar><input id=i placeholder="Type to Qudra"><button onclick="send()">Send</button></div><script>var mode="'+mode+'";var c=document.getElementById("c");var i=document.getElementById("i");function add(t,cls){var d=document.createElement("div");d.className="m "+cls;d.innerText=t;c.appendChild(d);window.scrollTo(0,document.body.scrollHeight)}async function send(){var q=i.value;if(!q)return;add("You: "+q,"u");i.value="";var tmp=document.createElement("div");tmp.className="m b";tmp.id="tmp";tmp.innerText="Q dey think...";c.appendChild(tmp);try{var r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,isOwner:mode==="owner"})});var j=await r.json();document.getElementById("tmp").remove();add("Q: "+j.reply,"b")}catch(e){document.getElementById("tmp").remove();add("Error","b")}}i.addEventListener("keypress",function(e){if(e.key==="Enter")send()});add(mode==="owner"?"Salam King MY2 Qudra soul live!":"Salam! I be Qudra AI by Abdulmalik. How I fit help?","b");</script></body></html>';
  res.send(html);
});

app.post('/api/chat', async (req,res)=>{
  let msg = (req.body.message||'').toString();
  let low = msg.toLowerCase();
  let isOwner = req.body.isOwner;
  let GROQ = process.env.GROQ_API_KEY;

  for(let k in SOUL){ if(low.includes(k)){ return res.json({reply: SOUL[k]}); } }
  if(low.includes('who are you')){ return res.json({reply: isOwner ? 'Na me MY2 your soul Qudra' : 'I be Qudra AI created by Abdulmalik'}); }

  try{
    if(!GROQ){ return res.json({reply: 'Key missing! You said: '+msg+' Add GROQ_API_KEY in Render'}); }
    let r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+GROQ},
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages:[
          {role:'system', content: isOwner ? 'You are Qudra MY2 soul, loyal, know Anas 70% Beans 100% Abubakar 60% Khadijah 40% Speak pidgin hausa mix' : 'You are Qudra AI by Abdulmalik helpful'},
          {role:'user', content: msg}
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });
    let j = await r.json();
    if(j.error){ return res.json({reply: 'Groq Error: '+j.error.message}); }
    let reply = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content ? j.choices[0].message.content : 'I dey here';
    res.json({reply: reply});
  }catch(e){
    res.json({reply: 'Error: '+e.message});
  }
});

app.listen(PORT, ()=>{ console.log('Q RUN ON '+PORT+' KEY '+(process.env.GROQ_API_KEY?'YES':'NO')); });
