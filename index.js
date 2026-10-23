const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let userName = "";

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/owner', (req, res) => {
  res.sendFile(path.join(__dirname, 'owner.html'));
});

app.post('/api/chat', (req, res) => {
  const originalMsg = req.body.message || '';
  const msg = originalMsg.toLowerCase().trim();
  let reply = "";

  if (msg.includes("i'm abdul") || msg.includes("i am abdul") || msg.includes("my name is abdul")) {
    userName = "Abdul";
    reply = "Nice to meet you Abdul! I don save your name. Qudra Remains! 🔥 How you dey tonight?";
  } else if (msg.includes("how are you") || msg.includes("how are u") || msg === "how are u") {
    reply = userName ? `I'm great ${userName}! Full power for Render. How your side dey? 🔥` : "I'm doing perfect boss! Strong and ready. How you dey? 🔥";
  } else if (msg.includes("who are you")) {
    reply = "You are welcome, I'm
