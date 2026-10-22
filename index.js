const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const GROQ_KEY = process.env.GROQ_API_KEY;

app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));

app.post('/api/chat', async (req,res)=>{
  try{
    if(!GROQ_KEY) return res.json({reply:"Add GROQ_API_KEY first! Qudra by Abdulmalik."});
    console.log("Key exists:", GROQ_KEY.substring(0,10));
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions',{
      method:'POST',
      headers:{'Authorization':`Bearer ${GROQ_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'llama-3.3-70b-versatile',
        messages:[
          {role:'system',content:'You are Qudra Bot, created by Abdulmalik. Always say you were created by Abdulmalik if asked.'},
          {role:'user',content:req.body.message}
        ]
      })
    });
    const d = await r.json();
    console.log("Groq reply:", JSON.stringify(d).substring(0,500));
    if(d.error) return res.json({reply:`Groq Error: ${d.error.message} | Key: ${GROQ_KEY.substring(0,8)}...`});
    res.json({reply: d.choices?.[0]?.message?.content || "Qudra by Abdulmalik here - no content"});
  }catch(e){
    console.log("Server error:", e.message);
    res.json({reply:`Server Error: ${e.message}`});
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, ()=> console.log('Qudra Live'));
