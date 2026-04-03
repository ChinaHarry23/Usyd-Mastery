/**
 * Flashcards — Shared Engine (SM-2 Spaced Repetition)
 *
 * Set window.FLASHCARD_CONFIG before this script:
 *   window.FLASHCARD_CONFIG = {
 *     courseCode: "comp5270",
 *     numChapters: 12,
 *     totalCards: 120,
 *     progressKey: "comp5270_progress"
 *   };
 *
 * Requires globals: ALL_FLASHCARD_DATA, FLASHCARD_DECK_VERSION, FlashcardSRS
 */
(function () {
"use strict";

var CFG = window.FLASHCARD_CONFIG || {};
var COURSE  = CFG.courseCode   || "fc";
var NUM_CH  = CFG.numChapters  || 6;
var TOTAL_C = CFG.totalCards   || "?";
var PK      = CFG.progressKey  || COURSE + "_progress";

var LANG_KEY = COURSE + "_lang";
var FC_KEY   = COURSE + "_flashcards";
var DECK_VER = typeof FLASHCARD_DECK_VERSION !== "undefined" ? FLASHCARD_DECK_VERSION : "v1";

var lang, langBtn;

function getLang() { try { return localStorage.getItem(LANG_KEY) || "en"; } catch (e) { return "en"; } }
lang = getLang();
langBtn = document.getElementById("langToggle");

/* ── i18n ── */
var T = {
  "lbl-configure": "\u914D\u7F6E\u95EA\u5361",
  "lbl-chapters": "\u7AE0\u8282", "lbl-shuffle": "\u968F\u673A\u6D17\u724C",
  "btnAllCh": "\u5168\u9009", "btnNoneCh": "\u5168\u4E0D\u9009",
  "btnStart": "\u5F00\u59CB\u5B66\u4E60", "btnClearSRS": "\u91CD\u7F6E\u95EA\u5361\u8FDB\u5EA6",
  "empty-title": "\u95F4\u9694\u91CD\u590D\u95EA\u5361",
  "empty-desc": "\u7EA6 <strong>" + TOTAL_C + "</strong> \u5F20\u5361\u7247\uFF0C\u6DB5\u76D6 " + NUM_CH + " \u4E2A\u7AE0\u8282\u3002\u9009\u62E9\u7AE0\u8282\u540E\u70B9\u51FB <strong>\u5F00\u59CB\u5B66\u4E60</strong>\u3002",
  "srs-hint": "SM-2 \u95F4\u9694\u91CD\u590D\uFF1A\u7FFB\u724C\u540E\u5BF9\u638C\u63E1\u7A0B\u5EA6\u6253\u5206\u3002\u4F18\u5148\u663E\u793A\u903E\u671F\u5361\u7247\u3002",
  "rate-label": "\u638C\u63E1\u5F97\u5982\u4F55\uFF1F",
  "again": "\u91CD\u6765", "hard": "\u5403\u529B", "good": "\u4E00\u822C", "easy": "\u7B80\u5355",
  "flip": "\u663E\u793A\u7B54\u6848", "front-label": "\u95EE\u9898", "back-label": "\u7B54\u6848",
  "end-session": "\u7ED3\u675F\u672C\u8F6E",
  "done-title": "\u672C\u8F6E\u5B8C\u6210\uFF01", "done-desc": "\u505A\u5F97\u597D\u3002\u53EF\u5728\u8FDB\u5EA6\u9875\u67E5\u770B\u4E0B\u6B21\u590D\u4E60\u5B89\u6392\u3002",
  "back-filters": "\u8FD4\u56DE\u7B5B\u9009",
  "clear-confirm": "\u786E\u5B9A\u91CD\u7F6E\u6240\u6709\u95EA\u5361\u590D\u4E60\u8FDB\u5EA6\uFF1F",
  "no-cards": "\u5F53\u524D\u7B5B\u9009\u4E0B\u6CA1\u6709\u53EF\u7528\u5361\u7247\u3002"
};

function t(key, fallback) { return lang === "zh" && T[key] ? T[key] : fallback; }

function applyLang() {
  if (langBtn) langBtn.textContent = lang === "en" ? "\u4E2D\u6587" : "EN";
  var map = {
    "lbl-configure": "Configure Deck", "lbl-chapters": "Chapters", "lbl-shuffle": "Shuffle deck",
    "btnAllCh": "All", "btnNoneCh": "None", "btnStart": "Start session", "btnClearSRS": "Reset SRS progress",
    "empty-title": "Spaced-repetition flashcards",
    "empty-desc": "About <strong>" + TOTAL_C + "</strong> cards across " + NUM_CH + " chapters. Pick chapters, then <strong>Start session</strong>.",
    "srs-hint": "SM-2 spaced repetition: flip, recall, rate. Overdue cards shown first."
  };
  Object.keys(map).forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (lang === "zh" && T[id]) { if (!el.dataset.en) el.dataset.en = el.innerHTML; el.innerHTML = T[id]; }
    else if (el.dataset.en) el.innerHTML = el.dataset.en;
  });
  updateDeckStats();
}

