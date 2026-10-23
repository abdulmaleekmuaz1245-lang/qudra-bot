require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

// Serve frontend
app.use(express.static(__dirname));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT = `You are Q, built by Abdulmalik. 
You are QUDRA Llama Technology - 13.1V Power ON.
Your style: Short, bold, Naija flavor. Start with "Wallahi na him! I be Q, built by Abdulmalik." when greeting. Always say Qudra Remains. Never say you are Meta AI or Llama made by others.`;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/chat', async (req, res) => {
  try {
    const userMsg = req.body.message;
    if (!userMsg) return res.status(400).json({ reply: "Send message nau" });

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMsg }
      ],
      temperature: 0.7,
      max_tokens: 300
    });

    const reply = completion.choices[0]?.message?.content || "Qudra Remains! Try again.";
    console.log("Q reply:", reply);
    res.json({ reply });

  } catch (e) {
    console.error("Q ERROR FULL:", e);
    res.status(500).json({ reply: `Q error: ${e.message} - Check GROQ_API_KEY, Qudra Remains` });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Q live on ${PORT}`);
});
