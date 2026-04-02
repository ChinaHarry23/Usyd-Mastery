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

  // ========== HELPER: harmonic number ==========
  function harmonicNumber(n) {
    var h = 0;
    for (var k = 1; k <= n; k++) h += 1 / k;
    return h;
  }

  // ========== BIRTHDAY PARADOX SIMULATION ==========
  var bdayTrials = 0, bdayCollisions = 0;
  var sliderBday = document.getElementById("sliderBday");
  document.getElementById("valBday").textContent = sliderBday.value;
  sliderBday.addEventListener("input", function () {
    document.getElementById("valBday").textContent = sliderBday.value;
  });

  function birthdayExactProb(m, n) {
    var prob = 1;
    for (var i = 0; i < m; i++) {
      prob *= (n - i) / n;
    }
    return 1 - prob;
  }

  function runBdayTrial() {
    var m = parseInt(sliderBday.value);
    var n = 365;
    var seen = new Set();
    var collision = false;
    for (var i = 0; i < m; i++) {
      var day = Math.floor(Math.random() * n);
      if (seen.has(day)) { collision = true; break; }
      seen.add(day);
    }
    bdayTrials++;
    if (collision) bdayCollisions++;
    updateBdayStats(collision);
  }

  function updateBdayStats(lastCollision) {
    var zh = typeof getLang === "function" && getLang() === "zh";
    document.getElementById("bdayLast").textContent = lastCollision
      ? (zh ? "碰撞!" : "Collision!")
      : (zh ? "无碰撞" : "No collision");
    document.getElementById("bdayLast").style.color = lastCollision ? "var(--red)" : "var(--green)";
    document.getElementById("bdayTrials").textContent = bdayTrials;
    document.getElementById("bdayCollisions").textContent = bdayCollisions;
    document.getElementById("bdayRate").textContent =
      (bdayCollisions / bdayTrials * 100).toFixed(1) + "%";
    var m = parseInt(sliderBday.value);
    document.getElementById("bdayTheory").textContent =
      (birthdayExactProb(m, 365) * 100).toFixed(1) + "%";
  }

  document.getElementById("btnRunBday").addEventListener("click", runBdayTrial);

  document.getElementById("btnRunBday1000").addEventListener("click", function () {
    for (var i = 0; i < 1000; i++) runBdayTrial();
  });

  document.getElementById("btnResetBday").addEventListener("click", function () {
    bdayTrials = 0;
    bdayCollisions = 0;
    document.getElementById("bdayLast").textContent = "-";
    document.getElementById("bdayLast").style.color = "";
    document.getElementById("bdayTrials").textContent = "0";
    document.getElementById("bdayCollisions").textContent = "0";
    document.getElementById("bdayRate").textContent = "-";
    document.getElementById("bdayTheory").textContent = "-";
  });

  // ========== COUPON COLLECTOR SIMULATION ==========
  var couponTrials = 0, couponTotal = 0;
  var sliderCoupon = document.getElementById("sliderCoupon");
  document.getElementById("valCoupon").textContent = sliderCoupon.value;
  sliderCoupon.addEventListener("input", function () {
    document.getElementById("valCoupon").textContent = sliderCoupon.value;
  });

  function runCouponTrial() {
    var n = parseInt(sliderCoupon.value);
    var covered = new Set();
    var balls = 0;
    while (covered.size < n) {
      covered.add(Math.floor(Math.random() * n));
      balls++;
    }
    couponTrials++;
    couponTotal += balls;
    updateCouponStats(balls, n);
    return balls;
  }

  function updateCouponStats(lastResult, n) {
    document.getElementById("couponLast").textContent = lastResult;
    document.getElementById("couponTrials").textContent = couponTrials;
    document.getElementById("couponAvg").textContent =
      (couponTotal / couponTrials).toFixed(1);
    document.getElementById("couponTheory").textContent =
      (n * harmonicNumber(n)).toFixed(1);
  }

  document.getElementById("btnRunCoupon").addEventListener("click", function () {
    runCouponTrial();
  });

  document.getElementById("btnRunCoupon100").addEventListener("click", function () {
    var n = parseInt(sliderCoupon.value);
    for (var i = 0; i < 100; i++) runCouponTrial();
  });

  document.getElementById("btnResetCoupon").addEventListener("click", function () {
    couponTrials = 0;
    couponTotal = 0;
    document.getElementById("couponLast").textContent = "-";
    document.getElementById("couponTrials").textContent = "0";
    document.getElementById("couponAvg").textContent = "-";
    document.getElementById("couponTheory").textContent = "-";
  });

  // ========== LOAD BALANCING SIMULATION ==========
  var loadTrials = 0, loadTotalMax = 0;
  var sliderLoad = document.getElementById("sliderLoad");
  document.getElementById("valLoad").textContent = sliderLoad.value;
  sliderLoad.addEventListener("input", function () {
    document.getElementById("valLoad").textContent = sliderLoad.value;
  });

  function runLoadTrial() {
    var n = parseInt(sliderLoad.value);
    var bins = new Array(n).fill(0);
    for (var i = 0; i < n; i++) {
      bins[Math.floor(Math.random() * n)]++;
    }
    var maxLoad = 0;
    for (var j = 0; j < n; j++) {
      if (bins[j] > maxLoad) maxLoad = bins[j];
    }
    loadTrials++;
    loadTotalMax += maxLoad;
    updateLoadStats(maxLoad, n);
    return maxLoad;
  }

  function updateLoadStats(lastMax, n) {
    document.getElementById("loadMax").textContent = lastMax;
    document.getElementById("loadTrials").textContent = loadTrials;
    document.getElementById("loadAvg").textContent =
      (loadTotalMax / loadTrials).toFixed(2);
    var logn = Math.log(n);
    var loglogn = Math.log(logn);
    var bound = loglogn > 0 ? (2 * logn / loglogn).toFixed(2) : "-";
    document.getElementById("loadTheory").textContent = bound;
  }

  document.getElementById("btnRunLoad").addEventListener("click", function () {
    runLoadTrial();
  });

  document.getElementById("btnRunLoad100").addEventListener("click", function () {
    for (var i = 0; i < 100; i++) runLoadTrial();
  });

  document.getElementById("btnResetLoad").addEventListener("click", function () {
    loadTrials = 0;
    loadTotalMax = 0;
    document.getElementById("loadMax").textContent = "-";
    document.getElementById("loadTrials").textContent = "0";
    document.getElementById("loadAvg").textContent = "-";
    document.getElementById("loadTheory").textContent = "-";
  });

  // ========== TWO CHOICES SIMULATION ==========
  var sliderTwoChoice = document.getElementById("sliderTwoChoice");
  document.getElementById("valTwoChoice").textContent = sliderTwoChoice.value;
  sliderTwoChoice.addEventListener("input", function () {
    document.getElementById("valTwoChoice").textContent = sliderTwoChoice.value;
  });

  document.getElementById("btnRunTwoChoice").addEventListener("click", function () {
    var n = parseInt(sliderTwoChoice.value);

    // Uniform allocation
    var binsU = new Array(n).fill(0);
    for (var i = 0; i < n; i++) {
      binsU[Math.floor(Math.random() * n)]++;
    }
    var maxU = 0;
    for (var j = 0; j < n; j++) {
      if (binsU[j] > maxU) maxU = binsU[j];
    }

    // Two-choices allocation
    var binsT = new Array(n).fill(0);
    for (var i = 0; i < n; i++) {
      var a = Math.floor(Math.random() * n);
      var b = Math.floor(Math.random() * n);
      if (binsT[a] <= binsT[b]) {
        binsT[a]++;
      } else {
        binsT[b]++;
      }
    }
    var maxT = 0;
    for (var j = 0; j < n; j++) {
      if (binsT[j] > maxT) maxT = binsT[j];
    }

    document.getElementById("tcUniform").textContent = maxU;
    document.getElementById("tcTwoChoice").textContent = maxT;
    var improvement = maxT > 0 ? (maxU / maxT).toFixed(2) + "x" : "-";
    document.getElementById("tcImprovement").textContent = improvement;
  });

renderMath();
})();
