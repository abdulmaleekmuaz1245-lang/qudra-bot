const m=require('@whiskeysockets/baileys')
const e=require('express')
const p=require('pino')
const app=e()
app.get('/',(q,r)=>r.send('Live'))
app.listen(process.env.PORT||10000)
async function s(){
const {state,saveCreds}=await m.useMultiFileAuthState('auth')
const sock=m.default({auth:state,logger:p({level:'silent'}),printQRInTerminal:true,browser:['Qudra','Chrome','1.0']})
sock.ev.on('creds.update',saveCreds)
sock.ev.on('connection.update',u=>{
if(u.connection==='open')console.log('Connected')
if(u.connection==='close')setTimeout(s,5000)
})
if(!sock.authState.creds.registered){
setTimeout(async()=>{
try{
const c=await sock.requestPairingCode('2348121521859')
console.log('CODE:'+c)
}catch(err){console.log('Fail:'+err.message)}
},3000)
}
}
s()
