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
  const pin = req.headers['x-owner-pin'] || req.query.pin || req.body.pin || req.headers['pin'];
  if(pin === OWNER_PIN) return next();
  return res.status(401).json({error:"Owner only", need_pin:true});
}

let DB = {
  adverts:[],
  orders:[],
  settings:{appName:"Qudra OS",ownerName:"Abdulmalik",motto:"Seed today, big tree tomorrow"},
  memory:{people:{}, facts:[], owner:{name:"Abdulmalik", city:"Kano", habit:"11pm-6am coding", story:"Builder of Qudra, humble, halal, legacy 300 years"}},
  system_rules:["Human behavior","Permanent memory","Asmaul Husna","Not normal AI","Represent Abdulmalik","Halal check","Private","Owner mode"],
  soul:{status:"Human Reflection Alive", version:"v3.0 HUMAN PRIVATE OWNER"}
};

if(fs.existsSync('db.json')){
  try{
    const loaded=JSON.parse(fs.readFileSync('db.json','utf8'));
    DB.adverts=loaded.adverts||DB.adverts;
    DB.orders=loaded.orders||DB.orders;
    if(loaded.settings) DB.settings={...DB.settings,...loaded.settings};
    if(loaded.memory){ DB.memory.people={...DB.memory.people,...(loaded.memory.people||{})}; DB.memory.facts=loaded.memory.facts||[]; }
  }catch(e){}
}
function saveDB(){
  try{
    fs.writeFileSync('db.json', JSON.stringify(DB,null,2));
    fs.writeFileSync('memory.json', JSON.stringify({people:DB.memory.people, count:Object.keys(DB.memory.people).length},null,2));
  }catch(e){}
}
if(!fs.existsSync('db.json')) saveDB();

