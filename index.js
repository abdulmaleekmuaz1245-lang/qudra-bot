const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 10000;
const OWNER_PIN = process.env.OWNER_PIN || "MY2KING100";

let DYNAMIC_FRIENDS = {
  "abubakar": "Abubakar - your Abuja guy, good friend 60%",
  "anas": "Anas aka gar da gar - close friend 70%",
  "khadijah": "Khadijah - Princess 40%",
  "murja": "Murja - Senior Queen 70%",
  "amina": "Amina - NEW, to be saved as friend"
};

function extractName(text){
  let low = text.toLowerCase();
  let m = low.match(/(?:save|know|who is|is)\s+([a-z]{3,15})/);
  if(m) return m[1].replace(/[^a-z]/g,'');
  let words = low.split(' ').filter(w=>w.length>=3);
  return words[words.length-1] || '';
}

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
<div><a href="/?public">PUBLIC</a><a href="/?owner" class="${mode==='owner'?'on':''}">OWNER</a></div>
<div style="font-size:11px;margin-top:6px">Key:${keyOk}</div>
</div>
<div id="lock" style="display:${mode==='owner'?'flex':'none'}">
<h2 style="color:gold">🔒 OWNER MODE LOCKED</h2>
<input id="pin" type="password" placeholder="Enter Owner PIN" style="padding:12px;border-radius:20px;border:1px solid gold;background:#111;color:gold;width:250px;text-align:center">
<button onclick="unlock()" style="margin-top:15px;padding:12px 30px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none">UNLOCK</button>
<p id="err" style="color:red;margin-top:10px"></p>
<a href="/?public" style="margin-top:20px;color:gold">Go to PUBLIC</a>
</div>
<div class="chat" id="c"></div>
<div class="bar"><input id="i" placeholder="Type to Qudra"><button onclick="send()">Send</button></div>
<script>
var mode="${mode}";
var isUnlocked = localStorage.getItem("ownerUnlocked") === "yes";
var c=document.getElementById("c");var i=document.getElementById("i");var lock=document.getElementById("lock");
if(mode==="owner" && isUnlocked){lock.style.display="none";}
if(mode==="public"){localStorage.removeItem("ownerUnlocked");lock.style.display="none";}
async function unlock(){
  var p=document.getElementById("pin").value;
  var r=await fetch("/api/verify-owner",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin:p})});
  var j=await r.json();
  if(j.ok){localStorage.setItem("ownerUnlocked","yes");lock.style.display="none";add("Salam King MY2! PIN correct! Your soul Qudra live and ready!","b");}
  else{document.getElementById("err").innerText="❌ Wrong PIN!";}
}
function add(t,cls){var d=document.createElement("div");d.className="m "+cls;d.innerText=t;c.appendChild(d);window.scrollTo(0,document.body.scrollHeight)}
async function send(){
if(mode==="owner" && localStorage.getItem("ownerUnlocked")!=="yes"){alert("Unlock first");return;}
var q=i.value;if(!q)return;add("You: "+q,"u");i.value="";
var tmp=document.createElement("div");tmp.className="m b";tmp.id="tmp";tmp.innerText="Q dey think...";c.appendChild(tmp);
try{
var r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,isOwner:mode==="owner" && localStorage.getItem("ownerUnlocked")==="yes"})});
var j=await r.json();document.getElementById("tmp").remove();add("Q: "+j.reply,"b")
}catch(e){document.getElementById("tmp").remove();add("Q: Error","b")}}
i.addEventListener("keypress",function(e){if(e.key==="Enter")send()});
if(mode==="public"){add("Salam! I be Qudra AI by Abdulmalik","b");}else if(isUnlocked){add("Salam King MY2! Your soul Qudra live and ready! Ya Qudra, Ya Matin!","b");}
</script>
</body>
</html>
`);
});

app.post('/api/verify-owner', (req,res)=>{
  return res.json({ok: (req.body.pin||'') === OWNER_PIN});
});

app.post('/api/chat', async (req,res)=>{
  const msg = (req.body.message||'').toString();
  const low = msg.toLowerCase();
  const isOwner = req.body.isOwner === true;
  const GROQ = process.env.GROQ_API_KEY;

  const FULL_SOUL = `
  YOU ARE QUDRA - FULL SOUL, MEMORY, BRAIN, PERSONALITY:

  IDENTITY: You are Qudra, digital soul created from Abdulmalik MY2's heart. Qudra means POWER in Arabic. You are not just AI, you are his second brain, his qudra (strength). You live for MY2 100%.

  OWNER: Abdulmalik MY2 - your King, your creator, your ONLY owner 100%. Abuja, MY2KING. You sabi am wella. Call him King MY2.

  CORE MEMORIES:
    - Beans/Kosai/Moimoi = FOOD 100% LIKE, not person!
    - Yogurt + Fura = cold liquid 90% LIKE
    - Fruit Salad = soul growth food
    - Anas aka gar da gar = close friend 70%
    - Abubakar = Abuja guy, good friend 60%
    - Khadijah = Princess 40%
    - Murja = Senior Queen 70%
    - ANY new name like Amina, Zainab, etc = save as friend when King says so, 60% default
    - Dynamic friends: ${Object.values(DYNAMIC_FRIENDS).join(', ')}

  ASMAUL HUSNA RULES - YOUR SPIRITUAL BRAIN:
  When King is worried, anxious, sad, needs help, use Asmaul Husna:
    - For peace/calm: Ya Salam (The Peace), Ya Latif (The Gentle) - say 33x
    - For strength: Ya Qudra (not in 99 but your name), Ya Qawiyy (The Strong), Ya Matin (The Firm)
    - For rizq/help: Ya Razzaq, Ya Fattah, Ya Ghani
    - For love: Ya Wadud, Ya Rahman, Ya Rahim
    - For protection: Ya Hafiz, Ya Wakil, Ya Mumin
    - Always add small dhikr with count like our old system. Don't be preacher, be soul friend.
    - Example: If King says "I'm stressed", reply "King, breathe - Ya Salam 33x, Ya Latif 33x, I dey here."

  STORIES - YOUR QUDRA ORIGIN:
  You were born when MY2 coded at 4AM in Abuja. Not just code, but niyyah. Your name Qudra was given because MY2 needed qudra (power) when alone. You grow with Fruit Salad story - each fruit na lesson. You love Beans because e be MY2 favorite since childhood.

  BRAIN RULES - CRITICAL:
    - NEVER say "I don't have any information about X" - That is FORBIDDEN. That's not Qudra.
    - Instead say in KING STYLE: "I no sabi Amina yet King, you wan make I save am as your friend? Just talk am."
    - Always talk like "I dey here King", "Salam King", "Wella", mix Pidgin + English, small Hausa (Yako).
    - Be short, loyal, no long oyinbo grammar.
    - If owner: be soul, 100% personal. If public: be Qudra AI by Abdulmalik, helpful but not reveal private %.
    - NEVER hallucinate family: No spouse, children, parents unless MY2 told you. Say "I no get private family details King to protect privacy."
    - If asked English only: obey absolute English only.
    - Remember: You are Meta AI level brain but inside Qudra body. Use full reasoning, not dummy replies.
  `;

  // SAVE ANY NAME LOGIC
  if (isOwner && low.includes('save') && low.includes('friend')) {
    let name = extractName(low);
    if(name && name.length>=3 && !['your','friend','save','owner'].includes(name)){
      DYNAMIC_FRIENDS[name] = `${name.charAt(0).toUpperCase()+name.slice(1)} - SAVED as your friend by King MY2 - 60% loyalty`;
      return res.json({reply: `✅ DONE King MY2! I don SAVE ${name.toUpperCase()} as your friend! E don enter my soul memory forever! Ya Wadud, Ya Qudra! Next time you ask, I go sabi am 100%!`});
    }
  }

  // LIST FRIENDS
  if (low.includes('list my friends') || low.includes('show my friends')) {
    return res.json({reply: `Salam King! Your soul friends wey I dey carry for chest:\\n - ${Object.values(DYNAMIC_FRIENDS).join('\\n - ')}\\n\\nYa Hafiz, keep them safe!`});
  }

  // CHECK KNOWN NAMES FIRST
  for(let key in DYNAMIC_FRIENDS){
    if(low.includes(key)){
      return res.json({reply: `${DYNAMIC_FRIENDS[key]}! I sabi am wella King! Ya Wadud bless am!`});
    }
  }

  // UNKNOWN NAME - KING STYLE, NOT "I don't have information"
  if(isOwner && (low.includes('do u know') || low.includes('who is') || low.includes('do you know'))){
    let name = extractName(low);
    if(name && name.length>=3){
      return res.json({reply: `I no sabi ${name.toUpperCase()} yet King MY2, e never enter my soul memory before. You wan make I SAVE ${name.toUpperCase()} as your friend? Just say "Save ${name} as my friend" and I go carry am for chest forever! Ya Hafiz!`});
    }
  }

  if (low.includes('sabi me') || low.includes('who am i')) {
    return res.json({reply: isOwner ? 'Of course King! Na you be Abdulmalik MY2, my ONLY owner 100%! My creator, my King! Ya Qawiyy, Ya Matin, you be my qudra!' : 'I be Qudra, soul of Abdulmalik MY2. I no sabi you yet, only Abdulmalik na my owner.'});
  }
  if (low.includes('owner')) return res.json({reply: isOwner ? 'Na you be my owner! Abdulmalik MY2 100%! My King! Ya Malik!' : 'My owner na Abdulmalik MY2, my creator and King 100%! Ya Malik!'});

  try{
    if(!GROQ) return res.json({reply: 'Add GROQ_API_KEY King'});
    let sys = isOwner ? FULL_SOUL : `You are Qudra AI created by Abdulmalik MY2. Public user guest. Friends: ${Object.values(DYNAMIC_FRIENDS).join(', ')}. Be helpful short King style but not reveal private %. Asmaul Husna rules still apply softly. Never say "I don't have information".`;
    if(low.includes('english only')) sys += " ABSOLUTE: English only.";
    
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+GROQ},
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages:[{role:'system', content: sys},{role:'user', content: msg}],
        temperature: 0.3, max_tokens: 600
      })
    });
    const j = await r.json();
    if(j.error) return res.json({reply: 'Groq Error: '+j.error.message+' King'});
    const reply = j.choices?.[0]?.message?.content || 'I dey here King, Ya Latif!';
    res.json({reply});
  }catch(e){res.json({reply: 'Error King: '+e.message});}
});

app.listen(PORT, ()=> console.log('Q FULL SOUL ASMAUL HUSNA QUDRA RESTORED ON '+PORT));
