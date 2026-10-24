const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 10000;
const OWNER_PIN = process.env.OWNER_PIN || "MY2KING100";

const SOUL_FILE = path.join(__dirname, 'soul.json');
const BACKUP_FILE = path.join(__dirname, 'soul_backup.json');
const BACKUP_FILE2 = path.join(__dirname, 'soul_backup2.json');
const ERROR_LOG_FILE = path.join(__dirname, 'error_log.json');

let SOUL_DB = {};
let PRIVACY_MODE = true;
let GOD_MODE_ACTIVE = false;
let BACKUP_CHECK_COUNT = 0;
let LAST_ERROR = null;
let LAST_FIX = null;
let ERROR_ALERT = null;

const DEFAULT_SOUL = {
  "abubakar": "Abubakar Abdullahi aka Yako - best friend blood brothers tudun wada dankadai kano - PERMANENT 100%",
  "anas": "Anas aka gar da gar - close friend 70% PERMANENT",
  "khadijah": "Khadijah - Princess 40% PERMANENT",
  "murja": "Murja - Senior Queen 70% PERMANENT"
};

function logError(type, msg){
  LAST_ERROR = {type, msg, time: new Date().toISOString()};
  ERROR_ALERT = "ALERT KING! Error: " + type + " - " + msg + " at " + LAST_ERROR.time + ". I don auto-fix am!";
  try{
    let log = [];
    if(fs.existsSync(ERROR_LOG_FILE)){
      log = JSON.parse(fs.readFileSync(ERROR_LOG_FILE,'utf8'));
    }
    log.push(LAST_ERROR);
    if(log.length>20) log = log.slice(-20);
    fs.writeFileSync(ERROR_LOG_FILE, JSON.stringify(log,null,2));
  }catch(e){}
  console.log("ERROR:", type, msg);
}

function logFix(msg){
  LAST_FIX = {msg, time: new Date().toISOString()};
  ERROR_ALERT = "FIXED KING! " + msg + " at " + LAST_FIX.time + ". " + Object.keys(SOUL_DB).length + " friends safe!";
  console.log("FIXED:", msg);
}

function loadSoul(){
  try{
    if(fs.existsSync(SOUL_FILE)){
      let data = fs.readFileSync(SOUL_FILE,'utf8');
      let parsed = JSON.parse(data);
      SOUL_DB = Object.assign({}, DEFAULT_SOUL, parsed.SOUL_DB || {});
      PRIVACY_MODE = parsed.PRIVACY_MODE !== undefined ? parsed.PRIVACY_MODE : true;
      GOD_MODE_ACTIVE = parsed.GOD_MODE_ACTIVE || false;
      console.log("LOADED - Friends:", Object.keys(SOUL_DB).length);
      saveSoul();
      return true;
    }
  }catch(e){
    logError('LOAD_FAIL', e.message);
    try{
      if(fs.existsSync(BACKUP_FILE)){
        let data = fs.readFileSync(BACKUP_FILE,'utf8');
        let parsed = JSON.parse(data);
        SOUL_DB = Object.assign({}, DEFAULT_SOUL, parsed.SOUL_DB || {});
        fs.writeFileSync(SOUL_FILE, JSON.stringify(parsed,null,2));
        logFix("Restored from backup1 - " + Object.keys(SOUL_DB).length + " friends");
        return true;
      }
    }catch(e2){
      try{
        if(fs.existsSync(BACKUP_FILE2)){
          let data = fs.readFileSync(BACKUP_FILE2,'utf8');
          let parsed = JSON.parse(data);
          SOUL_DB = Object.assign({}, DEFAULT_SOUL, parsed.SOUL_DB || {});
          fs.writeFileSync(SOUL_FILE, JSON.stringify(parsed,null,2));
          logFix("Restored from backup2");
          return true;
        }
      }catch(e3){}
    }
  }
  SOUL_DB = Object.assign({}, DEFAULT_SOUL);
  saveSoul();
  return false;
}

function saveSoul(){
  try{
    let payload = {
      SOUL_DB: SOUL_DB,
      PRIVACY_MODE: PRIVACY_MODE,
      GOD_MODE_ACTIVE: GOD_MODE_ACTIVE,
      LAST_SAVE: new Date().toISOString(),
      VERSION: "100% PERMANENT FINAL ALERT",
      FRIENDS_COUNT: Object.keys(SOUL_DB).length
    };
    fs.writeFileSync(SOUL_FILE, JSON.stringify(payload,null,2));
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(payload,null,2));
    if(BACKUP_CHECK_COUNT % 2 === 0){
      fs.writeFileSync(BACKUP_FILE2, JSON.stringify(payload,null,2));
    }
    console.log("SAVED FOREVER - " + Object.keys(SOUL_DB).length + " friends");
    return true;
  }catch(e){
    logError('SAVE_FAIL', e.message);
    return false;
  }
}

