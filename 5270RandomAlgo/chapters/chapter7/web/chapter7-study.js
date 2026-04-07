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

  // ========== JL DIMENSIONALITY REDUCTION DEMO ==========
  var sliderJLn = document.getElementById("sliderJLn");
  var sliderJLd = document.getElementById("sliderJLd");
  var sliderJLeps = document.getElementById("sliderJLeps");

  document.getElementById("valJLn").textContent = sliderJLn.value;
  document.getElementById("valJLd").textContent = sliderJLd.value;
  document.getElementById("valJLeps").textContent = (parseInt(sliderJLeps.value) / 100).toFixed(2);

  sliderJLn.addEventListener("input", function () {
    document.getElementById("valJLn").textContent = sliderJLn.value;
  });
  sliderJLd.addEventListener("input", function () {
    document.getElementById("valJLd").textContent = sliderJLd.value;
  });
  sliderJLeps.addEventListener("input", function () {
    document.getElementById("valJLeps").textContent = (parseInt(sliderJLeps.value) / 100).toFixed(2);
  });

  function gaussianRandom() {
    var u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  function generatePoints(n, d) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var p = [];
      for (var j = 0; j < d; j++) {
        p.push(gaussianRandom());
      }
      pts.push(p);
    }
    return pts;
  }

  function projectPoints(pts, d, k) {
    var M = [];
    var scale = 1.0 / Math.sqrt(k);
    for (var i = 0; i < k; i++) {
      var row = [];
      for (var j = 0; j < d; j++) {
        row.push(gaussianRandom() * scale);
      }
      M.push(row);
    }
    var projected = [];
    for (var pi = 0; pi < pts.length; pi++) {
      var p = [];
      for (var ri = 0; ri < k; ri++) {
        var sum = 0;
        for (var ci = 0; ci < d; ci++) {
          sum += M[ri][ci] * pts[pi][ci];
        }
        p.push(sum);
      }
      projected.push(p);
    }
    return projected;
  }

  function euclideanDist(a, b) {
    var sum = 0;
    for (var i = 0; i < a.length; i++) {
      var diff = a[i] - b[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  document.getElementById("btnRunJL").addEventListener("click", function () {
    var n = parseInt(sliderJLn.value);
    var d = parseInt(sliderJLd.value);
    var eps = parseInt(sliderJLeps.value) / 100;
    var k = Math.max(2, Math.ceil(4 * Math.log(n) / (eps * eps)));

    var pts = generatePoints(n, d);
    var proj = projectPoints(pts, d, k);

    var pairs = 0;
    var preserved = 0;
    var maxDistortion = 0;
    var distortions = [];

    for (var i = 0; i < n; i++) {
      for (var j = i + 1; j < n; j++) {
        var origDist = euclideanDist(pts[i], pts[j]);
        var projDist = euclideanDist(proj[i], proj[j]);
        pairs++;
        var ratio = origDist > 0 ? projDist / origDist : 1;
        var distortion = Math.abs(ratio - 1);
        distortions.push(distortion);
        if (distortion > maxDistortion) maxDistortion = distortion;
        if (distortion <= eps) preserved++;
      }
    }

    document.getElementById("jlTargetK").textContent = k;
    document.getElementById("jlPairs").textContent = pairs;
    document.getElementById("jlPreserved").textContent =
      preserved + " (" + ((preserved / pairs) * 100).toFixed(1) + "%)";
    document.getElementById("jlMaxDistort").textContent =
      (maxDistortion * 100).toFixed(1) + "%";

    var chart = document.getElementById("jlDistChart");
    var bins = 20;
    var maxBin = Math.min(1, Math.max(eps * 3, maxDistortion * 1.1));
    var binWidth = maxBin / bins;
    var counts = new Array(bins).fill(0);
    for (var di = 0; di < distortions.length; di++) {
      var bi = Math.min(bins - 1, Math.floor(distortions[di] / binWidth));
      counts[bi]++;
    }
    var maxCount = Math.max.apply(null, counts);

    var html = '<div style="display:flex; align-items:flex-end; gap:2px; height:100px;">';
    for (var b = 0; b < bins; b++) {
      var h = maxCount > 0 ? (counts[b] / maxCount) * 100 : 0;
      var inEps = (b + 0.5) * binWidth <= eps;
      var color = inEps ? "var(--green)" : "var(--red)";
      html +=
        '<div style="flex:1; height:' + h + '%; background:' + color +
        '; border-radius:2px 2px 0 0; opacity:0.8; min-width:4px;" title="' +
        ((b * binWidth * 100).toFixed(0)) + "-" + (((b + 1) * binWidth * 100).toFixed(0)) +
        '%: ' + counts[b] + ' pairs"></div>';
    }
    html += "</div>";
    html +=
      '<div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-dim); margin-top:0.3rem;">' +
      "<span>0%</span>" +
      '<span style="color:var(--accent);">\u03b5 = ' + (eps * 100).toFixed(0) + "%</span>" +
      "<span>" + (maxBin * 100).toFixed(0) + "%</span></div>";
    html +=
      '<p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.5rem; text-align:center;">' +
      "Distance distortion histogram. " +
      '<span style="color:var(--green);">Green</span> = within \u03b5, ' +
      '<span style="color:var(--red);">Red</span> = beyond \u03b5.</p>';
    chart.innerHTML = html;
  });

  document.getElementById("btnResetJL").addEventListener("click", function () {
    document.getElementById("jlTargetK").textContent = "-";
    document.getElementById("jlPairs").textContent = "-";
    document.getElementById("jlPreserved").textContent = "-";
    document.getElementById("jlMaxDistort").textContent = "-";
    document.getElementById("jlDistChart").innerHTML = "";
  });

  // ========== LSH BUCKET COLLISION VISUALIZATION ==========
  var LSH_W = 400, LSH_H = 400, LSH_N = 20;
  var SVG_NS = "http://www.w3.org/2000/svg";
  var lshQuery = { x: 200, y: 200 };
  var lshPoints = [];
  var lshHashes = [];

  function lshDist(a, b) {
    var dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function lshDistColor(d) {
    var t = Math.min(d / 200, 1);
    var h = 15 + t * 205;
    var s = 90 - t * 20;
    var l = 60 - t * 5;
    return "hsl(" + h + "," + s + "%," + l + "%)";
  }

  function lshInitPoints() {
    lshPoints = [];
    for (var i = 0; i < LSH_N; i++) {
      lshPoints.push({
        x: 25 + Math.random() * (LSH_W - 50),
        y: 25 + Math.random() * (LSH_H - 50)
      });
    }
    lshHashes = [];
  }

  function lshGenHash() {
    var angle = Math.random() * Math.PI;
    var nx = Math.cos(angle), ny = Math.sin(angle);
    var sign = Math.random() < 0.5 ? -1 : 1;
    var c = sign * (8 + Math.random() * 60);
    return { nx: nx, ny: ny, c: c };
  }

  function lshSide(h, px, py) {
    return (h.nx * (px - LSH_W / 2) + h.ny * (py - LSH_H / 2) - h.c) >= 0 ? 1 : 0;
  }

  function lshRender() {
    var svg = document.getElementById("lshCanvas");
    svg.innerHTML = "";
    var total = lshHashes.length;
    var qSides = [];
    for (var hi = 0; hi < total; hi++) {
      qSides.push(lshSide(lshHashes[hi], lshQuery.x, lshQuery.y));
    }

    for (var hi2 = 0; hi2 < total; hi2++) {
      var h = lshHashes[hi2];
      var lx = LSH_W / 2 + h.c * h.nx;
      var ly = LSH_H / 2 + h.c * h.ny;
      var dx = -h.ny * 400, dy = h.nx * 400;
      var line = document.createElementNS(SVG_NS, "line");
      line.setAttribute("x1", lx - dx);
      line.setAttribute("y1", ly - dy);
      line.setAttribute("x2", lx + dx);
      line.setAttribute("y2", ly + dy);
      line.setAttribute("stroke", "rgba(108,140,255,0.25)");
      line.setAttribute("stroke-width", "1.5");
      line.setAttribute("stroke-dasharray", "6,4");
      svg.appendChild(line);
    }

    var bucketN = 0, filteredN = 0;
    var nearMatch = 0, nearTotal = 0, farMatch = 0, farTotal = 0;
    var NEAR_THRESH = 120;

    for (var i = 0; i < lshPoints.length; i++) {
      var p = lshPoints[i];
      var d = lshDist(p, lshQuery);
      var allMatch = true;
      for (var hj = 0; hj < total; hj++) {
        if (lshSide(lshHashes[hj], p.x, p.y) !== qSides[hj]) {
          allMatch = false;
          break;
        }
      }
      if (total > 0) {
        if (allMatch) bucketN++; else filteredN++;
        if (d < NEAR_THRESH) { nearTotal++; if (allMatch) nearMatch++; }
        else { farTotal++; if (allMatch) farMatch++; }
      }

      var circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("cx", p.x);
      circle.setAttribute("cy", p.y);
      circle.setAttribute("r", 8);
      circle.setAttribute("fill", lshDistColor(d));
      if (total > 0) {
        circle.setAttribute("stroke", allMatch ? "#34d399" : "#4b5563");
        circle.setAttribute("stroke-width", allMatch ? "3" : "1.5");
        circle.setAttribute("opacity", allMatch ? "1" : "0.25");
      } else {
        circle.setAttribute("stroke", "rgba(255,255,255,0.25)");
        circle.setAttribute("stroke-width", "1");
      }
      svg.appendChild(circle);
    }

    var qc = document.createElementNS(SVG_NS, "circle");
    qc.setAttribute("cx", lshQuery.x);
    qc.setAttribute("cy", lshQuery.y);
    qc.setAttribute("r", 13);
    qc.setAttribute("fill", "#fbbf24");
    qc.setAttribute("stroke", "#fff");
    qc.setAttribute("stroke-width", "2.5");
    svg.appendChild(qc);
    var qt = document.createElementNS(SVG_NS, "text");
    qt.setAttribute("x", lshQuery.x);
    qt.setAttribute("y", lshQuery.y - 19);
    qt.setAttribute("text-anchor", "middle");
    qt.setAttribute("fill", "#fbbf24");
    qt.setAttribute("font-size", "11");
    qt.setAttribute("font-weight", "600");
    qt.textContent = "Query";
    svg.appendChild(qt);

    document.getElementById("lshHashCount").textContent = total;
    document.getElementById("lshBucketNbrs").textContent = total > 0 ? bucketN : "\u2014";
    document.getElementById("lshFilteredOut").textContent = total > 0 ? filteredN : "\u2014";
    document.getElementById("lshProbNear").textContent =
      nearTotal > 0 ? (nearMatch / nearTotal * 100).toFixed(0) + "% (" + nearMatch + "/" + nearTotal + ")" : "\u2014";
    document.getElementById("lshProbFar").textContent =
      farTotal > 0 ? (farMatch / farTotal * 100).toFixed(0) + "% (" + farMatch + "/" + farTotal + ")" : "\u2014";
  }

  lshInitPoints();
  lshRender();

  document.getElementById("sliderLshK").addEventListener("input", function () {
    document.getElementById("valLshK").textContent = this.value;
  });
  document.getElementById("btnLshHash").addEventListener("click", function () {
    lshHashes.push(lshGenHash());
    lshRender();
  });
  document.getElementById("btnLshRunK").addEventListener("click", function () {
    var k = parseInt(document.getElementById("sliderLshK").value);
    lshHashes = [];
    for (var i = 0; i < k; i++) lshHashes.push(lshGenHash());
    lshRender();
  });
  document.getElementById("btnLshReset").addEventListener("click", function () {
    lshInitPoints();
    lshRender();
  });

renderMath();
})();
