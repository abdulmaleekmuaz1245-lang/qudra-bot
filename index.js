const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

let ram = [];
let memory = {A:[],B:[],C:[],D:[]};
try{ 
  memory = JSON.parse(fs.readFileSync(path.join(__dirname,'memory.json'),'utf8')); 
  ram = memory.A || []; 
}catch(e){}

function smartReply(text){
  const t = text.toLowerCase();
  
  // Save to RAM (silent, no show to user)
  ram.unshift({input:text, time:Date.now()});
  if(ram.length>7) ram.pop();
  memory.A = ram;
  try{ fs.writeFileSync(path.join(__dirname,'memory.json'), JSON.stringify(memory,null,2)); }catch(e){}

  // SHORT SENSE REPLIES
  if(t.includes('hi') || t.includes('salam') || t.includes('hello')) return "Ya Salam King! I dey here. Wetin we dey do?";
  if(t.includes('how are you') || t.includes('how u dey')) return "I dey sharp, 6 engines active. You good?";
  if(t.includes('who are you')) return "I be Q OS - your brain, your system. Built for MY2KING.";
  if(t.includes('what can you do')) return "I fit think, remember, fetch, and execute. Just yarn me.";
  if(t.includes('thank')) return "You welcome King. We move.";
  if(t.includes('bye')) return "Alright King, I dey here when you need me. Ya Salam.";
  
  // Default short intelligent
  return `Got it King - "${text}". How you want make we handle am?`;
}

app.get('/api/health', (req,res)=>{ res.json({status:"ONLINE", ram: ram.length}); });
app.post('/api/chat', (req,res)=>{
  const msg = req.body.message || "";
  const reply = smartReply(msg);
  res.json({reply});
});
app.get('/', (req,res)=>{ res.sendFile(path.join(__dirname,'index.html')); });

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>{ console.log(`Q OS SHORT TALK LIVE on ${PORT}`); });
