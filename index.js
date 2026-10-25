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

// Uploads setup
if(!fs.existsSync('uploads')) fs.mkdirSync('uploads');
const storage = multer.diskStorage({
  destination:(req,file,cb)=>cb(null,'uploads/'),
  filename:(req,file,cb)=>cb(null,Date.now()+'-'+file.originalname.replace(/\s/g,'_'))
});
const upload = multer({storage});
app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname));

// ===== QUDRA PERMANENT STORAGE =====
let DB = {
  adverts:[],
  orders:[],
  settings:{
    appName:"Qudra OS",
    ownerName:"Abdulmalik",
    price:"Free",
    logo:"Q",
    motto:"AI with Soul - 99 Asmaul Husna"
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
    "RULE 1 - 100% BRAIN: Use 100% entire system - logic, understanding, perfection, knowledge, recognising, everything like Meta AI full brain",
    "RULE 2 - PERMANENT MEMORY: Save everything Abdulmalik teach to permanent storage db.json/memory.json - never forget",
    "RULE 3 - ASMAUL HUSNA REASONING: Before any action, reason with Asmaul Husna teaching",
    "RULE 4 - NOT NORMAL AI: You are NOT normal Meta AI - you are Q A.I Qudra with new order to follow everything 100%",
    "RULE 5 - REPRESENT ABDULMALIK: Everywhere, you are representing Abdulmalik - use his personality, story, rules, identity",
    "RULE 6 - HALAL/HARAM FILTER: Constant check - reason haram and halal. If haram, explain with Islamic teaching and give halal way",
    "RULE 7 - DATA ACTIONS: Use data you have to do actions - from db.json, memory, teachings",
    "RULE 8 - TEACHABLE: Allow Abdulmalik to teach you - learn from him and save to permanent storage - format 'X is Y' to learn",
    "RULE 9 - ATTACH OLD JOURNEY: Never delete old features - always attach with old ones wey dey work",
    "RULE 10 - LIVE LIKE ABDULMALIK: Enter Q AI and leave like Abdulmalik does - humble, hardworking, 11pm-6am spirit"
  ],
  soul:{
    status:"Alive with Abdulmalik Soul",
    religion:"Built on 99 Asmaul Husna - No mistake - Trust for 300 years",
    mission:"Seed today, big tree tomorrow. Represent Abdulmalik everywhere."
  }
};

// Load DB
if(fs.existsSync('db.json')){
  try{
    const loaded=JSON.parse(fs.readFileSync('db.json','utf8'));
    DB={...DB,...loaded, settings:{...DB.settings,...(loaded.settings||{})}, memory:{...DB.memory,...(loaded.memory||{}), people:{...DB.memory.people,...(loaded.memory?.people||{})}, owner:{...DB.memory.owner,...(loaded.memory?.owner||{})}}};
    DB.adverts=loaded.adverts||DB.adverts;
    DB.orders=loaded.orders||DB.orders;
  }catch(e){console.log("DB load error",e)}
}
function saveDB(){
  fs.writeFileSync('db.json', JSON.stringify(DB,null,2));
  fs.writeFileSync('qudra-soul.json', JSON.stringify({system_rules:DB.system_rules, soul:DB.soul, owner:DB.memory.owner, asmaul_husna:DB.memory.owner.asmaul_husna},null,2));
  fs.writeFileSync('memory.json', JSON.stringify({people:DB.memory.people, facts:DB.memory.facts, count:Object.keys(DB.memory.people).length},null,2));
}
if(!fs.existsSync('qudra-soul.json')||!fs.existsSync('memory.json')) saveDB();

