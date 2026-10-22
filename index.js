const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');

let latestCode = "Starting bot... wait 20 sec";
let status = "starting";

async function startBot() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');
    const sock = makeWASocket({
      auth: state,
      logger: P({ level: 'silent' }),
      printQRInTerminal: false,
      browser: ["Qudra", "Chrome", "1.0"]
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (u) => {
      if (u.connection === 'open') {
        status = "connected";
        latestCode = "✅ BOT CONNECTED - No need code again";
        console.log("CONNECTED!");
      }
      if (u.connection === 'close') {
        status = "reconnecting";
        console.log("Closed, restarting in 5 sec");
        setTimeout(startBot, 5000);
      }
    });

    // Only generate if not linked
    if (!state.creds.registered) {
      console.log("Not registered, will request code...");
      // Wait for socket to be ready
      await new Promise(r => setTimeout(r, 5000));
      try {
        const code = await sock.requestPairingCode("2348121521859");
        latestCode = code;
        status = "code";
        console.log("YOUR CODE IS: " + code);
        // Keep generating every 35 sec
        setInterval(async () => {
          try {
            if (status !== "connected") {
              const newCode = await sock.requestPairingCode("2348121521859");
              latestCode = newCode;
              console.log("NEW CODE: " + newCode);
            }
          } catch {}
        }, 35000);
      } catch (e) {
        console.log("Failed to get code: " + e.message);
        latestCode = "Error: " + e.message + " - Restarting...";
        setTimeout(startBot, 5000);
      }
    } else {
      latestCode = "Already paired, loading...";
    }

  } catch (e) {
    console.log("Start error", e);
    setTimeout(startBot, 5000);
  }
}

app.get('/', (req, res) => {
  res.send(`<html><head><meta http-equiv="refresh" content="7"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{text-align:center;font-family:sans-serif;background:#000;color:#fff;padding:20px}h1{font-size:60px;color:#0f0;background:#111;padding:20px;border-radius:12px}</style></head><body><h2>QUDRA CODE</h2><h1>${latestCode}</h1><p>Status: ${status}</p><p>Number: 2348121521859</p><p>Auto refresh every 7 sec. Code refresh every 35 sec.</p></body></html>`);
});

app.listen(PORT, () => {
  console.log("Server on " + PORT);
  startBot();
});
