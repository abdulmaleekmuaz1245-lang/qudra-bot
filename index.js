const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/ping', (req,res)=> res.json({status:'online', time: new Date().toISOString()}));

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Q A.I</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:linear-gradient(180deg,#e6f0ff 0%,#ffffff 100%);font-family:Arial,sans-serif;padding-bottom:90px;min-height:100vh}
.header{height:120px;background:linear-gradient(135deg,#0a3d8f 0%,#0a66c2 40%,#3a9bff 100%);display:flex;align-items:center;justify-content:space-between;padding:0 18px}
.q-logo{width:56px;height:56px;background:white;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:#0a66c2}
.q-title{color:white;font-size:30px;font-weight:800;margin-left:12px}
.owner-btn{background:rgba(255,255,255,0.25);border:1px solid rgba(255,255,255,0.4);color:white;padding:7px 14px;border-radius:20px;font-size:11px;text-decoration:none}
.wrap{max-width:700px;margin:0 auto;padding:14px 12px}
.status-card{background:white;border-radius:18px;padding:10px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 6px 20px rgba(10,102,194,0.1);border:1px solid #e6f0ff;margin-bottom:12px}
.dot{width:10px;height:10px;border-radius:50%;box-shadow:0 0 8px currentColor}
.online{background:#00e676;color:#00e676;animation:pulse 2s infinite}
.offline{background:#9aa8c2}
@keyframes pulse{0%{transform:scale(1)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
.q-msg{background:white;border-radius:18px 18px 18px 4px;padding:12px 14px;max-width:82%;margin:10px 0;display:flex;gap:9px;box-shadow:0 4px 18px rgba(10,102,194,0.08);border:1px solid #f0f6ff}
.q-icon{width:34px;height:34px;background:linear-gradient(135deg,#0a66c2,#3a9bff);color:white;border-radius:10px;display:flex;align-items
