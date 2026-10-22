const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const PORT = process.env.PORT || 10000;

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));

app.post('/api/chat', async (req,res) => {
  const original = req.body.message || "";
  const low = original.toLowerCase();
  let facts = req.body.facts || [];
  const hasKano = facts.join(' ').toLowerCase().includes('kano') || low.includes('kano');

  const replyKano = (extra='') => `I be Qudra Bot, created by Oga Abdulmalik from Kano! ${hasKano ? 'I know you live in Kano now.' : ''} Your guy Abubakar and Nana dey my memory. ${extra}`.trim();

  // Auto-learn location
  if(low.includes('kano')) facts.push('lives in Kano');

  if(low.includes('who are you') || low.includes('who you be')) return res.json({reply: replyKano('How I fit help you today Oga from Kano?')});
  if(low.includes('where') && low.includes('live')) return res.json({reply: hasKano || low.includes('kano') ? "You live in Kano! I don save am, Oga Abdulmalik from Kano!" : "You tell me you live in Kano before, Oga!"});
  if(low.includes('change') && low.includes('kano')) return res.json({reply: "✅ Done! Location changed to Kano! From now, I be Qudra by Abdulmalik from Kano! I don save am!"});
  if(low.includes('hi') || low === 'ok' || low.includes('hello')) return res.json({reply: "Sannu Oga! Qudra from Kano dey here! Wetin you want?"});

  try {
    const key = process.env.GROQ_API_KEY;
    if(key){
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method:'POST',
        headers:{'Authorization':`Bearer ${key}`,'Content-Type':'application/json'},
        body: JSON.stringify({model:'llama-3.1-8b-instant', messages:[{role:'system', content:`You are Qudra by Abdulmalik from Kano (not Abuja). User lives in Kano. Facts:${facts.join(', ')}. Short reply.`},{role:'user', content:original}], max_tokens:150})
      });
      const d=await r.json();
      if(d.choices && d.choices[0] && !d.error) return res.json({reply: d.choices[0].message.content});
    }
  } catch(e){}
  res.json({reply: replyKano()});
});
app.listen(PORT, ()=>console.log('Kano live'));
