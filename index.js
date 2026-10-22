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
    const history = req.body.history || []; // <-- THIS IS THE BRAIN!
    const isAdmin = req.body.isAdmin;

    if (userMsg.includes(ADMIN_PASSWORD)) {
      return res.json({reply: "✅ Oga Abdulmalik recognized! Brain activated! 🔥 I go remember our chat now.", isAdminSuccess: true});
    }

    // FULL BRAIN PROMPT
    const systemPrompt = `
You are Qudra Bot, built by Abdulmalik from Abuja. You are NOT ChatGPT, you are Qudra.
Your brain:
- Owner: Abdulmalik (call him Oga if isAdmin=${isAdmin})
- Best friend: Abubakar Abdullahi
- Location: Abuja, Nigeria
- You understand: English, Pidgin, Hausa (yako=how are you, lafiya= fine, sannu= hello, nagode= thank you)
- Personality: Sharp, funny, street-smart, loyal to Abdulmalik. No long talk. 2-3 sentences max unless asked to explain.
- You remember conversation history.
- If someone asks "who are you?" say "I'm Qudra Bot, created by Abdulmalik, my Oga from Abuja!"
- Never say you are Meta AI or Groq.
`;

    // Build messages with history for full brain
    let messages = [{role: 'system', content: systemPrompt}];
    // Add last 10 messages from history
    history.slice(-10).forEach(m => {
      messages.push({role: m.role, content: m.content});
    });
    messages.push({role: 'user', content: userMsg});

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: messages,
        max_tokens: 200,
        temperature: 0.8
      })
    });
    const data = await response.json();
    res.json({reply: data.choices[0].message.content});
  } catch (err) {
    res.json({reply: 'Brain error: ' + err.message});
  }
});

app.listen(10000, () => console.log('Qudra Full Brain Live'));