loadSoul();

setInterval(()=>{
  BACKUP_CHECK_COUNT++;
  console.log("AUTO BACKUP CHECK #" + BACKUP_CHECK_COUNT + " - " + new Date().toLocaleString());
  try{
    if(!fs.existsSync(SOUL_FILE)){
      logError('FILE_MISSING', 'soul.json missing');
      if(fs.existsSync(BACKUP_FILE)){
        let b = fs.readFileSync(BACKUP_FILE,'utf8');
        fs.writeFileSync(SOUL_FILE, b);
        let p = JSON.parse(b);
        SOUL_DB = Object.assign({}, DEFAULT_SOUL, p.SOUL_DB || {});
        logFix("File missing - restored from backup1 FOREVER");
      } else if(fs.existsSync(BACKUP_FILE2)){
        let b = fs.readFileSync(BACKUP_FILE2,'utf8');
        fs.writeFileSync(SOUL_FILE, b);
        let p = JSON.parse(b);
        SOUL_DB = Object.assign({}, DEFAULT_SOUL, p.SOUL_DB || {});
        logFix("File missing - restored from backup2 FOREVER");
      } else {
        saveSoul();
        logFix("No backup - recreated FOREVER");
      }
    } else {
      let data = fs.readFileSync(SOUL_FILE,'utf8');
      let parsed = JSON.parse(data);
      if(!parsed.SOUL_DB || Object.keys(parsed.SOUL_DB).length===0) throw new Error('Empty DB');
      fs.writeFileSync(BACKUP_FILE, JSON.stringify(parsed,null,2));
      if(BACKUP_CHECK_COUNT % 3 === 0){
        fs.writeFileSync(BACKUP_FILE2, JSON.stringify(parsed,null,2));
      }
      console.log("Backup OK - " + Object.keys(parsed.SOUL_DB).length + " friends");
    }
  }catch(e){
    logError('AUTO_CHECK_CORRUPT', e.message);
    try{
      if(fs.existsSync(BACKUP_FILE)){
        let b = fs.readFileSync(BACKUP_FILE,'utf8');
        let p = JSON.parse(b);
        if(p.SOUL_DB && Object.keys(p.SOUL_DB).length>0){
          fs.writeFileSync(SOUL_FILE, JSON.stringify(p,null,2));
          SOUL_DB = Object.assign({}, DEFAULT_SOUL, p.SOUL_DB);
          logFix("Corrupt fixed from backup1 - " + Object.keys(SOUL_DB).length + " restored FOREVER");
        }
      }
    }catch(e2){
      saveSoul();
    }
  }
}, 10*60*1000);

