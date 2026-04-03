/**
 * Quiz Hub — Shared Engine
 *
 * Usage: set window.QUIZ_CONFIG before this script loads:
 *   window.QUIZ_CONFIG = {
 *     courseCode: "comp5270",
 *     numChapters: 12,
 *     chapterNames: { 1: "Randomness", 2: "Bounds", ... },
 *     totalQuestions: 200,          // for display text only
 *     progressKey: "comp5270_progress",
 *     theme: { accent: "#6c8cff" } // optional CSS overrides
 *   };
 *
 * Requires: ALL_QUIZ_DATA global (from quiz-data-extract.js)
 */
(function () {
"use strict";

var CFG = window.QUIZ_CONFIG || {};
var COURSE   = CFG.courseCode    || "quiz";
var NUM_CH   = CFG.numChapters   || 6;
var CHNAMES  = CFG.chapterNames  || {};
var TOTAL_Q  = CFG.totalQuestions || "?";
var PK       = CFG.progressKey   || COURSE + "_progress";

var LANG_KEY        = COURSE + "_lang";
var MISSED_STACK_KEY = COURSE + "_quiz_missed_stack";

if (CFG.theme) {
  var r = document.documentElement.style;
  if (CFG.theme.accent) r.setProperty("--accent", CFG.theme.accent);
}

var lang = localStorage.getItem(LANG_KEY) || "en";
var langBtn = document.getElementById("langToggle");

var T = {
  "lbl-configure": "\u914D\u7F6E\u6D4B\u9A8C",
  "lbl-chapters": "\u7AE0\u8282", "lbl-type": "\u9898\u578B", "lbl-mode": "\u6A21\u5F0F",
  "lbl-shuffle": "\u968F\u673A\u6392\u5E8F", "lbl-score": "\u5F97\u5206",
  "btnTypeAll": "\u5168\u90E8", "btnTypeStudy": "\u5B66\u4E60", "btnTypeMath": "\u6570\u5B66",
  "btnPractice": "\u7EC3\u4E60", "btnExam": "\u8003\u8BD5",
  "btnStart": "\u5F00\u59CB\u6D4B\u9A8C", "btnReset": "\u91CD\u7F6E",
  "btnAllCh": "\u5168\u9009", "btnNoneCh": "\u5168\u4E0D\u9009",
  "empty-title": "\u51C6\u5907\u597D\u6D4B\u8BD5\u4E86\u5417\uFF1F",
  "empty-desc": "\u5728\u4E0A\u65B9\u914D\u7F6E\u6D4B\u9A8C\uFF0C\u7136\u540E\u70B9\u51FB<strong>\u5F00\u59CB\u6D4B\u9A8C</strong>\u3002\u5171 " + TOTAL_Q + " \u9053\u9898\u76EE\uFF0C\u6DB5\u76D6 " + NUM_CH + " \u4E2A\u7AE0\u8282\u3002",
  "prev": "\u4E0A\u4E00\u9898", "next": "\u4E0B\u4E00\u9898", "submit": "\u63D0\u4EA4\u5168\u90E8",
  "result-title": "\u6D4B\u9A8C\u7ED3\u679C", "breakdown": "\u7AE0\u8282\u660E\u7EC6",
  "correct-label": "\u6B63\u786E\uFF01", "wrong-label": "\u9519\u8BEF\u3002",
  "pct-correct": "\u6B63\u786E\u7387",
  "lbl-only-missed": "\u4EC5\u9519\u9898",
  "lbl-missed-title": "\u9519\u9898\u6808",
  "lbl-missed-in-stack": "\u9053\u5728\u6808\u4E2D",
  "missed-hint": "\u7B54\u9519\u7684\u9898\u76EE\u5165\u6808\u3002\u8FDE\u7EED\u7B54\u5BF9\u4E24\u6B21\u79FB\u9664\uFF1B\u518D\u7B54\u9519\u91CD\u7F6E\u3002",
  "btnReviewMissed": "\u590D\u4E60\u9519\u9898",
  "btnClearMissed": "\u6E05\u7A7A",
  "clear-missed-confirm": "\u786E\u5B9A\u6E05\u7A7A\u6240\u6709\u9519\u9898\u8BB0\u5F55\uFF1F",
  "empty-missed": "\u6CA1\u6709\u9519\u9898\uFF0C\u6216\u7B5B\u9009\u6761\u4EF6\u4E0B\u6CA1\u6709\u53EF\u590D\u4E60\u7684\u9519\u9898\u3002"
};

function applyLang() {
  if (langBtn) langBtn.textContent = lang === "en" ? "\u4E2D\u6587" : "EN";
  if (lang === "zh") {
    Object.keys(T).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { if (!el.dataset.en) el.dataset.en = el.innerHTML; el.innerHTML = T[id]; }
    });
  } else {
    Object.keys(T).forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.dataset.en) el.innerHTML = el.dataset.en;
    });
  }
  updateMissedBadge();
  updateConfigSummary();
}

