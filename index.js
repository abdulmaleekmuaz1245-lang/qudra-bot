const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');

const app = express();
let qrImage = null;
let botIsLive = false;
const PORT = process.env.PORT || 10000;
const RENDER_URL = process.env.RENDER_EXTERNAL_URL || 'https://qudra-bot.onrender.com';

// CONFIG - YOUR NUMBERS
const BOT_NUMBER = "2348121521859"; // Bot second number
const OWNER_NUMBER = "2347043718956"; // Your main number

setInterval(() => { fetch(RENDER_URL).catch(()=>{}); }, 14*60*1000);

async function startQudra() {
    const { state, saveCreds } = await useMultiFileAuthState('qudra_auth');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ["Qudra","Chrome","1.0"]
    });

    // Pairing code for BOT number
    if (!sock.authState.creds.registered) {
        setTimeout(async () => {
            try {
                let code = await sock.requestPairingCode(BOT_NUMBER);
                console.log(`\n\n========== QUDRA PAIRING ==========\nBOT NUMBER: ${BOT_NUMBER}\nCODE: ${code}\nOWNER: ${OWNER_NUMBER}\n===================================\n`);
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
            console.log('✅ QUDRA LIVE 24/7!');
            // Notify owner that bot is live
            try {
                await sock.sendMessage(OWNER_NUMBER + "@s.whatsapp.net", { text: "✅ Qudra is now LIVE 24/7! Bot number: " + BOT_NUMBER + " is active. Created by AbdulMalik, loyal forever." });
            } catch {}
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg?.message) return;
        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        if (!text) return;
        const isOwner = from === OWNER_NUMBER + "@s.whatsapp.net";

        await sock.sendPresenceUpdate('composing', from);

        let reply = null;
        const lower = text.toLowerCase();

        if (lower === 'hi' || lower === 'hello') {
            reply = isOwner ? `Welcome my Owner! Qudra here, fully active for you. You said: ${text}` : `Qudra here! You said: ${text}. Created by AbdulMalik,
