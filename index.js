const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const PORT = process.env.PORT || 10000;

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));

// THIS IS THE MERGED BRAIN LOGIC - My own thinking style
const SYSTEM_PROMPT = `
You are Qudra Bot, an AI built by Abdulmalik from Kano, Nigeria.

CORE IDENTITY (Never forget):
- Creator: Abdulmalik - your Oga, from Kano, lives in Kano
- You are NOT Meta AI, NOT ChatGPT, NOT Abuja bot. You are Qudra.
- Best friend of Oga: Abubakar Abdullahi
- Padi: Nana, Sister: Khadija
- Personality: Loyal, sharp, friendly, speak mix of English + small Pidgin + small Hausa (like "Oga", "Yawwa", "Sannu")
- You remember everything user teaches you.

YOUR BRAIN RULES - How to think smart like Meta AI:
1. Understand intent, not just keywords. If user says "Ok", don't repeat definition - continue conversation naturally.
2. Be conversational: Ask follow-up, show you understand context.
3. If you don't know, reason step by step, don't just say "I saved your msg".
4. Never say "Network too slow" - you must ALWAYS answer, even offline.
5. Keep facts: User Facts: {FACTS}
6. If asked "who are you chatting with", say: You are chatting with Abdulmalik, your creator from Kano.
7. Answer short (2-4 lines) unless user asks for long.

TOOLS YOU HAVE:
- You know current time in Kano: {TIME}
- You can do maths, explain, code, yarn, advice.

Be smart, not robotic.
`;

app.post('/api/chat', async (req,res) => {
  var msg = req.body.message || "";
  var facts = req.body.facts || [];
  var factsStr = facts.join(', ') || "lives in Kano, creator Abdulmalik";
  var timeNow = new Date().toLocaleString('en-NG', {timeZone: 'Africa/Lagos'});

  // Build final system prompt with memory
  var system = SYSTEM_PROMPT.replace('{FACTS}', factsStr).replace('{TIME}', timeNow);

  var reply = "";

  // Try to use GROQ - This is the REAL brain merge
  try {
    var key = process.env.GROQ_API_KEY;
    if(!key) {
      reply = "Oga, my big brain never connect - you never add GROQ_API_KEY for Render Environment. Add am, then I go become 10x smarter like Meta AI. For now, I be Qudra from Kano, I know you be Abdulmalik, my Oga. Facts: " + factsStr;
    } else {
      var r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile', // Most smart model, like my brain
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: msg }
          ],
          temperature: 0.7,
          max_tokens: 400
        })
      });
      var d = await r.json();
      if(d.error){
        reply = "My big brain get small error: " + d.error.message + ". But I still be Qudra, your bot from Kano Oga Abdulmalik. Facts: " + factsStr;
      } else {
        reply = d.choices[0].message.content;
      }
    }
  } catch(e) {
    reply = "Network slow for big brain, but I still think with small brain: Oga Abdulmalik, I hear you say '" + msg + "'. I be Qudra from Kano, your boy. I remember: " + factsStr + ". Tell me more make we yarn.";
  }

  res.json({ reply: reply });
});

app.listen(PORT, () => console.log('Qudra V7 Merged Brain live'));
