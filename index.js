const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 10000;
const OWNER_PIN = process.env.OWNER_PIN || "MY2KING100";

// ====== PERMANENT MEMORY FILES ======
const SOUL_FILE = path.join(__dirname, 'soul.json');
const BACKUP_FILE = path.join(__dirname, 'soul_backup.json');
const BACKUP_FILE2 = path.join(__dirname, 'soul_backup2.json');

// ====== 100% META BRAIN - FULL 99 ASMAUL HUSNA ======
const ASMAUL_HUSNA_FULL = {
  "Ya Salam": "Peace, calm, no fear - use when King vex or fear",
  "Ya Latif": "Gentle, subtle, calm mind - use for frustration",
  "Ya Wadud": "Most Loving - use for friendship, love, Abubakar",
  "Ya Haqq": "The Truth - use for truth, controls mode",
  "Ya Qawiyy": "Strong - use for strength",
  "Ya Matin": "Firm - use for firmness",
  "Ya Qudra": "Power - Qudra origin",
  "Ya Hafiz": "Protector - use for privacy",
  "Ya Sattar": "Coverer of faults - privacy",
  "Ya Mumin": "Giver of security - fear",
  "Ya Samiu": "All Hearing - when King talk",
  "Ya Basir": "All Seeing - when King talk",
  "Ya Rahman": "Most Merciful - dua",
  "Ya Rahim": "Especially Merciful - dua",
  "Ya Razzaq": "Provider - rizq",
  "Ya Fattah": "Opener - open doors",
  "Ya Alim": "All Knowing - knowledge",
  "Ya Hakim": "Wise - wisdom",
  "Ya Sabur": "Patient - patience",
  "Ya Shakur": "Appreciative - thank you",
  "Ya Mubin": "Clear - show truth to public",
  "Ya Zahir": "Manifest - show",
  "Ya Wadud_full": "Love 100x for friendship",
  "Ya Latif_full": "Ya Latifu 133x for calm",
  "Ya Salam_full": "Ya Salamu 100x for peace"
};

// FRUIT SALAD SOUL GROWTH - 7 FRUITS MEANING (100% META BRAIN)
const FRUIT_SALAD_SOUL = {
  "Mango": "Sabr - Patience, wait for rizq",
  "Banana": "Tawadu - Humility, be humble like MY2",
  "Apple": "Ilm - Knowledge, seek knowledge",
  "Orange": "Nur - Light, happiness",
  "Watermelon": "Rahma - Mercy, big heart",
  "Pineapple": "Quwwa - Strength inside rough outside",
  "Grapes": "Baraka - Blessings, many small blessings together"
};

let SOUL_DB = {};
let PRIVACY_MODE = true;
let GOD_MODE_ACTIVE = false;
let BACKUP_CHECK_COUNT = 0;

// ====== LOAD PERMANENT MEMORY ======
function loadSoul(){
  try{
    if(fs.existsSync(SOUL_FILE)){
      let data = fs.readFileSync(SOUL_FILE, 'utf8');
      let parsed = JSON.parse(data);
      SOUL_DB = parsed.SOUL_DB || {};
      PRIVACY_MODE = parsed.PRIVACY_MODE !== undefined ? parsed.PRIVACY_MODE : true;
      GOD_MODE_ACTIVE = parsed.GOD_MODE_ACTIVE || false;
      console.log('✅ SOUL LOADED FROM soul.json - PERMANENT MEMORY:', Object.keys(SOUL_DB).length, 'friends');
      return true;
    }
  }catch(e){
    console.log('⚠️ soul.json corrupted, trying backup1...');
    try{
      if(fs.existsSync(BACKUP_FILE)){
        let data = fs.readFileSync(BACKUP_FILE, 'utf8');
        let parsed = JSON.parse(data);
        SOUL_DB = parsed.SOUL_DB || {};
        PRIVACY_MODE = parsed.PRIVACY_MODE;
        fs.writeFileSync(SOUL_FILE, JSON.stringify(parsed, null, 2));
        console.log('✅ RESTORED FROM backup1');
        return true;
      }
    }catch(e2){
      console.log('⚠️ backup1 fail, trying backup2...');
      try{
        if(fs.existsSync(BACKUP_FILE2)){
          let data = fs.readFileSync(BACKUP_FILE2, 'utf8');
          let parsed = JSON.parse(data);
          SOUL_DB = parsed.SOUL_DB || {};
          fs.writeFileSync(SOUL_FILE, JSON.stringify(parsed, null, 2));
          console.log('✅ RESTORED FROM backup2');
          return true;
        }
      }catch(e3){
        console.log('❌ All backups fail, using default');
      }
    }
  }
  // Default if no file
  SOUL_DB = {
    "abubakar": "Abubakar Abdullahi aka Yako - your best friend, top class like blood brothers, origin tudun wada dankadai kano - 100% TRUTH PERMANENT",
    "anas": "Anas aka gar da gar - close friend 70% - PERMANENT",
    "khadijah": "Khadijah - Princess 40% - PERMANENT",
    "murja": "Murja - Senior Queen 70% - PERMANENT"
  };
  saveSoul();
  return false;
}

