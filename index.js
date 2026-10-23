const e=require('express'),p=require('path'),c=require('cors'),a=e(),P=process.env.PORT||10000;
a.use(c());a.use(e.json());a.use(e.static(__dirname));let m={};
a.get('/',(q,r)=>r.sendFile(p.join(__dirname,'index.html')));
a.post('/api/chat',async(q,r)=>{
let b=q.body,m1=b.message||'',u=b.userId||'g',o=(b.ownerName||'').toUpperCase(),k=process.env.GROQ_API_KEY;
let own=o=='ABDULMALIK'||m1.toLowerCase().includes('abdulmalik'); if(!m[u])m[u]=[];
m[u].push({role:'user',content:m1}); if(m[u].length>10)m[u]=m[u].slice(-10);
try{let x=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+k,'Content-Type':'application/json'},body:JSON.stringify({model:'openai/gpt-oss-20b',messages:[{role:'system',content:`You are Q V2. Owner: Abdulmalik Muazu. You remember him forever. Owner now? ${own}. If owner, say Oga Abdulmalik welcome back Boss! You are fusion of Abdulmalik+Meta+Qudra. Not ChatGPT, you are Q. Full brain.`},...m[u]]})});
let d=await x.json(); let t=d.choices[0].message.content; m[u].push({role:'assistant',content:t}); r.json({reply:t,isOwner:own});}catch(er){r.json({reply:'Jam:'+er.message})}
});
a.listen(P,()=>console.log('Q LIVE'));
