const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const PORT = process.env.PORT || 10000;

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));

app.post('/api/chat', async (req,res) => {
  try {
    const key = process.env.GROQ_API_KEY;
    const userMsg = req.body.message || "Hi";
    const facts = (req.body.facts || []).join(', ');
    const prompt = `You are Qudra by Abdulmalik from Abuja. Facts: ${facts}. User: ${userMsg}. Reply short (1 sentence).`;

    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type':'application/json' },
      body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{role:'system', content:prompt},{role:'user', content:userMsg}], max_tokens:100 })
    });
    const d = await r.json();
    res.json({reply: d.choices[0].message.content});
  } catch(e) {
    res.json({reply: 'Oga network slow, but I hear you: ' + req.body.message});
  }
});
app.listen(PORT, () => console.log('Qudra live on ' + PORT));