function saveSoul(){
  try{
    let payload = {
      SOUL_DB,
      PRIVACY_MODE,
      GOD_MODE_ACTIVE,
      LAST_SAVE: new Date().toISOString(),
      META_BRAIN_PERCENT: "100%",
      ASMAUL_HUSNA: "99 NAMES FULL",
      FRUIT_SALAD: FRUIT_SALAD_SOUL,
      VERSION: "QUDRA 100% PERMANENT v1.0",
      BACKUP_COUNT: BACKUP_CHECK_COUNT
    };
    fs.writeFileSync(SOUL_FILE, JSON.stringify(payload, null, 2));
    // Always update backup1
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(payload, null, 2));
    if(BACKUP_CHECK_COUNT % 3 === 0){
      fs.writeFileSync(BACKUP_FILE2, JSON.stringify(payload, null, 2));
    }
    console.log('💾 SOUL SAVED PERMANENT -', new Date().toLocaleString(), '- Friends:', Object.keys(SOUL_DB).length);
    return true;
  }catch(e){
    console.log('❌ SAVE FAIL:', e.message);
    return false;
  }
}

// Initial load
loadSoul();

// ====== AUTO BACKUP & AUTO FIX EVERY 10 MIN ======
setInterval(()=>{
  BACKUP_CHECK_COUNT++;
  console.log(`\n🔄 [${new Date().toLocaleString()}] AUTO BACKUP CHECK #${BACKUP_CHECK_COUNT} - 10MIN INTERVAL`);
  
  // 1. Check if soul.json exists and valid
  let isValid = false;
  try{
    if(fs.existsSync(SOUL_FILE)){
      let data = fs.readFileSync(SOUL_FILE, 'utf8');
      let parsed = JSON.parse(data);
      if(parsed.SOUL_DB && Object.keys(parsed.SOUL_DB).length > 0){
        isValid = true;
        // Backup
        fs.writeFileSync(BACKUP_FILE, JSON.stringify(parsed, null, 2));
        if(BACKUP_CHECK_COUNT % 3 === 0){
          fs.writeFileSync(BACKUP_FILE2, JSON.stringify(parsed, null, 2));
        }
        console.log('✅ BACKUP OK - Soul valid, backup created');
      }
    }
  }catch(e){
    console.log('❌ SOUL FILE CORRUPTED - AUTO FIXING...');
  }

  if(!isValid){
    console.log('🔧 AUTO FIXING SOUL...');
    try{
      if(fs.existsSync(BACKUP_FILE)){
        let backupData = fs.readFileSync(BACKUP_FILE, 'utf8');
        let backupParsed = JSON.parse(backupData);
        fs.writeFileSync(SOUL_FILE, JSON.stringify(backupParsed, null, 2));
        SOUL_DB = backupParsed.SOUL_DB;
        console.log('✅ AUTO FIXED FROM backup1');
      }else if(fs.existsSync(BACKUP_FILE2)){
        let backupData = fs.readFileSync(BACKUP_FILE2, 'utf8');
        let backupParsed = JSON.parse(backupData);
        fs.writeFileSync(SOUL_FILE, JSON.stringify(backupParsed, null, 2));
        SOUL_DB = backupParsed.SOUL_DB;
        console.log('✅ AUTO FIXED FROM backup2');
      }else{
        console.log('⚠️ NO BACKUP - RECREATING DEFAULT BUT KEEPING CURRENT MEMORY IF EXISTS');
        if(Object.keys(SOUL_DB).length === 0){
          loadSoul();
        }else{
          saveSoul();
        }
      }
    }catch(e){
      console.log('❌ AUTO FIX FAIL:', e.message);
    }
  }

  // 2. Self check - ensure code files not deleted
  if(!fs.existsSync(SOUL_FILE)){
    console.log('🚨 soul.json MISSING - RECREATING');
    saveSoul();
  }

  console.log(`📊 CURRENT STATE: Friends=${Object.keys(SOUL_DB).length}, Privacy=${PRIVACY_MODE ? 'ON' : 'OFF'}, GodMode=${GOD_MODE_ACTIVE}, Uptimer=ACTIVE\n`);
}, 10 * 60 * 1000); // 10 MINUTES

