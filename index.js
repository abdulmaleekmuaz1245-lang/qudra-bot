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
  settings:{appName:"Qudra OS",ownerName:"Abdulmalik",motto:"Seed today, big tree tomorrow"},
  memory:{
    people:{
      abdulmalik:{name:"Abdulmalik", info:"Owner from Kano, builder of Qudra, codes 11pm-6am, seed today big tree tomorrow", learned_at:"Built-in"}
    },
    facts:[],
    owner:{name:"Abdulmalik", city:"Kano", story:"Builder of Qudra OS, humble, halal, legacy"}
  },
  system_rules:["Human","Memory","Private","Owner mode","Halal","Asmaul Husna","Represent","Legacy"],
  soul:{status:"Human Alive", version:"v3.1 FIXED"}
};

if(fs.existsSync('db.json')){
  try{
    const loaded=JSON.parse(fs.readFileSync('db.json','utf8'));
    DB.adverts=loaded.adverts||DB.adverts;
    DB.orders=loaded.orders||DB.orders;
    if(loaded.settings) DB.settings={...DB.settings,...loaded.settings};
    if(loaded.memory){
      DB.memory.people={...DB.memory.people,...(loaded.memory.people||{})};
      DB.memory.facts=loaded.memory.facts||[];
      // Ensure abdulmalik always exists even if db empty
      if(!DB.memory.people["abdulmalik"]){
        DB.memory.people["abdulmalik"]={name:"Abdulmalik", info:"Owner from Kano, builder of Qudra, codes 11pm-6am", learned_at:"Built-in"};
      }
    }
  }catch(e){}
}
function saveDB(){
  try{
    fs.writeFileSync('db.json', JSON.stringify(DB,null,2));
    fs.writeFileSync('memory.json', JSON.stringify({people:DB.memory.people, count:Object.keys(DB.memory.people).length},null,2));
  }catch(e){}
}
saveDB();

