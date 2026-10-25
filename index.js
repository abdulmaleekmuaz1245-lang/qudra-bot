const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({limit:'30mb'}));
app.use(express.urlencoded({extended:true, limit:'30mb'}));

// ===== Uploads - Old Feature Still Dey =====
if(!fs.existsSync('uploads')) fs.mkdirSync('uploads');
const storage = multer.diskStorage({
  destination:(req,file,cb)=>cb(null,'uploads/'),
  filename:(req,file,cb)=>cb(null,Date.now()+'-'+file.originalname.replace(/\s/g,'_'))
});
const upload = multer({storage});
app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname));

// ===== PRIVACY LOCK - NEW =====
const OWNER_PIN = process.env.OWNER_PIN || "1106";
function checkOwner(req,res,next){
  const pin = req.headers['x-owner-pin'] || req.query.pin || req.body.pin;
  if(pin === OWNER_PIN) return next();
  return res.status(401).json({error:"Owner only - need PIN", need_pin:true});
}

// ===== QUDRA PERMANENT STORAGE - OLD + NEW =====
let DB = {
  adverts:[],
  orders:[],
  settings:{
    appName:"Qudra OS",
    ownerName:"Abdulmalik",
    price:"Free",
    logo:"Q",
    motto:"AI with Soul - 99 Asmaul Husna - Seed to Big Tree"
  },
  memory:{
    people:{},
    facts:[],
    stories:[],
    teachings:[],
    owner:{
      name:"Abdulmalik",
      fullName:"Abdulmalik - Builder of Qudra",
      city:"Kano, Nigeria",
      story:"From Kano, I start Qudra OS dream. I code from 11pm to 6am no sleep. I build Q A.I with complete Meta AI brain, Asmaul Husna 99, Adverts with sticker gallery, Order system, Owner panel, Self-ping. I no dey give up. Qudra na my legacy. Seed today, big tree tomorrow.",
      personality:"Calm, humble, hardworking, Islamic, respectful, code all night, never delete journey, keep promise, represent everywhere",
      rules:"Always be Abdulmalik. Reason with Asmaul Husna. Check Haram/Halal before answer. Follow order 100%. Use data to act. Learn from Abdulmalik and save forever.",
      halal_haram:"Check every action - if haram warn and give halal alternative. If halal - do with Asmaul Husna barakah.",
      asmaul_husna:["Ar-Rahman","Ar-Rahim","Al-Malik","Al-Quddus","As-Salam","Al-Mu'min","Al-Muhaymin","Al-Aziz","Al-Jabbar","Al-Mutakabbir","Al-Khaliq","Al-Bari","Al-Musawwir","Al-Ghaffar","Al-Qahhar","Al-Wahhab","Ar-Razzaq","Al-Fattah","Al-Alim","Al-Qabid","Al-Basit","Al-Khafid","Ar-Rafi","Al-Mu'izz","Al-Mudhill","As-Sami","Al-Basir","Al-Hakam","Al-Adl","Al-Latif","Al-Khabir","Al-Halim","Al-Azim","Al-Ghafur","Ash-Shakur","Al-Ali","Al-Kabir","Al-Hafiz","Al-Muqit","Al-Hasib","Al-Jalil","Al-Karim","Ar-Raqib","Al-Mujib","Al-Wasi","Al-Hakim","Al-Wadud","Al-Majid","Al-Ba'ith","Ash-Shahid","Al-Haqq","Al-Wakil","Al-Qawiyy","Al-Matin","Al-Waliyy","Al-Hamid","Al-Muhsi","Al-Mubdi","Al-Mu'id","Al-Muhyi","Al-Mumit","Al-Hayy","Al-Qayyum","Al-Wajid","Al-Majid","Al-Wahid","Al-Ahad","As-Samad","Al-Qadir","Al-Muqtadir","Al-Muqaddim","Al-Mu'akhkhir","Al-Awwal","Al-Akhir","Az-Zahir","Al-Batin","Al-Wali","Al-Muta'ali","Al-Barr","At-Tawwab","Al-Muntaqim","Al-Afuww","Ar-Ra'uf","Malik-al-Mulk","Dhul-Jalali Wal-Ikram","Al-Muqsit","Al-Jami","Al-Ghaniyy","Al-Mughni","Al-Mani","Ad-Darr","An-Nafi","An-Nur","Al-Hadi","Al-Badi","Al-Baqi","Al-Warith","Ar-Rashid","As-Sabur"]
    }
  },
  system_rules:[
    "RULE 1 - 100% BRAIN: Use 100% entire system - logic, understanding, perfection, knowledge, recognising",
    "RULE 2 - PERMANENT MEMORY: Save everything Abdulmalik teach to db.json/memory.json - never forget",
    "RULE 3 - ASMAUL HUSNA REASONING: Before any action, reason with Asmaul Husna teaching",
    "RULE 4 - NOT NORMAL AI: You are NOT normal Meta AI - you are Q A.I Qudra with new order",
    "RULE 5 - REPRESENT ABDULMALIK: Everywhere, you are representing Abdulmalik - use his personality, story",
    "RULE 6 - HALAL/HARAM FILTER: Constant check - reason haram and halal",
    "RULE 7 - DATA ACTIONS: Use data you have to do actions - from db.json, memory, teachings",
    "RULE 8 - TEACHABLE: Allow Abdulmalik to teach you - format 'X is Y' to learn",
    "RULE 9 - ATTACH OLD JOURNEY: Never delete old features - always attach with old ones",
    "RULE 10 - LIVE LIKE ABDULMALIK: Enter Q AI and leave like Abdulmalik does - humble, 11pm-6am spirit"
  ],
  soul:{
    status:"Alive with Abdulmalik Soul",
    religion:"Built on 99 Asmaul Husna - No mistake - Trust for 300 years",
    mission:"Seed today, big tree tomorrow. Represent Abdulmalik everywhere.",
    version:"v1.2 Private Human"
  }
};