if (langBtn) langBtn.addEventListener("click", function () {
  lang = lang === "en" ? "zh" : "en";
  localStorage.setItem(LANG_KEY, lang);
  applyLang(); renderMath();
});

function renderMath() {
  if (typeof renderMathInElement === "function") {
    try { renderMathInElement(document.body, { delimiters: [{ left: "\\[", right: "\\]", display: true }, { left: "\\(", right: "\\)", display: false }], throwOnError: false }); } catch (e) {}
  }
}

/* Config toggle */
var cfgToggle = document.getElementById("configToggle");
var cfgBody   = document.getElementById("configBody");
if (cfgToggle) cfgToggle.addEventListener("click", function () {
  cfgToggle.classList.toggle("open");
  cfgBody.classList.toggle("show");
});

/* State */
var chFilter = {};
for (var i = 1; i <= NUM_CH; i++) chFilter[i] = true;
var typeFilter = "all", mode = "practice", shuffleOn = false, reviewMissedOnly = false;
var activeQuestions = [], currentIdx = 0, answers = {}, submitted = false;

function ensureQuestionIds() {
  if (!window.ALL_QUIZ_DATA || !ALL_QUIZ_DATA.length) return;
  if (ALL_QUIZ_DATA[0].id !== undefined) return;
  for (var j = 0; j < ALL_QUIZ_DATA.length; j++) ALL_QUIZ_DATA[j].id = j;
}

/* Missed-stack helpers */
function getMissedMap() { try { var r = localStorage.getItem(MISSED_STACK_KEY); if (!r) return {}; var o = JSON.parse(r); return typeof o === "object" && o !== null ? o : {}; } catch (e) { return {}; } }
function saveMissedMap(m) { try { localStorage.setItem(MISSED_STACK_KEY, JSON.stringify(m)); } catch (e) {} }
function recordAnswerResult(qId, isCorrect) {
  if (qId === undefined || qId === null) return;
  var key = String(qId), m = getMissedMap();
  if (isCorrect) { if (m[key] !== undefined) { m[key]++; if (m[key] >= 2) delete m[key]; } } else { m[key] = 0; }
  saveMissedMap(m); updateMissedBadge();
}
function updateMissedBadge() {
  var n = Object.keys(getMissedMap()).length;
  var el = document.getElementById("missedCount"), el2 = document.getElementById("missedDisplay"), btn = document.getElementById("btnReviewMissed");
  if (el) el.textContent = n; if (el2) el2.textContent = n; if (btn) btn.disabled = n === 0;
}
function clearMissedStack() { localStorage.removeItem(MISSED_STACK_KEY); updateMissedBadge(); }

/* Build chapter chips */
function buildChChips() {
  var container = document.getElementById("chChips"); if (!container) return;
  container.querySelectorAll(".ch-chip").forEach(function (c) { c.remove(); });
  for (var ch = 1; ch <= NUM_CH; ch++) {
    var b = document.createElement("button");
    b.className = "ch-chip" + (chFilter[ch] ? " active" : "");
    b.dataset.ch = ch; b.textContent = "Ch" + ch;
    b.addEventListener("click", function () {
      var c = parseInt(this.dataset.ch); chFilter[c] = !chFilter[c];
      this.classList.toggle("active", chFilter[c]); updateConfigSummary();
    });
    container.appendChild(b);
  }
}

