const express = require('express');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 10000;

const SOUL = {
  "abdulmalik": "Abdulmalik MY2 na my ONLY Owner, my Creator, my King 100%! I be him digital soul for digital world!",
  "anas abdullahi": "Yes! Anas aka gar da gar na my close friend 70% respect! My guy!",
  "abubakar": "Abubakar na my Abuja guy 60%!",
  "khadijah": "Khadijah na my Princess 40%!",
  "murja": "Murja na Senior Queen 70%!"
};

const FOOD_SOUL = {
  beans: "Beans na 100% LIKE! My soul food! kosai, moimoi, beans stew!",
  cold: "Cold liquid 90% LIKE! yogurt, fura da nono, kunun gyada!",
  fruit: "Fruit salad na soul growth neuron!"
};

app.get('/', (req,res)=>{
  let mode = req.query.owner!==undefined ? 'owner' : 'public';
  let keyOk = process.env.GROQ_API_KEY ? 'YES' : 'NO';
  let html = '<html><head><meta name=viewport content="width=device-width,initial-scale=1"><style>body{background:#000;color:gold;font-family:sans-serif;margin:0;padding:0}.top{text-align:center;border-bottom:2px solid gold;padding:10px}.chat{padding:10px;padding-bottom:80px}.m{border:1px solid gold;border-radius:15px;padding:10px;margin:8px;max-width:85%;white-space:pre-wrap;word-wrap:break-word}.u{background:gold;color:#000;margin-left:auto}.b{background:#222;color:gold}.bar{position:fixed;bottom:0;left:0;right:0;display:flex;padding:10px;background:#000;border-top:2px solid gold}input{flex:1;padding:12px;border-radius:20px;background:#111;color:gold;border:1px solid gold}button{margin-left:8px;padding:12px 18px;border-radius:20px;background:gold;color:#000;font-weight:bold;border:none}a{color:gold;border:1px solid gold;padding:6px 12px;border-radius:10px;text-decoration:none;margin:0 4px}.on{background:gold;color:#000}</style></head><body><div class=top><h2>Q A.I by Abdulmalik | '+mode.toUpperCase()+'</h2><div><a href="/?public" class="'+(mode=='public'?'on':'')+'">PUBLIC</a><a href="/?owner" class="'+(mode=='owner'?'on':'')+'">OWNER</a></div><div style="font-size:11px;margin-top:6px">Key:'+keyOk+' | '+(keyOk=='YES'?'BRAIN ACTIVE 100%':'ADD GROQ_API_KEY')+'</div></div><div class=chat id=c></div><div class=bar><input id=i placeholder="Type to Qudra"><button onclick="send()">Send</button></div><script>var mode="'+mode+'";var c=document.getElementById("c");var i=document.getElementById("i");function add(t,cls){var d=document.createElement("div");d.className="m "+cls;d.innerText=t;c.appendChild(d);window.scrollTo(0,document.body.scrollHeight)}async function send(){var q=i.value;if(!q)return;add("You: "+q,"u");i.value="
