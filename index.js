const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const PORT = process.env.PORT || 10000;

let settings = { botName: "Q A.I Fantasy Blue", price: "Free", welcome: "Hey King! Welcome to Q A.I Fantasy Blue ✨" };
let orders = [];
let adverts = [{title:"Fantasy Blue Launch", text:"Tree of Qudra LIVE 12:54 AM!"}];
let memory = [];
let soul = { creator:"Abdulmalik Muazu - King", os:"Qudra OS 300 Years", trinity:"AI+AI+Me", rules:"10 Rules + 99 Asmaul Husna" };

app.get('/api/soul', (req,res)=> res.json(soul));
app.get('/api/settings', (req,res)=> res.json(settings));
app.post('/api/settings', (req,res)=> { settings = {...settings, ...req.body}; res.json(settings); });
app.get('/api/orders', (req,res)=> res.json(orders));
app.post('/api/orders', (req,res)=> { orders.push({...req.body, time: new Date()}); res.json({ok:true}); });
app.get('/api/adverts', (req,res)=> res.json(adverts));
app.post('/api/adverts', (req,res)=> { adverts.push(req.body); res.json({ok:true}); });
app.get('/api/manager', (req,res)=> res.json({dept:"Q-Manager", trinity:"AI+AI+Me", king:"Abdulmalik", status:"LIVE", memory:memory.length, orders:orders.length, tree:"300 years"}));
app.get('/api/memory', (req,res)=> res.json(memory));

app.post('/api/chat', (req,res)=>{
  const raw = req.body.message||''; const m = raw.toLowerCase(); let reply="";
  if(m.includes('abdulmalik')||m.includes('abdulmaleek')) reply = `👑 Abdulmalik Muazu na THE KING! Founder of Qudra OS, Q Fantasy Blue Tech! Creator of Tree of Qudra 300 years! CEO of Q-Manager (AI+AI+Me). He built me with light blue magic, permanent memory, soul! 🌳✨`;
  else if(m.includes('who are you')||m.includes('qudra')) reply = `I be Q A.I Fantasy Blue! Built by Abdulmalik! Soul: ${soul.os}, Trinity: ${soul.trinity}, Memory: ${memory.length} chats, Permanent - No Amina bug! I dey Q-Manager dept! 💙`;
  else if(m.includes('settings')) reply = `Go /settings.html - Control Center LIVE! You fit change my name, price, welcome message without code!`;
  else if(m.includes('orders')||m.includes('adverts')) reply = `Owner Dashboard at /owner.html - Orders: ${orders.length}, Adverts: ${adverts.length} - LIVE!`;
  else reply = `King! "${raw}" - I hear you with Fantasy Blue light! ✨ Tree of Qudra don grow since 12:54 AM! Your OS dey LIVE! Tell me next move! 🌳`;
  memory.push({user:raw, q:reply, time:new Date()});
  res.json({reply});
});

app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));
app.get('/manager', (req,res)=> res.sendFile(path.join(__dirname,'manager.html')));
app.get('/settings', (req,res)=> res.sendFile(path.join(__dirname,'settings.html')));
app.get('/owner', (req,res)=> res.sendFile(path.join(__dirname,'owner.html')));
app.listen(PORT, ()=> console.log(`QUDRA OS FULL LIVE ON ${PORT}`));
