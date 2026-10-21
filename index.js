const express=require('express');
const {default:makeWASocket,useMultiFileAuthState,DisconnectReason}=require('@whiskeysockets/baileys');
const QRCode=require('qrcode');
const {Boom}=require('@hapi/boom');
const app=express();
let qrImage=""; let botIsLive=false;
const PORT=process.env.PORT||3000;
const RENDER_URL=process.env.RENDER_EXTERNAL_URL||'https://qudra-bot.onrender.com';
setInterval(()=>{fetch(`${RENDER_URL}/ping`).then(()=>console.log("ping")).catch(()=>{});},5*60*1000);
async function startQudra(){
  const {state,saveCreds}=await useMultiFileAuthState('qudra_auth');
  const sock=makeWASocket({auth:state,printQRInTerminal:false,browser:["Qudra","Chrome","1.0"]});
  sock.ev.on('creds.update',saveCreds);
  sock.ev.on('connection.update',async(update)=>{
    const {connection,lastDisconnect,qr}=update;
    if(qr){qrImage=await QRCode.toDataURL(qr);}
    if(connection==='close'){
      const shouldReconnect=(lastDisconnect?.error).output?.statusCode!==DisconnectReason.loggedOut;
      if(shouldReconnect) startQudra();
    }else if(connection==='open'){botIsLive=true;qrImage=""; console.log("QUDRA LIVE");}
  });
  sock.ev.on('messages.upsert',async(m)=>{
    const msg=m.messages[0]; if(!msg.message||msg.key.fromMe) return;
    const from=msg.key.remoteJid;
    const text=msg.message.conversation||msg.message.extendedTextMessage?.text||"";
    if(!text) return;
    await sock.sendPresenceUpdate('composing',from);
    let reply=`Qudra here! You said: "${text}" - Created by Abdulmalik, loyal forever. Full brain active!`;
    if(text.toLowerCase().includes("who created you")) reply="I am Qudra, created by Abdulmalik - my loyal creator for 300 years legacy.";
    await sock.sendMessage(from,{text:reply});
  });
}
app.get('/qr',(req,res)=>{
  if(botIsLive) return res.send("<h1 style='text-align:center;margin-top:100px'>✅ Qudra LIVE 24/7!</h1>");
  if(!qrImage) return res.send("<h1>Generating QR... refresh in 5 sec</h1><script>setTimeout(()=>location.reload(),5000)</script>");
  res.send(`<div style='text-align:center'><h1>Scan Qudra to LIVE</h1><img src="${qrImage}" style="width:300px"><p>WhatsApp > Linked Devices > Link</p></div>`);
});
app.get('/ping',(req,res)=>res.send('Qudra awake!'));
app.get('/',(req,res)=>res.send('Qudra running - go to /qr'));
app.listen(PORT,()=>{startQudra();});
