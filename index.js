const express=require('express');
const {default:makeWASocket,useMultiFileAuthState,DisconnectReason}=require('@whiskeysockets/baileys');
const app=express();
const PORT=process.env.PORT||10000;
const BOT="2348121521859";
let botLive=false;
async function start(){
const {state,saveCreds}=await useMultiFileAuthState('qudra_auth');
const sock=makeWASocket({auth:state,browser:["Qudra","Chrome","1.0"]});
if(!sock.authState.creds.registered){
setTimeout(async()=>{
try{
let c=await sock.requestPairingCode(BOT);
console.log("==== QUDRA CODE ====");
console.log("CODE:"+c);
}catch(e){console.log(e.message)}
},4000);
}
sock.ev.on('creds.update',saveCreds);
sock.ev.on('connection.update',u=>{
if(u.connection==='close'&&u.lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut)start();
if(u.connection==='open'){botLive=true;console.log('QUDRA LIVE!');}
});
sock.ev.on('messages.upsert',async m=>{
const msg=m.messages[0];if(!msg?.message)return;
const txt=msg.message.conversation||msg.message.extendedTextMessage?.text||"";
if(!txt)return;
await sock.sendMessage(msg.key.remoteJid,{text:"Qudra: "+txt});
});
}
start();
app.get('/',(q,r)=>r.send(botLive?"Qudra LIVE":"Starting... Check Logs"));
app.listen(PORT);
