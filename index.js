const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const P = require('pino');

const BOT_NUMBER = '2348121521859';
let latestCode = 'Starting... wait 15 sec';
let isConnected = false;

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

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            isConnected = true;
            latestCode = '✅ CONNECTED! Bot is online';
            console.log('✅ QUDRA CONNECTED SUCCESS');
        }
        if (connection === 'close') {
            isConnected = false;
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            if (statusCode !== 401) {
                console.log('Reconnecting...');
                setTimeout(startBot, 3000);
            } else {
                latestCode = 'Session expired. Deleting auth and restarting...';
                console.log('Session logged out');
                setTimeout(startBot, 3000);
            }
        }
    });

    // Generate code only if not registered
    if (!state.creds.registered) {
        setTimeout(async () => {
            await genCode(sock);
            // Generate new code every 30 sec
            setInterval(() => genCode(sock), 30000);
        }, 8000);
    }
}

async function genCode(sock) {
    if (isConnected) return;
    try {
        const code = await sock.requestPairingCode(BOT_NUMBER);
        latestCode = code;
        console.log('========================');
        console.log('NEW CODE:', code);
        console.log('Enter this fast: ', code);
        console.log('========================');
    } catch (e) {
        console.log('Gen code error, retrying...', e.message);
        latestCode = 'Generating... retry in 5 sec';
    }
}

app.get('/', (req, res) => {
    res.send(`
    <html><head><meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="refresh" content="5">
    <style>body{font-family:Arial;text-align:center;padding:20px;background:#000;color:#fff} h1{font-size:55px;letter-spacing:6px;background:#111;color:#00ff00;padding:25px;border-radius:15px;border:2px solid #00ff00} p{font-size:18px} .box{max-width:450px;margin:auto}</style>
    </head><body><div class="box">
    <h2>QUDRA PAIR CODE</h2>
    <h1>${latestCode}</h1>
    <p>Bot: ${BOT_NUMBER}</p>
    <p>Go to bot WhatsApp > Linked Devices > Link a device > Link with phone number > Enter code</p>
    <p style="color:#0
