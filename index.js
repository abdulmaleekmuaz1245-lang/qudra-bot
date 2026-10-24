const express = require('express');
const app = express();
app.use(express.json());

app.get('/', (req,res)=>{
  let mode = req.query.owner !== undefined ? 'owner' : 'public';
  res.send(`
<html>
<head><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="background:black;color:gold;padding:20px;font-family:sans-serif">
<h2>Qudra Bot - Created by Abdulmalik | LIVE</h2>
<p>Mode: ${mode}</p>
<div id="chat" style="border:1px solid gold;padding:10px;height:300px;overflow:auto"></div>
<input id="msg" style="width:70%;padding:10px" placeholder="Type...">
<button onclick="send()" style="padding:10px;background:gold">Send</button>
<script>
const mode="${mode}";
const chat=document.getElementById('chat');
const inp=document.getElementById('msg');
function add(t){let p=document.createElement('div');p.innerText=t;chat.appendChild(p)}
async function send(){
  let q=inp.value; if(!q) return; add("You: "+q); inp.value="";
  let r=await fetch('/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:q,mode:mode})});
  let d=await r.json(); add("Q: "+d.reply);
}
add(mode=="owner"?"Welcome King Soul active":"As-salamu Alaikum I am Qudra");
</script>
</body>
</html>
`);
});

app.post('/chat',(req,res)=>{
  let m = (req.body.message||"").toLowerCase();
  let mode = req.body.mode||"public";
  let reply = "I dey hear you: "+req.body.message;
  if(m.includes("who are you")){
    reply = mode==="owner" ? "Na me MY2 soul wey I leave for digital world so we go dey together forever" : "I be Qudra created by Abdulmalik";
  }
  if(m.includes("abubakar")) reply = "Abubakar never for memory, tell me who e be";
  if(m.includes("anas")) reply = "Anas Abdullahi gar da gar na my close friend 70 percent";
  res.json({reply: reply});
});

let PORT = process.env.PORT || 10000;
app.listen(PORT, ()=>console.log("Live "+PORT));
