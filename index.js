const e=require('express'),a=e(),P=process.env.PORT||10000;
a.use(e.json({limit:'15mb'}));
let ADS=[{id:1,text:"🔥 Q A.I Premium - Contact Abdulmalik for advert! 5000 Naira/week",image:"",time:new Date().toLocaleString()}];
let ORDERS={default:["🍚 Jollof Rice - 2,500","🍔 Burger - 3,000","📱 Phone Repair - 2k","👕 Laundry - 1k"],kano:["🍚 Kano Suya - 2k","🥤 Zobo + Awara - 800","🏍️ Delivery Fast!"]};
const HUSNA=["Ar-Rahman","Ar-Rahim","Al-Malik"];
function userBrain(m){let l=m.toLowerCase(); if(l.includes('who are you')) return `I am Abdulmalik 👑 Owner of Q A.I!`; return `Na me Abdulmalik 👑 You: "${m}" - I hear you! Check 🛒 Order and 📢 Adverts! ✨`; }
function ownerBrain(m){
 let l=m.toLowerCase().trim();
 if(l==='/clear') return {cmd:'clear',reply:'👑 Cleared Boss!'};
 if(l.startsWith('/ad ')){let txt=m.slice(4); ADS.unshift({id:Date.now(),text:txt,image:"",time:new Date().toLocaleString()}); return {reply:`👑 Advert Posted! "${txt}" - Now for 📢 Adverts! 🤑`};}
 if(l==='/ads') return {reply:`👑 Ads (${ADS.length}):\n`+ADS.map(ad=>`• ${ad.text}`).join('\n')};
 if(l==='/owner help') return {reply:`👑 COMMANDS:\n• /ad [text] - Post text advert\n• Upload image + text for sticker advert for owner page\n• /ads - View ads\n• /clear`};
 return {reply:userBrain(m)};
}
a.get('/ping',(q,r)=>r.json({ok:1}));
a.get('/api/ads',(q,r)=>r.json(ADS));
a.post('/api/ads',(q,r)=>{let {text,image}=q.body; if(text||image){ADS.unshift({id:Date.now(),text:text||"",image:image||"",time:new Date().toLocaleString()});} r.json({ok:1,ads:ADS});});
a.post('/api/ads/delete',(q,r)=>{let {id}=q.body; ADS=ADS.filter(ad=>ad.id!=id); r.json({ok:1});});
a.post('/api/chat',(q,r)=>{let msg=q.body.msg||'',isOwner=q.body.owner||false; if(!isOwner) r.json({reply:userBrain(msg)}); else r.json(ownerBrain(msg));});

a.get('/',(q,r)=>{r.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Q A.I</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:linear-gradient(180deg,#e6f0ff,#fff);font-family:Arial;padding-bottom:90px;min-height:100vh}.h{height:120px;background:linear-gradient(135deg,#0a3d8f,#0a66c2,#3a9bff);display:flex;align-items:center;justify-content:space-between;padding:0 18px}.l{width:56px;height:56px;background:#fff;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:#0a66c2}.o{background:rgba(255,255,255,.25);color:#fff;padding:7px 14px;border-radius:20px;font-size:11px;text-decoration:none}.w{max-width:700px;margin:0 auto;padding:14px}.s{background:#fff;border-radius:18px;padding:10px 12px;display:flex;align-items:center;gap:8px;box-shadow:0 6px 20px rgba(10,102,194,.1);border:1px solid #e6f0ff;flex-wrap:wrap}.d{width:10px;height:10px;border-radius:50%}.on{background:#00e676;box-shadow:0 0 8px #00e676}.off{background:#9aa8c2}.abtn{background:linear-gradient(135deg,#0a66c2,#3a9bff);color:#fff;border:none;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:bold;cursor:pointer}.obtn{background:linear-gradient(135deg,#ff9800,#ff5722);color:#fff;border:none;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:bold;cursor:pointer}.qm{background:#fff;border-radius:18px 18px 18px 4px;padding:12px;max-width:82%;margin:10px 0;box-shadow:0 4px 18px rgba(10,102,194,.08);border:1px solid #f0f6ff;white-space:pre-wrap}.f{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);width:93%;max-width:680px;background:#fff;border-radius:26px;padding:7px 9px;display:flex;gap:7px;box-shadow:0 10px 35px rgba(10,102,194,.2);border:1px solid #e6f0ff}.f input{flex:1;border:none;outline:none;background:#f5f9ff;border-radius:20px;padding:11px 16px}.b{width:42px;height:42px;border-radius:50%;border:none;cursor:pointer;background:linear-gradient(135deg,#0a66c2,#3a9bff);color:#fff}.modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:999;align-items:center;justify-content:center;padding:
