// Q OS BRAIN v3 - SERVER VERSION (keeps alive for Render)
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

class QOSBrain{
  constructor(){
    this.ram = [];
    this.memory = {A:[],B:[],C:[],D:[]};
    try{
      const raw = fs.readFileSync(path.join(__dirname,'memory.json'),'utf8');
      this.memory = JSON.parse(raw);
      this.ram = this.memory.A?.slice(-7) || [];
    }catch(e){ console.log('boot fresh'); }
  }
  think(inp){
    const past = this.memory.B?.[0] || null;
    return {past, present:{mood:'focused',time:new Date().toLocaleString()}, future:'Learn pattern'};
  }
  process(input){
    this.ram.unshift({input, time: Date.now()});
    if(this.ram.length>7) this.ram.pop();
    this.memory.A = this.ram;
    try{ fs.writeFileSync('memory.json', JSON.stringify(this.memory,null,2)); }catch(e){}
    return `Salam King! Q OS alive. You said "${input}". RAM ${this.ram.length}/7. Ya Hayy Ya Qayyum - engines online.`;
  }
}
const brain = new QOSBrain();

// Routes
app.get('/', (req,res)=>{ res.sendFile(path.join(__dirname,'index.html')); });

app.post('/api/chat', (req,res)=>{
  const msg = req.body.message || 'Salam';
  const reply = brain.process(msg);
  res.json({reply, engines:6, soul:"Ya Salam"});
});

app.get('/api/health', (req,res)=>{
  res.json({status:"Q OS ONLINE", engines:["THINK","MEMORY","FETCH","SOUL","RAM","BOOT"], ram:brain.ram.length});
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>{ 
  console.log(`Q OS BOOT OK - 6 ENGINES on port ${PORT}`);
  console.log(`Live at https://qudra-bot-k49r.onrender.com`);
});
