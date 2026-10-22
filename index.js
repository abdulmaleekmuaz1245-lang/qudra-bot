const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const P = require('pino')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 10000
app.get('/', (q,r)=>r.send('Qudra Bot Live - 2348121521859'))
app.listen(PORT, ()=>console.log('Server on '+PORT))

async function startBot(){
const {state,saveCreds}=await useMultiFileAuthState('auth_info')
const sock=makeWASocket({auth:state,logger:P({level:'silent'}),printQRInTerminal:true,browser:['Qudra','Chrome','1.0']})
sock.ev.on('creds.update',saveCreds)
sock.ev.on('connection.update',u=>{
if(u.connection==='open')console.log('CONNECTED - Qudra Bot is online!')
if(u.connection==='close')setTimeout(startBot,5000)
})
sock.ev.on('messages.upsert',async m=>{
const msg=m.messages[0]
if(!msg.message||msg.key.fromMe)return
const from=msg.key.remoteJid
const text=msg.message.conversation||msg.message.extendedTextMessage?.text||''
console.log('New msg: '+text)
await sock.sendMessage(from,{text:'Hello! Qudra Bot dey live ✅ You said: '+text})
})
if(!sock.authState.creds.registered){
setTimeout(async()=>{
try{
const code=await sock.requestPairingCode('2348121521859')
console.log('CODE:'+code)
console.log('Use this code now!')
}catch(e){console.log('Fail:'+e.message)}
},3000)
}
}
startBot()
