const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const P = require('pino');
const QRCode = require('qrcode');

let latestQR = null;
let statusText = 'Starting... Please wait 15 sec';

async function startBot() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    
    const sock = makeWASocket({
        version,
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' })) },
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['Qudra Bot', 'Chrome', '1.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, qr, lastDisconnect } = update;
        
        if (qr) {
            // Convert QR to big image
            latestQR = await QRCode.toDataURL(qr);
            statusText = '✅ QR READY - Scan now! Expires in 60 sec';
            console.log('New QR Generated - Open website to scan');
        }
        
        if (connection === 'open') {
            statusText = '✅ CONNECTED! Bot is online';
            latestQR = null;
            console.log('QUDRA CONNECTED');
        }
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
            if (shouldReconnect) startBot();
            else {
                statusText = 'Session expired, restarting...';
                latestQR = null;
                startBot();
            }
        }
    });
}

app.get('/', (req, res) => {
    res.send(`
    <html><head><meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="10">
    <style>
        body{font-family:Arial;text-align:center;padding:20px;background:#f5f5f5}
        img{width:90%;max-width:350px;border:10px solid #000;border-radius:20px;background:white;padding:10px}
        h2{font-size:22px} p{font-size:16px}
        .box{background:white;padding:20px;border-radius:15px;max-width:400px;margin:auto}
    </style>
    </head><body>
    <div class="box">
    <h2>QUDRA BOT QR</h2>
    <p><b>${statusText}</b></p>
    ${latestQR ? `<img src="${latestQR}"><p>Open WhatsApp > Linked devices > Link a device > Scan this</p><p>QR refreshes every ~40 sec</p>` : `<p>Waiting for QR... Keep this page open. It auto-refresh every 10 sec</p><p>Bot will show QR shortly</p>`}
    </div>
    </body></html>
    `);
});

app.listen(PORT, () => {
    console.log('Server running on', PORT);
    startBot();
});
