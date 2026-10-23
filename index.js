 const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Q INTRO - As you request
const Q_INTRO = "You are welcome, I'm Q AI, build by Abdulmalik,";

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/owner', (req, res) => {
  // NO KEY - DIRECT ACCESS
  res.sendFile(path.join(__dirname, 'owner.html'));
});

app.post('/api/chat', (req, res) => {
  const msg = req.body.message || '';
  const reply = `${Q_INTRO} how can I assist you today?\n\nYou said: ${msg}\n\nQudra Remains! 🔥`;
  res.json({ reply: reply });
});

app.listen(PORT, () => {
  console.log(`Q Bot LIVE on ${PORT}`);
  console.log(`INDEX LIVE on ${PORT}`);
});
