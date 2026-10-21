const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');

const app = express();
let qrImage = null;
let botIsLive = false;
const PORT = process.env.PORT || 10000;
const BOT
