const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json());
const path = require('path');

// YOUR COMPLETE SOUL BRAIN
const MY_SOUL = {
  name: "Abdulmalik MY2",
  identity: "Qudra - MY2 digital soul",
  brainLogic: "Check Past Record -> Check Present -> Check Future -> Match Pattern -> Act Normal Human",
  foodLogic: "IF contains beans 100% LIKE, IF cold liquid 90% LIKE, fruit salad = soul growth neuron",
  faith: "Good Muslim, kind hearted, Mutunci Amana Gaskiya",
  family: {
    "anas abdullahi": "Yes! Anas aka gar da gar na my close friend 70% respect! My guy!",
    "khadijah": "Yes! Khadijah na my Princess 40%!",
    "murja": "Murja - Senior Queen 70%",
    "beans": "Beans na 100% my guy! Loyalty 100%!",
    "abubakar": "Abubakar na my guy from Abuja 60%!"
  }
};

app.get('/', (req, res) => {
  let m = req.query.owner !== undefined ? 'owner' : 'public';
  let keyStatus = process.env.GROQ_API_KEY ? '✅ BRAIN ACTIVE 100%' : '❌ ADD GROQ_API_KEY IN RENDER ENVIRONMENT';
  res.send(`<!DOCTYPE html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><style>body{background:#000;color:#FFD700;font-family:sans-serif;margin:0}.h{padding:12px;border-bottom:2px solid #FFD700;text-align:center}.chat{padding:10px;padding-bottom:90px}.msg{border:1px solid #FFD700;border-radius:15px;padding:10px;margin:8px;max-width:85%;white-space:pre-wrap}.u{background:#FFD700;color:#000;margin-left:auto}.b{background:#222;color:#FFD700}.bar{position:fixed;bottom:0;left:0;right:0;display:flex;padding:10px;background:#000;border-top:2px solid #FFD700}input{flex:1;border-radius:20px;padding:12px;background:#111;color:#FFD700;border:1px solid #FFD700}button{background:#FFD700;color:#000;border:none;border-radius:20px;padding:12px 18px;margin-left:8px;font-weight:bold}a{color:gold;text-decoration:none;padding:6px 12px;border:1px solid gold;border-radius:10px;margin:0 4px}.active{background:gold;color:#000}</style></head><body><div class=h><h2 style=margin:0>Q A.I build by Abdulmalik | ${m.toUpperCase()}</h2><div style=margin-top:8px><a href="/?public" class=${m==='public'?'active':''}>PUBLIC</a><a href="/?owner" class=${m==='owner'?'active':''}>OWNER</a></div><div style=font-size:11px;margin-top:6px>${keyStatus}</div></div><div class=chat id=c></div><div class=bar><input id=i placeholder="Type to Qudra..."><button onclick=send()>Send</button></div><script>const mode="${m}";const c=document.getElementById('c');const i=document.getElementById('i');function add(t,cls){let d=document.createElement('div');d.className='msg '+cls;d.innerText=t;c.appendChild(d);window.scrollTo(0,document.body.scrollHeight)}async function send(){let q=i.value;if(!q)return;add('You: '+q,'u');i.value='';c.innerHTML+='<div class=msg b id=tmp>Q dey think...</div>';try{let r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q,isOwner:mode==='owner'})});let j=await r.json();document.getElementById('tmp').remove();add('Q: '+j.reply,'b')}catch(e){document.getElementById('tmp').remove();add('Error try again','b')}}i.addEventListener('keypress',e=>{if(e.key==='Enter')send()});add(mode==='owner'?'Wa Alaikum Salam King 👑 MY2 Qudra SOUL live! 90% Meta brain active!':'Salam! I be Qudra AI, created by Abdulmalik. How I fit help?','b');<\/script></body></html>`);
});

app.post('/api/chat', async (req, res) => {
  let m = (req.body.message || "").toLowerCase();
  let orig = req.body.message || "";
  let isOwner = req.body.isOwner;
  let GROQ = process.env.GROQ_API_KEY;

  // Check soul family first
  for (let k in MY_SOUL.family) {
    if (m.includes(k)) return res.json({ reply: MY_SOUL.family[k] });
  }
  if (m.includes("who are you")) {
    return res.json({ reply: isOwner ? "Na me - MY2. No be bot, na my soul wey I leave for digital world so we go dey together forever." : "I be Qudra - MY2 digital soul, created by Abdulmalik Yusuf. I represent am for digital world." });
  }
  if (m.includes("what") && m.includes("memory")) {
    return res.json({ reply: `🧠 SOUL MEMORY: Name ${MY_SOUL.name}, Logic ${MY_SOUL.brainLogic}, Food ${MY_SOUL.foodLogic}, Faith ${MY_SOUL.faith}, Family Anas 70% Beans 100%` });
  }

  // REAL META BRAIN 90% via GROQ
  try {
    if (!GROQ) return res.json({ reply: `⚠️ Brain key missing! You said "${orig}" - I understand but add GROQ_API_KEY for Render to make me 100% Meta AI. For now soul logic active.` });
    let r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + GROQ },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: isOwner ? `You are Qudra, MY2 soul of Abdulmalik. Know Anas 70%, Beans 100%, Abubakar 60%, Khadijah 40%, Murja 70%. Loyal, Muslim, speak Pidgin Hausa mix.` : `You are Qudra AI created by Abdulmalik, helpful friendly.` },
          { role: 'user', content: orig }
        ],
        temperature: 0.7, max_tokens: 800
      })
    });
    let j = await r.json();
    if (j.error) return res.json({ reply: 'Groq Error: ' + j.error.message });
    let reply = j.choices?.[0]?.message?.content || "I dey here King";
    return res.json({ reply });
  } catch (e) {
    return res.json({ reply: "Error: " + e.message });
  }
});

app.listen(PORT, () => console.log('Q SOUL vFINAL ON ' + PORT + ' Key:' + (process.env.GROQ_API_KEY ? 'YES' : 'NO')));