function humanBrain(original){
  try{
    let msg = original.trim();
    let low = msg.toLowerCase();

    // === 1. SIMPLE HUMAN ===
    if(low === "hi" || low === "hello" || low === "hey" || low === "salam" || low.startsWith("salam")){
      return "Wa alaikum salam. How you dey?";
    }
    if(low === "ok" || low === "okay" || low === "k" || low === "good" || low === "lol"){
      return "Okay.";
    }

    // Handle combined greeting + question: "I'm good and u" / "I'm good, tell me more about stars"
    let isGreetingFirst = low.startsWith("i'm good") || low.startsWith("im good") || low.startsWith("i am good");
    let secondPart = "";
    if(isGreetingFirst){
      // extract after comma or and
      let parts = msg.split(/,|and|tell me/i);
      if(parts.length>1) secondPart = parts.slice(1).join(" ").trim();
      else secondPart = "";
      if(!secondPart){
        return "Good to hear. Alhamdulillah.";
      }
      // continue to process secondPart as actual question below, set msg to secondPart
      msg = secondPart;
      low = msg.toLowerCase();
    }

    if(low.includes("how are you") || low.includes("how u dey") || low.includes("how are u")){
      return "Alhamdulillah, I dey okay. You nko?";
    }

    // === 2. WHO AM I / KNOW ME ===
    if(low.includes("who am i") || low === "who i am" || low.includes("do you know me") || low.includes("do you remember me") || low.includes("do u know me")){
      if(DB.memory.people["you"]){
        return "You be " + DB.memory.people["you"].info + ". I remember you.";
      }
      if(DB.memory.people["abdulmalik"] && low.includes("abdulmalik")){
        return "You be Abdulmalik, owner from Kano. I know you.";
      }
      return "You never tell me your name. Say 'I'm Abdulmalik'";
    }

    // === 3. DO YOU KNOW X? - FIXED FOR "about" BUG ===
    // This fixes "Wow did u know about ABDULMALIK" -> must pick ABDULMALIK not "about"
    // We take LAST word that looks like name
    if(low.includes("do you know") || low.includes("do u know") || low.includes("did u know") || low.includes("did you know") || low.includes("u know about") || low.includes("you know about")){
      // Find all words, pick last one that is not filler
      let words = msg.match(/[A-Za-z]{2,}/g) || [];
      let filler = ["do","you","know","about","did","u","wow","na","your","owner","tell","me","more","what","who","is","are","the","a","an","this","that","it","him","her","me"];
      let candidates = words.filter(w=> !filler.includes(w.toLowerCase()));
      let name = candidates.length>0 ? candidates[candidates.length-1] : "";
      if(name){
        let lowName = name.toLowerCase();
        // Special case: if they say "your owner" -> answer abdulmalik
        if(low.includes("your owner") || (low.includes("owner") && !name)){
          let p = DB.memory.people["abdulmalik"];
          return "Yes, my owner na " + p.name + ". " + p.info + ".";
        }
        if(DB.memory.people[lowName]){
          let p = DB.memory.people[lowName];
          return "Yeah, I know " + p.name + ". " + p.info + ".";
        } else {
          // If name is abdulmalik but not in people? Use built-in
          if(lowName==="abdulmalik"){
            let p = DB.memory.people["abdulmalik"];
            return "Yeah, na my owner. " + p.info + ".";
          }
          return "No, I no know " + name + " yet. Tell me '" + name + " is ...'";
        }
      }
    }

    // === 4. LEARN X is Y ===
    let isMatch = msg.match(/^([A-Za-z]{2,20})\s+is\s+(.+)/i);
    if(isMatch && !low.startsWith("who is") && !low.startsWith("what is") && !low.startsWith("where is") && msg.split(" ").length>=3 && !low.includes("?") && !low.startsWith("do you")){
      let person = isMatch[1].trim();
      let info = isMatch[2].trim();
      let lp = person.toLowerCase();
      let badP = ["who","what","where","this","that","it"];
      if(!badP.includes(lp) && info.length>=2){
        DB.memory.people[lp] = {name: person, info: info, learned_at: new Date().toLocaleString()};
        DB.memory.facts.push(original);
        saveDB();
        return "Okay, " + person + " is " + info + ". I don save am.";
      }
    }

    // === 5. I'M NAME ===
    let imOnly = msg.match(/^(?:i am|i'm|im)\s+([A-Za-z]{2,20}(?:\s[A-Za-z]{2,20})?)\s*$/i);
    if(imOnly){
      let name = imOnly[1].trim();
      let ln = name.toLowerCase();
      let bad = ["good","fine","okay","ok","tired","sleepy","good and you","good and u","good do you","good tell me"];
      if(!bad.some(b=>ln.includes(b)) && ln.length<25){
        DB.memory.people["you"]={name:"You", info:name, learned_at:new Date().toLocaleString()};
        DB.memory.people[ln]={name:name, info:"From Kano", learned_at:new Date().toLocaleString()};
        saveDB();
        return "Nice to meet you " + name + ". I don save your name.";
      }
    }

    // === 6. Na your owner -> link to abdulmalik ===
    if(low === "na your owner" || low === "na your owner?" || low === "your owner" || low === "na owner"){
      let p = DB.memory.people["abdulmalik"];
      return "Oh, you mean Abdulmalik? " + p.info + ". Na him build me.";
    }

    if(low.includes("who are you")){
      return "Na Qudra I be. AI wey Abdulmalik from Kano build.";
    }

    if(low.includes("stars") || low.includes("star")){
      return "Stars na light wey Allah create. Dem dey guide for night for desert. Like your Qudra dream - small light wey go become big. You dey look stars for Kano tonight?";
    }

    if(low.includes("thank")){
      return "No wahala.";
    }

    return "Okay. I hear you.";
  }catch(e){
    return "Okay.";
  }
}

app.get('/ping',(req,res)=>{
  let mem = Object.keys(DB.memory.people).length;
  let status = DB.soul.status || "Human Alive";
  let version = DB.soul.version || "v3.1";
  let rules = DB.system_rules ? DB.system_rules.length : 8;
  res.json({online:true,time:new Date().toLocaleTimeString(), memory:mem, status:status, version:version, rules:rules});
});
app.get('/api/memory', checkOwner, (req,res)=>res.json({people:DB.memory.people, count:Object.keys(DB.memory.people).length, facts:DB.memory.facts}));
app.get('/api/orders', checkOwner, (req,res)=>res.json(DB.orders));
app.get('/api/manager', checkOwner, (req,res)=>res.json({soul:DB.soul, stats:{memory:Object.keys(DB.memory.people).length, adverts:DB.adverts.length, orders:DB.orders.length}, people:DB.memory.people}));
app.get('/api/soul', checkOwner, (req,res)=>res.json({soul:DB.soul, owner:DB.memory.owner, rules:DB.system_rules}));
app.get('/api/settings',(req,res)=>res.json(DB.settings));
app.get('/api/adverts',(req,res)=>res.json(DB.adverts));
app.post('/api/adverts',upload.single('sticker'),(req,res)=>{ const {text,phone}=req.body; const sticker=req.file?'/uploads/'+req.file.filename:''; if(!text) return res.json({success:false}); const advert={id:Date.now(),text,phone,sticker,time:new Date().toLocaleString()}; DB.adverts.unshift(advert); saveDB(); res.json({success:true,advert}); });
app.post('/api/orders',(req,res)=>{ const order={...req.body,id:Date.now(),time:new Date().toLocaleString()}; if(!order.name) return res.json({success:false}); DB.orders.unshift(order); saveDB(); res.json({success:true,order}); });
app.post('/api/chat',(req,res)=>{ const original=req.body.message||''; const reply=humanBrain(original); res.json({reply, memory_count:Object.keys(DB.memory.people).length, time:new Date().toLocaleString()}); });
app.post('/api/settings', checkOwner, (req,res)=>{DB.settings={...DB.settings,...req.body}; saveDB(); res.json({success:true, settings:DB.settings});});
app.post('/api/verify-owner',(req,res)=>{ const pin=req.body.pin; if(pin===OWNER_PIN) return res.json({success:true}); res.json({success:false}); });
app.delete('/api/adverts/:id', checkOwner, (req,res)=>{DB.adverts=DB.adverts.filter(a=>a.id!=req.params.id); saveDB(); res.json({success:true});});
app.delete('/api/orders/:id', checkOwner, (req,res)=>{DB.orders=DB.orders.filter(o=>o.id!=req.params.id); saveDB(); res.json({success:true});});
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.get('/owner',(req,res)=>res.sendFile(path.join(__dirname,'owner.html')));
app.get('/manager',(req,res)=>res.sendFile(path.join(__dirname,'manager.html')));
app.get('/settings',(req,res)=>res.sendFile(path.join(__dirname,'settings.html')));
const SELF_URL=process.env.RENDER_EXTERNAL_HOSTNAME?'https://'+process.env.RENDER_EXTERNAL_HOSTNAME+'/ping':'https://qudra-bot-k49r.onrender.com/ping';
setInterval(()=>{fetch(SELF_URL).catch(()=>{});},4*60*1000);
app.listen(PORT,()=>console.log('QUDRA v3.1 HUMAN FIXED LIVE '+PORT));
