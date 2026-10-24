const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const PORT = process.env.PORT || 10000;

// PERMANENT MEMORY (Amina bug fixed)
let memory = { chats: [], soul: "Qudra OS 300 years - Built by Abdulmalik" };

// FANTASY BLUE AI ENDPOINT
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  memory.chats.push({ user: message, time: new Date() });
  
  // AI REPLY - Fantasy Blue Magic
  const reply = `King! You say "${message}"? I hear you with Fantasy Blue light! ✨ Built by Abdulmalik - I go dey with you forever! Qudra OS dey active. Tell me wetin you want make I do next? 🌳`;
  
  res.json({ reply });
});

app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));
app.get('/settings', (req,res)=> res.sendFile(path.join(__dirname,'settings.html')));
app.get('/manager', (req,res)=> res.sendFile(path.join(__dirname,'manager.html')));
app.get('/owner', (req,res)=> res.sendFile(path.join(__dirname,'owner.html')));

app.listen(PORT, ()=> console.log(`Q FANTASY BLUE LIVE ON ${PORT}`));