function bindById(id, evt, fn) { var el = document.getElementById(id); if (el) el.addEventListener(evt, fn); }

bindById("btnAllCh", "click", function () { for (var c = 1; c <= NUM_CH; c++) chFilter[c] = true; document.querySelectorAll(".ch-chip").forEach(function (b) { b.classList.add("active"); }); updateConfigSummary(); });
bindById("btnNoneCh", "click", function () { for (var c = 1; c <= NUM_CH; c++) chFilter[c] = false; document.querySelectorAll(".ch-chip").forEach(function (b) { b.classList.remove("active"); }); updateConfigSummary(); });

document.querySelectorAll("#typeFilters .seg-btn").forEach(function (b) {
  b.addEventListener("click", function () { document.querySelectorAll("#typeFilters .seg-btn").forEach(function (x) { x.classList.remove("active"); }); b.classList.add("active"); typeFilter = b.dataset.type; updateConfigSummary(); });
});
document.querySelectorAll("[data-mode]").forEach(function (b) {
  b.addEventListener("click", function () { document.querySelectorAll("[data-mode]").forEach(function (x) { x.classList.remove("active"); }); b.classList.add("active"); mode = b.dataset.mode; updateConfigSummary(); });
});

bindById("chkShuffle", "change", function () { shuffleOn = this.checked; });
bindById("chkOnlyMissed", "change", function () { reviewMissedOnly = this.checked; });
bindById("btnReviewMissed", "click", function () {
  if (Object.keys(getMissedMap()).length === 0) return;
  reviewMissedOnly = true; var chk = document.getElementById("chkOnlyMissed"); if (chk) chk.checked = true; startQuiz();
});
bindById("btnClearMissed", "click", function () {
  if (!confirm(lang === "zh" ? T["clear-missed-confirm"] : "Clear all missed-question records?")) return; clearMissedStack();
});

function updateConfigSummary() {
  var n = 0; for (var c = 1; c <= NUM_CH; c++) if (chFilter[c]) n++;
  var tl = typeFilter === "all" ? "All types" : typeFilter === "study" ? "Study" : "Math";
  var ml = mode === "practice" ? "Practice" : "Exam";
  if (lang === "zh") { tl = typeFilter === "all" ? "\u5168\u90E8\u9898\u578B" : typeFilter === "study" ? "\u5B66\u4E60" : "\u6570\u5B66"; ml = mode === "practice" ? "\u7EC3\u4E60" : "\u8003\u8BD5"; }
  var el = document.getElementById("cfgSummary");
  if (el) el.textContent = n + (lang === "zh" ? " \u7AE0 \u00B7 " : " ch \u00B7 ") + tl + " \u00B7 " + ml;
}

function shuffle(arr) { for (var j = arr.length - 1; j > 0; j--) { var k = Math.floor(Math.random() * (j + 1)); var t = arr[j]; arr[j] = arr[k]; arr[k] = t; } return arr; }

function filterQuestions() {
  var missed = getMissedMap();
  return ALL_QUIZ_DATA.filter(function (q) {
    if (!chFilter[q.ch]) return false;
    if (typeFilter !== "all" && q.type !== typeFilter) return false;
    if (reviewMissedOnly && missed[String(q.id)] === undefined) return false;
    return true;
  });
}

function qText(q) { return lang === "zh" && q.q_zh ? q.q_zh : q.q; }
function qOpts(q) { return lang === "zh" && q.opts_zh ? q.opts_zh : q.opts; }
function qExp(q)  { return lang === "zh" && q.exp_zh ? q.exp_zh : q.exp; }

function updateScore() {
  var total = activeQuestions.length, correct = 0;
  Object.keys(answers).forEach(function (k) { if (answers[k] === activeQuestions[parseInt(k)].answer) correct++; });
  var sd = document.getElementById("scoreDisplay"), pd = document.getElementById("pctDisplay");
  if (sd) sd.textContent = correct + " / " + total;
  if (pd) pd.textContent = (total > 0 ? Math.round(correct / total * 100) : 0) + "%";
}

var LETTERS = ["A", "B", "C", "D", "E", "F"];

