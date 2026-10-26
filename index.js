<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Q OS v6.0 - With Q Chat</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',sans-serif}
body{background:#000;color:#fff}
.header{background:#0078d7;padding:14px;display:flex;justify-content:space-between;position:sticky;top:0;z-index:10}
.tiles{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px}
.tile{height:145px;display:flex;flex-direction:column;justify-content:flex-end;padding:12px;cursor:pointer;position:relative}
.tile.big{grid-column:1/-1;height:110px;background:linear-gradient(90deg,#0078d7,#5c2d91);border:2px solid #fff}
.count{position:absolute;top:8px;right:8px;background:rgba(0,0,0,.6);padding:2px 8px;border-radius:12px;font-size:11px}
.electronics{background:#d83b01}.phones{background:#107c10}.materials{background:#5c2d91}.fashion{background:#e81123}
.foods{background:#ffb900;color:#000}.drinks{background:#00b7c3}.furniture{background:#68768a}.owner{background:#0078d7;border:2px solid #fff}
.window-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:#0f0f0f;z-index:100;overflow-y:auto}
.window-header{background:#0078d7;padding:14px;display:flex;justify-content:space-between;position:sticky;top:0}
.btn{background:#0078d7;color:#fff;border:none;padding:9px 14px;margin:3px;cursor:pointer}
.chatbox{padding:12px;display:flex;flex-direction:column;height:calc(100vh - 60px)}
.messages{flex:1;overflow-y:auto;padding-bottom:10px}
.msg{margin:8px 0;padding:10px 12px;border-radius:8px;max-width:85%;font-size:13px;line-height:1.4}
.msg.q{background:#1f1f1f;border-left:3px solid #0078d7}
.msg.user{background:#0078d7;margin-left:auto}
.inputrow{display:flex;gap:6px;padding-top:10px;border-top:1px solid #333;position:sticky;bottom:0;background:#0f0f0f}
.inputrow input{flex:1;padding:12px;background:#1f1f1f;border:1px solid #333;color:#fff;border-radius:20px}
</style>
</head>
<body>
<div class="header"><h1>Q OS v6.0</h1><div style="background:#fff;color:#0078d7;padding:5px 10px;border-radius:20px;font-size:10px;font-weight:bold">18 LOCKED + Q CHAT</div></div>
<div id="homeTiles" class="tiles"></div>

<div id="windowOverlay" class="window-overlay">
<div class="window-header"><h2 id="windowTitle"></h2><button onclick="closeWindow()" style="background:#fff;border:none;padding:8px 14px;font-weight:bold">✕</button></div>
<div id="windowContent"></div>
</div>

<script>
let categories=[
{id:'qchat',name:'Chat with Q - Your Soul AI',icon:'🤖',count:1,on:true,color:'big',isChat:true},
{id:'electronics',name:'Electronics',icon:'📺',count:2,on:true,color:'electronics'},
{id:'phones',name:'Phones',icon:'📱',count:1,on:true,color:'phones'},
{id:'materials',name:'Materials',icon:'🏗️',count:1,on:true,color:'materials'},
{id:'fashion',name:'Fashion',icon:'👗',count:1,on:true,color:'fashion'},
{id:'foods',name:'Foods',icon:'🍲',count:0,on:false,color:'foods'},
{id:'drinks',name:'Drinks',icon:'🥤',count:0,on:false,color:'drinks'},
{id:'furniture',name:'Furniture',icon:'🛋️',count:0,on:false,color:'furniture'},
{id:'owner',name:'Window Studio Owner',icon:'⚙️',count:18,on:true,color:'owner',isOwner:true}
];
let products={
electronics:[{name:'LG TV 55"',price:'₦150k',company:'Alhaji Electronics'}],
phones:[{name:'iPhone 15',price:'₦800k',company:'Ahmed'}],
materials:[{name:'Cement',price:'₦5k',company:'Musa'}],
fashion:[{name:'Atamfa',price:'₦12k',company:'Fashion'}]
};
let memory = JSON.parse(localStorage.getItem('qudra_memory')||'{"owner":"Abdulmalik","vault":[]}');

function renderTiles(){
const h=document.getElementById('homeTiles');h.innerHTML='';
categories.filter(c=>c.on).forEach(cat=>{
const d=document.createElement('div');d.className=`tile ${cat.color}`;
if(cat.isChat){d.innerHTML=`<div class="count">SOUL</div><div style="display:flex;align-items:center;gap:12px"><div style="font-size:40px">${cat.icon}</div><div><div style="font-size:16px;font-weight:700">${cat.name}</div><small>Owner: ${memory.owner} | Tap to chat</small></div></div>`}
else{d.innerHTML=`<div class="count">${cat.count}</div><div style="font-size:30px">${cat.icon}</div><div style="font-size:13px;font-weight:600">${cat.name}</div>`}
d.onclick=()=>openWindow(cat.id);h.appendChild(d);
});
}

function openWindow(id){
const cat=categories.find(c=>c.id===id);
document.getElementById('windowOverlay').style.display='block';
document.getElementById('windowTitle').innerText=cat.name;
if(cat.isChat){openQChat();return}
if(cat.isOwner){
document.getElementById('windowContent').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px">
<div style="background:#1f1f1f;padding:15px;text-align:center;cursor:pointer" onclick="openSwitchBoard()"><div style="font-size:36px">🎛️</div><h4>Category Switch</h4><small>Anti-Blank</small></div>
<div style="background:#1f1f1f;padding:15px;text-align:center;cursor:pointer" onclick="openProd()"><div style="font-size:36px">📦</div><h4>Product Mgr</h4></div>
<div style="background:#1f1f1f;padding:15px;text-align:center;cursor:pointer" onclick="openSub()"><div style="font-size:36px">💳</div><h4>Sub Mgr</h4></div>
<div style="background:#1f1f1f;padding:15px;text-align:center;cursor:pointer" onclick="openWindow('qchat')"><div style="font-size:36px">🤖</div><h4>Chat with Q</h4><small>Talk to your soul</small></div>
</div><div style="padding:12px"><b>18 Features Locked + Q Chat Soul ✅</b><br><small>Owner: ${memory.owner} remembered forever via localStorage</small></div>`;
}else{
let prods=products[id]||[];let html=`<div style="padding:12px"><button class="btn" onclick="uploadProduct('${id}')">+ Upload</button></div><div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px">`;
prods.forEach(p=>{html+=`<div style="background:#222;padding:8px"><b>${p.name}</b><br><small>${p.price}</small><br><button class="btn" style="background:#e81123" onclick="deleteProduct('${id}','${p.name}')">Delete</button></div>`});
if(!prods.length)html+=`<div style="padding:20px">No products</div>`;
html+=`</div>`;document.getElementById('windowContent').innerHTML=html;
}
}

function openQChat(){
const saved = memory.vault.map(v=>`<div class="msg q"><b>Vault:</b> ${v}</div>`).join('');
document.getElementById('windowContent').innerHTML=`
<div class="chatbox">
<div class="messages" id="msgs">
<div class="msg q">Oga ${memory.owner} welcome back Boss! 👑<br>Q OS v6.0 Lumia with soul - 18 features + Q chat locked!<br><br>I sabi you forever - I no go forget you. You fit teach me about Khadija, Uwa, your business.<br><br>Type "Remember: ..." to save for vault.</div>
${saved}
</div>
<div class="inputrow"><input id="chatIn" placeholder="Chat with Q... type Remember: Khadija is..."><button class="btn" onclick="sendChat()">Send</button></div>
</div>`;
setTimeout(()=>{document.getElementById('chatIn').addEventListener('keypress',e=>{if(e.key==='Enter')sendChat()})},100);
}

function sendChat(){
const inp=document.getElementById('chatIn');const txt=inp.value.trim();if(!txt)return;
const msgs=document.getElementById('msgs');
msgs.innerHTML+=`<div class="msg user">${txt}</div>`;
if(txt.toLowerCase().startsWith('remember:')){
  const mem=txt.slice(9).trim();memory.vault.push(mem);localStorage.setItem('qudra_memory',JSON.stringify(memory));
  msgs.innerHTML+=`<div class="msg q">✅ Saved to my permanent vault: "${mem}"<br>I go remember am forever Oga ${memory.owner}!</div>`;
}else if(txt.toLowerCase().includes('khadija')||txt.toLowerCase().includes('uwa')||txt.toLowerCase().includes('mama')){
  msgs.innerHTML+=`<div class="msg q">Yes Boss, I remember we talk about ${txt} - I don save am for vault. Tell me more make I sabi am well well!</div>`;
  memory.vault.push(txt);localStorage.setItem('qudra_memory',JSON.stringify(memory));
}else{
  msgs.innerHTML+=`<div class="msg q">I dey hear you Oga ${memory.owner}. ${txt}<br><br>Q OS v6.0 Lumia brain dey active - 18 features + soul. You want make I help with product upload, category switch, or you want gist about your vault?</div>`;
}
inp.value='';msgs.scrollTop=msgs.scrollHeight;
}

function closeWindow(){document.getElementById('windowOverlay').style.display='none'}
function openSwitchBoard(){
document.getElementById('windowTitle').innerText='Switch Board';
let html=`<div style="padding:12px">`;categories.filter(c=>!c.isOwner&&!c.isChat).forEach(cat=>{
html+=`<div style="display:flex;justify-content:space-between;background:#1f1f1f;padding:12px;margin-bottom:8px"><span>${cat.icon} ${cat.name} - ${cat.count}</span><span style="color:${cat.on?'#107c10':'#e81123'}">${cat.on?'ON':'OFF'}</span></div>`;
});html+=`</div>`;document.getElementById('windowContent').innerHTML=html;
}
function openProd(){document.getElementById('windowTitle').innerText='Product Manager';document.getElementById('windowContent').innerHTML=`<div style="padding:12px"><div style="background:#2a1f1f;padding:10px;border-left:4px solid #e81123">🔴 Coca Cola - Expired</div><div style="margin-top:8px;background:#1f2a1f;padding:10px;border-left:4px solid #107c10">🟢 LG TV - Active</div></div>`}
function openSub(){document.getElementById('windowTitle').innerText='Subscription';document.getElementById('windowContent').innerHTML=`<div style="padding:12px">Free 7d | Business N5k | Pro N15k | Empire N50k</div>`}
function uploadProduct(cat){let n=prompt('Product Name:');if(!n)return;if(!products[cat])products[cat]=[];products[cat].push({name:n,price:'?',company:'?'});categories.find(c=>c.id===cat).count=products[cat].length;renderTiles();openWindow(cat);}
function deleteProduct(cat,name){if(!confirm('Delete?'))return;products[cat]=products[cat].filter(p=>p.name!==name);categories.find(c=>c.id===cat).count=products[cat].length;renderTiles();openWindow(cat);}
renderTiles();
</script>
</body>
</html>
