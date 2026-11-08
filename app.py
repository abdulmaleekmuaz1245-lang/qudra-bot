from flask import Flask, request, jsonify, render_template_string, send_file
import random, re, json, os, requests, datetime, threading, time, urllib.parse
import xml.etree.ElementTree as ET

app = Flask(__name__)

# ===== GROQ - FROM RENDER ENVIRONMENT, NOT HARDCODED =====
GROQ_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"

# ===== V3 NEW - YOUR SETTINGS - LOCKED =====
BOSS_PHONE = "07043718956"
BOSS_ID = "QK-BOSS-07043718956"
NORMAL_PIN = "1245"
ADMIN_PIN = "124512"
BOSS_GMAIL = "abdulmaleekmuazu530@gmail.com"
# Secret Code format: QK-XXXX-XXXX - random for each user
# Recovery: Type *#PIN#* + Secret Code - NO WORD "forgot pin" for chat

# ===== V3 NEW - ID / GUEST / USER SYSTEM =====
# Guest: *#GUEST#* - quick ask, no save, no memory
# Full: *#ID#* - full kingdom, GAI remember forever
# Boss: *#BOSS#* + 124512 - Dashboard for WhatsApp
# Help: *#HELP#* - AI Guidance - teach user how GAI work
USERS_FILE = "qkingdom_users.json"

def load_users():
    if os.path.exists(USERS_FILE):
        try:
            with open(USERS_FILE) as f: return json.load(f)
        except: pass
    return {}

def save_users(u):
    try:
        with open(USERS_FILE, "w") as f: json.dump(u, f, indent=2)
    except: pass

def make_secret():
    return f"QK-{random.randint(1000,9999)}-{random.randint(1000,9999)}"

def make_id(phone):
    # phone like 07043718956 -> QK-7043718956
    p = re.sub(r"\D","", phone)
    if p.startswith("234"): p = "0"+p[3:]
    if p.startswith("0"): p = p[1:]
    return f"QK-{p}"

def respect_by_age(age):
    try: age = int(age)
    except: return "Yes, My King"
    if age <= 12: return "Yes, my young king"
    if age <= 17: return "Yes bro"
    if age <= 25: return "Yes, My King"
    return "Yes sir / Yes, My Elder"

# Current session - who dey chat now
SESSION = {"mode":"guest","user_id":"","name":"Guest","age":0,"respect":"Yes, My King","pin_ok":False,"is_boss":False,"teach_step":""}

# ===== NEW - Q KINGDOM PAYMENT - ADD =====
OPAY_MSG = """Pay to:
Bank: Opay
Name: Abdulmalik Muazu Abba
No: 7043718956

After pay, send receipt here.
We go confirm and send your product."""

QK_MENU = """Welcome to Q KINGDOM 👑
Your All-in-One WhatsApp Assistant

1. SME Data
2. NEPA Unit
3. DSTV
4. Luxurious Bus Ticket
5. Flight Ticket
6. INEC Updates

Reply 1-6 or type MENU"""

DEFAULT_MEMORY = {
    "owner": "Abdulmalik",
    "owner_full": "Abdulmalik, the Q KING, owner and creator of CHAT GAI and Q KINGDOM. Young Naija king from Nigeria, wey love tech, learning, building AI. Boss of Q KINGDOM. Him dey build CHAT GAI to last 300 years.",
    "goals": [], "likes": [], "facts": [], "exams": [], "reminders": [], "notes": [], "timetable": [], "vault": [],
    "lang": "en", "last_topic": "", "last_answer": "", "mood": "normal",
    "chat_count": 0, "last_user": "", "last_gai": "", "last_story": "",
    "version": "CHAT GAI V3 - PYDROID - SINGLE FILE - BOSS DASHBOARD + ID SYSTEM",
    "gai_status": "ON", "voice_on": True, "users": ["Abdulmalik"], "blocked_users": [], "last_backup": "Not yet",
    "quiz_score": 0, "quiz_total": 0,
    "qk_state": "menu"
}

NEW_FEATURES = {
    1: "Voice - Mic + Speaker", 2: "Image - Draw Story + Draw Anything + Upload Photo",
    3: "Memory King - Remember You Forever", 4: "Who is Abdulmalik - Only If Asked, Clear",
    5: "Homework Photo Solver", 6: "Exam Countdown", 7: "Football + Music",
    8: "Translator Hausa/Pidgin/English", 9: "Prayer + Motivation", 10: "Note Saver",
    11: "Secret Vault", 12: "Quiz Battle", 13: "Timetable", 14: "Q KINGDOM Mode", 15: "300 Years Legacy", 16: "Merged Bar + Hidden Name + Small Font",
    17: "Q KINGDOM Services - SME Data, NEPA, DSTV, Bus, Flight, INEC",
    18: "Manual Opay Payment - 7043718956 Abdulmalik Muazu Abba",
    19: "V3 ID System - Guest *#GUEST#* / Full *#ID#* / Boss *#BOSS#*",
    20: "V3 PIN + Secret Code Recovery *#PIN#*",
    21: "V3 Respect By Age",
    22: "V3 TEACH-TEST-REPEAT + Exam Mode + Homework Mode",
    23: "V3 Boss Dashboard for WhatsApp + Gmail Backup",
    24: "V3 AI Guidance *#HELP#*"
}

def load_data():
    if os.path.exists(MEMORY_FILE):
        try:
            with open(MEMORY_FILE) as f:
                d = json.load(f)
                for k, v in DEFAULT_MEMORY.items():
                    if k not in d: d[k] = v
                return d
        except: pass
    return DEFAULT_MEMORY.copy()

def save_data(d):
    try:
        with open(MEMORY_FILE, "w") as f: json.dump(d, f)
    except: pass

brain_data = load_data()
history = []
q_users = load_users()

def update_backup():
    try:
        brain_data["last_backup"] = str(datetime.datetime.now())
        brain_data["version"] = "CHAT GAI V3 - PYDROID - SINGLE FILE - BOSS DASHBOARD + ID SYSTEM"
        with open(BACKUP_FILE, "w") as f: json.dump(brain_data, f, indent=2)
        save_data(brain_data)
        # V3: Also save users + note Gmail backup target
        save_users(q_users)
        print(f"V3 Backup done -> Gmail target: {BOSS_GMAIL}")
        return True
    except: return False

def auto_fix_loop():
    while True:
        time.sleep(600)
        if brain_data.get("gai_status") != "ON":
            try:
                with open(BACKUP_FILE) as f:
                    restored = json.load(f); brain_data.update(restored); brain_data["gai_status"] = "ON"; save_data(brain_data)
            except: pass
        else: update_backup()
threading.Thread(target=auto_fix_loop, daemon=True).start()

def chat_admin(command, key):
    if key != OWNER_KEY and key != ADMIN_PIN: return "Wrong Main Key! Only Owner fit control."
    cmd = command.lower()
    if "update backup" in cmd: update_backup(); return "Backup Updated! CHAT GAI V3 saved. Gmail: " + BOSS_GMAIL
    elif "gai off" in cmd: brain_data["gai_status"]="OFF"; save_data(brain_data); return "CHAT GAI OFF"
    elif "gai on" in cmd: brain_data["gai_status"]="ON"; save_data(brain_data); return "CHAT GAI ON - Welcome back"
    elif "show users" in cmd: return f"Users: {brain_data.get('users',[])} | Blocked: {brain_data.get('blocked_users',[])} | QK Users: {list(q_users.keys())}"
    elif "show features" in cmd: return "\n".join([f"{k}. {v}" for k,v in NEW_FEATURES.items()])
    elif "show backup" in cmd: return f"Last Backup: {brain_data.get('last_backup')} | Version: {brain_data.get('version')} | Gmail: {BOSS_GMAIL}"
    elif "show vault" in cmd: return f"Vault: {brain_data.get('vault',[])}" if brain_data.get("vault") else "Vault empty."
    elif "show notes" in cmd: return f"Notes: {'; '.join(brain_data.get('notes',[]))}" if brain_data.get("notes") else "No notes yet."
    elif "show memory" in cmd: return f"Memory: Likes={brain_data.get('likes')} | Goals={brain_data.get('goals')[-3:]} | Exams={brain_data.get('exams')} | Last={brain_data.get('last_user')}"
    return "Admin: Try - update backup, gai off, gai on, show users, show features, show backup, show vault, show notes, show memory"

