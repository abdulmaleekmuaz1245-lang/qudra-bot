const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

let userName = "Boss";

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

  if (msg.includes('abdul')) {
    userName = 'Abdul';
    reply = 'Yes! Abdul na my owner - Abdulmalik wey build me! Qudra Remains! You be Abdul?';
  } else if (msg.includes('abubakar') || msg.includes('abubakr')) {
    reply = 'Abubakar? I never
