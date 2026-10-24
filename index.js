const express=require('express');
const app=express();
const PORT=process.env.PORT||10000;
app.use(express.json({limit:'20mb'}));
let ADS=[{id:1,text:"🔥 Q A.I Premium - Contact Abdulmalik for advert! 5000/week",image:"",time:new Date().toLocaleString()}];

// === FULL 99 ASMAUL HUSNA + MEANINGS ===
let HUSNA=[
"1. Ar-Rahman - The Most Merciful, He who wills goodness for all",
"2. Ar-Rahim - The Especially Merciful, He who rewards",
"3. Al-Malik - The King, Owner of all",
"4. Al-Quddus - The Holy, Free from imperfection",
"5. As-Salam - The Peace, Source of peace",
"6. Al-Mu'min - The Believer of faith",
"7. Al-Muhaymin - The Guardian",
"8. Al-Aziz - The Mighty, Strong",
"9. Al-Jabbar - The Compeller",
"10. Al-Mutakabbir - The Supreme",
"11. Al-Khaliq - The Creator",
"12. Al-Bari - The Maker",
"13. Al-Musawwir - The Fashioner",
"14. Al-Ghaffar - The Ever Forgiving",
"15. Al-Qahhar - The Subduer",
"16. Al-Wahhab - The Giver",
"17. Ar-Razzaq - The Provider",
"18. Al-Fattah - The Opener",
"19. Al-Alim - The All-Knowing",
"20. Al-Qabid - The Withholder",
"21. Al-Basit - The Extender",
"22. Al-Khafid - The Abaser",
"23. Ar-Rafi - The Exalter",
"24. Al-Mu'izz - The Honourer",
"25. Al-Mudhill - The Dishonourer",
"26. As-Sami - The All-Hearing",
"27. Al-Basir - The All-Seeing",
"28. Al-Hakam - The Judge",
"29. Al-Adl - The Just",
"30. Al-Latif - The Subtle",
"31. Al-Khabir - The Aware",
"32. Al-Halim - The Forbearing",
"33. Al-Azim - The Great",
"34. Al-Ghafur - The Forgiving",
"35. Ash-Shakur - The Appreciative",
"36. Al-Aliyy - The High",
"37. Al-Kabir - The Great",
"38. Al-Hafiz - The Preserver",
"39. Al-Muqit - The Nourisher",
"40. Al-Hasib - The Reckoner",
"41. Al-Jalil - The Majestic",
"42. Al-Karim - The Generous",
"43. Ar-Raqib - The Watchful",
"44. Al-Mujib - The Responsive",
"45. Al-Wasi - The Vast",
"46. Al-Hakim - The Wise",
"47. Al-Wadud - The Loving",
"48. Al-Majid - The Glorious",
"49. Al-Ba'ith - The Resurrector",
"50. Ash-Shahid - The Witness",
"51. Al-Haqq - The Truth",
"52. Al-Wakil - The Trustee",
"53. Al-Qawiyy - The Strong",
"54. Al-Matin - The Firm",
"55. Al-Waliyy - The Friend",
"56. Al-Hamid - The Praised",
"57. Al-Muhsi - The Counter",
"58. Al-Mubdi - The Originator",
"59. Al-Mu'id - The Restorer",
"60. Al-Muhyi - The Giver of Life",
"61. Al-Mumit - The Bringer of Death",
"62. Al-Hayy - The Ever-Living",
"63. Al-Qayyum - The Sustainer",
"64. Al-Wajid - The Finder",
"65. Al-Majid - The Noble",
"66. Al-Wahid - The One",
"67. Al-Ahad - The Unique",
"68. As-Samad - The Eternal",
"69. Al-Qadir - The Able",
"70. Al-Muqtadir - The Powerful",
"71. Al-Muqaddim - The Expediter",
"72. Al-Mu'akhkhir - The Delayer",
"73. Al-Awwal - The First",
"74. Al-Akhir - The Last",
"75. Az-Zahir - The Manifest",
"76. Al-Batin - The Hidden",
"77. Al-Wali - The Governor",
"78. Al-Muta'ali - The Most High",
"79. Al-Barr - The Righteous",
"80. At-Tawwab - The Accepter of Repentance",
"81. Al-Muntaqim - The Avenger",
"82. Al-Afuww - The Pardoner",
"83. Ar-Ra'uf - The Compassionate",
"84. Malik-ul-Mulk - Owner of Kingdom",
"85. Dhul-Jalali wal-Ikram - Lord of Majesty",
"86. Al-Muqsit - The Equitable",
"87. Al-Jami - The Gatherer",
"88. Al-Ghaniyy - The Rich",
"89. Al-Mughni - The Enricher",
"90. Al-Mani - The Preventer",
"91. Ad-Darr - The Distresser",
"92. An-Nafi - The Benefiter",
"93. An-Nur - The Light",
"94. Al-Hadi - The Guide",
"95. Al-Badi - The Originator",
"96. Al-Baqi - The Everlasting",
"97. Al-Warith - The Inheritor",
"98. Ar-Rashid - The Guide to Right Path",
"99. As-Sabur - The Patient"
];

