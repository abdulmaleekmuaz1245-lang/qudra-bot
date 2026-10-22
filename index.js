const express=require('express');
const app=express();
const PORT=process.env.PORT||10000;
app.get('/',(req,res)=>res.send('Qudra LIVE - Check logs for CODE'));
app.listen(PORT,()=>console.log('Port open on '+PORT));

const {default:makeWASocket,useMultiFileAuthState,DisconnectReason}=require('@whiskeysockets/baileys');
const BOT="2348121521859";

async function start(){
const {state,saveCreds}=await useMultiFileAuthState('qudra_auth');
const sock=makeWASocket({auth:state,browser:["Qudra","Chrome","1.0"]});
sock.ev.on('creds.update',saveCreds);
if(!sock.authState.creds.registered){
setTimeout(async()=>{
try{
let c=await sock.requestPairingCode(BOT);
console.log("==== QUDRA CODE ====");
console.log("CODE:"+c);
console.log("==================");
}catch(e){console.log("Pair error: "+e.message)}
},5000);
}
sock.ev.on('connection.update',u=>{
const {connection,lastDisconnect}=u;
if(connection==='close'&&lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut){start()}
if(connection==='open'){console.log('QUDRA CONNECTED!')}
});
sock.ev.on('messages.upsert',async m=>{
const msg=m.messages[0];if(!msg?.message)return;
const txt=msg.message.conversation||msg.message.extendedTextMessage?.text||"";
if(!txt)return;
await sock.sendMessage(msg.key.remoteJid,{text:"Qudra here (by AbdulMalik): "+txt});
});
}
start();