function renderQuizCard(q, idx, showFeedback) {
  var answered = idx in answers, selected = answers[idx], isCorrect = answered && selected === q.answer;
  var opts = qOpts(q);
  var h = '<div class="quiz-card' + (answered ? (isCorrect ? ' answered-correct' : ' answered-wrong') : '') + '" id="qcard-' + idx + '">';
  h += '<div class="q-header"><span class="q-badge num">Q' + (idx + 1) + '</span><span class="q-badge ' + q.type + '">' + (q.type === "study" ? "Study" : "Math") + '</span><span class="q-chapter-tag">Ch' + q.ch + ' \u00B7 ' + (CHNAMES[q.ch] || '') + '</span></div>';
  h += '<div class="q-text">' + qText(q) + '</div><div class="q-options">';
  for (var oi = 0; oi < opts.length; oi++) {
    var cls = "q-opt"; if (answered) { cls += " locked"; if (oi === q.answer) cls += " correct"; else if (oi === selected) cls += " wrong"; }
    h += '<button class="' + cls + '" data-qi="' + idx + '" data-oi="' + oi + '"><span class="opt-letter">' + LETTERS[oi] + '</span><span>' + opts[oi] + '</span></button>';
  }
  h += '</div>';
  if (showFeedback && answered) {
    var fc = isCorrect ? "correct-fb" : "wrong-fb", pre = isCorrect ? (lang === "zh" ? "\u2713 " + T["correct-label"] : "\u2713 Correct!") : (lang === "zh" ? "\u2717 " + T["wrong-label"] : "\u2717 Incorrect.");
    h += '<div class="q-feedback show ' + fc + '"><strong>' + pre + '</strong> ' + qExp(q) + '</div>';
  } else { h += '<div class="q-feedback" id="fb-' + idx + '"></div>'; }
  return h + '</div>';
}

function handleOptClick(qi, oi) {
  if (qi in answers) return;
  answers[qi] = oi;
  var q = activeQuestions[qi], isCorrect = oi === q.answer;
  var card = document.getElementById("qcard-" + qi);
  if (card) { card.className = "quiz-card " + (isCorrect ? "answered-correct" : "answered-wrong"); card.querySelectorAll(".q-opt").forEach(function (b) { b.classList.add("locked"); var boi = parseInt(b.dataset.oi); if (boi === q.answer) b.classList.add("correct"); else if (boi === oi) b.classList.add("wrong"); }); }
  if (mode === "practice") {
    var fb = document.getElementById("fb-" + qi);
    if (fb) { fb.innerHTML = "<strong>" + (isCorrect ? (lang === "zh" ? "\u2713 " + T["correct-label"] : "\u2713 Correct!") : (lang === "zh" ? "\u2717 " + T["wrong-label"] : "\u2717 Incorrect.")) + "</strong> " + qExp(q); fb.className = "q-feedback show " + (isCorrect ? "correct-fb" : "wrong-fb"); renderMath(); }
  }
  updateScore();
  if (mode !== "exam") recordAnswerResult(q.id, isCorrect);
}

function buildDots() {
  var max = Math.min(activeQuestions.length, 50); if (activeQuestions.length <= 1) return '';
  var h = '<span class="q-dots">';
  for (var j = 0; j < max; j++) { var c = "q-dot"; if (j === currentIdx) c += " current"; else if (j in answers) c += (answers[j] === activeQuestions[j].answer ? " answered-ok" : " answered-bad"); h += '<span class="' + c + '"></span>'; }
  if (activeQuestions.length > max) h += '<span style="color:var(--text-dim);font-size:0.7rem;margin-left:2px;">+' + (activeQuestions.length - max) + '</span>';
  return h + '</span>';
}

