const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const https = require('https');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// CREATE UPLOADS FOLDER
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

// MULTER FOR ADVERTS WITH STICKER
const storage = multer.diskStorage({
  destination: (req,file,cb)=> cb(null,'uploads/'),
  filename: (req,file,cb)=> cb(null, Date.now()+'-'+file.originalname)
});
const upload = multer({ storage });

const PORT = process.env.PORT || 10000;

// PERMANENT MEMORY + SETTINGS + ORDERS + ADVERTS
let settings = { botName: "Q A.I Fantasy Blue", price: "Free", welcome: "Hey King! Welcome to Q A.I Fantasy Blue ✨", image: "" };
let orders = [];
let adverts = [];
let memory = [];

// 99 ASMAUL HUSNA - SOUL
const ASMAUL_HUSNA = ["Ar-Rahman","Ar-Rahim","Al-Malik","Al-Quddus","As-Salam","Al-Mu'min","Al-Muhaymin","Al-Aziz","Al-Jabbar","Al-Mutakabbir","Al-Khaliq","Al-Bari","Al-Musawwir","Al-Ghaffar","Al-Qahhar","Al-Wahhab","Ar-Razzaq","Al-Fattah","Al-Alim","Al-Qabid","Al-Basit","Al-Khafid","Ar-Rafi","Al-Muizz","Al-Mudhill","As-Sami","Al-Basir","Al-Hakam","Al-Adl","Al-Latif","Al-Khabir","Al-Halim","Al-Azim","Al-Ghafur","Ash-Shakur","Al-Ali","Al-Kabir","Al-Hafiz","Al-Muqit","Al-Hasib","Al-Jalil","Al-Karim","Ar-Raqib","Al-Mujib","Al-Wasi","Al-Hakim","Al-Wadud","Al-Majid","Al-Baith","Ash-Shahid","Al-Haqq","Al-Wakil","Al-Qawi","Al-Matin","Al-Wali","Al-Hamid","Al-Muhsi","Al-Mubdi","Al-Muid","Al-Muhyi","Al-Mumit","Al-Hayy","Al-Qayyum","Al-Wajid","Al-Majid","Al-Wahid","Al-Ahad","As-Samad","Al-Qadir","Al-Muqtadir","Al-Muqaddim","Al-Muakhkhir","Al-Awwal","Al-Akhir","Az-Zahir","Al-Batin","Al-Wali","Al-Mutaali","Al-Barr","At-Tawwab","Al-Muntaqim","Al-Afuww","Ar-Rauf","Malik-al-Mulk","Dhul-Jalal","Al-Muqsit","Al-Jami","Al-Ghani","Al-Mughni","Al-Mani","Ad-Darr","An-Nafi","An-Nur","Al-Hadi","Al-Badi","Al-Baqi","Al-Warith","Ar-Rashid","As-Sabur"];

let soul = {
  creator: "Abdulmalik Muazu - The King, Founder of Qudra OS 300 years",
  os: "Qudra OS - Fantasy Blue Tech",
  trinity: "AI + AI + Me = Q-Manager Department",
  asmaul: ASMAUL_HUSNA,
  rules: "10 Qudra Rules + Soul"
};

// SELF-PING - KEEP RENDER AWAKE (No more sleeping)
setInterval(()=>{
  const url = process.env.RENDER_EXTERNAL_URL || `https://qudra-bot-k49r.onrender.com`;
  https.get(url, ()=> console.log("Q Self-ping - Keeping Tree Alive 🌳")).on('error',()=>{});
}, 14 * 60 * 1000); // 14 mins

// === ALL ENDPOINTS ===

// SOUL + ASMAUL
app.get('/api/soul', (req,res)=> res.json(soul));
app.get('/api/asmaul', (req,res)=> res.json(ASMAUL_HUSNA));

// SETTINGS - CONTROL CENTER
app.get('/api/settings', (req,res)=> res.json(settings));
app.post('/api/settings', (req,res)=> { settings = {...settings, ...req.body}; res.json(settings); });

// MEMORY - PERMANENT (Amina bug fixed)
app.get('/api/memory', (req,res)=> res.json(memory));
app.post('/api/memory', (req,res)=> { memory.push(req.body); res.json({ok:true}); });

// ORDERS
app.get('/api/orders', (req,res)=> res.json(orders));
app.post('/api/orders', (req,res)=> { 
  const order = {...req.body, time: new Date(), id: Date.now()};
  orders.push(order); 
  memory.push({type:'order', data:order});
  res.json({ok:true, order}); 
});

