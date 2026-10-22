const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const P = require('pino');

const BOT_NUMBER = '2348121521859';
let latestCode = 'Generating... Please wait 15 sec';
let sock;

async function startBot() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState('auth');

    sock = makeWASocket({
        version,
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })) },
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['Qudra Bot', 'Chrome', '1.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        if (update.connection === 'open') {
            latestCode = '✅ CONNECTED! Bot is online';
            console.log('QUDRA CONNECTED');
        }
        if (update.connection === 'close') startBot();
    });

    if (!state.creds.registered) {
        // Generate first code after 10 sec
        setTimeout(generateCode, 10000);
        // Then generate new one every 30 sec - so you always have fresh code
        setInterval(generateCode, 30000);
    }
}

async function generateCode() {
    try {
        if (!sock) return;
        const code = await sock.requestPairingCode(BOT_NUMBER);
        latestCode = code;
        console.log('===== NEW QUDRA CODE =====');
        console.log(code);
        console.log('Raw:', code.replace(/-/g,''));
        console.log('Valid for 40 sec - New one coming in 30 sec');
        console.log('Open your Render link to see it big');
    } catch (e) {
        console.log('Error generating code:', e.message);
    }
}

// Website shows code in BIG font for you to copy with biro
app.get('/', (req, res) => {
    res.send(`
    <html><head><meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="5">
    <style>body{font-family:Arial;text-align:center;padding:30px} h1{font-size:50px;letter-spacing:5px;background:#000;color:#0f0;padding:20px;border-radius:15px} p{font-size:18px}</style>
    </head><body>
    <h2>QUDRA BOT CODE</h2>
    <h1>${latestCode}</h1>
    <p>Raw (no dash): <b>${latestCode.replace(/-/g,'')}</b></p>
    <p>Code refreshes every 30 sec. Enter this in WhatsApp:<br>Linked devices > Link with phone number</p>
    <p>Bot Number: ${BOT_NUMBER}</p>
    <p><small>Page auto-refresh every 5 sec</small></p>
    </body></html>
    `);
});

app.listen(PORT, () => {
    console.log('Server running');
    startBot();
});
