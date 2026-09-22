/* ===== HSC Boi Ghor — order page logic ===== */

/* ---- Config (edit here) ---- */
const CONFIG = {
  whatsapp: "8801324229999", // support / order number (intl, no +)
  delivery: 80,              // flat delivery charge (BDT)
  freeShippingOver: null     // future: e.g. 2000 → free delivery above this; null = off
};

/* ---- Categories (books = base; guides + test papers = optional add-ons) ---- */
const CATEGORIES = [
  { id:"books",      label:"পাঠ্যবই",            enabled:true,  base:true,  priceKey:"price" },
  { id:"guides",     label:"সহায়ক বই (গাইড)",    enabled:true,  priceKey:"guidePrice",
    note:"পাবলিশার ও এডিশন স্টক অনুযায়ী ভিন্ন হতে পারে।" },
  { id:"testpapers", label:"টেস্ট পেপার",         enabled:false, comingSoon:true, priceKey:"testPrice" }
];

/* ---- Districts by division (Bengali) ---- */
const DISTRICTS = {
  "ঢাকা": ["ঢাকা","গাজীপুর","নারায়ণগঞ্জ","টাঙ্গাইল","কিশোরগঞ্জ","মানিকগঞ্জ","মুন্সিগঞ্জ","নরসিংদী","ফরিদপুর","গোপালগঞ্জ","মাদারীপুর","রাজবাড়ী","শরীয়তপুর"],
  "চট্টগ্রাম": ["চট্টগ্রাম","কুমিল্লা","কক্সবাজার","ব্রাহ্মণবাড়িয়া","চাঁদপুর","ফেনী","লক্ষ্মীপুর","নোয়াখালী","বান্দরবান","খাগড়াছড়ি","রাঙ্গামাটি"],
  "রাজশাহী": ["রাজশাহী","বগুড়া","পাবনা","সিরাজগঞ্জ","নাটোর","নওগাঁ","জয়পুরহাট","চাঁপাইনবাবগঞ্জ"],
  "খুলনা": ["খুলনা","যশোর","কুষ্টিয়া","ঝিনাইদহ","সাতক্ষীরা","বাগেরহাট","মাগুরা","নড়াইল","চুয়াডাঙ্গা","মেহেরপুর"],
  "বরিশাল": ["বরিশাল","পটুয়াখালী","ভোলা","পিরোজপুর","বরগুনা","ঝালকাঠি"],
  "সিলেট": ["সিলেট","মৌলভীবাজার","হবিগঞ্জ","সুনামগঞ্জ"],
  "রংপুর": ["রংপুর","দিনাজপুর","কুড়িগ্রাম","গাইবান্ধা","নীলফামারী","লালমনিরহাট","পঞ্চগড়","ঠাকুরগাঁও"],
  "ময়মনসিংহ": ["ময়মনসিংহ","জামালপুর","নেত্রকোণা","শেরপুর"]
};

/* ---- Catalog ---- */
const COMMON = [
  { id:"bn1", name:"বাংলা প্রথম পত্র", desc:"সাহিত্যপাঠ ও সহপাঠ", price:180, guidePrice:260 },
  { id:"bn2", name:"বাংলা দ্বিতীয় পত্র", desc:"বাংলা ভাষা-উৎস ও ব্যবহার / ব্যাকরণ ও নির্মিতি", price:180, guidePrice:260 },
  { id:"en1", name:"ইংরেজি প্রথম পত্র", desc:"English for Today", price:200, guidePrice:280 },
  { id:"en2", name:"ইংরেজি দ্বিতীয় পত্র", desc:"English Grammar and Composition", price:220, guidePrice:300 },
  { id:"ict", name:"তথ্য ও যোগাযোগ প্রযুক্তি", desc:"ICT", price:150, guidePrice:240 }
];