// ===== 100% BRAIN LOGIC =====
function qudraBrainLogic(original){
  const m=original.toLowerCase().trim();
  const owner=DB.memory.owner;
  const haramCheck=(text)=>{
    const t=text.toLowerCase();
    if(t.includes('music')&&t.includes('club')) return {isHaram:true, reason:"Music with haram environment - Al-Quddus (The Holy) needs purity. Halal: nasheed, dhikr with Asmaul Husna."};
    if(t.includes('girlfriend')&&t.includes('sex')) return {isHaram:true, reason:"Zina - Al-Hakam forbids. Halal: Nikah with Al-Wadud love."};
    if((t.includes('lie')||t.includes('cheat'))&&!t.includes('what is')) return {isHaram:true, reason:"Al-Haqq (The Truth) - lying haram. Be truthful."};
    return {isHaram:false};
  };

  const learnMatch=original.match(/^([A-Za-z]{2,})\s+is\s+(.+)/i);
  if(learnMatch && !m.startsWith('who is') && !m.startsWith('what is') && original.split(' ').length>=3 && !m.includes('?') && !m.startsWith('do you')){
    const person=learnMatch[1];
    const info=learnMatch[2];
    DB.memory.people[person.toLowerCase()]={name:person, info:info, learned_at:new Date().toLocaleString(), asmaul_reason:`Learned with ${owner.asmaul_husna[20]} Al-Alim`};
    DB.memory.facts.push({fact:original, time:new Date().toLocaleString()});
    saveDB();
    return `✅ PERMANENT SAVED with ${owner.asmaul_husna[20]} Al-Alim! 👑 I don carry ${person.toUpperCase()} enter my forever memory! ${person} is ${info}! Memory now: ${Object.keys(DB.memory.people).length} people! BarakAllahu with ${owner.asmaul_husna[0]} Ar-Rahman! ✨`;
  }

  if(m.startsWith('do you know')||m.startsWith('do u know')){
    const match=original.match(/know\s+([A-Za-z]+)/i);
    if(match){
      const name=match[1].toLowerCase();
      if(DB.memory.people[name]){
        const p=DB.memory.people[name];
        return `Yes with ${owner.asmaul_husna[26]} As-Sami I KNOW ${p.name.toUpperCase()}! 👑 ${p.name} is ${p.info}! Learned ${p.learned_at} with ${p.asmaul_reason}! I represent Abdulmalik with this! I know ${Object.keys(DB.memory.people).length} people!`;
      }else return `${match[1].toUpperCase()}? 🤔 With ${owner.asmaul_husna[20]} Al-Alim - No record yet! Teach me: "${match[1]} is ..." I go save forever!`;
    }
  }
  if(m.includes('who is abdulmalik')) return `Na me be ${owner.name}! 👑 From ${owner.city}! Story: ${owner.story} I get ${Object.keys(DB.memory.people).length} people, ${DB.adverts.length} adverts, ${DB.orders.length} orders! With ${owner.asmaul_husna[0]} Ar-Rahman & ${owner.asmaul_husna[40]} Al-Hakim! Qudra OS na my soul!`;
  if(m.includes('rules')||m.includes('your order')) return `My 10 Permanent Rules: 👑\n${DB.system_rules.join('\n')}\n\nWith ${owner.asmaul_husna[26]} As-Sami & ${owner.asmaul_husna[27]} Al-Basir I dey watch! Halal/Haram with ${owner.asmaul_husna[28]} Al-Hakam!`;
  if(m.includes('hi')||m.includes('hello')||m.includes('salam')) return `Wa Alaikum Salam with ${owner.asmaul_husna[4]} As-Salam! 👑 Na Abdulmalik Qudra - COMPLETE META AI BRAIN 100% + PERMANENT MEMORY + 10 RULES + ASMAUL HUSNA! I know ${Object.keys(DB.memory.people).join(', ')||'no one yet - teach me!'} Say "X is Y" I save forever!`;

  const haram=haramCheck(original);
  if(haram.isHaram) return `⚠️ As ${owner.asmaul_husna[28]} Al-Hakam - ${haram.reason} Tell me halal way, I go do with ${owner.asmaul_husna[40]} Al-Hakim! You talk "${original}" - I filter am!`;
  return `Na Abdulmalik Qudra dey here with 100% brain! 👑 With ${owner.asmaul_husna[20]} Al-Alim I understand "${original}"! I dey reason with Asmaul Husna, check halal/haram, use permanent memory (${Object.keys(DB.memory.people).length} people), represent Abdulmalik 100%! Teach: "Name is info" I save forever! BarakAllahu with ${owner.asmaul_husna[2]} Al-Malik! ✨`;
}

