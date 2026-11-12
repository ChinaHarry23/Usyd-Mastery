(function () {
  "use strict";
  var targets = ".kp-list > li, .formula-block, .concept-box, .quick-check, .problem-card, .def-box, .step-anim .step, .diagram-flow .flow-node, .diagram-flow .flow-arrow, .math-section, .recall-prompt";
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var el = e.target;
        var delay = el.dataset.delay ? parseFloat(el.dataset.delay) : 0;
        var idx = el.dataset.idx ? parseInt(el.dataset.idx, 10) : 0;
        var totalDelay = delay + idx * 80;
        setTimeout(function () { el.classList.add("anim-visible"); }, totalDelay);
        obs.unobserve(el);
      }
    });
  }, { rootMargin: "0px 0px -60px 0px", threshold: 0.08 });

  function init() {
    document.querySelectorAll(targets).forEach(function (el, i) {
      if (!el.classList.contains("anim-visible")) {
        el.classList.add("anim-hidden");
        var parent = el.parentElement;
        if (parent) {
          var siblings = parent.querySelectorAll(":scope > " + el.tagName.toLowerCase());
          var sibIdx = Array.prototype.indexOf.call(siblings, el);
          if (sibIdx >= 0) el.dataset.idx = sibIdx;
        }
        obs.observe(el);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