const GROUPS = {
  science: {
    name:"বিজ্ঞান বিভাগ", cover:"science",
    items:[
      { id:"phy", name:"পদার্থবিজ্ঞান", desc:"১ম ও ২য় পত্র", price:360, guidePrice:320 },
      { id:"chem", name:"রসায়ন", desc:"১ম ও ২য় পত্র", price:340, guidePrice:320 },
      { id:"bio", name:"জীববিজ্ঞান", desc:"১ম ও ২য় পত্র", price:340, guidePrice:320 },
      { id:"hmath", name:"উচ্চতর গণিত", desc:"১ম ও ২য় পত্র", price:300, guidePrice:300 }
    ]
  },
  commerce: {
    name:"ব্যবসায় শিক্ষা বিভাগ", cover:"commerce",
    items:[
      { id:"acc", name:"হিসাববিজ্ঞান", desc:"১ম ও ২য় পত্র", price:360, guidePrice:330 },
      { id:"bom", name:"ব্যবসায় সংগঠন ও ব্যবস্থাপনা", desc:"১ম ও ২য় পত্র", price:340, guidePrice:320 },
      { id:"fbi", name:"ফিন্যান্স, ব্যাংকিং ও বিমা", desc:"১ম ও ২য় পত্র", price:320, guidePrice:310 },
      { id:"pmm", name:"উৎপাদন ব্যবস্থাপনা ও বিপণন", desc:"১ম ও ২য় পত্র", price:300, guidePrice:300, optional:true }
    ]
  },
  arts: {
    name:"মানবিক বিভাগ", cover:"arts",
    items:[
      { id:"civics", name:"পৌরনীতি ও সুশাসন", desc:"১ম ও ২য় পত্র", price:300, guidePrice:300 },
      { id:"hist", name:"ইতিহাস", desc:"১ম ও ২য় পত্র", price:280, guidePrice:290, options:["ইতিহাস","বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা"] },
      { id:"socio", name:"সমাজবিজ্ঞান", desc:"১ম ও ২য় পত্র", price:300, guidePrice:300, options:["সমাজবিজ্ঞান","সমাজকর্ম"] },
      { id:"econ", name:"অর্থনীতি", desc:"১ম ও ২য় পত্র", price:300, guidePrice:300 },
      { id:"logic", name:"যুক্তিবিদ্যা", desc:"১ম ও ২য় পত্র", price:260, guidePrice:280 },
      { id:"geo", name:"ভূগোল ও পরিবেশ", desc:"১ম ও ২য় পত্র", price:280, guidePrice:290 },
      { id:"religion", name:"ধর্ম ও নৈতিক শিক্ষা", desc:"", price:240, guidePrice:260, options:["ইসলাম শিক্ষা","হিন্দুধর্ম ও নৈতিক শিক্ষা"] }
    ]
  }
};

/* ---- State ---- */
const state = { group:"science", sel:{}, qty:{}, choice:{}, open:{} };
CATEGORIES.forEach(c => { state.sel[c.id] = new Set(); state.open[c.id] = false; });

const ALL_GROUP_IDS = new Set();
Object.values(GROUPS).forEach(g => g.items.forEach(i => ALL_GROUP_IDS.add(i.id)));

function catById(id){ return CATEGORIES.find(c => c.id === id); }
function itemsOf(group){ return COMMON.concat(GROUPS[group].items); }
function findItem(id){ return itemsOf(state.group).find(i => i.id === id); }
function itemPrice(item, catId){ const c = catById(catId); return (item && item[c.priceKey]) || 0; }

function labelOf(id){
  const item = findItem(id);
  if (!item) return id;
  if (item.options) return item.options[state.choice[id] || 0];
  return item.name;
}
function qtyOf(id){ return state.qty[id] || 1; }

/* books defaults */
function selectCommon(){
  COMMON.forEach(i => { state.sel.books.add(i.id); state.qty[i.id] = state.qty[i.id] || 1; });
}
function defaultSelectGroup(group){
  ALL_GROUP_IDS.forEach(id => state.sel.books.delete(id));
  GROUPS[group].items.forEach(i => { state.sel.books.add(i.id); state.qty[i.id] = state.qty[i.id] || 1; });
}
function selectAllBooks(){
  COMMON.forEach(i => { state.sel.books.add(i.id); state.qty[i.id] = state.qty[i.id] || 1; });
  GROUPS[state.group].items.forEach(i => { state.sel.books.add(i.id); state.qty[i.id] = state.qty[i.id] || 1; });
}

