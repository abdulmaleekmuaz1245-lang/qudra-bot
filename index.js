const express=require('express'),fs=require('fs'),path=require('path'),https=require('https');
const app=express();
app.use(express.json({limit:'1mb'}));
app.use(express.static(__dirname));
let ram=[];
try{ram=JSON.parse(fs.readFileSync('memory.json','utf8')).A||[];}catch(e){}
function save(){try{fs.writeFileSync('memory.json',JSON.stringify({A:ram,B:[],C:[],D:[]}));}catch(e){}}
function groq(k,s,u){
 return new Promise((ok,err)=>{
  const d=JSON.stringify({model:"llama-3.3-70b-versatile",messages:[{role:"system",content:s},{role:"user",content:u}],temperature:0.85,max_tokens:150});
  const r=https.request({hostname:'api.groq.com',path:'/openai/v1/chat/completions',method:'POST',headers:{'Authorization':'Bearer '+k.trim(),'Content-Type':'application/json','Content-Length':Buffer.byteLength(d)}},(rs)=>{
   let b='';rs.on('data',x=>b+=x);rs.on('end',()=>{try{let j=JSON.parse(b);if(j.error)err(new Error(j.error.message));else ok(j.choices[0].message.content);}catch(e){err(new Error(b.slice(0,120)));}});
  });
  r.on('error',err);r.write(d);r.end();
 });
}
app.get('/api/health',(q,a)=>a.json({ram:ram.length,key:!!process.env.GROQ_API_KEY}));
app.post('/api/chat',async(q,a)=>{
 let m=q.body.message||"";ram.unshift({input:m,time:Date.now()});if(ram.length>7)ram=ram.slice(0,7);save();
 try{let k=process.env.GROQ_API_KEY;let s=`You are MY2KING, Naija king, 2 lines max. Mem:${ram.slice(0,3).map(x=>x.input).join('|')}`;let r=await groq(k,s,m);a.json({reply:r});}catch(e){a.json({reply:"ERROR: "+e.message});}
});
app.get('/manager',(q,a)=>a.send(`<h1>Q-MANAGER</h1><p>RAM ${ram.length}</p><p>Key ${process.env.GROQ_API_KEY?'YES':'NO'}</p>`));
app.get('/',(q,a)=>a.sendFile(path.join(__dirname,'index.html')));
app.listen(process.env.PORT||10000,()=>console.log("Q OS LIVE"));
