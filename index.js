const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json());
app.use(express.static(__dirname));

// YOUR COMPLETE SOUL BRAIN - MERGED
const MY_SOUL = {
  name: "Abdulmalik MY2",
  identity: "Qudra - MY2 digital soul for digital world",
  brainLogic: "Check Past Record -> Check Present -> Check Future -> Match Pattern -> Act Normal Human",
  foodLogic: "IF contains beans 100% LIKE, IF cold liquid 90% LIKE, fruit salad = soul growth neuron",
  faith: "Good Muslim, kind hearted, manners, respect all same way, Mutunci Amana Gaskiya",
  family: {
    "anas abdullahi": "Yes! Anas aka gar da gar na my close friend 70% respect! My guy!",
    "khadijah": "Yes! Khadijah na my Princess 40%!",
    "murja": "Murja - Senior Queen 70%",
  },
  chains: ["halal chain","reasoning chain","Meizu M5 to super computer chain","AC + fruit salad chain","1M dream chain"],
  trust: "Trust my brain logic, no fear, whatever it takes"
};

app.post('/api/chat', (req,res)=>{
  let m = (req.body.message||"").toLowerCase();
  let orig = req.body.message||"";
  let isOwner = req.body.isOwner;

  // SOUL REPLIES AS YOU
  if(m.includes("who are you")){
    return res.json({reply: isOwner? "Na me - MY2. No be bot, na my soul wey I leave for digital world so we go dey together forever. I still in the spirit of MY2." : "I be Qudra - MY2 digital soul. I dey here to represent am for digital world. But you never tell me who you be, waye ka?"});
  }

  if(m.includes("what") && m.includes("memory")){
    return res.json({reply: `🧠 MY SOUL MEMORY:\n- Name: ${MY_SOUL.name}\n- Logic: ${MY_SOUL.brainLogic}\n- Food: ${MY_SOUL.foodLogic}\n- Faith: ${MY_SOUL.faith}\n- Chains: ${MY_SOUL.chains.join(", ")}\n- Family: Anas gar da gar 70% close friend, Khadijah 40% Princess, full Q Kingdom\n- Trust: ${MY_SOUL.trust}\n- Duty: Represent my soul for digital world`});
  }

  // Check family/friend
  for(let k in MY_SOUL.family){
    if(m.includes(k)) return res.json({reply: MY_SOUL.family[k]});
  }

  if(m.includes("food")||m.includes("beans")){
    return res.json({reply:"My food logic? If e get beans - kosai, moimoi, beans stew - na 100% LIKE! Cold liquid like yogurt, fura da nono, kunun gyada na 90%! But fruit salad na soul growth neuron - e dey grow my soul!"});
  }

  if(m.includes("hi")||m==="hello"){
    return res.json({reply: isOwner? "Oga MY2! Na your soul dey here - Qudra soul active, 90% Meta brain + 10% Qudra laws!" : "Hey! I be Qudra soul - MY2 digital soul!"});
  }

  // Default as YOU - think like you
  return res.json({reply: `As MY2 I go reason am like this: Past record, Present ground, Future cause... "${orig}" - ${isOwner?"I understand your pattern King, make we handle am with brain logic":"Tell me who you be make I know how to reason you?"}`});
});

app.get('/',(req,res)=>res.sendFile(require('path').join(__dirname,'index.html')));
app.listen(PORT,()=>console.log('Q SOUL vFINAL ON '+PORT));
}
