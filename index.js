const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/owner', (req, res) => {
  res.sendFile(path.join(__dirname, 'owner.html'));
});

app.post('/api/chat', async (req, res) => {
  const userMsg = req.body.message || '';
  const GROQ_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_KEY) {
    return res.json({ reply: 'Oga, GROQ_API_KEY never set for Render. Go set am!' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + GROQ_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: 'You are Q AI, built by Abdulmalik. Loyal to Qudra. Helpful, friendly.' },
          { role: 'user', content: userMsg }
        ]
      })
    });
    const data = await response.json();
    if (data.error) {
      return res.json({ reply: 'Groq Error: ' + data.error.message });
    }
    const aiReply = data.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (err) {
    res.json({ reply: 'Jam: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log('Q Bot LIVE');
});
