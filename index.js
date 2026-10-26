const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;
app.use(express.json());
app.use(express.static('.'));

// ====== FILE DB ======
function load(file, def) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return def; } }
function save(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }

let windows = load('./windows.json', [
  { id: 'w1', name: 'Phones', icon: '📱', color: '#0078D7', size: 'medium', category: 'Electronics', on: true },
  { id: 'w2', name: 'Foods', icon: '🍲', color: '#D83B01', size: 'medium', category: 'Foods', on: true },
  { id: 'w3', name: 'Fashion', icon: '👗', color: '#E3008C', size: 'medium', category: 'Fashion', on: true },
  { id: 'w4', name: 'Furniture', icon: '🛋️', color: '#107C10', size: 'medium', category: 'Furniture', on: false }
]);
let categories = load('./categories.json', ["Electronics","Phones","Foods","Materials","Drinks","Fashion","Furniture","Adverts","Orders"]);
let products = load('./products.json', []);
let companies = load('./companies.json', []);
let adverts = load('./adverts.json', []);
let orders = load('./orders.json', []);

function genId(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,5); }

// ====== 14,15,16 AUTO-EXPIRE SYSTEM ======
function checkExpire(){
  const now = Date.now();
  let changed = false;
  companies.forEach(c => {
    if(c.expiresAt && now > c.expiresAt && c.active){
      c.active = false; changed = true;
      products.forEach(p => { if(p.companyId === c.id) p.valid = false; });
    }
  });
  products.forEach(p => { if(p.expiresAt && now > p.expiresAt && p.valid){ p.valid = false; changed = true; } });
  adverts.forEach(a => { if(a.expiresAt && now > a.expiresAt && a.valid){ a.valid = false; changed = true; } });
  orders.forEach(o => { if(o.expiresAt && now > o.expiresAt && o.valid){ o.valid = false; changed = true; } });
  if(changed){
    save('./companies.json', companies);
    save('./products.json', products);
    save('./adverts.json', adverts);
    save('./orders.json', orders);
  }
}
setInterval(checkExpire, 60*1000);

// ====== APIS ======
// 5,6,7,8,9,10 WINDOW STUDIO + ON/OFF + ANTI-BLANK
app.get('/api/windows', (req,res)=>{
  const isOwner = req.query.owner === '1';
  let list = windows;
  if(!isOwner){
    // Anti-Blank 10: OFF = hidden, Auto Suggestion 12: <3 products suggest OFF
    list = windows.filter(w => {
      if(!w.on) return false;
      const count = products.filter(p => p.windowId === w.id && p.valid && !p.outOfStock).length;
      if(count < 3 && !isOwner) return false; // Auto Suggestion
      return true;
    });
  }
  res.json(list);
});

app.post('/api/windows', (req,res)=>{
  const { name, icon, color, size, category } = req.body;
  const w = { id: genId(), name: name||'New Window', icon: icon||'🪟', color: color||'#0078D7', size: size||'medium', category: category||'Electronics', on: true, created: Date.now() };
  windows.push(w); save('./windows.json', windows);
  res.json({ ok: true, window: w });
});

app.put('/api/windows/:id', (req,res)=>{
  const w = windows.find(x => x.id === req.params.id);
  if(!w) return res.status(404).json({error:'not found'});
  Object.assign(w, req.body); // 7 Customize
  save('./windows.json', windows);
  res.json({ ok: true, window: w });
});

app.get('/api/categories', (req,res)=> res.json(categories));

// 11 PRODUCT UPLOAD + 13 DELETE + 15 OUT OF STOCK
app.get('/api/products', (req,res)=>{
  const { windowId } = req.query;
  let list = products.filter(p => p.valid && !p.outOfStock);
  if(windowId) list = list.filter(p => p.windowId === windowId);
  res.json(list);
});
app.get('/api/products/all', (req,res)=> res.json(products)); // owner see all

app.post('/api/products', (req,res)=>{
  const { windowId, name, price, image, companyId } = req.body;
  const p = { id: genId(), windowId, name, price, image: image||'https://via.placeholder.com/150', companyId: companyId||'general', valid: true, outOfStock: false, created: Date.now(), expiresAt: Date.now() + 30*24*60*60*1000 };
  products.push(p); save('./products.json', products);
  res.json({ ok: true, product: p });
});

app.put('/api/products/:id', (req,res)=>{
  const p = products.find(x => x.id === req.params.id);
  if(!p) return res.status(404).json({error:'not found'});
  Object.assign(p, req.body); // 15 mark out of stock
  save('./products.json', products);
  res.json({ ok: true, product: p });
});

app.delete('/api/products/:id', (req,res)=>{
  const idx = products.findIndex(x => x.id === req.params.id);
  if(idx>-1){ products[idx].valid = false; } // 13 Delete = Archive to invalid
  save('./products.json', products);
  res.json({ ok: true });
});

// 17 REGISTER
app.post('/api/register', (req,res)=>{
  const { businessName, phone, location, category, description, plan } = req.body;
  const plans = { starter: { days: 7, products: 5 }, business: { days: 30, products: 50 }, pro: { days: 30, products: 9999 }, empire: { days: 365, products: 9999 } };
  const p = plans[plan] || plans.starter;
  const c = { id: genId(), businessName, phone, location, category, description, plan: plan||'starter', active: true, subscribedAt: Date.now(), expiresAt: Date.now() + p.days*24*60*60*1000, maxProducts: p.products };
  companies.push(c); save('./companies.json', companies);
  res.json({ ok: true, company: c });
});
app.get('/api/companies', (req,res)=> res.json(companies));

// 18 SUBSCRIPTION
app.get('/api/subscription/plans', (req,res)=> res.json([
  { id: 'starter', name: 'Starter Free', price: 'Free', duration: '7 days', products: 5, popular: false },
  { id: 'business', name: 'Business', price: 'N5k/month', duration: '30 days', products: 50, popular: true },
  { id: 'pro', name: 'Pro', price: 'N15k/month', duration: '30 days', products: 'Unlimited', popular: false },
  { id: 'empire', name: 'Empire', price: 'N50k/year', duration: '365 days', products: 'Unlimited + 300-year vision', popular: false }
]));

// 16 ADVERT & ORDER
app.get('/api/adverts', (req,res)=> res.json(adverts.filter(a=>a.valid)));
app.post('/api/adverts', (req,res)=>{ const a={ id:genId(), ...req.body, valid:true, created:Date.now(), expiresAt:Date.now()+7*24*60*60*1000 }; adverts.push(a); save('./adverts.json', adverts); res.json({ok:true,a}); });
app.delete('/api/adverts/:id', (req,res)=>{ const a=adverts.find(x=>x.id===req.params.id); if(a) a.valid=false; save('./adverts.json', adverts); res.json({ok:true}); });

app.get('/api/orders', (req,res)=> res.json(orders.filter(o=>o.valid)));
app.post('/api/orders', (req,res)=>{ const o={ id:genId(), ...req.body, valid:true, created:Date.now(), expiresAt:Date.now()+3*24*60*60*1000 }; orders.push(o); save('./orders.json', orders); res.json({ok:true,o}); });

app.get('*', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));
app.listen(PORT, ()=> console.log(`Q OS v6.0 18 FEATURES LIVE ${PORT}`));
