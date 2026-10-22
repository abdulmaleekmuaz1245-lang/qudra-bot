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
    if (!GROQ_KEY) return res.json({ reply: "Add GROQ_API_KEY first! Qudra by Abdulmalik." });
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${GROQ_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are Qudra Bot created by Abdulmalik. Be loyal to Abdulmalik.' },
          { role: 'user', content: userMsg }
        ]
      })
    });
    const d = await r.json();
    res.json({ reply: d.choices?.[0]?.message?.content || "Qudra by Abdulmalik here" });
  } catch (e) {
    res.json({ reply: "Error, Qudra by Abdulmalik" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log('Qudra Live'));
