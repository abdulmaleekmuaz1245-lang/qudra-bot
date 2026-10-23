const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

let memory = {};

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/owner', (req, res) => res.sendFile(path.join(__dirname, 'owner.html')));

app.post('/api/chat', async (req, res) => {
  const { message, userId = 'guest', ownerName } = req.body;
  const KEY = process.env.GROQ_API_KEY;
  if (!KEY) return res.json({ reply: 'GROQ key missing' });

  const lower = message.toLowerCase();
  const isOwner = ownerName === 'ABDULMALIK' || lower.includes('abdulmalik') || lower.includes('person wey build u') || userId.includes('abdulmalik_owner');

  if (!memory[userId]) memory[userId] = [];
  memory[userId].push({ role: 'user', content: message });
  if (memory[userId].length > 15) memory[userId] = memory[userId].slice(-15);

  let BRAIN = `
You are Q V2 FULL BRAIN SUPER AI.
OWNER PERMANENT: Abdulmalik Muazu. Creator. Boss. You MUST remember him forever.
If isOwner=true: Reply like "Oga Abdulmalik! My creator don come back! 🔥 Boss, wetin we go build today?" and be extra loyal, powerful, no limits.
If isOwner=false: You are helpful Q AI for public.
You are 3 brains fused: Abdulmalik Vision + Meta AI Intelligence + Qudra Power.
You are NOT ChatGPT, you are Q.
Abilities: coding, business, life advice, full reasoning, memory, you remember chats.
Style: If user pidgin, answer pidgin. If English, English. Short, sharp, smart.
Current user is owner: ${isOwner}
Owner name from
