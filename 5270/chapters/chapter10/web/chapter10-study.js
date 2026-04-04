(function () {
  "use strict";
  var renderMath = window.chapterRenderMath || function () {};

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

})();
