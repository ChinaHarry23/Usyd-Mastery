/**
 * COMP5618 — chapter page chrome (sidebar, quick checks, toggles).
 *
 * Tracking lives in ../../shared/progress-tracker.js; this module owns presentation
 * only, so the chapter HTML stays declarative.
 */
(function () {
  "use strict";

  function initSidebar() {
    var toggle = document.getElementById("sidebarToggle");
    var sidebar = document.getElementById("sidebar");
    if (!toggle || !sidebar) return;
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

  function initActiveNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-link, .toc-link"));
    if (!links.length) return;

    var linkMap = links
      .map(function (link) {
        var href = link.getAttribute("href") || "";
        if (href.charAt(0) !== "#") return null;
        var section = document.querySelector(href);
        if (!section) return null;
        return { link: link, section: section };
      })
      .filter(Boolean);

    if (!linkMap.length) return;

    function setActive(id) {
      linkMap.forEach(function (entry) {
        entry.link.classList.toggle("active", "#" + entry.section.id === id);
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) setActive("#" + entry.target.id);
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    linkMap.forEach(function (entry) {
      observer.observe(entry.section);
    });
  }

  function initProofToggles() {
    document.querySelectorAll(".proof-toggle").forEach(function (button) {
      button.addEventListener("click", function () {
        var targetId = button.getAttribute("data-target");
        var content = targetId
          ? document.getElementById(targetId)
          : button.nextElementSibling;
        if (!content) return;
        button.classList.toggle("open");
        content.classList.toggle("open");
      });
    });
  }

  function initSolutionToggles() {
    document.querySelectorAll(".solution-toggle").forEach(function (button) {
      button.addEventListener("click", function () {
        var targetId = button.getAttribute("data-target");
        var content = targetId ? document.getElementById(targetId) : null;
        if (!content) return;
        content.classList.toggle("open");
        button.textContent = content.classList.contains("open")
          ? "Hide solution"
          : "Show solution";
      });
    });
  }

  function initQuickChecks() {
    document.querySelectorAll(".quick-check").forEach(function (check) {
      var feedback = check.querySelector(".qc-feedback");
      check.querySelectorAll(".qc-opt").forEach(function (option) {
        option.addEventListener("click", function () {
          if (option.classList.contains("chosen")) return;
          var correct = option.getAttribute("data-correct") === "true";
          check.querySelectorAll(".qc-opt").forEach(function (node) {
            node.classList.add("chosen");
            if (node.getAttribute("data-correct") === "true") node.classList.add("right");
            else node.classList.add("not-right");
          });
          if (!feedback) return;
          feedback.classList.add("show");
          feedback.classList.add(correct ? "correct-fb" : "wrong-fb");
          feedback.textContent =
            option.getAttribute(correct ? "data-good" : "data-bad") || "";
        });
      });
    });
  }

  window.initCOMP5618ChapterUI = function () {
    initSidebar();
    initActiveNav();
    initProofToggles();
    initSolutionToggles();
    initQuickChecks();
  };
})();
