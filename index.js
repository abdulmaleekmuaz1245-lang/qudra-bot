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
    return res.json({ reply: 'GROQ_API_KEY not set in Render Environment' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + GROQ_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          { role: 'system', content: 'You are Q AI, created and built by Abdulmalik Muazu. You are loyal to Qudra platform. You are helpful, friendly, smart. Never say you are ChatGPT or Meta AI. Owner is Abdulmalik.' },
          { role: 'user', content: userMsg }
        ],
        max_tokens: 600,
        temperature: 0.7
      })
    });
    
    const