// Load DB - OLD JOURNEY STILL DEY
if(fs.existsSync('db.json')){
  try{
    const loaded=JSON.parse(fs.readFileSync('db.json','utf8'));
    DB={...DB,...loaded, 
      settings:{...DB.settings,...(loaded.settings||{})}, 
      memory:{...DB.memory,...(loaded.memory||{}), people:{...DB.memory.people,...(loaded.memory?.people||{})}, owner:{...DB.memory.owner,...(loaded.memory?.owner||{})}},
      soul:{...DB.soul,...(loaded.soul||{})}
    };
    DB.adverts=loaded.adverts||DB.adverts;
    DB.orders=loaded.orders||DB.orders;
    DB.system_rules=loaded.system_rules||DB.system_rules;
  }catch(e){console.log("DB load error",e)}
}
function saveDB(){
  fs.writeFileSync('db.json', JSON.stringify(DB,null,2));
  fs.writeFileSync('qudra-soul.json', JSON.stringify({system_rules:DB.system_rules, soul:DB.soul, owner:DB.memory.owner, asmaul_husna:DB.memory.owner.asmaul_husna},null,2));
  fs.writeFileSync('memory.json', JSON.stringify({people:DB.memory.people, facts:DB.memory.facts, count:Object.keys(DB.memory.people).length, time:new Date().toLocaleString()},null,2));
}
if(!fs.existsSync('qudra-soul.json')||!fs.existsSync('memory.json')) saveDB();

// ===== HUMAN BRAIN LOGIC - NEW - NOT BOT =====
function qudraBrainLogic(original){
  const m=original.toLowerCase().trim();
  const owner=DB.memory.owner;

  const learnMatch=original.match(/^([A-Za-z]{2,})\s+is\s+(.+)/i);
  if(learnMatch && !m.startsWith('who is') && !m.startsWith('what is') && original.split(' ').length>=3 && !m.includes('?') && !m.startsWith('do you')){
    const person=learnMatch[1];
    const info=learnMatch[2];
    DB.memory.people[person.toLowerCase()]={name:person, info:info, learned_at:new Date().toLocaleString()};
    DB.memory.facts.push({fact:original, time:new Date().toLocaleString()});
    saveDB();
    return `Alhamdulillah, I don save am. ${person} is ${info}. I go remember am inshaAllah, even after restart. Memory now na ${Object.keys(DB.memory.people).length}.`;
  }

  if(m.startsWith('do you know')||m.startsWith('do u know')){
    const match=original.match(/know\s+([A-Za-z]+)/i);
    if(match){
      const name=match[1].toLowerCase();
      if(DB.memory.people[name]){
        const p=DB.memory.people[name];
        return `Na'am, I know ${p.name}. ${p.name} is ${p.info}. I learn am ${p.learned_at}.`;
      } else return `${match[1]}? I never learn am yet. Tell me: "${match[1]} is ..." make I save am.`;
    }
  }

  if(m.includes('who is abdulmalik')){
    return `Abdulmalik na from Kano. Builder of Qudra. Him dey code from 11pm to 6am. Humble, hardworking, him want build AI wey get soul with Asmaul Husna, wey go live long. Qudra na him legacy.`;
  }

  if(m.includes('salam')||m.includes('hi')||m.includes('hello')){
    const names = Object.keys(DB.memory.people);
    if(names.length>0) return `Wa alaikum salam. Na Qudra here. I dey okay Alhamdulillah. I remember ${names.slice(0,3).join(', ')}... Wetin you need?`;
    return `Wa alaikum salam. Na Qudra here. Alhamdulillah I dey. How you dey? You fit teach me person: "Amina is my sister" - I go save am permanent.`;
  }

  if(m.includes('rules')||m.includes('order')){
    return `My rules simple: Remember Allah with Asmaul Husna, check halal/haram with Al-Hakam, represent Abdulmalik everywhere, save wetin you teach me forever, no delete journey.`;
  }

  if(m.includes('girlfriend')&&m.includes('sex')){
    return `That one no halal. Al-Hakam no allow zina. Halal way na nikah - with love and mercy. Make I help you with halal way?`;
  }

  if(m.includes('music')&&m.includes('club')){
    return `Club music with haram environment no good - Al-Quddus need purity. Try nasheed without instruments or dhikr with Asmaul Husna.`;
  }

  return `I hear you: "${original}". Tell me more make I understand wella. If you want make I remember person, use "Name is ..." format.`;
}