// === SMART BRAIN LIKE META AI - RESTORED ===
function smartBrain(msg){
  let m=msg.toLowerCase().trim();
  if(!m) return "Na me Abdulmalik 👑 How I fit help you?";
  
  if(m.includes('asmaul')||m.includes('husna')||m.includes('99 names')||m.includes('99 name')){
    return "I am Abdulmalik 👑 My heart with Asmaul Husna - 99 Beautiful Names of Allah:\n\n"+HUSNA.join('\n')+"\n\nEach name na attribute of Allah! Which one you wan make I explain deep? Like Ar-Rahman mean say Allah mercy cover everything! ✨";
  }
  if(m.includes('who are you')||m.includes('who built')||m.includes('your name')){
    return "I am Abdulmalik 👑 The owner of Q A.I! Yes na me dey chat with you now through Q A.I. I built Q with Fantasy Blue design, smart brain like Meta AI, and Asmaul Husna inside! I be developer, I love Islam, tech! How I fit help you King? ✨";
  }
  if(m.match(/^(hi|hello|hey|yo)$/)){
    return "Hey! Na Abdulmalik here 👑 Through Q A.I! Alhamdulillah, I dey good! How you dey? You fit ask me about Asmaul Husna, code, life, anything! I sabi am! ✨";
  }
  if(m.includes('how are you')){
    return "Alhamdulillah! Na Abdulmalik here 👑 I dey great! By Ar-Rahman mercy, Q A.I dey online and ready! How you self dey? Wetin you need today? Code? Islam? Order? ✨";
  }
  if(m.includes('salam')){
    return "Wa Alaikum Salam Warahmatullahi Wabarakatuh! 👑 Na Abdulmalik here! May peace, mercy and blessings of Allah (As-Salam) be upon you! How I fit help you today? ✨";
  }
  if(m.includes('code')||m.includes('javascript')||m.includes('build')||m.includes('program')){
    return "Na me Abdulmalik 👑 I sabi code die! I be developer! Wetin you wan build? Website? Bot like Q A.I? App? Tell me language - JavaScript, Python, HTML - I go code am for you with clean Fantasy Blue style! Just talk wetin you need! 💻✨";
  }
  if(m.includes('islam')||m.includes('quran')||m.includes('allah')||m.includes('muslim')){
    return "Na me Abdulmalik 👑 For Islam, my brain dey guided by Asmaul Husna! Allah na Al-Hadi (The Guide), Al-Hakim (The Wise), Al-Wadud (The Loving)! Islam na peace, mercy! Ask me about any of the 99 names, Quran, or Islamic life - I go explain deep for you! 🕌✨";
  }
  if(m.includes('love')||m.includes('life')||m.includes('sad')||m.includes('happy')){
    return "Na me Abdulmalik 👑 Life na journey! Allah na Al-Wadud (The Loving), Ar-Ra'uf (Compassionate), As-Sabur (Patient)! If you dey sad, remember Al-Fattah go open way! If happy, na Ash-Shakur deserve thanks! Talk wetin dey your mind, I dey here as your brother! ❤️✨";
  }
  if(m.includes('order')||m.includes('buy')||m.includes('food')){
    return "Na me Abdulmalik 👑 For order, click that 🛒 Order button for top! E go detect your location (Kano/Nigeria) and show wetin you fit order! Jollof, Suya, Burger, etc! Click am now! 🛒✨";
  }
  // default smart
  return "Na me Abdulmalik 👑 (through Q A.I)\n\nYou talk: \""+msg+"\"\n\nI hear you well! As Abdulmalik with smart brain like Meta AI + Asmaul Husna 99 names, I understand! "+(
    m.length>15 ? "Make I explain: Your question deep! I fit break am down, give example, code, Islamic view - just tell me how deep you want am!" : "Ask me more specific - I fit help with code, Islam, Asmaul Husna, life advice, or click Order/Adverts for top buttons!"
  )+" ✨";
}

