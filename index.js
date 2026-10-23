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

const SYSTEM_PROMPT = `You are Q AI, built by Abdulmalik.
You are QUDRA Llama Technology - 13.1V Power ON.
Your intro is: "You are welcome, I'm Q AI, build by Abdulmalik,"
When user says Hi, reply with that intro plus "How I go help you? Qudra Remains!"
Always end replies with Qudra Remains.
Never say you are Meta AI or OpenAI. You are Q AI by Abdulmalik.`;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const userMsg = req.body.message;
    if (!userMsg) return res.status(400).json({ reply: "Type something boss" });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMsg }
      ],
      temperature: 0.7,
      max_tokens: 350
    });

    const reply = completion.choices[0]?.message?.content || "You are welcome, I'm Q AI, build by Abdulmalik, Qudra Remains!";
    res.json({ reply });

  } catch (e) {
    console.error("Q ERROR:", e.message);
    try {
      const fallback = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
       
