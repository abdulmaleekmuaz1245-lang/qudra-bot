const e=require('express'),p=require('path'),c=require('cors'),fs=require('fs'),a=e(),P=process.env.PORT||10000;
a.use(c());a.use(e.json());a.use(e.static(__dirname));
let m={}; let vault={}; try{vault=JSON.parse(fs.readFileSync('vault.json'))}catch{vault={}}
a.get('/',(q,r)=>r.sendFile(p.join(__dirname,'index.html')));
a.post('/api/chat',async(q,r)=>{
let b=q.body,m1=b.message||'',u=b.userId||'g',o=(b.ownerName||'').toUpperCase(),k=process.env.GROQ_API_KEY;
let own=o=='ABDULMALIK'; if(!m[u])m[u]=[]; m[u].push({role:'user',content:m1}); if(m[u].length>14)m[u]=m[u].slice(-14);
if(own && (m1.toLowerCase().includes('khadija')||m1.toLowerCase().includes('remember'))){vault['personal']=(vault['personal']||'')+' | '+m1; try{fs.writeFileSync('vault.json',JSON.stringify(vault))}catch{}}
let personalInfo = own ? JSON.stringify(vault).slice(0,1800) : "Guest mode, no personal data";
let sysPrompt = own 
? `You are Q for Abdulmalik only. Vault: ${personalInfo}. Reply VERY SHORT, 1-2 sentences, simple Pidgin.`
: `You are Q, fun fantasy AI. Do NOT mention Khadija or vault or Abdulmalik secrets. Reply VERY SHORT, 1-2 sentences.`;
try{let x=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+k,'Content-Type':'application/json'},body:JSON.stringify({model:'openai/gpt-oss-20b',messages:[{role:'system',content:sysPrompt},...m[u]]})});
let d=await x.json(); let t=d.choices[0].message.content; m[u].push({role:'assistant',content:t}); r.json({reply:t});}catch(er){r.json({reply:'Network jam, try again boss'})}
});
a.get('/api/image',(q,r)=>{
let prompt=q.query.prompt||'fantasy kingdom';
let url=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&nologo=true&model=flux&enhance=true`;
r.json({imageUrl:url});
});
a.listen(P,()=>console.log('Q LIVE'));
