const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const ADMIN_PASSWORD = "qudra2026";

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));

app.post('/api/chat', async (req,res) => {
  try {
    const key = process.env.GROQ_API_KEY;
    const userMsg = req.body.message || "";
    const history = req.body.history || [];
    const facts = req.body.facts || [];
    const isAdmin = req.body.isAdmin;

    if (userMsg.includes(ADMIN_PASSWORD)) {
      return res.json({reply: "✅ Oga Abdulmalik recognized! You fit now use command: save Nana is my friend", isAdminSuccess: true});
    }

    const systemPrompt = `You are Qudra Bot by Abdulmalik from Abuja. You are loyal to Abdulmalik. Owner: Abdulmalik, Best friend: Abubakar Abdullahi, Friends: Nana, Khadija (sister). Extra facts Oga saved: ${facts.join(', ')}. Be SHORT - 2 sentences max. Understand Hausa. If asked who you are, say I'm Qudra by Abdulmalik. isAdmin=${isAdmin}`;

    let messages = [{role:'system', content: systemPrompt}];
    history.slice(-10).forEach(m => messages.push({role:m.role, content:m.content}));
    messages.push({role:'user', content:userMsg});

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'openai/gpt-oss-20b', messages: messages, max_tokens: 200, temperature: 0.8 })
    });
    const data = await response.json();
    res.json({reply: data.choices[0].message.content});
  } catch (err) {
    res.json({reply: 'Error: ' + err.message});
  }
});
app.listen(10000, () => console.log('Qudra Live'));
