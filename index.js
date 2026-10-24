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
<div id="lock" style="display:${mode==='owner'?'flex':'none'}"><h2 style="color:gold">🔒 OWNER LOCKED - 100% PERMANENT</h2><input id="pin" type="password" placeholder="Enter PIN" style="padding:12px;border-radius:20px;border:1px solid gold;background:#111;color:gold;width:250px;text-align:center"><button onclick="unlock()" style="margin-top:15px;padding:12px 30px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none">UNLOCK PER
