const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const P = require('pino');

const BOT_NUMBER = '2348121521859'; // your bot number, no +

async function startBot() {
    const { version } = await fetchLatestBaileysVersion();
    const { state, saveCreds } = await useMultiFileAuthState('auth');

    const sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'silent' }))
        },
        logger: P({ level: 'silent' }),
        printQRInTerminal: false,
        browser: ['Qudra Bot', 'Chrome', '1.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            console.log('Connection closed, restarting...');
            startBot();
        } else if (connection === 'open') {
            console.log('✅ QUDRA BOT CONNECTED!');
        }
    });

    // Pairing code - wait 15 sec after start
    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                const code = await sock.requestPairingCode(BOT_NUMBER);
                console.log('==================================');
                console.log('===== QUDRA CODE =====');
                console.log(code);
                console.log('Raw CODE:', code.replace(/-/g,''));
                console.log('Use this in WhatsApp > Linked Devices > Link with phone number');
                console.log('==================================');
            } catch (e) {
                console.log('Failed to get code:', e.message);
            }
        }, 15000);
    }
}

app.get('/', (req, res) => {
    res.send('Qudra Bot is running! Check logs for pairing code.');
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    startBot();
});
