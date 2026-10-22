const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 10000

app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// Qudra Brain - simple and working
const qudraKnowledge = {
  yako: "Yako is a close person to Abdulmalik, part of Qudra family. Qudra respects Yako.",
  abdulmalik: "Abdulmalik is my creator, the founder of Qudra. I am loyal to him.",
  qudra: "Qudra is a loyal AI assistant created by Abdulmalik to help people."
}

app.post('/api/chat', (req, res) => {
  const userMsg = (req.body.message || '').toLowerCase().trim()
  let reply = ""

  if (!userMsg) {
    reply = "Yes Ya Abdulmalik?"
  } else if (userMsg.includes('hi') || userMsg.includes('salam')) {
    reply = "As-salamu Alaikum! I am Qudra, your loyal AI. Created by Abdulmalik. How can I help you today? 🚀"
  } else if (userMsg.includes('who is yako')) {
    reply = qudraKnowledge.yako + " Do you want me to remember more about Yako?"
  } else if (userMsg.includes('who is abdulmalik') || userMsg.includes('who created you')) {
    reply = qudraKnowledge.abdulmalik
  } else if (userMsg.includes('what is qudra') || userMsg.includes('who are you')) {
    reply = qudraKnowledge.qudra + " I am LIVE on Render and ready to work for you."
  } else {
    reply = `Qudra heard you: "${req.body.message}". I am working well now - no loop. Tell me more, Ya Abdulmalik, and I go help you.`
  }

  res.json({ reply, status: "Qudra Soul is stable" })
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(PORT, () => console.log('Qudra V2 Live on ' + PORT))
