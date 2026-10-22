const express=require('express');
const app=express();
const PORT=process.env.PORT||10000;
app.get('/',(r,s)=>s.send('Qudra online - check Render logs for CODE'));
app.listen(PORT,()=>console.log('Port open '+PORT));
const {default:makeWASocket,useMultiFileAuthState,DisconnectReason}=require('@whiskeysockets/baileys');
const BOT="2348121521859";
async function start(){
const {state,saveCreds}=await useMultiFileAuthState('qudra_new_session');
const sock=makeWASocket({auth:state,browser:["Qudra","Chrome","1.0"]});
sock.ev.on('creds.update',saveCreds);
if(!sock.authState.creds.registered){
setTimeout(async()=>{
try{
let c=await sock.requestPairingCode(BOT);
console.log("==== NEW QUDRA CODE ====");
console.log("CODE:"+c);
console.log("========================");
}catch(e){console.log("Gen error:"+e.message)}
},5000);
setInterval(async()=>{
try{
let c=await sock.requestPairingCode(BOT);
console.log("==== NEW QUDRA CODE ====");
console.log("CODE:"+c);
}catch(e){}
},60000);
}
sock.ev.on('connection.update',u=>{
const {connection,lastDisconnect}=u;
if(connection==='close'){
let rc=lastDisconnect?.error?.output?.statusCode;
if(rc!==DisconnectReason.loggedOut){console.log("Reconnecting...");start()}
else{console.log("Logged out")}
}
if(connection==='open'){console.log('QUDRA CONNECTED! BY ABDULMALIK');}
});
sock.ev.on('messages.upsert',async m=>{
const msg=m.messages[0];if(!msg?.message)return;
const txt=msg.message.conversation||msg.message.extendedTextMessage?.text||"";
if(txt) await sock.sendMessage(msg.key.remoteJid,{text:"Qudra (by AbdulMalik): "+txt});
});
}
start();
