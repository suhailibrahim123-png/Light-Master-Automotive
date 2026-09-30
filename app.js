"use strict";
const WA = "919544488144";
/* Edit this list to change the catalogue. tier: Good | Better | Best */
const CATALOG = [
  { id: "LM-C01", name: "LM Core H4 LED Bulb", tier: "Good", cat: "Headlight bulb", price: 2499, note: "Plug-and-play, 6000K white, clean cutoff" },
  { id: "LM-C02", name: "LM Core H7 LED Bulb", tier: "Good", cat: "Headlight bulb", price: 2499, note: "Compact driver, fits most hatchbacks and sedans" },
  { id: "LM-P03", name: "LM Pro H11 LED Bulb", tier: "Better", cat: "Headlight bulb", price: 3999, note: "Copper-core cooling, sharper beam focus" },
  { id: "LM-P04", name: "LM Pro 9005/9006 LED Bulb", tier: "Better", cat: "Headlight bulb", price: 3999, note: "High and low beam pair, 2-year warranty" },
  { id: "LM-A05", name: "LM Apex Canbus LED Bulb", tier: "Best", cat: "Headlight bulb", price: 5999, note: "Error-free canbus decoding for German and Korean cars" },
  { id: "LM-P06", name: "LM Bi-LED Projector 3 in", tier: "Better", cat: "Projector", price: 8999, note: "Retrofit projector with sharp low-beam cutoff" },
  { id: "LM-A07", name: "LM Bi-LED Projector 3.5 in Dual Beam", tier: "Best", cat: "Projector", price: 12999, note: "High and low beam in one lens, aligned at fitting" },
  { id: "LM-A08", name: "LM Matrix Bi-LED Headlight Assembly", tier: "Best", cat: "Projector", price: 18999, note: "Vehicle-specific assembly with sequential signature" },
  { id: "LM-C09", name: "LM Fog Lamp LED Set", tier: "Good", cat: "Fog lamp", price: 2999, note: "White or selective yellow, waterproof housing" },
  { id: "LM-P10", name: "LM Fog Lamp Projector", tier: "Better", cat: "Fog lamp", price: 4999, note: "Flat cutoff that cuts through rain and dust" },
  { id: "LM-P11", name: "LM Sequential DRL Strip", tier: "Better", cat: "DRL", price: 3499, note: "Flowing turn signal with daytime white" },
  { id: "LM-A12", name: "LM Switchback DRL", tier: "Best", cat: "DRL", price: 5499, note: "White daytime, amber turn, one harness" },
  { id: "LM-A13", name: "LM Dynamic Tail and Parking Cluster", tier: "Best", cat: "Tail light", price: 14999, note: "Custom cluster with animated brake and indicator" },
  { id: "LM-C14", name: "LM Ambient Interior Kit", tier: "Good", cat: "Interior", price: 3999, note: "64 colours, app and button control, fibre optic" },
  { id: "LM-C15", name: "LM Power Relay and Harness Kit", tier: "Good", cat: "Electrical", price: 1499, note: "Stable voltage, protects bulbs and wiring" }
];
const inr = n => "₹" + n.toLocaleString("en-IN");
const $ = s => document.querySelector(s);

/* Beam pattern selector */
const stage = $("#stage");
if (stage) document.querySelectorAll("[data-beam]").forEach(b => b.addEventListener("click", () => {
  stage.classList.toggle("on", b.dataset.beam === "led");
  document.querySelectorAll("[data-beam]").forEach(x => x.setAttribute("aria-pressed", x === b));
}));

/* Touch-friendly dropdown */
const dd = $(".dd");
if (dd) {
  dd.querySelector("button").addEventListener("click", e => { e.stopPropagation(); dd.classList.toggle("open"); });
  document.addEventListener("click", () => dd.classList.remove("open"));
}

/* Catalogue grid with tier filter */
const cat = $("#cat");
if (cat) {
  const draw = t => {
    cat.innerHTML = CATALOG.filter(p => t === "All" || p.tier === t).map(p =>
      `<article class="card p"><span class="tag${p.tier === "Good" ? " b" : ""}">${p.tier}</span><h3>${p.name}</h3><p>${p.note}</p><div class="pr"><b>${inr(p.price)}</b><a class="btn" href="purchase.html?p=${p.id}">Order</a></div></article>`).join("");
  };
  document.querySelectorAll("[data-tier]").forEach(b => b.addEventListener("click", () => {
    document.querySelectorAll("[data-tier]").forEach(x => x.setAttribute("aria-pressed", x === b));
    draw(b.dataset.tier);
  }));
  draw("All");
}

/* WhatsApp hand-off with popup-blocker fallback */
function sendWA(text) {
  const url = `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
  const fb = $("#fb");
  fb.innerHTML = `Your message is ready. If WhatsApp did not open, <a href="${url}" target="_blank" rel="noopener">tap here to send it on WhatsApp</a>.`;
  fb.style.display = "block";
  const w = window.open(url, "_blank", "noopener");
  if (!w) fb.focus();
}

/* Purchase form */
const pf = $("#pf");
if (pf) {
  const sel = $("#variant"), qty = $("#qty"), est = $("#est");
  sel.innerHTML = CATALOG.map(p => `<option value="${p.id}">${p.name} (${p.tier}) - ${inr(p.price)}</option>`).join("");
  const pre = new URLSearchParams(location.search).get("p");
  if (pre) sel.value = pre;
  const calc = () => { const p = CATALOG.find(x => x.id === sel.value); est.textContent = inr(p.price * Math.max(1, +qty.value || 1)); };
  sel.onchange = qty.oninput = calc; calc();
  pf.addEventListener("submit", e => {
    e.preventDefault();
    const f = new FormData(pf), p = CATALOG.find(x => x.id === f.get("variant"));
    sendWA(["*NEW ORDER - LIGHT MASTER AUTOMOTIVE*", "", `Name: ${f.get("name")}`, `Product: ${p.name} [${p.id}] - ${p.tier}`, `Quantity: ${f.get("qty")}`, `Estimate: ${est.textContent}`, `Vehicle: ${f.get("vehicle")}`, `Delivery address: ${f.get("address")}`, `Contact: ${f.get("phone")}`].join("\n"));
  });
}

/* Warranty form */
const wf = $("#wf");
if (wf) wf.addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(wf), id = "LM-W" + Date.now().toString().slice(-7);
  sendWA(["*WARRANTY CLAIM - LIGHT MASTER AUTOMOTIVE*", `Ticket: ${id}`, "", `Invoice / GST date: ${f.get("invoice")}`, `Customer: ${f.get("name")}`, `Product: ${f.get("product")}`, `Issue: ${f.get("issue")}`].join("\n"));
});
