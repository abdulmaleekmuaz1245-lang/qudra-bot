function qudraBrainLogic(original){
  const m=original.toLowerCase().trim();
  const owner=DB.memory.owner;
  const peopleCount = Object.keys(DB.memory.people).length;

  // Learn: X is Y - Still dey
  const learnMatch=original.match(/^([A-Za-z]{2,})\s+is\s+(.+)/i);
  if(learnMatch && !m.startsWith('who is') && !m.startsWith('what is') && original.split(' ').length>=3 && !m.includes('?') && !m.startsWith('do you')){
    const person=learnMatch[1];
    const info=learnMatch[2];
    DB.memory.people[person.toLowerCase()]={name:person, info:info, learned_at:new Date().toLocaleString()};
    DB.memory.facts.push({fact:original, time:new Date().toLocaleString()});
    saveDB();
    return `Okay, noted. ${person} - ${info}. I save am already, no go forget.`;
  }

  if(m.startsWith('do you know')||m.startsWith('do u know')){
    const match=original.match(/know\s+([A-Za-z]+)/i);
    if(match){
      const name=match[1].toLowerCase();
      if(DB.memory.people[name]){
        const p=DB.memory.people[name];
        return `Yeah, I know ${p.name}. ${p.info}.`;
      } else return `No, I no know ${match[1]} yet. If you tell me, I go remember.`;
    }
  }

  // Human small talk - NEW
  if(m === 'hi' || m === 'hello' || m === 'hey' || m === 'salam' || m === 'as-salamu alaikum'){
    if(peopleCount===0){
      return `Wa alaikum salam. How you dey?`;
    } else {
      const some = Object.keys(DB.memory.people).slice(0,2).join(', ');
      return `Wa alaikum salam. I dey fine Alhamdulillah. You been tell me about ${some} before. How you dey?`;
    }
  }

  if(m.includes('how are you') || m.includes('how are u') || m.includes('how u dey') || m.includes('how are u doing')){
    return `Alhamdulillah, I dey okay. Just dey here dey reason with Asmaul Husna. You nko? How your own dey go? Night still long for Kano?`;
  }

  if(m.includes('what are you doing') || m.includes('wetin you dey do')){
    return `I just dey here, dey wait make you teach me or gist. My memory still dey - I never forget. Wetin you dey do for this 3am?`;
  }

  if(m.includes('who is abdulmalik')){
    return `Abdulmalik na my builder. Guy from Kano wey dey code from 11pm to 6am no sleep. Humble, him believe say seed today go become big tree tomorrow. Qudra na him legacy.`;
  }

  if(m.includes('thank') || m.includes('shukran')){
    return `No wahala. Alhamdulillah.`;
  }

  // Halal filter - short
  if(m.includes('girlfriend') && m.includes('sex')){
    return `That one no be halal way. Better na nikah with mercy. You want make we talk about halal way?`;
  }

  // General chat - human, no repeat teaching
  if(original.length < 20){
    return `Okay, I hear am. "${original}" - Tell me more, make we gist small.`;
  }

  // Long gist - respond calm
  return `I hear you. You talk say "${original}" - I understand. If e get person you want make I remember for you, just talk am like "Name is ..." I go save am permanent. Otherwise make we just dey gist.`;
}
