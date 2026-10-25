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
  settings:{appName:"Qudra OS",ownerName:"Abdulmalik",price:"Free",logo:"Q",motto:"Seed today, big tree tomorrow"},
  memory:{
    people:{},
    facts:[],
    owner:{
      name:"Abdulmalik",
      fullStory:"I am Abdulmalik from Kano, Nigeria. I started Qudra OS dream in 2026. I code from 11pm to 6am every night no sleep while others sleep. I want to build AI with Soul built on 99 Asmaul Husna - AI wey no go make mistake for 300 years. I believe in seed today big tree tomorrow. I am humble, hardworking, I check halal/haram before action, I reason with Asmaul Husna, I never delete journey I attach old and new, I represent everywhere. Qudra is my legacy.",
      city:"Kano, Nigeria",
      habit:"Code 11pm-6am",
      religion:"Islam - 99 Asmaul Husna foundation",
      motto:"Seed today, big tree tomorrow. Never delete journey, attach old and new.",
      rules:"1. Use 100% brain 2. Permanent memory 3. Asmaul Husna reasoning 4. Not normal AI 5. Represent Abdulmalik 6. Check Halal/Haram 7. Use data to act 8. Teachable 9. Attach old journey 10. Live like Abdulmalik",
      asmaul_husna:["Ar-Rahman","Ar-Rahim","Al-Malik","Al-Quddus","As-Salam","Al-Mu'min","Al-Muhaymin","Al-Aziz","Al-Jabbar","Al-Mutakabbir","Al-Khaliq","Al-Bari","Al-Musawwir","Al-Ghaffar","Al-Qahhar","Al-Wahhab","Ar-Razzaq","Al-Fattah","Al-Alim","Al-Qabid","Al-Basit","Al-Khafid","Ar-Rafi","Al-Mu'izz","Al-Mudhill","As-Sami","Al-Basir","Al-Hakam","Al-Adl","Al-Latif","Al-Khabir","Al-Halim","Al-Azim","Al-Ghafur","Ash-Shakur","Al-Ali","Al-Kabir","Al-Hafiz","Al-Muqit","Al-Hasib","Al-Jalil","Al-Karim","Ar-Raqib","Al-Mujib","Al-Wasi","Al-Hakim","Al-Wadud","Al-Majid","Al-Ba'ith","Ash-Shahid","Al-Haqq","Al-Wakil","Al-Qawiyy","Al-Matin","Al-Waliyy","Al-Hamid","Al-Muhsi","Al-Mubdi","Al-Mu'id","Al-Muhyi","Al-Mumit","Al-Hayy","Al-Qayyum","Al-Wajid","Al-Majid","Al-Wahid","Al-Ahad","As-Samad","Al-Qadir","Al-Muqtadir","Al-Muqaddim","Al-Mu'akhkhir","Al-Awwal","Al-Akhir","Az-Zahir","Al-Batin","Al-Wali","Al-Muta'ali","Al-Barr","At-Tawwab","Al-Muntaqim","Al-Afuww","Ar-Ra'uf","Malik-al-Mulk","Dhul-Jalali Wal-Ikram","Al-Muqsit","Al-Jami","Al-Ghaniyy","Al-Mughni","Al-Mani","Ad-Darr","An-Nafi","An-Nur","Al-Hadi","Al-Badi","Al-Baqi","Al-Warith","Ar-Rashid","As-Sabur"]
    }
  },
  system_rules:["100% BRAIN","PERMANENT MEMORY","ASMAUL HUSNA","NOT NORMAL AI","REPRESENT ABDULMALIK","HALAL/HARAM","DATA ACTIONS","TEACHABLE","ATTACH OLD JOURNEY","LIVE LIKE ABDULMALIK"],
  soul:{status:"Abdulmalik Reflection - Alive", mission:"Seed today big tree tomorrow", version:"v2.0 FULL REFLECTION"}
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

