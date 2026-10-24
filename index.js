const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json());
const path = require('path');

const MY_SOUL = {
  name: "Abdulmalik MY2",
  identity: "Qudra - MY2 digital soul",
  brainLogic: "Check Past Record -> Check Present -> Check Future -> Match Pattern -> Act Normal Human",
  foodLogic: "IF contains beans 100% LIKE, IF cold liquid 90% LIKE, fruit salad = soul growth neuron",
  faith: "Good Muslim, kind hearted, Mutunci Amana Gaskiya",
  family: {
    "anas abdullahi": "Yes! Anas aka gar da gar na my close friend 70% respect! My guy!",
    "khadijah": "Yes! Khadijah na my Princess 40%!",
    "murja": "Murja - Senior Queen 70%",
    "beans": "Beans na 100% my guy! Loyalty 100%!",
    "abubakar": "Abubakar na my guy from Abuja 60%!"
  }
};

app.get('/', (req, res) => {
  let m = req.query.owner !== undefined ? 'owner' : 'public';
  let keyStatus = process.env.GROQ_API_KEY ? '✅ BRAIN ACTIVE 100%' : '❌ ADD GROQ_API_KEY IN RENDER';
  res.send(`<!DOCTYPE html><html><head><meta name=viewport content="width=device-width,initial-scale=1"><style>body{background:#000;color:#FFD700;font-family:sans-serif;margin:0}.h{padding:12px;border-bottom:2px solid #FFD700;text-align:center}.chat{padding:10px;padding-bottom:90px}.msg{border:1px solid #FFD700;border-radius:15px;padding:10px;margin:8px;max-width:85%;white-space:pre-wrap}.u{background:#FFD700;color:#000;margin-left:auto}.b{background:#222;color:#FFD700}.bar{position:fixed;bottom:0;left:0;right:0;display:flex;padding:10px;background:#000;border-top:2px solid #FFD700}input{flex:1;border-radius:20px;padding:12px;background:#111;color:#FFD700;border:1px solid #FFD700}button{background:#FFD700;color:#000;border:none;border-radius:20px;padding:12px 18px;margin-left:8px;font-weight:bold}a{color:gold;text-decoration:none;padding:6px 12px;border:1px solid gold;border-radius:10px;margin:0 4px}.active{background:gold;color:#000}</style></head><body><div class=h><h2 style=margin:0>Q A.I build by Abdulmalik | ${m.toUpperCase()}</h2><div style=margin-top:8px><a href="/?public" class=${m==='public'?'active':''}>PUBLIC</a><a href="/?owner" class=${m==='owner'?'active':''}>OWNER</a></div><div style=font-size:11px;margin-top:6px>${keyStatus}</div></div><div class=chat id=c></
