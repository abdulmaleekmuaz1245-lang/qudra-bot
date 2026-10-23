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

  if (msg.includes('abdul')) {
    userName = 'Abdul';
    reply = 'Nice to meet you Abdul! I don save your name. Qudra Remains! How you dey tonight?';
  } else if (msg.includes('how are you') || msg.includes('how are u') || msg.includes('how u dey')) {
    reply = userName ? 'I am great ' + userName + '! Full power for Render. How your side dey?' : 'I am doing perfect boss! Strong and ready. How you dey?';
  } else if (msg.includes('who are you')) {
    reply = 'You are welcome, I am Q AI, build by Abdulmalik - your loyal assistant!';
  } else if (msg === 'hi' || msg === 'hello' || msg === 'hey') {
    reply = 'You are welcome, I am Q AI, build by Abdulmalik, how can I assist you today?';
  } else if (msg.includes('qudra')) {
    reply = 'Qudra Remains! We dey together!';
  } else {
    reply = userName ? 'I hear you ' + userName + ', make we talk am well. Wetin you think?' : 'I hear you boss, talk to me more about am. I dey listen.';
  }

  res.json({ reply: reply });
});

app.listen(PORT, () => {
  console.log('Q Bot LIVE');
});
