(function () {
  "use strict";
  if (window.__usydScrollAnimInit) return;
  window.__usydScrollAnimInit = true;

  var targets =
    ".kp-list > li, .formula-block, .concept-box, .quick-check, .problem-card, .def-box, .step-anim .step, .diagram-flow .flow-node, .diagram-flow .flow-arrow, .math-section, .recall-prompt, .callout";
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function reveal(el) {
    el.classList.add("anim-visible");
    el.classList.remove("anim-hidden");
  }

  function init() {
    var nodes = document.querySelectorAll(targets);
    if (!nodes.length) return;
    if (reduceMotion || typeof IntersectionObserver !== "function") {
      nodes.forEach(reveal);
      return;
    }

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          var delay = el.dataset.delay ? parseFloat(el.dataset.delay) : 0;
          var idx = el.dataset.idx ? parseInt(el.dataset.idx, 10) : 0;
          var totalDelay = delay + idx * 70;
          setTimeout(function () {
            reveal(el);
          }, totalDelay);
          obs.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.04 }
    );

    nodes.forEach(function (el) {
      if (el.classList.contains("anim-visible")) return;
      var existingAnim = window.getComputedStyle(el).animationName;
      if (existingAnim && existingAnim !== "none") return;
      var rect = el.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        reveal(el);
        return;
      }
      el.classList.add("anim-hidden");
      var parent = el.parentElement;
      if (parent) {
        var sibs = parent.querySelectorAll(":scope > " + el.tagName.toLowerCase());
        var sibIdx = Array.prototype.indexOf.call(sibs, el);
        if (sibIdx >= 0) el.dataset.idx = String(sibIdx);
      }
      obs.observe(el);
    });

    setTimeout(function () {
      document.querySelectorAll(".anim-hidden").forEach(reveal);
    }, 2500);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
