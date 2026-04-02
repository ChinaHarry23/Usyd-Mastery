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

  var sidebar = document.getElementById("sidebar");
  var sidebarToggle = document.getElementById("sidebarToggle");
  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("open");
  });
  document.getElementById("mainContent").addEventListener("click", function () {
    if (sidebar.classList.contains("open")) sidebar.classList.remove("open");
  });

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
  sections.forEach(function (s) { observer.observe(s); });

  document.querySelectorAll(".proof-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.dataset.target);
      var isOpen = target.classList.contains("open");
      target.classList.toggle("open");
      btn.classList.toggle("open");
      if (!isOpen) renderMath();
    });
  });

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

  // ========== MAX-SAT SIMULATOR ==========
  function randClause(n, len) {
    var lits = [], used = {};
    while (lits.length < len) {
      var v = Math.floor(Math.random() * n);
      if (used[v]) continue;
      used[v] = true;
      lits.push({ v: v, neg: Math.random() < 0.5 });
    }
    return lits;
  }

  function evalSAT(clauses, assignment) {
    var sat = 0;
    clauses.forEach(function (c) {
      for (var i = 0; i < c.length; i++) {
        var val = assignment[c[i].v];
        if (c[i].neg) val = 1 - val;
        if (val === 1) { sat++; return; }
      }
    });
    return sat;
  }

  function bruteOpt(clauses, n) {
    var best = 0;
    for (var mask = 0; mask < (1 << n); mask++) {
      var a = [];
      for (var i = 0; i < n; i++) a.push((mask >> i) & 1);
      best = Math.max(best, evalSAT(clauses, a));
    }
    return best;
  }

  var btnSat = document.getElementById("btnSatRun");
  if (btnSat) {
    btnSat.addEventListener("click", function () {
      var n = parseInt(document.getElementById("satN").value) || 6;
      var m = parseInt(document.getElementById("satM").value) || 15;
      if (n > 12) n = 12;
      var clauses = [];
      for (var j = 0; j < m; j++) clauses.push(randClause(n, 3));

      var opt = bruteOpt(clauses, n);
      document.getElementById("satOpt").textContent = opt + " / " + m;

      var naiveA = [];
      for (var i = 0; i < n; i++) naiveA.push(Math.random() < 0.5 ? 1 : 0);
      var naiveVal = evalSAT(clauses, naiveA);
      document.getElementById("satNaive").textContent = naiveVal + " / " + m;

      var lpA = [];
      for (var i2 = 0; i2 < n; i2++) {
        var pos = 0, neg = 0;
        clauses.forEach(function (c) {
          c.forEach(function (lit) {
            if (lit.v === i2) { if (lit.neg) neg++; else pos++; }
          });
        });
        var ystar = pos / (pos + neg + 1);
        lpA.push(Math.random() < ystar ? 1 : 0);
      }
      var lpVal = evalSAT(clauses, lpA);
      document.getElementById("satLP").textContent = lpVal + " / " + m;

      var bestVal = Math.max(naiveVal, lpVal);
      document.getElementById("satBest").textContent = bestVal + " / " + m;
    });
  }

renderMath();
})();