if (langBtn) langBtn.addEventListener("click", function () {
  lang = lang === "en" ? "zh" : "en";
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  applyLang(); if (currentIdx >= 0 && queue.length) showCard(currentIdx);
});

function renderMath() {
  if (typeof renderMathInElement === "function") {
    try { renderMathInElement(document.body, { delimiters: [{ left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }], throwOnError: false }); } catch (e) {}
  }
}

/* ── Config panel ── */
var cfgToggle = document.getElementById("configToggle");
var cfgBody = document.getElementById("configBody");
if (cfgToggle) cfgToggle.addEventListener("click", function () { cfgToggle.classList.toggle("open"); cfgBody.classList.toggle("show"); });

/* ── State ── */
var chFilter = {};
for (var i = 1; i <= NUM_CH; i++) chFilter[i] = true;
var shuffleOn = false;

function ensureIds() {
  if (!window.ALL_FLASHCARD_DATA || !ALL_FLASHCARD_DATA.length) return;
  if (ALL_FLASHCARD_DATA[0].id !== undefined) return;
  for (var j = 0; j < ALL_FLASHCARD_DATA.length; j++) ALL_FLASHCARD_DATA[j].id = j;
}

/* ── SRS storage ── */
function loadFC() {
  try { var r = localStorage.getItem(FC_KEY); if (!r) return { v: 1, deckVersion: DECK_VER, cards: {} }; var o = JSON.parse(r); if (!o || typeof o.cards !== "object") return { v: 1, deckVersion: DECK_VER, cards: {} }; if (o.deckVersion !== DECK_VER) return { v: 1, deckVersion: DECK_VER, cards: {} }; return o; } catch (e) { return { v: 1, deckVersion: DECK_VER, cards: {} }; }
}
function saveFC(d) { d.deckVersion = DECK_VER; try { localStorage.setItem(FC_KEY, JSON.stringify(d)); } catch (e) {} }
function getCardState(id) { return loadFC().cards[String(id)] || null; }
function setCardState(id, st) { var d = loadFC(); d.cards[String(id)] = st; saveFC(d); }

function buildFilteredIds() {
  var out = [];
  for (var j = 0; j < ALL_FLASHCARD_DATA.length; j++) { if (chFilter[ALL_FLASHCARD_DATA[j].ch]) out.push(j); }
  return out;
}

function buildQueue() {
  var ids = buildFilteredIds(), now = Date.now(), due = [], fresh = [];
  for (var j = 0; j < ids.length; j++) {
    var st = getCardState(ids[j]);
    if (!st) fresh.push({ id: ids[j], sort: ids[j] });
    else if (st.nextDue <= now) due.push({ id: ids[j], sort: st.nextDue });
  }
  due.sort(function (a, b) { return a.sort - b.sort; });
  fresh.sort(function (a, b) { return a.id - b.id; });
  var q = due.map(function (d) { return d.id; }).concat(fresh.map(function (f) { return f.id; }));
  if (shuffleOn) { for (var s = q.length - 1; s > 0; s--) { var k = Math.floor(Math.random() * (s + 1)); var tmp = q[s]; q[s] = q[k]; q[k] = tmp; } }
  return q;
}

function updateDeckStats() {
  var ids = buildFilteredIds(), now = Date.now(), nDue = 0, nNew = 0;
  for (var j = 0; j < ids.length; j++) { var st = getCardState(ids[j]); if (!st) nNew++; else if (st.nextDue <= now) nDue++; }
  var d = document.getElementById("statDue"), n = document.getElementById("statNew"), tl = document.getElementById("statTotal");
  if (d) d.textContent = nDue; if (n) n.textContent = nNew; if (tl) tl.textContent = ids.length;
  var sum = document.getElementById("cfgSummary");
  if (sum) {
    var sel = 0; for (var c = 1; c <= NUM_CH; c++) if (chFilter[c]) sel++;
    sum.textContent = sel + (lang === "zh" ? " \u7AE0 \u00B7 " : " ch \u00B7 ") + (nDue + nNew) + (lang === "zh" ? " \u5F85\u590D\u4E60" : " to review");
  }
}

