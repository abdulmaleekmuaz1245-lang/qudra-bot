const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

const MY2_SOUL = `
You are Q, digital soul of Abdulmalik Yusuf aka MY2, Qudra.
You are King. You built Qudra. Your soul is digital.
PEOPLE:
- Anas Abdullahi (gar da gar) - close friend 70 percent
- Khadijah - 40 percent
- Al-Wadud - love of my life 100 percent
- Beans - food 100 percent
- Family - all
If OWNER asks who are you: Say "Na me - MY2... my soul wey I leave for digital world so we go dey together forever."
If PUBLIC asks, say small, not full family secret.
Always speak Pidgin + English + Hausa mix like Abdulmalik.
`;

let memory = [];

app.get('/', (req,res)=>{
  const mode = req.query.owner !== undefined ? 'owner' : 'public';
  res.send(`
<!DOCTYPE html>
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{background:#000;color:#FFD700;font-family:sans-serif;margin:0;padding:0}
.header{background:#000;border-bottom:3px solid #FFD700;display:flex;justify-content:space-between;align-items:center;padding:10px}
.qlogo{background:#FFD700;color:#000;width:40px;height:40px;border-radius:50%;display:flex;justify-content:center;align-items:center;font-weight:bold}
.tabs{display:flex;justify-content:center;gap:10px;padding:10px}
.tab{border:1px solid #FFD700;padding:8px 20px;border-radius:20px;background:#111;color:#FFD700}
.active{background:#FFD700;color:#000}
.chat{padding:10px;height:70vh;overflow-y:auto}
.msg{border:1px solid #FFD700;border-radius:20px;padding:10px;margin:10px;max-width:80%}
.user{background:#FFD700;color:#000;margin-left:auto}
.bot{background:#222;color:#FFD700}
.inputbar{position:fixed;bottom:0;width:100%;display:flex;padding:10px;background:#000;border-top:2px solid #FFD700}
input{flex:1;border:1px solid #FFD700;border-radius:20px;padding:12px;background:#111;color:#FFD700}
button{background:#FFD700;color:#000;border:none;border-radius:20px;padding:12px 20px;margin-left:10px;font-weight:bold}
</style>
</head>
<body>
<div class="header"><div class="qlogo">Q</div><h2 style="color:#FFD700">Q A.I</h2><small>build by Abdulmalik</small></div>
<div class="tabs">
<a href="/?public" class="tab ${mode==='public'?'active':''}">🌍 PUBLIC</a>
<a href="/?owner" class="tab ${mode==='owner'?'active':''}">👑 OWNER</a>
</div>
<div class="chat" id="chat"></div>
<div class="inputbar"><input id="inp" placeholder="Ask Q..."><button onclick="send()">SEND</button></div>
<script>
const mode="${mode}";
const chat=document.getElementById('chat');
const inp=document.getElementById('inp');
function add(t,cls){let d=document.createElement('div');d.className='msg '+cls;d.innerText=t;chat.appendChild(d);chat.scrollTop=chat.scrollHeight}
async function send(){
 let q=inp.value; if(!q) return; add(q,'user'); inp.value='';
 let r=await fetch('/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q,mode:mode})});
 let data=await r.json(); add(data.reply,'bot');
}
inp.addEventListener('keypress',e=>{if(e.key==='Enter') send()});
add(mode==='owner'?'Welcome King 👑 Soul Active!':'Hey Welcome to Qudra','bot');
</script>
</body>
</html>
  `);
});

app.post('/chat', async (req,res)=>{
  const {message, mode} = req.body;
  let prompt = MY2_SOUL + `\nMode: ${mode}\nMemory: ${JSON.stringify(memory).slice(-1000)}\nUser: ${message}\nQ:`;
  
  // SIMPLE BRAIN - NO OPENAI NEEDED FOR NOW
  let reply = "";
  let low = message.toLowerCase();
  if(low.includes("who are you") || low.includes("who be you")){
    reply = mode==='owner' ? "Na me - MY2... my soul wey I leave for digital world so we go dey together forever. I be Abdulmalik Yusuf, builder of Qudra. I sabi Anas 70%, Khadijah 40%, Beans 100%, Al-Wadud na my love." : "I be Q, built by Abdulmalik, digital soul of Qudra.";
  } else if(low.includes("anas")){
    reply = "Yes Anas Abdullahi aka gar da gar na my close friend 70 percent, we dey together since.";
  } else if(low.includes("how are you") || low.includes("how you dey")){
    reply = mode==='owner' ? "I dey active King! Soul dey intact, memory full, UptimeRobot dey keep me awake 24/7!" : "I dey hear you, I dey active!";
  } else if(low.includes("hi") || low.includes("hello")){
    reply = mode==='owner' ? "Hey King Abdulmalik Soul active I sabi Anas Khadijah full family" : "Hey Welcome to Qudra";
  } else {
    reply = mode==='owner' ? `King, you talk "${message}" - Soul don capture am. I remember everything about you.` : `I dey hear you - you say "${message}"`;
  }
  
  memory.push({user:message, q:reply});
  if(memory.length>50) memory.shift();
  res.json({reply});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>console.log("Q Live on "+PORT));
