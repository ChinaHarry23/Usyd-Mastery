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
        ? zh ? "查看解答" : "Show Solution"
        : zh ? "隐藏解答" : "Hide Solution";
      if (!isOpen) renderMath();
    });
  });

  // ========== MAX-CUT GRAPH STATE ==========
  var graphEdges = [];
  var graphN = 0;

  function generateGraph(n, p) {
    var edges = [];
    for (var i = 0; i < n; i++) {
      for (var j = i + 1; j < n; j++) {
        if (Math.random() < p) edges.push([i, j]);
      }
    }
    return edges;
  }

  function cutValue(n, edges, assignment) {
    var count = 0;
    for (var k = 0; k < edges.length; k++) {
      if (assignment[edges[k][0]] !== assignment[edges[k][1]]) count++;
    }
    return count;
  }

  function optimalCut(n, edges) {
    var best = 0;
    var total = 1 << n;
    for (var mask = 0; mask < total; mask++) {
      var c = 0;
      for (var k = 0; k < edges.length; k++) {
        var u = edges[k][0], v = edges[k][1];
        if (((mask >> u) & 1) !== ((mask >> v) & 1)) c++;
      }
      if (c > best) best = c;
    }
    return best;
  }

  function derandomisedCut(n, edges) {
    var bestCut = 0;
    var R = Math.ceil(Math.log2(n + 1));
    var familySize = 1 << R;
    for (var seed = 0; seed < familySize; seed++) {
      var assignment = new Array(n);
      for (var v = 0; v < n; v++) {
        var bits = v;
        var val = 0;
        for (var bit = 0; bit < R; bit++) {
          if ((seed >> bit) & 1) {
            val ^= (bits >> bit) & 1;
          }
        }
        assignment[v] = val;
      }
      var c = cutValue(n, edges, assignment);
      if (c > bestCut) bestCut = c;
    }
    return bestCut;
  }

  // ========== MAX-CUT SIMULATION ==========
  var sliderCutN = document.getElementById("sliderCutN");
  var sliderCutP = document.getElementById("sliderCutP");
  document.getElementById("valCutN").textContent = sliderCutN.value;
  document.getElementById("valCutP").textContent =
    (parseInt(sliderCutP.value) / 100).toFixed(2);

  sliderCutN.addEventListener("input", function () {
    document.getElementById("valCutN").textContent = sliderCutN.value;
  });
  sliderCutP.addEventListener("input", function () {
    document.getElementById("valCutP").textContent =
      (parseInt(sliderCutP.value) / 100).toFixed(2);
  });

  document.getElementById("btnRunCut").addEventListener("click", function () {
    var n = parseInt(sliderCutN.value);
    var p = parseInt(sliderCutP.value) / 100;
    graphN = n;
    graphEdges = generateGraph(n, p);
    var m = graphEdges.length;

    var randomAssign = new Array(n);
    for (var i = 0; i < n; i++) randomAssign[i] = Math.random() < 0.5 ? 0 : 1;
    var randomCut = cutValue(n, graphEdges, randomAssign);

    var derandCut = derandomisedCut(n, graphEdges);
    var opt = optimalCut(n, graphEdges);

    document.getElementById("cutM").textContent = m;
    document.getElementById("cutRandom").textContent = randomCut;
    document.getElementById("cutDerand").textContent = derandCut;
    document.getElementById("cutOPT").textContent = opt;

    condStep = 0;
    condAssignment = new Array(n).fill(-1);
    updateCondOutput();
  });

  // ========== CONDITIONAL EXPECTATIONS STEP-THROUGH ==========
  var condStep = 0;
  var condAssignment = [];

  function greedyStepOne() {
    if (graphN === 0 || condStep >= graphN) return false;
    var v = condStep;
    var nA = 0, nB = 0;
    for (var k = 0; k < graphEdges.length; k++) {
      var e = graphEdges[k];
      var other = -1;
      if (e[0] === v) other = e[1];
      else if (e[1] === v) other = e[0];
      if (other >= 0 && condAssignment[other] >= 0) {
        if (condAssignment[other] === 0) nA++;
        else nB++;
      }
    }
    condAssignment[v] = nB >= nA ? 0 : 1;
    condStep++;
    return true;
  }

  function updateCondOutput() {
    var out = document.getElementById("condOutput");
    if (graphN === 0) {
      out.textContent = 'Click "Generate & Run" in the Max-Cut simulation above first, then use these buttons to step through Algorithm 9.';
      return;
    }
    var lines = [];
    var currentCut = cutValue(graphN, graphEdges, condAssignment.map(function(x) { return x < 0 ? 0 : x; }));
    for (var i = 0; i < condStep; i++) {
      var side = condAssignment[i] === 0 ? "A" : "B";
      var nA = 0, nB = 0;
      for (var k = 0; k < graphEdges.length; k++) {
        var e = graphEdges[k];
        var other = -1;
        if (e[0] === i) other = e[1];
        else if (e[1] === i) other = e[0];
        if (other >= 0 && other < i && condAssignment[other] >= 0) {
          if (condAssignment[other] === 0) nA++;
          else nB++;
        }
      }
      lines.push("v" + i + " → " + side + "  (N_A=" + nA + ", N_B=" + nB + ")");
    }
    if (condStep < graphN) {
      lines.push("--- waiting: " + (graphN - condStep) + " vertices remaining ---");
    } else {
      var finalCut = cutValue(graphN, graphEdges, condAssignment);
      lines.push("=== Done! Final cut = " + finalCut + " (m/2 = " + (graphEdges.length / 2).toFixed(1) + ") ===");
    }
    out.textContent = lines.join("\n");
  }

  document.getElementById("btnStepCond").addEventListener("click", function () {
    if (graphN === 0) return;
    greedyStepOne();
    updateCondOutput();
  });

  document.getElementById("btnRunCond").addEventListener("click", function () {
    if (graphN === 0) return;
    while (condStep < graphN) greedyStepOne();
    updateCondOutput();
  });

  document.getElementById("btnResetCond").addEventListener("click", function () {
    condStep = 0;
    condAssignment = new Array(graphN).fill(-1);
    updateCondOutput();
  });

renderMath();
})();
