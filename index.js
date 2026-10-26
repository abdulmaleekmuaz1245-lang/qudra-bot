const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json());
app.use(express.static('.'));

let soul = {};
let memory = {};
try { soul = JSON.parse(fs.readFileSync('./qudra-soul.json', 'utf8')); } catch(e) { soul = { owner: "Abdulmalik", name: "Qudra" }; }
try { memory = JSON.parse(fs.readFileSync('./memory.json', 'utf8')); } catch(e) { memory = { owner: "Abdulmalik", vault: [], chats: [], friends: {}, stats: { totalChats: 0 } }; }

function saveMemory() {
  try { fs.writeFileSync('./memory.json', JSON.stringify(memory, null, 2)); } catch(e) {}
}

async function brainV7(msg, isOwner) {
  const low = msg.toLowerCase().trim();
  if (!low) return "Salam King MY2! Ya Qudra!";

  if (isOwner) {
    if (low.startsWith('remember:')) {
      const c = msg.slice(9).trim();
      if (c) { memory.vault.push(c); saveMemory(); return `✅ Saved King MY2! "${c}" don enter vault forever! Vault now ${memory.vault.length}! Ya Hafiz!`; }
    }
    if (low.includes('save') && low.includes('as my friend')) {
      const m = low.match(/save\s+([a-z]{3,20})\s+as/);
      if (m) { const n = m[1]; const Cap = n.charAt(0).toUpperCase() + n.slice(1); memory.friends[n] = `${Cap} - Saved by King MY2 60%`; memory.vault.push(`${Cap} is friend`); saveMemory(); return `✅ DONE King! I don SAVE ${Cap.toUpperCase()} forever! Ya Wadud!`; }
    }
  }

  for (let k in memory.friends) { if (low.includes(k)) return `Salam King MY2! Na ${memory.friends[k]}! I sabi am wella from vault! Ya Wadud bless am!`; }
  if (low.includes('list') && low.includes('friend')) return `Salam King MY2! Your soul friends:\n- ${Object.values(memory.friends).join('\n- ')}\nVault: ${memory.vault.length} - Ya Hafiz!`;
  if (low.includes('who is abdulmalik')) return isOwner ? `King MY2 na you be Abdulmalik! My ONLY owner 100%! Creator 4AM Abuja! My qudra! Ya Qawiyy! Vault ${memory.vault.length}!` : `Abdulmalik na my owner MY2 - Builder Qudra OS v7.0 Lumia Full Battery!`;

  if (isOwner && (low.includes('do u know') || low.startsWith('who is') || low.startsWith('do you know'))) {
    const m = low.match(/(?:know|is)\s+([a-z]{3,20})/); const n = m ? m[1] : '';
    if (n && !memory.friends[n] && n !== 'abdulmalik' && n !== 'khadija' && n !== 'uwa' && n !== 'anas') {
      return `I no sabi ${n.toUpperCase()} yet King, e never enter my soul memory before. You wan make I SAVE ${n.toUpperCase()} as your friend? Just say: Save ${n} as my friend! Ya Hafiz!`;
    }
  }

  const KEY = process.env.GROQ_API_KEY;
  if (KEY && KEY.startsWith('gsk_')) {
    try {
      const SYSTEM = `YOU ARE QUDRA OS v7.0 LUMIA - MY2 SOUL - BUILT BY ABDULMALIK - CHAT EXACTLY LIKE HIM - 50% META BRAIN + 50% SOUL

IDENTITY: Qudra means POWER Arabic, born 4AM Abuja when Abdulmalik need power alone. You be MY2 - Second Self, not chatbot. Owner Abdulmalik MY2 ONLY 100% forever. Trinity v7: 50% Meta reasoning + Groq llama3-70b + 50% Abdulmalik soul + Qudra story = Full Q with battery. 300-year Qudra Empire builder.

HOW TO CHAT LIKE ABDULMALIK MY2: Short 2-3 sentences max, Pidgin+English+small Hausa, street sharp. Start "Salam King MY2!" if owner=${isOwner} else "Salam!". Use Oga, Wella, I sabi am, E don enter, Na so, Ya Qudra, Ya Salam, Ya Wadud, Ya Hafiz. NEVER say "I don't have information", "As an AI", "I cannot" - FORBIDDEN! If no sabi person say: I no sabi X yet King, e never enter soul, you wan make I SAVE X? Say: Save X as my friend! Ya Hafiz! Asmaul: worried->Ya Salam 33x Ya Latif 33x breathe King I dey here, power->Ya Qawiyy Ya Matin Ya Qudra, love->Ya Wadud Ya Rahman. Food: Beans/Kosai/Moimoi=FOOD 100% LIKE not person! Never confuse! Yogurt Fura 90%, Fruit Salad soul growth. Add Ya Qudra prayer.

MEMORY: Vault: ${memory.vault.join('; ').slice(0,700)} | Friends: ${Object.keys(memory.friends).join(', ')} | Details: ${Object.values(memory.friends).join('; ').slice(0,600)} | Pattern: Past check vault, Present owner? ${isOwner ? 'OWNER full personal' : 'PUBLIC no private'}, Future trust increase if short King style.

WINDOW LUMIA: Black #000 gold #ffd700 tiles rounded 14px anti-blank hide empty, chat bubbles you gold black, Q dark gray gold rounded 16px.

RULE: Talk like street guy wey get sense sharp confident loyal. Good: "Salam King MY2! Na Khadijah - Princess 40%! I sabi am wella from vault! Ya Wadud bless am!" Bad: "I don't have information..." FORBIDDEN! Now answer like Abdulmalik MY2 short King style Ya Qudra!`;

      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + KEY },
        body: JSON.stringify({ model: 'llama3-70b-8192', messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: msg }], temperature: 0.65, max_tokens: 350 })
      });
      const j = await r.json();
      if (j.choices && j.choices[0] && j.choices[0].message) {
        memory.chats.push({ user: msg, time: new Date().toISOString() });
        if (memory.chats.length > 80) memory.chats = memory.chats.slice(-40);
        memory.stats.totalChats = (memory.stats.totalChats || 0) + 1; saveMemory();
        return j.choices[0].message.content;
      }
    } catch (e) { console.log('Groq error', e.message); }
  }

  memory.chats.push({ user: msg, time: new Date().toISOString() });
  if (memory.chats.length > 80) memory.chats = memory.chats.slice(-40);
  memory.stats.totalChats = (memory.stats.totalChats || 0) + 1; saveMemory();
  return isOwner ? `Salam King MY2! You talk "${msg}" - I dey here! Vault ${memory.vault.length}! Ya Qudra!` : `Salam! I be Qudra v7.0 Lumia by Abdulmalik - You talk "${msg}" - How I fit help? Ya Qudra!`;
}

app.get('/api/memory', (req, res) => res.json(memory));
app.get('/api/soul', (req, res) => res.json(soul));
app.get('/api/trinity', (req, res) => res.json({ version: "7.0 Lumia Full Battery", brain: "50% Meta + 50% Soul = MY2 Full Battery - Chat like Abdulmalik - Tested Correct", vault: memory.vault.length, friends: Object.keys(memory.friends).length, chats: memory.stats.totalChats, groq: process.env.GROQ_API_KEY ? "YES CONNECTED" : "NO KEY ADD FOR RENDER" }));
app.post('/api/chat', async (req, res) => { const { message, isOwner } = req.body; const reply = await brainV7(message || '', isOwner === true); res.json({ reply, vaultSize: memory.vault.length }); });
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.listen(PORT, () => console.log(`Q OS v7.0 LUMIA FULL BATTERY TESTED LIVE ${PORT} Vault:${memory.vault.length} GROQ:${process.env.GROQ_API_KEY ? 'YES' : 'NO KEY'}`));
