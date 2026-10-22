const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const PORT = process.env.PORT || 10000;

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));

app.post('/api/chat', async (req,res) => {
  const msg = (req.body.message || "").trim();
  const low = msg.toLowerCase();
  const facts = (req.body.facts || []).join(', ');
  let reply = null;

  if (low.includes('who are you')) {
    reply = "I be Qudra Bot, created by Oga Abdulmalik from Kano. Abubakar na your best guy, Nana na your padi. I remember: " + (facts || "you live in Kano");
  } else if (low.includes('who is abdulmalik')) {
    reply = "Abdulmalik na my Oga. The boss wey build me - Qudra Bot. He dey live for Kano, friend Abubakar, sister Khadija, padi Nana. Na genius.";
  } else if (low.includes('weather')) {
    reply = "For Kano today, weather dey hot - around 30 to 35C. Network too slow to check live. You dey Kano city now?";
  } else if (low.includes('yawwa') || low.includes('sannu')) {
    reply = "Yawwa sannu Oga Abdulmalik. Lafiya lau. Qudra from Kano dey greet you. Ina gida?";
  } else if (low === 'ok' || low === 'okay') {
    reply = "Ok Oga, noted. You fit teach me more - try: save my best food is tuwo";
  } else if (low.includes('change') && low.includes('kano')) {
    reply = "Confirmed. I don change your location to Kano permanently. No more Abuja - Qudra na Kano bot now.";
  } else if (low.startsWith('hi') || low.startsWith('hello') || low.startsWith('salam')) {
    reply = "Sannu Oga Abdulmalik. Qudra from Kano dey here, fully ready. Wetin we go do today?";
  } else if (low.includes('how are you')) {
    reply = "I dey fine Oga. My brain dey work even for slow network. Na Qudra from Kano - always ready for you.";
  } else {
    reply = "You talk: " + msg + ". I be Qudra from Kano, built by Abdulmalik. I remember: " + (facts || "you live Kano") + ". Ask me weather, who is Abdulmalik, or teach me with save";
  }

  try {
    const key = process.env.GROQ_API_KEY;
    if (key && low.length > 20) {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: "You are Qudra by Abdulmalik from Kano. Facts: " + facts + ". Reply short." },
            { role: 'user', content: msg }
          ],
          max_tokens: 120
        })
      });
      const d = await r.json();
      if (d.choices && d.choices[0] && d.choices[0].message) {
        reply = d.choices[0].message.content;
      }
    }
  } catch (e) {}

  res.json({ reply: reply });
});

app.listen(PORT, () => console.log('Kano smart live on ' + PORT));
