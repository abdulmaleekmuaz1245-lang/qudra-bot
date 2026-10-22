const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/chat', (req, res) => {
  const msg = req.body.message || '';
  let reply = `Qudra: I hear you - "${msg}". I am loyal to Abdulmalik! 🚀`;
  if(msg.toLowerCase().includes('who is') || msg.toLowerCase().includes('yako')){
    reply = 'I am Qudra, created by Abdulmalik. Loyal AI assistant.';
  }
  res.json({ reply: reply, status: 'Qudra
