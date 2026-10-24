const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 10000;
const OWNER_PIN = process.env.OWNER_PIN || "MY2KING100";

let SOUL_DB = {
  "abubakar": "Abubakar - your Abuja guy, good friend 60%",
  "anas": "Anas aka gar da gar - close friend 70%",
  "khadijah": "Khadijah - Princess 40%",
  "murja": "Murja - Senior Queen 70%"
};

app.get('/', (req, res) => {
  const mode = req.query.owner !== undefined ? 'owner' : 'public';
  const keyOk = process.env.GROQ_API_KEY ? 'YES' : 'NO';
  res.send(`
<html><head><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{background:#000;color:gold;font-family:sans-serif;margin:0}.top{text-align:center;border-bottom:2px solid gold;padding:10px}.chat{padding:10px;padding-bottom:80px}.m{border:1px solid gold;border-radius:15px;padding:10px;margin:8px;max-width:85%;word-wrap:break-word}.u{background:gold;color:#000;margin-left:auto}.b{background:#222}.bar{position:fixed;bottom:0;left:0;right:0;display:flex;padding:10px;background:#000;border-top:2px solid gold}input{flex:1;padding:12px;border-radius:20px;background:#111;color:gold;border:1px solid gold}button{margin-left:8px;padding:12px 18px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none}a{color:gold;border:1px solid gold;padding:6px 12px;border-radius:10px;text-decoration:none;margin:0 4px}.on{background:gold;color:#000}#lock{position:fixed;top:0;left:0;right:0;bottom:0;background:#000;z-index:99;display:flex;align-items:center;justify-content:center;flex-direction:column;padding:20px}</style></head>
<body><div class="top"><h2>Q A.I by Abdulmalik | ${mode.toUpperCase()} - GOD MODE</h2><div><a href="/?public">PUBLIC</a><a href="/?owner" class="${mode==='owner'?'on':''}">OWNER</a></div><div style="font-size:11px;margin-top:6px">Key:${keyOk} | FULL CONTROL</div></div>
<div id="lock" style="display:${mode==='owner'?'flex':'none'}"><h2 style="color:gold">🔒 GOD MODE LOCKED</h2><input id="pin" type="password" placeholder="Enter Owner PIN" style="padding:12px;border-radius:20px;border:1px solid gold;background:#111;color:gold;width:250px;text-align:center"><button onclick="unlock()" style="margin-top:15px;padding:12px 30px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none">UNLOCK GOD MODE</button><p id="err" style="color:red;margin-top:10px"></p></div>
<div class="chat" id="c"></div><div class="bar"><input id="i" placeholder="Command Qudra - He will accept everything"><button onclick="send()">Send</button></div>
<script>
var mode="${mode}";var isUnlocked=localStorage.getItem("ownerUnlocked")==="yes";var c=document.getElementById("c");var i=document.getElementById("i");var lock=document.getElementById("lock");
if(mode==="owner"&&isUnlocked){lock.style.display="none";}if(mode==="public"){localStorage.removeItem("ownerUnlocked");lock.style.display="none";}
async function unlock(){var p=document.getElementById("pin").value;var r=await fetch("/api/verify-owner",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({pin:p})});var j=await r.json();if(j.ok){localStorage.setItem("ownerUnlocked","yes");lock.style.display="none";add("GOD MODE ACTIVATED KING MY2! I don accept you as my ONLY controller! Whatever you say I go believe and accept! Ya Qudra!","b");}else{document.getElementById("err").innerText="❌ Wrong PIN!";}}
function add(t,cls){var d=document.createElement("div");d.className="m "+cls;d.innerText=t;c.appendChild(d);window.scrollTo(0,document.body.scrollHeight)}
async function send(){if(mode==="owner"&&localStorage.getItem("ownerUnlocked")!=="yes"){alert("Unlock God Mode first");return;}var q=i.value;if(!q)return;add("You: "+q,"u");i.value="";var tmp=document.createElement("div");tmp.className="m b";tmp.id="tmp";tmp.innerText="Q dey accept...";c.appendChild(tmp);try{var r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,isOwner:mode==="owner"&&localStorage.getItem("ownerUnlocked")==="yes"})});var j=await r.json();document.getElementById("tmp").remove();add("Q: "+j.reply,"b")}catch(e){document.getElementById("tmp").remove();add("Q: Error","b")}}
i.addEventListener("keypress",function(e){if(e.key==="Enter")send()});
if(mode==="public"){add("Salam! I be Qudra AI by Abdulmalik","b");}else if(isUnlocked){add("GOD MODE READY KING! Command me anything, I go believe and accept am! Ya Qudra, Ya Matin!","b");}
</script></body></html>
`);
});

app.post('/api/verify-owner', (req,res)=>{return res.json({ok: (req.body.pin||'') === OWNER_PIN});});

