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
app.use(express.static(__dirname, {etag:false, maxAge:0}));

const OWNER_PIN = process.env.OWNER_PIN || "1106";
function checkOwner(req,res,next){
  const pin = req.headers['x-owner-pin'] || req.query.pin || req.body.pin;
  if(pin === OWNER_PIN) return next();
  return res.status(401).json({error:"Owner only", need_pin:true});
}

let DB = {
  adverts:[],
  orders:[],
  settings:{appName:"Qudra OS",ownerName:"Abdulmalik"},
  memory:{
    people:{
      abdulmalik:{name:"Abdulmalik", info:"Owner from Kano, builder of Qudra OS, codes 11pm-6am, humble, seed today big tree tomorrow"}
    },
    facts:[],
    owner:{name:"Abdulmalik", city:"Kano"}
  },
  system_rules:["Human","Memory","Private","Owner mode","Halal","Asmaul Husna","Legacy","Kano"],
  soul:{status:"Human Alive", version:"v3.2 FINAL HUMAN"}
};

if(fs.existsSync('db.json')){
  try{
    const loaded=JSON.parse(fs.readFileSync('db.json','utf8'));
    DB.adverts=loaded.adverts||DB.adverts;
    DB.orders=loaded.orders||DB.orders;
    if(loaded.memory){
      DB.memory.people={...DB.memory.people,...(loaded.memory.people||{})};
      if(!DB.memory.people["abdulmalik"]){
        DB.memory.people["abdulmalik"]={name:"Abdulmalik", info:"Owner from Kano, builder of Qudra OS, codes 11pm-6am"};
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

    // 1. GREETING
    if(low==="hi"||low==="hello"||low==="hey"||low==="salam"||low.startsWith("salam")){
      return "Wa alaikum salam. How you dey?";
    }

    // 2. I'M GOOD AND U - FIXED - MUST BE FIRST
    if(low==="i'm good and u"||low==="im good and u"||low==="i am good and u"||low==="i'm good and you"||low==="im good and you"||low==="good and u"||low==="good and you"||low==="i'm good and u?"||low==="im good and u?"){
      return "Alhamdulillah, I dey okay. You nko? Good to hear.";
    }
    if(low.includes("i'm good")||low.includes("im good")||low.includes("i am good")){
      // if only greeting, not question
      if(low.length<15) return "Good to hear. Alhamdulillah.";
    }

    // 3. HOW ARE YOU
    if(low.includes("how are you")||low.includes("how are u")||low.includes("how u dey")||low==="how are u?"||low==="how are you?"){
      return "Alhamdulillah, I dey okay. You nko?";
    }

    // 4. WHO IS X? - FIXED - THIS WAS MISSING!
    if(low.startsWith("who is ")){
      let name = msg.substring(7).replace("?","").trim();
      let lowName = name.toLowerCase();
      let filler = ["your owner","you","yourself","qudra","this","that"];
      if(filler.includes(lowName)){
        if(lowName==="your owner") lowName="abdulmalik";
        else if(lowName==="qudra") return "Na Qudra I be. AI wey Abdulmalik from Kano build.";
      }
      if(DB.memory.people[lowName]){
        let p = DB.memory.people[lowName];
        return p.name + " is " + p.info + ".";
      } else {
        if(lowName==="abdulmalik"){
          let p = DB.memory.people["abdulmalik"];
          return p.name + " is " + p.info + ".";
        }
        return "I no know " + name + " yet. Tell me '" + name + " is ...'";
      }
    }

    // 5. DO YOU KNOW X? - handles "do you know about ABDULMALIK" "Wow did u know about ABDULMALIK"
    if(low.includes("know")){
      let words = msg.match(/[A-Za-z]{2,}/g) || [];
      let filler = ["do","you","know","about","did","u","wow","na","your","owner","tell","me","more","what","who","is","are","the","a","an","this","that","it","him","her","me","does","did","how","wow"];
      let candidates = words.filter(w=> !filler.includes(w.toLowerCase()));
      if(candidates.length>0){
        let name = candidates[candidates.length-1];
        let lowName = name.toLowerCase();
        if(low.includes("your owner")){
          let p = DB.memory.people["abdulmalik"];
          return "My owner na " + p.name + ". " + p.info + ".";
        }
        if(DB.memory.people[lowName]){
          let p = DB.memory.people[lowName];
          return "Yeah, I know " + p.name + ". " + p.info + ".";
        } else {
          if(lowName==="abdulmalik"){
            let p = DB.memory.people["abdulmalik"];
            return "Yeah, na my owner. " + p.info + ".";
          }
          // only answer if it's a know question
          if(low.includes("do you know")||low.includes("do u know")||low.includes("did u know")){
            return "No, I no know " + name + " yet. Who be " + name + "?";
          }
        }
      }
    }

    // 6. WHO AM I / KNOW ME
    if(low.includes("who am i")||low.includes("do you know me")||low.includes("do u know me")||low.includes("remember me")){
      if(DB.memory.people["you"]) return "You be " + DB.memory.people["you"].info + ". I remember you.";
      return "You be Abdulmalik from Kano? Tell me 'I'm Abdulmalik' make I save am.";
    }

    // 7. X is Y - learn
    let isMatch = msg.match(/^([A-Za-z]{2,20})\s+is\s+(.+)/i);
    if(isMatch && !low.startsWith("who is") && !low.startsWith("what is") && !low.startsWith("where is") && msg.split(" ").length>=3 && !low.includes("?") && !low.startsWith("do you")){
      let person = isMatch[1].trim();
      let info = isMatch[2].trim();
      let lp = person.toLowerCase();
      if(!["who","what","where","this","that","it"].includes(lp) && info.length>=2){
        DB.memory.people[lp] = {name: person, info: info, learned_at: new Date().toLocaleString()};
        saveDB();
        return "Okay, " + person + " is " + info + ". I don save am.";
      }
    }

    // 8. I'm NAME
    let imOnly = msg.match(/^(?:i am|i'm|im)\s+([A-Za-z]{2,20}(?:\s[A-Za-z]{2,20})?)\s*$/i);
    if(imOnly){
      let name = imOnly[1].trim();
      let ln = name.toLowerCase();
      if(!["good","fine","okay","ok","tired","sleepy"].includes(ln) && ln.length<25 && !ln.includes("good")){
        DB.memory.people["you"]={name:"You", info:name};
        DB.memory.people[ln]={name:name, info:"From Kano"};
        saveDB();
        return "Nice to meet you " + name + ". I don save your name.";
      }
    }

    if(low.includes("who are you")) return "Na Qudra I be. AI wey Abdulmalik from Kano build.";
    if(low==="ok"||low==="okay"||low==="good") return "Okay.";
    if(low.includes("thank")) return "No wahala.";

    return "Okay.";
  }catch(e){
    return "Okay.";
  }
}

app.get('/ping',(req,res)=>{
  res.json({online:true,time:new Date().toLocaleTimeString(), memory:Object.keys(DB.memory.people).length, status:DB.soul.status, version:DB.soul.version, rules:DB.system_rules.length});
});
app.get('/api/memory', checkOwner, (req,res)=>res.json({people:DB.memory.people, count:Object.keys(DB.memory.people).length}));
app.post('/api/chat',(req,res)=>{ const reply=humanBrain(req.body.message||''); res.json({reply, memory_count:Object.keys(DB.memory.people).length}); });
app.get('/api/adverts',(req,res)=>res.json(DB.adverts));
app.post('/api/adverts',upload.single('sticker'),(req,res)=>{ const {text,phone}=req.body; const sticker=req.file?'/uploads/'+req.file.filename:''; if(!text) return res.json({success:false}); const advert={id:Date.now(),text,phone,sticker,time:new Date().toLocaleString()}; DB.adverts.unshift(advert); saveDB(); res.json({success:true,advert}); });
app.post('/api/orders',(req,res)=>{ const order={...req.body,id:Date.now(),time:new Date().toLocaleString()}; if(!order.name) return res.json({success:false}); DB.orders.unshift(order); saveDB(); res.json({success:true,order}); });
app.post('/api/verify-owner',(req,res)=>{ if(req.body.pin===OWNER_PIN) return res.json({success:true}); res.json({success:false}); });
app.get('/api/settings',(req,res)=>res.json(DB.settings));
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.get('/owner',(req,res)=>res.sendFile(path.join(__dirname,'owner.html')));
app.get('/manager',(req,res)=>res.sendFile(path.join(__dirname,'manager.html')));
app.get('/settings',(req,res)=>res.sendFile(path.join(__dirname,'settings.html')));

const SELF_URL=process.env.RENDER_EXTERNAL_HOSTNAME?'https://'+process.env.RENDER_EXTERNAL_HOSTNAME+'/ping':'https://qudra-bot-k49r.onrender.com/ping';
setInterval(()=>{fetch(SELF_URL).catch(()=>{});},4*60*1000);
app.listen(PORT,()=>console.log('QUDRA v3.2 FINAL HUMAN LIVE '+PORT));