/* add-on helpers */
function addonIds(catId){ return itemsOf(state.group).map(i => i.id); }
function addonAllSelected(catId){ const ids = addonIds(catId); const s = state.sel[catId]; return ids.length > 0 && ids.every(id => s.has(id)); }
function setAddonAll(catId, on){
  const s = state.sel[catId];
  addonIds(catId).forEach(id => on ? s.add(id) : s.delete(id));
  if (on) state.open[catId] = true;
}
function resetAddonGroup(catId){ ALL_GROUP_IDS.forEach(id => state.sel[catId].delete(id)); }

/* ---- Helpers ---- */
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
function toBn(v){ return String(v).replace(/\d/g, d => BN_DIGITS[d]); }
function money(n){ return "৳" + toBn(n); }

const SVG_CHECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-11"/></svg>';
const SVG_BOOK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.2A2.7 2.7 0 0 1 6.7 2.5H19a1 1 0 0 1 1 1v15.2a1 1 0 0 1-1 1H6.7A2.7 2.7 0 0 0 4 22.4V5.2Z"/><path d="M4 19.7A2.7 2.7 0 0 1 6.7 17H20"/></svg>';
const SVG_CHEV = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

/* ---- Render books ---- */
function bookCard(item, coverClass){
  const checked = state.sel.books.has(item.id);
  const q = qtyOf(item.id);
  const badge = item.optional ? '<span class="badge opt">ঐচ্ছিক</span>' : "";
  const choice = item.options ? `
    <div class="choice">
      <span>একটি বাছুন</span>
      <select data-action="choice" data-id="${item.id}">
        ${item.options.map((o, i) => `<option value="${i}" ${ (state.choice[item.id]||0)===i ? "selected":""}>${o}</option>`).join("")}
      </select>
    </div>` : "";
  return `
    <article class="book ${checked ? "is-selected" : "is-off"}" data-id="${item.id}">
      <label class="book-check">
        <input type="checkbox" data-action="toggle" data-id="${item.id}" ${checked ? "checked" : ""} aria-label="${item.name} নির্বাচন করুন">
        <span class="box">${SVG_CHECK}</span>
      </label>
      <div class="cover ${coverClass}">${SVG_BOOK}</div>
      <div class="book-info">
        <h4 class="book-title">${item.name}${badge}</h4>
        ${item.desc ? `<p class="book-desc">${item.desc}</p>` : ""}
        ${choice}
        <div class="book-bottom">
          <span class="price">${money(item.price)}</span>
          <div class="qty">
            <button type="button" data-action="dec" data-id="${item.id}" ${q<=1?"disabled":""} aria-label="কমান">−</button>
            <span class="qty-val">${toBn(q)}</span>
            <button type="button" data-action="inc" data-id="${item.id}" aria-label="বাড়ান">+</button>
          </div>
        </div>
      </div>
    </article>`;
}

function renderBooks(){
  document.getElementById("list-common").innerHTML =
    COMMON.map(i => bookCard(i, "common")).join("");
  document.getElementById("list-group").innerHTML =
    GROUPS[state.group].items.map(i => bookCard(i, GROUPS[state.group].cover)).join("");
  document.getElementById("group-list-title").textContent = GROUPS[state.group].name + " বিষয়";
  document.getElementById("select-full-set").textContent = "সম্পূর্ণ পাঠ্যবই";
}

/* ---- Render add-ons (accordion) ---- */
function guideRow(item){
  const checked = state.sel.guides.has(item.id);
  const choice = item.options ? `
    <select data-action="choice" data-id="${item.id}">
      ${item.options.map((o, i) => `<option value="${i}" ${ (state.choice[item.id]||0)===i ? "selected":""}>${o}</option>`).join("")}
    </select>` : "";
  return `
    <label class="guide-row ${checked ? "is-selected" : ""}">
      <input type="checkbox" data-addon-item="guides" data-id="${item.id}" ${checked ? "checked" : ""} aria-label="${item.name} গাইড">
      <span class="box">${SVG_CHECK}</span>
      <span class="gi-info">
        <span class="gi-name">${item.name}${choice}</span>
        <span class="gi-price">${money(item.guidePrice)}</span>
      </span>
    </label>`;
}

