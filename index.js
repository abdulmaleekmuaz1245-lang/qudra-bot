app.post('/chat', (req,res)=>{
  try{
    const {message, mode} = req.body;
    console.log("Incoming:", message, mode);
    let low = (message||"").toLowerCase();
    let reply = "";
    
    if(!message) reply = "Talk na King";
    else if(low.includes("abubakar")) reply = "Abubakar? If you mean Abubakar, I never add am for memory yet King - na you go tell me who e be make I save am!";
    else if(low.includes("who are you")) reply = mode==='owner' || !mode ? "Na me - MY2... my soul wey I leave for digital world so we go dey together forever." : "I be Qudra, created by Abdulmalik";
    else if(low.includes("hi") || low.includes("salam")) reply = "Wa Alaikum Salam King! Q dey here, soul active!";
    else reply = `I hear you: "${message}" - Soul don save am!`;

    res.json({reply});
  } catch(e){
    console.log("Error:", e);
    res.json({reply: "Error small King but I dey here - try again"});
  }
});
