/**
 * Shared knowledge-graph canvas engine.
 * Reads configuration from window.KG_CONFIG before initialising.
 *
 * Required KG_CONFIG fields:
 *   langKey        – localStorage key for language, e.g. "comp5318_lang"
 *   fromParam      – query-param value appended on node click ("kg" | "mkg")
 *   numChapters    – total chapter count (6 or 12)
 *   chapterColors  – { 1:"#6c8cff", 2:… }
 *   chapterNames   – { 1:"Ch1 …", … }
 *   chapterNamesZh – { 1:"第1章…", … }  (optional, falls back to chapterNames)
 *   nodes          – [{ id, ch, diff, label, def, href, label_zh?, def_zh? }, …]
 *   edges          – [[srcId, tgtId, strength], …]
 *
 * Optional:
 *   diffLabels     – override ["","Introductory",…]
 *   diffLabelsZh   – override for zh
 *   clickHint      – { en:"Click …", zh:"点击…" }
 *   ui             – { en:{title,navHome,…}, zh:{…} } for chrome i18n
 */
(function () {
"use strict";

var CFG = window.KG_CONFIG;
if (!CFG) { console.error("KG_CONFIG not defined"); return; }

/* ── config unpacking ── */
var CHCOL      = CFG.chapterColors;
var CHNAME     = CFG.chapterNames;
var CHNAME_ZH  = CFG.chapterNamesZh || CHNAME;
var DIFF_LABELS    = CFG.diffLabels   || ["","Introductory","Moderate","Challenging","Advanced","Expert"];
var DIFF_LABELS_ZH = CFG.diffLabelsZh || DIFF_LABELS;
var numCh      = CFG.numChapters;
var fromParam  = CFG.fromParam || "kg";
var nodes      = CFG.nodes;
var edges      = CFG.edges;
var clickHintEn = (CFG.clickHint && CFG.clickHint.en) || "Click to jump to source page";
var clickHintZh = (CFG.clickHint && CFG.clickHint.zh) || "\u70b9\u51fb\u8df3\u8f6c\u5230\u6765\u6e90\u9875\u9762";

function DIFF_STARS(d) {
  var s = "";
  for (var i = 0; i < d; i++) s += "\u2605";
  for (var j = d; j < 5; j++) s += "\u2606";
  return s;
}

/* ── state ── */
var canvas = document.getElementById("graphCanvas");
canvas.setAttribute("role", "img");
canvas.setAttribute("aria-label",
  "Interactive knowledge graph visualization with " + nodes.length + " concept nodes. " +
  "Use the search box and chapter filters above to explore. Drag nodes to rearrange.");
var ctx    = canvas.getContext("2d");
var W, H, dpr;
var cam = { x: 0, y: 0, zoom: 1 };
var nMap   = {};
var aEdges = [];
var hovered = null, dragN = null, dragOff = { x: 0, y: 0 };
var isPan = false, panS = { x: 0, y: 0, cx: 0, cy: 0 };
var mouseDownPos = null;
var search = "";
var chFilter = {};
var thresh = 3;
var diffSort = false;
var chapterSort = false;
var chapterXSpan = 867;

for (var _c = 1; _c <= numCh; _c++) chFilter[_c] = true;

var lang = "en";
try { lang = localStorage.getItem(CFG.langKey) || "en"; } catch (e) {}

/* ── chapter layout math ── */
function updateChapterSpan() {
  chapterXSpan = Math.max(667, Math.min(1733, W * (1.375 * 2 / 3)));
}
function chapterTargetX(ch) {
  if (numCh <= 1) return 0;
  return (ch - (numCh + 1) / 2) * (chapterXSpan / (numCh - 1));
}

/* ── chrome i18n (optional) ── */
function applyChromeLang() {
  if (!CFG.ui) return;
  var t = CFG.ui[lang] || CFG.ui.en;
  if (!t) return;
  if (t.title) document.title = t.title;
  var text = {
    navHome: t.navHome, navMath: t.navMath, navCourse: t.navCourse,
    pageTitle: t.pageTitle, thresholdText: t.threshold,
    btnDiffSort: t.diff, btnChapterSort: t.chapter, btnReset: t.reset,
    legendWeeks: t.weeks, legendDiff: t.legendDiff,
    legendDiffScale: t.diffScale, legendClick: t.click, legendLayout: t.layout
  };
  Object.keys(text).forEach(function (id) {
    var el = document.getElementById(id);
    if (el && text[id] != null) el.textContent = text[id];
  });
  var html = { legendSort: t.sort, legendGroup: t.group, legendBoth: t.both };
  Object.keys(html).forEach(function (id) {
    var el = document.getElementById(id);
    if (el && html[id] != null) el.innerHTML = html[id];
  });
  var sb = document.getElementById("searchBox");
  if (sb && t.search) sb.placeholder = t.search;
  for (var i = 1; i <= numCh; i++) {
    var lbl = document.getElementById("labelCh" + i);
    if (lbl) lbl.textContent = lang === "zh" ? ("\u7b2c" + i + "\u7ae0") : ("Ch" + i);
  }
  for (var w = 1; w <= numCh; w++) {
    var wEl = document.getElementById("legendW" + w);
    if (wEl && t["w" + w]) wEl.lastChild.textContent = " " + t["w" + w];
  }
}

/* ── resize ── */
function resize() {
  dpr = window.devicePixelRatio || 1;
  W = window.innerWidth; H = window.innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  canvas.style.width = W + "px"; canvas.style.height = H + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  updateChapterSpan();
}
resize();
window.addEventListener("resize", resize);

/* ── node layout ── */
function resetNodeLayout() {
  var groups = {};
  nodes.forEach(function (n) { if (!groups[n.ch]) groups[n.ch] = []; groups[n.ch].push(n); });
  Object.keys(groups).sort(function (a, b) { return a - b; }).forEach(function (ch, ci) {
    var g = groups[ch];
    var total = Object.keys(groups).length;
    var a0 = (ci / total) * Math.PI * 2 - Math.PI / 2;
    var gx = Math.cos(a0) * 250, gy = Math.sin(a0) * 250;
    g.forEach(function (n, ni) {
      var a2 = a0 + (ni - g.length / 2) * 0.25;
      n.x = gx + Math.cos(a2) * (100 + ni * 15);
      n.y = gy + Math.sin(a2) * (100 + ni * 15);
      n.vx = 0; n.vy = 0;
      n.baseR = 3 + n.diff * 1.2;
      nMap[n.id] = n;
    });
  });
}
resetNodeLayout();

/* ── rebuild edges ── */
function rebuild() {
  aEdges = [];
  edges.forEach(function (e) {
    if (e[2] < thresh) return;
    var s = nMap[e[0]], t = nMap[e[1]];
    if (!s || !t || !chFilter[s.ch] || !chFilter[t.ch]) return;
    aEdges.push({ source: s, target: t, str: e[2] });
  });
  updateStats();
}

/* ── chapter query param ── */
(function applyChapterQuery() {
  try {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("chapter") || params.get("ch");
    if (q == null || q === "") return;
    var n = parseInt(q, 10);
    if (n !== n || n < 1 || n > numCh) return;
    for (var i = 1; i <= numCh; i++) {
      chFilter[i] = i === n;
      var box = document.getElementById("chkCh" + i);
      if (box) box.checked = i === n;
    }
  } catch (e) {}
})();

rebuild();

/* ── helpers ── */
function vis() { return nodes.filter(function (n) { return chFilter[n.ch]; }); }
function w2s(wx, wy) { return { x: (wx - cam.x) * cam.zoom + W / 2, y: (wy - cam.y) * cam.zoom + H / 2 }; }
function s2w(sx, sy) { return { x: (sx - W / 2) / cam.zoom + cam.x, y: (sy - H / 2) / cam.zoom + cam.y }; }
function nLabel(n) { return lang === "zh" ? (n.label_zh || n.label) : n.label; }
function nDef(n)   { return lang === "zh" ? (n.def_zh || n.def) : n.def; }
function isHit(n)  { if (!search) return false; return (n.label.toLowerCase() + " " + (n.label_zh || "") + " " + (n.def || "")).toLowerCase().indexOf(search) !== -1; }

/* ── simulation ── */
function simulate() {
  var v = vis(), alpha = 0.3;
  var rep = chapterSort ? 4200 : 3000;
  var sLen = chapterSort ? 100 : 120, sK = 0.008, damp = 0.85;
  var cK = chapterSort ? 0.00055 : (diffSort ? 0.0012 : 0.002);
  var repSoft = 40;

  for (var i = 0; i < v.length; i++) for (var j = i + 1; j < v.length; j++) {
    var a = v[i], b = v[j], dx = b.x - a.x, dy = b.y - a.y;
    var d = Math.sqrt(dx * dx + dy * dy) || 1;
    var f = rep / (d * d + repSoft * repSoft);
    var fx = dx / d * f * alpha, fy = dy / d * f * alpha;
    a.vx -= fx; a.vy -= fy; b.vx += fx; b.vy += fy;
  }

  aEdges.forEach(function (e) {
    var dx = e.target.x - e.source.x, dy = e.target.y - e.source.y;
    var d = Math.sqrt(dx * dx + dy * dy) || 1;
    var f = (d - sLen) * sK * (e.str / 5) * alpha;
    var fx = dx / d * f, fy = dy / d * f;
    e.source.vx += fx; e.source.vy += fy;
    e.target.vx -= fx; e.target.vy -= fy;
  });

  if (diffSort) {
    var yRange = 500;
    v.forEach(function (n) {
      n.vy += ((n.diff - 3) * (yRange / 2) - n.y) * 0.015 * alpha;
    });
  }
  if (chapterSort) {
    var chPull = diffSort ? 0.022 : 0.026;
    v.forEach(function (n) {
      n.vx += (chapterTargetX(n.ch) - n.x) * chPull * alpha;
    });
  }

  v.forEach(function (n) {
    n.vx -= n.x * cK * alpha;
    n.vy -= n.y * cK * alpha;
  });

  var vMax = 48, posLim = 3600;
  v.forEach(function (n) {
    if (n === dragN) { n.vx = 0; n.vy = 0; return; }
    n.vx *= damp; n.vy *= damp;
    if (n.vx > vMax) n.vx = vMax; else if (n.vx < -vMax) n.vx = -vMax;
    if (n.vy > vMax) n.vy = vMax; else if (n.vy < -vMax) n.vy = -vMax;
    n.x += n.vx; n.y += n.vy;
  });
  v.forEach(function (n) {
    if (n.x > posLim) n.x = posLim; else if (n.x < -posLim) n.x = -posLim;
    if (n.y > posLim) n.y = posLim; else if (n.y < -posLim) n.y = -posLim;
  });
}

/* ── draw ── */
function draw() {
  ctx.clearRect(0, 0, W, H);

  if (diffSort) {
    var labels = lang === "zh" ? DIFF_LABELS_ZH : DIFF_LABELS;
    for (var d = 1; d <= 5; d++) {
      var ty = (d - 3) * 250;
      var sp = w2s(0, ty);
      ctx.fillStyle = d % 2 === 1 ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.008)";
      var bandH = 250 * cam.zoom;
      ctx.fillRect(0, sp.y - bandH / 2, W, bandH);
      ctx.font = "600 11px Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(DIFF_STARS(d) + "  " + labels[d], 12, sp.y);
    }
  }

  if (chapterSort) {
    var wcol = chapterXSpan / (numCh - 1);
    for (var ch = 1; ch <= numCh; ch++) {
      var cx = chapterTargetX(ch);
      var xl = w2s(cx - wcol / 2, 0).x;
      var xr = w2s(cx + wcol / 2, 0).x;
      var col = CHCOL[ch];
      var r = parseInt(col.slice(1, 3), 16), g = parseInt(col.slice(3, 5), 16), b = parseInt(col.slice(5, 7), 16);
      ctx.fillStyle = ch % 2 === 1 ? "rgba(" + r + "," + g + "," + b + ",0.06)" : "rgba(" + r + "," + g + "," + b + ",0.03)";
      var bw = Math.max(1, Math.abs(xr - xl));
      ctx.fillRect(Math.min(xl, xr), 0, bw, H);
      ctx.font = "600 10px Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(lang === "zh" ? ("\u7b2c" + ch + "\u7ae0") : ("Ch" + ch), (xl + xr) / 2, 8);
    }
  }

  var v = vis(), connH = {};
  if (hovered) aEdges.forEach(function (e) {
    if (e.source === hovered) connH[e.target.id] = e.str;
    if (e.target === hovered) connH[e.source.id] = e.str;
  });

  aEdges.forEach(function (e) {
    var p1 = w2s(e.source.x, e.source.y), p2 = w2s(e.target.x, e.target.y);
    var isH = hovered && (e.source === hovered || e.target === hovered);
    ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = isH ? "#8aa8ff" : "#3a4a6a";
    ctx.globalAlpha = isH ? 0.7 : (hovered ? 0.06 : 0.15 + e.str * 0.03);
    ctx.lineWidth = isH ? 1.5 + e.str * 0.15 : 0.5 + e.str * 0.08;
    ctx.stroke(); ctx.globalAlpha = 1;
  });

  v.forEach(function (n) {
    var p = w2s(n.x, n.y), r = n.baseR * cam.zoom;
    var col = CHCOL[n.ch], isH = n === hovered, isC = connH[n.id], isSH = search && isHit(n);
    var dim = hovered && !isH && !isC;
    if (isH || isSH) {
      ctx.beginPath(); ctx.arc(p.x, p.y, r + 10, 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.globalAlpha = 0.12; ctx.fill(); ctx.globalAlpha = 1;
    }
    ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = dim ? "#2a2e3a" : col;
    ctx.globalAlpha = dim ? 0.3 : (isH ? 1 : 0.85); ctx.fill(); ctx.globalAlpha = 1;
    if (isH || isSH) {
      ctx.beginPath(); ctx.arc(p.x, p.y, r + 1, 0, Math.PI * 2);
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
    }
    var fs = Math.max(9, 11 * cam.zoom);
    ctx.font = (isH ? "600 " : "500 ") + fs + "px Inter, sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.fillStyle = dim ? "#4a4e5a" : (isH ? "#fff" : "#c0c8d8");
    ctx.globalAlpha = dim ? 0.4 : 1;
    ctx.fillText(nLabel(n), p.x, p.y + r + 4);
    ctx.globalAlpha = 1;
  });
}

/* ── hit-test ── */
function getAt(sx, sy) {
  var w = s2w(sx, sy), best = null, bd = Infinity;
  vis().forEach(function (n) {
    var dx = n.x - w.x, dy = n.y - w.y, d = Math.sqrt(dx * dx + dy * dy);
    var hr = (n.baseR + 8) / cam.zoom;
    if (d < hr && d < bd) { best = n; bd = d; }
  });
  return best;
}

/* ── interaction ── */
canvas.addEventListener("mousedown", function (e) {
  mouseDownPos = { x: e.clientX, y: e.clientY };
  var n = getAt(e.clientX, e.clientY);
  if (n) {
    dragN = n;
    var w = s2w(e.clientX, e.clientY);
    dragOff.x = n.x - w.x; dragOff.y = n.y - w.y;
  } else {
    isPan = true;
    panS.x = e.clientX; panS.y = e.clientY;
    panS.cx = cam.x; panS.cy = cam.y;
  }
});

canvas.addEventListener("mousemove", function (e) {
  if (dragN) {
    var w = s2w(e.clientX, e.clientY);
    dragN.x = w.x + dragOff.x; dragN.y = w.y + dragOff.y;
    dragN.vx = 0; dragN.vy = 0;
  } else if (isPan) {
    cam.x = panS.cx - (e.clientX - panS.x) / cam.zoom;
    cam.y = panS.cy - (e.clientY - panS.y) / cam.zoom;
  } else {
    var prev = hovered;
    hovered = getAt(e.clientX, e.clientY);
    canvas.style.cursor = hovered ? "pointer" : "grab";
    if (hovered !== prev) showTT(e.clientX, e.clientY);
  }
  if (hovered) showTT(e.clientX, e.clientY);
});

canvas.addEventListener("mouseup", function (e) {
  if (dragN && mouseDownPos) {
    var dx = e.clientX - mouseDownPos.x, dy = e.clientY - mouseDownPos.y;
    if (Math.sqrt(dx * dx + dy * dy) < 5 && dragN.href) {
      var anchor = dragN.href.indexOf("#") !== -1 ? dragN.href.split("#")[1] : "";
      var base = dragN.href.indexOf("?") !== -1 ? dragN.href : dragN.href.split("#")[0];
      var url = base + (base.indexOf("?") !== -1 ? "&" : "?") + "from=" + fromParam + (anchor ? "#" + anchor : "");
      window.location.href = url;
      return;
    }
  }
  dragN = null; isPan = false; mouseDownPos = null;
});

canvas.addEventListener("wheel", function (e) {
  e.preventDefault();
  var f = e.deltaY > 0 ? 0.9 : 1.1;
  var nz = Math.max(0.2, Math.min(5, cam.zoom * f));
  var w = s2w(e.clientX, e.clientY);
  cam.zoom = nz;
  var w2 = s2w(e.clientX, e.clientY);
  cam.x -= (w2.x - w.x); cam.y -= (w2.y - w.y);
}, { passive: false });

/* ── tooltip ── */
var tt = document.getElementById("tooltip");
function showTT(mx, my) {
  if (!hovered) { tt.style.display = "none"; return; }
  tt.style.display = "block";
  var n = hovered;
  document.getElementById("ttLabel").textContent = nLabel(n);
  var chN = lang === "zh" ? CHNAME_ZH : CHNAME;
  var ttCh = document.getElementById("ttChapter");
  ttCh.textContent = chN[n.ch]; ttCh.style.color = CHCOL[n.ch];
  var dLabels = lang === "zh" ? DIFF_LABELS_ZH : DIFF_LABELS;
  document.getElementById("ttDiff").innerHTML = DIFF_STARS(n.diff) + " " + dLabels[n.diff];
  var defEl = document.getElementById("ttDef");
  defEl.textContent = nDef(n);
  if (window.renderMathInElement) {
    try { renderMathInElement(defEl, { delimiters: [{ left: "$", right: "$", display: false }], throwOnError: false }); } catch (ex) {}
  }
  var conns = [];
  aEdges.forEach(function (e) {
    if (e.source === n) conns.push({ node: e.target, s: e.str });
    if (e.target === n) conns.push({ node: e.source, s: e.str });
  });
  conns.sort(function (a, b) { return b.s - a.s; });
  document.getElementById("ttConn").textContent = conns.length === 0 ? "" :
    conns.slice(0, 5).map(function (c) { return "\u2022 " + nLabel(c.node) + " (" + c.s + "/10)"; }).join("\n");
  document.getElementById("ttConn").style.whiteSpace = "pre-line";
  var hint = lang === "zh" ? clickHintZh : clickHintEn;
  document.getElementById("ttHint").textContent = n.href ? hint : "";
  var tx = mx + 16, ty = my + 16;
  if (tx + 340 > W) tx = mx - 350;
  if (ty + 200 > H) ty = my - 200;
  tt.style.left = tx + "px"; tt.style.top = ty + "px";
}

/* ── controls ── */
for (var _i = 1; _i <= numCh; _i++) (function (ch) {
  var box = document.getElementById("chkCh" + ch);
  if (!box) return;
  box.addEventListener("change", function () { chFilter[ch] = this.checked; rebuild(); });
}(_i));

var thSl = document.getElementById("thresholdSlider"), thV = document.getElementById("thresholdVal");
thSl.addEventListener("input", function () { thresh = parseInt(thSl.value); thV.textContent = thresh; rebuild(); });

var btnDiff = document.getElementById("btnDiffSort");
var btnChapter = document.getElementById("btnChapterSort");
btnDiff.addEventListener("click", function () {
  diffSort = !diffSort;
  btnDiff.classList.toggle("active", diffSort);
});
btnChapter.addEventListener("click", function () {
  chapterSort = !chapterSort;
  btnChapter.classList.toggle("active", chapterSort);
});

document.getElementById("btnReset").addEventListener("click", function () {
  cam.x = 0; cam.y = 0; cam.zoom = 1;
  resetNodeLayout();
});
document.getElementById("searchBox").addEventListener("input", function () {
  search = this.value.toLowerCase().trim();
});

/* ── stats ── */
function updateStats() {
  var ui = CFG.ui && (CFG.ui[lang] || CFG.ui.en);
  var nTxt = ui ? ui.nodes : "nodes";
  var eTxt = ui ? ui.edges : "edges";
  var tTxt = ui ? ui.thresholdStats : "threshold \u2265 ";
  var statsText = vis().length + " " + nTxt + " \u00b7 " + aEdges.length + " " + eTxt + " \u00b7 " + tTxt + thresh + "/10";
  document.getElementById("statsBox").textContent = statsText;
  canvas.setAttribute("aria-label",
    "Knowledge graph: " + vis().length + " " + nTxt + ", " + aEdges.length + " " + eTxt +
    ". Use search and filters to explore. Drag to rearrange nodes.");
}

/* ── language change listener ── */
window.addEventListener("storage", function (e) {
  if (e.key === CFG.langKey) {
    lang = e.newValue || "en";
    applyChromeLang();
    updateStats();
  }
});

/* ── boot ── */
applyChromeLang();
updateStats();

function tick() { simulate(); draw(); requestAnimationFrame(tick); }
tick();

})();