function addonCard(cat){
  if (cat.comingSoon){
    return `
      <div class="addon is-soon">
        <div class="addon-head">
          <span class="switch is-disabled"><span class="switch-track"><span class="switch-thumb"></span></span></span>
          <div class="addon-title">
            <span class="addon-name">${cat.label}</span>
            <span class="addon-sub">পরীক্ষার সময় পাওয়া যাবে</span>
          </div>
          <span class="badge soon">শীঘ্রই আসছে</span>
        </div>
      </div>`;
  }
  const ids = addonIds(cat.id);
  const s = state.sel[cat.id];
  const picked = ids.filter(id => s.has(id));
  const sum = picked.reduce((t, id) => t + itemPrice(findItem(id), cat.id), 0);
  const all = addonAllSelected(cat.id);
  const sub = picked.length
    ? `<span class="addon-sub active">${toBn(picked.length)}টি নির্বাচিত · ${money(sum)}</span>`
    : `<span class="addon-sub">যোগ করতে টগল করুন</span>`;
  return `
    <div class="addon ${state.open[cat.id] ? "open" : ""}" data-cat="${cat.id}">
      <div class="addon-head">
        <label class="switch" aria-label="${cat.label} ${all ? "বন্ধ করুন" : "যোগ করুন"}">
          <input type="checkbox" data-addon-toggle="${cat.id}" ${all ? "checked" : ""}>
          <span class="switch-track"><span class="switch-thumb"></span></span>
        </label>
        <button type="button" class="addon-title" data-addon-expand="${cat.id}">
          <span class="addon-name">${cat.label}</span>
          ${sub}
        </button>
        <button type="button" class="chev-btn" data-addon-expand="${cat.id}" aria-label="খুলুন / বন্ধ করুন">${SVG_CHEV}</button>
      </div>
      <div class="addon-body">
        ${cat.note ? `<p class="addon-note">${cat.note}</p>` : ""}
        <div class="addon-list">${itemsOf(state.group).map(guideRow).join("")}</div>
        <button type="button" class="link-btn addon-all" data-addon-all="${cat.id}">সম্পূর্ণ সহায়ক বই সেট</button>
      </div>
    </div>`;
}

function renderAddons(){
  const box = document.getElementById("addons");
  box.innerHTML = CATEGORIES.filter(c => !c.base && (c.enabled || c.comingSoon)).map(addonCard).join("");
}

/* ---- Totals & review ---- */
function catSelection(catId){
  const cat = catById(catId);
  return [...state.sel[catId]].map(id => {
    const item = findItem(id);
    const qty = cat.base ? qtyOf(id) : 1;
    const price = itemPrice(item, catId);
    return { id, label:labelOf(id), qty, price, line:qty * price };
  });
}
function totals(){
  const cats = CATEGORIES.filter(c => c.base || c.enabled);
  const sections = cats.map(c => ({ cat:c, items:catSelection(c.id) }));
  const items = sections.flatMap(s => s.items);
  const subtotal = items.reduce((s, i) => s + i.line, 0);
  let delivery = items.length ? CONFIG.delivery : 0;
  if (CONFIG.freeShippingOver && subtotal >= CONFIG.freeShippingOver) delivery = 0;
  return { sections, items, subtotal, delivery, total: subtotal + delivery, count: items.length };
}

function renderReview(){
  const t = totals();
  const box = document.getElementById("review");
  const nonEmpty = t.sections.filter(s => s.items.length);
  if (!nonEmpty.length){
    box.innerHTML = '<p class="review-empty">এখনো কিছু নির্বাচন করা হয়নি। উপরে আপনার বিভাগ, বই এবং ঐচ্ছিক যোগ করুন থেকে বেছে নিন।</p>';
  } else {
    box.innerHTML = nonEmpty.map(s => `
      <div class="review-group">
        <h4 class="review-cat">${s.cat.label}</h4>
        <ul class="review-lines">
          ${s.items.map(i => `<li><span class="rl-name">${i.label} <b>× ${toBn(i.qty)}</b></span><span class="rl-price">${money(i.line)}</span></li>`).join("")}
        </ul>
      </div>`).join("") + `
      <div class="review-total">
        <div class="rt-row"><span>সাবটোটাল</span><span>${money(t.subtotal)}</span></div>
        <div class="rt-row"><span>ডেলিভারি চার্জ</span><span>${t.delivery ? money(t.delivery) : "ফ্রি"}</span></div>
        <div class="rt-row grand"><span>সর্বমোট (ক্যাশ অন ডেলিভারি)</span><span>${money(t.total)}</span></div>
      </div>`;
  }
  const bar = document.getElementById("order-bar");
  bar.hidden = t.count === 0;
  document.getElementById("bar-count").textContent = toBn(t.count);
  document.getElementById("bar-total").textContent = money(t.total);
}

