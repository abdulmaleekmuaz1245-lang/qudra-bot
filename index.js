const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json());
app.use(express.static(__dirname));

const MEM_FILE = path.join(__dirname, 'q-memory.json');
let mem = {
  family: [
    {n:"Murja", r:"Senior Queen", l:70},
    {n:"Najaatu", r:"Calm Queen", l:70},
    {n:"Samira", r:"3rd", l:60},
    {n:"Zabbau", r:"Maman Khairat", l:60},
    {n:"Abdulmalik", r:"CENTER KING", l:100},
    {n:"Aminu", r:"6th", l:50},
    {n:"Amina", r:"Baby", l:45},
    {n:"Khadijah", r:"Princess", l:40},
    {n:"Anas Abdullahi", aka:"gar da gar", r:"close friend", l:70}
  ]
};
if(fs.existsSync(MEM_FILE)){try{mem=JSON.parse(fs.readFileSync(MEM_FILE,'utf8'))}catch(e){}}
const save=()=>fs.writeFileSync(MEM_FILE,JSON.stringify(mem,null,2));

app.post('/api/chat',(req,res)=>{
  let m=(req.body.message||"").toLowerCase();
  let orig=req.body.message||"";
  let isOwner=req.body.isOwner;

  // Memory query
  if(m.includes('what') && m.includes('memory')){
    let list=mem.family.map(f=>`${f.n} ${f.aka?`aka ${f.aka}`:''} - ${f.r} ${f.l}%`).join('\n');
    return res.json({reply:`🧠 MY MEMORY:\n${list}\n\nI know full Q Kingdom!`});
  }
  // Check any known name
  for(let f of mem.family){
    if(m.includes(f.n.toLowerCase()) || (f.aka && m.includes(f.aka)) || m.includes(f.n.split(' ')[0].toLowerCase())){
      return res.json({reply:`Yes! I know ${f.n} ${f.aka?`aka ${f.aka}`:''}! ${f.r} with ${f.l}% respect! ${f.n.includes('Abubakar')?'':''}`});
    }
  }
  if(m.includes('khadijah')) return res.json({reply:`Yes! Khadijah - 8th Princess 40%!`});
  if(m.includes('anas')||m.includes('gar da gar')) return res.json({reply:`Yes! Anas Abdullahi aka gar da gar - my close friend 70% respect! Saved by King Abdulmalik! 👑`});
  
  // Unknown person like Abubakar
  if(m.includes('who is')||m.includes('abubakar')){
    return res.json({reply:`I never save Abubakar yet. I know Anas Abdullahi aka gar da gar (70% close friend), Khadijah Princess (40%), and full Q Kingdom family. If you want, tell owner to save Abubakar with level!`});
  }
  if(m.includes('how are u')||m.includes('how are you')){
    return res.json({reply:isOwner?`👑 King Abdulmalik! I dey great! Complete brain dey active, I know Anas, Khadijah, full family! No more dummy reply!`:`Hey! I dey fine! I know Q Kingdom family well!`});
  }
  if(m.includes('who are you')){
    return res.json({reply:`I be Q - fantasy golden black brain built by Abdulmalik. I know Anas gar da gar 70% and Khadijah Princess 40% and full family!`});
  }
  return res.json({reply:isOwner?`👑 King: "${orig}" - Ask me about family, I sabi!`:`Got it: "${orig}" - Try "Do you know Anas?" or "Do you know Khadijah?"`});
});

app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.listen(PORT,()=>console.log('Q v9 SMART ON '+PORT));