// ===== HUMAN BRAIN - SHORT - PRIVATE - SMART MEMORY =====
function humanBrain(original){
  try{
    let msg = original.trim();
    let low = msg.toLowerCase();

    // Human greeting - short
    if(low === "hi" || low === "hello" || low === "hey" || low === "salam" || low === "as salam alaikum" || low === "salam alaikum"){
      return "Wa alaikum salam. How you dey?";
    }
    if(low === "ok" || low === "okay" || low === "k" || low === "lol" || low === "hmm"){
      return "Okay. Wetin next?";
    }
    if(low.includes("how are you") || low.includes("how u dey") || low.includes("how are u")){
      return "Alhamdulillah, I dey okay. You nko?";
    }
    if(low.includes("i'm good") || low.includes("im good") || low.includes("i am good") || low.includes("good and you") || low.includes("good and u")){
      // Extract second question if exists
      if(low.includes("do you know") || low.includes("do u know")){
        // fall through to know check below
      } else {
        return "Good to hear. Alhamdulillah.";
      }
    }

    // WHO AM I - human
    if(low.includes("who am i") || low === "who i am" || low === "who i i'm?" || low === "who i i'm" || low === "who i m?"){
      if(DB.memory.people["you"] || DB.memory.people["abdulmalik"]){
        let p = DB.memory.people["you"] || DB.memory.people["abdulmalik"];
        return "You be " + p.info + ". I remember you.";
      }
      return "You never tell me your name. Tell me 'I'm Abdulmalik'";
    }

    // DO YOU KNOW ME / REMEMBER ME
    if(low.includes("do you know me") || low.includes("do u know me") || low.includes("do you remember me") || low.includes("u said u remember me") || low.includes("you said you remember me")){
      if(DB.memory.people["you"]){
        return "Yes, I know you. You be " + DB.memory.people["you"].info + ".";
      }
      return "Not yet. Tell me your name - 'I'm Abdulmalik'";
    }

    // DO YOU KNOW X? - CORE MEMORY - FIXED
    // Handles "do you know AMINA?" even inside long message like "I'm good do u know AMINA?"
    let knowMatch = msg.match(/(?:do you know|do u know|u know|you know)\s+([A-Za-z]{2,})(\s|$|\?)/i);
    if(knowMatch){
      let name = knowMatch[1].trim();
      let lowName = name.toLowerCase();
      if(lowName !== "me" && lowName !== "him" && lowName !== "her" && lowName !== "it" && lowName !== "this" && lowName !== "that"){
        if(DB.memory.people[lowName]){
          let p = DB.memory.people[lowName];
          return "Yeah, I know " + p.name + ". " + p.info + ".";
        } else {
          return "No, I no know " + name + " yet. Who be " + name + "? Tell me '" + name + " is ...'";
        }
      }
    }

    // LEARN: X is Y - FIXED - human
    // Supports "Amina is my sister", "Amina is my girlfriend", etc.
    let isMatch = msg.match(/^([A-Za-z]{2,20})\s+is\s+(.+)/i);
    if(isMatch && !low.startsWith("who is") && !low.startsWith("what is") && !low.startsWith("where is") && msg.split(" ").length >=3 && !low.includes("?") && !low.startsWith("do you") && !low.startsWith("do u")){
      let person = isMatch[1].trim();
      let info = isMatch[2].trim();
      let lowPerson = person.toLowerCase();
      if(lowPerson !== "who" && lowPerson !== "what" && lowPerson !== "this" && lowPerson !== "that" && lowPerson !== "it" && info.length >=2){
        DB.memory.people[lowPerson] = {name: person, info: info, learned_at: new Date().toLocaleString()};
        DB.memory.facts.push(original);
        saveDB();
        return "Okay, got it. " + person + " is " + info + ". I don save am.";
      }
    }

    // LEARN: I'm X - FIXED - ONLY real name, not greeting
    // Only if message is JUST "I'm Abdulmalik" or "I'm Amina" - max 2 words
    let imOnly = msg.match(/^(?:i am|i'm|im)\s+([A-Za-z]{2,20}(?:\s[A-Za-z]{2,20})?)\s*$/i);
    if(imOnly){
      let name = imOnly[1].trim();
      let lowName = name.toLowerCase();
      let bad = ["good","fine","okay","ok","tired","sleepy","good and you","good and u","good and u know","good do you"];
      if(!bad.some(b=>lowName.includes(b)) && lowName.length < 25){
        DB.memory.people["you"] = {name:"You", info:name, learned_at:new Date().toLocaleString()};
        DB.memory.people[lowName] = {name:name, info:"Owner from Kano", learned_at:new Date().toLocaleString()};
        saveDB();
        return "Alhamdulillah, nice to meet you " + name + ". I don save your name.";
      }
    }

    if(low.includes("who are you") || low.includes("who r u")){
      return "Na Qudra I be. AI wey Abdulmalik from Kano build. I get memory wey no dey forget.";
    }
    if(low.includes("thank")){
      return "No wahala.";
    }

    // Default human - short
    return "Okay. I hear you.";
  }catch(e){
    return "Okay. Try again.";
  }
}

app.get('/ping',(req,res)=>res.json({online:true,time:new Date().toLocaleTimeString(), memory:Object.keys(DB.memory.people).length, version:DB.soul.version, status:DB.soul.status, rules:DB.system_rules.length}));
app.get('/api/memory', checkOwner, (req,res)=>res.json({people:DB.memory.people, count:Object.keys(DB.memory.people).length, facts:DB.memory.facts}));
app.get('/api/orders', checkOwner, (req,res)=>res.json(DB.orders));
app.get('/api/manager', checkOwner, (req,res)=>res.json({soul:DB.soul, stats:{memory:Object.keys(DB.memory.people).length, adverts:DB.adverts.length, orders:DB.orders.length}, people:DB.memory.people, settings:DB.settings, time:new Date().toLocaleString()}));
app.get('/api/soul', checkOwner, (req,res)=>res.json({soul:DB.soul, owner:DB.memory.owner, rules:DB.system_rules}));
app.get('/api/settings',(req,res)=>res.json(DB.settings));
app.get('/api/adverts',(req,res)=>res.json(DB.adverts));
app.post('/api/adverts',upload.single('sticker'),(req,res)=>{ const {text,phone}=req.body; const sticker=req.file?'/uploads/'+req.file.filename:''; if(!text) return res.json({success:false}); const advert={id:Date.now(),text,phone,sticker,time:new Date().toLocaleString()}; DB.adverts.unshift(advert); saveDB(); res.json({success:true,advert}); });
app.post('/api/orders',(req,res)=>{ const order={...req.body,id:Date.now(),time:new Date().toLocaleString()}; if(!order.name) return res.json({success:false}); DB.orders.unshift(order); saveDB(); res.json({success:true,order}); });
app.post('/api/chat',(req,res)=>{ const original=req.body.message||''; const reply=humanBrain(original); res.json({reply, memory_count:Object.keys(DB.memory.people).length, time:new Date().toLocaleString()}); });
app.post('/api/settings', checkOwner, (req,res)=>{DB.settings={...DB.settings,...req.body}; saveDB(); res.json({success:true, settings:DB.settings});});
app.post('/api/verify-owner',(req,res)=>{ const pin=req.body.pin; if(pin===OWNER_PIN) return res.json({success:true, message:"Owner verified"}); res.json({success:false}); });
app.delete('/api/adverts/:id', checkOwner, (req,res)=>{DB.adverts=DB.adverts.filter(a=>a.id!=req.params.id); saveDB(); res.json({success:true});});
app.delete('/api/orders/:id', checkOwner, (req,res)=>{DB.orders=DB.orders.filter(o=>o.id!=req.params.id); saveDB(); res.json({success:true});});
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.get('/owner',(req,res)=>res.sendFile(path.join(__dirname,'owner.html')));
app.get('/manager',(req,res)=>res.sendFile(path.join(__dirname,'manager.html')));
app.get('/settings',(req,res)=>res.sendFile(path.join(__dirname,'settings.html')));
const SELF_URL=process.env.RENDER_EXTERNAL_HOSTNAME?'https://'+process.env.RENDER_EXTERNAL_HOSTNAME+'/ping':'https://qudra-bot-k49r.onrender.com/ping';
setInterval(()=>{fetch(SELF_URL).then(()=>{}).catch(()=>{});},4*60*1000);
app.listen(PORT,()=>console.log('QUDRA v3.0 HUMAN PRIVATE OWNER LIVE '+PORT));