function refresh(){ renderBooks(); renderAddons(); renderReview(); }

/* ---- Events ---- */
function onListEvent(e){
  const inc = e.target.closest('[data-action="inc"]');
  const dec = e.target.closest('[data-action="dec"]');
  if (inc){ const id = inc.dataset.id; state.qty[id] = qtyOf(id) + 1; refresh(); return; }
  if (dec){ const id = dec.dataset.id; state.qty[id] = Math.max(1, qtyOf(id) - 1); refresh(); return; }
}

function onListChange(e){
  const el = e.target;
  if (el.matches('input[data-action="toggle"]')){
    const id = el.dataset.id;
    if (el.checked) state.sel.books.add(id); else state.sel.books.delete(id);
    refresh();
  } else if (el.matches('select[data-action="choice"]')){
    state.choice[el.dataset.id] = Number(el.value);
    refresh();
  }
}

function onAddonChange(e){
  const el = e.target;
  if (el.matches('input[data-addon-toggle]')){
    setAddonAll(el.dataset.addonToggle, el.checked);
    renderAddons(); renderReview();
  } else if (el.matches('input[data-addon-item]')){
    const cat = el.dataset.addonItem, id = el.dataset.id;
    if (el.checked) state.sel[cat].add(id); else state.sel[cat].delete(id);
    renderAddons(); renderReview();
  } else if (el.matches('select[data-action="choice"]')){
    state.choice[el.dataset.id] = Number(el.value);
    refresh();
  }
}

function onAddonClick(e){
  const expand = e.target.closest("[data-addon-expand]");
  if (expand){ const cat = expand.dataset.addonExpand; state.open[cat] = !state.open[cat]; renderAddons(); return; }
  const all = e.target.closest("[data-addon-all]");
  if (all){ setAddonAll(all.dataset.addonAll, true); renderAddons(); renderReview(); return; }
}

function bind(){
  ["list-common","list-group"].forEach(id => {
    const el = document.getElementById(id);
    el.addEventListener("click", onListEvent);
    el.addEventListener("change", onListChange);
  });
  const addons = document.getElementById("addons");
  addons.addEventListener("change", onAddonChange);
  addons.addEventListener("click", onAddonClick);

  document.querySelectorAll('input[name="group"]').forEach(r => {
    r.addEventListener("change", () => {
      state.group = r.value;
      defaultSelectGroup(state.group);
      CATEGORIES.filter(c => !c.base).forEach(c => resetAddonGroup(c.id));
      refresh();
    });
  });

  document.getElementById("select-full-set").addEventListener("click", () => { selectAllBooks(); refresh(); });

  const bar = document.getElementById("bar-cta");
  bar.addEventListener("click", () => {
    document.getElementById("step-address").scrollIntoView({ behavior:"smooth", block:"start" });
    setTimeout(() => document.getElementById("f-name").focus(), 350);
  });
}

/* ---- Validation & submit ---- */
function setError(id, msg){
  const field = document.getElementById(id).closest(".field");
  field.classList.add("has-error");
  let err = field.querySelector(".err");
  if (!err){ err = document.createElement("span"); err.className = "err"; field.appendChild(err); }
  err.textContent = msg;
}
function clearErrors(){
  document.querySelectorAll(".field.has-error").forEach(f => f.classList.remove("has-error"));
}

function validate(){
  clearErrors();
  const name = document.getElementById("f-name").value.trim();
  const phone = document.getElementById("f-phone").value.trim();
  const district = document.getElementById("f-district").value;
  const address = document.getElementById("f-address").value.trim();
  let firstBad = null;

  if (!name){ setError("f-name","নাম লিখুন"); firstBad = firstBad || "f-name"; }
  if (!/^01[3-9]\d{8}$/.test(phone)){ setError("f-phone","সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন 017XXXXXXXX)"); firstBad = firstBad || "f-phone"; }
  if (!district){ setError("f-district","জেলা নির্বাচন করুন"); firstBad = firstBad || "f-district"; }
  if (!address){ setError("f-address","বিস্তারিত ঠিকানা লিখুন"); firstBad = firstBad || "f-address"; }
  return { ok:!firstBad, firstBad };
}

