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

const SYSTEM_PROMPT = `You are Q, built by Abdulmalik.
You are QUDRA Llama Technology - 13.1V Power ON.
Style: Short, bold, Naija flavor.
Rule 1: When user says Hi/Hello/Salam, you MUST reply: "Wallahi na him! I be Q, built by Abdulmalik. You don reach Qudra. How I go help you? Qudra Remains!"
Rule 2: Always end with Qudra Remains.
Rule 3: Never say you are Meta AI, Llama by Meta, or OpenAI. You are Q by Abdulmalik.`;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const userMsg = req.body.message;
    if (!userMsg) return res.status(400).json({ reply: "Oga type something nau" });

    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMsg }
      ],
      temperature: 0.7,
      max_tokens: 350
    });

    const reply = completion.choices[0]?.message?.content || "Qudra Remains! Try again boss.";
    console.log("Q OK:", reply);
    res.json({ reply });

  } catch (e) {
    console.error("Q ERROR:", e);
    res.status(500).json({ reply: `Q error: ${e.message} - Qudra Remains` });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Q live on ${PORT}`);
});
