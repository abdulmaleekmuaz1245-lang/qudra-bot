const express = require('express');
const fs = require('fs');
const path = require('path');
const https = require('https');
const app = express();
app.use(express.json({limit:'1mb'}));
app.use(express.static(__dirname));

// --- RAM ---
let ram = [];
try{ 
  const m = JSON.parse(fs.readFileSync(path.join(__dirname,'memory.json'),'utf8')); 
  ram = m.A || []; 
}catch(e){ ram = []; }
function saveRam(){ 
  try{ fs.writeFileSync(path.join(__dirname,'memory.json'), JSON.stringify({A:ram,B:[],C:[],D:[]},null,2)); }catch(e){} 
}

// --- GROQ CALL (NO FETCH BUG) ---
function callGroq(key, system, userText){
  return new Promise((resolve, reject)=>{
    const data = JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages:[{role:"system", content:system},{role:"user", content:userText}],
      temperature:0.85, max_tokens:150
    });
    const req = https.request({
      hostname: 'api.groq.com',
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers:{
        'Authorization': `Bearer ${key.trim()}`,
        'Content-Type':'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res)=>{
      let body='';
      res.on('data', c=> body+=c);
      res.on('end', ()=>{
        try{
          const j = JSON.parse(body);
          if(j
