const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

let ram = [];
let memory = {A:[],B:[],C:[],D:[]};
try{ memory = JSON.parse(fs.readFileSync(path.join(__dirname,'memory.json'),'utf8')); ram = memory.A || []; }catch(e){}

function processQ(text){
  ram.unshift({input:text, time:Date.now()});
  if(ram.length>7) ram.pop();
  memory.A = ram;
  try{ fs.writeFileSync(path.join(__dirname,'memory.json'), JSON.stringify(memory,null,2)); }catch(e){}
  return `Ya Salam King! Q OS don receive: "${text}". PAST=MY2KING FOUND, PRESENT=focused, FUTURE=learning. RAM ${ram.length}/7 active. Ya Hayy - Brain dey online 100%.`;
}

app.get('/api/health', (req,res)=>{
  res.json({status:"Q OS ONLINE", ram: ram.length, engines:6});
});

app.post('/api/chat', (req,res)=>{
  console.log("CHAT RECEIVED:", req.body);
  const msg = req.body.message || req.body.text || "Salam";
  const reply = processQ(msg);
  res.json({reply: reply});
});

app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>{ 
  console.log(`Q OS BOOT OK on ${PORT}`);
});
