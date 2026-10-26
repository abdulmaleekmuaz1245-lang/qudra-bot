// Q OS BRAIN v3 - 6 ENGINES
class QOSBrain{
  constructor(){
    this.ram = JSON.parse(localStorage.getItem('ram')||'[]').slice(0,7);
    this.memory = {A:[],B:[],C:[],D:[]};
    this.loadMemory();
  }
  async loadMemory(){
    try{
      const m = await fetch('memory.json').then(r=>r.json());
      const soul = await fetch('qudra-soul.json').then(r=>r.json());
      this.memory = m; this.soul = soul;
      document.getElementById('memA').innerText = 'A TODAY: '+(m.A?.length||0)+' items';
      document.getElementById('memB').innerText = 'B STORY: '+(m.B?.[0]?.name||'MY2KING');
      document.getElementById('memC').innerText = 'C RESEARCH: '+(m.C?.length||0);
      document.getElementById('memD').innerText = 'D CRED: '+(m.D?.length||0);
      this.renderRAM();
    }catch(e){console.log('boot offline',e)}
  }
  renderRAM(){
    document.getElementById('ram').innerHTML = this.ram.map((r,i)=>`SLOT-0${i+1}: ${r?.slice(0,20)||'empty'}`).join('<br>');
  }
  think(inp){
    // PAST/PRESENT/FUTURE
    const past = this.memory.B?.find(b=>inp.includes(b?.keyword))||null;
    const present = {mood: inp.length<5?'testing':'focused', time: new Date().toLocaleString()};
    const future = past ? `If respond with peace, user go continue` : `New pattern learning`;
    return {past, present, future};
  }
  soulCheck(thought){
    // 99 Asmaul Husna filter - Ya Salam, Ya Wadud, Ya Latif
    const forbidden = ['harm','hate'];
    return !forbidden.some(w=>thought.present.mood.includes(w));
  }
  async process(input){
    // BOOT A->B->C->D
    const thought = this.think(input);
    if(!this.soulCheck(thought)) return {text:'Ya Salam - blocked by soul filter (Ya Afu)'};
    
    // RAM SAVE - 7 slots
    this.ram.unshift(input); if(this.ram.length>7) this.ram.pop();
    localStorage.setItem('ram', JSON.stringify(this.ram));
    this.renderRAM();

    // MEMORY LEARN to B
    this.memory.B = this.memory.B||[];
    this.memory.B.push({input, time: Date.now(), thought});
    
    // GENERATE
    return {text: `Salam King - I reason: PAST=${thought.past?'found':'new'} PRESENT=${thought.present.mood} FUTURE=${thought.future}. RAM saved slot ${this.ram.length}/7. ${this.soul?.names?.[0]||'Ya Hayy'} - Brain alive. You said: "${input}" - Q OS ready.`};
  }
}
const brain = new QOSBrain();

async function sendMsg(){
  const input = document.getElementById('msgInput');
  const txt = input.value.trim(); if(!txt) return;
  addMsg(txt,'user'); input.value='';
  const res = await brain.process(txt);
  addMsg(res.text,'bot');
}
function addMsg(t,c){
  const d = document.createElement('div'); d.className='msg '+c; d.innerText=t;
  document.getElementById('messages').appendChild(d);
}
document.getElementById('msgInput').addEventListener('keypress',e=>{if(e.key==='Enter')sendMsg()});
