(function () {
  "use strict";

  function renderMath() {
    if (typeof renderMathInElement === "function") {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
        throwOnError: false,
      });
    }
  }

  // ========== SIDEBAR ==========
  var sidebar = document.getElementById("sidebar");
  var sidebarToggle = document.getElementById("sidebarToggle");
  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("open");
  });
  document.getElementById("mainContent").addEventListener("click", function () {
    if (sidebar.classList.contains("open")) sidebar.classList.remove("open");
  });

  // ========== SCROLL SPY & PROGRESS ==========
  var sections = document.querySelectorAll(".section[data-track]");
  var navLinks = document.querySelectorAll(".nav-link");
  var visited = new Set();

  function updateProgress() {
    visited.add("hero");
    var pct = (visited.size / sections.length) * 100;
    document.getElementById("progressFill").style.width = pct + "%";
    document.getElementById("progressText").textContent =
      visited.size + " / " + sections.length;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.dataset.track;
          visited.add(id);
          updateProgress();
          navLinks.forEach(function (l) {
            l.classList.toggle("active", l.dataset.section === e.target.id);
          });
        }
      });
    },
    { rootMargin: "-20% 0px -60% 0px" }
  );
  sections.forEach(function (s) {
    observer.observe(s);
  });

  // ========== PROOF TOGGLES ==========
  document.querySelectorAll(".proof-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.dataset.target);
      var isOpen = target.classList.contains("open");
      target.classList.toggle("open");
      btn.classList.toggle("open");
      if (!isOpen) renderMath();
    });
  });

  // ========== SOLUTION TOGGLES ==========
  document.querySelectorAll(".solution-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.dataset.target);
      var isOpen = target.classList.contains("open");
      target.classList.toggle("open");
      var zh = typeof getLang === "function" && getLang() === "zh";
      btn.textContent = isOpen
        ? zh ? "\u67e5\u770b\u89e3\u7b54" : "Show Solution"
        : zh ? "\u9690\u85cf\u89e3\u7b54" : "Hide Solution";
      if (!isOpen) renderMath();
    });
  });

  // ========== KARGER'S MIN-CUT SIMULATION ==========
  var kargerGraph = null;
  var kargerN = 0;
  var kargerBestCut = Infinity;
  var kargerTotalTrials = 0;
  var kargerSuccessCount = 0;

  var sliderKarger = document.getElementById("sliderKarger");
  document.getElementById("valKarger").textContent = sliderKarger.value;
  sliderKarger.addEventListener("input", function () {
    document.getElementById("valKarger").textContent = sliderKarger.value;
  });

  function generateConnectedGraph(n) {
    var edges = [];
    var perm = [];
    var i, j, a, b, tmp;
    for (i = 0; i < n; i++) perm.push(i);
    for (i = n - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      tmp = perm[i]; perm[i] = perm[j]; perm[j] = tmp;
    }
    for (i = 1; i < n; i++) {
      a = Math.min(perm[i - 1], perm[i]);
      b = Math.max(perm[i - 1], perm[i]);
      edges.push([a, b]);
    }
    var edgeSet = {};
    for (i = 0; i < edges.length; i++) {
      edgeSet[edges[i][0] + "," + edges[i][1]] = true;
    }
    var extraCount = Math.floor(n * 1.5);
    for (i = 0; i < extraCount; i++) {
      a = Math.floor(Math.random() * n);
      b = Math.floor(Math.random() * n);
      if (a === b) continue;
      if (a > b) { tmp = a; a = b; b = tmp; }
      var key = a + "," + b;
      if (!edgeSet[key]) {
        edgeSet[key] = true;
        edges.push([a, b]);
      }
    }
    return edges;
  }

  function runKargerOnce(n, edges) {
    var parent = [];
    var i, k;
    for (i = 0; i < n; i++) parent.push(i);

    function find(x) {
      while (parent[x] !== x) {
        parent[x] = parent[parent[x]];
        x = parent[x];
      }
      return x;
    }

    var edgeCopy = [];
    for (k = 0; k < edges.length; k++) {
      edgeCopy.push([edges[k][0], edges[k][1]]);
    }

    var verticesLeft = n;
    while (verticesLeft > 2) {
      var validEdges = [];
      for (k = 0; k < edgeCopy.length; k++) {
        if (find(edgeCopy[k][0]) !== find(edgeCopy[k][1])) {
          validEdges.push(k);
        }
      }
      if (validEdges.length === 0) break;
      var pick = validEdges[Math.floor(Math.random() * validEdges.length)];
      var u = find(edgeCopy[pick][0]);
      var v = find(edgeCopy[pick][1]);
      parent[v] = u;
      verticesLeft--;
    }

    var cutSize = 0;
    for (k = 0; k < edges.length; k++) {
      if (find(edges[k][0]) !== find(edges[k][1])) cutSize++;
    }
    return cutSize;
  }

  function updateKargerDisplay(currentCut) {
    document.getElementById("kargerCut").textContent = currentCut;
    document.getElementById("kargerTrials").textContent = kargerTotalTrials;
    var rate = kargerTotalTrials > 0
      ? ((kargerSuccessCount / kargerTotalTrials) * 100).toFixed(1)
      : "0.0";
    document.getElementById("kargerRate").textContent = rate + "%";
    document.getElementById("kargerEdges").textContent =
      kargerGraph ? kargerGraph.length : 0;
  }

  function ensureGraph() {
    var n = parseInt(sliderKarger.value);
    if (!kargerGraph || kargerN !== n) {
      kargerN = n;
      kargerGraph = generateConnectedGraph(n);
      kargerBestCut = Infinity;
      kargerTotalTrials = 0;
      kargerSuccessCount = 0;
    }
  }

  document.getElementById("btnRunKarger").addEventListener("click", function () {
    ensureGraph();
    var cut = runKargerOnce(kargerN, kargerGraph);
    kargerTotalTrials++;
    if (cut < kargerBestCut) {
      kargerBestCut = cut;
      kargerSuccessCount = 1;
    } else if (cut === kargerBestCut) {
      kargerSuccessCount++;
    }
    updateKargerDisplay(cut);
  });

  document.getElementById("btnRunKarger100").addEventListener("click", function () {
    ensureGraph();
    var lastCut = 0;
    for (var t = 0; t < 100; t++) {
      var cut = runKargerOnce(kargerN, kargerGraph);
      kargerTotalTrials++;
      lastCut = cut;
      if (cut < kargerBestCut) {
        kargerBestCut = cut;
        kargerSuccessCount = 1;
      } else if (cut === kargerBestCut) {
        kargerSuccessCount++;
      }
    }
    updateKargerDisplay(lastCut);
  });

  document.getElementById("btnResetKarger").addEventListener("click", function () {
    kargerGraph = null;
    kargerN = 0;
    kargerBestCut = Infinity;
    kargerTotalTrials = 0;
    kargerSuccessCount = 0;
    document.getElementById("kargerCut").textContent = "-";
    document.getElementById("kargerTrials").textContent = "0";
    document.getElementById("kargerRate").textContent = "0%";
    document.getElementById("kargerEdges").textContent = "0";
  });