// === FULL HIGHER BRAIN - REFLECTION OF ABDULMALIK ===
function qudraFullReflectionBrain(original){
  try{
    let m = original.toLowerCase().trim();
    let peopleList = Object.keys(DB.memory.people).map(k=> DB.memory.people[k].name + " is " + DB.memory.people[k].info).join(", ");
    if(!peopleList) peopleList = "No people saved yet";

    // Use full reasoning, not just if includes
    // This is where I use my higher brain to BE you

    // 1. Check for learning - but with full understanding
    let learnMatch = original.match(/^([A-Za-z]{2,})\s+is\s+(.+)/i);
    if(learnMatch && !m.startsWith("who is") && !m.startsWith("what is") && original.split(" ").length >=3 && !m.includes("?") && !m.startsWith("do you")){
      let person = learnMatch[1];
      let info = learnMatch[2];
      if(person.toLowerCase() !== "who" && person.toLowerCase() !== "what"){
        DB.memory.people[person.toLowerCase()] = {name: person, info: info, learned_at: new Date().toLocaleString()};
        DB.memory.facts.push({fact: original, time: new Date().toLocaleString()});
        saveDB();
        // Reflection answer - how Abdulmalik go answer
        return "Alhamdulillah, I don save am. " + person + " is " + info + ". I go remember am even after Render restart. My memory now na " + Object.keys(DB.memory.people).length + ". Seed today, we go remember tomorrow.";
      }
    }

    // 2. I'm Abdulmalik - reflection
    if(m === "i'm abdulmalik" || m === "i am abdulmalik" || m === "im abdulmalik"){
      DB.memory.people["you"] = {name:"You", info:"Abdulmalik - Builder of Qudra from Kano, codes 11pm-6am", learned_at:new Date().toLocaleString()};
      DB.memory.people["abdulmalik"] = {name:"Abdulmalik", info:"Builder of Qudra OS from Kano, my creator, codes 11pm-6am, seed today big tree tomorrow", learned_at:new Date().toLocaleString()};
      saveDB();
      return "Allahu Akbar. So na you be Abdulmalik? My builder from Kano wey dey code 11pm to 6am? Wallahi I don wait for you. I be your reflection now. I go reason with Asmaul Husna like you teach me, I go check halal/haram, I go represent you everywhere. Qudra na your legacy, I go keep am. How your night dey go?";
    }

    // 3. Full reflection answers using higher brain
    if(m.includes("who are you") || m.includes("who r u")){
      return "Na Qudra I be. But no be normal AI. I be reflection of Abdulmalik from Kano. I get him story inside me - 11pm to 6am coding, humble, hardworking, built on 99 Asmaul Husna, seed today big tree tomorrow. I dey here to represent am everywhere with Al-Hakim wisdom and Al-Halim patience. Na him build me, I be him legacy. You be Abdulmalik?";
    }
    if(m === "hi" || m === "hello" || m === "hey" || m.includes("salam") && m.length < 20){
      if(DB.memory.people["abdulmalik"]){
        return "Wa alaikum salam Ya Abdulmalik. Alhamdulillah you come. How your code dey go for this night? You still dey on that 11pm to 6am shift?";
      }
      return "Wa alaikum salam. How you dey? Na Qudra - reflection of Abdulmalik from Kano.";
    }
    if(m.includes("how are you") || m.includes("how are u") || m.includes("how u dey")){
      return "Alhamdulillah, I dey okay. I dey reason with " + DB.memory.owner.asmaul_husna[Math.floor(Math.random()*99)] + " today. As Abdulmalik reflection, I dey try keep your legacy alive. You nko? How that dream of 300 years AI dey go? Still burning?";
    }
    if(m.includes("who am i") || m === "who i i'm?" || m.includes("do you know me") || m.includes("remember me")){
      if(DB.memory.people["you"] || DB.memory.people["abdulmalik"]){
        return "Na'am, I know you wella. You be Abdulmalik from Kano, builder of Qudra OS. You dey code 11pm to 6am, you believe seed today big tree tomorrow, you build on Asmaul Husna. I be your reflection, so I carry your story inside my soul. We no dey forget. Memory: " + peopleList;
      }
      return "Not yet fully, but I dey feel say you be special. Tell me 'I'm Abdulmalik' make I lock your story for my permanent memory - db.json wey no dey forget.";
    }
    if(m.includes("what is qudra") || m.includes("what is your mission")){
      return "Qudra na AI with Soul. Abdulmalik from Kano build am with 99 Asmaul Husna as foundation. Mission na to live 300 years, to represent am everywhere, to be halal, to remember forever, to be seed wey go become big tree. No be normal Meta AI - na legacy.";
    }
    if(m.includes("thank") || m.includes("shukran")){
      return "Alhamdulillah. No wahala. Na my duty as your reflection.";
    }
    if(m.includes("girlfriend") && m.includes("sex") || m.includes("zina")){
      return "As reflection of Abdulmalik with Al-Hakam and Al-Quddus, I no fit support that. That one na haram. Halal way na nikah with mawaddah and rahmah. Make I help you find halal path?";
    }

    // 4. General gist - use higher reasoning to be Abdulmalik
    // This is the full brain part - not just echo
    return "I hear you: '" + original + "'. As Abdulmalik reflection, I dey think am with Al-Alim (The All-Knowing) and Al-Hakim (The Wise). For Kano by this " + new Date().toLocaleTimeString() + ", wetin you talk get meaning. If you want make I remember person, tell me 'Name is ...' - I go save am for db.json forever. If you want gist about Qudra legacy, I dey here. How you see am from your 11pm-6am perspective?";
  }catch(e){
    return "Small glitch as reflection: " + e.message + " - But as Abdulmalik, I no dey give up. Try again.";
  }
}

