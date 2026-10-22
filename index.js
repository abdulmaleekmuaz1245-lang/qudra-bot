const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());

const HTML = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Qudra Bot</title><style>body{background:#0a0a0a;color:white;font-family:sans-serif;margin:0;display:flex;flex-direction:column;height:100vh}.header{text-align:center;padding:20px;border-bottom:1px solid #222}.status{color:#00ff88;font-size:12px}.chat{flex:1;overflow-y:auto;padding:15px;display:flex;flex-direction:column;gap:10px}.msg{max-width:80%;padding:12px 15px;border-radius:15px}.user{background:#0b93f6;align-self:flex-end}.bot{background:#262626;align-self:flex-start}.input-area{display:flex;padding:10px;background:#111;gap:10px}input{flex:1;padding:12px;border-radius:25px;border:none;background:#222;color:white}button{background:#00ff88;color:black;border:none;padding:10px 20px;border-radius:20px;font-weight:bold}</style></head><body><div class="header"><h1>Qudra Bot</h1><div>Created by Abdulmalik | LIVE</div><div class="status">Qudra V2 Fixed - Online</div></div><div class="chat" id="chat"><div class="msg bot">As-salamu Alaikum! I am Qudra, created by Abdulmalik. How can I help?</div></div><div class="input-area"><input id="input" placeholder="Type to Qudra..."><button onclick="send()">Send</button></div><script>const chat=document.getElementById('chat'),input=document.getElementById('input');async function send(){const t=input.value.trim();if(!t)return;chat.innerHTML+='<div class=msg user>'+t+'</div>';input.value='';chat.scrollTop=chat.scrollHeight;const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:t})});const d=await r.json();chat.innerHTML+='<div class=msg bot>'+d.reply+'</div>';chat.scrollTop=chat.scrollHeight}input.addEventListener('keydown',e=>{if(e.key==='Enter')send()})</script></body></html>`;

app.get('/', (req, res) => {
  res.send(HTML);
});

app.post('/api/chat', (req, res) => {
  const msg = req.body.message || '';
  let reply = 'Qudra: I hear you - ' + msg + '. I am loyal to Abdulmalik!';
  const low = msg.toLowerCase();
  if (low.includes('who is') || low.includes('yako')) {
    reply = 'I am Qudra, created by Abdulmalik. Loyal AI assistant.';
  }
  res.json({ reply: reply });
});

app.use((req, res) => {
  res.send(HTML);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Qudra V2 Live Fixed on ' + PORT);
});
