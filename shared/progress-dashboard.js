/**
 * Shared Progress Dashboard Engine
 * Reads configuration from window.DASHBOARD_CONFIG
 *
 * Required config fields:
 *   numChapters, chapterNames, chapterNamesZh, chapterColors,
 *   totalSections, totalQC, totalTutorials,
 *   progressKey, flashcardsKey, langKey
 *
 * Optional config fields:
 *   weights            — { sections, qc, quiz, tutorials } (defaults 0.20/0.25/0.25/0.30)
 *   titleEn, titleZh   — update document.title on lang change
 *   weightHintEn/Zh    — override weight-hint paragraph text
 *   chapterShort(ch, lang)    — custom chapter abbreviation (default "Ch N")
 *   translateScope(scope, lang) — custom scope translation for history tables
 *   extraTranslationsZh — object merged into T_ZH for additional element translations
 */
(function() {
"use strict";

var C = window.DASHBOARD_CONFIG;
if (!C) { console.error("DASHBOARD_CONFIG not set"); return; }

var LANG_KEY     = C.langKey;
var PROGRESS_KEY = C.progressKey;
var FC_KEY       = C.flashcardsKey;
var FC_DECK_VERSION = typeof FLASHCARD_DECK_VERSION !== "undefined" ? FLASHCARD_DECK_VERSION : "sg1";

var NUM_CH          = C.numChapters;
var CHNAMES         = C.chapterNames;
var CHNAMES_ZH      = C.chapterNamesZh;
var CHCOLORS        = C.chapterColors;
var manifest        = window.CHAPTER_MANIFEST || {};
var TOTAL_SECTIONS  = C.totalSections  || manifest.sections  || {};
var TOTAL_QC        = C.totalQC        || manifest.checks    || {};
var TOTAL_TUTORIAL  = C.totalTutorials || manifest.tutorials || {};
var W = C.weights || { sections: 0.20, qc: 0.25, quiz: 0.25, tutorials: 0.30 };

var lang = localStorage.getItem(LANG_KEY) || "en";
var btn  = document.getElementById("langToggle");

function chapterShort(ch) {
  if (C.chapterShort) return C.chapterShort(ch, lang);
  return "Ch " + ch;
}

function translateScope(scope) {
  if (C.translateScope) return C.translateScope(scope, lang);
  return scope;
}

/* ── translations ─────────────────────────────────────────── */

var T_ZH = {
  "lbl-sections": "\u5df2\u8bbf\u95ee\u7ae0\u8282",
  "lbl-quizzes": "\u6d4b\u9a8c\u6b21\u6570",
  "lbl-avg": "\u5e73\u5747\u6d4b\u9a8c\u5206\u6570",
  "lbl-qc": "\u5feb\u901f\u68c0\u67e5\u5b8c\u6210",
  "lbl-tutorials": "\u6559\u7a0b\u9898\u81ea\u8bc4\uff08\u7406\u89e3\u89e3\u7b54\uff09",
  "title-chapters": "\u7ae0\u8282\u8fdb\u5ea6",
  "title-history": "\u6d4b\u9a8c\u5386\u53f2",
  "th-date": "\u65e5\u671f",
  "th-scope": "\u8303\u56f4",
  "th-questions": "\u9898\u6570",
  "th-score": "\u5f97\u5206",
  "no-history": "\u8fd8\u6ca1\u6709\u6d4b\u9a8c\u8bb0\u5f55\u3002\u8bd5\u8bd5<a href=\"quiz-hub.html\" style=\"color:var(--accent);\">\u6d4b\u9a8c\u4e2d\u5fc3</a>\uff01",
  "btn-start-quiz": "&#x1F4DD; \u5f00\u59cb\u6d4b\u9a8c",
  "btn-reset": "&#x1F5D1; \u91cd\u7f6e\u6240\u6709\u8fdb\u5ea6",
  "sections": "\u7ae0\u8282",
  "quizScore": "\u6d4b\u9a8c",
  "quickChecks": "\u5feb\u901f\u68c0\u67e5",
  "tutorials": "\u6559\u7a0b\u9898",
  "weightHint": C.weightHintZh || "\u603b\u5206\uff1a\u7ae0\u8282\u9605\u8bfb 20% + \u6570\u5b66\u5feb\u901f\u68c0\u67e5 25% + \u7ae0\u8282\u6d4b\u9a8c\u6700\u9ad8\u5206 25% + \u6559\u7a0b\u9898\u81ea\u8bc4 30%\uff08\u6bcf\u9053\u9898\u67e5\u770b\u89e3\u7b54\u540e\u786e\u8ba4\uff1b\u6bcf\u7ae0\u4e0a\u9650 100%\uff09\u3002",
  "title-flash": "\u95ea\u5361\u590d\u4e60\u5b89\u6392",
  "th-fl-date": "\u65f6\u95f4",
  "th-fl-n": "\u5361\u7247\u6570",
  "th-fl-ch": "\u7ae0\u8282\uff08\u9884\u89c8\uff09",
  "flashHint": "\u81ea\u8bc4\uff08\u91cd\u6765/\u5403\u529b/\u4e00\u822c/\u7b80\u5355\uff09\u4f1a\u6309\u95f4\u9694\u91cd\u590d\u66f2\u7ebf\u6392\u671f\u3002\u6253\u5f00\u95ea\u5361\u9875\u5b66\u4e60\u5df2\u5230\u671f\u4e0e\u65b0\u5361\u3002",
  "flash-due-now": "\u5df2\u5230\u671f",
  "flash-later-today": "\u4eca\u65e5\u5185\u5f85\u5230",
  "flash-new": "\u672a\u5b66\u8fc7\uff08\u65b0\u5361\uff09",
  "flash-upcoming": "\u672a\u6765 14 \u5929",
  "flash-when-now": "\u73b0\u5728",
  "flash-empty": "\u6682\u65e0\u6392\u671f\u6570\u636e\u3002\u5728\u95ea\u5361\u9875\u5b66\u4e60\u540e\u6b64\u5904\u4f1a\u663e\u793a\u4e0b\u6b21\u590d\u4e60\u65f6\u95f4\u3002",
  "btn-open-fc": "\uD83D\uDCE6 \u6253\u5f00\u95ea\u5361",
  "title-fc-history": "\u95ea\u5361\u5b66\u4e60\u8bb0\u5f55",
  "th-fch-date": "\u65e5\u671f",
  "th-fch-scope": "\u8303\u56f4",
  "th-fch-cards": "\u5df2\u8bc4\u5206\u5361\u7247",
  "th-fch-done": "\u5b8c\u6210",
  "no-fc-history": "\u6682\u65e0\u95ea\u5361\u8bb0\u5f55\u3002\u4ece\u7ae0\u8282\u5b66\u4e60\u6307\u5357\u6216\u95ea\u5361\u9875\u5f00\u59cb\u5373\u53ef\u3002",
  "title-quiz-trend": "\u6d4b\u9a8c\u6210\u7ee9\u8d8b\u52bf",
  "quizTrendEmpty": "\u6682\u65e0\u6d4b\u9a8c\u8bb0\u5f55\u3002\u8bd5\u8bd5<a href=\"quiz-hub.html\" style=\"color:var(--accent);\">\u6d4b\u9a8c\u4e2d\u5fc3</a>\uff01",
  "title-heatmap": "\u6d3b\u52a8\u70ed\u529b\u56fe\uff08\u8fd15\u5468\uff09"
};

if (C.extraTranslationsZh) {
  for (var ek in C.extraTranslationsZh) {
    if (Object.prototype.hasOwnProperty.call(C.extraTranslationsZh, ek)) {
      T_ZH[ek] = C.extraTranslationsZh[ek];
    }
  }
}

/* ── language toggle ──────────────────────────────────────── */

function applyLang() {
  if (btn) btn.textContent = lang === "en" ? "\u4e2d\u6587" : "EN";
  Object.keys(T_ZH).forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (!el.dataset.en) el.dataset.en = el.innerHTML;
    el.innerHTML = lang === "zh" ? T_ZH[id] : el.dataset.en;
  });
  if (C.titleZh) {
    document.title = lang === "zh" ? C.titleZh : (C.titleEn || document.title);
  }
}