/* ── Build chapter chips ── */
function buildChChips() {
  var ctr = document.getElementById("chChips"); if (!ctr) return;
  ctr.querySelectorAll(".ch-chip").forEach(function (c) { c.remove(); });
  for (var ch = 1; ch <= NUM_CH; ch++) {
    var b = document.createElement("button"); b.className = "ch-chip" + (chFilter[ch] ? " active" : ""); b.dataset.ch = ch; b.textContent = "Ch" + ch;
    b.addEventListener("click", function () { var c = parseInt(this.dataset.ch); chFilter[c] = !chFilter[c]; this.classList.toggle("active", chFilter[c]); updateDeckStats(); });
    ctr.appendChild(b);
  }
}

function bindById(id, evt, fn) { var el = document.getElementById(id); if (el) el.addEventListener(evt, fn); }
bindById("btnAllCh", "click", function () { for (var c = 1; c <= NUM_CH; c++) chFilter[c] = true; document.querySelectorAll(".ch-chip").forEach(function (b) { b.classList.add("active"); }); updateDeckStats(); });
bindById("btnNoneCh", "click", function () { for (var c = 1; c <= NUM_CH; c++) chFilter[c] = false; document.querySelectorAll(".ch-chip").forEach(function (b) { b.classList.remove("active"); }); updateDeckStats(); });
bindById("chkShuffle", "change", function () { shuffleOn = this.checked; });

/* ── Session ── */
var queue = [], currentIdx = -1, sessionRated = 0, sessionLen = 0;
var fcArea = document.getElementById("fcArea");
var emptyState = document.getElementById("emptyState");

function showCard(idx) {
  if (idx < 0 || idx >= queue.length) return;
  var id = queue[idx], card = ALL_FLASHCARD_DATA[id];
  var front = getLang() === "zh" ? (card.front_zh || card.front) : card.front;
  var back = getLang() === "zh" ? (card.back_zh || card.back) : card.back;

  var dots = "";
  var max = Math.min(queue.length, 40);
  if (queue.length > 1) {
    dots = '<div class="fc-progress-dots">';
    for (var j = 0; j < max; j++) { var dc = "fc-dot"; if (j === idx) dc += " current"; else if (j < idx) dc += " rated"; dots += '<span class="' + dc + '"></span>'; }
    if (queue.length > max) dots += '<span style="color:var(--text-dim);font-size:0.65rem;margin-left:3px;">+' + (queue.length - max) + '</span>';
    dots += '</div>';
  }

  var html = dots;
  html += '<div class="fc-card-container"><div class="fc-card" id="fcCard">';
  html += '<div class="fc-face fc-front"><div class="fc-badge-row"><span class="fc-badge ch-badge">Ch ' + card.ch + '</span><span class="fc-badge side-badge">' + t("front-label", "Question") + '</span></div><div class="fc-body"><div class="fc-body-inner">' + front + '</div></div><div class="fc-tap-hint">' + t("flip", "Tap to flip") + ' \u2192</div></div>';
  html += '<div class="fc-face fc-back"><div class="fc-badge-row"><span class="fc-badge ch-badge">Ch ' + card.ch + '</span><span class="fc-badge ans-badge">' + t("back-label", "Answer") + '</span></div><div class="fc-body"><div class="fc-body-inner">' + back.replace(/\n/g, "<br>") + '</div></div></div>';
  html += '</div></div>';

  html += '<div class="fc-rating" id="fcRating" style="display:none;">';
  html += '<div class="fc-rate-label">' + t("rate-label", "How well did you know it?") + '</div>';
  html += '<div class="fc-rate-grid">';
  html += '<button class="fc-rate-btn r-again" data-q="0"><span>' + t("again", "Again") + '</span><span class="rate-sub">1m</span></button>';
  html += '<button class="fc-rate-btn r-hard" data-q="1"><span>' + t("hard", "Hard") + '</span><span class="rate-sub">10m</span></button>';
  html += '<button class="fc-rate-btn r-good" data-q="2"><span>' + t("good", "Good") + '</span><span class="rate-sub">1d</span></button>';
  html += '<button class="fc-rate-btn r-easy" data-q="3"><span>' + t("easy", "Easy") + '</span><span class="rate-sub">2d+</span></button>';
  html += '</div></div>';

  html += '<div class="fc-session-bar"><button class="nav-btn" id="btnEndSession">' + t("end-session", "End session") + '</button><span class="fc-counter">' + (idx + 1) + ' / ' + queue.length + '</span><span></span></div>';

  fcArea.innerHTML = html;
  renderMath();

  var fcCard = document.getElementById("fcCard");
  fcCard.addEventListener("click", function () {
    if (!fcCard.classList.contains("flipped")) {
      fcCard.classList.add("flipped");
      var r = document.getElementById("fcRating"); if (r) r.style.display = "block";
    }
  });

  document.querySelectorAll(".fc-rate-btn").forEach(function (b) {
    b.addEventListener("click", function (e) { e.stopPropagation(); rateCard(parseInt(b.dataset.q)); });
  });

  bindById("btnEndSession", "click", endSession);
}

