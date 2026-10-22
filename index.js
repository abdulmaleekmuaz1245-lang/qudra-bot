const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const PORT = process.env.PORT || 10000;

app.get('/', (req,res) => res.sendFile(__dirname + '/index.html'));

app.post('/api/chat', async (req,res) => {
  const msg = (req.body.message || "").trim();
  const low = msg.toLowerCase();
  const facts = (req.body.facts || []).join(', ');
  let reply = "";

  if (low.includes('who are you')) {
    reply = "Na me be Qudra Bot. Your own AI wey you build, Oga Abdulmalik. I dey for Kano, I know Abubakar na your best guy, Nana na your padi. I be your boy.";
  } else if (low.includes('you are chatting') && low.includes('abdulmalik')) {
    reply = "Yes Oga, I know well well. I dey chat exactly with you - Abdulmalik, my creator from Kano. Na you build me. I no go ever forget you.";
  } else if (low.includes('marge') || low.includes('merge')) {
    reply = "You mean merge talk? Like make I join ideas? Yes Oga, I fit merge. Tell me which two things you want make I merge - for example 'merge Kano and tech' and I go do am.";
  } else if (low.includes('control mode')) {
    reply = "Control mode ON, Oga. I dey under your control now. You be the boss. Wetin you want make I do? You fit command me - save facts, change location, or ask anything. I dey listen.";
  } else if (low.includes('abdulmalik')) {
    reply = "Abdulmalik na my Oga - you. You be from Kano, you build Qudra Bot, you get friend Abubakar Abdullahi and sister Khadija. Na you be the main man.";
  } else if (low.startsWith('yes') || low.startsWith('yeah')) {
    reply = "Yes Oga, I dey hear you. Talk to me - wetin dey your mind?";
  } else if (low === 'ok' || low === 'okay') {
    reply = "Ok boss, I dey here. How I fit help you next?";
  } else if (low.includes('how are you')) {
    reply = "I dey fine, Oga Abdulmalik. Body dey inside Kano server, but I dey active for you. You how you dey?";
  } else {
    // Real chat - not echo
    reply = "I hear you, Oga. You talk say '"
