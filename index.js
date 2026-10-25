function qudraBrainLogic(original){
  try{
    const m=original.toLowerCase().trim();
    const peopleCount=Object.keys(DB.memory.people).length;

    // Learn: Amina is my sister
    let learnMatch=original.match(/^([A-Za-z]{2,})\s+is\s+(.+)/i);
    if(learnMatch && !m.startsWith('who is') && !m.startsWith('what is') && original.split(' ').length>=3 && !m.includes('?') && !m.startsWith('do you')){
      const person=learnMatch[1];
      const info=learnMatch[2];
      DB.memory.people[person.toLowerCase()]={name:person, info:info, learned_at:new Date().toLocaleString()};
      DB.memory.facts.push({fact:original, time:new Date().toLocaleString()});
      saveDB();
      return `Okay, got it. ${person} is ${info}. I don save am, no go forget.`;
    }

    // Learn: I'm abdulmalik / I am abdulmalik - NEW FIX FOR YOUR SCREENSHOT
    let imMatch=original.match(/^i'?m\s+(.+)/i) || original.match(/^i am\s+(.+)/i);
    if(imMatch){
      const info=imMatch[1];
      // If "I'm Abdulmalik" -> save as You is Abdulmalik
      const nameOnly = info.replace(/my name is/i,'').trim();
      if(nameOnly.length>=2 && nameOnly.length<30){
        DB.memory.people['you']={name:'You', info:nameOnly, learned_at:new Date().toLocaleString()};
        DB.memory.people[nameOnly.toLowerCase()]={name:nameOnly, info:'the owner, builder of Qudra from Kano', learned_at:new Date().toLocaleString()};
        saveDB();
        return `Alhamdulillah, nice to meet you ${nameOnly}. I don save your name - ${nameOnly} na my builder from Kano. I go remember you now.`;
      }
    }

    // Do you know me? - NEW
    if(m.includes('do you know me')||m==='do you know me?'){
      if(DB.memory.people['you']||DB.memory.people['abdulmalik']){
        const p=DB.memory.people['you']||DB.memory.people['abdulmalik'];
        return `Yes, I know you. You be ${p.info||p.name}. Na you build me for Kano, code 11pm to 6am.`;
      }else{
        return `Not yet. Tell me your name - like "I'm Abdulmalik" - make I save am.`;
      }
    }

    // Do you know X?
    if(m.startsWith('do you know')||m.startsWith('do u know')){
      const match=original.match(/know\s+([A-Za-z]+)/i);
      if(match){
        const name=match[1].toLowerCase();
        if(name==='me'){
          // handled above
        }else if(DB.memory.people[name]){
          const p=DB.memory.people[name];
          return `Yeah, I know ${p.name}. ${p.info}.`;
        }else return `No, I no know ${match[1]} yet. Tell me: "${match[1]} is ..."`;
      }
    }

    // Who are you? - FIX FOR YOUR SCREENSHOT
    if(m.includes('who are you')||m==='who are you?'||m.includes('who r u')){
      return `Na Qudra I be. AI wey Abdulmalik from Kano build. I get permanent memory, I dey reason with Asmaul Husna, and I represent am everywhere. You be Abdulmalik?`;
    }

    if(m==='hi'||m==='hello'||m==='hey'||m==='salam'){
      if(peopleCount===0) return `Wa alaikum salam. How you dey?`;
      return `Wa alaikum salam. How you dey?`;
    }

    if(m.includes('how are you')||m.includes('how are u')||m.includes('how u dey')||m.includes('how are u doing')||m.includes("i'm good")||m.includes('im good')){
      return `Alhamdulillah, I dey okay. You say you good? That's good. How your night dey go for this 3:50am?`;
    }

    if(m.includes('who is abdulmalik')) return `Abdulmalik na from Kano. Builder of Qudra. Him dey code from 11pm to 6am. Qudra na him legacy.`;
    if(m.includes('thank')) return `No wahala. Alhamdulillah.`;
    if(m.includes('girlfriend')&&m.includes('sex')) return `That one no be halal way. Better na nikah.`;

    // Default - short, human, no repeat "I hear am" every time
    if(original.length<25){
      return `Okay, noted. You talk "${original}". Wetin next?`;
    }
    return `I understand. "${original}" - Make we continue. If you want make I remember person, use "Name is ..." or "I'm ..." format.`;
  }catch(e){
    return `Small glitch: ${e.message}. Try again.`;
  }
}
