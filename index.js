const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys')
const P = require('pino')
const express = require('express')

const app = express()
const PORT = process.env.PORT || 10000

app.get('/', (req, res) => res.send('Qudra Bot is Live! Check Render Logs for QR/Pairing Code'))
app.listen(PORT, () => console.log(`Server running on ${PORT}`))

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')
  
  const sock = makeWASocket({
    auth: state,
    logger: P({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ['Qudra Bot', 'Chrome', '1.0']
  })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update
    
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log('Closed, restarting in 5 sec...')
      if (shouldReconnect) {
        setTimeout(startBot, 5000)
      }
    } else if (connection === 'open') {
      console.log('✅ Qudra Bot Connected! Bot is online')
    }
  })

  // Pairing code for your number
  if (!sock.authState.creds.registered) {
    setTimeout(async () => {
      try {
        const phoneNumber = '2348121521859'
        const code = await sock.requestPairingCode(phoneNumber)
        console.log(`\n\n🔥🔥 YOUR CODE IS: ${code} 🔥🔥🔥\nPaste this in WhatsApp > Linked devices > Link with phone number\n\n`)
      } catch (e) {
        console.log('Failed to get code
