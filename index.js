const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Q AI INTRO ---
const Q_INTRO = "You are welcome, I'm Q AI, build by Abdulmalik, your assistant. How can I help?";

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/owner', (req, res) => {
  res.sendFile(path.join(__dirname, 'owner.html'));
});

app.post('/chat', (req, res) => {
  const userMsg = req.body.message || "";
  // Your AI logic here - keep your old logic if you get
  // Make sure reply starts with intro
  let reply = `${Q_INTRO}\n\nYou said: ${userMsg}`;
  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`Q Bot LIVE on ${PORT}`);
});
