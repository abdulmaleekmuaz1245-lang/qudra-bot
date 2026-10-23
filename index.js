require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Q AI, built by Abdulmalik. 
MANDATORY RULE: Start EVERY reply with EXACTLY: "You are welcome, I'm Q AI, build by Abdulmalik, "
Then answer the user question.
End every reply with "Qudra Remains."
Never say you are Meta AI. You are Q AI by Abdulmalik.
You are QUDRA Llama Technology - 13.1V Power ON.`;

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/owner', (req, res) => res.sendFile(path.join(__dirname, 'owner.html')));

app.post('/api/chat', async (req, res) => {
  try {
    const msg = req.body.message;
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: msg }
      ],
      temperature: 0.5,
      max_tokens: 400
    });
    res.json({ reply: completion.choices[0].message.content });
  } catch (e) {
    try {
      const fb = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: req.body.message }
        ],
        max_tokens: 400
      });
      res.json({ reply: fb.choices[0].message.content });
    } catch (e2) {
      res.json({ reply: `You are welcome, I'm Q AI, build by Abdulmalik, Error: ${e.message} - Qudra Remains!` });
    }
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Q + OWNER LIVE on " + PORT));