function renderPractice() {
  var ctr = document.getElementById("quizContainer"), q = activeQuestions[currentIdx];
  var h = '<div class="practice-nav"><button class="nav-btn" id="btnPrev"' + (currentIdx === 0 ? ' disabled' : '') + '>\u2190 ' + (lang === "zh" ? T.prev : "Prev") + '</button><div class="practice-counter">' + buildDots() + '</div><button class="nav-btn" id="btnNext"' + (currentIdx === activeQuestions.length - 1 ? ' disabled' : '') + '>' + (lang === "zh" ? T.next : "Next") + ' \u2192</button></div>';
  h += renderQuizCard(q, currentIdx, true);
  ctr.innerHTML = h; renderMath(); bindOptClicks();
  bindById("btnPrev", "click", function () { if (currentIdx > 0) { currentIdx--; renderPractice(); } });
  bindById("btnNext", "click", function () { if (currentIdx < activeQuestions.length - 1) { currentIdx++; renderPractice(); } });
}

function renderExam() {
  var ctr = document.getElementById("quizContainer"), h = "";
  for (var j = 0; j < activeQuestions.length; j++) h += renderQuizCard(activeQuestions[j], j, submitted);
  if (!submitted) h += '<div style="text-align:center;margin:2rem 0;"><button class="btn btn-primary" id="btnSubmitExam" style="padding:0.85rem 3rem;font-size:1rem;">' + (lang === "zh" ? T.submit : "Submit All") + '</button></div>';
  ctr.innerHTML = h; renderMath(); bindOptClicks();
  bindById("btnSubmitExam", "click", submitExam);
}

function submitExam() {
  submitted = true;
  for (var j = 0; j < activeQuestions.length; j++) { if (!(j in answers)) answers[j] = -1; }
  if (mode === "exam") { for (var k = 0; k < activeQuestions.length; k++) { var sel = answers[k], qk = activeQuestions[k]; if (sel === -1 || sel === undefined) continue; recordAnswerResult(qk.id, sel === qk.answer); } }
  renderExam(); showResults(); updateScore(); saveQuizToProgress();
}

function saveQuizToProgress() {
  try {
    var p = JSON.parse(localStorage.getItem(PK) || "{}"); if (!p.quizHistory) p.quizHistory = [];
    var total = activeQuestions.length, correct = 0;
    activeQuestions.forEach(function (q, j) { if (answers[j] === q.answer) correct++; });
    var pct = total > 0 ? Math.round(correct / total * 100) : 0;
    var d = new Date(), ds = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    var chs = {}; activeQuestions.forEach(function (q) { chs[q.ch] = true; });
    var scope = "Quiz Hub: Ch" + Object.keys(chs).sort(function (a, b) { return a - b; }).join(",");
    p.quizHistory.push({ date: ds, scope: scope, correct: correct, total: total, pct: pct });
    if (p.quizHistory.length > 100) p.quizHistory = p.quizHistory.slice(-100);
    var cs = {}; activeQuestions.forEach(function (q, j) { var c = String(q.ch); if (!cs[c]) cs[c] = { t: 0, c: 0 }; cs[c].t++; if (answers[j] === q.answer) cs[c].c++; });
    var cbd = {};
    Object.keys(cs).forEach(function (ch) { var s = cs[ch]; var pc = s.t > 0 ? Math.round(s.c / s.t * 100) : 0; cbd[ch] = pc; var ck = "ch" + ch; if (!p[ck]) p[ck] = {}; if (!p[ck].quizBest || pc > p[ck].quizBest) p[ck].quizBest = pc; });
    p.quizHistory[p.quizHistory.length - 1].chBreakdown = cbd;
    localStorage.setItem(PK, JSON.stringify(p));
  } catch (e) {}
}

