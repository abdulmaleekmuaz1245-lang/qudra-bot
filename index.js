const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({extended:true, limit:'20mb'}));

const storage = multer.diskStorage({
  destination: (req,file,cb)=>{ if(!fs.existsSync('uploads')) fs.mkdirSync('uploads'); cb(null,'uploads/') },
  filename: (req,file,cb)=> cb(null, Date.now()+'-'+file.originalname)
});
const upload = multer({storage});
app.use('/uploads', express.static('uploads'));

let DB = {adverts:[], orders:[]};
if(fs.existsSync('db.json')){ try{ DB = JSON.parse(fs.readFileSync('db.json','utf8')); }catch{} }
function saveDB(){ fs.writeFileSync('db.json', JSON.stringify(DB)); }

const ASMAUL_HUSNA = ["Ar-Rahman","Ar-Rahim","Al-Malik","Al-Quddus","As-Salam","Al-Mu'min","Al-Muhaymin","Al-Aziz","Al-Jabbar","Al-Mutakabbir","Al-Khaliq","Al-Bari","Al-Musawwir","Al-Ghaffar","Al-Qahhar","Al-Wahhab","Ar-Razzaq","Al-Fattah","Al-Alim","Al-Qabid","Al-Basit","Al-Khafid","Ar-Rafi","Al-Mu'izz","Al-Mudhill","As-Sami","Al-Basir","Al-Hakam","Al-Adl","Al-Latif","Al-Khabir","Al-Halim","Al-Azim","Al-Ghafur","Ash-Shakur","Al-Ali","Al-Kabir","Al-Hafiz","Al-Muqit","Al-Hasib","Al-Jalil","Al-Karim","Ar-Raqib","Al-Mujib","Al-Wasi","Al-Hakim","Al-Wadud","Al-Majid","Al-Ba'ith","Ash-Shahid","Al-Haqq","Al-Wakil","Al-Qawiyy","Al-Matin","Al-Waliyy","Al-Hamid","Al-Muhsi","Al-Mubdi","Al-Mu'id","Al-Muhyi","Al-Mumit","Al-Hayy","Al-Qayyum","Al-Wajid","Al-Majid","Al-Wahid","Al-Ahad","As-Samad","Al-Qadir","Al-Muqtadir","Al-Muqaddim","Al-Mu'akhkhir","Al-Awwal","Al-Akhir","Az-Zahir","Al-Batin","Al-Wali","Al-Muta'ali","Al-Barr","At-Tawwab","Al-Muntaqim","Al-Afuww","Ar-Ra'uf","Malik-al-Mulk","Dhul-Jalali Wal-Ikram","Al-Muqsit","Al-Jami","Al-Ghaniyy","Al-Mughni","Al-Mani","Ad-Darr","An-Nafi","An-Nur","Al-Hadi","Al-Badi","Al-Baqi","Al-Warith","Ar-Rashid","As-Sabur"];

app.get('/ping',(req,res)=>res.json({online:true,time:new Date().toLocaleTimeString()}));

app.post('/api/chat',(req,res)=>{
  const original = req.body.message || '';
  const m = original.toLowerCase().trim();
  let reply="";
  if(m.includes('who is abdulmalik') || (m.includes('who') && m.includes('abdulmalik'))){
    reply=`Na me be Abdulmalik! 👑 Builder of Q A.I from Kano! I build Q with Smart Brain + Asmaul Husna 99 + Order + Adverts with sticker!`;
  } else if(m.startsWith('do you know') || m.startsWith('do u know') || m.includes('do you know') || m.includes('do u know')){
    const match = original.match(/know\s+([a-zA-Z]+)/i);
    const name = match ? match[1] : 'that person';
    reply=`${name.toUpperCase()}? 🤔 I never get full record of ${name} yet! Tell me who be ${name}? I go remember am! ✨`;
  } else if(m.includes('how are you') || m.includes('how u dey')){
    reply=`I dey great Alhamdulillah! 👑 Na Abdulmalik dey here through Q A.I! Smart Brain Active, Q online, Asmaul Husna 99 dey my heart! How you dey? Wetin I fit do for you today? ✨`;
  } else if(m.includes('hi') || m.includes('hello') || m.includes('salam') || m==='hi' || m==='hey'){
    reply=`Wa Alaikum Salam! 👑 Na Abdulmalik here! Q Smart Brain active! Ask "Who is Abdulmalik", "Do u know AMINA", "How are you" - I go answer direct! ✨`;
  } else if(m.includes('asmaul') || m.includes('99 names')){
    reply=`Asmaul Husna na 99 beautiful names of Allah! Eg: ${ASMAUL_HUSNA.slice(0,8).join(', ')}... Which one you wan know? 🕌`;
  } else if(m.includes('who are you')){
    reply=`I be Q A.I! 🤖 Built by Abdulmalik from Kano! Your AI assistant with Smart Brain + Islamic knowledge + Order + Adverts with sticker! 👑`;
  } else {
    reply=`Na Abdulmalik here! 👑 You talk "${original}" - I hear you well! I dey fine Alhamdulillah! Ask me anything direct - code, adverts, order, Asmaul Husna - I go answer correct! ✨`;
  }
  res.json({reply});
});

