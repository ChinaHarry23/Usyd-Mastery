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

  // ========== MWU WEIGHT EVOLUTION SIMULATOR ==========
  var simState = null;

  function initSim() {
    var n = parseInt(document.getElementById("simNumExperts").value);
    var beta = parseFloat(document.getElementById("simBeta").value);
    var weights = [];
    var costs = [];
    for (var i = 0; i < n; i++) {
      weights.push(1);
      costs.push(0);
    }
    simState = {
      n: n,
      beta: beta,
      weights: weights,
      costs: costs,
      round: 0,
      ourCost: 0,
      history: []
    };
    updateSimDisplay();
  }

  function getExpertAdvice(n, round) {
    var advice = [];
    for (var i = 0; i < n; i++) {
      advice.push((round + i) % 2);
    }
    return advice;
  }

  function getTruth(mode, advice, weights, round) {
    if (mode === "random") {
      return Math.random() < 0.5 ? 0 : 1;
    }
    if (mode === "one-good") {
      return advice[0];
    }
    var w0 = 0, w1 = 0;
    for (var i = 0; i < advice.length; i++) {
      if (advice[i] === 0) w0 += weights[i];
      else w1 += weights[i];
    }
    return w0 >= w1 ? 1 : 0;
  }

  function simStep() {
    if (!simState) initSim();
    var s = simState;
    var mode = document.getElementById("simMode").value;
    s.round++;
    var advice = getExpertAdvice(s.n, s.round);
    var truth = getTruth(mode, advice, s.weights, s.round);

    var W = 0;
    for (var i = 0; i < s.n; i++) W += s.weights[i];
    var w0 = 0, w1 = 0;
    for (var i = 0; i < s.n; i++) {
      if (advice[i] === 0) w0 += s.weights[i];
      else w1 += s.weights[i];
    }
    var prediction = w0 >= w1 ? 0 : 1;
    var mistake = prediction !== truth;
    if (mistake) s.ourCost++;

    var wrongExperts = [];
    for (var i = 0; i < s.n; i++) {
      if (advice[i] !== truth) {
        s.weights[i] *= s.beta;
        s.costs[i]++;
        wrongExperts.push(i + 1);
      }
    }

    var line = "t=" + s.round + ": truth=" + truth + " pred=" + prediction;
    if (mistake) line += " MISTAKE";
    if (wrongExperts.length > 0) line += " | penalised: A" + wrongExperts.join(",A");
    s.history.push(line);

    updateSimDisplay();
  }

  function updateSimDisplay() {
    if (!simState) return;
    var s = simState;
    document.getElementById("simRound").textContent = s.round;
    document.getElementById("simOurCost").textContent = s.ourCost;
    var bestCost = Math.min.apply(null, s.costs);
    document.getElementById("simBestCost").textContent = bestCost;
    document.getElementById("simRegret").textContent = s.ourCost - bestCost;

    var maxW = Math.max.apply(null, s.weights);
    if (maxW === 0) maxW = 1;
    var barsDiv = document.getElementById("simWeightBars");
    var html = "";
    for (var i = 0; i < s.n; i++) {
      var pct = (s.weights[i] / maxW) * 100;
      var colors = ["var(--accent)", "var(--green)", "var(--purple)", "var(--yellow)", "var(--red)",
                    "#f97316", "#06b6d4", "#8b5cf6", "#ec4899", "#14b8a6"];
      var color = colors[i % colors.length];
      html += '<div style="display:flex; align-items:center; gap:0.5rem;">';
      html += '<span style="font-size:0.78rem; min-width:2.5rem; color:var(--text-muted);">A' + (i + 1) + '</span>';
      html += '<div style="flex:1; height:18px; background:var(--bg-card); border-radius:4px; border:1px solid var(--border); overflow:hidden;">';
      html += '<div style="height:100%; width:' + pct + '%; background:' + color + '; border-radius:3px; transition:width 0.3s;"></div>';
      html += '</div>';
      html += '<span style="font-size:0.72rem; min-width:4rem; color:var(--text-muted);">' + s.weights[i].toFixed(4) + ' (err:' + s.costs[i] + ')</span>';
      html += '</div>';
    }
    barsDiv.innerHTML = html;

    var histDiv = document.getElementById("simHistory");
    histDiv.textContent = s.history.join("\n");
    histDiv.scrollTop = histDiv.scrollHeight;
  }

  document.getElementById("btnSimStep").addEventListener("click", simStep);
  document.getElementById("btnSim10").addEventListener("click", function () {
    for (var i = 0; i < 10; i++) simStep();
  });
  document.getElementById("btnSim50").addEventListener("click", function () {
    for (var i = 0; i < 50; i++) simStep();
  });
  document.getElementById("btnSimReset").addEventListener("click", function () {
    simState = null;
    initSim();
  });

  document.getElementById("simNumExperts").addEventListener("change", function () { simState = null; initSim(); });
  document.getElementById("simBeta").addEventListener("change", function () { simState = null; initSim(); });
  document.getElementById("simMode").addEventListener("change", function () { simState = null; initSim(); });

  initSim();

  // ========== HALVING ALGORITHM SURVIVOR SET SIMULATOR ==========
  var halvingState = null;
  var halvingAutoTimer = null;
  var HALVING_N = 16;
  var HALVING_PERFECT = 6; // 0-indexed, expert #7

  function initHalving() {
    halvingState = {
      n: HALVING_N,
      perfect: HALVING_PERFECT,
      alive: [],
      round: 0,
      mistakes: 0,
      chartData: [HALVING_N]
    };
    for (var i = 0; i < HALVING_N; i++) halvingState.alive.push(true);
    if (halvingAutoTimer) { clearInterval(halvingAutoTimer); halvingAutoTimer = null; }
    document.getElementById("btnHalvingAuto").textContent = "Auto Play";
    renderHalvingGrid();
    updateHalvingStats();
    renderHalvingChart();
    document.getElementById("halvingRoundInfo").innerHTML = "Press <strong>Next Round</strong> to begin.";
  }

  function renderHalvingGrid() {
    var grid = document.getElementById("halvingGrid");
    var s = halvingState;
    var html = "";
    var expertColors = [
      "#6c8cff","#34d399","#a78bfa","#fbbf24","#f87171",
      "#f97316","#06b6d4","#8b5cf6","#ec4899","#14b8a6",
      "#60a5fa","#fb923c","#4ade80","#c084fc","#facc15","#f472b6"
    ];
    for (var i = 0; i < s.n; i++) {
      var bg = s.alive[i] ? expertColors[i % expertColors.length] : "transparent";
      var opacity = s.alive[i] ? "1" : "0.2";
      var border = i === s.perfect ? "2px solid var(--yellow)" : "1px solid " + (s.alive[i] ? "transparent" : "var(--border)");
      var textDec = s.alive[i] ? "none" : "line-through";
      var textCol = s.alive[i] ? "#fff" : "var(--text-dim)";
      var bgFinal = s.alive[i] ? bg : "var(--bg)";
      html += '<div style="display:flex;align-items:center;justify-content:center;aspect-ratio:1;border-radius:8px;font-size:0.82rem;font-weight:700;color:' + textCol + ';background:' + bgFinal + ';border:' + border + ';opacity:' + opacity + ';text-decoration:' + textDec + ';transition:all 0.4s ease;position:relative;">';
      html += (i + 1);
      if (i === s.perfect && s.alive[i]) {
        html += '<span style="position:absolute;top:-4px;right:-4px;font-size:0.6rem;background:var(--yellow);color:#000;border-radius:50%;width:14px;height:14px;display:flex;align-items:center;justify-content:center;">&#9733;</span>';
      }
      html += '</div>';
    }
    grid.innerHTML = html;
  }

  function updateHalvingStats() {
    var s = halvingState;
    var survivors = 0;
    for (var i = 0; i < s.n; i++) if (s.alive[i]) survivors++;
    document.getElementById("halvingRound").textContent = s.round;
    document.getElementById("halvingSurvivors").textContent = survivors;
    document.getElementById("halvingMistakes").textContent = s.mistakes;
    document.getElementById("halvingBound").textContent = Math.floor(Math.log2(HALVING_N));
  }

  function renderHalvingChart() {
    var container = document.getElementById("halvingChart");
    var data = halvingState.chartData;
    var maxVal = HALVING_N;
    var w = container.clientWidth - 16;
    var h = container.clientHeight - 16;
    if (w <= 0 || h <= 0) return;
    var barW = Math.min(32, Math.floor(w / Math.max(data.length, 1)) - 2);
    var svg = '<svg width="' + w + '" height="' + h + '" style="display:block;">';
    for (var g = 0; g <= 4; g++) {
      var gy = h - (g / 4) * h;
      svg += '<line x1="0" y1="' + gy + '" x2="' + w + '" y2="' + gy + '" stroke="var(--border)" stroke-dasharray="3,3"/>';
      svg += '<text x="2" y="' + (gy - 3) + '" fill="var(--text-dim)" font-size="9">' + Math.round(maxVal * g / 4) + '</text>';
    }
    for (var i = 0; i < data.length; i++) {
      var barH = (data[i] / maxVal) * (h - 4);
      var x = i * (barW + 2) + 30;
      if (x + barW > w) break;
      var isMistakeRound = i > 0 && data[i] < data[i - 1];
      var color = isMistakeRound ? "var(--red)" : "var(--accent)";
      svg += '<rect x="' + x + '" y="' + (h - barH) + '" width="' + barW + '" height="' + barH + '" fill="' + color + '" rx="2" opacity="0.8"/>';
    }
    svg += '</svg>';
    container.innerHTML = svg;
  }

  function halvingStep() {
    if (!halvingState) initHalving();
    var s = halvingState;
    var survivors = [];
    for (var i = 0; i < s.n; i++) if (s.alive[i]) survivors.push(i);
    if (survivors.length <= 1) {
      document.getElementById("halvingRoundInfo").innerHTML = '<span style="color:var(--green);">Algorithm complete! Only ' + survivors.length + ' expert(s) remain.</span>';
      if (halvingAutoTimer) { clearInterval(halvingAutoTimer); halvingAutoTimer = null; document.getElementById("btnHalvingAuto").textContent = "Auto Play"; }
      return;
    }

    s.round++;
    var truth = Math.random() < 0.5 ? 1 : 0;
    var predictions = [];
    for (var i = 0; i < s.n; i++) {
      if (i === s.perfect) { predictions.push(truth); }
      else { predictions.push(Math.random() < 0.5 ? 1 : 0); }
    }

    var vote0 = 0, vote1 = 0;
    for (var j = 0; j < survivors.length; j++) {
      if (predictions[survivors[j]] === 0) vote0++;
      else vote1++;
    }
    var algPrediction = vote0 >= vote1 ? 0 : 1;
    var isMistake = algPrediction !== truth;
    if (isMistake) s.mistakes++;

    var eliminated = [];
    for (var j = 0; j < survivors.length; j++) {
      var idx = survivors[j];
      if (predictions[idx] !== truth) {
        s.alive[idx] = false;
        eliminated.push(idx + 1);
      }
    }

    var newSurvivorCount = 0;
    for (var i = 0; i < s.n; i++) if (s.alive[i]) newSurvivorCount++;
    s.chartData.push(newSurvivorCount);

    var info = 'Round ' + s.round + ': truth=<strong>' + truth + '</strong>, majority vote=<strong>' + algPrediction + '</strong>';
    if (isMistake) {
      info += ' <span style="color:var(--red);font-weight:700;">MISTAKE!</span>';
      info += ' | Eliminated: ' + eliminated.join(', ') + ' (' + eliminated.length + ' experts, >half)';
    } else {
      info += ' <span style="color:var(--green);">Correct</span>';
      if (eliminated.length > 0) info += ' | Eliminated: ' + eliminated.join(', ');
    }
    document.getElementById("halvingRoundInfo").innerHTML = info;

    renderHalvingGrid();
    updateHalvingStats();
    renderHalvingChart();
    renderMath();
  }

  document.getElementById("btnHalvingStep").addEventListener("click", halvingStep);
  document.getElementById("btnHalvingAuto").addEventListener("click", function () {
    if (halvingAutoTimer) {
      clearInterval(halvingAutoTimer);
      halvingAutoTimer = null;
      this.textContent = "Auto Play";
    } else {
      this.textContent = "Pause";
      halvingAutoTimer = setInterval(halvingStep, 1000);
    }
  });
  document.getElementById("btnHalvingReset").addEventListener("click", function () {
    initHalving();
  });

  initHalving();

renderMath();
})();