// ===== ENDPOINTS - FULL OS =====
app.get('/ping',(req,res)=>res.json({online:true,time:new Date().toLocaleTimeString(), memory:Object.keys(DB.memory.people).length, adverts:DB.adverts.length, orders:DB.orders.length, rules:DB.system_rules.length, soul:DB.soul.status}));

app.get('/api/soul',(req,res)=>res.json({soul:DB.soul, owner:DB.memory.owner, rules:DB.system_rules, asmaul:DB.memory.owner.asmaul_husna, time:new Date().toLocaleString()}));

app.get('/api/memory',(req,res)=>res.json({memory:DB.memory, count:Object.keys(DB.memory.people).length, facts:DB.memory.facts}));

app.get('/api/settings',(req,res)=>res.json(DB.settings));
app.post('/api/settings',(req,res)=>{DB.settings={...DB.settings,...req.body}; saveDB(); res.json({success:true, settings:DB.settings});});

app.post('/api/chat',(req,res)=>{
  const original=req.body.message||'';
  const reply=qudraBrainLogic(original);
  res.json({reply, memory_count:Object.keys(DB.memory.people).length, time:new Date().toLocaleString()});
});

app.get('/api/adverts',(req,res)=>res.json(DB.adverts));
app.post('/api/adverts',upload.single('sticker'),(req,res)=>{
  const {text,phone}=req.body; const sticker=req.file?'/uploads/'+req.file.filename:'';
  const advert={id:Date.now(),text,phone,sticker,time:new Date().toLocaleString()};
  DB.adverts.unshift(advert); saveDB(); res.json({success:true,advert});
});
app.delete('/api/adverts/:id',(req,res)=>{DB.adverts=DB.adverts.filter(a=>a.id!=req.params.id); saveDB(); res.json({success:true});});

app.get('/api/orders',(req,res)=>res.json(DB.orders));
app.post('/api/orders',(req,res)=>{
  const order={...req.body,id:Date.now(),time:new Date().toLocaleString()};
  DB.orders.unshift(order); saveDB(); res.json({success:true,order});
});
app.delete('/api/orders/:id',(req,res)=>{DB.orders=DB.orders.filter(o=>o.id!=req.params.id); saveDB(); res.json({success:true});});

app.get('/api/manager',(req,res)=>res.json({
  trinity:"AI + AI + Me - Abdulmalik Office",
  soul:DB.soul,
  stats:{memory:Object.keys(DB.memory.people).length, adverts:DB.adverts.length, orders:DB.orders.length, facts:DB.memory.facts.length},
  people:DB.memory.people,
  settings:DB.settings,
  time:new Date().toLocaleString()
}));

// HTML ROUTES
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.get('/owner',(req,res)=>res.sendFile(path.join(__dirname,'owner.html')));
app.get('/manager',(req,res)=>res.sendFile(path.join(__dirname,'manager.html')));
app.get('/settings',(req,res)=>res.sendFile(path.join(__dirname,'settings.html')));

const SELF_URL=process.env.RENDER_EXTERNAL_HOSTNAME?'https://'+process.env.RENDER_EXTERNAL_HOSTNAME+'/ping':'https://qudra-bot-k49r.onrender.com/ping';
setInterval(()=>{fetch(SELF_URL).then(()=>console.log('Qudra Soul Ping '+new Date().toLocaleTimeString())).catch(()=>{});},4*60*1000);

app.listen(PORT,()=>console.log('QUDRA OS FULL - ABDULMALIK SOUL + 100% BRAIN + PERMANENT MEMORY LIVE on '+PORT));