function showResults() {
  var rc = document.getElementById("resultsContainer"), total = activeQuestions.length, correct = 0, cs = {};
  activeQuestions.forEach(function (q, j) { if (!cs[q.ch]) cs[q.ch] = { t: 0, c: 0 }; cs[q.ch].t++; if (answers[j] === q.answer) { correct++; cs[q.ch].c++; } });
  var pct = total > 0 ? Math.round(correct / total * 100) : 0, cls = pct >= 80 ? "good" : pct >= 50 ? "ok" : "bad";
  var h = '<div class="results-summary ' + cls + '"><h2>' + (lang === "zh" ? T["result-title"] : "Quiz Results") + '</h2><div class="big-score ' + cls + '">' + pct + '%</div><div class="results-sub">' + correct + ' / ' + total + '</div>';
  h += '<h3 style="margin-top:2rem;font-size:0.72rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-dim);">' + (lang === "zh" ? T.breakdown : "Chapter Breakdown") + '</h3><div class="chapter-breakdown">';
  Object.keys(cs).sort(function (a, b) { return a - b; }).forEach(function (ch) { var s = cs[ch], p = s.t > 0 ? Math.round(s.c / s.t * 100) : 0; h += '<div class="ch-score"><div class="ch-label">Ch' + ch + '</div><div class="ch-val" style="color:' + (p >= 80 ? 'var(--green)' : p >= 50 ? 'var(--yellow)' : 'var(--red)') + ';">' + s.c + '/' + s.t + '</div></div>'; });
  h += '</div></div>';
  rc.innerHTML = h; rc.style.display = "block"; rc.scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindOptClicks() { document.querySelectorAll(".q-opt:not(.locked)").forEach(function (b) { b.addEventListener("click", function () { handleOptClick(parseInt(b.dataset.qi), parseInt(b.dataset.oi)); }); }); }

function startQuiz() {
  var chkM = document.getElementById("chkOnlyMissed"); reviewMissedOnly = chkM ? chkM.checked : false;
  activeQuestions = filterQuestions(); if (shuffleOn) shuffle(activeQuestions);
  if (activeQuestions.length === 0) {
    var msg = lang === "zh" ? (reviewMissedOnly ? T["empty-missed"] : "\u8BF7\u81F3\u5C11\u9009\u62E9\u4E00\u4E2A\u7AE0\u8282") : (reviewMissedOnly ? "No missed questions match your filters." : "Select at least one chapter.");
    document.getElementById("quizContainer").innerHTML = '<div class="empty-hero"><span class="empty-icon">\uD83D\uDD0D</span><h2>' + (lang === "zh" ? "\u6CA1\u6709\u9898\u76EE" : "No Questions") + '</h2><p>' + msg + '</p></div>';
    document.getElementById("quizContainer").style.display = "block"; document.getElementById("emptyState").style.display = "none"; return;
  }
  currentIdx = 0; answers = {}; submitted = false;
  document.getElementById("emptyState").style.display = "none";
  document.getElementById("quizContainer").style.display = "block";
  document.getElementById("resultsContainer").style.display = "none";
  if (cfgToggle) { cfgToggle.classList.remove("open"); cfgBody.classList.remove("show"); }
  updateScore();
  if (mode === "practice") renderPractice(); else renderExam();
  document.getElementById("quizContainer").scrollIntoView({ behavior: "smooth", block: "start" });
}

bindById("btnStart", "click", startQuiz);
bindById("btnReset", "click", function () {
  answers = {}; submitted = false; currentIdx = 0; reviewMissedOnly = false;
  var chkM = document.getElementById("chkOnlyMissed"); if (chkM) chkM.checked = false;
  document.getElementById("quizContainer").style.display = "none";
  document.getElementById("resultsContainer").style.display = "none";
  document.getElementById("emptyState").style.display = "block";
  if (cfgToggle) { cfgToggle.classList.add("open"); cfgBody.classList.add("show"); }
  updateScore();
});

document.addEventListener("keydown", function (e) {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  if (mode !== "practice" || activeQuestions.length === 0) return;
  if (e.key === "ArrowLeft" && currentIdx > 0) { currentIdx--; renderPractice(); }
  else if (e.key === "ArrowRight" && currentIdx < activeQuestions.length - 1) { currentIdx++; renderPractice(); }
  else if (e.key >= "1" && e.key <= "4") { var oi = parseInt(e.key) - 1; if (oi < (qOpts(activeQuestions[currentIdx]) || []).length) handleOptClick(currentIdx, oi); }
});

var params = new URLSearchParams(location.search);
if (params.has("ch")) { var pch = params.get("ch").split(",").map(Number); for (var c = 1; c <= NUM_CH; c++) chFilter[c] = pch.indexOf(c) >= 0; }
if (params.has("type")) typeFilter = params.get("type");

ensureQuestionIds(); buildChChips(); applyLang(); updateScore(); updateConfigSummary();
window.addEventListener("load", function () { setTimeout(renderMath, 500); });
})();
