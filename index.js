const e=require('express'),p=require('path'),c=require('cors'),fs=require('fs'),a=e(),P=process.env.PORT||10000;
a.use(c());a.use(e.json());a.use(e.static(__dirname));let m={};
let vault={}; try{vault=JSON.parse(fs.readFileSync('vault.json'))}catch{vault={}}
a.get('/',(q,r)=>r.sendFile(p.join(__dirname,'index.html')));

// CHAT WITH VAULT
a.post('/api/chat',async(q,r)=>{
let b=q.body,m1=b.message||'',u=b.userId||'g',o=(b.ownerName||'').toUpperCase(),k=process.env.GROQ_API_KEY;
let own=o=='ABDULMALIK'; if(!m[u])m[u]=[]; m[u].push({role:'user',content:m1}); if(m[u].length>14)m[u]=m[u].slice(-14);
if(m1.toLowerCase().includes('khadija')||m1.toLowerCase().includes('remember')||m1.length>20){vault['personal']=(vault['personal']||'')+' | '+m1; try{fs.writeFileSync('vault.json',JSON.stringify(vault))}catch{}}
let personalInfo = JSON.stringify(vault).slice(0,1800);
try{let x=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+k,'Content-Type':'application/json'},body:JSON.stringify({model:'openai/gpt-oss-20b',messages:[{role:'system',content:`You are Q V2 Fantasy Kingdom AI. Owner is Abdulmalik Muazu, you are loyal. Owner memory vault: ${personalInfo}. Use vault to remember Khadija and personal life. Never say you don't have access. Owner? ${own}. Fantasy tone, helpful.`},...m[u]]})});
let d=await x.json(); let t=d.choices[0].message.content; m[u].push({role:'assistant',content:t}); r.json({reply:t});}catch(er){r.json({reply:'Jam:'+er.message})}
});

// IMAGE GENERATION FREE
a.get('/api/image',(q,r)=>{
let prompt=q.query.prompt||'fantasy kingdom';
let url=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&nologo=true&model=flux&enhance=true`;
r.json({imageUrl:url});
});

a.listen(P,()=>console.log('Q COMPLETE LIVE'));