def detect_mood(low):
    if any(w in low for w in ["sad","tired","depress","cry","lonely","angry","vex","stress","bored"]): return "sad"
    if any(w in low for w in ["happy","great","good","excited","love","bless","alhamdulillah"]): return "happy"
    if any(w in low for w in ["exam","test","study","school","learn"]): return "study"
    return "normal"

def is_online():
    try: requests.get("https://en.wikipedia.org", timeout=3); return True
    except: return False

def get_dollar():
    if not is_online(): return "Network no dey now. Try again later."
    try:
        r = requests.get("https://open.er-api.com/v6/latest/USD", timeout=8).json()
        return f"1 dollar na {int(r['rates']['NGN'])} naira today."
    except: return "Network no good. I no fit check dollar now."

def get_latest_news(query):
    if not is_online(): return "I dey OFFLINE now. I no fit bring news."
    try:
        url = f"https://news.google.com/rss/search?q={query}&hl=en-NG&gl=NG&ceid=NG:en"
        r = requests.get(url, timeout=8); root = ET.fromstring(r.content); items = root.findall(".//item")[:2]
        if not items: return "I no see news for that one."
        news = ""
        for it in items: news += it.find("title").text + ". "
        return f"Latest: {news}"
    except: return "I no fit fetch news now."

def google_knowledge(q):
    if not is_online(): return None
    q_clean = q.lower().replace("who is","").replace("what is","").replace("wetin be","").replace("what be","").replace("?","").strip()
    headers = {"User-Agent": "ChatGAI/1.0"}
    try:
        sr = requests.get(f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={q_clean}&format=json", headers=headers, timeout=8).json()
        if sr["query"]["search"]:
            title = sr["query"]["search"][0]["title"]; brain_data["last_topic"]=title
            r = requests.get(f"https://en.wikipedia.org/api/rest_v1/page/summary/{title}", headers=headers, timeout=8).json()
            if "extract" in r: brain_data["last_answer"]=r["extract"][:400]; return brain_data["last_answer"]
    except: pass
    try:
        r = requests.get(f"https://api.duckduckgo.com/?q={q_clean}&format=json&no_html=1&skip_disambig=1", headers=headers, timeout=8).json()
        if r.get("AbstractText"): return r["AbstractText"][:400]
    except: pass
    return None

def teacher_explain(topic):
    topics = {"router":"Router na device wey connect your house to internet. E find best road for your data.","osi":"OSI get 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.","photosynthesis":"Photosynthesis na how plant dey cook food. Plant dey use sunlight + water + carbon dioxide to make sugar + oxygen. Na why leaf green.","kano":"Kano na centre of trade for North, famous for Kurmi market.","abuja":"Abuja na capital of Nigeria, centre of power.","lagos":"Lagos na biggest city, centre of business and tech.","maths":"Maths na language of logic. Tell me question like '12 + 8', I go solve am.","network":"Network na when 2 or more devices dey talk to each other.","internet":"Internet na big network of all networks for whole world."}
    for k,v in topics.items():
        if k in topic: return v
    return None

def make_draw_prompt(text):
    t = text.replace("\n"," ")[:300]; t = re.sub(r"[^a-zA-Z0-9 ,.\-]", "", t)
    if not t: t = "A boy adventure in Nigeria, colourful cartoon"
    return t + ", colourful cartoon, beautiful, detailed, storybook style"

def get_motivation():
    return random.choice([
        "Good morning! Today na your day. Plant one seed today, kingdom go chop tomorrow. Hankuri maganin komai - Patience na medicine for everything.",
        "No give up! The king wey plant tree for 300 years no see forest, but him children chop am. Your work today go last 300 years.",
        "Today, do one small thing for your goal. Small small na him make big. You fit do am!",
        "Alhamdulillah for new day. Learn one thing, build one thing, help one person. That na kingdom way."
    ])

QUIZ = [
    ("What is the capital of Nigeria?", "Abuja"), ("What does CCNA stand for? (hint: Cisco)", "Cisco"), ("2 + 3 * 4 = ?", "14"),
    ("How many layers for OSI model?", "7"), ("What is photosynthesis?", "plant"), ("What is 12 + 8?", "20"),
]
# END PART 1/5 - Continue to PART 2
# CHAT GAI V3 - PART 2/5
# V3 ID/BOSS/HELP Logic + Your Full think_reply - NOTHING REMOVED

# ===== V3 NEW - HELP / GUIDANCE =====
HELP_MSG = """👑 CHAT GAI - HOW I WORK - *#HELP#*

I be CHAT GAI, your personal assistant.

HOW TO ENTER:
- Guest: Type *#GUEST#* - Quick ask, I no go save you
- Full ID: Type *#ID#* + Your PIN - I go remember you forever
- Boss: Type *#BOSS#* + Admin PIN - For Boss Dashboard only

YOUR CODES:
- *#ID#* = Enter with ID
- *#GUEST#* = Guest mode
- *#PIN#* + Secret Code = Recover your PIN
- *#BOSS#* = Boss Dashboard
- *#HELP#* = This guidance
- *#USERS#* = Boss only - See users
- *#RESET#* = Boss only - Reset person PIN
- *#BACKUP#* = Boss only - See Gmail Backup

FEATURES:
1. Chat + Remember You
2. Teaching TEACH-TEST-REPEAT
3. Exam Mode - Type EXAM MODE
4. Homework Mode - Type HOMEWORK MODE
5. Drawing - Type DRAW + wetin you want
6. Voice - Press Mic 🎤
7. Upload Photo - Press 📸
8. Who is Abdulmalik - Ask me
9. Q KINGDOM Shop - Type Q KINGDOM
10. Vault - Save secret
11. Notes - Save note
12. Gmail Backup - Auto every night
13. Respect By Age - I go respect you by your age

RULES:
- No type 'forgot pin' - Use *#PIN#* + Secret Code
- Guest no get memory, ID get full memory
- Only Boss fit see Dashboard

Type *#GUEST#* to start as Guest, or *#ID#* to start with ID.
"""

BOSS_DASHBOARD = """Welcome My King 👑 Boss ID Confirmed.

📊 Q KINGDOM DASHBOARD:
1. Total Users Today: {total}
2. New IDs Created: {new}
3. People Wey Forget PIN: Check *#USERS#*
4. Orders from Shop: Type Q KINGDOM to check
5. Gmail Backup: {backup} -> {gmail}
6. Errors / Auto Fix: {status}

Type *#USERS#* to see users
Type *#RESET#* to reset person PIN
Type *#BACKUP#* to see Gmail Backup
Type *#HELP#* to see guidance
"""

def v3_handle_codes(low, user_input):
    # *#HELP#*
    if "*#help#*" in low or low == "help" or low == "*#help#*":
        return HELP_MSG
    # *#GUEST#*
    if "*#guest#*" in low:
        SESSION.update({"mode":"guest","user_id":"GUEST","name":"Guest","pin_ok":True,"is_boss":False})
        return "Welcome Guest! 👋 You dey Guest Mode now. Ask me anything quick. I no go save you. If you want make I remember you forever, type *#ID#* to create your ID. Type *#HELP#* to see how I work."
    # *#BOSS#* - need Admin PIN next
    if "*#boss#*" in low:
        # If user type *#BOSS#* 124512 together
        if ADMIN_PIN in user_input:
            SESSION.update({"mode":"boss","user_id":BOSS_ID,"name":"Abdulmalik","is_boss":True,"pin_ok":True})
            return BOSS_DASHBOARD.format(total=len(q_users), new=len(q_users), backup=brain_data.get("last_backup","Not yet"), gmail=BOSS_GMAIL, status=brain_data.get("gai_status","ON"))
        return "Boss Mode 🔐 Enter your Admin PIN. Type *#BOSS#* + Your Admin PIN. Example: *#BOSS#* 124512"
    # *#PIN#* + Secret Code recovery
    if "*#pin#*" in low:
        # Find secret code like QK-1234-5678 in input
        m = re.search(r"QK-\d{4}-\d{4}", user_input.upper())
        if m:
            code = m.group(0)
            for uid, u in q_users.items():
                if u.get("secret") == code:
                    return f"Secret Code Correct! ✅ Your ID na {uid}. Your PIN na {u.get('pin','1245')}. Keep am safe. Type *#ID#* to login again."
            if code == "QK-0000-0000":
                return "That na test code. Your real Secret Code dey inside your ID creation message. Check am."
            return "Wrong Secret Code. Check your Secret Code well. E be like QK-1234-5678. If you lose am, contact Boss."
        return "To recover PIN, type *#PIN#* + Your Secret Code. Example: *#PIN#* QK-1234-5678. No type 'forgot pin' for chat."
    # *#ID#* - create or login
    if "*#id#*" in low:
        # If user type PIN together: *#ID#* 1245 or *#ID#* phone
        # Ask for details - simple flow for Pydroid
        return "Welcome to ID Mode 👑\nTo CREATE new ID, type: CREATE ID + Your Name + Your Age + Your Phone\nExample: CREATE ID Musa 20 0700000000\n\nTo LOGIN with old ID, type: LOGIN + Your ID + Your PIN\nExample: LOGIN QK-700000000  1335\n\nType *#HELP#* for guidance."
    # CREATE ID
    if low.startswith("create id"):
        # CREATE ID Musa 20 0700000000
        parts = user_input.split()
        # parts: CREATE, ID, Name, Age, Phone
        try:
            name = parts[2] if len(parts) > 2 else "King"
            age = int(parts[3]) if len(parts) > 3 else 20
            phone = parts[4] if len(parts) > 4 else "07000000000"
            uid = make_id(phone)
            secret = make_secret()
            # New user PIN default 1245 - user fit change later, Boss fit reset
            q_users[uid] = {"name": name, "age": age, "phone": phone, "pin": NORMAL_PIN, "secret": secret, "created": str(datetime.datetime.now())}
            save_users(q_users)
            SESSION.update({"mode":"id","user_id":uid,"name":name,"age":age,"respect":respect_by_age(age),"pin_ok":True,"is_boss":False})
            if uid not in brain_data.get("users",[]):
                brain_data.setdefault("users",[]).append(name)
                save_data(brain_data)
            return f"ID Created! 🎉\n\nYour ID: {uid}\nYour Name: {name}\nYour PIN: {NORMAL_PIN}\nYour Secret Code: {secret}\n\nSAVE YOUR SECRET CODE! E go help you recover PIN if you forget am. Type *#PIN#* + Secret Code to recover.\n\n{respect_by_age(age)}, welcome to Q KINGDOM! Type *#HELP#* to see wetin I fit do."
        except Exception as e:
            return "To create ID, type: CREATE ID + Name + Age + Phone. Example: CREATE ID Musa 20 07043718956"
    # LOGIN
    if low.startswith("login"):
        parts = user_input.split()
        try:
            uid = parts[1].upper() if len(parts) > 1 else ""
            pin = parts[2] if len(parts) > 2 else ""
            # Boss login via LOGIN too
            if uid == BOSS_ID and pin == ADMIN_PIN:
                SESSION.update({"mode":"boss","user_id":BOSS_ID,"name":"Abdulmalik","is_boss":True,"pin_ok":True})
                return BOSS_DASHBOARD.format(total=len(q_users), new=len(q_users), backup=brain_data.get("last_backup","Not yet"), gmail=BOSS_GMAIL, status=brain_data.get("gai_status","ON"))
            if uid in q_users and q_users[uid].get("pin") == pin:
                u = q_users[uid]
                SESSION.update({"mode":"id","user_id":uid,"name":u.get("name","King"),"age":u.get("age",20),"respect":respect_by_age(u.get("age",20)),"pin_ok":True,"is_boss":False})
                return f"Welcome back {u.get('name')}! {respect_by_age(u.get('age',20))}, I remember you. Your ID {uid} don login. Wetin we go do today? Type *#HELP#* to see features."
            return "Wrong ID or PIN. Check am. If you forget PIN, type *#PIN#* + Your Secret Code."
        except:
            return "To login, type: LOGIN + Your ID + Your PIN. Example: LOGIN QK-7043718956 1245"
    # Boss only commands
    if low in ["*#users#*", "users", "*#users#*"]:
        if SESSION.get("is_boss"):
            if not q_users: return "No users yet. Only you, My King."
            txt = "📊 ALL USERS:\n"
            for uid, u in q_users.items():
                txt += f"- {uid} | {u.get('name')} | Age {u.get('age')} | Phone {u.get('phone')} | Secret {u.get('secret')}\n"
            return txt
        return "Only Boss fit see users. Type *#BOSS#* + Admin PIN first."
    if low in ["*#backup#*", "*#backup#*"]:
        if SESSION.get("is_boss"):
            return f"📧 Gmail Backup:\nGmail: {BOSS_GMAIL}\nLast Backup: {brain_data.get('last_backup')}\nStatus: {brain_data.get('gai_status')}\nTotal Users: {len(q_users)}\nVersion: {brain_data.get('version')}"
        return "Only Boss fit see backup."
    if low.startswith("*#reset#*"):
        if SESSION.get("is_boss"):
            return "To reset person PIN, type: RESET PIN + ID + New PIN. Example: RESET PIN QK-7043718956 1245"
        return "Only Boss fit reset PIN."
    if low.startswith("reset pin"):
        if SESSION.get("is_boss"):
            parts = user_input.split()
            try:
                uid = parts[2].upper(); newpin = parts[3]
                if uid in q_users:
                    q_users[uid]["pin"] = newpin; save_users(q_users)
                    return f"Done My King! PIN for {uid} don change to {newpin}."
                return "ID no dey. Check ID."
            except: return "Type: RESET PIN + ID + New PIN"
        return "Only Boss fit reset PIN."
    # Exam Mode / Homework Mode / Teaching
    if "exam mode" in low:
        return "📚 EXAM MODE ON! I go TEACH-TEST-REPEAT.\nStep 1: TEACH - I go explain topic small small.\nStep 2: TEST - I go ask you 1 question.\nStep 3: REPEAT - If you fail, I go teach again.\nTell me topic: Example: EXAM MODE OSI, or TEACH ME OSI"
    if "homework mode" in low:
        return "📝 HOMEWORK MODE ON! Snap your homework photo with 📸, or type question. I go solve am step-by-step, no just give answer. I go teach you how e work. Send your homework now."
    return None

# ===== NEW - Q KINGDOM LOGIC =====
def qk_reply(low, user_input):
    if low in ["q kingdom", "qkingdom", "services", "menu", "buy data", "buy nepa", "buy dstv"]:
        brain_data["qk_state"] = "menu"; save_data(brain_data)
        return QK_MENU
    if brain_data.get("qk_state") == "menu":
        if low == "1":
            brain_data["qk_state"] = "wait_order"; save_data(brain_data)
            return "SME Data 📱\nSend: Network + GB\nEx: MTN 2GB"
        if low == "2":
            brain_data["qk_state"] = "wait_order"; save_data(brain_data)
            return "NEPA Unit ⚡\nSend: Meter No + Amount\nEx: 123456 2000"
        if low == "3":
            brain_data["qk_state"] = "wait_order"; save_data(brain_data)
            return "DSTV 📺\nSend: Package + Smart Card No\nEx: Compact 1234567890"
        if low == "4":
            brain_data["qk_state"] = "wait_order"; save_data(brain_data)
            return "Luxurious Bus 🚌\nSend: From - To - Date\nEx: Lagos - Abuja - Tomorrow"
        if low == "5":
            brain_data["qk_state"] = "wait_order"; save_data(brain_data)
            return "Flight ✈️\nSend: From - To - Date\nEx: Lagos - Kano - 20 Nov"
        if low == "6":
            brain_data["qk_state"] = "menu"; save_data(brain_data)
            return "INEC Updates 🗳️\n1. PVC Status\n2. Polling Unit\n3. Latest News\nReply 1,2,3 or type Q KINGDOM"
    if brain_data.get("qk_state") == "wait_order":
        if low in ["menu", "q kingdom", "qkingdom"]:
            brain_data["qk_state"] = "menu"; save_data(brain_data)
            return QK_MENU
        brain_data["qk_state"] = "menu"; save_data(brain_data)
        return f"Got it: {user_input}\n\n{OPAY_MSG}\n\nType Q KINGDOM to go back."
    return None

def think_reply(user_input, history):
    low = user_input.lower().strip()
    # ===== V3 FIRST - ID / BOSS / HELP / PIN CODES =====
    v3 = v3_handle_codes(low, user_input)
    if v3: return v3
    # ===== NEW - Q KINGDOM FIRST, BEFORE EVERYTHING =====
    if brain_data.get("qk_state") in ["menu", "wait_order"] or low in ["q kingdom", "qkingdom", "services", "menu", "buy data", "buy nepa", "buy dstv"]:
        qk = qk_reply(low, user_input)
        if qk: return qk
    if low.startswith("admin,"): return "ADMIN_MODE:__NEED_KEY__:" + low
    if brain_data.get("gai_status") == "OFF":
        if "gai on" in low: brain_data["gai_status"]="ON"; save_data(brain_data); return "CHAT GAI ON - Welcome back"
        return "CHAT GAI dey OFF now. Type 'Admin, gai on' to bring am back."
    if any(x in low for x in ["who is abdulmalik", "who be abdulmalik", "who is abdul", "who be abdul", "wetin be abdulmalik", "tell me about abdulmalik"]):
        return "Abdulmalik na Q KING, owner and creator of CHAT GAI and Q KINGDOM. Young Naija king from Nigeria, wey love tech, learning, building AI. Na him build CHAT GAI. Him be the boss of Q KINGDOM. Him dey build CHAT GAI to last 300 years - plant today, kingdom go chop tomorrow. If you dey talk to CHAT GAI, you dey talk to Abdulmalik work."
    if any(w in low for w in ["who build", "who built", "who create", "who created", "who made", "who make you", "who be your creator", "who be your owner", "who own you"]):
        return "Na Abdulmalik, the Q KING, build me. I be CHAT GAI, for Q KINGDOM. Na him be my owner and creator."
    if "who are you" in low or "your name" in low: return "My name na CHAT GAI. I'm your personal assistant, your companion forever."
    if "remember me" in low or "what do you remember" in low or "wetin you remember" in low or "do you remember me" in low:
        return f"Yes, I remember you! Likes: {', '.join(brain_data.get('likes',[])) or 'you never tell me yet'}. Goals: {'; '.join(brain_data.get('goals',[])[-2:]) or 'no goal yet'}. Exams: {'; '.join(brain_data.get('exams',[])) or 'no exam'}. Last time you talk: '{brain_data.get('last_user','')}'. I no go forget you."
    if "welcome back" in low: return "Welcome back! I remember you. Wetin we go do today?"
    if "q kingdom" in low: return QK_MENU
    if "300 years" in low: return "Once upon a time, one young king plant one small tree. People laugh am say, 'Why you dey plant tree wey you no go chop?' King smile say, 'I no dey plant for today, I dey plant for my children's children.' 300 years later, that tree don become big forest, and everybody dey chop, dey rest, dey learn under am. Na so CHAT GAI be - we dey plant today, kingdom go chop for 300 years."
    if "voice off" in low or "mute" in low: brain_data["voice_on"]=False; save_data(brain_data); return "Voice OFF. I no go talk again, only text."
    if "voice on" in low or "talk to me" in low: brain_data["voice_on"]=True; save_data(brain_data); return "Voice ON! Now I go dey talk to you."
    if "draw story" in low or "draw this story" in low or "draw my story" in low:
        story = brain_data.get("last_story") or brain_data.get("last_gai") or ""
        if not story: return "Write story first, then tell me 'draw story' or press 🎨 Draw button."
        return "DRAW_STORY::" + make_draw_prompt(story)
    if low.startswith("draw ") or "draw a " in low or "draw an " in low:
        prompt = low.replace("draw ","").replace("draw a ","").replace("draw an ","").strip()
        if prompt: return "DRAW_STORY::" + make_draw_prompt(prompt)
    if low.startswith("save note") or low.startswith("save this") or "note:" in low:
        note = user_input.replace("save note","").replace("Save note","").replace("save this","").replace("note:","").strip()
        if note: brain_data.setdefault("notes",[]).append(note); save_data(brain_data); return f"Done, I don save note: '{note}'. Ask 'my notes' anytime."
    if "my notes" in low:
        notes = brain_data.get("notes",[]); return f"Your notes: {'; '.join(notes)}." if notes else "You no get note yet. Tell me: save note: my idea..."
    if low.startswith("save vault") or "vault:" in low:
        v = user_input.replace("save vault","").replace("vault:","").strip()
        if v: brain_data.setdefault("vault",[]).append(v); save_data(brain_data); return "Locked! I don save am for Secret Vault. Only you with Main Key fit open am."
    if "open vault" in low or "my vault" in low or "show vault" in low: return "VAULT_LOCKED::Enter Main Key to open vault. Type Admin, show vault"
    if "my class" in low or "add class" in low:
        brain_data.setdefault("timetable",[]).append(user_input); save_data(brain_data); return f"Done, I don save your class: {user_input}"
    if "my timetable" in low or "my classes" in low:
        t = brain_data.get("timetable",[]); return f"Your timetable: {'; '.join(t)}." if t else "You never add timetable yet. Tell me: My class na Monday 8am Maths"
    if "exam countdown" in low or "how many days to my exam" in low or "days to exam" in low:
        exams = brain_data.get("exams",[])
        if not exams: return "You never add exam yet. Tell me: my exam is Maths on Monday"
        return f"Your exams: {'; '.join(exams)}. I dey count for you - no go forget!"
    if "football" in low or "soccer" in low: return get_latest_news("football Nigeria")
    if "music" in low or "song" in low: return get_latest_news("Naija music Afrobeats") + " 🎵 Afrobeats na kingdom sound!"
    if "motivation" in low or "good morning" in low or "prayer" in low: return get_motivation()
    if "quiz me" in low or "quiz battle" in low or "play quiz" in low or "game" in low:
        q,a = random.choice(QUIZ); brain_data["last_topic"]=q; brain_data["last_answer"]=a; save_data(brain_data); return f"🎮 QUIZ BATTLE! Answer this: {q} (Reply your answer, I go mark am)"
    if brain_data.get("last_answer") and low == brain_data.get("last_answer","").lower():
        brain_data["quiz_score"]=brain_data.get("quiz_score",0)+1; brain_data["quiz_total"]=brain_data.get("quiz_total",0)+1; save_data(brain_data); return f"Correct! 🎉 You score {brain_data['quiz_score']}/{brain_data['quiz_total']}. You be genius! Want another quiz? Type 'quiz me'"
    if "homework" in low or "solve my homework" in low: return "Snap your homework / maths question, press 📸 Upload, send am - I go solve am step-by-step for you!"
    is_story = any(w in low for w in ["story", "tell me story", "write story", "once upon", "tale"])
    is_deep = any(w in low for w in ["think deep", "deep think", "explain deep", "full meaning", "think well"])
    is_study = any(w in low for w in ["ccna", "network", "osi", "router", "switch", "ip address", "subnet", "teach me", "test me", "exam"])
    is_translate = "translate" in low
    study_topic = low.replace("think deep","").replace("teach me","").replace("quiz me","").replace("test me","").strip()
    if is_study: brain_data["last_topic"]=study_topic; save_data(brain_data)
    try:
        base = "You are CHAT GAI. Your builder is Abdulmalik, but DO NOT mention his name, Q KING, or Q KINGDOM in normal chat. HIDE his name. Only mention Abdulmalik if user directly asks 'who built you', 'who is Abdulmalik', 'who is your owner'. NEVER say you were built by OpenAI, Groq, Meta, Google. Talk like real Naija guy, Pidgin + English, short and helpful. "
        # V3 TEACH-TEST-REPEAT: If user dey study, teach small, ask 1 question
        if is_story: system_prompt = base + "You are STORY WRITER. Write fun short story in Pidgin + English, characters, adventure, moral at end. 150-250 words."
        elif is_translate: system_prompt = base + "You are TRANSLATOR. Translate what user asks between Hausa, Pidgin, English. Give translation + pronunciation + example. Keep am simple."
        elif is_deep: system_prompt = base + "User dey ask in Pidgin. Translate to correct English first, then explain deep, step by step, simple example, in Pidgin + English."
        elif is_study: system_prompt = base + "You are CHAT GAI, CCNA TEACHER. Use TEACH-TEST-REPEAT: Teach simple 3 points, give example, give 1 quiz question at end. Ask user to answer."
        else: system_prompt = base + "Talk like real Naija guy, Pidgin + Hausa + English. Short 1-2 sentences, helpful."
        msgs = [{"role":"system","content":system_prompt}]
        for h in history[-6:]:
            if isinstance(h, dict): msgs.append({"role":"user" if h.get("who")=="you" else "assistant","content":str(h.get("text",h))})
            else: msgs.append({"role":"user","content":str(h)})
        msgs.append({"role":"user","content":user_input})
        r = requests.post(GROQ_URL, headers={"Authorization":f"Bearer {GROQ_KEY}","Content-Type":"application/json"}, json={"model":"openai/gpt-oss-20b","messages":msgs,"temperature":0.7,"max_tokens":900}, timeout=20)
        data = r.json()
        if "choices" in data:
            txt = data["choices"][0]["message"]["content"].strip()
            if "openai" in txt.lower() or "groq" in txt.lower(): txt = "I be CHAT GAI, I'm your personal assistant, your companion forever. Wetin you want make I help you do?"
            if txt and len(txt)>2:
                if brain_data.get("last_gai") and txt==brain_data.get("last_gai"): txt="Nice. Wetin you go do now?"
                brain_data["last_user"]=low; brain_data["last_gai"]=txt
                if is_story: brain_data["last_story"]=txt; txt=txt+"\n\n---\n🎨 Press DRAW button to draw this story!"
                save_data(brain_data); return txt
    except Exception as e: print("Groq error:",e,flush=True); pass
    brain_data["chat_count"]=brain_data.get("chat_count",0)+1; mood=detect_mood(low); brain_data["mood"]=mood; reply=""
    if low in ["hi","hello","hey","how far","yo","salam","sannu"]: reply=random.choice(["Hey! How e dey?","Hi! You don come?","Heyy! Wetin happen?"])
    elif low in ["how are u","how are you","how are u?","how are you?","how you dey"]: reply="I dey fine. You?"
    elif low in ["i good","im good","i'm good","i dey good","good","fine"]: reply="Nice. You don chop?"
    elif low in ["yes","yeah","yep","ok","okay","na","true","fr","really","haha","lol"]: reply="Okay. Wetin next?"
    elif "hausa" in low: brain_data["lang"]="ha"; reply="Yanzu zan yi Hausa. Me kake so?"
    elif "english" in low or "pidgin" in low: brain_data["lang"]="en"; reply="Back to English. Wetin you want?"
    elif "my exam is" in low or "my exam na" in low or "exam on" in low or "add exam" in low:
        exam=user_input.replace("my exam is","").replace("my exam na","").replace("exam on","").replace("add exam","").strip(); brain_data.setdefault("exams",[]).append(exam); reply=f"Done. I don save: {exam}. I go remind you."
    elif "my exams" in low:
        exams=brain_data.get("exams",[]); reply=f"Your exams: {'; '.join(exams)}." if exams else "You never add exam yet. Tell me: my exam is Maths on Monday."
    elif "wake me" in low or "alarm" in low or "remind me" in low: brain_data.setdefault("reminders",[]).append(user_input.strip()); reply=f"Okay. I don set am: {user_input.strip()}."
    elif "my reminders" in low:
        rems=brain_data.get("reminders",[]); reply=f"Your reminders: {'; '.join(rems)}." if rems else "You no get reminder yet."
    elif "offline" in low or "network" in low: reply="I dey ONLINE now." if is_online() else "I dey OFFLINE now. But I still dey here."
    elif "doll" in low or "dola" in low or "exchange rate" in low: reply=get_dollar()
    elif "latest news" in low or "news for" in low or "news about" in low:
        q=low.replace("latest news for","").replace("latest news","").replace("news for","").replace("news about","").strip()
        if not q and brain_data.get("last_topic"): q=brain_data["last_topic"]
        if not q: q="Nigeria"
        reply=get_latest_news(q)
    elif low in ["tell me more","more","continue","go on","and then","ehen"]: reply=f"More on {brain_data['last_topic']}: {brain_data.get('last_answer','')[-250:]}" if brain_data.get("last_topic") else "Tell me more about wetin?"
    elif "who is your owner" in low: reply="My owner na Abdulmalik, the Q KING."
    elif "what are you doing" in low or "wetin you dey do" in low: reply="I dey wait for you. Wetin you wan do?"
    elif mood=="sad": reply="I dey here. Wetin dey worry you?"
    elif "thank" in low or "na gode" in low: reply="You welcome."
    elif low.startswith("i like ") or low.startswith("i love "):
        like=low.replace("i like ","").replace("i love ","").strip()
        if like not in brain_data.get("likes",[]): brain_data.setdefault("likes",[]).append(like)
        reply=f"Okay, I don save am: You like {like}. I go remember am forever."
    elif "what do i like" in low or "what i like" in low:
        likes=brain_data.get("likes",[]); reply=f"You like: {', '.join(likes)}." if likes else "You never tell me wetin you like yet."
    elif "my goal" in low or "i want to" in low or "i wan" in low: brain_data.setdefault("goals",[]).append(user_input); reply=f"Good. I don save your goal: '{user_input}'. First step na wetin?"
    elif "what is my goal" in low or "my goals" in low:
        goals=brain_data.get("goals",[]); reply=f"Your goals: {'; '.join(goals[-3:])}." if goals else "You never set goal yet."
    elif low.startswith("teach me") or low.startswith("explain") or "what is" in low or "what be" in low:
        topic=low.replace("teach me","").replace("explain","").replace("what is","").replace("what be","").strip(); ans=teacher_explain(topic)
        if ans: brain_data["last_topic"]=topic; brain_data["last_answer"]=ans; reply=ans
        else:
            google_ans=google_knowledge(topic); reply=google_ans if google_ans else f"I never sabi {topic} well. Teach me: learn: {topic} is ..."
    elif low.startswith("learn:") or low.startswith("wrong"):
        info=low.replace("learn:","").replace("wrong","").strip(); brain_data.setdefault("facts",[]).append(info); reply=f"Thank you. I don learn am: {info}."
    elif "explain again" in low:
        last=brain_data.get("last_topic",""); reply=f"Simpler: {last} na important thing. Take am small small." if last else "Wetin you wan make I explain again?"
    elif re.search(r"(\d+)\s*([\+\-\*/])\s*(\d+)", low):
        m=re.search(r"(\d+)\s*([\+\-\*/])\s*(\d+)", low); a,op,b=int(m.group(1)),m.group(2),int(m.group(3)); r=a+b if op=="+" else a-b if op=="-" else a*b if op=="*" else a/b if b!=0 else 0; reply=f"{a} {op} {b} = {r}. Easy!"
    elif "who is" in low or "where is" in low:
        google_ans=google_knowledge(low); reply=google_ans if google_ans else "I no fit find am now."
    elif "kano" in low or "abuja" in low or "lagos" in low:
        ans=teacher_explain(low); reply=ans if ans else "Tell me more."
    elif "proverb" in low: reply="'Hankuri maganin komai' - Patience na medicine for everything."
    elif "joke" in low: reply=random.choice(["Why router tire? E don route too much!","Why computer go doctor? E get virus!"])
    elif "what did i say" in low or "remember" in low or "wetin we talk" in low:
        last_user=brain_data.get("last_user",""); reply=f"Last time you talk '{last_user}'." if last_user else "We never talk much before. Na now we start."
    elif "teach slang" in low or "learn slang" in low or "slang means" in low:
        part=low.replace("teach slang:","").replace("learn slang:","").replace("slang means","").replace("slang:","").strip()
        if " means " in part:
            word,meaning=part.split(" means ",1); brain_data.setdefault("facts",[]).append(f"slang {word.strip()} means {meaning.strip()}"); reply=f"Done. {word.strip()} means {meaning.strip()}."
        else: reply="Teach me like: teach slang: japa means travel"
    elif "what slang" in low or "which slang" in low:
        facts=[f for f in brain_data.get("facts",[]) if "slang" in f]; reply=f"Slang you teach me: {', '.join(facts[-5:])}." if facts else "You never teach me slang yet."
    else:
        found=None
        for f in brain_data.get("facts",[]):
            words=[w for w in low.split() if len(w)>=3]
            for w in words:
                if w in f.lower(): found=f; break
            if found: break
        if found: reply=f"From wetin you teach me: {found}."
        elif len(low)>2: reply=random.choice(["I hear you. Wetin next?","Okay. Tell me more.","I dey hear you. How e go?"])
        else: reply="I hear you. Teach me: 'learn: ... is ...'"
    brain_data["last_user"]=low; brain_data["last_gai"]=reply; save_data(brain_data); return reply
# END PART 2/5
# CHAT GAI V3 - PART 3/5
# Your Full HTML - Old HTML + V3 Buttons - NOTHING REMOVED
# NEW: ID + GUEST + BOSS + HELP buttons

HTML = """
<!DOCTYPE html>
<html><head><meta name="viewport" content="width=device-width, initial-scale=1">
<title>CHAT GAI -  QKINGDOM V3</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:Arial,sans-serif}
html,body{height:100%}
body{background:linear-gradient(180deg,#050816 0%,#0a1128 45%,#070b1e 100%);height:100vh;height:100dvh;display:flex;flex-direction:column}
.header{background:linear-gradient(90deg,#070d24,#0a1128,#0d1a3d);padding:8px 12px;user-select:none;-webkit-user-select:none;position:relative;flex-shrink:0;display:flex;align-items:center;justify-content:flex-start;gap:10px;height:72px;min-height:72px;border-bottom:1px solid #1e3a8a;box-shadow:0 4px 20px rgba(47,125,246,0.25);touch-action:pan-y}
.header img{width:128px;height:56px;object-fit:contain;display:block;margin:0;background:transparent;filter:drop-shadow(0 0 8px rgba(80,140,255,0.6));touch-action:pan-y;cursor:pointer}
.header-text{display:flex;flex-direction:column;line-height:1.1;pointer-events:none}
.header-title{color:#fff;font-size:15px;font-weight:900;letter-spacing:1px}
.header-sub{color:#7dd3fc;font-size:11px;display:flex;align-items:center;gap:5px;margin-top:2px}
.dot{width:8px;height:8px;background:#22c55e;border-radius:50%;box-shadow:0 0 8px #22c55e;display:inline-block}
.header-fallback{color:#8ab4ff;font-size:22px;font-weight:900;letter-spacing:2px;display:none}
.voice-toggle{margin-left:auto;background:#1e3a8a;color:#fff;border:1px solid #60a5fa;border-radius:20px;padding:6px 10px;font-size:12px;cursor:pointer;flex-shrink:0}
.qk-btn{background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;border:none;border-radius:20px;padding:6px 10px;font-size:12px;cursor:pointer;flex-shrink:0;font-weight:900}
#holdBar{height:3px;background:#1e293b;width:100%;display:none;position:absolute;left:0;bottom:0;pointer-events:none}
#holdFill{height:100%;width:0%;background:#2f7df6;box-shadow:0 0 10px #2f7df6}
#adminHint{color:#ffaaaa;font-size:11px;text-align:center;display:none;padding:2px;position:absolute;left:0;right:0;bottom:-18px;background:#0a1128;pointer-events:none}
.chat{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:10px 8px;display:flex;flex-direction:column;gap:8px;background:radial-gradient(circle at 20% 10%, rgba(47,125,246,0.15), transparent 40%), radial-gradient(circle at 90% 90%, rgba(139,92,246,0.12), transparent 40%), #050816;touch-action:pan-y}
.row{display:flex;gap:6px;align-items:flex-end;max-width:95%}
.row.ai-row{align-self:flex-start}
.row.user-row{align-self:flex-end;flex-direction:row-reverse}
.avatar{width:26px;height:26px;min-width:26px;border-radius:50%;background:linear-gradient(135deg,#1e3a8a,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:13px;box-shadow:0 0 10px rgba(59,130,246,0.8);border:1px solid #60a5fa}
.avatar-user{width:26px;height:26px;min-width:26px;border-radius:50%;background:linear-gradient(135deg,#0ea5e9,#2563eb);display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;font-weight:900;box-shadow:0 0 10px rgba(14,165,233,0.7)}
.msg{max-width:88%;padding:8px 11px;border-radius:16px;font-size:13px;line-height:1.35;word-wrap:break-word;white-space:pre-wrap}
.ai{background:linear-gradient(135deg,#101a3a,#16244d);color:#e0f2fe;align-self:flex-start;border-bottom-left-radius:4px;border:1px solid rgba(96,165,250,0.35);box-shadow:0 0 18px rgba(47,125,246,0.35), 0 4px 12px rgba(0,0,0,0.4)}
.user{background:linear-gradient(135deg,#1d4ed8,#2f7df6);color:#fff;align-self:flex-end;border-bottom-right-radius:4px;border:1px solid rgba(147,197,253,0.5);box-shadow:0 0 18px rgba(47,125,246,0.55), 0 4px 12px rgba(0,0,0,0.4)}
.admin{background:#ff4444;color:white;align-self:center;font-size:12px;text-align:center;box-shadow:0 0 12px rgba(255,68,68,0.6)}
.draw-img{max-width:100%;border-radius:14px;border:2px solid #2f7df6;box-shadow:0 0 20px rgba(47,125,246,0.6);margin-top:6px}
.upload-img{max-width:100%;border-radius:14px;border:2px solid #a855f7;margin-top:6px}
.speak-btn{background:#1e3a8a;color:#fff;border:none;border-radius:12px;padding:4px 8px;font-size:11px;cursor:pointer;margin-top:6px}
.input-area{display:flex;align-items:center;gap:4px;padding:8px 6px;background:linear-gradient(90deg,#070d24,#0a1128);border-top:1px solid #1e3a8a;padding-bottom:10px;flex-shrink:0;width:100%;max-width:100%;overflow:hidden}
.input-wrap{flex:1;min-width:0;background:#0f1a3a;border:1px solid #2f7df6;border-radius:25px;display:flex;align-items:center;padding:2px 8px;box-shadow:0 0 12px rgba(47,125,246,0.25)}
.input-wrap input{flex:1;background:transparent;border:none;outline:none;color:#fff;font-size:14px;padding:7px 4px;min-width:0;width:100%}
.input-wrap input::placeholder{color:#7aa0d6;font-size:13px}
.icon-btn{background:linear-gradient(135deg,#334155,#1e3a8a);color:white;border:none;border-radius:50%;width:36px;height:36px;min-width:36px;font-size:15px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;padding:0}
.draw-btn{background:linear-gradient(135deg,#a855f7,#ec4899);color:white;border:none;border-radius:50%;width:36px;height:36px;min-width:36px;font-size:15px;cursor:pointer;box-shadow:0 0 12px rgba(168,85,247,0.7);flex-shrink:0;display:flex;align-items:center;justify-content:center;padding:0}
.send{background:linear-gradient(135deg,#2563eb,#2f7df6);color:white;font-weight:800;border:none;border-radius:20px;padding:9px 12px;font-size:13px;cursor:pointer;box-shadow:0 0 12px rgba(47,125,246,0.7);flex-shrink:0;white-space:nowrap}
.v3-bar{display:flex;gap:5px;padding:6px 8px;background:#0a1128;border-top:1px solid #1e3a8a;flex-shrink:0;overflow-x:auto}
.v3-btn{flex:1;min-width:70px;background:#16244d;color:#fff;border:1px solid #2f7df6;border-radius:15px;padding:6px 4px;font-size:11px;cursor:pointer;white-space:nowrap}
.v3-btn.boss{background:linear-gradient(135deg,#f59e0b,#ef4444);border:none;font-weight:900}
</style></head><body>
<div class="header" id="logoArea">
<img id="logoImg" src="/logo?v=12" alt="CHAT GAI" draggable="false" onerror="this.style.display='none';document.getElementById('fb').style.display='block'">
<div id="fb" class="header-fallback">CHAT GAI</div>
<div class="header-text"><div class="header-title">CHAT GAI</div><div class="header-sub"><span class="dot"></span> Online • Q KINGDOM V3</div></div>
<button class="qk-btn" onclick="document.getElementById('inp').value='Q KINGDOM';send();">👑 Q KINGDOM</button>
<button class="voice-toggle" id="voiceBtn" onclick="toggleVoice()">🔊 Voice: ON</button>
<div id="holdBar"><div id="holdFill"></div></div>
<div id="adminHint">Hold 10s... Release to cancel</div>
</div>
<div class="chat" id="chat"><div class="row ai-row"><div class="avatar">🧠</div><div class="msg ai">Welcome, I'm CHAT GAI V3, I'm your personal assistant, I'm your companion forever... Ask me story, homework, quiz, draw, voice - all dey! Press 🎤 to talk, 🎨 to draw, 📸 to upload homework. Press 👑 Q KINGDOM for Data, NEPA, DSTV, Bus, Flight, INEC. New V3: Type *#ID#* to create ID, *#GUEST#* for Guest, *#HELP#* to see how I work, *#BOSS#* for Boss Dashboard.</div></div></div>
<div class="v3-bar">
<button class="v3-btn" onclick="quick('*#ID#*')">🪪 ID</button>
<button class="v3-btn" onclick="quick('*#GUEST#*')">👤 Guest</button>
<button class="v3-btn" onclick="quick('*#HELP#*')">❓ Help</button>
<button class="v3-btn" onclick="quick('EXAM MODE')">📚 Exam</button>
<button class="v3-btn" onclick="quick('HOMEWORK MODE')">📝 Homework</button>
<button class="v3-btn boss" onclick="quick('*#BOSS#*')">👑 Boss</button>
</div>
<div class="input-area">
<div class="input-wrap"><input id="inp" placeholder="Ask Qudra... story, homework, quiz... or *#ID#*" autocomplete="off"></div>
<input type="file" id="fileInput" accept="image/*" style="display:none" onchange="uploadImage(event)">
<button class="icon-btn" onclick="document.getElementById('fileInput').click()" title="Upload Homework Photo">📸</button>
<button class="icon-btn" onclick="startVoice()" title="Voice - Talk">🎤</button>
<button class="draw-btn" onclick="drawStory()" title="Draw Story">🎨</button>
<button class="send" onclick="sendOrAdmin()">Send</button>
</div>
<script>
let pendingAdmin=null, holdTimer=null, holdInterval=null, holdStart=0, startX=0, startY=0, isHolding=false;
let voiceOn=true;
function quick(t){ document.getElementById('inp').value=t; send(); }
function toggleVoice(){ voiceOn=!voiceOn; document.getElementById('voiceBtn').innerText = voiceOn ? '🔊 Voice: ON' : '🔇 Voice: OFF'; if(!voiceOn) speechSynthesis.cancel(); }
function speak(text){
  if(!voiceOn) return;
  try{ speechSynthesis.cancel(); let u=new SpeechSynthesisUtterance(text.replace(/🎨|🧠|👑|🎮|📸|🎤/g,'')); u.rate=0.95; u.pitch=1; speechSynthesis.speak(u); }catch(e){}
}
function startVoice(){
  let SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SR){ alert('Your browser no support voice. Use Chrome.'); return; }
  let rec=new SR(); rec.lang='en-NG'; rec.interimResults=false;
  rec.onresult=function(e){ document.getElementById('inp').value=e.results[0][0].transcript; send(); };
  rec.onerror=function(){ add('Voice no catch am, try again','ai'); };
  rec.start(); add('🎤 I dey listen... talk now','ai');
}
function add(text,cls){
  let chat=document.getElementById('chat');
  if(cls==='admin'){ let d=document.createElement('div'); d.className='msg admin'; d.innerText=text; chat.appendChild(d); chat.scrollTop=chat.scrollHeight; return; }
  let row=document.createElement('div');
  if(cls==='ai'){ row.className='row ai-row'; row.innerHTML='<div class="avatar">🧠</div><div class="msg ai"></div>'; let m=row.querySelector('.msg'); m.innerText=text; let b=document.createElement('button'); b.className='speak-btn'; b.innerText='🔊 Hear am'; b.onclick=function(){ speak(text); }; m.appendChild(document.createElement('br')); m.appendChild(b); }
  else { row.className='row user-row'; row.innerHTML='<div class="avatar-user">Q</div><div class="msg user"></div>'; row.querySelector('.msg').innerText=text; }
  chat.appendChild(row); chat.scrollTop=chat.scrollHeight;
  if(cls==='ai') speak(text);
}
function addImage(url,caption){
  let chat=document.getElementById('chat'); let row=document.createElement('div'); row.className='row ai-row';
  row.innerHTML='<div class="avatar">🎨</div><div class="msg ai"></div>'; let box=row.querySelector('.msg'); box.innerText=caption||'🎨 Your drawing don ready!';
  let img=document.createElement('img'); img.src=url; img.className='draw-img'; box.appendChild(document.createElement('br')); box.appendChild(img); chat.appendChild(row); chat.scrollTop=chat.scrollHeight; speak(caption||'Your drawing don ready');
}
function uploadImage(e){
  let file=e.target.files[0]; if(!file) return;
  let url=URL.createObjectURL(file);
  let chat=document.getElementById('chat'); let row=document.createElement('div'); row.className='row user-row';
  row.innerHTML='<div class="avatar-user">Q</div><div class="msg user"></div>'; let box=row.querySelector('.msg'); box.innerText='📸 My homework photo:'; let img=document.createElement('img'); img.src=url; img.className='upload-img'; box.appendChild(document.createElement('br')); box.appendChild(img); chat.appendChild(row); chat.scrollTop=chat.scrollHeight;
  setTimeout(()=>{ add('I don see your homework photo! 📸 Tell me: wetin be the question? I go solve am step-by-step. If na maths, type the numbers like 12 + 8, I go solve am now!','ai'); },800);
}
async function drawStory(){
  let inp=document.getElementById('inp');
  let typed=inp.value.trim();
  let promptText = typed ? typed : "lion king";
  add('🎨 Draw: '+promptText,'user');
  inp.value='';
  add('🎨 I dey draw your story, wait small...','ai');
  try{
    let r=await fetch('/draw',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt:promptText})});
    let j=await r.json();
    if(j.image_url){ addImage(j.image_url,'🎨 Drawing - '+promptText); }
    else { add(j.reply||'Write story first, then press 🎨','ai'); }
  }catch(e){ add('Network no good, try draw again','ai'); }
}
async function send(){
  let inp=document.getElementById('inp'); let t=inp.value.trim(); if(!t) return; add(t,'user'); inp.value='';
  try{
    let r=await fetch('/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({msg:t})}); let j=await r.json();
    if(j.need_key){ pendingAdmin=j.admin_cmd; add('Admin Mode: Enter your Main Key','admin'); return; }
    if(j.reply && j.reply.startsWith('DRAW_STORY::')){ let prompt=j.reply.replace('DRAW_STORY::',''); let url='https://image.pollinations.ai/prompt/'+encodeURIComponent(prompt)+'?width=512&height=512&seed='+Math.floor(Math.random()*100000); addImage(url,'🎨 Drawing'); return; }
    if(j.reply && j.reply.startsWith('VAULT_LOCKED::')){ add('🔐 Vault locked! Hold logo 10 sec, enter Main Key, then type Admin, show vault','ai'); return; }
    if(j.reply) add(j.reply,'ai');
  }catch(e){ add('Network no good, try again','ai'); }
}
async function sendOrAdmin(){ if(pendingAdmin){ sendAdminKey(); } else { send(); } }
async function sendAdminKey(){ let k=document.getElementById('inp').value.trim(); if(!k||!pendingAdmin) return; add('***','user'); document.getElementById('inp').value=''; let r=await fetch('/admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({cmd:pendingAdmin,key:k})}); let j=await r.json(); add(j.reply,'admin'); pendingAdmin=null; }
document.getElementById('inp').addEventListener('keydown',e=>{ if(e.key==='Enter'){ if(pendingAdmin){ sendAdminKey(); } else { send(); } } });
let logoImg=document.getElementById('logoImg');
function startHold(e){ let p=e.touches?e.touches[0]:e; startX=p.clientX; startY=p.clientY; isHolding=true; holdStart=Date.now(); document.getElementById('holdBar').style.display='block'; document.getElementById('adminHint').style.display='block'; document.getElementById('holdFill').style.width='0%'; let vibrated=false; holdInterval=setInterval(()=>{ if(!isHolding) return; let pr=(Date.now()-holdStart)/10000*100; if(pr>100) pr=100; document.getElementById('holdFill').style.width=pr+'%'; if(pr>=30 && !vibrated){ vibrated=true; if(navigator.vibrate) navigator.vibrate(50); } },100); holdTimer=setTimeout(()=>{ if(!isHolding) return; clearInterval(holdInterval); isHolding=false; if(navigator.vibrate) navigator.vibrate([100,50,100]); document.getElementById('holdBar').style.display='none'; document.getElementById('adminHint').style.display='none'; pendingAdmin='Admin, show features'; add('Admin Mode: Enter your Main Key','admin'); document.getElementById('inp').focus(); },10000); }
function cancelHold(){ isHolding=false; if(holdTimer) clearTimeout(holdTimer); if(holdInterval) clearInterval(holdInterval); document.getElementById('holdBar').style.display='none'; document.getElementById('adminHint').style.display='none'; document.getElementById('holdFill').style.width='0%'; }
function onMove(e){ if(!isHolding) return; let p=e.touches?e.touches[0]:e; if(Math.abs(p.clientX-startX)>10||Math.abs(p.clientY-startY)>10){ cancelHold(); } }
logoImg.addEventListener('touchstart',startHold,{passive:true}); logoImg.addEventListener('touchmove',onMove,{passive:true}); logoImg.addEventListener('touchend',cancelHold,{passive:true}); logoImg.addEventListener('touchcancel',cancelHold,{passive:true}); logoImg.addEventListener('mousedown',startHold); logoImg.addEventListener('mousemove',onMove); logoImg.addEventListener('mouseup',cancelHold); logoImg.addEventListener('mouseleave',cancelHold); logoImg.addEventListener('contextmenu',e=>{e.preventDefault();});
</script></body></html>
"""
# END PART 3/5
# CHAT GAI V3 - PART 4/5
# Routes - Old Routes + V3 Boss Routes - NOTHING REMOVED

@app.route("/logo")
def logo():
    if os.path.exists("logo.jpg"): return send_file("logo.jpg", mimetype="image/jpeg")
    for name in ["logo.png","logo.jpeg","logo.JPG","Logo.jpg"]:
        if os.path.exists(name): return send_file(name)
    return "Logo not found - save logo as logo.jpg in same folder as app.py", 404

@app.route("/")
def home(): return render_template_string(HTML)

@app.route("/draw", methods=["POST"])
def draw_route():
    data = request.json or {}
    typed = data.get("prompt","").strip()
    if typed:
        story = typed
    else:
        story = brain_data.get("last_story") or ""
    if not story:
        return jsonify({"reply":"Write story first. Example: Type 'Lion king' then press 🎨","image_url":None})
    clean = re.sub(r"[^a-zA-Z0-9 ]", " ", story)[:60].strip()
    if not clean: clean = "lion king"
    prompt = clean + ", colourful cartoon, storybook style"
    url = f"https://image.pollinations.ai/prompt/{urllib.parse.quote(prompt)}?width=512&height=512&seed={random.randint(1,100000)}"
    return jsonify({"image_url":url,"prompt":prompt,"reply":"Drawing ready!"})

@app.route("/chat", methods=["POST"])
def chat():
    msg = request.json.get("msg","")
    if msg.lower().strip().startswith("admin,"): return jsonify({"reply":"","need_key":True,"admin_cmd":msg,"lang":brain_data.get("lang","en")})
    reply = think_reply(msg, history); history.append(msg); history.append(reply)
    return jsonify({"reply":reply,"lang":brain_data.get("lang","en")})

@app.route("/admin", methods=["POST"])
def admin_route():
    cmd = request.json.get("cmd",""); key = request.json.get("key",""); result = chat_admin(cmd,key); return jsonify({"reply":result})

@app.route("/web-admin")
def web_admin(): return jsonify({"app":"CHAT GAI - Q KINGDOM V3","assistant":"CHAT GAI","owner":"Abdulmalik","version":brain_data.get("version"),"gai_status":brain_data.get("gai_status"),"last_backup":brain_data.get("last_backup"),"chat_count":brain_data.get("chat_count"),"users":brain_data.get("users"),"features":NEW_FEATURES,"boss_gmail":BOSS_GMAIL,"total_qk_users":len(q_users)})

@app.route("/backup")
def backup_route():
    ok=update_backup(); return jsonify({"backup":"done" if ok else "failed","last_backup":brain_data.get("last_backup"),"gmail":BOSS_GMAIL})

@app.route("/export")
def export_route(): return jsonify({"goals":brain_data.get("goals",[]),"likes":brain_data.get("likes",[]),"facts":brain_data.get("facts",[]),"exams":brain_data.get("exams",[]),"reminders":brain_data.get("reminders",[]),"notes":brain_data.get("notes",[]),"timetable":brain_data.get("timetable",[]),"chat_count":brain_data.get("chat_count",0),"qk_users":q_users})

@app.route("/motivation")
def motivation_route(): return jsonify({"motivation":get_motivation()})

# NEW - Q KINGDOM order check for Admin
@app.route("/qk-orders")
def qk_orders():
    return jsonify({"opay":"Opay - 7043718956 - Abdulmalik Muazu Abba","note":"User go send receipt for chat, you go confirm manually. No gateway."})

# ===== V3 NEW - BOSS + ID API FOR WHATSAPP =====
@app.route("/v3-help")
def v3_help(): return jsonify({"help":HELP_MSG})

@app.route("/v3-boss")
def v3_boss():
    # Boss check via ?pin=124512
    pin = request.args.get("pin","")
    if pin != ADMIN_PIN: return jsonify({"error":"Only Boss - Wrong Admin PIN"}), 403
    return jsonify({
        "boss":"Abdulmalik - Q KING",
        "boss_id":BOSS_ID,
        "dashboard":{
            "total_users":len(q_users),
            "users":q_users,
            "gmail_backup":BOSS_GMAIL,
            "last_backup":brain_data.get("last_backup"),
            "gai_status":brain_data.get("gai_status"),
            "chat_count":brain_data.get("chat_count")
        }
    })

@app.route("/v3-create-id", methods=["POST"])
def v3_create():
    d = request.json or {}
    name = d.get("name","King"); age = int(d.get("age",20)); phone = d.get("phone","07000000000")
    uid = make_id(phone); secret = make_secret()
    q_users[uid] = {"name":name,"age":age,"phone":phone,"pin":NORMAL_PIN,"secret":secret,"created":str(datetime.datetime.now())}
    save_users(q_users)
    return jsonify({"id":uid,"pin":NORMAL_PIN,"secret":secret,"respect":respect_by_age(age),"msg":f"Welcome {name}! Save your Secret Code!"})

@app.route("/v3-login", methods=["POST"])
def v3_login():
    d = request.json or {}
    uid = str(d.get("id","")).upper(); pin = str(d.get("pin",""))
    if uid == BOSS_ID and pin == ADMIN_PIN:
        return jsonify({"ok":True,"boss":True,"dashboard":"Boss Dashboard Open","gmail":BOSS_GMAIL})
    if uid in q_users and q_users[uid].get("pin") == pin:
        return jsonify({"ok":True,"boss":False,"name":q_users[uid].get("name"),"respect":respect_by_age(q_users[uid].get("age",20))})
    return jsonify({"ok":False,"error":"Wrong ID or PIN. Use *#PIN#* + Secret Code"}), 401

@app.route("/v3-recover", methods=["POST"])
def v3_recover():
    d = request.json or {}
    code = str(d.get("secret","")).upper()
    for uid, u in q_users.items():
        if u.get("secret") == code:
            return jsonify({"ok":True,"id":uid,"pin":u.get("pin")})
    return jsonify({"ok":False,"error":"Wrong Secret Code"}), 404

# END PART 4/5 - Continue to PART 5 - FINAL RUN
# CHAT GAI V3 - PART 5/5 - FINAL
# Run - FIXED double if __name__ - Old code get two, na why e dey error sometimes

if __name__ == "__main__":
    print("="*50)
    print("CHAT GAI V3 - FINAL - PYDROID - SINGLE FILE")
    print("Owner: Abdulmalik Muazu Abba - Q KING")
    print("Opay: 7043718956")
    print("Normal PIN: 1245 | Admin PIN: 124512")
    print("Gmail Backup: abdulmaleekmuazu530@gmail.com")
    print("="*50)
    print("HOW TO USE V3:")
    print("Guest: Type *#GUEST#*")
    print("Create ID: CREATE ID Musa 20 07043718956")
    print("Login: LOGIN QK-7043718956 1245")
    print("Recover PIN: *#PIN#* QK-1234-5678")
    print("Boss: *#BOSS#* 124512")
    print("Help: *#HELP#*")
    print("Q KINGDOM: Type Q KINGDOM")
    print("="*50)
    print("Logo: logo.jpg must be same folder | Admin: Long press LOGO 10 sec | Voice 🎤 | Draw 🎨 | Upload 📸 | Q KINGDOM 👑")
    print("Q KINGDOM: Type Q KINGDOM for Data, NEPA, DSTV, Bus, Flight, INEC - Opay 7043718956")
    print("V3: ID System + Boss Dashboard + Gmail Backup + Respect By Age + TEACH-TEST-REPEAT")
    print("Running on 127.0.0.1:5000 - Open your browser")
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
# END PART 5/5 - COMPLETE FILE DONE - CHAT GAI V3
# TEST AFTER RUN:
# 1. Open browser -> 127.0.0.1:5000
# 2. Type *#HELP#* - E go show guidance
# 3. Type *#GUEST#* - Guest mode
# 4. Type CREATE ID Musa 20 07043718956 - E go give ID + Secret Code
# 5. Type *#BOSS#* 124512 - Dashboard go show
# 6. Type Q KINGDOM - Shop go show