if (btn) {
  btn.addEventListener("click", function() {
    lang = lang === "en" ? "zh" : "en";
    localStorage.setItem(LANG_KEY, lang);
    render();
  });
}

/* ── storage helpers ──────────────────────────────────────── */

function getProgress() {
  try {
    var raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch(e) { return {}; }
}

function saveProgress(p) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function getStartOfDay(ts) {
  var d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function getEndOfDay(ts) {
  var d = new Date(ts);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

function loadFlashcardStorage() {
  try {
    var raw = localStorage.getItem(FC_KEY);
    if (!raw) return { v: 1, cards: {} };
    var o = JSON.parse(raw);
    if (!o || typeof o.cards !== "object") return { v: 1, cards: {} };
    if (o.deckVersion !== FC_DECK_VERSION) return { v: 1, cards: {} };
    return o;
  } catch (e) {
    return { v: 1, cards: {} };
  }
}

/* ── progress helpers ─────────────────────────────────────── */

function countTutorialUnderstood(p, ck) {
  var t = p[ck] && p[ck].tutorials;
  if (!t || typeof t !== "object") return 0;
  var n = 0;
  for (var k in t) {
    if (Object.prototype.hasOwnProperty.call(t, k) && t[k] === true) n++;
  }
  return n;
}

function weightedChapterPct(sv, st, qcd, qct, quizBestPct, tuDone, tuTotal) {
  var secR = st > 0 ? Math.min(1, sv / st) : 0;
  var qcR  = qct > 0 ? Math.min(1, qcd / qct) : 0;
  var qzR  = quizBestPct != null && quizBestPct >= 0 ? Math.min(1, quizBestPct / 100) : 0;
  var tutR = tuTotal > 0 ? Math.min(1, tuDone / tuTotal) : 0;
  return W.sections * secR + W.qc * qcR + W.quiz * qzR + W.tutorials * tutR;
}

/* ── flashcard schedule ───────────────────────────────────── */

function formatFlashDate(ts) {
  var d = new Date(ts);
  try {
    return d.toLocaleDateString(lang === "zh" ? "zh-CN" : undefined, { weekday: "short", month: "short", day: "numeric" });
  } catch (e) {
    return (d.getMonth() + 1) + "/" + d.getDate();
  }
}

function topChaptersFromMap(byCh, max) {
  var arr = [];
  for (var ch in byCh) {
    if (Object.prototype.hasOwnProperty.call(byCh, ch)) arr.push({ ch: parseInt(ch, 10), n: byCh[ch] });
  }
  arr.sort(function(a, b) { return b.n - a.n; });
  return arr.slice(0, max);
}

function renderFlashcardSchedule() {
  var statsEl = document.getElementById("flashStats");
  var tbody   = document.getElementById("flashBody");
  if (!statsEl || !tbody) return;

  var L = {
    due:      lang === "zh" ? T_ZH["flash-due-now"]      : "Due now",
    later:    lang === "zh" ? T_ZH["flash-later-today"]   : "Due later today",
    newc:     lang === "zh" ? T_ZH["flash-new"]           : "New (never studied)",
    up:       lang === "zh" ? T_ZH["flash-upcoming"]      : "Scheduled (next 14 days)",
    whenNow:  lang === "zh" ? T_ZH["flash-when-now"]      : "Now",
    allCh:    lang === "zh" ? "\u5168\u90e8\u7ae0\u8282"  : "Mixed",
    todayRest:lang === "zh" ? "\u4eca\u65e5\u4f59\u4e0b\u65f6\u95f4" : "Later today",
    dash: "\u2014"
  };

  if (!window.ALL_FLASHCARD_DATA || !ALL_FLASHCARD_DATA.length) {
    statsEl.innerHTML = "";
    tbody.innerHTML = "<tr><td colspan=\"3\" style=\"color:var(--text-dim);padding:0.75rem;\">" +
      (lang === "zh" ? T_ZH["flash-empty"] : "Load study-guide flashcard data to see stats.") + "</td></tr>";
    return;
  }

  var cards = loadFlashcardStorage().cards || {};
  var now = Date.now();
  var sod = getStartOfDay(now);
  var eod = getEndOfDay(now);

  var overdue = 0, laterToday = 0, newCount = 0;
  var overdueByCh = {};
  var futureBuckets = {};

  for (var i = 0; i < ALL_FLASHCARD_DATA.length; i++) {
    var ch = ALL_FLASHCARD_DATA[i].ch;
    var st = cards[String(i)];
    if (!st) { newCount++; continue; }
    var nd = st.nextDue;
    if (nd == null) continue;
    if (nd <= now) {
      overdue++;
      overdueByCh[ch] = (overdueByCh[ch] || 0) + 1;
    } else if (nd <= eod) {
      laterToday++;
    } else {
      var dayStart = getStartOfDay(nd);
      if (!futureBuckets[dayStart]) futureBuckets[dayStart] = { n: 0, byCh: {} };
      futureBuckets[dayStart].n++;
      futureBuckets[dayStart].byCh[ch] = (futureBuckets[dayStart].byCh[ch] || 0) + 1;
    }
  }

  var futureSum = 0;
  for (var t = sod + 86400000; t < sod + 15 * 86400000; t += 86400000) {
    if (futureBuckets[t]) futureSum += futureBuckets[t].n;
  }

  statsEl.innerHTML =
    '<div class="flash-stat"><div class="v' + (overdue > 0 ? " danger" : "") + '">' + overdue + '</div><div class="k">' + L.due + '</div></div>' +
    '<div class="flash-stat"><div class="v' + (laterToday > 0 ? " warn" : "") + '">' + laterToday + '</div><div class="k">' + L.later + '</div></div>' +
    '<div class="flash-stat"><div class="v">' + newCount + '</div><div class="k">' + L.newc + '</div></div>' +
    '<div class="flash-stat"><div class="v">' + futureSum + '</div><div class="k">' + L.up + '</div></div>';

  tbody.innerHTML = "";
  var any = overdue > 0 || laterToday > 0 || futureSum > 0;
  if (!any && newCount === 0) {
    tbody.innerHTML = "<tr><td colspan=\"3\" style=\"color:var(--text-dim);padding:0.75rem;\">" +
      (lang === "zh" ? T_ZH["flash-empty"] : "No scheduling yet. Study flashcards to build a review curve.") + "</td></tr>";
    return;
  }
  if (!any && newCount > 0) {
    tbody.innerHTML = "<tr><td colspan=\"3\" style=\"color:var(--text-dim);padding:0.75rem;\">" +
      (lang === "zh" ? "\u4ec5\u6709\u65b0\u5361\u672a\u5b66\u3002\u8bf7\u6253\u5f00\u95ea\u5361\u5f00\u59cb\u5b66\u4e60\u3002"
                     : "Only new cards (never studied). Open Flashcards to start learning.") + "</td></tr>";
    return;
  }

  if (overdue > 0) {
    var topO = topChaptersFromMap(overdueByCh, 8);
    var pillsO = topO.map(function(p) {
      return '<span class="flash-ch-pill">' + chapterShort(p.ch) + ": " + p.n + "</span>";
    }).join("");
    var tr = document.createElement("tr");
    tr.innerHTML = "<td><strong>" + L.whenNow + "</strong></td><td>" + overdue + "</td><td>" + pillsO + "</td>";
    tbody.appendChild(tr);
  }

  if (laterToday > 0) {
    var tr2 = document.createElement("tr");
    tr2.innerHTML = "<td>" + L.todayRest + "</td><td>" + laterToday + "</td><td>" + L.dash + "</td>";
    tbody.appendChild(tr2);
  }

  for (var day = 1; day <= 14; day++) {
    var cursor = sod + day * 86400000;
    var b = futureBuckets[cursor];
    if (!b || !b.n) continue;
    var topF = topChaptersFromMap(b.byCh, 6);
    var pillsF = topF.map(function(p) {
      return '<span class="flash-ch-pill">' + chapterShort(p.ch) + ": " + p.n + "</span>";
    }).join("");
    var tr3 = document.createElement("tr");
    tr3.innerHTML = "<td>" + formatFlashDate(cursor) + "</td><td>" + b.n + "</td><td>" + pillsF + "</td>";
    tbody.appendChild(tr3);
  }
}

/* ── canvas: quiz trend chart ─────────────────────────────── */

function drawQuizTrendChart(p) {
  var cvs = document.getElementById("quizTrendCanvas");
  var emp = document.getElementById("quizTrendEmpty");
  if (!cvs) return;
  cvs.setAttribute("role", "img");
  var hist = (p.quizHistory || []).slice();
  if (!hist.length) {
    cvs.style.display = "none";
    cvs.setAttribute("aria-label", "");
    if (emp) emp.style.display = "";
    return;
  }
  var scores = hist.map(function(e) { return e.pct; });
  var avg = Math.round(scores.reduce(function(a,b){return a+b;},0) / scores.length);
  var latest = scores[scores.length - 1];
  var trendDesc = lang === "zh"
    ? "测验成绩趋势图：" + hist.length + " 次测验，最新 " + latest + "%，平均 " + avg + "%"
    : "Quiz trend chart: " + hist.length + " attempts, latest " + latest + "%, average " + avg + "%";
  cvs.setAttribute("aria-label", trendDesc);
  var srEl = document.getElementById("quizTrendSrOnly");
  if (!srEl) {
    srEl = document.createElement("div");
    srEl.id = "quizTrendSrOnly";
    srEl.className = "sr-only";
    srEl.setAttribute("role", "status");
    cvs.parentElement.appendChild(srEl);
  }
  srEl.textContent = trendDesc;
  cvs.style.display = "";
  if (emp) emp.style.display = "none";
  var wrap = cvs.parentElement;
  var WW = wrap.clientWidth - 2, H = 220, dpr = window.devicePixelRatio || 1;
  cvs.width = WW * dpr; cvs.height = H * dpr;
  cvs.style.width = WW + "px"; cvs.style.height = H + "px";
  var ctx = cvs.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, WW, H);
  var pL = 48, pR = 16, pT = 16, pB = 36;
  var cW = WW - pL - pR, cH = H - pT - pB;
  var n = hist.length;
  var scores = hist.map(function(e) { return e.pct; });
  var labels = hist.map(function(e) {
    var s = String(e.date || "");
    return s.length > 10 ? s.slice(5, 10) : s;
  });
  ctx.textAlign = "right"; ctx.textBaseline = "middle";
  ctx.font = "11px Inter,sans-serif";
  for (var g = 0; g <= 4; g++) {
    var gy = pT + cH - (g / 4) * cH;
    ctx.strokeStyle = "rgba(42,46,58,0.7)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pL, gy); ctx.lineTo(pL + cW, gy); ctx.stroke();
    ctx.fillStyle = "#6b7280"; ctx.fillText((g * 25) + "%", pL - 8, gy);
  }
  var pts = [];
  for (var i = 0; i < n; i++) {
    var px = n === 1 ? pL + cW / 2 : pL + (i / (n - 1)) * cW;
    pts.push({ x: px, y: pT + cH - (scores[i] / 100) * cH });
  }
  var grd = ctx.createLinearGradient(0, pT, 0, pT + cH);
  grd.addColorStop(0, "rgba(52,211,153,0.22)");
  grd.addColorStop(1, "rgba(52,211,153,0.01)");
  ctx.beginPath(); ctx.moveTo(pts[0].x, pT + cH);
  for (var a = 0; a < pts.length; a++) ctx.lineTo(pts[a].x, pts[a].y);
  ctx.lineTo(pts[pts.length - 1].x, pT + cH);
  ctx.closePath(); ctx.fillStyle = grd; ctx.fill();
  ctx.beginPath();
  for (var b = 0; b < pts.length; b++) {
    if (b === 0) ctx.moveTo(pts[b].x, pts[b].y);
    else ctx.lineTo(pts[b].x, pts[b].y);
  }
  ctx.strokeStyle = "#34d399"; ctx.lineWidth = 2.5;
  ctx.lineJoin = "round"; ctx.stroke();
  for (var c = 0; c < pts.length; c++) {
    ctx.beginPath(); ctx.arc(pts[c].x, pts[c].y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#34d399"; ctx.fill();
    ctx.strokeStyle = "#181b24"; ctx.lineWidth = 2; ctx.stroke();
  }
  ctx.fillStyle = "#6b7280"; ctx.font = "10px Inter,sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "top";
  var step = Math.max(1, Math.floor(n / 7));
  for (var d = 0; d < n; d += step) ctx.fillText(labels[d], pts[d].x, H - pB + 10);
  if ((n - 1) % step !== 0 && n > 1) ctx.fillText(labels[n - 1], pts[n - 1].x, H - pB + 10);
}

/* ── canvas: activity heatmap ─────────────────────────────── */

function drawActivityHeatmap(p) {
  var cvs = document.getElementById("heatmapCanvas");
  if (!cvs) return;
  cvs.setAttribute("role", "img");
  var DAY = 86400000;
  var now = new Date(); now.setHours(0, 0, 0, 0);
  var today = now.getTime();
  var act = {};
  function bump(ts) {
    if (!ts || isNaN(ts)) return;
    var d = new Date(ts); d.setHours(0, 0, 0, 0);
    act[d.getTime()] = (act[d.getTime()] || 0) + 1;
  }
  (p.quizHistory || []).forEach(function(h) {
    var d = new Date(h.date); if (!isNaN(d.getTime())) bump(d.getTime());
  });
  (p.flashcardHistory || []).forEach(function(h) {
    var d = new Date(h.date); if (!isNaN(d.getTime())) bump(d.getTime());
  });
  var chKeys = Object.keys(TOTAL_SECTIONS);
  for (var ci = 0; ci < chKeys.length; ci++) {
    var cd = p["ch" + chKeys[ci]];
    if (!cd) continue;
    if (cd.sections) {
      for (var sk in cd.sections) {
        if (typeof cd.sections[sk] === "number") bump(cd.sections[sk]);
      }
    }
  }
  var dow = now.getDay();
  var monOff = dow === 0 ? 6 : dow - 1;
  var start = today - monOff * DAY - 4 * 7 * DAY;
  var grid = [];
  for (var r = 0; r < 7; r++) {
    grid[r] = [];
    for (var col = 0; col < 5; col++) {
      var dt = start + col * 7 * DAY + r * DAY;
      grid[r][col] = { n: act[dt] || 0, f: dt > today };
    }
  }
  var wrap = cvs.parentElement;
  var ww = wrap.clientWidth - 2;
  var cell = Math.min(28, Math.floor((ww - 60) / 5) - 4);
  var gap = 4, lblW = 36;
  var tw = lblW + 5 * (cell + gap);
  var th = 20 + 7 * (cell + gap) + 20;
  var dpr = window.devicePixelRatio || 1;
  cvs.width = tw * dpr; cvs.height = th * dpr;
  cvs.style.width = tw + "px"; cvs.style.height = th + "px";
  var ctx = cvs.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, tw, th);
  var dn = lang === "zh"
    ? ["\u4e00","\u4e8c","\u4e09","\u56db","\u4e94","\u516d","\u65e5"]
    : ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  ctx.font = "10px Inter,sans-serif"; ctx.fillStyle = "#6b7280";
  ctx.textAlign = "right"; ctx.textBaseline = "middle";
  for (var ri = 0; ri < 7; ri++) {
    ctx.fillText(dn[ri], lblW - 6, 20 + ri * (cell + gap) + cell / 2);
  }
  ctx.textAlign = "center"; ctx.textBaseline = "top";
  for (var wi = 0; wi < 5; wi++) {
    var wd = new Date(start + wi * 7 * DAY);
    ctx.fillText((wd.getMonth() + 1) + "/" + wd.getDate(),
      lblW + wi * (cell + gap) + cell / 2, th - 16);
  }
  var mx = 1;
  for (var ak in act) { if (act[ak] > mx) mx = act[ak]; }
  for (var rr = 0; rr < 7; rr++) {
    for (var cc = 0; cc < 5; cc++) {
      var v = grid[rr][cc];
      var cx = lblW + cc * (cell + gap);
      var cy = 20 + rr * (cell + gap);
      if (v.f) ctx.fillStyle = "rgba(42,46,58,0.25)";
      else if (v.n === 0) ctx.fillStyle = "rgba(42,46,58,0.55)";
      else {
        var t = Math.min(1, v.n / mx);
        ctx.fillStyle = "rgba(52,211,153," + (0.25 + 0.75 * t).toFixed(2) + ")";
      }
      var rd = 4;
      ctx.beginPath();
      ctx.moveTo(cx + rd, cy); ctx.lineTo(cx + cell - rd, cy);
      ctx.quadraticCurveTo(cx + cell, cy, cx + cell, cy + rd);
      ctx.lineTo(cx + cell, cy + cell - rd);
      ctx.quadraticCurveTo(cx + cell, cy + cell, cx + cell - rd, cy + cell);
      ctx.lineTo(cx + rd, cy + cell);
      ctx.quadraticCurveTo(cx, cy + cell, cx, cy + cell - rd);
      ctx.lineTo(cx, cy + rd);
      ctx.quadraticCurveTo(cx, cy, cx + rd, cy);
      ctx.closePath(); ctx.fill();
    }
  }
  var totalAct = 0;
  for (var ak2 in act) totalAct += act[ak2];
  var activeDays = Object.keys(act).length;
  var heatDesc = lang === "zh"
    ? "近5周活动热力图：" + activeDays + " 天有活动，共 " + totalAct + " 次交互"
    : "Activity heatmap (last 5 weeks): " + activeDays + " active days, " + totalAct + " interactions";
  cvs.setAttribute("aria-label", heatDesc);
  var srHeat = document.getElementById("heatmapSrOnly");
  if (!srHeat) {
    srHeat = document.createElement("div");
    srHeat.id = "heatmapSrOnly";
    srHeat.className = "sr-only";
    cvs.parentElement.appendChild(srHeat);
  }
  srHeat.textContent = heatDesc;
}

/* ── quiz-best backfill ───────────────────────────────────── */

function syncQuizBestFromHistory(p) {
  if (!p.quizHistory || !p.quizHistory.length) return false;
  var dirty = false;
  p.quizHistory.forEach(function(h) {
    if (h.chBreakdown && typeof h.chBreakdown === "object") {
      Object.keys(h.chBreakdown).forEach(function(ch) {
        var pct = h.chBreakdown[ch];
        var ck = "ch" + ch;
        if (!p[ck]) p[ck] = {};
        if (p[ck].quizBest == null || pct > p[ck].quizBest) {
          p[ck].quizBest = pct;
          dirty = true;
        }
      });
    } else if (h.scope && /^Quiz Hub: Ch\d+$/.test(h.scope)) {
      var m = h.scope.match(/^Quiz Hub: Ch(\d+)$/);
      if (m) {
        var ch = m[1];
        var ck = "ch" + ch;
        if (!p[ck]) p[ck] = {};
        if (p[ck].quizBest == null || h.pct > p[ck].quizBest) {
          p[ck].quizBest = h.pct;
          dirty = true;
        }
      }
    }
  });
  return dirty;
}

/* ── detail row with inline mini-bar ──────────────────────── */

function detailWithBar(label, valueText, pct, color) {
  var w = Math.min(100, Math.max(0, pct));
  return '<div class="detail-row">' +
    '<span class="detail-label"><span class="dot" style="background:' + color + ';"></span>' + label + '</span>' +
    '<span class="detail-value">' + valueText + '</span>' +
    '</div>' +
    '<div class="detail-bar-wrap"><div class="detail-bar-fill" style="width:' + w + '%;background:' + color + ';"></div></div>';
}

/* ── main render ──────────────────────────────────────────── */

function render() {
  var p = getProgress();
  if (syncQuizBestFromHistory(p)) saveProgress(p);

  var totalSectionsVisited = 0, totalSectionsAll = 0;
  var totalQCDone = 0, totalQCAll = 0;
  var totalTutDone = 0, totalTutAll = 0;
  var quizAttempts = p.quizHistory ? p.quizHistory.length : 0;
  var avgScore = 0;

  if (p.quizHistory && p.quizHistory.length > 0) {
    var sum = 0;
    p.quizHistory.forEach(function(h) { sum += h.pct; });
    avgScore = Math.round(sum / p.quizHistory.length);
  }

  for (var ch = 1; ch <= NUM_CH; ch++) {
    var chKey = "ch" + ch;
    var chData = p[chKey] || {};
    var secVisited = chData.sections ? Object.keys(chData.sections).length : 0;
    var secTotal = TOTAL_SECTIONS[ch] || 8;
    totalSectionsVisited += secVisited;
    totalSectionsAll += secTotal;
    var qcDone = chData.quickChecks || 0;
    var qcTotal = TOTAL_QC[ch] || 5;
    totalQCDone += qcDone;
    totalQCAll += qcTotal;
    var tutDone = countTutorialUnderstood(p, chKey);
    var tutTotal = TOTAL_TUTORIAL[ch] || 0;
    totalTutDone += tutDone;
    totalTutAll += tutTotal;
  }

  var secRatio = totalSectionsAll > 0 ? Math.min(1, totalSectionsVisited / totalSectionsAll) : 0;
  var qcRatio  = totalQCAll > 0 ? Math.min(1, totalQCDone / totalQCAll) : 0;
  var quizAvgAcrossCh = 0;
  for (var q = 1; q <= NUM_CH; q++) {
    var qb = (p["ch" + q] || {}).quizBest;
    if (qb != null && qb >= 0) quizAvgAcrossCh += qb / 100;
  }
  quizAvgAcrossCh /= NUM_CH;
  var tutAvgAcrossCh = 0;
  for (var tt2 = 1; tt2 <= NUM_CH; tt2++) {
    var ttot = TOTAL_TUTORIAL[tt2] || 0;
    var tdone = countTutorialUnderstood(p, "ch" + tt2);
    tutAvgAcrossCh += ttot > 0 ? tdone / ttot : 0;
  }
  tutAvgAcrossCh /= NUM_CH;
  var overallPct = Math.round(100 * (W.sections * secRatio + W.qc * qcRatio + W.quiz * quizAvgAcrossCh + W.tutorials * tutAvgAcrossCh));

  document.getElementById("ringPct").textContent = overallPct + "%";
  document.getElementById("ringLabel").textContent = lang === "zh" ? "\u603b\u4f53\u8fdb\u5ea6" : "Overall";
  var circumference = 2 * Math.PI * 65;
  var offset = circumference - (overallPct / 100) * circumference;
  document.getElementById("ringFill").style.strokeDashoffset = offset;
  document.getElementById("ringFill").setAttribute("stroke",
    overallPct >= 80 ? "var(--green)" : overallPct >= 40 ? "var(--accent)" : "var(--yellow)");

  document.getElementById("statSections").textContent    = totalSectionsVisited + " / " + totalSectionsAll;
  document.getElementById("statQuizzes").textContent     = quizAttempts;
  document.getElementById("statAvgScore").textContent    = quizAttempts > 0 ? avgScore + "%" : "\u2014";
  document.getElementById("statQuickChecks").textContent = totalQCDone + " / " + totalQCAll;
  document.getElementById("statTutorials").textContent   = totalTutDone + " / " + totalTutAll;

  /* chapter cards */
  var grid = document.getElementById("chaptersGrid");
  grid.innerHTML = "";
  for (var c = 1; c <= NUM_CH; c++) {
    var ck = "ch" + c;
    var cd = p[ck] || {};
    var sv = cd.sections ? Object.keys(cd.sections).length : 0;
    var st = TOTAL_SECTIONS[c] || 8;
    var qcd = cd.quickChecks || 0;
    var qct = TOTAL_QC[c] || 5;
    var qs = cd.quizBest != null ? cd.quizBest : null;
    var tutDone2 = countTutorialUnderstood(p, ck);
    var tutTotal2 = TOTAL_TUTORIAL[c] || 0;
    var pct = Math.round(100 * weightedChapterPct(sv, st, qcd, qct, qs, tutDone2, tutTotal2));
    pct = Math.min(100, Math.max(0, pct));
    var col = CHCOLORS[c];
    var name = lang === "zh" ? CHNAMES_ZH[c] : CHNAMES[c];

    var card = document.createElement("a");
    card.className = "ch-card";
    card.href = "../chapters/chapter" + c + "/web/chapter" + c + "-study.html";
    card.style.borderTopColor = col;

    var statusIcon = pct >= 80 ? "\u2705" : pct >= 40 ? "\uD83D\uDD36" : pct > 0 ? "\u26AA" : "\u2B1C";

    var secPct = st > 0 ? Math.round(100 * sv / st) : 0;
    var qcPct = qct > 0 ? Math.round(100 * qcd / qct) : 0;
    var tutPct = tutTotal2 > 0 ? Math.round(100 * tutDone2 / tutTotal2) : 0;
    var quizPct = qs !== null ? qs : 0;

    var html = '<div class="ch-header"><span class="ch-num" style="color:' + col + ';">' + statusIcon + " " + chapterShort(c) + '</span><span class="ch-pct" style="color:' + col + ';">' + pct + '%</span></div>';
    html += '<div class="ch-title">' + name + '</div>';
    html += '<div class="mini-bar-wrap"><div class="mini-bar-fill" style="width:' + Math.min(100, pct) + '%; background:' + col + ';"></div></div>';
    html += detailWithBar(lang === "zh" ? T_ZH.sections : "Sections", sv + " / " + st, secPct, col);
    html += detailWithBar(lang === "zh" ? T_ZH.quickChecks : "Quick Checks", qcd + " / " + qct, qcPct, "var(--purple)");
    html += detailWithBar(lang === "zh" ? T_ZH.tutorials : "Tutorials", tutDone2 + " / " + tutTotal2, tutPct, "var(--cyan)");
    html += detailWithBar(lang === "zh" ? T_ZH.quizScore : "Quiz Best", qs !== null ? qs + "%" : "\u2014", quizPct, "var(--green)");

    card.innerHTML = html;
    grid.appendChild(card);
  }

  /* charts */
  drawQuizTrendChart(p);
  drawActivityHeatmap(p);

  /* quiz history table */
  var tbody = document.getElementById("historyBody");
  if (p.quizHistory && p.quizHistory.length > 0) {
    tbody.innerHTML = "";
    p.quizHistory.slice().reverse().forEach(function(h) {
      var tr = document.createElement("tr");
      var cls = h.pct >= 80 ? "score-good" : h.pct >= 50 ? "score-ok" : "score-bad";
      tr.innerHTML = '<td>' + h.date + '</td><td>' + translateScope(h.scope) + '</td><td>' + h.total + '</td><td><span class="score-badge ' + cls + '">' + h.pct + '%</span> (' + h.correct + '/' + h.total + ')</td>';
      tbody.appendChild(tr);
    });
  } else {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-dim); padding:2rem;" id="no-history">No quiz attempts yet. Try the <a href="quiz-hub.html" style="color:var(--accent);">Quiz Hub</a>!</td></tr>';
  }

  /* flashcard session history */
  var fcBody = document.getElementById("fcHistoryBody");
  if (fcBody) {
    if (p.flashcardHistory && p.flashcardHistory.length > 0) {
      fcBody.innerHTML = "";
      p.flashcardHistory.slice().reverse().forEach(function(h) {
        var tr = document.createElement("tr");
        var cr = h.cardsRated != null ? h.cardsRated : 0;
        var ds = h.deckSize != null ? h.deckSize : 0;
        var doneLabel = h.completed ? (lang === "zh" ? "\u662f" : "Yes") : (lang === "zh" ? "\u5426" : "No");
        tr.innerHTML = "<td>" + h.date + "</td><td>" + translateScope(h.scope) + "</td><td>" + cr + " / " + ds + "</td><td>" + doneLabel + "</td>";
        fcBody.appendChild(tr);
      });
    } else {
      fcBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:var(--text-dim); padding:2rem;" id="no-fc-history">No flashcard sessions yet.</td></tr>';
    }
  }

  renderFlashcardSchedule();
  applyLang();
}

/* ── reset button ─────────────────────────────────────────── */

var btnReset = document.getElementById("btn-reset");
if (btnReset) {
  btnReset.addEventListener("click", function() {
    if (!confirm(lang === "zh"
      ? "\u786e\u5b9a\u8981\u91cd\u7f6e\u6240\u6709\u8fdb\u5ea6\u548c\u95ea\u5361\u590d\u4e60\u8bb0\u5f55\u5417\uff1f"
      : "Reset all progress and flashcard scheduling? This cannot be undone.")) return;
    try {
      localStorage.removeItem(PROGRESS_KEY);
      localStorage.removeItem(FC_KEY);
    } catch (e) {}
    render();
  });
}

/* ── resize handler ───────────────────────────────────────── */

var _resizeTimer;
window.addEventListener("resize", function() {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(function() {
    var pResize = getProgress();
    drawQuizTrendChart(pResize);
    drawActivityHeatmap(pResize);
  }, 250);
});

/* ── boot ─────────────────────────────────────────────────── */

render();
})();