app.get('/api/adverts',(req,res)=>res.json(DB.adverts));
app.post('/api/adverts',upload.single('sticker'),(req,res)=>{
  const {text,phone}=req.body;
  const sticker=req.file?'/uploads/'+req.file.filename:'';
  const advert={id:Date.now(),text,phone,sticker,time:new Date().toLocaleString()};
  DB.adverts.unshift(advert); saveDB();
  res.json({success:true,advert});
});
app.post('/api/orders',(req,res)=>{
  const order={...req.body,id:Date.now(),time:new Date().toLocaleString()};
  DB.orders.unshift(order); saveDB();
  res.json({success:true});
});
app.get('/owner',(req,res)=>{ res.send(`<h1>Q A.I Owner - built by Abdulmalik</h1><h2>Adverts: ${DB.adverts.length}</h2><pre>${JSON.stringify(DB.adverts,null,2)}</pre><h2>Orders: ${DB.orders.length}</h2><pre>${JSON.stringify(DB.orders,null,2)}</pre><br><a href="/">Go to Q main</a>`); });
app.get('/',(req,res)=>{
  res.send(`<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Q A.I - built by Abdulmalik</title><style>body{font-family:Arial;background:#e6f0ff;margin:0;padding:0}.header{background:linear-gradient(to right,#0b5cff,#003399);color:white;padding:15px;display:flex;justify-content:space-between;align-items:center}.logo{display:flex;align-items:center;gap:10px}.qbox{background:white;color:#0b5cff;width:45px;height:45px;display:flex;justify-content:center;align-items:center;border-radius:12px;font-weight:bold;font-size:26px}.badge{background:rgba(255,255,255,0.3);padding:5px 12px;border-radius:20px;font-size:13px}.status-card{background:white;margin:15px;border-radius:15px;padding:12px;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 10px rgba(0,0,0,0.1)}.dot{width:12px;height:12px;border-radius:50%;display:inline-block}.online{background:#00cc00;box-shadow:0 0 8px #00cc00}.offline{background:#999}.btns{display:flex;gap:8px}.btn{padding:8px 14px;border:none;border-radius:20px;color:white;font-weight:bold;cursor:pointer}.order{background:orange}.adverts{background:#0b5cff}.chat-box{background:white;margin:15px;border-radius:15px;padding:15px;min-height:250px;padding-bottom:80px}.input-area{position:fixed;bottom:0;left:0;right:0;background:white;padding:10px;display:flex;gap:10px;box-shadow:0 -2px 10px rgba(0,0,0,0.1)}.input-area input{flex:1;padding:12px;border-radius:25px;border:1px solid #ccc;outline:none}.go{background:#0b5cff;color:white;border:none;width:50px;height:45px;border-radius:50%;font-weight:bold;cursor:pointer}.msg{background:#f0f6ff;padding:10px;border-radius:12px;margin:8px 0}</style></head><body><div class="header"><div class="logo"><div class="qbox">Q</div><h2>Q A.I</h2></div><div class="badge">built by Abdulmalik</div></div><div class="status-card"><div><b id="statusTitle">Q checking...</b><br><span id="statusSub"><span class="dot offline"></span> Checking</span></div><div class="btns"><button class="btn order" onclick="showOrder()">🛒 Order</button><button class="btn adverts" onclick="showAdverts()">📢 Adverts</button></div></div><div class="chat-box" id="chatBox"><div class="msg">Wa Alaikum Salam! Na Abdulmalik here 👑 (through Q A.I)! ULTIMATE COMPLETE - ALL JOURNEY ATTACHED! Ask "How are you", "Who is Abdulmalik", "Do u know AMINA"! ✨</div><div id="advertsList"></div></div><div class="input-area"><input id="chatInput" placeholder="Chat with Abdulmalik.."><button class="go" onclick="sendChat()">Go</button></div><script>async function checkStatus(){try{const r=await fetch('/ping');const d=await r.json();if(d.online){document.getElementById('statusTitle').innerText='Q A.I is online';document.getElementById('statusSub').innerHTML='<span class="dot online"></span> Smart Brain Active - '+d.time;}}catch{document.getElementById('statusTitle').innerText='Q offline';document.getElementById('statusSub').innerHTML='<span class="dot offline"></span> Q offline';}}checkStatus();setInterval(checkStatus,10000);async function sendChat(){const input=document.getElementById('chatInput');const msg=input.value;if(!msg) return;const box=document.getElementById('chatBox');box.innerHTML+='<div class="msg" style="background:#dbe9ff;text-align:right"><b>You:</b> '+msg+'</div>';input.value='';const res=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg})});const data=await res.json();box.innerHTML+='<div class="msg">'+data.reply+'</div>';box.scrollTop=box.scrollHeight;}async function showAdverts(){const box=document.getElementById('chatBox');const res=await fetch('/api/adverts');const adverts=await res.json();let html='<div style="background:#eef5ff;padding:10px;border-radius:10px"><h3>📢 Post Advert (sticker + text + phone)</h3><input type="file" id="stickerFile" accept="image/*"><br><br><textarea id="advertText" placeholder="Advert text" style="width:100%;height:60px"></textarea><br><br><input id="advertPhone" placeholder="Phone number" style="width:100%;padding:8px"><br><br><button onclick="postAdvert()" style="background:#0b5cff;color:white;padding:10px;border:none;border-radius:8px;width:100%">Post Advert</button><hr>';adverts.forEach(a=>{html+='<div style="border:1px solid #ccc;padding:10px;margin:8px 0;border-radius:8px;background:white">'+(a.sticker?'<img src="'+a.sticker+'" style="width:100%;max-height:200px;object-fit:cover;border-radius:8px"><br>':'')+'<b>'+a.text+'</b><br>📞 '+a.phone+'<br><small>'+a.time+'</small></div>';});html+='</div>';box.innerHTML=html;}async function postAdvert(){const file=document.getElementById('stickerFile').files[0];const text=document.getElementById('advertText').value;const phone=document.getElementById('advertPhone').value;if(!text||!phone) return alert('Fill text and phone');const fd=new FormData();if(file) fd.append('sticker',file);fd.append('text',text);fd.append('phone',phone);const res=await fetch('/api/adverts',{method:'POST',body:fd});const data=await res.json();if(data.success){alert('Advert posted!');showAdverts();}}function showOrder(){const box=document.getElementById('chatBox');box.innerHTML='<div style="background:#fff8e6;padding:10px;border-radius:10px"><h3>🛒 Place Order</h3><input id="orderName" placeholder="What you want?" style="width:100%;padding:8px"><br><br><input id="orderPhone" placeholder="Your phone" style="width:100%;padding:8px"><br><br><input id="orderLocation" placeholder="Your location" style="width:100%;padding:8px"><br><br><button onclick="postOrder()" style="background:orange;color:white;padding:10px;border:none;border-radius:8px;width:100%">Order Now</button></div>';}async function postOrder(){const name=document.getElementById('orderName').value;const phone=document.getElementById('orderPhone').value;const location=document.getElementById('orderLocation').value;const res=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,phone,location})});const data=await res.json();if(data.success) alert('Order placed!');}document.getElementById('chatInput').addEventListener('keypress', (e)=>{ if(e.key==='Enter') sendChat(); });</script></body></html>`);
});

const SELF_URL = process.env.RENDER_EXTERNAL_HOSTNAME ? 'https://'+process.env.RENDER_EXTERNAL_HOSTNAME+'/ping' : 'https://dra-bot-k49r.onrender.com/ping';
setInterval(()=>{ fetch(SELF_URL).then(()=>console.log('Q self-ping '+new Date().toLocaleTimeString())).catch(()=>{}); }, 4*60*1000);

app.listen(PORT,()=>console.log('Q PROMISE-KEPT COMPLETE LIVE on '+PORT));
