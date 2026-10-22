const express=require('express');
const app=express();
app.get('/',(r,s)=>s.send('Qudra online'));
app.listen(process.env.PORT||10000,()=>console.log('Port open'));

const {default:makeWASocket,useMultiFileAuthState,fetchLatestBaileysVersion,makeCacheableSignalKeyStore}=require('@whiskeysockets/baileys');
const BOT="2348121521859";

async function start(){
const {version}=await fetchLatestBaileysVersion();
const {state,saveCreds}=await useMultiFileAuthState('qudra_final_auth');
const sock=makeWASocket({version,auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,console.log)},browser:["Qudra Bot","Chrome","1.0"],printQRInTerminal:false});
sock.ev.on('creds.update',saveCreds);

if(!sock.authState.creds.registered){
  console.log("Connected to WA, waiting 15sec before CODE...");
  await new Promise(r=>setTimeout(r,15000));
  try{
    let code=await sock.requestPairingCode(BOT);
    console.log("\n==== QUDRA CODE ====");
    console.log(code.match(/.{1,4}/g)?.join("-") || code);
    console.log("Raw CODE:"+code);
    console.log("====================\n");
  }catch(e){console.log("First try fail:"+e.message);}

  setInterval(async()=>{
    try{
      let code=await sock.requestPairingCode(BOT);
      console.log("\n==== NEW CODE ====");
      console.log(code.match(/.{1,4}/g)?.join("-") || code);
      console.log("Raw CODE:"+code);
    }catch(e){console.log("Retry:"+e.message)}
  },60000);
}

sock.ev.on('connection.update',async(u)=>{
  if(u.connection==='open') console.log('QUDRA CONNECTED! BY ABDULMALIK');
  if(u.connection==='close'){
    console.log("Connection closed, restarting in 5s...");
    setTimeout(start,5000);
  }
});

sock.ev.on('messages.upsert',async m=>{
  const msg=m.messages[0]; if(!msg?.message) return;
  const txt=msg.message.conversation||msg.message.extendedTextMessage?.text||"";
  if(txt) await sock.sendMessage(msg.key.remoteJid,{text:"Qudra by AbdulMalik: "+txt});
});
}
start();
