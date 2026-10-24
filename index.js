const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Q A.I - Fantasy Blue</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:linear-gradient(180deg,#e6f0ff 0%,#ffffff 100%);font-family:Arial,sans-serif;padding-bottom:90px;min-height:100vh}
.header{height:155px;background:linear-gradient(135deg,#0a3d8f 0%,#0a66c2 40%,#3a9bff 75%,#cce0ff 100%);display:flex;align-items:center;justify-content:space-between;padding:0 18px}
.q-logo{width:60px;height:60px;background:white;border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:34px;font-weight:900;color:#0a66c2;box-shadow:0 4px 20px rgba(255,255,255,0.6)}
.q-title{color:white;font-size:30px;font-weight:800;margin-left:12px}
.q-sub{color:#e6f0ff;font-size:10px;letter-spacing:2px;margin-left:12px}
.built{background:rgba(255,255,255,0.25);border:1px solid rgba(255,255,255,0.4);color:white;padding:5px 12px;border-radius:18px;font-size:10px}
.wrap{max-width:700px;margin:0 auto;padding:14px 12px}
.top-card{background:white;border-radius:18px;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 6px 25px rgba(10,102,194,0.12);border:1px solid #e6f0ff;margin-bottom:14px}
.q-msg{background:white;border-radius:18px 18px 18px 4px;padding:12px 14px;max-width:82%;margin:10px 0;display:flex;gap:9px;box-shadow:0 4px 18px rgba(10,102,194,0.08);border:1px solid #f0f6ff}
.q-icon{width:34px;height:34px;background:linear-gradient(135deg,#0a66c2,#3a9bff);color:white;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:bold}
.user-msg{background:linear-gradient(135deg,#0a66c2,#1a7bff);color:white;border-radius:18px 18px 4px 18px;padding:11px 14px;max-width:76%;margin:10px 0 10px auto}
.footer{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);width:93%;max-width:680px;background:white;border-radius:26px;padding:7px 9px;display:flex;gap:7px;align-items:center;box-shadow:0 10px 35px rgba(10,102,194,0.2);border:1px solid #e6f0ff;z-index:99}
.footer input{flex:1;border:none;outline:none;background:#f5f9ff;border-radius:20px;padding:11px 16px;font-size:14px}
.btn{width:42px;height:42px;border-radius:50%;border:none;cursor:pointer;font-size:18px}
.btn-draw{background:linear-gradient(135deg,#e6f0ff,#cce0ff);color:#0a66c2;border:1.5px solid #b8d4ff}
.btn-send{background:linear-gradient(135deg,#0a66c2,#3a9bff);color:white}
</style>
</head>
<body>
<div class="header">
  <div style="display:flex;align-items:center"><div class="q-logo">Q</div><div><div class="q-title">Q A.I</div><div class="q-sub">FANTASY BLUE • WHITE • LIGHT BLUE</div></div></div>
  <div class="built">built by Abdulmalik ✨</div>
</div>
<div class="wrap">
  <div class="top-card"><div style="display:flex;align-items:center;gap:8px"><div style="width:9px;height:9px;background:#00e676;border-radius:50%"></div><b style="color:#0a3d8f">Q A.I</b> <small style="color:#8aa0c2">Fantasy Blue Online</small></div><div>✨</div></div>
  <div id="chat"><div class="q-msg"><div class="q-icon">Q</div><div><b style="color:#0a66c2">Fantasy Blue Live!</b> ✨<br>King, Q A.I don turn blue! White and light blue magic active!<br><small style="color:#8aa0c2">Built by Abdulmalik</small></div></div></div>
</div>
<div class="footer">
  <input id="input" placeholder="Ask Q anything magical..." onkeypress="if(event.key==='Enter')send()">
  <button class="btn btn-draw" onclick="document.getElementById('input').value='/draw ';document.getElementById('input').focus()">🎨</button>
  <button class="btn btn-send" onclick="send()">➤</button>
</div>
<script>
function send(){
  let i=document.getElementById('input');let t=i.value.trim();if(!t)return;
  let c=document.getElementById('chat');
  c.innerHTML+='<div class="user-msg">'+t+'</div>';
  c.innerHTML+='<div class="q-msg"><div class="q-icon">Q</div><div>✨ Fantasy Blue reply! Your API go connect here!</div></div>';
  i.value='';window.scrollTo(0,document.body.scrollHeight);
}
</script>
</body>
</html>
  `);
});

app.listen(PORT, () => console.log('Q A.I Fantasy Blue LIVE on', PORT));