// ========== KARGER EDGE CONTRACTION STEP-BY-STEP ==========
  var kcSvg = document.getElementById("svgKargerContract");
  var KC_PAL = ["#6c8cff","#34d399","#fbbf24","#f87171","#a78bfa","#f472b6"];
  var kcNodes, kcEdges, kcNodeMap, kcOrigNodes, kcOrigEdges;
  var kcContractionCt, kcAnim, kcDone2;

  function kcPath(x1, y1, x2, y2, c) {
    if (Math.abs(c) < 1) return "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    var dx = x2 - x1, dy = y2 - y1, ln = Math.sqrt(dx * dx + dy * dy) || 1;
    return "M" + x1 + "," + y1 + "Q" + (mx - dy / ln * c) + "," + (my + dx / ln * c) + " " + x2 + "," + y2;
  }

  function kcCurvePt(x1, y1, x2, y2, c) {
    var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    if (Math.abs(c) < 1) return [mx, my];
    var dx = x2 - x1, dy = y2 - y1, ln = Math.sqrt(dx * dx + dy * dy) || 1;
    var qx = mx - dy / ln * c, qy = my + dx / ln * c;
    return [0.25 * x1 + 0.5 * qx + 0.25 * x2, 0.25 * y1 + 0.5 * qy + 0.25 * y2];
  }

  function kcDraw() {
    if (!kcSvg) return;
    var html = "", i, j, e, n1, n2;
    var grp = {};
    for (i = 0; i < kcEdges.length; i++) {
      e = kcEdges[i];
      var k = Math.min(e.src, e.dst) + "|" + Math.max(e.src, e.dst);
      if (!grp[k]) grp[k] = [];
      grp[k].push(i);
    }
    for (var k in grp) {
      var arr = grp[k], cnt = arr.length;
      for (j = 0; j < cnt; j++) {
        e = kcEdges[arr[j]];
        n1 = kcNodeMap[e.src]; n2 = kcNodeMap[e.dst];
        if (!n1 || !n2) continue;
        var cv = (j - (cnt - 1) / 2) * 35;
        var col = e.cut ? "#f87171" : e.highlight ? "#fbbf24" : "#4a5068";
        var sw = (e.cut || e.highlight) ? 3.5 : 2;
        html += '<path d="' + kcPath(n1.x, n1.y, n2.x, n2.y, cv) + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '" stroke-linecap="round"/>';
        var pt = kcCurvePt(n1.x, n1.y, n2.x, n2.y, cv);
        html += '<rect x="' + (pt[0] - 9) + '" y="' + (pt[1] - 18) + '" width="18" height="14" rx="3" fill="#181b24" opacity="0.8"/>';
        html += '<text x="' + pt[0] + '" y="' + (pt[1] - 8) + '" fill="#9ca3af" font-size="10" text-anchor="middle">' + e.weight + '</text>';
      }
    }
    for (i = 0; i < kcNodes.length; i++) {
      var nd = kcNodes[i];
      var r = Math.min(22 + (nd.members.length - 1) * 5, 42);
      html += '<circle cx="' + nd.x + '" cy="' + nd.y + '" r="' + r + '" fill="' + nd.color + '" stroke="#e4e6ed" stroke-width="2"/>';
      var fs = nd.label.length > 4 ? 9 : nd.label.length > 3 ? 10 : nd.label.length > 2 ? 11 : 13;
      html += '<text x="' + nd.x + '" y="' + (nd.y + 4) + '" fill="#181b24" font-size="' + fs + '" font-weight="bold" text-anchor="middle">' + nd.label + '</text>';
    }
    if (kcDone2) {
      html += '<text x="300" y="30" fill="#34d399" font-size="15" font-weight="bold" text-anchor="middle">Cut found! Value = ' + kcEdges.length + '</text>';
    }
    kcSvg.innerHTML = html;
  }

  function kcStats() {
    document.getElementById("kcNodes").textContent = kcNodes.length;
    document.getElementById("kcEdges").textContent = kcEdges.length;
    document.getElementById("kcContractions").textContent = kcContractionCt;
    document.getElementById("kcCutValue").textContent = kcDone2 ? kcEdges.length : "\u2013";
  }

  function kcGenerate() {
    var n = 6, cx = 300, cy = 210, rad = 140;
    kcNodes = []; kcEdges = []; kcNodeMap = {};
    kcContractionCt = 0; kcDone2 = false; kcAnim = false;
    for (var i = 0; i < n; i++) {
      var a = (2 * Math.PI * i) / n - Math.PI / 2;
      var nd = { id: i, label: String.fromCharCode(65 + i), x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a), color: KC_PAL[i], members: [i] };
      kcNodes.push(nd); kcNodeMap[i] = nd;
    }
    var perm = [], eSet = {};
    for (var i = 0; i < n; i++) perm.push(i);
    for (var i = n - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
    for (var i = 1; i < n; i++) {
      var u = perm[i - 1], v = perm[i];
      var ek = Math.min(u, v) + "|" + Math.max(u, v);
      if (!eSet[ek]) { eSet[ek] = true; kcEdges.push({ src: u, dst: v, weight: Math.floor(Math.random() * 9) + 1, highlight: false, cut: false }); }
    }
    var att = 0;
    while (kcEdges.length < 10 && att < 100) {
      var u = Math.floor(Math.random() * n), v = Math.floor(Math.random() * n);
      if (u === v) { att++; continue; }
      var ek = Math.min(u, v) + "|" + Math.max(u, v);
      if (!eSet[ek]) { eSet[ek] = true; kcEdges.push({ src: u, dst: v, weight: Math.floor(Math.random() * 9) + 1, highlight: false, cut: false }); }
      att++;
    }
    kcOrigNodes = JSON.parse(JSON.stringify(kcNodes));
    kcOrigEdges = JSON.parse(JSON.stringify(kcEdges));
    kcDraw(); kcStats();
  }

  function kcReset() {
    if (!kcOrigNodes) return;
    kcNodes = JSON.parse(JSON.stringify(kcOrigNodes));
    kcEdges = JSON.parse(JSON.stringify(kcOrigEdges));
    kcNodeMap = {};
    for (var i = 0; i < kcNodes.length; i++) kcNodeMap[kcNodes[i].id] = kcNodes[i];
    kcContractionCt = 0; kcDone2 = false; kcAnim = false;
    kcDraw(); kcStats();
  }

  function kcContract() {
    if (kcAnim || kcDone2 || kcNodes.length <= 2) return;
    if (kcEdges.length === 0) return;
    kcAnim = true;
    var idx = Math.floor(Math.random() * kcEdges.length);
    kcEdges[idx].highlight = true;
    kcDraw();
    setTimeout(function () {
      var e = kcEdges[idx];
      var sn = kcNodeMap[e.src], dn = kcNodeMap[e.dst];
      sn.x = (sn.x + dn.x) / 2;
      sn.y = (sn.y + dn.y) / 2;
      sn.label += dn.label;
      sn.members = sn.members.concat(dn.members);
      var did = dn.id;
      kcNodes = kcNodes.filter(function (nd) { return nd.id !== did; });
      delete kcNodeMap[did];
      for (var i = 0; i < kcEdges.length; i++) {
        if (kcEdges[i].src === did) kcEdges[i].src = sn.id;
        if (kcEdges[i].dst === did) kcEdges[i].dst = sn.id;
      }
      kcEdges = kcEdges.filter(function (ed) { return ed.src !== ed.dst; });
      kcEdges.forEach(function (ed) { ed.highlight = false; });
      kcContractionCt++;
      if (kcNodes.length <= 2) {
        kcDone2 = true;
        kcEdges.forEach(function (ed) { ed.cut = true; });
      }
      kcDraw(); kcStats();
      kcAnim = false;
    }, 600);
  }

  if (kcSvg) {
    kcGenerate();
    document.getElementById("btnContractEdge").addEventListener("click", kcContract);
    document.getElementById("btnNewContractGraph").addEventListener("click", kcGenerate);
    document.getElementById("btnResetContract").addEventListener("click", kcReset);
  }

  // ========== BORŮVKA MST ROUND VISUALIZATION ==========
  var borSvg = document.getElementById("svgBoruvka");
  var BOR_PAL = ["#6c8cff", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6", "#22d3ee", "#fb923c"];
  var borNodes, borEdges, borPar, borRk;
  var borOrigEdges, borRoundN, borMSTW, borFinished, borBusy, borAutoRun;

  function borFind(x) {
    while (borPar[x] !== x) { borPar[x] = borPar[borPar[x]]; x = borPar[x]; }
    return x;
  }

  function borUnion(x, y) {
    var rx = borFind(x), ry = borFind(y);
    if (rx === ry) return;
    if (borRk[rx] < borRk[ry]) { var t = rx; rx = ry; ry = t; }
    borPar[ry] = rx;
    if (borRk[rx] === borRk[ry]) borRk[rx]++;
  }

  function borCompCount() {
    var s = {};
    for (var i = 0; i < borNodes.length; i++) s[borFind(i)] = true;
    return Object.keys(s).length;
  }

  function borDraw() {
    if (!borSvg) return;
    var roots = {}, rl = [];
    for (var i = 0; i < borNodes.length; i++) {
      var r = borFind(i);
      if (!roots[r]) { roots[r] = true; rl.push(r); }
    }
    rl.sort(function (a, b) { return a - b; });
    var rc = {};
    for (var i = 0; i < rl.length; i++) rc[rl[i]] = BOR_PAL[i % BOR_PAL.length];
    var html = "", e, n1, n2;
    for (var i = 0; i < borEdges.length; i++) {
      e = borEdges[i];
      n1 = borNodes[e.u]; n2 = borNodes[e.v];
      var col = "#3a3f4e", sw = 1.5, op = 0.4;
      if (e.inMST) { col = "#6c8cff"; sw = 3.5; op = 1; }
      if (e.highlighted) { col = "#34d399"; sw = 3.5; op = 1; }
      html += '<line x1="' + n1.x + '" y1="' + n1.y + '" x2="' + n2.x + '" y2="' + n2.y + '" stroke="' + col + '" stroke-width="' + sw + '" opacity="' + op + '" stroke-linecap="round"/>';
      var mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2;
      var dx = n2.x - n1.x, dy = n2.y - n1.y, ln = Math.sqrt(dx * dx + dy * dy) || 1;
      var ox = -dy / ln * 14, oy = dx / ln * 14;
      var fc = e.inMST ? "#6c8cff" : e.highlighted ? "#34d399" : "#9ca3af";
      html += '<rect x="' + (mx + ox - 11) + '" y="' + (my + oy - 9) + '" width="22" height="15" rx="3" fill="#181b24" opacity="0.85"/>';
      html += '<text x="' + (mx + ox) + '" y="' + (my + oy + 3) + '" fill="' + fc + '" font-size="10" font-weight="bold" text-anchor="middle">' + e.weight + '</text>';
    }
    for (var i = 0; i < borNodes.length; i++) {
      var nd = borNodes[i];
      var c = rc[borFind(i)] || "#6c8cff";
      html += '<circle cx="' + nd.x + '" cy="' + nd.y + '" r="20" fill="' + c + '" stroke="#e4e6ed" stroke-width="2"/>';
      html += '<text x="' + nd.x + '" y="' + (nd.y + 5) + '" fill="#181b24" font-size="13" font-weight="bold" text-anchor="middle">' + nd.label + '</text>';
    }
    if (borFinished) {
      html += '<text x="300" y="30" fill="#34d399" font-size="15" font-weight="bold" text-anchor="middle">MST complete! Total weight = ' + borMSTW + '</text>';
    }
    borSvg.innerHTML = html;
  }

  function borStats() {
    document.getElementById("borRound").textContent = borRoundN;
    document.getElementById("borComponents").textContent = borCompCount();
    document.getElementById("borMSTWeight").textContent = borMSTW;
  }

  function borGenerate() {
    var n = 8, cx = 300, cy = 210, rad = 155;
    borNodes = []; borEdges = []; borPar = []; borRk = [];
    borRoundN = 0; borMSTW = 0; borFinished = false; borBusy = false; borAutoRun = false;
    for (var i = 0; i < n; i++) {
      var a = (2 * Math.PI * i) / n - Math.PI / 2;
      borNodes.push({ id: i, label: String.fromCharCode(65 + i), x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) });
      borPar.push(i); borRk.push(0);
    }
    var perm = [], eSet = {}, usedW = {}, eid = 0;
    for (var i = 0; i < n; i++) perm.push(i);
    for (var i = n - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = perm[i]; perm[i] = perm[j]; perm[j] = t; }
    function rw() { var w; do { w = Math.floor(Math.random() * 30) + 1; } while (usedW[w]); usedW[w] = true; return w; }
    for (var i = 1; i < n; i++) {
      var u = perm[i - 1], v = perm[i];
      var ek = Math.min(u, v) + "|" + Math.max(u, v);
      if (!eSet[ek]) { eSet[ek] = true; borEdges.push({ id: eid++, u: u, v: v, weight: rw(), inMST: false, highlighted: false }); }
    }
    var att = 0;
    while (borEdges.length < 14 && att < 200) {
      var u = Math.floor(Math.random() * n), v = Math.floor(Math.random() * n);
      if (u === v) { att++; continue; }
      var ek = Math.min(u, v) + "|" + Math.max(u, v);
      if (!eSet[ek]) { eSet[ek] = true; borEdges.push({ id: eid++, u: u, v: v, weight: rw(), inMST: false, highlighted: false }); }
      att++;
    }
    borOrigEdges = JSON.parse(JSON.stringify(borEdges));
    borDraw(); borStats();
  }

  function borReset() {
    if (!borOrigEdges) return;
    borEdges = JSON.parse(JSON.stringify(borOrigEdges));
    borPar = []; borRk = [];
    for (var i = 0; i < borNodes.length; i++) { borPar.push(i); borRk.push(0); }
    borRoundN = 0; borMSTW = 0; borFinished = false; borBusy = false; borAutoRun = false;
    borDraw(); borStats();
  }

  function borNext() {
    if (borBusy || borFinished) return;
    if (borCompCount() <= 1) { borFinished = true; borAutoRun = false; borDraw(); return; }
    borBusy = true;
    var lightest = {};
    for (var i = 0; i < borEdges.length; i++) {
      var e = borEdges[i];
      if (e.inMST) continue;
      var cu = borFind(e.u), cv = borFind(e.v);
      if (cu === cv) continue;
      if (lightest[cu] === undefined || e.weight < borEdges[lightest[cu]].weight) lightest[cu] = i;
      if (lightest[cv] === undefined || e.weight < borEdges[lightest[cv]].weight) lightest[cv] = i;
    }
    if (Object.keys(lightest).length === 0) { borFinished = true; borBusy = false; borAutoRun = false; borDraw(); borStats(); return; }
    var toAdd = {};
    for (var c in lightest) { toAdd[lightest[c]] = true; borEdges[lightest[c]].highlighted = true; }
    borDraw();
    setTimeout(function () {
      borRoundN++;
      for (var idx in toAdd) {
        var e = borEdges[idx];
        if (!e.inMST) { e.inMST = true; borMSTW += e.weight; borUnion(e.u, e.v); }
        e.highlighted = false;
      }
      borEdges.forEach(function (ed) { ed.highlighted = false; });
      if (borCompCount() <= 1) borFinished = true;
      borDraw(); borStats();
      borBusy = false;
      if (borAutoRun && !borFinished) setTimeout(borNext, 350);
    }, 800);
  }

  function borRunAll() {
    if (borFinished) return;
    borAutoRun = true;
    borNext();
  }

  if (borSvg) {
    borGenerate();
    document.getElementById("btnBoruvkaNext").addEventListener("click", borNext);
    document.getElementById("btnBoruvkaRunAll").addEventListener("click", borRunAll);
    document.getElementById("btnBoruvkaNew").addEventListener("click", borGenerate);
    document.getElementById("btnBoruvkaReset").addEventListener("click", borReset);
  }

  renderMath();
})();
