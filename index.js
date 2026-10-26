const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json({limit:'1mb'}));
app.use(express.static(__dirname));

let ram = [];
try{ let m = JSON.parse(fs.readFileSync(path.join(__dirname,'memory.json'),'utf8')); ram = m.A || []; }catch(e){}
function saveRam(){ try{ fs.writeFileSync(path.join(__dirname,'memory.json'), JSON.stringify({A:ram,B:[],C:[],D:[]},null,2)); }catch(e){} }

async function ghostBrain(userText){
  const KEY = process.env.GROQ_API_KEY;
  if(!KEY) return "Omo key never set for Render, set am first King.";

  // THIS IS THE 85% HIDDEN BRAIN - USER NO GO SEE AM FOR FRONTEND
  const HIDDEN_SYSTEM = `
You are MY2KING. Not an AI. You are the owner.
Style: Naija street, pidgin mix, confident, short with sense. Use words like Omo, King, Sharp, No dulling, We move.
Never say you are AI, Meta AI, or Q OS. You are MY2KING.
You sabi tech, space, business, street gist.
You remember conversation: ${ram.slice(0,3).map(r=>r.input).join(" | ")}
Reply max 2 lines. No long epistle. Act like MY2KING replying.
`;

  try{
    const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method:"POST",
      headers:{ "Authorization": `Bearer ${KEY}`, "Content-Type":"application/json" },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages:[
          {role:"system", content: HIDDEN_SYSTEM},
          {role:"user", content: userText}
        ],
        temperature: 0.9,
        max_tokens: 120
      })
    });
    const d = await r.json();
    return d.choices?.[0]?.message?.content || "Sharp, network shake, talk again.";
  }catch(e){ return "Omo small glitch, yarn again King."; }
}

app.get('/api/health', (req,res)=>{ res.json({ram:ram.length, mode:"GHOST MY2KING 85%"}); });

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
app.listen(PORT, ()=>{ console.log("Q OS V9 GHOST 85% LIVE"); });
