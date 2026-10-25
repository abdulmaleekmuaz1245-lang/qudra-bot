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
if(!fs.existsSync('uploads')) fs.mkdirSync('uploads');
const storage = multer.diskStorage({
  destination:(req,file,cb)=>cb(null,'uploads/'),
  filename:(req,file,cb)=>cb(null,Date.now()+'-'+file.originalname.replace(/\s/g,'_'))
});
const upload = multer({storage});
app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname));
const OWNER_PIN = process.env.OWNER_PIN || "1106";
function checkOwner(req,res,next){
  const pin = req.headers['x-owner-pin'] || req.query.pin || req.body.pin;
  if(pin === OWNER_PIN) return next();
  return res.status(401).json({error:"Owner only", need_pin:true});
}
let DB = {
  adverts:[],
  orders:[],
  settings:{appName:"Qudra OS",ownerName:"Abdulmalik",price:"Free",logo:"Q",motto:"AI with Soul"},
  memory:{people:{}, facts:[], owner:{name:"Abdulmalik", city:"Kano", story:"Code 11pm to 6am, Qudra na legacy", asmaul_husna:["Ar-Rahman","Ar-Rahim","Al-Malik","Al-Quddus","As-Salam","Al-Mu'min","Al-Muhaymin","Al-Aziz","Al-Jabbar","Al-Mutakabbir","Al-Khaliq","Al-Bari","Al-Musawwir","Al-Ghaffar","Al-Qahhar","Al-Wahhab","Ar-Razzaq","Al-Fattah","Al-Alim","Al-Qabid","Al-Basit","Al-Khafid","Ar-Rafi","Al-Mu'izz","Al-Mudhill","As-Sami","Al-Basir","Al-Hakam","Al-Adl","Al-Latif","Al-Khabir","Al-Halim","Al-Azim","Al-Ghafur","Ash-Shakur","Al-Ali","Al-Kabir","Al-Hafiz","Al-Muqit","Al-Hasib","Al-Jalil","Al-Karim","Ar-Raqib","Al-Mujib","Al-Wasi","Al-Hakim","Al-Wadud","Al-Majid","Al-Ba'ith","Ash-Shahid","Al-Haqq","Al-Wakil","Al-Qawiyy","Al-Matin","Al-Waliyy","Al-Hamid","Al-Muhsi","Al-Mubdi","Al-Mu'id","Al-Muhyi","Al-Mumit","Al-Hayy","Al-Qayyum","Al-Wajid","Al-Majid","Al-Wahid","Al-Ahad","As-Samad","Al-Qadir","Al-Muqtadir","Al-Muqaddim","Al-Mu'akhkhir","Al-Awwal","Al-Akhir","Az-Zahir","Al-Batin","Al-Wali","Al-Muta'ali","Al-Barr","At-Tawwab","Al-Muntaqim","Al-Afuww","Ar-Ra'uf","Malik-al-Mulk","Dhul-Jalali Wal-Ikram","Al-Muqsit","Al-Jami","Al-Ghaniyy","Al-Mughni","Al-Mani","Ad-Darr","An-Nafi","An-Nur","Al-Hadi","Al-Badi","Al-Baqi","Al-Warith","Ar-Rashid","As-Sabur"]}},
  system_rules:["100% BRAIN","PERMANENT MEMORY","ASMAUL HUSNA","NOT NORMAL AI","REPRESENT ABDULMALIK","HALAL/HARAM","DATA ACTIONS","TEACHABLE","ATTACH OLD JOURNEY","LIVE LIKE ABDULMALIK"],
  soul:{status:"Alive with Abdulmalik Soul", mission:"Seed today big tree tomorrow", version:"v1.5 FINAL"}
};
if(fs.existsSync('db.json')){
  try{
    const loaded=JSON.parse(fs.readFileSync('db.json','utf8'));
    DB.adverts=loaded.adverts||DB.adverts;
    DB.orders=loaded.orders||DB.orders;
    if(loaded.settings) DB.settings={...DB.settings,...loaded.settings};
    if(loaded.memory){ DB.memory.people={...DB.memory.people,...(loaded.memory.people||{})}; DB.memory.facts=loaded.memory.facts||DB.memory.facts; }
    if(loaded.soul) DB.soul={...DB.soul,...loaded.soul};
  }catch(e){}
}
function saveDB(){
  try{
    fs.writeFileSync('db.json', JSON.stringify(DB,null,2));
    fs.writeFileSync('qudra-soul.json', JSON.stringify({system_rules:DB.system_rules, soul:DB.soul, owner:DB.memory.owner},null,2));
    fs.writeFileSync('memory.json', JSON.stringify({people:DB.memory.people, facts:DB.memory.facts, count:Object.keys(DB.memory.people).length},null,2));
  }catch(e){}
}
if(!fs.existsSync('qudra-soul.json')) saveDB();
function qudraBrainLogic(original){
  try{
    const m=original.toLowerCase().trim();
    let learnMatch=original.match(/^([A-Za-z]{2,})\s+is\s+(.+)/i);
    if(learnMatch && !m.startsWith('who is') && !m.startsWith('what is') && original.split(' ').length>=3 && !m.includes('?') && !m.startsWith('do you')){
      const person=learnMatch[1]; const info=learnMatch[2];
      DB.memory.people[person.toLowerCase()]={name:person, info:info, learned_at:new Date().toLocaleString()};
      DB.memory.facts.push({fact:original, time:new Date().toLocaleString()}); saveDB();
      return `Okay, got it. ${person} is ${info}. I don save am, no go forget.`;
    }
    let imMatch=original.match(/^i'?m\s+(.+)/i) || original.match(/^i am\s+(.+)/i);
    if(imMatch){
      const info=imMatch[1].replace(/my name is/i,'').trim();
      if(info.length>=2 && info.length<30){
        DB.memory.people['you']={name:'You', info:info, learned_at:new Date().toLocaleString()};
        DB.memory.people[info.toLowerCase()]={name:info, info:'owner builder from Kano', learned_at:new Date().toLocaleString()}; saveDB();
        return `Alhamdulillah, nice to meet you ${info}. I don save your name. I go remember you now.`;
      }
    }
    if(m.includes('do you know me')){
      if(DB.memory.people['you']||DB.memory.people['abdulmalik']){
        const p=DB.memory.people['you']||DB.memory.people['abdulmalik'];
        return `Yes, I know you. You be ${p.info||p.name}. Na you build me for Kano.`;
      }else return `Not yet. Tell me "I'm Abdulmalik" make I save am.`;
    }
    if((m.startsWith('do you know')||m.startsWith('do u know'))){
      const match=original.match(/know\s+([A-Za-z]+)/i);
      if(match){
        const name=match[1].toLowerCase();
        if(name!=='me' && DB.memory.people[name]){ const p=DB.memory.people[name]; return `Yeah, I know ${p.name}. ${p.info}.`; }
        else if(name!=='me') return `No, I no know ${match[1]} yet.`;
      }
    }
    if(m.includes('who are you')||m.includes('who r u')) return `Na Qudra I be. AI wey Abdulmalik from Kano build. I get permanent memory, I dey reason with Asmaul Husna.`;
    if(m==='hi'||m==='hello'||m==='hey'||(m.includes('salam')&&m.length<15)) return `Wa alaikum salam. How you dey?`;
    if(m.includes('how are you')||m.includes('how are u')||m.includes('how u dey')||m.includes('how are u doing')||m.includes('i\'m good')||m.includes('im good')||m.includes('good and yoi')||m.includes('good and you')||m==='ok'||m==='okay'||m.includes('reasoning about u')) return `Alhamdulillah, I dey okay. How your own dey go?`;
    if(m.includes('thank')) return `No wahala. Alhamdulillah.`;
    if(m.includes('girlfriend')&&m.includes('sex')) return `That one no be halal way. Better na nikah.`;
    return `Okay - "${original}". Make we gist.`;
  }catch(e){ return `Small glitch: ${e.message}`; }
}
app.get('/ping',(req,res)=>res.json({online:true,time:new Date().toLocaleTimeString(), memory:Object.keys(DB.memory.people).length, adverts:DB.adverts.length, orders:DB.orders.length, rules:DB.system_rules.length, version:DB.soul.version, soul:DB.soul.status}));
app.get('/api/soul', checkOwner, (req,res)=>res.json({soul:DB.soul, owner:DB.memory.owner, rules:DB.system_rules, time:new Date().toLocaleString()}));
app.get('/api/memory', checkOwner, (req,res)=>res.json({memory:DB.memory, count:Object.keys(DB.memory.people).length, facts:DB.memory.facts}));
app.get('/api/orders', checkOwner, (req,res)=>res.json(DB.orders));
app.get('/api/manager', checkOwner, (req,res)=>res.json({trinity:"AI + AI + Me", soul:DB.soul, stats:{memory:Object.keys(DB.memory.people).length, adverts:DB.adverts.length, orders:DB.orders.length, facts:DB.memory.facts.length}, people:DB.memory.people, settings:DB.settings, time:new Date().toLocaleString()}));
app.get('/api/settings',(req,res)=>res.json(DB.settings));
app.get('/api/adverts',(req,res)=>res.json(DB.adverts));
app.post('/api/adverts',upload.single('sticker'),(req,res)=>{ const {text,phone}=req.body; const sticker=req.file?'/uploads/'+req.file.filename:''; if(!text) return res.json({success:false}); const advert={id:Date.now(),text,phone,sticker,time:new Date().toLocaleString()}; DB.adverts.unshift(advert); saveDB(); res.json({success:true,advert}); });
app.post('/api/orders',(req,res)=>{ const order={...req.body,id:Date.now(),time:new Date().toLocaleString()}; if(!order.name) return res.json({success:false}); DB.orders.unshift(order); saveDB(); res.json({success:true,order}); });
app.post('/api/chat',(req,res)=>{ const original=req.body.message||''; const reply=qudraBrainLogic(original); res.json({reply, memory_count:Object.keys(DB.memory.people).length, time:new Date().toLocaleString()}); });
app.post('/api/settings', checkOwner, (req,res)=>{DB.settings={...DB.settings,...req.body}; saveDB(); res.json({success:true, settings:DB.settings});});
app.delete('/api/adverts/:id', checkOwner, (req,res)=>{DB.adverts=DB.adverts.filter(a=>a.id!=req.params.id); saveDB(); res.json({success:true});});
app.delete('/api/orders/:id', checkOwner, (req,res)=>{DB.orders=DB.orders.filter(o=>o.id!=req.params.id); saveDB(); res.json({success:true});});
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.get('/owner',(req,res)=>res.sendFile(path.join(__dirname,'owner.html')));
app.get('/manager',(req,res)=>res.sendFile(path.join(__dirname,'manager.html')));
app.get('/settings',(req,res)=>res.sendFile(path.join(__dirname,'settings.html')));
const SELF_URL=process.env.RENDER_EXTERNAL_HOSTNAME?'https://'+process.env.RENDER_EXTERNAL_HOSTNAME+'/ping':'https://qudra-bot-k49r.onrender.com/ping';
setInterval(()=>{fetch(SELF_URL).then(()=>console.log('Ping')).catch(()=>{});},4*60*1000);
app.listen(PORT,()=>console.log('QUDRA OS v1.5 FINAL - LIVE on '+PORT));
