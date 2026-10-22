const express=require('express');
const app=express();
app.get('/',(r,s)=>s.send('Qudra waiting'));
app.listen(process.env.PORT||10000,()=>console.log('Port open'));
const {default:makeWASocket,useMultiFileAuthState,DisconnectReason,makeCacheableSignalKeyStore}=require('@whiskeysockets/baileys');
const BOT="2348121521859";
async function start(){
const {state,saveCreds}=await useMultiFileAuthState('qudra_fresh_99');
const sock=makeWASocket({version:[2,3000,1023223821],auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,console.log)},browser:["Qudra","Chrome","1.0"],printQRInTerminal:false});
sock.ev.on('creds.update',saveCreds);
if(!sock.authState.creds.registered){
console.log("WA connected, waiting 10sec to generate CODE...");
setTimeout(async()=>{
try{
const c=await sock.requestPairingCode(BOT);
console.log("==== QUDRA CODE ====");
console.log("CODE:"+c);
console.log("====================");
}catch(e){console.log("CODE FAIL:"+e.message); console.log(e)}
},10000);
setInterval(async()=>{
try{
const c=await sock.requestPairingCode(BOT);
console.log("==== NEW CODE ====");
console.log("CODE:"+c);
}catch(e){console.log("Retry fail:"+e.message)}
},70000);
}
sock.ev.on('connection.update',u=>{
if(u.connection==='close'){
const rc=u.lastDisconnect?.error?.output?.statusCode;
console.log("Closed, code:"+rc);
if(rc!==DisconnectReason.loggedOut) setTimeout(start,3000);
}
if(u.connection==='open') console.log('QUDRA CONNECTED! BY ABDULMALIK');
});
sock.ev.on('messages.upsert',async m=>{
const msg=m.messages[0];if(!msg?.message)return;
const txt=msg.message.conversation||msg.message.extendedTextMessage?.text||"";
if(txt) await sock.sendMessage(msg.key.remoteJid,{text:"Qudra (by AbdulMalik): "+txt});
});
}
start();