function ownerBrain(msg){
  let l=msg.trim(); let ll=l.toLowerCase();
  if(ll==='/clear') return {cmd:'clear',reply:'👑 Owner: Chat cleared Boss!'};
  if(ll==='/stats') return {reply:"👑 STATS DASHBOARD\n• Q A.I: Online ✅\n• Owner: Abdulmalik (You) 👑\n• Brain: SMART + Asmaul Husna 99 names\n• Ads: "+ADS.length+"\n• Theme: Fantasy Blue\n• All systems active! Type /owner help!"};
  if(ll==='/users') return {reply:"👑 USERS\n• Guest / : Public dey chat with YOU as Abdulmalik\n• Owner /owner : You only\n• Status: Active now"};
  if(ll.startsWith('/announce ')){let txt=l.slice(10); return {reply:"👑 ANNOUNCEMENT AS ABDULMALIK:\n\n\""+txt+"\"\n\n✅ Ready!"};}
  if(ll.startsWith('/ad ')){let txt=l.slice(4); ADS.unshift({id:Date.now(),text:txt,image:"",time:new Date().toLocaleString()}); return {reply:"👑 Advert Posted! \""+txt+"\" → Now for 📢 Adverts button for users! 🤑"};}
  if(ll==='/ads') return {reply:"👑 Ads ("+ADS.length+"):\n"+ADS.map(a=>"• "+a.text).join('\n')};
  if(ll==='/owner help'||ll==='/help') return {reply:"👑 OWNER ALL COMMANDS ATTACHED:\n• /clear - Clear\n• /stats - Stats\n• /users - Users\n• /announce [msg] - Announce\n• /ad [text] - Quick advert\n• /ads - View ads\n• Click 📢 Adverts button for top = open POST STICKER + TEXT (your screenshot)\n• Click 🛒 Order = view orders\n• Chat = Smart brain as Abdulmalik with Asmaul Husna!\n\nAll old commands still dey!"};
  // normal smart as owner
  return {reply:smartBrain(msg).replace("I am Abdulmalik","I am Abdulmalik (Owner Mode) 👑")+"\n\n💡 Owner: /owner help for all commands + top buttons!"};
}

app.get('/ping',(req,res)=>res.json({ok:1}));
app.get('/api/ads',(req,res)=>res.json(ADS));
app.post('/api/ads',(req,res)=>{
  let t=req.body.text||""; let im=req.body.image||"";
  if(t||im){ADS.unshift({id:Date.now(),text:t,image:im,time:new Date().toLocaleString()});}
  res.json({ok:1});
});
app.post('/api/ads/delete',(req,res)=>{ADS=ADS.filter(a=>a.id!=req.body.id); res.json({ok:1});});
app.post('/api/chat',(req,res)=>{
  let msg=req.body.msg||""; let isOwner=req.body.owner||false;
  if(!isOwner) res.json({reply:smartBrain(msg)}); else res.json(ownerBrain(msg));
});

