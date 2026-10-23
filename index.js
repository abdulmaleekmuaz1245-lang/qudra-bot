<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>QUDRA Llama Technology</title>
<style>
body{margin:0;background:#121212;color:#fff;font-family:Arial}
.header{background:#ff6a00;padding:12px;text-align:center;font-weight:bold}
.chat{padding:15px;padding-bottom:90px}
.bubble{padding:10px 14px;border-radius:18px;margin:8px 0;max-width:80%;word-wrap:break-word}
.user{background:#0084ff;margin-left:auto}
.bot{background:#2a2a2a}
.inputBar{position:fixed;bottom:0;left:0;right:0;display:flex;background:#1e1e1e;padding:10px}
input{flex:1;padding:12px;border-radius:20px;border:none;background:#2a2a2a;color:#fff}
button{margin-left:8px;padding:12px 18px;border-radius:20px;border:none;background:#ff6a00;color:#fff;font-weight:bold}
</style>
</head>
<body>
<div class="header">QUDRA Llama Technology - 13.1V Power ON</div>
<div class="chat" id="chat">
<div class="bubble bot">You are welcome, I'm Q AI, build by Abdulmalik, Ask me anything! Qudra Remains!</div>
</div>
<div class="inputBar">
<input id="msgInput" placeholder="Type Hi..." />
<button onclick="sendMessage()">Send</button>
</div>
<script>
const chatDiv=document.getElementById('chat');
const input=document.getElementById('msgInput');
function addMessage(t,w){const d=document.createElement('div');d.className='bubble '+w;d.textContent=t;chatDiv.appendChild(d);window.scrollTo(0,document.body.scrollHeight);}
async function sendMessage(){const m=input.value.trim();if(!m)return;addMessage(m,'user');input.value='';try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:m})});const d=await r.json();addMessage(d.reply,'bot');}catch(e){addMessage('Q dey wake up, wait 30s... Qudra Remains!','bot');}}
input.addEventListener('keydown',e=>{if(e.key==='Enter')sendMessage();});
</script>
</body>
</html>
