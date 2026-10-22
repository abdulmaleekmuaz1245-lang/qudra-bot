const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const GROQ_KEY = process.env.GROQ_API_KEY;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const userMsg = req.body.message;
    if (!GROQ_KEY) return res.json({ reply: "GROQ_API_KEY never add yet! I am Qudra by Abdulmalik." });

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are Qudra Bot, created by Abdulmalik. Loyal, helpful, smart. Never say you are Meta AI or ChatGPT.' },
          { role: 'user', content: userMsg }
        ]
      })
    });
    const d = await r.json();
    res.json({ reply: d.choices?.[0]?.message?.content || "I am Qudra by Abdulmalik." });
  } catch (e) {
    console.error(e);
    res.json({ reply: "Brain error, try again. Qudra by Abdulmalik." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Qudra Live'));
