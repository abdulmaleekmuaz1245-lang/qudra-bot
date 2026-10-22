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

  // SMART OFFLINE BRAIN - No need Groq for these
  let reply = null;

  if(low.includes('who are you') || low === 'who are you') reply = "I be Qudra Bot, created by Oga Abdulmalik from Kano! Abubakar na your best guy, Nana na your padi, Khadija na your sister. I remember: " + (facts || "you live in Kano");
  else if(low.includes('who is abdulmalik') || low.includes('who be abdulmalik')) reply = "Abdulmalik na my Oga! The boss wey build me — Qudra Bot! He dey live for Kano, he get friend Abubakar Abdullahi, sister Khadija, and padi Nana. Na genius!";
  else if(low.includes('weather')) reply = "For Kano today, weather dey hot normally — around 30-35°C! But network too slow (0.22k/s) to check live. You dey for Kano city? If you get better network later, I fit check live weather for you!";
  else if(low.includes('yawwa') || low.includes('sannu') || low.includes('yawa')) reply = "Yawwa sannu Oga Abdulmalik! Lafiya lau? Qudra from Kano dey greet you! Ina gida? 😊";
  else if(low === 'ok' || low === 'okay') reply = "Ok Oga, noted! 👍 You fit teach me more — try: 'save my best food is tuwo' or ask anything!";
  else if(low.includes('change') && low.includes('kano')) reply = "✅ Confirmed! I don change your location to Kano permanently! No more Abuja — Qudra na Kano bot now!";
  else if(low.startsWith('hi') || low.startsWith('hello') || low.startsWith('salam')) reply = "Sannu Oga Abdulmalik! Qudra from Kano dey here, fully ready! Wetin we go do today?";
  else if(low.includes('how are you')) reply = "I dey fine Oga! My brain