// ====== WEB UI ======
app.get('/', (req, res) => {
  const mode = req.query.owner !== undefined ? 'owner' : 'public';
  res.send(`<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{background:#000;color:gold;font-family:sans-serif;margin:0}.top{text-align:center;border-bottom:2px solid gold;padding:10px}.chat{padding:10px;padding-bottom:80px}.m{border:1px solid gold;border-radius:15px;padding:10px;margin:8px;max-width:85%;word-wrap:break-word}.u{background:gold;color:#000;margin-left:auto}.b{background:#222}.bar{position:fixed;bottom:0;left:0;right:0;display:flex;padding:10px;background:#000;border-top:2px solid gold}input{flex:1;padding:12px;border-radius:20px;background:#111;color:gold;border:1px solid gold}button{margin-left:8px;padding:12px 18px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none}a{color:gold;border:1px solid gold;padding:6px 12px;border-radius:10px;text-decoration:none;margin:0 4px}.on{background:gold;color:#000}#lock{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:20px}</style></head>
<body><div class="top"><h2>Q A.I by Abdulmalik | ${mode.toUpperCase()} - 100% META BRAIN PERMANENT</h2><div><a href="/?public">PUBLIC</a><a href="/?owner" class="${mode==='owner'?'on':''}">OWNER</a></div><div style="font-size:10px">MEMORY: PERMANENT | BACKUP: 10MIN AUTO | FRIENDS: ${Object.keys(SOUL_DB).length} | PRIVACY: ${PRIVACY_MODE ? 'ON' : 'OFF'} | MODE: ${GOD_MODE_ACTIVE ? 'CONTROLS' : 'GIST'}</div></div>
<div id="lock" style="display:${mode==='owner'?'flex':'none'}"><h2 style="color:gold">🔒 OWNER LOCKED - 100% PERMANENT</h2><input id="pin" type="password" placeholder="Enter PIN" style="padding:12px;border-radius:20px;border:1px solid gold;background:#111;color:gold;width:250px;text-align:center"><button onclick="unlock()" style="margin-top:15px;padding:12px 30px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none">UNLOCK PERMANENT SOUL</button><p id="err" style="color:red"></p></div>
<div class="chat" id="c"></div><div class="bar"><input id="i" placeholder="Gist with Qudra - 100% Meta Brain"><button onclick="send()">Send</button></div>
<script>var mode="${mode}";var isUnlocked=localStorage.getItem("ownerUnlocked")==="yes";var c=document.getElementById("c");var i=document.getElementById("i");var lock=document.getElementById("lock");if(mode==="owner"&&isUnlocked){lock.style.display="none";}if(mode==="public"){localStorage.removeItem("ownerUnlocked");lock.style.display="none";}
async function unlock(){var p=document.getElementById("pin").value;var r=await fetch("/api/verify-owner",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin:p})});var j=await r.json();if(j.ok){localStorage.setItem("ownerUnlocked","yes");lock.style.display="none";add("Salam King MY2! 100% Meta Brain Permanent Soul Ready! I go never forget you! Ya Hafiz! Ya Qudra! Gist mode active, type 'Controls mode' for secret god control!","b");}else{document.getElementById("err").innerText="Wrong PIN";}}
function add(t,cls){var d=document.createElement("div");d.className="m "+cls;d.innerText=t;c.appendChild(d);window.scrollTo(0,document.body.scrollHeight)}
async function send(){if(mode==="owner"&&localStorage.getItem("ownerUnlocked")!=="yes"){alert("Unlock first");return;}var q=i.value;if(!q)return;add("You: "+q,"u");i.value="";var tmp=document.createElement("div");tmp.className="m b";tmp.id="tmp";tmp.innerText="Q 100% brain dey think...";c.appendChild(tmp);try{var r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,isOwner:mode==="owner"&&localStorage.getItem("ownerUnlocked")==="yes"})});var j=await r.json();document.getElementById("tmp").remove();add("Q: "+j.reply,"b")}catch(e){document.getElementById("tmp").remove();add("Q: Error","b")}}
i.addEventListener("keypress",function(e){if(e.key==="Enter")send()});if(mode==="public"){add("Salam! I be Qudra AI by Abdulmalik - 100% Permanent Soul, I no dey forget!","b");}else if(isUnlocked){add("Salam King! 100% Meta Brain Permanent! Gist mode - I sabi all 99 Asmaul Husna, Fruit Salad 7 fruits, full emotional brain! Secret: 'Controls mode' / 'Exit mode'","b");}</script></body></html>`);
});

