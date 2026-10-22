const express=require('express');
const app=express();
const PORT=process.env.PORT||10000;
app.get('/',(r,s)=>s.send('Qudra waiting for link - check logs for CODE'));
app.listen(PORT,()=>console.log('Port open '+PORT));
const {default:makeWASocket,useMultiFileAuthState,DisconnectReason}=require('@whiskeysockets/baileys');
const BOT="2348121521859";
async function start(){
const {state,saveCreds}=await useMultiFileAuthState('qudra_auth');
const sock=makeWASocket({auth:state,browser:["Qudra","Chrome","1.0"]});
sock.ev.on('creds.update',saveCreds);
if(!sock.authState.creds.registered){
const gen=async()=>{
try{
let c=await sock.requestPairingCode(BOT);
console.log("==== NEW QUDRA CODE ====");
console.log("CODE:"+c);
console.log("Enter this in WhatsApp Linked Devices within 60 seconds!");
console.log("========================");
}catch(e){console.log("Gen error:"+e.message)}
};
await gen();
setInterval(gen,60000);
}
sock.ev.on('connection.update',u=>{
if(u.connection==='close'&&u.lastDisconnect?.error?.output?.statusCode!==DisconnectReason.loggedOut)start();
if(u.connection==='open'){console.log('QUDRA CONNECTED! BY ABDULMALIK');}
});
sock.ev.on('messages.upsert',async m=>{
const msg=m.messages[0];if(!msg?.message)return;
const txt=msg.message.conversation||msg.message.extendedTextMessage?.text||"";
if(txt) await sock.sendMessage(msg.key.remoteJid,{text:"Qudra (by AbdulMalik): "+txt});
});
}
start();
