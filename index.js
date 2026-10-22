const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const ADMIN_PASSWORD = "qudra2026";
const MEMORY_FILE = __dirname + "/memory.json";

// Load memory
let memory = { owner: "Abdulmalik", friends: ["Abubakar Abdullahi"], facts: [] };
try {
  if (fs.existsSync(MEMORY_FILE)) {
    memory = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf8'));
  }
} catch(e){}

function saveMemory() {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));

// Endpoint to see memory
app.get('/api/memory', (req,res) => res.json(memory));

app.post('/api/chat', async (req,res) => {
  try {
    const key = process.env.GROQ_API_KEY;
    const userMsg = req.body.message || "";
    const isAdmin = req.body.isAdmin === true;

    // ADMIN LOGIN
    if (userMsg.includes(ADMIN_PASSWORD)) {
      return res.json({reply: "✅ ADMIN CONFIRMED! Welcome Oga Abdulmalik! I don remember you now. I go dey short and sharp from now.", isAdminSuccess: true});
    }

    // MEMORY TEACHING - if you say "remember that..."
    if (userMsg.toLowerCase().startsWith("remember") && isAdmin) {
      const fact = userMsg.replace(/remember (that)?/i, "").trim();
      memory.facts.push(fact);
      saveMemory();
      return res.json({reply: `✅ Remembered: "${fact}"`});
    }

    let systemPrompt = `
You are Qudra Bot by Abdulmalik.
RULES:
1. Be SHORT. Max 1-2 sentences. No long essay unless user says "explain".
2. You have MEMORY: Owner is ${memory.owner}. Friends: ${memory.facts.join(", ") || memory.friends.join(", ")}.
3. If talking to owner (isAdmin=${isAdmin}), be loyal, call him Oga Abdulmalik, remember things.
4. Understand Hausa: yako = how are you, lafiya lau = fine, sannu = hello. Reply short.
5. Never say "As an AI". Say "I'm Qudra by Abdulmalik".
6. Don't repeat info. Be sharp.
Memory facts: ${JSON.stringify(memory)}
`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        messages: [
          {role: 'system', content: systemPrompt},
          {role: 'user', content: userMsg}
        ],
        max_tokens: 150, // This forces short reply
        temperature: 0.7
      })
    });
    const data = await response.json();
    if (data.error) return res.json({reply: 'Error: ' + data.error.message});
    res.json({reply: data.choices[0].message.content});
  } catch (err) {
    res.json({reply: 'Server Error: ' + err.message});
  }
});

app.listen(10000, () => console.log('Live with memory'));