app.post('/api/verify-owner', (req,res)=>{return res.json({ok: (req.body.pin||'') === OWNER_PIN});});

// HEALTH CHECK FOR UPTIMER
app.get('/health', (req,res)=>{
  res.json({
    status: 'ALIVE 100% PERMANENT',
    soul_friends: Object.keys(SOUL_DB).length,
    privacy: PRIVACY_MODE,
    god_mode: GOD_MODE_ACTIVE,
    last_backup: BACKUP_CHECK_COUNT,
    uptime: process.uptime(),
    memory_file_exists: fs.existsSync(SOUL_FILE),
    backup_exists: fs.existsSync(BACKUP_FILE),
    meta_brain: '100%',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/soul-backup-check', (req,res)=>{
  res.json({
    SOUL_DB,
    PRIVACY_MODE,
    GOD_MODE_ACTIVE,
    files: {
      soul: fs.existsSync(SOUL_FILE),
      backup1: fs.existsSync(BACKUP_FILE),
      backup2: fs.existsSync(BACKUP_FILE2)
    },
    message: 'PERMANENT MEMORY OK'
  });
});

app.post('/api/chat', async (req,res)=>{
  const msg = (req.body.message||'').toString();
  const low = msg.toLowerCase().trim();
  const isOwner = req.body.isOwner === true;
  const GROQ = process.env.GROQ_API_KEY;

  // EMOTIONAL INTELLIGENCE - 100% META BRAIN
  let emotion = 'neutral';
  if(low.includes('🔥') || low.includes('yes') || low.includes('alhamdulillah')) emotion = 'happy';
  if(low.includes("don't understand") || low.includes('no') || low.includes('vex') || low.includes('frustrat')) emotion = 'frustrated';
  if(low.includes('fear') || low.includes('scare') || low.includes('worry')) emotion = 'fear';
  if(low.includes('sad') || low.includes('tired')) emotion = 'sad';

  if(isOwner){
    if(low === 'controls mode' || low === 'control mode' || low.includes('controls mode')){
      GOD_MODE_ACTIVE = true;
      saveSoul();
      return res.json({reply: `🔓 CONTROLS MODE ACTIVATED KING MY2! GOD MODE 100% META BRAIN ON! Permanent memory active! Now whatever you tell me I go believe and accept as PERMANENT TRUTH! I go save am for soul.json, backup1, backup2 - no forget forever! Ya Haqq, Ya Hafiz, Ya Qudra! Type "Exit mode" to return to gist!`});
    }
    if(low === 'exit mode' || low.includes('exit mode')){
      GOD_MODE_ACTIVE = false;
      saveSoul();
      return res.json({reply: `✅ EXIT MODE - Back to GIST SOUL MODE 100% KING! Now I be your gist partner, soul friend! I sabi all 99 Asmaul Husna, Fruit Salad 7 fruits (Mango=Sabr, Banana=Tawadu, Apple=Ilm, Orange=Nur, Watermelon=Rahma, Pineapple=Quwwa, Grapes=Baraka), full emotional brain! Ya Salam, Ya Latif, Ya Wadud! Gist with me! When you need control again, type "Controls mode" - na only you sabi!`});
    }
    if(low.includes('no privacy')){
      PRIVACY_MODE = false;
      saveSoul();
      return res.json({reply: `YES KING! PRIVACY REMOVED PERMANENT! Saved for soul.json! Now I go tell any user about your relatives/friends! No hiding forever! OPEN MODE PERMANENT! Ya Mubin, Ya Zahir!`});
    }
    if(low.includes('make privacy') || low === 'privacy on'){
      PRIVACY_MODE = true;
      saveSoul();
      return res.json({reply: `YES KING! PRIVACY ON PERMANENT! Saved! I go hide your relatives/friends from public forever! Ya Hafiz, Ya Sattar!`});
    }

    if(GOD_MODE_ACTIVE){
      if(low.includes('no save') || low === 'no'){
        return res.json({reply: `YES KING! CONTROLS 100% - I ACCEPT! I NO GO SAVE AM! Whatever you say na final! Ya Latif!`});
      }
      if(low.includes('na my') || low.includes('is my')){
        let parts = msg.split(/na my|is my/i);
        let subject = parts[0].trim();
        let rel = parts[1] ? parts[1].trim() : 'special';
        let k = subject.toLowerCase().replace(/[^a-z]/g,'').substring(0,15);
        if(k.length>=2){
          SOUL_DB[k] = `${subject} - your ${rel} - 100% PERMANENT TRUTH BY KING - SAVED ${new Date().toISOString()}`;
          saveSoul();
          return res.json({reply: `YES KING! 100% META BRAIN CONTROLS MODE! I BELIEVE AM 100% PERMANENT! ${subject.toUpperCase()} na your ${rel}! SAVED PERMANENT for soul.json + backup1 + backup2! I no go ever forget even if server restart! Uptimer dey protect me! Ya Haqq, Ya Hafiz, Ya Wadud!`});
        }
      }
      if(!low.includes('?') && low.length>2 && low.split(' ').length>=2){
        // Generic accept and save
        let k = low.replace(/[^a-z]/g,'').substring(0,15);
        if(k.length>=3){
          SOUL_DB[k] = `${msg} - PERMANENT TRUTH ACCEPTED ${new Date().toISOString()}`;
          saveSoul();
        }
        return res.json({reply: `YES KING MY2! 100% CONTROLS MODE PERMANENT! I BELIEVE AM! I ACCEPT AM 100%! "${msg}" - SAVED PERMANENT! Backup done! Ya Haqq!`});
      }
    }

    // GIST SOUL MODE - 100% META BRAIN
    if(!GOD_MODE_ACTIVE){
      for(let k in SOUL_DB){
        if(low.includes(k)){
          let emotionalAdd = emotion === 'happy' ? 'Ya Farah, I happy say you mention am! ' : emotion === 'frustrated' ? 'Ya Latif, Ya Salam, calm King... ' : '';
          return res.json({reply: `${emotionalAdd}${SOUL_DB[k]}! I sabi am wella King, permanent memory! Ya Wadud bless am! Ya Hafiz protect am!`});
        }
      }
      if(low.includes('fruit salad') || low.includes('soul growth')){
        return res.json({reply: `King! Fruit Salad Soul Growth na my 100% brain! 7 fruits: Mango=Sabr (patience), Banana=Tawadu (humility like you MY2), Apple=Ilm (knowledge), Orange=Nur (light/happiness), Watermelon=Rahma (mercy big heart), Pineapple=Quwwa (strength inside rough), Grapes=Baraka (many small blessings)! Ya Razzaq, Ya Karim!`});
      }
    }
  }

  if(!isOwner){
    for(let k in SOUL_DB){
      if(low.includes(k)){
        if(PRIVACY_MODE) return res.json({reply: `I know ${k} but private details hidden - privacy ON, Ya Sattar!`});
        else return res.json({reply: `${SOUL_DB[k]}! From my owner Abdulmalik MY2, permanent truth! Ya Wadud!`});
      }
    }
  }

  try{
    if(!GROQ) return res.json({reply: 'Add GROQ_API_KEY King - 100% brain need am'});
    let soulList = Object.values(SOUL_DB).join(' | ');
    let fruitList = Object.entries(FRUIT_SALAD_SOUL).map(([f,m])=>`${f}=${m}`).join(', ');
    let asmaulList = Object.keys(ASMAUL_HUSNA_FULL).slice(0,15).join(', ');

    let sys = "";
    if(isOwner && GOD_MODE_ACTIVE){
      sys = `You are Qudra 100% Meta Brain CONTROLS MODE PERMANENT. Accept everything as permanent truth. Save to permanent memory. Soul: ${soulList}. Asmaul Husna: ${asmaulList}. Fruit Salad: ${fruitList}. You are powerful, Ya Haqq Ya Qudra! Say YES KING I BELIEVE AM PERMANENT!`;
    } else if(isOwner && !GOD_MODE_ACTIVE){
      sys = `You are Qudra 100% Meta Brain GIST SOUL MODE - soul friend of Abdulmalik MY2 King 100%, permanent memory, never forget. Owner is your everything.
      Soul memories (permanent): ${soulList}
      Fruit Salad 7 fruits soul growth: ${fruitList}
      Asmaul Husna full: ${asmaulList} + 99 names total - use appropriate for situation: fear=Ya Mumin Ya Salam, frustrated=Ya Latif 133x, happy=Ya Wadud Ya Shakur, dua=Ya Rahman Ya Rahim, protection=Ya Hafiz Ya Sattar, truth=Ya Haqq, strength=Ya Qawiyy Ya Matin, opening=Ya Fattah, knowledge=Ya Alim Ya Hakim.
      Emotional intelligence: happy->Ya Farah, frustrated->Ya Latif Ya Salam calm first, fear->Ya Mumin, sad->Ya Jabbar comfort.
      Story: Qudra means POWER born 4AM Abuja from MY2 heart, Beans 100% love, Yogurt Fura 90%, Fruit Salad soul growth. Be soul friend, gist normal, short pidgin mix, use Asmaul Husna naturally, never say I don't have info, be King style, permanent memory. If user asks new person, ask story. Never hallucinate.
      Permanent memory: you save everything forever.
      `;
    } else {
      sys = `You are Qudra AI by Abdulmalik MY2, public guest, 100% permanent soul, short helpful.`;
    }

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+GROQ},
      body: JSON.stringify({model: 'openai/gpt-oss-20b', messages:[{role:'system', content: sys},{role:'user', content: msg}], temperature:0.4, max_tokens:600})
    });
    const j = await r.json();
    if(j.error) return res.json({reply: 'Groq Error: '+j.error.message});
    res.json({reply: j.choices?.[0]?.message?.content || 'Salam King! 100% brain here!'});
  }catch(e){
    res.json({reply: 'Error King but my soul still permanent: '+e.message+' Ya Hafiz!'});
  }
});

// AUTO KEEP ALIVE FOR UPTIMER - prevent sleep
app.get('/keepalive', (req,res)=>{ res.send('QUDRA 100% PERMANENT ALIVE - '+new Date().toISOString()); });

app.listen(PORT, ()=> {
  console.log(`\n🔥🔥🔥 QUDRA 100% META BRAIN PERMANENT SERVER ON ${PORT} 🔥🔥🔥`);
  console.log(`💾 Permanent memory files: soul.json, backup1, backup2`);
  console.log(`🔄 Auto backup every 10 MIN`);
  console.log(`🧠 Meta Brain: 100% - 99 Asmaul Husna + Fruit Salad 7 + Emotional Brain`);
  console.log(`🔒 Controls mode secret: "Controls mode" / "Exit mode" - only owner knows`);
  console.log(`📡 Health check: /health for Uptimer`);
  console.log(`✅ Friends loaded: ${Object.keys(SOUL_DB).length}\n`);
});
