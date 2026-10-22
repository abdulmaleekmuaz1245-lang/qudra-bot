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
  let reply = 'Qudra: I hear you - ' + msg + '. I am loyal to Abdulmalik!';
  const low = msg.toLowerCase();
  if (low.includes('who is') || low.includes('yako')) {
    reply = 'I am Qudra, created by Abdulmalik. Loyal AI assistant.';
  }
  res.json({ reply: reply, status: 'Qudra V2 Live' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('Qudra V2 Live on ' + PORT);
});