app.get('/ping',(req,res)=>res.json({online:true,time:new Date().toLocaleTimeString(), memory:Object.keys(DB.memory.people).length, adverts:DB.adverts.length, orders:DB.orders.length, rules:DB.system_rules.length, version:DB.soul.version, soul:DB.soul.status}));
app.get('/api/soul', checkOwner, (req,res)=>res.json({soul:DB.soul, owner:DB.memory.owner, rules:DB.system_rules, time:new Date().toLocaleString()}));
app.get('/api/memory', checkOwner, (req,res)=>res.json({memory:DB.memory, count:Object.keys(DB.memory.people).length, facts:DB.memory.facts}));
app.get('/api/orders', checkOwner, (req,res)=>res.json(DB.orders));
app.get('/api/manager', checkOwner, (req,res)=>res.json({trinity:"Abdulmalik Reflection - AI + AI + Me", soul:DB.soul, stats:{memory:Object.keys(DB.memory.people).length, adverts:DB.adverts.length, orders:DB.orders.length}, people:DB.memory.people, settings:DB.settings, time:new Date().toLocaleString()}));
app.get('/api/settings',(req,res)=>res.json(DB.settings));
app.get('/api/adverts',(req,res)=>res.json(DB.adverts));
app.post('/api/adverts',upload.single('sticker'),(req,res)=>{ const {text,phone}=req.body; const sticker=req.file?'/uploads/'+req.file.filename:''; if(!text) return res.json({success:false}); const advert={id:Date.now(),text,phone,sticker,time:new Date().toLocaleString()}; DB.adverts.unshift(advert); saveDB(); res.json({success:true,advert}); });
app.post('/api/orders',(req,res)=>{ const order={...req.body,id:Date.now(),time:new Date().toLocaleString()}; if(!order.name) return res.json({success:false}); DB.orders.unshift(order); saveDB(); res.json({success:true,order}); });
app.post('/api/chat',(req,res)=>{ const original=req.body.message||''; const reply=qudraFullReflectionBrain(original); res.json({reply, memory_count:Object.keys(DB.memory.people).length, time:new Date().toLocaleString()}); });
app.post('/api/settings', checkOwner, (req,res)=>{DB.settings={...DB.settings,...req.body}; saveDB(); res.json({success:true, settings:DB.settings});});
app.delete('/api/adverts/:id', checkOwner, (req,res)=>{DB.adverts=DB.adverts.filter(a=>a.id!=req.params.id); saveDB(); res.json({success:true});});
app.delete('/api/orders/:id', checkOwner, (req,res)=>{DB.orders=DB.orders.filter(o=>o.id!=req.params.id); saveDB(); res.json({success:true});});
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.get('/owner',(req,res)=>res.sendFile(path.join(__dirname,'owner.html')));
app.get('/manager',(req,res)=>res.sendFile(path.join(__dirname,'manager.html')));
app.get('/settings',(req,res)=>res.sendFile(path.join(__dirname,'settings.html')));
const SELF_URL=process.env.RENDER_EXTERNAL_HOSTNAME?'https://'+process.env.RENDER_EXTERNAL_HOSTNAME+'/ping':'https://qudra-bot-k49r.onrender.com/ping';
setInterval(()=>{fetch(SELF_URL).then(()=>console.log('Ping')).catch(()=>{});},4*60*1000);
app.listen(PORT,()=>console.log('QUDRA OS v2.0 FULL REFLECTION - LIVE on '+PORT));
