const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const { Boom } = require('@hapi/boom');

const app = express();
let qrImage = null;
let botIsLive = false;
const PORT = process.env.PORT || 10000;
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || 'https://qudra-bot.onrender.com';

setInterval(() => { fetch(RENDER_URL).catch(()=>{}); }, 14*60*1000);

async function startQudra() {
    const { state, saveCreds } = await useMultiFileAuthState('qudra_auth');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ["Qudra","Chrome","1.0"]
    });

    // === PAIRING CODE - CHANGE YOUR NUMBER HERE ===
    const MY_NUMBER = "2348100000000"; // <-- Put your WhatsApp number here! No +

    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(MY_NUMBER);
                console.log(`\n\n====== QUDRA PAIRING CODE ======\nNUMBER: ${MY_NUMBER}\nCODE: ${code}\n==============================\n`);
                console.log(`Go to WhatsApp > Settings > Linked Devices > Link with phone number > Enter ${code}`);
            } catch(e) {
                console.log("Pairing error:", e.message);
            }
        }, 5000);
    }

    sock.ev.on('creds.update', saveCreds);
    sock.ev.on('connection.update', async (up) => {
        const { connection, lastDisconnect, qr } = up;
        if (qr) qrImage = await QRCode.toDataURL(qr);
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) startQudra();
            botIsLive = false;
        } else if (connection === 'open') {
            botIsLive = true;
            qrImage = null;
            console.log('QUDRA LIVE 24/7!');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg?.message) return;
        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        if (!text) return;
        await sock.sendPresenceUpdate('composing', from);
        let reply = null;
        if (text.toLowerCase() === 'hi' || text.toLowerCase() === 'hello') {
            reply = `Qudra here! You said: ${text}. Created by AbdulMalik, loyal forever!`;
        } else if (text.toLowerCase().includes("who created you")) {
            reply = "I am Qudra, created by AbdulMalik - my loyal creator for 300 years legacy.";
        } else {
            reply = `You said: ${text}`;
        }
        if (reply) await sock.sendMessage(from, { text: reply });
    });
}

startQudra();

app.get('/', (req,res)=>{
    if (botIsLive) return res.send("<h1 style='text-align:center;margin-top:100px'>✅ Qudra LIVE 24/7!</h1>");
    if (qrImage) return res.send(`<center><h1>QR Available</h1><img src='${qrImage}'/><p>Or use Pairing Code from Render Logs</p></