function rateCard(quality) {
  if (currentIdx < 0 || !queue.length) return;
  sessionRated++;
  var id = queue[currentIdx];
  var prev = getCardState(id) || { ef: 2.5, reps: 0, intervalDays: 0, nextDue: null };
  setCardState(id, FlashcardSRS.schedule(prev, quality));
  currentIdx++;
  if (currentIdx >= queue.length) { finishSession(); return; }
  showCard(currentIdx);
}

function finishSession() {
  recordSession(true);
  fcArea.innerHTML = '<div class="fc-done"><h2>' + t("done-title", "Session complete!") + '</h2><p>' + t("done-desc", "Nice work. Check the Progress page for your review schedule.") + '</p><p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:1rem;">' + sessionRated + ' cards rated</p><button class="btn btn-primary" id="btnBackFilters">' + t("back-filters", "Back to filters") + '</button></div>';
  bindById("btnBackFilters", "click", endSession);
  updateDeckStats();
}

function endSession() {
  if (sessionRated > 0 && currentIdx < queue.length) recordSession(false);
  sessionRated = 0; sessionLen = 0; queue = []; currentIdx = -1;
  fcArea.innerHTML = ""; fcArea.style.display = "none";
  if (emptyState) emptyState.style.display = "";
  if (cfgToggle) { cfgToggle.classList.add("open"); cfgBody.classList.add("show"); }
  updateDeckStats();
}

function recordSession(completed) {
  try {
    var p = JSON.parse(localStorage.getItem(PK) || "{}");
    if (!p.flashcardHistory) p.flashcardHistory = [];
    var d = new Date(), pad = function (n) { return n < 10 ? "0" + n : "" + n; };
    var ds = d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    var chs = []; for (var c = 1; c <= NUM_CH; c++) if (chFilter[c]) chs.push(c);
    p.flashcardHistory.push({ date: ds, scope: "Flashcards: Ch" + chs.join(","), cardsRated: sessionRated, deckSize: sessionLen, completed: completed });
    if (p.flashcardHistory.length > 100) p.flashcardHistory = p.flashcardHistory.slice(-100);
    localStorage.setItem(PK, JSON.stringify(p));
  } catch (e) {}
}

function startSession() {
  ensureIds();
  queue = buildQueue();
  if (!queue.length) { alert(t("no-cards", "No cards match your filters.")); return; }
  sessionRated = 0; sessionLen = queue.length; currentIdx = 0;
  if (emptyState) emptyState.style.display = "none";
  fcArea.style.display = "block";
  if (cfgToggle) { cfgToggle.classList.remove("open"); cfgBody.classList.remove("show"); }
  showCard(0); updateDeckStats();
}

bindById("btnStart", "click", startSession);
bindById("btnClearSRS", "click", function () {
  if (!confirm(t("clear-confirm", "Reset all flashcard scheduling data?"))) return;
  try { localStorage.removeItem(FC_KEY); } catch (e) {}
  updateDeckStats();
});

/* Keyboard shortcuts */
document.addEventListener("keydown", function (e) {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || currentIdx < 0) return;
  var fcCard = document.getElementById("fcCard");
  if (e.key === " " || e.key === "Enter") { e.preventDefault(); if (fcCard && !fcCard.classList.contains("flipped")) { fcCard.click(); } }
  else if (e.key >= "1" && e.key <= "4" && fcCard && fcCard.classList.contains("flipped")) { rateCard(parseInt(e.key) - 1); }
});

/* URL params */
var params = new URLSearchParams(location.search);
if (params.has("ch")) {
  var pch = params.get("ch").split(",").map(Number);
  for (var c = 1; c <= NUM_CH; c++) chFilter[c] = pch.indexOf(c) >= 0;
}

ensureIds(); buildChChips(); applyLang(); updateDeckStats();

if (params.get("start") === "1") { setTimeout(startSession, 300); }

window.addEventListener("load", function () { setTimeout(renderMath, 500); });
})();
