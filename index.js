const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/ping', (req,res)=> res.json({status:'online', time: new Date().toISOString()}));

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Q A.I</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:linear-gradient(180deg,#e6f0ff 0%,#ffffff 100%);font-family:Arial,sans-serif;padding-bottom:90px;min-height:100vh}
.header{height:120px;background:linear-gradient(135deg,#0a3d8f 0%,#0a66c2 40%,#3a9bff 100%);display:flex;align-items:center;justify-content:space-between;padding:0 18px}
.q-logo{width:56px;height:56px;background:white;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:#0a66c2}
.q-title{color:white;font-size:30px;font-weight:800;margin-left:12px}
.owner-btn{background:rgba(255,255,255,0.25);border:1px solid rgba(255,255,255,0.4);color:white;padding:7px 14px;border-radius:20px;font-size:11px;text-decoration:none;backdrop-filter:blur(8px)}
.wrap{max-width:700px;margin:0 auto;padding:14px 12px}
.status-card{background:white;border-radius:18px;padding:10px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 6px 20px rgba(10,102,194,0.1);border:1px solid #e6f0ff;margin-bottom:12px}
.dot{width:10px;height:10px;border-radius:50%;box-shadow:0 0 8px currentColor}
.online{background:#00e676;color:#00e676;animation:pulse 2s infinite}
.offline{background:#9aa8c2;color:#9aa8c2}
@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
.q-msg{background:white;border-radius:18px 18px 18px 4px;padding:12px 14px;max-width:82%;margin:10px 0;display:flex;gap:9px;box-shadow:0 4px 18px rgba(10,102,194,0.08);border:1px solid #f0f6ff}
.q-icon{width:34px;height:34px;background:linear-gradient(135deg,#0a66c2,#3a9bff);color:white;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:bold}
.footer{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);width:93%;max-width:680px;background:white;border-radius:26px;padding:7px 9px;display:flex;gap:7px;align-items:center;box-shadow:0 10px 35px rgba(10,102,194,0.2);border:1px solid #e6f0ff}
.footer input{flex:1;border:none;outline:none;background:#f5f9ff;border-radius:20px;padding:11px 16px;font-size:14px}
.btn{width:42px;height:42px;border-radius:50%;border:none;cursor:pointer;font-size:18px}
.btn-draw{background:linear-gradient(135deg,#e6f0ff,#cce0ff);color:#0a66c2;border:1.5px solid #b8d4ff}
.btn-send{background:linear-gradient(135deg,#0a66c2,#3a9bff);color:white}
</style>
</head>
<body>
<div class="header">
  <div style="display:flex;align-items:center"><div class="q-logo">Q</div><div class="q-title" style="margin-left:12px">Q A.I</div></div>
  <a href="/owner" class="owner-btn">built by Abdulmalik ✨</a>
</div>
<div class="wrap">
  <div class="status-card" id="statusCard">
    <div class="dot offline" id="dot"></div>
    <div><b style="color:#0a3d8f;font-size:14px" id="statusText">Checking Q status...</b> <small style="color:#8aa0c2" id="statusTime"></small></div>
    <div style="margin-left:auto;font-size:14px">✨</div>
  </div>
  <div id="chat"><div class="q-msg"><div class="q-icon">Q</div><div>Hi King! Q is live ✨</div></div></div>
</div>
<div class="footer">
  <input id="input" placeholder="Ask Q anything..." onkeypress="if(event.key==='Enter')send()">
  <button class="btn btn-draw" onclick="document.getElementById('input').value='/draw ';document.getElementById('input').focus()">🎨</button>
  <button class="btn btn-send" onclick="send()">➤</button>
</div>
<script>
async function checkStatus(){
  let dot=document.getElementById('dot'), txt=document.getElementById('statusText'), time=document.getElementById('statusTime');
  try{
    let res=await fetch('/ping?t='+Date.now());
    if(res.ok){
      dot.className='dot online';
      txt.textContent='Q A.I is online';
      let now=new Date();
      time.textContent='• active now • '+now.toLocaleTimeString();
    }else throw new Error();
  }catch(e){
    dot.className='dot offline';
    txt.textContent='Q A.I is offline';
    time.textContent='• reconnecting...';
  }
}
checkStatus();
setInterval(checkStatus, 10000); // check every 10 seconds - REAL active status!

function send(){
  let i=document.getElementById('input');let t=i.value.trim();if(!t)return;
  let c=document.getElementById('chat');
  c.innerHTML+='<div style="background:linear-gradient(135deg,#0a66c2,#1a7bff);color:white;border-radius:18px 18px 4px 18px;padding:11px 14px;max-width:76%;margin:10px 0 10px auto">'+t+'</div>';
  c.innerHTML+='<div class="q-msg"><div class="q-icon">Q</div><div>Q go reply here ✨</div></div>';
  i.value='';window.scrollTo(0,document.body.scrollHeight);
}
</script>
</body>
</html>
  `);
});

app.get('/owner', (req, res) => {
  res.send('<h1 style="font-family:Arial;text-align:center;margin-top:50px;color:#0a66c2">Q A.I Owner Panel<br><br><a href="/" style="color:#0a66c2">Back to Q</a><br><br>Built by Abdulmalik - 100% Meta</h1>');
});

app.listen(PORT, () => console.log('Q A.I REAL STATUS LIVE on', PORT));
