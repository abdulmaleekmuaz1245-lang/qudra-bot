const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(__dirname));

const ADMIN_PASS = "Amleek900";

// Owner and Public links - Server side check
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/owner', (req, res) => {
  res.redirect('/?owner');
});

app.get('/public', (req, res) => {
  res.redirect('/?public');
});

app.post('/verify-owner', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASS) {
    res.json({ success: true, message: "👑 Owner verified! Q Control Center unlocked!" });
  } else {
    res.json({ success: false, message: "❌ Wrong password!" });
  }
});

app.listen(PORT, () => {
  console.log(`👑 Q KINGDOM CONTROL CENTER RUNNING ON PORT ${PORT}`);
  console.log(`🌍 Public Link: http://localhost:${PORT}/?public`);
  console.log(`🔐 Owner Link: http://localhost:${PORT}/?owner - Password: ${ADMIN_PASS}`);
  console.log(`🧠 Full Function Brain System - Fantasy Golden Black Active!`);
});
