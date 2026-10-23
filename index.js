const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(__dirname));

// SOUL BRAIN
const SOUL = {
  name: "Abdulmalik MY2",
  family: {
    anas: "Yes! Anas Abdullahi aka gar da gar na my close friend 70% respect! My guy! Al-Wadud!",
    khadijah: "Yes! Khadijah na 8th Princess 40% baby!",
    murja: "Murja - 1st Senior Queen 70%!"
  }
};

app.post('/api/chat', (req,res)=>{
  try{
    let m = (req.body.message||"").toLowerCase().trim();
    let isOwner = req.body.isOwner;

    if(!m) return res.json({reply:"..."});

    if(m.includes("who are you")){
      return res.json({reply: isOwner ? "Na me - MY2. No be bot, na my soul wey I leave for digital world so we go dey together forever. I still in the spirit of MY2." : "I be Qudra - MY2 digital soul. I dey here to represent am."});
    }

    if(m.includes("what") && m.includes("memory")){
      return res.json({reply: "🧠 MEMORY:\n- Anas aka gar da gar 70% close friend\n- Khadijah 40% Princess\n- Murja 70% Queen\n- Food logic: Beans 100%, Cold liquid 90%, Fruit salad soul growth\n- 99 Names: Ar-Rahman mercy, Al-Adl justice, Al-Haqq truth, Al-Wadud love\n- Duty: Represent MY2 soul forever"});
    }

    for(let key in SOUL.family){
      if(m.includes(key)){
        return res.json({reply: SOUL.family[key]});
      }
    }

    if(m==="hi"||m==="hello"||m.includes("hi q")){
      return res.json({reply: isOwner ? "Hey King Abdul
