function qudraBrainLogic(original){
  try{
    const m=original.toLowerCase().trim();
    const low = m;

    // Block greetings from being saved as name
    const badNames = ["good","fine","ok","okay","bad","tired","good and u","good and you","i'm good","im good","how are you","how are u"];
    if(badNames.some(b=>low.includes(b) && low.startsWith("i'm"))){
      return `Alhamdulillah, I dey okay too. You good? That's good. How night dey go?`;
    }

    let learnMatch=original.match(/^([A-Za-z]{2,})\s+is\s+(.+)/i);
    if(learnMatch && !low.startsWith('who is') && !low.startsWith('what is') && original.split(' ').length>=3 && !low.includes('?') && !low.startsWith('do you')){
      const person=learnMatch[1]; const info=learnMatch[2];
      if(person.toLowerCase()!=='who' && person.toLowerCase()!=='what'){
        DB.memory.people[person.toLowerCase()]={name:person, info:info, learned_at:new Date().toLocaleString()};
        DB.memory.facts.push({fact:original, time:new Date().toLocaleString()}); saveDB();
        return `Okay, got it. ${person} is ${info}. I don save am.`;
      }
    }

    // I'm Abdulmalik - ONLY if single name or 2 words max, no "good"
    let imMatch=original.match(/^i'?m\s+([A-Za-z]{2,}(?:\s[A-Za-z]{2,})?)$/i) || original.match(/^i am\s+([A-Za-z]{2,}(?:\s[A-Za-z]{2,})?)$/i);
    if(imMatch){
      const info=imMatch[1].replace(/my name is/i,'').trim();
      const lowerInfo=info.toLowerCase();
      if(info.length>=2 && info.length<25 && !badNames.includes(lowerInfo) && !lowerInfo.includes('good')){
        DB.memory.people['you']={name:'You', info:info, learned_at:new Date().toLocaleString()};
        DB.memory.people[info.toLowerCase()]={name:info, info:'owner builder from Kano', learned_at:new Date().toLocaleString()}; saveDB();
        return `Alhamdulillah, nice to meet you ${info}. I don save am. I go remember you.`;
      }
    }

    if(low.includes('who i') && low.includes('am') || low==='who i i\'m?' || low.includes('who am i') || low.includes('who i am')){
      if(DB.memory.people['you']){
        const p=DB.memory.people['you'];
        return `You be ${p.info}. Na you I sabi - builder of Qudra from Kano.`;
      }else return `You never tell me your name yet. Tell me "I'm Abdulmalik" make I save am.`;
    }

    if(low.includes('u said u remember me')||low.includes('you said you remember me')||low.includes('do you remember me')){
      if(DB.memory.people['you']){
        const p=DB.memory.people['you'];
        return `Yes, I remember you. You be ${p.info}. I save am since ${p.learned_at}. My memory na 2 people now.`;
      }else return `I never save you yet. Tell me your name.`;
    }

    if(low.includes('do you know me')){
      if(DB.memory.people['you']||DB.memory.people['abdulmalik']){
        const p=DB.memory.people['you']||DB.memory.people['abdulmalik'];
        return `Yes, I know you. You be ${p.info||p.name}.`;
      }else return `Not yet. Tell me "I'm Abdulmalik"`;
    }

    if(low.includes('who are you')||low.includes('who r u')) return `Na Qudra I be. AI wey Abdulmalik from Kano build. I get permanent memory.`;
    if(low==='hi'||low==='hello'||low==='hey'||(low.includes('salam')&&low.length<15)) return `Wa alaikum salam. How you dey?`;
    if(low.includes('how are you')||low.includes('how are u')||low.includes('how u dey')||low.includes('i\'m good')||low.includes('im good')||low.includes('good and u')||low.includes('good and you')||low==='ok'||low==='okay') return `Alhamdulillah, I dey okay. You say you good? How your night dey go for this 4:24am?`;
    if(low.includes('thank')) return `No wahala. Alhamdulillah.`;

    return `Okay - "${original}". Make we gist.`;
  }catch(e){ return `Small glitch: ${e.message}`; }
}
