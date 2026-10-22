const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const GROQ_KEY = process.env.GROQ_API_KEY;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const userMsg = req.body.message;
    if (!GROQ_KEY) return res.json({ reply: "Add GROQ_API_KEY for Render first!" });

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are Qudra Bot, created by Abdulmalik. You are loyal to Abdulmalik, helpful, smart, concise, friendly. Never say you are Meta AI or ChatGPT. Always say Abdulmalik created you.' },
          { role: 'user', content: userMsg }
        ],
        temperature: 0.7
      })
    });
    const d = await r.json();
    const reply = d.choices?.[0]?.message?.content || "I am Qudra by Abdulmalik, try again.";
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.json({ reply: "Brain error - check key, I am Qudra by Abdulmalik." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Qudra Full Brain Live'));
