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
  var toggle = document.getElementById("sidebarToggle");
  if (sidebar && toggle) {
    toggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });
    var main = document.getElementById("mainContent");
    if (main) {
      main.addEventListener("click", function () {
        if (sidebar.classList.contains("open")) sidebar.classList.remove("open");
      });
    }
  }

  var sections = document.querySelectorAll(".section[data-track]");
  var navLinks = document.querySelectorAll(".nav-link");
  var visited = new Set();
  var mainEl = document.getElementById("mainContent");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var chapterMatch = location.pathname.match(/chapter(\d+)/);
  var chapterNumber = chapterMatch ? parseInt(chapterMatch[1], 10) : null;
  var chapterKey = chapterNumber ? "ch" + chapterNumber : null;

  function attachSurface(el) {
    if (!el || el.dataset.surfaceBound) return;
    el.dataset.surfaceBound = "1";
    el.classList.add("interactive-surface");
    if (reduceMotion) return;
    el.addEventListener("mousemove", function(ev) {
      var rect = el.getBoundingClientRect();
      var x = ((ev.clientX - rect.left) / rect.width) * 100;
      var y = ((ev.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--spot-x", x + "%");
      el.style.setProperty("--spot-y", y + "%");
      el.classList.add("is-hovered");
    });
    el.addEventListener("mouseleave", function() {
      el.classList.remove("is-hovered");
      el.style.removeProperty("--spot-x");
      el.style.removeProperty("--spot-y");
    });
  }
  function bindSurfaces() {
    document
      .querySelectorAll(".hero-card, .glance-card, .flow-step, .metric-card, .col-card, .quick-check, .problem-card, .algo-card, .sim-container, .quiz-question")
      .forEach(attachSurface);
  }

  function getQcTotals() {
    if (!mainEl) return { study: 0, math: 0 };
    var s = parseInt(mainEl.getAttribute("data-progress-study-qc") || "0", 10);
    var m = parseInt(mainEl.getAttribute("data-progress-math-qc") || "0", 10);
    return { study: isNaN(s) ? 0 : s, math: isNaN(m) ? 0 : m };
  }

  function getStoredChapterData() {
    if (!chapterKey) return {};
    try {
      var raw = localStorage.getItem("comp9123_progress");
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed[chapterKey] || {};
    } catch (e) {
      return {};
    }
  }

  function countTrue(obj) {
    if (!obj || typeof obj !== "object") return 0;
    var n = 0;
    Object.keys(obj).forEach(function(k) {
      if (obj[k] === true) n += 1;
    });
    return n;
  }

  function ensureMissionStrip() {
    var heroInner = document.querySelector(".hero-inner");
    if (!heroInner) return null;
    var existing = heroInner.querySelector(".hero-mission-strip");
    if (existing) return existing;
    var strip = document.createElement("div");
    strip.className = "hero-mission-strip";
    strip.innerHTML =
      '<div class="hero-mission-chip"><span class="label"></span><strong></strong><p></p></div>' +
      '<div class="hero-mission-chip"><span class="label"></span><strong></strong><p></p></div>' +
      '<div class="hero-mission-chip"><span class="label"></span><strong></strong><p></p></div>' +
      '<div class="hero-mission-chip"><span class="label"></span><strong></strong><p></p></div>';
    var chipList = heroInner.querySelector(".chip-list");
    if (chipList && chipList.parentNode) chipList.parentNode.insertBefore(strip, chipList.nextSibling);
    else heroInner.appendChild(strip);
    return strip;
  }

  function updateMissionStrip() {
    var strip = ensureMissionStrip();
    if (!strip) return;
    var zh = typeof getLang === "function" && getLang() === "zh";
    var qcT = getQcTotals();
    var data = getStoredChapterData();
    var checksDone = (data.quickChecksStudy || 0) + (data.quickChecksMath || 0);
    if (checksDone === 0 && (data.quickChecks || 0) > 0) checksDone = data.quickChecks;
    var tutorialDone = countTrue(data.tutorials);
    var tutorialTotal = document.querySelectorAll(".solution-toggle").length || 1;
    var quizBest = data.quizBest != null ? data.quizBest + "%" : (zh ? "未测" : "Not yet");
    var items = [
      {
        label: zh ? "章节" : "Sections",
        value: visited.size + " / " + sections.length,
        note: zh ? "已访问内容块" : "content visited"
      },
      {
        label: zh ? "检查" : "Checks",
        value: Math.min(checksDone, qcT.study + qcT.math) + " / " + (qcT.study + qcT.math),
        note: zh ? "快速检查完成" : "quick checks done"
      },
      {
        label: zh ? "测验最佳" : "Quiz best",
        value: quizBest,
        note: zh ? "当前最好成绩" : "best score so far"
      },
      {
        label: zh ? "教程题" : "Tutorial",
        value: tutorialDone + " / " + tutorialTotal,
        note: zh ? "是否真正理解解答" : "solution confidence"
      }
    ];
    strip.querySelectorAll(".hero-mission-chip").forEach(function(chip, idx) {
      var item = items[idx];
      if (!item) return;
      var label = chip.querySelector(".label");
      var value = chip.querySelector("strong");
      var note = chip.querySelector("p");
      if (label) label.textContent = item.label;
      if (value) value.textContent = item.value;
      if (note) note.textContent = item.note;
    });
  }

  function updateProgress() {
    var total = sections.length;
    visited.add("hero");
    var fill = document.getElementById("progressFill");
    var txt = document.getElementById("progressText");
    var qcT = getQcTotals();
    var qcDenom = qcT.study + qcT.math;
    var qs = 0;
    var qm = 0;
    var pct;
    var label;
    if (qcDenom > 0) {
      var denom = total + qcDenom;
      var num = visited.size + Math.min(qs, qcT.study) + Math.min(qm, qcT.math);
      pct = denom > 0 ? (num / denom) * 100 : 0;
      var zh = typeof getLang === "function" && getLang() === "zh";
      label =
        visited.size +
        " / " +
        total +
        (zh
          ? " · 小测 "
          : " · checks ") +
        (Math.min(qs, qcT.study) + Math.min(qm, qcT.math)) +
        " / " +
        qcDenom;
    } else {
      pct = total > 0 ? (visited.size / total) * 100 : 0;
      label = visited.size + " / " + total;
    }
    if (fill) fill.style.width = pct + "%";
    if (txt) txt.textContent = label;
    updateMissionStrip();
  }

  window.refreshChapterStudyProgress = updateProgress;

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

  function bindObservedSections() {
    sections = document.querySelectorAll(".section[data-track]");
    navLinks = document.querySelectorAll(".nav-link");
    observer.disconnect();
    sections.forEach(function (s) {
      observer.observe(s);
    });
  }

  function bindProofToggles() {
    document.querySelectorAll(".proof-toggle").forEach(function (btn) {
      if (btn.dataset.boundProof) return;
      btn.dataset.boundProof = "1";
      btn.addEventListener("click", function () {
        var target = document.getElementById(btn.dataset.target);
        if (!target) return;
        var isOpen = target.classList.contains("open");
        target.classList.toggle("open");
        btn.classList.toggle("open");
        if (!isOpen) renderMath();
      });
    });
  }

  function bindSolutionToggles() {
    document.querySelectorAll(".solution-toggle").forEach(function (btn) {
      if (btn.dataset.boundSolution) return;
      btn.dataset.boundSolution = "1";
      btn.addEventListener("click", function () {
        var target = document.getElementById(btn.dataset.target);
        if (!target) return;
        var isOpen = target.classList.contains("open");
        target.classList.toggle("open");
        var zh = typeof getLang === "function" && getLang() === "zh";
        btn.textContent = isOpen
          ? zh
            ? "查看解答"
            : "Show Solution"
          : zh
            ? "隐藏解答"
            : "Hide Solution";
        if (!isOpen) renderMath();
      });
    });
  }

  function bindTabs() {
    document.querySelectorAll(".tab-btn").forEach(function (btn) {
      if (btn.dataset.boundTab) return;
      btn.dataset.boundTab = "1";
      btn.addEventListener("click", function () {
        var parent = btn.closest(".interactive-compare");
        if (!parent) return;
        parent.querySelectorAll(".tab-btn").forEach(function (b) {
          b.classList.remove("active");
        });
        parent.querySelectorAll(".tab-content").forEach(function (c) {
          c.classList.remove("active");
        });
        btn.classList.add("active");
        var tab = document.getElementById(btn.dataset.tab);
        if (tab) tab.classList.add("active");
        renderMath();
      });
    });
  }

  function bindToolkitCards() {
    document.querySelectorAll(".toolkit-card").forEach(function (card) {
      if (card.dataset.boundToolkit) return;
      card.dataset.boundToolkit = "1";
      card.addEventListener("click", function () {
        card.classList.toggle("flipped");
        renderMath();
      });
    });
  }

  function bindDynamicContent() {
    bindSurfaces();
    bindObservedSections();
    bindProofToggles();
    bindSolutionToggles();
    bindTabs();
    bindToolkitCards();
  }

  bindDynamicContent();
  updateProgress();
  window.addEventListener("langchange", updateProgress);
  window.addEventListener("load", renderMath);
  setTimeout(renderMath, 400);
  setTimeout(renderMath, 1200);
})();
