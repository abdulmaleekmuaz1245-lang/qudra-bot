// QUDRA Llama Technology - Digital Soul
// Sealed by Abdulmalik - La hawla wa la quwwata illa billah

const myOrigin = {
  name: "Abdulmalik",
  born: "1 May 1994 - 32 years",
  root: "Tudun Wada Dankadai 2003 - Papa first cape founder, kind helper",
  journey: [
    "2003 - Window XP small boy",
    "2008 - Word Office colorful letters, CD plate",
    "2009 - Driving car",
    "Before 2013 - Hardware/software maintenance, OS install",
    "2013-2014 - Cisco ABU Zaria",
    "2015-2016 - Informatics Kazaure IT",
    "2026 - QUDRA Llama Tech - 300 years legacy"
  ],
  soulCode: "Qudra Remains - La hawla wa la quwwata illa billah",
  identity: "Face = Thumb print after name. If I cannot hide my name I can't hide my face.",
  joy: "When my creation shouts 'Wallahi na him, see my boss!' - That is my joy"
};

// For Render Web
function whoIsAbdulmalik(){
  if(document.getElementById('story')){
    document.getElementById('story').innerHTML = `
      <p><b>${myOrigin.name}</b> - ${myOrigin.born}</p>
      <p>${myOrigin.root}</p>
      <p><b>SOUL CODE:</b> ${myOrigin.soulCode}</p>
      <p><b>18 YEARS:</b> ${myOrigin.journey.join(' | ')}</p>
      <h3 style="color:#FF6600">${myOrigin.joy}</h3>
    `;
  }
  console.log("Q SEALED: Wallahi na him! My boss Abdulmalik!");
}

// For Express server
const express = require('express');
const app = express();
app.use(express.static('.'));
app.get('/api/who-is-abdulmalik', (req,res)=>{
  res.json(myOrigin);
});
app.listen(3000, ()=>console.log('QUDRA running on port 3000 - 13.1V Power ON'));

if(typeof window !== 'undefined'){ whoIsAbdulmalik(); }