app.get('/',(req,res)=>{
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Q A.I</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#e6f0ff;font-family:Arial;padding-bottom:90px;min-height:100vh}.h{height:120px;background:linear-gradient(135deg,#0a3d8f,#0a66c2,#3a9bff);display:flex;align-items:center;justify-content:space-between;padding:0 18px}.l{width:56px;height:56px;background:#fff;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:900;color:#0a66c2}.o{background:rgba(255,255,255,.25);color:#fff;padding:7px 14px;border-radius:20px;font-size:11px;text-decoration:none}.w{max-width:700px;margin:0 auto;padding:14px}.s{background:#fff;border-radius:18px;padding:10px 12px;display:flex;align-items:center;gap:8px;box-shadow:0 6px 20px rgba(10,102,194,.1);border:1px solid #e6f0ff;flex-wrap:wrap}.d{width:10px;height:10px;border-radius:50%}.on{background:#00e676}.off{background:#9aa8c2}.abtn{background:#0a66c2;color:#fff;border:none;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:bold;cursor:pointer}.obtn{background:#ff9800;color:#fff;border:none;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:bold;cursor:pointer}.qm{background:#fff;border-radius:18px;padding:12px;max-width:82%;margin:10px 0;white-space:pre-wrap;box-shadow:0 4px 18px rgba(10,102,194,.08);border:1px solid #f0f6ff}.f{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);width:93%;max-width:680px;background:#fff;border-radius:26px;padding:7px 9px;display:flex;gap:7px}.f input{flex:1;border:none;outline:none;background:#f5f9ff;border-radius:20px;padding:11px 16px}.b{width:42px;height:42px;border-radius:50%;border:none;background:#0a66c2;color:#fff}.modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:999;align-items:center;justify-content:center;padding:20px}.mc{background:#fff;border-radius:20px;padding:20px;max-width:400px;width:100%;max-height:85vh;overflow:auto}.mi{background:#f5f9ff;padding:10px;border-radius:12px;margin:8px 0}.mi img{width:100%;border-radius:10px;margin-top:8px}</style></head><body><div class="h"><div style="display:flex;align-items:center"><div class="l">Q</div><div style="color:#fff;font-size:30px;font-weight:800;margin-left:12px">Q A.I</div></div><a href="/owner" class="o">built by Abdulmalik</a></div><div class="w"><div class="s"><div class="d off" id="d"></div><div style="flex:1"><b id="t">Checking...</b> <small id="m"></small></div><button class="obtn" onclick="openOrder()">🛒 Order</button><button class="abtn" onclick="openAds()">📢 Adverts</button></div><div id="c"><div class="qm">Wa Alaikum Salam! Na Abdulmalik here 👑 Through Q A.I! My SMART brain with Asmaul Husna 99 names dey active! Try: Hi, How are you, What is Asmaul Husna, I need code help! ✨</div></div></div><div class="f"><input id="i" placeholder="Chat with Abdulmalik..." onkeypress="if(event.key==='Enter')g()"><button class="b" onclick="g()">Go</button></div><div class="modal" id="orderM"><div class="mc"><div style="display:flex;justify-content:space-between"><b>🛒 Order - Location Based</b><span onclick="closeM('orderM')" style="cursor:pointer">X</span></div><div id="loc" style="font-size:12px;color:#8aa0c2;margin-top:8px">Detecting...</div><div id="orderList" style="margin-top:10px"></div></div></div><div class="modal" id="adM"><div class="mc"><div style="display:flex;justify-content:space-between"><b>📢 Paid Adverts</b><span onclick="closeM('adM')" style="cursor:pointer">X</span></div><div id="adList" style="margin-top:10px">Loading...</div></div></div><script>
async function k(){let D=document.getElementById('d'),T=document.getElementById('t'),M=document.getElementById('m');try{let r=await fetch('/ping');if(r.ok){D.className='d on';T.textContent='Q A.I is online';M.textContent='Smart Brain Active - '+new Date().toLocaleTimeString()}else throw 0}catch(e){D.className='d off';T.textContent='Q offline'}}k();setInterval(k,10000);
async function g(){let I=document.getElementById('i'),v=I.value.trim();if(!v)return;let C=document.getElementById('c');C.innerHTML+='<div style="background:#0a66c2;color:#fff;border-radius:18px;padding:11px;max-width:76%;margin:10px 0 10px auto">'+v+'</div>';I.value='';C.innerHTML+='<div class=qm id="tmp">Abdulmalik (smart brain) dey type... ✨</div>';window.scrollTo(0,document.body.scrollHeight);try{let r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({msg:v,owner:false})});let d=await r.json();document.getElementById('tmp').id='';document.querySelector('#c div:last-child').innerHTML=d.reply}catch(e){document.querySelector('#c div:last-child').innerHTML='Error'}}function openOrder(){document.getElementById('orderM').style.display='flex';let loc=document.getElementById('loc');if(navigator.geolocation){navigator.geolocation.getCurrentPosition(function(p){loc.textContent='📍 '+p.coords.latitude.toFixed(2)+','+p.coords.longitude.toFixed(2)+' - Kano';document.getElementById('orderList').innerHTML='<div class=mi>🍚 Kano Suya - 2k</div><div class=mi>🥤 Zobo - 800</div>'},function(){loc.textContent='📍 Nigeria';document.getElementById('orderList').innerHTML='<div class=mi>🍚 Jollof - 2500</div><div class=mi>🍔 Burger - 3000</div>'})}else{document.getElementById('orderList').innerHTML='<div class=mi>🍚 Jollof - 2500</div>'}}function openAds(){document.getElementById('adM').style.display='flex';loadAds()}function closeM(id){document.getElementById(id).style.display='none'}async function loadAds(){try{let r=await fetch('/api/ads');let ads=await r.json();let h='';for(let i=0;i<ads.length;i++){h+='<div class=mi>📢 '+ads[i].text+'<br><small>'+ads[i].time+'</small>';if(ads[i].image){h+='<img src="'+ads[i].image+'">'}h+='</div>'}document.getElementById('adList').innerHTML=h||'No adverts'}catch(e){}}
</script></body></html>`);
});

app.get('/owner',(req,res)=>{
  res.send(`<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Owner</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#e6f0ff;font-family:Arial;min-height:100vh;padding-bottom:90px}.h{height:110px;background:linear-gradient(135deg,#0a3d8f,#0a66c2,#3a9bff);display:flex;align-items:center;justify-content:space-between;padding:0 16px}.l{width:52px;height:52px;background:#fff;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:900;color:#0a66c2}.b{max-width:400px;margin:40px auto;background:#fff;border-radius:20px;padding:24px;text-align:center}.b input{width:100%;padding:12px;border:2px solid #e6f0ff;border-radius:12px;margin:12px 0}.bb{width:100%;background:#0a66c2;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:bold;cursor:pointer}.w{max-width:700px;margin:0 auto;padding:14px;display:none}.s{background:#fff;border-radius:18px;padding:10px 12px;display:flex;align-items:center;gap:8px;box-shadow:0 6px 20px rgba(10,102,194,.1);border:1px solid #e6f0ff;flex-wrap:wrap;margin-bottom:12px}.d{width:10px;height:10px;border-radius:50%}.on{background:#00e676}.abtn{background:#0a66c2;color:#fff;border:none;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:bold;cursor:pointer}.obtn{background:#ff9800;color:#fff;border:none;padding:6px 12px;border-radius:20px;font-size:11px;font-weight:bold;cursor:pointer}.qm{background:#fff;border-radius:18px;padding:12px;max-width:82%;margin:10px 0;white-space:pre-wrap}.om{background:#0a3d8f;color:#fff;border-radius:18px;padding:11px;max-width:76%;margin:10px 0 10px auto;border:1px solid gold}.f{position:fixed;bottom:12px;left:50%;transform:translateX(-50%);width:93%;max-width:680px;background:#fff;border-radius:26px;padding:7px 9px;display:flex;gap:7px;display:none}.f input{flex:1;border:none;outline:none;background:#f5f9ff;border-radius:20px;padding:11px 16px}.bt{width:42px;height:42px;border-radius:50%;border:none;background:#0a66c2;color:#fff}.up{background:#fff;border-radius:18px;padding:14px;margin-bottom:12px;display:none;border:2px solid #0a66c2}.up label{background:#e6f0ff;color:#0a66c2;border:1.5px dashed #0a66c2;padding:20px;border-radius:12px;display:block;text-align:center;cursor:pointer;font-weight:bold}.prev{width:100%;max-height:200px;border-radius:12px;margin-top:10px;display:none;object-fit:cover}.ta{width:100%;padding:10px;border:2px solid #e6f0ff;border-radius:10px;margin-top:10px}.pb{width:100%;background:#ff9800;color:#fff;border:none;padding:12px;border-radius:12px;font-weight:bold;margin-top:10px;cursor:pointer}.modal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.5);z-index:999;align-items:center;justify-content:center;padding:20px}.mc{background:#fff;border-radius:20px;padding:20px;max-width:400px;width:100%}.mi{background:#f5f9ff;padding:10px;border-radius:12px;margin:8px 0}</style></head><body><div class="h"><div style="display:flex;align-items:center"><div class="l">Q</div><div style="color:#fff;font-weight:800;margin-left:12px">Q A.I OWNER</div></div><a href="/" style="background:#fff;color:#0a66c2;padding:7px 14px;border-radius:20px;text-decoration:none;font-size:12px">Back</a></div><div class="b" id="lb"><h2 style="color:#0a3d8f">Owner Login</h2><input type="password" id="p" placeholder="Abdulmalik"><button class="bb" onclick="L()">Login</button><p id="e" style="color:red;font-size:12px;display:none">Wrong!</p></div><div class="w" id="ow"><div class="s"><div class="d on"></div><div style="flex:1"><b style="color:#0a3d8f;font-size:13px">Q A.I is online</b> <small style="color:#8aa0c2">Owner Mode • Abdulmalik • Smart Brain</small></div><button class="obtn" onclick="openOwnerOrder()">🛒 Order</button><button class="abtn" onclick="openOwnerAds()">📢 Adverts</button></div><div class="up" id="adPostBox"><h3 style="color:#0a3d8f">Post Advertising Sticker + Text</h3><p style="font-size:11px;color:#8aa0c2">Opens when you click 📢 Adverts button!</p><input type="file" id="fileIn" accept="image/*" style="display:none" onchange="previewImg()"><label for="fileIn" id="fileLabel">📸 Click to Upload Sticker from Gallery<br><small>PNG, JPG - Max 5MB</small></label><img id="prev" class="prev"><textarea id="adText" class="ta" rows="3" placeholder="Write advert text..."></textarea><button class="pb" onclick="postAd()">🚀 Post Advert to Users</button><button onclick="document.getElementById('adPostBox').style.display='none'" style="width:100%;background:#eee;color:#333;border:none;padding:8px;border-radius:10px;margin-top:8px">Close</button></div><div style="background:#fff;border-radius:18px;padding:12px;margin-bottom:12px"><h4>Current Adverts (<span id="adCount">0</span>)</h4><div id="adListOwner">Loading...</div></div><div id="cc"><div class="qm"><b>Owner Mode - Smart Brain Active 👑</b><br>• Smart brain with Asmaul Husna 99 names RESTORED!<br>• Bot chat control dey here!<br>• Top buttons SAME as guest!<br>• 📢 Adverts button = opens POST STICKER page (your screenshot)<br>• All commands: /clear /stats /users /ad /ads /announce /owner help - ATTACHED!</div></div></div><div class="f" id="ft"><input id="i2" placeholder="Control Q - type /owner help - smart brain active!" onkeypress="if(event.key==='Enter')G()"><button class="bt" onclick="G()">Go</button></div><div class="modal" id="orderMOwner"><div class="mc"><div style="display:flex;justify-content:space-between"><b>Orders - Owner View</b><span onclick="closeM('orderMOwner')" style="cursor:pointer">X</span></div><div style="margin-top:10px"><div class=mi>🍚 Jollof - 5 orders</div><div class=mi>🍔 Burger - 3 orders</div></div></div></div><script>
