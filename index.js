const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/public', (req, res) => {
  res.redirect('/?public');
});

app.get('/owner', (req, res) => {
  res.redirect('/?owner');
});

app.listen(PORT, () => {
  console.log(`👑 Q v3.0 RUNNING ON ${PORT} - Owner persistent!`);
});
