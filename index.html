<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>QUDRA</title>
<style>
body{background:#0a0a0e;color:#fff;font-family:sans-serif;margin:0;display:flex;flex-direction:column;height:100vh}
.header{background:#FF6600;color:#000;padding:12px;font-weight:bold;text-align:center}
#chat{flex:1;overflow-y:auto;padding:15px}
.msg{padding:10px 14px;border-radius:14px;margin:8px 0;max-width:80%}
.user{background:#1e90ff;margin-left:auto}
.bot{background:#222}
#inputBox{display:flex;padding:10px;background:#111}
input{flex:1;padding:12px;border-radius:20px;border:none;outline:none}
button{margin-left:8px;padding:12px 18px;border-radius:20px;border:none;background:#FF6600;font-weight:bold}
</style>
</head>
<body>
<div class="header">QUDRA Llama Technology - 13.1V Power ON</div>
<div id="chat"></div>
<div id="inputBox">
<input id="msgInput" placeholder="Type..."/>
<button onclick="send()">Send</button>
</div>
<script>
const chatDiv = document.getElementById('chat');
const input = document.getElementById('msgInput');

function addMsg(text, who){
  const d = document.createElement('div');
  d.className = 'msg '+who;
  d.innerText = text;
  chatDiv.appendChild(d);
  chatDiv.scrollTop = chatDiv.scrollHeight;
}

async function send(){
  const text = input.value.trim();
  if(!text) return;
  addMsg(text, 'user');
  input.value = '';
  // NO NETWORK SPEED CHECK - DIRECT SEND EVEN FOR 0.22k/s
  try{
    addMsg('Q dey think...', 'bot');
    const res = await fetch('/api/q', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({message:text})
    });
    const data = await res.json();
    chatDiv.lastChild.remove();
    addMsg(data.reply || data.error || 'No reply', 'bot');
  }catch(e){
    chatDiv.lastChild.remove();
    addMsg('Network cut but Q save your msg - try again, Qudra Remains', 'bot');
  }
}
input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') send(); });
addMsg("Wallahi na him! I be Q, built by Abdulmalik. Ask me anything!", 'bot');
</script>
</body>
</html>
