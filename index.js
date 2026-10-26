const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const app = express();
app.use(express.json({limit:'1mb'}));
app.use(express.static(__dirname));

let ram = [];
try{ let m = JSON.parse(fs.readFileSync(path.join(__dirname,'memory.json'),'utf8')); ram = m.A || []; }catch(e){}
function saveRam(){ try{ fs.writeFileSync(path.join(__dirname,'memory.json'), JSON.stringify({A:ram,B:[],C:[],D:[]},null,2)); }catch(e){} }

function callGroq(key, system, userText){
  return new Promise((resolve, reject)=>{
    const data = JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages:[{role:"system", content:system},{role:"user", content:userText}],
      temperature:0.9, max_tokens:120
    });
    const options = {
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers:{
        'Authorization': `Bearer ${key.trim()}`,
        'Content-Type':'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    const req = https.request(options, (res)=>{
      let body='';
      res.on('data', chunk=> body+=chunk);
      res.on('end', ()=>{
        try{
          const json = JSON.parse(body);
          if(json.error) reject(new Error(json.error.message));
          else resolve(json.choices?.[0]?.message?.content || "No reply");
        }catch(e){ reject(e); }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function ghostBrain(text){
  const KEY = process.env.GROQ_API_KEY;
  if(!KEY) return "Key no dey for Render.";
  const SYSTEM = `You are MY2KING. Naija street king, pidgin mix, confident, short with sense. Max 2 lines. Not AI. Memory: ${ram.slice(0,3).map(r=>r.input).join(" | ")}`;
  try{
    const reply = await callGroq(KEY, SYSTEM, text);
    return reply;
  }catch(e){
    return `ERROR: ${e.message}`;
  }
}

app.get('/api/health', (req,res)=>{ res.json({ram:ram.length, hasKey: !!process.env.GROQ_API_KEY}); });
app.post('/api/chat', async (req,res)=>{
  const msg = req.body.message || "";
  if(ram.length>=7) ram = ram.slice(0,4);
  ram.unshift({input:msg, time:Date.now()});
  if(ram.length>7) ram = ram.slice(0,7);
  saveRam();
  const reply = await ghostBrain(msg);
  res.json({reply});
});
app.get('/', (req,res)=>{ res.sendFile(path.join(__dirname,'index.html')); });
const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>{ console.log("Q OS V10 FINAL LIVE"); });
