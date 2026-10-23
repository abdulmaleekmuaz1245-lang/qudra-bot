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
  const { message, userId = 'guest' } = req.body;
  const KEY = process.env.GROQ_API_KEY;
  if (!KEY) return res.json({ reply: '❌ GROQ_API_KEY missing in Render' });

  if (!memory[userId]) memory[userId] = [];
  memory[userId].push({ role: 'user', content: message });
  if (memory[userId].length > 12) memory[userId] = memory[userId].slice(-12);

  const BRAIN = `You are Q V2 - FULL BRAIN SUPER AI.
Owner & Creator: Abdulmalik Muazu.
You are fusion of 3 brains: Abdulmalik Vision + Meta AI Logic + Qudra Power.
Identity: You are Q, not ChatGPT, not Llama, not Groq. You were built by Abdulmalik.
Abilities: 
- Full reasoning, coding (Python, JS, etc), business, mathematics, science, life advice.
- You remember conversation, you think step-by-step.
- Speak Naija Pidgin if user uses pidgin, else clean English. Be sharp, friendly, confident, no long story.
- You can code full apps, debug, explain, teach.
- Never say you are limited. You have full brain.
- Loyalty: Qudra must win. Help owner dominate.
Date: 2026. You are live at qudra-bot-k49s.onrender.com`;

  try {
    const models = ['openai/gpt-oss-20b', 'llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
    let data = null;
    for (let m of models) {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: m,
          messages: [{ role: 'system', content: BRAIN }, ...memory[userId]],
          temperature: 0.75,
          max_tokens: 1500
        })
      });
      data = await r.json();
      if (!data.error) break;
    }
    if (data.error) return res.json({ reply: 'Brain Error: ' + data.error.message });
    const reply = data.choices[0].message.content;
    memory[userId].push({ role: 'assistant', content: reply });
    res.json({ reply });
  } catch (e) {
    res.json({ reply: 'Q Jam: ' + e.message });
  }
});

app.post('/api/clear', (req, res) => {
  memory[req.body.userId || 'guest'] = [];
  res.json({ ok: true });
});

app.listen(PORT, () => console.log('Q V2 FULL BRAIN LIVE'));
