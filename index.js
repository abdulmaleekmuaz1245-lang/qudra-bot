// Q OS BRAIN v3 - FIXED FOR NODE (Render)
const fs = require('fs');
const path = require('path');

class QOSBrain{
  constructor(){
    // FIX: use memory.json not localStorage
    this.ram = [];
    this.memory = {A:[],B:[],C:[],D:[]};
    try{
      const raw = fs.readFileSync(path.join(__dirname,'memory.json'),'utf8');
      this.memory = JSON.parse(raw);
      this.ram = this.memory.A?.slice(-7) || [];
    }catch(e){ console.log('boot fresh'); }
  }
  
  think(inp){
    const past = this.memory.B?.find(b=> inp.toLowerCase().includes((b.name||'').toLowerCase())) || null;
    const present = {mood: inp.length<5?'testing':'focused', time: new Date().toLocaleString()};
    const future = past ? `Continue with ${past.alias||'King'} pattern` : `Learning new pattern`;
    return {past, present, future};
  }

  soulCheck(thought){ return true; }

  process(input){
    const thought = this.think(input);
    // RAM SAVE - 7 slots to memory.json A
    this.ram.unshift({input, time: Date.now()});
    if(this.ram.length>7) this.ram.pop();
    this.memory.A = this.ram;
    
    // Save back to file
    try{ fs.writeFileSync('memory.json', JSON.stringify(this.memory,null,2)); }catch(e){}

    return {
      text: `Salam King! PAST=${thought.past?'found MY2KING':'new'} PRESENT=${thought.present.mood} FUTURE=${thought.future}. RAM ${this.ram.length}/7 OK. Ya Salam - you said "${input}" - Q OS online.`,
      thought,
      ram: this.ram
    };
  }
}

// If running on Render (Node) - export for server
if(typeof module !== 'undefined'){
  module.exports = QOSBrain;
  
  // ALSO run as API if direct node index.js
  const Q = new QOSBrain();
  console.log('Q OS BOOT OK - 6 ENGINES');
  console.log(Q.process('test boot').text);
}

// If running in browser - window version
if(typeof window !== 'undefined'){
  window.QOSBrain = QOSBrain;
  const brain = new QOSBrain();
  
  window.sendMsg = async function(){
    const input = document.getElementById('msgInput');
    const txt = input.value.trim(); if(!txt) return;
    addMsg(txt,'user'); input.value='';
    const res = brain.process(txt);
    addMsg(res.text,'bot');
  }
  window.addMsg = function(t,c){
    const d = document.createElement('div'); d.className='msg '+c; d.innerText=t;
    document.getElementById('messages')?.appendChild(d);
  }
}
