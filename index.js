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
    return res.json({ reply: 'Add GROQ_API_KEY for full brain, but I hear you: ' + userMsg });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + GROQ_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: 'You are Q AI, built by Abdulmalik. You are loyal to Qudra. You are friendly and helpful. You never say you are ChatGPT. Owner is Abdulmalik.' },
          { role: 'user', content: userMsg }
        ],
        max_tokens: 500
      })
    });
    const data = await response.json();
    const aiReply = data.choices[0].message.content;
    res.json({ reply: aiReply });
  } catch (err) {
    res.json({ reply: 'Small jam: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log('Q Bot LIVE');
});
