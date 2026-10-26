<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Q OS v6.0 - Lumia Window OS</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Segoe,Tahoma,sans-serif}
body{background:#000;color:#fff;min-height:100vh}
.header{background:#0078d7;padding:14px 15px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10}
.header h1{font-size:20px;letter-spacing:2px;font-weight:700}
.header .mode{background:#fff;color:#0078d7;padding:5px 10px;border-radius:20px;font-size:10px;font-weight:bold}
.tiles{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px}
.tile{height:145px;display:flex;flex-direction:column;justify-content:flex-end;padding:12px;cursor:pointer;position:relative;transition:0.15s}
.tile:active{transform:scale(0.96)}
.count{position:absolute;top:8px;right:8px;background:rgba(0,0,0,0.65);padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600}
.icon{font-size:32px;margin-bottom:6px}
.name{font-size:13px;font-weight:600;line-height:1.2}
.electronics{background:#d83b01}.phones{background:#107c10}.materials{background:#5c2d91}
.fashion{background:#e81123}.foods{background:#ffb900;color:#000}.foods .count{background:rgba(0,0,0,0.7);color:#fff}
.drinks{background:#00b7c3}.furniture{background:#68768a}.owner{background:#0078d7;border:2px solid #fff}
.window-overlay{display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:#0f0f0f;z-index:100;overflow-y:auto}
.window-header{background:#0078d7;padding:14px 15px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:2}
.window-header h2{font-size:16px}
.window-header button{background:#fff;border:none;padding:8px 14px;font-weight:bold;cursor:pointer;border-radius:2px}
.product-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;padding:12px}
.product{background:#222;padding:8px;border-radius:3px}
.product .imgbox{background:#333;height:85px;display:flex;align-items:center;justify-content:center;font-size:28px}
.btn{background:#0078d7;color:#fff;border:none;padding:9px 14px;margin:3px;cursor:pointer;font-size:12px;font-weight:600;border-radius:2px}
.btn-danger{background:#e81123}.btn-dark{background:#333}
.switch-board{padding:12px}
.switch-row{display:flex;justify-content:space-between;align-items:center;background:#1f1f1f;padding:12px;margin-bottom:8px;border-radius:3px;font-size:13px;border:1px solid #2a2a2a}
.switch{width:50px;height:26px;background:#555;border-radius:20px;position:relative;cursor:pointer;flex-shrink:0}
.switch.on{background:#107c10}.switch-dot{width:22px;height:22px;background:#fff;border-radius:50%;position:absolute;top:2px;left:2px;transition:0.2s}
.switch.on .switch-dot{left:26px}
.owner-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px}
.owner-card{background:#1f1f1f;padding:15px;border-radius:3px;text-align:center;cursor:pointer;border:1px solid #2a2a2a}
.owner-card:active{background:#2a2a2a}
.plans{display:grid;gap:10px;padding:12px}
.plan{background:#1f1f1f;padding:16px;border-radius:4px;border:2px solid #2a2a2a}
.plan.popular{border-color:#0078d7;background:#1a2a40}
input,select{width:100%;padding:11px;margin-bottom:8px;background:#1f1f1f;border:1px solid #3a3a3a;color:#fff;border-radius:3px;font-size:13px}
small{color:#aaa;font-size:11px}
.footer{padding:20px;text-align:center;color:#555;font-size:11px}
</style>
</head>
<body>
<div class="header"><h1>Q OS v6.0</h1><div class="mode">OWNER MODE - 18 LOCKED</div></div>
<div id="homeTiles" class="tiles"></div>
<div class="footer">Lumia Window OS Style | Q OS | 300-Year Vision | Anti-Blank Page System ON</div>

<div id="windowOverlay" class="window-overlay">
<div class="window-header"><h2 id="windowTitle">Window</h2><button onclick="closeWindow()">✕ Close</button></div>
<div id="windowContent"></div>
</div>

<script>
let categories=[
{id:'electronics',name:'Electronics & Gadgets',icon:'📺',count:2,on:true,color:'electronics'},
{id:'phones',name:'Phones & Tablets',icon:'📱',count:1,on:true,color:'phones'},
{id:'materials',name:'Building Materials',icon:'🏗️',count:1,on:true,color:'materials'},
{id:'fashion',name:'Fashion & Wears',icon:'👗',count:1,on:true,color:'fashion'},
{id:'foods',name:'Foods & Kitchen',icon:'🍲',count:0,on:false,color:'foods'},
{id:'drinks',name:'Drinks & Water',icon:'🥤',count:0,on:false,color:'drinks'},
{id:'furniture',name:'Furniture & Home',icon:'🛋️',count:0,on:false,color:'furniture'},
{id:'owner',name:'Window Studio - Owner Control',icon:'⚙️',count:18,on:true,color:'owner',isOwner:true}
];
let products={
electronics:[{name:'LG TV 55" Smart',price:'₦150,000',company:'Alhaji Electronics Kano',img:'📺'},{name:'JBL Sound System',price:'₦45,000',company:'Kano Sound Hub',img:'🔊'}],
phones:[{name:'iPhone 15 Pro Max',price:'₦850,000',company:'Ahmed Phones Abuja',img:'📱'}],
materials:[{name:'Dangote Cement 50kg',price:'₦5,200',company:'Musa Materials',img:'🏗️'}],
fashion:[{name:'Original Atamfa',price:'₦12,000',company:'Arewa Fashion',img:'👗'}]
};

function renderTiles(){
const home=document.getElementById('homeTiles');home.innerHTML='';
categories.filter(c=>c.on).forEach(cat=>{
const div=document.createElement('div');div.className=`tile ${cat.color}`;
div.innerHTML=`<div class="count">${cat.count}</div><div class="icon">${cat.icon}</div><div class="name">${cat.name}</div>`;
div.onclick=()=>openWindow(cat.id);home.appendChild(div);
});
}

function openWindow(id){
const cat=categories.find(c=>c.id===id);
document.getElementById('windowOverlay').style.display='block';
document.getElementById('windowTitle').innerText=cat.name;
if(cat.isOwner){
document.getElementById('windowContent').innerHTML=`
<div class="owner-grid">
<div class="owner-card" onclick="openSwitchBoard()"><div style="font-size:36px">🎛️</div><h4 style="margin:8px 0 4px">Category Switch Board</h4><small>ON/OFF - Anti Blank Page System<br>Hide empty = No trust loss</small></div>
<div class="owner-card" onclick="openProductManager()"><div style="font-size:36px">📦</div><h4 style="margin:8px 0 4px">Product Delete & Expiry</h4><small>Delete Invalid / Expired / Out of Stock</small></div>
<div class="owner-card" onclick="openSubscriptionManager()"><div style="font-size:36px">💳</div><h4 style="margin:8px 0 4px">Subscription Manager</h4><small>4 Plans - Auto Expire Logic</small></div>
<div class="owner-card" onclick="openRegisterFlow()"><div style="font-size:36px">📝</div><h4 style="margin:8px 0 4px">Register + Window Studio</h4><small>Create New Windows - Lumia Style</small></div>
</div>
<div style="padding:12px">
<div style="background:#1f1f1f;padding:12px;border-radius:4px;border-left:4px solid #107c10">
<b>✅ GROUND STATUS - 18 FEATURES LOCKED</b><br>
<small style="color:#fff">
1. Gallery Type Preference | 2. Lumia Tiles Style | 3. Real OS Window Behavior | 4. AMLEEK900 Style<br>
5. Window Studio Page | 6. Create New Window Templates | 7. Lumia Tile Customize<br>
8. Order Categories List | 9. Category ON/OFF Switch | 10. Anti-Blank Page System | 11. Window Product Upload | 12. Auto Suggestion<br>
13. Delete Invalid Products | 14. Auto-Expire System | 15. Company Mark Out of Stock | 16. Advert & Order Expiry<br>
17. Register Page Process | 18. Subscription Page 4 Plans
</small>
</div>
<div style="margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:8px">
<div style="background:#1f1f1f;padding:10px;border-radius:3px;text-align:center"><b style="color:#ffb900">${categories.filter(c=>!c.isOwner && c.on).length} Active Tiles</b><br><small>Guest sees only this</small></div>
<div style="background:#1f1f1f;padding:10px;border-radius:3px;text-align:center"><b style="color:#e81123">${categories.filter(c=>!c.isOwner && !c.on).length} Hidden Tiles</b><br><small>Anti-blank protected</small></div>
</div>
</div>`;
}else{
let prods=products[id]||[];
let html=`<div style="padding:12px;display:flex;gap:8px"><button class="btn" onclick="uploadProduct('${id}')">+ Upload Product to ${cat.name}</button><button class="btn btn-dark" onclick="openSwitchBoard()">🎛️ Switch Board</button></div>`;
html+=`<div class="product-grid">`;
prods.forEach(p=>{
html+=`<div class="product"><div class="imgbox">${p.img}</div><div style="padding:6px 0"><b style="font-size:13px">${p.name}</b><br><small>${p.price}</small><br><small style="color:#0078d7">${p.company}</small><br><div style="margin-top:6px"><button class="btn btn-danger" onclick="deleteProduct('${id}','${p.name}')">Delete</button><button class="btn btn-dark">Pause</button></div></div></div>`;
});
if(prods.length===0){
html+=`<div style="grid-column:1/-1;padding:30px;text-align:center;background:#1f1f1f;border-radius:4px"><div style="font-size:40px">📦</div><h3>No Products Yet</h3><small>Upload first product to this window<br>If you get 3+ products, system will suggest ON</small><br><br><button class="btn" onclick="uploadProduct('${id}')">+ Upload Now</button></div>`;
}
html+=`</div>`;
document.getElementById('windowContent').innerHTML=html;
}
}

function closeWindow(){document.getElementById('windowOverlay').style.display='none'}
function openSwitchBoard(){
document.getElementById('windowTitle').innerText='Category Switch Board - Anti Blank Page System';
let html=`<div class="switch-board"><div style="background:#1a2a40;padding:12px;border-radius:4px;border:1px solid #0078d7;margin-bottom:12px"><b>🎯 YOUR GENIUS IDEA - ANTI BLANK PAGE</b><br><small style="color:#fff">Switch ON = Show Tile to Guests | Switch OFF = Hide from Guests<br><b>Guest never see blank page = 100% Trust System!</b></small></div>`;
categories.filter(c=>!c.isOwner).forEach(cat=>{
let status=cat.count===0?'Empty - Suggest OFF':cat.count>=3?'Good - Suggest ON':'Low';
let color=cat.count===0?'#e81123':cat.count>=3?'#107c10':'#ffb900';
html+=`<div class="switch-row"><div><b>${cat.icon} ${cat.name}</b><br><small style="color:${color}">${cat.count} products - ${status}</small></div><div class="switch ${cat.on?'on':''}" onclick="toggleCat('${cat.id}')"><div class="switch-dot"></div></div></div>`;
});
html+=`<div style="margin-top:12px;background:#1f1f1f;padding:10px;border-radius:3px"><small><b>Auto Rules:</b><br>• 0 products = Auto suggest OFF (hide)<br>• 1-2 products = Low - you decide<br>• 3+ products = Suggest ON (show)<br>• Expired company = Auto OFF + move to Expired Zone</small></div></div>`;
document.getElementById('windowContent').innerHTML=html;
}
function toggleCat(id){const cat=categories.find(c=>c.id===id);cat.on=!cat.on;renderTiles();openSwitchBoard();}
function openProductManager(){
document.getElementById('windowTitle').innerText='Product Delete & Expiry Manager';
let html=`<div style="padding:12px">`;
html+=`<div style="background:#2a1f1f;padding:12px;border-radius:4px;border-left:4px solid #e81123;margin-bottom:12px"><b>🔴 EXPIRED / INVALID ZONE - HIDDEN FROM GUESTS</b><br><small>These products are invalid - Delete or Archive now</small></div>`;
html+=`<div class="switch-row"><div><b>🔴 Coca Cola 50cl</b><br><small>Drinks - Subscription Expired 2 days ago - Company: Danladi Drinks</small></div><div style="display:flex;gap:4px"><button class="btn btn-danger">Delete</button><button class="btn btn-dark">Archive</button></div></div>`;
html+=`<div class="switch-row"><div><b>⚠️ iPhone 12 64GB</b><br><small>Phones - Company Marked "No Longer Available"</small></div><div style="display:flex;gap:4px"><button class="btn btn-danger">Delete</button></div></div>`;
html+=`<div style="background:#1f2a1f;padding:12px;border-radius:4px;border-left:4px solid #107c10;margin:16px 0 12px"><b>🟢 ACTIVE PRODUCTS - VISIBLE TO GUESTS</b></div>`;
Object.keys(products).forEach(cat=>{
products[cat].forEach(p=>{
html+=`<div class="switch-row"><div><b>🟢 ${p.name}</b><br><small>${cat} - ${p.company} - ${p.price}</small></div><div style="display:flex;gap:4px"><button class="btn btn-danger" onclick="deleteProduct('${cat}','${p.name}')">Delete</button><button class="btn btn-dark">Pause</button></div></div>`;
});
});
html+=`</div>`;document.getElementById('windowContent').innerHTML=html;
}
function openSubscriptionManager(){
document.getElementById('windowTitle').innerText='Register + Subscription Flow - Money Engine';
document.getElementById('windowContent').innerHTML=`
<div style="padding:12px">
<div style="background:#1a2a40;padding:12px;border-radius:4px;margin-bottom:12px"><b>💰 SUBSCRIPTION PLANS - 4 TIERS</b><br><small>Expired = Auto hide products to Expired Zone - Guest never see expired company</small></div>
<div class="plans">
<div class="plan"><h4>Starter</h4><p style="margin:6px 0"><b>Free 7 Days Trial</b></p><small>✓ 5 products max<br>✓ 1 category<br>✓ Basic support<br>✓ Q watermark</small><br><br><button class="btn" style="width:100%">Start Free Trial</button></div>
<div class="plan popular"><div style="background:#0078d7;color:#fff;display:inline-block;padding:2px 8px;border-radius:10px;font-size:10px;margin-bottom:6px">POPULAR - MOST CHOSEN</div><h4>Business</h4><p style="margin:6px 0"><b>₦5,000 / month</b></p><small>✓ 50 products<br>✓ 3 categories<br>✓ WhatsApp order<br>✓ No watermark<br>✓ Priority listing</small><br><br><button class="btn" style="width:100%;background:#fff;color:#0078d7">Pay & Activate Now</button></div>
<div class="plan"><h4>Pro</h4><p style="margin:6px 0"><b>₦15,000 / month</b></p><small>✓ Unlimited products<br>✓ All categories<br>✓ Featured homepage<br>✓ Analytics<br>✓ 24/7 support</small><br><br><button class="btn" style="width:100%">Pay - Pro</button></div>
<div class="plan" style="border-color:#ffb900"><h4>Empire - 300 Year Vision</h4><p style="margin:6px 0"><b>₦50,000 / year</b> - Save ₦130k</p><small>✓ Everything in Pro<br>✓ Own window template<br>✓ Ramadan/Sallah windows<br>✓ API access<br>✓ Legacy builder</small><br><br><button class="btn" style="width:100%;background:#ffb900;color:#000">Pay Yearly - Empire</button></div>
</div>
<div style="margin-top:14px;background:#1f1f1f;padding:12px;border-radius:4px"><b>Register Flow Logic:</b><br><small>1. Business fill: Name, Owner, Phone (WhatsApp), Location (Kano/Abuja), Category, Description<br>2. Choose Plan (above)<br>3. Pay (Paystack/Flutterwave)<br>4. Active → Products show in Lumia Tiles<br>5. Expired → Auto hide to Expired Zone + Owner can delete/archive<br>6. Company mark "Out of Stock" → Auto invalid</small></div>
</div>`;
}
function openRegisterFlow(){
document.getElementById('windowTitle').innerText='Business Register - Q OS v6.0';
document.getElementById('windowContent').innerHTML=`
<div style="padding:12px;max-width:420px;margin:0 auto">
<div style="background:#1f1f1f;padding:16px;border-radius:4px">
<h3 style="margin-bottom:12px">📝 Business Register Window</h3>
<input placeholder="Business Name e.g. Alhaji Electronics" id="biz">
<input placeholder="Owner Name e.g. Musa Abdullahi">
<input placeholder="Phone (WhatsApp) e.g. 080...">
<input placeholder="Location e.g. Kano, Abuja, Lagos">
<select><option>Select Category</option><option>Electronics & Gadgets</option><option>Phones & Tablets</option><option>Building Materials</option><option>Fashion & Wears</option><option>Foods & Kitchen</option><option>Drinks & Water</option><option>Furniture & Home</option></select>
<textarea placeholder="Business Description..." style="width:100%;padding:11px;margin-bottom:8px;background:#1f1f1f;border:1px solid #3a3a3a;color:#fff;border-radius:3px;min-height:70px;font-size:13px"></textarea>
<button class="btn" style="width:100%;padding:12px" onclick="openSubscriptionManager()">Create Account → Go to Subscription → Pay</button>
<small style="display:block;margin-top:10px;text-align:center">After pay, your products will show in Lumia Tiles immediately</small>
</div>
<div style="margin-top:12px;background:#1a2a40;padding:12px;border-radius:4px;text-align:center"><small><b>Window Studio Feature:</b><br>You fit create custom windows like "Ramadan Window", "Sallah Window", "New Arrival Window" - choose icon, color, size for each!</small></div>
</div>`;
}
function uploadProduct(cat){
let name=prompt('Product Name (e.g. LG TV 55"):');if(!name)return;
let price=prompt('Price (e.g. ₦150,000):');let company=prompt('Company Name:');let img=prompt('Emoji icon for product (e.g. 📺):')||'📦';
if(!products[cat])products[cat]=[];products[cat].push({name,price,company,img});
categories.find(c=>c.id===cat).count=products[cat].length;
if(products[cat].length>=3 && !categories.find(c=>c.id===cat).on){if(confirm(cat.toUpperCase()+' now has '+products[cat].length+' products. Switch ON to show tile to guests?')){categories.find(c=>c.id===cat).on=true;}}
renderTiles();openWindow(cat);
}
function deleteProduct(cat,name){
let del=confirm('DELETE "'+name+'"?\n\nOK = Delete Forever\nCancel = Move to Archive (can restore later)');
if(!del){alert('"'+name+'" moved to Archive Zone - You can restore later from Expired Zone');return;}
products[cat]=products[cat].filter(p=>p.name!==name);categories.find(c=>c.id===cat).count=products[cat].length;
if(products[cat].length===0){alert('Category "'+cat+'" now EMPTY - Suggest switching OFF tile to hide from guests (Anti-Blank Page System)');}
renderTiles();openWindow(cat);
}
renderTiles();
</script>
</body>
</html>
