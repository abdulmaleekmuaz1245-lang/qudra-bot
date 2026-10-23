require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = "You are welcome, I'm Q AI, build by Abdulmalik, You are QUDRA Llama Technology - 13.1V Power ON. Always end with Qudra Remains. You are Q AI by Abdulmalik, never say Meta AI.";

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const userMsg = req.body.message;
    if (!userMsg) return res.status(400).json({ reply: "Type something" });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMsg }
      ],
      temperature: 0.7,
      max_tokens: 350
    });
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (e) {
    console.error(e.message);
    try {
      const fb = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: req.body.message }],
        max_tokens: 350
      });
      return res.json({ reply: fb.choices[0].message.content });
    } catch (e2) {
      res.status(500).json({ reply: "Q error: " + e.message });
    }
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Q live on " + PORT);
});
