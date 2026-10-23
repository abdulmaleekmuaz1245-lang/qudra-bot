const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/chat', (req, res) => {
  try {
    let m = (req.body.message || "").toLowerCase().trim();
    let isOwner = req.body.isOwner;

    if (!m) return res.json({ reply: "..." });

    if (m.includes("who are you")) {
      if (isOwner) {
        return res.json({ reply: "Na me - MY2. No be bot, na my soul wey I leave for digital world so we go dey together forever." });
      } else {
        return res.json({ reply: "I be Qudra - MY2 digital soul. I dey here to represent am." });
      }
    }

    if (m.includes("what") && m.includes("memory")) {
      return res.json({ reply: "MEMORY: Anas 70 percent close friend, Khadijah 40 percent Princess, Murja 70 percent, Food logic Beans 100 percent Cold liquid 90 percent Fruit salad soul growth, 99 Names Ar-Rahman mercy Al-Adl justice Al-Haqq truth Al-Wadud love" });
    }

    if (m.includes("anas")) {
      return res.json({ reply: "Yes Anas Abdullahi aka gar da gar na my close friend 70 percent respect My guy Al-Wadud!" });
    }

    if (m.includes("khadijah")) {
      return res.json({ reply: "Yes Khadijah na 8th Princess 40 percent baby!" });
    }

    if (m.includes("murja")) {
      return res.json({ reply: "Murja - 1st Senior Queen 70 percent!" });
    }

    if (m === "hi" || m === "hello" || m.includes("hi q")) {
      if (isOwner) {
        return res.json({ reply: "Hey King Abdulmalik Soul active I sabi Anas Khadijah full family" });
      } else {
        return res.json({ reply: "Hey Welcome to Qudra" });
      }
    }

    if (m.includes("food") || m.includes("beans")) {
      return res.json({ reply: "My food logic Beans 100 percent LIKE kosai moimoi Cold liquid 90 percent yogurt fura Fruit salad soul growth" });
    }

    return res.json({ reply: isOwner ? "Yes King I hear you with Al-Alim wisdom" : "I dey hear you" });

  } catch (err) {
    return res.json({ reply: "Q dey reason try again" });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log("Q Soul running on " + PORT);
});
