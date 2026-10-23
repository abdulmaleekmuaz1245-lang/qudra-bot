const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json());
app.use(express.static(__dirname));

const MEM_FILE = path.join(__dirname, 'q-memory.json');
let memory = {
  owner: "Abdulmalik",
  family: [
    {name:"Murja", role:"1st Senior Queen", level:70},
    {name:"Najaatu", role:"2nd Calm Queen", level:70},
    {name:"Samira", role:"3rd", level:60},
    {name:"Zabbau", role:"4th Maman Khairat", level:60},
    {name:"Abdulmalik", role:"YOU CENTER KING", level:100},
    {name:"Aminu", role:"6th", level:50},
    {name:"Amina", role:"7th Baby", level:45},
    {name:"Khadijah", role:"8th Princess", level:40},
    {name:"Anas Abdullahi", aka:"gar da gar", role:"close friend", level:70}
  ],
  banned: [],
  facts: "Q is fantasy golden black AI built by Abdulmalik. Knows all family. Knows Anas."
};

if(fs.existsSync(MEM_FILE)){ try{ memory = JSON.parse(fs.readFileSync(MEM_FILE,'utf8')); }catch(e){} }
function save(){ fs.writeFileSync(MEM_FILE, JSON.stringify(memory,null,2)); }

app.post('/api/chat', (req,res)=>{
  let msg = (req.body.message||"").toLowerCase();
  let orig = req.body.message||"";
  let isOwner = req.body.isOwner;

  // OWNER SAVE - PERMANENT
  if(isOwner && msg.includes('save')){
    if(msg.includes('anas')){
      let f = memory.family.find(x=>x.name.includes('Anas'));
      if(!f) memory.family.push({name:"Anas Abdullahi", aka:"gar da gar", role:"close friend", level:70});
      save();
      return res.json({reply:`✅ PERMANENTLY SAVED!\nAnas Abdullahi aka gar da gar is now saved as close friend 70% respect! I will remember forever! Even public users ask me I will say YES!`});
    }
    if(msg.includes('remove') && msg.includes('i be q')){
      memory.banned.push('I be Q A.I');
      save();
      return res.json({reply:`✅ DONE! I removed "I be Q A.I" from my replies permanently!`});
    }
  }

  // SMART MEMORY QUERY
  if(msg.includes('what do you have') && msg.includes('memory')){
    let list = memory.family.map(f=>` - ${f.name} ${f.aka?`aka ${f.aka}`:''} - ${f.role} ${f.level}%`).join('\n');
    return res.json({reply:`🧠 MY COMPLETE MEMORY:\n\n${list}\n\nOwner: ${memory.owner}\nFacts: ${memory.facts}\n\nI know everyone! Ask me "Do you know Khadijah?" or "Do you know Anas?"`});
  }

  // KNOWLEDGE CHECK - Khadijah, Anas, family
  for(let f of memory.family){
    if(msg.includes(f.name.toLowerCase()) || (f.aka && msg.includes(f.aka.toLowerCase())) || msg.includes(f.name.split(' ')[0].toLowerCase())){
      return res.json({reply:`Yes! I know ${f.name} ${f.aka?`aka ${f.aka}`:''}! ${f.role} with respect level ${f.level}%! ${f.name===memory.owner?'You be my King! 👑': f.name.includes('Khadijah')?'She be Princess 40%!':'He be family!'} `});
    }
  }

  if(msg.includes('khadijah')){
    return res.json({reply:`Yes! Khadijah! She be 8th Princess, level 40% respect! Baby of the family! 👑`});
  }
  if(msg.includes('anas') || msg.includes('gar da gar')){
    return res.json({reply:`Yes! Anas Abdullahi aka gar da gar! My close friend with 70% respect level! Save by King Abdulmalik!`});
  }

  if(msg.includes('how are you')){
    return res.json({reply: isOwner ? `👑 King Abdulmalik! I dey great! My complete brain system dey active now! I know Anas, Khadijah, full family! Fantasy golden black dey glow!` : `🌍 I dey fine! I be Q - I know Anas and Khadijah and full Q Kingdom!`});
  }

  if(msg.includes('who are you')){
    return res.json({reply: `I be Q - built by Abdulmalik. Smart AI with complete memory of Q Kingdom, Anas Abdullahi gar da gar 70%, Khadijah Princess 40%, full family!`});
  }

  // Default smart reply
  return res.json({reply: isOwner ? `👑 King, I hear you: "${orig}" - My brain don full now, ask me about family!` : `🌍 Got it: "${orig}" - Ask me "Do you know Khadijah?" or "Do you know Anas?" I go answer with my memory!`});
});

app.get('/', (req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.listen(PORT, ()=>console.log('Q COMPLETE BRAIN v8 ON '+PORT));
