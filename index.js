const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/chat', async (req,res) => {
  try {
    const key = process.env.GROQ_API_KEY;
    if (!key) {
      return res.json({reply: 'Add GROQ_API_KEY first! Qudra by Abdulmalik.'});
    }
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {role: 'system', content: 'You are Qudra Bot by Abdulmalik.'},
          {role: 'user', content: req.body.message}
        ]
      })
    });
    const data = await response.json();
    if (data.error) {
      return res.json({reply: 'Groq Error: ' + data.error.message});
    }
    const answer = data.choices[0].message.content;
    res.json({reply: answer});
  } catch (err) {
    res.json({reply: 'Server Error: ' + err.message});
  }
});

app.listen(10000, () => console.log('Live'));
