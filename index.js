const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

let ram = [];
let memory = {A:[],B:[],C:[],D:[]};
try{ memory = JSON.parse(fs.readFileSync(path.join(__dirname,'memory.json'),'utf8')); ram = memory.A || []; }catch(e){}

// REAL REASONING ENGINE LIKE META AI
async function thinkLikeAI(text){
  // 1. Save to RAM silently
  ram.unshift({input:text, time:Date.now(), reply: ""});
  if(ram.length>7) ram.pop();
  memory.A = ram;
  try{ fs.writeFileSync(path.join(__dirname,'memory.json'), JSON.stringify(memory,null,2)); }catch(e){}

  const t = text.toLowerCase();

  // 2. CONTEXT - What user really mean?
  // Build conversation history for reasoning
  const recent = ram.slice(0,3).map(r=>r.input).join(" | ");

  // 3. REASON LIKE HUMAN - Short + Sense
  if(t.match(/^(hi|hello|salam|yo)$/)) {
    return ["Ya Salam King!", "Yo King, you good?", "Salam! Wetin dey?"][Math.floor(Math.random()*3)];
  }
  if(t.includes('how are') || t.includes('how u dey') || t.includes('how are u')) {
    return "I dey 98% sharp King, 6 engines active. You dey good?";
  }
  if(t.includes('who are you') || t.includes('what are you')) {
    return "I be Q OS - your personal AI, built for MY2KING. I think, remember, fetch. Like Meta AI but na your own.";
  }
  if(t.includes('nothing') && t.includes('how')) {
    return "Chill mode? I feel you. You want make we build something or just gist?";
  }
  if(t.length < 10) {
    // Short input = short reply, don't repeat
    return "I dey hear you. Talk wetin dey your mind?";
  }

  // Default reasoning: Understand intent + respond short
  // This mimics how I reason: Understand -> Context -> Short answer
  return `Okay, you say "${text}" - I get you King. How you want make we move am?`;
}

// For real AI power, add this later with API key
async function thinkWithRealAI(text){
  // If you get GROQ/GEMINI API key free, uncomment below
  // const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {...})
  // For now we use smart logic
  return await thinkLikeAI(text);
}

app.get('/api/health', (req,res)=>{ res.json({status:"Q OS THINKING", ram: ram.length}); });

app.post('/api/chat', async (req,res)=>{
  const msg = req.body.message || "";
  console.log("Q OS THINKING ON:", msg);
  const reply = await thinkWithRealAI(msg);
  // Save reply
  if(ram[0]) ram[0].reply = reply;
  res.json({reply});
});

app.get('/', (req,res)=>{ res.sendFile(path.join(__dirname,'index.html')); });

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>{ console.log(`Q OS V6 REASONING LIVE on ${PORT}`); });