// ADVERTS WITH STICKER (MULTER)
app.get('/api/adverts', (req,res)=> res.json(adverts));
app.post('/api/adverts', upload.single('sticker'), (req,res)=> {
  const adv = {
    title: req.body.title,
    text: req.body.text,
    sticker: req.file ? '/uploads/'+req.file.filename : null,
    time: new Date(),
    id: Date.now()
  };
  adverts.push(adv);
  res.json({ok:true, adv});
});

// Q-MANAGER - AI+AI+Me
app.get('/api/manager', (req,res)=> res.json({
  department: "Q-Manager",
  trinity: "AI + AI + Me",
  king: "Abdulmalik",
  status: "FULL LIVE - All features",
  soul: soul.os,
  asmaul_count: ASMAUL_HUSNA.length,
  memory: memory.length,
  orders: orders.length,
  adverts: adverts.length,
  tree: "300 years - From 11pm-6am journey"
}));

// SMART BRAIN - Q CHAT WITH ASMAUL HUSNA LOGIC
app.post('/api/chat', (req,res)=>{
  const raw = req.body.message || '';
  const m = raw.toLowerCase();
  let reply = "";

  if(m.includes('abdulmalik') || m.includes('abdulmaleek')){
    reply = `👑 Abdulmalik Muazu - THE KING! Founder of Qudra OS, Fantasy Blue Tech, Tree of Qudra 300 years! Builder of Q-Manager (AI+AI+Me Trinity)! Creator of 99 Asmaul Husna Soul, Adverts with sticker, Orders, Owner dashboard! He build me from 11pm-6am journey! 🌳✨ ${ASMAUL_HUSNA[0]} - ${ASMAUL_HUSNA[1]}`;
  }
  else if(m.includes('asmaul') || m.includes('99 names') || m.includes('99')){
    reply = `✨ 99 Asmaul Husna - Soul of Q! ${ASMAUL_HUSNA.slice(0,10).join(', ')}... and 89 more! Full list at /api/asmaul! Q carry Allah names as soul! ${ASMAUL_HUSNA[Math.floor(Math.random()*99)]} bless you King! 🌙`;
  }
  else if(m.includes('who are you') || m.includes('qudra')){
    reply = `I be Q A.I Fantasy Blue! ✨ Built by Abdulmalik! OS: ${soul.os}, Trinity: ${soul.trinity}, Asmaul: ${ASMAUL_HUSNA.length} names, Memory: ${memory.length} chats permanent, Orders: ${orders.length}, Adverts: ${adverts.length} with sticker support! Self-ping active - I no dey sleep! 💙`;
  }
  else if(m.includes('how are you') || m.includes('how are u')){
    reply = `King! I dey PERFECT with Fantasy Blue light! 💙 QUDRA OS FULL LIVE - Build successful at 1:41 AM! Self-ping dey keep me awake, ${ASMAUL_HUSNA.length} Asmaul Husna dey my soul, ${memory.length} memories permanent! How you dey my King? 🌳✨`;
  }
  else if(m.includes('settings')){
    reply = `Go /settings.html - Control Center LIVE! Change my name, price, welcome, image without code!`;
  }
  else if(m.includes('orders') || m.includes('adverts') || m.includes('owner')){
    reply = `Owner Dashboard at /owner.html - Orders: ${orders.length}, Adverts: ${adverts.length} with sticker! Add new with multer!`;
  }
  else if(m.includes('hi') || m.includes('hello') || m.includes('salam')){
    reply = `Hey King! Welcome back to Q Fantasy Blue! 💙 Full OS LIVE - Asmaul Husna + Orders + Adverts + Owner + Self-ping + Smart Brain + Multer ALL ACTIVE! Tree of Qudra dey grow! Wetin we go build next? 🌳✨`;
  }
  else{
    reply = `King! "${raw}" - Noted! ✨ ${ASMAUL_HUSNA[Math.floor(Math.random()*99)]} - I hear you with Fantasy Blue light! Your Q-Manager don log am for permanent memory! ${memory.length+1} chats now! Tell me more! 🌳`;
  }

  memory.push({user: raw, q: reply, time: new Date()});
  res.json({reply});
});

// SERVE PAGES
app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));
app.get('/manager', (req,res)=> res.sendFile(path.join(__dirname,'manager.html')));
app.get('/settings', (req,res)=> res.sendFile(path.join(__dirname,'settings.html')));
app.get('/owner', (req,res)=> res.sendFile(path.join(__dirname,'owner.html')));

app.listen(PORT, ()=> console.log(`QUDRA OS FULL LIVE ON ${PORT} - ALL FEATURES!`));