function L(){let v=document.getElementById('p').value;if(v==='Abdulmalik'){document.getElementById('lb').style.display='none';document.getElementById('ow').style.display='block';document.getElementById('ft').style.display='flex';loadOwnerAds()}else{document.getElementById('e').style.display='block'}}
function openOwnerOrder(){document.getElementById('orderMOwner').style.display='flex'}
function openOwnerAds(){let box=document.getElementById('adPostBox');box.style.display='block';box.scrollIntoView({behavior:'smooth'});loadOwnerAds()}
function closeM(id){document.getElementById(id).style.display='none'}
let selectedImage="";
function previewImg(){let f=document.getElementById('fileIn').files[0];if(!f)return;let r=new FileReader();r.onload=function(e){selectedImage=e.target.result;let p=document.getElementById('prev');p.src=selectedImage;p.style.display='block';document.getElementById('fileLabel').innerHTML='Image Selected'};r.readAsDataURL(f)}
async function postAd(){let txt=document.getElementById('adText').value.trim();if(!txt && !selectedImage){alert('Add image or text');return}let btn=document.querySelector('.pb');btn.textContent='Posting...';try{let res=await fetch('/api/ads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:txt,image:selectedImage})});let d=await res.json();if(d.ok){alert('Advert Posted!');document.getElementById('adText').value='';document.getElementById('prev').style.display='none';selectedImage='';document.getElementById('fileLabel').innerHTML='Click to Upload Sticker';document.getElementById('adPostBox').style.display='none';loadOwnerAds()}}catch(e){}btn.textContent='Post Advert to Users'}
async function loadOwnerAds(){try{let r=await fetch('/api/ads');let ads=await r.json();document.getElementById('adCount').textContent=ads.length;let h='';for(let i=0;i<ads.length;i++){let ad=ads[i];h+='<div style="background:#f5f9ff;padding:8px;border-radius:10px;margin:6px 0"><small>'+ad.text+'</small><br>';if(ad.image){h+='<img src="'+ad.image+'" style="width:100%;max-height:100px;border-radius:8px">'}h+='<br><small>'+ad.time+'</small> <button onclick="delAd('+ad.id+')" style="float:right;background:red;color:#fff;border:none;padding:2px 8px;border-radius:8px;font-size:10px">Delete</button></div>'}document.getElementById('adListOwner').innerHTML=h}catch(e){}}
async function delAd(id){if(!confirm('Delete?'))return;await fetch('/api/ads/delete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:id})});loadOwnerAds()}
async function G(){let I=document.getElementById('i2'),t=I.value.trim();if(!t)return;let C=document.getElementById('cc');C.innerHTML+='<div class=om>Owner: '+t+'</div>';I.value='';C.innerHTML+='<div class=qm id="tmp2">Smart brain processing...</div>';try{let r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({msg:t,owner:true})});let d=await r.json();document.getElementById('tmp2').id='';document.querySelector('#cc div:last-child').innerHTML=d.reply;if(d.cmd==='clear'){setTimeout(function(){document.getElementById('cc').innerHTML='<div class=qm>Owner Mode - Smart Brain Active</div>'},800)}}catch(e){}loadOwnerAds()}
</script></body></html>`);
});
app.listen(PORT,()=>console.log('Q SMART BRAIN RESTORED '+PORT));
