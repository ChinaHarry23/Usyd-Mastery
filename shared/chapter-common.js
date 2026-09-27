/**
 * Chapter Common — shared boilerplate for all chapter study pages.
 *
 * Handles: KaTeX math rendering, sidebar toggle, scroll-spy with progress bar,
 * proof toggles, solution toggles, tab switching, toolkit flip-cards, and
 * initial renderMath scheduling.
 *
 * Exposes window.chapterRenderMath so chapter-specific scripts can re-render
 * math after dynamic DOM updates (e.g. simulator output).
 *
 * Load this script BEFORE the chapter-specific script.
 */
(function () {
  "use strict";
  if (window.__usydChapterCommonInit) return;
  window.__usydChapterCommonInit = true;

  // ========== MATH RENDERING ==========
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
  if (sidebar && sidebarToggle && !sidebarToggle.dataset.bound) {
    sidebarToggle.dataset.bound = "1";
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("open");
    });
    var mainContent = document.getElementById("mainContent");
    if (mainContent) {
      mainContent.addEventListener("click", function () {
        if (sidebar.classList.contains("open")) sidebar.classList.remove("open");
      });
    }
  }

  // ========== SCROLL SPY & PROGRESS ==========
  var sections = document.querySelectorAll(".section[data-track]");
  var navLinks = document.querySelectorAll(".nav-link");
  var visited = new Set();

  function updateProgress() {
    visited.add("hero");
    var pct = sections.length > 0 ? (visited.size / sections.length) * 100 : 0;
    var fill = document.getElementById("progressFill");
    var txt = document.getElementById("progressText");
    if (fill) fill.style.width = pct + "%";
    if (txt) txt.textContent = visited.size + " / " + sections.length;
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
    { rootMargin: "-12% 0px -45% 0px", threshold: [0, 0.15, 0.4] }
  );
  sections.forEach(function (s) {
    observer.observe(s);
  });
  navLinks.forEach(function (l) {
    l.addEventListener("click", function () {
      var href = l.getAttribute("href") || "";
      if (href.charAt(0) !== "#") return;
      var sec = document.getElementById(href.slice(1));
      if (!sec || !sec.dataset.track) return;
      visited.add(sec.dataset.track);
      updateProgress();
    });
  });

  // ========== PROOF TOGGLES ==========
  document.querySelectorAll(".proof-toggle").forEach(function (btn) {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.dataset.target);
      if (!target) return;
      var isOpen = target.classList.contains("open");
      target.classList.toggle("open");
      btn.classList.toggle("open");
      if (!isOpen) renderMath();
    });
  });

  // ========== SOLUTION TOGGLES ==========
  document.querySelectorAll(".solution-toggle").forEach(function (btn) {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", function () {
      var target = document.getElementById(btn.dataset.target);
      if (!target) return;
      var isOpen = target.classList.contains("open");
      target.classList.toggle("open");
      var zh = typeof getLang === "function" && getLang() === "zh";
      btn.textContent = isOpen
        ? zh ? "\u67e5\u770b\u89e3\u7b54" : "Show Solution"
        : zh ? "\u9690\u85cf\u89e3\u7b54" : "Hide Solution";
      if (!isOpen) renderMath();
    });
  });

  // ========== TABS ==========
  document.querySelectorAll(".tab-btn").forEach(function (btn) {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", function () {
      var parent = btn.closest(".interactive-compare, .compare-tabs");
      if (!parent) return;
      if (parent.classList.contains("compare-tabs")) {
        parent = parent.parentElement;
      }
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

  // ========== TOOLKIT FLIP CARDS ==========
  document.querySelectorAll(".toolkit-card").forEach(function (card) {
    card.addEventListener("click", function () {
      card.classList.toggle("flipped");
      renderMath();
    });
  });

  // ========== CARD HOVER SPOTLIGHT ==========
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function attachSurface(el) {
    if (!el || el.dataset.surfaceBound) return;
    el.dataset.surfaceBound = "1";
    el.classList.add("interactive-surface");
    if (reduceMotion) return;
    el.addEventListener("mousemove", function (ev) {
      var rect = el.getBoundingClientRect();
      var x = ((ev.clientX - rect.left) / rect.width) * 100;
      var y = ((ev.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty("--spot-x", x + "%");
      el.style.setProperty("--spot-y", y + "%");
      el.classList.add("is-hovered");
    });
    el.addEventListener("mouseleave", function () {
      el.classList.remove("is-hovered");
      el.style.removeProperty("--spot-x");
      el.style.removeProperty("--spot-y");
    });
  }
  document
    .querySelectorAll(".hero-card, .glance-card, .flow-step, .metric-card, .col-card, .quick-check, .problem-card, .algo-card, .concept-box, .callout")
    .forEach(attachSurface);

  // ========== INITIAL RENDER ==========
  updateProgress();
  window.addEventListener("load", renderMath);
  setTimeout(renderMath, 500);
  setTimeout(renderMath, 1500);

  // Expose for chapter-specific scripts
  window.chapterRenderMath = renderMath;
})();