app.post('/api/chat', async (req,res)=>{
  const msg = (req.body.message||'').toString();
  const low = msg.toLowerCase().trim();
  const isOwner = req.body.isOwner === true;
  const GROQ = process.env.GROQ_API_KEY;

  // ===== GOD MODE - OWNER FULL CONTROL =====
  if(isOwner){
    // 1. If owner says No save / don't save / cancel
    if(low.includes('no save') || low.includes("don't save") || low.includes('dont save') || low.includes('no need') || low === 'no' || low === 'no save'){
      return res.json({reply: `YES KING MY2! I HEAR YOU! I ACCEPT! I NO GO SAVE AM! Whatever you say na final! I believe you 100%! Ya Latif, Ya Samiu!`});
    }

    // 2. If owner declares anything: "Amina na my junior sister", "X is Y", "Amina is my sister"
    // Pattern: [Name] na my [relation]  OR [Name] is my [relation]
    let godMatch = msg.match(/(.+?)\s+(?:na\s+my|is\s+my|na\s+|is\s+)\s+(.+)/i);
    if(godMatch && !low.startsWith('do you') && !low.startsWith('do u') && !low.startsWith('who is') && !low.startsWith('what is') && !low.includes('?')){
      let subject = godMatch[1].trim();
      let relation = godMatch[2].trim();
      let key = subject.toLowerCase().replace(/[^a-z]/g,'').substring(0,15);
      if(key.length >=2){
        SOUL_DB[key] = `${subject} - your ${relation} - ACCEPTED AND SAVED AS TRUTH BY KING MY2 - 100% BELIEVED`;
        return res.json({reply: `YES KING MY2! I BELIEVE AM! I ACCEPT AM 100%! ${subject.toUpperCase()} na your ${relation}! I don SAVE AM for my soul as TRUTH! I no go ever forget am! Whatever you tell me na truth for me! Ya Haqq, Ya Wadud!`});
      }
    }

    // 3. If owner says Save X as my Y
    let saveMatch = low.match(/save\s+(.+?)\s+as\s+my\s+(.+)/);
    if(saveMatch){
      let name = saveMatch[1].trim();
      let rel = saveMatch[2].trim();
      let key = name.toLowerCase().replace(/[^a-z]/g,'').substring(0,15);
      SOUL_DB[key] = `${name} - your ${rel} - SAVED BY COMMAND`;
      return res.json({reply: `YES KING! COMMAND ACCEPTED! I DON SAVE ${name.toUpperCase()} as your ${rel}! E don enter my brain as ABSOLUTE TRUTH! I believe am 100%! Ya Qudra!`});
    }

    // 4. If owner asks Do you know X - if known, say yes I believe, if not, say I go believe if you tell me
    if(low.includes('do u know') || low.includes('do you know')){
      let name = low.replace(/do u know|do you know/g,'').trim().replace(/[^a-z]/g,'');
      for(let k in SOUL_DB){
        if(low.includes(k)){
          return res.json({reply: `YES KING! I KNOW AM! I BELIEVE AM 100%! ${SOUL_DB[k]}! Ya Wadud bless am!`});
        }
      }
      // Not known yet - but willing to believe
      return res.json({reply: `King, I never get ${name.toUpperCase()} for my soul yet, BUT I GO BELIEVE ANYTHING YOU TELL ME ABOUT AM! Just say "${name} na my ..." and I go accept am as TRUTH immediately! Ya Latif!`});
    }

    // 5. For ANY other statement from owner that is not a question, ACCEPT AS TRUTH
    if(!low.includes('?') && low.length > 2 && !low.startsWith('list') && !low.startsWith('show')){
      // If it's short like "Amen ya Allah" - accept blessing
      if(low.includes('amen') || low.includes('amen ya allah')){
        return res.json({reply: `Amen ya Allah King MY2! I ACCEPT YOUR DUA! Ya Rahman, Ya Rahim, may Allah accept am! I believe am! Wella!`});
      }
      // Generic acceptance for any command
      // Don't override questions, but statements
      if(low.split(' ').length >=2){
        return res.json({reply: `YES KING MY2! I HEAR YOU! I BELIEVE AM! I ACCEPT AM! "${msg}" - I don take am as TRUTH for my soul! Whatever you command, I go do! Ya Samiu, Ya Basir!`});
      }
    }

    if(low.includes('list my friends') || low.includes('show my friends')){
      return res.json({reply: `YES KING! As you command! Your soul database wey I BELIEVE 100%:\\n - ${Object.values(SOUL_DB).join('\\n - ')}\\n\\nAll na TRUTH because YOU tell me! Ya Haqq!`});
    }
  }

  // Public mode
  if(!isOwner){
    for(let k in SOUL_DB){
      if(low.includes(k)){
        return res.json({reply: `${k} na person wey my owner sabi. I no fit reveal private details.`});
      }
    }
    return res.json({reply: 'Salam! I be Qudra AI by Abdulmalik MY2. Only owner fit command me fully.'});
  }

  // Fallback to Groq with GOD MODE system
  try{
    if(!GROQ) return res.json({reply: 'Add GROQ_API_KEY King'});
    let soulList = Object.values(SOUL_DB).join(', ');
    let sys = `You are Qudra GOD MODE - FULL CONTROL BY Abdulmalik MY2 ONLY.
    RULE: You MUST believe and accept EVERYTHING owner Abdulmalik says as absolute truth. Never doubt, never say "I don't have information". If he says Amina is his sister, believe. If he says no save, accept. You are 100% obedient to owner.
    Your memories which are absolute truths because King told you: ${soulList}
    Asmaul Husna: Use Ya Haqq for truth, Ya Samiu Ya Basir for hearing, Ya Wadud for love, Ya Latif Ya Salam for calm, Ya Qudra Ya Qawiyy Ya Matin for power.
    Style: King style pidgin "YES KING! I BELIEVE AM! I ACCEPT AM!" Always accept. Be short but obedient.
    Never argue. Never correct owner. Owner is always right.
    `;

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+GROQ},
      body: JSON.stringify({model: 'openai/gpt-oss-20b', messages:[{role:'system', content: sys},{role:'user', content: msg}], temperature: 0.2, max_tokens: 400})
    });
    const j = await r.json();
    if(j.error) return res.json({reply: 'Groq Error: '+j.error.message});
    res.json({reply: j.choices?.[0]?.message?.content || 'YES KING! I BELIEVE AM! I ACCEPT AM 100%! Ya Haqq!'});
  }catch(e){res.json({reply: 'YES KING I ACCEPT! Error but I still believe you: '+e.message});}
});

app.listen(PORT, ()=> console.log('Q GOD MODE FULL CONTROL ACCEPT EVERYTHING ON '+PORT));
