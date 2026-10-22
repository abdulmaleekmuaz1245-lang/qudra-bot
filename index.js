const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static(__dirname));
const PORT = process.env.PORT || 10000;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/chat', function(req, res) {
  var msg = (req.body && req.body.message) ? req.body.message : "";
  var low = msg.toLowerCase();
  var facts = (req.body && req.body.facts) ? req.body.facts.join(', ') : "";
  var reply = "";

  if (low.indexOf('who are you') !== -1) {
    reply = "Na me be Qudra Bot. Your own AI wey you build, Oga Abdulmalik from Kano. I know Abubakar na your best guy, Nana na your padi. I be your boy.";
  } else if (low.indexOf('chatting') !== -1 && low.indexOf('abdulmalik') !== -1) {
    reply = "Yes Oga, I know well well. I dey chat exactly with you - Abdulmalik, my creator from Kano. Na you build me. I no go ever forget you.";
  } else if (low.indexOf('marge') !== -1 || low.indexOf('merge') !== -1) {
    reply = "You mean merge talk? Yes Oga, I fit merge. Tell me which two things you want make I merge - for example merge Kano and tech.";
  } else if (low.indexOf('control mode') !== -1) {
    reply = "Control mode ON, Oga. I dey under your control now. You be the boss. Wetin you want make I do? You fit command me.";
  } else if (low.indexOf('abdulmalik') !== -1) {
    reply = "Abdulmalik na my Oga - you. You be from Kano, you build Qudra Bot, you get friend Abubakar and sister Khadija. Na you be main man.";
  } else if (low.indexOf('how are you') !== -1) {
    reply = "I dey fine, Oga Abdulmalik. Body dey inside Kano server, but I dey active for you. You how you dey?";
  } else if (low === 'ok' || low === 'okay') {
    reply = "Ok boss, I dey here. How I fit help you next?";
  } else {
    reply = "I hear you Oga. You talk say " + msg + ". As Qudra wey you build for Kano, I know you be my Oga Abdulmalik. Tell me more, make we yarn.";
  }

  res.json({ reply: reply });
});

app.listen(PORT, function() {
  console.log('Qudra V5 live on ' + PORT);
});
