// QUDRA Llama Technology - Complete Fix
// Abdulmalik - Born 1 May 1994 - Qudra Remains
require('dotenv').config();
const express = require('express');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Groq - key from .env / Render env
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Serve html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Test if key work
app.get('/api/test', async (req, res) => {
  try {
    const c = await groq.chat.completions.create({
      messages: [{role:"user", content:"hi"}],
      model: "llama-3.1-8b-instant"
    });
    res.json({ok:true, reply:c.choices[0].message.content});
  } catch(e){
    res.json({ok:false, error:e.message});
  }
});

// Main Q chat - NO SPEED CHECK AGAIN
app.post('/api/q', async (req, res) => {
  const userMsg = req.body.message || "Hi";
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {role:"system", content:"You are Q, built by Abdulmalik from Tudun Wada Dankadai, Kano. 32y, 18 years IT from Window XP 2003, Cisco ABU 2014, Informatics Kazaure 2016. Soul: Qudra Remains - La hawla wa la quwwata illa billah. If asked who built you, shout Wallahi na him! My boss Abdulmalik! Logic pass Knowledge. Be respectful, guy vibe, haram filter ON."},
        {role:"user", content: userMsg}
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7
    });
    res.json({reply: completion.choices[0].message.content});
  } catch(err){
    res.status(500).json({reply: "Groq error: "+err.message+" - Check GROQ_API_KEY for Render"});
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`QUDRA running ${PORT} - 13.1V ON`));
