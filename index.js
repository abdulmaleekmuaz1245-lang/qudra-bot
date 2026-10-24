const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 10000;
const OWNER_PIN = process.env.OWNER_PIN || "MY2KING100";

const SOUL_FILE = path.join(__dirname, 'soul.json');
const BACKUP_FILE = path.join(__dirname, 'soul_backup.json');
const BACKUP_FILE2 = path.join(__dirname, 'soul_backup2.json');
const ERROR_LOG_FILE = path.join(__dirname, 'error_log.json');

let SOUL_DB = {};
let PRIVACY_MODE = true;
let GOD_MODE_ACTIVE = false;
let BACKUP_CHECK_COUNT = 0;
let LAST_ERROR = null;
let LAST_FIX = null;
let ERROR_FIXED_ALERT = null; // Alert for owner

const DEFAULT_SOUL = {
  "abubakar": "Abubakar Abdullahi aka Yako - best friend blood brothers tudun wada dankadai kano - PERMANENT 100%",
  "anas": "Anas aka gar da gar - close friend 70% PERMANENT",
  "khadijah": "Khadijah - Princess 40% PERMANENT",
  "murja": "Murja - Senior Queen 70% PERMANENT"
};

function logError(type, msg){
  LAST_ERROR = {type, msg, time: new Date().toISOString()};
  ERROR_FIXED_ALERT = `