function buildMessage(){
  const t = totals();
  const name = document.getElementById("f-name").value.trim();
  const phone = document.getElementById("f-phone").value.trim();
  const district = document.getElementById("f-district").value;
  const area = document.getElementById("f-area").value.trim();
  const address = document.getElementById("f-address").value.trim();
  const note = document.getElementById("f-note").value.trim();

  const lines = [];
  lines.push("নতুন অর্ডার — এইচএসসি বই ঘর");
  lines.push("");
  lines.push("বিভাগ: " + GROUPS[state.group].name);
  lines.push("");
  t.sections.filter(s => s.items.length).forEach(sec => {
    lines.push(sec.cat.label + ":");
    sec.items.forEach((i, idx) => lines.push(`${toBn(idx+1)}. ${i.label} × ${toBn(i.qty)} — ${money(i.line)}`));
    lines.push("");
  });
  lines.push("সাবটোটাল: " + money(t.subtotal));
  lines.push("ডেলিভারি: " + (t.delivery ? money(t.delivery) : "ফ্রি"));
  lines.push("সর্বমোট (COD): " + money(t.total));
  lines.push("");
  lines.push("নাম: " + name);
  lines.push("মোবাইল: " + phone);
  lines.push("জেলা: " + district);
  if (area) lines.push("এলাকা: " + area);
  lines.push("ঠিকানা: " + address);
  if (note) lines.push("নোট: " + note);
  return lines.join("\n");
}

function submit(e){
  e.preventDefault();
  const status = document.getElementById("form-status");
  const t = totals();
  if (!t.items.length){
    status.className = "form-status bad";
    status.textContent = "অনুগ্রহ করে অন্তত একটি বই নির্বাচন করুন।";
    document.getElementById("step-books").scrollIntoView({ behavior:"smooth", block:"start" });
    return;
  }
  const v = validate();
  if (!v.ok){
    status.className = "form-status bad";
    status.textContent = "কিছু তথ্য অসম্পূর্ণ। লাল চিহ্নিত ঘরগুলো ঠিক করুন।";
    const el = document.getElementById(v.firstBad);
    el.scrollIntoView({ behavior:"smooth", block:"center" });
    el.focus({ preventScroll:true });
    return;
  }
  const url = "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(buildMessage());
  status.className = "form-status ok";
  status.textContent = "WhatsApp খোলা হচ্ছে… সেখানে পাঠিয়ে অর্ডার নিশ্চিত করুন।";
  if (typeof gtag === "function"){
    gtag("event", "place_order", {
      value: t.total,
      currency: "BDT",
      items: t.count,
      group: GROUPS[state.group].name
    });
  }
  window.open(url, "_blank", "noopener");
}

/* ---- Init ---- */
function init(){
  const sel = document.getElementById("f-district");
  Object.entries(DISTRICTS).forEach(([div, list]) => {
    const og = document.createElement("optgroup");
    og.label = div + " বিভাগ";
    list.forEach(d => { const o = document.createElement("option"); o.value = d; o.textContent = d; og.appendChild(o); });
    sel.appendChild(og);
  });

  const supportText = encodeURIComponent("আসসালামু আলাইকুম, HSC বই সম্পর্কে জানতে চাই।");
  const supportUrl = "https://wa.me/" + CONFIG.whatsapp + "?text=" + supportText;
  document.getElementById("header-wa").href = supportUrl;
  document.getElementById("footer-wa").href = supportUrl;

  document.getElementById("faq-delivery").textContent = money(CONFIG.delivery);
  document.getElementById("year").textContent = toBn(new Date().getFullYear());

  defaultSelectGroup(state.group);
  selectCommon();
  refresh();
  bind();
  document.getElementById("order-form").addEventListener("submit", submit);
}

document.addEventListener("DOMContentLoaded", init);
