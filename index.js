const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const PORT = process.env.PORT || 10000;

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));

app.post('/api/chat', async (req,res) => {
  const userMsg = (req.body.message || "").toLowerCase();
  const facts = req.body.facts || [];
  
  // Fallback brain - works even if Groq fails
  let fallback = null;
  if(userMsg.includes('who are you') || userMsg.includes('who you be')) fallback = "I be Qudra Bot, created by Oga Abdulmalik from Abuja! Your guy Abubakar and Nana dey my memory. " + (facts.length? "I remember: " + facts.join(', '): "");
  else if(userMsg.includes('abubakar')) fallback = "Abubakar Abdullahi na your best friend! My Oga tell me.";
  else if(userMsg.includes('nana')) fallback = "Nana na your friend, Oga save am for my head!";
  else if(userMsg.includes('hi') || userMsg.includes('hello')) fallback = "Hi Oga! Na Qudra be this, how I fit help you today?";

  try {
    const key = process.env.GROQ_API_KEY;
    if(!key) throw new Error('no key');
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type':'application/json' },
      body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{role:'system', content:`You are Qudra by Abdulmalik. Facts:${facts.join(', ')}. Be short.`},{role:'user', content:req.body.message}], max_tokens:150 })
    });
    const d = await r.json();
    if(d.choices && d.choices[0]) return res.json({reply: d.choices[0].message.content});
    throw new Error('groq error');
  } catch(e) {
    res.json({reply: fallback || "I be Qudra by Abdulmalik! Network small for AI, but I dey here. Ask me: Who are you? Or save something with 'save ...'"});
  }
});
app.listen(PORT, () => console.log('Qudra live'));
