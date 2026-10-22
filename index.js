<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Qudra Bot - by Abdulmalik</title>
<style>
body{font-family:sans-serif;background:#0f172a;color:white;margin:0;display:flex;flex-direction:column;height:100vh}
#chat{flex:1;overflow-y:auto;padding:15px}
.msg{margin:8px 0;padding:10px 14px;border-radius:12px;max-width:80%}
.user{background:#3b82f6;align-self:flex-end;margin-left:auto}
.bot{background:#1e293b}
#box{display:flex;padding:10px;background:#1e293b}
input{flex:1;padding:12px;border-radius:20px;border:none;outline:none}
button{margin-left:8px;padding:12px 18px;border-radius:20px;border:none;background:#3b82f6;color:white;font-weight:bold}
h2{text-align:center;margin:10px}
</style>
</head>
<body>
<h2>Qudra Bot 🤖 by Abdulmalik</h2>
<div id="chat"></div>
<div id="box">
<input id="inp" placeholder="Ask Qudra anything...">
<button onclick="send()">Send</button>
</div>
<script>
const chat=document.getElementById('chat');
const inp=document.getElementById('inp');
async function send(){
 if(!inp.value.trim()) return;
 const txt=inp.value;
 chat.innerHTML+=`<div class="msg user">${txt}</div>`;
 inp.value='';
 chat.scrollTop=chat.scrollHeight;
 const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:txt})});
 const d=await r.json();
 chat.innerHTML+=`<div class="msg bot">${d.reply}</div>`;
 chat.scrollTop=chat.scrollHeight;
}
inp.addEventListener('keypress',e=>{if(e.key==='Enter') send()});
</script>
</body>
</html>