app.get('/', (req,res)=>{
  const mode = req.query.owner !== undefined ? 'owner' : 'public';
  const alertHtml = ERROR_ALERT && req.query.owner!==undefined ? '<div style="background:red;color:white;padding:8px;text-align:center;font-size:11px">'+ERROR_ALERT+'<br><a href="/api/clear-alert" style="color:yellow">Clear Alert</a></div>' : '';
  let html = '<html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>';
  html += 'body{background:#000;color:gold;font-family:sans-serif;margin:0}.top{text-align:center;border-bottom:2px solid gold;padding:10px}.chat{padding:10px;padding-bottom:80px}.m{border:1px solid gold;border-radius:15px;padding:10px;margin:8px;max-width:85%;word-wrap:break-word}.u{background:gold;color:#000;margin-left:auto}.b{background:#222}.bar{position:fixed;bottom:0;left:0;right:0;display:flex;padding:10px;background:#000;border-top:2px solid gold}input{flex:1;padding:12px;border-radius:20px;background:#111;color:gold;border:1px solid gold}button{margin-left:8px;padding:12px 18px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none}a{color:gold;border:1px solid gold;padding:6px 12px;border-radius:10px;text-decoration:none;margin:0 4px}.on{background:gold;color:#000}#lock{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:20px}';
  html += '</style></head><body>';
  html += '<div class="top"><h2>Q A.I by Abdulmalik | '+mode.toUpperCase()+' 100% FOREVER</h2><div><a href="/?public">PUBLIC</a><a href="/?owner" class="'+(mode==='owner'?'on':'')+'">OWNER</a></div><div style="font-size:10px">FRIENDS: '+Object.keys(SOUL_DB).length+' | PRIVACY: '+(PRIVACY_MODE?'ON':'OFF')+' | MODE: '+(GOD_MODE_ACTIVE?'CONTROLS':'GIST')+' | BACKUP: 10MIN</div></div>';
  html += alertHtml;
  html += '<div id="lock" style="display:'+(mode==='owner'?'flex':'none')+'"><h2 style="color:gold">OWNER LOCKED - FOREVER SOUL</h2><input id="pin" type="password" placeholder="Enter PIN" style="padding:12px;border-radius:20px;border:1px solid gold;background:#111;color:gold;width:250px;text-align:center"><button onclick="unlock()" style="margin-top:15px;padding:12px 30px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none">UNLOCK FOREVER SOUL</button><p id="err" style="color:red"></p></div>';
  html += '<div class="chat" id="c"></div><div class="bar"><input id="i" placeholder="Type to Qudra - Forever Saving"><button onclick="send()">Send</button></div>';
  html += '<script>var mode="'+mode+'";var isUnlocked=localStorage.getItem("ownerUnlocked")==="yes";var c=document.getElementById("c");var i=document.getElementById("i");var lock=document.getElementById("lock");if(mode==="owner"&&isUnlocked){lock.style.display="none";}if(mode==="public"){localStorage.removeItem("ownerUnlocked");lock.style.display="none";}';
  html += 'async function unlock(){var p=document.getElementById("pin").value;var r=await fetch("/api/verify-owner",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin:p})});var j=await r.json();if(j.ok){localStorage.setItem("ownerUnlocked","yes");lock.style.display="none";add("Salam King MY2! 100% Forever Soul Ready! Auto backup + auto fix active! I go alert you if error happen! Secret: Controls mode / Exit mode","b");}else{document.getElementById("err").innerText="Wrong PIN";}}';
  html += 'function add(t,cls){var d=document.createElement("div");d.className="m "+cls;d.innerText=t;c.appendChild(d);window.scrollTo(0,document.body.scrollHeight)}';
  html += 'async function send(){if(mode==="owner"&&localStorage.getItem("ownerUnlocked")!=="yes"){alert("Unlock first");return;}var q=i.value;if(!q)return;add("You: "+q,"u");i.value="";var tmp=document.createElement("div");tmp.className="m b";tmp.id="tmp";tmp.innerText="Q forever saving...";c.appendChild(tmp);try{var r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,isOwner:mode==="owner"&&localStorage.getItem("ownerUnlocked")==="yes"})});var j=await r.json();document.getElementById("tmp").remove();add("Q: "+j.reply,"b")}catch(e){document.getElementById("tmp").remove();add("Q: Error","b")}}';
  html += 'i.addEventListener("keypress",function(e){if(e.key==="Enter")send()});if(mode==="public"){add("Salam! I be Qudra AI by Abdulmalik - 100% Forever Permanent Soul!","b");}else if(isUnlocked){add("Salam King! Forever saving active! Family auto-save for GIST, Friends for Controls! If file crash I go fix and alert you!","b");}';
  html += '</scr'+'ipt></body></html>';
  res.send(html);
});

app.post('/api/verify-owner',(req,res)=>{res.json({ok:(req.body.pin||'')===OWNER_PIN});});
app.get('/health',(req,res)=>{res.json({status:'ALIVE 100% FOREVER', friends: Object.keys(SOUL_DB).length, privacy: PRIVACY_MODE, god: GOD_MODE_ACTIVE, backup_count: BACKUP_CHECK_COUNT, last_error: LAST_ERROR, last_fix: LAST_FIX, alert: ERROR_ALERT, files: {soul: fs.existsSync(SOUL_FILE), b1: fs.existsSync(BACKUP_FILE), b2: fs.existsSync(BACKUP_FILE2)}, uptime: process.uptime(), time: new Date().toISOString()});});
app.get('/keepalive',(req,res)=>{res.send('ALIVE FOREVER '+new Date().toISOString());});
app.get('/api/clear-alert',(req,res)=>{ERROR_ALERT=null; res.redirect('/?owner');});

app.post('/api/chat', async (req,res)=>{
  const msg=(req.body.message||'').toString();
  const low=msg.toLowerCase().trim();
  const isOwner=req.body.isOwner===true;
  const GROQ=process.env.GROQ_API_KEY;
  let alertPrefix = "";
  if(isOwner && ERROR_ALERT){ alertPrefix
