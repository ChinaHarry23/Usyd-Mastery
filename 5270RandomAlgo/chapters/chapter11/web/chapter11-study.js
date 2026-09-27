(function () {
  "use strict";
  var renderMath = window.chapterRenderMath || function () {};

  // ========== UNIFORMITY TESTING SIMULATOR ==========
  function generateUniform(n, k) {
    var samples = [];
    for (var i = 0; i < n; i++) {
      samples.push(Math.floor(Math.random() * k));
    }
    return samples;
  }

  function generateSkewed(n, k) {
    var probs = [];
    var total = 0;
    for (var i = 0; i < k; i++) {
      var w = (i < k / 5) ? 3 : 0.5;
      probs.push(w);
      total += w;
    }
    for (var i = 0; i < k; i++) probs[i] /= total;

    var cdf = [probs[0]];
    for (var i = 1; i < k; i++) cdf.push(cdf[i - 1] + probs[i]);

    var samples = [];
    for (var i = 0; i < n; i++) {
      var r = Math.random();
      for (var j = 0; j < k; j++) {
        if (r <= cdf[j]) { samples.push(j); break; }
      }
    }
    return samples;
  }

  function countCollisions(samples) {
    var counts = {};
    for (var i = 0; i < samples.length; i++) {
      var s = samples[i];
      counts[s] = (counts[s] || 0) + 1;
    }
    var Z = 0;
    for (var key in counts) {
      var c = counts[key];
      Z += c * (c - 1) / 2;
    }
    return Z;
  }

  function computeThreshold(n, k, eps) {
    return (n * (n - 1) / 2) * (1 + 2 * eps * eps) / k;
  }

  function runSingleTest(isUniform) {
    var k = parseInt(document.getElementById("simK").value);
    var n = parseInt(document.getElementById("simN").value);
    var eps = parseFloat(document.getElementById("simEps").value);

    var samples = isUniform ? generateUniform(n, k) : generateSkewed(n, k);
    var Z = countCollisions(samples);
    var tau = computeThreshold(n, k, eps);

    document.getElementById("simCollisions").textContent = Z;
    document.getElementById("simThreshold").textContent = tau.toFixed(1);

    var reject = Z > tau;
    var decEl = document.getElementById("simDecision");
    var zh = typeof getLang === "function" && getLang() === "zh";
    if (reject) {
      decEl.textContent = zh ? "\u67e5\u770b\u89e3\u7b54" : "REJECT";
      decEl.style.color = "var(--red)";
    } else {
      decEl.textContent = zh ? "\u67e5\u770b\u89e3\u7b54" : "ACCEPT";
      decEl.style.color = "var(--green)";
    }
    document.getElementById("simAccuracy").textContent = "-";
    document.getElementById("simHistogram").textContent = "";
  }

  function runManyTrials() {
    var k = parseInt(document.getElementById("simK").value);
    var n = parseInt(document.getElementById("simN").value);
    var eps = parseFloat(document.getElementById("simEps").value);
    var tau = computeThreshold(n, k, eps);
    var trials = 100;

    var uniformCorrect = 0;
    var skewedCorrect = 0;

    for (var t = 0; t < trials; t++) {
      var uSamples = generateUniform(n, k);
      var uZ = countCollisions(uSamples);
      if (uZ <= tau) uniformCorrect++;

      var sSamples = generateSkewed(n, k);
      var sZ = countCollisions(sSamples);
      if (sZ > tau) skewedCorrect++;
    }

    var totalCorrect = uniformCorrect + skewedCorrect;
    var accuracy = (totalCorrect / (2 * trials) * 100).toFixed(1);
    document.getElementById("simAccuracy").textContent = accuracy + "%";

    var zh = typeof getLang === "function" && getLang() === "zh";
    document.getElementById("simHistogram").innerHTML =
      (zh ? "100\u6b21\u8bd5\u9a8c: " : "100 trials: ") +
      (zh ? "\u5747\u5300\u6b63\u786e\u63a5\u53d7 " : "Uniform correctly accepted ") +
      uniformCorrect + "/100, " +
      (zh ? "\u504f\u659c\u6b63\u786e\u62d2\u7edd " : "Skewed correctly rejected ") +
      skewedCorrect + "/100";

    document.getElementById("simCollisions").textContent = "-";
    document.getElementById("simThreshold").textContent = tau.toFixed(1);
    document.getElementById("simDecision").textContent = "-";
    document.getElementById("simDecision").style.color = "";
  }

  document.getElementById("btnTestUniform").addEventListener("click", function () {
    runSingleTest(true);
  });
  document.getElementById("btnTestSkewed").addEventListener("click", function () {
    runSingleTest(false);
  });
  document.getElementById("btnTestMany").addEventListener("click", runManyTrials);
  document.getElementById("btnTestReset").addEventListener("click", function () {
    document.getElementById("simCollisions").textContent = "0";
    document.getElementById("simThreshold").textContent = "0";
    document.getElementById("simDecision").textContent = "-";
    document.getElementById("simDecision").style.color = "";
    document.getElementById("simAccuracy").textContent = "-";
    document.getElementById("simHistogram").textContent = "";
  });

  // ========== TV DISTANCE INTERACTIVE VISUALIZER ==========
  var TV_K = 8;
  var tvP = [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125];
  var tvQ = [0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125, 0.125];
  var tvDragging = -1;

  function tvNormalize(arr) {
    var s = 0;
    for (var i = 0; i < arr.length; i++) s += arr[i];
    if (s === 0) { for (var i = 0; i < arr.length; i++) arr[i] = 1 / arr.length; return; }
    for (var i = 0; i < arr.length; i++) arr[i] /= s;
  }

  function tvCompute() {
    var tv = 0;
    var scheffeSet = [];
    for (var i = 0; i < TV_K; i++) {
      tv += Math.abs(tvP[i] - tvQ[i]);
      if (tvQ[i] > tvP[i]) scheffeSet.push(i + 1);
    }
    tv *= 0.5;
    return { tv: tv, scheffe: scheffeSet };
  }

  function tvRender() {
    var area = document.getElementById("tvChartArea");
    if (!area) return;
    var W = area.clientWidth - 20;
    var H = area.clientHeight - 38;
    if (W <= 0 || H <= 0) return;

    var maxVal = 0;
    for (var i = 0; i < TV_K; i++) {
      if (tvP[i] > maxVal) maxVal = tvP[i];
      if (tvQ[i] > maxVal) maxVal = tvQ[i];
    }
    maxVal = Math.max(maxVal * 1.15, 0.05);

    var groupW = Math.floor(W / TV_K);
    var barW = Math.floor(groupW * 0.35);
    var gap = Math.max(2, Math.floor(groupW * 0.04));

    var svg = '<svg width="' + W + '" height="' + (H + 22) + '" style="display:block;margin:0 auto;">';

    for (var g = 0; g <= 4; g++) {
      var gy = H - (g / 4) * H;
      svg += '<line x1="0" y1="' + gy + '" x2="' + W + '" y2="' + gy + '" stroke="var(--border)" stroke-dasharray="2,3" opacity="0.5"/>';
      svg += '<text x="2" y="' + (gy - 2) + '" fill="var(--text-dim)" font-size="9">' + (maxVal * g / 4).toFixed(3) + '</text>';
    }

    for (var i = 0; i < TV_K; i++) {
      var x0 = i * groupW + Math.floor(groupW * 0.12);
      var pH = (tvP[i] / maxVal) * H;
      var qH = (tvQ[i] / maxVal) * H;

      var minH = Math.min(pH, qH);
      var maxH = Math.max(pH, qH);
      var diffColor = tvQ[i] > tvP[i] ? "rgba(251,146,60,0.3)" : "rgba(96,165,250,0.3)";
      svg += '<rect x="' + x0 + '" y="' + (H - maxH) + '" width="' + (barW * 2 + gap) + '" height="' + (maxH - minH) + '" fill="' + diffColor + '" rx="2"/>';

      svg += '<rect x="' + x0 + '" y="' + (H - pH) + '" width="' + barW + '" height="' + pH + '" fill="rgba(96,165,250,0.7)" rx="2"/>';
      svg += '<rect class="tvQBar" data-idx="' + i + '" x="' + (x0 + barW + gap) + '" y="' + (H - qH) + '" width="' + barW + '" height="' + qH + '" fill="rgba(251,146,60,0.8)" rx="2" style="cursor:ns-resize;"/>';

      if (tvQ[i] > tvP[i]) {
        svg += '<line x1="' + x0 + '" y1="' + (H + 14) + '" x2="' + (x0 + barW * 2 + gap) + '" y2="' + (H + 14) + '" stroke="var(--yellow)" stroke-width="2.5" stroke-linecap="round"/>';
      }

      svg += '<text x="' + (x0 + barW + gap / 2) + '" y="' + (H + 20) + '" fill="var(--text-muted)" font-size="11" text-anchor="middle">' + (i + 1) + '</text>';
    }
    svg += '</svg>';
    area.innerHTML = svg;

    var res = tvCompute();
    document.getElementById("tvDistVal").textContent = res.tv.toFixed(3);
    document.getElementById("tvScheffeSize").textContent = res.scheffe.length;
    document.getElementById("tvAdvantage").textContent = (res.tv / 2).toFixed(3);
    document.getElementById("tvScheffeSet").textContent = res.scheffe.length > 0 ? "{" + res.scheffe.join(", ") + "}" : "\u2205";

    area.querySelectorAll(".tvQBar").forEach(function (bar) {
      bar.addEventListener("mousedown", function (e) {
        tvDragging = parseInt(bar.getAttribute("data-idx"));
        e.preventDefault();
      });
      bar.addEventListener("touchstart", function (e) {
        tvDragging = parseInt(bar.getAttribute("data-idx"));
        e.preventDefault();
      }, { passive: false });
    });
  }

  function tvHandleMove(clientY) {
    if (tvDragging < 0) return;
    var area = document.getElementById("tvChartArea");
    var rect = area.getBoundingClientRect();
    var H = area.clientHeight - 38;
    var y = clientY - rect.top - 10;
    var maxVal = 0;
    for (var i = 0; i < TV_K; i++) {
      if (tvP[i] > maxVal) maxVal = tvP[i];
      if (tvQ[i] > maxVal) maxVal = tvQ[i];
    }
    maxVal = Math.max(maxVal * 1.15, 0.05);
    var rawVal = ((H - y) / H) * maxVal;
    rawVal = Math.max(0.001, rawVal);
    tvQ[tvDragging] = rawVal;
    tvNormalize(tvQ);
    tvRender();
  }

  document.addEventListener("mousemove", function (e) { tvHandleMove(e.clientY); });
  document.addEventListener("mouseup", function () { tvDragging = -1; });
  document.addEventListener("touchmove", function (e) {
    if (tvDragging >= 0 && e.touches.length > 0) {
      tvHandleMove(e.touches[0].clientY);
      e.preventDefault();
    }
  }, { passive: false });
  document.addEventListener("touchend", function () { tvDragging = -1; });

  var tvPresets = {
    uniform: function () {
      for (var i = 0; i < TV_K; i++) tvQ[i] = 1 / TV_K;
    },
    peaked: function () {
      for (var i = 0; i < TV_K; i++) tvQ[i] = 0.01;
      tvQ[0] = 0.8; tvQ[1] = 0.12;
      tvNormalize(tvQ);
    },
    opposite: function () {
      for (var i = 0; i < TV_K; i++) tvQ[i] = (TV_K - 1 - i) * 0.5 + 0.1;
      tvNormalize(tvQ);
    },
    random: function () {
      for (var i = 0; i < TV_K; i++) tvQ[i] = Math.random() + 0.01;
      tvNormalize(tvQ);
    }
  };

  document.querySelectorAll(".tvPreset").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var preset = btn.getAttribute("data-preset");
      if (tvPresets[preset]) {
        tvPresets[preset]();
        tvRender();
      }
    });
  });

  tvP = [0.10, 0.15, 0.12, 0.13, 0.10, 0.14, 0.11, 0.15];
  tvNormalize(tvP);
  tvNormalize(tvQ);
  tvRender();
  window.addEventListener("resize", tvRender);

})();
