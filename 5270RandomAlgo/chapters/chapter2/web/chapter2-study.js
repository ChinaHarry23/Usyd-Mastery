(function () {
  "use strict";
  var renderMath = window.chapterRenderMath || function () {};

  // ========== INTERACTIVE: TAIL BOUND COMPARISON ==========
  var sliderN = document.getElementById("sliderN");
  var sliderP = document.getElementById("sliderP");
  var sliderT = document.getElementById("sliderT");

  function updateBounds() {
    var n = parseInt(sliderN.value);
    var p = parseInt(sliderP.value) / 100;
    var t = parseInt(sliderT.value);
    document.getElementById("valN").textContent = n;
    document.getElementById("valP").textContent = p.toFixed(2);
    document.getElementById("valT").textContent = t;

    var mu = n * p;
    var variance = n * p * (1 - p);

    var markov = t > 0 ? Math.min(1, mu / t) : 1;
    var chebyshev =
      t > mu ? Math.min(1, variance / Math.pow(t - mu, 2)) : 1;

    var chernoff = 1;
    if (t > mu && mu > 0) {
      var gamma = t / mu - 1;
      if (gamma > 0 && gamma <= 1) {
        chernoff = Math.min(1, Math.exp((-gamma * gamma * mu) / 3));
      } else if (gamma > 1) {
        chernoff = Math.min(1, Math.exp((-gamma * mu) / 3));
      }
    }

    var hoeffding = 1;
    if (t > mu) {
      var diff = t - mu;
      hoeffding = Math.min(1, Math.exp((-2 * diff * diff) / n));
    }

    document.getElementById("boundMarkov").textContent =
      markov >= 1 ? "≥ 1 (vacuous)" : markov.toFixed(4);
    document.getElementById("boundChebyshev").textContent =
      chebyshev >= 1 ? "≥ 1 (vacuous)" : chebyshev.toFixed(4);
    document.getElementById("boundChernoff").textContent =
      chernoff >= 1 ? "≥ 1 (vacuous)" : chernoff.toFixed(6);
    document.getElementById("boundHoeffding").textContent =
      hoeffding >= 1 ? "≥ 1 (vacuous)" : hoeffding.toFixed(6);

    var best = "Markov";
    var bestVal = markov;
    if (chebyshev < bestVal) {
      bestVal = chebyshev;
      best = "Chebyshev";
    }
    if (chernoff < bestVal) {
      bestVal = chernoff;
      best = "Chernoff";
    }
    if (hoeffding < bestVal) {
      bestVal = hoeffding;
      best = "Hoeffding";
    }
    var zh = typeof getLang === "function" && getLang() === "zh";
    document.getElementById("boundsVerdict").textContent = zh
      ? "最紧的界: " + best + " (" + bestVal.toFixed(6) + ")"
      : "Tightest bound: " + best + " (" + bestVal.toFixed(6) + ")";
  }

  sliderN.addEventListener("input", updateBounds);
  sliderP.addEventListener("input", updateBounds);
  sliderT.addEventListener("input", updateBounds);
  updateBounds();

  // ========== INTERACTIVE: RANDOMISED MEDIAN ==========
  var MED_N = 10001;
  var MED_TRUE = 5001;
  var medTrials = 0, medSucc = 0, medFail = 0;
  var medAnimating = false;

  function generateArray(n) {
    var arr = [];
    for (var i = 1; i <= n; i++) arr.push(i);
    for (var j = arr.length - 1; j > 0; j--) {
      var r = Math.floor(Math.random() * (j + 1));
      var tmp = arr[j]; arr[j] = arr[r]; arr[r] = tmp;
    }
    return arr;
  }

  function randomisedMedianDetailed(arr) {
    var n = arr.length;
    var m = Math.round(Math.pow(n, 2 / 3));
    var delta = Math.round(4 * Math.sqrt(m));
    var steps = { n: n, m: m, delta: delta };

    var B = [];
    for (var i = 0; i < m; i++) B.push(arr[Math.floor(Math.random() * n)]);
    B.sort(function (a, b) { return a - b; });
    steps.B = B;

    var loIdx = Math.floor(m / 2) - delta;
    var hiIdx = Math.floor(m / 2) + delta;
    steps.loIdx = loIdx;
    steps.hiIdx = hiIdx;

    if (loIdx < 0 || hiIdx >= m) {
      steps.failReason = "index_oob";
      return steps;
    }

    var bLow = B[loIdx], bHigh = B[hiIdx];
    steps.bLow = bLow;
    steps.bHigh = bHigh;

    var C = [], k = 0, l = 0;
    for (var j = 0; j < n; j++) {
      if (arr[j] < bLow) k++;
      else if (arr[j] > bHigh) l++;
      else C.push(arr[j]);
    }
    steps.k = k;
    steps.l = l;
    steps.cSize = C.length;
    steps.maxC = Math.floor(16 * n / Math.sqrt(m)) + 2;

    if (k > n / 2 || l > n / 2) { steps.failReason = "E1_E2"; return steps; }
    if (C.length > steps.maxC) { steps.failReason = "E3"; return steps; }

    C.sort(function (a, b) { return a - b; });
    var idx = Math.floor((n + 1) / 2) - k - 1;
    if (idx < 0 || idx >= C.length) { steps.failReason = "idx_oob"; return steps; }

    steps.result = C[idx];
    steps.success = true;
    return steps;
  }

  function updateMedianStats(success, value) {
    medTrials++;
    if (success) medSucc++; else medFail++;
    var zh = typeof getLang === "function" && getLang() === "zh";
    document.getElementById("medianResult").textContent = success
      ? (zh ? "成功: " : "OK: ") + value
      : (zh ? "失败" : "FAIL");
    document.getElementById("medianResult").style.color = success ? "var(--green)" : "var(--red)";
    document.getElementById("medianTrials").textContent = medTrials;
    document.getElementById("medianSucc").textContent = medSucc;
    document.getElementById("medianFail").textContent = medFail;
    document.getElementById("medianRate").textContent =
      ((medSucc / medTrials) * 100).toFixed(1) + "%";
  }

  function animateMedian() {
    if (medAnimating) return;
    medAnimating = true;
    var stepsEl = document.getElementById("medianSteps");
    stepsEl.innerHTML = "";
    var zh = typeof getLang === "function" && getLang() === "zh";

    var arr = generateArray(MED_N);
    var s = randomisedMedianDetailed(arr);

    var stepData = [];

    stepData.push({
      title: zh ? "步骤 1：设定参数" : "Step 1: Set Parameters",
      html: (zh
        ? "<code>n = " + s.n + "</code>, <code>m = n<sup>2/3</sup> = " + s.m + "</code>, <code>\u0394 = 4\u221Am = " + s.delta + "</code>"
        : "<code>n = " + s.n + "</code>, <code>m = n<sup>2/3</sup> = " + s.m + "</code>, <code>\u0394 = 4\u221Am = " + s.delta + "</code>")
    });

    var bMin = s.B[0], bMax = s.B[s.B.length - 1];
    var bMed = s.B[Math.floor(s.B.length / 2)];
    stepData.push({
      title: zh ? "步骤 2：随机抽样并排序 B" : "Step 2: Sample & Sort B",
      html: (zh
        ? "从 A 中随机抽取 <strong>" + s.m + "</strong> 个元素组成 B 并排序。"
        : "Sampled <strong>" + s.m + "</strong> random elements from A into B, then sorted.") +
        "<br><span style='color:var(--text-dim);font-size:0.82rem;'>" +
        (zh ? "B 的范围" : "B range") + ": [" + bMin + " ... " + bMed + " ... " + bMax + "]</span>",
      bar: true, bLow: s.bLow, bHigh: s.bHigh
    });

    if (s.failReason === "index_oob") {
      stepData.push({
        title: zh ? "失败：索引越界" : "FAIL: Index Out of Bounds",
        html: "<span style='color:var(--red);'>" + (zh ? "\u0394 太大，无法提取近似中位数。" : "\u0394 is too large to extract approximate medians.") + "</span>",
        fail: true
      });
    } else {
      stepData.push({
        title: zh ? "步骤 3：确定守卫 b⁻ 和 b⁺" : "Step 3: Pick Guards b\u207B and b\u207A",
        html: "<code>b<sup>\u2212</sup> = B[" + s.loIdx + "] = " + s.bLow + "</code> &nbsp;&nbsp; <code>b<sup>+</sup> = B[" + s.hiIdx + "] = " + s.bHigh + "</code>" +
          "<br><span style='color:var(--text-dim);font-size:0.82rem;'>" +
          (zh ? "这些是 B 中的\u2018近似中位数\u2019，用于筛选 A" : "These are 'approximate medians' from B used to filter A") + "</span>",
        bar: true, bLow: s.bLow, bHigh: s.bHigh
      });

      stepData.push({
        title: zh ? "步骤 4：筛选得到 C" : "Step 4: Filter into C",
        html: (zh
          ? "保留 A 中满足 <code>" + s.bLow + " \u2264 x \u2264 " + s.bHigh + "</code> 的元素。"
          : "Keep elements of A with <code>" + s.bLow + " \u2264 x \u2264 " + s.bHigh + "</code>.") +
          "<br><code>k = " + s.k + "</code> " + (zh ? "(比 b⁻ 小)" : "(below b\u207B)") +
          ", <code>|C| = " + s.cSize + "</code>" +
          ", <code>\u2113 = " + s.l + "</code> " + (zh ? "(比 b⁺ 大)" : "(above b\u207A)") +
          "<br><span style='color:var(--text-dim);font-size:0.82rem;'>" +
          (zh ? "C 的大小上限" : "Max allowed |C|") + " = " + s.maxC + "</span>",
        bar: true, bLow: s.bLow, bHigh: s.bHigh, k: s.k, l: s.l, cSize: s.cSize
      });

      if (s.failReason === "E1_E2") {
        stepData.push({
          title: zh ? "失败：事件 E₁ 或 E₂" : "FAIL: Event E\u2081 or E\u2082",
          html: "<span style='color:var(--red);'>" + (zh ? "k 或 \u2113 超过 n/2 — 中位数不在 C 中！" : "k or \u2113 exceeds n/2 \u2014 median can't be in C!") + "</span>",
          fail: true
        });
      } else if (s.failReason === "E3") {
        stepData.push({
          title: zh ? "失败：事件 E₃" : "FAIL: Event E\u2083",
          html: "<span style='color:var(--red);'>|C| = " + s.cSize + " > " + s.maxC + " — " + (zh ? "C 太大，无法高效处理！" : "C is too large to process efficiently!") + "</span>",
          fail: true
        });
      } else if (s.failReason === "idx_oob") {
        stepData.push({
          title: zh ? "失败：C 中索引越界" : "FAIL: Index out of range in C",
          html: "<span style='color:var(--red);'>" + (zh ? "计算的索引超出 C 的范围。" : "Computed index fell outside C.") + "</span>",
          fail: true
        });
      } else {
        stepData.push({
          title: zh ? "步骤 5：在 C 中找到中位数！" : "Step 5: Found Median in C!",
          html: "<span style='color:var(--green); font-size:1.1rem; font-weight:700;'>" +
            (zh ? "结果 = " : "Result = ") + s.result + "</span>" +
            (s.result === MED_TRUE
              ? " &nbsp; <span style='color:var(--green);'>\u2714 " + (zh ? "正确！" : "Correct!") + "</span>"
              : " &nbsp; <span style='color:var(--red);'>\u2718 " + (zh ? "错误" : "Wrong") + " (true = " + MED_TRUE + ")</span>"),
          success: true
        });
      }
    }

    var delay = 0;
    stepData.forEach(function (sd, idx) {
      delay += 500;
      setTimeout(function () {
        var box = document.createElement("div");
        box.style.cssText = "background:var(--bg-card); border:1px solid var(--border); border-radius:var(--radius-sm); padding:1rem 1.25rem; margin-bottom:0.75rem; opacity:0; transform:translateY(12px); transition:all 0.4s ease;";
        if (sd.fail) box.style.borderColor = "var(--red)";
        if (sd.success) box.style.borderColor = "var(--green)";
        box.innerHTML = "<div style='font-weight:600; margin-bottom:0.4rem; font-size:0.9rem;'>" + sd.title + "</div>" +
          "<div style='font-size:0.88rem; line-height:1.6;'>" + sd.html + "</div>" +
          (sd.bar ? buildBarViz(sd) : "");
        stepsEl.appendChild(box);
        requestAnimationFrame(function () {
          box.style.opacity = "1";
          box.style.transform = "translateY(0)";
        });
        if (idx === stepData.length - 1) {
          var ok = !!s.success;
          updateMedianStats(ok, ok ? s.result : null);
          medAnimating = false;
        }
      }, delay);
    });
  }

  function buildBarViz(sd) {
    if (!sd.bLow || !sd.bHigh) return "";
    var lo = sd.bLow, hi = sd.bHigh, n = MED_N;
    var loP = ((lo - 1) / n * 100).toFixed(1);
    var hiP = ((hi - 1) / n * 100).toFixed(1);
    var medP = ((MED_TRUE - 1) / n * 100).toFixed(1);
    var zh = typeof getLang === "function" && getLang() === "zh";
    return '<div style="position:relative; height:28px; background:rgba(255,255,255,0.04); border-radius:6px; margin-top:0.75rem; overflow:hidden;">' +
      '<div style="position:absolute; left:' + loP + '%; right:' + (100 - parseFloat(hiP)) + '%; top:0; bottom:0; background:rgba(108,140,255,0.2); border-left:2px solid var(--accent); border-right:2px solid var(--accent);"></div>' +
      '<div style="position:absolute; left:' + medP + '%; top:0; bottom:0; width:2px; background:var(--green);"></div>' +
      '<div style="position:absolute; left:calc(' + medP + '% + 6px); top:4px; font-size:0.7rem; color:var(--green);">' + (zh ? "真中位数" : "true median") + '</div>' +
      '</div>' +
      '<div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-dim); margin-top:2px;"><span>1</span><span>b\u207B=' + lo + '</span><span>b\u207A=' + hi + '</span><span>' + n + '</span></div>';
  }

  document.getElementById("btnStepMedian").addEventListener("click", animateMedian);

  document.getElementById("btnRunMedian100").addEventListener("click", function () {
    document.getElementById("medianSteps").innerHTML = "";
    for (var i = 0; i < 100; i++) {
      var arr = generateArray(MED_N);
      var s = randomisedMedianDetailed(arr);
      updateMedianStats(!!s.success, s.success ? s.result : null);
    }
  });

  document.getElementById("btnResetMedian").addEventListener("click", function () {
    medTrials = medSucc = medFail = 0;
    medAnimating = false;
    document.getElementById("medianSteps").innerHTML = "";
    document.getElementById("medianResult").textContent = "-";
    document.getElementById("medianResult").style.color = "";
    document.getElementById("medianTrials").textContent = "0";
    document.getElementById("medianSucc").textContent = "0";
    document.getElementById("medianFail").textContent = "0";
    document.getElementById("medianRate").textContent = "-";
  });

  // ========== INTERACTIVE: AMPLIFICATION DEMO ==========
  var sliderAmpT = document.getElementById("sliderAmpT");
  document.getElementById("valAmpT").textContent = sliderAmpT.value;
  sliderAmpT.addEventListener("input", function () {
    document.getElementById("valAmpT").textContent = sliderAmpT.value;
  });

  document.getElementById("btnRunAmp").addEventListener("click", function () {
    var T = parseInt(sliderAmpT.value);
    var pCorrect = 0.6;
    var errors = 0;
    var trials = 1000;
    for (var trial = 0; trial < trials; trial++) {
      var correct = 0;
      for (var t = 0; t < T; t++) {
        if (Math.random() < pCorrect) correct++;
      }
      if (correct < T / 2) errors++;
    }
    var chernoffBound = Math.min(1, Math.exp(-T / 120));
    document.getElementById("ampTheory").textContent =
      chernoffBound.toFixed(6);
    document.getElementById("ampEmpirical").textContent =
      (errors / trials).toFixed(4);
  });

})();
