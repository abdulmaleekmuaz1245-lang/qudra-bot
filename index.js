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

  // SAVE NAME
  if (msg.includes("i'm") || msg.includes("my name is") || msg.includes("i am")) {
    if (msg.includes("abdul")) {
      userName = "Abdul";
      reply = `Nice to meet you Abdul! I go remember you. Qudra Remains! 🔥 How you dey tonight?`;
    } else {
      userName = originalMsg.replace(/i'm|my name is|i am/gi, "").trim();
      reply = `Nice to meet you ${userName}! I'm Q AI, build by Abdulmalik. How I fit help you?`;
    }
  }
  // HOW ARE YOU - REAL REPLY
  else if (msg.includes("how are you") || msg.includes("how are u") || msg.includes("how u dey")) {
    if (userName) {
      reply = `I'm good ${userName}! Strong and live for Render! Thanks for checking on me. How your side? Qudra Remains! 🔥`;
    } else {
      reply = `