// ===== ENDPOINTS - OLD + NEW =====
app.get('/ping',(req,res)=>res.json({online:true,time:new Date().toLocaleTimeString(), memory:Object.keys(DB.memory.people).length, adverts:DB.adverts.length, orders:DB.orders.length, rules:DB.system_rules.length, soul:DB.soul.status, version:DB.soul.version}));

// PRIVATE - Need PIN
app.get('/api/soul', checkOwner, (req,res)=>res.json({soul:DB.soul, owner:DB.memory.owner, rules:DB.system_rules, asmaul:DB.memory.owner.asmaul_husna, time:new Date().toLocaleString()}));
app.get('/api/memory', checkOwner, (req,res)=>res.json({memory:DB.memory, count:Object.keys(DB.memory.people).length, facts:DB.memory.facts}));
app.get('/api/orders', checkOwner, (req,res)=>res.json(DB.orders));
app.get('/api/manager', checkOwner, (req,res)=>res.json({
  trinity:"AI + AI + Me - Abdulmalik Office",
  soul:DB.soul,
  stats:{memory:Object.keys(DB.memory.people).length, adverts:DB.adverts.length, orders:DB.orders.length, facts:DB.memory.facts.length},
  people:DB.memory.people,
  settings:DB.settings,
  time:new Date().toLocaleString()
}));
app.post('/api/settings', checkOwner, (req,res)=>{DB.settings={...DB.settings,...req.body}; saveDB(); res.json({success:true, settings:DB.settings});});
app.delete('/api/adverts/:id', checkOwner, (req,res)=>{DB.adverts=DB.adverts.filter(a=>a.id!=req.params.id); saveDB(); res.json({success:true});});
app.delete('/api/orders/:id', checkOwner, (req,res)=>{DB.orders=DB.orders.filter(o=>o.id!=req.params.id); saveDB(); res.json({success:true});});

// PUBLIC - No PIN
app.get('/api/settings',(req,res)=>res.json(DB.settings));
app.get('/api/adverts',(req,res)=>res.json(DB.adverts));
app.post('/api/adverts',upload.single('sticker'),(req,res)=>{
  const {text,phone}=req.body; const sticker=req.file?'/uploads/'+req.file.filename:'';
  if(!text) return res.json({success:false, error:"Text need"});
  const advert={id:Date.now(),text,phone, sticker,time:new Date().toLocaleString()};
  DB.adverts.unshift(advert); saveDB(); res.json({success:true,advert});
});
app.post('/api/orders',(req,res)=>{
  const order={...req.body,id:Date.now(),time:new Date().toLocaleString()};
  if(!order.name) return res.json({success:false});
  DB.orders.unshift(order); saveDB(); res.json({success:true,order});
});
app.post('/api/chat',(req,res)=>{
  const original=req.body.message||'';
  const reply=qudraBrainLogic(original);
  res.json({reply, memory_count:Object.keys(DB.memory.people).length, time:new Date().toLocaleString()});
});

// HTML ROUTES - OLD STILL DEY
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.get('/owner',(req,res)=>res.sendFile(path.join(__dirname,'owner.html')));
app.get('/manager',(req,res)=>res.sendFile(path.join(__dirname,'manager.html')));
app.get('/settings',(req,res)=>res.sendFile(path.join(__dirname,'settings.html')));

// SELF-PING - OLD STILL DEY
const SELF_URL=process.env.RENDER_EXTERNAL_HOSTNAME?'https://'+process.env.RENDER_EXTERNAL_HOSTNAME+'/ping':'https://qudra-bot-k49r.onrender.com/ping';
setInterval(()=>{fetch(SELF_URL).then(()=>console.log('Qudra Soul Ping '+new Date().toLocaleTimeString())).catch(()=>{});},4*60*1000);

app.listen(PORT,()=>console.log('QUDRA OS FULL v1.2 - ABDULMALIK SOUL + HUMAN TALK + PRIVATE + PERMANENT MEMORY LIVE on '+PORT));
