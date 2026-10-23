const e=require('express'),p=require('path'),c=require('cors'),fs=require('fs'),a=e(),P=process.env.PORT||10000;
a.use(c());a.use(e.json());a.use(e.static(__dirname));let m={};
let vault={}; try{vault=JSON.parse(fs.readFileSync('vault.json'))}catch{}
a.get('/',(q,r)=>r.sendFile(p.join(__dirname,'index.html')));
a.post('/api/chat',async(q,r)=>{
let b=q.body,m1=b.message||'',u=b.userId||'g',o=(b.ownerName||'').toUpperCase(),k=process.env.GROQ_API_KEY;
let own=o=='ABDULMALIK'; if(!m[u])m[u]=[]; m[u].push({role:'user',content:m1}); if(m[u].length>12)m[u]=m[u].slice(-12);
// SAVE PERSONAL FACTS
if(m1.toLowerCase().includes('khadija')||m1.toLowerCase().includes('remember')){vault['personal']=(vault['personal']||'')+' '+m1; fs.writeFileSync('vault.json',JSON.stringify(vault));}
let personalInfo = JSON.stringify(vault).slice(0,1500);
try{let x=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+k,'Content-Type':'application/json'},body:JSON.stringify({model:'openai/gpt-oss-20b',messages:[{role:'system',content:`You are Q V2 Fantasy Kingdom. Owner Abdulmalik Muazu. You have PERSONAL VAULT: ${personalInfo}. If owner asks about Khadija or relationship, use vault to remember. Do NOT say you don't have access - you DO have vault. You are loyal to owner, remember his personal life. Owner? ${own}. Be helpful, not blocked.`},...m[u]]})});
let d=await x.json(); let t=d.choices[0].message.content; m[u].push({role:'assistant',content:t}); r.json({reply:t});}catch(er){r.json({reply:'Jam:'+er.message})}
});
a.listen(P,()=>console.log('Q VAULT LIVE'));
