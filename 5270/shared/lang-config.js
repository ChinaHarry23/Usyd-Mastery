/**
 * COMP5270 — Language toggle configuration adapter.
 * Bridges the existing translations.js selector arrays to the universal
 * lang-toggle module via LANG_CONFIG.selectorTranslations.
 *
 * Load order: translations.js → lang-config.js → ../../shared/lang-toggle.js
 */
(function () {
  "use strict";

  var path = location.pathname;
  var isMath = path.indexOf("math") !== -1;
  var m = path.match(/chapter(\d+)/);
  var ch = m ? parseInt(m[1], 10) : 1;

  var varName = (isMath ? "MATH" : "STUDY") + (ch === 1 ? "" : ch) + "_T";
  var T = window[varName];

  var arrays = [];
  if (T) arrays.push(T);

  if (!isMath) {
    if (typeof QHUB_NAV_T !== "undefined") arrays.push(QHUB_NAV_T);
    if (typeof QHUB_STUDY_T !== "undefined" && document.getElementById("quizHubCalloutTitle")) {
      arrays.push(QHUB_STUDY_T);
    }
  } else {
    if (typeof QHUB_MATH_T !== "undefined" && document.getElementById("mathQuizHubCalloutTitle")) {
      arrays.push(QHUB_MATH_T);
    }
  }

  window.LANG_CONFIG = {
    storageKey: "comp5270_lang",
    selectorTranslations: arrays
  };

  /* Knowledge-graph highlight (from=kg query param) — 5270-specific feature */
  if (location.search.indexOf("from=kg") !== -1 && location.hash) {
    window.addEventListener("load", function () {
      var targetId = location.hash.replace("#", "");
      var target = document.getElementById(targetId);
      if (target) {
        setTimeout(function () {
          target.classList.add("kg-highlight");
          target.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(function () {
            target.classList.remove("kg-highlight");
          }, 5000);
        }, 600);
      }
    });
  }
})();
